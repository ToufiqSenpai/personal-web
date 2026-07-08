import { APIError, CollectionConfig } from 'payload'
import { render } from '@react-email/render'
import { ContactEmail } from '../emails/ContactEmail'
import { env } from '../configs/env'
import { verifyTurnstileToken } from '../lib/turnstile'
import React from 'react'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

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
        if (operation !== 'create' || !data) return data

        const clientIp =
          req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          req.headers.get('x-real-ip') ||
          'unknown'

        // Rate limiting
        const entry = rateLimitMap.get(clientIp)
        if (entry) {
          if (Date.now() > entry.resetAt) {
            entry.count = 0
            entry.resetAt = Date.now() + RATE_LIMIT_WINDOW_MS
          }
          if (entry.count >= RATE_LIMIT_MAX) {
            throw new APIError('Too many submissions. Please try again later.', 429)
          }
          entry.count++
        } else {
          rateLimitMap.set(clientIp, { count: 1, resetAt: Date.now() + RATE_LIMIT_WINDOW_MS })
        }

        // Turnstile CAPTCHA validation
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
              'CONTACT_EMAIL_TO environment variable is not set. Skipping contact email notification.'
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
              })
            )

            await req.payload.sendEmail({
              from: emailFrom,
              to: emailTo,
              subject: `New Message: ${doc.subject}`,
              html,
            })
            req.payload.logger.info(`Contact email notification sent successfully to ${emailTo}.`)
          } catch (err) {
            req.payload.logger.error(`Error sending contact email notification: ${err}`)
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
