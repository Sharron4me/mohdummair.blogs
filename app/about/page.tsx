import type { Metadata } from 'next'
import { absoluteUrl, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description: `About ${site.author}.`,
  alternates: { canonical: absoluteUrl('/about') },
}

export default function AboutPage() {
  return (
    <>
      <div className="page-header">
        <h1>About</h1>
      </div>

      <div className="prose">
        <p>
          I&rsquo;m {site.author}. I work on machine learning systems — the layer where model
          execution meets the hardware underneath it.
        </p>
        <p>
          This site is where I write up things I&rsquo;ve measured, read, or argued about:
          inference performance, long-context serving, memory hierarchies, and the tradeoffs
          that only show up once something is actually running.
        </p>
        <p>
          Posts here are working notes rather than finished papers. If something looks wrong,
          I would like to know.
        </p>
      </div>
    </>
  )
}
