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
import type { Holiday } from "@shared/schema";

export default function Holidays() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [holidayToDelete, setHolidayToDelete] = useState<string | null>(null);
  
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    year: currentYear,
    isRecurring: false,
    description: "",
  });

  const { data: holidays, isLoading } = useQuery<Holiday[]>({
    queryKey: ["/api/hr/holidays"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/hr/holidays", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Holiday created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/holidays"] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create holiday", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: string }) => {
      const res = await apiRequest("PATCH", `/api/hr/holidays/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Holiday updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/holidays"] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update holiday", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/hr/holidays/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Holiday deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/hr/holidays"] });
      setDeleteDialogOpen(false);
      setHolidayToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete holiday", description: error.message, variant: "destructive" });
    },
  });

  const openCreateDialog = () => {
    setEditingHoliday(null);
    setFormData({ name: "", date: "", year: currentYear, isRecurring: false, description: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (h: Holiday) => {
    setEditingHoliday(h);
    setFormData({
      name: h.name || "",
      date: h.date || "",
      year: h.year || currentYear,
      isRecurring: h.isRecurring ?? false,
      description: h.description || "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingHoliday(null);
    setFormData({ name: "", date: "", year: currentYear, isRecurring: false, description: "" });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.date) {
      toast({ title: "Name and date are required", variant: "destructive" });
      return;
    }
    
    if (editingHoliday) {
      updateMutation.mutate({ ...formData, id: editingHoliday.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    setHolidayToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (holidayToDelete) {
      deleteMutation.mutate(holidayToDelete);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <CalendarDays className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Holidays</h1>
            <p className="text-muted-foreground text-sm">Manage public holidays and office closures</p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="gap-2" data-testid="button-add-holiday">
          <Plus className="h-4 w-4" /> Add Holiday
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Holiday Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading holidays...</div>
          ) : holidays && holidays.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Recurring</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holidays.map((h) => (
                  <TableRow key={h.id} data-testid={`row-holiday-${h.id}`}>
                    <TableCell className="font-medium">{h.name}</TableCell>
                    <TableCell>{formatDate(h.date)}</TableCell>
                    <TableCell>{h.year}</TableCell>
                    <TableCell>
                      <Badge variant={h.isRecurring ? "default" : "secondary"}>
                        {h.isRecurring ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{h.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(h)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(h.id)}
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
              No holidays found. Click 'Add Holiday' to create one.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHoliday ? "Edit Holiday" : "Add Holiday"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name *</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Independence Day"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date *</Label>
                <Input 
                  type="date"
                  value={formData.date} 
                  onChange={(e) => {
                    const date = e.target.value;
                    const year = date ? new Date(date).getFullYear() : currentYear;
                    setFormData({ ...formData, date, year });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label>Year</Label>
                <Input 
                  type="number"
                  value={formData.year} 
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || currentYear })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Recurring (Every Year)</Label>
              <Switch 
                checked={formData.isRecurring}
                onCheckedChange={(v) => setFormData({ ...formData, isRecurring: v })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Holiday description"
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
            <AlertDialogTitle>Delete Holiday</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this holiday? This action cannot be undone.
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
