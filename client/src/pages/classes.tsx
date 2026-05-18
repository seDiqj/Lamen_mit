import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import type { Class } from "@shared/schema";

const classFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ClassFormData = z.infer<typeof classFormSchema>;

export default function ClassesPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const { toast } = useToast();

  const { data: items, isLoading } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
  });

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classFormSchema),
    defaultValues: { name: "", code: "", description: "", isActive: true },
  });

  const openCreate = () => {
    setSelectedClass(null);
    form.reset({ name: "", code: "", description: "", isActive: true });
    setShowDialog(true);
  };

  const openEdit = (c: Class) => {
    setSelectedClass(c);
    form.reset({
      name: c.name,
      code: c.code || "",
      description: c.description || "",
      isActive: c.isActive ?? true,
    });
    setShowDialog(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: ClassFormData) => apiRequest("POST", "/api/classes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      toast({ title: "Success", description: "Class created" });
      setShowDialog(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message || "Failed to create", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ClassFormData) => apiRequest("PATCH", `/api/classes/${selectedClass!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      toast({ title: "Success", description: "Class updated" });
      setShowDialog(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message || "Failed to update", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/classes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      toast({ title: "Success", description: "Class deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message || "Failed to delete", variant: "destructive" }),
  });

  const onSubmit = (data: ClassFormData) => {
    if (selectedClass) updateMutation.mutate(data);
    else createMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tag className="h-7 w-7 text-purple-500" />
            Classes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tag expense journal lines by class (cost center, branch, project, etc.)
          </p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-class">
          <Plus className="h-4 w-4 mr-2" /> Add Class
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!items || items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No classes yet. Click "Add Class" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((c) => (
                    <TableRow key={c.id} data-testid={`row-class-${c.id}`}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.code || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.description || "—"}</TableCell>
                      <TableCell>
                        {c.isActive ? (
                          <Badge variant="secondary">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)} data-testid={`button-edit-class-${c.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(`Delete class "${c.name}"?`)) deleteMutation.mutate(c.id);
                          }}
                          data-testid={`button-delete-class-${c.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClass ? "Edit Class" : "Add Class"}</DialogTitle>
            <DialogDescription>
              Classes appear in the journal entry dialog for expense lines and as a filter in the Income Statement.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Kabul Branch, Marketing, Project X" {...field} data-testid="input-class-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional short code" {...field} data-testid="input-class-code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Optional description" {...field} data-testid="input-class-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel>Active</FormLabel>
                      <p className="text-xs text-muted-foreground">Inactive classes still keep existing tags but won't appear in pickers.</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-class-active" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} data-testid="button-cancel-class">Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-class">
                  {selectedClass ? "Save Changes" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
