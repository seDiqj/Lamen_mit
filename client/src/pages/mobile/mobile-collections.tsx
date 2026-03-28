import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar, Banknote, AlertTriangle, Clock, CheckCircle,
  ChevronDown, ChevronUp, Search, Send, Loader2, HourglassIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

type FinanceOfficer = {
  id: string;
  name: string;
};

type CollectionInstallment = {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  principleAmount: string;
  marginAmount: string;
  totalAmount: string;
  paidAmount: string;
  installmentVariance: string | null;
  paymentDate: string | null;
  lateDays: number | null;
  isPaid: boolean;
  loanApplicationId: string;
  customerName: string;
  branchName: string;
  financeOfficerName: string | null;
};

type CollectionSummary = {
  totalDue: string;
  totalCollected: string;
  totalRemaining: string;
  overdueCount: number;
  upcomingCount: number;
  partialCount: number;
};

const formatCurrency = (amount: string | number | undefined) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat("en-AF", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

function getDaysStatus(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) {
    return { label: `${Math.abs(diff)}d overdue`, isOverdue: true, days: Math.abs(diff) };
  } else if (diff === 0) {
    return { label: "Due today", isOverdue: false, days: 0 };
  } else {
    return { label: `In ${diff}d`, isOverdue: false, days: diff };
  }
}

function getStatusIcon(isPaid: boolean, isOverdue: boolean, hasPending: boolean) {
  if (isPaid) return <CheckCircle className="h-4 w-4 text-primary" />;
  if (hasPending) return <HourglassIcon className="h-4 w-4 text-amber-500" />;
  if (isOverdue) return <AlertTriangle className="h-4 w-4 text-destructive" />;
  return <Clock className="h-4 w-4 text-muted-foreground" />;
}

export default function MobileCollections() {
  const { toast } = useToast();
  const [filter, setFilter] = useState("due_soon");
  const [search, setSearch] = useState("");
  const [expandedLoan, setExpandedLoan] = useState<string | null>(null);
  const [paymentDialog, setPaymentDialog] = useState<CollectionInstallment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentNotes, setPaymentNotes] = useState("");

  const { data: roleData, isLoading: roleLoading } = useQuery<{ role: string; roleType: string }>({
    queryKey: ["/api/user/role"],
  });
  const userRole = roleData?.role || "user";
  const userRoleType = roleData?.roleType || userRole;
  const isAdminOrManager = userRoleType === "admin" || userRoleType === "manager" || userRole === "admin" || userRole === "manager";

  const { data: myOfficer, isLoading: officerLoading } = useQuery<FinanceOfficer | null>({
    queryKey: ["/api/finance-officers/me"],
    enabled: !isAdminOrManager,
  });

  const officerReady = isAdminOrManager || !!myOfficer?.id;

  const { data, isLoading } = useQuery<{
    installments: CollectionInstallment[];
    total: number;
    summary: CollectionSummary;
  }>({
    queryKey: ["/api/collections", filter, isAdminOrManager ? "all" : myOfficer?.id, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("filter", filter);
      if (!isAdminOrManager && myOfficer?.id) params.set("officer", myOfficer.id);
      if (search) params.set("search", search);
      params.set("page", "1");
      params.set("limit", "500");
      const res = await fetch(`/api/collections?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch collections");
      return res.json();
    },
    enabled: !roleLoading && officerReady,
  });

  const { data: pendingRecords = [] } = useQuery<any[]>({
    queryKey: ["/api/collection-records", "pending"],
    queryFn: async () => {
      const res = await fetch("/api/collection-records?status=pending", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const pendingInstallmentIds = new Set(pendingRecords.map((r: any) => r.installment_id));

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/collection-records", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Submitted", description: "Collection record submitted for approval" });
      setPaymentDialog(null);
      setPaymentAmount("");
      setPaymentNotes("");
      queryClient.invalidateQueries({ queryKey: ["/api/collection-records"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to submit", variant: "destructive" });
    },
  });

  const handleSubmitPayment = () => {
    if (!paymentDialog || !paymentAmount) return;
    submitMutation.mutate({
      installmentId: paymentDialog.id,
      amount: parseFloat(paymentAmount),
      paymentDate,
      notes: paymentNotes || undefined,
    });
  };

  const openPaymentDialog = (inst: CollectionInstallment) => {
    const remaining = parseFloat(inst.totalAmount || "0") - parseFloat(inst.paidAmount || "0");
    setPaymentAmount(remaining > 0 ? remaining.toString() : "");
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setPaymentNotes("");
    setPaymentDialog(inst);
  };

  const installments = data?.installments || [];
  const summary = data?.summary;

  const loanGroups: Record<string, { loanAppId: string; customerName: string; installments: CollectionInstallment[] }> = {};
  installments.forEach((inst) => {
    if (!loanGroups[inst.loanId]) {
      loanGroups[inst.loanId] = {
        loanAppId: inst.loanApplicationId,
        customerName: inst.customerName,
        installments: [],
      };
    }
    loanGroups[inst.loanId].installments.push(inst);
  });

  const loanEntries = Object.entries(loanGroups);

  if (roleLoading || (!isAdminOrManager && officerLoading)) {
    return (
      <div className="p-3 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="p-3"><Skeleton className="h-16 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  if (!isAdminOrManager && !myOfficer) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-muted-foreground">
        <Banknote className="h-12 w-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">No officer profile linked</p>
        <p className="text-xs mt-1">Contact admin to link your account to a financing officer profile.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-card border-b px-3 py-2 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customer or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
            data-testid="input-mobile-collection-search"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-8 text-xs" data-testid="select-mobile-collection-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="due_soon">Due Soon</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {summary && (
        <div className="grid grid-cols-3 gap-2 px-3 py-2 border-b bg-muted/30" data-testid="mobile-collection-summary">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">Total Due</p>
            <p className="text-xs font-bold" data-testid="text-mobile-total-due">{formatCurrency(summary.totalDue)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">Collected</p>
            <p className="text-xs font-bold text-primary" data-testid="text-mobile-total-collected">{formatCurrency(summary.totalCollected)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">Remaining</p>
            <p className="text-xs font-bold text-orange-600" data-testid="text-mobile-total-remaining">{formatCurrency(summary.totalRemaining)}</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto px-3 py-2 space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}><CardContent className="p-3"><Skeleton className="h-14 w-full" /></CardContent></Card>
          ))
        ) : loanEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Banknote className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No collections found</p>
          </div>
        ) : (
          loanEntries.map(([loanId, group]) => {
            const isExpanded = expandedLoan === loanId;
            const totalDue = group.installments.reduce((sum, i) => sum + parseFloat(i.totalAmount || "0"), 0);
            const totalPaid = group.installments.reduce((sum, i) => sum + parseFloat(i.paidAmount || "0"), 0);
            const overdueCount = group.installments.filter((i) => !i.isPaid && getDaysStatus(i.dueDate).isOverdue).length;
            const paidCount = group.installments.filter((i) => i.isPaid).length;

            return (
              <Card key={loanId} data-testid={`card-mobile-collection-${loanId}`}>
                <CardContent className="p-0">
                  <button
                    className="w-full p-3 text-left"
                    onClick={() => setExpandedLoan(isExpanded ? null : loanId)}
                    data-testid={`button-expand-collection-${loanId}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" data-testid={`text-collection-customer-${loanId}`}>
                          {group.customerName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{group.loanAppId}</p>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-1.5">
                        <div>
                          <p className="text-sm font-bold">{formatCurrency(totalDue)} <span className="text-[10px] font-normal">AFN</span></p>
                          <div className="flex items-center gap-1 justify-end">
                            {overdueCount > 0 && (
                              <Badge variant="destructive" className="text-[9px] px-1 py-0">{overdueCount} overdue</Badge>
                            )}
                            <span className="text-[10px] text-muted-foreground">{paidCount}/{group.installments.length}</span>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t px-3 pb-3">
                      <div className="grid grid-cols-2 gap-2 py-2">
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">Total Due</p>
                          <p className="text-xs font-semibold">{formatCurrency(totalDue)} AFN</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">Total Paid</p>
                          <p className="text-xs font-semibold text-primary">{formatCurrency(totalPaid)} AFN</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="grid grid-cols-[2rem_1fr_1fr_1fr_auto] gap-1 text-[10px] font-medium text-muted-foreground px-1 pb-1">
                          <span>#</span>
                          <span>Due Date</span>
                          <span className="text-right">Amount</span>
                          <span className="text-right">Remaining</span>
                          <span className="text-center w-5">St</span>
                        </div>
                        {group.installments
                          .sort((a, b) => a.installmentNumber - b.installmentNumber)
                          .map((inst) => {
                            const status = getDaysStatus(inst.dueDate);
                            const remaining = parseFloat(inst.totalAmount || "0") - parseFloat(inst.paidAmount || "0");
                            const hasPending = pendingInstallmentIds.has(inst.id);
                            return (
                              <div key={inst.id}>
                                <div
                                  className={`grid grid-cols-[2rem_1fr_1fr_1fr_auto] gap-1 items-center px-1 py-1.5 rounded text-xs ${
                                    inst.isPaid ? "bg-muted/50" : ""
                                  }`}
                                  data-testid={`row-mobile-installment-${inst.id}`}
                                >
                                  <span className="text-muted-foreground">{inst.installmentNumber}</span>
                                  <span className="flex items-center gap-0.5">
                                    <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span className="truncate">
                                      {new Date(inst.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                                    </span>
                                  </span>
                                  <span className="text-right font-medium">{formatCurrency(inst.totalAmount)}</span>
                                  <span className={`text-right ${inst.isPaid ? "text-primary" : remaining > 0 ? "text-orange-600" : ""}`}>
                                    {inst.isPaid ? "Paid" : formatCurrency(remaining)}
                                  </span>
                                  <span className="w-5 flex justify-center">
                                    {getStatusIcon(inst.isPaid, status.isOverdue, hasPending)}
                                  </span>
                                </div>
                                {!inst.isPaid && (
                                  <div className="flex items-center justify-between px-1 py-1">
                                    {hasPending ? (
                                      <Badge variant="outline" className="text-[9px] text-amber-600 border-amber-300">
                                        <HourglassIcon className="h-3 w-3 mr-1" /> Pending Approval
                                      </Badge>
                                    ) : (
                                      <>
                                        {status.isOverdue && (
                                          <span className="text-[10px] text-destructive font-medium">{status.label}</span>
                                        )}
                                        {!status.isOverdue && status.days <= 7 && (
                                          <span className="text-[10px] text-amber-600 font-medium">{status.label}</span>
                                        )}
                                        {!status.isOverdue && status.days > 7 && (
                                          <span className="text-[10px] text-muted-foreground">{status.label}</span>
                                        )}
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 text-[10px] px-2"
                                          onClick={() => openPaymentDialog(inst)}
                                          data-testid={`button-record-payment-${inst.id}`}
                                        >
                                          <Send className="h-3 w-3 mr-1" /> Record
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={!!paymentDialog} onOpenChange={(open) => { if (!open) setPaymentDialog(null); }}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base">Record Collection</DialogTitle>
          </DialogHeader>
          {paymentDialog && (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-sm font-semibold">{paymentDialog.customerName}</p>
                <p className="text-xs text-muted-foreground">{paymentDialog.loanApplicationId} - Installment #{paymentDialog.installmentNumber}</p>
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">{formatCurrency(paymentDialog.totalAmount)} AFN</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Already Paid:</span>
                  <span className="font-medium">{formatCurrency(paymentDialog.paidAmount)} AFN</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="font-bold text-orange-600">
                    {formatCurrency(parseFloat(paymentDialog.totalAmount || "0") - parseFloat(paymentDialog.paidAmount || "0"))} AFN
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Payment Amount (AFN)</Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="h-9"
                  data-testid="input-payment-amount"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Payment Date</Label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="h-9"
                  data-testid="input-payment-date"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Notes (optional)</Label>
                <Textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Any notes about the collection..."
                  rows={2}
                  className="text-sm"
                  data-testid="input-payment-notes"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialog(null)} className="flex-1">Cancel</Button>
            <Button
              onClick={handleSubmitPayment}
              disabled={submitMutation.isPending || !paymentAmount || parseFloat(paymentAmount) <= 0}
              className="flex-1"
              data-testid="button-submit-collection"
            >
              {submitMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="h-4 w-4 mr-1" /> Submit</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
