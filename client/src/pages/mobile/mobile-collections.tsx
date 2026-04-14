import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import QRCode from "qrcode";
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
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

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

  useEffect(() => {
    setQrDataUrl("");
    if (!receiptData) return;
    let cancelled = false;
    const collAmt = receiptData.collection ? receiptData.collection.amount : (receiptData.isPaid ? receiptData.paidAmount : "0");
    const payDt = receiptData.collection?.paymentDate || receiptData.paymentDate || "";
    const collBy = receiptData.collection?.collectedBy || "N/A";
    const qrText = [
      `CID:${receiptData.customerNo || "N/A"}`,
      `Inst:${receiptData.installmentNumber}`,
      `Amt:${collAmt}`,
      `Date:${payDt}`,
      `By:${collBy}`,
    ].join("|");
    QRCode.toDataURL(qrText, { width: 120, margin: 1 })
      .then((url: string) => { if (!cancelled) setQrDataUrl(url); })
      .catch(() => { if (!cancelled) setQrDataUrl(""); });
    return () => { cancelled = true; };
  }, [receiptData]);

  const handlePrintReceipt = () => {
    if (!receiptData) return;
    const r = receiptData;
    const collAmt = r.collection ? formatCurrency(r.collection.amount) : (r.isPaid ? formatCurrency(r.paidAmount) : "0");
    const payDate = r.collection?.paymentDate
      ? new Date(r.collection.paymentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : (r.paymentDate ? new Date(r.paymentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "");
    const dueDate = r.dueDate ? new Date(r.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";
    const receiptNo = r.collection?.id?.substring(0, 8).toUpperCase() || "N/A";
    const status = r.collection?.status === "approved" ? "APPROVED" : r.collection?.status === "pending" ? "PENDING" : (r.isPaid ? "PAID" : "");
    const now = new Date();
    const printTime = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + " " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const line = "================================";
    const dash = "--------------------------------";

    const collectedBy = r.collection?.collectedBy || "N/A";

    const lines = [
      "  LAMEN MICRO FINANCE",
      "     INSTITUTION",
      "   License No: 97950",
      `   ${r.branchName || ""} Branch`,
      line,
      "    COLLECTION RECEIPT",
      line,
      `Cust : ${r.customerName}`,
      ...(r.fatherName ? [`F/N  : ${r.fatherName}`] : []),
      `C.No : ${r.customerNo || "N/A"}`,
      dash,
      `Fin ID  : ${r.applicationId}`,
      `Product : ${r.productName}`,
      `Amount  : AFN ${formatCurrency(r.loanAmount)}`,
      `Officer : ${r.officerName || "N/A"}`,
      dash,
      `Inst #${r.installmentNumber} of ${r.totalInstallments}`,
      `Due Date : ${dueDate}`,
      `Inst Amt : AFN ${formatCurrency(r.installmentAmount)}`,
      ...(parseFloat(r.principleAmount) > 0 ? [`Principal: AFN ${formatCurrency(r.principleAmount)}`] : []),
      ...(parseFloat(r.marginAmount) > 0 ? [`Margin   : AFN ${formatCurrency(r.marginAmount)}`] : []),
      line,
      `COLLECTED: AFN ${collAmt}`,
      ...(payDate ? [`Pay Date : ${payDate}`] : []),
      ...(receiptNo !== "N/A" ? [`Receipt# : ${receiptNo}`] : []),
      `By      : ${collectedBy}`,
      line,
      ...(status ? [`     *** ${status} ***`] : []),
      ...(r.collection?.notes ? [`Note: ${r.collection.notes}`] : []),
      dash,
      `Printed: ${printTime}`,
      "",
      "  Thank you for your payment",
      "",
    ];

    const qrImg = qrDataUrl ? `<div style="text-align:center;margin:3mm 0 1mm;"><img src="${qrDataUrl}" style="width:25mm;height:25mm;" /></div>` : "";

    const printWindow = window.open("", "_blank", "width=250,height=600");
    if (!printWindow) return;
    printWindow.document.write(`<html><head><title>Receipt</title>
<style>
@page { size: 55mm auto; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 55mm; font-family: 'Courier New', monospace; font-size: 9px; line-height: 1.4; padding: 2mm; color: #000; }
pre { white-space: pre-wrap; word-break: break-word; font-family: inherit; font-size: inherit; }
</style></head><body><pre>${lines.join("\n")}</pre>${qrImg}</body></html>`);
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
        <DialogContent className="max-w-[280px] mx-auto max-h-[90vh] overflow-y-auto p-3">
          <DialogHeader className="pb-0">
            <DialogTitle className="text-sm flex items-center gap-1.5">
              <Printer className="h-3.5 w-3.5" /> Receipt Preview
            </DialogTitle>
          </DialogHeader>
          {receiptLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : receiptData ? (
            <>
              <div className="bg-white text-black rounded border p-2 font-mono text-[9px] leading-[1.4] whitespace-pre-wrap" data-testid="receipt-preview">
                <div className="text-center">
                  <p className="font-bold text-[10px]">LAMEN MICRO FINANCE</p>
                  <p className="font-bold text-[10px]">INSTITUTION</p>
                  <p>License No: 97950</p>
                  <p>{receiptData.branchName} Branch</p>
                  <p>================================</p>
                  <p className="font-bold text-[10px]">COLLECTION RECEIPT</p>
                  <p>================================</p>
                </div>
                <p>Cust : {receiptData.customerName}</p>
                {receiptData.fatherName && <p>F/N  : {receiptData.fatherName}</p>}
                <p>C.No : {receiptData.customerNo || "N/A"}</p>
                <p>--------------------------------</p>
                <p>Fin ID  : {receiptData.applicationId}</p>
                <p>Product : {receiptData.productName}</p>
                <p>Amount  : AFN {formatCurrency(receiptData.loanAmount)}</p>
                <p>Officer : {receiptData.officerName || "N/A"}</p>
                <p>--------------------------------</p>
                <p>Inst #{receiptData.installmentNumber} of {receiptData.totalInstallments}</p>
                <p>Due Date : {receiptData.dueDate ? new Date(receiptData.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}</p>
                <p>Inst Amt : AFN {formatCurrency(receiptData.installmentAmount)}</p>
                {parseFloat(receiptData.principleAmount) > 0 && <p>Principal: AFN {formatCurrency(receiptData.principleAmount)}</p>}
                {parseFloat(receiptData.marginAmount) > 0 && <p>Margin   : AFN {formatCurrency(receiptData.marginAmount)}</p>}
                <p>================================</p>
                <p className="font-bold text-[11px]">COLLECTED: AFN {receiptData.collection ? formatCurrency(receiptData.collection.amount) : (receiptData.isPaid ? formatCurrency(receiptData.paidAmount) : "0")}</p>
                {(receiptData.collection?.paymentDate || receiptData.paymentDate) && (
                  <p>Pay Date : {new Date(receiptData.collection?.paymentDate || receiptData.paymentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
                )}
                {receiptData.collection?.id && <p>Receipt# : {receiptData.collection.id.substring(0, 8).toUpperCase()}</p>}
                <p>================================</p>
                {receiptData.collection?.status && (
                  <p className="text-center font-bold">*** {receiptData.collection.status === "approved" ? "APPROVED" : receiptData.collection.status === "pending" ? "PENDING" : receiptData.collection.status.toUpperCase()} ***</p>
                )}
                {!receiptData.collection && receiptData.isPaid && (
                  <p className="text-center font-bold">*** PAID ***</p>
                )}
                {receiptData.collection?.collectedBy && <p>By      : {receiptData.collection.collectedBy}</p>}
                {receiptData.collection?.notes && <p>Note: {receiptData.collection.notes}</p>}
                <p>--------------------------------</p>
                <div className="text-center">
                  <p>Printed: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                  <p></p>
                  <p>Thank you for your payment</p>
                </div>
                {qrDataUrl && (
                  <div className="text-center" style={{ marginTop: "6px" }}>
                    <img src={qrDataUrl} alt="QR Code" style={{ width: "80px", height: "80px", margin: "0 auto" }} />
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-1">
                <Button variant="outline" size="sm" onClick={() => setReceiptInstallmentId(null)} className="flex-1 h-8 text-xs" data-testid="button-close-receipt">Close</Button>
                <Button size="sm" onClick={handlePrintReceipt} disabled={!qrDataUrl} className="flex-1 h-8 text-xs" data-testid="button-print-receipt">
                  <Printer className="h-3.5 w-3.5 mr-1" /> Print
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-sm">Receipt data not available</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
