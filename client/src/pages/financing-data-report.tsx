import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBranch } from "@/contexts/branch-context";
import { Card, CardContent } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet, Search, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import * as XLSX from "xlsx";

// ─── Types ───────────────────────────────────────────────────────────────────

type FinancingRow = {
  branchName: string;
  officerName: string;
  customerNo: string;
  applicationId: string;
  customerName: string;
  fatherName: string;
  fullNameDari: string;
  gender: string;
  maritalStatus: string;
  numberOfDependents: number;
  nationalId: string;
  dateOfBirth: string;
  province: string;
  district: string;
  areaType: string;
  phoneNumber: string;
  secondPhoneNumber: string;
  productName: string;
  productCode: string;
  sector: string;
  businessType: string;
  financingPurpose: string;
  directMaleEmployee: number;
  directFemaleEmployee: number;
  indirectMaleEmployee: number;
  indirectFemaleEmployee: number;
  financingCycle: number;
  fundingSourceName: string;
  requestDate: string;
  requestAmount: number;
  financingDurationMonths: number;
  gracePeriod: number;
  numberOfInstallments: number;
  principleAmount: number;
  marginRate: number;
  profit: number;
  totalReceivable: number;
  installmentAmount: number;
  approvedAmount: number;
  approvedDate: string;
  committeeDiscussion: string;
  disbursementDate: string;
  disbursedAmount: number;
  maturityDate: string;
  bizVillage: string;
  bizDetailedAddress: string;
  bizYearsOfExperience: number;
  bizLicenseType: string;
  bizPresident: string;
  bizLicenseNumber: string;
  bizRegisterDate: string;
  bizExpiryDate: string;
  principleReceived: number;
  profitReceived: number;
  totalReceived: number;
  paidInstallments: number;
  remainingInstallments: number;
  principleOutstanding: number;
  profitOutstanding: number;
  totalOutstanding: number;
  lastPaymentDate: string;
  finalAging: number;
};

type BranchGroup = {
  branchName: string;
  rows: FinancingRow[];
  subtotal: {
    requestAmount: number; principleAmount: number; profit: number; totalReceivable: number;
    approvedAmount: number; disbursedAmount: number;
    principleReceived: number; profitReceived: number; totalReceived: number;
    principleOutstanding: number; profitOutstanding: number; totalOutstanding: number;
  };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const agingLabel = (days: number) => {
  if (days <= 0) return "—";
  if (days <= 30) return `${days}d`;
  if (days <= 90) return `${days}d (PAR30)`;
  return `${days}d (PAR90)`;
};

// ─── Column definitions ───────────────────────────────────────────────────────
type ColDef = { key: keyof FinancingRow | "sn"; label: string; w?: number; num?: boolean };

const COLS: ColDef[] = [
  { key: "sn",                  label: "S/N",             w: 50 },
  { key: "branchName",          label: "Branch",          w: 110 },
  { key: "officerName",         label: "F. Officer",      w: 120 },
  { key: "customerNo",          label: "Customer No",     w: 110 },
  { key: "applicationId",       label: "App. ID",         w: 110 },
  { key: "customerName",        label: "Name",            w: 150 },
  { key: "fatherName",          label: "F. Name",         w: 120 },
  { key: "fullNameDari",        label: "Full Name (Dari)",w: 140 },
  { key: "gender",              label: "Gender",          w: 80 },
  { key: "maritalStatus",       label: "Marital",         w: 80 },
  { key: "numberOfDependents",  label: "Dependents",      w: 90,  num: true },
  { key: "nationalId",          label: "NID #",           w: 110 },
  { key: "dateOfBirth",         label: "DoB",             w: 100 },
  { key: "province",            label: "Province",        w: 100 },
  { key: "district",            label: "District",        w: 100 },
  { key: "areaType",            label: "Urban/Rural",     w: 90 },
  { key: "phoneNumber",         label: "Phone",           w: 110 },
  { key: "secondPhoneNumber",   label: "2nd Phone",       w: 110 },
  { key: "productName",         label: "Product",         w: 110 },
  { key: "sector",              label: "Sector",          w: 110 },
  { key: "businessType",        label: "Business Type",   w: 130 },
  { key: "financingPurpose",    label: "Purpose",         w: 130 },
  { key: "directMaleEmployee",  label: "Direct Male Employee",   w: 110, num: true },
  { key: "directFemaleEmployee",label: "Direct Female Employee", w: 120, num: true },
  { key: "indirectMaleEmployee",label: "Indirect Male Employee", w: 120, num: true },
  { key: "indirectFemaleEmployee",label:"Indirect Female Employee",w:130, num: true },
  { key: "financingCycle",      label: "Cycle",           w: 60,  num: true },
  { key: "fundingSourceName",   label: "Source of Fund",  w: 120 },
  { key: "requestDate",         label: "Request Date",    w: 100 },
  { key: "requestAmount",       label: "Request Amt",     w: 110, num: true },
  { key: "financingDurationMonths", label: "Duration(Mo)", w: 90, num: true },
  { key: "gracePeriod",         label: "Grace Pd",        w: 75,  num: true },
  { key: "numberOfInstallments",label: "# Inst.",         w: 65,  num: true },
  { key: "principleAmount",     label: "Principle",       w: 110, num: true },
  { key: "marginRate",          label: "Margin %",        w: 80,  num: true },
  { key: "profit",              label: "Margin Amt",      w: 110, num: true },
  { key: "totalReceivable",     label: "Total Rcvble",    w: 110, num: true },
  { key: "installmentAmount",   label: "Inst. Amt",       w: 100, num: true },
  { key: "approvedAmount",      label: "Approved Amt",    w: 110, num: true },
  { key: "approvedDate",        label: "Approved Date",   w: 100 },
  { key: "disbursementDate",    label: "Disb. Date",      w: 100 },
  { key: "disbursedAmount",     label: "Disb. Amt",       w: 110, num: true },
  { key: "maturityDate",        label: "Maturity",        w: 100 },
  { key: "committeeDiscussion", label: "Committee Note",  w: 150 },
  { key: "bizVillage",          label: "Village",         w: 110 },
  { key: "bizDetailedAddress",  label: "Detailed Address",w: 160 },
  { key: "bizYearsOfExperience",label: "Yrs of Exp.",    w: 80, num: true },
  { key: "bizLicenseType",      label: "Type of Licence", w: 130 },
  { key: "bizPresident",        label: "President",       w: 130 },
  { key: "bizLicenseNumber",    label: "Business Lic. No #", w: 130 },
  { key: "bizRegisterDate",     label: "Lic. Register Date", w: 110 },
  { key: "bizExpiryDate",       label: "Lic. Expiry Date",   w: 110 },
  { key: "principleReceived",   label: "Prin. Received",  w: 110, num: true },
  { key: "profitReceived",      label: "Profit Rcvd",     w: 110, num: true },
  { key: "totalReceived",       label: "Total Rcvd",      w: 110, num: true },
  { key: "paidInstallments",    label: "Paid Inst.",      w: 80,  num: true },
  { key: "remainingInstallments",label:"Rem. Inst.",      w: 80,  num: true },
  { key: "principleOutstanding",label: "Prin. O/S",       w: 110, num: true },
  { key: "profitOutstanding",   label: "Profit O/S",      w: 110, num: true },
  { key: "totalOutstanding",    label: "Total O/S",       w: 110, num: true },
  { key: "lastPaymentDate",     label: "Last Pmt Date",   w: 110 },
  { key: "finalAging",          label: "Final Aging",     w: 100, num: true },
];

const MONEY_KEYS = new Set<keyof FinancingRow>([
  "requestAmount","principleAmount","profit","totalReceivable","installmentAmount",
  "approvedAmount","disbursedAmount","principleReceived","profitReceived","totalReceived",
  "principleOutstanding","profitOutstanding","totalOutstanding",
]);

// ─── Component ────────────────────────────────────────────────────────────────

export default function FinancingDataReport() {
  const { selectedBranchId, isLocked } = useBranch();
  const [branchId, setBranchId] = useState("all");

  useEffect(() => { setBranchId(selectedBranchId || "all"); }, [selectedBranchId]);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [fundingSourceId, setFundingSourceId] = useState("all");
  const [data, setData] = useState<FinancingRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: branchesData } = useQuery<{ id: string; name: string }[]>({ queryKey: ["/api/branches"] });
  const { data: fundingSourcesData } = useQuery<{ id: string; name: string }[]>({ queryKey: ["/api/funding-sources"] });

  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (branchId !== "all") params.append("branchId", branchId);
      if (fundingSourceId !== "all") params.append("fundingSourceId", fundingSourceId);
      const res = await fetch(`/api/reports/financing-data?${params}`, { credentials: "include" });
      if (res.status === 401) {
        setError("Your session has expired. Please refresh the page and sign in again.");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError((body as any).message || `Server error (${res.status}). Please try again.`);
        return;
      }
      setData(await res.json());
    } catch (e) {
      setError("Network error — could not reach the server. Please check your connection and try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Group by branch
  const { branchGroups, grandTotal } = useMemo(() => {
    if (!data || data.length === 0) return { branchGroups: [], grandTotal: null };

    const sumKeys = [
      "requestAmount","principleAmount","profit","totalReceivable",
      "approvedAmount","disbursedAmount",
      "principleReceived","profitReceived","totalReceived",
      "principleOutstanding","profitOutstanding","totalOutstanding",
    ] as const;

    const zeroTotals = () => Object.fromEntries(sumKeys.map(k => [k, 0])) as Record<typeof sumKeys[number], number>;

    const groupMap = new Map<string, FinancingRow[]>();
    for (const row of data) {
      const key = row.branchName || "Unknown";
      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key)!.push(row);
    }

    const gt = zeroTotals();
    const groups: BranchGroup[] = [];

    for (const [branchName, rows] of Array.from(groupMap.entries())) {
      const sub = zeroTotals();
      for (const r of rows) for (const k of sumKeys) sub[k] += r[k] as number;
      for (const k of sumKeys) gt[k] += sub[k];
      groups.push({ branchName, rows, subtotal: sub });
    }
    return { branchGroups: groups, grandTotal: gt };
  }, [data]);

  // ── Export Excel ──────────────────────────────────────────────────────────
  const handleExportExcel = () => {
    if (!data || !branchGroups.length) return;

    const header = COLS.map(c => c.label);
    const wsData: (string | number)[][] = [header];

    let sn = 1;
    for (const group of branchGroups) {
      for (const row of group.rows) {
        wsData.push(COLS.map(col => {
          if (col.key === "sn") return sn++;
          const v = row[col.key as keyof FinancingRow];
          if (col.key === "finalAging") return Number(v) > 0 ? Number(v) : 0;
          if (typeof v === "number") return v;
          if ((col.key === "disbursementDate" || col.key === "requestDate" ||
               col.key === "approvedDate" || col.key === "maturityDate" ||
               col.key === "lastPaymentDate" || col.key === "dateOfBirth") && v)
            return formatDate(v as string);
          return String(v ?? "");
        }));
      }
      // Branch subtotal row
      const subRow: (string | number)[] = Array(COLS.length).fill("");
      subRow[0] = "";
      subRow[1] = `SUBTOTAL — ${group.branchName}`;
      COLS.forEach((col, i) => {
        if (MONEY_KEYS.has(col.key as keyof FinancingRow)) {
          subRow[i] = (group.subtotal as any)[col.key] ?? 0;
        }
      });
      wsData.push(subRow);
    }

    // Grand total row
    if (grandTotal) {
      const gtRow: (string | number)[] = Array(COLS.length).fill("");
      gtRow[1] = "GRAND TOTAL";
      COLS.forEach((col, i) => {
        if (MONEY_KEYS.has(col.key as keyof FinancingRow)) {
          gtRow[i] = (grandTotal as any)[col.key] ?? 0;
        }
      });
      wsData.push(gtRow);
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    // Set column widths
    ws["!cols"] = COLS.map(c => ({ wch: Math.round((c.w || 100) / 7) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financing Data");
    XLSX.writeFile(wb, `Financing_Data_${startDate}_${endDate}.xlsx`);
  };

  // ── Render cell value ─────────────────────────────────────────────────────
  const cellValue = (col: ColDef, row: FinancingRow, sn: number): string => {
    if (col.key === "sn") return String(sn);
    const v = row[col.key as keyof FinancingRow];
    if (col.key === "finalAging") return agingLabel(Number(v));
    if (MONEY_KEYS.has(col.key as keyof FinancingRow)) return fmt(Number(v));
    if ((col.key === "disbursementDate" || col.key === "requestDate" ||
         col.key === "approvedDate"     || col.key === "maturityDate" ||
         col.key === "lastPaymentDate"  || col.key === "dateOfBirth" ||
         col.key === "bizRegisterDate"  || col.key === "bizExpiryDate") && v)
      return formatDate(v as string);
    if (col.key === "marginRate") return `${Number(v).toFixed(2)}%`;
    return String(v ?? "—");
  };

  // ── Subtotal cell ─────────────────────────────────────────────────────────
  const subCell = (col: ColDef, sub: BranchGroup["subtotal"]): string => {
    if (MONEY_KEYS.has(col.key as keyof FinancingRow)) return fmt((sub as any)[col.key] ?? 0);
    return "";
  };

  const totalLoans = data?.length ?? 0;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Financing Data Report</h1>
          <p className="text-sm text-muted-foreground">Detailed MIS report for all disbursed loans</p>
        </div>
        {data && (
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2">
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            Export Excel
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Start Date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Branch</Label>
              <Select value={branchId} onValueChange={setBranchId} disabled={isLocked}>
                <SelectTrigger><SelectValue placeholder="All Branches" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branchesData?.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Funding Source</Label>
              <Select value={fundingSourceId} onValueChange={setFundingSourceId}>
                <SelectTrigger><SelectValue placeholder="All Sources" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {fundingSourcesData?.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={fetchReport} disabled={isLoading} className="gap-2">
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {isLoading ? "Loading…" : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary banner */}
      {data && (
        <div className="flex gap-4 flex-wrap text-sm">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded px-3 py-1.5">
            <span className="text-muted-foreground">Total Loans: </span>
            <strong>{totalLoans}</strong>
          </div>
          {grandTotal && (
            <>
              <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded px-3 py-1.5">
                <span className="text-muted-foreground">Disbursed: </span>
                <strong>{fmt(grandTotal.disbursedAmount)} AFN</strong>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded px-3 py-1.5">
                <span className="text-muted-foreground">Total Received: </span>
                <strong>{fmt(grandTotal.totalReceived)} AFN</strong>
              </div>
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded px-3 py-1.5">
                <span className="text-muted-foreground">Outstanding: </span>
                <strong>{fmt(grandTotal.totalOutstanding)} AFN</strong>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
          <span className="mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      )}

      {/* Table */}
      {!isLoading && data && data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="text-[11px] border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-800 text-white">
                {COLS.map(col => (
                  <th
                    key={col.key}
                    className="px-2 py-2 text-center font-semibold border-r border-slate-600 whitespace-nowrap"
                    style={{ minWidth: col.w, maxWidth: col.w }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {branchGroups.map((group) => {
                let snCounter = data.findIndex(r => r === group.rows[0]) + 1;
                return (
                  <>
                    {/* Branch header row */}
                    <tr key={`hdr-${group.branchName}`} className="bg-blue-100 dark:bg-blue-900">
                      <td
                        colSpan={COLS.length}
                        className="px-3 py-1 font-semibold text-blue-800 dark:text-blue-200 text-xs"
                      >
                        🏢 {group.branchName}
                      </td>
                    </tr>

                    {/* Data rows */}
                    {group.rows.map((row, ri) => {
                      const sn = snCounter++;
                      return (
                        <tr
                          key={`${group.branchName}-${ri}`}
                          className={ri % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800"}
                        >
                          {COLS.map(col => {
                            const isAging = col.key === "finalAging";
                            const agingVal = isAging ? Number(row.finalAging) : 0;
                            return (
                              <td
                                key={col.key}
                                className={`px-2 py-1 border-b border-r border-slate-200 dark:border-slate-700 whitespace-nowrap overflow-hidden text-ellipsis
                                  ${col.num ? "text-right tabular-nums" : "text-left"}
                                  ${isAging && agingVal > 30 ? "text-red-600 font-medium" : ""}
                                  ${isAging && agingVal > 0 && agingVal <= 30 ? "text-amber-600" : ""}
                                `}
                                style={{ maxWidth: col.w }}
                                title={cellValue(col, row, sn)}
                              >
                                {cellValue(col, row, sn)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    {/* Branch subtotal */}
                    <tr key={`sub-${group.branchName}`} className="bg-blue-50 dark:bg-blue-950 font-semibold">
                      <td className="px-2 py-1 border-b border-r border-slate-300 text-center text-blue-700">{group.rows.length}</td>
                      <td colSpan={3} className="px-2 py-1 border-b border-r border-slate-300 text-blue-700 text-xs">
                        Subtotal — {group.branchName}
                      </td>
                      {COLS.slice(4).map(col => (
                        <td
                          key={`sub-${col.key}`}
                          className="px-2 py-1 border-b border-r border-slate-300 text-right tabular-nums text-blue-800 dark:text-blue-200 text-[11px]"
                        >
                          {subCell(col, group.subtotal)}
                        </td>
                      ))}
                    </tr>
                  </>
                );
              })}

              {/* Grand total */}
              {grandTotal && (
                <tr className="bg-slate-800 text-white font-bold">
                  <td className="px-2 py-2 text-center">{totalLoans}</td>
                  <td colSpan={3} className="px-2 py-2 text-xs">GRAND TOTAL</td>
                  {COLS.slice(4).map(col => (
                    <td
                      key={`gt-${col.key}`}
                      className="px-2 py-2 text-right tabular-nums text-[11px]"
                    >
                      {MONEY_KEYS.has(col.key as keyof FinancingRow)
                        ? fmt((grandTotal as any)[col.key] ?? 0)
                        : ""}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && data && data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No disbursed loans found for the selected criteria.
        </div>
      )}

      {!isLoading && !data && (
        <div className="text-center py-16 text-muted-foreground text-sm">
          Select your filters and click <strong>Generate Report</strong> to view the financing data.
        </div>
      )}
    </div>
  );
}
