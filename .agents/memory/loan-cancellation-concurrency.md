---
name: Loan cancellation concurrency
description: Synchronization rule for cancellation and financial/schedule changes.
---

Loan cancellation is a financial state transition, not just a status update. Any operation that disburses, changes payment state, or creates a repayment schedule must lock the related loan row first and re-check its permitted status.

**Why:** Without this shared lock order, a request that read an approved or active loan before cancellation could later recreate installments, disburse it, or post a payment after the cancellation transaction removed its schedule and reversed its balances.

**How to apply:** For new financial or schedule mutation paths, lock the loan before locking installments or creating records; reject cancelled loans and limit payment mutations to disbursed/active loans. Use database-side numeric deltas for concurrent journal balance updates.