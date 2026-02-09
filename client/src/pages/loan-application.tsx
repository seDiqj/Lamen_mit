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
  ChevronLeft, ChevronRight, Save, ArrowLeft, Loader2, Check,
  Camera, Upload, X, File
} from "lucide-react";
import type { Branch, FinanceOfficer, FundingSource, Sector, Business, Province, District, LicenseType } from "@shared/schema";
import { cn } from "@/lib/utils";

const loanApplicationSchema = z.object({
  customerNo: z.string().optional(),
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  gender: z.string().optional(),
  nationalId: z.string().optional(),
  nidExpiryDate: z.string().optional(),
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

interface UploadedDocument {
  documentType: string;
  fileName: string;
  fileUrl: string;
}

const documentTypes = [
  "Tazkira",
  "Electricity Bill",
  "Qawala",
  "License Copy",
];

export default function LoanApplicationPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [customerPhoto, setCustomerPhoto] = useState<{ url: string; name: string } | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [newDocType, setNewDocType] = useState("");
  const [newDocName, setNewDocName] = useState("");

  const { data: branches = [] } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: financeOfficers = [] } = useQuery<FinanceOfficer[]>({ queryKey: ["/api/finance-officers/active"] });
  const { data: fundingSources = [] } = useQuery<FundingSource[]>({ queryKey: ["/api/funding-sources"] });
  const { data: sectors = [] } = useQuery<Sector[]>({ queryKey: ["/api/sectors"] });
  const { data: businesses = [] } = useQuery<Business[]>({ queryKey: ["/api/businesses"] });
  const { data: provinces = [] } = useQuery<Province[]>({ queryKey: ["/api/provinces"] });
  const { data: districts = [] } = useQuery<(District & { provinceName?: string })[]>({ queryKey: ["/api/districts"] });
  const { data: licenseTypes = [] } = useQuery<LicenseType[]>({ queryKey: ["/api/license-types"] });

  const form = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      gender: "male",
      requestDate: new Date().toISOString().split("T")[0],
    },
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

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newDocType) {
      toast({ title: "Error", description: "Please select a document type first", variant: "destructive" });
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
        documentType: newDocType,
        fileName: newDocName || result.filename,
        fileUrl: result.url,
      }]);
      setNewDocType("");
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
    if (currentStep !== 5) {
      return;
    }
    form.handleSubmit(onSubmit)();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Enter key from submitting form on steps 1-4
    // Allow Enter only on step 5 (Guarantors - final step) for form submission
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      // Allow Enter in textareas for multi-line input
      if (target.tagName === 'TEXTAREA') {
        return;
      }
      // Prevent form submission on all steps except the final step
      if (currentStep !== 5) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
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
                  <FormField control={form.control} name="nidExpiryDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">NID Expiry Date</FormLabel>
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

                {/* Photo & Documents Section */}
                <div className="border-t pt-3 mt-4">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-3">Photo & Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer Photo */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Customer Photo</label>
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

                    {/* Documents Upload */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Upload Documents</label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Select value={newDocType} onValueChange={setNewDocType}>
                            <SelectTrigger className="h-9 w-40" data-testid="select-doc-type">
                              <SelectValue placeholder="Document Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {documentTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="File name (optional)"
                            className="h-9 flex-1"
                            value={newDocName}
                            onChange={(e) => setNewDocName(e.target.value)}
                            data-testid="input-doc-name"
                          />
                        </div>
                        <label className="cursor-pointer block">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleDocumentUpload}
                            disabled={uploadingDoc || !newDocType}
                            data-testid="input-document-file"
                          />
                          <Button type="button" variant="outline" size="sm" asChild disabled={uploadingDoc || !newDocType} className="w-full">
                            <span>
                              {uploadingDoc ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                              Upload Document
                            </span>
                          </Button>
                        </label>
                      </div>

                      {/* Uploaded Documents List */}
                      {documents.length > 0 && (
                        <div className="space-y-1 mt-2">
                          {documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted/50 rounded px-2 py-1.5 text-sm" data-testid={`document-item-${index}`}>
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{doc.documentType}</span>
                                <span className="text-muted-foreground">- {doc.fileName}</span>
                              </div>
                              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeDocument(index)} data-testid={`button-remove-doc-${index}`}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
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
                      <div className="mt-3 p-3 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
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
                  <FormField control={form.control} name="collateralOwnerNidExpiry" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Owner NID Expiry Date</FormLabel>
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
                        <FormLabel className="text-xs">NID Expiry Date</FormLabel>
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
                          <FormLabel className="text-xs">Date of Birth</FormLabel>
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
                        <FormLabel className="text-xs">NID Expiry Date</FormLabel>
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
                          <FormLabel className="text-xs">Date of Birth</FormLabel>
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
                        <FormLabel className="text-xs">NID Expiry Date</FormLabel>
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
                          <FormLabel className="text-xs">Date of Birth</FormLabel>
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
