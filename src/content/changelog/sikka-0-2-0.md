---
title: "Deterministic 1.5% inflation on bonded stake"
version: "0.2.0"
released: 2026-08-06
category: "Improvement"
---

Validator economics shipped and refined.

**What changed**

- Validators now earn a deterministic **1.5%/year** inflation on bonded stake, shared bond-weighted across the active set.
- Inflation is computed with 128-bit fixed-point integer math — no floating-point divergence between CPUs.
- Missing a proposer turn is never punished; only equivocation (double-signing) is slashed.