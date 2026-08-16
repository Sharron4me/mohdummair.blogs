import Link from 'next/link'
import { formatDate, slugify, type Post } from '@/lib/posts'

function PostItem({ post }: { post: Post }) {
  return (
    <article className="post-item">
      <h2>
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      {post.description ? <p>{post.description}</p> : null}
      <div className="post-meta">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="dot" />
        <span>{post.readingTime} min read</span>
        {post.draft ? (
          <>
            <span className="dot" />
            <span className="draft-badge">Draft</span>
          </>
        ) : null}
        {post.tags.length > 0 ? (
          <>
            <span className="dot" />
            {post.tags.map((tag) => (
              <Link key={tag} className="tag" href={`/tags/${slugify(tag)}`}>
                {tag}
              </Link>
            ))}
          </>
        ) : null}
      </div>
    </article>
  )
}

/**
 * Chronological list of posts. `groupByYear` inserts a year heading whenever the
 * year changes — useful on the archive, noise on a single-tag page.
 */
export function PostList({
  posts,
  groupByYear = false,
}: {
  posts: Post[]
  groupByYear?: boolean
}) {
  if (posts.length === 0) {
    return <p className="empty">No posts yet.</p>
  }

  if (!groupByYear) {
    return (
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostItem post={post} />
          </li>
        ))}
      </ul>
    )
  }

  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))]

  return (
    <>
      {years.map((year, index) => (
        <section key={year}>
          <h2 className="post-year" style={index === 0 ? { marginTop: 0 } : undefined}>
            {year}
          </h2>
          <ul className="post-list">
            {posts
              .filter((post) => post.date.startsWith(year))
              .map((post) => (
                <li key={post.slug}>
                  <PostItem post={post} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </>
  )
}
