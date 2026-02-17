import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSpreadsheet, FileText, FileBarChart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ContractDataRow = {
  applicationId: string;
  branchName: string;
  loanStatus: string;
  requestDate: string;
  customerId: string;
  customerName: string;
  signedContractDate: string;
  paymentFrequency: string;
  amountOffered: number;
  currency: string;
  maturityDate: string;
  totalAmountDisbursed: number;
  principleAmount: number;
  marginRate: number;
  marginAmount: number;
  totalReceivable: number;
  installmentAmount: number;
  numberOfInstallments: number;
  financingDurationMonths: number;
  firstInstallmentDate: string;
  disbursementDate: string;
  productName: string;
  fundingSourceName: string;
  financingCycle: number;
  sector: string;
  province: string;
  district: string;
  phoneNumber: string;
  nationalId: string;
  gender: string;
  gracePeriod: number;
  totalPaid: number;
  principalOutstanding: number;
  outstandingInstallments: number;
  lastPaymentDate: string;
  numberOfDaysInArrears: number;
  overdueAmount: number;
  overdueDate: string;
  restructured: string;
  writtenOff: number;
};

type Branch = {
  id: string;
  name: string;
};

type FundingSource = {
  id: string;
  name: string;
};

type BranchGroup = {
  branchName: string;
  rows: ContractDataRow[];
  subtotal: {
    amountOffered: number;
    totalAmountDisbursed: number;
    principleAmount: number;
    marginAmount: number;
    totalReceivable: number;
    totalPaid: number;
    principalOutstanding: number;
    overdueAmount: number;
  };
};

export default function ContractDataReport() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [branchId, setBranchId] = useState("all");
  const [fundingSourceId, setFundingSourceId] = useState("all");
  const [data, setData] = useState<ContractDataRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: branchesData } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  const { data: fundingSourcesData } = useQuery<FundingSource[]>({
    queryKey: ["/api/funding-sources"],
  });

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (branchId !== "all") params.append("branchId", branchId);
      if (fundingSourceId !== "all") params.append("fundingSourceId", fundingSourceId);
      const res = await fetch(`/api/reports/contract-data?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch contract data report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBranchName = branchId === "all" ? "All Branches" : branchesData?.find(b => b.id === branchId)?.name || "";

  const { branchGroups, grandTotal } = useMemo(() => {
    const emptyTotal = { amountOffered: 0, totalAmountDisbursed: 0, principleAmount: 0, marginAmount: 0, totalReceivable: 0, totalPaid: 0, principalOutstanding: 0, overdueAmount: 0 };
    if (!data || data.length === 0) return { branchGroups: [], grandTotal: emptyTotal };

    const sorted = [...data].sort((a, b) => (a.branchName || "").localeCompare(b.branchName || ""));

    const groupMap = new Map<string, ContractDataRow[]>();
    for (const row of sorted) {
      const key = row.branchName || "Unknown";
      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key)!.push(row);
    }

    const groups: BranchGroup[] = [];
    const gt = { ...emptyTotal };

    for (const [branchName, rows] of Array.from(groupMap.entries())) {
      const subtotal = { amountOffered: 0, totalAmountDisbursed: 0, principleAmount: 0, marginAmount: 0, totalReceivable: 0, totalPaid: 0, principalOutstanding: 0, overdueAmount: 0 };
      for (const r of rows) {
        subtotal.amountOffered += r.amountOffered || 0;
        subtotal.totalAmountDisbursed += r.totalAmountDisbursed || 0;
        subtotal.principleAmount += r.principleAmount || 0;
        subtotal.marginAmount += r.marginAmount || 0;
        subtotal.totalReceivable += r.totalReceivable || 0;
        subtotal.totalPaid += r.totalPaid || 0;
        subtotal.principalOutstanding += r.principalOutstanding || 0;
        subtotal.overdueAmount += r.overdueAmount || 0;
      }
      gt.amountOffered += subtotal.amountOffered;
      gt.totalAmountDisbursed += subtotal.totalAmountDisbursed;
      gt.principleAmount += subtotal.principleAmount;
      gt.marginAmount += subtotal.marginAmount;
      gt.totalReceivable += subtotal.totalReceivable;
      gt.totalPaid += subtotal.totalPaid;
      gt.principalOutstanding += subtotal.principalOutstanding;
      gt.overdueAmount += subtotal.overdueAmount;
      groups.push({ branchName, rows, subtotal });
    }

    return { branchGroups: groups, grandTotal: gt };
  }, [data]);

  const handleExportExcel = () => {
    if (!data) return;

    const rows: Record<string, string | number>[] = [];
    let serial = 1;
    for (const group of branchGroups) {
      for (const row of group.rows) {
        rows.push({
          "#": serial++,
          "ContractCode": row.applicationId || "",
          "Branch": row.branchName || "",
          "Loan Status": row.loanStatus || "",
          "Loan Date": row.requestDate ? formatDate(row.requestDate) : "",
          "CustomerID": row.customerId || "",
          "Customer Name": row.customerName || "",
          "SignedContractDate": row.signedContractDate ? formatDate(row.signedContractDate) : "",
          "PaymentFrequency": row.paymentFrequency || "",
          "AmountOffered": row.amountOffered || 0,
          "CurrencyOfContract": row.currency || "AFN",
          "MaturityDate": row.maturityDate ? formatDate(row.maturityDate) : "",
          "TotalAmountDisbursed": row.totalAmountDisbursed || 0,
          "Currency": row.currency || "AFN",
          "Principle": row.principleAmount || 0,
          "Margin%": row.marginRate || 0,
          "Margin": row.marginAmount || 0,
          "TotalReceivable": row.totalReceivable || 0,
          "InstallmentAmount": row.installmentAmount || 0,
          "ContractDurationMonths": row.financingDurationMonths || 0,
          "NumberOfInstallments": row.numberOfInstallments || 0,
          "FirstInstallmentDate": row.firstInstallmentDate ? formatDate(row.firstInstallmentDate) : "",
          "DisbursementDate": row.disbursementDate ? formatDate(row.disbursementDate) : "",
          "TotalPaid": row.totalPaid || 0,
          "PrincipalOutstanding": row.principalOutstanding || 0,
          "OutstandingInstallments": row.outstandingInstallments || 0,
          "LastPaymentDate": row.lastPaymentDate ? formatDate(row.lastPaymentDate) : "",
          "NumberOfDaysInArrears": row.numberOfDaysInArrears || 0,
          "OverdueAmount": row.overdueAmount || 0,
          "OverdueDate": row.overdueDate ? formatDate(row.overdueDate) : "",
          "Restructured": row.restructured || "",
          "DenOfR": 0,
          "Sector": row.sector || "",
        });
      }
      const subtotalRow: Record<string, string | number> = {
        "#": "",
        "ContractCode": "",
        "Branch": `Subtotal - ${group.branchName}`,
        "Loan Status": "",
        "Loan Date": "",
        "CustomerID": "",
        "Customer Name": "",
        "SignedContractDate": "",
        "PaymentFrequency": "",
        "AmountOffered": group.subtotal.amountOffered,
        "CurrencyOfContract": "",
        "MaturityDate": "",
        "TotalAmountDisbursed": group.subtotal.totalAmountDisbursed,
        "Currency": "",
        "Principle": group.subtotal.principleAmount,
        "Margin%": "",
        "Margin": group.subtotal.marginAmount,
        "TotalReceivable": group.subtotal.totalReceivable,
        "InstallmentAmount": "",
        "ContractDurationMonths": "",
        "NumberOfInstallments": "",
        "FirstInstallmentDate": "",
        "DisbursementDate": "",
        "TotalPaid": group.subtotal.totalPaid,
        "PrincipalOutstanding": group.subtotal.principalOutstanding,
        "OutstandingInstallments": "",
        "LastPaymentDate": "",
        "NumberOfDaysInArrears": "",
        "OverdueAmount": group.subtotal.overdueAmount,
        "OverdueDate": "",
        "Restructured": "",
        "DenOfR": "",
        "Sector": "",
      };
      rows.push(subtotalRow);
    }
    const grandTotalRow: Record<string, string | number> = {
      "#": "",
      "ContractCode": "",
      "Branch": "Grand Total",
      "Loan Status": "",
      "Loan Date": "",
      "CustomerID": "",
      "Customer Name": "",
      "SignedContractDate": "",
      "PaymentFrequency": "",
      "AmountOffered": grandTotal.amountOffered,
      "CurrencyOfContract": "",
      "MaturityDate": "",
      "TotalAmountDisbursed": grandTotal.totalAmountDisbursed,
      "Currency": "",
      "Principle": grandTotal.principleAmount,
      "Margin%": "",
      "Margin": grandTotal.marginAmount,
      "TotalReceivable": grandTotal.totalReceivable,
      "InstallmentAmount": "",
      "ContractDurationMonths": "",
      "NumberOfInstallments": "",
      "FirstInstallmentDate": "",
      "DisbursementDate": "",
      "TotalPaid": grandTotal.totalPaid,
      "PrincipalOutstanding": grandTotal.principalOutstanding,
      "OutstandingInstallments": "",
      "LastPaymentDate": "",
      "NumberOfDaysInArrears": "",
      "OverdueAmount": grandTotal.overdueAmount,
      "OverdueDate": "",
      "Restructured": "",
      "DenOfR": "",
      "Sector": "",
    };
    rows.push(grandTotalRow);

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 6 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
      { wch: 14 }, { wch: 12 }, { wch: 16 }, { wch: 10 }, { wch: 14 },
      { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 16 },
      { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 16 },
      { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 12 },
      { wch: 12 }, { wch: 8 }, { wch: 14 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contract Data Report");

    const dateStr = `${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}`;
    XLSX.writeFile(wb, `Contract_Data_Report_${dateStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Contract Data Report", 148, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${formatDate(startDate)}    To: ${formatDate(endDate)}`, 148, 22, { align: "center" });
    doc.text(`Branch: ${selectedBranchName}`, 148, 28, { align: "center" });

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 148, 34, { align: "center" });

    const tableData: any[][] = [];
    let serial = 1;
    for (const group of branchGroups) {
      for (const row of group.rows) {
        tableData.push([
          serial++,
          row.applicationId || "",
          row.branchName || "",
          row.loanStatus || "",
          row.requestDate ? formatDate(row.requestDate) : "",
          row.customerId || "",
          row.customerName || "",
          row.signedContractDate ? formatDate(row.signedContractDate) : "",
          row.paymentFrequency || "",
          (row.amountOffered || 0).toLocaleString(),
          row.currency || "AFN",
          row.maturityDate ? formatDate(row.maturityDate) : "",
          (row.totalAmountDisbursed || 0).toLocaleString(),
          row.currency || "AFN",
          (row.principleAmount || 0).toLocaleString(),
          row.marginRate || 0,
          (row.marginAmount || 0).toLocaleString(),
          (row.totalReceivable || 0).toLocaleString(),
          (row.installmentAmount || 0).toLocaleString(),
          row.financingDurationMonths || 0,
          row.numberOfInstallments || 0,
          row.firstInstallmentDate ? formatDate(row.firstInstallmentDate) : "",
          row.disbursementDate ? formatDate(row.disbursementDate) : "",
          (row.totalPaid || 0).toLocaleString(),
          (row.principalOutstanding || 0).toLocaleString(),
          row.outstandingInstallments || 0,
          row.lastPaymentDate ? formatDate(row.lastPaymentDate) : "",
          row.numberOfDaysInArrears || 0,
          (row.overdueAmount || 0).toLocaleString(),
          row.overdueDate ? formatDate(row.overdueDate) : "",
          row.restructured || "",
          0,
          row.sector || "",
        ]);
      }
      tableData.push([
        "", "", `Subtotal - ${group.branchName}`, "", "", "", "", "", "",
        group.subtotal.amountOffered.toLocaleString(), "", "",
        group.subtotal.totalAmountDisbursed.toLocaleString(), "",
        group.subtotal.principleAmount.toLocaleString(), "",
        group.subtotal.marginAmount.toLocaleString(),
        group.subtotal.totalReceivable.toLocaleString(),
        "", "", "", "", "",
        group.subtotal.totalPaid.toLocaleString(),
        group.subtotal.principalOutstanding.toLocaleString(),
        "", "", "",
        group.subtotal.overdueAmount.toLocaleString(),
        "", "", "", "",
      ]);
    }
    tableData.push([
      "", "", "Grand Total", "", "", "", "", "", "",
      grandTotal.amountOffered.toLocaleString(), "", "",
      grandTotal.totalAmountDisbursed.toLocaleString(), "",
      grandTotal.principleAmount.toLocaleString(), "",
      grandTotal.marginAmount.toLocaleString(),
      grandTotal.totalReceivable.toLocaleString(),
      "", "", "", "", "",
      grandTotal.totalPaid.toLocaleString(),
      grandTotal.principalOutstanding.toLocaleString(),
      "", "", "",
      grandTotal.overdueAmount.toLocaleString(),
      "", "", "", "",
    ]);

    autoTable(doc, {
      startY: 38,
      head: [["#", "ContractCode", "Branch", "Loan Status", "Loan Date", "CustomerID", "Customer Name", "SignedContractDate", "PaymentFreq", "AmountOffered", "Currency", "MaturityDate", "TotalDisbursed", "Currency", "Principle", "Margin%", "Margin", "TotalReceivable", "InstallmentAmt", "Duration", "Installments", "1stInstDate", "DisbDate", "TotalPaid", "PrincipalOut", "OutInstall", "LastPayDate", "DaysArrears", "OverdueAmt", "OverdueDate", "Restructured", "DenOfR", "Sector"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 5 },
      styles: { fontSize: 5, cellPadding: 1 },
      columnStyles: {
        0: { halign: "center", cellWidth: 5 },
        9: { halign: "right" },
        12: { halign: "right" },
        14: { halign: "right" },
        15: { halign: "right" },
        16: { halign: "right" },
        17: { halign: "right" },
        18: { halign: "right" },
        23: { halign: "right" },
        24: { halign: "right" },
        28: { halign: "right" },
      },
      didParseCell: (hookData: any) => {
        if (hookData.section === "body") {
          const rowData = hookData.row.raw as any[];
          if (rowData && typeof rowData[2] === "string" && (rowData[2].startsWith("Subtotal") || rowData[2] === "Grand Total")) {
            hookData.cell.styles.fontStyle = "bold";
            hookData.cell.styles.fillColor = rowData[2] === "Grand Total" ? [34, 87, 122] : [220, 230, 240];
            if (rowData[2] === "Grand Total") {
              hookData.cell.styles.textColor = [255, 255, 255];
            }
          }
        }
      },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 148, 200, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 200);
    }

    const dateStr = `${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}`;
    doc.save(`Contract_Data_Report_${dateStr}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg">
            <FileBarChart className="h-6 w-6 text-teal-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Contract Data Report</h1>
            <p className="text-muted-foreground text-sm">View contract data by branch and date range</p>
          </div>
        </div>
        {data && data.length > 0 && (
          <div className="flex items-center gap-2">
            <Button onClick={handleExportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button onClick={handleExportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf">
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 flex-wrap">
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="w-[200px]" data-testid="select-branch">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branchesData?.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Funding Source</Label>
              <Select value={fundingSourceId} onValueChange={setFundingSourceId}>
                <SelectTrigger className="w-[200px]" data-testid="select-funding-source">
                  <SelectValue placeholder="Select Funding Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {fundingSourcesData?.map((fs) => (
                    <SelectItem key={fs.id} value={fs.id}>{fs.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} data-testid="input-start-date" />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} data-testid="input-end-date" />
            </div>
            <Button onClick={fetchReport} disabled={isLoading} data-testid="button-generate">
              {isLoading ? "Loading..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg">
                Contract Data Results
              </CardTitle>
              <span className="text-sm text-muted-foreground" data-testid="text-result-count">
                {data.length} record{data.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 overflow-x-auto">
            {data.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-no-results">No contract data found for the selected criteria.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                    <TableHead className="text-center w-10 text-primary-foreground font-semibold">#</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">ContractCode</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Branch</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Loan Status</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Loan Date</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">CustomerID</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Customer Name</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">SignedContractDate</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">PaymentFrequency</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">AmountOffered</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">CurrencyOfContract</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">MaturityDate</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">TotalAmountDisbursed</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Currency</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Principle</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Margin%</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Margin</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">TotalReceivable</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">InstallmentAmount</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold">ContractDurationMonths</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold">NumberOfInstallments</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">FirstInstallmentDate</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">DisbursementDate</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">TotalPaid</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">PrincipalOutstanding</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold">OutstandingInstallments</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">LastPaymentDate</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold">NumberOfDaysInArrears</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">OverdueAmount</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">OverdueDate</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Restructured</TableHead>
                    <TableHead className="text-center text-primary-foreground font-semibold">DenOfR</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Sector</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    let serial = 1;
                    return branchGroups.map((group) => (
                      <>
                        {group.rows.map((row, idx) => (
                          <TableRow key={`${group.branchName}-${idx}`} data-testid={`row-contract-${serial - 1 + idx}`} className={(serial - 1 + idx) % 2 === 0 ? "bg-muted/30" : ""}>
                            <TableCell className="text-center font-mono">{serial + idx}</TableCell>
                            <TableCell className="font-mono">{row.applicationId}</TableCell>
                            <TableCell>{row.branchName}</TableCell>
                            <TableCell>{row.loanStatus}</TableCell>
                            <TableCell>{row.requestDate ? formatDate(row.requestDate) : ""}</TableCell>
                            <TableCell className="font-mono">{row.customerId}</TableCell>
                            <TableCell>{row.customerName}</TableCell>
                            <TableCell>{row.signedContractDate ? formatDate(row.signedContractDate) : ""}</TableCell>
                            <TableCell>{row.paymentFrequency}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency((row.amountOffered || 0).toString())}</TableCell>
                            <TableCell>{row.currency || "AFN"}</TableCell>
                            <TableCell>{row.maturityDate ? formatDate(row.maturityDate) : ""}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency((row.totalAmountDisbursed || 0).toString())}</TableCell>
                            <TableCell>{row.currency || "AFN"}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency((row.principleAmount || 0).toString())}</TableCell>
                            <TableCell className="text-right font-mono">{row.marginRate || 0}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency((row.marginAmount || 0).toString())}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency((row.totalReceivable || 0).toString())}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency((row.installmentAmount || 0).toString())}</TableCell>
                            <TableCell className="text-center">{row.financingDurationMonths}</TableCell>
                            <TableCell className="text-center">{row.numberOfInstallments}</TableCell>
                            <TableCell>{row.firstInstallmentDate ? formatDate(row.firstInstallmentDate) : ""}</TableCell>
                            <TableCell>{row.disbursementDate ? formatDate(row.disbursementDate) : ""}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency((row.totalPaid || 0).toString())}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency((row.principalOutstanding || 0).toString())}</TableCell>
                            <TableCell className="text-center">{row.outstandingInstallments}</TableCell>
                            <TableCell>{row.lastPaymentDate ? formatDate(row.lastPaymentDate) : ""}</TableCell>
                            <TableCell className={`text-center font-mono ${(row.numberOfDaysInArrears || 0) > 0 ? "text-red-600 font-semibold" : ""}`}>{row.numberOfDaysInArrears || 0}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency((row.overdueAmount || 0).toString())}</TableCell>
                            <TableCell>{row.overdueDate ? formatDate(row.overdueDate) : ""}</TableCell>
                            <TableCell>{row.restructured}</TableCell>
                            <TableCell className="text-center">0</TableCell>
                            <TableCell>{row.sector}</TableCell>
                          </TableRow>
                        ))}
                        {(() => { serial += group.rows.length; return null; })()}
                        <TableRow className="bg-blue-50 dark:bg-blue-950/30 font-semibold border-t-2 border-b-2 border-blue-200 dark:border-blue-800">
                          <TableCell colSpan={9} className="text-right font-bold">Subtotal - {group.branchName}</TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.amountOffered.toString())}</TableCell>
                          <TableCell colSpan={2}></TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.totalAmountDisbursed.toString())}</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.principleAmount.toString())}</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.marginAmount.toString())}</TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.totalReceivable.toString())}</TableCell>
                          <TableCell colSpan={5}></TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.totalPaid.toString())}</TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.principalOutstanding.toString())}</TableCell>
                          <TableCell colSpan={3}></TableCell>
                          <TableCell className="text-right font-mono font-bold">{formatCurrency(group.subtotal.overdueAmount.toString())}</TableCell>
                          <TableCell colSpan={4}></TableCell>
                        </TableRow>
                      </>
                    ));
                  })()}
                  <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                    <TableCell colSpan={9} className="text-right font-bold text-primary-foreground text-base">Grand Total</TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.amountOffered.toString())}</TableCell>
                    <TableCell colSpan={2} className="text-primary-foreground"></TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.totalAmountDisbursed.toString())}</TableCell>
                    <TableCell className="text-primary-foreground"></TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.principleAmount.toString())}</TableCell>
                    <TableCell className="text-primary-foreground"></TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.marginAmount.toString())}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.totalReceivable.toString())}</TableCell>
                    <TableCell colSpan={5} className="text-primary-foreground"></TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.totalPaid.toString())}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.principalOutstanding.toString())}</TableCell>
                    <TableCell colSpan={3} className="text-primary-foreground"></TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary-foreground">{formatCurrency(grandTotal.overdueAmount.toString())}</TableCell>
                    <TableCell colSpan={4} className="text-primary-foreground"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}