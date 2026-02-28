import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  Eye,
  PiggyBank,
  Calendar,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  QrCode,
} from "lucide-react";
import { Link } from "wouter";
import type { Loan } from "@shared/schema";
import { generateQRText, generateQRWithLogo, downloadQRCode, type QRLoanData } from "@/lib/qr-generator";

type ApprovedLoan = Loan & {
  customerName?: string;
  branchName?: string;
  approvedAmount?: string;
  approvedDate?: string;
};

type BulkResult = {
  applicationId: string;
  success: boolean;
  error?: string;
};

type BulkResponse = {
  message: string;
  successCount: number;
  failCount: number;
  results: BulkResult[];
};

export default function DisbursementsPage() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<ApprovedLoan | null>(null);
  const [showDisburseDialog, setShowDisburseDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrLoanInfo, setQrLoanInfo] = useState<QRLoanData | null>(null);
  const [bulkResults, setBulkResults] = useState<BulkResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customDisbursementDate, setCustomDisbursementDate] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: roleData } = useQuery<{ role: string; roleType: string }>({
    queryKey: ["/api/user/role"],
  });
  const userRole = roleData?.role || "";
  const canPickDate = userRole === "ceo" || userRole === "admin";

  const { data: loans, isLoading } = useQuery<ApprovedLoan[]>({
    queryKey: ["/api/loans/approved", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const url = params.toString() ? `/api/loans/approved?${params.toString()}` : "/api/loans/approved";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch approved loans");
      return res.json();
    },
  });

  const disburseMutation = useMutation({
    mutationFn: async (loanId: string) => {
      const body: any = {};
      if (canPickDate && customDisbursementDate) {
        body.disbursementDate = customDisbursementDate;
      }
      const res = await apiRequest("POST", `/api/loans/${loanId}/disburse`, body);
      return res.json();
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans/approved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Financing Disbursed",
        description: "The financing has been disbursed successfully.",
      });
      setShowDisburseDialog(false);

      if (selectedLoan) {
        const qrData: QRLoanData = {
          applicationId: selectedLoan.applicationId || "",
          customerName: selectedLoan.customerName || "Unknown",
          amount: selectedLoan.approvedAmount || selectedLoan.requestAmount || "0",
          disbursementDate: (canPickDate && customDisbursementDate) ? customDisbursementDate : new Date().toISOString().split("T")[0],
          productName: selectedLoan.productName || "Murabaha",
          durationMonths: selectedLoan.financingDurationMonths || 12,
        };
        try {
          const text = generateQRText(qrData);
          const url = await generateQRWithLogo(text, 450);
          setQrLoanInfo(qrData);
          setQrDataUrl(url);
          setShowQRDialog(true);
        } catch (err) {
          console.error("Failed to generate QR code:", err);
        }
      }
      setSelectedLoan(null);
      setCustomDisbursementDate("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to disburse loan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const bulkDisburseMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/loans/bulk-disburse", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to process bulk disbursement");
      }
      return res.json() as Promise<BulkResponse>;
    },
    onSuccess: (data) => {
      setBulkResults(data);
      queryClient.invalidateQueries({ queryKey: ["/api/loans/approved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      toast({
        title: "Bulk Disbursement Complete",
        description: data.message,
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return "AFN 0";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    const day = d.getDate().toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        toast({
          title: "Invalid File",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setBulkResults(null);
    }
  };

  const handleBulkUpload = () => {
    if (selectedFile) {
      bulkDisburseMutation.mutate(selectedFile);
    }
  };

  const downloadTemplate = () => {
    const headers = "Application ID,Customer Name,Branch,Principal Amount,Profit,Duration,Grace Period,Disbursement Date\n";
    const example = "1021100194,Example Customer,Branch Name,50000,5000,12,2,2026-01-15\n";
    const blob = new Blob([headers + example], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "disbursement-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-disbursements-title">Disbursements</h1>
          <p className="text-muted-foreground">
            Manage financing disbursements for approved applications
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {loans?.length || 0} ready to disburse
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList>
          <TabsTrigger value="individual" data-testid="tab-individual-disburse">
            <PiggyBank className="mr-2 h-4 w-4" />
            Individual Disbursement
          </TabsTrigger>
          <TabsTrigger value="bulk" data-testid="tab-bulk-disburse">
            <Upload className="mr-2 h-4 w-4" />
            Bulk CSV Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-4">
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search approved loans..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="input-search-disbursements"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Approved Amount</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Approved Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 8 }).map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : loans && loans.length > 0 ? (
                      loans.map((loan) => (
                        <TableRow key={loan.id} data-testid={`row-disbursement-${loan.id}`}>
                          <TableCell className="font-mono text-sm">
                            {loan.applicationId || "-"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {loan.customerName || "-"}
                          </TableCell>
                          <TableCell>{loan.branchName || "-"}</TableCell>
                          <TableCell>{loan.productName || "-"}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(loan.approvedAmount || loan.requestAmount)}
                          </TableCell>
                          <TableCell>
                            {loan.financingDurationMonths ? `${loan.financingDurationMonths}m` : "-"}
                          </TableCell>
                          <TableCell>{formatDate(loan.approvedDate)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/loans/${loan.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setShowDisburseDialog(true);
                                }}
                                data-testid={`button-disburse-${loan.id}`}
                              >
                                <PiggyBank className="mr-1 h-3 w-3" />
                                Disburse
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <PiggyBank className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No approved loans ready for disbursement</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="mt-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Bulk Disbursement via CSV Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
                  <h3 className="font-semibold text-sm">Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Download the CSV template or prepare your own CSV file</li>
                    <li>Fill in the <strong className="text-foreground">Application ID</strong> and <strong className="text-foreground">Disbursement Date</strong> columns (accepted formats: YYYY-MM-DD, DD-Mon-YY, or MM/DD/YYYY)</li>
                    <li>Upload the completed CSV file</li>
                    <li>The system will automatically:
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                        <li>Update loan status to "Disbursed"</li>
                        <li>Create disbursement records</li>
                        <li>Calculate first installment date (25th-day rule)</li>
                        <li>Generate all installments with grace period logic</li>
                      </ul>
                    </li>
                  </ol>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      <strong>25th-day rule:</strong> If disbursed before the 25th, first installment = same day next month. 
                      If disbursed on or after the 25th, first installment = 1st of month after next.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Grace period:</strong> During grace period months, customer pays only profit/margin. After grace period, customer pays principal + profit.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button variant="outline" onClick={downloadTemplate} data-testid="button-download-template">
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV Template
                  </Button>
                </div>

                <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile ? (
                        <span className="text-foreground font-medium">{selectedFile.name}</span>
                      ) : (
                        "Select a CSV file to upload"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      data-testid="input-csv-file"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="button-select-csv"
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      {selectedFile ? "Change File" : "Select CSV File"}
                    </Button>
                    {selectedFile && (
                      <Button
                        onClick={handleBulkUpload}
                        disabled={bulkDisburseMutation.isPending}
                        data-testid="button-process-bulk"
                      >
                        {bulkDisburseMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Process Disbursements
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {bulkResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {bulkResults.failCount === 0 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : bulkResults.successCount > 0 ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    Processing Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {bulkResults.successCount} Successful
                    </Badge>
                    {bulkResults.failCount > 0 && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400">
                        <XCircle className="mr-1 h-3 w-3" />
                        {bulkResults.failCount} Failed
                      </Badge>
                    )}
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bulkResults.results.map((result, idx) => (
                          <TableRow key={idx} data-testid={`row-bulk-result-${idx}`}>
                            <TableCell className="font-mono text-sm">{result.applicationId}</TableCell>
                            <TableCell>
                              {result.success ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Success
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Failed
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {result.success ? "Disbursed with installments generated" : result.error}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showDisburseDialog} onOpenChange={setShowDisburseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Disbursement</DialogTitle>
            <DialogDescription>
              Disburse funds for loan application {selectedLoan?.applicationId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Customer:</span>
                <p className="font-medium">{selectedLoan?.customerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Branch:</span>
                <p className="font-medium">{selectedLoan?.branchName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Product:</span>
                <p className="font-medium">{selectedLoan?.productName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p className="font-medium">{selectedLoan?.financingDurationMonths} months</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Disbursement Amount</span>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(selectedLoan?.approvedAmount || selectedLoan?.requestAmount || 0)}
                </p>
              </div>
            </div>
            {canPickDate && (
              <div className="space-y-2">
                <Label htmlFor="disbursement-date">Disbursement Date</Label>
                <Input
                  id="disbursement-date"
                  type="date"
                  value={customDisbursementDate}
                  onChange={(e) => setCustomDisbursementDate(e.target.value)}
                  data-testid="input-disbursement-date"
                />
                <p className="text-xs text-muted-foreground">
                  {customDisbursementDate
                    ? `Disbursement will be recorded on ${customDisbursementDate}`
                    : "Leave empty to use today's date"}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisburseDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedLoan && disburseMutation.mutate(selectedLoan.id)}
              disabled={disburseMutation.isPending}
              data-testid="button-confirm-disburse"
            >
              {disburseMutation.isPending ? "Processing..." : "Confirm Disbursement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Loan QR Code
            </DialogTitle>
            <DialogDescription>
              Disbursement QR code for {qrLoanInfo?.applicationId}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4 space-y-4">
            {qrDataUrl && (
              <div className="border-2 border-muted rounded-xl p-4 bg-white">
                <img src={qrDataUrl} alt="Loan QR Code" className="w-[400px] h-[400px]" data-testid="img-qr-code" />
              </div>
            )}
            {qrLoanInfo && (
              <div className="text-xs text-muted-foreground text-center space-y-0.5">
                <p className="font-semibold text-foreground">{qrLoanInfo.applicationId}</p>
                <p>{qrLoanInfo.customerName}</p>
                <p>AFN {Number(qrLoanInfo.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                <p>{qrLoanInfo.productName} - {qrLoanInfo.durationMonths} months</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowQRDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (qrDataUrl && qrLoanInfo) {
                  downloadQRCode(qrDataUrl, `QR_${qrLoanInfo.applicationId}.png`);
                }
              }}
              data-testid="button-download-qr"
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
