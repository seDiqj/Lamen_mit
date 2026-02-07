import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar, ChevronLeft, ChevronDown, ChevronUp,
  Wifi, WifiOff, DollarSign, CheckCircle2, Clock, AlertCircle, FileText
} from "lucide-react";
import lamenLogo from "@assets/LamenLogo_1769936371528.jpeg";

type FinanceOfficer = {
  id: string;
  name: string;
};

type Loan = {
  id: string;
  applicationId: string;
  productName?: string;
  requestAmount?: string;
  principleAmount?: string;
  outstandingPortfolio?: string;
  totalReceivable?: string;
  totalCollection?: string;
  status: string;
  numberOfInstallments?: number;
  marginRate?: string;
  financingDurationMonths?: number;
  customerName?: string;
  customerFirstName?: string;
  customerLastName?: string;
};

type Installment = {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  principleAmount?: string;
  marginAmount?: string;
  totalAmount?: string;
  isPaid: boolean;
  paymentDate?: string;
  lateDays?: number;
};

const formatCurrency = (amount: string | number | undefined) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat("en-AF", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

const statusColor = (status: string) => {
  switch (status) {
    case "active": case "disbursed": return "default";
    case "completed": return "secondary";
    case "pending": return "outline";
    default: return "outline";
  }
};

export default function MobileRepayments() {
  const [, navigate] = useLocation();
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const loanIdParam = params.get("loanId");
  const isOnline = useNetworkStatus();
  const [expandedLoan, setExpandedLoan] = useState<string | null>(loanIdParam);

  const { data: roleData, isLoading: roleLoading } = useQuery<{ role: string }>({
    queryKey: ["/api/user/role"],
  });
  const userRole = roleData?.role || "user";
  const isAdminOrManager = userRole === "admin" || userRole === "manager";

  const { data: myOfficer, isLoading: officerLoading } = useQuery<FinanceOfficer | null>({
    queryKey: ["/api/finance-officers/me"],
    enabled: !isAdminOrManager,
  });

  const loansUrl = isAdminOrManager
    ? `/api/loans?status=disbursed&page=1&limit=200`
    : myOfficer?.id
      ? `/api/loans?financeOfficerId=${myOfficer.id}&status=disbursed&page=1&limit=200`
      : null;

  const { data: loansData, isLoading: loansLoading } = useQuery<{ loans: any[]; total: number }>({
    queryKey: [loansUrl],
    enabled: isAdminOrManager ? !roleLoading : (!!myOfficer?.id && !!loansUrl),
  });

  const { data: installmentsData, isLoading: installmentsLoading } = useQuery<{ installments: Installment[]; total: number }>({
    queryKey: ["/api/installments?page=1&limit=2000"],
  });

  const loans: Loan[] = loansData?.loans || [];
  const allInstallments: Installment[] = installmentsData?.installments || [];

  const getInstallments = (loanId: string) =>
    allInstallments.filter((i) => i.loanId === loanId).sort((a, b) => a.installmentNumber - b.installmentNumber);

  const customerName = loanIdParam && loans.length > 0
    ? (loans.find((l) => l.id === loanIdParam) as any)?.customerName || null
    : null;

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-primary-foreground no-default-hover-elevate"
              onClick={() => navigate("/mobile/customers")}
              data-testid="button-back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full overflow-hidden border border-primary-foreground/30">
              <img src={lamenLogo} alt="Lamen" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight" data-testid="text-repayment-title">
                {customerName ? customerName : "Repayment Schedules"}
              </h1>
              <p className="text-[10px] text-primary-foreground/70">
                {loans.length} financing{loans.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {isOnline ? <Wifi className="h-4 w-4 text-primary-foreground/70" /> : <WifiOff className="h-4 w-4 text-yellow-300" />}
        </div>
      </header>

      <div className="flex-1 overflow-auto px-3 py-3 space-y-3">
        {roleLoading || officerLoading || loansLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))
        ) : loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No financing records found</p>
          </div>
        ) : (
          loans.map((loan) => {
            const installments = getInstallments(loan.id);
            const isExpanded = expandedLoan === loan.id;
            const paidCount = installments.filter((i) => i.isPaid).length;
            const totalCount = installments.length;
            const progress = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;

            return (
              <Card key={loan.id} data-testid={`card-loan-${loan.id}`}>
                <CardContent className="p-0">
                  <button
                    className="w-full p-3 text-left"
                    onClick={() => setExpandedLoan(isExpanded ? null : loan.id)}
                    data-testid={`button-expand-loan-${loan.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold" data-testid={`text-loan-id-${loan.id}`}>
                            {loan.applicationId || loan.id.slice(0, 8)}
                          </span>
                          <Badge variant={statusColor(loan.status)} className="text-[10px]">
                            {loan.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{loan.productName || "Financing"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" data-testid={`text-loan-amount-${loan.id}`}>
                          {formatCurrency(loan.principleAmount || loan.requestAmount)} AFN
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          OLB: {formatCurrency(loan.outstandingPortfolio)} AFN
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{paidCount}/{totalCount}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t px-3 pb-3">
                      <div className="grid grid-cols-3 gap-2 py-3">
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">Total</p>
                          <p className="text-xs font-semibold">{formatCurrency(loan.totalReceivable)} AFN</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">Collected</p>
                          <p className="text-xs font-semibold text-primary">{formatCurrency(loan.totalCollection)} AFN</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">Outstanding</p>
                          <p className="text-xs font-semibold text-orange-600">{formatCurrency(loan.outstandingPortfolio)} AFN</p>
                        </div>
                      </div>

                      {installmentsLoading ? (
                        <Skeleton className="h-20 w-full" />
                      ) : installments.length === 0 ? (
                        <p className="text-xs text-center text-muted-foreground py-3">No installments generated</p>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="grid grid-cols-[2rem_1fr_1fr_1fr_auto] gap-1 text-[10px] font-medium text-muted-foreground px-1 pb-1">
                            <span>#</span>
                            <span>Due Date</span>
                            <span className="text-right">Amount</span>
                            <span className="text-right">Late</span>
                            <span className="text-center w-5">St</span>
                          </div>
                          {installments.map((inst) => (
                            <div
                              key={inst.id}
                              className={`grid grid-cols-[2rem_1fr_1fr_1fr_auto] gap-1 items-center px-1 py-1.5 rounded text-xs ${
                                inst.isPaid ? "bg-muted/50" : "bg-background"
                              }`}
                              data-testid={`row-installment-${inst.id}`}
                            >
                              <span className="text-muted-foreground">{inst.installmentNumber}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {inst.dueDate ? new Date(inst.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : "-"}
                              </span>
                              <span className="text-right font-medium">{formatCurrency(inst.totalAmount)}</span>
                              <span className="text-right">
                                {inst.lateDays && inst.lateDays > 0 ? (
                                  <span className="text-destructive font-medium">{inst.lateDays}d</span>
                                ) : "-"}
                              </span>
                              <span className="w-5 flex justify-center">
                                {inst.isPaid ? (
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                ) : inst.lateDays && inst.lateDays > 0 ? (
                                  <AlertCircle className="h-4 w-4 text-destructive" />
                                ) : (
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
