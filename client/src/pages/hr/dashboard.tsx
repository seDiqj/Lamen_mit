import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Users, Building2, Clock, TrendingUp, Star,
  Wallet, Calendar, UserPlus, ArrowRight
} from "lucide-react";

export default function HRDashboard() {
  const { data: employees = [] } = useQuery<any[]>({ queryKey: ["/api/hr/employees"] });
  const { data: departments = [] } = useQuery<any[]>({ queryKey: ["/api/hr/departments"] });
  const { data: leaveRequests = [] } = useQuery<any[]>({ queryKey: ["/api/hr/leave-requests"] });
  const { data: positions = [] } = useQuery<any[]>({ queryKey: ["/api/hr/positions"] });
  const { data: payrollRuns = [] } = useQuery<any[]>({ queryKey: ["/api/hr/payroll/runs"] });
  const { data: reviews = [] } = useQuery<any[]>({ queryKey: ["/api/hr/performance/reviews"] });
  const { data: goals = [] } = useQuery<any[]>({ queryKey: ["/api/hr/performance/goals"] });
  const { data: branches = [] } = useQuery<any[]>({ queryKey: ["/api/branches"] });
  const { data: employeeSalaries = [] } = useQuery<any[]>({ queryKey: ["/api/hr/payroll/employee-salaries"] });

  const activeEmployees = employees.filter((e: any) => e.employmentStatus === "active");
  const inactiveEmployees = employees.filter((e: any) => e.employmentStatus !== "active");
  const totalEmployees = employees.length;
  const activeCount = activeEmployees.length;
  const inactiveCount = inactiveEmployees.length;
  const activeRate = totalEmployees > 0 ? ((activeCount / totalEmployees) * 100).toFixed(1) : "0.0";

  const activeDepartments = departments.filter((d: any) => d.isActive !== false).length;

  const pendingLeaves = leaveRequests.filter((l: any) => l.status === "pending");
  const approvedLeaves = leaveRequests.filter((l: any) => l.status === "approved");
  const rejectedLeaves = leaveRequests.filter((l: any) => l.status === "rejected");
  const totalLeaves = leaveRequests.length;
  const leaveApprovalRate = totalLeaves > 0 ? ((approvedLeaves.length / totalLeaves) * 100).toFixed(1) : "0.0";

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentHires = employees
    .filter((e: any) => e.hireDate && new Date(e.hireDate) >= thirtyDaysAgo)
    .sort((a: any, b: any) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime());

  const activeSalaries = employeeSalaries.filter((s: any) => s.isActive);
  const monthlyPayroll = activeSalaries.reduce((sum: number, s: any) => sum + (parseFloat(s.baseSalary) || 0), 0);
  const avgSalary = activeSalaries.length > 0 ? monthlyPayroll / activeSalaries.length : 0;

  const latestPayrollRun = payrollRuns.length > 0
    ? payrollRuns.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;
  const paidPayslips = latestPayrollRun ? parseInt(latestPayrollRun.totalEmployees || "0") : 0;

  const completedReviews = reviews.filter((r: any) => r.overallRating);
  const avgRating = completedReviews.length > 0
    ? (completedReviews.reduce((s: number, r: any) => s + (r.overallRating || 0), 0) / completedReviews.length).toFixed(1)
    : "0.0";

  const totalGoals = goals.length;
  const metGoals = goals.filter((g: any) => g.status === "completed" || g.status === "met" || g.achievementPercentage >= 100);
  const goalRate = totalGoals > 0 ? ((metGoals.length / totalGoals) * 100).toFixed(0) : "0";

  const genderCounts = { male: 0, female: 0, unspecified: 0 };
  employees.forEach((e: any) => {
    if (e.gender === "male") genderCounts.male++;
    else if (e.gender === "female") genderCounts.female++;
    else genderCounts.unspecified++;
  });
  const genderTotal = totalEmployees || 1;

  const employmentTypeCounts: Record<string, number> = {};
  employees.forEach((e: any) => {
    const t = e.employmentType || "full time";
    employmentTypeCounts[t] = (employmentTypeCounts[t] || 0) + 1;
  });

  const branchCounts: { name: string; count: number }[] = [];
  branches.forEach((b: any) => {
    const c = employees.filter((e: any) => e.branchId === b.id).length;
    if (c > 0) branchCounts.push({ name: b.name || b.code || b.id, count: c });
  });
  branchCounts.sort((a, b) => b.count - a.count);

  const roleCounts: { name: string; count: number }[] = [];
  positions.forEach((p: any) => {
    const c = employees.filter((e: any) => e.positionId === p.id).length;
    if (c > 0) roleCounts.push({ name: p.title, count: c });
  });
  roleCounts.sort((a, b) => b.count - a.count);
  const topRoles = roleCounts.slice(0, 8);
  const maxRoleCount = topRoles.length > 0 ? topRoles[0].count : 1;

  const recentReviews = completedReviews
    .sort((a: any, b: any) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime())
    .slice(0, 5);

  const now = new Date();
  const dateStr = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  const GENDER_COLORS: Record<string, string> = {
    unspecified: "#3b82f6",
    male: "#22c55e",
    female: "#f59e0b",
  };

  const EMP_TYPE_COLORS = ["#f59e0b", "#3b82f6", "#22c55e", "#8b5cf6", "#ef4444"];

  const BRANCH_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

  function getInitials(firstName: string, lastName: string) {
    return `${(firstName || "")[0] || ""}${(lastName || "")[0] || ""}`.toUpperCase();
  }

  function getInitialColor(name: string) {
    const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#f97316", "#ec4899"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  function getRatingLabel(rating: number) {
    if (rating >= 4.5) return "Outstanding";
    if (rating >= 3.5) return "Excellent";
    if (rating >= 2.5) return "Good";
    if (rating >= 1.5) return "Average";
    return "Below Average";
  }

  function getEmployeeName(employeeId: string) {
    const emp = employees.find((e: any) => e.id === employeeId);
    return emp ? { firstName: emp.firstName, lastName: emp.lastName } : { firstName: "Unknown", lastName: "" };
  }

  function getEmployeePosition(employeeId: string) {
    const emp = employees.find((e: any) => e.id === employeeId);
    if (!emp?.positionId) return "";
    const pos = positions.find((p: any) => p.id === emp.positionId);
    return pos?.title || "";
  }

  function getEmployeeBranch(employeeId: string) {
    const emp = employees.find((e: any) => e.id === employeeId);
    if (!emp?.branchId) return "";
    const br = branches.find((b: any) => b.id === emp.branchId);
    return br?.name || br?.code || "";
  }

  function getReviewPeriod(review: any) {
    if (review.periodId) {
      return review.periodId.substring(0, 8);
    }
    if (review.completedAt) {
      const d = new Date(review.completedAt);
      return `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`;
    }
    return new Date(review.createdAt).getFullYear().toString();
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold" data-testid="text-hr-dashboard-title">HR Dashboard</h1>
          <Badge style={{ backgroundColor: "#1e40af", color: "white" }} className="rounded-full text-xs px-3 py-0.5" data-testid="badge-active-employees">
            {activeCount} active
          </Badge>
          <Badge style={{ backgroundColor: "#dc2626", color: "white" }} className="rounded-full text-xs px-3 py-0.5" data-testid="badge-pending-leave">
            {pendingLeaves.length} pending leave
          </Badge>
          <Badge style={{ backgroundColor: "#f59e0b", color: "white" }} className="rounded-full text-xs px-3 py-0.5" data-testid="badge-avg-rating">
            Avg {avgRating}/5 rating
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground" data-testid="text-hr-subtitle">
          Workforce overview, payroll, performance & leave summary · {dateStr}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border" data-testid="card-total-employees">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#dbeafe" }}>
              <Users className="h-5 w-5" style={{ color: "#2563eb" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <div className="text-xs text-muted-foreground">Total Employees</div>
              <div className="text-[10px] text-muted-foreground">{activeCount} active, {inactiveCount} inactive</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border" data-testid="card-active-rate">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#dcfce7" }}>
              <TrendingUp className="h-5 w-5" style={{ color: "#16a34a" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">{activeRate}%</div>
              <div className="text-xs text-muted-foreground">Active Rate</div>
              <div className="text-[10px] text-muted-foreground">{activeCount} of {totalEmployees}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border" data-testid="card-departments">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#fef9c3" }}>
              <Building2 className="h-5 w-5" style={{ color: "#ca8a04" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">{departments.length}</div>
              <div className="text-xs text-muted-foreground">Departments</div>
              <div className="text-[10px] text-muted-foreground">{activeDepartments} active</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border" data-testid="card-monthly-payroll">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#dbeafe" }}>
              <Wallet className="h-5 w-5" style={{ color: "#2563eb" }} />
            </div>
            <div>
              <div className="text-2xl font-bold truncate" title={`AFN ${monthlyPayroll.toLocaleString()}`}>
                AFN {monthlyPayroll >= 1000000 ? `${(monthlyPayroll / 1000000).toFixed(1)}M` : monthlyPayroll.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-muted-foreground">Monthly Payroll</div>
              <div className="text-[10px] text-muted-foreground truncate">Avg AFN {avgSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border" data-testid="card-recent-hires">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#dbeafe" }}>
              <UserPlus className="h-5 w-5" style={{ color: "#2563eb" }} />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{recentHires.length}</div>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded">30d</Badge>
            </div>
            <div className="hidden">spacer</div>
          </CardContent>
          <div className="-mt-2 px-4 pb-3">
            <div className="text-xs text-muted-foreground">Recent Hires</div>
            <div className="text-[10px] text-muted-foreground">Last 30 days</div>
          </div>
        </Card>

        <Card className="border" data-testid="card-pending-leave">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#fee2e2" }}>
              <Calendar className="h-5 w-5" style={{ color: "#dc2626" }} />
            </div>
            <div>
              <div className="text-2xl font-bold">{pendingLeaves.length}</div>
              <div className="text-xs text-muted-foreground">Pending Leave</div>
              <div className="text-[10px] text-muted-foreground">{approvedLeaves.length} approved total</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border" data-testid="card-workforce-composition">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Workforce Composition
              </CardTitle>
              <span className="text-sm text-muted-foreground">{totalEmployees} employees</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm font-medium mb-2">Gender Distribution</p>
              <div className="h-7 rounded-md overflow-hidden flex">
                {genderCounts.unspecified > 0 && (
                  <div
                    style={{ width: `${(genderCounts.unspecified / genderTotal) * 100}%`, backgroundColor: GENDER_COLORS.unspecified }}
                    className="flex items-center justify-center text-white text-[11px] font-medium"
                  >
                    Unspecified {((genderCounts.unspecified / genderTotal) * 100).toFixed(0)}%
                  </div>
                )}
                {genderCounts.male > 0 && (
                  <div
                    style={{ width: `${(genderCounts.male / genderTotal) * 100}%`, backgroundColor: GENDER_COLORS.male }}
                    className="flex items-center justify-center text-white text-[11px] font-medium"
                  >
                    male {((genderCounts.male / genderTotal) * 100).toFixed(0)}%
                  </div>
                )}
                {genderCounts.female > 0 && (
                  <div
                    style={{ width: `${(genderCounts.female / genderTotal) * 100}%`, backgroundColor: GENDER_COLORS.female }}
                    className="flex items-center justify-center text-white text-[11px] font-medium"
                  >
                    female {((genderCounts.female / genderTotal) * 100).toFixed(0)}%
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GENDER_COLORS.unspecified }} />
                  Unspecified : {genderCounts.unspecified} ({((genderCounts.unspecified / genderTotal) * 100).toFixed(1)}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GENDER_COLORS.male }} />
                  male : {genderCounts.male} ({((genderCounts.male / genderTotal) * 100).toFixed(1)}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GENDER_COLORS.female }} />
                  female : {genderCounts.female} ({((genderCounts.female / genderTotal) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Employment Type</p>
              <div className="h-7 rounded-md overflow-hidden flex">
                {Object.entries(employmentTypeCounts).map(([type, count], i) => (
                  <div
                    key={type}
                    style={{ width: `${(count / genderTotal) * 100}%`, backgroundColor: EMP_TYPE_COLORS[i % EMP_TYPE_COLORS.length] }}
                    className="flex items-center justify-center text-white text-[11px] font-medium"
                  >
                    {type} {((count / genderTotal) * 100).toFixed(0)}%
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                {Object.entries(employmentTypeCounts).map(([type, count], i) => (
                  <span key={type} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: EMP_TYPE_COLORS[i % EMP_TYPE_COLORS.length] }} />
                    {type} : {count} ({((count / genderTotal) * 100).toFixed(1)}%)
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Branch Distribution</p>
              <div className="space-y-2.5">
                {branchCounts.map((b, i) => (
                  <div key={b.name} className="flex items-center gap-3">
                    <div className="w-24 text-xs font-medium truncate">{b.name}</div>
                    <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden">
                      <div
                        className="h-full rounded-sm"
                        style={{
                          width: `${(b.count / totalEmployees) * 100}%`,
                          backgroundColor: BRANCH_COLORS[i % BRANCH_COLORS.length],
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground w-20 text-right">
                      {b.count} ({((b.count / totalEmployees) * 100).toFixed(1)}%)
                    </div>
                  </div>
                ))}
                {branchCounts.length === 0 && (
                  <p className="text-xs text-muted-foreground">No branch data available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border" data-testid="card-top-roles">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4" style={{ color: "#f59e0b" }} />
                  Top Roles
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {topRoles.map((role) => (
                <div key={role.name} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{role.name}</div>
                    <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(role.count / maxRoleCount) * 100}%`,
                          backgroundColor: "#3b82f6",
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-semibold w-6 text-right">{role.count}</div>
                </div>
              ))}
              {topRoles.length === 0 && (
                <p className="text-xs text-muted-foreground">No role data available</p>
              )}
            </CardContent>
          </Card>

          <Card className="border" data-testid="card-employee-status">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Employee Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <div className="text-3xl font-bold" style={{ color: "#16a34a" }}>{activeCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">Active</div>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
                  <div className="text-3xl font-bold" style={{ color: "#dc2626" }}>{inactiveCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">Inactive</div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Active Rate</span>
                  <span className="font-medium">{activeRate}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${parseFloat(activeRate)}%`,
                      backgroundColor: "#22c55e",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border" data-testid="card-payroll-summary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              Payroll Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <div className="text-lg font-bold">AFN {monthlyPayroll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs text-muted-foreground">Monthly Payroll</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-lg font-bold">AFN {avgSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs text-muted-foreground">Avg Salary</div>
              </div>
            </div>
            {latestPayrollRun && (
              <div className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Recent batch</span>
                  <span className="text-xs text-muted-foreground">
                    {latestPayrollRun.status === "paid" ? paidPayslips : 0}/{paidPayslips} paid
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: latestPayrollRun.status === "paid" ? "100%" : latestPayrollRun.status === "approved" ? "70%" : "30%",
                      backgroundColor: "#3b82f6",
                    }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground">
                  → AFN {parseFloat(latestPayrollRun.totalNetSalary || "0").toLocaleString(undefined, { minimumFractionDigits: 2 })} net across {paidPayslips} records
                </div>
              </div>
            )}
            <Link href="/hr/payroll" className="text-sm flex items-center gap-1 text-primary hover:underline" data-testid="link-view-payroll">
              View Payroll <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border" data-testid="card-leave-overview">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Leave Overview
              </CardTitle>
              {pendingLeaves.length > 0 && (
                <Badge style={{ backgroundColor: "#f59e0b", color: "white" }} className="rounded-full text-xs px-2">
                  {pendingLeaves.length} pending
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-bold" style={{ color: "#f59e0b" }}>{pendingLeaves.length}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{approvedLeaves.length}</div>
                <div className="text-xs text-muted-foreground">Approved</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-bold">{totalLeaves}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Approval rate</span>
                <span className="font-medium">{leaveApprovalRate}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex">
                {totalLeaves > 0 ? (
                  <>
                    <div style={{ width: `${(approvedLeaves.length / totalLeaves) * 100}%`, backgroundColor: "#22c55e" }} className="h-full" />
                    <div style={{ width: `${(pendingLeaves.length / totalLeaves) * 100}%`, backgroundColor: "#f59e0b" }} className="h-full" />
                    <div style={{ width: `${(rejectedLeaves.length / totalLeaves) * 100}%`, backgroundColor: "#ef4444" }} className="h-full" />
                  </>
                ) : (
                  <div className="h-full w-full bg-muted rounded-full" />
                )}
              </div>
              <div className="flex gap-4 mt-1.5 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} /> Approved</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#f59e0b" }} /> Pending</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ef4444" }} /> Rejected</span>
              </div>
            </div>
            <Link href="/hr/leave" className="text-sm flex items-center gap-1 text-primary hover:underline" data-testid="link-manage-leave">
              Manage Leave <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border" data-testid="card-performance-overview">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-4 w-4" style={{ color: "#f59e0b" }} />
                Performance Overview
              </CardTitle>
              <span className="text-xs text-muted-foreground">{reviews.length} reviews</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-3 w-3" style={{ color: "#f59e0b" }} />
                  <span className="text-xl font-bold">{avgRating}</span>
                </div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-lg font-bold">{metGoals.length}/{totalGoals}</div>
                <div className="text-xs text-muted-foreground">Goals Met</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xl font-bold">{goalRate}%</div>
                <div className="text-xs text-muted-foreground">Goal Rate</div>
              </div>
            </div>

            {recentReviews.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Recent Reviews</p>
                <div className="space-y-2">
                  {recentReviews.map((review: any) => {
                    const emp = getEmployeeName(review.employeeId);
                    const initials = getInitials(emp.firstName, emp.lastName);
                    const color = getInitialColor(emp.firstName + emp.lastName);
                    const rating = review.overallRating || 0;
                    return (
                      <div key={review.id} className="flex items-center gap-2 py-1">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{emp.firstName} {emp.lastName}</div>
                          <div className="text-[10px] text-muted-foreground">{getReviewPeriod(review)}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-bold">{rating}/5</span>
                          <div className="text-[10px] text-muted-foreground">{getRatingLabel(rating)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Link href="/hr/performance" className="text-sm flex items-center gap-1 text-primary hover:underline" data-testid="link-view-performance">
              View Performance <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border" data-testid="card-recent-hires">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              Recent Hires
            </CardTitle>
            <Badge style={{ backgroundColor: "#dbeafe", color: "#1e40af" }} className="rounded-full text-xs px-2">
              {recentHires.length} in 30 days
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {recentHires.length > 0 ? (
            <div className="space-y-1">
              {recentHires.map((emp: any) => {
                const initials = getInitials(emp.firstName, emp.lastName);
                const color = getInitialColor(emp.firstName + emp.lastName);
                const pos = positions.find((p: any) => p.id === emp.positionId);
                const branch = branches.find((b: any) => b.id === emp.branchId);
                const hireDate = emp.hireDate ? new Date(emp.hireDate) : null;
                return (
                  <div key={emp.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{emp.firstName} {emp.lastName}</div>
                      <div className="text-xs text-muted-foreground">
                        {pos?.title || "No position"} · {branch?.name || branch?.code || "No branch"}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0">
                      {hireDate ? hireDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No recent hires in the last 30 days</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
