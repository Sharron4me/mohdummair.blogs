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
  /** Absolute site root, including basePath. Used for canonical URLs. */
  url: `${origin}${basePath}`,
  /** Personal/CV site this blog belongs to. Linked from the footer and About page. */
  homepage: 'https://sharron4me.github.io/',
  postsPerPage: 20,
  nav: [
    { label: 'Posts', href: '/' },
    { label: 'Tags', href: '/tags' },
    { label: 'About', href: '/about' },
  ],
  social: {
    github: 'https://github.com/Sharron4me',
    x: '',
    linkedin: 'https://www.linkedin.com/in/mohammad-ummair',
    email: 'mohdummair.iitb@gmail.com',
  },
} as const

/**
 * Build an absolute URL (origin + basePath + path) for metadata.
 *
 * Mirrors `trailingSlash: true` from next.config.mjs so canonical URLs match
 * what the server actually serves — otherwise every hit takes a redirect hop.
 * Paths that name a file (sitemap.xml) are left alone.
 */
export function absoluteUrl(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  const lastSegment = clean.split('/').pop() ?? ''
  const isFile = lastSegment.includes('.')
  const withSlash = isFile || clean.endsWith('/') ? clean : `${clean}/`
  return `${site.url}${withSlash}`
}
