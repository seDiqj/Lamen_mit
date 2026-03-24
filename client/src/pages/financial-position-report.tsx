import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FileSpreadsheet, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type RU = { restricted: number; unrestricted: number; total: number };

type FinancialPositionData = {
  assets: {
    current: {
      cashAndEquiv: RU;
      currentFinanceReceivables: RU;
      prepaidExpenses: RU;
      receivables: RU;
      inventory: RU;
      total: RU;
    };
    nonCurrent: {
      propertyVehiclesEquip: RU;
      intangibleAssets: RU;
      longTermFinanceReceivables: RU;
      deferredTaxAsset: RU;
      total: RU;
    };
    total: RU;
  };
  equity: {
    shareCapital: RU;
    retainedEarnings: RU;
    revaluationReserve: RU;
    total: RU;
  };
  liabilities: {
    current: {
      payables: RU;
      currentFinancePayables: RU;
      total: RU;
    };
    nonCurrent: {
      nonCurrentLiabilities: RU;
      nonCurrentFinancePayables: RU;
      total: RU;
    };
    total: RU;
  };
  totalEquityAndLiabilities: RU;
};

type LineItem = {
  code: string;
  label: string;
  restricted: number | null;
  unrestricted: number | null;
  total: number | null;
  source: string;
  isHeader?: boolean;
  isTotal?: boolean;
  isBold?: boolean;
  isSubHeader?: boolean;
  indent?: number;
  isEmpty?: boolean;
};

function buildLines(d: FinancialPositionData): LineItem[] {
  const line = (code: string, label: string, ru: RU | null, source: string, opts: Partial<LineItem> = {}): LineItem => ({
    code,
    label,
    restricted: ru ? ru.restricted : null,
    unrestricted: ru ? ru.unrestricted : null,
    total: ru ? ru.total : null,
    source,
    ...opts,
  });

  return [
    line("1", "Assets", null, "", { isHeader: true }),
    line("", "", null, "", { isEmpty: true }),
    line("1.1", "Current Assets", null, "", { isSubHeader: true, isBold: true }),
    line("1.1.1", "Cash and Cash Equivalents", d.assets.current.cashAndEquiv, "Note 1.3", { indent: 1 }),
    line("1.1.2", "Current Portion of Finance Receivables", d.assets.current.currentFinanceReceivables, "Note 2.3", { indent: 1 }),
    line("1.1.3", "Prepaid Expenses", d.assets.current.prepaidExpenses, "Note 3.4", { indent: 1 }),
    line("1.1.4", "Receivables", d.assets.current.receivables, "Profit - profit collection + 14000", { indent: 1 }),
    line("1.1.5", "Inventory", d.assets.current.inventory, "Balance of 12000 account Code", { indent: 1 }),
    line("1.1.6", "Total Current Assets", d.assets.current.total, "", { isTotal: true, isBold: true }),
    line("", "", null, "", { isEmpty: true }),
    line("1.2", "Non-Current Assets", null, "", { isSubHeader: true, isBold: true }),
    line("1.2.1", "Property, Vehicles, and Office Equipment", d.assets.nonCurrent.propertyVehiclesEquip, "Note 4.5", { indent: 1 }),
    line("1.2.2", "Intangible Assets", d.assets.nonCurrent.intangibleAssets, "Note 5.6", { indent: 1 }),
    line("1.2.3", "Long-Term Portion of Finance Receivables", d.assets.nonCurrent.longTermFinanceReceivables, "Note 6.3", { indent: 1 }),
    line("1.2.4", "Deferred Tax Asset", d.assets.nonCurrent.deferredTaxAsset, "Balance of P&L × 20%", { indent: 1 }),
    line("1.2.5", "Total Non-Current Assets", d.assets.nonCurrent.total, "", { isTotal: true, isBold: true }),
    line("", "", null, "", { isEmpty: true }),
    line("2", "Total Current and Non-Current Assets", d.assets.total, "", { isTotal: true, isBold: true, isHeader: true }),
    line("", "", null, "", { isEmpty: true }),
    line("3", "Equity and Liabilities", null, "", { isHeader: true }),
    line("", "", null, "", { isEmpty: true }),
    line("3.1", "Equity", null, "", { isSubHeader: true, isBold: true }),
    line("3.1.1", "Share Capital", d.equity.shareCapital, "Balance of 30100 account code", { indent: 1 }),
    line("3.1.2", "Retained Earnings", d.equity.retainedEarnings, "Note 7.5", { indent: 1 }),
    line("3.1.3", "Revaluation Reserve", d.equity.revaluationReserve, "Not Used", { indent: 1 }),
    line("3.1.4", "Total Equity", d.equity.total, "", { isTotal: true, isBold: true }),
    line("", "", null, "", { isEmpty: true }),
    line("3.2", "Liabilities", null, "", { isSubHeader: true, isBold: true }),
    line("3.2.1", "Current Liabilities", null, "", { isSubHeader: true }),
    line("3.2.1.1", "Payables", d.liabilities.current.payables, "Note 8.5", { indent: 1 }),
    line("3.2.1.2", "Current Portion of Finance Payables", d.liabilities.current.currentFinancePayables, "Not Used", { indent: 1 }),
    line("3.2.1.3", "Total Current Liabilities", d.liabilities.current.total, "", { isTotal: true, isBold: true }),
    line("", "", null, "", { isEmpty: true }),
    line("3.2.2", "Non-Current Liabilities", null, "", { isSubHeader: true }),
    line("3.2.2.1", "Non-Current Liabilities", d.liabilities.nonCurrent.nonCurrentLiabilities, "Note 9.5", { indent: 1 }),
    line("3.2.2.2", "Non-Current Portion of Finance Payables", d.liabilities.nonCurrent.nonCurrentFinancePayables, "Balance of 20121", { indent: 1 }),
    line("3.2.2.3", "Total Non-Current Liabilities", d.liabilities.nonCurrent.total, "", { isTotal: true, isBold: true }),
    line("", "", null, "", { isEmpty: true }),
    line("4", "Total Liabilities", d.liabilities.total, "", { isTotal: true, isBold: true, isHeader: true }),
    line("", "", null, "", { isEmpty: true }),
    line("5", "Total Equity and Liabilities", d.totalEquityAndLiabilities, "", { isTotal: true, isBold: true, isHeader: true }),
  ];
}

export default function FinancialPositionReport() {
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<FinancialPositionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ asOfDate });
      const res = await fetch(`/api/reports/financial-position?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch financial position:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const fmtAmount = (val: number | null) => {
    if (val === null) return "";
    return formatCurrency(val.toFixed(2));
  };

  const getDateLabel = () => {
    const d = new Date(asOfDate + "T00:00:00");
    return d.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const handleExportExcel = () => {
    if (!data) return;
    const lines = buildLines(data);

    const headerRows: any[][] = [
      ["Da Afghanistan Bank"],
      ["Non-Banking Financial Institutions Supervision Directorate General"],
      ["Follow-up and Offsite Supervision Section"],
      [""],
      ["Statement of Financial Position"],
      [""],
      ["", `MFI Name: Lamen Micro Finance Institution`],
      ["", `License Number: 97950`],
      ["", `Date/Period: ${getDateLabel()}`],
      ["", "Currency: Afghani"],
      ["", "Frequency: Monthly"],
      [""],
      ["Line Code", "Items", "Restricted", "Unrestricted", "Total", "Source"],
      [""],
    ];

    const dataRows = lines.filter(l => !l.isEmpty).map(line => [
      line.code,
      (line.indent ? "    " : "") + line.label,
      line.restricted !== null ? line.restricted : "",
      line.unrestricted !== null ? line.unrestricted : "",
      line.total !== null ? line.total : "",
      line.source,
    ]);

    const allRows = [...headerRows, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(allRows);
    ws["!cols"] = [{ wch: 12 }, { wch: 50 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 35 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financial Position");
    XLSX.writeFile(wb, `Financial_Position_${asOfDate.replace(/-/g, "")}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const lines = buildLines(data).filter(l => !l.isEmpty);
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Da Afghanistan Bank", 105, 12, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Non-Banking Financial Institutions Supervision Directorate General", 105, 18, { align: "center" });
    doc.text("Follow-up and Offsite Supervision Section", 105, 23, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Statement of Financial Position", 105, 32, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`MFI Name: Lamen Micro Finance Institution`, 20, 40);
    doc.text(`License Number: 97950`, 20, 45);
    doc.text(`Date/Period: ${getDateLabel()}`, 20, 50);
    doc.text(`Currency: Afghani`, 20, 55);
    doc.text(`Frequency: Monthly`, 20, 60);

    const fmtNum = (v: number | null) => v !== null ? v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";

    const tableData = lines.map(line => [
      line.code,
      (line.indent ? "    " : "") + line.label,
      fmtNum(line.restricted),
      fmtNum(line.unrestricted),
      fmtNum(line.total),
      line.source,
    ]);

    autoTable(doc, {
      startY: 65,
      head: [["Line Code", "Items", "Restricted", "Unrestricted", "Total", "Source"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 7 },
      styles: { fontSize: 7, cellPadding: 1.2 },
      columnStyles: {
        0: { cellWidth: 18, halign: "center" },
        1: { cellWidth: 55 },
        2: { cellWidth: 22, halign: "right" },
        3: { cellWidth: 22, halign: "right" },
        4: { cellWidth: 25, halign: "right" },
        5: { cellWidth: 33 },
      },
      didParseCell: function(cellData: any) {
        if (cellData.section === "body") {
          const line = lines[cellData.row.index];
          if (line?.isHeader || line?.isBold) {
            cellData.cell.styles.fontStyle = "bold";
          }
          if (line?.isTotal) {
            cellData.cell.styles.fontStyle = "bold";
            if (cellData.column.index >= 2 && cellData.column.index <= 4) {
              cellData.cell.styles.fillColor = [240, 240, 240];
            }
          }
        }
      },
    });

    doc.setFontSize(8);
    doc.text("Head of Finance", 40, (doc as any).lastAutoTable.finalY + 20);
    doc.text("Head of Compliance", 130, (doc as any).lastAutoTable.finalY + 20);

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      doc.text("Lamen Microfinance Institution - Confidential", 14, 290);
    }

    doc.save(`Financial_Position_${asOfDate.replace(/-/g, "")}.pdf`);
  };

  const lines = data ? buildLines(data) : [];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="space-y-2">
              <Label>As of Date</Label>
              <Input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                data-testid="input-as-of-date-fp"
              />
            </div>
            <Button onClick={fetchReport} disabled={isLoading} data-testid="button-generate-fp">
              {isLoading ? "Loading..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleExportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel-fp">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button onClick={handleExportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf-fp">
            <FileText className="h-4 w-4" /> PDF
          </Button>
        </div>
      )}

      {isLoading && !data && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">Loading report...</CardContent>
        </Card>
      )}

      {data && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-base font-bold">Da Afghanistan Bank</h3>
              <p className="text-xs text-muted-foreground">Non-Banking Financial Institutions Supervision Directorate General</p>
              <p className="text-xs text-muted-foreground">Follow-up and Offsite Supervision Section</p>
              <p className="text-sm font-semibold mt-2">Statement of Financial Position</p>
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

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[hsl(var(--primary))] text-primary-foreground">
                    <th className="px-3 py-2 text-left font-semibold w-24">Line Code</th>
                    <th className="px-3 py-2 text-left font-semibold">Items</th>
                    <th className="px-3 py-2 text-right font-semibold w-28">Restricted</th>
                    <th className="px-3 py-2 text-right font-semibold w-28">Unrestricted</th>
                    <th className="px-3 py-2 text-right font-semibold w-32">Total</th>
                    <th className="px-3 py-2 text-left font-semibold w-48">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, idx) => {
                    if (line.isEmpty) {
                      return <tr key={idx}><td colSpan={6} className="h-3"></td></tr>;
                    }
                    const bgClass = line.isTotal ? "bg-muted/50" : idx % 2 === 0 ? "bg-muted/20" : "";
                    return (
                      <tr key={idx} className={bgClass} data-testid={`row-fp-${idx}`}>
                        <td className={`px-3 py-1.5 ${line.isBold || line.isHeader ? "font-bold" : ""} ${line.isSubHeader && !line.isBold ? "italic text-muted-foreground" : ""}`}>
                          {line.code}
                        </td>
                        <td
                          className={`px-3 py-1.5 ${line.isBold || line.isHeader ? "font-bold" : ""} ${line.isSubHeader && !line.isBold ? "italic text-muted-foreground" : ""}`}
                          style={{ paddingLeft: line.indent ? "2rem" : undefined }}
                        >
                          {line.label}
                        </td>
                        <td className={`px-3 py-1.5 text-right font-mono ${line.isBold || line.isTotal ? "font-bold" : ""}`}>
                          {fmtAmount(line.restricted)}
                        </td>
                        <td className={`px-3 py-1.5 text-right font-mono ${line.isBold || line.isTotal ? "font-bold" : ""}`}>
                          {fmtAmount(line.unrestricted)}
                        </td>
                        <td className={`px-3 py-1.5 text-right font-mono ${line.isBold || line.isTotal ? "font-bold" : ""}`}>
                          {fmtAmount(line.total)}
                        </td>
                        <td className="px-3 py-1.5 text-xs text-muted-foreground">{line.source}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-12 flex justify-between px-8">
              <div className="text-center space-y-6">
                <p className="font-semibold text-sm">Head of Finance</p>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-xs text-muted-foreground">Signature and Date</p>
              </div>
              <div className="text-center space-y-6">
                <p className="font-semibold text-sm">Head of Compliance</p>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-xs text-muted-foreground">Signature and Date</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">Stamp of the company</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
