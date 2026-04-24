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
};

export default withMDX(nextConfig);
