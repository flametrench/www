import Link from "next/link";

const sections = [
  {
    title: "Introduction",
    items: [{ label: "Overview", href: "/docs" }],
  },
  {
    title: "v0.1 specification",
    items: [
      { label: "Identifiers", href: "/docs/ids" },
      { label: "Identity", href: "/docs/identity" },
      { label: "Tenancy", href: "/docs/tenancy" },
      { label: "Authorization", href: "/docs/authorization" },
    ],
  },
  {
    title: "Conformance",
    items: [{ label: "How SDKs are verified", href: "/docs/conformance" }],
  },
];

export function DocsSidebar({ currentPath }: { currentPath: string }) {
  return (
    <nav aria-label="Documentation" className="sticky top-20 space-y-7 text-sm">
      {sections.map((section) => (
        <div key={section.title}>
          <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-faint)]">
            {section.title}
          </div>
          <ul className="mt-3 space-y-1">
            {section.items.map((item) => {
              const active = currentPath === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block border-l px-3 py-1.5 transition-colors ${
                      active
                        ? "border-[color:var(--color-accent)] text-[color:var(--color-fg)]"
                        : "border-[color:var(--color-border)] text-[color:var(--color-fg-muted)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-fg)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
