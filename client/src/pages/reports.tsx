import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

type ReportData = {
  portfolioSummary: {
    totalDisbursed: number;
    totalOutstanding: number;
    totalCollected: number;
    averageLoanSize: number;
  };
  monthlyPerformance: {
    month: string;
    disbursed: number;
    collected: number;
    outstanding: number;
  }[];
  loansByProduct: { product: string; count: number; amount: number }[];
  loansByBranch: { branch: string; count: number; amount: number }[];
  collectionRate: { month: string; rate: number }[];
  parAnalysis: { category: string; amount: number; percentage: number }[];
};

type ParCategory = {
  id: number;
  category: string;
  startDay: number;
  endDay: number;
  provisionPercent: number;
  loanCount: number;
  totalAmount: number;
  outstandingAmount: number;
  provisionAmount: number;
  loanPercentage: string;
  amountPercentage: string;
};

type ParAnalysisData = {
  categories: ParCategory[];
  summary: {
    totalLoans: number;
    totalPortfolio: number;
    totalOutstanding: number;
    totalProvision: number;
    parRatio: string;
  };
};

export default function ReportsPage() {
  const [period, setPeriod] = useState("6months");
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading } = useQuery<ReportData>({
    queryKey: ["/api/reports", period],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("period", period);
      const res = await fetch(`/api/reports?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
  });

  const { data: parData, isLoading: parLoading } = useQuery<ParAnalysisData>({
    queryKey: ["/api/reports/par-analysis"],
    queryFn: async () => {
      const res = await fetch("/api/reports/par-analysis", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch PAR analysis");
      return res.json();
    },
  });

  const { data: parByBranch, isLoading: parByBranchLoading } = useQuery<any[]>({
    queryKey: ["/api/reports/par-by-branch"],
    queryFn: async () => {
      const res = await fetch("/api/reports/par-by-branch", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch PAR by branch");
      return res.json();
    },
  });

  const { data: parByOfficer, isLoading: parByOfficerLoading } = useQuery<any[]>({
    queryKey: ["/api/reports/par-by-officer"],
    queryFn: async () => {
      const res = await fetch("/api/reports/par-by-officer", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch PAR by officer");
      return res.json();
    },
  });

  const { data: parByProduct, isLoading: parByProductLoading } = useQuery<any[]>({
    queryKey: ["/api/reports/par-by-product"],
    queryFn: async () => {
      const res = await fetch("/api/reports/par-by-product", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch PAR by product");
      return res.json();
    },
  });

  const { data: agingReport, isLoading: agingLoading } = useQuery<any[]>({
    queryKey: ["/api/reports/aging"],
    queryFn: async () => {
      const res = await fetch("/api/reports/aging", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch aging report");
      return res.json();
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = async (format: "excel" | "pdf") => {
    window.open(`/api/reports/export?format=${format}&period=${period}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-reports-title">Reports</h1>
          <p className="text-muted-foreground">
            Analyze performance and generate comprehensive reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]" data-testid="select-period">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport("excel")} data-testid="button-export-excel">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport("pdf")} data-testid="button-export-pdf">
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Disbursed</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatCurrency(data?.portfolioSummary?.totalDisbursed || 0)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatCurrency(data?.portfolioSummary?.totalOutstanding || 0)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collected</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatCurrency(data?.portfolioSummary?.totalCollected || 0)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Loan Size</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatCurrency(data?.portfolioSummary?.averageLoanSize || 0)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio" data-testid="tab-portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="collections" data-testid="tab-collections">Collections</TabsTrigger>
          <TabsTrigger value="par" data-testid="tab-par">PAR Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Disbursements vs Collections over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart
                    data={data?.monthlyPerformance || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), ""]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="disbursed" 
                      stroke="hsl(var(--chart-1))" 
                      fillOpacity={1} 
                      fill="url(#colorDisbursed)" 
                      name="Disbursed"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="collected" 
                      stroke="hsl(var(--chart-2))" 
                      fillOpacity={1} 
                      fill="url(#colorCollected)"
                      name="Collected"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Loans by Product</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={data?.loansByProduct || []}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tickFormatter={(v) => `$${v / 1000}k`} />
                      <YAxis type="category" dataKey="product" className="text-xs" />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), "Amount"]}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loans by Branch</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={data?.loansByBranch || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="amount"
                        nameKey="branch"
                        label={({ branch, percentage }) => `${branch}: ${percentage?.toFixed(0)}%`}
                      >
                        {(data?.loansByBranch || []).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), "Amount"]}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Collection Rate Trend</CardTitle>
              <CardDescription>Monthly collection rate as percentage of due amount</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={data?.collectionRate || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, "Rate"]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }}
                      name="Collection Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="par" className="space-y-6 mt-6">
          {/* PAR Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Loans</p>
                {parLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-bold">{parData?.summary?.totalLoans || 0}</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                {parLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-bold">{formatCurrency(parData?.summary?.totalPortfolio || 0)}</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Provision</p>
                {parLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(parData?.summary?.totalProvision || 0)}</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">PAR Ratio</p>
                {parLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-bold">{parData?.summary?.parRatio || 0}%</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio at Risk (PAR) Analysis</CardTitle>
              <CardDescription>Breakdown of loans by late days category with provision requirements</CardDescription>
            </CardHeader>
            <CardContent>
              {parLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-6">
                  {/* Chart */}
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={parData?.categories || []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="category" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(v) => formatCurrency(v)} />
                      <Tooltip 
                        formatter={(value: number, name: string) => [formatCurrency(value), name === "outstandingAmount" ? "Outstanding" : name === "provisionAmount" ? "Provision" : "Amount"]}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="outstandingAmount" name="Outstanding Amount" radius={[4, 4, 0, 0]} fill="hsl(var(--chart-1))" />
                      <Bar dataKey="provisionAmount" name="Provision Amount" radius={[4, 4, 0, 0]} fill="hsl(0 84% 60%)" />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* PAR Categories Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="table-par-analysis">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Category</th>
                          <th className="text-right p-3 font-semibold">Days Range</th>
                          <th className="text-right p-3 font-semibold">Provision %</th>
                          <th className="text-right p-3 font-semibold">Loans</th>
                          <th className="text-right p-3 font-semibold">Loan Amount</th>
                          <th className="text-right p-3 font-semibold">Outstanding</th>
                          <th className="text-right p-3 font-semibold">Provision</th>
                          <th className="text-right p-3 font-semibold">% of Portfolio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(parData?.categories || []).map((cat, index) => (
                          <tr key={cat.id || index} className="border-b hover:bg-muted/50">
                            <td className="p-3 font-medium">{cat.category}</td>
                            <td className="p-3 text-right text-muted-foreground">
                              {cat.startDay === 0 && cat.endDay === 0 ? '0' : `${cat.startDay}-${cat.endDay > 10000 ? '∞' : cat.endDay}`}
                            </td>
                            <td className="p-3 text-right">{cat.provisionPercent}%</td>
                            <td className="p-3 text-right">{cat.loanCount}</td>
                            <td className="p-3 text-right">{formatCurrency(cat.totalAmount)}</td>
                            <td className="p-3 text-right">{formatCurrency(cat.outstandingAmount)}</td>
                            <td className="p-3 text-right text-red-600 font-medium">{formatCurrency(cat.provisionAmount)}</td>
                            <td className="p-3 text-right">
                              <Badge variant="outline">{cat.amountPercentage}%</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-muted/50 font-semibold">
                          <td className="p-3">Total</td>
                          <td className="p-3"></td>
                          <td className="p-3"></td>
                          <td className="p-3 text-right">{parData?.summary?.totalLoans || 0}</td>
                          <td className="p-3 text-right">{formatCurrency(parData?.summary?.totalPortfolio || 0)}</td>
                          <td className="p-3 text-right">{formatCurrency(parData?.summary?.totalOutstanding || 0)}</td>
                          <td className="p-3 text-right text-red-600">{formatCurrency(parData?.summary?.totalProvision || 0)}</td>
                          <td className="p-3 text-right">100%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PAR by Branch */}
          <Card>
            <CardHeader>
              <CardTitle>PAR by Branch</CardTitle>
              <CardDescription>Portfolio at Risk breakdown by branch location</CardDescription>
            </CardHeader>
            <CardContent>
              {parByBranchLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-par-by-branch">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Branch</th>
                        <th className="text-right p-3 font-semibold">Loans</th>
                        <th className="text-right p-3 font-semibold">Portfolio</th>
                        <th className="text-right p-3 font-semibold">Outstanding</th>
                        <th className="text-right p-3 font-semibold">PAR Amount</th>
                        <th className="text-right p-3 font-semibold">PAR Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(parByBranch || []).map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{item.branch}</td>
                          <td className="p-3 text-right">{item.loanCount}</td>
                          <td className="p-3 text-right">{formatCurrency(item.totalAmount)}</td>
                          <td className="p-3 text-right">{formatCurrency(item.outstandingAmount)}</td>
                          <td className="p-3 text-right text-orange-600">{formatCurrency(item.parAmount)}</td>
                          <td className="p-3 text-right">
                            <Badge variant={parseFloat(item.parRatio) > 5 ? "destructive" : "outline"}>
                              {item.parRatio}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PAR by Finance Officer */}
          <Card>
            <CardHeader>
              <CardTitle>PAR by Finance Officer</CardTitle>
              <CardDescription>Portfolio at Risk breakdown by loan officer</CardDescription>
            </CardHeader>
            <CardContent>
              {parByOfficerLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-par-by-officer">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Officer</th>
                        <th className="text-left p-3 font-semibold">Branch</th>
                        <th className="text-right p-3 font-semibold">Loans</th>
                        <th className="text-right p-3 font-semibold">Portfolio</th>
                        <th className="text-right p-3 font-semibold">Outstanding</th>
                        <th className="text-right p-3 font-semibold">PAR Amount</th>
                        <th className="text-right p-3 font-semibold">PAR Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(parByOfficer || []).map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{item.officer}</td>
                          <td className="p-3 text-muted-foreground">{item.branch}</td>
                          <td className="p-3 text-right">{item.loanCount}</td>
                          <td className="p-3 text-right">{formatCurrency(item.totalAmount)}</td>
                          <td className="p-3 text-right">{formatCurrency(item.outstandingAmount)}</td>
                          <td className="p-3 text-right text-orange-600">{formatCurrency(item.parAmount)}</td>
                          <td className="p-3 text-right">
                            <Badge variant={parseFloat(item.parRatio) > 5 ? "destructive" : "outline"}>
                              {item.parRatio}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PAR by Product */}
          <Card>
            <CardHeader>
              <CardTitle>PAR by Product</CardTitle>
              <CardDescription>Portfolio at Risk breakdown by loan product type</CardDescription>
            </CardHeader>
            <CardContent>
              {parByProductLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-par-by-product">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Product</th>
                        <th className="text-right p-3 font-semibold">Loans</th>
                        <th className="text-right p-3 font-semibold">Portfolio</th>
                        <th className="text-right p-3 font-semibold">Outstanding</th>
                        <th className="text-right p-3 font-semibold">PAR Amount</th>
                        <th className="text-right p-3 font-semibold">PAR Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(parByProduct || []).map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{item.product}</td>
                          <td className="p-3 text-right">{item.loanCount}</td>
                          <td className="p-3 text-right">{formatCurrency(item.totalAmount)}</td>
                          <td className="p-3 text-right">{formatCurrency(item.outstandingAmount)}</td>
                          <td className="p-3 text-right text-orange-600">{formatCurrency(item.parAmount)}</td>
                          <td className="p-3 text-right">
                            <Badge variant={parseFloat(item.parRatio) > 5 ? "destructive" : "outline"}>
                              {item.parRatio}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Aging Report */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Aging Report</CardTitle>
              <CardDescription>Detailed view of overdue loans with late days</CardDescription>
            </CardHeader>
            <CardContent>
              {agingLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-aging-report">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Loan ID</th>
                        <th className="text-left p-3 font-semibold">Customer</th>
                        <th className="text-left p-3 font-semibold">Branch</th>
                        <th className="text-left p-3 font-semibold">Officer</th>
                        <th className="text-left p-3 font-semibold">Product</th>
                        <th className="text-right p-3 font-semibold">Loan Amount</th>
                        <th className="text-right p-3 font-semibold">Outstanding</th>
                        <th className="text-right p-3 font-semibold">Late Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(agingReport || []).map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-mono text-sm">{item.loanId}</td>
                          <td className="p-3 font-medium">{item.customerName}</td>
                          <td className="p-3 text-muted-foreground">{item.branch}</td>
                          <td className="p-3 text-muted-foreground">{item.officer}</td>
                          <td className="p-3">{item.product}</td>
                          <td className="p-3 text-right">{formatCurrency(item.loanAmount)}</td>
                          <td className="p-3 text-right">{formatCurrency(item.outstanding)}</td>
                          <td className="p-3 text-right">
                            <Badge variant={item.totalLateDays > 30 ? "destructive" : item.totalLateDays > 7 ? "secondary" : "outline"}>
                              {item.totalLateDays} days
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!agingReport || agingReport.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      No overdue loans found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
