import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/date-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PiggyBank,
  Wallet,
  CalendarDays,
  Building2,
  X,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
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
} from "recharts";

type DashboardStats = {
  totalLoans: number;
  activeLoans: number;
  pendingLoans: number;
  totalCustomers: number;
  totalDisbursed: number;
  totalCollected: number;
  outstandingBalance: number;
  overdueLoans: number;
  loansByStatus: { status: string; count: number; requestedAmount: number }[];
  monthlyTrends: { month: string; disbursed: number; collected: number }[];
  recentLoans: {
    id: string;
    applicationId: string;
    customerName: string;
    amount: number;
    status: string;
    date: string;
  }[];
};

type BranchStats = {
  branchName: string;
  loanCount: number;
  customerCount: number;
  totalDisbursed: number;
  totalCollected: number;
  outstandingBalance: number;
};

type LoanListItem = {
  id: string;
  applicationId: string;
  customerName: string;
  requestAmount: number;
  status: string;
  requestDate: string;
};

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  pending: { 
    bg: "bg-amber-500/15", 
    text: "text-amber-700 dark:text-amber-400", 
    border: "border-amber-500/30",
    gradient: "from-amber-500 to-orange-500"
  },
  approved: { 
    bg: "bg-emerald-500/15", 
    text: "text-emerald-700 dark:text-emerald-400", 
    border: "border-emerald-500/30",
    gradient: "from-emerald-500 to-green-500"
  },
  active: { 
    bg: "bg-blue-500/15", 
    text: "text-blue-700 dark:text-blue-400", 
    border: "border-blue-500/30",
    gradient: "from-blue-500 to-cyan-500"
  },
  disbursed: { 
    bg: "bg-teal-500/15", 
    text: "text-teal-700 dark:text-teal-400", 
    border: "border-teal-500/30",
    gradient: "from-teal-500 to-emerald-500"
  },
  completed: { 
    bg: "bg-green-500/15", 
    text: "text-green-700 dark:text-green-400", 
    border: "border-green-500/30",
    gradient: "from-green-500 to-lime-500"
  },
  rejected: { 
    bg: "bg-red-500/15", 
    text: "text-red-700 dark:text-red-400", 
    border: "border-red-500/30",
    gradient: "from-red-500 to-rose-500"
  },
  defaulted: { 
    bg: "bg-rose-500/15", 
    text: "text-rose-700 dark:text-rose-400", 
    border: "border-rose-500/30",
    gradient: "from-rose-500 to-red-500"
  },
};

type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  icon: React.ElementType;
  loading?: boolean;
  gradient: string;
  iconBg: string;
};

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  loading,
  gradient,
  iconBg,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-14 w-14 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className={`h-1 ${gradient}`} />
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                changeType === "positive" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
              }`}>
                {changeType === "positive" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className={`h-14 w-14 rounded-xl ${iconBg} flex items-center justify-center shadow-lg`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
    case "approved":
    case "completed":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    case "pending":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
    case "disbursed":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
    case "defaulted":
      return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: roleData } = useQuery<{ role: string }>({
    queryKey: ["/api/user/role"],
  });

  const { data: branchStats, isLoading: branchLoading } = useQuery<BranchStats[]>({
    queryKey: ["/api/dashboard/branch-stats"],
  });

  const { data: loansData, isLoading: loansLoading } = useQuery<{ loans: LoanListItem[]; total: number }>({
    queryKey: ["/api/loans", selectedStatus],
    queryFn: async () => {
      const response = await fetch(`/api/loans?status=${selectedStatus}&limit=50`);
      if (!response.ok) throw new Error("Failed to fetch loans");
      return response.json();
    },
    enabled: !!selectedStatus && dialogOpen,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const today = formatDate(new Date());

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status);
    setDialogOpen(true);
  };

  const getStatusStyles = (status: string) => {
    const normalized = status.toLowerCase();
    return STATUS_COLORS[normalized] || STATUS_COLORS.pending;
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-amber-400 dark:to-yellow-500 bg-clip-text text-transparent" data-testid="text-dashboard-title">
            Financial Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Daily Cash Position Summary
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{today}</span>
          </div>
          {(roleData?.role === "manager" || roleData?.role === "admin") && (
            <Button asChild data-testid="button-new-loan">
              <Link href="/loans/new">
                <FileText className="mr-2 h-4 w-4" />
                New Loan
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Loans"
          value={stats?.totalLoans?.toString() || "0"}
          icon={FileText}
          loading={isLoading}
          gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
          iconBg="bg-gradient-to-br from-blue-500 to-cyan-600"
        />
        <StatCard
          title="Active Loans"
          value={stats?.activeLoans?.toString() || "0"}
          change="+12% from last month"
          changeType="positive"
          icon={CheckCircle2}
          loading={isLoading}
          gradient="bg-gradient-to-r from-emerald-500 to-green-500"
          iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers?.toString() || "0"}
          icon={Users}
          loading={isLoading}
          gradient="bg-gradient-to-r from-violet-500 to-purple-500"
          iconBg="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(stats?.outstandingBalance || 0)}
          icon={TrendingUp}
          loading={isLoading}
          gradient="bg-gradient-to-r from-indigo-500 to-blue-500"
          iconBg="bg-gradient-to-br from-indigo-500 to-blue-600"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Disbursed"
          value={formatCurrency(stats?.totalDisbursed || 0)}
          icon={PiggyBank}
          loading={isLoading}
          gradient="bg-gradient-to-r from-teal-500 to-emerald-500"
          iconBg="bg-gradient-to-br from-teal-500 to-emerald-600"
        />
        <StatCard
          title="Total Collected"
          value={formatCurrency(stats?.totalCollected || 0)}
          change="+8.2% this month"
          changeType="positive"
          icon={Wallet}
          loading={isLoading}
          gradient="bg-gradient-to-r from-green-500 to-lime-500"
          iconBg="bg-gradient-to-br from-green-500 to-lime-600"
        />
        <StatCard
          title="Pending Loans"
          value={stats?.pendingLoans?.toString() || "0"}
          icon={Clock}
          loading={isLoading}
          gradient="bg-gradient-to-r from-amber-500 to-orange-500"
          iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
        />
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Financings by Status</CardTitle>
              <p className="text-sm text-muted-foreground">Click on a status to view financing details</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30">
            {stats?.loansByStatus?.length || 0} Statuses
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(stats?.loansByStatus || []).map((item) => {
                const styles = getStatusStyles(item.status);
                return (
                  <button
                    key={item.status}
                    onClick={() => handleStatusClick(item.status)}
                    className={`p-4 rounded-xl border-2 ${styles.border} ${styles.bg} hover:shadow-lg transition-all cursor-pointer text-left group`}
                    data-testid={`status-card-${item.status}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-semibold capitalize ${styles.text}`}>
                        {item.status}
                      </span>
                      <ArrowUpRight className={`h-4 w-4 ${styles.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Count:</span>
                        <span className="text-lg font-bold">{item.count}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Amount:</span>
                        <span className={`text-sm font-semibold ${styles.text}`}>
                          {formatCurrency(item.requestedAmount)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
              {(!stats?.loansByStatus || stats.loansByStatus.length === 0) && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p>No loan status data available</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Summary by Branch</CardTitle>
              <p className="text-sm text-muted-foreground">Portfolio breakdown by branch</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/30">
            {branchStats?.length || 0} Branches
          </Badge>
        </CardHeader>
        <CardContent>
          {branchLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Branch</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">No. of Loans</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">No. of Customers</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Total Disbursed</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Total Collected</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Outstanding Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {(branchStats || []).map((branch, idx) => (
                    <tr key={branch.branchName} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow">
                            {branch.branchName.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium">{branch.branchName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30">
                          {branch.loanCount}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant="outline" className="bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30">
                          {branch.customerCount}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(branch.totalDisbursed)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(branch.totalCollected)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                        {formatCurrency(branch.outstandingBalance)}
                      </td>
                    </tr>
                  ))}
                  {(!branchStats || branchStats.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        <Building2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                        <p>No branch data available</p>
                      </td>
                    </tr>
                  )}
                </tbody>
                {branchStats && branchStats.length > 0 && (
                  <tfoot>
                    <tr className="bg-muted/50 font-semibold">
                      <td className="px-4 py-3">Total</td>
                      <td className="px-4 py-3 text-right">{branchStats.reduce((sum, b) => sum + b.loanCount, 0)}</td>
                      <td className="px-4 py-3 text-right">{branchStats.reduce((sum, b) => sum + b.customerCount, 0)}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(branchStats.reduce((sum, b) => sum + b.totalDisbursed, 0))}</td>
                      <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">{formatCurrency(branchStats.reduce((sum, b) => sum + b.totalCollected, 0))}</td>
                      <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">{formatCurrency(branchStats.reduce((sum, b) => sum + b.outstandingBalance, 0))}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Monthly Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Disbursement trends</p>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
              Last 6 months
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats?.monthlyTrends || []}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `${v / 1000000}M`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), "Disbursed"]}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  />
                  <Bar dataKey="disbursed" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                      <stop offset="100%" stopColor="hsl(142 76% 28%)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Financing Status Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">By current status</p>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats?.loansByStatus || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="status"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {(stats?.loansByStatus || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Collections Trend</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly collection performance</p>
            </div>
            <Badge variant="outline" className="bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30">
              vs Disbursements
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={stats?.monthlyTrends || []}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `${v / 1000000}M`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="disbursed" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 5 }}
                    name="Disbursements"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="collected" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 5 }}
                    name="Collections"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Loans</CardTitle>
              <p className="text-sm text-muted-foreground">Latest applications</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary">
              <Link href="/loans">
                View all
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {(stats?.recentLoans || []).slice(0, 5).map((loan) => (
                  <div key={loan.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-semibold text-white shadow-md">
                      {loan.customerName?.substring(0, 2).toUpperCase() || "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{loan.customerName || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(loan.amount || 0)}
                      </p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(loan.status)}>
                      {loan.status}
                    </Badge>
                  </div>
                ))}
                {(!stats?.recentLoans || stats.recentLoans.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p>No recent loans</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <span className="capitalize">{selectedStatus}</span> Loans
              <Badge variant="outline" className={getStatusColor(selectedStatus || "")}>
                {loansData?.total || 0} loans
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {loansLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Application ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Customer</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Request Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Request Date</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(loansData?.loans || []).map((loan, idx) => (
                    <tr key={loan.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3 font-medium">{loan.applicationId}</td>
                      <td className="px-4 py-3">{loan.customerName || "Unknown"}</td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(loan.requestAmount || 0)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(loan.requestDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={getStatusColor(loan.status)}>
                          {loan.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {(!loansData?.loans || loansData.loans.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                        <p>No loans with this status</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
