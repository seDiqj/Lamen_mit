import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import type { Branch } from "@shared/schema";

interface BranchContextType {
  selectedBranchId: string | null;
  setSelectedBranchId: (id: string | null) => void;
  isLocked: boolean;
  branches: Branch[];
  isLoadingBranches: boolean;
  selectedBranchName: string | null;
  effectiveBranchId: string | null;
}

const BranchContext = createContext<BranchContextType | null>(null);

export function BranchProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [manualBranchId, setManualBranchId] = useState<string | null>(null);

  const { data: branches = [], isLoading: isLoadingBranches } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
    enabled: !!user,
  });

  const userBranchId = user?.branchId ?? null;
  const isLocked = !!userBranchId;

  const effectiveBranchId = isLocked ? userBranchId : manualBranchId;

  const selectedBranchName = effectiveBranchId
    ? branches.find((b) => b.id === effectiveBranchId)?.name ?? null
    : null;

  const setSelectedBranchId = useCallback((id: string | null) => {
    if (!isLocked) {
      setManualBranchId(id);
    }
  }, [isLocked]);

  return (
    <BranchContext.Provider
      value={{
        selectedBranchId: effectiveBranchId,
        setSelectedBranchId,
        isLocked,
        branches,
        isLoadingBranches,
        selectedBranchName,
        effectiveBranchId,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) {
    throw new Error("useBranch must be used within BranchProvider");
  }
  return ctx;
}
