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

function KpiCard({ label, value, sub, icon: Icon, color, testId }: { label: string; value: string; sub?: string; icon: any; color: string; testId: string }) {
  return (
    <Card className="border shadow-sm" data-testid={testId}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="text-lg font-bold truncate">{value}</p>
            {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
          </div>
          <div className={`rounded-lg p-2 ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ title, icon: Icon }: { title: string; icon: any }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Icon className="h-5 w-5 text-primary" />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}

export default function ManagementDashboard() {
  const [period, setPeriod] = useState("monthly");

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
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const { portfolio, quality, finance, operations, charts } = data;
  const trends = charts.trends.map(t => ({ ...t, label: formatBucket(t.bucket, period) }));

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Management Dashboard</h1>
          <p className="text-muted-foreground text-sm">Institution-wide KPIs across portfolio, quality, finance, and operations</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Trend period:</span>
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
      <SectionTitle title="Portfolio" icon={Briefcase} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Gross Portfolio" value={formatCurrency(portfolio.grossPortfolio)} icon={Wallet} color="bg-blue-100 text-blue-700 dark:bg-blue-950/40" testId="kpi-gross-portfolio" />
        <KpiCard label="Outstanding Portfolio" value={formatCurrency(portfolio.outstandingPortfolio)} icon={Briefcase} color="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40" testId="kpi-outstanding-portfolio" />
        <KpiCard label="Active Clients" value={String(portfolio.activeClients)} icon={Users} color="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40" testId="kpi-active-clients" />
        <KpiCard label="Active Borrowers" value={String(portfolio.activeBorrowers)} sub="With outstanding balance" icon={Users} color="bg-teal-100 text-teal-700 dark:bg-teal-950/40" testId="kpi-active-borrowers" />
        <KpiCard label="Women Clients" value={String(portfolio.womenClients)} icon={Users} color="bg-pink-100 text-pink-700 dark:bg-pink-950/40" testId="kpi-women-clients" />
        <KpiCard label="Youth Clients" value={String(portfolio.youthClients)} sub="Age 18-35" icon={Users} color="bg-violet-100 text-violet-700 dark:bg-violet-950/40" testId="kpi-youth-clients" />
        <KpiCard label="Rural Clients" value={String(portfolio.ruralClients)} icon={Sprout} color="bg-lime-100 text-lime-700 dark:bg-lime-950/40" testId="kpi-rural-clients" />
        <KpiCard label="Urban Clients" value={String(portfolio.urbanClients)} icon={Building2} color="bg-sky-100 text-sky-700 dark:bg-sky-950/40" testId="kpi-urban-clients" />
        <KpiCard label="Agriculture Portfolio" value={formatCurrency(portfolio.agriculturePortfolio)} icon={Sprout} color="bg-green-100 text-green-700 dark:bg-green-950/40" testId="kpi-agriculture-portfolio" />
        <KpiCard label="MSME Portfolio" value={formatCurrency(portfolio.msmePortfolio)} sub="Loans up to AFN 500,000" icon={Store} color="bg-amber-100 text-amber-700 dark:bg-amber-950/40" testId="kpi-msme-portfolio" />
        <KpiCard label="SME Portfolio" value={formatCurrency(portfolio.smePortfolio)} sub="Loans above AFN 500,000" icon={Factory} color="bg-orange-100 text-orange-700 dark:bg-orange-950/40" testId="kpi-sme-portfolio" />
      </div>

      {/* Quality */}
      <SectionTitle title="Quality" icon={ShieldAlert} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="PAR 30" value={`${quality.par30.toFixed(2)}%`} sub={formatCurrency(quality.par30Amount)} icon={ShieldAlert} color={quality.par30 > 5 ? "bg-red-100 text-red-700 dark:bg-red-950/40" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40"} testId="kpi-par30" />
        <KpiCard label="PAR 90" value={`${quality.par90.toFixed(2)}%`} sub={formatCurrency(quality.par90Amount)} icon={ShieldAlert} color={quality.par90 > 3 ? "bg-red-100 text-red-700 dark:bg-red-950/40" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40"} testId="kpi-par90" />
        <KpiCard label="Collection Rate" value={`${quality.collectionRate.toFixed(1)}%`} sub="Collected vs due to date" icon={Activity} color="bg-blue-100 text-blue-700 dark:bg-blue-950/40" testId="kpi-collection-rate" />
        <KpiCard label="Write-offs" value={formatCurrency(quality.writeOffs)} sub="Defaulted + bad debt expense" icon={ShieldAlert} color="bg-slate-100 text-slate-700 dark:bg-slate-800/60" testId="kpi-writeoffs" />
      </div>

      {/* Finance */}
      <SectionTitle title="Finance" icon={DollarSign} />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Income" value={formatCurrency(finance.income)} icon={TrendingUp} color="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40" testId="kpi-income" />
        <KpiCard label="Expenses" value={formatCurrency(finance.expenses)} icon={DollarSign} color="bg-red-100 text-red-700 dark:bg-red-950/40" testId="kpi-expenses" />
        <KpiCard label="Profit" value={formatCurrency(finance.profit)} icon={TrendingUp} color={finance.profit >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40" : "bg-red-100 text-red-700 dark:bg-red-950/40"} testId="kpi-profit" />
        <KpiCard label="OSS" value={`${finance.oss.toFixed(1)}%`} sub="Operating Self Sufficiency" icon={Activity} color={finance.oss >= 100 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40" : "bg-amber-100 text-amber-700 dark:bg-amber-950/40"} testId="kpi-oss" />
        <KpiCard label="FSS" value={`${finance.fss.toFixed(1)}%`} sub="Adjusted for cost of capital (5%)" icon={Activity} color={finance.fss >= 100 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40" : "bg-amber-100 text-amber-700 dark:bg-amber-950/40"} testId="kpi-fss" />
      </div>

      {/* Operations */}
      <SectionTitle title="Operations" icon={Activity} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="New Clients (this month)" value={String(operations.newClients)} icon={Users} color="bg-blue-100 text-blue-700 dark:bg-blue-950/40" testId="kpi-new-clients" />
        <KpiCard label="Loans Disbursed (this month)" value={String(operations.loansDisbursedCount)} sub={formatCurrency(operations.loansDisbursedAmount)} icon={Wallet} color="bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40" testId="kpi-loans-disbursed" />
        <KpiCard label="Average Loan Size" value={formatCurrency(operations.avgLoanSize)} icon={DollarSign} color="bg-teal-100 text-teal-700 dark:bg-teal-950/40" testId="kpi-avg-loan-size" />
        <KpiCard label="Officer Productivity" value={operations.officerProductivity.length > 0 ? (operations.officerProductivity.reduce((s, o) => s + o.activeLoans, 0) / operations.officerProductivity.length).toFixed(1) : "0"} sub="Avg active loans per officer" icon={Users} color="bg-purple-100 text-purple-700 dark:bg-purple-950/40" testId="kpi-officer-productivity" />
      </div>

      {/* Trend chart */}
      <Card className="border shadow-sm" data-testid="card-trends">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Trends — Disbursements, Collections & New Clients ({period})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tickFormatter={compactCurrency} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: any, name: string) => name === "New Clients" ? v : formatCurrency(Number(v))} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="disbursed" name="Disbursed" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="collected" name="Collected" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="newClients" name="New Clients" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Branch comparison + PAR aging */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border shadow-sm" data-testid="card-branch-comparison">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Branch Comparison — Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={operations.branchRanking}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={compactCurrency} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                <Bar dataKey="portfolio" name="Outstanding Portfolio" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border shadow-sm" data-testid="card-par-aging">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">PAR Aging (DAB Buckets)</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Sector + Gender disbursements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border shadow-sm" data-testid="card-sector-disbursements">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Sector-based Disbursements</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card className="border shadow-sm" data-testid="card-gender-disbursements">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Gender-based Disbursements</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border shadow-sm" data-testid="card-branch-ranking">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-500" />
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
                      <Badge variant="outline" className={b.par30 > 5 ? "text-red-700 border-red-300" : "text-emerald-700 border-emerald-300"}>
                        {b.par30.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border shadow-sm" data-testid="card-province-ranking">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-500" />
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
      <Card className="border shadow-sm" data-testid="card-officer-productivity">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
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
