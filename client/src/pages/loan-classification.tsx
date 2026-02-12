import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSpreadsheet, Download, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ClassificationCategory = {
  category: string;
  noOfLoans: number;
  totalPrinciple: number;
  totalProfit: number;
  total: number;
  totalPCollection: number;
  totalMargin: number;
  totalCollection: number;
  totalReceivable: number;
};

type ClassificationData = {
  categories: ClassificationCategory[];
  totals: {
    noOfLoans: number;
    totalPrinciple: number;
    totalProfit: number;
    total: number;
    totalPCollection: number;
    totalMargin: number;
    totalCollection: number;
    totalReceivable: number;
  };
};

export default function LoanClassificationPage() {
  const { data, isLoading } = useQuery<ClassificationData>({
    queryKey: ["/api/reports/loan-classification"],
  });

  const exportToExcel = () => {
    if (!data) return;
    const rows = data.categories.map((cat) => ({
      "Category": cat.category,
      "No. of Loans": cat.noOfLoans,
      "Total Principle": cat.totalPrinciple,
      "Total Profit": cat.totalProfit,
      "Total": cat.total,
      "Total P.Collection": cat.totalPCollection,
      "Total Margin": cat.totalMargin,
      "Total Collection": cat.totalCollection,
      "Total Receivable": cat.totalReceivable,
    }));
    rows.push({
      "Category": "Total",
      "No. of Loans": data.totals.noOfLoans,
      "Total Principle": data.totals.totalPrinciple,
      "Total Profit": data.totals.totalProfit,
      "Total": data.totals.total,
      "Total P.Collection": data.totals.totalPCollection,
      "Total Margin": data.totals.totalMargin,
      "Total Collection": data.totals.totalCollection,
      "Total Receivable": data.totals.totalReceivable,
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Loan Classification");
    XLSX.writeFile(wb, "loan_classification_report.xlsx");
  };

  const exportToPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Lamen Microfinance - Loan Classification Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);
    doc.text("Classification: Current (up to 12 months) / Long (over 12 months)", 14, 28);

    const rows = data.categories.map((cat) => [
      cat.category,
      cat.noOfLoans.toString(),
      formatCurrency(cat.totalPrinciple),
      formatCurrency(cat.totalProfit),
      formatCurrency(cat.total),
      formatCurrency(cat.totalPCollection),
      formatCurrency(cat.totalMargin),
      formatCurrency(cat.totalCollection),
      formatCurrency(cat.totalReceivable),
    ]);
    rows.push([
      "Total",
      data.totals.noOfLoans.toString(),
      formatCurrency(data.totals.totalPrinciple),
      formatCurrency(data.totals.totalProfit),
      formatCurrency(data.totals.total),
      formatCurrency(data.totals.totalPCollection),
      formatCurrency(data.totals.totalMargin),
      formatCurrency(data.totals.totalCollection),
      formatCurrency(data.totals.totalReceivable),
    ]);

    autoTable(doc, {
      head: [["Category", "No. of Loans", "Total Principle", "Total Profit", "Total", "Total P.Collection", "Total Margin", "Total Collection", "Total Receivable"]],
      body: rows,
      startY: 34,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 120, 74] },
    });

    doc.save("loan_classification_report.pdf");
  };

  const fmt = (val: number) => formatCurrency(val);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Loan Classification Report</h1>
          <p className="text-sm text-muted-foreground">Current (up to 12 months) vs Long-term (over 12 months) financing breakdown</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={exportToExcel} data-testid="button-export-excel" className="bg-green-600 text-white border-green-600">
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Excel
          </Button>
          <Button size="sm" onClick={exportToPDF} data-testid="button-export-pdf" className="bg-red-600 text-white border-red-600">
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <CardTitle>Financing Classification Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !data ? (
            <p className="text-center py-8 text-muted-foreground">No data available</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead data-testid="th-category">Category</TableHead>
                    <TableHead className="text-right" data-testid="th-no-of-loans">No. of Loans</TableHead>
                    <TableHead className="text-right" data-testid="th-total-principle">Total Principle</TableHead>
                    <TableHead className="text-right" data-testid="th-total-profit">Total Profit</TableHead>
                    <TableHead className="text-right" data-testid="th-total">Total</TableHead>
                    <TableHead className="text-right" data-testid="th-total-p-collection">Total P.Collection</TableHead>
                    <TableHead className="text-right" data-testid="th-total-margin">Total Margin</TableHead>
                    <TableHead className="text-right" data-testid="th-total-collection">Total Collection</TableHead>
                    <TableHead className="text-right" data-testid="th-total-receivable">Total Receivable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.categories.map((cat) => (
                    <TableRow key={cat.category} data-testid={`row-category-${cat.category.toLowerCase()}`}>
                      <TableCell className="font-medium" data-testid={`text-category-${cat.category.toLowerCase()}`}>{cat.category}</TableCell>
                      <TableCell className="text-right" data-testid={`text-loans-${cat.category.toLowerCase()}`}>{cat.noOfLoans}</TableCell>
                      <TableCell className="text-right" data-testid={`text-principle-${cat.category.toLowerCase()}`}>{fmt(cat.totalPrinciple)}</TableCell>
                      <TableCell className="text-right" data-testid={`text-profit-${cat.category.toLowerCase()}`}>{fmt(cat.totalProfit)}</TableCell>
                      <TableCell className="text-right font-medium" data-testid={`text-total-${cat.category.toLowerCase()}`}>{fmt(cat.total)}</TableCell>
                      <TableCell className="text-right" data-testid={`text-pcollection-${cat.category.toLowerCase()}`}>{fmt(cat.totalPCollection)}</TableCell>
                      <TableCell className="text-right" data-testid={`text-margin-${cat.category.toLowerCase()}`}>{fmt(cat.totalMargin)}</TableCell>
                      <TableCell className="text-right" data-testid={`text-collection-${cat.category.toLowerCase()}`}>{fmt(cat.totalCollection)}</TableCell>
                      <TableCell className="text-right font-medium" data-testid={`text-receivable-${cat.category.toLowerCase()}`}>{fmt(cat.totalReceivable)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 border-foreground/20 font-bold bg-muted/50" data-testid="row-totals">
                    <TableCell data-testid="text-total-label">Total</TableCell>
                    <TableCell className="text-right" data-testid="text-total-loans">{data.totals.noOfLoans}</TableCell>
                    <TableCell className="text-right" data-testid="text-total-principle">{fmt(data.totals.totalPrinciple)}</TableCell>
                    <TableCell className="text-right" data-testid="text-total-profit">{fmt(data.totals.totalProfit)}</TableCell>
                    <TableCell className="text-right" data-testid="text-total-total">{fmt(data.totals.total)}</TableCell>
                    <TableCell className="text-right" data-testid="text-total-pcollection">{fmt(data.totals.totalPCollection)}</TableCell>
                    <TableCell className="text-right" data-testid="text-total-margin">{fmt(data.totals.totalMargin)}</TableCell>
                    <TableCell className="text-right" data-testid="text-total-collection">{fmt(data.totals.totalCollection)}</TableCell>
                    <TableCell className="text-right" data-testid="text-total-receivable">{fmt(data.totals.totalReceivable)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
