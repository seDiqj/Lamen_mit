import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, TrendingDown, Building2, Users, Package, FileText, Loader2, ChevronDown, ChevronRight, FileSpreadsheet, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type LoanDetail = {
  id: number;
  applicationId: string;
  customerName: string;
  branch: string;
  officer: string;
  product: string;
  loanAmount: number;
  outstanding: number;
  lateDays: number;
  installmentNumber?: number;
  dueDate?: string;
};

type ParCategory = {
  id: number;
  category: string;
  startDay: number;
  endDay: number;
  provisionPercent: number;
  loanCount: number;
  installmentCount: number;
  totalAmount: number;
  outstandingAmount: number;
  provisionAmount: number;
  loanPercentage: string;
  amountPercentage: string;
};

type ParAnalysisData = {
  categories: ParCategory[];
  summary: {
    totalLoans: number;
    totalPortfolio: number;
    totalOutstanding: number;
    totalProvision: number;
    parRatio: string;
  };
};

type DialogType = "category" | "branch" | "officer" | "product" | null;

type GroupedLoan = {
  loanId: string;
  customerName: string;
  branch: string;
  officer: string;
  product: string;
  loanAmount: number;
  totalUnpaid: number;
  maxDaysPastDue: number;
  installments: any[];
};

function AgingReportSection({ agingReport, agingLoading, formatCurrency }: { agingReport: any[] | undefined; agingLoading: boolean; formatCurrency: (n: number) => string }) {
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set());
  const [expandedLoans, setExpandedLoans] = useState<Set<string>>(new Set());
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");

  const toggleBranch = (branch: string) => {
    setExpandedBranches(prev => {
      const next = new Set(prev);
      if (next.has(branch)) {
        next.delete(branch);
      } else {
        next.add(branch);
      }
      return next;
    });
  };

  const toggleLoan = (loanId: string) => {
    setExpandedLoans(prev => {
      const next = new Set(prev);
      if (next.has(loanId)) {
        next.delete(loanId);
      } else {
        next.add(loanId);
      }
      return next;
    });
  };

  const filteredReport = useMemo(() => {
    if (!agingReport) return [];
    return agingReport.filter(item => {
      if (filterBranch !== "all" && item.branch !== filterBranch) return false;
      if (filterStartDate && item.dueDate && item.dueDate < filterStartDate) return false;
      if (filterEndDate && item.dueDate && item.dueDate > filterEndDate) return false;
      return true;
    });
  }, [agingReport, filterStartDate, filterEndDate, filterBranch]);

  const allBranches = useMemo(() => {
    if (!agingReport) return [];
    const set = new Set(agingReport.map(i => i.branch).filter(Boolean));
    return Array.from(set).sort();
  }, [agingReport]);

  const branchGroups = useMemo(() => {
    const map = new Map<string, GroupedLoan[]>();
    for (const item of filteredReport) {
      const branch = item.branch || 'N/A';
      if (!map.has(branch)) map.set(branch, []);
      const loans = map.get(branch)!;
      let loan = loans.find(l => l.loanId === item.loanId);
      if (!loan) {
        loan = {
          loanId: item.loanId,
          customerName: item.customerName,
          branch: item.branch,
          officer: item.officer,
          product: item.product || 'N/A',
          loanAmount: item.loanAmount,
          totalUnpaid: 0,
          maxDaysPastDue: 0,
          installments: [],
        };
        loans.push(loan);
      }
      loan.totalUnpaid += item.unpaidAmount || 0;
      loan.maxDaysPastDue = Math.max(loan.maxDaysPastDue, item.daysPastDue || 0);
      loan.installments.push(item);
    }
    for (const [, loans] of map) {
      loans.sort((a, b) => b.maxDaysPastDue - a.maxDaysPastDue);
    }
    return map;
  }, [filteredReport]);

  const expandAllBranches = () => {
    setExpandedBranches(new Set(branchGroups.keys()));
  };

  const collapseAllBranches = () => {
    setExpandedBranches(new Set());
    setExpandedLoans(new Set());
  };

  const handleExportExcel = () => {
    const rows: any[] = [];
    for (const [branch, loans] of branchGroups) {
      for (const loan of loans) {
        for (const inst of loan.installments) {
          rows.push({
            "Branch": branch,
            "Financing ID": loan.loanId,
            "Customer": loan.customerName,
            "Product": loan.product,
            "Officer": loan.officer,
            "Inst #": inst.installmentNumber,
            "Due Date": inst.dueDate || "",
            "Installment Amount": inst.installmentAmount || 0,
            "Unpaid Amount": inst.unpaidAmount || 0,
            "Days Past Due": inst.daysPastDue || 0,
            "PAR Category": inst.parCategory || "",
          });
        }
      }
    }
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 18 },
      { wch: 8 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 16 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Loan Aging Report");
    XLSX.writeFile(wb, `Loan_Aging_Report.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Loan Aging Report", 148, 15, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    let subtitle = "Overdue installments grouped by branch";
    if (filterStartDate || filterEndDate) {
      subtitle += ` | Date: ${filterStartDate || "..."} to ${filterEndDate || "..."}`;
    }
    if (filterBranch !== "all") subtitle += ` | Branch: ${filterBranch}`;
    doc.text(subtitle, 148, 22, { align: "center" });

    const tableData: any[] = [];
    for (const [branch, loans] of branchGroups) {
      for (const loan of loans) {
        for (const inst of loan.installments) {
          tableData.push([
            branch,
            loan.loanId,
            loan.customerName,
            loan.product,
            inst.installmentNumber,
            inst.dueDate || "",
            inst.unpaidAmount?.toLocaleString() || "0",
            `${inst.daysPastDue} days`,
            inst.parCategory || "",
          ]);
        }
      }
    }

    autoTable(doc, {
      startY: 28,
      head: [["Branch", "Financing ID", "Customer", "Product", "Inst #", "Due Date", "Unpaid Amount", "Days Past Due", "PAR Category"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 7 },
      bodyStyles: { fontSize: 7 },
      columnStyles: {
        6: { halign: "right" },
        7: { halign: "right" },
      },
    });
    doc.save("Loan_Aging_Report.pdf");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Loan Aging Report
            </CardTitle>
            <CardDescription>Overdue installments grouped by branch and financing. Click a branch to expand.</CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {filteredReport.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={expandAllBranches} data-testid="button-expand-all">
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAllBranches} data-testid="button-collapse-all">
                  Collapse All
                </Button>
                <Button size="sm" onClick={handleExportExcel} className="gap-1 bg-green-600 text-white" data-testid="button-export-excel-aging">
                  <FileSpreadsheet className="h-4 w-4" /> Excel
                </Button>
                <Button size="sm" onClick={handleExportPDF} className="gap-1 bg-red-600 text-white" data-testid="button-export-pdf-aging">
                  <FileText className="h-4 w-4" /> PDF
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4 mb-4 flex-wrap">
          <div className="space-y-1">
            <Label className="text-xs">Start Date (Due Date)</Label>
            <Input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className="w-40" data-testid="input-aging-start-date" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">End Date (Due Date)</Label>
            <Input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className="w-40" data-testid="input-aging-end-date" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Branch</Label>
            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger className="w-44" data-testid="select-aging-branch">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {allBranches.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(filterStartDate || filterEndDate || filterBranch !== "all") && (
            <Button variant="ghost" size="sm" onClick={() => { setFilterStartDate(""); setFilterEndDate(""); setFilterBranch("all"); }} data-testid="button-clear-aging-filters">
              <Filter className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
          <div className="ml-auto text-sm text-muted-foreground">
            {filteredReport.length} overdue installments
          </div>
        </div>

        {agingLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="overflow-x-auto">
            {Array.from(branchGroups.entries()).map(([branch, loans]) => {
              const isBranchExpanded = expandedBranches.has(branch);
              const branchTotalUnpaid = loans.reduce((s, l) => s + l.totalUnpaid, 0);
              const branchMaxDays = Math.max(...loans.map(l => l.maxDaysPastDue));
              const totalInstallments = loans.reduce((s, l) => s + l.installments.length, 0);
              return (
                <div key={branch} className="mb-3 border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => toggleBranch(branch)}
                    data-testid={`row-aging-branch-${branch}`}
                  >
                    <div className="flex items-center gap-2">
                      {isBranchExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <Building2 className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">{branch}</span>
                      <Badge variant="secondary" className="ml-2">{loans.length} loans</Badge>
                      <Badge variant="outline" className="ml-1">{totalInstallments} installments</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">{formatCurrency(branchTotalUnpaid)}</span>
                      <Badge variant={branchMaxDays > 90 ? "destructive" : branchMaxDays > 30 ? "secondary" : "outline"}>
                        Max: {branchMaxDays} days
                      </Badge>
                    </div>
                  </div>
                  {isBranchExpanded && (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="text-left p-2 pl-4 font-semibold w-8"></th>
                          <th className="text-left p-2 font-semibold">Financing ID</th>
                          <th className="text-left p-2 font-semibold">Customer</th>
                          <th className="text-left p-2 font-semibold">Product</th>
                          <th className="text-left p-2 font-semibold">Officer</th>
                          <th className="text-center p-2 font-semibold">Late Inst.</th>
                          <th className="text-right p-2 font-semibold">Total Unpaid</th>
                          <th className="text-right p-2 font-semibold">Max Days Past Due</th>
                        </tr>
                      </thead>
                      {loans.map((group) => {
                        const isExpanded = expandedLoans.has(group.loanId);
                        return (
                          <tbody key={group.loanId}>
                            <tr
                              className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => toggleLoan(group.loanId)}
                              data-testid={`row-aging-loan-${group.loanId}`}
                            >
                              <td className="p-2 pl-4">
                                {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                              </td>
                              <td className="p-2 font-mono text-sm font-medium">{group.loanId}</td>
                              <td className="p-2 font-medium">{group.customerName}</td>
                              <td className="p-2">{group.product}</td>
                              <td className="p-2 text-muted-foreground">{group.officer}</td>
                              <td className="p-2 text-center">
                                <Badge variant="secondary">{group.installments.length}</Badge>
                              </td>
                              <td className="p-2 text-right font-medium">{formatCurrency(group.totalUnpaid)}</td>
                              <td className="p-2 text-right">
                                <Badge variant={group.maxDaysPastDue > 90 ? "destructive" : group.maxDaysPastDue > 30 ? "secondary" : "outline"}>
                                  {group.maxDaysPastDue} days
                                </Badge>
                              </td>
                            </tr>
                            {isExpanded && group.installments.map((inst: any) => (
                              <tr key={`${group.loanId}-inst-${inst.installmentNumber}`} className="bg-muted/20 border-b">
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td colSpan={2} className="p-2 pl-4 text-muted-foreground text-xs">
                                  Installment #{inst.installmentNumber}
                                </td>
                                <td className="p-2 text-xs text-muted-foreground">
                                  {inst.dueDate ? new Date(inst.dueDate + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                </td>
                                <td className="p-2 text-xs text-muted-foreground">{inst.parCategory}</td>
                                <td className="p-2 text-right text-xs">{formatCurrency(inst.unpaidAmount || 0)}</td>
                                <td className="p-2 text-right">
                                  <Badge variant={inst.daysPastDue > 90 ? "destructive" : inst.daysPastDue > 30 ? "secondary" : "outline"} className="text-xs">
                                    {inst.daysPastDue} days
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        );
                      })}
                    </table>
                  )}
                </div>
              );
            })}
            {branchGroups.size === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No overdue installments found
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ParReportPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loans, setLoans] = useState<LoanDetail[]>([]);
  const [loansLoading, setLoansLoading] = useState(false);

  const handleRowClick = (type: DialogType, item: any) => {
    setDialogType(type);
    setSelectedItem(item);
    setDialogOpen(true);
  };

  // Fetch loans when dialog opens
  useEffect(() => {
    const fetchLoans = async () => {
      if (!dialogOpen || !selectedItem || !dialogType) {
        setLoans([]);
        return;
      }

      setLoansLoading(true);
      try {
        let url = "";
        if (dialogType === "category") {
          url = `/api/reports/par-loans/category/${selectedItem.id}`;
        } else if (dialogType === "branch") {
          url = `/api/reports/par-loans/branch/${encodeURIComponent(selectedItem.branch)}`;
        } else if (dialogType === "officer") {
          url = `/api/reports/par-loans/officer/${encodeURIComponent(selectedItem.officer)}`;
        } else if (dialogType === "product") {
          url = `/api/reports/par-loans/product/${encodeURIComponent(selectedItem.product)}`;
        }

        if (url) {
          const res = await fetch(url, { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setLoans(data);
          }
        }
      } catch (error) {
        console.error("Error fetching loans:", error);
        setLoans([]);
      } finally {
        setLoansLoading(false);
      }
    };

    fetchLoans();
  }, [dialogOpen, selectedItem, dialogType]);

  const { data: parData, isLoading: parLoading } = useQuery<ParAnalysisData>({
    queryKey: ["/api/reports/par-analysis"],
    queryFn: async () => {
      const res = await fetch("/api/reports/par-analysis", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch PAR analysis");
      return res.json();
    },
  });

  const { data: parByBranch, isLoading: parByBranchLoading } = useQuery<any[]>({
    queryKey: ["/api/reports/par-by-branch"],
    queryFn: async () => {
      const res = await fetch("/api/reports/par-by-branch", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch PAR by branch");
      return res.json();
    },
  });

  const { data: parByOfficer, isLoading: parByOfficerLoading } = useQuery<any[]>({
    queryKey: ["/api/reports/par-by-officer"],
    queryFn: async () => {
      const res = await fetch("/api/reports/par-by-officer", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch PAR by officer");
      return res.json();
    },
  });

  const { data: parByProduct, isLoading: parByProductLoading } = useQuery<any[]>({
    queryKey: ["/api/reports/par-by-product"],
    queryFn: async () => {
      const res = await fetch("/api/reports/par-by-product", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch PAR by product");
      return res.json();
    },
  });

  const { data: agingReport, isLoading: agingLoading } = useQuery<any[]>({
    queryKey: ["/api/reports/aging"],
    queryFn: async () => {
      const res = await fetch("/api/reports/aging", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch aging report");
      return res.json();
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-par-report-title">PAR Report</h1>
        <p className="text-muted-foreground">
          Portfolio at Risk Analysis and Loan Aging Reports
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {parLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(parData?.summary?.totalPortfolio || 0)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {parLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(parData?.summary?.totalOutstanding || 0)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Provision</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {parLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-600">{formatCurrency(parData?.summary?.totalProvision || 0)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PAR Ratio</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {parLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                <Badge variant={parseFloat(parData?.summary?.parRatio || "0") > 5 ? "destructive" : "outline"}>
                  {parData?.summary?.parRatio || "0"}%
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PAR by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            PAR Analysis by Category
          </CardTitle>
          <CardDescription>Financing classification by days past due with provision requirements</CardDescription>
        </CardHeader>
        <CardContent>
          {parLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-par-categories">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold">Category</th>
                    <th className="text-right p-3 font-semibold">Days Range</th>
                    <th className="text-right p-3 font-semibold">Provision %</th>
                    <th className="text-right p-3 font-semibold">Financings</th>
                    <th className="text-right p-3 font-semibold">Overdue Installments</th>
                    <th className="text-right p-3 font-semibold">Financing Amount</th>
                    <th className="text-right p-3 font-semibold">Overdue Amount</th>
                    <th className="text-right p-3 font-semibold">Provision</th>
                    <th className="text-right p-3 font-semibold">% of Portfolio</th>
                  </tr>
                </thead>
                <tbody>
                  {(parData?.categories || []).map((cat, index) => (
                    <tr 
                      key={cat.id || index} 
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick("category", cat)}
                      data-testid={`row-par-category-${cat.id || index}`}
                    >
                      <td className="p-3 font-medium">{cat.category}</td>
                      <td className="p-3 text-right text-muted-foreground">
                        {cat.startDay === 0 && cat.endDay === 0 ? '0' : `${cat.startDay}-${cat.endDay > 10000 ? '∞' : cat.endDay}`}
                      </td>
                      <td className="p-3 text-right">{cat.provisionPercent}%</td>
                      <td className="p-3 text-right">{cat.loanCount}</td>
                      <td className="p-3 text-right">{cat.installmentCount || 0}</td>
                      <td className="p-3 text-right">{formatCurrency(cat.totalAmount)}</td>
                      <td className="p-3 text-right">{formatCurrency(cat.outstandingAmount)}</td>
                      <td className="p-3 text-right text-red-600 font-medium">{formatCurrency(cat.provisionAmount)}</td>
                      <td className="p-3 text-right">
                        <Badge variant="outline">{cat.amountPercentage}%</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50 font-semibold">
                    <td className="p-3">Total</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3 text-right">{parData?.summary?.totalLoans || 0}</td>
                    <td className="p-3 text-right">{(parData?.categories || []).reduce((sum: number, c: any) => sum + (c.installmentCount || 0), 0)}</td>
                    <td className="p-3 text-right">{formatCurrency(parData?.summary?.totalPortfolio || 0)}</td>
                    <td className="p-3 text-right">{formatCurrency(parData?.summary?.totalOutstanding || 0)}</td>
                    <td className="p-3 text-right text-red-600">{formatCurrency(parData?.summary?.totalProvision || 0)}</td>
                    <td className="p-3 text-right">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PAR by Branch */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            PAR by Branch
          </CardTitle>
          <CardDescription>Portfolio at Risk breakdown by branch location</CardDescription>
        </CardHeader>
        <CardContent>
          {parByBranchLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-par-by-branch">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold">Branch</th>
                    <th className="text-right p-3 font-semibold">Financings</th>
                    <th className="text-right p-3 font-semibold">Portfolio</th>
                    <th className="text-right p-3 font-semibold">Outstanding</th>
                    <th className="text-right p-3 font-semibold">PAR Amount</th>
                    <th className="text-right p-3 font-semibold">PAR Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {(parByBranch || []).map((item, index) => (
                    <tr 
                      key={index} 
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick("branch", item)}
                      data-testid={`row-par-branch-${index}`}
                    >
                      <td className="p-3 font-medium">{item.branch}</td>
                      <td className="p-3 text-right">{item.loanCount}</td>
                      <td className="p-3 text-right">{formatCurrency(item.totalAmount)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.outstandingAmount)}</td>
                      <td className="p-3 text-right text-orange-600">{formatCurrency(item.parAmount)}</td>
                      <td className="p-3 text-right">
                        <Badge variant={parseFloat(item.parRatio) > 5 ? "destructive" : "outline"}>
                          {item.parRatio}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PAR by Finance Officer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            PAR by Finance Officer
          </CardTitle>
          <CardDescription>Portfolio at Risk breakdown by loan officer</CardDescription>
        </CardHeader>
        <CardContent>
          {parByOfficerLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-par-by-officer">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold">Officer</th>
                    <th className="text-left p-3 font-semibold">Branch</th>
                    <th className="text-right p-3 font-semibold">Financings</th>
                    <th className="text-right p-3 font-semibold">Portfolio</th>
                    <th className="text-right p-3 font-semibold">Outstanding</th>
                    <th className="text-right p-3 font-semibold">PAR Amount</th>
                    <th className="text-right p-3 font-semibold">PAR Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {(parByOfficer || []).map((item, index) => (
                    <tr 
                      key={index} 
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick("officer", item)}
                      data-testid={`row-par-officer-${index}`}
                    >
                      <td className="p-3 font-medium">{item.officer}</td>
                      <td className="p-3 text-muted-foreground">{item.branch}</td>
                      <td className="p-3 text-right">{item.loanCount}</td>
                      <td className="p-3 text-right">{formatCurrency(item.totalAmount)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.outstandingAmount)}</td>
                      <td className="p-3 text-right text-orange-600">{formatCurrency(item.parAmount)}</td>
                      <td className="p-3 text-right">
                        <Badge variant={parseFloat(item.parRatio) > 5 ? "destructive" : "outline"}>
                          {item.parRatio}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PAR by Product */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-500" />
            PAR by Product
          </CardTitle>
          <CardDescription>Portfolio at Risk breakdown by loan product type</CardDescription>
        </CardHeader>
        <CardContent>
          {parByProductLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-par-by-product">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold">Product</th>
                    <th className="text-right p-3 font-semibold">Financings</th>
                    <th className="text-right p-3 font-semibold">Portfolio</th>
                    <th className="text-right p-3 font-semibold">Outstanding</th>
                    <th className="text-right p-3 font-semibold">PAR Amount</th>
                    <th className="text-right p-3 font-semibold">PAR Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {(parByProduct || []).map((item, index) => (
                    <tr 
                      key={index} 
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick("product", item)}
                      data-testid={`row-par-product-${index}`}
                    >
                      <td className="p-3 font-medium">{item.product}</td>
                      <td className="p-3 text-right">{item.loanCount}</td>
                      <td className="p-3 text-right">{formatCurrency(item.totalAmount)}</td>
                      <td className="p-3 text-right">{formatCurrency(item.outstandingAmount)}</td>
                      <td className="p-3 text-right text-orange-600">{formatCurrency(item.parAmount)}</td>
                      <td className="p-3 text-right">
                        <Badge variant={parseFloat(item.parRatio) > 5 ? "destructive" : "outline"}>
                          {item.parRatio}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aging Report */}
      <AgingReportSection agingReport={agingReport} agingLoading={agingLoading} formatCurrency={formatCurrency} />

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {dialogType === "category" && (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  PAR Category Details: {selectedItem?.category}
                </>
              )}
              {dialogType === "branch" && (
                <>
                  <Building2 className="h-5 w-5 text-blue-500" />
                  Branch Details: {selectedItem?.branch}
                </>
              )}
              {dialogType === "officer" && (
                <>
                  <Users className="h-5 w-5 text-green-500" />
                  Officer Details: {selectedItem?.officer}
                </>
              )}
              {dialogType === "product" && (
                <>
                  <Package className="h-5 w-5 text-purple-500" />
                  Product Details: {selectedItem?.product}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "category" && "Detailed breakdown of loans in this risk category"}
              {dialogType === "branch" && "Portfolio at Risk analysis for this branch"}
              {dialogType === "officer" && "Portfolio at Risk analysis for this finance officer"}
              {dialogType === "product" && "Portfolio at Risk analysis for this loan product"}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              {dialogType === "category" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedItem.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Days Range</p>
                    <p className="font-medium">
                      {selectedItem.startDay === 0 && selectedItem.endDay === 0 
                        ? 'Current (0 days)' 
                        : `${selectedItem.startDay} - ${selectedItem.endDay > 10000 ? '∞' : selectedItem.endDay} days`}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Provision Rate</p>
                    <p className="font-medium">{selectedItem.provisionPercent}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Number of Loans</p>
                    <p className="font-medium">{selectedItem.loanCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Loan Amount</p>
                    <p className="font-medium">{formatCurrency(selectedItem.totalAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                    <p className="font-medium">{formatCurrency(selectedItem.outstandingAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Required Provision</p>
                    <p className="font-medium text-red-600">{formatCurrency(selectedItem.provisionAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">% of Portfolio</p>
                    <Badge variant="outline">{selectedItem.amountPercentage}%</Badge>
                  </div>
                </div>
              )}

              {(dialogType === "branch" || dialogType === "officer" || dialogType === "product") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {dialogType === "branch" && "Branch Name"}
                      {dialogType === "officer" && "Officer Name"}
                      {dialogType === "product" && "Product Name"}
                    </p>
                    <p className="font-medium">
                      {dialogType === "branch" && selectedItem.branch}
                      {dialogType === "officer" && selectedItem.officer}
                      {dialogType === "product" && selectedItem.product}
                    </p>
                  </div>
                  {dialogType === "officer" && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Branch</p>
                      <p className="font-medium">{selectedItem.branch}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Number of Loans</p>
                    <p className="font-medium">{selectedItem.loanCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Portfolio</p>
                    <p className="font-medium">{formatCurrency(selectedItem.totalAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                    <p className="font-medium">{formatCurrency(selectedItem.outstandingAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">PAR Amount</p>
                    <p className="font-medium text-orange-600">{formatCurrency(selectedItem.parAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">PAR Ratio</p>
                    <Badge variant={parseFloat(selectedItem.parRatio) > 5 ? "destructive" : "outline"}>
                      {selectedItem.parRatio}%
                    </Badge>
                  </div>
                </div>
              )}

              {/* Loans List Section */}
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Loans in this {dialogType === "category" ? "Category" : dialogType === "branch" ? "Branch" : dialogType === "officer" ? "Officer's Portfolio" : "Product"} ({loans.length})
                  </h4>
                  {loans.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => {
                        const rows = loans.map((loan, idx) => ({
                          "#": idx + 1,
                          "Financing ID": loan.applicationId,
                          "Customer": loan.customerName,
                          "Branch": loan.branch,
                          "Inst #": loan.installmentNumber || "",
                          "Due Date": loan.dueDate || "",
                          "Unpaid Amount": loan.outstanding,
                          "Days Past Due": loan.lateDays,
                        }));
                        const ws = XLSX.utils.json_to_sheet(rows);
                        ws["!cols"] = [{ wch: 5 }, { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 8 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
                        const wb = XLSX.utils.book_new();
                        const sheetName = dialogType === "branch" ? selectedItem?.branch : dialogType === "officer" ? selectedItem?.officer : dialogType === "product" ? selectedItem?.product : selectedItem?.category;
                        XLSX.utils.book_append_sheet(wb, ws, "PAR Loans");
                        XLSX.writeFile(wb, `PAR_${dialogType}_${sheetName || "detail"}.xlsx`);
                      }} className="gap-1 bg-green-600 text-white" data-testid="button-export-excel-dialog">
                        <FileSpreadsheet className="h-4 w-4" /> Excel
                      </Button>
                      <Button size="sm" onClick={() => {
                        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
                        const title = dialogType === "branch" ? `Branch: ${selectedItem?.branch}` : dialogType === "officer" ? `Officer: ${selectedItem?.officer}` : dialogType === "product" ? `Product: ${selectedItem?.product}` : `Category: ${selectedItem?.category}`;
                        doc.setFontSize(14);
                        doc.setFont("helvetica", "bold");
                        doc.text(`PAR Detail - ${title}`, 148, 15, { align: "center" });
                        const tableData = loans.map((loan, idx) => [
                          idx + 1,
                          loan.applicationId,
                          loan.customerName,
                          loan.branch,
                          loan.installmentNumber || "-",
                          loan.dueDate ? new Date(loan.dueDate + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "-",
                          loan.outstanding?.toLocaleString() || "0",
                          `${loan.lateDays} days`,
                        ]);
                        autoTable(doc, {
                          startY: 22,
                          head: [["#", "Financing ID", "Customer", "Branch", "Inst #", "Due Date", "Unpaid Amount", "Days Past Due"]],
                          body: tableData,
                          theme: "grid",
                          headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 7 },
                          bodyStyles: { fontSize: 7 },
                          columnStyles: { 6: { halign: "right" }, 7: { halign: "right" } },
                        });
                        doc.save(`PAR_${dialogType}_${selectedItem?.branch || selectedItem?.officer || selectedItem?.product || selectedItem?.category || "detail"}.pdf`);
                      }} className="gap-1 bg-red-600 text-white" data-testid="button-export-pdf-dialog">
                        <FileText className="h-4 w-4" /> PDF
                      </Button>
                    </div>
                  )}
                </div>
                
                {loansLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading loans...</span>
                  </div>
                ) : loans.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No loans found in this category
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" data-testid="table-dialog-loans">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-2 font-semibold">Financing ID</th>
                            <th className="text-left p-2 font-semibold">Customer</th>
                            <th className="text-left p-2 font-semibold">Branch</th>
                            <th className="text-center p-2 font-semibold">Inst #</th>
                            <th className="text-left p-2 font-semibold">Due Date</th>
                            <th className="text-right p-2 font-semibold">Unpaid Amount</th>
                            <th className="text-right p-2 font-semibold">Days Past Due</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loans.map((loan, index) => (
                            <tr key={loan.id || index} className="border-b hover:bg-muted/30" data-testid={`row-loan-${loan.id}`}>
                              <td className="p-2 font-medium">{loan.applicationId}</td>
                              <td className="p-2">{loan.customerName}</td>
                              <td className="p-2 text-muted-foreground">{loan.branch}</td>
                              <td className="p-2 text-center">{loan.installmentNumber || '-'}</td>
                              <td className="p-2">{loan.dueDate ? new Date(loan.dueDate + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                              <td className="p-2 text-right">{formatCurrency(loan.outstanding)}</td>
                              <td className="p-2 text-right">
                                <Badge variant={loan.lateDays > 30 ? "destructive" : loan.lateDays > 0 ? "secondary" : "outline"}>
                                  {loan.lateDays} days
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)} data-testid="button-close-dialog">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
