import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

type AccountChild = {
  accountCode: string;
  accountName: string;
  amount: number;
};

type AccountGroup = {
  accountCode: string;
  accountName: string;
  parentAmount: number;
  total: number;
  children: AccountChild[];
};

type IncomeStatementData = {
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
  period: { startDate: string; endDate: string };
};

function formatAFN(amount: number): string {
  const formatted = amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return formatted;
}

function formatAFNTotal(amount: number): string {
  const formatted = amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `AFN${formatted}`;
}

function CollapsibleSection({ 
  title, 
  groups, 
  totalLabel, 
  totalAmount, 
  defaultOpen = true,
  level = 0,
  showZeroBalances = false,
  subSections,
}: { 
  title: string; 
  groups: AccountGroup[]; 
  totalLabel: string; 
  totalAmount: number; 
  defaultOpen?: boolean;
  level?: number;
  showZeroBalances?: boolean;
  subSections?: { title: string; groups: AccountGroup[]; totalLabel: string; totalAmount: number }[];
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(groups.map(g => g.accountCode)));

  const toggleGroup = (code: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const paddingLeft = level * 16;

  const filteredGroups = showZeroBalances
    ? groups
    : groups
        .map(group => {
          if (group.children.length > 0) {
            const filteredChildren = group.children.filter(c => c.amount !== 0);
            if (filteredChildren.length === 0 && group.total === 0) return null;
            return { ...group, children: filteredChildren };
          }
          return group.total === 0 ? null : group;
        })
        .filter((g): g is AccountGroup => g !== null);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 w-full text-left py-1.5 font-semibold text-sm hover-elevate px-2"
        style={{ paddingLeft: `${paddingLeft + 4}px` }}
        data-testid={`button-toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
        <span>{title}</span>
      </button>
      {isOpen && subSections && subSections.length > 0 && (
        <div>
          {subSections.map((sub) => (
            <CollapsibleSection
              key={sub.title}
              title={sub.title}
              groups={sub.groups}
              totalLabel={sub.totalLabel}
              totalAmount={sub.totalAmount}
              level={level + 1}
              showZeroBalances={showZeroBalances}
            />
          ))}
          <div
            className="flex items-center justify-between py-1.5 text-sm font-bold bg-muted/50 border-t border-border/50 px-2"
            style={{ paddingLeft: `${paddingLeft + 24}px` }}
          >
            <span>{totalLabel}</span>
            <span className="font-mono text-right min-w-[120px]">{formatAFNTotal(totalAmount)}</span>
          </div>
        </div>
      )}
      {isOpen && (!subSections || subSections.length === 0) && (
        <div>
          {filteredGroups.map((group) => {
            const hasChildren = group.children.length > 0;
            const isGroupOpen = expandedGroups.has(group.accountCode);

            return (
              <div key={group.accountCode}>
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.accountCode)}
                      className="flex items-center gap-1 w-full text-left py-1 text-sm font-medium hover-elevate px-2"
                      style={{ paddingLeft: `${paddingLeft + 24}px` }}
                      data-testid={`button-toggle-group-${group.accountCode}`}
                    >
                      {isGroupOpen ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                      <span className="font-semibold">{group.accountCode} {group.accountName}</span>
                    </button>
                    {isGroupOpen && (
                      <div>
                        {group.children.map((child) => (
                          <div
                            key={child.accountCode}
                            className="flex items-center justify-between py-1 text-sm px-2"
                            style={{ paddingLeft: `${paddingLeft + 56}px` }}
                            data-testid={`row-account-${child.accountCode}`}
                          >
                            <span>{child.accountCode} {child.accountName}</span>
                            <span className="font-mono text-right min-w-[120px]" data-testid={`text-amount-${child.accountCode}`}>{formatAFN(child.amount)}</span>
                          </div>
                        ))}
                        <div
                          className="flex items-center justify-between py-1 text-sm font-semibold bg-muted/30 px-2"
                          style={{ paddingLeft: `${paddingLeft + 56}px` }}
                          data-testid={`row-total-${group.accountCode}`}
                        >
                          <span>Total for {group.accountCode} {group.accountName}</span>
                          <span className="font-mono text-right min-w-[120px]">{formatAFNTotal(group.total)}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="flex items-center justify-between py-1 text-sm px-2"
                    style={{ paddingLeft: `${paddingLeft + 44}px` }}
                    data-testid={`row-account-${group.accountCode}`}
                  >
                    <span>{group.accountCode} {group.accountName}</span>
                    <span className="font-mono text-right min-w-[120px]" data-testid={`text-amount-${group.accountCode}`}>{formatAFN(group.total)}</span>
                  </div>
                )}
              </div>
            );
          })}
          <div
            className="flex items-center justify-between py-1.5 text-sm font-bold bg-muted/50 border-t border-border/50 px-2"
            style={{ paddingLeft: `${paddingLeft + 24}px` }}
          >
            <span>{totalLabel}</span>
            <span className="font-mono text-right min-w-[120px]">{formatAFNTotal(totalAmount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IncomeStatement() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(0, 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<IncomeStatementData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showZeroBalances, setShowZeroBalances] = useState(false);
  const [classId, setClassId] = useState<string>("all");

  const { data: classList = [] } = useQuery<Array<{ id: string; name: string; code?: string | null }>>({
    queryKey: ["/api/classes", { activeOnly: true }],
    queryFn: async () => {
      const res = await fetch("/api/classes?activeOnly=true", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load classes");
      return res.json();
    },
  });

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (classId && classId !== "all") params.set("classId", classId);
      const res = await fetch(`/api/reports/income-statement?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch income statement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!data) return;

    const exportData: any[] = [];

    const addSection = (title: string, groups: AccountGroup[], totalLabel: string, totalAmount: number) => {
      exportData.push({ "Account Code": "", "Account Name": title, "Amount (AFN)": "" });
      groups.forEach(group => {
        if (group.children.length > 0) {
          exportData.push({ "Account Code": group.accountCode, "Account Name": group.accountName, "Amount (AFN)": "" });
          group.children.forEach(child => {
            exportData.push({ "Account Code": child.accountCode, "Account Name": `  ${child.accountName}`, "Amount (AFN)": child.amount });
          });
          exportData.push({ "Account Code": "", "Account Name": `Total for ${group.accountCode} ${group.accountName}`, "Amount (AFN)": group.total });
        } else {
          exportData.push({ "Account Code": group.accountCode, "Account Name": group.accountName, "Amount (AFN)": group.total });
        }
      });
      exportData.push({ "Account Code": "", "Account Name": totalLabel, "Amount (AFN)": totalAmount });
      exportData.push({ "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    };

    addSection("OPERATING INCOME", data.operatingIncomeGroups, "Total for Operating Income", data.totalOperatingIncome);
    addSection("NON-OPERATING INCOME", data.nonOperatingIncomeGroups, "Total for Non-Operating Income", data.totalNonOperatingIncome);
    exportData.push({ "Account Code": "", "Account Name": "Total Income", "Amount (AFN)": data.totalIncome });
    exportData.push({ "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    addSection("COST OF FINANCING", data.costOfFinancingGroups, "Total for Cost of Financing", data.totalCostOfFinancing);
    exportData.push({ "Account Code": "", "Account Name": "Gross Profit", "Amount (AFN)": data.grossProfit });
    exportData.push({ "Account Code": "", "Account Name": "", "Amount (AFN)": "" });
    addSection("OPERATING EXPENSES", data.operatingExpenseGroups, "Total for Operating Expenses", data.totalOperatingExpenses);
    addSection("NON-OPERATING EXPENSES", data.nonOperatingExpenseGroups, "Total for Non-Operating Expenses", data.totalNonOperatingExpenses);
    exportData.push({ "Account Code": "", "Account Name": "Total Expenses", "Amount (AFN)": data.totalExpenses });
    exportData.push({ "Account Code": "", "Account Name": data.netIncome >= 0 ? "Net Profit" : "Net Loss", "Amount (AFN)": data.netIncome });

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [{ wch: 15 }, { wch: 50 }, { wch: 20 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profit and Loss");
    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    XLSX.writeFile(wb, `Profit_and_Loss_${startStr}_to_${endStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Profit and Loss", 105, 18, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Lamen Microfinance Institution (LMI)", 105, 25, { align: "center" });
    doc.text(`${formatDate(startDate)}-${formatDate(endDate)}`, 105, 31, { align: "center" });

    const tableData: any[] = [];

    const addPDFSection = (title: string, groups: AccountGroup[], totalLabel: string, totalAmount: number) => {
      tableData.push([{ content: title, colSpan: 3, styles: { fontStyle: "bold", fillColor: [240, 240, 240] } }]);
      groups.forEach(group => {
        if (group.children.length > 0) {
          tableData.push([{ content: `${group.accountCode} ${group.accountName}`, colSpan: 2, styles: { fontStyle: "bold" } }, ""]);
          group.children.forEach(child => {
            tableData.push(["", `${child.accountCode} ${child.accountName}`, { content: formatAFN(child.amount), styles: { halign: "right" } }]);
          });
          tableData.push(["", { content: `Total for ${group.accountCode} ${group.accountName}`, styles: { fontStyle: "bold" } }, { content: formatAFNTotal(group.total), styles: { fontStyle: "bold", halign: "right" } }]);
        } else {
          tableData.push(["", `${group.accountCode} ${group.accountName}`, { content: formatAFN(group.total), styles: { halign: "right" } }]);
        }
      });
      tableData.push([{ content: totalLabel, colSpan: 2, styles: { fontStyle: "bold" } }, { content: formatAFNTotal(totalAmount), styles: { fontStyle: "bold", halign: "right" } }]);
    };

    addPDFSection("Operating Income", data.operatingIncomeGroups, "Total for Operating Income", data.totalOperatingIncome);
    addPDFSection("Non-Operating Income", data.nonOperatingIncomeGroups, "Total for Non-Operating Income", data.totalNonOperatingIncome);
    tableData.push([{ content: "Total Income", colSpan: 2, styles: { fontStyle: "bold" } }, { content: formatAFNTotal(data.totalIncome), styles: { fontStyle: "bold", halign: "right" } }]);
    tableData.push(["", "", ""]);
    addPDFSection("Cost of Financing", data.costOfFinancingGroups, "Total for Cost of Financing", data.totalCostOfFinancing);
    tableData.push([{ content: "Gross Profit", colSpan: 2, styles: { fontStyle: "bold" } }, { content: formatAFNTotal(data.grossProfit), styles: { fontStyle: "bold", halign: "right" } }]);
    tableData.push(["", "", ""]);
    addPDFSection("Operating Expenses", data.operatingExpenseGroups, "Total for Operating Expenses", data.totalOperatingExpenses);
    addPDFSection("Non-Operating Expenses", data.nonOperatingExpenseGroups, "Total for Non-Operating Expenses", data.totalNonOperatingExpenses);
    tableData.push([{ content: "Total Expenses", colSpan: 2, styles: { fontStyle: "bold" } }, { content: formatAFNTotal(data.totalExpenses), styles: { fontStyle: "bold", halign: "right" } }]);
    tableData.push(["", "", ""]);
    const netLabel = data.netIncome >= 0 ? "Net Profit" : "Net Loss";
    tableData.push([{ content: netLabel, colSpan: 2, styles: { fontStyle: "bold", fillColor: data.netIncome >= 0 ? [220, 252, 231] : [254, 202, 202] } }, { content: formatAFNTotal(data.netIncome), styles: { fontStyle: "bold", halign: "right", fillColor: data.netIncome >= 0 ? [220, 252, 231] : [254, 202, 202] } }]);

    autoTable(doc, {
      startY: 36,
      head: [["", "Account", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 120 },
        2: { cellWidth: 40, halign: "right" },
      },
      styles: { fontSize: 8, cellPadding: 1.5 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 290);
    }

    const startStr = startDate.replace(/-/g, "");
    const endStr = endDate.replace(/-/g, "");
    doc.save(`Profit_and_Loss_${startStr}_to_${endStr}.pdf`);
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
            <p className="text-muted-foreground text-sm">Profit and Loss report</p>
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
                  <SelectTrigger className="w-[220px]" data-testid="filter-class">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classList.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.code ? `${c.code} - ${c.name}` : c.name}</SelectItem>
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
            <CardTitle className="text-xl font-bold">Profit and Loss</CardTitle>
            <p className="text-muted-foreground text-sm">Lamen Microfinance Institution (LMI)</p>
            <p className="text-muted-foreground text-sm">{formatDate(startDate)}-{formatDate(endDate)}</p>
          </CardHeader>
          <CardContent className="pt-2 pb-4 px-0">
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-border font-semibold text-sm">
              <span>Account</span>
              <span>Total</span>
            </div>

            <CollapsibleSection
              title="Income"
              groups={[]}
              totalLabel="Total Income"
              totalAmount={data.totalIncome}
              showZeroBalances={showZeroBalances}
              subSections={[
                { title: "Operating Income", groups: data.operatingIncomeGroups, totalLabel: "Total for Operating Income", totalAmount: data.totalOperatingIncome },
                { title: "Non-Operating Income", groups: data.nonOperatingIncomeGroups, totalLabel: "Total for Non-Operating Income", totalAmount: data.totalNonOperatingIncome },
              ]}
            />

            <CollapsibleSection
              title="Cost of Financing"
              groups={data.costOfFinancingGroups}
              totalLabel="Total for Cost of Financing"
              totalAmount={data.totalCostOfFinancing}
              showZeroBalances={showZeroBalances}
            />

            <div className="flex items-center justify-between px-4 py-2 font-bold text-sm bg-muted/60 border-b border-border/50" data-testid="row-gross-profit">
              <span>Gross Profit</span>
              <span className="font-mono" data-testid="text-gross-profit">{formatAFNTotal(data.grossProfit)}</span>
            </div>

            <CollapsibleSection
              title="Expenses"
              groups={[]}
              totalLabel="Total Expenses"
              totalAmount={data.totalExpenses}
              showZeroBalances={showZeroBalances}
              subSections={[
                { title: "Operating Expenses", groups: data.operatingExpenseGroups, totalLabel: "Total for Operating Expenses", totalAmount: data.totalOperatingExpenses },
                { title: "Non-Operating Expenses", groups: data.nonOperatingExpenseGroups, totalLabel: "Total for Non-Operating Expenses", totalAmount: data.totalNonOperatingExpenses },
              ]}
            />

            <div className={`flex items-center justify-between px-4 py-3 font-bold text-base border-t-2 ${data.netIncome >= 0 ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800'}`} data-testid="row-net-income">
              <span>Net {data.netIncome >= 0 ? 'Profit' : 'Loss'}</span>
              <span className={`font-mono ${data.netIncome >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {formatAFNTotal(data.netIncome)}
              </span>
            </div>
          </CardContent>
        </Card>
        </>
      )}
    </div>
  );
}
