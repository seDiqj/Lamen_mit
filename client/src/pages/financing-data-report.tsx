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
import * as XLSX from "xlsx-js-style";

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
  bizProvince: string;
  bizDistrict: string;
  bizVillage: string;
  bizDetailedAddress: string;
  bizYearsOfExperience: number;
  bizLicenseType: string;
  bizPresident: string;
  bizLicenseNumber: string;
  bizRegisterDate: string;
  bizExpiryDate: string;
  colOwnerName: string;
  colOwnerNid: string;
  colProvince: string;
  colDistrict: string;
  colVillage: string;
  colAddress: string;
  colPurchasedPrice: number;
  colMarketPrice: number;
  colType: string;
  colTitleDeed: string;
  firstGuarantorName: string;
  firstGuarantorFatherName: string;
  firstGuarantorNid: string;
  firstGuarantorDateOfBirth: string;
  firstGuarantorNidExpiryDate: string;
  firstGuarantorPhone: string;
  firstGuarantorHomeAddress: string;
  firstGuarantorProvince: string;
  firstGuarantorDistrict: string;
  firstGuarantorBusiness: string;
  firstGuarantorBusinessAddress: string;
  firstGuarantorRelationship: string;
  firstGuarantorYearsOfExperience: number;
  firstGuarantorAsset: number;
  firstGuarantorMonthlyIncome: number;
  secondGuarantorName: string;
  secondGuarantorFatherName: string;
  secondGuarantorNid: string;
  secondGuarantorDateOfBirth: string;
  secondGuarantorNidExpiryDate: string;
  secondGuarantorPhone: string;
  secondGuarantorHomeAddress: string;
  secondGuarantorProvince: string;
  secondGuarantorDistrict: string;
  secondGuarantorBusiness: string;
  secondGuarantorBusinessAddress: string;
  secondGuarantorRelationship: string;
  secondGuarantorYearsOfExperience: number;
  secondGuarantorAsset: number;
  secondGuarantorMonthlyIncome: number;
  familyGuarantorName: string;
  familyGuarantorFatherName: string;
  familyGuarantorNid: string;
  familyGuarantorDateOfBirth: string;
  familyGuarantorNidExpiryDate: string;
  familyGuarantorPhone: string;
  familyGuarantorProvince: string;
  familyGuarantorDistrict: string;
  familyGuarantorHomeAddress: string;
  familyGuarantorRelationship: string;
  committeeFinancingDurationMonths: number;
  committeeGracePeriod: number;
  disbursementMargin: number;
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
  par1No: number;
  par1Amount: number;
  par30No: number;
  par30Amount: number;
  paidInstallmentDetails: PaidInstallmentDetail[];
};

type PaidInstallmentDetail = {
  installmentNumber: number;
  paymentDate: string;
  paymentAmount: number;
  remainingBalance: number;
};

type BranchGroup = {
  branchName: string;
  rows: FinancingRow[];
  subtotal: {
    requestAmount: number; principleAmount: number; profit: number; totalReceivable: number;
    approvedAmount: number; disbursedAmount: number;
    principleReceived: number; profitReceived: number; totalReceived: number;
    principleOutstanding: number; profitOutstanding: number; totalOutstanding: number;
    par1Amount: number; par30Amount: number;
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
type ColDef = {
  key: string;
  label: string;
  w?: number;
  num?: boolean;
  installmentNumber?: number;
  installmentField?: "paymentDate" | "paymentAmount" | "remainingBalance";
};

const BASE_COLS: ColDef[] = [
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
  { key: "bizProvince",        label: "Province",        w: 110 },
  { key: "bizDistrict",        label: "District",        w: 110 },
  { key: "bizVillage",          label: "Village",         w: 110 },
  { key: "bizDetailedAddress",  label: "Detailed Address",w: 160 },
  { key: "bizYearsOfExperience",label: "Yrs of Exp.",    w: 80, num: true },
  { key: "bizLicenseType",      label: "Type of Licence", w: 130 },
  { key: "bizPresident",        label: "President",       w: 130 },
  { key: "bizLicenseNumber",    label: "Business Lic. No #", w: 130 },
  { key: "bizRegisterDate",     label: "Lic. Register Date", w: 110 },
  { key: "bizExpiryDate",       label: "Lic. Expiry Date",   w: 110 },
  { key: "colOwnerName",        label: "Owner/s",            w: 140 },
  { key: "colOwnerNid",         label: "Owner NID",          w: 120 },
  { key: "colProvince",         label: "Province",           w: 100 },
  { key: "colDistrict",         label: "District",           w: 100 },
  { key: "colVillage",          label: "Village",            w: 110 },
  { key: "colAddress",          label: "Address",            w: 160 },
  { key: "colPurchasedPrice",   label: "Purchased Price",    w: 120, num: true },
  { key: "colMarketPrice",      label: "Market Price",       w: 110, num: true },
  { key: "colType",             label: "Type",               w: 110 },
  { key: "colTitleDeed",        label: "Title Deed No",      w: 120 },
  { key: "firstGuarantorName",             label: "Name",                    w: 140 },
  { key: "firstGuarantorFatherName",       label: "F. Name",                 w: 120 },
  { key: "firstGuarantorNid",              label: "NID #",                   w: 110 },
  { key: "firstGuarantorDateOfBirth",      label: "Date Of Birth",           w: 100 },
  { key: "firstGuarantorNidExpiryDate",    label: "NID Expiry Date",         w: 110 },
  { key: "firstGuarantorPhone",            label: "Phone #",                 w: 110 },
  { key: "firstGuarantorHomeAddress",      label: "Home Address",            w: 160 },
  { key: "firstGuarantorProvince",         label: "Province",                w: 110 },
  { key: "firstGuarantorDistrict",         label: "District",                w: 110 },
  { key: "firstGuarantorBusiness",         label: "Business",                w: 130 },
  { key: "firstGuarantorBusinessAddress",  label: "Business Add",             w: 160 },
  { key: "firstGuarantorRelationship",     label: "Relationship with Customer", w: 150 },
  { key: "firstGuarantorYearsOfExperience",label: "Years of Experience",      w: 120, num: true },
  { key: "firstGuarantorAsset",            label: "Asset (AFN)",              w: 110, num: true },
  { key: "firstGuarantorMonthlyIncome",    label: "Monthly Net Income",       w: 130, num: true },
  { key: "secondGuarantorName",             label: "Name",                    w: 140 },
  { key: "secondGuarantorFatherName",       label: "F. Name",                 w: 120 },
  { key: "secondGuarantorNid",              label: "NID #",                   w: 110 },
  { key: "secondGuarantorDateOfBirth",      label: "Date Of Birth",           w: 100 },
  { key: "secondGuarantorNidExpiryDate",    label: "NID Expiry Date",         w: 110 },
  { key: "secondGuarantorPhone",            label: "Phone #",                 w: 110 },
  { key: "secondGuarantorHomeAddress",      label: "Home Address",            w: 160 },
  { key: "secondGuarantorProvince",         label: "Province",                w: 110 },
  { key: "secondGuarantorDistrict",         label: "District",                w: 110 },
  { key: "secondGuarantorBusiness",         label: "Business",                w: 130 },
  { key: "secondGuarantorBusinessAddress",  label: "Business Add",             w: 160 },
  { key: "secondGuarantorRelationship",     label: "Relationship with Customer", w: 150 },
  { key: "secondGuarantorYearsOfExperience",label: "Years of Experience",      w: 120, num: true },
  { key: "secondGuarantorAsset",            label: "Asset (AFN)",              w: 110, num: true },
  { key: "secondGuarantorMonthlyIncome",    label: "Monthly Net Income",       w: 130, num: true },
  { key: "familyGuarantorName",             label: "Name",                    w: 140 },
  { key: "familyGuarantorFatherName",       label: "F. Name",                 w: 120 },
  { key: "familyGuarantorNid",              label: "NID #",                   w: 110 },
  { key: "familyGuarantorDateOfBirth",      label: "Date Of Birth",           w: 100 },
  { key: "familyGuarantorNidExpiryDate",    label: "NID Expiry Date",         w: 110 },
  { key: "familyGuarantorPhone",            label: "Phone #",                 w: 110 },
  { key: "familyGuarantorProvince",         label: "Province",                w: 110 },
  { key: "familyGuarantorDistrict",         label: "District",                w: 110 },
  { key: "familyGuarantorHomeAddress",      label: "Home Address",             w: 160 },
  { key: "familyGuarantorRelationship",     label: "Relationship with Customer", w: 150 },
  { key: "approvedAmount",                 label: "Approved Amount",          w: 120, num: true },
  { key: "approvedDate",                   label: "Approved Date",            w: 110 },
  { key: "committeeFinancingDurationMonths", label: "Financing Duration (Months)", w: 140, num: true },
  { key: "committeeGracePeriod",           label: "Grace Period",              w: 100, num: true },
  { key: "disbursementDate",               label: "Disbursement Date",         w: 130 },
  { key: "disbursedAmount",                label: "Disbursement Amount",       w: 140, num: true },
  { key: "maturityDate",                   label: "Maturity Date",             w: 110 },
  { key: "disbursementMargin",             label: "Margin",                    w: 110, num: true },
  { key: "committeeDiscussion",            label: "Committee Discussion",      w: 160 },
];

const SUMMARY_COLS: ColDef[] = [
  { key: "principleReceived",    label: "Principle Received",       w: 120, num: true },
  { key: "profitReceived",       label: "Profit Received",           w: 120, num: true },
  { key: "totalReceived",        label: "Total Received",            w: 120, num: true },
  { key: "paidInstallments",     label: "No Of Paid Installment",    w: 130, num: true },
  { key: "remainingInstallments",label: "No Of Remaining Installment",w: 150, num: true },
  { key: "principleOutstanding", label: "Principle Outstanding", w: 135, num: true },
  { key: "profitOutstanding",    label: "Profit Outstanding",    w: 135, num: true },
  { key: "totalOutstanding",     label: "Total Outstanding",     w: 135, num: true },
  { key: "lastPaymentDate",      label: "Last Payment Date",     w: 130 },
  { key: "finalAging",           label: "Final Aging",            w: 100, num: true },
  { key: "par1No",               label: "PAR>1 No",                w: 100, num: true },
  { key: "par1Amount",           label: "PAR>1 Amount",            w: 120, num: true },
  { key: "par30No",              label: "PAR>30 No",               w: 110, num: true },
  { key: "par30Amount",          label: "PAR>30 Amount",           w: 130, num: true },
];

const STATIC_COLUMN_GROUPS = [
  { label: "Customer Information", start: 3, span: 15, className: "bg-blue-700" },
  { label: "Financing Application Information", start: 18, span: 20, className: "bg-amber-700" },
  { label: "Customer Business Information", start: 38, span: 5, className: "bg-teal-700" },
  { label: "Business License Information", start: 43, span: 5, className: "bg-indigo-700" },
  { label: "Collateral Information", start: 48, span: 10, className: "bg-green-800" },
  { label: "First Financial Guarantor Information", start: 58, span: 15, className: "bg-cyan-700" },
  { label: "Second Financial Guarantor Information", start: 73, span: 15, className: "bg-sky-700" },
  { label: "Family Guarantor", start: 88, span: 10, className: "bg-lime-700" },
  { label: "Financing Committee Decision", start: 98, span: 4, className: "bg-emerald-700" },
  { label: "Disbursement Information", start: 102, span: 5, className: "bg-green-700" },
];

const ordinalLabel = (value: number) => {
  const suffix = value % 100 >= 11 && value % 100 <= 13
    ? "th"
    : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[value % 10] || "th";
  return `${value}${suffix} Installment`;
};

const paidInstallmentColumns = (numbers: number[]): ColDef[] =>
  numbers.flatMap((number) => [
    { key: `installment-${number}-paymentDate`, label: "Payment Date", w: 115, installmentNumber: number, installmentField: "paymentDate" },
    { key: `installment-${number}-paymentAmount`, label: "Payment Amount", w: 125, num: true, installmentNumber: number, installmentField: "paymentAmount" },
    { key: `installment-${number}-remainingBalance`, label: "Remaining Balance", w: 135, num: true, installmentNumber: number, installmentField: "remainingBalance" },
  ]);

const MONEY_KEYS = new Set<keyof FinancingRow>([
  "requestAmount","principleAmount","profit","totalReceivable","installmentAmount",
  "approvedAmount","disbursedAmount","principleReceived","profitReceived","totalReceived",
  "principleOutstanding","profitOutstanding","totalOutstanding","par1Amount","par30Amount",
]);

const GUARANTOR_MONEY_KEYS = new Set<keyof FinancingRow>([
  "firstGuarantorAsset","firstGuarantorMonthlyIncome",
  "secondGuarantorAsset","secondGuarantorMonthlyIncome",
  "disbursementMargin",
]);

const DISPLAY_MONEY_KEYS = new Set<keyof FinancingRow>([
  ...MONEY_KEYS,
  ...GUARANTOR_MONEY_KEYS,
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

  const paidInstallmentNumbers = useMemo(() => {
    const numbers = new Set<number>();
    for (const row of data ?? []) {
      for (const detail of row.paidInstallmentDetails ?? []) {
        if (detail.installmentNumber > 0 && detail.paymentAmount > 0) {
          numbers.add(detail.installmentNumber);
        }
      }
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }, [data]);

  const cols = useMemo(
    () => [...BASE_COLS, ...paidInstallmentColumns(paidInstallmentNumbers), ...SUMMARY_COLS],
    [paidInstallmentNumbers],
  );

  const columnGroups = useMemo(
    () => [
      ...STATIC_COLUMN_GROUPS,
      ...paidInstallmentNumbers.map((number, index) => ({
        label: ordinalLabel(number),
        start: BASE_COLS.length + index * 3,
        span: 3,
        className: index % 2 === 0 ? "bg-violet-700" : "bg-purple-700",
      })),
      {
        label: "Received Amount",
        start: BASE_COLS.length + paidInstallmentNumbers.length * 3,
        span: 5,
        className: "bg-slate-500",
      },
      {
        label: "Remaining Outstanding",
        start: BASE_COLS.length + paidInstallmentNumbers.length * 3 + 5,
        span: 4,
        className: "bg-amber-700",
      },
      {
        label: "PAR Calculation",
        start: BASE_COLS.length + paidInstallmentNumbers.length * 3 + 9,
        span: 5,
        className: "bg-blue-700",
      },
    ],
    [paidInstallmentNumbers],
  );

  const groupsByStart = useMemo(
    () => new Map(columnGroups.map(group => [group.start, group])),
    [columnGroups],
  );

  const groupedColumnIndexes = useMemo(
    () => new Set(columnGroups.flatMap(group =>
      Array.from({ length: group.span }, (_, index) => group.start + index),
    )),
    [columnGroups],
  );

  const groupedColumns = useMemo(
    () => columnGroups.flatMap(group => cols.slice(group.start, group.start + group.span)),
    [columnGroups, cols],
  );

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
      "par1Amount","par30Amount",
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

    const header = cols.map(c => c.label);
    const groupHeader: (string | number)[] = Array(cols.length).fill("");
    const subHeader = [...header];
    const merges: XLSX.Range[] = [];

    for (const group of columnGroups) {
      groupHeader[group.start] = group.label;
      merges.push({
        s: { r: 0, c: group.start },
        e: { r: 0, c: group.start + group.span - 1 },
      });
    }

    // The first three columns are row-spanning headers on screen.
    for (let index = 0; index < cols.length; index++) {
      if (groupedColumnIndexes.has(index)) continue;
      groupHeader[index] = cols[index].label;
      subHeader[index] = "";
      merges.push({ s: { r: 0, c: index }, e: { r: 1, c: index } });
    }

    const wsData: (string | number)[][] = [groupHeader, subHeader];
    const branchHeaderRows: number[] = [];
    const dataRows: Array<{ sheetRow: number; row: FinancingRow; alternate: boolean }> = [];
    const subtotalRows: number[] = [];

    let sn = 1;
    for (const group of branchGroups) {
      const branchHeader: (string | number)[] = Array(cols.length).fill("");
      branchHeader[0] = `🏢 ${group.branchName}`;
      branchHeaderRows.push(wsData.length);
      wsData.push(branchHeader);
      merges.push({ s: { r: wsData.length - 1, c: 0 }, e: { r: wsData.length - 1, c: cols.length - 1 } });

      for (const [rowIndex, row] of group.rows.entries()) {
        dataRows.push({ sheetRow: wsData.length, row, alternate: rowIndex % 2 === 1 });
        wsData.push(cols.map(col => {
          if (col.key === "sn") return sn++;
          if (col.installmentNumber && col.installmentField) {
            const detail = row.paidInstallmentDetails.find(
              item => item.installmentNumber === col.installmentNumber,
            );
            if (!detail) return "";
            const value = detail[col.installmentField];
            return col.installmentField === "paymentDate"
              ? (value ? formatDate(String(value)) : "")
              : Number(value);
          }
          const v = row[col.key as keyof FinancingRow];
          if (col.key === "finalAging") return agingLabel(Number(v));
          if (typeof v === "number") return v;
          if ((col.key === "disbursementDate" || col.key === "requestDate" ||
               col.key === "approvedDate" || col.key === "maturityDate" ||
                col.key === "lastPaymentDate" || col.key === "dateOfBirth" ||
                col.key === "firstGuarantorDateOfBirth" ||
                col.key === "firstGuarantorNidExpiryDate" ||
                col.key === "secondGuarantorDateOfBirth" ||
                col.key === "secondGuarantorNidExpiryDate" ||
                col.key === "familyGuarantorDateOfBirth" ||
                col.key === "familyGuarantorNidExpiryDate") && v)
            return formatDate(v as string);
          return String(v ?? "");
        }));
      }
      // Branch subtotal row
      const subRow: (string | number)[] = Array(cols.length).fill("");
      subRow[0] = group.rows.length;
      subRow[1] = `SUBTOTAL — ${group.branchName}`;
      cols.forEach((col, i) => {
        if (MONEY_KEYS.has(col.key as keyof FinancingRow)) {
          subRow[i] = (group.subtotal as any)[col.key] ?? 0;
        }
      });
      subtotalRows.push(wsData.length);
      wsData.push(subRow);
      merges.push({ s: { r: wsData.length - 1, c: 1 }, e: { r: wsData.length - 1, c: 3 } });
    }

    // Grand total row
    let grandTotalRow = -1;
    if (grandTotal) {
      const gtRow: (string | number)[] = Array(cols.length).fill("");
      gtRow[0] = totalLoans;
      gtRow[1] = "GRAND TOTAL";
      cols.forEach((col, i) => {
        if (MONEY_KEYS.has(col.key as keyof FinancingRow)) {
          gtRow[i] = (grandTotal as any)[col.key] ?? 0;
        }
      });
      grandTotalRow = wsData.length;
      wsData.push(gtRow);
      merges.push({ s: { r: grandTotalRow, c: 1 }, e: { r: grandTotalRow, c: 3 } });
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!merges"] = merges;

    const borderColor = { rgb: "CBD5E1" };
    const cellBorder = {
      top: { style: "thin", color: borderColor },
      bottom: { style: "thin", color: borderColor },
      left: { style: "thin", color: borderColor },
      right: { style: "thin", color: borderColor },
    };
    const fill = (rgb: string) => ({ patternType: "solid" as const, fgColor: { rgb } });
    const font = (rgb: string, bold = false) => ({ name: "Calibri", sz: 10, bold, color: { rgb } });
    const address = (row: number, col: number) => XLSX.utils.encode_cell({ r: row, c: col });
    const setCellStyle = (row: number, col: number, style: Record<string, unknown>) => {
      const cellAddress = address(row, col);
      if (!ws[cellAddress]) ws[cellAddress] = { t: "s", v: "" };
      ws[cellAddress].s = style;
    };
    const groupColors: Record<string, string> = {
      "bg-blue-700": "1D4ED8",
      "bg-amber-700": "B45309",
      "bg-teal-700": "0F766E",
      "bg-indigo-700": "4338CA",
      "bg-green-800": "166534",
      "bg-cyan-700": "0E7490",
      "bg-sky-700": "0369A1",
      "bg-lime-700": "4D7C0F",
      "bg-emerald-700": "047857",
      "bg-green-700": "15803D",
      "bg-violet-700": "6D28D9",
      "bg-purple-700": "7E22CE",
      "bg-slate-500": "64748B",
    };

    // Match the two-level grouped table header shown on screen.
    for (const group of columnGroups) {
      const groupStyle = {
        border: cellBorder,
        fill: fill(groupColors[group.className] || "334155"),
        font: font("FFFFFF", true),
        alignment: { horizontal: "center" as const, vertical: "center" as const, wrapText: true },
      };
      for (let col = group.start; col < group.start + group.span; col++) {
        setCellStyle(0, col, groupStyle);
        setCellStyle(1, col, {
          border: cellBorder,
          fill: fill("334155"),
          font: font("FFFFFF", true),
          alignment: { horizontal: "center" as const, vertical: "center" as const, wrapText: true },
        });
      }
    }
    for (let col = 0; col < cols.length; col++) {
      if (groupedColumnIndexes.has(col)) continue;
      const verticalHeaderStyle = {
        border: cellBorder,
        fill: fill("1E293B"),
        font: font("FFFFFF", true),
        alignment: { horizontal: "center" as const, vertical: "center" as const, wrapText: true },
      };
      setCellStyle(0, col, verticalHeaderStyle);
      setCellStyle(1, col, verticalHeaderStyle);
    }
    const finalAgingIndex = cols.findIndex(col => col.key === "finalAging");
    if (finalAgingIndex >= 0) {
      setCellStyle(1, finalAgingIndex, {
        border: cellBorder,
        fill: fill("DC2626"),
        font: font("FFFFFF", true),
        alignment: { horizontal: "center" as const, vertical: "center" as const, wrapText: true },
      });
    }

    const moneyFormat = "#,##0.00";
    const dataStyle = (alternate: boolean, col: ColDef, row: FinancingRow) => {
      const isMoney = MONEY_KEYS.has(col.key as keyof FinancingRow)
        || col.installmentField === "paymentAmount"
        || col.installmentField === "remainingBalance";
      const isAging = col.key === "finalAging";
      const aging = isAging ? Number(row.finalAging) : 0;
      return {
        border: cellBorder,
        fill: fill(alternate ? "F8FAFC" : "FFFFFF"),
        font: font(aging > 30 ? "DC2626" : aging > 0 ? "D97706" : "1E293B"),
        alignment: {
          horizontal: col.num || isMoney ? "right" as const : "left" as const,
          vertical: "center" as const,
        },
        ...(isMoney ? { numFmt: moneyFormat } : {}),
      };
    };
    for (const { sheetRow, row, alternate } of dataRows) {
      cols.forEach((col, colIndex) => setCellStyle(sheetRow, colIndex, dataStyle(alternate, col, row)));
    }
    for (const rowIndex of branchHeaderRows) {
      for (let col = 0; col < cols.length; col++) {
        setCellStyle(rowIndex, col, {
          border: cellBorder,
          fill: fill("DBEAFE"),
          font: font("1E40AF", true),
          alignment: { horizontal: "left" as const, vertical: "center" as const },
        });
      }
    }
    for (const rowIndex of subtotalRows) {
      for (let col = 0; col < cols.length; col++) {
        const colDef = cols[col];
        setCellStyle(rowIndex, col, {
          border: cellBorder,
          fill: fill("EFF6FF"),
          font: font("1D4ED8", true),
          alignment: { horizontal: col === 1 ? "left" as const : "right" as const, vertical: "center" as const },
          ...(MONEY_KEYS.has(colDef.key as keyof FinancingRow) ? { numFmt: moneyFormat } : {}),
        });
      }
    }
    if (grandTotalRow >= 0) {
      for (let col = 0; col < cols.length; col++) {
        const colDef = cols[col];
        setCellStyle(grandTotalRow, col, {
          border: cellBorder,
          fill: fill("1E293B"),
          font: font("FFFFFF", true),
          alignment: { horizontal: col === 1 ? "left" as const : "right" as const, vertical: "center" as const },
          ...(MONEY_KEYS.has(colDef.key as keyof FinancingRow) ? { numFmt: moneyFormat } : {}),
        });
      }
    }

    ws["!rows"] = [
      { hpt: 28 },
      { hpt: 34 },
      ...wsData.slice(2).map((_, index) => ({
        hpt: branchHeaderRows.includes(index + 2) ? 20 : 18,
      })),
    ];
    // Set column widths
    ws["!cols"] = cols.map(c => ({ wch: Math.max(10, Math.ceil((c.w || 100) / 7)) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financing Data");
    XLSX.writeFile(wb, `Financing_Data_${startDate}_${endDate}.xlsx`);
  };

  // ── Render cell value ─────────────────────────────────────────────────────
  const cellValue = (col: ColDef, row: FinancingRow, sn: number): string => {
    if (col.key === "sn") return String(sn);
    if (col.installmentNumber && col.installmentField) {
      const detail = row.paidInstallmentDetails.find(
        item => item.installmentNumber === col.installmentNumber,
      );
      if (!detail) return "";
      const value = detail[col.installmentField];
      return col.installmentField === "paymentDate"
        ? (value ? formatDate(String(value)) : "")
        : fmt(Number(value));
    }
    const v = row[col.key as keyof FinancingRow];
    if (col.key === "finalAging") return agingLabel(Number(v));
    if (DISPLAY_MONEY_KEYS.has(col.key as keyof FinancingRow)) return fmt(Number(v));
    if ((col.key === "disbursementDate" || col.key === "requestDate" ||
         col.key === "approvedDate"     || col.key === "maturityDate" ||
         col.key === "lastPaymentDate"  || col.key === "dateOfBirth" ||
         col.key === "bizRegisterDate"  || col.key === "bizExpiryDate" ||
         col.key === "firstGuarantorDateOfBirth" ||
         col.key === "firstGuarantorNidExpiryDate" ||
         col.key === "secondGuarantorDateOfBirth" ||
         col.key === "secondGuarantorNidExpiryDate" ||
         col.key === "familyGuarantorDateOfBirth" ||
         col.key === "familyGuarantorNidExpiryDate") && v)
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
          <Button
            size="sm"
            onClick={handleExportExcel}
            className="gap-2 bg-green-600 text-white hover:bg-green-700"
          >
            <FileSpreadsheet className="h-4 w-4" />
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
              {/* Group header row */}
              <tr className="bg-slate-800 text-white">
                {cols.map((col, idx) => {
                  const group = groupsByStart.get(idx);
                  if (group) return (
                    <th key={`group-${group.start}`} colSpan={group.span}
                      className={`px-2 py-1.5 text-center font-bold border-r border-l border-slate-500 ${group.className} whitespace-nowrap`}>
                      {group.label}
                    </th>
                  );
                  if (groupedColumnIndexes.has(idx)) return null;
                  // all other cols span both header rows
                  return (
                    <th key={`${col.key}-${idx}`} rowSpan={2}
                      className="px-2 py-2 text-center font-semibold border-r border-slate-600 whitespace-nowrap align-middle"
                      style={{ minWidth: col.w, maxWidth: col.w }}>
                      {col.label}
                    </th>
                  );
                })}
              </tr>
              {/* Sub-header row — individual names for all grouped columns */}
              <tr className="bg-slate-700 text-white">
                {groupedColumns.map((col, i) => (
                  <th key={`sub-${col.key}-${i}`}
                    className={`px-2 py-1.5 text-center font-semibold border-r border-slate-600 whitespace-nowrap ${
                      col.key === "finalAging" ? "bg-red-600" : ""
                    }`}
                    style={{ minWidth: col.w, maxWidth: col.w }}>
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
                          colSpan={cols.length}
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
                          {cols.map(col => {
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
                      {cols.slice(4).map(col => (
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
                  {cols.slice(4).map(col => (
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
