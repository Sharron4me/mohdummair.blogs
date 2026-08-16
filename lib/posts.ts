import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'posts')

export type PostMeta = {
  slug: string
  title: string
  /** ISO date string, YYYY-MM-DD. */
  date: string
  description: string
  tags: string[]
  draft: boolean
  readingTime: number
}

export type Post = PostMeta & {
  /** Raw MDX body, frontmatter stripped. */
  content: string
}

/** Turn a tag or title into a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function readingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function parseFile(fileName: string): Post {
  const filePath = path.join(POSTS_DIR, fileName)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  const slug = data.slug ? String(data.slug) : fileName.replace(/\.mdx?$/, '')

  if (!data.title) {
    throw new Error(`posts/${fileName}: missing required frontmatter field "title"`)
  }
  if (!data.date) {
    throw new Error(`posts/${fileName}: missing required frontmatter field "date"`)
  }

  // Normalize: YAML parses unquoted dates into Date objects, quoted ones into strings.
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date).slice(0, 10)

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`posts/${fileName}: date must be YYYY-MM-DD, got "${String(data.date)}"`)
  }

  return {
    slug,
    title: String(data.title),
    date,
    description: data.description ? String(data.description) : '',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    readingTime: readingTimeMinutes(content),
    content,
  }
}

/**
 * All posts, newest first. Drafts are included in every build and render with a
 * "Draft" badge, so `draft: true` marks a post as unfinished rather than hiding it.
 */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith('.'))
    .map(parseFile)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)))
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug)
}

export type TagCount = { tag: string; slug: string; count: number }

/** Every tag in use, most-used first. */
export function getAllTags(): TagCount[] {
  const counts = new Map<string, TagCount>()

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      const slug = slugify(tag)
      const existing = counts.get(slug)
      if (existing) {
        existing.count += 1
      } else {
        counts.set(slug, { tag, slug, count: 1 })
      }
    }
  }

  return [...counts.values()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  )
}

export function getPostsByTagSlug(tagSlug: string): Post[] {
  return getAllPosts().filter((post) => post.tags.some((tag) => slugify(tag) === tagSlug))
}

/** Stable, locale-independent date rendering — avoids server/client drift. */
export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** Newer/older neighbours for post footer navigation. */
export function getAdjacentPosts(slug: string): { previous?: PostMeta; next?: PostMeta } {
  const posts = getAllPosts()
  const index = posts.findIndex((post) => post.slug === slug)
  if (index === -1) return {}
  return {
    // posts[] is newest-first, so the "next" (newer) post sits at a lower index.
    next: posts[index - 1],
    previous: posts[index + 1],
  }
}
