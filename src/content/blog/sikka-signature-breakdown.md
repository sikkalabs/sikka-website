---
title: "Breaking down a SIKKA signature: bytes, keys, and multisig aggregation"
description: "A walk through an ML-DSA-87 signature in SIKKA — keys, signature bytes, and how up to 16 co-signers build one transaction without smart contracts."
pubDate: 2026-05-15
tags: ["cryptography", "ml-dsa", "multisig", "internals"]
---

Sending SIKKA looks simple from the outside, but underneath there's a delicate machine: a 2,592-byte public key, a 4,595-byte signature, and a multisig flow that lets up to 16 parties collaborate. Let's open it up.

## Keys: ML-DSA-87

Every SIKKA account key inherits its parameters from **ML-DSA-87** (FIPS 204, NIST Level 5). The two key pieces:

- **Public key:** 2,592 bytes
- **Private key:** 4,864 bytes
- **Signature:** 4,595 bytes

These are lattice-based: the security comes from *Module-LWE*, the hardness of recovering short lattice vectors. Unlike elliptic curves, there is no known quantum shortcut.

## What a signature is doing

A transaction carries:

- the transfer `kind`, `from` and `to` addresses, and the amount in the integer unit **CHILLAR**
- a `nonce` (per-account sequence) and a `timestamp`
- the `chain_id`, to keep one network's transactions unusable elsewhere

Every one of those fields is fed through SHA3-256 into the message that gets signed. The 4,595-byte ML-DSA-87 signature is then appended. Any tampering with the message makes the signature fail verification immediately.

## Verification, everywhere

Because ML-DSA-87 is deterministic and well-specified, any node hardware converges on the same result. There's no floating-point ambiguity and no "close enough" — a signature either verifies or it doesn't, and every honest node agrees on which.

## Native multisig — no smart contracts

SIKKA's multisig lives at the protocol layer, not in bytecode. Up to **16 co-signers** each contribute their part, and the final combined signature is a single valid ML-DSA-87 signature for the transaction's aggregate key.

- **There's no contract to deploy and no gas to pay** — it's a first-class typing condition on the transaction itself.
- **The threshold is defined in the key.** The account knows which subset of signers is enough to authorize spending.
- **Everything stays post-quantum** — each co-signer still uses the same ML-DSA-87 primitives.

## Why it matters

Larger signatures are the price of post-quantum security. SIKKA pays it so that:

- every key is uniformly at NIST Level 5,
- multisig is a native, deterministic property rather than a contract you must trust,
- and there's no migration event hiding in your future.

That's a trade most of the industry is deferring. SIKKA made it up front.