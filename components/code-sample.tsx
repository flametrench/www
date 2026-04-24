import { codeToHtml } from "shiki";
import { Container } from "./container";

const NODE_CODE = `import { generate, encode, decode } from "@flametrench/ids";

// Generate a new user ID
generate("usr");
// → "usr_0190f2a81b3c7abc8123456789abcdef"

// Encode an existing UUID
encode("org", "01000000-0000-7000-8000-000000000000");
// → "org_01000000000070008000000000000000"

// Decode back to type + canonical UUID
decode("ses_01ffffffffff7fffbfffffffffffffff");
// → { type: "ses", uuid: "01ffffff-ffff-7fff-bfff-ffffffffffff" }
`;

const PHP_CODE = `use Flametrench\\Ids\\Id;

// Generate a new user ID
Id::generate('usr');
// → 'usr_0190f2a81b3c7abc8123456789abcdef'

// Encode an existing UUID
Id::encode('org', '01000000-0000-7000-8000-000000000000');
// → 'org_01000000000070008000000000000000'

// Decode back to type + canonical UUID
Id::decode('ses_01ffffffffff7fffbfffffffffffffff');
// → ['type' => 'ses', 'uuid' => '01ffffff-ffff-7fff-bfff-ffffffffffff']
`;

const INSTALL_NODE = `pnpm add @flametrench/ids`;
const INSTALL_PHP = `composer require flametrench/ids`;

async function highlight(code: string, lang: "ts" | "php" | "bash") {
  return codeToHtml(code, {
    lang,
    theme: "github-dark-default",
  });
}

export async function CodeSample() {
  const [nodeHtml, phpHtml, nodeInstallHtml, phpInstallHtml] = await Promise.all([
    highlight(NODE_CODE, "ts"),
    highlight(PHP_CODE, "php"),
    highlight(INSTALL_NODE, "bash"),
    highlight(INSTALL_PHP, "bash"),
  ]);

  return (
    <section className="border-b border-[color:var(--color-border)] py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-accent)]">
            The API you actually call
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Five functions. Identical across languages.
          </h2>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            <code className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 font-mono text-sm">
              encode
            </code>
            ,{" "}
            <code className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 font-mono text-sm">
              decode
            </code>
            ,{" "}
            <code className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 font-mono text-sm">
              isValid
            </code>
            ,{" "}
            <code className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 font-mono text-sm">
              typeOf
            </code>
            ,{" "}
            <code className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-1.5 py-0.5 font-mono text-sm">
              generate
            </code>
            . Byte-identical outputs for byte-identical inputs, guaranteed by
            the specification.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          {/* CSS-only tabs via radio inputs */}
          <input
            type="radio"
            name="code-sample-tabs"
            id="tab-node"
            className="peer/node sr-only"
            defaultChecked
          />
          <input
            type="radio"
            name="code-sample-tabs"
            id="tab-php"
            className="peer/php sr-only"
          />

          <div className="flex items-center border-b border-[color:var(--color-border)] px-2">
            <label
              htmlFor="tab-node"
              className="cursor-pointer border-b-2 border-transparent px-4 py-3 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors peer-checked/node:border-[color:var(--color-accent)] peer-checked/node:text-[color:var(--color-fg)]"
            >
              Node · TypeScript
            </label>
            <label
              htmlFor="tab-php"
              className="cursor-pointer border-b-2 border-transparent px-4 py-3 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors peer-checked/php:border-[color:var(--color-accent)] peer-checked/php:text-[color:var(--color-fg)]"
            >
              PHP
            </label>
          </div>

          <div className="grid">
            <div
              className="col-start-1 row-start-1 hidden peer-checked/node:block"
              aria-hidden={false}
            >
              <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 px-4 py-2 font-mono text-xs text-[color:var(--color-fg-muted)]">
                Install
              </div>
              <div
                className="px-4 py-2 [&>pre]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: nodeInstallHtml }}
              />
              <div className="border-t border-[color:var(--color-border)]" />
              <div
                className="[&>pre]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: nodeHtml }}
              />
            </div>
            <div
              className="col-start-1 row-start-1 hidden peer-checked/php:block"
              aria-hidden={false}
            >
              <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 px-4 py-2 font-mono text-xs text-[color:var(--color-fg-muted)]">
                Install
              </div>
              <div
                className="px-4 py-2 [&>pre]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: phpInstallHtml }}
              />
              <div className="border-t border-[color:var(--color-border)]" />
              <div
                className="[&>pre]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: phpHtml }}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
