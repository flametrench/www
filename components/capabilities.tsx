import { Fingerprint, Building2, ShieldCheck } from "lucide-react";
import { Container } from "./container";

const capabilities = [
  {
    icon: Fingerprint,
    name: "Identity",
    pitch: "Users, sessions, credentials, MFA.",
    body: "Password, passkey, and OIDC flows behind a single interface. Session rotation and credential revocation as first-class operations — not bolt-ons. v0.2 adds TOTP and WebAuthn (ES256 / RS256 / EdDSA) as first-class factors. v0.3 adds personal access tokens (PATs) for long-lived machine credentials.",
    prefixes: ["usr", "ses", "cred", "mfa", "pat"],
  },
  {
    icon: Building2,
    name: "Tenancy",
    pitch: "Organizations, memberships, invitations.",
    body: "Multi-tenancy as a primitive, not a pattern. Memberships carry roles. Invitations carry scoped grants. Scale from one-org-per-user to enterprise-with-sub-orgs on the same model.",
    prefixes: ["org", "mem", "inv"],
  },
  {
    icon: ShieldCheck,
    name: "Authorization",
    pitch: "Relational tuples, evaluated at the edge.",
    body: "Subject–relation–object tuples. No rule languages to learn. Check permissions with a predicate call that translates cleanly to a single SQL index seek. v0.2 adds optional rewrite rules and time-bounded share tokens.",
    prefixes: ["tup", "shr"],
  },
];

export function Capabilities() {
  return (
    <section className="border-b border-[color:var(--color-border)] py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-accent)]">
            What's covered
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Three concerns, one contract.
          </h2>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            Every application re-implements these. The specification pins the
            data model, the wire format, and the semantic edges — SDKs conform to it.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-border)] md:grid-cols-3">
          {capabilities.map(({ icon: Icon, name, pitch, body, prefixes }) => (
            <article
              key={name}
              className="flex flex-col bg-[color:var(--color-background)] p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-accent)]">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <h3 className="text-lg font-semibold">{name}</h3>
              </div>
              <p className="mt-5 text-sm font-medium text-[color:var(--color-fg)]">
                {pitch}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
                {body}
              </p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {prefixes.map((p) => (
                  <span
                    key={p}
                    className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 py-0.5 font-mono text-[11px] text-[color:var(--color-fg-muted)]"
                  >
                    {p}_
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
