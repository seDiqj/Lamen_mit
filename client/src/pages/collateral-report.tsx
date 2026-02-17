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

type CollateralRow = {
  contractCode: string;
  collateralCode: string;
  collateralType: string;
  collateralDescription: string;
  collateralValue: number;
  collateralCurrency: string;
  valuationDate: string;
  branchName: string;
  ownerName: string;
};

type Branch = {
  id: string;
  name: string;
};

type FundingSource = {
  id: string;
  name: string;
};

export default function CollateralReport() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [branchId, setBranchId] = useState("all");
  const [fundingSourceId, setFundingSourceId] = useState("all");
  const [data, setData] = useState<CollateralRow[] | null>(null);
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
      const res = await fetch(`/api/reports/collateral?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch collateral report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBranchName = branchId === "all" ? "All Branches" : branchesData?.find(b => b.id === branchId)?.name || "";

  const handleExportExcel = () => {
    if (!data) return;

    const rows = data.map((row, idx) => ({
      "#": idx + 1,
      "ContractCode": row.contractCode || "",
      "CollateralCode": row.collateralCode || "",
      "CollateralType": row.collateralType || "",
      "Collateral Description": row.collateralDescription || "",
      "Collateral Value": row.collateralValue,
      "Currency": row.collateralCurrency || "",
      "Valuation Date": row.valuationDate ? formatDate(row.valuationDate) : "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 6 }, { wch: 18 }, { wch: 18 }, { wch: 16 },
      { wch: 22 }, { wch: 16 }, { wch: 10 }, { wch: 14 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Collateral Report");

    const dateStr = `${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}`;
    XLSX.writeFile(wb, `Collateral_Report_${dateStr}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Collateral Report", 148, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${formatDate(startDate)}    To: ${formatDate(endDate)}`, 148, 22, { align: "center" });
    doc.text(`Branch: ${selectedBranchName}`, 148, 28, { align: "center" });

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 148, 34, { align: "center" });

    const tableData = data.map((row, idx) => [
      idx + 1,
      row.contractCode || "",
      row.collateralCode || "",
      row.collateralType || "",
      row.collateralDescription || "",
      row.collateralValue.toLocaleString(),
      row.collateralCurrency || "",
      row.valuationDate ? formatDate(row.valuationDate) : "",
    ]);

    autoTable(doc, {
      startY: 38,
      head: [["#", "ContractCode", "CollateralCode", "CollateralType", "Description", "Value", "Currency", "Valuation Date"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 7 },
      styles: { fontSize: 7, cellPadding: 1.5 },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        5: { halign: "right" },
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
    doc.save(`Collateral_Report_${dateStr}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4">
      {data && data.length > 0 && (
        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleExportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel-collateral">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button onClick={handleExportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf-collateral">
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
                Collateral Results
              </CardTitle>
              <span className="text-sm text-muted-foreground" data-testid="text-result-count">
                {data.length} record{data.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 overflow-x-auto">
            {data.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-no-results">No collateral records found for the selected criteria.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                    <TableHead className="text-center w-12 text-primary-foreground font-semibold">#</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">ContractCode</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">CollateralCode</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">CollateralType</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Collateral Description</TableHead>
                    <TableHead className="text-right text-primary-foreground font-semibold">Collateral Value</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Currency</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Valuation Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} data-testid={`row-collateral-${idx}`} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      <TableCell className="text-center font-mono">{idx + 1}</TableCell>
                      <TableCell className="font-mono">{row.contractCode}</TableCell>
                      <TableCell className="font-mono">{row.collateralCode}</TableCell>
                      <TableCell>{row.collateralType}</TableCell>
                      <TableCell>{row.collateralDescription}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(row.collateralValue.toString())}</TableCell>
                      <TableCell>{row.collateralCurrency}</TableCell>
                      <TableCell>{row.valuationDate ? formatDate(row.valuationDate) : ""}</TableCell>
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
