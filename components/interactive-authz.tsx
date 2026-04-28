"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, Plus, X } from "lucide-react";
import { Container } from "./container";

// Educational interactive: a live authz check() against an in-memory
// tuple store. Pre-populated to demonstrate the default exact-match
// invariant — admin doesn't imply editor, org membership doesn't imply
// project access, etc. Most authz libraries silently allow these
// inferences; Flametrench rejects them at the API boundary unless an
// adopter explicitly opts into v0.2 rewrite rules (ADR 0007).
//
// The widget reimplements the authz primitive in ~20 lines because the
// full SDK pulls in node:crypto for tup_ id generation. The semantics
// here match @flametrench/authz's default exact-match path exactly.

type Tuple = {
  subjectId: string;
  relation: string;
  objectType: string;
  objectId: string;
};

const SEED_TUPLES: Tuple[] = [
  { subjectId: "alice", relation: "owner", objectType: "org", objectId: "acme" },
  { subjectId: "alice", relation: "editor", objectType: "proj", objectId: "42" },
  { subjectId: "bob", relation: "admin", objectType: "org", objectId: "acme" },
  { subjectId: "bob", relation: "viewer", objectType: "proj", objectId: "42" },
  { subjectId: "carol", relation: "member", objectType: "org", objectId: "acme" },
];

const SUBJECTS = ["alice", "bob", "carol", "dan"];
const RELATIONS = [
  "owner",
  "admin",
  "member",
  "editor",
  "viewer",
  "guest",
];
const OBJECTS: Array<{ type: string; id: string; label: string }> = [
  { type: "org", id: "acme", label: "org_acme" },
  { type: "proj", id: "42", label: "proj_42" },
];

interface PresetQuery {
  subject: string;
  relation: string;
  objectType: string;
  objectId: string;
  expectedAllowed: boolean;
  takeaway: string;
}

const PRESETS: PresetQuery[] = [
  {
    subject: "alice",
    relation: "editor",
    objectType: "proj",
    objectId: "42",
    expectedAllowed: true,
    takeaway: "Exact match. The tuple (alice, editor, proj_42) exists.",
  },
  {
    subject: "alice",
    relation: "owner",
    objectType: "proj",
    objectId: "42",
    expectedAllowed: false,
    takeaway:
      "Alice is owner of org_acme but no tuple grants her ownership of proj_42 — no parent-child inheritance from org membership.",
  },
  {
    subject: "alice",
    relation: "viewer",
    objectType: "proj",
    objectId: "42",
    expectedAllowed: false,
    takeaway:
      "Alice has editor on proj_42, but editor does NOT imply viewer by default. v0.2 lets adopters add a `viewer ⊆ editor` rewrite rule explicitly.",
  },
  {
    subject: "bob",
    relation: "editor",
    objectType: "org",
    objectId: "acme",
    expectedAllowed: false,
    takeaway:
      "Bob is admin on org_acme. Admin does NOT imply editor by default. There's no role-implication graph until an adopter declares one.",
  },
  {
    subject: "carol",
    relation: "viewer",
    objectType: "proj",
    objectId: "42",
    expectedAllowed: false,
    takeaway:
      "Carol is a member of org_acme but has no tuple on proj_42. Org membership doesn't propagate to org-owned projects automatically.",
  },
  {
    subject: "dan",
    relation: "owner",
    objectType: "org",
    objectId: "acme",
    expectedAllowed: false,
    takeaway: "Dan has no tuples. The empty-store case is always denied.",
  },
];

function check(
  tuples: Tuple[],
  subjectId: string,
  relation: string,
  objectType: string,
  objectId: string,
): { allowed: boolean; matched: Tuple | null } {
  for (const t of tuples) {
    if (
      t.subjectId === subjectId &&
      t.relation === relation &&
      t.objectType === objectType &&
      t.objectId === objectId
    ) {
      return { allowed: true, matched: t };
    }
  }
  return { allowed: false, matched: null };
}

export function InteractiveAuthz() {
  const [tuples, setTuples] = useState<Tuple[]>(SEED_TUPLES);
  const [subject, setSubject] = useState("alice");
  const [relation, setRelation] = useState("editor");
  const [objectKey, setObjectKey] = useState("proj:42");

  const [objectType, objectId] = objectKey.split(":");

  const result = useMemo(
    () => check(tuples, subject, relation, objectType!, objectId!),
    [tuples, subject, relation, objectType, objectId],
  );

  const applyPreset = (p: PresetQuery) => {
    setSubject(p.subject);
    setRelation(p.relation);
    setObjectKey(`${p.objectType}:${p.objectId}`);
  };

  const removeTuple = (idx: number) => {
    setTuples((current) => current.filter((_, i) => i !== idx));
  };

  const reset = () => setTuples(SEED_TUPLES);

  return (
    <section className="border-b border-[color:var(--color-border)] py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-accent)]">
            Try it · live authz check
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            What &ldquo;no derivation&rdquo; actually means.
          </h2>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            Most authz libraries silently let{" "}
            <span className="font-mono text-[color:var(--color-fg)]">admin</span>{" "}
            imply{" "}
            <span className="font-mono text-[color:var(--color-fg)]">editor</span>{" "}
            and let org membership imply project access. Flametrench
            doesn&rsquo;t — by default. Every check is exact-match on the
            5-tuple natural key. v0.2 adds optional rewrite rules for adopters
            who want role hierarchies, but you opt in, not out. Click a preset
            query to see what passes — and what doesn&rsquo;t.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-border)] lg:grid-cols-2">
          {/* Tuple store */}
          <div className="bg-[color:var(--color-surface)] p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-muted)]">
                Active tuples ({tuples.length})
              </span>
              <button
                type="button"
                onClick={reset}
                className="font-mono text-[11px] text-[color:var(--color-fg-faint)] hover:text-[color:var(--color-fg)] transition-colors"
              >
                Reset
              </button>
            </div>
            <ul className="mt-3 space-y-1.5">
              {tuples.map((t, i) => {
                const isMatch =
                  result.matched &&
                  result.matched.subjectId === t.subjectId &&
                  result.matched.relation === t.relation &&
                  result.matched.objectType === t.objectType &&
                  result.matched.objectId === t.objectId;
                return (
                  <li
                    key={`${t.subjectId}-${t.relation}-${t.objectType}-${t.objectId}-${i}`}
                    className={`group flex items-center justify-between gap-2 rounded-md border px-3 py-2 font-mono text-xs transition-colors ${
                      isMatch
                        ? "border-[color:var(--color-accent)] bg-[rgba(255,107,53,0.08)] text-[color:var(--color-fg)]"
                        : "border-[color:var(--color-border)] bg-[color:var(--color-background)] text-[color:var(--color-fg-muted)]"
                    }`}
                  >
                    <span className="truncate">
                      <span className="text-[color:var(--color-accent)]">usr_</span>
                      {t.subjectId}, {t.relation}, {t.objectType}_{t.objectId}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTuple(i)}
                      className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded text-[color:var(--color-fg-muted)] opacity-60 transition-opacity hover:text-[color:var(--color-fg)] hover:opacity-100 group-hover:opacity-100 sm:opacity-0"
                      aria-label="Remove tuple"
                    >
                      <X size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 font-mono text-[11px] text-[color:var(--color-fg-faint)]">
              Each row is one (subject, relation, object) tuple in the store.
              No rules engine; no inference; no rewrite.
            </p>
          </div>

          {/* Check form + result */}
          <div className="bg-[color:var(--color-surface)] p-5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-muted)]">
              check()
            </span>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-fg-faint)]">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-2 py-1.5 font-mono text-xs text-[color:var(--color-fg)] outline-none focus:border-[color:var(--color-accent)]"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      usr_{s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-fg-faint)]">
                  Relation
                </label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-2 py-1.5 font-mono text-xs text-[color:var(--color-fg)] outline-none focus:border-[color:var(--color-accent)]"
                >
                  {RELATIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-fg-faint)]">
                  Object
                </label>
                <select
                  value={objectKey}
                  onChange={(e) => setObjectKey(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-2 py-1.5 font-mono text-xs text-[color:var(--color-fg)] outline-none focus:border-[color:var(--color-accent)]"
                >
                  {OBJECTS.map((o) => (
                    <option key={`${o.type}:${o.id}`} value={`${o.type}:${o.id}`}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result panel — aria-live so screen-reader users hear
                ALLOWED/DENIED change as they edit the inputs. polite =
                announce on next idle, atomic = read the whole region as
                one update (so SR doesn't string-diff and miss the
                allowed→denied flip when tuples flip in lockstep). */}
            <div
              aria-live="polite"
              aria-atomic="true"
              className={`mt-5 rounded-md border px-4 py-3 transition-colors ${
                result.allowed
                  ? "border-emerald-700/60 bg-emerald-950/30"
                  : "border-[color:var(--color-border)] bg-[color:var(--color-background)]"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.allowed ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="font-mono text-xs font-medium text-emerald-300">
                      ALLOWED
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-[color:var(--color-fg-faint)]" />
                    <span className="font-mono text-xs font-medium text-[color:var(--color-fg-muted)]">
                      DENIED
                    </span>
                  </>
                )}
              </div>
              {result.matched && (
                <p className="mt-2 break-all font-mono text-[11px] text-[color:var(--color-fg-muted)]">
                  matched:{" "}
                  <span className="text-[color:var(--color-fg)]">
                    (usr_{result.matched.subjectId}, {result.matched.relation},{" "}
                    {result.matched.objectType}_{result.matched.objectId})
                  </span>
                </p>
              )}
              {!result.allowed && (
                <p className="mt-2 font-mono text-[11px] text-[color:var(--color-fg-faint)]">
                  No tuple with this exact 5-key exists.
                </p>
              )}
            </div>

            <pre className="mt-4 overflow-x-auto rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-3 py-2.5 font-mono text-[11px] leading-relaxed text-[color:var(--color-fg-muted)]">
{`store.check({
  subjectType: "usr",
  subjectId: "${subject}",
  relation: "${relation}",
  objectType: "${objectType}",
  objectId: "${objectId}"
})
// → { allowed: ${result.allowed}${
              result.allowed
                ? `, matchedTupleId: "tup_..." `
                : `, matchedTupleId: null `
            }}`}
            </pre>
          </div>
        </div>

        {/* Preset query gallery */}
        <div className="mt-10">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-muted)]">
            Preset queries — click to load
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
            {PRESETS.map((p, i) => {
              const isActive =
                p.subject === subject &&
                p.relation === relation &&
                p.objectType === objectType &&
                p.objectId === objectId;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`group flex flex-col gap-1 rounded-lg border p-4 text-left transition-colors ${
                    isActive
                      ? "border-[color:var(--color-accent)] bg-[rgba(255,107,53,0.06)]"
                      : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:border-[color:var(--color-border-strong)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {p.expectedAllowed ? (
                      <CheckCircle2
                        size={14}
                        className="shrink-0 text-emerald-400"
                      />
                    ) : (
                      <XCircle
                        size={14}
                        className="shrink-0 text-[color:var(--color-fg-faint)]"
                      />
                    )}
                    <span className="font-mono text-xs text-[color:var(--color-fg)]">
                      check(usr_{p.subject}, {p.relation}, {p.objectType}_
                      {p.objectId})
                    </span>
                  </div>
                  <p className="ml-6 text-xs leading-relaxed text-[color:var(--color-fg-muted)]">
                    {p.takeaway}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="mt-4 font-mono text-[11px] text-[color:var(--color-fg-faint)]">
            All six queries run the same check() primitive against the same
            store. The outcome depends only on whether an exact-match tuple
            exists — not on roles you might assume are equivalent.
          </p>
          <p className="mt-3 text-xs text-[color:var(--color-fg-muted)]">
            Want role hierarchies?{" "}
            <a
              href="https://github.com/flametrench/spec/blob/main/decisions/0007-rewrite-rules.md"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--color-accent)] hover:underline"
            >
              v0.2 rewrite rules (ADR 0007)
            </a>{" "}
            let adopters declare{" "}
            <span className="font-mono text-[color:var(--color-fg)]">computed_userset</span>
            {" "}(role implication) and{" "}
            <span className="font-mono text-[color:var(--color-fg)]">tuple_to_userset</span>
            {" "}(parent-child inheritance) explicitly, with depth and fan-out caps.
          </p>
        </div>
      </Container>
    </section>
  );
}
