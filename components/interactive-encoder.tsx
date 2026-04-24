"use client";

import { useState, useCallback } from "react";
import { Shuffle, Copy, Check } from "lucide-react";
import {
  encode,
  decode,
  generate,
  TYPES,
  InvalidIdError,
  InvalidTypeError,
  type IdType,
} from "@/lib/ids";
import { Container } from "./container";

const REGISTERED_TYPES = Object.keys(TYPES) as IdType[];

export function InteractiveEncoder() {
  const [type, setType] = useState<IdType>("usr");
  const [uuid, setUuid] = useState<string>("0190f2a8-1b3c-7abc-8123-456789abcdef");
  const [copied, setCopied] = useState(false);

  const randomize = useCallback(() => {
    const id = generate(type);
    const canonicalUuid = decode(id).uuid;
    setUuid(canonicalUuid);
  }, [type]);

  let encoded: string | null = null;
  let decoded: { type: string; uuid: string } | null = null;
  let error: string | null = null;

  try {
    encoded = encode(type, uuid);
    decoded = decode(encoded);
  } catch (e) {
    if (e instanceof InvalidIdError || e instanceof InvalidTypeError) {
      error = e.message;
    } else {
      error = "Unknown error";
    }
  }

  const copy = useCallback(async () => {
    if (!encoded) return;
    await navigator.clipboard.writeText(encoded);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [encoded]);

  return (
    <section className="border-b border-[color:var(--color-border)] py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-accent)]">
            Try it
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Live in your browser. Same SDK, same output.
          </h2>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            This widget runs{" "}
            <code className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 font-mono text-sm">
              @flametrench/ids
            </code>{" "}
            directly. The same bytes come out on the server, in PHP, and in any
            conforming SDK.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <div className="grid grid-cols-1 gap-px bg-[color:var(--color-border)] md:grid-cols-[200px_1fr]">
            <div className="bg-[color:var(--color-surface)] p-5">
              <label
                htmlFor="type-select"
                className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-muted)]"
              >
                Type
              </label>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {REGISTERED_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded border px-2 py-1 font-mono text-xs transition-colors ${
                      t === type
                        ? "border-[color:var(--color-accent)] bg-[rgba(255,107,53,0.12)] text-[color:var(--color-fg)]"
                        : "border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-muted)] hover:border-[color:var(--color-border-strong)]"
                    }`}
                  >
                    {t}_
                  </button>
                ))}
              </div>
              <p className="mt-3 font-mono text-[11px] text-[color:var(--color-fg-faint)]">
                {TYPES[type]}
              </p>
            </div>

            <div className="bg-[color:var(--color-surface)] p-5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="uuid-input"
                  className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-muted)]"
                >
                  UUIDv7
                </label>
                <button
                  type="button"
                  onClick={randomize}
                  className="inline-flex items-center gap-1.5 rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-2 py-1 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-fg)]"
                >
                  <Shuffle size={12} />
                  Randomize
                </button>
              </div>
              <input
                id="uuid-input"
                type="text"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                className="mt-3 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-3 py-2 font-mono text-sm text-[color:var(--color-fg)] outline-none transition-colors focus:border-[color:var(--color-accent)]"
                placeholder="0190f2a8-1b3c-7abc-8123-456789abcdef"
              />
              <p className="mt-2 font-mono text-[11px] text-[color:var(--color-fg-faint)]">
                Canonical hyphenated form. Uppercase will be normalized by{" "}
                <code className="font-mono">encode()</code>.
              </p>
            </div>
          </div>

          <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-background)] p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-muted)]">
                encode(type, uuid) →
              </span>
              {encoded && (
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 py-1 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-fg)]"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-[color:var(--color-accent)]" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
            {error ? (
              <div className="mt-3 rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 font-mono text-sm text-red-300">
                {error}
              </div>
            ) : (
              <div className="mt-3 break-all rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 font-mono text-sm text-[color:var(--color-fg)]">
                <span className="text-[color:var(--color-accent)]">{encoded?.split("_")[0]}_</span>
                <span>{encoded?.split("_")[1]}</span>
              </div>
            )}

            {decoded && !error && (
              <>
                <div className="mt-5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-muted)]">
                  decode(encoded) →
                </div>
                <pre className="mt-3 overflow-x-auto rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5 font-mono text-xs leading-relaxed text-[color:var(--color-fg-muted)]">
{`{
  type: "${decoded.type}",
  uuid: "${decoded.uuid}"
}`}
                </pre>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
