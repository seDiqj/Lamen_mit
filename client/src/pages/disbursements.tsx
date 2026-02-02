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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  Eye,
  PiggyBank,
  Calendar,
  Download,
} from "lucide-react";
import { Link } from "wouter";
import type { Loan } from "@shared/schema";

type ApprovedLoan = Loan & {
  customerName?: string;
  branchName?: string;
  approvedAmount?: string;
  approvedDate?: string;
};

export default function DisbursementsPage() {
  const [search, setSearch] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<ApprovedLoan | null>(null);
  const [showDisburseDialog, setShowDisburseDialog] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: loans, isLoading } = useQuery<ApprovedLoan[]>({
    queryKey: ["/api/loans/approved", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const url = params.toString() ? `/api/loans/approved?${params.toString()}` : "/api/loans/approved";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch approved loans");
      return res.json();
    },
  });

  const disburseMutation = useMutation({
    mutationFn: async (loanId: string) => {
      return apiRequest("POST", `/api/loans/${loanId}/disburse`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans/approved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Financing Disbursed",
        description: "The financing has been disbursed successfully.",
      });
      setShowDisburseDialog(false);
      setSelectedLoan(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to disburse loan. Please try again.",
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

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    const day = d.getDate().toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-disbursements-title">Disbursements</h1>
          <p className="text-muted-foreground">
            Manage loan disbursements for approved applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {loans?.length || 0} ready to disburse
          </Badge>
          <Button variant="outline" data-testid="button-export-disbursements">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search approved loans..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-disbursements"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Approved Amount</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Approved Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                ) : loans && loans.length > 0 ? (
                  loans.map((loan) => (
                    <TableRow key={loan.id} data-testid={`row-disbursement-${loan.id}`}>
                      <TableCell className="font-mono text-sm">
                        {loan.applicationId || "-"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {loan.customerName || "-"}
                      </TableCell>
                      <TableCell>{loan.branchName || "-"}</TableCell>
                      <TableCell>{loan.productName || "-"}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(loan.approvedAmount || loan.requestAmount)}
                      </TableCell>
                      <TableCell>
                        {loan.financingDurationMonths ? `${loan.financingDurationMonths}m` : "-"}
                      </TableCell>
                      <TableCell>{formatDate(loan.approvedDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/loans/${loan.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedLoan(loan);
                              setShowDisburseDialog(true);
                            }}
                            data-testid={`button-disburse-${loan.id}`}
                          >
                            <PiggyBank className="mr-1 h-3 w-3" />
                            Disburse
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <PiggyBank className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No approved loans ready for disbursement</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDisburseDialog} onOpenChange={setShowDisburseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Disbursement</DialogTitle>
            <DialogDescription>
              Disburse funds for loan application {selectedLoan?.applicationId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Customer:</span>
                <p className="font-medium">{selectedLoan?.customerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Branch:</span>
                <p className="font-medium">{selectedLoan?.branchName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Product:</span>
                <p className="font-medium">{selectedLoan?.productName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p className="font-medium">{selectedLoan?.financingDurationMonths} months</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Disbursement Amount</span>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(selectedLoan?.approvedAmount || selectedLoan?.requestAmount || 0)}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisburseDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedLoan && disburseMutation.mutate(selectedLoan.id)}
              disabled={disburseMutation.isPending}
              data-testid="button-confirm-disburse"
            >
              {disburseMutation.isPending ? "Processing..." : "Confirm Disbursement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
