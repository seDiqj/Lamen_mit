import { db } from "./db";
import bcrypt from "bcrypt";
import { eq, and, like, or, desc, asc, sql, count, gte, lte, isNull, inArray } from "drizzle-orm";
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
} from "@shared/schema";

export interface IStorage {
  // Users
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
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
  
  // PAR Categories
  getParCategories(): Promise<ParCategory[]>;
  getParCategory(id: number): Promise<ParCategory | undefined>;
  createParCategory(data: InsertParCategory): Promise<ParCategory>;
  updateParCategory(id: number, data: Partial<InsertParCategory>): Promise<ParCategory>;
  deleteParCategory(id: number): Promise<void>;
  
  // Customers
  getCustomers(search?: string, page?: number, limit?: number): Promise<{ customers: Customer[]; total: number }>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(data: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer>;
  getCustomerDocuments(customerId: string): Promise<CustomerDocument[]>;
  createCustomerDocument(data: InsertCustomerDocument): Promise<CustomerDocument>;
  
  // Loans
  getLoans(filters: { search?: string; status?: string; page?: number; limit?: number }): Promise<{ loans: any[]; total: number }>;
  getLoansWithDetails(filters: { status?: string }): Promise<any[]>;
  getLoan(id: string): Promise<Loan | undefined>;
  getPendingLoans(search?: string): Promise<any[]>;
  getApprovedLoans(search?: string): Promise<any[]>;
  createLoan(data: InsertLoan): Promise<Loan>;
  updateLoan(id: string, data: Partial<InsertLoan>): Promise<Loan>;
  approveLoan(loanId: string, approvalData: InsertLoanApproval): Promise<void>;
  disburseLoan(loanId: string, disbursementData: InsertDisbursement): Promise<void>;
  
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
  
  // Installments
  getInstallments(filters: { search?: string; page?: number; limit?: number }): Promise<{ installments: any[]; total: number }>;
  markInstallmentPaid(id: string): Promise<Installment>;
  
  // Activity Logs
  getActivityLogs(filters: { search?: string; action?: string; page?: number; limit?: number }): Promise<{ logs: any[]; total: number }>;
  createActivityLog(data: InsertActivityLog): Promise<ActivityLog>;
  
  // Dashboard Stats
  getDashboardStats(): Promise<any>;
  getBranchStats(): Promise<any[]>;
  
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
  getJournalEntries(filters?: { search?: string; startDate?: string; endDate?: string; isPosted?: boolean; page?: number; limit?: number }): Promise<{ entries: any[]; total: number; page: number; totalPages: number }>;
  getJournalEntry(id: string): Promise<any | undefined>;
  createJournalEntry(header: any, lines: any[]): Promise<any>;
  updateJournalEntry(id: string, data: any): Promise<any>;
  postJournalEntry(id: string, postedBy: string): Promise<void>;
  reverseJournalEntry(id: string, createdBy: string): Promise<any>;
  
  // Accounting - Reports
  getTrialBalance(asOfDate?: string): Promise<any[]>;
  getIncomeStatement(startDate: string, endDate: string): Promise<any>;
  getBalanceSheet(asOfDate: string): Promise<any>;
  getAccountStatement(accountId: string, startDate?: string, endDate?: string): Promise<any>;
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
  async getCustomers(search?: string, page = 1, limit = 10): Promise<{ customers: Customer[]; total: number }> {
    const offset = (page - 1) * limit;
    
    let baseQuery = db.select().from(customers);
    let countQuery = db.select({ count: count() }).from(customers);

    if (search) {
      const searchCondition = or(
        like(customers.firstName, `%${search}%`),
        like(customers.lastName, `%${search}%`),
        like(customers.customerNo, `%${search}%`),
        like(customers.phoneNumber, `%${search}%`)
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

  // Customer Documents
  async getCustomerDocuments(customerId: string): Promise<CustomerDocument[]> {
    return db.select().from(customerDocuments).where(eq(customerDocuments.customerId, customerId));
  }

  async createCustomerDocument(data: InsertCustomerDocument): Promise<CustomerDocument> {
    const [document] = await db.insert(customerDocuments).values(data).returning();
    return document;
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
    const [guarantor] = await db.insert(guarantors).values(data).returning();
    return guarantor;
  }

  async getGuarantors(loanId: string): Promise<Guarantor[]> {
    return db.select().from(guarantors).where(eq(guarantors.loanId, loanId));
  }

  async getGuarantorsByLoanId(loanId: string): Promise<Guarantor[]> {
    return db.select().from(guarantors).where(eq(guarantors.loanId, loanId));
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
  async getLoans(filters: { search?: string; status?: string; page?: number; limit?: number }): Promise<{ loans: any[]; total: number }> {
    const { search, status, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const results = await db
      .select({
        id: loans.id,
        applicationId: loans.applicationId,
        customerId: loans.customerId,
        branchId: loans.branchId,
        productName: loans.productName,
        productCode: loans.productCode,
        requestDate: loans.requestDate,
        requestedAmount: loans.requestAmount,
        principleAmount: loans.principleAmount,
        financingDurationMonths: loans.financingDurationMonths,
        status: loans.status,
        createdAt: loans.createdAt,
        fundingSourceId: loans.fundingSourceId,
        customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
        branchName: branches.name,
      })
      .from(loans)
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .leftJoin(branches, eq(loans.branchId, branches.id))
      .where(
        and(
          status && status !== "all" ? eq(loans.status, status as any) : undefined,
          search
            ? or(
                like(loans.applicationId, `%${search}%`),
                like(customers.firstName, `%${search}%`),
                like(customers.lastName, `%${search}%`)
              )
            : undefined
        )
      )
      .orderBy(desc(loans.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await db.select({ count: count() }).from(loans);

    return { loans: results, total: Number(total) };
  }

  async getLoan(id: string): Promise<Loan | undefined> {
    const [loan] = await db.select().from(loans).where(eq(loans.id, id));
    return loan;
  }

  async getPendingLoans(search?: string): Promise<any[]> {
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
      .where(eq(loans.status, "pending"));
  }

  async getApprovedLoans(search?: string): Promise<any[]> {
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
      .where(eq(loans.status, "approved"));
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

  async disburseLoan(loanId: string, disbursementData: InsertDisbursement): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.insert(disbursements).values({ ...disbursementData, loanId });
      await tx.update(loans).set({ status: "active", updatedAt: new Date() }).where(eq(loans.id, loanId));
      
      // Create installments
      const [loan] = await tx.select().from(loans).where(eq(loans.id, loanId));
      if (loan && loan.numberOfInstallments && loan.installmentAmount) {
        const numInstallments = loan.numberOfInstallments;
        const installmentAmount = parseFloat(loan.installmentAmount);
        const principlePerInstallment = parseFloat(loan.principleAmount || "0") / numInstallments;
        const marginPerInstallment = parseFloat(loan.profit || "0") / numInstallments;
        
        const startDate = new Date(disbursementData.firstInstallmentDate || new Date());
        
        for (let i = 1; i <= numInstallments; i++) {
          const dueDate = new Date(startDate);
          dueDate.setMonth(dueDate.getMonth() + i);
          
          await tx.insert(installments).values({
            loanId,
            installmentNumber: i,
            dueDate: dueDate.toISOString().split("T")[0],
            principleAmount: principlePerInstallment.toFixed(2),
            marginAmount: marginPerInstallment.toFixed(2),
            totalAmount: installmentAmount.toFixed(2),
            isPaid: false,
          });
        }
      }
    });
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
  async getInstallments(filters: { search?: string; page?: number; limit?: number }): Promise<{ installments: any[]; total: number }> {
    const { search, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const results = await db
      .select({
        id: installments.id,
        loanId: installments.loanId,
        installmentNumber: installments.installmentNumber,
        dueDate: installments.dueDate,
        principleAmount: installments.principleAmount,
        marginAmount: installments.marginAmount,
        totalAmount: installments.totalAmount,
        paymentDate: installments.paymentDate,
        lateDays: installments.lateDays,
        isPaid: installments.isPaid,
        loanApplicationId: loans.applicationId,
        customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
      })
      .from(installments)
      .leftJoin(loans, eq(installments.loanId, loans.id))
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .orderBy(installments.dueDate)
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await db.select({ count: count() }).from(installments);

    return { installments: results, total: Number(total) };
  }

  async markInstallmentPaid(id: string): Promise<Installment> {
    const [installment] = await db
      .update(installments)
      .set({
        isPaid: true,
        paymentDate: new Date().toISOString().split("T")[0],
        lateDays: sql`GREATEST(0, EXTRACT(DAY FROM NOW() - ${installments.dueDate}))`,
      })
      .where(eq(installments.id, id))
      .returning();
    return installment;
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
  async getDashboardStats(): Promise<any> {
    const [loanCounts] = await db
      .select({
        total: count(),
        active: sql<number>`COUNT(*) FILTER (WHERE ${loans.status} = 'active')`,
        pending: sql<number>`COUNT(*) FILTER (WHERE ${loans.status} = 'pending')`,
      })
      .from(loans);

    const [customerCount] = await db.select({ count: count() }).from(customers);
    
    const [amounts] = await db
      .select({
        totalDisbursed: sql<number>`COALESCE(SUM(CASE WHEN ${loans.status} IN ('disbursed', 'active', 'completed') THEN ${loans.principleAmount}::numeric ELSE 0 END), 0)`,
        totalCollection: sql<number>`COALESCE(SUM(${loans.totalCollection}::numeric), 0)`,
        outstandingPortfolio: sql<number>`COALESCE(SUM(${loans.outstandingPortfolio}::numeric), 0)`,
      })
      .from(loans);

    const recentLoans = await db
      .select({
        id: loans.id,
        applicationId: loans.applicationId,
        amount: sql<string>`COALESCE(${loans.principleAmount}, ${loans.requestAmount})`,
        status: loans.status,
        date: loans.requestDate,
        customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
      })
      .from(loans)
      .leftJoin(customers, eq(loans.customerId, customers.id))
      .orderBy(desc(loans.createdAt))
      .limit(5);

    const loansByStatus = await db
      .select({
        status: loans.status,
        count: count(),
        requestedAmount: sql<number>`COALESCE(SUM(CASE 
          WHEN ${loans.status} IN ('disbursed', 'active', 'completed') THEN ${loans.principleAmount}::numeric 
          ELSE ${loans.requestAmount}::numeric 
        END), 0)`,
      })
      .from(loans)
      .groupBy(loans.status);

    // Get real monthly data from database based on disbursement date
    const monthlyData = await db
      .select({
        month: sql<string>`TO_CHAR(${disbursements.disbursementDate}, 'Mon')`,
        monthNum: sql<string>`TO_CHAR(${disbursements.disbursementDate}, 'MM')`,
        disbursed: sql<number>`COALESCE(SUM(${loans.principleAmount}::numeric), 0)`,
        collected: sql<number>`COALESCE(SUM(${loans.totalCollection}::numeric), 0)`,
      })
      .from(disbursements)
      .leftJoin(loans, eq(disbursements.loanId, loans.id))
      .where(sql`${disbursements.disbursementDate} IS NOT NULL`)
      .groupBy(sql`TO_CHAR(${disbursements.disbursementDate}, 'Mon'), TO_CHAR(${disbursements.disbursementDate}, 'MM')`)
      .orderBy(sql`TO_CHAR(${disbursements.disbursementDate}, 'MM')`);

    const monthlyTrends = monthlyData.map(m => ({
      month: m.month,
      disbursed: Number(m.disbursed),
      collected: Number(m.collected),
    }));

    return {
      totalLoans: Number(loanCounts.total),
      activeLoans: Number(loanCounts.active),
      pendingLoans: Number(loanCounts.pending),
      totalCustomers: Number(customerCount.count),
      totalDisbursed: Number(amounts.totalDisbursed),
      totalCollected: Number(amounts.totalCollection),
      outstandingBalance: Number(amounts.outstandingPortfolio),
      overdueLoans: 0,
      loansByStatus: loansByStatus.map(s => ({ status: s.status || "pending", count: Number(s.count), requestedAmount: Number(s.requestedAmount) })),
      monthlyTrends,
      recentLoans,
    };
  }

  async getBranchStats(): Promise<any[]> {
    const result = await db.execute(sql`
      SELECT 
        COALESCE(b.name, 'Unknown') as branch_name,
        COUNT(DISTINCT l.id) as loan_count,
        COUNT(DISTINCT l.customer_id) as customer_count,
        COALESCE(SUM(COALESCE(l.principle_amount, l.request_amount)::numeric), 0) as total_disbursed,
        COALESCE(SUM(l.total_collection::numeric), 0) as total_collected,
        COALESCE(SUM(l.outstanding_portfolio::numeric), 0) as outstanding_balance
      FROM loans l
      LEFT JOIN branches b ON l.branch_id = b.id
      WHERE l.status IN ('disbursed', 'active', 'completed')
      GROUP BY b.name
      ORDER BY total_disbursed DESC
    `);

    return (result.rows as any[]).map(row => ({
      branchName: row.branch_name || 'Unknown',
      loanCount: parseInt(row.loan_count) || 0,
      customerCount: parseInt(row.customer_count) || 0,
      totalDisbursed: parseFloat(row.total_disbursed) || 0,
      totalCollected: parseFloat(row.total_collected) || 0,
      outstandingBalance: parseFloat(row.outstanding_balance) || 0,
    }));
  }

  // Reports
  async getReportData(period: string): Promise<any> {
    // Get portfolio summary from actual data
    const summaryResult = await db.execute(sql`
      SELECT 
        COALESCE(SUM(COALESCE(principle_amount, request_amount)), 0) as total_disbursed,
        COALESCE(SUM(outstanding_portfolio), 0) as total_outstanding,
        COUNT(*) as loan_count
      FROM loans
      WHERE status IN ('disbursed', 'active', 'completed')
    `);
    
    const summary = summaryResult.rows[0] as any;
    const totalDisbursed = parseFloat(summary.total_disbursed) || 0;
    const totalOutstanding = parseFloat(summary.total_outstanding) || 0;
    const loanCount = parseInt(summary.loan_count) || 1;
    const totalCollected = totalDisbursed - totalOutstanding;
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
    // Get PAR categories
    const categories = await db.select().from(parCategories).orderBy(parCategories.startDay);
    
    // Get loan late days summary (sum of late days per loan from installments)
    const loanLateDays = await db.execute(sql`
      SELECT 
        l.id as loan_id,
        l.application_id,
        COALESCE(l.principle_amount, l.request_amount) as loan_amount,
        l.outstanding_portfolio,
        c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
        COALESCE(SUM(CASE WHEN i.late_days > 0 THEN i.late_days ELSE 0 END), 0) as total_late_days
      FROM loans l
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN installments i ON l.id = i.loan_id
      GROUP BY l.id, l.application_id, l.principle_amount, l.request_amount, l.outstanding_portfolio, c.first_name, c.last_name
    `);
    
    // Initialize category results
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
      loans: [] as any[]
    }));
    
    // Add "Current" category for loans with 0 late days
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
      loans: [] as any[]
    };
    
    // Categorize loans
    for (const loan of loanLateDays.rows as any[]) {
      const lateDays = parseInt(loan.total_late_days) || 0;
      const loanAmount = parseFloat(loan.loan_amount) || 0;
      const outstanding = parseFloat(loan.outstanding_portfolio) || 0;
      
      if (lateDays === 0) {
        currentCategory.loanCount++;
        currentCategory.totalAmount += loanAmount;
        currentCategory.outstandingAmount += outstanding;
        currentCategory.loans.push({
          loanId: loan.application_id,
          customerName: loan.customer_name,
          loanAmount,
          outstanding,
          lateDays
        });
      } else {
        for (const cat of parResults) {
          if (lateDays >= cat.startDay && lateDays <= cat.endDay) {
            cat.loanCount++;
            cat.totalAmount += loanAmount;
            cat.outstandingAmount += outstanding;
            cat.provisionAmount += outstanding * (cat.provisionPercent / 100);
            cat.loans.push({
              loanId: loan.application_id,
              customerName: loan.customer_name,
              loanAmount,
              outstanding,
              lateDays
            });
            break;
          }
        }
      }
    }
    
    // Calculate totals
    const allCategories = [currentCategory, ...parResults];
    const totalLoans = allCategories.reduce((sum, c) => sum + c.loanCount, 0);
    const totalPortfolio = allCategories.reduce((sum, c) => sum + c.totalAmount, 0);
    const totalOutstanding = allCategories.reduce((sum, c) => sum + c.outstandingAmount, 0);
    const totalProvision = allCategories.reduce((sum, c) => sum + c.provisionAmount, 0);
    
    // Add percentages
    const categoriesWithPercentage = allCategories.map(cat => ({
      ...cat,
      loanPercentage: totalLoans > 0 ? ((cat.loanCount / totalLoans) * 100).toFixed(2) : '0',
      amountPercentage: totalPortfolio > 0 ? ((cat.totalAmount / totalPortfolio) * 100).toFixed(2) : '0',
    }));
    
    return {
      categories: categoriesWithPercentage,
      summary: {
        totalLoans,
        totalPortfolio,
        totalOutstanding,
        totalProvision,
        parRatio: totalOutstanding > 0 ? (((totalOutstanding - currentCategory.outstandingAmount) / totalOutstanding) * 100).toFixed(2) : '0'
      }
    };
  }

  async getParByBranch(): Promise<any> {
    const result = await db.execute(sql`
      SELECT 
        b.name as branch_name,
        COUNT(DISTINCT l.id) as loan_count,
        COALESCE(SUM(COALESCE(l.principle_amount, l.request_amount)), 0) as total_amount,
        COALESCE(SUM(l.outstanding_portfolio), 0) as outstanding_amount,
        COALESCE(SUM(CASE WHEN i.late_days > 0 THEN l.outstanding_portfolio ELSE 0 END), 0) as par_amount
      FROM loans l
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN installments i ON l.id = i.loan_id
      GROUP BY b.id, b.name
      ORDER BY outstanding_amount DESC
    `);
    
    const branchData = (result.rows as any[]).map(row => ({
      branch: row.branch_name || 'Unassigned',
      loanCount: parseInt(row.loan_count) || 0,
      totalAmount: parseFloat(row.total_amount) || 0,
      outstandingAmount: parseFloat(row.outstanding_amount) || 0,
      parAmount: parseFloat(row.par_amount) || 0,
      parRatio: row.outstanding_amount > 0 ? ((row.par_amount / row.outstanding_amount) * 100).toFixed(2) : '0'
    }));
    
    return branchData;
  }

  async getParByOfficer(): Promise<any> {
    const result = await db.execute(sql`
      SELECT 
        fo.name as officer_name,
        b.name as branch_name,
        COUNT(DISTINCT l.id) as loan_count,
        COALESCE(SUM(COALESCE(l.principle_amount, l.request_amount)), 0) as total_amount,
        COALESCE(SUM(l.outstanding_portfolio), 0) as outstanding_amount,
        COALESCE(SUM(CASE WHEN i.late_days > 0 THEN l.outstanding_portfolio ELSE 0 END), 0) as par_amount
      FROM loans l
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN installments i ON l.id = i.loan_id
      GROUP BY fo.id, fo.name, b.name
      ORDER BY outstanding_amount DESC
    `);
    
    const officerData = (result.rows as any[]).map(row => ({
      officer: row.officer_name || 'Unassigned',
      branch: row.branch_name || 'N/A',
      loanCount: parseInt(row.loan_count) || 0,
      totalAmount: parseFloat(row.total_amount) || 0,
      outstandingAmount: parseFloat(row.outstanding_amount) || 0,
      parAmount: parseFloat(row.par_amount) || 0,
      parRatio: row.outstanding_amount > 0 ? ((row.par_amount / row.outstanding_amount) * 100).toFixed(2) : '0'
    }));
    
    return officerData;
  }

  async getParByProduct(): Promise<any> {
    const result = await db.execute(sql`
      SELECT 
        l.product_name,
        COUNT(DISTINCT l.id) as loan_count,
        COALESCE(SUM(COALESCE(l.principle_amount, l.request_amount)), 0) as total_amount,
        COALESCE(SUM(l.outstanding_portfolio), 0) as outstanding_amount,
        COALESCE(SUM(CASE WHEN i.late_days > 0 THEN l.outstanding_portfolio ELSE 0 END), 0) as par_amount
      FROM loans l
      LEFT JOIN installments i ON l.id = i.loan_id
      GROUP BY l.product_name
      ORDER BY outstanding_amount DESC
    `);
    
    const productData = (result.rows as any[]).map(row => ({
      product: row.product_name || 'Unknown',
      loanCount: parseInt(row.loan_count) || 0,
      totalAmount: parseFloat(row.total_amount) || 0,
      outstandingAmount: parseFloat(row.outstanding_amount) || 0,
      parAmount: parseFloat(row.par_amount) || 0,
      parRatio: row.outstanding_amount > 0 ? ((row.par_amount / row.outstanding_amount) * 100).toFixed(2) : '0'
    }));
    
    return productData;
  }

  async getAgingReport(): Promise<any> {
    const result = await db.execute(sql`
      SELECT 
        l.application_id,
        c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
        b.name as branch_name,
        fo.name as officer_name,
        l.product_name,
        COALESCE(l.principle_amount, l.request_amount) as loan_amount,
        l.outstanding_portfolio,
        COALESCE(SUM(i.late_days), 0) as total_late_days,
        MAX(i.due_date) as last_due_date
      FROM loans l
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      LEFT JOIN installments i ON l.id = i.loan_id
      WHERE l.outstanding_portfolio > 0
      GROUP BY l.id, l.application_id, c.first_name, c.last_name, b.name, fo.name, l.product_name, l.principle_amount, l.request_amount, l.outstanding_portfolio
      HAVING COALESCE(SUM(i.late_days), 0) > 0
      ORDER BY total_late_days DESC
      LIMIT 100
    `);
    
    const agingData = (result.rows as any[]).map(row => ({
      loanId: row.application_id,
      customerName: row.customer_name?.trim() || 'Unknown',
      branch: row.branch_name || 'N/A',
      officer: row.officer_name || 'N/A',
      product: row.product_name || 'N/A',
      loanAmount: parseFloat(row.loan_amount) || 0,
      outstanding: parseFloat(row.outstanding_portfolio) || 0,
      totalLateDays: parseInt(row.total_late_days) || 0,
      lastDueDate: row.last_due_date
    }));
    
    return agingData;
  }

  async getLoansByParCategory(categoryId: number): Promise<any[]> {
    // First get the PAR category to know the days range
    const categoryResult = await db.execute(sql`
      SELECT start_day, end_day FROM par_categories WHERE id = ${categoryId}
    `);
    
    if (!categoryResult.rows || categoryResult.rows.length === 0) {
      return [];
    }
    
    const category = categoryResult.rows[0] as any;
    const startDay = category.start_day;
    const endDay = category.end_day;
    
    const result = await db.execute(sql`
      SELECT 
        l.id,
        l.application_id,
        c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
        b.name as branch_name,
        fo.name as officer_name,
        l.product_name,
        COALESCE(l.principle_amount, l.request_amount) as loan_amount,
        l.outstanding_portfolio,
        COALESCE(SUM(i.late_days), 0) as total_late_days
      FROM loans l
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      LEFT JOIN installments i ON l.id = i.loan_id
      WHERE l.outstanding_portfolio > 0
      GROUP BY l.id, l.application_id, c.first_name, c.last_name, b.name, fo.name, l.product_name, l.principle_amount, l.request_amount, l.outstanding_portfolio
      HAVING COALESCE(SUM(i.late_days), 0) >= ${startDay} AND COALESCE(SUM(i.late_days), 0) <= ${endDay}
      ORDER BY total_late_days DESC
    `);
    
    return (result.rows as any[]).map(row => ({
      id: row.id,
      applicationId: row.application_id,
      customerName: row.customer_name?.trim() || 'Unknown',
      branch: row.branch_name || 'N/A',
      officer: row.officer_name || 'N/A',
      product: row.product_name || 'N/A',
      loanAmount: parseFloat(row.loan_amount) || 0,
      outstanding: parseFloat(row.outstanding_portfolio) || 0,
      lateDays: parseInt(row.total_late_days) || 0
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
        COALESCE(l.principle_amount, l.request_amount) as loan_amount,
        l.outstanding_portfolio,
        COALESCE(SUM(i.late_days), 0) as total_late_days
      FROM loans l
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      LEFT JOIN installments i ON l.id = i.loan_id
      WHERE l.outstanding_portfolio > 0 AND b.name = ${branchName}
      GROUP BY l.id, l.application_id, c.first_name, c.last_name, b.name, fo.name, l.product_name, l.principle_amount, l.request_amount, l.outstanding_portfolio
      ORDER BY l.outstanding_portfolio DESC
    `);
    
    return (result.rows as any[]).map(row => ({
      id: row.id,
      applicationId: row.application_id,
      customerName: row.customer_name?.trim() || 'Unknown',
      branch: row.branch_name || 'N/A',
      officer: row.officer_name || 'N/A',
      product: row.product_name || 'N/A',
      loanAmount: parseFloat(row.loan_amount) || 0,
      outstanding: parseFloat(row.outstanding_portfolio) || 0,
      lateDays: parseInt(row.total_late_days) || 0
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
        COALESCE(l.principle_amount, l.request_amount) as loan_amount,
        l.outstanding_portfolio,
        COALESCE(SUM(i.late_days), 0) as total_late_days
      FROM loans l
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      LEFT JOIN installments i ON l.id = i.loan_id
      WHERE l.outstanding_portfolio > 0 AND fo.name = ${officerName}
      GROUP BY l.id, l.application_id, c.first_name, c.last_name, b.name, fo.name, l.product_name, l.principle_amount, l.request_amount, l.outstanding_portfolio
      ORDER BY l.outstanding_portfolio DESC
    `);
    
    return (result.rows as any[]).map(row => ({
      id: row.id,
      applicationId: row.application_id,
      customerName: row.customer_name?.trim() || 'Unknown',
      branch: row.branch_name || 'N/A',
      officer: row.officer_name || 'N/A',
      product: row.product_name || 'N/A',
      loanAmount: parseFloat(row.loan_amount) || 0,
      outstanding: parseFloat(row.outstanding_portfolio) || 0,
      lateDays: parseInt(row.total_late_days) || 0
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
        COALESCE(l.principle_amount, l.request_amount) as loan_amount,
        l.outstanding_portfolio,
        COALESCE(SUM(i.late_days), 0) as total_late_days
      FROM loans l
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      LEFT JOIN installments i ON l.id = i.loan_id
      WHERE l.outstanding_portfolio > 0 AND l.product_name = ${productName}
      GROUP BY l.id, l.application_id, c.first_name, c.last_name, b.name, fo.name, l.product_name, l.principle_amount, l.request_amount, l.outstanding_portfolio
      ORDER BY l.outstanding_portfolio DESC
    `);
    
    return (result.rows as any[]).map(row => ({
      id: row.id,
      applicationId: row.application_id,
      customerName: row.customer_name?.trim() || 'Unknown',
      branch: row.branch_name || 'N/A',
      officer: row.officer_name || 'N/A',
      product: row.product_name || 'N/A',
      loanAmount: parseFloat(row.loan_amount) || 0,
      outstanding: parseFloat(row.outstanding_portfolio) || 0,
      lateDays: parseInt(row.total_late_days) || 0
    }));
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
        createdAt: users.createdAt,
        role: userRoles.role,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
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
        createdAt: users.createdAt,
        role: userRoles.role,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
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
      "fad-review",
      "risk-compliance",
      "committee-voting",
      "approvals",
      "disbursements",
      "payments",
      "reports",
      "par-report",
      "settings",
      "branches",
      "officers",
      "funding-sources",
      "lookup",
      "par-categories",
      "activity-logs",
      "users",
      "page-permissions",
      "chart-of-accounts",
      "journal-entries",
      "account-statement",
      "trial-balance",
      "income-statement",
      "balance-sheet",
    ];
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
        .map(acc => ({
          ...acc,
          children: buildTree(acc.id)
        }));
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
  async getJournalEntries(filters?: { search?: string; startDate?: string; endDate?: string; isPosted?: boolean; page?: number; limit?: number }): Promise<{ entries: any[]; total: number; page: number; totalPages: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;
    
    const conditions = [];
    if (filters?.search) {
      conditions.push(or(
        like(journalEntries.entryNumber, `%${filters.search}%`),
        like(journalEntries.description, `%${filters.search}%`),
        like(journalEntries.reference, `%${filters.search}%`)
      ));
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
      .orderBy(desc(journalEntries.entryDate), desc(journalEntries.createdAt))
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
      })
      .from(journalLines)
      .leftJoin(accounts, eq(journalLines.accountId, accounts.id))
      .where(eq(journalLines.journalEntryId, id));
    
    return { ...entry, lines };
  }

  async createJournalEntry(header: InsertJournalEntry, lines: InsertJournalLine[]): Promise<JournalEntry> {
    const totalDebit = lines.reduce((sum, line) => sum + Number(line.debitAmount || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + Number(line.creditAmount || 0), 0);
    
    const [entry] = await db.insert(journalEntries).values({
      ...header,
      totalDebit: totalDebit.toString(),
      totalCredit: totalCredit.toString(),
    }).returning();
    
    for (const line of lines) {
      await db.insert(journalLines).values({
        ...line,
        journalEntryId: entry.id,
      });
    }
    
    return entry;
  }

  async updateJournalEntry(id: string, data: any): Promise<JournalEntry> {
    const { entryDate, description, reference, referenceType, totalDebit, totalCredit, lines } = data;
    
    // Update the entry
    const [entry] = await db.update(journalEntries)
      .set({
        entryDate,
        description,
        reference,
        referenceType,
        totalDebit,
        totalCredit,
        updatedAt: new Date(),
      })
      .where(eq(journalEntries.id, id))
      .returning();
    
    // Delete existing lines
    await db.delete(journalLines).where(eq(journalLines.journalEntryId, id));
    
    // Insert new lines
    for (const line of lines) {
      await db.insert(journalLines).values({
        journalEntryId: id,
        accountId: line.accountId,
        description: line.description || null,
        debitAmount: line.debitAmount || "0",
        creditAmount: line.creditAmount || "0",
      });
    }
    
    return entry;
  }

  async postJournalEntry(id: string, postedBy: string): Promise<void> {
    const entry = await this.getJournalEntry(id);
    if (!entry || entry.isPosted) return;
    
    // Update account balances
    for (const line of entry.lines) {
      const [account] = await db.select().from(accounts).where(eq(accounts.id, line.accountId));
      if (!account) continue;
      
      let newBalance = Number(account.currentBalance || 0);
      const debit = Number(line.debitAmount || 0);
      const credit = Number(line.creditAmount || 0);
      
      // For asset/expense accounts: debit increases, credit decreases
      // For liability/equity/income accounts: credit increases, debit decreases
      if (account.accountType === 'asset' || account.accountType === 'expense') {
        newBalance += debit - credit;
      } else {
        newBalance += credit - debit;
      }
      
      await db.update(accounts).set({ currentBalance: newBalance.toString() }).where(eq(accounts.id, line.accountId));
    }
    
    await db.update(journalEntries).set({ isPosted: true, postedBy, postedAt: new Date() }).where(eq(journalEntries.id, id));
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
    }));
    
    const reversalEntry = await this.createJournalEntry({
      entryNumber,
      entryDate: new Date().toISOString().split('T')[0],
      description: `Reversal of ${original.entryNumber}`,
      reference: original.reference,
      referenceType: 'reversal',
      referenceId: original.id,
      createdBy,
    }, reversedLines);
    
    await db.update(journalEntries).set({ isReversed: true, reversedEntryId: reversalEntry.id }).where(eq(journalEntries.id, id));
    
    return reversalEntry;
  }

  async getNextEntryNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const [result] = await db
      .select({ count: count() })
      .from(journalEntries)
      .where(like(journalEntries.entryNumber, `JE${year}%`));
    
    const nextNum = (result?.count || 0) + 1;
    return `JE${year}${nextNum.toString().padStart(6, '0')}`;
  }

  // Accounting Reports
  async getTrialBalance(asOfDate?: string): Promise<any[]> {
    const allAccounts = await db.select().from(accounts).where(eq(accounts.isActive, true)).orderBy(asc(accounts.accountCode));
    
    return allAccounts.map(acc => {
      const balance = Number(acc.currentBalance) || 0;
      const isDebitNormal = acc.accountType === 'asset' || acc.accountType === 'expense';
      const isCreditNormal = acc.accountType === 'liability' || acc.accountType === 'equity' || acc.accountType === 'income';
      
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
    const incomeAccounts = await db.select().from(accounts).where(eq(accounts.accountType, 'income'));
    const expenseAccounts = await db.select().from(accounts).where(eq(accounts.accountType, 'expense'));
    
    const income = incomeAccounts.map(acc => ({
      accountCode: acc.accountCode,
      accountName: acc.accountName,
      amount: Math.abs(Number(acc.currentBalance || 0)),
    }));
    
    const expenses = expenseAccounts.map(acc => ({
      accountCode: acc.accountCode,
      accountName: acc.accountName,
      amount: Math.abs(Number(acc.currentBalance || 0)),
    }));
    
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      income,
      expenses,
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      period: { startDate, endDate },
    };
  }

  async getBalanceSheet(asOfDate: string): Promise<any> {
    const assetAccounts = await db.select().from(accounts).where(eq(accounts.accountType, 'asset'));
    const liabilityAccounts = await db.select().from(accounts).where(eq(accounts.accountType, 'liability'));
    const equityAccounts = await db.select().from(accounts).where(eq(accounts.accountType, 'equity'));
    const incomeAccounts = await db.select().from(accounts).where(eq(accounts.accountType, 'income'));
    const expenseAccounts = await db.select().from(accounts).where(eq(accounts.accountType, 'expense'));
    
    const assets = assetAccounts.map(acc => ({
      accountCode: acc.accountCode,
      accountName: acc.accountName,
      amount: Number(acc.currentBalance || 0),
    }));
    
    const liabilities = liabilityAccounts.map(acc => ({
      accountCode: acc.accountCode,
      accountName: acc.accountName,
      amount: Math.abs(Number(acc.currentBalance || 0)),
    }));
    
    const equity = equityAccounts.map(acc => ({
      accountCode: acc.accountCode,
      accountName: acc.accountName,
      amount: Math.abs(Number(acc.currentBalance || 0)),
    }));
    
    // Calculate net income from income and expense accounts
    // Income accounts have credit balances (negative in our system), expense have debit balances (positive)
    const totalIncome = incomeAccounts.reduce((sum, acc) => sum + Math.abs(Number(acc.currentBalance || 0)), 0);
    const totalExpenses = expenseAccounts.reduce((sum, acc) => sum + Math.abs(Number(acc.currentBalance || 0)), 0);
    const netIncome = totalIncome - totalExpenses;
    
    const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);
    const totalEquityFromAccounts = equity.reduce((sum, e) => sum + e.amount, 0);
    const totalEquity = totalEquityFromAccounts + netIncome;
    
    return {
      assets,
      liabilities,
      equity,
      netIncome,
      totalIncome,
      totalExpenses,
      totalAssets,
      totalLiabilities,
      totalEquity,
      asOfDate,
    };
  }

  async getAccountStatement(accountId: string, startDate?: string, endDate?: string): Promise<any> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, accountId));
    if (!account) return null;
    
    let query = db
      .select({
        entryDate: journalEntries.entryDate,
        entryNumber: journalEntries.entryNumber,
        description: journalLines.description,
        reference: journalEntries.reference,
        debitAmount: journalLines.debitAmount,
        creditAmount: journalLines.creditAmount,
      })
      .from(journalLines)
      .leftJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
      .where(and(
        eq(journalLines.accountId, accountId),
        eq(journalEntries.isPosted, true)
      ));
    
    const transactions = await query.orderBy(asc(journalEntries.entryDate));
    
    let runningBalance = Number(account.openingBalance || 0);
    const statement = transactions.map(tx => {
      const debit = Number(tx.debitAmount || 0);
      const credit = Number(tx.creditAmount || 0);
      
      if (account.accountType === 'asset' || account.accountType === 'expense') {
        runningBalance += debit - credit;
      } else {
        runningBalance += credit - debit;
      }
      
      return {
        ...tx,
        balance: runningBalance,
      };
    });
    
    return {
      account,
      openingBalance: Number(account.openingBalance || 0),
      transactions: statement,
      closingBalance: runningBalance,
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
    const employeeCount = await db.select({ count: count() }).from(employees);
    const nextNumber = (employeeCount[0]?.count || 0) + 1;
    const employeeCode = `EMP${String(nextNumber).padStart(5, '0')}`;
    
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
    }).returning();
    return employee;
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
}

export const storage = new DatabaseStorage();
