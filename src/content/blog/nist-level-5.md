---
title: "What is NIST Level 5, and why SIKKA chose the strongest parameter set"
description: "NIST defines five security levels for post-quantum algorithms. SIKKA ships the strongest one — ML-DSA-87, equivalent to AES-256. Here's what that means."
pubDate: 2026-07-20
tags: ["post-quantum", "cryptography", "ml-dsa"]
---

When NIST standardized post-quantum signatures, it didn't define one algorithm with one size. It defined **security categories** — five of them — and then parameter sets that map to each. SIKKA ships at the very top of that scale.

## The five NIST categories

NIST's post-quantum categories are defined by how hard a scheme is to break relative to classical and quantum workloads:

- **Level 1** — at least as hard to break as AES-128 with classical attacks.
- **Level 2** — at least as hard as SHA-256 with classical attacks.
- **Level 3** — at least as hard as AES-192.
- **Level 4** — at least as hard as SHA-384.
- **Level 5** — at least as hard as AES-256.

Levels 1, 3, and 5 are the AES-anchored ones — they're the levels with dedicated parameter sets. Level 5 is the top: **the equivalent of AES-256**, the same symmetric strength that secures virtually everything sensitive in the world today.

## What ML-DSA-87 is

ML-DSA (Module-Lattice-Based Digital Signature Algorithm) is NIST **FIPS 204**. The three parameter sets are:

- ML-DSA-44 → Level 2
- ML-DSA-65 → Level 3
- ML-DSA-87 → Level 5

The `-87` variant is the largest and strongest. It uses a 2,592-byte public key and produces a 4,595-byte signature. Those numbers look big next to ECDSA's tiny signatures — and that's the entire point.

## Why SIKKA chose the strongest set

**There is no migration path for cryptography.** You can't soft-fork a weaker signature scheme into a stronger one without every wallet, node, and exchange upgrading in coordination. So the only rational choice is to start at the top and never need to move.

Choosing ML-DSA-87 means:

- **No "Level 1 is fine for now" assumption.** The cheapest safe option is the safest option.
- **A uniform, single-strength protocol.** Every account key is the same strength. There is no weakest link and no tiering to manage.
- **Future-proofing by construction.** When quantum computers arrive at scale, the security margin is already the largest NIST defines — nothing to upgrade.

## The honest trade-off

Bigger keys and signatures have a real cost: larger transactions, more bytes on the wire, more compute to sign. SIKKA absorbs that cost because there's no second chance. The parameter set is the one decision you cannot revisit later.

Level 5 today means the protocol never has to ask its users to "migrate for security" — because it started at the ceiling.
