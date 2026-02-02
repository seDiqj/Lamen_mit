import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  Plus,
  Edit,
  UserCheck,
  Building2,
  UserX,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FinanceOfficer, Branch } from "@shared/schema";

type OfficerWithBranch = FinanceOfficer & {
  branchName?: string;
};

const officerFormSchema = z.object({
  name: z.string().min(1, "Officer name is required"),
  code: z.string().optional(),
  branchId: z.string().optional(),
});

type OfficerFormData = z.infer<typeof officerFormSchema>;

export default function OfficersPage() {
  const [search, setSearch] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState<OfficerWithBranch | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [officerToToggle, setOfficerToToggle] = useState<OfficerWithBranch | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<OfficerFormData>({
    resolver: zodResolver(officerFormSchema),
    defaultValues: {
      name: "",
      code: "",
      branchId: "",
    },
  });

  const { data: officers, isLoading } = useQuery<OfficerWithBranch[]>({
    queryKey: ["/api/officers", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const url = params.toString() ? `/api/officers?${params.toString()}` : "/api/officers";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch officers");
      return res.json();
    },
  });

  const { data: branches } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: OfficerFormData) => {
      return apiRequest("POST", "/api/officers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/officers"] });
      toast({
        title: "Officer Created",
        description: "The finance officer has been created successfully.",
      });
      setShowDialog(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create officer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: OfficerFormData }) => {
      return apiRequest("PATCH", `/api/officers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/officers"] });
      toast({
        title: "Officer Updated",
        description: "The finance officer has been updated successfully.",
      });
      setShowDialog(false);
      setSelectedOfficer(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update officer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/officers/${id}/toggle-status`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/officers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/finance-officers/active"] });
      const newStatus = officerToToggle?.isActive !== false ? "deactivated" : "activated";
      toast({
        title: "Status Changed",
        description: `Officer has been ${newStatus}.`,
      });
      setShowConfirmDialog(false);
      setOfficerToToggle(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to change officer status.",
        variant: "destructive",
      });
      setShowConfirmDialog(false);
      setOfficerToToggle(null);
    },
  });

  const handleToggleStatus = (officer: OfficerWithBranch) => {
    setOfficerToToggle(officer);
    setShowConfirmDialog(true);
  };

  const confirmToggleStatus = () => {
    if (officerToToggle) {
      toggleStatusMutation.mutate(officerToToggle.id);
    }
  };

  const handleOpenDialog = (officer?: OfficerWithBranch) => {
    if (officer) {
      setSelectedOfficer(officer);
      form.reset({
        name: officer.name,
        code: officer.code || "",
        branchId: officer.branchId || "",
      });
    } else {
      setSelectedOfficer(null);
      form.reset();
    }
    setShowDialog(true);
  };

  const onSubmit = (data: OfficerFormData) => {
    if (selectedOfficer) {
      updateMutation.mutate({ id: selectedOfficer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-officers-title">Finance Officers</h1>
          <p className="text-muted-foreground">
            Manage finance officers and their assignments
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-officer">
          <Plus className="mr-2 h-4 w-4" />
          Add Officer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search officers..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-officers"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Officer</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : officers && officers.length > 0 ? (
                  officers.map((officer) => (
                    <TableRow key={officer.id} data-testid={`row-officer-${officer.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {getInitials(officer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{officer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{officer.code || "-"}</TableCell>
                      <TableCell>
                        {officer.branchName && (
                          <div className="flex items-center gap-1 text-sm">
                            <Building2 className="h-3 w-3" />
                            {officer.branchName}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={officer.isActive !== false 
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" 
                            : "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30"
                          }
                          data-testid={`badge-status-${officer.id}`}
                        >
                          {officer.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {officer.createdAt 
                          ? (() => {
                              const d = new Date(officer.createdAt);
                              const day = d.getDate().toString().padStart(2, "0");
                              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                              return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
                            })()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(officer)}
                            data-testid={`button-edit-officer-${officer.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(officer)}
                            data-testid={`button-toggle-officer-${officer.id}`}
                            title={officer.isActive !== false ? "Deactivate" : "Activate"}
                          >
                            {officer.isActive !== false ? (
                              <UserX className="h-4 w-4 text-red-500" />
                            ) : (
                              <UserPlus className="h-4 w-4 text-emerald-500" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <UserCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No finance officers found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedOfficer ? "Edit Officer" : "Add Officer"}
            </DialogTitle>
            <DialogDescription>
              {selectedOfficer 
                ? "Update finance officer information" 
                : "Add a new finance officer"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} data-testid="input-officer-name" />
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
                    <FormLabel>Officer Code</FormLabel>
                    <FormControl>
                      <Input placeholder="FO001" {...field} data-testid="input-officer-code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-officer-branch">
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches?.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-officer"
                >
                  {createMutation.isPending || updateMutation.isPending 
                    ? "Saving..." 
                    : selectedOfficer ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {officerToToggle?.isActive !== false ? "Deactivate Officer" : "Activate Officer"}
            </DialogTitle>
            <DialogDescription>
              {officerToToggle?.isActive !== false 
                ? `Are you sure you want to deactivate "${officerToToggle?.name}"? This officer will no longer appear in loan applications.`
                : `Are you sure you want to activate "${officerToToggle?.name}"? This officer will be available for loan applications.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setShowConfirmDialog(false);
                setOfficerToToggle(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmToggleStatus}
              disabled={toggleStatusMutation.isPending}
              variant={officerToToggle?.isActive !== false ? "destructive" : "default"}
              data-testid="button-confirm-toggle"
            >
              {toggleStatusMutation.isPending 
                ? "Processing..." 
                : officerToToggle?.isActive !== false ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
