"use client";

import { useState } from "react";
import {
  Users,
  Building2,
  Code2,
  Coffee,
  Globe,
  Layers,
  Server,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Container } from "./container";

interface Persona {
  id: string;
  label: string;
  hook: string;
  icon: typeof Users;
  // What the visitor most likely uses today.
  current: { label: string; items: string[] };
  // What Flametrench replaces for them.
  replaces: string[];
  // What Flametrench does NOT replace — sets expectations honestly.
  doesNotReplace: string[];
  // The "what does this actually mean" pitch in their language.
  pitch: string[];
  // Concrete next step.
  cta: { label: string; href: string };
}

const PERSONAS: Persona[] = [
  {
    id: "laravel",
    label: "Laravel dev",
    hook: "Spatie · Fortify · Sanctum",
    icon: Coffee,
    current: {
      label: "What you have today",
      items: [
        "Fortify or Breeze for auth flows",
        "Sanctum or Passport for tokens",
        "spatie/laravel-permission for roles",
        "Custom org/tenant tables you wrote",
      ],
    },
    replaces: [
      "spatie/laravel-permission (replaced by flametrench/authz tuples — finer-grained than role-per-user, conformance-tested)",
      "Your hand-rolled org/membership/invitation schema (replaced by flametrench/tenancy with sole-owner protection and atomic invitation acceptance built in)",
      "Optionally Fortify (flametrench/identity offers password/passkey/OIDC + MFA if you want one less package)",
    ],
    doesNotReplace: [
      "Eloquent — Flametrench's stores are PDO-based; coexists with Eloquent in the same app",
      "Your application's domain logic — Flametrench is the load-bearing layer underneath",
      "Laravel's broadcasting / queues / scheduler",
    ],
    pitch: [
      "If you've shipped a Laravel SaaS, you've written the org → membership → invitation flow once already. Flametrench is that code — conformance-tested across five languages, with sole-owner protection, atomic invitation acceptance, and revoke-and-re-add role lifecycle baked in.",
      "spatie/laravel-permission gives you $user->hasRole('admin'). Flametrench gives you $store->check($subject, 'admin', 'org', $orgId) — same idea, per-resource grain. The flametrench/laravel package wires it into the service container; on an external IdP, skip flametrench/identity and bridge from your user table.",
    ],
    cta: { label: "Read the PHP SDK docs →", href: "https://github.com/flametrench/authz-php" },
  },
  {
    id: "nextjs",
    label: "Next.js dev",
    hook: "NextAuth · Clerk · Auth.js",
    icon: Layers,
    current: {
      label: "What you have today",
      items: [
        "NextAuth.js / Auth.js for sign-in",
        "Or Clerk's React components",
        "App Router with server actions",
        "Whatever you've cobbled together for permissions",
      ],
    },
    replaces: [
      "Optional: your auth library (flametrench-identity for password/passkey/OIDC + MFA if you want it)",
      "Your hand-rolled permission checks (flametrench-authz tuples + check())",
      "Whatever you wrote for tenancy (flametrench-tenancy with org/membership/invitation primitives)",
    ],
    doesNotReplace: [
      "Next.js's caching, RSC, or route handler model",
      "Your IdP if you're already on Clerk/Auth0/etc. — bridge through usr_id (one foreign key)",
      "Your database choice — Postgres-backed adapters ship; bring your own pg pool",
    ],
    pitch: [
      "@flametrench/nextjs is an App Router adapter — getSession() in server components, route handlers for /api/auth/*, cookie-backed sessions with rotation. If you've written this before, you know the surface.",
      "The interesting part isn't the auth — most teams have that. It's organizations, memberships, invitations with atomic acceptance, and check(user, 'editor', project). NextAuth doesn't ship those; Flametrench does. Already on Clerk? Keep it; bridge with one foreign key.",
    ],
    cta: { label: "Read the Node SDK docs →", href: "https://github.com/flametrench/node" },
  },
  {
    id: "django",
    label: "Python / Django dev",
    hook: "django-allauth · django-guardian",
    icon: Code2,
    current: {
      label: "What you have today",
      items: [
        "django.contrib.auth or django-allauth",
        "django-guardian for object-level perms",
        "django-tenants or your own org model",
        "Custom invitation flows",
      ],
    },
    replaces: [
      "django-guardian (replaced by flametrench-authz — same per-object grant idea, multi-language conformance suite, no Django ORM coupling)",
      "Your custom org/membership tables (replaced by flametrench-tenancy)",
      "Optional: django-allauth (flametrench-identity covers password/passkey/OIDC + MFA — Argon2id-pinned at the spec floor)",
    ],
    doesNotReplace: [
      "Django itself — the Python SDK is psycopg-based, framework-agnostic; works in FastAPI, Flask, or Django",
      "Django ORM — Flametrench's stores own their tables; your models stay untouched",
      "Your sign-in views or templates — only the underlying primitives",
    ],
    pitch: [
      "django-guardian's per-object permissions get you most of the way to Flametrench's tuple model. The difference: Flametrench is conformance-tested across four SDKs, so the same authz semantics work whether the call site is Django, FastAPI, or a Node service.",
      "Postgres-backed stores use psycopg directly — no ORM, no Django framework dependency. Drop them into any Python service. Argon2id is pinned at the OWASP floor and byte-identical across all five SDK families.",
    ],
    cta: { label: "Read the Python SDK docs →", href: "https://github.com/flametrench/authz-python" },
  },
  {
    id: "java",
    label: "Java / Spring dev",
    hook: "Spring Security · Keycloak",
    icon: Server,
    current: {
      label: "What you have today",
      items: [
        "Spring Security for auth + method-level checks",
        "Keycloak (or commercial IdP) for sign-in",
        "Custom @PreAuthorize expressions",
        "Hand-rolled tenant/org tables",
      ],
    },
    replaces: [
      "Spring Security ACLs and @PreAuthorize role checks (replaced by flametrench-authz tuples — testable without the Spring context)",
      "Custom tenant/org/membership schema (replaced by flametrench-tenancy)",
      "Optional: Spring Security's user storage (flametrench-identity for password/passkey/OIDC + MFA)",
    ],
    doesNotReplace: [
      "Spring Boot / Spring Framework — Java SDK is plain JDBC + javax.sql.DataSource",
      "Keycloak / your IdP — bridge through usr_id (one foreign key per user)",
      "Your existing controllers / service layer",
    ],
    pitch: [
      "Spring Security ACLs are a permission graph that lives in your JVM and dies with it. Flametrench's tuples are the same shape but stored as plain Postgres rows any service in any language can read. Same predicate as @PreAuthorize, durable answer.",
      "Records-based, JDK 17+, plain JDBC — no Spring framework dependency; works in Quarkus, Micronaut, or anything else with a DataSource. Already on Keycloak? Bridge from the sub claim to a Flametrench usr_id and skip flametrench-identity.",
    ],
    cta: { label: "Read the Java SDK docs →", href: "https://github.com/flametrench/authz-java" },
  },
  {
    id: "solo",
    label: "Solo SaaS founder",
    hook: "MVP · keep the bill small",
    icon: Sparkles,
    current: {
      label: "What you have today",
      items: [
        "An idea and ~3 weekends to ship the MVP",
        "Probably Auth0/Clerk free tier",
        "A growing list of TODOs around invitations, roles, billing tiers",
        "An eye on every SaaS bill",
      ],
    },
    replaces: [
      "Auth0/Clerk subscription if you scale past their free tier (flametrench-identity is open source, no per-MAU pricing)",
      "Hand-rolled org/membership/invitation logic (the part where you forget sole-owner protection on first try)",
      "The hand-rolled permission system you'll regret in six months",
    ],
    doesNotReplace: [
      "Stripe — billing is out of scope for Flametrench (sub_ prefix reserved, no active plan)",
      "Your domain logic — Flametrench is the boring substrate, not your product",
      "Marketing, customer support, or anything else that actually grows the business",
    ],
    pitch: [
      "Auth0 charges per MAU. Clerk charges per user. Flametrench is open-source code on your own Postgres — pricing is the cost of your existing infrastructure.",
      "More importantly, most solo-SaaS authz bugs come from the same three places: roles imply other roles wrong, invitation acceptance has a race, sole-owner protection forgot a code path. Flametrench tests all three. You inherit the bug fixes other adopters' incidents already paid for.",
    ],
    cta: { label: "Read the spec →", href: "https://github.com/flametrench/spec" },
  },
  {
    id: "b2b",
    label: "B2B platform engineer",
    hook: "Multi-tenant · audit-ready",
    icon: Building2,
    current: {
      label: "What you have today",
      items: [
        "A multi-tenant app with sub-org needs",
        "Compliance asks (SOC 2, audit trails)",
        "Org admins and member role lifecycles",
        "Custom \"transfer ownership\" flow that's never quite right",
      ],
    },
    replaces: [
      "Hand-rolled membership lifecycle (revoke-and-re-add role chain, replaces audit history, sole-owner protection, role hierarchy on admin-remove)",
      "Custom invitation flow (atomic acceptance with pre-tuple materialization; ADR 0009 acceptance binding closes the privilege-escalation primitive)",
      "Whatever you've cobbled together for permission checks (per-resource tuples, opt-in rewrite rules for role hierarchies, conformance-tested)",
    ],
    doesNotReplace: [
      "Your audit log infrastructure — aud_ prefix is reserved for v0.4+ (ADR 0019) but the tenancy operations expose enough metadata (replaces chain, removedBy, terminalBy, terminalAt) to log durably today",
      "Your SOC 2 program — but the ADRs document every load-bearing security decision so your auditors don't have to take your word for anything",
      "RLS at the database level — postgres-rls.sql is provided as an optional companion to the reference schema",
    ],
    pitch: [
      "B2B tenancy has sharp edges. \"What if the only owner gets revoked?\" \"What if two admins remove the same member?\" \"What if an invitation is accepted by the wrong account?\" Flametrench has explicit, conformance-tested answers to all three.",
      "Role changes use revoke-and-re-add: Bob from member → admin revokes the old tuple and creates an admin one with a replaces link. Tamper-evident audit history, deterministic \"who promoted Bob?\" answer. v0.2 also ships opt-in rewrite rules for declarative role hierarchies.",
    ],
    cta: { label: "Read the tenancy spec →", href: "https://github.com/flametrench/spec/blob/main/docs/tenancy.md" },
  },
  {
    id: "external-idp",
    label: "Already have Auth0 / Clerk",
    hook: "Don't make me migrate auth",
    icon: Globe,
    current: {
      label: "What you have today",
      items: [
        "An IdP you've integrated and don't want to re-do",
        "Sign-in / MFA / password reset already solved",
        "...and the same custom org + permissions code as everyone else",
      ],
    },
    replaces: [
      "Your custom org/membership/invitation tables (flametrench-tenancy)",
      "Your hand-rolled permission checks (flametrench-authz)",
      "NOT your IdP — flametrench-identity is optional and skipped",
    ],
    doesNotReplace: [
      "Your existing auth provider — Auth0/Clerk/Cognito/Okta/WorkOS/Entra all coexist via the usr_ bridge pattern",
      "Your sign-in UI or password reset flow",
      "Your IdP's billing — that conversation is between you and them",
    ],
    pitch: [
      "Flametrench's identity package is optional. Already on Auth0/Clerk/Cognito? Keep it. The bridge is one foreign key: on first sign-in, mint a Flametrench usr_id keyed by your IdP's sub claim. Every downstream tenancy and authz call uses that usr_id.",
      "What Flametrench fills is what most IdPs don't: the org / membership / permission layer. Auth0 has \"organizations\" but their semantics are thin — no role lifecycle, no invitation atomicity, no authorization tuples. Flametrench fills that gap.",
    ],
    cta: { label: "Read the IdP coexistence guide →", href: "https://github.com/flametrench/spec/blob/main/docs/external-idps.md" },
  },
];

export function PersonaPicker() {
  const [activeId, setActiveId] = useState(PERSONAS[0]!.id);
  const active = PERSONAS.find((p) => p.id === activeId)!;
  const ActiveIcon = active.icon;

  return (
    <section className="border-b border-[color:var(--color-border)] py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-accent)]">
            Who are you?
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Flametrench, in your stack&rsquo;s vocabulary.
          </h2>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            Pick the closest match and we&rsquo;ll explain what Flametrench
            replaces, what it leaves alone, and what you actually get — in the
            libraries and patterns you already use.
          </p>
        </div>

        {/* Persona buttons */}
        <div className="mt-10 flex flex-wrap gap-2">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveId(p.id)}
                aria-pressed={isActive}
                className={`group inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-left transition-colors ${
                  isActive
                    ? "border-[color:var(--color-accent)] bg-[rgba(255,107,53,0.08)] text-[color:var(--color-fg)]"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-fg-muted)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-fg)]"
                }`}
              >
                <Icon
                  size={15}
                  className={
                    isActive
                      ? "text-[color:var(--color-accent)]"
                      : "text-[color:var(--color-fg-faint)] group-hover:text-[color:var(--color-fg-muted)]"
                  }
                />
                <span className="text-sm font-medium">{p.label}</span>
                <span className="hidden text-xs text-[color:var(--color-fg-faint)] sm:inline">
                  · {p.hook}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active persona pitch */}
        <div className="mt-8 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-background)] text-[color:var(--color-accent)]">
              <ActiveIcon size={20} strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-lg font-semibold">{active.label}</h3>
              <p className="font-mono text-xs text-[color:var(--color-fg-muted)]">
                {active.hook}
              </p>
            </div>
          </div>

          {/* Pitch paragraphs */}
          <div className="mt-7 space-y-4 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
            {active.pitch.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Replaces / doesn't replace */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-faint)]">
                What Flametrench replaces
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {active.replaces.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle2
                      size={14}
                      className="mt-1 shrink-0 text-emerald-400"
                    />
                    <span className="text-[color:var(--color-fg-muted)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-faint)]">
                What it doesn&rsquo;t
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {active.doesNotReplace.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <XCircle
                      size={14}
                      className="mt-1 shrink-0 text-[color:var(--color-fg-faint)]"
                    />
                    <span className="text-[color:var(--color-fg-muted)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 border-t border-[color:var(--color-border)] pt-6">
            <Link
              href={active.cta.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-accent)] hover:underline"
            >
              {active.cta.label}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
