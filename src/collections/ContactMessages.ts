import React from 'react'
import { render } from '@react-email/render'
import { APIError, CollectionConfig } from 'payload'
import { env } from '../configs/env'
import { ContactEmail } from '../emails/ContactEmail'
import { consumeRateLimit, resolveClientIp } from '../lib/rate-limit'
import { verifyTurnstileToken } from '../lib/turnstile'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['name', 'email', 'subject', 'createdAt'],
    group: 'Contact',
  },
  access: {
    create: () => true, // Allow anyone to submit via contact form
    read: ({ req: { user } }) => !!user, // Only authenticated admin users can read
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data

        const clientIp = resolveClientIp(req)

        // Validate the CAPTCHA before recording an attempt, so a bad token never
        // burns the visitor's quota.
        const token = data._turnstileToken as string | undefined
        if (!token) {
          throw new APIError('Captcha verification is required.', 400)
        }

        const result = await verifyTurnstileToken(token, clientIp)
        if (!result.success) {
          throw new APIError('Captcha verification failed.', 400)
        }

        // Remove token before saving to DB
        delete data._turnstileToken

        let allowed: boolean
        try {
          allowed = await consumeRateLimit(req.payload, clientIp)
        } catch (error) {
          // Storage is down. Fail closed so an outage cannot turn the contact
          // endpoint into an open spam relay.
          req.payload.logger.error(`Contact rate limit storage unavailable: ${String(error)}`)
          throw new APIError('Too many submissions. Please try again later.', 429)
        }

        if (!allowed) {
          throw new APIError('Too many submissions. Please try again later.', 429)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          const emailTo = env.CONTACT_EMAIL_TO
          const emailFrom = env.CONTACT_EMAIL_FROM || 'onboarding@resend.dev'

          if (!emailTo) {
            req.payload.logger.warn(
              'CONTACT_EMAIL_TO environment variable is not set. Skipping contact email notification.',
            )
            return
          }

          try {
            const html = await render(
              React.createElement(ContactEmail, {
                name: doc.name,
                email: doc.email,
                subject: doc.subject,
                message: doc.message,
              }),
            )

            await req.payload.sendEmail({
              from: emailFrom,
              to: emailTo,
              subject: `New Message: ${doc.subject}`,
              html,
            })
            req.payload.logger.info(`Contact email notification sent successfully to ${emailTo}.`)
          } catch (err) {
            req.payload.logger.error(`Error sending contact email notification: ${String(err)}`)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'readAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
