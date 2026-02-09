import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileSpreadsheet,
  FileText,
  Eye,
  Printer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const formatDateTime = () => {
  const now = new Date();
  return {
    date: `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`,
    time: now.toLocaleTimeString("en-US", { hour12: false }),
  };
};

export default function CitizenBalanceStatementPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: customers, isLoading: customersLoading } = useQuery<any[]>({
    queryKey: ["/api/customers"],
  });

  const { data: statementData, isLoading: statementLoading, refetch } = useQuery<StatementData>({
    queryKey: ["/api/reports/citizen-balance-statement", selectedCustomerId],
    enabled: showReport && !!selectedCustomerId,
  });

  const { data: userData } = useQuery<any>({
    queryKey: ["/api/auth/user"],
  });

  const handleView = () => {
    if (!selectedCustomerId) {
      toast({ title: "Select Customer", description: "Please select a customer first.", variant: "destructive" });
      return;
    }
    setShowReport(true);
    refetch();
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
        ["Branch", ls.branch?.name || "", "", "", "", "Financing Amount", formatNumber(ls.loan.financingAmount)],
        ["Financing Type", ls.loan.productName, "", "", "", "Margin Rate", `${ls.loan.marginRate}%`],
        ["Financing No./ Cycle", ls.loan.applicationId, "/", ls.loan.financingCycle, "", "Disbursement Date", ls.disbursement?.disbursementDate ? formatDate(ls.disbursement.disbursementDate) : ""],
        ["Client Name", statementData.customer.name, "", "", "", "Province", ls.province],
        ["Finance Officer", ls.officer?.name || "", "", "", "", "District", ls.district],
        ["Branch Manager", ls.branchManager, "", "", "", "Financing Status", ls.loan.status],
        [],
        ["Schedule", "", "", "", "", "Actual Payment", "", "", "", "", ""],
        ["No.", "Installment Date", "Principle", "Margin", "Total", "No.", "Payment Date", "Principle", "Margin", "Total", "Arears"],
      ];

      const maxRows = Math.max(ls.schedule.length, ls.actualPayments.length);
      for (let i = 0; i < maxRows; i++) {
        const s = ls.schedule[i];
        const a = ls.actualPayments[i];
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
        "", "Total =", formatNumber(ls.actualTotals.principleAmount), formatNumber(ls.actualTotals.marginAmount), formatNumber(ls.actualTotals.totalAmount), formatNumber(ls.actualTotals.arears),
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
      doc.setFont("helvetica", "bold");
      doc.text("Branch:", 14, infoY);
      doc.setFont("helvetica", "normal");
      doc.text(ls.branch?.name || "", 42, infoY);

      doc.setFont("helvetica", "bold");
      doc.text("Financing Type:", 14, infoY + 5);
      doc.setFont("helvetica", "normal");
      doc.text(ls.loan.productName, 42, infoY + 5);

      doc.setFont("helvetica", "bold");
      doc.text("Financing No./ Cycle:", 14, infoY + 10);
      doc.setFont("helvetica", "normal");
      doc.text(`${ls.loan.applicationId}  /  ${ls.loan.financingCycle}`, 50, infoY + 10);

      doc.setFont("helvetica", "bold");
      doc.text("Client Name:", 14, infoY + 15);
      doc.setFont("helvetica", "normal");
      doc.text(statementData.customer.name, 42, infoY + 15);

      doc.setFont("helvetica", "bold");
      doc.text("Finance Officer:", 14, infoY + 20);
      doc.setFont("helvetica", "normal");
      doc.text(ls.officer?.name || "", 42, infoY + 20);

      doc.setFont("helvetica", "bold");
      doc.text("Branch Manager:", 14, infoY + 25);
      doc.setFont("helvetica", "normal");
      doc.text(ls.branchManager, 42, infoY + 25);

      doc.setFont("helvetica", "bold");
      doc.text("Financing Amount:", 180, infoY);
      doc.setFont("helvetica", "normal");
      doc.text(formatNumber(ls.loan.financingAmount), 220, infoY);

      doc.setFont("helvetica", "bold");
      doc.text("Margin Rate:", 180, infoY + 5);
      doc.setFont("helvetica", "normal");
      doc.text(`${ls.loan.marginRate}%`, 220, infoY + 5);

      doc.setFont("helvetica", "bold");
      doc.text("Disbursement Date:", 180, infoY + 10);
      doc.setFont("helvetica", "normal");
      doc.text(ls.disbursement?.disbursementDate ? formatDate(ls.disbursement.disbursementDate) : "", 220, infoY + 10);

      doc.setFont("helvetica", "bold");
      doc.text("Province:", 180, infoY + 15);
      doc.setFont("helvetica", "normal");
      doc.text(ls.province, 220, infoY + 15);

      doc.setFont("helvetica", "bold");
      doc.text("District:", 180, infoY + 20);
      doc.setFont("helvetica", "normal");
      doc.text(ls.district, 220, infoY + 20);

      doc.setFont("helvetica", "bold");
      doc.text("Financing Status:", 180, infoY + 25);
      doc.setFont("helvetica", "normal");
      doc.text(ls.loan.status, 220, infoY + 25);

      const tableStartY = infoY + 32;

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Schedule", 14, tableStartY);
      doc.text("Actual Payment", 160, tableStartY);

      const scheduleBody = ls.schedule.map((s) => [
        s.no,
        formatDate(s.installmentDate),
        formatNumber(s.principleAmount),
        formatNumber(s.marginAmount),
        formatNumber(s.totalAmount),
      ]);
      scheduleBody.push([
        "" as any, "Total =",
        formatNumber(ls.scheduleTotals.principleAmount),
        formatNumber(ls.scheduleTotals.marginAmount),
        formatNumber(ls.scheduleTotals.totalAmount),
      ]);

      autoTable(doc, {
        startY: tableStartY + 2,
        head: [["No.", "Installment Date", "Principle", "Margin", "Total"]],
        body: scheduleBody,
        margin: { left: 14 },
        tableWidth: 130,
        styles: { fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [60, 120, 80], textColor: 255, fontStyle: "bold" },
        footStyles: { fillColor: [200, 230, 210], fontStyle: "bold" },
      });

      const actualBody = ls.actualPayments.map((a) => [
        a.no,
        a.paymentDate ? formatDate(a.paymentDate) : "",
        a.principleAmount > 0 ? formatNumber(a.principleAmount) : "",
        a.marginAmount > 0 ? formatNumber(a.marginAmount) : "",
        a.totalAmount > 0 ? formatNumber(a.totalAmount) : "",
        a.arears > 0 ? formatNumber(a.arears) : "",
      ]);
      actualBody.push([
        "" as any, "Total =",
        formatNumber(ls.actualTotals.principleAmount),
        formatNumber(ls.actualTotals.marginAmount),
        formatNumber(ls.actualTotals.totalAmount),
        formatNumber(ls.actualTotals.arears),
      ]);
      actualBody.push([
        "" as any, "Outstanding",
        formatNumber(ls.outstanding.principleAmount),
        formatNumber(ls.outstanding.marginAmount),
        formatNumber(ls.outstanding.totalAmount),
        "",
      ]);

      autoTable(doc, {
        startY: tableStartY + 2,
        head: [["No.", "Payment Date", "Principle", "Margin", "Total", "Arears"]],
        body: actualBody,
        margin: { left: 152 },
        tableWidth: 135,
        styles: { fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [60, 120, 80], textColor: 255, fontStyle: "bold" },
        footStyles: { fillColor: [200, 230, 210], fontStyle: "bold" },
      });
    });

    doc.save(`Citizen_Balance_Statement_${statementData.customer.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
    toast({ title: "PDF Exported", description: "Citizen Balance Statement exported to PDF." });
  };

  const customerList = Array.isArray(customers) ? customers : (customers as any)?.customers || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-balance-statement-title">
            Citizen Balance Statement
          </h1>
          <p className="text-muted-foreground">
            View financing schedule and payment details for a customer
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="flex-1 min-w-[250px]">
              <label className="text-sm font-medium mb-2 block">Select Customer</label>
              <Select value={selectedCustomerId} onValueChange={(v) => { setSelectedCustomerId(v); setShowReport(false); }}>
                <SelectTrigger data-testid="select-customer">
                  <SelectValue placeholder="Choose a customer..." />
                </SelectTrigger>
                <SelectContent>
                  {customersLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    customerList.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} {c.fatherName ? `- ${c.fatherName}` : ""} ({c.customerNo || "N/A"})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-sm">
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">Branch</span>
                          <span className="font-medium" data-testid={`text-branch-${lsIdx}`}>{ls.branch?.name || ""}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">Financing Type</span>
                          <span className="font-medium">{ls.loan.productName}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">Financing No./ Cycle</span>
                          <span className="font-medium" data-testid={`text-app-id-${lsIdx}`}>{ls.loan.applicationId} / {ls.loan.financingCycle}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">Client Name</span>
                          <span className="font-medium" data-testid={`text-client-name-${lsIdx}`}>{statementData.customer.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">Finance Officer</span>
                          <span className="font-medium">{ls.officer?.name || ""}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">Branch Manager</span>
                          <span className="font-medium">{ls.branchManager}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">Financing Amount</span>
                          <span className="font-medium" data-testid={`text-financing-amount-${lsIdx}`}>{formatNumber(ls.loan.financingAmount)}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">Margin Rate</span>
                          <span className="font-medium">{ls.loan.marginRate}%</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">Disbursement Date</span>
                          <span className="font-medium">{ls.disbursement?.disbursementDate ? formatDate(ls.disbursement.disbursementDate) : ""}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">Province</span>
                          <span className="font-medium">{ls.province}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">District</span>
                          <span className="font-medium">{ls.district}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-muted-foreground w-36">Financing Status</span>
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
                          <table className="w-full text-sm border-collapse" data-testid={`table-schedule-${lsIdx}`}>
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
                          <table className="w-full text-sm border-collapse" data-testid={`table-actual-payment-${lsIdx}`}>
                            <thead>
                              <tr className="bg-green-700 dark:bg-green-800 text-white">
                                <th className="px-2 py-1.5 text-left font-medium border border-green-600">No.</th>
                                <th className="px-2 py-1.5 text-left font-medium border border-green-600">Payment Date</th>
                                <th className="px-2 py-1.5 text-right font-medium border border-green-600">Principle</th>
                                <th className="px-2 py-1.5 text-right font-medium border border-green-600">Margin</th>
                                <th className="px-2 py-1.5 text-right font-medium border border-green-600">Total</th>
                                <th className="px-2 py-1.5 text-right font-medium border border-green-600">Arears</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ls.actualPayments.map((a, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                                  <td className="px-2 py-1 border border-border text-center">{a.no}</td>
                                  <td className="px-2 py-1 border border-border">{a.paymentDate ? formatDate(a.paymentDate) : ""}</td>
                                  <td className="px-2 py-1 border border-border text-right">{a.principleAmount > 0 ? formatNumber(a.principleAmount) : ""}</td>
                                  <td className="px-2 py-1 border border-border text-right">{a.marginAmount > 0 ? formatNumber(a.marginAmount) : ""}</td>
                                  <td className="px-2 py-1 border border-border text-right">{a.totalAmount > 0 ? formatNumber(a.totalAmount) : ""}</td>
                                  <td className="px-2 py-1 border border-border text-right">{a.arears > 0 ? formatNumber(a.arears) : ""}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-green-100 dark:bg-green-900/30 font-semibold">
                                <td className="px-2 py-1.5 border border-border" colSpan={2}>Total =</td>
                                <td className="px-2 py-1.5 border border-border text-right">{formatNumber(ls.actualTotals.principleAmount)}</td>
                                <td className="px-2 py-1.5 border border-border text-right">{formatNumber(ls.actualTotals.marginAmount)}</td>
                                <td className="px-2 py-1.5 border border-border text-right">{formatNumber(ls.actualTotals.totalAmount)}</td>
                                <td className="px-2 py-1.5 border border-border text-right">{formatNumber(ls.actualTotals.arears)}</td>
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
    </div>
  );
}
