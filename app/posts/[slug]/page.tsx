import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Mdx } from '@/lib/mdx'
import {
  formatDate,
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
  slugify,
} from '@/lib/posts'
import { absoluteUrl, site } from '@/lib/site'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const url = absoluteUrl(`/posts/${post.slug}`)

  return {
    title: post.title,
    description: post.description || site.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description || site.description,
      url,
      publishedTime: post.date,
      authors: [site.author],
      tags: [...post.tags],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || site.description,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const { previous, next } = getAdjacentPosts(post.slug)

  return (
    <article>
      <header className="post-header">
        <h1>{post.title}</h1>
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
        </div>
      </header>

      <div className="prose">
        <Mdx source={post.content} />
      </div>

      <footer className="post-footer">
        {post.tags.length > 0 ? (
          <ul className="tag-row">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link className="tag" href={`/tags/${slugify(tag)}`}>
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <nav className="post-nav" aria-label="More posts">
          <div className="previous">
            {previous ? (
              <Link href={`/posts/${previous.slug}`}>
                <span className="label">Older</span>
                {previous.title}
              </Link>
            ) : null}
          </div>
          <div className="next">
            {next ? (
              <Link href={`/posts/${next.slug}`}>
                <span className="label">Newer</span>
                {next.title}
              </Link>
            ) : null}
          </div>
        </nav>
      </footer>
    </article>
  )
}
