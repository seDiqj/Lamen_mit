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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Search, Plus, Pencil, Trash2, Users, Shield, UserCheck, Crown } from "lucide-react";
import { format } from "date-fns";

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
                        {user.createdAt ? format(new Date(user.createdAt), "MMM dd, yyyy") : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
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
    </div>
  );
}
