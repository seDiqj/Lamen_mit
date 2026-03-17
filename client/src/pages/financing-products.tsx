import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Search, Package, CheckCircle2, XCircle,
  Users, Percent, Calendar, Clock, Banknote, Layers,
  LayoutGrid, Table2, Pencil, Trash2, User, Shield, AlertTriangle,
  RefreshCw, X
} from "lucide-react";
import type { FinancingProduct, ProductCycleLimit } from "@shared/schema";

const CALCULATION_METHODS = [
  { value: "flat_rate", label: "Flat Rate" },
  { value: "declining_balance", label: "Declining Balance" },
];

const FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "bi_weekly", label: "Bi-Weekly" },
  { value: "quarterly", label: "Quarterly" },
];

const LOAN_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "group", label: "Group" },
];

const defaultFormData = {
  name: "",
  code: "",
  interestRate: "",
  minDurationMonths: "0",
  maxDurationMonths: "",
  gracePeriodDays: "0",
  minAmount: "",
  maxAmount: "",
  calculationMethod: "flat_rate",
  repaymentFrequency: "monthly",
  loanType: "individual",
  requiresGuarantor: false,
  lateFee: "",
  isActive: true,
  description: "",
};

type CycleRow = { cycleNumber: string; minAmount: string; maxAmount: string };

export default function FinancingProductsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FinancingProduct | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<FinancingProduct | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [cycleLimits, setCycleLimits] = useState<CycleRow[]>([]);

  const { data: products = [], isLoading } = useQuery<FinancingProduct[]>({
    queryKey: ["/api/financing-products"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/financing-products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financing-products"] });
      toast({ title: "Product created successfully" });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PUT", `/api/financing-products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financing-products"] });
      toast({ title: "Product updated successfully" });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/financing-products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financing-products"] });
      toast({ title: "Product deleted successfully" });
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setFormData(defaultFormData);
    setCycleLimits([]);
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData(defaultFormData);
    setCycleLimits([]);
    setDialogOpen(true);
  };

  const openEditDialog = async (product: FinancingProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      code: product.code,
      interestRate: String(product.interestRate),
      minDurationMonths: String(product.minDurationMonths ?? 0),
      maxDurationMonths: String(product.maxDurationMonths),
      gracePeriodDays: String(product.gracePeriodDays),
      minAmount: String(product.minAmount),
      maxAmount: String(product.maxAmount),
      calculationMethod: product.calculationMethod,
      repaymentFrequency: product.repaymentFrequency,
      loanType: product.loanType,
      requiresGuarantor: product.requiresGuarantor,
      lateFee: product.lateFee || "",
      isActive: product.isActive,
      description: product.description || "",
    });
    setDialogOpen(true);
    try {
      const res = await fetch(`/api/financing-products/${product.id}/cycle-limits`);
      const data: ProductCycleLimit[] = await res.json();
      setCycleLimits(data.map((c) => ({
        cycleNumber: String(c.cycleNumber),
        minAmount: String(c.minAmount),
        maxAmount: String(c.maxAmount),
      })));
    } catch {
      setCycleLimits([]);
    }
  };

  const addCycleRow = () => {
    const nextCycle = cycleLimits.length > 0
      ? String(Math.max(...cycleLimits.map(c => Number(c.cycleNumber))) + 1)
      : "1";
    setCycleLimits([...cycleLimits, { cycleNumber: nextCycle, minAmount: "", maxAmount: "" }]);
  };

  const updateCycleRow = (index: number, field: keyof CycleRow, value: string) => {
    setCycleLimits(cycleLimits.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  const removeCycleRow = (index: number) => {
    setCycleLimits(cycleLimits.filter((_, i) => i !== index));
  };

  const saveCycleLimits = async (productId: string) => {
    const validCycles = cycleLimits.filter(c => c.cycleNumber && c.minAmount && c.maxAmount);
    await apiRequest("PUT", `/api/financing-products/${productId}/cycle-limits`, {
      cycles: validCycles.map(c => ({
        cycleNumber: parseInt(c.cycleNumber),
        minAmount: c.minAmount,
        maxAmount: c.maxAmount,
      })),
    });
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      interestRate: formData.interestRate,
      minDurationMonths: parseInt(formData.minDurationMonths || "0"),
      maxDurationMonths: parseInt(formData.maxDurationMonths),
      gracePeriodDays: parseInt(formData.gracePeriodDays || "0"),
      minAmount: formData.minAmount,
      maxAmount: formData.maxAmount,
    };
    try {
      if (editingProduct) {
        await apiRequest("PUT", `/api/financing-products/${editingProduct.id}`, payload);
        await saveCycleLimits(editingProduct.id);
        queryClient.invalidateQueries({ queryKey: ["/api/financing-products"] });
        toast({ title: "Product updated successfully" });
      } else {
        const res = await apiRequest("POST", "/api/financing-products", payload);
        const newProduct = await res.json();
        if (cycleLimits.length > 0) {
          await saveCycleLimits(newProduct.id);
        }
        queryClient.invalidateQueries({ queryKey: ["/api/financing-products"] });
        toast({ title: "Product created successfully" });
      }
      closeDialog();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filtered = products.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q)) return false;
    }
    if (statusFilter === "active" && !p.isActive) return false;
    if (statusFilter === "inactive" && p.isActive) return false;
    if (typeFilter !== "all" && p.loanType !== typeFilter) return false;
    return true;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const inactiveProducts = products.filter((p) => !p.isActive).length;
  const groupProducts = products.filter((p) => p.loanType === "group").length;

  const formatAmount = (amount: string | number) => {
    return Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getMethodLabel = (method: string) => CALCULATION_METHODS.find((m) => m.value === method)?.label || method;
  const getFrequencyLabel = (freq: string) => FREQUENCIES.find((f) => f.value === freq)?.label || freq;

  return (
    <div className="p-6 space-y-6 w-full" data-testid="page-financing-products">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400" data-testid="text-page-title">
            Financing Products
          </h1>
          <p className="text-sm text-muted-foreground">Configure and manage Sharia-compliant financing product offerings</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          data-testid="button-add-product"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border shadow-sm" data-testid="card-total-products">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Products</p>
                <p className="text-3xl font-bold mt-1">{totalProducts}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm" data-testid="card-active-products">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active</p>
                <p className="text-3xl font-bold mt-1">{activeProducts}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm" data-testid="card-inactive-products">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Inactive</p>
                <p className="text-3xl font-bold mt-1">{inactiveProducts}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm" data-testid="card-group-products">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Group Products</p>
                <p className="text-3xl font-bold mt-1">{groupProducts}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-products"
          />
        </div>
        <div className="flex items-center gap-1 border rounded-lg p-0.5 bg-muted/30">
          {["all", "active", "inactive"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className={`h-8 px-3 text-xs capitalize ${statusFilter === s ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}`}
              data-testid={`button-filter-${s}`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px] h-9" data-testid="select-type-filter">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="group">Group</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 border rounded-lg p-0.5 bg-muted/30 ml-auto">
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className={`h-8 px-3 ${viewMode === "cards" ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}`}
            data-testid="button-view-cards"
          >
            <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={`h-8 px-3 ${viewMode === "table" ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}`}
            data-testid="button-view-table"
          >
            <Table2 className="h-3.5 w-3.5 mr-1.5" />
            Table
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {totalProducts} products
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border shadow-sm">
              <CardContent className="p-6 h-64" />
            </Card>
          ))}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={openEditDialog}
              onDelete={(p) => { setDeletingProduct(p); setDeleteDialogOpen(true); }}
              formatAmount={formatAmount}
              getMethodLabel={getMethodLabel}
              getFrequencyLabel={getFrequencyLabel}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      ) : (
        <Card className="border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-products">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">Product</th>
                  <th className="text-left p-3 font-medium">Code</th>
                  <th className="text-center p-3 font-medium">Margin %</th>
                  <th className="text-center p-3 font-medium">Duration</th>
                  <th className="text-center p-3 font-medium">Grace Days</th>
                  <th className="text-left p-3 font-medium">Amount Range</th>
                  <th className="text-left p-3 font-medium">Method</th>
                  <th className="text-left p-3 font-medium">Frequency</th>
                  <th className="text-center p-3 font-medium">Type</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-center p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-muted/30" data-testid={`row-product-${p.id}`}>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.code}</td>
                    <td className="p-3 text-center">{Number(p.interestRate)}%</td>
                    <td className="p-3 text-center">{p.minDurationMonths || 0}–{p.maxDurationMonths} mo</td>
                    <td className="p-3 text-center">{p.gracePeriodDays}</td>
                    <td className="p-3">AFN {formatAmount(p.minAmount)} – {formatAmount(p.maxAmount)}</td>
                    <td className="p-3">{getMethodLabel(p.calculationMethod)}</td>
                    <td className="p-3">{getFrequencyLabel(p.repaymentFrequency)}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="capitalize text-xs">{p.loanType}</Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={p.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}>
                        {p.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(p)} data-testid={`button-edit-${p.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => { setDeletingProduct(p); setDeleteDialogOpen(true); }} data-testid={`button-delete-${p.id}`}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-[900px] p-0">
          <DialogHeader className="px-5 pt-4 pb-3 border-b">
            <DialogTitle className="text-base">{editingProduct ? "Edit Financing Product" : "Add New Financing Product"}</DialogTitle>
          </DialogHeader>
          <div className="flex divide-x" style={{ minHeight: 0 }}>
            <div className="flex-1 px-5 py-3 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Product Name *</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Murabaha" className="h-8 text-sm" data-testid="input-product-name" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Product Code *</Label>
                  <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. MRB-01" className="h-8 text-sm" data-testid="input-product-code" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Margin Rate (%) *</Label>
                  <Input type="number" step="0.01" value={formData.interestRate} onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })} placeholder="16" className="h-8 text-sm" data-testid="input-interest-rate" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Min Duration (Mo)</Label>
                  <Input type="number" value={formData.minDurationMonths} onChange={(e) => setFormData({ ...formData, minDurationMonths: e.target.value })} placeholder="3" className="h-8 text-sm" data-testid="input-min-duration" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Duration (Mo) *</Label>
                  <Input type="number" value={formData.maxDurationMonths} onChange={(e) => setFormData({ ...formData, maxDurationMonths: e.target.value })} placeholder="24" className="h-8 text-sm" data-testid="input-max-duration" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Grace Period (Days)</Label>
                  <Input type="number" value={formData.gracePeriodDays} onChange={(e) => setFormData({ ...formData, gracePeriodDays: e.target.value })} placeholder="30" className="h-8 text-sm" data-testid="input-grace-period" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Late Fee</Label>
                  <Input value={formData.lateFee} onChange={(e) => setFormData({ ...formData, lateFee: e.target.value })} placeholder="500 or 5%" className="h-8 text-sm" data-testid="input-late-fee" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Min Amount (AFN) *</Label>
                  <Input type="number" value={formData.minAmount} onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })} placeholder="5000" className="h-8 text-sm" data-testid="input-min-amount" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Amount (AFN) *</Label>
                  <Input type="number" value={formData.maxAmount} onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })} placeholder="150000" className="h-8 text-sm" data-testid="input-max-amount" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Calc Method *</Label>
                  <Select value={formData.calculationMethod} onValueChange={(v) => setFormData({ ...formData, calculationMethod: v })}>
                    <SelectTrigger className="h-8 text-sm" data-testid="select-calc-method"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CALCULATION_METHODS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Frequency *</Label>
                  <Select value={formData.repaymentFrequency} onValueChange={(v) => setFormData({ ...formData, repaymentFrequency: v })}>
                    <SelectTrigger className="h-8 text-sm" data-testid="select-frequency"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FREQUENCIES.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Financing Type *</Label>
                  <Select value={formData.loanType} onValueChange={(v) => setFormData({ ...formData, loanType: v })}>
                    <SelectTrigger className="h-8 text-sm" data-testid="select-loan-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LOAN_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 h-8">
                  <Switch checked={formData.requiresGuarantor} onCheckedChange={(v) => setFormData({ ...formData, requiresGuarantor: v })} data-testid="switch-guarantor" />
                  <Label className="text-xs whitespace-nowrap">Guarantor</Label>
                </div>
                <div className="flex items-center gap-2 h-8">
                  <Switch checked={formData.isActive} onCheckedChange={(v) => setFormData({ ...formData, isActive: v })} data-testid="switch-active" />
                  <Label className="text-xs">Active</Label>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Optional product description..." rows={2} className="text-sm resize-none" data-testid="input-description" />
              </div>
            </div>

            <div className="w-[280px] flex-shrink-0 px-4 py-3 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-semibold">Cycle Limits</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCycleRow} className="h-6 px-2 text-[11px]" data-testid="button-add-cycle">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              {cycleLimits.length > 0 ? (
                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[260px]">
                  <div className="grid grid-cols-[40px_1fr_1fr_24px] gap-1 text-[10px] font-medium text-muted-foreground px-0.5">
                    <span>#</span>
                    <span>Min</span>
                    <span>Max</span>
                    <span></span>
                  </div>
                  {cycleLimits.map((cycle, idx) => (
                    <div key={idx} className="grid grid-cols-[40px_1fr_1fr_24px] gap-1 items-center" data-testid={`row-cycle-${idx}`}>
                      <Input
                        type="number"
                        min="1"
                        value={cycle.cycleNumber}
                        onChange={(e) => updateCycleRow(idx, "cycleNumber", e.target.value)}
                        className="h-7 text-center text-xs px-1"
                        data-testid={`input-cycle-number-${idx}`}
                      />
                      <Input
                        type="number"
                        value={cycle.minAmount}
                        onChange={(e) => updateCycleRow(idx, "minAmount", e.target.value)}
                        placeholder="Min"
                        className="h-7 text-xs px-2"
                        data-testid={`input-cycle-min-${idx}`}
                      />
                      <Input
                        type="number"
                        value={cycle.maxAmount}
                        onChange={(e) => updateCycleRow(idx, "maxAmount", e.target.value)}
                        placeholder="Max"
                        className="h-7 text-xs px-2"
                        data-testid={`input-cycle-max-${idx}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700"
                        onClick={() => removeCycleRow(idx)}
                        data-testid={`button-remove-cycle-${idx}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[11px] text-muted-foreground text-center px-2">
                    No cycle limits. Default min/max amounts apply to all cycles.
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="px-5 py-3 border-t">
            <Button variant="outline" size="sm" onClick={closeDialog} data-testid="button-cancel">Cancel</Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!formData.name || !formData.code || !formData.interestRate || !formData.maxDurationMonths || !formData.minAmount || !formData.maxAmount}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              data-testid="button-save-product"
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Product
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deletingProduct?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} data-testid="button-cancel-delete">Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deletingProduct && deleteMutation.mutate(deletingProduct.id)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductCard({
  product,
  onEdit,
  onDelete,
  formatAmount,
  getMethodLabel,
  getFrequencyLabel,
}: {
  product: FinancingProduct;
  onEdit: (p: FinancingProduct) => void;
  onDelete: (p: FinancingProduct) => void;
  formatAmount: (a: string | number) => string;
  getMethodLabel: (m: string) => string;
  getFrequencyLabel: (f: string) => string;
}) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden group" data-testid={`card-product-${product.id}`}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-start justify-between p-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Banknote className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
              <p className="text-xs text-muted-foreground">{product.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0.5 ${
                product.isActive
                  ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                  : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
              }`}
            >
              <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1 ${product.isActive ? "bg-green-500" : "bg-red-500"}`} />
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-px bg-muted/30 mx-4 rounded-lg overflow-hidden border">
          <div className="bg-background p-3 text-center">
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{Number(product.interestRate)}%</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Margin</p>
          </div>
          <div className="bg-background p-3 text-center">
            <p className="text-xl font-bold">{product.minDurationMonths || 0}–{product.maxDurationMonths}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Months</p>
          </div>
          <div className="bg-background p-3 text-center">
            <p className="text-xl font-bold">{product.gracePeriodDays}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Grace Days</p>
          </div>
        </div>

        {/* Details */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" /> Amount Range
            </span>
            <span className="font-medium text-xs">AFN {formatAmount(product.minAmount)} – AFN {formatAmount(product.maxAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5" /> Method
            </span>
            <span className="font-medium text-xs">{getMethodLabel(product.calculationMethod)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Frequency
            </span>
            <span className="font-medium text-xs">{getFrequencyLabel(product.repaymentFrequency)}</span>
          </div>
        </div>

        {/* Footer Badges & Actions */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 capitalize">
              <User className="h-2.5 w-2.5 mr-1" />
              {product.loanType}
            </Badge>
            {product.requiresGuarantor && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800">
                <Shield className="h-2.5 w-2.5 mr-1" />
                Guarantor
              </Badge>
            )}
            {product.lateFee && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-800">
                <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                Late Fee {product.lateFee}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(product)} data-testid={`button-edit-card-${product.id}`}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => onDelete(product)} data-testid={`button-delete-card-${product.id}`}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
