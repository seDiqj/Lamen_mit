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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  Download,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Banknote,
  User,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  Wrench,
} from "lucide-react";
import type { Installment } from "@shared/schema";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type InstallmentWithDetails = Installment & {
  loanApplicationId?: string;
  customerName?: string;
};

type LoanItem = {
  id: string;
  applicationId: string;
  customerId: string;
  customerName: string;
  branchName?: string;
  productName?: string;
  productCode?: string;
  sector?: string;
  requestDate?: string;
  requestedAmount?: string;
  principleAmount?: string;
  profit?: string;
  totalReceivable?: string;
  totalCollection?: string;
  outstandingPortfolio?: string;
  installmentAmount?: string;
  financingDurationMonths?: number;
  numberOfInstallments?: number;
  marginRate?: string;
  status: string;
};

type SummaryInstallment = {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate?: string;
  totalAmount?: string;
  principleAmount?: string;
  marginAmount?: string;
  paidAmount?: string;
  paymentDate?: string;
  lateDays?: number;
  isPaid: boolean;
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  disbursed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  defaulted: "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300",
};

function formatAFN(amount?: string | number | null): string {
  if (!amount) return "AFN 0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `AFN ${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function calcFinancing(loan: LoanItem) {
  const principal = parseFloat(loan.principleAmount || loan.requestedAmount || "0");
  const rawMargin = parseFloat(loan.marginRate || "0");
  const marginPercent = rawMargin > 0 && rawMargin < 1 ? rawMargin * 100 : rawMargin;
  return { principal, margin: marginPercent, financingAmount: principal + (principal * marginPercent / 100) };
}

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [summarySearch, setSummarySearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedInstallment, setSelectedInstallment] = useState<InstallmentWithDetails | null>(null);
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [showCorrectDialog, setShowCorrectDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [repaidExpanded, setRepaidExpanded] = useState(false);
  const [showStatementDialog, setShowStatementDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanItem | null>(null);
  const limit = 10;

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery<{
    installments: InstallmentWithDetails[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ["/api/installments", search, page, limit, "currentMonth"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("currentMonthOnly", "true");
      const res = await fetch(`/api/installments?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch installments");
      return res.json();
    },
  });

  const { data: roleData } = useQuery<{ role: string }>({
    queryKey: ["/api/user/role"],
  });

  const { data: loansData, isLoading: loansLoading } = useQuery<{ loans: LoanItem[]; total: number }>({
    queryKey: [`/api/loans?status=disbursed&page=1&limit=500`],
    enabled: activeTab === "summary",
  });

  const { data: paymentStats } = useQuery<{
    dueTillCurrentMonth: number;
    overdueTillDate: number;
    collectedCurrentMonth: number;
    outstandingTillDate: number;
  }>({
    queryKey: ["/api/payment-stats"],
  });

  const { data: allInstallmentsData, isLoading: installmentsLoading } = useQuery<{ installments: SummaryInstallment[]; total: number }>({
    queryKey: ["/api/installments?page=1&limit=2000"],
    enabled: activeTab === "summary",
  });

  const allLoans = loansData?.loans || [];
  const allInstallments = allInstallmentsData?.installments || [];

  const getLoanRepayment = (loan: LoanItem) => {
    const loanInstallments = allInstallments.filter((i) => i.loanId === loan.id);
    const paidInstallments = loanInstallments.filter((i) => i.isPaid);
    const totalRepaid = paidInstallments.reduce((sum, i) => sum + parseFloat(i.paidAmount || i.totalAmount || "0"), 0);
    const { financingAmount } = calcFinancing(loan);
    const totalTarget = parseFloat(loan.totalReceivable || "0") || financingAmount;
    const progress = totalTarget > 0 ? Math.min((totalRepaid / totalTarget) * 100, 100) : 0;
    return { totalRepaid, totalTarget, progress, paidCount: paidInstallments.length, totalCount: loanInstallments.length };
  };

  const filteredLoans = allLoans.filter((loan) => {
    if (!summarySearch) return true;
    const q = summarySearch.toLowerCase();
    return (
      loan.customerName?.toLowerCase().includes(q) ||
      loan.applicationId?.toLowerCase().includes(q) ||
      loan.branchName?.toLowerCase().includes(q)
    );
  });

  const totalPortfolio = filteredLoans.reduce((sum, l) => sum + parseFloat(l.totalReceivable || "0"), 0);
  const totalRepaidAll = filteredLoans.reduce((sum, l) => sum + getLoanRepayment(l).totalRepaid, 0);
  const totalOutstanding = totalPortfolio - totalRepaidAll;
  const totalDisbursed = filteredLoans.reduce((sum, l) => sum + calcFinancing(l).principal, 0);
  const totalProfit = filteredLoans.reduce((sum, l) => sum + parseFloat(l.profit || "0"), 0);

  const paidInstallmentsAll = allInstallments.filter((i) => i.isPaid);
  const totalPrincipalRepaid = paidInstallmentsAll.reduce((sum, i) => sum + parseFloat(i.principleAmount || "0"), 0);
  const totalMarginRepaid = paidInstallmentsAll.reduce((sum, i) => sum + parseFloat(i.marginAmount || "0"), 0);

  const markPaidMutation = useMutation({
    mutationFn: async (installmentId: string) => {
      return apiRequest("PATCH", `/api/installments/${installmentId}/pay`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/installments"] });
      toast({
        title: "Payment Recorded",
        description: "The installment has been marked as paid.",
      });
      setShowPayDialog(false);
      setSelectedInstallment(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const correctRepaidMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/admin/correct-repaid-amounts", {});
    },
    onSuccess: async (res: any) => {
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/installments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      toast({
        title: "Correction Complete",
        description: `${data.updated} loans updated, ${data.skipped} skipped out of ${data.total} total.`,
      });
      setShowCorrectDialog(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to correct repaid amounts. Please try again.",
        variant: "destructive",
      });
      setShowCorrectDialog(false);
    },
  });

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return "AFN 0";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    const day = d.getDate().toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getPaymentStatus = (installment: InstallmentWithDetails) => {
    if (installment.isPaid) {
      return { label: "Paid", variant: "success" as const };
    }
    if (installment.dueDate && new Date(installment.dueDate) < new Date()) {
      return { label: "Overdue", variant: "destructive" as const };
    }
    return { label: "Pending", variant: "warning" as const };
  };

  const getStatementData = (loan: LoanItem) => {
    const loanInstallments = allInstallments
      .filter((i) => i.loanId === loan.id)
      .sort((a, b) => a.installmentNumber - b.installmentNumber);
    const fc = calcFinancing(loan);
    const totalFinancing = parseFloat(loan.totalReceivable || "0") || fc.financingAmount;
    let runningBalance = totalFinancing;
    return loanInstallments.map((inst) => {
      const paid = parseFloat(inst.paidAmount || (inst.isPaid ? inst.totalAmount || "0" : "0"));
      runningBalance -= paid;
      return {
        installmentNumber: inst.installmentNumber,
        dueDate: inst.dueDate,
        principleAmount: parseFloat(inst.principleAmount || "0"),
        marginAmount: parseFloat(inst.marginAmount || "0"),
        totalAmount: parseFloat(inst.totalAmount || "0"),
        paidAmount: paid,
        paymentDate: inst.paymentDate,
        lateDays: inst.lateDays || 0,
        isPaid: inst.isPaid,
        balance: Math.max(runningBalance, 0),
      };
    });
  };

  const exportStatementToPDF = (loan: LoanItem) => {
    const statementRows = getStatementData(loan);
    const fc = calcFinancing(loan);
    const repayment = getLoanRepayment(loan);
    const totalFinancing = parseFloat(loan.totalReceivable || "0") || fc.financingAmount;

    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Lamen Microfinance Institution", 14, 18);
    doc.setFontSize(12);
    doc.text("Customer Account Statement", 14, 26);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const infoY = 34;
    doc.text(`Customer: ${loan.customerName}`, 14, infoY);
    doc.text(`Financing ID: ${loan.applicationId}`, 14, infoY + 6);
    doc.text(`Product: ${loan.productName || "-"}`, 14, infoY + 12);
    doc.text(`Branch: ${loan.branchName || "-"}`, 140, infoY);
    doc.text(`Status: ${loan.status}`, 140, infoY + 6);
    doc.text(`Principal: ${formatAFN(fc.principal)} + ${fc.margin}% = ${formatAFN(totalFinancing)}`, 140, infoY + 12);
    doc.text(`Repaid: ${formatAFN(repayment.totalRepaid)} / ${formatAFN(repayment.totalTarget)} (${repayment.progress.toFixed(1)}%)`, 14, infoY + 18);
    doc.text(`Report Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, 140, infoY + 18);

    const tableData = statementRows.map((row) => [
      row.installmentNumber,
      row.dueDate ? formatDate(row.dueDate) : "-",
      formatAFN(row.principleAmount),
      formatAFN(row.marginAmount),
      formatAFN(row.totalAmount),
      formatAFN(row.paidAmount),
      row.paymentDate ? formatDate(row.paymentDate) : "-",
      row.lateDays > 0 ? `${row.lateDays}` : "-",
      row.isPaid ? "Paid" : row.dueDate && new Date(row.dueDate) < new Date() ? "Overdue" : "Pending",
      formatAFN(row.balance),
    ]);

    autoTable(doc, {
      startY: infoY + 24,
      head: [["#", "Due Date", "Principal", "Margin", "Total", "Paid", "Payment Date", "Late Days", "Status", "Balance"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], fontSize: 8 },
      bodyStyles: { fontSize: 7.5 },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        7: { halign: "center" },
        8: { halign: "center" },
        9: { halign: "right" },
      },
      didParseCell: (data: any) => {
        if (data.section === "body" && data.column.index === 8) {
          const val = data.cell.raw;
          if (val === "Paid") data.cell.styles.textColor = [22, 163, 74];
          else if (val === "Overdue") data.cell.styles.textColor = [220, 38, 38];
        }
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 200;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by Lamen MFI Loan Management System", 14, finalY + 10);

    doc.save(`Account_Statement_${loan.applicationId}_${loan.customerName.replace(/\s+/g, "_")}.pdf`);
  };

  const buildSummaryRows = () => {
    return filteredLoans.map((loan, idx) => {
      const repayment = getLoanRepayment(loan);
      const fc = calcFinancing(loan);
      return {
        no: idx + 1,
        applicationId: loan.applicationId,
        customerName: loan.customerName,
        branch: loan.branchName || "-",
        product: loan.productName || "-",
        principal: fc.principal,
        margin: fc.margin > 0 ? `${fc.margin}%` : "0%",
        financingAmount: fc.financingAmount,
        installmentAmount: parseFloat(loan.installmentAmount || "0"),
        installments: loan.numberOfInstallments || 0,
        totalRepaid: repayment.totalRepaid,
        totalTarget: repayment.totalTarget,
        outstanding: repayment.totalTarget - repayment.totalRepaid,
        paidInstallments: `${repayment.paidCount}/${repayment.totalCount}`,
        progress: `${repayment.progress.toFixed(1)}%`,
        status: loan.status,
      };
    });
  };

  const exportToExcel = () => {
    const rows = buildSummaryRows();
    const wsData = [
      ["Lamen Microfinance Institution"],
      ["Financing Summary Report"],
      [`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`],
      [],
      ["Total Portfolio:", totalPortfolio, "", "Total Disbursed:", totalDisbursed, "", "Total Repaid:", totalRepaidAll, "", "Outstanding:", totalOutstanding, "", "Total Profit:", totalProfit],
      [],
      ["No", "Application ID", "Customer Name", "Branch", "Product", "Principal (AFN)", "Margin", "Financing Amount (AFN)", "Installment (AFN)", "# Installments", "Total Repaid (AFN)", "Total Receivable (AFN)", "Outstanding (AFN)", "Paid Installments", "Progress", "Status"],
      ...rows.map((r) => [
        r.no, r.applicationId, r.customerName, r.branch, r.product,
        r.principal, r.margin, r.financingAmount, r.installmentAmount,
        r.installments, r.totalRepaid, r.totalTarget, r.outstanding,
        r.paidInstallments, r.progress, r.status,
      ]),
      [],
      ["", "", "", "", "Totals:",
        rows.reduce((s, r) => s + r.principal, 0),
        "",
        rows.reduce((s, r) => s + r.financingAmount, 0),
        rows.reduce((s, r) => s + r.installmentAmount, 0),
        "",
        rows.reduce((s, r) => s + r.totalRepaid, 0),
        rows.reduce((s, r) => s + r.totalTarget, 0),
        rows.reduce((s, r) => s + r.outstanding, 0),
        "", "", "",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = [
      { wch: 5 }, { wch: 16 }, { wch: 22 }, { wch: 14 }, { wch: 14 },
      { wch: 14 }, { wch: 8 }, { wch: 18 }, { wch: 14 }, { wch: 13 },
      { wch: 16 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 10 }, { wch: 10 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financing Summary");
    XLSX.writeFile(wb, `Financing_Summary_Report_${new Date().toISOString().split("T")[0]}.xlsx`);

    toast({ title: "Excel Exported", description: "Financing summary report exported to Excel." });
  };

  const exportToPDF = () => {
    const rows = buildSummaryRows();
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    doc.setFontSize(16);
    doc.setTextColor(30, 100, 50);
    doc.text("Lamen Microfinance Institution", 148, 14, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text("Financing Summary Report", 148, 21, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 148, 27, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total Portfolio: AFN ${totalPortfolio.toLocaleString()}`, 14, 34);
    doc.text(`Total Disbursed: AFN ${totalDisbursed.toLocaleString()}`, 72, 34);
    doc.text(`Total Repaid: AFN ${totalRepaidAll.toLocaleString()}`, 135, 34);
    doc.text(`Outstanding: AFN ${totalOutstanding.toLocaleString()}`, 195, 34);
    doc.text(`Total Profit: AFN ${totalProfit.toLocaleString()}`, 250, 34);

    autoTable(doc, {
      startY: 39,
      head: [["No", "App ID", "Customer", "Branch", "Product", "Principal", "Margin", "Financing Amt", "Repaid", "Outstanding", "Paid", "Progress", "Status"]],
      body: rows.map((r) => [
        r.no,
        r.applicationId,
        r.customerName,
        r.branch,
        r.product,
        `AFN ${r.principal.toLocaleString()}`,
        r.margin,
        `AFN ${r.financingAmount.toLocaleString()}`,
        `AFN ${r.totalRepaid.toLocaleString()}`,
        `AFN ${r.outstanding.toLocaleString()}`,
        r.paidInstallments,
        r.progress,
        r.status,
      ]),
      foot: [[
        "", "", "", "", "Totals:",
        `AFN ${rows.reduce((s, r) => s + r.principal, 0).toLocaleString()}`,
        "",
        `AFN ${rows.reduce((s, r) => s + r.financingAmount, 0).toLocaleString()}`,
        `AFN ${rows.reduce((s, r) => s + r.totalRepaid, 0).toLocaleString()}`,
        `AFN ${rows.reduce((s, r) => s + r.outstanding, 0).toLocaleString()}`,
        "", "", "",
      ]],
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: { fillColor: [34, 120, 60], textColor: 255, fontStyle: "bold", fontSize: 7 },
      footStyles: { fillColor: [240, 240, 240], textColor: [30, 30, 30], fontStyle: "bold", fontSize: 7 },
      alternateRowStyles: { fillColor: [245, 250, 245] },
      margin: { left: 8, right: 8 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, 280, 200, { align: "right" });
    }

    doc.save(`Financing_Summary_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    toast({ title: "PDF Exported", description: "Financing summary report exported to PDF." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-payments-title">Payments</h1>
          <p className="text-muted-foreground">
            Track and manage loan installment payments
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {roleData?.role === "admin" && (
            <Button
              variant="outline"
              onClick={() => setShowCorrectDialog(true)}
              data-testid="button-correct-repaid"
            >
              <Wrench className="mr-2 h-4 w-4" />
              Correct Repaid Amounts
            </Button>
          )}
          <Button variant="outline" data-testid="button-export-payments">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Till Current Month</p>
                <p className="text-2xl font-bold" data-testid="text-due-till-month">{formatCurrency(paymentStats?.dueTillCurrentMonth || 0)}</p>
                <p className="text-xs text-muted-foreground">Includes previous unpaid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue Till Date</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid="text-overdue-till-date">{formatCurrency(paymentStats?.overdueTillDate || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collected This Month</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-collected-month">{formatCurrency(paymentStats?.collectedCurrentMonth || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Banknote className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Till Date</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400" data-testid="text-outstanding-till-date">{formatCurrency(paymentStats?.outstandingTillDate || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-testid="tabs-payment">
          <TabsTrigger value="list" data-testid="tab-payment-list">Payment List</TabsTrigger>
          <TabsTrigger value="summary" data-testid="tab-payment-summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Payments This Month</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by loan ID, customer name..."
                      className="pl-10"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      data-testid="input-search-payments"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Financing ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Installment #</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">Paid Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Late Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 9 }).map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : data?.installments && data.installments.length > 0 ? (
                      data.installments.map((installment) => {
                        const status = getPaymentStatus(installment);
                        return (
                          <TableRow key={installment.id} data-testid={`row-installment-${installment.id}`}>
                            <TableCell className="font-mono text-sm">
                              {installment.loanApplicationId || "-"}
                            </TableCell>
                            <TableCell>{installment.customerName || "-"}</TableCell>
                            <TableCell>#{installment.installmentNumber}</TableCell>
                            <TableCell>{formatDate(installment.dueDate)}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(installment.totalAmount)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                              {formatCurrency(installment.paidAmount || installment.totalAmount)}
                            </TableCell>
                            <TableCell>
                              {installment.paymentDate ? formatDate(installment.paymentDate) : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  status.label === "Paid" 
                                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                    : status.label === "Overdue"
                                      ? "bg-red-500/10 text-red-700 dark:text-red-400"
                                      : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                }
                              >
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {installment.lateDays ? (
                                <span className="text-red-600 dark:text-red-400">
                                  {installment.lateDays} days
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No payments recorded this month
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} installments
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {page} of {data.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === data.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Disbursed</p>
                      <p className="text-lg font-bold text-blue-700 dark:text-blue-400" data-testid="text-total-disbursed">{formatAFN(totalDisbursed)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Profit</p>
                      <p className="text-lg font-bold text-purple-700 dark:text-purple-400" data-testid="text-total-profit">{formatAFN(totalProfit)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Banknote className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Portfolio</p>
                      <p className="text-lg font-bold" data-testid="text-total-portfolio">{formatAFN(totalPortfolio)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer"
                onClick={() => setRepaidExpanded(!repaidExpanded)}
                data-testid="card-total-repaid"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Repaid</p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-400" data-testid="text-total-repaid">{formatAFN(totalRepaidAll)}</p>
                    </div>
                  </div>
                  {repaidExpanded && (
                    <div className="mt-3 pt-3 border-t border-dashed space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Principal Amount</span>
                        <span className="font-semibold" data-testid="text-repaid-principal">{formatAFN(totalPrincipalRepaid)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Profit (Margin)</span>
                        <span className="font-semibold" data-testid="text-repaid-margin">{formatAFN(totalMarginRepaid)}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    {repaidExpanded ? "Click to collapse" : "Click for details"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Outstanding</p>
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-400" data-testid="text-total-outstanding">{formatAFN(totalOutstanding)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, application ID, or branch..."
                  className="pl-10"
                  value={summarySearch}
                  onChange={(e) => setSummarySearch(e.target.value)}
                  data-testid="input-search-summary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="bg-green-600 text-white border-green-700 hover:bg-green-700 no-default-hover-elevate"
                  onClick={exportToExcel}
                  disabled={filteredLoans.length === 0}
                  data-testid="button-export-excel"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
                <Button
                  className="bg-red-600 text-white border-red-700 hover:bg-red-700 no-default-hover-elevate"
                  onClick={exportToPDF}
                  disabled={filteredLoans.length === 0}
                  data-testid="button-export-pdf"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{filteredLoans.length} active financing records</p>

            {loansLoading || installmentsLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredLoans.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No active financing found
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLoans.map((loan) => {
                  const repayment = getLoanRepayment(loan);
                  return (
                    <Card
                      key={loan.id}
                      data-testid={`card-summary-${loan.id}`}
                      className="cursor-pointer transition-shadow hover:shadow-md hover:border-primary/30"
                      onClick={() => { setSelectedLoan(loan); setShowStatementDialog(true); }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <p className="font-medium text-sm truncate" data-testid={`text-summary-name-${loan.id}`}>
                                {loan.customerName}
                              </p>
                              <Badge className={`text-[10px] shrink-0 no-default-hover-elevate no-default-active-elevate ${statusColors[loan.status] || ""}`}>
                                {loan.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {loan.applicationId} {loan.productName && `· ${loan.productName}`}
                              {loan.branchName && ` · ${loan.branchName}`}
                            </p>
                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                              <Banknote className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs font-semibold">
                                {formatAFN(calcFinancing(loan).principal)}
                              </span>
                              {calcFinancing(loan).margin > 0 && (
                                <>
                                  <span className="text-[10px] text-muted-foreground">
                                    + {calcFinancing(loan).margin}%
                                  </span>
                                  <span className="text-[10px] font-semibold text-primary">
                                    = {formatAFN(calcFinancing(loan).financingAmount)}
                                  </span>
                                </>
                              )}
                            </div>
                            {loan.installmentAmount && (
                              <p className="text-[10px] text-muted-foreground mt-1">
                                Installment: {formatAFN(loan.installmentAmount)} x {loan.numberOfInstallments || "—"}
                              </p>
                            )}
                            <div className="mt-2 pt-2 border-t border-border/50">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[11px] text-muted-foreground">
                                  Repaid: <span className="font-semibold text-primary">{formatAFN(repayment.totalRepaid)}</span>
                                  <span className="text-muted-foreground"> / {formatAFN(repayment.totalTarget)}</span>
                                </span>
                                <span className="text-[11px] text-muted-foreground" data-testid={`text-summary-progress-${loan.id}`}>
                                  {repayment.paidCount}/{repayment.totalCount}
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    repayment.progress >= 50 ? "bg-primary" : "bg-amber-500"
                                  }`}
                                  style={{ width: `${repayment.progress}%` }}
                                  data-testid={`progress-summary-${loan.id}`}
                                />
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] text-muted-foreground">
                                  {repayment.progress.toFixed(0)}% complete
                                </span>
                                {loan.requestDate && (
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-2.5 w-2.5" />
                                    {new Date(loan.requestDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Confirm payment for installment #{selectedInstallment?.installmentNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-medium">{selectedInstallment?.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due Date:</span>
              <span>{formatDate(selectedInstallment?.dueDate || null)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-bold text-lg">
                {formatCurrency(selectedInstallment?.totalAmount || 0)}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedInstallment && markPaidMutation.mutate(selectedInstallment.id)}
              disabled={markPaidMutation.isPending}
              data-testid="button-confirm-payment"
            >
              {markPaidMutation.isPending ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCorrectDialog} onOpenChange={setShowCorrectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Correct Repaid Amounts</DialogTitle>
            <DialogDescription>
              This will update installment #8 for 45 loans to match the corrected repaid totals from the Excel data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3 p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-300">Warning</p>
                <p className="text-yellow-700 dark:text-yellow-400 mt-1">
                  This will modify installment amounts for 45 financing accounts. Make sure you want to proceed.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCorrectDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => correctRepaidMutation.mutate()}
              disabled={correctRepaidMutation.isPending}
              data-testid="button-confirm-correct-repaid"
            >
              {correctRepaidMutation.isPending ? "Processing..." : "Run Correction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showStatementDialog} onOpenChange={setShowStatementDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Account Statement
              {selectedLoan && (
                <Badge variant="outline" className="ml-2 text-xs font-normal">
                  {selectedLoan.applicationId}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedLoan ? `${selectedLoan.customerName} - ${selectedLoan.productName || ""} · ${selectedLoan.branchName || ""}` : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedLoan && installmentsLoading && (
            <div className="py-8 text-center">
              <Skeleton className="h-4 w-48 mx-auto mb-3" />
              <Skeleton className="h-4 w-32 mx-auto" />
              <p className="text-sm text-muted-foreground mt-3">Loading installment data...</p>
            </div>
          )}

          {selectedLoan && !installmentsLoading && (() => {
            const statementRows = getStatementData(selectedLoan);
            const fc = calcFinancing(selectedLoan);
            const repayment = getLoanRepayment(selectedLoan);
            const totalFinancing = parseFloat(selectedLoan.totalReceivable || "0") || fc.financingAmount;
            const totalPaidStatement = statementRows.reduce((s, r) => s + r.paidAmount, 0);
            const totalPrincipalStatement = statementRows.reduce((s, r) => s + r.principleAmount, 0);
            const totalMarginStatement = statementRows.reduce((s, r) => s + r.marginAmount, 0);
            const totalAmountStatement = statementRows.reduce((s, r) => s + r.totalAmount, 0);

            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Principal</p>
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{formatAFN(fc.principal)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Margin ({fc.margin}%)</p>
                    <p className="text-sm font-bold text-purple-700 dark:text-purple-400">{formatAFN(totalFinancing - fc.principal)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Repaid</p>
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">{formatAFN(repayment.totalRepaid)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Outstanding</p>
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-400">{formatAFN(totalFinancing - repayment.totalRepaid)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${repayment.progress >= 50 ? "bg-primary" : "bg-amber-500"}`}
                      style={{ width: `${repayment.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{repayment.progress.toFixed(1)}% ({repayment.paidCount}/{repayment.totalCount})</span>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10 text-center">#</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Principal</TableHead>
                        <TableHead className="text-right">Margin</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead className="text-center">Late</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statementRows.map((row) => (
                        <TableRow
                          key={row.installmentNumber}
                          className={row.isPaid ? "bg-green-50/50 dark:bg-green-950/10" : row.dueDate && new Date(row.dueDate) < new Date() ? "bg-red-50/50 dark:bg-red-950/10" : ""}
                          data-testid={`row-statement-${row.installmentNumber}`}
                        >
                          <TableCell className="text-center text-xs">{row.installmentNumber}</TableCell>
                          <TableCell className="text-xs">{row.dueDate ? formatDate(row.dueDate) : "-"}</TableCell>
                          <TableCell className="text-right text-xs">{formatAFN(row.principleAmount)}</TableCell>
                          <TableCell className="text-right text-xs">{formatAFN(row.marginAmount)}</TableCell>
                          <TableCell className="text-right text-xs font-medium">{formatAFN(row.totalAmount)}</TableCell>
                          <TableCell className="text-right text-xs font-medium text-green-600 dark:text-green-400">
                            {row.paidAmount > 0 ? formatAFN(row.paidAmount) : "-"}
                          </TableCell>
                          <TableCell className="text-xs">{row.paymentDate ? formatDate(row.paymentDate) : "-"}</TableCell>
                          <TableCell className="text-center text-xs">
                            {row.lateDays > 0 ? (
                              <span className="text-red-600 dark:text-red-400">{row.lateDays}d</span>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={`text-[10px] ${
                                row.isPaid
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : row.dueDate && new Date(row.dueDate) < new Date()
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }`}
                            >
                              {row.isPaid ? "Paid" : row.dueDate && new Date(row.dueDate) < new Date() ? "Overdue" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs font-semibold">{formatAFN(row.balance)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell colSpan={2} className="text-xs">Total</TableCell>
                        <TableCell className="text-right text-xs">{formatAFN(totalPrincipalStatement)}</TableCell>
                        <TableCell className="text-right text-xs">{formatAFN(totalMarginStatement)}</TableCell>
                        <TableCell className="text-right text-xs">{formatAFN(totalAmountStatement)}</TableCell>
                        <TableCell className="text-right text-xs text-green-600 dark:text-green-400">{formatAFN(totalPaidStatement)}</TableCell>
                        <TableCell colSpan={3}></TableCell>
                        <TableCell className="text-right text-xs">{formatAFN(totalFinancing - totalPaidStatement)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowStatementDialog(false)}
                    data-testid="button-close-statement"
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700 no-default-hover-elevate"
                    onClick={() => exportStatementToPDF(selectedLoan)}
                    data-testid="button-export-statement-pdf"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
