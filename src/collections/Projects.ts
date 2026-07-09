import { COMMON_IMAGE_MIMETYPES } from '@/constants/mimetype'
import { revalidateProjectsCache, revalidateProjectsDeleteCache } from '@/hooks/revalidateCache'
import { Octokit } from '@octokit/rest'
import { CollectionConfig } from 'payload'
import { env } from '../configs/env'

const github = new Octokit({
  auth: env.GITHUB_PAT,
})

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
    afterDelete: [revalidateProjectsDeleteCache],
  },
  endpoints: [
    {
      path: '/repositories',
      method: 'get',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        try {
          const { data } = await github.repos.listForAuthenticatedUser({
            sort: 'updated',
            type: 'owner',
            per_page: 100,
          })

          const repos = data.map((repo) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            private: repo.private,
          }))

          return Response.json({ repos })
        } catch (error) {
          req.payload.logger.error((error as Error).message)
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
