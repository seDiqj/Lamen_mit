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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Briefcase, Plus, Edit, Trash2 } from "lucide-react";
import type { Position, Department } from "@shared/schema";

export default function Positions() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [positionToDelete, setPositionToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    departmentId: "",
    grade: "",
    description: "",
  });

  const { data: positions, isLoading } = useQuery<(Position & { department?: Department })[]>({
    queryKey: ["/api/hr/positions"],
  });

  const { data: departments } = useQuery<Department[]>({
    queryKey: ["/api/hr/departments"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/hr/positions", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Position created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/positions"] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create position", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: string }) => {
      const res = await apiRequest("PATCH", `/api/hr/positions/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Position updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/positions"] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update position", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/hr/positions/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Position deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/positions"] });
      setDeleteDialogOpen(false);
      setPositionToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete position", description: error.message, variant: "destructive" });
    },
  });

  const openCreateDialog = () => {
    setEditingPosition(null);
    setFormData({ title: "", code: "", departmentId: "", grade: "", description: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (pos: Position) => {
    setEditingPosition(pos);
    setFormData({
      title: pos.title || "",
      code: pos.code || "",
      departmentId: pos.departmentId || "",
      grade: pos.grade || "",
      description: pos.description || "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingPosition(null);
    setFormData({ title: "", code: "", departmentId: "", grade: "", description: "" });
  };

  const handleSubmit = () => {
    if (!formData.title) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    
    if (editingPosition) {
      updateMutation.mutate({ ...formData, id: editingPosition.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    setPositionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (positionToDelete) {
      deleteMutation.mutate(positionToDelete);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Briefcase className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Positions</h1>
            <p className="text-muted-foreground text-sm">Manage job positions and titles</p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="gap-2" data-testid="button-add-position">
          <Plus className="h-4 w-4" /> Add Position
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading positions...</div>
          ) : positions && positions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((pos) => (
                  <TableRow key={pos.id} data-testid={`row-position-${pos.id}`}>
                    <TableCell className="font-medium">{pos.title}</TableCell>
                    <TableCell>{pos.code || "-"}</TableCell>
                    <TableCell>{pos.department?.name || "-"}</TableCell>
                    <TableCell>{pos.grade || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={pos.isActive ? "default" : "secondary"}>
                        {pos.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(pos)}
                          data-testid={`button-edit-${pos.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(pos.id)}
                          data-testid={`button-delete-${pos.id}`}
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
              No positions found. Click 'Add Position' to create one.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPosition ? "Edit Position" : "Add Position"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Title *</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Position title"
                data-testid="input-position-title"
              />
            </div>
            <div className="grid gap-2">
              <Label>Code</Label>
              <Input 
                value={formData.code} 
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Position code"
                data-testid="input-position-code"
              />
            </div>
            <div className="grid gap-2">
              <Label>Department</Label>
              <Select 
                value={formData.departmentId} 
                onValueChange={(v) => setFormData({ ...formData, departmentId: v })}
              >
                <SelectTrigger data-testid="select-position-department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Grade</Label>
              <Input 
                value={formData.grade} 
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="Position grade (e.g., Senior, Junior)"
                data-testid="input-position-grade"
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Position description"
                data-testid="input-position-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-submit-position"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Position</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this position? This action cannot be undone.
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
