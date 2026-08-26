---
name: PAR eligibility
description: How the Financing Data Report determines whether an installment is eligible for PAR aging
---

Rule: Include an installment in Final Aging, PAR>1, and PAR>30 only when it is not marked paid **and** its installment total less its paid amount is positive. A partial payment remains eligible until its balance reaches zero.

**Why:** Historical records can retain an unpaid status after their installment amount has been fully collected. Counting based on the status flag alone incorrectly shows paid installments in PAR.

**How to apply:** Use the outstanding installment balance as a required condition for all PAR days, counts, and amounts. Keep the unpaid status condition as well so a paid installment cannot re-enter PAR due to a data inconsistency.