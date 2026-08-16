import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode, { type Options as PrettyCodeOptions } from 'rehype-pretty-code'
import { site } from './site'

const prettyCodeOptions: PrettyCodeOptions = {
  // Dual themes emit --shiki-light/--shiki-dark CSS variables, which globals.css
  // switches on. Highlighting happens at build time, so no JS ships to the browser.
  theme: { light: 'github-light', dark: 'github-dark-dimmed' },
  keepBackground: false,
  defaultLang: 'text',
}

/** Internal links route through next/link so basePath is applied automatically. */
function Anchor({ href = '', ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/')) {
    return <Link href={href} {...props} />
  }
  if (href.startsWith('#')) {
    return <a href={href} {...props} />
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
}

/**
 * Root-relative image paths need the basePath prefix by hand — next/image is off
 * in static export, and a bare <img src="/images/x.png"> would 404 on a project
 * site served from /<repo>/.
 */
function Img({ src, ...props }: ComponentPropsWithoutRef<'img'>) {
  const resolved =
    typeof src === 'string' && src.startsWith('/') ? `${site.basePath}${src}` : src
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  return <img src={resolved} loading="lazy" {...props} />
}

const components = {
  a: Anchor,
  img: Img,
}

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: 'heading-link' } }],
            [rehypePrettyCode, prettyCodeOptions],
          ],
        },
      }}
    />
  )
}
