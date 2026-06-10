---
name: Journal line class tagging
description: Which journal_lines carry a classId in the Lamen MFI accounting data, and why income-by-class reports show "Unassigned".
---

In the production database, posted `journal_lines` are tagged with `class_id` very
unevenly across account types:

- **Income** (`operating_income`, `other_income`): effectively **none** are tagged —
  all income activity falls into the "Unassigned" bucket.
- **Expenses** (`operating_expense`, `cost_of_financing`, `non_operating_expense`):
  only a minority are tagged; the majority are still null-class.

**Why it matters:** Any report that breaks figures down "by class" (e.g. the Income
Statement crosstab at `/income-statement`) must group by the actual `class_id` and
include an explicit "Unassigned" column for null-class lines, or the per-class
columns will not reconcile to the grand total. Do NOT assume income is tagged just
because a mockup shows income split across named class columns — the mockup columns
(HQ/Jalalabad/etc.) were illustrative and do not match the real `classes` rows.

**How to apply:** When building class-dimension reports, aggregate over `class_id`
(NULL → Unassigned) rather than filtering to one class, and verify the Total column
equals the sum across class columns. Class assignment happens at journal-entry
creation; back-tagging historical lines is out of scope unless explicitly requested.
