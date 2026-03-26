import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Search,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type AccountItem = {
  accountCode: string;
  accountName: string;
  balance: number;
};

type GroupData = {
  items: AccountItem[];
  total: number;
};

type ShareholderReportData = {
  income: {
    margin: {
      collected: GroupData;
      receivable: GroupData;
    };
    other: GroupData;
    totalCollected: number;
    totalReceivable: number;
  };
  expense: {
    fixed: GroupData;
    variable: GroupData;
    total: number;
  };
  netProfit: number;
  netProfitIncludingReceivable: number;
};

const formatCurrency = (amount: number) => {
  return `AFN ${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const CHART_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
];

export default function ShareholderReportPage() {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const [startDate, setStartDate] = useState(firstDayOfYear.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);
  const [queryDates, setQueryDates] = useState({ startDate, endDate });

  const { data, isLoading, error } = useQuery<ShareholderReportData>({
    queryKey: ["/api/reports/shareholder-report", queryDates.startDate, queryDates.endDate],
    queryFn: async () => {
      const res = await fetch(`/api/reports/shareholder-report?startDate=${queryDates.startDate}&endDate=${queryDates.endDate}`);
      if (!res.ok) throw new Error("Failed to fetch shareholder report");
      return res.json();
    },
  });

  const handleGenerate = () => {
    setQueryDates({ startDate, endDate });
  };

  const handleExportExcel = () => {
    if (!data) return;
    const rows: any[] = [];

    rows.push(["Lamen Micro Finance Institution"]);
    rows.push(["Shareholder Report"]);
    rows.push([`Period: ${queryDates.startDate} to ${queryDates.endDate}`]);
    rows.push([]);

    rows.push(["INCOME", "", "Collected Amount", "Receivable Amount"]);
    rows.push([]);
    rows.push(["Income (Margin)", "", "", ""]);
    data.income.margin.collected.items.forEach(item => {
      rows.push([`  ${item.accountCode} - ${item.accountName}`, "", formatCurrency(item.balance), ""]);
    });
    data.income.margin.receivable.items.forEach(item => {
      rows.push([`  ${item.accountCode} - ${item.accountName}`, "", "", formatCurrency(item.balance)]);
    });
    rows.push(["Subtotal Income (Margin)", "", formatCurrency(data.income.margin.collected.total), formatCurrency(data.income.margin.receivable.total)]);
    rows.push([]);

    rows.push(["Other Income", "", "", ""]);
    data.income.other.items.forEach(item => {
      rows.push([`  ${item.accountCode} - ${item.accountName}`, "", formatCurrency(item.balance), ""]);
    });
    rows.push(["Subtotal Other Income", "", formatCurrency(data.income.other.total), ""]);
    rows.push([]);
    rows.push(["TOTAL INCOME", "", formatCurrency(data.income.totalCollected), formatCurrency(data.income.totalReceivable)]);
    rows.push([]);

    rows.push(["EXPENSES", "", "Amount", ""]);
    rows.push([]);
    rows.push(["Fixed Expenses", "", "", ""]);
    data.expense.fixed.items.forEach(item => {
      rows.push([`  ${item.accountCode} - ${item.accountName}`, "", formatCurrency(item.balance), ""]);
    });
    rows.push(["Subtotal Fixed Expenses", "", formatCurrency(data.expense.fixed.total), ""]);
    rows.push([]);

    rows.push(["Variable Expenses", "", "", ""]);
    data.expense.variable.items.forEach(item => {
      rows.push([`  ${item.accountCode} - ${item.accountName}`, "", formatCurrency(item.balance), ""]);
    });
    rows.push(["Subtotal Variable Expenses", "", formatCurrency(data.expense.variable.total), ""]);
    rows.push([]);
    rows.push(["TOTAL EXPENSES", "", formatCurrency(data.expense.total), ""]);
    rows.push([]);
    rows.push(["NET PROFIT (Collected)", "", formatCurrency(data.netProfit), ""]);
    rows.push(["NET PROFIT (Including Receivable)", "", formatCurrency(data.netProfitIncludingReceivable), ""]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 45 }, { wch: 15 }, { wch: 20 }, { wch: 20 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Shareholder Report");
    XLSX.writeFile(wb, `Shareholder_Report_${queryDates.startDate}_${queryDates.endDate}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "portrait" });

    doc.setFontSize(16);
    doc.text("Lamen Micro Finance Institution", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("Shareholder Report", 105, 23, { align: "center" });
    doc.setFontSize(9);
    doc.text(`Period: ${queryDates.startDate} to ${queryDates.endDate}`, 105, 30, { align: "center" });

    const tableRows: any[] = [];
    tableRows.push([{ content: "INCOME", colSpan: 4, styles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" } }]);

    tableRows.push([{ content: "Income (Margin)", colSpan: 2, styles: { fontStyle: "bold" } }, "Collected", "Receivable"]);
    data.income.margin.collected.items.forEach(item => {
      tableRows.push([`  ${item.accountCode}`, item.accountName, formatCurrency(item.balance), "-"]);
    });
    data.income.margin.receivable.items.forEach(item => {
      tableRows.push([`  ${item.accountCode}`, item.accountName, "-", formatCurrency(item.balance)]);
    });
    tableRows.push([{ content: "Subtotal", colSpan: 2, styles: { fontStyle: "bold" } }, formatCurrency(data.income.margin.collected.total), formatCurrency(data.income.margin.receivable.total)]);

    tableRows.push([{ content: "Other Income", colSpan: 2, styles: { fontStyle: "bold" } }, "Amount", ""]);
    data.income.other.items.forEach(item => {
      tableRows.push([`  ${item.accountCode}`, item.accountName, formatCurrency(item.balance), ""]);
    });
    tableRows.push([{ content: "Subtotal Other Income", colSpan: 2, styles: { fontStyle: "bold" } }, formatCurrency(data.income.other.total), ""]);

    tableRows.push([{ content: "TOTAL INCOME", colSpan: 2, styles: { fontStyle: "bold", fillColor: [219, 234, 254] } },
      { content: formatCurrency(data.income.totalCollected), styles: { fontStyle: "bold", fillColor: [219, 234, 254] } },
      { content: formatCurrency(data.income.totalReceivable), styles: { fontStyle: "bold", fillColor: [219, 234, 254] } }]);

    tableRows.push([{ content: "EXPENSES", colSpan: 4, styles: { fillColor: [239, 68, 68], textColor: 255, fontStyle: "bold" } }]);

    tableRows.push([{ content: "Fixed Expenses", colSpan: 2, styles: { fontStyle: "bold" } }, "Amount", ""]);
    data.expense.fixed.items.forEach(item => {
      tableRows.push([`  ${item.accountCode}`, item.accountName, formatCurrency(item.balance), ""]);
    });
    tableRows.push([{ content: "Subtotal Fixed", colSpan: 2, styles: { fontStyle: "bold" } }, formatCurrency(data.expense.fixed.total), ""]);

    tableRows.push([{ content: "Variable Expenses", colSpan: 2, styles: { fontStyle: "bold" } }, "Amount", ""]);
    data.expense.variable.items.forEach(item => {
      tableRows.push([`  ${item.accountCode}`, item.accountName, formatCurrency(item.balance), ""]);
    });
    tableRows.push([{ content: "Subtotal Variable", colSpan: 2, styles: { fontStyle: "bold" } }, formatCurrency(data.expense.variable.total), ""]);

    tableRows.push([{ content: "TOTAL EXPENSES", colSpan: 2, styles: { fontStyle: "bold", fillColor: [254, 226, 226] } },
      { content: formatCurrency(data.expense.total), styles: { fontStyle: "bold", fillColor: [254, 226, 226] } },
      { content: "", styles: { fillColor: [254, 226, 226] } }]);

    const profitColor = data.netProfit >= 0 ? [220, 252, 231] : [254, 226, 226];
    tableRows.push([{ content: "NET PROFIT (Collected)", colSpan: 2, styles: { fontStyle: "bold", fillColor: profitColor } },
      { content: formatCurrency(data.netProfit), styles: { fontStyle: "bold", fillColor: profitColor } },
      { content: "", styles: { fillColor: profitColor } }]);

    tableRows.push([{ content: "NET PROFIT (Including Receivable)", colSpan: 2, styles: { fontStyle: "bold", fillColor: profitColor } },
      { content: formatCurrency(data.netProfitIncludingReceivable), styles: { fontStyle: "bold", fillColor: profitColor } },
      { content: "", styles: { fillColor: profitColor } }]);

    autoTable(doc, {
      startY: 35,
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 70 },
        2: { cellWidth: 45, halign: "right" },
        3: { cellWidth: 45, halign: "right" },
      },
    });

    doc.save(`Shareholder_Report_${queryDates.startDate}_${queryDates.endDate}.pdf`);
  };

  const incomeVsExpenseChartData = data ? [
    { name: "Margin Income", collected: data.income.margin.collected.total, receivable: data.income.margin.receivable.total },
    { name: "Other Income", collected: data.income.other.total, receivable: 0 },
    { name: "Fixed Expense", collected: data.expense.fixed.total, receivable: 0 },
    { name: "Variable Expense", collected: data.expense.variable.total, receivable: 0 },
  ] : [];

  const expenseBreakdownData = data ? [
    ...data.expense.fixed.items.filter(i => i.balance > 0).map(i => ({ name: `${i.accountCode} - ${i.accountName}`, value: i.balance })),
    ...data.expense.variable.items.filter(i => i.balance > 0).map(i => ({ name: `${i.accountCode} - ${i.accountName}`, value: i.balance })),
  ].sort((a, b) => b.value - a.value).slice(0, 10) : [];

  const summaryPieData = data ? [
    { name: "Total Collected Income", value: Math.max(0, data.income.totalCollected) },
    { name: "Total Receivable", value: Math.max(0, data.income.totalReceivable) },
    { name: "Total Expenses", value: Math.max(0, data.expense.total) },
  ].filter(d => d.value > 0) : [];

  const PIE_COLORS = ["#10b981", "#3b82f6", "#ef4444"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2" data-testid="text-page-title">
              <BarChart3 className="h-7 w-7 text-blue-600" />
              Shareholder Report
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Lamen Micro Finance Institution - Financial Summary for Shareholders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={!data} data-testid="button-export-excel">
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={!data} data-testid="button-export-pdf">
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1 min-w-[180px]">
                <Label htmlFor="startDate" className="text-xs font-medium text-muted-foreground">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                  data-testid="input-start-date"
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <Label htmlFor="endDate" className="text-xs font-medium text-muted-foreground">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                  data-testid="input-end-date"
                />
              </div>
              <Button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-700" data-testid="button-generate">
                <Search className="h-4 w-4 mr-1" />
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <CardContent className="p-4 text-red-700 dark:text-red-300">
              Failed to load shareholder report. Please try again.
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total Collected Income</p>
                      <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mt-1" data-testid="text-total-collected">
                        {formatCurrency(data.income.totalCollected)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Total Receivable</p>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 mt-1" data-testid="text-total-receivable">
                        {formatCurrency(data.income.totalReceivable)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                      <ArrowUpRight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-800 dark:text-red-200 mt-1" data-testid="text-total-expenses">
                        {formatCurrency(data.expense.total)}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center">
                      <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${data.netProfit >= 0
                ? "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800"
                : "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800"
              }`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-wider ${data.netProfit >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-orange-600 dark:text-orange-400"
                      }`}>Net Profit</p>
                      <p className={`text-2xl font-bold mt-1 ${data.netProfit >= 0
                        ? "text-green-800 dark:text-green-200"
                        : "text-orange-800 dark:text-orange-200"
                      }`} data-testid="text-net-profit">
                        {data.netProfit < 0 ? "(" : ""}{formatCurrency(data.netProfit)}{data.netProfit < 0 ? ")" : ""}
                      </p>
                    </div>
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${data.netProfit >= 0
                      ? "bg-green-200 dark:bg-green-800"
                      : "bg-orange-200 dark:bg-orange-800"
                    }`}>
                      <DollarSign className={`h-6 w-6 ${data.netProfit >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-orange-600 dark:text-orange-400"
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Income vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={incomeVsExpenseChartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="receivable" name="Receivable" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={summaryPieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {summaryPieData.map((_, index) => (
                          <Cell key={index} fill={PIE_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {expenseBreakdownData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Top 10 Expense Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={expenseBreakdownData} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={140} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="value" name="Amount" fill="#ef4444" radius={[0, 4, 4, 0]}>
                        {expenseBreakdownData.map((_, index) => (
                          <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-emerald-200 dark:border-emerald-800">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-lg py-3 px-5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Income
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y dark:divide-gray-700">
                    <div className="bg-emerald-50 dark:bg-emerald-950/50 px-5 py-2">
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Income (Margin)</p>
                    </div>

                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                          <th className="text-left px-5 py-2 font-medium text-muted-foreground">Account</th>
                          <th className="text-right px-5 py-2 font-medium text-muted-foreground">Collected</th>
                          <th className="text-right px-5 py-2 font-medium text-muted-foreground">Receivable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.income.margin.collected.items.map((item) => {
                          const receivableItem = data.income.margin.receivable.items.find(
                            (r) => r.accountCode === "20900"
                          );
                          return (
                            <tr key={item.accountCode} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                              <td className="px-5 py-2.5">
                                <span className="text-xs text-muted-foreground mr-2">{item.accountCode}</span>
                                {item.accountName}
                              </td>
                              <td className="text-right px-5 py-2.5 font-medium text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(item.balance)}
                              </td>
                              <td className="text-right px-5 py-2.5 font-medium text-blue-600 dark:text-blue-400">
                                {receivableItem ? formatCurrency(receivableItem.balance) : "-"}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold">
                          <td className="px-5 py-2">Subtotal</td>
                          <td className="text-right px-5 py-2 text-emerald-700 dark:text-emerald-300">{formatCurrency(data.income.margin.collected.total)}</td>
                          <td className="text-right px-5 py-2 text-blue-700 dark:text-blue-300">{formatCurrency(data.income.margin.receivable.total)}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="bg-emerald-50 dark:bg-emerald-950/50 px-5 py-2 mt-2">
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Other Income</p>
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        {data.income.other.items.map((item) => (
                          <tr key={item.accountCode} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                            <td className="px-5 py-2.5">
                              <span className="text-xs text-muted-foreground mr-2">{item.accountCode}</span>
                              {item.accountName}
                            </td>
                            <td className="text-right px-5 py-2.5 font-medium text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(item.balance)}
                            </td>
                            <td className="text-right px-5 py-2.5 text-muted-foreground">-</td>
                          </tr>
                        ))}
                        <tr className="bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold">
                          <td className="px-5 py-2">Subtotal</td>
                          <td className="text-right px-5 py-2 text-emerald-700 dark:text-emerald-300">{formatCurrency(data.income.other.total)}</td>
                          <td className="text-right px-5 py-2">-</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="bg-emerald-100 dark:bg-emerald-900 px-5 py-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-800 dark:text-emerald-200">TOTAL INCOME</span>
                        <div className="flex gap-8">
                          <span className="font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(data.income.totalCollected)}</span>
                          <span className="font-bold text-blue-700 dark:text-blue-300">{formatCurrency(data.income.totalReceivable)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-800">
                <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg py-3 px-5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y dark:divide-gray-700">
                    <div className="bg-red-50 dark:bg-red-950/50 px-5 py-2">
                      <p className="text-sm font-semibold text-red-700 dark:text-red-300">Fixed Expenses</p>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                          <th className="text-left px-5 py-2 font-medium text-muted-foreground">Account</th>
                          <th className="text-right px-5 py-2 font-medium text-muted-foreground">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.expense.fixed.items.map((item) => (
                          <tr key={item.accountCode} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                            <td className="px-5 py-2.5">
                              <span className="text-xs text-muted-foreground mr-2">{item.accountCode}</span>
                              {item.accountName}
                            </td>
                            <td className="text-right px-5 py-2.5 font-medium text-red-600 dark:text-red-400">
                              {formatCurrency(item.balance)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-red-50/50 dark:bg-red-950/30 font-semibold">
                          <td className="px-5 py-2">Subtotal Fixed</td>
                          <td className="text-right px-5 py-2 text-red-700 dark:text-red-300">{formatCurrency(data.expense.fixed.total)}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="bg-red-50 dark:bg-red-950/50 px-5 py-2">
                      <p className="text-sm font-semibold text-red-700 dark:text-red-300">Variable Expenses</p>
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        {data.expense.variable.items.map((item) => (
                          <tr key={item.accountCode} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                            <td className="px-5 py-2.5">
                              <span className="text-xs text-muted-foreground mr-2">{item.accountCode}</span>
                              {item.accountName}
                            </td>
                            <td className="text-right px-5 py-2.5 font-medium text-red-600 dark:text-red-400">
                              {formatCurrency(item.balance)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-red-50/50 dark:bg-red-950/30 font-semibold">
                          <td className="px-5 py-2">Subtotal Variable</td>
                          <td className="text-right px-5 py-2 text-red-700 dark:text-red-300">{formatCurrency(data.expense.variable.total)}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="bg-red-100 dark:bg-red-900 px-5 py-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-red-800 dark:text-red-200">TOTAL EXPENSES</span>
                        <span className="font-bold text-red-700 dark:text-red-300">{formatCurrency(data.expense.total)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className={`border-2 ${data.netProfit >= 0
              ? "border-green-300 dark:border-green-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
              : "border-orange-300 dark:border-orange-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950"
            }`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${data.netProfit >= 0
                      ? "bg-green-200 dark:bg-green-800"
                      : "bg-orange-200 dark:bg-orange-800"
                    }`}>
                      <DollarSign className={`h-8 w-8 ${data.netProfit >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-orange-600 dark:text-orange-400"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Net Profit (Collected Only)</p>
                      <p className={`text-3xl font-bold ${data.netProfit >= 0
                        ? "text-green-700 dark:text-green-300"
                        : "text-orange-700 dark:text-orange-300"
                      }`} data-testid="text-net-profit-collected">
                        {data.netProfit < 0 ? "(" : ""}{formatCurrency(data.netProfit)}{data.netProfit < 0 ? ")" : ""}
                      </p>
                      <Badge variant={data.netProfit >= 0 ? "default" : "destructive"} className="mt-1">
                        {data.netProfit >= 0 ? "Profitable" : "Loss"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${data.netProfitIncludingReceivable >= 0
                      ? "bg-blue-200 dark:bg-blue-800"
                      : "bg-orange-200 dark:bg-orange-800"
                    }`}>
                      <TrendingUp className={`h-8 w-8 ${data.netProfitIncludingReceivable >= 0
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-orange-600 dark:text-orange-400"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Net Profit (Including Receivable)</p>
                      <p className={`text-3xl font-bold ${data.netProfitIncludingReceivable >= 0
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-orange-700 dark:text-orange-300"
                      }`} data-testid="text-net-profit-receivable">
                        {data.netProfitIncludingReceivable < 0 ? "(" : ""}{formatCurrency(data.netProfitIncludingReceivable)}{data.netProfitIncludingReceivable < 0 ? ")" : ""}
                      </p>
                      <Badge variant={data.netProfitIncludingReceivable >= 0 ? "default" : "destructive"} className="mt-1">
                        {data.netProfitIncludingReceivable >= 0 ? "Profitable" : "Loss"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
