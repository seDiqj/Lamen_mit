import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, BookOpen, Search, Filter, PlusCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Account = {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: "asset" | "liability" | "equity" | "income" | "expense";
  parentId: string | null;
  description: string | null;
  isActive: boolean;
  currentBalance: string;
  openingBalance: string;
  children?: Account[];
};

const accountTypeColors: Record<string, string> = {
  asset: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  liability: "bg-red-500/10 text-red-600 border-red-500/20",
  equity: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  income: "bg-green-500/10 text-green-600 border-green-500/20",
  expense: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export default function ChartOfAccounts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    accountCode: "",
    accountName: "",
    accountType: "asset" as Account["accountType"],
    parentId: "",
    description: "",
    openingBalance: "0",
  });

  const { data: accounts = [], isLoading } = useQuery<Account[]>({
    queryKey: ["/api/accounts", { search: searchTerm, accountType: typeFilter !== "all" ? typeFilter : undefined }],
  });

  const { data: hierarchy = [] } = useQuery<Account[]>({
    queryKey: ["/api/accounts/hierarchy"],
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/accounts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({ title: "Success", description: "Account created successfully" });
      resetForm();
      setDialogOpen(false);
    },
    onError: () => toast({ title: "Error", description: "Failed to create account", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof formData }) =>
      apiRequest("PATCH", `/api/accounts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({ title: "Success", description: "Account updated successfully" });
      resetForm();
      setDialogOpen(false);
    },
    onError: () => toast({ title: "Error", description: "Failed to update account", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/accounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({ title: "Success", description: "Account deleted successfully" });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete account", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({ accountCode: "", accountName: "", accountType: "asset", parentId: "", description: "", openingBalance: "0" });
    setEditingAccount(null);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      accountCode: account.accountCode,
      accountName: account.accountName,
      accountType: account.accountType,
      parentId: account.parentId || "",
      description: account.description || "",
      openingBalance: account.openingBalance || "0",
    });
    setDialogOpen(true);
  };

  const generateNextChildCode = (parentAccount: Account): string => {
    const parentCode = parentAccount.accountCode;
    const children = accounts.filter(a => a.parentId === parentAccount.id);
    
    if (children.length === 0) {
      // For a parent like "5100", first child should be "5101"
      // For a parent like "1000", first child should be "1100" (category level)
      if (parentCode.endsWith("000")) {
        // Top-level category (1000, 2000, etc.) - first sub-category is X100
        return parentCode.slice(0, 1) + "100";
      } else if (parentCode.endsWith("00")) {
        // Sub-category (1100, 5100, etc.) - first child is X101
        return parentCode.slice(0, -1) + "1";
      } else {
        // Leaf account - add 1 to the last digit pattern
        return parentCode + "1";
      }
    }
    
    const childCodes = children.map(c => parseInt(c.accountCode)).filter(n => !isNaN(n));
    const maxCode = Math.max(...childCodes);
    return String(maxCode + 1);
  };

  const handleAddSubAccount = (parentAccount: Account) => {
    const nextCode = generateNextChildCode(parentAccount);
    setEditingAccount(null);
    setFormData({
      accountCode: nextCode,
      accountName: "",
      accountType: parentAccount.accountType,
      parentId: parentAccount.id,
      description: "",
      openingBalance: "0",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData, parentId: formData.parentId || null };
    if (editingAccount) {
      updateMutation.mutate({ id: editingAccount.id, data: submitData as any });
    } else {
      createMutation.mutate(submitData as any);
    }
  };

  const toggleExpand = (accountId: string) => {
    setExpandedAccounts(prev => {
      const next = new Set(prev);
      if (next.has(accountId)) next.delete(accountId);
      else next.add(accountId);
      return next;
    });
  };

  const renderAccountRow = (account: Account, level: number = 0): JSX.Element[] => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedAccounts.has(account.id);

    const rows: JSX.Element[] = [
      <TableRow key={account.id} className="hover:bg-muted/50">
        <TableCell className="font-mono">
          <div className="flex items-center gap-1" style={{ paddingLeft: `${level * 20}px` }}>
            {hasChildren && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleExpand(account.id)} data-testid={`button-expand-${account.id}`}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
            {!hasChildren && <span className="w-6" />}
            <span>{account.accountCode}</span>
          </div>
        </TableCell>
        <TableCell className="font-medium">{account.accountName}</TableCell>
        <TableCell>
          <Badge variant="outline" className={accountTypeColors[account.accountType]}>
            {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
          </Badge>
        </TableCell>
        <TableCell className="text-right font-mono">{formatCurrency(account.currentBalance || "0")}</TableCell>
        <TableCell>
          <Badge variant={account.isActive ? "default" : "secondary"}>
            {account.isActive ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => handleAddSubAccount(account)} title="Add Sub-Account" data-testid={`button-add-sub-${account.id}`}>
              <PlusCircle className="h-4 w-4 text-green-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(account)} data-testid={`button-edit-${account.id}`}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(account.id)} data-testid={`button-delete-${account.id}`}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ];

    if (hasChildren && isExpanded) {
      account.children!.forEach(child => {
        rows.push(...renderAccountRow(child, level + 1));
      });
    }

    return rows;
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <BookOpen className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Chart of Accounts</h1>
            <p className="text-muted-foreground text-sm">Manage your account structure for double-entry bookkeeping</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-account">
              <Plus className="h-4 w-4" /> Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAccount ? "Edit Account" : "Add New Account"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountCode">Account Code</Label>
                  <Input id="accountCode" value={formData.accountCode} onChange={(e) => setFormData(prev => ({ ...prev, accountCode: e.target.value }))} required data-testid="input-account-code" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select value={formData.accountType} onValueChange={(val) => setFormData(prev => ({ ...prev, accountType: val as Account["accountType"] }))}>
                    <SelectTrigger data-testid="select-account-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asset">Asset</SelectItem>
                      <SelectItem value="liability">Liability</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" value={formData.accountName} onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))} required data-testid="input-account-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Account (optional)</Label>
                <Select value={formData.parentId || "none"} onValueChange={(val) => setFormData(prev => ({ ...prev, parentId: val === "none" ? "" : val }))}>
                  <SelectTrigger data-testid="select-parent-account">
                    <SelectValue placeholder="Select parent account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Parent (Top Level)</SelectItem>
                    {accounts.filter(a => a.id !== editingAccount?.id).map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.accountCode} - {a.accountName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingBalance">Opening Balance</Label>
                <Input id="openingBalance" type="number" step="0.01" value={formData.openingBalance} onChange={(e) => setFormData(prev => ({ ...prev, openingBalance: e.target.value }))} data-testid="input-opening-balance" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} data-testid="input-description" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-account">
                  {editingAccount ? "Update" : "Create"} Account
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search accounts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" data-testid="input-search" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40" data-testid="select-type-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="asset">Assets</SelectItem>
                <SelectItem value="liability">Liabilities</SelectItem>
                <SelectItem value="equity">Equity</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
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
                  <TableHead className="w-32">Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="w-28">Type</TableHead>
                  <TableHead className="w-36 text-right">Balance</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hierarchy.length > 0 ? hierarchy.flatMap(acc => renderAccountRow(acc)) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No accounts found. Click "Add Account" to create your first account.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
