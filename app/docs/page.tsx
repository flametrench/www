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
        Flametrench v0.2
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

      <h2 className="mt-12 text-xl font-semibold">Conformance</h2>
      <ul className="mt-4 space-y-3 text-sm text-[color:var(--color-fg-muted)]">
        <li>
          <Link href="/docs/conformance" className="text-[color:var(--color-accent)] hover:underline">
            How SDKs are verified
          </Link>{" "}
          — language-agnostic JSON fixtures, RFC 2119 conformance levels,
          drift-checked in CI. How third-party implementations prove they
          conform to the spec.
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
          — the why behind every load-bearing choice across v0.1 and v0.2.
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
          — non-normative DDL that encodes the current data model (v0.1 + v0.2).
        </li>
        <li>
          <Link
            href="https://github.com/flametrench/spec/blob/main/openapi/flametrench-v0.1.yaml"
            className="text-[color:var(--color-accent)] hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            OpenAPI specification
          </Link>{" "}
          — the HTTP contract every conforming server exposes.
        </li>
      </ul>

      <h2 className="mt-12 text-xl font-semibold">In v0.2</h2>
      <ul className="mt-4 space-y-2 text-sm text-[color:var(--color-fg-muted)]">
        <li>Authorization rewrite rules — <code>computed_userset</code> (role implication) and <code>tuple_to_userset</code> (parent-child inheritance), with depth/fan-out caps and direct-match short-circuit.</li>
        <li>Multi-factor authentication — TOTP (RFC 6238), recovery codes, and WebAuthn assertion verification across ES256 / RS256 / EdDSA.</li>
        <li>Share tokens (<code>shr_</code>) — time-bounded, presentation-bearer access to a single resource without minting an authenticated principal.</li>
        <li>Postgres-backed reference adapters — <code>PostgresIdentityStore</code>, <code>PostgresTenancyStore</code>, <code>PostgresTupleStore</code>, <code>PostgresShareStore</code> across all four SDKs.</li>
        <li>Organization metadata (name + slug) and invitation acceptance binding (security).</li>
      </ul>

      <h2 className="mt-12 text-xl font-semibold">In v0.3 (in development)</h2>
      <ul className="mt-4 space-y-2 text-sm text-[color:var(--color-fg-muted)]">
        <li>Personal access tokens (<code>pat_</code>) — non-interactive bearer credentials for CLI / CI / server-to-server (ADR 0016).</li>
        <li>Bearer prefix dispatch — sessions / share tokens / PATs unified behind one <code>auth.kind</code> classifier.</li>
        <li>Postgres rewrite-rule evaluation — <code>PostgresTupleStore.check()</code> with rules; no in-memory shadow workaround required (ADR 0017).</li>
        <li>WebAuthn EdDSA + RS256 conformance fixture set (the v0.2-deferred parity set).</li>
        <li>Schema relaxation: <code>tup.subject_type ^[a-z]{`{2,6}`}$</code> unblocks <code>tuple_to_userset</code> object-to-object hops.</li>
      </ul>

      <h2 className="mt-12 text-xl font-semibold">Coming in v0.4+</h2>
      <ul className="mt-4 space-y-2 text-sm text-[color:var(--color-fg-muted)]">
        <li>Audit events (<code>aud_</code>), notifications (<code>not_</code>), file metadata (<code>file_</code>).</li>
        <li>Feature flags (<code>flag_</code>) and billing hooks (<code>sub_</code>).</li>
        <li>Group-as-subject (<code>grp_</code>) and rewrite-rule intersection / exclusion / recursive closures.</li>
        <li>Magic-link and SAML credential types.</li>
        <li>Nested organizations.</li>
        <li>Additional language SDKs as adopter demand emerges.</li>
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
