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
  ArrowLeft,
  User,
  FileText,
  Building2,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  Camera,
  ExternalLink
} from "lucide-react";
import { formatCurrency, cn, toPersianDate, calculateAge } from "@/lib/utils";

type CommitteeVote = {
  id: string;
  voterName: string;
  voterRole: string;
  vote: string;
  comments: string;
  votedAt: string;
};

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
  committeeVotes?: CommitteeVote[];
};

const steps = [
  { id: 1, title: "Customer", icon: User, color: "from-violet-500 to-purple-500" },
  { id: 2, title: "Financing Details", icon: FileText, color: "from-blue-500 to-cyan-500" },
  { id: 3, title: "Business", icon: Building2, color: "from-emerald-500 to-green-500" },
  { id: 4, title: "Collateral", icon: Shield, color: "from-amber-500 to-orange-500" },
  { id: 5, title: "Guarantors", icon: Users, color: "from-pink-500 to-rose-500" },
  { id: 6, title: "Review", icon: CheckCircle, color: "from-red-500 to-rose-600" },
];

export default function RiskCompliancePage() {
  const [search, setSearch] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [riskScore, setRiskScore] = useState(80);
  const [comments, setComments] = useState("");
  const { toast } = useToast();

  const { data: pendingLoans = [], isLoading } = useQuery<LoanWithFadReview[]>({
    queryKey: ["/api/risk-compliance/pending-loans"],
  });

  const { data: loanDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["/api/loan-applications", selectedLoanId],
    queryFn: async () => {
      const res = await fetch(`/api/loan-applications/${selectedLoanId}`);
      if (!res.ok) throw new Error("Failed to fetch loan details");
      return res.json();
    },
    enabled: !!selectedLoanId,
  });

  const guarantors = (() => {
    const list: any[] = [];
    if (loanDetails?.financialGuarantor) list.push(loanDetails.financialGuarantor);
    if (loanDetails?.financialGuarantor2) list.push({ ...loanDetails.financialGuarantor2, guarantorType: "financial2" });
    if (loanDetails?.familyGuarantor) list.push(loanDetails.familyGuarantor);
    return list;
  })();

  const { data: fadReviewData } = useQuery({
    queryKey: ["/api/fad-reviews", selectedLoanId],
    queryFn: async () => {
      const res = await fetch(`/api/fad-reviews/${selectedLoanId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!selectedLoanId,
  });

  const { data: committeeVotes = [] } = useQuery<CommitteeVote[]>({
    queryKey: ["/api/committee/votes", selectedLoanId],
    queryFn: async () => {
      const res = await fetch(`/api/committee/votes/${selectedLoanId}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!selectedLoanId,
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
          : "Application has been sent back to FAD with comments.",
      });
      setSelectedLoanId(null);
      setCurrentStep(1);
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

  const handleBackToList = () => {
    setSelectedLoanId(null);
    setCurrentStep(1);
    setComments("");
    setRiskScore(80);
  };

  const handleSubmitReview = (status: "approved" | "rejected") => {
    if (!selectedLoanId) return;
    submitReviewMutation.mutate({
      loanId: selectedLoanId,
      status,
      comments,
      riskScore,
    });
  };

  const goToStep = (stepId: number) => setCurrentStep(stepId);
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

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
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackToList} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  Risk Compliance Review: {loanDetails?.loan?.applicationId}
                </h1>
                <Badge variant="secondary">Pending Risk Review</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Review Mode - Assess risk and compliance for this application
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

        <Card className="border-t-4 border-t-red-500">
          <CardContent className="pt-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-violet-500" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderViewField("Customer No", loanDetails?.customer?.customerNo)}
                  {renderViewField("First Name", loanDetails?.customer?.firstName)}
                  {renderViewField("Last Name", loanDetails?.customer?.lastName)}
                  {renderViewField("Father's Name", loanDetails?.customer?.fatherName)}
                  {renderViewField("Full Name (Dari)", loanDetails?.customer?.fullNameDari)}
                  {renderViewField("Father's Name (Dari)", loanDetails?.customer?.fatherNameDari)}
                  {renderViewField("Gender", loanDetails?.customer?.gender)}
                  {renderViewField("Marital Status", loanDetails?.customer?.maritalStatus)}
                  {renderViewField("National ID", loanDetails?.customer?.nationalId)}
                  {renderDateViewField("NID Expiry Date", loanDetails?.customer?.nidExpiryDate)}
                  {renderDobViewField("Date of Birth", loanDetails?.customer?.dateOfBirth)}
                  {renderViewField("Place of Birth", loanDetails?.customer?.placeOfBirth)}
                  {renderViewField("Phone Number", loanDetails?.customer?.phoneNumber)}
                  {renderViewField("Second Phone", loanDetails?.customer?.secondPhoneNumber)}
                  {renderViewField("Home Address", loanDetails?.customer?.homeAddress)}
                  {renderViewField("Province", loanDetails?.customer?.province)}
                  {renderViewField("District", loanDetails?.customer?.district)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {renderViewField("Total Dependents", loanDetails?.customer?.numberOfDependents)}
                  {renderViewField("Direct Male", loanDetails?.customer?.directMaleDependent)}
                  {renderViewField("Direct Female", loanDetails?.customer?.directFemaleDependent)}
                  {renderViewField("Indirect Male", loanDetails?.customer?.indirectMaleDependent)}
                  {renderViewField("Indirect Female", loanDetails?.customer?.indirectFemaleDependent)}
                </div>

                {/* Photo & Documents Section */}
                <div className="border-t pt-3 mt-4">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-3">Photo & Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Customer Photo</label>
                      <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                        {loanDetails?.customer?.photoUrl ? (
                          <img src={loanDetails.customer.photoUrl} alt="Customer" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Uploaded Documents</label>
                      {loanDetails?.customerDocuments && loanDetails.customerDocuments.length > 0 ? (
                        <div className="space-y-1">
                          {loanDetails.customerDocuments.map((doc: any) => (
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
                        <p className="text-xs text-muted-foreground">No documents uploaded</p>
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
                  Loan Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderViewField("Branch", loanDetails?.loan?.branchName)}
                  {renderViewField("Finance Officer", loanDetails?.loan?.financeOfficerName)}
                  {renderViewField("Product Name", loanDetails?.loan?.productName)}
                  {renderViewField("Product Code", loanDetails?.loan?.productCode)}
                  {renderViewField("Sector", loanDetails?.loan?.sector)}
                  {renderViewField("Business Description", loanDetails?.loan?.businessDescription)}
                  {renderViewField("Financing Purpose", loanDetails?.loan?.financingPurpose)}
                  {renderDateViewField("Request Date", loanDetails?.loan?.requestDate)}
                  {renderViewField("Request Amount", formatCurrency(parseFloat(loanDetails?.loan?.requestAmount || "0")))}
                  {renderViewField("Principal Amount", formatCurrency(parseFloat(loanDetails?.loan?.principleAmount || "0")))}
                  {renderViewField("Duration (Months)", loanDetails?.loan?.financingDurationMonths)}
                  {renderViewField("Grace Period", loanDetails?.loan?.gracePeriod)}
                  {renderViewField("Installments", loanDetails?.loan?.numberOfInstallments)}
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
                            <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-rc-total-margin">
                              {totalMargin.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Repayment</p>
                            <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-rc-total-repayment">
                              {totalRepayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Monthly Installment</p>
                            <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-rc-monthly-installment">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {renderViewField("License Type", loanDetails?.license?.licenseType)}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            {g.guarantorType === "financial" ? "Financial Guarantor" : g.guarantorType === "financial2" ? "Financial Guarantor 2" : "Family Guarantor"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            {(g.guarantorType === "financial" || g.guarantorType === "financial2") && renderViewField("Monthly Income", g.monthlyIncome ? `AFN ${Number(g.monthlyIncome).toLocaleString()}` : null)}
                            {(g.guarantorType === "financial" || g.guarantorType === "financial2") && renderViewField("Inventory", g.inventory)}
                            {(g.guarantorType === "financial" || g.guarantorType === "financial2") && renderViewField("Years of Experience", g.yearsOfExperience)}
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
                  <Shield className="h-5 w-5 text-red-500" />
                  Risk Compliance Review & Decision
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          {formatCurrency(parseFloat(loanDetails?.loan?.requestAmount || "0"))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{loanDetails?.loan?.financingDurationMonths} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Product:</span>
                        <span className="font-medium">{loanDetails?.loan?.productName || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">FAD Review Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data Quality Score:</span>
                        <Badge variant="outline" className="bg-white">
                          {fadReviewData?.dataQualityScore || 0}/100
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reviewer:</span>
                        <span className="font-medium">{fadReviewData?.reviewerName || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{formatDate(fadReviewData?.reviewedAt || "")}</span>
                      </div>
                      {fadReviewData?.comments && (
                        <div className="mt-2 pt-2 border-t">
                          <span className="text-muted-foreground text-xs">FAD Comments:</span>
                          <p className="text-xs mt-1">{fadReviewData.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {committeeVotes.length > 0 && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg" data-testid="section-committee-votes">
                      <h4 className="font-semibold mb-3 text-amber-700 dark:text-amber-300">Voting Committee Feedback</h4>
                      <div className="space-y-3">
                        {committeeVotes.map((v) => (
                          <div key={v.id} className="text-sm border-b border-amber-200 dark:border-amber-800 pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{v.voterName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {v.voterRole}
                                </Badge>
                              </div>
                              <Badge
                                variant="outline"
                                className={v.vote === "approved"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                }
                              >
                                {v.vote === "approved" ? "Approved" : "Rejected"}
                              </Badge>
                            </div>
                            {v.comments && (
                              <p className="text-xs text-muted-foreground mt-1" data-testid={`text-vote-comment-${v.id}`}>{v.comments}</p>
                            )}
                            <span className="text-[10px] text-muted-foreground">{formatDate(v.votedAt)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                      className="h-9"
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

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleSubmitReview("rejected")}
                    disabled={submitReviewMutation.isPending}
                    className="min-w-40 text-red-600 border-red-200 hover:bg-red-50"
                    data-testid="button-reject"
                  >
                    {submitReviewMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => handleSubmitReview("approved")}
                    disabled={submitReviewMutation.isPending}
                    className="min-w-40 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                    data-testid="button-pass-committee"
                  >
                    {submitReviewMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Pass to Committee
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} data-testid="button-previous">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {currentStep < 6 && (
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
                      <Button 
                        size="sm" 
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => setSelectedLoanId(item.loan.id)}
                        data-testid={`button-review-${item.loan.id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
