---
name: Already-reversed disbursements
description: Safe cancellation behavior when a loan’s disbursement journal was reversed earlier.
---

When a disbursed loan’s original posted disbursement journal is already marked reversed, cancellation must not create another reversal. It must verify that the linked reversal entry is posted, has reversal type, and references the original journal; only then may it remove the unpaid schedule and mark the loan cancelled.

**Why:** A legitimate prior journal reversal means the financial balances are already back to their pre-disbursement position. A second counter-entry would reapply the disbursement’s financial effects.

**How to apply:** Treat a single active posted disbursement journal as the normal reversal path. Treat a single already-reversed posted journal with one valid posted linked reversal as a safe administrative-cancellation path; reject every other journal pattern for manual review.