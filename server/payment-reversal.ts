export type InstallmentPaymentState = {
  paidAmount: string;
  isPaid: boolean;
  paymentDate: string | null;
  lateDays: number | null;
  installmentVariance: string | null;
};

export type PaymentAllocation = {
  installmentId: string;
  appliedAmount: number;
  prev?: Partial<InstallmentPaymentState>;
};

export type PaymentLedgerEntry = {
  id: string;
  status: "active" | "reversed";
  paymentDate: string | null;
  createdAt: Date | string | null;
  affectedInstallments: string;
};

export type InstallmentForReplay = {
  id: string;
  totalAmount: string | null;
  dueDate: string | null;
  paidAmount: string | null;
  isPaid: boolean | null;
  paymentDate: string | null;
  lateDays: number | null;
  installmentVariance: string | null;
};

export function parsePaymentAllocations(raw: string): PaymentAllocation[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    throw new Error("Payment transaction has malformed installment allocations");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Payment transaction has invalid installment allocations");
  }

  return parsed.map((item: any) => {
    const appliedAmount = Number(item?.appliedAmount);
    if (!item?.installmentId || !Number.isFinite(appliedAmount) || appliedAmount < 0) {
      throw new Error("Payment transaction has invalid installment allocation data");
    }

    return {
      installmentId: item.installmentId,
      appliedAmount,
      prev: item.prev,
    };
  });
}

function asTimestamp(value: Date | string | null): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function previousState(allocation: PaymentAllocation): InstallmentPaymentState | null {
  if (!allocation.prev) return null;
  return {
    paidAmount: String(allocation.prev.paidAmount ?? "0"),
    isPaid: Boolean(allocation.prev.isPaid),
    paymentDate: allocation.prev.paymentDate ?? null,
    lateDays: allocation.prev.lateDays ?? null,
    installmentVariance: allocation.prev.installmentVariance ?? null,
  };
}

export function rebuildInstallmentPaymentState(
  installment: InstallmentForReplay,
  ledgerEntries: PaymentLedgerEntry[],
): InstallmentPaymentState {
  const relevant = ledgerEntries
    .map((entry) => ({
      entry,
      allocation: parsePaymentAllocations(entry.affectedInstallments)
        .find((allocation) => allocation.installmentId === installment.id),
    }))
    .filter((item): item is { entry: PaymentLedgerEntry; allocation: PaymentAllocation } => Boolean(item.allocation))
    .sort((a, b) => asTimestamp(a.entry.createdAt) - asTimestamp(b.entry.createdAt) || a.entry.id.localeCompare(b.entry.id));

  if (relevant.length === 0) {
    return {
      paidAmount: String(installment.paidAmount ?? "0"),
      isPaid: Boolean(installment.isPaid),
      paymentDate: installment.paymentDate ?? null,
      lateDays: installment.lateDays ?? null,
      installmentVariance: installment.installmentVariance ?? null,
    };
  }

  const baseline = previousState(relevant[0].allocation) ?? {
    paidAmount: "0",
    isPaid: false,
    paymentDate: null,
    lateDays: null,
    installmentVariance: null,
  };

  const totalAmount = Number(installment.totalAmount ?? 0);
  let paidAmount = Math.max(0, Number(baseline.paidAmount) || 0);
  let paymentDate = baseline.paymentDate;

  for (const { entry, allocation } of relevant) {
    if (entry.status !== "active") continue;
    paidAmount += allocation.appliedAmount;
    if (entry.paymentDate) paymentDate = entry.paymentDate;
  }

  paidAmount = Math.round(paidAmount * 100) / 100;
  const isPaid = totalAmount > 0 && paidAmount >= totalAmount - 0.005;
  if (!isPaid) {
    return {
      paidAmount: paidAmount.toFixed(2),
      isPaid: false,
      paymentDate: paidAmount > 0 ? paymentDate : null,
      lateDays: null,
      installmentVariance: null,
    };
  }

  let lateDays = 0;
  if (paymentDate && installment.dueDate) {
    const dueDate = new Date(installment.dueDate);
    const paidOn = new Date(paymentDate);
    lateDays = Math.max(0, Math.floor((paidOn.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
  }

  return {
    paidAmount: paidAmount.toFixed(2),
    isPaid: true,
    paymentDate,
    lateDays,
    installmentVariance: lateDays.toString(),
  };
}