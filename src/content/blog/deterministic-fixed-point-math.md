---
title: "Deterministic fixed-point math: why floating point is banned in consensus"
description: "Consensus code must be identical on every CPU. SIKKA computes finality with 128-bit fixed-point integer math so no two nodes can ever disagree."
pubDate: 2026-02-28
tags: ["consensus", "engineering", "determinism"]
---

A blockchain is a machine where every honest node must compute the *exact same answer* from the *exact same input*. One of the easiest ways to break that invariant is floating-point math.

## The floating-point trap

`0.1 + 0.2` is not `0.3` on any IEEE-754 machine — it's `0.30000000000000004`. That's harmless in a calculator and catastrophic in a ledger: if one validator rounds one way and another rounds another way, they end up with **different state roots** and the network forks over nothing.

Floating-point results depend on:

- the CPU and its rounding behavior,
- compiler optimizations,
- the order operations are evaluated in.

Even "obviously correct" code can disagree across machines.

## What SIKKA does instead

All of SIKKA's consensus arithmetic uses **128-bit fixed-point integer math**. The idea is simple:

- Every amount is an integer in the base unit — **CHILLAR**.
- Ratios like inflation or stake shares are computed as integer numerators and denominators, not decimals.
- Precision is explicit and finite, defined once by the protocol.

Because the result is pure integer arithmetic, it is **identical on every CPU, every compiler, every platform**. There is no rounding policy to align — there is no rounding.

## Why this matters for finality

Remember that finality depends on a **≥2/3 bonded-stake vote** and on computing the exact state root. If that computation weren't deterministic:

- nodes would disagree about who holds what,
- the state root they sign could diverge,
- and two "finalized" checkpoints could claim different histories.

Fixed-point arithmetic is what guarantees the **same checkpoint, same state root, every node, every time** — with no referee needed to resolve disagreements that shouldn't exist.

## The takeaway

Determinism isn't an optimization; it's the definition of a coherent ledger. By banning floating point from consensus and standardizing on 128-bit fixed-point integer math, SIKKA removes an entire class of "it works on my machine" failures — before they can ever become forks.