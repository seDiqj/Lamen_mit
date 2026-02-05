import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  Building2, 
  Calendar, 
  ClipboardCheck, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp,
  Briefcase,
  GraduationCap,
  Target,
  LineChart
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

export default function HRDashboard() {
  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["/api/hr/employees"],
  });

  const { data: departments = [] } = useQuery<any[]>({
    queryKey: ["/api/hr/departments"],
  });

  const { data: leaveRequests = [] } = useQuery<any[]>({
    queryKey: ["/api/hr/leave-requests"],
  });

  const { data: attendance = [] } = useQuery<any[]>({
    queryKey: ["/api/hr/attendance"],
  });

  const { data: analytics } = useQuery<any>({
    queryKey: ["/api/hr/analytics"],
  });

  const activeEmployees = employees.filter((e: any) => e.employmentStatus === "active").length;
  const inactiveEmployees = employees.filter((e: any) => e.employmentStatus !== "active").length;

  const pendingLeaves = leaveRequests.filter((l: any) => l.status === "pending").length;
  const approvedLeaves = leaveRequests.filter((l: any) => l.status === "approved").length;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter((a: any) => a.date === todayStr);
  const presentToday = todayAttendance.filter((a: any) => a.status === "present").length;
  const absentToday = todayAttendance.filter((a: any) => a.status === "absent").length;

  const departmentData = departments.map((dept: any) => {
    const count = employees.filter((e: any) => e.departmentId === dept.id).length;
    return { name: dept.name, value: count };
  }).filter((d: any) => d.value > 0);

  const genderData = [
    { name: "Male", value: employees.filter((e: any) => e.gender === "male").length },
    { name: "Female", value: employees.filter((e: any) => e.gender === "female").length },
  ].filter(d => d.value > 0);

  const employmentTypeData = employees.reduce((acc: any[], emp: any) => {
    const existing = acc.find((a) => a.name === (emp.employmentType || "Unknown"));
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: emp.employmentType || "Unknown", value: 1 });
    }
    return acc;
  }, []);

  const leaveStatusData = [
    { name: "Pending", count: pendingLeaves },
    { name: "Approved", count: approvedLeaves },
    { name: "Rejected", count: leaveRequests.filter((l: any) => l.status === "rejected").length },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LineChart className="h-7 w-7 text-primary" />
            HR Dashboard & Analytics
          </h1>
          <p className="text-muted-foreground">Workforce insights and key HR metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeEmployees} active, {inactiveEmployees} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">
              Active departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leave Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLeaves}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentToday}</div>
            <p className="text-xs text-muted-foreground">
              {absentToday} absent today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.openJobs || 0}</div>
            <p className="text-xs text-muted-foreground">Job openings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalPositions || 0}</div>
            <p className="text-xs text-muted-foreground">Defined positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trainings</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.upcomingTrainings || 0}</div>
            <p className="text-xs text-muted-foreground">Planned sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.pendingReviews || 0}</div>
            <p className="text-xs text-muted-foreground">Performance reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employees by Department</CardTitle>
            <CardDescription>Distribution of employees across departments</CardDescription>
          </CardHeader>
          <CardContent>
            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={departmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                No department data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employment Types</CardTitle>
            <CardDescription>Employee distribution by employment type</CardDescription>
          </CardHeader>
          <CardContent>
            {employmentTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={employmentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {employmentTypeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                No employment type data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gender Distribution</CardTitle>
            <CardDescription>Employee distribution by gender</CardDescription>
          </CardHeader>
          <CardContent>
            {genderData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                No gender data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leave Request Status</CardTitle>
            <CardDescription>Leave requests by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={leaveStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
          <CardDescription>Summary of key HR metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Employees</p>
                <p className="text-lg font-semibold">{activeEmployees}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <UserX className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Inactive Employees</p>
                <p className="text-lg font-semibold">{inactiveEmployees}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Leave Requests</p>
                <p className="text-lg font-semibold">{leaveRequests.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-lg font-semibold">
                  {todayAttendance.length > 0 
                    ? `${((presentToday / todayAttendance.length) * 100).toFixed(0)}%`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
