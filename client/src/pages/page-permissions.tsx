import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Shield, Users, Lock, Unlock, LayoutDashboard, UserCircle, FileText, BarChart3, AlertTriangle, Activity, Settings } from "lucide-react";

interface UserWithPermissions {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string | null;
  permissions: Record<string, boolean>;
}

const PAGE_ICONS: Record<string, any> = {
  dashboard: LayoutDashboard,
  customers: UserCircle,
  loans: FileText,
  reports: BarChart3,
  "par-report": AlertTriangle,
  "activity-logs": Activity,
  settings: Settings,
};

const PAGE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  customers: "Customers",
  loans: "Loans",
  reports: "Reports",
  "par-report": "PAR Report",
  "activity-logs": "Activity Logs",
  settings: "Settings",
};

export default function PagePermissionsPage() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { data: usersWithPermissions = [], isLoading } = useQuery<UserWithPermissions[]>({
    queryKey: ["/api/admin/users-permissions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users-permissions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const { data: allPages = [] } = useQuery<string[]>({
    queryKey: ["/api/admin/pages"],
    queryFn: async () => {
      const res = await fetch("/api/admin/pages", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch pages");
      return res.json();
    },
  });

  const updatePermissionMutation = useMutation({
    mutationFn: async ({ userId, pageName, canAccess }: { userId: string; pageName: string; canAccess: boolean }) => {
      const res = await apiRequest("POST", "/api/admin/permissions", { userId, pageName, canAccess });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users-permissions"] });
      toast({ title: "Permission updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update permission", description: error.message, variant: "destructive" });
    },
  });

  const handlePermissionChange = (userId: string, pageName: string, canAccess: boolean) => {
    updatePermissionMutation.mutate({ userId, pageName, canAccess });
  };

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>;
      case "manager":
        return <Badge className="bg-blue-500">Manager</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  const regularUsers = usersWithPermissions.filter(u => u.role === "user" || !u.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-permissions-title">
          <Shield className="h-6 w-6 text-primary" />
          Page Permissions
        </h1>
        <p className="text-muted-foreground">
          Control which pages each user can access. Admins and Managers have full access by default.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      ) : regularUsers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Regular Users</h3>
            <p className="text-muted-foreground">
              Only regular users need page permissions. Admins and Managers have full access.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {regularUsers.map((user) => (
            <Card key={user.id} data-testid={`card-user-permissions-${user.id}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        @{user.username}
                        {getRoleBadge(user.role)}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allPages.map((pageName) => {
                    const IconComponent = PAGE_ICONS[pageName] || FileText;
                    const hasAccess = user.permissions[pageName] === true;
                    
                    return (
                      <div
                        key={pageName}
                        className={`p-4 rounded-lg border transition-colors ${
                          hasAccess 
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                            : "bg-muted/30 border-muted"
                        }`}
                        data-testid={`permission-${user.id}-${pageName}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <IconComponent className={`h-5 w-5 ${hasAccess ? "text-green-600" : "text-muted-foreground"}`} />
                          {hasAccess ? (
                            <Unlock className="h-4 w-4 text-green-600" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <Label className="text-sm font-medium block mb-2">
                          {PAGE_LABELS[pageName] || pageName}
                        </Label>
                        <Switch
                          checked={hasAccess}
                          onCheckedChange={(checked) => handlePermissionChange(user.id, pageName, checked)}
                          disabled={updatePermissionMutation.isPending}
                          data-testid={`switch-${user.id}-${pageName}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card for Admins/Managers */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Admin &amp; Manager Access
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                Users with Admin or Manager roles automatically have access to all pages. 
                Page permissions only apply to users with the "User" role.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
