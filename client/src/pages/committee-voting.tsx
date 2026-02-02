import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Vote, 
  Search,
  User,
  Building2,
  FileText,
  Loader2,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  Timer
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

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

type CommitteeVote = {
  id: string;
  loanId: string;
  voterId: string;
  voterName: string;
  voterRole: string;
  vote: "pending" | "approved" | "rejected";
  comments: string;
  votedAt: string;
  createdAt: string;
};

type FadReview = {
  id: string;
  loanId: string;
  reviewerName: string;
  status: string;
  comments: string;
  dataQualityScore: number;
  reviewedAt: string;
};

type LoanApprovalInfo = {
  loan: LoanWithDetails;
  fadReview: FadReview | null;
  votes: CommitteeVote[];
  userVote: CommitteeVote | null;
};

const COMMITTEE_ROLES = ["cfo", "coo", "ceo", "sharia"];
const REQUIRED_APPROVALS = 3;

export default function CommitteeVotingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<LoanApprovalInfo | null>(null);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [comments, setComments] = useState("");
  const [voteAction, setVoteAction] = useState<"approved" | "rejected">("approved");

  const { data: pendingLoans, isLoading } = useQuery<LoanApprovalInfo[]>({
    queryKey: ["/api/committee/pending-loans"],
    queryFn: async () => {
      const res = await fetch("/api/committee/pending-loans");
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
  });

  const submitVoteMutation = useMutation({
    mutationFn: async (data: { loanId: string; vote: string; comments: string }) => {
      const res = await apiRequest("POST", "/api/committee/vote", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vote Submitted",
        description: `Your ${voteAction === "approved" ? "approval" : "rejection"} vote has been recorded.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/committee/pending-loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      setVoteDialogOpen(false);
      setSelectedLoan(null);
      setComments("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVote = (loanInfo: LoanApprovalInfo, action: "approved" | "rejected") => {
    setSelectedLoan(loanInfo);
    setVoteAction(action);
    setVoteDialogOpen(true);
  };

  const handleViewDetails = (loanInfo: LoanApprovalInfo) => {
    setSelectedLoan(loanInfo);
    setViewDialogOpen(true);
  };

  const submitVote = () => {
    if (!selectedLoan) return;
    submitVoteMutation.mutate({
      loanId: selectedLoan.loan.id,
      vote: voteAction,
      comments,
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

  const filteredLoans = pendingLoans?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.loan.applicationId?.toLowerCase().includes(searchLower) ||
      item.loan.customer?.firstName?.toLowerCase().includes(searchLower) ||
      item.loan.customer?.lastName?.toLowerCase().includes(searchLower) ||
      item.loan.customer?.customerNo?.toLowerCase().includes(searchLower)
    );
  });

  const getVoteStats = (votes: CommitteeVote[]) => {
    const approved = votes.filter((v) => v.vote === "approved").length;
    const rejected = votes.filter((v) => v.vote === "rejected").length;
    const pending = votes.filter((v) => v.vote === "pending").length;
    const total = COMMITTEE_ROLES.length;
    return { approved, rejected, pending, total };
  };

  const getVoteBadge = (vote: "pending" | "approved" | "rejected") => {
    switch (vote) {
      case "approved":
        return <Badge className="bg-emerald-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      cfo: "CFO",
      coo: "COO",
      ceo: "CEO",
      sharia: "Sharia Advisor",
    };
    return labels[role] || role.toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Vote className="h-7 w-7 text-amber-500" />
            Committee Voting
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and vote on loan applications for final approval
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            {filteredLoans?.length || 0} Awaiting Votes
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
                <div className="text-2xl font-bold">{filteredLoans?.length || 0}</div>
              </div>
              <Timer className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Committee Size</div>
                <div className="text-2xl font-bold">{COMMITTEE_ROLES.length}</div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Required Approvals</div>
                <div className="text-2xl font-bold">{REQUIRED_APPROVALS}</div>
              </div>
              <ThumbsUp className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Your Role</div>
                <div className="text-lg font-bold">{user?.firstName || "Member"}</div>
              </div>
              <User className="h-8 w-8 text-violet-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-500" />
            Applications Awaiting Committee Decision
          </CardTitle>
          <CardDescription>
            Applications that have passed FAD review and require committee approval
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by application ID, customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-committee"
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
                  <TableHead>Application</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>FAD Score</TableHead>
                  <TableHead>Voting Progress</TableHead>
                  <TableHead>Your Vote</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((item) => {
                  const stats = getVoteStats(item.votes);
                  const progressPercent = ((stats.approved + stats.rejected) / stats.total) * 100;
                  
                  return (
                    <TableRow key={item.loan.id} data-testid={`row-loan-${item.loan.id}`}>
                      <TableCell>
                        <div className="font-mono font-medium">{item.loan.applicationId}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.loan.branch?.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {item.loan.customer?.firstName} {item.loan.customer?.lastName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-emerald-600">
                        {formatCurrency(item.loan.requestedAmount)}
                      </TableCell>
                      <TableCell>
                        {item.fadReview ? (
                          <Badge variant="outline" className="font-mono">
                            {item.fadReview.dataQualityScore}/100
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-emerald-600">{stats.approved} Yes</span>
                            <span className="text-red-600">{stats.rejected} No</span>
                            <span className="text-muted-foreground">{stats.pending} Pending</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.userVote ? getVoteBadge(item.userVote.vote) : (
                          <Badge variant="secondary">Not Voted</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(item)}
                            data-testid={`button-view-${item.loan.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!item.userVote && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleVote(item, "approved")}
                                data-testid={`button-approve-${item.loan.id}`}
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleVote(item, "rejected")}
                                data-testid={`button-reject-${item.loan.id}`}
                              >
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No applications awaiting committee decision</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={voteDialogOpen} onOpenChange={setVoteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {voteAction === "approved" ? (
                <ThumbsUp className="h-5 w-5 text-emerald-500" />
              ) : (
                <ThumbsDown className="h-5 w-5 text-red-500" />
              )}
              Submit Your Vote
            </DialogTitle>
            <DialogDescription>
              {voteAction === "approved"
                ? "Vote to approve this loan application."
                : "Vote to reject this loan application."}
            </DialogDescription>
          </DialogHeader>

          {selectedLoan && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">{selectedLoan.loan.applicationId}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedLoan.loan.customer?.firstName} {selectedLoan.loan.customer?.lastName}
                </div>
                <div className="text-sm font-medium text-emerald-600 mt-1">
                  {formatCurrency(selectedLoan.loan.requestedAmount)}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voteComments">Comments (Optional)</Label>
                <Textarea
                  id="voteComments"
                  placeholder="Add your comments or reasoning..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  data-testid="input-vote-comments"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVoteDialogOpen(false)}
              data-testid="button-cancel-vote"
            >
              Cancel
            </Button>
            <Button
              onClick={submitVote}
              disabled={submitVoteMutation.isPending}
              className={
                voteAction === "approved"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }
              data-testid="button-submit-vote"
            >
              {submitVoteMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {voteAction === "approved" ? "Vote to Approve" : "Vote to Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-500" />
              Application & Voting Details
            </DialogTitle>
          </DialogHeader>

          {selectedLoan && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Application ID</div>
                  <div className="font-mono font-medium">{selectedLoan.loan.applicationId}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Requested Amount</div>
                  <div className="font-medium text-emerald-600">
                    {formatCurrency(selectedLoan.loan.requestedAmount)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Customer</div>
                  <div className="font-medium">
                    {selectedLoan.loan.customer?.firstName} {selectedLoan.loan.customer?.lastName}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Branch</div>
                  <div className="font-medium">{selectedLoan.loan.branch?.name}</div>
                </div>
              </div>

              {selectedLoan.fadReview && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      FAD Review Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Reviewer</div>
                        <div className="font-medium">{selectedLoan.fadReview.reviewerName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Data Quality Score</div>
                        <Badge variant="outline" className="font-mono">
                          {selectedLoan.fadReview.dataQualityScore}/100
                        </Badge>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Reviewed At</div>
                        <div className="text-sm">
                          {selectedLoan.fadReview.reviewedAt
                            ? format(new Date(selectedLoan.fadReview.reviewedAt), "dd-MMM-yyyy HH:mm")
                            : "-"}
                        </div>
                      </div>
                    </div>
                    {selectedLoan.fadReview.comments && (
                      <div className="mt-3">
                        <div className="text-xs text-muted-foreground">Comments</div>
                        <div className="text-sm mt-1">{selectedLoan.fadReview.comments}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Vote className="h-4 w-4 text-amber-500" />
                    Committee Votes
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead>Vote</TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {COMMITTEE_ROLES.map((role) => {
                        const vote = selectedLoan.votes.find((v) => v.voterRole === role);
                        return (
                          <TableRow key={role}>
                            <TableCell className="font-medium">{getRoleLabel(role)}</TableCell>
                            <TableCell>{vote?.voterName || "-"}</TableCell>
                            <TableCell>
                              {vote ? getVoteBadge(vote.vote) : <Badge variant="secondary">Pending</Badge>}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {vote?.comments || "-"}
                            </TableCell>
                            <TableCell>
                              {vote?.votedAt
                                ? format(new Date(vote.votedAt), "dd-MMM-yyyy")
                                : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button asChild variant="outline">
                  <Link href={`/loan-details/${selectedLoan.loan.id}`}>
                    View Full Application
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
