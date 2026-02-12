import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  User, FileText, Building2, Shield, Users, UserCheck, 
  ChevronLeft, ChevronRight, Save, ArrowLeft, Loader2, Check, Eye, Edit2,
  XCircle, AlertTriangle, CheckCircle2, Clock, Camera, ExternalLink
} from "lucide-react";
import type { Branch, FinanceOfficer, FundingSource } from "@shared/schema";
import { cn } from "@/lib/utils";

const optNum = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().optional()
);

const loanDetailsSchema = z.object({
  customerNo: z.string().optional(),
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  gender: z.string().optional(),
  nationalId: z.string().optional(),
  nidExpiryDate: z.string().optional(),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  age: optNum,
  homeAddress: z.string().optional(),
  district: z.string().optional(),
  phoneNumber: z.string().optional(),
  secondPhoneNumber: z.string().optional(),
  numberOfDependents: optNum,
  directMaleDependent: optNum,
  directFemaleDependent: optNum,
  indirectMaleDependent: optNum,
  indirectFemaleDependent: optNum,
  branchId: z.string().optional(),
  financeOfficerId: z.string().optional(),
  productName: z.string().optional(),
  productCode: z.string().optional(),
  sector: z.string().optional(),
  businessDescription: z.string().optional(),
  financingPurpose: z.string().optional(),
  fundingSourceId: z.string().optional(),
  requestDate: z.string().optional(),
  requestAmount: optNum,
  financingDurationMonths: optNum,
  gracePeriod: optNum,
  numberOfInstallments: optNum,
  principleAmount: optNum,
  marginRate: optNum,
  businessName: z.string().optional(),
  businessProvince: z.string().optional(),
  businessDistrict: z.string().optional(),
  businessVillage: z.string().optional(),
  businessDetailedAddress: z.string().optional(),
  businessYearsOfExperience: optNum,
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
  collateralPurchasedPrice: optNum,
  collateralMarketPrice: optNum,
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
  financialGuarantorYearsOfExperience: optNum,
  financialGuarantorInventory: optNum,
  financialGuarantorMonthlyIncome: optNum,
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
  financialGuarantor2YearsOfExperience: optNum,
  financialGuarantor2Inventory: optNum,
  financialGuarantor2MonthlyIncome: optNum,
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

type LoanDetailsFormData = z.infer<typeof loanDetailsSchema>;

const steps = [
  { id: 1, title: "Customer", icon: User, color: "from-green-500 to-emerald-500" },
  { id: 2, title: "Financing Details", icon: FileText, color: "from-yellow-500 to-amber-500" },
  { id: 3, title: "Business", icon: Building2, color: "from-blue-500 to-indigo-500" },
  { id: 4, title: "Collateral", icon: Shield, color: "from-orange-500 to-red-500" },
  { id: 5, title: "Guarantors", icon: Users, color: "from-teal-500 to-cyan-500" },
];

const loanProducts = [
  { code: "10", name: "Mudarabah" },
  { code: "11", name: "Murabaha" },
  { code: "12", name: "Musharakat" },
  { code: "13", name: "Qardul Hasana" },
];

export default function LoanDetailsPage() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/loans/:id");
  const loanId = params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const { data: branches = [] } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: financeOfficers = [] } = useQuery<FinanceOfficer[]>({ queryKey: ["/api/finance-officers"] });
  const { data: fundingSources = [] } = useQuery<FundingSource[]>({ queryKey: ["/api/funding-sources"] });

  const { data: loanData, isLoading } = useQuery({
    queryKey: ["/api/loan-applications", loanId],
    queryFn: async () => {
      const res = await fetch(`/api/loan-applications/${loanId}`);
      if (!res.ok) throw new Error("Failed to fetch loan");
      return res.json();
    },
    enabled: !!loanId,
  });

  const form = useForm<LoanDetailsFormData>({
    resolver: zodResolver(loanDetailsSchema),
    defaultValues: {},
  });

  const toNum = (v: any): number | undefined => {
    if (v === null || v === undefined || v === "") return undefined;
    const n = typeof v === "string" ? parseFloat(v) : v;
    return isNaN(n) ? undefined : n;
  };

  useEffect(() => {
    if (loanData) {
      const d = loanData;
      form.reset({
        customerNo: d.customer?.customerNo ?? "",
        firstName: d.customer?.firstName ?? "",
        lastName: d.customer?.lastName ?? "",
        fatherName: d.customer?.fatherName ?? "",
        gender: d.customer?.gender ?? "male",
        nationalId: d.customer?.nationalId ?? "",
        nidExpiryDate: d.customer?.nidExpiryDate ?? "",
        dateOfBirth: d.customer?.dateOfBirth ?? "",
        placeOfBirth: d.customer?.placeOfBirth ?? "",
        homeAddress: d.customer?.homeAddress ?? "",
        district: d.customer?.district ?? "",
        phoneNumber: d.customer?.phoneNumber ?? "",
        secondPhoneNumber: d.customer?.secondPhoneNumber ?? "",
        numberOfDependents: toNum(d.customer?.numberOfDependents),
        directMaleDependent: toNum(d.customer?.directMaleDependent),
        directFemaleDependent: toNum(d.customer?.directFemaleDependent),
        indirectMaleDependent: toNum(d.customer?.indirectMaleDependent),
        indirectFemaleDependent: toNum(d.customer?.indirectFemaleDependent),
        branchId: d.loan?.branchId ?? "",
        financeOfficerId: d.loan?.financeOfficerId ?? "",
        productName: d.loan?.productName ?? "",
        productCode: d.loan?.productCode ?? "",
        sector: d.loan?.sector ?? "",
        businessDescription: d.loan?.businessDescription ?? "",
        financingPurpose: d.loan?.financingPurpose ?? "",
        fundingSourceId: d.loan?.fundingSourceId ?? "",
        requestDate: d.loan?.requestDate ?? "",
        requestAmount: toNum(d.loan?.requestAmount),
        financingDurationMonths: toNum(d.loan?.financingDurationMonths),
        gracePeriod: toNum(d.loan?.gracePeriod),
        numberOfInstallments: toNum(d.loan?.numberOfInstallments),
        principleAmount: toNum(d.loan?.principleAmount),
        marginRate: toNum(d.loan?.marginRate),
        businessName: d.business?.businessName ?? "",
        businessProvince: d.business?.province ?? "",
        businessDistrict: d.business?.district ?? "",
        businessVillage: d.business?.village ?? "",
        businessDetailedAddress: d.business?.detailedAddress ?? "",
        businessYearsOfExperience: toNum(d.business?.yearsOfExperience),
        licenseType: d.license?.licenseType ?? "",
        licensePresident: d.license?.president ?? "",
        licenseNumber: d.license?.licenseNumber ?? "",
        licenseRegisterDate: d.license?.registerDate ?? "",
        licenseExpiryDate: d.license?.expiryDate ?? "",
        collateralOwnerName: d.collateral?.ownerName ?? "",
        collateralOwnerNid: d.collateral?.ownerNationalId ?? "",
        collateralOwnerNidExpiry: d.collateral?.ownerNidExpiryDate ?? "",
        collateralType: d.collateral?.collateralType ?? "",
        collateralProvince: d.collateral?.province ?? "",
        collateralAddress: d.collateral?.address ?? "",
        collateralPurchasedPrice: toNum(d.collateral?.purchasedPrice),
        collateralMarketPrice: toNum(d.collateral?.marketPrice),
        financialGuarantorFullName: d.financialGuarantor?.fullName ?? "",
        financialGuarantorFatherName: d.financialGuarantor?.fatherName ?? "",
        financialGuarantorDateOfBirth: d.financialGuarantor?.dateOfBirth ?? "",
        financialGuarantorNid: d.financialGuarantor?.nationalId ?? "",
        financialGuarantorNidExpiry: d.financialGuarantor?.nidExpiryDate ?? "",
        financialGuarantorPhone: d.financialGuarantor?.phoneNumber ?? "",
        financialGuarantorHomeAddress: d.financialGuarantor?.homeAddress ?? "",
        financialGuarantorDistrict: d.financialGuarantor?.district ?? "",
        financialGuarantorBusiness: d.financialGuarantor?.business ?? "",
        financialGuarantorBusinessAddress: d.financialGuarantor?.businessAddress ?? "",
        financialGuarantorRelationship: d.financialGuarantor?.relationshipWithCustomer ?? "",
        financialGuarantorYearsOfExperience: toNum(d.financialGuarantor?.yearsOfExperience),
        financialGuarantorInventory: toNum(d.financialGuarantor?.inventory),
        financialGuarantorMonthlyIncome: toNum(d.financialGuarantor?.monthlyIncome),
        financialGuarantor2FullName: d.financialGuarantor2?.fullName ?? "",
        financialGuarantor2FatherName: d.financialGuarantor2?.fatherName ?? "",
        financialGuarantor2DateOfBirth: d.financialGuarantor2?.dateOfBirth ?? "",
        financialGuarantor2Nid: d.financialGuarantor2?.nationalId ?? "",
        financialGuarantor2NidExpiry: d.financialGuarantor2?.nidExpiryDate ?? "",
        financialGuarantor2Phone: d.financialGuarantor2?.phoneNumber ?? "",
        financialGuarantor2HomeAddress: d.financialGuarantor2?.homeAddress ?? "",
        financialGuarantor2District: d.financialGuarantor2?.district ?? "",
        financialGuarantor2Business: d.financialGuarantor2?.business ?? "",
        financialGuarantor2BusinessAddress: d.financialGuarantor2?.businessAddress ?? "",
        financialGuarantor2Relationship: d.financialGuarantor2?.relationshipWithCustomer ?? "",
        financialGuarantor2YearsOfExperience: toNum(d.financialGuarantor2?.yearsOfExperience),
        financialGuarantor2Inventory: toNum(d.financialGuarantor2?.inventory),
        financialGuarantor2MonthlyIncome: toNum(d.financialGuarantor2?.monthlyIncome),
        familyGuarantorFullName: d.familyGuarantor?.fullName ?? "",
        familyGuarantorFatherName: d.familyGuarantor?.fatherName ?? "",
        familyGuarantorDateOfBirth: d.familyGuarantor?.dateOfBirth ?? "",
        familyGuarantorNid: d.familyGuarantor?.nationalId ?? "",
        familyGuarantorNidExpiry: d.familyGuarantor?.nidExpiryDate ?? "",
        familyGuarantorPhone: d.familyGuarantor?.phoneNumber ?? "",
        familyGuarantorHomeAddress: d.familyGuarantor?.homeAddress ?? "",
        familyGuarantorDistrict: d.familyGuarantor?.district ?? "",
        familyGuarantorRelationship: d.familyGuarantor?.relationshipWithCustomer ?? "",
      });
    }
  }, [loanData, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: LoanDetailsFormData) => {
      const response = await apiRequest("PUT", `/api/loan-applications/${loanId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Financing application updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications", loanId] });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: LoanDetailsFormData) => {
    updateMutation.mutate(data);
  };

  const nextStep = () => { if (currentStep < 5) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
  const goToStep = (step: number) => { setCurrentStep(step); };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/loans")} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {loanData?.loan?.applicationId || "Financing Details"}
              </h1>
              <Badge variant={loanData?.loan?.status === "disbursed" ? "default" : "secondary"}>
                {loanData?.loan?.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {isEditing ? "Edit Mode - Make changes and save" : "View Mode - Click Edit to make changes"}
            </p>
          </div>
        </div>
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? "" : "bg-gradient-to-r from-blue-500 to-indigo-500"}
          data-testid="button-toggle-edit"
        >
          {isEditing ? (
            <><Eye className="h-4 w-4 mr-2" /> View Mode</>
          ) : (
            <><Edit2 className="h-4 w-4 mr-2" /> Edit</>
          )}
        </Button>
      </div>

      {loanData?.loan?.status === "rejected" && (
        <Card className="border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 overflow-hidden">
          <div className="h-1 bg-red-500" />
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-6 w-6 text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-red-700 dark:text-red-400 text-base">Application Rejected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This financing application has been rejected. See the review details below.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(() => {
                    const fadReview = loanData?.fadReview;
                    const rcReview = loanData?.riskComplianceReview;
                    const committeeVotes = loanData?.committeeVotes || [];
                    const rejectedVotes = committeeVotes.filter((v: any) => v.vote === "rejected");
                    
                    const fadStatus = fadReview?.status || "pending";
                    const rcStatus = rcReview?.status || "pending";
                    const hasCommitteeRejection = rejectedVotes.length > 0;
                    
                    return (
                      <>
                        <div className={cn(
                          "p-3 rounded-md border",
                          fadStatus === "rejected" ? "bg-red-100 dark:bg-red-950/50 border-red-300 dark:border-red-700" :
                          fadStatus === "approved" ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700" :
                          "bg-muted/50 border-border"
                        )}>
                          <div className="flex items-center gap-2 mb-1.5">
                            {fadStatus === "rejected" ? <XCircle className="h-4 w-4 text-red-500" /> :
                             fadStatus === "approved" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
                             <Clock className="h-4 w-4 text-muted-foreground" />}
                            <span className="font-semibold text-sm">FAD Review</span>
                            <Badge variant={fadStatus === "rejected" ? "destructive" : fadStatus === "approved" ? "default" : "secondary"} className="ml-auto text-xs">
                              {fadStatus}
                            </Badge>
                          </div>
                          {fadReview?.reviewerName && (
                            <p className="text-xs text-muted-foreground">By: {fadReview.reviewerName}</p>
                          )}
                          {fadReview?.comments && (
                            <p className="text-sm mt-1.5 italic">{fadReview.comments}</p>
                          )}
                          {fadReview?.reviewedAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(fadReview.reviewedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className={cn(
                          "p-3 rounded-md border",
                          rcStatus === "rejected" ? "bg-red-100 dark:bg-red-950/50 border-red-300 dark:border-red-700" :
                          rcStatus === "approved" ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700" :
                          "bg-muted/50 border-border"
                        )}>
                          <div className="flex items-center gap-2 mb-1.5">
                            {rcStatus === "rejected" ? <XCircle className="h-4 w-4 text-red-500" /> :
                             rcStatus === "approved" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
                             <Clock className="h-4 w-4 text-muted-foreground" />}
                            <span className="font-semibold text-sm">Risk Compliance</span>
                            <Badge variant={rcStatus === "rejected" ? "destructive" : rcStatus === "approved" ? "default" : "secondary"} className="ml-auto text-xs">
                              {rcStatus}
                            </Badge>
                          </div>
                          {rcReview?.reviewerName && (
                            <p className="text-xs text-muted-foreground">By: {rcReview.reviewerName}</p>
                          )}
                          {rcReview?.comments && (
                            <p className="text-sm mt-1.5 italic">{rcReview.comments}</p>
                          )}
                          {rcReview?.reviewedAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(rcReview.reviewedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className={cn(
                          "p-3 rounded-md border",
                          hasCommitteeRejection ? "bg-red-100 dark:bg-red-950/50 border-red-300 dark:border-red-700" :
                          committeeVotes.length > 0 ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700" :
                          "bg-muted/50 border-border"
                        )}>
                          <div className="flex items-center gap-2 mb-1.5">
                            {hasCommitteeRejection ? <XCircle className="h-4 w-4 text-red-500" /> :
                             committeeVotes.length > 0 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
                             <Clock className="h-4 w-4 text-muted-foreground" />}
                            <span className="font-semibold text-sm">Committee</span>
                            <Badge variant={hasCommitteeRejection ? "destructive" : committeeVotes.length > 0 ? "default" : "secondary"} className="ml-auto text-xs">
                              {committeeVotes.length === 0 ? "pending" : hasCommitteeRejection ? "rejected" : "voted"}
                            </Badge>
                          </div>
                          {committeeVotes.length > 0 && (
                            <div className="space-y-1 mt-1.5">
                              {committeeVotes.map((v: any, i: number) => (
                                <div key={i} className="text-xs flex items-center gap-1.5">
                                  {v.vote === "rejected" ? <XCircle className="h-3 w-3 text-red-500" /> :
                                   v.vote === "approved" ? <CheckCircle2 className="h-3 w-3 text-green-500" /> :
                                   <Clock className="h-3 w-3 text-muted-foreground" />}
                                  <span className="font-medium">{v.voterName || v.voterRole}</span>
                                  <span className="text-muted-foreground">- {v.vote}</span>
                                  {v.comments && <span className="italic text-muted-foreground ml-1">"{v.comments}"</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => goToStep(step.id)}
              className={cn("flex flex-col items-center gap-2 group cursor-pointer transition-all", currentStep === step.id ? "scale-105" : "")}
              data-testid={`step-${step.id}`}
            >
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all",
                currentStep === step.id ? `bg-gradient-to-r ${step.color} text-white` : currentStep > step.id ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
              )}>
                {currentStep > step.id ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <span className={cn("text-xs font-medium hidden sm:block", currentStep === step.id ? "text-foreground" : "text-muted-foreground")}>{step.title}</span>
            </button>
            {index < steps.length - 1 && <div className={cn("flex-1 h-1 mx-2 rounded-full transition-all", currentStep > step.id ? "bg-green-500" : "bg-muted")} />}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <FormItem><FormLabel>Customer No</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="fatherName" render={({ field }) => (
                    <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Gender</FormLabel>
                      <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="nationalId" render={({ field }) => (
                    <FormItem><FormLabel>National ID</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="nidExpiryDate" render={({ field }) => (
                    <FormItem><FormLabel>NID Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} data-testid="input-nid-expiry" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                    <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="placeOfBirth" render={({ field }) => (
                    <FormItem><FormLabel>Place of Birth</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="homeAddress" render={({ field }) => (
                    <FormItem><FormLabel>Home Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="district" render={({ field }) => (
                    <FormItem><FormLabel>District</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="secondPhoneNumber" render={({ field }) => (
                    <FormItem><FormLabel>2nd Phone</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="numberOfDependents" render={({ field }) => (
                    <FormItem><FormLabel>Dependents</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="directMaleDependent" render={({ field }) => (
                    <FormItem><FormLabel>Direct Male Dep.</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="directFemaleDependent" render={({ field }) => (
                    <FormItem><FormLabel>Direct Female Dep.</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="indirectMaleDependent" render={({ field }) => (
                    <FormItem><FormLabel>Indirect Male Dep.</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="indirectFemaleDependent" render={({ field }) => (
                    <FormItem><FormLabel>Indirect Female Dep.</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                {/* Photo & Documents Section */}
                <div className="border-t pt-3 mt-4">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-3">Photo & Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Customer Photo</label>
                      <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                        {loanData?.customer?.photoUrl ? (
                          <img src={loanData.customer.photoUrl} alt="Customer" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Uploaded Documents</label>
                      {loanData?.customerDocuments && loanData.customerDocuments.length > 0 ? (
                        <div className="space-y-1">
                          {loanData.customerDocuments.map((doc: any) => (
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
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="financeOfficerId" render={({ field }) => (
                    <FormItem><FormLabel>Finance Officer</FormLabel>
                      <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{financeOfficers.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="productName" render={({ field }) => (
                    <FormItem><FormLabel>Product Name</FormLabel>
                      <Select disabled={!isEditing} onValueChange={(v) => { field.onChange(v); const p = loanProducts.find(x => x.name === v); if (p) form.setValue("productCode", p.code); }} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{loanProducts.map((p) => <SelectItem key={p.code} value={p.name}>{p.code} - {p.name}</SelectItem>)}</SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="productCode" render={({ field }) => (
                    <FormItem><FormLabel>Product Code</FormLabel><FormControl><Input readOnly className="bg-muted" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="sector" render={({ field }) => (
                    <FormItem><FormLabel>Sector</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="businessDescription" render={({ field }) => (
                    <FormItem><FormLabel>Business</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="financingPurpose" render={({ field }) => (
                    <FormItem><FormLabel>Financing Purpose</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="fundingSourceId" render={({ field }) => (
                    <FormItem><FormLabel>Source of Fund</FormLabel>
                      <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger></FormControl>
                        <SelectContent>{fundingSources.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="requestDate" render={({ field }) => (
                    <FormItem><FormLabel>Request Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="requestAmount" render={({ field }) => (
                    <FormItem><FormLabel>Request Amount (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="financingDurationMonths" render={({ field }) => (
                    <FormItem><FormLabel>Duration (Months)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="gracePeriod" render={({ field }) => (
                    <FormItem><FormLabel>Grace Period</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="numberOfInstallments" render={({ field }) => (
                    <FormItem><FormLabel>Installments</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="principleAmount" render={({ field }) => (
                    <FormItem><FormLabel>Principle (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="marginRate" render={({ field }) => (
                    <FormItem><FormLabel>Margin Rate (%)</FormLabel><FormControl><Input type="number" step="0.01" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
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
                            <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-total-margin">
                              {totalMargin.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Repayment</p>
                            <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-total-repayment">
                              {totalRepayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Monthly Installment</p>
                            <p className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-monthly-installment">
                              {monthlyInstallment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AFN
                            </p>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Formula: (Loan Amount x Margin% / 12) x Duration(months)
                        </p>
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
                  <CardTitle>Business & License Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="businessName" render={({ field }) => (
                      <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="businessProvince" render={({ field }) => (
                      <FormItem><FormLabel>Province</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="businessDistrict" render={({ field }) => (
                      <FormItem><FormLabel>District</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="businessVillage" render={({ field }) => (
                      <FormItem><FormLabel>Village</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="businessDetailedAddress" render={({ field }) => (
                      <FormItem><FormLabel>Detailed Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="businessYearsOfExperience" render={({ field }) => (
                      <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">License Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="licenseType" render={({ field }) => (
                      <FormItem><FormLabel>License Type</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="licensePresident" render={({ field }) => (
                      <FormItem><FormLabel>President</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                      <FormItem><FormLabel>License Number</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="licenseRegisterDate" render={({ field }) => (
                      <FormItem><FormLabel>Register Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="licenseExpiryDate" render={({ field }) => (
                      <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
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
                    <FormItem><FormLabel>Owner Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="collateralOwnerNid" render={({ field }) => (
                    <FormItem><FormLabel>Owner NID</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="collateralOwnerNidExpiry" render={({ field }) => (
                    <FormItem><FormLabel>Owner NID Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} data-testid="input-collateral-owner-nid-expiry" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="collateralType" render={({ field }) => (
                    <FormItem><FormLabel>Type</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="collateralProvince" render={({ field }) => (
                    <FormItem><FormLabel>Province</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="collateralAddress" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="collateralPurchasedPrice" render={({ field }) => (
                    <FormItem><FormLabel>Purchased Price (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="collateralMarketPrice" render={({ field }) => (
                    <FormItem><FormLabel>Market Price (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 5 && (
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle>Guarantor Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-teal-600 mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> Financial Guarantor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="financialGuarantorFullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorFatherName" render={({ field }) => (
                      <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorDateOfBirth" render={({ field }) => {
                      const calcAge = (dob: string) => { if (!dob) return null; const b = new Date(dob); const t = new Date(); let a = t.getFullYear() - b.getFullYear(); if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--; return a; };
                      const age = calcAge(field.value || "");
                      const invalid = age !== null && (age < 18 || age > 65);
                      return (
                        <FormItem><FormLabel>Date of Birth</FormLabel>
                          <div className="flex gap-2 items-center">
                            <FormControl><Input type="date" disabled={!isEditing} className="flex-1" {...field} /></FormControl>
                            {age !== null && age >= 0 && <div className={`h-9 px-3 flex items-center rounded-md text-sm font-medium whitespace-nowrap ${invalid ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>Age: {age}{invalid && ' (18-65)'}</div>}
                          </div>
                        <FormMessage /></FormItem>
                      );
                    }} />
                    <FormField control={form.control} name="financialGuarantorNid" render={({ field }) => (
                      <FormItem><FormLabel>NID</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorNidExpiry" render={({ field }) => (
                      <FormItem><FormLabel>NID Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorPhone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorHomeAddress" render={({ field }) => (
                      <FormItem><FormLabel>Home Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorDistrict" render={({ field }) => (
                      <FormItem><FormLabel>District</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorBusiness" render={({ field }) => (
                      <FormItem><FormLabel>Business</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorBusinessAddress" render={({ field }) => (
                      <FormItem><FormLabel>Business Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorRelationship" render={({ field }) => (
                      <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorYearsOfExperience" render={({ field }) => (
                      <FormItem><FormLabel>Years of Exp</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorInventory" render={({ field }) => (
                      <FormItem><FormLabel>Inventory (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorMonthlyIncome" render={({ field }) => (
                      <FormItem><FormLabel>Monthly Income</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-teal-600 mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> Financial Guarantor 2</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="financialGuarantor2FullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-fin-guarantor2-name" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2FatherName" render={({ field }) => (
                      <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-fin-guarantor2-father" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2DateOfBirth" render={({ field }) => {
                      const calcAge = (dob: string) => { if (!dob) return null; const b = new Date(dob); const t = new Date(); let a = t.getFullYear() - b.getFullYear(); if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--; return a; };
                      const age = calcAge(field.value || "");
                      const invalid = age !== null && (age < 18 || age > 65);
                      return (
                        <FormItem><FormLabel>Date of Birth</FormLabel>
                          <div className="flex gap-2 items-center">
                            <FormControl><Input type="date" disabled={!isEditing} className="flex-1" {...field} data-testid="input-fin-guarantor2-dob" /></FormControl>
                            {age !== null && age >= 0 && <div className={`h-9 px-3 flex items-center rounded-md text-sm font-medium whitespace-nowrap ${invalid ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>Age: {age}{invalid && ' (18-65)'}</div>}
                          </div>
                        <FormMessage /></FormItem>
                      );
                    }} />
                    <FormField control={form.control} name="financialGuarantor2Nid" render={({ field }) => (
                      <FormItem><FormLabel>NID</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-fin-guarantor2-nid" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2NidExpiry" render={({ field }) => (
                      <FormItem><FormLabel>NID Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} data-testid="input-fin-guarantor2-nid-expiry" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2Phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-fin-guarantor2-phone" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2HomeAddress" render={({ field }) => (
                      <FormItem><FormLabel>Home Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-fin-guarantor2-address" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2District" render={({ field }) => (
                      <FormItem><FormLabel>District</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-fin-guarantor2-district" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2Business" render={({ field }) => (
                      <FormItem><FormLabel>Business</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-fin-guarantor2-business" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2BusinessAddress" render={({ field }) => (
                      <FormItem><FormLabel>Business Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-fin-guarantor2-business-address" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2Relationship" render={({ field }) => (
                      <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input disabled={!isEditing} {...field} data-testid="input-fin-guarantor2-relationship" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2YearsOfExperience" render={({ field }) => (
                      <FormItem><FormLabel>Years of Exp</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} data-testid="input-fin-guarantor2-experience" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2Inventory" render={({ field }) => (
                      <FormItem><FormLabel>Inventory (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} data-testid="input-fin-guarantor2-inventory" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2MonthlyIncome" render={({ field }) => (
                      <FormItem><FormLabel>Monthly Income</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} value={field.value ?? ""} data-testid="input-fin-guarantor2-income" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-pink-600 mb-3 flex items-center gap-2"><UserCheck className="h-4 w-4" /> Family Guarantor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField control={form.control} name="familyGuarantorFullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorFatherName" render={({ field }) => (
                      <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorDateOfBirth" render={({ field }) => {
                      const calcAge = (dob: string) => { if (!dob) return null; const b = new Date(dob); const t = new Date(); let a = t.getFullYear() - b.getFullYear(); if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--; return a; };
                      const age = calcAge(field.value || "");
                      const invalid = age !== null && (age < 18 || age > 65);
                      return (
                        <FormItem><FormLabel>Date of Birth</FormLabel>
                          <div className="flex gap-2 items-center">
                            <FormControl><Input type="date" disabled={!isEditing} className="flex-1" {...field} /></FormControl>
                            {age !== null && age >= 0 && <div className={`h-9 px-3 flex items-center rounded-md text-sm font-medium whitespace-nowrap ${invalid ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>Age: {age}{invalid && ' (18-65)'}</div>}
                          </div>
                        <FormMessage /></FormItem>
                      );
                    }} />
                    <FormField control={form.control} name="familyGuarantorNid" render={({ field }) => (
                      <FormItem><FormLabel>NID</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorNidExpiry" render={({ field }) => (
                      <FormItem><FormLabel>NID Expiry Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorPhone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorHomeAddress" render={({ field }) => (
                      <FormItem><FormLabel>Home Address</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorDistrict" render={({ field }) => (
                      <FormItem><FormLabel>District</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorRelationship" render={({ field }) => (
                      <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex gap-2">
              {isEditing && (
                <Button type="submit" disabled={updateMutation.isPending} className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500">
                  {updateMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
                </Button>
              )}
              {currentStep < 5 && (
                <Button type="button" onClick={nextStep} className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
