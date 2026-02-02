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
  ChevronLeft, ChevronRight, Save, ArrowLeft, Loader2, Check, Eye, Edit2
} from "lucide-react";
import type { Branch, FinanceOfficer } from "@shared/schema";
import { cn } from "@/lib/utils";

const loanDetailsSchema = z.object({
  customerNo: z.string().optional(),
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  gender: z.string().optional(),
  nationalId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  age: z.coerce.number().optional(),
  homeAddress: z.string().optional(),
  district: z.string().optional(),
  phoneNumber: z.string().optional(),
  secondPhoneNumber: z.string().optional(),
  numberOfDependents: z.coerce.number().optional(),
  branchId: z.string().optional(),
  financeOfficerId: z.string().optional(),
  productName: z.string().optional(),
  productCode: z.string().optional(),
  sector: z.string().optional(),
  businessDescription: z.string().optional(),
  financingPurpose: z.string().optional(),
  sourceOfFund: z.string().optional(),
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
  collateralType: z.string().optional(),
  collateralProvince: z.string().optional(),
  collateralAddress: z.string().optional(),
  collateralPurchasedPrice: z.coerce.number().optional(),
  collateralMarketPrice: z.coerce.number().optional(),
  financialGuarantorFullName: z.string().optional(),
  financialGuarantorFatherName: z.string().optional(),
  financialGuarantorNid: z.string().optional(),
  financialGuarantorPhone: z.string().optional(),
  financialGuarantorHomeAddress: z.string().optional(),
  financialGuarantorDistrict: z.string().optional(),
  financialGuarantorBusiness: z.string().optional(),
  financialGuarantorBusinessAddress: z.string().optional(),
  financialGuarantorRelationship: z.string().optional(),
  financialGuarantorYearsOfExperience: z.coerce.number().optional(),
  financialGuarantorInventory: z.coerce.number().optional(),
  financialGuarantorMonthlyIncome: z.coerce.number().optional(),
  familyGuarantorFullName: z.string().optional(),
  familyGuarantorFatherName: z.string().optional(),
  familyGuarantorNid: z.string().optional(),
  familyGuarantorPhone: z.string().optional(),
  familyGuarantorHomeAddress: z.string().optional(),
  familyGuarantorDistrict: z.string().optional(),
  familyGuarantorRelationship: z.string().optional(),
});

type LoanDetailsFormData = z.infer<typeof loanDetailsSchema>;

const steps = [
  { id: 1, title: "Customer", icon: User, color: "from-green-500 to-emerald-500" },
  { id: 2, title: "Loan Details", icon: FileText, color: "from-yellow-500 to-amber-500" },
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

  useEffect(() => {
    if (loanData) {
      const d = loanData;
      form.reset({
        customerNo: d.customer?.customerNo || "",
        firstName: d.customer?.firstName || "",
        lastName: d.customer?.lastName || "",
        fatherName: d.customer?.fatherName || "",
        gender: d.customer?.gender || "male",
        nationalId: d.customer?.nationalId || "",
        dateOfBirth: d.customer?.dateOfBirth || "",
        placeOfBirth: d.customer?.placeOfBirth || "",
        homeAddress: d.customer?.homeAddress || "",
        district: d.customer?.district || "",
        phoneNumber: d.customer?.phoneNumber || "",
        secondPhoneNumber: d.customer?.secondPhoneNumber || "",
        numberOfDependents: d.customer?.numberOfDependents || 0,
        branchId: d.loan?.branchId || "",
        financeOfficerId: d.loan?.financeOfficerId || "",
        productName: d.loan?.productName || "",
        productCode: d.loan?.productCode || "",
        sector: d.loan?.sector || "",
        businessDescription: d.loan?.businessDescription || "",
        financingPurpose: d.loan?.financingPurpose || "",
        sourceOfFund: d.loan?.sourceOfFund || "",
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
        collateralType: d.collateral?.collateralType || "",
        collateralProvince: d.collateral?.province || "",
        collateralAddress: d.collateral?.address || "",
        collateralPurchasedPrice: parseFloat(d.collateral?.purchasedPrice) || 0,
        collateralMarketPrice: parseFloat(d.collateral?.marketPrice) || 0,
        financialGuarantorFullName: d.financialGuarantor?.fullName || "",
        financialGuarantorFatherName: d.financialGuarantor?.fatherName || "",
        financialGuarantorNid: d.financialGuarantor?.nationalId || "",
        financialGuarantorPhone: d.financialGuarantor?.phoneNumber || "",
        financialGuarantorHomeAddress: d.financialGuarantor?.homeAddress || "",
        financialGuarantorDistrict: d.financialGuarantor?.district || "",
        financialGuarantorBusiness: d.financialGuarantor?.business || "",
        financialGuarantorBusinessAddress: d.financialGuarantor?.businessAddress || "",
        financialGuarantorRelationship: d.financialGuarantor?.relationshipWithCustomer || "",
        financialGuarantorYearsOfExperience: d.financialGuarantor?.yearsOfExperience || 0,
        financialGuarantorInventory: parseFloat(d.financialGuarantor?.inventory) || 0,
        financialGuarantorMonthlyIncome: parseFloat(d.financialGuarantor?.monthlyIncome) || 0,
        familyGuarantorFullName: d.familyGuarantor?.fullName || "",
        familyGuarantorFatherName: d.familyGuarantor?.fatherName || "",
        familyGuarantorNid: d.familyGuarantor?.nationalId || "",
        familyGuarantorPhone: d.familyGuarantor?.phoneNumber || "",
        familyGuarantorHomeAddress: d.familyGuarantor?.homeAddress || "",
        familyGuarantorDistrict: d.familyGuarantor?.district || "",
        familyGuarantorRelationship: d.familyGuarantor?.relationshipWithCustomer || "",
      });
    }
  }, [loanData, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: LoanDetailsFormData) => {
      const response = await apiRequest("PUT", `/api/loan-applications/${loanId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Loan application updated successfully" });
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
                {loanData?.loan?.applicationId || "Loan Details"}
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
                    <FormItem><FormLabel>Dependents</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
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
                  <CardTitle>Loan Details</CardTitle>
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
                  <FormField control={form.control} name="sourceOfFund" render={({ field }) => (
                    <FormItem><FormLabel>Source of Fund</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="requestDate" render={({ field }) => (
                    <FormItem><FormLabel>Request Date</FormLabel><FormControl><Input type="date" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="requestAmount" render={({ field }) => (
                    <FormItem><FormLabel>Request Amount (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="financingDurationMonths" render={({ field }) => (
                    <FormItem><FormLabel>Duration (Months)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="gracePeriod" render={({ field }) => (
                    <FormItem><FormLabel>Grace Period</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="numberOfInstallments" render={({ field }) => (
                    <FormItem><FormLabel>Installments</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="principleAmount" render={({ field }) => (
                    <FormItem><FormLabel>Principle (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="marginRate" render={({ field }) => (
                    <FormItem><FormLabel>Margin Rate (%)</FormLabel><FormControl><Input type="number" step="0.01" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
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
                      <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
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
                    <FormItem><FormLabel>Purchased Price (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="collateralMarketPrice" render={({ field }) => (
                    <FormItem><FormLabel>Market Price (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
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
                    <FormField control={form.control} name="financialGuarantorNid" render={({ field }) => (
                      <FormItem><FormLabel>NID</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
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
                      <FormItem><FormLabel>Years of Exp</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorInventory" render={({ field }) => (
                      <FormItem><FormLabel>Inventory (AFN)</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorMonthlyIncome" render={({ field }) => (
                      <FormItem><FormLabel>Monthly Income</FormLabel><FormControl><Input type="number" disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
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
                    <FormField control={form.control} name="familyGuarantorNid" render={({ field }) => (
                      <FormItem><FormLabel>NID</FormLabel><FormControl><Input disabled={!isEditing} {...field} /></FormControl><FormMessage /></FormItem>
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
