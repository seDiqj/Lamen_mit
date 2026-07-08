import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBranch } from "@/contexts/branch-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { FileSpreadsheet, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type OutstandingRow = {
  branchName: string;
  productName: string;
  financeOfficerName: string;
  customerNo: string;
  customerName: string;
  disbursementDate: string;
  financingAmount: number;
  balanceOutstanding: number;
  outstanding: number;
  totalInstallments: number;
  installmentsPaid: number;
  installmentsUnpaid: number;
  lastRepaymentDate: string | null;
  lateDays: number;
  totalPrincipalReceived: number;
  totalMarkupReceived: number;
  totalAmountReceived: number;
  principalThisYear: number;
  markupThisYear: number;
};

type Branch = { id: string; name: string };
type FundingSource = { id: string; name: string };

export default function ActiveCustomerOutstandingReport() {
  const { selectedBranchId, isLocked } = useBranch();
  const [branchId, setBranchId] = useState("all");

  useEffect(() => {
    setBranchId(selectedBranchId || "all");
  }, [selectedBranchId]);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [fundingSourceId, setFundingSourceId] = useState("all");
  const [data, setData] = useState<OutstandingRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: branchesData } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: fundingSourcesData } = useQuery<FundingSource[]>({ queryKey: ["/api/funding-sources"] });

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (branchId !== "all") params.append("branchId", branchId);
      if (fundingSourceId !== "all") params.append("fundingSourceId", fundingSourceId);
      const res = await fetch(`/api/reports/active-customer-outstanding?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch active customer outstanding report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBranchName = branchId === "all" ? "All Branches" : branchesData?.find(b => b.id === branchId)?.name || "";

  const statusOf = (row: OutstandingRow) => (row.outstanding > 0 ? "Active" : "Closed");

  const statusSummary = data ? {
    active: data.filter((r) => r.outstanding > 0).length,
    closed: data.filter((r) => r.outstanding <= 0).length,
  } : null;

  const totals = data ? {
    financingAmount: data.reduce((s, r) => s + r.financingAmount, 0),
    balanceOutstanding: data.reduce((s, r) => s + r.balanceOutstanding, 0),
    outstanding: data.reduce((s, r) => s + r.outstanding, 0),
    totalPrincipalReceived: data.reduce((s, r) => s + r.totalPrincipalReceived, 0),
    totalMarkupReceived: data.reduce((s, r) => s + r.totalMarkupReceived, 0),
    totalAmountReceived: data.reduce((s, r) => s + r.totalAmountReceived, 0),
    principalThisYear: data.reduce((s, r) => s + r.principalThisYear, 0),
    markupThisYear: data.reduce((s, r) => s + r.markupThisYear, 0),
  } : null;

  const handleExportExcel = () => {
    if (!data) return;
    const rows = data.map((row, idx) => ({
      "#": idx + 1,
      "Branch": row.branchName,
      "Product": row.productName,
      "Financing Officer": row.financeOfficerName,
      "Customer No": row.customerNo,
      "Customer Name": row.customerName,
      "Disbursed Date": row.disbursementDate ? formatDate(row.disbursementDate) : "",
      "Financing Amount": row.financingAmount,
      "Balance Outstanding Last": row.balanceOutstanding,
      "Total Install.": row.totalInstallments,
      "No Install Paid": row.installmentsPaid,
      "No. Install. unpaid": row.installmentsUnpaid,
      "Last Repayment Date": row.lastRepaymentDate ? formatDate(row.lastRepaymentDate) : "",
      "No of Late Days": row.lateDays,
      "Total Principal Received": row.totalPrincipalReceived,
      "Total Markup Received": row.totalMarkupReceived,
      "Total Amount Received": row.totalAmountReceived,
      "Outstanding": row.outstanding,
      "Status": statusOf(row),
      "Principal This Year": row.principalThisYear,
      "Markup This Year": row.markupThisYear,
    }));

    if (totals) {
      rows.push({
        "#": "" as any,
        "Branch": "",
        "Product": "",
        "Financing Officer": "",
        "Customer No": "",
        "Customer Name": "",
        "Disbursed Date": "",
        "Financing Amount": "" as any,
        "Balance Outstanding Last": "Total Balance" as any,
        "Total Install.": "" as any,
        "No Install Paid": "" as any,
        "No. Install. unpaid": "" as any,
        "Last Repayment Date": "",
        "No of Late Days": "" as any,
        "Total Principal Received": totals.totalPrincipalReceived,
        "Total Markup Received": totals.totalMarkupReceived,
        "Total Amount Received": totals.totalAmountReceived,
        "Outstanding": totals.outstanding,
        "Status": "",
        "Principal This Year": totals.principalThisYear,
        "Markup This Year": totals.markupThisYear,
      });
    }

    if (statusSummary) {
      rows.push({
        "#": "" as any, "Branch": "", "Product": "", "Financing Officer": "", "Customer No": "",
        "Customer Name": "", "Disbursed Date": "", "Financing Amount": "" as any,
        "Balance Outstanding Last": "" as any, "Total Install.": "" as any, "No Install Paid": "" as any,
        "No. Install. unpaid": "" as any, "Last Repayment Date": "", "No of Late Days": "" as any,
        "Total Principal Received": "" as any, "Total Markup Received": "" as any,
        "Total Amount Received": "" as any, "Outstanding": "" as any,
        "Status": `Active: ${statusSummary.active} / Closed: ${statusSummary.closed}` as any,
        "Principal This Year": "" as any, "Markup This Year": "" as any,
      });
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 5 }, { wch: 12 }, { wch: 12 }, { wch: 18 }, { wch: 14 }, { wch: 20 },
      { wch: 14 }, { wch: 16 }, { wch: 18 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
      { wch: 14 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 10 }, { wch: 16 }, { wch: 14 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Active Customer Outstanding");
    const dateStr = `${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}`;
    XLSX.writeFile(wb, `Active_Customer_Outstanding_${dateStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const now = new Date();

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Lamen", 148, 12, { align: "center" });
    doc.setFontSize(12);
    doc.text("Active Customer Outstanding Summary", 148, 19, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Company Branch    from    ${branchId === "all" ? "1" : branchId}    To    ${branchId === "all" ? "99" : branchId}`, 100, 26, { align: "center" });
    doc.text(`As Of ${formatDate(endDate)}`, 148, 31, { align: "center" });

    doc.setFontSize(8);
    doc.text(`User: ${(window as any).__user?.firstName || ""}`, 245, 12);
    doc.text(`Date: ${formatDate(now.toISOString().split("T")[0])}`, 245, 17);
    doc.text(`Time: ${now.toLocaleTimeString()}`, 245, 22);
    doc.text(`Page: 1`, 245, 27);

    const tableData = data.map((row) => [
      row.branchName,
      row.productName,
      row.financeOfficerName,
      row.customerNo,
      row.customerName,
      row.disbursementDate ? formatDate(row.disbursementDate) : "",
      row.financingAmount.toLocaleString(),
      row.balanceOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      row.totalInstallments,
      row.installmentsPaid,
      row.installmentsUnpaid,
      row.lastRepaymentDate ? formatDate(row.lastRepaymentDate) : "",
      row.lateDays,
      row.totalPrincipalReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      row.totalMarkupReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      row.totalAmountReceived.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
      row.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      statusOf(row),
      row.principalThisYear.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      row.markupThisYear.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    ]);

    if (totals) {
      tableData.push([
        "", "", "", "", "", "", "",
        "Total Balance",
        "", "", "", "", "",
        totals.totalPrincipalReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        totals.totalMarkupReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        totals.totalAmountReceived.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
        totals.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        "",
        totals.principalThisYear.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        totals.markupThisYear.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ]);
    }

    autoTable(doc, {
      startY: 35,
      head: [["Branch", "Product", "Financing Officer", "Customer No", "Customer Name", "Disbursed Date", "Financing Amount", "Balance Outstanding Last", "Total Install.", "No Install Paid", "No. Install. unpaid", "Last Repayment Date", "No of Late Days", "Total Principal Received", "Total Markup Received", "Total Amount Received", "Outstanding", "Status", "Principal This Year", "Markup This Year"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 5.5 },
      styles: { fontSize: 5.5, cellPadding: 1 },
      columnStyles: {
        6: { halign: "right" },
        7: { halign: "right" },
        8: { halign: "center" },
        9: { halign: "center" },
        10: { halign: "center" },
        12: { halign: "center" },
        13: { halign: "right" },
        14: { halign: "right" },
        15: { halign: "right" },
        16: { halign: "right" },
        17: { halign: "center" },
        18: { halign: "right" },
        19: { halign: "right" },
      },
    });

    if (statusSummary) {
      const finalY = (doc as any).lastAutoTable?.finalY || 190;
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`Loans by Status:  Active: ${statusSummary.active}    Closed: ${statusSummary.closed}    Total: ${statusSummary.active + statusSummary.closed}`, 14, Math.min(finalY + 6, 195));
    }

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 148, 200, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 200);
    }
    const dateStr = `${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}`;
    doc.save(`Active_Customer_Outstanding_${dateStr}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4">
      {data && data.length > 0 && (
        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleExportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel-outstanding">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button onClick={handleExportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf-outstanding">
            <FileText className="h-4 w-4" /> PDF
          </Button>
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
              <Select value={branchId} onValueChange={setBranchId} disabled={isLocked}>
                <SelectTrigger className="w-[200px]" data-testid="select-branch-outstanding">
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
              <Label>Funding Source</Label>
              <Select value={fundingSourceId} onValueChange={setFundingSourceId}>
                <SelectTrigger className="w-[200px]" data-testid="select-funding-source-outstanding">
                  <SelectValue placeholder="Select Funding Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {fundingSourcesData?.map((fs) => (
                    <SelectItem key={fs.id} value={fs.id}>{fs.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} data-testid="input-start-date-outstanding" />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} data-testid="input-end-date-outstanding" />
            </div>
            <Button onClick={fetchReport} disabled={isLoading} data-testid="button-generate-outstanding">
              {isLoading ? "Loading..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg">Active Customer Outstanding Summary</CardTitle>
              <span className="text-sm text-muted-foreground" data-testid="text-result-count-outstanding">
                {data.length} record{data.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 overflow-x-auto">
            {data.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-no-results-outstanding">No records found for the selected criteria.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                    <TableHead className="text-center w-10 text-primary-foreground font-semibold text-xs">#</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-xs">Branch</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-xs">Product</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-xs">Financing Officer</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-xs">Customer No</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-xs">Customer Name</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-xs">Disbursed Date</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold text-xs">Financing Amount</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold text-xs">Balance Outstanding Last</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold text-xs">Total Install.</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold text-xs">No Install Paid</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold text-xs">No. Install. unpaid</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-xs">Last Repayment Date</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold text-xs">No of Late Days</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold text-xs">Total Principal Received</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold text-xs">Total Markup Received</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold text-xs">Total Amount Received</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold text-xs">Outstanding</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold text-xs">Status</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold text-xs">Principal This Year</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold text-xs">Markup This Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} data-testid={`row-outstanding-${idx}`} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      <TableCell className="text-center font-mono text-xs">{idx + 1}</TableCell>
                      <TableCell className="text-xs">{row.branchName}</TableCell>
                      <TableCell className="text-xs">{row.productName}</TableCell>
                      <TableCell className="text-xs">{row.financeOfficerName}</TableCell>
                      <TableCell className="font-mono text-xs">{row.customerNo}</TableCell>
                      <TableCell className="text-xs">{row.customerName}</TableCell>
                      <TableCell className="text-xs">{row.disbursementDate ? formatDate(row.disbursementDate) : ""}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(row.financingAmount.toString())}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(row.balanceOutstanding.toFixed(2))}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{row.totalInstallments}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{row.installmentsPaid}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{row.installmentsUnpaid}</TableCell>
                      <TableCell className="text-xs">{row.lastRepaymentDate ? formatDate(row.lastRepaymentDate) : ""}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{row.lateDays}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(row.totalPrincipalReceived.toFixed(2))}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(row.totalMarkupReceived.toFixed(2))}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(row.totalAmountReceived.toFixed(2))}</TableCell>
                      <TableCell className="text-right font-mono text-xs" data-testid={`text-outstanding-${idx}`}>{formatCurrency(row.outstanding.toFixed(2))}</TableCell>
                      <TableCell className="text-center text-xs" data-testid={`text-status-${idx}`}>
                        <span className={row.outstanding > 0
                          ? "inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                          : "inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}>
                          {statusOf(row)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(row.principalThisYear.toFixed(2))}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(row.markupThisYear.toFixed(2))}</TableCell>
                    </TableRow>
                  ))}
                  {totals && (
                    <TableRow className="bg-muted font-bold border-t-2">
                      <TableCell colSpan={7} className="text-right text-xs font-bold">Total Balance</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(totals.financingAmount.toFixed(2))}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(totals.balanceOutstanding.toFixed(2))}</TableCell>
                      <TableCell colSpan={5}></TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(totals.totalPrincipalReceived.toFixed(2))}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(totals.totalMarkupReceived.toFixed(2))}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(totals.totalAmountReceived.toFixed(2))}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(totals.outstanding.toFixed(2))}</TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(totals.principalThisYear.toFixed(2))}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{formatCurrency(totals.markupThisYear.toFixed(2))}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
            {statusSummary && data.length > 0 && (
              <div className="mt-4 border-t pt-4 flex flex-wrap items-center gap-6" data-testid="status-summary">
                <span className="text-sm font-semibold">Loans by Status:</span>
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">Active</span>
                  <span className="text-sm font-mono font-semibold" data-testid="text-status-active-count">{statusSummary.active}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">Closed</span>
                  <span className="text-sm font-mono font-semibold" data-testid="text-status-closed-count">{statusSummary.closed}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Total:</span>
                  <span className="font-mono font-semibold" data-testid="text-status-total-count">{statusSummary.active + statusSummary.closed}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
