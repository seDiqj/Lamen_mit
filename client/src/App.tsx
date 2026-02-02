import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import LoansPage from "@/pages/loans";
import CustomersPage from "@/pages/customers";
import PaymentsPage from "@/pages/payments";
import ApprovalsPage from "@/pages/approvals";
import DisbursementsPage from "@/pages/disbursements";
import ReportsPage from "@/pages/reports";
import ParReportPage from "@/pages/par-report";
import BranchesPage from "@/pages/branches";
import OfficersPage from "@/pages/officers";
import ActivityPage from "@/pages/activity";
import SettingsPage from "@/pages/settings";
import UsersPage from "@/pages/users";
import FundingSourcesPage from "@/pages/funding-sources";
import PagePermissionsPage from "@/pages/page-permissions";
import LoanApplicationPage from "@/pages/loan-application";
import LoanDetailsPage from "@/pages/loan-details";
import NotFound from "@/pages/not-found";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "17rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-muted/30">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-card/80 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="hidden sm:block">
                <div className="h-6 w-px bg-border" />
              </div>
              <span className="hidden sm:inline-flex text-sm font-medium text-muted-foreground">
                Loan Management System
              </span>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

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
        <Route path="/login" component={LoginPage} />
        <Route component={LoginPage} />
      </Switch>
    );
  }

  return (
    <AuthenticatedLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/loans" component={LoansPage} />
        <Route path="/loans/:id" component={LoanDetailsPage} />
        <Route path="/loan-application" component={LoanApplicationPage} />
        <Route path="/customers" component={CustomersPage} />
        <Route path="/payments" component={PaymentsPage} />
        <Route path="/approvals" component={ApprovalsPage} />
        <Route path="/disbursements" component={DisbursementsPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/par-report" component={ParReportPage} />
        <Route path="/branches" component={BranchesPage} />
        <Route path="/officers" component={OfficersPage} />
        <Route path="/funding-sources" component={FundingSourcesPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/page-permissions" component={PagePermissionsPage} />
        <Route path="/activity" component={ActivityPage} />
        <Route path="/settings" component={SettingsPage} />
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
