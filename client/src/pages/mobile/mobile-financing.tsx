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
  User, DollarSign, Briefcase, CheckCircle2
} from "lucide-react";

type Branch = { id: string; name: string };
type Officer = { id: string; name: string };
type FundingSource = { id: string; name: string };
type Customer = { id: string; firstName: string; lastName: string };

const DRAFT_KEY = "mobile_financing_draft";

const steps = [
  { id: 1, label: "Customer", icon: User },
  { id: 2, label: "Financing", icon: DollarSign },
  { id: 3, label: "Business", icon: Briefcase },
  { id: 4, label: "Review", icon: CheckCircle2 },
];

function getStoredDraft() {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

const defaultFormData = {
  customerId: "",
  branchId: "",
  financeOfficerId: "",
  fundingSourceId: "",
  productName: "",
  financingPurpose: "",
  financingCycle: "1",
  requestAmount: "",
  financingDurationMonths: "12",
  gracePeriod: "0",
  numberOfInstallments: "12",
  marginRate: "20",
  sector: "",
  businessDescription: "",
};

export default function MobileFinancing() {
  const { toast } = useToast();
  const isOnline = useNetworkStatus();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => getStoredDraft() || { ...defaultFormData });

  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }, 10000);
    return () => clearInterval(timer);
  }, [formData]);

  const { data: branches } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: officers } = useQuery<Officer[]>({ queryKey: ["/api/finance-officers"] });
  const { data: fundingSources } = useQuery<FundingSource[]>({ queryKey: ["/api/funding-sources"] });
  const { data: customersData } = useQuery<{ customers: Customer[]; total: number }>({
    queryKey: ["/api/customers", { page: 1, limit: 200 }],
  });

  const customers = customersData?.customers || [];

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const requestAmount = parseFloat(data.requestAmount) || 0;
      const marginRate = parseFloat(data.marginRate) || 0;
      const durationMonths = parseInt(data.financingDurationMonths) || 12;
      const numInstallments = parseInt(data.numberOfInstallments) || 12;
      const profit = (requestAmount * marginRate) / 100;
      const totalReceivable = requestAmount + profit;
      const installmentAmount = numInstallments > 0 ? totalReceivable / numInstallments : 0;

      const payload = {
        customerId: data.customerId,
        branchId: data.branchId,
        financeOfficerId: data.financeOfficerId,
        fundingSourceId: data.fundingSourceId,
        productName: data.productName || "Murabaha",
        financingPurpose: data.financingPurpose,
        financingCycle: data.financingCycle,
        requestAmount: requestAmount.toString(),
        financingDurationMonths: durationMonths,
        gracePeriod: parseInt(data.gracePeriod) || 0,
        numberOfInstallments: numInstallments,
        marginRate: marginRate.toString(),
        profit: profit.toString(),
        totalReceivable: totalReceivable.toString(),
        installmentAmount: installmentAmount.toString(),
        sector: data.sector,
        businessDescription: data.businessDescription,
        status: "pending",
      };

      const res = await apiRequest("POST", "/api/loans", payload);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Financing application submitted successfully" });
      localStorage.removeItem(DRAFT_KEY);
      setFormData({ ...defaultFormData });
      setStep(1);
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
    },
    onError: (error: Error) => {
      if (!isOnline) {
        const pending = JSON.parse(localStorage.getItem("pending_submissions") || "[]");
        pending.push({ ...formData, savedAt: new Date().toISOString() });
        localStorage.setItem("pending_submissions", JSON.stringify(pending));
        toast({ title: "Saved Offline", description: "Application will be submitted when you reconnect" });
        localStorage.removeItem(DRAFT_KEY);
        setFormData({ ...defaultFormData });
        setStep(1);
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
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
    setFormData((prev: typeof defaultFormData) => ({ ...prev, [field]: value }));
  };

  const selectedCustomer = customers.find((c) => c.id === formData.customerId);

  const handleSubmit = () => {
    if (!formData.customerId || !formData.branchId || !formData.requestAmount) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
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

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden border border-primary-foreground/30">
              <img src="/logo.jpeg" alt="Lamen" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-sm font-bold" data-testid="text-financing-title">New Financing</h1>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-4 w-4 text-primary-foreground/70" /> : <WifiOff className="h-4 w-4 text-yellow-300" />}
            {!isOnline && <Badge variant="secondary" className="text-[10px]">Offline</Badge>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium w-full justify-center transition-colors ${
                  step === s.id
                    ? "bg-primary-foreground text-primary"
                    : step > s.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/50"
                }`}
                data-testid={`step-${s.label.toLowerCase()}`}
              >
                <s.icon className="h-3 w-3" />
                {s.label}
              </button>
              {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-primary-foreground/30 shrink-0 mx-0.5" />}
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-auto px-3 py-3">
        {step === 1 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Customer *</Label>
                <Select value={formData.customerId} onValueChange={(v) => updateField("customerId", v)}>
                  <SelectTrigger data-testid="select-customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Branch *</Label>
                <Select value={formData.branchId} onValueChange={(v) => updateField("branchId", v)}>
                  <SelectTrigger data-testid="select-branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {(branches || []).map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Finance Officer</Label>
                <Select value={formData.financeOfficerId} onValueChange={(v) => updateField("financeOfficerId", v)}>
                  <SelectTrigger data-testid="select-officer">
                    <SelectValue placeholder="Select officer" />
                  </SelectTrigger>
                  <SelectContent>
                    {(officers || []).map((o) => (
                      <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Funding Source</Label>
                <Select value={formData.fundingSourceId} onValueChange={(v) => updateField("fundingSourceId", v)}>
                  <SelectTrigger data-testid="select-funding">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {(fundingSources || []).map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Financing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input value={formData.productName} onChange={(e) => updateField("productName", e.target.value)} placeholder="e.g. Murabaha" data-testid="input-product" />
              </div>
              <div className="space-y-2">
                <Label>Purpose</Label>
                <Input value={formData.financingPurpose} onChange={(e) => updateField("financingPurpose", e.target.value)} placeholder="Purpose of financing" data-testid="input-purpose" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Financing Cycle</Label>
                  <Input type="number" value={formData.financingCycle} onChange={(e) => updateField("financingCycle", e.target.value)} data-testid="input-cycle" />
                </div>
                <div className="space-y-2">
                  <Label>Request Amount (AFN) *</Label>
                  <Input type="number" value={formData.requestAmount} onChange={(e) => updateField("requestAmount", e.target.value)} placeholder="0" data-testid="input-amount" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Duration (months)</Label>
                  <Input type="number" value={formData.financingDurationMonths} onChange={(e) => updateField("financingDurationMonths", e.target.value)} data-testid="input-duration" />
                </div>
                <div className="space-y-2">
                  <Label>Grace Period</Label>
                  <Input type="number" value={formData.gracePeriod} onChange={(e) => updateField("gracePeriod", e.target.value)} data-testid="input-grace" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Installments</Label>
                  <Input type="number" value={formData.numberOfInstallments} onChange={(e) => updateField("numberOfInstallments", e.target.value)} data-testid="input-installments" />
                </div>
                <div className="space-y-2">
                  <Label>Margin Rate (%)</Label>
                  <Input type="number" value={formData.marginRate} onChange={(e) => updateField("marginRate", e.target.value)} data-testid="input-margin" />
                </div>
              </div>
              {formData.requestAmount && (
                <div className="p-3 rounded-lg bg-muted">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Profit</p>
                      <p className="text-sm font-semibold">{((parseFloat(formData.requestAmount) || 0) * (parseFloat(formData.marginRate) || 0) / 100).toLocaleString()} AFN</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Total</p>
                      <p className="text-sm font-semibold">{((parseFloat(formData.requestAmount) || 0) * (1 + (parseFloat(formData.marginRate) || 0) / 100)).toLocaleString()} AFN</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Installment</p>
                      <p className="text-sm font-semibold">{(((parseFloat(formData.requestAmount) || 0) * (1 + (parseFloat(formData.marginRate) || 0) / 100)) / (parseInt(formData.numberOfInstallments) || 1)).toLocaleString()} AFN</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sector</Label>
                <Input value={formData.sector} onChange={(e) => updateField("sector", e.target.value)} placeholder="e.g. Agriculture, Trade" data-testid="input-sector" />
              </div>
              <div className="space-y-2">
                <Label>Business Description</Label>
                <Textarea value={formData.businessDescription} onChange={(e) => updateField("businessDescription", e.target.value)} placeholder="Describe the customer's business" rows={4} data-testid="input-business-desc" />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Review Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Branch</span>
                  <span className="font-medium">{(branches || []).find((b) => b.id === formData.branchId)?.name || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium">{formData.productName || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Purpose</span>
                  <span className="font-medium">{formData.financingPurpose || "-"}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Request Amount</span>
                  <span className="font-bold text-primary">{parseFloat(formData.requestAmount || "0").toLocaleString()} AFN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Margin Rate</span>
                  <span className="font-medium">{formData.marginRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{formData.financingDurationMonths} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Installments</span>
                  <span className="font-medium">{formData.numberOfInstallments}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sector</span>
                  <span className="font-medium">{formData.sector || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Business</span>
                  <span className="font-medium truncate max-w-[60%]">{formData.businessDescription || "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="sticky bottom-0 bg-card border-t px-3 py-3 flex gap-2 safe-area-bottom">
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
        {step < 4 ? (
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
