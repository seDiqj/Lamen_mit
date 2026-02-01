import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  UserCheck,
  ClipboardList,
  Activity,
  PiggyBank,
} from "lucide-react";

type UserRoleData = {
  role: "user" | "manager" | "admin";
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const { data: roleData } = useQuery<UserRoleData>({
    queryKey: ["/api/user/role"],
  });

  const role = roleData?.role || "user";

  const userMenuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "My Loans", url: "/loans", icon: FileText },
    { title: "Payments", url: "/payments", icon: CreditCard },
  ];

  const managerMenuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Loans", url: "/loans", icon: FileText },
    { title: "Customers", url: "/customers", icon: Users },
    { title: "Approvals", url: "/approvals", icon: ClipboardList },
    { title: "Disbursements", url: "/disbursements", icon: PiggyBank },
    { title: "Payments", url: "/payments", icon: CreditCard },
    { title: "Reports", url: "/reports", icon: BarChart3 },
  ];

  const adminMenuItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Loans", url: "/loans", icon: FileText },
    { title: "Customers", url: "/customers", icon: Users },
    { title: "Approvals", url: "/approvals", icon: ClipboardList },
    { title: "Disbursements", url: "/disbursements", icon: PiggyBank },
    { title: "Payments", url: "/payments", icon: CreditCard },
    { title: "Branches", url: "/branches", icon: Building2 },
    { title: "Officers", url: "/officers", icon: UserCheck },
    { title: "Reports", url: "/reports", icon: BarChart3 },
    { title: "Activity Log", url: "/activity", icon: Activity },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const menuItems = role === "admin" ? adminMenuItems : role === "manager" ? managerMenuItems : userMenuItems;

  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.jpeg" 
            alt="Lamen Microfinance" 
            className="h-10 w-auto"
            data-testid="img-sidebar-logo"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Lamen</span>
            <span className="text-xs text-muted-foreground">Microfinance</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "admin" ? "Administration" : role === "manager" ? "Management" : "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.email || "User"}
            </div>
            <div className="text-xs text-muted-foreground capitalize">{role}</div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => logout()}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
