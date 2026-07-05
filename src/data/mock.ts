export type TimelineItem = {
  year: string
  title: string
  institution: string
  description: string
  type: 'education' | 'career'
}

export type HobbyItem = {
  title: string
  imageUrl: string
  description?: string
  colSpan?: number
  rowSpan?: number
}

export const mockProfile = {
  name: 'Your Name',
  tagline: 'Software Developer & AI Enthusiast',
  location: 'Jakarta, Indonesia',
  languages: ['Indonesian (Native)', 'English (Professional)'],
  intro: "I'm a software developer based in Jakarta, focused on building products that sit at the intersection of clean engineering and practical AI.",
  bio: 'Building thoughtful software and exploring the frontier of artificial intelligence. I turn ideas into products that people actually want to use.',
  email: 'hello@yourname.dev',
  socialLinks: {
    github: 'https://github.com/yourname',
    linkedin: 'https://linkedin.com/in/yourname',
    twitter: 'https://twitter.com/yourname',
  },
  availabilityStatus: 'open' as const,
}

export const mockFeaturedProjects = [
  {
    slug: 'project-one',
    title: 'AI-Powered Code Assistant',
    description: 'A developer tool that uses LLMs to suggest code improvements in real-time.',
    techStack: ['TypeScript', 'Next.js', 'OpenAI'],
    category: 'AI/ML',
  },
  {
    slug: 'project-two',
    title: 'Real-time Collaboration Suite',
    description: 'Collaborative editing platform with CRDT-based sync and presence awareness.',
    techStack: ['React', 'WebSocket', 'Node.js'],
    category: 'Web App',
  },
  {
    slug: 'project-three',
    title: 'Developer Productivity Dashboard',
    description: 'Analytics dashboard that tracks coding metrics across GitHub, GitLab, and CI/CD.',
    techStack: ['Vue', 'PostgreSQL', 'D3.js'],
    category: 'Tool',
  },
]

export const mockFeaturedArticles = [
  {
    slug: 'building-with-llms',
    title: 'Building Products with LLMs: Lessons from the Trenches',
    excerpt:
      'What I learned shipping AI features to production — from prompt engineering to cost management.',
    category: 'AI/ML',
    publishedAt: '2025-06-15',
  },
  {
    slug: 'react-server-components',
    title: 'React Server Components Changed How I Think About Web',
    excerpt:
      'A practical guide to RSC architecture, when to use it, and where it still falls short.',
    category: 'Web Development',
    publishedAt: '2025-05-22',
  },
]

export const mockTechStack = [
  { name: 'TypeScript', category: 'Language' },
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Python', category: 'Language' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Tailwind CSS', category: 'Frontend' },
]

export const mockAbout = {
  intro:
    "I'm a software developer based in Jakarta, focused on building products that sit at the intersection of clean engineering and practical AI.",
  story: [
    'My journey started with a curiosity for how things work under the hood. What began as tinkering with scripts to automate small tasks turned into a career building web applications used by thousands of people.',
    "Along the way, I became fascinated by artificial intelligence — not as a buzzword, but as a real tool that can make software genuinely more useful. I've spent the last few years shipping AI-powered features to production, learning hard lessons about latency, cost, and what actually delivers value.",
    "Right now, I'm most interested in the intersection of developer tools and AI. I believe the best software gets out of the way, and I want to build things that feel effortless to use but are thoughtful underneath.",
  ],
  currentFocus: [
    {
      title: 'AI-Powered Developer Tools',
      description: 'Exploring how LLMs can improve developer experience — from code review to documentation.',
    },
    {
      title: 'Open Source',
      description: 'Contributing to and maintaining tools that help other developers ship faster.',
    },
    {
      title: 'Writing & Sharing',
      description:
        "Documenting what I learn so others can benefit from the mistakes I've already made.",
    },
  ],
  timeline: [
    {
      year: '2024 - Present',
      title: 'Senior Software Engineer',
      institution: 'Tech Innovations Inc.',
      description: 'Leading frontend development and exploring AI integration within enterprise applications.',
      type: 'career',
    },
    {
      year: '2021 - 2024',
      title: 'Software Engineer',
      institution: 'Creative Solutions',
      description: 'Built scalable web applications and modernized legacy codebases using React and Node.js.',
      type: 'career',
    },
    {
      year: '2017 - 2021',
      title: 'Bachelor of Computer Science',
      institution: 'University of Technology',
      description: 'Graduated with honors. Active member of the competitive programming club.',
      type: 'education',
    },
  ] as TimelineItem[],
  hobbies: [
    {
      title: 'Photography',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
      description: 'Capturing moments on 35mm film.',
      colSpan: 2,
      rowSpan: 2,
    },
    {
      title: 'Coffee Exploring',
      imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
      description: 'Finding the best local roasteries.',
      colSpan: 1,
      rowSpan: 1,
    },
    {
      title: 'Guitar',
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800',
      description: 'Playing acoustic guitar.',
      colSpan: 1,
      rowSpan: 1,
    },
    {
      title: 'Hiking',
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800',
      description: 'Weekend escapes to the mountains.',
      colSpan: 2,
      rowSpan: 1,
    },
  ] as HobbyItem[],
}
