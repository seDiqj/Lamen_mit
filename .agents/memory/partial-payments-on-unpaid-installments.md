---
name: Partial payments on unpaid installments
description: Installments can carry paid_amount while is_paid=false; received/outstanding calcs must include them.
---
The rule: any "total amount received" or "outstanding" calculation over installments must sum `paid_amount` from ALL installments (including `is_paid=false` ones), not just flagged-paid ones. Also round outstanding to 2 decimals before comparing to 0.

**Why:** A loan's final installment is often settled with a partial payment — the money is stored in `paid_amount` but `is_paid` stays false. Summing only flagged-paid installments left a fake outstanding balance equal to the last payment, making fully-paid loans show as Active in reports while the balance statement (which counts all payments) showed ~0.

**How to apply:** When building or fixing any report/summary that derives outstanding or received totals from the `installments` table, include partials on unpaid installments and expect installment paid/unpaid counts (based on `is_paid`) to legitimately disagree with a zero outstanding.
