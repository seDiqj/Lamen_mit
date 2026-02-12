import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Edit2, 
  FileSearch, 
  Search,
  User,
  Building2,
  FileText,
  Loader2,
  Shield,
  Users,
  ChevronLeft,
  ChevronRight,
  Check,
  ClipboardCheck,
  ArrowLeft,
  Camera,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import type { Branch, FinanceOfficer } from "@shared/schema";
import { cn } from "@/lib/utils";

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

const fadReviewSchema = z.object({
  customerNo: z.string().optional(),
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  gender: z.string().optional(),
  nationalId: z.string().optional(),
  nidExpiryDate: z.string().optional(),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  homeAddress: z.string().optional(),
  district: z.string().optional(),
  phoneNumber: z.string().optional(),
  secondPhoneNumber: z.string().optional(),
  numberOfDependents: z.coerce.number().optional(),
  directMaleDependent: z.coerce.number().optional(),
  directFemaleDependent: z.coerce.number().optional(),
  indirectMaleDependent: z.coerce.number().optional(),
  indirectFemaleDependent: z.coerce.number().optional(),
  branchId: z.string().optional(),
  financeOfficerId: z.string().optional(),
  productName: z.string().optional(),
  productCode: z.string().optional(),
  sector: z.string().optional(),
  businessDescription: z.string().optional(),
  financingPurpose: z.string().optional(),
  fundingSourceId: z.string().optional(),
  requestDate: z.string().optional(),
  requestAmount: z.coerce.number().optional(),
  financingDurationMonths: z.coerce.number().optional(),
  gracePeriod: z.coerce.number().optional(),
  numberOfInstallments: z.coerce.number().optional(),
  principleAmount: z.coerce.number().optional(),
  marginRate: z.coerce.number().optional(),
  businessName: z.string().optional(),
  businessProvince: z.string().optional(),
  businessDistrict: z.string().optional(),
  businessVillage: z.string().optional(),
  businessDetailedAddress: z.string().optional(),
  businessYearsOfExperience: z.coerce.number().optional(),
  licenseType: z.string().optional(),
  licensePresident: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseRegisterDate: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  collateralOwnerName: z.string().optional(),
  collateralOwnerNid: z.string().optional(),
  collateralOwnerNidExpiry: z.string().optional(),
  collateralType: z.string().optional(),
  collateralProvince: z.string().optional(),
  collateralAddress: z.string().optional(),
  collateralPurchasedPrice: z.coerce.number().optional(),
  collateralMarketPrice: z.coerce.number().optional(),
  financialGuarantorFullName: z.string().optional(),
  financialGuarantorFatherName: z.string().optional(),
  financialGuarantorDateOfBirth: z.string().optional(),
  financialGuarantorNid: z.string().optional(),
  financialGuarantorNidExpiry: z.string().optional(),
  financialGuarantorPhone: z.string().optional(),
  financialGuarantorHomeAddress: z.string().optional(),
  financialGuarantorDistrict: z.string().optional(),
  financialGuarantorBusiness: z.string().optional(),
  financialGuarantorBusinessAddress: z.string().optional(),
  financialGuarantorRelationship: z.string().optional(),
  financialGuarantorYearsOfExperience: z.coerce.number().optional(),
  financialGuarantorInventory: z.coerce.number().optional(),
  financialGuarantorMonthlyIncome: z.coerce.number().optional(),
  financialGuarantor2FullName: z.string().optional(),
  financialGuarantor2FatherName: z.string().optional(),
  financialGuarantor2DateOfBirth: z.string().optional(),
  financialGuarantor2Nid: z.string().optional(),
  financialGuarantor2NidExpiry: z.string().optional(),
  financialGuarantor2Phone: z.string().optional(),
  financialGuarantor2HomeAddress: z.string().optional(),
  financialGuarantor2District: z.string().optional(),
  financialGuarantor2Business: z.string().optional(),
  financialGuarantor2BusinessAddress: z.string().optional(),
  financialGuarantor2Relationship: z.string().optional(),
  financialGuarantor2YearsOfExperience: z.coerce.number().optional(),
  financialGuarantor2Inventory: z.coerce.number().optional(),
  financialGuarantor2MonthlyIncome: z.coerce.number().optional(),
  familyGuarantorFullName: z.string().optional(),
  familyGuarantorFatherName: z.string().optional(),
  familyGuarantorDateOfBirth: z.string().optional(),
  familyGuarantorNid: z.string().optional(),
  familyGuarantorNidExpiry: z.string().optional(),
  familyGuarantorPhone: z.string().optional(),
  familyGuarantorHomeAddress: z.string().optional(),
  familyGuarantorDistrict: z.string().optional(),
  familyGuarantorRelationship: z.string().optional(),
});

type FadReviewFormData = z.infer<typeof fadReviewSchema>;

const steps = [
  { id: 1, title: "Customer", icon: User, color: "from-green-500 to-emerald-500" },
  { id: 2, title: "Financing Details", icon: FileText, color: "from-yellow-500 to-amber-500" },
  { id: 3, title: "Business", icon: Building2, color: "from-blue-500 to-indigo-500" },
  { id: 4, title: "Collateral", icon: Shield, color: "from-orange-500 to-red-500" },
  { id: 5, title: "Guarantors", icon: Users, color: "from-teal-500 to-cyan-500" },
  { id: 6, title: "Review", icon: ClipboardCheck, color: "from-purple-500 to-violet-500" },
];

const loanProducts = [
  { code: "10", name: "Mudarabah" },
  { code: "11", name: "Murabaha" },
  { code: "12", name: "Musharakat" },
  { code: "13", name: "Qardul Hasana" },
];

export default function FadReviewPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState("");
  const [dataQualityScore, setDataQualityScore] = useState(80);

  const { data: branches = [] } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: financeOfficers = [] } = useQuery<FinanceOfficer[]>({ queryKey: ["/api/finance-officers"] });
  const { data: pendingLoansData, isLoading } = useQuery<{ loans: LoanWithDetails[]; total: number }>({
    queryKey: ["/api/loans", "data_quality_review"],
    queryFn: async () => {
      const res = await fetch("/api/loans?status=data_quality_review&limit=100");
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
  });

  const { data: newLoansData } = useQuery<{ loans: LoanWithDetails[]; total: number }>({
    queryKey: ["/api/loans", "pending"],
    queryFn: async () => {
      const res = await fetch("/api/loans?status=pending&limit=100");
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
  });

  const pendingLoans = [...(pendingLoansData?.loans || []), ...(newLoansData?.loans || [])];

  const { data: reviewedLoansData } = useQuery<{ loans: LoanWithDetails[]; total: number }>({
    queryKey: ["/api/loans", "committee_review"],
    queryFn: async () => {
      const res = await fetch("/api/loans?status=committee_review&limit=100");
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
  });

  const reviewedLoans = reviewedLoansData?.loans || [];

  const { data: loanDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["/api/loan-applications", selectedLoanId],
    queryFn: async () => {
      const res = await fetch(`/api/loan-applications/${selectedLoanId}`);
      if (!res.ok) throw new Error("Failed to fetch loan details");
      return res.json();
    },
    enabled: !!selectedLoanId,
  });

  const form = useForm<FadReviewFormData>({
    resolver: zodResolver(fadReviewSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (loanDetails) {
      const d = loanDetails;
      form.reset({
        customerNo: d.customer?.customerNo || "",
        firstName: d.customer?.firstName || "",
        lastName: d.customer?.lastName || "",
        fatherName: d.customer?.fatherName || "",
        gender: d.customer?.gender || "male",
        nationalId: d.customer?.nationalId || "",
        nidExpiryDate: d.customer?.nidExpiryDate || "",
        dateOfBirth: d.customer?.dateOfBirth || "",
        placeOfBirth: d.customer?.placeOfBirth || "",
        homeAddress: d.customer?.homeAddress || "",
        district: d.customer?.district || "",
        phoneNumber: d.customer?.phoneNumber || "",
        secondPhoneNumber: d.customer?.secondPhoneNumber || "",
        numberOfDependents: d.customer?.numberOfDependents || 0,
        directMaleDependent: d.customer?.directMaleDependent || 0,
        directFemaleDependent: d.customer?.directFemaleDependent || 0,
        indirectMaleDependent: d.customer?.indirectMaleDependent || 0,
        indirectFemaleDependent: d.customer?.indirectFemaleDependent || 0,
        branchId: d.loan?.branchId || "",
        financeOfficerId: d.loan?.financeOfficerId || "",
        productName: d.loan?.productName || "",
        productCode: d.loan?.productCode || "",
        sector: d.loan?.sector || "",
        businessDescription: d.loan?.businessDescription || "",
        financingPurpose: d.loan?.financingPurpose || "",
        fundingSourceId: d.loan?.fundingSourceId || "",
        requestDate: d.loan?.requestDate || "",
        requestAmount: parseFloat(d.loan?.requestAmount) || 0,
        financingDurationMonths: d.loan?.financingDurationMonths || 0,
        gracePeriod: d.loan?.gracePeriod || 0,
        numberOfInstallments: d.loan?.numberOfInstallments || 0,
        principleAmount: parseFloat(d.loan?.principleAmount) || 0,
        marginRate: parseFloat(d.loan?.marginRate) || 0,
        businessName: d.business?.businessName || "",
        businessProvince: d.business?.province || "",
        businessDistrict: d.business?.district || "",
        businessVillage: d.business?.village || "",
        businessDetailedAddress: d.business?.detailedAddress || "",
        businessYearsOfExperience: d.business?.yearsOfExperience || 0,
        licenseType: d.license?.licenseType || "",
        licensePresident: d.license?.president || "",
        licenseNumber: d.license?.licenseNumber || "",
        licenseRegisterDate: d.license?.registerDate || "",
        licenseExpiryDate: d.license?.expiryDate || "",
        collateralOwnerName: d.collateral?.ownerName || "",
        collateralOwnerNid: d.collateral?.ownerNationalId || "",
        collateralOwnerNidExpiry: d.collateral?.ownerNidExpiryDate || "",
        collateralType: d.collateral?.collateralType || "",
        collateralProvince: d.collateral?.province || "",
        collateralAddress: d.collateral?.address || "",
        collateralPurchasedPrice: parseFloat(d.collateral?.purchasedPrice) || 0,
        collateralMarketPrice: parseFloat(d.collateral?.marketPrice) || 0,
        financialGuarantorFullName: d.financialGuarantor?.fullName || "",
        financialGuarantorFatherName: d.financialGuarantor?.fatherName || "",
        financialGuarantorDateOfBirth: d.financialGuarantor?.dateOfBirth || "",
        financialGuarantorNid: d.financialGuarantor?.nationalId || "",
        financialGuarantorNidExpiry: d.financialGuarantor?.nidExpiryDate || "",
        financialGuarantorPhone: d.financialGuarantor?.phoneNumber || "",
        financialGuarantorHomeAddress: d.financialGuarantor?.homeAddress || "",
        financialGuarantorDistrict: d.financialGuarantor?.district || "",
        financialGuarantorBusiness: d.financialGuarantor?.business || "",
        financialGuarantorBusinessAddress: d.financialGuarantor?.businessAddress || "",
        financialGuarantorRelationship: d.financialGuarantor?.relationshipWithCustomer || "",
        financialGuarantorYearsOfExperience: d.financialGuarantor?.yearsOfExperience || 0,
        financialGuarantorInventory: parseFloat(d.financialGuarantor?.inventory) || 0,
        financialGuarantorMonthlyIncome: parseFloat(d.financialGuarantor?.monthlyIncome) || 0,
        financialGuarantor2FullName: d.financialGuarantor2?.fullName || "",
        financialGuarantor2FatherName: d.financialGuarantor2?.fatherName || "",
        financialGuarantor2DateOfBirth: d.financialGuarantor2?.dateOfBirth || "",
        financialGuarantor2Nid: d.financialGuarantor2?.nationalId || "",
        financialGuarantor2NidExpiry: d.financialGuarantor2?.nidExpiryDate || "",
        financialGuarantor2Phone: d.financialGuarantor2?.phoneNumber || "",
        financialGuarantor2HomeAddress: d.financialGuarantor2?.homeAddress || "",
        financialGuarantor2District: d.financialGuarantor2?.district || "",
        financialGuarantor2Business: d.financialGuarantor2?.business || "",
        financialGuarantor2BusinessAddress: d.financialGuarantor2?.businessAddress || "",
        financialGuarantor2Relationship: d.financialGuarantor2?.relationshipWithCustomer || "",
        financialGuarantor2YearsOfExperience: d.financialGuarantor2?.yearsOfExperience || 0,
        financialGuarantor2Inventory: parseFloat(d.financialGuarantor2?.inventory) || 0,
        financialGuarantor2MonthlyIncome: parseFloat(d.financialGuarantor2?.monthlyIncome) || 0,
        familyGuarantorFullName: d.familyGuarantor?.fullName || "",
        familyGuarantorFatherName: d.familyGuarantor?.fatherName || "",
        familyGuarantorDateOfBirth: d.familyGuarantor?.dateOfBirth || "",
        familyGuarantorNid: d.familyGuarantor?.nationalId || "",
        familyGuarantorNidExpiry: d.familyGuarantor?.nidExpiryDate || "",
        familyGuarantorPhone: d.familyGuarantor?.phoneNumber || "",
        familyGuarantorHomeAddress: d.familyGuarantor?.homeAddress || "",
        familyGuarantorDistrict: d.familyGuarantor?.district || "",
        familyGuarantorRelationship: d.familyGuarantor?.relationshipWithCustomer || "",
      });
    }
  }, [loanDetails, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: FadReviewFormData) => {
      const response = await apiRequest("PUT", `/api/loan-applications/${selectedLoanId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Application data updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications", selectedLoanId] });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: { loanId: string; status: string; comments: string; dataQualityScore: number }) => {
      const res = await apiRequest("POST", "/api/fad-reviews", data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Review Submitted",
        description: variables.status === "approved" 
          ? "Financing application has been forwarded for Risk Compliance review."
          : "Financing application has been sent back to Finance Officer with comments.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      setSelectedLoanId(null);
      setCurrentStep(1);
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

  const handleStartReview = (loanId: string) => {
    setSelectedLoanId(loanId);
    setCurrentStep(1);
    setIsEditing(false);
    setComments("");
    setDataQualityScore(80);
  };

  const handleBackToList = () => {
    setSelectedLoanId(null);
    setCurrentStep(1);
    setIsEditing(false);
  };

  const handleSaveChanges = () => {
    form.handleSubmit((data) => updateMutation.mutate(data))();
  };

  const handleSubmitReview = (status: "approved" | "rejected") => {
    if (!selectedLoanId) return;
    submitReviewMutation.mutate({
      loanId: selectedLoanId,
      status,
      comments,
      dataQualityScore,
    });
  };

  const nextStep = () => { if (currentStep < 6) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
  const goToStep = (step: number) => setCurrentStep(step);

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-AF", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
    }).format(num || 0);
  };

  const filteredLoans = pendingLoans.filter((loan) => {
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
      committee_review: { variant: "outline", label: "In Committee Review" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    const config = statusConfig[status] || { variant: "secondary" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (selectedLoanId) {
    if (isLoadingDetails) {
      return (
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  FAD Review: {loanDetails?.loan?.applicationId}
                </h1>
                <Badge variant="secondary">Pending Review</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {isEditing ? "Edit Mode - Make changes to the application" : "View Mode - Click Edit to make changes"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} data-testid="button-cancel-edit">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveChanges} 
                  disabled={updateMutation.isPending}
                  className="bg-gradient-to-r from-emerald-500 to-green-500"
                  data-testid="button-save-changes"
                >
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500"
                data-testid="button-edit"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Application
              </Button>
            )}
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

        <Form {...form}>
          <form>
            {currentStep === 1 && (
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle>Customer Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="customerNo" render={({ field }) => (
                      <FormItem><FormLabel>Customer No</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-customerNo" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem><FormLabel>Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-firstName" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="fatherName" render={({ field }) => (
                      <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-fatherName" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem><FormLabel>Gender</FormLabel>
                        <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger data-testid="select-gender"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nationalId" render={({ field }) => (
                      <FormItem><FormLabel>National ID</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-nationalId" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nidExpiryDate" render={({ field }) => (
                      <FormItem><FormLabel>NID Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} data-testid="input-nidExpiryDate" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => {
                      const calculateAge = (dob: string) => {
                        if (!dob) return null;
                        const birthDate = new Date(dob);
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                          age--;
                        }
                        return age;
                      };
                      const age = calculateAge(field.value || "");
                      return (
                        <FormItem><FormLabel>Date of Birth</FormLabel>
                          <div className="flex gap-2 items-center">
                            <FormControl><Input type="date" disabled={!isEditing} className="flex-1" {...field} data-testid="input-dateOfBirth" /></FormControl>
                            {age !== null && age >= 0 && (
                              <div className="h-9 px-3 flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md text-sm font-medium whitespace-nowrap" data-testid="text-customerAge">
                                Age: {age}
                              </div>
                            )}
                          </div>
                        <FormMessage /></FormItem>
                      );
                    }} />
                    <FormField control={form.control} name="placeOfBirth" render={({ field }) => (
                      <FormItem><FormLabel>Place of Birth</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-placeOfBirth" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="homeAddress" render={({ field }) => (
                      <FormItem><FormLabel>Home Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-homeAddress" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="district" render={({ field }) => (
                      <FormItem><FormLabel>District</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-district" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                      <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-phoneNumber" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="secondPhoneNumber" render={({ field }) => (
                      <FormItem><FormLabel>Second Phone</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-secondPhone" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="numberOfDependents" render={({ field }) => (
                      <FormItem><FormLabel>Dependents</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-dependents" /></FormControl><FormMessage /></FormItem>
                    )} />
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
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-yellow-500 to-amber-500" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle>Financing Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="branchId" render={({ field }) => (
                      <FormItem><FormLabel>Branch</FormLabel>
                        <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger data-testid="select-branch"><SelectValue placeholder="Select branch" /></SelectTrigger></FormControl>
                          <SelectContent>{branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financeOfficerId" render={({ field }) => (
                      <FormItem><FormLabel>Finance Officer</FormLabel>
                        <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger data-testid="select-officer"><SelectValue placeholder="Select officer" /></SelectTrigger></FormControl>
                          <SelectContent>{financeOfficers.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="productName" render={({ field }) => (
                      <FormItem><FormLabel>Product</FormLabel>
                        <Select disabled={!isEditing} onValueChange={(val) => {
                          field.onChange(val);
                          const product = loanProducts.find(p => p.name === val);
                          if (product) form.setValue("productCode", product.code);
                        }} value={field.value}>
                          <FormControl><SelectTrigger data-testid="select-product"><SelectValue placeholder="Select product" /></SelectTrigger></FormControl>
                          <SelectContent>{loanProducts.map(p => <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>)}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="requestAmount" render={({ field }) => (
                      <FormItem><FormLabel>Request Amount (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-requestAmount" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financingDurationMonths" render={({ field }) => (
                      <FormItem><FormLabel>Duration (Months)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-duration" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="gracePeriod" render={({ field }) => (
                      <FormItem><FormLabel>Grace Period (Months)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-grace" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="numberOfInstallments" render={({ field }) => (
                      <FormItem><FormLabel>Installments</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-installments" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="marginRate" render={({ field }) => (
                      <FormItem><FormLabel>Margin Rate (%)</FormLabel><FormControl><Input type="number" step="0.01" disabled={!isEditing} {...field} data-testid="input-marginRate" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="sector" render={({ field }) => (
                      <FormItem><FormLabel>Sector</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-sector" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="fundingSourceId" render={({ field }) => (
                      <FormItem><FormLabel>Funding Source</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-fundingSourceId" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financingPurpose" render={({ field }) => (
                      <FormItem className="col-span-2"><FormLabel>Purpose</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-purpose" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  {(() => {
                    const reqAmount = Number(form.watch("requestAmount")) || 0;
                    const principleAmt = Number(form.watch("principleAmount")) || 0;
                    const loanAmount = reqAmount > 0 ? reqAmount : principleAmt;
                    let margin = Number(form.watch("marginRate")) || 0;
                    if (margin > 0 && margin < 1) margin = margin * 100;
                    const durationMonths = Number(form.watch("financingDurationMonths")) || 0;
                    const installments = Number(form.watch("numberOfInstallments")) || 0;
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
                              <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-fad-total-margin">
                                {totalMargin.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Total Repayment</p>
                              <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-fad-total-repayment">
                                {totalRepayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Monthly Installment</p>
                              <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-fad-monthly-installment">
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
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle>Business Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="businessName" render={({ field }) => (
                      <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-businessName" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="businessProvince" render={({ field }) => (
                      <FormItem><FormLabel>Province</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-businessProvince" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="businessDistrict" render={({ field }) => (
                      <FormItem><FormLabel>District</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-businessDistrict" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="businessVillage" render={({ field }) => (
                      <FormItem><FormLabel>Village</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-businessVillage" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="businessDetailedAddress" render={({ field }) => (
                      <FormItem className="col-span-2"><FormLabel>Detailed Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-businessAddress" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="businessYearsOfExperience" render={({ field }) => (
                      <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-businessExp" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="licenseType" render={({ field }) => (
                      <FormItem><FormLabel>License Type</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-licenseType" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                      <FormItem><FormLabel>License Number</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-licenseNumber" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="licensePresident" render={({ field }) => (
                      <FormItem><FormLabel>License President</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-licensePresident" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="licenseRegisterDate" render={({ field }) => (
                      <FormItem><FormLabel>Register Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} data-testid="input-licenseRegister" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="licenseExpiryDate" render={({ field }) => (
                      <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} data-testid="input-licenseExpiry" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle>Collateral Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="collateralOwnerName" render={({ field }) => (
                      <FormItem><FormLabel>Owner Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-collateralOwner" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="collateralOwnerNid" render={({ field }) => (
                      <FormItem><FormLabel>Owner NID</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-collateralNid" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="collateralOwnerNidExpiry" render={({ field }) => (
                      <FormItem><FormLabel>Owner NID Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} data-testid="input-collateralOwnerNidExpiry" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="collateralType" render={({ field }) => (
                      <FormItem><FormLabel>Type</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-collateralType" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="collateralProvince" render={({ field }) => (
                      <FormItem><FormLabel>Province</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-collateralProvince" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="collateralAddress" render={({ field }) => (
                      <FormItem className="col-span-2"><FormLabel>Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-collateralAddress" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="collateralPurchasedPrice" render={({ field }) => (
                      <FormItem><FormLabel>Purchased Price (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-collateralPurchase" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="collateralMarketPrice" render={({ field }) => (
                      <FormItem><FormLabel>Market Price (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-collateralMarket" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle>Financial Guarantor</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField control={form.control} name="financialGuarantorFullName" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantorName" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantorFatherName" render={({ field }) => (
                        <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantorFather" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantorDateOfBirth" render={({ field }) => {
                        const calcAge = (dob: string) => { if (!dob) return null; const b = new Date(dob); const t = new Date(); let a = t.getFullYear() - b.getFullYear(); if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--; return a; };
                        const age = calcAge(field.value || "");
                        const invalid = age !== null && (age < 18 || age > 65);
                        return (
                          <FormItem><FormLabel>Date of Birth</FormLabel>
                            <div className="flex gap-2 items-center">
                              <FormControl><Input type="date" disabled={!isEditing} className="flex-1" {...field} data-testid="input-finGuarantorDob" /></FormControl>
                              {age !== null && age >= 0 && <div className={`h-9 px-3 flex items-center rounded-md text-sm font-medium whitespace-nowrap ${invalid ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`} data-testid="text-finGuarantorAge">Age: {age}{invalid && ' (18-65)'}</div>}
                            </div>
                          <FormMessage /></FormItem>
                        );
                      }} />
                      <FormField control={form.control} name="financialGuarantorNid" render={({ field }) => (
                        <FormItem><FormLabel>National ID</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantorNid" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantorNidExpiry" render={({ field }) => (
                        <FormItem><FormLabel>NID Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} data-testid="input-finGuarantorNidExpiry" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantorPhone" render={({ field }) => (
                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantorPhone" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantorHomeAddress" render={({ field }) => (
                        <FormItem><FormLabel>Home Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantorAddress" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantorBusiness" render={({ field }) => (
                        <FormItem><FormLabel>Business</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantorBusiness" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantorRelationship" render={({ field }) => (
                        <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantorRelation" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantorMonthlyIncome" render={({ field }) => (
                        <FormItem><FormLabel>Monthly Income (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-finGuarantorIncome" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-teal-400 to-emerald-500" />
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle>Financial Guarantor 2</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField control={form.control} name="financialGuarantor2FullName" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantor2Name" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2FatherName" render={({ field }) => (
                        <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantor2Father" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2DateOfBirth" render={({ field }) => {
                        const calcAge = (dob: string) => { if (!dob) return null; const b = new Date(dob); const t = new Date(); let a = t.getFullYear() - b.getFullYear(); if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--; return a; };
                        const age = calcAge(field.value || "");
                        const invalid = age !== null && (age < 18 || age > 65);
                        return (
                          <FormItem><FormLabel>Date of Birth</FormLabel>
                            <div className="flex gap-2 items-center">
                              <FormControl><Input type="date" disabled={!isEditing} className="flex-1" {...field} data-testid="input-finGuarantor2Dob" /></FormControl>
                              {age !== null && age >= 0 && <div className={`h-9 px-3 flex items-center rounded-md text-sm font-medium whitespace-nowrap ${invalid ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`} data-testid="text-finGuarantor2Age">Age: {age}{invalid && ' (18-65)'}</div>}
                            </div>
                          <FormMessage /></FormItem>
                        );
                      }} />
                      <FormField control={form.control} name="financialGuarantor2Nid" render={({ field }) => (
                        <FormItem><FormLabel>National ID</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantor2Nid" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2NidExpiry" render={({ field }) => (
                        <FormItem><FormLabel>NID Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} data-testid="input-finGuarantor2NidExpiry" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2Phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantor2Phone" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2HomeAddress" render={({ field }) => (
                        <FormItem><FormLabel>Home Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantor2Address" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2District" render={({ field }) => (
                        <FormItem><FormLabel>District</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantor2District" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2Business" render={({ field }) => (
                        <FormItem><FormLabel>Business</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantor2Business" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2BusinessAddress" render={({ field }) => (
                        <FormItem><FormLabel>Business Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantor2BusinessAddress" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2Relationship" render={({ field }) => (
                        <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-finGuarantor2Relation" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2YearsOfExperience" render={({ field }) => (
                        <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-finGuarantor2Experience" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2Inventory" render={({ field }) => (
                        <FormItem><FormLabel>Inventory (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-finGuarantor2Inventory" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="financialGuarantor2MonthlyIncome" render={({ field }) => (
                        <FormItem><FormLabel>Monthly Income (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} data-testid="input-finGuarantor2Income" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle>Family Guarantor</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField control={form.control} name="familyGuarantorFullName" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-famGuarantorName" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="familyGuarantorFatherName" render={({ field }) => (
                        <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-famGuarantorFather" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="familyGuarantorDateOfBirth" render={({ field }) => {
                        const calcAge = (dob: string) => { if (!dob) return null; const b = new Date(dob); const t = new Date(); let a = t.getFullYear() - b.getFullYear(); if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--; return a; };
                        const age = calcAge(field.value || "");
                        const invalid = age !== null && (age < 18 || age > 65);
                        return (
                          <FormItem><FormLabel>Date of Birth</FormLabel>
                            <div className="flex gap-2 items-center">
                              <FormControl><Input type="date" disabled={!isEditing} className="flex-1" {...field} data-testid="input-famGuarantorDob" /></FormControl>
                              {age !== null && age >= 0 && <div className={`h-9 px-3 flex items-center rounded-md text-sm font-medium whitespace-nowrap ${invalid ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`} data-testid="text-famGuarantorAge">Age: {age}{invalid && ' (18-65)'}</div>}
                            </div>
                          <FormMessage /></FormItem>
                        );
                      }} />
                      <FormField control={form.control} name="familyGuarantorNid" render={({ field }) => (
                        <FormItem><FormLabel>National ID</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-famGuarantorNid" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="familyGuarantorNidExpiry" render={({ field }) => (
                        <FormItem><FormLabel>NID Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} data-testid="input-famGuarantorNidExpiry" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="familyGuarantorPhone" render={({ field }) => (
                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-famGuarantorPhone" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="familyGuarantorHomeAddress" render={({ field }) => (
                        <FormItem><FormLabel>Home Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-famGuarantorAddress" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="familyGuarantorRelationship" render={({ field }) => (
                        <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-famGuarantorRelation" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 6 && (
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-violet-500" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                      <ClipboardCheck className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle>FAD Review & Decision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
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
                            <span className="font-medium text-emerald-600">{formatCurrency(form.watch("requestAmount") || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-medium">{form.watch("financingDurationMonths")} months</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Product:</span>
                            <span className="font-medium">{form.watch("productName") || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
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
                        <p className="text-xs text-muted-foreground">Rate the completeness and accuracy of application data</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="comments">Review Comments</Label>
                        <Textarea
                          id="comments"
                          placeholder="Add your review comments, findings, and recommendations..."
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          rows={5}
                          data-testid="input-review-comments"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-4 border-t">
                    <Button
                      type="button"
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
                      type="button"
                      size="lg"
                      onClick={() => handleSubmitReview("approved")}
                      disabled={submitReviewMutation.isPending}
                      className="min-w-40 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                      data-testid="button-pass-risk-compliance"
                    >
                      {submitReviewMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Pass to Risk Compliance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            data-testid="button-prev-step"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button 
            onClick={nextStep} 
            disabled={currentStep === 6}
            className="bg-gradient-to-r from-amber-500 to-yellow-500"
            data-testid="button-next-step"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

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
                        ? format(new Date(loan.applicationDate), "dd-MMM-yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleStartReview(loan.id)}
                        className="bg-gradient-to-r from-amber-500 to-yellow-500"
                        data-testid={`button-review-${loan.id}`}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Review
                      </Button>
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
    </div>
  );
}
