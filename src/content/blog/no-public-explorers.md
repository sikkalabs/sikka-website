---
title: "Why there are no public explorers of your spending history"
description: "Etherscan-style explorers are possible on SIKKA — they'd just have nothing to show. What happens to blockchain analytics when the ledger forgets?"
pubDate: 2026-02-20
tags: ["privacy", "explorers", "design"]
---

Visit any major blockchain explorer and you can watch someone else's financial life in real time: every deposit, every withdrawal, every time they buy a coffee. That level of transparency is treated as a feature of crypto. SIKKA's explorers can't do any of it — because there's no history to display.

## What an explorer on SIKKA actually shows

Yes, SIKKA has a built-in explorer, and it's useful. It shows:

- **Accounts** — addresses and their current balances.
- **Checkpoints** — the signed, finalized state roots.
- **Network health** — height, peers, mempool, sync status.

What it can't show is the one thing people expect from blockchain explorers: *every transaction a given address ever made.* That data doesn't exist on the network.

## Why that's a feature, not a bug

The entire industry has normalized the idea that a public, permanent record of everyone's spending is acceptable. SIKKA rejected that premise at the design level:

- **Transactions are a means, not an artifact.** They exist to move balances, then they're done. Consensus keeps the state root — the proof of what is true — and discards the rest.
- **Privacy shouldn't require tooling.** On Bitcoin, privacy means juggling mixers and new addresses. On SIKKA, the default is the safe case.
- **Forensic analytics gets nothing to chew on.** Chain-analysis firms reconstruct identities by linking transactions over time. No history, no links, no graph.

## The auditability that remains

A common objection is "without explorers, how do we trust the network?" The answer: explorers still verify what matters.

- **Supply is provable.** Total CHILLAR in circulation is a matter of state, not a sum over transactions.
- **Balances are provable.** Each account's balance is backed by an SMT state proof tied to a signed, finalized checkpoint.
- **Consensus is visible.** Every finalized checkpoint and its validator votes are public.

You can audit *the truth* — current balances and the rules that produced them — without exposing *the story* — who paid whom, and when.

## The takeaway

An explorer is only as useful as the ledger it reflects. SIKKA chose a ledger designed around one question — *who has what, right now* — and gave it the only honest interface. Your spending history is yours alone, and no explorer will ever sell it back to you.