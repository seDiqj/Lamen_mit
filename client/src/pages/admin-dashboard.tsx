import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Target, Building2, Briefcase, Loader2, TrendingUp, Banknote, BarChart3, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AF", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const CHART_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

type AdminDashboardData = {
  hrStaff: {
    totalStaff: number;
    totalFemaleStaff: number;
    totalCreditOfficers: number;
    femaleCreditOfficers: number;
    caseload: number;
    productivity: number;
  };
  disbursement: {
    target: number;
    disbursedNo: number;
    actual: number;
  };
  branchWise: Array<{
    branch: string;
    no: number;
    olb: number;
    femaleNo: number;
    femaleValue: number;
    femalePercent: number;
    par1_30No: number;
    par1_30Percent: number;
    par30No: number;
    par30Percent: number;
  }>;
  sectorWise: Array<{
    sector: string;
    olb: number;
    percentage: number;
  }>;
  loansClosing: Record<string, number>;
  totalOLB: number;
};

interface TargetProgress {
  target_id: number;
  branch_id: string;
  branch_name: string;
  month_year: string;
  target_amount: number;
  target_customers: number;
  actual_amount: number;
  actual_customers: number;
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<AdminDashboardData>({
    queryKey: ["/api/admin/dashboard-stats"],
  });

  const { data: progressData, isLoading: progressLoading } = useQuery<TargetProgress[]>({
    queryKey: ["/api/disbursement-targets/progress"],
    queryFn: async () => {
      const res = await fetch("/api/disbursement-targets/progress", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch progress");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hrStaff = data?.hrStaff || { totalStaff: 0, totalFemaleStaff: 0, totalCreditOfficers: 0, femaleCreditOfficers: 0, caseload: 0, productivity: 0 };
  const branchWise = data?.branchWise || [];
  const sectorWise = data?.sectorWise || [];
  const loansClosing = data?.loansClosing || {};
  const totalOLB = data?.totalOLB || 0;

  const femaleStaffPercent = hrStaff.totalStaff > 0 ? ((hrStaff.totalFemaleStaff / hrStaff.totalStaff) * 100).toFixed(1) : "0.0";
  const creditOfficersPercent = hrStaff.totalStaff > 0 ? ((hrStaff.totalCreditOfficers / hrStaff.totalStaff) * 100).toFixed(1) : "0.0";
  const femaleCOPercent = hrStaff.totalCreditOfficers > 0 ? ((hrStaff.femaleCreditOfficers / hrStaff.totalCreditOfficers) * 100).toFixed(1) : "0.0";

  const branchTotals = branchWise.reduce((acc, b) => ({
    no: acc.no + b.no,
    olb: acc.olb + b.olb,
    femaleNo: acc.femaleNo + b.femaleNo,
    femaleValue: acc.femaleValue + b.femaleValue,
  }), { no: 0, olb: 0, femaleNo: 0, femaleValue: 0 });

  const loansClosingEntries = Object.entries(loansClosing).slice(0, 3);

  const branchBarData = progressData
    ? Array.from(new Set(progressData.map(p => p.branch_name))).sort().map(br => {
        const items = progressData.filter(p => p.branch_name === br);
        return {
          branch: br,
          target: items.reduce((s, p) => s + Number(p.target_amount), 0),
          actual: items.reduce((s, p) => s + Number(p.actual_amount), 0),
        };
      })
    : [];

  const branchCustBarData = progressData
    ? Array.from(new Set(progressData.map(p => p.branch_name))).sort().map(br => {
        const items = progressData.filter(p => p.branch_name === br);
        return {
          branch: br,
          target: items.reduce((s, p) => s + Number(p.target_customers), 0),
          actual: items.reduce((s, p) => s + Number(p.actual_customers), 0),
        };
      })
    : [];

  const monthBarData = progressData
    ? Array.from(new Set(progressData.map(p => p.month_year))).sort().map(m => {
        const items = progressData.filter(p => p.month_year === m);
        const label = new Date(m + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        return {
          month: label,
          target: items.reduce((s, p) => s + Number(p.target_amount), 0),
          actual: items.reduce((s, p) => s + Number(p.actual_amount), 0),
        };
      })
    : [];

  const achievementPieData = progressData && progressData.length > 0
    ? (() => {
        const totalTarget = progressData.reduce((s, p) => s + Number(p.target_amount), 0);
        const totalActual = progressData.reduce((s, p) => s + Number(p.actual_amount), 0);
        const pct = totalTarget > 0 ? Math.min(Math.round((totalActual / totalTarget) * 100), 100) : 0;
        return [
          { name: "Achieved", value: pct },
          { name: "Remaining", value: 100 - pct },
        ];
      })()
    : [];

  const branchRadialData = progressData
    ? Array.from(new Set(progressData.map(p => p.branch_name))).sort().map((br, i) => {
        const items = progressData.filter(p => p.branch_name === br);
        const target = items.reduce((s, p) => s + Number(p.target_amount), 0);
        const actual = items.reduce((s, p) => s + Number(p.actual_amount), 0);
        const pct = target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
        return { name: br, value: pct, fill: CHART_COLORS[i % CHART_COLORS.length] };
      })
    : [];

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-md p-3 shadow-md text-sm">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: AFN {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Executive summary and key performance indicators</p>
        </div>
      </div>

      <Tabs defaultValue="overview" data-testid="admin-dashboard-tabs">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="target-progress" data-testid="tab-target-progress">Disbursement Target Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  HR Staff Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>HR Staff</TableHead>
                      <TableHead className="text-right">No</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Total Staff</TableCell>
                      <TableCell className="text-right">{hrStaff.totalStaff}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Female Staff</TableCell>
                      <TableCell className="text-right">{hrStaff.totalFemaleStaff}</TableCell>
                      <TableCell className="text-right">{femaleStaffPercent}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Financing Officers</TableCell>
                      <TableCell className="text-right">{hrStaff.totalCreditOfficers}</TableCell>
                      <TableCell className="text-right">{creditOfficersPercent}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Female Financing Officers</TableCell>
                      <TableCell className="text-right">{hrStaff.femaleCreditOfficers}</TableCell>
                      <TableCell className="text-right">{femaleCOPercent}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-xs text-muted-foreground">Caseload</p>
                    <p className="text-xl font-bold text-blue-600">{hrStaff.caseload}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="text-xs text-muted-foreground">Productivity</p>
                    <p className="text-xl font-bold text-green-600">{hrStaff.productivity}</p>
                  </div>
                </div>
                {loansClosingEntries.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Loans Closing Date</p>
                    <div className="grid grid-cols-3 gap-2">
                      {loansClosingEntries.map(([period, count]) => (
                        <div key={period} className="p-2 rounded-lg bg-muted text-center">
                          <p className="text-xs text-muted-foreground">{period}</p>
                          <p className="font-semibold">{count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-500" />
                Sector-Wise New OLB
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sectors</TableHead>
                    <TableHead className="text-right">OLB</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectorWise.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">No sector data available</TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {sectorWise.map((sector) => (
                        <TableRow key={sector.sector}>
                          <TableCell className="font-medium">{sector.sector}</TableCell>
                          <TableCell className="text-right">{formatCurrency(sector.olb)}</TableCell>
                          <TableCell className="text-right">{sector.percentage}%</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalOLB)}</TableCell>
                        <TableCell className="text-right">100.0%</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-500" />
                Branch-Wise New OLB
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">No</TableHead>
                    <TableHead className="text-right">OLB</TableHead>
                    <TableHead className="text-right border-l">Female No</TableHead>
                    <TableHead className="text-right">Female Value</TableHead>
                    <TableHead className="text-right">Value %</TableHead>
                    <TableHead className="text-right border-l">PAR 1-30 No</TableHead>
                    <TableHead className="text-right">No %</TableHead>
                    <TableHead className="text-right border-l">PAR 30+ No</TableHead>
                    <TableHead className="text-right">No %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branchWise.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground">No branch data available</TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {branchWise.map((branch) => (
                        <TableRow key={branch.branch}>
                          <TableCell className="font-medium">{branch.branch}</TableCell>
                          <TableCell className="text-right">{formatCurrency(branch.no)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(branch.olb)}</TableCell>
                          <TableCell className="text-right border-l">{formatCurrency(branch.femaleNo)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(branch.femaleValue)}</TableCell>
                          <TableCell className="text-right">{branch.femalePercent}%</TableCell>
                          <TableCell className="text-right border-l">{branch.par1_30No}</TableCell>
                          <TableCell className="text-right">{branch.par1_30Percent}%</TableCell>
                          <TableCell className="text-right border-l">{branch.par30No}</TableCell>
                          <TableCell className="text-right">{branch.par30Percent}%</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">{formatCurrency(branchTotals.no)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(branchTotals.olb)}</TableCell>
                        <TableCell className="text-right border-l">{formatCurrency(branchTotals.femaleNo)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(branchTotals.femaleValue)}</TableCell>
                        <TableCell className="text-right">{branchTotals.no > 0 ? ((branchTotals.femaleNo / branchTotals.no) * 100).toFixed(1) : 0}%</TableCell>
                        <TableCell className="text-right border-l">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right border-l">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="target-progress" className="space-y-6 mt-4">
          {progressLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : !progressData || progressData.length === 0 ? (
            <div className="text-center py-16">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2" data-testid="text-no-progress">No Disbursement Target Data</h3>
              <p className="text-muted-foreground">Set targets in the Disbursement Targets page to start tracking progress.</p>
            </div>
          ) : (
            <>
              {/* Current Year Summary */}
              {(() => {
                const currentYear = new Date().getFullYear().toString();
                const yearData = progressData.filter(p => p.month_year.startsWith(currentYear));
                const yearTarget = yearData.reduce((s, p) => s + Number(p.target_amount), 0);
                const yearActual = yearData.reduce((s, p) => s + Number(p.actual_amount), 0);
                const yearTargetCust = yearData.reduce((s, p) => s + Number(p.target_customers), 0);
                const yearActualCust = yearData.reduce((s, p) => s + Number(p.actual_customers), 0);
                const yearPct = yearTarget > 0 ? Math.round((yearActual / yearTarget) * 100) : 0;
                const yearCustPct = yearTargetCust > 0 ? Math.round((yearActualCust / yearTargetCust) * 100) : 0;
                const yearGap = yearTarget - yearActual;

                const monthlyBreakdown = Array.from(new Set(yearData.map(p => p.month_year))).sort().map(m => {
                  const items = yearData.filter(p => p.month_year === m);
                  const target = items.reduce((s, p) => s + Number(p.target_amount), 0);
                  const actual = items.reduce((s, p) => s + Number(p.actual_amount), 0);
                  const pct = target > 0 ? Math.round((actual / target) * 100) : 0;
                  const label = new Date(m + "-01").toLocaleDateString("en-US", { month: "short" });
                  return { month: label, monthFull: m, target, actual, pct };
                });

                return (
                  <Card className="border-primary/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          Current Year Progress ({currentYear})
                        </CardTitle>
                        <Badge variant={yearPct >= 100 ? "default" : yearPct >= 75 ? "secondary" : "outline"} data-testid="badge-year-pct">
                          {yearPct}% achieved
                        </Badge>
                      </div>
                      <CardDescription>Year-to-date disbursement performance summary</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 space-y-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Target className="h-3 w-3" /> Year Target
                          </p>
                          <p className="text-xl font-bold text-green-700 dark:text-green-400" data-testid="text-year-target">
                            AFN {formatCurrency(yearTarget)}
                          </p>
                          <p className="text-xs text-muted-foreground">{yearTargetCust} customers</p>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 space-y-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Banknote className="h-3 w-3" /> Year Actual
                          </p>
                          <p className="text-xl font-bold text-blue-700 dark:text-blue-400" data-testid="text-year-actual">
                            AFN {formatCurrency(yearActual)}
                          </p>
                          <p className="text-xs text-muted-foreground">{yearActualCust} customers ({yearCustPct}%)</p>
                        </div>
                        <div className={`p-4 rounded-lg space-y-1 ${yearGap > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"}`}>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            {yearGap > 0 ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                            {yearGap > 0 ? "Gap Remaining" : "Exceeded By"}
                          </p>
                          <p className={`text-xl font-bold ${yearGap > 0 ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`} data-testid="text-year-gap">
                            AFN {formatCurrency(Math.abs(yearGap))}
                          </p>
                          <p className="text-xs text-muted-foreground">{yearPct}% of annual target</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Annual Progress</span>
                          <span className="font-semibold">{yearPct}%</span>
                        </div>
                        <div className="h-5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${yearPct >= 100 ? "bg-gradient-to-r from-emerald-500 to-green-400" : yearPct >= 75 ? "bg-gradient-to-r from-green-500 to-emerald-400" : yearPct >= 50 ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-gradient-to-r from-red-500 to-orange-400"}`}
                            style={{ width: `${Math.min(yearPct, 100)}%` }}
                          />
                        </div>
                      </div>

                      {monthlyBreakdown.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-3">Monthly Breakdown</p>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={monthlyBreakdown} barGap={2}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                              <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                              <Tooltip content={customTooltip} />
                              <Legend wrapperStyle={{ fontSize: 12 }} />
                              <Bar dataKey="target" name="Target" fill="#6366f1" radius={[3, 3, 0, 0]} />
                              <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[3, 3, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })()}

              {/* All-Time Summary KPI Cards */}
              {(() => {
                const totalTarget = progressData.reduce((s, p) => s + Number(p.target_amount), 0);
                const totalActual = progressData.reduce((s, p) => s + Number(p.actual_amount), 0);
                const totalTargetCust = progressData.reduce((s, p) => s + Number(p.target_customers), 0);
                const totalActualCust = progressData.reduce((s, p) => s + Number(p.actual_customers), 0);
                const overallPct = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0;
                const custPct = totalTargetCust > 0 ? Math.round((totalActualCust / totalTargetCust) * 100) : 0;
                const gap = totalTarget - totalActual;

                return (
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <Target className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Target (All Time)</p>
                            <p className="text-lg font-bold" data-testid="text-total-target">AFN {formatCurrency(totalTarget)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Banknote className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Actual Disbursed (All Time)</p>
                            <p className="text-lg font-bold" data-testid="text-total-actual">AFN {formatCurrency(totalActual)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                            <TrendingUp className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Achievement</p>
                            <p className="text-lg font-bold" data-testid="text-achievement-pct">{overallPct}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                            <BarChart3 className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Gap to Target</p>
                            <p className="text-lg font-bold" data-testid="text-gap">AFN {formatCurrency(Math.max(0, gap))}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}

              {/* Charts Row */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Target vs Actual by Branch (Amount)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={branchBarData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="branch" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                        <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                        <Tooltip content={customTooltip} />
                        <Legend />
                        <Bar dataKey="target" name="Target" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Target vs Actual by Branch (Customers)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={branchCustBarData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="branch" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                        <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="target" name="Target Customers" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" name="Actual Customers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Overall Achievement</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={achievementPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                          strokeWidth={2}
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#e2e8f0" />
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <text x="50%" y="47%" textAnchor="middle" className="fill-foreground text-2xl font-bold">
                          {achievementPieData[0]?.value || 0}%
                        </text>
                        <text x="50%" y="58%" textAnchor="middle" className="fill-muted-foreground text-xs">
                          Achieved
                        </text>
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Branch Achievement Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={branchRadialData} startAngle={180} endAngle={0}>
                        <RadialBar background dataKey="value" cornerRadius={4} />
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Legend iconSize={10} layout="vertical" verticalAlign="bottom" />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {monthBarData.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monthly Target vs Actual Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthBarData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                        <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                        <Tooltip content={customTooltip} />
                        <Legend />
                        <Bar dataKey="target" name="Target" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Tables */}
              <Tabs defaultValue="by-month">
                <TabsList className="mb-4">
                  <TabsTrigger value="by-month" data-testid="tab-detail-by-month">By Month</TabsTrigger>
                  <TabsTrigger value="by-branch" data-testid="tab-detail-by-branch">By Branch</TabsTrigger>
                </TabsList>

                <TabsContent value="by-month">
                  <div className="space-y-6">
                    {(() => {
                      const months = Array.from(new Set(progressData.map(p => p.month_year))).sort().reverse();
                      return months.map(month => {
                        const monthItems = progressData.filter(p => p.month_year === month);
                        const totalTarget = monthItems.reduce((s, p) => s + Number(p.target_amount), 0);
                        const totalActual = monthItems.reduce((s, p) => s + Number(p.actual_amount), 0);
                        const totalTargetCust = monthItems.reduce((s, p) => s + Number(p.target_customers), 0);
                        const totalActualCust = monthItems.reduce((s, p) => s + Number(p.actual_customers), 0);
                        const amtPct = totalTarget > 0 ? Math.min(Math.round((totalActual / totalTarget) * 100), 100) : 0;
                        const custPct = totalTargetCust > 0 ? Math.min(Math.round((totalActualCust / totalTargetCust) * 100), 100) : 0;
                        const monthLabel = new Date(month + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" });

                        return (
                          <Card key={month} data-testid={`progress-month-${month}`}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <CardTitle className="text-base" data-testid={`text-month-label-${month}`}>{monthLabel}</CardTitle>
                                <Badge variant={amtPct >= 100 ? "default" : amtPct >= 50 ? "secondary" : "outline"} data-testid={`badge-month-pct-${month}`}>
                                  {amtPct}% achieved
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2 text-sm">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                      <Banknote className="h-4 w-4" /> Disbursement Amount
                                    </span>
                                    <span className="font-medium" data-testid={`text-month-amt-${month}`}>
                                      AFN {formatCurrency(totalActual)} / AFN {formatCurrency(totalTarget)}
                                    </span>
                                  </div>
                                  <Progress value={amtPct} className="h-3" />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2 text-sm">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                      <Users className="h-4 w-4" /> No. of Customers
                                    </span>
                                    <span className="font-medium" data-testid={`text-month-cust-${month}`}>
                                      {totalActualCust} / {totalTargetCust}
                                    </span>
                                  </div>
                                  <Progress value={custPct} className="h-3" />
                                </div>
                              </div>

                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Branch</TableHead>
                                    <TableHead className="text-right">Target Amount</TableHead>
                                    <TableHead className="text-right">Actual Disbursed</TableHead>
                                    <TableHead className="text-right">Amount %</TableHead>
                                    <TableHead className="text-right">Target Customers</TableHead>
                                    <TableHead className="text-right">Actual Customers</TableHead>
                                    <TableHead className="text-right">Customer %</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {monthItems.map(item => {
                                    const itemAmtPct = Number(item.target_amount) > 0 ? Math.round((Number(item.actual_amount) / Number(item.target_amount)) * 100) : 0;
                                    const itemCustPct = Number(item.target_customers) > 0 ? Math.round((Number(item.actual_customers) / Number(item.target_customers)) * 100) : 0;
                                    return (
                                      <TableRow key={item.target_id} data-testid={`row-progress-${item.target_id}`}>
                                        <TableCell className="font-medium">{item.branch_name}</TableCell>
                                        <TableCell className="text-right">AFN {formatCurrency(Number(item.target_amount))}</TableCell>
                                        <TableCell className="text-right">AFN {formatCurrency(Number(item.actual_amount))}</TableCell>
                                        <TableCell className="text-right">
                                          <Badge variant={itemAmtPct >= 100 ? "default" : itemAmtPct >= 50 ? "secondary" : "outline"}>
                                            {itemAmtPct}%
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{Number(item.target_customers)}</TableCell>
                                        <TableCell className="text-right">{Number(item.actual_customers)}</TableCell>
                                        <TableCell className="text-right">
                                          <Badge variant={itemCustPct >= 100 ? "default" : itemCustPct >= 50 ? "secondary" : "outline"}>
                                            {itemCustPct}%
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        );
                      });
                    })()}
                  </div>
                </TabsContent>

                <TabsContent value="by-branch">
                  <div className="space-y-6">
                    {(() => {
                      const branchNames = Array.from(new Set(progressData.map(p => p.branch_name))).sort();
                      return branchNames.map(brName => {
                        const brItems = progressData.filter(p => p.branch_name === brName);
                        const totalTarget = brItems.reduce((s, p) => s + Number(p.target_amount), 0);
                        const totalActual = brItems.reduce((s, p) => s + Number(p.actual_amount), 0);
                        const totalTargetCust = brItems.reduce((s, p) => s + Number(p.target_customers), 0);
                        const totalActualCust = brItems.reduce((s, p) => s + Number(p.actual_customers), 0);
                        const amtPct = totalTarget > 0 ? Math.min(Math.round((totalActual / totalTarget) * 100), 100) : 0;
                        const custPct = totalTargetCust > 0 ? Math.min(Math.round((totalActualCust / totalTargetCust) * 100), 100) : 0;

                        return (
                          <Card key={brName} data-testid={`progress-branch-${brName}`}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <CardTitle className="text-base" data-testid={`text-branch-label-${brName}`}>{brName}</CardTitle>
                                <Badge variant={amtPct >= 100 ? "default" : amtPct >= 50 ? "secondary" : "outline"} data-testid={`badge-branch-pct-${brName}`}>
                                  {amtPct}% overall
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2 text-sm">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                      <Banknote className="h-4 w-4" /> Total Disbursement
                                    </span>
                                    <span className="font-medium">
                                      AFN {formatCurrency(totalActual)} / AFN {formatCurrency(totalTarget)}
                                    </span>
                                  </div>
                                  <Progress value={amtPct} className="h-3" />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2 text-sm">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                      <Users className="h-4 w-4" /> Total Customers
                                    </span>
                                    <span className="font-medium">
                                      {totalActualCust} / {totalTargetCust}
                                    </span>
                                  </div>
                                  <Progress value={custPct} className="h-3" />
                                </div>
                              </div>

                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Month</TableHead>
                                    <TableHead className="text-right">Target Amount</TableHead>
                                    <TableHead className="text-right">Actual Disbursed</TableHead>
                                    <TableHead className="text-right">Amount %</TableHead>
                                    <TableHead className="text-right">Target Customers</TableHead>
                                    <TableHead className="text-right">Actual Customers</TableHead>
                                    <TableHead className="text-right">Customer %</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {brItems.sort((a, b) => b.month_year.localeCompare(a.month_year)).map(item => {
                                    const itemAmtPct = Number(item.target_amount) > 0 ? Math.round((Number(item.actual_amount) / Number(item.target_amount)) * 100) : 0;
                                    const itemCustPct = Number(item.target_customers) > 0 ? Math.round((Number(item.actual_customers) / Number(item.target_customers)) * 100) : 0;
                                    const mLabel = new Date(item.month_year + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" });
                                    return (
                                      <TableRow key={item.target_id} data-testid={`row-branch-progress-${item.target_id}`}>
                                        <TableCell className="font-medium">{mLabel}</TableCell>
                                        <TableCell className="text-right">AFN {formatCurrency(Number(item.target_amount))}</TableCell>
                                        <TableCell className="text-right">AFN {formatCurrency(Number(item.actual_amount))}</TableCell>
                                        <TableCell className="text-right">
                                          <Badge variant={itemAmtPct >= 100 ? "default" : itemAmtPct >= 50 ? "secondary" : "outline"}>
                                            {itemAmtPct}%
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{Number(item.target_customers)}</TableCell>
                                        <TableCell className="text-right">{Number(item.actual_customers)}</TableCell>
                                        <TableCell className="text-right">
                                          <Badge variant={itemCustPct >= 100 ? "default" : itemCustPct >= 50 ? "secondary" : "outline"}>
                                            {itemCustPct}%
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        );
                      });
                    })()}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
