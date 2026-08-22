import {
  LayoutDashboard,
  TrendingUp,
  Users,
  UserPlus,
  FileText,
  ClipboardList,
  Package,
  FileCheck,
  Shield,
  Gavel,
  Banknote,
  CreditCard,
  Wallet,
  CheckSquare,
  ListChecks,
  ArrowLeftRight,
  Target,
  BarChart3,
  FileSpreadsheet,
  AlertTriangle,
  Receipt,
  Vote,
  PieChart,
  Activity,
  Landmark,
  LineChart,
  Building2,
  Briefcase,
  PiggyBank,
  Layers,
  DollarSign,
  UserCog,
  GitBranch,
  Clock,
  CalendarOff,
  Plane,
  Calendar,
  GraduationCap,
  Award,
  Heart,
  BookOpen,
  Scale,
  Tag,
  Settings,
} from "lucide-react";
import type { ComponentType } from "react";
import {
  PAGES,
  PAGES_BY_KEY,
  PAGE_ROUTE_TO_KEY,
  PAGE_GROUP_LABELS,
  type PageGroupId,
} from "@shared/pages";

type IconType = ComponentType<{ className?: string }>;

const PAGE_ICONS: Record<string, IconType> = {
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
  approvals: ClipboardList,
  disbursements: Banknote,
  payments: CreditCard,
  collections: Wallet,
  "collection-entry": Banknote,
  "collection-approvals": CheckSquare,
  "installment-management": ListChecks,
  "loan-transfers": ArrowLeftRight,
  "loan-classification": Target,

  reports: BarChart3,
  "citizen-balance-statement": FileSpreadsheet,
  "loan-disbursement-report": Banknote,
  "financing-data-report": FileSpreadsheet,
  "par-report": AlertTriangle,
  "collection-report": Receipt,
  "approval-rejection-report": Vote,
  "shareholder-report": PieChart,
  "custom-reports": ListChecks,
  "activity-logs": Activity,
  "dab-report": Landmark,
  "accounting-dashboard": PieChart,
  "profitability-analysis": LineChart,

  branches: Building2,
  officers: Briefcase,
  "funding-sources": PiggyBank,
  lookup: Layers,
  "par-categories": Target,
  "disbursement-targets": DollarSign,

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

  "chart-of-accounts": BookOpen,
  classes: Tag,
  "journal-entries": Receipt,
  "account-statement": FileSpreadsheet,
  "trial-balance": Scale,
  "income-statement": BarChart3,
  "balance-sheet": FileSpreadsheet,
  "cash-flow-statement": TrendingUp,

  settings: Settings,
  users: Users,
  "page-permissions": Shield,
};

const FALLBACK_ICON: IconType = FileText;

export function getPageIcon(key: string): IconType {
  return PAGE_ICONS[key] || FALLBACK_ICON;
}

export function getPageLabel(key: string): string {
  return PAGES_BY_KEY[key]?.label || key;
}

export function getPageKeyByRoute(route: string): string | undefined {
  return PAGE_ROUTE_TO_KEY[route];
}

interface GroupMeta {
  icon: IconType;
  color: string;
}

const GROUP_META: Record<PageGroupId, GroupMeta> = {
  dashboard: { icon: LayoutDashboard, color: "from-blue-500 to-indigo-500" },
  customers: { icon: Users, color: "from-green-500 to-emerald-500" },
  loans: { icon: FileText, color: "from-amber-500 to-yellow-500" },
  reports: { icon: BarChart3, color: "from-purple-500 to-violet-500" },
  management: { icon: Layers, color: "from-teal-500 to-cyan-500" },
  hr: { icon: UserCog, color: "from-pink-500 to-rose-500" },
  accounting: { icon: BookOpen, color: "from-emerald-500 to-green-500" },
  settings: { icon: Settings, color: "from-slate-500 to-gray-500" },
};

export interface PageCategory {
  id: PageGroupId;
  label: string;
  icon: IconType;
  color: string;
  pages: { id: string; label: string; icon: IconType }[];
}

export const PAGE_CATEGORIES: PageCategory[] = (
  Object.keys(GROUP_META) as PageGroupId[]
).map(gid => ({
  id: gid,
  label: PAGE_GROUP_LABELS[gid],
  icon: GROUP_META[gid].icon,
  color: GROUP_META[gid].color,
  pages: PAGES.filter(p => p.group === gid).map(p => ({
    id: p.key,
    label: p.label,
    icon: getPageIcon(p.key),
  })),
}));
