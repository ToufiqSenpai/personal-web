import { CollectionConfig } from 'payload'
import { revalidateProjectsCache } from '@/hooks/revalidateCache'
import { COMMON_IMAGE_MIMETYPES } from '@/constants/mimetype'

export const ProjectsMedia: CollectionConfig = {
  slug: 'projects-media',
  admin: {
    group: 'Projects',
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
    staticDir: 'projects-media',
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
        width: 800,
        height: 600,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'projectType'],
    group: 'Projects',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateProjectsCache],
  },
  endpoints: [
    {
      path: '/github-repos',
      method: 'get',
      handler: async (req) => {
        const pat = process.env.GITHUB_PAT
        if (!pat) {
          return Response.json({ error: 'GITHUB_PAT not configured' }, { status: 500 })
        }

        try {
          const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
            headers: {
              Authorization: `Bearer ${pat}`,
              Accept: 'application/vnd.github.v3+json',
            },
          })

          if (!response.ok) {
            return Response.json({ error: 'Failed to fetch repositories' }, { status: response.status })
          }

          const data = await response.json()
          const repos = data.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            private: repo.private,
          }))

          return Response.json({ repos })
        } catch (error) {
          return Response.json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'githubRepo',
      type: 'text',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/GithubRepoSelect',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'A short description for the project card (1-2 sentences).',
      },
    },
    {
      name: 'techStacks',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'List of technologies used (e.g., React, Next.js, TailwindCSS)',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'projects-media',
      required: true,
    },
    {
      name: 'demoUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'repositoryUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        hidden: true,
      },
    },
    {
      name: 'projectType',
      type: 'select',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
      ],
      defaultValue: 'public',
      required: true,
      admin: {
        position: 'sidebar',
        hidden: true,
      },
    },
  ],
  timestamps: true,
}
