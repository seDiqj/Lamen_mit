---
name: Reversal journal entries must be posted
description: Why reverseJournalEntry must create posted entries or account balances never move back
---

# Reversal journal entries must be posted

`createJournalEntry(header, lines)` only mutates account `currentBalance` when `header.isPosted` is true. Normal collection/disbursement entries are created posted, so their balances move. A reversal that is created **unposted** restores nothing on the books and is also hidden from posted-only reports (trial balance, P&L, etc., which filter `isPosted = true`).

**Rule:** any reversal/counter entry that must undo ledger impact has to be created with `isPosted: true` (plus `postedBy`/`postedAt`). `reverseJournalEntry` does this.

**Why:** the payment-reversal feature appeared to work (installment state restored, txn marked reversed) but left account balances unchanged because the reversal entry was unposted. `undoReversalJournalEntry` already assumes reversal entries can be posted (it checks `isPosted` before adjusting balances), so posting them is consistent across the manual journal-entries reverse and the collection payment reverse.

**How to apply:** when adding any new "reverse"/"counter"/"void" accounting flow, create the offsetting entry posted, and never assume an unposted entry affects balances or shows in financial reports.
