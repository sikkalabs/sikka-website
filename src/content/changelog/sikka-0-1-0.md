---
title: "Native m-of-n multisig"
version: "0.1.0"
released: 2026-07-28
category: "Feature"
---

Initial release of SIKKA mainnet.

**Highlights**

- Checkpoint consensus with round-robin proposers and ≥2/3 bonded-stake finality.
- Account-based state with native m-of-n multisig (up to 16 co-signers).
- Per-account spend credits (+1/min, cap 100) for spam resistance.
- HTTP REST API on port `64552` with a built-in web wallet and explorer.
- Deterministic fixed-point finality — hardware-independent state roots.