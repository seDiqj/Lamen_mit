import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import {
  RefreshCw,
  Wallet,
  Briefcase,
  Users,
  UserCheck,
  HandCoins,
  TrendingUp,
  TrendingDown,
  Trash2,
  UserPlus,
  DollarSign,
  Sprout,
  Store,
  Factory,
  CalendarDays,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type ManagementData = {
  portfolio: {
    grossPortfolio: number;
    outstandingPortfolio: number;
    activeClients: number;
    activeBorrowers: number;
    womenClients: number;
    youthClients: number;
    ruralClients: number;
    urbanClients: number;
    agriculturePortfolio: number;
    msmePortfolio: number;
    smePortfolio: number;
  };
  quality: {
    par30: number;
    par30Amount: number;
    par90: number;
    par90Amount: number;
    collectionRate: number;
    writeOffs: number;
  };
  finance: { income: number; expenses: number; profit: number; oss: number; fss: number };
  operations: {
    newClients: number;
    loansDisbursedCount: number;
    loansDisbursedAmount: number;
    avgLoanSize: number;
    officerProductivity: { id: string; name: string; branchName: string | null; activeLoans: number; clients: number; portfolio: number }[];
    branchRanking: { id: string; name: string; clients: number; activeLoans: number; portfolio: number; collectionRate: number; par30: number }[];
    provinceRanking: { province: string; clients: number; loans: number; portfolio: number }[];
  };
  charts: {
    trends: { bucket: string; disbursed: number; disbursedCount: number; collected: number; newClients: number }[];
    sectorDisbursements: { sector: string; amount: number; count: number }[];
    genderDisbursements: { gender: string; amount: number; count: number }[];
    parAging: { label: string; amount: number; loans: number; percentage: number }[];
  };
};

type FinancialStats = {
  financialPerformance?: {
    monthlyTrend: { month: string; income: number; expenses: number; netIncome: number }[];
    expenseBreakdown: { accountCode: string; accountName: string; amount: number }[];
  };
};

const PIE_COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#ef4444", "#84cc16"];

function compactAFN(v: number) {
  if (Math.abs(v) >= 1_000_000) return `AFN ${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `AFN ${(v / 1_000).toFixed(0)}K`;
  return `AFN ${Math.round(v)}`;
}

function compactNum(v: number) {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(Math.round(v));
}

function KpiTile({
  label,
  value,
  icon: Icon,
  iconBg,
  testId,
}: {
  label: string;
  value: string;
  icon: any;
  iconBg: string;
  testId: string;
}) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg" data-testid={testId}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-11 w-11 shrink-0 rounded-xl ${iconBg} flex items-center justify-center shadow-md`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-medium truncate">{label}</p>
          <p className="text-xl font-bold truncate">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ExecKpi({
  label,
  value,
  icon: Icon,
  circleBg,
  iconColor,
  change,
  changeUp,
  spark,
  sparkColor,
  testId,
}: {
  label: string;
  value: string;
  icon: any;
  circleBg: string;
  iconColor: string;
  change?: string;
  changeUp?: boolean;
  spark?: number[];
  sparkColor?: string;
  testId: string;
}) {
  const sparkData = (spark || []).map((v, i) => ({ i, v }));
  return (
    <Card className="border shadow-sm" data-testid={testId}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`h-11 w-11 shrink-0 rounded-full ${circleBg} flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground font-medium truncate">{label}</p>
            <p className="text-xl font-bold truncate">{value}</p>
          </div>
        </div>
        <div className="flex items-end justify-between mt-2 h-8">
          {change ? (
            <div className={`flex items-center gap-1 text-xs font-semibold ${changeUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
              {changeUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{change}</span>
              <span className="text-muted-foreground font-normal">vs prev. month</span>
            </div>
          ) : <span />}
          {sparkData.length > 1 && (
            <div className="w-20 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkData}>
                  <Line type="monotone" dataKey="v" stroke={sparkColor || "#16a34a"} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (Math.PI / 180) * angleDeg;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, rOuter: number, rInner: number, startDeg: number, endDeg: number) {
  const so = polar(cx, cy, rOuter, startDeg);
  const eo = polar(cx, cy, rOuter, endDeg);
  const si = polar(cx, cy, rInner, endDeg);
  const ei = polar(cx, cy, rInner, startDeg);
  const large = Math.abs(startDeg - endDeg) > 180 ? 1 : 0;
  return `M ${so.x} ${so.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${eo.x} ${eo.y} L ${si.x} ${si.y} A ${rInner} ${rInner} 0 ${large} 0 ${ei.x} ${ei.y} Z`;
}

function NeedleGauge({
  label,
  value,
  max = 100,
  min = 0,
  display,
  displayColor,
  segments,
  sub,
  testId,
}: {
  label: string;
  value: number;
  max?: number;
  min?: number;
  display: string;
  displayColor: string;
  segments: { upTo: number; color: string }[];
  sub?: string;
  testId: string;
}) {
  const cx = 90, cy = 80, rOuter = 70, rInner = 48;
  const frac = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const needleAngle = 180 - frac * 180;
  const tip = polar(cx, cy, rInner - 4, needleAngle);
  let prev = min;
  const segs = segments.map(s => {
    const startDeg = 180 - ((prev - min) / (max - min)) * 180;
    const endDeg = 180 - ((Math.min(s.upTo, max) - min) / (max - min)) * 180;
    prev = s.upTo;
    return { startDeg, endDeg, color: s.color };
  });
  return (
    <Card className="border shadow-sm" data-testid={testId}>
      <CardContent className="p-4 flex flex-col items-center">
        <p className="text-sm font-semibold mb-1">{label}</p>
        <svg width="180" height="96" viewBox="0 0 180 96">
          {segs.map((s, i) => (
            <path key={i} d={arcPath(cx, cy, rOuter, rInner, s.startDeg, s.endDeg)} fill={s.color} />
          ))}
          <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="currentColor" strokeWidth={3} strokeLinecap="round" className="text-foreground" />
          <circle cx={cx} cy={cy} r={5} className="fill-foreground" />
        </svg>
        <p className="text-2xl font-bold -mt-1" style={{ color: displayColor }}>{display}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function PanelCard({ title, testId, children, className }: { title: string; testId: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={`overflow-hidden border-0 shadow-lg ${className || ""}`} data-testid={testId}>
      <CardContent className="p-4">
        <p className="text-sm font-semibold mb-3">{title}</p>
        {children}
      </CardContent>
    </Card>
  );
}

function HBar({ label, pct, value, color }: { label: string; pct: number; value?: string; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value ? `${value} · ` : ""}{pct.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function ExecutiveDashboard() {
  const today = new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

  const [draftPeriod, setDraftPeriod] = useState("monthly");
  const [draftBranch, setDraftBranch] = useState("all");
  const [draftProduct, setDraftProduct] = useState("all");
  const [applied, setApplied] = useState({ period: "monthly", branch: "all", product: "all" });

  const { data: branches } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["/api/branches"],
  });
  const { data: products } = useQuery<{ id: string; productName: string }[]>({
    queryKey: ["/api/financing-products"],
  });

  const { data, isLoading, isError, isFetching, refetch } = useQuery<ManagementData>({
    queryKey: ["/api/management/dashboard", applied.period, applied.branch, applied.product],
    queryFn: async () => {
      const params = new URLSearchParams({ period: applied.period });
      if (applied.branch !== "all") params.set("branchId", applied.branch);
      if (applied.product !== "all") params.set("product", applied.product);
      const res = await fetch(`/api/management/dashboard?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch executive dashboard");
      return res.json();
    },
  });

  const applyFilters = () => {
    if (draftPeriod === applied.period && draftBranch === applied.branch && draftProduct === applied.product) {
      refetch();
    } else {
      setApplied({ period: draftPeriod, branch: draftBranch, product: draftProduct });
    }
  };

  const { data: stats, isError: statsError } = useQuery<FinancialStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isError) {
    return (
      <div className="p-6 flex flex-col items-center gap-3">
        <p className="text-muted-foreground" data-testid="text-error">Could not load the executive dashboard. You may not have access, or something went wrong.</p>
        <button className="text-sm text-primary underline" onClick={() => refetch()} data-testid="button-retry">Try again</button>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-96" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-20" />)}
        </div>
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  const { portfolio, quality, finance, operations, charts } = data;
  const monthlyTrend = stats?.financialPerformance?.monthlyTrend || [];
  const expenseBreakdown = (stats?.financialPerformance?.expenseBreakdown || []).slice(0, 6);

  const totalClients = portfolio.activeClients || 1;
  const genderTotal = charts.genderDisbursements.reduce((s, g) => s + g.amount, 0) || 1;
  const women = charts.genderDisbursements.find(g => g.gender === "female");
  const men = charts.genderDisbursements.find(g => g.gender === "male");
  const ruralPct = (portfolio.ruralClients / totalClients) * 100;
  const urbanPct = (portfolio.urbanClients / totalClients) * 100;
  const outstanding = portfolio.outstandingPortfolio || 1;
  const writeOffPct = portfolio.grossPortfolio > 0 ? (quality.writeOffs / portfolio.grossPortfolio) * 100 : 0;
  const trendData = charts.trends.map(t => ({
    ...t,
    label: new Date(t.bucket).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
  }));
  const disbursedSpark = charts.trends.map(t => t.disbursed);
  const collectedSpark = charts.trends.map(t => t.collected);
  const newClientsSpark = charts.trends.map(t => t.newClients);
  const profitSpark = monthlyTrend.map(m => m.netIncome);
  const ytdDisbursed = charts.trends.filter(t => new Date(t.bucket).getFullYear() === new Date().getFullYear()).reduce((s, t) => s + t.disbursed, 0);
  const lastTwoDisbursed = charts.trends.slice(-2);
  const disbursedChange = lastTwoDisbursed.length === 2 && lastTwoDisbursed[0].disbursed !== 0
    ? ((lastTwoDisbursed[1].disbursed - lastTwoDisbursed[0].disbursed) / Math.abs(lastTwoDisbursed[0].disbursed)) * 100
    : null;
  const lastTwoProfit = monthlyTrend.slice(-2);
  const profitChange = lastTwoProfit.length === 2 && lastTwoProfit[0].netIncome !== 0
    ? ((lastTwoProfit[1].netIncome - lastTwoProfit[0].netIncome) / Math.abs(lastTwoProfit[0].netIncome)) * 100
    : null;
  const maxProvincePortfolio = Math.max(...operations.provinceRanking.map(p => p.portfolio), 1);
  const maxBranchPortfolio = Math.max(...operations.branchRanking.map(b => b.portfolio), 1);
  const maxOfficerLoans = Math.max(...operations.officerProductivity.map(o => o.activeLoans), 1);

  return (
    <div className="space-y-4 p-1">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-amber-400 dark:to-yellow-500 bg-clip-text text-transparent" data-testid="text-page-title">
            Executive Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Overview of Institutional Performance</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Last updated: {today}</span>
        </div>
      </div>

      {/* Filter bar */}
      <Card className="border shadow-sm" data-testid="card-filters">
        <CardContent className="p-3 flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Period</p>
            <Select value={draftPeriod} onValueChange={setDraftPeriod}>
              <SelectTrigger className="w-[140px] h-9" data-testid="select-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Branch</p>
            <Select value={draftBranch} onValueChange={setDraftBranch}>
              <SelectTrigger className="w-[170px] h-9" data-testid="select-branch">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {(branches || []).map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Product</p>
            <Select value={draftProduct} onValueChange={setDraftProduct}>
              <SelectTrigger className="w-[190px] h-9" data-testid="select-product">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {(products || []).map(p => (
                  <SelectItem key={p.id} value={p.productName}>{p.productName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={applyFilters} disabled={isFetching} className="h-9" data-testid="button-refresh">
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <ExecKpi label="Gross Portfolio" value={compactAFN(portfolio.grossPortfolio)} icon={Wallet} circleBg="bg-emerald-100 dark:bg-emerald-900/40" iconColor="text-emerald-600 dark:text-emerald-400" spark={disbursedSpark} sparkColor="#16a34a" testId="kpi-gross-portfolio" />
        <ExecKpi label="Outstanding Portfolio" value={compactAFN(portfolio.outstandingPortfolio)} icon={Briefcase} circleBg="bg-amber-100 dark:bg-amber-900/40" iconColor="text-amber-600 dark:text-amber-400" spark={collectedSpark} sparkColor="#f59e0b" testId="kpi-outstanding-portfolio" />
        <ExecKpi label="Active Borrowers" value={String(portfolio.activeBorrowers)} icon={UserCheck} circleBg="bg-blue-100 dark:bg-blue-900/40" iconColor="text-blue-600 dark:text-blue-400" spark={newClientsSpark} sparkColor="#2563eb" testId="kpi-active-borrowers" />
        <ExecKpi label="Active Clients" value={String(portfolio.activeClients)} icon={Users} circleBg="bg-sky-100 dark:bg-sky-900/40" iconColor="text-sky-600 dark:text-sky-400" spark={newClientsSpark} sparkColor="#0ea5e9" testId="kpi-active-clients" />
        <ExecKpi label="Loans Disbursed (YTD)" value={compactAFN(ytdDisbursed)} icon={HandCoins} circleBg="bg-violet-100 dark:bg-violet-900/40" iconColor="text-violet-600 dark:text-violet-400" change={disbursedChange !== null ? `${Math.abs(disbursedChange).toFixed(1)}%` : undefined} changeUp={disbursedChange !== null ? disbursedChange >= 0 : undefined} spark={disbursedSpark} sparkColor="#8b5cf6" testId="kpi-loans-disbursed-ytd" />
        <ExecKpi label="Profit" value={compactAFN(finance.profit)} icon={TrendingUp} circleBg={finance.profit >= 0 ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-red-100 dark:bg-red-900/40"} iconColor={finance.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"} change={profitChange !== null ? `${Math.abs(profitChange).toFixed(1)}%` : undefined} changeUp={profitChange !== null ? profitChange >= 0 : undefined} spark={profitSpark} sparkColor={finance.profit >= 0 ? "#16a34a" : "#ef4444"} testId="kpi-profit" />
      </div>

      {/* Row 2: sector / gender / rural-urban / composition */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <PanelCard title="Portfolio by Sector" testId="card-sector">
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={charts.sectorDisbursements} dataKey="amount" nameKey="sector" cx="50%" cy="50%" innerRadius={45} outerRadius={75}>
                {charts.sectorDisbursements.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Legend verticalAlign="bottom" height={40} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </PanelCard>

        <PanelCard title="Gender Distribution (by Disbursement)" testId="card-gender">
          <div className="flex items-center justify-between gap-2">
            <div className="text-center shrink-0">
              <p className="text-xs text-muted-foreground">Women</p>
              <p className="text-xl font-bold text-pink-600 dark:text-pink-400">{(((women?.amount || 0) / genderTotal) * 100).toFixed(0)}%</p>
              <p className="text-[11px] text-pink-600 dark:text-pink-400 font-medium">{compactAFN(women?.amount || 0)}</p>
            </div>
            <div className="relative flex-1 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.genderDisbursements} dataKey="amount" nameKey="gender" cx="50%" cy="50%" innerRadius={44} outerRadius={72}>
                    {charts.genderDisbursements.map((g, i) => (
                      <Cell key={i} fill={g.gender === "female" ? "#ec4899" : g.gender === "male" ? "#2563eb" : PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-1">
                <span className="text-2xl font-bold text-pink-500">&#9792;</span>
                <span className="text-2xl font-bold text-blue-500">&#9794;</span>
              </div>
            </div>
            <div className="text-center shrink-0">
              <p className="text-xs text-muted-foreground">Men</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{(((men?.amount || 0) / genderTotal) * 100).toFixed(0)}%</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{compactAFN(men?.amount || 0)}</p>
            </div>
          </div>
        </PanelCard>

        <PanelCard title="Rural vs Urban (by Clients)" testId="card-rural-urban">
          <div className="space-y-4 mt-4">
            <HBar label="Rural" pct={ruralPct} value={String(portfolio.ruralClients)} color="#16a34a" />
            <HBar label="Urban" pct={urbanPct} value={String(portfolio.urbanClients)} color="#15803d" />
          </div>
        </PanelCard>

        <PanelCard title="Portfolio Composition" testId="card-composition">
          <div className="space-y-3">
            {[
              { label: "Agriculture Portfolio", amount: portfolio.agriculturePortfolio, icon: Sprout, color: "text-green-600 dark:text-green-400" },
              { label: "MSME Portfolio", amount: portfolio.msmePortfolio, icon: Store, color: "text-blue-600 dark:text-blue-400" },
              { label: "SME Portfolio", amount: portfolio.smePortfolio, icon: Factory, color: "text-amber-600 dark:text-amber-400" },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-dashed last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <row.icon className={`h-4 w-4 shrink-0 ${row.color}`} />
                  <span className="text-xs text-muted-foreground truncate">{row.label}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{compactAFN(row.amount)}</p>
                  <p className="text-[10px] text-muted-foreground">{((row.amount / outstanding) * 100).toFixed(0)}%</p>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      {/* Row 3: gauges + portfolio aging */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <NeedleGauge label="PAR 30" value={quality.par30} max={15} display={`${quality.par30.toFixed(1)}%`} displayColor={quality.par30 > 5 ? "#ef4444" : "#16a34a"} segments={[{ upTo: 5, color: "#16a34a" }, { upTo: 10, color: "#f59e0b" }, { upTo: 15, color: "#ef4444" }]} sub={formatCurrency(quality.par30Amount)} testId="gauge-par30" />
        <NeedleGauge label="PAR 90" value={quality.par90} max={15} display={`${quality.par90.toFixed(1)}%`} displayColor={quality.par90 > 3 ? "#ef4444" : "#16a34a"} segments={[{ upTo: 5, color: "#16a34a" }, { upTo: 10, color: "#f59e0b" }, { upTo: 15, color: "#ef4444" }]} sub={formatCurrency(quality.par90Amount)} testId="gauge-par90" />
        <NeedleGauge label="Collection Rate" value={quality.collectionRate} min={0} max={100} display={`${quality.collectionRate.toFixed(1)}%`} displayColor={quality.collectionRate >= 90 ? "#16a34a" : quality.collectionRate >= 80 ? "#f59e0b" : "#ef4444"} segments={[{ upTo: 80, color: "#ef4444" }, { upTo: 90, color: "#f59e0b" }, { upTo: 100, color: "#16a34a" }]} testId="gauge-collection-rate" />
        <Card className="border shadow-sm" data-testid="card-writeoffs">
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <p className="text-sm font-semibold mb-2">Write-offs</p>
            <div className="h-11 w-11 rounded-xl bg-red-500/15 flex items-center justify-center mb-2">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-xl font-bold text-red-500">{compactAFN(quality.writeOffs)}</p>
            <p className="text-xs text-muted-foreground mt-1">{writeOffPct.toFixed(2)}% of gross portfolio</p>
          </CardContent>
        </Card>
        <PanelCard title="Portfolio Aging (DAB Buckets)" testId="card-aging" className="col-span-2 md:col-span-3 xl:col-span-1">
          <div className="space-y-2.5">
            {charts.parAging.map((b, i) => (
              <HBar
                key={i}
                label={b.label}
                pct={b.percentage}
                color={b.label === "Current" ? "#16a34a" : ["#84cc16", "#f59e0b", "#f97316", "#ef4444", "#991b1b"][Math.min(i - 1, 4)] || "#ef4444"}
              />
            ))}
          </div>
        </PanelCard>
      </div>

      {/* Row 4: income vs expense, profit trend, OSS/FSS, expenses breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <PanelCard title="Income vs Expense Trend (Monthly)" testId="card-income-expense">
          {statsError ? (
            <p className="text-sm text-muted-foreground py-8 text-center" data-testid="text-stats-error">Could not load financial trend data.</p>
          ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={compactNum} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="income" name="Income" stroke="#16a34a" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
          )}
        </PanelCard>

        <PanelCard title="Profit Trend (Monthly)" testId="card-profit-trend">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={compactNum} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Line type="monotone" dataKey="netIncome" name="Net Income" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </PanelCard>

        <div className="grid grid-cols-1 gap-3">
          <NeedleGauge label="Operating Self Sufficiency (OSS)" value={finance.oss} max={150} display={`${finance.oss.toFixed(0)}%`} displayColor={finance.oss >= 100 ? "#16a34a" : "#f59e0b"} segments={[{ upTo: 80, color: "#ef4444" }, { upTo: 100, color: "#f59e0b" }, { upTo: 150, color: "#16a34a" }]} testId="gauge-oss" />
          <NeedleGauge label="Financial Self Sufficiency (FSS)" value={finance.fss} max={150} display={`${finance.fss.toFixed(0)}%`} displayColor={finance.fss >= 100 ? "#16a34a" : "#f59e0b"} segments={[{ upTo: 80, color: "#ef4444" }, { upTo: 100, color: "#f59e0b" }, { upTo: 150, color: "#16a34a" }]} testId="gauge-fss" />
        </div>

        <PanelCard title="Expenses Breakdown" testId="card-expenses-breakdown">
          {expenseBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="amount" nameKey="accountName" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                  {expenseBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                <Legend verticalAlign="bottom" height={40} wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No expense data available</p>
          )}
        </PanelCard>
      </div>

      {/* Row 5: officer productivity, new clients, loans disbursed, avg loan size, branch & province rankings */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <PanelCard title="Loan Officer Productivity (Active Loans)" testId="card-officer-productivity">
          <div className="space-y-2.5">
            {operations.officerProductivity.slice(0, 5).map(o => (
              <HBar key={o.id} label={o.name} pct={(o.activeLoans / maxOfficerLoans) * 100} value={String(o.activeLoans)} color="#2563eb" />
            ))}
          </div>
        </PanelCard>

        <div className="grid grid-cols-1 gap-3">
          <KpiTile label="New Clients (This Month)" value={String(operations.newClients)} icon={UserPlus} iconBg="bg-gradient-to-br from-emerald-500 to-green-600" testId="kpi-new-clients" />
          <KpiTile label="Loans Disbursed (This Month)" value={compactAFN(operations.loansDisbursedAmount)} icon={HandCoins} iconBg="bg-gradient-to-br from-teal-500 to-emerald-600" testId="kpi-loans-disbursed-month" />
          <KpiTile label="Average Loan Size" value={compactAFN(operations.avgLoanSize)} icon={DollarSign} iconBg="bg-gradient-to-br from-blue-500 to-cyan-600" testId="kpi-avg-loan-size" />
        </div>

        <PanelCard title="Branch Ranking (by Portfolio)" testId="card-branch-ranking">
          <div className="space-y-2.5">
            {operations.branchRanking.map(b => (
              <HBar key={b.id} label={b.name} pct={(b.portfolio / maxBranchPortfolio) * 100} value={compactAFN(b.portfolio)} color="#16a34a" />
            ))}
          </div>
        </PanelCard>

        <PanelCard title="Province Ranking (by Portfolio)" testId="card-province-ranking">
          <div className="space-y-2.5">
            {operations.provinceRanking.slice(0, 6).map((p, i) => (
              <HBar key={i} label={p.province} pct={(p.portfolio / maxProvincePortfolio) * 100} value={compactAFN(p.portfolio)} color="#2563eb" />
            ))}
          </div>
        </PanelCard>
      </div>

      {/* Row 6: disbursement trend + client demographics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <PanelCard title="Disbursements & Collections Trend (Monthly)" testId="card-disbursement-trend">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={compactNum} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="disbursed" name="Disbursed" fill="#2563eb" radius={[3, 3, 0, 0]} />
              <Bar dataKey="collected" name="Collected" fill="#16a34a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </PanelCard>

        <PanelCard title="Client Demographics" testId="card-demographics">
          <div className="space-y-2.5 mt-1">
            <HBar label="Women Clients" pct={(portfolio.womenClients / totalClients) * 100} value={String(portfolio.womenClients)} color="#ec4899" />
            <HBar label="Youth Clients (18-35)" pct={(portfolio.youthClients / totalClients) * 100} value={String(portfolio.youthClients)} color="#8b5cf6" />
            <HBar label="Rural Clients" pct={ruralPct} value={String(portfolio.ruralClients)} color="#16a34a" />
            <HBar label="Urban Clients" pct={urbanPct} value={String(portfolio.urbanClients)} color="#0ea5e9" />
          </div>
        </PanelCard>
      </div>

      <p className="text-xs text-muted-foreground text-center pb-2">All figures are in AFN | YTD: Year to Date</p>
    </div>
  );
}
