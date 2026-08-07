---
title: "Hello SIKKA — Simple money for machines & humans"
description: "Welcome to the SIKKA blog. Here's why we built a post-quantum, zero-fee digital currency and what we're shipping."
pubDate: 2026-08-01
tags: ["intro", "zero-fee", "privacy"]
---

Welcome to the SIKKA blog. This is where we write about what we're building, why the design decisions exist, and what ships next.

## Why SIKKA exists

Every mainstream cryptocurrency stores a permanent, public log of every transaction. That has three costs:

1. **Privacy** — your entire spending history is exposed forever.
2. **Throughput** — every node must store and replay the whole ledger.
3. **Fees** — someone has to pay for all that storage and compute.

SIKKA throws out the assumption that money needs a public history.

## What's different

- **Zero fees, enforced by the protocol.** When you send SIKKA, the exact amount arrives in full. No gas, no priority fees, no cuts.
- **No transaction history.** Transactions are batched into checkpoints, consensus signs the state root, and the raw transactions are discarded. Past payments are not reconstructable — private by default.
- **Post-quantum from day one.** Every key and signature uses ML-DSA-87 (NIST FIPS 204, Level 5). No classical ECDSA fallbacks to migrate later.

## What's next

We'll be writing about consensus, spend credits, the bridge, and how to build on SIKKA. If you want to get started today, run a node with one Docker command or open the [web wallet](https://1.sikkalabs.com).
