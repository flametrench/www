import { CheckCircle2, Circle, CircleDashed } from "lucide-react";
import { Container } from "./container";

const milestones: Array<{
  version: string;
  status: "shipped" | "in-progress" | "planned";
  title: string;
  items: string[];
}> = [
  {
    version: "v0.1",
    status: "in-progress",
    title: "Contract-first foundations",
    items: [
      "Identity, tenancy, and authorization specification",
      "Cross-SDK conformance suite (10 fixtures, 70+ tests)",
      "Node, PHP, Python, and Java SDKs at full v0.1 parity",
      "Cross-language Argon2id parity proven across all four SDKs",
      "Postgres reference data model",
    ],
  },
  {
    version: "v0.2",
    status: "planned",
    title: "Operational surface",
    items: [
      "Rewrite rules for authz",
      "MFA + WebAuthn assertion verification",
      "Audit events (aud_…)",
      "Notifications (not_…)",
      "Files (file_…)",
    ],
  },
  {
    version: "v0.3+",
    status: "planned",
    title: "Platform breadth",
    items: [
      "Admin UI reference implementation",
      "Laravel SDK (flametrench/laravel)",
      "Feature flags (flag_…) and billing hooks (sub_…)",
      "Additional language SDKs",
    ],
  },
];

const STATUS_META = {
  shipped: {
    label: "Shipped",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
  "in-progress": {
    label: "In progress",
    icon: CircleDashed,
    color: "text-[color:var(--color-accent)]",
  },
  planned: {
    label: "Planned",
    icon: Circle,
    color: "text-[color:var(--color-fg-faint)]",
  },
} as const;

export function Roadmap() {
  return (
    <section className="border-b border-[color:var(--color-border)] py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-accent)]">
            Roadmap
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            What ships, and when.
          </h2>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            Versions track the specification, not the SDKs. Every SDK is
            conforming at every spec version.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {milestones.map(({ version, status, title, items }) => {
            const { label, icon: Icon, color } = STATUS_META[status];
            return (
              <article
                key={version}
                className="flex flex-col rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold">{version}</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs ${color}`}>
                    <Icon size={14} strokeWidth={2} />
                    {label}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-medium">{title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-[color:var(--color-fg-muted)]">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-px w-3 shrink-0 bg-[color:var(--color-border-strong)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
