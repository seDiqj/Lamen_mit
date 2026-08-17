import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { IconRailNav } from "@/components/icon-rail-nav";
import { BranchSelector } from "@/components/branch-selector";
import { BranchProvider } from "@/contexts/branch-context";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

import LoginPage from "@/pages/login";
import MfaChallengePage from "@/pages/mfa-challenge";
import MfaSetupPage from "@/pages/mfa-setup";
import ForceChangePasswordPage from "@/pages/force-change-password";
import Dashboard from "@/pages/dashboard";
import AdminDashboardPage from "@/pages/admin-dashboard";
import LoansPage from "@/pages/loans";
import CustomersPage from "@/pages/customers";
import PaymentsPage from "@/pages/payments";
import DisbursementsPage from "@/pages/disbursements";
import ReportsPage from "@/pages/reports";
import ParReportPage from "@/pages/par-report";
import BranchesPage from "@/pages/branches";
import ClassesPage from "@/pages/classes";
import OfficersPage from "@/pages/officers";
import ActivityPage from "@/pages/activity";
import SettingsPage from "@/pages/settings";
import UsersPage from "@/pages/users";
import FundingSourcesPage from "@/pages/funding-sources";
import PagePermissionsPage from "@/pages/page-permissions";
import LoanApplicationPage from "@/pages/loan-application";
import LoanDetailsPage from "@/pages/loan-details";
import FadReviewPage from "@/pages/fad-review";
import RiskCompliancePage from "@/pages/risk-compliance";
import CommitteeVotingPage from "@/pages/committee-voting";
import ChartOfAccountsPage from "@/pages/chart-of-accounts";
import JournalEntriesPage from "@/pages/journal-entries";
import AccountStatementPage from "@/pages/account-statement";
import TrialBalancePage from "@/pages/trial-balance";
import IncomeStatementPage from "@/pages/income-statement";
import BalanceSheetPage from "@/pages/balance-sheet";
import CashFlowStatementPage from "@/pages/cash-flow-statement";
import LoanClassificationPage from "@/pages/loan-classification";
import DABReportPage from "@/pages/dab-report";
import LookupPage from "@/pages/lookup";
import ParCategoriesPage from "@/pages/par-categories";
import DisbursementTargetsPage from "@/pages/disbursement-targets";
import AccountingDashboardPage from "@/pages/accounting-dashboard";
import ManagementDashboardPage from "@/pages/management-dashboard";
import ExecutiveDashboardPage from "@/pages/executive-dashboard";
import ProfitabilityAnalysisPage from "@/pages/profitability-analysis";
import HRDashboardPage from "@/pages/hr/dashboard";
import HROrgStructurePage from "@/pages/hr/org-structure";
import HREmployeesPage from "@/pages/hr/employees";
import HREmployeeFormPage from "@/pages/hr/employee-form";
import HRDepartmentsPage from "@/pages/hr/departments";
import HRPositionsPage from "@/pages/hr/positions";
import HRAttendancePage from "@/pages/hr/attendance";
import HRLeaveTypesPage from "@/pages/hr/leave-types";
import HRLeaveRequestsPage from "@/pages/hr/leave-requests";
import HRHolidaysPage from "@/pages/hr/holidays";
import HRPayrollPage from "@/pages/hr/payroll";
import HRRecruitmentPage from "@/pages/hr/recruitment";
import HRPerformancePage from "@/pages/hr/performance";
import HRTrainingPage from "@/pages/hr/training";
import HRBenefitsPage from "@/pages/hr/benefits";
import ShareholderReportPage from "@/pages/shareholder-report";
import LoanDisbursementReportPage from "@/pages/loan-disbursement-report";
import FinancingDataReportPage from "@/pages/financing-data-report";
import DABReportsPage from "@/pages/dab-reports";
import LctrReportPage from "@/pages/lctr-report";
import CollectionsPage from "@/pages/collections";
import CitizenBalanceStatementPage from "@/pages/citizen-balance-statement";
import InstallmentManagementPage from "@/pages/installment-management";
import FinancingProductsPage from "@/pages/financing-products";
import LoanTransfersPage from "@/pages/loan-transfers";
import CollectionApprovalsPage from "@/pages/collection-approvals";
import CollectionEntryPage from "@/pages/collection-entry";
import CustomReportsPage from "@/pages/custom-reports";
import MobileLogin from "@/pages/mobile/mobile-login";
import MobileCustomers from "@/pages/mobile/mobile-customers";
import MobileFinancing from "@/pages/mobile/mobile-financing";
import MobileCollections from "@/pages/mobile/mobile-collections";
import { MobileLayout } from "@/pages/mobile/mobile-layout";
import MonthlyDueSummaryPage from "@/pages/monthly-due-summary";
import CollectionReportPage from "@/pages/collection-report";
import ApprovalRejectionReportPage from "@/pages/approval-rejection-report";
import OfficerPerformanceReportPage from "@/pages/officer-performance-report";
import NotFound from "@/pages/not-found";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <BranchProvider>
      <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-muted/30">
        <IconRailNav />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-card/80 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Financing Management System
              </span>
            </div>
            <div className="flex items-center gap-3">
              <BranchSelector />
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </BranchProvider>
  );
}

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Force users without MFA to complete setup before using the app.
  const mfaEnabled = !!(user && (user as any).mfaEnabled);
  const passwordChangeRequired = !!(user && (user as any).passwordChangeRequired);
  useEffect(() => {
    if (user && !mfaEnabled && location !== "/mfa-setup") {
      setLocation("/mfa-setup");
      return;
    }
    if (user && mfaEnabled && passwordChangeRequired && location !== "/force-change-password") {
      setLocation("/force-change-password");
    }
  }, [user, mfaEnabled, passwordChangeRequired, location, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <img src="/logo.jpeg" alt="Lamen" className="h-12 w-auto" />
            <span className="text-xl font-semibold">Lamen Microfinance</span>
          </div>
          <Skeleton className="h-2 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/mobile/login" component={MobileLogin} />
        <Route path="/mobile/:rest*">
          <MobileLogin />
        </Route>
        <Route path="/mfa-challenge" component={MfaChallengePage} />
        <Route path="/mfa-setup" component={MfaSetupPage} />
        <Route path="/login" component={LoginPage} />
        <Route component={LoginPage} />
      </Switch>
    );
  }

  if (passwordChangeRequired) {
    return <ForceChangePasswordPage />;
  }

  if (location.startsWith("/mobile")) {
    return (
      <MobileLayout>
        <Switch>
          <Route path="/mobile/customers" component={MobileCustomers} />
          <Route path="/mobile/financing" component={MobileFinancing} />
          <Route path="/mobile/collections" component={MobileCollections} />
          <Route path="/mobile">
            <MobileCustomers />
          </Route>
        </Switch>
      </MobileLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Switch>
        <Route path="/mfa-setup" component={MfaSetupPage} />
        <Route path="/force-change-password" component={ForceChangePasswordPage} />
        <Route path="/" component={Dashboard} />
        <Route path="/admin-dashboard" component={AdminDashboardPage} />
        <Route path="/loans" component={LoansPage} />
        <Route path="/loans/:id" component={LoanDetailsPage} />
        <Route path="/loan-application" component={LoanApplicationPage} />
        <Route path="/financing-products" component={FinancingProductsPage} />
        <Route path="/customers" component={CustomersPage} />
        <Route path="/payments" component={PaymentsPage} />
        <Route path="/collections" component={CollectionsPage} />
        <Route path="/collection-entry" component={CollectionEntryPage} />
        <Route path="/installment-management" component={InstallmentManagementPage} />
        <Route path="/loan-transfers" component={LoanTransfersPage} />
        <Route path="/collection-approvals" component={CollectionApprovalsPage} />
        <Route path="/fad-review" component={FadReviewPage} />
        <Route path="/risk-compliance" component={RiskCompliancePage} />
        <Route path="/committee-voting" component={CommitteeVotingPage} />
        <Route path="/disbursements" component={DisbursementsPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/loan-disbursement-report" component={LoanDisbursementReportPage} />
        <Route path="/financing-data-report" component={FinancingDataReportPage} />
        <Route path="/dab-reports" component={DABReportsPage} />
        <Route path="/lctr-report" component={LctrReportPage} />
        <Route path="/citizen-balance-statement" component={CitizenBalanceStatementPage} />
        <Route path="/par-report" component={ParReportPage} />
        <Route path="/shareholder-report" component={ShareholderReportPage} />
        <Route path="/custom-reports" component={CustomReportsPage} />
        <Route path="/monthly-due-summary" component={MonthlyDueSummaryPage} />
        <Route path="/collection-report" component={CollectionReportPage} />
        <Route path="/approval-rejection-report" component={ApprovalRejectionReportPage} />
        <Route path="/officer-performance-report" component={OfficerPerformanceReportPage} />
        <Route path="/branches" component={BranchesPage} />
        <Route path="/officers" component={OfficersPage} />
        <Route path="/funding-sources" component={FundingSourcesPage} />
        <Route path="/lookup" component={LookupPage} />
        <Route path="/par-categories" component={ParCategoriesPage} />
        <Route path="/disbursement-targets" component={DisbursementTargetsPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/page-permissions" component={PagePermissionsPage} />
        <Route path="/activity" component={ActivityPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/classes" component={ClassesPage} />
        <Route path="/chart-of-accounts" component={ChartOfAccountsPage} />
        <Route path="/journal-entries" component={JournalEntriesPage} />
        <Route path="/account-statement" component={AccountStatementPage} />
        <Route path="/trial-balance" component={TrialBalancePage} />
        <Route path="/income-statement" component={IncomeStatementPage} />
        <Route path="/balance-sheet" component={BalanceSheetPage} />
        <Route path="/cash-flow-statement" component={CashFlowStatementPage} />
        <Route path="/loan-classification" component={LoanClassificationPage} />
        <Route path="/dab-report" component={DABReportPage} />
        <Route path="/accounting-dashboard" component={AccountingDashboardPage} />
        <Route path="/management-dashboard" component={ManagementDashboardPage} />
        <Route path="/executive-dashboard" component={ExecutiveDashboardPage} />
        <Route path="/profitability-analysis" component={ProfitabilityAnalysisPage} />
        <Route path="/hr/dashboard" component={HRDashboardPage} />
        <Route path="/hr/org-structure" component={HROrgStructurePage} />
        <Route path="/hr/employees" component={HREmployeesPage} />
        <Route path="/hr/employees/new" component={HREmployeeFormPage} />
        <Route path="/hr/employees/:id/edit" component={HREmployeeFormPage} />
        <Route path="/hr/departments" component={HRDepartmentsPage} />
        <Route path="/hr/positions" component={HRPositionsPage} />
        <Route path="/hr/attendance" component={HRAttendancePage} />
        <Route path="/hr/leave-types" component={HRLeaveTypesPage} />
        <Route path="/hr/leave-requests" component={HRLeaveRequestsPage} />
        <Route path="/hr/holidays" component={HRHolidaysPage} />
        <Route path="/hr/payroll" component={HRPayrollPage} />
        <Route path="/hr/recruitment" component={HRRecruitmentPage} />
        <Route path="/hr/performance" component={HRPerformancePage} />
        <Route path="/hr/training" component={HRTrainingPage} />
        <Route path="/hr/benefits" component={HRBenefitsPage} />
        <Route component={NotFound} />
      </Switch>
    </AuthenticatedLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="lamen-theme">
        <TooltipProvider>
          <Toaster />
          <AppRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
