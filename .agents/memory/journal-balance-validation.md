---
name: Journal balance validation tolerance
description: Why balanced-entry checks must compare rounded cents, not use a 0.01 tolerance
---

Rule: validate debit/credit equality with `Math.round(total * 100) !== Math.round(otherTotal * 100)` (integer cents), never `Math.abs(diff) > 0.01`.

**Why:** A tolerance of `> 0.01` lets an entry that is off by exactly one cent pass (and floating point makes 0.01 compare as 0.00999...). A real production depreciation entry slipped through this way and put the balance sheet out of balance by AFN 0.01 from its entry date onward.

**How to apply:** Any code path that creates or edits journal entries (routes, storage layer, client-side checks) must use the cent-rounding comparison. `storage.createJournalEntry` also throws on imbalance as defense-in-depth for non-route callers. A dashboard endpoint `/api/journal-entries/unbalanced` surfaces any entries whose line sums differ at cent precision.
