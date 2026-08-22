---
name: Installment payment adjustments
description: How financing reports should handle negative installment payment adjustments alongside normal payments.
---

Display only installments with a positive paid amount as payment events, but calculate each later running balance from every nonzero paid amount, including negative adjustments.

**Why:** Some loans record later payment reversals or adjustments as negative `paid_amount` values. Omitting those values from the running balance makes subsequent remaining balances too low and disagree with the net amount received.

**How to apply:** In installment-level reports, order all nonzero installment amounts before computing cumulative payment totals. Filter to positive amounts only when deciding which payment columns or rows to show.