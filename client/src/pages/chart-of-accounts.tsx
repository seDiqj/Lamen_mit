import { useState, useRef, useCallback } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, BookOpen, Search, Filter, PlusCircle, GripVertical, FolderTree, TableProperties, MoveUp, MoveDown, ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

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

const accountTypeBgDrag: Record<string, string> = {
  asset: "#dbeafe",
  liability: "#fee2e2",
  equity: "#f3e8ff",
  income: "#dcfce7",
  expense: "#ffedd5",
};

export default function ChartOfAccounts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("table");

  const [parentPopoverOpen, setParentPopoverOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<"inside" | "above" | "below" | null>(null);
  const [dragExpandedAccounts, setDragExpandedAccounts] = useState<Set<string>>(new Set());

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

  const { data: allAccounts = [] } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const { data: hierarchy = [] } = useQuery<Account[]>({
    queryKey: ["/api/accounts/hierarchy"],
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("POST", "/api/accounts", data),
    onSuccess: () => {
      invalidateAllAccounts();
      toast({ title: "Success", description: "Account created successfully" });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error: any) => {
      let msg = "Failed to create account";
      try {
        const parsed = JSON.parse(error?.message?.split(": ").slice(1).join(": ") || "{}");
        if (parsed.message) msg = parsed.message;
      } catch { /* use default */ }
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PATCH", `/api/accounts/${id}`, data),
    onSuccess: () => {
      invalidateAllAccounts();
      toast({ title: "Success", description: "Account updated successfully" });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error: any) => {
      let msg = "Failed to update account";
      try {
        const parsed = JSON.parse(error?.message?.split(": ").slice(1).join(": ") || "{}");
        if (parsed.message) msg = parsed.message;
      } catch {}
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const invalidateAllAccounts = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
    queryClient.invalidateQueries({ queryKey: ["/api/accounts/hierarchy"] });
  };

  const reparentMutation = useMutation({
    mutationFn: ({ id, parentId }: { id: string; parentId: string | null }) =>
      apiRequest("PATCH", `/api/accounts/${id}`, { parentId }),
    onSuccess: () => {
      invalidateAllAccounts();
      toast({ title: "Success", description: "Account moved successfully" });
    },
    onError: (error: any) => {
      let msg = "Failed to move account";
      try {
        const parsed = JSON.parse(error?.message?.split(": ").slice(1).join(": ") || "{}");
        if (parsed.message) msg = parsed.message;
      } catch {}
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/accounts/${id}`),
    onSuccess: () => {
      invalidateAllAccounts();
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
    if (children.length > 0) {
      const childCodes = children.map(c => parseInt(c.accountCode)).filter(n => !isNaN(n));
      const maxCode = Math.max(...childCodes);
      return String(maxCode + 1);
    }
    if (parentCode.endsWith("0000")) {
      return parentCode.slice(0, 2) + "100";
    } else if (parentCode.endsWith("00")) {
      return parentCode.slice(0, -2) + "01";
    } else {
      return parentCode + "1";
    }
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

  const toggleDragExpand = (accountId: string) => {
    setDragExpandedAccounts(prev => {
      const next = new Set(prev);
      if (next.has(accountId)) next.delete(accountId);
      else next.add(accountId);
      return next;
    });
  };

  const filterHierarchy = (accs: Account[]): Account[] => {
    if (!searchTerm && typeFilter === "all") return accs;

    const matchesFilter = (acc: Account): boolean => {
      const matchesSearch = !searchTerm ||
        acc.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.accountName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || acc.accountType === typeFilter;
      return matchesSearch && matchesType;
    };

    const filterTree = (acc: Account): Account | null => {
      const filteredChildren = (acc.children || [])
        .map(child => filterTree(child))
        .filter((c): c is Account => c !== null);

      if (matchesFilter(acc) || filteredChildren.length > 0) {
        return { ...acc, children: filteredChildren };
      }
      return null;
    };

    return accs.map(a => filterTree(a)).filter((a): a is Account => a !== null);
  };

  const filteredHierarchy = filterHierarchy(hierarchy);

  const isDescendantOf = (accountId: string, potentialParentId: string, accs: Account[]): boolean => {
    const findInTree = (nodes: Account[], targetId: string): Account | null => {
      for (const n of nodes) {
        if (n.id === targetId) return n;
        if (n.children) {
          const found = findInTree(n.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };
    const checkDescendant = (node: Account): boolean => {
      if (node.id === accountId) return true;
      return (node.children || []).some(c => checkDescendant(c));
    };
    const parent = findInTree(accs, potentialParentId);
    return parent ? checkDescendant(parent) : false;
  };

  const findAccountById = (id: string, accs: Account[]): Account | null => {
    for (const a of accs) {
      if (a.id === id) return a;
      if (a.children) {
        const found = findAccountById(id, a.children);
        if (found) return found;
      }
    }
    return null;
  };

  const findParentOf = (id: string, accs: Account[], parent: Account | null = null): Account | null => {
    for (const a of accs) {
      if (a.id === id) return parent;
      if (a.children) {
        const found = findParentOf(id, a.children, a);
        if (found !== undefined && found !== null) return found;
        if (a.children.some(c => c.id === id)) return a;
      }
    }
    return null;
  };

  const handleDragStart = (e: React.DragEvent, accountId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", accountId);
    setDraggedId(accountId);
  };

  const handleDragOver = (e: React.DragEvent, accountId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedId || draggedId === accountId) return;
    if (isDescendantOf(accountId, draggedId, hierarchy)) return;

    const draggedAccount = findAccountById(draggedId, hierarchy);
    const targetAccount = findAccountById(accountId, hierarchy);
    if (draggedAccount && targetAccount && draggedAccount.accountType !== targetAccount.accountType) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    if (y < height * 0.25) {
      setDropPosition("above");
    } else if (y > height * 0.75) {
      setDropPosition("below");
    } else {
      setDropPosition("inside");
    }
    setDropTargetId(accountId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const related = e.relatedTarget as HTMLElement;
    if (!related || !e.currentTarget.contains(related)) {
      setDropTargetId(null);
      setDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedId || draggedId === targetId) {
      resetDrag();
      return;
    }
    if (isDescendantOf(targetId, draggedId, hierarchy)) {
      toast({ title: "Cannot move", description: "Cannot move an account inside its own child", variant: "destructive" });
      resetDrag();
      return;
    }

    const draggedAccount = findAccountById(draggedId, hierarchy);
    const target = findAccountById(targetId, hierarchy);
    if (draggedAccount && target && draggedAccount.accountType !== target.accountType) {
      toast({ title: "Cannot move", description: "Accounts can only be moved within the same type", variant: "destructive" });
      resetDrag();
      return;
    }
    if (!target) { resetDrag(); return; }

    if (dropPosition === "inside") {
      reparentMutation.mutate({ id: draggedId, parentId: targetId });
    } else {
      const targetParent = findParentOf(targetId, hierarchy);
      reparentMutation.mutate({ id: draggedId, parentId: targetParent?.id || null });
    }

    resetDrag();
  };

  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedId) return;
    reparentMutation.mutate({ id: draggedId, parentId: null });
    resetDrag();
  };

  const resetDrag = () => {
    setDraggedId(null);
    setDropTargetId(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    resetDrag();
  };

  const renderDragNode = (account: Account, level: number = 0): JSX.Element => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = dragExpandedAccounts.has(account.id);
    const isDragging = draggedId === account.id;
    const isDropTarget = dropTargetId === account.id;

    let borderStyle = {};
    if (isDropTarget && dropPosition === "inside") {
      borderStyle = { outline: "2px solid #3b82f6", outlineOffset: "-2px", borderRadius: "6px", backgroundColor: "#eff6ff" };
    } else if (isDropTarget && dropPosition === "above") {
      borderStyle = { borderTop: "3px solid #3b82f6" };
    } else if (isDropTarget && dropPosition === "below") {
      borderStyle = { borderBottom: "3px solid #3b82f6" };
    }

    return (
      <div key={account.id} data-testid={`drag-node-${account.id}`}>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, account.id)}
          onDragOver={(e) => handleDragOver(e, account.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, account.id)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-2 py-2 px-3 rounded-md cursor-grab transition-all ${isDragging ? "opacity-40" : "hover:bg-muted/60"}`}
          style={{ marginLeft: `${level * 24}px`, ...borderStyle }}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          {hasChildren ? (
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={(e) => { e.stopPropagation(); toggleDragExpand(account.id); }} data-testid={`drag-expand-${account.id}`}>
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </Button>
          ) : (
            <span className="w-5" />
          )}
          <span className="font-mono text-sm font-medium text-muted-foreground w-16 flex-shrink-0">{account.accountCode}</span>
          <span className="text-sm font-medium flex-1 truncate">{account.accountName}</span>
          <Badge variant="outline" className={`text-xs ${accountTypeColors[account.accountType]}`}>
            {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground w-20 text-right">{formatCurrency(account.currentBalance || "0")}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {account.children!.map(child => renderDragNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderAccountRow = (account: Account, level: number = 0): JSX.Element[] => {
    const hasChildren = account.children && account.children.length > 0;
    const isSearching = !!(searchTerm || typeFilter !== "all");
    const isExpanded = isSearching || expandedAccounts.has(account.id);

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

  const expandAllDrag = () => {
    const ids = new Set<string>();
    const collect = (accs: Account[]) => {
      accs.forEach(a => {
        if (a.children && a.children.length > 0) {
          ids.add(a.id);
          collect(a.children);
        }
      });
    };
    collect(hierarchy);
    setDragExpandedAccounts(ids);
  };

  const collapseAllDrag = () => {
    setDragExpandedAccounts(new Set());
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
                <Label htmlFor="parentId">Parent Account</Label>
                <Popover open={parentPopoverOpen} onOpenChange={setParentPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={parentPopoverOpen}
                      className="w-full justify-between font-normal"
                      data-testid="select-parent-account"
                    >
                      {formData.parentId
                        ? (() => {
                            const selected = allAccounts.find(a => a.id === formData.parentId);
                            return selected ? `${selected.accountCode} - ${selected.accountName}` : "Select parent account";
                          })()
                        : "No Parent (Top Level)"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[380px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search by code or name..." data-testid="input-parent-search" />
                      <CommandList>
                        <CommandEmpty>No account found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="no-parent-top-level"
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, parentId: "" }));
                              setParentPopoverOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", !formData.parentId ? "opacity-100" : "opacity-0")} />
                            No Parent (Top Level)
                          </CommandItem>
                          {allAccounts
                            .filter(a => a.id !== editingAccount?.id && a.accountType === formData.accountType)
                            .map(a => (
                              <CommandItem
                                key={a.id}
                                value={`${a.accountCode} ${a.accountName}`}
                                onSelect={() => {
                                  setFormData(prev => ({ ...prev, parentId: a.id }));
                                  setParentPopoverOpen(false);
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", formData.parentId === a.id ? "opacity-100" : "opacity-0")} />
                                {a.accountCode} - {a.accountName}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">Only showing {formData.accountType} accounts</p>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table" className="gap-2" data-testid="tab-table-view">
            <TableProperties className="h-4 w-4" /> Table View
          </TabsTrigger>
          <TabsTrigger value="reorganize" className="gap-2" data-testid="tab-reorganize">
            <FolderTree className="h-4 w-4" /> Reorganize (Drag & Drop)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
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
                    {filteredHierarchy.length > 0 ? filteredHierarchy.flatMap(acc => renderAccountRow(acc)) : (
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
        </TabsContent>

        <TabsContent value="reorganize">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Drag & Drop Reorganization</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag accounts to move them. Drop <strong>on</strong> an account to make it a child, or drop <strong>above/below</strong> to place it at the same level.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={expandAllDrag} data-testid="button-expand-all">
                    <ChevronDown className="h-4 w-4 mr-1" /> Expand All
                  </Button>
                  <Button variant="outline" size="sm" onClick={collapseAllDrag} data-testid="button-collapse-all">
                    <ChevronRight className="h-4 w-4 mr-1" /> Collapse All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : hierarchy.length > 0 ? (
                <div
                  className="space-y-0.5 min-h-[200px]"
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={handleDropOnRoot}
                  data-testid="drag-tree-container"
                >
                  {hierarchy.map(acc => renderDragNode(acc))}
                  <div
                    className="border-2 border-dashed border-muted-foreground/20 rounded-md p-3 mt-4 text-center text-sm text-muted-foreground"
                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                    onDrop={handleDropOnRoot}
                    data-testid="drop-root-zone"
                  >
                    Drop here to make top-level account
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No accounts to reorganize. Create accounts first using the "Add Account" button.
                </div>
              )}
              {reparentMutation.isPending && (
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  Moving account...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
