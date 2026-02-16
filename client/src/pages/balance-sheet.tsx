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
import { Badge } from "@/components/ui/badge";
import { FileText, FileSpreadsheet } from "lucide-react";
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

type BalanceSheetData = {
  assets: AccountItem[];
  liabilities: AccountItem[];
  equity: AccountItem[];
  retainedEarnings: number;
  currentPeriodNetIncome: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  asOfDate: string;
};

export default function BalanceSheet() {
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<BalanceSheetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports/balance-sheet?asOfDate=${asOfDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch balance sheet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isBalanced = data ? Math.abs(data.totalAssets - (data.totalLiabilities + data.totalEquity)) < 0.01 : true;

  const handleExportExcel = () => {
    if (!data) return;

    const exportData: any[] = [];
    
    exportData.push({ "Account Code": "", "Account Name": "ASSETS", "Amount (AFN)": "" });
    data.assets.filter(a => a.amount !== 0).forEach(item => {
      exportData.push({
        "Account Code": item.accountCode,
        "Account Name": item.accountName,
        "Amount (AFN)": item.amount,
      });
    });
    exportData.push({ "Account Code": "", "Account Name": "Total Assets", "Amount (AFN)": data.totalAssets });
    
    exportData.push({ "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    exportData.push({ "Account Code": "", "Account Name": "LIABILITIES", "Amount (AFN)": "" });
    data.liabilities.filter(l => l.amount !== 0).forEach(item => {
      exportData.push({
        "Account Code": item.accountCode,
        "Account Name": item.accountName,
        "Amount (AFN)": item.amount,
      });
    });
    exportData.push({ "Account Code": "", "Account Name": "Total Liabilities", "Amount (AFN)": data.totalLiabilities });
    
    exportData.push({ "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    exportData.push({ "Account Code": "", "Account Name": "EQUITY", "Amount (AFN)": "" });
    data.equity.filter(e => e.amount !== 0).forEach(item => {
      exportData.push({
        "Account Code": item.accountCode,
        "Account Name": item.accountName,
        "Amount (AFN)": item.amount,
      });
    });
    if (data.retainedEarnings !== 0) {
      exportData.push({
        "Account Code": "",
        "Account Name": "Retained Earnings",
        "Amount (AFN)": data.retainedEarnings,
      });
    }
    if (data.currentPeriodNetIncome !== 0) {
      exportData.push({
        "Account Code": "",
        "Account Name": data.currentPeriodNetIncome >= 0 ? "Current Period Net Income" : "Current Period Net Loss",
        "Amount (AFN)": data.currentPeriodNetIncome,
      });
    }
    exportData.push({ "Account Code": "", "Account Name": "Total Equity", "Amount (AFN)": data.totalEquity });
    
    exportData.push({ "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    exportData.push({ "Account Code": "", "Account Name": "TOTAL LIABILITIES & EQUITY", "Amount (AFN)": data.totalLiabilities + data.totalEquity });

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [{ wch: 15 }, { wch: 45 }, { wch: 20 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Balance Sheet");

    const dateStr = asOfDate.replace(/-/g, "");
    XLSX.writeFile(wb, `Balance_Sheet_${dateStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Lamen Microfinance Institution", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.text("Balance Sheet", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`As of: ${formatDate(asOfDate)}`, 105, 38, { align: "center" });

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 44, { align: "center" });

    const tableData: any[] = [];
    
    tableData.push([{ content: "ASSETS", colSpan: 3, styles: { fontStyle: "bold", fillColor: [219, 234, 254] } }]);
    data.assets.filter(a => a.amount !== 0).forEach(item => {
      tableData.push([
        item.accountCode,
        item.accountName,
        formatCurrency(item.amount.toString()).replace("AFN", "").trim()
      ]);
    });
    tableData.push([
      "",
      { content: "Total Assets", styles: { fontStyle: "bold" } },
      { content: formatCurrency(data.totalAssets.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", fillColor: [191, 219, 254] } }
    ]);

    tableData.push(["", "", ""]);
    tableData.push([{ content: "LIABILITIES", colSpan: 3, styles: { fontStyle: "bold", fillColor: [254, 226, 226] } }]);
    data.liabilities.filter(l => l.amount !== 0).forEach(item => {
      tableData.push([
        item.accountCode,
        item.accountName,
        formatCurrency(item.amount.toString()).replace("AFN", "").trim()
      ]);
    });
    tableData.push([
      "",
      { content: "Total Liabilities", styles: { fontStyle: "bold" } },
      { content: formatCurrency(data.totalLiabilities.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", fillColor: [254, 202, 202] } }
    ]);

    tableData.push(["", "", ""]);
    tableData.push([{ content: "EQUITY", colSpan: 3, styles: { fontStyle: "bold", fillColor: [243, 232, 255] } }]);
    data.equity.filter(e => e.amount !== 0).forEach(item => {
      tableData.push([
        item.accountCode,
        item.accountName,
        formatCurrency(item.amount.toString()).replace("AFN", "").trim()
      ]);
    });
    if (data.retainedEarnings !== 0) {
      const reLabel = "Retained Earnings";
      const reFillColor = data.retainedEarnings >= 0 ? [219, 234, 254] : [254, 215, 170];
      tableData.push([
        "",
        { content: reLabel, styles: { fontStyle: "italic" } },
        { content: formatCurrency(Math.abs(data.retainedEarnings).toString()).replace("AFN", "").trim() + (data.retainedEarnings < 0 ? " (Loss)" : ""), styles: { fillColor: reFillColor } }
      ]);
    }
    if (data.currentPeriodNetIncome !== 0) {
      const netIncomeLabel = data.currentPeriodNetIncome >= 0 ? "Current Period Net Income" : "Current Period Net Loss";
      const fillColor = data.currentPeriodNetIncome >= 0 ? [220, 252, 231] : [254, 226, 226];
      tableData.push([
        "",
        { content: netIncomeLabel, styles: { fontStyle: "italic" } },
        { content: formatCurrency(Math.abs(data.currentPeriodNetIncome).toString()).replace("AFN", "").trim() + (data.currentPeriodNetIncome < 0 ? " (Loss)" : ""), styles: { fillColor } }
      ]);
    }
    tableData.push([
      "",
      { content: "Total Equity", styles: { fontStyle: "bold" } },
      { content: formatCurrency(data.totalEquity.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", fillColor: [233, 213, 255] } }
    ]);

    tableData.push(["", "", ""]);
    tableData.push([
      "",
      { content: "TOTAL LIABILITIES & EQUITY", styles: { fontStyle: "bold" } },
      { content: formatCurrency((data.totalLiabilities + data.totalEquity).toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", fillColor: [240, 240, 240] } }
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

    const finalY = (doc as any).lastAutoTable?.finalY || 200;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const statusText = isBalanced ? "Status: BALANCED" : "Status: OUT OF BALANCE";
    const statusColor = isBalanced ? [34, 139, 34] : [220, 38, 38];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(statusText, 105, finalY + 10, { align: "center" });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 290);
    }

    const dateStr = asOfDate.replace(/-/g, "");
    const balanceStatus = isBalanced ? "Balanced" : "OUT_OF_BALANCE";
    doc.save(`Balance_Sheet_${dateStr}_${balanceStatus}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <FileText className="h-6 w-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Balance Sheet</h1>
            <p className="text-muted-foreground text-sm">Statement of financial position</p>
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
          <CardTitle className="text-lg">Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label>As of Date</Label>
              <Input type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} data-testid="input-as-of-date" />
            </div>
            <Button onClick={fetchReport} disabled={isLoading} data-testid="button-generate">
              {isLoading ? "Loading..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <div className="flex flex-col gap-4">
          <Card className="print:shadow-none">
            <CardHeader className="border-b bg-blue-50 dark:bg-blue-950/30">
              <CardTitle className="text-lg text-blue-600">Assets</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableBody>
                  {data.assets.length > 0 ? data.assets.filter(a => a.amount !== 0).map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono w-24">{item.accountCode}</TableCell>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(item.amount.toString())}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">No assets recorded</TableCell>
                    </TableRow>
                  )}
                  <TableRow className="bg-blue-100 dark:bg-blue-950/50 font-bold">
                    <TableCell colSpan={2}>Total Assets</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(data.totalAssets.toString())}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="print:shadow-none">
            <CardHeader className="border-b bg-red-50 dark:bg-red-950/30">
              <CardTitle className="text-lg text-red-600">Liabilities</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableBody>
                  {data.liabilities.length > 0 ? data.liabilities.filter(l => l.amount !== 0).map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono w-24">{item.accountCode}</TableCell>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(item.amount.toString())}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-2 text-sm">No liabilities</TableCell>
                    </TableRow>
                  )}
                  <TableRow className="bg-red-100 dark:bg-red-950/50 font-semibold">
                    <TableCell colSpan={2}>Total Liabilities</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(data.totalLiabilities.toString())}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="print:shadow-none">
            <CardHeader className="border-b bg-purple-50 dark:bg-purple-950/30">
              <CardTitle className="text-lg text-purple-600">Equity</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableBody>
                  {data.equity.length > 0 ? data.equity.filter(e => e.amount !== 0).map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono w-24">{item.accountCode}</TableCell>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(item.amount.toString())}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-2 text-sm">No equity recorded</TableCell>
                    </TableRow>
                  )}
                  {data.retainedEarnings !== 0 && (
                    <TableRow className={data.retainedEarnings >= 0 ? "bg-blue-50 dark:bg-blue-950/30" : "bg-orange-50 dark:bg-orange-950/30"} data-testid="row-retained-earnings">
                      <TableCell className="font-mono w-24"></TableCell>
                      <TableCell className="italic">Retained Earnings</TableCell>
                      <TableCell className={`text-right font-mono ${data.retainedEarnings >= 0 ? "text-blue-600" : "text-orange-600"}`} data-testid="text-retained-earnings">
                        {formatCurrency(Math.abs(data.retainedEarnings).toString())}
                        {data.retainedEarnings < 0 && " (Loss)"}
                      </TableCell>
                    </TableRow>
                  )}
                  {data.currentPeriodNetIncome !== 0 && (
                    <TableRow className={data.currentPeriodNetIncome >= 0 ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"} data-testid="row-current-period-net-income">
                      <TableCell className="font-mono w-24"></TableCell>
                      <TableCell className="italic">
                        {data.currentPeriodNetIncome >= 0 ? "Current Period Net Income" : "Current Period Net Loss"}
                      </TableCell>
                      <TableCell className={`text-right font-mono ${data.currentPeriodNetIncome >= 0 ? "text-green-600" : "text-red-600"}`} data-testid="text-current-period-net-income">
                        {formatCurrency(Math.abs(data.currentPeriodNetIncome).toString())}
                        {data.currentPeriodNetIncome < 0 && " (Loss)"}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow className="bg-purple-100 dark:bg-purple-950/50 font-semibold">
                    <TableCell colSpan={2}>Total Equity</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(data.totalEquity.toString())}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="print:shadow-none border-2 border-primary/20">
            <CardContent className="py-4">
              <Table>
                <TableBody>
                  <TableRow className="font-bold text-lg">
                    <TableCell colSpan={2}>Total Liabilities & Equity</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency((data.totalLiabilities + data.totalEquity).toString())}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {data && (
        <Card className={`${isBalanced ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'} print:shadow-none`}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={isBalanced ? "default" : "destructive"}>
                  {isBalanced ? "Balanced" : "Out of Balance"}
                </Badge>
                <span className="text-sm text-muted-foreground">As of {formatDate(asOfDate)}</span>
              </div>
              {!isBalanced && (
                <span className="text-red-600 font-medium">
                  Difference: {formatCurrency(Math.abs(data.totalAssets - (data.totalLiabilities + data.totalEquity)).toString())}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
