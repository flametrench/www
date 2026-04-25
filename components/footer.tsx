import Link from "next/link";
import { LogoMark } from "./logo-mark";
import { Container } from "./container";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[color:var(--color-border)]">
      <Container className="py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-mono text-sm">
              <LogoMark size={22} className="text-[color:var(--color-fg-muted)]" />
              <span className="font-semibold">flametrench</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
              Open specification and SDK family for identity, tenancy, and authorization.
              Stewarded by NDC Digital, LLC.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm md:grid-cols-3">
            <div className="col-span-2 md:col-span-3 text-xs uppercase tracking-wider text-[color:var(--color-fg-faint)]">
              Links
            </div>
            <Link
              href="/docs/ids"
              className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
            >
              ID specification
            </Link>
            <Link
              href="https://github.com/flametrench/spec"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
            >
              Spec repo
            </Link>
            <Link
              href="https://github.com/orgs/flametrench/repositories?q=php"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
            >
              PHP SDKs
            </Link>
            <Link
              href="https://github.com/flametrench/node"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
            >
              Node monorepo
            </Link>
            <Link
              href="https://github.com/orgs/flametrench/repositories?q=python"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
            >
              Python SDKs
            </Link>
            <Link
              href="https://github.com/flametrench"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
            >
              GitHub org
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[color:var(--color-border)] pt-6 text-xs text-[color:var(--color-fg-faint)] md:flex-row md:justify-between">
          <p>© 2026 NDC Digital, LLC. Apache License 2.0.</p>
          <p className="font-mono">
            &quot;The concrete beneath a rocket launch pad.&quot;
          </p>
        </div>
      </Container>
    </footer>
  );
}
