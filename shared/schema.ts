import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, date, timestamp, boolean, pgEnum, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "fad", "risk_compliance", "cfo", "coo", "ceo", "sharia", "manager", "admin"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const loanStatusEnum = pgEnum("loan_status", ["pending", "data_quality_review", "risk_compliance_review", "committee_review", "approved", "rejected", "disbursed", "active", "completed", "defaulted"]);
export const voteStatusEnum = pgEnum("vote_status", ["pending", "approved", "rejected"]);

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
  isActive: boolean("is_active").default(true),
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

// Sectors (Loan Types)
export const sectors = pgTable("sectors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Businesses (belong to Sectors)
export const businesses = pgTable("businesses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectorId: varchar("sector_id").references(() => sectors.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Provinces
export const provinces = pgTable("provinces", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Districts (belong to Provinces)
export const districts = pgTable("districts", {
  id: serial("id").primaryKey(),
  provinceId: integer("province_id").references(() => provinces.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// License Types
export const licenseTypes = pgTable("license_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
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
  directMaleDependent: integer("direct_male_dependent"),
  directFemaleDependent: integer("direct_female_dependent"),
  indirectMaleDependent: integer("indirect_male_dependent"),
  indirectFemaleDependent: integer("indirect_female_dependent"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer Documents
export const customerDocuments = pgTable("customer_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id),
  documentType: varchar("document_type", { length: 100 }),
  fileName: varchar("file_name", { length: 255 }),
  fileUrl: text("file_url"),
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
  sector: varchar("sector", { length: 255 }),
  businessDescription: text("business_description"),
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

// Guarantors (financial and family)
export const guarantorTypeEnum = pgEnum("guarantor_type", ["financial", "family"]);

export const guarantors = pgTable("guarantors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loans.id),
  guarantorType: guarantorTypeEnum("guarantor_type").default("financial"),
  fullName: varchar("full_name", { length: 255 }),
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
  inventory: decimal("inventory", { precision: 15, scale: 2 }),
  monthlyIncome: decimal("monthly_income", { precision: 15, scale: 2 }),
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

// FAD (Field Assessment/Data) Reviews - Data Quality Check
export const fadReviews = pgTable("fad_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loans.id),
  reviewedById: varchar("reviewed_by_id"),
  reviewerName: varchar("reviewer_name", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected
  comments: text("comments"),
  dataQualityScore: integer("data_quality_score"), // Optional 1-100 score
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Risk Compliance Reviews - After FAD approval, before Committee
export const riskComplianceReviews = pgTable("risk_compliance_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loans.id),
  reviewedById: varchar("reviewed_by_id"),
  reviewerName: varchar("reviewer_name", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected
  comments: text("comments"),
  riskScore: integer("risk_score"), // Optional 1-100 score
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Committee Votes - Individual votes from committee members
export const committeeVotes = pgTable("committee_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loans.id),
  voterId: varchar("voter_id"),
  voterName: varchar("voter_name", { length: 255 }),
  voterRole: varchar("voter_role", { length: 50 }), // cfo, coo, ceo, sharia
  vote: voteStatusEnum("vote").default("pending"), // pending, approved, rejected
  comments: text("comments"),
  votedAt: timestamp("voted_at"),
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

// PAR Categories
export const parCategories = pgTable("par_categories", {
  id: serial("id").primaryKey(),
  startDay: integer("start_day").notNull(),
  endDay: integer("end_day").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  provisionPercent: decimal("provision_percent", { precision: 5, scale: 2 }).notNull(),
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
export const insertSectorSchema = createInsertSchema(sectors).omit({ id: true, createdAt: true });
export const insertBusinessSchema = createInsertSchema(businesses).omit({ id: true, createdAt: true });
export const insertProvinceSchema = createInsertSchema(provinces).omit({ id: true, createdAt: true });
export const insertDistrictSchema = createInsertSchema(districts).omit({ id: true, createdAt: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true });
export const insertCustomerDocumentSchema = createInsertSchema(customerDocuments).omit({ id: true, createdAt: true });
export const insertCustomerBusinessSchema = createInsertSchema(customerBusinesses).omit({ id: true, createdAt: true });
export const insertBusinessLicenseSchema = createInsertSchema(businessLicenses).omit({ id: true, createdAt: true });
export const insertLoanSchema = createInsertSchema(loans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCollateralSchema = createInsertSchema(collaterals).omit({ id: true, createdAt: true });
export const insertGuarantorSchema = createInsertSchema(guarantors).omit({ id: true, createdAt: true });
export const insertLoanApprovalSchema = createInsertSchema(loanApprovals).omit({ id: true, createdAt: true });
export const insertFadReviewSchema = createInsertSchema(fadReviews).omit({ id: true, createdAt: true });
export const insertRiskComplianceReviewSchema = createInsertSchema(riskComplianceReviews).omit({ id: true, createdAt: true });
export const insertCommitteeVoteSchema = createInsertSchema(committeeVotes).omit({ id: true, createdAt: true });
export const insertDisbursementSchema = createInsertSchema(disbursements).omit({ id: true, createdAt: true });
export const insertInstallmentSchema = createInsertSchema(installments).omit({ id: true, createdAt: true });
export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({ id: true, createdAt: true });
export const insertParCategorySchema = createInsertSchema(parCategories).omit({ id: true });

// Types
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type UserRole = typeof userRoles.$inferSelect;
export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type Branch = typeof branches.$inferSelect;
export type InsertFinanceOfficer = z.infer<typeof insertFinanceOfficerSchema>;
export type FinanceOfficer = typeof financeOfficers.$inferSelect;
export type InsertFundingSource = z.infer<typeof insertFundingSourceSchema>;
export type FundingSource = typeof fundingSources.$inferSelect;
export type InsertSector = z.infer<typeof insertSectorSchema>;
export type Sector = typeof sectors.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businesses.$inferSelect;
export type InsertProvince = z.infer<typeof insertProvinceSchema>;
export type Province = typeof provinces.$inferSelect;
export type InsertDistrict = z.infer<typeof insertDistrictSchema>;
export type District = typeof districts.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomerDocument = z.infer<typeof insertCustomerDocumentSchema>;
export type CustomerDocument = typeof customerDocuments.$inferSelect;
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
export type InsertFadReview = z.infer<typeof insertFadReviewSchema>;
export type FadReview = typeof fadReviews.$inferSelect;
export type InsertRiskComplianceReview = z.infer<typeof insertRiskComplianceReviewSchema>;
export type RiskComplianceReview = typeof riskComplianceReviews.$inferSelect;
export type InsertCommitteeVote = z.infer<typeof insertCommitteeVoteSchema>;
export type CommitteeVote = typeof committeeVotes.$inferSelect;
export type InsertDisbursement = z.infer<typeof insertDisbursementSchema>;
export type Disbursement = typeof disbursements.$inferSelect;
export type InsertInstallment = z.infer<typeof insertInstallmentSchema>;
export type Installment = typeof installments.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertParCategory = z.infer<typeof insertParCategorySchema>;
export type ParCategory = typeof parCategories.$inferSelect;

// Page Permissions - controls which pages users can access
export const pagePermissions = pgTable("page_permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  pageName: varchar("page_name", { length: 100 }).notNull(),
  canAccess: boolean("can_access").notNull().default(true),
  grantedBy: varchar("granted_by"),
  grantedAt: timestamp("granted_at").defaultNow(),
});

export const insertPagePermissionSchema = createInsertSchema(pagePermissions).omit({ id: true, grantedAt: true });
export type InsertPagePermission = z.infer<typeof insertPagePermissionSchema>;
export type PagePermission = typeof pagePermissions.$inferSelect;

// Notifications - alerts for users about loan status changes
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(), // The user who should receive the notification
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // loan_approved, loan_rejected, fad_review, committee_vote
  relatedEntityType: varchar("related_entity_type", { length: 50 }), // loan, customer, etc.
  relatedEntityId: varchar("related_entity_id"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// ============== ACCOUNTING MODULE ==============

// Account Types Enum
export const accountTypeEnum = pgEnum("account_type", ["asset", "liability", "equity", "income", "expense"]);

// Chart of Accounts
export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountCode: varchar("account_code", { length: 20 }).notNull().unique(),
  accountName: varchar("account_name", { length: 255 }).notNull(),
  accountType: accountTypeEnum("account_type").notNull(),
  parentId: varchar("parent_id"), // Self-referencing for hierarchy
  description: text("description"),
  isActive: boolean("is_active").default(true),
  isSystemAccount: boolean("is_system_account").default(false), // For auto-generated entries
  normalBalance: varchar("normal_balance", { length: 10 }).default("debit"), // debit or credit
  openingBalance: decimal("opening_balance", { precision: 15, scale: 2 }).default("0"),
  currentBalance: decimal("current_balance", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fiscal Periods
export const fiscalPeriods = pgTable("fiscal_periods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  periodName: varchar("period_name", { length: 100 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  fiscalYear: integer("fiscal_year").notNull(),
  periodNumber: integer("period_number").notNull(), // 1-12 for months
  isClosed: boolean("is_closed").default(false),
  closedBy: varchar("closed_by"),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Journal Entries (Header)
export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entryNumber: varchar("entry_number", { length: 50 }).notNull().unique(),
  entryDate: date("entry_date").notNull(),
  description: text("description"),
  reference: varchar("reference", { length: 255 }), // e.g., Loan ID, Invoice No
  referenceType: varchar("reference_type", { length: 50 }), // loan_disbursement, payment, manual
  referenceId: varchar("reference_id"), // ID of related entity
  fiscalPeriodId: varchar("fiscal_period_id").references(() => fiscalPeriods.id),
  totalDebit: decimal("total_debit", { precision: 15, scale: 2 }).default("0"),
  totalCredit: decimal("total_credit", { precision: 15, scale: 2 }).default("0"),
  isPosted: boolean("is_posted").default(false),
  isReversed: boolean("is_reversed").default(false),
  reversedEntryId: varchar("reversed_entry_id"),
  createdBy: varchar("created_by"),
  postedBy: varchar("posted_by"),
  postedAt: timestamp("posted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Journal Lines (Debit/Credit entries)
export const journalLines = pgTable("journal_lines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  journalEntryId: varchar("journal_entry_id").references(() => journalEntries.id).notNull(),
  accountId: varchar("account_id").references(() => accounts.id).notNull(),
  description: text("description"),
  debitAmount: decimal("debit_amount", { precision: 15, scale: 2 }).default("0"),
  creditAmount: decimal("credit_amount", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas for Accounting
export const insertAccountSchema = createInsertSchema(accounts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFiscalPeriodSchema = createInsertSchema(fiscalPeriods).omit({ id: true, createdAt: true });
export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({ id: true, createdAt: true });
export const insertJournalLineSchema = createInsertSchema(journalLines).omit({ id: true, createdAt: true });

// Types for Accounting
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;
export type InsertFiscalPeriod = z.infer<typeof insertFiscalPeriodSchema>;
export type FiscalPeriod = typeof fiscalPeriods.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalLine = z.infer<typeof insertJournalLineSchema>;
export type JournalLine = typeof journalLines.$inferSelect;

// Insert Schema and Types for License Types
export const insertLicenseTypeSchema = createInsertSchema(licenseTypes).omit({ id: true, createdAt: true });
export type InsertLicenseType = z.infer<typeof insertLicenseTypeSchema>;
export type LicenseType = typeof licenseTypes.$inferSelect;

// ============== HR MODULE ==============

// HR Enums
export const employmentStatusEnum = pgEnum("employment_status", ["active", "on_leave", "suspended", "terminated", "resigned"]);
export const maritalStatusEnum = pgEnum("marital_status", ["single", "married", "divorced", "widowed"]);
export const educationLevelEnum = pgEnum("education_level", ["not_graduate", "high_school", "bachelor", "master", "phd"]);
export const leaveStatusEnum = pgEnum("leave_status", ["pending", "approved", "rejected", "cancelled"]);
export const attendanceStatusEnum = pgEnum("attendance_status", ["present", "absent", "late", "half_day", "on_leave", "holiday"]);
export const languageProficiencyEnum = pgEnum("language_proficiency", ["basic", "conversational", "fluent"]);

// HR Departments
export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  parentId: varchar("parent_id"),
  managerId: varchar("manager_id"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// HR Positions/Job Titles
export const positions = pgTable("positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  departmentId: varchar("department_id").references(() => departments.id),
  grade: varchar("grade", { length: 50 }),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employees - Main Table (Based on Staff Personal Information Form)
export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeCode: varchar("employee_code", { length: 50 }).unique(),
  userId: varchar("user_id"),
  financeOfficerId: varchar("finance_officer_id").references(() => financeOfficers.id),
  
  // Personal Information
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  fatherName: varchar("father_name", { length: 255 }),
  gender: genderEnum("gender"),
  dateOfBirth: date("date_of_birth"),
  age: integer("age"),
  maritalStatus: maritalStatusEnum("marital_status"),
  
  // NIC/Tazkira
  nationalId: varchar("national_id", { length: 100 }),
  nationalIdPlaceOfIssue: varchar("national_id_place_of_issue", { length: 255 }),
  
  // Contact Information
  phoneNumber: varchar("phone_number", { length: 50 }),
  secondPhoneNumber: varchar("second_phone_number", { length: 50 }),
  email: varchar("email", { length: 255 }),
  permanentAddress: text("permanent_address"),
  currentAddress: text("current_address"),
  
  // Employment Details
  positionId: varchar("position_id").references(() => positions.id),
  departmentId: varchar("department_id").references(() => departments.id),
  branchId: varchar("branch_id").references(() => branches.id),
  dutyStation: varchar("duty_station", { length: 255 }),
  hireDate: date("hire_date"),
  terminationDate: date("termination_date"),
  employmentStatus: employmentStatusEnum("employment_status").default("active"),
  
  // Education
  educationLevel: educationLevelEnum("education_level"),
  educationDetails: text("education_details"),
  
  // Work Experience
  totalExperienceYears: integer("total_experience_years"),
  jobRelatedExperienceYears: integer("job_related_experience_years"),
  otherExperienceYears: integer("other_experience_years"),
  
  // Photo
  photoUrl: text("photo_url"),
  
  // Metadata
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employee Emergency Contacts
export const employeeEmergencyContacts = pgTable("employee_emergency_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  relationship: varchar("relationship", { length: 100 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employee Languages
export const employeeLanguages = pgTable("employee_languages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  language: varchar("language", { length: 100 }).notNull(),
  speakingLevel: languageProficiencyEnum("speaking_level"),
  writingLevel: languageProficiencyEnum("writing_level"),
  readingLevel: languageProficiencyEnum("reading_level"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employee Family Members Working at Lamen
export const employeeFamilyMembers = pgTable("employee_family_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  fatherName: varchar("father_name", { length: 255 }),
  relationship: varchar("relationship", { length: 100 }),
  position: varchar("position", { length: 255 }),
  department: varchar("department", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employee Professional References
export const employeeReferences = pgTable("employee_references", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  relationship: varchar("relationship", { length: 100 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employee Documents
export const employeeDocuments = pgTable("employee_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  documentType: varchar("document_type", { length: 100 }),
  documentName: varchar("document_name", { length: 255 }),
  fileName: varchar("file_name", { length: 255 }),
  fileUrl: text("file_url"),
  expiryDate: date("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leave Types
export const leaveTypes = pgTable("leave_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }),
  daysPerYear: integer("days_per_year").default(0),
  isPaid: boolean("is_paid").default(true),
  carryForward: boolean("carry_forward").default(false),
  maxCarryForwardDays: integer("max_carry_forward_days").default(0),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leave Balances
export const leaveBalances = pgTable("leave_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  leaveTypeId: varchar("leave_type_id").references(() => leaveTypes.id).notNull(),
  year: integer("year").notNull(),
  entitlement: integer("entitlement").default(0),
  used: integer("used").default(0),
  carriedForward: integer("carried_forward").default(0),
  balance: integer("balance").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leave Requests
export const leaveRequests = pgTable("leave_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  leaveTypeId: varchar("leave_type_id").references(() => leaveTypes.id).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalDays: integer("total_days").notNull(),
  reason: text("reason"),
  status: leaveStatusEnum("status").default("pending"),
  approvedById: varchar("approved_by_id"),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Holidays Calendar
export const holidays = pgTable("holidays", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  date: date("date").notNull(),
  year: integer("year").notNull(),
  isRecurring: boolean("is_recurring").default(false),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendance Records
export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  date: date("date").notNull(),
  checkIn: timestamp("check_in"),
  checkOut: timestamp("check_out"),
  status: attendanceStatusEnum("status").default("present"),
  workHours: decimal("work_hours", { precision: 4, scale: 2 }),
  overtimeHours: decimal("overtime_hours", { precision: 4, scale: 2 }),
  notes: text("notes"),
  recordedBy: varchar("recorded_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// HR Insert Schemas
export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true, createdAt: true });
export const insertPositionSchema = createInsertSchema(positions).omit({ id: true, createdAt: true });
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEmployeeEmergencyContactSchema = createInsertSchema(employeeEmergencyContacts).omit({ id: true, createdAt: true });
export const insertEmployeeLanguageSchema = createInsertSchema(employeeLanguages).omit({ id: true, createdAt: true });
export const insertEmployeeFamilyMemberSchema = createInsertSchema(employeeFamilyMembers).omit({ id: true, createdAt: true });
export const insertEmployeeReferenceSchema = createInsertSchema(employeeReferences).omit({ id: true, createdAt: true });
export const insertEmployeeDocumentSchema = createInsertSchema(employeeDocuments).omit({ id: true, createdAt: true });
export const insertLeaveTypeSchema = createInsertSchema(leaveTypes).omit({ id: true, createdAt: true });
export const insertLeaveBalanceSchema = createInsertSchema(leaveBalances).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({ id: true, createdAt: true, updatedAt: true });
export const insertHolidaySchema = createInsertSchema(holidays).omit({ id: true, createdAt: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true, createdAt: true });

// HR Types
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertPosition = z.infer<typeof insertPositionSchema>;
export type Position = typeof positions.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployeeEmergencyContact = z.infer<typeof insertEmployeeEmergencyContactSchema>;
export type EmployeeEmergencyContact = typeof employeeEmergencyContacts.$inferSelect;
export type InsertEmployeeLanguage = z.infer<typeof insertEmployeeLanguageSchema>;
export type EmployeeLanguage = typeof employeeLanguages.$inferSelect;
export type InsertEmployeeFamilyMember = z.infer<typeof insertEmployeeFamilyMemberSchema>;
export type EmployeeFamilyMember = typeof employeeFamilyMembers.$inferSelect;
export type InsertEmployeeReference = z.infer<typeof insertEmployeeReferenceSchema>;
export type EmployeeReference = typeof employeeReferences.$inferSelect;
export type InsertEmployeeDocument = z.infer<typeof insertEmployeeDocumentSchema>;
export type EmployeeDocument = typeof employeeDocuments.$inferSelect;
export type InsertLeaveType = z.infer<typeof insertLeaveTypeSchema>;
export type LeaveType = typeof leaveTypes.$inferSelect;
export type InsertLeaveBalance = z.infer<typeof insertLeaveBalanceSchema>;
export type LeaveBalance = typeof leaveBalances.$inferSelect;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type InsertHoliday = z.infer<typeof insertHolidaySchema>;
export type Holiday = typeof holidays.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;
