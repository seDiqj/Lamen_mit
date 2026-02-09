import { useState, useRef, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ChevronDown,
  X,
  Eye,
  Save,
  Calculator,
  Lock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

type InstallmentRow = {
  id: string | null;
  installmentNumber: number;
  dueDate: string | null;
  currentPrincipal: number | null;
  currentMargin: number | null;
  currentTotal: number | null;
  calculatedPrincipal: number;
  calculatedMargin: number;
  calculatedTotal: number;
  paidAmount: number;
  isPaid: boolean;
  paymentDate: string | null;
  lateDays: number | null;
  hasNullAmounts: boolean;
};

type ScheduleData = {
  loan: {
    id: string;
    applicationId: string;
    principalAmount: number;
    marginRate: number;
    numberOfInstallments: number;
    status: string;
    productName: string;
  };
  customer: { id: string; name: string; customerNo: string } | null;
  branch: { id: string; name: string } | null;
  disbursement: { disbursementDate: string; firstInstallmentDate: string; maturityDate: string } | null;
  installments: InstallmentRow[];
  summary: {
    totalInstallments: number;
    nullAmountCount: number;
    paidCount: number;
    unpaidCount: number;
  };
};

function formatAFN(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-AF", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export default function InstallmentManagementPage() {
  const { toast } = useToast();
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [editedRows, setEditedRows] = useState<Record<string, { principal: string; margin: string }>>({});
  const [applyCalculated, setApplyCalculated] = useState(false);

  const { data: disbursedLoans, isLoading: loansLoading } = useQuery<any[]>({
    queryKey: ["/api/loans/disbursed"],
  });

  const { data: scheduleData, isLoading: scheduleLoading, refetch: refetchSchedule } = useQuery<ScheduleData>({
    queryKey: ["/api/loans", selectedLoanId, "installment-schedule"],
    enabled: showSchedule && !!selectedLoanId,
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async (updates: any[]) => {
      const res = await apiRequest("PATCH", "/api/installments/bulk-update", { updates });
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Saved", description: `Updated ${data.updatedCount} installments, skipped ${data.skippedCount} (paid).` });
      setEditedRows({});
      queryClient.invalidateQueries({ queryKey: ["/api/loans", selectedLoanId, "installment-schedule"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to save", variant: "destructive" });
    },
  });

  const loanList = Array.isArray(disbursedLoans) ? disbursedLoans : [];

  const getLoanLabel = (l: any) =>
    `${l.customerName} (${l.customerNo || "N/A"}) - ${l.applicationId || "N/A"}`;

  const filteredLoans = useMemo(() => {
    if (!searchTerm.trim()) return loanList;
    const lower = searchTerm.toLowerCase();
    return loanList.filter((l: any) => getLoanLabel(l).toLowerCase().includes(lower));
  }, [loanList, searchTerm]);

  const selectedLoanLabel = useMemo(() => {
    if (!selectedLoanId) return "";
    const found = loanList.find((l: any) => l.id === selectedLoanId);
    return found ? getLoanLabel(found) : "";
  }, [selectedLoanId, loanList]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleView = () => {
    if (!selectedLoanId) {
      toast({ title: "Select Financing", description: "Please select a financing first.", variant: "destructive" });
      return;
    }
    setShowSchedule(true);
    setEditedRows({});
    setApplyCalculated(false);
  };

  const getRowKey = (inst: InstallmentRow) => inst.id || `new_${inst.installmentNumber}`;

  const handleApplyCalculated = () => {
    if (!scheduleData) return;
    const newEdited: Record<string, { principal: string; margin: string }> = {};
    for (const inst of scheduleData.installments) {
      if (!inst.isPaid) {
        newEdited[getRowKey(inst)] = {
          principal: inst.calculatedPrincipal.toFixed(2),
          margin: inst.calculatedMargin.toFixed(2),
        };
      }
    }
    setEditedRows(newEdited);
    setApplyCalculated(true);
    toast({ title: "Calculated Values Applied", description: "Review the values and click Save to persist changes." });
  };

  const handleRowChange = (id: string, field: "principal" | "margin", value: string) => {
    setEditedRows((prev) => ({
      ...prev,
      [id]: {
        principal: prev[id]?.principal || "",
        margin: prev[id]?.margin || "",
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    if (!scheduleData) return;
    const updates = Object.entries(editedRows)
      .filter(([_, v]) => v.principal || v.margin)
      .map(([key, v]) => {
        const isNew = key.startsWith("new_");
        if (isNew) {
          const instNum = parseInt(key.replace("new_", ""));
          const inst = scheduleData.installments.find((i) => i.installmentNumber === instNum);
          return {
            id: null,
            loanId: scheduleData.loan.id,
            installmentNumber: instNum,
            dueDate: inst?.dueDate || null,
            principleAmount: v.principal,
            marginAmount: v.margin,
          };
        }
        return {
          id: key,
          principleAmount: v.principal,
          marginAmount: v.margin,
        };
      });

    if (updates.length === 0) {
      toast({ title: "No Changes", description: "No installments were modified.", variant: "destructive" });
      return;
    }

    bulkUpdateMutation.mutate(updates);
  };

  const getDisplayPrincipal = (inst: InstallmentRow) => {
    const key = getRowKey(inst);
    if (editedRows[key]) return editedRows[key].principal;
    if (inst.currentPrincipal !== null) return inst.currentPrincipal.toFixed(2);
    return "";
  };

  const getDisplayMargin = (inst: InstallmentRow) => {
    const key = getRowKey(inst);
    if (editedRows[key]) return editedRows[key].margin;
    if (inst.currentMargin !== null) return inst.currentMargin.toFixed(2);
    return "";
  };

  const getDisplayTotal = (inst: InstallmentRow) => {
    const key = getRowKey(inst);
    if (editedRows[key]) {
      const p = parseFloat(editedRows[key].principal || "0");
      const m = parseFloat(editedRows[key].margin || "0");
      return (p + m).toFixed(2);
    }
    if (inst.currentTotal !== null) return inst.currentTotal.toFixed(2);
    return "";
  };

  const hasChanges = Object.keys(editedRows).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-installment-mgmt-title">
            Installment Schedule Management
          </h1>
          <p className="text-muted-foreground">
            Review and update installment amounts for disbursed financings
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex-1 min-w-[300px] relative" ref={dropdownRef}>
              <label className="text-sm font-medium mb-2 block">Select Financing</label>
              <div
                className="flex items-center border rounded-md bg-background cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                data-testid="select-loan"
              >
                <Search className="ml-3 h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  className="flex-1 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                  placeholder={selectedLoanId ? selectedLoanLabel : "Search by customer name, ID, or application..."}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setDropdownOpen(true); }}
                  onFocus={() => setDropdownOpen(true)}
                  onClick={(e) => e.stopPropagation()}
                  data-testid="input-search-loan"
                />
                {selectedLoanId && !searchTerm && (
                  <button
                    className="mr-1 p-1 rounded-sm hover-elevate"
                    onClick={(e) => { e.stopPropagation(); setSelectedLoanId(""); setSearchTerm(""); setShowSchedule(false); }}
                    data-testid="button-clear-loan"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
                <ChevronDown className="mr-3 h-4 w-4 text-muted-foreground shrink-0" />
              </div>
              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md border bg-popover shadow-md">
                  {loansLoading ? (
                    <div className="p-3 text-sm text-muted-foreground">Loading...</div>
                  ) : filteredLoans.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">No disbursed financings found</div>
                  ) : (
                    filteredLoans.map((l: any) => (
                      <div
                        key={l.id}
                        className={`px-3 py-2 text-sm cursor-pointer hover-elevate ${l.id === selectedLoanId ? "bg-primary text-primary-foreground" : ""}`}
                        onClick={() => { setSelectedLoanId(l.id); setSearchTerm(""); setDropdownOpen(false); setShowSchedule(false); }}
                        data-testid={`option-loan-${l.id}`}
                      >
                        <span className="font-medium">{l.customerName}</span>
                        <span className="text-muted-foreground ml-1">({l.customerNo})</span>
                        <span className="text-muted-foreground ml-2">- {l.applicationId}</span>
                        {l.branchName && <span className="text-muted-foreground ml-2">[{l.branchName}]</span>}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <Button onClick={handleView} className="bg-blue-600 text-white" data-testid="button-view-schedule">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSchedule && scheduleLoading && (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      )}

      {showSchedule && scheduleData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Installments</div>
                <div className="text-2xl font-bold" data-testid="text-total-installments">{scheduleData.summary.totalInstallments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Missing Amounts</div>
                <div className="text-2xl font-bold text-amber-600" data-testid="text-null-count">
                  {scheduleData.summary.nullAmountCount}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Paid</div>
                <div className="text-2xl font-bold text-green-600" data-testid="text-paid-count">{scheduleData.summary.paidCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Unpaid</div>
                <div className="text-2xl font-bold text-blue-600" data-testid="text-unpaid-count">{scheduleData.summary.unpaidCount}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">
                  {scheduleData.customer?.name || "Unknown"} — {scheduleData.loan.applicationId}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Principal: {formatAFN(scheduleData.loan.principalAmount)} AFN | Margin Rate: {scheduleData.loan.marginRate > 1 ? scheduleData.loan.marginRate : (scheduleData.loan.marginRate * 100).toFixed(0)}% | {scheduleData.loan.numberOfInstallments} installments
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {scheduleData.summary.nullAmountCount > 0 && (
                  <Button onClick={handleApplyCalculated} variant="outline" className="border-amber-500 text-amber-700" data-testid="button-apply-calculated">
                    <Calculator className="mr-2 h-4 w-4" />
                    Apply Calculated Values ({scheduleData.summary.nullAmountCount})
                  </Button>
                )}
                {hasChanges && (
                  <Button onClick={handleSave} className="bg-green-600 text-white" disabled={bulkUpdateMutation.isPending} data-testid="button-save-installments">
                    <Save className="mr-2 h-4 w-4" />
                    {bulkUpdateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">#</th>
                      <th className="px-4 py-3 text-left font-medium">Due Date</th>
                      <th className="px-4 py-3 text-right font-medium">Calculated Principal</th>
                      <th className="px-4 py-3 text-right font-medium">Calculated Margin</th>
                      <th className="px-4 py-3 text-right font-medium">Principal Amount</th>
                      <th className="px-4 py-3 text-right font-medium">Margin Amount</th>
                      <th className="px-4 py-3 text-right font-medium">Total</th>
                      <th className="px-4 py-3 text-right font-medium">Paid</th>
                      <th className="px-4 py-3 text-center font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData.installments.map((inst, idx) => {
                      const rowKey = getRowKey(inst);
                      const isEditable = !inst.isPaid;
                      const displayPrincipal = getDisplayPrincipal(inst);
                      const displayMargin = getDisplayMargin(inst);
                      const displayTotal = getDisplayTotal(inst);
                      const isModified = !!editedRows[rowKey];

                      return (
                        <tr
                          key={rowKey}
                          className={`border-b ${inst.isPaid ? "bg-green-50/50 dark:bg-green-950/20" : inst.hasNullAmounts ? "bg-amber-50/50 dark:bg-amber-950/20" : ""} ${isModified ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
                          data-testid={`row-installment-${inst.installmentNumber}`}
                        >
                          <td className="px-4 py-2 font-medium">{inst.installmentNumber}</td>
                          <td className="px-4 py-2">{inst.dueDate || "—"}</td>
                          <td className="px-4 py-2 text-right text-muted-foreground">{formatAFN(inst.calculatedPrincipal)}</td>
                          <td className="px-4 py-2 text-right text-muted-foreground">{formatAFN(inst.calculatedMargin)}</td>
                          <td className="px-4 py-2 text-right">
                            {inst.isPaid ? (
                              <span>{inst.currentPrincipal !== null ? formatAFN(inst.currentPrincipal) : "—"}</span>
                            ) : isEditable ? (
                              <input
                                type="number"
                                step="0.01"
                                className="w-28 px-2 py-1 text-right border rounded-md bg-background text-sm"
                                value={displayPrincipal}
                                onChange={(e) => handleRowChange(rowKey, "principal", e.target.value)}
                                placeholder="0.00"
                                data-testid={`input-principal-${inst.installmentNumber}`}
                              />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {inst.isPaid ? (
                              <span>{inst.currentMargin !== null ? formatAFN(inst.currentMargin) : "—"}</span>
                            ) : isEditable ? (
                              <input
                                type="number"
                                step="0.01"
                                className="w-28 px-2 py-1 text-right border rounded-md bg-background text-sm"
                                value={displayMargin}
                                onChange={(e) => handleRowChange(rowKey, "margin", e.target.value)}
                                placeholder="0.00"
                                data-testid={`input-margin-${inst.installmentNumber}`}
                              />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            {displayTotal ? formatAFN(parseFloat(displayTotal)) : "—"}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {formatAFN(inst.paidAmount)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {inst.isPaid ? (
                              <Badge variant="default" className="bg-green-600 text-white">
                                <Lock className="mr-1 h-3 w-3" />
                                Paid
                              </Badge>
                            ) : inst.hasNullAmounts ? (
                              <Badge variant="outline" className="border-amber-500 text-amber-700">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Missing
                              </Badge>
                            ) : isModified ? (
                              <Badge variant="outline" className="border-blue-500 text-blue-700">
                                Modified
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Set
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-bold bg-muted/30">
                      <td className="px-4 py-3" colSpan={2}>Totals</td>
                      <td className="px-4 py-3 text-right">
                        {formatAFN(scheduleData.installments.reduce((s, i) => s + i.calculatedPrincipal, 0))}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatAFN(scheduleData.installments.reduce((s, i) => s + i.calculatedMargin, 0))}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatAFN(
                          scheduleData.installments.reduce((s, i) => {
                            const dp = getDisplayPrincipal(i);
                            return s + (dp ? parseFloat(dp) : 0);
                          }, 0)
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatAFN(
                          scheduleData.installments.reduce((s, i) => {
                            const dm = getDisplayMargin(i);
                            return s + (dm ? parseFloat(dm) : 0);
                          }, 0)
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatAFN(
                          scheduleData.installments.reduce((s, i) => {
                            const dt = getDisplayTotal(i);
                            return s + (dt ? parseFloat(dt) : 0);
                          }, 0)
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatAFN(scheduleData.installments.reduce((s, i) => s + i.paidAmount, 0))}
                      </td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
