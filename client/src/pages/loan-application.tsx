import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  User, FileText, Building2, Shield, Users, 
  ChevronLeft, ChevronRight, Save, ArrowLeft, Loader2, Check
} from "lucide-react";
import type { Branch, FinanceOfficer, FundingSource } from "@shared/schema";
import { cn } from "@/lib/utils";

const loanApplicationSchema = z.object({
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

type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>;

const steps = [
  { id: 1, title: "Customer", icon: User, color: "from-green-500 to-emerald-500" },
  { id: 2, title: "Loan", icon: FileText, color: "from-yellow-500 to-amber-500" },
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

export default function LoanApplicationPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);

  const { data: branches = [] } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: financeOfficers = [] } = useQuery<FinanceOfficer[]>({ queryKey: ["/api/finance-officers"] });
  const { data: fundingSources = [] } = useQuery<FundingSource[]>({ queryKey: ["/api/funding-sources"] });

  const form = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      gender: "male",
      requestDate: new Date().toISOString().split("T")[0],
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: LoanApplicationFormData) => {
      const response = await apiRequest("POST", "/api/loan-applications", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Loan application created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      navigate(`/loans`);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: LoanApplicationFormData) => {
    submitMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const CompactField = ({ name, label, type = "text", placeholder = "", readOnly = false, ...props }: any) => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem className="space-y-0.5">
        <FormLabel className="text-xs font-medium text-muted-foreground">{label}</FormLabel>
        <FormControl>
          <Input 
            type={type} 
            placeholder={placeholder} 
            readOnly={readOnly}
            className={cn("h-8 text-sm", readOnly && "bg-muted")}
            {...field} 
            {...props}
          />
        </FormControl>
        <FormMessage className="text-xs" />
      </FormItem>
    )} />
  );

  return (
    <div className="flex flex-col h-full p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/loans")} data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            New Loan Application
          </h1>
        </div>
        <div className="flex items-center gap-1">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => goToStep(step.id)}
                className="flex items-center gap-1 group"
                data-testid={`step-${step.id}`}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                    currentStep === step.id
                      ? `bg-gradient-to-r ${step.color} text-white shadow`
                      : currentStep > step.id
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? <Check className="h-3 w-3" /> : step.id}
                </div>
                <span className={cn(
                  "text-xs hidden lg:block",
                  currentStep === step.id ? "font-medium" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-4 h-0.5 mx-1 rounded",
                  currentStep > step.id ? "bg-green-500" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
          <Card className="flex-1 border shadow-sm overflow-auto">
            <CardContent className="p-3">
              {currentStep === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <div className="h-6 w-6 rounded bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Customer Information</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    <CompactField name="customerNo" label="Customer No" placeholder="Auto" />
                    <CompactField name="firstName" label="Name *" placeholder="Name" data-testid="input-first-name" />
                    <CompactField name="fatherName" label="Father Name" placeholder="Father" />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem className="space-y-0.5">
                        <FormLabel className="text-xs font-medium text-muted-foreground">Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <CompactField name="nationalId" label="NID" placeholder="National ID" />
                    <CompactField name="dateOfBirth" label="Date of Birth" type="date" />
                    <CompactField name="placeOfBirth" label="Place of Birth" placeholder="Place" />
                    <CompactField name="homeAddress" label="Home Address" placeholder="Address" />
                    <CompactField name="district" label="District" placeholder="District" />
                    <CompactField name="phoneNumber" label="Phone" placeholder="Phone" />
                    <CompactField name="secondPhoneNumber" label="2nd Phone" placeholder="Alt phone" />
                    <CompactField name="numberOfDependents" label="Dependents" type="number" placeholder="0" />
                    <CompactField name="directMaleDependent" label="Dir. Male Dep" type="number" placeholder="0" />
                    <CompactField name="directFemaleDependent" label="Dir. Female Dep" type="number" placeholder="0" />
                    <CompactField name="indirectMaleDependent" label="Ind. Male Dep" type="number" placeholder="0" />
                    <CompactField name="indirectFemaleDependent" label="Ind. Female Dep" type="number" placeholder="0" />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <div className="h-6 w-6 rounded bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                      <FileText className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Loan Details</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    <FormField control={form.control} name="branchId" render={({ field }) => (
                      <FormItem className="space-y-0.5">
                        <FormLabel className="text-xs font-medium text-muted-foreground">Branch</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>{branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financeOfficerId" render={({ field }) => (
                      <FormItem className="space-y-0.5">
                        <FormLabel className="text-xs font-medium text-muted-foreground">Officer</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>{financeOfficers.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="productName" render={({ field }) => (
                      <FormItem className="space-y-0.5">
                        <FormLabel className="text-xs font-medium text-muted-foreground">Product</FormLabel>
                        <Select 
                          onValueChange={(v) => { field.onChange(v); const p = loanProducts.find(x => x.name === v); if(p) form.setValue("productCode", p.code); }} 
                          value={field.value}
                        >
                          <FormControl><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>{loanProducts.map((p) => <SelectItem key={p.code} value={p.name}>{p.code} - {p.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <CompactField name="productCode" label="Code" readOnly placeholder="Auto" />
                    <CompactField name="sector" label="Sector" placeholder="e.g., Transport" />
                    <CompactField name="businessDescription" label="Business" placeholder="Description" />
                    <CompactField name="financingPurpose" label="Purpose" placeholder="Loan purpose" />
                    <FormField control={form.control} name="fundingSourceId" render={({ field }) => (
                      <FormItem className="space-y-0.5">
                        <FormLabel className="text-xs font-medium text-muted-foreground">Fund Source</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>{fundingSources.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <CompactField name="requestDate" label="Request Date" type="date" />
                    <CompactField name="requestAmount" label="Amount (AFN)" type="number" placeholder="0" />
                    <CompactField name="financingDurationMonths" label="Duration (Mo)" type="number" placeholder="12" />
                    <CompactField name="gracePeriod" label="Grace Period" type="number" placeholder="0" />
                    <CompactField name="numberOfInstallments" label="Installments" type="number" placeholder="12" />
                    <CompactField name="principleAmount" label="Principle (AFN)" type="number" placeholder="0" />
                    <CompactField name="marginRate" label="Margin %" type="number" step="0.01" placeholder="0" />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Building2 className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Business & License</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    <CompactField name="businessName" label="Business Name" placeholder="Name" />
                    <CompactField name="businessProvince" label="Province" placeholder="Province" />
                    <CompactField name="businessDistrict" label="District" placeholder="District" />
                    <CompactField name="businessVillage" label="Village" placeholder="Village" />
                    <CompactField name="businessDetailedAddress" label="Address" placeholder="Address" />
                    <CompactField name="businessYearsOfExperience" label="Experience (Yrs)" type="number" placeholder="0" />
                    <CompactField name="licenseType" label="License Type" placeholder="Type" />
                    <CompactField name="licensePresident" label="President" placeholder="Name" />
                    <CompactField name="licenseNumber" label="License No" placeholder="Number" />
                    <CompactField name="licenseRegisterDate" label="Register Date" type="date" />
                    <CompactField name="licenseExpiryDate" label="Expiry Date" type="date" />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <div className="h-6 w-6 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Collateral Information</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    <CompactField name="collateralOwnerName" label="Owner Name" placeholder="Name" />
                    <CompactField name="collateralOwnerNid" label="Owner NID" placeholder="NID" />
                    <CompactField name="collateralType" label="Type" placeholder="e.g., Property" />
                    <CompactField name="collateralProvince" label="Province" placeholder="Province" />
                    <CompactField name="collateralAddress" label="Address" placeholder="Address" />
                    <CompactField name="collateralPurchasedPrice" label="Purchased (AFN)" type="number" placeholder="0" />
                    <CompactField name="collateralMarketPrice" label="Market (AFN)" type="number" placeholder="0" />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <div className="h-6 w-6 rounded bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Guarantors</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-teal-600 mb-1 block">Financial Guarantor</span>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        <CompactField name="financialGuarantorFullName" label="Full Name" placeholder="Name" />
                        <CompactField name="financialGuarantorFatherName" label="Father Name" placeholder="Father" />
                        <CompactField name="financialGuarantorNid" label="NID" placeholder="NID" />
                        <CompactField name="financialGuarantorPhone" label="Phone" placeholder="Phone" />
                        <CompactField name="financialGuarantorHomeAddress" label="Address" placeholder="Address" />
                        <CompactField name="financialGuarantorDistrict" label="District" placeholder="District" />
                        <CompactField name="financialGuarantorBusiness" label="Business" placeholder="Business" />
                        <CompactField name="financialGuarantorBusinessAddress" label="Biz Address" placeholder="Address" />
                        <CompactField name="financialGuarantorRelationship" label="Relationship" placeholder="Relation" />
                        <CompactField name="financialGuarantorYearsOfExperience" label="Experience" type="number" placeholder="0" />
                        <CompactField name="financialGuarantorInventory" label="Inventory (AFN)" type="number" placeholder="0" />
                        <CompactField name="financialGuarantorMonthlyIncome" label="Monthly Inc (AFN)" type="number" placeholder="0" />
                      </div>
                    </div>
                    <div className="border-t pt-2">
                      <span className="text-xs font-semibold text-cyan-600 mb-1 block">Family Guarantor</span>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        <CompactField name="familyGuarantorFullName" label="Full Name" placeholder="Name" />
                        <CompactField name="familyGuarantorFatherName" label="Father Name" placeholder="Father" />
                        <CompactField name="familyGuarantorNid" label="NID" placeholder="NID" />
                        <CompactField name="familyGuarantorPhone" label="Phone" placeholder="Phone" />
                        <CompactField name="familyGuarantorHomeAddress" label="Address" placeholder="Address" />
                        <CompactField name="familyGuarantorDistrict" label="District" placeholder="District" />
                        <CompactField name="familyGuarantorRelationship" label="Relationship" placeholder="Relation" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-3 border-t mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 1}
              data-testid="button-prev"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-xs text-muted-foreground">Step {currentStep} of 5</span>
            {currentStep === 5 ? (
              <Button
                type="submit"
                size="sm"
                disabled={submitMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600"
                data-testid="button-submit"
              >
                {submitMutation.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                Submit
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={nextStep}
                className="bg-gradient-to-r from-amber-500 to-yellow-500"
                data-testid="button-next"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
