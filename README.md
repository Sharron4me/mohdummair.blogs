# Blog

A statically-exported Next.js blog. Posts are MDX files in `posts/`; everything else is
generated at build time. No database, no runtime server, no JavaScript shipped for
syntax highlighting.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

## Writing a post

```bash
npm run new "Why the KV cache is the whole problem"
```

That creates `posts/why-the-kv-cache-is-the-whole-problem.mdx` with today's date and
`draft: true`. Or write the file by hand:

```mdx
---
title: 'Why the KV cache is the whole problem'
date: '2026-08-20'
description: 'Shows on the index page and in search results.'
tags: ['inference', 'long context']
draft: false
---

Your first paragraph.
```

| Field         | Required | Notes                                                        |
| ------------- | -------- | ------------------------------------------------------------ |
| `title`       | yes      | Build fails if missing                                       |
| `date`        | yes      | `YYYY-MM-DD`; controls ordering                              |
| `description` | no       | Index page blurb and `<meta>` description                    |
| `tags`        | no       | Free-form; tag pages are generated automatically             |
| `draft`       | no       | `true` adds a Draft badge; the post still publishes         |
| `slug`        | no       | Overrides the filename-derived URL                           |

Filename becomes the URL: `posts/foo-bar.mdx` → `/posts/foo-bar`.

`posts/writing-reference.mdx` documents every supported formatting feature — code blocks
with titles and line highlighting, tables, footnotes, figures. It and
`posts/unfinished-draft.mdx` are gitignored, so they stay on disk as a local reference and
never reach the deployed site. Delete them when you no longer need them.

## Before you publish

Edit `lib/site.ts`:

- `title`, `tagline`, `description`, `author`
- `social` — GitHub, LinkedIn, email. Blank entries are hidden, not rendered empty.

Then rewrite `app/about/page.tsx`, which currently holds placeholder copy.

## Deploying to GitHub Pages

This directory is not a git repo yet. Make it one, push it, and turn on Pages:

```bash
git init -b main
git add .
git commit -m "Initial blog"
gh repo create blog --public --source=. --push
```

Then in the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

That last step is what makes it work — the workflow in `.github/workflows/deploy.yml`
runs on every push to `main`, but it cannot deploy until Pages is set to the Actions
source. The workflow reads the repo's Pages URL and passes it to the build as
`BASE_PATH` and `SITE_URL`, so a project site served from `username.github.io/blog`
gets the right prefix on every link without any config edits.

Live at `https://<username>.github.io/<repo>/` a minute or two after the first push.

### Custom domain

Add the domain under Settings → Pages, then create `public/CNAME` containing just the
domain. With a custom domain the base path is empty, which `configure-pages` reports
automatically — no code change needed.

## Local production check

```bash
npm run build        # writes ./out
npm start            # serves ./out at localhost:3000
```

`npm run build` renders the site exactly as CI does, minus the base path. Worth running
before a push since missing frontmatter fails the build here.

`npm run build` also type-checks and fails on TS errors, which is why CI has no separate
typecheck step. There is a `npm run typecheck` script for faster iteration, but it needs
`next-env.d.ts` — so run `npm run dev` or `npm run build` at least once after cloning
before using it.

## Layout

```
app/
  layout.tsx            shell, metadata, pre-paint theme script
  page.tsx              index, posts grouped by year
  posts/[slug]/page.tsx article page
  tags/                 tag index and per-tag pages
  about/page.tsx        placeholder — rewrite this
  sitemap.ts robots.ts  generated at build time
  globals.css           all styling; design tokens at the top
components/             header, nav, footer, post list, theme toggle
lib/
  posts.ts              reads and validates frontmatter
  mdx.tsx               MDX pipeline: GFM, heading anchors, Shiki
  site.ts               site config and URL helpers
posts/                  your content
scripts/new-post.mjs    npm run new
```

## Notes

- **Fonts are system fonts.** No `next/font`, nothing fetched at build time.
- **Highlighting is build-time.** Shiki runs during `next build`, so code blocks are
  plain styled HTML with zero client JS.
- **Dark mode** follows the OS until the reader clicks the toggle, which pins their
  choice in `localStorage`. An inline script applies it before first paint.
- **`output: 'export'`** rules out API routes, middleware, ISR, and server actions. If
  you later want any of those, switch hosting to Vercel and drop that line from
  `next.config.mjs`.
