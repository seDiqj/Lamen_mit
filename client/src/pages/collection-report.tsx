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
import { FileSpreadsheet, FileText, Receipt, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type CollectionRow = {
  customerName: string;
  applicationId: string;
  installmentNumber: number;
  dueDate: string;
  paymentDate: string;
  principleAmount: number;
  marginAmount: number;
  totalAmount: number;
  paidAmount: number;
  lateDays: number;
  isPaid: boolean;
  productName: string;
  branchName: string;
  officerName: string;
  officerCode: string;
  phoneNumber: string;
};

type Branch = { id: string; name: string };
type Officer = { id: string; name: string; code: string };

type BranchGroup = {
  branchName: string;
  rows: CollectionRow[];
  subtotal: { principleAmount: number; marginAmount: number; totalAmount: number; paidAmount: number };
};

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
  const [data, setData] = useState<CollectionRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (error) {
      console.error("Failed to fetch collection report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBranchName = branchId === "all" ? "All Branches" : branchesData?.find(b => b.id === branchId)?.name || "";
  const selectedOfficerName = officerId === "all" ? "All Officers" : officersData?.find(o => o.id === officerId)?.name || "";

  const { branchGroups, grandTotal } = useMemo(() => {
    if (!data || data.length === 0) return { branchGroups: [], grandTotal: { principleAmount: 0, marginAmount: 0, totalAmount: 0, paidAmount: 0 } };

    const sorted = [...data].sort((a, b) => (a.branchName || "").localeCompare(b.branchName || ""));
    const groupMap = new Map<string, CollectionRow[]>();
    for (const row of sorted) {
      const key = row.branchName || "Unknown";
      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key)!.push(row);
    }

    const groups: BranchGroup[] = [];
    const gt = { principleAmount: 0, marginAmount: 0, totalAmount: 0, paidAmount: 0 };

    for (const [branchName, rows] of Array.from(groupMap.entries())) {
      const subtotal = { principleAmount: 0, marginAmount: 0, totalAmount: 0, paidAmount: 0 };
      for (const r of rows) {
        subtotal.principleAmount += r.principleAmount;
        subtotal.marginAmount += r.marginAmount;
        subtotal.totalAmount += r.totalAmount;
        subtotal.paidAmount += r.paidAmount;
      }
      gt.principleAmount += subtotal.principleAmount;
      gt.marginAmount += subtotal.marginAmount;
      gt.totalAmount += subtotal.totalAmount;
      gt.paidAmount += subtotal.paidAmount;
      groups.push({ branchName, rows, subtotal });
    }

    return { branchGroups: groups, grandTotal: gt };
  }, [data]);

  const handleExportExcel = () => {
    if (!data) return;

    const rows: Record<string, string | number>[] = [];
    let serial = 1;
    for (const group of branchGroups) {
      for (const row of group.rows) {
        rows.push({
          "#": serial++,
          "Customer Name": row.customerName,
          "Application ID": row.applicationId,
          "Inst #": row.installmentNumber,
          "Due Date": row.dueDate ? formatDate(row.dueDate) : "",
          "Payment Date": row.paymentDate ? formatDate(row.paymentDate) : "",
          "Product": row.productName,
          "Officer": row.officerName,
          "Branch": row.branchName,
          "Principle (AFN)": row.principleAmount,
          "Margin (AFN)": row.marginAmount,
          "Total Due (AFN)": row.totalAmount,
          "Paid (AFN)": row.paidAmount,
          "Late Days": row.lateDays,
          "Status": row.isPaid ? "Fully Paid" : "Partial",
          "Phone": row.phoneNumber,
        });
      }
      rows.push({
        "#": "",
        "Customer Name": "",
        "Application ID": "",
        "Inst #": "",
        "Due Date": "",
        "Payment Date": "",
        "Product": "",
        "Officer": "",
        "Branch": `Subtotal - ${group.branchName}`,
        "Principle (AFN)": group.subtotal.principleAmount,
        "Margin (AFN)": group.subtotal.marginAmount,
        "Total Due (AFN)": group.subtotal.totalAmount,
        "Paid (AFN)": group.subtotal.paidAmount,
        "Late Days": "",
        "Status": "",
        "Phone": "",
      });
    }
    rows.push({
      "#": "",
      "Customer Name": "",
      "Application ID": "",
      "Inst #": "",
      "Due Date": "",
      "Payment Date": "",
      "Product": "",
      "Officer": "",
      "Branch": "Grand Total",
      "Principle (AFN)": grandTotal.principleAmount,
      "Margin (AFN)": grandTotal.marginAmount,
      "Total Due (AFN)": grandTotal.totalAmount,
      "Paid (AFN)": grandTotal.paidAmount,
      "Late Days": "",
      "Status": "",
      "Phone": "",
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 6 }, { wch: 22 }, { wch: 16 }, { wch: 7 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 18 }, { wch: 15 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
      { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 14 },
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
    for (const group of branchGroups) {
      for (const row of group.rows) {
        tableData.push([
          serial++,
          row.customerName,
          row.applicationId,
          row.installmentNumber,
          row.dueDate ? formatDate(row.dueDate) : "",
          row.paymentDate ? formatDate(row.paymentDate) : "",
          row.productName,
          row.officerName,
          row.branchName,
          row.principleAmount.toLocaleString(),
          row.marginAmount.toLocaleString(),
          row.totalAmount.toLocaleString(),
          row.paidAmount.toLocaleString(),
          row.lateDays,
          row.isPaid ? "Paid" : "Partial",
        ]);
      }
      tableData.push([
        "", "", "", "", "", "", "", "", `Subtotal - ${group.branchName}`,
        group.subtotal.principleAmount.toLocaleString(),
        group.subtotal.marginAmount.toLocaleString(),
        group.subtotal.totalAmount.toLocaleString(),
        group.subtotal.paidAmount.toLocaleString(),
        "", "",
      ]);
    }
    tableData.push([
      "", "", "", "", "", "", "", "", "Grand Total",
      grandTotal.principleAmount.toLocaleString(),
      grandTotal.marginAmount.toLocaleString(),
      grandTotal.totalAmount.toLocaleString(),
      grandTotal.paidAmount.toLocaleString(),
      "", "",
    ]);

    autoTable(doc, {
      startY: 38,
      head: [["#", "Customer", "App ID", "Inst#", "Due Date", "Paid Date", "Product", "Officer", "Branch", "Principle", "Margin", "Total Due", "Paid", "Late", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 6 },
      styles: { fontSize: 6, cellPadding: 1.5 },
      columnStyles: {
        0: { halign: "center", cellWidth: 8 },
        3: { halign: "center", cellWidth: 10 },
        9: { halign: "right" },
        10: { halign: "right" },
        11: { halign: "right" },
        12: { halign: "right" },
        13: { halign: "center" },
        14: { halign: "center" },
      },
      didParseCell: (hookData: any) => {
        if (hookData.section === "body") {
          const rowData = hookData.row.raw as any[];
          if (rowData && typeof rowData[8] === "string" && (rowData[8].startsWith("Subtotal") || rowData[8] === "Grand Total")) {
            hookData.cell.styles.fontStyle = "bold";
            hookData.cell.styles.fillColor = rowData[8] === "Grand Total" ? [34, 87, 122] : [220, 230, 240];
            if (rowData[8] === "Grand Total") {
              hookData.cell.styles.textColor = [255, 255, 255];
            }
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
            <p className="text-muted-foreground text-sm">View payment collections by date range, branch and officer</p>
          </div>
        </div>
        {data && data.length > 0 && (
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
        <CardContent>
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

      {data && data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Collections</p>
              <p className="text-2xl font-bold mt-1" data-testid="text-total-collections">{data.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Amount Due</p>
              <p className="text-2xl font-bold mt-1" data-testid="text-total-due">{formatCurrency(grandTotal.totalAmount)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600" data-testid="text-total-collected">{formatCurrency(grandTotal.paidAmount)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Collection Rate</p>
              <p className="text-2xl font-bold mt-1" data-testid="text-collection-rate">
                {grandTotal.totalAmount > 0 ? `${Math.round((grandTotal.paidAmount / grandTotal.totalAmount) * 100)}%` : "0%"}
              </p>
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
                {data.length} record{data.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 overflow-x-auto">
            {data.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-no-results">No collections found for the selected criteria.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                    <TableHead className="text-center w-12 text-primary-foreground font-semibold">#</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Customer Name</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Application ID</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold">Inst #</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Due Date</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Payment Date</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Product</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Officer</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Branch</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Principle</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Margin</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Total Due</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Paid</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold">Late Days</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    let serial = 1;
                    return branchGroups.map((group) => (
                      <>{group.rows.map((row, idx) => (
                          <TableRow key={`${group.branchName}-${idx}`} data-testid={`row-collection-${serial - 1 + idx}`} className={(serial - 1 + idx) % 2 === 0 ? "bg-muted/30" : ""}>
                            <TableCell className="text-center font-mono">{serial + idx}</TableCell>
                            <TableCell>{row.customerName}</TableCell>
                            <TableCell className="font-mono">{row.applicationId}</TableCell>
                            <TableCell className="text-center">{row.installmentNumber}</TableCell>
                            <TableCell>{row.dueDate ? formatDate(row.dueDate) : ""}</TableCell>
                            <TableCell>{row.paymentDate ? formatDate(row.paymentDate) : ""}</TableCell>
                            <TableCell>{row.productName}</TableCell>
                            <TableCell>{row.officerName}</TableCell>
                            <TableCell>{row.branchName}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(row.principleAmount)}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(row.marginAmount)}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(row.totalAmount)}</TableCell>
                            <TableCell className="text-right font-mono font-semibold text-emerald-600">{formatCurrency(row.paidAmount)}</TableCell>
                            <TableCell className={`text-center font-mono ${row.lateDays > 0 ? "text-red-600 font-semibold" : ""}`}>{row.lateDays}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant={row.isPaid ? "default" : "secondary"} className={row.isPaid ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}>
                                {row.isPaid ? "Paid" : "Partial"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {(() => { serial += group.rows.length; return null; })()}
                        <TableRow className="bg-blue-50 dark:bg-blue-950/30 font-semibold border-t-2 border-b-2 border-blue-200 dark:border-blue-800">
                          <TableCell colSpan={9} className="text-right font-bold">Subtotal - {group.branchName}</TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.principleAmount)}</TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.marginAmount)}</TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.totalAmount)}</TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.paidAmount)}</TableCell>
                          <TableCell colSpan={2}></TableCell>
                        </TableRow>
                      </>
                    ));
                  })()}
                  <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                    <TableCell colSpan={9} className="text-right font-bold text-primary-foreground text-base">Grand Total</TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.principleAmount)}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.marginAmount)}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.totalAmount)}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.paidAmount)}</TableCell>
                    <TableCell colSpan={2} className="text-primary-foreground"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
