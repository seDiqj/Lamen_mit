import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  Loader2,
  Shield,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";

type LoanWithFadReview = {
  loan: {
    id: string;
    applicationId: string;
    status: string;
    requestAmount: string;
    principleAmount: string;
    financingDurationMonths: number;
    productName: string;
    createdAt: string;
    customerName?: string;
    branchName?: string;
  };
  fadReview: {
    id: string;
    status: string;
    dataQualityScore: number;
    comments: string;
    reviewerName: string;
    reviewedAt: string;
  } | null;
};

export default function RiskCompliancePage() {
  const [search, setSearch] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<LoanWithFadReview | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [riskScore, setRiskScore] = useState(80);
  const [comments, setComments] = useState("");
  const { toast } = useToast();

  const { data: pendingLoans = [], isLoading } = useQuery<LoanWithFadReview[]>({
    queryKey: ["/api/risk-compliance/pending-loans"],
  });

  const submitReviewMutation = useMutation({
    mutationFn: async ({ loanId, status, comments, riskScore }: { loanId: string; status: string; comments: string; riskScore: number }) => {
      return apiRequest("POST", "/api/risk-compliance-reviews", { loanId, status, comments, riskScore });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/risk-compliance/pending-loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      toast({
        title: variables.status === "approved" ? "Approved" : "Rejected",
        description: variables.status === "approved" 
          ? "Application passed to Committee for voting." 
          : "Application has been rejected.",
      });
      setShowReviewDialog(false);
      setSelectedLoan(null);
      setComments("");
      setRiskScore(80);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOpenReview = (item: LoanWithFadReview) => {
    setSelectedLoan(item);
    setShowReviewDialog(true);
  };

  const handleSubmitReview = (status: "approved" | "rejected") => {
    if (!selectedLoan) return;
    submitReviewMutation.mutate({
      loanId: selectedLoan.loan.id,
      status,
      comments,
      riskScore,
    });
  };

  const filteredLoans = pendingLoans.filter((item) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      item.loan.applicationId?.toLowerCase().includes(searchLower) ||
      item.loan.customerName?.toLowerCase().includes(searchLower) ||
      item.loan.branchName?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate().toString().padStart(2, "0")}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-7 w-7 text-red-500" />
            Risk Compliance Review
          </h1>
          <p className="text-muted-foreground mt-1">
            Review loan applications passed by FAD for risk assessment before Committee voting
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {filteredLoans.length} Pending
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, customer, or branch..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-9"
                data-testid="input-search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLoans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No applications pending Risk Compliance review</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>FAD Score</TableHead>
                  <TableHead>FAD Reviewer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((item) => (
                  <TableRow key={item.loan.id} data-testid={`row-loan-${item.loan.id}`}>
                    <TableCell className="font-mono font-medium">{item.loan.applicationId}</TableCell>
                    <TableCell>{item.loan.customerName || "-"}</TableCell>
                    <TableCell>{item.loan.branchName || "-"}</TableCell>
                    <TableCell>{item.loan.productName || "-"}</TableCell>
                    <TableCell className="text-right font-medium text-emerald-600">
                      {formatCurrency(parseFloat(item.loan.requestAmount || "0"))}
                    </TableCell>
                    <TableCell>{item.loan.financingDurationMonths} months</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.fadReview?.dataQualityScore || 0}/100
                      </Badge>
                    </TableCell>
                    <TableCell>{item.fadReview?.reviewerName || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/loans/${item.loan.id}`}>
                          <Button variant="ghost" size="sm" data-testid={`button-view-${item.loan.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => handleOpenReview(item)}
                          data-testid={`button-review-${item.loan.id}`}
                        >
                          Review
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Risk Compliance Review
            </DialogTitle>
            <DialogDescription>
              Review application {selectedLoan?.loan.applicationId} for risk compliance
            </DialogDescription>
          </DialogHeader>

          {selectedLoan && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-3">Application Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Application ID:</span>
                      <span className="font-mono font-medium">{selectedLoan.loan.applicationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer:</span>
                      <span className="font-medium">{selectedLoan.loan.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium text-emerald-600">
                        {formatCurrency(parseFloat(selectedLoan.loan.requestAmount || "0"))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{selectedLoan.loan.financingDurationMonths} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Product:</span>
                      <span className="font-medium">{selectedLoan.loan.productName || "-"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">FAD Review Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Quality Score:</span>
                      <Badge variant="outline" className="bg-white">
                        {selectedLoan.fadReview?.dataQualityScore || 0}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reviewer:</span>
                      <span className="font-medium">{selectedLoan.fadReview?.reviewerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{formatDate(selectedLoan.fadReview?.reviewedAt || "")}</span>
                    </div>
                    {selectedLoan.fadReview?.comments && (
                      <div className="mt-2 pt-2 border-t">
                        <span className="text-muted-foreground text-xs">FAD Comments:</span>
                        <p className="text-xs mt-1">{selectedLoan.fadReview.comments}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="riskScore">Risk Score (1-100)</Label>
                  <Input
                    id="riskScore"
                    type="number"
                    min={1}
                    max={100}
                    value={riskScore}
                    onChange={(e) => setRiskScore(parseInt(e.target.value) || 0)}
                    data-testid="input-risk-score"
                  />
                  <p className="text-xs text-muted-foreground">Rate the overall risk level of this application</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Review Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Add your risk assessment comments and recommendations..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    data-testid="input-review-comments"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => handleSubmitReview("rejected")}
              disabled={submitReviewMutation.isPending}
              className="text-red-600 border-red-200 hover:bg-red-50"
              data-testid="button-reject"
            >
              {submitReviewMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => handleSubmitReview("approved")}
              disabled={submitReviewMutation.isPending}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
              data-testid="button-pass-committee"
            >
              {submitReviewMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <CheckCircle className="h-4 w-4 mr-2" />
              Pass to Committee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
