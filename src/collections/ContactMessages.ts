import { CollectionConfig } from 'payload'
import { render } from '@react-email/render'
import { ContactEmail } from '../emails/ContactEmail'
import { env } from '../configs/env'
import React from 'react'

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
