---
name: Journal reversals and customer balances
description: Reporting and reconciliation rule for reversed collection journals.
---

A collection journal can be reversed from the accounting screen while its linked payment transaction and installment fields still show the original payment. Customer-facing balance calculations must deduct allocations whose collection journal is reversed, preserving any earlier or later valid payments on the same installment.

**Why:** Treating every nonzero installment paid amount as active caused a reversed collection to remain in the Citizen Balance Statement and understate the customer’s outstanding balance.

**How to apply:** Use the payment transaction allocation data to subtract only reversed journal allocations from report totals. Keep the underlying payment transaction state synchronized when adding or changing journal-reversal workflows, and provide an explicit reconciliation path for historical reversals. When replaying allocations during reversal, preserve any positive installment amount that is already recorded but not yet represented by the ledger; it may be a concurrent later collection awaiting its ledger write.