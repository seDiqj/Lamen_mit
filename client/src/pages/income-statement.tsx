import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Eye, EyeOff, FileSpreadsheet, FileText, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Amounts = Record<string, number>;

type ClassColumn = { key: string; name: string; code: string | null };

type AccountChild = {
  accountCode: string;
  accountName: string;
  amounts: Amounts;
  amount: number;
};

type AccountGroup = {
  accountCode: string;
  accountName: string;
  parentAmount: number;
  parentAmounts: Amounts;
  amounts: Amounts;
  total: number;
  children: AccountChild[];
};

type IncomeStatementData = {
  classColumns: ClassColumn[];
  operatingIncomeGroups: AccountGroup[];
  nonOperatingIncomeGroups: AccountGroup[];
  costOfFinancingGroups: AccountGroup[];
  operatingExpenseGroups: AccountGroup[];
  nonOperatingExpenseGroups: AccountGroup[];
  totalOperatingIncome: number;
  totalNonOperatingIncome: number;
  totalIncome: number;
  totalCostOfFinancing: number;
  grossProfit: number;
  totalOperatingExpenses: number;
  totalNonOperatingExpenses: number;
  totalExpenses: number;
  netIncome: number;
  totalOperatingIncomeAmounts: Amounts;
  totalNonOperatingIncomeAmounts: Amounts;
  totalIncomeAmounts: Amounts;
  totalCostOfFinancingAmounts: Amounts;
  grossProfitAmounts: Amounts;
  totalOperatingExpensesAmounts: Amounts;
  totalNonOperatingExpensesAmounts: Amounts;
  totalExpensesAmounts: Amounts;
  netIncomeAmounts: Amounts;
  period: { startDate: string; endDate: string };
};

function formatAFN(amount: number): string {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAFNTotal(amount: number): string {
  return `AFN${formatAFN(amount)}`;
}

// Row model for the crosstab table.
type Variant = "section" | "subsection" | "group" | "child" | "groupTotal" | "sectionTotal" | "derived";

type TableRow = {
  id: string;
  label: string;
  indent: number;
  variant: Variant;
  amounts?: Amounts;
  total?: number;
  toggleId?: string; // present when this row toggles a collapsible region
  ancestors: string[]; // toggle ids that hide this row when collapsed
  netSign?: "profit" | "loss"; // for net income highlighting
};

export default function IncomeStatement() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(0, 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [classId, setClassId] = useState("all");
  const [classOptions, setClassOptions] = useState<{ id: string; name: string; code: string | null }[]>([]);
  const [data, setData] = useState<IncomeStatementData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showZeroBalances, setShowZeroBalances] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/classes", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((rows) => {
        if (Array.isArray(rows)) {
          setClassOptions(rows.map((c: any) => ({ id: c.id, name: c.name, code: c.code ?? null })));
        }
      })
      .catch(() => {});
  }, []);

  const toggle = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (classId && classId !== "all") params.set("classId", classId);
      const res = await fetch(`/api/reports/income-statement?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
      setCollapsed(new Set());
    } catch (error) {
      console.error("Failed to fetch income statement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ClassColumn[] = data?.classColumns ?? [];

  // Build the flat list of rows for the crosstab.
  const buildRows = (d: IncomeStatementData): TableRow[] => {
    const rows: TableRow[] = [];

    const groupHasActivity = (g: AccountGroup) => g.total !== 0 || g.children.some((c) => c.amount !== 0);

    const pushGroups = (groups: AccountGroup[], ancestors: string[], baseIndent: number) => {
      const visibleGroups = showZeroBalances ? groups : groups.filter(groupHasActivity);
      for (const g of visibleGroups) {
        const hasChildren = g.children.length > 0;
        if (hasChildren) {
          const groupToggle = `grp-${ancestors.join("-")}-${g.accountCode}`;
          rows.push({
            id: groupToggle,
            label: `${g.accountCode} ${g.accountName}`,
            indent: baseIndent,
            variant: "group",
            amounts: g.parentAmounts,
            total: g.parentAmount,
            toggleId: groupToggle,
            ancestors,
          });
          const childAncestors = [...ancestors, groupToggle];
          const visibleChildren = showZeroBalances ? g.children : g.children.filter((c) => c.amount !== 0);
          for (const c of visibleChildren) {
            rows.push({
              id: `${groupToggle}-${c.accountCode}`,
              label: `${c.accountCode} ${c.accountName}`,
              indent: baseIndent + 1,
              variant: "child",
              amounts: c.amounts,
              total: c.amount,
              ancestors: childAncestors,
            });
          }
          rows.push({
            id: `${groupToggle}-total`,
            label: `Total for ${g.accountCode} ${g.accountName}`,
            indent: baseIndent + 1,
            variant: "groupTotal",
            amounts: g.amounts,
            total: g.total,
            ancestors: childAncestors,
          });
        } else {
          rows.push({
            id: `leaf-${ancestors.join("-")}-${g.accountCode}`,
            label: `${g.accountCode} ${g.accountName}`,
            indent: baseIndent,
            variant: "child",
            amounts: g.amounts,
            total: g.total,
            ancestors,
          });
        }
      }
    };

    // ----- INCOME -----
    rows.push({ id: "sec-income", label: "Income", indent: 0, variant: "section", toggleId: "sec-income", ancestors: [] });
    // Operating Income subsection
    rows.push({ id: "sub-opinc", label: "Operating Income", indent: 1, variant: "subsection", toggleId: "sub-opinc", ancestors: ["sec-income"] });
    pushGroups(d.operatingIncomeGroups, ["sec-income", "sub-opinc"], 2);
    rows.push({ id: "sub-opinc-total", label: "Total for Operating Income", indent: 2, variant: "sectionTotal", amounts: d.totalOperatingIncomeAmounts, total: d.totalOperatingIncome, ancestors: ["sec-income", "sub-opinc"] });
    // Non-Operating Income subsection
    rows.push({ id: "sub-noinc", label: "Non-Operating Income", indent: 1, variant: "subsection", toggleId: "sub-noinc", ancestors: ["sec-income"] });
    pushGroups(d.nonOperatingIncomeGroups, ["sec-income", "sub-noinc"], 2);
    rows.push({ id: "sub-noinc-total", label: "Total for Non-Operating Income", indent: 2, variant: "sectionTotal", amounts: d.totalNonOperatingIncomeAmounts, total: d.totalNonOperatingIncome, ancestors: ["sec-income", "sub-noinc"] });
    rows.push({ id: "total-income", label: "Total Income", indent: 1, variant: "sectionTotal", amounts: d.totalIncomeAmounts, total: d.totalIncome, ancestors: ["sec-income"] });

    // ----- COST OF FINANCING -----
    rows.push({ id: "sec-cof", label: "Cost of Financing", indent: 0, variant: "section", toggleId: "sec-cof", ancestors: [] });
    pushGroups(d.costOfFinancingGroups, ["sec-cof"], 1);
    rows.push({ id: "sec-cof-total", label: "Total for Cost of Financing", indent: 1, variant: "sectionTotal", amounts: d.totalCostOfFinancingAmounts, total: d.totalCostOfFinancing, ancestors: ["sec-cof"] });

    // ----- GROSS PROFIT -----
    rows.push({ id: "gross-profit", label: "Gross Profit", indent: 0, variant: "derived", amounts: d.grossProfitAmounts, total: d.grossProfit, ancestors: [] });

    // ----- EXPENSES -----
    rows.push({ id: "sec-exp", label: "Expenses", indent: 0, variant: "section", toggleId: "sec-exp", ancestors: [] });
    rows.push({ id: "sub-opexp", label: "Operating Expenses", indent: 1, variant: "subsection", toggleId: "sub-opexp", ancestors: ["sec-exp"] });
    pushGroups(d.operatingExpenseGroups, ["sec-exp", "sub-opexp"], 2);
    rows.push({ id: "sub-opexp-total", label: "Total for Operating Expenses", indent: 2, variant: "sectionTotal", amounts: d.totalOperatingExpensesAmounts, total: d.totalOperatingExpenses, ancestors: ["sec-exp", "sub-opexp"] });
    rows.push({ id: "sub-noexp", label: "Non-Operating Expenses", indent: 1, variant: "subsection", toggleId: "sub-noexp", ancestors: ["sec-exp"] });
    pushGroups(d.nonOperatingExpenseGroups, ["sec-exp", "sub-noexp"], 2);
    rows.push({ id: "sub-noexp-total", label: "Total for Non-Operating Expenses", indent: 2, variant: "sectionTotal", amounts: d.totalNonOperatingExpensesAmounts, total: d.totalNonOperatingExpenses, ancestors: ["sec-exp", "sub-noexp"] });
    rows.push({ id: "total-expenses", label: "Total Expenses", indent: 1, variant: "sectionTotal", amounts: d.totalExpensesAmounts, total: d.totalExpenses, ancestors: ["sec-exp"] });

    // ----- NET INCOME -----
    rows.push({
      id: "net-income",
      label: d.netIncome >= 0 ? "Net Profit" : "Net Loss",
      indent: 0,
      variant: "derived",
      amounts: d.netIncomeAmounts,
      total: d.netIncome,
      ancestors: [],
      netSign: d.netIncome >= 0 ? "profit" : "loss",
    });

    return rows;
  };

  const allRows = data ? buildRows(data) : [];
  const visibleRows = allRows.filter((r) => !r.ancestors.some((a) => collapsed.has(a)));

  const cellValue = (row: TableRow, key: string): string => {
    const v = row.amounts?.[key] ?? 0;
    const isTotalRow = row.variant === "groupTotal" || row.variant === "sectionTotal" || row.variant === "derived";
    if (v === 0 && !isTotalRow) return "";
    if (v === 0 && isTotalRow) return formatAFN(0);
    return formatAFN(v);
  };

  const totalCellValue = (row: TableRow): string => {
    const t = row.total ?? 0;
    const isTotalRow = row.variant === "groupTotal" || row.variant === "sectionTotal" || row.variant === "derived";
    if (isTotalRow) return formatAFNTotal(t);
    if (t === 0) return "";
    return formatAFN(t);
  };

  // ----- EXPORTS -----
  const handleExportExcel = () => {
    if (!data) return;
    const header = ["Account", ...columns.map((c) => (c.code ? `${c.code} - ${c.name}` : c.name)), "Total"];
    const totalCols = header.length;
    const blankRow: (string | number)[] = Array(totalCols).fill("");
    const titleRow = (text: string): (string | number)[] => {
      const r = Array(totalCols).fill("");
      r[0] = text;
      return r;
    };
    const aoa: (string | number)[][] = [
      titleRow("Lamen Microfinance Institution (LMI)"),
      titleRow("Profit and Loss"),
      titleRow(`${formatDate(startDate)} - ${formatDate(endDate)}`),
      blankRow,
      header,
    ];

    for (const row of allRows) {
      const line: (string | number)[] = ["  ".repeat(row.indent) + row.label];
      const isTotalRow = row.variant === "groupTotal" || row.variant === "sectionTotal" || row.variant === "derived";
      for (const c of columns) {
        const v = row.amounts?.[c.key] ?? 0;
        if (row.amounts === undefined) line.push("");
        else if (v === 0 && !isTotalRow) line.push("");
        else line.push(v);
      }
      line.push(row.total === undefined ? "" : (row.total));
      aoa.push(line);
    }

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [{ wch: 45 }, ...columns.map(() => ({ wch: 16 })), { wch: 18 }];
    ws["!merges"] = [0, 1, 2].map((r) => ({ s: { r, c: 0 }, e: { r, c: totalCols - 1 } }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profit and Loss");
    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    XLSX.writeFile(wb, `Profit_and_Loss_${startStr}_to_${endStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const landscape = columns.length > 3;
    const doc = new jsPDF({ orientation: landscape ? "landscape" : "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const center = pageWidth / 2;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Lamen Microfinance Institution (LMI)", center, 14, { align: "center" });
    doc.setFontSize(13);
    doc.text("Profit and Loss", center, 21, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${formatDate(startDate)} - ${formatDate(endDate)}`, center, 27, { align: "center" });

    const head = [["Account", ...columns.map((c) => (c.code ? `${c.code} ${c.name}` : c.name)), "Total"]];
    const body: any[] = [];

    for (const row of allRows) {
      const isTotalRow = row.variant === "groupTotal" || row.variant === "sectionTotal" || row.variant === "derived";
      const isHeader = row.variant === "section" || row.variant === "subsection" || row.variant === "group";
      const bold = isTotalRow || isHeader;
      const labelCell = {
        content: "  ".repeat(row.indent) + row.label,
        styles: { fontStyle: bold ? "bold" : "normal" },
      };
      const cells: any[] = [labelCell];
      for (const c of columns) {
        cells.push({ content: cellValue(row, c.key), styles: { halign: "right", fontStyle: bold ? "bold" : "normal" } });
      }
      cells.push({ content: totalCellValue(row), styles: { halign: "right", fontStyle: bold ? "bold" : "normal" } });
      body.push(cells);
    }

    autoTable(doc, {
      startY: 32,
      head,
      body,
      theme: "grid",
      headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
      columnStyles: { 0: { halign: "left" } },
      styles: { fontSize: 7, cellPadding: 1.2 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      const ph = doc.internal.pageSize.getHeight();
      doc.text(`Page ${i} of ${pageCount}`, center, ph - 6, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, ph - 6);
    }

    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    doc.save(`Profit_and_Loss_${startStr}_to_${endStr}.pdf`);
  };

  const rowClasses = (row: TableRow): string => {
    switch (row.variant) {
      case "section":
        return "font-semibold text-sm";
      case "subsection":
        return "font-medium text-sm";
      case "group":
        return "font-medium text-sm";
      case "child":
        return "text-sm";
      case "groupTotal":
        return "text-sm font-semibold bg-muted/30";
      case "sectionTotal":
        return "text-sm font-bold bg-muted/50 border-t border-border/50";
      case "derived":
        if (row.netSign === "profit") return "text-sm font-bold bg-green-50 dark:bg-green-950/30 border-t-2 border-green-300 dark:border-green-800";
        if (row.netSign === "loss") return "text-sm font-bold bg-red-50 dark:bg-red-950/30 border-t-2 border-red-300 dark:border-red-800";
        return "text-sm font-bold bg-muted/60";
      default:
        return "text-sm";
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Income Statement</h1>
            <p className="text-muted-foreground text-sm">Profit and Loss report (by class)</p>
          </div>
        </div>
        {data && (
          <div className="flex items-center gap-2">
            <Button onClick={handleExportExcel} className="gap-2 bg-green-600 hover:bg-green-700 text-white" data-testid="button-export-excel">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button onClick={handleExportPDF} className="gap-2 bg-red-600 hover:bg-red-700 text-white" data-testid="button-export-pdf">
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Select Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Quick:</span>
              {[
                { label: "1D", days: 1 },
                { label: "2D", days: 2 },
                { label: "1W", days: 7 },
                { label: "2W", days: 14 },
                { label: "1M", months: 1 },
                { label: "3M", months: 3 },
                { label: "6M", months: 6 },
                { label: "1Y", months: 12 },
                { label: "All", all: true },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  data-testid={`button-quick-${opt.label}`}
                  className="px-3 py-1 text-xs font-medium rounded-full border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700 dark:hover:bg-sky-900/50 transition-colors"
                  onClick={() => {
                    const end = new Date();
                    const endStr = end.toISOString().split("T")[0];
                    setEndDate(endStr);
                    if ((opt as any).all) {
                      setStartDate("2024-01-01");
                    } else {
                      const start = new Date();
                      if ((opt as any).months) start.setMonth(start.getMonth() - (opt as any).months);
                      if ((opt as any).days) start.setDate(start.getDate() - (opt as any).days);
                      const minDate = new Date("2024-01-01");
                      if (start < minDate) start.setTime(minDate.getTime());
                      setStartDate(start.toISOString().split("T")[0]);
                    }
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} data-testid="input-start-date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} data-testid="input-end-date" />
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger className="w-[200px]" data-testid="select-class">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="option-class-all">All Classes</SelectItem>
                    {classOptions.map((c) => (
                      <SelectItem key={c.id} value={c.id} data-testid={`option-class-${c.id}`}>
                        {c.code ? `${c.code} - ${c.name}` : c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={fetchReport} disabled={isLoading} data-testid="button-generate">
                {isLoading ? "Loading..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {data && (
        <>
          <div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer select-none ${
              showZeroBalances
                ? "bg-primary/5 border-primary/30 dark:bg-primary/10 dark:border-primary/40 shadow-sm"
                : "bg-muted/40 border-border hover:bg-muted/60 dark:bg-muted/20 dark:hover:bg-muted/30"
            }`}
            onClick={() => setShowZeroBalances(!showZeroBalances)}
            data-testid="toggle-show-zero-balances"
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${
              showZeroBalances
                ? "bg-primary/10 text-primary dark:bg-primary/20"
                : "bg-muted text-muted-foreground dark:bg-muted/40"
            }`}>
              {showZeroBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <Label htmlFor="show-zero-is" className="text-sm font-medium cursor-pointer leading-none">
                {showZeroBalances ? "Showing All Accounts" : "Hiding Zero Balances"}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {showZeroBalances ? "All accounts are visible including zero balances" : "Accounts with zero balances are hidden"}
              </p>
            </div>
            <Switch id="show-zero-is" checked={showZeroBalances} onCheckedChange={setShowZeroBalances} data-testid="switch-show-zero-balances" />
          </div>

          <Card className="print:shadow-none">
            <CardHeader className="border-b text-center pb-3">
              <CardTitle className="text-xl font-bold">Lamen Microfinance Institution (LMI)</CardTitle>
              <p className="text-base font-semibold">Profit and Loss</p>
              <p className="text-muted-foreground text-sm">{formatDate(startDate)} - {formatDate(endDate)}</p>
            </CardHeader>
            <CardContent className="pt-2 pb-4 px-0 overflow-x-auto">
              <table className="w-full border-collapse text-sm" data-testid="table-income-statement">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-semibold px-4 py-2 sticky left-0 bg-card">Account</th>
                    {columns.map((c) => (
                      <th key={c.key} className="text-right font-semibold px-3 py-2 min-w-[110px] whitespace-nowrap" data-testid={`col-class-${c.key}`}>
                        {c.code ? `${c.code} ${c.name}` : c.name}
                      </th>
                    ))}
                    <th className="text-right font-semibold px-4 py-2 min-w-[120px] whitespace-nowrap">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => {
                    const isToggle = !!row.toggleId;
                    const isOpen = isToggle ? !collapsed.has(row.toggleId!) : false;
                    const hasAmounts = row.amounts !== undefined;
                    return (
                      <tr key={row.id} className={`border-b border-border/40 ${rowClasses(row)}`} data-testid={`row-${row.id}`}>
                        <td className="px-2 py-1 sticky left-0 bg-card" style={{ paddingLeft: `${row.indent * 16 + 8}px` }}>
                          {isToggle ? (
                            <button
                              type="button"
                              onClick={() => toggle(row.toggleId!)}
                              className="flex items-center gap-1 text-left hover-elevate rounded px-1 -mx-1 w-full"
                              data-testid={`button-toggle-${row.toggleId}`}
                            >
                              {isOpen ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                              <span>{row.label}</span>
                            </button>
                          ) : (
                            <span>{row.label}</span>
                          )}
                        </td>
                        {columns.map((c) => (
                          <td key={c.key} className="text-right font-mono px-3 py-1 whitespace-nowrap" data-testid={`cell-${row.id}-${c.key}`}>
                            {hasAmounts ? cellValue(row, c.key) : ""}
                          </td>
                        ))}
                        <td className="text-right font-mono px-4 py-1 whitespace-nowrap" data-testid={`cell-${row.id}-total`}>
                          {row.total !== undefined ? totalCellValue(row) : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
