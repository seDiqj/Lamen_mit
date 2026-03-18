import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ProfitLossData = {
  revenue: {
    murabaha: number;
    mudaraba: number;
    musharaka: number;
    other: number;
    total: number;
  };
  costOfServices: {
    murabahaCost: number;
    feeBorrowings: number;
    eclProvision: number;
    creditOfficerSalaries: number;
    other: number;
    total: number;
  };
  grossProfit: number;
  otherIncome: number;
  operatingExpenses: {
    staffSalaries: number;
    depreciation: number;
    technology: number;
    marketing: number;
    admin: number;
    legal: number;
    other: number;
    total: number;
  };
  profitBeforeTax: number;
  incomeTax: number;
  netProfit: number;
  oci: {
    revaluation: number;
    tax: number;
    total: number;
  };
  totalComprehensiveIncome: number;
};

type LineItem = {
  code: string;
  label: string;
  amount: number | null;
  source: string;
  isHeader?: boolean;
  isTotal?: boolean;
  isBold?: boolean;
  indent?: number;
};

function buildLines(d: ProfitLossData): LineItem[] {
  return [
    { code: "1", label: "Revenue", amount: null, source: "", isHeader: true },
    { code: "1.1", label: "Revenue from Murabaha Financing", amount: d.revenue.murabaha, source: "50300 Murabaha Income (Earned) + 20900 Deferred Murabaha Income", indent: 1 },
    { code: "1.2", label: "Revenue from Mudaraba Financing", amount: d.revenue.mudaraba, source: "50100 - Mudarabah Profit Income", indent: 1 },
    { code: "1.3", label: "Revenue from Musharaka Financing", amount: d.revenue.musharaka, source: "50200 - Musharakah Profit Income", indent: 1 },
    { code: "1.4", label: "Other Revenue", amount: d.revenue.other, source: "No accounts yet", indent: 1 },
    { code: "1.5", label: "Total Revenue", amount: d.revenue.total, source: "", isTotal: true, isBold: true },
    { code: "", label: "", amount: null, source: "" },
    { code: "2", label: "Cost of Services/Goods", amount: null, source: "", isHeader: true },
    { code: "2.1", label: "Murabaha Product Cost", amount: d.costOfServices.murabahaCost, source: "51100-Postage, 51300-Hawala Cost, 51400-Commission", indent: 1 },
    { code: "2.2", label: "Fee Expense on Borrowings", amount: d.costOfServices.feeBorrowings, source: "62000-Operating Expenses", indent: 1 },
    { code: "2.3", label: "Provision for ECL (Expected Credit Loss)", amount: d.costOfServices.eclProvision, source: "80102 Loan loss provision expense", indent: 1 },
    { code: "2.4", label: "Credit Officer Salaries", amount: d.costOfServices.creditOfficerSalaries, source: "51200 Financing Officer's Salary", indent: 1 },
    { code: "2.5", label: "Other Cost of Services/Goods", amount: d.costOfServices.other, source: "No accounts yet", indent: 1 },
    { code: "2.6", label: "Total Cost Of Services/Goods", amount: d.costOfServices.total, source: "", isTotal: true, isBold: true },
    { code: "", label: "", amount: null, source: "" },
    { code: "3", label: "Gross Profit", amount: d.grossProfit, source: "", isBold: true, isTotal: true },
    { code: "", label: "", amount: null, source: "" },
    { code: "4", label: "Other Income", amount: d.otherIncome, source: "40000-Non-Operating Income, 40400-Dividend, 40500-Discount Received", isBold: true },
    { code: "", label: "", amount: null, source: "" },
    { code: "5", label: "Operating Expenses", amount: null, source: "", isHeader: true },
    { code: "5.1", label: "Other Staff Salaries", amount: d.operatingExpenses.staffSalaries, source: "60001 Salaries & wages", indent: 1 },
    { code: "5.2", label: "Depreciation and Amortization", amount: d.operatingExpenses.depreciation, source: "61900 Depreciation Expense", indent: 1 },
    { code: "5.3", label: "Technology and MIS Maintenance", amount: d.operatingExpenses.technology, source: "70000 Dues and subscriptions, 15300 Accumulated Amortization", indent: 1 },
    { code: "5.4", label: "Marketing and Outreach", amount: d.operatingExpenses.marketing, source: "61600 Promotion & Advertisement", indent: 1 },
    { code: "5.5", label: "Administrative Expenses", amount: d.operatingExpenses.admin, source: "Remaining expenses", indent: 1 },
    { code: "5.6", label: "Legal Expenses", amount: d.operatingExpenses.legal, source: "61504-Legal", indent: 1 },
    { code: "5.7", label: "Other Operating Expenses", amount: d.operatingExpenses.other, source: "No accounts yet", indent: 1 },
    { code: "5.8", label: "Total Operating Expenses", amount: d.operatingExpenses.total, source: "", isTotal: true, isBold: true },
    { code: "", label: "", amount: null, source: "" },
    { code: "6", label: "Profit Before Tax (PBT)", amount: d.profitBeforeTax, source: "", isBold: true, isTotal: true },
    { code: "7", label: "Income Tax", amount: d.incomeTax, source: "20% of PBT", isBold: true },
    { code: "8", label: "Net Profit (PAT)", amount: d.netProfit, source: "", isBold: true, isTotal: true },
    { code: "", label: "", amount: null, source: "" },
    { code: "9", label: "Other Comprehensive Income", amount: null, source: "", isHeader: true },
    { code: "9.1", label: "Revaluation Surplus on Property, Vehicles, and Equipment", amount: d.oci.revaluation, source: "Not used yet", indent: 1 },
    { code: "9.2", label: "Tax on Revaluation Surplus", amount: d.oci.tax, source: "Not used yet", indent: 1 },
    { code: "9.3", label: "Total Other Comprehensive Income", amount: d.oci.total, source: "", isTotal: true, isBold: true },
    { code: "", label: "", amount: null, source: "" },
    { code: "10", label: "Total Comprehensive Income (Net Profit + OCI Adjustment)", amount: d.totalComprehensiveIncome, source: "", isBold: true, isTotal: true },
  ];
}

export default function ProfitLossStatementReport() {
  const startDate = `${new Date().getFullYear()}-01-01`;
  const endDate = new Date().toISOString().split("T")[0];
  const [data, setData] = useState<ProfitLossData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      const res = await fetch(`/api/reports/profit-loss-statement?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch profit/loss statement:", error);
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

  const handleExportExcel = () => {
    if (!data) return;
    const lines = buildLines(data);

    const headerRows = [
      ["Da Afghanistan Bank"],
      ["Non-Banking Financial Institutions Supervision Directorate General"],
      ["Follow up and Offsite Supervision Section"],
      [""],
      ["Statement of Profit or Loss and Other Comprehensive Income"],
      [""],
      ["", `MFI Name: Lamen Microfinance Institution`],
      ["", `License Number: 003`],
      ["", `Date/Period: ${formatDate(startDate)} - ${formatDate(endDate)}`],
      ["", "Currency: Afghani"],
      ["", "Frequency: Monthly"],
      [""],
      ["Line Code", "Items", "Amount", "", "Source of data"],
      [""],
    ];

    const dataRows = lines.map(line => [
      line.code,
      (line.indent ? "    " : "") + line.label,
      line.amount !== null ? line.amount : "",
      "",
      line.source,
    ]);

    const allRows = [...headerRows, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(allRows);
    ws["!cols"] = [{ wch: 12 }, { wch: 55 }, { wch: 18 }, { wch: 5 }, { wch: 55 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statement of Profit or Loss");
    XLSX.writeFile(wb, `Profit_Loss_Statement_${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const lines = buildLines(data);
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Da Afghanistan Bank", 105, 12, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Non-Banking Financial Institutions Supervision Directorate General", 105, 18, { align: "center" });
    doc.text("Follow up and Offsite Supervision Section", 105, 23, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Statement of Profit or Loss and Other Comprehensive Income", 105, 32, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`MFI Name: Lamen Microfinance Institution`, 20, 40);
    doc.text(`License Number: 003`, 20, 45);
    doc.text(`Date/Period: ${formatDate(startDate)} - ${formatDate(endDate)}`, 20, 50);
    doc.text(`Currency: Afghani`, 20, 55);
    doc.text(`Frequency: Monthly`, 20, 60);

    const tableData = lines.map(line => [
      line.code,
      (line.indent ? "    " : "") + line.label,
      line.amount !== null ? line.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
      line.source,
    ]);

    autoTable(doc, {
      startY: 65,
      head: [["Line Code", "Items", "Amount", "Source of data"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 7 },
      styles: { fontSize: 7, cellPadding: 1.5 },
      columnStyles: {
        0: { cellWidth: 18, halign: "center" },
        1: { cellWidth: 70 },
        2: { cellWidth: 28, halign: "right" },
        3: { cellWidth: 70 },
      },
      didParseCell: function(data: any) {
        if (data.section === "body") {
          const line = lines[data.row.index];
          if (line?.isHeader || line?.isBold) {
            data.cell.styles.fontStyle = "bold";
          }
          if (line?.isTotal) {
            data.cell.styles.fontStyle = "bold";
            if (data.column.index === 2) {
              data.cell.styles.fillColor = [240, 240, 240];
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

    doc.save(`Profit_Loss_Statement_${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}.pdf`);
  };

  const lines = data ? buildLines(data) : [];

  return (
    <div className="flex flex-col gap-4">
      {data && (
        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleExportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel-pnl">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button onClick={handleExportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf-pnl">
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
          <CardHeader className="pb-3 border-b">
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">Da Afghanistan Bank</p>
              <p className="text-xs text-muted-foreground">Non-Banking Financial Institutions Supervision Directorate General</p>
              <p className="text-xs text-muted-foreground">Follow up and Offsite Supervision Section</p>
              <CardTitle className="text-lg mt-2">Statement of Profit or Loss and Other Comprehensive Income</CardTitle>
              <div className="text-xs text-muted-foreground space-y-0.5 mt-2">
                <p>MFI Name: Lamen Microfinance Institution &nbsp; | &nbsp; License Number: 003</p>
                <p>Period: {formatDate(startDate)} - {formatDate(endDate)} &nbsp; | &nbsp; Currency: Afghani &nbsp; | &nbsp; Frequency: Monthly</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--primary))] text-primary-foreground">
                  <th className="px-3 py-2 text-left font-semibold w-24">Line Code</th>
                  <th className="px-3 py-2 text-left font-semibold">Items</th>
                  <th className="px-3 py-2 text-right font-semibold w-36">Amount</th>
                  <th className="px-3 py-2 text-left font-semibold">Source of data</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => {
                  if (!line.code && !line.label) {
                    return <tr key={idx}><td colSpan={4} className="h-3"></td></tr>;
                  }
                  const bgClass = line.isTotal ? "bg-muted/50" : idx % 2 === 0 ? "bg-muted/20" : "";
                  return (
                    <tr key={idx} className={bgClass} data-testid={`row-pnl-${idx}`}>
                      <td className={`px-3 py-1.5 ${line.isBold || line.isHeader ? "font-bold" : ""}`}>{line.code}</td>
                      <td className={`px-3 py-1.5 ${line.isBold || line.isHeader ? "font-bold" : ""}`} style={{ paddingLeft: line.indent ? "2rem" : undefined }}>
                        {line.label}
                      </td>
                      <td className={`px-3 py-1.5 text-right font-mono ${line.isBold || line.isTotal ? "font-bold" : ""}`}>
                        {fmtAmount(line.amount)}
                      </td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{line.source}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

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
