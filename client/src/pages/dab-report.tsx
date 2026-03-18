import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSpreadsheet, Download, Building2, TrendingUp, Banknote } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ProfitLossStatementReport from "./profit-loss-statement-report";
import CashFlowStatementReport from "./cash-flow-statement-report";

type NoteLine = {
  code: string;
  item: string;
  amount: number;
  source?: string;
  sourceDetail?: string;
  customers?: number;
  isTotal?: boolean;
};

type Note = {
  noteNumber: number;
  title: string;
  lines: NoteLine[];
};

type DABNotesData = {
  header: {
    title: string;
    subtitle: string;
    section: string;
    reportName: string;
    currency: string;
    frequency: string;
  };
  notes: Note[];
};

function NotesToFinancialStatements() {
  const { data, isLoading, error } = useQuery<DABNotesData>({
    queryKey: ["/api/reports/dab-notes-financial-statements"],
  });

  const exportExcel = () => {
    if (!data) return;

    const rows: any[][] = [];
    rows.push([data.header.title]);
    rows.push([data.header.subtitle]);
    rows.push([data.header.section]);
    rows.push([]);
    rows.push([data.header.reportName]);
    rows.push([]);
    rows.push(["", "Currency", data.header.currency]);
    rows.push(["", "Frequency", data.header.frequency]);
    rows.push([]);
    rows.push(["Line Code", "Items", "Amount", "Source of Data"]);

    data.notes.forEach((note) => {
      rows.push([]);
      rows.push([note.noteNumber, note.title]);
      note.lines.forEach((line) => {
        rows.push([
          line.code,
          line.item,
          line.amount,
          line.sourceDetail || line.source || "",
        ]);
      });
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notes to Financial Statements");
    XLSX.writeFile(wb, "dab_notes_to_financial_statements.xlsx");
  };

  const exportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "portrait" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(data.header.title, 105, 12, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(data.header.subtitle, 105, 18, { align: "center" });
    doc.text(data.header.section, 105, 23, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(data.header.reportName, 105, 30, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Currency: ${data.header.currency}  |  Frequency: ${data.header.frequency}`, 105, 36, { align: "center" });

    let startY = 42;

    data.notes.forEach((note) => {
      const rows: any[][] = [];
      note.lines.forEach((line) => {
        rows.push([
          line.code,
          line.item,
          formatCurrency(line.amount),
          line.sourceDetail || line.source || "",
        ]);
      });

      autoTable(doc, {
        head: [[{ content: note.title, colSpan: 4, styles: { halign: "left", fillColor: [34, 120, 74], textColor: 255, fontStyle: "bold" } }]],
        body: rows,
        startY,
        styles: { fontSize: 7, cellPadding: 1.5 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 75 },
          2: { cellWidth: 35, halign: "right" },
          3: { cellWidth: 60 },
        },
        didParseCell: (hookData: any) => {
          if (hookData.section === "body") {
            const lineData = note.lines[hookData.row.index];
            if (lineData?.isTotal) {
              hookData.cell.styles.fontStyle = "bold";
              hookData.cell.styles.fillColor = [240, 240, 240];
            }
          }
        },
      });

      startY = (doc as any).lastAutoTable.finalY + 4;

      if (startY > 260) {
        doc.addPage();
        startY = 15;
      }
    });

    doc.save("dab_notes_to_financial_statements.pdf");
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground" data-testid="text-error">Failed to load report data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="destructive" size="sm" onClick={exportExcel} data-testid="button-export-excel-notes">
          <FileSpreadsheet className="h-4 w-4 mr-1" />
          Excel
        </Button>
        <Button size="sm" onClick={exportPDF} data-testid="button-export-pdf-notes">
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <h3 className="text-base font-bold" data-testid="text-dab-title">{data.header.title}</h3>
            <p className="text-xs text-muted-foreground">{data.header.subtitle}</p>
            <p className="text-xs text-muted-foreground">{data.header.section}</p>
            <p className="text-sm font-semibold mt-2">{data.header.reportName}</p>
          </div>

          <Table className="mb-4">
            <TableBody>
              <TableRow>
                <TableCell className="text-center font-semibold text-xs py-1.5 w-1/2 border">MFI Name</TableCell>
                <TableCell className="text-xs py-1.5 border" data-testid="text-mfi-name">Lamen Micro Finance Institution</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center font-semibold text-xs py-1.5 border">License Number</TableCell>
                <TableCell className="text-xs py-1.5 border" data-testid="text-license-number">97950</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center font-semibold text-xs py-1.5 border">Date/Period</TableCell>
                <TableCell className="text-xs py-1.5 border" data-testid="text-date-period">
                  {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center font-semibold text-xs py-1.5 border">Currency</TableCell>
                <TableCell className="text-xs py-1.5 border" data-testid="text-currency">{data.header.currency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center font-semibold text-xs py-1.5 border">Frequency</TableCell>
                <TableCell className="text-xs py-1.5 border" data-testid="text-frequency">{data.header.frequency}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="space-y-4">
            {data.notes.map((note) => (
              <div key={note.noteNumber} data-testid={`note-section-${note.noteNumber}`}>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-700">
                      <TableHead colSpan={4} className="text-white font-bold text-xs py-1.5">
                        {note.title}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-16 text-xs">Code</TableHead>
                      <TableHead className="text-xs">Items</TableHead>
                      <TableHead className="text-right text-xs w-32">Amount</TableHead>
                      <TableHead className="text-xs w-48">Source of Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {note.lines.map((line) => (
                      <TableRow
                        key={line.code}
                        className={line.isTotal ? "bg-muted font-bold" : ""}
                        data-testid={`row-note-${line.code}`}
                      >
                        <TableCell className="text-xs py-1.5">{line.code}</TableCell>
                        <TableCell className="text-xs py-1.5">{line.item}</TableCell>
                        <TableCell className="text-right text-xs py-1.5">{formatCurrency(line.amount)}</TableCell>
                        <TableCell className="text-xs py-1.5 text-muted-foreground">{line.sourceDetail || line.source || ""}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DABReportPage() {
  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="h-5 w-5 text-green-700" />
          <h1 className="text-xl font-bold" data-testid="text-page-title">DAB Report</h1>
        </div>
        <p className="text-sm text-muted-foreground">Da Afghanistan Bank regulatory reporting</p>
      </div>

      <Tabs defaultValue="notes-to-financial-statements" data-testid="tabs-dab-report">
        <TabsList>
          <TabsTrigger value="notes-to-financial-statements" data-testid="tab-notes-financial">
            Notes to Financial Statements
          </TabsTrigger>
          <TabsTrigger value="profit-loss" className="gap-1" data-testid="tab-profit-loss">
            <TrendingUp className="h-3.5 w-3.5" />
            Profit & Loss
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="gap-1" data-testid="tab-cash-flow">
            <Banknote className="h-3.5 w-3.5" />
            Cash Flow
          </TabsTrigger>
        </TabsList>
        <TabsContent value="notes-to-financial-statements">
          <NotesToFinancialStatements />
        </TabsContent>
        <TabsContent value="profit-loss">
          <ProfitLossStatementReport />
        </TabsContent>
        <TabsContent value="cash-flow">
          <CashFlowStatementReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
