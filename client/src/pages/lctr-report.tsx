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

function formatDisbursementDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatDobDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[d.getMonth()]} ${d.getDate()},${d.getFullYear()}`;
}

const LCTR_HEADERS = [
  "Branch",
  "CustomerName",
  "LastName",
  "FatherFirstName",
  "F/LastName",
  "CustomerNID#",
  "Dob",
  "CustomerAddressStreet",
  "District",
  "Village",
  "Province",
  "Phone",
  "Principle",
  "DisbursementDate",
] as const;

type LctrRow = Record<string, string | number>;
type Branch = { id: string; name: string };
type FundingSource = { id: string; name: string };

export default function LctrReport() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [branchId, setBranchId] = useState("all");
  const [fundingSourceId, setFundingSourceId] = useState("all");
  const [data, setData] = useState<LctrRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: branchesData } = useQuery<Branch[]>({ queryKey: ["/api/branches"] });
  const { data: fundingSourcesData } = useQuery<FundingSource[]>({ queryKey: ["/api/funding-sources"] });

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (branchId !== "all") params.append("branchId", branchId);
      if (fundingSourceId !== "all") params.append("fundingSourceId", fundingSourceId);
      const res = await fetch(`/api/reports/lctr?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      setData(await res.json());
    } catch (error) {
      console.error("Failed to fetch LCTR report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBranchName = branchId === "all" ? "All Branches" : branchesData?.find(b => b.id === branchId)?.name || "";

  const handleExportExcel = () => {
    if (!data) return;
    const rows = data.map((row, idx) => {
      const obj: Record<string, any> = { "#": idx + 1 };
      for (const col of LCTR_HEADERS) {
        const val = row[col] ?? "";
        if (col === "DisbursementDate") obj[col] = formatDisbursementDate(String(val));
        else if (col === "Dob") obj[col] = formatDobDate(String(val));
        else obj[col] = val;
      }
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 6 }, { wch: 16 }, { wch: 16 }, { wch: 16 },
      { wch: 16 }, { wch: 16 }, { wch: 22 },
      { wch: 14 }, { wch: 30 }, { wch: 18 },
      { wch: 16 }, { wch: 16 }, { wch: 16 },
      { wch: 16 }, { wch: 16 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "LCTR Report");
    XLSX.writeFile(wb, `LCTR_Report_${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly LCTR Report for Da Afghanistan Bank", 148, 12, { align: "center" });
    doc.setFontSize(10);
    doc.text("(from 200,000 AFN up to 1,500,000 AFN)", 148, 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.text(`From: ${formatDate(startDate)}    To: ${formatDate(endDate)}`, 148, 25, { align: "center" });
    doc.text(`Branch: ${selectedBranchName}`, 148, 31, { align: "center" });

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 148, 37, { align: "center" });

    const tableData = data.map((row, idx) => [
      idx + 1,
      ...LCTR_HEADERS.map(h => {
        const val = row[h];
        if (h === "Principle" && typeof val === "number") return val.toLocaleString();
        if (h === "DisbursementDate") return formatDisbursementDate(String(val ?? ""));
        if (h === "Dob") return formatDobDate(String(val ?? ""));
        return String(val ?? "");
      }),
    ]);

    autoTable(doc, {
      startY: 41,
      head: [["#", ...LCTR_HEADERS]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 6 },
      styles: { fontSize: 6, cellPadding: 1 },
      columnStyles: {
        0: { halign: "center", cellWidth: 7 },
        12: { halign: "right" },
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
    doc.save(`LCTR_Report_${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 rounded-lg">
          <FileText className="h-6 w-6 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Monthly LCTR Report</h1>
          <p className="text-muted-foreground text-sm">Da Afghanistan Bank - Large Currency Transaction Report (200,000 AFN to 1,500,000 AFN)</p>
        </div>
      </div>

      {data && data.length > 0 && (
        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleExportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel-lctr">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button onClick={handleExportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf-lctr">
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
                  {branchesData?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Funding Source</Label>
              <Select value={fundingSourceId} onValueChange={setFundingSourceId}>
                <SelectTrigger className="w-[200px]" data-testid="select-funding-source">
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
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
            <Button onClick={fetchReport} disabled={isLoading} className="bg-green-600 text-white" data-testid="button-generate">
              {isLoading ? "Loading..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg">LCTR Results</CardTitle>
              <span className="text-sm text-muted-foreground" data-testid="text-result-count">
                {data.length} record{data.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 overflow-x-auto">
            {data.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-no-results">No LCTR records found for the selected criteria.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                    <TableHead className="text-center w-10 text-primary-foreground font-semibold">#</TableHead>
                    {LCTR_HEADERS.map((h) => (
                      <TableHead key={h} className={`text-primary-foreground font-semibold whitespace-nowrap ${h === "Principle" ? "text-right" : ""}`}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} data-testid={`row-lctr-${idx}`} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      <TableCell className="text-center font-mono">{idx + 1}</TableCell>
                      {LCTR_HEADERS.map((h) => {
                        const val = row[h];
                        return (
                          <TableCell key={h} className={`whitespace-nowrap ${h === "Principle" ? "text-right font-mono" : ""}`}>
                            {h === "Principle" && typeof val === "number" ? formatCurrency(val.toString()) : h === "DisbursementDate" ? formatDisbursementDate(String(val ?? "")) : h === "Dob" ? formatDobDate(String(val ?? "")) : String(val ?? "")}
                          </TableCell>
                        );
                      })}
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
