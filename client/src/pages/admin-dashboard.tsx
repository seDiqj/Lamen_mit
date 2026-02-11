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
import { Users, Target, Building2, Briefcase, Loader2, TrendingUp, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AF", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

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
  const disbursement = data?.disbursement || { target: 0, disbursedNo: 0, actual: 0 };
  const branchWise = data?.branchWise || [];
  const sectorWise = data?.sectorWise || [];
  const loansClosing = data?.loansClosing || {};
  const totalOLB = data?.totalOLB || 0;

  const femaleStaffPercent = hrStaff.totalStaff > 0 ? ((hrStaff.totalFemaleStaff / hrStaff.totalStaff) * 100).toFixed(1) : "0.0";
  const creditOfficersPercent = hrStaff.totalStaff > 0 ? ((hrStaff.totalCreditOfficers / hrStaff.totalStaff) * 100).toFixed(1) : "0.0";
  const femaleCOPercent = hrStaff.totalCreditOfficers > 0 ? ((hrStaff.femaleCreditOfficers / hrStaff.totalCreditOfficers) * 100).toFixed(1) : "0.0";
  const disbursementPercent = disbursement.target > 0 ? ((disbursement.actual / disbursement.target) * 100).toFixed(1) : "0.0";

  const branchTotals = branchWise.reduce((acc, b) => ({
    no: acc.no + b.no,
    olb: acc.olb + b.olb,
    femaleNo: acc.femaleNo + b.femaleNo,
    femaleValue: acc.femaleValue + b.femaleValue,
  }), { no: 0, olb: 0, femaleNo: 0, femaleValue: 0 });

  const loansClosingEntries = Object.entries(loansClosing).slice(0, 3);

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

      <div className="grid gap-4 md:grid-cols-2">
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Total Disbursement (Current Period)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Target</TableHead>
                  <TableHead className="text-right">Disbursed No</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{formatCurrency(disbursement.target)}</TableCell>
                  <TableCell className="text-right">{disbursement.disbursedNo}</TableCell>
                  <TableCell className="text-right">{formatCurrency(disbursement.actual)}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">{disbursementPercent}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress toward target</span>
                <span className="font-medium">{disbursementPercent}%</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.min(parseFloat(disbursementPercent), 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>{formatCurrency(disbursement.target)}</span>
              </div>
            </div>
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-500" />
            Disbursement Target Progress
          </CardTitle>
          <CardDescription>
            Actual disbursements vs targets by month and branch (based on disbursement date)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progressLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : !progressData || progressData.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground" data-testid="text-no-progress">No target progress data. Set targets in Disbursement Targets page.</p>
            </div>
          ) : (
            <Tabs defaultValue="by-month">
              <TabsList className="mb-4">
                <TabsTrigger value="by-month" data-testid="tab-by-month">By Month</TabsTrigger>
                <TabsTrigger value="by-branch" data-testid="tab-by-branch">By Branch</TabsTrigger>
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
                        <div key={month} className="border rounded-md p-4 space-y-4" data-testid={`progress-month-${month}`}>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="font-semibold text-lg" data-testid={`text-month-label-${month}`}>{monthLabel}</h3>
                            <Badge variant={amtPct >= 100 ? "default" : amtPct >= 50 ? "secondary" : "outline"} data-testid={`badge-month-pct-${month}`}>
                              {amtPct}% achieved
                            </Badge>
                          </div>

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
                        </div>
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
                        <div key={brName} className="border rounded-md p-4 space-y-4" data-testid={`progress-branch-${brName}`}>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="font-semibold text-lg" data-testid={`text-branch-label-${brName}`}>{brName}</h3>
                            <Badge variant={amtPct >= 100 ? "default" : amtPct >= 50 ? "secondary" : "outline"} data-testid={`badge-branch-pct-${brName}`}>
                              {amtPct}% overall
                            </Badge>
                          </div>

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
                        </div>
                      );
                    });
                  })()}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
