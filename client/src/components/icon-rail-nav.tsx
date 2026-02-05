import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { usePagePermissions } from "@/hooks/use-page-permissions";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  Activity,
  PiggyBank,
  Shield,
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
  UserPlus,
  CalendarCheck,
  CalendarDays,
  Briefcase,
  Network,
  X,
  ChevronRight,
  Banknote,
  Target,
  GraduationCap,
  Heart,
} from "lucide-react";
import lamenLogo from "@assets/LamenLogo_1769936371528.jpeg";

type UserRoleData = {
  role: "user" | "fad" | "risk_compliance" | "cfo" | "coo" | "ceo" | "sharia" | "manager" | "admin";
};

type MenuItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  iconColor?: string;
};

type Module = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  items: MenuItem[];
};

const PAGE_URL_TO_NAME: Record<string, string> = {
  "/": "dashboard",
  "/admin-dashboard": "admin-dashboard",
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
  "/par-categories": "par-categories",
  "/fad-review": "fad-review",
  "/risk-compliance": "risk-compliance",
  "/committee-voting": "committee-voting",
  "/chart-of-accounts": "chart-of-accounts",
  "/journal-entries": "journal-entries",
  "/account-statement": "account-statement",
  "/trial-balance": "trial-balance",
  "/income-statement": "income-statement",
  "/balance-sheet": "balance-sheet",
  "/accounting-dashboard": "accounting-dashboard",
  "/hr/dashboard": "hr-dashboard",
  "/hr/org-structure": "hr-org-structure",
  "/hr/employees": "hr-employees",
  "/hr/employees/new": "hr-employees-new",
  "/hr/departments": "hr-departments",
  "/hr/positions": "hr-positions",
  "/hr/attendance": "hr-attendance",
  "/hr/leave-types": "hr-leave-types",
  "/hr/leave-requests": "hr-leave-requests",
  "/hr/holidays": "hr-holidays",
  "/hr/payroll": "hr-payroll",
  "/hr/recruitment": "hr-recruitment",
  "/hr/performance": "hr-performance",
  "/hr/training": "hr-training",
  "/hr/benefits": "hr-benefits",
};

interface IconRailNavProps {
  children?: React.ReactNode;
}

export function IconRailNav({ children }: IconRailNavProps) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(event.target as Node)) {
        const iconRail = document.getElementById('icon-rail');
        if (iconRail && !iconRail.contains(event.target as Node)) {
          setActiveModule(null);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveModule(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const modules: Module[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "text-blue-500",
      bgColor: "from-blue-500 to-blue-600",
      items: [
        { title: "Overview", url: "/", icon: LayoutDashboard, iconColor: "text-blue-500" },
        { title: "Admin Dashboard", url: "/admin-dashboard", icon: Users, iconColor: "text-indigo-500" },
      ],
    },
    {
      id: "financing",
      label: "Financing",
      icon: FileText,
      color: "text-emerald-500",
      bgColor: "from-emerald-500 to-green-600",
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
      id: "accounting",
      label: "Accounting",
      icon: BookOpen,
      color: "text-purple-500",
      bgColor: "from-purple-500 to-violet-600",
      items: [
        { title: "Accounting Dashboard", url: "/accounting-dashboard", icon: LayoutDashboard, iconColor: "text-purple-500" },
        { title: "Chart of Accounts", url: "/chart-of-accounts", icon: BookOpen, iconColor: "text-emerald-500" },
        { title: "Journal Entries", url: "/journal-entries", icon: Receipt, iconColor: "text-blue-500" },
        { title: "Account Statement", url: "/account-statement", icon: FileSpreadsheet, iconColor: "text-violet-500" },
        { title: "Trial Balance", url: "/trial-balance", icon: Scale, iconColor: "text-amber-500" },
        { title: "Income Statement", url: "/income-statement", icon: TrendingUp, iconColor: "text-green-500" },
        { title: "Balance Sheet", url: "/balance-sheet", icon: FileText, iconColor: "text-cyan-500" },
      ],
    },
    {
      id: "hr",
      label: "Human Resources",
      icon: Users,
      color: "text-teal-500",
      bgColor: "from-teal-500 to-cyan-600",
      items: [
        { title: "HR Dashboard", url: "/hr/dashboard", icon: LayoutDashboard, iconColor: "text-emerald-500" },
        { title: "Org Structure", url: "/hr/org-structure", icon: Network, iconColor: "text-indigo-500" },
        { title: "Employees", url: "/hr/employees", icon: Users, iconColor: "text-blue-500" },
        { title: "Add Employee", url: "/hr/employees/new", icon: UserPlus, iconColor: "text-green-500" },
        { title: "Departments", url: "/hr/departments", icon: Building2, iconColor: "text-violet-500" },
        { title: "Positions", url: "/hr/positions", icon: Briefcase, iconColor: "text-amber-500" },
        { title: "Payroll", url: "/hr/payroll", icon: Banknote, iconColor: "text-green-600" },
        { title: "Recruitment", url: "/hr/recruitment", icon: UserPlus, iconColor: "text-purple-500" },
        { title: "Performance", url: "/hr/performance", icon: Target, iconColor: "text-orange-500" },
        { title: "Training", url: "/hr/training", icon: GraduationCap, iconColor: "text-cyan-500" },
        { title: "Benefits", url: "/hr/benefits", icon: Heart, iconColor: "text-red-500" },
        { title: "Attendance", url: "/hr/attendance", icon: CalendarCheck, iconColor: "text-teal-500" },
        { title: "Leave Types", url: "/hr/leave-types", icon: CalendarDays, iconColor: "text-pink-500" },
        { title: "Leave Requests", url: "/hr/leave-requests", icon: FileText, iconColor: "text-orange-500" },
        { title: "Holidays", url: "/hr/holidays", icon: CalendarDays, iconColor: "text-red-500" },
      ],
    },
    {
      id: "management",
      label: "Management",
      icon: Building2,
      color: "text-amber-500",
      bgColor: "from-amber-500 to-orange-600",
      items: [
        { title: "Branches", url: "/branches", icon: Building2, iconColor: "text-teal-500" },
        { title: "Officers", url: "/officers", icon: UserCheck, iconColor: "text-indigo-500" },
        { title: "Funding Sources", url: "/funding-sources", icon: Wallet, iconColor: "text-amber-500" },
        { title: "Lookup", url: "/lookup", icon: Layers, iconColor: "text-emerald-500" },
        { title: "PAR Categories", url: "/par-categories", icon: AlertTriangle, iconColor: "text-amber-500" },
        ...(role === "admin" ? [{ title: "Users", url: "/users", icon: Shield, iconColor: "text-red-500" }] : []),
      ],
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      color: "text-orange-500",
      bgColor: "from-orange-500 to-red-500",
      items: [
        { title: "Analytics", url: "/reports", icon: BarChart3, iconColor: "text-amber-500" },
        { title: "PAR Report", url: "/par-report", icon: AlertTriangle, iconColor: "text-red-500" },
        { title: "Activity Log", url: "/activity", icon: Activity, iconColor: "text-lime-500" },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: "text-slate-400",
      bgColor: "from-slate-500 to-slate-600",
      items: [
        { title: "System Settings", url: "/settings", icon: Settings, iconColor: "text-slate-400" },
      ],
    },
  ];

  const visibleModules = modules.filter(module => filterMenuItems(module.items).length > 0);

  const isActiveRoute = (url: string) => {
    if (url === "/") return location === "/";
    return location.startsWith(url);
  };

  const getActiveModuleForRoute = () => {
    for (const module of modules) {
      for (const item of module.items) {
        if (isActiveRoute(item.url)) {
          return module.id;
        }
      }
    }
    return null;
  };

  const currentActiveModule = getActiveModuleForRoute();

  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  const handleModuleClick = (moduleId: string) => {
    if (activeModule === moduleId) {
      setActiveModule(null);
    } else {
      setActiveModule(moduleId);
    }
  };

  const handleItemClick = (url: string) => {
    setLocation(url);
    setActiveModule(null);
  };

  const activeModuleData = visibleModules.find(m => m.id === activeModule);

  return (
    <>
      {/* Icon Rail */}
      <div 
        id="icon-rail"
        className="w-[72px] h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center py-4 border-r border-slate-800 flex-shrink-0"
      >
        {/* Logo */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-sm opacity-60" />
            <img 
              src={lamenLogo}
              alt="Lamen" 
              className="h-12 w-12 rounded-full object-cover relative z-10 border-2 border-amber-400/50"
              data-testid="img-nav-logo"
            />
          </div>
        </div>

        {/* Module Icons */}
        <div className="flex-1 flex flex-col gap-2 w-full px-2">
          {visibleModules.map((module) => {
            const isActive = currentActiveModule === module.id;
            const isOpen = activeModule === module.id;
            
            return (
              <button
                key={module.id}
                onClick={() => handleModuleClick(module.id)}
                aria-label={`${module.label} module`}
                aria-expanded={isOpen}
                className={cn(
                  "relative w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200",
                  isOpen
                    ? `bg-gradient-to-br ${module.bgColor} text-white shadow-lg scale-105`
                    : isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
                data-testid={`nav-module-${module.id}`}
              >
                <module.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">{module.label.split(' ')[0]}</span>
                {isActive && !isOpen && (
                  <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b", module.bgColor)} />
                )}
              </button>
            );
          })}
        </div>

        {/* User Avatar at Bottom */}
        <div className="mt-auto pt-4 border-t border-slate-800 w-full px-2">
          <button
            onClick={() => window.location.href = "/api/logout-redirect"}
            aria-label="Logout"
            className="w-full flex flex-col items-center gap-2 py-2 text-slate-400 hover:text-white transition-colors"
            data-testid="button-logout"
          >
            <Avatar className="h-10 w-10 ring-2 ring-amber-500/30">
              <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-amber-950 font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Flyout Panel */}
      {activeModule && activeModuleData && (
        <div
          ref={flyoutRef}
          role="menu"
          aria-label={`${activeModuleData.label} navigation menu`}
          className="fixed left-[72px] top-0 h-screen w-64 bg-background border-r shadow-xl animate-in slide-in-from-left-2 duration-200 z-50"
        >
          {/* Flyout Header */}
          <div className={cn("p-4 border-b bg-gradient-to-r", activeModuleData.bgColor)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <activeModuleData.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">{activeModuleData.label}</h2>
                  <p className="text-xs text-white/70">{filterMenuItems(activeModuleData.items).length} items</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveModule(null)}
                className="text-white/70 hover:text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Flyout Items */}
          <div className="p-2 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto">
            {filterMenuItems(activeModuleData.items).map((item) => (
              <button
                key={item.url}
                role="menuitem"
                onClick={() => handleItemClick(item.url)}
                aria-label={`Navigate to ${item.title}`}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  isActiveRoute(item.url)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground/80 hover:bg-muted"
                )}
                data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center",
                  isActiveRoute(item.url) ? "bg-primary/20" : "bg-muted"
                )}>
                  <item.icon className={cn("h-4 w-4", item.iconColor || "text-muted-foreground")} />
                </div>
                <span className="flex-1 text-left">{item.title}</span>
                {isActiveRoute(item.url) && (
                  <ChevronRight className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>

          {/* User Info at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t bg-muted/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-amber-950 text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email || "User"}
                </p>
                <Badge variant="secondary" className="text-xs h-5 mt-0.5">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
