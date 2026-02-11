import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Target } from "lucide-react";
import type { Branch } from "@shared/schema";

interface DisbursementTarget {
  id: number;
  branchId: string | null;
  branchName: string | null;
  targetMonthYear: string;
  targetDisbursementAmount: string;
  targetNoOfCustomer: number;
  createdAt: string | null;
}

export default function DisbursementTargetsPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [branchId, setBranchId] = useState("");
  const [targetMonthYear, setTargetMonthYear] = useState("");
  const [targetDisbursementAmount, setTargetDisbursementAmount] = useState("");
  const [targetNoOfCustomer, setTargetNoOfCustomer] = useState("");

  const { toast } = useToast();

  const { data: targets, isLoading } = useQuery<DisbursementTarget[]>({
    queryKey: ["/api/disbursement-targets"],
    queryFn: async () => {
      const res = await fetch("/api/disbursement-targets", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch disbursement targets");
      return res.json();
    },
  });

  const { data: branches } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
    queryFn: async () => {
      const res = await fetch("/api/branches", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch branches");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { branchId: string; targetMonthYear: string; targetDisbursementAmount: string; targetNoOfCustomer: number }) =>
      apiRequest("POST", "/api/disbursement-targets", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disbursement-targets"] });
      toast({ title: "Target Created", description: "The disbursement target has been created successfully." });
      setShowDialog(false);
      resetForm();
    },
    onError: () => toast({ title: "Error", description: "Failed to create disbursement target.", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; branchId: string; targetMonthYear: string; targetDisbursementAmount: string; targetNoOfCustomer: number }) =>
      apiRequest("PATCH", `/api/disbursement-targets/${data.id}`, {
        branchId: data.branchId,
        targetMonthYear: data.targetMonthYear,
        targetDisbursementAmount: data.targetDisbursementAmount,
        targetNoOfCustomer: data.targetNoOfCustomer,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disbursement-targets"] });
      toast({ title: "Target Updated", description: "The disbursement target has been updated successfully." });
      setShowDialog(false);
      setIsEditMode(false);
      setEditId(null);
      resetForm();
    },
    onError: () => toast({ title: "Error", description: "Failed to update disbursement target.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/disbursement-targets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disbursement-targets"] });
      toast({ title: "Target Deleted", description: "The disbursement target has been deleted successfully." });
      setShowDeleteDialog(false);
      setDeleteId(null);
    },
    onError: () => toast({ title: "Error", description: "Failed to delete disbursement target.", variant: "destructive" }),
  });

  const resetForm = () => {
    setBranchId("");
    setTargetMonthYear("");
    setTargetDisbursementAmount("");
    setTargetNoOfCustomer("");
  };

  const handleOpenCreateDialog = () => {
    setIsEditMode(false);
    setEditId(null);
    resetForm();
    setShowDialog(true);
  };

  const handleOpenEditDialog = (target: DisbursementTarget) => {
    setIsEditMode(true);
    setEditId(target.id);
    setBranchId(target.branchId || "");
    setTargetMonthYear(target.targetMonthYear);
    setTargetDisbursementAmount(target.targetDisbursementAmount);
    setTargetNoOfCustomer(String(target.targetNoOfCustomer));
    setShowDialog(true);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleSubmit = () => {
    if (!branchId || !targetMonthYear || !targetDisbursementAmount || !targetNoOfCustomer) {
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
      return;
    }

    const payload = {
      branchId,
      targetMonthYear,
      targetDisbursementAmount,
      targetNoOfCustomer: Number(targetNoOfCustomer),
    };

    if (isEditMode && editId) {
      updateMutation.mutate({ ...payload, id: editId });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const formatAmount = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `AFN ${num.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2" data-testid="text-page-title">
            <Target className="h-8 w-8 text-primary" />
            Disbursement Targets
          </h1>
          <p className="text-muted-foreground mt-1" data-testid="text-page-description">
            Set monthly disbursement targets for each branch
          </p>
        </div>
        <Button type="button" onClick={handleOpenCreateDialog} data-testid="button-add-target">
          <Plus className="h-4 w-4 mr-2" />
          Add Target
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disbursement Target Configuration</CardTitle>
          <CardDescription>
            Define monthly disbursement targets and customer goals for each branch
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : targets && targets.length > 0 ? (
            <Table data-testid="table-disbursement-targets">
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Target Month/Year</TableHead>
                  <TableHead className="text-right">Target Disbursement Amount</TableHead>
                  <TableHead className="text-right">Target No. of Customers</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {targets.map((target) => (
                  <TableRow key={target.id} data-testid={`row-disbursement-target-${target.id}`}>
                    <TableCell className="font-medium" data-testid={`text-branch-${target.id}`}>
                      {target.branchName || "N/A"}
                    </TableCell>
                    <TableCell data-testid={`text-month-year-${target.id}`}>
                      {target.targetMonthYear}
                    </TableCell>
                    <TableCell className="text-right" data-testid={`text-amount-${target.id}`}>
                      {formatAmount(target.targetDisbursementAmount)}
                    </TableCell>
                    <TableCell className="text-right" data-testid={`text-customers-${target.id}`}>
                      {target.targetNoOfCustomer.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => handleOpenEditDialog(target)}
                          data-testid={`button-edit-target-${target.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => handleOpenDeleteDialog(target.id)}
                          data-testid={`button-delete-target-${target.id}`}
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
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2" data-testid="text-empty-state">No Disbursement Targets</h3>
              <p className="text-muted-foreground mb-4">
                Create your first disbursement target to set branch goals
              </p>
              <Button type="button" onClick={handleOpenCreateDialog} data-testid="button-add-target-empty">
                <Plus className="h-4 w-4 mr-2" />
                Add Target
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle data-testid="text-dialog-title">
              {isEditMode ? "Edit Disbursement Target" : "Add Disbursement Target"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger data-testid="select-branch">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches?.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id} data-testid={`option-branch-${branch.id}`}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetMonthYear">Target Month/Year</Label>
              <Input
                id="targetMonthYear"
                type="month"
                value={targetMonthYear}
                onChange={(e) => setTargetMonthYear(e.target.value)}
                data-testid="input-target-month-year"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDisbursementAmount">Target Disbursement Amount</Label>
              <Input
                id="targetDisbursementAmount"
                type="number"
                placeholder="0"
                value={targetDisbursementAmount}
                onChange={(e) => setTargetDisbursementAmount(e.target.value)}
                data-testid="input-target-disbursement-amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetNoOfCustomer">Target No. of Customers</Label>
              <Input
                id="targetNoOfCustomer"
                type="number"
                placeholder="0"
                value={targetNoOfCustomer}
                onChange={(e) => setTargetNoOfCustomer(e.target.value)}
                data-testid="input-target-no-of-customers"
              />
            </div>
          </div>
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
              type="button"
              onClick={handleSubmit}
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
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Disbursement Target</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this disbursement target? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
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
