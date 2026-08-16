#!/usr/bin/env node
/**
 * Scaffold a new post:  npm run new "Why the KV cache is the whole problem"
 *
 * Creates posts/<slug>.mdx with today's date and draft: true.
 */

import fs from 'node:fs'
import path from 'node:path'

const title = process.argv.slice(2).join(' ').trim()

if (!title) {
  console.error('Usage: npm run new "Post title here"')
  process.exit(1)
}

const slug = title
  .toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_]+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')

const date = new Date().toISOString().slice(0, 10)
const filePath = path.join(process.cwd(), 'posts', `${slug}.mdx`)

if (fs.existsSync(filePath)) {
  console.error(`posts/${slug}.mdx already exists — pick a different title or edit that file.`)
  process.exit(1)
}

// Single-quote the title, escaping any apostrophes for YAML.
const yamlTitle = title.replace(/'/g, "''")

const template = `---
title: '${yamlTitle}'
date: '${date}'
description: ''
tags: []
draft: true
---

Write here.
`

fs.mkdirSync(path.dirname(filePath), { recursive: true })
fs.writeFileSync(filePath, template)

console.log(`Created posts/${slug}.mdx`)
console.log(`Preview at http://localhost:3000/posts/${slug}`)
console.log(`Remove "draft: true" when it is ready to publish.`)
