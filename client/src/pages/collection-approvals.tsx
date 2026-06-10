import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Search, CheckCircle, XCircle, Loader2, ClipboardCheck, HourglassIcon, Clock, Undo2 } from "lucide-react";
import { format } from "date-fns";

const formatCurrency = (amount: string | number | undefined) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat("en-AF", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

export default function CollectionApprovalsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectDialog, setRejectDialog] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [reverseDialog, setReverseDialog] = useState<any>(null);
  const [reverseReason, setReverseReason] = useState("");

  const { data: roleData } = useQuery<{ role: string; roleType: string }>({
    queryKey: ["/api/user/role"],
  });
  const canReverse = roleData?.roleType === "admin" || roleData?.role === "ceo" || roleData?.role === "admin";

  const { data: records = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/collection-records", activeTab],
    queryFn: async () => {
      const res = await fetch(`/api/collection-records?status=${activeTab}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { data: pendingCount } = useQuery<{ count: number }>({
    queryKey: ["/api/collection-records/pending-count"],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("PATCH", `/api/collection-records/${id}/approve`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Approved", description: "Collection approved and journal entry created" });
      queryClient.invalidateQueries({ queryKey: ["/api/collection-records"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to approve", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await apiRequest("PATCH", `/api/collection-records/${id}/reject`, { reason });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Rejected", description: "Collection record rejected" });
      setRejectDialog(null);
      setRejectReason("");
      queryClient.invalidateQueries({ queryKey: ["/api/collection-records"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to reject", variant: "destructive" });
    },
  });

  const reverseMutation = useMutation({
    mutationFn: async ({ installmentId, reason }: { installmentId: string; reason: string }) => {
      const res = await apiRequest("POST", `/api/collections/${installmentId}/reverse`, { reason });
      return res.json();
    },
    onSuccess: (result: any) => {
      toast({
        title: "Payment Reversed",
        description: `AFN ${parseFloat(result.reversedAmount || "0").toLocaleString()} reversed. The journal entry was reversed and the installment reset to unpaid.`,
      });
      setReverseDialog(null);
      setReverseReason("");
      queryClient.invalidateQueries({ queryKey: ["/api/collection-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payment-transactions"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to reverse payment", variant: "destructive" });
    },
  });

  const confirmReverse = () => {
    if (!reverseDialog) return;
    if (!reverseReason.trim()) {
      toast({ title: "Reason required", description: "Please enter a reason for reversing this collection.", variant: "destructive" });
      return;
    }
    reverseMutation.mutate({ installmentId: reverseDialog.installment_id, reason: reverseReason.trim() });
  };

  const filtered = records.filter((r: any) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      r.customer_name?.toLowerCase().includes(s) ||
      r.customer_full_name?.toLowerCase().includes(s) ||
      r.loan_application_id?.toLowerCase().includes(s) ||
      r.application_id?.toLowerCase().includes(s) ||
      r.finance_officer_name?.toLowerCase().includes(s) ||
      r.submitted_by_name?.toLowerCase().includes(s)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="outline" className="text-amber-600 border-amber-300"><HourglassIcon className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved": return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected": return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-7 w-7 text-purple-500" />
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Collection Approvals</h1>
          <p className="text-muted-foreground text-sm">Review and approve collection records submitted by field officers</p>
        </div>
        {(pendingCount?.count || 0) > 0 && (
          <Badge variant="destructive" className="ml-auto text-sm px-3 py-1">
            {pendingCount?.count} Pending
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="pending" data-testid="tab-pending">
              Pending {(pendingCount?.count || 0) > 0 && `(${pendingCount?.count})`}
            </TabsTrigger>
            <TabsTrigger value="approved" data-testid="tab-approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected" data-testid="tab-rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          </TabsList>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              data-testid="input-search-records"
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No {activeTab === "all" ? "" : activeTab} records found</p>
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Inst #</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Inst Total</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Officer</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Submitted By</TableHead>
                        <TableHead>Status</TableHead>
                        {activeTab === "rejected" && <TableHead>Reason</TableHead>}
                        {activeTab === "approved" && <TableHead>Approved By</TableHead>}
                        {activeTab === "approved" && canReverse && <TableHead className="text-center">Actions</TableHead>}
                        {activeTab === "pending" && <TableHead className="text-center">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((record: any) => (
                        <TableRow key={record.id} data-testid={`row-record-${record.id}`}>
                          <TableCell className="text-xs whitespace-nowrap">
                            {record.submitted_at ? format(new Date(record.submitted_at), "dd MMM HH:mm") : "—"}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{record.application_id || record.loan_application_id || "—"}</TableCell>
                          <TableCell>{record.customer_full_name || record.customer_name || "—"}</TableCell>
                          <TableCell className="text-center">{record.installment_number || "—"}</TableCell>
                          <TableCell className="text-xs whitespace-nowrap">
                            {record.due_date ? format(new Date(record.due_date), "dd MMM yyyy") : "—"}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(record.installment_total)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(record.amount)}</TableCell>
                          <TableCell className="text-xs whitespace-nowrap">
                            {record.payment_date ? format(new Date(record.payment_date), "dd MMM yyyy") : "—"}
                          </TableCell>
                          <TableCell>{record.finance_officer_name || "—"}</TableCell>
                          <TableCell>{record.branch_name || "—"}</TableCell>
                          <TableCell>{record.submitted_by_name || "—"}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          {activeTab === "rejected" && <TableCell className="max-w-[150px] truncate text-xs">{record.rejection_reason || "—"}</TableCell>}
                          {activeTab === "approved" && <TableCell>{record.reviewed_by_name || "—"}</TableCell>}
                          {activeTab === "approved" && canReverse && (
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  onClick={() => { setReverseDialog(record); setReverseReason(""); }}
                                  data-testid={`button-reverse-${record.id}`}
                                >
                                  <Undo2 className="h-3 w-3 mr-1" /> Reverse
                                </Button>
                              </div>
                            </TableCell>
                          )}
                          {activeTab === "pending" && (
                            <TableCell>
                              <div className="flex items-center gap-1 justify-center">
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-7 text-xs bg-green-600 hover:bg-green-700"
                                  onClick={() => approveMutation.mutate(record.id)}
                                  disabled={approveMutation.isPending}
                                  data-testid={`button-approve-${record.id}`}
                                >
                                  {approveMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-7 text-xs"
                                  onClick={() => { setRejectDialog(record); setRejectReason(""); }}
                                  data-testid={`button-reject-${record.id}`}
                                >
                                  <XCircle className="h-3 w-3 mr-1" /> Reject
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!rejectDialog} onOpenChange={(open) => { if (!open) setRejectDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Collection Record</DialogTitle>
          </DialogHeader>
          {rejectDialog && (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                <p><span className="text-muted-foreground">Customer:</span> {rejectDialog.customer_full_name || rejectDialog.customer_name}</p>
                <p><span className="text-muted-foreground">Loan:</span> {rejectDialog.application_id || rejectDialog.loan_application_id}</p>
                <p><span className="text-muted-foreground">Amount:</span> {formatCurrency(rejectDialog.amount)} AFN</p>
              </div>
              <div className="space-y-2">
                <Label>Reason for Rejection</Label>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reason for rejecting this collection..."
                  rows={3}
                  data-testid="input-reject-reason"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => rejectMutation.mutate({ id: rejectDialog.id, reason: rejectReason })}
              disabled={rejectMutation.isPending}
              data-testid="button-confirm-reject"
            >
              {rejectMutation.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reverseDialog} onOpenChange={(open) => { if (!open) setReverseDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reverse Approved Collection</DialogTitle>
          </DialogHeader>
          {reverseDialog && (
            <div className="space-y-3">
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900 p-3 text-sm text-red-800 dark:text-red-300">
                This will reverse the journal entry and reset the installment to unpaid. Use this only to undo a collection that was approved by mistake.
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                <p><span className="text-muted-foreground">Customer:</span> {reverseDialog.customer_full_name || reverseDialog.customer_name}</p>
                <p><span className="text-muted-foreground">Loan:</span> {reverseDialog.application_id || reverseDialog.loan_application_id}</p>
                <p><span className="text-muted-foreground">Amount:</span> {formatCurrency(reverseDialog.amount)} AFN</p>
              </div>
              <div className="space-y-2">
                <Label>Reason for Reversal</Label>
                <Textarea
                  value={reverseReason}
                  onChange={(e) => setReverseReason(e.target.value)}
                  placeholder="Enter reason for reversing this collection..."
                  rows={3}
                  data-testid="input-reverse-reason"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReverseDialog(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={confirmReverse}
              disabled={reverseMutation.isPending}
              data-testid="button-confirm-reverse"
            >
              {reverseMutation.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Undo2 className="h-4 w-4 mr-1" />}
              Reverse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
