import { codeToHtml } from "shiki";
import { Container } from "./container";

// The distinctive flow: register a user, create an org, invite a teammate
// with a pre-attached resource grant. Acceptance materializes BOTH the
// membership and the grant in a single transition. This is the killer
// story — most other libraries treat invitations as state-machine glue
// you wire up yourself; Flametrench makes it one atomic call.

const NODE_CODE = `import { InMemoryIdentityStore } from "@flametrench/identity";
import { InMemoryTenancyStore } from "@flametrench/tenancy";

const identity = new InMemoryIdentityStore();
const tenancy = new InMemoryTenancyStore();

// Alice signs up.
const alice = await identity.createUser();
await identity.createPasswordCredential({
  usrId: alice.id,
  type: "password",
  identifier: "alice@example.com",
  password: "correcthorsebatterystaple",
});

// Alice creates an org and invites Bob — with editor access on a project
// pre-attached to the invitation. Acceptance materializes BOTH the
// membership AND the project grant in one transition.
const { org } = await tenancy.createOrg(alice.id);
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

const { materializedTuples } = await tenancy.acceptInvitation({
  invId: inv.id,
});

// One transaction: Bob's membership AND his editor grant on proj_42.
// In Postgres: one BEGIN/COMMIT. In-memory: equivalent atomicity.
console.log(materializedTuples.map(t => \`\${t.relation}:\${t.objectId}\`));
// → [ "member:org_...", "editor:proj_42" ]
`;

const PHP_CODE = `use Flametrench\\Identity\\InMemoryIdentityStore;
use Flametrench\\Tenancy\\{InMemoryTenancyStore, Role, PreTuple};

$identity = new InMemoryIdentityStore();
$tenancy = new InMemoryTenancyStore();

// Alice signs up.
$alice = $identity->createUser();
$identity->createPasswordCredential(
    usrId: $alice->id,
    identifier: 'alice@example.com',
    password: 'correcthorsebatterystaple',
);

// Alice creates an org and invites Bob — with editor access on a project
// pre-attached to the invitation. Acceptance materializes BOTH the
// membership AND the project grant in one transition.
['org' => $org] = $tenancy->createOrg($alice->id);
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

['materializedTuples' => $tuples] = $tenancy->acceptInvitation($inv->id);

// One transaction: Bob's membership AND his editor grant on proj_42.
print_r(array_map(fn($t) => "{$t->relation}:{$t->objectId}", $tuples));
// → [ 'member:org_...', 'editor:proj_42' ]
`;

const PYTHON_CODE = `from datetime import datetime, timedelta, timezone

from flametrench_identity import InMemoryIdentityStore
from flametrench_tenancy import InMemoryTenancyStore, PreTuple, Role

identity = InMemoryIdentityStore()
tenancy = InMemoryTenancyStore()

# Alice signs up.
alice = identity.create_user()
identity.create_password_credential(
    usr_id=alice.id,
    identifier="alice@example.com",
    password="correcthorsebatterystaple",
)

# Alice creates an org and invites Bob — with editor access on a project
# pre-attached to the invitation. Acceptance materializes BOTH the
# membership AND the project grant in one transition.
result = tenancy.create_org(alice.id)
inv = tenancy.create_invitation(
    org_id=result.org.id,
    identifier="bob@example.com",
    role=Role.MEMBER,
    invited_by=alice.id,
    expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    pre_tuples=[
        PreTuple(relation="editor", object_type="proj", object_id="proj_42"),
    ],
)

accepted = tenancy.accept_invitation(inv.id)

# One transaction: Bob's membership AND his editor grant on proj_42.
print([f"{t.relation}:{t.object_id}" for t in accepted.materialized_tuples])
# → ['member:org_...', 'editor:proj_42']
`;

const JAVA_CODE = `import dev.flametrench.identity.*;
import dev.flametrench.tenancy.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

var identity = new InMemoryIdentityStore();
var tenancy = new InMemoryTenancyStore();

// Alice signs up.
var alice = identity.createUser();
identity.createPasswordCredential(
    alice.id(), "alice@example.com", "correcthorsebatterystaple"
);

// Alice creates an org and invites Bob — with editor access on a project
// pre-attached to the invitation. Acceptance materializes BOTH the
// membership AND the project grant in one transition.
var result = tenancy.createOrg(alice.id());
var inv = tenancy.createInvitation(
    result.org().id(),
    "bob@example.com",
    Role.MEMBER,
    alice.id(),
    Instant.now().plus(7, ChronoUnit.DAYS),
    List.of(new PreTuple("editor", "proj", "proj_42"))
);

var accepted = tenancy.acceptInvitation(inv.id());

// One transaction: Bob's membership AND his editor grant on proj_42.
accepted.materializedTuples().forEach(
    t -> System.out.println(t.relation() + ":" + t.objectId())
);
// → member:org_...
//   editor:proj_42
`;

const INSTALL_NODE = `pnpm add @flametrench/identity @flametrench/tenancy`;
const INSTALL_PHP = `composer require flametrench/identity flametrench/tenancy`;
const INSTALL_PYTHON = `pip install flametrench-identity flametrench-tenancy`;
const INSTALL_JAVA = `<!-- pom.xml -->
<dependency>
  <groupId>dev.flametrench</groupId>
  <artifactId>identity</artifactId>
  <version>0.1.0</version>
</dependency>
<dependency>
  <groupId>dev.flametrench</groupId>
  <artifactId>tenancy</artifactId>
  <version>0.1.0</version>
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
            How it works
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Sign up. Invite. Done.
          </h2>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            An invitation with pre-attached resource grants materializes the
            membership AND every grant in a single transition — one
            BEGIN/COMMIT in Postgres, equivalent atomicity in-memory.
            Identical semantics in{" "}
            <span className="text-[color:var(--color-fg)]">Node</span>,{" "}
            <span className="text-[color:var(--color-fg)]">PHP</span>,{" "}
            <span className="text-[color:var(--color-fg)]">Python</span>, and{" "}
            <span className="text-[color:var(--color-fg)]">Java</span>.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          {/* CSS-only tabs via radio inputs. Class names are inlined per
              tab so Tailwind's static analysis sees them at build time. */}
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
              htmlFor="tab-node"
              className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors peer-checked/node:border-[color:var(--color-accent)] peer-checked/node:text-[color:var(--color-fg)]"
            >
              Node · TypeScript
            </label>
            <label
              htmlFor="tab-php"
              className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors peer-checked/php:border-[color:var(--color-accent)] peer-checked/php:text-[color:var(--color-fg)]"
            >
              PHP
            </label>
            <label
              htmlFor="tab-python"
              className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors peer-checked/python:border-[color:var(--color-accent)] peer-checked/python:text-[color:var(--color-fg)]"
            >
              Python
            </label>
            <label
              htmlFor="tab-java"
              className="cursor-pointer whitespace-nowrap border-b-2 border-transparent px-4 py-3 font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors peer-checked/java:border-[color:var(--color-accent)] peer-checked/java:text-[color:var(--color-fg)]"
            >
              Java
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
            <div
              className="col-start-1 row-start-1 hidden peer-checked/python:block"
              aria-hidden={false}
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
              aria-hidden={false}
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
      </Container>
    </section>
  );
}
