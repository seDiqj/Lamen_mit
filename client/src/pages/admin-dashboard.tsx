import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Target, Building2, Briefcase } from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AF", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const hrStaffData = {
  totalStaff: 319,
  totalFemaleStaff: 118,
  totalCreditOfficers: 108,
  femaleCreditOfficers: 66,
  loansClosing: {
    feb25: 4,
    mar25: 456,
    apr25: 480,
  },
  caseloadJan25: 88.78,
  productivityJan25: 0.73,
};

const disbursementData = {
  target: 66000000,
  disbursedNo: 801,
  actual: 47222662,
  percentage: 71.5,
};

const branchWiseData = [
  { branch: "Taimani", no: 1317, olb: 33074000, femaleNo: 830, femaleValue: 18099009, femalePercent: 54.7, par1_30No: 3, par1_30Percent: 0.2, par30No: 1, par30Percent: 0.1 },
  { branch: "Chaman", no: 1203, olb: 31124153, femaleNo: 689, femaleValue: 15581524, femalePercent: 50.1, par1_30No: 0, par1_30Percent: 0.0, par30No: 0, par30Percent: 0.0 },
  { branch: "Khushalkhan", no: 1796, olb: 45513013, femaleNo: 1129, femaleValue: 27271983, femalePercent: 59.9, par1_30No: 1, par1_30Percent: 0.1, par30No: 0, par30Percent: 0.0 },
  { branch: "Mazar", no: 1616, olb: 45413940, femaleNo: 806, femaleValue: 19581261, femalePercent: 43.1, par1_30No: 0, par1_30Percent: 0.0, par30No: 0, par30Percent: 0.0 },
  { branch: "Herat", no: 353, olb: 11706047, femaleNo: 204, femaleValue: 5937402, femalePercent: 50.7, par1_30No: 1, par1_30Percent: 0.4, par30No: 0, par30Percent: 0.0 },
  { branch: "Khair Khana", no: 235, olb: 10387784, femaleNo: 53, femaleValue: 1319077, femalePercent: 12.7, par1_30No: 0, par1_30Percent: 0.0, par30No: 0, par30Percent: 0.0 },
  { branch: "Dashti Barchi", no: 638, olb: 28082809, femaleNo: 287, femaleValue: 7267377, femalePercent: 25.9, par1_30No: 0, par1_30Percent: 0.0, par30No: 0, par30Percent: 0.0 },
  { branch: "Charikar", no: 291, olb: 9742101, femaleNo: 24, femaleValue: 628135, femalePercent: 6.4, par1_30No: 0, par1_30Percent: 0.0, par30No: 0, par30Percent: 0.0 },
  { branch: "Samangan", no: 368, olb: 16745416, femaleNo: 104, femaleValue: 2987931, femalePercent: 17.8, par1_30No: 0, par1_30Percent: 0.0, par30No: 0, par30Percent: 0.0 },
  { branch: "Pul e Khumri", no: 160, olb: 6738235, femaleNo: 63, femaleValue: 2403688, femalePercent: 35.7, par1_30No: 0, par1_30Percent: 0.0, par30No: 0, par30Percent: 0.0 },
  { branch: "Mandavi", no: 452, olb: 17051171, femaleNo: 257, femaleValue: 6478763, femalePercent: 38.0, par1_30No: 3, par1_30Percent: 0.7, par30No: 0, par30Percent: 0.0 },
  { branch: "Sar e Pul", no: 360, olb: 13543956, femaleNo: 68, femaleValue: 1903755, femalePercent: 14.1, par1_30No: 0, par1_30Percent: 0.0, par30No: 0, par30Percent: 0.0 },
  { branch: "Sheberghan", no: 629, olb: 16482580, femaleNo: 188, femaleValue: 3831427, femalePercent: 23.2, par1_30No: 0, par1_30Percent: 0.0, par30No: 0, par30Percent: 0.0 },
  { branch: "Takhar", no: 296, olb: 11339283, femaleNo: 34, femaleValue: 1174964, femalePercent: 10.4, par1_30No: 8, par1_30Percent: 0.0, par30No: 0, par30Percent: 0.0 },
];

const branchTotals = {
  no: 9714,
  olb: 296944488,
  femaleNo: 4736,
  femaleValue: 114466496,
  femalePercent: 38.5,
};

const sectorWiseData = [
  { sector: "Trade", olb: 76663292, percentage: 25.8 },
  { sector: "Services", olb: 135497641, percentage: 45.6 },
  { sector: "Manufacturing", olb: 1605228, percentage: 0.5 },
  { sector: "Handicrafts", olb: 12851580, percentage: 4.3 },
  { sector: "Agriculture", olb: 9470251, percentage: 3.2 },
  { sector: "Livestock", olb: 49995935, percentage: 16.8 },
  { sector: "Consumer Product", olb: 10860561, percentage: 3.7 },
];

export default function AdminDashboard() {
  const femaleStaffPercent = ((hrStaffData.totalFemaleStaff / hrStaffData.totalStaff) * 100).toFixed(1);
  const creditOfficersPercent = ((hrStaffData.totalCreditOfficers / hrStaffData.totalStaff) * 100).toFixed(1);
  const femaleCOPercent = ((hrStaffData.femaleCreditOfficers / hrStaffData.totalCreditOfficers) * 100).toFixed(1);

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
                  <TableCell className="text-right">{hrStaffData.totalStaff}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Female Staff</TableCell>
                  <TableCell className="text-right">{hrStaffData.totalFemaleStaff}</TableCell>
                  <TableCell className="text-right">{femaleStaffPercent}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Credit Officers</TableCell>
                  <TableCell className="text-right">{hrStaffData.totalCreditOfficers}</TableCell>
                  <TableCell className="text-right">{creditOfficersPercent}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Female Credit Officers</TableCell>
                  <TableCell className="text-right">{hrStaffData.femaleCreditOfficers}</TableCell>
                  <TableCell className="text-right">{femaleCOPercent}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <p className="text-xs text-muted-foreground">Caseload (Jan, 25)</p>
                <p className="text-xl font-bold text-blue-600">{hrStaffData.caseloadJan25}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="text-xs text-muted-foreground">Productivity (Jan, 25)</p>
                <p className="text-xl font-bold text-green-600">{hrStaffData.productivityJan25}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Loans Closing Date</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground">Feb-25</p>
                  <p className="font-semibold">{hrStaffData.loansClosing.feb25}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground">Mar-25</p>
                  <p className="font-semibold">{hrStaffData.loansClosing.mar25}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted text-center">
                  <p className="text-xs text-muted-foreground">Apr-25</p>
                  <p className="font-semibold">{hrStaffData.loansClosing.apr25}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Total Disbursement (01-Feb-2025 till date)
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
                  <TableCell className="font-medium">{formatCurrency(disbursementData.target)}</TableCell>
                  <TableCell className="text-right">{disbursementData.disbursedNo}</TableCell>
                  <TableCell className="text-right">{formatCurrency(disbursementData.actual)}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">{disbursementData.percentage}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress toward target</span>
                <span className="font-medium">{disbursementData.percentage}%</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                  style={{ width: `${disbursementData.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>{formatCurrency(disbursementData.target)}</span>
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
              {sectorWiseData.map((sector) => (
                <TableRow key={sector.sector}>
                  <TableCell className="font-medium">{sector.sector}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sector.olb)}</TableCell>
                  <TableCell className="text-right">{sector.percentage}%</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{formatCurrency(296944488)}</TableCell>
                <TableCell className="text-right">100.0%</TableCell>
              </TableRow>
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
                <TableHead rowSpan={2}>Branch</TableHead>
                <TableHead rowSpan={2} className="text-right">No</TableHead>
                <TableHead rowSpan={2} className="text-right">OLB</TableHead>
                <TableHead colSpan={3} className="text-center border-l">Total Female Clients</TableHead>
                <TableHead colSpan={2} className="text-center border-l">PAR 1-30</TableHead>
                <TableHead colSpan={2} className="text-center border-l">PAR 30+</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-right border-l">No</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Value %</TableHead>
                <TableHead className="text-right border-l">No</TableHead>
                <TableHead className="text-right">No %</TableHead>
                <TableHead className="text-right border-l">No</TableHead>
                <TableHead className="text-right">No %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branchWiseData.map((branch) => (
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
                <TableCell className="text-right">{branchTotals.femalePercent}%</TableCell>
                <TableCell className="text-right border-l">-</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right border-l">-</TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
