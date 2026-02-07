import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileText, ChevronRight, LogOut, Wifi, WifiOff, Banknote, Calendar, User, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useOfflineSync } from "@/hooks/use-offline-sync";
import lamenLogo from "@assets/LamenLogo_1769936371528.jpeg";

type FinanceOfficer = {
  id: string;
  name: string;
  code?: string;
  branchId?: string;
  userId?: string;
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
  installmentAmount?: string;
  financingDurationMonths?: number;
  numberOfInstallments?: number;
  marginRate?: string;
  status: string;
};

type LoansResponse = {
  loans: LoanItem[];
  total: number;
  page: number;
  totalPages: number;
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

function formatAFN(amount?: string | number): string {
  if (!amount) return "AFN 0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `AFN ${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function MobileCustomers() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const isOnline = useNetworkStatus();
  useOfflineSync();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: myOfficer, isLoading: officerLoading } = useQuery<FinanceOfficer | null>({
    queryKey: ["/api/finance-officers/me"],
  });

  const { data, isLoading } = useQuery<LoansResponse>({
    queryKey: ["/api/loans", { search: debouncedSearch, status: statusFilter, financeOfficerId: myOfficer?.id, page: 1, limit: 100 }],
    enabled: !!myOfficer?.id,
  });

  const loans = data?.loans || [];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "disbursed", label: "Disbursed" },
    { value: "all", label: "All" },
  ];

  const totalOLB = loans.reduce((sum, l) => sum + (parseFloat(l.totalReceivable || "0")), 0);

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden border border-primary-foreground/30">
              <img src={lamenLogo} alt="Lamen" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight" data-testid="text-header-title">Active Financing</h1>
              <p className="text-[10px] text-primary-foreground/70">{myOfficer?.name || `${user?.firstName} ${user?.lastName}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-primary-foreground/70" />
            ) : (
              <WifiOff className="h-4 w-4 text-yellow-300" />
            )}
            <Button
              size="icon"
              variant="ghost"
              className="text-primary-foreground no-default-hover-elevate"
              onClick={() => logout()}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-1 mb-2 overflow-x-auto">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors ${
                statusFilter === opt.value
                  ? "bg-primary-foreground text-primary"
                  : "text-primary-foreground/70"
              }`}
              data-testid={`filter-${opt.value}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer or application ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-primary-foreground text-foreground border-0"
            data-testid="input-search-financing"
          />
        </div>
      </header>

      {myOfficer && loans.length > 0 && (
        <div className="px-3 py-2 bg-card border-b flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Banknote className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total:</span>
            <span className="text-xs font-semibold" data-testid="text-total-olb">{formatAFN(totalOLB)}</span>
          </div>
          <Badge variant="secondary" className="text-[10px]" data-testid="text-loan-count">{loans.length} financing(s)</Badge>
        </div>
      )}

      <div className="flex-1 overflow-auto px-3 py-3 space-y-2">
        {officerLoading || isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : !myOfficer ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No Officer Profile Found</p>
            <p className="text-xs text-center px-8 mt-1">Your account is not linked to a finance officer profile. Please contact your administrator.</p>
          </div>
        ) : loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No financing found</p>
            <p className="text-xs">
              {statusFilter === "all"
                ? "You have no financing records yet"
                : `No ${statusFilter} financing records`}
            </p>
          </div>
        ) : (
          loans.map((loan) => (
            <Card
              key={loan.id}
              className="hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => navigate(`/mobile/repayments?loanId=${loan.id}`)}
              data-testid={`card-loan-${loan.id}`}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="font-medium text-sm truncate" data-testid={`text-customer-name-${loan.id}`}>
                        {loan.customerName}
                      </p>
                      <Badge className={`text-[10px] shrink-0 no-default-hover-elevate no-default-active-elevate ${statusColors[loan.status] || ""}`}>
                        {loan.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5" data-testid={`text-app-id-${loan.id}`}>
                      {loan.applicationId} {loan.productName && `\u00B7 ${loan.productName}`}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-1.5 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Banknote className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground" data-testid={`text-amount-${loan.id}`}>
                          {formatAFN(loan.requestedAmount)}
                        </span>
                      </div>
                      {loan.requestDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(loan.requestDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                          </span>
                        </div>
                      )}
                    </div>
                    {loan.installmentAmount && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Installment: {formatAFN(loan.installmentAmount)} x {loan.numberOfInstallments || "—"}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-3" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
