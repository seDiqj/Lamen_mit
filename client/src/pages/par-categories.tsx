import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
  FormDescription,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, AlertTriangle, Percent } from "lucide-react";
import type { ParCategory } from "@shared/schema";

const parCategoryFormSchema = z.object({
  startDay: z.coerce.number().min(0, "Start day must be 0 or greater"),
  endDay: z.coerce.number().min(1, "End day must be greater than 0"),
  category: z.string().min(1, "Category name is required"),
  provisionPercent: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid percentage (e.g., 5.00)"),
}).refine((data) => data.endDay >= data.startDay, {
  message: "End day must be greater than or equal to start day",
  path: ["endDay"],
});

type ParCategoryFormData = z.infer<typeof parCategoryFormSchema>;

export default function ParCategoriesPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ParCategory | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<ParCategoryFormData>({
    resolver: zodResolver(parCategoryFormSchema),
    defaultValues: {
      startDay: 0,
      endDay: 30,
      category: "",
      provisionPercent: "0.00",
    },
  });

  const { data: categories, isLoading } = useQuery<ParCategory[]>({
    queryKey: ["/api/par-categories"],
    queryFn: async () => {
      const res = await fetch("/api/par-categories", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch PAR categories");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ParCategoryFormData) => apiRequest("POST", "/api/par-categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/par-categories"] });
      toast({ title: "PAR Category Created", description: "The PAR category has been created successfully." });
      setShowDialog(false);
      form.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to create PAR category.", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ParCategoryFormData & { id: number }) => 
      apiRequest("PATCH", `/api/par-categories/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/par-categories"] });
      toast({ title: "PAR Category Updated", description: "The PAR category has been updated successfully." });
      setShowDialog(false);
      setSelectedCategory(null);
      setIsEditMode(false);
      form.reset();
    },
    onError: () => toast({ title: "Error", description: "Failed to update PAR category.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/par-categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/par-categories"] });
      toast({ title: "PAR Category Deleted", description: "The PAR category has been deleted successfully." });
      setShowDeleteDialog(false);
      setDeleteId(null);
    },
    onError: () => toast({ title: "Error", description: "Failed to delete PAR category.", variant: "destructive" }),
  });

  const handleOpenCreateDialog = () => {
    setIsEditMode(false);
    setSelectedCategory(null);
    form.reset({
      startDay: 0,
      endDay: 30,
      category: "",
      provisionPercent: "0.00",
    });
    setShowDialog(true);
  };

  const handleOpenEditDialog = (category: ParCategory) => {
    setIsEditMode(true);
    setSelectedCategory(category);
    form.reset({
      startDay: category.startDay,
      endDay: category.endDay,
      category: category.category,
      provisionPercent: category.provisionPercent,
    });
    setShowDialog(true);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleSubmit = (data: ParCategoryFormData) => {
    if (isEditMode && selectedCategory) {
      updateMutation.mutate({ ...data, id: selectedCategory.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const formatDayRange = (startDay: number, endDay: number) => {
    if (endDay >= 999) {
      return `${startDay}+ days`;
    }
    return `${startDay} - ${endDay} days`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            PAR Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage Portfolio at Risk categories and provision percentages
          </p>
        </div>
        <Button type="button" onClick={handleOpenCreateDialog} data-testid="button-add-par-category">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PAR Category Configuration</CardTitle>
          <CardDescription>
            Define aging buckets for financing portfolio risk analysis and required provision percentages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Day Range</TableHead>
                  <TableHead>Start Day</TableHead>
                  <TableHead>End Day</TableHead>
                  <TableHead className="text-right">Provision %</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} data-testid={`row-par-category-${category.id}`}>
                    <TableCell className="font-medium">{category.category}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDayRange(category.startDay, category.endDay)}
                    </TableCell>
                    <TableCell>{category.startDay}</TableCell>
                    <TableCell>{category.endDay >= 999 ? "∞" : category.endDay}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 font-medium text-amber-600">
                        <Percent className="h-3 w-3" />
                        {category.provisionPercent}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => handleOpenEditDialog(category)}
                          data-testid={`button-edit-par-category-${category.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => handleOpenDeleteDialog(category.id)}
                          data-testid={`button-delete-par-category-${category.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No PAR Categories</h3>
              <p className="text-muted-foreground mb-4">
                Create your first PAR category to define risk aging buckets
              </p>
              <Button type="button" onClick={handleOpenCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit PAR Category" : "Add PAR Category"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the PAR category details"
                : "Create a new PAR category for risk classification"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Current, PAR 1-30, PAR 31-60"
                        data-testid="input-category-name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this aging bucket
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Day</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          data-testid="input-start-day"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Day</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="30"
                          data-testid="input-end-day"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Use 999 for unlimited
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="provisionPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provision Percentage</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="5.00"
                          data-testid="input-provision-percent"
                          {...field}
                        />
                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Required provision percentage for this category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : isEditMode
                    ? "Update"
                    : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete PAR Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this PAR category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
