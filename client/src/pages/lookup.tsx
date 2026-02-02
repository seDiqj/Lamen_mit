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
} from "lucide-react";
import type { Sector, Business } from "@shared/schema";

type BusinessWithSector = Business & { sectorName?: string };

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

type SectorFormData = z.infer<typeof sectorFormSchema>;
type BusinessFormData = z.infer<typeof businessFormSchema>;

type MenuItemType = "sector";

export default function LookupPage() {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>("sector");
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithSector | null>(null);
  const [showSectorDialog, setShowSectorDialog] = useState(false);
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<"sector" | "business">("sector");
  const [deleteId, setDeleteId] = useState<string>("");
  const [viewingSectorBusinesses, setViewingSectorBusinesses] = useState<Sector | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sectorForm = useForm<SectorFormData>({
    resolver: zodResolver(sectorFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const businessForm = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

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

  const createSectorMutation = useMutation({
    mutationFn: async (data: SectorFormData) => {
      return apiRequest("POST", "/api/sectors", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sectors"] });
      toast({ title: "Sector Created", description: "The sector has been created successfully." });
      setShowSectorDialog(false);
      sectorForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create sector.", variant: "destructive" });
    },
  });

  const updateSectorMutation = useMutation({
    mutationFn: async (data: SectorFormData) => {
      return apiRequest("PATCH", `/api/sectors/${selectedSector?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sectors"] });
      toast({ title: "Sector Updated", description: "The sector has been updated successfully." });
      setShowSectorDialog(false);
      setSelectedSector(null);
      setIsEditMode(false);
      sectorForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update sector.", variant: "destructive" });
    },
  });

  const deleteSectorMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/sectors/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sectors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Sector Deleted", description: "The sector and its businesses have been deleted." });
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete sector.", variant: "destructive" });
    },
  });

  const createBusinessMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      return apiRequest("POST", "/api/businesses", { ...data, sectorId: viewingSectorBusinesses?.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Business Created", description: "The business has been created successfully." });
      setShowBusinessDialog(false);
      businessForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create business.", variant: "destructive" });
    },
  });

  const updateBusinessMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      return apiRequest("PATCH", `/api/businesses/${selectedBusiness?.id}`, { ...data, sectorId: viewingSectorBusinesses?.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Business Updated", description: "The business has been updated successfully." });
      setShowBusinessDialog(false);
      setSelectedBusiness(null);
      setIsEditMode(false);
      businessForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update business.", variant: "destructive" });
    },
  });

  const deleteBusinessMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/businesses/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Business Deleted", description: "The business has been deleted." });
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete business.", variant: "destructive" });
    },
  });

  const handleOpenSectorDialog = (sector?: Sector) => {
    if (sector) {
      setSelectedSector(sector);
      setIsEditMode(true);
      sectorForm.reset({
        name: sector.name,
        code: sector.code || "",
        description: sector.description || "",
      });
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
      businessForm.reset({
        name: business.name,
        code: business.code || "",
        description: business.description || "",
      });
    } else {
      setSelectedBusiness(null);
      setIsEditMode(false);
      businessForm.reset({ name: "", code: "", description: "" });
    }
    setShowBusinessDialog(true);
  };

  const handleDelete = (type: "sector" | "business", id: string) => {
    setDeleteType(type);
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteType === "sector") {
      deleteSectorMutation.mutate(deleteId);
    } else {
      deleteBusinessMutation.mutate(deleteId);
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

  const getBusinessesForSector = (sectorId: string) => {
    return businesses?.filter((b) => b.sectorId === sectorId) || [];
  };

  const handleViewSectorBusinesses = (sector: Sector) => {
    setViewingSectorBusinesses(sector);
  };

  const handleBackToSectors = () => {
    setViewingSectorBusinesses(null);
  };

  const menuItems = [
    { id: "sector" as MenuItemType, label: "Sector", icon: Layers, color: "text-emerald-600" },
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
            {selectedMenuItem === "sector" && !viewingSectorBusinesses && (
              <>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Layers className="h-5 w-5 text-emerald-600" />
                      Sectors
                    </CardTitle>
                    <Button
                      onClick={() => handleOpenSectorDialog()}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      data-testid="button-add-new-sector"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Sector
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                  {loadingSectors ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
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
                        {sectors.map((sector) => {
                          const sectorBusinesses = getBusinessesForSector(sector.id);
                          return (
                            <TableRow key={sector.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Layers className="h-4 w-4 text-emerald-600" />
                                  {sector.name}
                                </div>
                              </TableCell>
                              <TableCell>
                                {sector.code ? (
                                  <Badge variant="outline">{sector.code}</Badge>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground max-w-[200px] truncate">
                                {sector.description || "-"}
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-emerald-100 text-emerald-700">
                                  {sectorBusinesses.length}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewSectorBusinesses(sector)}
                                    className="text-amber-600 border-amber-600 hover:bg-amber-50"
                                    data-testid={`button-add-business-${sector.id}`}
                                  >
                                    <Building2 className="h-4 w-4 mr-1" />
                                    Add Business
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOpenSectorDialog(sector)}
                                    data-testid={`button-edit-sector-${sector.id}`}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete("sector", sector.id)}
                                    data-testid={`button-delete-sector-${sector.id}`}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
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

            {selectedMenuItem === "sector" && viewingSectorBusinesses && (
              <>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBackToSectors}
                        data-testid="button-back-to-sectors"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-amber-600" />
                        Businesses - {viewingSectorBusinesses.name}
                      </CardTitle>
                    </div>
                    <Button
                      onClick={() => handleOpenBusinessDialog()}
                      className="bg-amber-600 hover:bg-amber-700"
                      data-testid="button-add-new-business"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Business
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
                  {loadingBusinesses ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <>
                      {getBusinessesForSector(viewingSectorBusinesses.id).length > 0 ? (
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
                                <TableCell>
                                  {business.code ? (
                                    <Badge variant="outline">{business.code}</Badge>
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>
                                <TableCell className="text-muted-foreground max-w-[200px] truncate">
                                  {business.description || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleOpenBusinessDialog(business)}
                                      data-testid={`button-edit-business-${business.id}`}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDelete("business", business.id)}
                                      data-testid={`button-delete-business-${business.id}`}
                                    >
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
                    </>
                  )}
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
              <FormField
                control={sectorForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Transportation" className="h-9" {...field} data-testid="input-sector-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sectorForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TRANS" className="h-9" {...field} data-testid="input-sector-code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sectorForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description..." className="resize-none" rows={3} {...field} data-testid="input-sector-desc" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={createSectorMutation.isPending || updateSectorMutation.isPending}
                data-testid="button-submit-sector"
              >
                <Plus className="h-4 w-4 mr-2" />
                {createSectorMutation.isPending || updateSectorMutation.isPending 
                  ? "Saving..." 
                  : isEditMode 
                    ? "Update Sector" 
                    : "Add Sector"}
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
            {viewingSectorBusinesses && (
              <DialogDescription>
                Adding business to: {viewingSectorBusinesses.name}
              </DialogDescription>
            )}
          </DialogHeader>
          <Form {...businessForm}>
            <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-4">
              <FormField
                control={businessForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Three wheel motorcycle" className="h-9" {...field} data-testid="input-business-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={businessForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TWM" className="h-9" {...field} data-testid="input-business-code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={businessForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description..." className="resize-none" rows={3} {...field} data-testid="input-business-desc" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={createBusinessMutation.isPending || updateBusinessMutation.isPending}
                data-testid="button-submit-business"
              >
                <Plus className="h-4 w-4 mr-2" />
                {createBusinessMutation.isPending || updateBusinessMutation.isPending 
                  ? "Saving..." 
                  : isEditMode 
                    ? "Update Business" 
                    : "Add Business"}
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
              {deleteType === "sector" 
                ? "Are you sure you want to delete this sector? All businesses under this sector will also be deleted."
                : "Are you sure you want to delete this business?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteSectorMutation.isPending || deleteBusinessMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteSectorMutation.isPending || deleteBusinessMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
