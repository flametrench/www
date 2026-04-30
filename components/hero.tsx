import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "./container";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[color:var(--color-border)]">
      {/* Background layers */}
      <div className="absolute inset-0 -z-20 bg-grid" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-thrust bg-thrust-pulse"
        aria-hidden="true"
      />
      {/* Trench opening line at the bottom edge */}
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-px trench-edge"
        aria-hidden="true"
      />

      <Container>
        <div className="relative flex flex-col items-center justify-center py-28 text-center md:py-40">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-muted)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] shadow-[0_0_12px_2px_rgba(255,107,53,0.6)]" />
            Flametrench v0.2 · stable
          </div>

          <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-[color:var(--color-fg)] md:text-6xl lg:text-7xl">
            Backbone infrastructure
            <br />
            <span className="bg-gradient-to-b from-[color:var(--color-accent-2)] to-[color:var(--color-accent)] bg-clip-text text-transparent">
              for every application.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-[color:var(--color-fg-muted)] md:text-lg">
            Flametrench is an open specification and SDK family for the
            load-bearing parts of modern applications —{" "}
            <span className="text-[color:var(--color-fg)]">identity</span>,{" "}
            <span className="text-[color:var(--color-fg)]">tenancy</span>, and{" "}
            <span className="text-[color:var(--color-fg)]">authorization</span>{" "}
            — implemented the same way in every language.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/docs/ids"
              className="group inline-flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] px-6 py-3 text-sm font-medium text-black shadow-[0_0_24px_-4px_rgba(255,107,53,0.6)] transition-transform hover:-translate-y-[1px]"
            >
              Read the specification
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href="https://github.com/flametrench"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)]/60 px-6 py-3 text-sm font-medium text-[color:var(--color-fg)] backdrop-blur transition-colors hover:border-[color:var(--color-fg-faint)]"
            >
              View on GitHub
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-xs text-[color:var(--color-fg-faint)]">
            <span>UUIDv7 storage</span>
            <span aria-hidden>·</span>
            <span>Postgres native</span>
            <span aria-hidden>·</span>
            <span>Node · PHP · Python · Java</span>
            <span aria-hidden>·</span>
            <span>Apache 2.0</span>
            <span aria-hidden>·</span>
            <span>DCO, no CLA</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
