import { COMMON_IMAGE_MIMETYPES } from '@/constants/mimetype'
import { createFolderField, createTagField, type CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'alt',
    group: 'Media',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
  ],
  upload: {
    // Sharp only rewrites the raster formats it declares, so SVGs are stored untouched.
    mimeTypes: [...COMMON_IMAGE_MIMETYPES, 'image/svg+xml'],
  },
}
