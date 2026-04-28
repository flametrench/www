import { codeToHtml } from "shiki";
import { Container } from "./container";

// A complete admin-tool narrative in one example. The flow shows four
// distinctive moments back-to-back — each is a load-bearing primitive
// that callers usually have to invent themselves:
//
//   1. Sign-in with bearer-token sessions (token != session id;
//      only SHA-256 of the token is persisted server-side)
//   2. Invitation with pre-attached resource grants — acceptance
//      materializes the membership AND every grant in one transition
//   3. Sole-owner protection — the SDK refuses to demote the sole
//      active owner, the bug that haunts every multi-tenant SaaS
//   4. Atomic ownership transfer — promotes target before demoting
//      donor so no intermediate state has zero or two owners
//
// One example, four spec invariants. Same shape in every SDK.

const NODE_CODE = `import { InMemoryIdentityStore } from "@flametrench/identity";
import { InMemoryTenancyStore } from "@flametrench/tenancy";

const identity = new InMemoryIdentityStore();
const tenancy = new InMemoryTenancyStore();

// ─── 1. Registration ─────────────────────────────────────────────
const alice = await identity.createUser();
await identity.createPasswordCredential({
  usrId: alice.id,
  type: "password",
  identifier: "alice@example.com",
  password: "correcthorsebatterystaple",
});

// ─── 2. Sign-in returns a bearer token ──────────────────────────
// Argon2id at the OWASP floor (m=19456, t=2, p=1). The hash a Node
// SDK produces verifies byte-identically in PHP, Python, and Java.
const verified = await identity.verifyPassword({
  type: "password",
  identifier: "alice@example.com",
  password: "correcthorsebatterystaple",
});
const { session, token } = await identity.createSession({
  usrId: verified.usrId,
  credId: verified.credId,
  ttlSeconds: 3600,
});
// \`token\` is opaque and separate from \`session.id\`. Server-side
// only SHA-256(token) is stored; verifySessionToken is constant-time.

// ─── 3. Atomic invitation with pre-attached project grant ───────
const { org, ownerMembership } = await tenancy.createOrg(alice.id);
const inv = await tenancy.createInvitation({
  orgId: org.id,
  identifier: "bob@example.com",
  role: "member",
  invitedBy: alice.id,
  expiresAt: new Date(Date.now() + 7 * 86_400_000),
  preTuples: [
    { relation: "editor", objectType: "proj", objectId: "proj_42" },
  ],
});

// One transition: Bob's user + membership + the editor tuple on
// proj_42. Postgres: BEGIN/COMMIT. In-memory: equivalent atomicity.
// No half-state observable.
const { membership } = await tenancy.acceptInvitation({ invId: inv.id });

// ─── 4. Sole-owner protection ───────────────────────────────────
// Alice is the only active owner. Demoting her would leave the org
// owner-less. The SDK refuses — at the API boundary, before any
// query reaches Postgres.
try {
  await tenancy.changeRole({
    memId: ownerMembership.id,
    newRole: "member",
  });
} catch (e) {
  // SoleOwnerError — code: "forbidden.sole_owner"
}

// To leave gracefully, transfer ownership atomically. The SDK promotes
// the target first so the donor is never the sole owner of a roleless
// org during the swap.
await tenancy.transferOwnership({
  orgId: org.id,
  fromMemId: ownerMembership.id,
  toMemId: membership.id,
});
// Bob is now owner; Alice is member. Two role tuples swapped in one tx.
`;

const PHP_CODE = `use Flametrench\\Identity\\InMemoryIdentityStore;
use Flametrench\\Tenancy\\{InMemoryTenancyStore, Role, PreTuple};
use Flametrench\\Tenancy\\Exceptions\\SoleOwnerException;

$identity = new InMemoryIdentityStore();
$tenancy = new InMemoryTenancyStore();

// ─── 1. Registration ─────────────────────────────────────────────
$alice = $identity->createUser();
$identity->createPasswordCredential(
    usrId: $alice->id,
    identifier: 'alice@example.com',
    password: 'correcthorsebatterystaple',
);

// ─── 2. Sign-in returns a bearer token ──────────────────────────
// Argon2id at the OWASP floor (m=19456, t=2, p=1). The hash a PHP
// SDK produces verifies byte-identically in Node, Python, and Java.
$verified = $identity->verifyPassword('alice@example.com', 'correcthorsebatterystaple');
['session' => $session, 'token' => $token] = $identity->createSession(
    usrId: $verified->usrId,
    credId: $verified->credId,
    ttlSeconds: 3600,
);
// $token is opaque and separate from $session->id. Server-side only
// SHA-256($token) is stored; verifySessionToken is constant-time.

// ─── 3. Atomic invitation with pre-attached project grant ───────
['org' => $org, 'ownerMembership' => $aliceMem] = $tenancy->createOrg($alice->id);
$inv = $tenancy->createInvitation(
    orgId: $org->id,
    identifier: 'bob@example.com',
    role: Role::Member,
    invitedBy: $alice->id,
    expiresAt: new DateTimeImmutable('+7 days'),
    preTuples: [
        new PreTuple(relation: 'editor', objectType: 'proj', objectId: 'proj_42'),
    ],
);

// One transition: Bob's user + membership + the editor tuple on
// proj_42. Postgres: BEGIN/COMMIT. In-memory: equivalent atomicity.
['membership' => $bobMem] = $tenancy->acceptInvitation($inv->id);

// ─── 4. Sole-owner protection ───────────────────────────────────
// Alice is the only active owner. Demoting her would leave the org
// owner-less. The SDK refuses at the API boundary.
try {
    $tenancy->changeRole(memId: $aliceMem->id, newRole: Role::Member);
} catch (SoleOwnerException $e) {
    // code: forbidden.sole_owner
}

// To leave gracefully, transfer ownership atomically. The SDK promotes
// the target first so the donor is never the sole owner of a roleless
// org during the swap.
$tenancy->transferOwnership(
    orgId: $org->id,
    fromMemId: $aliceMem->id,
    toMemId: $bobMem->id,
);
// Bob is now owner; Alice is member. Two role tuples swapped in one tx.
`;

const PYTHON_CODE = `from datetime import datetime, timedelta, timezone

from flametrench_identity import InMemoryIdentityStore
from flametrench_tenancy import (
    InMemoryTenancyStore, PreTuple, Role, SoleOwnerError,
)

identity = InMemoryIdentityStore()
tenancy = InMemoryTenancyStore()

# ─── 1. Registration ─────────────────────────────────────────────
alice = identity.create_user()
identity.create_password_credential(
    usr_id=alice.id,
    identifier="alice@example.com",
    password="correcthorsebatterystaple",
)

# ─── 2. Sign-in returns a bearer token ──────────────────────────
# Argon2id at the OWASP floor (m=19456, t=2, p=1). The hash a Python
# SDK produces verifies byte-identically in Node, PHP, and Java.
verified = identity.verify_password("alice@example.com", "correcthorsebatterystaple")
result = identity.create_session(
    usr_id=verified.usr_id,
    cred_id=verified.cred_id,
    ttl_seconds=3600,
)
token = result.token  # opaque; separate from result.session.id
# Server-side only SHA-256(token) is stored; verify_session_token
# is constant-time.

# ─── 3. Atomic invitation with pre-attached project grant ───────
created = tenancy.create_org(alice.id)
inv = tenancy.create_invitation(
    org_id=created.org.id,
    identifier="bob@example.com",
    role=Role.MEMBER,
    invited_by=alice.id,
    expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    pre_tuples=[
        PreTuple(relation="editor", object_type="proj", object_id="proj_42"),
    ],
)

# One transition: Bob's user + membership + the editor tuple on
# proj_42. Postgres: BEGIN/COMMIT. In-memory: equivalent atomicity.
accepted = tenancy.accept_invitation(inv.id)

# ─── 4. Sole-owner protection ───────────────────────────────────
# Alice is the only active owner. Demoting her would leave the org
# owner-less. The SDK refuses at the API boundary.
try:
    tenancy.change_role(created.owner_membership.id, Role.MEMBER)
except SoleOwnerError as e:
    pass  # code: forbidden.sole_owner

# To leave gracefully, transfer ownership atomically. The SDK promotes
# the target first so the donor is never the sole owner of a roleless
# org during the swap.
tenancy.transfer_ownership(
    created.org.id, created.owner_membership.id, accepted.membership.id,
)
# Bob is now owner; Alice is member. Two role tuples swapped in one tx.
`;

const JAVA_CODE = `import dev.flametrench.identity.*;
import dev.flametrench.tenancy.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

var identity = new InMemoryIdentityStore();
var tenancy = new InMemoryTenancyStore();

// ─── 1. Registration ─────────────────────────────────────────────
var alice = identity.createUser();
identity.createPasswordCredential(
    alice.id(), "alice@example.com", "correcthorsebatterystaple"
);

// ─── 2. Sign-in returns a bearer token ──────────────────────────
// Argon2id at the OWASP floor (m=19456, t=2, p=1). The hash a Java
// SDK produces verifies byte-identically in Node, PHP, and Python.
var verified = identity.verifyPassword(
    "alice@example.com", "correcthorsebatterystaple"
);
var sw = identity.createSession(
    verified.usrId(), verified.credId(), 3600
);
// sw.token() is opaque and separate from sw.session().id(). Server-side
// only SHA-256(token) is stored; verifySessionToken is constant-time.

// ─── 3. Atomic invitation with pre-attached project grant ───────
var created = tenancy.createOrg(alice.id());
var inv = tenancy.createInvitation(
    created.org().id(),
    "bob@example.com",
    Role.MEMBER,
    alice.id(),
    Instant.now().plus(7, ChronoUnit.DAYS),
    List.of(new PreTuple("editor", "proj", "proj_42"))
);

// One transition: Bob's user + membership + the editor tuple on
// proj_42. Postgres: BEGIN/COMMIT. In-memory: equivalent atomicity.
var accepted = tenancy.acceptInvitation(inv.id());

// ─── 4. Sole-owner protection ───────────────────────────────────
// Alice is the only active owner. Demoting her would leave the org
// owner-less. The SDK refuses at the API boundary.
try {
    tenancy.changeRole(created.ownerMembership().id(), Role.MEMBER);
} catch (SoleOwnerError e) {
    // code: forbidden.sole_owner
}

// To leave gracefully, transfer ownership atomically. The SDK promotes
// the target first so the donor is never the sole owner of a roleless
// org during the swap.
tenancy.transferOwnership(
    created.org().id(),
    created.ownerMembership().id(),
    accepted.membership().id()
);
// Bob is now owner; Alice is member. Two role tuples swapped in one tx.
`;

const INSTALL_NODE = `pnpm add @flametrench/identity @flametrench/tenancy`;
const INSTALL_PHP = `composer require flametrench/identity flametrench/tenancy`;
const INSTALL_PYTHON = `pip install flametrench-identity flametrench-tenancy`;
const INSTALL_JAVA = `<!-- pom.xml -->
<dependency>
  <groupId>dev.flametrench</groupId>
  <artifactId>identity</artifactId>
  <version>0.2.0-rc.4</version>
</dependency>
<dependency>
  <groupId>dev.flametrench</groupId>
  <artifactId>tenancy</artifactId>
  <version>0.2.0-rc.5</version>
</dependency>`;

async function highlight(
  code: string,
  lang: "ts" | "php" | "python" | "java" | "bash" | "xml",
) {
  return codeToHtml(code, {
    lang,
    theme: "github-dark-default",
  });
}

const HIGHLIGHTS = [
  {
    title: "Bearer-token sessions, not session IDs",
    body: "verifyPassword + createSession returns an opaque token. Server stores only SHA-256(token); verifySessionToken is constant-time. Argon2id at the OWASP floor — same hash verifies in every language.",
  },
  {
    title: "Atomic invitation with pre-attached grants",
    body: "createInvitation accepts a list of pre-tuples. acceptInvitation materializes the membership AND every grant in one transition. Postgres: one BEGIN/COMMIT. In-memory: equivalent atomicity. No half-states.",
  },
  {
    title: "Sole-owner protection at the API boundary",
    body: "changeRole, suspendMembership, and selfLeave all refuse to leave an org without an active owner. The SDK rejects the call before it reaches storage — the multi-tenant bug nobody wants to debug at 2am.",
  },
  {
    title: "Atomic ownership transfer",
    body: "transferOwnership promotes the target before demoting the donor. The intermediate state with zero owners is never observable. Two role tuples swap in one transaction.",
  },
];

export async function CodeSample() {
  const [
    nodeHtml,
    phpHtml,
    pythonHtml,
    javaHtml,
    nodeInstallHtml,
    phpInstallHtml,
    pythonInstallHtml,
    javaInstallHtml,
  ] = await Promise.all([
    highlight(NODE_CODE, "ts"),
    highlight(PHP_CODE, "php"),
    highlight(PYTHON_CODE, "python"),
    highlight(JAVA_CODE, "java"),
    highlight(INSTALL_NODE, "bash"),
    highlight(INSTALL_PHP, "bash"),
    highlight(INSTALL_PYTHON, "bash"),
    highlight(INSTALL_JAVA, "xml"),
  ]);

  return (
    <section className="border-b border-[color:var(--color-border)] py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-accent)]">
            What it actually does
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Multi-tenant identity, done right.
          </h2>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            Four spec invariants in one example: bearer-token sessions,
            atomic invitation acceptance with pre-attached resource grants,
            sole-owner protection, and atomic ownership transfer.
            Byte-identical semantics in{" "}
            <span className="text-[color:var(--color-fg)]">Node</span>,{" "}
            <span className="text-[color:var(--color-fg)]">PHP</span>,{" "}
            <span className="text-[color:var(--color-fg)]">Python</span>, and{" "}
            <span className="text-[color:var(--color-fg)]">Java</span>.
          </p>
        </div>

        <div
          className="mt-10 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
          role="radiogroup"
          aria-label="Code sample language"
        >
          {/* CSS-only tabs via radio inputs. Class names are inlined per
              tab so Tailwind's static analysis sees them at build time.
              The radiogroup wrapper + sr-only inputs give correct
              semantics for assistive tech: SRs announce "Node, 1 of 4". */}
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
          <input
            type="radio"
            name="code-sample-tabs"
            id="tab-python"
            className="peer/python sr-only"
          />
          <input
            type="radio"
            name="code-sample-tabs"
            id="tab-java"
            className="peer/java sr-only"
          />

          <div className="flex items-center gap-1 overflow-x-auto border-b border-[color:var(--color-border)] px-2">
            <label
              id="tab-node-label"
              htmlFor="tab-node"
              className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors peer-checked/node:border-[color:var(--color-accent)] peer-checked/node:text-[color:var(--color-fg)]"
            >
              Node · TypeScript
            </label>
            <label
              id="tab-php-label"
              htmlFor="tab-php"
              className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors peer-checked/php:border-[color:var(--color-accent)] peer-checked/php:text-[color:var(--color-fg)]"
            >
              PHP
            </label>
            <label
              id="tab-python-label"
              htmlFor="tab-python"
              className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors peer-checked/python:border-[color:var(--color-accent)] peer-checked/python:text-[color:var(--color-fg)]"
            >
              Python
            </label>
            <label
              id="tab-java-label"
              htmlFor="tab-java"
              className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors peer-checked/java:border-[color:var(--color-accent)] peer-checked/java:text-[color:var(--color-fg)]"
            >
              Java
            </label>
          </div>

          <div className="grid">
            <div
              className="col-start-1 row-start-1 hidden peer-checked/node:block"
              aria-labelledby="tab-node-label"
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
              aria-labelledby="tab-php-label"
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
            <div
              className="col-start-1 row-start-1 hidden peer-checked/python:block"
              aria-labelledby="tab-python-label"
            >
              <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 px-4 py-2 font-mono text-xs text-[color:var(--color-fg-muted)]">
                Install
              </div>
              <div
                className="px-4 py-2 [&>pre]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: pythonInstallHtml }}
              />
              <div className="border-t border-[color:var(--color-border)]" />
              <div
                className="[&>pre]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: pythonHtml }}
              />
            </div>
            <div
              className="col-start-1 row-start-1 hidden peer-checked/java:block"
              aria-labelledby="tab-java-label"
            >
              <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 px-4 py-2 font-mono text-xs text-[color:var(--color-fg-muted)]">
                Install
              </div>
              <div
                className="px-4 py-2 [&>pre]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: javaInstallHtml }}
              />
              <div className="border-t border-[color:var(--color-border)]" />
              <div
                className="[&>pre]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: javaHtml }}
              />
            </div>
          </div>
        </div>

        {/* Highlights — the four numbered moments above, summarized so a
            reader skimming sees what each section is doing without
            reading the code line-by-line. */}
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-border)] sm:grid-cols-2">
          {HIGHLIGHTS.map((h, i) => (
            <article
              key={h.title}
              className="flex flex-col bg-[color:var(--color-background)] p-6"
            >
              <span className="font-mono text-xs text-[color:var(--color-accent)]">
                0{i + 1}
              </span>
              <h3 className="mt-2 text-base font-semibold">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
                {h.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
