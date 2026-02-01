import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, TrendingDown, Building2, Users, Package } from "lucide-react";

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

export default function ParReportPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-par-report-title">PAR Report</h1>
        <p className="text-muted-foreground">
          Portfolio at Risk Analysis and Loan Aging Reports
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {parLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(parData?.summary?.totalPortfolio || 0)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {parLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(parData?.summary?.totalOutstanding || 0)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Provision</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {parLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-600">{formatCurrency(parData?.summary?.totalProvision || 0)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PAR Ratio</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {parLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                <Badge variant={parseFloat(parData?.summary?.parRatio || "0") > 5 ? "destructive" : "outline"}>
                  {parData?.summary?.parRatio || "0"}%
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PAR by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            PAR Analysis by Category
          </CardTitle>
          <CardDescription>Loan classification by days past due with provision requirements</CardDescription>
        </CardHeader>
        <CardContent>
          {parLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-par-categories">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold">Category</th>
                    <th className="text-right p-3 font-semibold">Days Range</th>
                    <th className="text-right p-3 font-semibold">Provision %</th>
                    <th className="text-right p-3 font-semibold">Loans</th>
                    <th className="text-right p-3 font-semibold">Total Amount</th>
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
          )}
        </CardContent>
      </Card>

      {/* PAR by Branch */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            PAR by Branch
          </CardTitle>
          <CardDescription>Portfolio at Risk breakdown by branch location</CardDescription>
        </CardHeader>
        <CardContent>
          {parByBranchLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-par-by-branch">
                <thead>
                  <tr className="border-b bg-muted/50">
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
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            PAR by Finance Officer
          </CardTitle>
          <CardDescription>Portfolio at Risk breakdown by loan officer</CardDescription>
        </CardHeader>
        <CardContent>
          {parByOfficerLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-par-by-officer">
                <thead>
                  <tr className="border-b bg-muted/50">
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
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-500" />
            PAR by Product
          </CardTitle>
          <CardDescription>Portfolio at Risk breakdown by loan product type</CardDescription>
        </CardHeader>
        <CardContent>
          {parByProductLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-par-by-product">
                <thead>
                  <tr className="border-b bg-muted/50">
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
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Loan Aging Report
          </CardTitle>
          <CardDescription>Detailed view of overdue loans with late days</CardDescription>
        </CardHeader>
        <CardContent>
          {agingLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-aging-report">
                <thead>
                  <tr className="border-b bg-muted/50">
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
    </div>
  );
}
