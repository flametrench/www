import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Flametrench specification and SDK reference.",
};

export default function DocsIndex() {
  return (
    <div className="prose-docs">
      <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-accent)]">
        Documentation
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        Flametrench v0.1 (draft)
      </h1>
      <p className="mt-5 text-[color:var(--color-fg-muted)]">
        This is the documentation for the Flametrench specification and the
        reference SDKs. The spec is the source of truth; every SDK conforms to
        it or it is not a Flametrench SDK.
      </p>

      <h2 className="mt-12 text-xl font-semibold">Currently drafted</h2>
      <ul className="mt-4 space-y-2 text-sm text-[color:var(--color-fg-muted)]">
        <li>
          <Link href="/docs/ids" className="text-[color:var(--color-accent)] hover:underline">
            Identifier format
          </Link>{" "}
          — wire format, storage format, type prefix registry, encoding &amp;
          decoding rules, conformance fixtures.
        </li>
      </ul>

      <h2 className="mt-12 text-xl font-semibold">Coming next</h2>
      <ul className="mt-4 space-y-2 text-sm text-[color:var(--color-fg-muted)]">
        <li>Identity model — users, sessions, credentials.</li>
        <li>Tenancy model — organizations, memberships, invitations.</li>
        <li>Authorization model — relational tuples and policy evaluation.</li>
        <li>OpenAPI surface — the HTTP contract every SDK can generate clients for.</li>
      </ul>

      <p className="mt-12 text-sm text-[color:var(--color-fg-faint)]">
        Track progress or open a discussion at{" "}
        <Link
          href="https://github.com/flametrench/spec"
          className="text-[color:var(--color-accent)] hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          github.com/flametrench/spec
        </Link>
        .
      </p>
    </div>
  );
}
