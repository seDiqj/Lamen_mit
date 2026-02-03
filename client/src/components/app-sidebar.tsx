import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { usePagePermissions } from "@/hooks/use-page-permissions";
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
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  FileText,
  FilePlus,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  UserCheck,
  ClipboardList,
  Activity,
  PiggyBank,
  Shield,
  ChevronDown,
  Wallet,
  AlertTriangle,
  FileSearch,
  Vote,
  BookOpen,
  Receipt,
  FileSpreadsheet,
  Scale,
  TrendingUp,
  Layers,
} from "lucide-react";
import lamenLogo from "@assets/LamenLogo_1769936371528.jpeg";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

type UserRoleData = {
  role: "user" | "fad" | "risk_compliance" | "cfo" | "coo" | "ceo" | "sharia" | "manager" | "admin";
};

type MenuItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: string;
  iconColor?: string;
};

type MenuGroup = {
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
  defaultOpen?: boolean;
};

const PAGE_URL_TO_NAME: Record<string, string> = {
  "/": "dashboard",
  "/customers": "customers",
  "/customer-registration": "customer-registration",
  "/loans": "loans",
  "/loan-application": "loan-application",
  "/reports": "reports",
  "/par-report": "par-report",
  "/activity": "activity-logs",
  "/settings": "settings",
  "/payments": "payments",
  "/disbursements": "disbursements",
  "/branches": "branches",
  "/officers": "officers",
  "/users": "users",
  "/page-permissions": "page-permissions",
  "/funding-sources": "funding-sources",
  "/lookup": "lookup",
  "/fad-review": "fad-review",
  "/risk-compliance": "risk-compliance",
  "/committee-voting": "committee-voting",
  "/chart-of-accounts": "chart-of-accounts",
  "/journal-entries": "journal-entries",
  "/account-statement": "account-statement",
  "/trial-balance": "trial-balance",
  "/income-statement": "income-statement",
  "/balance-sheet": "balance-sheet",
};

export function AppSidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>(["Dashboard", "Financing Operations", "Management"]);
  const { hasAccess, isAdminOrManager } = usePagePermissions();

  const { data: roleData } = useQuery<UserRoleData>({
    queryKey: ["/api/user/role"],
  });

  const role = roleData?.role || "user";

  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    if (isAdminOrManager) return items;
    return items.filter(item => {
      const pageName = PAGE_URL_TO_NAME[item.url];
      if (!pageName) return true;
      return hasAccess(pageName);
    });
  };

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => 
      prev.includes(label) 
        ? prev.filter(g => g !== label)
        : [...prev, label]
    );
  };

  const userMenuGroups: MenuGroup[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      defaultOpen: true,
      items: [
        { title: "Overview", url: "/", icon: LayoutDashboard, iconColor: "text-blue-500" },
      ],
    },
    {
      label: "Management",
      icon: Building2,
      items: [
        { title: "Branches", url: "/branches", icon: Building2, iconColor: "text-teal-500" },
        { title: "Officers", url: "/officers", icon: UserCheck, iconColor: "text-indigo-500" },
        { title: "Funding Sources", url: "/funding-sources", icon: Wallet, iconColor: "text-amber-500" },
        { title: "Lookup", url: "/lookup", icon: Layers, iconColor: "text-emerald-500" },
      ],
    },
    {
      label: "Financing Operations",
      icon: FileText,
      items: [
        { title: "New Financing", url: "/loan-application", icon: FilePlus, iconColor: "text-green-600" },
        { title: "All Financings", url: "/loans", icon: FileText, iconColor: "text-emerald-500" },
        { title: "Customers", url: "/customers", icon: Users, iconColor: "text-violet-500" },
        { title: "FAD Review", url: "/fad-review", icon: FileSearch, iconColor: "text-blue-500" },
        { title: "Risk Compliance", url: "/risk-compliance", icon: Shield, iconColor: "text-red-500" },
        { title: "Committee Voting", url: "/committee-voting", icon: Vote, iconColor: "text-purple-500" },
        { title: "Disbursements", url: "/disbursements", icon: PiggyBank, iconColor: "text-pink-500" },
        { title: "Payments", url: "/payments", icon: CreditCard, iconColor: "text-cyan-500" },
      ],
    },
    {
      label: "Accounting",
      icon: BookOpen,
      items: [
        { title: "Chart of Accounts", url: "/chart-of-accounts", icon: BookOpen, iconColor: "text-emerald-500" },
        { title: "Journal Entries", url: "/journal-entries", icon: Receipt, iconColor: "text-blue-500" },
        { title: "Account Statement", url: "/account-statement", icon: FileSpreadsheet, iconColor: "text-violet-500" },
        { title: "Trial Balance", url: "/trial-balance", icon: Scale, iconColor: "text-amber-500" },
        { title: "Income Statement", url: "/income-statement", icon: TrendingUp, iconColor: "text-green-500" },
        { title: "Balance Sheet", url: "/balance-sheet", icon: FileText, iconColor: "text-cyan-500" },
      ],
    },
    {
      label: "Reports",
      icon: BarChart3,
      items: [
        { title: "Analytics", url: "/reports", icon: BarChart3, iconColor: "text-amber-500" },
        { title: "PAR Report", url: "/par-report", icon: AlertTriangle, iconColor: "text-red-500" },
      ],
    },
  ];

  const managerMenuGroups: MenuGroup[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      defaultOpen: true,
      items: [
        { title: "Overview", url: "/", icon: LayoutDashboard, iconColor: "text-blue-500" },
      ],
    },
    {
      label: "Management",
      icon: Building2,
      items: [
        { title: "Branches", url: "/branches", icon: Building2, iconColor: "text-teal-500" },
        { title: "Officers", url: "/officers", icon: UserCheck, iconColor: "text-indigo-500" },
        { title: "Funding Sources", url: "/funding-sources", icon: Wallet, iconColor: "text-amber-500" },
        { title: "Lookup", url: "/lookup", icon: Layers, iconColor: "text-emerald-500" },
      ],
    },
    {
      label: "Financing Operations",
      icon: FileText,
      items: [
        { title: "New Financing", url: "/loan-application", icon: FilePlus, iconColor: "text-green-600" },
        { title: "All Financings", url: "/loans", icon: FileText, iconColor: "text-emerald-500" },
        { title: "Customers", url: "/customers", icon: Users, iconColor: "text-violet-500" },
        { title: "Disbursements", url: "/disbursements", icon: PiggyBank, iconColor: "text-pink-500" },
        { title: "Payments", url: "/payments", icon: CreditCard, iconColor: "text-cyan-500" },
      ],
    },
    {
      label: "Accounting",
      icon: BookOpen,
      items: [
        { title: "Chart of Accounts", url: "/chart-of-accounts", icon: BookOpen, iconColor: "text-emerald-500" },
        { title: "Journal Entries", url: "/journal-entries", icon: Receipt, iconColor: "text-blue-500" },
        { title: "Account Statement", url: "/account-statement", icon: FileSpreadsheet, iconColor: "text-violet-500" },
        { title: "Trial Balance", url: "/trial-balance", icon: Scale, iconColor: "text-amber-500" },
        { title: "Income Statement", url: "/income-statement", icon: TrendingUp, iconColor: "text-green-500" },
        { title: "Balance Sheet", url: "/balance-sheet", icon: FileText, iconColor: "text-cyan-500" },
      ],
    },
    {
      label: "Reports",
      icon: BarChart3,
      items: [
        { title: "Analytics", url: "/reports", icon: BarChart3, iconColor: "text-amber-500" },
      ],
    },
  ];

  const adminMenuGroups: MenuGroup[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      defaultOpen: true,
      items: [
        { title: "Overview", url: "/", icon: LayoutDashboard, iconColor: "text-blue-500" },
      ],
    },
    {
      label: "Management",
      icon: Building2,
      items: [
        { title: "Branches", url: "/branches", icon: Building2, iconColor: "text-teal-500" },
        { title: "Officers", url: "/officers", icon: UserCheck, iconColor: "text-indigo-500" },
        { title: "Funding Sources", url: "/funding-sources", icon: Wallet, iconColor: "text-amber-500" },
        { title: "Lookup", url: "/lookup", icon: Layers, iconColor: "text-emerald-500" },
        { title: "Users", url: "/users", icon: Shield, iconColor: "text-red-500" },
      ],
    },
    {
      label: "Financing Operations",
      icon: FileText,
      items: [
        { title: "New Financing", url: "/loan-application", icon: FilePlus, iconColor: "text-green-600" },
        { title: "All Financings", url: "/loans", icon: FileText, iconColor: "text-emerald-500" },
        { title: "Customers", url: "/customers", icon: Users, iconColor: "text-violet-500" },
        { title: "FAD Review", url: "/fad-review", icon: FileSearch, iconColor: "text-blue-500" },
        { title: "Risk Compliance", url: "/risk-compliance", icon: Shield, iconColor: "text-red-500" },
        { title: "Committee Voting", url: "/committee-voting", icon: Vote, iconColor: "text-purple-500" },
        { title: "Disbursements", url: "/disbursements", icon: PiggyBank, iconColor: "text-pink-500" },
        { title: "Payments", url: "/payments", icon: CreditCard, iconColor: "text-cyan-500" },
      ],
    },
    {
      label: "Accounting",
      icon: BookOpen,
      items: [
        { title: "Chart of Accounts", url: "/chart-of-accounts", icon: BookOpen, iconColor: "text-emerald-500" },
        { title: "Journal Entries", url: "/journal-entries", icon: Receipt, iconColor: "text-blue-500" },
        { title: "Account Statement", url: "/account-statement", icon: FileSpreadsheet, iconColor: "text-violet-500" },
        { title: "Trial Balance", url: "/trial-balance", icon: Scale, iconColor: "text-amber-500" },
        { title: "Income Statement", url: "/income-statement", icon: TrendingUp, iconColor: "text-green-500" },
        { title: "Balance Sheet", url: "/balance-sheet", icon: FileText, iconColor: "text-cyan-500" },
      ],
    },
    {
      label: "Reports & Logs",
      icon: BarChart3,
      items: [
        { title: "Analytics", url: "/reports", icon: BarChart3, iconColor: "text-amber-500" },
        { title: "PAR Report", url: "/par-report", icon: AlertTriangle, iconColor: "text-red-500" },
        { title: "Activity Log", url: "/activity", icon: Activity, iconColor: "text-lime-500" },
      ],
    },
    {
      label: "Settings",
      icon: Settings,
      items: [
        { title: "System Settings", url: "/settings", icon: Settings, iconColor: "text-slate-400" },
      ],
    },
  ];

  const menuGroups = role === "admin" ? adminMenuGroups : role === "manager" ? managerMenuGroups : userMenuGroups;

  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  const isActiveRoute = (url: string) => {
    if (url === "/") return location === "/";
    return location.startsWith(url);
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-sm opacity-60" />
            <img 
              src={lamenLogo}
              alt="Lamen Microfinance" 
              className="h-11 w-11 rounded-full object-cover relative z-10 border-2 border-amber-400/50"
              data-testid="img-sidebar-logo"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">Lamen</span>
            <span className="text-xs text-sidebar-foreground/70">Microfinance Institution</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {menuGroups.filter(group => filterMenuItems(group.items).length > 0).map((group) => (
          <Collapsible
            key={group.label}
            open={openGroups.includes(group.label)}
            onOpenChange={() => toggleGroup(group.label)}
            className="mb-1"
          >
            <SidebarGroup className="p-0">
              <CollapsibleTrigger className="w-full" data-testid={`nav-group-${group.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/80 hover-elevate transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
                      <group.icon className="h-3.5 w-3.5 text-amber-400" />
                    </div>
                    <span>{group.label}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-sidebar-foreground/50 transition-transform ${openGroups.includes(group.label) ? 'rotate-180' : ''}`} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent className="pl-4 pt-1">
                  <SidebarMenu>
                    {filterMenuItems(group.items).map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActiveRoute(item.url)}
                          className={`relative ${isActiveRoute(item.url) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Link href={item.url}>
                            <item.icon className={`h-4 w-4 ${item.iconColor || 'text-muted-foreground'}`} />
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge className="ml-auto h-5 min-w-5 px-1.5 bg-amber-500 text-amber-950 text-xs font-semibold">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-sidebar-accent to-sidebar-accent/50">
          <Avatar className="h-10 w-10 ring-2 ring-amber-500/30">
            <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-amber-950 font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-sidebar-foreground">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.email || "User"}
            </div>
            <Badge className="mt-0.5 h-5 px-2 text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              // Use direct navigation to the logout endpoint which will redirect
              window.location.href = "/api/logout-redirect";
            }}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
