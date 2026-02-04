import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Building2, Plus, Edit, Trash2 } from "lucide-react";
import type { Department } from "@shared/schema";

export default function Departments() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const { data: departments, isLoading } = useQuery<Department[]>({
    queryKey: ["/api/hr/departments"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/hr/departments", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Department created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/departments"] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create department", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: string }) => {
      const res = await apiRequest("PATCH", `/api/hr/departments/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Department updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/departments"] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update department", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/hr/departments/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Department deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/departments"] });
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete department", description: error.message, variant: "destructive" });
    },
  });

  const openCreateDialog = () => {
    setEditingDepartment(null);
    setFormData({ name: "", code: "", description: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (dept: Department) => {
    setEditingDepartment(dept);
    setFormData({
      name: dept.name || "",
      code: dept.code || "",
      description: dept.description || "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingDepartment(null);
    setFormData({ name: "", code: "", description: "" });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    
    if (editingDepartment) {
      updateMutation.mutate({ ...formData, id: editingDepartment.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    setDepartmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      deleteMutation.mutate(departmentToDelete);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-lg">
            <Building2 className="h-6 w-6 text-violet-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Departments</h1>
            <p className="text-muted-foreground text-sm">Manage organizational departments</p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="gap-2" data-testid="button-add-department">
          <Plus className="h-4 w-4" /> Add Department
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading departments...</div>
          ) : departments && departments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id} data-testid={`row-department-${dept.id}`}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.code || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{dept.description || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={dept.isActive ? "default" : "secondary"}>
                        {dept.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(dept)}
                          data-testid={`button-edit-${dept.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(dept.id)}
                          data-testid={`button-delete-${dept.id}`}
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
              No departments found. Click 'Add Department' to create one.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDepartment ? "Edit Department" : "Add Department"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name *</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Department name"
                data-testid="input-department-name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Code</Label>
              <Input 
                value={formData.code} 
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Department code (e.g., HR, FIN)"
                data-testid="input-department-code"
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Department description"
                data-testid="input-department-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-submit-department"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this department? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
