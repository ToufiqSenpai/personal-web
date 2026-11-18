import { lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import slugify from '@sindresorhus/slugify'
import { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Article',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      hooks: {
        beforeChange: [
          ({ siblingData, value, operation }) => {
            if (operation === 'create') {
              return value || slugify(siblingData.title)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'text',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'article-categories',
      hasMany: true,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          UploadFeature({
            collections: {
              media: {
                fields: [],
              },
            },
          }),
        ],
      }),
    },
    {
      name: 'readingTime',
      type: 'number',
      virtual: true,
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            return Math.ceil(convertLexicalToPlaintext(siblingData.body).split(/\s+/).length / 200)
          },
        ],
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.status === 'published' && !value) {
              return new Date()
            }

            return value
          },
        ],
      },
    },
  ],
  timestamps: true,
}

export const ArticleCategories: CollectionConfig = {
  slug: 'article-categories',
  admin: {
    useAsTitle: 'title',
    group: 'Article',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      hooks: {
        beforeChange: [
          ({ siblingData, value, operation }) => {
            if (operation === 'create') {
              return value || slugify(siblingData.title)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
  timestamps: true,
}
