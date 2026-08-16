import Link from 'next/link'
import { site } from '@/lib/site'
import { SiteNav } from './SiteNav'

export function SiteHeader() {
  return (
    <header className="site-header">
      <p className="site-title">
        <Link href="/">{site.title}</Link>
        <span className="site-tagline">{site.tagline}</span>
      </p>
      <SiteNav />
    </header>
  )
}
