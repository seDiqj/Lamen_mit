import * as XLSX from "xlsx";

const newLoans = [
  { applicationId: "1011100017", customerName: "Abdul Rahman Taib", branch: "Kabul", product: "Murabaha", principalAmount: 1500000, marginRate: 16, numberOfInstallments: 24, financingDuration: 24, gracePeriod: "", status: "risk_compliance_review", requestDate: "2026-01-11", sector: "Education", businessDescription: "" },
  { applicationId: "1011100018", customerName: "Mohammad Hamayoon", branch: "Kabul", product: "Murabaha", principalAmount: 40000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "risk_compliance_review", requestDate: "2026-01-27", sector: "Trade", businessDescription: "Grocery Store" },
  { applicationId: "1011100019", customerName: "Khoda Dost Nazari", branch: "Kabul", product: "Murabaha", principalAmount: 30000, marginRate: 18, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-07-20", sector: "Trade", businessDescription: "Grocery Store" },
  { applicationId: "1011100020", customerName: "Ibadullah Momand", branch: "Kabul", product: "Murabaha", principalAmount: 345600, marginRate: 9, numberOfInstallments: 21, financingDuration: 24, gracePeriod: 3, status: "risk_compliance_review", requestDate: "2025-03-10", sector: "Services", businessDescription: "Driver" },
  { applicationId: "1021100194", customerName: "Abdullah safi", branch: "Kunar", product: "Murabaha", principalAmount: 200000, marginRate: 16, numberOfInstallments: 18, financingDuration: 18, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-11-20", sector: "Transport", businessDescription: "Taxi" },
  { applicationId: "1021100195", customerName: "Najibullah SAFI", branch: "Kunar", product: "Murabaha", principalAmount: 100000, marginRate: 16, numberOfInstallments: 15, financingDuration: 15, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-09-24", sector: "Retail", businessDescription: "Clothing Store" },
  { applicationId: "1021100196", customerName: "M.Hashim Khan SALARZAI", branch: "Kunar", product: "Murabaha", principalAmount: 100000, marginRate: 16, numberOfInstallments: 15, financingDuration: 15, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-08-25", sector: "Health", businessDescription: "Pharmacy" },
  { applicationId: "1021100197", customerName: "Hijratullah Adil", branch: "Kunar", product: "Murabaha", principalAmount: 100000, marginRate: 16, numberOfInstallments: 15, financingDuration: 15, gracePeriod: "", status: "committee_review", requestDate: "2025-06-08", sector: "Retail Shop", businessDescription: "Cosmetics" },
  { applicationId: "1021100198", customerName: "Siraj Udeen ALMAS", branch: "Kunar", product: "Murabaha", principalAmount: 100000, marginRate: 16, numberOfInstallments: 15, financingDuration: 15, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-08-06", sector: "Education", businessDescription: "" },
  { applicationId: "1021100199", customerName: "Imaduddin Azizi", branch: "Kunar", product: "Murabaha", principalAmount: 100000, marginRate: 16, numberOfInstallments: 15, financingDuration: 15, gracePeriod: 0, status: "risk_compliance_review", requestDate: "2025-01-08", sector: "", businessDescription: "" },
  { applicationId: "1021100200", customerName: "Atiqullah Spinghar", branch: "Kunar", product: "Murabaha", principalAmount: 50000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-11-25", sector: "", businessDescription: "" },
  { applicationId: "1021100201", customerName: "Shafiullah Safi", branch: "Kunar", product: "Murabaha", principalAmount: 210000, marginRate: 16, numberOfInstallments: 18, financingDuration: 18, gracePeriod: 0, status: "risk_compliance_review", requestDate: "2025-08-06", sector: "", businessDescription: "" },
  { applicationId: "1021100202", customerName: "Mohammad Khan Mamond", branch: "Kunar", product: "Murabaha", principalAmount: 250000, marginRate: 16, numberOfInstallments: 18, financingDuration: 18, gracePeriod: 0, status: "risk_compliance_review", requestDate: "2025-08-10", sector: "Trade", businessDescription: "General Store" },
  { applicationId: "1021100203", customerName: "Muheebullah Haqyar", branch: "Kunar", product: "Murabaha", principalAmount: 70000, marginRate: 16, numberOfInstallments: 15, financingDuration: 15, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-02-11", sector: "Trade", businessDescription: "General Store" },
  { applicationId: "1021100204", customerName: "Attaurahman Safi", branch: "Kunar", product: "Murabaha", principalAmount: 120000, marginRate: 16, numberOfInstallments: 15, financingDuration: 15, gracePeriod: 0, status: "risk_compliance_review", requestDate: "2025-11-20", sector: "Services", businessDescription: "Driver" },
  { applicationId: "1021100205", customerName: "Sohail Arab", branch: "Kunar", product: "Murabaha", principalAmount: 100000, marginRate: 16, numberOfInstallments: 15, financingDuration: 15, gracePeriod: 0, status: "risk_compliance_review", requestDate: "2025-08-06", sector: "Livestock", businessDescription: "Farming" },
  { applicationId: "1021100206", customerName: "Abdul Samad Rajakhel", branch: "Kunar", product: "Murabaha", principalAmount: 300000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-11-12", sector: "Services", businessDescription: "Driver" },
  { applicationId: "1021100207", customerName: "Shakirullah Safi", branch: "Kunar", product: "Murabaha", principalAmount: 100000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-08-10", sector: "Services", businessDescription: "" },
  { applicationId: "1021100208", customerName: "Musharaf Mohammadi", branch: "Kunar", product: "Murabaha", principalAmount: 400000, marginRate: 16, numberOfInstallments: 18, financingDuration: 18, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-12-08", sector: "Trade", businessDescription: "Carpet Seller" },
  { applicationId: "1021100209", customerName: "Mahibullah Momand", branch: "Kunar", product: "Murabaha", principalAmount: 95000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "committee_review", requestDate: "2025-08-05", sector: "Trade", businessDescription: "Grocery Store" },
  { applicationId: "1021100210", customerName: "Said Gul Sahil", branch: "Kunar", product: "Murabaha", principalAmount: 90000, marginRate: 16, numberOfInstallments: 15, financingDuration: 15, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-10-08", sector: "Livestock", businessDescription: "Farming" },
  { applicationId: "1021100211", customerName: "Gulzaman SAFI", branch: "Kunar", product: "Murabaha", principalAmount: 30000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-12-10", sector: "Trade", businessDescription: "Spare Parts" },
  { applicationId: "1021100212", customerName: "Bilal SAFI", branch: "Kunar", product: "Murabaha", principalAmount: 70000, marginRate: 16, numberOfInstallments: 15, financingDuration: 15, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-12-26", sector: "Trade", businessDescription: "Grocery Store" },
  { applicationId: "1021100213", customerName: "shir Zaman SAFI", branch: "Kunar", product: "Murabaha", principalAmount: 100000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "committee_review", requestDate: "2025-11-12", sector: "Trade", businessDescription: "Grocery Store" },
  { applicationId: "1031100090", customerName: "Abdull Ghafar PAENDAKHIL", branch: "Nangarhar", product: "Murabaha", principalAmount: 14528, marginRate: 18, numberOfInstallments: 12, financingDuration: 12, gracePeriod: 0, status: "risk_compliance_review", requestDate: "2025-08-20", sector: "Trade", businessDescription: "Grocery Store" },
  { applicationId: "1031100091", customerName: "Laiq ASHNA", branch: "Nangarhar", product: "Murabaha", principalAmount: 25370, marginRate: 18, numberOfInstallments: 12, financingDuration: 12, gracePeriod: 0, status: "risk_compliance_review", requestDate: "2025-08-07", sector: "Trade", businessDescription: "Spare Parts" },
  { applicationId: "1031100092", customerName: "Mushtaq Ahmad Hamim", branch: "Nangarhar", product: "Murabaha", principalAmount: 300000, marginRate: 16, numberOfInstallments: 18, financingDuration: 18, gracePeriod: "", status: "committee_review", requestDate: "2025-02-11", sector: "Services", businessDescription: "Driver" },
  { applicationId: "1031100093", customerName: "Sangar khan Momand", branch: "Nangarhar", product: "Murabaha", principalAmount: 100000, marginRate: 16, numberOfInstallments: 18, financingDuration: 18, gracePeriod: "", status: "risk_compliance_review", requestDate: "2026-01-05", sector: "Healthcare", businessDescription: "" },
  { applicationId: "1031100094", customerName: "Muhibullah Salihi", branch: "Nangarhar", product: "Murabaha", principalAmount: 70000, marginRate: 16, numberOfInstallments: 16, financingDuration: 16, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-09-08", sector: "Services", businessDescription: "" },
  { applicationId: "1031100095", customerName: "Samiullah Afghan", branch: "Nangarhar", product: "Murabaha", principalAmount: 50000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "risk_compliance_review", requestDate: "2026-01-05", sector: "Manufacturing", businessDescription: "" },
  { applicationId: "1031100096", customerName: "Fayaz Momand", branch: "Nangarhar", product: "Murabaha", principalAmount: 90000, marginRate: 16, numberOfInstallments: 18, financingDuration: 18, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-12-23", sector: "Trade", businessDescription: "Cosmetics Store" },
  { applicationId: "1031100097", customerName: "Hezbullah Niazi", branch: "Nangarhar", product: "Murabaha", principalAmount: 500000, marginRate: 16, numberOfInstallments: 20, financingDuration: 20, gracePeriod: 0, status: "risk_compliance_review", requestDate: "2025-12-22", sector: "Trade", businessDescription: "General Store" },
  { applicationId: "1031100098", customerName: "Zainab Kashmiri", branch: "Nangarhar", product: "Murabaha", principalAmount: 30000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "risk_compliance_review", requestDate: "2025-09-06", sector: "Services", businessDescription: "" },
  { applicationId: "1031100099", customerName: "Arifullah Shinwari", branch: "Nangarhar", product: "Murabaha", principalAmount: 10000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "risk_compliance_review", requestDate: "2026-01-13", sector: "Trade", businessDescription: "Grocery Store" },
  { applicationId: "1031100100", customerName: "Parwiz", branch: "Nangarhar", product: "Murabaha", principalAmount: 100000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "risk_compliance_review", requestDate: "2026-01-05", sector: "Trade", businessDescription: "Grocery Store" },
  { applicationId: "1031100101", customerName: "Zabih Ullah ARAB", branch: "Nangarhar", product: "Murabaha", principalAmount: 250000, marginRate: 16, numberOfInstallments: 16, financingDuration: 16, gracePeriod: "", status: "risk_compliance_review", requestDate: "2026-01-06", sector: "Manufacturing", businessDescription: "" },
  { applicationId: "1031100102", customerName: "Zabehullah", branch: "Nangarhar", product: "Murabaha", principalAmount: 40000, marginRate: 16, numberOfInstallments: 12, financingDuration: 12, gracePeriod: "", status: "committee_review", requestDate: "2025-08-19", sector: "Trade", businessDescription: "Grocery Store" },
  { applicationId: "1031100103", customerName: "Nesar Ahmad MOMAND", branch: "Nangarhar", product: "Murabaha", principalAmount: 150000, marginRate: 16, numberOfInstallments: 20, financingDuration: 20, gracePeriod: "", status: "rejected", requestDate: "2026-08-01", sector: "Services", businessDescription: "Driver" },
];

const headers = [
  "Application ID",
  "Customer Name",
  "Branch",
  "Product",
  "Principal Amount (AFN)",
  "Margin Rate (%)",
  "Number of Installments",
  "Financing Duration (Months)",
  "Grace Period (Months)",
  "Status",
  "Request Date",
  "Sector",
  "Business Description",
  "Disbursement Date (FILL THIS)",
];

const rows = newLoans.map((l) => [
  l.applicationId,
  l.customerName,
  l.branch,
  l.product,
  l.principalAmount,
  l.marginRate,
  l.numberOfInstallments,
  l.financingDuration,
  l.gracePeriod,
  l.status,
  l.requestDate,
  l.sector,
  l.businessDescription,
  "",
]);

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([
  ["Lamen Microfinance Institution"],
  ["New Loans - Disbursement Date Input Template"],
  [`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`],
  ["Instructions: Fill in the 'Disbursement Date' column (format: DD-MMM-YYYY, e.g. 25-Jan-2026) for each loan, then upload back through the system."],
  [],
  headers,
  ...rows,
]);

ws["!cols"] = [
  { wch: 16 },
  { wch: 28 },
  { wch: 12 },
  { wch: 12 },
  { wch: 20 },
  { wch: 14 },
  { wch: 22 },
  { wch: 24 },
  { wch: 20 },
  { wch: 22 },
  { wch: 14 },
  { wch: 16 },
  { wch: 22 },
  { wch: 28 },
];

ws["!merges"] = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },
  { s: { r: 1, c: 0 }, e: { r: 1, c: 13 } },
  { s: { r: 2, c: 0 }, e: { r: 2, c: 13 } },
  { s: { r: 3, c: 0 }, e: { r: 3, c: 13 } },
];

XLSX.utils.book_append_sheet(wb, ws, "New Loans");
const outputPath = "exports/new-loans-disbursement-template.xlsx";

import { mkdirSync } from "fs";
mkdirSync("exports", { recursive: true });
XLSX.writeFile(wb, outputPath);
console.log(`Excel file exported to: ${outputPath}`);
console.log(`Total new loans: ${newLoans.length}`);
