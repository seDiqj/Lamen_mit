import { useBranch } from "@/contexts/branch-context";
import { Building2, ChevronDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function BranchSelector() {
  const { selectedBranchId, setSelectedBranchId, isLocked, branches, selectedBranchName } = useBranch();
  const [open, setOpen] = useState(false);

  if (isLocked) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20 dark:bg-primary/10 dark:border-primary/30" data-testid="branch-indicator-locked">
        <Building2 className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-primary">{selectedBranchName || "Branch"}</span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-2 text-xs font-medium transition-all",
            selectedBranchId
              ? "bg-primary/5 border-primary/30 text-primary hover:bg-primary/10 dark:bg-primary/10 dark:border-primary/40"
              : "text-muted-foreground hover:text-foreground"
          )}
          data-testid="button-branch-selector"
        >
          <Building2 className="h-3.5 w-3.5" />
          <span className="max-w-[140px] truncate">
            {selectedBranchId ? selectedBranchName || "Branch" : "All Branches"}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1.5" align="end">
        <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5 mb-1">
          Filter by Branch
        </div>
        <button
          className={cn(
            "flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
            !selectedBranchId && "bg-primary/10 text-primary font-medium"
          )}
          onClick={() => { setSelectedBranchId(null); setOpen(false); }}
          data-testid="branch-option-all"
        >
          <div className={cn(
            "flex items-center justify-center w-4 h-4 rounded-full border",
            !selectedBranchId ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
          )}>
            {!selectedBranchId && <Check className="h-3 w-3" />}
          </div>
          <span>All Branches</span>
          {!selectedBranchId && (
            <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1.5">Active</Badge>
          )}
        </button>
        <div className="h-px bg-border my-1" />
        <div className="max-h-[240px] overflow-y-auto">
          {branches.map((branch) => (
            <button
              key={branch.id}
              className={cn(
                "flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                selectedBranchId === branch.id && "bg-primary/10 text-primary font-medium"
              )}
              onClick={() => { setSelectedBranchId(branch.id); setOpen(false); }}
              data-testid={`branch-option-${branch.id}`}
            >
              <div className={cn(
                "flex items-center justify-center w-4 h-4 rounded-full border",
                selectedBranchId === branch.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
              )}>
                {selectedBranchId === branch.id && <Check className="h-3 w-3" />}
              </div>
              <span className="truncate">{branch.name}</span>
              {selectedBranchId === branch.id && (
                <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1.5">Active</Badge>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
