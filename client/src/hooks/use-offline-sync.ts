import { useEffect, useCallback } from "react";
import { useNetworkStatus } from "./use-network-status";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const PENDING_KEY = "pending_submissions";

export function getQueuedCount(): number {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
    return pending.length;
  } catch {
    return 0;
  }
}

export function queueSubmission(data: Record<string, any>) {
  const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
  pending.push({ ...data, _queuedAt: new Date().toISOString() });
  localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
}

export function useOfflineSync() {
  const isOnline = useNetworkStatus();
  const { toast } = useToast();

  const processQueue = useCallback(async () => {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
    if (pending.length === 0) return;

    let successCount = 0;
    const remaining: any[] = [];

    for (const item of pending) {
      try {
        const { _queuedAt, savedAt, ...payload } = item;
        const requestAmount = parseFloat(payload.requestAmount) || 0;
        const marginRate = parseFloat(payload.marginRate) || 0;
        const durationMonths = parseInt(payload.financingDurationMonths) || 12;
        const numInstallments = parseInt(payload.numberOfInstallments) || 12;
        const profit = (requestAmount * marginRate) / 100;
        const totalReceivable = requestAmount + profit;
        const installmentAmount = numInstallments > 0 ? totalReceivable / numInstallments : 0;

        await apiRequest("POST", "/api/loans", {
          customerId: payload.customerId,
          branchId: payload.branchId,
          financeOfficerId: payload.financeOfficerId,
          fundingSourceId: payload.fundingSourceId,
          productName: payload.productName || "Murabaha",
          financingPurpose: payload.financingPurpose,
          financingCycle: payload.financingCycle,
          requestAmount: requestAmount.toString(),
          financingDurationMonths: durationMonths,
          gracePeriod: parseInt(payload.gracePeriod) || 0,
          numberOfInstallments: numInstallments,
          marginRate: marginRate.toString(),
          profit: profit.toString(),
          totalReceivable: totalReceivable.toString(),
          installmentAmount: installmentAmount.toString(),
          sector: payload.sector,
          businessDescription: payload.businessDescription,
          status: "pending",
        });
        successCount++;
      } catch {
        remaining.push(item);
      }
    }

    localStorage.setItem(PENDING_KEY, JSON.stringify(remaining));

    if (successCount > 0) {
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      toast({
        title: "Synced",
        description: `${successCount} offline application${successCount > 1 ? "s" : ""} submitted successfully`,
      });
    }

    if (remaining.length > 0) {
      toast({
        title: "Sync Incomplete",
        description: `${remaining.length} application${remaining.length > 1 ? "s" : ""} failed to sync`,
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isOnline) {
      processQueue();
    }
  }, [isOnline, processQueue]);

  return { processQueue, isOnline, queuedCount: getQueuedCount() };
}
