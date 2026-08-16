import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { absoluteUrl, site } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.title}`,
  },
  description: site.description,
  authors: [{ name: site.author }],
  openGraph: {
    type: 'website',
    siteName: site.title,
    title: site.title,
    description: site.description,
    url: absoluteUrl('/'),
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: absoluteUrl('/'),
  },
}

/**
 * Applies the stored theme before first paint so dark-mode readers never see a
 * white flash. Has to be inline and synchronous — a deferred script paints late.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="shell">
          <a className="skip-link" href="#content">
            Skip to content
          </a>
          <SiteHeader />
          <main id="content">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
