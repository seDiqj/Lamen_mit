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
  // Trust proxy for production (Replit uses reverse proxy)
  app.set("trust proxy", 1);
  
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
      proxy: true,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

  // Logout with redirect - clears session and redirects to landing page
  app.get("/api/logout-redirect", async (req, res) => {
    const userId = req.session?.userId;
    
    // Delete session from database
    if (userId) {
      try {
        await db.execute(sql`DELETE FROM sessions WHERE sess::text LIKE ${'%"userId":"' + userId + '"%'}`);
      } catch (e) {
        console.error("Failed to delete session from DB:", e);
      }
    }
    
    // Clear userId from session
    if (req.session) {
      delete (req.session as any).userId;
      req.session.destroy((err) => {
        if (err) console.error("Session destroy error:", err);
      });
    }
    
    // Clear cookies
    res.clearCookie("connect.sid", { path: "/" });
    
    // Redirect to landing page
    res.redirect("/");
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

  app.get("/api/dashboard/branch-stats", isAuthenticated, async (req, res) => {
    try {
      const branchStats = await storage.getBranchStats();
      res.json(branchStats);
    } catch (error) {
      console.error("Error fetching branch stats:", error);
      res.status(500).json({ message: "Failed to fetch branch stats" });
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

  // Alias for finance-officers (used by loan application forms)
  app.get("/api/finance-officers", isAuthenticated, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const officers = await storage.getOfficers(search);
      res.json(officers);
    } catch (error) {
      console.error("Error fetching finance officers:", error);
      res.status(500).json({ message: "Failed to fetch finance officers" });
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

  // Unified Loan Application endpoint - creates customer, loan, business, collateral, guarantors in one transaction
  app.post("/api/loan-applications", isAuthenticated, async (req: any, res) => {
    try {
      const data = req.body;
      
      // Create or find customer
      let customerId: string;
      if (data.customerNo) {
        const existingCustomer = await storage.getCustomerByNo(data.customerNo);
        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const customer = await storage.createCustomer({
            customerNo: data.customerNo,
            firstName: data.firstName,
            lastName: data.lastName,
            fatherName: data.fatherName,
            gender: data.gender,
            nationalId: data.nationalId,
            dateOfBirth: data.dateOfBirth,
            placeOfBirth: data.placeOfBirth,
            age: data.age,
            homeAddress: data.homeAddress,
            district: data.district,
            phoneNumber: data.phoneNumber,
            secondPhoneNumber: data.secondPhoneNumber,
            numberOfDependents: data.numberOfDependents,
            directMaleDependent: data.directMaleDependent,
            directFemaleDependent: data.directFemaleDependent,
            indirectMaleDependent: data.indirectMaleDependent,
            indirectFemaleDependent: data.indirectFemaleDependent,
          });
          customerId = customer.id;
        }
      } else {
        const customer = await storage.createCustomer({
          firstName: data.firstName,
          lastName: data.lastName,
          fatherName: data.fatherName,
          gender: data.gender,
          nationalId: data.nationalId,
          dateOfBirth: data.dateOfBirth,
          placeOfBirth: data.placeOfBirth,
          age: data.age,
          homeAddress: data.homeAddress,
          district: data.district,
          phoneNumber: data.phoneNumber,
          secondPhoneNumber: data.secondPhoneNumber,
          numberOfDependents: data.numberOfDependents,
          directMaleDependent: data.directMaleDependent,
          directFemaleDependent: data.directFemaleDependent,
          indirectMaleDependent: data.indirectMaleDependent,
          indirectFemaleDependent: data.indirectFemaleDependent,
        });
        customerId = customer.id;
      }

      // Create customer business if provided
      let customerBusinessId: string | undefined;
      if (data.businessName) {
        const business = await storage.createCustomerBusiness({
          customerId,
          businessName: data.businessName,
          province: data.businessProvince,
          district: data.businessDistrict,
          village: data.businessVillage,
          detailedAddress: data.businessDetailedAddress,
          yearsOfExperience: data.businessYearsOfExperience,
          sector: data.sector,
          businessType: data.businessDescription,
        });
        customerBusinessId = business.id;

        // Create business license if provided
        if (data.licenseNumber || data.licenseType) {
          await storage.createBusinessLicense({
            customerBusinessId,
            licenseType: data.licenseType,
            president: data.licensePresident,
            licenseNumber: data.licenseNumber,
            registerDate: data.licenseRegisterDate,
            expiryDate: data.licenseExpiryDate,
          });
        }
      }

      // Generate application ID in format: [BranchCode 3][ProductCode 2][Sequential 5]
      // Get branch code
      let branchCode = "101"; // Default if no branch selected
      if (data.branchId) {
        const branch = await storage.getBranch(data.branchId);
        if (branch?.code) {
          branchCode = branch.code.substring(0, 3).padStart(3, '0');
        }
      }
      
      // Get product code (2 digits)
      const productCode = (data.productCode || "13").substring(0, 2).padStart(2, '0');
      
      // Get the prefix for this branch+product combination
      const prefix = `${branchCode}${productCode}`;
      
      // Find the max existing application ID with this prefix
      const maxAppId = await storage.getMaxApplicationIdByPrefix(prefix);
      let sequentialNum = 1;
      if (maxAppId) {
        // Extract the last 5 digits and increment
        const lastSeq = parseInt(maxAppId.substring(5)) || 0;
        sequentialNum = lastSeq + 1;
      }
      
      const applicationId = `${prefix}${sequentialNum.toString().padStart(5, '0')}`;

      // Create loan
      const loan = await storage.createLoan({
        applicationId,
        customerId,
        branchId: data.branchId,
        financeOfficerId: data.financeOfficerId,
        productName: data.productName,
        productCode: data.productCode,
        sector: data.sector,
        businessDescription: data.businessDescription,
        financingPurpose: data.financingPurpose,
        sourceOfFund: data.sourceOfFund,
        fundingSourceId: data.fundingSourceId,
        requestDate: data.requestDate,
        requestAmount: data.requestAmount?.toString(),
        financingDurationMonths: data.financingDurationMonths,
        gracePeriod: data.gracePeriod,
        numberOfInstallments: data.numberOfInstallments,
        principleAmount: data.principleAmount?.toString(),
        marginRate: data.marginRate?.toString(),
        status: "pending",
      });

      // Create collateral if provided
      if (data.collateralType || data.collateralOwnerName) {
        await storage.createCollateral({
          loanId: loan.id,
          ownerName: data.collateralOwnerName,
          ownerNationalId: data.collateralOwnerNid,
          collateralType: data.collateralType,
          province: data.collateralProvince,
          address: data.collateralAddress,
          purchasedPrice: data.collateralPurchasedPrice?.toString(),
          marketPrice: data.collateralMarketPrice?.toString(),
        });
      }

      // Create financial guarantor if provided
      if (data.financialGuarantorFullName) {
        await storage.createGuarantor({
          loanId: loan.id,
          guarantorType: "financial",
          fullName: data.financialGuarantorFullName,
          fatherName: data.financialGuarantorFatherName,
          nationalId: data.financialGuarantorNid,
          phoneNumber: data.financialGuarantorPhone,
          homeAddress: data.financialGuarantorHomeAddress,
          district: data.financialGuarantorDistrict,
          business: data.financialGuarantorBusiness,
          businessAddress: data.financialGuarantorBusinessAddress,
          relationshipWithCustomer: data.financialGuarantorRelationship,
          yearsOfExperience: data.financialGuarantorYearsOfExperience,
          inventory: data.financialGuarantorInventory?.toString(),
          monthlyIncome: data.financialGuarantorMonthlyIncome?.toString(),
        });
      }

      // Create family guarantor if provided
      if (data.familyGuarantorFullName) {
        await storage.createGuarantor({
          loanId: loan.id,
          guarantorType: "family",
          fullName: data.familyGuarantorFullName,
          fatherName: data.familyGuarantorFatherName,
          nationalId: data.familyGuarantorNid,
          phoneNumber: data.familyGuarantorPhone,
          homeAddress: data.familyGuarantorHomeAddress,
          district: data.familyGuarantorDistrict,
          relationshipWithCustomer: data.familyGuarantorRelationship,
        });
      }

      await logActivity(req, "create_loan_application", "loan", loan.id, `Created loan application: ${loan.applicationId} for customer: ${data.firstName}`);
      res.status(201).json({ loanId: loan.id, applicationId: loan.applicationId, customerId });
    } catch (error) {
      console.error("Error creating loan application:", error);
      res.status(500).json({ message: "Failed to create loan application" });
    }
  });

  // Get full loan application details
  app.get("/api/loan-applications/:id", isAuthenticated, async (req, res) => {
    try {
      const loan = await storage.getLoan(req.params.id);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      const customer = loan.customerId ? await storage.getCustomer(loan.customerId) : null;
      const business = customer ? await storage.getCustomerBusinessByCustomerId(customer.id) : null;
      const license = business ? await storage.getBusinessLicenseByBusinessId(business.id) : null;
      const collateral = await storage.getCollateralByLoanId(loan.id);
      const guarantors = await storage.getGuarantorsByLoanId(loan.id);
      const financialGuarantor = guarantors.find(g => g.guarantorType === "financial");
      const familyGuarantor = guarantors.find(g => g.guarantorType === "family");
      
      res.json({
        loan,
        customer,
        business,
        license,
        collateral,
        financialGuarantor,
        familyGuarantor,
      });
    } catch (error) {
      console.error("Error fetching loan application:", error);
      res.status(500).json({ message: "Failed to fetch loan application" });
    }
  });

  // Update loan application
  app.put("/api/loan-applications/:id", isAuthenticated, async (req: any, res) => {
    try {
      const data = req.body;
      const loan = await storage.getLoan(req.params.id);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      // Update customer
      if (loan.customerId) {
        await storage.updateCustomer(loan.customerId, {
          customerNo: data.customerNo,
          firstName: data.firstName,
          lastName: data.lastName,
          fatherName: data.fatherName,
          gender: data.gender,
          nationalId: data.nationalId,
          dateOfBirth: data.dateOfBirth,
          placeOfBirth: data.placeOfBirth,
          homeAddress: data.homeAddress,
          district: data.district,
          phoneNumber: data.phoneNumber,
          secondPhoneNumber: data.secondPhoneNumber,
          numberOfDependents: data.numberOfDependents,
          directMaleDependent: data.directMaleDependent,
          directFemaleDependent: data.directFemaleDependent,
          indirectMaleDependent: data.indirectMaleDependent,
          indirectFemaleDependent: data.indirectFemaleDependent,
        });
      }

      // Update loan
      await storage.updateLoan(loan.id, {
        branchId: data.branchId,
        financeOfficerId: data.financeOfficerId,
        productName: data.productName,
        productCode: data.productCode,
        sector: data.sector,
        businessDescription: data.businessDescription,
        financingPurpose: data.financingPurpose,
        fundingSourceId: data.fundingSourceId,
        requestDate: data.requestDate,
        requestAmount: data.requestAmount?.toString(),
        financingDurationMonths: data.financingDurationMonths,
        gracePeriod: data.gracePeriod,
        numberOfInstallments: data.numberOfInstallments,
        principleAmount: data.principleAmount?.toString(),
        marginRate: data.marginRate?.toString(),
      });

      // Update business if exists
      if (loan.customerId) {
        const business = await storage.getCustomerBusinessByCustomerId(loan.customerId);
        if (business) {
          await storage.updateCustomerBusiness(business.id, {
            businessName: data.businessName,
            province: data.businessProvince,
            district: data.businessDistrict,
            village: data.businessVillage,
            detailedAddress: data.businessDetailedAddress,
            yearsOfExperience: data.businessYearsOfExperience,
          });
          
          const license = await storage.getBusinessLicenseByBusinessId(business.id);
          if (license) {
            await storage.updateBusinessLicense(license.id, {
              licenseType: data.licenseType,
              president: data.licensePresident,
              licenseNumber: data.licenseNumber,
              registerDate: data.licenseRegisterDate,
              expiryDate: data.licenseExpiryDate,
            });
          }
        }
      }

      // Update collateral
      const collateral = await storage.getCollateralByLoanId(loan.id);
      if (collateral) {
        await storage.updateCollateral(collateral.id, {
          ownerName: data.collateralOwnerName,
          ownerNationalId: data.collateralOwnerNid,
          collateralType: data.collateralType,
          province: data.collateralProvince,
          address: data.collateralAddress,
          purchasedPrice: data.collateralPurchasedPrice?.toString(),
          marketPrice: data.collateralMarketPrice?.toString(),
        });
      }

      // Update guarantors
      const guarantors = await storage.getGuarantorsByLoanId(loan.id);
      const financialGuarantor = guarantors.find(g => g.guarantorType === "financial");
      const familyGuarantor = guarantors.find(g => g.guarantorType === "family");

      if (financialGuarantor) {
        await storage.updateGuarantor(financialGuarantor.id, {
          fullName: data.financialGuarantorFullName,
          fatherName: data.financialGuarantorFatherName,
          nationalId: data.financialGuarantorNid,
          phoneNumber: data.financialGuarantorPhone,
          homeAddress: data.financialGuarantorHomeAddress,
          district: data.financialGuarantorDistrict,
          business: data.financialGuarantorBusiness,
          businessAddress: data.financialGuarantorBusinessAddress,
          relationshipWithCustomer: data.financialGuarantorRelationship,
          yearsOfExperience: data.financialGuarantorYearsOfExperience,
          inventory: data.financialGuarantorInventory?.toString(),
          monthlyIncome: data.financialGuarantorMonthlyIncome?.toString(),
        });
      }

      if (familyGuarantor) {
        await storage.updateGuarantor(familyGuarantor.id, {
          fullName: data.familyGuarantorFullName,
          fatherName: data.familyGuarantorFatherName,
          nationalId: data.familyGuarantorNid,
          phoneNumber: data.familyGuarantorPhone,
          homeAddress: data.familyGuarantorHomeAddress,
          district: data.familyGuarantorDistrict,
          relationshipWithCustomer: data.familyGuarantorRelationship,
        });
      }

      await logActivity(req, "update_loan_application", "loan", loan.id, `Updated loan application: ${loan.applicationId}`);
      res.json({ message: "Loan application updated successfully" });
    } catch (error) {
      console.error("Error updating loan application:", error);
      res.status(500).json({ message: "Failed to update loan application" });
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

  // ===== FAD REVIEW =====
  app.post("/api/fad-reviews", isAuthenticated, requireRole("fad", "manager", "admin"), async (req: any, res) => {
    try {
      const { loanId, status, comments, dataQualityScore } = req.body;
      
      const loan = await storage.getLoan(loanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      // Create FAD review record
      const review = await storage.createFadReview({
        loanId,
        reviewedById: req.session.userId,
        reviewerName: req.user?.claims?.given_name || "FAD Reviewer",
        status,
        comments,
        dataQualityScore: dataQualityScore || 0,
        reviewedAt: new Date().toISOString(),
      });

      // Update loan status based on review outcome
      if (status === "approved") {
        await storage.updateLoan(loanId, { status: "committee_review" });
        await logActivity(req, "fad_approve", "loan", loanId, `FAD approved - forwarded to committee review`);
      } else {
        await storage.updateLoan(loanId, { status: "rejected" });
        await logActivity(req, "fad_reject", "loan", loanId, `FAD rejected - ${comments}`);
      }

      res.json(review);
    } catch (error) {
      console.error("Error creating FAD review:", error);
      res.status(500).json({ message: "Failed to submit FAD review" });
    }
  });

  app.get("/api/fad-reviews/:loanId", isAuthenticated, async (req, res) => {
    try {
      const review = await storage.getFadReviewByLoanId(req.params.loanId);
      res.json(review);
    } catch (error) {
      console.error("Error fetching FAD review:", error);
      res.status(500).json({ message: "Failed to fetch FAD review" });
    }
  });

  // ===== COMMITTEE VOTING =====
  app.get("/api/committee/pending-loans", isAuthenticated, requireRole("cfo", "coo", "ceo", "sharia", "manager", "admin"), async (req: any, res) => {
    try {
      // Get loans in committee_review status (passed FAD, awaiting committee)
      const loans = await storage.getLoansWithDetails({ status: "committee_review" });
      
      // For each loan, get FAD review and committee votes
      const loansWithApprovalInfo = await Promise.all(
        loans.map(async (loan: any) => {
          const fadReview = await storage.getFadReviewByLoanId(loan.id);
          const votes = await storage.getCommitteeVotesByLoanId(loan.id);
          const userRole = await storage.getUserRole(req.session.userId);
          const userVote = votes.find((v: any) => v.voterId === req.session.userId);
          
          return {
            loan,
            fadReview,
            votes,
            userVote,
          };
        })
      );

      res.json(loansWithApprovalInfo);
    } catch (error) {
      console.error("Error fetching committee pending loans:", error);
      res.status(500).json({ message: "Failed to fetch pending loans" });
    }
  });

  app.post("/api/committee/vote", isAuthenticated, requireRole("cfo", "coo", "ceo", "sharia", "manager", "admin"), async (req: any, res) => {
    try {
      const { loanId, vote, comments } = req.body;
      
      const loan = await storage.getLoan(loanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      // Get user's role
      const userRole = await storage.getUserRole(req.session.userId);
      if (!userRole) {
        return res.status(403).json({ message: "User role not found" });
      }

      // Check if user already voted
      const existingVote = await storage.getCommitteeVoteByLoanAndVoter(loanId, req.session.userId);
      if (existingVote && existingVote.vote !== "pending") {
        return res.status(400).json({ message: "You have already voted on this loan" });
      }

      // Create or update vote (upsert)
      let voteRecord;
      if (existingVote) {
        voteRecord = await storage.updateCommitteeVote(existingVote.id, {
          vote,
          comments,
          votedAt: new Date().toISOString(),
        });
      } else {
        voteRecord = await storage.createCommitteeVote({
          loanId,
          voterId: req.session.userId,
          voterName: req.user?.claims?.given_name || "Committee Member",
          voterRole: userRole.role,
          vote,
          comments,
          votedAt: new Date().toISOString(),
        });
      }

      await logActivity(req, "committee_vote", "loan", loanId, `Committee vote: ${vote} by ${userRole.role}`);

      // Check if we have enough votes to finalize
      const allVotes = await storage.getCommitteeVotesByLoanId(loanId);
      const approvedVotes = allVotes.filter((v: any) => v.vote === "approved").length;
      const rejectedVotes = allVotes.filter((v: any) => v.vote === "rejected").length;
      const REQUIRED_APPROVALS = 3;
      const COMMITTEE_SIZE = 4;

      if (approvedVotes >= REQUIRED_APPROVALS) {
        await storage.updateLoan(loanId, { status: "approved" });
        await logActivity(req, "committee_approve", "loan", loanId, `Committee approved with ${approvedVotes} votes`);
      } else if (rejectedVotes > (COMMITTEE_SIZE - REQUIRED_APPROVALS)) {
        await storage.updateLoan(loanId, { status: "rejected" });
        await logActivity(req, "committee_reject", "loan", loanId, `Committee rejected with ${rejectedVotes} votes`);
      }

      res.json(voteRecord);
    } catch (error) {
      console.error("Error submitting committee vote:", error);
      res.status(500).json({ message: "Failed to submit vote" });
    }
  });

  app.get("/api/committee/votes/:loanId", isAuthenticated, async (req, res) => {
    try {
      const votes = await storage.getCommitteeVotesByLoanId(req.params.loanId);
      res.json(votes);
    } catch (error) {
      console.error("Error fetching committee votes:", error);
      res.status(500).json({ message: "Failed to fetch votes" });
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

  // ===== PAGE PERMISSIONS =====
  app.get("/api/admin/pages", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      const pages = storage.getAllPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.get("/api/admin/users-permissions", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      const users = await storage.getUsersWithPermissions();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users with permissions:", error);
      res.status(500).json({ message: "Failed to fetch users with permissions" });
    }
  });

  app.get("/api/permissions/:userId", isAuthenticated, async (req, res) => {
    try {
      const permissions = await storage.getPagePermissions(req.params.userId);
      res.json(permissions);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      res.status(500).json({ message: "Failed to fetch permissions" });
    }
  });

  app.post("/api/admin/permissions", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { userId, pageName, canAccess } = req.body;
      
      if (!userId || !pageName || canAccess === undefined) {
        return res.status(400).json({ message: "userId, pageName, and canAccess are required" });
      }

      await storage.setPagePermission(userId, pageName, canAccess, req.session.userId);
      await logActivity(req, "update_permission", "permission", userId, `Updated permission for page ${pageName}: ${canAccess ? 'granted' : 'revoked'}`);
      
      res.json({ message: "Permission updated successfully" });
    } catch (error) {
      console.error("Error updating permission:", error);
      res.status(500).json({ message: "Failed to update permission" });
    }
  });

  // Get a specific user's permissions (admin only)
  app.get("/api/admin/user-permissions/:userId", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { userId } = req.params;
      const permissions = await storage.getPagePermissions(userId);
      
      const permissionMap: Record<string, boolean> = {};
      permissions.forEach(p => {
        permissionMap[p.pageName] = p.canAccess;
      });
      
      res.json({ permissions: permissionMap });
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      res.status(500).json({ message: "Failed to fetch user permissions" });
    }
  });

  // Get current user's permissions
  app.get("/api/my-permissions", isAuthenticated, async (req: any, res) => {
    try {
      const permissions = await storage.getPagePermissions(req.session.userId);
      const userRole = await storage.getUserRole(req.session.userId);
      
      // Admins and managers have all permissions by default
      if (userRole === "admin" || userRole === "manager") {
        const allPages = storage.getAllPages();
        const fullAccess = allPages.reduce((acc, page) => {
          acc[page] = true;
          return acc;
        }, {} as Record<string, boolean>);
        return res.json({ role: userRole, permissions: fullAccess });
      }
      
      // Regular users need explicit permissions
      const permissionMap: Record<string, boolean> = {};
      permissions.forEach(p => {
        permissionMap[p.pageName] = p.canAccess;
      });
      
      res.json({ role: userRole, permissions: permissionMap });
    } catch (error) {
      console.error("Error fetching my permissions:", error);
      res.status(500).json({ message: "Failed to fetch permissions" });
    }
  });

  // ============== ACCOUNTING ROUTES ==============

  // Chart of Accounts
  app.get("/api/accounts", isAuthenticated, async (req, res) => {
    try {
      const { search, accountType } = req.query;
      const accounts = await storage.getAccounts({
        search: search as string,
        accountType: accountType as string,
      });
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).json({ message: "Failed to fetch accounts" });
    }
  });

  app.get("/api/accounts/hierarchy", isAuthenticated, async (req, res) => {
    try {
      const hierarchy = await storage.getAccountHierarchy();
      res.json(hierarchy);
    } catch (error) {
      console.error("Error fetching account hierarchy:", error);
      res.status(500).json({ message: "Failed to fetch account hierarchy" });
    }
  });

  app.get("/api/accounts/:id", isAuthenticated, async (req, res) => {
    try {
      const account = await storage.getAccount(req.params.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(account);
    } catch (error) {
      console.error("Error fetching account:", error);
      res.status(500).json({ message: "Failed to fetch account" });
    }
  });

  app.post("/api/accounts", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const account = await storage.createAccount(req.body);
      await logActivity(req, "create", "account", account.id, `Created account: ${account.accountCode} - ${account.accountName}`);
      res.status(201).json(account);
    } catch (error) {
      console.error("Error creating account:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.patch("/api/accounts/:id", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const account = await storage.updateAccount(req.params.id, req.body);
      await logActivity(req, "update", "account", account.id, `Updated account: ${account.accountCode} - ${account.accountName}`);
      res.json(account);
    } catch (error) {
      console.error("Error updating account:", error);
      res.status(500).json({ message: "Failed to update account" });
    }
  });

  app.delete("/api/accounts/:id", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const account = await storage.getAccount(req.params.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      await storage.deleteAccount(req.params.id);
      await logActivity(req, "delete", "account", req.params.id, `Deleted account: ${account.accountCode} - ${account.accountName}`);
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // Fiscal Periods
  app.get("/api/fiscal-periods", isAuthenticated, async (req, res) => {
    try {
      const periods = await storage.getFiscalPeriods();
      res.json(periods);
    } catch (error) {
      console.error("Error fetching fiscal periods:", error);
      res.status(500).json({ message: "Failed to fetch fiscal periods" });
    }
  });

  app.post("/api/fiscal-periods", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const period = await storage.createFiscalPeriod(req.body);
      await logActivity(req, "create", "fiscal_period", period.id, `Created fiscal period: ${period.periodName}`);
      res.status(201).json(period);
    } catch (error) {
      console.error("Error creating fiscal period:", error);
      res.status(500).json({ message: "Failed to create fiscal period" });
    }
  });

  app.post("/api/fiscal-periods/:id/close", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      await storage.closeFiscalPeriod(req.params.id, req.session.userId);
      await logActivity(req, "close", "fiscal_period", req.params.id, "Closed fiscal period");
      res.json({ message: "Fiscal period closed successfully" });
    } catch (error) {
      console.error("Error closing fiscal period:", error);
      res.status(500).json({ message: "Failed to close fiscal period" });
    }
  });

  // Journal Entries
  app.get("/api/journal-entries", isAuthenticated, async (req, res) => {
    try {
      const { search, startDate, endDate, isPosted } = req.query;
      const entries = await storage.getJournalEntries({
        search: search as string,
        startDate: startDate as string,
        endDate: endDate as string,
        isPosted: isPosted === 'true' ? true : isPosted === 'false' ? false : undefined,
      });
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.get("/api/journal-entries/next-number", isAuthenticated, async (req, res) => {
    try {
      const entryNumber = await storage.getNextEntryNumber();
      res.json({ entryNumber });
    } catch (error) {
      console.error("Error getting next entry number:", error);
      res.status(500).json({ message: "Failed to get next entry number" });
    }
  });

  app.get("/api/journal-entries/:id", isAuthenticated, async (req, res) => {
    try {
      const entry = await storage.getJournalEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      res.status(500).json({ message: "Failed to fetch journal entry" });
    }
  });

  app.post("/api/journal-entries", isAuthenticated, requireRole("user", "manager", "admin"), async (req: any, res) => {
    try {
      const { lines, ...header } = req.body;
      
      // Validate at least 2 lines
      if (!Array.isArray(lines) || lines.length < 2) {
        return res.status(400).json({ message: "Journal entry must have at least 2 lines" });
      }
      
      // Validate no negative amounts
      for (const line of lines) {
        const debit = Number(line.debitAmount || 0);
        const credit = Number(line.creditAmount || 0);
        if (debit < 0 || credit < 0) {
          return res.status(400).json({ message: "Amounts cannot be negative" });
        }
        if (!line.accountId) {
          return res.status(400).json({ message: "Each line must have an account" });
        }
      }
      
      // Validate debit = credit
      const totalDebit = lines.reduce((sum: number, line: any) => sum + Number(line.debitAmount || 0), 0);
      const totalCredit = lines.reduce((sum: number, line: any) => sum + Number(line.creditAmount || 0), 0);
      
      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return res.status(400).json({ message: "Total debits must equal total credits" });
      }
      
      if (totalDebit === 0) {
        return res.status(400).json({ message: "Journal entry cannot have zero amounts" });
      }
      
      const entryNumber = await storage.getNextEntryNumber();
      const entry = await storage.createJournalEntry(
        { ...header, entryNumber, createdBy: req.session.userId },
        lines
      );
      await logActivity(req, "create", "journal_entry", entry.id, `Created journal entry: ${entry.entryNumber}`);
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ message: "Failed to create journal entry" });
    }
  });

  app.post("/api/journal-entries/:id/post", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      await storage.postJournalEntry(req.params.id, req.session.userId);
      await logActivity(req, "post", "journal_entry", req.params.id, "Posted journal entry");
      res.json({ message: "Journal entry posted successfully" });
    } catch (error) {
      console.error("Error posting journal entry:", error);
      res.status(500).json({ message: "Failed to post journal entry" });
    }
  });

  app.post("/api/journal-entries/:id/reverse", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const reversalEntry = await storage.reverseJournalEntry(req.params.id, req.session.userId);
      await logActivity(req, "reverse", "journal_entry", req.params.id, `Reversed journal entry, created ${reversalEntry.entryNumber}`);
      res.json(reversalEntry);
    } catch (error) {
      console.error("Error reversing journal entry:", error);
      res.status(500).json({ message: "Failed to reverse journal entry" });
    }
  });

  // Accounting Reports (restricted to managers and admins)
  app.get("/api/reports/trial-balance", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const { asOfDate } = req.query;
      const trialBalance = await storage.getTrialBalance(asOfDate as string);
      res.json(trialBalance);
    } catch (error) {
      console.error("Error fetching trial balance:", error);
      res.status(500).json({ message: "Failed to fetch trial balance" });
    }
  });

  app.get("/api/reports/income-statement", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }
      const incomeStatement = await storage.getIncomeStatement(startDate as string, endDate as string);
      res.json(incomeStatement);
    } catch (error) {
      console.error("Error fetching income statement:", error);
      res.status(500).json({ message: "Failed to fetch income statement" });
    }
  });

  app.get("/api/reports/balance-sheet", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const { asOfDate } = req.query;
      if (!asOfDate) {
        return res.status(400).json({ message: "asOfDate is required" });
      }
      const balanceSheet = await storage.getBalanceSheet(asOfDate as string);
      res.json(balanceSheet);
    } catch (error) {
      console.error("Error fetching balance sheet:", error);
      res.status(500).json({ message: "Failed to fetch balance sheet" });
    }
  });

  app.get("/api/reports/account-statement/:accountId", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const statement = await storage.getAccountStatement(
        req.params.accountId,
        startDate as string,
        endDate as string
      );
      if (!statement) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(statement);
    } catch (error) {
      console.error("Error fetching account statement:", error);
      res.status(500).json({ message: "Failed to fetch account statement" });
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
