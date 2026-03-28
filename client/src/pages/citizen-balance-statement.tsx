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
  Download,
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
  const [contractDownloading, setContractDownloading] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);
  const [contractDataList, setContractDataList] = useState<any[]>([]);
  const [committeeDownloading, setCommitteeDownloading] = useState(false);

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

  const contractFormatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, "0");
    const mons = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day}/${mons[d.getMonth()]}/${d.getFullYear()}`;
  };

  const contractFormatAmount = (num: number) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

  const handleDownloadContract = async () => {
    if (!selectedCustomerId) {
      toast({ title: "Select Customer", description: "Please select a customer first.", variant: "destructive" });
      return;
    }
    if (!statementData?.loanStatements?.length) {
      toast({ title: "No Data", description: "Please view the statement first.", variant: "destructive" });
      return;
    }
    setContractDownloading(true);
    try {
      const contracts: any[] = [];
      for (const ls of statementData.loanStatements) {
        const res = await fetch(`/api/loans/${ls.loan.id}/contract-data`, { credentials: "include" });
        if (res.ok) {
          contracts.push(await res.json());
        }
      }
      if (contracts.length === 0) {
        toast({ title: "Error", description: "No contract data found.", variant: "destructive" });
        setContractDownloading(false);
        return;
      }
      setContractDataList(contracts);
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!contractRef.current) {
        toast({ title: "Error", description: "Contract rendering failed.", variant: "destructive" });
        setContractDownloading(false);
        return;
      }

      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(contractRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 5;
      const usableWidth = pageWidth - margin * 2;
      const imgRatio = canvas.height / canvas.width;
      const imgHeight = usableWidth * imgRatio;

      const usableHeight = pageHeight - margin * 2;
      if (imgHeight <= usableHeight) {
        doc.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
      } else {
        const sections = contractRef.current!.querySelectorAll("[data-contract-section]");
        if (sections.length > 0) {
          let currentPageY = 0;
          let pageNum = 0;
          const pxPerMm = usableWidth / 794;
          for (let i = 0; i < sections.length; i++) {
            const section = sections[i] as HTMLElement;
            const sectionTop = section.offsetTop * pxPerMm;
            const sectionHeight = section.offsetHeight * pxPerMm;
            if (currentPageY + sectionHeight > usableHeight && currentPageY > 0) {
              doc.addPage();
              pageNum++;
              currentPageY = 0;
            }
            const srcY = section.offsetTop * (canvas.height / contractRef.current!.scrollHeight);
            const srcH = section.offsetHeight * (canvas.height / contractRef.current!.scrollHeight);
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = Math.ceil(srcH);
            const ctx = sliceCanvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(canvas, 0, Math.floor(srcY), canvas.width, Math.ceil(srcH), 0, 0, canvas.width, Math.ceil(srcH));
            }
            const sliceData = sliceCanvas.toDataURL("image/png");
            const sliceImgHeight = usableWidth * (sliceCanvas.height / sliceCanvas.width);
            doc.addImage(sliceData, "PNG", margin, margin + currentPageY, usableWidth, sliceImgHeight);
            currentPageY += sliceImgHeight;
          }
        } else {
          doc.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
        }
      }

      const customerName = statementData.customer.name.replace(/\s+/g, "_");
      doc.save(`Contract_${customerName}_${new Date().toISOString().split("T")[0]}.pdf`);
      toast({ title: "PDF Exported", description: "Contract exported to PDF." });
      setContractDataList([]);
    } catch (err: any) {
      console.error("Contract export error:", err);
      toast({ title: "Error", description: "Failed to generate contract PDF.", variant: "destructive" });
    } finally {
      setContractDownloading(false);
    }
  };

  const committeeFormatAmount = (num: number) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

  const committeeFormatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate().toString().padStart(2, "0");
    const mons = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day}/${mons[d.getMonth()]}/${d.getFullYear()}`;
  };

  const handleDownloadCommitteeForm = async () => {
    if (!selectedCustomerId) {
      toast({ title: "Select Customer", description: "Please select a customer first.", variant: "destructive" });
      return;
    }
    if (!statementData?.loanStatements?.length) {
      toast({ title: "No Data", description: "Please view the statement first.", variant: "destructive" });
      return;
    }
    setCommitteeDownloading(true);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let isFirstLoan = true;

      for (const ls of statementData.loanStatements) {
        const res = await fetch(`/api/loans/${ls.loan.id}/committee-form-data`, { credentials: "include" });
        if (!res.ok) continue;
        const cd = await res.json();

        if (cd.loan.installmentAmount === 0 && ls.schedule?.length > 0) {
          const firstPayable = ls.schedule.find((s: any) => (s.principleAmount || 0) + (s.marginAmount || 0) > 0);
          if (firstPayable) {
            cd.loan.installmentAmount = (firstPayable.principleAmount || 0) + (firstPayable.marginAmount || 0);
          }
        }

        if (!isFirstLoan) doc.addPage();
        isFirstLoan = false;

        let y = 15;

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Credit / Financing Committee Form", pageWidth / 2, y, { align: "center" });
        y += 5;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("(Murabaha / Microfinance Financing Approval)", pageWidth / 2, y, { align: "center" });
        y += 7;

        doc.setFontSize(8);
        const headerInfo = [
          [`Institution Name: Lamen Microfinance Institution`, `Branch: ${cd.branch.name}`],
          [`Committee Date: ${committeeFormatDate(cd.committeeDate)}`, `Application No: ${cd.loan.applicationId}`],
        ];
        headerInfo.forEach(row => {
          doc.text(row[0], margin, y);
          doc.text(row[1], pageWidth / 2 + 10, y);
          y += 5;
        });
        y += 3;

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("1. Client Information", margin, y);
        y += 2;
        autoTable(doc, {
          startY: y,
          head: [["Field", "Details"]],
          body: [
            ["Customer Name", cd.customer.name],
            ["Customer ID", cd.customer.customerNo],
            ["Tazkira / ID No", cd.customer.nationalId],
            ["Address", cd.customer.homeAddress],
            ["Phone Number", cd.customer.phoneNumber],
          ],
          theme: "grid",
          headStyles: { fillColor: [22, 163, 74], fontSize: 7, fontStyle: "bold" },
          styles: { fontSize: 7, cellPadding: 1.5 },
          columnStyles: { 0: { cellWidth: 45, fontStyle: "bold" } },
          margin: { left: margin, right: margin },
        });
        y = (doc as any).lastAutoTable.finalY + 5;

        doc.setFont("helvetica", "bold");
        doc.text("2. Loan Information", margin, y);
        y += 2;
        autoTable(doc, {
          startY: y,
          head: [["Field", "Details"]],
          body: [
            ["Financing Product", cd.loan.productName],
            ["Requested Amount", `${committeeFormatAmount(cd.loan.requestAmount)} AFN`],
            ["Approved Amount", `${committeeFormatAmount(cd.loan.principleAmount)} AFN`],
            ["Financing Duration", `${cd.loan.numberOfInstallments} installments`],
            ["Installment Amount", `${committeeFormatAmount(cd.loan.installmentAmount)} AFN`],
            ["Purpose of Financing", cd.loan.financingPurpose],
          ],
          theme: "grid",
          headStyles: { fillColor: [22, 163, 74], fontSize: 7, fontStyle: "bold" },
          styles: { fontSize: 7, cellPadding: 1.5 },
          columnStyles: { 0: { cellWidth: 45, fontStyle: "bold" } },
          margin: { left: margin, right: margin },
        });
        y = (doc as any).lastAutoTable.finalY + 5;

        doc.setFont("helvetica", "bold");
        doc.text("3. Risk & Assessment Summary", margin, y);
        y += 2;
        const guarantorText = cd.guarantors.length > 0
          ? cd.guarantors.map((g: any) => `${g.guarantorNo} - ${g.name}`).join(", ")
          : "N/A";
        autoTable(doc, {
          startY: y,
          head: [["Field", "Details"]],
          body: [
            ["Business Type", cd.business.businessType],
            ["Monthly Income", `${committeeFormatAmount(cd.business.monthlyIncome)} AFN`],
            ["Guarantor", guarantorText],
          ],
          theme: "grid",
          headStyles: { fillColor: [22, 163, 74], fontSize: 7, fontStyle: "bold" },
          styles: { fontSize: 7, cellPadding: 1.5 },
          columnStyles: { 0: { cellWidth: 45, fontStyle: "bold" } },
          margin: { left: margin, right: margin },
        });
        y = (doc as any).lastAutoTable.finalY + 5;

        doc.setFont("helvetica", "bold");
        doc.text("4. Credit Committee Voting (System Based)", margin, y);
        y += 2;
        const roleOrder = ["ceo", "coo", "cfo"];
        const roleLabels: Record<string, string> = { ceo: "CEO", coo: "COO", cfo: "CFO" };
        const voteRows = roleOrder.map(role => {
          const v = cd.votes.find((vote: any) => vote.voterRole === role);
          const hasVoted = v && v.vote && v.vote !== "pending";
          return [
            v?.voterName || "___________",
            roleLabels[role] || role.toUpperCase(),
            hasVoted ? (v.vote === "approved" ? "[X] Approve  [ ] Reject" : "[ ] Approve  [X] Reject") : "[ ] Approve  [ ] Reject",
            "System Generated",
            hasVoted ? committeeFormatDate(v.votedAt) : "___________",
          ];
        });
        autoTable(doc, {
          startY: y,
          head: [["Committee Member", "Position", "Vote", "Digital Signature", "Date"]],
          body: voteRows,
          theme: "grid",
          headStyles: { fillColor: [22, 163, 74], fontSize: 7, fontStyle: "bold" },
          styles: { fontSize: 7, cellPadding: 1.5 },
          margin: { left: margin, right: margin },
        });
        y = (doc as any).lastAutoTable.finalY + 5;

        doc.setFont("helvetica", "bold");
        doc.text("5. Committee Observers (No Voting Rights)", margin, y);
        y += 2;
        autoTable(doc, {
          startY: y,
          head: [["Name", "Position", "Role", "Signature", "Date"]],
          body: [
            [cd.riskReviewer?.name || "", "Risk Manager", "Observer", "System Generated", cd.riskReviewer?.date ? committeeFormatDate(cd.riskReviewer.date) : ""],
            ["", "Sharia Advisor", "Sharia Observer", "", ""],
          ],
          theme: "grid",
          headStyles: { fillColor: [22, 163, 74], fontSize: 7, fontStyle: "bold" },
          styles: { fontSize: 7, cellPadding: 1.5 },
          margin: { left: margin, right: margin },
        });
        y = (doc as any).lastAutoTable.finalY + 5;

        doc.setFont("helvetica", "bold");
        doc.text("6. Final Decision (Auto Generated by System)", margin, y);
        y += 3;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.text("Decision Rule: Loan will be Approved when at least 2 out of 3 votes are APPROVED.", margin, y);
        y += 4;
        const isApproved = cd.finalDecision === "Approved";
        const isRejected = cd.finalDecision === "Rejected";
        autoTable(doc, {
          startY: y,
          head: [["Final Result", "Status"]],
          body: [
            [isApproved ? "[X] Approved" : "[ ] Approved", "Ready for Disbursement"],
            [isRejected ? "[X] Rejected" : "[ ] Rejected", "Return to FAD Department"],
          ],
          theme: "grid",
          headStyles: { fillColor: [22, 163, 74], fontSize: 7, fontStyle: "bold" },
          styles: { fontSize: 7, cellPadding: 1.5 },
          margin: { left: margin, right: margin },
        });
        y = (doc as any).lastAutoTable.finalY + 5;

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("7. System Information", margin, y);
        y += 2;
        autoTable(doc, {
          startY: y,
          head: [["Field", "Details"]],
          body: [
            ["Generated By", userData ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || userData.username || "System" : "System"],
            ["Generated Date", new Date().toLocaleDateString()],
            ["Approval Reference Code", cd.loan.applicationId],
          ],
          theme: "grid",
          headStyles: { fillColor: [22, 163, 74], fontSize: 7, fontStyle: "bold" },
          styles: { fontSize: 7, cellPadding: 1.5 },
          columnStyles: { 0: { cellWidth: 45, fontStyle: "bold" } },
          margin: { left: margin, right: margin },
        });
      }

      const customerName = statementData.customer.name.replace(/\s+/g, "_");
      doc.save(`Committee_Form_${customerName}_${new Date().toISOString().split("T")[0]}.pdf`);
      toast({ title: "PDF Exported", description: "Committee form exported to PDF." });
    } catch (err: any) {
      console.error("Committee form export error:", err);
      toast({ title: "Error", description: "Failed to generate committee form PDF.", variant: "destructive" });
    } finally {
      setCommitteeDownloading(false);
    }
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
        ["Branch", ls.branch?.name || "", "", "Principle Amount", formatNumber(ls.loan.principleAmount), "", "Financing Status", ls.loan.status],
        ["Financing Type", ls.loan.productName, "", "Margin Rate", `${ls.loan.marginRate}%`, "", "No. of Installments", ls.loan.numberOfInstallments],
        ["Financing No./ Cycle", `${ls.loan.applicationId} / ${ls.loan.financingCycle}`, "", "Disbursement Date", ls.disbursement?.disbursementDate ? formatDateDMY(ls.disbursement.disbursementDate) : "", "", "Grace Period", `${ls.loan.gracePeriod} months`],
        ["Client Name", statementData.customer.name, "", "Finance Officer", ls.officer?.name || "", "", "", ""],
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

  const exportToPDF = async () => {
    if (!statementData?.loanStatements?.length) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    let logoBase64: string | null = null;
    try {
      const response = await fetch("/logo.jpeg");
      const blob = await response.blob();
      logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (e) {}

    statementData.loanStatements.forEach((ls, lsIdx) => {
      if (lsIdx > 0) doc.addPage();
      const { date: nowDate, time: nowTime } = formatDateTime();

      if (logoBase64) {
        try { doc.addImage(logoBase64, "JPEG", 14, 8, 28, 10); } catch (e) {}
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(13);
      doc.setTextColor(30, 100, 50);
      doc.text("Lamen Micro Finance Institution", pageWidth / 2, 12, { align: "center" });
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text("Citizen Balance Statement", pageWidth / 2, 18, { align: "center" });

      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.text(`User: ${userData?.firstName || ""}`, pageWidth - 12, 10, { align: "right" });
      doc.text(`Date: ${nowDate}`, pageWidth - 12, 14, { align: "right" });
      doc.text(`Time: ${nowTime}`, pageWidth - 12, 18, { align: "right" });

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

      const infoGrid: [string, string, number, number][][] = [
        [
          ["Branch:", ls.branch?.name || "", col1X, col1V],
          ["Principle Amount:", formatNumber(ls.loan.principleAmount), col2X, col2V],
          ["Financing Status:", ls.loan.status, col3X, col3V],
        ],
        [
          ["Financing Type:", ls.loan.productName, col1X, col1V],
          ["Margin Rate:", `${ls.loan.marginRate}%`, col2X, col2V],
          ["No. of Installments:", `${ls.loan.numberOfInstallments}`, col3X, col3V],
        ],
        [
          ["Financing No./ Cycle:", `${ls.loan.applicationId} / ${ls.loan.financingCycle}`, col1X, col1V],
          ["Disbursement Date:", ls.disbursement?.disbursementDate ? formatDateDMY(ls.disbursement.disbursementDate) : "", col2X, col2V],
          ["Grace Period:", `${ls.loan.gracePeriod} months`, col3X, col3V],
        ],
        [
          ["Client Name:", statementData.customer.name, col1X, col1V],
          ["Finance Officer:", ls.officer?.name || "", col2X, col2V],
        ],
      ];

      infoGrid.forEach((row, rowIdx) => {
        const y = infoY + rowIdx * lineH;
        row.forEach(([label, value, lx, vx]) => {
          doc.setFont("helvetica", "bold");
          doc.text(label, lx, y);
          doc.setFont("helvetica", "normal");
          doc.text(value, vx, y);
        });
      });

      const tableStartY = infoY + infoGrid.length * lineH + 4;

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
                <Button
                  onClick={handleDownloadContract}
                  disabled={contractDownloading}
                  className="bg-purple-600 text-white"
                  data-testid="button-download-contract"
                >
                  {contractDownloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Contract
                </Button>
                <Button
                  onClick={handleDownloadCommitteeForm}
                  disabled={committeeDownloading}
                  className="bg-indigo-600 text-white"
                  data-testid="button-download-committee"
                >
                  {committeeDownloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Committee Form
                </Button>
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
                    <div className="grid grid-cols-3 items-center">
                      <div className="flex items-center">
                        <img src="/logo.jpeg" alt="Lamen" className="h-14 object-contain" style={{ aspectRatio: "auto" }} />
                      </div>
                      <div className="text-center">
                        <h2 className="text-lg font-bold text-green-700 dark:text-green-400" data-testid={`text-statement-header-${lsIdx}`}>Lamen Micro Finance Institution</h2>
                        <p className="text-sm font-semibold">Citizen Balance Statement</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex justify-end gap-6">
                          <span className="text-muted-foreground">User:</span>
                          <span className="font-medium" data-testid={`text-user-${lsIdx}`}>{userData?.firstName || ""}</span>
                        </div>
                        <div className="flex justify-end gap-6">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{nowDate}</span>
                        </div>
                        <div className="flex justify-end gap-6">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{nowTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 border-b border-border">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-1.5 text-sm">
                      <div className="flex gap-2">
                        <span className="font-semibold text-muted-foreground w-36 shrink-0">Branch:</span>
                        <span className="font-medium" data-testid={`text-branch-${lsIdx}`}>{ls.branch?.name || ""}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold text-muted-foreground w-36 shrink-0">Principle Amount:</span>
                        <span className="font-medium" data-testid={`text-financing-amount-${lsIdx}`}>{formatNumber(ls.loan.principleAmount)}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold text-muted-foreground w-36 shrink-0">Financing Status:</span>
                        <span className={`font-medium ${ls.loan.status === "active" || ls.loan.status === "disbursed" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                          {ls.loan.status ? ls.loan.status.charAt(0).toUpperCase() + ls.loan.status.slice(1) : ""}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold text-muted-foreground w-36 shrink-0">Financing Type:</span>
                        <span className="font-medium">{ls.loan.productName}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold text-muted-foreground w-36 shrink-0">Margin Rate:</span>
                        <span className="font-medium">{ls.loan.marginRate}%</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold text-muted-foreground w-36 shrink-0">No. of Installments:</span>
                        <span className="font-medium">{ls.loan.numberOfInstallments}</span>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold text-muted-foreground w-36 shrink-0">Financing No./ Cycle:</span>
                        <span className="font-medium" data-testid={`text-app-id-${lsIdx}`}>{ls.loan.applicationId} / {ls.loan.financingCycle}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold text-muted-foreground w-36 shrink-0">Disbursement Date:</span>
                        <span className="font-medium">{ls.disbursement?.disbursementDate ? formatDateDMY(ls.disbursement.disbursementDate) : ""}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold text-muted-foreground w-36 shrink-0">Grace Period:</span>
                        <span className="font-medium">{ls.loan.gracePeriod} months</span>
                      </div>

                      <div className="flex gap-2">
                        <span className="font-semibold text-muted-foreground w-36 shrink-0">Client Name:</span>
                        <span className="font-medium" data-testid={`text-client-name-${lsIdx}`}>{statementData.customer.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold text-muted-foreground w-36 shrink-0">Finance Officer:</span>
                        <span className="font-medium">{ls.officer?.name || ""}</span>
                      </div>
                      <div></div>
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

      {contractDataList.length > 0 && (
        <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1 }}>
          <div ref={contractRef} style={{ width: "794px", background: "#ffffff" }}>
            {contractDataList.map((cd, cdIdx) => (
              <div key={cdIdx} className="bg-white text-black text-sm leading-relaxed" dir="rtl" style={{ fontFamily: "Arial, Tahoma, sans-serif", direction: "rtl" }}>
                {/* PAGE 1 - Cover */}
                <div data-contract-section style={{ padding: "30px 32px", minHeight: "1100px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "16px", textAlign: "center" }}>بسم الله الرحمن الرحیم</p>
                  <div style={{ flexGrow: 1 }} />
                  <img src="/logo.jpeg" alt="Lamen" style={{ height: "100px", width: "auto", marginBottom: "40px" }} />
                  <p style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "20px", textAlign: "center", lineHeight: 1.4 }}>
                    <span style={{ color: "#15803d" }}>لمن</span> د وړو مالي تمویلونو مؤسسه
                  </p>
                  <p style={{ fontSize: "2rem", fontWeight: 700, textAlign: "center" }}>د مرابحې تمویل تړون</p>
                  <div style={{ flexGrow: 1 }} />
                  <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                      {cd.disbursement.disbursementDate ? `${new Date(cd.disbursement.disbursementDate).getFullYear()} - 1404` : ""}
                    </p>
                  </div>
                </div>
                {/* PAGE 2: Section 1 - Party Identification + Contract Subject + Details Table */}
                <div data-contract-section style={{ padding: "24px" }}>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "10px", color: "#15803d", borderBottom: "1px solid #15803d", paddingBottom: "4px" }}>۱. په تړون کې د ښکیلو لورو پېژندنه:</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "2px solid #333", fontSize: "0.8rem" }} dir="rtl">
                      <thead>
                        <tr>
                          <td style={{ padding: "8px 12px", fontWeight: 700, background: "#15803d", color: "#ffffff", textAlign: "center", border: "1px solid #333", width: "50%" }}>تمویل اخېستونکي (مشتري)</td>
                          <td style={{ padding: "8px 12px", fontWeight: 700, background: "#15803d", color: "#ffffff", textAlign: "center", border: "1px solid #333", width: "50%" }}>تمویلونکی (لمن د وړو مالی تمویلونو مؤسسه)</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: "12px", border: "1px solid #333", verticalAlign: "top" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                              <div style={{ flex: 1, border: "1px solid #999", padding: "10px", lineHeight: 2 }}>
                                <p style={{ marginBottom: "2px" }}><span style={{ fontWeight: 600 }}>نــــــوم : </span><span>{cd.customer.fullNameDari || cd.customer.name}</span></p>
                                <p style={{ marginBottom: "2px" }}><span style={{ fontWeight: 600 }}>د پلار نوم : </span><span>{cd.customer.fatherNameDari || cd.customer.fatherName}</span></p>
                                <p style={{ marginBottom: "2px" }}><span style={{ fontWeight: 600 }}>د تذکرې شمېره : </span><span>{cd.customer.nationalId}</span></p>
                                <p style={{ marginBottom: "2px" }}><span style={{ fontWeight: 600 }}>د اړېکې شمېرې: </span><span>{cd.customer.phoneNumber}</span></p>
                                <p><span style={{ fontWeight: 600 }}>پــــــتـــــه: </span><span>{cd.customer.homeAddress}</span></p>
                              </div>
                              <div style={{ width: "90px", height: "120px", border: "2px solid #333", overflow: "hidden", flexShrink: 0 }}>
                                {cd.customer.photoUrl && cd.customer.photoUrl.length > 0 ? (
                                  <img src={cd.customer.photoUrl.startsWith("http") ? cd.customer.photoUrl : `${window.location.origin}${cd.customer.photoUrl}`} alt="Customer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                  <div style={{ width: "100%", height: "100%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#9ca3af" }}>عکس</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "12px", border: "1px solid #333", verticalAlign: "top", lineHeight: 1.8 }}>
                            <p style={{ marginBottom: "8px" }}>لمن د وړو مالي تمویلونو مؤسسه چې د افغانستان بانک له لورې د (۰۰۳) شمېرې جواز لرونکې ده، مرکزي دفتر یې د څلورمې ناحیې ، تایمني پروژې په دوهم سرک ، کابل - افغانستان کې دی.</p>
                            <p><span style={{ fontWeight: 600 }}>د څانګې کوډ نمبر: </span><span>{cd.branch.code}</span></p>
                            <p><span style={{ fontWeight: 600 }}>اړونــــد ولایــــــت: </span><span>{cd.customer.province}</span></p>
                            <p><span style={{ fontWeight: 600 }}>ولســـــــــــوالـــي: </span><span>{cd.customer.district}</span></p>
                            <p><span style={{ fontWeight: 600 }}>د څانګې موقعیت: </span><span>{cd.branch.address || cd.branch.name}</span></p>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2} style={{ padding: "8px 12px", border: "1px solid #333" }}>
                            <span style={{ fontWeight: 600 }}>تړون نمبر: </span><span>{cd.loan.applicationId}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "8px", color: "#15803d", borderBottom: "1px solid #15803d", paddingBottom: "4px" }}>۲. د تړون موضوع:</h3>
                    <p style={{ fontSize: "14px" }}>د لمن مؤسسې له لوري، د مشتري د غوښتنې پر اساس، د توکو او اجناسو پیر او بیا یې مشتري ته د مرابحې تړون له مخې، پر ټاکلې ګټه او شرایطو پلورل.</p>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "8px", color: "#15803d", borderBottom: "1px solid #15803d", paddingBottom: "4px" }}>۳. د تړون اړوند عمومي معلومات:</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }} dir="rtl">
                      <tbody>
                        {(() => {
                          const markup = cd.loan.totalReceivable - cd.loan.principleAmount;
                          let eachInstallment = cd.loan.installmentAmount;
                          if (eachInstallment === 0 && cd.loan.numberOfInstallments > 0) {
                            const payable = cd.loan.numberOfInstallments - (cd.loan.gracePeriod || 0);
                            if (payable > 0) eachInstallment = Math.round(cd.loan.totalReceivable / payable * 100) / 100;
                          }
                          return [
                            ["د فعالیت ډول (Type of Activity):", cd.business.businessType],
                            ["د توکو (اجناسو) نوم  (Name of Good / Items):", ""],
                            ["د  پېرېدونکي د فعالیت ځای/ساحه  (Client's Business Location):", cd.business.detailedAddress],
                            ["د تمویل شوې پانګې اندازه (مبلغ) (Financing Amount):", `${contractFormatAmount(cd.loan.principleAmount)} افغانۍ`],
                            ["د ګټې اندازه (Markup) په پولي واحد باندې:", `${contractFormatAmount(markup)} افغانۍ`],
                            ["د توکو (اجناسو) د خرڅون مجموعي بیعه: (Sale Price)", `${contractFormatAmount(cd.loan.totalReceivable)} افغانۍ`],
                            ["د تړون موده  (Contract Period):", `${cd.loan.financingDurationMonths} میاشتې`],
                            ["د تړون د پیل نېټه  (Contract Start Date):", contractFormatDate(cd.disbursement.disbursementDate)],
                            ["د تړون د پای نېټه  (Contract End Date):", contractFormatDate(cd.disbursement.lastInstallmentDate)],
                            ["د قسطونو شمېر (Number of Installments):", cd.loan.numberOfInstallments],
                            ["د معافیت موده  (Grace Period):", `${cd.loan.gracePeriod} میاشتې`],
                            ["د هر قسط اندازه (مبلغ)(Installment Amount):", `${contractFormatAmount(eachInstallment)} افغانۍ`],
                            ["د قسطونو تکرار  (Frequency of Installments):", "یو میاشتنی"],
                            ["د لومړني قسط د اداینې نېټه  (First Installment Date):", contractFormatDate(cd.disbursement.firstInstallmentDate)],
                            ["د وروستني قسط د اداینې نېټه  (Last Installment Date):", contractFormatDate(cd.disbursement.lastInstallmentDate)],
                          ];
                        })().map(([label, value], ri) => (
                          <tr key={ri} style={{ borderBottom: "1px solid #e5e7eb" }}>
                            <td style={{ padding: "6px 8px 6px 0", fontWeight: 600, width: "50%", background: "#dcfce7", color: "#15803d" }}>{label}</td>
                            <td style={{ padding: "6px 8px", direction: "ltr", textAlign: "right" }}>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* PAGE 3: Notes + Responsibilities + Terms */}
                <div data-contract-section style={{ padding: "24px" }}>
                  <div dir="rtl" style={{ fontSize: "14px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "4px", textAlign: "right", direction: "rtl" }}>
                    <p><span style={{ fontWeight: 700, color: "#15803d" }}>د توکو (جنس) مشخصات:</span> د مهربانۍ له مخې یې په ضمیمه شوي جدول (A) کې وګورئ.</p>
                    <p><span style={{ fontWeight: 700, color: "#15803d" }}>د قسطونود تادیې جدول (مهالوېش):</span> د مهربانۍ له مخې یې په ضمیمه شوي جدول (B) کې وګورئ.</p>
                    <p>مشتري مکلف دی د قسطونو پیسې (مبلغ) د ټاکل شویو نېټو سره سم، د لمن مؤسسې هغې څانګې ته چې تړون په کې لاسلیک شوی، د دفتر د کاري ساعتونو په جریان کې تسلیم، او خپل رسید ترلاسه کړي.</p>
                    <p>مشتري کولی شوي چې د مرابحې قسطونه د وروستنۍ ټاکل شوې نېټې څخه مخکې تصفیه کړي.</p>
                    <p>که د قسط د ورکونې نېټه د رخصتیو ورځو سره برابره وي، نو مشتری مکلف دی چې قسط له رخصتۍ څخه دمخه په کاري ورځ کې ادا کړي.</p>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "10px", color: "#15803d", borderBottom: "1px solid #15803d", paddingBottom: "4px" }}>۴. د طرفینو مسؤلیتونه:</h3>
                    <div style={{ marginBottom: "10px" }}>
                      <h4 style={{ fontWeight: 700, marginBottom: "4px" }}>الف:  د لمن مؤسسې مسؤلیتونه:</h4>
                      <div dir="rtl" style={{ paddingRight: "0", fontSize: "14px", display: "flex", flexDirection: "column", gap: "4px", textAlign: "right", direction: "rtl" }}>
                        <p>د مشتري د غوښتنې پر اساس، د مشخص شوو توکو او مالونو اخېستل، او مشتري ته د مرابحې تمویل له مخې پلورل.</p>
                        <p>لمن مؤسسه مکلفه ده چې په تمویل شوو توکو دولتي مالیات او لګښتونه، چې د دې تړون یا د توکو د اسنادو سره تړاو لري، د قانون مطابق پرې کړي.</p>
                        <p>اخېستل شوي توکي (مال) په سلامت ډول مشتري ته سپارل.</p>
                        <p>مشتري ته د جنس اصل قیمت (تمام شد) او د پلور قیمت (اصل قیمت + ګټه) ویل.</p>
                        <p>د مرابحې تمویل اړونده اسنادو ترتیبول، لکه د فورمونو برابرول او ډکول، د قرارداد جوړول او داسې نور.</p>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, marginBottom: "4px" }}>ب: د مشتري مسؤلیتونه:</h4>
                      <div dir="rtl" style={{ paddingRight: "0", fontSize: "14px", display: "flex", flexDirection: "column", gap: "4px", textAlign: "right", direction: "rtl" }}>
                        <p>د اخېستل شوي جنس (توکي) قبولي او تسلېمېدل.</p>
                        <p>د جنس له معاینې وروسته، د عیب د نه لرلو څخه ډاډ ترلاسه کول.</p>
                        <p>د قسطونو پر خپل وخت ادا کول.</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "10px", color: "#15803d", borderBottom: "1px solid #15803d", paddingBottom: "4px" }}>۵. د تړون فسخ:</h3>
                    <div dir="rtl" style={{ paddingRight: "0", fontSize: "14px", display: "flex", flexDirection: "column", gap: "4px", textAlign: "right", direction: "rtl" }}>
                      <p>د قرارداد دواړه خواوې کولای شي، چې د دوه اړخېزې موافقې له مخې قرارداد هر وخت فسخ کړي، په دې شرط چې ټول حقوقي او مالي تعهدات تسویه شي.</p>
                      <p>که چیرې مشتری د درې پرلپسې قسطونو له ورکړې څخه عاجز شي، لمن مؤسسه حق لري چې قرارداد فسخ کړي او پاتې پیسې یا مال بېرته تر لاسه کړي.</p>
                      <p>د مشتري له لوري، په قرارداد کې د نورو مادو څخه په سرغړونه قرارداد فسخ کېدای شي.</p>
                      <p>د قرارداد له فسخې څخه وروسته به مالي حسابونه تسویه کیږي.</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "10px", color: "#15803d", borderBottom: "1px solid #15803d", paddingBottom: "4px" }}>۶. حل منازعات (د مالي شخړو حل):</h3>
                    <div dir="rtl" style={{ paddingRight: "0", fontSize: "14px", display: "flex", flexDirection: "column", gap: "4px", textAlign: "right", direction: "rtl" }}>
                      <p>طرفین مکلف دي هر ډول شخړې او اختلافونه د خپلمنځي خبرو له لارې حلوي.</p>
                      <p>که چېرې ونه توانېدل ستونزه به د دواړو لورو له خوا ټاکل شوي درېیم‌ګړي حَکَم (Arbitrator) ته وړاندې کېږي.</p>
                      <p>که بیا هم ونه توانېدل، نو د افغانستان محاکمو ته به مراجعه کوي.</p>
                    </div>
                  </div>
                </div>
                {/* PAGE 4: Guarantees + General Terms + Signatures */}
                <div data-contract-section style={{ padding: "24px" }}>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "10px", color: "#15803d", borderBottom: "1px solid #15803d", paddingBottom: "4px" }}>۷. شخصي او مالي تضمینونه:</h3>
                    <div dir="rtl" style={{ fontSize: "14px", display: "flex", flexDirection: "column", gap: "4px", textAlign: "right", direction: "rtl" }}>
                      <p>مشتری مکلف دی چې د دې تړون د تضمین لپاره، له لمن مؤسسې سره همغږي شوي معتبر تضمیني اسناد وړاندې کړي. که مؤسسه د اضافي تضمین اړتیا ولري، مشتری باید نور لازم اسناد هم ورته برابر کړي.</p>
                      <p>دا تضمینونه به تر هغه وخته پورې د اعتبار وړ وي، څو چې مشتری د دې تړون له مخې ټول مکلفیتونه او تادیات پوره ادا کړي نه وي.</p>
                      <p>لمن مؤسسه به تضمیني اسناد یوازې هغه مهال آزادوي (بېرته ورکوي)، کله چې د تړون پورې اړوند د مرابحې قیمت ټول قسطونه ادا شوي وي.</p>
                      <p>همدارنګه مشتري متعهد دی چې د خیانت، غفلت، یا کوتاهۍ په صورت کې به مسؤل وي، او د اړوند ضرر جبران به کوي. د سرغړونې په صورت کې به عدلي او قضايي چلند سره مخ کیږي.</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "10px", color: "#15803d", borderBottom: "1px solid #15803d", paddingBottom: "4px" }}>۸. عمومي شرایط:</h3>
                    <div dir="rtl" style={{ paddingRight: "0", fontSize: "14px", display: "flex", flexDirection: "column", gap: "4px", textAlign: "right", direction: "rtl" }}>
                      <p>دا تړون د اسلامي شرعي اصولو له مخې ترتیب شوی دی.</p>
                      <p>هیڅ لوری نه شي کولی د بل لورې له موافقې پرته قرارداد دریمګړي ته ورکړي.</p>
                      <p>دا قرارداد په دوه کاپیانو کې ترتیب شوی، چې یوه یې تمویل ورکونکي (لمن مؤسسې ) ته او بله یې تمویل اخېستونکي (مشتري) ته ورکول کیږي، چې دواړه کاپیانې به یو شان قانوني حیثیت ولري.</p>
                      <p>دا تړون د دخیلو لورو په خوښه ، بغیر له کوم جبر او اکراه څخه تړل کیږی، او داواړه لوري په خپل اقرار کې صادق دي.</p>
                    </div>
                  </div>
                  <div style={{ marginTop: "24px", borderTop: "1px solid #9ca3af", paddingTop: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                      <div style={{ textAlign: "center" }}>
                        <h4 style={{ fontWeight: 700, marginBottom: "16px", color: "#15803d" }}>تمویل اخېستونکی:</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", textAlign: "right" }}>
                          <p>نوم: ___________________________</p>
                          <p>د تذکرې شمېره : ___________________________</p>
                          <p>لاسلیک او ګوته: ___________________________</p>
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <h4 style={{ fontWeight: 700, marginBottom: "16px", color: "#15803d" }}>د لمن مؤسسې استازی:</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", textAlign: "right" }}>
                          <p>نوم: ___________________________</p>
                          <p>وظیفه : ___________________________</p>
                          <p>لاسلیک او ګوته: ___________________________</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
