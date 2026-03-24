import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { FileSpreadsheet, Download, Building2, TrendingUp, Banknote, Landmark, Scale } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ProfitLossStatementReport from "./profit-loss-statement-report";
import CashFlowStatementReport from "./cash-flow-statement-report";
import FinancialPositionReport from "./financial-position-report";

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

function NotesToFinancialStatements({ asOfDate }: { asOfDate: string }) {
  const [data, setData] = useState<DABNotesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ asOfDate });
      const res = await fetch(`/api/reports/dab-notes-financial-statements?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [asOfDate]);

  const getDateLabel = () => {
    const d = new Date(asOfDate + "T00:00:00");
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const exportExcel = () => {
    if (!data) return;

    const rows: any[][] = [];
    rows.push([data.header.title]);
    rows.push([data.header.subtitle]);
    rows.push([data.header.section]);
    rows.push([]);
    rows.push([data.header.reportName]);
    rows.push([]);
    rows.push(["", "MFI Name", "Lamen Micro Finance Institution"]);
    rows.push(["", "License Number", "97950"]);
    rows.push(["", "Date/Period", getDateLabel()]);
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
    doc.text(`MFI Name: Lamen Micro Finance Institution  |  License: 97950  |  Date: ${getDateLabel()}`, 105, 36, { align: "center" });
    doc.text(`Currency: ${data.header.currency}  |  Frequency: ${data.header.frequency}`, 105, 41, { align: "center" });

    let startY = 47;

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

  if (isLoading && !data) {
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
                  {getDateLabel()}
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

type EquityLine = {
  lineCode: number;
  particular: string;
  shareCapital: number | null;
  retainedEarnings: number | null;
  revaluationReserve: number | null;
  totalEquity: number;
  inCell?: string;
  source?: string;
  isTotal?: boolean;
};

function ChangesInEquityReport({ asOfDate }: { asOfDate: string }) {
  const [data, setData] = useState<{ lines: EquityLine[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ asOfDate });
      const res = await fetch(`/api/reports/changes-in-equity?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch changes in equity:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [asOfDate]);

  const getDateLabel = () => {
    const d = new Date(asOfDate + "T00:00:00");
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const fmtVal = (val: number | null) => {
    if (val === null) return "";
    return formatCurrency(val.toFixed(2));
  };

  const exportExcel = () => {
    if (!data) return;
    const rows: any[][] = [];
    rows.push(["Da Afghanistan Bank"]);
    rows.push(["Non-Banking Financial Institutions Supervision Directorate General"]);
    rows.push(["Follow up and Offsite Supervision Section"]);
    rows.push([]);
    rows.push(["Statement of Changes in Equity"]);
    rows.push([]);
    rows.push(["", "MFI Name", "", "Lamen Micro Finance Institution"]);
    rows.push(["", "License Number", "", "97950"]);
    rows.push(["", "Date/Period", "", getDateLabel()]);
    rows.push(["", "Currency", "", "Afghani"]);
    rows.push(["", "Frequency", "", "Monthly"]);
    rows.push([]);
    rows.push(["Line Code", "Particulars", "Share Capital", "Retained Earnings", "Revaluation Reserve", "Total Equity", "in Cell", "Source"]);

    data.lines.forEach((line) => {
      rows.push([
        line.lineCode,
        line.particular,
        line.shareCapital,
        line.retainedEarnings,
        line.revaluationReserve,
        line.totalEquity,
        line.inCell || "",
        line.source || "",
      ]);
    });

    rows.push([]);
    rows.push([]);
    rows.push(["", "Head of Finance", "Head of Compliance"]);
    rows.push([]);
    rows.push(["", "Name", "Name"]);
    rows.push(["", "Signature and Date", "Signature and Date"]);
    rows.push([]);
    rows.push([]);
    rows.push(["", "Stamp of the Company"]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Changes in Equity");
    XLSX.writeFile(wb, "dab_changes_in_equity.xlsx");
  };

  const exportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Da Afghanistan Bank", 148, 12, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Non-Banking Financial Institutions Supervision Directorate General", 148, 18, { align: "center" });
    doc.text("Follow up and Offsite Supervision Section", 148, 23, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Statement of Changes in Equity", 148, 32, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`MFI Name: Lamen Micro Finance Institution  |  License: 97950  |  Date: ${getDateLabel()}`, 148, 40, { align: "center" });
    doc.text(`Currency: Afghani  |  Frequency: Monthly`, 148, 45, { align: "center" });

    const tableData = data.lines.map(line => [
      line.lineCode,
      line.particular,
      line.shareCapital !== null ? formatCurrency(line.shareCapital.toFixed(2)) : "",
      line.retainedEarnings !== null ? formatCurrency(line.retainedEarnings.toFixed(2)) : "",
      line.revaluationReserve !== null ? formatCurrency(line.revaluationReserve.toFixed(2)) : "",
      formatCurrency(line.totalEquity.toFixed(2)),
      line.inCell || "",
      line.source || "",
    ]);

    autoTable(doc, {
      startY: 52,
      head: [["Line Code", "Particulars", "Share Capital", "Retained Earnings", "Revaluation Reserve", "Total Equity", "in Cell", "Source"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 120, 74], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 7 },
      styles: { fontSize: 7, cellPadding: 1.5 },
      columnStyles: {
        0: { cellWidth: 14, halign: "center" },
        1: { cellWidth: 55 },
        2: { cellWidth: 28, halign: "right" },
        3: { cellWidth: 28, halign: "right" },
        4: { cellWidth: 28, halign: "right" },
        5: { cellWidth: 28, halign: "right" },
        6: { cellWidth: 30 },
        7: { cellWidth: 50 },
      },
      didParseCell: (hookData: any) => {
        if (hookData.section === "body") {
          const lineData = data.lines[hookData.row.index];
          if (lineData?.isTotal) {
            hookData.cell.styles.fontStyle = "bold";
            hookData.cell.styles.fillColor = [240, 240, 240];
          }
        }
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(8);
    doc.text("Head of Finance", 60, finalY);
    doc.text("Head of Compliance", 180, finalY);
    doc.text("Name", 60, finalY + 10);
    doc.text("Name", 180, finalY + 10);
    doc.text("Signature and Date", 60, finalY + 16);
    doc.text("Signature and Date", 180, finalY + 16);
    doc.text("Stamp of the Company", 120, finalY + 30);

    doc.save("dab_changes_in_equity.pdf");
  };

  if (isLoading && !data) {
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
          <p className="text-muted-foreground" data-testid="text-error-equity">Failed to load report data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="destructive" size="sm" onClick={exportExcel} data-testid="button-export-excel-equity">
          <FileSpreadsheet className="h-4 w-4 mr-1" />
          Excel
        </Button>
        <Button size="sm" onClick={exportPDF} data-testid="button-export-pdf-equity">
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <h3 className="text-base font-bold" data-testid="text-equity-title">Da Afghanistan Bank</h3>
            <p className="text-xs text-muted-foreground">Non-Banking Financial Institutions Supervision Directorate General</p>
            <p className="text-xs text-muted-foreground">Follow up and Offsite Supervision Section</p>
            <p className="text-sm font-semibold mt-2">Statement of Changes in Equity</p>
          </div>

          <Table className="mb-4">
            <TableBody>
              <TableRow>
                <TableCell className="text-center font-semibold text-xs py-1.5 w-1/2 border">MFI Name</TableCell>
                <TableCell className="text-xs py-1.5 border">Lamen Micro Finance Institution</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center font-semibold text-xs py-1.5 border">License Number</TableCell>
                <TableCell className="text-xs py-1.5 border">97950</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center font-semibold text-xs py-1.5 border">Date/Period</TableCell>
                <TableCell className="text-xs py-1.5 border">{getDateLabel()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center font-semibold text-xs py-1.5 border">Currency</TableCell>
                <TableCell className="text-xs py-1.5 border">Afghani</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center font-semibold text-xs py-1.5 border">Frequency</TableCell>
                <TableCell className="text-xs py-1.5 border">Monthly</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableHeader>
              <TableRow className="bg-green-700">
                <TableHead className="text-white font-bold text-xs py-1.5 w-14">Line Code</TableHead>
                <TableHead className="text-white font-bold text-xs py-1.5">Particulars</TableHead>
                <TableHead className="text-white font-bold text-xs py-1.5 text-right w-28">Share Capital</TableHead>
                <TableHead className="text-white font-bold text-xs py-1.5 text-right w-28">Retained Earnings</TableHead>
                <TableHead className="text-white font-bold text-xs py-1.5 text-right w-28">Revaluation Reserve</TableHead>
                <TableHead className="text-white font-bold text-xs py-1.5 text-right w-28">Total Equity</TableHead>
                <TableHead className="text-white font-bold text-xs py-1.5 w-28">in Cell</TableHead>
                <TableHead className="text-white font-bold text-xs py-1.5 w-40">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.lines.map((line) => (
                <TableRow
                  key={line.lineCode}
                  className={line.isTotal ? "bg-muted font-bold" : ""}
                  data-testid={`row-equity-${line.lineCode}`}
                >
                  <TableCell className="text-xs py-1.5 text-center">{line.lineCode}</TableCell>
                  <TableCell className="text-xs py-1.5">{line.particular}</TableCell>
                  <TableCell className="text-xs py-1.5 text-right">{fmtVal(line.shareCapital)}</TableCell>
                  <TableCell className="text-xs py-1.5 text-right">{fmtVal(line.retainedEarnings)}</TableCell>
                  <TableCell className="text-xs py-1.5 text-right">{fmtVal(line.revaluationReserve)}</TableCell>
                  <TableCell className="text-xs py-1.5 text-right font-semibold">{fmtVal(line.totalEquity)}</TableCell>
                  <TableCell className="text-xs py-1.5 text-muted-foreground">{line.inCell || ""}</TableCell>
                  <TableCell className="text-xs py-1.5 text-muted-foreground">{line.source || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-8 grid grid-cols-2 gap-16 text-xs text-muted-foreground">
            <div className="space-y-4">
              <p className="font-semibold">Head of Finance</p>
              <p>Name ___________________</p>
              <p>Signature and Date ___________________</p>
            </div>
            <div className="space-y-4">
              <p className="font-semibold">Head of Compliance</p>
              <p>Name ___________________</p>
              <p>Signature and Date ___________________</p>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Stamp of the Company</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DABReportPage() {
  const today = new Date().toISOString().split("T")[0];
  const yearStart = `${new Date().getFullYear()}-01-01`;

  const [notesAsOfDate, setNotesAsOfDate] = useState(today);
  const [notesAsOfDateApplied, setNotesAsOfDateApplied] = useState(today);

  const [plStartDate, setPlStartDate] = useState(yearStart);
  const [plEndDate, setPlEndDate] = useState(today);
  const [plStartDateApplied, setPlStartDateApplied] = useState(yearStart);
  const [plEndDateApplied, setPlEndDateApplied] = useState(today);

  const [cfStartDate, setCfStartDate] = useState(yearStart);
  const [cfEndDate, setCfEndDate] = useState(today);
  const [cfStartDateApplied, setCfStartDateApplied] = useState(yearStart);
  const [cfEndDateApplied, setCfEndDateApplied] = useState(today);

  const [equityAsOfDate, setEquityAsOfDate] = useState(today);
  const [equityAsOfDateApplied, setEquityAsOfDateApplied] = useState(today);

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
          <TabsTrigger value="financial-position" className="gap-1" data-testid="tab-financial-position">
            <Landmark className="h-3.5 w-3.5" />
            Financial Position
          </TabsTrigger>
          <TabsTrigger value="changes-in-equity" className="gap-1" data-testid="tab-changes-equity">
            <Scale className="h-3.5 w-3.5" />
            Changes in Equity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes-to-financial-statements">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-end gap-4 flex-wrap">
                <div className="space-y-2">
                  <Label>As of Date</Label>
                  <Input
                    type="date"
                    value={notesAsOfDate}
                    onChange={(e) => setNotesAsOfDate(e.target.value)}
                    data-testid="input-notes-as-of-date"
                  />
                </div>
                <Button onClick={() => setNotesAsOfDateApplied(notesAsOfDate)} data-testid="button-generate-notes">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
          <NotesToFinancialStatements asOfDate={notesAsOfDateApplied} />
        </TabsContent>

        <TabsContent value="profit-loss">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-end gap-4 flex-wrap">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={plStartDate}
                    onChange={(e) => setPlStartDate(e.target.value)}
                    data-testid="input-pl-start-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={plEndDate}
                    onChange={(e) => setPlEndDate(e.target.value)}
                    data-testid="input-pl-end-date"
                  />
                </div>
                <Button onClick={() => { setPlStartDateApplied(plStartDate); setPlEndDateApplied(plEndDate); }} data-testid="button-generate-pl">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
          <ProfitLossStatementReport startDate={plStartDateApplied} endDate={plEndDateApplied} />
        </TabsContent>

        <TabsContent value="cash-flow">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-end gap-4 flex-wrap">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={cfStartDate}
                    onChange={(e) => setCfStartDate(e.target.value)}
                    data-testid="input-cf-start-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={cfEndDate}
                    onChange={(e) => setCfEndDate(e.target.value)}
                    data-testid="input-cf-end-date"
                  />
                </div>
                <Button onClick={() => { setCfStartDateApplied(cfStartDate); setCfEndDateApplied(cfEndDate); }} data-testid="button-generate-cf">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
          <CashFlowStatementReport startDate={cfStartDateApplied} endDate={cfEndDateApplied} />
        </TabsContent>

        <TabsContent value="financial-position">
          <FinancialPositionReport />
        </TabsContent>

        <TabsContent value="changes-in-equity">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-end gap-4 flex-wrap">
                <div className="space-y-2">
                  <Label>As of Date</Label>
                  <Input
                    type="date"
                    value={equityAsOfDate}
                    onChange={(e) => setEquityAsOfDate(e.target.value)}
                    data-testid="input-equity-as-of-date"
                  />
                </div>
                <Button onClick={() => setEquityAsOfDateApplied(equityAsOfDate)} data-testid="button-generate-equity">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
          <ChangesInEquityReport asOfDate={equityAsOfDateApplied} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
