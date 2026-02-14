import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Banknote,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  User,
  FileText,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

type FinanceOfficer = {
  id: string;
  name: string;
};

type CollectionSummary = {
  totalDue: string;
  totalCollected: string;
  totalRemaining: string;
  overdueCount: number;
  upcomingCount: number;
  partialCount: number;
};

type Branch = {
  id: string;
  name: string;
};

function getDaysStatus(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) {
    return { label: `${Math.abs(diff)} days overdue`, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", isOverdue: true, days: Math.abs(diff), rowHighlight: "overdue" as const };
  } else if (diff === 0) {
    return { label: "Due today", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", isOverdue: false, days: 0, rowHighlight: "overdue" as const };
  } else if (diff === 1) {
    return { label: `Due in 1 day`, color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", isOverdue: false, days: diff, rowHighlight: "tomorrow" as const };
  } else if (diff <= 3) {
    return { label: `Due in ${diff} days`, color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", isOverdue: false, days: diff, rowHighlight: "soon" as const };
  } else {
    return { label: `Due in ${diff} days`, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", isOverdue: false, days: diff, rowHighlight: "normal" as const };
  }
}

function getRowHighlightClass(highlight: string) {
  switch (highlight) {
    case "overdue": return "bg-red-50 dark:bg-red-950/20";
    case "tomorrow": return "bg-yellow-50 dark:bg-yellow-950/20";
    case "soon": return "bg-red-50/50 dark:bg-red-950/10";
    default: return "";
  }
}

function getParBucket(daysOverdue: number): string {
  if (daysOverdue <= 0) return "Current";
  if (daysOverdue <= 30) return "PAR 1-30";
  if (daysOverdue <= 60) return "PAR 31-60";
  if (daysOverdue <= 90) return "PAR 61-90";
  return "PAR 90+";
}

function getParColor(bucket: string): string {
  switch (bucket) {
    case "Current": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "PAR 1-30": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "PAR 31-60": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "PAR 61-90": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "PAR 90+": return "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
}

export default function CollectionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("due_soon");
  const [branch, setBranch] = useState("all");
  const [officer, setOfficer] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedInstallment, setSelectedInstallment] = useState<CollectionInstallment | null>(null);
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const limit = 20;

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery<{
    installments: CollectionInstallment[];
    total: number;
    page: number;
    totalPages: number;
    summary: CollectionSummary;
  }>({
    queryKey: ["/api/collections", filter, branch, officer, search, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("filter", filter);
      if (branch !== "all") params.set("branch", branch);
      if (officer !== "all") params.set("officer", officer);
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const res = await fetch(`/api/collections?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch collections");
      return res.json();
    },
  });

  const { data: branchesData } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  const { data: officersData } = useQuery<FinanceOfficer[]>({
    queryKey: ["/api/finance-officers/active"],
  });

  const payMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const res = await apiRequest("PATCH", `/api/collections/${id}/pay`, { amount });
      return res.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/installments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: result.isPaid ? "Full Payment Recorded" : "Partial Payment Recorded",
        description: result.isPaid
          ? `Installment #${result.installmentNumber} fully paid. ${result.lateDays > 0 ? `Late by ${result.lateDays} days (${getParBucket(result.lateDays)}).` : "Paid on time."}`
          : `AFN ${parseFloat(paymentAmount).toLocaleString()} recorded. Remaining: ${formatCurrency(parseFloat(result.totalAmount) - parseFloat(result.paidAmount))}`,
      });
      setShowPayDialog(false);
      setSelectedInstallment(null);
      setPaymentAmount("");
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to record payment",
        variant: "destructive",
      });
    },
  });

  const handlePay = (inst: CollectionInstallment) => {
    setSelectedInstallment(inst);
    const remaining = parseFloat(inst.totalAmount) - parseFloat(inst.paidAmount || "0");
    setPaymentAmount(remaining.toFixed(2));
    setShowPayDialog(true);
  };

  const confirmPayment = () => {
    if (!selectedInstallment || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    const remaining = parseFloat(selectedInstallment.totalAmount) - parseFloat(selectedInstallment.paidAmount || "0");
    if (amount <= 0 || amount > remaining + 0.01) {
      toast({ title: "Invalid Amount", description: `Amount must be between 1 and ${formatCurrency(remaining)}`, variant: "destructive" });
      return;
    }
    payMutation.mutate({ id: selectedInstallment.id, amount });
  };

  const [exporting, setExporting] = useState(false);

  const fetchAllCollections = async (): Promise<CollectionInstallment[]> => {
    const params = new URLSearchParams();
    params.set("filter", filter);
    if (branch !== "all") params.set("branch", branch);
    if (officer !== "all") params.set("officer", officer);
    if (search) params.set("search", search);
    params.set("page", "1");
    params.set("limit", "100000");
    const res = await fetch(`/api/collections?${params.toString()}`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch collections for export");
    const result = await res.json();
    return result.installments;
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const allInstallments = await fetchAllCollections();
      const rows = allInstallments.map((inst) => {
        const status = getDaysStatus(inst.dueDate);
        const daysOverdue = status.isOverdue ? status.days : 0;
        return {
          "Financing ID": inst.loanApplicationId,
          "Customer": inst.customerName,
          "Branch": inst.branchName,
          "Officer": inst.financeOfficerName || "-",
          "Inst. #": inst.installmentNumber,
          "Due Date": inst.dueDate,
          "Principal": parseFloat(inst.principleAmount || "0"),
          "Profit": parseFloat(inst.marginAmount || "0"),
          "Total Amount": parseFloat(inst.totalAmount || "0"),
          "Paid Amount": parseFloat(inst.paidAmount || "0"),
          "Remaining": parseFloat(inst.totalAmount || "0") - parseFloat(inst.paidAmount || "0"),
          "Status": status.label,
          "PAR Bucket": getParBucket(daysOverdue),
        };
      });
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Collections");
      XLSX.writeFile(wb, "collections_report.xlsx");
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const allInstallments = await fetchAllCollections();
      const doc = new jsPDF({ orientation: "landscape" });
      doc.setFontSize(16);
      doc.text("Lamen Microfinance - Collections Report", 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

      const rows = allInstallments.map((inst) => {
        const status = getDaysStatus(inst.dueDate);
        const remaining = parseFloat(inst.totalAmount || "0") - parseFloat(inst.paidAmount || "0");
        return [
          inst.loanApplicationId,
          inst.customerName,
          inst.branchName || "-",
          inst.financeOfficerName || "-",
          `#${inst.installmentNumber}`,
          inst.dueDate,
          formatCurrency(inst.totalAmount),
          formatCurrency(inst.paidAmount),
          formatCurrency(remaining),
          status.label,
          getParBucket(status.isOverdue ? status.days : 0),
        ];
      });

      autoTable(doc, {
        head: [["Financing", "Customer", "Branch", "Officer", "Inst.", "Due Date", "Total", "Paid", "Remaining", "Status", "PAR"]],
        body: rows,
        startY: 28,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [34, 120, 74] },
      });

      doc.save("collections_report.pdf");
    } finally {
      setExporting(false);
    }
  };

  const summary = data?.summary;
  const installments = data?.installments || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Collections</h1>
          <p className="text-sm text-muted-foreground">Manage upcoming payments and record collections</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={exportToExcel} disabled={exporting || isLoading} data-testid="button-export-excel" className="bg-green-600 text-white border-green-600 hover-elevate">
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            {exporting ? "Exporting..." : "Excel"}
          </Button>
          <Button size="sm" onClick={exportToPDF} disabled={exporting || isLoading} data-testid="button-export-pdf" className="bg-red-600 text-white border-red-600 hover-elevate">
            <Download className="h-4 w-4 mr-1" />
            {exporting ? "Exporting..." : "PDF"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold" data-testid="text-overdue-count">{summary?.overdueCount || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Upcoming (3 days)</p>
                <p className="text-2xl font-bold" data-testid="text-upcoming-count">{summary?.upcomingCount || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Partial Payments</p>
                <p className="text-2xl font-bold" data-testid="text-partial-count">{summary?.partialCount || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Total Due Amount</p>
                <p className="text-lg font-bold" data-testid="text-total-due-amount">{formatCurrency(summary?.totalRemaining)}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                <Banknote className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
              <Banknote className="h-5 w-5 text-white" />
            </div>
            <CardTitle>Collection List</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customer or financing ID..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
                data-testid="input-search-collections"
              />
            </div>
            <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]" data-testid="select-filter">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due_soon">Due Soon & Overdue</SelectItem>
                <SelectItem value="upcoming">Upcoming (3 days)</SelectItem>
                <SelectItem value="overdue">Overdue Only</SelectItem>
                <SelectItem value="partial">Partial Payments</SelectItem>
                <SelectItem value="all_unpaid">All Unpaid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={branch} onValueChange={(v) => { setBranch(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]" data-testid="select-branch">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branchesData?.map((b: Branch) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={officer} onValueChange={(v) => { setOfficer(v); setPage(1); }}>
              <SelectTrigger className="w-[200px]" data-testid="select-officer">
                <SelectValue placeholder="Financing Officer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Officers</SelectItem>
                {officersData?.map((o: FinanceOfficer) => (
                  <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : installments.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
              <p className="text-lg font-medium">No installments found</p>
              <p className="text-sm text-muted-foreground">All caught up with the selected filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Financing</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Officer</TableHead>
                    <TableHead className="text-center">Inst. #</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">PAR</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installments.map((inst) => {
                    const status = getDaysStatus(inst.dueDate);
                    const paid = parseFloat(inst.paidAmount || "0");
                    const total = parseFloat(inst.totalAmount || "0");
                    const remaining = total - paid;
                    const hasPartial = paid > 0 && !inst.isPaid;
                    const daysOverdue = status.isOverdue ? status.days : 0;
                    const parBucket = getParBucket(daysOverdue);
                    const progress = total > 0 ? (paid / total) * 100 : 0;

                    return (
                      <TableRow key={inst.id} data-testid={`row-collection-${inst.id}`} className={getRowHighlightClass(status.rowHighlight)}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm" data-testid={`text-financing-id-${inst.id}`}>{inst.loanApplicationId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm" data-testid={`text-customer-${inst.id}`}>{inst.customerName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{inst.branchName || "-"}</TableCell>
                        <TableCell className="text-sm">{inst.financeOfficerName || "-"}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">#{inst.installmentNumber}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{formatDate(inst.dueDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-sm">{formatCurrency(inst.totalAmount)}</TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-1">
                            <span className="text-sm">{formatCurrency(paid)}</span>
                            {hasPartial && (
                              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-500 rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-sm" data-testid={`text-remaining-${inst.id}`}>
                          {formatCurrency(remaining)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${status.color} text-xs`} data-testid={`badge-status-${inst.id}`}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {status.isOverdue && (
                            <Badge className={`${getParColor(parBucket)} text-xs`} data-testid={`badge-par-${inst.id}`}>
                              {parBucket}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={() => handlePay(inst)}
                            data-testid={`button-pay-${inst.id}`}
                          >
                            <Banknote className="h-4 w-4 mr-1" />
                            Collect
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 pt-2">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, data?.total || 0)} of {data?.total || 0}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex items-center px-3 text-sm">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  data-testid="button-next-page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for {selectedInstallment?.customerName} - Installment #{selectedInstallment?.installmentNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedInstallment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Financing ID</span>
                  <p className="font-medium">{selectedInstallment.loanApplicationId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Due Date</span>
                  <p className="font-medium">{formatDate(selectedInstallment.dueDate)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Amount</span>
                  <p className="font-medium">{formatCurrency(selectedInstallment.totalAmount)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Already Paid</span>
                  <p className="font-medium">{formatCurrency(selectedInstallment.paidAmount)}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Remaining Balance</span>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(parseFloat(selectedInstallment.totalAmount) - parseFloat(selectedInstallment.paidAmount || "0"))}
                  </p>
                </div>
              </div>

              {(() => {
                const status = getDaysStatus(selectedInstallment.dueDate);
                if (status.isOverdue) {
                  const parBucket = getParBucket(status.days);
                  return (
                    <div className="rounded-md bg-red-50 dark:bg-red-950/20 p-3 border border-red-200 dark:border-red-900/30">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">
                          {status.days} days overdue - {parBucket}
                        </span>
                      </div>
                      <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                        Variance of {status.days} days will be recorded upon full payment.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="space-y-2">
                <Label htmlFor="payment-amount">Payment Amount (AFN)</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  step="0.01"
                  min="1"
                  max={parseFloat(selectedInstallment.totalAmount) - parseFloat(selectedInstallment.paidAmount || "0")}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  data-testid="input-payment-amount"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaymentAmount((parseFloat(selectedInstallment.totalAmount) - parseFloat(selectedInstallment.paidAmount || "0")).toFixed(2))}
                    data-testid="button-full-amount"
                  >
                    Full Amount
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const remaining = parseFloat(selectedInstallment.totalAmount) - parseFloat(selectedInstallment.paidAmount || "0");
                      setPaymentAmount((remaining / 2).toFixed(2));
                    }}
                    data-testid="button-half-amount"
                  >
                    Half
                  </Button>
                </div>
              </div>

              {parseFloat(paymentAmount) > 0 && parseFloat(paymentAmount) < (parseFloat(selectedInstallment.totalAmount) - parseFloat(selectedInstallment.paidAmount || "0") - 0.01) && (
                <div className="rounded-md bg-amber-50 dark:bg-amber-950/20 p-3 border border-amber-200 dark:border-amber-900/30">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    This is a partial payment. The installment will remain unpaid until the full balance is collected.
                    Remaining after this: {formatCurrency(parseFloat(selectedInstallment.totalAmount) - parseFloat(selectedInstallment.paidAmount || "0") - parseFloat(paymentAmount))}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPayDialog(false)} data-testid="button-cancel-pay">
              Cancel
            </Button>
            <Button
              onClick={confirmPayment}
              disabled={payMutation.isPending || !paymentAmount || parseFloat(paymentAmount) <= 0}
              data-testid="button-confirm-pay"
            >
              {payMutation.isPending ? "Processing..." : `Record ${formatCurrency(paymentAmount)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
