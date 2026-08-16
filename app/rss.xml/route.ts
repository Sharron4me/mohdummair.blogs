import { getAllPosts } from '@/lib/posts'
import { absoluteUrl, site } from '@/lib/site'

// Emitted as a static file during `next build` so GitHub Pages can serve it.
export const dynamic = 'force-static'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function GET() {
  const posts = getAllPosts().filter((post) => !post.draft)
  const feedUrl = absoluteUrl('/rss.xml')
  const lastBuildDate = posts[0]
    ? new Date(`${posts[0].date}T00:00:00Z`).toUTCString()
    : undefined

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/posts/${post.slug}`)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${absoluteUrl('/')}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${lastBuildDate ? `    <lastBuildDate>${lastBuildDate}</lastBuildDate>` : ''}
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
