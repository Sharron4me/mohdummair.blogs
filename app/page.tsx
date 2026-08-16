import { PostList } from '@/components/PostList'
import { getAllPosts } from '@/lib/posts'
import { site } from '@/lib/site'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <>
      <div className="intro">
        <h1>Writing</h1>
        <p>{site.description}</p>
      </div>
      <PostList posts={posts} groupByYear />
    </>
  )
}
