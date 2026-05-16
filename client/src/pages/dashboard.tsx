import { useState, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PiggyBank,
  Wallet,
  Briefcase,
  CalendarDays,
  Building2,
  X,
  Loader2,
  Shield,
  ShieldAlert,
  Filter,
  RotateCcw,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Phone,
  Eye,
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
  currentMonthCount: number;
  currentMonthAmount: number;
  prevMonthCount: number;
  prevMonthAmount: number;
  pendingLoans: number;
  totalCustomers: number;
  totalDisbursed: number;
  disbursedLoanCount: number;
  totalPortfolio: number;
  portfolioPrincipal: number;
  portfolioMargin: number;
  totalCollected: number;
  principalCollected: number;
  marginCollected: number;
  outstandingBalance: number;
  overdueLoans: number;
  activeBorrowers: number;
  prevMonthBorrowers: number;
  repaymentRate: number;
  portfolioAtRisk: number;
  sectorDistribution: { sector: string; count: number; amount: number; percentage: number }[];
  parAging: {
    par1: { count: number; amount: number; percentage: number };
    par7: { count: number; amount: number; percentage: number };
    par30: { count: number; amount: number; percentage: number };
    par60: { count: number; amount: number; percentage: number };
    par90: { count: number; amount: number; percentage: number };
    totalOverdueAmount: number;
    overdueLoansCount: number;
    totalActiveOLB: number;
  };
  dailyOps: {
    applicationsToday: number;
    approvedToday: number;
    rejectedToday: number;
    disbursedToday: number;
    amountDisbursedToday: number;
    amountDueToday: number;
    amountCollectedToday: number;
    missedPayments: number;
    dueTodayCount: number;
    collectedTodayCount: number;
  };
  alerts: {
    id: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    title: string;
    description: string;
    category: string;
  }[];
  officerPerformance: {
    officerId: string;
    officerName: string;
    officerCode: string;
    branchName: string;
    activeLoans: number;
    totalLoans: number;
    portfolioAmount: number;
    parAmount: number;
    parLoans: number;
    parRate: number;
    totalCollected: number;
    disbursedLast30d: number;
  }[];
  financialPerformance: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyNetIncome: number;
    ytdIncome: number;
    ytdExpenses: number;
    ytdNetIncome: number;
    incomeBreakdown: { accountCode: string; accountName: string; amount: number }[];
    expenseBreakdown: { accountCode: string; accountName: string; amount: number }[];
    monthlyTrend: { month: string; income: number; expenses: number; netIncome: number }[];
  };
  productBreakdown: {
    productName: string;
    loanCount: number;
    totalDisbursed: number;
    totalPortfolio: number;
    portfolioPrincipal: number;
    portfolioMargin: number;
    totalCollected: number;
    principalCollected: number;
    marginCollected: number;
    outstandingBalance: number;
    outstandingPrincipal: number;
    outstandingMargin: number;
  }[];
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
  totalPortfolio: number;
  outstandingBalance: number;
};

type FundingSourceBranchStats = {
  fundingSourceName: string;
  branchName: string;
  loanCount: number;
  customerCount: number;
  totalDisbursed: number;
  totalCollected: number;
  totalPortfolio: number;
  outstandingBalance: number;
};

const FUNDING_SOURCE_COLORS = [
  { bg: 'bg-blue-50 dark:bg-blue-950/30', subtotal: 'bg-blue-100/60 dark:bg-blue-900/30' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/30', subtotal: 'bg-emerald-100/60 dark:bg-emerald-900/30' },
  { bg: 'bg-amber-50 dark:bg-amber-950/30', subtotal: 'bg-amber-100/60 dark:bg-amber-900/30' },
  { bg: 'bg-purple-50 dark:bg-purple-950/30', subtotal: 'bg-purple-100/60 dark:bg-purple-900/30' },
  { bg: 'bg-rose-50 dark:bg-rose-950/30', subtotal: 'bg-rose-100/60 dark:bg-rose-900/30' },
  { bg: 'bg-cyan-50 dark:bg-cyan-950/30', subtotal: 'bg-cyan-100/60 dark:bg-cyan-900/30' },
  { bg: 'bg-orange-50 dark:bg-orange-950/30', subtotal: 'bg-orange-100/60 dark:bg-orange-900/30' },
  { bg: 'bg-indigo-50 dark:bg-indigo-950/30', subtotal: 'bg-indigo-100/60 dark:bg-indigo-900/30' },
];

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

type StatCardBreakdown = {
  label: string;
  value: string;
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
  breakdown?: StatCardBreakdown[];
  onProductClick?: () => void;
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
  breakdown,
  onProductClick,
}: StatCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isClickable = breakdown && breakdown.length > 0;
  const hasAction = isClickable || !!onProductClick;

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

  const handleClick = () => {
    if (onProductClick) {
      onProductClick();
    } else if (isClickable) {
      setExpanded(!expanded);
    }
  };

  return (
    <Card
      className={`overflow-hidden border-0 shadow-lg ${hasAction ? "cursor-pointer hover:shadow-xl transition-shadow" : ""}`}
      onClick={hasAction ? handleClick : undefined}
      data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
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
        {isClickable && !onProductClick && expanded && (
          <div className="mt-3 pt-3 border-t border-dashed space-y-1.5">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold" data-testid={`text-breakdown-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>{item.value}</span>
              </div>
            ))}
          </div>
        )}
        {hasAction && !onProductClick && (
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            {expanded ? "Click to collapse" : "Click for details"}
          </p>
        )}
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
  const [filterBranch, setFilterBranch] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedAlertCategory, setSelectedAlertCategory] = useState<string | null>(null);
  const [dailyOpDialogOpen, setDailyOpDialogOpen] = useState(false);
  const [selectedDailyOpType, setSelectedDailyOpType] = useState<string | null>(null);
  const [collectionRateDialogOpen, setCollectionRateDialogOpen] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [customersByStatusDialogOpen, setCustomersByStatusDialogOpen] = useState(false);
  const [sectorDialogOpen, setSectorDialogOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productDialogMetric, setProductDialogMetric] = useState<"disbursed" | "portfolio" | "collected" | "outstanding">("disbursed");
  const [incomeExpanded, setIncomeExpanded] = useState(false);
  const [expenseExpanded, setExpenseExpanded] = useState(false);

  const buildFilterParams = () => {
    const params = new URLSearchParams();
    if (filterBranch) params.set("branchId", filterBranch);
    if (filterStartDate) params.set("startDate", filterStartDate);
    if (filterEndDate) params.set("endDate", filterEndDate);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  };

  const hasActiveFilters = filterBranch || filterStartDate || filterEndDate;

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats", filterBranch, filterStartDate, filterEndDate],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/stats${buildFilterParams()}`);
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      return response.json();
    },
  });

  const { data: branchList } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["/api/branches"],
  });

  const { data: alertDetails, isLoading: alertDetailsLoading } = useQuery<{
    category: string;
    title: string;
    items: any[];
  }>({
    queryKey: ["/api/dashboard/alert-details", selectedAlertCategory],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/alert-details/${selectedAlertCategory}`);
      if (!response.ok) throw new Error("Failed to fetch alert details");
      return response.json();
    },
    enabled: !!selectedAlertCategory && alertDialogOpen,
  });

  const { data: dailyOpDetails, isLoading: dailyOpDetailsLoading } = useQuery<{
    type: string;
    title: string;
    columns: string[];
    items: any[];
  }>({
    queryKey: ["/api/dashboard/daily-op-details", selectedDailyOpType],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/daily-op-details/${selectedDailyOpType}`);
      if (!response.ok) throw new Error("Failed to fetch daily op details");
      return response.json();
    },
    enabled: !!selectedDailyOpType && dailyOpDialogOpen,
  });

  const { data: roleData } = useQuery<{ role: string }>({
    queryKey: ["/api/user/role"],
  });

  const { data: branchStats, isLoading: branchLoading } = useQuery<BranchStats[]>({
    queryKey: ["/api/dashboard/branch-stats"],
  });

  const { data: fundingSourceStats, isLoading: fundingSourceLoading } = useQuery<FundingSourceBranchStats[]>({
    queryKey: ["/api/dashboard/funding-source-branch-stats"],
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

  const { data: collectionRateData, isLoading: collectionRateLoading } = useQuery<{
    rows: { month: string; monthKey: string; dueAmount: number; collectedAmount: number; balance: number }[];
    totals: { dueAmount: number; collectedAmount: number; balance: number };
  }>({
    queryKey: ["/api/dashboard/collection-rate-details", filterBranch, filterStartDate, filterEndDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterBranch) params.set("branchId", filterBranch);
      if (filterStartDate) params.set("startDate", filterStartDate);
      if (filterEndDate) params.set("endDate", filterEndDate);
      const qs = params.toString();
      const response = await fetch(`/api/dashboard/collection-rate-details${qs ? `?${qs}` : ""}`);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    enabled: collectionRateDialogOpen,
  });

  type MonthDetailItem = {
    installmentId: string;
    installmentNumber: number;
    dueDate: string;
    dueAmount: number;
    principalAmount: number;
    markupAmount: number;
    paidAmount: number;
    paymentDate: string | null;
    isPaid: boolean;
    balance: number;
    status: string;
    loanId: string;
    applicationId: string;
    productName: string;
    customerName: string;
    phoneNumber: string;
    branchName: string;
    officerName: string;
  };

  const { data: monthDetailData, isLoading: monthDetailLoading } = useQuery<{
    month: string;
    items: MonthDetailItem[];
  }>({
    queryKey: ["/api/dashboard/collection-rate-month-details", expandedMonth, filterBranch, filterStartDate, filterEndDate],
    queryFn: async () => {
      const params = new URLSearchParams({ month: expandedMonth! });
      if (filterBranch) params.set("branchId", filterBranch);
      if (filterStartDate) params.set("startDate", filterStartDate);
      if (filterEndDate) params.set("endDate", filterEndDate);
      const response = await fetch(`/api/dashboard/collection-rate-month-details?${params}`);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    enabled: !!expandedMonth,
  });

  const { data: customersByStatusData, isLoading: customersByStatusLoading } = useQuery<
    { status: string; customerCount: number; loanCount: number; totalAmount: number }[]
  >({
    queryKey: ["/api/dashboard/customers-by-status", filterBranch, filterStartDate, filterEndDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterBranch) params.set("branchId", filterBranch);
      if (filterStartDate) params.set("startDate", filterStartDate);
      if (filterEndDate) params.set("endDate", filterEndDate);
      const qs = params.toString();
      const response = await fetch(`/api/dashboard/customers-by-status${qs ? `?${qs}` : ""}`);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    enabled: customersByStatusDialogOpen,
  });

  const { data: sectorCustomersData, isLoading: sectorCustomersLoading } = useQuery<{
    sector: string;
    items: { id: string; applicationId: string; customerName: string; phoneNumber: string; principleAmount: number; totalReceivable: number; totalPaid: number; outstanding: number; status: string; productName: string; branchName: string; officerName: string }[];
  }>({
    queryKey: ["/api/dashboard/sector-customers", selectedSector, filterBranch, filterStartDate, filterEndDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterBranch) params.set("branchId", filterBranch);
      if (filterStartDate) params.set("startDate", filterStartDate);
      if (filterEndDate) params.set("endDate", filterEndDate);
      const qs = params.toString();
      const response = await fetch(`/api/dashboard/sector-customers/${encodeURIComponent(selectedSector!)}${qs ? `?${qs}` : ""}`);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
    enabled: !!selectedSector && sectorDialogOpen,
  });

  const { data: costAnalysis, isLoading: costAnalysisLoading } = useQuery<any>({
    queryKey: ["/api/dashboard/loan-cost-analysis"],
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
                New Financing
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Dashboard Filters */}
      <Card className="border-0 shadow-sm" data-testid="card-dashboard-filters">
        <CardContent className="py-3 px-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </div>
            <Select value={filterBranch} onValueChange={setFilterBranch} data-testid="select-filter-branch">
              <SelectTrigger className="w-[200px] h-9" data-testid="select-trigger-branch">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                {(branchList || []).map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-[150px] h-9 text-sm"
                placeholder="Start Date"
                data-testid="input-filter-start-date"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <Input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-[150px] h-9 text-sm"
                placeholder="End Date"
                data-testid="input-filter-end-date"
              />
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setFilterBranch(""); setFilterStartDate(""); setFilterEndDate(""); }}
                className="h-9 text-muted-foreground hover:text-foreground"
                data-testid="button-clear-filters"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Clear
              </Button>
            )}
            {hasActiveFilters && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30">
                Filtered
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className="overflow-hidden border-0 shadow-lg cursor-pointer"
          onClick={() => setCustomersByStatusDialogOpen(true)}
          data-testid="card-stat-total-financing-applications"
        >
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Financing Applications</p>
                <p className="text-2xl font-bold mt-1">{isLoading ? "..." : (stats?.totalLoans?.toString() || "0")}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">Click for details</p>
          </CardContent>
        </Card>
        {(() => {
          const curCount = stats?.currentMonthCount || 0;
          const curAmount = stats?.currentMonthAmount || 0;
          const prevAmount = stats?.prevMonthAmount || 0;
          const pctChange = prevAmount > 0 
            ? Math.round(((curAmount - prevAmount) / prevAmount) * 100) 
            : curAmount > 0 ? 100 : 0;
          const changeType = pctChange >= 0 ? "positive" as const : "negative" as const;
          const changeText = `${pctChange >= 0 ? '+' : ''}${pctChange}% from last month`;
          return (
            <StatCard
              title="Current Month Financing"
              value={`${curCount} | AFN ${Number(curAmount).toLocaleString()}`}
              change={changeText}
              changeType={changeType}
              icon={CheckCircle2}
              loading={isLoading}
              gradient="bg-gradient-to-r from-emerald-500 to-green-500"
              iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
            />
          );
        })()}
        <StatCard
          title="Total Customers"
          value={isLoading ? "..." : (stats?.disbursedLoanCount?.toString() || "0")}
          icon={Users}
          loading={isLoading}
          gradient="bg-gradient-to-r from-violet-500 to-purple-500"
          iconBg="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        {isLoading ? (
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
        ) : (
          <Card className="overflow-hidden border-0 shadow-lg cursor-pointer" data-testid="card-stat-collection-rate" onClick={() => setCollectionRateDialogOpen(true)}>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Collection Rate</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats?.totalPortfolio
                      ? `${Math.min(100, Math.round((stats.totalCollected / stats.totalPortfolio) * 100))}%`
                      : "0%"}
                  </p>
                </div>
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="mt-3 w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{
                    width: `${stats?.totalPortfolio ? Math.min(100, Math.round((stats.totalCollected / stats.totalPortfolio) * 100)) : 0}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">Click for details</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Portfolio"
          value={formatCurrency(stats?.totalDisbursed || 0)}
          icon={PiggyBank}
          loading={isLoading}
          gradient="bg-gradient-to-r from-teal-500 to-emerald-500"
          iconBg="bg-gradient-to-br from-teal-500 to-emerald-600"
          onProductClick={() => { setProductDialogMetric("disbursed"); setProductDialogOpen(true); }}
        />
        <StatCard
          title="Total Receivable Amount"
          value={formatCurrency(stats?.totalPortfolio || 0)}
          icon={Briefcase}
          loading={isLoading}
          gradient="bg-gradient-to-r from-purple-500 to-violet-500"
          iconBg="bg-gradient-to-br from-purple-500 to-violet-600"
          onProductClick={() => { setProductDialogMetric("portfolio"); setProductDialogOpen(true); }}
        />
        <StatCard
          title="Total Collected"
          value={formatCurrency(stats?.totalCollected || 0)}
          icon={Wallet}
          loading={isLoading}
          gradient="bg-gradient-to-r from-green-500 to-lime-500"
          iconBg="bg-gradient-to-br from-green-500 to-lime-600"
          onProductClick={() => { setProductDialogMetric("collected"); setProductDialogOpen(true); }}
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(stats?.outstandingBalance || 0)}
          icon={TrendingUp}
          loading={isLoading}
          gradient="bg-gradient-to-r from-indigo-500 to-blue-500"
          iconBg="bg-gradient-to-br from-indigo-500 to-blue-600"
          onProductClick={() => { setProductDialogMetric("outstanding"); setProductDialogOpen(true); }}
        />
        <StatCard
          title="Average Loan Size"
          value={formatCurrency(stats?.disbursedLoanCount && stats.disbursedLoanCount > 0 ? Math.round(stats.totalDisbursed / stats.disbursedLoanCount) : 0)}
          icon={BarChart3}
          loading={isLoading}
          gradient="bg-gradient-to-r from-amber-500 to-orange-500"
          iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
          breakdown={stats?.avgLoanByFunding?.map((item: any) => ({
            label: `${item.fundingSource} (${item.loanCount})`,
            value: formatCurrency(item.avgLoanSize),
          })) || []}
        />
      </div>

      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-5xl p-0 border-0 shadow-2xl">
          {(() => {
            const metricConfig = {
              disbursed: { label: "Total Disbursed", gradient: "from-teal-500 to-emerald-500", bg: "bg-teal-50 dark:bg-teal-950/30", accent: "text-teal-700 dark:text-teal-300", border: "border-teal-200 dark:border-teal-800", badge: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200", icon: PiggyBank },
              portfolio: { label: "Total Portfolio", gradient: "from-purple-500 to-violet-500", bg: "bg-purple-50 dark:bg-purple-950/30", accent: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800", badge: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", icon: Briefcase },
              collected: { label: "Total Collected", gradient: "from-green-500 to-lime-500", bg: "bg-green-50 dark:bg-green-950/30", accent: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800", badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: Wallet },
              outstanding: { label: "Outstanding Balance", gradient: "from-indigo-500 to-blue-500", bg: "bg-indigo-50 dark:bg-indigo-950/30", accent: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800", badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200", icon: TrendingUp },
            };
            const cfg = metricConfig[productDialogMetric];
            const MetricIcon = cfg.icon;
            const productColors = [
              "from-blue-500 to-cyan-500",
              "from-amber-500 to-orange-500",
              "from-rose-500 to-pink-500",
              "from-emerald-500 to-teal-500",
              "from-violet-500 to-purple-500",
              "from-red-500 to-rose-500",
            ];
            return (
              <>
                <div className={`bg-gradient-to-r ${cfg.gradient} px-6 py-5`}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <MetricIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <DialogHeader>
                        <DialogTitle className="text-white text-lg font-bold" data-testid="text-product-dialog-title">
                          {cfg.label} — By Product
                        </DialogTitle>
                      </DialogHeader>
                      <p className="text-white/70 text-xs mt-0.5">Breakdown across financing products</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-5">
                  {stats?.productBreakdown && stats.productBreakdown.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg}`}>
                          <p className="text-xs text-muted-foreground font-medium">Grand Total</p>
                          <p className={`text-xl font-bold mt-1 ${cfg.accent}`} data-testid="text-product-grand-total">
                            {formatCurrency(
                              productDialogMetric === "disbursed" ? (stats.totalDisbursed || 0) :
                              productDialogMetric === "portfolio" ? (stats.totalPortfolio || 0) :
                              productDialogMetric === "collected" ? (stats.totalCollected || 0) :
                              (stats.outstandingBalance || 0)
                            )}
                          </p>
                        </div>
                        <div className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg}`}>
                          <p className="text-xs text-muted-foreground font-medium">Products</p>
                          <p className={`text-xl font-bold mt-1 ${cfg.accent}`} data-testid="text-product-count">{stats.productBreakdown.length}</p>
                        </div>
                      </div>

                      <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                        {stats.productBreakdown.map((p, idx) => {
                          const amount =
                            productDialogMetric === "disbursed" ? p.totalDisbursed :
                            productDialogMetric === "portfolio" ? p.totalPortfolio :
                            productDialogMetric === "collected" ? p.totalCollected :
                            p.outstandingBalance;
                          const grandTotal =
                            productDialogMetric === "disbursed" ? (stats.totalDisbursed || 1) :
                            productDialogMetric === "portfolio" ? (stats.totalPortfolio || 1) :
                            productDialogMetric === "collected" ? (stats.totalCollected || 1) :
                            (stats.outstandingBalance || 1);
                          const pct = grandTotal > 0 ? (amount / grandTotal) * 100 : 0;
                          return (
                            <div
                              key={idx}
                              className={`bg-gradient-to-r ${productColors[idx % productColors.length]} rounded-full transition-all`}
                              style={{ width: `${Math.max(pct, 2)}%` }}
                              title={`${p.productName}: ${pct.toFixed(1)}%`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {stats.productBreakdown.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${productColors[idx % productColors.length]}`} />
                            <span>{p.productName}</span>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className={`${cfg.bg}`}>
                              <TableHead className="font-semibold">Product</TableHead>
                              <TableHead className="text-center font-semibold">Loans</TableHead>
                              {productDialogMetric !== "disbursed" ? (
                                <>
                                  <TableHead className="text-right font-semibold">Principal</TableHead>
                                  <TableHead className="text-right font-semibold">Margin</TableHead>
                                </>
                              ) : null}
                              <TableHead className="text-right font-semibold">Amount</TableHead>
                              <TableHead className="text-right font-semibold">Share</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stats.productBreakdown.map((p, idx) => {
                              const amount =
                                productDialogMetric === "disbursed" ? p.totalDisbursed :
                                productDialogMetric === "portfolio" ? p.totalPortfolio :
                                productDialogMetric === "collected" ? p.totalCollected :
                                p.outstandingBalance;
                              const grandTotal =
                                productDialogMetric === "disbursed" ? (stats.totalDisbursed || 1) :
                                productDialogMetric === "portfolio" ? (stats.totalPortfolio || 1) :
                                productDialogMetric === "collected" ? (stats.totalCollected || 1) :
                                (stats.outstandingBalance || 1);
                              const share = grandTotal > 0 ? ((amount / grandTotal) * 100).toFixed(1) : "0.0";
                              return (
                                <TableRow key={idx} className="hover:bg-muted/30 transition-colors" data-testid={`row-product-${idx}`}>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${productColors[idx % productColors.length]}`} />
                                      <span className="font-medium">{p.productName}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant="secondary" className="text-xs font-semibold">{p.loanCount}</Badge>
                                  </TableCell>
                                  {productDialogMetric === "portfolio" ? (
                                    <>
                                      <TableCell className="text-right text-sm">{formatCurrency(p.portfolioPrincipal)}</TableCell>
                                      <TableCell className="text-right text-sm">{formatCurrency(p.portfolioMargin)}</TableCell>
                                    </>
                                  ) : productDialogMetric === "collected" ? (
                                    <>
                                      <TableCell className="text-right text-sm">{formatCurrency(p.principalCollected)}</TableCell>
                                      <TableCell className="text-right text-sm">{formatCurrency(p.marginCollected)}</TableCell>
                                    </>
                                  ) : productDialogMetric === "outstanding" ? (
                                    <>
                                      <TableCell className="text-right text-sm">{formatCurrency(p.outstandingPrincipal)}</TableCell>
                                      <TableCell className="text-right text-sm">{formatCurrency(p.outstandingMargin)}</TableCell>
                                    </>
                                  ) : null}
                                  <TableCell className={`text-right font-bold ${cfg.accent}`}>{formatCurrency(amount)}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                          className={`h-full rounded-full bg-gradient-to-r ${productColors[idx % productColors.length]}`}
                                          style={{ width: `${Math.min(parseFloat(share), 100)}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-semibold text-muted-foreground w-12 text-right">{share}%</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                            <TableRow className={`${cfg.bg} font-bold border-t-2 ${cfg.border}`}>
                              <TableCell>
                                <span className={`font-bold ${cfg.accent}`}>Total</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={`text-xs font-bold border-0 ${cfg.badge}`}>{stats.productBreakdown.reduce((s, p) => s + p.loanCount, 0)}</Badge>
                              </TableCell>
                              {productDialogMetric === "portfolio" ? (
                                <>
                                  <TableCell className={`text-right ${cfg.accent}`}>{formatCurrency(stats.portfolioPrincipal || 0)}</TableCell>
                                  <TableCell className={`text-right ${cfg.accent}`}>{formatCurrency(stats.portfolioMargin || 0)}</TableCell>
                                </>
                              ) : productDialogMetric === "collected" ? (
                                <>
                                  <TableCell className={`text-right ${cfg.accent}`}>{formatCurrency(stats.principalCollected || 0)}</TableCell>
                                  <TableCell className={`text-right ${cfg.accent}`}>{formatCurrency(stats.marginCollected || 0)}</TableCell>
                                </>
                              ) : productDialogMetric === "outstanding" ? (
                                <>
                                  <TableCell className={`text-right ${cfg.accent}`}>{formatCurrency((stats.portfolioPrincipal || 0) - (stats.principalCollected || 0))}</TableCell>
                                  <TableCell className={`text-right ${cfg.accent}`}>{formatCurrency((stats.portfolioMargin || 0) - (stats.marginCollected || 0))}</TableCell>
                                </>
                              ) : null}
                              <TableCell className={`text-right font-bold ${cfg.accent}`}>
                                {formatCurrency(
                                  productDialogMetric === "disbursed" ? (stats.totalDisbursed || 0) :
                                  productDialogMetric === "portfolio" ? (stats.totalPortfolio || 0) :
                                  productDialogMetric === "collected" ? (stats.totalCollected || 0) :
                                  (stats.outstandingBalance || 0)
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <span className={`text-xs font-bold ${cfg.accent}`}>100%</span>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No product data available</p>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Daily Operations Panel */}
      <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-daily-operations">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Today's Operations</CardTitle>
              <p className="text-sm text-muted-foreground">{formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1,2,3,4,5,6,7,8,9,10].map(i => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { type: "applications_today", label: "Applications Received", value: stats?.dailyOps?.applicationsToday || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-500/10" },
                { type: "approved_today", label: "Approved Today", value: stats?.dailyOps?.approvedToday || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
                { type: "rejected_today", label: "Rejected Today", value: stats?.dailyOps?.rejectedToday || 0, icon: X, color: "text-red-500", bg: "bg-red-500/10" },
                { type: "disbursed_today", label: "Disbursed Today", value: stats?.dailyOps?.disbursedToday || 0, icon: ArrowUpRight, color: "text-teal-600", bg: "bg-teal-500/10" },
                { type: "amount_disbursed_today", label: "Amount Disbursed", value: formatCurrency(stats?.dailyOps?.amountDisbursedToday || 0), icon: DollarSign, color: "text-teal-600", bg: "bg-teal-500/10", isAmount: true },
                { type: "amount_due_today", label: "Amount Due Today", value: formatCurrency(stats?.dailyOps?.amountDueToday || 0), icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10", isAmount: true },
                { type: "amount_collected_today", label: "Collected Today", value: formatCurrency(stats?.dailyOps?.amountCollectedToday || 0), icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-500/10", isAmount: true },
                { type: "collected_today_count", label: "Payments Collected", value: stats?.dailyOps?.collectedTodayCount || 0, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-500/10" },
                { type: "installments_due_today", label: "Installments Due", value: stats?.dailyOps?.dueTodayCount || 0, icon: Clock, color: "text-orange-600", bg: "bg-orange-500/10" },
                { type: "missed_payments", label: "Missed Payments", value: stats?.dailyOps?.missedPayments || 0, icon: AlertCircle, color: (stats?.dailyOps?.missedPayments || 0) > 0 ? "text-red-500" : "text-emerald-600", bg: (stats?.dailyOps?.missedPayments || 0) > 0 ? "bg-red-500/10" : "bg-emerald-500/10" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setSelectedDailyOpType(item.type); setDailyOpDialogOpen(true); }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 text-left hover:bg-muted/60 hover:border-border transition-colors cursor-pointer"
                  data-testid={`daily-op-${item.type}`}
                >
                  <div className={`h-9 w-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium leading-tight">{item.label}</p>
                    <p className={`text-lg font-bold mt-0.5 ${typeof item.value === 'number' && item.value === 0 ? 'text-muted-foreground' : ''}`}>
                      {item.value}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerts Panel */}
      <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-alerts">
        <div className={`h-1 ${
          stats?.alerts?.some(a => a.type === 'critical') ? 'bg-gradient-to-r from-red-500 to-rose-500' :
          stats?.alerts?.some(a => a.type === 'warning') ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
          'bg-gradient-to-r from-emerald-500 to-green-500'
        }`} />
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-lg ${
              stats?.alerts?.some(a => a.type === 'critical') ? 'bg-gradient-to-br from-red-500 to-rose-600' :
              stats?.alerts?.some(a => a.type === 'warning') ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
              'bg-gradient-to-br from-emerald-500 to-green-600'
            }`}>
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Alerts & Notifications</CardTitle>
              <p className="text-sm text-muted-foreground">Action items requiring attention</p>
            </div>
          </div>
          {stats?.alerts && stats.alerts.length > 0 && (
            <Badge variant="outline" className={`${
              stats.alerts.some(a => a.type === 'critical') ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30' :
              stats.alerts.some(a => a.type === 'warning') ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30' :
              'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
            }`}>
              {stats.alerts.filter(a => a.type === 'critical').length > 0
                ? `${stats.alerts.filter(a => a.type === 'critical').length} Critical`
                : `${stats.alerts.length} Alerts`}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {(stats?.alerts || []).map((alert) => {
                const config = {
                  critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertCircle, iconColor: 'text-red-500', titleColor: 'text-red-700 dark:text-red-400' },
                  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle, iconColor: 'text-amber-500', titleColor: 'text-amber-700 dark:text-amber-400' },
                  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Clock, iconColor: 'text-blue-500', titleColor: 'text-blue-700 dark:text-blue-400' },
                  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle2, iconColor: 'text-emerald-500', titleColor: 'text-emerald-700 dark:text-emerald-400' },
                }[alert.type] || { bg: 'bg-muted/30', border: 'border-border/50', icon: AlertCircle, iconColor: 'text-muted-foreground', titleColor: '' };
                const AlertIcon = config.icon;
                const isClickable = alert.category !== 'none';
                return (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} border ${config.border} ${isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                    data-testid={`alert-${alert.id}`}
                    onClick={() => {
                      if (isClickable) {
                        const cat = alert.category.startsWith('officer_par') ? 'officer_par' : alert.category;
                        setSelectedAlertCategory(cat);
                        setAlertDialogOpen(true);
                      }
                    }}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <AlertIcon className={`h-5 w-5 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${config.titleColor}`}>{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {alert.type === 'critical' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white uppercase tracking-wider">
                          Urgent
                        </span>
                      )}
                      {isClickable && (
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PAR Aging Breakdown */}
      <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-par-aging">
        <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500" />
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Portfolio at Risk - Aging Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">
                {stats?.parAging?.overdueLoansCount || 0} overdue loans out of active portfolio
              </p>
            </div>
          </div>
          {stats?.parAging && (() => {
            const par30Cat = stats.parAging.categories?.find((c: any) => c.startDay <= 30 && c.endDay >= 30) || stats.parAging.par30;
            const par30Pct = par30Cat?.percentage || stats.parAging.par30?.percentage || 0;
            return (
              <Badge variant="outline" className={`${
                par30Pct > 5 ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30' :
                par30Pct > 2 ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30' :
                'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
              }`}>
                PAR30: {par30Pct}%
              </Badge>
            );
          })()}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4`} style={{ gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))` }}>
                {(() => {
                  const defaultColors = ["#fbbf24", "#f59e0b", "#f97316", "#f87171", "#dc2626", "#b91c1c", "#991b1b"];
                  const categories = stats?.parAging?.categories;
                  if (categories && categories.length > 0) {
                    return categories.map((cat: any, idx: number) => {
                      const pct = cat.percentage || 0;
                      const color = defaultColors[Math.min(idx, defaultColors.length - 1)];
                      const borderColor = pct > 5 ? 'border-red-500/50' : pct > 2 ? 'border-amber-500/50' : 'border-border/50';
                      return (
                        <div key={idx} className={`relative p-4 rounded-xl bg-muted/30 border ${borderColor} overflow-hidden`} data-testid={`par-aging-${idx}`}>
                          <div className="absolute top-0 left-0 h-1" style={{ width: `${Math.min(pct * 5, 100)}%`, backgroundColor: color }} />
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4" style={{ color }} />
                            <span className="text-xs font-semibold text-muted-foreground">{cat.label}</span>
                          </div>
                          <p className={`text-2xl font-bold ${pct > 5 ? 'text-red-500' : pct > 2 ? 'text-amber-600' : ''}`}>
                            {pct}%
                          </p>
                          <div className="mt-1.5 space-y-0.5">
                            <p className="text-xs text-muted-foreground">{cat.count || 0} loans</p>
                            <p className="text-xs font-medium">{formatCurrency(cat.amount || 0)}</p>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">Provision: {cat.provisionPercent}%</p>
                        </div>
                      );
                    });
                  }
                  return [
                    { label: "PAR > 1 Day", data: stats?.parAging?.par1 },
                    { label: "PAR > 7 Days", data: stats?.parAging?.par7 },
                    { label: "PAR > 30 Days", data: stats?.parAging?.par30 },
                    { label: "PAR > 60 Days", data: stats?.parAging?.par60 },
                    { label: "PAR > 90 Days", data: stats?.parAging?.par90 },
                  ].map((item, idx) => {
                    const pct = item.data?.percentage || 0;
                    const color = defaultColors[Math.min(idx, defaultColors.length - 1)];
                    const borderColor = pct > 5 ? 'border-red-500/50' : pct > 2 ? 'border-amber-500/50' : 'border-border/50';
                    return (
                      <div key={idx} className={`relative p-4 rounded-xl bg-muted/30 border ${borderColor} overflow-hidden`} data-testid={`par-aging-${idx}`}>
                        <div className="absolute top-0 left-0 h-1" style={{ width: `${Math.min(pct * 5, 100)}%`, backgroundColor: color }} />
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4" style={{ color }} />
                          <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
                        </div>
                        <p className={`text-2xl font-bold ${pct > 5 ? 'text-red-500' : pct > 2 ? 'text-amber-600' : ''}`}>
                          {pct}%
                        </p>
                        <div className="mt-1.5 space-y-0.5">
                          <p className="text-xs text-muted-foreground">{item.data?.count || 0} loans</p>
                          <p className="text-xs font-medium">{formatCurrency(item.data?.amount || 0)}</p>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              <div className="flex items-center gap-6 pt-3 border-t border-border/50 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total Active Portfolio:</span>
                  <span className="font-semibold">{formatCurrency(stats?.parAging?.totalActiveOLB || 0)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total Overdue:</span>
                  <span className="font-semibold text-red-500">{formatCurrency(stats?.parAging?.totalOverdueAmount || 0)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Loan Officer Performance Table */}
      <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-officer-performance">
        <div className="h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Loan Officer Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Portfolio and collection metrics by officer</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30">
            {stats?.officerPerformance?.length || 0} Officers
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : stats?.officerPerformance && stats.officerPerformance.length > 0 ? (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm" data-testid="table-officer-performance">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Officer</th>
                    <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Branch</th>
                    <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Active Loans</th>
                    <th className="text-right py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Portfolio</th>
                    <th className="text-right py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">PAR Amount</th>
                    <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">PAR Rate</th>
                    <th className="text-right py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Collected</th>
                    <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Disbursed (30d)</th>
                    <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.officerPerformance.map((officer, idx) => {
                    const collectionRate = officer.portfolioAmount > 0
                      ? Math.min(100, Math.round((officer.totalCollected / officer.portfolioAmount) * 100))
                      : 0;
                    const parScore = officer.parRate <= 1 ? 100 : officer.parRate <= 3 ? 75 : officer.parRate <= 5 ? 50 : officer.parRate <= 10 ? 25 : 0;
                    const collectionScore = collectionRate;
                    const activityScore = Math.min(100, officer.disbursedLast30d * 20);
                    const portfolioScore = Math.min(100, officer.activeLoans * 10);
                    const perfScore = Math.round(parScore * 0.35 + collectionScore * 0.35 + activityScore * 0.15 + portfolioScore * 0.15);
                    const perfLabel = perfScore >= 80 ? "Excellent" : perfScore >= 60 ? "Good" : perfScore >= 40 ? "Average" : perfScore >= 20 ? "Below Avg" : "Poor";
                    const perfColor = perfScore >= 80 ? "#10b981" : perfScore >= 60 ? "#3b82f6" : perfScore >= 40 ? "#f59e0b" : perfScore >= 20 ? "#f97316" : "#ef4444";
                    const perfBg = perfScore >= 80 ? "bg-emerald-500/10" : perfScore >= 60 ? "bg-blue-500/10" : perfScore >= 40 ? "bg-amber-500/10" : perfScore >= 20 ? "bg-orange-500/10" : "bg-red-500/10";

                    return (
                    <tr key={officer.officerId} className="border-b border-border/30 hover:bg-muted/30 transition-colors" data-testid={`row-officer-${idx}`}>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {officer.officerName?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-medium">{officer.officerName}</p>
                            {officer.officerCode && <p className="text-xs text-muted-foreground">{officer.officerCode}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{officer.branchName || '-'}</td>
                      <td className="py-3 px-3 text-center font-medium">{officer.activeLoans}</td>
                      <td className="py-3 px-3 text-right font-medium">{formatCurrency(officer.portfolioAmount)}</td>
                      <td className="py-3 px-3 text-right font-medium text-red-500">{formatCurrency(officer.parAmount)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          officer.parRate > 5 ? 'bg-red-500/10 text-red-600' :
                          officer.parRate > 2 ? 'bg-amber-500/10 text-amber-600' :
                          'bg-emerald-500/10 text-emerald-600'
                        }`}>
                          {officer.parRate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-emerald-600">{formatCurrency(officer.totalCollected)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600">
                          {officer.disbursedLast30d}
                        </span>
                      </td>
                      <td className="py-3 px-3" data-testid={`perf-score-${idx}`}>
                        <div className="flex flex-col items-center gap-1 min-w-[80px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold" style={{ color: perfColor }}>{perfScore}</span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${perfBg}`} style={{ color: perfColor }}>
                              {perfLabel}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${perfScore}%`, backgroundColor: perfColor }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No loan officers found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Performance Panel */}
      <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-financial-performance">
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Financial Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Income, expenses & net income from accounting</p>
            </div>
          </div>
          {stats?.financialPerformance && (
            <Badge variant="outline" className={`${
              stats.financialPerformance.netIncome >= 0
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
            }`}>
              Net: {formatCurrency(stats.financialPerformance.netIncome)}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
              </div>
              <Skeleton className="h-48 w-full" />
            </div>
          ) : stats?.financialPerformance ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "This Month",
                    income: stats.financialPerformance.monthlyIncome,
                    expenses: stats.financialPerformance.monthlyExpenses,
                    net: stats.financialPerformance.monthlyNetIncome,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    label: "Year to Date",
                    income: stats.financialPerformance.ytdIncome,
                    expenses: stats.financialPerformance.ytdExpenses,
                    net: stats.financialPerformance.ytdNetIncome,
                    color: "from-violet-500 to-purple-500",
                  },
                  {
                    label: "All Time",
                    income: stats.financialPerformance.totalIncome,
                    expenses: stats.financialPerformance.totalExpenses,
                    net: stats.financialPerformance.netIncome,
                    color: "from-emerald-500 to-green-500",
                  },
                ].map((period, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border/50 bg-muted/20" data-testid={`fin-perf-period-${idx}`}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{period.label}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <TrendingUp className="h-3 w-3 text-emerald-500" /> Income
                        </span>
                        <span className="text-sm font-semibold text-emerald-600">{formatCurrency(period.income)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <TrendingDown className="h-3 w-3 text-red-500" /> Expenses
                        </span>
                        <span className="text-sm font-semibold text-red-500">{formatCurrency(period.expenses)}</span>
                      </div>
                      <div className="border-t border-border/50 pt-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Net Income</span>
                          <span className={`text-base font-bold ${period.net >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {formatCurrency(period.net)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {stats.financialPerformance.monthlyTrend.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Monthly Trend</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.financialPerformance.monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)' }}
                        />
                        <Legend />
                        <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="netIncome" name="Net Income" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.financialPerformance.incomeBreakdown.length > 0 && (
                  <div>
                    <button
                      onClick={() => setIncomeExpanded(!incomeExpanded)}
                      className="w-full text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5 hover:text-foreground transition-colors"
                      data-testid="button-toggle-income"
                    >
                      {incomeExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Income Breakdown
                      <Badge variant="outline" className="ml-auto text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        {stats.financialPerformance.incomeBreakdown.length} items
                      </Badge>
                    </button>
                    {incomeExpanded && (
                      <div className="space-y-1.5">
                        {stats.financialPerformance.incomeBreakdown
                          .sort((a, b) => b.amount - a.amount)
                          .map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10" data-testid={`income-item-${idx}`}>
                            <span className="text-xs">
                              <span className="text-muted-foreground">{item.accountCode}</span>
                              <span className="ml-2 font-medium">{item.accountName}</span>
                            </span>
                            <span className="text-sm font-semibold text-emerald-600">{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {stats.financialPerformance.expenseBreakdown.length > 0 && (
                  <div>
                    <button
                      onClick={() => setExpenseExpanded(!expenseExpanded)}
                      className="w-full text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5 hover:text-foreground transition-colors"
                      data-testid="button-toggle-expense"
                    >
                      {expenseExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      <TrendingDown className="h-3.5 w-3.5 text-red-500" /> Expense Breakdown
                      <Badge variant="outline" className="ml-auto text-[10px] bg-red-500/10 text-red-500 border-red-500/20">
                        {stats.financialPerformance.expenseBreakdown.length} items
                      </Badge>
                    </button>
                    {expenseExpanded && (
                      <div className="space-y-1.5">
                        {stats.financialPerformance.expenseBreakdown
                          .sort((a, b) => b.amount - a.amount)
                          .map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-red-500/5 border border-red-500/10" data-testid={`expense-item-${idx}`}>
                            <span className="text-xs">
                              <span className="text-muted-foreground">{item.accountCode}</span>
                              <span className="ml-2 font-medium">{item.accountName}</span>
                            </span>
                            <span className="text-sm font-semibold text-red-500">{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No financial data available</p>
              <p className="text-xs mt-1">Post journal entries in the accounting module to see financial performance</p>
            </div>
          )}
        </CardContent>
      </Card>

      {costAnalysis && (
        <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-loan-cost-analysis">
          <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Loan Cost Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">Year-over-year cost efficiency and profitability</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Avg Operating Cost / Loan</p>
                <p className="text-xl font-bold" data-testid="text-avg-cost-current">{formatCurrency(costAnalysis.currentYear.avgCostPerLoan)}</p>
                <p className="text-[10px] text-muted-foreground">{costAnalysis.previousYear.year}: {formatCurrency(costAnalysis.previousYear.avgCostPerLoan)}</p>
                {costAnalysis.costImprovement !== 0 && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${costAnalysis.costImprovement > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {costAnalysis.costImprovement > 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    {Math.abs(costAnalysis.costImprovement).toFixed(1)}% {costAnalysis.costImprovement > 0 ? "decrease" : "increase"}
                  </div>
                )}
              </div>

              <div className="rounded-xl border p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Avg Margin Income / Loan</p>
                <p className="text-xl font-bold text-emerald-600" data-testid="text-avg-income-current">{formatCurrency(costAnalysis.currentYear.avgIncomePerLoan)}</p>
                <p className="text-[10px] text-muted-foreground">{costAnalysis.previousYear.year}: {formatCurrency(costAnalysis.previousYear.avgIncomePerLoan)}</p>
              </div>

              <div className="rounded-xl border p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Net Income Per Loan</p>
                <p className={`text-xl font-bold ${costAnalysis.currentYear.netIncomePerLoan >= 0 ? "text-emerald-600" : "text-red-500"}`} data-testid="text-net-per-loan">
                  {formatCurrency(costAnalysis.currentYear.netIncomePerLoan)}
                </p>
                <p className="text-[10px] text-muted-foreground">{costAnalysis.previousYear.year}: {formatCurrency(costAnalysis.previousYear.netIncomePerLoan)}</p>
              </div>

              <div className="rounded-xl border p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Cost-to-Income Ratio</p>
                <p className={`text-xl font-bold ${costAnalysis.currentYear.costIncomeRatio <= 100 ? "text-emerald-600" : "text-red-500"}`} data-testid="text-cost-ratio">
                  {costAnalysis.currentYear.costIncomeRatio.toFixed(1)}%
                </p>
                <p className="text-[10px] text-muted-foreground">{costAnalysis.previousYear.year}: {costAnalysis.previousYear.costIncomeRatio.toFixed(1)}%</p>
                {costAnalysis.ratioImprovement !== 0 && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${costAnalysis.ratioImprovement > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {costAnalysis.ratioImprovement > 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    {Math.abs(costAnalysis.ratioImprovement).toFixed(1)}pp {costAnalysis.ratioImprovement > 0 ? "improved" : "worsened"}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border p-4 space-y-1">
                <p className="text-xs text-muted-foreground font-semibold mb-2 flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" /> {costAnalysis.currentYear.year} — Active Loans Serviced: {costAnalysis.currentYear.totalLoans}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Total Income</p>
                    <p className="text-sm font-bold text-emerald-600">{formatCurrency(costAnalysis.currentYear.totalIncome)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Operating Expenses</p>
                    <p className="text-sm font-bold text-amber-600">{formatCurrency(costAnalysis.currentYear.operatingExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Total Expenses</p>
                    <p className="text-sm font-bold text-red-500">{formatCurrency(costAnalysis.currentYear.totalExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Margin Income</p>
                    <p className="text-sm font-bold text-blue-600">{formatCurrency(costAnalysis.currentYear.totalMarginIncome)}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border p-4 space-y-1">
                <p className="text-xs text-muted-foreground font-semibold mb-2 flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" /> {costAnalysis.previousYear.year} — Active Loans Serviced: {costAnalysis.previousYear.totalLoans}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Total Income</p>
                    <p className="text-sm font-bold text-emerald-600">{formatCurrency(costAnalysis.previousYear.totalIncome)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Operating Expenses</p>
                    <p className="text-sm font-bold text-amber-600">{formatCurrency(costAnalysis.previousYear.operatingExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Total Expenses</p>
                    <p className="text-sm font-bold text-red-500">{formatCurrency(costAnalysis.previousYear.totalExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Margin Income</p>
                    <p className="text-sm font-bold text-blue-600">{formatCurrency(costAnalysis.previousYear.totalMarginIncome)}</p>
                  </div>
                </div>
              </div>
            </div>

            {costAnalysis.currentYear.byProduct.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5" /> Cost by Product ({costAnalysis.currentYear.year})
                </p>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-xs text-muted-foreground">
                        <th className="text-left py-2 px-2">Product</th>
                        <th className="text-right py-2 px-2">Loans</th>
                        <th className="text-right py-2 px-2">Disbursed</th>
                        <th className="text-right py-2 px-2">Margin Income</th>
                        <th className="text-right py-2 px-2">Cost/Loan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costAnalysis.currentYear.byProduct.map((p: any, idx: number) => (
                        <tr key={idx} className="border-b border-dashed" data-testid={`row-product-cost-${idx}`}>
                          <td className="py-2 px-2 font-medium">{p.productName}</td>
                          <td className="text-right py-2 px-2">{p.loanCount}</td>
                          <td className="text-right py-2 px-2">{formatCurrency(p.totalDisbursed)}</td>
                          <td className="text-right py-2 px-2 text-emerald-600">{formatCurrency(p.totalMarginIncome)}</td>
                          <td className="text-right py-2 px-2 text-amber-600 font-semibold">{formatCurrency(p.costPerLoanShare)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {costAnalysis.currentYear.byBranch.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> Profitability by Branch ({costAnalysis.currentYear.year})
                </p>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-xs text-muted-foreground">
                        <th className="text-left py-2 px-2">Branch</th>
                        <th className="text-right py-2 px-2">Loans</th>
                        <th className="text-right py-2 px-2">Disbursed</th>
                        <th className="text-right py-2 px-2">Margin Income</th>
                        <th className="text-right py-2 px-2">Allocated Cost</th>
                        <th className="text-right py-2 px-2">Profit/Loan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costAnalysis.currentYear.byBranch.map((b: any, idx: number) => (
                        <tr key={idx} className="border-b border-dashed" data-testid={`row-branch-profit-${idx}`}>
                          <td className="py-2 px-2 font-medium">{b.branchName}</td>
                          <td className="text-right py-2 px-2">{b.loanCount}</td>
                          <td className="text-right py-2 px-2">{formatCurrency(b.totalDisbursed)}</td>
                          <td className="text-right py-2 px-2 text-emerald-600">{formatCurrency(b.totalMarginIncome)}</td>
                          <td className="text-right py-2 px-2 text-red-500">{formatCurrency(b.allocatedExpenses)}</td>
                          <td className={`text-right py-2 px-2 font-semibold ${b.profitPerLoan >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {formatCurrency(b.profitPerLoan)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
              <CardTitle className="text-lg font-semibold" data-testid="text-portfolio-summary-title">Portfolio Summary</CardTitle>
              <p className="text-sm text-muted-foreground">Breakdown by funding source and branch</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="funding-source" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="funding-source" data-testid="tab-funding-source">Summary by Funding Source</TabsTrigger>
              <TabsTrigger value="branch" data-testid="tab-branch">Summary by Branch</TabsTrigger>
            </TabsList>

            <TabsContent value="funding-source">
              {fundingSourceLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full" data-testid="table-funding-source-stats">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Funding Source</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Branch</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">No. of Financings</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">No. of Customers</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Total Disbursed</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Total Portfolio</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Total Collected</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Outstanding Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const stats = fundingSourceStats || [];
                        const grouped: Record<string, FundingSourceBranchStats[]> = {};
                        stats.forEach(s => {
                          if (!grouped[s.fundingSourceName]) grouped[s.fundingSourceName] = [];
                          grouped[s.fundingSourceName].push(s);
                        });
                        return Object.entries(grouped).map(([fsName, rows], groupIdx) => {
                          const colorSet = FUNDING_SOURCE_COLORS[groupIdx % FUNDING_SOURCE_COLORS.length];
                          const fsTotal = {
                            loanCount: rows.reduce((s, r) => s + r.loanCount, 0),
                            customerCount: rows.reduce((s, r) => s + r.customerCount, 0),
                            totalDisbursed: rows.reduce((s, r) => s + r.totalDisbursed, 0),
                            totalCollected: rows.reduce((s, r) => s + r.totalCollected, 0),
                            totalPortfolio: rows.reduce((s, r) => s + r.totalPortfolio, 0),
                            outstandingBalance: rows.reduce((s, r) => s + r.outstandingBalance, 0),
                          };
                          return (
                            <>{rows.map((row, i) => (
                                <tr key={`${fsName}-${row.branchName}`} className={`border-b last:border-0 transition-colors ${colorSet.bg}`}>
                                  {i === 0 && (
                                    <td className="px-4 py-3 font-medium" rowSpan={rows.length}>
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow">
                                          {fsName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span>{fsName}</span>
                                      </div>
                                    </td>
                                  )}
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <div className="h-6 w-6 rounded bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">
                                        {row.branchName.substring(0, 2).toUpperCase()}
                                      </div>
                                      <span className="text-sm">{row.branchName}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30">
                                      {row.loanCount}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <Badge variant="outline" className="bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30">
                                      {row.customerCount}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(row.totalDisbursed)}
                                  </td>
                                  <td className="px-4 py-3 text-right font-medium text-blue-600 dark:text-blue-400">
                                    {formatCurrency(row.totalPortfolio)}
                                  </td>
                                  <td className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">
                                    {formatCurrency(row.totalCollected)}
                                  </td>
                                  <td className="px-4 py-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                                    {formatCurrency(row.outstandingBalance)}
                                  </td>
                                </tr>
                              ))}
                            {rows.length > 1 && (
                              <tr className={`border-b ${colorSet.subtotal}`}>
                                <td className="px-4 py-2 text-right text-sm font-semibold text-muted-foreground" colSpan={2}>Subtotal</td>
                                <td className="px-4 py-2 text-right text-sm font-semibold">{fsTotal.loanCount}</td>
                                <td className="px-4 py-2 text-right text-sm font-semibold">{fsTotal.customerCount}</td>
                                <td className="px-4 py-2 text-right text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(fsTotal.totalDisbursed)}</td>
                                <td className="px-4 py-2 text-right text-sm font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(fsTotal.totalPortfolio)}</td>
                                <td className="px-4 py-2 text-right text-sm font-semibold text-green-600 dark:text-green-400">{formatCurrency(fsTotal.totalCollected)}</td>
                                <td className="px-4 py-2 text-right text-sm font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(fsTotal.outstandingBalance)}</td>
                              </tr>
                            )}
                            </>
                          );
                        });
                      })()}
                      {(!fundingSourceStats || fundingSourceStats.length === 0) && (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                            <Building2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                            <p>No funding source data available</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {fundingSourceStats && fundingSourceStats.length > 0 && (
                      <tfoot>
                        <tr className="bg-muted/50 font-semibold">
                          <td className="px-4 py-3" colSpan={2}>Grand Total</td>
                          <td className="px-4 py-3 text-right">{fundingSourceStats.reduce((sum, b) => sum + b.loanCount, 0)}</td>
                          <td className="px-4 py-3 text-right">{fundingSourceStats.reduce((sum, b) => sum + b.customerCount, 0)}</td>
                          <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(fundingSourceStats.reduce((sum, b) => sum + b.totalDisbursed, 0))}</td>
                          <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">{formatCurrency(fundingSourceStats.reduce((sum, b) => sum + b.totalPortfolio, 0))}</td>
                          <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">{formatCurrency(fundingSourceStats.reduce((sum, b) => sum + b.totalCollected, 0))}</td>
                          <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">{formatCurrency(fundingSourceStats.reduce((sum, b) => sum + b.outstandingBalance, 0))}</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="branch">
              {branchLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full" data-testid="table-branch-stats">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Branch</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">No. of Financings</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">No. of Customers</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Total Disbursed</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Total Portfolio</th>
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
                          <td className="px-4 py-3 text-right font-medium text-blue-600 dark:text-blue-400">
                            {formatCurrency(branch.totalPortfolio)}
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
                          <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
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
                          <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">{formatCurrency(branchStats.reduce((sum, b) => sum + b.totalPortfolio, 0))}</td>
                          <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">{formatCurrency(branchStats.reduce((sum, b) => sum + b.totalCollected, 0))}</td>
                          <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">{formatCurrency(branchStats.reduce((sum, b) => sum + b.outstandingBalance, 0))}</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* KPI Cards + Loan Distribution by Sector */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-active-borrowers">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Active Borrowers</p>
                  <p className="text-3xl font-bold mt-2">{isLoading ? <Skeleton className="h-9 w-20" /> : (stats?.activeBorrowers?.toLocaleString() || "0")}</p>
                  {!isLoading && stats && (
                    <p className={`text-xs mt-2 font-medium ${stats.activeBorrowers > (stats.prevMonthBorrowers || 0) ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                      {stats.prevMonthBorrowers ? `${stats.activeBorrowers > stats.prevMonthBorrowers ? "+" : ""}${(((stats.activeBorrowers - stats.prevMonthBorrowers) / stats.prevMonthBorrowers) * 100).toFixed(0)}% from last month` : ""}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-outstanding-loans">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Outstanding Loans</p>
                  <p className="text-3xl font-bold mt-2">{isLoading ? <Skeleton className="h-9 w-24" /> : `${((stats?.outstandingBalance || 0) / 1000000).toFixed(1)}M`}</p>
                  {!isLoading && stats && stats.totalPortfolio > 0 && (
                    <p className="text-xs mt-2 font-medium text-emerald-600 dark:text-emerald-400">
                      {((stats.totalCollected / stats.totalPortfolio) * 100).toFixed(1)}% collected
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Wallet className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-repayment-rate">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Repayment Rate</p>
                  <p className="text-3xl font-bold mt-2">{isLoading ? <Skeleton className="h-9 w-16" /> : `${stats?.repaymentRate || 0}%`}</p>
                  {!isLoading && (
                    <p className="text-xs mt-2 font-medium text-emerald-600 dark:text-emerald-400">
                      Portfolio collection
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-portfolio-at-risk">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Portfolio at Risk</p>
                  <p className="text-3xl font-bold mt-2">{isLoading ? <Skeleton className="h-9 w-16" /> : `${stats?.portfolioAtRisk || 0}%`}</p>
                  {!isLoading && (
                    <p className={`text-xs mt-2 font-medium ${(stats?.portfolioAtRisk || 0) <= 5 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                      {(stats?.portfolioAtRisk || 0) <= 5 ? "Within target" : "Above target"}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Loan Distribution by Sector */}
        <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-sector-distribution">
          <div className="h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Loan Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">By business sector</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <div className="space-y-5">
                {(stats?.sectorDistribution || []).map((sector, idx) => {
                  const barColors = ["bg-teal-500", "bg-emerald-500", "bg-amber-500", "bg-blue-500", "bg-slate-500", "bg-purple-500", "bg-rose-500"];
                  return (
                    <div
                      key={sector.sector}
                      data-testid={`sector-row-${idx}`}
                      className="cursor-pointer hover:bg-muted/30 rounded-lg p-2 -mx-2 transition-colors"
                      onClick={() => { setSelectedSector(sector.sector); setSectorDialogOpen(true); }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{sector.sector} <span className="text-xs text-muted-foreground">({sector.count} loans)</span></span>
                        <span className="text-sm font-bold">{sector.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${barColors[idx % barColors.length]}`}
                          style={{ width: `${sector.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {(!stats?.sectorDistribution || stats.sectorDistribution.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">No sector data available</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
              <CardTitle className="text-lg font-semibold">Recent Financings</CardTitle>
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
              <span className="capitalize">{selectedStatus}</span> Financings
              <Badge variant="outline" className={getStatusColor(selectedStatus || "")}>
                {loansData?.total || 0} financings
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

      {/* Alert Details Dialog */}
      <Dialog open={alertDialogOpen} onOpenChange={(open) => { setAlertDialogOpen(open); if (!open) setSelectedAlertCategory(null); }}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col" data-testid="dialog-alert-details">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {alertDetails?.title || 'Alert Details'}
              <Badge variant="outline" className="ml-2">
                {alertDetails?.items?.length || 0} items
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {alertDetailsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : alertDetails?.items && alertDetails.items.length > 0 ? (
              <table className="w-full text-sm" data-testid="table-alert-details">
                <thead className="sticky top-0 bg-background z-10">
                  <tr className="border-b bg-muted/30">
                    {selectedAlertCategory === 'license_expiry' ? (
                      <>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Customer</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Phone</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Business</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">License Type</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">License #</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Expiry Date</th>
                        <th className="px-3 py-2 text-center font-semibold text-muted-foreground text-xs uppercase">Days Left</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Branch</th>
                      </>
                    ) : (
                    <>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">App ID</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Customer</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Branch</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Officer</th>
                    </>
                    )}
                    {(selectedAlertCategory === 'overdue' || selectedAlertCategory === 'due_today' || selectedAlertCategory === 'upcoming') && (
                      <>
                        <th className="px-3 py-2 text-center font-semibold text-muted-foreground text-xs uppercase">Inst #</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Due Date</th>
                        <th className="px-3 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Amount</th>
                      </>
                    )}
                    {selectedAlertCategory === 'overdue' && (
                      <>
                        <th className="px-3 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Paid</th>
                        <th className="px-3 py-2 text-center font-semibold text-muted-foreground text-xs uppercase">Days Overdue</th>
                      </>
                    )}
                    {selectedAlertCategory === 'pending' && (
                      <>
                        <th className="px-3 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Requested</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Date</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Product</th>
                      </>
                    )}
                    {selectedAlertCategory === 'disbursement' && (
                      <>
                        <th className="px-3 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Amount</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Product</th>
                      </>
                    )}
                    {selectedAlertCategory === 'officer_par' && (
                      <>
                        <th className="px-3 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Amount</th>
                        <th className="px-3 py-2 text-center font-semibold text-muted-foreground text-xs uppercase">Days Overdue</th>
                        <th className="px-3 py-2 text-center font-semibold text-muted-foreground text-xs uppercase">Overdue Inst.</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {alertDetails.items.map((item: any, idx: number) => (
                    <tr key={idx} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`} data-testid={`alert-detail-row-${idx}`}>
                      {selectedAlertCategory === 'license_expiry' ? (
                        <>
                          <td className="px-3 py-2 font-medium">
                            <Link href={`/customers/${item.customerId}`} className="text-blue-600 hover:underline">
                              {item.customerName || '-'}
                            </Link>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{item.phoneNumber || '-'}</td>
                          <td className="px-3 py-2">{item.businessName || '-'}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.licenseType || '-'}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.licenseNumber || '-'}</td>
                          <td className="px-3 py-2">{item.expiryDate ? formatDate(item.expiryDate) : '-'}</td>
                          <td className="px-3 py-2 text-center">
                            <Badge variant="outline" className={
                              item.daysUntilExpiry <= 3 ? 'bg-red-500/10 text-red-600 border-red-500/30' :
                              item.daysUntilExpiry <= 7 ? 'bg-orange-500/10 text-orange-600 border-orange-500/30' :
                              'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            }>
                              {item.daysUntilExpiry}d
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{item.branchName || '-'}</td>
                        </>
                      ) : (
                      <>
                      <td className="px-3 py-2 font-medium">
                        <Link href={`/loans/${item.loanId}`} className="text-blue-600 hover:underline">
                          {item.applicationId || '-'}
                        </Link>
                      </td>
                      <td className="px-3 py-2">{item.customerName || '-'}</td>
                      <td className="px-3 py-2 text-muted-foreground">{item.branchName || '-'}</td>
                      <td className="px-3 py-2 text-muted-foreground">{item.officerName || '-'}</td>
                      </>
                      )}
                      {(selectedAlertCategory === 'overdue' || selectedAlertCategory === 'due_today' || selectedAlertCategory === 'upcoming') && (
                        <>
                          <td className="px-3 py-2 text-center">{item.installmentNumber || '-'}</td>
                          <td className="px-3 py-2">{item.dueDate ? formatDate(item.dueDate) : '-'}</td>
                          <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.totalAmount || 0)}</td>
                        </>
                      )}
                      {selectedAlertCategory === 'overdue' && (
                        <>
                          <td className="px-3 py-2 text-right text-emerald-600">{formatCurrency(item.paidAmount || 0)}</td>
                          <td className="px-3 py-2 text-center">
                            <Badge variant="outline" className={
                              item.daysOverdue > 90 ? 'bg-red-500/10 text-red-600 border-red-500/30' :
                              item.daysOverdue > 30 ? 'bg-orange-500/10 text-orange-600 border-orange-500/30' :
                              'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            }>
                              {item.daysOverdue}d
                            </Badge>
                          </td>
                        </>
                      )}
                      {selectedAlertCategory === 'pending' && (
                        <>
                          <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.requestAmount || 0)}</td>
                          <td className="px-3 py-2">{item.requestDate ? formatDate(item.requestDate) : '-'}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.productName || '-'}</td>
                        </>
                      )}
                      {selectedAlertCategory === 'disbursement' && (
                        <>
                          <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.principleAmount || 0)}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.productName || '-'}</td>
                        </>
                      )}
                      {selectedAlertCategory === 'officer_par' && (
                        <>
                          <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.principleAmount || 0)}</td>
                          <td className="px-3 py-2 text-center">
                            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                              {item.maxDaysOverdue}d
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-center">{item.overdueCount}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p>No items found for this alert</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Daily Operations Details Dialog */}
      <Dialog open={dailyOpDialogOpen} onOpenChange={(open) => { setDailyOpDialogOpen(open); if (!open) setSelectedDailyOpType(null); }}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col" data-testid="dialog-daily-op-details">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-orange-500" />
              {dailyOpDetails?.title || 'Daily Operations Details'}
              <Badge variant="outline" className="ml-2">
                {dailyOpDetails?.items?.length || 0} items
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {dailyOpDetailsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : dailyOpDetails?.items && dailyOpDetails.items.length > 0 ? (
              <table className="w-full text-sm" data-testid="table-daily-op-details">
                <thead className="sticky top-0 bg-background z-10">
                  <tr className="border-b bg-muted/30">
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">App ID</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Customer</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Branch</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Officer</th>
                    {dailyOpDetails.columns?.includes('product') && (
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Product</th>
                    )}
                    {dailyOpDetails.columns?.includes('installment') && (
                      <th className="px-3 py-2 text-center font-semibold text-muted-foreground text-xs uppercase">Inst #</th>
                    )}
                    {dailyOpDetails.columns?.includes('due_date') && (
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Due Date</th>
                    )}
                    {dailyOpDetails.columns?.includes('paid_date') && (
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Paid Date</th>
                    )}
                    {dailyOpDetails.columns?.includes('paid') && (
                      <th className="px-3 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Paid</th>
                    )}
                    {dailyOpDetails.columns?.includes('due') && (
                      <th className="px-3 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Due</th>
                    )}
                    {dailyOpDetails.columns?.includes('amount') && (
                      <th className="px-3 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Amount</th>
                    )}
                    {dailyOpDetails.columns?.includes('status') && (
                      <th className="px-3 py-2 text-center font-semibold text-muted-foreground text-xs uppercase">Status</th>
                    )}
                    {dailyOpDetails.columns?.includes('days_overdue') && (
                      <th className="px-3 py-2 text-center font-semibold text-muted-foreground text-xs uppercase">Days Overdue</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dailyOpDetails.items.map((item: any, idx: number) => (
                    <tr key={idx} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`} data-testid={`daily-op-detail-row-${idx}`}>
                      <td className="px-3 py-2 font-medium">
                        <Link href={`/loans/${item.loanId}`} className="text-blue-600 hover:underline">
                          {item.applicationId || '-'}
                        </Link>
                      </td>
                      <td className="px-3 py-2">{item.customerName || '-'}</td>
                      <td className="px-3 py-2 text-muted-foreground">{item.branchName || '-'}</td>
                      <td className="px-3 py-2 text-muted-foreground">{item.officerName || '-'}</td>
                      {dailyOpDetails.columns?.includes('product') && (
                        <td className="px-3 py-2 text-muted-foreground">{item.productName || '-'}</td>
                      )}
                      {dailyOpDetails.columns?.includes('installment') && (
                        <td className="px-3 py-2 text-center">{item.installmentNumber || '-'}</td>
                      )}
                      {dailyOpDetails.columns?.includes('due_date') && (
                        <td className="px-3 py-2">{item.dueDate ? formatDate(item.dueDate) : '-'}</td>
                      )}
                      {dailyOpDetails.columns?.includes('paid_date') && (
                        <td className="px-3 py-2">{item.paymentDate ? formatDate(item.paymentDate) : '-'}</td>
                      )}
                      {dailyOpDetails.columns?.includes('paid') && (
                        <td className="px-3 py-2 text-right text-emerald-600 font-medium">{formatCurrency(item.paidAmount || 0)}</td>
                      )}
                      {dailyOpDetails.columns?.includes('due') && (
                        <td className="px-3 py-2 text-right">{formatCurrency(item.amount || 0)}</td>
                      )}
                      {dailyOpDetails.columns?.includes('amount') && (
                        <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.amount || 0)}</td>
                      )}
                      {dailyOpDetails.columns?.includes('status') && (
                        <td className="px-3 py-2 text-center">
                          <Badge variant="outline" className="text-xs">{item.status || '-'}</Badge>
                        </td>
                      )}
                      {dailyOpDetails.columns?.includes('days_overdue') && (
                        <td className="px-3 py-2 text-center">
                          <Badge variant="outline" className={
                            item.daysOverdue > 90 ? 'bg-red-500/10 text-red-600 border-red-500/30' :
                            item.daysOverdue > 30 ? 'bg-orange-500/10 text-orange-600 border-orange-500/30' :
                            'bg-amber-500/10 text-amber-600 border-amber-500/30'
                          }>
                            {item.daysOverdue}d
                          </Badge>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p>No items found for this metric today</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Collection Rate Details Dialog */}
      <Dialog open={collectionRateDialogOpen} onOpenChange={(open) => { setCollectionRateDialogOpen(open); if (!open) setExpandedMonth(null); }}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="dialog-collection-rate">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Collection Rate Details
              {collectionRateData && (
                <Badge variant="outline" className="ml-2">
                  {collectionRateData.rows.length} months
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {collectionRateLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : collectionRateData?.rows && collectionRateData.rows.length > 0 ? (
              <table className="w-full text-sm" data-testid="table-collection-rate">
                <thead className="sticky top-0 bg-background z-10">
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-2 text-left font-semibold text-muted-foreground text-xs uppercase w-8"></th>
                    <th className="px-4 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Month</th>
                    <th className="px-4 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Due Amount</th>
                    <th className="px-4 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Collected</th>
                    <th className="px-4 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Balance</th>
                    <th className="px-4 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {collectionRateData.rows.map((row, idx) => {
                    const isExpanded = expandedMonth === row.monthKey;
                    const rate = row.dueAmount > 0 ? Math.round((row.collectedAmount / row.dueAmount) * 100) : 0;
                    return (
                      <Fragment key={`month-${row.monthKey}`}>
                        <tr
                          className={`border-b last:border-0 cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50 dark:bg-blue-950/30' : idx % 2 === 0 ? 'bg-background hover:bg-muted/30' : 'bg-muted/10 hover:bg-muted/30'}`}
                          onClick={() => setExpandedMonth(isExpanded ? null : row.monthKey)}
                          data-testid={`row-month-${row.monthKey}`}
                        >
                          <td className="px-2 py-2 text-center">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-blue-500 inline" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground inline" />
                            )}
                          </td>
                          <td className="px-4 py-2 font-medium">{row.month}</td>
                          <td className="px-4 py-2 text-right font-mono">{formatCurrency(row.dueAmount)}</td>
                          <td className="px-4 py-2 text-right font-mono text-emerald-600">{formatCurrency(row.collectedAmount)}</td>
                          <td className="px-4 py-2 text-right font-mono text-amber-600">{formatCurrency(row.balance)}</td>
                          <td className="px-4 py-2 text-right font-mono">{rate}%</td>
                        </tr>
                        {isExpanded && (
                          <tr key={`detail-${idx}`}>
                            <td colSpan={6} className="p-0">
                              <div className="bg-slate-50 dark:bg-slate-900/50 border-y border-blue-200 dark:border-blue-800">
                                {monthDetailLoading ? (
                                  <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                                    <span className="text-sm text-muted-foreground">Loading installment details...</span>
                                  </div>
                                ) : monthDetailData?.items && monthDetailData.items.length > 0 ? (
                                  <div className="max-h-[300px] overflow-auto">
                                    <table className="w-full text-xs">
                                      <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
                                        <tr>
                                          <th className="px-3 py-1.5 text-left font-semibold text-muted-foreground uppercase">Customer</th>
                                          <th className="px-3 py-1.5 text-left font-semibold text-muted-foreground uppercase">Loan ID</th>
                                          <th className="px-3 py-1.5 text-left font-semibold text-muted-foreground uppercase">Due Date</th>
                                          <th className="px-3 py-1.5 text-right font-semibold text-muted-foreground uppercase">Due</th>
                                          <th className="px-3 py-1.5 text-right font-semibold text-muted-foreground uppercase">Paid</th>
                                          <th className="px-3 py-1.5 text-right font-semibold text-muted-foreground uppercase">Balance</th>
                                          <th className="px-3 py-1.5 text-left font-semibold text-muted-foreground uppercase">Paid Date</th>
                                          <th className="px-3 py-1.5 text-center font-semibold text-muted-foreground uppercase">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {monthDetailData.items.map((item, i) => (
                                          <tr key={item.installmentId} className={`border-b last:border-0 ${i % 2 === 0 ? '' : 'bg-white/50 dark:bg-black/10'}`}>
                                            <td className="px-3 py-1.5 font-medium truncate max-w-[150px]" title={item.customerName}>
                                              {item.customerName}
                                            </td>
                                            <td className="px-3 py-1.5 font-mono text-blue-600 dark:text-blue-400">
                                              {item.applicationId}
                                            </td>
                                            <td className="px-3 py-1.5">{formatDate(item.dueDate)}</td>
                                            <td className="px-3 py-1.5 text-right font-mono">{formatCurrency(item.dueAmount)}</td>
                                            <td className="px-3 py-1.5 text-right font-mono text-emerald-600">{formatCurrency(item.paidAmount)}</td>
                                            <td className="px-3 py-1.5 text-right font-mono text-amber-600">{formatCurrency(item.balance)}</td>
                                            <td className="px-3 py-1.5">{item.paymentDate ? formatDate(item.paymentDate) : '-'}</td>
                                            <td className="px-3 py-1.5 text-center">
                                              <Badge
                                                variant={item.status === 'paid' ? 'default' : item.status === 'partial' ? 'outline' : 'destructive'}
                                                className={`text-[10px] px-1.5 py-0 ${item.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : item.status === 'partial' ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900 dark:text-amber-300' : ''}`}
                                              >
                                                {item.status === 'paid' ? 'Paid' : item.status === 'partial' ? 'Partial' : 'Unpaid'}
                                              </Badge>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                      <tfoot className="bg-slate-100 dark:bg-slate-800 font-semibold text-xs">
                                        <tr>
                                          <td className="px-3 py-1.5" colSpan={3}>
                                            Total ({monthDetailData.items.length} installments)
                                          </td>
                                          <td className="px-3 py-1.5 text-right font-mono">
                                            {formatCurrency(monthDetailData.items.reduce((s, i) => s + i.dueAmount, 0))}
                                          </td>
                                          <td className="px-3 py-1.5 text-right font-mono text-emerald-600">
                                            {formatCurrency(monthDetailData.items.reduce((s, i) => s + i.paidAmount, 0))}
                                          </td>
                                          <td className="px-3 py-1.5 text-right font-mono text-amber-600">
                                            {formatCurrency(monthDetailData.items.reduce((s, i) => s + i.balance, 0))}
                                          </td>
                                          <td colSpan={2} className="px-3 py-1.5 text-center">
                                            <span className="text-emerald-600">{monthDetailData.items.filter(i => i.status === 'paid').length} paid</span>
                                            {monthDetailData.items.filter(i => i.status === 'partial').length > 0 && (
                                              <span className="text-amber-600 ml-2">{monthDetailData.items.filter(i => i.status === 'partial').length} partial</span>
                                            )}
                                            {monthDetailData.items.filter(i => i.status === 'unpaid').length > 0 && (
                                              <span className="text-red-600 ml-2">{monthDetailData.items.filter(i => i.status === 'unpaid').length} unpaid</span>
                                            )}
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-muted-foreground text-sm">
                                    No installment details found for this month
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                  <tr className="border-t-2 bg-muted/40 font-bold">
                    <td className="px-2 py-3"></td>
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(collectionRateData.totals.dueAmount)}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600">{formatCurrency(collectionRateData.totals.collectedAmount)}</td>
                    <td className="px-4 py-3 text-right font-mono text-amber-600">{formatCurrency(collectionRateData.totals.balance)}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {collectionRateData.totals.dueAmount > 0 ? `${Math.round((collectionRateData.totals.collectedAmount / collectionRateData.totals.dueAmount) * 100)}%` : '0%'}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No collection data available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Customers by Status Dialog */}
      <Dialog open={customersByStatusDialogOpen} onOpenChange={setCustomersByStatusDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col" data-testid="dialog-customers-by-status">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-500" />
              Customer Loans by Status
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {customersByStatusLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : customersByStatusData && customersByStatusData.length > 0 ? (
              <table className="w-full text-sm" data-testid="table-customers-by-status">
                <thead className="sticky top-0 bg-background z-10">
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Status</th>
                    <th className="px-4 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Customers</th>
                    <th className="px-4 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Loans</th>
                    <th className="px-4 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {customersByStatusData.map((row, idx) => (
                    <tr key={idx} className={`border-b last:border-0 hover:bg-muted/30 ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className={getStatusColor(row.status)}>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-semibold">{row.customerCount}</td>
                      <td className="px-4 py-2 text-right font-mono">{row.loanCount}</td>
                      <td className="px-4 py-2 text-right font-mono">{formatCurrency(row.totalAmount)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 bg-muted/40 font-bold">
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-right font-mono">{customersByStatusData.reduce((s, r) => s + r.customerCount, 0)}</td>
                    <td className="px-4 py-3 text-right font-mono">{customersByStatusData.reduce((s, r) => s + r.loanCount, 0)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(customersByStatusData.reduce((s, r) => s + r.totalAmount, 0))}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No customer data available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Sector Customers Dialog */}
      <Dialog open={sectorDialogOpen} onOpenChange={(open) => { setSectorDialogOpen(open); if (!open) setSelectedSector(null); }}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col" data-testid="dialog-sector-customers">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-teal-500" />
              {selectedSector} Sector - Active Loans
              {sectorCustomersData && (
                <Badge variant="outline" className="ml-2">
                  {sectorCustomersData.items.length} loans
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {sectorCustomersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : sectorCustomersData?.items && sectorCustomersData.items.length > 0 ? (
              <table className="w-full text-sm" data-testid="table-sector-customers">
                <thead className="sticky top-0 bg-background z-10">
                  <tr className="border-b bg-muted/30">
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">#</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">App ID</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Customer</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Phone</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Branch</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Officer</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground text-xs uppercase">Product</th>
                    <th className="px-3 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Principal</th>
                    <th className="px-3 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Total Paid</th>
                    <th className="px-3 py-2 text-right font-semibold text-muted-foreground text-xs uppercase">Outstanding</th>
                  </tr>
                </thead>
                <tbody>
                  {sectorCustomersData.items.map((item, idx) => (
                    <tr key={item.id} className={`border-b last:border-0 hover:bg-muted/30 ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                      <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                      <td className="px-3 py-2 font-medium">
                        <Link href={`/loans/${item.id}`} className="text-blue-600 hover:underline">{item.applicationId}</Link>
                      </td>
                      <td className="px-3 py-2">{item.customerName}</td>
                      <td className="px-3 py-2 text-muted-foreground">{item.phoneNumber || '-'}</td>
                      <td className="px-3 py-2 text-muted-foreground">{item.branchName}</td>
                      <td className="px-3 py-2 text-muted-foreground">{item.officerName}</td>
                      <td className="px-3 py-2">{item.productName || '-'}</td>
                      <td className="px-3 py-2 text-right font-mono">{formatCurrency(item.principleAmount)}</td>
                      <td className="px-3 py-2 text-right font-mono text-emerald-600">{formatCurrency(item.totalPaid)}</td>
                      <td className="px-3 py-2 text-right font-mono text-amber-600">{formatCurrency(item.outstanding)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 bg-muted/40 font-bold">
                    <td colSpan={7} className="px-3 py-3">Total</td>
                    <td className="px-3 py-3 text-right font-mono">{formatCurrency(sectorCustomersData.items.reduce((s, r) => s + r.principleAmount, 0))}</td>
                    <td className="px-3 py-3 text-right font-mono text-emerald-600">{formatCurrency(sectorCustomersData.items.reduce((s, r) => s + r.totalPaid, 0))}</td>
                    <td className="px-3 py-3 text-right font-mono text-amber-600">{formatCurrency(sectorCustomersData.items.reduce((s, r) => s + r.outstanding, 0))}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p>No loans found in this sector</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
