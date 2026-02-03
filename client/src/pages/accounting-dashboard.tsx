import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
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
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  PiggyBank,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Target,
  Percent,
  Building2,
  Users,
  FileText,
  CreditCard,
  Banknote,
  TrendingUpDown,
  CircleDollarSign,
  ReceiptText,
  Scale,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";

type AccountingDashboardData = {
  financialOverview: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    netProfitMargin: number;
    cashBalance: number;
    cashFlowTrend: number;
    revenueGrowth: number;
    expenseGrowth: number;
  };
  cashFlowTrends: {
    month: string;
    inflow: number;
    outflow: number;
    netFlow: number;
  }[];
  accountsReceivable: {
    total: number;
    current: number;
    days30: number;
    days60: number;
    days90Plus: number;
    overdueCount: number;
    upcomingPayments: {
      id: string;
      customerName: string;
      amount: number;
      dueDate: string;
      daysOverdue: number;
    }[];
  };
  accountsPayable: {
    total: number;
    current: number;
    days30: number;
    days60: number;
    days90Plus: number;
    overdueCount: number;
    upcomingPayments: {
      id: string;
      vendorName: string;
      amount: number;
      dueDate: string;
      daysOverdue: number;
    }[];
  };
  budgetAnalysis: {
    categories: {
      category: string;
      budgeted: number;
      actual: number;
      variance: number;
      variancePercent: number;
    }[];
    totalBudget: number;
    totalActual: number;
    totalVariance: number;
  };
  expenseBreakdown: {
    byCategory: {
      category: string;
      amount: number;
      percentage: number;
      trend: number;
    }[];
    byDepartment: {
      department: string;
      amount: number;
      percentage: number;
    }[];
  };
  kpis: {
    grossMargin: number;
    operatingMargin: number;
    returnOnAssets: number;
    currentRatio: number;
    quickRatio: number;
    debtToEquity: number;
    assetTurnover: number;
    workingCapital: number;
  };
  revenueBySource: {
    source: string;
    amount: number;
    percentage: number;
  }[];
  monthlyPnL: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
};

const CHART_COLORS = [
  "hsl(142, 76%, 36%)",
  "hsl(45, 93%, 47%)",
  "hsl(199, 89%, 48%)",
  "hsl(262, 83%, 58%)",
  "hsl(340, 82%, 52%)",
  "hsl(25, 95%, 53%)",
  "hsl(173, 80%, 40%)",
  "hsl(291, 64%, 42%)",
];

const AGING_COLORS = {
  current: "hsl(142, 76%, 36%)",
  days30: "hsl(45, 93%, 47%)",
  days60: "hsl(25, 95%, 53%)",
  days90Plus: "hsl(0, 84%, 60%)",
};

export default function AccountingDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading, error } = useQuery<AccountingDashboardData>({
    queryKey: ["/api/accounting/dashboard", selectedPeriod],
    queryFn: async () => {
      const response = await fetch(`/api/accounting/dashboard?period=${selectedPeriod}`);
      if (!response.ok) throw new Error("Failed to fetch accounting dashboard data");
      return response.json();
    },
  });

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-red-600 dark:text-red-400";
    if (variance < 0) return "text-green-600 dark:text-green-400";
    return "text-muted-foreground";
  };

  const getVarianceBg = (variance: number) => {
    if (variance > 5) return "bg-red-100 dark:bg-red-900/30";
    if (variance < -5) return "bg-green-100 dark:bg-green-900/30";
    return "bg-muted/50";
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p>Failed to load accounting dashboard data. Please try again.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-7 w-7 text-primary" />
            Accounting Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive financial overview and analytics
          </p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]" data-testid="select-period">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current_month">Current Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="current_quarter">Current Quarter</SelectItem>
            <SelectItem value="last_quarter">Last Quarter</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="last_year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2" data-testid="tab-overview">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="receivables" className="gap-2" data-testid="tab-receivables">
            <ArrowDownRight className="h-4 w-4" />
            Receivables
          </TabsTrigger>
          <TabsTrigger value="payables" className="gap-2" data-testid="tab-payables">
            <ArrowUpRight className="h-4 w-4" />
            Payables
          </TabsTrigger>
          <TabsTrigger value="budget" className="gap-2" data-testid="tab-budget">
            <Target className="h-4 w-4" />
            Budget Analysis
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-2" data-testid="tab-expenses">
            <ReceiptText className="h-4 w-4" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="kpis" className="gap-2" data-testid="tab-kpis">
            <Activity className="h-4 w-4" />
            KPIs
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <CircleDollarSign className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(data.financialOverview.totalRevenue)}
                </div>
                <div className="flex items-center text-xs mt-1">
                  {data.financialOverview.revenueGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={data.financialOverview.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatPercent(data.financialOverview.revenueGrowth)}
                  </span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <ReceiptText className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(data.financialOverview.totalExpenses)}
                </div>
                <div className="flex items-center text-xs mt-1">
                  {data.financialOverview.expenseGrowth <= 0 ? (
                    <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={data.financialOverview.expenseGrowth <= 0 ? "text-green-600" : "text-red-600"}>
                    {formatPercent(data.financialOverview.expenseGrowth)}
                  </span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <Wallet className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${data.financialOverview.netProfit >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600"}`}>
                  {formatCurrency(data.financialOverview.netProfit)}
                </div>
                <div className="flex items-center text-xs mt-1">
                  <Percent className="h-3 w-3 text-muted-foreground mr-1" />
                  <span className="text-muted-foreground">
                    {data.financialOverview.netProfitMargin.toFixed(1)}% margin
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
                <Banknote className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(data.financialOverview.cashBalance)}
                </div>
                <div className="flex items-center text-xs mt-1">
                  {data.financialOverview.cashFlowTrend >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={data.financialOverview.cashFlowTrend >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatPercent(data.financialOverview.cashFlowTrend)}
                  </span>
                  <span className="text-muted-foreground ml-1">trend</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cash Flow Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUpDown className="h-5 w-5 text-primary" />
                  Cash Flow Trends
                </CardTitle>
                <CardDescription>Monthly inflow vs outflow comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data.cashFlowTrends}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                      <Bar dataKey="inflow" name="Inflow" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="outflow" name="Outflow" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="netFlow" name="Net Flow" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ fill: "hsl(199, 89%, 48%)" }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Source */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  Revenue by Source
                </CardTitle>
                <CardDescription>Distribution of income sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center">
                  <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.revenueBySource}
                          dataKey="amount"
                          nameKey="source"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                        >
                          {data.revenueBySource.map((entry, index) => (
                            <Cell key={entry.source} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => formatCurrency(value)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-2">
                    {data.revenueBySource.map((item, index) => (
                      <div key={item.source} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                          <span className="truncate">{item.source}</span>
                        </div>
                        <span className="font-medium">{item.percentage.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly P&L */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Monthly Profit & Loss
              </CardTitle>
              <CardDescription>Revenue, expenses, and profit comparison over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.monthlyPnL}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(142, 76%, 36%)" fill="hsl(142, 76%, 36%)" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="hsl(0, 84%, 60%)" fill="hsl(0, 84%, 60%)" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="profit" name="Profit" stroke="hsl(199, 89%, 48%)" fill="hsl(199, 89%, 48%)" fillOpacity={0.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receivables Tab */}
        <TabsContent value="receivables" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Receivables</CardTitle>
                <ArrowDownRight className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.accountsReceivable.total)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.accountsReceivable.overdueCount} overdue invoices
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current (0-30 days)</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(data.accountsReceivable.current)}</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">31-60 Days</CardTitle>
                <Clock className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{formatCurrency(data.accountsReceivable.days30)}</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">90+ Days Overdue</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(data.accountsReceivable.days90Plus)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aging Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Receivables Aging</CardTitle>
                <CardDescription>Distribution by days outstanding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Current", amount: data.accountsReceivable.current, fill: AGING_COLORS.current },
                        { name: "31-60 Days", amount: data.accountsReceivable.days30, fill: AGING_COLORS.days30 },
                        { name: "61-90 Days", amount: data.accountsReceivable.days60, fill: AGING_COLORS.days60 },
                        { name: "90+ Days", amount: data.accountsReceivable.days90Plus, fill: AGING_COLORS.days90Plus },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                        {[
                          { name: "Current", fill: AGING_COLORS.current },
                          { name: "31-60 Days", fill: AGING_COLORS.days30 },
                          { name: "61-90 Days", fill: AGING_COLORS.days60 },
                          { name: "90+ Days", fill: AGING_COLORS.days90Plus },
                        ].map((entry, index) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Collections</CardTitle>
                <CardDescription>Payments due in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {data.accountsReceivable.upcomingPayments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No upcoming payments</p>
                  ) : (
                    data.accountsReceivable.upcomingPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover-elevate">
                        <div>
                          <p className="font-medium">{payment.customerName}</p>
                          <p className="text-xs text-muted-foreground">Due: {formatDate(payment.dueDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                          {payment.daysOverdue > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {payment.daysOverdue}d overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payables Tab */}
        <TabsContent value="payables" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payables</CardTitle>
                <ArrowUpRight className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.accountsPayable.total)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.accountsPayable.overdueCount} overdue bills
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current (0-30 days)</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(data.accountsPayable.current)}</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">31-60 Days</CardTitle>
                <Clock className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{formatCurrency(data.accountsPayable.days30)}</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">90+ Days Overdue</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(data.accountsPayable.days90Plus)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aging Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Payables Aging</CardTitle>
                <CardDescription>Distribution by days outstanding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Current", amount: data.accountsPayable.current },
                        { name: "31-60 Days", amount: data.accountsPayable.days30 },
                        { name: "61-90 Days", amount: data.accountsPayable.days60 },
                        { name: "90+ Days", amount: data.accountsPayable.days90Plus },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                        <Cell fill={AGING_COLORS.current} />
                        <Cell fill={AGING_COLORS.days30} />
                        <Cell fill={AGING_COLORS.days60} />
                        <Cell fill={AGING_COLORS.days90Plus} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription>Bills due in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {data.accountsPayable.upcomingPayments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No upcoming payments</p>
                  ) : (
                    data.accountsPayable.upcomingPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover-elevate">
                        <div>
                          <p className="font-medium">{payment.vendorName}</p>
                          <p className="text-xs text-muted-foreground">Due: {formatDate(payment.dueDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                          {payment.daysOverdue > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {payment.daysOverdue}d overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Budget Analysis Tab */}
        <TabsContent value="budget" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <Target className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.budgetAnalysis.totalBudget)}</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actual Spend</CardTitle>
                <DollarSign className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.budgetAnalysis.totalActual)}</div>
                <Progress
                  value={(data.budgetAnalysis.totalActual / data.budgetAnalysis.totalBudget) * 100}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
            <Card className={`border-l-4 ${data.budgetAnalysis.totalVariance > 0 ? "border-l-red-500" : "border-l-green-500"}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Variance</CardTitle>
                {data.budgetAnalysis.totalVariance > 0 ? (
                  <TrendingUp className="h-5 w-5 text-red-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-green-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${data.budgetAnalysis.totalVariance > 0 ? "text-red-600" : "text-green-600"}`}>
                  {formatCurrency(Math.abs(data.budgetAnalysis.totalVariance))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.budgetAnalysis.totalVariance > 0 ? "Over budget" : "Under budget"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual by Category</CardTitle>
              <CardDescription>Compare planned spending against actual expenditures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.budgetAnalysis.categories} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                    <YAxis type="category" dataKey="category" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="budgeted" name="Budgeted" fill="hsl(199, 89%, 48%)" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="actual" name="Actual" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variance Analysis</CardTitle>
              <CardDescription>Detailed breakdown of budget variances</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Budgeted</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead className="text-right">Variance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.budgetAnalysis.categories.map((cat) => (
                    <TableRow key={cat.category} className={getVarianceBg(cat.variancePercent)}>
                      <TableCell className="font-medium">{cat.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(cat.budgeted)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(cat.actual)}</TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(cat.variance)}`}>
                        {cat.variance > 0 ? "+" : ""}{formatCurrency(cat.variance)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getVarianceColor(cat.variancePercent)}`}>
                        {formatPercent(cat.variancePercent)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  Expenses by Category
                </CardTitle>
                <CardDescription>Distribution of expenses across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center">
                  <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.expenseBreakdown.byCategory}
                          dataKey="amount"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                          label={({ percentage }) => `${percentage.toFixed(0)}%`}
                        >
                          {data.expenseBreakdown.byCategory.map((entry, index) => (
                            <Cell key={entry.category} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-2 max-h-64 overflow-y-auto">
                    {data.expenseBreakdown.byCategory.map((item, index) => (
                      <div key={item.category} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                          <span className="truncate">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{formatCurrency(item.amount)}</span>
                          {item.trend !== 0 && (
                            <span className={`text-xs ${item.trend > 0 ? "text-red-500" : "text-green-500"}`}>
                              {item.trend > 0 ? "+" : ""}{item.trend.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* By Department */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Expenses by Department
                </CardTitle>
                <CardDescription>Distribution of expenses across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.expenseBreakdown.byDepartment} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                      <YAxis type="category" dataKey="department" width={120} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="amount" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]}>
                        {data.expenseBreakdown.byDepartment.map((entry, index) => (
                          <Cell key={entry.department} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expense Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Category Details</CardTitle>
              <CardDescription>Complete breakdown with trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                    <TableHead className="text-right">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.expenseBreakdown.byCategory.map((cat, index) => (
                    <TableRow key={cat.category}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                          {cat.category}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(cat.amount)}</TableCell>
                      <TableCell className="text-right">{cat.percentage.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">
                        <div className={`flex items-center justify-end gap-1 ${cat.trend > 0 ? "text-red-500" : cat.trend < 0 ? "text-green-500" : "text-muted-foreground"}`}>
                          {cat.trend > 0 ? <TrendingUp className="h-4 w-4" /> : cat.trend < 0 ? <TrendingDown className="h-4 w-4" /> : null}
                          {formatPercent(cat.trend)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KPIs Tab */}
        <TabsContent value="kpis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gross Margin</CardTitle>
                <Percent className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{data.kpis.grossMargin.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Profit after direct costs</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operating Margin</CardTitle>
                <Percent className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{data.kpis.operatingMargin.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Profit from operations</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Return on Assets</CardTitle>
                <PiggyBank className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{data.kpis.returnOnAssets.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Efficiency of asset usage</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Asset Turnover</CardTitle>
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{data.kpis.assetTurnover.toFixed(2)}x</div>
                <p className="text-xs text-muted-foreground mt-1">Revenue per AFN of assets</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Ratio</CardTitle>
                <Scale className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${data.kpis.currentRatio >= 1.5 ? "text-green-600" : data.kpis.currentRatio >= 1 ? "text-yellow-600" : "text-red-600"}`}>
                  {data.kpis.currentRatio.toFixed(2)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Progress value={Math.min(data.kpis.currentRatio / 3 * 100, 100)} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground">Target: 2.0</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Ratio</CardTitle>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${data.kpis.quickRatio >= 1 ? "text-green-600" : data.kpis.quickRatio >= 0.5 ? "text-yellow-600" : "text-red-600"}`}>
                  {data.kpis.quickRatio.toFixed(2)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Progress value={Math.min(data.kpis.quickRatio / 2 * 100, 100)} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground">Target: 1.0</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Debt to Equity</CardTitle>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${data.kpis.debtToEquity <= 1 ? "text-green-600" : data.kpis.debtToEquity <= 2 ? "text-yellow-600" : "text-red-600"}`}>
                  {data.kpis.debtToEquity.toFixed(2)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Progress value={Math.min(data.kpis.debtToEquity / 3 * 100, 100)} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground">Target: &lt;1.0</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Working Capital</CardTitle>
                <Wallet className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${data.kpis.workingCapital >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(data.kpis.workingCapital)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Current Assets - Current Liabilities
                </p>
              </CardContent>
            </Card>
          </div>

          {/* KPI Explanation Card */}
          <Card>
            <CardHeader>
              <CardTitle>KPI Reference Guide</CardTitle>
              <CardDescription>Understanding your financial metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-medium">Gross Margin</p>
                    <p className="text-muted-foreground">Percentage of revenue remaining after deducting cost of goods sold. Higher is better.</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-medium">Operating Margin</p>
                    <p className="text-muted-foreground">Percentage of revenue remaining after all operating expenses. Measures operational efficiency.</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-medium">Return on Assets (ROA)</p>
                    <p className="text-muted-foreground">How efficiently assets generate profit. Higher ROA indicates better asset utilization.</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-medium">Asset Turnover</p>
                    <p className="text-muted-foreground">Revenue generated per AFN of assets. Higher turnover means more efficient use of assets.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-medium">Current Ratio</p>
                    <p className="text-muted-foreground">Ability to pay short-term obligations. Ratio above 1.5 is generally healthy.</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-medium">Quick Ratio</p>
                    <p className="text-muted-foreground">Like current ratio but excludes inventory. Ratio above 1.0 indicates good liquidity.</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-medium">Debt to Equity</p>
                    <p className="text-muted-foreground">Financial leverage measure. Lower ratio indicates less reliance on debt financing.</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-medium">Working Capital</p>
                    <p className="text-muted-foreground">Funds available for day-to-day operations. Positive working capital is essential.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
