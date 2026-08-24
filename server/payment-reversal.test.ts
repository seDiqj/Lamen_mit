import assert from "node:assert/strict";
import test from "node:test";
import {
  rebuildInstallmentPaymentState,
  type InstallmentForReplay,
  type PaymentLedgerEntry,
} from "./payment-reversal";

const installment = (id: string, totalAmount = "100.00"): InstallmentForReplay => ({
  id,
  totalAmount,
  dueDate: "2026-01-15",
  paidAmount: "0.00",
  isPaid: false,
  paymentDate: null,
  lateDays: null,
  installmentVariance: null,
});

const ledger = (
  id: string,
  status: "active" | "reversed",
  paymentDate: string,
  affectedInstallments: unknown,
): PaymentLedgerEntry => ({
  id,
  status,
  paymentDate,
  createdAt: `2026-01-${id === "first" ? "10" : "20"}T10:00:00.000Z`,
  affectedInstallments: JSON.stringify(affectedInstallments),
});

test("keeps a partial payment partial after ledger replay", () => {
  const result = rebuildInstallmentPaymentState(installment("one"), [
    ledger("first", "active", "2026-01-10", [{
      installmentId: "one",
      appliedAmount: "25.00",
      prev: { paidAmount: "0.00", isPaid: false, paymentDate: null, lateDays: null, installmentVariance: null },
    }]),
  ]);

  assert.deepEqual(result, {
    paidAmount: "25.00",
    isPaid: false,
    paymentDate: "2026-01-10",
    lateDays: null,
    installmentVariance: null,
  });
});

test("reverses overflow allocations across every affected installment", () => {
  const collection = ledger("first", "active", "2026-01-10", [
    {
      installmentId: "one",
      appliedAmount: "100.00",
      prev: { paidAmount: "0.00", isPaid: false, paymentDate: null, lateDays: null, installmentVariance: null },
    },
    {
      installmentId: "two",
      appliedAmount: "50.00",
      prev: { paidAmount: "0.00", isPaid: false, paymentDate: null, lateDays: null, installmentVariance: null },
    },
  ]);

  assert.equal(rebuildInstallmentPaymentState(installment("one"), [collection]).paidAmount, "100.00");
  assert.equal(rebuildInstallmentPaymentState(installment("one"), [collection]).isPaid, true);
  assert.equal(rebuildInstallmentPaymentState(installment("two"), [collection]).paidAmount, "50.00");
  assert.equal(rebuildInstallmentPaymentState(installment("two"), [collection]).isPaid, false);

  const reversedCollection = { ...collection, status: "reversed" as const };
  assert.equal(rebuildInstallmentPaymentState(installment("one"), [reversedCollection]).paidAmount, "0.00");
  assert.equal(rebuildInstallmentPaymentState(installment("two"), [reversedCollection]).paidAmount, "0.00");
});

test("retains a later valid payment when an earlier payment is reversed", () => {
  const firstPayment = ledger("first", "reversed", "2026-01-10", [{
    installmentId: "one",
    appliedAmount: "40.00",
    prev: { paidAmount: "0.00", isPaid: false, paymentDate: null, lateDays: null, installmentVariance: null },
  }]);
  const secondPayment = ledger("second", "active", "2026-01-20", [{
    installmentId: "one",
    appliedAmount: "20.00",
    prev: { paidAmount: "40.00", isPaid: false, paymentDate: "2026-01-10", lateDays: null, installmentVariance: null },
  }]);

  const result = rebuildInstallmentPaymentState(installment("one"), [firstPayment, secondPayment]);

  assert.deepEqual(result, {
    paidAmount: "20.00",
    isPaid: false,
    paymentDate: "2026-01-20",
    lateDays: null,
    installmentVariance: null,
  });
});