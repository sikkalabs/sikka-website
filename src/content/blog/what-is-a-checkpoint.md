---
title: "What is a checkpoint, really? The transaction lifecycle deep dive"
description: "From a signed transaction to a discarded history — a walk through the exact five-step lifecycle every SIKKA payment follows on its way to finality."
pubDate: 2026-03-25
tags: ["checkpoints", "lifecycle", "internals"]
---

A SIKKA payment looks like a click, but between the wallet and a finalized balance there are exactly five deterministic steps. Let's walk each one.

## Step 01 — Build the transaction

Your wallet assembles the payment as a structured record: the transfer `kind`, the `from` and `to` accounts, the amount in the integer unit **CHILLAR**, a `nonce` and timestamp, and a `chain_id` so transactions can't be replayed on another network. This is the `SIKKA/tx/v3` wire format.

## Step 02 — Spend a credit

Every account holds **spend credits** — earned at +1 per minute, capped at 100 — and each transaction burns exactly one. This is SIKKA's spam defense. Normal use is free and sustained abuse is impossible. No proof-of-work, no energy, no fees.

## Step 03 — Sign with ML-DSA-87

Every signer applies an **ML-DSA-87** signature (FIPS 204, Level 5). For native multisig, up to 16 co-signers contribute collaboratively to a single valid signature — the protocol's m-of-n mechanism, with no smart contracts.

## Step 04 — Broadcast

The signed transaction is submitted to any node over the HTTP API. The node validates it — signature, credits, balance, nonce — then gossips it to peers so the network converges on the same pending set.

## Step 05 — Finalize in a checkpoint

Transactions are batched into a **checkpoint**. When ≥2/3 of bonded stake votes for it, the checkpoint finalizes: the **state root** is signed and the raw transactions are discarded.

## The point of the pipeline

Each step exists to answer one question cleanly:

1. **Build** — what is being sent?
2. **Credits** — can the network afford it, spam-wise?
3. **Sign** — is this authorized, and quantum-safe?
4. **Broadcast** — is the network aware?
5. **Finalize** — is it *settled*?

And then the raw payments vanish — their work done, remembered only as a balance. That's the whole reason the design works: history is a means, not an end.