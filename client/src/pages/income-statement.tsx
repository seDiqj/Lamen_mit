import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Printer } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";

type AccountItem = {
  accountCode: string;
  accountName: string;
  amount: number;
};

type IncomeStatementData = {
  income: AccountItem[];
  expenses: AccountItem[];
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  period: { startDate: string; endDate: string };
};

export default function IncomeStatement() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(0, 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<IncomeStatementData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports/income-statement?startDate=${startDate}&endDate=${endDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch income statement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Income Statement</h1>
            <p className="text-muted-foreground text-sm">Profit and Loss report</p>
          </div>
        </div>
        {data && (
          <Button variant="outline" onClick={handlePrint} className="gap-2" data-testid="button-print">
            <Printer className="h-4 w-4" /> Print
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Select Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} data-testid="input-start-date" />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} data-testid="input-end-date" />
            </div>
            <Button onClick={fetchReport} disabled={isLoading} data-testid="button-generate">
              {isLoading ? "Loading..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card className="print:shadow-none">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Income Statement</CardTitle>
            <p className="text-muted-foreground text-sm">
              For the period {formatDate(startDate)} to {formatDate(endDate)}
            </p>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div>
              <h3 className="font-semibold text-green-600 flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4" /> Income
              </h3>
              <Table>
                <TableBody>
                  {data.income.length > 0 ? data.income.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono w-28">{item.accountCode}</TableCell>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell className="text-right font-mono w-40">{formatCurrency(item.amount.toString())}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">No income recorded</TableCell>
                    </TableRow>
                  )}
                  <TableRow className="bg-green-50 dark:bg-green-950/30 font-semibold">
                    <TableCell colSpan={2}>Total Income</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(data.totalIncome.toString())}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="font-semibold text-orange-600 flex items-center gap-2 mb-3">
                <TrendingDown className="h-4 w-4" /> Expenses
              </h3>
              <Table>
                <TableBody>
                  {data.expenses.length > 0 ? data.expenses.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono w-28">{item.accountCode}</TableCell>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell className="text-right font-mono w-40">{formatCurrency(item.amount.toString())}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">No expenses recorded</TableCell>
                    </TableRow>
                  )}
                  <TableRow className="bg-orange-50 dark:bg-orange-950/30 font-semibold">
                    <TableCell colSpan={2}>Total Expenses</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(data.totalExpenses.toString())}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className={`p-4 rounded-lg ${data.netIncome >= 0 ? 'bg-green-100 dark:bg-green-950/50' : 'bg-red-100 dark:bg-red-950/50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Net {data.netIncome >= 0 ? 'Income' : 'Loss'}</span>
                <span className={`text-2xl font-bold ${data.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(data.netIncome).toString())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
