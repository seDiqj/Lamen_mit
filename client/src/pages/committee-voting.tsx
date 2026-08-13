import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  CheckCircle, 
  XCircle, 
  Vote, 
  Search,
  User,
  Building2,
  FileText,
  Loader2,
  Users,
  ThumbsUp,
  ThumbsDown,
  Timer,
  Shield,
  ArrowLeft,
  ArrowRight,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  Camera,
  ExternalLink,
  FolderUp
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, cn, toPersianDate, calculateAge } from "@/lib/utils";
import type { FundingSource } from "@shared/schema";

type LoanWithDetails = {
  id: string;
  applicationId: string;
  status: string;
  requestedAmount: string;
  financingDurationMonths: number;
  applicationDate: string;
  purpose: string;
  productName?: string;
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

type RiskComplianceReview = {
  id: string;
  loanId: string;
  reviewerName: string;
  status: string;
  comments: string;
  riskScore: number;
  reviewedAt: string;
};

type LoanApprovalInfo = {
  loan: LoanWithDetails;
  fadReview: FadReview | null;
  riskComplianceReview: RiskComplianceReview | null;
  votes: CommitteeVote[];
  userVote: CommitteeVote | null;
};

const steps = [
  { id: 1, title: "Customer", icon: User, color: "from-violet-500 to-purple-500" },
  { id: 2, title: "Financing Details", icon: FileText, color: "from-blue-500 to-cyan-500" },
  { id: 3, title: "Business", icon: Building2, color: "from-emerald-500 to-green-500" },
  { id: 4, title: "Collateral", icon: Shield, color: "from-amber-500 to-orange-500" },
  { id: 5, title: "Guarantors", icon: Users, color: "from-pink-500 to-rose-500" },
  { id: 6, title: "Documents", icon: FolderUp, color: "from-purple-500 to-violet-500" },
  { id: 7, title: "Vote", icon: Vote, color: "from-purple-500 to-indigo-600" },
];

const COMMITTEE_ROLES = ["cfo", "coo", "ceo"];
const REQUIRED_APPROVALS = 3;

export default function CommitteeVotingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [comments, setComments] = useState("");
  const [selectedFundingSourceId, setSelectedFundingSourceId] = useState("");
  const [committeePrincipleAmount, setCommitteePrincipleAmount] = useState("");
  const [committeeMarginRate, setCommitteeMarginRate] = useState("");
  const [committeeGracePeriod, setCommitteeGracePeriod] = useState("");

  const { data: pendingLoans, isLoading } = useQuery<LoanApprovalInfo[]>({
    queryKey: ["/api/committee/pending-loans"],
    queryFn: async () => {
      const res = await fetch("/api/committee/pending-loans");
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
  });

  const { data: fundingSources = [] } = useQuery<FundingSource[]>({
    queryKey: ["/api/funding-sources"],
  });

  const selectedLoanInfo = pendingLoans?.find((l) => l.loan.id === selectedLoanId);

  const { data: loanDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["/api/loan-applications", selectedLoanId],
    queryFn: async () => {
      const res = await fetch(`/api/loan-applications/${selectedLoanId}`);
      if (!res.ok) throw new Error("Failed to fetch loan details");
      return res.json();
    },
    enabled: !!selectedLoanId,
  });

  useEffect(() => {
    if (loanDetails?.loan) {
      const reqAmt = loanDetails.loan.principleAmount || loanDetails.loan.requestAmount || "";
      setCommitteePrincipleAmount(String(reqAmt || ""));
      setCommitteeMarginRate(String(loanDetails.loan.marginRate || ""));
      setCommitteeGracePeriod(String(loanDetails.loan.gracePeriod ?? ""));
    }
  }, [loanDetails?.loan?.id]);

  const guarantors = (() => {
    const list: any[] = [];
    if (loanDetails?.financialGuarantor) list.push(loanDetails.financialGuarantor);
    if (loanDetails?.financialGuarantor2) list.push({ ...loanDetails.financialGuarantor2, guarantorType: "financial", _label: "Financial Guarantor 2" });
    if (loanDetails?.familyGuarantor) list.push(loanDetails.familyGuarantor);
    return list;
  })();

  const submitVoteMutation = useMutation({
    mutationFn: async (data: { loanId: string; vote: string; comments: string; fundingSourceId?: string; principleAmount?: string; marginRate?: string; gracePeriod?: string }) => {
      const res = await apiRequest("POST", "/api/committee/vote", data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Vote Submitted",
        description: `Your ${variables.vote === "approved" ? "approval" : "rejection"} vote has been recorded.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/committee/pending-loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      setSelectedLoanId(null);
      setCurrentStep(1);
      setComments("");
      setSelectedFundingSourceId("");
      setCommitteePrincipleAmount("");
      setCommitteeMarginRate("");
      setCommitteeGracePeriod("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBackToList = () => {
    setSelectedLoanId(null);
    setCurrentStep(1);
    setComments("");
    setCommitteePrincipleAmount("");
    setCommitteeMarginRate("");
    setCommitteeGracePeriod("");
  };

  const isCfo = ((user as any)?.role || "").toLowerCase() === "cfo";

  const handleVote = (vote: "approved" | "rejected") => {
    if (!selectedLoanId) return;
    if (vote === "approved") {
      if (!committeePrincipleAmount || Number(committeePrincipleAmount) <= 0) {
        toast({ title: "Validation Error", description: "Principle Amount is required for approval.", variant: "destructive" });
        return;
      }
      if (!committeeMarginRate || Number(committeeMarginRate) <= 0) {
        toast({ title: "Validation Error", description: "Margin Rate is required for approval.", variant: "destructive" });
        return;
      }
      if (committeeGracePeriod === "" || Number(committeeGracePeriod) < 0) {
        toast({ title: "Validation Error", description: "Grace Period is required for approval.", variant: "destructive" });
        return;
      }
    }
    const payload: { loanId: string; vote: string; comments: string; fundingSourceId?: string; principleAmount?: string; marginRate?: string; gracePeriod?: string } = {
      loanId: selectedLoanId,
      vote,
      comments,
    };
    if (isCfo && selectedFundingSourceId) {
      payload.fundingSourceId = selectedFundingSourceId;
    }
    if (committeePrincipleAmount) payload.principleAmount = committeePrincipleAmount;
    if (committeeMarginRate) payload.marginRate = committeeMarginRate;
    if (committeeGracePeriod !== "") payload.gracePeriod = committeeGracePeriod;
    submitVoteMutation.mutate(payload);
  };

  const goToStep = (stepId: number) => setCurrentStep(stepId);
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

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
    };
    return labels[role] || role.toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate().toString().padStart(2, "0")}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  const renderViewField = (label: string, value: any) => (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="h-9 px-3 py-2 bg-muted/50 rounded-md text-sm border">
        {value || "-"}
      </div>
    </div>
  );

  const renderDateViewField = (label: string, rawDate: string | null | undefined, formattedDate?: string) => {
    const persian = toPersianDate(rawDate);
    return (
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">{label} {persian && <span className="text-blue-500 text-xs font-normal ml-1">({persian})</span>}</Label>
        <div className="h-9 px-3 py-2 bg-muted/50 rounded-md text-sm border">
          {formattedDate || formatDate(rawDate || "") || "-"}
        </div>
      </div>
    );
  };

  const renderDobViewField = (label: string, rawDate: string | null | undefined) => {
    const persian = toPersianDate(rawDate);
    const age = calculateAge(rawDate || "");
    return (
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">{label} {persian && <span className="text-blue-500 text-xs font-normal ml-1">({persian})</span>}</Label>
        <div className="flex gap-2 items-center">
          <div className="h-9 px-3 py-2 bg-muted/50 rounded-md text-sm border flex-1">
            {formatDate(rawDate || "") || "-"}
          </div>
          {age !== null && (
            <div className="h-9 px-3 flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md text-sm font-medium whitespace-nowrap">
              Age: {age}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (selectedLoanId) {
    if (isLoadingDetails) {
      return (
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      );
    }

    const voteStats = selectedLoanInfo ? getVoteStats(selectedLoanInfo.votes) : { approved: 0, rejected: 0, pending: 0, total: 4 };
    const hasVoted = selectedLoanInfo?.userVote?.vote === "approved" || selectedLoanInfo?.userVote?.vote === "rejected";

    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackToList} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Committee Review: {loanDetails?.loan?.applicationId}
                </h1>
                <Badge variant="secondary">Awaiting Votes</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Review Mode - Cast your vote on this application
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              <button
                onClick={() => goToStep(step.id)}
                className={cn("flex flex-col items-center gap-2 group cursor-pointer transition-all flex-shrink-0", currentStep === step.id ? "scale-105" : "")}
                data-testid={`step-${step.id}`}
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all",
                  currentStep === step.id ? `bg-gradient-to-r ${step.color} text-white` : currentStep > step.id ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                )}>
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                </div>
                <span className={cn("text-xs font-medium hidden md:block", currentStep === step.id ? "text-foreground" : "text-muted-foreground")}>{step.title}</span>
              </button>
              {index < steps.length - 1 && <div className={cn("flex-1 h-1 mx-2 rounded-full transition-all min-w-4", currentStep > step.id ? "bg-green-500" : "bg-muted")} />}
            </div>
          ))}
        </div>

        <Card className="border-t-4 border-t-purple-500">
          <CardContent className="pt-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-violet-500" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {renderViewField("Customer No", loanDetails?.customer?.customerNo)}
                  {renderViewField("Full Name *", loanDetails?.customer?.firstName)}
                  {renderViewField("Father's Name", loanDetails?.customer?.fatherName)}
                  {renderViewField("Full Name (Dari)", loanDetails?.customer?.fullNameDari)}
                  {renderViewField("Father's Name (Dari)", loanDetails?.customer?.fatherNameDari)}
                  {renderViewField("Gender", loanDetails?.customer?.gender)}
                  {renderViewField("Marital Status", loanDetails?.customer?.maritalStatus)}
                  {renderViewField("National ID (NID)", loanDetails?.customer?.nationalId)}
                  {renderDateViewField("NID Expiry Date", loanDetails?.customer?.nidExpiryDate)}
                  {renderDobViewField("Date of Birth", loanDetails?.customer?.dateOfBirth)}
                  {renderViewField("Place of Birth", loanDetails?.customer?.placeOfBirth)}
                  {renderViewField("Home Address", loanDetails?.customer?.homeAddress)}
                  {renderViewField("Province", loanDetails?.customer?.province)}
                  {renderViewField("District", loanDetails?.customer?.district)}
                  {renderViewField("Urban / Rural", loanDetails?.customer?.areaType || "Rural")}
                  {renderViewField("Phone Number", loanDetails?.customer?.phoneNumber)}
                  {renderViewField("2nd Phone Number", loanDetails?.customer?.secondPhoneNumber)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {renderViewField("No. of Dependents", loanDetails?.customer?.numberOfDependents)}
                  {renderViewField("Direct Male Employee", loanDetails?.customer?.directMaleDependent)}
                  {renderViewField("Direct Female Employee", loanDetails?.customer?.directFemaleDependent)}
                  {renderViewField("Indirect Male Employee", loanDetails?.customer?.indirectMaleDependent)}
                  {renderViewField("Indirect Female Employee", loanDetails?.customer?.indirectFemaleDependent)}
                </div>

                {/* Customer Photo Section */}
                <div className="border-t pt-3 mt-4">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-3">Customer Photo</h3>
                  <div className="space-y-2">
                    <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                      {loanDetails?.customer?.photoUrl ? (
                        <img src={loanDetails.customer.photoUrl} alt="Customer" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Financing Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {renderViewField("Branch", loanDetails?.loan?.branchName)}
                  {renderViewField("Finance Officer", loanDetails?.loan?.financeOfficerName)}
                  {renderViewField("Product Name", loanDetails?.loan?.productName)}
                  {renderViewField("Product Code", loanDetails?.loan?.productCode)}
                  {renderViewField("Sector", loanDetails?.loan?.sector)}
                  {renderViewField("Business Type", loanDetails?.loan?.businessDescription)}
                  {renderViewField("Financing Purpose", loanDetails?.loan?.financingPurpose)}
                  {renderDateViewField("Request Date", loanDetails?.loan?.requestDate)}
                  {renderViewField("Request Amount", formatCurrency(parseFloat(loanDetails?.loan?.requestAmount || "0")))}
                  {renderViewField("Principal Amount", formatCurrency(parseFloat(loanDetails?.loan?.principleAmount || "0")))}
                  {renderViewField("Duration (Months)", loanDetails?.loan?.financingDurationMonths)}
                  {renderViewField("Grace Period", loanDetails?.loan?.gracePeriod)}
                  {renderViewField("No. of Installments", loanDetails?.loan?.numberOfInstallments)}
                  {renderViewField("Margin Rate %", loanDetails?.loan?.marginRate)}
                  {renderViewField("Funding Source", loanDetails?.fundingSource?.name || "N/A")}
                </div>

                {(() => {
                  const reqAmount = parseFloat(loanDetails?.loan?.requestAmount || "0");
                  const principleAmt = parseFloat(loanDetails?.loan?.principleAmount || "0");
                  const loanAmount = reqAmount > 0 ? reqAmount : principleAmt;
                  let margin = parseFloat(loanDetails?.loan?.marginRate || "0");
                  if (margin > 0 && margin < 1) margin = margin * 100;
                  const durationMonths = Number(loanDetails?.loan?.financingDurationMonths) || 0;
                  const installments = Number(loanDetails?.loan?.numberOfInstallments) || 0;
                  if (loanAmount > 0 && margin > 0 && durationMonths > 0) {
                    const totalMargin = (loanAmount * (margin / 100) / 12) * durationMonths;
                    const totalRepayment = loanAmount + totalMargin;
                    const monthlyInstallment = installments > 0 ? totalRepayment / installments : totalRepayment / durationMonths;
                    return (
                      <div className="mt-4 p-3 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                        <h4 className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2">Financing Summary</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Total Margin</p>
                            <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-cv-total-margin">
                              {totalMargin.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Repayment</p>
                            <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-cv-total-repayment">
                              {totalRepayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Monthly Installment</p>
                            <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-cv-monthly-installment">
                              {monthlyInstallment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                            </p>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Formula: (Loan Amount x Margin% / 12) x Duration(months)</p>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                  Business Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {renderViewField("Business Name", loanDetails?.business?.businessName)}
                  {renderViewField("Sector", loanDetails?.business?.sector)}
                  {renderViewField("Business Type", loanDetails?.business?.businessType)}
                  {renderViewField("Province", loanDetails?.business?.province)}
                  {renderViewField("District", loanDetails?.business?.district)}
                  {renderViewField("Village", loanDetails?.business?.village)}
                  {renderViewField("Detailed Address", loanDetails?.business?.detailedAddress)}
                  {renderViewField("Years of Experience", loanDetails?.business?.yearsOfExperience)}
                  {renderViewField("Monthly Income (AFN)", loanDetails?.business?.monthlyIncomeAmount ? `AFN ${Number(loanDetails.business.monthlyIncomeAmount).toLocaleString()}` : null)}
                </div>
                {loanDetails?.license && (
                  <>
                    <h4 className="text-md font-semibold mt-6">Business License</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {renderViewField("Type of License", loanDetails?.license?.licenseType)}
                      {renderViewField("License Number", loanDetails?.license?.licenseNumber)}
                      {renderViewField("President", loanDetails?.license?.president)}
                      {renderDateViewField("Register Date", loanDetails?.license?.registerDate)}
                      {renderDateViewField("Expiry Date", loanDetails?.license?.expiryDate)}
                    </div>
                  </>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-500" />
                  Collateral Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {renderViewField("Owner Name", loanDetails?.collateral?.ownerName)}
                  {renderViewField("Owner National ID", loanDetails?.collateral?.ownerNationalId)}
                  {renderDateViewField("Owner NID Expiry", loanDetails?.collateral?.ownerNidExpiryDate)}
                  {renderViewField("Collateral Type", loanDetails?.collateral?.collateralType)}
                  {renderViewField("Title Deed Number", loanDetails?.collateral?.titleDeedNumber)}
                  {renderViewField("Province", loanDetails?.collateral?.province)}
                  {renderViewField("District", loanDetails?.collateral?.district)}
                  {renderViewField("Village", loanDetails?.collateral?.village)}
                  {renderViewField("Address", loanDetails?.collateral?.address)}
                  {renderViewField("Purchased Price", formatCurrency(parseFloat(loanDetails?.collateral?.purchasedPrice || "0")))}
                  {renderViewField("Market Price", formatCurrency(parseFloat(loanDetails?.collateral?.marketPrice || "0")))}
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-pink-500" />
                  Guarantors
                </h3>
                {guarantors.length === 0 ? (
                  <p className="text-muted-foreground">No guarantors registered for this loan.</p>
                ) : (
                  <div className="space-y-4">
                    {guarantors.map((g: any, index: number) => (
                      <Card key={g.id} className="bg-muted/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            {g._label ? g._label : g.guarantorType === "financial" ? "Financial Guarantor" : "Family Guarantor"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {renderViewField("Full Name", g.fullName)}
                            {renderViewField("Father Name", g.fatherName)}
                            {renderDobViewField("Date of Birth", g.dateOfBirth)}
                            {renderViewField("National ID", g.nationalId)}
                            {renderDateViewField("NID Expiry Date", g.nidExpiryDate)}
                            {renderViewField("Phone", g.phoneNumber)}
                            {renderViewField("Relationship", g.relationshipWithCustomer)}
                            {renderViewField("Home Address", g.homeAddress)}
                            {renderViewField("District", g.district)}
                            {renderViewField("Business", g.business)}
                            {renderViewField("Business Address", g.businessAddress)}
                            {g.guarantorType === "financial" && renderViewField("Monthly Income", g.monthlyIncome ? `AFN ${Number(g.monthlyIncome).toLocaleString()}` : null)}
                            {g.guarantorType === "financial" && renderViewField("Inventory", g.inventory)}
                            {g.guarantorType === "financial" && renderViewField("Years of Experience", g.yearsOfExperience)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FolderUp className="h-5 w-5 text-purple-500" />
                  Documents
                  {loanDetails?.customerDocuments && loanDetails.customerDocuments.length > 0 && (
                    <Badge variant="secondary">{(loanDetails.customerDocuments as any[]).length} uploaded</Badge>
                  )}
                </h3>
                {loanDetails?.customerDocuments && loanDetails.customerDocuments.length > 0 ? (
                  <div className="space-y-1">
                    {(loanDetails.customerDocuments as any[]).map((doc: any) => (
                      <div key={doc.id} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-md" data-testid={`doc-item-${doc.id}`}>
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="flex-1 truncate">{doc.fileName || doc.documentType || 'Document'}</span>
                        <Badge variant="secondary" className="text-xs">{doc.documentType}</Badge>
                        {doc.fileUrl && (
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderUp className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No documents uploaded</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Vote className="h-5 w-5 text-purple-500" />
                  Committee Voting & Decision
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-3">Application Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application ID:</span>
                        <span className="font-mono font-medium">{loanDetails?.loan?.applicationId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Customer:</span>
                        <span className="font-medium">{loanDetails?.customer?.firstName} {loanDetails?.customer?.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium text-emerald-600">
                          {formatCurrency(parseFloat(loanDetails?.loan?.principleAmount || loanDetails?.loan?.requestAmount || "0"))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{loanDetails?.loan?.financingDurationMonths} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Product:</span>
                        <span className="font-medium">{loanDetails?.loan?.productName || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Margin Amount:</span>
                        <span className="font-medium text-emerald-600">
                          {(() => {
                            const amt = parseFloat(loanDetails?.loan?.principleAmount || loanDetails?.loan?.requestAmount || "0");
                            let margin = parseFloat(loanDetails?.loan?.marginRate || "0");
                            if (margin > 0 && margin < 1) margin = margin * 100;
                            const dur = Number(loanDetails?.loan?.financingDurationMonths) || 0;
                            if (amt > 0 && margin > 0 && dur > 0) {
                              const totalMargin = (amt * (margin / 100) / 12) * dur;
                              return `${totalMargin.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN`;
                            }
                            return "—";
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Installment:</span>
                        <span className="font-medium text-blue-600">
                          {(() => {
                            const amt = parseFloat(loanDetails?.loan?.principleAmount || loanDetails?.loan?.requestAmount || "0");
                            let margin = parseFloat(loanDetails?.loan?.marginRate || "0");
                            if (margin > 0 && margin < 1) margin = margin * 100;
                            const dur = Number(loanDetails?.loan?.financingDurationMonths) || 0;
                            const inst = Number(loanDetails?.loan?.numberOfInstallments) || 0;
                            if (amt > 0 && margin > 0 && dur > 0) {
                              const totalMargin = (amt * (margin / 100) / 12) * dur;
                              const totalRepayment = amt + totalMargin;
                              const monthly = inst > 0 ? totalRepayment / inst : totalRepayment / dur;
                              return `${monthly.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN`;
                            }
                            return "—";
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">FAD Review</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data Quality Score:</span>
                        <Badge variant="outline" className="bg-white">
                          {selectedLoanInfo?.fadReview?.dataQualityScore || 0}/100
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reviewer:</span>
                        <span className="font-medium">{selectedLoanInfo?.fadReview?.reviewerName || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{formatDate(selectedLoanInfo?.fadReview?.reviewedAt || "")}</span>
                      </div>
                      {selectedLoanInfo?.fadReview?.comments && (
                        <div className="pt-2 mt-2 border-t border-blue-200 dark:border-blue-800">
                          <span className="text-muted-foreground block mb-1">Comments:</span>
                          <p className="text-sm whitespace-pre-wrap bg-white dark:bg-gray-900 rounded p-2 border border-blue-200 dark:border-blue-800" data-testid="text-fad-comments">
                            {selectedLoanInfo.fadReview.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <h4 className="font-semibold mb-3 text-red-700 dark:text-red-300">Risk Compliance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk Score:</span>
                        <Badge variant="outline" className="bg-white">
                          {selectedLoanInfo?.riskComplianceReview?.riskScore || 0}/100
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reviewer:</span>
                        <span className="font-medium">{selectedLoanInfo?.riskComplianceReview?.reviewerName || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{formatDate(selectedLoanInfo?.riskComplianceReview?.reviewedAt || "")}</span>
                      </div>
                      {selectedLoanInfo?.riskComplianceReview?.comments && (
                        <div className="pt-2 mt-2 border-t border-red-200 dark:border-red-800">
                          <span className="text-muted-foreground block mb-1">Comments:</span>
                          <p className="text-sm whitespace-pre-wrap bg-white dark:bg-gray-900 rounded p-2 border border-red-200 dark:border-red-800" data-testid="text-risk-comments">
                            {selectedLoanInfo.riskComplianceReview.comments}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <h4 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">Voting Progress</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Approvals: {voteStats.approved}/{voteStats.total}</span>
                      <span>Required: {REQUIRED_APPROVALS}</span>
                    </div>
                    <Progress value={(voteStats.approved / voteStats.total) * 100} className="h-2" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {selectedLoanInfo?.votes.map((vote) => (
                        <div key={vote.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                          <span className="text-xs font-medium">{getRoleLabel(vote.voterRole)}</span>
                          {getVoteBadge(vote.vote)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {!hasVoted && (
                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg space-y-3">
                      <h4 className="font-semibold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Committee Financial Terms (Required for Approval)
                      </h4>
                      <p className="text-xs text-muted-foreground">Set the approved principle amount, margin rate, and grace period for this financing application.</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="committee-principle">Principle Amount (AFN) <span className="text-red-500">*</span></Label>
                          <Input
                            id="committee-principle"
                            type="number"
                            placeholder="Enter principle amount"
                            value={committeePrincipleAmount}
                            onChange={(e) => setCommitteePrincipleAmount(e.target.value)}
                            data-testid="input-committee-principle"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="committee-margin">Margin Rate (%) <span className="text-red-500">*</span></Label>
                          <Input
                            id="committee-margin"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 15"
                            value={committeeMarginRate}
                            onChange={(e) => setCommitteeMarginRate(e.target.value)}
                            data-testid="input-committee-margin"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="committee-grace">Grace Period (months) <span className="text-red-500">*</span></Label>
                          <Input
                            id="committee-grace"
                            type="number"
                            placeholder="0"
                            value={committeeGracePeriod}
                            onChange={(e) => setCommitteeGracePeriod(e.target.value)}
                            data-testid="input-committee-grace"
                          />
                        </div>
                      </div>
                      {committeePrincipleAmount && committeeMarginRate && Number(committeePrincipleAmount) > 0 && Number(committeeMarginRate) > 0 && (() => {
                        const amt = Number(committeePrincipleAmount);
                        let margin = Number(committeeMarginRate);
                        if (margin > 0 && margin < 1) margin = margin * 100;
                        const dur = Number(loanDetails?.loan?.financingDurationMonths) || 0;
                        const inst = Number(loanDetails?.loan?.numberOfInstallments) || dur;
                        if (amt > 0 && margin > 0 && dur > 0) {
                          const totalMargin = (amt * (margin / 100) / 12) * dur;
                          const totalRepayment = amt + totalMargin;
                          const monthly = inst > 0 ? totalRepayment / inst : totalRepayment / dur;
                          return (
                            <div className="mt-2 p-3 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                              <h4 className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2">Financing Summary</h4>
                              <div className="grid grid-cols-3 gap-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">Total Margin</p>
                                  <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-committee-total-margin">
                                    {totalMargin.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Total Repayment</p>
                                  <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-committee-total-repayment">
                                    {totalRepayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Monthly Installment</p>
                                  <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-committee-monthly">
                                    {monthly.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    {isCfo && (
                      <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg space-y-3">
                        <h4 className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Funding Source Selection (CFO)
                        </h4>
                        <p className="text-xs text-muted-foreground">As the CFO, please select the funding source for this financing application.</p>
                        <div className="max-w-sm">
                          <Label htmlFor="funding-source">Funding Source</Label>
                          <Select value={selectedFundingSourceId} onValueChange={setSelectedFundingSourceId}>
                            <SelectTrigger data-testid="select-funding-source">
                              <SelectValue placeholder="Select funding source" />
                            </SelectTrigger>
                            <SelectContent>
                              {fundingSources.map((fs) => (
                                <SelectItem key={fs.id} value={fs.id}>{fs.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="comments">Your Comments</Label>
                      <Textarea
                        id="comments"
                        placeholder="Add your comments for this vote..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={4}
                        data-testid="input-vote-comments"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleVote("rejected")}
                        disabled={submitVoteMutation.isPending}
                        className="min-w-40 text-red-600 border-red-200 hover:bg-red-50"
                        data-testid="button-vote-reject"
                      >
                        {submitVoteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Vote Reject
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => handleVote("approved")}
                        disabled={submitVoteMutation.isPending}
                        className="min-w-40 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                        data-testid="button-vote-approve"
                      >
                        {submitVoteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Vote Approve
                      </Button>
                    </div>
                  </div>
                )}

                {hasVoted && (
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-700 dark:text-green-300">You have already voted on this application</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your vote: {getVoteBadge(selectedLoanInfo?.userVote?.vote || "pending")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} data-testid="button-previous">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {currentStep < 7 && (
            <Button onClick={nextStep} data-testid="button-next">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Vote className="h-7 w-7 text-purple-500" />
            Committee Voting
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and vote on loan applications for final approval
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {filteredLoans?.length || 0} Awaiting Votes
        </Badge>
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
                <div className="text-sm text-muted-foreground">Required Approvals</div>
                <div className="text-2xl font-bold">{REQUIRED_APPROVALS}</div>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-500" />
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
                <div className="text-sm text-muted-foreground">Your Role</div>
                <div className="text-lg font-bold capitalize">{(user as any)?.role || "Member"}</div>
              </div>
              <Vote className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications Awaiting Committee Review</CardTitle>
          <div className="relative mt-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
              data-testid="input-search"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !filteredLoans?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No applications awaiting committee review</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Your Vote</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((item) => {
                  const stats = getVoteStats(item.votes);
                  return (
                    <TableRow key={item.loan.id} data-testid={`row-loan-${item.loan.id}`}>
                      <TableCell className="font-mono font-medium">{item.loan.applicationId}</TableCell>
                      <TableCell>
                        {item.loan.customer?.firstName} {item.loan.customer?.lastName}
                      </TableCell>
                      <TableCell>{item.loan.branch?.name || "-"}</TableCell>
                      <TableCell className="text-right font-medium text-emerald-600">
                        {formatCurrency(parseFloat(item.loan.requestedAmount || "0"))}
                      </TableCell>
                      <TableCell>{item.loan.financingDurationMonths} months</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">{stats.approved}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-red-600">{stats.rejected}</span>
                          <span className="text-muted-foreground">/</span>
                          <span>{stats.total}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getVoteBadge(item.userVote?.vote || "pending")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          className="bg-purple-500 hover:bg-purple-600"
                          onClick={() => setSelectedLoanId(item.loan.id)}
                          data-testid={`button-review-${item.loan.id}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
