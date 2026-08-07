---
title: "Post-quantum by default — why ML-DSA-87"
description: "A plain-English look at why SIKKA uses ML-DSA-87 at NIST Level 5 for every signature, with no classical fallbacks."
pubDate: 2026-08-05
tags: ["post-quantum", "cryptography", "ml-dsa"]
---

Cryptography has an expiry date. The moment a practical quantum computer can run Shor's algorithm at scale, every classical signature scheme — ECDSA, Ed25519, ECDH — becomes forgeable.

Most projects plan to "migrate later". Migration is a protocol-wide, user-uncoordinated nightmare. We decided to skip that chapter.

## What ML-DSA-87 is

ML-DSA is the Module-Lattice-Based Digital Signature Algorithm standardized by NIST as **FIPS 204**. The `-87` parameter set is the highest security level NIST defines — **Level 5**, the equivalent of AES-256 / SHA-384, and the strongest of the three ML-DSA variants.

## How SIKKA uses it

- **Every account key** is an ML-DSA-87 key. There is no other key type.
- **Every transaction** is signed with ML-DSA-87, including native multisig where up to 16 co-signers sign collaboratively.
- **No fallbacks.** There is no ECDSA or Ed25519 code path anywhere in the protocol, so there is nothing to silently downgrade to.

The cost is real — signatures are larger and key generation is slower than classical schemes. We absorb that cost so the user never has to think about it.

## The takeaway

Post-quantum security shouldn't be a feature you opt into. It should be the default the protocol gives you. With ML-DSA-87, SIKKA is ready for the post-quantum era without a migration event.
