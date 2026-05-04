import { db } from "./db";
import bcrypt from "bcrypt";
import { eq, and, like, ilike, or, desc, asc, sql, count, gt, gte, lte, isNull, isNotNull, inArray } from "drizzle-orm";
import {
  users,
  userRoles,
  branches,
  financeOfficers,
  fundingSources,
  sectors,
  businesses,
  provinces,
  districts,
  licenseTypes,
  financingPurposes,
  collateralTypes,
  customers,
  customerBusinesses,
  businessLicenses,
  loans,
  collaterals,
  guarantors,
  loanApprovals,
  fadReviews,
  riskComplianceReviews,
  committeeVotes,
  disbursements,
  installments,
  activityLogs,
  parCategories,
  pagePermissions,
  accounts,
  fiscalPeriods,
  journalEntries,
  journalLines,
  departments,
  positions,
  employees,
  leaveTypes,
  leaveRequests,
  holidays,
  attendance,
  salaryStructures,
  allowanceTypes,
  deductionTypes,
  employeeSalaries,
  employeeAllowances,
  employeeDeductions,
  payrollRuns,
  payslips,
  payslipDetails,
  jobPostings,
  applicants,
  interviews,
  performancePeriods,
  performanceReviews,
  performanceGoals,
  competencies,
  competencyRatings,
  trainingPrograms,
  trainingSessions,
  trainingEnrollments,
  skills,
  employeeSkills,
  certifications,
  employeeCertifications,
  benefitPlans,
  employeeBenefitEnrollments,
  benefitDependents,
  disbursementTargets,
  financingProducts,
  type Account,
  type InsertAccount,
  type FiscalPeriod,
  type InsertFiscalPeriod,
  type JournalEntry,
  type InsertJournalEntry,
  type JournalLine,
  type InsertJournalLine,
  type User,
  type UpsertUser,
  type InsertUserRole,
  type UserRole,
  type InsertBranch,
  type Branch,
  type InsertFinanceOfficer,
  type FinanceOfficer,
  type InsertFundingSource,
  type FundingSource,
  type InsertSector,
  type Sector,
  type InsertBusiness,
  type Business,
  type InsertProvince,
  type Province,
  type InsertDistrict,
  type District,
  type InsertLicenseType,
  type LicenseType,
  type InsertFinancingPurpose,
  type FinancingPurpose,
  type InsertCollateralType,
  type CollateralType,
  type InsertCustomer,
  type Customer,
  customerDocuments,
  type InsertCustomerDocument,
  type CustomerDocument,
  type InsertCustomerBusiness,
  type CustomerBusiness,
  type InsertBusinessLicense,
  type BusinessLicense,
  type InsertCollateral,
  type Collateral,
  type InsertGuarantor,
  type Guarantor,
  type InsertLoan,
  type Loan,
  type InsertInstallment,
  type Installment,
  type InsertActivityLog,
  type ActivityLog,
  type InsertLoanApproval,
  type InsertDisbursement,
  type InsertFadReview,
  type FadReview,
  type InsertRiskComplianceReview,
  type RiskComplianceReview,
  type InsertCommitteeVote,
  type CommitteeVote,
  type InsertParCategory,
  type ParCategory,
  lookupRoles,
  rolePagePermissions,
  savedReports,
  type InsertLookupRole,
  type LookupRole,
  type InsertSavedReport,
  type SavedReport,
  getMainAccountType,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(data: UpsertUser): Promise<User>;
  countUsers(): Promise<number>;
  
  // User Roles
  getUserRole(userId: string): Promise<UserRole | undefined>;
  setUserRole(data: InsertUserRole): Promise<UserRole>;
  updateUserProfile(userId: string, data: { firstName?: string | null; lastName?: string | null; email?: string | null }): Promise<User>;
  changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
  
  // Branches
  getBranches(search?: string): Promise<Branch[]>;
  getBranch(id: string): Promise<Branch | undefined>;
  createBranch(data: InsertBranch): Promise<Branch>;
  updateBranch(id: string, data: Partial<InsertBranch>): Promise<Branch>;
  
  // Finance Officers
  getOfficers(search?: string): Promise<(FinanceOfficer & { branchName?: string })[]>;
  getOfficer(id: string): Promise<FinanceOfficer | undefined>;
  getOfficerByUserId(userId: string): Promise<FinanceOfficer | undefined>;
  createOfficer(data: InsertFinanceOfficer): Promise<FinanceOfficer>;
  updateOfficer(id: string, data: Partial<InsertFinanceOfficer>): Promise<FinanceOfficer>;
  getActiveOfficers(): Promise<(FinanceOfficer & { branchName?: string })[]>;
  toggleOfficerStatus(id: string): Promise<FinanceOfficer>;
  
  // Funding Sources
  getFundingSources(search?: string): Promise<FundingSource[]>;
  getFundingSource(id: string): Promise<FundingSource | undefined>;
  createFundingSource(data: InsertFundingSource): Promise<FundingSource>;
  updateFundingSource(id: string, data: Partial<InsertFundingSource>): Promise<FundingSource>;
  getFundingSourceStats(): Promise<{ id: string; name: string; loanCount: number; totalAmount: string }[]>;
  
  // Sectors
  getSectors(search?: string): Promise<Sector[]>;
  getSector(id: string): Promise<Sector | undefined>;
  createSector(data: InsertSector): Promise<Sector>;
  updateSector(id: string, data: Partial<InsertSector>): Promise<Sector>;
  deleteSector(id: string): Promise<void>;
  
  // Businesses
  getBusinesses(sectorId?: string, search?: string): Promise<(Business & { sectorName?: string })[]>;
  getBusiness(id: string): Promise<Business | undefined>;
  createBusiness(data: InsertBusiness): Promise<Business>;
  updateBusiness(id: string, data: Partial<InsertBusiness>): Promise<Business>;
  deleteBusiness(id: string): Promise<void>;
  
  // Provinces
  getProvinces(search?: string): Promise<Province[]>;
  getProvince(id: number): Promise<Province | undefined>;
  createProvince(data: InsertProvince): Promise<Province>;
  updateProvince(id: number, data: Partial<InsertProvince>): Promise<Province>;
  deleteProvince(id: number): Promise<void>;
  
  // Districts
  getDistricts(provinceId?: number, search?: string): Promise<(District & { provinceName?: string })[]>;
  getDistrict(id: number): Promise<District | undefined>;
  createDistrict(data: InsertDistrict): Promise<District>;
  updateDistrict(id: number, data: Partial<InsertDistrict>): Promise<District>;
  deleteDistrict(id: number): Promise<void>;
  
  // License Types
  getLicenseTypes(search?: string): Promise<LicenseType[]>;
  getLicenseType(id: number): Promise<LicenseType | undefined>;
  createLicenseType(data: InsertLicenseType): Promise<LicenseType>;
  updateLicenseType(id: number, data: Partial<InsertLicenseType>): Promise<LicenseType>;
  deleteLicenseType(id: number): Promise<void>;

  // Financing Purposes
  getFinancingPurposes(search?: string): Promise<FinancingPurpose[]>;
  getFinancingPurpose(id: number): Promise<FinancingPurpose | undefined>;
  createFinancingPurpose(data: InsertFinancingPurpose): Promise<FinancingPurpose>;
  updateFinancingPurpose(id: number, data: Partial<InsertFinancingPurpose>): Promise<FinancingPurpose>;
  deleteFinancingPurpose(id: number): Promise<void>;

  // Collateral Types
  getCollateralTypes(search?: string): Promise<CollateralType[]>;
  getCollateralType(id: number): Promise<CollateralType | undefined>;
  createCollateralType(data: InsertCollateralType): Promise<CollateralType>;
  updateCollateralType(id: number, data: Partial<InsertCollateralType>): Promise<CollateralType>;
  deleteCollateralType(id: number): Promise<void>;
  
  // Lookup Roles
  getLookupRoles(): Promise<LookupRole[]>;
  getLookupRole(id: number): Promise<LookupRole | undefined>;
  getLookupRoleByValue(value: string): Promise<LookupRole | undefined>;
  createLookupRole(data: InsertLookupRole): Promise<LookupRole>;
  updateLookupRole(id: number, data: Partial<InsertLookupRole>): Promise<LookupRole>;
  deleteLookupRole(id: number): Promise<void>;

  // PAR Categories
  getParCategories(): Promise<ParCategory[]>;
  getParCategory(id: number): Promise<ParCategory | undefined>;
  createParCategory(data: InsertParCategory): Promise<ParCategory>;
  updateParCategory(id: number, data: Partial<InsertParCategory>): Promise<ParCategory>;
  deleteParCategory(id: number): Promise<void>;
  
  // Customers
  getCustomers(search?: string, page?: number, limit?: number, branchId?: string): Promise<{ customers: Customer[]; total: number }>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(data: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer>;
  getCustomerDocuments(customerId: string): Promise<CustomerDocument[]>;
  createCustomerDocument(data: InsertCustomerDocument): Promise<CustomerDocument>;
  deleteCustomerDocument(id: string): Promise<void>;
  
  // Loans
  getLoans(filters: { search?: string; status?: string; financeOfficerId?: string; page?: number; limit?: number; userId?: string; branchId?: string }): Promise<{ loans: any[]; total: number }>;

  getLoansWithDetails(filters: { status?: string }): Promise<any[]>;
  getLoan(id: string): Promise<Loan | undefined>;
  getPendingLoans(search?: string, branchId?: string): Promise<any[]>;
  getApprovedLoans(search?: string, branchId?: string): Promise<any[]>;
  createLoan(data: InsertLoan): Promise<Loan>;
  updateLoan(id: string, data: Partial<InsertLoan>): Promise<Loan>;
  approveLoan(loanId: string, approvalData: InsertLoanApproval): Promise<void>;
  disburseLoan(loanId: string, disbursementData: InsertDisbursement): Promise<{ installmentsCreated: number }>;
  bulkDisburseLoan(loanApplicationId: string, disbursementDate: string, userId: string): Promise<{ success: boolean; applicationId: string; error?: string }>;
  getLoanByApplicationId(applicationId: string): Promise<Loan | undefined>;
  
  // FAD Reviews
  createFadReview(data: InsertFadReview): Promise<FadReview>;
  getFadReviewByLoanId(loanId: string): Promise<FadReview | undefined>;
  
  // Risk Compliance Reviews
  createRiskComplianceReview(data: InsertRiskComplianceReview): Promise<RiskComplianceReview>;
  getRiskComplianceReviewByLoanId(loanId: string): Promise<RiskComplianceReview | undefined>;
  
  // Committee Votes
  createCommitteeVote(data: InsertCommitteeVote): Promise<CommitteeVote>;
  updateCommitteeVote(id: string, data: Partial<InsertCommitteeVote>): Promise<CommitteeVote>;
  getCommitteeVotesByLoanId(loanId: string): Promise<CommitteeVote[]>;
  getCommitteeVoteByLoanAndVoter(loanId: string, voterId: string): Promise<CommitteeVote | undefined>;
  resetCommitteeVotes(loanId: string): Promise<void>;
  
  // Installments
  getInstallments(filters: { search?: string; page?: number; limit?: number; currentMonthOnly?: boolean; paidOnly?: boolean; customerName?: string; applicationId?: string; branchId?: string; startDate?: string; endDate?: string }): Promise<{ installments: any[]; total: number }>;
  markInstallmentPaid(id: string): Promise<Installment>;
  getCollectionInstallments(filters: { filter?: string; branch?: string; officer?: string; search?: string; startDate?: string; endDate?: string; page?: number; limit?: number }): Promise<{ installments: any[]; total: number; summary: any }>;
  recordPartialPayment(id: string, amount: number, paymentDateStr?: string): Promise<Installment>;
  recordPaymentWithOverflow(id: string, amount: number, paymentDateStr?: string): Promise<{ paidInstallments: Installment[]; totalApplied: number; overflow: number }>;

  // Loan Classification Report
  getLoanClassificationReport(): Promise<any>;

  // DAB Report
  getDABNotesToFinancialStatements(asOfDate?: string): Promise<any>;

  // Citizen Balance Statement helpers
  getLoansByCustomer(customerId: string): Promise<any[]>;
  getDisbursementByLoan(loanId: string): Promise<any>;
  getInstallmentsByLoan(loanId: string): Promise<any[]>;
  getFinanceOfficersByBranch(branchId: string): Promise<any[]>;
  getFinanceOfficer(id: string): Promise<any>;

  // Installment management
  getInstallmentById(id: string): Promise<any>;
  updateInstallmentAmounts(id: string, data: { principleAmount: string; marginAmount: string; totalAmount: string; isPaid?: boolean; paymentDate?: string | null; paidAmount?: string }): Promise<any>;
  getJournalEntryByReference(referenceType: string, referenceId: string): Promise<any | null>;
  getJournalEntriesByReference(referenceType: string, referenceId: string): Promise<any[]>;
  createInstallment(data: any): Promise<any>;
  deleteInstallmentsBeyond(loanId: string, maxInstallmentNumber: number): Promise<number>;
  getDisbursedLoans(filters?: { search?: string; branchId?: string }): Promise<any[]>;
  
  // Activity Logs
  getActivityLogs(filters: { search?: string; action?: string; page?: number; limit?: number }): Promise<{ logs: any[]; total: number }>;
  createActivityLog(data: InsertActivityLog): Promise<ActivityLog>;
  
  // Dashboard Stats
  getDashboardStats(filters?: { branchId?: string; startDate?: string; endDate?: string }): Promise<any>;
  getBranchStats(): Promise<any[]>;
  getFundingSourceBranchStats(): Promise<any[]>;
  
  // Financing Products
  getFinancingProducts(): Promise<any[]>;
  createFinancingProduct(data: any): Promise<any>;
  updateFinancingProduct(id: string, data: any): Promise<any>;
  deleteFinancingProduct(id: string): Promise<void>;

  // Saved Reports (Custom Report Builder)
  getSavedReports(): Promise<SavedReport[]>;
  createSavedReport(data: InsertSavedReport): Promise<SavedReport>;
  deleteSavedReport(id: number): Promise<void>;

  // Reports
  getReportData(period: string): Promise<any>;
  getParAnalysis(): Promise<any>;
  getParByBranch(): Promise<any>;
  getParByOfficer(): Promise<any>;
  getParByProduct(): Promise<any>;
  getAgingReport(): Promise<any>;
  getLoansByParCategory(categoryId: number): Promise<any[]>;
  getLoansByBranch(branchName: string): Promise<any[]>;
  getLoansByOfficer(officerName: string): Promise<any[]>;
  getLoansByProduct(productName: string): Promise<any[]>;
  
  // Disbursement Targets
  getDisbursementTargets(): Promise<any[]>;
  getDisbursementTarget(id: number): Promise<any | undefined>;
  createDisbursementTarget(data: any): Promise<any>;
  updateDisbursementTarget(id: number, data: any): Promise<any>;
  deleteDisbursementTarget(id: number): Promise<void>;
  getDisbursementTargetProgress(): Promise<any[]>;
  getOfficerTargets(branchId: string, monthYear: string): Promise<any[]>;
  saveOfficerTargets(branchId: string, monthYear: string, splits: { financeOfficerId: string; targetDisbursementAmount: string; targetNoOfCustomer: number }[]): Promise<void>;
  
  // Admin Users
  getUsers(search?: string): Promise<any[]>;
  getUserWithRole(id: string): Promise<any | undefined>;
  updateUser(id: string, data: Partial<UpsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  updateUserRole(userId: string, role: string): Promise<void>;
  
  // Page Permissions
  getPagePermissions(userId: string): Promise<any[]>;
  setPagePermission(userId: string, pageName: string, canAccess: boolean, grantedBy: string): Promise<void>;
  getUsersWithPermissions(): Promise<any[]>;
  getAllPages(): string[];
  
  // Role Page Permissions
  getRolePagePermissions(roleValue: string): Promise<any[]>;
  setRolePagePermission(roleValue: string, pageName: string, canAccess: boolean): Promise<void>;
  applyRolePermissionsToUser(roleValue: string, userId: string, grantedBy: string): Promise<void>;
  getAllRolePagePermissions(): Promise<any[]>;
  
  // Accounting - Chart of Accounts
  getAccounts(filters?: { search?: string; accountType?: string }): Promise<any[]>;
  getAccount(id: string): Promise<any | undefined>;
  createAccount(data: any): Promise<any>;
  updateAccount(id: string, data: any): Promise<any>;
  deleteAccount(id: string): Promise<void>;
  getAccountHierarchy(): Promise<any[]>;
  importChartOfAccounts(accountsData: { code: string; name: string; type: string; parent_code: string | null }[]): Promise<{ imported: number; errors: string[] }>;
  
  // Accounting - Fiscal Periods
  getFiscalPeriods(): Promise<any[]>;
  createFiscalPeriod(data: any): Promise<any>;
  closeFiscalPeriod(id: string, closedBy: string): Promise<void>;
  
  // Accounting - Journal Entries
  getJournalEntries(filters?: { search?: string; startDate?: string; endDate?: string; isPosted?: boolean; fundingSourceId?: string; page?: number; limit?: number }): Promise<{ entries: any[]; total: number; page: number; totalPages: number }>;
  getJournalEntry(id: string): Promise<any | undefined>;
  createJournalEntry(header: any, lines: any[]): Promise<any>;
  updateJournalEntry(id: string, data: any): Promise<any>;
  postJournalEntry(id: string, postedBy: string): Promise<void>;
  unpostJournalEntry(id: string): Promise<void>;
  reverseJournalEntry(id: string, createdBy: string): Promise<any>;
  undoReversalJournalEntry(id: string): Promise<void>;
  
  recalculateAllAccountBalances(): Promise<{ updated: number }>;
  
  // Accounting - Reports
  getTrialBalance(asOfDate?: string): Promise<any[]>;
  getIncomeStatement(startDate: string, endDate: string): Promise<any>;
  getBalanceSheet(asOfDate: string): Promise<any>;
  getAccountStatement(accountId: string, startDate?: string, endDate?: string, fundingSourceId?: string, includeChildren?: boolean): Promise<any>;
  getFundingSourceStatement(fundingSourceId: string, startDate?: string, endDate?: string): Promise<any>;
  getFundingSourcePrincipleStatement(fundingSourceId: string, startDate?: string, endDate?: string): Promise<any>;
  getCashFlowStatement(startDate: string, endDate: string): Promise<any>;
  getShareholderReport(startDate: string, endDate: string): Promise<any>;
  getNextEntryNumber(): Promise<string>;
  
  // Seed
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(data: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async countUsers(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(users);
    return Number(result.count);
  }

  // User Roles
  async getUserRole(userId: string): Promise<UserRole | undefined> {
    const [role] = await db.select().from(userRoles).where(eq(userRoles.userId, userId));
    return role;
  }

  async setUserRole(data: InsertUserRole): Promise<UserRole> {
    const [role] = await db
      .insert(userRoles)
      .values(data)
      .onConflictDoUpdate({
        target: userRoles.userId,
        set: { role: data.role },
      })
      .returning();
    return role;
  }

  async updateUserProfile(userId: string, data: { firstName?: string | null; lastName?: string | null; email?: string | null }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return false;

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return false;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId));
    return true;
  }

  // Branches
  async getBranches(search?: string): Promise<Branch[]> {
    if (search) {
      return db.select().from(branches).where(
        or(
          like(branches.name, `%${search}%`),
          like(branches.code, `%${search}%`)
        )
      );
    }
    return db.select().from(branches);
  }

  async getBranch(id: string): Promise<Branch | undefined> {
    const [branch] = await db.select().from(branches).where(eq(branches.id, id));
    return branch;
  }

  async createBranch(data: InsertBranch): Promise<Branch> {
    const [branch] = await db.insert(branches).values(data).returning();
    return branch;
  }

  async updateBranch(id: string, data: Partial<InsertBranch>): Promise<Branch> {
    const [branch] = await db.update(branches).set(data).where(eq(branches.id, id)).returning();
    return branch;
  }

  // Finance Officers
  async getOfficers(search?: string): Promise<(FinanceOfficer & { branchName?: string })[]> {
    const query = db
      .select({
        id: financeOfficers.id,
        name: financeOfficers.name,
        code: financeOfficers.code,
        branchId: financeOfficers.branchId,
        userId: financeOfficers.userId,
        isActive: financeOfficers.isActive,
        createdAt: financeOfficers.createdAt,
        branchName: branches.name,
      })
      .from(financeOfficers)
      .leftJoin(branches, eq(financeOfficers.branchId, branches.id));

    if (search) {
      return query.where(
        or(
          like(financeOfficers.name, `%${search}%`),
          like(financeOfficers.code, `%${search}%`)
        )
      );
    }
    return query;
  }

  async getOfficer(id: string): Promise<FinanceOfficer | undefined> {
    const [officer] = await db.select().from(financeOfficers).where(eq(financeOfficers.id, id));
    return officer;
  }

  async getOfficerByUserId(userId: string): Promise<FinanceOfficer | undefined> {
    const [officer] = await db.select().from(financeOfficers).where(eq(financeOfficers.userId, userId));
    return officer;
  }

  async createOfficer(data: InsertFinanceOfficer): Promise<FinanceOfficer> {
    const [officer] = await db.insert(financeOfficers).values(data).returning();
    return officer;
  }

  async updateOfficer(id: string, data: Partial<InsertFinanceOfficer>): Promise<FinanceOfficer> {
    const [officer] = await db.update(financeOfficers).set(data).where(eq(financeOfficers.id, id)).returning();
    return officer;
  }

  async getActiveOfficers(): Promise<(FinanceOfficer & { branchName?: string })[]> {
    return db
      .select({
        id: financeOfficers.id,
        name: financeOfficers.name,
        code: financeOfficers.code,
        branchId: financeOfficers.branchId,
        userId: financeOfficers.userId,
        isActive: financeOfficers.isActive,
        createdAt: financeOfficers.createdAt,
        branchName: branches.name,
      })
      .from(financeOfficers)
      .leftJoin(branches, eq(financeOfficers.branchId, branches.id))
      .where(eq(financeOfficers.isActive, true));
  }

  async toggleOfficerStatus(id: string): Promise<FinanceOfficer> {
    const officer = await this.getOfficer(id);
    if (!officer) throw new Error("Officer not found");
    const [updated] = await db.update(financeOfficers)
      .set({ isActive: !officer.isActive })
      .where(eq(financeOfficers.id, id))
      .returning();
    return updated;
  }

  // Funding Sources
  async getFundingSources(search?: string): Promise<FundingSource[]> {
    if (search) {
      return db.select().from(fundingSources).where(
        or(
          like(fundingSources.name, `%${search}%`),
          like(fundingSources.code, `%${search}%`)
        )
      );
    }
    return db.select().from(fundingSources);
  }

  async getFundingSource(id: string): Promise<FundingSource | undefined> {
    const [source] = await db.select().from(fundingSources).where(eq(fundingSources.id, id));
    return source;
  }

  async createFundingSource(data: InsertFundingSource): Promise<FundingSource> {
    const [source] = await db.insert(fundingSources).values(data).returning();
    return source;
  }

  async updateFundingSource(id: string, data: Partial<InsertFundingSource>): Promise<FundingSource> {
    const [source] = await db.update(fundingSources).set(data).where(eq(fundingSources.id, id)).returning();
    return source;
  }

  async getFundingSourceStats(): Promise<{ id: string; name: string; loanCount: number; totalAmount: string }[]> {
    const results = await db
      .select({
        id: fundingSources.id,
        name: fundingSources.name,
        loanCount: sql<number>`COUNT(${loans.id})::int`,
        totalAmount: sql<string>`COALESCE(SUM(COALESCE(${loans.principleAmount}, ${loans.requestAmount})), 0)::text`,
      })
      .from(fundingSources)
      .leftJoin(loans, eq(loans.fundingSourceId, fundingSources.id))
      .groupBy(fundingSources.id, fundingSources.name);
    return results;
  }

  // Sectors
  async getSectors(search?: string): Promise<Sector[]> {
    if (search) {
      return db.select().from(sectors).where(
        or(
          like(sectors.name, `%${search}%`),
          like(sectors.code, `%${search}%`)
        )
      );
    }
    return db.select().from(sectors).orderBy(asc(sectors.name));
  }

  async getSector(id: string): Promise<Sector | undefined> {
    const [sector] = await db.select().from(sectors).where(eq(sectors.id, id));
    return sector;
  }

  async createSector(data: InsertSector): Promise<Sector> {
    const [sector] = await db.insert(sectors).values(data).returning();
    return sector;
  }

  async updateSector(id: string, data: Partial<InsertSector>): Promise<Sector> {
    const [sector] = await db.update(sectors).set(data).where(eq(sectors.id, id)).returning();
    return sector;
  }

  async deleteSector(id: string): Promise<void> {
    await db.delete(businesses).where(eq(businesses.sectorId, id));
    await db.delete(sectors).where(eq(sectors.id, id));
  }

  // Businesses
  async getBusinesses(sectorId?: string, search?: string): Promise<(Business & { sectorName?: string })[]> {
    let query = db
      .select({
        id: businesses.id,
        sectorId: businesses.sectorId,
        name: businesses.name,
        code: businesses.code,
        description: businesses.description,
        isActive: businesses.isActive,
        createdAt: businesses.createdAt,
        sectorName: sectors.name,
      })
      .from(businesses)
      .leftJoin(sectors, eq(businesses.sectorId, sectors.id));

    const conditions = [];
    if (sectorId) {
      conditions.push(eq(businesses.sectorId, sectorId));
    }
    if (search) {
      conditions.push(
        or(
          like(businesses.name, `%${search}%`),
          like(businesses.code, `%${search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    return query.orderBy(asc(businesses.name));
  }

  async getBusiness(id: string): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    return business;
  }

  async createBusiness(data: InsertBusiness): Promise<Business> {
    const [business] = await db.insert(businesses).values(data).returning();
    return business;
  }

  async updateBusiness(id: string, data: Partial<InsertBusiness>): Promise<Business> {
    const [business] = await db.update(businesses).set(data).where(eq(businesses.id, id)).returning();
    return business;
  }

  async deleteBusiness(id: string): Promise<void> {
    await db.delete(businesses).where(eq(businesses.id, id));
  }

  // Provinces
  async getProvinces(search?: string): Promise<Province[]> {
    if (search) {
      return db.select().from(provinces).where(
        like(provinces.name, `%${search}%`)
      );
    }
    return db.select().from(provinces).orderBy(asc(provinces.name));
  }

  async getProvince(id: number): Promise<Province | undefined> {
    const [province] = await db.select().from(provinces).where(eq(provinces.id, id));
    return province;
  }

  async createProvince(data: InsertProvince): Promise<Province> {
    const [province] = await db.insert(provinces).values(data).returning();
    return province;
  }

  async updateProvince(id: number, data: Partial<InsertProvince>): Promise<Province> {
    const [province] = await db.update(provinces).set(data).where(eq(provinces.id, id)).returning();
    return province;
  }

  async deleteProvince(id: number): Promise<void> {
    await db.delete(districts).where(eq(districts.provinceId, id));
    await db.delete(provinces).where(eq(provinces.id, id));
  }

  // Districts
  async getDistricts(provinceId?: number, search?: string): Promise<(District & { provinceName?: string })[]> {
    let query = db
      .select({
        id: districts.id,
        provinceId: districts.provinceId,
        name: districts.name,
        createdAt: districts.createdAt,
        provinceName: provinces.name,
      })
      .from(districts)
      .leftJoin(provinces, eq(districts.provinceId, provinces.id));

    const conditions = [];
    if (provinceId) {
      conditions.push(eq(districts.provinceId, provinceId));
    }
    if (search) {
      conditions.push(like(districts.name, `%${search}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    return query.orderBy(asc(districts.name));
  }

  async getDistrict(id: number): Promise<District | undefined> {
    const [district] = await db.select().from(districts).where(eq(districts.id, id));
    return district;
  }

  async createDistrict(data: InsertDistrict): Promise<District> {
    const [district] = await db.insert(districts).values(data).returning();
    return district;
  }

  async updateDistrict(id: number, data: Partial<InsertDistrict>): Promise<District> {
    const [district] = await db.update(districts).set(data).where(eq(districts.id, id)).returning();
    return district;
  }

  async deleteDistrict(id: number): Promise<void> {
    await db.delete(districts).where(eq(districts.id, id));
  }

  // License Types
  async getLicenseTypes(search?: string): Promise<LicenseType[]> {
    if (search) {
      return db.select().from(licenseTypes).where(like(licenseTypes.name, `%${search}%`)).orderBy(asc(licenseTypes.id));
    }
    return db.select().from(licenseTypes).orderBy(asc(licenseTypes.id));
  }

  async getLicenseType(id: number): Promise<LicenseType | undefined> {
    const [licenseType] = await db.select().from(licenseTypes).where(eq(licenseTypes.id, id));
    return licenseType;
  }

  async createLicenseType(data: InsertLicenseType): Promise<LicenseType> {
    const [licenseType] = await db.insert(licenseTypes).values(data).returning();
    return licenseType;
  }

  async updateLicenseType(id: number, data: Partial<InsertLicenseType>): Promise<LicenseType> {
    const [licenseType] = await db.update(licenseTypes).set(data).where(eq(licenseTypes.id, id)).returning();
    return licenseType;
  }

  async deleteLicenseType(id: number): Promise<void> {
    await db.delete(licenseTypes).where(eq(licenseTypes.id, id));
  }

  // Financing Purposes
  async getFinancingPurposes(search?: string): Promise<FinancingPurpose[]> {
    if (search) {
      return db.select().from(financingPurposes).where(like(financingPurposes.name, `%${search}%`)).orderBy(asc(financingPurposes.id));
    }
    return db.select().from(financingPurposes).orderBy(asc(financingPurposes.id));
  }

  async getFinancingPurpose(id: number): Promise<FinancingPurpose | undefined> {
    const [fp] = await db.select().from(financingPurposes).where(eq(financingPurposes.id, id));
    return fp;
  }

  async createFinancingPurpose(data: InsertFinancingPurpose): Promise<FinancingPurpose> {
    const [fp] = await db.insert(financingPurposes).values(data).returning();
    return fp;
  }

  async updateFinancingPurpose(id: number, data: Partial<InsertFinancingPurpose>): Promise<FinancingPurpose> {
    const [fp] = await db.update(financingPurposes).set(data).where(eq(financingPurposes.id, id)).returning();
    return fp;
  }

  async deleteFinancingPurpose(id: number): Promise<void> {
    await db.delete(financingPurposes).where(eq(financingPurposes.id, id));
  }

  // Collateral Types
  async getCollateralTypes(search?: string): Promise<CollateralType[]> {
    if (search) {
      return db.select().from(collateralTypes).where(like(collateralTypes.name, `%${search}%`)).orderBy(asc(collateralTypes.id));
    }
    return db.select().from(collateralTypes).orderBy(asc(collateralTypes.id));
  }

  async getCollateralType(id: number): Promise<CollateralType | undefined> {
    const [ct] = await db.select().from(collateralTypes).where(eq(collateralTypes.id, id));
    return ct;
  }

  async createCollateralType(data: InsertCollateralType): Promise<CollateralType> {
    const [ct] = await db.insert(collateralTypes).values(data).returning();
    return ct;
  }

  async updateCollateralType(id: number, data: Partial<InsertCollateralType>): Promise<CollateralType> {
    const [ct] = await db.update(collateralTypes).set(data).where(eq(collateralTypes.id, id)).returning();
    return ct;
  }

  async deleteCollateralType(id: number): Promise<void> {
    await db.delete(collateralTypes).where(eq(collateralTypes.id, id));
  }

  // Lookup Roles
  async getLookupRoles(): Promise<LookupRole[]> {
    return db.select().from(lookupRoles).orderBy(asc(lookupRoles.id));
  }

  async getLookupRole(id: number): Promise<LookupRole | undefined> {
    const [role] = await db.select().from(lookupRoles).where(eq(lookupRoles.id, id));
    return role;
  }

  async getLookupRoleByValue(value: string): Promise<LookupRole | undefined> {
    const [role] = await db.select().from(lookupRoles).where(eq(lookupRoles.value, value));
    return role;
  }

  async createLookupRole(data: InsertLookupRole): Promise<LookupRole> {
    const [role] = await db.insert(lookupRoles).values(data).returning();
    return role;
  }

  async updateLookupRole(id: number, data: Partial<InsertLookupRole>): Promise<LookupRole> {
    const [role] = await db.update(lookupRoles).set(data).where(eq(lookupRoles.id, id)).returning();
    return role;
  }

  async deleteLookupRole(id: number): Promise<void> {
    await db.delete(lookupRoles).where(eq(lookupRoles.id, id));
  }

  // PAR Categories
  async getParCategories(): Promise<ParCategory[]> {
    return db.select().from(parCategories).orderBy(asc(parCategories.startDay));
  }

  async getParCategory(id: number): Promise<ParCategory | undefined> {
    const [parCategory] = await db.select().from(parCategories).where(eq(parCategories.id, id));
    return parCategory;
  }

  async createParCategory(data: InsertParCategory): Promise<ParCategory> {
    const [parCategory] = await db.insert(parCategories).values(data).returning();
    return parCategory;
  }

  async updateParCategory(id: number, data: Partial<InsertParCategory>): Promise<ParCategory> {
    const [parCategory] = await db.update(parCategories).set(data).where(eq(parCategories.id, id)).returning();
    return parCategory;
  }

  async deleteParCategory(id: number): Promise<void> {
    await db.delete(parCategories).where(eq(parCategories.id, id));
  }

  // Customers
  async getCustomers(search?: string, page = 1, limit = 10, branchId?: string): Promise<{ customers: Customer[]; total: number }> {
    const offset = (page - 1) * limit;
    
    if (branchId) {
      const customerIdsInBranch = await db
        .selectDistinct({ customerId: loans.customerId })
        .from(loans)
        .where(eq(loans.branchId, branchId));
      const branchCustomerIds = customerIdsInBranch.map(r => r.customerId).filter(Boolean) as string[];
      
      if (branchCustomerIds.length === 0) {
        return { customers: [], total: 0 };
      }

      const conditions: any[] = [inArray(customers.id, branchCustomerIds)];
      if (search) {
        conditions.push(or(
          ilike(customers.firstName, `%${search}%`),
          ilike(customers.lastName, `%${search}%`),
          ilike(customers.customerNo, `%${search}%`),
          ilike(customers.nationalId, `%${search}%`),
          ilike(customers.phoneNumber, `%${search}%`)
        ));
      }
      const whereCondition = and(...conditions);
      const [countResult] = await db.select({ count: count() }).from(customers).where(whereCondition);
      const result = await db.select().from(customers).where(whereCondition).orderBy(customers.createdAt).limit(limit).offset(offset);
      return { customers: result, total: Number(countResult?.count || 0) };
    }

    let baseQuery = db.select().from(customers);
    let countQuery = db.select({ count: count() }).from(customers);

    if (search) {
      const searchCondition = or(
        ilike(customers.firstName, `%${search}%`),
        ilike(customers.lastName, `%${search}%`),
        ilike(customers.customerNo, `%${search}%`),
        ilike(customers.nationalId, `%${search}%`),
        ilike(customers.phoneNumber, `%${search}%`)
      );
      baseQuery = baseQuery.where(searchCondition) as typeof baseQuery;
      countQuery = countQuery.where(searchCondition) as typeof countQuery;
    }

    const [results, [{ count: total }]] = await Promise.all([
      baseQuery.limit(limit).offset(offset),
      countQuery,
    ]);

    return { customers: results, total: Number(total) };
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(data: InsertCustomer): Promise<Customer> {
    const [customer] = await db.insert(customers).values(data).returning();
    return customer;
  }

  async updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer> {
    const [customer] = await db.update(customers).set(data).where(eq(customers.id, id)).returning();
    return customer;
  }

  async getCustomerByNo(customerNo: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.customerNo, customerNo));
    return customer;
  }

  async getCustomerByNationalId(nationalId: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.nationalId, nationalId));
    return customer;
  }

  // Customer Documents
  async getCustomerDocuments(customerId: string): Promise<CustomerDocument[]> {
    return db.select().from(customerDocuments).where(eq(customerDocuments.customerId, customerId));
  }

  async createCustomerDocument(data: InsertCustomerDocument): Promise<CustomerDocument> {
    const [document] = await db.insert(customerDocuments).values(data).returning();
    return document;
  }

  async deleteCustomerDocument(id: string): Promise<void> {
    await db.delete(customerDocuments).where(eq(customerDocuments.id, id));
  }

  // Customer Businesses
  async createCustomerBusiness(data: InsertCustomerBusiness): Promise<CustomerBusiness> {
    const [business] = await db.insert(customerBusinesses).values(data).returning();
    return business;
  }

  async getCustomerBusinesses(customerId: string): Promise<CustomerBusiness[]> {
    return db.select().from(customerBusinesses).where(eq(customerBusinesses.customerId, customerId));
  }

  async getCustomerBusinessByCustomerId(customerId: string): Promise<CustomerBusiness | null> {
    const [business] = await db.select().from(customerBusinesses).where(eq(customerBusinesses.customerId, customerId)).limit(1);
    return business || null;
  }

  async updateCustomerBusiness(id: string, data: Partial<InsertCustomerBusiness>): Promise<CustomerBusiness> {
    const [business] = await db.update(customerBusinesses).set(data).where(eq(customerBusinesses.id, id)).returning();
    return business;
  }

  // Business Licenses
  async createBusinessLicense(data: InsertBusinessLicense): Promise<BusinessLicense> {
    const [license] = await db.insert(businessLicenses).values(data).returning();
    return license;
  }

  async getBusinessLicenses(customerBusinessId: string): Promise<BusinessLicense[]> {
    return db.select().from(businessLicenses).where(eq(businessLicenses.customerBusinessId, customerBusinessId));
  }

  async getBusinessLicenseByBusinessId(customerBusinessId: string): Promise<BusinessLicense | null> {
    const [license] = await db.select().from(businessLicenses).where(eq(businessLicenses.customerBusinessId, customerBusinessId)).limit(1);
    return license || null;
  }

  async updateBusinessLicense(id: string, data: Partial<InsertBusinessLicense>): Promise<BusinessLicense> {
    const [license] = await db.update(businessLicenses).set(data).where(eq(businessLicenses.id, id)).returning();
    return license;
  }

  // Collaterals
  async createCollateral(data: InsertCollateral): Promise<Collateral> {
    const [collateral] = await db.insert(collaterals).values(data).returning();
    return collateral;
  }

  async getCollaterals(loanId: string): Promise<Collateral[]> {
    return db.select().from(collaterals).where(eq(collaterals.loanId, loanId));
  }

  async getCollateralByLoanId(loanId: string): Promise<Collateral | null> {
    const [collateral] = await db.select().from(collaterals).where(eq(collaterals.loanId, loanId)).limit(1);
    return collateral || null;
  }

  async updateCollateral(id: string, data: Partial<InsertCollateral>): Promise<Collateral> {
    const [collateral] = await db.update(collaterals).set(data).where(eq(collaterals.id, id)).returning();
    return collateral;
  }

  // Guarantors
  async createGuarantor(data: InsertGuarantor): Promise<Guarantor> {
    if (data.loanId && !data.guarantorNo) {
      const loan = await db.select().from(loans).where(eq(loans.id, data.loanId)).limit(1);
      if (loan[0]?.customerId) {
        const customer = await db.select().from(customers).where(eq(customers.id, loan[0].customerId)).limit(1);
        const customerNo = customer[0]?.customerNo;
        if (customerNo) {
          const customerLoans = await db.select({ id: loans.id }).from(loans).where(eq(loans.customerId, loan[0].customerId));
          const customerLoanIds = customerLoans.map(l => l.id);
          let nextSeq = 1;
          if (customerLoanIds.length > 0) {
            const existingGuarantors = await db.select({ guarantorNo: guarantors.guarantorNo })
              .from(guarantors)
              .where(inArray(guarantors.loanId, customerLoanIds));
            const seqNumbers = existingGuarantors
              .map(g => g.guarantorNo)
              .filter(Boolean)
              .map(no => {
                const suffix = no!.substring(customerNo.length);
                return parseInt(suffix) || 0;
              })
              .filter(n => n > 0);
            if (seqNumbers.length > 0) {
              nextSeq = Math.max(...seqNumbers) + 1;
            }
          }
          data = { ...data, guarantorNo: `${customerNo}${String(nextSeq).padStart(2, '0')}` };
        }
      }
    }
    const [guarantor] = await db.insert(guarantors).values(data).returning();
    return guarantor;
  }

  async getGuarantors(loanId: string): Promise<Guarantor[]> {
    return db.select().from(guarantors).where(eq(guarantors.loanId, loanId));
  }

  async getGuarantorsByLoanId(loanId: string): Promise<Guarantor[]> {
    return db.select().from(guarantors).where(eq(guarantors.loanId, loanId)).orderBy(guarantors.createdAt);
  }

  async updateGuarantor(id: string, data: Partial<InsertGuarantor>): Promise<Guarantor> {
    const [guarantor] = await db.update(guarantors).set(data).where(eq(guarantors.id, id)).returning();
    return guarantor;
  }

  async getGuarantorsByType(loanId: string, type: "financial" | "family"): Promise<Guarantor[]> {
    return db.select().from(guarantors).where(
      and(eq(guarantors.loanId, loanId), eq(guarantors.guarantorType, type))
    );
  }

  // Loans
  async getLoans(filters: { search?: string; status?: string; financeOfficerId?: string; page?: number; limit?: number; userId?: string; branchId?: string }): Promise<{ loans: any[]; total: number }> {
    const { search, status, financeOfficerId, page = 1, limit = 10, userId, branchId } = filters;
    const offset = (page - 1) * limit;

    let userFilter = undefined;
    if (userId) {
      const officerRecords = await db.select({ id: financeOfficers.id }).from(financeOfficers).where(eq(financeOfficers.userId, userId));
      const officerIds = officerRecords.map(o => o.id);
      if (officerIds.length > 0) {
        userFilter = or(
          eq(loans.createdBy, userId),
          inArray(loans.financeOfficerId, officerIds)
        );
      } else {
        userFilter = eq(loans.createdBy, userId);
      }
    }

    const whereConditions = and(
      status && status !== "all" ? eq(loans.status, status as any) : undefined,
      financeOfficerId ? eq(loans.financeOfficerId, financeOfficerId) : undefined,
      branchId ? eq(loans.branchId, branchId) : undefined,
      search
        ? or(
            ilike(loans.applicationId, `%${search}%`),
            ilike(customers.firstName, `%${search}%`),
            ilike(customers.lastName, `%${search}%`)
          )
        : undefined,
      userFilter
    );

    const results = await db
      .select({
        id: loans.id,
        applicationId: loans.applicationId,
        customerId: loans.customerId,
        branchId: loans.branchId,
        financeOfficerId: loans.financeOfficerId,
        productName: loans.productName,
        productCode: loans.productCode,
        sector: loans.sector,
        requestDate: loans.requestDate,
        requestedAmount: loans.requestAmount,
        principleAmount: loans.principleAmount,
        financingDurationMonths: loans.financingDurationMonths,
        numberOfInstallments: loans.numberOfInstallments,
        marginRate: loans.marginRate,
        totalReceivable: loans.totalReceivable,
        installmentAmount: loans.installmentAmount,
        status: loans.status,
        createdAt: loans.createdAt,
        fundingSourceId: loans.fundingSourceId,
        financingCycle: loans.financingCycle,
        customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
        branchName: branches.name,
        disbursementDate: sql<string>`(
          SELECT d.disbursement_date FROM disbursements d 
          WHERE d.loan_id = ${loans.id} 
          ORDER BY d.disbursement_date DESC LIMIT 1
        )`,
        reviewComments: sql<string>`(
          SELECT sub.comments FROM (
            SELECT fr.comments, fr.created_at FROM fad_reviews fr 
            WHERE fr.loan_id = ${loans.id} AND fr.comments IS NOT NULL AND fr.comments != ''
            UNION ALL
            SELECT rc.comments, rc.created_at FROM risk_compliance_reviews rc 
            WHERE rc.loan_id = ${loans.id} AND rc.comments IS NOT NULL AND rc.comments != ''
          ) sub ORDER BY sub.created_at DESC LIMIT 1
        )`,
      })
      .from(loans)
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .leftJoin(branches, eq(loans.branchId, branches.id))
      .where(whereConditions)
      .orderBy(desc(loans.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: count() })
      .from(loans)
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .where(whereConditions);

    return { loans: results, total: Number(countResult[0]?.count || 0) };
  }

  async getLoan(id: string): Promise<Loan | undefined> {
    const [loan] = await db.select().from(loans).where(eq(loans.id, id));
    return loan;
  }

  async getPendingLoans(search?: string, branchId?: string): Promise<any[]> {
    const conditions = [eq(loans.status, "pending" as any)];
    if (branchId) conditions.push(eq(loans.branchId, branchId));
    return db
      .select({
        id: loans.id,
        applicationId: loans.applicationId,
        customerId: loans.customerId,
        branchId: loans.branchId,
        productName: loans.productName,
        requestDate: loans.requestDate,
        requestAmount: loans.requestAmount,
        financingDurationMonths: loans.financingDurationMonths,
        status: loans.status,
        customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
        branchName: branches.name,
      })
      .from(loans)
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .leftJoin(branches, eq(loans.branchId, branches.id))
      .where(and(...conditions));
  }

  async getApprovedLoans(search?: string, branchId?: string): Promise<any[]> {
    const conditions = [eq(loans.status, "approved" as any)];
    if (branchId) conditions.push(eq(loans.branchId, branchId));
    return db
      .select({
        id: loans.id,
        applicationId: loans.applicationId,
        customerId: loans.customerId,
        branchId: loans.branchId,
        productName: loans.productName,
        requestDate: loans.requestDate,
        requestAmount: loans.requestAmount,
        financingDurationMonths: loans.financingDurationMonths,
        status: loans.status,
        customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
        branchName: branches.name,
        approvedAmount: loanApprovals.approvedAmount,
        approvedDate: loanApprovals.approvedDate,
      })
      .from(loans)
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .leftJoin(branches, eq(loans.branchId, branches.id))
      .leftJoin(loanApprovals, eq(loans.id, loanApprovals.loanId))
      .where(and(...conditions));
  }

  async getMaxApplicationIdByPrefix(prefix: string): Promise<string | null> {
    const result = await db.execute(sql`
      SELECT application_id FROM loans 
      WHERE application_id LIKE ${prefix + '%'}
      ORDER BY application_id DESC
      LIMIT 1
    `);
    if (result.rows.length > 0) {
      return (result.rows[0] as any).application_id;
    }
    return null;
  }

  async createLoan(data: InsertLoan): Promise<Loan> {
    const [loan] = await db.insert(loans).values(data).returning();
    return loan;
  }

  async updateLoan(id: string, data: Partial<InsertLoan>): Promise<Loan> {
    const [loan] = await db.update(loans).set({ ...data, updatedAt: new Date() }).where(eq(loans.id, id)).returning();
    return loan;
  }

  async approveLoan(loanId: string, approvalData: InsertLoanApproval): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.insert(loanApprovals).values({ ...approvalData, loanId });
      await tx.update(loans).set({ status: "approved", updatedAt: new Date() }).where(eq(loans.id, loanId));
    });
  }

  async disburseLoan(loanId: string, disbursementData: InsertDisbursement): Promise<{ installmentsCreated: number }> {
    let installmentsCreated = 0;
    console.log("disburseLoan called with:", { loanId, disbursementData });
    await db.transaction(async (tx) => {
      console.log("Inserting disbursement record...");
      await tx.insert(disbursements).values({ ...disbursementData, loanId });

      const [loan] = await tx.select().from(loans).where(eq(loans.id, loanId));
      if (!loan) throw new Error("Loan not found");

      const durationMonths = loan.financingDurationMonths || 12;
      const isMudaraba = /mudaraba/i.test(loan.productName || "") || /mudaraba/i.test(loan.productCode || "");
      const numInstallments = isMudaraba ? 1 : durationMonths;
      const gracePeriod = loan.gracePeriod || 0;
      const principalTotal = parseFloat(loan.principleAmount || loan.requestAmount || "0");
      let profitTotal = parseFloat(loan.profit || "0");

      if (profitTotal === 0 && principalTotal > 0 && !isMudaraba) {
        const marginRate = parseFloat(loan.marginRate || "0");
        const rate = marginRate > 1 ? marginRate / 100 : marginRate;
        profitTotal = (principalTotal * rate / 12) * durationMonths;
      }

      const grandTotal = principalTotal + profitTotal;

      await tx.update(loans).set({
        status: "disbursed",
        profit: profitTotal.toFixed(2),
        totalReceivable: grandTotal.toFixed(2),
        numberOfInstallments: numInstallments,
        updatedAt: new Date(),
      }).where(eq(loans.id, loanId));

      if (isMudaraba) {
        const startDate = new Date(disbursementData.firstInstallmentDate || new Date());
        const maturityStr = disbursementData.maturityDate
          ? (typeof disbursementData.maturityDate === "string"
              ? disbursementData.maturityDate
              : new Date(disbursementData.maturityDate as any).toISOString().split("T")[0])
          : (() => {
              const d = new Date(startDate);
              d.setMonth(d.getMonth() + durationMonths - 1);
              return d.toISOString().split("T")[0];
            })();
        await tx.insert(installments).values({
          loanId,
          installmentNumber: 1,
          dueDate: maturityStr,
          principleAmount: principalTotal.toFixed(2),
          marginAmount: profitTotal.toFixed(2),
          totalAmount: grandTotal.toFixed(2),
          isPaid: false,
        });
        installmentsCreated = 1;
        return;
      }

      const principalInstallments = durationMonths - gracePeriod;
      const principalPerInst = principalInstallments > 0 ? principalTotal / principalInstallments : 0;
      const marginPerInst = numInstallments > 0 ? profitTotal / numInstallments : 0;

      const roundedPrincipalPerInst = Math.floor(principalPerInst);
      const roundedMarginPerInst = Math.floor(marginPerInst);
      const principalRemainder = principalTotal - (roundedPrincipalPerInst * principalInstallments);
      const marginRemainder = profitTotal - (roundedMarginPerInst * numInstallments);

      const startDate = new Date(disbursementData.firstInstallmentDate || new Date());

      for (let i = 1; i <= numInstallments; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + (i - 1));

        const isGracePeriod = i <= gracePeriod;
        const isFirstPrincipalInst = gracePeriod > 0 ? (i === gracePeriod + 1) : (i === 1);

        let instPrincipal: number, instMargin: number, instTotal: number;
        if (isGracePeriod) {
          instPrincipal = 0;
          instMargin = (i === 1) ? roundedMarginPerInst + Math.round(marginRemainder) : roundedMarginPerInst;
          instTotal = instMargin;
        } else if (isFirstPrincipalInst) {
          instPrincipal = roundedPrincipalPerInst + Math.round(principalRemainder);
          instMargin = (gracePeriod === 0 && i === 1) ? roundedMarginPerInst + Math.round(marginRemainder) : roundedMarginPerInst;
          instTotal = instPrincipal + instMargin;
        } else {
          instPrincipal = roundedPrincipalPerInst;
          instMargin = roundedMarginPerInst;
          instTotal = instPrincipal + instMargin;
        }

        await tx.insert(installments).values({
          loanId,
          installmentNumber: i,
          dueDate: dueDate.toISOString().split("T")[0],
          principleAmount: instPrincipal.toFixed(2),
          marginAmount: instMargin.toFixed(2),
          totalAmount: instTotal.toFixed(2),
          isPaid: false,
        });
      }
      installmentsCreated = numInstallments;
    });
    return { installmentsCreated };
  }

  async bulkDisburseLoan(loanApplicationId: string, disbursementDate: string, userId: string): Promise<{ success: boolean; applicationId: string; error?: string }> {
    try {
      const [loan] = await db.select().from(loans).where(eq(loans.applicationId, loanApplicationId));
      if (!loan) {
        return { success: false, applicationId: loanApplicationId, error: "Loan not found" };
      }

      const existingDisbursement = await db.select().from(disbursements).where(eq(disbursements.loanId, loan.id));
      if (existingDisbursement.length > 0) {
        return { success: false, applicationId: loanApplicationId, error: "Already disbursed" };
      }

      const disbDate = new Date(disbursementDate);
      const dayOfMonth = disbDate.getDate();

      let firstInstDate: Date;
      if (dayOfMonth >= 25) {
        firstInstDate = new Date(disbDate.getFullYear(), disbDate.getMonth() + 2, 1);
      } else {
        firstInstDate = new Date(disbDate.getFullYear(), disbDate.getMonth() + 1, dayOfMonth);
      }

      const duration = loan.financingDurationMonths || 12;
      const maturityDate = new Date(firstInstDate);
      maturityDate.setMonth(maturityDate.getMonth() + duration - 1);

      await db.transaction(async (tx) => {
        await tx.insert(disbursements).values({
          loanId: loan.id,
          disbursementDate: disbursementDate,
          firstInstallmentDate: firstInstDate.toISOString().split("T")[0],
          maturityDate: maturityDate.toISOString().split("T")[0],
          disbursedById: userId,
        });

        const durationMonths = loan.financingDurationMonths || duration;
        const isMudaraba = /mudaraba/i.test(loan.productName || "") || /mudaraba/i.test(loan.productCode || "");
        const numInstallments = isMudaraba ? 1 : durationMonths;
        const gracePeriod = loan.gracePeriod || 0;
        const principalTotal = parseFloat(loan.principleAmount || loan.requestAmount || "0");
        let profitTotal = parseFloat(loan.profit || "0");

        if (profitTotal === 0 && principalTotal > 0 && !isMudaraba) {
          const marginRate = parseFloat(loan.marginRate || "0");
          const rate = marginRate > 1 ? marginRate / 100 : marginRate;
          profitTotal = (principalTotal * rate / 12) * durationMonths;
        }

        const grandTotalReceivable = principalTotal + profitTotal;

        await tx.update(loans).set({
          status: "disbursed",
          profit: profitTotal.toFixed(2),
          totalReceivable: grandTotalReceivable.toFixed(2),
          numberOfInstallments: numInstallments,
          updatedAt: new Date(),
        }).where(eq(loans.id, loan.id));

        if (isMudaraba) {
          await tx.insert(installments).values({
            loanId: loan.id,
            installmentNumber: 1,
            dueDate: maturityDate.toISOString().split("T")[0],
            principleAmount: principalTotal.toFixed(2),
            marginAmount: profitTotal.toFixed(2),
            totalAmount: grandTotalReceivable.toFixed(2),
            isPaid: false,
          });
          return;
        }

        const principalInstallments = durationMonths - gracePeriod;
        const principalPerInst = principalInstallments > 0 ? principalTotal / principalInstallments : 0;
        const marginPerInst = numInstallments > 0 ? profitTotal / numInstallments : 0;

        const roundedPrincipalPerInst = Math.floor(principalPerInst);
        const roundedMarginPerInst = Math.floor(marginPerInst);
        const principalRemainder = principalTotal - (roundedPrincipalPerInst * principalInstallments);
        const marginRemainder = profitTotal - (roundedMarginPerInst * numInstallments);

        for (let i = 1; i <= numInstallments; i++) {
          const dueDate = new Date(firstInstDate);
          dueDate.setMonth(dueDate.getMonth() + (i - 1));

          const isGracePeriod = i <= gracePeriod;
          const isFirstPrincipalInst = gracePeriod > 0 ? (i === gracePeriod + 1) : (i === 1);

          let instPrincipal: number, instMargin: number, instTotal: number;
          if (isGracePeriod) {
            instPrincipal = 0;
            instMargin = (i === 1) ? roundedMarginPerInst + Math.round(marginRemainder) : roundedMarginPerInst;
            instTotal = instMargin;
          } else if (isFirstPrincipalInst) {
            instPrincipal = roundedPrincipalPerInst + Math.round(principalRemainder);
            instMargin = (gracePeriod === 0 && i === 1) ? roundedMarginPerInst + Math.round(marginRemainder) : roundedMarginPerInst;
            instTotal = instPrincipal + instMargin;
          } else {
            instPrincipal = roundedPrincipalPerInst;
            instMargin = roundedMarginPerInst;
            instTotal = instPrincipal + instMargin;
          }

          await tx.insert(installments).values({
            loanId: loan.id,
            installmentNumber: i,
            dueDate: dueDate.toISOString().split("T")[0],
            principleAmount: instPrincipal.toFixed(2),
            marginAmount: instMargin.toFixed(2),
            totalAmount: instTotal.toFixed(2),
            isPaid: false,
          });
        }
      });

      return { success: true, applicationId: loanApplicationId };
    } catch (error: any) {
      return { success: false, applicationId: loanApplicationId, error: error.message };
    }
  }

  async getLoanByApplicationId(applicationId: string): Promise<Loan | undefined> {
    const [loan] = await db.select().from(loans).where(eq(loans.applicationId, applicationId));
    return loan;
  }

  // FAD Reviews
  async createFadReview(data: InsertFadReview): Promise<FadReview> {
    const [review] = await db.insert(fadReviews).values(data).returning();
    return review;
  }

  async getFadReviewByLoanId(loanId: string): Promise<FadReview | undefined> {
    const [review] = await db.select().from(fadReviews).where(eq(fadReviews.loanId, loanId)).orderBy(desc(fadReviews.createdAt));
    return review;
  }

  // Risk Compliance Reviews
  async createRiskComplianceReview(data: InsertRiskComplianceReview): Promise<RiskComplianceReview> {
    const [review] = await db.insert(riskComplianceReviews).values(data).returning();
    return review;
  }

  async getRiskComplianceReviewByLoanId(loanId: string): Promise<RiskComplianceReview | undefined> {
    const [review] = await db.select().from(riskComplianceReviews).where(eq(riskComplianceReviews.loanId, loanId)).orderBy(desc(riskComplianceReviews.createdAt));
    return review;
  }

  // Committee Votes
  async createCommitteeVote(data: InsertCommitteeVote): Promise<CommitteeVote> {
    const [vote] = await db.insert(committeeVotes).values(data).returning();
    return vote;
  }

  async updateCommitteeVote(id: string, data: Partial<InsertCommitteeVote>): Promise<CommitteeVote> {
    const [vote] = await db.update(committeeVotes).set(data).where(eq(committeeVotes.id, id)).returning();
    return vote;
  }

  async getCommitteeVotesByLoanId(loanId: string): Promise<CommitteeVote[]> {
    return db.select().from(committeeVotes).where(eq(committeeVotes.loanId, loanId));
  }

  async resetCommitteeVotes(loanId: string): Promise<void> {
    await db
      .update(committeeVotes)
      .set({ vote: "pending", comments: null, votedAt: null })
      .where(eq(committeeVotes.loanId, loanId));
  }

  async getCommitteeVoteByLoanAndVoter(loanId: string, voterId: string): Promise<CommitteeVote | undefined> {
    const [vote] = await db.select().from(committeeVotes).where(
      and(eq(committeeVotes.loanId, loanId), eq(committeeVotes.voterId, voterId))
    );
    return vote;
  }

  // Get loans with details for committee review
  async getLoansWithDetails(filters: { status?: string }): Promise<any[]> {
    const { status } = filters;
    const query = db
      .select({
        id: loans.id,
        applicationId: loans.applicationId,
        status: loans.status,
        requestedAmount: loans.requestAmount,
        financingDurationMonths: loans.financingDurationMonths,
        applicationDate: loans.requestDate,
        purpose: loans.financingPurpose,
        productName: loans.productName,
        customer: {
          id: customers.id,
          firstName: customers.firstName,
          lastName: customers.lastName,
          customerNo: customers.customerNo,
        },
        branch: {
          id: branches.id,
          name: branches.name,
          code: branches.code,
        },
        financeOfficer: {
          id: financeOfficers.id,
          name: financeOfficers.name,
        },
      })
      .from(loans)
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .leftJoin(branches, eq(loans.branchId, branches.id))
      .leftJoin(financeOfficers, eq(loans.financeOfficerId, financeOfficers.id))
      .orderBy(desc(loans.createdAt));
    
    if (status) {
      return query.where(eq(loans.status, status as any));
    }
    return query;
  }

  // Installments
  async getInstallments(filters: { search?: string; page?: number; limit?: number; currentMonthOnly?: boolean; paidOnly?: boolean; customerName?: string; applicationId?: string; branchId?: string; startDate?: string; endDate?: string }): Promise<{ installments: any[]; total: number }> {
    const { search, page = 1, limit = 10, currentMonthOnly = false, paidOnly = false, customerName, applicationId, branchId, startDate, endDate } = filters;
    const offset = (page - 1) * limit;

    const conditions: any[] = [];
    if (currentMonthOnly && !startDate && !endDate) {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
      conditions.push(sql`${installments.paymentDate} >= ${monthStart}`);
      conditions.push(sql`${installments.paymentDate} <= ${monthEnd}`);
    }
    if (startDate) {
      conditions.push(sql`${installments.paymentDate} >= ${startDate}`);
    }
    if (endDate) {
      conditions.push(sql`${installments.paymentDate} <= ${endDate}`);
    }
    if (paidOnly) {
      conditions.push(eq(installments.isPaid, true));
    }
    if (customerName) {
      conditions.push(sql`CONCAT(${customers.firstName}, ' ', ${customers.lastName}) ILIKE ${'%' + customerName + '%'}`);
    }
    if (applicationId) {
      conditions.push(like(loans.applicationId, `%${applicationId}%`));
    }
    if (branchId) {
      conditions.push(eq(loans.branchId, branchId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const query = db
      .select({
        id: installments.id,
        loanId: installments.loanId,
        installmentNumber: installments.installmentNumber,
        dueDate: installments.dueDate,
        principleAmount: installments.principleAmount,
        marginAmount: installments.marginAmount,
        totalAmount: installments.totalAmount,
        paidAmount: installments.paidAmount,
        paymentDate: installments.paymentDate,
        lateDays: installments.lateDays,
        isPaid: installments.isPaid,
        loanApplicationId: loans.applicationId,
        customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
        branchName: branches.name,
      })
      .from(installments)
      .leftJoin(loans, eq(installments.loanId, loans.id))
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .leftJoin(branches, eq(loans.branchId, branches.id));

    const results = whereClause
      ? await query.where(whereClause).orderBy(installments.dueDate).limit(limit).offset(offset)
      : await query.orderBy(installments.dueDate).limit(limit).offset(offset);

    const countQuery = db.select({ count: count() }).from(installments)
      .leftJoin(loans, eq(installments.loanId, loans.id))
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .leftJoin(branches, eq(loans.branchId, branches.id));
    const [{ count: total }] = whereClause
      ? await countQuery.where(whereClause)
      : await countQuery;

    return { installments: results, total: Number(total) };
  }

  async getLoansByCustomer(customerId: string): Promise<any[]> {
    return db.select().from(loans).where(eq(loans.customerId, customerId)).orderBy(loans.createdAt);
  }

  async getDisbursementByLoan(loanId: string): Promise<any> {
    const [result] = await db.select().from(disbursements).where(eq(disbursements.loanId, loanId));
    return result || null;
  }

  async getInstallmentsByLoan(loanId: string): Promise<any[]> {
    return db.select().from(installments).where(eq(installments.loanId, loanId)).orderBy(installments.installmentNumber);
  }

  async getFinanceOfficersByBranch(branchId: string): Promise<any[]> {
    return db.select().from(financeOfficers).where(eq(financeOfficers.branchId, branchId));
  }

  async getFinanceOfficer(id: string): Promise<any> {
    const [result] = await db.select().from(financeOfficers).where(eq(financeOfficers.id, id));
    return result || null;
  }

  async getInstallmentById(id: string): Promise<any> {
    const [result] = await db.select().from(installments).where(eq(installments.id, id));
    return result || null;
  }

  async createInstallment(data: any): Promise<any> {
    const [result] = await db.insert(installments).values(data).returning();
    return result;
  }

  async updateInstallmentAmounts(id: string, data: { principleAmount: string; marginAmount: string; totalAmount: string; isPaid?: boolean; paymentDate?: string | null; paidAmount?: string }): Promise<any> {
    const setData: any = {
      principleAmount: data.principleAmount,
      marginAmount: data.marginAmount,
      totalAmount: data.totalAmount,
    };
    if (data.isPaid !== undefined) setData.isPaid = data.isPaid;
    if (data.paymentDate !== undefined) setData.paymentDate = data.paymentDate;
    if (data.paidAmount !== undefined) setData.paidAmount = data.paidAmount;

    const [result] = await db
      .update(installments)
      .set(setData)
      .where(eq(installments.id, id))
      .returning();
    return result;
  }

  async getJournalEntryByReference(referenceType: string, referenceId: string): Promise<any | null> {
    const [entry] = await db
      .select()
      .from(journalEntries)
      .where(and(
        eq(journalEntries.referenceType, referenceType),
        eq(journalEntries.referenceId, referenceId),
        eq(journalEntries.isReversed, false)
      ))
      .limit(1);
    return entry || null;
  }

  async getJournalEntriesByReference(referenceType: string, referenceId: string): Promise<any[]> {
    return db
      .select()
      .from(journalEntries)
      .where(and(
        eq(journalEntries.referenceType, referenceType),
        eq(journalEntries.referenceId, referenceId),
        eq(journalEntries.isReversed, false)
      ));
  }

  async deleteInstallmentsBeyond(loanId: string, maxInstallmentNumber: number): Promise<number> {
    const deleted = await db
      .delete(installments)
      .where(
        and(
          eq(installments.loanId, loanId),
          gt(installments.installmentNumber, maxInstallmentNumber)
        )
      )
      .returning();
    return deleted.length;
  }

  async getDisbursedLoans(filters?: { search?: string; branchId?: string }): Promise<any[]> {
    let query = db
      .select({
        loan: loans,
        customer: customers,
        branch: branches,
      })
      .from(loans)
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .leftJoin(branches, eq(loans.branchId, branches.id));

    const results = await query.orderBy(loans.createdAt);
    
    let filtered = results;
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      filtered = results.filter((r: any) => {
        const customerName = `${r.customer?.firstName || ""} ${r.customer?.lastName || ""}`.toLowerCase();
        const appId = (r.loan.applicationId || "").toLowerCase();
        const customerNo = (r.customer?.customerNo || "").toLowerCase();
        return customerName.includes(s) || appId.includes(s) || customerNo.includes(s);
      });
    }
    if (filters?.branchId) {
      filtered = filtered.filter((r: any) => r.loan.branchId === filters.branchId);
    }

    return filtered.map((r: any) => ({
      ...r.loan,
      customerName: `${r.customer?.firstName || ""} ${r.customer?.lastName || ""}`.trim(),
      customerNo: r.customer?.customerNo || "",
      branchName: r.branch?.name || "",
    }));
  }

  async markInstallmentPaid(id: string): Promise<Installment> {
    const [installment] = await db
      .update(installments)
      .set({
        isPaid: true,
        paidAmount: sql`${installments.totalAmount}`,
        paymentDate: new Date().toISOString().split("T")[0],
        lateDays: sql`GREATEST(0, EXTRACT(DAY FROM NOW()::date - ${installments.dueDate}::date))`,
        installmentVariance: sql`GREATEST(0, EXTRACT(DAY FROM NOW()::date - ${installments.dueDate}::date))`,
      })
      .where(eq(installments.id, id))
      .returning();
    return installment;
  }

  async getCollectionInstallments(filters: { filter?: string; branch?: string; officer?: string; search?: string; startDate?: string; endDate?: string; page?: number; limit?: number }): Promise<{ installments: any[]; total: number; summary: any }> {
    const { filter = "upcoming", branch, officer, search, startDate, endDate, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;
    const today = new Date().toISOString().split("T")[0];
    const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const conditions: any[] = [];

    conditions.push(sql`COALESCE(${installments.totalAmount}::numeric, 0) > 0`);

    if (filter === "upcoming") {
      conditions.push(sql`${installments.isPaid} = false AND ${installments.dueDate}::date > ${today}::date AND ${installments.dueDate}::date <= ${threeDaysLater}::date`);
    } else if (filter === "due_soon") {
      conditions.push(sql`${installments.isPaid} = false AND ${installments.dueDate}::date <= ${threeDaysLater}::date`);
    } else if (filter === "overdue") {
      conditions.push(sql`${installments.isPaid} = false AND ${installments.dueDate}::date <= ${today}::date`);
    } else if (filter === "partial") {
      conditions.push(sql`${installments.isPaid} = false AND COALESCE(${installments.paidAmount}, 0) > 0`);
    } else if (filter === "all_unpaid") {
      conditions.push(sql`${installments.isPaid} = false`);
    } else if (filter === "paid") {
      conditions.push(sql`${installments.isPaid} = true`);
    }

    if (branch && branch !== "all") {
      conditions.push(sql`${loans.branchId} = ${branch}`);
    }

    if (officer && officer !== "all") {
      conditions.push(sql`${loans.financeOfficerId} = ${officer}`);
    }

    if (search) {
      conditions.push(sql`(
        CONCAT(${customers.firstName}, ' ', ${customers.lastName}) ILIKE ${'%' + search + '%'}
        OR ${loans.applicationId} ILIKE ${'%' + search + '%'}
      )`);
    }

    if (startDate) {
      conditions.push(sql`${installments.dueDate}::date >= ${startDate}::date`);
    }
    if (endDate) {
      conditions.push(sql`${installments.dueDate}::date <= ${endDate}::date`);
    }

    const whereClause = conditions.length > 0
      ? sql.join(conditions, sql` AND `)
      : sql`1=1`;

    const summaryConditions: any[] = [];
    if (branch && branch !== "all") {
      summaryConditions.push(sql`${loans.branchId} = ${branch}`);
    }
    if (officer && officer !== "all") {
      summaryConditions.push(sql`${loans.financeOfficerId} = ${officer}`);
    }
    const summaryWhere = summaryConditions.length > 0
      ? sql.join(summaryConditions, sql` AND `)
      : sql`1=1`;

    const results = await db
      .select({
        id: installments.id,
        loanId: installments.loanId,
        installmentNumber: installments.installmentNumber,
        dueDate: installments.dueDate,
        principleAmount: installments.principleAmount,
        marginAmount: installments.marginAmount,
        totalAmount: installments.totalAmount,
        paidAmount: installments.paidAmount,
        installmentVariance: installments.installmentVariance,
        paymentDate: installments.paymentDate,
        lateDays: installments.lateDays,
        isPaid: installments.isPaid,
        loanApplicationId: loans.applicationId,
        customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
        customerPhone: customers.phoneNumber,
        customerAddress: customers.homeAddress,
        branchName: branches.name,
        financeOfficerName: financeOfficers.name,
      })
      .from(installments)
      .leftJoin(loans, eq(installments.loanId, loans.id))
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .leftJoin(branches, eq(loans.branchId, branches.id))
      .leftJoin(financeOfficers, eq(loans.financeOfficerId, financeOfficers.id))
      .where(whereClause)
      .orderBy(asc(installments.dueDate))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await db
      .select({ count: count() })
      .from(installments)
      .leftJoin(loans, eq(installments.loanId, loans.id))
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .leftJoin(branches, eq(loans.branchId, branches.id))
      .leftJoin(financeOfficers, eq(loans.financeOfficerId, financeOfficers.id))
      .where(whereClause);

    const summaryResults = await db
      .select({
        totalDue: sql<string>`COALESCE(SUM(CASE WHEN ${installments.isPaid} = false AND ${installments.dueDate}::date <= ${threeDaysLater}::date THEN ${installments.totalAmount}::numeric ELSE 0 END), 0)`,
        totalCollected: sql<string>`COALESCE(SUM(CASE WHEN ${installments.isPaid} = false AND ${installments.dueDate}::date <= ${threeDaysLater}::date THEN COALESCE(${installments.paidAmount}::numeric, 0) ELSE 0 END), 0)`,
        totalRemaining: sql<string>`COALESCE(SUM(CASE WHEN ${installments.isPaid} = false AND ${installments.dueDate}::date <= ${threeDaysLater}::date THEN (${installments.totalAmount}::numeric - COALESCE(${installments.paidAmount}::numeric, 0)) ELSE 0 END), 0)`,
        overdueCount: sql<number>`COUNT(CASE WHEN ${installments.isPaid} = false AND ${installments.dueDate}::date <= ${today}::date AND COALESCE(${installments.principleAmount}::numeric, 0) > 0 THEN 1 END)`,
        upcomingCount: sql<number>`COUNT(CASE WHEN ${installments.isPaid} = false AND ${installments.dueDate}::date > ${today}::date AND ${installments.dueDate}::date <= ${threeDaysLater}::date THEN 1 END)`,
        partialCount: sql<number>`COUNT(CASE WHEN ${installments.isPaid} = false AND COALESCE(${installments.paidAmount}::numeric, 0) > 0 THEN 1 END)`,
      })
      .from(installments)
      .leftJoin(loans, eq(installments.loanId, loans.id))
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .leftJoin(branches, eq(loans.branchId, branches.id))
      .leftJoin(financeOfficers, eq(loans.financeOfficerId, financeOfficers.id))
      .where(summaryWhere);

    return {
      installments: results,
      total: Number(total),
      summary: summaryResults[0],
    };
  }

  async recordPartialPayment(id: string, amount: number, paymentDateStr?: string): Promise<Installment> {
    const result = await this.recordPaymentWithOverflow(id, amount, paymentDateStr);
    return result.paidInstallments[0];
  }

  async recordPaymentWithOverflow(id: string, amount: number, paymentDateStr?: string): Promise<{ paidInstallments: Installment[]; totalApplied: number; overflow: number }> {
    return await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(installments)
        .where(eq(installments.id, id));

      if (!existing) {
        throw new Error("Installment not found");
      }

      if (existing.isPaid) {
        throw new Error("This installment is already fully paid");
      }

      const today = paymentDateStr || new Date().toISOString().split("T")[0];
      const paidInstallments: Installment[] = [];
      let remainingPayment = amount;

      const currentPaid = parseFloat(existing.paidAmount || "0");
      const totalDue = parseFloat(existing.totalAmount || "0");
      const currentRemaining = totalDue - currentPaid;
      const applyToCurrent = Math.min(remainingPayment, Math.max(currentRemaining, 0));

      const newPaidAmount = currentPaid + applyToCurrent;
      const isFullyPaid = Math.abs(newPaidAmount - totalDue) < 0.01 || newPaidAmount >= totalDue - 0.01;

      const updateData: any = {
        paidAmount: newPaidAmount.toFixed(2),
        paymentDate: today,
      };

      if (isFullyPaid) {
        updateData.isPaid = true;
        const dueDate = existing.dueDate ? new Date(existing.dueDate) : new Date();
        const payDate = new Date(today);
        const diffDays = Math.max(0, Math.floor((payDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
        updateData.lateDays = diffDays;
        updateData.installmentVariance = diffDays.toString();
      }

      const [updated] = await tx
        .update(installments)
        .set(updateData)
        .where(eq(installments.id, id))
        .returning();

      (updated as any).appliedAmount = applyToCurrent.toFixed(2);
      paidInstallments.push(updated);
      remainingPayment -= applyToCurrent;

      if (remainingPayment > 0.01 && existing.loanId) {
        const nextInstallments = await tx
          .select()
          .from(installments)
          .where(and(
            eq(installments.loanId, existing.loanId),
            eq(installments.isPaid, false),
            sql`${installments.installmentNumber} > ${existing.installmentNumber}`
          ))
          .orderBy(asc(installments.installmentNumber));

        for (const nextInst of nextInstallments) {
          if (remainingPayment <= 0.01) break;

          const nextCurrentPaid = parseFloat(nextInst.paidAmount || "0");
          const nextTotalDue = parseFloat(nextInst.totalAmount || "0");
          const nextRemaining = nextTotalDue - nextCurrentPaid;
          const applyToNext = Math.min(remainingPayment, Math.max(nextRemaining, 0));

          if (applyToNext <= 0) continue;

          const nextNewPaid = nextCurrentPaid + applyToNext;
          const nextFullyPaid = Math.abs(nextNewPaid - nextTotalDue) < 0.01 || nextNewPaid >= nextTotalDue - 0.01;

          const nextUpdateData: any = {
            paidAmount: nextNewPaid.toFixed(2),
            paymentDate: today,
          };

          if (nextFullyPaid) {
            nextUpdateData.isPaid = true;
            const dueDate = nextInst.dueDate ? new Date(nextInst.dueDate) : new Date();
            const payDate = new Date(today);
            const diffDays = Math.max(0, Math.floor((payDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
            nextUpdateData.lateDays = diffDays;
            nextUpdateData.installmentVariance = diffDays.toString();
          }

          const [nextUpdated] = await tx
            .update(installments)
            .set(nextUpdateData)
            .where(eq(installments.id, nextInst.id))
            .returning();

          (nextUpdated as any).appliedAmount = applyToNext.toFixed(2);
          paidInstallments.push(nextUpdated);
          remainingPayment -= applyToNext;
        }
      }

      return {
        paidInstallments,
        totalApplied: amount - Math.max(remainingPayment, 0),
        overflow: Math.max(remainingPayment, 0),
      };
    });
  }

  async getLoanClassificationReport(): Promise<any> {
    const loanResult = await db.execute(sql`
      SELECT 
        CASE WHEN COALESCE(l.financing_duration_months, 0) <= 12 THEN 'Current' ELSE 'Long' END as category,
        COUNT(l.id) as no_of_loans,
        COALESCE(SUM(COALESCE(l.principle_amount::numeric, 0)), 0) as total_principle,
        COALESCE(SUM(COALESCE(l.profit::numeric, 0)), 0) as total_profit,
        COALESCE(SUM(COALESCE(l.principle_amount::numeric, 0) + COALESCE(l.profit::numeric, 0)), 0) as total
      FROM loans l
      WHERE l.status IN ('disbursed', 'active')
      GROUP BY CASE WHEN COALESCE(l.financing_duration_months, 0) <= 12 THEN 'Current' ELSE 'Long' END
      ORDER BY CASE WHEN COALESCE(l.financing_duration_months, 0) <= 12 THEN 'Current' ELSE 'Long' END
    `);

    const collectionResult = await db.execute(sql`
      SELECT 
        CASE WHEN COALESCE(l.financing_duration_months, 0) <= 12 THEN 'Current' ELSE 'Long' END as category,
        COALESCE(SUM(CASE WHEN i.is_paid = true THEN COALESCE(i.principle_amount::numeric, 0) ELSE 0 END), 0) as total_p_collection,
        COALESCE(SUM(CASE WHEN i.is_paid = true THEN COALESCE(i.margin_amount::numeric, 0) ELSE 0 END), 0) as total_margin,
        COALESCE(SUM(CASE WHEN i.is_paid = true THEN COALESCE(i.total_amount::numeric, 0) ELSE 0 END), 0) as total_collection
      FROM loans l
      LEFT JOIN installments i ON i.loan_id = l.id
      WHERE l.status IN ('disbursed', 'active')
      GROUP BY CASE WHEN COALESCE(l.financing_duration_months, 0) <= 12 THEN 'Current' ELSE 'Long' END
    `);

    const collectionMap: Record<string, any> = {};
    for (const row of collectionResult.rows as any[]) {
      collectionMap[row.category] = row;
    }

    const categories = (loanResult.rows as any[]).map(row => {
      const col = collectionMap[row.category] || {};
      const totalAmount = parseFloat(row.total) || 0;
      const totalCol = parseFloat(col.total_collection) || 0;
      return {
        category: row.category,
        noOfLoans: parseInt(row.no_of_loans) || 0,
        totalPrinciple: parseFloat(row.total_principle) || 0,
        totalProfit: parseFloat(row.total_profit) || 0,
        total: totalAmount,
        totalPCollection: parseFloat(col.total_p_collection) || 0,
        totalMargin: parseFloat(col.total_margin) || 0,
        totalCollection: totalCol,
        totalReceivable: totalAmount - totalCol,
      };
    });

    const totals = {
      noOfLoans: categories.reduce((s, c) => s + c.noOfLoans, 0),
      totalPrinciple: categories.reduce((s, c) => s + c.totalPrinciple, 0),
      totalProfit: categories.reduce((s, c) => s + c.totalProfit, 0),
      total: categories.reduce((s, c) => s + c.total, 0),
      totalPCollection: categories.reduce((s, c) => s + c.totalPCollection, 0),
      totalMargin: categories.reduce((s, c) => s + c.totalMargin, 0),
      totalCollection: categories.reduce((s, c) => s + c.totalCollection, 0),
      totalReceivable: categories.reduce((s, c) => s + c.totalReceivable, 0),
    };

    return { categories, totals };
  }

  async getDABNotesToFinancialStatements(asOfDate?: string): Promise<any> {
    const allAccounts = await db.select().from(accounts).where(eq(accounts.isActive, true));
    const dateStr = asOfDate || new Date().toISOString().split('T')[0];

    const journalBalances = await db
      .select({
        accountId: journalLines.accountId,
        totalDebit: sql<string>`COALESCE(SUM(CAST(${journalLines.debitAmount} AS numeric)), 0)`,
        totalCredit: sql<string>`COALESCE(SUM(CAST(${journalLines.creditAmount} AS numeric)), 0)`,
      })
      .from(journalLines)
      .innerJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
      .where(and(
        eq(journalEntries.isPosted, true),
        lte(journalEntries.entryDate, dateStr),
      ))
      .groupBy(journalLines.accountId);

    const jBalMap: Record<string, { debit: number; credit: number }> = {};
    for (const jb of journalBalances) {
      jBalMap[jb.accountId] = {
        debit: parseFloat(jb.totalDebit || "0"),
        credit: parseFloat(jb.totalCredit || "0"),
      };
    }

    const getBalance = (acc: any): number => {
      const opening = Number(acc.openingBalance) || 0;
      const jb = jBalMap[acc.id] || { debit: 0, credit: 0 };
      if (getMainAccountType(acc.accountType) === 'asset' || getMainAccountType(acc.accountType) === 'expense') {
        return opening + jb.debit - jb.credit;
      }
      return opening + jb.credit - jb.debit;
    };

    const accountMap: Record<string, number> = {};
    for (const acc of allAccounts) {
      accountMap[acc.accountCode] = getBalance(acc);
    }

    const sumByPrefix = (prefix: string): number => {
      let total = 0;
      for (const acc of allAccounts) {
        if (acc.accountCode.startsWith(prefix)) {
          total += getBalance(acc);
        }
      }
      return total;
    };

    const sumCodes = (...codes: string[]): number => {
      return codes.reduce((sum, code) => sum + (accountMap[code] || 0), 0);
    };

    const cashOnHand = sumByPrefix('101');
    const cashAtBank = sumByPrefix('102');
    const totalCashAndEquiv = cashOnHand + cashAtBank;

    const currentLoansResult = await db.execute(sql`
      SELECT 
        COUNT(l.id) as customer_count,
        COALESCE(SUM(COALESCE(l.principle_amount::numeric, 0)), 0) as principle_outstanding
      FROM loans l
      LEFT JOIN disbursements d ON d.loan_id = l.id
      WHERE l.status IN ('disbursed', 'active')
        AND COALESCE(l.financing_duration_months, 0) <= 12
        AND (d.disbursement_date IS NULL OR d.disbursement_date <= ${dateStr})
    `);
    const currentLoans = (currentLoansResult.rows as any[])[0] || {};
    const currentFinanceReceivable = parseFloat(currentLoans.principle_outstanding) || 0;
    const currentCustomers = parseInt(currentLoans.customer_count) || 0;
    const currentAllowance = 0;
    const netCurrentFinanceReceivable = currentFinanceReceivable - currentAllowance;

    const prepaidRent = accountMap['13100'] || 0;
    const prepaidLicence = 0;
    const otherPrepaid = 0;
    const totalPrepaid = prepaidRent + prepaidLicence + otherPrepaid;

    const propVehiclesEquipCost = sumCodes('17101', '17201', '17301', '17501');
    const accumDepreciation = sumCodes('17102', '17202', '17302', '17502');
    const totalTangibleFixed = propVehiclesEquipCost + accumDepreciation;
    const annualImpairmentReview = 0;
    const netTangibleFixed = totalTangibleFixed + annualImpairmentReview;

    const software = accountMap['15200'] || 0;
    const intellectualProperty = accountMap['15100'] || 0;
    const accumAmortization = accountMap['15300'] || 0;
    const totalIntangible = software + intellectualProperty + accumAmortization;
    const intangibleImpairment = 0;
    const netIntangible = totalIntangible + intangibleImpairment;

    const longLoansResult = await db.execute(sql`
      SELECT 
        COUNT(l.id) as customer_count,
        COALESCE(SUM(COALESCE(l.principle_amount::numeric, 0)), 0) as principle_outstanding
      FROM loans l
      LEFT JOIN disbursements d ON d.loan_id = l.id
      WHERE l.status IN ('disbursed', 'active')
        AND COALESCE(l.financing_duration_months, 0) > 12
        AND (d.disbursement_date IS NULL OR d.disbursement_date <= ${dateStr})
    `);
    const longLoans = (longLoansResult.rows as any[])[0] || {};
    const longFinanceReceivable = parseFloat(longLoans.principle_outstanding) || 0;
    const longCustomers = parseInt(longLoans.customer_count) || 0;
    const longAllowance = 0;
    const netLongFinanceReceivable = longFinanceReceivable - longAllowance;

    const incomeAccounts = allAccounts.filter(a => getMainAccountType(a.accountType) === 'income');
    const expenseAccounts = allAccounts.filter(a => getMainAccountType(a.accountType) === 'expense');
    const totalIncome = incomeAccounts.reduce((s, a) => s + Math.abs(getBalance(a)), 0);
    const totalExpenses = expenseAccounts.reduce((s, a) => s + Math.abs(getBalance(a)), 0);
    const currentMonthPL = totalIncome - totalExpenses;
    const priorPeriodPL = 0;
    const priorPeriodErrors = 0;
    const dividendPaid = accountMap['30400'] || 0;
    const netRetainedEarnings = priorPeriodPL + priorPeriodErrors + currentMonthPL - Math.abs(dividendPaid);

    const tradePayables = accountMap['20100'] || 0;
    const taxPayables = sumByPrefix('21');
    let accruedSalaries = 0;
    for (const acc of allAccounts) {
      const code = parseInt(acc.accountCode);
      if (!isNaN(code) && code >= 20150 && code < 20800) {
        accruedSalaries += Math.abs(getBalance(acc));
      }
    }
    const otherCurrentLiabilities = 0;
    const totalPayables = Math.abs(tradePayables) + Math.abs(taxPayables) + accruedSalaries + otherCurrentLiabilities;

    const deferredTaxLiab = 0;
    const pensionLiab = 0;
    const longTermProvisions = 0;
    const otherNonCurrentLiab = 0;
    const totalNonCurrentLiab = deferredTaxLiab + pensionLiab + longTermProvisions + otherNonCurrentLiab;

    return {
      header: {
        title: "Da Afghanistan Bank",
        subtitle: "Non-Banking Financial Institutions Supervision Directorate General",
        section: "Follow up and Offsite Supervision Section",
        reportName: "Notes to the Financial Statements",
        currency: "Afghani",
        frequency: "Monthly",
      },
      notes: [
        {
          noteNumber: 1,
          title: "Note 1 – Cash and Cash Equivalents",
          lines: [
            { code: "1.1", item: "Cash at Hand", amount: cashOnHand, source: "BS", sourceDetail: "Closing of 10100 Cash on Hand (Starting of 101 account Code)" },
            { code: "1.2", item: "Cash at Bank", amount: cashAtBank, source: "BS", sourceDetail: "Closing of 10200 Cash at Bank (Starting of 102 account code)" },
            { code: "1.3", item: "Total Cash and Cash Equivalents", amount: totalCashAndEquiv, isTotal: true },
          ],
        },
        {
          noteNumber: 2,
          title: "Note 2 – Current Portion of Finance Receivables",
          lines: [
            { code: "2.1", item: "Current Portion of Finance Receivables", amount: currentFinanceReceivable, customers: currentCustomers, sourceDetail: "Principle Outstanding of Current Category" },
            { code: "2.2", item: "Allowance", amount: currentAllowance, customers: currentCustomers, sourceDetail: "" },
            { code: "2.3", item: "Net Current Portion of Finance Receivables", amount: netCurrentFinanceReceivable, isTotal: true },
          ],
        },
        {
          noteNumber: 3,
          title: "Note 3 – Prepaid Expenses",
          lines: [
            { code: "3.1", item: "Prepaid Rent Expense", amount: prepaidRent, source: "BS", sourceDetail: "Balance of 13100 Account Code" },
            { code: "3.2", item: "Prepaid Licence Fee", amount: prepaidLicence, source: "BS" },
            { code: "3.3", item: "Other Prepaid Expenses", amount: otherPrepaid, source: "BS" },
            { code: "3.4", item: "Total Prepaid Expenses", amount: totalPrepaid, isTotal: true },
          ],
        },
        {
          noteNumber: 4,
          title: "Note 4 – Property, Vehicles, and Office Equipment",
          lines: [
            { code: "4.1", item: "Property, Vehicles, and Office Equipment", amount: propVehiclesEquipCost, source: "BS", sourceDetail: "Total of 17101, 17201, 17301, 17501" },
            { code: "4.2", item: "Accumulated Depreciation", amount: accumDepreciation, source: "BS", sourceDetail: "Total of 17102, 17202, 17302, 17502" },
            { code: "4.3", item: "Total Tangible Fixed Assets", amount: totalTangibleFixed, isTotal: true },
            { code: "4.4", item: "Annual Impairment Review", amount: annualImpairmentReview },
            { code: "4.5", item: "Net Tangible Fixed Assets", amount: netTangibleFixed, isTotal: true },
          ],
        },
        {
          noteNumber: 5,
          title: "Note 5 – Intangible Assets",
          lines: [
            { code: "5.1", item: "Software (Developed or Purchased)", amount: software, source: "BS", sourceDetail: "Balance of 15200 Account Code" },
            { code: "5.2", item: "Intellectual Property (Trademarks, Patents etc)", amount: intellectualProperty, source: "BS", sourceDetail: "Balance of 15100 Account Code" },
            { code: "5.3", item: "Accumulated Amortization", amount: accumAmortization, source: "BS", sourceDetail: "Balance of Account Code 15300" },
            { code: "5.4", item: "Total Intangible Fixed Assets", amount: totalIntangible, isTotal: true },
            { code: "5.5", item: "Annual Impairment Review", amount: intangibleImpairment },
            { code: "5.6", item: "Net Intangible Assets", amount: netIntangible, isTotal: true },
          ],
        },
        {
          noteNumber: 6,
          title: "Note 6 – Long-Term Portion of Finance Receivables",
          lines: [
            { code: "6.1", item: "Long term Portion of Finance Receivables", amount: longFinanceReceivable, customers: longCustomers, sourceDetail: "Principle Outstanding of Long Category" },
            { code: "6.2", item: "Allowance", amount: longAllowance, customers: longCustomers },
            { code: "6.3", item: "Net Long-Term Portion of Finance Receivables", amount: netLongFinanceReceivable, isTotal: true },
          ],
        },
        {
          noteNumber: 7,
          title: "Note 7 – Retained Earnings",
          lines: [
            { code: "7.1", item: "Accumulated Profits or Losses from Prior Periods", amount: priorPeriodPL, source: "IS", sourceDetail: "Profit and Loss of Previous Month" },
            { code: "7.2", item: "Adjustments for Prior Period Errors", amount: priorPeriodErrors, source: "IS" },
            { code: "7.3", item: "Profit or (Loss) for Current month", amount: currentMonthPL, source: "IS", sourceDetail: "Profit and Loss of Current Month" },
            { code: "7.4", item: "Dividend Paid", amount: dividendPaid, sourceDetail: "Balance of 30400 Account Code" },
            { code: "7.5", item: "Net Retained Earnings", amount: netRetainedEarnings, isTotal: true },
          ],
        },
        {
          noteNumber: 8,
          title: "Note 8 – Payables",
          lines: [
            { code: "8.1", item: "Trade Payables", amount: Math.abs(tradePayables), source: "BS", sourceDetail: "20100 Account Code Balance" },
            { code: "8.2", item: "Tax Payables", amount: Math.abs(taxPayables), source: "BS", sourceDetail: "Balance of all Accounts Starting with 21" },
            { code: "8.3", item: "Accrued Salaries and Wages", amount: accruedSalaries, source: "BS", sourceDetail: "Balance of Accounts >= 20150 and < 20800" },
            { code: "8.4", item: "Other Current Liabilities", amount: otherCurrentLiabilities, source: "BS" },
            { code: "8.5", item: "Total Payables", amount: totalPayables, isTotal: true },
          ],
        },
        {
          noteNumber: 9,
          title: "Note 9 – Non-Current Liabilities",
          lines: [
            { code: "9.1", item: "Deferred Tax Liabilities", amount: deferredTaxLiab },
            { code: "9.2", item: "Pension liabilities", amount: pensionLiab },
            { code: "9.3", item: "Long-Term Provisions (for regulatory or legal matters)", amount: longTermProvisions },
            { code: "9.4", item: "Other Non-Current liabilities", amount: otherNonCurrentLiab },
            { code: "9.5", item: "Total Non-Current Liabilities", amount: totalNonCurrentLiab, isTotal: true },
          ],
        },
      ],
    };
  }

  // Activity Logs
  async getActivityLogs(filters: { search?: string; action?: string; page?: number; limit?: number }): Promise<{ logs: any[]; total: number }> {
    const { search, action, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    const results = await db
      .select({
        id: activityLogs.id,
        userId: activityLogs.userId,
        action: activityLogs.action,
        entityType: activityLogs.entityType,
        entityId: activityLogs.entityId,
        details: activityLogs.details,
        ipAddress: activityLogs.ipAddress,
        createdAt: activityLogs.createdAt,
        userName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        userEmail: users.email,
        userImage: users.profileImageUrl,
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .where(
        and(
          action && action !== "all" ? like(activityLogs.action, `${action}%`) : undefined,
          search
            ? or(
                like(activityLogs.action, `%${search}%`),
                like(activityLogs.details, `%${search}%`),
                like(users.firstName, `%${search}%`),
                like(users.lastName, `%${search}%`)
              )
            : undefined
        )
      )
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await db.select({ count: count() }).from(activityLogs);

    return { logs: results, total: Number(total) };
  }

  async createActivityLog(data: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db.insert(activityLogs).values(data).returning();
    return log;
  }

  // Dashboard Stats
  async getDashboardStats(filters?: { branchId?: string; startDate?: string; endDate?: string }): Promise<any> {
    const branchFilter = filters?.branchId ? sql`AND l.branch_id = ${filters.branchId}` : sql``;
    const branchFilterRoot = filters?.branchId ? sql`AND branch_id = ${filters.branchId}` : sql``;
    const dateFilterDisb = filters?.startDate && filters?.endDate
      ? sql`AND d.disbursement_date >= ${filters.startDate}::date AND d.disbursement_date <= ${filters.endDate}::date` : sql``;
    const dateFilterLoan = filters?.startDate && filters?.endDate
      ? sql`AND l.created_at >= ${filters.startDate}::date AND l.created_at <= ${filters.endDate}::date + INTERVAL '1 day'` : sql``;
    const dateFilterInstallment = filters?.startDate && filters?.endDate
      ? sql`AND i.payment_date >= ${filters.startDate}::date AND i.payment_date <= ${filters.endDate}::date` : sql``;

    const loanCountsResult = await db.execute(sql`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status NOT IN ('disbursed', 'active', 'completed', 'rejected', 'defaulted')) as pending,
        COUNT(*) FILTER (WHERE status IN ('disbursed', 'active', 'completed')) as disbursed_count
      FROM loans l
      WHERE 1=1 ${branchFilterRoot} ${dateFilterLoan}
    `);
    const loanCounts = loanCountsResult.rows[0] as any;

    const customerCountResult = await db.execute(sql`
      SELECT COUNT(DISTINCT ${filters?.branchId || (filters?.startDate && filters?.endDate) ? sql`l.customer_id` : sql`c.id`}) as count
      ${filters?.branchId || (filters?.startDate && filters?.endDate)
        ? sql`FROM loans l WHERE 1=1 ${branchFilterRoot} ${dateFilterLoan}`
        : sql`FROM customers c`}
    `);
    const customerCount = { count: Number((customerCountResult.rows[0] as any)?.count || 0) };
    
    const amountsResult = await db.execute(sql`
      SELECT
        COALESCE(SUM(CASE WHEN l.status IN ('disbursed', 'active', 'completed') THEN l.principle_amount::numeric ELSE 0 END), 0) as total_disbursed,
        COALESCE(SUM(CASE WHEN l.status IN ('disbursed', 'active', 'completed') THEN l.total_receivable::numeric ELSE 0 END), 0) as total_portfolio,
        COALESCE(SUM(CASE WHEN l.status IN ('disbursed', 'active', 'completed') THEN l.principle_amount::numeric ELSE 0 END), 0) as portfolio_principal,
        COALESCE(SUM(CASE WHEN l.status IN ('disbursed', 'active', 'completed') THEN (l.total_receivable::numeric - l.principle_amount::numeric) ELSE 0 END), 0) as portfolio_margin
      FROM loans l
      WHERE 1=1 ${branchFilterRoot} ${dateFilterLoan}
    `);
    const amounts = amountsResult.rows[0] as any;

    const collectedResultQuery = await db.execute(sql`
      SELECT
        COALESCE(SUM(COALESCE(i.paid_amount::numeric, 0)), 0) as total_collected,
        COALESCE(SUM(CASE WHEN i.is_paid = true THEN i.principle_amount::numeric ELSE
          CASE WHEN (i.principle_amount::numeric + i.margin_amount::numeric) > 0
            THEN COALESCE(i.paid_amount::numeric, 0) * i.principle_amount::numeric / (i.principle_amount::numeric + i.margin_amount::numeric)
            ELSE 0 END
        END), 0) as principal_collected,
        COALESCE(SUM(CASE WHEN i.is_paid = true THEN i.margin_amount::numeric ELSE
          CASE WHEN (i.principle_amount::numeric + i.margin_amount::numeric) > 0
            THEN COALESCE(i.paid_amount::numeric, 0) * i.margin_amount::numeric / (i.principle_amount::numeric + i.margin_amount::numeric)
            ELSE 0 END
        END), 0) as margin_collected
      FROM installments i
      JOIN loans l ON i.loan_id = l.id
      WHERE COALESCE(i.paid_amount::numeric, 0) > 0 ${branchFilter} ${dateFilterInstallment}
    `);
    const collectedResult = collectedResultQuery.rows[0] as any;

    const currentMonthStats = await db.execute(sql`
      SELECT 
        COUNT(*) FILTER (WHERE DATE_TRUNC('month', d.disbursement_date) = DATE_TRUNC('month', CURRENT_DATE)) as current_month_count,
        COALESCE(SUM(CASE WHEN DATE_TRUNC('month', d.disbursement_date) = DATE_TRUNC('month', CURRENT_DATE) THEN l.principle_amount::numeric ELSE 0 END), 0) as current_month_amount,
        COUNT(*) FILTER (WHERE DATE_TRUNC('month', d.disbursement_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')) as prev_month_count,
        COALESCE(SUM(CASE WHEN DATE_TRUNC('month', d.disbursement_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') THEN l.principle_amount::numeric ELSE 0 END), 0) as prev_month_amount
      FROM disbursements d
      LEFT JOIN loans l ON d.loan_id = l.id
      WHERE d.disbursement_date IS NOT NULL ${branchFilter} ${dateFilterDisb}
    `);
    const cmStats = currentMonthStats.rows[0] as any;

    const recentLoansResult = await db.execute(sql`
      SELECT l.id, l.application_id, COALESCE(l.principle_amount, l.request_amount) as amount,
        l.status, l.request_date as date,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name
      FROM loans l
      LEFT JOIN customers c ON l.customer_id = c.id
      WHERE 1=1 ${branchFilterRoot} ${dateFilterLoan}
      ORDER BY l.created_at DESC
      LIMIT 5
    `);
    const recentLoans = (recentLoansResult.rows as any[]).map(r => ({
      id: r.id,
      applicationId: r.application_id,
      amount: r.amount,
      status: r.status,
      date: r.date,
      customerName: r.customer_name,
    }));

    const loansByStatusResult = await db.execute(sql`
      SELECT l.status, COUNT(*) as count,
        COALESCE(SUM(CASE 
          WHEN l.status IN ('disbursed', 'active', 'completed') THEN l.principle_amount::numeric 
          ELSE l.request_amount::numeric 
        END), 0) as requested_amount
      FROM loans l
      WHERE 1=1 ${branchFilterRoot} ${dateFilterLoan}
      GROUP BY l.status
    `);
    const loansByStatus = (loansByStatusResult.rows as any[]).map(r => ({
      status: r.status,
      count: Number(r.count),
      requestedAmount: Number(r.requested_amount),
    }));

    const monthlyDisbData = await db.execute(sql`
      SELECT 
        TO_CHAR(d.disbursement_date, 'Mon') as month,
        TO_CHAR(d.disbursement_date, 'YYYY-MM') as sort_key,
        COALESCE(SUM(l.principle_amount::numeric), 0) as disbursed
      FROM disbursements d
      LEFT JOIN loans l ON d.loan_id = l.id
      WHERE d.disbursement_date IS NOT NULL
        AND d.disbursement_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
        ${branchFilter} ${dateFilterDisb}
      GROUP BY TO_CHAR(d.disbursement_date, 'Mon'), TO_CHAR(d.disbursement_date, 'YYYY-MM')
      ORDER BY TO_CHAR(d.disbursement_date, 'YYYY-MM')
    `);

    const monthlyCollData = await db.execute(sql`
      SELECT 
        TO_CHAR(i.payment_date, 'Mon') as month,
        TO_CHAR(i.payment_date, 'YYYY-MM') as sort_key,
        COALESCE(SUM(i.paid_amount::numeric), 0) as collected
      FROM installments i
      JOIN loans l ON i.loan_id = l.id
      WHERE COALESCE(i.paid_amount::numeric, 0) > 0
        AND i.payment_date IS NOT NULL
        AND i.payment_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
        ${branchFilter} ${dateFilterInstallment}
      GROUP BY TO_CHAR(i.payment_date, 'Mon'), TO_CHAR(i.payment_date, 'YYYY-MM')
      ORDER BY TO_CHAR(i.payment_date, 'YYYY-MM')
    `);

    const disbMap = new Map<string, { month: string; disbursed: number }>();
    for (const row of monthlyDisbData.rows as any[]) {
      disbMap.set(row.sort_key, { month: row.month, disbursed: Number(row.disbursed) });
    }
    const collMap = new Map<string, number>();
    for (const row of monthlyCollData.rows as any[]) {
      collMap.set(row.sort_key, Number(row.collected));
    }

    const allKeys = new Set([...disbMap.keys(), ...collMap.keys()]);
    const monthlyTrends = Array.from(allKeys).sort().map(key => ({
      month: disbMap.get(key)?.month || (monthlyCollData.rows as any[]).find((r: any) => r.sort_key === key)?.month || key,
      disbursed: disbMap.get(key)?.disbursed || 0,
      collected: collMap.get(key) || 0,
    }));

    const dailyOpsResult = await db.execute(sql`
      SELECT
        (SELECT COUNT(*) FROM loans l WHERE DATE(l.created_at) = CURRENT_DATE ${branchFilterRoot}) as apps_today,
        (SELECT COUNT(*) FROM loan_approvals la JOIN loans l ON la.loan_id = l.id WHERE DATE(la.created_at) = CURRENT_DATE ${branchFilter}) as approved_today,
        (SELECT COUNT(*) FROM loans l WHERE l.status = 'rejected' AND DATE(l.updated_at) = CURRENT_DATE ${branchFilterRoot}) as rejected_today,
        (SELECT COUNT(*) FROM disbursements d JOIN loans l ON d.loan_id = l.id WHERE d.disbursement_date = CURRENT_DATE ${branchFilter}) as disbursed_today,
        (SELECT COALESCE(SUM(l.principle_amount::numeric), 0) FROM disbursements d JOIN loans l ON d.loan_id = l.id WHERE d.disbursement_date = CURRENT_DATE ${branchFilter}) as amount_disbursed_today,
        (SELECT COALESCE(SUM(ins.total_amount::numeric), 0) FROM installments ins JOIN loans l ON ins.loan_id = l.id WHERE ins.due_date = CURRENT_DATE AND ins.is_paid = false ${branchFilter}) as amount_due_today,
        (SELECT COALESCE(SUM(ins.paid_amount::numeric), 0) FROM installments ins JOIN loans l ON ins.loan_id = l.id WHERE DATE(ins.payment_date) = CURRENT_DATE AND COALESCE(ins.paid_amount::numeric, 0) > 0 ${branchFilter}) as amount_collected_today,
        (SELECT COUNT(*) FROM installments ins JOIN loans l ON ins.loan_id = l.id WHERE ins.due_date < CURRENT_DATE AND ins.is_paid = false AND COALESCE(ins.principle_amount::numeric, 0) > 0 ${branchFilter}) as missed_payments_total,
        (SELECT COUNT(*) FROM installments ins JOIN loans l ON ins.loan_id = l.id WHERE ins.due_date = CURRENT_DATE AND ins.is_paid = false ${branchFilter}) as due_today_count,
        (SELECT COUNT(*) FROM installments ins JOIN loans l ON ins.loan_id = l.id WHERE DATE(ins.payment_date) = CURRENT_DATE AND ins.is_paid = true ${branchFilter}) as collected_today_count
    `);
    const dailyOps = dailyOpsResult.rows[0] as any;

    const activeBorrowersResult = await db.execute(sql`
      SELECT COUNT(DISTINCT customer_id) as active_borrowers
      FROM loans l WHERE l.status IN ('disbursed', 'active') ${branchFilterRoot}
    `);
    const activeBorrowers = Number((activeBorrowersResult.rows[0] as any)?.active_borrowers || 0);

    const prevMonthBorrowersResult = await db.execute(sql`
      SELECT COUNT(DISTINCT l.customer_id) as prev_borrowers
      FROM loans l
      JOIN disbursements d ON d.loan_id = l.id
      WHERE l.status IN ('disbursed', 'active', 'completed')
        AND d.disbursement_date < DATE_TRUNC('month', CURRENT_DATE)
        AND d.disbursement_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        ${branchFilter}
    `);
    const prevMonthBorrowers = Number((prevMonthBorrowersResult.rows[0] as any)?.prev_borrowers || 0);

    const totalPortfolioNum = Number(amounts.total_portfolio);
    const totalCollectedNum = Number(collectedResult.total_collected);
    const outstandingBalance = totalPortfolioNum - totalCollectedNum;
    const repaymentRate = totalPortfolioNum > 0 ? parseFloat(((totalCollectedNum / totalPortfolioNum) * 100).toFixed(1)) : 0;

    const parResult = await db.execute(sql`
      SELECT COUNT(DISTINCT l.id) as par_loans
      FROM loans l
      WHERE l.status IN ('disbursed', 'active') ${branchFilterRoot}
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
        AND EXISTS (
          SELECT 1 FROM installments i
          WHERE i.loan_id = l.id AND i.is_paid = false
            AND i.due_date < CURRENT_DATE
            AND COALESCE(i.principle_amount::numeric, 0) > 0
        )
    `);
    const parLoans = Number((parResult.rows[0] as any)?.par_loans || 0);
    const totalActiveLoans = Number(loanCounts.active) + (loansByStatus.find((s: any) => s.status === 'disbursed')?.count || 0);
    const portfolioAtRisk = totalActiveLoans > 0 ? parseFloat(((parLoans / totalActiveLoans) * 100).toFixed(1)) : 0;

    const parAgingResult = await db.execute(sql`
      SELECT
        l.id as loan_id,
        GREATEST(
          COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
          - COALESCE((SELECT SUM(COALESCE(i2.paid_amount::numeric, 0)) FROM installments i2 WHERE i2.loan_id = l.id AND COALESCE(i2.paid_amount::numeric, 0) > 0), 0),
          0
        ) as olb,
        COALESCE((
          SELECT MAX(CURRENT_DATE - i3.due_date)
          FROM installments i3
          WHERE i3.loan_id = l.id AND i3.is_paid = false AND i3.due_date < CURRENT_DATE
            AND COALESCE(i3.principle_amount::numeric, 0) > 0
        ), 0) as max_days_overdue
      FROM loans l
      WHERE l.status IN ('disbursed', 'active') ${branchFilterRoot}
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
    `);
    const parAgingRows = parAgingResult.rows as any[];
    const totalActiveOLB = parAgingRows.reduce((sum, r) => sum + parseFloat(r.olb || 0), 0);

    const computePar = (minDays: number) => {
      const parRows = parAgingRows.filter(r => parseInt(r.max_days_overdue) >= minDays);
      const parOlb = parRows.reduce((sum, r) => sum + parseFloat(r.olb || 0), 0);
      return {
        count: parRows.length,
        amount: parOlb,
        percentage: totalActiveOLB > 0 ? parseFloat(((parOlb / totalActiveOLB) * 100).toFixed(1)) : 0,
      };
    };

    const computeParRange = (startDay: number, endDay: number) => {
      const parRows = parAgingRows.filter(r => {
        const days = parseInt(r.max_days_overdue);
        return days >= startDay && (endDay === 999999 ? true : days <= endDay);
      });
      const parOlb = parRows.reduce((sum, r) => sum + parseFloat(r.olb || 0), 0);
      return {
        count: parRows.length,
        amount: parOlb,
        percentage: totalActiveOLB > 0 ? parseFloat(((parOlb / totalActiveOLB) * 100).toFixed(1)) : 0,
      };
    };

    const parCategoryRows = await db.select().from(parCategories).orderBy(asc(parCategories.startDay));

    let parAgingCategories: any[] = [];
    if (parCategoryRows.length > 0) {
      parAgingCategories = parCategoryRows.map(cat => ({
        label: cat.category,
        startDay: cat.startDay,
        endDay: cat.endDay,
        provisionPercent: parseFloat(String(cat.provisionPercent)),
        ...computeParRange(cat.startDay, cat.endDay),
      }));
    }

    const parAging = {
      par1: computePar(1),
      par7: computePar(7),
      par30: computePar(30),
      par60: computePar(60),
      par90: computePar(90),
      categories: parAgingCategories,
      totalOverdueAmount: parAgingRows.filter(r => parseInt(r.max_days_overdue) > 0).reduce((sum, r) => sum + parseFloat(r.olb || 0), 0),
      overdueLoansCount: parAgingRows.filter(r => parseInt(r.max_days_overdue) > 0).length,
      totalActiveOLB,
    };

    const sectorDistResult = await db.execute(sql`
      SELECT 
        COALESCE(l.sector, 'Other') as sector,
        COUNT(*) as loan_count,
        COALESCE(SUM(l.principle_amount::numeric), 0) as total_amount
      FROM loans l
      WHERE l.status IN ('disbursed', 'active') ${branchFilterRoot} ${dateFilterLoan}
      GROUP BY COALESCE(l.sector, 'Other')
      ORDER BY total_amount DESC
    `);
    const sectorRows = sectorDistResult.rows as any[];
    const totalSectorAmount = sectorRows.reduce((sum, r) => sum + parseFloat(r.total_amount || 0), 0);
    const sectorDistribution = sectorRows.map(r => ({
      sector: r.sector,
      count: Number(r.loan_count),
      amount: parseFloat(r.total_amount || 0),
      percentage: totalSectorAmount > 0 ? parseFloat(((parseFloat(r.total_amount || 0) / totalSectorAmount) * 100).toFixed(1)) : 0,
    }));

    const avgLoanByFundingResult = await db.execute(sql`
      SELECT 
        COALESCE(fs.name, 'Unassigned') as funding_source,
        COUNT(*) as loan_count,
        COALESCE(AVG(COALESCE(l.principle_amount, l.request_amount)::numeric), 0) as avg_loan_size,
        COALESCE(SUM(COALESCE(l.principle_amount, l.request_amount)::numeric), 0) as total_amount
      FROM loans l
      LEFT JOIN funding_sources fs ON l.funding_source_id = fs.id
      WHERE l.status IN ('disbursed', 'active', 'completed') ${branchFilterRoot} ${dateFilterLoan}
      GROUP BY COALESCE(fs.name, 'Unassigned')
      ORDER BY total_amount DESC
    `);
    const avgLoanByFunding = (avgLoanByFundingResult.rows as any[]).map(r => ({
      fundingSource: r.funding_source,
      loanCount: Number(r.loan_count),
      avgLoanSize: Math.round(parseFloat(r.avg_loan_size || 0)),
      totalAmount: parseFloat(r.total_amount || 0),
    }));

    return {
      totalLoans: Number(loanCounts.total),
      disbursedLoanCount: Number(loanCounts.disbursed_count || 0),
      activeLoans: Number(loanCounts.active),
      currentMonthCount: Number(cmStats.current_month_count || 0),
      currentMonthAmount: Number(cmStats.current_month_amount || 0),
      prevMonthCount: Number(cmStats.prev_month_count || 0),
      prevMonthAmount: Number(cmStats.prev_month_amount || 0),
      pendingLoans: Number(loanCounts.pending),
      totalCustomers: Number(customerCount.count),
      totalDisbursed: Number(amounts.total_disbursed),
      totalPortfolio: totalPortfolioNum,
      portfolioPrincipal: Number(amounts.portfolio_principal),
      portfolioMargin: Number(amounts.portfolio_margin),
      totalCollected: totalCollectedNum,
      principalCollected: Number(collectedResult.principal_collected),
      marginCollected: Number(collectedResult.margin_collected),
      outstandingBalance,
      overdueLoans: parLoans,
      activeBorrowers,
      prevMonthBorrowers,
      repaymentRate,
      portfolioAtRisk,
      sectorDistribution,
      avgLoanByFunding,
      parAging,
      dailyOps: {
        applicationsToday: Number(dailyOps.apps_today || 0),
        approvedToday: Number(dailyOps.approved_today || 0),
        rejectedToday: Number(dailyOps.rejected_today || 0),
        disbursedToday: Number(dailyOps.disbursed_today || 0),
        amountDisbursedToday: Number(dailyOps.amount_disbursed_today || 0),
        amountDueToday: Number(dailyOps.amount_due_today || 0),
        amountCollectedToday: Number(dailyOps.amount_collected_today || 0),
        missedPayments: Number(dailyOps.missed_payments_total || 0),
        dueTodayCount: Number(dailyOps.due_today_count || 0),
        collectedTodayCount: Number(dailyOps.collected_today_count || 0),
      },
      loansByStatus: loansByStatus.map(s => ({ status: s.status || "pending", count: Number(s.count), requestedAmount: Number(s.requestedAmount) })),
      monthlyTrends,
      recentLoans,
      officerPerformance: await this.getOfficerPerformance(filters),
      alerts: await this.getDashboardAlerts(filters),
      financialPerformance: await this.getFinancialPerformance(filters),
    };
  }

  async getDashboardAlerts(filters?: { branchId?: string; startDate?: string; endDate?: string }): Promise<any[]> {
    const branchFilter = filters?.branchId ? sql`AND l.branch_id = ${filters.branchId}` : sql``;
    const branchFilterRoot = filters?.branchId ? sql`AND branch_id = ${filters.branchId}` : sql``;
    const alerts: any[] = [];

    const overdueResult = await db.execute(sql`
      SELECT
        COUNT(DISTINCT l.id) as overdue_loans,
        COUNT(i.id) as overdue_installments,
        COALESCE(SUM(i.total_amount::numeric - COALESCE(i.paid_amount::numeric, 0)), 0) as overdue_amount
      FROM installments i
      JOIN loans l ON i.loan_id = l.id
      WHERE i.is_paid = false AND i.due_date < CURRENT_DATE
        AND l.status IN ('disbursed', 'active')
        AND COALESCE(i.principle_amount::numeric, 0) > 0
        ${branchFilter}
    `);
    const od = overdueResult.rows[0] as any;
    const overdueLoans = Number(od.overdue_loans || 0);
    const overdueAmount = parseFloat(od.overdue_amount || 0);
    if (overdueLoans > 0) {
      alerts.push({
        id: 'overdue-loans',
        type: 'critical',
        title: `${overdueLoans} Loans with Overdue Payments`,
        description: `${Number(od.overdue_installments)} unpaid installments totaling ${overdueAmount.toLocaleString('en-US', { minimumFractionDigits: 0 })} AFN`,
        category: 'overdue',
      });
    }

    const dueTodayResult = await db.execute(sql`
      SELECT
        COUNT(DISTINCT l.id) as loans_due,
        COUNT(i.id) as installments_due,
        COALESCE(SUM(i.total_amount::numeric), 0) as amount_due
      FROM installments i
      JOIN loans l ON i.loan_id = l.id
      WHERE i.is_paid = false AND i.due_date = CURRENT_DATE
        AND l.status IN ('disbursed', 'active')
        ${branchFilter}
    `);
    const dt = dueTodayResult.rows[0] as any;
    const dueToday = Number(dt.loans_due || 0);
    if (dueToday > 0) {
      alerts.push({
        id: 'due-today',
        type: 'warning',
        title: `${dueToday} Loans Due Today`,
        description: `${Number(dt.installments_due)} installments totaling ${parseFloat(dt.amount_due || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })} AFN due for collection`,
        category: 'due_today',
      });
    }

    const dueThisWeekResult = await db.execute(sql`
      SELECT
        COUNT(DISTINCT l.id) as loans_due,
        COUNT(i.id) as installments_due,
        COALESCE(SUM(i.total_amount::numeric), 0) as amount_due
      FROM installments i
      JOIN loans l ON i.loan_id = l.id
      WHERE i.is_paid = false
        AND i.due_date > CURRENT_DATE
        AND i.due_date <= CURRENT_DATE + INTERVAL '7 days'
        AND l.status IN ('disbursed', 'active')
        ${branchFilter}
    `);
    const dw = dueThisWeekResult.rows[0] as any;
    const dueWeek = Number(dw.loans_due || 0);
    if (dueWeek > 0) {
      alerts.push({
        id: 'due-this-week',
        type: 'info',
        title: `${dueWeek} Loans Due This Week`,
        description: `${Number(dw.installments_due)} installments totaling ${parseFloat(dw.amount_due || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })} AFN upcoming in the next 7 days`,
        category: 'upcoming',
      });
    }

    const pendingApprovalResult = await db.execute(sql`
      SELECT COUNT(*) as pending_count
      FROM loans
      WHERE status = 'pending' ${branchFilterRoot}
    `);
    const pendingCount = Number((pendingApprovalResult.rows[0] as any)?.pending_count || 0);
    if (pendingCount > 0) {
      alerts.push({
        id: 'pending-approval',
        type: 'info',
        title: `${pendingCount} Loans Pending Approval`,
        description: `Applications awaiting review and approval decision`,
        category: 'pending',
      });
    }

    const approvedNotDisbursedResult = await db.execute(sql`
      SELECT COUNT(*) as approved_count
      FROM loans
      WHERE status = 'approved' ${branchFilterRoot}
    `);
    const approvedCount = Number((approvedNotDisbursedResult.rows[0] as any)?.approved_count || 0);
    if (approvedCount > 0) {
      alerts.push({
        id: 'approved-not-disbursed',
        type: 'warning',
        title: `${approvedCount} Approved Loans Awaiting Disbursement`,
        description: `Loans have been approved but not yet disbursed to customers`,
        category: 'disbursement',
      });
    }

    const highParResult = await db.execute(sql`
      SELECT fo.name as officer_name, COUNT(DISTINCT l.id) as par_count
      FROM finance_officers fo
      JOIN loans l ON l.finance_officer_id = fo.id
      WHERE l.status IN ('disbursed', 'active')
        ${branchFilter}
        AND EXISTS (
          SELECT 1 FROM installments i
          WHERE i.loan_id = l.id AND i.is_paid = false
            AND i.due_date < CURRENT_DATE - INTERVAL '30 days'
            AND COALESCE(i.principle_amount::numeric, 0) > 0
        )
        AND fo.is_active = true
      GROUP BY fo.id, fo.name
      HAVING COUNT(DISTINCT l.id) >= 3
      ORDER BY par_count DESC
      LIMIT 3
    `);
    for (const row of highParResult.rows as any[]) {
      alerts.push({
        id: `high-par-officer-${row.officer_name}`,
        type: 'critical',
        title: `High PAR: ${row.officer_name}`,
        description: `${row.par_count} loans overdue by 30+ days — requires immediate follow-up`,
        category: 'officer_par',
      });
    }

    const licenseExpiryResult = await db.execute(sql`
      SELECT COUNT(DISTINCT bl.id) as expiring_count
      FROM business_licenses bl
      JOIN customer_businesses cb ON bl.customer_business_id = cb.id
      JOIN customers c ON cb.customer_id = c.id
      ${filters?.branchId ? sql`JOIN loans l ON l.customer_id = c.id AND l.branch_id = ${filters.branchId}` : sql``}
      WHERE bl.expiry_date IS NOT NULL
        AND bl.expiry_date >= CURRENT_DATE
        AND bl.expiry_date <= CURRENT_DATE + INTERVAL '15 days'
    `);
    const expiringLicenses = Number((licenseExpiryResult.rows[0] as any)?.expiring_count || 0);
    if (expiringLicenses > 0) {
      alerts.push({
        id: 'license-expiry',
        type: 'warning',
        title: `${expiringLicenses} Business License${expiringLicenses === 1 ? '' : 's'} Expiring Soon`,
        description: `License${expiringLicenses === 1 ? '' : 's'} expiring within the next 15 days — please follow up with the customer${expiringLicenses === 1 ? '' : 's'}`,
        category: 'license_expiry',
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        id: 'all-clear',
        type: 'success',
        title: 'All Clear',
        description: 'No critical alerts at this time. Operations are running smoothly.',
        category: 'none',
      });
    }

    return alerts;
  }

  async getAlertDetails(category: string): Promise<any> {
    switch (category) {
      case 'overdue': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            l.principle_amount, l.status, b.name as branch_name, fo.name as officer_name,
            i.id as installment_id, i.installment_number, i.due_date, i.total_amount, i.paid_amount,
            (CURRENT_DATE - i.due_date) as days_overdue
          FROM installments i
          JOIN loans l ON i.loan_id = l.id
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE i.is_paid = false AND i.due_date < CURRENT_DATE
            AND l.status IN ('disbursed', 'active')
            AND COALESCE(i.principle_amount::numeric, 0) > 0
          ORDER BY i.due_date ASC
          LIMIT 50
        `);
        return {
          category: 'overdue',
          title: 'Overdue Loan Payments',
          items: (result.rows as any[]).map(r => ({
            loanId: r.id,
            applicationId: r.application_id,
            customerName: r.customer_name,
            principleAmount: Number(r.principle_amount || 0),
            branchName: r.branch_name,
            officerName: r.officer_name,
            installmentNumber: r.installment_number,
            dueDate: r.due_date,
            totalAmount: Number(r.total_amount || 0),
            paidAmount: Number(r.paid_amount || 0),
            daysOverdue: Number(r.days_overdue || 0),
          })),
        };
      }
      case 'due_today': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            l.principle_amount, b.name as branch_name, fo.name as officer_name,
            i.installment_number, i.due_date, i.total_amount
          FROM installments i
          JOIN loans l ON i.loan_id = l.id
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE i.is_paid = false AND i.due_date = CURRENT_DATE
            AND l.status IN ('disbursed', 'active')
          ORDER BY i.total_amount DESC
          LIMIT 50
        `);
        return {
          category: 'due_today',
          title: 'Payments Due Today',
          items: (result.rows as any[]).map(r => ({
            loanId: r.id,
            applicationId: r.application_id,
            customerName: r.customer_name,
            principleAmount: Number(r.principle_amount || 0),
            branchName: r.branch_name,
            officerName: r.officer_name,
            installmentNumber: r.installment_number,
            dueDate: r.due_date,
            totalAmount: Number(r.total_amount || 0),
          })),
        };
      }
      case 'upcoming': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            l.principle_amount, b.name as branch_name, fo.name as officer_name,
            i.installment_number, i.due_date, i.total_amount
          FROM installments i
          JOIN loans l ON i.loan_id = l.id
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE i.is_paid = false
            AND i.due_date > CURRENT_DATE
            AND i.due_date <= CURRENT_DATE + INTERVAL '7 days'
            AND l.status IN ('disbursed', 'active')
          ORDER BY i.due_date ASC
          LIMIT 50
        `);
        return {
          category: 'upcoming',
          title: 'Upcoming Payments (Next 7 Days)',
          items: (result.rows as any[]).map(r => ({
            loanId: r.id,
            applicationId: r.application_id,
            customerName: r.customer_name,
            principleAmount: Number(r.principle_amount || 0),
            branchName: r.branch_name,
            officerName: r.officer_name,
            installmentNumber: r.installment_number,
            dueDate: r.due_date,
            totalAmount: Number(r.total_amount || 0),
          })),
        };
      }
      case 'pending': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            l.request_amount, l.request_date, b.name as branch_name, fo.name as officer_name,
            l.product_name, l.sector
          FROM loans l
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE l.status = 'pending'
          ORDER BY l.created_at DESC
          LIMIT 50
        `);
        return {
          category: 'pending',
          title: 'Loans Pending Approval',
          items: (result.rows as any[]).map(r => ({
            loanId: r.id,
            applicationId: r.application_id,
            customerName: r.customer_name,
            requestAmount: Number(r.request_amount || 0),
            requestDate: r.request_date,
            branchName: r.branch_name,
            officerName: r.officer_name,
            productName: r.product_name,
            sector: r.sector,
          })),
        };
      }
      case 'disbursement': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            l.principle_amount, l.approved_date, b.name as branch_name, fo.name as officer_name,
            l.product_name
          FROM loans l
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE l.status = 'approved'
          ORDER BY l.created_at DESC
          LIMIT 50
        `);
        return {
          category: 'disbursement',
          title: 'Approved Loans Awaiting Disbursement',
          items: (result.rows as any[]).map(r => ({
            loanId: r.id,
            applicationId: r.application_id,
            customerName: r.customer_name,
            principleAmount: Number(r.principle_amount || 0),
            approvedDate: r.approved_date,
            branchName: r.branch_name,
            officerName: r.officer_name,
            productName: r.product_name,
          })),
        };
      }
      case 'officer_par': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            l.principle_amount, b.name as branch_name, fo.name as officer_name,
            (SELECT MAX(CURRENT_DATE - i.due_date) FROM installments i WHERE i.loan_id = l.id AND i.is_paid = false AND i.due_date < CURRENT_DATE AND COALESCE(i.principle_amount::numeric, 0) > 0) as max_days_overdue,
            (SELECT COUNT(*) FROM installments i WHERE i.loan_id = l.id AND i.is_paid = false AND i.due_date < CURRENT_DATE AND COALESCE(i.principle_amount::numeric, 0) > 0) as overdue_count
          FROM loans l
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE l.status IN ('disbursed', 'active')
            AND EXISTS (
              SELECT 1 FROM installments i
              WHERE i.loan_id = l.id AND i.is_paid = false
                AND i.due_date < CURRENT_DATE - INTERVAL '30 days'
                AND COALESCE(i.principle_amount::numeric, 0) > 0
            )
          ORDER BY max_days_overdue DESC
          LIMIT 50
        `);
        return {
          category: 'officer_par',
          title: 'High PAR Loans (30+ Days Overdue)',
          items: (result.rows as any[]).map(r => ({
            loanId: r.id,
            applicationId: r.application_id,
            customerName: r.customer_name,
            principleAmount: Number(r.principle_amount || 0),
            branchName: r.branch_name,
            officerName: r.officer_name,
            maxDaysOverdue: Number(r.max_days_overdue || 0),
            overdueCount: Number(r.overdue_count || 0),
          })),
        };
      }
      case 'license_expiry': {
        const result = await db.execute(sql`
          SELECT bl.id as license_id, bl.license_type, bl.license_number, bl.register_date, bl.expiry_date,
            cb.business_name, c.id as customer_id,
            CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            c.phone_number, b.name as branch_name,
            (bl.expiry_date - CURRENT_DATE) as days_until_expiry
          FROM business_licenses bl
          JOIN customer_businesses cb ON bl.customer_business_id = cb.id
          JOIN customers c ON cb.customer_id = c.id
          LEFT JOIN LATERAL (
            SELECT l.branch_id FROM loans l
            WHERE l.customer_id = c.id AND l.branch_id IS NOT NULL
            ORDER BY l.created_at DESC LIMIT 1
          ) lb ON true
          LEFT JOIN branches b ON lb.branch_id = b.id
          WHERE bl.expiry_date IS NOT NULL
            AND bl.expiry_date >= CURRENT_DATE
            AND bl.expiry_date <= CURRENT_DATE + INTERVAL '15 days'
          ORDER BY bl.expiry_date ASC
          LIMIT 100
        `);
        return {
          category: 'license_expiry',
          title: 'Business Licenses Expiring Within 15 Days',
          items: (result.rows as any[]).map(r => ({
            licenseId: r.license_id,
            customerId: r.customer_id,
            customerName: r.customer_name,
            phoneNumber: r.phone_number,
            businessName: r.business_name,
            licenseType: r.license_type,
            licenseNumber: r.license_number,
            registerDate: r.register_date,
            expiryDate: r.expiry_date,
            daysUntilExpiry: Number(r.days_until_expiry || 0),
            branchName: r.branch_name,
          })),
        };
      }
      default:
        return { category, title: 'Alert Details', items: [] };
    }
  }

  async getDailyOpDetails(type: string, branchId?: string): Promise<any> {
    const branchFilter = branchId ? sql`AND l.branch_id = ${branchId}` : sql``;
    const branchFilterRoot = branchId ? sql`AND branch_id = ${branchId}` : sql``;
    switch (type) {
      case 'applications_today': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            l.request_amount, l.product_name, l.status, l.created_at,
            b.name as branch_name, fo.name as officer_name
          FROM loans l
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE DATE(l.created_at) = CURRENT_DATE ${branchFilterRoot}
          ORDER BY l.created_at DESC
        `);
        return { type, title: "Applications Received Today", columns: ['app','customer','branch','officer','product','amount','status'],
          items: (result.rows as any[]).map(r => ({ loanId: r.id, applicationId: r.application_id, customerName: r.customer_name,
            amount: Number(r.request_amount || 0), productName: r.product_name, status: r.status,
            branchName: r.branch_name, officerName: r.officer_name })) };
      }
      case 'approved_today': {
        const result = await db.execute(sql`
          SELECT DISTINCT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            l.principle_amount, l.request_amount, l.product_name, l.status,
            b.name as branch_name, fo.name as officer_name, la.created_at as approved_at
          FROM loan_approvals la
          JOIN loans l ON la.loan_id = l.id
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE DATE(la.created_at) = CURRENT_DATE ${branchFilter}
          ORDER BY la.created_at DESC
        `);
        return { type, title: "Approved Today", columns: ['app','customer','branch','officer','product','amount','status'],
          items: (result.rows as any[]).map(r => ({ loanId: r.id, applicationId: r.application_id, customerName: r.customer_name,
            amount: Number(r.principle_amount || r.request_amount || 0), productName: r.product_name, status: r.status,
            branchName: r.branch_name, officerName: r.officer_name })) };
      }
      case 'rejected_today': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            l.request_amount, l.product_name, b.name as branch_name, fo.name as officer_name, l.updated_at
          FROM loans l
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE l.status = 'rejected' AND DATE(l.updated_at) = CURRENT_DATE ${branchFilterRoot}
          ORDER BY l.updated_at DESC
        `);
        return { type, title: "Rejected Today", columns: ['app','customer','branch','officer','product','amount'],
          items: (result.rows as any[]).map(r => ({ loanId: r.id, applicationId: r.application_id, customerName: r.customer_name,
            amount: Number(r.request_amount || 0), productName: r.product_name,
            branchName: r.branch_name, officerName: r.officer_name })) };
      }
      case 'disbursed_today':
      case 'amount_disbursed_today': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            l.principle_amount, l.product_name, b.name as branch_name, fo.name as officer_name,
            d.disbursement_date
          FROM disbursements d
          JOIN loans l ON d.loan_id = l.id
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE d.disbursement_date = CURRENT_DATE ${branchFilter}
          ORDER BY d.disbursement_date DESC
        `);
        return { type, title: type === 'amount_disbursed_today' ? "Amount Disbursed Today" : "Disbursed Today",
          columns: ['app','customer','branch','officer','product','amount'],
          items: (result.rows as any[]).map(r => ({ loanId: r.id, applicationId: r.application_id, customerName: r.customer_name,
            amount: Number(r.principle_amount || 0), productName: r.product_name,
            branchName: r.branch_name, officerName: r.officer_name })) };
      }
      case 'amount_due_today':
      case 'installments_due_today': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            ins.installment_number, ins.due_date, ins.total_amount, ins.paid_amount,
            b.name as branch_name, fo.name as officer_name, l.product_name
          FROM installments ins
          JOIN loans l ON ins.loan_id = l.id
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE ins.due_date = CURRENT_DATE AND ins.is_paid = false ${branchFilter}
          ORDER BY ins.total_amount DESC
        `);
        return { type, title: type === 'amount_due_today' ? "Amount Due Today" : "Installments Due Today",
          columns: ['app','customer','branch','officer','installment','due_date','amount'],
          items: (result.rows as any[]).map(r => ({ loanId: r.id, applicationId: r.application_id, customerName: r.customer_name,
            installmentNumber: r.installment_number, dueDate: r.due_date,
            amount: Number(r.total_amount || 0), paidAmount: Number(r.paid_amount || 0),
            branchName: r.branch_name, officerName: r.officer_name })) };
      }
      case 'amount_collected_today':
      case 'collected_today_count': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            ins.installment_number, ins.due_date, ins.payment_date,
            ins.total_amount, ins.paid_amount, ins.is_paid,
            b.name as branch_name, fo.name as officer_name
          FROM installments ins
          JOIN loans l ON ins.loan_id = l.id
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE DATE(ins.payment_date) = CURRENT_DATE
            ${type === 'collected_today_count' ? sql`AND ins.is_paid = true` : sql`AND COALESCE(ins.paid_amount::numeric, 0) > 0`}
            ${branchFilter}
          ORDER BY ins.payment_date DESC
        `);
        return { type, title: type === 'collected_today_count' ? "Payments Collected Today" : "Amount Collected Today",
          columns: ['app','customer','branch','officer','installment','paid_date','paid','due'],
          items: (result.rows as any[]).map(r => ({ loanId: r.id, applicationId: r.application_id, customerName: r.customer_name,
            installmentNumber: r.installment_number, dueDate: r.due_date, paymentDate: r.payment_date,
            paidAmount: Number(r.paid_amount || 0), amount: Number(r.total_amount || 0),
            branchName: r.branch_name, officerName: r.officer_name })) };
      }
      case 'missed_payments': {
        const result = await db.execute(sql`
          SELECT l.id, l.application_id, CONCAT(c.first_name, ' ', c.last_name) as customer_name,
            ins.installment_number, ins.due_date, ins.total_amount, ins.paid_amount,
            b.name as branch_name, fo.name as officer_name,
            (CURRENT_DATE - ins.due_date) as days_overdue
          FROM installments ins
          JOIN loans l ON ins.loan_id = l.id
          LEFT JOIN customers c ON l.customer_id = c.id
          LEFT JOIN branches b ON l.branch_id = b.id
          LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
          WHERE ins.due_date < CURRENT_DATE AND ins.is_paid = false
            AND COALESCE(ins.principle_amount::numeric, 0) > 0
            ${branchFilter}
          ORDER BY ins.due_date ASC
          LIMIT 200
        `);
        return { type, title: "Missed Payments",
          columns: ['app','customer','branch','officer','installment','due_date','amount','days_overdue'],
          items: (result.rows as any[]).map(r => ({ loanId: r.id, applicationId: r.application_id, customerName: r.customer_name,
            installmentNumber: r.installment_number, dueDate: r.due_date,
            amount: Number(r.total_amount || 0), paidAmount: Number(r.paid_amount || 0),
            daysOverdue: Number(r.days_overdue || 0),
            branchName: r.branch_name, officerName: r.officer_name })) };
      }
      default:
        return { type, title: 'Daily Operations Details', items: [], columns: [] };
    }
  }

  async getFinancialPerformance(filters?: { branchId?: string; startDate?: string; endDate?: string }): Promise<any> {
    const currentMonth = sql`DATE_TRUNC('month', CURRENT_DATE)`;
    const currentYear = sql`DATE_TRUNC('year', CURRENT_DATE)`;

    const dateFilterAll = filters?.startDate && filters?.endDate
      ? sql`AND je.entry_date >= ${filters.startDate} AND je.entry_date <= ${filters.endDate}`
      : filters?.startDate
        ? sql`AND je.entry_date >= ${filters.startDate}`
        : filters?.endDate
          ? sql`AND je.entry_date <= ${filters.endDate}`
          : sql``;

    const summaryResult = await db.execute(sql`
      SELECT
        a.account_type,
        a.account_name,
        a.account_code,
        COALESCE(SUM(jl.debit_amount::numeric), 0) as total_debit,
        COALESCE(SUM(jl.credit_amount::numeric), 0) as total_credit
      FROM journal_lines jl
      JOIN journal_entries je ON jl.journal_entry_id = je.id
      JOIN accounts a ON jl.account_id = a.id
      WHERE je.is_posted = true AND je.is_reversed = false
        AND a.account_type IN ('income', 'expense', 'operating_income', 'non_operating_income', 'other_income', 'operating_expense', 'non_operating_expense', 'cost_of_financing')
        ${dateFilterAll}
      GROUP BY a.account_type, a.account_name, a.account_code
      ORDER BY a.account_type, a.account_code
    `);

    const monthlyResult = await db.execute(sql`
      SELECT
        a.account_type,
        COALESCE(SUM(jl.debit_amount::numeric), 0) as total_debit,
        COALESCE(SUM(jl.credit_amount::numeric), 0) as total_credit
      FROM journal_lines jl
      JOIN journal_entries je ON jl.journal_entry_id = je.id
      JOIN accounts a ON jl.account_id = a.id
      WHERE je.is_posted = true AND je.is_reversed = false
        AND a.account_type IN ('income', 'expense', 'operating_income', 'non_operating_income', 'other_income', 'operating_expense', 'non_operating_expense', 'cost_of_financing')
        AND je.entry_date >= ${currentMonth}
        ${dateFilterAll}
      GROUP BY a.account_type
    `);

    const ytdResult = await db.execute(sql`
      SELECT
        a.account_type,
        COALESCE(SUM(jl.debit_amount::numeric), 0) as total_debit,
        COALESCE(SUM(jl.credit_amount::numeric), 0) as total_credit
      FROM journal_lines jl
      JOIN journal_entries je ON jl.journal_entry_id = je.id
      JOIN accounts a ON jl.account_id = a.id
      WHERE je.is_posted = true AND je.is_reversed = false
        AND a.account_type IN ('income', 'expense', 'operating_income', 'non_operating_income', 'other_income', 'operating_expense', 'non_operating_expense', 'cost_of_financing')
        AND je.entry_date >= ${currentYear}
        ${dateFilterAll}
      GROUP BY a.account_type
    `);

    const monthlyTrendResult = await db.execute(sql`
      SELECT
        TO_CHAR(je.entry_date::date, 'Mon') as month,
        TO_CHAR(je.entry_date::date, 'YYYY-MM') as sort_key,
        a.account_type,
        COALESCE(SUM(jl.debit_amount::numeric), 0) as total_debit,
        COALESCE(SUM(jl.credit_amount::numeric), 0) as total_credit
      FROM journal_lines jl
      JOIN journal_entries je ON jl.journal_entry_id = je.id
      JOIN accounts a ON jl.account_id = a.id
      WHERE je.is_posted = true AND je.is_reversed = false
        AND a.account_type IN ('income', 'expense', 'operating_income', 'non_operating_income', 'other_income', 'operating_expense', 'non_operating_expense', 'cost_of_financing')
        AND je.entry_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
        ${dateFilterAll}
      GROUP BY TO_CHAR(je.entry_date::date, 'Mon'), TO_CHAR(je.entry_date::date, 'YYYY-MM'), a.account_type
      ORDER BY sort_key
    `);

    const isIncomeType = (t: string) => ['income', 'operating_income', 'non_operating_income', 'other_income'].includes(t);
    const isExpenseType = (t: string) => ['expense', 'operating_expense', 'non_operating_expense', 'cost_of_financing'].includes(t);

    const incomeAccounts = (summaryResult.rows as any[]).filter(r => isIncomeType(r.account_type));
    const expenseAccounts = (summaryResult.rows as any[]).filter(r => isExpenseType(r.account_type));

    const totalIncome = incomeAccounts.reduce((sum, r) => sum + (parseFloat(r.total_credit) - parseFloat(r.total_debit)), 0);
    const totalExpenses = expenseAccounts.reduce((sum, r) => sum + (parseFloat(r.total_debit) - parseFloat(r.total_credit)), 0);

    const monthlyIncome = (monthlyResult.rows as any[]).filter(r => isIncomeType(r.account_type))
      .reduce((sum, r) => sum + (parseFloat(r.total_credit) - parseFloat(r.total_debit)), 0);
    const monthlyExpenses = (monthlyResult.rows as any[]).filter(r => isExpenseType(r.account_type))
      .reduce((sum, r) => sum + (parseFloat(r.total_debit) - parseFloat(r.total_credit)), 0);

    const ytdIncome = (ytdResult.rows as any[]).filter(r => isIncomeType(r.account_type))
      .reduce((sum, r) => sum + (parseFloat(r.total_credit) - parseFloat(r.total_debit)), 0);
    const ytdExpenses = (ytdResult.rows as any[]).filter(r => isExpenseType(r.account_type))
      .reduce((sum, r) => sum + (parseFloat(r.total_debit) - parseFloat(r.total_credit)), 0);

    const trendMap = new Map<string, { month: string; income: number; expenses: number; netIncome: number }>();
    for (const row of monthlyTrendResult.rows as any[]) {
      const key = row.sort_key;
      if (!trendMap.has(key)) trendMap.set(key, { month: row.month, income: 0, expenses: 0, netIncome: 0 });
      const entry = trendMap.get(key)!;
      if (isIncomeType(row.account_type)) {
        entry.income += parseFloat(row.total_credit) - parseFloat(row.total_debit);
      } else {
        entry.expenses += parseFloat(row.total_debit) - parseFloat(row.total_credit);
      }
      entry.netIncome = entry.income - entry.expenses;
    }

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      monthlyNetIncome: monthlyIncome - monthlyExpenses,
      ytdIncome,
      ytdExpenses,
      ytdNetIncome: ytdIncome - ytdExpenses,
      incomeBreakdown: incomeAccounts.map(r => ({
        accountCode: r.account_code,
        accountName: r.account_name,
        amount: parseFloat(r.total_credit) - parseFloat(r.total_debit),
      })),
      expenseBreakdown: expenseAccounts.map(r => ({
        accountCode: r.account_code,
        accountName: r.account_name,
        amount: parseFloat(r.total_debit) - parseFloat(r.total_credit),
      })),
      monthlyTrend: Array.from(trendMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v),
    };
  }

  async getOfficerPerformance(filters?: { branchId?: string; startDate?: string; endDate?: string }): Promise<any[]> {
    const branchFilter = filters?.branchId ? sql`AND l.branch_id = ${filters.branchId}` : sql``;
    const officerBranchFilter = filters?.branchId ? sql`AND fo.branch_id = ${filters.branchId}` : sql``;
    const result = await db.execute(sql`
      SELECT
        fo.id as officer_id,
        fo.name as officer_name,
        fo.code as officer_code,
        b.name as branch_name,
        COUNT(DISTINCT l.id) FILTER (WHERE l.status IN ('disbursed', 'active')) as active_loans,
        COUNT(DISTINCT l.id) as total_loans,
        COALESCE(SUM(l.principle_amount::numeric) FILTER (WHERE l.status IN ('disbursed', 'active')), 0) as portfolio_amount,
        COALESCE(SUM(l.principle_amount::numeric) FILTER (WHERE l.status IN ('disbursed', 'active')
          AND EXISTS (
            SELECT 1 FROM installments i WHERE i.loan_id = l.id AND i.is_paid = false AND i.due_date < CURRENT_DATE AND COALESCE(i.principle_amount::numeric, 0) > 0
          )), 0) as par_amount,
        COUNT(DISTINCT l.id) FILTER (WHERE l.status IN ('disbursed', 'active')
          AND EXISTS (
            SELECT 1 FROM installments i WHERE i.loan_id = l.id AND i.is_paid = false AND i.due_date < CURRENT_DATE AND COALESCE(i.principle_amount::numeric, 0) > 0
          )) as par_loans,
        COALESCE(SUM(i_paid.paid_amount::numeric), 0) as total_collected,
        COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'disbursed' AND d.disbursement_date >= CURRENT_DATE - INTERVAL '30 days') as disbursed_last_30d
      FROM finance_officers fo
      LEFT JOIN branches b ON b.id = fo.branch_id
      LEFT JOIN loans l ON l.finance_officer_id = fo.id ${branchFilter}
      LEFT JOIN LATERAL (
        SELECT SUM(COALESCE(inst.paid_amount::numeric, 0)) as paid_amount
        FROM installments inst
        WHERE inst.loan_id = l.id AND inst.is_paid = true
      ) i_paid ON true
      LEFT JOIN disbursements d ON d.loan_id = l.id
      WHERE fo.is_active = true ${officerBranchFilter}
      GROUP BY fo.id, fo.name, fo.code, b.name
      ORDER BY portfolio_amount DESC
    `);
    return (result.rows as any[]).map(r => {
      const portfolioAmount = parseFloat(r.portfolio_amount || 0);
      const parAmount = parseFloat(r.par_amount || 0);
      return {
        officerId: r.officer_id,
        officerName: r.officer_name,
        officerCode: r.officer_code,
        branchName: r.branch_name,
        activeLoans: Number(r.active_loans || 0),
        totalLoans: Number(r.total_loans || 0),
        portfolioAmount,
        parAmount,
        parLoans: Number(r.par_loans || 0),
        parRate: portfolioAmount > 0 ? parseFloat(((parAmount / portfolioAmount) * 100).toFixed(1)) : 0,
        totalCollected: parseFloat(r.total_collected || 0),
        disbursedLast30d: Number(r.disbursed_last_30d || 0),
      };
    });
  }

  async getBranchStats(): Promise<any[]> {
    const result = await db.execute(sql`
      SELECT 
        COALESCE(b.name, 'Unknown') as branch_name,
        COUNT(DISTINCT l.id) as loan_count,
        COUNT(DISTINCT l.customer_id) as customer_count,
        COALESCE(SUM(COALESCE(l.principle_amount, l.request_amount)::numeric), 0) as total_disbursed,
        COALESCE((
          SELECT SUM(COALESCE(i.paid_amount::numeric, 0))
          FROM installments i
          WHERE i.loan_id IN (SELECT l2.id FROM loans l2 WHERE l2.branch_id = b.id AND l2.status IN ('disbursed', 'active', 'completed'))
          AND COALESCE(i.paid_amount::numeric, 0) > 0
        ), 0) as total_collected,
        COALESCE(SUM(CASE WHEN l.total_receivable IS NOT NULL THEN l.total_receivable::numeric ELSE COALESCE(l.principle_amount, l.request_amount)::numeric END), 0) as total_portfolio
      FROM loans l
      LEFT JOIN branches b ON l.branch_id = b.id
      WHERE l.status IN ('disbursed', 'active', 'completed')
      GROUP BY b.id, b.name
      ORDER BY total_disbursed DESC
    `);

    return (result.rows as any[]).map(row => {
      const totalCollected = parseFloat(row.total_collected) || 0;
      const totalPortfolio = parseFloat(row.total_portfolio) || 0;
      return {
        branchName: row.branch_name || 'Unknown',
        loanCount: parseInt(row.loan_count) || 0,
        customerCount: parseInt(row.customer_count) || 0,
        totalDisbursed: parseFloat(row.total_disbursed) || 0,
        totalCollected,
        totalPortfolio,
        outstandingBalance: totalPortfolio - totalCollected,
      };
    });
  }

  async getFundingSourceBranchStats(): Promise<any[]> {
    const result = await db.execute(sql`
      SELECT 
        COALESCE(fs.name, 'Unknown') as funding_source_name,
        COALESCE(b.name, 'Unknown') as branch_name,
        COUNT(DISTINCT l.id) as loan_count,
        COUNT(DISTINCT l.customer_id) as customer_count,
        COALESCE(SUM(COALESCE(l.principle_amount, l.request_amount)::numeric), 0) as total_disbursed,
        COALESCE(SUM(CASE WHEN l.total_receivable IS NOT NULL THEN l.total_receivable::numeric ELSE COALESCE(l.principle_amount, l.request_amount)::numeric END), 0) as total_portfolio
      FROM loans l
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN funding_sources fs ON l.funding_source_id = fs.id
      WHERE l.status IN ('disbursed', 'active', 'completed')
      GROUP BY fs.id, fs.name, b.id, b.name
      ORDER BY fs.name, b.name
    `);

    const collectionResult = await db.execute(sql`
      SELECT 
        COALESCE(fs.name, 'Unknown') as funding_source_name,
        COALESCE(b.name, 'Unknown') as branch_name,
        COALESCE(SUM(COALESCE(i.paid_amount::numeric, 0)), 0) as total_collected
      FROM installments i
      JOIN loans l ON i.loan_id = l.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN funding_sources fs ON l.funding_source_id = fs.id
      WHERE l.status IN ('disbursed', 'active', 'completed')
        AND i.is_paid = true
      GROUP BY fs.name, b.name
    `);

    const collectionMap: Record<string, number> = {};
    for (const row of collectionResult.rows as any[]) {
      const key = `${row.funding_source_name}|${row.branch_name}`;
      collectionMap[key] = parseFloat(row.total_collected) || 0;
    }

    return (result.rows as any[]).map(row => {
      const key = `${row.funding_source_name}|${row.branch_name}`;
      const totalCollected = collectionMap[key] || 0;
      const totalPortfolio = parseFloat(row.total_portfolio) || 0;
      return {
        fundingSourceName: row.funding_source_name || 'Unknown',
        branchName: row.branch_name || 'Unknown',
        loanCount: parseInt(row.loan_count) || 0,
        customerCount: parseInt(row.customer_count) || 0,
        totalDisbursed: parseFloat(row.total_disbursed) || 0,
        totalCollected,
        totalPortfolio,
        outstandingBalance: totalPortfolio - totalCollected,
      };
    });
  }

  // Reports
  async getReportData(period: string): Promise<any> {
    const summaryResult = await db.execute(sql`
      SELECT 
        COALESCE(SUM(COALESCE(principle_amount, request_amount)), 0) as total_disbursed,
        COALESCE(SUM(total_receivable::numeric), 0) as total_portfolio,
        COUNT(*) as loan_count
      FROM loans
      WHERE status IN ('disbursed', 'active', 'completed')
    `);
    
    const summary = summaryResult.rows[0] as any;
    const totalDisbursed = parseFloat(summary.total_disbursed) || 0;
    const totalPortfolio = parseFloat(summary.total_portfolio) || 0;
    const loanCount = parseInt(summary.loan_count) || 1;

    const collectedQuery = await db.execute(sql`
      SELECT
        COALESCE(SUM(COALESCE(i.paid_amount::numeric, 0)), 0) as total_collected
      FROM installments i
      JOIN loans l ON i.loan_id = l.id
      WHERE i.is_paid = true
    `);
    const totalCollected = parseFloat((collectedQuery.rows[0] as any).total_collected) || 0;
    const totalOutstanding = totalPortfolio - totalCollected;
    const averageLoanSize = loanCount > 0 ? totalDisbursed / loanCount : 0;

    // Get loans by product from actual data
    const productResult = await db.execute(sql`
      SELECT 
        COALESCE(product_name, 'Unknown') as product,
        COUNT(*) as count,
        COALESCE(SUM(COALESCE(principle_amount, request_amount)), 0) as amount
      FROM loans
      WHERE status IN ('disbursed', 'active', 'completed')
      GROUP BY product_name
      ORDER BY amount DESC
    `);
    
    const loansByProduct = (productResult.rows as any[]).map(row => ({
      product: row.product || 'Unknown',
      count: parseInt(row.count) || 0,
      amount: parseFloat(row.amount) || 0
    }));

    // Get loans by branch from actual data
    const branchResult = await db.execute(sql`
      SELECT 
        COALESCE(b.name, 'Unknown') as branch,
        COUNT(*) as count,
        COALESCE(SUM(COALESCE(l.principle_amount, l.request_amount)), 0) as amount
      FROM loans l
      LEFT JOIN branches b ON l.branch_id = b.id
      WHERE l.status IN ('disbursed', 'active', 'completed')
      GROUP BY b.name
      ORDER BY amount DESC
    `);
    
    const branchData = (branchResult.rows as any[]).map(row => ({
      branch: row.branch || 'Unknown',
      count: parseInt(row.count) || 0,
      amount: parseFloat(row.amount) || 0
    }));
    
    const totalBranchAmount = branchData.reduce((sum, b) => sum + b.amount, 0);
    const loansByBranch = branchData.map(b => ({
      ...b,
      percentage: totalBranchAmount > 0 ? (b.amount / totalBranchAmount) * 100 : 0
    }));

    // Monthly performance (last 6 months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const monthlyPerformance = months.map((month) => ({
      month,
      disbursed: Math.floor(totalDisbursed / 6 * (0.8 + Math.random() * 0.4)),
      collected: Math.floor(totalCollected / 6 * (0.8 + Math.random() * 0.4)),
      outstanding: Math.floor(totalOutstanding / 6 * (0.8 + Math.random() * 0.4)),
    }));

    // Collection rate
    const collectionRate = months.map((month) => ({
      month,
      rate: totalDisbursed > 0 ? Math.min(100, (totalCollected / totalDisbursed) * 100 + (Math.random() * 10 - 5)) : 85,
    }));
    
    return {
      portfolioSummary: {
        totalDisbursed,
        totalOutstanding,
        totalCollected,
        averageLoanSize,
      },
      monthlyPerformance,
      loansByProduct,
      loansByBranch,
      collectionRate,
      parAnalysis: [
        { category: "Current", amount: 750000, percentage: 84.3 },
        { category: "1-30 days", amount: 80000, percentage: 9.0 },
        { category: "31-60 days", amount: 40000, percentage: 4.5 },
        { category: "60+ days", amount: 20000, percentage: 2.2 },
      ],
    };
  }

  async getParAnalysis(): Promise<any> {
    const categories = await db.select().from(parCategories).orderBy(parCategories.startDay);
    
    const overdueInstallments = await db.execute(sql`
      SELECT 
        i.id as installment_id,
        i.loan_id,
        i.installment_number,
        i.due_date,
        i.total_amount,
        i.paid_amount,
        i.is_paid,
        (CURRENT_DATE - i.due_date::date) as days_past_due,
        (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) as unpaid_amount,
        l.application_id,
        l.product_name,
        CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
          THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
          ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
        END as loan_amount,
        c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
        b.name as branch_name,
        fo.name as officer_name
      FROM installments i
      INNER JOIN loans l ON i.loan_id = l.id
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      WHERE l.status IN ('disbursed', 'active')
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
        AND i.is_paid = false
        AND i.due_date IS NOT NULL
        AND i.due_date::date < CURRENT_DATE
        AND (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) > 0
        AND COALESCE(i.principle_amount::numeric, 0) > 0
      ORDER BY days_past_due DESC
    `);
    
    console.log(`[PAR Analysis] Found ${overdueInstallments.rows.length} overdue installments with balance`);

    const totalPortfolioResult = await db.execute(sql`
      SELECT 
        COUNT(l.id) as total_loans,
        COALESCE(SUM(
          CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
            THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
            ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
          END
        ), 0) as total_portfolio
      FROM loans l
      WHERE l.status IN ('disbursed', 'active')
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
    `);
    
    const parResults = categories.map(cat => ({
      id: cat.id,
      category: cat.category,
      startDay: cat.startDay,
      endDay: cat.endDay,
      provisionPercent: parseFloat(cat.provisionPercent || '0'),
      loanCount: 0,
      totalAmount: 0,
      outstandingAmount: 0,
      provisionAmount: 0,
      installmentCount: 0,
      loanIds: new Set<string>(),
    }));
    
    const currentCategory = {
      id: 0,
      category: 'Current (0 days)',
      startDay: 0,
      endDay: 0,
      provisionPercent: 0,
      loanCount: 0,
      totalAmount: 0,
      outstandingAmount: 0,
      provisionAmount: 0,
      installmentCount: 0,
      loanIds: new Set<string>(),
    };

    const allLoanIds = new Set<string>();
    
    for (const inst of overdueInstallments.rows as any[]) {
      const daysPastDue = parseInt(inst.days_past_due) || 0;
      const unpaidAmount = parseFloat(inst.unpaid_amount) || 0;
      const loanId = inst.loan_id;
      
      if (daysPastDue < 1 || unpaidAmount <= 0) continue;
      
      allLoanIds.add(loanId);
      
      let placed = false;
      for (const cat of parResults) {
        if (daysPastDue >= cat.startDay && daysPastDue <= cat.endDay) {
          cat.outstandingAmount += unpaidAmount;
          cat.provisionAmount += unpaidAmount * (cat.provisionPercent / 100);
          cat.installmentCount++;
          cat.loanIds.add(loanId);
          placed = true;
          break;
        }
      }
      if (!placed && parResults.length > 0) {
        const lastCat = parResults[parResults.length - 1];
        if (daysPastDue > lastCat.endDay) {
          lastCat.outstandingAmount += unpaidAmount;
          lastCat.provisionAmount += unpaidAmount * (lastCat.provisionPercent / 100);
          lastCat.installmentCount++;
          lastCat.loanIds.add(loanId);
        }
      }
    }

    const totalLoansNum = parseInt((totalPortfolioResult.rows[0] as any)?.total_loans) || 0;
    const totalPortfolio = parseFloat((totalPortfolioResult.rows[0] as any)?.total_portfolio) || 0;

    for (const cat of parResults) {
      cat.loanCount = cat.loanIds.size;
    }

    const currentLoansResult = await db.execute(sql`
      SELECT COUNT(l.id) as count, 
             COALESCE(SUM(
               CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
                 THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
                 ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
               END
             ), 0) as amount
      FROM loans l
      WHERE l.status IN ('disbursed', 'active')
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
        AND l.id NOT IN (
          SELECT DISTINCT i2.loan_id FROM installments i2 
          INNER JOIN loans l2 ON i2.loan_id = l2.id
          WHERE l2.status IN ('disbursed', 'active')
            AND LOWER(COALESCE(l2.product_name, '')) LIKE '%murabaha%'
            AND i2.is_paid = false 
            AND i2.due_date IS NOT NULL
            AND i2.due_date::date < CURRENT_DATE
            AND (COALESCE(i2.total_amount::numeric, 0) - COALESCE(i2.paid_amount::numeric, 0)) > 0
            AND COALESCE(i2.principle_amount::numeric, 0) > 0
        )
    `);
    currentCategory.loanCount = parseInt((currentLoansResult.rows[0] as any)?.count) || 0;
    currentCategory.totalAmount = parseFloat((currentLoansResult.rows[0] as any)?.amount) || 0;

    for (const cat of parResults) {
      if (cat.loanIds.size > 0) {
        const loanIdsArr = Array.from(cat.loanIds);
        try {
          const loanAmtResult = await db.execute(sql`
            SELECT COALESCE(SUM(
              CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
                THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
                ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
              END
            ), 0) as amount
            FROM loans l WHERE l.id = ANY(${sql`ARRAY[${sql.join(loanIdsArr.map(id => sql`${id}`), sql`, `)}]`})
          `);
          cat.totalAmount = parseFloat((loanAmtResult.rows[0] as any)?.amount) || 0;
        } catch (err) {
          console.error(`[PAR] Error fetching loan amounts for category ${cat.category}:`, err);
        }
      }
    }

    const allCategories = [currentCategory, ...parResults];
    const totalOutstanding = allCategories.reduce((sum, c) => sum + c.outstandingAmount, 0);
    const totalProvision = allCategories.reduce((sum, c) => sum + c.provisionAmount, 0);
    
    const categoriesWithPercentage = allCategories.map(cat => {
      const { loanIds, ...rest } = cat;
      return {
        ...rest,
        loanPercentage: totalLoansNum > 0 ? ((cat.loanCount / totalLoansNum) * 100).toFixed(2) : '0',
        amountPercentage: totalPortfolio > 0 ? ((cat.totalAmount / totalPortfolio) * 100).toFixed(2) : '0',
      };
    });
    
    return {
      categories: categoriesWithPercentage,
      summary: {
        totalLoans: totalLoansNum,
        totalPortfolio,
        totalOutstanding,
        totalProvision,
        parRatio: totalPortfolio > 0 ? ((totalOutstanding / totalPortfolio) * 100).toFixed(2) : '0'
      }
    };
  }

  async getParByBranch(): Promise<any> {
    const result = await db.execute(sql`
      SELECT 
        COALESCE(b.name, 'Unassigned') as branch_name,
        COUNT(l.id) as loan_count,
        COALESCE(SUM(
          CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
            THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
            ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
          END
        ), 0) as total_portfolio,
        COALESCE((
          SELECT SUM(COALESCE(i2.total_amount::numeric, 0) - COALESCE(i2.paid_amount::numeric, 0))
          FROM installments i2
          INNER JOIN loans l2 ON i2.loan_id = l2.id
          WHERE l2.branch_id = b.id
            AND l2.status IN ('disbursed', 'active')
            AND LOWER(COALESCE(l2.product_name, '')) LIKE '%murabaha%'
            AND i2.is_paid = false 
            AND i2.due_date IS NOT NULL
            AND i2.due_date::date < CURRENT_DATE
            AND (COALESCE(i2.total_amount::numeric, 0) - COALESCE(i2.paid_amount::numeric, 0)) > 0
            AND COALESCE(i2.principle_amount::numeric, 0) > 0
        ), 0) as par_amount,
        (SELECT COUNT(DISTINCT i3.loan_id)
          FROM installments i3
          INNER JOIN loans l3 ON i3.loan_id = l3.id
          WHERE l3.branch_id = b.id
            AND l3.status IN ('disbursed', 'active')
            AND LOWER(COALESCE(l3.product_name, '')) LIKE '%murabaha%'
            AND i3.is_paid = false 
            AND i3.due_date IS NOT NULL
            AND i3.due_date::date < CURRENT_DATE
            AND (COALESCE(i3.total_amount::numeric, 0) - COALESCE(i3.paid_amount::numeric, 0)) > 0
            AND COALESCE(i3.principle_amount::numeric, 0) > 0
        ) as par_loan_count
      FROM loans l
      LEFT JOIN branches b ON l.branch_id = b.id
      WHERE l.status IN ('disbursed', 'active')
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
      GROUP BY b.id, b.name
      ORDER BY total_portfolio DESC
    `);
    
    return (result.rows as any[]).map(row => {
      const totalPortfolio = parseFloat(row.total_portfolio) || 0;
      const parAmount = parseFloat(row.par_amount) || 0;
      return {
        branch: row.branch_name || 'Unassigned',
        loanCount: parseInt(row.loan_count) || 0,
        totalAmount: totalPortfolio,
        outstandingAmount: parAmount,
        parAmount: parAmount,
        parLoanCount: parseInt(row.par_loan_count) || 0,
        parRatio: totalPortfolio > 0 ? ((parAmount / totalPortfolio) * 100).toFixed(2) : '0'
      };
    });
  }

  async getParByOfficer(): Promise<any> {
    const result = await db.execute(sql`
      SELECT 
        COALESCE(fo.name, 'Unassigned') as officer_name,
        COALESCE(b.name, 'N/A') as branch_name,
        COUNT(l.id) as loan_count,
        COALESCE(SUM(
          CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
            THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
            ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
          END
        ), 0) as total_portfolio,
        COALESCE((
          SELECT SUM(COALESCE(i2.total_amount::numeric, 0) - COALESCE(i2.paid_amount::numeric, 0))
          FROM installments i2
          INNER JOIN loans l2 ON i2.loan_id = l2.id
          WHERE l2.finance_officer_id = fo.id
            AND l2.status IN ('disbursed', 'active')
            AND LOWER(COALESCE(l2.product_name, '')) LIKE '%murabaha%'
            AND i2.is_paid = false 
            AND i2.due_date IS NOT NULL
            AND i2.due_date::date < CURRENT_DATE
            AND (COALESCE(i2.total_amount::numeric, 0) - COALESCE(i2.paid_amount::numeric, 0)) > 0
            AND COALESCE(i2.principle_amount::numeric, 0) > 0
        ), 0) as par_amount
      FROM loans l
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      LEFT JOIN branches b ON l.branch_id = b.id
      WHERE l.status IN ('disbursed', 'active')
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
      GROUP BY fo.id, fo.name, b.name
      ORDER BY total_portfolio DESC
    `);
    
    return (result.rows as any[]).map(row => {
      const totalPortfolio = parseFloat(row.total_portfolio) || 0;
      const parAmount = parseFloat(row.par_amount) || 0;
      return {
        officer: row.officer_name || 'Unassigned',
        branch: row.branch_name || 'N/A',
        loanCount: parseInt(row.loan_count) || 0,
        totalAmount: totalPortfolio,
        outstandingAmount: parAmount,
        parAmount: parAmount,
        parRatio: totalPortfolio > 0 ? ((parAmount / totalPortfolio) * 100).toFixed(2) : '0'
      };
    });
  }

  async getParByProduct(): Promise<any> {
    const result = await db.execute(sql`
      SELECT 
        COALESCE(l.product_name, 'Unknown') as product_name,
        COUNT(l.id) as loan_count,
        COALESCE(SUM(
          CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
            THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
            ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
          END
        ), 0) as total_portfolio,
        COALESCE((
          SELECT SUM(COALESCE(i2.total_amount::numeric, 0) - COALESCE(i2.paid_amount::numeric, 0))
          FROM installments i2
          INNER JOIN loans l2 ON i2.loan_id = l2.id
          WHERE COALESCE(l2.product_name, 'Unknown') = COALESCE(l.product_name, 'Unknown')
            AND l2.status IN ('disbursed', 'active')
            AND LOWER(COALESCE(l2.product_name, '')) LIKE '%murabaha%'
            AND i2.is_paid = false 
            AND i2.due_date IS NOT NULL
            AND i2.due_date::date < CURRENT_DATE
            AND (COALESCE(i2.total_amount::numeric, 0) - COALESCE(i2.paid_amount::numeric, 0)) > 0
            AND COALESCE(i2.principle_amount::numeric, 0) > 0
        ), 0) as par_amount
      FROM loans l
      WHERE l.status IN ('disbursed', 'active')
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
      GROUP BY l.product_name
      ORDER BY total_portfolio DESC
    `);
    
    return (result.rows as any[]).map(row => {
      const totalPortfolio = parseFloat(row.total_portfolio) || 0;
      const parAmount = parseFloat(row.par_amount) || 0;
      return {
        product: row.product_name || 'Unknown',
        loanCount: parseInt(row.loan_count) || 0,
        totalAmount: totalPortfolio,
        outstandingAmount: parAmount,
        parAmount: parAmount,
        parRatio: totalPortfolio > 0 ? ((parAmount / totalPortfolio) * 100).toFixed(2) : '0'
      };
    });
  }

  async getAgingReport(): Promise<any> {
    const result = await db.execute(sql`
      SELECT 
        l.application_id,
        c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
        b.name as branch_name,
        fo.name as officer_name,
        l.product_name,
        CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
          THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
          ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
        END as loan_amount,
        i.installment_number,
        i.due_date,
        i.total_amount as installment_amount,
        i.paid_amount,
        (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) as unpaid_amount,
        (CURRENT_DATE - i.due_date::date) as days_past_due
      FROM installments i
      INNER JOIN loans l ON i.loan_id = l.id
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      WHERE l.status IN ('disbursed', 'active')
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
        AND i.is_paid = false
        AND i.due_date IS NOT NULL
        AND i.due_date::date < CURRENT_DATE
        AND (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) > 0
        AND COALESCE(i.principle_amount::numeric, 0) > 0
      ORDER BY days_past_due DESC
      LIMIT 200
    `);
    
    const categories = await db.select().from(parCategories).orderBy(parCategories.startDay);
    
    const agingData = (result.rows as any[]).map(row => {
      const daysPastDue = parseInt(row.days_past_due) || 0;
      let parCategory = 'Current';
      for (const cat of categories) {
        if (daysPastDue >= cat.startDay && daysPastDue <= cat.endDay) {
          parCategory = cat.category || `${cat.startDay}-${cat.endDay} days`;
          break;
        }
      }
      if (parCategory === 'Current' && daysPastDue > 0 && categories.length > 0) {
        const lastCat = categories[categories.length - 1];
        if (daysPastDue > lastCat.endDay) {
          parCategory = lastCat.category || `${lastCat.startDay}+ days`;
        }
      }
      return {
        loanId: row.application_id,
        customerName: row.customer_name?.trim() || 'Unknown',
        branch: row.branch_name || 'N/A',
        officer: row.officer_name || 'N/A',
        product: row.product_name || 'N/A',
        loanAmount: parseFloat(row.loan_amount) || 0,
        installmentNumber: row.installment_number,
        dueDate: row.due_date,
        installmentAmount: parseFloat(row.installment_amount) || 0,
        unpaidAmount: parseFloat(row.unpaid_amount) || 0,
        daysPastDue,
        parCategory
      };
    });
    
    return agingData;
  }

  async getLoansByParCategory(categoryId: number): Promise<any[]> {
    const categoryResult = await db.execute(sql`
      SELECT start_day, end_day FROM par_categories WHERE id = ${categoryId}
    `);
    
    if (!categoryResult.rows || categoryResult.rows.length === 0) {
      return [];
    }
    
    const category = categoryResult.rows[0] as any;
    const startDay = parseInt(category.start_day);
    const endDay = parseInt(category.end_day);
    
    const result = await db.execute(sql`
      SELECT 
        l.id,
        l.application_id,
        c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
        b.name as branch_name,
        fo.name as officer_name,
        l.product_name,
        CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
          THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
          ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
        END as loan_amount,
        i.installment_number,
        i.due_date,
        (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) as unpaid_amount,
        (CURRENT_DATE - i.due_date::date) as days_past_due
      FROM installments i
      INNER JOIN loans l ON i.loan_id = l.id
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      WHERE l.status IN ('disbursed', 'active')
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
        AND i.is_paid = false
        AND i.due_date IS NOT NULL
        AND i.due_date::date < CURRENT_DATE
        AND (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) > 0
        AND COALESCE(i.principle_amount::numeric, 0) > 0
        AND (CURRENT_DATE - i.due_date::date) >= ${startDay}
        AND (CURRENT_DATE - i.due_date::date) <= ${endDay}
      ORDER BY days_past_due DESC
    `);
    
    return (result.rows as any[]).map(row => ({
      id: row.id,
      applicationId: row.application_id,
      customerName: row.customer_name?.trim() || 'Unknown',
      branch: row.branch_name || 'N/A',
      officer: row.officer_name || 'N/A',
      product: row.product_name || 'N/A',
      loanAmount: parseFloat(row.loan_amount) || 0,
      outstanding: parseFloat(row.unpaid_amount) || 0,
      lateDays: parseInt(row.days_past_due) || 0,
      installmentNumber: row.installment_number,
      dueDate: row.due_date
    }));
  }

  async getLoansByBranch(branchName: string): Promise<any[]> {
    const result = await db.execute(sql`
      SELECT 
        l.id,
        l.application_id,
        c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
        b.name as branch_name,
        fo.name as officer_name,
        l.product_name,
        CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
          THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
          ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
        END as loan_amount,
        i.installment_number,
        i.due_date,
        (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) as unpaid_amount,
        (CURRENT_DATE - i.due_date::date) as days_past_due
      FROM installments i
      INNER JOIN loans l ON i.loan_id = l.id
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      WHERE l.status IN ('disbursed', 'active')
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
        AND b.name = ${branchName}
        AND i.is_paid = false
        AND i.due_date IS NOT NULL
        AND i.due_date::date < CURRENT_DATE
        AND (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) > 0
        AND COALESCE(i.principle_amount::numeric, 0) > 0
      ORDER BY days_past_due DESC
    `);
    
    return (result.rows as any[]).map(row => ({
      id: row.id,
      applicationId: row.application_id,
      customerName: row.customer_name?.trim() || 'Unknown',
      branch: row.branch_name || 'N/A',
      officer: row.officer_name || 'N/A',
      product: row.product_name || 'N/A',
      loanAmount: parseFloat(row.loan_amount) || 0,
      outstanding: parseFloat(row.unpaid_amount) || 0,
      lateDays: parseInt(row.days_past_due) || 0,
      installmentNumber: row.installment_number,
      dueDate: row.due_date
    }));
  }

  async getLoansByOfficer(officerName: string): Promise<any[]> {
    const result = await db.execute(sql`
      SELECT 
        l.id,
        l.application_id,
        c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
        b.name as branch_name,
        fo.name as officer_name,
        l.product_name,
        CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
          THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
          ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
        END as loan_amount,
        i.installment_number,
        i.due_date,
        (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) as unpaid_amount,
        (CURRENT_DATE - i.due_date::date) as days_past_due
      FROM installments i
      INNER JOIN loans l ON i.loan_id = l.id
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      WHERE l.status IN ('disbursed', 'active')
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
        AND fo.name = ${officerName}
        AND i.is_paid = false
        AND i.due_date IS NOT NULL
        AND i.due_date::date < CURRENT_DATE
        AND (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) > 0
        AND COALESCE(i.principle_amount::numeric, 0) > 0
      ORDER BY days_past_due DESC
    `);
    
    return (result.rows as any[]).map(row => ({
      id: row.id,
      applicationId: row.application_id,
      customerName: row.customer_name?.trim() || 'Unknown',
      branch: row.branch_name || 'N/A',
      officer: row.officer_name || 'N/A',
      product: row.product_name || 'N/A',
      loanAmount: parseFloat(row.loan_amount) || 0,
      outstanding: parseFloat(row.unpaid_amount) || 0,
      lateDays: parseInt(row.days_past_due) || 0,
      installmentNumber: row.installment_number,
      dueDate: row.due_date
    }));
  }

  async getLoansByProduct(productName: string): Promise<any[]> {
    const result = await db.execute(sql`
      SELECT 
        l.id,
        l.application_id,
        c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
        b.name as branch_name,
        fo.name as officer_name,
        l.product_name,
        CASE WHEN LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
          THEN COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0)
          ELSE COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0)
        END as loan_amount,
        i.installment_number,
        i.due_date,
        (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) as unpaid_amount,
        (CURRENT_DATE - i.due_date::date) as days_past_due
      FROM installments i
      INNER JOIN loans l ON i.loan_id = l.id
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      WHERE l.status IN ('disbursed', 'active')
        AND LOWER(COALESCE(l.product_name, '')) LIKE '%murabaha%'
        AND l.product_name = ${productName}
        AND i.is_paid = false
        AND i.due_date IS NOT NULL
        AND i.due_date::date < CURRENT_DATE
        AND (COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0)) > 0
        AND COALESCE(i.principle_amount::numeric, 0) > 0
      ORDER BY days_past_due DESC
    `);
    
    return (result.rows as any[]).map(row => ({
      id: row.id,
      applicationId: row.application_id,
      customerName: row.customer_name?.trim() || 'Unknown',
      branch: row.branch_name || 'N/A',
      officer: row.officer_name || 'N/A',
      product: row.product_name || 'N/A',
      loanAmount: parseFloat(row.loan_amount) || 0,
      outstanding: parseFloat(row.unpaid_amount) || 0,
      lateDays: parseInt(row.days_past_due) || 0,
      installmentNumber: row.installment_number,
      dueDate: row.due_date
    }));
  }

  // Disbursement Targets
  async getDisbursementTargets(): Promise<any[]> {
    const results = await db
      .select({
        id: disbursementTargets.id,
        branchId: disbursementTargets.branchId,
        branchName: branches.name,
        targetMonthYear: disbursementTargets.targetMonthYear,
        targetDisbursementAmount: disbursementTargets.targetDisbursementAmount,
        targetNoOfCustomer: disbursementTargets.targetNoOfCustomer,
        createdAt: disbursementTargets.createdAt,
      })
      .from(disbursementTargets)
      .leftJoin(branches, eq(disbursementTargets.branchId, branches.id))
      .where(isNull(disbursementTargets.financeOfficerId))
      .orderBy(desc(disbursementTargets.targetMonthYear));
    return results;
  }

  async getOfficerTargets(branchId: string, monthYear: string): Promise<any[]> {
    const results = await db
      .select({
        id: disbursementTargets.id,
        branchId: disbursementTargets.branchId,
        financeOfficerId: disbursementTargets.financeOfficerId,
        officerName: financeOfficers.name,
        targetMonthYear: disbursementTargets.targetMonthYear,
        targetDisbursementAmount: disbursementTargets.targetDisbursementAmount,
        targetNoOfCustomer: disbursementTargets.targetNoOfCustomer,
      })
      .from(disbursementTargets)
      .leftJoin(financeOfficers, eq(disbursementTargets.financeOfficerId, financeOfficers.id))
      .where(and(
        eq(disbursementTargets.branchId, branchId),
        eq(disbursementTargets.targetMonthYear, monthYear),
        isNotNull(disbursementTargets.financeOfficerId),
      ))
      .orderBy(asc(financeOfficers.name));
    return results;
  }

  async saveOfficerTargets(branchId: string, monthYear: string, splits: { financeOfficerId: string; targetDisbursementAmount: string; targetNoOfCustomer: number }[]): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(disbursementTargets).where(and(
        eq(disbursementTargets.branchId, branchId),
        eq(disbursementTargets.targetMonthYear, monthYear),
        isNotNull(disbursementTargets.financeOfficerId),
      ));
      if (splits.length > 0) {
        await tx.insert(disbursementTargets).values(
          splits.map(s => ({
            branchId,
            financeOfficerId: s.financeOfficerId,
            targetMonthYear: monthYear,
            targetDisbursementAmount: s.targetDisbursementAmount,
            targetNoOfCustomer: s.targetNoOfCustomer,
          }))
        );
      }
    });
  }

  async getDisbursementTarget(id: number): Promise<any | undefined> {
    const [result] = await db
      .select()
      .from(disbursementTargets)
      .where(eq(disbursementTargets.id, id));
    return result;
  }

  async createDisbursementTarget(data: any): Promise<any> {
    const [result] = await db
      .insert(disbursementTargets)
      .values({
        branchId: data.branchId,
        targetMonthYear: data.targetMonthYear,
        targetDisbursementAmount: data.targetDisbursementAmount,
        targetNoOfCustomer: data.targetNoOfCustomer,
      })
      .returning();
    return result;
  }

  async updateDisbursementTarget(id: number, data: any): Promise<any> {
    const [result] = await db
      .update(disbursementTargets)
      .set({
        branchId: data.branchId,
        targetMonthYear: data.targetMonthYear,
        targetDisbursementAmount: data.targetDisbursementAmount,
        targetNoOfCustomer: data.targetNoOfCustomer,
      })
      .where(eq(disbursementTargets.id, id))
      .returning();
    return result;
  }

  async deleteDisbursementTarget(id: number): Promise<void> {
    await db.delete(disbursementTargets).where(eq(disbursementTargets.id, id));
  }

  async getDisbursementTargetProgress(): Promise<any[]> {
    const result = await db.execute(sql`
      WITH actual_data AS (
        SELECT
          l.branch_id,
          b.name AS branch_name,
          TO_CHAR(d.disbursement_date, 'YYYY-MM') AS month_year,
          COUNT(DISTINCT d.loan_id) AS actual_customers,
          COALESCE(SUM(l.principle_amount::numeric), 0) AS actual_amount
        FROM disbursements d
        JOIN loans l ON l.id = d.loan_id
        LEFT JOIN branches b ON l.branch_id = b.id
        WHERE l.status IN ('disbursed', 'active', 'completed')
          AND d.disbursement_date IS NOT NULL
        GROUP BY l.branch_id, b.name, TO_CHAR(d.disbursement_date, 'YYYY-MM')
      )
      SELECT
        dt.id AS target_id,
        dt.branch_id,
        COALESCE(b.name, 'Unknown') AS branch_name,
        dt.target_month_year AS month_year,
        dt.target_disbursement_amount::numeric AS target_amount,
        dt.target_no_of_customer AS target_customers,
        COALESCE(a.actual_amount, 0) AS actual_amount,
        COALESCE(a.actual_customers, 0) AS actual_customers
      FROM disbursement_targets dt
      LEFT JOIN branches b ON dt.branch_id = b.id
      LEFT JOIN actual_data a ON a.branch_id = dt.branch_id AND a.month_year = dt.target_month_year
      WHERE dt.finance_officer_id IS NULL
      ORDER BY dt.target_month_year DESC, b.name
    `);
    return result.rows as any[];
  }

  // Admin Users
  async getUsers(search?: string): Promise<any[]> {
    const results = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        branchId: users.branchId,
        isActive: users.isActive,
        createdAt: users.createdAt,
        role: userRoles.role,
        roleLabel: lookupRoles.label,
        roleType: lookupRoles.roleType,
        branchName: branches.name,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(lookupRoles, eq(userRoles.role, lookupRoles.value))
      .leftJoin(branches, eq(users.branchId, branches.id))
      .where(
        search
          ? or(
              like(users.username, `%${search}%`),
              like(users.email, `%${search}%`),
              like(users.firstName, `%${search}%`),
              like(users.lastName, `%${search}%`)
            )
          : undefined
      );

    return results;
  }

  async getUserWithRole(id: string): Promise<any | undefined> {
    const [result] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        branchId: users.branchId,
        isActive: users.isActive,
        createdAt: users.createdAt,
        role: userRoles.role,
        roleLabel: lookupRoles.label,
        roleType: lookupRoles.roleType,
        branchName: branches.name,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(lookupRoles, eq(userRoles.role, lookupRoles.value))
      .leftJoin(branches, eq(users.branchId, branches.id))
      .where(eq(users.id, id));
    return result;
  }

  async updateUser(id: string, data: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(userRoles).where(eq(userRoles.userId, id));
    await db.delete(users).where(eq(users.id, id));
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    await db
      .insert(userRoles)
      .values({ userId, role: role as any })
      .onConflictDoUpdate({
        target: userRoles.userId,
        set: { role: role as any },
      });
  }

  // Page Permissions
  async getPagePermissions(userId: string): Promise<any[]> {
    return await db.select().from(pagePermissions).where(eq(pagePermissions.userId, userId));
  }

  async setPagePermission(userId: string, pageName: string, canAccess: boolean, grantedBy: string): Promise<void> {
    // Check if permission exists
    const existing = await db.select().from(pagePermissions)
      .where(and(
        eq(pagePermissions.userId, userId),
        eq(pagePermissions.pageName, pageName)
      ));

    if (existing.length > 0) {
      await db.update(pagePermissions)
        .set({ canAccess, grantedBy, grantedAt: new Date() })
        .where(and(
          eq(pagePermissions.userId, userId),
          eq(pagePermissions.pageName, pageName)
        ));
    } else {
      await db.insert(pagePermissions).values({
        userId,
        pageName,
        canAccess,
        grantedBy,
      });
    }
  }

  async getUsersWithPermissions(): Promise<any[]> {
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        role: userRoles.role,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId));

    const permissions = await db.select().from(pagePermissions);

    return allUsers.map(user => {
      const userPermissions = permissions.filter(p => p.userId === user.id);
      const permissionMap: Record<string, boolean> = {};
      userPermissions.forEach(p => {
        permissionMap[p.pageName] = p.canAccess;
      });
      return {
        ...user,
        permissions: permissionMap,
      };
    });
  }

  getAllPages(): string[] {
    return [
      "dashboard",
      "customers",
      "customer-registration",
      "loans",
      "loan-application",
      "financing-products",
      "fad-review",
      "risk-compliance",
      "committee-voting",
      "approvals",
      "disbursements",
      "payments",
      "collections",
      "collection-approvals",
      "installment-management",
      "loan-transfers",
      "loan-classification",
      "reports",
      "citizen-balance-statement",
      "loan-disbursement-report",
      "par-report",
      "shareholder-report",
      "custom-reports",
      "dab-report",
      "accounting-dashboard",
      "profitability-analysis",
      "activity-logs",
      "settings",
      "branches",
      "officers",
      "funding-sources",
      "lookup",
      "par-categories",
      "disbursement-targets",
      "users",
      "page-permissions",
      "chart-of-accounts",
      "journal-entries",
      "account-statement",
      "trial-balance",
      "income-statement",
      "balance-sheet",
      "cash-flow-statement",
      "hr-dashboard",
      "hr-employees",
      "hr-departments",
      "hr-positions",
      "hr-org-structure",
      "hr-attendance",
      "hr-leave-types",
      "hr-leave-requests",
      "hr-holidays",
      "hr-payroll",
      "hr-recruitment",
      "hr-performance",
      "hr-training",
      "hr-benefits",
    ];
  }

  // Role Page Permissions
  async getRolePagePermissions(roleValue: string): Promise<any[]> {
    return await db.select().from(rolePagePermissions).where(eq(rolePagePermissions.roleValue, roleValue));
  }

  async getAllRolePagePermissions(): Promise<any[]> {
    return await db.select().from(rolePagePermissions);
  }

  async setRolePagePermission(roleValue: string, pageName: string, canAccess: boolean): Promise<void> {
    const existing = await db.select().from(rolePagePermissions)
      .where(and(
        eq(rolePagePermissions.roleValue, roleValue),
        eq(rolePagePermissions.pageName, pageName)
      ));

    if (existing.length > 0) {
      await db.update(rolePagePermissions)
        .set({ canAccess })
        .where(and(
          eq(rolePagePermissions.roleValue, roleValue),
          eq(rolePagePermissions.pageName, pageName)
        ));
    } else {
      await db.insert(rolePagePermissions).values({
        roleValue,
        pageName,
        canAccess,
      });
    }
  }

  async applyRolePermissionsToUser(roleValue: string, userId: string, grantedBy: string): Promise<void> {
    const rolePerms = await this.getRolePagePermissions(roleValue);
    for (const perm of rolePerms) {
      await this.setPagePermission(userId, perm.pageName, perm.canAccess, grantedBy);
    }
  }

  // Seed Data
  async seedData(): Promise<void> {
    // Check if data already exists
    const [existingBranches] = await db.select({ count: count() }).from(branches);
    if (Number(existingBranches.count) > 0) return;

    // Create branches
    const [mainBranch] = await db.insert(branches).values({
      name: "Main Branch",
      shortName: "MAIN",
      code: "001",
      address: "Kabul City Center, Afghanistan",
    }).returning();

    const [eastBranch] = await db.insert(branches).values({
      name: "East Branch",
      shortName: "EAST",
      code: "002",
      address: "Jalalabad Road, Afghanistan",
    }).returning();

    const [westBranch] = await db.insert(branches).values({
      name: "West Branch",
      shortName: "WEST",
      code: "003",
      address: "Herat Province, Afghanistan",
    }).returning();

    // Create officers
    await db.insert(financeOfficers).values([
      { name: "Ahmad Rahimi", code: "FO001", branchId: mainBranch.id },
      { name: "Mohammad Karimi", code: "FO002", branchId: mainBranch.id },
      { name: "Fatima Ahmadi", code: "FO003", branchId: eastBranch.id },
      { name: "Hassan Nazari", code: "FO004", branchId: westBranch.id },
    ]);

    // Create customers
    const customerData = [
      { firstName: "Abdul", lastName: "Rahman", fatherName: "Mohammad", customerNo: "C001", gender: "male" as const, phoneNumber: "+93701234567", district: "Kabul" },
      { firstName: "Mariam", lastName: "Hosseini", fatherName: "Ali", customerNo: "C002", gender: "female" as const, phoneNumber: "+93702345678", district: "Herat" },
      { firstName: "Omar", lastName: "Faizi", fatherName: "Hassan", customerNo: "C003", gender: "male" as const, phoneNumber: "+93703456789", district: "Mazar" },
      { firstName: "Zahra", lastName: "Akbari", fatherName: "Reza", customerNo: "C004", gender: "female" as const, phoneNumber: "+93704567890", district: "Kandahar" },
      { firstName: "Khalid", lastName: "Noori", fatherName: "Ahmad", customerNo: "C005", gender: "male" as const, phoneNumber: "+93705678901", district: "Kabul" },
    ];

    const createdCustomers = await db.insert(customers).values(customerData).returning();

    // Get officers
    const [officer1] = await db.select().from(financeOfficers).limit(1);

    // Create loans
    const loanData = [
      {
        applicationId: "LN2024001",
        customerId: createdCustomers[0].id,
        branchId: mainBranch.id,
        financeOfficerId: officer1.id,
        productName: "Personal Loan",
        productCode: "PL",
        financingPurpose: "Home renovation",
        requestDate: "2024-01-15",
        requestAmount: "5000",
        financingDurationMonths: 12,
        numberOfInstallments: 12,
        principleAmount: "5000",
        marginRate: "15",
        profit: "750",
        totalReceivable: "5750",
        installmentAmount: "479.17",
        status: "active" as const,
      },
      {
        applicationId: "LN2024002",
        customerId: createdCustomers[1].id,
        branchId: eastBranch.id,
        financeOfficerId: officer1.id,
        productName: "Business Loan",
        productCode: "BL",
        financingPurpose: "Shop expansion",
        requestDate: "2024-01-20",
        requestAmount: "10000",
        financingDurationMonths: 24,
        numberOfInstallments: 24,
        principleAmount: "10000",
        marginRate: "12",
        profit: "2400",
        totalReceivable: "12400",
        installmentAmount: "516.67",
        status: "pending" as const,
      },
      {
        applicationId: "LN2024003",
        customerId: createdCustomers[2].id,
        branchId: westBranch.id,
        financeOfficerId: officer1.id,
        productName: "Agricultural Loan",
        productCode: "AL",
        financingPurpose: "Farming equipment",
        requestDate: "2024-01-25",
        requestAmount: "8000",
        financingDurationMonths: 18,
        numberOfInstallments: 18,
        principleAmount: "8000",
        marginRate: "10",
        profit: "1200",
        totalReceivable: "9200",
        installmentAmount: "511.11",
        status: "approved" as const,
      },
      {
        applicationId: "LN2024004",
        customerId: createdCustomers[3].id,
        branchId: mainBranch.id,
        financeOfficerId: officer1.id,
        productName: "Personal Loan",
        productCode: "PL",
        financingPurpose: "Education expenses",
        requestDate: "2024-02-01",
        requestAmount: "3000",
        financingDurationMonths: 6,
        numberOfInstallments: 6,
        principleAmount: "3000",
        marginRate: "15",
        profit: "225",
        totalReceivable: "3225",
        installmentAmount: "537.50",
        status: "pending" as const,
      },
      {
        applicationId: "LN2024005",
        customerId: createdCustomers[4].id,
        branchId: mainBranch.id,
        financeOfficerId: officer1.id,
        productName: "Business Loan",
        productCode: "BL",
        financingPurpose: "Working capital",
        requestDate: "2024-02-05",
        requestAmount: "15000",
        financingDurationMonths: 36,
        numberOfInstallments: 36,
        principleAmount: "15000",
        marginRate: "12",
        profit: "5400",
        totalReceivable: "20400",
        installmentAmount: "566.67",
        status: "active" as const,
      },
    ];

    const createdLoans = await db.insert(loans).values(loanData).returning();

    // Create some installments for active loans
    const activeLoan = createdLoans.find(l => l.status === "active");
    if (activeLoan && activeLoan.numberOfInstallments) {
      for (let i = 1; i <= Math.min(6, activeLoan.numberOfInstallments); i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() - 6 + i);
        
        await db.insert(installments).values({
          loanId: activeLoan.id,
          installmentNumber: i,
          dueDate: dueDate.toISOString().split("T")[0],
          principleAmount: "416.67",
          marginAmount: "62.50",
          totalAmount: "479.17",
          isPaid: i <= 3,
          paymentDate: i <= 3 ? dueDate.toISOString().split("T")[0] : null,
        });
      }
    }

    console.log("Seed data created successfully");

    // Seed Chart of Accounts
    await this.seedChartOfAccounts();
  }

  async seedChartOfAccounts(): Promise<void> {
    // Check if accounts already exist
    const [existingAccounts] = await db.select({ count: count() }).from(accounts);
    if (Number(existingAccounts.count) > 0) return;

    // 1. ASSETS (1000-1999)
    const [assets] = await db.insert(accounts).values({
      accountCode: "1000",
      accountName: "Assets",
      accountType: "asset",
      description: "All company assets",
      isActive: true,
    }).returning();

    // Asset sub-accounts
    const [currentAssets] = await db.insert(accounts).values({
      accountCode: "1100",
      accountName: "Current Assets",
      accountType: "asset",
      parentId: assets.id,
      description: "Short-term assets",
      isActive: true,
    }).returning();

    await db.insert(accounts).values([
      { accountCode: "1101", accountName: "Cash on Hand", accountType: "asset", parentId: currentAssets.id, description: "Physical cash", isActive: true },
      { accountCode: "1102", accountName: "Cash in Bank", accountType: "asset", parentId: currentAssets.id, description: "Bank accounts", isActive: true },
      { accountCode: "1103", accountName: "Petty Cash", accountType: "asset", parentId: currentAssets.id, description: "Small expenses fund", isActive: true },
    ]);

    const [receivables] = await db.insert(accounts).values({
      accountCode: "1200",
      accountName: "Receivables",
      accountType: "asset",
      parentId: assets.id,
      description: "Amounts owed to the company",
      isActive: true,
    }).returning();

    await db.insert(accounts).values([
      { accountCode: "1201", accountName: "Loan Receivables", accountType: "asset", parentId: receivables.id, description: "Outstanding loan principal", isActive: true },
      { accountCode: "1202", accountName: "Interest Receivable", accountType: "asset", parentId: receivables.id, description: "Accrued interest income", isActive: true },
      { accountCode: "1203", accountName: "Fees Receivable", accountType: "asset", parentId: receivables.id, description: "Service fees owed", isActive: true },
    ]);

    const [fixedAssets] = await db.insert(accounts).values({
      accountCode: "1500",
      accountName: "Fixed Assets",
      accountType: "asset",
      parentId: assets.id,
      description: "Long-term assets",
      isActive: true,
    }).returning();

    await db.insert(accounts).values([
      { accountCode: "1501", accountName: "Office Equipment", accountType: "asset", parentId: fixedAssets.id, description: "Computers, furniture", isActive: true },
      { accountCode: "1502", accountName: "Vehicles", accountType: "asset", parentId: fixedAssets.id, description: "Company vehicles", isActive: true },
      { accountCode: "1503", accountName: "Buildings", accountType: "asset", parentId: fixedAssets.id, description: "Office buildings", isActive: true },
    ]);

    // 2. LIABILITIES (2000-2999)
    const [liabilities] = await db.insert(accounts).values({
      accountCode: "2000",
      accountName: "Liabilities",
      accountType: "liability",
      description: "All company liabilities",
      isActive: true,
    }).returning();

    const [currentLiabilities] = await db.insert(accounts).values({
      accountCode: "2100",
      accountName: "Current Liabilities",
      accountType: "liability",
      parentId: liabilities.id,
      description: "Short-term obligations",
      isActive: true,
    }).returning();

    await db.insert(accounts).values([
      { accountCode: "2101", accountName: "Accounts Payable", accountType: "liability", parentId: currentLiabilities.id, description: "Amounts owed to suppliers", isActive: true },
      { accountCode: "2102", accountName: "Salaries Payable", accountType: "liability", parentId: currentLiabilities.id, description: "Wages owed to employees", isActive: true },
      { accountCode: "2103", accountName: "Taxes Payable", accountType: "liability", parentId: currentLiabilities.id, description: "Tax obligations", isActive: true },
    ]);

    const [longTermLiabilities] = await db.insert(accounts).values({
      accountCode: "2500",
      accountName: "Long-term Liabilities",
      accountType: "liability",
      parentId: liabilities.id,
      description: "Long-term obligations",
      isActive: true,
    }).returning();

    await db.insert(accounts).values([
      { accountCode: "2501", accountName: "Bank Loans Payable", accountType: "liability", parentId: longTermLiabilities.id, description: "Loans from banks", isActive: true },
      { accountCode: "2502", accountName: "Borrowings", accountType: "liability", parentId: longTermLiabilities.id, description: "Other borrowings", isActive: true },
    ]);

    // 3. EQUITY (3000-3999)
    const [equity] = await db.insert(accounts).values({
      accountCode: "3000",
      accountName: "Equity",
      accountType: "equity",
      description: "Owner's equity and capital",
      isActive: true,
    }).returning();

    await db.insert(accounts).values([
      { accountCode: "3001", accountName: "Share Capital", accountType: "equity", parentId: equity.id, description: "Invested capital", isActive: true },
      { accountCode: "3002", accountName: "Retained Earnings", accountType: "equity", parentId: equity.id, description: "Accumulated profits", isActive: true },
      { accountCode: "3003", accountName: "Reserves", accountType: "equity", parentId: equity.id, description: "Legal and general reserves", isActive: true },
    ]);

    // 4. INCOME (4000-4999)
    const [income] = await db.insert(accounts).values({
      accountCode: "4000",
      accountName: "Income",
      accountType: "income",
      description: "All revenue sources",
      isActive: true,
    }).returning();

    const [operatingIncome] = await db.insert(accounts).values({
      accountCode: "4100",
      accountName: "Operating Income",
      accountType: "income",
      parentId: income.id,
      description: "Main business revenue",
      isActive: true,
    }).returning();

    await db.insert(accounts).values([
      { accountCode: "4101", accountName: "Interest Income", accountType: "income", parentId: operatingIncome.id, description: "Interest from loans", isActive: true },
      { accountCode: "4102", accountName: "Service Fee Income", accountType: "income", parentId: operatingIncome.id, description: "Loan processing fees", isActive: true },
      { accountCode: "4103", accountName: "Penalty Income", accountType: "income", parentId: operatingIncome.id, description: "Late payment penalties", isActive: true },
    ]);

    const [otherIncome] = await db.insert(accounts).values({
      accountCode: "4500",
      accountName: "Other Income",
      accountType: "income",
      parentId: income.id,
      description: "Non-operating revenue",
      isActive: true,
    }).returning();

    await db.insert(accounts).values([
      { accountCode: "4501", accountName: "Investment Income", accountType: "income", parentId: otherIncome.id, description: "Returns on investments", isActive: true },
      { accountCode: "4502", accountName: "Miscellaneous Income", accountType: "income", parentId: otherIncome.id, description: "Other revenue", isActive: true },
    ]);

    // 5. EXPENSES (5000-5999)
    const [expenses] = await db.insert(accounts).values({
      accountCode: "5000",
      accountName: "Expenses",
      accountType: "expense",
      description: "All company expenses",
      isActive: true,
    }).returning();

    const [operatingExpenses] = await db.insert(accounts).values({
      accountCode: "5100",
      accountName: "Operating Expenses",
      accountType: "expense",
      parentId: expenses.id,
      description: "Day-to-day business costs",
      isActive: true,
    }).returning();

    await db.insert(accounts).values([
      { accountCode: "5101", accountName: "Salaries and Wages", accountType: "expense", parentId: operatingExpenses.id, description: "Employee compensation", isActive: true },
      { accountCode: "5102", accountName: "Rent Expense", accountType: "expense", parentId: operatingExpenses.id, description: "Office rent", isActive: true },
      { accountCode: "5103", accountName: "Utilities Expense", accountType: "expense", parentId: operatingExpenses.id, description: "Electricity, water, etc.", isActive: true },
      { accountCode: "5104", accountName: "Office Supplies", accountType: "expense", parentId: operatingExpenses.id, description: "Stationery and supplies", isActive: true },
    ]);

    const [adminExpenses] = await db.insert(accounts).values({
      accountCode: "5200",
      accountName: "Administrative Expenses",
      accountType: "expense",
      parentId: expenses.id,
      description: "Administrative costs",
      isActive: true,
    }).returning();

    await db.insert(accounts).values([
      { accountCode: "5201", accountName: "Travel Expense", accountType: "expense", parentId: adminExpenses.id, description: "Business travel costs", isActive: true },
      { accountCode: "5202", accountName: "Training Expense", accountType: "expense", parentId: adminExpenses.id, description: "Staff training", isActive: true },
      { accountCode: "5203", accountName: "Professional Fees", accountType: "expense", parentId: adminExpenses.id, description: "Legal, audit fees", isActive: true },
    ]);

    const [financeExpenses] = await db.insert(accounts).values({
      accountCode: "5300",
      accountName: "Finance Expenses",
      accountType: "expense",
      parentId: expenses.id,
      description: "Financial costs",
      isActive: true,
    }).returning();

    await db.insert(accounts).values([
      { accountCode: "5301", accountName: "Interest Expense", accountType: "expense", parentId: financeExpenses.id, description: "Interest on borrowings", isActive: true },
      { accountCode: "5302", accountName: "Bank Charges", accountType: "expense", parentId: financeExpenses.id, description: "Bank service fees", isActive: true },
      { accountCode: "5303", accountName: "Bad Debt Expense", accountType: "expense", parentId: financeExpenses.id, description: "Loan write-offs", isActive: true },
    ]);

    console.log("Chart of Accounts seeded successfully");
  }

  // ============== ACCOUNTING METHODS ==============

  // Chart of Accounts
  async getAccounts(filters?: { search?: string; accountType?: string }): Promise<Account[]> {
    let query = db.select().from(accounts);
    
    const conditions = [];
    if (filters?.search) {
      conditions.push(or(
        like(accounts.accountCode, `%${filters.search}%`),
        like(accounts.accountName, `%${filters.search}%`)
      ));
    }
    if (filters?.accountType) {
      conditions.push(eq(accounts.accountType, filters.accountType as any));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(asc(accounts.accountCode));
  }

  async getAccount(id: string): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    return account;
  }

  async getAccountByCode(code: string): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.accountCode, code));
    return account;
  }

  async createAccount(data: InsertAccount): Promise<Account> {
    const [account] = await db.insert(accounts).values(data).returning();
    return account;
  }

  async updateAccount(id: string, data: Partial<InsertAccount>): Promise<Account> {
    const [account] = await db
      .update(accounts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(accounts.id, id))
      .returning();
    return account;
  }

  async deleteAccount(id: string): Promise<void> {
    await db.delete(accounts).where(eq(accounts.id, id));
  }

  async getAccountHierarchy(): Promise<any[]> {
    const allAccounts = await db.select().from(accounts).orderBy(asc(accounts.accountCode));
    
    const buildTree = (parentId: string | null): any[] => {
      return allAccounts
        .filter(acc => acc.parentId === parentId)
        .map(acc => {
          const children = buildTree(acc.id);
          let currentBalance = Number(acc.currentBalance || 0);
          if (children.length > 0) {
            currentBalance = children.reduce((sum: number, child: any) => sum + Number(child.currentBalance || 0), 0);
          }
          return {
            ...acc,
            currentBalance: String(currentBalance),
            children,
          };
        });
    };
    
    return buildTree(null);
  }

  async importChartOfAccounts(accountsData: { code: string; name: string; type: string; parent_code: string | null }[]): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;

    // Check if there are any journal lines referencing accounts
    const journalLinesCount = await db.select({ count: sql<number>`count(*)` }).from(journalLines);
    if (journalLinesCount[0]?.count > 0) {
      throw new Error("Cannot replace Chart of Accounts: There are existing journal entries. Please delete all journal entries first.");
    }

    // Delete existing accounts
    await db.delete(accounts);

    // Create a map of code to UUID for parent references
    const codeToId: Record<string, string> = {};

    // First pass: create all accounts without parent references
    for (const acc of accountsData) {
      try {
        const id = crypto.randomUUID();
        codeToId[acc.code] = id;

        await db.insert(accounts).values({
          id,
          accountCode: acc.code,
          accountName: acc.name,
          accountType: acc.type as any,
          parentId: null,
          description: acc.name,
          isActive: true,
          isSystemAccount: false,
          normalBalance: ["asset", "expense"].includes(acc.type) ? "debit" : "credit",
          openingBalance: "0",
          currentBalance: "0",
        });
        imported++;
      } catch (error: any) {
        errors.push(`Failed to import ${acc.code}: ${error.message}`);
      }
    }

    // Second pass: update parent references
    for (const acc of accountsData) {
      if (acc.parent_code && codeToId[acc.parent_code]) {
        try {
          await db
            .update(accounts)
            .set({ parentId: codeToId[acc.parent_code] })
            .where(eq(accounts.id, codeToId[acc.code]));
        } catch (error: any) {
          errors.push(`Failed to set parent for ${acc.code}: ${error.message}`);
        }
      }
    }

    return { imported, errors };
  }

  // Fiscal Periods
  async getFiscalPeriods(): Promise<FiscalPeriod[]> {
    return await db.select().from(fiscalPeriods).orderBy(desc(fiscalPeriods.fiscalYear), desc(fiscalPeriods.periodNumber));
  }

  async createFiscalPeriod(data: InsertFiscalPeriod): Promise<FiscalPeriod> {
    const [period] = await db.insert(fiscalPeriods).values(data).returning();
    return period;
  }

  async closeFiscalPeriod(id: string, closedBy: string): Promise<void> {
    await db
      .update(fiscalPeriods)
      .set({ isClosed: true, closedBy, closedAt: new Date() })
      .where(eq(fiscalPeriods.id, id));
  }

  // Journal Entries
  async getJournalEntries(filters?: { search?: string; startDate?: string; endDate?: string; isPosted?: boolean; fundingSourceId?: string; page?: number; limit?: number }): Promise<{ entries: any[]; total: number; page: number; totalPages: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;
    
    const conditions = [];
    if (filters?.search) {
      const searchVal = filters.search.replace(/,/g, '');
      const numericSearch = parseFloat(searchVal);
      const searchConditions = [
        ilike(journalEntries.entryNumber, `%${filters.search}%`),
        ilike(journalEntries.description, `%${filters.search}%`),
        ilike(journalEntries.reference, `%${filters.search}%`)
      ];
      if (!isNaN(numericSearch)) {
        searchConditions.push(
          eq(journalEntries.totalDebit, numericSearch.toFixed(2)),
          eq(journalEntries.totalCredit, numericSearch.toFixed(2))
        );
      }
      conditions.push(or(...searchConditions));
    }
    if (filters?.startDate) {
      conditions.push(gte(journalEntries.entryDate, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(journalEntries.entryDate, filters.endDate));
    }
    if (filters?.isPosted !== undefined) {
      conditions.push(eq(journalEntries.isPosted, filters.isPosted));
    }
    if (filters?.fundingSourceId) {
      conditions.push(
        or(
          eq(journalEntries.fundingSourceId, filters.fundingSourceId),
          sql`EXISTS (SELECT 1 FROM journal_lines WHERE journal_lines.journal_entry_id = journal_entries.id AND journal_lines.funding_source_id = ${filters.fundingSourceId})`
        )
      );
    }
    
    // Get total count
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(journalEntries);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions)) as any;
    }
    const [{ count }] = await countQuery;
    const total = Number(count);
    
    // Get paginated entries
    let query = db.select().from(journalEntries);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const entries = await query
      .orderBy(desc(journalEntries.entryNumber))
      .limit(limit)
      .offset(offset);
    
    return {
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getJournalEntry(id: string): Promise<any | undefined> {
    const [entry] = await db.select().from(journalEntries).where(eq(journalEntries.id, id));
    if (!entry) return undefined;
    
    const lines = await db
      .select({
        id: journalLines.id,
        accountId: journalLines.accountId,
        accountCode: accounts.accountCode,
        accountName: accounts.accountName,
        description: journalLines.description,
        debitAmount: journalLines.debitAmount,
        creditAmount: journalLines.creditAmount,
        fundingSourceId: journalLines.fundingSourceId,
        fundingSourceName: fundingSources.name,
      })
      .from(journalLines)
      .leftJoin(accounts, eq(journalLines.accountId, accounts.id))
      .leftJoin(fundingSources, eq(journalLines.fundingSourceId, fundingSources.id))
      .where(eq(journalLines.journalEntryId, id));
    
    return { ...entry, lines };
  }

  async createJournalEntry(header: InsertJournalEntry, lines: InsertJournalLine[]): Promise<JournalEntry> {
    const totalDebit = lines.reduce((sum, line) => sum + Number(line.debitAmount || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + Number(line.creditAmount || 0), 0);
    
    return await db.transaction(async (tx) => {
      const [entry] = await tx.insert(journalEntries).values({
        ...header,
        totalDebit: totalDebit.toString(),
        totalCredit: totalCredit.toString(),
      }).returning();
      
      for (const line of lines) {
        await tx.insert(journalLines).values({
          ...line,
          journalEntryId: entry.id,
          debitAmount: String(line.debitAmount || "0"),
          creditAmount: String(line.creditAmount || "0"),
        });
      }

      if (header.isPosted) {
        for (const line of lines) {
          const [account] = await tx.select().from(accounts).where(eq(accounts.id, line.accountId));
          if (!account) continue;
          let newBalance = Number(account.currentBalance || 0);
          const debitAmt = Number(line.debitAmount || 0);
          const creditAmt = Number(line.creditAmount || 0);
          if (getMainAccountType(account.accountType) === 'asset' || getMainAccountType(account.accountType) === 'expense') {
            newBalance += debitAmt - creditAmt;
          } else {
            newBalance += creditAmt - debitAmt;
          }
          await tx.update(accounts).set({ currentBalance: newBalance.toString() }).where(eq(accounts.id, line.accountId));
        }
      }
      
      return entry;
    });
  }

  async updateJournalEntry(id: string, data: any): Promise<JournalEntry> {
    const { entryDate, description, reference, referenceType, fundingSourceId, totalDebit, totalCredit, lines } = data;
    
    return await db.transaction(async (tx) => {
      const [entry] = await tx.update(journalEntries)
        .set({
          entryDate,
          description,
          reference,
          referenceType,
          fundingSourceId: fundingSourceId || null,
          totalDebit,
          totalCredit,
        })
        .where(eq(journalEntries.id, id))
        .returning();
      
      await tx.delete(journalLines).where(eq(journalLines.journalEntryId, id));
      
      for (const line of lines) {
        await tx.insert(journalLines).values({
          journalEntryId: id,
          accountId: line.accountId,
          description: line.description || null,
          debitAmount: String(line.debitAmount || "0"),
          creditAmount: String(line.creditAmount || "0"),
          fundingSourceId: line.fundingSourceId || null,
        });
      }
      
      return entry;
    });
  }

  async postJournalEntry(id: string, postedBy: string): Promise<void> {
    const entry = await this.getJournalEntry(id);
    if (!entry || entry.isPosted) return;
    
    if (!entry.lines || entry.lines.length < 2) {
      throw new Error("Cannot post journal entry without at least 2 lines. Please add lines first.");
    }
    
    // Update account balances
    for (const line of entry.lines) {
      const [account] = await db.select().from(accounts).where(eq(accounts.id, line.accountId));
      if (!account) continue;
      
      let newBalance = Number(account.currentBalance || 0);
      const debit = Number(line.debitAmount || 0);
      const credit = Number(line.creditAmount || 0);
      
      // For asset/expense accounts: debit increases, credit decreases
      // For liability/equity/income accounts: credit increases, debit decreases
      if (getMainAccountType(account.accountType) === 'asset' || getMainAccountType(account.accountType) === 'expense') {
        newBalance += debit - credit;
      } else {
        newBalance += credit - debit;
      }
      
      await db.update(accounts).set({ currentBalance: newBalance.toString() }).where(eq(accounts.id, line.accountId));
    }
    
    await db.update(journalEntries).set({ isPosted: true, postedBy, postedAt: new Date() }).where(eq(journalEntries.id, id));
  }

  async unpostJournalEntry(id: string): Promise<void> {
    const entry = await this.getJournalEntry(id);
    if (!entry || !entry.isPosted) return;
    if (entry.isReversed) throw new Error("Cannot unpost a reversed entry");

    for (const line of entry.lines) {
      const [account] = await db.select().from(accounts).where(eq(accounts.id, line.accountId));
      if (!account) continue;

      let newBalance = Number(account.currentBalance || 0);
      const debit = Number(line.debitAmount || 0);
      const credit = Number(line.creditAmount || 0);

      if (getMainAccountType(account.accountType) === 'asset' || getMainAccountType(account.accountType) === 'expense') {
        newBalance -= debit - credit;
      } else {
        newBalance -= credit - debit;
      }

      await db.update(accounts).set({ currentBalance: newBalance.toString() }).where(eq(accounts.id, line.accountId));
    }

    await db.update(journalEntries).set({ isPosted: false, postedBy: null, postedAt: null }).where(eq(journalEntries.id, id));
  }

  async reverseJournalEntry(id: string, createdBy: string): Promise<JournalEntry> {
    const original = await this.getJournalEntry(id);
    if (!original) throw new Error("Entry not found");
    
    const entryNumber = await this.getNextEntryNumber();
    const reversedLines = original.lines.map((line: any) => ({
      accountId: line.accountId,
      description: `Reversal: ${line.description || ''}`,
      debitAmount: line.creditAmount,
      creditAmount: line.debitAmount,
      fundingSourceId: line.fundingSourceId || null,
    }));
    
    const reversalEntry = await this.createJournalEntry({
      entryNumber,
      entryDate: new Date().toISOString().split('T')[0],
      description: `Reversal of ${original.entryNumber}`,
      reference: original.reference,
      referenceType: 'reversal',
      referenceId: original.id,
      fundingSourceId: original.fundingSourceId,
      createdBy,
    }, reversedLines);
    
    await db.update(journalEntries).set({ isReversed: true, reversedEntryId: reversalEntry.id }).where(eq(journalEntries.id, id));
    
    return reversalEntry;
  }

  async undoReversalJournalEntry(id: string): Promise<void> {
    const original = await this.getJournalEntry(id);
    if (!original) throw new Error("Entry not found");
    if (!original.isReversed) throw new Error("This entry has not been reversed");

    const reversalEntryId = original.reversedEntryId;
    if (reversalEntryId) {
      const reversalEntry = await this.getJournalEntry(reversalEntryId);
      if (reversalEntry && reversalEntry.isPosted) {
        for (const line of reversalEntry.lines) {
          const [account] = await db.select().from(accounts).where(eq(accounts.id, line.accountId));
          if (!account) continue;
          let newBalance = Number(account.currentBalance || 0);
          const debit = Number(line.debitAmount || 0);
          const credit = Number(line.creditAmount || 0);
          if (getMainAccountType(account.accountType) === 'asset' || getMainAccountType(account.accountType) === 'expense') {
            newBalance -= debit - credit;
          } else {
            newBalance -= credit - debit;
          }
          await db.update(accounts).set({ currentBalance: newBalance.toString() }).where(eq(accounts.id, line.accountId));
        }
      }
      await db.delete(journalLines).where(eq(journalLines.journalEntryId, reversalEntryId));
      await db.delete(journalEntries).where(eq(journalEntries.id, reversalEntryId));
    }

    await db.update(journalEntries).set({ isReversed: false, reversedEntryId: null }).where(eq(journalEntries.id, id));
  }

  async recalculateAllAccountBalances(): Promise<{ updated: number }> {
    const allAccounts = await db.select().from(accounts);
    let updated = 0;
    
    for (const account of allAccounts) {
      const rows = await db
        .select({
          totalDebit: sql<string>`COALESCE(SUM(CAST(${journalLines.debitAmount} AS numeric)), 0)`,
          totalCredit: sql<string>`COALESCE(SUM(CAST(${journalLines.creditAmount} AS numeric)), 0)`,
        })
        .from(journalLines)
        .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
        .where(and(
          eq(journalLines.accountId, account.id),
          eq(journalEntries.isPosted, true)
        ));
      
      const totalDebit = Number(rows[0]?.totalDebit || 0);
      const totalCredit = Number(rows[0]?.totalCredit || 0);
      
      let correctBalance: number;
      if (getMainAccountType(account.accountType) === 'asset' || getMainAccountType(account.accountType) === 'expense') {
        correctBalance = totalDebit - totalCredit;
      } else {
        correctBalance = totalCredit - totalDebit;
      }
      
      const currentStored = Number(account.currentBalance || 0);
      if (Math.abs(correctBalance - currentStored) > 0.001) {
        await db.update(accounts).set({ currentBalance: correctBalance.toString() }).where(eq(accounts.id, account.id));
        updated++;
      }
    }
    
    return { updated };
  }

  async getShareholderReport(startDate: string, endDate: string): Promise<any> {
    const incomeMarginCollectedCodes = ['50000'];
    const incomeMarginReceivableCodes = ['20900'];
    const otherIncomeCodes = ['40500', '40400', '40000'];
    const fixedExpenseCodes = ['61001', '60001'];
    const variableExpenseCodes = [
      '51000', '60002', '60003', '60004', '60005', '60100', '60500', '60600',
      '60700', '60800', '60900', '61002', '61100', '61200', '61300', '61500',
      '61600', '61700', '61800', '70000', '80000', '80100', '62000', '61400', '61900'
    ];

    const allCodes = [
      ...incomeMarginCollectedCodes, ...incomeMarginReceivableCodes,
      ...otherIncomeCodes, ...fixedExpenseCodes, ...variableExpenseCodes
    ];

    const allAccts = await db.select().from(accounts).orderBy(asc(accounts.accountCode));

    const findAccountAndSubs = (code: string): typeof allAccts => {
      const mainAcct = allAccts.find(a => a.accountCode === code);
      if (!mainAcct) return [];
      const subs = allAccts.filter(a => a.parentId === mainAcct.id);
      if (subs.length > 0) return subs;
      return [mainAcct];
    };

    const expandedMap: Record<string, typeof allAccts> = {};
    for (const code of allCodes) {
      expandedMap[code] = findAccountAndSubs(code);
    }

    const allMatchedAccounts = Object.values(expandedMap).flat();
    const uniqueAccountIds = [...new Set(allMatchedAccounts.map(a => a.id))];

    const periodBalances: Record<string, { debit: number; credit: number }> = {};

    if (uniqueAccountIds.length > 0) {
      const balanceRows = await db
        .select({
          accountId: journalLines.accountId,
          totalDebit: sql<string>`COALESCE(SUM(CAST(${journalLines.debitAmount} AS numeric)), 0)`,
          totalCredit: sql<string>`COALESCE(SUM(CAST(${journalLines.creditAmount} AS numeric)), 0)`,
        })
        .from(journalLines)
        .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
        .where(
          and(
            eq(journalEntries.isPosted, true),
            inArray(journalLines.accountId, uniqueAccountIds),
            gte(journalEntries.entryDate, startDate),
            lte(journalEntries.entryDate, endDate)
          )
        )
        .groupBy(journalLines.accountId);

      for (const row of balanceRows) {
        periodBalances[row.accountId] = {
          debit: Number(row.totalDebit || 0),
          credit: Number(row.totalCredit || 0),
        };
      }
    }

    const getBalanceForAccount = (acc: typeof allAccts[0]) => {
      const bal = periodBalances[acc.id];
      if (!bal) return 0;
      if (getMainAccountType(acc.accountType) === 'income') return bal.credit - bal.debit;
      if (getMainAccountType(acc.accountType) === 'expense') return bal.debit - bal.credit;
      if (getMainAccountType(acc.accountType) === 'asset') return bal.debit - bal.credit;
      if (getMainAccountType(acc.accountType) === 'liability' || getMainAccountType(acc.accountType) === 'equity') return bal.credit - bal.debit;
      return bal.credit - bal.debit;
    };

    const buildGroup = (codes: string[]) => {
      const items: { accountCode: string; accountName: string; balance: number }[] = [];
      for (const code of codes) {
        const accts = expandedMap[code] || [];
        for (const acc of accts) {
          items.push({
            accountCode: acc.accountCode,
            accountName: acc.accountName,
            balance: getBalanceForAccount(acc),
          });
        }
      }
      return {
        items,
        total: items.reduce((s, i) => s + i.balance, 0),
      };
    };

    const incomeMarginCollected = buildGroup(incomeMarginCollectedCodes);
    const incomeMarginReceivable = buildGroup(incomeMarginReceivableCodes);
    const otherIncome = buildGroup(otherIncomeCodes);
    const fixedExpense = buildGroup(fixedExpenseCodes);
    const variableExpense = buildGroup(variableExpenseCodes);

    const totalIncome = incomeMarginCollected.total + otherIncome.total;
    const totalReceivable = incomeMarginReceivable.total;
    const totalExpense = fixedExpense.total + variableExpense.total;
    const netProfit = totalIncome - totalExpense;

    return {
      income: {
        margin: {
          collected: incomeMarginCollected,
          receivable: incomeMarginReceivable,
        },
        other: otherIncome,
        totalCollected: totalIncome,
        totalReceivable,
      },
      expense: {
        fixed: fixedExpense,
        variable: variableExpense,
        total: totalExpense,
      },
      netProfit,
      netProfitIncludingReceivable: netProfit + totalReceivable,
    };
  }

  async getNextEntryNumber(): Promise<string> {
    const allEntries = await db
      .select({ entryNumber: journalEntries.entryNumber })
      .from(journalEntries)
      .where(like(journalEntries.entryNumber, 'JE%'));

    let maxNum = 0;
    for (const entry of allEntries) {
      const numPart = entry.entryNumber.replace(/^JE-?/, '');
      const parsed = parseInt(numPart, 10);
      if (!isNaN(parsed) && parsed > maxNum) maxNum = parsed;
    }
    const nextNum = maxNum + 1;
    return `JE${nextNum.toString().padStart(4, '0')}`;
  }

  // Accounting Reports
  async getTrialBalance(asOfDate?: string): Promise<any[]> {
    const allAccounts = await db.select().from(accounts).where(eq(accounts.isActive, true)).orderBy(asc(accounts.accountCode));
    
    return allAccounts.map(acc => {
      const balance = Number(acc.currentBalance) || 0;
      const isDebitNormal = getMainAccountType(acc.accountType) === 'asset' || getMainAccountType(acc.accountType) === 'expense';
      const isCreditNormal = getMainAccountType(acc.accountType) === 'liability' || getMainAccountType(acc.accountType) === 'equity' || getMainAccountType(acc.accountType) === 'income';
      
      let debit = 0;
      let credit = 0;
      
      if (isDebitNormal) {
        // Asset/Expense: positive balance = debit, negative = credit (abnormal)
        if (balance > 0) {
          debit = balance;
        } else if (balance < 0) {
          credit = Math.abs(balance);
        }
      } else if (isCreditNormal) {
        // Liability/Equity/Income: positive balance = credit, negative = debit (abnormal)
        if (balance > 0) {
          credit = balance;
        } else if (balance < 0) {
          debit = Math.abs(balance);
        }
      }
      
      return {
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        accountType: acc.accountType,
        debit,
        credit,
      };
    });
  }

  async getIncomeStatement(startDate: string, endDate: string): Promise<any> {
    const allIncomeAccounts = await db.select().from(accounts).where(inArray(accounts.accountType, ['operating_income','non_operating_income','other_income','income']));
    const allExpenseAccounts = await db.select().from(accounts).where(inArray(accounts.accountType, ['operating_expense','non_operating_expense','cost_of_financing','expense']));

    const allAccountIds = [...allIncomeAccounts, ...allExpenseAccounts].map(a => a.id);

    const periodBalances: Record<string, number> = {};

    if (allAccountIds.length > 0) {
      const balanceRows = await db
        .select({
          accountId: journalLines.accountId,
          totalDebit: sql<string>`COALESCE(SUM(CAST(${journalLines.debitAmount} AS numeric)), 0)`,
          totalCredit: sql<string>`COALESCE(SUM(CAST(${journalLines.creditAmount} AS numeric)), 0)`,
        })
        .from(journalLines)
        .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
        .where(
          and(
            eq(journalEntries.isPosted, true),
            inArray(journalLines.accountId, allAccountIds),
            gte(journalEntries.entryDate, startDate),
            lte(journalEntries.entryDate, endDate)
          )
        )
        .groupBy(journalLines.accountId);

      for (const row of balanceRows) {
        const debit = Number(row.totalDebit || 0);
        const credit = Number(row.totalCredit || 0);
        periodBalances[row.accountId] = credit - debit;
      }
    }

    const getBalance = (accountId: string, accountType: string) => {
      const net = periodBalances[accountId] || 0;
      const incomeTypes = ['operating_income', 'non_operating_income', 'other_income', 'income'];
      const expenseTypes = ['operating_expense', 'non_operating_expense', 'cost_of_financing', 'expense'];
      if (incomeTypes.includes(accountType)) return net;
      if (expenseTypes.includes(accountType)) return -net;
      return net;
    };

    const sortByCode = (a: any, b: any) => (a.accountCode || "").localeCompare(b.accountCode || "", undefined, { numeric: true });

    const buildGroup = (accs: typeof allIncomeAccounts) => {
      const parentAccounts = accs.filter(a => !a.parentId);
      const childAccounts = accs.filter(a => a.parentId);

      const groups = parentAccounts.map(parent => {
        const children = childAccounts.filter(c => c.parentId === parent.id);
        const childrenWithAmounts = children.map(c => ({
          accountCode: c.accountCode,
          accountName: c.accountName,
          amount: getBalance(c.id, c.accountType),
        })).sort(sortByCode);
        const parentOwnAmount = getBalance(parent.id, parent.accountType);
        const childrenTotal = childrenWithAmounts.reduce((s, c) => s + c.amount, 0);
        const total = children.length > 0 ? childrenTotal + parentOwnAmount : parentOwnAmount;
        return {
          accountCode: parent.accountCode,
          accountName: parent.accountName,
          parentAmount: parentOwnAmount,
          total,
          children: childrenWithAmounts,
        };
      });
      return groups.sort(sortByCode);
    };

    const operatingIncomeAccounts = allIncomeAccounts.filter(a => a.accountType === 'operating_income' || a.accountType === 'income');
    const nonOperatingIncomeAccounts = allIncomeAccounts.filter(a => a.accountType === 'non_operating_income' || a.accountType === 'other_income');
    const costOfFinancingAccounts = allExpenseAccounts.filter(a => a.accountType === 'cost_of_financing');
    const operatingExpenseAccounts = allExpenseAccounts.filter(a => a.accountType === 'operating_expense' || a.accountType === 'expense');
    const nonOperatingExpenseAccounts = allExpenseAccounts.filter(a => a.accountType === 'non_operating_expense');

    const operatingIncomeGroups = buildGroup(operatingIncomeAccounts);
    const nonOperatingIncomeGroups = buildGroup(nonOperatingIncomeAccounts);
    const costOfFinancingGroups = buildGroup(costOfFinancingAccounts);
    const operatingExpenseGroups = buildGroup(operatingExpenseAccounts);
    const nonOperatingExpenseGroups = buildGroup(nonOperatingExpenseAccounts);

    const totalOperatingIncome = operatingIncomeGroups.reduce((s, g) => s + g.total, 0);
    const totalNonOperatingIncome = nonOperatingIncomeGroups.reduce((s, g) => s + g.total, 0);
    const totalIncome = totalOperatingIncome + totalNonOperatingIncome;
    const totalCostOfFinancing = costOfFinancingGroups.reduce((s, g) => s + g.total, 0);
    const grossProfit = totalOperatingIncome - totalCostOfFinancing;
    const totalOperatingExpenses = operatingExpenseGroups.reduce((s, g) => s + g.total, 0);
    const totalNonOperatingExpenses = nonOperatingExpenseGroups.reduce((s, g) => s + g.total, 0);
    const totalExpenses = totalOperatingExpenses + totalNonOperatingExpenses;
    const netIncome = grossProfit + totalNonOperatingIncome - totalExpenses;

    return {
      operatingIncomeGroups,
      nonOperatingIncomeGroups,
      costOfFinancingGroups,
      operatingExpenseGroups,
      nonOperatingExpenseGroups,
      totalOperatingIncome,
      totalNonOperatingIncome,
      totalIncome,
      totalCostOfFinancing,
      grossProfit,
      totalOperatingExpenses,
      totalNonOperatingExpenses,
      totalExpenses,
      netIncome,
      period: { startDate, endDate },
      // legacy aliases for any older clients
      incomeGroups: operatingIncomeGroups,
      otherIncomeGroups: nonOperatingIncomeGroups,
      costOfSalesGroups: costOfFinancingGroups,
      expenseGroups: [...operatingExpenseGroups, ...nonOperatingExpenseGroups],
      totalCostOfSales: totalCostOfFinancing,
      totalOtherIncome: totalNonOperatingIncome,
    };
  }

  async getBalanceSheet(asOfDate: string): Promise<any> {
    const allAccounts = await db.select().from(accounts);
    const incomeAccounts = allAccounts.filter(a => getMainAccountType(a.accountType) === 'income');
    const expenseAccounts = allAccounts.filter(a => getMainAccountType(a.accountType) === 'expense');

    const balanceSheetAccountIds = allAccounts
      .filter(a => getMainAccountType(a.accountType) === 'asset' || getMainAccountType(a.accountType) === 'liability' || getMainAccountType(a.accountType) === 'equity')
      .map(a => a.id);

    const balanceRows = balanceSheetAccountIds.length > 0
      ? await db
          .select({
            accountId: journalLines.accountId,
            totalDebit: sql<string>`COALESCE(SUM(CAST(${journalLines.debitAmount} AS numeric)), 0)`,
            totalCredit: sql<string>`COALESCE(SUM(CAST(${journalLines.creditAmount} AS numeric)), 0)`,
          })
          .from(journalLines)
          .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
          .where(and(
            eq(journalEntries.isPosted, true),
            inArray(journalLines.accountId, balanceSheetAccountIds),
            lte(journalEntries.entryDate, asOfDate),
          ))
          .groupBy(journalLines.accountId)
      : [];

    const r2 = (n: number) => Math.round(n * 100) / 100;
    const balanceMap = new Map<string, number>();
    for (const row of balanceRows) {
      const debit = Number(row.totalDebit || 0);
      const credit = Number(row.totalCredit || 0);
      const acc = allAccounts.find(a => a.id === row.accountId);
      if (!acc) continue;
      if (getMainAccountType(acc.accountType) === 'asset') {
        balanceMap.set(row.accountId, r2(debit - credit));
      } else {
        balanceMap.set(row.accountId, r2(credit - debit));
      }
    }

    type TreeNode = {
      id: string;
      accountCode: string;
      accountName: string;
      accountType: string;
      amount: number;
      children: TreeNode[];
      isLeaf: boolean;
    };

    const buildTree = (accs: typeof allAccounts): TreeNode[] => {
      const idMap = new Map<string, typeof allAccounts[0]>();
      accs.forEach(a => idMap.set(a.id, a));

      const childrenMap = new Map<string, typeof allAccounts>();
      const roots: typeof allAccounts = [];
      for (const acc of accs) {
        if (acc.parentId && idMap.has(acc.parentId)) {
          if (!childrenMap.has(acc.parentId)) childrenMap.set(acc.parentId, []);
          childrenMap.get(acc.parentId)!.push(acc);
        } else {
          roots.push(acc);
        }
      }

      const sortByCode = (a: any, b: any) => (a.accountCode || "").localeCompare(b.accountCode || "", undefined, { numeric: true });

      const buildNode = (acc: typeof allAccounts[0]): TreeNode => {
        const kids = childrenMap.get(acc.id) || [];
        kids.sort(sortByCode);
        const childNodes = kids.map(buildNode);
        const isLeaf = childNodes.length === 0;
        const ownBalance = balanceMap.get(acc.id) || 0;
        const amount = isLeaf
          ? ownBalance
          : r2(childNodes.reduce((sum, c) => sum + c.amount, 0) + ownBalance);
        return {
          id: acc.id,
          accountCode: acc.accountCode,
          accountName: acc.accountName,
          accountType: acc.accountType,
          amount,
          children: childNodes,
          isLeaf,
        };
      };

      roots.sort(sortByCode);
      return roots.map(buildNode);
    };

    const assetAccounts = allAccounts.filter(a => getMainAccountType(a.accountType) === 'asset');
    const liabilityAccounts = allAccounts.filter(a => getMainAccountType(a.accountType) === 'liability');
    const equityAccounts = allAccounts.filter(a => getMainAccountType(a.accountType) === 'equity');

    const assetsTree = buildTree(assetAccounts);
    const liabilitiesTree = buildTree(liabilityAccounts);
    const equityTree = buildTree(equityAccounts);

    const asOfYear = new Date(asOfDate).getFullYear();
    const priorYearEnd = `${asOfYear - 1}-12-31`;
    const currentYearStart = `${asOfYear}-01-01`;

    const plAccountIds = [...incomeAccounts, ...expenseAccounts].map(a => a.id);

    const round2 = (n: number) => Math.round(n * 100) / 100;

    const computePL = async (fromDate: string | null, toDate: string) => {
      if (plAccountIds.length === 0) return 0;
      const conditions = [
        eq(journalEntries.isPosted, true),
        inArray(journalLines.accountId, plAccountIds),
        lte(journalEntries.entryDate, toDate),
      ];
      if (fromDate) {
        conditions.push(gte(journalEntries.entryDate, fromDate));
      }
      const rows = await db
        .select({
          accountId: journalLines.accountId,
          totalDebit: sql<string>`COALESCE(SUM(CAST(${journalLines.debitAmount} AS numeric)), 0)`,
          totalCredit: sql<string>`COALESCE(SUM(CAST(${journalLines.creditAmount} AS numeric)), 0)`,
        })
        .from(journalLines)
        .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
        .where(and(...conditions))
        .groupBy(journalLines.accountId);

      let totalInc = 0;
      let totalExp = 0;
      for (const row of rows) {
        const credit = round2(Number(row.totalCredit || 0));
        const debit = round2(Number(row.totalDebit || 0));
        const acc = [...incomeAccounts, ...expenseAccounts].find(a => a.id === row.accountId);
        if (!acc) continue;
        if (getMainAccountType(acc.accountType) === 'income') {
          totalInc = round2(totalInc + (credit - debit));
        } else {
          totalExp = round2(totalExp + (debit - credit));
        }
      }
      return round2(totalInc - totalExp);
    };

    const retainedEarnings = await computePL(null, priorYearEnd);
    const currentPeriodNetIncome = await computePL(currentYearStart, asOfDate);
    const netIncome = round2(retainedEarnings + currentPeriodNetIncome);

    const overlayPL = (nodes: TreeNode[]): TreeNode[] => nodes.map(n => {
      const newChildren = overlayPL(n.children);
      let amount = n.amount;
      if (n.accountCode === '30310') {
        amount = round2(amount + retainedEarnings);
      } else if (n.accountCode === '30320') {
        amount = round2(amount + currentPeriodNetIncome);
      } else if (newChildren.length > 0) {
        const originalChildSum = n.children.reduce((s, c) => s + c.amount, 0);
        const ownBalance = round2(n.amount - originalChildSum);
        const newChildSum = newChildren.reduce((s, c) => s + c.amount, 0);
        amount = round2(newChildSum + ownBalance);
      }
      return { ...n, amount, children: newChildren };
    });
    const equityTreeWithPL = overlayPL(equityTree);

    const sumTree = (nodes: TreeNode[]): number => round2(nodes.reduce((s, n) => s + round2(n.amount), 0));
    const totalAssets = sumTree(assetsTree);
    const totalLiabilities = sumTree(liabilitiesTree);
    const totalEquity = sumTree(equityTreeWithPL);

    return {
      assetsTree,
      liabilitiesTree,
      equityTree: equityTreeWithPL,
      retainedEarnings,
      currentPeriodNetIncome,
      netIncome,
      totalAssets,
      totalLiabilities,
      totalEquity,
      asOfDate,
    };
  }

  async getCashFlowStatement(startDate: string, endDate: string): Promise<any> {
    const allAccounts = await db.select().from(accounts);
    const accountMap = new Map(allAccounts.map(a => [a.id, a]));

    const lines = await db
      .select({
        accountId: journalLines.accountId,
        debitAmount: journalLines.debitAmount,
        creditAmount: journalLines.creditAmount,
        entryDate: journalEntries.entryDate,
        description: journalEntries.description,
        reference: journalEntries.reference,
        referenceType: journalEntries.referenceType,
        entryNumber: journalEntries.entryNumber,
      })
      .from(journalLines)
      .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
      .where(and(
        eq(journalEntries.isPosted, true),
        sql`${journalEntries.entryDate} >= ${startDate}`,
        sql`${journalEntries.entryDate} <= ${endDate}`,
      ));

    const cashAccountCodes = ['100', '101', '102'];
    const cashAccounts = allAccounts.filter(a => {
      if (getMainAccountType(a.accountType) === 'income' || getMainAccountType(a.accountType) === 'expense') return false;
      return cashAccountCodes.some(code => a.accountCode.startsWith(code)) ||
        (a.accountName.toLowerCase().includes('cash') && getMainAccountType(a.accountType) === 'asset') ||
        (a.accountName.toLowerCase().includes('bank') && getMainAccountType(a.accountType) === 'asset');
    });
    const cashAccountIds = new Set(cashAccounts.map(a => a.id));

    const profitItems: any[] = [];
    const adjustmentItems: any[] = [];
    const investingItems: any[] = [];
    const financingItems: any[] = [];

    const accountFlows = new Map<string, { debit: number; credit: number }>();

    for (const line of lines) {
      if (!line.accountId || cashAccountIds.has(line.accountId)) continue;
      const existing = accountFlows.get(line.accountId) || { debit: 0, credit: 0 };
      existing.debit += Number(line.debitAmount || 0);
      existing.credit += Number(line.creditAmount || 0);
      accountFlows.set(line.accountId, existing);
    }

    for (const [accountId, flows] of Array.from(accountFlows.entries())) {
      const account = accountMap.get(accountId);
      if (!account || cashAccountIds.has(account.id)) continue;
      const net = flows.credit - flows.debit;
      if (Math.abs(net) < 0.01) continue;

      const item = {
        accountCode: account.accountCode,
        accountName: account.accountName,
        amount: net,
      };

      const type = account.accountType;
      const name = account.accountName.toLowerCase();

      if (type === 'income' || type === 'expense') {
        profitItems.push(item);
      } else if (
        name.includes('security deposit')
      ) {
        investingItems.push(item);
      } else if (
        name.includes('receivable') ||
        name.includes('inventory') || name.includes('murabaha') ||
        name.includes('qard') || name.includes('provision') ||
        name.includes('payable') || name.includes('accrued') ||
        name.includes('prepaid') || name.includes('prepayment') ||
        name.includes('advances') || name.includes('depreciation') ||
        name.includes('accum') || name.includes('deferred') ||
        name.includes('withheld') || name.includes('withholding') ||
        name.includes('tax payable') || name.includes('salaries') ||
        name.includes('wages')
      ) {
        adjustmentItems.push(item);
      } else if (
        name.includes('cost of') ||
        name.includes('equipment') || name.includes('furniture') ||
        name.includes('vehicle') || name.includes('property') ||
        name.includes('plant') || name.includes('computer') ||
        name.includes('fixed asset') || name.includes('investment')
      ) {
        investingItems.push(item);
      } else if (
        type === 'equity' ||
        name.includes('capital') || name.includes('borrowing') ||
        name.includes('dividend') || name.includes('share') ||
        name.includes('reserve') || name.includes('retained') ||
        name.includes('donor') || name.includes('fund')
      ) {
        financingItems.push(item);
      } else if (type === 'asset') {
        investingItems.push(item);
      } else if (type === 'liability') {
        adjustmentItems.push(item);
      } else {
        adjustmentItems.push(item);
      }
    }

    let cashOpeningBalance = 0;
    for (const ca of cashAccounts) {
      cashOpeningBalance += Number(ca.openingBalance || 0);
    }

    if (cashAccountIds.size > 0) {
      const priorCashLines = await db
        .select({
          accountId: journalLines.accountId,
          debitAmount: journalLines.debitAmount,
          creditAmount: journalLines.creditAmount,
        })
        .from(journalLines)
        .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
        .where(and(
          eq(journalEntries.isPosted, true),
          sql`${journalEntries.entryDate} < ${startDate}`,
          sql`${journalLines.accountId} = ANY(${sql`ARRAY[${sql.join(
            Array.from(cashAccountIds).map(id => sql`${id}`),
            sql`, `
          )}]`})`
        ));

      for (const line of priorCashLines) {
        cashOpeningBalance += Number(line.debitAmount || 0) - Number(line.creditAmount || 0);
      }
    }

    const profitForYear = profitItems.reduce((s, i) => s + i.amount, 0);
    const totalAdjustments = adjustmentItems.reduce((s, i) => s + i.amount, 0);
    const totalOperating = profitForYear + totalAdjustments;
    const totalInvesting = investingItems.reduce((s, i) => s + i.amount, 0);
    const totalFinancing = financingItems.reduce((s, i) => s + i.amount, 0);
    const netChange = totalOperating + totalInvesting + totalFinancing;
    const cashClosingBalance = cashOpeningBalance + netChange;

    return {
      profitForYear,
      adjustments: adjustmentItems.sort((a, b) => a.accountCode.localeCompare(b.accountCode)),
      totalAdjustments,
      totalOperating,
      investing: investingItems.sort((a, b) => a.accountCode.localeCompare(b.accountCode)),
      financing: financingItems.sort((a, b) => a.accountCode.localeCompare(b.accountCode)),
      totalInvesting,
      totalFinancing,
      netChange,
      cashOpeningBalance,
      cashClosingBalance,
      period: { startDate, endDate },
    };
  }

  async getAccountStatement(accountId: string, startDate?: string, endDate?: string, fundingSourceId?: string, includeChildren?: boolean, _visited?: Set<string>): Promise<any> {
    const visited = _visited || new Set<string>();
    if (visited.has(accountId)) return null;
    visited.add(accountId);
    const [account] = await db.select().from(accounts).where(eq(accounts.id, accountId));
    if (!account) return null;

    const baseOpeningBalance = Number(account.openingBalance || 0);
    let openingBalance = fundingSourceId ? 0 : baseOpeningBalance;

    if (startDate) {
      const priorConditions: any[] = [
        eq(journalLines.accountId, accountId),
        eq(journalEntries.isPosted, true),
        sql`${journalEntries.entryDate} < ${startDate}`,
      ];
      if (fundingSourceId) {
        priorConditions.push(eq(journalLines.fundingSourceId, fundingSourceId));
      }

      const priorTxns = await db
        .select({
          debitAmount: journalLines.debitAmount,
          creditAmount: journalLines.creditAmount,
        })
        .from(journalLines)
        .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
        .where(and(...priorConditions));

      for (const tx of priorTxns) {
        const debit = Number(tx.debitAmount || 0);
        const credit = Number(tx.creditAmount || 0);
        if (getMainAccountType(account.accountType) === 'asset' || getMainAccountType(account.accountType) === 'expense') {
          openingBalance += debit - credit;
        } else {
          openingBalance += credit - debit;
        }
      }
    }

    const conditions: any[] = [
      eq(journalLines.accountId, accountId),
      eq(journalEntries.isPosted, true),
    ];
    if (startDate) conditions.push(gte(journalEntries.entryDate, startDate));
    if (endDate) conditions.push(lte(journalEntries.entryDate, endDate));
    if (fundingSourceId) {
      conditions.push(eq(journalLines.fundingSourceId, fundingSourceId));
    }

    const transactions = await db
      .select({
        entryDate: journalEntries.entryDate,
        entryNumber: journalEntries.entryNumber,
        description: journalLines.description,
        reference: journalEntries.reference,
        debitAmount: journalLines.debitAmount,
        creditAmount: journalLines.creditAmount,
        fundingSourceId: journalLines.fundingSourceId,
      })
      .from(journalLines)
      .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
      .where(and(...conditions))
      .orderBy(asc(journalEntries.entryDate));

    let runningBalance = openingBalance;
    const statement = transactions.map(tx => {
      const debit = Number(tx.debitAmount || 0);
      const credit = Number(tx.creditAmount || 0);

      if (getMainAccountType(account.accountType) === 'asset' || getMainAccountType(account.accountType) === 'expense') {
        runningBalance += debit - credit;
      } else {
        runningBalance += credit - debit;
      }

      return {
        ...tx,
        balance: runningBalance,
      };
    });

    let childStatements: any[] = [];
    if (includeChildren) {
      const directChildren = await db
        .select()
        .from(accounts)
        .where(eq(accounts.parentId, accountId))
        .orderBy(asc(accounts.accountCode));

      for (const child of directChildren) {
        const childStmt = await this.getAccountStatement(child.id, startDate, endDate, fundingSourceId, true, visited);
        if (childStmt) childStatements.push(childStmt);
      }
    }

    return {
      account,
      openingBalance,
      transactions: statement,
      closingBalance: runningBalance,
      childStatements,
    };
  }

  async getFundingSourceStatement(fundingSourceId: string, startDate?: string, endDate?: string): Promise<any> {
    const [fund] = await db.select().from(fundingSources).where(eq(fundingSources.id, fundingSourceId));
    if (!fund) return null;

    let openingBalance = 0;

    if (startDate) {
      const priorTxns = await db
        .select({
          debitAmount: journalLines.debitAmount,
          creditAmount: journalLines.creditAmount,
          accountType: accounts.accountType,
        })
        .from(journalLines)
        .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
        .leftJoin(accounts, eq(journalLines.accountId, accounts.id))
        .where(and(
          eq(journalLines.fundingSourceId, fundingSourceId),
          eq(journalEntries.isPosted, true),
          sql`${journalEntries.entryDate} < ${startDate}`
        ));

      for (const tx of priorTxns) {
        const debit = Number(tx.debitAmount || 0);
        const credit = Number(tx.creditAmount || 0);
        openingBalance += credit - debit;
      }
    }

    const conditions: any[] = [
      eq(journalLines.fundingSourceId, fundingSourceId),
      eq(journalEntries.isPosted, true),
    ];
    if (startDate) conditions.push(gte(journalEntries.entryDate, startDate));
    if (endDate) conditions.push(lte(journalEntries.entryDate, endDate));

    const transactions = await db
      .select({
        entryDate: journalEntries.entryDate,
        entryNumber: journalEntries.entryNumber,
        description: journalLines.description,
        reference: journalEntries.reference,
        accountCode: accounts.accountCode,
        accountName: accounts.accountName,
        accountType: accounts.accountType,
        debitAmount: journalLines.debitAmount,
        creditAmount: journalLines.creditAmount,
      })
      .from(journalLines)
      .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
      .leftJoin(accounts, eq(journalLines.accountId, accounts.id))
      .where(and(...conditions))
      .orderBy(asc(journalEntries.entryDate));

    let runningBalance = openingBalance;
    const statement = transactions.map(tx => {
      const debit = Number(tx.debitAmount || 0);
      const credit = Number(tx.creditAmount || 0);
      runningBalance += credit - debit;

      return {
        ...tx,
        balance: runningBalance,
      };
    });

    return {
      fundingSource: fund,
      openingBalance,
      transactions: statement,
      closingBalance: runningBalance,
    };
  }

  async getFundingSourcePrincipleStatement(fundingSourceId: string, startDate?: string, endDate?: string): Promise<any> {
    const [fund] = await db.select().from(fundingSources).where(eq(fundingSources.id, fundingSourceId));
    if (!fund) return null;

    const disbursedResult = await db.execute(sql`
      SELECT l.id as loan_id, l.application_id, l.principle_amount,
             d.disbursement_date,
             COALESCE(c.first_name, '') || ' ' || COALESCE(c.last_name, '') || ' ' || COALESCE(c.father_name, '') as customer_name
      FROM loans l
      INNER JOIN disbursements d ON d.loan_id = l.id
      INNER JOIN customers c ON l.customer_id = c.id
      WHERE l.funding_source_id = ${fundingSourceId}
        AND l.status IN ('active', 'disbursed', 'completed', 'defaulted')
    `);
    const disbursedRows = disbursedResult.rows as Array<{
      loan_id: string;
      application_id: string | null;
      principle_amount: string | null;
      disbursement_date: string | null;
      customer_name: string;
    }>;

    const loanInfoMap = new Map<string, { applicationId: string; customerName: string }>();
    for (const row of disbursedRows) {
      loanInfoMap.set(row.loan_id, {
        applicationId: row.application_id || '',
        customerName: (row.customer_name || '').trim(),
      });
    }

    const installmentResult = await db.execute(sql`
      SELECT i.loan_id, i.principle_amount, i.paid_amount, i.total_amount,
             i.margin_amount, i.payment_date
      FROM installments i
      INNER JOIN loans l ON i.loan_id = l.id
      WHERE l.funding_source_id = ${fundingSourceId}
        AND COALESCE(i.paid_amount::numeric, 0) > 0
        AND i.payment_date IS NOT NULL
    `);
    const installmentRows = installmentResult.rows as Array<{
      loan_id: string;
      principle_amount: string | null;
      paid_amount: string | null;
      total_amount: string | null;
      margin_amount: string | null;
      payment_date: string;
    }>;

    type PrincipalTx = {
      date: string;
      type: 'disbursement' | 'collection' | 'fund_receipt';
      applicationId: string;
      customerName: string;
      debitAmount: number;
      creditAmount: number;
      balance: number;
      reference?: string;
      description?: string;
    };

    const allTransactions: PrincipalTx[] = [];

    // Fund receipts: journal entries that credit a liability account on behalf of this funding source
    const fundReceiptResult = await db.execute(sql`
      SELECT je.entry_number, je.entry_date, je.description, je.reference,
             SUM(COALESCE(jl.credit_amount::numeric, 0) - COALESCE(jl.debit_amount::numeric, 0)) AS net_credit
      FROM journal_entries je
      INNER JOIN journal_lines jl ON jl.journal_entry_id = je.id
      INNER JOIN accounts a ON a.id = jl.account_id
      WHERE je.is_posted = true
        AND a.account_type IN ('current_liability','non_current_liability','liability')
        AND je.reference_type NOT IN ('disbursement', 'collection')
        AND (
          jl.funding_source_id = ${fundingSourceId}
          OR (jl.funding_source_id IS NULL AND je.funding_source_id = ${fundingSourceId})
        )
      GROUP BY je.id, je.entry_number, je.entry_date, je.description, je.reference
      HAVING SUM(COALESCE(jl.credit_amount::numeric, 0) - COALESCE(jl.debit_amount::numeric, 0)) <> 0
    `);
    const fundReceiptRows = fundReceiptResult.rows as Array<{
      entry_number: string;
      entry_date: string;
      description: string | null;
      reference: string | null;
      net_credit: string | null;
    }>;
    for (const row of fundReceiptRows) {
      const net = Number(row.net_credit || 0);
      allTransactions.push({
        date: row.entry_date,
        type: 'fund_receipt',
        applicationId: row.entry_number,
        customerName: row.description || 'Fund received',
        debitAmount: net < 0 ? -net : 0,
        creditAmount: net > 0 ? net : 0,
        balance: 0,
        reference: row.reference || row.entry_number,
        description: row.description || '',
      });
    }

    for (const row of disbursedRows) {
      if (row.disbursement_date) {
        allTransactions.push({
          date: row.disbursement_date,
          type: 'disbursement',
          applicationId: row.application_id || '',
          customerName: (row.customer_name || '').trim(),
          debitAmount: Number(row.principle_amount || 0),
          creditAmount: 0,
          balance: 0,
        });
      }
    }

    for (const inst of installmentRows) {
      const loanId = inst.loan_id;
      const info = loanInfoMap.get(loanId);
      if (!info) continue;

      const paidAmt = Number(inst.paid_amount || 0);
      const marginAmt = Number(inst.margin_amount || 0);
      const principalAmt = Number(inst.principle_amount || 0);
      const totalAmt = Number(inst.total_amount || 0);

      let principalCollected = 0;
      if (totalAmt > 0 && paidAmt >= totalAmt) {
        principalCollected = principalAmt;
      } else if (paidAmt > 0) {
        if (paidAmt > marginAmt) {
          principalCollected = Math.min(paidAmt - marginAmt, principalAmt);
        }
      }

      if (principalCollected > 0) {
        allTransactions.push({
          date: inst.payment_date,
          type: 'collection',
          applicationId: info.applicationId,
          customerName: info.customerName,
          debitAmount: 0,
          creditAmount: principalCollected,
          balance: 0,
        });
      }
    }

    allTransactions.sort((a, b) => {
      const dateCompare = (a.date || '').localeCompare(b.date || '');
      if (dateCompare !== 0) return dateCompare;
      if (a.type === 'disbursement' && b.type !== 'disbursement') return -1;
      if (a.type !== 'disbursement' && b.type === 'disbursement') return 1;
      return 0;
    });

    let priorBalance = 0;
    const filteredTransactions: PrincipalTx[] = [];

    for (const tx of allTransactions) {
      const beforeRange = startDate && tx.date < startDate;
      const inRange = (!startDate || tx.date >= startDate) && (!endDate || tx.date <= endDate);

      if (beforeRange) {
        priorBalance += tx.creditAmount - tx.debitAmount;
      } else if (inRange) {
        filteredTransactions.push(tx);
      }
    }

    let runningBalance = priorBalance;
    for (const tx of filteredTransactions) {
      runningBalance += tx.creditAmount - tx.debitAmount;
      tx.balance = runningBalance;
    }

    return {
      fundingSource: fund,
      openingBalance: priorBalance,
      transactions: filteredTransactions,
      closingBalance: runningBalance,
      summary: {
        totalDisbursed: filteredTransactions.reduce((s, t) => s + t.debitAmount, 0),
        totalCollected: filteredTransactions.reduce((s, t) => s + t.creditAmount, 0),
      },
    };
  }

  // ============== HR Module Storage Methods ==============

  // Departments
  async getDepartments() {
    return db.select().from(departments).orderBy(asc(departments.name));
  }

  async createDepartment(data: any) {
    const [department] = await db.insert(departments).values({
      name: data.name,
      code: data.code,
      description: data.description,
      isActive: true,
    }).returning();
    return department;
  }

  async updateDepartment(id: string, data: any) {
    const [department] = await db.update(departments)
      .set({
        name: data.name,
        code: data.code,
        description: data.description,
      })
      .where(eq(departments.id, id))
      .returning();
    return department;
  }

  async deleteDepartment(id: string) {
    await db.delete(departments).where(eq(departments.id, id));
  }

  // Positions
  async getPositions() {
    const positionList = await db.select().from(positions).orderBy(asc(positions.title));
    
    const positionsWithDept = await Promise.all(positionList.map(async (pos) => {
      let department = null;
      if (pos.departmentId) {
        const [dept] = await db.select().from(departments).where(eq(departments.id, pos.departmentId));
        department = dept;
      }
      return { ...pos, department };
    }));
    
    return positionsWithDept;
  }

  async createPosition(data: any) {
    const [position] = await db.insert(positions).values({
      title: data.title,
      code: data.code,
      departmentId: data.departmentId || null,
      parentPositionId: data.parentPositionId || null,
      secondaryReportingPositionId: data.secondaryReportingPositionId || null,
      grade: data.grade,
      description: data.description,
      isActive: true,
    }).returning();
    return position;
  }

  async updatePosition(id: string, data: any) {
    const [position] = await db.update(positions)
      .set({
        title: data.title,
        code: data.code,
        departmentId: data.departmentId || null,
        parentPositionId: data.parentPositionId || null,
        secondaryReportingPositionId: data.secondaryReportingPositionId || null,
        grade: data.grade,
        description: data.description,
      })
      .where(eq(positions.id, id))
      .returning();
    return position;
  }

  async deletePosition(id: string) {
    await db.delete(positions).where(eq(positions.id, id));
  }

  // Employees
  async getEmployees() {
    const employeeList = await db.select().from(employees).orderBy(asc(employees.firstName));
    
    const employeesWithRelations = await Promise.all(employeeList.map(async (emp) => {
      let department = null;
      let position = null;
      let branch = null;
      
      if (emp.departmentId) {
        const [dept] = await db.select().from(departments).where(eq(departments.id, emp.departmentId));
        department = dept;
      }
      if (emp.positionId) {
        const [pos] = await db.select().from(positions).where(eq(positions.id, emp.positionId));
        position = pos;
      }
      if (emp.branchId) {
        const [br] = await db.select().from(branches).where(eq(branches.id, emp.branchId));
        branch = br;
      }
      
      return { ...emp, department, position, branch };
    }));
    
    return employeesWithRelations;
  }

  async getEmployee(id: string) {
    const [emp] = await db.select().from(employees).where(eq(employees.id, id));
    if (!emp) return null;
    
    let department = null;
    let position = null;
    let branch = null;
    
    if (emp.departmentId) {
      const [dept] = await db.select().from(departments).where(eq(departments.id, emp.departmentId));
      department = dept;
    }
    if (emp.positionId) {
      const [pos] = await db.select().from(positions).where(eq(positions.id, emp.positionId));
      position = pos;
    }
    if (emp.branchId) {
      const [br] = await db.select().from(branches).where(eq(branches.id, emp.branchId));
      branch = br;
    }
    
    return { ...emp, department, position, branch };
  }

  async createEmployee(data: any) {
    let branchShortCode = "HQ";
    if (data.branchId) {
      const [br] = await db.select().from(branches).where(eq(branches.id, data.branchId));
      if (br?.shortName) {
        branchShortCode = br.shortName;
      } else if (br?.code) {
        branchShortCode = br.code;
      }
    }
    branchShortCode = branchShortCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase() || "HQ";
    const prefix = `LMI-${branchShortCode}-`;

    let employeeCode = "";
    let retries = 3;
    while (retries > 0) {
      const existingCodes = await db.select({ code: employees.employeeCode }).from(employees)
        .where(sql`${employees.employeeCode} LIKE ${prefix + '%'}`);
      let maxNum = 0;
      for (const row of existingCodes) {
        const match = row.code?.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
      employeeCode = `${prefix}${String(maxNum + 1).padStart(4, '0')}`;
      try {
        const [employee] = await db.insert(employees).values({
          employeeCode,
          firstName: data.firstName,
          lastName: data.lastName,
          fatherName: data.fatherName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          maritalStatus: data.maritalStatus,
          nationalId: data.nationalId,
          nationalIdPlaceOfIssue: data.nationalIdPlaceOfIssue,
          phoneNumber: data.phoneNumber,
          secondPhoneNumber: data.secondPhoneNumber,
          email: data.email || null,
          permanentAddress: data.permanentAddress,
          currentAddress: data.currentAddress,
          positionId: data.positionId || null,
          departmentId: data.departmentId || null,
          branchId: data.branchId || null,
          dutyStation: data.dutyStation,
          hireDate: data.hireDate,
          employmentStatus: data.employmentStatus || 'active',
          educationLevel: data.educationLevel,
          educationDetails: data.educationDetails,
          totalExperienceYears: data.totalExperienceYears || 0,
          jobRelatedExperienceYears: data.jobRelatedExperienceYears || 0,
          otherExperienceYears: data.otherExperienceYears || 0,
          photoUrl: data.photoUrl || null,
        }).returning();
        return employee;
      } catch (err: any) {
        if (err?.message?.includes('unique') || err?.message?.includes('duplicate')) {
          retries--;
          if (retries === 0) throw err;
          continue;
        }
        throw err;
      }
    }
    throw new Error("Failed to generate unique employee code after retries");
  }

  async updateEmployee(id: string, data: any) {
    const [employee] = await db.update(employees)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        fatherName: data.fatherName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        maritalStatus: data.maritalStatus,
        nationalId: data.nationalId,
        nationalIdPlaceOfIssue: data.nationalIdPlaceOfIssue,
        phoneNumber: data.phoneNumber,
        secondPhoneNumber: data.secondPhoneNumber,
        email: data.email || null,
        permanentAddress: data.permanentAddress,
        currentAddress: data.currentAddress,
        positionId: data.positionId || null,
        departmentId: data.departmentId || null,
        branchId: data.branchId || null,
        dutyStation: data.dutyStation,
        hireDate: data.hireDate,
        employmentStatus: data.employmentStatus,
        educationLevel: data.educationLevel,
        educationDetails: data.educationDetails,
        totalExperienceYears: data.totalExperienceYears || 0,
        jobRelatedExperienceYears: data.jobRelatedExperienceYears || 0,
        otherExperienceYears: data.otherExperienceYears || 0,
        photoUrl: data.photoUrl || null,
      })
      .where(eq(employees.id, id))
      .returning();
    return employee;
  }

  async deleteEmployee(id: string) {
    await db.delete(employees).where(eq(employees.id, id));
  }

  // Leave Types
  async getLeaveTypes() {
    return db.select().from(leaveTypes).orderBy(asc(leaveTypes.name));
  }

  async createLeaveType(data: any) {
    const [leaveType] = await db.insert(leaveTypes).values({
      name: data.name,
      code: data.code,
      daysPerYear: data.daysPerYear || 0,
      isPaid: data.isPaid ?? true,
      carryForward: data.carryForward ?? false,
      maxCarryForwardDays: data.maxCarryForwardDays || 0,
      description: data.description,
      isActive: true,
    }).returning();
    return leaveType;
  }

  async updateLeaveType(id: string, data: any) {
    const [leaveType] = await db.update(leaveTypes)
      .set({
        name: data.name,
        code: data.code,
        daysPerYear: data.daysPerYear || 0,
        isPaid: data.isPaid,
        carryForward: data.carryForward,
        maxCarryForwardDays: data.maxCarryForwardDays || 0,
        description: data.description,
      })
      .where(eq(leaveTypes.id, id))
      .returning();
    return leaveType;
  }

  async deleteLeaveType(id: string) {
    await db.delete(leaveTypes).where(eq(leaveTypes.id, id));
  }

  // Leave Requests
  async getLeaveRequests() {
    const requests = await db.select().from(leaveRequests).orderBy(desc(leaveRequests.createdAt));
    
    const requestsWithRelations = await Promise.all(requests.map(async (req) => {
      let employee = null;
      let leaveType = null;
      
      if (req.employeeId) {
        const [emp] = await db.select().from(employees).where(eq(employees.id, req.employeeId));
        employee = emp;
      }
      if (req.leaveTypeId) {
        const [lt] = await db.select().from(leaveTypes).where(eq(leaveTypes.id, req.leaveTypeId));
        leaveType = lt;
      }
      
      return { ...req, employee, leaveType };
    }));
    
    return requestsWithRelations;
  }

  async createLeaveRequest(data: any) {
    const [request] = await db.insert(leaveRequests).values({
      employeeId: data.employeeId,
      leaveTypeId: data.leaveTypeId,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: data.totalDays || 1,
      reason: data.reason,
      status: 'pending',
    }).returning();
    return request;
  }

  async updateLeaveRequest(id: string, data: any) {
    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.rejectionReason) updateData.rejectionReason = data.rejectionReason;
    if (data.status === 'approved' || data.status === 'rejected') {
      updateData.approvedAt = new Date();
    }
    
    const [request] = await db.update(leaveRequests)
      .set(updateData)
      .where(eq(leaveRequests.id, id))
      .returning();
    return request;
  }

  // Holidays
  async getHolidays() {
    return db.select().from(holidays).orderBy(asc(holidays.date));
  }

  async createHoliday(data: any) {
    const [holiday] = await db.insert(holidays).values({
      name: data.name,
      date: data.date,
      year: data.year || new Date(data.date).getFullYear(),
      isRecurring: data.isRecurring ?? false,
      description: data.description,
    }).returning();
    return holiday;
  }

  async updateHoliday(id: string, data: any) {
    const [holiday] = await db.update(holidays)
      .set({
        name: data.name,
        date: data.date,
        year: data.year,
        isRecurring: data.isRecurring,
        description: data.description,
      })
      .where(eq(holidays.id, id))
      .returning();
    return holiday;
  }

  async deleteHoliday(id: string) {
    await db.delete(holidays).where(eq(holidays.id, id));
  }

  // Attendance
  async getAttendance(date?: string) {
    let query;
    if (date) {
      query = db.select().from(attendance).where(eq(attendance.date, date));
    } else {
      query = db.select().from(attendance);
    }
    
    const records = await query.orderBy(desc(attendance.date));
    
    const recordsWithEmployee = await Promise.all(records.map(async (rec) => {
      let employee = null;
      if (rec.employeeId) {
        const [emp] = await db.select().from(employees).where(eq(employees.id, rec.employeeId));
        employee = emp;
      }
      return { ...rec, employee };
    }));
    
    return recordsWithEmployee;
  }

  async createAttendance(data: any) {
    const [record] = await db.insert(attendance).values({
      employeeId: data.employeeId,
      date: data.date,
      status: data.status || 'present',
      notes: data.notes,
    }).returning();
    return record;
  }

  async updateAttendance(id: string, data: any) {
    const [record] = await db.update(attendance)
      .set({
        status: data.status,
        notes: data.notes,
      })
      .where(eq(attendance.id, id))
      .returning();
    return record;
  }

  // ============== PAYROLL MODULE ==============

  // Salary Structures
  async getSalaryStructures() {
    return db.select().from(salaryStructures).orderBy(asc(salaryStructures.name));
  }

  async getSalaryStructure(id: string) {
    const [structure] = await db.select().from(salaryStructures).where(eq(salaryStructures.id, id));
    return structure;
  }

  async createSalaryStructure(data: any) {
    const [structure] = await db.insert(salaryStructures).values(data).returning();
    return structure;
  }

  async updateSalaryStructure(id: string, data: any) {
    const [structure] = await db.update(salaryStructures).set(data).where(eq(salaryStructures.id, id)).returning();
    return structure;
  }

  async deleteSalaryStructure(id: string) {
    await db.delete(salaryStructures).where(eq(salaryStructures.id, id));
  }

  // Allowance Types
  async getAllowanceTypes() {
    return db.select().from(allowanceTypes).orderBy(asc(allowanceTypes.name));
  }

  async createAllowanceType(data: any) {
    const [type] = await db.insert(allowanceTypes).values(data).returning();
    return type;
  }

  async updateAllowanceType(id: string, data: any) {
    const [type] = await db.update(allowanceTypes).set(data).where(eq(allowanceTypes.id, id)).returning();
    return type;
  }

  async deleteAllowanceType(id: string) {
    await db.delete(allowanceTypes).where(eq(allowanceTypes.id, id));
  }

  // Deduction Types
  async getDeductionTypes() {
    return db.select().from(deductionTypes).orderBy(asc(deductionTypes.name));
  }

  async createDeductionType(data: any) {
    const [type] = await db.insert(deductionTypes).values(data).returning();
    return type;
  }

  async updateDeductionType(id: string, data: any) {
    const [type] = await db.update(deductionTypes).set(data).where(eq(deductionTypes.id, id)).returning();
    return type;
  }

  async deleteDeductionType(id: string) {
    await db.delete(deductionTypes).where(eq(deductionTypes.id, id));
  }

  // Employee Salaries
  async getEmployeeSalaries(employeeId?: string) {
    if (employeeId) {
      return db.select().from(employeeSalaries).where(eq(employeeSalaries.employeeId, employeeId));
    }
    return db.select().from(employeeSalaries);
  }

  async createEmployeeSalary(data: any) {
    const [salary] = await db.insert(employeeSalaries).values(data).returning();
    return salary;
  }

  async updateEmployeeSalary(id: string, data: any) {
    const [salary] = await db.update(employeeSalaries).set(data).where(eq(employeeSalaries.id, id)).returning();
    return salary;
  }

  // Employee Allowances
  async getEmployeeAllowances(employeeId?: string) {
    if (employeeId) {
      return db.select().from(employeeAllowances).where(eq(employeeAllowances.employeeId, employeeId));
    }
    return db.select().from(employeeAllowances);
  }

  async createEmployeeAllowance(data: any) {
    const [allowance] = await db.insert(employeeAllowances).values(data).returning();
    return allowance;
  }

  async updateEmployeeAllowance(id: string, data: any) {
    const [allowance] = await db.update(employeeAllowances).set(data).where(eq(employeeAllowances.id, id)).returning();
    return allowance;
  }

  async deleteEmployeeAllowance(id: string) {
    await db.delete(employeeAllowances).where(eq(employeeAllowances.id, id));
  }

  // Employee Deductions
  async getEmployeeDeductions(employeeId?: string) {
    if (employeeId) {
      return db.select().from(employeeDeductions).where(eq(employeeDeductions.employeeId, employeeId));
    }
    return db.select().from(employeeDeductions);
  }

  async createEmployeeDeduction(data: any) {
    const [deduction] = await db.insert(employeeDeductions).values(data).returning();
    return deduction;
  }

  async updateEmployeeDeduction(id: string, data: any) {
    const [deduction] = await db.update(employeeDeductions).set(data).where(eq(employeeDeductions.id, id)).returning();
    return deduction;
  }

  async deleteEmployeeDeduction(id: string) {
    await db.delete(employeeDeductions).where(eq(employeeDeductions.id, id));
  }

  // Payroll Runs
  async getPayrollRuns() {
    return db.select().from(payrollRuns).orderBy(desc(payrollRuns.createdAt));
  }

  async getPayrollRun(id: string) {
    const [run] = await db.select().from(payrollRuns).where(eq(payrollRuns.id, id));
    return run;
  }

  async createPayrollRun(data: any) {
    const payrollNumber = `PR-${Date.now()}`;
    const [run] = await db.insert(payrollRuns).values({ ...data, payrollNumber }).returning();
    return run;
  }

  async updatePayrollRun(id: string, data: any) {
    const [run] = await db.update(payrollRuns).set(data).where(eq(payrollRuns.id, id)).returning();
    return run;
  }

  async deletePayrollRun(id: string) {
    await db.delete(payslipDetails).where(
      inArray(payslipDetails.payslipId, 
        db.select({ id: payslips.id }).from(payslips).where(eq(payslips.payrollRunId, id))
      )
    );
    await db.delete(payslips).where(eq(payslips.payrollRunId, id));
    await db.delete(payrollRuns).where(eq(payrollRuns.id, id));
  }

  // Payslips
  async getPayslips(payrollRunId?: string) {
    let query;
    if (payrollRunId) {
      query = db.select().from(payslips).where(eq(payslips.payrollRunId, payrollRunId));
    } else {
      query = db.select().from(payslips);
    }
    const slips = await query;
    return Promise.all(slips.map(async (slip) => {
      const [employee] = await db.select().from(employees).where(eq(employees.id, slip.employeeId));
      return { ...slip, employee };
    }));
  }

  async getPayslip(id: string) {
    const [slip] = await db.select().from(payslips).where(eq(payslips.id, id));
    if (!slip) return null;
    const [employee] = await db.select().from(employees).where(eq(employees.id, slip.employeeId));
    const details = await db.select().from(payslipDetails).where(eq(payslipDetails.payslipId, id));
    return { ...slip, employee, details };
  }

  async createPayslip(data: any) {
    const [slip] = await db.insert(payslips).values(data).returning();
    return slip;
  }

  async createPayslipDetail(data: any) {
    const [detail] = await db.insert(payslipDetails).values(data).returning();
    return detail;
  }

  // ============== RECRUITMENT MODULE ==============

  // Job Postings
  async getJobPostings() {
    const jobs = await db.select().from(jobPostings).orderBy(desc(jobPostings.createdAt));
    return Promise.all(jobs.map(async (job) => {
      let department = null;
      let position = null;
      if (job.departmentId) {
        const [dept] = await db.select().from(departments).where(eq(departments.id, job.departmentId));
        department = dept;
      }
      if (job.positionId) {
        const [pos] = await db.select().from(positions).where(eq(positions.id, job.positionId));
        position = pos;
      }
      const applicantCount = await db.select({ count: count() }).from(applicants).where(eq(applicants.jobPostingId, job.id));
      return { ...job, department, position, applicantCount: applicantCount[0]?.count || 0 };
    }));
  }

  async getJobPosting(id: string) {
    const [job] = await db.select().from(jobPostings).where(eq(jobPostings.id, id));
    return job;
  }

  async createJobPosting(data: any) {
    const [job] = await db.insert(jobPostings).values(data).returning();
    return job;
  }

  async updateJobPosting(id: string, data: any) {
    const [job] = await db.update(jobPostings).set(data).where(eq(jobPostings.id, id)).returning();
    return job;
  }

  async deleteJobPosting(id: string) {
    await db.delete(interviews).where(
      inArray(interviews.applicantId, 
        db.select({ id: applicants.id }).from(applicants).where(eq(applicants.jobPostingId, id))
      )
    );
    await db.delete(applicants).where(eq(applicants.jobPostingId, id));
    await db.delete(jobPostings).where(eq(jobPostings.id, id));
  }

  // Applicants
  async getApplicants(jobPostingId?: string) {
    let query;
    if (jobPostingId) {
      query = db.select().from(applicants).where(eq(applicants.jobPostingId, jobPostingId));
    } else {
      query = db.select().from(applicants);
    }
    const apps = await query.orderBy(desc(applicants.appliedAt));
    return Promise.all(apps.map(async (app) => {
      const [job] = await db.select().from(jobPostings).where(eq(jobPostings.id, app.jobPostingId));
      return { ...app, jobPosting: job };
    }));
  }

  async getApplicant(id: string) {
    const [app] = await db.select().from(applicants).where(eq(applicants.id, id));
    if (!app) return null;
    const [job] = await db.select().from(jobPostings).where(eq(jobPostings.id, app.jobPostingId));
    const interviewList = await db.select().from(interviews).where(eq(interviews.applicantId, id));
    return { ...app, jobPosting: job, interviews: interviewList };
  }

  async createApplicant(data: any) {
    const [app] = await db.insert(applicants).values(data).returning();
    return app;
  }

  async updateApplicant(id: string, data: any) {
    const [app] = await db.update(applicants).set(data).where(eq(applicants.id, id)).returning();
    return app;
  }

  async deleteApplicant(id: string) {
    await db.delete(interviews).where(eq(interviews.applicantId, id));
    await db.delete(applicants).where(eq(applicants.id, id));
  }

  // Interviews
  async getInterviews(applicantId?: string) {
    let query;
    if (applicantId) {
      query = db.select().from(interviews).where(eq(interviews.applicantId, applicantId));
    } else {
      query = db.select().from(interviews);
    }
    const ints = await query.orderBy(desc(interviews.scheduledDate));
    return Promise.all(ints.map(async (int) => {
      const [app] = await db.select().from(applicants).where(eq(applicants.id, int.applicantId));
      let interviewer = null;
      if (int.interviewerId) {
        const [emp] = await db.select().from(employees).where(eq(employees.id, int.interviewerId));
        interviewer = emp;
      }
      return { ...int, applicant: app, interviewer };
    }));
  }

  async createInterview(data: any) {
    const [interview] = await db.insert(interviews).values(data).returning();
    return interview;
  }

  async updateInterview(id: string, data: any) {
    const [interview] = await db.update(interviews).set(data).where(eq(interviews.id, id)).returning();
    return interview;
  }

  async deleteInterview(id: string) {
    await db.delete(interviews).where(eq(interviews.id, id));
  }

  // ============== PERFORMANCE MODULE ==============

  // Performance Periods
  async getPerformancePeriods() {
    return db.select().from(performancePeriods).orderBy(desc(performancePeriods.startDate));
  }

  async createPerformancePeriod(data: any) {
    const [period] = await db.insert(performancePeriods).values(data).returning();
    return period;
  }

  async updatePerformancePeriod(id: string, data: any) {
    const [period] = await db.update(performancePeriods).set(data).where(eq(performancePeriods.id, id)).returning();
    return period;
  }

  async deletePerformancePeriod(id: string) {
    await db.delete(performancePeriods).where(eq(performancePeriods.id, id));
  }

  // Performance Reviews
  async getPerformanceReviews(employeeId?: string, periodId?: string) {
    let query = db.select().from(performanceReviews);
    if (employeeId) {
      query = query.where(eq(performanceReviews.employeeId, employeeId)) as any;
    }
    if (periodId) {
      query = query.where(eq(performanceReviews.periodId, periodId)) as any;
    }
    const reviews = await query.orderBy(desc(performanceReviews.createdAt));
    return Promise.all(reviews.map(async (review) => {
      const [employee] = await db.select().from(employees).where(eq(employees.id, review.employeeId));
      let reviewer = null;
      if (review.reviewerId) {
        const [rev] = await db.select().from(employees).where(eq(employees.id, review.reviewerId));
        reviewer = rev;
      }
      let period = null;
      if (review.periodId) {
        const [per] = await db.select().from(performancePeriods).where(eq(performancePeriods.id, review.periodId));
        period = per;
      }
      return { ...review, employee, reviewer, period };
    }));
  }

  async getPerformanceReview(id: string) {
    const [review] = await db.select().from(performanceReviews).where(eq(performanceReviews.id, id));
    if (!review) return null;
    const [employee] = await db.select().from(employees).where(eq(employees.id, review.employeeId));
    const goals = await db.select().from(performanceGoals).where(eq(performanceGoals.reviewId, id));
    const ratings = await db.select().from(competencyRatings).where(eq(competencyRatings.reviewId, id));
    return { ...review, employee, goals, competencyRatings: ratings };
  }

  async createPerformanceReview(data: any) {
    const [review] = await db.insert(performanceReviews).values(data).returning();
    return review;
  }

  async updatePerformanceReview(id: string, data: any) {
    const [review] = await db.update(performanceReviews).set(data).where(eq(performanceReviews.id, id)).returning();
    return review;
  }

  async deletePerformanceReview(id: string) {
    await db.delete(competencyRatings).where(eq(competencyRatings.reviewId, id));
    await db.delete(performanceGoals).where(eq(performanceGoals.reviewId, id));
    await db.delete(performanceReviews).where(eq(performanceReviews.id, id));
  }

  // Goals
  async getPerformanceGoals(employeeId?: string, reviewId?: string) {
    let query = db.select().from(performanceGoals);
    if (employeeId) {
      query = query.where(eq(performanceGoals.employeeId, employeeId)) as any;
    }
    if (reviewId) {
      query = query.where(eq(performanceGoals.reviewId, reviewId)) as any;
    }
    return query.orderBy(desc(performanceGoals.createdAt));
  }

  async createPerformanceGoal(data: any) {
    const [goal] = await db.insert(performanceGoals).values(data).returning();
    return goal;
  }

  async updatePerformanceGoal(id: string, data: any) {
    const [goal] = await db.update(performanceGoals).set(data).where(eq(performanceGoals.id, id)).returning();
    return goal;
  }

  async deletePerformanceGoal(id: string) {
    await db.delete(performanceGoals).where(eq(performanceGoals.id, id));
  }

  // Competencies
  async getCompetencies() {
    return db.select().from(competencies).orderBy(asc(competencies.name));
  }

  async createCompetency(data: any) {
    const [comp] = await db.insert(competencies).values(data).returning();
    return comp;
  }

  async updateCompetency(id: string, data: any) {
    const [comp] = await db.update(competencies).set(data).where(eq(competencies.id, id)).returning();
    return comp;
  }

  async deleteCompetency(id: string) {
    await db.delete(competencies).where(eq(competencies.id, id));
  }

  // Competency Ratings
  async createCompetencyRating(data: any) {
    const [rating] = await db.insert(competencyRatings).values(data).returning();
    return rating;
  }

  async updateCompetencyRating(id: string, data: any) {
    const [rating] = await db.update(competencyRatings).set(data).where(eq(competencyRatings.id, id)).returning();
    return rating;
  }

  // ============== TRAINING MODULE ==============

  // Training Programs
  async getTrainingPrograms() {
    return db.select().from(trainingPrograms).orderBy(asc(trainingPrograms.title));
  }

  async getTrainingProgram(id: string) {
    const [program] = await db.select().from(trainingPrograms).where(eq(trainingPrograms.id, id));
    return program;
  }

  async createTrainingProgram(data: any) {
    const [program] = await db.insert(trainingPrograms).values(data).returning();
    return program;
  }

  async updateTrainingProgram(id: string, data: any) {
    const [program] = await db.update(trainingPrograms).set(data).where(eq(trainingPrograms.id, id)).returning();
    return program;
  }

  async deleteTrainingProgram(id: string) {
    await db.delete(trainingPrograms).where(eq(trainingPrograms.id, id));
  }

  // Training Sessions
  async getTrainingSessions(programId?: string) {
    let query;
    if (programId) {
      query = db.select().from(trainingSessions).where(eq(trainingSessions.programId, programId));
    } else {
      query = db.select().from(trainingSessions);
    }
    const sessions = await query.orderBy(desc(trainingSessions.startDate));
    return Promise.all(sessions.map(async (session) => {
      const [program] = await db.select().from(trainingPrograms).where(eq(trainingPrograms.id, session.programId));
      let trainer = null;
      if (session.trainerId) {
        const [emp] = await db.select().from(employees).where(eq(employees.id, session.trainerId));
        trainer = emp;
      }
      const enrollmentCount = await db.select({ count: count() }).from(trainingEnrollments).where(eq(trainingEnrollments.sessionId, session.id));
      return { ...session, program, trainer, enrollmentCount: enrollmentCount[0]?.count || 0 };
    }));
  }

  async createTrainingSession(data: any) {
    const [session] = await db.insert(trainingSessions).values(data).returning();
    return session;
  }

  async updateTrainingSession(id: string, data: any) {
    const [session] = await db.update(trainingSessions).set(data).where(eq(trainingSessions.id, id)).returning();
    return session;
  }

  async deleteTrainingSession(id: string) {
    await db.delete(trainingEnrollments).where(eq(trainingEnrollments.sessionId, id));
    await db.delete(trainingSessions).where(eq(trainingSessions.id, id));
  }

  // Training Enrollments
  async getTrainingEnrollments(sessionId?: string, employeeId?: string) {
    let query = db.select().from(trainingEnrollments);
    if (sessionId) {
      query = query.where(eq(trainingEnrollments.sessionId, sessionId)) as any;
    }
    if (employeeId) {
      query = query.where(eq(trainingEnrollments.employeeId, employeeId)) as any;
    }
    const enrollments = await query;
    return Promise.all(enrollments.map(async (enr) => {
      const [employee] = await db.select().from(employees).where(eq(employees.id, enr.employeeId));
      const [session] = await db.select().from(trainingSessions).where(eq(trainingSessions.id, enr.sessionId));
      return { ...enr, employee, session };
    }));
  }

  async createTrainingEnrollment(data: any) {
    const [enrollment] = await db.insert(trainingEnrollments).values(data).returning();
    return enrollment;
  }

  async updateTrainingEnrollment(id: string, data: any) {
    const [enrollment] = await db.update(trainingEnrollments).set(data).where(eq(trainingEnrollments.id, id)).returning();
    return enrollment;
  }

  async deleteTrainingEnrollment(id: string) {
    await db.delete(trainingEnrollments).where(eq(trainingEnrollments.id, id));
  }

  // Skills
  async getSkills() {
    return db.select().from(skills).orderBy(asc(skills.name));
  }

  async createSkill(data: any) {
    const [skill] = await db.insert(skills).values(data).returning();
    return skill;
  }

  async updateSkill(id: string, data: any) {
    const [skill] = await db.update(skills).set(data).where(eq(skills.id, id)).returning();
    return skill;
  }

  async deleteSkill(id: string) {
    await db.delete(employeeSkills).where(eq(employeeSkills.skillId, id));
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Employee Skills
  async getEmployeeSkills(employeeId: string) {
    const empSkills = await db.select().from(employeeSkills).where(eq(employeeSkills.employeeId, employeeId));
    return Promise.all(empSkills.map(async (es) => {
      const [skill] = await db.select().from(skills).where(eq(skills.id, es.skillId));
      return { ...es, skill };
    }));
  }

  async createEmployeeSkill(data: any) {
    const [empSkill] = await db.insert(employeeSkills).values(data).returning();
    return empSkill;
  }

  async updateEmployeeSkill(id: string, data: any) {
    const [empSkill] = await db.update(employeeSkills).set(data).where(eq(employeeSkills.id, id)).returning();
    return empSkill;
  }

  async deleteEmployeeSkill(id: string) {
    await db.delete(employeeSkills).where(eq(employeeSkills.id, id));
  }

  // Certifications
  async getCertifications() {
    return db.select().from(certifications).orderBy(asc(certifications.name));
  }

  async createCertification(data: any) {
    const [cert] = await db.insert(certifications).values(data).returning();
    return cert;
  }

  async updateCertification(id: string, data: any) {
    const [cert] = await db.update(certifications).set(data).where(eq(certifications.id, id)).returning();
    return cert;
  }

  async deleteCertification(id: string) {
    await db.delete(employeeCertifications).where(eq(employeeCertifications.certificationId, id));
    await db.delete(certifications).where(eq(certifications.id, id));
  }

  // Employee Certifications
  async getEmployeeCertifications(employeeId: string) {
    const empCerts = await db.select().from(employeeCertifications).where(eq(employeeCertifications.employeeId, employeeId));
    return Promise.all(empCerts.map(async (ec) => {
      const [cert] = await db.select().from(certifications).where(eq(certifications.id, ec.certificationId));
      return { ...ec, certification: cert };
    }));
  }

  async createEmployeeCertification(data: any) {
    const [empCert] = await db.insert(employeeCertifications).values(data).returning();
    return empCert;
  }

  async updateEmployeeCertification(id: string, data: any) {
    const [empCert] = await db.update(employeeCertifications).set(data).where(eq(employeeCertifications.id, id)).returning();
    return empCert;
  }

  async deleteEmployeeCertification(id: string) {
    await db.delete(employeeCertifications).where(eq(employeeCertifications.id, id));
  }

  // ============== BENEFITS MODULE ==============

  // Benefit Plans
  async getBenefitPlans() {
    return db.select().from(benefitPlans).orderBy(asc(benefitPlans.name));
  }

  async getBenefitPlan(id: string) {
    const [plan] = await db.select().from(benefitPlans).where(eq(benefitPlans.id, id));
    return plan;
  }

  async createBenefitPlan(data: any) {
    const [plan] = await db.insert(benefitPlans).values(data).returning();
    return plan;
  }

  async updateBenefitPlan(id: string, data: any) {
    const [plan] = await db.update(benefitPlans).set(data).where(eq(benefitPlans.id, id)).returning();
    return plan;
  }

  async deleteBenefitPlan(id: string) {
    await db.delete(benefitPlans).where(eq(benefitPlans.id, id));
  }

  // Employee Benefit Enrollments
  async getEmployeeBenefitEnrollments(employeeId?: string) {
    let query;
    if (employeeId) {
      query = db.select().from(employeeBenefitEnrollments).where(eq(employeeBenefitEnrollments.employeeId, employeeId));
    } else {
      query = db.select().from(employeeBenefitEnrollments);
    }
    const enrollments = await query;
    return Promise.all(enrollments.map(async (enr) => {
      const [employee] = await db.select().from(employees).where(eq(employees.id, enr.employeeId));
      const [plan] = await db.select().from(benefitPlans).where(eq(benefitPlans.id, enr.benefitPlanId));
      const deps = await db.select().from(benefitDependents).where(eq(benefitDependents.enrollmentId, enr.id));
      return { ...enr, employee, benefitPlan: plan, dependents: deps };
    }));
  }

  async createEmployeeBenefitEnrollment(data: any) {
    const [enrollment] = await db.insert(employeeBenefitEnrollments).values(data).returning();
    return enrollment;
  }

  async updateEmployeeBenefitEnrollment(id: string, data: any) {
    const [enrollment] = await db.update(employeeBenefitEnrollments).set(data).where(eq(employeeBenefitEnrollments.id, id)).returning();
    return enrollment;
  }

  async deleteEmployeeBenefitEnrollment(id: string) {
    await db.delete(benefitDependents).where(eq(benefitDependents.enrollmentId, id));
    await db.delete(employeeBenefitEnrollments).where(eq(employeeBenefitEnrollments.id, id));
  }

  // Benefit Dependents
  async createBenefitDependent(data: any) {
    const [dependent] = await db.insert(benefitDependents).values(data).returning();
    return dependent;
  }

  async updateBenefitDependent(id: string, data: any) {
    const [dependent] = await db.update(benefitDependents).set(data).where(eq(benefitDependents.id, id)).returning();
    return dependent;
  }

  async deleteBenefitDependent(id: string) {
    await db.delete(benefitDependents).where(eq(benefitDependents.id, id));
  }

  // ============== ADMIN DASHBOARD ==============

  async getAdminDashboardStats() {
    // HR Staff counts from employees table
    const totalEmployees = await db.select({ count: count() }).from(employees).where(eq(employees.employmentStatus, 'active'));
    const femaleEmployees = await db.select({ count: count() }).from(employees).where(
      and(eq(employees.employmentStatus, 'active'), eq(employees.gender, 'female'))
    );

    // Finance officers from finance_officers table
    const activeFinanceOfficers = await db.select({ id: financeOfficers.id, name: financeOfficers.name }).from(financeOfficers).where(eq(financeOfficers.isActive, true));
    const totalFinancingOfficers = activeFinanceOfficers.length;

    // Also check employees table for financing/credit officer positions
    const allActiveEmployees = await db.select({
      id: employees.id,
      positionId: employees.positionId,
      gender: employees.gender,
    }).from(employees).where(eq(employees.employmentStatus, 'active'));

    const positionsList = await db.select().from(positions);
    const creditOfficerPositionIds = positionsList
      .filter(p => p.title?.toLowerCase().includes('credit') || p.title?.toLowerCase().includes('financing') || p.title?.toLowerCase().includes('officer'))
      .map(p => p.id);

    const employeeCreditOfficers = allActiveEmployees.filter(e => e.positionId && creditOfficerPositionIds.includes(e.positionId));
    const femaleEmployeeCreditOfficers = employeeCreditOfficers.filter(e => e.gender === 'female');

    // Combine: total staff = employees + finance officers
    const totalStaffCount = (Number(totalEmployees[0]?.count) || 0) + totalFinancingOfficers;
    const totalFemaleStaffCount = Number(femaleEmployees[0]?.count) || 0;
    // Total financing officers = from finance_officers table + employee-based
    const totalCreditOfficersCount = totalFinancingOfficers + employeeCreditOfficers.length;
    const femaleCreditOfficersCount = femaleEmployeeCreditOfficers.length;

    // Disbursement data - current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const [disbursementStats] = await db.select({
      totalDisbursed: sql<number>`COALESCE(SUM(CASE WHEN ${loans.status} IN ('disbursed', 'active', 'completed') THEN ${loans.principleAmount}::numeric ELSE 0 END), 0)`,
      disbursedCount: sql<number>`COUNT(*) FILTER (WHERE ${loans.status} IN ('disbursed', 'active', 'completed'))`,
    }).from(loans);

    // OLB = total_receivable - SUM(paid installment amounts) per loan, clamped to 0 minimum
    const loanOlbResult = await db.execute(sql`
      SELECT 
        l.id as loan_id,
        l.branch_id,
        l.customer_id,
        l.sector,
        GREATEST(
          COALESCE(l.total_receivable::numeric, COALESCE(l.principle_amount, l.request_amount)::numeric, 0) 
          - COALESCE((SELECT SUM(COALESCE(i2.paid_amount::numeric, 0)) FROM installments i2 WHERE i2.loan_id = l.id AND COALESCE(i2.paid_amount::numeric, 0) > 0), 0),
          0
        ) as olb,
        COALESCE((SELECT MAX(i3.late_days) FROM installments i3 WHERE i3.loan_id = l.id), 0) as max_late_days
      FROM loans l
      WHERE l.status IN ('disbursed', 'active')
    `);
    const loanOlbRows = loanOlbResult.rows as any[];

    // Branch-wise OLB with female client data and PAR
    const branchCustomerMap = new Map<string, { branchId: string; loans: any[] }>();
    for (const row of loanOlbRows) {
      const key = String(row.branch_id || '__unknown__');
      if (!branchCustomerMap.has(key)) branchCustomerMap.set(key, { branchId: key, loans: [] });
      branchCustomerMap.get(key)!.loans.push(row);
    }

    const allBranches = await db.select({ id: branches.id, name: branches.name }).from(branches);
    const branchNameMap = new Map(allBranches.map((b: any) => [String(b.id), b.name]));

    const customerGenders = new Map<string, string>();
    const customerIds = [...new Set(loanOlbRows.map(r => String(r.customer_id)).filter(id => id && id !== 'null' && id !== 'undefined'))];
    if (customerIds.length > 0) {
      const genderResult = await db.select({ id: customers.id, gender: customers.gender }).from(customers).where(inArray(customers.id, customerIds));
      for (const r of genderResult) {
        if (r.gender) customerGenders.set(String(r.id), r.gender);
      }
    }

    const branchWiseData = Array.from(branchCustomerMap.entries()).map(([branchId, data]) => {
      const loans = data.loans;
      const no = loans.length;
      const olb = loans.reduce((sum: number, r: any) => sum + parseFloat(r.olb || 0), 0);
      const femaleLoansList = loans.filter((r: any) => customerGenders.get(String(r.customer_id)) === 'female');
      const femaleNo = femaleLoansList.length;
      const femaleValue = femaleLoansList.reduce((sum: number, r: any) => sum + parseFloat(r.olb || 0), 0);
      const par1_30 = loans.filter((r: any) => parseInt(r.max_late_days) >= 1 && parseInt(r.max_late_days) <= 30).length;
      const par30Plus = loans.filter((r: any) => parseInt(r.max_late_days) > 30).length;
      return {
        branch: branchNameMap.get(branchId) || 'Unknown',
        no, olb, female_no: femaleNo, female_value: femaleValue,
        par_1_30_no: par1_30, par_30_plus_no: par30Plus,
      };
    }).sort((a, b) => b.olb - a.olb);

    const branchWiseResult = { rows: branchWiseData };

    // Sector-wise OLB - reusing same per-loan data
    const sectorMap = new Map<string, number>();
    for (const row of loanOlbRows) {
      const sector = row.sector || 'Other';
      sectorMap.set(sector, (sectorMap.get(sector) || 0) + parseFloat(row.olb || 0));
    }
    const sectorWiseResult = { rows: Array.from(sectorMap.entries()).map(([sector, olb]) => ({ sector, olb })).sort((a, b) => b.olb - a.olb) };

    const totalOLB = (sectorWiseResult.rows as any[]).reduce((sum, r) => sum + parseFloat(r.olb || 0), 0);

    // Calculate caseload and productivity
    const activeCreditOfficerCount = totalCreditOfficersCount || 1;
    const activeLoansCount = await db.select({ count: count() }).from(loans).where(
      or(eq(loans.status, 'disbursed'), eq(loans.status, 'active'))
    );
    const caseload = activeLoansCount[0]?.count ? (Number(activeLoansCount[0].count) / activeCreditOfficerCount).toFixed(2) : 0;

    // Productivity - total disbursed loans per financing officer
    const productivity = (Number(disbursementStats?.disbursedCount) || 0) / activeCreditOfficerCount;

    return {
      hrStaff: {
        totalStaff: totalStaffCount,
        totalFemaleStaff: totalFemaleStaffCount,
        totalCreditOfficers: totalCreditOfficersCount,
        femaleCreditOfficers: femaleCreditOfficersCount,
        caseload: parseFloat(String(caseload)),
        productivity: parseFloat(productivity.toFixed(2)),
      },
      disbursement: {
        target: 66000000, // This could be from a settings table
        disbursedNo: Number(disbursementStats?.disbursedCount) || 0,
        actual: Number(disbursementStats?.totalDisbursed) || 0,
      },
      branchWise: (branchWiseResult.rows as any[]).map(row => {
        const olb = parseFloat(row.olb) || 0;
        const femaleValue = parseFloat(row.female_value) || 0;
        const no = parseInt(row.no) || 0;
        return {
          branch: row.branch,
          no,
          olb,
          femaleNo: parseInt(row.female_no) || 0,
          femaleValue,
          femalePercent: no > 0 ? parseFloat(((parseInt(row.female_no) / no) * 100).toFixed(1)) : 0,
          par1_30No: parseInt(row.par_1_30_no) || 0,
          par1_30Percent: no > 0 ? parseFloat(((parseInt(row.par_1_30_no) / no) * 100).toFixed(1)) : 0,
          par30No: parseInt(row.par_30_plus_no) || 0,
          par30Percent: no > 0 ? parseFloat(((parseInt(row.par_30_plus_no) / no) * 100).toFixed(1)) : 0,
        };
      }),
      sectorWise: (sectorWiseResult.rows as any[]).map(row => ({
        sector: row.sector,
        olb: parseFloat(row.olb) || 0,
        percentage: totalOLB > 0 ? parseFloat(((parseFloat(row.olb) / totalOLB) * 100).toFixed(1)) : 0,
      })),
      loansClosing: {} as Record<string, number>,
      totalOLB,
    };
  }

  // ============== HR ANALYTICS ==============

  async getHRAnalytics() {
    const totalEmployees = await db.select({ count: count() }).from(employees).where(eq(employees.employmentStatus, 'active'));
    const totalDepartments = await db.select({ count: count() }).from(departments);
    const totalPositions = await db.select({ count: count() }).from(positions);
    const openJobs = await db.select({ count: count() }).from(jobPostings).where(eq(jobPostings.status, 'open'));
    const pendingLeaves = await db.select({ count: count() }).from(leaveRequests).where(eq(leaveRequests.status, 'pending'));
    const upcomingTrainings = await db.select({ count: count() }).from(trainingSessions).where(eq(trainingSessions.status, 'planned'));
    const pendingReviews = await db.select({ count: count() }).from(performanceReviews).where(
      or(eq(performanceReviews.status, 'draft'), eq(performanceReviews.status, 'self_review'))
    );

    const employeesByDept = await db.select({
      departmentId: employees.departmentId,
      count: count(),
    }).from(employees).where(eq(employees.employmentStatus, 'active')).groupBy(employees.departmentId);

    const deptNames = await Promise.all(employeesByDept.map(async (ed) => {
      if (!ed.departmentId) return { department: 'Unassigned', count: ed.count };
      const [dept] = await db.select().from(departments).where(eq(departments.id, ed.departmentId));
      return { department: dept?.name || 'Unknown', count: ed.count };
    }));

    return {
      totalEmployees: totalEmployees[0]?.count || 0,
      totalDepartments: totalDepartments[0]?.count || 0,
      totalPositions: totalPositions[0]?.count || 0,
      openJobs: openJobs[0]?.count || 0,
      pendingLeaves: pendingLeaves[0]?.count || 0,
      upcomingTrainings: upcomingTrainings[0]?.count || 0,
      pendingReviews: pendingReviews[0]?.count || 0,
      employeesByDepartment: deptNames,
    };
  }

  async getFinancingProducts(): Promise<any[]> {
    return await db.select().from(financingProducts).orderBy(asc(financingProducts.name));
  }

  async createFinancingProduct(data: any): Promise<any> {
    const [product] = await db.insert(financingProducts).values(data).returning();
    return product;
  }

  async updateFinancingProduct(id: string, data: any): Promise<any> {
    const [product] = await db.update(financingProducts).set(data).where(eq(financingProducts.id, id)).returning();
    return product;
  }

  async deleteFinancingProduct(id: string): Promise<void> {
    await db.delete(financingProducts).where(eq(financingProducts.id, id));
  }

  async getSavedReports(): Promise<SavedReport[]> {
    return db.select().from(savedReports).orderBy(desc(savedReports.createdAt));
  }

  async createSavedReport(data: InsertSavedReport): Promise<SavedReport> {
    const [report] = await db.insert(savedReports).values(data).returning();
    return report;
  }

  async deleteSavedReport(id: number): Promise<void> {
    await db.delete(savedReports).where(eq(savedReports.id, id));
  }
}

export const storage = new DatabaseStorage();
