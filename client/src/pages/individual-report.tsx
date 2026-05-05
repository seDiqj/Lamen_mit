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

const DAB_COLUMNS = [
  "ContractCode",
  "CustomerCode",
  "PresentSurname",
  "BirthSurname",
  "FirstName",
  "FirstNameLocal",
  "MiddleNames",
  "MiddleNamesLocal",
  "FullName",
  "FullNameLocal",
  "Alias",
  "FathersName",
  "FathersNameLocal",
  "ClassificationOfIndividual",
  "Gender",
  "DateOfBirth",
  "CountryOfBirth",
  "MaritalStatus",
  "FateStatus",
  "SocialStatus",
  "Residency",
  "Citizenship",
  "Employment",
  "Education",
  "BusinessName",
  "IncomeAvailable.Value",
  "IncomeAvailable.Currency",
  "MonthlyExpenses.Value",
  "MonthlyExpenses.Currency",
  "NegativeStatusOfIndividual",
  "IdentificationNumbers.TaxNumber",
  "IdentificationNumbers.TazkiraNumberNew",
  "IdentificationNumbers.PassportIssuerCountry",
  "IdentificationNumbers.DrivingLicenseNumber",
  "IdentificationNumbers.TazkiraNumber",
  "IdentificationNumbers.LabourCard",
  "IdentificationNumbers.BusinessLicense",
  "IdentificationNumbers.BusinessLicenseExpirationDate",
  "MainAddress.Street",
  "MainAddress.NumberOfBuilding",
  "MainAddress.City",
  "MainAddress.PostalCode",
  "MainAddress.Province",
  "MainAddress.District",
  "MainAddress.Country",
  "MainAddress.AddressLine",
  "SecondaryAddress.Street",
  "SecondaryAddress.NumberOfBuilding",
  "SecondaryAddress.City",
  "SecondaryAddress.PostalCodeLookup",
  "SecondaryAddress.Province",
  "SecondaryAddress.District",
  "SecondaryAddress.Country",
  "SecondaryAddress.AddressLine",
  "Contacts.MobilePhone",
  "Contacts.FixedLine",
  "Contacts.WebPage",
  "Contacts.Fax",
] as const;

type IndividualRow = Record<string, string | number>;

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
  const [amountFilter, setAmountFilter] = useState("all");
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
      if (amountFilter !== "all") params.append("amountFilter", amountFilter);
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
    const rows = data.map((row) => {
      const obj: Record<string, any> = {};
      for (const col of DAB_COLUMNS) {
        obj[col] = row[col] ?? "";
      }
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = DAB_COLUMNS.map(() => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Individual Report");
    XLSX.writeFile(wb, `Individual_Report_${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Individual Report", 210, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${formatDate(startDate)}    To: ${formatDate(endDate)}`, 210, 22, { align: "center" });
    doc.text(`Branch: ${selectedBranchName}`, 210, 28, { align: "center" });
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 210, 34, { align: "center" });

    const tableData = data.map((row) => {
      return DAB_COLUMNS.map(col => String(row[col] ?? ""));
    });

    autoTable(doc, {
      startY: 38,
      head: [DAB_COLUMNS],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 3 },
      styles: { fontSize: 3, cellPadding: 0.5 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 210, 290, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 290);
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
              <Label>Loan Amount</Label>
              <Select value={amountFilter} onValueChange={setAmountFilter}>
                <SelectTrigger className="w-[200px]" data-testid="select-amount-filter">
                  <SelectValue placeholder="Select Amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="below500k">&lt; 500K</SelectItem>
                  <SelectItem value="above500k">&gt;= 500K</SelectItem>
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
                    {DAB_COLUMNS.map((col) => (
                      <TableHead key={col} className="text-primary-foreground font-semibold whitespace-nowrap text-xs">{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} data-testid={`row-individual-${idx}`} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      {DAB_COLUMNS.map((col) => (
                        <TableCell key={col} className="whitespace-nowrap text-xs">
                          {String(row[col] ?? "")}
                        </TableCell>
                      ))}
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
