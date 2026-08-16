'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from '@/lib/site'
import { ThemeToggle } from './ThemeToggle'

export function SiteNav() {
  // usePathname() is already basePath-relative, so these comparisons hold on
  // GitHub Pages as well as locally.
  const pathname = usePathname()

  function isCurrent(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="site-nav" aria-label="Main">
      {site.nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isCurrent(item.href) ? 'page' : undefined}
        >
          {item.label}
        </Link>
      ))}
      <ThemeToggle />
    </nav>
  )
}
