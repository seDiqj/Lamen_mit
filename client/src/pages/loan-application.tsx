import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  User, FileText, Building2, Shield, Users, FolderUp,
  ChevronLeft, ChevronRight, Save, ArrowLeft, Loader2, Check,
  Camera, Upload, X, File
} from "lucide-react";
import type { Branch, FinanceOfficer, FundingSource, Sector, Business, Province, District, LicenseType, FinancingPurpose } from "@shared/schema";
import { cn, toPersianDate } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const loanApplicationSchema = z.object({
  customerNo: z.string().optional(),
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  fullNameDari: z.string().optional(),
  fatherNameDari: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationalId: z.string().optional(),
  nidExpiryDate: z.string().optional(),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  age: z.coerce.number().optional(),
  homeAddress: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  areaType: z.string().optional().default("Rural"),
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
  businessDetailedDescription: z.string().optional(),
  clientOccupation: z.string().optional(),
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
  businessMonthlyIncomeAmount: z.coerce.number().optional(),
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
  financialGuarantorNid: z.string().optional(),
  financialGuarantorNidExpiry: z.string().optional(),
  financialGuarantorDateOfBirth: z.string().optional(),
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
  financialGuarantor2Nid: z.string().optional(),
  financialGuarantor2NidExpiry: z.string().optional(),
  financialGuarantor2DateOfBirth: z.string().optional(),
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
  familyGuarantorNid: z.string().optional(),
  familyGuarantorNidExpiry: z.string().optional(),
  familyGuarantorDateOfBirth: z.string().optional(),
  familyGuarantorPhone: z.string().optional(),
  familyGuarantorHomeAddress: z.string().optional(),
  familyGuarantorDistrict: z.string().optional(),
  familyGuarantorRelationship: z.string().optional(),
});

type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>;

const steps = [
  { id: 1, title: "Customer", icon: User, color: "from-green-500 to-emerald-500", docSection: "customer_info" },
  { id: 2, title: "Financing Details", icon: FileText, color: "from-yellow-500 to-amber-500", docSection: "financing_details" },
  { id: 3, title: "Business", icon: Building2, color: "from-blue-500 to-indigo-500", docSection: "business_license" },
  { id: 4, title: "Collateral", icon: Shield, color: "from-orange-500 to-red-500", docSection: "collateral" },
  { id: 5, title: "Guarantors", icon: Users, color: "from-teal-500 to-cyan-500", docSection: "guarantors" },
  { id: 6, title: "Documents", icon: FolderUp, color: "from-purple-500 to-violet-500", docSection: null },
];


interface UploadedDocument {
  section: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
}

const DOCUMENT_SECTIONS = [
  { value: "customer_info", label: "Customer Information" },
  { value: "financing_details", label: "Financing Details" },
  { value: "business_license", label: "Business & License" },
  { value: "collateral", label: "Collateral" },
  { value: "guarantors", label: "Guarantors" },
] as const;

const documentTypes = [
  "Tazkira",
  "Electricity Bill",
  "Qawala",
  "License Copy",
  "Bank Statement",
  "Business License",
  "Property Document",
  "Salary Slip",
  "Tax Certificate",
];

export default function LoanApplicationPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const prefilledCustomerId = searchParams.get("customerId");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [customerPhoto, setCustomerPhoto] = useState<{ url: string; name: string } | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [newDocSection, setNewDocSection] = useState("");
  const [newDocType, setNewDocType] = useState("");
  const [customDocType, setCustomDocType] = useState("");
  const [newDocName, setNewDocName] = useState("");
  const [customerPrefilled, setCustomerPrefilled] = useState(false);

  const { data: branches = [] } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: financeOfficers = [] } = useQuery<FinanceOfficer[]>({ queryKey: ["/api/finance-officers/active"] });
  const { data: fundingSources = [] } = useQuery<FundingSource[]>({ queryKey: ["/api/funding-sources"] });
  const { data: sectors = [] } = useQuery<Sector[]>({ queryKey: ["/api/sectors"] });
  const { data: businesses = [] } = useQuery<Business[]>({ queryKey: ["/api/businesses"] });
  const { data: provinces = [] } = useQuery<Province[]>({ queryKey: ["/api/provinces"] });
  const { data: districts = [] } = useQuery<(District & { provinceName?: string })[]>({ queryKey: ["/api/districts"] });
  const { data: licenseTypes = [] } = useQuery<LicenseType[]>({ queryKey: ["/api/license-types"] });
  const { data: financingPurposesList = [] } = useQuery<FinancingPurpose[]>({ queryKey: ["/api/financing-purposes"] });
  const { data: financingProducts = [] } = useQuery<any[]>({ queryKey: ["/api/financing-products"] });

  const loanProducts = financingProducts.length > 0
    ? financingProducts.filter((p: any) => p.isActive).map((p: any) => ({ code: p.code, name: p.name }))
    : [
        { code: "10", name: "Mudarabah" },
        { code: "11", name: "Murabaha" },
        { code: "12", name: "Musharakat" },
        { code: "13", name: "Qardul Hasana" },
      ];

  const { data: prefilledCustomer } = useQuery<any>({
    queryKey: ["/api/customers", prefilledCustomerId],
    queryFn: async () => {
      if (!prefilledCustomerId) return null;
      const res = await fetch(`/api/customers/${prefilledCustomerId}`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!prefilledCustomerId,
  });

  const form = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      gender: "male",
      maritalStatus: "",
      requestDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (user) {
      const currentValues = form.getValues();
      if (!currentValues.branchId && (user as any).branchId) {
        form.setValue("branchId", (user as any).branchId);
      }
      if (!currentValues.financeOfficerId && (user as any).financeOfficerId) {
        form.setValue("financeOfficerId", (user as any).financeOfficerId);
      }
    }
  }, [user, form]);

  useEffect(() => {
    if (prefilledCustomer && !customerPrefilled) {
      setCustomerPrefilled(true);
      form.reset({
        ...form.getValues(),
        customerNo: prefilledCustomer.customerNo || "",
        firstName: prefilledCustomer.firstName || "",
        lastName: prefilledCustomer.lastName || "",
        fatherName: prefilledCustomer.fatherName || "",
        fullNameDari: prefilledCustomer.fullNameDari || "",
        fatherNameDari: prefilledCustomer.fatherNameDari || "",
        gender: prefilledCustomer.gender || "male",
        maritalStatus: prefilledCustomer.maritalStatus || "",
        nationalId: prefilledCustomer.nationalId || "",
        nidExpiryDate: prefilledCustomer.nidExpiryDate || "",
        dateOfBirth: prefilledCustomer.dateOfBirth || "",
        placeOfBirth: prefilledCustomer.placeOfBirth || "",
        age: prefilledCustomer.age || undefined,
        homeAddress: prefilledCustomer.homeAddress || "",
        province: prefilledCustomer.province || "",
        district: prefilledCustomer.district || "",
        areaType: prefilledCustomer.areaType || "Rural",
        phoneNumber: prefilledCustomer.phoneNumber || "",
        secondPhoneNumber: prefilledCustomer.secondPhoneNumber || "",
        numberOfDependents: prefilledCustomer.numberOfDependents || undefined,
        directMaleDependent: prefilledCustomer.directMaleDependent || undefined,
        directFemaleDependent: prefilledCustomer.directFemaleDependent || undefined,
        indirectMaleDependent: prefilledCustomer.indirectMaleDependent || undefined,
        indirectFemaleDependent: prefilledCustomer.indirectFemaleDependent || undefined,
        requestDate: new Date().toISOString().split("T")[0],
      });
      if (prefilledCustomer.photoUrl) {
        setCustomerPhoto({ url: prefilledCustomer.photoUrl, name: "Customer Photo" });
      }
    }
  }, [prefilledCustomer, customerPrefilled, form]);

  const { data: loanCycleData } = useQuery<{
    totalLoans: number;
    activeLoans: number;
    completedLoans: number;
    defaultedLoans: number;
    pendingLoans: number;
    lastCycle: number;
    nextCycle: number;
  }>({
    queryKey: ["/api/customers", prefilledCustomerId, "loan-cycle"],
    queryFn: async () => {
      if (!prefilledCustomerId) return null;
      const res = await fetch(`/api/customers/${prefilledCustomerId}/loan-cycle`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!prefilledCustomerId,
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const response = await fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Upload failed");
      const result = await response.json();
      setCustomerPhoto({ url: result.url, name: result.filename });
      toast({ title: "Success", description: "Photo uploaded successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to upload photo", variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const resolvedDocType = newDocType === "__custom" ? customDocType : newDocType;

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !resolvedDocType || !newDocSection) {
      toast({ title: "Error", description: "Please select a section and document type first", variant: "destructive" });
      return;
    }
    
    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append("document", file);
      const response = await fetch("/api/upload/document", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Upload failed");
      const result = await response.json();
      setDocuments([...documents, {
        section: newDocSection,
        documentType: resolvedDocType,
        fileName: newDocName || result.filename,
        fileUrl: result.url,
      }]);
      setNewDocSection("");
      setNewDocType("");
      setCustomDocType("");
      setNewDocName("");
      toast({ title: "Success", description: "Document uploaded successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to upload document", variant: "destructive" });
    } finally {
      setUploadingDoc(false);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const submitMutation = useMutation({
    mutationFn: async (data: LoanApplicationFormData) => {
      const response = await apiRequest("POST", "/api/loan-applications", {
        ...data,
        existingCustomerId: prefilledCustomerId || undefined,
        customerPhoto: customerPhoto?.url,
        documents,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Financing application created successfully" });
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
  
  const handleManualSubmit = () => {
    if (currentStep !== 6) {
      return;
    }
    form.handleSubmit(onSubmit)();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA') {
        return;
      }
      if (currentStep !== 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
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
            <p className="text-xs text-muted-foreground">
              {prefilledCustomer
                ? `For: ${prefilledCustomer.firstName} ${prefilledCustomer.lastName || ""} ${prefilledCustomer.customerNo ? `(${prefilledCustomer.customerNo})` : ""}`
                : `Step ${currentStep} of 6`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const docCount = step.docSection ? documents.filter(d => d.section === step.docSection).length : 0;
          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => goToStep(step.id)}
                className={cn(
                  "flex flex-col items-center gap-1 group cursor-pointer transition-all relative",
                  currentStep === step.id ? "scale-105" : ""
                )}
                data-testid={`step-${step.id}`}
              >
                <div className="relative">
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
                  {docCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 text-[10px] bg-blue-600 hover:bg-blue-600 text-white rounded-full flex items-center justify-center" data-testid={`badge-docs-step-${step.id}`}>
                      {docCount}
                    </Badge>
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
          );
        })}
      </div>

      <Form {...form}>
        <form onKeyDown={handleKeyDown}>
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
                {loanCycleData && prefilledCustomerId && (
                  <div className="mb-4 p-3 rounded-lg border bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800" data-testid="loan-cycle-info">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
                        <span className="text-white font-bold text-sm">{loanCycleData.nextCycle}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                          Financing Cycle #{loanCycleData.nextCycle}
                        </p>
                        <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                          {loanCycleData.totalLoans === 0
                            ? "First-time borrower"
                            : `Returning customer — ${loanCycleData.totalLoans} previous financing(s)`}
                        </p>
                      </div>
                    </div>
                    {loanCycleData.totalLoans > 0 && (
                      <div className="flex gap-3 mt-2">
                        {loanCycleData.completedLoans > 0 && (
                          <Badge variant="outline" className="text-[11px] bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700">
                            <Check className="h-3 w-3 mr-1" />
                            {loanCycleData.completedLoans} Completed
                          </Badge>
                        )}
                        {loanCycleData.activeLoans > 0 && (
                          <Badge variant="outline" className="text-[11px] bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700">
                            {loanCycleData.activeLoans} Active
                          </Badge>
                        )}
                        {loanCycleData.pendingLoans > 0 && (
                          <Badge variant="outline" className="text-[11px] bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700">
                            {loanCycleData.pendingLoans} Pending
                          </Badge>
                        )}
                        {loanCycleData.defaultedLoans > 0 && (
                          <Badge variant="outline" className="text-[11px] bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700">
                            {loanCycleData.defaultedLoans} Defaulted
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <FormField control={form.control} name="customerNo" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Customer No</FormLabel>
                      <FormControl><Input placeholder="Select branch to auto-generate" className="h-9 bg-muted/50" readOnly {...field} data-testid="input-customer-no" /></FormControl>
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
                  <FormField control={form.control} name="fullNameDari" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Full Name (Dari)</FormLabel>
                      <FormControl><Input placeholder="نام مکمل" className="h-9" {...field} data-testid="input-fullNameDari" dir="rtl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="fatherNameDari" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Father's Name (Dari)</FormLabel>
                      <FormControl><Input placeholder="نام پدر" className="h-9" {...field} data-testid="input-fatherNameDari" dir="rtl" /></FormControl>
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
                  <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9" data-testid="select-maritalStatus"><SelectValue placeholder="Select marital status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
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
                  <FormField control={form.control} name="nidExpiryDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">NID Expiry Date {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
                      <FormControl><Input type="date" className="h-9" {...field} data-testid="input-nid-expiry" /></FormControl>
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
                        <FormLabel className="text-xs">Date of Birth {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
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
                  <FormField control={form.control} name="province" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Province</FormLabel>
                      <Select onValueChange={(value) => {
                        const prov = provinces.find(p => p.id.toString() === value);
                        field.onChange(prov?.name || "");
                        form.setValue("district", "");
                      }} value={provinces.find(p => p.name === field.value)?.id.toString() || ""}>
                        <FormControl>
                          <SelectTrigger className="h-9" data-testid="select-customer-province">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinces.map((prov) => (
                            <SelectItem key={prov.id} value={prov.id.toString()}>{prov.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="district" render={({ field }) => {
                    const selectedProvince = provinces.find(p => p.name === form.watch("province"));
                    const customerDistricts = districts.filter(d => d.provinceId === selectedProvince?.id);
                    return (
                      <FormItem>
                        <FormLabel className="text-xs">District</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const dist = customerDistricts.find(d => d.id.toString() === value);
                            field.onChange(dist?.name || "");
                          }}
                          value={customerDistricts.find(d => d.name === field.value)?.id.toString() || ""}
                          disabled={!selectedProvince}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9" data-testid="select-customer-district">
                              <SelectValue placeholder={selectedProvince ? "Select district" : "Select province first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customerDistricts.map((dist) => (
                              <SelectItem key={dist.id} value={dist.id.toString()}>{dist.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }} />
                  <FormField control={form.control} name="areaType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Urban / Rural</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "Rural"}>
                        <FormControl>
                          <SelectTrigger className="h-9" data-testid="select-customer-area-type">
                            <SelectValue placeholder="Select area type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Urban">Urban</SelectItem>
                          <SelectItem value="Rural">Rural</SelectItem>
                        </SelectContent>
                      </Select>
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

                {/* Customer Photo Section */}
                <div className="border-t pt-3 mt-4">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-3">Customer Photo</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                        {customerPhoto ? (
                          <img src={customerPhoto.url} alt="Customer" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                            disabled={uploadingPhoto}
                            data-testid="input-customer-photo"
                          />
                          <Button type="button" variant="outline" size="sm" asChild disabled={uploadingPhoto}>
                            <span>
                              {uploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                              Upload Photo
                            </span>
                          </Button>
                        </label>
                        {customerPhoto && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => setCustomerPhoto(null)} data-testid="button-remove-photo">
                            <X className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
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
                    <CardTitle className="text-base">Financing Details</CardTitle>
                    <p className="text-xs text-muted-foreground">Product and financing information</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <FormField control={form.control} name="branchId" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Branch</FormLabel>
                      <Select onValueChange={(val) => {
                        field.onChange(val);
                        if (!prefilledCustomerId) {
                          fetch(`/api/customers/next-number/${val}`, { credentials: "include" })
                            .then(r => r.json())
                            .then(data => { if (data.customerNo) form.setValue("customerNo", data.customerNo); })
                            .catch(() => {});
                        }
                      }} value={field.value}>
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
                      <Select onValueChange={(value) => {
                        const sector = sectors.find(s => s.id === value);
                        field.onChange(sector?.name || "");
                        form.setValue("businessDescription", "");
                      }} value={sectors.find(s => s.name === field.value)?.id || ""}>
                        <FormControl>
                          <SelectTrigger className="h-9" data-testid="select-sector">
                            <SelectValue placeholder="Select sector" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sectors.map((sector) => (
                            <SelectItem key={sector.id} value={sector.id}>
                              {sector.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="businessDescription" render={({ field }) => {
                    const selectedSector = sectors.find(s => s.name === form.watch("sector"));
                    const sectorBusinesses = businesses.filter(b => b.sectorId === selectedSector?.id);
                    return (
                      <FormItem>
                        <FormLabel className="text-xs">Business</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            const business = sectorBusinesses.find(b => b.id === value);
                            field.onChange(business?.name || "");
                          }} 
                          value={sectorBusinesses.find(b => b.name === field.value)?.id || ""} 
                          disabled={!selectedSector}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9" data-testid="select-business">
                              <SelectValue placeholder={selectedSector ? "Select business" : "Select sector first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sectorBusinesses.map((business) => (
                              <SelectItem key={business.id} value={business.id}>
                                {business.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }} />
                  <FormField control={form.control} name="financingPurpose" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Financing Purpose</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="h-9" data-testid="select-financing-purpose">
                            <SelectValue placeholder="Select financing purpose" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {financingPurposesList.map((fp) => (
                            <SelectItem key={fp.id} value={fp.name}>
                              {fp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="requestDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Request Date {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
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
                  <FormField control={form.control} name="numberOfInstallments" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">No. of Installments</FormLabel>
                      <FormControl><Input type="number" placeholder="12" className="h-9" {...field} data-testid="input-installments" /></FormControl>
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
                        <Select onValueChange={(value) => {
                          const province = provinces.find(p => p.id.toString() === value);
                          field.onChange(province?.name || "");
                          form.setValue("businessDistrict", "");
                        }} value={provinces.find(p => p.name === field.value)?.id.toString() || ""}>
                          <FormControl>
                            <SelectTrigger className="h-9" data-testid="select-business-province">
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinces.map((province) => (
                              <SelectItem key={province.id} value={province.id.toString()}>
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="businessDistrict" render={({ field }) => {
                      const selectedProvince = provinces.find(p => p.name === form.watch("businessProvince"));
                      const provinceDistricts = districts.filter(d => d.provinceId === selectedProvince?.id);
                      return (
                        <FormItem>
                          <FormLabel className="text-xs">District</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              const district = provinceDistricts.find(d => d.id.toString() === value);
                              field.onChange(district?.name || "");
                            }} 
                            value={provinceDistricts.find(d => d.name === field.value)?.id.toString() || ""} 
                            disabled={!selectedProvince}
                          >
                            <FormControl>
                              <SelectTrigger className="h-9" data-testid="select-business-district">
                                <SelectValue placeholder={selectedProvince ? "Select district" : "Select province first"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinceDistricts.map((district) => (
                                <SelectItem key={district.id} value={district.id.toString()}>
                                  {district.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }} />
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
                    <FormField control={form.control} name="businessMonthlyIncomeAmount" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Monthly Income Amount</FormLabel>
                        <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-business-monthly-income" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="clientOccupation" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Client Occupation</FormLabel>
                        <FormControl><Input placeholder="Client's occupation" className="h-9" {...field} data-testid="input-client-occupation" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="businessDetailedDescription" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-xs">Business Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe the business activities..." className="min-h-[60px]" {...field} data-testid="input-business-detailed-description" /></FormControl>
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
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="h-9" data-testid="select-license-type">
                              <SelectValue placeholder="Select license type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {licenseTypes.map((lt) => (
                              <SelectItem key={lt.id} value={lt.name}>{lt.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <FormLabel className="text-xs">Register Date {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
                        <FormControl><Input type="date" className="h-9" {...field} data-testid="input-license-register-date" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="licenseExpiryDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Expiry Date {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
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
                  <FormField control={form.control} name="collateralOwnerNidExpiry" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Owner NID Expiry Date {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
                      <FormControl><Input type="date" className="h-9" {...field} data-testid="input-collateral-nid-expiry" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="collateralType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="h-9" data-testid="select-collateral-type">
                            <SelectValue placeholder="Select collateral type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sharyee">Sharyee</SelectItem>
                          <SelectItem value="Urfee">Urfee</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormField control={form.control} name="financialGuarantorNidExpiry" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">NID Expiry Date {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
                        <FormControl><Input type="date" className="h-9" {...field} data-testid="input-fin-guarantor-nid-expiry" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantorDateOfBirth" render={({ field }) => {
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
                      const isInvalidAge = age !== null && (age < 18 || age > 65);
                      return (
                        <FormItem>
                          <FormLabel className="text-xs">Date of Birth {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
                          <div className="flex gap-2 items-center">
                            <FormControl><Input type="date" className="h-9 flex-1" {...field} data-testid="input-fin-guarantor-dob" /></FormControl>
                            {age !== null && age >= 0 && (
                              <div className={`h-9 px-3 flex items-center rounded-md text-sm font-medium whitespace-nowrap ${isInvalidAge ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`} data-testid="text-fin-guarantor-age">
                                Age: {age} {isInvalidAge && '(18-65 required)'}
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }} />
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
                  <h3 className="text-xs font-semibold text-teal-600 mb-2 flex items-center gap-1">
                    <Users className="h-3 w-3" /> Financial Guarantor 2
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <FormField control={form.control} name="financialGuarantor2FullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Full Name</FormLabel>
                        <FormControl><Input placeholder="Full name" className="h-9" {...field} data-testid="input-fin-guarantor2-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2FatherName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Father's Name</FormLabel>
                        <FormControl><Input placeholder="Father's name" className="h-9" {...field} data-testid="input-fin-guarantor2-father" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2Nid" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">NID</FormLabel>
                        <FormControl><Input placeholder="National ID" className="h-9" {...field} data-testid="input-fin-guarantor2-nid" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2NidExpiry" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">NID Expiry Date {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
                        <FormControl><Input type="date" className="h-9" {...field} data-testid="input-fin-guarantor2-nid-expiry" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2DateOfBirth" render={({ field }) => {
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
                      const isInvalidAge = age !== null && (age < 18 || age > 65);
                      return (
                        <FormItem>
                          <FormLabel className="text-xs">Date of Birth {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
                          <div className="flex gap-2 items-center">
                            <FormControl><Input type="date" className="h-9 flex-1" {...field} data-testid="input-fin-guarantor2-dob" /></FormControl>
                            {age !== null && age >= 0 && (
                              <div className={`h-9 px-3 flex items-center rounded-md text-sm font-medium whitespace-nowrap ${isInvalidAge ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`} data-testid="text-fin-guarantor2-age">
                                Age: {age} {isInvalidAge && '(18-65 required)'}
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }} />
                    <FormField control={form.control} name="financialGuarantor2Phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Phone</FormLabel>
                        <FormControl><Input placeholder="Phone number" className="h-9" {...field} data-testid="input-fin-guarantor2-phone" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2HomeAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Home Address</FormLabel>
                        <FormControl><Input placeholder="Home address" className="h-9" {...field} data-testid="input-fin-guarantor2-address" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2District" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">District</FormLabel>
                        <FormControl><Input placeholder="District" className="h-9" {...field} data-testid="input-fin-guarantor2-district" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2Business" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Business</FormLabel>
                        <FormControl><Input placeholder="Business type" className="h-9" {...field} data-testid="input-fin-guarantor2-business" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2BusinessAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Business Address</FormLabel>
                        <FormControl><Input placeholder="Business address" className="h-9" {...field} data-testid="input-fin-guarantor2-biz-address" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2Relationship" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Relationship</FormLabel>
                        <FormControl><Input placeholder="Relationship" className="h-9" {...field} data-testid="input-fin-guarantor2-relation" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2YearsOfExperience" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Years of Experience</FormLabel>
                        <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-fin-guarantor2-exp" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2Inventory" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Inventory (AFN)</FormLabel>
                        <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-fin-guarantor2-inventory" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="financialGuarantor2MonthlyIncome" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Monthly Income (AFN)</FormLabel>
                        <FormControl><Input type="number" placeholder="0" className="h-9" {...field} data-testid="input-fin-guarantor2-income" /></FormControl>
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
                    <FormField control={form.control} name="familyGuarantorNidExpiry" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">NID Expiry Date {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
                        <FormControl><Input type="date" className="h-9" {...field} data-testid="input-fam-guarantor-nid-expiry" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="familyGuarantorDateOfBirth" render={({ field }) => {
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
                      const isInvalidAge = age !== null && (age < 18 || age > 65);
                      return (
                        <FormItem>
                          <FormLabel className="text-xs">Date of Birth {field.value && <span className="text-blue-500 text-xs font-normal ml-1">({toPersianDate(field.value)})</span>}</FormLabel>
                          <div className="flex gap-2 items-center">
                            <FormControl><Input type="date" className="h-9 flex-1" {...field} data-testid="input-fam-guarantor-dob" /></FormControl>
                            {age !== null && age >= 0 && (
                              <div className={`h-9 px-3 flex items-center rounded-md text-sm font-medium whitespace-nowrap ${isInvalidAge ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`} data-testid="text-fam-guarantor-age">
                                Age: {age} {isInvalidAge && '(18-65 required)'}
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }} />
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

          {currentStep === 6 && (
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-violet-500" />
              <CardHeader className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow">
                    <FolderUp className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-base">Documents</CardTitle>
                  {documents.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">{documents.length} uploaded</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-4">
                <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
                  <h4 className="text-sm font-semibold">Upload New Document</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select value={newDocSection} onValueChange={setNewDocSection}>
                      <SelectTrigger className="h-9" data-testid="select-doc-section">
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_SECTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={newDocType} onValueChange={(val) => { setNewDocType(val); if (val !== "__custom") setCustomDocType(""); }}>
                      <SelectTrigger className="h-9" data-testid="select-doc-type">
                        <SelectValue placeholder="Document Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                        <SelectItem value="__custom">Other (type your own)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newDocType === "__custom" && (
                    <Input
                      placeholder="Enter custom document type..."
                      className="h-9"
                      value={customDocType}
                      onChange={(e) => setCustomDocType(e.target.value)}
                      data-testid="input-custom-doc-type"
                    />
                  )}
                  <Input
                    placeholder="File name (optional)"
                    className="h-9"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    data-testid="input-doc-name"
                  />
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleDocumentUpload}
                      disabled={uploadingDoc || !resolvedDocType || !newDocSection}
                      data-testid="input-document-file"
                    />
                    <Button type="button" variant="outline" size="sm" asChild disabled={uploadingDoc || !resolvedDocType || !newDocSection} className="w-full">
                      <span>
                        {uploadingDoc ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                        Upload Document
                      </span>
                    </Button>
                  </label>
                </div>

                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {DOCUMENT_SECTIONS.filter(s => documents.some(d => d.section === s.value)).map(s => (
                      <div key={s.value} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-semibold">{s.label}</h4>
                          <Badge variant="outline" className="text-xs">{documents.filter(d => d.section === s.value).length}</Badge>
                        </div>
                        <div className="space-y-1">
                          {documents.filter(d => d.section === s.value).map((doc) => {
                            const globalIndex = documents.indexOf(doc);
                            return (
                              <div key={globalIndex} className="flex items-center justify-between bg-muted/50 rounded px-3 py-2 text-sm" data-testid={`document-item-${globalIndex}`}>
                                <div className="flex items-center gap-2">
                                  <File className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{doc.documentType}</span>
                                  <span className="text-muted-foreground">- {doc.fileName}</span>
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDocument(globalIndex)} data-testid={`button-remove-doc-${globalIndex}`}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderUp className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No documents uploaded yet</p>
                    <p className="text-xs">Select a section and document type above to upload</p>
                  </div>
                )}
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
            {currentStep === 6 ? (
              <Button
                type="button"
                onClick={handleManualSubmit}
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
