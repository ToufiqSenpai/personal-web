import { z } from 'zod'
import { COMMON_IMAGE_MIMETYPES } from '@/constants/mimetype'
import type { GlobalConfig, CollectionConfig } from 'payload'
import { revalidateProfileCache } from '@/hooks/revalidateCache'

export const Profile: GlobalConfig = {
  slug: 'profile',
  admin: {
    group: 'Profile',
  },
  hooks: {
    afterChange: [revalidateProfileCache],
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
      relationTo: 'profile-avatar',
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
          relationTo: 'profile-icons',
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
            condition: (data, siblingData) => !siblingData?.present,
          },
          validate: (val: unknown, { siblingData }: any) => {
            if (!siblingData?.present && !val) {
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
          relationTo: 'hobbies-media',
          required: true,
        },
      ],
    },
  ],
}

export const ProfileAvatar: CollectionConfig = {
  slug: 'profile-avatar',
  admin: {
    group: 'Profile',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
  upload: {
    staticDir: 'profile-avatar',
    mimeTypes: COMMON_IMAGE_MIMETYPES,
    formatOptions: {
      format: 'avif',
      options: {
        quality: 80,
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
        position: 'centre',
      },
      {
        name: 'medium',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'large',
        width: 800,
        height: 800,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
}

export const ProfileIcons: CollectionConfig = {
  slug: 'profile-icons',
  admin: {
    group: 'Profile',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
  upload: {
    staticDir: 'profile-icons',
    mimeTypes: ['image/svg+xml'],
  },
}

export const HobbiesMedia: CollectionConfig = {
  slug: 'hobbies-media',
  admin: {
    group: 'Profile',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
  upload: {
    staticDir: 'hobbies-media',
    mimeTypes: COMMON_IMAGE_MIMETYPES,
    formatOptions: {
      format: 'avif',
      options: {
        quality: 80,
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
      },
      {
        name: 'medium',
        width: 400,
      },
      {
        name: 'large',
        width: 800,
      },
    ],
    adminThumbnail: 'thumbnail',
  },
}
