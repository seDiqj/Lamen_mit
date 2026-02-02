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
import { Badge } from "@/components/ui/badge";
import { FileText, Printer } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";

type AccountItem = {
  accountCode: string;
  accountName: string;
  amount: number;
};

type BalanceSheetData = {
  assets: AccountItem[];
  liabilities: AccountItem[];
  equity: AccountItem[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  asOfDate: string;
};

export default function BalanceSheet() {
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<BalanceSheetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports/balance-sheet?asOfDate=${asOfDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch balance sheet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isBalanced = data ? Math.abs(data.totalAssets - (data.totalLiabilities + data.totalEquity)) < 0.01 : true;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <FileText className="h-6 w-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Balance Sheet</h1>
            <p className="text-muted-foreground text-sm">Statement of financial position</p>
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
            <Button onClick={fetchReport} disabled={isLoading} data-testid="button-generate">
              {isLoading ? "Loading..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <div className="grid md:grid-cols-2 gap-4 print:grid-cols-2">
          <Card className="print:shadow-none">
            <CardHeader className="border-b bg-blue-50 dark:bg-blue-950/30">
              <CardTitle className="text-lg text-blue-600">Assets</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableBody>
                  {data.assets.length > 0 ? data.assets.filter(a => a.amount !== 0).map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono w-24">{item.accountCode}</TableCell>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(item.amount.toString())}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">No assets recorded</TableCell>
                    </TableRow>
                  )}
                  <TableRow className="bg-blue-100 dark:bg-blue-950/50 font-bold">
                    <TableCell colSpan={2}>Total Assets</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(data.totalAssets.toString())}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="print:shadow-none">
            <CardHeader className="border-b bg-purple-50 dark:bg-purple-950/30">
              <CardTitle className="text-lg text-purple-600">Liabilities & Equity</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <h4 className="font-medium text-red-600 mb-2">Liabilities</h4>
                <Table>
                  <TableBody>
                    {data.liabilities.length > 0 ? data.liabilities.filter(l => l.amount !== 0).map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono w-24">{item.accountCode}</TableCell>
                        <TableCell>{item.accountName}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(item.amount.toString())}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-2 text-sm">No liabilities</TableCell>
                      </TableRow>
                    )}
                    <TableRow className="bg-red-50 dark:bg-red-950/30 font-semibold">
                      <TableCell colSpan={2}>Total Liabilities</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(data.totalLiabilities.toString())}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-medium text-purple-600 mb-2">Equity</h4>
                <Table>
                  <TableBody>
                    {data.equity.length > 0 ? data.equity.filter(e => e.amount !== 0).map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono w-24">{item.accountCode}</TableCell>
                        <TableCell>{item.accountName}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(item.amount.toString())}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-2 text-sm">No equity recorded</TableCell>
                      </TableRow>
                    )}
                    <TableRow className="bg-purple-100 dark:bg-purple-950/50 font-semibold">
                      <TableCell colSpan={2}>Total Equity</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(data.totalEquity.toString())}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="pt-2 border-t">
                <Table>
                  <TableBody>
                    <TableRow className="font-bold text-lg">
                      <TableCell colSpan={2}>Total Liabilities & Equity</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency((data.totalLiabilities + data.totalEquity).toString())}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {data && (
        <Card className={`${isBalanced ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'} print:shadow-none`}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={isBalanced ? "default" : "destructive"}>
                  {isBalanced ? "Balanced" : "Out of Balance"}
                </Badge>
                <span className="text-sm text-muted-foreground">As of {formatDate(asOfDate)}</span>
              </div>
              {!isBalanced && (
                <span className="text-red-600 font-medium">
                  Difference: {formatCurrency(Math.abs(data.totalAssets - (data.totalLiabilities + data.totalEquity)).toString())}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
