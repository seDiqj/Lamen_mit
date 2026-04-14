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
  ChevronDown, ChevronUp, Search, Send, Loader2, HourglassIcon, Printer
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useRef } from "react";

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
  const [filter, setFilter] = useState("all_unpaid");
  const [search, setSearch] = useState("");
  const [expandedLoan, setExpandedLoan] = useState<string | null>(null);
  const [paymentDialog, setPaymentDialog] = useState<CollectionInstallment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentNotes, setPaymentNotes] = useState("");
  const [receiptInstallmentId, setReceiptInstallmentId] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

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

  const { data: receiptData, isLoading: receiptLoading } = useQuery<any>({
    queryKey: ["/api/collection-receipt", receiptInstallmentId],
    queryFn: async () => {
      const res = await fetch(`/api/collection-receipt/${receiptInstallmentId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch receipt");
      return res.json();
    },
    enabled: !!receiptInstallmentId,
  });

  const handlePrintReceipt = () => {
    if (!receiptRef.current) return;
    const printContent = receiptRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Collection Receipt</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 8px; font-size: 11px; color: #000; }
        .receipt-container { max-width: 350px; margin: 0 auto; }
        .receipt-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
        .receipt-header h1 { font-size: 14px; font-weight: bold; margin-bottom: 2px; }
        .receipt-header p { font-size: 10px; color: #333; }
        .receipt-title { text-align: center; font-size: 13px; font-weight: bold; margin: 8px 0; padding: 4px; background: #f0f0f0; border: 1px solid #ccc; }
        .receipt-row { display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px dotted #ddd; }
        .receipt-row .label { color: #555; font-size: 10px; }
        .receipt-row .value { font-weight: 600; font-size: 11px; text-align: right; }
        .receipt-section { margin: 8px 0; }
        .receipt-section-title { font-size: 11px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 4px; }
        .receipt-total { display: flex; justify-content: space-between; padding: 6px 4px; background: #f5f5f5; border: 1px solid #000; font-weight: bold; font-size: 13px; margin: 8px 0; }
        .receipt-footer { text-align: center; margin-top: 12px; padding-top: 8px; border-top: 1px dashed #999; font-size: 9px; color: #666; }
        .receipt-status { text-align: center; padding: 3px; font-weight: bold; font-size: 11px; border: 1px solid; margin: 6px 0; }
        .status-pending { color: #b45309; border-color: #b45309; background: #fef3c7; }
        .status-approved { color: #15803d; border-color: #15803d; background: #dcfce7; }
        .status-paid { color: #15803d; border-color: #15803d; background: #dcfce7; }
        .dashed-line { border-top: 1px dashed #999; margin: 6px 0; }
        @media print { body { padding: 0; } }
      </style></head>
      <body>${printContent}</body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
  };

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
      const instId = paymentDialog?.id;
      setPaymentDialog(null);
      setPaymentAmount("");
      setPaymentNotes("");
      queryClient.invalidateQueries({ queryKey: ["/api/collection-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      if (instId) {
        setReceiptInstallmentId(instId);
      }
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
            <SelectItem value="all_unpaid">Unpaid</SelectItem>
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
                        <div className="grid grid-cols-[2.5rem_1fr_1fr_1fr_auto] gap-1 text-[10px] font-medium text-muted-foreground px-1 pb-1">
                          <span>Inst #</span>
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
                                  className={`grid grid-cols-[2.5rem_1fr_1fr_1fr_auto] gap-1 items-center px-1 py-1.5 rounded text-xs ${
                                    inst.isPaid ? "bg-muted/50" : ""
                                  }`}
                                  data-testid={`row-mobile-installment-${inst.id}`}
                                >
                                  <span className="font-semibold">{inst.installmentNumber}</span>
                                  <span className="flex items-center gap-0.5">
                                    <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span className="truncate">
                                      {new Date(inst.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                                    </span>
                                  </span>
                                  <span className="text-right font-medium">{formatCurrency(inst.totalAmount)}</span>
                                  <span className={`text-right flex items-center justify-end gap-0.5 ${inst.isPaid ? "text-primary" : remaining > 0 ? "text-orange-600" : ""}`}>
                                    {inst.isPaid ? (
                                      <>
                                        <span>Paid</span>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); setReceiptInstallmentId(inst.id); }}
                                          className="ml-0.5 text-muted-foreground hover:text-primary"
                                          data-testid={`button-receipt-${inst.id}`}
                                        >
                                          <Printer className="h-3 w-3" />
                                        </button>
                                      </>
                                    ) : formatCurrency(remaining)}
                                  </span>
                                  <span className="w-5 flex justify-center">
                                    {getStatusIcon(inst.isPaid, status.isOverdue, hasPending)}
                                  </span>
                                </div>
                                {!inst.isPaid && (
                                  <div className="flex items-center justify-between px-1 py-1">
                                    {hasPending ? (
                                      <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="text-[9px] text-amber-600 border-amber-300">
                                          <HourglassIcon className="h-3 w-3 mr-1" /> Pending
                                        </Badge>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); setReceiptInstallmentId(inst.id); }}
                                          className="text-muted-foreground hover:text-primary p-0.5"
                                          data-testid={`button-receipt-pending-${inst.id}`}
                                        >
                                          <Printer className="h-3 w-3" />
                                        </button>
                                      </div>
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
                                          variant="default"
                                          className="h-6 text-[10px] px-2 bg-green-600 hover:bg-green-700 text-white"
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

      <Dialog open={!!receiptInstallmentId} onOpenChange={(open) => { if (!open) setReceiptInstallmentId(null); }}>
        <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Printer className="h-4 w-4" /> Collection Receipt
            </DialogTitle>
          </DialogHeader>
          {receiptLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : receiptData ? (
            <>
              <div ref={receiptRef}>
                <div className="receipt-container">
                  <div className="receipt-header" style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "8px", marginBottom: "8px" }}>
                    <h1 style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 2px" }}>Lamen Micro Finance Institution</h1>
                    <p style={{ fontSize: "10px", color: "#333", margin: 0 }}>License No: 97950</p>
                    <p style={{ fontSize: "10px", color: "#333", margin: 0 }}>{receiptData.branchName} Branch</p>
                  </div>

                  <div className="receipt-title" style={{ textAlign: "center", fontSize: "13px", fontWeight: "bold", margin: "8px 0", padding: "4px", background: "#f0f0f0", border: "1px solid #ccc" }}>
                    COLLECTION RECEIPT
                  </div>

                  <div className="receipt-section" style={{ margin: "8px 0" }}>
                    <div className="receipt-section-title" style={{ fontSize: "11px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "4px" }}>Customer Details</div>
                    <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                      <span className="label" style={{ color: "#555", fontSize: "10px" }}>Customer</span>
                      <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>{receiptData.customerName}</span>
                    </div>
                    {receiptData.fatherName && (
                      <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                        <span className="label" style={{ color: "#555", fontSize: "10px" }}>Father Name</span>
                        <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>{receiptData.fatherName}</span>
                      </div>
                    )}
                    <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                      <span className="label" style={{ color: "#555", fontSize: "10px" }}>Customer No</span>
                      <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>{receiptData.customerNo || "N/A"}</span>
                    </div>
                  </div>

                  <div className="receipt-section" style={{ margin: "8px 0" }}>
                    <div className="receipt-section-title" style={{ fontSize: "11px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "4px" }}>Financing Details</div>
                    <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                      <span className="label" style={{ color: "#555", fontSize: "10px" }}>Financing ID</span>
                      <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>{receiptData.applicationId}</span>
                    </div>
                    <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                      <span className="label" style={{ color: "#555", fontSize: "10px" }}>Product</span>
                      <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>{receiptData.productName}</span>
                    </div>
                    <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                      <span className="label" style={{ color: "#555", fontSize: "10px" }}>Financing Amount</span>
                      <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>AFN {formatCurrency(receiptData.loanAmount)}</span>
                    </div>
                    <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                      <span className="label" style={{ color: "#555", fontSize: "10px" }}>Officer</span>
                      <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>{receiptData.officerName || "N/A"}</span>
                    </div>
                  </div>

                  <div className="receipt-section" style={{ margin: "8px 0" }}>
                    <div className="receipt-section-title" style={{ fontSize: "11px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "4px" }}>Installment Details</div>
                    <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                      <span className="label" style={{ color: "#555", fontSize: "10px" }}>Installment</span>
                      <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>#{receiptData.installmentNumber} of {receiptData.totalInstallments}</span>
                    </div>
                    <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                      <span className="label" style={{ color: "#555", fontSize: "10px" }}>Due Date</span>
                      <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>
                        {receiptData.dueDate ? new Date(receiptData.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}
                      </span>
                    </div>
                    <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                      <span className="label" style={{ color: "#555", fontSize: "10px" }}>Installment Amount</span>
                      <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>AFN {formatCurrency(receiptData.installmentAmount)}</span>
                    </div>
                    {parseFloat(receiptData.principleAmount) > 0 && (
                      <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                        <span className="label" style={{ color: "#555", fontSize: "10px" }}>Principal</span>
                        <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>AFN {formatCurrency(receiptData.principleAmount)}</span>
                      </div>
                    )}
                    {parseFloat(receiptData.marginAmount) > 0 && (
                      <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                        <span className="label" style={{ color: "#555", fontSize: "10px" }}>Margin/Profit</span>
                        <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>AFN {formatCurrency(receiptData.marginAmount)}</span>
                      </div>
                    )}
                  </div>

                  {receiptData.collection ? (
                    <div className="receipt-total" style={{ display: "flex", justifyContent: "space-between", padding: "6px 4px", background: "#f5f5f5", border: "1px solid #000", fontWeight: "bold", fontSize: "13px", margin: "8px 0" }}>
                      <span>Amount Collected</span>
                      <span>AFN {formatCurrency(receiptData.collection.amount)}</span>
                    </div>
                  ) : receiptData.isPaid ? (
                    <div className="receipt-total" style={{ display: "flex", justifyContent: "space-between", padding: "6px 4px", background: "#f5f5f5", border: "1px solid #000", fontWeight: "bold", fontSize: "13px", margin: "8px 0" }}>
                      <span>Amount Paid</span>
                      <span>AFN {formatCurrency(receiptData.paidAmount)}</span>
                    </div>
                  ) : null}

                  {receiptData.collection && (
                    <div className="receipt-section" style={{ margin: "8px 0" }}>
                      <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                        <span className="label" style={{ color: "#555", fontSize: "10px" }}>Payment Date</span>
                        <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>
                          {new Date(receiptData.collection.paymentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                        <span className="label" style={{ color: "#555", fontSize: "10px" }}>Receipt No</span>
                        <span className="value" style={{ fontWeight: 600, fontSize: "11px" }}>{receiptData.collection.id?.substring(0, 8).toUpperCase()}</span>
                      </div>
                      <div className={`receipt-status ${receiptData.collection.status === "approved" ? "status-approved" : "status-pending"}`}
                        style={{
                          textAlign: "center", padding: "3px", fontWeight: "bold", fontSize: "11px", border: "1px solid", margin: "6px 0",
                          color: receiptData.collection.status === "approved" ? "#15803d" : "#b45309",
                          borderColor: receiptData.collection.status === "approved" ? "#15803d" : "#b45309",
                          background: receiptData.collection.status === "approved" ? "#dcfce7" : "#fef3c7",
                        }}>
                        {receiptData.collection.status === "approved" ? "✓ APPROVED" : receiptData.collection.status === "pending" ? "⏳ PENDING APPROVAL" : receiptData.collection.status?.toUpperCase()}
                      </div>
                      {receiptData.collection.notes && (
                        <div className="receipt-row" style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px dotted #ddd" }}>
                          <span className="label" style={{ color: "#555", fontSize: "10px" }}>Notes</span>
                          <span className="value" style={{ fontWeight: 600, fontSize: "11px", maxWidth: "60%", textAlign: "right" }}>{receiptData.collection.notes}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {receiptData.isPaid && !receiptData.collection && (
                    <div className="receipt-status status-paid" style={{ textAlign: "center", padding: "3px", fontWeight: "bold", fontSize: "11px", border: "1px solid #15803d", margin: "6px 0", color: "#15803d", background: "#dcfce7" }}>
                      ✓ FULLY PAID
                    </div>
                  )}

                  <div className="receipt-footer" style={{ textAlign: "center", marginTop: "12px", paddingTop: "8px", borderTop: "1px dashed #999", fontSize: "9px", color: "#666" }}>
                    <p>Printed: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                    <p style={{ marginTop: "2px" }}>Lamen Micro Finance Institution</p>
                    <p>Thank you for your payment</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-row gap-2">
                <Button variant="outline" onClick={() => setReceiptInstallmentId(null)} className="flex-1" data-testid="button-close-receipt">Close</Button>
                <Button onClick={handlePrintReceipt} className="flex-1" data-testid="button-print-receipt">
                  <Printer className="h-4 w-4 mr-1" /> Print
                </Button>
              </DialogFooter>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-sm">Receipt data not available</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
