# flametrench/www

The Flametrench project website — landing page and documentation at [flametrench.dev](https://flametrench.dev).

Built with Next.js 15 (App Router, React 19), Tailwind v4, and MDX. Deployed on Vercel.

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
pnpm build
pnpm start
```

## Structure

```
app/
  layout.tsx              root layout (fonts, metadata)
  page.tsx                landing page
  icon.svg                favicon (flame glyph)
  opengraph-image.tsx     dynamic OG image via next/og
  docs/
    layout.tsx            docs layout with sidebar
    page.tsx              docs index
    ids/page.tsx          renders content/docs/ids.mdx
    identity/page.tsx     renders content/docs/identity.mdx
    tenancy/page.tsx      renders content/docs/tenancy.mdx
    authorization/page.tsx renders content/docs/authorization.mdx
    conformance/page.tsx  editorial page about the conformance model
components/               landing + docs UI components
content/docs/*.mdx        mirrored from github.com/flametrench/spec/docs/
lib/cn.ts                 className utility
```

### Keeping `content/docs/*.mdx` in sync

The documentation pages render local copies of the spec chapters. When the
spec changes, refresh them from upstream:

```bash
for f in ids identity tenancy authorization; do
  curl -L "https://raw.githubusercontent.com/flametrench/spec/main/docs/$f.md" \
    -o "content/docs/$f.mdx"
done
```

A CI job that validates the copies are in sync is planned for a later pass.

### The live encoder widget

The landing page's interactive encoder uses the published `@flametrench/ids`
npm package directly. Previously this site vendored a copy of the SDK source
at `lib/ids/` while the npm package was pre-publish; that vendoring was
removed once `@flametrench/ids@0.1.0` landed on npm (2026-04-24).

## License

Apache License 2.0. Copyright 2026 NDC Digital, LLC.
