import type { MetadataRoute } from 'next'
import { getAllPosts, getAllTags } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // Drafts render on the site but stay out of the sitemap — visible to anyone who
  // follows a link, not advertised to crawlers while they are still unfinished.
  const posts = getAllPosts().filter((post) => !post.draft)

  return [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/about'), changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/tags'), changeFrequency: 'weekly', priority: 0.3 },
    ...posts.map((post) => ({
      url: absoluteUrl(`/posts/${post.slug}`),
      lastModified: post.date,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...getAllTags().map(({ slug }) => ({
      url: absoluteUrl(`/tags/${slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.2,
    })),
  ]
}
