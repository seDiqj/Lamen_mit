import { db } from "./db";
import { eq, and, like, or, desc, sql, count } from "drizzle-orm";
import {
  users,
  userRoles,
  branches,
  financeOfficers,
  fundingSources,
  customers,
  customerBusinesses,
  businessLicenses,
  loans,
  collaterals,
  guarantors,
  loanApprovals,
  disbursements,
  installments,
  activityLogs,
  parCategories,
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
  type InsertCustomer,
  type Customer,
  type InsertLoan,
  type Loan,
  type InsertInstallment,
  type Installment,
  type InsertActivityLog,
  type ActivityLog,
  type InsertLoanApproval,
  type InsertDisbursement,
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
  
  // Funding Sources
  getFundingSources(search?: string): Promise<FundingSource[]>;
  getFundingSource(id: string): Promise<FundingSource | undefined>;
  createFundingSource(data: InsertFundingSource): Promise<FundingSource>;
  updateFundingSource(id: string, data: Partial<InsertFundingSource>): Promise<FundingSource>;
  getFundingSourceStats(): Promise<{ id: string; name: string; loanCount: number; totalAmount: string }[]>;
  
  // Customers
  getCustomers(search?: string, page?: number, limit?: number): Promise<{ customers: Customer[]; total: number }>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(data: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer>;
  
  // Loans
  getLoans(filters: { search?: string; status?: string; page?: number; limit?: number }): Promise<{ loans: any[]; total: number }>;
  getLoan(id: string): Promise<Loan | undefined>;
  getPendingLoans(search?: string): Promise<any[]>;
  getApprovedLoans(search?: string): Promise<any[]>;
  createLoan(data: InsertLoan): Promise<Loan>;
  updateLoan(id: string, data: Partial<InsertLoan>): Promise<Loan>;
  approveLoan(loanId: string, approvalData: InsertLoanApproval): Promise<void>;
  disburseLoan(loanId: string, disbursementData: InsertDisbursement): Promise<void>;
  
  // Installments
  getInstallments(filters: { search?: string; page?: number; limit?: number }): Promise<{ installments: any[]; total: number }>;
  markInstallmentPaid(id: string): Promise<Installment>;
  
  // Activity Logs
  getActivityLogs(filters: { search?: string; action?: string; page?: number; limit?: number }): Promise<{ logs: any[]; total: number }>;
  createActivityLog(data: InsertActivityLog): Promise<ActivityLog>;
  
  // Dashboard Stats
  getDashboardStats(): Promise<any>;
  
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
        requestAmount: loans.requestAmount,
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
        totalDisbursed: sql<number>`COALESCE(SUM(${loans.principleAmount}::numeric), 0)`,
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
      loansByStatus: loansByStatus.map(s => ({ status: s.status || "pending", count: Number(s.count) })),
      monthlyTrends,
      recentLoans,
    };
  }

  // Reports
  async getReportData(period: string): Promise<any> {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    
    return {
      portfolioSummary: {
        totalDisbursed: 1250000,
        totalOutstanding: 890000,
        totalCollected: 360000,
        averageLoanSize: 4500,
      },
      monthlyPerformance: months.map((month) => ({
        month,
        disbursed: Math.floor(Math.random() * 80000) + 40000,
        collected: Math.floor(Math.random() * 60000) + 30000,
        outstanding: Math.floor(Math.random() * 100000) + 50000,
      })),
      loansByProduct: [
        { product: "Personal Loan", count: 45, amount: 450000 },
        { product: "Business Loan", count: 32, amount: 640000 },
        { product: "Agricultural Loan", count: 28, amount: 280000 },
        { product: "Education Loan", count: 15, amount: 120000 },
      ],
      loansByBranch: [
        { branch: "Main Branch", count: 50, amount: 500000, percentage: 40 },
        { branch: "East Branch", count: 35, amount: 350000, percentage: 28 },
        { branch: "West Branch", count: 25, amount: 250000, percentage: 20 },
        { branch: "South Branch", count: 15, amount: 150000, percentage: 12 },
      ],
      collectionRate: months.map((month) => ({
        month,
        rate: Math.floor(Math.random() * 15) + 85,
      })),
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
  }
}

export const storage = new DatabaseStorage();
