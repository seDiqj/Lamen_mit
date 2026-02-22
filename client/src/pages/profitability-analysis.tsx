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
  Calendar,
  ArrowUpRight,
  Calculator,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type BreakdownItem = {
  accountCode: string;
  accountName: string;
  amount: number;
};

type LoanModelBreakdown = {
  oldModel: {
    count: number;
    totalPrincipal: number;
    totalMarginOneTime: number;
    description: string;
  };
  newModel: {
    count: number;
    totalPrincipal: number;
    avgAnnualRate: number;
    description: string;
  };
  cutoffDate: string;
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
  avgMarginRate: number;
  requiredDisbursement: number;
  recommendations: string[];
  loanModelBreakdown: LoanModelBreakdown;
  projectionRate: number;
  breakEvenProjection: { annualIncome: number; monthlyIncome: number };
  additionalScenario: {
    amount: number;
    annualIncome: number;
    monthlyIncome: number;
    monthlyNetProfit: number;
  };
  monthlyExpenses: number;
  monthlyIncome: number;
  periodMonths: number;
  annualizedLoss: number;
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
  const [showLoanModelDetails, setShowLoanModelDetails] = useState(false);

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
    rows.push({ Section: "", Account: "Projection Margin Rate (Annual)", Amount: `${data.projectionRate.toFixed(2)}%` });
    rows.push({ Section: "", Account: "", Amount: "" });

    rows.push({ Section: "LOAN MODEL BREAKDOWN", Account: "", Amount: "" });
    rows.push({ Section: "", Account: `Old Model (Before ${data.loanModelBreakdown.cutoffDate}) - ${data.loanModelBreakdown.oldModel.description}`, Amount: "" });
    rows.push({ Section: "", Account: `  Loans Count`, Amount: data.loanModelBreakdown.oldModel.count });
    rows.push({ Section: "", Account: `  Total Principal`, Amount: data.loanModelBreakdown.oldModel.totalPrincipal });
    rows.push({ Section: "", Account: `New Model (After ${data.loanModelBreakdown.cutoffDate}) - ${data.loanModelBreakdown.newModel.description}`, Amount: "" });
    rows.push({ Section: "", Account: `  Loans Count`, Amount: data.loanModelBreakdown.newModel.count });
    rows.push({ Section: "", Account: `  Total Principal`, Amount: data.loanModelBreakdown.newModel.totalPrincipal });
    rows.push({ Section: "", Account: `  Avg Annual Rate`, Amount: `${data.loanModelBreakdown.newModel.avgAnnualRate.toFixed(2)}%` });
    rows.push({ Section: "", Account: "", Amount: "" });

    if (!data.isProfitable && data.requiredDisbursement > 0) {
      rows.push({ Section: "BREAK-EVEN ANALYSIS", Account: "", Amount: "" });
      rows.push({ Section: "", Account: "Additional Disbursement Required to Break Even", Amount: data.requiredDisbursement });
      rows.push({ Section: "", Account: "Projected Annual Income from Break-Even Disbursement", Amount: data.breakEvenProjection.annualIncome });
      rows.push({ Section: "", Account: "Projected Monthly Income from Break-Even Disbursement", Amount: data.breakEvenProjection.monthlyIncome });
      rows.push({ Section: "", Account: "", Amount: "" });
    }

    const totalScenarioAmt = data.requiredDisbursement + data.additionalScenario.amount;
    const totalScenarioAnnual = totalScenarioAmt * data.projectionRate / 100;
    const annualExp = data.monthlyExpenses * 12;

    rows.push({ Section: "SCENARIO: BREAK-EVEN + AFN 10M", Account: "", Amount: "" });
    rows.push({ Section: "", Account: "Break-Even Disbursement", Amount: data.requiredDisbursement });
    rows.push({ Section: "", Account: "+ Additional Amount", Amount: data.additionalScenario.amount });
    rows.push({ Section: "", Account: "Total Disbursement", Amount: totalScenarioAmt });
    rows.push({ Section: "", Account: "Annual Margin Income", Amount: totalScenarioAnnual });
    rows.push({ Section: "", Account: "Monthly Margin Income", Amount: totalScenarioAnnual / 12 });
    rows.push({ Section: "", Account: "", Amount: "" });

    rows.push({ Section: "4-YEAR PROJECTION", Account: "", Amount: "" });
    for (let y = 1; y <= 4; y++) {
      rows.push({ Section: `Year ${y}`, Account: "Suggested Disbursement (Cumulative)", Amount: totalScenarioAmt * y });
      rows.push({ Section: "", Account: "Margin Income (Cumulative)", Amount: totalScenarioAnnual * y });
      rows.push({ Section: "", Account: "Expenditure (Cumulative)", Amount: annualExp * y });
      rows.push({ Section: "", Account: "Net Profit / Loss", Amount: (totalScenarioAnnual * y) - (annualExp * y) });
      rows.push({ Section: "", Account: "", Amount: "" });
    }

    data.recommendations.forEach(rec => {
      rows.push({ Section: "", Account: rec, Amount: "" });
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 30 }, { wch: 65 }, { wch: 25 }];
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

    tableData.push([{ content: "Loan Model Breakdown", colSpan: 2, styles: { fontStyle: "bold", fillColor: [219, 234, 254] } }]);
    tableData.push([`Old Model (Before ${data.loanModelBreakdown.cutoffDate})`, { content: `${data.loanModelBreakdown.oldModel.count} loans - ${formatNum(data.loanModelBreakdown.oldModel.totalPrincipal)}`, styles: { halign: "right" } }]);
    tableData.push([`New Model (After ${data.loanModelBreakdown.cutoffDate})`, { content: `${data.loanModelBreakdown.newModel.count} loans - ${formatNum(data.loanModelBreakdown.newModel.totalPrincipal)}`, styles: { halign: "right" } }]);
    tableData.push([`Annual Margin Rate for Projections`, { content: `${data.projectionRate.toFixed(2)}%`, styles: { halign: "right", fontStyle: "bold" } }]);
    tableData.push(["", ""]);

    if (!data.isProfitable && data.requiredDisbursement > 0) {
      tableData.push([{ content: "Break-Even Analysis", colSpan: 2, styles: { fontStyle: "bold", fillColor: [254, 249, 195] } }]);
      tableData.push(["Additional Disbursement Required", { content: formatNum(data.requiredDisbursement), styles: { halign: "right", fontStyle: "bold" } }]);
      tableData.push(["Projected Annual Income", { content: formatNum(data.breakEvenProjection.annualIncome), styles: { halign: "right" } }]);
      tableData.push(["Projected Monthly Income", { content: formatNum(data.breakEvenProjection.monthlyIncome), styles: { halign: "right" } }]);
      tableData.push(["", ""]);
    }

    const pdfTotalScenario = data.requiredDisbursement + data.additionalScenario.amount;
    const pdfTotalAnnual = pdfTotalScenario * data.projectionRate / 100;
    const pdfAnnualExp = data.monthlyExpenses * 12;

    tableData.push([{ content: "Scenario: Break-Even + AFN 10M", colSpan: 2, styles: { fontStyle: "bold", fillColor: [237, 233, 254] } }]);
    tableData.push(["Break-Even Disbursement", { content: formatNum(data.requiredDisbursement), styles: { halign: "right" } }]);
    tableData.push(["+ Additional Amount", { content: formatNum(data.additionalScenario.amount), styles: { halign: "right" } }]);
    tableData.push(["Total Disbursement", { content: formatNum(pdfTotalScenario), styles: { halign: "right", fontStyle: "bold" } }]);
    tableData.push(["Annual Margin Income", { content: formatNum(pdfTotalAnnual), styles: { halign: "right" } }]);
    tableData.push(["Monthly Margin Income", { content: formatNum(pdfTotalAnnual / 12), styles: { halign: "right" } }]);
    tableData.push(["", ""]);

    tableData.push([{ content: "4-Year Projection", colSpan: 2, styles: { fontStyle: "bold", fillColor: [224, 231, 255] } }]);
    for (let y = 1; y <= 4; y++) {
      const yMargin = pdfTotalAnnual * y;
      const yExp = pdfAnnualExp * y;
      const yNet = yMargin - yExp;
      tableData.push([{ content: `Year ${y}`, styles: { fontStyle: "bold" } }, ""]);
      tableData.push(["  Suggested Disbursement (Cumulative)", { content: formatNum(pdfTotalScenario * y), styles: { halign: "right" } }]);
      tableData.push(["  Margin Income (Cumulative)", { content: formatNum(yMargin), styles: { halign: "right" } }]);
      tableData.push(["  Expenditure (Cumulative)", { content: formatNum(yExp), styles: { halign: "right" } }]);
      tableData.push(["  Net Profit / Loss", { content: `${yNet < 0 ? "-" : ""}${formatNum(Math.abs(yNet))}`, styles: { halign: "right", fontStyle: "bold" } }]);
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
            <p className="text-muted-foreground text-sm">Company financial health, projections, and recommendations</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-sm text-muted-foreground">Total Disbursed Loans</p>
                  <p className="text-xl font-bold" data-testid="text-disbursed-count">{data.totalDisbursedLoans}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-sm text-muted-foreground">Total Disbursed Amount</p>
                  <p className="text-xl font-bold" data-testid="text-disbursed-amount">{formatAFN(data.totalDisbursedAmount)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-sm text-muted-foreground">Annual Margin Rate (for projections)</p>
                  <p className="text-xl font-bold" data-testid="text-margin-rate">{data.projectionRate.toFixed(2)}%</p>
                </div>
              </div>

              <button
                type="button"
                className="flex items-center gap-2 w-full text-left text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-2"
                onClick={() => setShowLoanModelDetails(!showLoanModelDetails)}
                data-testid="button-toggle-loan-model"
              >
                {showLoanModelDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Calendar className="h-4 w-4" />
                Loan Model Breakdown (Old vs New)
              </button>

              {showLoanModelDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700">Old Model</Badge>
                      <span className="text-xs text-muted-foreground">Before {data.loanModelBreakdown.cutoffDate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{data.loanModelBreakdown.oldModel.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Loans</span>
                        <span className="font-medium">{data.loanModelBreakdown.oldModel.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Principal</span>
                        <span className="font-mono font-medium">{formatAFN(data.loanModelBreakdown.oldModel.totalPrincipal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Margin (One-time)</span>
                        <span className="font-mono font-medium">{formatAFN(data.loanModelBreakdown.oldModel.totalMarginOneTime)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700">New Model</Badge>
                      <span className="text-xs text-muted-foreground">After {data.loanModelBreakdown.cutoffDate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{data.loanModelBreakdown.newModel.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Loans</span>
                        <span className="font-medium">{data.loanModelBreakdown.newModel.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Principal</span>
                        <span className="font-mono font-medium">{formatAFN(data.loanModelBreakdown.newModel.totalPrincipal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Annual Rate</span>
                        <span className="font-mono font-medium">{data.loanModelBreakdown.newModel.avgAnnualRate.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {!data.isProfitable && data.requiredDisbursement > 0 && (
            <Card className="border-2 border-amber-200 dark:border-amber-800" data-testid="card-break-even">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-amber-500" />
                  Break-Even Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-300">Additional Loan Disbursement Required to Break Even</p>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1" data-testid="text-required-disbursement">
                        {formatAFN(data.requiredDisbursement)}
                      </p>
                      <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                        This is the <strong>additional</strong> amount the company needs to disburse in new loans (on top of existing portfolio). The total loss of {formatAFN(data.netProfitLoss)} over {data.periodMonths.toFixed(1)} months is annualized to {formatAFN(data.annualizedLoss)}/year. At {data.projectionRate.toFixed(2)}% annual margin rate, this disbursement would generate enough margin income to cover the annualized loss.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <p className="text-xs text-muted-foreground">If Company Disburses This Amount</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-400 mt-1">{formatAFN(data.requiredDisbursement)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <p className="text-xs text-muted-foreground">Annual Margin Income Earned</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-400 mt-1">{formatAFN(data.breakEvenProjection.annualIncome)}</p>
                    <p className="text-xs text-muted-foreground">= covers the current loss</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <p className="text-xs text-muted-foreground">Monthly Margin Income Earned</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-400 mt-1">{formatAFN(data.breakEvenProjection.monthlyIncome)}</p>
                    <p className="text-xs text-muted-foreground">per month from this disbursement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(() => {
            const totalScenarioAmount = data.requiredDisbursement + data.additionalScenario.amount;
            const totalScenarioAnnualIncome = totalScenarioAmount * data.projectionRate / 100;
            const totalScenarioMonthlyIncome = totalScenarioAnnualIncome / 12;
            const annualizedExpenses = data.monthlyExpenses * 12;

            return (
              <>
                <Card className="border-2 border-purple-200 dark:border-purple-800" data-testid="card-scenario-10m">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ArrowUpRight className="h-5 w-5 text-purple-500" />
                      Scenario: Break-Even Amount + Additional AFN 10,000,000
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      What happens if the company disburses the suggested break-even amount ({formatAFN(data.requiredDisbursement)}) plus an additional AFN 10 million?
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-muted-foreground">Break-Even Disbursement</p>
                        <p className="text-lg font-bold text-purple-700 dark:text-purple-400 mt-1">{formatAFN(data.requiredDisbursement)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-muted-foreground">+ Additional Amount</p>
                        <p className="text-lg font-bold text-purple-700 dark:text-purple-400 mt-1">{formatAFN(data.additionalScenario.amount)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-muted-foreground">Total Disbursement</p>
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-400 mt-1">{formatAFN(totalScenarioAmount)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                        <p className="text-xs text-muted-foreground">Annual Margin Income</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-400 mt-1">{formatAFN(totalScenarioAnnualIncome)}</p>
                        <p className="text-xs text-muted-foreground">at {data.projectionRate.toFixed(2)}% annual rate</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                        <p className="text-xs text-muted-foreground">Monthly Margin Income</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-400 mt-1">{formatAFN(totalScenarioMonthlyIncome)}</p>
                        <p className="text-xs text-muted-foreground">earned each month</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 mb-4">
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Net Annual Profit from this scenario: <strong>{formatAFN(totalScenarioAnnualIncome - data.annualizedLoss)}</strong> per year
                        ({formatAFN((totalScenarioAnnualIncome - data.annualizedLoss) / 12)} per month)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        The additional AFN 10M beyond break-even generates {formatAFN(data.additionalScenario.amount * data.projectionRate / 100)} extra margin income per year
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-indigo-200 dark:border-indigo-800" data-testid="card-4year-projection">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-indigo-500" />
                      4-Year Projection (Suggested Disbursement + AFN 10M Additional)
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Yearly breakdown of disbursement, margin income, expenses, and net profit/loss
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Year</th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium">Suggested Disbursement</th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium">Margin Income</th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium">Expenditure</th>
                            <th className="text-right py-2 px-3 text-muted-foreground font-medium">Net Profit / Loss</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: 4 }, (_, i) => {
                            const yearNum = i + 1;
                            const cumulativeDisbursement = totalScenarioAmount * yearNum;
                            const yearMarginIncome = totalScenarioAnnualIncome * yearNum;
                            const yearExpenditure = annualizedExpenses * yearNum;
                            const yearNetProfit = yearMarginIncome - yearExpenditure;
                            const isPositive = yearNetProfit > 0;

                            return (
                              <tr key={i} className="border-b border-muted/50 hover:bg-muted/30" data-testid={`row-year-${yearNum}`}>
                                <td className="py-2 px-3 font-medium">Year {yearNum}</td>
                                <td className="text-right py-2 px-3 font-mono text-blue-700 dark:text-blue-400">{formatNum(cumulativeDisbursement)}</td>
                                <td className="text-right py-2 px-3 font-mono text-green-700 dark:text-green-400">{formatNum(yearMarginIncome)}</td>
                                <td className="text-right py-2 px-3 font-mono text-red-700 dark:text-red-400">{formatNum(yearExpenditure)}</td>
                                <td className={`text-right py-2 px-3 font-mono font-bold ${isPositive ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                  {yearNetProfit < 0 ? "-" : ""}{formatNum(Math.abs(yearNetProfit))}
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="font-bold bg-indigo-50 dark:bg-indigo-950/30 border-t-2">
                            <td className="py-2.5 px-3">4-Year Total</td>
                            <td className="text-right py-2.5 px-3 font-mono text-blue-700 dark:text-blue-400">{formatNum(totalScenarioAmount * 4)}</td>
                            <td className="text-right py-2.5 px-3 font-mono text-green-700 dark:text-green-400">{formatNum(totalScenarioAnnualIncome * 4)}</td>
                            <td className="text-right py-2.5 px-3 font-mono text-red-700 dark:text-red-400">{formatNum(annualizedExpenses * 4)}</td>
                            {(() => {
                              const total4YearNet = (totalScenarioAnnualIncome * 4) - (annualizedExpenses * 4);
                              return (
                                <td className={`text-right py-2.5 px-3 font-mono font-bold ${total4YearNet > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                  {total4YearNet < 0 ? "-" : ""}{formatNum(Math.abs(total4YearNet))}
                                </td>
                              );
                            })()}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      * Expenditure is based on current annualized expenses ({formatAFN(annualizedExpenses)}/year). Disbursement shows cumulative amount. Margin income assumes {data.projectionRate.toFixed(2)}% annual rate applied on total cumulative disbursement.
                    </p>
                  </CardContent>
                </Card>
              </>
            );
          })()}

          <Card className={`${data.isProfitable ? 'border-green-200 dark:border-green-800' : 'border-amber-200 dark:border-amber-800'} border-2`} data-testid="card-recommendations">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className={`h-5 w-5 ${data.isProfitable ? 'text-green-500' : 'text-amber-500'}`} />
                {data.isProfitable ? "Performance Summary" : "Recommendations to Achieve Profitability"}
              </CardTitle>
            </CardHeader>
            <CardContent>
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
