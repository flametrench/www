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
components/               landing + docs UI components
content/docs/ids.mdx      mirrored from github.com/flametrench/spec/docs/ids.md
lib/ids/                  vendored copy of @flametrench/ids used by the live demo
```

### Keeping `content/docs/ids.mdx` in sync

The documentation page renders a local copy of the specification file from
the [`flametrench/spec`](https://github.com/flametrench/spec) repo. When the
spec changes, update the local copy:

```bash
curl -L https://raw.githubusercontent.com/flametrench/spec/main/docs/ids.md \
  -o content/docs/ids.mdx
```

A CI job that validates the copy is in sync is planned for a later pass.

### Vendored `@flametrench/ids`

`lib/ids/` is a verbatim copy of `packages/ids/src/` from
[`flametrench/node`](https://github.com/flametrench/node). It exists so the
interactive encoder on the landing page can use the real SDK without waiting
for the npm package to publish. Once `@flametrench/ids` is on npm, swap the
vendored copy for the published dependency.

## License

Apache License 2.0. Copyright 2026 NDC Digital, LLC.
