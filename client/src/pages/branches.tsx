import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  Plus,
  Edit,
  Building2,
  MapPin,
} from "lucide-react";
import type { Branch } from "@shared/schema";

const branchFormSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  shortName: z.string().optional(),
  code: z.string().optional(),
  accountCode: z.string().optional(),
  address: z.string().optional(),
});

type BranchFormData = z.infer<typeof branchFormSchema>;

export default function BranchesPage() {
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: "",
      shortName: "",
      code: "",
      accountCode: "",
      address: "",
    },
  });

  const { data: branches, isLoading } = useQuery<Branch[]>({
    queryKey: ["/api/branches", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const url = params.toString() ? `/api/branches?${params.toString()}` : "/api/branches";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch branches");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: BranchFormData) => {
      return apiRequest("POST", "/api/branches", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/branches"] });
      toast({
        title: "Branch Created",
        description: "The branch has been created successfully.",
      });
      setShowDialog(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create branch. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BranchFormData }) => {
      return apiRequest("PATCH", `/api/branches/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/branches"] });
      toast({
        title: "Branch Updated",
        description: "The branch has been updated successfully.",
      });
      setShowDialog(false);
      setSelectedBranch(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update branch. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (branch?: Branch) => {
    if (branch) {
      setSelectedBranch(branch);
      form.reset({
        name: branch.name,
        shortName: branch.shortName || "",
        code: branch.code || "",
        accountCode: branch.accountCode || "",
        address: branch.address || "",
      });
    } else {
      setSelectedBranch(null);
      form.reset();
    }
    setShowDialog(true);
  };

  const onSubmit = (data: BranchFormData) => {
    if (selectedBranch) {
      updateMutation.mutate({ id: selectedBranch.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-branches-title">Branches</h1>
          <p className="text-muted-foreground">
            Manage branch offices and locations
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-branch">
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search branches..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-branches"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Short Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Code</TableHead>
                  <TableHead>Address</TableHead>
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
                ) : branches && branches.length > 0 ? (
                  branches.map((branch) => (
                    <TableRow key={branch.id} data-testid={`row-branch-${branch.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{branch.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{branch.shortName || "-"}</TableCell>
                      <TableCell className="font-mono">{branch.code || "-"}</TableCell>
                      <TableCell className="font-mono">{branch.accountCode || "-"}</TableCell>
                      <TableCell>
                        {branch.address && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">{branch.address}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(branch)}
                          data-testid={`button-edit-branch-${branch.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No branches found</p>
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
              {selectedBranch ? "Edit Branch" : "Add Branch"}
            </DialogTitle>
            <DialogDescription>
              {selectedBranch 
                ? "Update branch information" 
                : "Create a new branch office"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Branch" {...field} data-testid="input-branch-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shortName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Name</FormLabel>
                      <FormControl>
                        <Input placeholder="MAIN" {...field} data-testid="input-branch-shortname" />
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
                        <Input placeholder="001" {...field} data-testid="input-branch-code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="accountCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Code (Disbursement)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 10206" {...field} data-testid="input-branch-account-code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street, City" {...field} data-testid="input-branch-address" />
                    </FormControl>
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
                  data-testid="button-save-branch"
                >
                  {createMutation.isPending || updateMutation.isPending 
                    ? "Saving..." 
                    : selectedBranch ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
