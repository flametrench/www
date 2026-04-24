import Link from "next/link";
import { FlameMark } from "./flame-mark";
import { Container } from "./container";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-border)] bg-[color:var(--color-background)]/85 backdrop-blur">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 font-mono text-sm tracking-tight"
            aria-label="Flametrench home"
          >
            <FlameMark size={18} className="text-[color:var(--color-fg-muted)] transition-colors group-hover:text-[color:var(--color-fg)]" />
            <span className="font-semibold">flametrench</span>
            <span className="rounded border border-[color:var(--color-border)] px-1.5 py-[1px] font-sans text-[10px] uppercase tracking-wider text-[color:var(--color-fg-muted)]">
              v0.1 · draft
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-[color:var(--color-fg-muted)]">
            <Link href="/docs/ids" className="transition-colors hover:text-[color:var(--color-fg)]">
              Docs
            </Link>
            <Link
              href="https://github.com/flametrench"
              className="transition-colors hover:text-[color:var(--color-fg)]"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
