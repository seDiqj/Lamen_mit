import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FileText, FileSpreadsheet, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type TreeNode = {
  id: string;
  accountCode: string;
  accountName: string;
  amount: number;
  children: TreeNode[];
  isLeaf: boolean;
};

type BalanceSheetData = {
  assetsTree: TreeNode[];
  liabilitiesTree: TreeNode[];
  equityTree: TreeNode[];
  retainedEarnings: number;
  currentPeriodNetIncome: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  asOfDate: string;
};

function formatAmount(amount: number): string {
  if (amount === 0) return "";
  const formatted = formatCurrency(Math.abs(amount).toString());
  return amount < 0 ? `-${formatted}` : formatted;
}

function formatAmountNum(amount: number): string {
  if (amount === 0) return "0.00";
  const abs = Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return amount < 0 ? `-${abs}` : abs;
}

function filterZeroNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes
    .map(node => {
      if (node.children.length > 0) {
        const filtered = filterZeroNodes(node.children);
        const total = node.amount;
        if (filtered.length === 0 && total === 0) return null;
        return { ...node, children: filtered };
      }
      return node.amount === 0 ? null : node;
    })
    .filter((n): n is TreeNode => n !== null);
}

function AccountTreeRow({
  node,
  depth,
  expanded,
  onToggle,
  showZeroBalances,
}: {
  node: TreeNode;
  depth: number;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  showZeroBalances: boolean;
}) {
  const isExpanded = expanded[node.id] !== false;
  const displayChildren = showZeroBalances ? node.children : filterZeroNodes(node.children);
  const hasChildren = displayChildren.length > 0;
  const indent = depth * 24;

  if (!showZeroBalances && node.amount === 0 && (node.isLeaf || displayChildren.length === 0)) return null;

  return (
    <>
      <tr
        className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors ${
          hasChildren ? "cursor-pointer" : ""
        } ${hasChildren && depth === 0 ? "font-semibold" : ""}`}
        onClick={hasChildren ? () => onToggle(node.id) : undefined}
        data-testid={`row-account-${node.accountCode}`}
      >
        <td className="py-1.5 pr-2" style={{ paddingLeft: `${indent + 8}px` }}>
          <div className="flex items-center gap-1">
            {hasChildren ? (
              <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-muted-foreground">
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </span>
            ) : (
              <span className="w-4" />
            )}
            <span className="text-sm">
              {hasChildren ? (
                <span className="font-medium">{node.accountCode} {node.accountName}</span>
              ) : (
                <span>{node.accountCode} {node.accountName}</span>
              )}
            </span>
          </div>
        </td>
        <td className="py-1.5 text-right pr-4 tabular-nums text-sm whitespace-nowrap">
          {node.isLeaf ? (
            <span>{formatAmountNum(node.amount)}</span>
          ) : hasChildren && !isExpanded ? (
            <span className="font-medium">{formatAmount(node.amount)}</span>
          ) : null}
        </td>
      </tr>
      {hasChildren && isExpanded && (
        <>
          {displayChildren.map((child) => (
            <AccountTreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              showZeroBalances={showZeroBalances}
            />
          ))}
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
            <td className="py-1.5 pr-2 font-semibold text-sm" style={{ paddingLeft: `${(depth + 1) * 24 + 8 + 20}px` }}>
              Total for {node.accountCode} {node.accountName}
            </td>
            <td className="py-1.5 text-right pr-4 font-semibold tabular-nums text-sm whitespace-nowrap">
              {formatAmount(node.amount)}
            </td>
          </tr>
        </>
      )}
    </>
  );
}

export default function BalanceSheet() {
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<BalanceSheetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showZeroBalances, setShowZeroBalances] = useState(false);
  const { toast } = useToast();

  const onToggle = useCallback((id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: prev[id] === false ? true : (prev[id] === undefined ? false : !prev[id]) }));
  }, []);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/accounts/recalculate-balances").catch(() => {});
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

  const isBalanced = data ? Math.abs(data.totalAssets - (data.totalLiabilities + data.totalEquity)) < 0.01 : true;

  const flattenTree = (nodes: TreeNode[], depth = 0): { accountCode: string; accountName: string; amount: number; depth: number; isParent: boolean; isTotalRow?: boolean }[] => {
    const rows: any[] = [];
    for (const node of nodes) {
      const hasChildren = node.children.length > 0;
      rows.push({ accountCode: node.accountCode, accountName: node.accountName, amount: node.amount, depth, isParent: hasChildren });
      if (hasChildren) {
        rows.push(...flattenTree(node.children, depth + 1));
        rows.push({ accountCode: "", accountName: `Total for ${node.accountCode} ${node.accountName}`, amount: node.amount, depth: depth + 1, isParent: false, isTotalRow: true });
      }
    }
    return rows;
  };

  const handleExportExcel = () => {
    if (!data) return;
    const exportData: any[] = [];
    exportData.push({ Account: "ASSETS", Total: "" });
    flattenTree(data.assetsTree).forEach(r => {
      const indent = "  ".repeat(r.depth);
      exportData.push({
        Account: `${indent}${r.accountCode} ${r.accountName}`,
        Total: r.isTotalRow || r.isParent ? (r.isParent && !r.isTotalRow ? "" : r.amount) : r.amount,
      });
    });
    exportData.push({ Account: "Total for Assets", Total: data.totalAssets });
    exportData.push({ Account: "", Total: "" });

    exportData.push({ Account: "LIABILITIES AND SHAREHOLDER'S EQUITY", Total: "" });
    flattenTree(data.liabilitiesTree).forEach(r => {
      const indent = "  ".repeat(r.depth);
      exportData.push({
        Account: `${indent}${r.accountCode} ${r.accountName}`,
        Total: r.isTotalRow || r.isParent ? (r.isParent && !r.isTotalRow ? "" : r.amount) : r.amount,
      });
    });
    exportData.push({ Account: "Total for Liabilities", Total: data.totalLiabilities });
    exportData.push({ Account: "", Total: "" });

    exportData.push({ Account: "SHAREHOLDER'S EQUITY", Total: "" });
    flattenTree(data.equityTree).forEach(r => {
      const indent = "  ".repeat(r.depth);
      exportData.push({
        Account: `${indent}${r.accountCode} ${r.accountName}`,
        Total: r.isTotalRow || r.isParent ? (r.isParent && !r.isTotalRow ? "" : r.amount) : r.amount,
      });
    });
    if (data.retainedEarnings !== 0) exportData.push({ Account: "  Retained Earnings", Total: data.retainedEarnings });
    if (data.currentPeriodNetIncome !== 0) exportData.push({ Account: "  Net Income", Total: data.currentPeriodNetIncome });
    exportData.push({ Account: "Total for Shareholder's Equity", Total: data.totalEquity });
    exportData.push({ Account: "", Total: "" });
    exportData.push({ Account: "Total for Liabilities and Shareholder's Equity", Total: data.totalLiabilities + data.totalEquity });

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [{ wch: 60 }, { wch: 20 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Balance Sheet");
    XLSX.writeFile(wb, `Balance_Sheet_${asOfDate.replace(/-/g, "")}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Balance Sheet", 105, 18, { align: "center" });
    doc.setFontSize(11);
    doc.text("Lamen Microfinance Institution (LMI)", 105, 26, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`As of ${formatDate(asOfDate)}`, 105, 33, { align: "center" });

    const tableData: any[] = [];
    const addSection = (title: string, nodes: TreeNode[], totalLabel: string, totalAmount: number, extraRows?: { label: string; amount: number }[]) => {
      tableData.push([{ content: title, styles: { fontStyle: "bold" } }, ""]);
      flattenTree(nodes).forEach(r => {
        const indent = "  ".repeat(r.depth);
        const name = `${indent}${r.accountCode} ${r.accountName}`;
        const amt = r.isParent && !r.isTotalRow ? "" : formatAmountNum(r.amount);
        const styles = r.isTotalRow ? { fontStyle: "bold" as const, fillColor: [240, 240, 240] as [number, number, number] } : r.isParent ? { fontStyle: "bold" as const } : {};
        tableData.push([{ content: name, styles }, { content: amt, styles: { ...styles, halign: "right" as const } }]);
      });
      if (extraRows) {
        extraRows.forEach(er => {
          tableData.push([`  ${er.label}`, { content: formatAmountNum(er.amount), styles: { halign: "right" as const } }]);
        });
      }
      tableData.push([
        { content: totalLabel, styles: { fontStyle: "bold", fillColor: [220, 220, 220] } },
        { content: formatAmount(totalAmount), styles: { fontStyle: "bold", halign: "right", fillColor: [220, 220, 220] } },
      ]);
      tableData.push(["", ""]);
    };

    addSection("Assets", data.assetsTree, "Total for Assets", data.totalAssets);

    const equityExtras: { label: string; amount: number }[] = [];
    if (data.retainedEarnings !== 0) equityExtras.push({ label: "Retained Earnings", amount: data.retainedEarnings });
    if (data.currentPeriodNetIncome !== 0) equityExtras.push({ label: "Net Income", amount: data.currentPeriodNetIncome });

    tableData.push([{ content: "Liabilities and Shareholder's Equity", styles: { fontStyle: "bold" } }, ""]);
    flattenTree(data.liabilitiesTree).forEach(r => {
      const indent = "  ".repeat(r.depth);
      const name = `${indent}${r.accountCode} ${r.accountName}`;
      const amt = r.isParent && !r.isTotalRow ? "" : formatAmountNum(r.amount);
      const styles = r.isTotalRow ? { fontStyle: "bold" as const, fillColor: [240, 240, 240] as [number, number, number] } : r.isParent ? { fontStyle: "bold" as const } : {};
      tableData.push([{ content: name, styles }, { content: amt, styles: { ...styles, halign: "right" as const } }]);
    });
    tableData.push([
      { content: "Total for Liabilities", styles: { fontStyle: "bold", fillColor: [220, 220, 220] } },
      { content: formatAmount(data.totalLiabilities), styles: { fontStyle: "bold", halign: "right", fillColor: [220, 220, 220] } },
    ]);
    tableData.push(["", ""]);

    tableData.push([{ content: "Shareholder's Equity", styles: { fontStyle: "bold" } }, ""]);
    flattenTree(data.equityTree).forEach(r => {
      const indent = "  ".repeat(r.depth);
      const name = `${indent}${r.accountCode} ${r.accountName}`;
      const amt = r.isParent && !r.isTotalRow ? "" : formatAmountNum(r.amount);
      const styles = r.isTotalRow ? { fontStyle: "bold" as const, fillColor: [240, 240, 240] as [number, number, number] } : r.isParent ? { fontStyle: "bold" as const } : {};
      tableData.push([{ content: name, styles }, { content: amt, styles: { ...styles, halign: "right" as const } }]);
    });
    equityExtras.forEach(er => {
      tableData.push([`  ${er.label}`, { content: formatAmountNum(er.amount), styles: { halign: "right" as const } }]);
    });
    tableData.push([
      { content: "Total for Shareholder's Equity", styles: { fontStyle: "bold", fillColor: [220, 220, 220] } },
      { content: formatAmount(data.totalEquity), styles: { fontStyle: "bold", halign: "right", fillColor: [220, 220, 220] } },
    ]);
    tableData.push(["", ""]);
    tableData.push([
      { content: "Total for Liabilities and Shareholder's Equity", styles: { fontStyle: "bold", fillColor: [200, 200, 200] } },
      { content: formatAmount(data.totalLiabilities + data.totalEquity), styles: { fontStyle: "bold", halign: "right", fillColor: [200, 200, 200] } },
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Account", "Total"]],
      body: tableData,
      theme: "plain",
      headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: "bold", lineWidth: { bottom: 0.5 } },
      columnStyles: {
        0: { halign: "left", cellWidth: 130 },
        1: { halign: "right", cellWidth: 40 },
      },
      styles: { fontSize: 8, cellPadding: 1.5, lineColor: [220, 220, 220], lineWidth: 0.1 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
    }

    doc.save(`Balance_Sheet_${asOfDate.replace(/-/g, "")}.pdf`);
  };

  const categorizeAssets = (nodes: TreeNode[]) => {
    const currentAssetCodes = ["10000", "11000", "12000", "12900", "13000", "18000"];
    const current: TreeNode[] = [];
    const longTerm: TreeNode[] = [];
    for (const node of nodes) {
      if (currentAssetCodes.includes(node.accountCode) || parseInt(node.accountCode) < 14000) {
        current.push(node);
      } else {
        longTerm.push(node);
      }
    }
    return { current, longTerm };
  };

  const categorizeLiabilities = (nodes: TreeNode[]) => {
    const currentCodes = ["20100", "20110", "20130", "20140", "20150", "20800", "20900", "21000"];
    const current: TreeNode[] = [];
    const nonCurrent: TreeNode[] = [];
    for (const node of nodes) {
      if (currentCodes.includes(node.accountCode) || (parseInt(node.accountCode) >= 20100 && parseInt(node.accountCode) < 20200) || parseInt(node.accountCode) >= 20800) {
        current.push(node);
      } else {
        nonCurrent.push(node);
      }
    }
    return { current, nonCurrent };
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
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
            <Label htmlFor="show-zero-bs" className="text-sm font-medium cursor-pointer leading-none">
              {showZeroBalances ? "Showing All Accounts" : "Hiding Zero Balances"}
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              {showZeroBalances ? "All accounts are visible including zero balances" : "Accounts with zero balances are hidden"}
            </p>
          </div>
          <Switch id="show-zero-bs" checked={showZeroBalances} onCheckedChange={setShowZeroBalances} data-testid="switch-show-zero-balances" />
        </div>
      )}

      {data && (
        <Card className="print:shadow-none">
          <CardContent className="p-0">
            <div className="text-center py-4 border-b">
              <h2 className="text-xl font-bold">Balance Sheet</h2>
              <p className="text-sm text-muted-foreground">Lamen Microfinance Institution (LMI)</p>
              <p className="text-sm text-muted-foreground">As of {formatDate(asOfDate)}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full" data-testid="table-balance-sheet">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="text-left py-2 pl-2 pr-2 text-sm font-semibold">Account</th>
                    <th className="text-right py-2 pr-4 text-sm font-semibold w-48">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const { current: currentAssets, longTerm: longTermAssets } = categorizeAssets(data.assetsTree);
                    const { current: currentLiab, nonCurrent: nonCurrentLiab } = categorizeLiabilities(data.liabilitiesTree);
                    const currentAssetsTotal = currentAssets.reduce((s, n) => s + n.amount, 0);
                    const longTermTotal = longTermAssets.reduce((s, n) => s + n.amount, 0);
                    const currentLiabTotal = currentLiab.reduce((s, n) => s + n.amount, 0);
                    const nonCurrentLiabTotal = nonCurrentLiab.reduce((s, n) => s + n.amount, 0);

                    return (
                      <>
                        <tr
                          className="border-b-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40"
                          onClick={() => onToggle("section-Assets")}
                          data-testid="row-section-assets"
                        >
                          <td className="py-2 pl-2 pr-2" colSpan={2}>
                            <div className="flex items-center gap-1">
                              <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-muted-foreground">
                                {expanded["section-Assets"] !== false ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </span>
                              <span className="font-bold text-sm">Assets</span>
                            </div>
                          </td>
                        </tr>
                        {expanded["section-Assets"] !== false && (
                          <>
                            <tr
                              className="border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40"
                              onClick={() => onToggle("sub-current-assets")}
                              data-testid="row-current-assets"
                            >
                              <td className="py-1.5 pl-8 pr-2" colSpan={2}>
                                <div className="flex items-center gap-1">
                                  <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-muted-foreground">
                                    {expanded["sub-current-assets"] !== false ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                  </span>
                                  <span className="font-semibold text-sm">Current Assets</span>
                                </div>
                              </td>
                            </tr>
                            {expanded["sub-current-assets"] !== false && (
                              <>
                                {currentAssets.map((node) => (
                                  <AccountTreeRow key={node.id} node={node} depth={2} expanded={expanded} onToggle={onToggle} showZeroBalances={showZeroBalances} />
                                ))}
                                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                                  <td className="py-1.5 pl-16 pr-2 font-semibold text-sm">Total for Current Assets</td>
                                  <td className="py-1.5 text-right pr-4 font-semibold tabular-nums text-sm whitespace-nowrap">{formatAmount(currentAssetsTotal)}</td>
                                </tr>
                              </>
                            )}
                            {longTermAssets.length > 0 && (
                              <>
                                <tr
                                  className="border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40"
                                  onClick={() => onToggle("sub-longterm-assets")}
                                  data-testid="row-longterm-assets"
                                >
                                  <td className="py-1.5 pl-8 pr-2" colSpan={2}>
                                    <div className="flex items-center gap-1">
                                      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-muted-foreground">
                                        {expanded["sub-longterm-assets"] !== false ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                      </span>
                                      <span className="font-semibold text-sm">Long-term assets</span>
                                    </div>
                                  </td>
                                </tr>
                                {expanded["sub-longterm-assets"] !== false && (
                                  <>
                                    {longTermAssets.map((node) => (
                                      <AccountTreeRow key={node.id} node={node} depth={2} expanded={expanded} onToggle={onToggle} showZeroBalances={showZeroBalances} />
                                    ))}
                                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                                      <td className="py-1.5 pl-16 pr-2 font-semibold text-sm">Total for Long-term assets</td>
                                      <td className="py-1.5 text-right pr-4 font-semibold tabular-nums text-sm whitespace-nowrap">{formatAmount(longTermTotal)}</td>
                                    </tr>
                                  </>
                                )}
                              </>
                            )}
                            <tr className="border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100/60 dark:bg-gray-800/40">
                              <td className="py-2 pl-8 pr-2 font-bold text-sm">Total for Assets</td>
                              <td className="py-2 text-right pr-4 font-bold tabular-nums text-sm whitespace-nowrap">{formatAmount(data.totalAssets)}</td>
                            </tr>
                          </>
                        )}

                        <tr
                          className="border-b-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40"
                          onClick={() => onToggle("section-liab-equity")}
                          data-testid="row-section-liabilities-equity"
                        >
                          <td className="py-2 pl-2 pr-2" colSpan={2}>
                            <div className="flex items-center gap-1">
                              <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-muted-foreground">
                                {expanded["section-liab-equity"] !== false ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </span>
                              <span className="font-bold text-sm">Liabilities and Shareholder's Equity</span>
                            </div>
                          </td>
                        </tr>

                        {expanded["section-liab-equity"] !== false && (
                          <>
                            {currentLiab.length > 0 && (
                              <>
                                <tr
                                  className="border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40"
                                  onClick={() => onToggle("sub-current-liab")}
                                >
                                  <td className="py-1.5 pl-8 pr-2" colSpan={2}>
                                    <div className="flex items-center gap-1">
                                      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-muted-foreground">
                                        {expanded["sub-current-liab"] !== false ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                      </span>
                                      <span className="font-semibold text-sm">Current Liabilities</span>
                                    </div>
                                  </td>
                                </tr>
                                {expanded["sub-current-liab"] !== false && (
                                  <>
                                    {currentLiab.map((node) => (
                                      <AccountTreeRow key={node.id} node={node} depth={2} expanded={expanded} onToggle={onToggle} showZeroBalances={showZeroBalances} />
                                    ))}
                                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                                      <td className="py-1.5 pl-16 pr-2 font-semibold text-sm">Total for Current Liabilities</td>
                                      <td className="py-1.5 text-right pr-4 font-semibold tabular-nums text-sm whitespace-nowrap">{formatAmount(currentLiabTotal)}</td>
                                    </tr>
                                  </>
                                )}
                              </>
                            )}
                            {nonCurrentLiab.length > 0 && (
                              <>
                                <tr
                                  className="border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40"
                                  onClick={() => onToggle("sub-noncurrent-liab")}
                                >
                                  <td className="py-1.5 pl-8 pr-2" colSpan={2}>
                                    <div className="flex items-center gap-1">
                                      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-muted-foreground">
                                        {expanded["sub-noncurrent-liab"] !== false ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                      </span>
                                      <span className="font-semibold text-sm">Non-current Liabilities</span>
                                    </div>
                                  </td>
                                </tr>
                                {expanded["sub-noncurrent-liab"] !== false && (
                                  <>
                                    {nonCurrentLiab.map((node) => (
                                      <AccountTreeRow key={node.id} node={node} depth={2} expanded={expanded} onToggle={onToggle} showZeroBalances={showZeroBalances} />
                                    ))}
                                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                                      <td className="py-1.5 pl-16 pr-2 font-semibold text-sm">Total for Non-current Liabilities</td>
                                      <td className="py-1.5 text-right pr-4 font-semibold tabular-nums text-sm whitespace-nowrap">{formatAmount(nonCurrentLiabTotal)}</td>
                                    </tr>
                                  </>
                                )}
                              </>
                            )}

                            <tr
                              className="border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40"
                              onClick={() => onToggle("sub-equity")}
                            >
                              <td className="py-1.5 pl-8 pr-2" colSpan={2}>
                                <div className="flex items-center gap-1">
                                  <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-muted-foreground">
                                    {expanded["sub-equity"] !== false ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                  </span>
                                  <span className="font-semibold text-sm">Shareholder's Equity</span>
                                </div>
                              </td>
                            </tr>
                            {expanded["sub-equity"] !== false && (
                              <>
                                {data.equityTree.map((node) => (
                                  <AccountTreeRow key={node.id} node={node} depth={2} expanded={expanded} onToggle={onToggle} showZeroBalances={showZeroBalances} />
                                ))}
                                {(showZeroBalances || data.retainedEarnings !== 0) && (
                                  <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <td className="py-1.5 text-sm" style={{ paddingLeft: `${2 * 24 + 8 + 20}px` }}>
                                      Retained Earnings
                                    </td>
                                    <td className="py-1.5 text-right pr-4 tabular-nums text-sm whitespace-nowrap">
                                      {formatAmountNum(data.retainedEarnings)}
                                    </td>
                                  </tr>
                                )}
                                {(showZeroBalances || data.currentPeriodNetIncome !== 0) && (
                                  <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <td className="py-1.5 text-sm" style={{ paddingLeft: `${2 * 24 + 8 + 20}px` }}>
                                      Net Income
                                    </td>
                                    <td className="py-1.5 text-right pr-4 tabular-nums text-sm whitespace-nowrap">
                                      {formatAmountNum(data.currentPeriodNetIncome)}
                                    </td>
                                  </tr>
                                )}
                                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                                  <td className="py-1.5 pl-16 pr-2 font-semibold text-sm">Total for Shareholder's Equity</td>
                                  <td className="py-1.5 text-right pr-4 font-semibold tabular-nums text-sm whitespace-nowrap">{formatAmount(data.totalEquity)}</td>
                                </tr>
                              </>
                            )}

                            <tr className="border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100/60 dark:bg-gray-800/40">
                              <td className="py-2 pl-8 pr-2 font-bold text-sm">Total for Liabilities and Shareholder's Equity</td>
                              <td className="py-2 text-right pr-4 font-bold tabular-nums text-sm whitespace-nowrap">{formatAmount(data.totalLiabilities + data.totalEquity)}</td>
                            </tr>
                          </>
                        )}
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
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
