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

      <h2 className="mt-12 text-xl font-semibold">Specification chapters</h2>
      <ul className="mt-4 space-y-3 text-sm text-[color:var(--color-fg-muted)]">
        <li>
          <Link href="/docs/ids" className="text-[color:var(--color-accent)] hover:underline">
            Identifier format
          </Link>{" "}
          — wire format, storage format, type prefix registry, encoding &amp;
          decoding rules, conformance fixtures.
        </li>
        <li>
          <Link href="/docs/identity" className="text-[color:var(--color-accent)] hover:underline">
            Identity
          </Link>{" "}
          — opaque users (<code>usr_</code>), credentials (
          <code>cred_</code>: password/passkey/OIDC with Argon2id pinned),
          user-bound sessions (<code>ses_</code>) with rotation.
        </li>
        <li>
          <Link href="/docs/tenancy" className="text-[color:var(--color-accent)] hover:underline">
            Tenancy
          </Link>{" "}
          — flat organizations (<code>org_</code>), memberships (
          <code>mem_</code>) as duals of auth tuples, invitations (
          <code>inv_</code>) with atomic acceptance, self-leave vs
          admin-remove procedures.
        </li>
        <li>
          <Link href="/docs/authorization" className="text-[color:var(--color-accent)] hover:underline">
            Authorization
          </Link>{" "}
          — relational tuples (<code>tup_</code>) as the sole authz primitive,
          exact-match <code>check()</code> semantics, the six built-in relations.
        </li>
      </ul>

      <h2 className="mt-12 text-xl font-semibold">Supporting artifacts</h2>
      <ul className="mt-4 space-y-3 text-sm text-[color:var(--color-fg-muted)]">
        <li>
          <Link
            href="https://github.com/flametrench/spec/tree/main/decisions"
            className="text-[color:var(--color-accent)] hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Architecture Decision Records
          </Link>{" "}
          — the why behind every load-bearing choice in v0.1.
        </li>
        <li>
          <Link
            href="https://github.com/flametrench/spec/blob/main/reference/postgres.sql"
            className="text-[color:var(--color-accent)] hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Reference Postgres schema
          </Link>{" "}
          — non-normative DDL that encodes the v0.1 data model.
        </li>
        <li>
          <Link
            href="https://github.com/flametrench/spec/blob/main/openapi/flametrench-v0.1.yaml"
            className="text-[color:var(--color-accent)] hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            OpenAPI v0.1 draft
          </Link>{" "}
          — the HTTP contract every conforming server exposes.
        </li>
      </ul>

      <h2 className="mt-12 text-xl font-semibold">Coming in v0.2+</h2>
      <ul className="mt-4 space-y-2 text-sm text-[color:var(--color-fg-muted)]">
        <li>Rewrite rules for authorization (role hierarchy, parent-child inheritance, group expansion).</li>
        <li>Nested organizations.</li>
        <li>First-class multi-factor authentication.</li>
        <li>Magic-link and SAML credential types.</li>
        <li>Audit events, notifications, files, feature flags, billing hooks.</li>
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
