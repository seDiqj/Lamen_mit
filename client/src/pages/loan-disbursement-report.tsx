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
import { FileSpreadsheet, FileText, Banknote } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type DisbursementRow = {
  customerId: string;
  customerName: string;
  applicationId: string;
  officerName: string;
  productName: string;
  branchName: string;
  financingCycle: number;
  financingDurationMonths: number;
  disbursementDate: string;
  province: string;
  district: string;
  disbursedAmount: number;
  principleAmount: number;
  outstandingPortfolio: number;
  delayDays: number;
  phoneNumber: string;
  secondPhoneNumber: string;
};

type Branch = {
  id: string;
  name: string;
};

type FundingSource = {
  id: string;
  name: string;
};

export default function LoanDisbursementReport() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [branchId, setBranchId] = useState("all");
  const [fundingSourceId, setFundingSourceId] = useState("all");
  const [data, setData] = useState<DisbursementRow[] | null>(null);
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
      const res = await fetch(`/api/reports/loan-disbursement?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch disbursement report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBranchName = branchId === "all" ? "All Branches" : branchesData?.find(b => b.id === branchId)?.name || "";

  const handleExportExcel = () => {
    if (!data) return;

    const exportData = data.map((row, idx) => ({
      "Serial": idx + 1,
      "Customer ID": row.customerId || "",
      "Customer Name": row.customerName || "",
      "Application ID": row.applicationId || "",
      "Financing Officer": row.officerName || "",
      "Product": row.productName || "",
      "Branch": row.branchName || "",
      "Cycle": row.financingCycle || "",
      "Financing Months": row.financingDurationMonths || "",
      "Disb. Date": row.disbursementDate ? formatDate(row.disbursementDate) : "",
      "Province": row.province || "",
      "District": row.district || "",
      "Disb Amt": row.disbursedAmount,
      "Principle": row.principleAmount,
      "Outstanding": row.outstandingPortfolio,
      "Delay Days": row.delayDays,
      "Mobile": row.phoneNumber || "",
      "Tel 2": row.secondPhoneNumber || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [
      { wch: 6 }, { wch: 14 }, { wch: 20 }, { wch: 16 }, { wch: 18 },
      { wch: 10 }, { wch: 15 }, { wch: 6 }, { wch: 10 }, { wch: 12 },
      { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
      { wch: 10 }, { wch: 14 }, { wch: 14 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Loan Disbursement Report");

    const dateStr = `${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}`;
    XLSX.writeFile(wb, `Loan_Disbursement_Report_${dateStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Loan Disbursement Report", 148, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${formatDate(startDate)}    To: ${formatDate(endDate)}`, 148, 22, { align: "center" });
    doc.text(`Branch: ${selectedBranchName}`, 148, 28, { align: "center" });

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 148, 34, { align: "center" });

    const tableData = data.map((row, idx) => [
      idx + 1,
      row.customerId || "",
      row.customerName || "",
      row.applicationId || "",
      row.officerName || "",
      row.productName || "",
      row.branchName || "",
      row.financingCycle || "",
      row.financingDurationMonths || "",
      row.disbursementDate ? formatDate(row.disbursementDate) : "",
      row.province || "",
      row.district || "",
      row.disbursedAmount.toLocaleString(),
      row.principleAmount.toLocaleString(),
      row.outstandingPortfolio.toLocaleString(),
      row.delayDays,
      row.phoneNumber || "",
      row.secondPhoneNumber || "",
    ]);

    autoTable(doc, {
      startY: 38,
      head: [["#", "Cust ID", "Customer Name", "App ID", "Officer", "Product", "Branch", "Cycle", "Months", "Disb. Date", "Province", "District", "Disb Amt", "Principle", "Outstanding", "Delay", "Mobile", "Tel 2"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 6 },
      styles: { fontSize: 6, cellPadding: 1.5 },
      columnStyles: {
        0: { halign: "center", cellWidth: 8 },
        12: { halign: "right" },
        13: { halign: "right" },
        14: { halign: "right" },
        15: { halign: "center" },
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
    doc.save(`Loan_Disbursement_Report_${dateStr}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg">
            <Banknote className="h-6 w-6 text-teal-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Loan Disbursement Report</h1>
            <p className="text-muted-foreground text-sm">View disbursed loans by branch and date range</p>
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
                Disbursement Results
              </CardTitle>
              <span className="text-sm text-muted-foreground" data-testid="text-result-count">
                {data.length} record{data.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 overflow-x-auto">
            {data.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-no-results">No disbursements found for the selected criteria.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-12">#</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Financing Officer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-center">Cycle</TableHead>
                    <TableHead className="text-center">Months</TableHead>
                    <TableHead>Disb. Date</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead className="text-right">Disb Amt</TableHead>
                    <TableHead className="text-right">Principle</TableHead>
                    <TableHead className="text-right">Outstanding</TableHead>
                    <TableHead className="text-center">Delay Days</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Tel 2</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} data-testid={`row-disbursement-${idx}`}>
                      <TableCell className="text-center font-mono">{idx + 1}</TableCell>
                      <TableCell className="font-mono" data-testid={`text-customer-id-${idx}`}>{row.customerId}</TableCell>
                      <TableCell data-testid={`text-customer-name-${idx}`}>{row.customerName}</TableCell>
                      <TableCell className="font-mono">{row.applicationId}</TableCell>
                      <TableCell>{row.officerName}</TableCell>
                      <TableCell>{row.productName}</TableCell>
                      <TableCell>{row.branchName}</TableCell>
                      <TableCell className="text-center">{row.financingCycle}</TableCell>
                      <TableCell className="text-center">{row.financingDurationMonths}</TableCell>
                      <TableCell>{row.disbursementDate ? formatDate(row.disbursementDate) : ""}</TableCell>
                      <TableCell>{row.province}</TableCell>
                      <TableCell>{row.district}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(row.disbursedAmount.toString())}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(row.principleAmount.toString())}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(row.outstandingPortfolio.toString())}</TableCell>
                      <TableCell className={`text-center font-mono ${row.delayDays > 0 ? "text-red-600 font-semibold" : ""}`}>{row.delayDays}</TableCell>
                      <TableCell>{row.phoneNumber}</TableCell>
                      <TableCell>{row.secondPhoneNumber}</TableCell>
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
