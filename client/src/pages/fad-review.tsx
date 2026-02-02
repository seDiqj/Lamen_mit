import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileSearch, 
  Search,
  User,
  Calendar,
  DollarSign,
  Building2,
  FileText,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

type LoanWithDetails = {
  id: string;
  applicationId: string;
  status: string;
  requestedAmount: string;
  financingDurationMonths: number;
  applicationDate: string;
  purpose: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    customerNo: string;
  };
  branch: {
    id: string;
    name: string;
    code: string;
  };
  financeOfficer: {
    id: string;
    name: string;
  } | null;
  product: {
    id: string;
    name: string;
  } | null;
};

type FadReview = {
  id: string;
  loanId: string;
  reviewedById: string;
  reviewerName: string;
  status: string;
  comments: string;
  dataQualityScore: number;
  reviewedAt: string;
  createdAt: string;
};

export default function FadReviewPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<LoanWithDetails | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [comments, setComments] = useState("");
  const [dataQualityScore, setDataQualityScore] = useState(80);
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected">("approved");

  const { data: pendingLoans, isLoading } = useQuery<LoanWithDetails[]>({
    queryKey: ["/api/loans", "pending"],
    queryFn: async () => {
      const res = await fetch("/api/loans?status=pending");
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
  });

  const { data: reviewedLoans } = useQuery<LoanWithDetails[]>({
    queryKey: ["/api/loans", "data_quality_review"],
    queryFn: async () => {
      const res = await fetch("/api/loans?status=data_quality_review");
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: { loanId: string; status: string; comments: string; dataQualityScore: number }) => {
      const res = await apiRequest("POST", "/api/fad-reviews", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: `Loan application has been ${reviewAction === "approved" ? "forwarded for committee review" : "rejected"}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      setReviewDialogOpen(false);
      setSelectedLoan(null);
      setComments("");
      setDataQualityScore(80);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleReview = (loan: LoanWithDetails, action: "approved" | "rejected") => {
    setSelectedLoan(loan);
    setReviewAction(action);
    setReviewDialogOpen(true);
  };

  const handleViewDetails = (loan: LoanWithDetails) => {
    setSelectedLoan(loan);
    setViewDialogOpen(true);
  };

  const submitReview = () => {
    if (!selectedLoan) return;
    submitReviewMutation.mutate({
      loanId: selectedLoan.id,
      status: reviewAction,
      comments,
      dataQualityScore,
    });
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-AF", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
    }).format(num || 0);
  };

  const filteredLoans = pendingLoans?.filter((loan) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      loan.applicationId?.toLowerCase().includes(searchLower) ||
      loan.customer?.firstName?.toLowerCase().includes(searchLower) ||
      loan.customer?.lastName?.toLowerCase().includes(searchLower) ||
      loan.customer?.customerNo?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "secondary", label: "Pending Review" },
      data_quality_review: { variant: "default", label: "Passed FAD Review" },
      committee_review: { variant: "outline", label: "In Committee Review" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    const config = statusConfig[status] || { variant: "secondary" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileSearch className="h-7 w-7 text-amber-500" />
            FAD Data Quality Review
          </h1>
          <p className="text-muted-foreground mt-1">
            Review loan applications for data quality and completeness before committee approval
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            {filteredLoans?.length || 0} Pending
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            {reviewedLoans?.length || 0} Reviewed
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-500" />
            Pending Applications
          </CardTitle>
          <CardDescription>
            Applications awaiting data quality verification
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by application ID, customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-fad"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : filteredLoans && filteredLoans.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan) => (
                  <TableRow key={loan.id} data-testid={`row-loan-${loan.id}`}>
                    <TableCell className="font-mono font-medium">
                      {loan.applicationId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {loan.customer?.firstName} {loan.customer?.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {loan.customer?.customerNo}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {loan.branch?.name || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600">
                      {formatCurrency(loan.requestedAmount)}
                    </TableCell>
                    <TableCell>{loan.financingDurationMonths} months</TableCell>
                    <TableCell>
                      {loan.applicationDate
                        ? format(new Date(loan.applicationDate), "dd MMM yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(loan)}
                          data-testid={`button-view-${loan.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() => handleReview(loan, "approved")}
                          data-testid={`button-approve-${loan.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Pass
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReview(loan, "rejected")}
                          data-testid={`button-reject-${loan.id}`}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending applications for review</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {reviewAction === "approved" ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              {reviewAction === "approved" ? "Approve Application" : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approved"
                ? "This will forward the application to the committee for final approval."
                : "This will reject the application and notify the applicant."}
            </DialogDescription>
          </DialogHeader>

          {selectedLoan && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">{selectedLoan.applicationId}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedLoan.customer?.firstName} {selectedLoan.customer?.lastName}
                </div>
                <div className="text-sm font-medium text-emerald-600 mt-1">
                  {formatCurrency(selectedLoan.requestedAmount)}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataQualityScore">Data Quality Score (1-100)</Label>
                <Input
                  id="dataQualityScore"
                  type="number"
                  min={1}
                  max={100}
                  value={dataQualityScore}
                  onChange={(e) => setDataQualityScore(parseInt(e.target.value) || 0)}
                  data-testid="input-quality-score"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Review Comments</Label>
                <Textarea
                  id="comments"
                  placeholder="Add your review comments..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  data-testid="input-review-comments"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              data-testid="button-cancel-review"
            >
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              disabled={submitReviewMutation.isPending}
              className={
                reviewAction === "approved"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }
              data-testid="button-submit-review"
            >
              {submitReviewMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {reviewAction === "approved" ? "Pass to Committee" : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-500" />
              Application Details
            </DialogTitle>
          </DialogHeader>

          {selectedLoan && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Application ID</div>
                  <div className="font-mono font-medium">{selectedLoan.applicationId}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div>{getStatusBadge(selectedLoan.status)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Customer</div>
                  <div className="font-medium">
                    {selectedLoan.customer?.firstName} {selectedLoan.customer?.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedLoan.customer?.customerNo}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Branch</div>
                  <div className="font-medium">{selectedLoan.branch?.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Requested Amount</div>
                  <div className="font-medium text-emerald-600">
                    {formatCurrency(selectedLoan.requestedAmount)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Duration</div>
                  <div className="font-medium">{selectedLoan.financingDurationMonths} months</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Finance Officer</div>
                  <div className="font-medium">{selectedLoan.financeOfficer?.name || "-"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Product</div>
                  <div className="font-medium">{selectedLoan.product?.name || "-"}</div>
                </div>
                <div className="col-span-2 space-y-1">
                  <div className="text-xs text-muted-foreground">Purpose</div>
                  <div className="text-sm">{selectedLoan.purpose || "-"}</div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button asChild variant="outline">
                  <Link href={`/loan-details/${selectedLoan.id}`}>
                    View Full Details
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
