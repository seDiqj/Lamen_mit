import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Target,
  Lightbulb,
  PieChart,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type BreakdownItem = {
  accountCode: string;
  accountName: string;
  amount: number;
};

type ProfitabilityData = {
  totalIncome: number;
  totalExpenses: number;
  netProfitLoss: number;
  isProfitable: boolean;
  profitMargin: number;
  incomeBreakdown: BreakdownItem[];
  expenseBreakdown: BreakdownItem[];
  totalDisbursedLoans: number;
  totalDisbursedAmount: number;
  totalMarginIncome: number;
  avgMarginRate: number;
  requiredDisbursement: number;
  recommendations: string[];
};

function formatAFN(amount: number): string {
  return `AFN ${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatNum(amount: number): string {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ProfitabilityAnalysis() {
  const [data, setData] = useState<ProfitabilityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showIncomeBreakdown, setShowIncomeBreakdown] = useState(false);
  const [showExpenseBreakdown, setShowExpenseBreakdown] = useState(false);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reports/profitability-analysis", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch profitability analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!data) return;
    const rows: any[] = [];
    rows.push({ Section: "PROFITABILITY ANALYSIS", Account: "", Amount: "" });
    rows.push({ Section: "Lamen Microfinance Institution", Account: "", Amount: "" });
    rows.push({ Section: "", Account: "", Amount: "" });

    rows.push({ Section: "INCOME", Account: "", Amount: "" });
    data.incomeBreakdown.forEach(item => {
      rows.push({ Section: "", Account: `${item.accountCode} ${item.accountName}`, Amount: item.amount });
    });
    rows.push({ Section: "", Account: "Total Income", Amount: data.totalIncome });
    rows.push({ Section: "", Account: "", Amount: "" });

    rows.push({ Section: "EXPENSES", Account: "", Amount: "" });
    data.expenseBreakdown.forEach(item => {
      rows.push({ Section: "", Account: `${item.accountCode} ${item.accountName}`, Amount: item.amount });
    });
    rows.push({ Section: "", Account: "Total Expenses", Amount: data.totalExpenses });
    rows.push({ Section: "", Account: "", Amount: "" });

    rows.push({ Section: "", Account: data.isProfitable ? "NET PROFIT" : "NET LOSS", Amount: data.netProfitLoss });
    rows.push({ Section: "", Account: "Profit Margin", Amount: `${data.profitMargin.toFixed(2)}%` });
    rows.push({ Section: "", Account: "", Amount: "" });

    rows.push({ Section: "LOAN PORTFOLIO", Account: "", Amount: "" });
    rows.push({ Section: "", Account: "Total Disbursed Loans", Amount: data.totalDisbursedLoans });
    rows.push({ Section: "", Account: "Total Disbursed Amount", Amount: data.totalDisbursedAmount });
    rows.push({ Section: "", Account: "Average Margin Rate", Amount: `${data.avgMarginRate.toFixed(2)}%` });
    rows.push({ Section: "", Account: "", Amount: "" });

    if (!data.isProfitable) {
      rows.push({ Section: "RECOMMENDATION", Account: "", Amount: "" });
      rows.push({ Section: "", Account: "Required Disbursement to Break Even", Amount: data.requiredDisbursement });
    }

    rows.push({ Section: "", Account: "", Amount: "" });
    data.recommendations.forEach(rec => {
      rows.push({ Section: "", Account: rec, Amount: "" });
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 25 }, { wch: 60 }, { wch: 25 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profitability Analysis");
    XLSX.writeFile(wb, `Profitability_Analysis_${Date.now()}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Profitability Analysis", 105, 18, { align: "center" });
    doc.setFontSize(11);
    doc.text("Lamen Microfinance Institution (LMI)", 105, 26, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 105, 33, { align: "center" });

    const tableData: any[] = [];

    tableData.push([{ content: "Income Breakdown", colSpan: 2, styles: { fontStyle: "bold", fillColor: [220, 252, 231] } }]);
    data.incomeBreakdown.forEach(item => {
      tableData.push([`${item.accountCode} ${item.accountName}`, { content: formatNum(item.amount), styles: { halign: "right" } }]);
    });
    tableData.push([{ content: "Total Income", styles: { fontStyle: "bold" } }, { content: formatNum(data.totalIncome), styles: { fontStyle: "bold", halign: "right" } }]);
    tableData.push(["", ""]);

    tableData.push([{ content: "Expense Breakdown", colSpan: 2, styles: { fontStyle: "bold", fillColor: [254, 226, 226] } }]);
    data.expenseBreakdown.forEach(item => {
      tableData.push([`${item.accountCode} ${item.accountName}`, { content: formatNum(item.amount), styles: { halign: "right" } }]);
    });
    tableData.push([{ content: "Total Expenses", styles: { fontStyle: "bold" } }, { content: formatNum(data.totalExpenses), styles: { fontStyle: "bold", halign: "right" } }]);
    tableData.push(["", ""]);

    const bgColor = data.isProfitable ? [220, 252, 231] : [254, 226, 226];
    tableData.push([
      { content: data.isProfitable ? "Net Profit" : "Net Loss", styles: { fontStyle: "bold", fillColor: bgColor } },
      { content: formatNum(data.netProfitLoss), styles: { fontStyle: "bold", halign: "right", fillColor: bgColor } },
    ]);
    tableData.push(["", ""]);

    if (!data.isProfitable) {
      tableData.push([{ content: "Recommendation", colSpan: 2, styles: { fontStyle: "bold", fillColor: [254, 249, 195] } }]);
      tableData.push(["Required Loan Disbursement to Break Even", { content: formatNum(data.requiredDisbursement), styles: { halign: "right", fontStyle: "bold" } }]);
    }

    tableData.push(["", ""]);
    data.recommendations.forEach(rec => {
      tableData.push([{ content: rec, colSpan: 2 }]);
    });

    autoTable(doc, {
      startY: 40,
      head: [["Description", "Amount (AFN)"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 50, halign: "right" } },
      styles: { fontSize: 8, cellPadding: 2 },
    });

    doc.save(`Profitability_Analysis_${Date.now()}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <PieChart className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Profitability Analysis</h1>
            <p className="text-muted-foreground text-sm">Company financial health and recommendations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchAnalysis} disabled={isLoading} data-testid="button-generate">
            {isLoading ? "Analyzing..." : "Generate Analysis"}
          </Button>
          {data && (
            <>
              <Button onClick={handleExportExcel} className="gap-2 bg-green-600 hover:bg-green-700 text-white" data-testid="button-export-excel">
                <FileSpreadsheet className="h-4 w-4" /> Excel
              </Button>
              <Button onClick={handleExportPDF} className="gap-2 bg-red-600 hover:bg-red-700 text-white" data-testid="button-export-pdf">
                <FileText className="h-4 w-4" /> PDF
              </Button>
            </>
          )}
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-green-500" data-testid="card-total-income">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Income (Till Date)</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatAFN(data.totalIncome)}</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500" data-testid="card-total-expenses">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses (Till Date)</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatAFN(data.totalExpenses)}</p>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-l-4 ${data.isProfitable ? 'border-l-emerald-500' : 'border-l-orange-500'}`} data-testid="card-net-profit-loss">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{data.isProfitable ? "Net Profit" : "Net Loss"} (Till Date)</p>
                    <p className={`text-2xl font-bold ${data.isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {data.netProfitLoss < 0 ? "-" : ""}{formatAFN(data.netProfitLoss)}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${data.isProfitable ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                    <DollarSign className={`h-5 w-5 ${data.isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-l-4 ${data.isProfitable ? 'border-l-blue-500' : 'border-l-red-500'}`} data-testid="card-profitability-status">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Profitability Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={data.isProfitable ? "default" : "destructive"} className="text-sm">
                        {data.isProfitable ? "Profitable" : "Not Profitable"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Margin: {data.profitMargin.toFixed(2)}%</p>
                  </div>
                  <div className={`p-2 rounded-lg ${data.isProfitable ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {data.isProfitable
                      ? <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      : <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card data-testid="card-income-breakdown">
              <CardHeader className="pb-2">
                <button
                  type="button"
                  className="flex items-center gap-2 w-full text-left"
                  onClick={() => setShowIncomeBreakdown(!showIncomeBreakdown)}
                  data-testid="button-toggle-income"
                >
                  {showIncomeBreakdown ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <CardTitle className="text-lg text-green-700 dark:text-green-400">Income Breakdown</CardTitle>
                  <Badge variant="outline" className="ml-auto">{data.incomeBreakdown.length} accounts</Badge>
                </button>
              </CardHeader>
              {showIncomeBreakdown && (
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {data.incomeBreakdown.map((item) => (
                      <div
                        key={item.accountCode}
                        className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 text-sm"
                        data-testid={`row-income-${item.accountCode}`}
                      >
                        <span>{item.accountCode} {item.accountName}</span>
                        <span className="font-mono font-medium text-green-700 dark:text-green-400">{formatNum(item.amount)}</span>
                      </div>
                    ))}
                    {data.incomeBreakdown.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No income recorded yet</p>
                    )}
                    <div className="flex items-center justify-between py-2 px-2 rounded bg-green-50 dark:bg-green-950/30 font-semibold text-sm border-t">
                      <span>Total Income</span>
                      <span className="font-mono text-green-700 dark:text-green-400">{formatAFN(data.totalIncome)}</span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            <Card data-testid="card-expense-breakdown">
              <CardHeader className="pb-2">
                <button
                  type="button"
                  className="flex items-center gap-2 w-full text-left"
                  onClick={() => setShowExpenseBreakdown(!showExpenseBreakdown)}
                  data-testid="button-toggle-expenses"
                >
                  {showExpenseBreakdown ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <CardTitle className="text-lg text-red-700 dark:text-red-400">Expense Breakdown</CardTitle>
                  <Badge variant="outline" className="ml-auto">{data.expenseBreakdown.length} accounts</Badge>
                </button>
              </CardHeader>
              {showExpenseBreakdown && (
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {data.expenseBreakdown.map((item) => (
                      <div
                        key={item.accountCode}
                        className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 text-sm"
                        data-testid={`row-expense-${item.accountCode}`}
                      >
                        <span>{item.accountCode} {item.accountName}</span>
                        <span className="font-mono font-medium text-red-700 dark:text-red-400">{formatNum(item.amount)}</span>
                      </div>
                    ))}
                    {data.expenseBreakdown.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No expenses recorded yet</p>
                    )}
                    <div className="flex items-center justify-between py-2 px-2 rounded bg-red-50 dark:bg-red-950/30 font-semibold text-sm border-t">
                      <span>Total Expenses</span>
                      <span className="font-mono text-red-700 dark:text-red-400">{formatAFN(data.totalExpenses)}</span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          <Card data-testid="card-loan-portfolio">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Loan Portfolio Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-sm text-muted-foreground">Total Disbursed Loans</p>
                  <p className="text-xl font-bold" data-testid="text-disbursed-count">{data.totalDisbursedLoans}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-sm text-muted-foreground">Total Disbursed Amount</p>
                  <p className="text-xl font-bold" data-testid="text-disbursed-amount">{formatAFN(data.totalDisbursedAmount)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-sm text-muted-foreground">Average Margin Rate</p>
                  <p className="text-xl font-bold" data-testid="text-margin-rate">{data.avgMarginRate.toFixed(2)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${data.isProfitable ? 'border-green-200 dark:border-green-800' : 'border-amber-200 dark:border-amber-800'} border-2`} data-testid="card-recommendations">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className={`h-5 w-5 ${data.isProfitable ? 'text-green-500' : 'text-amber-500'}`} />
                {data.isProfitable ? "Performance Summary" : "Recommendations to Achieve Profitability"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!data.isProfitable && data.requiredDisbursement > 0 && (
                <div className="mb-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-300">Loan Disbursement Required to Break Even</p>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1" data-testid="text-required-disbursement">
                        {formatAFN(data.requiredDisbursement)}
                      </p>
                      <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                        Based on average margin rate of {data.avgMarginRate.toFixed(2)}%, the company needs to disburse this additional loan amount to generate enough margin income to cover the current loss.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {data.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm" data-testid={`text-recommendation-${idx}`}>
                    <span className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${data.isProfitable ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-bold ${
              data.isProfitable 
                ? 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300 border-2 border-green-300 dark:border-green-700'
                : 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border-2 border-red-300 dark:border-red-700'
            }`} data-testid="text-verdict">
              {data.isProfitable ? (
                <>
                  <CheckCircle className="h-6 w-6" />
                  The Company is PROFITABLE
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6" />
                  The Company is NOT PROFITABLE
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
