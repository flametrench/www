import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "./container";

const sdks = [
  {
    name: "flametrench/spec",
    lang: "Specification",
    desc: "The normative contract. Data model, wire format, and conformance fixtures.",
    href: "https://github.com/flametrench/spec",
    status: "v0.2 RC",
  },
  {
    name: "@flametrench (Node)",
    lang: "Node 20+",
    desc: "Identity, tenancy, authz, ids, server, and Next.js adapter — pnpm monorepo.",
    href: "https://github.com/flametrench/node",
    status: "v0.2 RC",
  },
  {
    name: "flametrench (PHP)",
    lang: "PHP 8.3+",
    desc: "Identity, tenancy, authz, and ids SDKs for PHP. On Packagist.",
    href: "https://github.com/orgs/flametrench/repositories?q=php",
    status: "v0.2 RC",
  },
  {
    name: "flametrench (Python)",
    lang: "Python 3.11+",
    desc: "Identity, tenancy, authz, and ids SDKs for Python. snake_case-native.",
    href: "https://github.com/orgs/flametrench/repositories?q=python",
    status: "v0.2 RC",
  },
  {
    name: "dev.flametrench (Java)",
    lang: "Java 17+",
    desc: "Identity, tenancy, authz, and ids SDKs for Java. Records-based, Maven-published.",
    href: "https://github.com/orgs/flametrench/repositories?q=java",
    status: "v0.2 RC",
  },
];

export function SdkGrid() {
  return (
    <section className="py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-accent)]">
            SDKs
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Same semantics, every language.
          </h2>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            All Flametrench SDKs produce byte-identical outputs for the same
            inputs. The specification is the source of truth.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-border)] sm:grid-cols-2 lg:grid-cols-5">
          {sdks.map((sdk) => (
            <Link
              key={sdk.name}
              href={sdk.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col bg-[color:var(--color-background)] p-6 transition-colors hover:bg-[color:var(--color-surface)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-sm font-medium">{sdk.name}</span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-[color:var(--color-fg-faint)] transition-colors group-hover:text-[color:var(--color-accent)]"
                />
              </div>
              <p className="mt-1 text-xs font-mono text-[color:var(--color-fg-muted)]">
                {sdk.lang} · {sdk.status}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
                {sdk.desc}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
