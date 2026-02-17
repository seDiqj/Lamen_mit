import { useState } from "react";
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
import { FileSpreadsheet, FileText } from "lucide-react";
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

export default function ContractDataReport() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
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

  const handleExportExcel = () => {
    if (!data) return;

    const rows = data.map((row, idx) => ({
      "#": idx + 1,
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
    }));

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

    const tableData = data.map((row, idx) => [
      idx + 1,
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

    autoTable(doc, {
      startY: 38,
      head: [["#", "ContractCode", "Branch", "Status", "Loan Date", "CustomerID", "Customer", "SignedDate", "PayFreq", "AmtOffered", "Ccy", "Maturity", "TotalDisb", "Ccy", "Principle", "Margin%", "Margin", "TotalRecv", "InstAmt", "Duration", "NumInst", "1stInstDate", "DisbDate", "TotalPaid", "PrinOut", "OutInst", "LastPay", "DaysArr", "OverdueAmt", "OverdueDate", "Restruct", "DenOfR", "Sector"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 5 },
      styles: { fontSize: 5, cellPadding: 1 },
      columnStyles: {
        0: { halign: "center", cellWidth: 5 },
        9: { halign: "right" },
        12: { halign: "right" },
        14: { halign: "right" },
        16: { halign: "right" },
        17: { halign: "right" },
        18: { halign: "right" },
        23: { halign: "right" },
        24: { halign: "right" },
        28: { halign: "right" },
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
    <div className="flex flex-col gap-4">
      {data && data.length > 0 && (
        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleExportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel-contract">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button onClick={handleExportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf-contract">
            <FileText className="h-4 w-4" /> PDF
          </Button>
        </div>
      )}

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
                  {data.map((row, idx) => (
                    <TableRow key={idx} data-testid={`row-contract-${idx}`} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      <TableCell className="text-center font-mono">{idx + 1}</TableCell>
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
                      <TableCell className="text-center">{row.numberOfDaysInArrears}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency((row.overdueAmount || 0).toString())}</TableCell>
                      <TableCell>{row.overdueDate ? formatDate(row.overdueDate) : ""}</TableCell>
                      <TableCell>{row.restructured}</TableCell>
                      <TableCell className="text-center">0</TableCell>
                      <TableCell>{row.sector}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
