import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/lib/utils";
import { Link } from "wouter";
import {
  BookOpen,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  ArrowRight,
  Building2,
  Scale,
} from "lucide-react";

type UnbalancedEntry = {
  id: string;
  entryNumber: string;
  entryDate: string;
  description: string;
  isPosted: boolean;
  lineDebit: string;
  lineCredit: string;
  difference: string;
};

type DashboardData = {
  totalAccounts: number;
  activeAccounts: number;
  headerAccounts: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  netProfitMargin: number;
  cashBalance: number;
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  equationBalanced: boolean;
  equationDiff: number;
  journalEntryStats: {
    total: number;
    posted: number;
    draft: number;
    reversed: number;
    last30d: number;
    postedRate: number;
  };
  accountTypeDistribution: {
    type: string;
    label: string;
    count: number;
    color: string;
    percentage: number;
  }[];
  accountsWithActivity: number;
  recentJournalEntries: {
    id: string;
    entryNumber: string;
    description: string;
    entryDate: string;
    referenceType: string;
    totalDebit: number;
    totalCredit: number;
    isPosted: boolean;
    isReversed: boolean;
  }[];
  topAccountBalances: {
    accountCode: string;
    accountName: string;
    accountType: string;
    currentBalance: number;
  }[];
  fundingSources: {
    id: string;
    name: string;
    sourceType: string;
    totalCommitted: number;
    totalUtilized: number;
    availableBalance: number;
  }[];
  incomeBreakdown: {
    totalRecorded: number;
    records: number;
    avgPerRecord: number;
    categories: { name: string; amount: number; percentage: number }[];
  };
  expenseBreakdownDetail: {
    total: number;
    records: number;
    pending: number;
    categories: { name: string; amount: number; percentage: number }[];
  };
  profitAndLoss: {
    revenue: number;
    expenses: number;
    netIncome: number;
    profitMargin: number;
  };
  healthChecks: { label: string; description: string; passed: boolean }[];
  healthScore: number;
};

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    asset: "text-blue-600", liability: "text-green-600", equity: "text-indigo-600",
    income: "text-emerald-600", expense: "text-amber-600",
  };
  return colors[type] || "text-muted-foreground";
}

function getBalanceColor(type: string) {
  const colors: Record<string, string> = {
    asset: "text-blue-600", liability: "text-red-600", equity: "text-indigo-600",
    income: "text-emerald-600", expense: "text-red-600",
  };
  return colors[type] || "text-foreground";
}

export default function AccountingDashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/accounting/dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/accounting/dashboard");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const { data: unbalancedEntries } = useQuery<UnbalancedEntry[]>({
    queryKey: ["/api/journal-entries", "unbalanced"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-96" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-6 text-center text-muted-foreground">No data available</div>;

  const isLoss = data.netProfit < 0;
  const totalFundingCommitted = data.fundingSources.reduce((s, f) => s + f.totalCommitted, 0);
  const totalFundingUtilized = data.fundingSources.reduce((s, f) => s + f.totalUtilized, 0);
  const totalFundingAvailable = data.fundingSources.reduce((s, f) => s + f.availableBalance, 0);
  const utilizationRate = totalFundingCommitted > 0 ? Math.round((totalFundingUtilized / totalFundingCommitted) * 1000) / 10 : 0;
  const activeFundingSources = data.fundingSources.length;

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold" data-testid="text-accounting-title">Accounting Dashboard</h1>
          <Badge variant="outline" className={`text-xs ${data.isBalanced ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' : 'bg-red-500/10 text-red-700 border-red-500/30'}`} data-testid="badge-balanced">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {data.isBalanced ? "Books balanced" : "Books unbalanced"}
          </Badge>
          {data.journalEntryStats.draft > 0 && (
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/30" data-testid="badge-draft">
              <FileText className="h-3 w-3 mr-1" />
              {data.journalEntryStats.draft} draft entries
            </Badge>
          )}
          {data.expenseBreakdownDetail.pending > 0 && (
            <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-700 border-orange-500/30" data-testid="badge-pending-expenses">
              <Wallet className="h-3 w-3 mr-1" />
              {data.expenseBreakdownDetail.pending} pending expenses
            </Badge>
          )}
          <Badge variant="outline" className={`text-xs ${isLoss ? 'bg-red-500/10 text-red-700 border-red-500/30' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'}`} data-testid="badge-net">
            {isLoss ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
            {isLoss ? "Net Loss" : "Net Profit"}: {formatCurrency(Math.abs(data.netProfit))}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Financial overview, journal entries & reporting · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: BookOpen, color: "from-blue-500 to-blue-600", label: "Total Accounts", value: data.totalAccounts.toString(), sub: `${data.activeAccounts} active, ${data.headerAccounts} headers` },
          { icon: FileText, color: "from-emerald-500 to-emerald-600", label: "Journal Entries", value: data.journalEntryStats.total.toString(), sub: `${data.journalEntryStats.posted} posted`, extra: `${data.journalEntryStats.last30d} / 30d` },
          { icon: TrendingUp, color: "from-green-500 to-green-600", label: "Total Income", value: formatCurrency(data.totalRevenue), sub: `${data.incomeBreakdown.records} records` },
          { icon: TrendingDown, color: "from-red-500 to-red-600", label: "Total Expenses", value: formatCurrency(data.totalExpenses), sub: `${data.expenseBreakdownDetail.records} records` },
          { icon: Activity, color: isLoss ? "from-red-500 to-red-600" : "from-teal-500 to-teal-600", label: "Net Income", value: formatCurrency(data.netProfit), sub: isLoss ? "Loss" : "Profit", warning: isLoss },
          { icon: DollarSign, color: "from-indigo-500 to-indigo-600", label: "Total Assets", value: formatCurrency(data.totalAssets), sub: `Equity: ${formatCurrency(data.totalEquity)}` },
        ].map((card, idx) => (
          <Card key={idx} className="border shadow-sm overflow-hidden" data-testid={`stat-card-${idx}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}>
                  <card.icon className="h-4 w-4 text-white" />
                </div>
                {card.extra && (
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{card.extra}</span>
                )}
                {card.warning && (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <p className="text-lg font-bold truncate" title={card.value}>{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              <p className="text-[10px] text-muted-foreground/70 truncate">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Position + Trial Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border shadow-sm" data-testid="card-financial-position">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base font-semibold">Financial Position</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">Balance Sheet Summary</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Assets", value: data.totalAssets, color: "text-emerald-600", border: "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20" },
                { label: "Total Liabilities", value: data.totalLiabilities, color: "text-red-600", border: "border-red-200 bg-red-50/50 dark:bg-red-950/20" },
                { label: "Total Equity", value: data.totalEquity, color: "text-emerald-600", border: "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20" },
              ].map((item, idx) => (
                <div key={idx} className={`rounded-xl border p-4 text-center ${item.border}`}>
                  <p className={`text-xl font-bold ${item.color}`}>{formatCurrency(item.value)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground mb-1">Accounting Equation: Assets = Liabilities + Equity</p>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <span className="font-bold">{formatCurrency(data.totalAssets)}</span>
                <span className="text-muted-foreground">=</span>
                <span className="font-semibold text-red-600">{formatCurrency(data.totalLiabilities)}</span>
                <span className="text-muted-foreground">+</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(data.totalEquity)}</span>
                {!data.equationBalanced && (
                  <span className="text-xs text-amber-600 ml-2">✕ Diff: {formatCurrency(data.equationDiff)}</span>
                )}
              </div>
            </div>

            {/* Account Type Distribution */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Account Type Distribution</p>
              <div className="flex rounded-lg overflow-hidden h-7">
                {data.accountTypeDistribution.filter(a => a.percentage > 0).map((a, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center text-[10px] font-bold text-white transition-all"
                    style={{ width: `${a.percentage}%`, backgroundColor: a.color, minWidth: a.percentage > 0 ? '30px' : 0 }}
                    title={`${a.label}: ${a.count} (${a.percentage}%)`}
                  >
                    {a.percentage >= 10 && `${a.label.toLowerCase()} ${a.percentage}%`}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {data.accountTypeDistribution.map((a, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                    <span>{a.label} : {a.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Profit & Loss Summary */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Profit & Loss Summary</p>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(data.profitAndLoss.revenue)}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-500">{formatCurrency(data.profitAndLoss.expenses)}</p>
                  <p className="text-xs text-muted-foreground">Expenses</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${isLoss ? 'text-red-500' : 'text-emerald-600'}`}>
                    {formatCurrency(data.profitAndLoss.netIncome)}
                  </p>
                  <p className="text-xs text-muted-foreground">{isLoss ? 'Net Loss' : 'Net Profit'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Profit Margin</span>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isLoss ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, Math.abs(data.profitAndLoss.profitMargin))}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold ${isLoss ? 'text-red-500' : 'text-emerald-600'}`}>
                  {data.profitAndLoss.profitMargin.toFixed(1)}%
                </span>
              </div>
              <div className="flex gap-4 mt-3">
                <Link href="/balance-sheet" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  Balance Sheet <ArrowRight className="h-3 w-3" />
                </Link>
                <Link href="/income-statement" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  Profit & Loss <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trial Balance + Journal Entry Status */}
        <div className="space-y-4">
          <Card className="border shadow-sm" data-testid="card-trial-balance">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-red-500" />
                <CardTitle className="text-base font-semibold">Trial Balance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-base font-bold">{formatCurrency(data.totalDebits)}</p>
                  <p className="text-[10px] text-muted-foreground">Total Debits</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-base font-bold">{formatCurrency(data.totalCredits)}</p>
                  <p className="text-[10px] text-muted-foreground">Total Credits</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                {data.isBalanced ? (
                  <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30" variant="outline">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Balanced
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/10 text-red-700 border-red-500/30" variant="outline">
                    <XCircle className="h-3 w-3 mr-1" /> Unbalanced
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">{data.accountsWithActivity} accounts with activity</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm" data-testid="card-journal-status">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Journal Entry Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Posted", value: data.journalEntryStats.posted, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200" },
                  { label: "Draft", value: data.journalEntryStats.draft, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-200" },
                  { label: "Reversed", value: data.journalEntryStats.reversed, color: "text-muted-foreground bg-muted/30 border-border" },
                ].map((item, idx) => (
                  <div key={idx} className={`rounded-lg border p-2.5 text-center ${item.color}`}>
                    <p className="text-xl font-bold">{item.value}</p>
                    <p className="text-[10px]">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Posted Rate</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.journalEntryStats.postedRate}%` }} />
                </div>
                <span className="text-xs font-semibold">{data.journalEntryStats.postedRate}%</span>
              </div>
              <Link href="/trial-balance" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                View Trial Balance <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border shadow-sm" data-testid="card-unbalanced-entries">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-5 w-5 ${(unbalancedEntries?.length || 0) > 0 ? "text-red-500" : "text-emerald-500"}`} />
                <CardTitle className="text-base font-semibold">Unbalanced Entries</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {!unbalancedEntries || unbalancedEntries.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-emerald-700" data-testid="text-no-unbalanced">
                  <CheckCircle2 className="h-4 w-4" /> All journal entries are balanced
                </div>
              ) : (
                <>
                  <p className="text-xs text-red-600 font-medium" data-testid="text-unbalanced-count">
                    {unbalancedEntries.length} entr{unbalancedEntries.length === 1 ? "y" : "ies"} where debits do not equal credits
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {unbalancedEntries.map((e) => (
                      <div key={e.id} className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-2.5" data-testid={`row-unbalanced-${e.id}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold">{e.entryNumber}</span>
                          <Badge variant="outline" className="text-red-700 border-red-300">
                            Diff {formatCurrency(Number(e.difference))}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{e.description}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(e.entryDate).toLocaleDateString()} · Dr {formatCurrency(Number(e.lineDebit))} / Cr {formatCurrency(Number(e.lineCredit))} · {e.isPosted ? "Posted" : "Draft"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link href="/journal-entries" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    Open Journal Entries <ArrowRight className="h-3 w-3" />
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Expense Breakdown + Income Breakdown + Funding Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Expense Breakdown */}
        <Card className="border shadow-sm" data-testid="card-expense-breakdown">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <CardTitle className="text-base font-semibold">Expense Breakdown</CardTitle>
              </div>
              {data.expenseBreakdownDetail.pending > 0 && (
                <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/30">
                  {data.expenseBreakdownDetail.pending} pending
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border p-2.5 text-center">
                <p className="text-sm font-bold text-red-600">{formatCurrency(data.expenseBreakdownDetail.total)}</p>
                <p className="text-[10px] text-muted-foreground">Total</p>
              </div>
              <div className="rounded-lg border p-2.5 text-center">
                <p className="text-sm font-bold">{data.expenseBreakdownDetail.records}</p>
                <p className="text-[10px] text-muted-foreground">Records</p>
              </div>
              <div className="rounded-lg border p-2.5 text-center">
                <p className="text-sm font-bold">{data.expenseBreakdownDetail.pending}</p>
                <p className="text-[10px] text-muted-foreground">Pending</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Top Categories</p>
              <div className="space-y-2">
                {data.expenseBreakdownDetail.categories.map((cat, idx) => (
                  <div key={idx} className="space-y-1" data-testid={`expense-cat-${idx}`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-muted-foreground">{formatCurrency(cat.amount)} ({cat.percentage}%)</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/account-statement" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              View Expenses <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Income Breakdown */}
        <Card className="border shadow-sm" data-testid="card-income-breakdown">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <CardTitle className="text-base font-semibold">Income Breakdown</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">{data.incomeBreakdown.records} records</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-2.5 text-center border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
                <p className="text-sm font-bold text-emerald-600">{formatCurrency(data.incomeBreakdown.totalRecorded)}</p>
                <p className="text-[10px] text-muted-foreground">Total Recorded</p>
              </div>
              <div className="rounded-lg border p-2.5 text-center border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
                <p className="text-sm font-bold text-emerald-600">{formatCurrency(data.incomeBreakdown.avgPerRecord)}</p>
                <p className="text-[10px] text-muted-foreground">Avg per Record</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Top Categories</p>
              <div className="space-y-2.5">
                {data.incomeBreakdown.categories.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between" data-testid={`income-cat-${idx}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{formatCurrency(cat.amount)} ({cat.percentage}%)</span>
                      <div className="w-10 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cat.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/account-statement" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              View Income <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Funding Sources */}
        <Card className="border shadow-sm" data-testid="card-funding-sources">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <CardTitle className="text-base font-semibold">Funding Sources</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">{activeFundingSources} active</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Committed", value: totalFundingCommitted, color: "text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200" },
                { label: "Utilized", value: totalFundingUtilized, color: "text-amber-600 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200" },
                { label: "Available", value: totalFundingAvailable, color: "text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200" },
              ].map((item, idx) => (
                <div key={idx} className={`rounded-lg border p-2 text-center ${item.color}`}>
                  <p className="text-xs font-bold">{formatCurrency(item.value)}</p>
                  <p className="text-[9px]">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Utilization Rate</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${utilizationRate}%` }} />
              </div>
              <span className="text-xs font-semibold">{utilizationRate}%</span>
            </div>
            <div className="space-y-2">
              {data.fundingSources.slice(0, 4).map((source, idx) => {
                const used = source.totalCommitted > 0 ? Math.round((source.totalUtilized / source.totalCommitted) * 100) : 0;
                return (
                  <div key={idx} className="flex items-center justify-between" data-testid={`funding-source-${idx}`}>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground uppercase">
                        {source.sourceType?.substring(0, 2) || "FS"}
                      </div>
                      <div>
                        <p className="text-xs font-medium leading-tight">{source.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{source.sourceType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold">{formatCurrency(source.totalCommitted)}</p>
                      <p className="text-[10px] text-muted-foreground">{used}% used</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link href="/funding-sources" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              View All Sources <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Journal Entries + Accounting Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border shadow-sm" data-testid="card-recent-entries">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-violet-950/30 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-violet-600" />
                </div>
                <CardTitle className="text-base font-semibold">Recent Journal Entries</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">{data.journalEntryStats.last30d} in 30 days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.recentJournalEntries.map((entry, idx) => {
                const numPart = entry.entryNumber?.replace(/\D/g, '').slice(-3) || "000";
                return (
                  <div key={idx} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-muted/30 transition-colors" data-testid={`recent-entry-${idx}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        entry.isPosted ? 'bg-blue-500' : entry.isReversed ? 'bg-muted-foreground' : 'bg-amber-500'
                      }`}>
                        {numPart}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{entry.description || 'Journal Entry'}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {entry.entryNumber} · {formatDateShort(entry.entryDate)} · {entry.referenceType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">{formatCurrency(Math.max(entry.totalDebit, entry.totalCredit))}</span>
                      <Badge variant="outline" className={`text-[10px] ${
                        entry.isPosted ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' :
                        entry.isReversed ? 'bg-muted text-muted-foreground' :
                        'bg-amber-500/10 text-amber-700 border-amber-500/30'
                      }`}>
                        {entry.isPosted ? 'posted' : entry.isReversed ? 'reversed' : 'draft'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-center">
              <Link href="/journal-entries" className="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1">
                View All Entries <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Accounting Health */}
        <Card className="border shadow-sm" data-testid="card-accounting-health">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  data.healthScore >= 80 ? 'bg-emerald-100 dark:bg-emerald-950/30' :
                  data.healthScore >= 50 ? 'bg-amber-100 dark:bg-amber-950/30' :
                  'bg-red-100 dark:bg-red-950/30'
                }`}>
                  <Activity className={`h-4 w-4 ${
                    data.healthScore >= 80 ? 'text-emerald-600' :
                    data.healthScore >= 50 ? 'text-amber-600' :
                    'text-red-600'
                  }`} />
                </div>
                <CardTitle className="text-base font-semibold">Accounting Health</CardTitle>
              </div>
              <span className={`text-lg font-bold ${
                data.healthScore >= 80 ? 'text-emerald-600' :
                data.healthScore >= 50 ? 'text-amber-600' :
                'text-red-600'
              }`}>{data.healthScore}%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  data.healthScore >= 80 ? 'bg-emerald-500' :
                  data.healthScore >= 50 ? 'bg-amber-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${data.healthScore}%` }}
              />
            </div>
            <div className="space-y-3">
              {data.healthChecks.map((check, idx) => (
                <div key={idx} className="flex items-start gap-2.5" data-testid={`health-check-${idx}`}>
                  {check.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-semibold">{check.label}</p>
                    <p className="text-[10px] text-muted-foreground">{check.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              {data.healthChecks.filter(h => h.passed).length}/{data.healthChecks.length} checks passed · {data.healthScore < 100 ? 'Action required' : 'All good'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Account Balances */}
      <Card className="border shadow-sm" data-testid="card-top-balances">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <CardTitle className="text-base font-semibold">Top Account Balances</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {data.topAccountBalances.map((account, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 px-3 border-b last:border-b-0 hover:bg-muted/20 transition-colors" data-testid={`top-balance-${idx}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono w-10">{account.accountCode}</span>
                  <div>
                    <p className="text-sm font-medium">{account.accountName}</p>
                    <p className={`text-[10px] capitalize ${getTypeColor(account.accountType)}`}>{account.accountType}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${getBalanceColor(account.accountType)}`}>
                  {formatCurrency(Math.abs(account.currentBalance))}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <Link href="/chart-of-accounts" className="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1">
              View Chart of Accounts <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
