/**
 * Single source of truth for site metadata.
 *
 * SITE_URL and BASE_PATH are supplied by the deploy workflow. Locally they fall
 * back to values that keep dev links working.
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const origin = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const site = {
  title: 'Mohammad Ummair',
  tagline: 'Notes on ML systems, inference, and silicon.',
  description:
    'Writing about LLM inference, long-context serving, GPU and CPU architecture, and the systems work that sits between a model and the hardware it runs on.',
  author: 'Mohammad Ummair',
  /** Absolute origin, no trailing slash and no basePath. */
  origin,
  /** Path prefix for internal links (empty locally, "/<repo>" on GitHub Pages). */
  basePath,
  /** Absolute site root, including basePath. Used for RSS and canonical URLs. */
  url: `${origin}${basePath}`,
  postsPerPage: 20,
  nav: [
    { label: 'Posts', href: '/' },
    { label: 'Tags', href: '/tags' },
    { label: 'About', href: '/about' },
  ],
  social: {
    github: '',
    x: '',
    linkedin: '',
    email: '',
  },
} as const

/**
 * Build an absolute URL (origin + basePath + path) for feeds and metadata.
 *
 * Mirrors `trailingSlash: true` from next.config.mjs so canonical URLs and feed
 * links match what the server actually serves — otherwise every hit takes a
 * redirect hop. Paths that name a file (rss.xml, sitemap.xml) are left alone.
 */
export function absoluteUrl(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  const lastSegment = clean.split('/').pop() ?? ''
  const isFile = lastSegment.includes('.')
  const withSlash = isFile || clean.endsWith('/') ? clean : `${clean}/`
  return `${site.url}${withSlash}`
}
