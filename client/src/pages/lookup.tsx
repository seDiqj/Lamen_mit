import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Plus,
  Edit,
  Trash2,
  Layers,
  Building2,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Map,
  FileCheck,
  Shield,
} from "lucide-react";
import type { Sector, Business, Province, District, LicenseType } from "@shared/schema";

type BusinessWithSector = Business & { sectorName?: string };
type DistrictWithProvince = District & { provinceName?: string };

const sectorFormSchema = z.object({
  name: z.string().min(1, "Sector name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
});

const businessFormSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
});

const provinceFormSchema = z.object({
  name: z.string().min(1, "Province name is required"),
});

const districtFormSchema = z.object({
  name: z.string().min(1, "District name is required"),
});

const licenseTypeFormSchema = z.object({
  name: z.string().min(1, "License type name is required"),
});

  

type SectorFormData = z.infer<typeof sectorFormSchema>;
type BusinessFormData = z.infer<typeof businessFormSchema>;
type ProvinceFormData = z.infer<typeof provinceFormSchema>;
type DistrictFormData = z.infer<typeof districtFormSchema>;
type LicenseTypeFormData = z.infer<typeof licenseTypeFormSchema>;
type MenuItemType = "sector" | "province" | "licenseType" | "userRole";

export default function LookupPage() {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>("sector");
  
  // Sector/Business state
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithSector | null>(null);
  const [showSectorDialog, setShowSectorDialog] = useState(false);
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);
  const [viewingSectorBusinesses, setViewingSectorBusinesses] = useState<Sector | null>(null);
  
  // Province/District state
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictWithProvince | null>(null);
  const [showProvinceDialog, setShowProvinceDialog] = useState(false);
  const [showDistrictDialog, setShowDistrictDialog] = useState(false);
  const [viewingProvinceDistricts, setViewingProvinceDistricts] = useState<Province | null>(null);
  
  // License Types state
  const [selectedLicenseType, setSelectedLicenseType] = useState<LicenseType | null>(null);
  const [showLicenseTypeDialog, setShowLicenseTypeDialog] = useState(false);

  
  
  // Shared state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<"sector" | "business" | "province" | "district" | "licenseType" | "userRole">("sector");
  const [deleteId, setDeleteId] = useState<string | number>("");
  const [isEditMode, setIsEditMode] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Forms
  const sectorForm = useForm<SectorFormData>({
    resolver: zodResolver(sectorFormSchema),
    defaultValues: { name: "", code: "", description: "" },
  });

  const businessForm = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: { name: "", code: "", description: "" },
  });

  const provinceForm = useForm<ProvinceFormData>({
    resolver: zodResolver(provinceFormSchema),
    defaultValues: { name: "" },
  });

  const districtForm = useForm<DistrictFormData>({
    resolver: zodResolver(districtFormSchema),
    defaultValues: { name: "" },
  });

  const licenseTypeForm = useForm<LicenseTypeFormData>({
    resolver: zodResolver(licenseTypeFormSchema),
    defaultValues: { name: "" },
  });

  

  // Queries
  const { data: sectors, isLoading: loadingSectors } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
    queryFn: async () => {
      const res = await fetch("/api/sectors", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sectors");
      return res.json();
    },
  });

  const { data: businesses, isLoading: loadingBusinesses } = useQuery<BusinessWithSector[]>({
    queryKey: ["/api/businesses"],
    queryFn: async () => {
      const res = await fetch("/api/businesses", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch businesses");
      return res.json();
    },
  });

  const { data: provinces, isLoading: loadingProvinces } = useQuery<Province[]>({
    queryKey: ["/api/provinces"],
    queryFn: async () => {
      const res = await fetch("/api/provinces", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch provinces");
      return res.json();
    },
  });

  const { data: districts, isLoading: loadingDistricts } = useQuery<DistrictWithProvince[]>({
    queryKey: ["/api/districts"],
    queryFn: async () => {
      const res = await fetch("/api/districts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch districts");
      return res.json();
    },
  });

  const { data: licenseTypes, isLoading: loadingLicenseTypes } = useQuery<LicenseType[]>({
    queryKey: ["/api/license-types"],
    queryFn: async () => {
      const res = await fetch("/api/license-types", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch license types");
      return res.json();
    },
  });

  const systemRolesList = [
    { value: "user", label: "User", description: "Basic user with page-level permissions" },
    { value: "finance_officer", label: "Financing Officer", description: "Linked to a specific financing officer profile" },
    { value: "fad", label: "FAD Officer", description: "Financial Analysis & Due Diligence reviewer" },
    { value: "risk_compliance", label: "Risk & Compliance", description: "Risk and compliance reviewer" },
    { value: "sharia", label: "Sharia Officer", description: "Sharia compliance reviewer" },
    { value: "cfo", label: "CFO", description: "Chief Financial Officer - committee voting" },
    { value: "coo", label: "COO", description: "Chief Operating Officer - committee voting" },
    { value: "ceo", label: "CEO", description: "Chief Executive Officer - committee voting" },
    { value: "manager", label: "Manager", description: "Full access to all pages (managerial)" },
    { value: "admin", label: "Admin", description: "Full system access including user management" },
  ];

  // Sector Mutations
  const createSectorMutation = useMutation({
    mutationFn: async (data: SectorFormData) => apiRequest("POST", "/api/sectors", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sectors"] });
      toast({ title: "Sector Created", description: "The sector has been created successfully." });
      setShowSectorDialog(false);
      sectorForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to create sector.", variant: "destructive" }),
  });

  const updateSectorMutation = useMutation({
    mutationFn: async (data: SectorFormData) => apiRequest("PATCH", `/api/sectors/${selectedSector?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sectors"] });
      toast({ title: "Sector Updated", description: "The sector has been updated successfully." });
      setShowSectorDialog(false);
      setSelectedSector(null);
      setIsEditMode(false);
      sectorForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to update sector.", variant: "destructive" }),
  });

  const deleteSectorMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/sectors/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sectors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Sector Deleted", description: "The sector and its businesses have been deleted." });
      setShowDeleteDialog(false);
    },
    onError: () => toast({ title: "Error", description: "Failed to delete sector.", variant: "destructive" }),
  });

  // Business Mutations
  const createBusinessMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => apiRequest("POST", "/api/businesses", { ...data, sectorId: viewingSectorBusinesses?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Business Created", description: "The business has been created successfully." });
      setShowBusinessDialog(false);
      businessForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to create business.", variant: "destructive" }),
  });

  const updateBusinessMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => apiRequest("PATCH", `/api/businesses/${selectedBusiness?.id}`, { ...data, sectorId: viewingSectorBusinesses?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Business Updated", description: "The business has been updated successfully." });
      setShowBusinessDialog(false);
      setSelectedBusiness(null);
      setIsEditMode(false);
      businessForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to update business.", variant: "destructive" }),
  });

  const deleteBusinessMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/businesses/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Business Deleted", description: "The business has been deleted." });
      setShowDeleteDialog(false);
    },
    onError: () => toast({ title: "Error", description: "Failed to delete business.", variant: "destructive" }),
  });

  // Province Mutations
  const createProvinceMutation = useMutation({
    mutationFn: async (data: ProvinceFormData) => apiRequest("POST", "/api/provinces", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provinces"] });
      toast({ title: "Province Created", description: "The province has been created successfully." });
      setShowProvinceDialog(false);
      provinceForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to create province.", variant: "destructive" }),
  });

  const updateProvinceMutation = useMutation({
    mutationFn: async (data: ProvinceFormData) => apiRequest("PATCH", `/api/provinces/${selectedProvince?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provinces"] });
      toast({ title: "Province Updated", description: "The province has been updated successfully." });
      setShowProvinceDialog(false);
      setSelectedProvince(null);
      setIsEditMode(false);
      provinceForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to update province.", variant: "destructive" }),
  });

  const deleteProvinceMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/provinces/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provinces"] });
      queryClient.invalidateQueries({ queryKey: ["/api/districts"] });
      toast({ title: "Province Deleted", description: "The province and its districts have been deleted." });
      setShowDeleteDialog(false);
    },
    onError: () => toast({ title: "Error", description: "Failed to delete province.", variant: "destructive" }),
  });

  // District Mutations
  const createDistrictMutation = useMutation({
    mutationFn: async (data: DistrictFormData) => apiRequest("POST", "/api/districts", { ...data, provinceId: viewingProvinceDistricts?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/districts"] });
      toast({ title: "District Created", description: "The district has been created successfully." });
      setShowDistrictDialog(false);
      districtForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to create district.", variant: "destructive" }),
  });

  const updateDistrictMutation = useMutation({
    mutationFn: async (data: DistrictFormData) => apiRequest("PATCH", `/api/districts/${selectedDistrict?.id}`, { ...data, provinceId: viewingProvinceDistricts?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/districts"] });
      toast({ title: "District Updated", description: "The district has been updated successfully." });
      setShowDistrictDialog(false);
      setSelectedDistrict(null);
      setIsEditMode(false);
      districtForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to update district.", variant: "destructive" }),
  });

  const deleteDistrictMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/districts/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/districts"] });
      toast({ title: "District Deleted", description: "The district has been deleted." });
      setShowDeleteDialog(false);
    },
    onError: () => toast({ title: "Error", description: "Failed to delete district.", variant: "destructive" }),
  });

  // License Type Mutations
  const createLicenseTypeMutation = useMutation({
    mutationFn: async (data: LicenseTypeFormData) => apiRequest("POST", "/api/license-types", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/license-types"] });
      toast({ title: "License Type Created", description: "The license type has been created successfully." });
      setShowLicenseTypeDialog(false);
      licenseTypeForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to create license type.", variant: "destructive" }),
  });

  const updateLicenseTypeMutation = useMutation({
    mutationFn: async (data: LicenseTypeFormData) => apiRequest("PATCH", `/api/license-types/${selectedLicenseType?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/license-types"] });
      toast({ title: "License Type Updated", description: "The license type has been updated successfully." });
      setShowLicenseTypeDialog(false);
      setSelectedLicenseType(null);
      setIsEditMode(false);
      licenseTypeForm.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to update license type.", variant: "destructive" }),
  });

  const deleteLicenseTypeMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/license-types/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/license-types"] });
      toast({ title: "License Type Deleted", description: "The license type has been deleted." });
      setShowDeleteDialog(false);
    },
    onError: () => toast({ title: "Error", description: "Failed to delete license type.", variant: "destructive" }),
  });

  

  

  // Handlers
  const handleOpenSectorDialog = (sector?: Sector) => {
    if (sector) {
      setSelectedSector(sector);
      setIsEditMode(true);
      sectorForm.reset({ name: sector.name, code: sector.code || "", description: sector.description || "" });
    } else {
      setSelectedSector(null);
      setIsEditMode(false);
      sectorForm.reset({ name: "", code: "", description: "" });
    }
    setShowSectorDialog(true);
  };

  const handleOpenBusinessDialog = (business?: BusinessWithSector) => {
    if (business) {
      setSelectedBusiness(business);
      setIsEditMode(true);
      businessForm.reset({ name: business.name, code: business.code || "", description: business.description || "" });
    } else {
      setSelectedBusiness(null);
      setIsEditMode(false);
      businessForm.reset({ name: "", code: "", description: "" });
    }
    setShowBusinessDialog(true);
  };

  const handleOpenProvinceDialog = (province?: Province) => {
    if (province) {
      setSelectedProvince(province);
      setIsEditMode(true);
      provinceForm.reset({ name: province.name });
    } else {
      setSelectedProvince(null);
      setIsEditMode(false);
      provinceForm.reset({ name: "" });
    }
    setShowProvinceDialog(true);
  };

  const handleOpenDistrictDialog = (district?: DistrictWithProvince) => {
    if (district) {
      setSelectedDistrict(district);
      setIsEditMode(true);
      districtForm.reset({ name: district.name });
    } else {
      setSelectedDistrict(null);
      setIsEditMode(false);
      districtForm.reset({ name: "" });
    }
    setShowDistrictDialog(true);
  };

  const handleOpenLicenseTypeDialog = (licenseType?: LicenseType) => {
    if (licenseType) {
      setSelectedLicenseType(licenseType);
      setIsEditMode(true);
      licenseTypeForm.reset({ name: licenseType.name });
    } else {
      setSelectedLicenseType(null);
      setIsEditMode(false);
      licenseTypeForm.reset({ name: "" });
    }
    setShowLicenseTypeDialog(true);
  };

  

  const handleDelete = (type: "sector" | "business" | "province" | "district" | "licenseType" | "userRole", id: string | number) => {
    setDeleteType(type);
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteType === "sector") {
      deleteSectorMutation.mutate(deleteId as string);
    } else if (deleteType === "business") {
      deleteBusinessMutation.mutate(deleteId as string);
    } else if (deleteType === "province") {
      deleteProvinceMutation.mutate(deleteId as number);
    } else if (deleteType === "district") {
      deleteDistrictMutation.mutate(deleteId as number);
    } else if (deleteType === "licenseType") {
      deleteLicenseTypeMutation.mutate(deleteId as number);
    }
  };

  const onSectorSubmit = (data: SectorFormData) => {
    if (isEditMode && selectedSector) {
      updateSectorMutation.mutate(data);
    } else {
      createSectorMutation.mutate(data);
    }
  };

  const onBusinessSubmit = (data: BusinessFormData) => {
    if (isEditMode && selectedBusiness) {
      updateBusinessMutation.mutate(data);
    } else {
      createBusinessMutation.mutate(data);
    }
  };

  const onProvinceSubmit = (data: ProvinceFormData) => {
    if (isEditMode && selectedProvince) {
      updateProvinceMutation.mutate(data);
    } else {
      createProvinceMutation.mutate(data);
    }
  };

  const onDistrictSubmit = (data: DistrictFormData) => {
    if (isEditMode && selectedDistrict) {
      updateDistrictMutation.mutate(data);
    } else {
      createDistrictMutation.mutate(data);
    }
  };

  const onLicenseTypeSubmit = (data: LicenseTypeFormData) => {
    if (isEditMode && selectedLicenseType) {
      updateLicenseTypeMutation.mutate(data);
    } else {
      createLicenseTypeMutation.mutate(data);
    }
  };

  

  const getBusinessesForSector = (sectorId: string) => businesses?.filter((b) => b.sectorId === sectorId) || [];
  const getDistrictsForProvince = (provinceId: number) => districts?.filter((d) => d.provinceId === provinceId) || [];

  const menuItems = [
    { id: "sector" as MenuItemType, label: "Sector", icon: Layers, color: "text-emerald-600" },
    { id: "province" as MenuItemType, label: "Province", icon: MapPin, color: "text-blue-600" },
    { id: "licenseType" as MenuItemType, label: "Type of License", icon: FileCheck, color: "text-orange-600" },
    { id: "userRole" as MenuItemType, label: "User Roles", icon: Shield, color: "text-purple-600" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="h-6 w-6 text-emerald-600" />
        <h1 className="text-xl font-bold">Lookup Data</h1>
      </div>

      <div className="flex gap-4 h-[calc(100vh-140px)]">
        {/* Left Panel - 30% Menu Items */}
        <div className="w-[30%]">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Menu</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={selectedMenuItem === item.id ? "secondary" : "ghost"}
                    className="w-full justify-between h-12"
                    onClick={() => {
                      setSelectedMenuItem(item.id);
                      setViewingSectorBusinesses(null);
                      setViewingProvinceDistricts(null);
                    }}
                    data-testid={`menu-item-${item.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - 70% Content Area */}
        <div className="w-[70%]">
          <Card className="h-full overflow-hidden">
            {/* SECTOR LIST */}
            {selectedMenuItem === "sector" && !viewingSectorBusinesses && (
              <>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Layers className="h-5 w-5 text-emerald-600" />
                      Sectors
                    </CardTitle>
                    <Button onClick={() => handleOpenSectorDialog()} className="bg-emerald-600 hover:bg-emerald-700" data-testid="button-add-new-sector">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Sector
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                  {loadingSectors ? (
                    <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                  ) : sectors && sectors.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Sector Name</TableHead>
                          <TableHead className="text-xs">Code</TableHead>
                          <TableHead className="text-xs">Description</TableHead>
                          <TableHead className="text-xs">Businesses</TableHead>
                          <TableHead className="text-xs text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sectors.map((sector) => (
                          <TableRow key={sector.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-emerald-600" />
                                {sector.name}
                              </div>
                            </TableCell>
                            <TableCell>{sector.code ? <Badge variant="outline">{sector.code}</Badge> : "-"}</TableCell>
                            <TableCell className="text-muted-foreground max-w-[200px] truncate">{sector.description || "-"}</TableCell>
                            <TableCell><Badge className="bg-emerald-100 text-emerald-700">{getBusinessesForSector(sector.id).length}</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="outline" size="sm" onClick={() => setViewingSectorBusinesses(sector)} className="text-amber-600 border-amber-600 hover:bg-amber-50" data-testid={`button-add-business-${sector.id}`}>
                                  <Building2 className="h-4 w-4 mr-1" />
                                  Add Business
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleOpenSectorDialog(sector)} data-testid={`button-edit-sector-${sector.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete("sector", sector.id)} data-testid={`button-delete-sector-${sector.id}`}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No sectors found. Click "Add New Sector" to create one.</p>
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {/* SECTOR BUSINESSES */}
            {selectedMenuItem === "sector" && viewingSectorBusinesses && (
              <>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setViewingSectorBusinesses(null)} data-testid="button-back-to-sectors">
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-amber-600" />
                        Businesses - {viewingSectorBusinesses.name}
                      </CardTitle>
                    </div>
                    <Button onClick={() => handleOpenBusinessDialog()} className="bg-amber-600 hover:bg-amber-700" data-testid="button-add-new-business">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Business
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                  {loadingBusinesses ? (
                    <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                  ) : getBusinessesForSector(viewingSectorBusinesses.id).length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Business Name</TableHead>
                          <TableHead className="text-xs">Code</TableHead>
                          <TableHead className="text-xs">Description</TableHead>
                          <TableHead className="text-xs text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getBusinessesForSector(viewingSectorBusinesses.id).map((business) => (
                          <TableRow key={business.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-amber-600" />
                                {business.name}
                              </div>
                            </TableCell>
                            <TableCell>{business.code ? <Badge variant="outline">{business.code}</Badge> : "-"}</TableCell>
                            <TableCell className="text-muted-foreground max-w-[200px] truncate">{business.description || "-"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenBusinessDialog(business)} data-testid={`button-edit-business-${business.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete("business", business.id)} data-testid={`button-delete-business-${business.id}`}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No businesses found for this sector. Click "Add New Business" to create one.</p>
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {/* PROVINCE LIST */}
            {selectedMenuItem === "province" && !viewingProvinceDistricts && (
              <>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Provinces
                    </CardTitle>
                    <Button onClick={() => handleOpenProvinceDialog()} className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-new-province">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Province
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                  {loadingProvinces ? (
                    <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                  ) : provinces && provinces.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">ID</TableHead>
                          <TableHead className="text-xs">Province Name</TableHead>
                          <TableHead className="text-xs">Districts</TableHead>
                          <TableHead className="text-xs text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {provinces.map((province) => (
                          <TableRow key={province.id}>
                            <TableCell className="font-medium">{province.id}</TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-blue-600" />
                                {province.name}
                              </div>
                            </TableCell>
                            <TableCell><Badge className="bg-blue-100 text-blue-700">{getDistrictsForProvince(province.id).length}</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="outline" size="sm" onClick={() => setViewingProvinceDistricts(province)} className="text-purple-600 border-purple-600 hover:bg-purple-50" data-testid={`button-add-district-${province.id}`}>
                                  <Map className="h-4 w-4 mr-1" />
                                  Add District
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleOpenProvinceDialog(province)} data-testid={`button-edit-province-${province.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete("province", province.id)} data-testid={`button-delete-province-${province.id}`}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No provinces found. Click "Add New Province" to create one.</p>
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {/* PROVINCE DISTRICTS */}
            {selectedMenuItem === "province" && viewingProvinceDistricts && (
              <>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setViewingProvinceDistricts(null)} data-testid="button-back-to-provinces">
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Map className="h-5 w-5 text-purple-600" />
                        Districts - {viewingProvinceDistricts.name}
                      </CardTitle>
                    </div>
                    <Button onClick={() => handleOpenDistrictDialog()} className="bg-purple-600 hover:bg-purple-700" data-testid="button-add-new-district">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New District
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                  {loadingDistricts ? (
                    <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                  ) : getDistrictsForProvince(viewingProvinceDistricts.id).length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">ID</TableHead>
                          <TableHead className="text-xs">District Name</TableHead>
                          <TableHead className="text-xs text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getDistrictsForProvince(viewingProvinceDistricts.id).map((district) => (
                          <TableRow key={district.id}>
                            <TableCell className="font-medium">{district.id}</TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Map className="h-4 w-4 text-purple-600" />
                                {district.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenDistrictDialog(district)} data-testid={`button-edit-district-${district.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete("district", district.id)} data-testid={`button-delete-district-${district.id}`}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Map className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No districts found for this province. Click "Add New District" to create one.</p>
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {/* LICENSE TYPES LIST */}
            {selectedMenuItem === "licenseType" && (
              <>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-orange-600" />
                      Types of License
                    </CardTitle>
                    <Button onClick={() => handleOpenLicenseTypeDialog()} className="bg-orange-600 hover:bg-orange-700" data-testid="button-add-new-license-type">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New License Type
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                  {loadingLicenseTypes ? (
                    <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                  ) : licenseTypes && licenseTypes.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs w-20">ID</TableHead>
                          <TableHead className="text-xs">Type of License</TableHead>
                          <TableHead className="text-xs text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {licenseTypes.map((licenseType) => (
                          <TableRow key={licenseType.id}>
                            <TableCell className="font-medium">{licenseType.id}</TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <FileCheck className="h-4 w-4 text-orange-600" />
                                {licenseType.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenLicenseTypeDialog(licenseType)} data-testid={`button-edit-license-type-${licenseType.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete("licenseType", licenseType.id)} data-testid={`button-delete-license-type-${licenseType.id}`}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No license types found. Click "Add New License Type" to create one.</p>
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {/* USER ROLES */}
            {selectedMenuItem === "userRole" && (
              <>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      User Roles
                    </CardTitle>
                    
                  </div>
                </CardHeader>
                <CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                  <p className="text-sm text-muted-foreground mb-3">System roles are predefined and managed through the user_roles table. Assign roles to users from the Users page.</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs w-12">#</TableHead>
                        <TableHead className="text-xs">Role Value</TableHead>
                        <TableHead className="text-xs">Display Label</TableHead>
                        <TableHead className="text-xs">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {systemRolesList.map((role, index) => (
                        <TableRow key={role.value} data-testid={`row-role-${role.value}`}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30">
                              {role.value}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-purple-600" />
                              {role.label}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{role.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Add/Edit Sector Dialog */}
      <Dialog open={showSectorDialog} onOpenChange={setShowSectorDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-600" />
              {isEditMode ? "Edit Sector" : "Add Sector"}
            </DialogTitle>
          </DialogHeader>
          <Form {...sectorForm}>
            <form onSubmit={sectorForm.handleSubmit(onSectorSubmit)} className="space-y-4">
              <FormField control={sectorForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector Name *</FormLabel>
                  <FormControl><Input placeholder="e.g., Transportation" className="h-9" {...field} data-testid="input-sector-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={sectorForm.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl><Input placeholder="e.g., TRANS" className="h-9" {...field} data-testid="input-sector-code" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={sectorForm.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Description..." className="resize-none" rows={3} {...field} data-testid="input-sector-desc" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={createSectorMutation.isPending || updateSectorMutation.isPending} data-testid="button-submit-sector">
                <Plus className="h-4 w-4 mr-2" />
                {createSectorMutation.isPending || updateSectorMutation.isPending ? "Saving..." : isEditMode ? "Update Sector" : "Add Sector"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Business Dialog */}
      <Dialog open={showBusinessDialog} onOpenChange={setShowBusinessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-600" />
              {isEditMode ? "Edit Business" : "Add Business"}
            </DialogTitle>
            {viewingSectorBusinesses && <DialogDescription>Adding business to: {viewingSectorBusinesses.name}</DialogDescription>}
          </DialogHeader>
          <Form {...businessForm}>
            <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-4">
              <FormField control={businessForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name *</FormLabel>
                  <FormControl><Input placeholder="e.g., Three wheel motorcycle" className="h-9" {...field} data-testid="input-business-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={businessForm.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl><Input placeholder="e.g., TWM" className="h-9" {...field} data-testid="input-business-code" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={businessForm.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Description..." className="resize-none" rows={3} {...field} data-testid="input-business-desc" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={createBusinessMutation.isPending || updateBusinessMutation.isPending} data-testid="button-submit-business">
                <Plus className="h-4 w-4 mr-2" />
                {createBusinessMutation.isPending || updateBusinessMutation.isPending ? "Saving..." : isEditMode ? "Update Business" : "Add Business"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Province Dialog */}
      <Dialog open={showProvinceDialog} onOpenChange={setShowProvinceDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              {isEditMode ? "Edit Province" : "Add Province"}
            </DialogTitle>
          </DialogHeader>
          <Form {...provinceForm}>
            <form onSubmit={provinceForm.handleSubmit(onProvinceSubmit)} className="space-y-4">
              <FormField control={provinceForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Province Name *</FormLabel>
                  <FormControl><Input placeholder="e.g., Kabul" className="h-9" {...field} data-testid="input-province-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={createProvinceMutation.isPending || updateProvinceMutation.isPending} data-testid="button-submit-province">
                <Plus className="h-4 w-4 mr-2" />
                {createProvinceMutation.isPending || updateProvinceMutation.isPending ? "Saving..." : isEditMode ? "Update Province" : "Add Province"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit District Dialog */}
      <Dialog open={showDistrictDialog} onOpenChange={setShowDistrictDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-purple-600" />
              {isEditMode ? "Edit District" : "Add District"}
            </DialogTitle>
            {viewingProvinceDistricts && <DialogDescription>Adding district to: {viewingProvinceDistricts.name}</DialogDescription>}
          </DialogHeader>
          <Form {...districtForm}>
            <form onSubmit={districtForm.handleSubmit(onDistrictSubmit)} className="space-y-4">
              <FormField control={districtForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>District Name *</FormLabel>
                  <FormControl><Input placeholder="e.g., Kabul District 1" className="h-9" {...field} data-testid="input-district-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={createDistrictMutation.isPending || updateDistrictMutation.isPending} data-testid="button-submit-district">
                <Plus className="h-4 w-4 mr-2" />
                {createDistrictMutation.isPending || updateDistrictMutation.isPending ? "Saving..." : isEditMode ? "Update District" : "Add District"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit License Type Dialog */}
      <Dialog open={showLicenseTypeDialog} onOpenChange={setShowLicenseTypeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-orange-600" />
              {isEditMode ? "Edit License Type" : "Add License Type"}
            </DialogTitle>
          </DialogHeader>
          <Form {...licenseTypeForm}>
            <form onSubmit={licenseTypeForm.handleSubmit(onLicenseTypeSubmit)} className="space-y-4">
              <FormField control={licenseTypeForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of License *</FormLabel>
                  <FormControl><Input placeholder="e.g., Business License" className="h-9" {...field} data-testid="input-license-type-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={createLicenseTypeMutation.isPending || updateLicenseTypeMutation.isPending} data-testid="button-submit-license-type">
                <Plus className="h-4 w-4 mr-2" />
                {createLicenseTypeMutation.isPending || updateLicenseTypeMutation.isPending ? "Saving..." : isEditMode ? "Update License Type" : "Add License Type"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              {deleteType === "sector" && "Are you sure you want to delete this sector? All businesses under this sector will also be deleted."}
              {deleteType === "business" && "Are you sure you want to delete this business?"}
              {deleteType === "province" && "Are you sure you want to delete this province? All districts under this province will also be deleted."}
              {deleteType === "district" && "Are you sure you want to delete this district?"}
              {deleteType === "licenseType" && "Are you sure you want to delete this license type?"}
              
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} data-testid="button-cancel-delete">Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteSectorMutation.isPending || deleteBusinessMutation.isPending || deleteProvinceMutation.isPending || deleteDistrictMutation.isPending || deleteLicenseTypeMutation.isPending} data-testid="button-confirm-delete">
              {deleteSectorMutation.isPending || deleteBusinessMutation.isPending || deleteProvinceMutation.isPending || deleteDistrictMutation.isPending || deleteLicenseTypeMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
