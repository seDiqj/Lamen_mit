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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Layers,
  Building2,
  ChevronDown,
} from "lucide-react";
import type { Sector, Business } from "@shared/schema";

type BusinessWithSector = Business & { sectorName?: string };

const sectorFormSchema = z.object({
  name: z.string().min(1, "Sector name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
});

const businessFormSchema = z.object({
  sectorId: z.string().min(1, "Sector is required"),
  name: z.string().min(1, "Business name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
});

type SectorFormData = z.infer<typeof sectorFormSchema>;
type BusinessFormData = z.infer<typeof businessFormSchema>;

export default function LookupPage() {
  const [sectorSearch, setSectorSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithSector | null>(null);
  const [showSectorDialog, setShowSectorDialog] = useState(false);
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<"sector" | "business">("sector");
  const [deleteId, setDeleteId] = useState<string>("");
  const [activeSectorId, setActiveSectorId] = useState<string>("");

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
      sectorId: "",
      name: "",
      code: "",
      description: "",
    },
  });

  const { data: sectors, isLoading: loadingSectors } = useQuery<Sector[]>({
    queryKey: ["/api/sectors", sectorSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (sectorSearch) params.set("search", sectorSearch);
      const url = params.toString() ? `/api/sectors?${params.toString()}` : "/api/sectors";
      const res = await fetch(url, { credentials: "include" });
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
      return apiRequest("POST", "/api/businesses", data);
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
      return apiRequest("PATCH", `/api/businesses/${selectedBusiness?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Business Updated", description: "The business has been updated successfully." });
      setShowBusinessDialog(false);
      setSelectedBusiness(null);
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
      sectorForm.reset({
        name: sector.name,
        code: sector.code || "",
        description: sector.description || "",
      });
    } else {
      setSelectedSector(null);
      sectorForm.reset({ name: "", code: "", description: "" });
    }
    setShowSectorDialog(true);
  };

  const handleOpenBusinessDialog = (business?: BusinessWithSector, sectorId?: string) => {
    if (business) {
      setSelectedBusiness(business);
      businessForm.reset({
        sectorId: business.sectorId,
        name: business.name,
        code: business.code || "",
        description: business.description || "",
      });
    } else {
      setSelectedBusiness(null);
      businessForm.reset({ 
        sectorId: sectorId || "", 
        name: "", 
        code: "", 
        description: "" 
      });
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
    if (selectedSector) {
      updateSectorMutation.mutate(data);
    } else {
      createSectorMutation.mutate(data);
    }
  };

  const onBusinessSubmit = (data: BusinessFormData) => {
    if (selectedBusiness) {
      updateBusinessMutation.mutate(data);
    } else {
      createBusinessMutation.mutate(data);
    }
  };

  const getBusinessesForSector = (sectorId: string) => {
    return businesses?.filter((b) => b.sectorId === sectorId) || [];
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-emerald-600" />
          <h1 className="text-xl font-bold">Lookup Data - Sector / Business</h1>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Left Panel - 30% Input Area */}
        <div className="w-[30%] space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                Add Sector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...sectorForm}>
                <form onSubmit={sectorForm.handleSubmit((data) => createSectorMutation.mutate(data))} className="space-y-3">
                  <FormField
                    control={sectorForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Sector Name *</FormLabel>
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
                        <FormLabel className="text-xs">Code</FormLabel>
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
                        <FormLabel className="text-xs">Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description..." className="resize-none" rows={2} {...field} data-testid="input-sector-desc" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={createSectorMutation.isPending}
                    data-testid="button-add-sector"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {createSectorMutation.isPending ? "Adding..." : "Add Sector"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-600" />
                Add Business
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...businessForm}>
                <form onSubmit={businessForm.handleSubmit((data) => createBusinessMutation.mutate(data))} className="space-y-3">
                  <FormField
                    control={businessForm.control}
                    name="sectorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Sector *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9" data-testid="select-business-sector">
                              <SelectValue placeholder="Select sector" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sectors?.map((sector) => (
                              <SelectItem key={sector.id} value={sector.id}>
                                {sector.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={businessForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Business Name *</FormLabel>
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
                        <FormLabel className="text-xs">Code</FormLabel>
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
                        <FormLabel className="text-xs">Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description..." className="resize-none" rows={2} {...field} data-testid="input-business-desc" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={createBusinessMutation.isPending}
                    data-testid="button-add-business"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {createBusinessMutation.isPending ? "Adding..." : "Add Business"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - 70% Display Area */}
        <div className="w-[70%]">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Sectors & Businesses</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sectors..."
                    value={sectorSearch}
                    onChange={(e) => setSectorSearch(e.target.value)}
                    className="pl-8 h-9"
                    data-testid="input-search-sectors"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingSectors ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : sectors && sectors.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                  {sectors.map((sector) => {
                    const sectorBusinesses = getBusinessesForSector(sector.id);
                    return (
                      <AccordionItem key={sector.id} value={sector.id}>
                        <AccordionTrigger className="hover:no-underline py-2">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-2">
                              <Layers className="h-4 w-4 text-emerald-600" />
                              <span className="font-medium">{sector.name}</span>
                              {sector.code && (
                                <Badge variant="outline" className="text-xs">{sector.code}</Badge>
                              )}
                              <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                {sectorBusinesses.length} businesses
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenBusinessDialog(undefined, sector.id)}
                                title="Add Business"
                                data-testid={`button-add-business-${sector.id}`}
                              >
                                <Plus className="h-4 w-4 text-amber-600" />
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
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {sector.description && (
                            <p className="text-sm text-muted-foreground mb-3 pl-6">{sector.description}</p>
                          )}
                          {sectorBusinesses.length > 0 ? (
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
                                {sectorBusinesses.map((business) => (
                                  <TableRow key={business.id}>
                                    <TableCell className="text-sm font-medium">
                                      <div className="flex items-center gap-2">
                                        <Building2 className="h-3 w-3 text-amber-600" />
                                        {business.name}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {business.code || "-"}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
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
                            <p className="text-sm text-muted-foreground pl-6 py-2">
                              No businesses in this sector yet. Click + to add one.
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No sectors found. Add your first sector using the form on the left.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Sector Dialog */}
      <Dialog open={showSectorDialog} onOpenChange={setShowSectorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSector ? "Edit Sector" : "Add Sector"}</DialogTitle>
            <DialogDescription>
              {selectedSector ? "Update the sector details." : "Add a new sector."}
            </DialogDescription>
          </DialogHeader>
          <Form {...sectorForm}>
            <form onSubmit={sectorForm.handleSubmit(onSectorSubmit)} className="space-y-4">
              <FormField
                control={sectorForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="dialog-input-sector-name" />
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
                      <Input {...field} data-testid="dialog-input-sector-code" />
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
                      <Textarea {...field} data-testid="dialog-input-sector-desc" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowSectorDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateSectorMutation.isPending}
                  data-testid="button-save-sector"
                >
                  {updateSectorMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Business Dialog */}
      <Dialog open={showBusinessDialog} onOpenChange={setShowBusinessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBusiness ? "Edit Business" : "Add Business"}</DialogTitle>
            <DialogDescription>
              {selectedBusiness ? "Update the business details." : "Add a new business to a sector."}
            </DialogDescription>
          </DialogHeader>
          <Form {...businessForm}>
            <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-4">
              <FormField
                control={businessForm.control}
                name="sectorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="dialog-select-business-sector">
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sectors?.map((sector) => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={businessForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="dialog-input-business-name" />
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
                      <Input {...field} data-testid="dialog-input-business-code" />
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
                      <Textarea {...field} data-testid="dialog-input-business-desc" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowBusinessDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createBusinessMutation.isPending || updateBusinessMutation.isPending}
                  data-testid="button-save-business"
                >
                  {(createBusinessMutation.isPending || updateBusinessMutation.isPending) ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
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
                ? "Are you sure you want to delete this sector? All businesses in this sector will also be deleted."
                : "Are you sure you want to delete this business?"
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteSectorMutation.isPending || deleteBusinessMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {(deleteSectorMutation.isPending || deleteBusinessMutation.isPending) ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
