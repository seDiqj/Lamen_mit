import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileBarChart, FileText as FileTextIcon } from "lucide-react";
import CollateralReport from "./collateral-report";
import ContractDataReport from "./contract-data-report";

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
        <TabsList className="grid w-full max-w-md grid-cols-2" data-testid="tabs-dab-reports">
          <TabsTrigger value="collateral" className="gap-2" data-testid="tab-collateral">
            <Shield className="h-4 w-4" />
            Collateral Report
          </TabsTrigger>
          <TabsTrigger value="contract-data" className="gap-2" data-testid="tab-contract-data">
            <FileBarChart className="h-4 w-4" />
            Contract Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collateral" className="mt-4">
          <CollateralReport />
        </TabsContent>

        <TabsContent value="contract-data" className="mt-4">
          <ContractDataReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
