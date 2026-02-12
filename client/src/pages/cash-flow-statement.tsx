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
  operating: FlowItem[];
  investing: FlowItem[];
  financing: FlowItem[];
  totalOperating: number;
  totalInvesting: number;
  totalFinancing: number;
  netChange: number;
  cashOpeningBalance: number;
  cashClosingBalance: number;
  period: { startDate: string; endDate: string };
};

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

    const exportData: any[] = [];

    exportData.push({ "Category": "OPERATING ACTIVITIES", "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    data.operating.forEach(item => {
      exportData.push({
        "Category": "",
        "Account Code": item.accountCode,
        "Account Name": item.accountName,
        "Amount (AFN)": item.amount,
      });
    });
    exportData.push({ "Category": "", "Account Code": "", "Account Name": "Net Cash from Operating Activities", "Amount (AFN)": data.totalOperating });
    exportData.push({ "Category": "", "Account Code": "", "Account Name": "", "Amount (AFN)": "" });

    exportData.push({ "Category": "INVESTING ACTIVITIES", "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    data.investing.forEach(item => {
      exportData.push({
        "Category": "",
        "Account Code": item.accountCode,
        "Account Name": item.accountName,
        "Amount (AFN)": item.amount,
      });
    });
    exportData.push({ "Category": "", "Account Code": "", "Account Name": "Net Cash from Investing Activities", "Amount (AFN)": data.totalInvesting });
    exportData.push({ "Category": "", "Account Code": "", "Account Name": "", "Amount (AFN)": "" });

    exportData.push({ "Category": "FINANCING ACTIVITIES", "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    data.financing.forEach(item => {
      exportData.push({
        "Category": "",
        "Account Code": item.accountCode,
        "Account Name": item.accountName,
        "Amount (AFN)": item.amount,
      });
    });
    exportData.push({ "Category": "", "Account Code": "", "Account Name": "Net Cash from Financing Activities", "Amount (AFN)": data.totalFinancing });
    exportData.push({ "Category": "", "Account Code": "", "Account Name": "", "Amount (AFN)": "" });

    exportData.push({ "Category": "SUMMARY", "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    exportData.push({ "Category": "", "Account Code": "", "Account Name": "Opening Cash Balance", "Amount (AFN)": data.cashOpeningBalance });
    exportData.push({ "Category": "", "Account Code": "", "Account Name": "Net Change in Cash", "Amount (AFN)": data.netChange });
    exportData.push({ "Category": "", "Account Code": "", "Account Name": "Closing Cash Balance", "Amount (AFN)": data.cashClosingBalance });

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 40 }, { wch: 20 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cash Flow Statement");

    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    XLSX.writeFile(wb, `Cash_Flow_Statement_${startStr}_to_${endStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Lamen Microfinance Institution", 105, 15, { align: "center" });

    doc.setFontSize(14);
    doc.text("Statement of Cash Flows", 105, 23, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Period: ${formatDate(startDate)} to ${formatDate(endDate)}`, 105, 31, { align: "center" });

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 37, { align: "center" });

    const tableData: any[] = [];

    tableData.push([
      { content: "OPERATING ACTIVITIES", colSpan: 3, styles: { fontStyle: "bold", fillColor: [34, 139, 34], textColor: [255, 255, 255] } },
    ]);
    data.operating.forEach(item => {
      tableData.push([
        `${item.accountCode} - ${item.accountName}`,
        "",
        { content: formatCurrency(item.amount.toString()).replace("AFN", "").trim(), styles: { halign: "right" } },
      ]);
    });
    if (data.operating.length === 0) {
      tableData.push(["No operating activities", "", ""]);
    }
    tableData.push([
      { content: "Net Cash from Operating Activities", styles: { fontStyle: "bold" } },
      "",
      { content: formatCurrency(data.totalOperating.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", halign: "right" } },
    ]);

    tableData.push([{ content: "", colSpan: 3, styles: { cellPadding: 1 } }]);

    tableData.push([
      { content: "INVESTING ACTIVITIES", colSpan: 3, styles: { fontStyle: "bold", fillColor: [30, 100, 180], textColor: [255, 255, 255] } },
    ]);
    data.investing.forEach(item => {
      tableData.push([
        `${item.accountCode} - ${item.accountName}`,
        "",
        { content: formatCurrency(item.amount.toString()).replace("AFN", "").trim(), styles: { halign: "right" } },
      ]);
    });
    if (data.investing.length === 0) {
      tableData.push(["No investing activities", "", ""]);
    }
    tableData.push([
      { content: "Net Cash from Investing Activities", styles: { fontStyle: "bold" } },
      "",
      { content: formatCurrency(data.totalInvesting.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", halign: "right" } },
    ]);

    tableData.push([{ content: "", colSpan: 3, styles: { cellPadding: 1 } }]);

    tableData.push([
      { content: "FINANCING ACTIVITIES", colSpan: 3, styles: { fontStyle: "bold", fillColor: [139, 90, 43], textColor: [255, 255, 255] } },
    ]);
    data.financing.forEach(item => {
      tableData.push([
        `${item.accountCode} - ${item.accountName}`,
        "",
        { content: formatCurrency(item.amount.toString()).replace("AFN", "").trim(), styles: { halign: "right" } },
      ]);
    });
    if (data.financing.length === 0) {
      tableData.push(["No financing activities", "", ""]);
    }
    tableData.push([
      { content: "Net Cash from Financing Activities", styles: { fontStyle: "bold" } },
      "",
      { content: formatCurrency(data.totalFinancing.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", halign: "right" } },
    ]);

    tableData.push([{ content: "", colSpan: 3, styles: { cellPadding: 1 } }]);

    tableData.push([
      { content: "SUMMARY", colSpan: 3, styles: { fontStyle: "bold", fillColor: [80, 80, 80], textColor: [255, 255, 255] } },
    ]);
    tableData.push([
      "Opening Cash Balance",
      "",
      { content: formatCurrency(data.cashOpeningBalance.toString()).replace("AFN", "").trim(), styles: { halign: "right" } },
    ]);
    tableData.push([
      { content: "Net Change in Cash", styles: { fontStyle: "bold" } },
      "",
      { content: formatCurrency(data.netChange.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", halign: "right" } },
    ]);
    tableData.push([
      { content: "Closing Cash Balance", styles: { fontStyle: "bold" } },
      "",
      { content: formatCurrency(data.cashClosingBalance.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", halign: "right", fillColor: [240, 240, 240] } },
    ]);

    autoTable(doc, {
      startY: 43,
      body: tableData,
      theme: "grid",
      columnStyles: {
        0: { halign: "left", cellWidth: 100 },
        1: { halign: "center", cellWidth: 30 },
        2: { halign: "right", cellWidth: 40 },
      },
      styles: { fontSize: 9, cellPadding: 2.5 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 287);
    }

    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    doc.save(`Cash_Flow_Statement_${startStr}_to_${endStr}.pdf`);
  };

  const renderSection = (title: string, items: FlowItem[], total: number, colorClass: string) => (
    <>
      <TableRow className={colorClass}>
        <TableCell colSpan={3} className="font-bold text-sm">{title}</TableCell>
      </TableRow>
      {items.length > 0 ? items.map((item, idx) => (
        <TableRow key={idx}>
          <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{item.accountCode}</TableCell>
          <TableCell>{item.accountName}</TableCell>
          <TableCell className={`text-right font-mono ${item.amount < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
            {formatCurrency(item.amount.toString())}
          </TableCell>
        </TableRow>
      )) : (
        <TableRow>
          <TableCell colSpan={3} className="text-center text-muted-foreground text-sm py-3">
            No items in this category
          </TableCell>
        </TableRow>
      )}
      <TableRow className="border-t-2 bg-muted/20">
        <TableCell colSpan={2} className="font-semibold text-sm">
          Net Cash from {title.replace("ACTIVITIES", "").trim()}
        </TableCell>
        <TableCell className={`text-right font-mono font-bold ${total < 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
          {formatCurrency(total.toString())}
        </TableCell>
      </TableRow>
    </>
  );

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
                <p className="text-muted-foreground text-sm mt-1">
                  Period: {formatDate(startDate)} to {formatDate(endDate)}
                </p>
              </div>
              <div className="flex gap-6 text-right">
                <div>
                  <p className="text-sm text-muted-foreground">Opening Cash</p>
                  <p className="text-lg font-bold" data-testid="text-opening-cash">{formatCurrency(data.cashOpeningBalance.toString())}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Closing Cash</p>
                  <p className="text-lg font-bold" data-testid="text-closing-cash">{formatCurrency(data.cashClosingBalance.toString())}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableBody>
                {renderSection("OPERATING ACTIVITIES", data.operating, data.totalOperating, "bg-green-50 dark:bg-green-900/20")}
                <TableRow><TableCell colSpan={3} className="py-1"></TableCell></TableRow>
                {renderSection("INVESTING ACTIVITIES", data.investing, data.totalInvesting, "bg-blue-50 dark:bg-blue-900/20")}
                <TableRow><TableCell colSpan={3} className="py-1"></TableCell></TableRow>
                {renderSection("FINANCING ACTIVITIES", data.financing, data.totalFinancing, "bg-amber-50 dark:bg-amber-900/20")}
                <TableRow><TableCell colSpan={3} className="py-1"></TableCell></TableRow>

                <TableRow className="bg-muted/40 border-t-2">
                  <TableCell colSpan={2} className="font-bold text-sm">Opening Cash Balance</TableCell>
                  <TableCell className="text-right font-mono font-bold">{formatCurrency(data.cashOpeningBalance.toString())}</TableCell>
                </TableRow>
                <TableRow className="bg-muted/40">
                  <TableCell colSpan={2} className="font-bold text-sm">Net Change in Cash</TableCell>
                  <TableCell className={`text-right font-mono font-bold ${data.netChange < 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
                    {formatCurrency(data.netChange.toString())}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/60 border-t-2">
                  <TableCell colSpan={2} className="font-bold text-base">Closing Cash Balance</TableCell>
                  <TableCell className="text-right font-mono font-bold text-base">{formatCurrency(data.cashClosingBalance.toString())}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
