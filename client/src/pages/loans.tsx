import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import type { Loan } from "@shared/schema";

type LoanWithDetails = Loan & {
  customerName?: string;
  branchName?: string;
  officerName?: string;
};

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    approved: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
    disbursed: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30",
    active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    completed: "bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30",
    defaulted: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  };
  return styles[status] || "bg-muted text-muted-foreground";
}

export default function LoansPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery<{
    loans: LoanWithDetails[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ["/api/loans", search, statusFilter, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const res = await fetch(`/api/loans?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
  });

  const { data: roleData } = useQuery<{ role: string }>({
    queryKey: ["/api/user/role"],
  });

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return "AFN 0";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-loans-title">Loans</h1>
            <p className="text-muted-foreground">
              Manage and track all loan applications
            </p>
          </div>
        </div>
        {(roleData?.role === "manager" || roleData?.role === "admin") && (
          <Button asChild data-testid="button-add-loan">
            <Link href="/loans/new">
              <Plus className="mr-2 h-4 w-4" />
              New Loan
            </Link>
          </Button>
        )}
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
        <CardHeader className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, customer name..."
                className="pl-10 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-loans"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-background" data-testid="select-status-filter">
                  <Filter className="mr-2 h-4 w-4 text-blue-500" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="disbursed">Disbursed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="defaulted">Defaulted</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" data-testid="button-export-loans">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Application ID</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="text-right font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Duration</TableHead>
                  <TableHead className="font-semibold">Request Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : data?.loans && data.loans.length > 0 ? (
                  data.loans.map((loan) => (
                    <TableRow key={loan.id} className="hover:bg-muted/30" data-testid={`row-loan-${loan.id}`}>
                      <TableCell className="font-medium">
                        <span className="text-primary font-semibold">
                          {loan.applicationId || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-semibold">
                            {loan.customerName?.substring(0, 2).toUpperCase() || "??"}
                          </div>
                          <span>{loan.customerName || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{loan.productName || "-"}</TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(loan.requestAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/50">
                          {loan.financingDurationMonths ? `${loan.financingDurationMonths} months` : "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(loan.requestDate)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(loan.status || "pending")}>
                          {loan.status || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild data-testid={`button-view-loan-${loan.id}`}>
                            <Link href={`/loans/${loan.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {(roleData?.role === "manager" || roleData?.role === "admin") && (
                            <Button variant="ghost" size="icon" asChild data-testid={`button-edit-loan-${loan.id}`}>
                              <Link href={`/loans/${loan.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No loans found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} loans
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2 py-1 rounded bg-muted">
                  Page {page} of {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === data.totalPages}
                  onClick={() => setPage(page + 1)}
                  data-testid="button-next-page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
