export type PageGroupId =
  | "dashboard"
  | "customers"
  | "loans"
  | "reports"
  | "management"
  | "hr"
  | "accounting"
  | "settings";

export interface PageDef {
  key: string;
  label: string;
  route: string;
  group: PageGroupId | null;
  permissionable?: boolean;
}

export const PAGE_GROUP_LABELS: Record<PageGroupId, string> = {
  dashboard: "Dashboard",
  customers: "Customers",
  loans: "Financing Management",
  reports: "Reports",
  management: "Management",
  hr: "Human Resources",
  accounting: "Accounting",
  settings: "Settings & Admin",
};

export const PAGES: PageDef[] = [
  { key: "dashboard", label: "Overview Dashboard", route: "/", group: "dashboard" },
  { key: "admin-dashboard", label: "Admin Dashboard", route: "/admin-dashboard", group: "dashboard" },
  { key: "management-dashboard", label: "Management Dashboard", route: "/management-dashboard", group: "dashboard" },
  { key: "executive-dashboard", label: "Executive Dashboard", route: "/executive-dashboard", group: "dashboard" },

  { key: "customers", label: "Customers", route: "/customers", group: "customers" },
  { key: "customer-registration", label: "Customer Registration", route: "/customer-registration", group: "customers" },

  { key: "loans", label: "Financing List", route: "/loans", group: "loans" },
  { key: "loan-application", label: "New Financing Application", route: "/loan-application", group: "loans" },
  { key: "financing-products", label: "Financing Products", route: "/financing-products", group: "loans" },
  { key: "fad-review", label: "FAD Review", route: "/fad-review", group: "loans" },
  { key: "risk-compliance", label: "Risk Compliance", route: "/risk-compliance", group: "loans" },
  { key: "committee-voting", label: "Committee Voting", route: "/committee-voting", group: "loans" },
  { key: "approvals", label: "Financing Approvals", route: "/approvals", group: "loans" },
  { key: "disbursements", label: "Disbursements", route: "/disbursements", group: "loans" },
  { key: "payments", label: "Payments", route: "/payments", group: "loans" },
  { key: "collections", label: "Collections", route: "/collections", group: "loans" },
  { key: "collection-entry", label: "Collection Entry", route: "/collection-entry", group: "loans" },
  { key: "collection-approvals", label: "Collection Approvals", route: "/collection-approvals", group: "loans" },
  { key: "installment-management", label: "Installment Management", route: "/installment-management", group: "loans" },
  { key: "loan-transfers", label: "Loan Transfers", route: "/loan-transfers", group: "loans" },
  { key: "loan-classification", label: "Loan Classification", route: "/loan-classification", group: "loans" },

  { key: "reports", label: "Analytics", route: "/reports", group: "reports" },
  { key: "citizen-balance-statement", label: "Balance Statement", route: "/citizen-balance-statement", group: "reports" },
  { key: "loan-disbursement-report", label: "Loan Disbursement Report", route: "/loan-disbursement-report", group: "reports" },
  { key: "par-report", label: "PAR Report", route: "/par-report", group: "reports" },
  { key: "collection-report", label: "Collection Report", route: "/collection-report", group: "reports" },
  { key: "approval-rejection-report", label: "Approval & Rejection Report", route: "/approval-rejection-report", group: "reports" },
  { key: "officer-performance-report", label: "Officer Performance Report", route: "/officer-performance-report", group: "reports" },
  { key: "shareholder-report", label: "Shareholder Report", route: "/shareholder-report", group: "reports" },
  { key: "custom-reports", label: "Custom Reports", route: "/custom-reports", group: "reports" },
  { key: "activity-logs", label: "Activity Log", route: "/activity", group: "reports" },
  { key: "dab-report", label: "DAB Regulatory Report", route: "/dab-report", group: "reports" },
  { key: "accounting-dashboard", label: "Accounting Dashboard", route: "/accounting-dashboard", group: "reports" },
  { key: "profitability-analysis", label: "Profitability Analysis", route: "/profitability-analysis", group: "reports" },

  { key: "branches", label: "Branches", route: "/branches", group: "management" },
  { key: "officers", label: "Finance Officers", route: "/officers", group: "management" },
  { key: "funding-sources", label: "Funding Sources", route: "/funding-sources", group: "management" },
  { key: "lookup", label: "Lookup Tables", route: "/lookup", group: "management" },
  { key: "par-categories", label: "PAR Categories", route: "/par-categories", group: "management" },
  { key: "disbursement-targets", label: "Disbursement Targets", route: "/disbursement-targets", group: "management" },

  { key: "hr-dashboard", label: "HR Dashboard", route: "/hr/dashboard", group: "hr" },
  { key: "hr-employees", label: "Employees", route: "/hr/employees", group: "hr" },
  { key: "hr-departments", label: "Departments", route: "/hr/departments", group: "hr" },
  { key: "hr-positions", label: "Positions", route: "/hr/positions", group: "hr" },
  { key: "hr-org-structure", label: "Org Structure", route: "/hr/org-structure", group: "hr" },
  { key: "hr-attendance", label: "Attendance", route: "/hr/attendance", group: "hr" },
  { key: "hr-leave-types", label: "Leave Types", route: "/hr/leave-types", group: "hr" },
  { key: "hr-leave-requests", label: "Leave Requests", route: "/hr/leave-requests", group: "hr" },
  { key: "hr-holidays", label: "Holidays", route: "/hr/holidays", group: "hr" },
  { key: "hr-payroll", label: "Payroll", route: "/hr/payroll", group: "hr" },
  { key: "hr-recruitment", label: "Recruitment", route: "/hr/recruitment", group: "hr" },
  { key: "hr-performance", label: "Performance", route: "/hr/performance", group: "hr" },
  { key: "hr-training", label: "Training", route: "/hr/training", group: "hr" },
  { key: "hr-benefits", label: "Benefits", route: "/hr/benefits", group: "hr" },

  { key: "chart-of-accounts", label: "Chart of Accounts", route: "/chart-of-accounts", group: "accounting" },
  { key: "classes", label: "Classes", route: "/classes", group: "accounting" },
  { key: "journal-entries", label: "Journal Entries", route: "/journal-entries", group: "accounting" },
  { key: "account-statement", label: "Account Statement", route: "/account-statement", group: "accounting" },
  { key: "trial-balance", label: "Trial Balance", route: "/trial-balance", group: "accounting" },
  { key: "income-statement", label: "Income Statement", route: "/income-statement", group: "accounting" },
  { key: "balance-sheet", label: "Balance Sheet", route: "/balance-sheet", group: "accounting" },
  { key: "cash-flow-statement", label: "Cash Flow Statement", route: "/cash-flow-statement", group: "accounting" },

  { key: "settings", label: "System Settings", route: "/settings", group: "settings" },
  { key: "users", label: "User Management", route: "/users", group: "settings" },
  { key: "page-permissions", label: "Page Permissions", route: "/page-permissions", group: "settings" },
];

export const PAGES_BY_KEY: Record<string, PageDef> = Object.fromEntries(
  PAGES.map(p => [p.key, p]),
);

export const PAGE_ROUTE_TO_KEY: Record<string, string> = Object.fromEntries(
  PAGES.map(p => [p.route, p.key]),
);

export function getAllPageKeys(): string[] {
  return PAGES.filter(p => p.permissionable !== false).map(p => p.key);
}

export function getPagesByGroup(group: PageGroupId): PageDef[] {
  return PAGES.filter(p => p.group === group);
}
