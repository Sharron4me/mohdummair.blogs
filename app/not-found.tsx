import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <div className="page-header">
        <h1>Not found</h1>
        <p>That page doesn&rsquo;t exist, or it moved.</p>
      </div>
      <p>
        <Link href="/">Back to all posts</Link>
      </p>
    </>
  )
}
