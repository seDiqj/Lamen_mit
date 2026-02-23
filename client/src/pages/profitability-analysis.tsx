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

    const exBaseExp = data.monthlyExpenses * 12;
    const exRate = data.projectionRate / 100;
    const exAvgTerm = 18;
    const exDisb = [104_000_000, 154_000_000, 204_000_000, 254_000_000];
    const exYears = ["2026", "2027", "2028", "2029"];

    rows.push({ Section: "4-YEAR PROJECTION (2026-2029)", Account: "", Amount: "" });
    rows.push({ Section: "", Account: "Assumptions: 2026 = AFN 104M, +AFN 50M/yr, expenses +10%/yr, margin " + data.projectionRate.toFixed(2) + "%", Amount: "" });
    rows.push({ Section: "", Account: "", Amount: "" });

    exDisb.forEach((disb, i) => {
      const expenses = exBaseExp * Math.pow(1.1, i + 1);
      const outstanding = exDisb.slice(0, i + 1).reduce((s, d, j) => {
        const yrsAgo = i - j;
        return s + d * Math.max(0, 1 - (yrsAgo * 12) / exAvgTerm);
      }, 0);
      const margin = outstanding * exRate;
      const collections = exDisb.slice(0, i + 1).reduce((s, d, j) => {
        const yrsAgo = i - j;
        if (yrsAgo === 0) return s + (d / exAvgTerm) * 6;
        return s + (d / exAvgTerm) * Math.min(12, yrsAgo * 12);
      }, 0);
      const net = margin - expenses;
      const capitalReq = disb - collections - net;
      rows.push({ Section: `Year ${exYears[i]}`, Account: "Disbursement", Amount: disb });
      rows.push({ Section: "", Account: "Outstanding Portfolio", Amount: outstanding });
      rows.push({ Section: "", Account: "Margin Income", Amount: margin });
      rows.push({ Section: "", Account: "Collections", Amount: collections });
      rows.push({ Section: "", Account: "Expenses", Amount: expenses });
      rows.push({ Section: "", Account: "Net Profit / Loss", Amount: net });
      rows.push({ Section: "", Account: "Capital Required", Amount: capitalReq });
      rows.push({ Section: "", Account: "", Amount: "" });
    });

    rows.push({ Section: "MONTHLY CAPITAL NEEDS - 2026", Account: "", Amount: "" });
    const exMonthlyDisb = 104_000_000 / 12;
    const exMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    exMonthNames.forEach((mn, m) => {
      let col = 0;
      for (let p = 0; p < m; p++) {
        col += exMonthlyDisb / exAvgTerm;
        col += (exMonthlyDisb * exRate) / 12;
      }
      const cumDisb = exMonthlyDisb * (m + 1);
      let cumCol = 0;
      for (let mi = 0; mi <= m; mi++) {
        for (let p = 0; p < mi; p++) {
          cumCol += exMonthlyDisb / exAvgTerm;
          cumCol += (exMonthlyDisb * exRate) / 12;
        }
      }
      rows.push({ Section: `${mn} 2026`, Account: `Disbursement: ${exMonthlyDisb.toFixed(0)} | Collections: ${col.toFixed(0)} | Net Capital: ${(cumDisb - cumCol).toFixed(0)}`, Amount: cumDisb - cumCol });
    });

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

    const pdfBaseExp = data.monthlyExpenses * 12;
    const pdfRate = data.projectionRate / 100;
    const pdfAvgTerm = 18;
    const pdfDisb = [104_000_000, 154_000_000, 204_000_000, 254_000_000];
    const pdfYears = ["2026", "2027", "2028", "2029"];

    tableData.push([{ content: "4-Year Projection (2026-2029)", colSpan: 2, styles: { fontStyle: "bold", fillColor: [224, 231, 255] } }]);
    tableData.push([{ content: `Assumptions: AFN 104M (2026), +50M/yr, expenses +10%/yr, margin ${data.projectionRate.toFixed(2)}%`, colSpan: 2 }]);
    pdfDisb.forEach((disb, i) => {
      const expenses = pdfBaseExp * Math.pow(1.1, i + 1);
      const outstanding = pdfDisb.slice(0, i + 1).reduce((s, d, j) => s + d * Math.max(0, 1 - ((i - j) * 12) / pdfAvgTerm), 0);
      const margin = outstanding * pdfRate;
      const net = margin - expenses;
      tableData.push([{ content: `Year ${pdfYears[i]}`, styles: { fontStyle: "bold" } }, ""]);
      tableData.push(["  Disbursement", { content: formatNum(disb), styles: { halign: "right" } }]);
      tableData.push(["  Outstanding Portfolio", { content: formatNum(outstanding), styles: { halign: "right" } }]);
      tableData.push(["  Margin Income", { content: formatNum(margin), styles: { halign: "right" } }]);
      tableData.push(["  Expenses", { content: formatNum(expenses), styles: { halign: "right" } }]);
      tableData.push(["  Net Profit / Loss", { content: `${net < 0 ? "-" : ""}${formatNum(Math.abs(net))}`, styles: { halign: "right", fontStyle: "bold" } }]);
      const pdfCapReq = disb - pdfDisb.slice(0, i + 1).reduce((s, d, j) => { const ya = i - j; if (ya === 0) return s + (d / pdfAvgTerm) * 6; return s + (d / pdfAvgTerm) * Math.min(12, ya * 12); }, 0) - net;
      tableData.push(["  Capital Required", { content: formatNum(pdfCapReq), styles: { halign: "right", fontStyle: "bold" } }]);
    });
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
            const baseExpenses = data.monthlyExpenses * 12;
            const marginRate = data.projectionRate / 100;
            const avgLoanTermMonths = 18;

            const yearlyDisbursements = [104_000_000, 154_000_000, 204_000_000, 254_000_000];
            const yearLabels = ["2026", "2027", "2028", "2029"];

            const yearData = yearlyDisbursements.map((disb, i) => {
              const expenses = baseExpenses * Math.pow(1.1, i + 1);
              const cumulativeOutstanding = yearlyDisbursements.slice(0, i + 1).reduce((sum, d, j) => {
                const yearsAgo = i - j;
                const remainingFraction = Math.max(0, 1 - (yearsAgo * 12) / avgLoanTermMonths);
                return sum + d * remainingFraction;
              }, 0);
              const marginIncome = cumulativeOutstanding * marginRate;
              const collections = yearlyDisbursements.slice(0, i + 1).reduce((sum, d, j) => {
                const yearsAgo = i - j;
                if (yearsAgo === 0) {
                  return sum + (d / avgLoanTermMonths) * 6;
                }
                const monthsCollecting = Math.min(12, yearsAgo * 12);
                return sum + (d / avgLoanTermMonths) * monthsCollecting;
              }, 0);
              const netProfit = marginIncome - expenses;
              const capitalRequired = disb - collections - netProfit;
              return { year: yearLabels[i], disbursement: disb, expenses, marginIncome, collections, cumulativeOutstanding, netProfit, capitalRequired };
            });

            const totalDisbursement = yearData.reduce((s, y) => s + y.disbursement, 0);
            const totalMargin = yearData.reduce((s, y) => s + y.marginIncome, 0);
            const totalExpenses = yearData.reduce((s, y) => s + y.expenses, 0);
            const totalCollections = yearData.reduce((s, y) => s + y.collections, 0);
            const totalNet = totalMargin - totalExpenses;
            const totalCapitalRequired = yearData.reduce((s, y) => s + y.capitalRequired, 0);

            const monthlyDisb2026 = 104_000_000 / 12;
            const monthlyExpense2026 = (baseExpenses * 1.1) / 12;
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthlyData = monthNames.map((name, m) => {
              const newDisb = monthlyDisb2026;
              let collections = 0;
              let marginIncomeThisMonth = 0;
              for (let prev = 0; prev < m; prev++) {
                collections += monthlyDisb2026 / avgLoanTermMonths;
                marginIncomeThisMonth += (monthlyDisb2026 * marginRate) / 12;
              }
              const netProfit = marginIncomeThisMonth - monthlyExpense2026;
              const cumulativeDisb = newDisb * (m + 1);
              let cumulativeCollections = 0;
              let cumulativeNetProfit = 0;
              for (let mi = 0; mi <= m; mi++) {
                let col = 0;
                let margin = 0;
                for (let prev = 0; prev < mi; prev++) {
                  col += monthlyDisb2026 / avgLoanTermMonths;
                  margin += (monthlyDisb2026 * marginRate) / 12;
                }
                cumulativeCollections += col;
                cumulativeNetProfit += margin - monthlyExpense2026;
              }
              const netCapitalNeeded = cumulativeDisb - cumulativeCollections - cumulativeNetProfit;
              return { month: name, newDisb, collections, marginIncomeThisMonth, netProfit, cumulativeDisb, cumulativeCollections, cumulativeNetProfit, netCapitalNeeded };
            });

            return (
              <>
                <Card className="border-2 border-indigo-200 dark:border-indigo-800" data-testid="card-4year-projection">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-indigo-500" />
                      4-Year Disbursement & Profitability Projection (2026–2029)
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      2026: AFN 104M disbursement, +AFN 50M/year growth, expenses increase 10% annually, {data.projectionRate.toFixed(2)}% margin rate, {avgLoanTermMonths}-month avg loan term
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-muted-foreground">Year 1 (2026) Disbursement</p>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{formatAFN(104_000_000)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-muted-foreground">Annual Disbursement Growth</p>
                        <p className="text-xl font-bold text-purple-700 dark:text-purple-400">+AFN 50,000,000</p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                        <p className="text-xs text-muted-foreground">Annual Expense Growth</p>
                        <p className="text-xl font-bold text-red-700 dark:text-red-400">+10% / year</p>
                        <p className="text-xs text-muted-foreground">Base: {formatAFN(baseExpenses)}/yr</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left py-2.5 px-3 text-muted-foreground font-medium">Year</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Disbursement</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Outstanding Portfolio</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Margin Income</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Collections</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Expenses</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Net Profit / Loss</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Capital Required</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yearData.map((yr, i) => {
                            const isPositive = yr.netProfit > 0;
                            return (
                              <tr key={i} className="border-b border-muted/50 hover:bg-muted/30" data-testid={`row-year-${yr.year}`}>
                                <td className="py-2.5 px-3 font-medium">{yr.year}</td>
                                <td className="text-right py-2.5 px-3 font-mono text-blue-700 dark:text-blue-400">{formatNum(yr.disbursement)}</td>
                                <td className="text-right py-2.5 px-3 font-mono text-violet-700 dark:text-violet-400">{formatNum(yr.cumulativeOutstanding)}</td>
                                <td className="text-right py-2.5 px-3 font-mono text-green-700 dark:text-green-400">{formatNum(yr.marginIncome)}</td>
                                <td className="text-right py-2.5 px-3 font-mono text-teal-700 dark:text-teal-400">{formatNum(yr.collections)}</td>
                                <td className="text-right py-2.5 px-3 font-mono text-red-700 dark:text-red-400">{formatNum(yr.expenses)}</td>
                                <td className={`text-right py-2.5 px-3 font-mono font-bold ${isPositive ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                  {yr.netProfit < 0 ? "-" : ""}{formatNum(Math.abs(yr.netProfit))}
                                </td>
                                <td className="text-right py-2.5 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                                  {formatNum(yr.capitalRequired)}
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="font-bold bg-indigo-50 dark:bg-indigo-950/30 border-t-2">
                            <td className="py-2.5 px-3">4-Year Total</td>
                            <td className="text-right py-2.5 px-3 font-mono text-blue-700 dark:text-blue-400">{formatNum(totalDisbursement)}</td>
                            <td className="text-right py-2.5 px-3 font-mono text-violet-700 dark:text-violet-400">—</td>
                            <td className="text-right py-2.5 px-3 font-mono text-green-700 dark:text-green-400">{formatNum(totalMargin)}</td>
                            <td className="text-right py-2.5 px-3 font-mono text-teal-700 dark:text-teal-400">{formatNum(totalCollections)}</td>
                            <td className="text-right py-2.5 px-3 font-mono text-red-700 dark:text-red-400">{formatNum(totalExpenses)}</td>
                            <td className={`text-right py-2.5 px-3 font-mono font-bold ${totalNet > 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                              {totalNet < 0 ? "-" : ""}{formatNum(Math.abs(totalNet))}
                            </td>
                            <td className="text-right py-2.5 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                              {formatNum(totalCapitalRequired)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      * Outstanding Portfolio accounts for loan repayments over {avgLoanTermMonths}-month avg term. Margin income = outstanding portfolio × {data.projectionRate.toFixed(2)}%. Collections include principal repayments based on avg loan term. Expenses: base {formatAFN(baseExpenses)}/yr with 10% annual increase. Capital Required = Disbursement − Collections − Net Profit (fresh capital needed after accounting for returning funds and profit).
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-teal-200 dark:border-teal-800" data-testid="card-monthly-capital">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-teal-500" />
                      Monthly Capital Needs — 2026
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Monthly breakdown of AFN 104M disbursement target showing capital required after accounting for collections and net profit. Monthly expenses: {formatAFN(monthlyExpense2026)}.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left py-2.5 px-3 text-muted-foreground font-medium">Month</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Disbursement</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Collections</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Net Profit</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Cum. Disbursed</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Cum. Collections</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Cum. Net Profit</th>
                            <th className="text-right py-2.5 px-3 text-muted-foreground font-medium">Capital Required</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyData.map((md, i) => (
                            <tr key={i} className="border-b border-muted/50 hover:bg-muted/30" data-testid={`row-month-${md.month}`}>
                              <td className="py-2 px-3 font-medium">{md.month} 2026</td>
                              <td className="text-right py-2 px-3 font-mono text-blue-700 dark:text-blue-400">{formatNum(md.newDisb)}</td>
                              <td className="text-right py-2 px-3 font-mono text-teal-700 dark:text-teal-400">{formatNum(md.collections)}</td>
                              <td className={`text-right py-2 px-3 font-mono ${md.netProfit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                {md.netProfit < 0 ? "-" : ""}{formatNum(Math.abs(md.netProfit))}
                              </td>
                              <td className="text-right py-2 px-3 font-mono text-muted-foreground">{formatNum(md.cumulativeDisb)}</td>
                              <td className="text-right py-2 px-3 font-mono text-muted-foreground">{formatNum(md.cumulativeCollections)}</td>
                              <td className={`text-right py-2 px-3 font-mono ${md.cumulativeNetProfit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                {md.cumulativeNetProfit < 0 ? "-" : ""}{formatNum(Math.abs(md.cumulativeNetProfit))}
                              </td>
                              <td className="text-right py-2 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">{formatNum(md.netCapitalNeeded)}</td>
                            </tr>
                          ))}
                          <tr className="font-bold bg-teal-50 dark:bg-teal-950/30 border-t-2">
                            <td className="py-2.5 px-3">Year Total</td>
                            <td className="text-right py-2.5 px-3 font-mono text-blue-700 dark:text-blue-400">{formatNum(104_000_000)}</td>
                            <td className="text-right py-2.5 px-3 font-mono text-teal-700 dark:text-teal-400">{formatNum(monthlyData.reduce((s, m) => s + m.collections, 0))}</td>
                            <td className={`text-right py-2.5 px-3 font-mono ${monthlyData.reduce((s, m) => s + m.netProfit, 0) >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                              {monthlyData.reduce((s, m) => s + m.netProfit, 0) < 0 ? "-" : ""}{formatNum(Math.abs(monthlyData.reduce((s, m) => s + m.netProfit, 0)))}
                            </td>
                            <td className="text-right py-2.5 px-3 font-mono text-muted-foreground">—</td>
                            <td className="text-right py-2.5 px-3 font-mono text-muted-foreground">—</td>
                            <td className={`text-right py-2.5 px-3 font-mono ${(monthlyData[11]?.cumulativeNetProfit || 0) >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                              {(monthlyData[11]?.cumulativeNetProfit || 0) < 0 ? "-" : ""}{formatNum(Math.abs(monthlyData[11]?.cumulativeNetProfit || 0))}
                            </td>
                            <td className="text-right py-2.5 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                              {formatNum(monthlyData[11]?.netCapitalNeeded || 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      * Even monthly disbursement (~{formatAFN(monthlyDisb2026)}/month). Collections from prior months' borrowers (principal over {avgLoanTermMonths}-month term + margin at {data.projectionRate.toFixed(2)}%). Net Profit = margin income − monthly expenses ({formatAFN(monthlyExpense2026)}). Capital Required = Cum. Disbursed − Cum. Collections − Cum. Net Profit.
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
