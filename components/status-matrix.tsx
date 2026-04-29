import Link from "next/link";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import { Container } from "./container";

// Status matrix: package × language × version × channel state.
// Replaces the SDK-grid framing because adopters want the precise
// answer to "is this real, in my language, on my registry?" — not
// just "what languages does this support".
//
// EACH CELL'S VERSION REFLECTS THE NEWEST VERSION ACTUALLY PUBLISHED
// ON THE NAMED REGISTRY (any dist-tag — `latest` OR `rc`). "live" =
// installable today via `npm install @flametrench/<pkg>@<version>`,
// `composer require flametrench/<pkg>:<version>`, etc. "pending" =
// shipped locally but not yet on the registry. Verify with
// `npm view @flametrench/<pkg> versions --json` (note the plural —
// singular `version` returns only the `latest` dist-tag, missing
// RCs published under `rc` / `next`). PHP/Packagist auto-syncs
// from git tags. PyPI/Maven publishing blocked on org/credential
// approvals.

type ChannelState = "live" | "pending" | "planned";

interface Cell {
  version: string;
  channel: ChannelState;
}

interface Row {
  pkg: string;
  blurb: string;
  cells: { node: Cell; php: Cell; python: Cell; java: Cell };
}

const ROWS: Row[] = [
  {
    pkg: "ids",
    blurb: "Wire-format identifiers (UUIDv7, prefixed).",
    cells: {
      node: { version: "v0.2.0-rc.2", channel: "live" },
      php: { version: "v0.2.0-rc.2", channel: "live" },
      python: { version: "v0.2.0rc3", channel: "pending" },
      java: { version: "v0.2.0-rc.2", channel: "pending" },
    },
  },
  {
    pkg: "identity",
    blurb: "Users, credentials, sessions, MFA, display name, listUsers.",
    cells: {
      node: { version: "v0.2.0-rc.7", channel: "live" },
      php: { version: "v0.2.0-rc.6", channel: "live" },
      python: { version: "v0.2.0rc6", channel: "pending" },
      java: { version: "v0.2.0-rc.6", channel: "pending" },
    },
  },
  {
    pkg: "tenancy",
    blurb: "Organizations, memberships, invitations.",
    cells: {
      node: { version: "v0.2.0-rc.4", channel: "live" },
      php: { version: "v0.2.0-rc.6", channel: "live" },
      python: { version: "v0.2.0rc5", channel: "pending" },
      java: { version: "v0.2.0-rc.5", channel: "pending" },
    },
  },
  {
    pkg: "authz",
    blurb: "Tuples, check(), rewrite rules, share tokens.",
    cells: {
      node: { version: "v0.2.0-rc.3", channel: "live" },
      php: { version: "v0.2.0-rc.5", channel: "live" },
      python: { version: "v0.2.0rc4", channel: "pending" },
      java: { version: "v0.2.0-rc.4", channel: "pending" },
    },
  },
];

const CHANNEL_META: Record<
  ChannelState,
  { label: string; icon: typeof CheckCircle2; iconClass: string; cellClass: string }
> = {
  live: {
    label: "Live",
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    cellClass: "bg-[color:var(--color-background)]",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    iconClass: "text-amber-400",
    cellClass: "bg-[color:var(--color-background)]",
  },
  planned: {
    label: "Planned",
    icon: Circle,
    iconClass: "text-[color:var(--color-fg-faint)]",
    cellClass: "bg-[color:var(--color-background)]",
  },
};

const LANGUAGES: Array<{
  key: keyof Row["cells"];
  name: string;
  registry: string;
  registryUrl: string;
  pkgPrefix: string;
}> = [
  {
    key: "node",
    name: "Node",
    registry: "npm",
    registryUrl: "https://www.npmjs.com/package/@flametrench/",
    pkgPrefix: "@flametrench/",
  },
  {
    key: "php",
    name: "PHP",
    registry: "Packagist",
    registryUrl: "https://packagist.org/packages/flametrench/",
    pkgPrefix: "flametrench/",
  },
  {
    key: "python",
    name: "Python",
    registry: "PyPI",
    registryUrl: "https://pypi.org/project/flametrench-",
    pkgPrefix: "flametrench-",
  },
  {
    key: "java",
    name: "Java",
    registry: "Maven Central",
    registryUrl: "https://central.sonatype.com/artifact/dev.flametrench/",
    pkgPrefix: "dev.flametrench:",
  },
];

export function StatusMatrix() {
  return (
    <section className="border-b border-[color:var(--color-border)] py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-accent)]">
            Status
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Package × language × registry.
          </h2>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            v0.2 release-candidate. All four core packages, all four
            languages — same semantics, conformance-tested across the family.
            Registry channels light up as each is published.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-xl border border-[color:var(--color-border)]">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="bg-[color:var(--color-surface)]">
                <th className="border-b border-[color:var(--color-border)] px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-faint)]">
                  Package
                </th>
                {LANGUAGES.map((lang) => (
                  <th
                    key={lang.key}
                    className="border-b border-l border-[color:var(--color-border)] px-4 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-faint)]"
                  >
                    {lang.name}
                    <span className="ml-1.5 text-[color:var(--color-fg-faint)] normal-case font-sans">
                      · {lang.registry}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.pkg} className="bg-[color:var(--color-background)]">
                  <td className="border-b border-[color:var(--color-border)] px-4 py-4 align-top">
                    <div className="font-mono text-sm font-medium text-[color:var(--color-fg)]">
                      {row.pkg}
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-[color:var(--color-fg-muted)]">
                      {row.blurb}
                    </div>
                  </td>
                  {LANGUAGES.map((lang) => {
                    const cell = row.cells[lang.key];
                    const meta = CHANNEL_META[cell.channel];
                    const Icon = meta.icon;
                    return (
                      <td
                        key={lang.key}
                        className={`border-b border-l border-[color:var(--color-border)] px-4 py-4 align-top ${meta.cellClass}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon size={13} className={meta.iconClass} />
                          <span className="font-mono text-xs text-[color:var(--color-fg)]">
                            {cell.version}
                          </span>
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-[color:var(--color-fg-muted)]">
                          {meta.label}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-3xl text-xs text-[color:var(--color-fg-muted)]">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-400" /> Live
          </span>{" "}
          — installable today.
          <span className="ml-3 inline-flex items-center gap-1">
            <Clock size={12} className="text-amber-400" /> Pending
          </span>{" "}
          — publishing soon.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link
            href="https://github.com/flametrench"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 transition-colors hover:border-[color:var(--color-border-strong)]"
          >
            All repos on GitHub →
          </Link>
          <Link
            href="https://github.com/flametrench/spec"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 transition-colors hover:border-[color:var(--color-border-strong)]"
          >
            Specification →
          </Link>
        </div>
      </Container>
    </section>
  );
}
