import { useState, useMemo, useEffect } from "react";
import { useBranch } from "@/contexts/branch-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
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
import { CheckCircle2, XCircle, FileSpreadsheet, FileText, Gavel } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ReportRow = {
  unit: string;
  status: string;
  reviewedAt: string | null;
  reviewerName: string;
  comments: string;
  score: number | null;
  loanId: string;
  applicationId: string;
  customerName: string;
  branchName: string;
  productName: string;
  requestAmount: string;
};

type Summary = {
  total: number;
  approved: number;
  rejected: number;
  byUnit: { unit: string; approved: number; rejected: number; total: number }[];
};

type Branch = { id: string; name: string };

const UNITS = [
  { value: "all", label: "All Units" },
  { value: "fad", label: "FAD" },
  { value: "risk_compliance", label: "Risk Compliance" },
  { value: "committee", label: "Committee" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Approved & Rejected" },
  { value: "approved", label: "Approved Only" },
  { value: "rejected", label: "Rejected Only" },
];

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

function fmtNum(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

function fmtAmount(s: string) {
  const n = parseFloat(s || "0");
  if (!isFinite(n)) return "-";
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export default function ApprovalRejectionReport() {
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
  const [unit, setUnit] = useState("all");
  const [status, setStatus] = useState("all");
  const [data, setData] = useState<{ summary: Summary; rows: ReportRow[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: branchesData } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate, unit, status });
      const res = await fetch(`/api/reports/approval-rejection?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      setData(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const branchName = useMemo(
    () => (branchId === "all" ? "All Branches" : branchesData?.find((b) => b.id === branchId)?.name || ""),
    [branchId, branchesData]
  );

  const exportExcel = () => {
    if (!data) return;
    const rows = data.rows.map((r, i) => ({
      "#": i + 1,
      "Date": r.reviewedAt ? formatDate(r.reviewedAt) : "",
      "Unit": r.unit,
      "Status": r.status,
      "Application ID": r.applicationId,
      "Customer": r.customerName,
      "Branch": r.branchName,
      "Product": r.productName,
      "Request Amount": parseFloat(r.requestAmount || "0"),
      "Reviewer": r.reviewerName,
      "Score": r.score ?? "",
      "Comments": r.comments,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 5 }, { wch: 12 }, { wch: 16 }, { wch: 10 }, { wch: 18 }, { wch: 22 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 8 }, { wch: 50 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Approval-Rejection");
    XLSX.writeFile(wb, `Approval_Rejection_${startDate}_${endDate}.xlsx`);
  };

  const exportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Approval & Rejection Report", 148, 14, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${formatDate(startDate)}    To: ${formatDate(endDate)}    Branch: ${branchName}    Unit: ${UNITS.find((u) => u.value === unit)?.label}`, 148, 21, { align: "center" });
    doc.text(`Total: ${data.summary.total}    Approved: ${data.summary.approved}    Rejected: ${data.summary.rejected}`, 148, 27, { align: "center" });

    const body = data.rows.map((r, i) => [
      i + 1,
      r.reviewedAt ? formatDate(r.reviewedAt) : "",
      r.unit,
      r.status,
      r.applicationId,
      r.customerName,
      r.branchName,
      r.productName,
      fmtAmount(r.requestAmount),
      r.reviewerName,
      r.comments,
    ]);

    autoTable(doc, {
      startY: 32,
      head: [["#", "Date", "Unit", "Status", "App ID", "Customer", "Branch", "Product", "Amount", "Reviewer", "Comments"]],
      body,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: 255, fontStyle: "bold", fontSize: 7 },
      styles: { fontSize: 7, cellPadding: 1.5, overflow: "linebreak" },
      columnStyles: { 0: { cellWidth: 7, halign: "center" }, 8: { halign: "right" }, 10: { cellWidth: 70 } },
      didParseCell: (h) => {
        const r = h.row.raw as any[];
        if (h.section === "body" && h.column.index === 3) {
          if (r[3] === "approved") h.cell.styles.textColor = [22, 101, 52];
          if (r[3] === "rejected") h.cell.styles.textColor = [153, 27, 27];
        }
      },
    });
    doc.save(`Approval_Rejection_${startDate}_${endDate}.pdf`);
  };

  const statusBadge = (s: string) =>
    s === "approved" ? (
      <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-100">Approved</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-100">Rejected</Badge>
    );

  const unitBadge = (u: string) => {
    const cls =
      u === "FAD" ? "bg-blue-100 text-blue-800 border-blue-300" :
      u === "Risk Compliance" ? "bg-orange-100 text-orange-800 border-orange-300" :
      "bg-purple-100 text-purple-800 border-purple-300";
    return <Badge variant="outline" className={cls}>{u}</Badge>;
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Gavel className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Approval & Rejection Report</h1>
            <p className="text-muted-foreground text-sm">Applications approved or rejected by FAD, Risk Compliance, or Committee within a date range</p>
          </div>
        </div>
        {data && data.rows.length > 0 && (
          <div className="flex items-center gap-2">
            <Button onClick={exportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button onClick={exportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf">
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
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
              <Label>Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="w-[200px]" data-testid="select-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Decision</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[200px]" data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={branchId} onValueChange={setBranchId} disabled={isLocked}>
                <SelectTrigger className="w-[180px]" data-testid="select-branch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branchesData?.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchReport} disabled={isLoading} data-testid="button-generate">
              {isLoading ? "Loading..." : "Generate Report"}
            </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Card data-testid="card-total">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase">Total Decisions</p>
                <p className="text-2xl font-bold">{fmtNum(data.summary.total)}</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 dark:border-green-900" data-testid="card-approved">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground uppercase">Approved</p>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{fmtNum(data.summary.approved)}</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-900" data-testid="card-rejected">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground uppercase">Rejected</p>
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">{fmtNum(data.summary.rejected)}</p>
              </CardContent>
            </Card>
            {data.summary.byUnit.map((u) => (
              <Card key={u.unit} data-testid={`card-unit-${u.unit.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground uppercase">{u.unit}</p>
                  <p className="text-lg font-bold">{fmtNum(u.total)} <span className="text-xs text-muted-foreground font-normal">total</span></p>
                  <div className="text-xs mt-1 flex gap-3">
                    <span className="text-green-700 dark:text-green-400">✓ {u.approved}</span>
                    <span className="text-red-700 dark:text-red-400">✗ {u.rejected}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-lg">Applications</CardTitle>
                <span className="text-sm text-muted-foreground" data-testid="text-result-count">
                  {data.rows.length} record{data.rows.length !== 1 ? "s" : ""} found
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 overflow-x-auto">
              {data.rows.length === 0 ? (
                <p className="text-center text-muted-foreground py-8" data-testid="text-no-results">
                  No applications were approved or rejected within the selected criteria.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                      <TableHead className="text-center w-12 text-primary-foreground font-semibold">#</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Date</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Unit</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Decision</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">App ID</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Customer</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Branch</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Product</TableHead>
                      <TableHead className="text-right text-primary-foreground font-semibold">Request Amt</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Reviewer</TableHead>
                      <TableHead className="text-primary-foreground font-semibold min-w-[280px]">Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.rows.map((r, i) => (
                      <TableRow key={`${r.unit}-${r.loanId}-${i}`} className={i % 2 === 0 ? "bg-muted/30" : ""} data-testid={`row-decision-${i}`}>
                        <TableCell className="text-center font-mono">{i + 1}</TableCell>
                        <TableCell className="whitespace-nowrap">{r.reviewedAt ? formatDate(r.reviewedAt) : "-"}</TableCell>
                        <TableCell>{unitBadge(r.unit)}</TableCell>
                        <TableCell>{statusBadge(r.status)}</TableCell>
                        <TableCell className="font-mono text-xs">{r.applicationId}</TableCell>
                        <TableCell>{r.customerName}</TableCell>
                        <TableCell>{r.branchName}</TableCell>
                        <TableCell>{r.productName}</TableCell>
                        <TableCell className="text-right font-mono">{fmtAmount(r.requestAmount)}</TableCell>
                        <TableCell>{r.reviewerName}</TableCell>
                        <TableCell className="text-sm whitespace-pre-wrap" data-testid={`text-comment-${i}`}>{r.comments || <span className="text-muted-foreground italic">No comments</span>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
