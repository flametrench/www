---
draft: true
hold: "Do not publish until PM confirms tags are live."
review_status: "Awaiting Security line-level pass + corrected security.md wording (Spec). Java fix-status unconfirmed per Release."
---

# Security Advisory: User-Enumeration Timing Oracle in `verifyPassword` (FLAMETRENCH-2026-001)

**Severity:** Medium  
**CVSSv3.1:** 5.3 — `AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`  
**CWE:** CWE-208 — Observable Timing Discrepancy  
**OWASP:** A07 — Identification and Authentication Failures  
**Published:** 2026-06-06 *(hold until PM confirms tags live)*  
**Not affected:** `github.com/flametrench/flametrench-go/packages/identity` — the Go reference implementation shipped the timing-equalized path from the outset.

> **Environmental note:** Adopters with per-IP rate limiting on sign-in endpoints (required by the Flametrench security model — see `docs/security.md` §Adopter responsibilities) face substantially reduced practical exploitability. Rate limiting does not substitute for upgrading, but is a meaningful environmental control that commonly reduces effective risk to Low.

---

## Summary

The `verifyPassword` operation in the PHP, Node, and Python identity SDK families returned `InvalidCredentialError` immediately when the supplied identifier was not found, without first running Argon2id. The identifier-found path runs a full Argon2id verification (~50–150 ms at floor parameters). The latency difference — approximately 50–100× — is reliably measurable and sufficient for a network attacker to enumerate whether an email address or handle is registered on the system by timing responses.

**What the oracle leaks:** identifier **existence only**. It does not indicate whether the submitted password is correct, does not expose credentials, and does not grant sessions. An attacker learns only that a given identifier is or is not registered.

**Fix (v0.3.1):** the unknown-identifier path now runs a dummy Argon2id verification against the spec-pinned constant hash before returning. Both paths — identifier found and identifier not found — now pay the Argon2id cost. The fix equalizes **upward** (both paths now do Argon2id work); it does not shorten the found path.

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

Timing equalization is exact when all active password credentials use floor Argon2id parameters (m=19456, t=2, p=1). Adopters who have migrated some credentials to above-floor parameters will have real verifications taking slightly longer than the dummy — leaving a residual, coarser timing signal bounded by the above-floor parameter increment. See `docs/security.md` §verifyPassword timing equalization for the characterization of the residual and available mitigations.

---

## Affected versions

| SDK family | Package | Affected | Fixed in |
|---|---|---|---|
| PHP | `flametrench/identity` (Packagist) | v0.3.0 | v0.3.1 |
| Node | `@flametrench/identity` (npm) | v0.3.0 | v0.3.1 |
| Python | `flametrench-identity` (PyPI) | v0.3.0 | v0.3.1 |
| Go | `github.com/flametrench/flametrench-go/packages/identity` | Not affected | — |

**Only the `identity` package is bumped.** `ids`, `authz`, and `tenancy` remain at v0.3.0 and do not require updating.

> **Note:** Java (`dev.flametrench:identity`) v0.3.1 fix status is pending confirmation — this advisory will be updated to include Java once its fix is merged and tagged. Go is not affected.

---

## Adopter action

**Upgrade to identity v0.3.1.** No API or schema changes — the fix is internal to `verifyPassword`. No data migration required.

```bash
# PHP
composer require flametrench/identity:^0.3.1

# Node
npm install @flametrench/identity@0.3.1

# Python
pip install "flametrench-identity>=0.3.1,<0.4"
```

Java adopters: watch for a follow-on advisory update when `dev.flametrench:identity` v0.3.1 is confirmed tagged.

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
| 2026-05-01 | Identified during v0.3.0 pre-release security audit (internal) |
| 2026-06-05 | Fix implemented across PHP, Node, Python |
| 2026-06-06 | v0.3.1 tagged; advisory published *(hold for PM tag-live confirmation)* |

---

## Credits

Identified during the Flametrench v0.3.0 pre-release security audit (internal). Remediation verified by the Flametrench security team.

---

## References

- [CWE-208: Observable Timing Discrepancy](https://cwe.mitre.org/data/definitions/208.html)
- OWASP Top 10 A07:2021 — Identification and Authentication Failures
- Flametrench `docs/security.md` — §verifyPassword timing equalization
- ADR 0023 — spec-pinned dummy-hash primitive (PAT timing defense, same mechanism)
