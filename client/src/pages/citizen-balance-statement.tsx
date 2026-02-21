import { useState, useRef, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  FileSpreadsheet,
  FileText,
  Eye,
  Search,
  ChevronDown,
  X,
  RefreshCw,
  Save,
  Calculator,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ScheduleRow = {
  no: number;
  installmentDate: string | null;
  principleAmount: number;
  marginAmount: number;
  totalAmount: number;
};

type ActualPaymentRow = {
  no: number;
  paymentDate: string | null;
  principleAmount: number;
  marginAmount: number;
  totalAmount: number;
  isPaid: boolean;
  arears: number;
};

type LoanStatement = {
  loan: {
    id: string;
    applicationId: string;
    productName: string;
    financingCycle: number;
    financingAmount: number;
    marginRate: number;
    status: string;
    principleAmount: number;
    profit: number;
    totalReceivable: number;
    requestAmount: number;
    numberOfInstallments: number;
    financingDurationMonths: number;
    gracePeriod: number;
  };
  branch: { name: string; shortName?: string } | null;
  officer: { name: string } | null;
  branchManager: string;
  disbursement: {
    disbursementDate: string;
    firstInstallmentDate: string;
    maturityDate: string;
  } | null;
  province: string;
  district: string;
  schedule: ScheduleRow[];
  actualPayments: ActualPaymentRow[];
  scheduleTotals: { principleAmount: number; marginAmount: number; totalAmount: number };
  actualTotals: { principleAmount: number; marginAmount: number; totalAmount: number; arears: number };
  outstanding: { principleAmount: number; marginAmount: number; totalAmount: number };
};

type StatementData = {
  customer: {
    id: string;
    customerNo: string;
    name: string;
    fatherName: string;
  };
  loanStatements: LoanStatement[];
};

type InstallmentRow = {
  id: string | null;
  installmentNumber: number;
  dueDate: string | null;
  currentPrincipal: number | null;
  currentMargin: number | null;
  currentTotal: number | null;
  calculatedPrincipal: number;
  calculatedMargin: number;
  calculatedTotal: number;
  paidAmount: number;
  isPaid: boolean;
  paymentDate: string | null;
  lateDays: number | null;
  installmentVariance: number | null;
  hasNullAmounts: boolean;
};

type ScheduleData = {
  loan: {
    id: string;
    applicationId: string;
    principalAmount: number;
    marginRate: number;
    numberOfInstallments: number;
    financingDurationMonths: number;
    gracePeriod: number;
    requestAmount: number;
    financingCycle: number;
    status: string;
    productName: string;
  };
  customer: { id: string; name: string; customerNo: string } | null;
  branch: { id: string; name: string } | null;
  disbursement: { disbursementDate: string; firstInstallmentDate: string; maturityDate: string } | null;
  installments: InstallmentRow[];
  summary: {
    totalInstallments: number;
    nullAmountCount: number;
    paidCount: number;
    unpaidCount: number;
  };
};

function formatAFN(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-AF", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formatDateDMY = (dateStr: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = d.getDate();
  const mon = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${day}/${mon}/${year}`;
};

const formatDateTime = () => {
  const now = new Date();
  return {
    date: `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`,
    time: now.toLocaleTimeString("en-US", { hour12: false }),
  };
};

export default function CitizenBalanceStatementPage() {
  const [activeTab, setActiveTab] = useState("statement");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [showReport, setShowReport] = useState(false);
  const [cleanupEdits, setCleanupEdits] = useState<Record<string, { requestAmount: string; principleAmount: string; marginRate: string; gracePeriod: string; financingDurationMonths: string; numberOfInstallments: string; disbursementDate: string }>>({});
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentDialogInst, setPaymentDialogInst] = useState<InstallmentRow | null>(null);
  const [paymentForm, setPaymentForm] = useState({ paidAmount: "", paymentDate: "", isPaid: true });
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [instSelectedLoanId, setInstSelectedLoanId] = useState("");
  const [instSearchTerm, setInstSearchTerm] = useState("");
  const [instDropdownOpen, setInstDropdownOpen] = useState(false);
  const instDropdownRef = useRef<HTMLDivElement>(null);
  const [showInstSchedule, setShowInstSchedule] = useState(false);
  const [editedRows, setEditedRows] = useState<Record<string, { principal: string; margin: string; isPaid?: boolean }>>({});
  const [applyCalculated, setApplyCalculated] = useState(false);

  const { data: customers, isLoading: customersLoading } = useQuery<any[]>({
    queryKey: ["/api/customers", { limit: 9999 }],
    queryFn: async () => {
      const res = await fetch("/api/customers?limit=9999");
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      return data.customers || data;
    },
  });

  const { data: statementData, isLoading: statementLoading, refetch } = useQuery<StatementData>({
    queryKey: ["/api/reports/citizen-balance-statement", selectedCustomerId],
    enabled: showReport && !!selectedCustomerId,
  });

  const { data: userData } = useQuery<any>({
    queryKey: ["/api/auth/user"],
  });

  const isAdminOrManager = userData?.role === "admin" || userData?.role === "manager";

  const regenerateMutation = useMutation({
    mutationFn: async ({ loanId, data }: { loanId: string; data: any }) => {
      const res = await apiRequest("POST", `/api/loans/${loanId}/update-and-regenerate`, data);
      return res.json();
    },
    onSuccess: (result) => {
      toast({ title: "Installments Regenerated", description: result.message });
      queryClient.invalidateQueries({ queryKey: ["/api/reports/citizen-balance-statement", selectedCustomerId] });
      if (instSelectedLoanId) {
        setCleanupEdits((prev) => {
          const copy = { ...prev };
          delete copy[instSelectedLoanId];
          return copy;
        });
        queryClient.invalidateQueries({ queryKey: ["/api/loans", instSelectedLoanId, "installment-schedule"] });
      }
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to regenerate", variant: "destructive" });
    },
  });

  const { data: disbursedLoans, isLoading: instLoansLoading } = useQuery<any[]>({
    queryKey: ["/api/loans/disbursed"],
    enabled: activeTab === "installment-cleanup",
  });

  const { data: instScheduleData, isLoading: instScheduleLoading, refetch: refetchInstSchedule } = useQuery<ScheduleData>({
    queryKey: ["/api/loans", instSelectedLoanId, "installment-schedule"],
    enabled: showInstSchedule && !!instSelectedLoanId,
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async (updates: any[]) => {
      const res = await apiRequest("PATCH", "/api/installments/bulk-update", { updates });
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Saved", description: `Updated ${data.updatedCount} installments, skipped ${data.skippedCount} (paid).` });
      setEditedRows({});
      queryClient.invalidateQueries({ queryKey: ["/api/loans", instSelectedLoanId, "installment-schedule"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to save", variant: "destructive" });
    },
  });

  const generateAllMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/installments/generate-all");
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Generation Complete", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/loans/disbursed"] });
      if (instSelectedLoanId) {
        queryClient.invalidateQueries({ queryKey: ["/api/loans", instSelectedLoanId, "installment-schedule"] });
      }
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to generate installments", variant: "destructive" });
    },
  });

  const paymentUpdateMutation = useMutation({
    mutationFn: async ({ instId, data }: { instId: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/installments/${instId}/payment`, data);
      return res.json();
    },
    onSuccess: (result) => {
      toast({ title: "Payment Updated", description: `${result.message} | Variance: ${formatAFN(parseFloat(result.variance))} AFN${result.lateDays !== null ? ` | PAR Days: ${result.lateDays}` : ""}` });
      setPaymentDialogOpen(false);
      setPaymentDialogInst(null);
      setPaymentForm({ paidAmount: "", paymentDate: "", isPaid: true });
      queryClient.invalidateQueries({ queryKey: ["/api/loans", instSelectedLoanId, "installment-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reports/citizen-balance-statement", selectedCustomerId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update payment", variant: "destructive" });
    },
  });

  const openPaymentDialog = (inst: InstallmentRow) => {
    setPaymentDialogInst(inst);
    setPaymentForm({
      paidAmount: inst.paidAmount > 0 ? inst.paidAmount.toFixed(2) : "",
      paymentDate: inst.paymentDate || "",
      isPaid: inst.isPaid,
    });
    setPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = () => {
    if (!paymentDialogInst?.id) return;
    const paidAmt = parseFloat(paymentForm.paidAmount || "0");
    paymentUpdateMutation.mutate({
      instId: paymentDialogInst.id,
      data: {
        paidAmount: paidAmt.toFixed(2),
        paymentDate: paymentForm.paymentDate || null,
        isPaid: paymentForm.isPaid,
      },
    });
  };

  const instLoanList = Array.isArray(disbursedLoans) ? disbursedLoans : [];

  const getInstLoanLabel = (l: any) =>
    `${l.customerName} (${l.customerNo || "N/A"}) - ${l.applicationId || "N/A"}`;

  const filteredInstLoans = useMemo(() => {
    if (!instSearchTerm.trim()) return instLoanList;
    const lower = instSearchTerm.toLowerCase();
    return instLoanList.filter((l: any) => getInstLoanLabel(l).toLowerCase().includes(lower));
  }, [instLoanList, instSearchTerm]);

  const selectedInstLoanLabel = useMemo(() => {
    if (!instSelectedLoanId) return "";
    const found = instLoanList.find((l: any) => l.id === instSelectedLoanId);
    return found ? getInstLoanLabel(found) : "";
  }, [instSelectedLoanId, instLoanList]);

  useEffect(() => {
    const handleInstClickOutside = (e: MouseEvent) => {
      if (instDropdownRef.current && !instDropdownRef.current.contains(e.target as Node)) {
        setInstDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleInstClickOutside);
    return () => document.removeEventListener("mousedown", handleInstClickOutside);
  }, []);

  useEffect(() => {
    if (instScheduleData?.loan) {
      const loanId = instScheduleData.loan.id;
      if (!cleanupEdits[loanId]) {
        setCleanupEdits((prev) => ({
          ...prev,
          [loanId]: {
            requestAmount: instScheduleData.loan.requestAmount.toString(),
            principleAmount: instScheduleData.loan.principalAmount.toString(),
            marginRate: instScheduleData.loan.marginRate.toString(),
            gracePeriod: instScheduleData.loan.gracePeriod.toString(),
            financingDurationMonths: instScheduleData.loan.financingDurationMonths.toString(),
            numberOfInstallments: instScheduleData.loan.numberOfInstallments.toString(),
            disbursementDate: instScheduleData.disbursement?.disbursementDate || "",
          },
        }));
      }
    }
  }, [instScheduleData]);

  const handleInstView = () => {
    if (!instSelectedLoanId) {
      toast({ title: "Select Financing", description: "Please select a financing first.", variant: "destructive" });
      return;
    }
    setShowInstSchedule(true);
    setEditedRows({});
    setApplyCalculated(false);
    setCleanupEdits((prev) => {
      const copy = { ...prev };
      delete copy[instSelectedLoanId];
      return copy;
    });
  };

  const getRowKey = (inst: InstallmentRow) => inst.id || `new_${inst.installmentNumber}`;

  const handleApplyCalculated = () => {
    if (!instScheduleData) return;
    const newEdited: Record<string, { principal: string; margin: string }> = {};
    for (const inst of instScheduleData.installments) {
      if (!inst.isPaid) {
        newEdited[getRowKey(inst)] = {
          principal: inst.calculatedPrincipal.toFixed(2),
          margin: inst.calculatedMargin.toFixed(2),
        };
      }
    }
    setEditedRows(newEdited);
    setApplyCalculated(true);
    toast({ title: "Calculated Values Applied", description: "Review the values and click Save to persist changes." });
  };

  const handleRowChange = (id: string, field: "principal" | "margin", value: string) => {
    setEditedRows((prev) => ({
      ...prev,
      [id]: {
        principal: prev[id]?.principal || "",
        margin: prev[id]?.margin || "",
        isPaid: prev[id]?.isPaid,
        [field]: value,
      },
    }));
  };

  const handleTogglePaid = (inst: InstallmentRow) => {
    const key = getRowKey(inst);
    const currentlyPaid = editedRows[key]?.isPaid !== undefined ? editedRows[key].isPaid : inst.isPaid;
    setEditedRows((prev) => ({
      ...prev,
      [key]: {
        principal: prev[key]?.principal || (inst.currentPrincipal !== null ? inst.currentPrincipal.toFixed(2) : ""),
        margin: prev[key]?.margin || (inst.currentMargin !== null ? inst.currentMargin.toFixed(2) : ""),
        isPaid: !currentlyPaid,
      },
    }));
  };

  const handleInstSave = () => {
    if (!instScheduleData) return;
    const updates = Object.entries(editedRows)
      .filter(([_, v]) => v.principal || v.margin || v.isPaid !== undefined)
      .map(([key, v]) => {
        const isNew = key.startsWith("new_");
        if (isNew) {
          const instNum = parseInt(key.replace("new_", ""));
          const inst = instScheduleData.installments.find((i) => i.installmentNumber === instNum);
          return {
            id: null,
            loanId: instScheduleData.loan.id,
            installmentNumber: instNum,
            dueDate: inst?.dueDate || null,
            principleAmount: v.principal,
            marginAmount: v.margin,
            isPaid: v.isPaid,
          };
        }
        return {
          id: key,
          principleAmount: v.principal,
          marginAmount: v.margin,
          isPaid: v.isPaid,
        };
      });

    if (updates.length === 0) {
      toast({ title: "No Changes", description: "No installments were modified.", variant: "destructive" });
      return;
    }
    bulkUpdateMutation.mutate(updates);
  };

  const getDisplayPrincipal = (inst: InstallmentRow) => {
    const key = getRowKey(inst);
    if (editedRows[key]) return editedRows[key].principal;
    if (inst.currentPrincipal !== null) return inst.currentPrincipal.toFixed(2);
    return "";
  };

  const getDisplayMargin = (inst: InstallmentRow) => {
    const key = getRowKey(inst);
    if (editedRows[key]) return editedRows[key].margin;
    if (inst.currentMargin !== null) return inst.currentMargin.toFixed(2);
    return "";
  };

  const getDisplayTotal = (inst: InstallmentRow) => {
    const key = getRowKey(inst);
    if (editedRows[key]) {
      const p = parseFloat(editedRows[key].principal || "0");
      const m = parseFloat(editedRows[key].margin || "0");
      return (p + m).toFixed(2);
    }
    if (inst.currentTotal !== null) return inst.currentTotal.toFixed(2);
    return "";
  };

  const hasInstChanges = Object.keys(editedRows).length > 0;

  useEffect(() => {
    if (statementData?.loanStatements) {
      const edits: Record<string, { requestAmount: string; principleAmount: string; marginRate: string; gracePeriod: string; financingDurationMonths: string; numberOfInstallments: string; disbursementDate: string }> = {};
      statementData.loanStatements.forEach((ls) => {
        if (!cleanupEdits[ls.loan.id]) {
          edits[ls.loan.id] = {
            requestAmount: ls.loan.requestAmount.toString(),
            principleAmount: ls.loan.principleAmount.toString(),
            marginRate: ls.loan.marginRate.toString(),
            gracePeriod: ls.loan.gracePeriod.toString(),
            financingDurationMonths: ls.loan.financingDurationMonths.toString(),
            numberOfInstallments: ls.loan.numberOfInstallments.toString(),
            disbursementDate: ls.disbursement?.disbursementDate || "",
          };
        }
      });
      if (Object.keys(edits).length > 0) {
        setCleanupEdits((prev) => ({ ...prev, ...edits }));
      }
    }
  }, [statementData]);

  const handleView = () => {
    if (!selectedCustomerId) {
      toast({ title: "Select Customer", description: "Please select a customer first.", variant: "destructive" });
      return;
    }
    setShowReport(true);
    refetch();
  };

  const handleGenerate = (loanId: string) => {
    const edit = cleanupEdits[loanId];
    if (!edit) return;
    regenerateMutation.mutate({ loanId, data: {
      requestAmount: edit.requestAmount,
      principleAmount: edit.principleAmount,
      marginRate: edit.marginRate,
      gracePeriod: edit.gracePeriod,
      financingDurationMonths: edit.financingDurationMonths,
      numberOfInstallments: edit.numberOfInstallments,
      disbursementDate: edit.disbursementDate || null,
    }});
  };

  const updateCleanupField = (loanId: string, field: string, value: string) => {
    setCleanupEdits((prev) => ({
      ...prev,
      [loanId]: { ...prev[loanId], [field]: value },
    }));
  };

  const exportToExcel = () => {
    if (!statementData?.loanStatements?.length) return;
    const wb = XLSX.utils.book_new();

    statementData.loanStatements.forEach((ls, lsIdx) => {
      const { date: nowDate, time: nowTime } = formatDateTime();
      const wsData: any[][] = [
        ["Lamen", "", "", "", "", "", "User", userData?.firstName || ""],
        ["Citizen Balance Statement", "", "", "", "", "", "Date", nowDate],
        ["", "", "", "", "", "", "Time", nowTime],
        [],
        ["Branch", ls.branch?.name || "", "", "Principle Amount", formatNumber(ls.loan.principleAmount), "", "Province", ls.province],
        ["Financing Type", ls.loan.productName, "", "Margin Rate", `${ls.loan.marginRate}%`, "", "District", ls.district],
        ["Financing No./ Cycle", `${ls.loan.applicationId} / ${ls.loan.financingCycle}`, "", "Disbursement Date", ls.disbursement?.disbursementDate ? formatDateDMY(ls.disbursement.disbursementDate) : "", "", "Branch Manager", ls.branchManager],
        ["Client Name", statementData.customer.name, "", "No. of Installments", ls.loan.numberOfInstallments, "", "Financing Status", ls.loan.status],
        ["Finance Officer", ls.officer?.name || "", "", "Grace Period", `${ls.loan.gracePeriod} months`, "", "", ""],
        [],
        ["Schedule", "", "", "", "", "Actual Payment", "", "", "", "", ""],
        ["No.", "Installment Date", "Principle", "Margin", "Total", "No.", "Payment Date", "Principle", "Margin", "Total", "PAR Days"],
      ];

      const paidPaymentsExcel = ls.actualPayments.filter(a => a.totalAmount > 0 || (a.paymentDate && a.paymentDate !== ""));
      const maxRows = Math.max(ls.schedule.length, paidPaymentsExcel.length);
      for (let i = 0; i < maxRows; i++) {
        const s = ls.schedule[i];
        const a = paidPaymentsExcel[i];
        wsData.push([
          s ? s.no : "",
          s ? formatDate(s.installmentDate) : "",
          s ? s.principleAmount : "",
          s ? s.marginAmount : "",
          s ? s.totalAmount : "",
          a ? a.no : "",
          a ? (a.paymentDate ? formatDate(a.paymentDate) : "") : "",
          a ? (a.principleAmount > 0 ? a.principleAmount : "") : "",
          a ? (a.marginAmount > 0 ? a.marginAmount : "") : "",
          a ? (a.totalAmount > 0 ? a.totalAmount : "") : "",
          a ? (a.arears > 0 ? a.arears : "") : "",
        ]);
      }

      wsData.push([
        "", "Total =", formatNumber(ls.scheduleTotals.principleAmount), formatNumber(ls.scheduleTotals.marginAmount), formatNumber(ls.scheduleTotals.totalAmount),
        "", "Total =", formatNumber(ls.actualTotals.principleAmount), formatNumber(ls.actualTotals.marginAmount), formatNumber(ls.actualTotals.totalAmount), ls.actualTotals.arears > 0 ? ls.actualTotals.arears : "",
      ]);
      wsData.push([
        "", "", "", "", "",
        "", "Outstanding", formatNumber(ls.outstanding.principleAmount), formatNumber(ls.outstanding.marginAmount), formatNumber(ls.outstanding.totalAmount), "",
      ]);

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = [
        { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 12 }, { wch: 14 },
        { wch: 8 }, { wch: 18 }, { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 12 },
      ];
      const sheetName = `Financing ${lsIdx + 1}`;
      XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
    });

    XLSX.writeFile(wb, `Citizen_Balance_Statement_${statementData.customer.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast({ title: "Excel Exported", description: "Citizen Balance Statement exported to Excel." });
  };

  const exportToPDF = () => {
    if (!statementData?.loanStatements?.length) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    statementData.loanStatements.forEach((ls, lsIdx) => {
      if (lsIdx > 0) doc.addPage();
      const { date: nowDate, time: nowTime } = formatDateTime();

      doc.setFontSize(14);
      doc.setTextColor(30, 100, 50);
      doc.text("Lamen", 14, 14);
      doc.setFontSize(12);
      doc.text("Citizen Balance Statement", 80, 14);

      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.text(`User: ${userData?.firstName || ""}`, 220, 10);
      doc.text(`Date: ${nowDate}`, 220, 14);
      doc.text(`Time: ${nowTime}`, 220, 18);

      const infoY = 26;
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);

      const col1X = 14;
      const col1V = 42;
      const col2X = 105;
      const col2V = 140;
      const col3X = 195;
      const col3V = 232;
      const lineH = 4.5;

      const infoFields: [string, string, number, number][] = [
        ["Branch:", ls.branch?.name || "", col1X, col1V],
        ["Financing Type:", ls.loan.productName, col1X, col1V],
        ["Financing No./ Cycle:", `${ls.loan.applicationId} / ${ls.loan.financingCycle}`, col1X, col1V],
        ["Client Name:", statementData.customer.name, col1X, col1V],
        ["Finance Officer:", ls.officer?.name || "", col1X, col1V],
      ];
      const infoFields2: [string, string, number, number][] = [
        ["Principle Amount:", formatNumber(ls.loan.principleAmount), col2X, col2V],
        ["Margin Rate:", `${ls.loan.marginRate}%`, col2X, col2V],
        ["Disbursement Date:", ls.disbursement?.disbursementDate ? formatDateDMY(ls.disbursement.disbursementDate) : "", col2X, col2V],
        ["No. of Installments:", `${ls.loan.numberOfInstallments}`, col2X, col2V],
        ["Grace Period:", `${ls.loan.gracePeriod} months`, col2X, col2V],
      ];
      const infoFields3: [string, string, number, number][] = [
        ["Province:", ls.province, col3X, col3V],
        ["District:", ls.district, col3X, col3V],
        ["Branch Manager:", ls.branchManager, col3X, col3V],
        ["Financing Status:", ls.loan.status, col3X, col3V],
      ];

      const maxRows = Math.max(infoFields.length, infoFields2.length, infoFields3.length);
      for (let i = 0; i < maxRows; i++) {
        const y = infoY + i * lineH;
        if (i < infoFields.length) {
          doc.setFont("helvetica", "bold");
          doc.text(infoFields[i][0], infoFields[i][2], y);
          doc.setFont("helvetica", "normal");
          doc.text(infoFields[i][1], infoFields[i][3], y);
        }
        if (i < infoFields2.length) {
          doc.setFont("helvetica", "bold");
          doc.text(infoFields2[i][0], infoFields2[i][2], y);
          doc.setFont("helvetica", "normal");
          doc.text(infoFields2[i][1], infoFields2[i][3], y);
        }
        if (i < infoFields3.length) {
          doc.setFont("helvetica", "bold");
          doc.text(infoFields3[i][0], infoFields3[i][2], y);
          doc.setFont("helvetica", "normal");
          doc.text(infoFields3[i][1], infoFields3[i][3], y);
        }
      }

      const tableStartY = infoY + maxRows * lineH + 4;

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Schedule", 14, tableStartY);
      doc.text("Actual Payment", 160, tableStartY);

      const paidPayments = ls.actualPayments.filter(a => a.totalAmount > 0 || (a.paymentDate && a.paymentDate !== ""));
      const paidPaymentCount = paidPayments.length;
      const paymentTotalRowIdx = paidPaymentCount;
      const paymentOutstandingRowIdx = paidPaymentCount + 1;
      const rowCount = ls.schedule.length;
      const scheduleTotalRowIdx = rowCount;
      const combinedBody: any[][] = [];
      for (let i = 0; i < Math.max(rowCount + 1, paidPaymentCount + 2); i++) {
        const s = i < rowCount ? ls.schedule[i] : null;
        const a = i < paidPaymentCount ? paidPayments[i] : null;
        const isScheduleTotal = (i === rowCount);
        const isPaymentTotal = (i === paymentTotalRowIdx);
        const isPaymentOutstanding = (i === paymentOutstandingRowIdx);

        combinedBody.push([
          isScheduleTotal ? "" : (s ? s.no : ""),
          isScheduleTotal ? "Total =" : (s ? formatDate(s.installmentDate) : ""),
          isScheduleTotal ? formatNumber(ls.scheduleTotals.principleAmount) : (s ? formatNumber(s.principleAmount) : ""),
          isScheduleTotal ? formatNumber(ls.scheduleTotals.marginAmount) : (s ? formatNumber(s.marginAmount) : ""),
          isScheduleTotal ? formatNumber(ls.scheduleTotals.totalAmount) : (s ? formatNumber(s.totalAmount) : ""),
          "",
          isPaymentTotal ? "" : (isPaymentOutstanding ? "" : (a ? a.no : "")),
          isPaymentTotal ? "Total =" : (isPaymentOutstanding ? "Outstanding" : (a ? (a.paymentDate ? formatDate(a.paymentDate) : "") : "")),
          isPaymentTotal ? formatNumber(ls.actualTotals.principleAmount) : (isPaymentOutstanding ? formatNumber(ls.outstanding.principleAmount) : (a ? (a.principleAmount > 0 ? formatNumber(a.principleAmount) : "") : "")),
          isPaymentTotal ? formatNumber(ls.actualTotals.marginAmount) : (isPaymentOutstanding ? formatNumber(ls.outstanding.marginAmount) : (a ? (a.marginAmount > 0 ? formatNumber(a.marginAmount) : "") : "")),
          isPaymentTotal ? formatNumber(ls.actualTotals.totalAmount) : (isPaymentOutstanding ? formatNumber(ls.outstanding.totalAmount) : (a ? (a.totalAmount > 0 ? formatNumber(a.totalAmount) : "") : "")),
          isPaymentTotal ? (ls.actualTotals.arears > 0 ? ls.actualTotals.arears.toString() : "") : (isPaymentOutstanding ? "" : (a ? (a.arears > 0 ? a.arears.toString() : "") : "")),
        ]);
      }

      autoTable(doc, {
        startY: tableStartY + 2,
        head: [["No.", "Installment Date", "Principle", "Margin", "Total", " ", "No.", "Payment Date", "Principle", "Margin", "Total", "PAR Days"]],
        body: combinedBody,
        margin: { left: 14, right: 10 },
        styles: { fontSize: 7, cellPadding: 1.2, lineWidth: 0.3, lineColor: [60, 120, 80] },
        headStyles: { fillColor: [60, 120, 80], textColor: 255, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 28 },
          2: { cellWidth: 22 },
          3: { cellWidth: 18 },
          4: { cellWidth: 20 },
          5: { cellWidth: 4, fillColor: [255, 255, 255], lineWidth: 0 },
          6: { cellWidth: 10 },
          7: { cellWidth: 28 },
          8: { cellWidth: 22 },
          9: { cellWidth: 18 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
        },
        didParseCell: (data: any) => {
          const ri = data.row.index;
          const ci = data.column.index;
          if (ci === 5) {
            data.cell.styles.fillColor = [255, 255, 255];
            data.cell.styles.lineWidth = 0;
            data.cell.styles.lineColor = [255, 255, 255];
          }
          const noPaymentData = ri >= paidPaymentCount && ri !== paymentTotalRowIdx && ri !== paymentOutstandingRowIdx;
          if (data.section === "body" && noPaymentData && ci >= 6) {
            data.cell.styles.fillColor = [255, 255, 255];
            data.cell.styles.lineWidth = 0;
            data.cell.styles.lineColor = [255, 255, 255];
          }
          const noScheduleData = ri >= rowCount && ri !== scheduleTotalRowIdx;
          if (data.section === "body" && noScheduleData && ci < 5) {
            data.cell.styles.fillColor = [255, 255, 255];
            data.cell.styles.lineWidth = 0;
            data.cell.styles.lineColor = [255, 255, 255];
          }
          if (data.section === "body" && ri === scheduleTotalRowIdx && ci < 5) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [200, 230, 210];
          }
          if (data.section === "body" && ri === paymentTotalRowIdx && ci >= 6) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [200, 230, 210];
          }
          if (data.section === "body" && ri === paymentOutstandingRowIdx && ci >= 6) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [255, 243, 205];
          }
        },
      });
    });

    doc.save(`Citizen_Balance_Statement_${statementData.customer.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
    toast({ title: "PDF Exported", description: "Citizen Balance Statement exported to PDF." });
  };

  const customerList = Array.isArray(customers) ? customers : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getCustomerLabel = (c: any) => {
    const first = c.firstName || "";
    const last = c.lastName || "";
    const fullName = `${first} ${last}`.trim();
    const father = c.fatherName ? ` - ${c.fatherName}` : "";
    return `${fullName}${father} (${c.customerNo || "N/A"})`;
  };

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customerList;
    const lower = searchTerm.toLowerCase();
    return customerList.filter((c: any) => getCustomerLabel(c).toLowerCase().includes(lower));
  }, [customerList, searchTerm]);

  const selectedCustomerLabel = useMemo(() => {
    if (!selectedCustomerId) return "";
    const found = customerList.find((c: any) => c.id === selectedCustomerId);
    return found ? getCustomerLabel(found) : "";
  }, [selectedCustomerId, customerList]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const customerIdParam = params.get("customerId");
    if (customerIdParam) {
      setSelectedCustomerId(customerIdParam);
      setShowReport(true);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-balance-statement-title">
            Citizen Balance Statement
          </h1>
          <p className="text-muted-foreground">
            View financing schedule, payment details, and manage installments
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full max-w-md ${isAdminOrManager ? "grid-cols-2" : "grid-cols-1"}`}>
          <TabsTrigger value="statement" data-testid="tab-statement">Balance Statement</TabsTrigger>
          {isAdminOrManager && (
            <TabsTrigger value="installment-cleanup" data-testid="tab-installment-cleanup">Installment & Payment Cleanup</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="statement" className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex-1 min-w-[250px] relative" ref={dropdownRef}>
              <label className="text-sm font-medium mb-2 block">Select Customer</label>
              <div
                className="flex items-center border rounded-md bg-background cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                data-testid="select-customer"
              >
                <Search className="ml-3 h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  className="flex-1 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                  placeholder={selectedCustomerId ? selectedCustomerLabel : "Search customer..."}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  onClick={(e) => e.stopPropagation()}
                  data-testid="input-search-customer"
                />
                {selectedCustomerId && !searchTerm && (
                  <button
                    className="mr-1 p-1 rounded-sm hover-elevate"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomerId("");
                      setSearchTerm("");
                      setShowReport(false);
                    }}
                    data-testid="button-clear-customer"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
                <ChevronDown className="mr-3 h-4 w-4 text-muted-foreground shrink-0" />
              </div>
              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md border bg-popover shadow-md">
                  {customersLoading ? (
                    <div className="p-3 text-sm text-muted-foreground">Loading...</div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">No customers found</div>
                  ) : (
                    filteredCustomers.map((c: any) => (
                      <div
                        key={c.id}
                        className={`px-3 py-2 text-sm cursor-pointer hover-elevate ${
                          c.id === selectedCustomerId ? "bg-primary text-primary-foreground" : ""
                        }`}
                        onClick={() => {
                          setSelectedCustomerId(c.id);
                          setSearchTerm("");
                          setDropdownOpen(false);
                          setShowReport(false);
                        }}
                        data-testid={`option-customer-${c.id}`}
                      >
                        {getCustomerLabel(c)}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <Button onClick={handleView} className="bg-blue-600 text-white" data-testid="button-view-statement">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            {showReport && statementData && (
              <>
                <Button onClick={exportToExcel} className="bg-green-600 text-white" data-testid="button-export-excel">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </Button>
                <Button onClick={exportToPDF} className="bg-red-600 text-white" data-testid="button-export-pdf">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {showReport && statementLoading && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      )}

      {showReport && statementData && statementData.loanStatements.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No financing records found for this customer.
          </CardContent>
        </Card>
      )}

      {showReport && statementData && statementData.loanStatements.map((ls, lsIdx) => {
        const { date: nowDate, time: nowTime } = formatDateTime();
        return (
          <div key={ls.loan.id} ref={lsIdx === 0 ? reportRef : undefined} className="space-y-0">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="border border-border rounded-md overflow-hidden">
                  <div className="bg-muted/50 p-3 sm:p-4 border-b border-border">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src="/logo.jpeg" alt="Lamen" className="h-12 w-auto" />
                        <div>
                          <h2 className="text-lg font-bold text-green-700 dark:text-green-400" data-testid={`text-statement-header-${lsIdx}`}>Lamen</h2>
                          <p className="text-sm font-semibold">Citizen Balance Statement</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex justify-end gap-6">
                          <span className="text-muted-foreground">User</span>
                          <span className="font-medium" data-testid={`text-user-${lsIdx}`}>{userData?.firstName || ""}</span>
                        </div>
                        <div className="flex justify-end gap-6">
                          <span className="text-muted-foreground">Date</span>
                          <span className="font-medium">{nowDate}</span>
                        </div>
                        <div className="flex justify-end gap-6">
                          <span className="text-muted-foreground">Time</span>
                          <span className="font-medium">{nowTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 border-b border-border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5 text-sm">
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Branch</span>
                          <span className="font-medium" data-testid={`text-branch-${lsIdx}`}>{ls.branch?.name || ""}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Financing Type</span>
                          <span className="font-medium">{ls.loan.productName}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Financing No./ Cycle</span>
                          <span className="font-medium" data-testid={`text-app-id-${lsIdx}`}>{ls.loan.applicationId} / {ls.loan.financingCycle}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Client Name</span>
                          <span className="font-medium" data-testid={`text-client-name-${lsIdx}`}>{statementData.customer.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Finance Officer</span>
                          <span className="font-medium">{ls.officer?.name || ""}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Principle Amount</span>
                          <span className="font-medium" data-testid={`text-financing-amount-${lsIdx}`}>{formatNumber(ls.loan.principleAmount)}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Margin Rate</span>
                          <span className="font-medium">{ls.loan.marginRate}%</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Disbursement Date</span>
                          <span className="font-medium">{ls.disbursement?.disbursementDate ? formatDateDMY(ls.disbursement.disbursementDate) : ""}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">No. of Installments</span>
                          <span className="font-medium">{ls.loan.numberOfInstallments}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Grace Period</span>
                          <span className="font-medium">{ls.loan.gracePeriod} months</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Province</span>
                          <span className="font-medium">{ls.province}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">District</span>
                          <span className="font-medium">{ls.district}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Branch Manager</span>
                          <span className="font-medium">{ls.branchManager}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-32 shrink-0">Financing Status</span>
                          <span className={`font-medium ${ls.loan.status === "active" || ls.loan.status === "disbursed" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                            {ls.loan.status ? ls.loan.status.charAt(0).toUpperCase() + ls.loan.status.slice(1) : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-bold mb-2 text-green-700 dark:text-green-400">Schedule</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse border border-green-700" data-testid={`table-schedule-${lsIdx}`}>
                            <thead>
                              <tr className="bg-green-700 dark:bg-green-800 text-white">
                                <th className="px-2 py-1.5 text-left font-medium border border-green-600">No.</th>
                                <th className="px-2 py-1.5 text-left font-medium border border-green-600">Installment Date</th>
                                <th className="px-2 py-1.5 text-right font-medium border border-green-600">Principle</th>
                                <th className="px-2 py-1.5 text-right font-medium border border-green-600">Margin</th>
                                <th className="px-2 py-1.5 text-right font-medium border border-green-600">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ls.schedule.map((s, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                                  <td className="px-2 py-1 border border-border text-center">{s.no}</td>
                                  <td className="px-2 py-1 border border-border">{formatDate(s.installmentDate)}</td>
                                  <td className="px-2 py-1 border border-border text-right">{formatNumber(s.principleAmount)}</td>
                                  <td className="px-2 py-1 border border-border text-right">{formatNumber(s.marginAmount)}</td>
                                  <td className="px-2 py-1 border border-border text-right">{formatNumber(s.totalAmount)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-green-100 dark:bg-green-900/30 font-semibold">
                                <td className="px-2 py-1.5 border border-border" colSpan={2}>Total =</td>
                                <td className="px-2 py-1.5 border border-border text-right" data-testid={`text-schedule-total-principle-${lsIdx}`}>{formatNumber(ls.scheduleTotals.principleAmount)}</td>
                                <td className="px-2 py-1.5 border border-border text-right">{formatNumber(ls.scheduleTotals.marginAmount)}</td>
                                <td className="px-2 py-1.5 border border-border text-right">{formatNumber(ls.scheduleTotals.totalAmount)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold mb-2 text-green-700 dark:text-green-400">Actual Payment</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse border border-green-700" data-testid={`table-actual-payment-${lsIdx}`}>
                            <thead>
                              <tr className="bg-green-700 dark:bg-green-800 text-white">
                                <th className="px-2 py-1.5 text-left font-medium border border-green-600">No.</th>
                                <th className="px-2 py-1.5 text-left font-medium border border-green-600">Payment Date</th>
                                <th className="px-2 py-1.5 text-right font-medium border border-green-600">Principle</th>
                                <th className="px-2 py-1.5 text-right font-medium border border-green-600">Margin</th>
                                <th className="px-2 py-1.5 text-right font-medium border border-green-600">Total</th>
                                <th className="px-2 py-1.5 text-right font-medium border border-green-600">PAR Days</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ls.actualPayments.filter(a => a.totalAmount > 0 || (a.paymentDate && a.paymentDate !== "")).map((a, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                                  <td className="px-2 py-1 border border-border text-center">{a.no}</td>
                                  <td className="px-2 py-1 border border-border">{a.paymentDate ? formatDate(a.paymentDate) : ""}</td>
                                  <td className="px-2 py-1 border border-border text-right">{a.principleAmount > 0 ? formatNumber(a.principleAmount) : ""}</td>
                                  <td className="px-2 py-1 border border-border text-right">{a.marginAmount > 0 ? formatNumber(a.marginAmount) : ""}</td>
                                  <td className="px-2 py-1 border border-border text-right">{a.totalAmount > 0 ? formatNumber(a.totalAmount) : ""}</td>
                                  <td className="px-2 py-1 border border-border text-right">{a.arears > 0 ? a.arears : ""}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-green-100 dark:bg-green-900/30 font-semibold">
                                <td className="px-2 py-1.5 border border-border" colSpan={2}>Total =</td>
                                <td className="px-2 py-1.5 border border-border text-right">{formatNumber(ls.actualTotals.principleAmount)}</td>
                                <td className="px-2 py-1.5 border border-border text-right">{formatNumber(ls.actualTotals.marginAmount)}</td>
                                <td className="px-2 py-1.5 border border-border text-right">{formatNumber(ls.actualTotals.totalAmount)}</td>
                                <td className="px-2 py-1.5 border border-border text-right">{ls.actualTotals.arears > 0 ? ls.actualTotals.arears : ""}</td>
                              </tr>
                              <tr className="bg-yellow-100 dark:bg-yellow-900/30 font-semibold">
                                <td className="px-2 py-1.5 border border-border" colSpan={2}>Outstanding</td>
                                <td className="px-2 py-1.5 border border-border text-right" data-testid={`text-outstanding-principle-${lsIdx}`}>{formatNumber(ls.outstanding.principleAmount)}</td>
                                <td className="px-2 py-1.5 border border-border text-right">{formatNumber(ls.outstanding.marginAmount)}</td>
                                <td className="px-2 py-1.5 border border-border text-right" data-testid={`text-outstanding-total-${lsIdx}`}>{formatNumber(ls.outstanding.totalAmount)}</td>
                                <td className="px-2 py-1.5 border border-border text-right"></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
        </TabsContent>

        <TabsContent value="installment-cleanup" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="flex-1 min-w-[300px] relative" ref={instDropdownRef}>
                  <label className="text-sm font-medium mb-2 block">Select Financing</label>
                  <div
                    className="flex items-center border rounded-md bg-background cursor-pointer"
                    onClick={() => setInstDropdownOpen(!instDropdownOpen)}
                    data-testid="inst-select-loan"
                  >
                    <Search className="ml-3 h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                      placeholder={instSelectedLoanId ? selectedInstLoanLabel : "Search by customer name, ID, or application..."}
                      value={instSearchTerm}
                      onChange={(e) => { setInstSearchTerm(e.target.value); setInstDropdownOpen(true); }}
                      onFocus={() => setInstDropdownOpen(true)}
                      onClick={(e) => e.stopPropagation()}
                      data-testid="inst-input-search-loan"
                    />
                    {instSelectedLoanId && !instSearchTerm && (
                      <button
                        className="mr-1 p-1 rounded-sm hover-elevate"
                        onClick={(e) => { e.stopPropagation(); setInstSelectedLoanId(""); setInstSearchTerm(""); setShowInstSchedule(false); }}
                        data-testid="inst-button-clear-loan"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                    <ChevronDown className="mr-3 h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                  {instDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md border bg-popover shadow-md">
                      {instLoansLoading ? (
                        <div className="p-3 text-sm text-muted-foreground">Loading...</div>
                      ) : filteredInstLoans.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground">No financings found</div>
                      ) : (
                        filteredInstLoans.map((l: any) => (
                          <div
                            key={l.id}
                            className={`px-3 py-2 text-sm cursor-pointer hover-elevate ${l.id === instSelectedLoanId ? "bg-primary text-primary-foreground" : ""}`}
                            onClick={() => { setInstSelectedLoanId(l.id); setInstSearchTerm(""); setInstDropdownOpen(false); setShowInstSchedule(false); }}
                            data-testid={`inst-option-loan-${l.id}`}
                          >
                            <span className="font-medium">{l.customerName}</span>
                            <span className="text-muted-foreground ml-1">({l.customerNo})</span>
                            <span className="text-muted-foreground ml-2">- {l.applicationId}</span>
                            {l.branchName && <span className="text-muted-foreground ml-2">[{l.branchName}]</span>}
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${l.status === 'disbursed' || l.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : l.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>{l.status}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <Button onClick={handleInstView} className="bg-blue-600 text-white" data-testid="inst-button-view-schedule">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          {showInstSchedule && instScheduleData && (() => {
            const loanId = instScheduleData.loan.id;
            const edit = cleanupEdits[loanId];
            if (!edit) return null;
            const editedPrincipal = parseFloat(edit.principleAmount) || 0;
            const editedMargin = parseFloat(edit.marginRate) || 0;
            const editedRate = editedMargin > 1 ? editedMargin / 100 : editedMargin;
            const previewFinancingAmount = editedPrincipal + (editedPrincipal * editedRate);
            return (
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="text-sm font-bold text-green-700 dark:text-green-400" data-testid="text-cleanup-title">
                      Data Cleanup - {instScheduleData.loan.applicationId} (Cycle {instScheduleData.loan.financingCycle})
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Preview Financing Amount: {formatNumber(previewFinancingAmount)} AFN
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Disbursement Date</label>
                      <Input
                        type="date"
                        value={edit.disbursementDate}
                        onChange={(e) => updateCleanupField(loanId, "disbursementDate", e.target.value)}
                        data-testid="input-cleanup-disbursement-date"
                      />
                      {edit.disbursementDate && (
                        <span className={`text-[10px] mt-0.5 block ${new Date(edit.disbursementDate) >= new Date("2026-01-07") ? "text-blue-600" : "text-amber-600"}`}>
                          {new Date(edit.disbursementDate) >= new Date("2026-01-07") ? "New Formula" : "Old Formula"}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Request Amount</label>
                      <Input
                        type="number"
                        value={edit.requestAmount}
                        onChange={(e) => updateCleanupField(loanId, "requestAmount", e.target.value)}
                        data-testid="input-cleanup-request"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Principle Amount</label>
                      <Input
                        type="number"
                        value={edit.principleAmount}
                        onChange={(e) => updateCleanupField(loanId, "principleAmount", e.target.value)}
                        data-testid="input-cleanup-principle"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Margin Rate</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={edit.marginRate}
                        onChange={(e) => updateCleanupField(loanId, "marginRate", e.target.value)}
                        data-testid="input-cleanup-margin"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Grace Period</label>
                      <Input
                        type="number"
                        value={edit.gracePeriod}
                        onChange={(e) => updateCleanupField(loanId, "gracePeriod", e.target.value)}
                        data-testid="input-cleanup-grace"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Duration Months</label>
                      <Input
                        type="number"
                        value={edit.financingDurationMonths}
                        onChange={(e) => updateCleanupField(loanId, "financingDurationMonths", e.target.value)}
                        data-testid="input-cleanup-duration"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">No. of Installments</label>
                      <Input
                        type="number"
                        value={edit.numberOfInstallments}
                        onChange={(e) => updateCleanupField(loanId, "numberOfInstallments", e.target.value)}
                        data-testid="input-cleanup-installments"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button
                      onClick={() => handleGenerate(loanId)}
                      disabled={regenerateMutation.isPending}
                      data-testid="button-generate-cleanup"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${regenerateMutation.isPending ? "animate-spin" : ""}`} />
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {showInstSchedule && instScheduleLoading && (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          )}

          {showInstSchedule && instScheduleLoading && (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Loading installment data...
              </CardContent>
            </Card>
          )}

          {showInstSchedule && !instScheduleLoading && instScheduleData && instScheduleData.installments.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-muted-foreground font-medium" data-testid="text-no-installments">No installment data found for this loan.</div>
                <div className="text-sm text-muted-foreground mt-1">Installments may not have been generated yet. Use the "Generate All Installments" button above to create them.</div>
              </CardContent>
            </Card>
          )}

          {showInstSchedule && instScheduleData && instScheduleData.installments.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Total Installments</div>
                    <div className="text-2xl font-bold" data-testid="inst-text-total-installments">{instScheduleData.summary.totalInstallments}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Missing Amounts</div>
                    <div className="text-2xl font-bold text-amber-600" data-testid="inst-text-null-count">
                      {instScheduleData.summary.nullAmountCount}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Paid</div>
                    <div className="text-2xl font-bold text-green-600" data-testid="inst-text-paid-count">{instScheduleData.summary.paidCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Unpaid</div>
                    <div className="text-2xl font-bold text-blue-600" data-testid="inst-text-unpaid-count">{instScheduleData.summary.unpaidCount}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-lg">
                      {instScheduleData.customer?.name || "Unknown"} — {instScheduleData.loan.applicationId}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {instScheduleData.loan.productName && <span className="font-medium">{instScheduleData.loan.productName} | </span>}
                      Principal: {formatAFN(instScheduleData.loan.principalAmount)} AFN | Margin Rate: {instScheduleData.loan.marginRate > 1 ? instScheduleData.loan.marginRate : (instScheduleData.loan.marginRate * 100).toFixed(0)}% | {instScheduleData.loan.numberOfInstallments} installments
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {hasInstChanges && (
                      <Button onClick={handleInstSave} className="bg-green-600 text-white" disabled={bulkUpdateMutation.isPending} data-testid="inst-button-save-installments">
                        <Save className="mr-2 h-4 w-4" />
                        {bulkUpdateMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">#</th>
                          <th className="px-4 py-3 text-left font-medium">Due Date</th>
                          <th className="px-4 py-3 text-right font-medium">Calculated Principal</th>
                          <th className="px-4 py-3 text-right font-medium">Calculated Margin</th>
                          <th className="px-4 py-3 text-right font-medium">Principal Amount</th>
                          <th className="px-4 py-3 text-right font-medium">Margin Amount</th>
                          <th className="px-4 py-3 text-right font-medium">Total</th>
                          <th className="px-4 py-3 text-right font-medium">Paid</th>
                          <th className="px-4 py-3 text-right font-medium">Variance</th>
                          <th className="px-4 py-3 text-right font-medium">PAR Days</th>
                          <th className="px-4 py-3 text-center font-medium">Status</th>
                          <th className="px-4 py-3 text-center font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {instScheduleData.installments.map((inst, idx) => {
                          const rowKey = getRowKey(inst);
                          const isEditable = !inst.isPaid;
                          const displayPrincipal = getDisplayPrincipal(inst);
                          const displayMargin = getDisplayMargin(inst);
                          const displayTotal = getDisplayTotal(inst);
                          const isModified = !!editedRows[rowKey];

                          return (
                            <tr
                              key={rowKey}
                              className={`border-b ${inst.isPaid ? "bg-green-50/50 dark:bg-green-950/20" : inst.hasNullAmounts ? "bg-amber-50/50 dark:bg-amber-950/20" : ""} ${isModified ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
                              data-testid={`inst-row-installment-${inst.installmentNumber}`}
                            >
                              <td className="px-4 py-2 font-medium">{inst.installmentNumber}</td>
                              <td className="px-4 py-2">{inst.dueDate || "—"}</td>
                              <td className="px-4 py-2 text-right text-muted-foreground">{formatAFN(inst.calculatedPrincipal)}</td>
                              <td className="px-4 py-2 text-right text-muted-foreground">{formatAFN(inst.calculatedMargin)}</td>
                              <td className="px-4 py-2 text-right">
                                {inst.isPaid ? (
                                  <span>{inst.currentPrincipal !== null ? formatAFN(inst.currentPrincipal) : "—"}</span>
                                ) : isEditable ? (
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="w-28 px-2 py-1 text-right border rounded-md bg-background text-sm"
                                    value={displayPrincipal}
                                    onChange={(e) => handleRowChange(rowKey, "principal", e.target.value)}
                                    placeholder="0.00"
                                    data-testid={`inst-input-principal-${inst.installmentNumber}`}
                                  />
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-right">
                                {inst.isPaid ? (
                                  <span>{inst.currentMargin !== null ? formatAFN(inst.currentMargin) : "—"}</span>
                                ) : isEditable ? (
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="w-28 px-2 py-1 text-right border rounded-md bg-background text-sm"
                                    value={displayMargin}
                                    onChange={(e) => handleRowChange(rowKey, "margin", e.target.value)}
                                    placeholder="0.00"
                                    data-testid={`inst-input-margin-${inst.installmentNumber}`}
                                  />
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-right font-medium">
                                {displayTotal ? formatAFN(parseFloat(displayTotal)) : "—"}
                              </td>
                              <td className="px-4 py-2 text-right">
                                {formatAFN(inst.paidAmount)}
                              </td>
                              <td className="px-4 py-2 text-right">
                                {inst.installmentVariance !== null ? (
                                  <span className={inst.installmentVariance < 0 ? "text-red-600" : inst.installmentVariance > 0 ? "text-green-600" : ""}>
                                    {formatAFN(inst.installmentVariance)}
                                  </span>
                                ) : "—"}
                              </td>
                              <td className="px-4 py-2 text-right">
                                {inst.lateDays !== null && inst.lateDays !== undefined ? (
                                  <span className={inst.lateDays > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                                    {inst.lateDays}
                                  </span>
                                ) : "—"}
                              </td>
                              <td className="px-4 py-2 text-center">
                                {(() => {
                                  const effectivePaid = editedRows[rowKey]?.isPaid !== undefined ? editedRows[rowKey].isPaid : inst.isPaid;
                                  const paidChanged = editedRows[rowKey]?.isPaid !== undefined && editedRows[rowKey].isPaid !== inst.isPaid;
                                  if (effectivePaid) {
                                    return (
                                      <Badge
                                        variant="default"
                                        className={`cursor-pointer ${paidChanged ? "bg-green-500 ring-2 ring-blue-400" : "bg-green-600"} text-white`}
                                        onClick={() => handleTogglePaid(inst)}
                                        data-testid={`inst-badge-paid-${inst.installmentNumber}`}
                                      >
                                        <Lock className="mr-1 h-3 w-3" />
                                        Paid
                                      </Badge>
                                    );
                                  }
                                  return (
                                    <Badge
                                      variant="outline"
                                      className={`cursor-pointer ${paidChanged ? "border-red-400 text-red-600 ring-2 ring-blue-400" : inst.hasNullAmounts ? "border-amber-500 text-amber-700" : isModified ? "border-blue-500 text-blue-700" : ""}`}
                                      onClick={() => handleTogglePaid(inst)}
                                      data-testid={`inst-badge-unpaid-${inst.installmentNumber}`}
                                    >
                                      {paidChanged ? (
                                        <>
                                          <AlertTriangle className="mr-1 h-3 w-3" />
                                          Unpaid
                                        </>
                                      ) : inst.hasNullAmounts ? (
                                        <>
                                          <AlertTriangle className="mr-1 h-3 w-3" />
                                          Missing
                                        </>
                                      ) : isModified ? (
                                        "Modified"
                                      ) : (
                                        <>
                                          <CheckCircle2 className="mr-1 h-3 w-3" />
                                          Set
                                        </>
                                      )}
                                    </Badge>
                                  );
                                })()}
                              </td>
                              <td className="px-4 py-2 text-center">
                                {inst.id && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openPaymentDialog(inst)}
                                    data-testid={`inst-button-payment-${inst.installmentNumber}`}
                                  >
                                    <CreditCard className="h-3 w-3 mr-1" />
                                    Payment
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 font-bold bg-muted/30">
                          <td className="px-4 py-3" colSpan={2}>Totals</td>
                          <td className="px-4 py-3 text-right">
                            {formatAFN(instScheduleData.installments.reduce((s, i) => s + i.calculatedPrincipal, 0))}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatAFN(instScheduleData.installments.reduce((s, i) => s + i.calculatedMargin, 0))}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatAFN(
                              instScheduleData.installments.reduce((s, i) => {
                                const dp = getDisplayPrincipal(i);
                                return s + (dp ? parseFloat(dp) : 0);
                              }, 0)
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatAFN(
                              instScheduleData.installments.reduce((s, i) => {
                                const dm = getDisplayMargin(i);
                                return s + (dm ? parseFloat(dm) : 0);
                              }, 0)
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatAFN(
                              instScheduleData.installments.reduce((s, i) => {
                                const dt = getDisplayTotal(i);
                                return s + (dt ? parseFloat(dt) : 0);
                              }, 0)
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatAFN(instScheduleData.installments.reduce((s, i) => s + i.paidAmount, 0))}
                          </td>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle data-testid="dialog-title-payment">
              Update Payment - Installment #{paymentDialogInst?.installmentNumber}
            </DialogTitle>
          </DialogHeader>
          {paymentDialogInst && (() => {
            const totalDue = paymentDialogInst.currentTotal || 0;
            const paidAmt = parseFloat(paymentForm.paidAmount || "0");
            const variance = paidAmt - totalDue;
            let parDays: number | null = null;
            if (paymentForm.paymentDate && paymentDialogInst.dueDate) {
              const payDate = new Date(paymentForm.paymentDate);
              const dueDate = new Date(paymentDialogInst.dueDate);
              const diffTime = payDate.getTime() - dueDate.getTime();
              parDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (parDays < 0) parDays = 0;
            }
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="ml-2 font-medium">{paymentDialogInst.dueDate || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Due:</span>
                    <span className="ml-2 font-medium">{formatAFN(totalDue)} AFN</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentPaidAmount">Paid Amount (AFN)</Label>
                  <Input
                    id="paymentPaidAmount"
                    type="number"
                    step="0.01"
                    value={paymentForm.paidAmount}
                    onChange={(e) => setPaymentForm((prev) => ({ ...prev, paidAmount: e.target.value }))}
                    data-testid="input-payment-paid-amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentForm.paymentDate}
                    onChange={(e) => setPaymentForm((prev) => ({ ...prev, paymentDate: e.target.value }))}
                    data-testid="input-payment-date"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="paymentIsPaid">Mark as Paid</Label>
                  <button
                    id="paymentIsPaid"
                    type="button"
                    onClick={() => setPaymentForm((prev) => ({ ...prev, isPaid: !prev.isPaid }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${paymentForm.isPaid ? "bg-green-600" : "bg-muted-foreground/30"}`}
                    data-testid="toggle-payment-is-paid"
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${paymentForm.isPaid ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className="text-sm font-medium">{paymentForm.isPaid ? "Paid" : "Unpaid"}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 p-3 rounded-md bg-muted/50">
                  <div>
                    <span className="text-xs text-muted-foreground block">Variance</span>
                    <span className={`text-lg font-bold ${variance < 0 ? "text-red-600" : variance > 0 ? "text-green-600" : ""}`} data-testid="text-payment-variance">
                      {formatAFN(variance)} AFN
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">PAR Days</span>
                    <span className={`text-lg font-bold ${parDays !== null && parDays > 0 ? "text-red-600" : "text-green-600"}`} data-testid="text-payment-par">
                      {parDays !== null ? parDays : "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)} data-testid="button-payment-cancel">
              Cancel
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              disabled={paymentUpdateMutation.isPending || !paymentForm.paidAmount}
              className="bg-green-600 text-white"
              data-testid="button-payment-submit"
            >
              {paymentUpdateMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</>
              ) : (
                <><Save className="h-4 w-4 mr-2" />Update Payment</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
