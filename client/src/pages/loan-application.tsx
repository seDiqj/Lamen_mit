import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="space-y-3 p-3 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/loans")} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              New Loan Application
            </h1>
            <p className="text-xs text-muted-foreground">Step {currentStep} of 5</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => goToStep(step.id)}
              className={cn(
                "flex flex-col items-center gap-1 group cursor-pointer transition-all",
                currentStep === step.id ? "scale-105" : ""
              )}
              data-testid={`step-${step.id}`}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all",
                  currentStep === step.id
                    ? `bg-gradient-to-r ${step.color} text-white`
                    : currentStep > step.id
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  currentStep === step.id ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 rounded-full transition-all",
                  currentStep > step.id ? "bg-green-500" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Customer Information</CardTitle>
                    <p className="text-xs text-muted-foreground">Basic details about the customer</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <FormField control={form.control} name="customerNo" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Customer No</FormLabel>
                      <FormControl><Input placeholder="Auto-generated" className="h-9" {...field} data-testid="input-customer-no" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Full Name *</FormLabel>
                      <FormControl><Input placeholder="Customer full name" className="h-9" {...field} data-testid="input-first-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="fatherName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Father's Name</FormLabel>
                      <FormControl><Input placeholder="Father's name" className="h-9" {...field} data-testid="input-father-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9" data-testid="select-gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="nationalId" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">National ID (NID)</FormLabel>
                      <FormControl><Input placeholder="National ID" className="h-9" {...field} data-testid="input-nid" /></FormControl>
                      <FormMessage />
                    </FormItem>
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
                      <FormItem>
                        <FormLabel className="text-xs">Date of Birth</FormLabel>
                        <div className="flex gap-2 items-center">
                          <FormControl><Input type="date" className="h-9 flex-1" {...field} data-testid="input-dob" /></FormControl>
                          {age !== null && age >= 0 && (
                            <div className="h-9 px-3 flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md text-sm font-medium whitespace-nowrap" data-testid="text-age">
                              Age: {age}
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }} />
                  <FormField control={form.control} name="placeOfBirth" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Place of Birth</FormLabel>
                      <FormControl><Input placeholder="Place of birth" className="h-9" {...field} data-testid="input-pob" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="homeAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Home Address</FormLabel>
                      <FormControl><Input placeholder="Home address" className="h-9" {...field} data-testid="input-home-address" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="district" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">District</FormLabel>
                      <FormControl><Input placeholder="District" className="h-9" {...field} data-testid="input-district" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Phone Number</FormLabel>
                      <FormControl><Input placeholder="Phone number" className="h-9" {...field} data-testid="input-phone" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="secondPhoneNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">2nd Phone Number</FormLabel>
                      <FormControl><Input placeholder="Secondary phone" className="h-9" {...field} data-testid="input-phone-2" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="numberOfDependents" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">No. of Dependents</FormLabel>
                      <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-dependents" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="directMaleDependent" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Direct Male Employee</FormLabel>
                      <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-direct-male-dep" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="directFemaleDependent" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Direct Female Employee</FormLabel>
                      <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-direct-female-dep" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="indirectMaleDependent" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Indirect Male Employee</FormLabel>
                      <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-indirect-male-dep" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="indirectFemaleDependent" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Indirect Female Employee</FormLabel>
                      <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-indirect-female-dep" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-yellow-500 to-amber-500" />
              <CardHeader className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Loan Details</CardTitle>
                    <p className="text-xs text-muted-foreground">Loan product and financing information</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <FormField control={form.control} name="branchId" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Branch</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9" data-testid="select-branch"><SelectValue placeholder="Select branch" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="financeOfficerId" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Finance Officer</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9" data-testid="select-officer"><SelectValue placeholder="Select officer" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {financeOfficers.map((officer) => (
                            <SelectItem key={officer.id} value={officer.id}>{officer.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="productName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Product Name</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          const product = loanProducts.find(p => p.name === value);
                          if (product) {
                            form.setValue("productCode", product.code);
                          }
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9" data-testid="select-product-name">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loanProducts.map((product) => (
                            <SelectItem key={product.code} value={product.name}>
                              {product.code} - {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="productCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Product Code</FormLabel>
                      <FormControl><Input readOnly className="bg-muted h-9" placeholder="Auto-filled" {...field} data-testid="input-product-code" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="sector" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Sector</FormLabel>
                      <FormControl><Input placeholder="e.g., Transportation" className="h-9" {...field} data-testid="input-sector" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="businessDescription" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Business</FormLabel>
                      <FormControl><Input placeholder="e.g., Three wheel motorcycle" className="h-9" {...field} data-testid="input-business-desc" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="financingPurpose" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Financing Purpose</FormLabel>
                      <FormControl><Input placeholder="Purpose of loan" className="h-9" {...field} data-testid="input-financing-purpose" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="requestDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Request Date</FormLabel>
                      <FormControl><Input type="date" className="h-9" {...field} data-testid="input-request-date" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="requestAmount" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Request Amount (AFN)</FormLabel>
                      <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-request-amount" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="financingDurationMonths" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Duration (Months)</FormLabel>
                      <FormControl><Input type="number" placeholder="12" className="h-9" {...field} data-testid="input-duration" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="gracePeriod" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Grace Period</FormLabel>
                      <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-grace-period" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="numberOfInstallments" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">No. of Installments</FormLabel>
                      <FormControl><Input type="number" placeholder="12" className="h-9" {...field} data-testid="input-installments" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="principleAmount" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Principle Amount (AFN)</FormLabel>
                      <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-principle" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="marginRate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Margin Rate (%)</FormLabel>
                      <FormControl><Input type="number" step="0.01" placeholder="0" className="h-9" {...field} data-testid="input-margin-rate" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <CardHeader className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Business & License Information</CardTitle>
                    <p className="text-xs text-muted-foreground">Customer's business details and license</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2">Business Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <FormField control={form.control} name="businessName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Business Name</FormLabel>
                        <FormControl><Input placeholder="Business name" className="h-9" {...field} data-testid="input-business-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="businessProvince" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Province</FormLabel>
                        <FormControl><Input placeholder="Province" className="h-9" {...field} data-testid="input-business-province" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="businessDistrict" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">District</FormLabel>
                        <FormControl><Input placeholder="District" className="h-9" {...field} data-testid="input-business-district" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="businessVillage" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Village</FormLabel>
                        <FormControl><Input placeholder="Village" className="h-9" {...field} data-testid="input-business-village" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="businessDetailedAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Detailed Address</FormLabel>
                        <FormControl><Input placeholder="Detailed address" className="h-9" {...field} data-testid="input-business-address" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="businessYearsOfExperience" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Years of Experience</FormLabel>
                        <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-business-experience" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
                <div className="border-t pt-3">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2">License Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <FormField control={form.control} name="licenseType" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Type of License</FormLabel>
                        <FormControl><Input placeholder="License type" className="h-9" {...field} data-testid="input-license-type" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="licensePresident" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">President</FormLabel>
                        <FormControl><Input placeholder="President name" className="h-9" {...field} data-testid="input-license-president" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">License Number</FormLabel>
                        <FormControl><Input placeholder="License number" className="h-9" {...field} data-testid="input-license-number" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="licenseRegisterDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Register Date</FormLabel>
                        <FormControl><Input type="date" className="h-9" {...field} data-testid="input-license-register-date" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="licenseExpiryDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Expiry Date</FormLabel>
                        <FormControl><Input type="date" className="h-9" {...field} data-testid="input-license-expiry-date" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardHeader className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Collateral Information</CardTitle>
                    <p className="text-xs text-muted-foreground">Security/collateral details for the loan</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <FormField control={form.control} name="collateralOwnerName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Owner Name(s)</FormLabel>
                      <FormControl><Input placeholder="Owner name" className="h-9" {...field} data-testid="input-collateral-owner" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="collateralOwnerNid" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Owner NID</FormLabel>
                      <FormControl><Input placeholder="Owner national ID" className="h-9" {...field} data-testid="input-collateral-nid" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="collateralType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Type</FormLabel>
                      <FormControl><Input placeholder="e.g., Raksha, Property" className="h-9" {...field} data-testid="input-collateral-type" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="collateralProvince" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Province</FormLabel>
                      <FormControl><Input placeholder="Province" className="h-9" {...field} data-testid="input-collateral-province" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="collateralAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Address</FormLabel>
                      <FormControl><Input placeholder="Collateral address" className="h-9" {...field} data-testid="input-collateral-address" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="collateralPurchasedPrice" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Purchased Price (AFN)</FormLabel>
                      <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-collateral-purchased" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="collateralMarketPrice" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Market Price (AFN)</FormLabel>
                      <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-collateral-market" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 5 && (
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
              <CardHeader className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Guarantor Information</CardTitle>
                    <p className="text-xs text-muted-foreground">Financial and family guarantor details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-teal-600 mb-2 flex items-center gap-1">
                    <Users className="h-3 w-3" /> Financial Guarantor
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <FormField control={form.control} name="financialGuarantorFullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Full Name</FormLabel>
                        <FormControl><Input placeholder="Full name" className="h-9" {...field} data-testid="input-fin-guarantor-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorFatherName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Father's Name</FormLabel>
                        <FormControl><Input placeholder="Father's name" className="h-9" {...field} data-testid="input-fin-guarantor-father" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorNid" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">NID</FormLabel>
                        <FormControl><Input placeholder="National ID" className="h-9" {...field} data-testid="input-fin-guarantor-nid" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Phone</FormLabel>
                        <FormControl><Input placeholder="Phone number" className="h-9" {...field} data-testid="input-fin-guarantor-phone" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorHomeAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Home Address</FormLabel>
                        <FormControl><Input placeholder="Home address" className="h-9" {...field} data-testid="input-fin-guarantor-address" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorDistrict" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">District</FormLabel>
                        <FormControl><Input placeholder="District" className="h-9" {...field} data-testid="input-fin-guarantor-district" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorBusiness" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Business</FormLabel>
                        <FormControl><Input placeholder="Business type" className="h-9" {...field} data-testid="input-fin-guarantor-business" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorBusinessAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Business Address</FormLabel>
                        <FormControl><Input placeholder="Business address" className="h-9" {...field} data-testid="input-fin-guarantor-biz-address" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorRelationship" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Relationship</FormLabel>
                        <FormControl><Input placeholder="Relationship" className="h-9" {...field} data-testid="input-fin-guarantor-relation" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorYearsOfExperience" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Years of Experience</FormLabel>
                        <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-fin-guarantor-exp" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorInventory" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Inventory (AFN)</FormLabel>
                        <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-fin-guarantor-inventory" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorMonthlyIncome" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Monthly Income (AFN)</FormLabel>
                        <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-fin-guarantor-income" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
                <div className="border-t pt-3">
                  <h3 className="text-xs font-semibold text-cyan-600 mb-2 flex items-center gap-1">
                    <Users className="h-3 w-3" /> Family Guarantor
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <FormField control={form.control} name="familyGuarantorFullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Full Name</FormLabel>
                        <FormControl><Input placeholder="Full name" className="h-9" {...field} data-testid="input-fam-guarantor-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorFatherName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Father's Name</FormLabel>
                        <FormControl><Input placeholder="Father's name" className="h-9" {...field} data-testid="input-fam-guarantor-father" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorNid" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">NID</FormLabel>
                        <FormControl><Input placeholder="National ID" className="h-9" {...field} data-testid="input-fam-guarantor-nid" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Phone</FormLabel>
                        <FormControl><Input placeholder="Phone number" className="h-9" {...field} data-testid="input-fam-guarantor-phone" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorHomeAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Home Address</FormLabel>
                        <FormControl><Input placeholder="Home address" className="h-9" {...field} data-testid="input-fam-guarantor-address" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorDistrict" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">District</FormLabel>
                        <FormControl><Input placeholder="District" className="h-9" {...field} data-testid="input-fam-guarantor-district" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorRelationship" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Relationship</FormLabel>
                        <FormControl><Input placeholder="Relationship" className="h-9" {...field} data-testid="input-fam-guarantor-relation" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              data-testid="button-prev"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            {currentStep === 5 ? (
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                data-testid="button-submit"
              >
                {submitMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Submit Application
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
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
