import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileJson2, Shield, GitBranch } from "lucide-react";

export const metadata: Metadata = {
  title: "Conformance",
  description:
    "How Flametrench SDKs are verified: language-agnostic JSON fixtures, RFC 2119 levels, spec-linked, drift-checked in CI.",
};

export default function ConformancePage() {
  return (
    <div className="prose-docs">
      <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-accent)]">
        Conformance
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        How Flametrench SDKs are verified
      </h1>
      <p className="mt-5 text-[color:var(--color-fg-muted)]">
        The specification is the product. For that to mean something, every SDK
        must produce byte-identical behavior for byte-identical inputs on every
        spec-codified operation. The Flametrench conformance suite is the
        machinery that proves it.
      </p>

      <div className="not-prose mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Feature
          icon={FileJson2}
          title="Language-agnostic fixtures"
          body="Test vectors live as JSON files in the spec repo — not as code in each SDK. Every SDK loads the same files."
        />
        <Feature
          icon={Shield}
          title="RFC 2119 levels"
          body="Every fixture file declares MUST, SHOULD, or MAY. A MUST failure means an implementation cannot claim conformance."
        />
        <Feature
          icon={GitBranch}
          title="Spec-linked"
          body="Each fixture references the normative paragraph that authorizes it. When the spec moves, a grep finds what to update."
        />
        <Feature
          icon={CheckCircle2}
          title="Drift-checked in CI"
          body="Each SDK vendors the fixtures and runs them; CI fails if the vendored copy diverges from upstream. Drift is impossible."
        />
      </div>

      <h2 className="mt-16 text-xl font-semibold">How a fixture looks</h2>
      <p className="mt-3 text-[color:var(--color-fg-muted)]">
        A fixture file declares one capability × one operation, then lists one
        or more test vectors. Each vector has an <code>input</code> and an{" "}
        <code>expected</code> — either a{" "}
        <code>result</code> value or an <code>error</code> type.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-4 text-xs leading-relaxed">
{`{
  "$schema": "../../fixture.schema.json",
  "spec_version": "0.1.0",
  "capability": "ids",
  "operation": "decode",
  "conformance_level": "MUST",
  "spec_section": "docs/ids.md#decoding-rules",
  "description": "Malformed wire-format IDs MUST be rejected.",
  "tests": [
    {
      "id": "decode.reject.max-uuid",
      "description": "Max UUID (version nibble f) is rejected.",
      "input":    { "id": "usr_ffffffffffffffffffffffffffffffff" },
      "expected": { "error": "InvalidIdError" }
    }
  ]
}`}
      </pre>

      <h2 className="mt-16 text-xl font-semibold">What's covered in v0.1</h2>
      <div className="not-prose mt-6 overflow-hidden rounded-xl border border-[color:var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-left">
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-[color:var(--color-fg-muted)]">
                Capability
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-[color:var(--color-fg-muted)]">
                Fixture files
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-[color:var(--color-fg-muted)]">
                Runnable today
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]">
            <CapabilityRow
              name="IDs"
              files="encode · decode · decode-reject · is-valid · type-of"
              runnable
              details="48 tests. Both @flametrench/ids (Node) and flametrench/ids (PHP) pass the complete suite."
            />
            <CapabilityRow
              name="Identity"
              files="argon2id verification · hash-floor · OIDC normalization · session-rotation"
              runnable={false}
              details="Placeholder. Fixtures land when the first SDK ships an identity layer."
            />
            <CapabilityRow
              name="Tenancy"
              files="invitation-accept · sole-owner-transfer · admin-remove hierarchy · role-change chain · removed_by attribution"
              runnable={false}
              details="Placeholder. Requires SDK state; lands with the tenancy SDK layer."
            />
            <CapabilityRow
              name="Authorization"
              files="check exact-match · set-form · no-derivation · uniqueness · cascade · pagination"
              runnable={false}
              details="Placeholder. Requires a tuple store; lands with the authz SDK layer."
            />
          </tbody>
        </table>
      </div>

      <h2 className="mt-16 text-xl font-semibold">How a third-party implementation claims conformance</h2>
      <ol className="mt-4 space-y-2 text-sm text-[color:var(--color-fg-muted)]">
        <li>
          1. Vendor a snapshot of{" "}
          <Link
            href="https://github.com/flametrench/spec/tree/main/conformance"
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--color-accent)] hover:underline"
          >
            spec/conformance/fixtures/
          </Link>{" "}
          into your SDK's test tree.
        </li>
        <li>
          2. Write a harness that loads <code>index.json</code>, iterates each fixture file, and dispatches each test to your implementation's operation.
        </li>
        <li>
          3. Add a CI job that re-checks out <code>flametrench/spec</code> at <code>main</code> and diffs your vendored copy against upstream. Any drift fails the build.
        </li>
        <li>
          4. Publish a <code>CONFORMANCE.md</code> in your repo declaring the spec version you target, which fixture files you pass, and which you skip (with reasons).
        </li>
      </ol>
      <p className="mt-6 text-sm text-[color:var(--color-fg-muted)]">
        The reference harnesses in{" "}
        <Link
          href="https://github.com/flametrench/ids-php/blob/main/tests/ConformanceTest.php"
          target="_blank"
          rel="noreferrer"
          className="text-[color:var(--color-accent)] hover:underline"
        >
          PHP
        </Link>{" "}
        and{" "}
        <Link
          href="https://github.com/flametrench/node/blob/main/packages/ids/test/conformance.test.ts"
          target="_blank"
          rel="noreferrer"
          className="text-[color:var(--color-accent)] hover:underline"
        >
          Node
        </Link>{" "}
        are each under 150 lines — harness-writing is a small investment for the behavioral guarantee the suite provides.
      </p>

      <h2 className="mt-16 text-xl font-semibold">Why this is better than writing tests per SDK</h2>
      <ul className="mt-4 space-y-3 text-sm text-[color:var(--color-fg-muted)]">
        <li>
          <strong className="text-[color:var(--color-fg)]">Single source of truth.</strong>{" "}
          One fixture row instead of six duplicated inline constants across SDKs.
        </li>
        <li>
          <strong className="text-[color:var(--color-fg)]">Zero porting cost for new languages.</strong>{" "}
          A Go, Rust, or Python SDK in the future consumes the same fixtures. New language, same tests.
        </li>
        <li>
          <strong className="text-[color:var(--color-fg)]">Spec-grepable.</strong>{" "}
          Every fixture file cites its spec section. If <code>docs/tenancy.md</code> changes, finding the fixtures that need review is a{" "}
          <code>grep spec_section</code> away.
        </li>
        <li>
          <strong className="text-[color:var(--color-fg)]">Machine-graded.</strong>{" "}
          Harnesses emit per-fixture pass/fail output. A conformance dashboard or badge system can consume it without parsing language-specific test runners.
        </li>
        <li>
          <strong className="text-[color:var(--color-fg)]">Designed for third-party validation.</strong>{" "}
          Any external implementation can prove conformance against an unbiased external corpus — there's no "but their tests are lenient" argument to be made.
        </li>
      </ul>

      <p className="mt-16 text-sm text-[color:var(--color-fg-faint)]">
        Full framework documentation, the meta-schema, and all fixtures live at{" "}
        <Link
          href="https://github.com/flametrench/spec/tree/main/conformance"
          target="_blank"
          rel="noreferrer"
          className="text-[color:var(--color-accent)] hover:underline"
        >
          github.com/flametrench/spec/tree/main/conformance
        </Link>
        .
      </p>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] text-[color:var(--color-accent)]">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <h3 className="text-base font-semibold text-[color:var(--color-fg)]">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
        {body}
      </p>
    </div>
  );
}

function CapabilityRow({
  name,
  files,
  runnable,
  details,
}: {
  name: string;
  files: string;
  runnable: boolean;
  details: string;
}) {
  return (
    <tr>
      <td className="px-4 py-4 align-top">
        <div className="font-semibold">{name}</div>
        <div className="mt-1 text-xs text-[color:var(--color-fg-faint)]">{details}</div>
      </td>
      <td className="px-4 py-4 align-top font-mono text-xs text-[color:var(--color-fg-muted)]">
        {files}
      </td>
      <td className="px-4 py-4 align-top">
        {runnable ? (
          <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 text-xs text-emerald-300">
            <CheckCircle2 size={12} strokeWidth={2} />
            Yes
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 py-0.5 text-xs text-[color:var(--color-fg-faint)]">
            Planned
          </span>
        )}
      </td>
    </tr>
  );
}
