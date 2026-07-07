import { CollectionConfig, Block } from 'payload'
import { lexicalEditor, BlocksFeature, UploadFeature } from '@payloadcms/richtext-lexical'
import { COMMON_IMAGE_MIMETYPES } from '@/constants/mimetype'
import { revalidateFeedsCache, revalidateFeedsDeleteCache } from '@/hooks/revalidateCache'

export const FeedsMedia: CollectionConfig = {
  slug: 'feeds-media',
  admin: {
    group: 'Feeds',
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
    staticDir: 'feeds-media',
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
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1024,
        height: 1024,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
}

const EmbedBlock: Block = {
  slug: 'embed',
  fields: [
    {
      name: 'html',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
      },
    },
  ],
}

export const Feeds: CollectionConfig = {
  slug: 'feeds',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'createdAt'],
    group: 'Feeds',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateFeedsCache],
    afterDelete: [revalidateFeedsDeleteCache],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'feeds-media',
      required: false,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [EmbedBlock],
          }),
          UploadFeature({
            collections: {
              'feeds-media': {
                fields: [
                  {
                    name: 'caption',
                    type: 'text',
                  }
                ],
              },
            },
          }),
        ],
      }),
    },
  ],
  timestamps: true,
}
