import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Edit,
  Phone,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  Plus,
  ExternalLink,
  FileSpreadsheet,
  File,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Customer } from "@shared/schema";

type CustomerWithLoans = Customer & {
  activeLoans?: number;
  totalLoans?: number;
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loanDialogCustomer, setLoanDialogCustomer] = useState<CustomerWithLoans | null>(null);

  const { data, isLoading } = useQuery<{
    customers: CustomerWithLoans[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ["/api/customers", search, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const res = await fetch(`/api/customers?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch customers");
      return res.json();
    },
  });

  const { data: roleData } = useQuery<{ role: string }>({
    queryKey: ["/api/user/role"],
  });

  const { data: customerLoans = [], isLoading: loansLoading } = useQuery<any[]>({
    queryKey: ["/api/customers", loanDialogCustomer?.id, "loans"],
    queryFn: async () => {
      if (!loanDialogCustomer?.id) return [];
      const res = await fetch(`/api/customers/${loanDialogCustomer.id}/loans`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
    enabled: !!loanDialogCustomer,
  });

  const exportToExcel = () => {
    if (!data?.customers) return;
    const rows = data.customers.map((c) => ({
      "Customer Name": `${c.firstName || ""} ${c.lastName || ""}`.trim(),
      "Customer No": c.customerNo || "",
      "National ID": c.nationalId || "",
      "Phone": c.phoneNumber || "",
      "District": c.district || "",
      "Active Loans": c.activeLoans || 0,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "customers.xlsx");
  };

  const exportToPDF = () => {
    if (!data?.customers) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Customer List", 14, 15);
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleDateString()}`, 14, 22);
    const rows = data.customers.map((c) => [
      `${c.firstName || ""} ${c.lastName || ""}`.trim(),
      c.customerNo || "-",
      c.nationalId || "-",
      c.phoneNumber || "-",
      c.district || "-",
      String(c.activeLoans || 0),
    ]);
    autoTable(doc, {
      head: [["Customer Name", "Customer No", "National ID", "Phone", "District", "Active Loans"]],
      body: rows,
      startY: 28,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [109, 40, 217] },
    });
    doc.save("customers.pdf");
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "?";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30" },
      pending_fad_review: { label: "FAD Review", className: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30" },
      pending_risk_review: { label: "Risk Review", className: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30" },
      pending_committee_review: { label: "Committee", className: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30" },
      approved: { label: "Approved", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30" },
      disbursed: { label: "Disbursed", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" },
      active: { label: "Active", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" },
      completed: { label: "Completed", className: "bg-muted text-muted-foreground" },
      rejected: { label: "Rejected", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30" },
      risk_compliance_review: { label: "Risk Review", className: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30" },
    };
    const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-customers-title">Customers</h1>
            <p className="text-muted-foreground">
              Manage customer profiles and information
            </p>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
        <CardHeader className="bg-gradient-to-r from-violet-500/5 to-purple-500/5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, customer no, national ID, phone..."
                className="pl-10 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-customers"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-emerald-700 dark:text-emerald-400 border-emerald-500/40"
                onClick={exportToExcel}
                data-testid="button-export-excel"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button
                variant="outline"
                className="text-red-700 dark:text-red-400 border-red-500/40"
                onClick={exportToPDF}
                data-testid="button-export-pdf"
              >
                <File className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Customer No.</TableHead>
                  <TableHead className="font-semibold">National ID</TableHead>
                  <TableHead className="font-semibold">Phone</TableHead>
                  <TableHead className="font-semibold">District</TableHead>
                  <TableHead className="font-semibold">Active Loans</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : data?.customers && data.customers.length > 0 ? (
                  data.customers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-muted/30" data-testid={`row-customer-${customer.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-violet-500/20">
                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-semibold">
                              {getInitials(customer.firstName, customer.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {customer.firstName} {customer.lastName}
                            </div>
                            {customer.fatherName && (
                              <div className="text-xs text-muted-foreground">
                                s/o {customer.fatherName}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-primary font-medium">
                        {customer.customerNo || "-"}
                      </TableCell>
                      <TableCell>{customer.nationalId || "-"}</TableCell>
                      <TableCell>
                        {customer.phoneNumber && (
                          <div className="flex items-center gap-1.5 text-sm">
                            <div className="h-5 w-5 rounded bg-emerald-500/10 flex items-center justify-center">
                              <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            {customer.phoneNumber}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{customer.district || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${customer.activeLoans ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' : 'bg-muted text-muted-foreground'}`}>
                          {customer.activeLoans || 0} active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          <Button variant="ghost" size="icon" className="text-blue-600 dark:text-blue-400" asChild data-testid={`button-view-customer-${customer.id}`}>
                            <Link href={`/customers/${customer.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {(roleData?.role === "manager" || roleData?.role === "admin") && (
                            <Button variant="ghost" size="icon" className="text-amber-600 dark:text-amber-400" asChild data-testid={`button-edit-customer-${customer.id}`}>
                              <Link href={`/customers/${customer.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-violet-600 dark:text-violet-400"
                            onClick={() => setLoanDialogCustomer(customer)}
                            data-testid={`button-loan-details-${customer.id}`}
                            title="Loan Details"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-emerald-600 dark:text-emerald-400"
                            asChild
                            data-testid={`button-add-financing-${customer.id}`}
                            title="Add Financing"
                          >
                            <Link href={`/loan-application?customerId=${customer.id}`}>
                              <Plus className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">No customers found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} customers
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2 py-1 rounded bg-muted">
                  Page {page} of {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === data.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!loanDialogCustomer} onOpenChange={(open) => { if (!open) setLoanDialogCustomer(null); }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" data-testid="text-loan-dialog-title">
              <FileText className="h-5 w-5 text-primary" />
              Loan Details - {loanDialogCustomer?.firstName} {loanDialogCustomer?.lastName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-md bg-muted/30">
              <Avatar className="h-10 w-10 ring-2 ring-violet-500/20">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-semibold">
                  {getInitials(loanDialogCustomer?.firstName, loanDialogCustomer?.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">{loanDialogCustomer?.firstName} {loanDialogCustomer?.lastName}</div>
                <div className="text-sm text-muted-foreground">
                  {loanDialogCustomer?.customerNo && <span className="mr-3">No: {loanDialogCustomer.customerNo}</span>}
                  {loanDialogCustomer?.nationalId && <span>NID: {loanDialogCustomer.nationalId}</span>}
                </div>
              </div>
              <Button variant="outline" size="sm" asChild data-testid="button-add-financing-dialog">
                <Link href={`/loan-application?customerId=${loanDialogCustomer?.id}`}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Financing
                </Link>
              </Button>
            </div>

            {loansLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : customerLoans.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Application ID</TableHead>
                    <TableHead className="font-semibold">Product</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerLoans.map((loan: any) => (
                    <TableRow key={loan.id} data-testid={`row-loan-${loan.id}`}>
                      <TableCell className="font-mono text-sm text-primary font-medium">
                        {loan.applicationId || "-"}
                      </TableCell>
                      <TableCell>{loan.productName || "-"}</TableCell>
                      <TableCell>
                        {loan.requestAmount ? Number(loan.requestAmount).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>
                        {loan.financingDurationMonths ? `${loan.financingDurationMonths} months` : "-"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(loan.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild data-testid={`button-view-loan-${loan.id}`}>
                          <Link href={`/loans/${loan.id}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground">No loans found for this customer</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
