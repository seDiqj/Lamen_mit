import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Target, Building2, Briefcase, Loader2 } from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AF", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

type AdminDashboardData = {
  hrStaff: {
    totalStaff: number;
    totalFemaleStaff: number;
    totalCreditOfficers: number;
    femaleCreditOfficers: number;
    caseload: number;
    productivity: number;
  };
  disbursement: {
    target: number;
    disbursedNo: number;
    actual: number;
  };
  branchWise: Array<{
    branch: string;
    no: number;
    olb: number;
    femaleNo: number;
    femaleValue: number;
    femalePercent: number;
    par1_30No: number;
    par1_30Percent: number;
    par30No: number;
    par30Percent: number;
  }>;
  sectorWise: Array<{
    sector: string;
    olb: number;
    percentage: number;
  }>;
  loansClosing: Record<string, number>;
  totalOLB: number;
};

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<AdminDashboardData>({
    queryKey: ["/api/admin/dashboard-stats"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hrStaff = data?.hrStaff || { totalStaff: 0, totalFemaleStaff: 0, totalCreditOfficers: 0, femaleCreditOfficers: 0, caseload: 0, productivity: 0 };
  const disbursement = data?.disbursement || { target: 0, disbursedNo: 0, actual: 0 };
  const branchWise = data?.branchWise || [];
  const sectorWise = data?.sectorWise || [];
  const loansClosing = data?.loansClosing || {};
  const totalOLB = data?.totalOLB || 0;

  const femaleStaffPercent = hrStaff.totalStaff > 0 ? ((hrStaff.totalFemaleStaff / hrStaff.totalStaff) * 100).toFixed(1) : "0.0";
  const creditOfficersPercent = hrStaff.totalStaff > 0 ? ((hrStaff.totalCreditOfficers / hrStaff.totalStaff) * 100).toFixed(1) : "0.0";
  const femaleCOPercent = hrStaff.totalCreditOfficers > 0 ? ((hrStaff.femaleCreditOfficers / hrStaff.totalCreditOfficers) * 100).toFixed(1) : "0.0";
  const disbursementPercent = disbursement.target > 0 ? ((disbursement.actual / disbursement.target) * 100).toFixed(1) : "0.0";

  const branchTotals = branchWise.reduce((acc, b) => ({
    no: acc.no + b.no,
    olb: acc.olb + b.olb,
    femaleNo: acc.femaleNo + b.femaleNo,
    femaleValue: acc.femaleValue + b.femaleValue,
  }), { no: 0, olb: 0, femaleNo: 0, femaleValue: 0 });

  const loansClosingEntries = Object.entries(loansClosing).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Executive summary and key performance indicators</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              HR Staff Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>HR Staff</TableHead>
                  <TableHead className="text-right">No</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Total Staff</TableCell>
                  <TableCell className="text-right">{hrStaff.totalStaff}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Female Staff</TableCell>
                  <TableCell className="text-right">{hrStaff.totalFemaleStaff}</TableCell>
                  <TableCell className="text-right">{femaleStaffPercent}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Financing Officers</TableCell>
                  <TableCell className="text-right">{hrStaff.totalCreditOfficers}</TableCell>
                  <TableCell className="text-right">{creditOfficersPercent}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Female Financing Officers</TableCell>
                  <TableCell className="text-right">{hrStaff.femaleCreditOfficers}</TableCell>
                  <TableCell className="text-right">{femaleCOPercent}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <p className="text-xs text-muted-foreground">Caseload</p>
                <p className="text-xl font-bold text-blue-600">{hrStaff.caseload}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="text-xs text-muted-foreground">Productivity</p>
                <p className="text-xl font-bold text-green-600">{hrStaff.productivity}</p>
              </div>
            </div>
            {loansClosingEntries.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Loans Closing Date</p>
                <div className="grid grid-cols-3 gap-2">
                  {loansClosingEntries.map(([period, count]) => (
                    <div key={period} className="p-2 rounded-lg bg-muted text-center">
                      <p className="text-xs text-muted-foreground">{period}</p>
                      <p className="font-semibold">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Total Disbursement (Current Period)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Target</TableHead>
                  <TableHead className="text-right">Disbursed No</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{formatCurrency(disbursement.target)}</TableCell>
                  <TableCell className="text-right">{disbursement.disbursedNo}</TableCell>
                  <TableCell className="text-right">{formatCurrency(disbursement.actual)}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">{disbursementPercent}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress toward target</span>
                <span className="font-medium">{disbursementPercent}%</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.min(parseFloat(disbursementPercent), 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>{formatCurrency(disbursement.target)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-500" />
            Sector-Wise New OLB
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sectors</TableHead>
                <TableHead className="text-right">OLB</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectorWise.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">No sector data available</TableCell>
                </TableRow>
              ) : (
                <>
                  {sectorWise.map((sector) => (
                    <TableRow key={sector.sector}>
                      <TableCell className="font-medium">{sector.sector}</TableCell>
                      <TableCell className="text-right">{formatCurrency(sector.olb)}</TableCell>
                      <TableCell className="text-right">{sector.percentage}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalOLB)}</TableCell>
                    <TableCell className="text-right">100.0%</TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-500" />
            Branch-Wise New OLB
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead className="text-right">No</TableHead>
                <TableHead className="text-right">OLB</TableHead>
                <TableHead className="text-right border-l">Female No</TableHead>
                <TableHead className="text-right">Female Value</TableHead>
                <TableHead className="text-right">Value %</TableHead>
                <TableHead className="text-right border-l">PAR 1-30 No</TableHead>
                <TableHead className="text-right">No %</TableHead>
                <TableHead className="text-right border-l">PAR 30+ No</TableHead>
                <TableHead className="text-right">No %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branchWise.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground">No branch data available</TableCell>
                </TableRow>
              ) : (
                <>
                  {branchWise.map((branch) => (
                    <TableRow key={branch.branch}>
                      <TableCell className="font-medium">{branch.branch}</TableCell>
                      <TableCell className="text-right">{formatCurrency(branch.no)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(branch.olb)}</TableCell>
                      <TableCell className="text-right border-l">{formatCurrency(branch.femaleNo)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(branch.femaleValue)}</TableCell>
                      <TableCell className="text-right">{branch.femalePercent}%</TableCell>
                      <TableCell className="text-right border-l">{branch.par1_30No}</TableCell>
                      <TableCell className="text-right">{branch.par1_30Percent}%</TableCell>
                      <TableCell className="text-right border-l">{branch.par30No}</TableCell>
                      <TableCell className="text-right">{branch.par30Percent}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{formatCurrency(branchTotals.no)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(branchTotals.olb)}</TableCell>
                    <TableCell className="text-right border-l">{formatCurrency(branchTotals.femaleNo)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(branchTotals.femaleValue)}</TableCell>
                    <TableCell className="text-right">{branchTotals.no > 0 ? ((branchTotals.femaleNo / branchTotals.no) * 100).toFixed(1) : 0}%</TableCell>
                    <TableCell className="text-right border-l">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right border-l">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
