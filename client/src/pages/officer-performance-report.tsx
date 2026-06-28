import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBranch } from "@/contexts/branch-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Target, FileSpreadsheet, FileText, TrendingUp, Users, Banknote, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OfficerRow {
  officer_id: string;
  officer_name: string;
  branch_name: string;
  target_amount: string | number;
  target_customers: string | number;
  actual_amount: string | number;
  actual_customers: string | number;
}

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function pct(actual: number, target: number): number {
  if (!target || target <= 0) return 0;
  return Math.round((actual / target) * 100);
}

function pctColor(p: number, hasTarget: boolean): string {
  if (!hasTarget) return "text-muted-foreground";
  if (p >= 100) return "text-green-600 dark:text-green-400";
  if (p >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function monthLabel(m: string): string {
  const [y, mo] = m.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[parseInt(mo, 10) - 1] || mo} ${y}`;
}

export default function OfficerPerformanceReport() {
  const { selectedBranchId } = useBranch();
  const [fromMonth, setFromMonth] = useState(currentMonth());
  const [toMonth, setToMonth] = useState(currentMonth());

  const effFrom = fromMonth <= toMonth ? fromMonth : toMonth;
  const effTo = fromMonth <= toMonth ? toMonth : fromMonth;

  const { data: rows = [], isLoading } = useQuery<OfficerRow[]>({
    queryKey: ["/api/reports/officer-performance", effFrom, effTo, selectedBranchId],
    queryFn: async () => {
      const params = new URLSearchParams({ fromMonth: effFrom, toMonth: effTo });
      if (selectedBranchId) params.set("branchId", selectedBranchId);
      const res = await fetch(`/api/reports/officer-performance?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch officer performance");
      return res.json();
    },
  });

  const data = useMemo(() => {
    return rows.map((r) => {
      const targetAmount = Number(r.target_amount) || 0;
      const actualAmount = Number(r.actual_amount) || 0;
      const targetCustomers = Number(r.target_customers) || 0;
      const actualCustomers = Number(r.actual_customers) || 0;
      return {
        ...r,
        targetAmount,
        actualAmount,
        targetCustomers,
        actualCustomers,
        amountPct: pct(actualAmount, targetAmount),
        customerPct: pct(actualCustomers, targetCustomers),
        hasTarget: targetAmount > 0 || targetCustomers > 0,
      };
    });
  }, [rows]);

  const totals = useMemo(() => {
    const t = {
      targetAmount: 0,
      actualAmount: 0,
      targetCustomers: 0,
      actualCustomers: 0,
      onTarget: 0,
      withTarget: 0,
    };
    for (const r of data) {
      t.targetAmount += r.targetAmount;
      t.actualAmount += r.actualAmount;
      t.targetCustomers += r.targetCustomers;
      t.actualCustomers += r.actualCustomers;
      if (r.hasTarget) {
        t.withTarget++;
        if (r.targetAmount > 0 && r.actualAmount >= r.targetAmount) t.onTarget++;
      }
    }
    return t;
  }, [data]);

  const overallPct = pct(totals.actualAmount, totals.targetAmount);
  const rangeLabel = effFrom === effTo ? monthLabel(effFrom) : `${monthLabel(effFrom)} - ${monthLabel(effTo)}`;

  const statusBadge = (r: (typeof data)[number]) => {
    if (!r.hasTarget) return <Badge variant="outline" className="text-muted-foreground">No Target</Badge>;
    if (r.targetAmount > 0 && r.actualAmount >= r.targetAmount)
      return <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-100">On Target</Badge>;
    return <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100">Below Target</Badge>;
  };

  const exportExcel = () => {
    const out = data.map((r, i) => ({
      "#": i + 1,
      "Officer": r.officer_name,
      "Branch": r.branch_name,
      "Target Amount": r.targetAmount,
      "Disbursed Amount": r.actualAmount,
      "Amount %": r.hasTarget ? r.amountPct : "",
      "Target Customers": r.targetCustomers,
      "Actual Customers": r.actualCustomers,
      "Customers %": r.targetCustomers > 0 ? r.customerPct : "",
      "Status": !r.hasTarget ? "No Target" : r.targetAmount > 0 && r.actualAmount >= r.targetAmount ? "On Target" : "Below Target",
    }));
    out.push({
      "#": "" as any,
      "Officer": "TOTAL",
      "Branch": "",
      "Target Amount": totals.targetAmount,
      "Disbursed Amount": totals.actualAmount,
      "Amount %": overallPct as any,
      "Target Customers": totals.targetCustomers,
      "Actual Customers": totals.actualCustomers,
      "Customers %": pct(totals.actualCustomers, totals.targetCustomers) as any,
      "Status": "",
    });
    const ws = XLSX.utils.json_to_sheet(out);
    ws["!cols"] = [{ wch: 5 }, { wch: 24 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Officer Performance");
    XLSX.writeFile(wb, `Officer_Performance_${effFrom}_${effTo}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Financing Officer Monthly Performance Report", 148, 14, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Period: ${rangeLabel}`, 148, 21, { align: "center" });
    doc.text(
      `Total Target: ${formatCurrency(totals.targetAmount)}    Total Disbursed: ${formatCurrency(totals.actualAmount)}    Achievement: ${overallPct}%    On Target: ${totals.onTarget}/${totals.withTarget}`,
      148,
      27,
      { align: "center" }
    );

    const body = data.map((r, i) => [
      i + 1,
      r.officer_name,
      r.branch_name,
      formatCurrency(r.targetAmount),
      formatCurrency(r.actualAmount),
      r.hasTarget ? `${r.amountPct}%` : "-",
      r.targetCustomers,
      r.actualCustomers,
      r.targetCustomers > 0 ? `${r.customerPct}%` : "-",
      !r.hasTarget ? "No Target" : r.targetAmount > 0 && r.actualAmount >= r.targetAmount ? "On Target" : "Below Target",
    ]);
    body.push([
      "" as any,
      "TOTAL",
      "",
      formatCurrency(totals.targetAmount),
      formatCurrency(totals.actualAmount),
      `${overallPct}%`,
      totals.targetCustomers,
      totals.actualCustomers,
      `${pct(totals.actualCustomers, totals.targetCustomers)}%`,
      "",
    ]);

    autoTable(doc, {
      startY: 32,
      head: [["#", "Officer", "Branch", "Target Amount", "Disbursed", "Amt %", "Tgt Cust", "Act Cust", "Cust %", "Status"]],
      body,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: 255, fontStyle: "bold", fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 1.5, overflow: "linebreak" },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "center" },
        7: { halign: "center" },
        8: { halign: "right" },
      },
    });
    doc.save(`Officer_Performance_${effFrom}_${effTo}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 rounded-lg">
            <Target className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">
              Financing Officer Performance Report
            </h1>
            <p className="text-sm text-muted-foreground">Monthly disbursement performance against target</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportExcel} disabled={data.length === 0} data-testid="button-export-excel">
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
          </Button>
          <Button variant="outline" onClick={exportPDF} disabled={data.length === 0} data-testid="button-export-pdf">
            <FileText className="h-4 w-4 mr-2" /> PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 pt-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="from-month">From Month</Label>
            <Input
              id="from-month"
              type="month"
              value={fromMonth}
              onChange={(e) => setFromMonth(e.target.value)}
              className="w-44"
              data-testid="input-from-month"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="to-month">To Month</Label>
            <Input
              id="to-month"
              type="month"
              value={toMonth}
              onChange={(e) => setToMonth(e.target.value)}
              className="w-44"
              data-testid="input-to-month"
            />
          </div>
          <div className="text-sm text-muted-foreground pb-2.5">
            Showing: <span className="font-medium text-foreground">{rangeLabel}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Target</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-target">{formatCurrency(totals.targetAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Disbursed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-disbursed">{formatCurrency(totals.actualAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Achievement</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${pctColor(overallPct, totals.targetAmount > 0)}`} data-testid="text-overall-achievement">
              {totals.targetAmount > 0 ? `${overallPct}%` : "-"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Officers On Target</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-on-target">{totals.onTarget} of {totals.withTarget}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Officer Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Loading...</div>
          ) : data.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground" data-testid="text-no-data">
              No officer activity or targets found for this period.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Officer</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Target Amount</TableHead>
                    <TableHead className="text-right">Disbursed</TableHead>
                    <TableHead className="w-44">Amount Achieved</TableHead>
                    <TableHead className="text-center">Target Cust.</TableHead>
                    <TableHead className="text-center">Actual Cust.</TableHead>
                    <TableHead className="w-44">Customers Achieved</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((r) => (
                    <TableRow key={r.officer_id} data-testid={`row-officer-${r.officer_id}`}>
                      <TableCell className="font-medium" data-testid={`text-officer-name-${r.officer_id}`}>{r.officer_name}</TableCell>
                      <TableCell className="text-muted-foreground">{r.branch_name || "-"}</TableCell>
                      <TableCell className="text-right">{formatCurrency(r.targetAmount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(r.actualAmount)}</TableCell>
                      <TableCell>
                        {r.targetAmount > 0 ? (
                          <div className="flex items-center gap-2">
                            <Progress value={Math.min(r.amountPct, 100)} className="h-2" />
                            <span className={`text-xs font-semibold w-12 text-right ${pctColor(r.amountPct, true)}`}>{r.amountPct}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No target</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{r.targetCustomers}</TableCell>
                      <TableCell className="text-center">{r.actualCustomers}</TableCell>
                      <TableCell>
                        {r.targetCustomers > 0 ? (
                          <div className="flex items-center gap-2">
                            <Progress value={Math.min(r.customerPct, 100)} className="h-2" />
                            <span className={`text-xs font-semibold w-12 text-right ${pctColor(r.customerPct, true)}`}>{r.customerPct}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No target</span>
                        )}
                      </TableCell>
                      <TableCell>{statusBadge(r)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>TOTAL</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.targetAmount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.actualAmount)}</TableCell>
                    <TableCell className={pctColor(overallPct, totals.targetAmount > 0)}>
                      {totals.targetAmount > 0 ? `${overallPct}%` : "-"}
                    </TableCell>
                    <TableCell className="text-center">{totals.targetCustomers}</TableCell>
                    <TableCell className="text-center">{totals.actualCustomers}</TableCell>
                    <TableCell className={pctColor(pct(totals.actualCustomers, totals.targetCustomers), totals.targetCustomers > 0)}>
                      {totals.targetCustomers > 0 ? `${pct(totals.actualCustomers, totals.targetCustomers)}%` : "-"}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
