import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { Scale, Printer, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";

type TrialBalanceItem = {
  accountCode: string;
  accountName: string;
  accountType: string;
  debit: number;
  credit: number;
};

const accountTypeColors: Record<string, string> = {
  asset: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  liability: "bg-red-500/10 text-red-600 border-red-500/20",
  equity: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  income: "bg-green-500/10 text-green-600 border-green-500/20",
  expense: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export default function TrialBalance() {
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<TrialBalanceItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrialBalance = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports/trial-balance?asOfDate=${asOfDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch trial balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalDebit = data?.reduce((sum, item) => sum + item.debit, 0) || 0;
  const totalCredit = data?.reduce((sum, item) => sum + item.credit, 0) || 0;
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Scale className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Trial Balance</h1>
            <p className="text-muted-foreground text-sm">Summary of all account balances</p>
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
          <CardTitle className="text-lg">Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label>As of Date</Label>
              <Input type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} data-testid="input-as-of-date" />
            </div>
            <Button onClick={fetchTrialBalance} disabled={isLoading} data-testid="button-generate">
              {isLoading ? "Loading..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card className="print:shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Trial Balance</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">As of {formatDate(asOfDate)}</p>
              </div>
              <Badge variant={isBalanced ? "default" : "destructive"} className="text-sm">
                {isBalanced ? "Balanced" : "Out of Balance"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.filter(item => item.debit > 0 || item.credit > 0).map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono">{item.accountCode}</TableCell>
                    <TableCell>{item.accountName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={accountTypeColors[item.accountType]}>
                        {item.accountType.charAt(0).toUpperCase() + item.accountType.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.debit > 0 ? formatCurrency(item.debit.toString()) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.credit > 0 ? formatCurrency(item.credit.toString()) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
                {data.filter(item => item.debit > 0 || item.credit > 0).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No accounts with balances found.
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={3} className="text-right">Total:</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(totalDebit.toString())}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(totalCredit.toString())}</TableCell>
                </TableRow>
                {!isBalanced && (
                  <TableRow className="bg-red-50 dark:bg-red-950/30">
                    <TableCell colSpan={3} className="text-right text-red-600">Difference:</TableCell>
                    <TableCell colSpan={2} className="text-right font-mono text-red-600">
                      {formatCurrency(Math.abs(totalDebit - totalCredit).toString())}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
