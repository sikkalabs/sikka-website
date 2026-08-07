---
title: "Why a quantum computer kills Bitcoin — and what ML-DSA does about it"
description: "A large-enough quantum computer can forge the ECDSA signatures that secure Bitcoin and Ethereum. Here's how it works, and why SIKKA was built to be immune from day one."
pubDate: 2026-06-12
tags: ["post-quantum", "cryptography", "bitcoin", "ml-dsa"]
---

Every digital currency's security rests on one primitive: the **signature scheme**. Bitcoin uses ECDSA. Ethereum uses ECDSA or Ed25519. All of them are classical schemes with a known, dated deadline.

## The attack, in one paragraph

In 1994, Peter Shor published an algorithm — now called *Shor's algorithm* — that can factor large integers and solve discrete-logarithm problems far faster than anything we know classically. Those are precisely the hard problems that ECDSA and Ed25519 are built on.

To illustrate: ECDSA's security relies on the fact that, given a public key, recovering the private key is mathematically infeasible. Shor's algorithm removes that difficulty. For Bitcoin this is direct: the public key is revealed whenever you make the first transaction, and any observed signature is enough material to work from.

With a sufficiently large quantum computer, an attacker could forge a signature for any revealed public key — and spend someone else's money.

## It's not the owner's fault

This is the crux: the keyholder did nothing wrong. They created an honest key and used the scheme as specified. The system's math simply stops holding. There's no way to "sign harder" or patch a broken equation — the security assumption itself is what collapses.

## How most projects "solve" it

Their strategy is **"migrate later."** Add a quantum-friendly signature, ship a new key type, and hope the whole ecosystem opts in on schedule.

That plan has three fatal holes:

1. **Coordination is global.** Every wallet, exchange, and node must move together. Ecosystems have never upgraded that way, on time.
2. **Downgrade risk.** While both key types are supported, the network includes the weak ones. Old keys remain spendable until — and if — everyone stops using them.
3. **Legacy vaults.** Coins held in legacy keys stay vulnerable no matter how much of the network upgrades.

## What SIKKA did instead

SIKKA standardized on **ML-DSA-87** — NIST's **FIPS 204** at **Level 5**, the equivalent security of AES-256 — from its very first version.

- **Every key, every signature** is post-quantum. There is no classical fallback code path to downgrade to.
- **No migration event will ever be needed.** Consumers never "upgrade" keys because the protocol never issued weak ones.
- **A uniform security floor** at the highest level NIST defines, across the entire network.

## The takeaway

A machine able to break ECDSA isn't speculative physics — it's a known algorithm waiting on more quantum hardware. The moment that hardware arrives, networks based on elliptic curves face a forced, chaotic, and probably partial migration. Networks that were post-quantum by default won't notice a thing.