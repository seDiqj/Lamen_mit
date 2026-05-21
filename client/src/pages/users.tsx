import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Search, Plus, Pencil, Trash2, Users, Shield, UserCheck, UserX, Crown, Lock, Unlock, LayoutDashboard, FileText, BarChart3, AlertTriangle, Activity, Settings, CreditCard, ClipboardList, PiggyBank, ChevronDown, ChevronRight, Building2, UserPlus, Briefcase, Gavel, FileCheck, Banknote, Vote, BookOpen, FolderOpen, Layers, Receipt, Scale, FileSpreadsheet, UserCog, Network, Calendar, Clock, Plane, CalendarOff, GitBranch, Check, ChevronsUpDown, Package, ArrowLeftRight, CheckSquare, TrendingUp, DollarSign, Target, ListChecks, Wallet, PieChart, Landmark, GraduationCap, Award, Heart, LineChart } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { format } from "date-fns";
import { PasswordStrength } from "@/components/password-strength";
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
      { id: "admin-dashboard", label: "Admin Dashboard", icon: TrendingUp },
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
    label: "Financing Management",
    icon: FileText,
    color: "from-amber-500 to-yellow-500",
    pages: [
      { id: "loans", label: "Financing List", icon: FileText },
      { id: "loan-application", label: "New Financing Application", icon: ClipboardList },
      { id: "financing-products", label: "Financing Products", icon: Package },
      { id: "fad-review", label: "FAD Review", icon: FileCheck },
      { id: "risk-compliance", label: "Risk Compliance", icon: Shield },
      { id: "committee-voting", label: "Committee Voting", icon: Gavel },
      { id: "approvals", label: "Financing Approvals", icon: ClipboardList },
      { id: "disbursements", label: "Disbursements", icon: Banknote },
      { id: "payments", label: "Payments", icon: CreditCard },
      { id: "collections", label: "Collections", icon: Wallet },
      { id: "collection-approvals", label: "Collection Approvals", icon: CheckSquare },
      { id: "installment-management", label: "Installment Management", icon: ListChecks },
      { id: "loan-transfers", label: "Loan Transfers", icon: ArrowLeftRight },
      { id: "loan-classification", label: "Loan Classification", icon: Target },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    color: "from-purple-500 to-violet-500",
    pages: [
      { id: "reports", label: "Analytics", icon: BarChart3 },
      { id: "citizen-balance-statement", label: "Balance Statement", icon: FileSpreadsheet },
      { id: "loan-disbursement-report", label: "Loan Disbursement Report", icon: Banknote },
      { id: "par-report", label: "PAR Report", icon: AlertTriangle },
      { id: "collection-report", label: "Collection Report", icon: Receipt },
      { id: "approval-rejection-report", label: "Approval & Rejection Report", icon: Vote },
      { id: "shareholder-report", label: "Shareholder Report", icon: PieChart },
      { id: "custom-reports", label: "Custom Reports", icon: ListChecks },
      { id: "activity-logs", label: "Activity Log", icon: Activity },
      { id: "dab-report", label: "DAB Regulatory Report", icon: Landmark },
      { id: "accounting-dashboard", label: "Accounting Dashboard", icon: PieChart },
      { id: "profitability-analysis", label: "Profitability Analysis", icon: LineChart },
    ],
  },
  {
    id: "management",
    label: "Management",
    icon: Layers,
    color: "from-teal-500 to-cyan-500",
    pages: [
      { id: "branches", label: "Branches", icon: Building2 },
      { id: "officers", label: "Finance Officers", icon: Briefcase },
      { id: "funding-sources", label: "Funding Sources", icon: PiggyBank },
      { id: "lookup", label: "Lookup Tables", icon: Layers },
      { id: "par-categories", label: "PAR Categories", icon: Target },
      { id: "disbursement-targets", label: "Disbursement Targets", icon: DollarSign },
    ],
  },
  {
    id: "hr",
    label: "Human Resources",
    icon: UserCog,
    color: "from-pink-500 to-rose-500",
    pages: [
      { id: "hr-dashboard", label: "HR Dashboard", icon: LayoutDashboard },
      { id: "hr-employees", label: "Employees", icon: Users },
      { id: "hr-departments", label: "Departments", icon: Building2 },
      { id: "hr-positions", label: "Positions", icon: Briefcase },
      { id: "hr-org-structure", label: "Org Structure", icon: GitBranch },
      { id: "hr-attendance", label: "Attendance", icon: Clock },
      { id: "hr-leave-types", label: "Leave Types", icon: CalendarOff },
      { id: "hr-leave-requests", label: "Leave Requests", icon: Plane },
      { id: "hr-holidays", label: "Holidays", icon: Calendar },
      { id: "hr-payroll", label: "Payroll", icon: DollarSign },
      { id: "hr-recruitment", label: "Recruitment", icon: UserPlus },
      { id: "hr-performance", label: "Performance", icon: Award },
      { id: "hr-training", label: "Training", icon: GraduationCap },
      { id: "hr-benefits", label: "Benefits", icon: Heart },
    ],
  },
  {
    id: "accounting",
    label: "Accounting",
    icon: BookOpen,
    color: "from-emerald-500 to-green-500",
    pages: [
      { id: "chart-of-accounts", label: "Chart of Accounts", icon: BookOpen },
      { id: "classes", label: "Classes", icon: Layers },
      { id: "journal-entries", label: "Journal Entries", icon: Receipt },
      { id: "account-statement", label: "Account Statement", icon: FileSpreadsheet },
      { id: "trial-balance", label: "Trial Balance", icon: Scale },
      { id: "income-statement", label: "Income Statement", icon: BarChart3 },
      { id: "balance-sheet", label: "Balance Sheet", icon: FileSpreadsheet },
      { id: "cash-flow-statement", label: "Cash Flow Statement", icon: TrendingUp },
    ],
  },
  {
    id: "settings",
    label: "Settings & Admin",
    icon: Settings,
    color: "from-slate-500 to-gray-500",
    pages: [
      { id: "settings", label: "System Settings", icon: Settings },
      { id: "activity-logs", label: "Activity Logs", icon: Activity },
      { id: "users", label: "User Management", icon: Users },
      { id: "page-permissions", label: "Page Permissions", icon: Shield },
    ],
  },
];

const PAGE_ICONS: Record<string, any> = {
  dashboard: LayoutDashboard,
  "admin-dashboard": TrendingUp,
  customers: Users,
  "customer-registration": UserPlus,
  loans: FileText,
  "loan-application": ClipboardList,
  "financing-products": Package,
  "fad-review": FileCheck,
  "risk-compliance": Shield,
  "committee-voting": Gavel,
  reports: BarChart3,
  "par-report": AlertTriangle,
  "citizen-balance-statement": FileSpreadsheet,
  "loan-disbursement-report": Banknote,
  "shareholder-report": PieChart,
  "custom-reports": ListChecks,
  "dab-report": Landmark,
  "accounting-dashboard": PieChart,
  "profitability-analysis": LineChart,
  "activity-logs": Activity,
  settings: Settings,
  payments: CreditCard,
  collections: Wallet,
  "collection-approvals": CheckSquare,
  "installment-management": ListChecks,
  "loan-transfers": ArrowLeftRight,
  "loan-classification": Target,
  approvals: ClipboardList,
  disbursements: Banknote,
  branches: Building2,
  officers: Briefcase,
  "funding-sources": PiggyBank,
  lookup: Layers,
  "par-categories": Target,
  "disbursement-targets": DollarSign,
  users: Users,
  "page-permissions": Shield,
  "chart-of-accounts": BookOpen,
  "classes": Layers,
  "collection-report": Receipt,
  "approval-rejection-report": Vote,
  "journal-entries": Receipt,
  "account-statement": FileSpreadsheet,
  "trial-balance": Scale,
  "income-statement": BarChart3,
  "balance-sheet": FileSpreadsheet,
  "cash-flow-statement": TrendingUp,
  "hr-dashboard": LayoutDashboard,
  "hr-employees": Users,
  "hr-departments": Building2,
  "hr-positions": Briefcase,
  "hr-org-structure": GitBranch,
  "hr-attendance": Clock,
  "hr-leave-types": CalendarOff,
  "hr-leave-requests": Plane,
  "hr-holidays": Calendar,
  "hr-payroll": DollarSign,
  "hr-recruitment": UserPlus,
  "hr-performance": Award,
  "hr-training": GraduationCap,
  "hr-benefits": Heart,
};

const PAGE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  "admin-dashboard": "Admin Dashboard",
  customers: "Customers",
  "customer-registration": "Customer Registration",
  loans: "Financings",
  "loan-application": "Financing Application",
  "financing-products": "Financing Products",
  "fad-review": "FAD Review",
  "risk-compliance": "Risk Compliance",
  "committee-voting": "Committee Voting",
  reports: "Reports",
  "par-report": "PAR Report",
  "citizen-balance-statement": "Balance Statement",
  "loan-disbursement-report": "Loan Disbursement Report",
  "shareholder-report": "Shareholder Report",
  "custom-reports": "Custom Reports",
  "dab-report": "DAB Regulatory Report",
  "accounting-dashboard": "Accounting Dashboard",
  "profitability-analysis": "Profitability Analysis",
  "activity-logs": "Activity Log",
  settings: "Settings",
  payments: "Payments",
  collections: "Collections",
  "collection-approvals": "Collection Approvals",
  "installment-management": "Installment Management",
  "loan-transfers": "Loan Transfers",
  "loan-classification": "Loan Classification",
  approvals: "Approvals",
  disbursements: "Disbursements",
  branches: "Branches",
  officers: "Finance Officers",
  "funding-sources": "Funding Sources",
  lookup: "Lookup Tables",
  "par-categories": "PAR Categories",
  "disbursement-targets": "Disbursement Targets",
  users: "User Management",
  "page-permissions": "Page Permissions",
  "chart-of-accounts": "Chart of Accounts",
  "classes": "Classes",
  "collection-report": "Collection Report",
  "approval-rejection-report": "Approval & Rejection Report",
  "journal-entries": "Journal Entries",
  "account-statement": "Account Statement",
  "trial-balance": "Trial Balance",
  "income-statement": "Income Statement",
  "balance-sheet": "Balance Sheet",
  "cash-flow-statement": "Cash Flow Statement",
  "hr-dashboard": "HR Dashboard",
  "hr-employees": "Employees",
  "hr-departments": "Departments",
  "hr-positions": "Positions",
  "hr-org-structure": "Org Structure",
  "hr-attendance": "Attendance",
  "hr-leave-types": "Leave Types",
  "hr-leave-requests": "Leave Requests",
  "hr-holidays": "Holidays",
  "hr-payroll": "Payroll",
  "hr-recruitment": "Recruitment",
  "hr-performance": "Performance",
  "hr-training": "Training",
  "hr-benefits": "Benefits",
};

interface User {
  id: string;
  username: string;
  email: string | null;
  firstName: string;
  lastName: string;
  role: string | null;
  roleLabel: string | null;
  roleType: string | null;
  branchId: string | null;
  branchName: string | null;
  isActive: boolean | null;
  createdAt: string;
}

interface UserFormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  financeOfficerId: string;
  branchId: string;
}

interface BranchItem {
  id: string;
  name: string;
  code: string | null;
}

interface LookupRole {
  id: number;
  value: string;
  label: string;
  roleType: string;
  description: string | null;
  isActive: boolean;
}

interface RoleFormData {
  value: string;
  label: string;
  description: string;
  roleType: string;
}

interface FinanceOfficerItem {
  id: string;
  name: string;
  code?: string;
  branchName?: string;
  userId?: string;
  employeeId?: string;
  financeOfficerId?: string;
}

export default function UsersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [officerComboOpen, setOfficerComboOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [toggleStatusUser, setToggleStatusUser] = useState<User | null>(null);
  const [resetMfaUser, setResetMfaUser] = useState<User | null>(null);
  const [permissionsUser, setPermissionsUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermissions>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [permissionsSearch, setPermissionsSearch] = useState("");
  const [permissionsRole, setPermissionsRole] = useState<LookupRole | null>(null);
  const [rolePermissions, setRolePermissions] = useState<UserPermissions>({});
  const [roleExpandedCategories, setRoleExpandedCategories] = useState<Record<string, boolean>>({});
  const [rolePermissionsSearch, setRolePermissionsSearch] = useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<LookupRole | null>(null);
  const [deleteRole, setDeleteRole] = useState<LookupRole | null>(null);
  const [roleFormData, setRoleFormData] = useState<RoleFormData>({
    value: "", label: "", description: "", roleType: "user",
  });
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    financeOfficerId: "",
    branchId: "",
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
      queryClient.invalidateQueries({ queryKey: ["/api/finance-officers"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/finance-officers"] });
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

  const resetMfaMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/mfa/admin-reset/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Two-factor reset", description: "User will set it up again on next login." });
      setResetMfaUser(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to reset two-factor", description: error.message, variant: "destructive" });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}/status`, { isActive });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: variables.isActive ? "User activated successfully" : "User deactivated successfully" });
      setToggleStatusUser(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update user status", description: error.message, variant: "destructive" });
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
    setPermissionsSearch("");
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

  const updateRolePermissionMutation = useMutation({
    mutationFn: async ({ roleValue, pageName, canAccess }: { roleValue: string; pageName: string; canAccess: boolean }) => {
      const res = await apiRequest("POST", "/api/role-permissions", { roleValue, pageName, canAccess });
      return res.json();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update role permission", description: error.message, variant: "destructive" });
    },
  });

  const openRolePermissionsDialog = async (role: LookupRole) => {
    setPermissionsRole(role);
    setRolePermissionsSearch("");
    try {
      const res = await fetch(`/api/role-permissions/${role.value}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setRolePermissions(data.permissions || {});
      } else {
        setRolePermissions({});
      }
    } catch {
      setRolePermissions({});
    }
  };

  const handleRolePermissionChange = (pageName: string, canAccess: boolean) => {
    if (!permissionsRole) return;
    setRolePermissions(prev => ({ ...prev, [pageName]: canAccess }));
    updateRolePermissionMutation.mutate({ roleValue: permissionsRole.value, pageName, canAccess });
  };

  const getFilteredCategories = (searchTerm: string) => {
    if (!searchTerm.trim()) return PAGE_CATEGORIES;
    const lower = searchTerm.toLowerCase();
    return PAGE_CATEGORIES.map(cat => ({
      ...cat,
      pages: cat.pages.filter(p => p.label.toLowerCase().includes(lower) || p.id.toLowerCase().includes(lower)),
    })).filter(cat => cat.pages.length > 0 || cat.label.toLowerCase().includes(lower));
  };

  const { data: financingOfficerEmployees = [] } = useQuery<any[]>({
    queryKey: ["/api/hr/employees/financing-officers"],
  });

  const financeOfficers: FinanceOfficerItem[] = useMemo(() => {
    return financingOfficerEmployees.map((emp: any) => ({
      id: emp.finance_officer_id || emp.id,
      name: `${emp.first_name} ${emp.last_name}`.trim(),
      code: emp.employee_code || undefined,
      branchName: emp.branch_name || undefined,
      userId: undefined,
      employeeId: emp.id,
      financeOfficerId: emp.finance_officer_id,
    }));
  }, [financingOfficerEmployees]);

  const { data: branches = [] } = useQuery<BranchItem[]>({
    queryKey: ["/api/branches"],
  });

  const { data: lookupRoles = [], isLoading: rolesLoading } = useQuery<LookupRole[]>({
    queryKey: ["/api/lookup-roles"],
  });

  const systemRoles = lookupRoles.filter(r => r.isActive).map(r => ({ value: r.value, label: r.label }));

  const createRoleMutation = useMutation({
    mutationFn: async (data: RoleFormData) => {
      const res = await apiRequest("POST", "/api/lookup-roles", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lookup-roles"] });
      toast({ title: "Role created successfully" });
      setIsRoleDialogOpen(false);
      resetRoleForm();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create role", description: error.message, variant: "destructive" });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: RoleFormData }) => {
      const res = await apiRequest("PATCH", `/api/lookup-roles/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lookup-roles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Role updated successfully" });
      setIsRoleDialogOpen(false);
      setEditRole(null);
      resetRoleForm();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update role", description: error.message, variant: "destructive" });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/lookup-roles/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lookup-roles"] });
      toast({ title: "Role deleted successfully" });
      setDeleteRole(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete role", description: error.message, variant: "destructive" });
    },
  });

  const resetRoleForm = () => {
    setRoleFormData({ value: "", label: "", description: "", roleType: "user" });
  };

  const openEditRoleDialog = (role: LookupRole) => {
    setRoleFormData({
      value: role.value,
      label: role.label,
      description: role.description || "",
      roleType: role.roleType,
    });
    setEditRole(role);
    setIsRoleDialogOpen(true);
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editRole) {
      updateRoleMutation.mutate({ id: editRole.id, data: roleFormData });
    } else {
      createRoleMutation.mutate(roleFormData);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "user",
      financeOfficerId: "",
      branchId: "",
    });
  };

  const openEditDialog = async (user: User) => {
    const linkedEmp = financingOfficerEmployees.find((e: any) => e.user_id === user.id);
    const linkedOfficer = linkedEmp ? financeOfficers.find((o) => o.employeeId === linkedEmp.id) : undefined;
    setFormData({
      username: user.username,
      password: "",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || "",
      role: user.role || "user",
      financeOfficerId: linkedOfficer?.id || "",
      branchId: user.branchId || "",
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
        financeOfficerId: formData.role === "finance_officer" ? formData.financeOfficerId : "",
        branchId: formData.branchId,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      updateMutation.mutate({ id: editUser.id, data: updateData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getRoleTypeForUser = (user: User) => {
    return user.roleType || "user";
  };

  const getRoleBadgeStyle = (roleType: string | null) => {
    switch (roleType) {
      case "admin":
        return "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "manager":
        return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30";
      default:
        return "bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-700 dark:text-slate-400 border-slate-500/30";
    }
  };

  const getRoleIcon = (roleType: string | null) => {
    switch (roleType) {
      case "admin":
        return <Crown className="h-3.5 w-3.5 mr-1" />;
      case "manager":
        return <UserCheck className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Users className="h-3.5 w-3.5 mr-1" />;
    }
  };

  const getRoleLabel = (user: User) => {
    return user.roleLabel || user.role || "User";
  };

  const getAvatarGradient = (roleType: string | null) => {
    switch (roleType) {
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
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Access Control</h1>
            <p className="text-muted-foreground">Manage system users, roles and access permissions</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2" data-testid="tab-users">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2" data-testid="tab-roles">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4 space-y-4">
        <div className="flex justify-end">
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
                  placeholder="At least 8 characters with mixed case, number & symbol"
                  data-testid="input-password"
                />
                <PasswordStrength password={formData.password} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger data-testid="select-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {systemRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-purple-500" />
                          {role.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchId">Branch</Label>
                <Select value={formData.branchId} onValueChange={(value) => setFormData({ ...formData, branchId: value === "_none" ? "" : value })}>
                  <SelectTrigger data-testid="select-branch">
                    <SelectValue placeholder="Select branch (optional)..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">No Branch</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          <span>{branch.name}</span>
                          {branch.code && <span className="text-muted-foreground text-xs">({branch.code})</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.role === "finance_officer" && (
                <div className="space-y-2">
                  <Label htmlFor="financeOfficerId">Link to Financing Officer *</Label>
                  <Popover open={officerComboOpen} onOpenChange={setOfficerComboOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={officerComboOpen} className="w-full justify-between font-normal" data-testid="select-finance-officer">
                        {formData.financeOfficerId ? (() => {
                          const o = financeOfficers.find((o) => o.id === formData.financeOfficerId);
                          return o ? `${o.name}${o.code ? ` (${o.code})` : ""}${o.branchName ? ` - ${o.branchName}` : ""}` : "Select financing officer...";
                        })() : "Select financing officer..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search financing officer..." />
                        <CommandList>
                          <CommandEmpty>No officer found.</CommandEmpty>
                          <CommandGroup>
                            {financeOfficers.map((officer) => (
                              <CommandItem key={officer.id} value={`${officer.name} ${officer.code || ""} ${officer.branchName || ""}`} onSelect={() => { setFormData({ ...formData, financeOfficerId: officer.id }); setOfficerComboOpen(false); }}>
                                <Check className={cn("mr-2 h-4 w-4", formData.financeOfficerId === officer.id ? "opacity-100" : "opacity-0")} />
                                <Briefcase className="mr-2 h-4 w-4 text-emerald-500" />
                                <span>{officer.name}</span>
                                {officer.code && <span className="text-muted-foreground text-xs ml-1">({officer.code})</span>}
                                {officer.branchName && <span className="text-muted-foreground text-xs ml-1">- {officer.branchName}</span>}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || (formData.role === "finance_officer" && !formData.financeOfficerId)} data-testid="button-submit-create">
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
                    <TableHead className="font-semibold">Branch</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
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
                            <AvatarFallback className={`bg-gradient-to-br ${getAvatarGradient(getRoleTypeForUser(user))} text-white font-semibold`}>
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.firstName} {user.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-primary font-medium">{user.username}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`flex items-center w-fit ${getRoleBadgeStyle(getRoleTypeForUser(user))}`}>
                          {getRoleIcon(getRoleTypeForUser(user))}
                          {getRoleLabel(user)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.branchName ? (
                          <span className="flex items-center gap-1.5 text-sm">
                            <Building2 className="h-3.5 w-3.5 text-blue-500" />
                            {user.branchName}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          user.isActive !== false
                            ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30"
                            : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30"
                        )} data-testid={`status-user-${user.id}`}>
                          {user.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.createdAt ? format(new Date(user.createdAt), "dd-MMM-yyyy") : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {getRoleTypeForUser(user) !== "admin" && (
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
                            onClick={() => setToggleStatusUser(user)}
                            data-testid={`button-toggle-status-${user.id}`}
                            title={user.isActive !== false ? "Deactivate User" : "Activate User"}
                          >
                            {user.isActive !== false ? (
                              <UserX className="h-4 w-4 text-amber-600" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setResetMfaUser(user)}
                            data-testid={`button-reset-mfa-${user.id}`}
                            title="Reset Two-Factor Authentication"
                          >
                            <Lock className="h-4 w-4 text-blue-600" />
                          </Button>
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
      </TabsContent>

      <TabsContent value="roles" className="mt-4 space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => { resetRoleForm(); setEditRole(null); setIsRoleDialogOpen(true); }} data-testid="button-create-role">
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </div>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-violet-500" />
          <CardHeader className="bg-gradient-to-r from-purple-500/5 to-violet-500/5">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              All Roles
              <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30">
                {lookupRoles.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {rolesLoading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : lookupRoles.length === 0 ? (
              <div className="text-center py-16">
                <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground text-lg">No roles defined</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Create your first role to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold w-12">#</TableHead>
                      <TableHead className="font-semibold">Role Value</TableHead>
                      <TableHead className="font-semibold">Display Label</TableHead>
                      <TableHead className="font-semibold">Role Type</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lookupRoles.map((role, index) => (
                      <TableRow key={role.id} data-testid={`row-role-${role.id}`}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30">
                            {role.value}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-purple-600" />
                            {role.label}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            role.roleType === "admin" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30" :
                            role.roleType === "manager" ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30" :
                            "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30"
                          }>
                            {role.roleType === "admin" ? "Admin" : role.roleType === "manager" ? "Managerial" : "User"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{role.description || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openRolePermissionsDialog(role)}
                              data-testid={`button-role-permissions-${role.id}`}
                              title="Manage Page Permissions"
                            >
                              <Lock className="h-4 w-4 text-purple-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditRoleDialog(role)} data-testid={`button-edit-role-${role.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteRole(role)} data-testid={`button-delete-role-${role.id}`}>
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
      </TabsContent>
      </Tabs>

      {/* Create/Edit Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={(open) => { if (!open) { setIsRoleDialogOpen(false); setEditRole(null); resetRoleForm(); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                {editRole ? <Pencil className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-white" />}
              </div>
              {editRole ? "Edit Role" : "Create New Role"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRoleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role-value">Role Value *</Label>
                <Input
                  id="role-value"
                  value={roleFormData.value}
                  onChange={(e) => setRoleFormData({ ...roleFormData, value: e.target.value })}
                  placeholder="e.g., cfo"
                  required
                  disabled={!!editRole}
                  data-testid="input-role-value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-label">Display Label *</Label>
                <Input
                  id="role-label"
                  value={roleFormData.label}
                  onChange={(e) => setRoleFormData({ ...roleFormData, label: e.target.value })}
                  placeholder="e.g., CFO"
                  required
                  data-testid="input-role-label"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-type">Role Type *</Label>
              <Select value={roleFormData.roleType} onValueChange={(value) => setRoleFormData({ ...roleFormData, roleType: value })}>
                <SelectTrigger data-testid="select-role-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="manager">Managerial</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Determines system access level: User = page-level permissions, Managerial = full page access, Admin = full system access
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                value={roleFormData.description}
                onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                placeholder="Brief description of this role"
                data-testid="input-role-description"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => { setIsRoleDialogOpen(false); setEditRole(null); resetRoleForm(); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRoleMutation.isPending || updateRoleMutation.isPending} data-testid="button-submit-role">
                {createRoleMutation.isPending || updateRoleMutation.isPending ? "Saving..." : editRole ? "Save Changes" : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation */}
      <AlertDialog open={!!deleteRole} onOpenChange={(open) => { if (!open) setDeleteRole(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Trash2 className="h-4 w-4 text-red-600" />
              </div>
              Delete Role
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role <span className="font-semibold">{deleteRole?.label}</span>? Users currently assigned this role may lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteRole && deleteRoleMutation.mutate(deleteRole.id)}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-delete-role"
            >
              {deleteRoleMutation.isPending ? "Deleting..." : "Delete Role"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                placeholder="At least 8 characters with mixed case, number & symbol"
                data-testid="input-edit-password"
              />
              <PasswordStrength password={formData.password} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger data-testid="select-edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {systemRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-500" />
                        {role.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-branchId">Branch</Label>
              <Select value={formData.branchId} onValueChange={(value) => setFormData({ ...formData, branchId: value === "_none" ? "" : value })}>
                <SelectTrigger data-testid="select-edit-branch">
                  <SelectValue placeholder="Select branch (optional)..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">No Branch</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <span>{branch.name}</span>
                        {branch.code && <span className="text-muted-foreground text-xs">({branch.code})</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.role === "finance_officer" && (
              <div className="space-y-2">
                <Label htmlFor="edit-financeOfficerId">Link to Financing Officer *</Label>
                <Popover open={officerComboOpen} onOpenChange={setOfficerComboOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={officerComboOpen} className="w-full justify-between font-normal" data-testid="select-edit-finance-officer">
                      {formData.financeOfficerId ? (() => {
                        const o = financeOfficers.find((o) => o.id === formData.financeOfficerId);
                        return o ? `${o.name}${o.code ? ` (${o.code})` : ""}${o.branchName ? ` - ${o.branchName}` : ""}` : "Select financing officer...";
                      })() : "Select financing officer..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search financing officer..." />
                      <CommandList>
                        <CommandEmpty>No officer found.</CommandEmpty>
                        <CommandGroup>
                          {financeOfficers.map((officer) => (
                            <CommandItem key={officer.id} value={`${officer.name} ${officer.code || ""} ${officer.branchName || ""}`} onSelect={() => { setFormData({ ...formData, financeOfficerId: officer.id }); setOfficerComboOpen(false); }}>
                              <Check className={cn("mr-2 h-4 w-4", formData.financeOfficerId === officer.id ? "opacity-100" : "opacity-0")} />
                              <Briefcase className="mr-2 h-4 w-4 text-emerald-500" />
                              <span>{officer.name}</span>
                              {officer.code && <span className="text-muted-foreground text-xs ml-1">({officer.code})</span>}
                              {officer.branchName && <span className="text-muted-foreground text-xs ml-1">- {officer.branchName}</span>}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending || (formData.role === "finance_officer" && !formData.financeOfficerId)} data-testid="button-submit-edit">
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!resetMfaUser} onOpenChange={(open) => { if (!open) setResetMfaUser(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset two-factor authentication?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear the authenticator app and backup codes for <span className="font-semibold">{resetMfaUser?.firstName} {resetMfaUser?.lastName}</span>. They'll be asked to set it up again the next time they log in. All their trusted devices will also be signed out.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-reset-mfa">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetMfaUser && resetMfaMutation.mutate(resetMfaUser.id)}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-confirm-reset-mfa"
            >
              {resetMfaMutation.isPending ? "Resetting..." : "Reset Two-Factor"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      {/* Activate/Deactivate Confirmation Dialog */}
      <AlertDialog open={!!toggleStatusUser} onOpenChange={(open) => { if (!open) setToggleStatusUser(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center",
                toggleStatusUser?.isActive !== false ? "bg-amber-500/10" : "bg-green-500/10"
              )}>
                {toggleStatusUser?.isActive !== false ? (
                  <UserX className="h-4 w-4 text-amber-600" />
                ) : (
                  <UserCheck className="h-4 w-4 text-green-600" />
                )}
              </div>
              {toggleStatusUser?.isActive !== false ? "Deactivate User" : "Activate User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleStatusUser?.isActive !== false ? (
                <>Are you sure you want to deactivate <span className="font-semibold">{toggleStatusUser?.firstName} {toggleStatusUser?.lastName}</span>? They will no longer be able to log in to the system.</>
              ) : (
                <>Are you sure you want to reactivate <span className="font-semibold">{toggleStatusUser?.firstName} {toggleStatusUser?.lastName}</span>? They will be able to log in again.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toggleStatusUser && toggleStatusMutation.mutate({
                id: toggleStatusUser.id,
                isActive: toggleStatusUser.isActive === false,
              })}
              className={toggleStatusUser?.isActive !== false ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}
              data-testid="button-confirm-toggle-status"
            >
              {toggleStatusMutation.isPending
                ? "Processing..."
                : toggleStatusUser?.isActive !== false
                  ? "Deactivate User"
                  : "Activate User"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Page Permissions Dialog - User */}
      <Dialog open={!!permissionsUser} onOpenChange={(open) => { if (!open) { setPermissionsUser(null); setExpandedCategories({}); setPermissionsSearch(""); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              Page Access for {permissionsUser?.firstName} {permissionsUser?.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={permissionsSearch}
                onChange={(e) => setPermissionsSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-user-permissions"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <p className="text-sm text-muted-foreground mb-3">
              Toggle access to individual pages. Changes are saved automatically.
            </p>
            <div className="space-y-3">
              {getFilteredCategories(permissionsSearch).map((category) => {
                const isExpanded = expandedCategories[category.id] === true || permissionsSearch.trim() !== "";
                const CategoryIcon = category.icon;
                const enabledCount = category.pages.filter(p => userPermissions[p.id] === true).length;
                const totalCount = category.pages.length;
                const allEnabled = enabledCount === totalCount && totalCount > 0;
                const someEnabled = enabledCount > 0 && enabledCount < totalCount;
                
                return (
                  <div key={category.id} className="border rounded-lg overflow-hidden" data-testid={`user-category-${category.id}`}>
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
                              data-testid={`user-enable-all-${category.id}`}
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
                              data-testid={`user-disable-all-${category.id}`}
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
                                data-testid={`user-permission-${page.id}`}
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
                                    data-testid={`user-switch-${page.id}`}
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
              {getFilteredCategories(permissionsSearch).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>No pages found matching "{permissionsSearch}"</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionsUser(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Page Permissions Dialog - Role */}
      <Dialog open={!!permissionsRole} onOpenChange={(open) => { if (!open) { setPermissionsRole(null); setRoleExpandedCategories({}); setRolePermissionsSearch(""); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              Default Page Access for Role: {permissionsRole?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={rolePermissionsSearch}
                onChange={(e) => setRolePermissionsSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-role-permissions"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <p className="text-sm text-muted-foreground mb-3">
              Set default page access for this role. When a user is assigned this role, they will automatically receive these permissions.
            </p>
            {permissionsRole?.roleType === "admin" || permissionsRole?.roleType === "manager" ? (
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-3">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  <strong>Note:</strong> Users with {permissionsRole?.roleType === "admin" ? "Admin" : "Managerial"} role type automatically get access to all pages. These defaults will be saved but won't restrict their access.
                </p>
              </div>
            ) : null}
            <div className="space-y-3">
              {getFilteredCategories(rolePermissionsSearch).map((category) => {
                const isExpanded = roleExpandedCategories[category.id] === true || rolePermissionsSearch.trim() !== "";
                const CategoryIcon = category.icon;
                const enabledCount = category.pages.filter(p => rolePermissions[p.id] === true).length;
                const totalCount = category.pages.length;
                const allEnabled = enabledCount === totalCount && totalCount > 0;
                const someEnabled = enabledCount > 0 && enabledCount < totalCount;
                
                return (
                  <div key={category.id} className="border rounded-lg overflow-hidden" data-testid={`role-category-${category.id}`}>
                    <Collapsible 
                      open={isExpanded} 
                      onOpenChange={(open) => setRoleExpandedCategories(prev => ({ ...prev, [category.id]: open }))}
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
                                  if (!rolePermissions[page.id]) {
                                    handleRolePermissionChange(page.id, true);
                                  }
                                });
                              }}
                              data-testid={`role-enable-all-${category.id}`}
                            >
                              Enable All
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => {
                                category.pages.forEach(page => {
                                  if (rolePermissions[page.id]) {
                                    handleRolePermissionChange(page.id, false);
                                  }
                                });
                              }}
                              data-testid={`role-disable-all-${category.id}`}
                            >
                              Disable All
                            </Button>
                          </div>
                          {category.pages.map((page) => {
                            const PageIcon = page.icon;
                            const hasAccess = rolePermissions[page.id] === true;
                            
                            return (
                              <div
                                key={page.id}
                                className={cn(
                                  "flex items-center justify-between p-2.5 rounded-lg border transition-colors",
                                  hasAccess 
                                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                                    : "bg-background border-muted"
                                )}
                                data-testid={`role-permission-${page.id}`}
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
                                    onCheckedChange={(checked) => handleRolePermissionChange(page.id, checked)}
                                    disabled={updateRolePermissionMutation.isPending}
                                    data-testid={`role-switch-${page.id}`}
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
              {getFilteredCategories(rolePermissionsSearch).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>No pages found matching "{rolePermissionsSearch}"</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionsRole(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
