---
ghsa: "GHSA-33cx-f9xx-h6ff"
updated: "2026-06-06 — (1) PHP affected range corrected: v0.3.0 → all releases < 0.3.1. (2) Node row corrected: @flametrench/identity 0.2.0 and 0.2.1 are live on npm and contain the oracle; no fixed version on npm yet."
---

# Security Advisory: User-Enumeration Timing Oracle in `verifyPassword` (FLAMETRENCH-2026-001)

**Severity:** Medium  
**CVSSv3.1:** 5.3 — `AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`  
**CWE:** CWE-208 — Observable Timing Discrepancy  
**OWASP:** A07 — Identification and Authentication Failures  
**Published:** 2026-06-06  
**Not affected:** `github.com/flametrench/flametrench-go/packages/identity` — the Go reference implementation shipped the timing-equalized path from the outset.

> **Updated 2026-06-06:** Two corrections. (1) The PHP affected range has been widened: the oracle is present in all PHP identity releases `< 0.3.1` (v0.0.1 through v0.3.0), not only v0.3.0 as initially stated. (2) The Node row has been corrected: `@flametrench/identity` 0.2.0 and 0.2.1 are live on npm and contain the oracle. No fixed version is yet available on npm. Node adopters should apply the interim rate-limiting mitigation while awaiting the npm publish of v0.3.1.

> **Environmental note:** PHP adopters on any version `< 0.3.1`, and Node adopters on `@flametrench/identity` 0.2.x (no fixed version available on npm yet), who have per-IP rate limiting on sign-in endpoints (required by the Flametrench security model — see `docs/security.md` §Adopter responsibilities) face substantially reduced practical exploitability. Rate limiting does not substitute for upgrading, but is a meaningful environmental control that commonly reduces effective risk to Low.

---

## Summary

The `verifyPassword` operation in the PHP, Node, Python, and Java identity SDK families contained a timing oracle: the unknown-identifier path returned `InvalidCredentialError` immediately (~1 ms) without running Argon2id, while the identifier-found path ran a full Argon2id verification (~50–150 ms). The latency difference — approximately 50–100× — is reliably measurable and sufficient for a network attacker to enumerate whether an email address or handle is registered on the system by timing responses.

**Released exposure:** **PHP and Node both published vulnerable artifacts.** PHP: all Packagist releases `< 0.3.1` (v0.0.1 through v0.3.0); the oracle predates v0.3 and every pre-fix tag auto-synced to Packagist. Node: `@flametrench/identity` 0.2.0 and 0.2.1 are live on npm (`latest` = 0.2.1); **no fixed version is currently available on npm** — v0.3.1 is tagged but not yet published. Python and Java corrected the defect before their first public registry release. PHP adopters on any version below v0.3.1 must upgrade immediately. Node adopters should apply the interim rate-limiting mitigation and watch for the npm publish of v0.3.1.

**What the oracle leaks:** identifier **existence only**. It does not indicate whether the submitted password is correct, does not expose credentials, and does not grant sessions. An attacker learns only that a given identifier is or is not registered.

**Fix:** the unknown-identifier path now runs a dummy Argon2id verification against the spec-pinned constant hash before returning. Both paths — identifier found and identifier not found — now pay the Argon2id cost. The fix equalizes **upward** (both paths now do Argon2id work); it does not shorten the found path. The fix ships as PHP/Node v0.3.1; Python and Java's v0.3.0 already incorporates it.

---

## Technical detail

When `verifyPassword(identifier, password)` is called:

- **Identifier exists (before fix):** Argon2id runs against the stored hash — ~50–150 ms.
- **Identifier does not exist (before fix):** Return `InvalidCredentialError` immediately — ~1 ms.

An attacker submitting probe identifiers and measuring response latency distinguishes "this identifier is registered" from "this identifier is not registered" with high confidence in a small number of probes. No password knowledge or prior authentication is required.

**After fix (v0.3.1):** on the unknown-identifier path (and on any path that would skip real Argon2id), the SDK runs `VerifyPasswordHash(specPinnedDummyHash, candidate)` against the spec-pinned constant PHC hash. Both paths are now timing-equalized at floor Argon2id parameters (m=19456, t=2, p=1). The dummy verify result is discarded; its cost is the equalization mechanism.

The spec-pinned hash is the same constant used by the PAT timing defense (ADR 0023) and is pinned in `conformance/fixtures/identity/argon2id.json`. Every conforming SDK MUST use the identical pinned string; a self-generated dummy hash with different parameters would reintroduce a timing differential.

**Scope:** the fix removes the Argon2id-presence timing differential in `verifyPassword`. DB query latency (0-row vs 1-row index lookup) and network-level jitter are unaddressed; at floor Argon2id params they are dominated by the Argon2id cost and not independently exploitable.

### Residual caveat

Timing equalization is exact when all active password credentials use floor Argon2id parameters (m=19456, t=2, p=1). Adopters who have migrated some credentials to above-floor parameters will have real verifications taking slightly longer than the dummy — leaving a residual, coarser timing signal bounded by the above-floor parameter increment. See `docs/security.md` §Timing-equalization residual (decoy verify) for the characterization of the residual and available mitigations.

---

## Affected versions

| SDK family | Package | Vulnerable release published? | Fix |
|---|---|---|---|
| PHP | `flametrench/identity` (Packagist) | **Yes — all releases `< 0.3.1`** (v0.0.1 through v0.3.0; oracle predates v0.3 and every pre-fix tag auto-synced to Packagist). v0.3.0 was the last, live ~8h 2026-06-05 16:04→2026-06-06 00:38 UTC | **v0.3.1** ✅ Available now — upgrade required |
| Node | `@flametrench/identity` (npm) | **Yes — 0.2.0 and 0.2.1** live on npm (`latest` = 0.2.1); both contain the oracle (`< 0.3.1`) | v0.3.1 (tagged; **npm publish pending — no fixed version on npm yet**) |
| Python | `flametrench-identity` (PyPI) | No — fix present in the first v0.3.0 release; never published vulnerable | v0.3.0 (v0.3.1 = identical tree) — no action needed |
| Java | `dev.flametrench:identity` (Maven Central) | No — fix present in the first v0.3.0 release; no v0.3.1 exists | v0.3.0 — no action needed |
| Go | `github.com/flametrench/flametrench-go/packages/identity` | Never affected | — |

**Only the `identity` package is affected.** `ids`, `authz`, and `tenancy` do not require updating.

This advisory will be updated when Node v0.3.1 publishes to npm and when the Node GHSA is filed. Subscribe to release notifications on the Node SDK repo for availability updates.

---

## Adopter action

**PHP adopters on any version below v0.3.1 must upgrade to v0.3.1.** The `verifyPassword` timing oracle is present in all releases from v0.0.1 through v0.3.0. No API or schema changes — the fix is internal to `verifyPassword`. No data migration required.

```bash
# PHP — upgrade now (v0.3.1 available on Packagist)
composer require flametrench/identity:^0.3.1
```

**Node adopters on `@flametrench/identity` 0.2.x are exposed — no fixed version is currently available on npm.** The fix (v0.3.1) is tagged but not yet published to npm. In the interim, ensure per-IP rate limiting is enforced on your sign-in endpoint (required by the Flametrench security model — see `docs/security.md` §Adopter responsibilities). Rate limiting does not eliminate the oracle but materially reduces exploitability. Upgrade to v0.3.1 the moment it publishes:

```bash
# Node — upgrade once v0.3.1 publishes to npm
npm install @flametrench/identity@0.3.1
```

**Python adopters:** no action required. `flametrench-identity` v0.3.0 (the first tagged release) already contains the fix. No artifact has been published to PyPI yet.

**Java adopters:** no action required. `dev.flametrench:identity` v0.3.0 (the first tagged release) already contains the fix. No artifact has been published to Maven Central yet.

**Go adopters:** not affected. The Go reference implementation shipped the timing-equalized path from the outset.

---

## Preconditions

- **Pre-authentication.** No credentials or existing session are required to probe. Anyone who can reach the sign-in endpoint can exploit this.
- **Repeated timed requests required.** The signal requires multiple probes; any throttling (per-IP rate limiting, WAF, CAPTCHA) materially raises the bar by reducing the number of probes reachable in a window.
- **Network adjacency not required.** Lower jitter (co-located or same-datacenter attacker) improves signal quality, but the ~50× latency delta is measurable over a noisy WAN with a sufficient number of samples.
- **Impact ceiling: identifier existence only.** The oracle does not leak passwords, sessions, or any other credential material.

---

## Timeline

| Date | Event |
|---|---|
| 2026-06-05 | Reported by external security review (SiteSource) |
| 2026-06-05 | Fix implemented across PHP, Node, Python, Java |
| 2026-06-05 16:04 UTC | PHP identity v0.3.0 (vulnerable) auto-synced to Packagist |
| 2026-06-06 00:38 UTC | PHP identity v0.3.1 (fixed) supersedes v0.3.0 on Packagist (~8h exposure window) |
| 2026-06-06 | Node v0.3.1 tagged (npm publish pending — no vulnerable artifact reached npm); Python/Java fix present in existing v0.3.0 release |
| 2026-06-06 | Advisory published |

---

## Credits

Reported by SiteSource. Remediation verified by the Flametrench security team.

---

## References

- [GHSA-33cx-f9xx-h6ff](https://github.com/flametrench/identity-php/security/advisories/GHSA-33cx-f9xx-h6ff) — GitHub Security Advisory (PHP identity)
- Node GHSA — pending filing (npm ecosystem; `@flametrench/identity < 0.3.1`)
- [CWE-208: Observable Timing Discrepancy](https://cwe.mitre.org/data/definitions/208.html)
- OWASP Top 10 A07:2021 — Identification and Authentication Failures
- Flametrench `docs/security.md` §Timing-equalization residual (decoy verify)
- ADR 0023 — spec-pinned dummy-hash primitive (PAT timing defense, same mechanism)
