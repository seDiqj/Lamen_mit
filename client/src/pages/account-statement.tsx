import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableAccountSelect } from "@/components/searchable-account-select";
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

type Account = {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
};

type FundingSource = {
  id: string;
  name: string;
  code: string;
};

type Transaction = {
  entryDate: string;
  entryNumber: string;
  description: string;
  reference: string | null;
  debitAmount: string;
  creditAmount: string;
  balance: number;
};

type StatementData = {
  account: Account;
  openingBalance: number;
  transactions: Transaction[];
  closingBalance: number;
};

export default function AccountStatement() {
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedFundingSource, setSelectedFundingSource] = useState<string>("all");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [statement, setStatement] = useState<StatementData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const { data: fundingSources = [] } = useQuery<FundingSource[]>({
    queryKey: ["/api/funding-sources"],
  });

  const fetchStatement = async () => {
    if (!selectedAccount) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (selectedFundingSource && selectedFundingSource !== "all") {
        params.set("fundingSourceId", selectedFundingSource);
      }
      const res = await fetch(`/api/reports/account-statement/${selectedAccount}?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStatement(data);
    } catch (error) {
      console.error("Failed to fetch statement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!statement) return;

    const exportData: any[] = [];
    
    exportData.push({
      "Date": "",
      "Entry #": "",
      "Description": "Opening Balance",
      "Reference": "",
      "Debit (AFN)": "",
      "Credit (AFN)": "",
      "Balance (AFN)": statement.openingBalance,
    });

    statement.transactions.forEach(tx => {
      exportData.push({
        "Date": formatDate(tx.entryDate),
        "Entry #": tx.entryNumber,
        "Description": tx.description || "-",
        "Reference": tx.reference || "-",
        "Debit (AFN)": Number(tx.debitAmount) > 0 ? Number(tx.debitAmount) : "",
        "Credit (AFN)": Number(tx.creditAmount) > 0 ? Number(tx.creditAmount) : "",
        "Balance (AFN)": tx.balance,
      });
    });

    exportData.push({
      "Date": "",
      "Entry #": "",
      "Description": "Closing Balance",
      "Reference": "",
      "Debit (AFN)": "",
      "Credit (AFN)": "",
      "Balance (AFN)": statement.closingBalance,
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [
      { wch: 12 },
      { wch: 15 },
      { wch: 40 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Account Statement");

    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    const accCode = statement.account.accountCode;
    XLSX.writeFile(wb, `Account_Statement_${accCode}_${startStr}_to_${endStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!statement) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Lamen Microfinance Institution", 148, 15, { align: "center" });

    doc.setFontSize(14);
    doc.text("Account Statement", 148, 23, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Account: ${statement.account.accountCode} - ${statement.account.accountName}`, 148, 31, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Period: ${formatDate(startDate)} to ${formatDate(endDate)}`, 148, 38, { align: "center" });

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 148, 44, { align: "center" });

    const tableData: any[] = [];
    
    tableData.push([
      "",
      "",
      { content: "Opening Balance", styles: { fontStyle: "bold" } },
      "",
      "",
      "",
      { content: formatCurrency(statement.openingBalance.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold" } }
    ]);

    statement.transactions.forEach(tx => {
      tableData.push([
        formatDate(tx.entryDate),
        tx.entryNumber,
        tx.description || "-",
        tx.reference || "-",
        Number(tx.debitAmount) > 0 ? formatCurrency(tx.debitAmount).replace("AFN", "").trim() : "-",
        Number(tx.creditAmount) > 0 ? formatCurrency(tx.creditAmount).replace("AFN", "").trim() : "-",
        formatCurrency(tx.balance.toString()).replace("AFN", "").trim()
      ]);
    });

    const totalDebit = statement.transactions.reduce((sum, tx) => sum + Number(tx.debitAmount), 0);
    const totalCredit = statement.transactions.reduce((sum, tx) => sum + Number(tx.creditAmount), 0);
    tableData.push([
      "",
      "",
      "",
      { content: "Total", styles: { fontStyle: "bold", halign: "right" } },
      { content: formatCurrency(totalDebit.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold" } },
      { content: formatCurrency(totalCredit.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold" } },
      ""
    ]);

    tableData.push([
      "",
      "",
      { content: "Closing Balance", styles: { fontStyle: "bold" } },
      "",
      "",
      "",
      { content: formatCurrency(statement.closingBalance.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", fillColor: [240, 240, 240] } }
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Date", "Entry #", "Description", "Reference", "Debit (AFN)", "Credit (AFN)", "Balance (AFN)"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 139, 34], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
      columnStyles: {
        0: { halign: "center", cellWidth: 25 },
        1: { halign: "center", cellWidth: 25 },
        2: { halign: "left", cellWidth: 80 },
        3: { halign: "center", cellWidth: 25 },
        4: { halign: "right", cellWidth: 30 },
        5: { halign: "right", cellWidth: 30 },
        6: { halign: "right", cellWidth: 35 },
      },
      styles: { fontSize: 8, cellPadding: 2 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 148, 200, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 200);
    }

    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    const accCode = statement.account.accountCode;
    doc.save(`Account_Statement_${accCode}_${startStr}_to_${endStr}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-lg">
            <FileSpreadsheet className="h-6 w-6 text-violet-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Account Statement</h1>
            <p className="text-muted-foreground text-sm">View transaction history for any account</p>
          </div>
        </div>
        {statement && (
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
          <CardTitle className="text-lg">Select Account & Period</CardTitle>
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
                    if (opt.all) {
                      setStartDate("2024-01-01");
                    } else {
                      const start = new Date();
                      if (opt.months) start.setMonth(start.getMonth() - opt.months);
                      if (opt.days) start.setDate(start.getDate() - opt.days);
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
              <div className="space-y-2 min-w-[300px]">
                <Label>Account</Label>
                <SearchableAccountSelect
                  accounts={accounts}
                  value={selectedAccount}
                  onValueChange={setSelectedAccount}
                  placeholder="Search by code or name..."
                  className="w-full"
                  data-testid="select-account"
                />
              </div>
              <div className="space-y-2">
                <Label>Fund</Label>
                <Select value={selectedFundingSource} onValueChange={setSelectedFundingSource}>
                  <SelectTrigger className="w-[180px]" data-testid="select-funding-source">
                    <SelectValue placeholder="All Funds" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Funds</SelectItem>
                    {fundingSources.map((fs) => (
                      <SelectItem key={fs.id} value={fs.id}>{fs.code} - {fs.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} data-testid="input-start-date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} data-testid="input-end-date" />
              </div>
              <Button onClick={fetchStatement} disabled={!selectedAccount || isLoading} data-testid="button-generate">
                {isLoading ? "Loading..." : "Generate Statement"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {statement && (
        <Card className="print:shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-xl">{statement.account.accountCode} - {statement.account.accountName}</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Statement period: {formatDate(startDate)} to {formatDate(endDate)}
                  {selectedFundingSource !== "all" && (() => {
                    const fs = fundingSources.find(f => f.id === selectedFundingSource);
                    return fs ? ` | Fund: ${fs.code} - ${fs.name}` : "";
                  })()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Opening Balance</p>
                <p className="text-xl font-bold">{formatCurrency(statement.openingBalance.toString())}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Entry #</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={6} className="font-medium">Opening Balance</TableCell>
                  <TableCell className="text-right font-mono font-medium">{formatCurrency(statement.openingBalance.toString())}</TableCell>
                </TableRow>
                {statement.transactions.length > 0 ? statement.transactions.map((tx, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{formatDate(tx.entryDate)}</TableCell>
                    <TableCell className="font-mono">{tx.entryNumber}</TableCell>
                    <TableCell>{tx.description || "-"}</TableCell>
                    <TableCell>{tx.reference || "-"}</TableCell>
                    <TableCell className="text-right font-mono">
                      {Number(tx.debitAmount) > 0 ? formatCurrency(tx.debitAmount) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {Number(tx.creditAmount) > 0 ? formatCurrency(tx.creditAmount) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(tx.balance.toString())}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No transactions found in this period.
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-muted/20 font-semibold border-t-2">
                  <TableCell colSpan={4} className="text-right">Total</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(statement.transactions.reduce((sum, tx) => sum + Number(tx.debitAmount), 0).toString())}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(statement.transactions.reduce((sum, tx) => sum + Number(tx.creditAmount), 0).toString())}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell colSpan={6}>Closing Balance</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(statement.closingBalance.toString())}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
