import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import {
  Briefcase,
  Users,
  TrendingUp,
  ShieldAlert,
  DollarSign,
  Activity,
  Building2,
  MapPin,
  Wallet,
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

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];
const GENDER_COLORS: Record<string, string> = { male: "#3b82f6", female: "#ec4899", other: "#8b5cf6", unknown: "#94a3b8" };

function formatBucket(bucket: string, period: string) {
  const d = new Date(bucket);
  if (period === "yearly") return String(d.getFullYear());
  if (period === "quarterly") return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`;
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function compactCurrency(v: number) {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(Math.round(v));
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  gradient,
  iconBg,
  testId,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: any;
  gradient: string;
  iconBg: string;
  testId: string;
}) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg" data-testid={testId}>
      <div className={`h-1 ${gradient}`} />
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground font-medium truncate">{label}</p>
            <p className="text-2xl font-bold mt-1 truncate">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`h-14 w-14 shrink-0 rounded-xl ${iconBg} flex items-center justify-center shadow-lg`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ title, icon: Icon, gradient }: { title: string; icon: any; gradient: string }) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <div className={`h-9 w-9 rounded-lg ${gradient} flex items-center justify-center shadow-md`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

function ChartCard({ title, gradient, testId, children }: { title: string; gradient: string; testId: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg" data-testid={testId}>
      <div className={`h-1 ${gradient}`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function ManagementDashboard() {
  const [period, setPeriod] = useState("monthly");
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const { data, isLoading, isError, refetch } = useQuery<ManagementData>({
    queryKey: ["/api/management/dashboard", period],
    queryFn: async () => {
      const res = await fetch(`/api/management/dashboard?period=${period}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch management dashboard");
      return res.json();
    },
  });

  if (isError) {
    return (
      <div className="p-6 flex flex-col items-center gap-3">
        <p className="text-muted-foreground" data-testid="text-error">Could not load the management dashboard. You may not have access, or something went wrong.</p>
        <button className="text-sm text-primary underline" onClick={() => refetch()} data-testid="button-retry">Try again</button>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-96" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const { portfolio, quality, finance, operations, charts } = data;
  const trends = charts.trends.map(t => ({ ...t, label: formatBucket(t.bucket, period) }));

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-amber-400 dark:to-yellow-500 bg-clip-text text-transparent" data-testid="text-page-title">
            Management Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Institution-wide KPIs across portfolio, quality, finance, and operations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{today}</span>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36" data-testid="select-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Portfolio */}
      <SectionTitle title="Portfolio" icon={Briefcase} gradient="bg-gradient-to-br from-blue-500 to-indigo-600" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Gross Portfolio" value={formatCurrency(portfolio.grossPortfolio)} icon={Wallet} gradient="bg-gradient-to-r from-blue-500 to-cyan-500" iconBg="bg-gradient-to-br from-blue-500 to-cyan-600" testId="kpi-gross-portfolio" />
        <KpiCard label="Outstanding Portfolio" value={formatCurrency(portfolio.outstandingPortfolio)} icon={Briefcase} gradient="bg-gradient-to-r from-indigo-500 to-blue-500" iconBg="bg-gradient-to-br from-indigo-500 to-blue-600" testId="kpi-outstanding-portfolio" />
        <KpiCard label="Active Clients" value={String(portfolio.activeClients)} icon={Users} gradient="bg-gradient-to-r from-emerald-500 to-green-500" iconBg="bg-gradient-to-br from-emerald-500 to-green-600" testId="kpi-active-clients" />
        <KpiCard label="Active Borrowers" value={String(portfolio.activeBorrowers)} sub="With outstanding balance" icon={Users} gradient="bg-gradient-to-r from-teal-500 to-emerald-500" iconBg="bg-gradient-to-br from-teal-500 to-emerald-600" testId="kpi-active-borrowers" />
        <KpiCard label="Women Clients" value={String(portfolio.womenClients)} icon={Users} gradient="bg-gradient-to-r from-pink-500 to-rose-500" iconBg="bg-gradient-to-br from-pink-500 to-rose-600" testId="kpi-women-clients" />
        <KpiCard label="Youth Clients" value={String(portfolio.youthClients)} sub="Age 18-35" icon={Users} gradient="bg-gradient-to-r from-violet-500 to-purple-500" iconBg="bg-gradient-to-br from-violet-500 to-purple-600" testId="kpi-youth-clients" />
        <KpiCard label="Rural Clients" value={String(portfolio.ruralClients)} icon={Sprout} gradient="bg-gradient-to-r from-lime-500 to-green-500" iconBg="bg-gradient-to-br from-lime-500 to-green-600" testId="kpi-rural-clients" />
        <KpiCard label="Urban Clients" value={String(portfolio.urbanClients)} icon={Building2} gradient="bg-gradient-to-r from-sky-500 to-blue-500" iconBg="bg-gradient-to-br from-sky-500 to-blue-600" testId="kpi-urban-clients" />
        <KpiCard label="Agriculture Portfolio" value={formatCurrency(portfolio.agriculturePortfolio)} icon={Sprout} gradient="bg-gradient-to-r from-green-500 to-lime-500" iconBg="bg-gradient-to-br from-green-500 to-lime-600" testId="kpi-agriculture-portfolio" />
        <KpiCard label="MSME Portfolio" value={formatCurrency(portfolio.msmePortfolio)} sub="Loans up to AFN 500,000" icon={Store} gradient="bg-gradient-to-r from-amber-500 to-orange-500" iconBg="bg-gradient-to-br from-amber-500 to-orange-600" testId="kpi-msme-portfolio" />
        <KpiCard label="SME Portfolio" value={formatCurrency(portfolio.smePortfolio)} sub="Loans above AFN 500,000" icon={Factory} gradient="bg-gradient-to-r from-orange-500 to-red-500" iconBg="bg-gradient-to-br from-orange-500 to-red-600" testId="kpi-sme-portfolio" />
      </div>

      {/* Quality */}
      <SectionTitle title="Quality" icon={ShieldAlert} gradient="bg-gradient-to-br from-red-500 to-rose-600" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="PAR 30" value={`${quality.par30.toFixed(2)}%`} sub={formatCurrency(quality.par30Amount)} icon={ShieldAlert} gradient={quality.par30 > 5 ? "bg-gradient-to-r from-red-500 to-rose-500" : "bg-gradient-to-r from-emerald-500 to-green-500"} iconBg={quality.par30 > 5 ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-emerald-500 to-green-600"} testId="kpi-par30" />
        <KpiCard label="PAR 90" value={`${quality.par90.toFixed(2)}%`} sub={formatCurrency(quality.par90Amount)} icon={ShieldAlert} gradient={quality.par90 > 3 ? "bg-gradient-to-r from-red-500 to-rose-500" : "bg-gradient-to-r from-emerald-500 to-green-500"} iconBg={quality.par90 > 3 ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-emerald-500 to-green-600"} testId="kpi-par90" />
        <KpiCard label="Collection Rate" value={`${quality.collectionRate.toFixed(1)}%`} sub="Collected vs due to date" icon={Activity} gradient="bg-gradient-to-r from-blue-500 to-indigo-500" iconBg="bg-gradient-to-br from-blue-500 to-indigo-600" testId="kpi-collection-rate" />
        <KpiCard label="Write-offs" value={formatCurrency(quality.writeOffs)} sub="Defaulted + bad debt expense" icon={ShieldAlert} gradient="bg-gradient-to-r from-slate-500 to-gray-500" iconBg="bg-gradient-to-br from-slate-500 to-gray-600" testId="kpi-writeoffs" />
      </div>

      {/* Finance */}
      <SectionTitle title="Finance" icon={DollarSign} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Income" value={formatCurrency(finance.income)} icon={TrendingUp} gradient="bg-gradient-to-r from-emerald-500 to-green-500" iconBg="bg-gradient-to-br from-emerald-500 to-green-600" testId="kpi-income" />
        <KpiCard label="Expenses" value={formatCurrency(finance.expenses)} icon={DollarSign} gradient="bg-gradient-to-r from-red-500 to-rose-500" iconBg="bg-gradient-to-br from-red-500 to-rose-600" testId="kpi-expenses" />
        <KpiCard label="Profit" value={formatCurrency(finance.profit)} icon={TrendingUp} gradient={finance.profit >= 0 ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-gradient-to-r from-red-500 to-rose-500"} iconBg={finance.profit >= 0 ? "bg-gradient-to-br from-emerald-500 to-green-600" : "bg-gradient-to-br from-red-500 to-rose-600"} testId="kpi-profit" />
        <KpiCard label="OSS" value={`${finance.oss.toFixed(1)}%`} sub="Operating Self Sufficiency" icon={Activity} gradient={finance.oss >= 100 ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-gradient-to-r from-amber-500 to-orange-500"} iconBg={finance.oss >= 100 ? "bg-gradient-to-br from-emerald-500 to-green-600" : "bg-gradient-to-br from-amber-500 to-orange-600"} testId="kpi-oss" />
        <KpiCard label="FSS" value={`${finance.fss.toFixed(1)}%`} sub="Adjusted for cost of capital (5%)" icon={Activity} gradient={finance.fss >= 100 ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-gradient-to-r from-amber-500 to-orange-500"} iconBg={finance.fss >= 100 ? "bg-gradient-to-br from-emerald-500 to-green-600" : "bg-gradient-to-br from-amber-500 to-orange-600"} testId="kpi-fss" />
      </div>

      {/* Operations */}
      <SectionTitle title="Operations" icon={Activity} gradient="bg-gradient-to-br from-violet-500 to-purple-600" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="New Clients (this month)" value={String(operations.newClients)} icon={Users} gradient="bg-gradient-to-r from-blue-500 to-cyan-500" iconBg="bg-gradient-to-br from-blue-500 to-cyan-600" testId="kpi-new-clients" />
        <KpiCard label="Loans Disbursed (this month)" value={String(operations.loansDisbursedCount)} sub={formatCurrency(operations.loansDisbursedAmount)} icon={Wallet} gradient="bg-gradient-to-r from-indigo-500 to-blue-500" iconBg="bg-gradient-to-br from-indigo-500 to-blue-600" testId="kpi-loans-disbursed" />
        <KpiCard label="Average Loan Size" value={formatCurrency(operations.avgLoanSize)} icon={DollarSign} gradient="bg-gradient-to-r from-teal-500 to-emerald-500" iconBg="bg-gradient-to-br from-teal-500 to-emerald-600" testId="kpi-avg-loan-size" />
        <KpiCard label="Officer Productivity" value={operations.officerProductivity.length > 0 ? (operations.officerProductivity.reduce((s, o) => s + o.activeLoans, 0) / operations.officerProductivity.length).toFixed(1) : "0"} sub="Avg active loans per officer" icon={Users} gradient="bg-gradient-to-r from-purple-500 to-violet-500" iconBg="bg-gradient-to-br from-purple-500 to-violet-600" testId="kpi-officer-productivity" />
      </div>

      {/* Trend chart */}
      <ChartCard title={`Trends — Disbursements, Collections & New Clients (${period})`} gradient="bg-gradient-to-r from-blue-500 to-cyan-500" testId="card-trends">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tickFormatter={compactCurrency} tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: any, name: string) => name === "New Clients" ? v : formatCurrency(Number(v))} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="disbursed" name="Disbursed" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="collected" name="Collected" stroke="#10b981" strokeWidth={2.5} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="newClients" name="New Clients" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Branch comparison + PAR aging */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Branch Comparison — Portfolio" gradient="bg-gradient-to-r from-indigo-500 to-blue-500" testId="card-branch-comparison">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={operations.branchRanking}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={compactCurrency} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Bar dataKey="portfolio" name="Outstanding Portfolio" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="PAR Aging (DAB Buckets)" gradient="bg-gradient-to-r from-red-500 to-rose-500" testId="card-par-aging">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts.parAging}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={compactCurrency} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: any, name: string) => name === "Amount" ? formatCurrency(Number(v)) : v} />
              <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]}>
                {charts.parAging.map((b, i) => (
                  <Cell key={i} fill={b.label === "Current" ? "#10b981" : ["#84cc16", "#f59e0b", "#f97316", "#ef4444", "#991b1b"][Math.min(i - 1, 4)] || "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Sector + Gender disbursements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Sector-based Disbursements" gradient="bg-gradient-to-r from-amber-500 to-orange-500" testId="card-sector-disbursements">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={charts.sectorDisbursements} dataKey="amount" nameKey="sector" cx="50%" cy="50%" outerRadius={90} label={(e: any) => e.sector}>
                {charts.sectorDisbursements.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Gender-based Disbursements" gradient="bg-gradient-to-r from-pink-500 to-rose-500" testId="card-gender-disbursements">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={charts.genderDisbursements} dataKey="amount" nameKey="gender" cx="50%" cy="50%" outerRadius={90} label={(e: any) => e.gender}>
                {charts.genderDisbursements.map((g, i) => (
                  <Cell key={i} fill={GENDER_COLORS[g.gender] || PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden border-0 shadow-lg" data-testid="card-branch-ranking">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-base font-semibold">Branch Ranking</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead className="text-right">Clients</TableHead>
                  <TableHead className="text-right">Portfolio</TableHead>
                  <TableHead className="text-right">Coll. Rate</TableHead>
                  <TableHead className="text-right">PAR 30</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.branchRanking.map((b, i) => (
                  <TableRow key={b.id} data-testid={`row-branch-${b.id}`}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell className="text-right">{b.clients}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(b.portfolio)}</TableCell>
                    <TableCell className="text-right">{b.collectionRate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={b.par30 > 5 ? "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30" : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"}>
                        {b.par30.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-lg" data-testid="card-province-ranking">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-base font-semibold">Province Ranking</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Province</TableHead>
                  <TableHead className="text-right">Clients</TableHead>
                  <TableHead className="text-right">Loans</TableHead>
                  <TableHead className="text-right">Portfolio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.provinceRanking.map((p, i) => (
                  <TableRow key={p.province} data-testid={`row-province-${i}`}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{p.province}</TableCell>
                    <TableCell className="text-right">{p.clients}</TableCell>
                    <TableCell className="text-right">{p.loans}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(p.portfolio)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Officer productivity */}
      <Card className="overflow-hidden border-0 shadow-lg" data-testid="card-officer-productivity">
        <div className="h-1 bg-gradient-to-r from-purple-500 to-violet-500" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md">
              <Users className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-base font-semibold">Loan Officer Productivity</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Officer</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead className="text-right">Active Loans</TableHead>
                <TableHead className="text-right">Clients</TableHead>
                <TableHead className="text-right">Portfolio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.officerProductivity.map((o, i) => (
                <TableRow key={o.id} data-testid={`row-officer-${o.id}`}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell>{o.branchName || "-"}</TableCell>
                  <TableCell className="text-right">{o.activeLoans}</TableCell>
                  <TableCell className="text-right">{o.clients}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(o.portfolio)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
