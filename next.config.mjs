/**
 * GitHub Pages serves project sites from a subdirectory (username.github.io/<repo>),
 * so every internal URL needs that prefix. BASE_PATH is set by the deploy workflow
 * and left empty for local dev and for user/org sites (username.github.io).
 */
const basePath = process.env.BASE_PATH || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static HTML — GitHub Pages cannot run a Node server.
  output: 'export',
  basePath,
  // Emits /posts/slug/index.html so Pages resolves nested routes without a rewrite rule.
  trailingSlash: true,
  // next/image optimization needs a server at runtime.
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
