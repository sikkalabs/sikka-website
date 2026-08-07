---
title: "Non-punitive consensus: what happens when a validator misses a turn"
description: "In SIKKA, downtime never costs you stake. Only double-signing is slashed. Here's why that keeps participation honest — and cheap."
pubDate: 2026-03-05
tags: ["consensus", "validators", "stake"]
---

In many staking networks, going offline is a financial battle. Validators get watched and fined for missing blocks, and the fear of losing stake drives up the cost and complexity of running a node. SIKKA takes the opposite approach: it is **non-punitive by design**.

## How proposing works

SIKKA uses a **round-robin proposer** schedule. Validators take turns proposing checkpoints in a fixed order — no racing to solve a puzzle, no luck involved.

If a validator is slow, the network falls back automatically on a **10-second timeout**. Another proposer steps up and the chain keeps moving. And here's the key: *that turn being missed costs the validator nothing.*

## What actually gets slashed

There is exactly one unforgivable crime in SIKKA: **equivocation** — signing two conflicting checkpoints for same height. That's the attack that could create a fork, so it's the one behavior that destroys stake.

Everything else is tolerated:

- Missing your proposal turn → fine, someone else picks it up.
- Slow connection → fine, the timeout handles it.
- Brief downtime → fine, you'll be back in the rotation.

## Why this is the right trade

Two of the biggest costs of running proof-of-stake are the *fear of slashing* and the *operational stress* of never missing a block. Make downtime punitive and you:

- lock small validators out, since they can't afford the risk,
- encourage overly complex, expensive infra just to avoid mistakes,
- and drive staking toward the few that can play the penalty game.

Non-punitive consensus flips that: the only real risk is *honest misbehavior*, which is both rare and easy to identify. The rest is delegation parity.

## How immutable finality protects the slate

Because individual misses don't get penalized, and because any *actual* equivocation is still slashed, the incentive stays aligned: honest validators are treated gently, and honest disagreement is cheap — while malicious behavior still has a hard cost.

The result is a stake system that's cheap to run, easy to reason about, and safe against the one attack that matters.