import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { queueSubmission } from "@/hooks/use-offline-sync";
import {
  FileText, Send, Save, Loader2, ChevronLeft, ChevronRight, Wifi, WifiOff,
  User, DollarSign, Building2, Shield, Users, Check, Camera, Upload
} from "lucide-react";

type Branch = { id: string; name: string };
type Officer = { id: string; name: string };
type FundingSource = { id: string; name: string };
type SectorItem = { id: string; name: string };
type BusinessItem = { id: string; name: string; sectorId?: string };
type ProvinceItem = { id: string; name: string };
type DistrictItem = { id: string; name: string; provinceId?: string };
type LicenseTypeItem = { id: string; name: string };

const DRAFT_KEY = "mobile_financing_draft";

const steps = [
  { id: 1, label: "Customer", icon: User },
  { id: 2, label: "Financing", icon: DollarSign },
  { id: 3, label: "Business", icon: Building2 },
  { id: 4, label: "Collateral", icon: Shield },
  { id: 5, label: "Guarantors", icon: Users },
];

const loanProducts = [
  { code: "10", name: "Mudarabah" },
  { code: "11", name: "Murabaha" },
  { code: "12", name: "Musharakat" },
  { code: "13", name: "Qardul Hasana" },
];

function getStoredDraft() {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

const defaultFormData: Record<string, string> = {
  customerNo: "",
  firstName: "",
  fatherName: "",
  gender: "male",
  nationalId: "",
  nidExpiryDate: "",
  dateOfBirth: "",
  placeOfBirth: "",
  homeAddress: "",
  district: "",
  phoneNumber: "",
  secondPhoneNumber: "",
  numberOfDependents: "0",
  directMaleDependent: "0",
  directFemaleDependent: "0",
  indirectMaleDependent: "0",
  indirectFemaleDependent: "0",
  branchId: "",
  financeOfficerId: "",
  fundingSourceId: "",
  productName: "",
  productCode: "",
  sector: "",
  sectorId: "",
  businessDescription: "",
  financingPurpose: "",
  requestDate: new Date().toISOString().split("T")[0],
  requestAmount: "",
  financingDurationMonths: "12",
  gracePeriod: "0",
  numberOfInstallments: "12",
  principleAmount: "",
  marginRate: "20",
  businessName: "",
  businessProvince: "",
  businessProvinceId: "",
  businessDistrict: "",
  businessVillage: "",
  businessDetailedAddress: "",
  businessYearsOfExperience: "",
  licenseType: "",
  licensePresident: "",
  licenseNumber: "",
  licenseRegisterDate: "",
  licenseExpiryDate: "",
  collateralOwnerName: "",
  collateralOwnerNid: "",
  collateralOwnerNidExpiry: "",
  collateralType: "",
  collateralProvince: "",
  collateralAddress: "",
  collateralPurchasedPrice: "",
  collateralMarketPrice: "",
  financialGuarantorFullName: "",
  financialGuarantorFatherName: "",
  financialGuarantorNid: "",
  financialGuarantorNidExpiry: "",
  financialGuarantorDateOfBirth: "",
  financialGuarantorPhone: "",
  financialGuarantorHomeAddress: "",
  financialGuarantorDistrict: "",
  financialGuarantorBusiness: "",
  financialGuarantorBusinessAddress: "",
  financialGuarantorRelationship: "",
  financialGuarantorYearsOfExperience: "",
  financialGuarantorInventory: "",
  financialGuarantorMonthlyIncome: "",
  financialGuarantor2FullName: "",
  financialGuarantor2FatherName: "",
  financialGuarantor2Nid: "",
  financialGuarantor2NidExpiry: "",
  financialGuarantor2DateOfBirth: "",
  financialGuarantor2Phone: "",
  financialGuarantor2HomeAddress: "",
  financialGuarantor2District: "",
  financialGuarantor2Business: "",
  financialGuarantor2BusinessAddress: "",
  financialGuarantor2Relationship: "",
  financialGuarantor2YearsOfExperience: "",
  financialGuarantor2Inventory: "",
  financialGuarantor2MonthlyIncome: "",
  familyGuarantorFullName: "",
  familyGuarantorFatherName: "",
  familyGuarantorNid: "",
  familyGuarantorNidExpiry: "",
  familyGuarantorDateOfBirth: "",
  familyGuarantorPhone: "",
  familyGuarantorHomeAddress: "",
  familyGuarantorDistrict: "",
  familyGuarantorRelationship: "",
};

function calculateAge(dob: string): number | null {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function MobileField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}{required && " *"}</Label>
      {children}
    </div>
  );
}

export default function MobileFinancing() {
  const { toast } = useToast();
  const isOnline = useNetworkStatus();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>(() => getStoredDraft() || { ...defaultFormData });
  const [customerPhoto, setCustomerPhoto] = useState<{ url: string; name: string } | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }, 10000);
    return () => clearInterval(timer);
  }, [formData]);

  const { data: branches } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: officers } = useQuery<Officer[]>({ queryKey: ["/api/finance-officers/active"] });
  const { data: fundingSources } = useQuery<FundingSource[]>({ queryKey: ["/api/funding-sources"] });
  const { data: sectors } = useQuery<SectorItem[]>({ queryKey: ["/api/sectors"] });
  const { data: businesses } = useQuery<BusinessItem[]>({ queryKey: ["/api/businesses"] });
  const { data: provinces } = useQuery<ProvinceItem[]>({ queryKey: ["/api/provinces"] });
  const { data: districts } = useQuery<DistrictItem[]>({ queryKey: ["/api/districts"] });
  const { data: licenseTypes } = useQuery<LicenseTypeItem[]>({ queryKey: ["/api/license-types"] });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      const response = await fetch("/api/upload/photo", { method: "POST", body: fd, credentials: "include" });
      if (!response.ok) throw new Error("Upload failed");
      const result = await response.json();
      setCustomerPhoto({ url: result.url, name: result.filename });
      toast({ title: "Success", description: "Photo uploaded" });
    } catch {
      toast({ title: "Error", description: "Failed to upload photo", variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const submitMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await apiRequest("POST", "/api/loan-applications", {
        ...data,
        customerPhoto: customerPhoto?.url,
        requestAmount: parseFloat(data.requestAmount) || 0,
        financingDurationMonths: parseInt(data.financingDurationMonths) || 12,
        gracePeriod: parseInt(data.gracePeriod) || 0,
        numberOfInstallments: parseInt(data.numberOfInstallments) || 12,
        principleAmount: parseFloat(data.principleAmount) || 0,
        marginRate: parseFloat(data.marginRate) || 0,
        numberOfDependents: parseInt(data.numberOfDependents) || 0,
        directMaleDependent: parseInt(data.directMaleDependent) || 0,
        directFemaleDependent: parseInt(data.directFemaleDependent) || 0,
        indirectMaleDependent: parseInt(data.indirectMaleDependent) || 0,
        indirectFemaleDependent: parseInt(data.indirectFemaleDependent) || 0,
        businessYearsOfExperience: parseInt(data.businessYearsOfExperience) || 0,
        collateralPurchasedPrice: parseFloat(data.collateralPurchasedPrice) || 0,
        collateralMarketPrice: parseFloat(data.collateralMarketPrice) || 0,
        financialGuarantorYearsOfExperience: parseInt(data.financialGuarantorYearsOfExperience) || 0,
        financialGuarantorInventory: parseFloat(data.financialGuarantorInventory) || 0,
        financialGuarantorMonthlyIncome: parseFloat(data.financialGuarantorMonthlyIncome) || 0,
        financialGuarantor2YearsOfExperience: parseInt(data.financialGuarantor2YearsOfExperience) || 0,
        financialGuarantor2Inventory: parseFloat(data.financialGuarantor2Inventory) || 0,
        financialGuarantor2MonthlyIncome: parseFloat(data.financialGuarantor2MonthlyIncome) || 0,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Financing application submitted successfully" });
      localStorage.removeItem(DRAFT_KEY);
      setFormData({ ...defaultFormData });
      setStep(1);
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    toast({ title: "Draft Saved", description: "Your progress has been saved" });
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData({ ...defaultFormData });
    setStep(1);
    toast({ title: "Draft Cleared", description: "Form has been reset" });
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.firstName) {
      toast({ title: "Error", description: "Customer name is required", variant: "destructive" });
      setStep(1);
      return;
    }
    if (!isOnline) {
      queueSubmission(formData);
      toast({ title: "Saved Offline", description: "Application will be submitted when you reconnect" });
      localStorage.removeItem(DRAFT_KEY);
      setFormData({ ...defaultFormData });
      setStep(1);
      return;
    }
    submitMutation.mutate(formData);
  };

  const sectorBusinesses = (businesses || []).filter(b => b.sectorId === formData.sectorId);
  const selectedProvince = (provinces || []).find(p => p.id?.toString() === formData.businessProvinceId);
  const provinceDistricts = (districts || []).filter(d => d.provinceId?.toString() === formData.businessProvinceId);

  const customerAge = calculateAge(formData.dateOfBirth);
  const finGuarantor1Age = calculateAge(formData.financialGuarantorDateOfBirth);
  const finGuarantor2Age = calculateAge(formData.financialGuarantor2DateOfBirth);
  const famGuarantorAge = calculateAge(formData.familyGuarantorDateOfBirth);

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-3 py-2 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full overflow-hidden border border-primary-foreground/30">
              <img src="/logo.jpeg" alt="Lamen" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight" data-testid="text-financing-title">New Financing Application</h1>
              <p className="text-[10px] text-primary-foreground/70">Step {step} of 5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-4 w-4 text-primary-foreground/70" /> : <WifiOff className="h-4 w-4 text-yellow-300" />}
            {!isOnline && <Badge variant="secondary" className="text-[10px]">Offline</Badge>}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-0.5 px-1.5 py-1 rounded-md text-[9px] font-medium w-full justify-center transition-colors ${
                  step === s.id
                    ? "bg-primary-foreground text-primary"
                    : step > s.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/50"
                }`}
                data-testid={`step-${s.label.toLowerCase()}`}
              >
                {step > s.id ? <Check className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
                <span className="hidden xs:inline">{s.label}</span>
              </button>
              {i < steps.length - 1 && <ChevronRight className="h-2.5 w-2.5 text-primary-foreground/30 shrink-0" />}
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-auto px-3 py-3 space-y-3">
        {step === 1 && (
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm">Customer Information</CardTitle>
                  <p className="text-[10px] text-muted-foreground">Basic details about the customer</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Customer No">
                  <Input placeholder="Auto-generated" value={formData.customerNo} onChange={(e) => updateField("customerNo", e.target.value)} data-testid="input-customer-no" />
                </MobileField>
                <MobileField label="Full Name" required>
                  <Input placeholder="Full name" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} data-testid="input-first-name" />
                </MobileField>
                <MobileField label="Father's Name">
                  <Input placeholder="Father's name" value={formData.fatherName} onChange={(e) => updateField("fatherName", e.target.value)} data-testid="input-father-name" />
                </MobileField>
                <MobileField label="Gender">
                  <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                    <SelectTrigger data-testid="select-gender"><SelectValue placeholder="Gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="National ID (NID)">
                  <Input placeholder="National ID" value={formData.nationalId} onChange={(e) => updateField("nationalId", e.target.value)} data-testid="input-nid" />
                </MobileField>
                <MobileField label="NID Expiry Date">
                  <Input type="date" value={formData.nidExpiryDate} onChange={(e) => updateField("nidExpiryDate", e.target.value)} data-testid="input-nid-expiry" />
                </MobileField>
                <MobileField label="Date of Birth">
                  <div className="flex gap-1 items-center">
                    <Input type="date" value={formData.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} className="flex-1" data-testid="input-dob" />
                    {customerAge !== null && customerAge >= 0 && (
                      <span className="text-[10px] font-medium text-emerald-600 whitespace-nowrap" data-testid="text-age">Age: {customerAge}</span>
                    )}
                  </div>
                </MobileField>
                <MobileField label="Place of Birth">
                  <Input placeholder="Place of birth" value={formData.placeOfBirth} onChange={(e) => updateField("placeOfBirth", e.target.value)} data-testid="input-pob" />
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Home Address">
                  <Input placeholder="Home address" value={formData.homeAddress} onChange={(e) => updateField("homeAddress", e.target.value)} data-testid="input-home-address" />
                </MobileField>
                <MobileField label="District">
                  <Input placeholder="District" value={formData.district} onChange={(e) => updateField("district", e.target.value)} data-testid="input-district" />
                </MobileField>
                <MobileField label="Phone Number">
                  <Input placeholder="Phone number" value={formData.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} data-testid="input-phone" />
                </MobileField>
                <MobileField label="2nd Phone Number">
                  <Input placeholder="Secondary phone" value={formData.secondPhoneNumber} onChange={(e) => updateField("secondPhoneNumber", e.target.value)} data-testid="input-phone-2" />
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="No. of Dependents">
                  <Input type="number" placeholder="0" value={formData.numberOfDependents} onChange={(e) => updateField("numberOfDependents", e.target.value)} data-testid="input-dependents" />
                </MobileField>
                <MobileField label="Direct Male Employee">
                  <Input type="number" placeholder="0" value={formData.directMaleDependent} onChange={(e) => updateField("directMaleDependent", e.target.value)} data-testid="input-direct-male" />
                </MobileField>
                <MobileField label="Direct Female Employee">
                  <Input type="number" placeholder="0" value={formData.directFemaleDependent} onChange={(e) => updateField("directFemaleDependent", e.target.value)} data-testid="input-direct-female" />
                </MobileField>
                <MobileField label="Indirect Male Employee">
                  <Input type="number" placeholder="0" value={formData.indirectMaleDependent} onChange={(e) => updateField("indirectMaleDependent", e.target.value)} data-testid="input-indirect-male" />
                </MobileField>
              </div>
              <MobileField label="Indirect Female Employee">
                <Input type="number" placeholder="0" value={formData.indirectFemaleDependent} onChange={(e) => updateField("indirectFemaleDependent", e.target.value)} className="w-1/2" data-testid="input-indirect-female" />
              </MobileField>

              <div className="border-t pt-3 mt-2">
                <h3 className="text-xs font-semibold text-muted-foreground mb-2">Photo & Documents</h3>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                    {customerPhoto ? (
                      <img src={customerPhoto.url} alt="Customer" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} data-testid="input-customer-photo" />
                      <Button type="button" variant="outline" size="sm" asChild disabled={uploadingPhoto}>
                        <span>{uploadingPhoto ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Camera className="h-3 w-3 mr-1" />} {customerPhoto ? "Change" : "Take Photo"}</span>
                      </Button>
                    </label>
                    {customerPhoto && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setCustomerPhoto(null)} data-testid="button-remove-photo">
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm">Financing Details</CardTitle>
                  <p className="text-[10px] text-muted-foreground">Product and financing information</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Branch">
                  <Select value={formData.branchId} onValueChange={(v) => updateField("branchId", v)}>
                    <SelectTrigger data-testid="select-branch"><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>
                      {(branches || []).map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </MobileField>
                <MobileField label="Finance Officer">
                  <Select value={formData.financeOfficerId} onValueChange={(v) => updateField("financeOfficerId", v)}>
                    <SelectTrigger data-testid="select-officer"><SelectValue placeholder="Select officer" /></SelectTrigger>
                    <SelectContent>
                      {(officers || []).map((o) => (
                        <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Product Name">
                  <Select value={formData.productName} onValueChange={(v) => {
                    const product = loanProducts.find(p => p.name === v);
                    updateField("productName", v);
                    updateField("productCode", product?.code || "");
                  }}>
                    <SelectTrigger data-testid="select-product"><SelectValue placeholder="Select product" /></SelectTrigger>
                    <SelectContent>
                      {loanProducts.map((p) => (
                        <SelectItem key={p.code} value={p.name}>{p.code} - {p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </MobileField>
                <MobileField label="Product Code">
                  <Input readOnly className="bg-muted" placeholder="Auto-filled" value={formData.productCode} data-testid="input-product-code" />
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Sector">
                  <Select value={formData.sectorId} onValueChange={(v) => {
                    const sec = (sectors || []).find(s => s.id === v);
                    updateField("sectorId", v);
                    updateField("sector", sec?.name || "");
                    updateField("businessDescription", "");
                  }}>
                    <SelectTrigger data-testid="select-sector"><SelectValue placeholder="Select sector" /></SelectTrigger>
                    <SelectContent>
                      {(sectors || []).map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </MobileField>
                <MobileField label="Business">
                  <Select value={formData.businessDescription} onValueChange={(v) => {
                    const biz = sectorBusinesses.find(b => b.id === v);
                    updateField("businessDescription", biz?.name || "");
                  }} disabled={!formData.sectorId}>
                    <SelectTrigger data-testid="select-business"><SelectValue placeholder={formData.sectorId ? "Select business" : "Select sector first"} /></SelectTrigger>
                    <SelectContent>
                      {sectorBusinesses.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Funding Source">
                  <Select value={formData.fundingSourceId} onValueChange={(v) => updateField("fundingSourceId", v)}>
                    <SelectTrigger data-testid="select-funding"><SelectValue placeholder="Select source" /></SelectTrigger>
                    <SelectContent>
                      {(fundingSources || []).map((f) => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </MobileField>
                <MobileField label="Financing Purpose">
                  <Input placeholder="Purpose of financing" value={formData.financingPurpose} onChange={(e) => updateField("financingPurpose", e.target.value)} data-testid="input-purpose" />
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Request Date">
                  <Input type="date" value={formData.requestDate} onChange={(e) => updateField("requestDate", e.target.value)} data-testid="input-request-date" />
                </MobileField>
                <MobileField label="Request Amount (AFN)">
                  <Input type="number" placeholder="0" value={formData.requestAmount} onChange={(e) => updateField("requestAmount", e.target.value)} data-testid="input-amount" />
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Duration (Months)">
                  <Input type="number" placeholder="12" value={formData.financingDurationMonths} onChange={(e) => updateField("financingDurationMonths", e.target.value)} data-testid="input-duration" />
                </MobileField>
                <MobileField label="Grace Period">
                  <Input type="number" placeholder="0" value={formData.gracePeriod} onChange={(e) => updateField("gracePeriod", e.target.value)} data-testid="input-grace" />
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="No. of Installments">
                  <Input type="number" placeholder="12" value={formData.numberOfInstallments} onChange={(e) => updateField("numberOfInstallments", e.target.value)} data-testid="input-installments" />
                </MobileField>
                <MobileField label="Principle Amount (AFN)">
                  <Input type="number" placeholder="0" value={formData.principleAmount} onChange={(e) => updateField("principleAmount", e.target.value)} data-testid="input-principle" />
                </MobileField>
              </div>
              <MobileField label="Margin Rate (%)">
                <Input type="number" step="0.01" placeholder="0" value={formData.marginRate} onChange={(e) => updateField("marginRate", e.target.value)} className="w-1/2" data-testid="input-margin" />
              </MobileField>
              {formData.requestAmount && (
                <div className="p-2 rounded-lg bg-muted">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Profit</p>
                      <p className="text-xs font-semibold">{((parseFloat(formData.requestAmount) || 0) * (parseFloat(formData.marginRate) || 0) / 100).toLocaleString()} AFN</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Total</p>
                      <p className="text-xs font-semibold">{((parseFloat(formData.requestAmount) || 0) * (1 + (parseFloat(formData.marginRate) || 0) / 100)).toLocaleString()} AFN</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Installment</p>
                      <p className="text-xs font-semibold">{(((parseFloat(formData.requestAmount) || 0) * (1 + (parseFloat(formData.marginRate) || 0) / 100)) / (parseInt(formData.numberOfInstallments) || 1)).toLocaleString()} AFN</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Building2 className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm">Business & License</CardTitle>
                  <p className="text-[10px] text-muted-foreground">Business details and license information</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground">Business Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Business Name">
                  <Input placeholder="Business name" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} data-testid="input-business-name" />
                </MobileField>
                <MobileField label="Province">
                  <Select value={formData.businessProvinceId} onValueChange={(v) => {
                    const prov = (provinces || []).find(p => p.id?.toString() === v);
                    updateField("businessProvinceId", v);
                    updateField("businessProvince", prov?.name || "");
                    updateField("businessDistrict", "");
                  }}>
                    <SelectTrigger data-testid="select-business-province"><SelectValue placeholder="Select province" /></SelectTrigger>
                    <SelectContent>
                      {(provinces || []).map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="District">
                  <Select value={formData.businessDistrict} onValueChange={(v) => {
                    const dist = provinceDistricts.find(d => d.id?.toString() === v);
                    updateField("businessDistrict", dist?.name || "");
                  }} disabled={!selectedProvince}>
                    <SelectTrigger data-testid="select-business-district"><SelectValue placeholder={selectedProvince ? "Select district" : "Province first"} /></SelectTrigger>
                    <SelectContent>
                      {provinceDistricts.map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </MobileField>
                <MobileField label="Village">
                  <Input placeholder="Village" value={formData.businessVillage} onChange={(e) => updateField("businessVillage", e.target.value)} data-testid="input-village" />
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Detailed Address">
                  <Input placeholder="Detailed address" value={formData.businessDetailedAddress} onChange={(e) => updateField("businessDetailedAddress", e.target.value)} data-testid="input-biz-address" />
                </MobileField>
                <MobileField label="Years of Experience">
                  <Input type="number" placeholder="0" value={formData.businessYearsOfExperience} onChange={(e) => updateField("businessYearsOfExperience", e.target.value)} data-testid="input-biz-exp" />
                </MobileField>
              </div>

              <div className="border-t pt-3">
                <h3 className="text-xs font-semibold text-muted-foreground mb-2">License Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Type of License">
                    <Select value={formData.licenseType} onValueChange={(v) => updateField("licenseType", v)}>
                      <SelectTrigger data-testid="select-license-type"><SelectValue placeholder="License type" /></SelectTrigger>
                      <SelectContent>
                        {(licenseTypes || []).map((lt) => (
                          <SelectItem key={lt.id} value={lt.name}>{lt.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </MobileField>
                  <MobileField label="President">
                    <Input placeholder="President name" value={formData.licensePresident} onChange={(e) => updateField("licensePresident", e.target.value)} data-testid="input-license-president" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <MobileField label="License Number">
                    <Input placeholder="License number" value={formData.licenseNumber} onChange={(e) => updateField("licenseNumber", e.target.value)} data-testid="input-license-number" />
                  </MobileField>
                  <MobileField label="Register Date">
                    <Input type="date" value={formData.licenseRegisterDate} onChange={(e) => updateField("licenseRegisterDate", e.target.value)} data-testid="input-license-reg-date" />
                  </MobileField>
                </div>
                <div className="mt-2">
                  <MobileField label="Expiry Date">
                    <Input type="date" value={formData.licenseExpiryDate} onChange={(e) => updateField("licenseExpiryDate", e.target.value)} className="w-1/2" data-testid="input-license-exp-date" />
                  </MobileField>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm">Collateral Information</CardTitle>
                  <p className="text-[10px] text-muted-foreground">Security/collateral details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Owner Name(s)">
                  <Input placeholder="Owner name" value={formData.collateralOwnerName} onChange={(e) => updateField("collateralOwnerName", e.target.value)} data-testid="input-col-owner" />
                </MobileField>
                <MobileField label="Owner NID">
                  <Input placeholder="Owner NID" value={formData.collateralOwnerNid} onChange={(e) => updateField("collateralOwnerNid", e.target.value)} data-testid="input-col-nid" />
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Owner NID Expiry">
                  <Input type="date" value={formData.collateralOwnerNidExpiry} onChange={(e) => updateField("collateralOwnerNidExpiry", e.target.value)} data-testid="input-col-nid-expiry" />
                </MobileField>
                <MobileField label="Type">
                  <Select value={formData.collateralType} onValueChange={(v) => updateField("collateralType", v)}>
                    <SelectTrigger data-testid="select-col-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sharyee">Sharyee</SelectItem>
                      <SelectItem value="Urfee">Urfee</SelectItem>
                    </SelectContent>
                  </Select>
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Province">
                  <Input placeholder="Province" value={formData.collateralProvince} onChange={(e) => updateField("collateralProvince", e.target.value)} data-testid="input-col-province" />
                </MobileField>
                <MobileField label="Address">
                  <Input placeholder="Address" value={formData.collateralAddress} onChange={(e) => updateField("collateralAddress", e.target.value)} data-testid="input-col-address" />
                </MobileField>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MobileField label="Purchased Price (AFN)">
                  <Input type="number" placeholder="0" value={formData.collateralPurchasedPrice} onChange={(e) => updateField("collateralPurchasedPrice", e.target.value)} data-testid="input-col-purchased" />
                </MobileField>
                <MobileField label="Market Price (AFN)">
                  <Input type="number" placeholder="0" value={formData.collateralMarketPrice} onChange={(e) => updateField("collateralMarketPrice", e.target.value)} data-testid="input-col-market" />
                </MobileField>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 5 && (
          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2 px-3 pt-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                    <Users className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Financial Guarantor 1</CardTitle>
                    <p className="text-[10px] text-muted-foreground">First financial guarantor details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Full Name">
                    <Input placeholder="Full name" value={formData.financialGuarantorFullName} onChange={(e) => updateField("financialGuarantorFullName", e.target.value)} data-testid="input-fg1-name" />
                  </MobileField>
                  <MobileField label="Father's Name">
                    <Input placeholder="Father's name" value={formData.financialGuarantorFatherName} onChange={(e) => updateField("financialGuarantorFatherName", e.target.value)} data-testid="input-fg1-father" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="NID">
                    <Input placeholder="National ID" value={formData.financialGuarantorNid} onChange={(e) => updateField("financialGuarantorNid", e.target.value)} data-testid="input-fg1-nid" />
                  </MobileField>
                  <MobileField label="NID Expiry">
                    <Input type="date" value={formData.financialGuarantorNidExpiry} onChange={(e) => updateField("financialGuarantorNidExpiry", e.target.value)} data-testid="input-fg1-nid-expiry" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Date of Birth">
                    <div className="flex gap-1 items-center">
                      <Input type="date" value={formData.financialGuarantorDateOfBirth} onChange={(e) => updateField("financialGuarantorDateOfBirth", e.target.value)} className="flex-1" data-testid="input-fg1-dob" />
                      {finGuarantor1Age !== null && finGuarantor1Age >= 0 && (
                        <span className={`text-[10px] font-medium whitespace-nowrap ${finGuarantor1Age < 18 || finGuarantor1Age > 65 ? 'text-red-500' : 'text-emerald-600'}`}>{finGuarantor1Age}</span>
                      )}
                    </div>
                  </MobileField>
                  <MobileField label="Phone">
                    <Input placeholder="Phone" value={formData.financialGuarantorPhone} onChange={(e) => updateField("financialGuarantorPhone", e.target.value)} data-testid="input-fg1-phone" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Home Address">
                    <Input placeholder="Home address" value={formData.financialGuarantorHomeAddress} onChange={(e) => updateField("financialGuarantorHomeAddress", e.target.value)} data-testid="input-fg1-address" />
                  </MobileField>
                  <MobileField label="District">
                    <Input placeholder="District" value={formData.financialGuarantorDistrict} onChange={(e) => updateField("financialGuarantorDistrict", e.target.value)} data-testid="input-fg1-district" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Business">
                    <Input placeholder="Business type" value={formData.financialGuarantorBusiness} onChange={(e) => updateField("financialGuarantorBusiness", e.target.value)} data-testid="input-fg1-business" />
                  </MobileField>
                  <MobileField label="Business Address">
                    <Input placeholder="Business address" value={formData.financialGuarantorBusinessAddress} onChange={(e) => updateField("financialGuarantorBusinessAddress", e.target.value)} data-testid="input-fg1-biz-addr" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Relationship">
                    <Input placeholder="Relationship" value={formData.financialGuarantorRelationship} onChange={(e) => updateField("financialGuarantorRelationship", e.target.value)} data-testid="input-fg1-relation" />
                  </MobileField>
                  <MobileField label="Years of Experience">
                    <Input type="number" placeholder="0" value={formData.financialGuarantorYearsOfExperience} onChange={(e) => updateField("financialGuarantorYearsOfExperience", e.target.value)} data-testid="input-fg1-exp" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Inventory (AFN)">
                    <Input type="number" placeholder="0" value={formData.financialGuarantorInventory} onChange={(e) => updateField("financialGuarantorInventory", e.target.value)} data-testid="input-fg1-inventory" />
                  </MobileField>
                  <MobileField label="Monthly Income (AFN)">
                    <Input type="number" placeholder="0" value={formData.financialGuarantorMonthlyIncome} onChange={(e) => updateField("financialGuarantorMonthlyIncome", e.target.value)} data-testid="input-fg1-income" />
                  </MobileField>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-teal-600" /> Financial Guarantor 2
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Full Name">
                    <Input placeholder="Full name" value={formData.financialGuarantor2FullName} onChange={(e) => updateField("financialGuarantor2FullName", e.target.value)} data-testid="input-fg2-name" />
                  </MobileField>
                  <MobileField label="Father's Name">
                    <Input placeholder="Father's name" value={formData.financialGuarantor2FatherName} onChange={(e) => updateField("financialGuarantor2FatherName", e.target.value)} data-testid="input-fg2-father" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="NID">
                    <Input placeholder="National ID" value={formData.financialGuarantor2Nid} onChange={(e) => updateField("financialGuarantor2Nid", e.target.value)} data-testid="input-fg2-nid" />
                  </MobileField>
                  <MobileField label="NID Expiry">
                    <Input type="date" value={formData.financialGuarantor2NidExpiry} onChange={(e) => updateField("financialGuarantor2NidExpiry", e.target.value)} data-testid="input-fg2-nid-expiry" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Date of Birth">
                    <div className="flex gap-1 items-center">
                      <Input type="date" value={formData.financialGuarantor2DateOfBirth} onChange={(e) => updateField("financialGuarantor2DateOfBirth", e.target.value)} className="flex-1" data-testid="input-fg2-dob" />
                      {finGuarantor2Age !== null && finGuarantor2Age >= 0 && (
                        <span className={`text-[10px] font-medium whitespace-nowrap ${finGuarantor2Age < 18 || finGuarantor2Age > 65 ? 'text-red-500' : 'text-emerald-600'}`}>{finGuarantor2Age}</span>
                      )}
                    </div>
                  </MobileField>
                  <MobileField label="Phone">
                    <Input placeholder="Phone" value={formData.financialGuarantor2Phone} onChange={(e) => updateField("financialGuarantor2Phone", e.target.value)} data-testid="input-fg2-phone" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Home Address">
                    <Input placeholder="Home address" value={formData.financialGuarantor2HomeAddress} onChange={(e) => updateField("financialGuarantor2HomeAddress", e.target.value)} data-testid="input-fg2-address" />
                  </MobileField>
                  <MobileField label="District">
                    <Input placeholder="District" value={formData.financialGuarantor2District} onChange={(e) => updateField("financialGuarantor2District", e.target.value)} data-testid="input-fg2-district" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Business">
                    <Input placeholder="Business type" value={formData.financialGuarantor2Business} onChange={(e) => updateField("financialGuarantor2Business", e.target.value)} data-testid="input-fg2-business" />
                  </MobileField>
                  <MobileField label="Business Address">
                    <Input placeholder="Business address" value={formData.financialGuarantor2BusinessAddress} onChange={(e) => updateField("financialGuarantor2BusinessAddress", e.target.value)} data-testid="input-fg2-biz-addr" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Relationship">
                    <Input placeholder="Relationship" value={formData.financialGuarantor2Relationship} onChange={(e) => updateField("financialGuarantor2Relationship", e.target.value)} data-testid="input-fg2-relation" />
                  </MobileField>
                  <MobileField label="Years of Experience">
                    <Input type="number" placeholder="0" value={formData.financialGuarantor2YearsOfExperience} onChange={(e) => updateField("financialGuarantor2YearsOfExperience", e.target.value)} data-testid="input-fg2-exp" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Inventory (AFN)">
                    <Input type="number" placeholder="0" value={formData.financialGuarantor2Inventory} onChange={(e) => updateField("financialGuarantor2Inventory", e.target.value)} data-testid="input-fg2-inventory" />
                  </MobileField>
                  <MobileField label="Monthly Income (AFN)">
                    <Input type="number" placeholder="0" value={formData.financialGuarantor2MonthlyIncome} onChange={(e) => updateField("financialGuarantor2MonthlyIncome", e.target.value)} data-testid="input-fg2-income" />
                  </MobileField>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-cyan-600" /> Family Guarantor
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Full Name">
                    <Input placeholder="Full name" value={formData.familyGuarantorFullName} onChange={(e) => updateField("familyGuarantorFullName", e.target.value)} data-testid="input-fam-name" />
                  </MobileField>
                  <MobileField label="Father's Name">
                    <Input placeholder="Father's name" value={formData.familyGuarantorFatherName} onChange={(e) => updateField("familyGuarantorFatherName", e.target.value)} data-testid="input-fam-father" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="NID">
                    <Input placeholder="National ID" value={formData.familyGuarantorNid} onChange={(e) => updateField("familyGuarantorNid", e.target.value)} data-testid="input-fam-nid" />
                  </MobileField>
                  <MobileField label="NID Expiry">
                    <Input type="date" value={formData.familyGuarantorNidExpiry} onChange={(e) => updateField("familyGuarantorNidExpiry", e.target.value)} data-testid="input-fam-nid-expiry" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Date of Birth">
                    <div className="flex gap-1 items-center">
                      <Input type="date" value={formData.familyGuarantorDateOfBirth} onChange={(e) => updateField("familyGuarantorDateOfBirth", e.target.value)} className="flex-1" data-testid="input-fam-dob" />
                      {famGuarantorAge !== null && famGuarantorAge >= 0 && (
                        <span className={`text-[10px] font-medium whitespace-nowrap ${famGuarantorAge < 18 || famGuarantorAge > 65 ? 'text-red-500' : 'text-emerald-600'}`}>{famGuarantorAge}</span>
                      )}
                    </div>
                  </MobileField>
                  <MobileField label="Phone">
                    <Input placeholder="Phone" value={formData.familyGuarantorPhone} onChange={(e) => updateField("familyGuarantorPhone", e.target.value)} data-testid="input-fam-phone" />
                  </MobileField>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileField label="Home Address">
                    <Input placeholder="Home address" value={formData.familyGuarantorHomeAddress} onChange={(e) => updateField("familyGuarantorHomeAddress", e.target.value)} data-testid="input-fam-address" />
                  </MobileField>
                  <MobileField label="District">
                    <Input placeholder="District" value={formData.familyGuarantorDistrict} onChange={(e) => updateField("familyGuarantorDistrict", e.target.value)} data-testid="input-fam-district" />
                  </MobileField>
                </div>
                <MobileField label="Relationship">
                  <Input placeholder="Relationship" value={formData.familyGuarantorRelationship} onChange={(e) => updateField("familyGuarantorRelationship", e.target.value)} className="w-1/2" data-testid="input-fam-relation" />
                </MobileField>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-card border-t px-3 py-2 flex gap-2 safe-area-bottom">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1" data-testid="button-prev">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        )}
        {step === 1 && (
          <Button variant="outline" onClick={clearDraft} className="shrink-0" data-testid="button-clear">
            Clear
          </Button>
        )}
        {step < 5 ? (
          <>
            <Button variant="outline" onClick={saveDraft} className="shrink-0" data-testid="button-save-draft">
              <Save className="h-4 w-4" />
            </Button>
            <Button onClick={() => setStep(step + 1)} className="flex-1" data-testid="button-next">
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </>
        ) : (
          <Button onClick={handleSubmit} className="flex-1" disabled={submitMutation.isPending} data-testid="button-submit">
            {submitMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Submit Application
          </Button>
        )}
      </div>
    </div>
  );
}
