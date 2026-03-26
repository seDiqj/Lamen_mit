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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSpreadsheet, FileText, Landmark, Banknote } from "lucide-react";
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

type FundTransaction = Transaction & {
  accountCode: string | null;
  accountName: string | null;
};

type StatementData = {
  account: Account;
  openingBalance: number;
  transactions: Transaction[];
  closingBalance: number;
};

type FundStatementData = {
  fundingSource: FundingSource;
  openingBalance: number;
  transactions: FundTransaction[];
  closingBalance: number;
};

type PrincipalTransaction = {
  date: string;
  type: 'disbursement' | 'collection';
  applicationId: string;
  customerName: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
};

type PrincipalStatementData = {
  fundingSource: FundingSource;
  openingBalance: number;
  transactions: PrincipalTransaction[];
  closingBalance: number;
  summary: {
    totalDisbursed: number;
    totalCollected: number;
  };
};

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

function exportStatementExcel(
  title: string,
  subtitle: string,
  openingBalance: number,
  closingBalance: number,
  transactions: any[],
  fileName: string,
  includeAccount?: boolean
) {
  const exportData: any[] = [];

  const openingRow: any = {
    "Date": "",
    "Entry #": "",
  };
  if (includeAccount) openingRow["Account"] = "";
  openingRow["Description"] = "Opening Balance";
  openingRow["Reference"] = "";
  openingRow["Debit (AFN)"] = "";
  openingRow["Credit (AFN)"] = "";
  openingRow["Balance (AFN)"] = openingBalance;
  exportData.push(openingRow);

  transactions.forEach(tx => {
    const row: any = {
      "Date": formatDate(tx.entryDate),
      "Entry #": tx.entryNumber,
    };
    if (includeAccount) row["Account"] = `${tx.accountCode} - ${tx.accountName}`;
    row["Description"] = tx.description || "-";
    row["Reference"] = tx.reference || "-";
    row["Debit (AFN)"] = Number(tx.debitAmount) > 0 ? Number(tx.debitAmount) : "";
    row["Credit (AFN)"] = Number(tx.creditAmount) > 0 ? Number(tx.creditAmount) : "";
    row["Balance (AFN)"] = tx.balance;
    exportData.push(row);
  });

  const closingRow: any = {
    "Date": "",
    "Entry #": "",
  };
  if (includeAccount) closingRow["Account"] = "";
  closingRow["Description"] = "Closing Balance";
  closingRow["Reference"] = "";
  closingRow["Debit (AFN)"] = "";
  closingRow["Credit (AFN)"] = "";
  closingRow["Balance (AFN)"] = closingBalance;
  exportData.push(closingRow);

  const ws = XLSX.utils.json_to_sheet(exportData);
  const colWidths = includeAccount
    ? [{ wch: 12 }, { wch: 15 }, { wch: 30 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }]
    : [{ wch: 12 }, { wch: 15 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }];
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title);
  XLSX.writeFile(wb, fileName);
}

function exportStatementPDF(
  title: string,
  subtitle: string,
  periodText: string,
  openingBalance: number,
  closingBalance: number,
  transactions: any[],
  fileName: string,
  includeAccount?: boolean
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Lamen Microfinance Institution", 148, 15, { align: "center" });

  doc.setFontSize(14);
  doc.text(title, 148, 23, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle, 148, 31, { align: "center" });

  doc.setFontSize(10);
  doc.text(periodText, 148, 38, { align: "center" });

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 148, 44, { align: "center" });

  const headers = includeAccount
    ? ["Date", "Entry #", "Account", "Description", "Reference", "Debit (AFN)", "Credit (AFN)", "Balance (AFN)"]
    : ["Date", "Entry #", "Description", "Reference", "Debit (AFN)", "Credit (AFN)", "Balance (AFN)"];

  const tableData: any[] = [];

  const openingRow = includeAccount
    ? ["", "", "", { content: "Opening Balance", styles: { fontStyle: "bold" } }, "", "", "", { content: formatCurrency(openingBalance.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold" } }]
    : ["", "", { content: "Opening Balance", styles: { fontStyle: "bold" } }, "", "", "", { content: formatCurrency(openingBalance.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold" } }];
  tableData.push(openingRow);

  transactions.forEach(tx => {
    const row = includeAccount
      ? [
          formatDate(tx.entryDate), tx.entryNumber,
          `${tx.accountCode} - ${tx.accountName}`,
          tx.description || "-", tx.reference || "-",
          Number(tx.debitAmount) > 0 ? formatCurrency(tx.debitAmount).replace("AFN", "").trim() : "-",
          Number(tx.creditAmount) > 0 ? formatCurrency(tx.creditAmount).replace("AFN", "").trim() : "-",
          formatCurrency(tx.balance.toString()).replace("AFN", "").trim()
        ]
      : [
          formatDate(tx.entryDate), tx.entryNumber,
          tx.description || "-", tx.reference || "-",
          Number(tx.debitAmount) > 0 ? formatCurrency(tx.debitAmount).replace("AFN", "").trim() : "-",
          Number(tx.creditAmount) > 0 ? formatCurrency(tx.creditAmount).replace("AFN", "").trim() : "-",
          formatCurrency(tx.balance.toString()).replace("AFN", "").trim()
        ];
    tableData.push(row);
  });

  const totalDebit = transactions.reduce((sum: number, tx: any) => sum + Number(tx.debitAmount), 0);
  const totalCredit = transactions.reduce((sum: number, tx: any) => sum + Number(tx.creditAmount), 0);

  const colCount = includeAccount ? 8 : 7;
  const totalRow: any[] = new Array(colCount).fill("");
  totalRow[colCount - 4] = { content: "Total", styles: { fontStyle: "bold", halign: "right" } };
  totalRow[colCount - 3] = { content: formatCurrency(totalDebit.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold" } };
  totalRow[colCount - 2] = { content: formatCurrency(totalCredit.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold" } };
  tableData.push(totalRow);

  const closingRow: any[] = new Array(colCount).fill("");
  closingRow[includeAccount ? 3 : 2] = { content: "Closing Balance", styles: { fontStyle: "bold" } };
  closingRow[colCount - 1] = { content: formatCurrency(closingBalance.toString()).replace("AFN", "").trim(), styles: { fontStyle: "bold", fillColor: [240, 240, 240] } };
  tableData.push(closingRow);

  const columnStyles: any = includeAccount
    ? {
        0: { halign: "center", cellWidth: 22 },
        1: { halign: "center", cellWidth: 22 },
        2: { halign: "left", cellWidth: 40 },
        3: { halign: "left", cellWidth: 55 },
        4: { halign: "center", cellWidth: 22 },
        5: { halign: "right", cellWidth: 28 },
        6: { halign: "right", cellWidth: 28 },
        7: { halign: "right", cellWidth: 30 },
      }
    : {
        0: { halign: "center", cellWidth: 25 },
        1: { halign: "center", cellWidth: 25 },
        2: { halign: "left", cellWidth: 80 },
        3: { halign: "center", cellWidth: 25 },
        4: { halign: "right", cellWidth: 30 },
        5: { halign: "right", cellWidth: 30 },
        6: { halign: "right", cellWidth: 35 },
      };

  autoTable(doc, {
    startY: 50,
    head: [headers],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [34, 139, 34], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
    columnStyles,
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

  doc.save(fileName);
}

export default function AccountStatement() {
  const [activeTab, setActiveTab] = useState("account");

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

  const [selectedFund, setSelectedFund] = useState<string>("");
  const [fundStartDate, setFundStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [fundEndDate, setFundEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [fundStatement, setFundStatement] = useState<FundStatementData | null>(null);
  const [isFundLoading, setIsFundLoading] = useState(false);

  const [selectedPrincipalFund, setSelectedPrincipalFund] = useState<string>("");
  const [principalStartDate, setPrincipalStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [principalEndDate, setPrincipalEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [principalStatement, setPrincipalStatement] = useState<PrincipalStatementData | null>(null);
  const [isPrincipalLoading, setIsPrincipalLoading] = useState(false);

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

  const fetchFundStatement = async () => {
    if (!selectedFund) return;
    setIsFundLoading(true);
    try {
      const params = new URLSearchParams({ startDate: fundStartDate, endDate: fundEndDate });
      const res = await fetch(`/api/reports/funding-source-statement/${selectedFund}?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setFundStatement(data);
    } catch (error) {
      console.error("Failed to fetch fund statement:", error);
    } finally {
      setIsFundLoading(false);
    }
  };

  const fetchPrincipalStatement = async () => {
    if (!selectedPrincipalFund) return;
    setIsPrincipalLoading(true);
    try {
      const params = new URLSearchParams({ startDate: principalStartDate, endDate: principalEndDate });
      const res = await fetch(`/api/reports/funding-source-principle-statement/${selectedPrincipalFund}?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPrincipalStatement(data);
    } catch (error) {
      console.error("Failed to fetch principal statement:", error);
    } finally {
      setIsPrincipalLoading(false);
    }
  };

  const handlePrincipalExportExcel = () => {
    if (!principalStatement) return;
    const startStr = principalStartDate.replace(/-/g, "");
    const endStr = principalEndDate.replace(/-/g, "");
    const fundCode = principalStatement.fundingSource.code;
    const exportData: any[] = [];
    exportData.push({
      "Date": "",
      "Type": "",
      "Loan ID": "",
      "Customer": "",
      "Debit (AFN)": "",
      "Credit (AFN)": "",
      "Balance (AFN)": principalStatement.openingBalance,
    });
    principalStatement.transactions.forEach(tx => {
      exportData.push({
        "Date": formatDate(tx.date),
        "Type": tx.type === 'disbursement' ? 'Disbursed' : 'Collected',
        "Loan ID": tx.applicationId,
        "Customer": tx.customerName,
        "Debit (AFN)": tx.debitAmount > 0 ? tx.debitAmount : "",
        "Credit (AFN)": tx.creditAmount > 0 ? tx.creditAmount : "",
        "Balance (AFN)": tx.balance,
      });
    });
    exportData.push({
      "Date": "",
      "Type": "",
      "Loan ID": "",
      "Customer": "Total",
      "Debit (AFN)": principalStatement.summary.totalDisbursed,
      "Credit (AFN)": principalStatement.summary.totalCollected,
      "Balance (AFN)": "",
    });
    exportData.push({
      "Date": "",
      "Type": "",
      "Loan ID": "",
      "Customer": "Closing Balance",
      "Debit (AFN)": "",
      "Credit (AFN)": "",
      "Balance (AFN)": principalStatement.closingBalance,
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Principal Statement");
    XLSX.writeFile(wb, `Principal_Statement_${fundCode}_${startStr}_to_${endStr}.xlsx`);
  };

  const handlePrincipalExportPDF = () => {
    if (!principalStatement) return;
    const startStr = principalStartDate.replace(/-/g, "");
    const endStr = principalEndDate.replace(/-/g, "");
    const fundCode = principalStatement.fundingSource.code;
    const doc = new jsPDF("landscape");
    doc.setFontSize(14);
    doc.text("Lamen Micro Finance Institution", 148, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("Funding Source Principle Statement", 148, 23, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Fund: ${fundCode} - ${principalStatement.fundingSource.name}`, 14, 33);
    doc.text(`Period: ${formatDate(principalStartDate)} to ${formatDate(principalEndDate)}`, 14, 40);

    const body: any[] = [];
    body.push([{ content: "Opening Balance", colSpan: 5, styles: { fontStyle: "bold" } }, "", "", "", "", { content: principalStatement.openingBalance.toLocaleString(), styles: { halign: "right", fontStyle: "bold" } }]);
    principalStatement.transactions.forEach(tx => {
      body.push([
        formatDate(tx.date),
        tx.type === 'disbursement' ? 'Disbursed' : 'Collected',
        tx.applicationId,
        tx.customerName,
        tx.debitAmount > 0 ? tx.debitAmount.toLocaleString() : "-",
        tx.creditAmount > 0 ? tx.creditAmount.toLocaleString() : "-",
        tx.balance.toLocaleString(),
      ]);
    });
    body.push([
      { content: "Total", colSpan: 4, styles: { fontStyle: "bold", halign: "right" } }, "", "", "",
      { content: principalStatement.summary.totalDisbursed.toLocaleString(), styles: { halign: "right", fontStyle: "bold" } },
      { content: principalStatement.summary.totalCollected.toLocaleString(), styles: { halign: "right", fontStyle: "bold" } },
      "",
    ]);
    body.push([
      { content: "Closing Balance", colSpan: 6, styles: { fontStyle: "bold" } }, "", "", "", "", "",
      { content: principalStatement.closingBalance.toLocaleString(), styles: { halign: "right", fontStyle: "bold" } },
    ]);

    autoTable(doc, {
      startY: 46,
      head: [["Date", "Type", "Loan ID", "Customer", "Debit (AFN)", "Credit (AFN)", "Balance (AFN)"]],
      body,
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

    doc.save(`Principal_Statement_${fundCode}_${startStr}_to_${endStr}.pdf`);
  };

  const handleExportExcel = () => {
    if (!statement) return;
    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    const accCode = statement.account.accountCode;
    exportStatementExcel(
      "Account Statement",
      `${accCode} - ${statement.account.accountName}`,
      statement.openingBalance,
      statement.closingBalance,
      statement.transactions,
      `Account_Statement_${accCode}_${startStr}_to_${endStr}.xlsx`
    );
  };

  const handleExportPDF = () => {
    if (!statement) return;
    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    const accCode = statement.account.accountCode;
    exportStatementPDF(
      "Account Statement",
      `Account: ${accCode} - ${statement.account.accountName}`,
      `Period: ${formatDate(startDate)} to ${formatDate(endDate)}`,
      statement.openingBalance,
      statement.closingBalance,
      statement.transactions,
      `Account_Statement_${accCode}_${startStr}_to_${endStr}.pdf`
    );
  };

  const handleFundExportExcel = () => {
    if (!fundStatement) return;
    const startStr = fundStartDate.replace(/-/g, "");
    const endStr = fundEndDate.replace(/-/g, "");
    const fundCode = fundStatement.fundingSource.code;
    exportStatementExcel(
      "Funding Source Statement",
      `${fundCode} - ${fundStatement.fundingSource.name}`,
      fundStatement.openingBalance,
      fundStatement.closingBalance,
      fundStatement.transactions,
      `Fund_Statement_${fundCode}_${startStr}_to_${endStr}.xlsx`,
      true
    );
  };

  const handleFundExportPDF = () => {
    if (!fundStatement) return;
    const startStr = fundStartDate.replace(/-/g, "");
    const endStr = fundEndDate.replace(/-/g, "");
    const fundCode = fundStatement.fundingSource.code;
    exportStatementPDF(
      "Funding Source Statement",
      `Fund: ${fundCode} - ${fundStatement.fundingSource.name}`,
      `Period: ${formatDate(fundStartDate)} to ${formatDate(fundEndDate)}`,
      fundStatement.openingBalance,
      fundStatement.closingBalance,
      fundStatement.transactions,
      `Fund_Statement_${fundCode}_${startStr}_to_${endStr}.pdf`,
      true
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-lg">
            <FileSpreadsheet className="h-6 w-6 text-violet-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Statements</h1>
            <p className="text-muted-foreground text-sm">View transaction history by account or funding source</p>
          </div>
        </div>
        {activeTab === "account" && statement && (
          <div className="flex items-center gap-2">
            <Button onClick={handleExportExcel} className="gap-2 bg-green-600 hover:bg-green-700 text-white" data-testid="button-export-excel">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button onClick={handleExportPDF} className="gap-2 bg-red-600 hover:bg-red-700 text-white" data-testid="button-export-pdf">
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        )}
        {activeTab === "fund" && fundStatement && (
          <div className="flex items-center gap-2">
            <Button onClick={handleFundExportExcel} className="gap-2 bg-green-600 hover:bg-green-700 text-white" data-testid="button-fund-export-excel">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button onClick={handleFundExportPDF} className="gap-2 bg-red-600 hover:bg-red-700 text-white" data-testid="button-fund-export-pdf">
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        )}
        {activeTab === "principal" && principalStatement && (
          <div className="flex items-center gap-2">
            <Button onClick={handlePrincipalExportExcel} className="gap-2 bg-green-600 hover:bg-green-700 text-white" data-testid="button-principal-export-excel">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button onClick={handlePrincipalExportPDF} className="gap-2 bg-red-600 hover:bg-red-700 text-white" data-testid="button-principal-export-pdf">
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="account" className="gap-2" data-testid="tab-account-statement">
            <FileSpreadsheet className="h-4 w-4" /> Account Statement
          </TabsTrigger>
          <TabsTrigger value="fund" className="gap-2" data-testid="tab-fund-statement">
            <Landmark className="h-4 w-4" /> Funding Source Statement
          </TabsTrigger>
          <TabsTrigger value="principal" className="gap-2" data-testid="tab-principal-statement">
            <Banknote className="h-4 w-4" /> Principle Statement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="flex flex-col gap-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select Account & Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <QuickDateButtons setStartDate={setStartDate} setEndDate={setEndDate} />
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
        </TabsContent>

        <TabsContent value="fund" className="flex flex-col gap-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select Funding Source & Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <QuickDateButtons setStartDate={setFundStartDate} setEndDate={setFundEndDate} />
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-2 min-w-[250px]">
                    <Label>Funding Source</Label>
                    <Select value={selectedFund} onValueChange={setSelectedFund}>
                      <SelectTrigger data-testid="select-fund">
                        <SelectValue placeholder="Select a fund..." />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingSources.map((fs) => (
                          <SelectItem key={fs.id} value={fs.id}>{fs.code} - {fs.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={fundStartDate} onChange={(e) => setFundStartDate(e.target.value)} data-testid="input-fund-start-date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" value={fundEndDate} onChange={(e) => setFundEndDate(e.target.value)} data-testid="input-fund-end-date" />
                  </div>
                  <Button onClick={fetchFundStatement} disabled={!selectedFund || isFundLoading} data-testid="button-fund-generate">
                    {isFundLoading ? "Loading..." : "Generate Statement"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {fundStatement && (
            <Card className="print:shadow-none">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">{fundStatement.fundingSource.code} - {fundStatement.fundingSource.name}</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Statement period: {formatDate(fundStartDate)} to {formatDate(fundEndDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Opening Balance</p>
                    <p className="text-xl font-bold">{formatCurrency(fundStatement.openingBalance.toString())}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Entry #</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={7} className="font-medium">Opening Balance</TableCell>
                      <TableCell className="text-right font-mono font-medium">{formatCurrency(fundStatement.openingBalance.toString())}</TableCell>
                    </TableRow>
                    {fundStatement.transactions.length > 0 ? fundStatement.transactions.map((tx, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{formatDate(tx.entryDate)}</TableCell>
                        <TableCell className="font-mono">{tx.entryNumber}</TableCell>
                        <TableCell className="text-sm">{tx.accountCode} - {tx.accountName}</TableCell>
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
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No transactions found in this period.
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow className="bg-muted/20 font-semibold border-t-2">
                      <TableCell colSpan={5} className="text-right">Total</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(fundStatement.transactions.reduce((sum, tx) => sum + Number(tx.debitAmount), 0).toString())}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(fundStatement.transactions.reduce((sum, tx) => sum + Number(tx.creditAmount), 0).toString())}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell colSpan={7}>Closing Balance</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(fundStatement.closingBalance.toString())}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="principal" className="flex flex-col gap-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Funding Source Principle Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <QuickDateButtons setStartDate={setPrincipalStartDate} setEndDate={setPrincipalEndDate} />
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-2 min-w-[250px]">
                    <Label>Funding Source</Label>
                    <Select value={selectedPrincipalFund} onValueChange={setSelectedPrincipalFund}>
                      <SelectTrigger data-testid="select-principal-fund">
                        <SelectValue placeholder="Select a fund..." />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingSources.map((fs) => (
                          <SelectItem key={fs.id} value={fs.id}>{fs.code} - {fs.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={principalStartDate} onChange={(e) => setPrincipalStartDate(e.target.value)} data-testid="input-principal-start-date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" value={principalEndDate} onChange={(e) => setPrincipalEndDate(e.target.value)} data-testid="input-principal-end-date" />
                  </div>
                  <Button onClick={fetchPrincipalStatement} disabled={!selectedPrincipalFund || isPrincipalLoading} data-testid="button-principal-generate">
                    {isPrincipalLoading ? "Loading..." : "Generate Statement"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {principalStatement && (
            <Card className="print:shadow-none">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">{principalStatement.fundingSource.code} - {principalStatement.fundingSource.name}</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Principle Statement: {formatDate(principalStartDate)} to {formatDate(principalEndDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Disbursed</p>
                      <p className="text-lg font-bold text-red-600">{formatCurrency(principalStatement.summary.totalDisbursed.toString())}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Collected</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(principalStatement.summary.totalCollected.toString())}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                      <p className="text-lg font-bold">{formatCurrency(principalStatement.closingBalance.toString())}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-right">Debit (Disbursed)</TableHead>
                      <TableHead className="text-right">Credit (Collected)</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={6} className="font-medium">Opening Balance</TableCell>
                      <TableCell className="text-right font-mono font-medium">{formatCurrency(principalStatement.openingBalance.toString())}</TableCell>
                    </TableRow>
                    {principalStatement.transactions.length > 0 ? principalStatement.transactions.map((tx, idx) => (
                      <TableRow key={idx} className={tx.type === 'disbursement' ? 'bg-red-50/30 dark:bg-red-950/10' : 'bg-green-50/30 dark:bg-green-950/10'}>
                        <TableCell>{formatDate(tx.date)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tx.type === 'disbursement' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                            {tx.type === 'disbursement' ? 'Disbursed' : 'Collected'}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{tx.applicationId}</TableCell>
                        <TableCell>{tx.customerName}</TableCell>
                        <TableCell className="text-right font-mono">
                          {tx.debitAmount > 0 ? formatCurrency(tx.debitAmount.toString()) : "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {tx.creditAmount > 0 ? formatCurrency(tx.creditAmount.toString()) : "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(tx.balance.toString())}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No principal transactions found in this period.
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow className="bg-muted/20 font-semibold border-t-2">
                      <TableCell colSpan={4} className="text-right">Total</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(principalStatement.summary.totalDisbursed.toString())}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(principalStatement.summary.totalCollected.toString())}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/30 font-semibold">
                      <TableCell colSpan={6}>Closing Balance</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(principalStatement.closingBalance.toString())}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
