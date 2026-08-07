---
title: "Native multisig as a DAO primitive without smart contracts"
description: "DAOs need shared custody, but smart-contract multisig is complex and attack-prone. SIKKA puts m-of-n signatures directly in the protocol — up to 16 co-signers, no bytecode."
pubDate: 2026-07-28
tags: ["multisig", "daos", "governance"]
---

A DAO is, at its core, a problem of shared custody: *how do a group of people move money without any single person being able to move it alone?* The standard answer is a multisig wallet on a smart-contract platform. SIKKA's answer is more radical — the multisig is built into the protocol itself.

## The smart-contract way, and its costs

Smart-contract multisigs work, but they carry real baggage:

- **Bytecode to trust.** The contract is code, and code has bugs, upgrades, and composability risks.
- **Gas and complexity.** Every operation pays and carries contract overhead.
- **An attack surface.** Contracts are a favorite target; every upgrade is another chance for a vulnerability.

None of that exists in SIKKA because the m-of-n rule isn't a contract — it's a property of the key itself.

## Native multisig in SIKKA

SIKKA accounts are just keys with a built-in threshold. Up to **16 co-signers** can be part of a single account, and the account is configured so that some subset — say 2-of-3, or 5-of-7, or even 16-of-16 — is required to authorize any spend.

- **No contract to deploy.** The rule is encoded in the account's signature requirement.
- **No gas per operation.** A multisig spend is just a transaction — and SIKKA is zero-fee anyway.
- **No upgrade path to attack.** There's no bytecode to patch or hijack.

## What that gives a DAO

- **Treasury custody** — a 5-of-7 board account that can't be moved by a single member.
- **Budget enforcement** — sub-accounts with different thresholds for operations vs. strategy.
- **Trustless escrow** — a 2-of-3 account where buyer, seller, and arbiter must coordinate.
- **Post-quantum governance** — every co-signer still signs with ML-DSA-87, so DAO funds inherit the same Level 5 security as everything else.

## The takeaway

Governance shouldn't require a fragile layer of contracts on top of a currency. When multisig is native to the protocol, a DAO's custody is as simple, cheap, and robust as its individual payments — just a different threshold on the same signature primitive.