import { site } from '@/lib/site'

const YEAR_SITE_STARTED = 2026

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>
        © {YEAR_SITE_STARTED} {site.author}
      </span>
      <span className="footer-links">
        <a href={site.homepage} target="_blank" rel="noopener noreferrer">
          CV
        </a>
        {site.social.github ? (
          <a href={site.social.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        ) : null}
        {site.social.linkedin ? (
          <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        ) : null}
        {site.social.email ? <a href={`mailto:${site.social.email}`}>Email</a> : null}
      </span>
    </footer>
  )
}
