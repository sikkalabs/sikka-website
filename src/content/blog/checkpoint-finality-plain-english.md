---
title: "Checkpoint finality in plain English: how ≥2/3 bonded-stake voting works"
description: "No proof-of-work, no slashing for downtime. SIKKA finalizes transactions through checkpoint voting — and the rules are simpler than they sound."
pubDate: 2026-03-20
tags: ["consensus", "checkpoints", "finality"]
---

Most blockchains make you pick between fast, expensive, and safe. SIKKA instead batches transactions into *checkpoints* and finalizes them with a vote among bonded validators. Here's how that works, without the jargon.

## The unit of finality is a checkpoint, not a block

SIKKA doesn't serialize individual transactions forever. Instead, transactions are gathered and bundled into a **checkpoint** — a batch of transactions summarized by a single state root.

Once a checkpoint exists, the question becomes: *did the network actually accept it?*

## Who gets to vote

Voting weight is **bonded stake** — the more SIKKA a validator has committed, the more their vote counts. There's no competition based on hardware or luck; influence is proportional to skin in the game.

## The threshold: ≥2/3

A checkpoint finalizes when **two-thirds or more** of the active bonded stake votes for it. This is the sweet spot that makes the protocol safe:

- **Two honest majorities must agree.** Two different checkpoints can't both reach 2/3, so the network can't split.
- **A small minority can't stall progress.** You don't need unanimity — just a clear supermajority.
- **The honest validators are in control** as long as they hold more than 1/3 of the stake.

## What finality means for you

When a checkpoint finalizes, the consensus signs the **state root** — the cryptographic digest of all account balances at that moment. And then the raw transactions are discarded. Your balance is what persists; the history of how it moved does not.

This is the property that makes SIKKA feel different: *final is final*. There are no "probabilistically confirmed" transactions waiting to be reorged. Either the checkpoint has 2/3 of bonded stake behind it, or it doesn't.

## The takeaway

Checkpoint finality trades the complexity of a block-by-block race for a simple, deterministic rule: **batch, vote, reach 2/3, sign the root.** It's fast to reason about, cheap to verify, and it's the backbone of every balance on the network.