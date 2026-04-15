import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBranch } from "@/contexts/branch-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  Eye,
  PiggyBank,
  Calendar,
  Download,
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  QrCode,
} from "lucide-react";
import { Link } from "wouter";
import type { Loan } from "@shared/schema";
import { generateQRText, generateQRWithLogo, downloadQRCode, type QRLoanData } from "@/lib/qr-generator";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type BSScheduleRow = {
  no: number;
  installmentDate: string | null;
  principleAmount: number;
  marginAmount: number;
  totalAmount: number;
};

type BSActualPaymentRow = {
  no: number;
  paymentDate: string | null;
  principleAmount: number;
  marginAmount: number;
  totalAmount: number;
  isPaid: boolean;
  arears: number;
};

type BSLoanStatement = {
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
  schedule: BSScheduleRow[];
  actualPayments: BSActualPaymentRow[];
  scheduleTotals: { principleAmount: number; marginAmount: number; totalAmount: number };
  actualTotals: { principleAmount: number; marginAmount: number; totalAmount: number; arears: number };
  outstanding: { principleAmount: number; marginAmount: number; totalAmount: number };
};

type BSStatementData = {
  customer: {
    id: string;
    customerNo: string;
    name: string;
    fatherName: string;
  };
  loanStatements: BSLoanStatement[];
};

type ContractData = {
  customer: {
    name: string;
    fullNameDari: string;
    fatherName: string;
    fatherNameDari: string;
    nationalId: string;
    phoneNumber: string;
    homeAddress: string;
    province: string;
    district: string;
  };
  loan: {
    applicationId: string;
    productName: string;
    financingDurationMonths: number;
    gracePeriod: number;
    numberOfInstallments: number;
    principleAmount: number;
    marginRate: number;
    profit: number;
    totalReceivable: number;
    installmentAmount: number;
  };
  branch: {
    name: string;
    code: string;
    province: string;
  };
  business: {
    businessType: string;
    detailedAddress: string;
    businessName: string;
  };
  disbursement: {
    disbursementDate: string;
    firstInstallmentDate: string;
    lastInstallmentDate: string;
    maturityDate: string;
  };
};

const bsFormatNumber = (num: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

const bsFormatDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const bsMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const bsFormatDateDMY = (dateStr: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()}/${bsMonthNames[d.getMonth()]}/${d.getFullYear()}`;
};

const bsFormatDateTime = () => {
  const now = new Date();
  return {
    date: `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`,
    time: now.toLocaleTimeString("en-US", { hour12: false }),
  };
};

type ApprovedLoan = Loan & {
  customerName?: string;
  branchName?: string;
  approvedAmount?: string;
  approvedDate?: string;
};

type BulkResult = {
  applicationId: string;
  success: boolean;
  error?: string;
};

type BulkResponse = {
  message: string;
  successCount: number;
  failCount: number;
  results: BulkResult[];
};

export default function DisbursementsPage() {
  const { selectedBranchId } = useBranch();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<ApprovedLoan | null>(null);
  const [showDisburseDialog, setShowDisburseDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrLoanInfo, setQrLoanInfo] = useState<QRLoanData | null>(null);
  const [bulkResults, setBulkResults] = useState<BulkResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customDisbursementDate, setCustomDisbursementDate] = useState("");
  const [qrCustomerId, setQrCustomerId] = useState<string>("");
  const [qrLoanId, setQrLoanId] = useState<string>("");
  const [qrDialogTab, setQrDialogTab] = useState<string>("qr-code");
  const [showInsufficientFundsDialog, setShowInsufficientFundsDialog] = useState(false);
  const [insufficientFundsInfo, setInsufficientFundsInfo] = useState<{
    accountName: string;
    accountCode: string;
    accountBalance: number;
    requiredAmount: number;
    branchName: string;
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: roleData } = useQuery<{ role: string; roleType: string }>({
    queryKey: ["/api/user/role"],
  });
  const userRole = (roleData?.role || "").toLowerCase();
  const canPickDate = userRole === "ceo" || userRole === "admin";

  const { data: loans, isLoading } = useQuery<ApprovedLoan[]>({
    queryKey: ["/api/loans/approved", search, selectedBranchId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedBranchId) params.set("branchId", selectedBranchId);
      const url = params.toString() ? `/api/loans/approved?${params.toString()}` : "/api/loans/approved";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch approved loans");
      return res.json();
    },
  });

  const disburseMutation = useMutation({
    mutationFn: async (loanId: string) => {
      const body: any = {};
      if (canPickDate && customDisbursementDate) {
        body.disbursementDate = customDisbursementDate;
      }
      const res = await fetch(`/api/loans/${loanId}/disburse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        const err = new Error(errorData.message || "Failed to disburse loan");
        (err as any).insufficientFunds = errorData.insufficientFunds;
        (err as any).fundDetails = errorData;
        throw err;
      }
      return res.json();
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans/approved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Financing Disbursed",
        description: "The financing has been disbursed successfully.",
      });
      setShowDisburseDialog(false);

      if (selectedLoan) {
        const qrData: QRLoanData = {
          applicationId: selectedLoan.applicationId || "",
          customerName: selectedLoan.customerName || "Unknown",
          amount: selectedLoan.approvedAmount || selectedLoan.requestAmount || "0",
          disbursementDate: (canPickDate && customDisbursementDate) ? customDisbursementDate : new Date().toISOString().split("T")[0],
          productName: selectedLoan.productName || "Murabaha",
          durationMonths: selectedLoan.financingDurationMonths || 12,
        };
        try {
          const text = generateQRText(qrData);
          const url = await generateQRWithLogo(text, 450);
          setQrLoanInfo(qrData);
          setQrDataUrl(url);
          setQrCustomerId(selectedLoan.customerId || "");
          setQrLoanId(selectedLoan.id || "");
          setQrDialogTab("qr-code");
          setShowQRDialog(true);
        } catch (err) {
          console.error("Failed to generate QR code:", err);
        }
      }
      setSelectedLoan(null);
      setCustomDisbursementDate("");
    },
    onError: (error: any) => {
      if (error.insufficientFunds && error.fundDetails) {
        setInsufficientFundsInfo({
          accountName: error.fundDetails.accountName || "",
          accountCode: error.fundDetails.accountCode || "",
          accountBalance: error.fundDetails.accountBalance || 0,
          requiredAmount: error.fundDetails.requiredAmount || 0,
          branchName: error.fundDetails.branchName || "",
          message: error.message,
        });
        setShowDisburseDialog(false);
        setShowInsufficientFundsDialog(true);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to disburse loan. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const bulkDisburseMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/loans/bulk-disburse", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to process bulk disbursement");
      }
      return res.json() as Promise<BulkResponse>;
    },
    onSuccess: (data) => {
      setBulkResults(data);
      queryClient.invalidateQueries({ queryKey: ["/api/loans/approved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      toast({
        title: "Bulk Disbursement Complete",
        description: data.message,
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: userData } = useQuery<any>({
    queryKey: ["/api/auth/user"],
  });

  const { data: bsStatementData, isLoading: bsLoading } = useQuery<BSStatementData>({
    queryKey: ["/api/reports/citizen-balance-statement", qrCustomerId],
    queryFn: async () => {
      const res = await fetch(`/api/reports/citizen-balance-statement/${qrCustomerId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch balance statement");
      return res.json();
    },
    enabled: showQRDialog && !!qrCustomerId,
  });

  const { data: contractData, isLoading: contractLoading } = useQuery<ContractData>({
    queryKey: ["/api/loans", qrLoanId, "contract-data"],
    queryFn: async () => {
      const res = await fetch(`/api/loans/${qrLoanId}/contract-data`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch contract data");
      return res.json();
    },
    enabled: showQRDialog && !!qrLoanId,
  });

  const contractRef = useRef<HTMLDivElement>(null);

  const exportContractPDF = async () => {
    if (!contractRef.current || !contractData) return;
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

    if (imgHeight <= pageHeight - margin * 2) {
      doc.addImage(imgData, "PNG", margin, margin, usableWidth, imgHeight);
    } else {
      let yOffset = 0;
      const sliceHeight = ((pageHeight - margin * 2) / imgHeight) * canvas.height;
      let pageNum = 0;
      while (yOffset < canvas.height) {
        if (pageNum > 0) doc.addPage();
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        const currentSliceHeight = Math.min(sliceHeight, canvas.height - yOffset);
        sliceCanvas.height = currentSliceHeight;
        const ctx = sliceCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(canvas, 0, yOffset, canvas.width, currentSliceHeight, 0, 0, canvas.width, currentSliceHeight);
        }
        const sliceData = sliceCanvas.toDataURL("image/png");
        const sliceImgHeight = usableWidth * (currentSliceHeight / canvas.width);
        doc.addImage(sliceData, "PNG", margin, margin, usableWidth, sliceImgHeight);
        yOffset += sliceHeight;
        pageNum++;
      }
    }

    doc.save(`Contract_${contractData.loan.applicationId}_${new Date().toISOString().split("T")[0]}.pdf`);
    toast({ title: "PDF Exported", description: "Contract exported to PDF." });
  };

  const contractFormatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day}/${months[d.getMonth()]}/${d.getFullYear()}`;
  };

  const contractFormatAmount = (num: number) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

  const exportBalanceStatementPDF = () => {
    if (!bsStatementData?.loanStatements?.length) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    bsStatementData.loanStatements.forEach((ls, lsIdx) => {
      if (lsIdx > 0) doc.addPage();
      const { date: nowDate, time: nowTime } = bsFormatDateTime();

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
        ["Client Name:", bsStatementData.customer.name, col1X, col1V],
        ["Finance Officer:", ls.officer?.name || "", col1X, col1V],
      ];
      const infoFields2: [string, string, number, number][] = [
        ["Principle Amount:", bsFormatNumber(ls.loan.principleAmount), col2X, col2V],
        ["Margin Rate:", `${ls.loan.marginRate}%`, col2X, col2V],
        ["Disbursement Date:", ls.disbursement?.disbursementDate ? bsFormatDateDMY(ls.disbursement.disbursementDate) : "", col2X, col2V],
        ["No. of Installments:", `${ls.loan.numberOfInstallments}`, col2X, col2V],
        ["Grace Period:", `${ls.loan.gracePeriod} months`, col2X, col2V],
      ];
      const infoFields3: [string, string, number, number][] = [
        ["Province:", ls.province, col3X, col3V],
        ["District:", ls.district, col3X, col3V],
        ["Branch Manager:", ls.branchManager, col3X, col3V],
        ["Financing Status:", ls.loan.status, col3X, col3V],
      ];

      const maxInfoRows = Math.max(infoFields.length, infoFields2.length, infoFields3.length);
      for (let i = 0; i < maxInfoRows; i++) {
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

      const tableStartY = infoY + maxInfoRows * lineH + 4;

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
          isScheduleTotal ? "Total =" : (s ? bsFormatDate(s.installmentDate) : ""),
          isScheduleTotal ? bsFormatNumber(ls.scheduleTotals.principleAmount) : (s ? bsFormatNumber(s.principleAmount) : ""),
          isScheduleTotal ? bsFormatNumber(ls.scheduleTotals.marginAmount) : (s ? bsFormatNumber(s.marginAmount) : ""),
          isScheduleTotal ? bsFormatNumber(ls.scheduleTotals.totalAmount) : (s ? bsFormatNumber(s.totalAmount) : ""),
          "",
          isPaymentTotal ? "" : (isPaymentOutstanding ? "" : (a ? a.no : "")),
          isPaymentTotal ? "Total =" : (isPaymentOutstanding ? "Outstanding" : (a ? (a.paymentDate ? bsFormatDate(a.paymentDate) : "") : "")),
          isPaymentTotal ? bsFormatNumber(ls.actualTotals.principleAmount) : (isPaymentOutstanding ? bsFormatNumber(ls.outstanding.principleAmount) : (a ? (a.principleAmount > 0 ? bsFormatNumber(a.principleAmount) : "") : "")),
          isPaymentTotal ? bsFormatNumber(ls.actualTotals.marginAmount) : (isPaymentOutstanding ? bsFormatNumber(ls.outstanding.marginAmount) : (a ? (a.marginAmount > 0 ? bsFormatNumber(a.marginAmount) : "") : "")),
          isPaymentTotal ? bsFormatNumber(ls.actualTotals.totalAmount) : (isPaymentOutstanding ? bsFormatNumber(ls.outstanding.totalAmount) : (a ? (a.totalAmount > 0 ? bsFormatNumber(a.totalAmount) : "") : "")),
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

    doc.save(`Balance_Statement_${bsStatementData.customer.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
    toast({ title: "PDF Exported", description: "Balance Statement exported to PDF." });
  };

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return "AFN 0";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    const day = d.getDate().toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        toast({
          title: "Invalid File",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setBulkResults(null);
    }
  };

  const handleBulkUpload = () => {
    if (selectedFile) {
      bulkDisburseMutation.mutate(selectedFile);
    }
  };

  const downloadTemplate = () => {
    const headers = "Application ID,Customer Name,Branch,Principal Amount,Profit,Duration,Grace Period,Disbursement Date\n";
    const example = "1021100194,Example Customer,Branch Name,50000,5000,12,2,2026-01-15\n";
    const blob = new Blob([headers + example], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "disbursement-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-disbursements-title">Disbursements</h1>
          <p className="text-muted-foreground">
            Manage financing disbursements for approved applications
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {loans?.length || 0} ready to disburse
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList>
          <TabsTrigger value="individual" data-testid="tab-individual-disburse">
            <PiggyBank className="mr-2 h-4 w-4" />
            Individual Disbursement
          </TabsTrigger>
          <TabsTrigger value="bulk" data-testid="tab-bulk-disburse">
            <Upload className="mr-2 h-4 w-4" />
            Bulk CSV Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-4">
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search approved loans..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="input-search-disbursements"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Approved Amount</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Approved Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 8 }).map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : loans && loans.length > 0 ? (
                      loans.map((loan) => (
                        <TableRow key={loan.id} data-testid={`row-disbursement-${loan.id}`}>
                          <TableCell className="font-mono text-sm">
                            {loan.applicationId || "-"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {loan.customerName || "-"}
                          </TableCell>
                          <TableCell>{loan.branchName || "-"}</TableCell>
                          <TableCell>{loan.productName || "-"}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(loan.approvedAmount || loan.requestAmount)}
                          </TableCell>
                          <TableCell>
                            {loan.financingDurationMonths ? `${loan.financingDurationMonths}m` : "-"}
                          </TableCell>
                          <TableCell>{formatDate(loan.approvedDate)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/loans/${loan.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setShowDisburseDialog(true);
                                }}
                                data-testid={`button-disburse-${loan.id}`}
                              >
                                <PiggyBank className="mr-1 h-3 w-3" />
                                Disburse
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <PiggyBank className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No approved loans ready for disbursement</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="mt-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Bulk Disbursement via CSV Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
                  <h3 className="font-semibold text-sm">Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Download the CSV template or prepare your own CSV file</li>
                    <li>Fill in the <strong className="text-foreground">Application ID</strong> and <strong className="text-foreground">Disbursement Date</strong> columns (accepted formats: YYYY-MM-DD, DD-Mon-YY, or MM/DD/YYYY)</li>
                    <li>Upload the completed CSV file</li>
                    <li>The system will automatically:
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                        <li>Update loan status to "Disbursed"</li>
                        <li>Create disbursement records</li>
                        <li>Calculate first installment date (25th-day rule)</li>
                        <li>Generate all installments with grace period logic</li>
                      </ul>
                    </li>
                  </ol>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      <strong>25th-day rule:</strong> If disbursed before the 25th, first installment = same day next month. 
                      If disbursed on or after the 25th, first installment = 1st of month after next.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Grace period:</strong> During grace period months, customer pays only profit/margin. After grace period, customer pays principal + profit.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button variant="outline" onClick={downloadTemplate} data-testid="button-download-template">
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV Template
                  </Button>
                </div>

                <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile ? (
                        <span className="text-foreground font-medium">{selectedFile.name}</span>
                      ) : (
                        "Select a CSV file to upload"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      data-testid="input-csv-file"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="button-select-csv"
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      {selectedFile ? "Change File" : "Select CSV File"}
                    </Button>
                    {selectedFile && (
                      <Button
                        onClick={handleBulkUpload}
                        disabled={bulkDisburseMutation.isPending}
                        data-testid="button-process-bulk"
                      >
                        {bulkDisburseMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Process Disbursements
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {bulkResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {bulkResults.failCount === 0 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : bulkResults.successCount > 0 ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    Processing Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {bulkResults.successCount} Successful
                    </Badge>
                    {bulkResults.failCount > 0 && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400">
                        <XCircle className="mr-1 h-3 w-3" />
                        {bulkResults.failCount} Failed
                      </Badge>
                    )}
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bulkResults.results.map((result, idx) => (
                          <TableRow key={idx} data-testid={`row-bulk-result-${idx}`}>
                            <TableCell className="font-mono text-sm">{result.applicationId}</TableCell>
                            <TableCell>
                              {result.success ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Success
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Failed
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {result.success ? "Disbursed with installments generated" : result.error}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showDisburseDialog} onOpenChange={setShowDisburseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Disbursement</DialogTitle>
            <DialogDescription>
              Disburse funds for loan application {selectedLoan?.applicationId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Customer:</span>
                <p className="font-medium">{selectedLoan?.customerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Branch:</span>
                <p className="font-medium">{selectedLoan?.branchName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Product:</span>
                <p className="font-medium">{selectedLoan?.productName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p className="font-medium">{selectedLoan?.financingDurationMonths} months</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Disbursement Amount</span>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(selectedLoan?.approvedAmount || selectedLoan?.requestAmount || 0)}
                </p>
              </div>
            </div>
            {canPickDate && (
              <div className="space-y-2">
                <Label htmlFor="disbursement-date">Disbursement Date</Label>
                <Input
                  id="disbursement-date"
                  type="date"
                  value={customDisbursementDate}
                  onChange={(e) => setCustomDisbursementDate(e.target.value)}
                  data-testid="input-disbursement-date"
                />
                <p className="text-xs text-muted-foreground">
                  {customDisbursementDate
                    ? `Disbursement will be recorded on ${customDisbursementDate}`
                    : "Leave empty to use today's date"}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisburseDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedLoan && disburseMutation.mutate(selectedLoan.id)}
              disabled={disburseMutation.isPending}
              data-testid="button-confirm-disburse"
            >
              {disburseMutation.isPending ? "Processing..." : "Confirm Disbursement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInsufficientFundsDialog} onOpenChange={setShowInsufficientFundsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Insufficient Funds
            </DialogTitle>
            <DialogDescription>
              Disbursement cannot proceed due to insufficient balance in the branch account.
            </DialogDescription>
          </DialogHeader>
          {insufficientFundsInfo && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Branch:</span>
                    <span className="font-medium">{insufficientFundsInfo.branchName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Account:</span>
                    <span className="font-medium text-sm">{insufficientFundsInfo.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Account Code:</span>
                    <span className="font-mono text-sm">{insufficientFundsInfo.accountCode}</span>
                  </div>
                  <hr className="border-red-200 dark:border-red-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Available Balance:</span>
                    <span className="font-bold text-red-600">
                      AFN {insufficientFundsInfo.accountBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Required Amount:</span>
                    <span className="font-bold">
                      AFN {insufficientFundsInfo.requiredAmount.toLocaleString()}
                    </span>
                  </div>
                  <hr className="border-red-200 dark:border-red-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Shortfall:</span>
                    <span className="font-bold text-red-600">
                      AFN {(insufficientFundsInfo.requiredAmount - insufficientFundsInfo.accountBalance).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Please ensure sufficient funds are available in the branch account before attempting disbursement.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowInsufficientFundsDialog(false);
                setInsufficientFundsInfo(null);
              }}
              data-testid="button-close-insufficient-funds"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Disbursement - {qrLoanInfo?.applicationId}
            </DialogTitle>
            <DialogDescription>
              QR code and balance statement for {qrLoanInfo?.customerName}
            </DialogDescription>
          </DialogHeader>
          <Tabs value={qrDialogTab} onValueChange={setQrDialogTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="qr-code" data-testid="tab-qr-code">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="balance-statement" data-testid="tab-balance-statement">
                <FileText className="h-4 w-4 mr-2" />
                Balance Statement
              </TabsTrigger>
              <TabsTrigger value="contract" data-testid="tab-contract">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Contract
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr-code">
              <div className="flex flex-col items-center py-4 space-y-4">
                {qrDataUrl && (
                  <div className="border-2 border-muted rounded-xl p-4 bg-white">
                    <img src={qrDataUrl} alt="Loan QR Code" className="w-[400px] h-[400px]" data-testid="img-qr-code" />
                  </div>
                )}
                {qrLoanInfo && (
                  <div className="text-xs text-muted-foreground text-center space-y-0.5">
                    <p className="font-semibold text-foreground">{qrLoanInfo.applicationId}</p>
                    <p>{qrLoanInfo.customerName}</p>
                    <p>AFN {Number(qrLoanInfo.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    <p>{qrLoanInfo.productName} - {qrLoanInfo.durationMonths} months</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowQRDialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    if (qrDataUrl && qrLoanInfo) {
                      downloadQRCode(qrDataUrl, `QR_${qrLoanInfo.applicationId}.png`);
                    }
                  }}
                  data-testid="button-download-qr"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="balance-statement">
              {bsLoading && (
                <div className="py-8 space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              )}

              {!bsLoading && (!bsStatementData || bsStatementData.loanStatements.length === 0) && (
                <div className="py-8 text-center text-muted-foreground">
                  No financing records found for this customer.
                </div>
              )}

              {!bsLoading && bsStatementData && bsStatementData.loanStatements.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={exportBalanceStatementPDF} className="bg-red-600 text-white" data-testid="button-bs-export-pdf">
                      <FileText className="mr-2 h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                  {bsStatementData.loanStatements.map((ls, lsIdx) => {
                    const { date: nowDate, time: nowTime } = bsFormatDateTime();
                    return (
                      <div key={ls.loan.id} className="border border-border rounded-md overflow-hidden">
                        <div className="bg-muted/50 p-3 sm:p-4 border-b border-border">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img src="/logo.jpeg" alt="Lamen" className="h-12 w-auto" />
                              <div>
                                <h2 className="text-lg font-bold text-green-700 dark:text-green-400">Lamen</h2>
                                <p className="text-sm font-semibold">Citizen Balance Statement</p>
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="flex justify-end gap-6">
                                <span className="text-muted-foreground">User</span>
                                <span className="font-medium">{userData?.firstName || ""}</span>
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
                                <span className="font-medium">{ls.branch?.name || ""}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold text-muted-foreground w-32 shrink-0">Financing Type</span>
                                <span className="font-medium">{ls.loan.productName}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold text-muted-foreground w-32 shrink-0">Financing No./ Cycle</span>
                                <span className="font-medium">{ls.loan.applicationId} / {ls.loan.financingCycle}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold text-muted-foreground w-32 shrink-0">Client Name</span>
                                <span className="font-medium">{bsStatementData.customer.name}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold text-muted-foreground w-32 shrink-0">Finance Officer</span>
                                <span className="font-medium">{ls.officer?.name || ""}</span>
                              </div>
                            </div>
                            <div className="space-y-1.5 text-sm">
                              <div className="flex gap-2">
                                <span className="font-semibold text-muted-foreground w-32 shrink-0">Principle Amount</span>
                                <span className="font-medium">{bsFormatNumber(ls.loan.principleAmount)}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold text-muted-foreground w-32 shrink-0">Margin Rate</span>
                                <span className="font-medium">{ls.loan.marginRate}%</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold text-muted-foreground w-32 shrink-0">Disbursement Date</span>
                                <span className="font-medium">{ls.disbursement?.disbursementDate ? bsFormatDateDMY(ls.disbursement.disbursementDate) : ""}</span>
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
                                <table className="w-full text-sm border-collapse border border-green-700" data-testid={`bs-table-schedule-${lsIdx}`}>
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
                                        <td className="px-2 py-1 border border-border">{bsFormatDate(s.installmentDate)}</td>
                                        <td className="px-2 py-1 border border-border text-right">{bsFormatNumber(s.principleAmount)}</td>
                                        <td className="px-2 py-1 border border-border text-right">{bsFormatNumber(s.marginAmount)}</td>
                                        <td className="px-2 py-1 border border-border text-right">{bsFormatNumber(s.totalAmount)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    <tr className="bg-green-100 dark:bg-green-900/30 font-semibold">
                                      <td className="px-2 py-1.5 border border-border" colSpan={2}>Total =</td>
                                      <td className="px-2 py-1.5 border border-border text-right">{bsFormatNumber(ls.scheduleTotals.principleAmount)}</td>
                                      <td className="px-2 py-1.5 border border-border text-right">{bsFormatNumber(ls.scheduleTotals.marginAmount)}</td>
                                      <td className="px-2 py-1.5 border border-border text-right">{bsFormatNumber(ls.scheduleTotals.totalAmount)}</td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-bold mb-2 text-green-700 dark:text-green-400">Actual Payment</h3>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse border border-green-700" data-testid={`bs-table-actual-${lsIdx}`}>
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
                                        <td className="px-2 py-1 border border-border">{a.paymentDate ? bsFormatDate(a.paymentDate) : ""}</td>
                                        <td className="px-2 py-1 border border-border text-right">{a.principleAmount > 0 ? bsFormatNumber(a.principleAmount) : ""}</td>
                                        <td className="px-2 py-1 border border-border text-right">{a.marginAmount > 0 ? bsFormatNumber(a.marginAmount) : ""}</td>
                                        <td className="px-2 py-1 border border-border text-right">{a.totalAmount > 0 ? bsFormatNumber(a.totalAmount) : ""}</td>
                                        <td className="px-2 py-1 border border-border text-right">{a.arears > 0 ? a.arears : ""}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    <tr className="bg-green-100 dark:bg-green-900/30 font-semibold">
                                      <td className="px-2 py-1.5 border border-border" colSpan={2}>Total =</td>
                                      <td className="px-2 py-1.5 border border-border text-right">{bsFormatNumber(ls.actualTotals.principleAmount)}</td>
                                      <td className="px-2 py-1.5 border border-border text-right">{bsFormatNumber(ls.actualTotals.marginAmount)}</td>
                                      <td className="px-2 py-1.5 border border-border text-right">{bsFormatNumber(ls.actualTotals.totalAmount)}</td>
                                      <td className="px-2 py-1.5 border border-border text-right">{ls.actualTotals.arears > 0 ? ls.actualTotals.arears : ""}</td>
                                    </tr>
                                    <tr className="bg-yellow-100 dark:bg-yellow-900/30 font-semibold">
                                      <td className="px-2 py-1.5 border border-border" colSpan={2}>Outstanding</td>
                                      <td className="px-2 py-1.5 border border-border text-right">{bsFormatNumber(ls.outstanding.principleAmount)}</td>
                                      <td className="px-2 py-1.5 border border-border text-right">{bsFormatNumber(ls.outstanding.marginAmount)}</td>
                                      <td className="px-2 py-1.5 border border-border text-right">{bsFormatNumber(ls.outstanding.totalAmount)}</td>
                                      <td className="px-2 py-1.5 border border-border text-right"></td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowQRDialog(false)}>
                  Close
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contract">
              {contractLoading && (
                <div className="py-8 space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              )}

              {!contractLoading && !contractData && (
                <div className="py-8 text-center text-muted-foreground">
                  No contract data available.
                </div>
              )}

              {!contractLoading && contractData && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={exportContractPDF} className="bg-red-600 text-white" data-testid="button-contract-export-pdf">
                      <FileText className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                  <div ref={contractRef} className="bg-white text-black p-6 text-sm leading-relaxed" dir="rtl" style={{ fontFamily: "Arial, Tahoma, sans-serif", direction: "rtl" }}>
                    <div className="text-center mb-4">
                      <p className="text-base font-bold mb-1">بسم الله الرحمن الرحیم</p>
                    </div>

                    <div className="text-center mb-6">
                      <img src="/logo.jpeg" alt="Lamen" className="h-16 w-auto mx-auto mb-2" />
                      <p className="text-lg font-bold text-green-700">لمن د وړو مالي تمویلونو مؤسسه</p>
                      <p className="text-base font-bold mt-2">د مرابحې تمویل قرارداد</p>
                    </div>

                    <div className="border border-gray-400 rounded p-4 mb-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="text-right">
                          <p className="mb-1">
                            <span className="font-semibold">نوم / اسم: </span>
                            <span className="bg-yellow-100 px-2 py-0.5 rounded" data-testid="contract-customer-name">{contractData.customer.fullNameDari || contractData.customer.name}</span>
                          </p>
                          <p>
                            <span className="font-semibold">د اړېکې شمېره: </span>
                            <span className="bg-yellow-100 px-2 py-0.5 rounded" data-testid="contract-phone">{contractData.customer.phoneNumber}</span>
                          </p>
                        </div>
                        <div className="text-left" dir="ltr">
                          <p className="mb-1">
                            <span className="font-semibold">قرارداد نمبر: </span>
                            <span className="bg-yellow-100 px-2 py-0.5 rounded" data-testid="contract-app-id">{contractData.loan.applicationId}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-4 text-sm">
                      <span className="bg-yellow-100 px-2 py-0.5 rounded" data-testid="contract-year-date">
                        {contractData.disbursement.disbursementDate ? new Date(contractData.disbursement.disbursementDate).getFullYear() : ""}
                      </span>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-base mb-3 text-green-700 border-b border-green-700 pb-1">په قرارداد کې د ښکیلو لورو پېژندنه:</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gray-300 rounded p-3">
                          <h4 className="font-bold mb-2 text-green-700">تمویل اخېستونکي (مشتري)</h4>
                          <div className="space-y-1.5">
                            <p><span className="font-semibold">نــوم: </span><span className="bg-yellow-100 px-1 rounded">{contractData.customer.fullNameDari || contractData.customer.name}</span></p>
                            <p><span className="font-semibold">د پلار نوم: </span><span className="bg-yellow-100 px-1 rounded">{contractData.customer.fatherNameDari || contractData.customer.fatherName}</span></p>
                            <p><span className="font-semibold">د تذکرې شمېره: </span><span className="bg-yellow-100 px-1 rounded">{contractData.customer.nationalId}</span></p>
                            <p><span className="font-semibold">د اړېکې شمېرې: </span><span className="bg-yellow-100 px-1 rounded">{contractData.customer.phoneNumber}</span></p>
                            <p><span className="font-semibold">پــتـه: </span><span className="bg-yellow-100 px-1 rounded">{contractData.customer.homeAddress}</span></p>
                          </div>
                        </div>
                        <div className="border border-gray-300 rounded p-3">
                          <h4 className="font-bold mb-2 text-green-700">تمویلونکی (لمن د وړو مالی تمویلونو مؤسسه)</h4>
                          <p className="text-xs leading-relaxed">من د وړو مالي تمویلونو مؤسسه چې د افغانستان بانک له لورې د (۰۰۳) شمېرې جواز لرونکې ده، مرکزي دفتر یې د څلورمې ناحیې ، تایمني پروژې په دوهم سرک ، کابل - افغانستان کې دی.</p>
                          <div className="mt-2 space-y-1">
                            <p><span className="font-semibold">د څانګې کوډ نمبر: </span><span className="bg-yellow-100 px-1 rounded">{contractData.branch.code}</span></p>
                            <p><span className="font-semibold">اړونـد ولایت: </span><span className="bg-yellow-100 px-1 rounded">{contractData.customer.province}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-base mb-3 text-green-700 border-b border-green-700 pb-1">د قرارداد موضوع:</h3>
                      <p className="text-xs">د لمن مؤسسې له لورې، د مشتري د غوښتنې پر اساس، د توکو او اجناسو پیر او بیا یې مشتري ته د مرابحې تړون له مخې، پر ټاکلې ګټه او شرایطوپلورل.</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-base mb-3 text-green-700 border-b border-green-700 pb-1">د تړون اړوند عمومي معلومات:</h3>
                      <table className="w-full border-collapse text-xs" dir="rtl">
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold w-1/2">د فعالیت ډول (Type of Activity):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded">{contractData.business.businessType}</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د پېرېدونکي د فعالیت ځای/ساحه (Client's Business Location):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded">{contractData.business.detailedAddress}</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د تمویل شوې پانګې اندازه (Financing Amount):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded" dir="ltr">{contractFormatAmount(contractData.loan.principleAmount)} افغانۍ</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د ګټې اندازه (Markup):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded" dir="ltr">{contractFormatAmount(contractData.loan.profit)} افغانۍ</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د توکو د خرڅون مجموعي بیعه (Sale Price):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded" dir="ltr">{contractFormatAmount(contractData.loan.totalReceivable)} افغانۍ</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د قرارداد موده (Contract Period):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded">{contractData.loan.financingDurationMonths} میاشتې</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د قرارداد د پیل نېټه (Contract Start Date):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded">{contractFormatDate(contractData.disbursement.disbursementDate)}</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د قراراداد د پای نېټه (Contract End Date):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded">{contractFormatDate(contractData.disbursement.lastInstallmentDate)}</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د قسطونو شمېر (Number of Installments):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded">{contractData.loan.numberOfInstallments}</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د معافیت موده (Grace Period):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded">{contractData.loan.gracePeriod} میاشتې</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د هر قسط اندازه (Installment Amount):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded" dir="ltr">{contractFormatAmount(contractData.loan.installmentAmount)} افغانۍ</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د قسطونو تکرار (Frequency):</td>
                            <td className="py-2">یو میاشتنۍ</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د لومړني قسط د اداینې نېټه (First Installment Date):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded">{contractFormatDate(contractData.disbursement.firstInstallmentDate)}</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pr-2 font-semibold">د وروستني قسط د اداینې نېټه (Last Installment Date):</td>
                            <td className="py-2"><span className="bg-yellow-100 px-1 rounded">{contractFormatDate(contractData.disbursement.lastInstallmentDate)}</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-base mb-3 text-green-700 border-b border-green-700 pb-1">د طرفینو مسؤلیتونه:</h3>
                      <div className="mb-3">
                        <h4 className="font-bold mb-1">الف: د لمن مؤسسې مسؤلیتونه:</h4>
                        <ul className="list-disc pr-5 space-y-1 text-xs">
                          <li>د مشتری د غوښتنې پر اساس، د مشخص شوو توکو او مالونو اخېستل، او مشتري ته د مرابحې تمویل له مخې پلورل.</li>
                          <li>لمن مؤسسه مکلفه ده چې په تمویل شوو توکو دولتي مالیات او لګښتونه، چې د دې تړون یا د توکو د اسنادو سره تړاو لري، د قانون مطابق پرې کړي.</li>
                          <li>اخېستل شوي توکي (مال) په سلامت ډول مشتري ته سپارل.</li>
                          <li>مشتري ته د جنس اصل قیمت (تمام شد) او د پلور قیمت (اصل قیمت + ګټه) ویل.</li>
                          <li>د مرابحې تمویل اړونده اسنادو ترتیبول، لکه د فورمونو برابرول او ډکول، د قرارداد جوړول او داسې نور.</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">ب: د مشتري مسؤلیتونه:</h4>
                        <ul className="list-disc pr-5 space-y-1 text-xs">
                          <li>د اخېستل شوي جنس (توکي) قبولي او تسلېمېدل.</li>
                          <li>د جنس له معاینې وروسته، د عیب د نه لرلو څخه ډاډ ترلاسه کول.</li>
                          <li>د قسطونو پر خپل وخت ادا کول.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-base mb-3 text-green-700 border-b border-green-700 pb-1">د قرارداد فسخ:</h3>
                      <ul className="list-disc pr-5 space-y-1 text-xs">
                        <li>د قرارداد دواړه خواوې کولای شي، چې د دوه اړخېزې موافقې له مخې قرارداد هر وخت فسخ کړي، په دې شرط چې ټول حقوقي او مالي تعهدات تسویه شي.</li>
                        <li>که چیرې مشتری د درې پرلپسې قسطونو له ورکړې څخه عاجز شي، لمن مؤسسه حق لري چې قرارداد فسخ کړي او پاتې پیسې یا مال بېرته تر لاسه کړي.</li>
                        <li>د مشتري له لوري، په قرارداد کې د نورو مادو څخه په سرغړونه قرارداد فسخ کېدای شي.</li>
                        <li>د قرارداد له فسخې څخه وروسته به مالي حسابونه تسویه کیږي.</li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-base mb-3 text-green-700 border-b border-green-700 pb-1">حل منازعات (د مالي شخړو حل):</h3>
                      <ul className="list-disc pr-5 space-y-1 text-xs">
                        <li>طرفین مکلف دي هر ډول شخړې او اختلافونه د خپلمنځي خبرو له لارې حلوي.</li>
                        <li>که چېرې ونه توانېدل ستونزه به د دواړو لورو له خوا ټاکل شوي درېیم‌ګړي حَکَم (arbitrator) ته وړاندې کېږي.</li>
                        <li>که بیا هم ونه توانېدل، نو د افغانستان محاکمو ته به مراجعه کوي.</li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-base mb-3 text-green-700 border-b border-green-700 pb-1">شخصي او مالي تضمینونه:</h3>
                      <p className="text-xs leading-relaxed">مشتری مکلف دی چې د دې قرارداد د تضمین لپاره، له لمن مؤسسې سره همغږي شوي معتبر تضمیني اسناد وړاندې کړي. که مؤسسه د اضافي تضمین اړتیا ولري، مشتری باید نور لازم اسناد هم برابر کړي.</p>
                      <p className="text-xs leading-relaxed mt-1">دا تضمینونه به تر هغه وخته پورې د اعتبار وړ وي، څو چې مشتری د دې قرارداد له مخې ټول مکلفیتونه او تادیات پوره ادا کړي نه وي.</p>
                      <p className="text-xs leading-relaxed mt-1">لمن مؤسسه به تضمیني اسناد یوازې هغه مهال آزادوي، کله چې دې قرارداد پورې اړوند د مرابحې قیمت ټول قسطونه ادا شوي وي.</p>
                      <p className="text-xs leading-relaxed mt-1">همدارنګه مشتري متعهد دی چې د خیانت، غفلت، یا کوتاهۍ په صورت کې به مسؤل وي، او د اړوند ضرر جبران به کوي.</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-base mb-3 text-green-700 border-b border-green-700 pb-1">عمومي شرایط:</h3>
                      <ul className="list-disc pr-5 space-y-1 text-xs">
                        <li>دا قرارداد د اسلامي شرعي اصولو له مخې ترتیب شوی دی.</li>
                        <li>هیڅ لوری نه شي کولی د بل لورې له موافقې پرته قرارداد دریمګړي ته ورکړي.</li>
                        <li>دا قرارداد په دوه کاپیانو کې ترتیب شوی، چې یوه یې تمویل ورکونکي (لمن مؤسسې) ته او بله یې تمویل اخېستونکي (مشتري) ته ورکول کیږي.</li>
                        <li>دا قرارداد د دخیلو لورو په خوښه، بغیر له کوم جبر او اکراه څخه تړل کیږی.</li>
                      </ul>
                    </div>

                    <div className="mt-8 border-t border-gray-400 pt-4">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="text-center">
                          <h4 className="font-bold mb-4 text-green-700">تمویل اخېستونکی:</h4>
                          <div className="space-y-3 text-xs text-right">
                            <p>نوم: ___________________________</p>
                            <p>د تذکرې شمېره: ___________________________</p>
                            <p>لاسلیک او ګوته: ___________________________</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <h4 className="font-bold mb-4 text-green-700">د لمن مؤسسې استازی:</h4>
                          <div className="space-y-3 text-xs text-right">
                            <p>نوم: ___________________________</p>
                            <p>وظیفه: ___________________________</p>
                            <p>لاسلیک او ګوته: ___________________________</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowQRDialog(false)}>
                  Close
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
