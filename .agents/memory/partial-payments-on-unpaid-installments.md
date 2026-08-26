---
name: Partial payments on unpaid installments
description: Installments can carry paid_amount while is_paid=false; received/outstanding calcs must include them.
---
The rule: any "total amount received" or "outstanding" calculation over installments must sum the actual positive `paid_amount` from ALL installments (including `is_paid=false` ones), not replace it with the scheduled installment amount or limit it to flagged-paid rows. Cap received at each loan's contractual receivable so overpayment on one loan cannot reduce another loan's outstanding. Round outstanding to 2 decimals before comparing to 0.

**Why:** A loan's final installment is often settled with a partial payment — the money is stored in `paid_amount` but `is_paid` stays false. Some paid-status rows also have an actual amount different from the scheduled installment. Replacing actual amounts with schedule values caused the dashboard and Financing Data Report to disagree.

**How to apply:** When building or fixing any report/summary that derives outstanding or received totals from the `installments` table, use positive ledger amounts from every installment, cap at the loan contract total, and expect installment paid/unpaid counts (based on `is_paid`) to legitimately disagree with a zero outstanding.
