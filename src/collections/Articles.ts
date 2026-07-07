import slugify from '@sindresorhus/slugify'
import { lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
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
      relationTo: 'article-media',
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
              'article-media': {
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
  slug: "article-categories",
  admin: {
    useAsTitle: "title",
    group: "Article",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      required: true,
      hooks: {
        beforeChange: [
          ({ siblingData, value, operation }) => {
            if (operation === "create") {
              return value || slugify(siblingData.title);
            }
            return value;
          },
        ],
      },
    },
    {
      name: "description",
      type: "textarea",
    },
  ],
  timestamps: true,
};

import { COMMON_IMAGE_MIMETYPES } from "../constants/mimetype";

export const ArticleMedia: CollectionConfig = {
  slug: "article-media",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "alt",
    group: "Article",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "text",
    },
  ],
  upload: {
    staticDir: "article-media",
    mimeTypes: COMMON_IMAGE_MIMETYPES,
    adminThumbnail: "thumbnail",
    formatOptions: {
      format: "avif",
      options: {
        quality: 75,
      },
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 210,
        formatOptions: {
          format: "avif",
        },
      },
      {
        name: "card",
        width: 800,
        height: 420,
        formatOptions: {
          format: "avif",
        },
      },
      {
        name: "og",
        width: 1200,
        height: 630,
        formatOptions: {
          format: "avif",
        },
      },
      {
        name: "hero",
        width: 1600,
        height: 840,
        formatOptions: {
          format: "avif",
        },
      },
    ],
  },
};
