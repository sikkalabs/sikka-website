---
title: "Spam credits, explained: why proof-of-work was the wrong answer"
description: "Proof-of-work burns energy to make spam expensive. Spend credits flip the economics — every account gets a budget that regenerates, so spam is impossible without punishing anyone."
pubDate: 2026-06-25
tags: ["spam-credits", "design", "spam-resistance"]
---

Every permissionless network has the same threat: spam. If sending a transaction costs nothing, the network drowns in meaningless transfers. Bitcoin's answer is proof-of-work — make each send so energy-expensive that only the spammer is hurt. That's a great defense and a terrible *usage* tax.

## The problem with proof-of-work as a fee

Proof-of-work (and the gas fees that followed it) turns every legitimate payment into a cost:

- **Energy that does nothing useful**, spent purely to buy entry into the network.
- **A regressive tax.** A one-cent transfer must clear the same PoW/ethereum hurdle as a million-dollar one — micropayments become structurally impossible.
- **Market-dependent pricing.** When the network is busy, costs spike; your *regular* transfer is priced like a luxury good at rush hour.

The industry convinced itself that paying to send money is the price of security. SIKKA disagrees.

## Enter spend credits

SIKKA's spam defense is an **account-level budget**, not a per-transaction fee:

- Every account **earns 1 spend credit per minute**, capped at **100**.
- Every transaction **burns exactly 1 credit**.
- New accounts **start at 0**, so you can't fund thousands of sybil accounts to spam all at once.

The economics do the work:

- **Normal use is free.** A person's daily transactions fit easily inside a regenerating budget.
- **Sustained spam is impossible.** To send more than the cap you'd have to wait — and waiting is free, so there's no financial penalty to dodge, just a hard rate limit.
- **No energy burned, no fee paid.** The spam tax is replaced by a time budget everyone shares equally.

## Why this is fairer

Spend credits don't discriminate by wealth — a fresh wallet and a whale hold the same credit ceiling. The scarce resource isn't money, it's *attention*, and every account gets the same allowance of it. Micropayments, machine payments, and high-frequency agent traffic all flow at zero cost, because the anti-spam mechanism never prices ordinary usage out.

## The takeaway

Proof-of-work and gas were the wrong answer because they taxed *everyone* to punish *a few*. Spend credits push the cost of spam onto its own rate limit — the exact opposite of turning the network's openness into a fee schedule.