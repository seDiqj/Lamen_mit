import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type CashFlowData = {
  operating: {
    pbt: number;
    deprecAmort: number;
    impairment: number;
    gainLossDisposal: number;
    fxGainLoss: number;
    provisionChange: number;
    receivablesPrep: number;
    payablesAccruals: number;
    financeToCustomers: number;
    inventory: number;
    taxPaid: number;
    netCash: number;
  };
  financing: {
    capitalIntro: number;
    fundsRaised: number;
    repaymentFunds: number;
    dividendPaid: number;
    netCash: number;
  };
  investing: {
    purchasePPE: number;
    intangibles: number;
    proceedsDisposal: number;
    netCash: number;
  };
  cashVariation: number;
  cashBeginning: number;
  cashEnd: number;
};

type LineItem = {
  code: string;
  label: string;
  amount: number | null;
  source: string;
  isHeader?: boolean;
  isTotal?: boolean;
  isBold?: boolean;
  isSubHeader?: boolean;
  indent?: number;
};

function buildLines(d: CashFlowData): LineItem[] {
  return [
    { code: "1", label: "Cash Flow from Operating Activities", amount: null, source: "", isHeader: true },
    { code: "1.1", label: "Profit Before Tax (PBT)", amount: d.operating.pbt, source: "From P&L Statement", indent: 1 },
    { code: "-", label: "Adjustment for Cash Flow", amount: null, source: "", isSubHeader: true },
    { code: "1.2", label: "Depreciation and Amortization", amount: d.operating.deprecAmort, source: "61900 Depreciation Expense, 15300 Accumulated Amortization", indent: 1 },
    { code: "1.3", label: "Impairment Expense", amount: d.operating.impairment, source: "Not used currently", indent: 1 },
    { code: "1.4", label: "Gain/Loss on Disposal", amount: d.operating.gainLossDisposal, source: "17900-Loss on disposal of assets", indent: 1 },
    { code: "1.5", label: "Foreign Exchange Gain/Loss", amount: d.operating.fxGainLoss, source: "61802-Exchange (gain)/loss", indent: 1 },
    { code: "1.6", label: "Increase/Decrease in Provision", amount: d.operating.provisionChange, source: "80102 Loan loss provision expense", indent: 1 },
    { code: "-", label: "Changes in Working Capital", amount: null, source: "", isSubHeader: true },
    { code: "1.7", label: "Receivables and Prepayments", amount: d.operating.receivablesPrep, source: "13000-Advances minus 20900 Deferred Murabaha Income", indent: 1 },
    { code: "1.8", label: "Payables and Accruals", amount: d.operating.payablesAccruals, source: "20100 AP + 20150 Salaries Payable + 21100/21200 Withheld Taxes", indent: 1 },
    { code: "1.9", label: "Finance to Customers", amount: d.operating.financeToCustomers, source: "11000 Accounts Receivable + 20900 Deferred Murabaha Income", indent: 1 },
    { code: "1.10", label: "Inventory", amount: d.operating.inventory, source: "12000-Inventory", indent: 1 },
    { code: "1.11", label: "Tax Paid", amount: d.operating.taxPaid, source: "21000 Withheld Taxes (debit balances)", indent: 1 },
    { code: "1.12", label: "Net Cash Flow from Operating Activities", amount: d.operating.netCash, source: "", isTotal: true, isBold: true },
    { code: "", label: "", amount: null, source: "" },
    { code: "2", label: "Cash Flow from Financing Activities", amount: null, source: "", isHeader: true },
    { code: "2.1", label: "Capital Introduced by Partners", amount: d.financing.capitalIntro, source: "30100 Opening Balance Equity", indent: 1 },
    { code: "2.2", label: "Funds Raised through Shariah-compliant Instruments", amount: d.financing.fundsRaised, source: "20120-Donor's Funds (when received)", indent: 1 },
    { code: "2.3", label: "Repayment of Shariah-compliant financing", amount: d.financing.repaymentFunds, source: "20122-Donor's Funds (when paid)", indent: 1 },
    { code: "2.4", label: "Dividend Paid", amount: d.financing.dividendPaid, source: "30400 Dividend disbursed", indent: 1 },
    { code: "2.5", label: "Net Cash Flow from Financing Activities", amount: d.financing.netCash, source: "", isTotal: true, isBold: true },
    { code: "", label: "", amount: null, source: "" },
    { code: "3", label: "Cash Flow From Investing Activities", amount: null, source: "", isHeader: true },
    { code: "3.1", label: "Purchase of Property, Vehicles, and Equipment", amount: d.investing.purchasePPE, source: "17101, 17201, 17301, 17401, 17500", indent: 1 },
    { code: "3.2", label: "Acquisition of Intangible Assets", amount: d.investing.intangibles, source: "15000-Intangibles", indent: 1 },
    { code: "3.3", label: "Proceeds from Disposal of Assets", amount: d.investing.proceedsDisposal, source: "17900-Loss on disposal of assets", indent: 1 },
    { code: "3.4", label: "Net Cash Flow from Investing Activities", amount: d.investing.netCash, source: "", isTotal: true, isBold: true },
    { code: "", label: "", amount: null, source: "" },
    { code: "4", label: "Cash Variation in the Month", amount: d.cashVariation, source: "", isBold: true, isTotal: true },
    { code: "5", label: "Cash and Cash Equivalents at the Beginning of the Month", amount: d.cashBeginning, source: "Closing balance of prior period", isBold: true },
    { code: "6", label: "Cash and Cash Equivalents at the End of the Month", amount: d.cashEnd, source: "", isBold: true, isTotal: true },
  ];
}

export default function CashFlowStatementReport() {
  const startDate = `${new Date().getFullYear()}-01-01`;
  const endDate = new Date().toISOString().split("T")[0];
  const [data, setData] = useState<CashFlowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      const res = await fetch(`/api/reports/cash-flow-statement?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch cash flow statement:", error);
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

    const headerRows: any[][] = [
      ["Da Afghanistan Bank"],
      ["Non-Banking Financial Institutions Supervision Directorate General"],
      ["Follow up and Offsite Supervision Section"],
      [""],
      ["Statement of Cash Flow"],
      [""],
      ["", `MFI Name: Lamen Microfinance Institution`],
      ["", `License Number: 003`],
      ["", `Date/Period: ${formatDate(startDate)} - ${formatDate(endDate)}`],
      ["", "Currency: Afghani"],
      ["", "Frequency: Monthly"],
      [""],
      ["Line Code", "Items", "Amounts"],
      [""],
    ];

    const dataRows = lines.map(line => [
      line.code,
      (line.indent ? "    " : "") + line.label,
      line.amount !== null ? line.amount : "",
    ]);

    const allRows = [...headerRows, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(allRows);
    ws["!cols"] = [{ wch: 12 }, { wch: 60 }, { wch: 20 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statement of Cash Flow");
    XLSX.writeFile(wb, `Cash_Flow_Statement_${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}.xlsx`);
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
    doc.text("Statement of Cash Flow", 105, 32, { align: "center" });

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
    ]);

    autoTable(doc, {
      startY: 65,
      head: [["Line Code", "Items", "Amounts"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 87, 122], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 1.5 },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },
        1: { cellWidth: 120 },
        2: { cellWidth: 35, halign: "right" },
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
          if (line?.isSubHeader) {
            data.cell.styles.fontStyle = "italic";
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

    doc.save(`Cash_Flow_Statement_${startDate.replace(/-/g, "")}_${endDate.replace(/-/g, "")}.pdf`);
  };

  const lines = data ? buildLines(data) : [];

  return (
    <div className="flex flex-col gap-4">
      {data && (
        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleExportExcel} className="gap-2 bg-green-600 text-white" data-testid="button-export-excel-cf">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button onClick={handleExportPDF} className="gap-2 bg-red-600 text-white" data-testid="button-export-pdf-cf">
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
              <CardTitle className="text-lg mt-2">Statement of Cash Flow</CardTitle>
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
                  <th className="px-3 py-2 text-right font-semibold w-36">Amounts</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => {
                  if (!line.code && !line.label) {
                    return <tr key={idx}><td colSpan={3} className="h-3"></td></tr>;
                  }
                  const bgClass = line.isTotal ? "bg-muted/50" : idx % 2 === 0 ? "bg-muted/20" : "";
                  return (
                    <tr key={idx} className={bgClass} data-testid={`row-cf-${idx}`}>
                      <td className={`px-3 py-1.5 ${line.isBold || line.isHeader ? "font-bold" : ""} ${line.isSubHeader ? "italic text-muted-foreground" : ""}`}>
                        {line.code}
                      </td>
                      <td
                        className={`px-3 py-1.5 ${line.isBold || line.isHeader ? "font-bold" : ""} ${line.isSubHeader ? "italic text-muted-foreground" : ""}`}
                        style={{ paddingLeft: line.indent ? "2rem" : undefined }}
                      >
                        {line.label}
                      </td>
                      <td className={`px-3 py-1.5 text-right font-mono ${line.isBold || line.isTotal ? "font-bold" : ""}`}>
                        {fmtAmount(line.amount)}
                      </td>
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
