import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Scale, FileSpreadsheet, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type TrialBalanceItem = {
  accountCode: string;
  accountName: string;
  accountType: string;
  debit: number;
  credit: number;
};

const accountTypeColors: Record<string, string> = {
  asset: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  liability: "bg-red-500/10 text-red-600 border-red-500/20",
  equity: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  income: "bg-green-500/10 text-green-600 border-green-500/20",
  expense: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export default function TrialBalance() {
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<TrialBalanceItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrialBalance = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports/trial-balance?asOfDate=${asOfDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch trial balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = data?.filter(item => item.debit > 0 || item.credit > 0) || [];
  const totalDebit = data?.reduce((sum, item) => sum + item.debit, 0) || 0;
  const totalCredit = data?.reduce((sum, item) => sum + item.credit, 0) || 0;
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handleExportExcel = () => {
    if (!data) return;

    const exportData = filteredData.map(item => ({
      "Account Code": item.accountCode,
      "Account Name": item.accountName,
      "Type": item.accountType.charAt(0).toUpperCase() + item.accountType.slice(1),
      "Debit (AFN)": item.debit > 0 ? item.debit : "",
      "Credit (AFN)": item.credit > 0 ? item.credit : "",
    }));

    exportData.push({
      "Account Code": "",
      "Account Name": "",
      "Type": "TOTAL",
      "Debit (AFN)": totalDebit,
      "Credit (AFN)": totalCredit,
    });

    if (!isBalanced) {
      exportData.push({
        "Account Code": "",
        "Account Name": "",
        "Type": "DIFFERENCE",
        "Debit (AFN)": Math.abs(totalDebit - totalCredit),
        "Credit (AFN)": "",
      });
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    
    const colWidths = [
      { wch: 15 },
      { wch: 40 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
    ];
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");

    const dateStr = asOfDate.replace(/-/g, "");
    XLSX.writeFile(wb, `Trial_Balance_${dateStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Lamen Microfinance Institution", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.text("Trial Balance", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`As of: ${formatDate(asOfDate)}`, 105, 38, { align: "center" });

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 44, { align: "center" });

    const tableData = filteredData.map(item => [
      item.accountCode,
      item.accountName,
      item.accountType.charAt(0).toUpperCase() + item.accountType.slice(1),
      item.debit > 0 ? formatCurrency(item.debit.toString()).replace("AFN", "").trim() : "-",
      item.credit > 0 ? formatCurrency(item.credit.toString()).replace("AFN", "").trim() : "-",
    ]);

    tableData.push([
      "",
      "",
      "TOTAL",
      formatCurrency(totalDebit.toString()).replace("AFN", "").trim(),
      formatCurrency(totalCredit.toString()).replace("AFN", "").trim(),
    ]);

    if (!isBalanced) {
      tableData.push([
        "",
        "",
        "DIFFERENCE",
        formatCurrency(Math.abs(totalDebit - totalCredit).toString()).replace("AFN", "").trim(),
        "",
      ]);
    }

    autoTable(doc, {
      startY: 50,
      head: [["Account Code", "Account Name", "Type", "Debit (AFN)", "Credit (AFN)"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [34, 139, 34],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left", cellWidth: 25 },
        1: { halign: "left", cellWidth: 70 },
        2: { halign: "center", cellWidth: 22 },
        3: { halign: "right", cellWidth: 30 },
        4: { halign: "right", cellWidth: 30 },
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      didParseCell: function (data) {
        const rowIndex = data.row.index;
        const totalRowIndex = tableData.length - (isBalanced ? 1 : 2);
        const diffRowIndex = tableData.length - 1;

        if (rowIndex === totalRowIndex) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [240, 240, 240];
        }
        if (!isBalanced && rowIndex === diffRowIndex) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [255, 200, 200];
          data.cell.styles.textColor = [180, 0, 0];
        }
      },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 290);
    }

    const balanceStatus = isBalanced ? "Balanced" : "OUT_OF_BALANCE";
    const dateStr = asOfDate.replace(/-/g, "");
    doc.save(`Trial_Balance_${dateStr}_${balanceStatus}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Scale className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Trial Balance</h1>
            <p className="text-muted-foreground text-sm">Summary of all account balances</p>
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
            <Button onClick={fetchTrialBalance} disabled={isLoading} data-testid="button-generate">
              {isLoading ? "Loading..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card className="print:shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-xl">Trial Balance</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">As of {formatDate(asOfDate)}</p>
              </div>
              <Badge variant={isBalanced ? "default" : "destructive"} className="text-sm">
                {isBalanced ? "Balanced" : "Out of Balance"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono">{item.accountCode}</TableCell>
                    <TableCell>{item.accountName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={accountTypeColors[item.accountType]}>
                        {item.accountType.charAt(0).toUpperCase() + item.accountType.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.debit > 0 ? formatCurrency(item.debit.toString()) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.credit > 0 ? formatCurrency(item.credit.toString()) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No accounts with balances found.
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={3} className="text-right">Total:</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(totalDebit.toString())}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(totalCredit.toString())}</TableCell>
                </TableRow>
                {!isBalanced && (
                  <TableRow className="bg-red-50 dark:bg-red-950/30">
                    <TableCell colSpan={3} className="text-right text-red-600">Difference:</TableCell>
                    <TableCell colSpan={2} className="text-right font-mono text-red-600">
                      {formatCurrency(Math.abs(totalDebit - totalCredit).toString())}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
