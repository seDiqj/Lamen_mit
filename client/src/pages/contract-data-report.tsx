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

const DAB_HEADERS = [
  "ContractCode",
  "Branch",
  "PhaseOfContract",
  "ContractStatus",
  "TypeOfContract",
  "PurposeOfFinancing",
  "InterestRate",
  "CurrencyOfContract",
  "TotalAmount.Value",
  "TotalAmount.Currency",
  "TotalTakenAmount.Value",
  "TotalTakenAmount.Currency",
  "InstallmentAmount.Value",
  "InstallmentAmount.Currency",
  "OutstandingAmount.Value",
  "OutstandingAmount.Currency",
  "PastDueAmount.Value",
  "PastDueAmount.Currency",
  "PastDueDays",
  "NumberOfDueInstallments",
  "DateOfLastPayment",
  "TotalMonthlyPayment.Value",
  "TotalMonthlyPayment.Currency",
  "PaymentPeriodicity",
  "CreditUsageInLast30Days.Value",
  "CreditUsageInLast30Days.Currency",
  "StartDate",
  "ExpectedEndDate",
  "RealEndDate",
  "NegativeStatusOfContract",
];

function mapRow(row: ContractDataRow) {
  const ccy = row.currency || "AFN";
  return {
    "ContractCode": row.applicationId || "",
    "Branch": row.branchName || "",
    "PhaseOfContract": row.loanStatus === "disbursed" ? "Active" : row.loanStatus === "closed" ? "Closed" : row.loanStatus || "",
    "ContractStatus": row.loanStatus || "",
    "TypeOfContract": row.productName || "",
    "PurposeOfFinancing": row.sector || "",
    "InterestRate": row.marginRate || 0,
    "CurrencyOfContract": ccy,
    "TotalAmount.Value": row.totalReceivable || 0,
    "TotalAmount.Currency": ccy,
    "TotalTakenAmount.Value": row.totalAmountDisbursed || 0,
    "TotalTakenAmount.Currency": ccy,
    "InstallmentAmount.Value": row.installmentAmount || 0,
    "InstallmentAmount.Currency": ccy,
    "OutstandingAmount.Value": row.principalOutstanding || 0,
    "OutstandingAmount.Currency": ccy,
    "PastDueAmount.Value": row.overdueAmount || 0,
    "PastDueAmount.Currency": ccy,
    "PastDueDays": row.numberOfDaysInArrears || 0,
    "NumberOfDueInstallments": row.outstandingInstallments || 0,
    "DateOfLastPayment": row.lastPaymentDate ? formatDate(row.lastPaymentDate) : "",
    "TotalMonthlyPayment.Value": row.installmentAmount || 0,
    "TotalMonthlyPayment.Currency": ccy,
    "PaymentPeriodicity": row.paymentFrequency || "Monthly",
    "CreditUsageInLast30Days.Value": 0,
    "CreditUsageInLast30Days.Currency": ccy,
    "StartDate": row.disbursementDate ? formatDate(row.disbursementDate) : row.requestDate ? formatDate(row.requestDate) : "",
    "ExpectedEndDate": row.maturityDate ? formatDate(row.maturityDate) : "",
    "RealEndDate": row.loanStatus === "closed" ? (row.lastPaymentDate ? formatDate(row.lastPaymentDate) : "") : "",
    "NegativeStatusOfContract": row.restructured || "",
  };
}

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

    const rows = data.map((row) => {
      return mapRow(row);
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const colWidths: { wch: number }[] = [];
    DAB_HEADERS.forEach(() => colWidths.push({ wch: 22 }));
    ws["!cols"] = colWidths;

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

    const tableData = data.map((row) => {
      const mapped = mapRow(row);
      return DAB_HEADERS.map(h => {
        const val = mapped[h as keyof typeof mapped];
        if (typeof val === "number") return val.toLocaleString();
        return val;
      });
    });

    autoTable(doc, {
      startY: 38,
      head: [DAB_HEADERS],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 4 },
      styles: { fontSize: 4, cellPadding: 0.8 },
      columnStyles: {
        6: { halign: "center" },
        8: { halign: "right" },
        10: { halign: "right" },
        12: { halign: "right" },
        14: { halign: "right" },
        16: { halign: "right" },
        21: { halign: "right" },
        24: { halign: "right" },
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
                    {DAB_HEADERS.map((h) => (
                      <TableHead key={h} className={`text-primary-foreground font-semibold whitespace-nowrap ${h.includes("Value") ? "text-right" : ""}`}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => {
                    const mapped = mapRow(row);
                    return (
                      <TableRow key={idx} data-testid={`row-contract-${idx}`} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                        {DAB_HEADERS.map((h) => {
                          const val = mapped[h as keyof typeof mapped];
                          const isNumeric = h.includes("Value") || h === "InterestRate" || h === "PastDueDays" || h === "NumberOfDueInstallments";
                          return (
                            <TableCell key={h} className={`whitespace-nowrap ${isNumeric ? "text-right font-mono" : ""}`}>
                              {typeof val === "number" ? (h === "InterestRate" || h === "PastDueDays" || h === "NumberOfDueInstallments" ? val : formatCurrency(val.toString())) : val}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
