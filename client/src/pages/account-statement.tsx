import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSpreadsheet, Download, Printer } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";

type Account = {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
};

type Transaction = {
  entryDate: string;
  entryNumber: string;
  description: string;
  reference: string | null;
  debitAmount: string;
  creditAmount: string;
  balance: number;
};

type StatementData = {
  account: Account;
  openingBalance: number;
  transactions: Transaction[];
  closingBalance: number;
};

export default function AccountStatement() {
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [statement, setStatement] = useState<StatementData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: accounts = [] } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const fetchStatement = async () => {
    if (!selectedAccount) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports/account-statement/${selectedAccount}?startDate=${startDate}&endDate=${endDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStatement(data);
    } catch (error) {
      console.error("Failed to fetch statement:", error);
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
          <div className="p-2 bg-violet-500/10 rounded-lg">
            <FileSpreadsheet className="h-6 w-6 text-violet-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Account Statement</h1>
            <p className="text-muted-foreground text-sm">View transaction history for any account</p>
          </div>
        </div>
        {statement && (
          <Button variant="outline" onClick={handlePrint} className="gap-2" data-testid="button-print">
            <Printer className="h-4 w-4" /> Print
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Select Account & Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2 min-w-[250px]">
              <Label>Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger data-testid="select-account">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id}>{acc.accountCode} - {acc.accountName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} data-testid="input-start-date" />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} data-testid="input-end-date" />
            </div>
            <Button onClick={fetchStatement} disabled={!selectedAccount || isLoading} data-testid="button-generate">
              {isLoading ? "Loading..." : "Generate Statement"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {statement && (
        <Card className="print:shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{statement.account.accountCode} - {statement.account.accountName}</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Statement period: {formatDate(startDate)} to {formatDate(endDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Opening Balance</p>
                <p className="text-xl font-bold">{formatCurrency(statement.openingBalance.toString())}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Entry #</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={6} className="font-medium">Opening Balance</TableCell>
                  <TableCell className="text-right font-mono font-medium">{formatCurrency(statement.openingBalance.toString())}</TableCell>
                </TableRow>
                {statement.transactions.length > 0 ? statement.transactions.map((tx, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{formatDate(tx.entryDate)}</TableCell>
                    <TableCell className="font-mono">{tx.entryNumber}</TableCell>
                    <TableCell>{tx.description || "-"}</TableCell>
                    <TableCell>{tx.reference || "-"}</TableCell>
                    <TableCell className="text-right font-mono">
                      {Number(tx.debitAmount) > 0 ? formatCurrency(tx.debitAmount) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {Number(tx.creditAmount) > 0 ? formatCurrency(tx.creditAmount) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(tx.balance.toString())}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No transactions found in this period.
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell colSpan={6}>Closing Balance</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(statement.closingBalance.toString())}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
