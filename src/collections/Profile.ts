import type { GlobalConfig } from 'payload'
import { z } from 'zod'

export const Profile: GlobalConfig = {
  slug: 'profile',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Profile',
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
      name: 'avatar',
      type: 'upload',
      required: true,
      relationTo: 'media',
    },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'roles',
      type: 'array',
      required: true,
      localized: true,
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'languages',
      type: 'array',
      required: true,
      localized: true,
      fields: [
        {
          name: 'language',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
          validate: (val: unknown) => {
            const result = z
              .url({
                protocol: /^https:?$/,
                error: 'URL must use HTTPS protocol',
              })
              .safeParse(val)
            if (!result.success) {
              return result.error.message
            }
            return true
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {},
        },
      ],
    },

    {
      name: 'timelines',
      type: 'array',
      required: true,
      localized: true,
      fields: [
        {
          name: 'yearStart',
          type: 'number',
          required: true,
        },
        {
          name: 'yearEnd',
          type: 'number',
          admin: {
            condition: (data, siblingData) => !siblingData.present,
          },
          validate: (val: unknown, { siblingData }: { siblingData: { present?: boolean } }) => {
            if (!siblingData.present && !val) {
              return 'Year end is required if this is not your current / present journey.'
            }
            return true
          },
        },
        {
          name: 'present',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'institution',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'hobbies',
      type: 'array',
      required: true,
      localized: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
