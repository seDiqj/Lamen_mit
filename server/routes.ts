import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup session
  const PgSession = connectPgSimple(session);
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "sessions",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      req.session.userId = user.id;
      
      res.json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Register endpoint - Only allows first user registration for initial admin setup
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Check if any users exist - if so, block public registration
      const userCount = await storage.countUsers();
      if (userCount > 0) {
        return res.status(403).json({ message: "Registration is disabled. Please contact an administrator." });
      }

      const { username, password, firstName, lastName, email } = req.body;
      
      if (!username || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create first user as admin
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email: email || null,
      });

      await storage.setUserRole({ userId: user.id, role: "admin" });

      req.session.userId = user.id;

      res.status(201).json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Check if setup is needed (no users exist)
  app.get("/api/auth/setup-needed", async (req, res) => {
    try {
      const userCount = await storage.countUsers();
      res.json({ setupNeeded: userCount === 0 });
    } catch (error) {
      console.error("Setup check error:", error);
      res.status(500).json({ message: "Failed to check setup status" });
    }
  });

  // Get current user
  app.get("/api/auth/user", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Helper to log activity
  const logActivity = async (req: Request, action: string, entityType?: string, entityId?: string, details?: string) => {
    const userId = req.session.userId;
    if (userId) {
      await storage.createActivityLog({
        userId,
        action,
        entityType,
        entityId,
        details,
        ipAddress: req.ip || req.socket?.remoteAddress,
      });
    }
  };

  // Helper to check role
  const hasRole = async (userId: string, allowedRoles: string[]): Promise<boolean> => {
    const userRole = await storage.getUserRole(userId);
    return allowedRoles.includes(userRole?.role || "user");
  };

  // Middleware for role check
  const requireRole = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (await hasRole(userId, roles)) {
        return next();
      }
      return res.status(403).json({ message: "Forbidden" });
    };
  };

  // Get user role
  app.get("/api/user/role", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      const userRole = await storage.getUserRole(userId);
      
      // If no role exists, create default "user" role
      if (!userRole) {
        await storage.setUserRole({ userId, role: "admin" }); // First user gets admin
        return res.json({ role: "admin" });
      }
      
      res.json({ role: userRole.role });
    } catch (error) {
      console.error("Error fetching user role:", error);
      res.status(500).json({ message: "Failed to fetch user role" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // ===== BRANCHES =====
  app.get("/api/branches", isAuthenticated, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const branches = await storage.getBranches(search);
      res.json(branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      res.status(500).json({ message: "Failed to fetch branches" });
    }
  });

  app.post("/api/branches", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const branch = await storage.createBranch(req.body);
      await logActivity(req, "create_branch", "branch", branch.id, `Created branch: ${branch.name}`);
      res.status(201).json(branch);
    } catch (error) {
      console.error("Error creating branch:", error);
      res.status(500).json({ message: "Failed to create branch" });
    }
  });

  app.patch("/api/branches/:id", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const branch = await storage.updateBranch(req.params.id, req.body);
      await logActivity(req, "update_branch", "branch", branch.id, `Updated branch: ${branch.name}`);
      res.json(branch);
    } catch (error) {
      console.error("Error updating branch:", error);
      res.status(500).json({ message: "Failed to update branch" });
    }
  });

  // ===== OFFICERS =====
  app.get("/api/officers", isAuthenticated, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const officers = await storage.getOfficers(search);
      res.json(officers);
    } catch (error) {
      console.error("Error fetching officers:", error);
      res.status(500).json({ message: "Failed to fetch officers" });
    }
  });

  app.post("/api/officers", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const officer = await storage.createOfficer(req.body);
      await logActivity(req, "create_officer", "officer", officer.id, `Created officer: ${officer.name}`);
      res.status(201).json(officer);
    } catch (error) {
      console.error("Error creating officer:", error);
      res.status(500).json({ message: "Failed to create officer" });
    }
  });

  app.patch("/api/officers/:id", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const officer = await storage.updateOfficer(req.params.id, req.body);
      await logActivity(req, "update_officer", "officer", officer.id, `Updated officer: ${officer.name}`);
      res.json(officer);
    } catch (error) {
      console.error("Error updating officer:", error);
      res.status(500).json({ message: "Failed to update officer" });
    }
  });

  // ===== FUNDING SOURCES =====
  app.get("/api/funding-sources", isAuthenticated, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const fundingSources = await storage.getFundingSources(search);
      res.json(fundingSources);
    } catch (error) {
      console.error("Error fetching funding sources:", error);
      res.status(500).json({ message: "Failed to fetch funding sources" });
    }
  });

  app.post("/api/funding-sources", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const fundingSource = await storage.createFundingSource(req.body);
      await logActivity(req, "create_funding_source", "funding_source", fundingSource.id, `Created funding source: ${fundingSource.name}`);
      res.status(201).json(fundingSource);
    } catch (error) {
      console.error("Error creating funding source:", error);
      res.status(500).json({ message: "Failed to create funding source" });
    }
  });

  app.patch("/api/funding-sources/:id", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const fundingSource = await storage.updateFundingSource(req.params.id, req.body);
      await logActivity(req, "update_funding_source", "funding_source", fundingSource.id, `Updated funding source: ${fundingSource.name}`);
      res.json(fundingSource);
    } catch (error) {
      console.error("Error updating funding source:", error);
      res.status(500).json({ message: "Failed to update funding source" });
    }
  });

  // Funding source stats with loan count and total amounts
  app.get("/api/funding-sources/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getFundingSourceStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching funding source stats:", error);
      res.status(500).json({ message: "Failed to fetch funding source stats" });
    }
  });

  // ===== CUSTOMERS =====
  app.get("/api/customers", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const { search, page, limit } = req.query;
      const result = await storage.getCustomers(
        search as string | undefined,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 10
      );
      res.json({
        ...result,
        page: page ? parseInt(page as string) : 1,
        totalPages: Math.ceil(result.total / (limit ? parseInt(limit as string) : 10)),
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/:id", isAuthenticated, async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.post("/api/customers", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const customer = await storage.createCustomer(req.body);
      await logActivity(req, "create_customer", "customer", customer.id, `Created customer: ${customer.firstName} ${customer.lastName}`);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  app.patch("/api/customers/:id", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const customer = await storage.updateCustomer(req.params.id, req.body);
      await logActivity(req, "update_customer", "customer", customer.id, `Updated customer: ${customer.firstName} ${customer.lastName}`);
      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  // ===== LOANS =====
  app.get("/api/loans", isAuthenticated, async (req, res) => {
    try {
      const { search, status, page, limit } = req.query;
      const result = await storage.getLoans({
        search: search as string | undefined,
        status: status as string | undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      res.json({
        ...result,
        page: page ? parseInt(page as string) : 1,
        totalPages: Math.ceil(result.total / (limit ? parseInt(limit as string) : 10)),
      });
    } catch (error) {
      console.error("Error fetching loans:", error);
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });

  app.get("/api/loans/pending", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const loans = await storage.getPendingLoans(search);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching pending loans:", error);
      res.status(500).json({ message: "Failed to fetch pending loans" });
    }
  });

  app.get("/api/loans/approved", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const loans = await storage.getApprovedLoans(search);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching approved loans:", error);
      res.status(500).json({ message: "Failed to fetch approved loans" });
    }
  });

  app.get("/api/loans/:id", isAuthenticated, async (req, res) => {
    try {
      const loan = await storage.getLoan(req.params.id);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      res.json(loan);
    } catch (error) {
      console.error("Error fetching loan:", error);
      res.status(500).json({ message: "Failed to fetch loan" });
    }
  });

  app.post("/api/loans", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const loan = await storage.createLoan(req.body);
      await logActivity(req, "create_loan", "loan", loan.id, `Created loan: ${loan.applicationId}`);
      res.status(201).json(loan);
    } catch (error) {
      console.error("Error creating loan:", error);
      res.status(500).json({ message: "Failed to create loan" });
    }
  });

  app.patch("/api/loans/:id", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const loan = await storage.updateLoan(req.params.id, req.body);
      await logActivity(req, "update_loan", "loan", loan.id, `Updated loan: ${loan.applicationId}`);
      res.json(loan);
    } catch (error) {
      console.error("Error updating loan:", error);
      res.status(500).json({ message: "Failed to update loan" });
    }
  });

  app.post("/api/loans/:id/approve", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const loan = await storage.getLoan(req.params.id);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      await storage.approveLoan(req.params.id, {
        approvedAmount: loan.requestAmount,
        approvedDate: new Date().toISOString().split("T")[0],
        financingDurationMonths: loan.financingDurationMonths,
        gracePeriod: loan.gracePeriod,
        committeeDiscussion: req.body.notes,
        approvedById: req.user.claims.sub,
      });
      
      await logActivity(req, "approve_loan", "loan", req.params.id, `Approved loan: ${loan.applicationId}`);
      res.json({ message: "Loan approved successfully" });
    } catch (error) {
      console.error("Error approving loan:", error);
      res.status(500).json({ message: "Failed to approve loan" });
    }
  });

  app.post("/api/loans/:id/reject", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const loan = await storage.getLoan(req.params.id);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      await storage.updateLoan(req.params.id, { status: "defaulted" });
      await logActivity(req, "reject_loan", "loan", req.params.id, `Rejected loan: ${loan.applicationId} - Reason: ${req.body.notes}`);
      res.json({ message: "Loan rejected" });
    } catch (error) {
      console.error("Error rejecting loan:", error);
      res.status(500).json({ message: "Failed to reject loan" });
    }
  });

  app.post("/api/loans/:id/disburse", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const loan = await storage.getLoan(req.params.id);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      const today = new Date();
      const firstInstallmentDate = new Date(today);
      firstInstallmentDate.setMonth(firstInstallmentDate.getMonth() + 1);
      
      const maturityDate = new Date(today);
      maturityDate.setMonth(maturityDate.getMonth() + (loan.financingDurationMonths || 12));
      
      await storage.disburseLoan(req.params.id, {
        disbursementDate: today.toISOString().split("T")[0],
        firstInstallmentDate: firstInstallmentDate.toISOString().split("T")[0],
        maturityDate: maturityDate.toISOString().split("T")[0],
        disbursedById: req.user.claims.sub,
      });
      
      await logActivity(req, "disburse_loan", "loan", req.params.id, `Disbursed loan: ${loan.applicationId}`);
      res.json({ message: "Loan disbursed successfully" });
    } catch (error) {
      console.error("Error disbursing loan:", error);
      res.status(500).json({ message: "Failed to disburse loan" });
    }
  });

  // ===== INSTALLMENTS =====
  app.get("/api/installments", isAuthenticated, async (req, res) => {
    try {
      const { search, page, limit } = req.query;
      const result = await storage.getInstallments({
        search: search as string | undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      res.json({
        ...result,
        page: page ? parseInt(page as string) : 1,
        totalPages: Math.ceil(result.total / (limit ? parseInt(limit as string) : 10)),
      });
    } catch (error) {
      console.error("Error fetching installments:", error);
      res.status(500).json({ message: "Failed to fetch installments" });
    }
  });

  app.patch("/api/installments/:id/pay", isAuthenticated, async (req: any, res) => {
    try {
      const installment = await storage.markInstallmentPaid(req.params.id);
      await logActivity(req, "payment", "installment", req.params.id, `Recorded payment for installment #${installment.installmentNumber}`);
      res.json(installment);
    } catch (error) {
      console.error("Error recording payment:", error);
      res.status(500).json({ message: "Failed to record payment" });
    }
  });

  // ===== ACTIVITY LOGS =====
  app.get("/api/activity", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      const { search, action, page, limit } = req.query;
      const result = await storage.getActivityLogs({
        search: search as string | undefined,
        action: action as string | undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      res.json({
        ...result,
        page: page ? parseInt(page as string) : 1,
        totalPages: Math.ceil(result.total / (limit ? parseInt(limit as string) : 20)),
      });
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // ===== REPORTS =====
  app.get("/api/reports", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const period = req.query.period as string || "6months";
      const data = await storage.getReportData(period);
      res.json(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      res.status(500).json({ message: "Failed to fetch report data" });
    }
  });

  app.get("/api/reports/export", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const format = req.query.format as string;
      const period = req.query.period as string || "6months";
      
      // For now, return a simple message. In production, you'd generate actual files
      res.json({ message: `Export ${format} report for ${period} - Feature coming soon` });
    } catch (error) {
      console.error("Error exporting report:", error);
      res.status(500).json({ message: "Failed to export report" });
    }
  });

  // ===== PAR ANALYSIS =====
  app.get("/api/reports/par-analysis", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const data = await storage.getParAnalysis();
      res.json(data);
    } catch (error) {
      console.error("Error fetching PAR analysis:", error);
      res.status(500).json({ message: "Failed to fetch PAR analysis" });
    }
  });

  app.get("/api/reports/par-by-branch", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const data = await storage.getParByBranch();
      res.json(data);
    } catch (error) {
      console.error("Error fetching PAR by branch:", error);
      res.status(500).json({ message: "Failed to fetch PAR by branch" });
    }
  });

  app.get("/api/reports/par-by-officer", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const data = await storage.getParByOfficer();
      res.json(data);
    } catch (error) {
      console.error("Error fetching PAR by officer:", error);
      res.status(500).json({ message: "Failed to fetch PAR by officer" });
    }
  });

  app.get("/api/reports/par-by-product", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const data = await storage.getParByProduct();
      res.json(data);
    } catch (error) {
      console.error("Error fetching PAR by product:", error);
      res.status(500).json({ message: "Failed to fetch PAR by product" });
    }
  });

  app.get("/api/reports/aging", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const data = await storage.getAgingReport();
      res.json(data);
    } catch (error) {
      console.error("Error fetching aging report:", error);
      res.status(500).json({ message: "Failed to fetch aging report" });
    }
  });

  // PAR Loans Detail Endpoints
  app.get("/api/reports/par-loans/category/:categoryId", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const loans = await storage.getLoansByParCategory(categoryId);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching PAR loans by category:", error);
      res.status(500).json({ message: "Failed to fetch PAR loans by category" });
    }
  });

  app.get("/api/reports/par-loans/branch/:branchName", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const branchName = decodeURIComponent(req.params.branchName);
      const loans = await storage.getLoansByBranch(branchName);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching PAR loans by branch:", error);
      res.status(500).json({ message: "Failed to fetch PAR loans by branch" });
    }
  });

  app.get("/api/reports/par-loans/officer/:officerName", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const officerName = decodeURIComponent(req.params.officerName);
      const loans = await storage.getLoansByOfficer(officerName);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching PAR loans by officer:", error);
      res.status(500).json({ message: "Failed to fetch PAR loans by officer" });
    }
  });

  app.get("/api/reports/par-loans/product/:productName", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const productName = decodeURIComponent(req.params.productName);
      const loans = await storage.getLoansByProduct(productName);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching PAR loans by product:", error);
      res.status(500).json({ message: "Failed to fetch PAR loans by product" });
    }
  });

  // ===== ADMIN USERS =====
  app.get("/api/admin/users", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const users = await storage.getUsers(search);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id/role", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { role } = req.body;
      await storage.updateUserRole(req.params.id, role);
      await logActivity(req, "update_user_role", "user", req.params.id, `Updated user role to: ${role}`);
      res.json({ message: "User role updated successfully" });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Get single user
  app.get("/api/admin/users/:id", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      const user = await storage.getUserWithRole(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Create user (admin only)
  app.post("/api/admin/users", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { username, password, firstName, lastName, email, role } = req.body;
      
      if (!username || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email: email || null,
      });

      await storage.setUserRole({ userId: user.id, role: role || "user" });
      await logActivity(req, "create_user", "user", user.id, `Created user: ${username}`);

      res.status(201).json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: role || "user",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Update user (admin only)
  app.patch("/api/admin/users/:id", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { username, password, firstName, lastName, email, role } = req.body;
      const userId = req.params.id;

      const existingUser = await storage.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (username && username !== existingUser.username) {
        const usernameExists = await storage.getUserByUsername(username);
        if (usernameExists) {
          return res.status(400).json({ message: "Username already exists" });
        }
      }

      const updateData: any = {};
      if (username) updateData.username = username;
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (email !== undefined) updateData.email = email || null;
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        updateData.password = await bcrypt.hash(password, 10);
      }

      if (Object.keys(updateData).length > 0) {
        await storage.updateUser(userId, updateData);
      }

      if (role) {
        await storage.updateUserRole(userId, role);
      }

      await logActivity(req, "update_user", "user", userId, `Updated user: ${username || existingUser.username}`);

      const updatedUser = await storage.getUserWithRole(userId);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Delete user (admin only)
  app.delete("/api/admin/users/:id", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const userId = req.params.id;
      
      if (userId === req.session.userId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }

      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await storage.deleteUser(userId);
      await logActivity(req, "delete_user", "user", userId, `Deleted user: ${user.username}`);

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Seed data on startup
  try {
    await storage.seedData();
  } catch (error) {
    console.log("Seed data already exists or error seeding:", error);
  }

  return httpServer;
}
