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
import { Switch } from "@/components/ui/switch";
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
import { CalendarDays, Plus, Edit, Trash2 } from "lucide-react";
import type { LeaveType } from "@shared/schema";

export default function LeaveTypes() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);
  const [leaveTypeToDelete, setLeaveTypeToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    daysPerYear: 0,
    isPaid: true,
    carryForward: false,
    maxCarryForwardDays: 0,
    description: "",
  });

  const { data: leaveTypes, isLoading } = useQuery<LeaveType[]>({
    queryKey: ["/api/hr/leave-types"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/hr/leave-types", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Leave type created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/leave-types"] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create leave type", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: string }) => {
      const res = await apiRequest("PATCH", `/api/hr/leave-types/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Leave type updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/leave-types"] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update leave type", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/hr/leave-types/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Leave type deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/leave-types"] });
      setDeleteDialogOpen(false);
      setLeaveTypeToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete leave type", description: error.message, variant: "destructive" });
    },
  });

  const openCreateDialog = () => {
    setEditingLeaveType(null);
    setFormData({ name: "", code: "", daysPerYear: 0, isPaid: true, carryForward: false, maxCarryForwardDays: 0, description: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (lt: LeaveType) => {
    setEditingLeaveType(lt);
    setFormData({
      name: lt.name || "",
      code: lt.code || "",
      daysPerYear: lt.daysPerYear || 0,
      isPaid: lt.isPaid ?? true,
      carryForward: lt.carryForward ?? false,
      maxCarryForwardDays: lt.maxCarryForwardDays || 0,
      description: lt.description || "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingLeaveType(null);
    setFormData({ name: "", code: "", daysPerYear: 0, isPaid: true, carryForward: false, maxCarryForwardDays: 0, description: "" });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    
    if (editingLeaveType) {
      updateMutation.mutate({ ...formData, id: editingLeaveType.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    setLeaveTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (leaveTypeToDelete) {
      deleteMutation.mutate(leaveTypeToDelete);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <CalendarDays className="h-6 w-6 text-pink-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Leave Types</h1>
            <p className="text-muted-foreground text-sm">Configure leave policies and types</p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="gap-2" data-testid="button-add-leave-type">
          <Plus className="h-4 w-4" /> Add Leave Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leave Types</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading leave types...</div>
          ) : leaveTypes && leaveTypes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Days/Year</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Carry Forward</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveTypes.map((lt) => (
                  <TableRow key={lt.id} data-testid={`row-leave-type-${lt.id}`}>
                    <TableCell className="font-medium">{lt.name}</TableCell>
                    <TableCell>{lt.code || "-"}</TableCell>
                    <TableCell>{lt.daysPerYear || 0}</TableCell>
                    <TableCell>
                      <Badge variant={lt.isPaid ? "default" : "secondary"}>
                        {lt.isPaid ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lt.carryForward ? `Yes (max ${lt.maxCarryForwardDays} days)` : "No"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={lt.isActive ? "default" : "secondary"}>
                        {lt.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(lt)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(lt.id)}
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
              No leave types found. Click 'Add Leave Type' to create one.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLeaveType ? "Edit Leave Type" : "Add Leave Type"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Name *</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Annual Leave"
                />
              </div>
              <div className="grid gap-2">
                <Label>Code</Label>
                <Input 
                  value={formData.code} 
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., AL"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Days Per Year</Label>
              <Input 
                type="number"
                value={formData.daysPerYear} 
                onChange={(e) => setFormData({ ...formData, daysPerYear: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Paid Leave</Label>
              <Switch 
                checked={formData.isPaid}
                onCheckedChange={(v) => setFormData({ ...formData, isPaid: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Allow Carry Forward</Label>
              <Switch 
                checked={formData.carryForward}
                onCheckedChange={(v) => setFormData({ ...formData, carryForward: v })}
              />
            </div>
            {formData.carryForward && (
              <div className="grid gap-2">
                <Label>Max Carry Forward Days</Label>
                <Input 
                  type="number"
                  value={formData.maxCarryForwardDays} 
                  onChange={(e) => setFormData({ ...formData, maxCarryForwardDays: parseInt(e.target.value) || 0 })}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Leave type description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Leave Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this leave type? This action cannot be undone.
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
