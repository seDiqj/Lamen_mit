import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileBarChart, FileText as FileTextIcon, User, Users, UserCog, ClipboardList, TrendingUp } from "lucide-react";
import CollateralReport from "./collateral-report";
import ContractDataReport from "./contract-data-report";
import IndividualReport from "./individual-report";
import SubjectRoleReport from "./subject-role-report";
import SystemUserListReport from "./system-user-list-report";
import ActiveCustomerOutstandingReport from "./active-customer-outstanding-report";
import ProfitLossStatementReport from "./profit-loss-statement-report";

export default function DABReportsPage() {
  const [activeTab, setActiveTab] = useState("collateral");

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <FileTextIcon className="h-6 w-6 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Loan DAB Reports</h1>
          <p className="text-muted-foreground text-sm">Da Afghanistan Bank regulatory reports</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-5xl grid-cols-7" data-testid="tabs-dab-reports">
          <TabsTrigger value="collateral" className="gap-1 text-xs" data-testid="tab-collateral">
            <Shield className="h-3.5 w-3.5" />
            Collateral
          </TabsTrigger>
          <TabsTrigger value="contract-data" className="gap-1 text-xs" data-testid="tab-contract-data">
            <FileBarChart className="h-3.5 w-3.5" />
            Contract Data
          </TabsTrigger>
          <TabsTrigger value="individual" className="gap-1 text-xs" data-testid="tab-individual">
            <User className="h-3.5 w-3.5" />
            Individual
          </TabsTrigger>
          <TabsTrigger value="subject-role" className="gap-1 text-xs" data-testid="tab-subject-role">
            <Users className="h-3.5 w-3.5" />
            Subject Role
          </TabsTrigger>
          <TabsTrigger value="system-user-list" className="gap-1 text-xs" data-testid="tab-system-user-list">
            <UserCog className="h-3.5 w-3.5" />
            User List
          </TabsTrigger>
          <TabsTrigger value="active-outstanding" className="gap-1 text-xs" data-testid="tab-active-outstanding">
            <ClipboardList className="h-3.5 w-3.5" />
            Outstanding
          </TabsTrigger>
          <TabsTrigger value="profit-loss" className="gap-1 text-xs" data-testid="tab-profit-loss">
            <TrendingUp className="h-3.5 w-3.5" />
            Profit & Loss
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collateral" className="mt-4">
          <CollateralReport />
        </TabsContent>

        <TabsContent value="contract-data" className="mt-4">
          <ContractDataReport />
        </TabsContent>

        <TabsContent value="individual" className="mt-4">
          <IndividualReport />
        </TabsContent>

        <TabsContent value="subject-role" className="mt-4">
          <SubjectRoleReport />
        </TabsContent>

        <TabsContent value="system-user-list" className="mt-4">
          <SystemUserListReport />
        </TabsContent>

        <TabsContent value="active-outstanding" className="mt-4">
          <ActiveCustomerOutstandingReport />
        </TabsContent>

        <TabsContent value="profit-loss" className="mt-4">
          <ProfitLossStatementReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
