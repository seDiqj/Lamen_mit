import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Pencil, Trash2, Users, Shield, UserCheck, Crown, Lock, Unlock, LayoutDashboard, FileText, BarChart3, AlertTriangle, Activity, Settings, CreditCard, ClipboardList, PiggyBank, ChevronDown, ChevronRight, Building2, UserPlus, Briefcase, Gavel, FileCheck, Banknote, BookOpen, FolderOpen } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UserPermissions {
  [pageName: string]: boolean;
}

interface PageCategory {
  id: string;
  label: string;
  icon: any;
  color: string;
  pages: { id: string; label: string; icon: any }[];
}

const PAGE_CATEGORIES: PageCategory[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "from-blue-500 to-indigo-500",
    pages: [
      { id: "dashboard", label: "Overview Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    pages: [
      { id: "customers", label: "Customer List", icon: Users },
      { id: "customer-registration", label: "Customer Registration", icon: UserPlus },
    ],
  },
  {
    id: "loans",
    label: "Loan Management",
    icon: FileText,
    color: "from-amber-500 to-yellow-500",
    pages: [
      { id: "loans", label: "Loan List", icon: FileText },
      { id: "loan-application", label: "New Loan Application", icon: ClipboardList },
      { id: "fad-review", label: "FAD Review", icon: FileCheck },
      { id: "committee-voting", label: "Committee Voting", icon: Gavel },
      { id: "approvals", label: "Loan Approvals", icon: ClipboardList },
      { id: "disbursements", label: "Disbursements", icon: Banknote },
      { id: "payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    color: "from-purple-500 to-violet-500",
    pages: [
      { id: "reports", label: "General Reports", icon: BarChart3 },
      { id: "par-report", label: "PAR Report", icon: AlertTriangle },
    ],
  },
  {
    id: "settings",
    label: "Settings & Admin",
    icon: Settings,
    color: "from-slate-500 to-gray-500",
    pages: [
      { id: "settings", label: "System Settings", icon: Settings },
      { id: "branches", label: "Branches", icon: Building2 },
      { id: "officers", label: "Finance Officers", icon: Briefcase },
      { id: "funding-sources", label: "Funding Sources", icon: PiggyBank },
      { id: "activity-logs", label: "Activity Logs", icon: Activity },
      { id: "users", label: "User Management", icon: Users },
      { id: "page-permissions", label: "Page Permissions", icon: Shield },
    ],
  },
];

const PAGE_ICONS: Record<string, any> = {
  dashboard: LayoutDashboard,
  customers: Users,
  "customer-registration": UserPlus,
  loans: FileText,
  "loan-application": ClipboardList,
  "fad-review": FileCheck,
  "committee-voting": Gavel,
  reports: BarChart3,
  "par-report": AlertTriangle,
  "activity-logs": Activity,
  settings: Settings,
  payments: CreditCard,
  approvals: ClipboardList,
  disbursements: Banknote,
  branches: Building2,
  officers: Briefcase,
  "funding-sources": PiggyBank,
  users: Users,
  "page-permissions": Shield,
};

const PAGE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  customers: "Customers",
  "customer-registration": "Customer Registration",
  loans: "Loans",
  "loan-application": "Loan Application",
  "fad-review": "FAD Review",
  "committee-voting": "Committee Voting",
  reports: "Reports",
  "par-report": "PAR Report",
  "activity-logs": "Activity Logs",
  settings: "Settings",
  payments: "Payments",
  approvals: "Approvals",
  disbursements: "Disbursements",
  branches: "Branches",
  officers: "Finance Officers",
  "funding-sources": "Funding Sources",
  users: "User Management",
  "page-permissions": "Page Permissions",
};

interface User {
  id: string;
  username: string;
  email: string | null;
  firstName: string;
  lastName: string;
  role: string | null;
  createdAt: string;
}

interface UserFormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [permissionsUser, setPermissionsUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermissions>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
  });

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const res = await apiRequest("POST", "/api/admin/users", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User created successfully" });
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create user", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<UserFormData> }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User updated successfully" });
      setEditUser(null);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update user", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/users/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User deleted successfully" });
      setDeleteUser(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete user", description: error.message, variant: "destructive" });
    },
  });

  const { data: allPages = [] } = useQuery<string[]>({
    queryKey: ["/api/admin/pages"],
    queryFn: async () => {
      const res = await fetch("/api/admin/pages", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const updatePermissionMutation = useMutation({
    mutationFn: async ({ userId, pageName, canAccess }: { userId: string; pageName: string; canAccess: boolean }) => {
      const res = await apiRequest("POST", "/api/admin/permissions", { userId, pageName, canAccess });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Permission updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update permission", description: error.message, variant: "destructive" });
    },
  });

  const openPermissionsDialog = async (user: User) => {
    setPermissionsUser(user);
    try {
      const res = await fetch(`/api/admin/user-permissions/${user.id}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUserPermissions(data.permissions || {});
      } else {
        setUserPermissions({});
      }
    } catch {
      setUserPermissions({});
    }
  };

  const handlePermissionChange = (pageName: string, canAccess: boolean) => {
    if (!permissionsUser) return;
    setUserPermissions(prev => ({ ...prev, [pageName]: canAccess }));
    updatePermissionMutation.mutate({ userId: permissionsUser.id, pageName, canAccess });
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "user",
    });
  };

  const openEditDialog = (user: User) => {
    setFormData({
      username: user.username,
      password: "",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || "",
      role: user.role || "user",
    });
    setEditUser(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser) {
      const updateData: Partial<UserFormData> = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      updateMutation.mutate({ id: editUser.id, data: updateData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getRoleBadgeStyle = (role: string | null) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "manager":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30";
      default:
        return "bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-700 dark:text-slate-400 border-slate-500/30";
    }
  };

  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case "admin":
        return <Crown className="h-3.5 w-3.5 mr-1" />;
      case "manager":
        return <UserCheck className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Users className="h-3.5 w-3.5 mr-1" />;
    }
  };

  const getAvatarGradient = (role: string | null) => {
    switch (role) {
      case "admin":
        return "from-amber-500 to-orange-600";
      case "manager":
        return "from-blue-500 to-cyan-600";
      default:
        return "from-slate-500 to-gray-600";
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">User Management</h1>
            <p className="text-muted-foreground">Manage system users and their access roles</p>
          </div>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-user">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                Create New User
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    data-testid="input-firstname"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    data-testid="input-lastname"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  data-testid="input-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Minimum 6 characters"
                  data-testid="input-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger data-testid="select-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-500" />
                        User
                      </div>
                    </SelectItem>
                    <SelectItem value="manager">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-blue-500" />
                        Manager
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-amber-500" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-create">
                  {createMutation.isPending ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
        <CardHeader className="bg-gradient-to-r from-amber-500/5 to-orange-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              All Users
              <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">
                {users.length}
              </Badge>
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
                data-testid="input-search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground text-lg">No users found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Create your first user to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Username</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/30" data-testid={`row-user-${user.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-background ring-amber-500/20">
                            <AvatarFallback className={`bg-gradient-to-br ${getAvatarGradient(user.role)} text-white font-semibold`}>
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.firstName} {user.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-primary font-medium">{user.username}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`flex items-center w-fit ${getRoleBadgeStyle(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role || "user"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.createdAt ? format(new Date(user.createdAt), "dd-MMM-yyyy") : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {(user.role === "user" || !user.role) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openPermissionsDialog(user)}
                              data-testid={`button-permissions-${user.id}`}
                              title="Manage Page Access"
                            >
                              <Shield className="h-4 w-4 text-purple-500" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(user)}
                            data-testid={`button-edit-${user.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteUser(user)}
                            data-testid={`button-delete-${user.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => { if (!open) { setEditUser(null); resetForm(); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Pencil className="h-4 w-4 text-white" />
              </div>
              Edit User
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name *</Label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  data-testid="input-edit-firstname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name *</Label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  data-testid="input-edit-lastname"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username *</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                data-testid="input-edit-username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-edit-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
                data-testid="input-edit-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger data-testid="select-edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      User
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-500" />
                      Manager
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-500" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} data-testid="button-submit-edit">
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUser} onOpenChange={(open) => { if (!open) setDeleteUser(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Trash2 className="h-4 w-4 text-red-600" />
              </div>
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{deleteUser?.firstName} {deleteUser?.lastName}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUser && deleteMutation.mutate(deleteUser.id)}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Page Permissions Dialog */}
      <Dialog open={!!permissionsUser} onOpenChange={(open) => { if (!open) { setPermissionsUser(null); setExpandedCategories({}); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              Page Access for {permissionsUser?.firstName} {permissionsUser?.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 flex-1 overflow-y-auto">
            <p className="text-sm text-muted-foreground mb-4">
              Expand each category to toggle access to individual pages. Changes are saved automatically.
            </p>
            <div className="space-y-3">
              {PAGE_CATEGORIES.map((category) => {
                const isExpanded = expandedCategories[category.id] === true;
                const CategoryIcon = category.icon;
                const enabledCount = category.pages.filter(p => userPermissions[p.id] === true).length;
                const totalCount = category.pages.length;
                const allEnabled = enabledCount === totalCount;
                const someEnabled = enabledCount > 0 && enabledCount < totalCount;
                
                return (
                  <div key={category.id} className="border rounded-lg overflow-hidden" data-testid={`category-${category.id}`}>
                    <Collapsible 
                      open={isExpanded} 
                      onOpenChange={(open) => setExpandedCategories(prev => ({ ...prev, [category.id]: open }))}
                    >
                      <CollapsibleTrigger asChild>
                        <div className={cn(
                          "flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-muted/50",
                          isExpanded && "border-b"
                        )}>
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                              <CategoryIcon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{category.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {enabledCount} of {totalCount} pages enabled
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={allEnabled ? "default" : someEnabled ? "secondary" : "outline"}
                              className={cn(
                                "text-xs",
                                allEnabled && "bg-green-500 hover:bg-green-600",
                                someEnabled && "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                              )}
                            >
                              {allEnabled ? "Full Access" : someEnabled ? "Partial" : "No Access"}
                            </Badge>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-3 bg-muted/20 space-y-2">
                          <div className="flex justify-end gap-2 mb-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => {
                                category.pages.forEach(page => {
                                  if (!userPermissions[page.id]) {
                                    handlePermissionChange(page.id, true);
                                  }
                                });
                              }}
                              data-testid={`enable-all-${category.id}`}
                            >
                              Enable All
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => {
                                category.pages.forEach(page => {
                                  if (userPermissions[page.id]) {
                                    handlePermissionChange(page.id, false);
                                  }
                                });
                              }}
                              data-testid={`disable-all-${category.id}`}
                            >
                              Disable All
                            </Button>
                          </div>
                          {category.pages.map((page) => {
                            const PageIcon = page.icon;
                            const hasAccess = userPermissions[page.id] === true;
                            
                            return (
                              <div
                                key={page.id}
                                className={cn(
                                  "flex items-center justify-between p-2.5 rounded-lg border transition-colors",
                                  hasAccess 
                                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                                    : "bg-background border-muted"
                                )}
                                data-testid={`permission-toggle-${page.id}`}
                              >
                                <div className="flex items-center gap-2">
                                  <PageIcon className={cn("h-4 w-4", hasAccess ? "text-green-600" : "text-muted-foreground")} />
                                  <span className="text-sm font-medium">{page.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {hasAccess ? (
                                    <Unlock className="h-3.5 w-3.5 text-green-600" />
                                  ) : (
                                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                  )}
                                  <Switch
                                    checked={hasAccess}
                                    onCheckedChange={(checked) => handlePermissionChange(page.id, checked)}
                                    disabled={updatePermissionMutation.isPending}
                                    data-testid={`switch-${page.id}`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionsUser(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
