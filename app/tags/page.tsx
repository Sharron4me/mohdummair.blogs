import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse posts by topic.',
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <>
      <div className="page-header">
        <h1>Tags</h1>
        <p>Browse posts by topic.</p>
      </div>

      {tags.length === 0 ? (
        <p className="empty">No tags yet.</p>
      ) : (
        <ul className="tag-row">
          {tags.map(({ tag, slug, count }) => (
            <li key={slug}>
              <Link className="tag" href={`/tags/${slug}`}>
                {tag} <span className="tag-count">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
