import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COLUMNS = [
  "User Name",
  "User ID",
  "Department",
  "User Role",
  "User creation date",
  "User Status",
];

type UserRow = Record<string, string>;

export default function SystemUserListReport() {
  const [data, setData] = useState<UserRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reports/system-user-list", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      setData(await res.json());
    } catch (error) {
      console.error("Failed to fetch system user list report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!data) return;
    const rows = data.map((row) => {
      const obj: Record<string, any> = {};
      for (const col of COLUMNS) {
        obj[col] = row[col] ?? "";
      }
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = COLUMNS.map(() => ({ wch: 22 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "System User List");
    XLSX.writeFile(wb, `System_User_List_${new Date().toISOString().split("T")[0].replace(/-/g, "")}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("System User List", 148, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 148, 22, { align: "center" });

    const tableData = data.map((row) => [
      ...COLUMNS.map((col) => String(row[col] ?? "")),
    ]);

    autoTable(doc, {
      startY: 28,
      head: [COLUMNS],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [34, 87, 122],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        fontSize: 8,
      },
      styles: { fontSize: 8, cellPadding: 2 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 148, 200, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 200);
    }
    doc.save(`System_User_List_${new Date().toISOString().split("T")[0].replace(/-/g, "")}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4">
      {data && data.length > 0 && (
        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleExportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel-user-list">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button onClick={handleExportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf-user-list">
            <FileText className="h-4 w-4" /> PDF
          </Button>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">System User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 flex-wrap">
            <Button onClick={fetchReport} disabled={isLoading} data-testid="button-generate-user-list">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg">User List Results</CardTitle>
              <span className="text-sm text-muted-foreground" data-testid="text-user-list-count">
                {data.length} user{data.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 overflow-x-auto">
            {data.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-no-users">No users found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]">
                    {COLUMNS.map((col) => (
                      <TableHead key={col} className="text-primary-foreground font-semibold whitespace-nowrap">{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} data-testid={`row-user-${idx}`} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      {COLUMNS.map((col) => (
                        <TableCell key={col} className="whitespace-nowrap">{String(row[col] ?? "")}</TableCell>
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
