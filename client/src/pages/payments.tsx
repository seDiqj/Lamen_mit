import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  Download,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Banknote,
  User,
  TrendingUp,
} from "lucide-react";
import type { Installment } from "@shared/schema";

type InstallmentWithDetails = Installment & {
  loanApplicationId?: string;
  customerName?: string;
};

type LoanItem = {
  id: string;
  applicationId: string;
  customerId: string;
  customerName: string;
  branchName?: string;
  productName?: string;
  productCode?: string;
  sector?: string;
  requestDate?: string;
  requestedAmount?: string;
  principleAmount?: string;
  totalReceivable?: string;
  totalCollection?: string;
  outstandingPortfolio?: string;
  installmentAmount?: string;
  financingDurationMonths?: number;
  numberOfInstallments?: number;
  marginRate?: string;
  status: string;
};

type SummaryInstallment = {
  id: string;
  loanId: string;
  installmentNumber: number;
  totalAmount?: string;
  isPaid: boolean;
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  disbursed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  defaulted: "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300",
};

function formatAFN(amount?: string | number | null): string {
  if (!amount) return "AFN 0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `AFN ${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function calcFinancing(loan: LoanItem) {
  const principal = parseFloat(loan.principleAmount || loan.requestedAmount || "0");
  const rawMargin = parseFloat(loan.marginRate || "0");
  const marginPercent = rawMargin > 0 && rawMargin < 1 ? rawMargin * 100 : rawMargin;
  return { principal, margin: marginPercent, financingAmount: principal + (principal * marginPercent / 100) };
}

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [summarySearch, setSummarySearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedInstallment, setSelectedInstallment] = useState<InstallmentWithDetails | null>(null);
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const limit = 10;

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery<{
    installments: InstallmentWithDetails[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ["/api/installments", search, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const res = await fetch(`/api/installments?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch installments");
      return res.json();
    },
  });

  const { data: roleData } = useQuery<{ role: string }>({
    queryKey: ["/api/user/role"],
  });

  const { data: loansData, isLoading: loansLoading } = useQuery<{ loans: LoanItem[]; total: number }>({
    queryKey: [`/api/loans?status=disbursed&page=1&limit=500`],
    enabled: activeTab === "summary",
  });

  const { data: allInstallmentsData, isLoading: installmentsLoading } = useQuery<{ installments: SummaryInstallment[]; total: number }>({
    queryKey: ["/api/installments?page=1&limit=2000"],
    enabled: activeTab === "summary",
  });

  const allLoans = loansData?.loans || [];
  const allInstallments = allInstallmentsData?.installments || [];

  const getLoanRepayment = (loan: LoanItem) => {
    const loanInstallments = allInstallments.filter((i) => i.loanId === loan.id);
    const paidInstallments = loanInstallments.filter((i) => i.isPaid);
    const totalRepaid = paidInstallments.reduce((sum, i) => sum + parseFloat(i.totalAmount || "0"), 0);
    const { financingAmount } = calcFinancing(loan);
    const totalTarget = parseFloat(loan.totalReceivable || "0") || financingAmount;
    const progress = totalTarget > 0 ? Math.min((totalRepaid / totalTarget) * 100, 100) : 0;
    return { totalRepaid, totalTarget, progress, paidCount: paidInstallments.length, totalCount: loanInstallments.length };
  };

  const filteredLoans = allLoans.filter((loan) => {
    if (!summarySearch) return true;
    const q = summarySearch.toLowerCase();
    return (
      loan.customerName?.toLowerCase().includes(q) ||
      loan.applicationId?.toLowerCase().includes(q) ||
      loan.branchName?.toLowerCase().includes(q)
    );
  });

  const totalPortfolio = filteredLoans.reduce((sum, l) => sum + parseFloat(l.totalReceivable || "0"), 0);
  const totalRepaidAll = filteredLoans.reduce((sum, l) => sum + getLoanRepayment(l).totalRepaid, 0);
  const totalOutstanding = totalPortfolio - totalRepaidAll;

  const markPaidMutation = useMutation({
    mutationFn: async (installmentId: string) => {
      return apiRequest("PATCH", `/api/installments/${installmentId}/pay`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/installments"] });
      toast({
        title: "Payment Recorded",
        description: "The installment has been marked as paid.",
      });
      setShowPayDialog(false);
      setSelectedInstallment(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      });
    },
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
    const d = typeof date === "string" ? new Date(date) : date;
    const day = d.getDate().toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getPaymentStatus = (installment: InstallmentWithDetails) => {
    if (installment.isPaid) {
      return { label: "Paid", variant: "success" as const };
    }
    if (installment.dueDate && new Date(installment.dueDate) < new Date()) {
      return { label: "Overdue", variant: "destructive" as const };
    }
    return { label: "Pending", variant: "warning" as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-payments-title">Payments</h1>
          <p className="text-muted-foreground">
            Track and manage loan installment payments
          </p>
        </div>
        <Button variant="outline" data-testid="button-export-payments">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collected This Month</p>
                <p className="text-2xl font-bold">{formatCurrency(45000)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due This Week</p>
                <p className="text-2xl font-bold">{formatCurrency(12500)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Overdue</p>
                <p className="text-2xl font-bold">{formatCurrency(8750)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-testid="tabs-payment">
          <TabsTrigger value="list" data-testid="tab-payment-list">Payment List</TabsTrigger>
          <TabsTrigger value="summary" data-testid="tab-payment-summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by loan ID, customer name..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    data-testid="input-search-payments"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Financing ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Installment #</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Late Days</TableHead>
                      {(roleData?.role === "user" || roleData?.role === "manager" || roleData?.role === "admin") && (
                        <TableHead className="text-right">Actions</TableHead>
                      )}
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
                    ) : data?.installments && data.installments.length > 0 ? (
                      data.installments.map((installment) => {
                        const status = getPaymentStatus(installment);
                        return (
                          <TableRow key={installment.id} data-testid={`row-installment-${installment.id}`}>
                            <TableCell className="font-mono text-sm">
                              {installment.loanApplicationId || "-"}
                            </TableCell>
                            <TableCell>{installment.customerName || "-"}</TableCell>
                            <TableCell>#{installment.installmentNumber}</TableCell>
                            <TableCell>{formatDate(installment.dueDate)}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(installment.totalAmount)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  status.label === "Paid" 
                                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                    : status.label === "Overdue"
                                      ? "bg-red-500/10 text-red-700 dark:text-red-400"
                                      : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                }
                              >
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {installment.lateDays ? (
                                <span className="text-red-600 dark:text-red-400">
                                  {installment.lateDays} days
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            {(roleData?.role === "user" || roleData?.role === "manager" || roleData?.role === "admin") && (
                              <TableCell className="text-right">
                                {!installment.isPaid && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedInstallment(installment);
                                      setShowPayDialog(true);
                                    }}
                                    data-testid={`button-pay-${installment.id}`}
                                  >
                                    <DollarSign className="mr-1 h-3 w-3" />
                                    Record Payment
                                  </Button>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No installments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} installments
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {page} of {data.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === data.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Banknote className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Portfolio</p>
                      <p className="text-lg font-bold" data-testid="text-total-portfolio">{formatAFN(totalPortfolio)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Repaid</p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-400" data-testid="text-total-repaid">{formatAFN(totalRepaidAll)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Outstanding</p>
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-400" data-testid="text-total-outstanding">{formatAFN(totalOutstanding)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, application ID, or branch..."
                className="pl-10"
                value={summarySearch}
                onChange={(e) => setSummarySearch(e.target.value)}
                data-testid="input-search-summary"
              />
            </div>

            <p className="text-sm text-muted-foreground">{filteredLoans.length} active financing records</p>

            {loansLoading || installmentsLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredLoans.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No active financing found
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLoans.map((loan) => {
                  const repayment = getLoanRepayment(loan);
                  return (
                    <Card key={loan.id} data-testid={`card-summary-${loan.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <p className="font-medium text-sm truncate" data-testid={`text-summary-name-${loan.id}`}>
                                {loan.customerName}
                              </p>
                              <Badge className={`text-[10px] shrink-0 no-default-hover-elevate no-default-active-elevate ${statusColors[loan.status] || ""}`}>
                                {loan.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {loan.applicationId} {loan.productName && `· ${loan.productName}`}
                              {loan.branchName && ` · ${loan.branchName}`}
                            </p>
                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                              <Banknote className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs font-semibold">
                                {formatAFN(calcFinancing(loan).principal)}
                              </span>
                              {calcFinancing(loan).margin > 0 && (
                                <>
                                  <span className="text-[10px] text-muted-foreground">
                                    + {calcFinancing(loan).margin}%
                                  </span>
                                  <span className="text-[10px] font-semibold text-primary">
                                    = {formatAFN(calcFinancing(loan).financingAmount)}
                                  </span>
                                </>
                              )}
                            </div>
                            {loan.installmentAmount && (
                              <p className="text-[10px] text-muted-foreground mt-1">
                                Installment: {formatAFN(loan.installmentAmount)} x {loan.numberOfInstallments || "—"}
                              </p>
                            )}
                            <div className="mt-2 pt-2 border-t border-border/50">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[11px] text-muted-foreground">
                                  Repaid: <span className="font-semibold text-primary">{formatAFN(repayment.totalRepaid)}</span>
                                  <span className="text-muted-foreground"> / {formatAFN(repayment.totalTarget)}</span>
                                </span>
                                <span className="text-[11px] text-muted-foreground" data-testid={`text-summary-progress-${loan.id}`}>
                                  {repayment.paidCount}/{repayment.totalCount}
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    repayment.progress >= 50 ? "bg-primary" : "bg-amber-500"
                                  }`}
                                  style={{ width: `${repayment.progress}%` }}
                                  data-testid={`progress-summary-${loan.id}`}
                                />
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] text-muted-foreground">
                                  {repayment.progress.toFixed(0)}% complete
                                </span>
                                {loan.requestDate && (
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-2.5 w-2.5" />
                                    {new Date(loan.requestDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Confirm payment for installment #{selectedInstallment?.installmentNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-medium">{selectedInstallment?.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due Date:</span>
              <span>{formatDate(selectedInstallment?.dueDate || null)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-bold text-lg">
                {formatCurrency(selectedInstallment?.totalAmount || 0)}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedInstallment && markPaidMutation.mutate(selectedInstallment.id)}
              disabled={markPaidMutation.isPending}
              data-testid="button-confirm-payment"
            >
              {markPaidMutation.isPending ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
