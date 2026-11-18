import { lexicalEditor, BlocksFeature, UploadFeature } from '@payloadcms/richtext-lexical'
import { CollectionConfig, Block } from 'payload'

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
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
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
              media: {
                fields: [
                  {
                    name: 'caption',
                    type: 'text',
                  },
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
