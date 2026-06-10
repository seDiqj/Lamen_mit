import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBranch } from "@/contexts/branch-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Banknote,
  AlertTriangle,
  Clock,
  HourglassIcon,
  Send,
  Loader2,
} from "lucide-react";

type CollectionInstallment = {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  principleAmount: string;
  marginAmount: string;
  totalAmount: string;
  paidAmount: string;
  installmentVariance: string | null;
  paymentDate: string | null;
  lateDays: number | null;
  isPaid: boolean;
  loanApplicationId: string;
  productName: string | null;
  customerName: string;
  customerPhone: string | null;
  customerAddress: string | null;
  branchName: string;
  financeOfficerName: string | null;
};

type FinanceOfficer = {
  id: string;
  name: string;
};

type CollectionSummary = {
  totalDue: string;
  totalCollected: string;
  totalRemaining: string;
  overdueCount: number;
  upcomingCount: number;
  partialCount: number;
};

type Branch = {
  id: string;
  name: string;
};

function getDaysStatus(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) {
    return { label: `${Math.abs(diff)} days overdue`, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", isOverdue: true, days: Math.abs(diff) };
  } else if (diff === 0) {
    return { label: "Due today", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", isOverdue: false, days: 0 };
  } else if (diff === 1) {
    return { label: "Due in 1 day", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", isOverdue: false, days: diff };
  } else if (diff <= 3) {
    return { label: `Due in ${diff} days`, color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", isOverdue: false, days: diff };
  } else {
    return { label: `Due in ${diff} days`, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", isOverdue: false, days: diff };
  }
}

export default function CollectionEntryPage() {
  const { selectedBranchId } = useBranch();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all_unpaid");
  const [branch, setBranch] = useState("all");
  const [officer, setOfficer] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [submitDialog, setSubmitDialog] = useState<CollectionInstallment | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedBranchId) {
      setBranch(selectedBranchId);
    } else {
      setBranch("all");
    }
  }, [selectedBranchId]);

  const { data, isLoading } = useQuery<{
    installments: CollectionInstallment[];
    total: number;
    page: number;
    totalPages: number;
    summary: CollectionSummary;
  }>({
    queryKey: ["/api/collections", filter, branch, officer, search, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("filter", filter);
      if (branch !== "all") params.set("branch", branch);
      if (officer !== "all") params.set("officer", officer);
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const res = await fetch(`/api/collections?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch collections");
      return res.json();
    },
  });

  const { data: branchesData } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  const { data: officersData } = useQuery<FinanceOfficer[]>({
    queryKey: ["/api/finance-officers/active"],
  });

  const { data: pendingRecords = [] } = useQuery<any[]>({
    queryKey: ["/api/collection-records", "pending"],
    queryFn: async () => {
      const res = await fetch("/api/collection-records?status=pending", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const pendingInstallmentIds = new Set(pendingRecords.map((r: any) => r.installment_id));

  const submitMutation = useMutation({
    mutationFn: async (payload: { installmentId: string; amount: number; paymentDate: string; notes?: string }) => {
      const res = await apiRequest("POST", "/api/collection-records", payload);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Submitted for approval", description: "The collection was submitted and is now pending approval." });
      queryClient.invalidateQueries({ queryKey: ["/api/collection-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      setSubmitDialog(null);
      setAmount("");
      setNotes("");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to submit collection", variant: "destructive" });
    },
  });

  const openSubmitDialog = (inst: CollectionInstallment) => {
    const remaining = parseFloat(inst.totalAmount) - parseFloat(inst.paidAmount || "0");
    setAmount(remaining > 0 ? remaining.toFixed(2) : "");
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setNotes("");
    setSubmitDialog(inst);
  };

  const confirmSubmit = () => {
    if (!submitDialog || !amount || !paymentDate) return;
    const amt = parseFloat(amount);
    if (amt <= 0) {
      toast({ title: "Invalid amount", description: "Amount must be greater than 0", variant: "destructive" });
      return;
    }
    submitMutation.mutate({ installmentId: submitDialog.id, amount: amt, paymentDate, notes: notes || undefined });
  };

  const summary = data?.summary;
  const installments = data?.installments || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-lime-500/10 rounded-lg">
          <Banknote className="h-6 w-6 text-lime-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Collection Entry</h1>
          <p className="text-sm text-muted-foreground">Enter collections from desktop. Submitted collections go to Collection Approvals for review.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold" data-testid="text-overdue-count">{summary?.overdueCount || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Upcoming (3 days)</p>
                <p className="text-2xl font-bold" data-testid="text-upcoming-count">{summary?.upcomingCount || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold" data-testid="text-pending-count">{pendingRecords.length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
                <HourglassIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Total Remaining</p>
                <p className="text-xl font-bold" data-testid="text-total-remaining">{formatCurrency(summary?.totalRemaining || "0")}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Banknote className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customer or financing ID..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8"
                data-testid="input-search"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[150px]" data-testid="select-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_unpaid">Unpaid</SelectItem>
                  <SelectItem value="due_soon">Due Soon</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
              <Select value={officer} onValueChange={(v) => { setOfficer(v); setPage(1); }}>
                <SelectTrigger className="w-[170px]" data-testid="select-officer">
                  <SelectValue placeholder="All Officers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Officers</SelectItem>
                  {(officersData || []).map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : installments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Banknote className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No collections found</p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Financing ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Officer</TableHead>
                    <TableHead className="text-center">Inst #</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installments.map((inst) => {
                    const status = getDaysStatus(inst.dueDate);
                    const remaining = parseFloat(inst.totalAmount || "0") - parseFloat(inst.paidAmount || "0");
                    const hasPending = pendingInstallmentIds.has(inst.id);
                    return (
                      <TableRow key={inst.id} data-testid={`row-installment-${inst.id}`}>
                        <TableCell className="font-mono text-sm">{inst.loanApplicationId}</TableCell>
                        <TableCell className="font-medium">{inst.customerName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{inst.financeOfficerName || "—"}</TableCell>
                        <TableCell className="text-center">{inst.installmentNumber}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{formatDate(inst.dueDate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(inst.totalAmount)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(remaining)}</TableCell>
                        <TableCell>
                          {inst.isPaid ? (
                            <Badge variant="default" className="bg-green-600">Paid</Badge>
                          ) : (
                            <Badge variant="outline" className={status.color + " border-0"}>{status.label}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {inst.isPaid ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : hasPending ? (
                            <Badge variant="outline" className="text-amber-600 border-amber-300">
                              <HourglassIcon className="h-3 w-3 mr-1" /> Pending
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-lime-600 hover:bg-lime-700 text-white"
                              onClick={() => openSubmitDialog(inst)}
                              data-testid={`button-submit-${inst.id}`}
                            >
                              <Send className="h-3 w-3 mr-1" /> Enter
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  data-testid="button-next-page"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!submitDialog} onOpenChange={(open) => { if (!open) setSubmitDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Collection</DialogTitle>
            <DialogDescription>This collection will be submitted for approval before it is posted to the books.</DialogDescription>
          </DialogHeader>
          {submitDialog && (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                <p><span className="text-muted-foreground">Customer:</span> {submitDialog.customerName}</p>
                <p><span className="text-muted-foreground">Financing ID:</span> {submitDialog.loanApplicationId}</p>
                <p><span className="text-muted-foreground">Installment:</span> #{submitDialog.installmentNumber}</p>
                <p><span className="text-muted-foreground">Remaining:</span> {formatCurrency(parseFloat(submitDialog.totalAmount) - parseFloat(submitDialog.paidAmount || "0"))} AFN</p>
              </div>
              <div className="space-y-2">
                <Label>Amount (AFN)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  data-testid="input-amount"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  data-testid="input-payment-date"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes for the approver..."
                  rows={2}
                  data-testid="input-notes"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialog(null)}>Cancel</Button>
            <Button
              className="bg-lime-600 hover:bg-lime-700 text-white"
              onClick={confirmSubmit}
              disabled={submitMutation.isPending}
              data-testid="button-confirm-submit"
            >
              {submitMutation.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
