import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, date, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "manager", "admin"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const loanStatusEnum = pgEnum("loan_status", ["pending", "approved", "disbursed", "active", "completed", "defaulted"]);

// User Roles - extends the auth users with role information
export const userRoles = pgTable("user_roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Branches
export const branches = pgTable("branches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("short_name", { length: 50 }),
  code: varchar("code", { length: 50 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Finance Officers
export const financeOfficers = pgTable("finance_officers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  branchId: varchar("branch_id").references(() => branches.id),
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Funding Sources
export const fundingSources = pgTable("funding_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customers
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerNo: varchar("customer_no", { length: 100 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  fatherName: varchar("father_name", { length: 255 }),
  gender: genderEnum("gender"),
  nationalId: varchar("national_id", { length: 100 }),
  dateOfBirth: date("date_of_birth"),
  placeOfBirth: varchar("place_of_birth", { length: 255 }),
  age: integer("age"),
  homeAddress: text("home_address"),
  district: varchar("district", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  secondPhoneNumber: varchar("second_phone_number", { length: 50 }),
  numberOfDependents: integer("number_of_dependents"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer Businesses
export const customerBusinesses = pgTable("customer_businesses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id),
  businessName: varchar("business_name", { length: 255 }),
  province: varchar("province", { length: 255 }),
  district: varchar("district", { length: 255 }),
  village: varchar("village", { length: 255 }),
  detailedAddress: text("detailed_address"),
  yearsOfExperience: integer("years_of_experience"),
  fullTimePartTime: varchar("full_time_part_time", { length: 50 }),
  isNewJob: boolean("is_new_job"),
  sector: varchar("sector", { length: 255 }),
  businessType: varchar("business_type", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Business Licenses
export const businessLicenses = pgTable("business_licenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerBusinessId: varchar("customer_business_id").references(() => customerBusinesses.id),
  licenseType: varchar("license_type", { length: 255 }),
  president: varchar("president", { length: 255 }),
  licenseNumber: varchar("license_number", { length: 100 }),
  registerDate: date("register_date"),
  expiryDate: date("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Loans
export const loans = pgTable("loans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id", { length: 100 }).unique(),
  customerId: varchar("customer_id").references(() => customers.id),
  branchId: varchar("branch_id").references(() => branches.id),
  financeOfficerId: varchar("finance_officer_id").references(() => financeOfficers.id),
  productName: varchar("product_name", { length: 255 }),
  productCode: varchar("product_code", { length: 50 }),
  financingPurpose: text("financing_purpose"),
  financingCycle: integer("financing_cycle"),
  sourceOfFund: varchar("source_of_fund", { length: 255 }),
  fundingSourceId: varchar("funding_source_id").references(() => fundingSources.id),
  previousFinancing: decimal("previous_financing", { precision: 15, scale: 2 }),
  previousInstitution: varchar("previous_institution", { length: 255 }),
  requestDate: date("request_date"),
  requestAmount: decimal("request_amount", { precision: 15, scale: 2 }),
  financingDurationMonths: integer("financing_duration_months"),
  gracePeriod: integer("grace_period"),
  numberOfInstallments: integer("number_of_installments"),
  principleAmount: decimal("principle_amount", { precision: 15, scale: 2 }),
  marginRate: decimal("margin_rate", { precision: 5, scale: 2 }),
  profit: decimal("profit", { precision: 15, scale: 2 }),
  totalReceivable: decimal("total_receivable", { precision: 15, scale: 2 }),
  installmentAmount: decimal("installment_amount", { precision: 15, scale: 2 }),
  totalCollection: decimal("total_collection", { precision: 15, scale: 2 }),
  outstandingPortfolio: decimal("outstanding_portfolio", { precision: 15, scale: 2 }),
  status: loanStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Collaterals
export const collaterals = pgTable("collaterals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loans.id),
  ownerName: varchar("owner_name", { length: 255 }),
  ownerNationalId: varchar("owner_national_id", { length: 100 }),
  collateralType: varchar("collateral_type", { length: 255 }),
  titleDeedNumber: varchar("title_deed_number", { length: 100 }),
  province: varchar("province", { length: 255 }),
  district: varchar("district", { length: 255 }),
  village: varchar("village", { length: 255 }),
  address: text("address"),
  purchasedPrice: decimal("purchased_price", { precision: 15, scale: 2 }),
  marketPrice: decimal("market_price", { precision: 15, scale: 2 }),
  sizeMm: varchar("size_mm", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Guarantors
export const guarantors = pgTable("guarantors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loans.id),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  fatherName: varchar("father_name", { length: 255 }),
  nationalId: varchar("national_id", { length: 100 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  homeAddress: text("home_address"),
  district: varchar("district", { length: 255 }),
  business: varchar("business", { length: 255 }),
  businessAddress: text("business_address"),
  businessDistrict: varchar("business_district", { length: 255 }),
  relationshipWithCustomer: varchar("relationship_with_customer", { length: 255 }),
  yearsOfExperience: integer("years_of_experience"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Loan Approvals (Committee Decision)
export const loanApprovals = pgTable("loan_approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loans.id),
  inventory: decimal("inventory", { precision: 15, scale: 2 }),
  monthlyNetIncome: decimal("monthly_net_income", { precision: 15, scale: 2 }),
  approvedAmount: decimal("approved_amount", { precision: 15, scale: 2 }),
  approvedDate: date("approved_date"),
  financingDurationMonths: integer("financing_duration_months"),
  grantAmount: decimal("grant_amount", { precision: 15, scale: 2 }),
  gracePeriod: integer("grace_period"),
  committeeDiscussion: text("committee_discussion"),
  approvedById: varchar("approved_by_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Disbursements
export const disbursements = pgTable("disbursements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loans.id),
  disbursementDate: date("disbursement_date"),
  firstInstallmentDate: date("first_installment_date"),
  maturityDate: date("maturity_date"),
  disbursedById: varchar("disbursed_by_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Installments
export const installments = pgTable("installments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loans.id),
  installmentNumber: integer("installment_number").notNull(),
  dueDate: date("due_date"),
  principleAmount: decimal("principle_amount", { precision: 15, scale: 2 }),
  marginAmount: decimal("margin_amount", { precision: 15, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }),
  installmentVariance: decimal("installment_variance", { precision: 15, scale: 2 }),
  paymentDate: date("payment_date"),
  lateDays: integer("late_days"),
  isPaid: boolean("is_paid").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity Logs
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }),
  entityId: varchar("entity_id"),
  details: text("details"),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertUserRoleSchema = createInsertSchema(userRoles).omit({ id: true, createdAt: true });
export const insertBranchSchema = createInsertSchema(branches).omit({ id: true, createdAt: true });
export const insertFinanceOfficerSchema = createInsertSchema(financeOfficers).omit({ id: true, createdAt: true });
export const insertFundingSourceSchema = createInsertSchema(fundingSources).omit({ id: true, createdAt: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true });
export const insertCustomerBusinessSchema = createInsertSchema(customerBusinesses).omit({ id: true, createdAt: true });
export const insertBusinessLicenseSchema = createInsertSchema(businessLicenses).omit({ id: true, createdAt: true });
export const insertLoanSchema = createInsertSchema(loans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCollateralSchema = createInsertSchema(collaterals).omit({ id: true, createdAt: true });
export const insertGuarantorSchema = createInsertSchema(guarantors).omit({ id: true, createdAt: true });
export const insertLoanApprovalSchema = createInsertSchema(loanApprovals).omit({ id: true, createdAt: true });
export const insertDisbursementSchema = createInsertSchema(disbursements).omit({ id: true, createdAt: true });
export const insertInstallmentSchema = createInsertSchema(installments).omit({ id: true, createdAt: true });
export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({ id: true, createdAt: true });

// Types
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type UserRole = typeof userRoles.$inferSelect;
export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type Branch = typeof branches.$inferSelect;
export type InsertFinanceOfficer = z.infer<typeof insertFinanceOfficerSchema>;
export type FinanceOfficer = typeof financeOfficers.$inferSelect;
export type InsertFundingSource = z.infer<typeof insertFundingSourceSchema>;
export type FundingSource = typeof fundingSources.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomerBusiness = z.infer<typeof insertCustomerBusinessSchema>;
export type CustomerBusiness = typeof customerBusinesses.$inferSelect;
export type InsertBusinessLicense = z.infer<typeof insertBusinessLicenseSchema>;
export type BusinessLicense = typeof businessLicenses.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Loan = typeof loans.$inferSelect;
export type InsertCollateral = z.infer<typeof insertCollateralSchema>;
export type Collateral = typeof collaterals.$inferSelect;
export type InsertGuarantor = z.infer<typeof insertGuarantorSchema>;
export type Guarantor = typeof guarantors.$inferSelect;
export type InsertLoanApproval = z.infer<typeof insertLoanApprovalSchema>;
export type LoanApproval = typeof loanApprovals.$inferSelect;
export type InsertDisbursement = z.infer<typeof insertDisbursementSchema>;
export type Disbursement = typeof disbursements.$inferSelect;
export type InsertInstallment = z.infer<typeof insertInstallmentSchema>;
export type Installment = typeof installments.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
