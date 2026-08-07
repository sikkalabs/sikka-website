---
title: "The post-quantum migration problem: why 'migrate later' is the expensive option"
description: "Almost every crypto project treats post-quantum security as a future task. Migrating a live network is harder, slower, and riskier than the industry pretends."
pubDate: 2026-04-03
tags: ["post-quantum", "cryptography", "engineering"]
---

Ask most crypto projects about post-quantum cryptography and you'll hear some version of "we'll migrate when it's necessary." It sounds pragmatic. In practice, a live-network migration is one of the hardest engineering problems a protocol can face — and it gets more expensive every year it's deferred.

## Migration is a coordination problem, not a code problem

Swapping a signature scheme sounds like a library update. It isn't. Consider what has to change in unison:

- every wallet, in every language, on every platform
- every exchange's custody and deposit flows
- every node's verification path
- every bridge, sidecar, and indexer
- all of them signing and verifying *new* transaction formats

A protocol that introduces a second signature type must keep supporting the old one — which means the weak keys stay live on the network indefinitely. The more the ecosystem grows, the larger and slower that coordinated change becomes.

## The hidden costs of waiting

- **Legacy coins never get safer.** Funds created before the migration keep their original key type. Whether they're "upgraded" is a per-user choice, and most users will never opt in.
- **Downgrade attacks get cheaper.** A mixed-key network only needs to find *one* weak signature to forge value.
- **The queue is global.** When the first quantum-relevant machine is announced, every network on Earth wants the same migration at once. The engineering talent, the tooling, the auditors — all become a bottleneck.
- **Risk concentrates at the worst time.** The highest-risk moment — actually switching keys — happens exactly when attention and pressure are highest.

## Why SIKKA skipped the whole problem

SIKKA's protocol doesn't have a migration path to build, because it never shipped a classical key. From genesis, every account uses **ML-DSA-87** — NIST FIPS 204 at Level 5.

- **No second key type exists**, so there is nothing to force-migrate.
- **No legacy funds** carry classical signatures, so there's no "upgrade or become a target" decision for users.
- **The protocol has one security floor**, at the strongest level NIST defines.

## The real cost of "later"

Post-quantum isn't an add-on feature — it's a design constraint that's trivial at genesis and disproportionately expensive after. The industry's habit of deferring it is understandable; that doesn't make it cheap. SIKKA chose to pay the price once, up front, in exchange for never having to pay it under pressure.