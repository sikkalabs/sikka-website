---
title: "Balances, not history: what deleting the transaction log means for privacy and auditability"
description: "SIKKA stores what you have, not what you've done. A look at what a protocol really gives up — and keeps — when it discards the public ledger."
pubDate: 2026-02-12
tags: ["privacy", "design", "philosophy"]
---

Ask someone what a blockchain is and they'll almost certainly describe a *ledger of transactions* — a permanent, public record of every payment ever made. SIKKA keeps the part that matters and drops the rest: it stores **balances, not history**.

## What every other protocol stores

Bitcoin and Ethereum serialize each transfer into an append-only log. That log is what makes them auditable — but it's also what makes them transparent to the point of being *surveillant*. Your income, your spending habits, your counterparties: all public, forever, by default.

Privacy on those networks is an add-on — mixing services, stealth addresses, layer-2 tricks. It's fighting the design.

## What SIKKA stores instead

SIKKA maintains an **account-based state**: each address has a balance, updated atomically when a transfer happens. The transactions that caused those updates are batched into checkpoints; consensus signs the **state root**; and then the raw transactions are discarded.

The result:

- **No public transaction history.** Past payments are not reconstructable from the network.
- **Privacy by default.** There is no "private mode" to switch on — it's the only mode.
- **Storage grows with accounts, not activity.** Three fixed tables, zero historical replay. A node's database scales with the number of people, not the number of payments.

## The auditability question

The honest question is: *without a history, how can anyone audit anything?* SIKKA's answer is that auditability should target **state, not transactions**:

- Every account balance is provable via a **sparse Merkle tree (SMT) state proof**.
- Finality is a signed state root agreed by ≥2/3 of bonded stake.
- Anyone can verify the *current truth* — the balances, the supply, the checkpoint — without replaying anyone's spending.

It's the difference between a public diary and a public notary: the notary verifies what's true now, and doesn't publish your diary to do it.

## The trade you might not expect

This isn't a compromise — it's a deliberate inversion. Most chains optimized for *complete history* and are now paying for it with storage bloat and permanent surveillance. SIKKA optimized for *truthful present*: verifiable balances, zero cost to run, and privacy that isn't optional.

Your balance is yours. What you did to get it doesn't need to be everyone's business.