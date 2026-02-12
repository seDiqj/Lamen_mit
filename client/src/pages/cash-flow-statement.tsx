import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownUp, FileSpreadsheet, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type FlowItem = {
  accountCode: string;
  accountName: string;
  amount: number;
};

type CashFlowData = {
  profitForYear: number;
  adjustments: FlowItem[];
  totalAdjustments: number;
  totalOperating: number;
  investing: FlowItem[];
  financing: FlowItem[];
  totalInvesting: number;
  totalFinancing: number;
  netChange: number;
  cashOpeningBalance: number;
  cashClosingBalance: number;
  period: { startDate: string; endDate: string };
};

function formatAmount(val: number): string {
  if (Math.abs(val) < 0.005) return "0.00";
  const formatted = formatCurrency(val.toString()).replace("AFN", "").trim();
  return formatted;
}

function fullName(item: FlowItem): string {
  return `${item.accountCode} ${item.accountName}`;
}

export default function CashFlowStatement() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(0, 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<CashFlowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports/cash-flow-statement?startDate=${startDate}&endDate=${endDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch cash flow statement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!data) return;

    const rows: (string | number)[][] = [];

    rows.push(["Statement of Cash Flows", ""]);
    rows.push(["Lamen Microfinance Institution (LMI)", ""]);
    rows.push([`${formatDate(startDate)}-${formatDate(endDate)}`, ""]);
    rows.push(["", ""]);
    rows.push(["Full name", "Total"]);

    rows.push(["Cash flows from operating activities", ""]);
    rows.push(["Profit for the year", formatNum(data.profitForYear)]);
    rows.push(["Adjustments for non-cash income and expenses:", ""]);
    data.adjustments.forEach(item => {
      rows.push([fullName(item), formatNum(item.amount)]);
    });
    rows.push(["Total for Adjustments for non-cash income and expenses:", formatNum(data.totalAdjustments)]);
    rows.push(["Net cash from operating activities", formatNum(data.totalOperating)]);

    rows.push(["Cash flows from investing activities", ""]);
    data.investing.forEach(item => {
      rows.push([fullName(item), formatNum(item.amount)]);
    });
    rows.push(["Net cash used in investing activities", formatNum(data.totalInvesting)]);

    rows.push(["Cash flows from financing activities", ""]);
    data.financing.forEach(item => {
      rows.push([fullName(item), formatNum(item.amount)]);
    });
    rows.push(["Net cash used in financing activities", formatNum(data.totalFinancing)]);

    rows.push(["NET INCREASE (DECREASE) IN CASH AND CASH EQUIVALENTS", formatNum(data.netChange)]);
    rows.push(["Cash and cash equivalents at beginning of year", formatNum(data.cashOpeningBalance)]);
    rows.push(["CASH AND CASH EQUIVALENTS AT END OF YEAR", formatNum(data.cashClosingBalance)]);

    rows.push(["", ""]);
    rows.push(["", ""]);
    rows.push(["", ""]);
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
    rows.push([` ${days[now.getDay()]}, ${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()} ${timeStr} GMTZ`, ""]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 70 }, { wch: 20 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cash Flow Statement");

    XLSX.writeFile(wb, `Statement_of_Cash_Flows_${Date.now()}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Statement of Cash Flows", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text("Lamen Microfinance Institution (LMI)", 105, 23, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${formatDate(startDate)} - ${formatDate(endDate)}`, 105, 31, { align: "center" });

    const tableData: any[] = [];

    tableData.push([
      { content: "Cash flows from operating activities", styles: { fontStyle: "bold", fillColor: [240, 248, 240] } },
      { content: "", styles: { fillColor: [240, 248, 240] } },
    ]);
    tableData.push([
      { content: "Profit for the year", styles: { fontStyle: "bold" } },
      { content: formatAmount(data.profitForYear), styles: { halign: "right", fontStyle: "bold" } },
    ]);
    tableData.push([
      { content: "Adjustments for non-cash income and expenses:", styles: { fontStyle: "italic" } },
      "",
    ]);
    data.adjustments.forEach(item => {
      tableData.push([
        `  ${fullName(item)}`,
        { content: formatAmount(item.amount), styles: { halign: "right" } },
      ]);
    });
    tableData.push([
      { content: "Total for Adjustments for non-cash income and expenses:", styles: { fontStyle: "bold" } },
      { content: formatAmount(data.totalAdjustments), styles: { halign: "right", fontStyle: "bold" } },
    ]);
    tableData.push([
      { content: "Net cash from operating activities", styles: { fontStyle: "bold" } },
      { content: formatAmount(data.totalOperating), styles: { halign: "right", fontStyle: "bold" } },
    ]);

    tableData.push([{ content: "", colSpan: 2, styles: { cellPadding: 1 } }]);

    tableData.push([
      { content: "Cash flows from investing activities", styles: { fontStyle: "bold", fillColor: [240, 240, 255] } },
      { content: "", styles: { fillColor: [240, 240, 255] } },
    ]);
    data.investing.forEach(item => {
      tableData.push([
        `  ${fullName(item)}`,
        { content: formatAmount(item.amount), styles: { halign: "right" } },
      ]);
    });
    tableData.push([
      { content: "Net cash used in investing activities", styles: { fontStyle: "bold" } },
      { content: formatAmount(data.totalInvesting), styles: { halign: "right", fontStyle: "bold" } },
    ]);

    tableData.push([{ content: "", colSpan: 2, styles: { cellPadding: 1 } }]);

    tableData.push([
      { content: "Cash flows from financing activities", styles: { fontStyle: "bold", fillColor: [255, 248, 240] } },
      { content: "", styles: { fillColor: [255, 248, 240] } },
    ]);
    data.financing.forEach(item => {
      tableData.push([
        `  ${fullName(item)}`,
        { content: formatAmount(item.amount), styles: { halign: "right" } },
      ]);
    });
    tableData.push([
      { content: "Net cash used in financing activities", styles: { fontStyle: "bold" } },
      { content: formatAmount(data.totalFinancing), styles: { halign: "right", fontStyle: "bold" } },
    ]);

    tableData.push([{ content: "", colSpan: 2, styles: { cellPadding: 1 } }]);

    tableData.push([
      { content: "NET INCREASE (DECREASE) IN CASH AND CASH EQUIVALENTS", styles: { fontStyle: "bold" } },
      { content: formatAmount(data.netChange), styles: { halign: "right", fontStyle: "bold" } },
    ]);
    tableData.push([
      "Cash and cash equivalents at beginning of year",
      { content: formatAmount(data.cashOpeningBalance), styles: { halign: "right" } },
    ]);
    tableData.push([
      { content: "CASH AND CASH EQUIVALENTS AT END OF YEAR", styles: { fontStyle: "bold", fillColor: [240, 240, 240] } },
      { content: formatAmount(data.cashClosingBalance), styles: { halign: "right", fontStyle: "bold", fillColor: [240, 240, 240] } },
    ]);

    autoTable(doc, {
      startY: 37,
      head: [["Full name", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
      columnStyles: {
        0: { halign: "left", cellWidth: 130 },
        1: { halign: "right", cellWidth: 40 },
      },
      styles: { fontSize: 8, cellPadding: 2 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 287);
    }

    doc.save(`Statement_of_Cash_Flows_${Date.now()}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <ArrowDownUp className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Statement of Cash Flows</h1>
            <p className="text-muted-foreground text-sm">Cash inflows and outflows by activity type</p>
          </div>
        </div>
        {data && (
          <div className="flex items-center gap-2">
            <Button onClick={handleExportExcel} className="gap-2 bg-green-600 hover:bg-green-700 text-white" data-testid="button-export-excel">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button onClick={handleExportPDF} className="gap-2 bg-red-600 hover:bg-red-700 text-white" data-testid="button-export-pdf">
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Select Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Quick:</span>
              {[
                { label: "1D", days: 1 },
                { label: "2D", days: 2 },
                { label: "1W", days: 7 },
                { label: "2W", days: 14 },
                { label: "1M", months: 1 },
                { label: "3M", months: 3 },
                { label: "6M", months: 6 },
                { label: "1Y", months: 12 },
                { label: "All", all: true },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  data-testid={`button-quick-${opt.label}`}
                  className="px-3 py-1 text-xs font-medium rounded-full border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700 dark:hover:bg-sky-900/50 transition-colors"
                  onClick={() => {
                    const end = new Date();
                    const endStr = end.toISOString().split("T")[0];
                    setEndDate(endStr);
                    if ((opt as any).all) {
                      setStartDate("2024-01-01");
                    } else {
                      const start = new Date();
                      if ((opt as any).months) start.setMonth(start.getMonth() - (opt as any).months);
                      if ((opt as any).days) start.setDate(start.getDate() - (opt as any).days);
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
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} data-testid="input-start-date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} data-testid="input-end-date" />
              </div>
              <Button onClick={fetchReport} disabled={isLoading} data-testid="button-generate">
                {isLoading ? "Loading..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card className="print:shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-xl">Statement of Cash Flows</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Lamen Microfinance Institution (LMI)</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {formatDate(startDate)} - {formatDate(endDate)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableBody>
                <TableRow className="bg-green-50 dark:bg-green-900/20">
                  <TableCell colSpan={2} className="font-bold text-sm">Cash flows from operating activities</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6 font-semibold">Profit for the year</TableCell>
                  <TableCell className={`text-right font-mono font-bold ${data.profitForYear < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                    {formatAmount(data.profitForYear)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="pl-6 text-sm font-medium text-muted-foreground italic">
                    Adjustments for non-cash income and expenses:
                  </TableCell>
                </TableRow>
                {data.adjustments.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="pl-10 text-sm">{fullName(item)}</TableCell>
                    <TableCell className={`text-right font-mono text-sm ${item.amount < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                      {formatAmount(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t">
                  <TableCell className="pl-6 font-semibold text-sm">Total for Adjustments for non-cash income and expenses:</TableCell>
                  <TableCell className={`text-right font-mono font-bold ${data.totalAdjustments < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                    {formatAmount(data.totalAdjustments)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t-2 bg-muted/20">
                  <TableCell className="font-bold text-sm">Net cash from operating activities</TableCell>
                  <TableCell className={`text-right font-mono font-bold ${data.totalOperating < 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                    {formatAmount(data.totalOperating)}
                  </TableCell>
                </TableRow>

                <TableRow><TableCell colSpan={2} className="py-1"></TableCell></TableRow>

                <TableRow className="bg-blue-50 dark:bg-blue-900/20">
                  <TableCell colSpan={2} className="font-bold text-sm">Cash flows from investing activities</TableCell>
                </TableRow>
                {data.investing.length > 0 ? data.investing.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="pl-6 text-sm">{fullName(item)}</TableCell>
                    <TableCell className={`text-right font-mono text-sm ${item.amount < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                      {formatAmount(item.amount)}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground text-sm py-3">
                      No items in this category
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="border-t-2 bg-muted/20">
                  <TableCell className="font-bold text-sm">Net cash used in investing activities</TableCell>
                  <TableCell className={`text-right font-mono font-bold ${data.totalInvesting < 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                    {formatAmount(data.totalInvesting)}
                  </TableCell>
                </TableRow>

                <TableRow><TableCell colSpan={2} className="py-1"></TableCell></TableRow>

                <TableRow className="bg-amber-50 dark:bg-amber-900/20">
                  <TableCell colSpan={2} className="font-bold text-sm">Cash flows from financing activities</TableCell>
                </TableRow>
                {data.financing.length > 0 ? data.financing.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="pl-6 text-sm">{fullName(item)}</TableCell>
                    <TableCell className={`text-right font-mono text-sm ${item.amount < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                      {formatAmount(item.amount)}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground text-sm py-3">
                      No items in this category
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="border-t-2 bg-muted/20">
                  <TableCell className="font-bold text-sm">Net cash used in financing activities</TableCell>
                  <TableCell className={`text-right font-mono font-bold ${data.totalFinancing < 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                    {formatAmount(data.totalFinancing)}
                  </TableCell>
                </TableRow>

                <TableRow><TableCell colSpan={2} className="py-1"></TableCell></TableRow>

                <TableRow className="bg-muted/40 border-t-2">
                  <TableCell className="font-bold text-sm">NET INCREASE (DECREASE) IN CASH AND CASH EQUIVALENTS</TableCell>
                  <TableCell className={`text-right font-mono font-bold ${data.netChange < 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                    {formatAmount(data.netChange)}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/40">
                  <TableCell className="font-semibold text-sm">Cash and cash equivalents at beginning of year</TableCell>
                  <TableCell className="text-right font-mono font-bold">{formatAmount(data.cashOpeningBalance)}</TableCell>
                </TableRow>
                <TableRow className="bg-muted/60 border-t-2">
                  <TableCell className="font-bold text-base">CASH AND CASH EQUIVALENTS AT END OF YEAR</TableCell>
                  <TableCell className="text-right font-mono font-bold text-base">{formatAmount(data.cashClosingBalance)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function formatNum(val: number): string {
  if (Math.abs(val) < 0.005) return "0.00";
  const negative = val < 0;
  const abs = Math.abs(val);
  const parts = abs.toFixed(2).split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const result = `${intPart}.${parts[1]}`;
  return negative ? `-${result}` : result;
}
