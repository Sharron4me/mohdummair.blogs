import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostList } from '@/components/PostList'
import { getAllTags, getPostsByTagSlug } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'

type Params = { tag: string }

export function generateStaticParams(): Params[] {
  return getAllTags().map(({ slug }) => ({ tag: slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { tag } = await params
  const match = getAllTags().find((entry) => entry.slug === tag)
  if (!match) return {}

  return {
    title: match.tag,
    description: `Posts tagged “${match.tag}”.`,
    alternates: { canonical: absoluteUrl(`/tags/${match.slug}`) },
  }
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag } = await params
  const match = getAllTags().find((entry) => entry.slug === tag)

  if (!match) notFound()

  const posts = getPostsByTagSlug(tag)

  return (
    <>
      <div className="page-header">
        <h1>{match.tag}</h1>
        <p>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>
      <PostList posts={posts} />
    </>
  )
}
