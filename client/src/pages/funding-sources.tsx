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
import { Switch } from "@/components/ui/switch";
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
  Search,
  Plus,
  Edit,
  Wallet,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { FundingSource } from "@shared/schema";

const fundingSourceFormSchema = z.object({
  name: z.string().min(1, "Funding source name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FundingSourceFormData = z.infer<typeof fundingSourceFormSchema>;

export default function FundingSourcesPage() {
  const [search, setSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState<FundingSource | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FundingSourceFormData>({
    resolver: zodResolver(fundingSourceFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      isActive: true,
    },
  });

  const { data: fundingSources, isLoading } = useQuery<FundingSource[]>({
    queryKey: ["/api/funding-sources", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const url = params.toString() ? `/api/funding-sources?${params.toString()}` : "/api/funding-sources";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch funding sources");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FundingSourceFormData) => {
      return apiRequest("POST", "/api/funding-sources", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funding-sources"] });
      toast({
        title: "Funding Source Created",
        description: "The funding source has been created successfully.",
      });
      setShowDialog(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create funding source. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FundingSourceFormData }) => {
      return apiRequest("PATCH", `/api/funding-sources/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funding-sources"] });
      toast({
        title: "Funding Source Updated",
        description: "The funding source has been updated successfully.",
      });
      setShowDialog(false);
      setSelectedSource(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update funding source. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (source?: FundingSource) => {
    if (source) {
      setSelectedSource(source);
      form.reset({
        name: source.name,
        code: source.code || "",
        description: source.description || "",
        isActive: source.isActive ?? true,
      });
    } else {
      setSelectedSource(null);
      form.reset();
    }
    setShowDialog(true);
  };

  const onSubmit = (data: FundingSourceFormData) => {
    if (selectedSource) {
      updateMutation.mutate({ id: selectedSource.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Funding Sources</h1>
            <p className="text-muted-foreground text-sm">
              Manage loan funding sources
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-funding-source">
          <Plus className="mr-2 h-4 w-4" />
          Add Funding Source
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search funding sources..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-funding-sources"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : fundingSources && fundingSources.length > 0 ? (
                  fundingSources.map((source) => (
                    <TableRow key={source.id} className="hover:bg-muted/30" data-testid={`row-funding-source-${source.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white text-xs font-semibold">
                            {source.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span>{source.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {source.code ? (
                          <Badge variant="outline">{source.code}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {source.description || "-"}
                      </TableCell>
                      <TableCell>
                        {source.isActive ? (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(source)}
                          data-testid={`button-edit-funding-source-${source.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No funding sources found
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
              {selectedSource ? "Edit Funding Source" : "Add Funding Source"}
            </DialogTitle>
            <DialogDescription>
              {selectedSource
                ? "Update the funding source details below."
                : "Fill in the details to create a new funding source."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Shareholder" {...field} data-testid="input-funding-source-name" />
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
                      <Input placeholder="e.g., SH" {...field} data-testid="input-funding-source-code" />
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
                      <Textarea placeholder="Description of the funding source..." {...field} data-testid="input-funding-source-description" />
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
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable this funding source
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-funding-source-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-funding-source"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : selectedSource
                    ? "Save Changes"
                    : "Create Funding Source"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
