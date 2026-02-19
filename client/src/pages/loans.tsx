import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  Filter,
  Download,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  FileText,
  Wallet,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
  MessageCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { FundingSource } from "@shared/schema";
import type { Loan } from "@shared/schema";

type LoanWithDetails = Loan & {
  customerName?: string;
  branchName?: string;
  officerName?: string;
  principleAmount?: string | null;
  fundingSourceId?: string | null;
  disbursementDate?: string | null;
  reviewComments?: string | null;
};

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    returned: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
    committee_review: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
    approved: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
    rejected: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    disbursed: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30",
    active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    completed: "bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30",
    defaulted: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
  };
  return styles[status] || "bg-muted text-muted-foreground";
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pending FAD Review",
    returned: "Returned by FAD",
    committee_review: "Committee Review",
    approved: "Approved",
    rejected: "Rejected",
    disbursed: "Disbursed",
    active: "Active",
    completed: "Completed",
    defaulted: "Defaulted",
  };
  return labels[status] || status;
}

type SortColumn = "applicationId" | "customerName" | "productName" | "amount" | "duration" | "requestDate" | "status";
type SortDirection = "asc" | "desc";

export default function LoansPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const limit = 10;

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground/50" />;
    }
    return sortDirection === "asc" 
      ? <ArrowUp className="ml-1 h-3 w-3 text-primary" />
      : <ArrowDown className="ml-1 h-3 w-3 text-primary" />;
  };

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

  const { data: fundingStats, isLoading: fundingStatsLoading } = useQuery<{ id: string; name: string; loanCount: number; totalAmount: string }[]>({
    queryKey: ["/api/funding-sources/stats"],
  });

  const sortedLoans = (() => {
    if (!data?.loans || !sortColumn) return data?.loans || [];
    
    return [...data.loans].sort((a, b) => {
      let aVal: string | number | null = null;
      let bVal: string | number | null = null;
      
      switch (sortColumn) {
        case "applicationId":
          aVal = a.applicationId || "";
          bVal = b.applicationId || "";
          break;
        case "customerName":
          aVal = a.customerName || "";
          bVal = b.customerName || "";
          break;
        case "productName":
          aVal = a.productName || "";
          bVal = b.productName || "";
          break;
        case "amount":
          aVal = parseFloat(String(a.principleAmount || a.requestAmount || 0));
          bVal = parseFloat(String(b.principleAmount || b.requestAmount || 0));
          break;
        case "duration":
          aVal = a.financingDurationMonths || 0;
          bVal = b.financingDurationMonths || 0;
          break;
        case "requestDate":
          aVal = a.requestDate ? new Date(a.requestDate).getTime() : 0;
          bVal = b.requestDate ? new Date(b.requestDate).getTime() : 0;
          break;
        case "status":
          aVal = a.status || "";
          bVal = b.status || "";
          break;
      }
      
      if (aVal === null || bVal === null) return 0;
      
      let comparison = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else {
        comparison = (aVal as number) - (bVal as number);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  })();

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return "AFN 0";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDateLocal = (date: string | Date | null) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    const day = d.getDate().toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [exporting, setExporting] = useState(false);

  const fetchAllLoans = async (): Promise<LoanWithDetails[]> => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
    params.set("page", "1");
    params.set("limit", "100000");
    const res = await fetch(`/api/loans?${params.toString()}`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch loans for export");
    const result = await res.json();
    return result.loans || [];
  };

  const toExportRows = (loans: LoanWithDetails[]) => {
    return loans.map((loan) => ({
      "Application ID": loan.applicationId || "-",
      "Customer": loan.customerName || "-",
      "Product": loan.productName || "-",
      "Amount": loan.principleAmount || loan.requestAmount || 0,
      "Duration": loan.financingDurationMonths ? `${loan.financingDurationMonths} months` : "-",
      "Request Date": formatDateLocal(loan.requestDate),
      "Disbursement Date": loan.disbursementDate ? formatDateLocal(loan.disbursementDate) : "Not Disbursed",
      "Status": getStatusLabel(loan.status || "pending"),
      "Comments": loan.reviewComments || "-",
    }));
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const allLoans = await fetchAllLoans();
      const exportData = toExportRows(allLoans);
      if (!exportData.length) return;
      const ws = XLSX.utils.json_to_sheet(exportData);
      ws["!cols"] = [
        { wch: 18 }, { wch: 25 }, { wch: 18 }, { wch: 15 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 30 },
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Loans");
      XLSX.writeFile(wb, `Loans_${new Date().toISOString().split("T")[0]}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const allLoans = await fetchAllLoans();
      const exportData = toExportRows(allLoans);
      if (!exportData.length) return;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Lamen Microfinance Institution", 14, 14);
      doc.setFontSize(11);
      doc.text("Financing List", 14, 21);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const now = new Date();
      doc.text(`Date: ${formatDateLocal(now)}`, 250, 14);

      const headers = ["Application ID", "Customer", "Product", "Amount", "Duration", "Request Date", "Disb. Date", "Status", "Comments"];
      const body = exportData.map((row) => [
        row["Application ID"],
        row["Customer"],
        row["Product"],
        typeof row["Amount"] === "number" ? formatCurrency(row["Amount"]) : String(row["Amount"]),
        row["Duration"],
        row["Request Date"],
        row["Disbursement Date"],
        row["Status"],
        row["Comments"],
      ]);

      autoTable(doc, {
        startY: 26,
        head: [headers],
        body,
        margin: { left: 14, right: 14 },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [60, 120, 80], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 250, 245] },
        columnStyles: {
          3: { halign: "right" },
        },
      });

      doc.save(`Loans_${new Date().toISOString().split("T")[0]}.pdf`);
    } finally {
      setExporting(false);
    }
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
            <h1 className="text-2xl font-bold" data-testid="text-loans-title">Financings</h1>
            <p className="text-muted-foreground">
              Manage and track all financing applications
            </p>
          </div>
        </div>
      </div>

      {/* Funding Sources Card */}
      {fundingStatsLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : fundingStats && fundingStats.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {fundingStats.map((source) => (
            <Card key={source.id} className="border-0 shadow-lg overflow-hidden" data-testid={`card-funding-source-${source.id}`}>
              <div className="h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Funding Source</p>
                    <h3 className="text-lg font-bold">{source.name}</h3>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{source.loanCount}</p>
                    <p className="text-xs text-muted-foreground">No. of Loans</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(source.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

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
                  <SelectItem value="pending">Pending FAD Review</SelectItem>
                  <SelectItem value="returned">Returned by FAD</SelectItem>
                  <SelectItem value="committee_review">Committee Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="disbursed">Disbursed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="defaulted">Defaulted</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                onClick={exportToExcel}
                disabled={exporting}
                data-testid="button-export-excel-loans"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                {exporting ? "Exporting..." : "Excel"}
              </Button>
              <Button
                variant="outline"
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                onClick={exportToPDF}
                disabled={exporting}
                data-testid="button-export-pdf-loans"
              >
                <Download className="mr-2 h-4 w-4" />
                {exporting ? "Exporting..." : "PDF"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead 
                    className="font-semibold cursor-pointer select-none hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("applicationId")}
                    data-testid="header-application-id"
                  >
                    <div className="flex items-center">
                      Application ID
                      {getSortIcon("applicationId")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-semibold cursor-pointer select-none hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("customerName")}
                    data-testid="header-customer"
                  >
                    <div className="flex items-center">
                      Customer
                      {getSortIcon("customerName")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-semibold cursor-pointer select-none hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("productName")}
                    data-testid="header-product"
                  >
                    <div className="flex items-center">
                      Product
                      {getSortIcon("productName")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right font-semibold cursor-pointer select-none hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("amount")}
                    data-testid="header-amount"
                  >
                    <div className="flex items-center justify-end">
                      Amount
                      {getSortIcon("amount")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-semibold cursor-pointer select-none hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("duration")}
                    data-testid="header-duration"
                  >
                    <div className="flex items-center">
                      Duration
                      {getSortIcon("duration")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-semibold cursor-pointer select-none hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("requestDate")}
                    data-testid="header-request-date"
                  >
                    <div className="flex items-center">
                      Request Date
                      {getSortIcon("requestDate")}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold" data-testid="header-disbursement-date">
                    Disbursement Date
                  </TableHead>
                  <TableHead 
                    className="font-semibold cursor-pointer select-none hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort("status")}
                    data-testid="header-status"
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold" data-testid="header-comments">
                    Comments
                  </TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 10 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : sortedLoans && sortedLoans.length > 0 ? (
                  sortedLoans.map((loan, index) => (
                    <TableRow key={loan.id} className={`hover:bg-muted/30 ${page === 1 && index < 3 && !sortColumn ? "bg-green-50 dark:bg-green-900/15" : ""}`} data-testid={`row-loan-${loan.id}`}>
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
                        {formatCurrency(loan.principleAmount || loan.requestAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/50">
                          {loan.financingDurationMonths ? `${loan.financingDurationMonths} months` : "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDateLocal(loan.requestDate)}</TableCell>
                      <TableCell>
                        {loan.disbursementDate ? (
                          <span className="text-muted-foreground">{formatDateLocal(loan.disbursementDate)}</span>
                        ) : (
                          <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                            Not Disbursed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(loan.status || "pending")}>
                          {getStatusLabel(loan.status || "pending")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {loan.reviewComments && (loan.status === "returned" || loan.status === "rejected" || loan.status === "pending" || loan.status === "data_quality_review" || loan.status === "risk_compliance_review") ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-start gap-1 max-w-[200px] cursor-pointer">
                                <MessageCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-rose-600 dark:text-rose-400 line-clamp-2" data-testid={`text-review-comment-${loan.id}`}>
                                  {loan.reviewComments}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[400px] whitespace-normal">
                              <p className="text-sm">{loan.reviewComments}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
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
                              <Link href={`/loans/${loan.id}`}>
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
                    <TableCell colSpan={10} className="text-center py-12">
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
