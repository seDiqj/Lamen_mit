import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function LoanTransfersPage() {
  const { toast } = useToast();
  const [fromOfficerId, setFromOfficerId] = useState("");
  const [toOfficerId, setToOfficerId] = useState("");
  const [reason, setReason] = useState("");
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
  const [searchLog, setSearchLog] = useState("");

  const { data: officers = [] } = useQuery<any[]>({
    queryKey: ["/api/finance-officers/active"],
  });

  const { data: allOfficers = [] } = useQuery<any[]>({
    queryKey: ["/api/finance-officers"],
  });

  const officerList = allOfficers.length > 0 ? allOfficers : officers;

  const { data: officerLoans = [], isLoading: loansLoading } = useQuery<any[]>({
    queryKey: ["/api/loan-transfers/officer-loans", fromOfficerId],
    queryFn: () => fetch(`/api/loan-transfers/officer-loans/${fromOfficerId}`).then(r => r.json()),
    enabled: !!fromOfficerId,
  });

  const { data: transferLogs = [], isLoading: logsLoading } = useQuery<any[]>({
    queryKey: ["/api/loan-transfers"],
  });

  const transferMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/loan-transfers", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Success", description: data.message });
      setSelectedLoans([]);
      setReason("");
      setFromOfficerId("");
      setToOfficerId("");
      queryClient.invalidateQueries({ queryKey: ["/api/loan-transfers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loan-transfers/officer-loans"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Transfer failed", variant: "destructive" });
    },
  });

  const handleTransfer = () => {
    if (!fromOfficerId || !toOfficerId || selectedLoans.length === 0) {
      toast({ title: "Error", description: "Please select source officer, destination officer, and at least one loan", variant: "destructive" });
      return;
    }
    transferMutation.mutate({
      fromOfficerId,
      toOfficerId,
      loanIds: selectedLoans,
      reason,
    });
  };

  const toggleLoan = (loanId: string) => {
    setSelectedLoans(prev =>
      prev.includes(loanId) ? prev.filter(id => id !== loanId) : [...prev, loanId]
    );
  };

  const toggleAll = () => {
    if (selectedLoans.length === officerLoans.length) {
      setSelectedLoans([]);
    } else {
      setSelectedLoans(officerLoans.map((l: any) => l.id));
    }
  };

  const filteredLogs = transferLogs.filter((log: any) => {
    if (!searchLog) return true;
    const s = searchLog.toLowerCase();
    return (
      log.from_officer_name?.toLowerCase().includes(s) ||
      log.to_officer_name?.toLowerCase().includes(s) ||
      log.application_id?.toLowerCase().includes(s) ||
      log.customer_name?.toLowerCase().includes(s) ||
      log.transferred_by_name?.toLowerCase().includes(s) ||
      log.reason?.toLowerCase().includes(s)
    );
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "active": case "disbursed": return "default";
      case "pending": return "secondary";
      case "completed": return "outline";
      case "defaulted": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <ArrowRightLeft className="h-7 w-7 text-indigo-500" />
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Loan Officer Transfer</h1>
          <p className="text-muted-foreground text-sm">Transfer loans between financing officers</p>
        </div>
      </div>

      <Tabs defaultValue="transfer">
        <TabsList>
          <TabsTrigger value="transfer" data-testid="tab-transfer">Transfer Loans</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">Transfer History</TabsTrigger>
        </TabsList>

        <TabsContent value="transfer" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">From (Source Officer)</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={fromOfficerId} onValueChange={(v) => { setFromOfficerId(v); setSelectedLoans([]); }}>
                  <SelectTrigger data-testid="select-from-officer">
                    <SelectValue placeholder="Select source officer" />
                  </SelectTrigger>
                  <SelectContent>
                    {officerList.map((o: any) => (
                      <SelectItem key={o.id} value={o.id} data-testid={`option-from-officer-${o.id}`}>
                        {o.name} {o.code ? `(${o.code})` : ""} {!o.isActive && o.is_active === false ? " [Inactive]" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">To (Destination Officer)</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={toOfficerId} onValueChange={setToOfficerId}>
                  <SelectTrigger data-testid="select-to-officer">
                    <SelectValue placeholder="Select destination officer" />
                  </SelectTrigger>
                  <SelectContent>
                    {officers.filter((o: any) => o.id !== fromOfficerId).map((o: any) => (
                      <SelectItem key={o.id} value={o.id} data-testid={`option-to-officer-${o.id}`}>
                        {o.name} {o.code ? `(${o.code})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Reason for Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., Officer leaving organization, promotion, branch reassignment..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="resize-none"
                  rows={2}
                  data-testid="input-reason"
                />
              </CardContent>
            </Card>
          </div>

          {fromOfficerId && (
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Loans under Selected Officer ({officerLoans.length} loans)
                </CardTitle>
                <div className="flex items-center gap-3">
                  {officerLoans.length > 0 && (
                    <Button variant="outline" size="sm" onClick={toggleAll} data-testid="button-select-all">
                      {selectedLoans.length === officerLoans.length ? "Deselect All" : "Select All"}
                    </Button>
                  )}
                  {selectedLoans.length > 0 && toOfficerId && (
                    <Button
                      size="sm"
                      onClick={handleTransfer}
                      disabled={transferMutation.isPending}
                      data-testid="button-transfer"
                    >
                      {transferMutation.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transferring...</>
                      ) : (
                        <>Transfer {selectedLoans.length} Loan(s)</>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loansLoading ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : officerLoans.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">No active loans found for this officer</p>
                ) : (
                  <div className="border rounded-lg overflow-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">
                            <Checkbox
                              checked={selectedLoans.length === officerLoans.length && officerLoans.length > 0}
                              onCheckedChange={toggleAll}
                              data-testid="checkbox-select-all"
                            />
                          </TableHead>
                          <TableHead>Application ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {officerLoans.map((loan: any) => (
                          <TableRow key={loan.id} data-testid={`row-loan-${loan.id}`}>
                            <TableCell>
                              <Checkbox
                                checked={selectedLoans.includes(loan.id)}
                                onCheckedChange={() => toggleLoan(loan.id)}
                                data-testid={`checkbox-loan-${loan.id}`}
                              />
                            </TableCell>
                            <TableCell className="font-mono text-sm">{loan.application_id || "—"}</TableCell>
                            <TableCell>{loan.customer_name || "—"}</TableCell>
                            <TableCell>{loan.product_name || "—"}</TableCell>
                            <TableCell className="text-right">{loan.request_amount ? Number(loan.request_amount).toLocaleString() : "—"}</TableCell>
                            <TableCell>
                              <Badge variant={statusColor(loan.status) as any}>{loan.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Transfer Log</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transfers..."
                  value={searchLog}
                  onChange={(e) => setSearchLog(e.target.value)}
                  className="pl-8"
                  data-testid="input-search-log"
                />
              </div>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : filteredLogs.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No transfer records found</p>
              ) : (
                <div className="border rounded-lg overflow-auto max-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>From Officer</TableHead>
                        <TableHead>To Officer</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Transferred By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log: any) => (
                        <TableRow key={log.id} data-testid={`row-transfer-${log.id}`}>
                          <TableCell className="text-sm whitespace-nowrap">
                            {log.transfer_date ? format(new Date(log.transfer_date), "yyyy-MM-dd HH:mm") : "—"}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.application_id || log.loan_application_id || "—"}</TableCell>
                          <TableCell>{log.customer_name || "—"}</TableCell>
                          <TableCell>{log.product_name || "—"}</TableCell>
                          <TableCell>{log.from_officer_name || "—"}</TableCell>
                          <TableCell>{log.to_officer_name || "—"}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{log.reason || "—"}</TableCell>
                          <TableCell>{log.transferred_by_name || "—"}</TableCell>
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
    </div>
  );
}