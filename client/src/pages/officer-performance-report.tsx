import { useState, useEffect, useMemo, Fragment } from "react";
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
  month: string;
  target_amount: string | number;
  target_customers: string | number;
  actual_amount: string | number;
  actual_customers: string | number;
}

interface MonthData {
  target: number;
  actual: number;
  targetCustomers: number;
  actualCustomers: number;
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

  const months = useMemo(() => {
    const list: string[] = [];
    let [y, m] = effFrom.split("-").map(Number);
    const [ey, em] = effTo.split("-").map(Number);
    while ((y < ey || (y === ey && m <= em)) && list.length < 60) {
      list.push(`${y}-${String(m).padStart(2, "0")}`);
      m++;
      if (m > 12) { m = 1; y++; }
    }
    return list;
  }, [effFrom, effTo]);

  const multiMonth = months.length > 1;

  const data = useMemo(() => {
    const map = new Map<string, {
      officer_id: string;
      officer_name: string;
      branch_name: string;
      months: Record<string, MonthData>;
      targetAmount: number;
      actualAmount: number;
      targetCustomers: number;
      actualCustomers: number;
    }>();
    for (const r of rows) {
      let o = map.get(r.officer_id);
      if (!o) {
        o = {
          officer_id: r.officer_id,
          officer_name: r.officer_name,
          branch_name: r.branch_name,
          months: {},
          targetAmount: 0,
          actualAmount: 0,
          targetCustomers: 0,
          actualCustomers: 0,
        };
        map.set(r.officer_id, o);
      }
      const t = Number(r.target_amount) || 0;
      const a = Number(r.actual_amount) || 0;
      const tc = Number(r.target_customers) || 0;
      const ac = Number(r.actual_customers) || 0;
      const md = o.months[r.month] || { target: 0, actual: 0, targetCustomers: 0, actualCustomers: 0 };
      md.target += t;
      md.actual += a;
      md.targetCustomers += tc;
      md.actualCustomers += ac;
      o.months[r.month] = md;
      o.targetAmount += t;
      o.actualAmount += a;
      o.targetCustomers += tc;
      o.actualCustomers += ac;
    }
    return Array.from(map.values()).map((o) => ({
      ...o,
      amountPct: pct(o.actualAmount, o.targetAmount),
      customerPct: pct(o.actualCustomers, o.targetCustomers),
      hasTarget: o.targetAmount > 0 || o.targetCustomers > 0,
    }));
  }, [rows]);

  const monthTotals = useMemo(() => {
    const mt: Record<string, MonthData> = {};
    for (const m of months) mt[m] = { target: 0, actual: 0, targetCustomers: 0, actualCustomers: 0 };
    for (const o of data) {
      for (const m of months) {
        const md = o.months[m];
        if (md) {
          mt[m].target += md.target;
          mt[m].actual += md.actual;
          mt[m].targetCustomers += md.targetCustomers;
          mt[m].actualCustomers += md.actualCustomers;
        }
      }
    }
    return mt;
  }, [data, months]);

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
    const out = data.map((r, i) => {
      const row: Record<string, any> = {
        "#": i + 1,
        "Officer": r.officer_name,
        "Branch": r.branch_name,
      };
      if (multiMonth) {
        for (const m of months) {
          const md = r.months[m];
          row[`${monthLabel(m)} Target`] = md?.target || 0;
          row[`${monthLabel(m)} Disbursed`] = md?.actual || 0;
          row[`${monthLabel(m)} Tgt Cust`] = md?.targetCustomers || 0;
          row[`${monthLabel(m)} Act Cust`] = md?.actualCustomers || 0;
        }
      }
      row["Target Amount"] = r.targetAmount;
      row["Disbursed Amount"] = r.actualAmount;
      row["Amount %"] = r.hasTarget ? r.amountPct : "";
      row["Target Customers"] = r.targetCustomers;
      row["Actual Customers"] = r.actualCustomers;
      row["Customers %"] = r.targetCustomers > 0 ? r.customerPct : "";
      row["Status"] = !r.hasTarget ? "No Target" : r.targetAmount > 0 && r.actualAmount >= r.targetAmount ? "On Target" : "Below Target";
      return row;
    });
    const totalRow: Record<string, any> = { "#": "", "Officer": "TOTAL", "Branch": "" };
    if (multiMonth) {
      for (const m of months) {
        totalRow[`${monthLabel(m)} Target`] = monthTotals[m]?.target || 0;
        totalRow[`${monthLabel(m)} Disbursed`] = monthTotals[m]?.actual || 0;
        totalRow[`${monthLabel(m)} Tgt Cust`] = monthTotals[m]?.targetCustomers || 0;
        totalRow[`${monthLabel(m)} Act Cust`] = monthTotals[m]?.actualCustomers || 0;
      }
    }
    totalRow["Target Amount"] = totals.targetAmount;
    totalRow["Disbursed Amount"] = totals.actualAmount;
    totalRow["Amount %"] = overallPct;
    totalRow["Target Customers"] = totals.targetCustomers;
    totalRow["Actual Customers"] = totals.actualCustomers;
    totalRow["Customers %"] = pct(totals.actualCustomers, totals.targetCustomers);
    totalRow["Status"] = "";
    out.push(totalRow);
    const ws = XLSX.utils.json_to_sheet(out);
    const cols = [{ wch: 5 }, { wch: 24 }, { wch: 16 }];
    if (multiMonth) for (const _ of months) { cols.push({ wch: 14 }, { wch: 14 }, { wch: 9 }, { wch: 9 }); }
    cols.push({ wch: 16 }, { wch: 16 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 14 });
    ws["!cols"] = cols;
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
      `Total Target: ${formatCurrency(totals.targetAmount)}    Total Disbursed: ${formatCurrency(totals.actualAmount)}    Achievement: ${overallPct}%    Target Cust: ${totals.targetCustomers}    Actual Cust: ${totals.actualCustomers}    On Target: ${totals.onTarget}/${totals.withTarget}`,
      148,
      27,
      { align: "center" }
    );

    const monthCols = multiMonth ? months : [];
    const head = ["#", "Officer", "Branch"];
    for (const m of monthCols) {
      head.push(`${monthLabel(m)} Target`, `${monthLabel(m)} Disb.`, `${monthLabel(m)} Tgt Cust`, `${monthLabel(m)} Act Cust`);
    }
    head.push("Target Amount", "Disbursed", "Amt %", "Tgt Cust", "Act Cust", "Cust %", "Status");

    const body = data.map((r, i) => {
      const row: any[] = [i + 1, r.officer_name, r.branch_name];
      for (const m of monthCols) {
        const md = r.months[m];
        row.push(formatCurrency(md?.target || 0), formatCurrency(md?.actual || 0), md?.targetCustomers || 0, md?.actualCustomers || 0);
      }
      row.push(
        formatCurrency(r.targetAmount),
        formatCurrency(r.actualAmount),
        r.hasTarget ? `${r.amountPct}%` : "-",
        r.targetCustomers,
        r.actualCustomers,
        r.targetCustomers > 0 ? `${r.customerPct}%` : "-",
        !r.hasTarget ? "No Target" : r.targetAmount > 0 && r.actualAmount >= r.targetAmount ? "On Target" : "Below Target",
      );
      return row;
    });
    const totalRow: any[] = ["", "TOTAL", ""];
    for (const m of monthCols) {
      totalRow.push(
        formatCurrency(monthTotals[m]?.target || 0),
        formatCurrency(monthTotals[m]?.actual || 0),
        monthTotals[m]?.targetCustomers || 0,
        monthTotals[m]?.actualCustomers || 0,
      );
    }
    totalRow.push(
      formatCurrency(totals.targetAmount),
      formatCurrency(totals.actualAmount),
      `${overallPct}%`,
      totals.targetCustomers,
      totals.actualCustomers,
      `${pct(totals.actualCustomers, totals.targetCustomers)}%`,
      "",
    );
    body.push(totalRow);

    const columnStyles: Record<number, any> = { 0: { cellWidth: 8, halign: "center" } };
    let ci = 3;
    for (const _ of monthCols) {
      columnStyles[ci++] = { halign: "right" };
      columnStyles[ci++] = { halign: "right" };
      columnStyles[ci++] = { halign: "center" };
      columnStyles[ci++] = { halign: "center" };
    }
    columnStyles[ci] = { halign: "right" };
    columnStyles[ci + 1] = { halign: "right" };
    columnStyles[ci + 2] = { halign: "right" };
    columnStyles[ci + 3] = { halign: "center" };
    columnStyles[ci + 4] = { halign: "center" };
    columnStyles[ci + 5] = { halign: "right" };

    const fontSize = monthCols.length > 2 ? 5.5 : monthCols.length > 0 ? 7 : 8;
    autoTable(doc, {
      startY: 32,
      head: [head],
      body,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: 255, fontStyle: "bold", fontSize },
      styles: { fontSize, cellPadding: 1.5, overflow: "linebreak" },
      columnStyles,
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
            <p className="text-xs text-muted-foreground mt-1" data-testid="text-total-target-customers">{totals.targetCustomers} target customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Disbursed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-disbursed">{formatCurrency(totals.actualAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1" data-testid="text-total-actual-customers">{totals.actualCustomers} actual customers</p>
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
                  {multiMonth ? (
                    <>
                      <TableRow>
                        <TableHead rowSpan={2} className="align-bottom">Officer</TableHead>
                        <TableHead rowSpan={2} className="align-bottom">Branch</TableHead>
                        {months.map((m) => (
                          <TableHead key={m} colSpan={4} className="text-center border-l">{monthLabel(m)}</TableHead>
                        ))}
                        <TableHead rowSpan={2} className="text-right align-bottom border-l">Total Target</TableHead>
                        <TableHead rowSpan={2} className="text-right align-bottom">Total Disbursed</TableHead>
                        <TableHead rowSpan={2} className="text-right align-bottom">Amt %</TableHead>
                        <TableHead rowSpan={2} className="text-center align-bottom">Target Cust.</TableHead>
                        <TableHead rowSpan={2} className="text-center align-bottom">Actual Cust.</TableHead>
                        <TableHead rowSpan={2} className="align-bottom">Status</TableHead>
                      </TableRow>
                      <TableRow>
                        {months.map((m) => (
                          <Fragment key={m}>
                            <TableHead className="text-right text-xs border-l">Target</TableHead>
                            <TableHead className="text-right text-xs">Disbursed</TableHead>
                            <TableHead className="text-center text-xs">Tgt Cust</TableHead>
                            <TableHead className="text-center text-xs">Act Cust</TableHead>
                          </Fragment>
                        ))}
                      </TableRow>
                    </>
                  ) : (
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
                  )}
                </TableHeader>
                <TableBody>
                  {data.map((r) => (
                    <TableRow key={r.officer_id} data-testid={`row-officer-${r.officer_id}`}>
                      <TableCell className="font-medium" data-testid={`text-officer-name-${r.officer_id}`}>{r.officer_name}</TableCell>
                      <TableCell className="text-muted-foreground">{r.branch_name || "-"}</TableCell>
                      {multiMonth ? (
                        <>
                          {months.map((m) => {
                            const md = r.months[m];
                            return (
                              <Fragment key={m}>
                                <TableCell className="text-right text-xs font-mono border-l">{formatCurrency(md?.target || 0)}</TableCell>
                                <TableCell className="text-right text-xs font-mono">{formatCurrency(md?.actual || 0)}</TableCell>
                                <TableCell className="text-center text-xs">{md?.targetCustomers || 0}</TableCell>
                                <TableCell className="text-center text-xs">{md?.actualCustomers || 0}</TableCell>
                              </Fragment>
                            );
                          })}
                          <TableCell className="text-right font-mono border-l">{formatCurrency(r.targetAmount)}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(r.actualAmount)}</TableCell>
                          <TableCell className={`text-right text-xs font-semibold ${pctColor(r.amountPct, r.targetAmount > 0)}`}>
                            {r.targetAmount > 0 ? `${r.amountPct}%` : "-"}
                          </TableCell>
                          <TableCell className="text-center">{r.targetCustomers}</TableCell>
                          <TableCell className="text-center">{r.actualCustomers}</TableCell>
                          <TableCell>{statusBadge(r)}</TableCell>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>TOTAL</TableCell>
                    <TableCell></TableCell>
                    {multiMonth ? (
                      <>
                        {months.map((m) => (
                          <Fragment key={m}>
                            <TableCell className="text-right text-xs font-mono border-l">{formatCurrency(monthTotals[m]?.target || 0)}</TableCell>
                            <TableCell className="text-right text-xs font-mono">{formatCurrency(monthTotals[m]?.actual || 0)}</TableCell>
                            <TableCell className="text-center text-xs">{monthTotals[m]?.targetCustomers || 0}</TableCell>
                            <TableCell className="text-center text-xs">{monthTotals[m]?.actualCustomers || 0}</TableCell>
                          </Fragment>
                        ))}
                        <TableCell className="text-right font-mono border-l">{formatCurrency(totals.targetAmount)}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(totals.actualAmount)}</TableCell>
                        <TableCell className={`text-right text-xs ${pctColor(overallPct, totals.targetAmount > 0)}`}>
                          {totals.targetAmount > 0 ? `${overallPct}%` : "-"}
                        </TableCell>
                        <TableCell className="text-center">{totals.targetCustomers}</TableCell>
                        <TableCell className="text-center">{totals.actualCustomers}</TableCell>
                        <TableCell></TableCell>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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
