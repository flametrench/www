---
draft: true
note: >
  CHANGELOG entry for each affected identity SDK repo (identity-php,
  node/packages/identity, identity-python). Java pending — add once tagged.
  Format per Release guidance: v0.3.1 entry with advisory reference.
  Date: 2026-06-06 (tag date per Release).
---

## [v0.3.1] — 2026-06-06 (security)

### Fixed

- **`verifyPassword` timing oracle — FLAMETRENCH-2026-001 (CVSSv3.1 5.3 Medium, CWE-208)** — when the supplied identifier was not found, `verifyPassword` returned `InvalidCredentialError` immediately without running Argon2id. The identifier-found path runs Argon2id at ~50–150 ms; the missing-identifier path returned in ~1 ms. A network attacker could enumerate registered identifiers by timing responses. No authentication is required to probe.

  **Fix:** the unknown-identifier path now runs a dummy Argon2id verification against the spec-pinned constant hash before returning. Both paths are now timing-equalized at floor Argon2id parameters (m=19456, t=2, p=1). No API or schema changes; no data migration required.

  **Adopter action:** upgrade to v0.3.1. The Go identity package was not affected.

  > **Residual caveat:** equalization is exact at floor Argon2id parameters. Adopters using above-floor parameters retain a coarser, bounded residual signal. See `docs/security.md` §verifyPassword timing equalization.

  Full advisory: FLAMETRENCH-2026-001 *(GHSA link — fill in once advisory is filed)*
