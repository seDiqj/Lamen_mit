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
import { TrendingUp, TrendingDown, FileSpreadsheet, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type AccountItem = {
  accountCode: string;
  accountName: string;
  amount: number;
};

type IncomeStatementData = {
  income: AccountItem[];
  expenses: AccountItem[];
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  period: { startDate: string; endDate: string };
};

export default function IncomeStatement() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(0, 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<IncomeStatementData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports/income-statement?startDate=${startDate}&endDate=${endDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch income statement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!data) return;

    const exportData: any[] = [];
    
    exportData.push({ "Account Code": "", "Account Name": "INCOME", "Amount (AFN)": "" });
    data.income.forEach(item => {
      exportData.push({
        "Account Code": item.accountCode,
        "Account Name": item.accountName,
        "Amount (AFN)": item.amount,
      });
    });
    exportData.push({ "Account Code": "", "Account Name": "Total Income", "Amount (AFN)": data.totalIncome });
    
    exportData.push({ "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    exportData.push({ "Account Code": "", "Account Name": "EXPENSES", "Amount (AFN)": "" });
    data.expenses.forEach(item => {
      exportData.push({
        "Account Code": item.accountCode,
        "Account Name": item.accountName,
        "Amount (AFN)": item.amount,
      });
    });
    exportData.push({ "Account Code": "", "Account Name": "Total Expenses", "Amount (AFN)": data.totalExpenses });
    
    exportData.push({ "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    exportData.push({ 
      "Account Code": "", 
      "Account Name": data.netIncome >= 0 ? "NET INCOME" : "NET LOSS", 
      "Amount (AFN)": Math.abs(data.netIncome) 
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [{ wch: 15 }, { wch: 45 }, { wch: 20 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Income Statement");

    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    XLSX.writeFile(wb, `Income_Statement_${startStr}_to_${endStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Lamen Microfinance Institution", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.text("Income Statement", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Period: ${formatDate(startDate)} to ${formatDate(endDate)}`, 105, 38, { align: "center" });

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 44, { align: "center" });

    const tableData: any[] = [];
    
    tableData.push([{ content: "INCOME", colSpan: 3, styles: { fontStyle: "bold", fillColor: [220, 252, 231] } }]);
    data.income.forEach(item => {
      tableData.push([
        item.accountCode,
        item.accountName,
        formatCurrency(item.amount.toString()).replace("AFN", "").trim()
      ]);
    });
    tableData.push([
      "",
      { content: "Total Income", styles: { fontStyle: "bold" } },
      { content: formatCurrency(data.totalIncome.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", fillColor: [220, 252, 231] } }
    ]);

    tableData.push(["", "", ""]);
    tableData.push([{ content: "EXPENSES", colSpan: 3, styles: { fontStyle: "bold", fillColor: [254, 243, 199] } }]);
    data.expenses.forEach(item => {
      tableData.push([
        item.accountCode,
        item.accountName,
        formatCurrency(item.amount.toString()).replace("AFN", "").trim()
      ]);
    });
    tableData.push([
      "",
      { content: "Total Expenses", styles: { fontStyle: "bold" } },
      { content: formatCurrency(data.totalExpenses.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", fillColor: [254, 243, 199] } }
    ]);

    tableData.push(["", "", ""]);
    const netLabel = data.netIncome >= 0 ? "NET INCOME" : "NET LOSS";
    const netColor = data.netIncome >= 0 ? [220, 252, 231] : [254, 202, 202];
    tableData.push([
      "",
      { content: netLabel, styles: { fontStyle: "bold" } },
      { content: formatCurrency(Math.abs(data.netIncome).toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", fillColor: netColor } }
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Account Code", "Account Name", "Amount (AFN)"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 139, 34], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
      columnStyles: {
        0: { halign: "left", cellWidth: 30 },
        1: { halign: "left", cellWidth: 100 },
        2: { halign: "right", cellWidth: 40 },
      },
      styles: { fontSize: 9, cellPadding: 2 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 290);
    }

    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    doc.save(`Income_Statement_${startStr}_to_${endStr}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Income Statement</h1>
            <p className="text-muted-foreground text-sm">Profit and Loss report</p>
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
          <div className="flex items-end gap-4">
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
        </CardContent>
      </Card>

      {data && (
        <Card className="print:shadow-none">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Income Statement</CardTitle>
            <p className="text-muted-foreground text-sm">
              For the period {formatDate(startDate)} to {formatDate(endDate)}
            </p>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div>
              <h3 className="font-semibold text-green-600 flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4" /> Income
              </h3>
              <Table>
                <TableBody>
                  {data.income.length > 0 ? data.income.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono w-28">{item.accountCode}</TableCell>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell className="text-right font-mono w-40">{formatCurrency(item.amount.toString())}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">No income recorded</TableCell>
                    </TableRow>
                  )}
                  <TableRow className="bg-green-50 dark:bg-green-950/30 font-semibold">
                    <TableCell colSpan={2}>Total Income</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(data.totalIncome.toString())}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="font-semibold text-orange-600 flex items-center gap-2 mb-3">
                <TrendingDown className="h-4 w-4" /> Expenses
              </h3>
              <Table>
                <TableBody>
                  {data.expenses.length > 0 ? data.expenses.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono w-28">{item.accountCode}</TableCell>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell className="text-right font-mono w-40">{formatCurrency(item.amount.toString())}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">No expenses recorded</TableCell>
                    </TableRow>
                  )}
                  <TableRow className="bg-orange-50 dark:bg-orange-950/30 font-semibold">
                    <TableCell colSpan={2}>Total Expenses</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(data.totalExpenses.toString())}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className={`p-4 rounded-lg ${data.netIncome >= 0 ? 'bg-green-100 dark:bg-green-950/50' : 'bg-red-100 dark:bg-red-950/50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Net {data.netIncome >= 0 ? 'Income' : 'Loss'}</span>
                <span className={`text-2xl font-bold ${data.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(data.netIncome).toString())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
