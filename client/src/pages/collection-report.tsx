import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBranch } from "@/contexts/branch-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FileSpreadsheet, FileText, Receipt, Loader2, ChevronRight, ChevronDown, ChevronLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type InstallmentRow = {
  loanId: string;
  applicationId: string;
  customerName: string;
  installmentNumber: number;
  dueDate: string;
  paymentDate: string;
  principleAmount: number;
  marginAmount: number;
  totalAmount: number;
  paidAmount: number;
  lateDays: number;
  isPaid: boolean;
};

type LoanSummary = {
  loanId: string;
  customerName: string;
  phoneNumber: string;
  applicationId: string;
  productName: string;
  branchName: string;
  officerName: string;
  officerCode: string;
  loanPrincipleTotal: number;
  loanMarginTotal: number;
  loanTotalDue: number;
  loanTotalPaid: number;
  loanPrincipalPaid: number;
  loanMarginPaid: number;
  loanOutstanding: number;
};

type CollectionResponse = {
  loans: LoanSummary[];
  installments: InstallmentRow[];
  lifeToDate?: {
    totalPortfolio: number;
    totalCollected: number;
    totalOutstanding: number;
    collectionRate: number;
  };
};

type LoanGroup = LoanSummary & {
  installments: InstallmentRow[];
  filteredPrincipal: number;
  filteredMargin: number;
  filteredPaid: number;
};

type Branch = { id: string; name: string };
type Officer = { id: string; name: string; code: string };

const PAGE_SIZE = 20;

const quickDateOptions = [
  { label: "1D", days: 1 },
  { label: "2D", days: 2 },
  { label: "1W", days: 7 },
  { label: "2W", days: 14 },
  { label: "1M", months: 1 },
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
  { label: "All", all: true },
] as const;

function QuickDateButtons({ setStartDate, setEndDate }: { setStartDate: (d: string) => void; setEndDate: (d: string) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground">Quick:</span>
      {quickDateOptions.map((opt) => (
        <button
          key={opt.label}
          type="button"
          data-testid={`button-quick-${opt.label}`}
          className="px-3 py-1 text-xs font-medium rounded-full border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700 dark:hover:bg-sky-900/50 transition-colors"
          onClick={() => {
            const end = new Date();
            setEndDate(end.toISOString().split("T")[0]);
            if ("all" in opt && opt.all) {
              setStartDate("2024-01-01");
            } else {
              const start = new Date();
              if ("months" in opt && opt.months) start.setMonth(start.getMonth() - opt.months);
              if ("days" in opt && opt.days) start.setDate(start.getDate() - opt.days);
              const minDate = new Date("2024-01-01");
              if (start < minDate) start.setTime(minDate.getTime());
              setStartDate(start.toISOString().split("T")[0]);
            }
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function CollectionReport() {
  const { selectedBranchId, isLocked } = useBranch();
  const [branchId, setBranchId] = useState("all");

  useEffect(() => {
    setBranchId(selectedBranchId || "all");
  }, [selectedBranchId]);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [officerId, setOfficerId] = useState("all");
  const [data, setData] = useState<CollectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const { data: branchesData } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: officersData } = useQuery<Officer[]>({ queryKey: ["/api/finance-officers/active"] });

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (branchId !== "all") params.append("branchId", branchId);
      if (officerId !== "all") params.append("officerId", officerId);
      const res = await fetch(`/api/reports/collection-report?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
      setCurrentPage(1);
      setExpandedKeys(new Set());
    } catch (error) {
      console.error("Failed to fetch collection report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBranchName = branchId === "all" ? "All Branches" : branchesData?.find(b => b.id === branchId)?.name || "";
  const selectedOfficerName = officerId === "all" ? "All Officers" : officersData?.find(o => o.id === officerId)?.name || "";

  const { loanGroups, grandTotal, filteredCount } = useMemo(() => {
    if (!data || !data.loans || data.loans.length === 0) {
      return {
        loanGroups: [] as LoanGroup[],
        grandTotal: { loanPrincipleTotal: 0, loanMarginTotal: 0, loanTotalDue: 0, loanTotalPaid: 0, loanPrincipalPaid: 0, loanMarginPaid: 0, loanOutstanding: 0, filteredPrincipal: 0, filteredMargin: 0, filteredPaid: 0 },
        filteredCount: 0,
      };
    }

    const installmentsByLoan = new Map<string, InstallmentRow[]>();
    for (const inst of data.installments) {
      const arr = installmentsByLoan.get(inst.loanId) || [];
      arr.push(inst);
      installmentsByLoan.set(inst.loanId, arr);
    }

    const groups: LoanGroup[] = data.loans.map((l) => {
      const insts = (installmentsByLoan.get(l.loanId) || []).sort((a, b) => a.installmentNumber - b.installmentNumber);
      let filteredPrincipal = 0, filteredMargin = 0, filteredPaid = 0;
      for (const i of insts) {
        filteredPaid += i.paidAmount;
        if (i.totalAmount > 0) {
          const ratio = i.paidAmount / i.totalAmount;
          filteredPrincipal += i.principleAmount * ratio;
          filteredMargin += i.marginAmount * ratio;
        }
      }
      return { ...l, installments: insts, filteredPrincipal, filteredMargin, filteredPaid };
    });
    groups.sort((a, b) => (a.branchName || "").localeCompare(b.branchName || "") || a.customerName.localeCompare(b.customerName));

    const gt = { loanPrincipleTotal: 0, loanMarginTotal: 0, loanTotalDue: 0, loanTotalPaid: 0, loanPrincipalPaid: 0, loanMarginPaid: 0, loanOutstanding: 0, filteredPrincipal: 0, filteredMargin: 0, filteredPaid: 0 };
    for (const g of groups) {
      gt.loanPrincipleTotal += g.loanPrincipleTotal;
      gt.loanMarginTotal += g.loanMarginTotal;
      gt.loanTotalDue += g.loanTotalDue;
      gt.loanTotalPaid += g.loanTotalPaid;
      gt.loanPrincipalPaid += g.loanPrincipalPaid;
      gt.loanMarginPaid += g.loanMarginPaid;
      gt.loanOutstanding += g.loanOutstanding;
      gt.filteredPrincipal += g.filteredPrincipal;
      gt.filteredMargin += g.filteredMargin;
      gt.filteredPaid += g.filteredPaid;
    }

    return { loanGroups: groups, grandTotal: gt, filteredCount: data.installments.length };
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(loanGroups.length / PAGE_SIZE));
  const pagedGroups = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return loanGroups.slice(start, start + PAGE_SIZE);
  }, [loanGroups, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleExportExcel = () => {
    if (!data) return;
    const rows: Record<string, string | number>[] = [];
    let serial = 1;
    for (const g of loanGroups) {
      rows.push({
        "#": serial++,
        "Customer": g.customerName,
        "Phone": g.phoneNumber,
        "Application ID": g.applicationId,
        "Product": g.productName,
        "Branch": g.branchName,
        "Officer": g.officerName,
        "Inst #": "",
        "Due Date": "",
        "Payment Date": "",
        "Principal (AFN)": g.loanPrincipleTotal,
        "Margin (AFN)": g.loanMarginTotal,
        "Total Due (AFN)": g.loanTotalDue,
        "Principal Paid (AFN)": g.loanPrincipalPaid,
        "Margin Paid (AFN)": g.loanMarginPaid,
        "Total Paid (AFN)": g.loanTotalPaid,
        "Outstanding (AFN)": g.loanOutstanding,
        "Late Days": "",
        "Status": "",
      });
      for (const inst of g.installments) {
        const ratio = inst.totalAmount > 0 ? inst.paidAmount / inst.totalAmount : 0;
        const instPrincipalPaid = inst.paidAmount >= inst.totalAmount ? inst.principleAmount : inst.principleAmount * ratio;
        const instMarginPaid = inst.paidAmount >= inst.totalAmount ? inst.marginAmount : inst.marginAmount * ratio;
        rows.push({
          "#": "",
          "Customer": "  ↳",
          "Phone": "",
          "Application ID": "",
          "Product": "",
          "Branch": "",
          "Officer": "",
          "Inst #": inst.installmentNumber,
          "Due Date": inst.dueDate ? formatDate(inst.dueDate) : "",
          "Payment Date": inst.paymentDate ? formatDate(inst.paymentDate) : "",
          "Principal (AFN)": inst.principleAmount,
          "Margin (AFN)": inst.marginAmount,
          "Total Due (AFN)": inst.totalAmount,
          "Principal Paid (AFN)": Number(instPrincipalPaid.toFixed(2)),
          "Margin Paid (AFN)": Number(instMarginPaid.toFixed(2)),
          "Total Paid (AFN)": inst.paidAmount,
          "Outstanding (AFN)": inst.totalAmount - inst.paidAmount,
          "Late Days": inst.lateDays,
          "Status": inst.isPaid ? "Paid" : "Partial",
        });
      }
    }
    rows.push({
      "#": "",
      "Customer": "Grand Total",
      "Phone": "",
      "Application ID": "",
      "Product": "",
      "Branch": "",
      "Officer": "",
      "Inst #": "",
      "Due Date": "",
      "Payment Date": "",
      "Principal (AFN)": grandTotal.loanPrincipleTotal,
      "Margin (AFN)": grandTotal.loanMarginTotal,
      "Total Due (AFN)": grandTotal.loanTotalDue,
      "Principal Paid (AFN)": grandTotal.loanPrincipalPaid,
      "Margin Paid (AFN)": grandTotal.loanMarginPaid,
      "Total Paid (AFN)": grandTotal.loanTotalPaid,
      "Outstanding (AFN)": grandTotal.loanOutstanding,
      "Late Days": "",
      "Status": "",
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 6 }, { wch: 22 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 18 },
      { wch: 7 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 10 }, { wch: 10 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Collection Report");
    const dateStr = `${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}`;
    XLSX.writeFile(wb, `Collection_Report_${dateStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Collection Report", 148, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${formatDate(startDate)}    To: ${formatDate(endDate)}`, 148, 22, { align: "center" });
    doc.text(`Branch: ${selectedBranchName}    Officer: ${selectedOfficerName}`, 148, 28, { align: "center" });
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 148, 34, { align: "center" });

    const tableData: any[][] = [];
    let serial = 1;
    for (const g of loanGroups) {
      tableData.push([
        serial++,
        g.customerName,
        g.applicationId,
        g.productName,
        g.branchName,
        g.officerName,
        g.loanPrincipleTotal.toLocaleString(),
        g.loanMarginTotal.toLocaleString(),
        g.loanTotalDue.toLocaleString(),
        g.loanPrincipalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        g.loanMarginPaid.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        g.loanTotalPaid.toLocaleString(),
        g.loanOutstanding.toLocaleString(),
      ]);
    }
    tableData.push([
      "", "Grand Total", "", "", "", "",
      grandTotal.loanPrincipleTotal.toLocaleString(),
      grandTotal.loanMarginTotal.toLocaleString(),
      grandTotal.loanTotalDue.toLocaleString(),
      grandTotal.loanPrincipalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      grandTotal.loanMarginPaid.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      grandTotal.loanTotalPaid.toLocaleString(),
      grandTotal.loanOutstanding.toLocaleString(),
    ]);

    autoTable(doc, {
      startY: 38,
      head: [["#", "Customer", "App ID", "Product", "Branch", "Officer", "Principal", "Margin", "Total", "Principal Paid", "Margin Paid", "Total Paid", "Outstanding"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 8 },
      styles: { fontSize: 7, cellPadding: 1.5 },
      columnStyles: {
        0: { halign: "center", cellWidth: 8 },
        6: { halign: "right" }, 7: { halign: "right" }, 8: { halign: "right" }, 9: { halign: "right" }, 10: { halign: "right" }, 11: { halign: "right" }, 12: { halign: "right" },
      },
      didParseCell: (hookData: any) => {
        if (hookData.section === "body") {
          const rowData = hookData.row.raw as any[];
          if (rowData && rowData[1] === "Grand Total") {
            hookData.cell.styles.fontStyle = "bold";
            hookData.cell.styles.fillColor = [34, 87, 122];
            hookData.cell.styles.textColor = [255, 255, 255];
          }
        }
      },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 148, 200, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 200);
    }
    const dateStr = `${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}`;
    doc.save(`Collection_Report_${dateStr}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Receipt className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Collection Report</h1>
            <p className="text-muted-foreground text-sm">Grouped by customer & loan — click a row to see installment details</p>
          </div>
        </div>
        {data && data.loans.length > 0 && (
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <QuickDateButtons setStartDate={setStartDate} setEndDate={setEndDate} />
          <div className="flex items-end gap-4 flex-wrap">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} data-testid="input-start-date" />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} data-testid="input-end-date" />
            </div>
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={branchId} onValueChange={setBranchId} disabled={isLocked}>
                <SelectTrigger className="w-[200px]" data-testid="select-branch">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branchesData?.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Financing Officer</Label>
              <Select value={officerId} onValueChange={setOfficerId}>
                <SelectTrigger className="w-[200px]" data-testid="select-officer">
                  <SelectValue placeholder="Select Officer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Officers</SelectItem>
                  {officersData?.map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchReport} disabled={isLoading} data-testid="button-generate">
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...</>
              ) : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && data.loans.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Loans Collected</p>
              <p className="text-2xl font-bold mt-1" data-testid="text-total-loans">{loanGroups.length}</p>
              <p className="text-xs text-muted-foreground mt-1">{filteredCount} installment{filteredCount !== 1 ? "s" : ""} in range</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Principal Collected</p>
              <p className="text-2xl font-bold mt-1 text-blue-600" data-testid="text-principal-collected">{formatCurrency(grandTotal.filteredPrincipal)}</p>
              <p className="text-xs text-muted-foreground mt-1">In selected period</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Margin Collected</p>
              <p className="text-2xl font-bold mt-1 text-purple-600" data-testid="text-margin-collected">{formatCurrency(grandTotal.filteredMargin)}</p>
              <p className="text-xs text-muted-foreground mt-1">In selected period</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600" data-testid="text-total-collected">{formatCurrency(grandTotal.filteredPaid)}</p>
              <p className="text-xs text-muted-foreground mt-1">Principal + Margin</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Loan Outstanding</p>
              <p className="text-2xl font-bold mt-1 text-amber-600" data-testid="text-total-outstanding">{formatCurrency(data?.lifeToDate?.totalOutstanding ?? grandTotal.loanOutstanding)}</p>
              <p className="text-xs text-muted-foreground mt-1">Life-to-date balance</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Collection Rate</p>
              <p className="text-2xl font-bold mt-1" data-testid="text-collection-rate">
                {data?.lifeToDate
                  ? `${Math.round(data.lifeToDate.collectionRate)}%`
                  : (grandTotal.loanTotalDue > 0 ? `${Math.round((grandTotal.loanTotalPaid / grandTotal.loanTotalDue) * 100)}%` : "0%")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Life-to-date</p>
            </CardContent>
          </Card>
        </div>
      )}

      {data && (
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg">Collection Results</CardTitle>
              <span className="text-sm text-muted-foreground" data-testid="text-result-count">
                {loanGroups.length} loan{loanGroups.length !== 1 ? "s" : ""} · {filteredCount} installment{filteredCount !== 1 ? "s" : ""} in range
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 overflow-x-auto">
            {loanGroups.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-no-results">No collections found for the selected criteria.</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                      <TableHead className="w-10 text-primary-foreground" />
                      <TableHead className="text-center w-12 text-primary-foreground font-semibold">#</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Customer</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Application ID</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Product</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Branch</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Officer</TableHead>
                      <TableHead className="text-right text-primary-foreground font-semibold">Principal</TableHead>
                      <TableHead className="text-right text-primary-foreground font-semibold">Margin</TableHead>
                      <TableHead className="text-right text-primary-foreground font-semibold">Total</TableHead>
                      <TableHead className="text-right text-primary-foreground font-semibold">Principal Paid</TableHead>
                      <TableHead className="text-right text-primary-foreground font-semibold">Margin Paid</TableHead>
                      <TableHead className="text-right text-primary-foreground font-semibold">Total Paid</TableHead>
                      <TableHead className="text-right text-primary-foreground font-semibold">Outstanding</TableHead>
                      <TableHead className="text-center text-primary-foreground font-semibold">Inst.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedGroups.map((g, idx) => {
                      const serial = (currentPage - 1) * PAGE_SIZE + idx + 1;
                      const isExpanded = expandedKeys.has(g.loanId);
                      return (
                        <>
                          <TableRow
                            key={g.loanId}
                            className={`cursor-pointer transition-colors border-l-4 ${isExpanded ? "bg-emerald-50 dark:bg-emerald-950/30 border-l-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-950/40" : idx % 2 === 0 ? "bg-sky-50/60 dark:bg-sky-950/20 border-l-sky-300 dark:border-l-sky-800 hover:bg-sky-100/70 dark:hover:bg-sky-950/30" : "bg-white dark:bg-background border-l-slate-200 dark:border-l-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"}`}
                            onClick={() => toggleExpand(g.loanId)}
                            data-testid={`row-loan-${idx}`}
                          >
                            <TableCell className="text-center">
                              {isExpanded ? <ChevronDown className="h-4 w-4 text-emerald-600" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                            </TableCell>
                            <TableCell className="text-center font-mono text-xs">{serial}</TableCell>
                            <TableCell>
                              <div className="font-semibold">{g.customerName}</div>
                              {g.phoneNumber && <div className="text-xs text-muted-foreground">{g.phoneNumber}</div>}
                            </TableCell>
                            <TableCell className="font-mono text-xs">{g.applicationId}</TableCell>
                            <TableCell>{g.productName}</TableCell>
                            <TableCell>{g.branchName}</TableCell>
                            <TableCell>{g.officerName}</TableCell>
                            <TableCell className="text-right font-mono text-sm">{formatCurrency(g.loanPrincipleTotal)}</TableCell>
                            <TableCell className="text-right font-mono text-sm">{formatCurrency(g.loanMarginTotal)}</TableCell>
                            <TableCell className="text-right font-mono font-semibold">{formatCurrency(g.loanTotalDue)}</TableCell>
                            <TableCell className="text-right font-mono font-semibold text-blue-600">{formatCurrency(g.loanPrincipalPaid)}</TableCell>
                            <TableCell className="text-right font-mono font-semibold text-purple-600">{formatCurrency(g.loanMarginPaid)}</TableCell>
                            <TableCell className="text-right font-mono font-semibold text-emerald-600">{formatCurrency(g.loanTotalPaid)}</TableCell>
                            <TableCell className={`text-right font-mono font-semibold ${g.loanOutstanding > 0 ? "text-amber-600" : "text-emerald-600"}`}>{formatCurrency(g.loanOutstanding)}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="font-mono text-xs">{g.installments.length}</Badge>
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow key={`${g.loanId}-detail`} className="bg-emerald-50/40 dark:bg-emerald-950/15 border-l-4 border-l-emerald-500">
                              <TableCell colSpan={12} className="p-0">
                                <div className="px-6 py-4">
                                  <p className="text-sm font-semibold mb-2 text-emerald-700 dark:text-emerald-400">
                                    Collected Installments ({g.installments.length})
                                  </p>
                                  <div className="rounded-lg border border-emerald-200 dark:border-emerald-900 bg-background overflow-hidden">
                                    <Table>
                                      <TableHeader>
                                        <TableRow className="bg-emerald-100/70 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/40">
                                          <TableHead className="text-center w-16 text-emerald-800 dark:text-emerald-300 font-semibold">Inst #</TableHead>
                                          <TableHead className="text-emerald-800 dark:text-emerald-300 font-semibold">Due Date</TableHead>
                                          <TableHead className="text-emerald-800 dark:text-emerald-300 font-semibold">Payment Date</TableHead>
                                          <TableHead className="text-right text-emerald-800 dark:text-emerald-300 font-semibold">Principal</TableHead>
                                          <TableHead className="text-right text-emerald-800 dark:text-emerald-300 font-semibold">Margin</TableHead>
                                          <TableHead className="text-right text-emerald-800 dark:text-emerald-300 font-semibold">Total Due</TableHead>
                                          <TableHead className="text-right text-emerald-800 dark:text-emerald-300 font-semibold">Paid</TableHead>
                                          <TableHead className="text-right text-emerald-800 dark:text-emerald-300 font-semibold">Outstanding</TableHead>
                                          <TableHead className="text-center text-emerald-800 dark:text-emerald-300 font-semibold">Late Days</TableHead>
                                          <TableHead className="text-center text-emerald-800 dark:text-emerald-300 font-semibold">Status</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {g.installments.map((inst, instIdx) => {
                                          const instOutstanding = inst.totalAmount - inst.paidAmount;
                                          return (
                                            <TableRow key={instIdx} data-testid={`row-installment-${idx}-${instIdx}`} className={instIdx % 2 === 0 ? "bg-white dark:bg-background hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20" : "bg-emerald-50/30 dark:bg-emerald-950/10 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/25"}>
                                              <TableCell className="text-center font-mono">{inst.installmentNumber}</TableCell>
                                              <TableCell>{inst.dueDate ? formatDate(inst.dueDate) : ""}</TableCell>
                                              <TableCell>{inst.paymentDate ? formatDate(inst.paymentDate) : ""}</TableCell>
                                              <TableCell className="text-right font-mono">{formatCurrency(inst.principleAmount)}</TableCell>
                                              <TableCell className="text-right font-mono">{formatCurrency(inst.marginAmount)}</TableCell>
                                              <TableCell className="text-right font-mono">{formatCurrency(inst.totalAmount)}</TableCell>
                                              <TableCell className="text-right font-mono text-emerald-600 font-semibold">{formatCurrency(inst.paidAmount)}</TableCell>
                                              <TableCell className={`text-right font-mono ${instOutstanding > 0 ? "text-amber-600" : ""}`}>{formatCurrency(instOutstanding)}</TableCell>
                                              <TableCell className={`text-center font-mono ${inst.lateDays > 0 ? "text-red-600 font-semibold" : ""}`}>{inst.lateDays}</TableCell>
                                              <TableCell className="text-center">
                                                <Badge variant={inst.isPaid ? "default" : "secondary"} className={inst.isPaid ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}>
                                                  {inst.isPaid ? "Paid" : "Partial"}
                                                </Badge>
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                    <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                      <TableCell colSpan={7} className="text-right font-bold text-primary-foreground text-base">Grand Total</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.loanPrincipleTotal)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.loanMarginTotal)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.loanTotalDue)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.loanPrincipalPaid)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.loanMarginPaid)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.loanTotalPaid)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.loanOutstanding)}</TableCell>
                      <TableCell className="text-primary-foreground"></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between gap-3 mt-4 flex-wrap" data-testid="pagination-controls">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages} · Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, loanGroups.length)} of {loanGroups.length}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        data-testid="button-page-first"
                      >
                        First
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        data-testid="button-page-prev"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {(() => {
                        const pageNumbers: number[] = [];
                        const start = Math.max(1, currentPage - 2);
                        const end = Math.min(totalPages, start + 4);
                        for (let p = start; p <= end; p++) pageNumbers.push(p);
                        return pageNumbers.map((p) => (
                          <Button
                            key={p}
                            variant={p === currentPage ? "default" : "outline"}
                            size="sm"
                            className="min-w-[36px]"
                            onClick={() => setCurrentPage(p)}
                            data-testid={`button-page-${p}`}
                          >
                            {p}
                          </Button>
                        ));
                      })()}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        data-testid="button-page-next"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        data-testid="button-page-last"
                      >
                        Last
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
