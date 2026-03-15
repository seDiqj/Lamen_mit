import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableAccountSelect } from "@/components/searchable-account-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Search, Receipt, Eye, CheckCircle, RotateCcw, Trash2, Pencil, ChevronLeft, ChevronRight, Undo2, Wrench } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";

type Account = {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
};

type JournalLine = {
  accountId: string;
  description: string;
  debitAmount: string;
  creditAmount: string;
  fundingSourceId: string;
};

type FundingSource = {
  id: string;
  name: string;
  code: string;
};

type JournalEntry = {
  id: string;
  entryNumber: string;
  entryDate: string;
  description: string;
  reference: string | null;
  referenceType: string | null;
  fundingSourceId: string | null;
  fundingSourceName: string | null;
  isPosted: boolean;
  isReversed: boolean;
  totalDebit: string;
  totalCredit: string;
  createdAt: string;
  lines?: Array<JournalLine & { accountCode?: string; accountName?: string }>;
};

type PaginatedResponse = {
  entries: JournalEntry[];
  total: number;
  page: number;
  totalPages: number;
};

export default function JournalEntries() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [postConfirmOpen, setPostConfirmOpen] = useState(false);
  const [entryToPost, setEntryToPost] = useState<JournalEntry | null>(null);
  const [fundingSourceFilter, setFundingSourceFilter] = useState("all");

  const [formData, setFormData] = useState({
    entryDate: new Date().toISOString().split("T")[0],
    description: "",
    reference: "",
    referenceType: "manual",
  });

  const [lines, setLines] = useState<JournalLine[]>([
    { accountId: "", description: "", debitAmount: "", creditAmount: "", fundingSourceId: "" },
    { accountId: "", description: "", debitAmount: "", creditAmount: "", fundingSourceId: "" },
  ]);

  const { data: paginatedData, isLoading } = useQuery<PaginatedResponse>({
    queryKey: ["/api/journal-entries", searchTerm, currentPage, fundingSourceFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(currentPage), limit: "50" });
      if (searchTerm) params.set("search", searchTerm);
      if (fundingSourceFilter && fundingSourceFilter !== "all") params.set("fundingSourceId", fundingSourceFilter);
      const res = await fetch(`/api/journal-entries?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch journal entries");
      return res.json();
    },
  });

  const entries = paginatedData?.entries ?? [];
  const totalPages = paginatedData?.totalPages ?? 1;
  const totalEntries = paginatedData?.total ?? 0;

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const { data: fundingSources = [] } = useQuery<FundingSource[]>({
    queryKey: ["/api/funding-sources"],
  });

  const createMutation = useMutation({
    mutationFn: (data: { entryDate: string; description: string; reference: string; referenceType: string; lines: JournalLine[] }) =>
      apiRequest("POST", "/api/journal-entries", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      toast({ title: "Success", description: "Journal entry created successfully" });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error: any) => toast({ title: "Error", description: error.message || "Failed to create journal entry", variant: "destructive" }),
  });

  const postMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/journal-entries/${id}/post`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({ title: "Success", description: "Journal entry posted successfully" });
    },
    onError: () => toast({ title: "Error", description: "Failed to post journal entry", variant: "destructive" }),
  });

  const reverseMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/journal-entries/${id}/reverse`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({ title: "Success", description: "Journal entry reversed successfully" });
    },
    onError: () => toast({ title: "Error", description: "Failed to reverse journal entry", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; entryDate: string; description: string; reference: string; referenceType: string; lines: JournalLine[] }) =>
      apiRequest("PATCH", `/api/journal-entries/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      toast({ title: "Success", description: "Journal entry updated successfully" });
      resetForm();
      setEditingEntry(null);
      setDialogOpen(false);
    },
    onError: (error: any) => toast({ title: "Error", description: error.message || "Failed to update journal entry", variant: "destructive" }),
  });

  const editEntry = async (entry: JournalEntry) => {
    try {
      const res = await fetch(`/api/journal-entries/${entry.id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load");
      const fullEntry = await res.json();
      setEditingEntry(fullEntry);
      setFormData({
        entryDate: fullEntry.entryDate?.split("T")[0] || new Date().toISOString().split("T")[0],
        description: fullEntry.description || "",
        reference: fullEntry.reference || "",
        referenceType: fullEntry.referenceType || "manual",
      });
      setLines(
        fullEntry.lines?.map((line: any) => ({
          accountId: line.accountId,
          description: line.description || "",
          debitAmount: line.debitAmount || "",
          creditAmount: line.creditAmount || "",
          fundingSourceId: line.fundingSourceId || "",
        })) || [
          { accountId: "", description: "", debitAmount: "", creditAmount: "", fundingSourceId: "" },
          { accountId: "", description: "", debitAmount: "", creditAmount: "", fundingSourceId: "" },
        ]
      );
      setDialogOpen(true);
    } catch {
      toast({ title: "Error", description: "Failed to load entry for editing", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({ entryDate: new Date().toISOString().split("T")[0], description: "", reference: "", referenceType: "manual" });
    setLines([
      { accountId: "", description: "", debitAmount: "", creditAmount: "", fundingSourceId: "" },
      { accountId: "", description: "", debitAmount: "", creditAmount: "", fundingSourceId: "" },
    ]);
  };

  const addLine = () => {
    setLines([...lines, { accountId: "", description: "", debitAmount: "", creditAmount: "", fundingSourceId: "" }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 2) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: keyof JournalLine, value: string) => {
    setLines(lines.map((line, i) => (i === index ? { ...line, [field]: value } : line)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shareholderFs = fundingSources.find((fs: any) => fs.name?.toLowerCase().includes("shareholder"));
    const defaultFundingSourceId = shareholderFs?.id || "";
    const validLines = lines
      .filter(l => l.accountId && (Number(l.debitAmount) > 0 || Number(l.creditAmount) > 0))
      .map(l => ({ ...l, fundingSourceId: l.fundingSourceId || defaultFundingSourceId }));
    if (validLines.length < 2) {
      toast({ title: "Error", description: "At least two valid lines are required", variant: "destructive" });
      return;
    }
    if (editingEntry) {
      updateMutation.mutate({ id: editingEntry.id, ...formData, lines: validLines });
    } else {
      createMutation.mutate({ ...formData, lines: validLines });
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingEntry(null);
      resetForm();
    }
    setDialogOpen(open);
  };

  const viewEntry = async (entry: JournalEntry) => {
    try {
      const res = await fetch(`/api/journal-entries/${entry.id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load");
      const fullEntry = await res.json();
      setSelectedEntry(fullEntry);
      setViewDialogOpen(true);
    } catch {
      toast({ title: "Error", description: "Failed to load entry details", variant: "destructive" });
    }
  };

  const totalDebit = lines.reduce((sum, l) => sum + Number(l.debitAmount || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + Number(l.creditAmount || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Receipt className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Journal Entries</h1>
            <p className="text-muted-foreground text-sm">Record and manage double-entry transactions</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-entry">
              <Plus className="h-4 w-4" /> New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit Journal Entry" : "Create Journal Entry"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryDate">Entry Date</Label>
                  <Input id="entryDate" type="date" value={formData.entryDate} onChange={(e) => setFormData(prev => ({ ...prev, entryDate: e.target.value }))} required data-testid="input-entry-date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference</Label>
                  <Input id="reference" value={formData.reference} onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))} placeholder="e.g., INV-001" data-testid="input-reference" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referenceType">Type</Label>
                  <Select value={formData.referenceType} onValueChange={(val) => setFormData(prev => ({ ...prev, referenceType: val }))}>
                    <SelectTrigger data-testid="select-reference-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="loan_disbursement">Financing Disbursement</SelectItem>
                      <SelectItem value="loan_repayment">Financing Repayment</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} required rows={2} data-testid="input-description" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Journal Lines</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addLine} data-testid="button-add-line">
                    <Plus className="h-4 w-4 mr-1" /> Add Line
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[220px]">Account</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[150px]">Fund</TableHead>
                      <TableHead className="w-28 text-right">Debit</TableHead>
                      <TableHead className="w-28 text-right">Credit</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lines.map((line, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <SearchableAccountSelect
                            accounts={accounts}
                            value={line.accountId}
                            onValueChange={(val) => updateLine(index, "accountId", val)}
                            placeholder="Search account..."
                            className="w-full"
                            data-testid={`select-account-${index}`}
                          />
                        </TableCell>
                        <TableCell>
                          <Input value={line.description} onChange={(e) => updateLine(index, "description", e.target.value)} placeholder="Line description" data-testid={`input-line-desc-${index}`} />
                        </TableCell>
                        <TableCell>
                          <Select value={line.fundingSourceId || "none"} onValueChange={(val) => updateLine(index, "fundingSourceId", val === "none" ? "" : val)}>
                            <SelectTrigger className="h-9 text-xs" data-testid={`select-fund-${index}`}>
                              <SelectValue placeholder="Fund..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {fundingSources.map((fs) => (
                                <SelectItem key={fs.id} value={fs.id}>{fs.code} - {fs.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input type="number" step="0.01" min="0" value={line.debitAmount} onChange={(e) => updateLine(index, "debitAmount", e.target.value)} className="text-right" data-testid={`input-debit-${index}`} />
                        </TableCell>
                        <TableCell>
                          <Input type="number" step="0.01" min="0" value={line.creditAmount} onChange={(e) => updateLine(index, "creditAmount", e.target.value)} className="text-right" data-testid={`input-credit-${index}`} />
                        </TableCell>
                        <TableCell>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeLine(index)} disabled={lines.length <= 2} data-testid={`button-remove-line-${index}`}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold bg-muted/50">
                      <TableCell colSpan={3} className="text-right">Totals:</TableCell>
                      <TableCell className="text-right">{formatCurrency(totalDebit.toString())}</TableCell>
                      <TableCell className="text-right">{formatCurrency(totalCredit.toString())}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
                {!isBalanced && totalDebit > 0 && (
                  <p className="text-red-500 text-sm">Debits and Credits must be equal. Difference: {formatCurrency(Math.abs(totalDebit - totalCredit).toString())}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit" disabled={!isBalanced || createMutation.isPending || updateMutation.isPending} data-testid="button-submit-entry">
                  {editingEntry ? "Update Entry" : "Create Entry"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search entries..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="pl-9" data-testid="input-search" />
            </div>
            <Select value={fundingSourceFilter} onValueChange={(val) => { setFundingSourceFilter(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-[200px]" data-testid="filter-funding-source">
                <SelectValue placeholder="All Funds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Funds</SelectItem>
                {fundingSources.map((fs) => (
                  <SelectItem key={fs.id} value={fs.id}>{fs.code} - {fs.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Fund</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length > 0 ? entries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono">{entry.entryNumber}</TableCell>
                    <TableCell>{formatDate(entry.entryDate)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{entry.description}</TableCell>
                    <TableCell>{entry.reference || "-"}</TableCell>
                    <TableCell className="text-sm">{(entry as any).fundingSourceName || "-"}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(entry.totalDebit)}</TableCell>
                    <TableCell>
                      {entry.isReversed ? (
                        <Badge variant="secondary">Reversed</Badge>
                      ) : entry.isPosted ? (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Posted</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => viewEntry(entry)} data-testid={`button-view-${entry.id}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!entry.isPosted && !entry.isReversed && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => editEntry(entry)} data-testid={`button-edit-${entry.id}`}>
                              <Pencil className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => { setEntryToPost(entry); setPostConfirmOpen(true); }} data-testid={`button-post-${entry.id}`}>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          </>
                        )}
                        {entry.isPosted && !entry.isReversed && (
                          <Button variant="ghost" size="icon" onClick={() => reverseMutation.mutate(entry.id)} data-testid={`button-reverse-${entry.id}`}>
                            <RotateCcw className="h-4 w-4 text-orange-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No journal entries found. Click "New Entry" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * 50) + 1} - {Math.min(currentPage * 50, totalEntries)} of {totalEntries} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  data-testid="button-next-page"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Journal Entry: {selectedEntry?.entryNumber}</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-muted-foreground">Date:</span> {formatDate(selectedEntry.entryDate)}</div>
                <div><span className="text-muted-foreground">Reference:</span> {selectedEntry.reference || "-"}</div>
                <div><span className="text-muted-foreground">Type:</span> {selectedEntry.referenceType}</div>
              </div>
              <div><span className="text-muted-foreground text-sm">Description:</span> <p>{selectedEntry.description}</p></div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Fund</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedEntry.lines?.map((line, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{line.accountCode} - {line.accountName}</TableCell>
                      <TableCell>{line.description || "-"}</TableCell>
                      <TableCell className="text-sm">{(line as any).fundingSourceName || "-"}</TableCell>
                      <TableCell className="text-right font-mono">{Number(line.debitAmount) > 0 ? formatCurrency(line.debitAmount) : "-"}</TableCell>
                      <TableCell className="text-right font-mono">{Number(line.creditAmount) > 0 ? formatCurrency(line.creditAmount) : "-"}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-semibold bg-muted/50">
                    <TableCell colSpan={3} className="text-right">Totals:</TableCell>
                    <TableCell className="text-right">{formatCurrency(selectedEntry.totalDebit)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(selectedEntry.totalCredit)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={postConfirmOpen} onOpenChange={setPostConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Post Journal Entry</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to post this journal entry? This action cannot be undone.</p>
              {entryToPost && (
                <div className="mt-4 p-3 bg-muted rounded-md text-sm space-y-1">
                  <div><strong>Entry:</strong> {entryToPost.entryNumber}</div>
                  <div><strong>Date:</strong> {formatDate(entryToPost.entryDate)}</div>
                  <div><strong>Description:</strong> {entryToPost.description}</div>
                  <div className="flex gap-4">
                    <span><strong>Total Debit:</strong> {formatCurrency(entryToPost.totalDebit)}</span>
                    <span><strong>Total Credit:</strong> {formatCurrency(entryToPost.totalCredit)}</span>
                  </div>
                </div>
              )}
              <p className="text-orange-600 dark:text-orange-400 font-medium mt-2">
                Once posted, this entry will affect account balances and can only be reversed, not edited.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-post">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (entryToPost) {
                  postMutation.mutate(entryToPost.id);
                }
                setPostConfirmOpen(false);
                setEntryToPost(null);
              }}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-confirm-post"
            >
              Post Entry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
