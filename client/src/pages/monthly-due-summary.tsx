import { useState, Fragment, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarClock,
  Users,
  Banknote,
  AlertTriangle,
  TrendingUp,
  Eye,
  FileSpreadsheet,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type MonthlySummaryRow = {
  monthYear: string;
  totalCustomers: number;
  totalPrincipal: number;
  totalMargin: number;
  totalAmount: number;
  totalPaid: number;
  totalInstallments: number;
  paidInstallments: number;
  unpaidInstallments: number;
  overdueInstallments: number;
};

type Totals = {
  totalCustomers: number;
  totalDue: number;
  totalCollected: number;
  totalOverdue: number;
  overdueInstallmentCount: number;
  currentMonthDue: number;
  currentMonthCollected: number;
};

type DetailRow = {
  installmentId: string;
  installmentNumber: number;
  dueDate: string;
  principleAmount: number;
  marginAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentDate: string | null;
  isPaid: boolean;
  lateDays: number;
  applicationId: string;
  productName: string;
  customerName: string;
  customerNo: string;
  branchName: string;
};

type Branch = { id: string; name: string };
type FundingSource = { id: string; name: string };

export default function MonthlyDueSummaryPage() {
  const [branchId, setBranchId] = useState("all");
  const [fundingSourceId, setFundingSourceId] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: branchesData } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: fundingSourcesData } = useQuery<FundingSource[]>({ queryKey: ["/api/funding-sources"] });

  const buildParams = () => {
    const params = new URLSearchParams();
    if (branchId !== "all") params.append("branchId", branchId);
    if (fundingSourceId !== "all") params.append("fundingSourceId", fundingSourceId);
    return params.toString();
  };

  const { data: reportData, isLoading } = useQuery<{ summary: MonthlySummaryRow[]; totals: Totals }>({
    queryKey: ["/api/reports/monthly-due-summary", branchId, fundingSourceId],
    queryFn: async () => {
      const qs = buildParams();
      const res = await fetch(`/api/reports/monthly-due-summary${qs ? `?${qs}` : ""}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { data: detailData, isLoading: loadingDetail } = useQuery<DetailRow[]>({
    queryKey: ["/api/reports/monthly-due-detail", selectedMonth, branchId, fundingSourceId],
    queryFn: async () => {
      const qs = buildParams();
      const res = await fetch(`/api/reports/monthly-due-detail/${selectedMonth}${qs ? `?${qs}` : ""}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!selectedMonth && dialogOpen,
  });

  const totals = reportData?.totals;
  const summary = reportData?.summary || [];
  const collectionRate = totals && totals.totalDue > 0 ? ((totals.totalCollected / totals.totalDue) * 100).toFixed(1) : "0";
  const currentMonthRate = totals && totals.currentMonthDue > 0 ? ((totals.currentMonthCollected / totals.currentMonthDue) * 100).toFixed(1) : "0";

  const openDetailDialog = (monthYear: string) => {
    setSelectedMonth(monthYear);
    setDialogOpen(true);
  };

  const selectedSummary = summary.find(s => s.monthYear === selectedMonth);

  type YearSubtotal = {
    year: string;
    totalCustomers: number;
    totalPrincipal: number;
    totalMargin: number;
    totalAmount: number;
    totalPaid: number;
    totalInstallments: number;
    paidInstallments: number;
    unpaidInstallments: number;
    overdueInstallments: number;
  };

  const yearGroups = useMemo(() => {
    const groups: { year: string; rows: MonthlySummaryRow[]; subtotal: YearSubtotal }[] = [];
    const map = new Map<string, MonthlySummaryRow[]>();
    for (const row of summary) {
      const year = row.monthYear.split("-")[0];
      if (!map.has(year)) map.set(year, []);
      map.get(year)!.push(row);
    }
    for (const [year, rows] of map) {
      const subtotal: YearSubtotal = {
        year,
        totalCustomers: rows.reduce((s, r) => s + r.totalCustomers, 0),
        totalPrincipal: rows.reduce((s, r) => s + r.totalPrincipal, 0),
        totalMargin: rows.reduce((s, r) => s + r.totalMargin, 0),
        totalAmount: rows.reduce((s, r) => s + r.totalAmount, 0),
        totalPaid: rows.reduce((s, r) => s + r.totalPaid, 0),
        totalInstallments: rows.reduce((s, r) => s + r.totalInstallments, 0),
        paidInstallments: rows.reduce((s, r) => s + r.paidInstallments, 0),
        unpaidInstallments: rows.reduce((s, r) => s + r.unpaidInstallments, 0),
        overdueInstallments: rows.reduce((s, r) => s + r.overdueInstallments, 0),
      };
      groups.push({ year, rows, subtotal });
    }
    return groups;
  }, [summary]);

  const formatMonthLabel = (my: string) => {
    const [y, m] = my.split("-");
    const d = new Date(Number(y), Number(m) - 1);
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const handleExportExcel = () => {
    if (!summary.length) return;
    const rows = summary.map(r => ({
      "Month": formatMonthLabel(r.monthYear),
      "Customers": r.totalCustomers,
      "Principal Amount": r.totalPrincipal,
      "Margin Amount": r.totalMargin,
      "Total Due": r.totalAmount,
      "Total Paid": r.totalPaid,
      "Installments": r.totalInstallments,
      "Paid": r.paidInstallments,
      "Unpaid": r.unpaidInstallments,
      "Overdue": r.overdueInstallments,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 20 }, { wch: 12 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Due Summary");
    XLSX.writeFile(wb, `Monthly_Due_Summary_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!summary.length) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Due Summary Report", 148, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 148, 22, { align: "center" });

    const tableData = summary.map(r => [
      formatMonthLabel(r.monthYear),
      r.totalCustomers.toString(),
      r.totalPrincipal.toLocaleString(),
      r.totalMargin.toLocaleString(),
      r.totalAmount.toLocaleString(),
      r.totalPaid.toLocaleString(),
      r.totalInstallments.toString(),
      r.paidInstallments.toString(),
      r.unpaidInstallments.toString(),
      r.overdueInstallments.toString(),
    ]);

    autoTable(doc, {
      startY: 28,
      head: [["Month", "Customers", "Principal", "Margin", "Total Due", "Total Paid", "Installments", "Paid", "Unpaid", "Overdue"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 7 },
      styles: { fontSize: 7, cellPadding: 1.5 },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" }, 5: { halign: "right" }, 6: { halign: "right" }, 7: { halign: "right" }, 8: { halign: "right" }, 9: { halign: "right" } },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 148, 200, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 200);
    }
    doc.save(`Monthly_Due_Summary_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleExportDetailExcel = () => {
    if (!detailData?.length || !selectedMonth) return;
    const rows = detailData.map(d => ({
      "Customer": d.customerName,
      "Customer No": d.customerNo,
      "Loan ID": d.applicationId,
      "Product": d.productName,
      "Branch": d.branchName,
      "#": d.installmentNumber,
      "Due Date": d.dueDate ? formatDate(d.dueDate) : "",
      "Principal": d.principleAmount,
      "Margin": d.marginAmount,
      "Total": d.totalAmount,
      "Paid": d.paidAmount,
      "Status": d.isPaid ? "Paid" : d.lateDays > 0 ? `${d.lateDays}d late` : "Pending",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 22 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 5 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Detail");
    XLSX.writeFile(wb, `Monthly_Due_Detail_${selectedMonth}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleExportDetailPDF = () => {
    if (!detailData?.length || !selectedMonth) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Monthly Due Detail - ${formatMonthLabel(selectedMonth)}`, 148, 15, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`${detailData.length} installments | Generated: ${new Date().toLocaleDateString()}`, 148, 21, { align: "center" });

    const tableData = detailData.map(d => [
      d.customerName,
      d.customerNo,
      d.applicationId,
      d.productName,
      d.branchName,
      d.installmentNumber.toString(),
      d.dueDate ? formatDate(d.dueDate) : "",
      d.principleAmount.toLocaleString(),
      d.marginAmount.toLocaleString(),
      d.totalAmount.toLocaleString(),
      d.paidAmount.toLocaleString(),
      d.isPaid ? "Paid" : d.lateDays > 0 ? `${d.lateDays}d late` : "Pending",
    ]);

    autoTable(doc, {
      startY: 26,
      head: [["Customer", "Customer No", "Loan ID", "Product", "Branch", "#", "Due Date", "Principal", "Margin", "Total", "Paid", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 6 },
      styles: { fontSize: 6, cellPadding: 1 },
      columnStyles: { 5: { halign: "center" }, 7: { halign: "right" }, 8: { halign: "right" }, 9: { halign: "right" }, 10: { halign: "right" }, 11: { halign: "center" } },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 148, 200, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 200);
    }
    doc.save(`Monthly_Due_Detail_${selectedMonth}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <CalendarClock className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Monthly Due Summary</h1>
            <p className="text-muted-foreground text-sm">Monthly installment due breakdown with customer details</p>
          </div>
        </div>
        {summary.length > 0 && (
          <div className="flex items-center gap-2">
            <Button onClick={handleExportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button onClick={handleExportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf">
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : totals && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card data-testid="card-total-customers">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{totals.totalCustomers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">with installments</p>
                </div>
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-current-month-due">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Month Due</p>
                  <p className="text-2xl font-bold">{formatCurrency(totals.currentMonthDue.toString())}</p>
                  <p className="text-xs text-muted-foreground mt-1">Collection rate: <span className="font-semibold" style={{ color: Number(currentMonthRate) >= 80 ? "#10b981" : "#ef4444" }}>{currentMonthRate}%</span></p>
                </div>
                <div className="p-3 rounded-full bg-amber-500/10">
                  <Banknote className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-total-collected">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Collected</p>
                  <p className="text-2xl font-bold">{formatCurrency(totals.totalCollected.toString())}</p>
                  <p className="text-xs text-muted-foreground mt-1">Overall rate: <span className="font-semibold" style={{ color: Number(collectionRate) >= 80 ? "#10b981" : "#ef4444" }}>{collectionRate}%</span></p>
                </div>
                <div className="p-3 rounded-full bg-emerald-500/10">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-total-overdue">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totals.totalOverdue.toString())}</p>
                  <p className="text-xs text-muted-foreground mt-1">{totals.overdueInstallmentCount.toLocaleString()} overdue installments</p>
                </div>
                <div className="p-3 rounded-full bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 flex-wrap">
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="w-[200px]" data-testid="select-branch">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branchesData?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Funding Source</Label>
              <Select value={fundingSourceId} onValueChange={setFundingSourceId}>
                <SelectTrigger className="w-[200px]" data-testid="select-funding-source">
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {fundingSourcesData?.map(fs => <SelectItem key={fs.id} value={fs.id}>{fs.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Monthly Due Breakdown</CardTitle>
            {summary.length > 0 && (
              <span className="text-sm text-muted-foreground" data-testid="text-months-count">{summary.length} month{summary.length !== 1 ? "s" : ""}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : summary.length === 0 ? (
            <p className="text-center text-muted-foreground py-8" data-testid="text-no-results">No installment data found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                    <TableHead className="text-primary-foreground font-semibold">Month</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-right">Customers</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-right">Principal Amount</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-right">Margin Amount</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-right">Total Due</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-right">Total Paid</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-center">Installments</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-center">Status</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-center w-20">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {yearGroups.map((group) => (
                    <Fragment key={group.year}>
                      {group.rows.map((row, idx) => (
                        <TableRow
                          key={row.monthYear}
                          className={`${idx % 2 === 0 ? "bg-muted/30" : ""} hover:bg-muted/60`}
                          data-testid={`row-month-${row.monthYear}`}
                        >
                          <TableCell className="font-semibold">{formatMonthLabel(row.monthYear)}</TableCell>
                          <TableCell className="text-right">{row.totalCustomers.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(row.totalPrincipal.toString())}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(row.totalMargin.toString())}</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{formatCurrency(row.totalAmount.toString())}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(row.totalPaid.toString())}</TableCell>
                          <TableCell className="text-center">
                            <span className="text-xs">{row.paidInstallments}/{row.totalInstallments}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-1 justify-center flex-wrap">
                              {row.overdueInstallments > 0 && (
                                <Badge variant="destructive" className="text-xs">{row.overdueInstallments} overdue</Badge>
                              )}
                              {row.unpaidInstallments > 0 && row.overdueInstallments === 0 && (
                                <Badge variant="outline" className="text-xs">{row.unpaidInstallments} pending</Badge>
                              )}
                              {row.unpaidInstallments === 0 && (
                                <Badge className="text-xs bg-emerald-500">All paid</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openDetailDialog(row.monthYear)}
                              data-testid={`button-view-detail-${row.monthYear}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-amber-50 dark:bg-amber-950/40 border-t-2 border-b-2 border-amber-300 dark:border-amber-700" data-testid={`row-subtotal-${group.year}`}>
                        <TableCell className="font-bold text-amber-800 dark:text-amber-300">Subtotal {group.year}</TableCell>
                        <TableCell className="text-right font-bold text-amber-800 dark:text-amber-300">{group.subtotal.totalCustomers.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-amber-800 dark:text-amber-300">{formatCurrency(group.subtotal.totalPrincipal.toString())}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-amber-800 dark:text-amber-300">{formatCurrency(group.subtotal.totalMargin.toString())}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-amber-800 dark:text-amber-300">{formatCurrency(group.subtotal.totalAmount.toString())}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-amber-800 dark:text-amber-300">{formatCurrency(group.subtotal.totalPaid.toString())}</TableCell>
                        <TableCell className="text-center font-bold text-amber-800 dark:text-amber-300">
                          <span className="text-xs">{group.subtotal.paidInstallments}/{group.subtotal.totalInstallments}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {group.subtotal.overdueInstallments > 0 && (
                            <Badge variant="destructive" className="text-xs">{group.subtotal.overdueInstallments} overdue</Badge>
                          )}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between pr-6">
              <div>
                <DialogTitle className="text-xl">
                  {selectedMonth ? formatMonthLabel(selectedMonth) : ""} - Installment Details
                </DialogTitle>
                {selectedSummary && (
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{selectedSummary.totalCustomers} customers</span>
                    <span>{selectedSummary.totalInstallments} installments</span>
                    <span>Due: {formatCurrency(selectedSummary.totalAmount.toString())}</span>
                    <span>Paid: {formatCurrency(selectedSummary.totalPaid.toString())}</span>
                    {selectedSummary.overdueInstallments > 0 && (
                      <Badge variant="destructive" className="text-xs">{selectedSummary.overdueInstallments} overdue</Badge>
                    )}
                  </div>
                )}
              </div>
              {detailData && detailData.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button onClick={handleExportDetailExcel} size="sm" className="gap-1 bg-green-600 text-white" data-testid="button-detail-export-excel">
                    <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
                  </Button>
                  <Button onClick={handleExportDetailPDF} size="sm" className="gap-1 bg-red-600 text-white" data-testid="button-detail-export-pdf">
                    <FileText className="h-3.5 w-3.5" /> PDF
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto mt-2">
            {loadingDetail ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-muted-foreground">Loading installment details...</span>
              </div>
            ) : detailData && detailData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 sticky top-0">
                    <TableHead className="text-xs font-semibold">#</TableHead>
                    <TableHead className="text-xs font-semibold">Customer</TableHead>
                    <TableHead className="text-xs font-semibold">Customer No</TableHead>
                    <TableHead className="text-xs font-semibold">Loan ID</TableHead>
                    <TableHead className="text-xs font-semibold">Product</TableHead>
                    <TableHead className="text-xs font-semibold">Branch</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Inst #</TableHead>
                    <TableHead className="text-xs font-semibold">Due Date</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Principal</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Margin</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Total</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Paid</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailData.map((d, dIdx) => (
                    <TableRow key={d.installmentId} className={dIdx % 2 === 0 ? "bg-background" : "bg-muted/20"} data-testid={`row-detail-${d.installmentId}`}>
                      <TableCell className="text-xs text-muted-foreground">{dIdx + 1}</TableCell>
                      <TableCell className="text-xs">{d.customerName}</TableCell>
                      <TableCell className="text-xs font-mono">{d.customerNo}</TableCell>
                      <TableCell className="text-xs font-mono">{d.applicationId}</TableCell>
                      <TableCell className="text-xs">{d.productName}</TableCell>
                      <TableCell className="text-xs">{d.branchName}</TableCell>
                      <TableCell className="text-xs text-center">{d.installmentNumber}</TableCell>
                      <TableCell className="text-xs">{d.dueDate ? formatDate(d.dueDate) : ""}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{formatCurrency(d.principleAmount.toString())}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{formatCurrency(d.marginAmount.toString())}</TableCell>
                      <TableCell className="text-xs text-right font-mono font-semibold">{formatCurrency(d.totalAmount.toString())}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{formatCurrency(d.paidAmount.toString())}</TableCell>
                      <TableCell className="text-xs text-center">
                        {d.isPaid ? (
                          <Badge className="text-xs bg-emerald-500">Paid</Badge>
                        ) : d.lateDays > 0 ? (
                          <Badge variant="destructive" className="text-xs">{d.lateDays}d late</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-12">No installment details found for this month.</p>
            )}
          </div>
          {detailData && detailData.length > 0 && (
            <div className="flex-shrink-0 border-t pt-3 mt-2 text-sm text-muted-foreground">
              Showing {detailData.length} installment{detailData.length !== 1 ? "s" : ""}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
