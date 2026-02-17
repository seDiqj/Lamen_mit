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
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type IndividualRow = {
  contractCode: string;
  customerCode: string;
  individualOrEntity: string;
  firstName: string;
  fatherName: string;
  grandFatherName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationalIdNumber: string;
  passportNumber: string;
  province: string;
  district: string;
  phoneNumber: string;
  homeAddress: string;
  branchName: string;
};

type Branch = { id: string; name: string };
type FundingSource = { id: string; name: string };

export default function IndividualReport() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [branchId, setBranchId] = useState("all");
  const [fundingSourceId, setFundingSourceId] = useState("all");
  const [data, setData] = useState<IndividualRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: branchesData } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: fundingSourcesData } = useQuery<FundingSource[]>({ queryKey: ["/api/funding-sources"] });

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (branchId !== "all") params.append("branchId", branchId);
      if (fundingSourceId !== "all") params.append("fundingSourceId", fundingSourceId);
      const res = await fetch(`/api/reports/individual?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      setData(await res.json());
    } catch (error) {
      console.error("Failed to fetch individual report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBranchName = branchId === "all" ? "All Branches" : branchesData?.find(b => b.id === branchId)?.name || "";

  const handleExportExcel = () => {
    if (!data) return;
    const rows = data.map((row, idx) => ({
      "#": idx + 1,
      "ContractCode": row.contractCode,
      "CustomerCode": row.customerCode,
      "IndividualOrEntity": row.individualOrEntity,
      "FirstName": row.firstName,
      "FatherName": row.fatherName,
      "GrandFatherName": row.grandFatherName,
      "LastName": row.lastName,
      "DateOfBirth": row.dateOfBirth ? formatDate(row.dateOfBirth) : "",
      "Gender": row.gender,
      "MaritalStatus": row.maritalStatus,
      "NationalIDNumber": row.nationalIdNumber,
      "PassportNumber": row.passportNumber,
      "Province": row.province,
      "District": row.district,
      "PhoneNumber": row.phoneNumber,
      "HomeAddress": row.homeAddress,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = Array(17).fill({ wch: 16 });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Individual Report");
    XLSX.writeFile(wb, `Individual_Report_${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Individual Report", 148, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${formatDate(startDate)}    To: ${formatDate(endDate)}`, 148, 22, { align: "center" });
    doc.text(`Branch: ${selectedBranchName}`, 148, 28, { align: "center" });
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 148, 34, { align: "center" });

    const tableData = data.map((row, idx) => [
      idx + 1, row.contractCode, row.customerCode, row.individualOrEntity,
      row.firstName, row.fatherName, row.grandFatherName, row.lastName,
      row.dateOfBirth ? formatDate(row.dateOfBirth) : "", row.gender,
      row.maritalStatus, row.nationalIdNumber, row.passportNumber,
      row.province, row.district, row.phoneNumber, row.homeAddress,
    ]);

    autoTable(doc, {
      startY: 38,
      head: [["#", "ContractCode", "CustomerCode", "Type", "FirstName", "FatherName", "GrandFather", "LastName", "DOB", "Gender", "MaritalStatus", "NationalID", "Passport", "Province", "District", "Phone", "Address"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 5 },
      styles: { fontSize: 5, cellPadding: 1 },
      columnStyles: { 0: { halign: "center", cellWidth: 5 } },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 148, 200, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 200);
    }
    doc.save(`Individual_Report_${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4">
      {data && data.length > 0 && (
        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleExportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel-individual">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button onClick={handleExportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf-individual">
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
                <SelectTrigger className="w-[200px]" data-testid="select-branch"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branchesData?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Funding Source</Label>
              <Select value={fundingSourceId} onValueChange={setFundingSourceId}>
                <SelectTrigger className="w-[200px]" data-testid="select-funding-source"><SelectValue placeholder="Select Source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {fundingSourcesData?.map((fs) => <SelectItem key={fs.id} value={fs.id}>{fs.name}</SelectItem>)}
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
              <CardTitle className="text-lg">Individual Results</CardTitle>
              <span className="text-sm text-muted-foreground" data-testid="text-result-count">
                {data.length} record{data.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 overflow-x-auto">
            {data.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-no-results">No individual records found for the selected criteria.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                    <TableHead className="text-center w-10 text-primary-foreground font-semibold">#</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">ContractCode</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">CustomerCode</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">IndividualOrEntity</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">FirstName</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">FatherName</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">GrandFatherName</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">LastName</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">DateOfBirth</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Gender</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">MaritalStatus</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">NationalIDNumber</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">PassportNumber</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Province</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">District</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">PhoneNumber</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">HomeAddress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} data-testid={`row-individual-${idx}`} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      <TableCell className="text-center font-mono">{idx + 1}</TableCell>
                      <TableCell className="font-mono">{row.contractCode}</TableCell>
                      <TableCell className="font-mono">{row.customerCode}</TableCell>
                      <TableCell>{row.individualOrEntity}</TableCell>
                      <TableCell>{row.firstName}</TableCell>
                      <TableCell>{row.fatherName}</TableCell>
                      <TableCell>{row.grandFatherName}</TableCell>
                      <TableCell>{row.lastName}</TableCell>
                      <TableCell>{row.dateOfBirth ? formatDate(row.dateOfBirth) : ""}</TableCell>
                      <TableCell>{row.gender}</TableCell>
                      <TableCell>{row.maritalStatus}</TableCell>
                      <TableCell className="font-mono">{row.nationalIdNumber}</TableCell>
                      <TableCell>{row.passportNumber}</TableCell>
                      <TableCell>{row.province}</TableCell>
                      <TableCell>{row.district}</TableCell>
                      <TableCell className="font-mono">{row.phoneNumber}</TableCell>
                      <TableCell>{row.homeAddress}</TableCell>
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
