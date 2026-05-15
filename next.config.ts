import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import rehypePrettyCode, { type Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const prettyCodeOptions: RehypePrettyCodeOptions = {
  theme: "github-dark-default",
  keepBackground: false,
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Pin workspace root to this directory so Next doesn't pick up a stray
  // lockfile higher in the tree (e.g., a leftover ~/package-lock.json).
  outputFileTracingRoot: __dirname,

  // Static export — every route is content-driven MDX with no per-
  // request data, no server actions, no route handlers, no
  // middleware. Building to `out/` lets the site deploy as plain
  // S3 + CloudFront under SiteSource Cloud's `react-spa` stack.
  // See https://github.com/sitesource/cloud/blob/main/docs/guides/nextjs-static-export.md
  // for the full migration recipe.
  output: "export",

  // Required when output: 'export' is set — Next's built-in image
  // optimizer runs server-side, which isn't available in static
  // export. The site doesn't use next/image today; this is defense
  // in depth for future contributors.
  images: { unoptimized: true },

  // CloudFront serves nested `/docs/<topic>/` paths from
  // `out/docs/<topic>/index.html` cleanly when links carry the
  // trailing slash. Next.js with trailingSlash: true rewrites all
  // <Link href="/docs/topic"> to "/docs/topic/" automatically.
  trailingSlash: true,
};

export default withMDX(nextConfig);
