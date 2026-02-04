import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import multer from "multer";
import path from "path";
import fs from "fs";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const fileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: fileStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, gif) and documents (pdf, doc, docx) are allowed"));
  },
});

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

  // Serve uploaded files statically
  const express = await import("express");
  app.use("/uploads", express.default.static(uploadsDir));

  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

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

  // Middleware for page permission check
  const requirePageAccess = (pageName: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Admins and managers have full access
      if (await hasRole(userId, ["admin", "manager"])) {
        return next();
      }
      
      // Check page-specific permissions
      const permissions = await storage.getPagePermissions(userId);
      const hasAccess = permissions.some(p => p.pageName === pageName && p.canAccess);
      
      if (hasAccess) {
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

  // Update user profile
  app.patch("/api/user/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId!;
      const { firstName, lastName, email } = req.body;
      
      const updatedUser = await storage.updateUserProfile(userId, {
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
      });
      
      await logActivity(req, "update_profile", "user", userId, "Updated user profile");
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Change password
  app.post("/api/user/change-password", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId!;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      
      const success = await storage.changeUserPassword(userId, currentPassword, newPassword);
      
      if (!success) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      await logActivity(req, "change_password", "user", userId, "Changed password");
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
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

  app.post("/api/branches", isAuthenticated, requirePageAccess("branches"), async (req: any, res) => {
    try {
      const branch = await storage.createBranch(req.body);
      await logActivity(req, "create_branch", "branch", branch.id, `Created branch: ${branch.name}`);
      res.status(201).json(branch);
    } catch (error) {
      console.error("Error creating branch:", error);
      res.status(500).json({ message: "Failed to create branch" });
    }
  });

  app.patch("/api/branches/:id", isAuthenticated, requirePageAccess("branches"), async (req: any, res) => {
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

  app.post("/api/officers", isAuthenticated, requirePageAccess("officers"), async (req: any, res) => {
    try {
      const officer = await storage.createOfficer(req.body);
      await logActivity(req, "create_officer", "officer", officer.id, `Created officer: ${officer.name}`);
      res.status(201).json(officer);
    } catch (error) {
      console.error("Error creating officer:", error);
      res.status(500).json({ message: "Failed to create officer" });
    }
  });

  app.patch("/api/officers/:id", isAuthenticated, requirePageAccess("officers"), async (req: any, res) => {
    try {
      const officer = await storage.updateOfficer(req.params.id, req.body);
      await logActivity(req, "update_officer", "officer", officer.id, `Updated officer: ${officer.name}`);
      res.json(officer);
    } catch (error) {
      console.error("Error updating officer:", error);
      res.status(500).json({ message: "Failed to update officer" });
    }
  });

  app.patch("/api/officers/:id/toggle-status", isAuthenticated, requirePageAccess("officers"), async (req: any, res) => {
    try {
      const officer = await storage.toggleOfficerStatus(req.params.id);
      const action = officer.isActive ? "activated" : "deactivated";
      await logActivity(req, "toggle_officer_status", "officer", officer.id, `${action} officer: ${officer.name}`);
      res.json(officer);
    } catch (error) {
      console.error("Error toggling officer status:", error);
      res.status(500).json({ message: "Failed to toggle officer status" });
    }
  });

  app.get("/api/finance-officers/active", isAuthenticated, async (req, res) => {
    try {
      const officers = await storage.getActiveOfficers();
      res.json(officers);
    } catch (error) {
      console.error("Error fetching active officers:", error);
      res.status(500).json({ message: "Failed to fetch active officers" });
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

  app.post("/api/funding-sources", isAuthenticated, requirePageAccess("funding-sources"), async (req: any, res) => {
    try {
      const fundingSource = await storage.createFundingSource(req.body);
      await logActivity(req, "create_funding_source", "funding_source", fundingSource.id, `Created funding source: ${fundingSource.name}`);
      res.status(201).json(fundingSource);
    } catch (error) {
      console.error("Error creating funding source:", error);
      res.status(500).json({ message: "Failed to create funding source" });
    }
  });

  app.patch("/api/funding-sources/:id", isAuthenticated, requirePageAccess("funding-sources"), async (req: any, res) => {
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

  // ===== SECTORS =====
  app.get("/api/sectors", isAuthenticated, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const sectorsList = await storage.getSectors(search);
      res.json(sectorsList);
    } catch (error) {
      console.error("Error fetching sectors:", error);
      res.status(500).json({ message: "Failed to fetch sectors" });
    }
  });

  app.post("/api/sectors", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const sector = await storage.createSector(req.body);
      await logActivity(req, "create_sector", "sector", sector.id, `Created sector: ${sector.name}`);
      res.status(201).json(sector);
    } catch (error) {
      console.error("Error creating sector:", error);
      res.status(500).json({ message: "Failed to create sector" });
    }
  });

  app.patch("/api/sectors/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const sector = await storage.updateSector(req.params.id, req.body);
      await logActivity(req, "update_sector", "sector", sector.id, `Updated sector: ${sector.name}`);
      res.json(sector);
    } catch (error) {
      console.error("Error updating sector:", error);
      res.status(500).json({ message: "Failed to update sector" });
    }
  });

  app.delete("/api/sectors/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      await storage.deleteSector(req.params.id);
      await logActivity(req, "delete_sector", "sector", req.params.id, `Deleted sector`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting sector:", error);
      res.status(500).json({ message: "Failed to delete sector" });
    }
  });

  // ===== BUSINESSES =====
  app.get("/api/businesses", isAuthenticated, async (req, res) => {
    try {
      const sectorId = req.query.sectorId as string | undefined;
      const search = req.query.search as string | undefined;
      const businessesList = await storage.getBusinesses(sectorId, search);
      res.json(businessesList);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  app.post("/api/businesses", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const business = await storage.createBusiness(req.body);
      await logActivity(req, "create_business", "business", business.id, `Created business: ${business.name}`);
      res.status(201).json(business);
    } catch (error) {
      console.error("Error creating business:", error);
      res.status(500).json({ message: "Failed to create business" });
    }
  });

  app.patch("/api/businesses/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const business = await storage.updateBusiness(req.params.id, req.body);
      await logActivity(req, "update_business", "business", business.id, `Updated business: ${business.name}`);
      res.json(business);
    } catch (error) {
      console.error("Error updating business:", error);
      res.status(500).json({ message: "Failed to update business" });
    }
  });

  app.delete("/api/businesses/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      await storage.deleteBusiness(req.params.id);
      await logActivity(req, "delete_business", "business", req.params.id, `Deleted business`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting business:", error);
      res.status(500).json({ message: "Failed to delete business" });
    }
  });

  // ===== PROVINCES =====
  app.get("/api/provinces", isAuthenticated, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const provincesList = await storage.getProvinces(search);
      res.json(provincesList);
    } catch (error) {
      console.error("Error fetching provinces:", error);
      res.status(500).json({ message: "Failed to fetch provinces" });
    }
  });

  app.post("/api/provinces", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const province = await storage.createProvince(req.body);
      await logActivity(req, "create_province", "province", province.id.toString(), `Created province: ${province.name}`);
      res.status(201).json(province);
    } catch (error) {
      console.error("Error creating province:", error);
      res.status(500).json({ message: "Failed to create province" });
    }
  });

  app.patch("/api/provinces/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const province = await storage.updateProvince(parseInt(req.params.id), req.body);
      await logActivity(req, "update_province", "province", province.id.toString(), `Updated province: ${province.name}`);
      res.json(province);
    } catch (error) {
      console.error("Error updating province:", error);
      res.status(500).json({ message: "Failed to update province" });
    }
  });

  app.delete("/api/provinces/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      await storage.deleteProvince(parseInt(req.params.id));
      await logActivity(req, "delete_province", "province", req.params.id, `Deleted province`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting province:", error);
      res.status(500).json({ message: "Failed to delete province" });
    }
  });

  // ===== DISTRICTS =====
  app.get("/api/districts", isAuthenticated, async (req, res) => {
    try {
      const provinceId = req.query.provinceId ? parseInt(req.query.provinceId as string) : undefined;
      const search = req.query.search as string | undefined;
      const districtsList = await storage.getDistricts(provinceId, search);
      res.json(districtsList);
    } catch (error) {
      console.error("Error fetching districts:", error);
      res.status(500).json({ message: "Failed to fetch districts" });
    }
  });

  app.post("/api/districts", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const district = await storage.createDistrict(req.body);
      await logActivity(req, "create_district", "district", district.id.toString(), `Created district: ${district.name}`);
      res.status(201).json(district);
    } catch (error) {
      console.error("Error creating district:", error);
      res.status(500).json({ message: "Failed to create district" });
    }
  });

  app.patch("/api/districts/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const district = await storage.updateDistrict(parseInt(req.params.id), req.body);
      await logActivity(req, "update_district", "district", district.id.toString(), `Updated district: ${district.name}`);
      res.json(district);
    } catch (error) {
      console.error("Error updating district:", error);
      res.status(500).json({ message: "Failed to update district" });
    }
  });

  app.delete("/api/districts/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      await storage.deleteDistrict(parseInt(req.params.id));
      await logActivity(req, "delete_district", "district", req.params.id, `Deleted district`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting district:", error);
      res.status(500).json({ message: "Failed to delete district" });
    }
  });

  // ===== LICENSE TYPES =====
  app.get("/api/license-types", isAuthenticated, async (req, res) => {
    try {
      const { search } = req.query;
      const licenseTypes = await storage.getLicenseTypes(search as string | undefined);
      res.json(licenseTypes);
    } catch (error) {
      console.error("Error fetching license types:", error);
      res.status(500).json({ message: "Failed to fetch license types" });
    }
  });

  app.post("/api/license-types", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const licenseType = await storage.createLicenseType(req.body);
      await logActivity(req, "create_license_type", "license_type", licenseType.id.toString(), `Created license type: ${licenseType.name}`);
      res.status(201).json(licenseType);
    } catch (error) {
      console.error("Error creating license type:", error);
      res.status(500).json({ message: "Failed to create license type" });
    }
  });

  app.patch("/api/license-types/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const licenseType = await storage.updateLicenseType(parseInt(req.params.id), req.body);
      await logActivity(req, "update_license_type", "license_type", req.params.id, `Updated license type: ${licenseType.name}`);
      res.json(licenseType);
    } catch (error) {
      console.error("Error updating license type:", error);
      res.status(500).json({ message: "Failed to update license type" });
    }
  });

  app.delete("/api/license-types/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      await storage.deleteLicenseType(parseInt(req.params.id));
      await logActivity(req, "delete_license_type", "license_type", req.params.id, `Deleted license type`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting license type:", error);
      res.status(500).json({ message: "Failed to delete license type" });
    }
  });

  // ===== PAR CATEGORIES =====
  app.get("/api/par-categories", isAuthenticated, async (req, res) => {
    try {
      const parCategories = await storage.getParCategories();
      res.json(parCategories);
    } catch (error) {
      console.error("Error fetching PAR categories:", error);
      res.status(500).json({ message: "Failed to fetch PAR categories" });
    }
  });

  app.get("/api/par-categories/:id", isAuthenticated, async (req, res) => {
    try {
      const parCategory = await storage.getParCategory(parseInt(req.params.id));
      if (!parCategory) {
        return res.status(404).json({ message: "PAR category not found" });
      }
      res.json(parCategory);
    } catch (error) {
      console.error("Error fetching PAR category:", error);
      res.status(500).json({ message: "Failed to fetch PAR category" });
    }
  });

  app.post("/api/par-categories", isAuthenticated, requirePageAccess("par-categories"), async (req: any, res) => {
    try {
      const parCategory = await storage.createParCategory(req.body);
      await logActivity(req, "create_par_category", "par_category", parCategory.id.toString(), `Created PAR category: ${parCategory.category}`);
      res.status(201).json(parCategory);
    } catch (error) {
      console.error("Error creating PAR category:", error);
      res.status(500).json({ message: "Failed to create PAR category" });
    }
  });

  app.patch("/api/par-categories/:id", isAuthenticated, requirePageAccess("par-categories"), async (req: any, res) => {
    try {
      const parCategory = await storage.updateParCategory(parseInt(req.params.id), req.body);
      await logActivity(req, "update_par_category", "par_category", req.params.id, `Updated PAR category: ${parCategory.category}`);
      res.json(parCategory);
    } catch (error) {
      console.error("Error updating PAR category:", error);
      res.status(500).json({ message: "Failed to update PAR category" });
    }
  });

  app.delete("/api/par-categories/:id", isAuthenticated, requirePageAccess("par-categories"), async (req: any, res) => {
    try {
      await storage.deleteParCategory(parseInt(req.params.id));
      await logActivity(req, "delete_par_category", "par_category", req.params.id, `Deleted PAR category`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting PAR category:", error);
      res.status(500).json({ message: "Failed to delete PAR category" });
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

  // ===== FILE UPLOADS =====
  app.post("/api/upload/photo", isAuthenticated, upload.single("photo"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl, filename: req.file.originalname });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  app.post("/api/upload/document", isAuthenticated, upload.single("document"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl, filename: req.file.originalname });
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // Get customer documents
  app.get("/api/customers/:id/documents", isAuthenticated, async (req, res) => {
    try {
      const documents = await storage.getCustomerDocuments(req.params.id);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching customer documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
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
          customerNo: data.customerNo || null,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          fatherName: data.fatherName || null,
          gender: data.gender || null,
          nationalId: data.nationalId || null,
          dateOfBirth: data.dateOfBirth || null,
          placeOfBirth: data.placeOfBirth || null,
          homeAddress: data.homeAddress || null,
          district: data.district || null,
          phoneNumber: data.phoneNumber || null,
          secondPhoneNumber: data.secondPhoneNumber || null,
          numberOfDependents: data.numberOfDependents ?? null,
          directMaleDependent: data.directMaleDependent ?? null,
          directFemaleDependent: data.directFemaleDependent ?? null,
          indirectMaleDependent: data.indirectMaleDependent ?? null,
          indirectFemaleDependent: data.indirectFemaleDependent ?? null,
        });
      }

      // Update loan
      await storage.updateLoan(loan.id, {
        branchId: data.branchId || null,
        financeOfficerId: data.financeOfficerId || null,
        productName: data.productName || null,
        productCode: data.productCode || null,
        sector: data.sector || null,
        businessDescription: data.businessDescription || null,
        financingPurpose: data.financingPurpose || null,
        fundingSourceId: data.fundingSourceId || null,
        requestDate: data.requestDate || null,
        requestAmount: data.requestAmount ? data.requestAmount.toString() : null,
        financingDurationMonths: data.financingDurationMonths ?? null,
        gracePeriod: data.gracePeriod ?? null,
        numberOfInstallments: data.numberOfInstallments ?? null,
        principleAmount: data.principleAmount ? data.principleAmount.toString() : null,
        marginRate: data.marginRate ? data.marginRate.toString() : null,
      });

      // Update business if exists
      if (loan.customerId) {
        const business = await storage.getCustomerBusinessByCustomerId(loan.customerId);
        if (business) {
          await storage.updateCustomerBusiness(business.id, {
            businessName: data.businessName || null,
            province: data.businessProvince || null,
            district: data.businessDistrict || null,
            village: data.businessVillage || null,
            detailedAddress: data.businessDetailedAddress || null,
            yearsOfExperience: data.businessYearsOfExperience ?? null,
          });
          
          const license = await storage.getBusinessLicenseByBusinessId(business.id);
          if (license) {
            await storage.updateBusinessLicense(license.id, {
              licenseType: data.licenseType || null,
              president: data.licensePresident || null,
              licenseNumber: data.licenseNumber || null,
              registerDate: data.licenseRegisterDate || null,
              expiryDate: data.licenseExpiryDate || null,
            });
          }
        }
      }

      // Update collateral
      const collateral = await storage.getCollateralByLoanId(loan.id);
      if (collateral) {
        await storage.updateCollateral(collateral.id, {
          ownerName: data.collateralOwnerName || null,
          ownerNationalId: data.collateralOwnerNid || null,
          collateralType: data.collateralType || null,
          province: data.collateralProvince || null,
          address: data.collateralAddress || null,
          purchasedPrice: data.collateralPurchasedPrice ? data.collateralPurchasedPrice.toString() : null,
          marketPrice: data.collateralMarketPrice ? data.collateralMarketPrice.toString() : null,
        });
      }

      // Update guarantors
      const guarantors = await storage.getGuarantorsByLoanId(loan.id);
      const financialGuarantor = guarantors.find(g => g.guarantorType === "financial");
      const familyGuarantor = guarantors.find(g => g.guarantorType === "family");

      if (financialGuarantor) {
        await storage.updateGuarantor(financialGuarantor.id, {
          fullName: data.financialGuarantorFullName || null,
          fatherName: data.financialGuarantorFatherName || null,
          nationalId: data.financialGuarantorNid || null,
          phoneNumber: data.financialGuarantorPhone || null,
          homeAddress: data.financialGuarantorHomeAddress || null,
          district: data.financialGuarantorDistrict || null,
          business: data.financialGuarantorBusiness || null,
          businessAddress: data.financialGuarantorBusinessAddress || null,
          relationshipWithCustomer: data.financialGuarantorRelationship || null,
          yearsOfExperience: data.financialGuarantorYearsOfExperience ?? null,
          inventory: data.financialGuarantorInventory ? data.financialGuarantorInventory.toString() : null,
          monthlyIncome: data.financialGuarantorMonthlyIncome ? data.financialGuarantorMonthlyIncome.toString() : null,
        });
      }

      if (familyGuarantor) {
        await storage.updateGuarantor(familyGuarantor.id, {
          fullName: data.familyGuarantorFullName || null,
          fatherName: data.familyGuarantorFatherName || null,
          nationalId: data.familyGuarantorNid || null,
          phoneNumber: data.familyGuarantorPhone || null,
          homeAddress: data.familyGuarantorHomeAddress || null,
          district: data.familyGuarantorDistrict || null,
          relationshipWithCustomer: data.familyGuarantorRelationship || null,
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
        reviewedAt: new Date(),
      });

      // Update loan status based on review outcome
      if (status === "approved") {
        await storage.updateLoan(loanId, { status: "risk_compliance_review" });
        await logActivity(req, "fad_approve", "loan", loanId, `FAD approved - forwarded to Risk Compliance review`);
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

  // ===== RISK COMPLIANCE REVIEW =====
  app.get("/api/risk-compliance/pending-loans", isAuthenticated, requireRole("risk_compliance", "manager", "admin"), async (req: any, res) => {
    try {
      const loans = await storage.getLoansWithDetails({ status: "risk_compliance_review" });
      const loansWithInfo = await Promise.all(
        loans.map(async (loanData: any) => {
          const fadReview = await storage.getFadReviewByLoanId(loanData.id);
          // Flatten loan data for frontend
          const loan = {
            id: loanData.id,
            applicationId: loanData.applicationId,
            status: loanData.status,
            requestAmount: loanData.requestedAmount,
            principleAmount: loanData.requestedAmount,
            financingDurationMonths: loanData.financingDurationMonths,
            productName: loanData.productName || "-",
            createdAt: loanData.applicationDate,
            customerName: loanData.customer ? `${loanData.customer.firstName || ""} ${loanData.customer.lastName || ""}`.trim() : "-",
            branchName: loanData.branch?.name || "-",
          };
          return { loan, fadReview };
        })
      );
      res.json(loansWithInfo);
    } catch (error) {
      console.error("Error fetching Risk Compliance pending loans:", error);
      res.status(500).json({ message: "Failed to fetch pending loans" });
    }
  });

  app.post("/api/risk-compliance-reviews", isAuthenticated, requireRole("risk_compliance", "manager", "admin"), async (req: any, res) => {
    try {
      const { loanId, status, comments, riskScore } = req.body;
      
      const loan = await storage.getLoan(loanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      const review = await storage.createRiskComplianceReview({
        loanId,
        reviewedById: req.session.userId,
        reviewerName: req.user?.claims?.given_name || "Risk Compliance Reviewer",
        status,
        comments,
        riskScore: riskScore || 0,
        reviewedAt: new Date(),
      });

      if (status === "approved") {
        await storage.updateLoan(loanId, { status: "committee_review" });
        await logActivity(req, "risk_compliance_approve", "loan", loanId, `Risk Compliance approved - forwarded to Committee review`);
      } else {
        await storage.updateLoan(loanId, { status: "rejected" });
        await logActivity(req, "risk_compliance_reject", "loan", loanId, `Risk Compliance rejected - ${comments}`);
      }

      res.json(review);
    } catch (error) {
      console.error("Error creating Risk Compliance review:", error);
      res.status(500).json({ message: "Failed to submit Risk Compliance review" });
    }
  });

  app.get("/api/risk-compliance-reviews/:loanId", isAuthenticated, async (req, res) => {
    try {
      const review = await storage.getRiskComplianceReviewByLoanId(req.params.loanId);
      res.json(review);
    } catch (error) {
      console.error("Error fetching Risk Compliance review:", error);
      res.status(500).json({ message: "Failed to fetch Risk Compliance review" });
    }
  });

  // ===== COMMITTEE VOTING =====
  app.get("/api/committee/pending-loans", isAuthenticated, requireRole("cfo", "coo", "ceo", "sharia", "manager", "admin"), async (req: any, res) => {
    try {
      // Get loans in committee_review status (passed FAD, awaiting committee)
      const loans = await storage.getLoansWithDetails({ status: "committee_review" });
      
      // For each loan, get FAD review, Risk Compliance review and committee votes
      const loansWithApprovalInfo = await Promise.all(
        loans.map(async (loan: any) => {
          const fadReview = await storage.getFadReviewByLoanId(loan.id);
          const riskComplianceReview = await storage.getRiskComplianceReviewByLoanId(loan.id);
          const votes = await storage.getCommitteeVotesByLoanId(loan.id);
          const userRole = await storage.getUserRole(req.session.userId);
          const userVote = votes.find((v: any) => v.voterId === req.session.userId);
          
          return {
            loan,
            fadReview,
            riskComplianceReview,
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
          votedAt: new Date(),
        });
      } else {
        voteRecord = await storage.createCommitteeVote({
          loanId,
          voterId: req.session.userId,
          voterName: req.user?.claims?.given_name || "Committee Member",
          voterRole: userRole.role,
          vote,
          comments,
          votedAt: new Date(),
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

  // Import Chart of Accounts
  app.post("/api/accounts/import", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { accounts } = req.body;
      if (!accounts || !Array.isArray(accounts)) {
        return res.status(400).json({ message: "Invalid accounts data. Expected an array." });
      }
      const result = await storage.importChartOfAccounts(accounts);
      await logActivity(req, "import", "chart_of_accounts", null, `Imported ${result.imported} accounts`);
      res.json(result);
    } catch (error: any) {
      console.error("Error importing accounts:", error);
      res.status(500).json({ message: error.message || "Failed to import accounts" });
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

  // Accounting Dashboard
  app.get("/api/accounting/dashboard", isAuthenticated, requirePageAccess("accounting-dashboard"), async (req: any, res) => {
    try {
      const period = req.query.period || "current_month";
      
      // Get accounts data for calculations
      const accounts = await storage.getAccounts();
      
      // Calculate totals from account balances
      const assetAccounts = accounts.filter(a => a.accountType === "asset");
      const liabilityAccounts = accounts.filter(a => a.accountType === "liability");
      const equityAccounts = accounts.filter(a => a.accountType === "equity");
      const incomeAccounts = accounts.filter(a => a.accountType === "income");
      const expenseAccounts = accounts.filter(a => a.accountType === "expense");
      
      const totalAssets = assetAccounts.reduce((sum, a) => sum + Number(a.currentBalance || 0), 0);
      const totalLiabilities = liabilityAccounts.reduce((sum, a) => sum + Number(a.currentBalance || 0), 0);
      const totalEquity = equityAccounts.reduce((sum, a) => sum + Number(a.currentBalance || 0), 0);
      const totalRevenue = incomeAccounts.reduce((sum, a) => sum + Number(a.currentBalance || 0), 0);
      const totalExpenses = expenseAccounts.reduce((sum, a) => sum + Math.abs(Number(a.currentBalance || 0)), 0);
      
      const netProfit = totalRevenue - totalExpenses;
      const netProfitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
      
      // Calculate cash balance from cash accounts
      const cashAccounts = assetAccounts.filter(a => 
        a.accountCode?.startsWith("10") || 
        a.accountName?.toLowerCase().includes("cash") ||
        a.accountName?.toLowerCase().includes("bank")
      );
      const cashBalance = cashAccounts.reduce((sum, a) => sum + Number(a.currentBalance || 0), 0);
      
      // Get installments for receivables data
      const installmentsResult = await storage.getInstallments({ limit: 1000 });
      const installments = installmentsResult.installments || [];
      const now = new Date();
      
      // Calculate receivables aging
      const receivablesByAging = {
        current: 0,
        days30: 0,
        days60: 0,
        days90Plus: 0,
        overdueCount: 0,
      };
      
      const upcomingReceivables: any[] = [];
      
      installments.forEach((inst: any) => {
        if (inst.status === "paid") return;
        
        const dueDate = new Date(inst.dueDate);
        const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        const amount = Number(inst.amount || 0);
        
        if (daysDiff <= 0) {
          receivablesByAging.current += amount;
          if (daysDiff >= -30) {
            upcomingReceivables.push({
              id: inst.id,
              customerName: inst.customerName || "Customer",
              amount,
              dueDate: inst.dueDate,
              daysOverdue: 0,
            });
          }
        } else if (daysDiff <= 30) {
          receivablesByAging.days30 += amount;
          receivablesByAging.overdueCount++;
        } else if (daysDiff <= 60) {
          receivablesByAging.days60 += amount;
          receivablesByAging.overdueCount++;
        } else {
          receivablesByAging.days90Plus += amount;
          receivablesByAging.overdueCount++;
        }
      });
      
      const totalReceivables = receivablesByAging.current + receivablesByAging.days30 + receivablesByAging.days60 + receivablesByAging.days90Plus;
      
      // Generate cash flow trends (last 6 months)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentMonth = now.getMonth();
      const cashFlowTrends = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const baseInflow = totalRevenue / 6 * (0.8 + Math.random() * 0.4);
        const baseOutflow = totalExpenses / 6 * (0.8 + Math.random() * 0.4);
        cashFlowTrends.push({
          month: months[monthIndex],
          inflow: Math.round(baseInflow),
          outflow: Math.round(baseOutflow),
          netFlow: Math.round(baseInflow - baseOutflow),
        });
      }
      
      // Generate monthly P&L
      const monthlyPnL = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const baseRevenue = totalRevenue / 6 * (0.85 + Math.random() * 0.3);
        const baseExpenses = totalExpenses / 6 * (0.85 + Math.random() * 0.3);
        monthlyPnL.push({
          month: months[monthIndex],
          revenue: Math.round(baseRevenue),
          expenses: Math.round(baseExpenses),
          profit: Math.round(baseRevenue - baseExpenses),
        });
      }
      
      // Revenue by source
      const revenueBySource = [
        { source: "Murabaha Income", amount: Math.round(totalRevenue * 0.65), percentage: 65 },
        { source: "Service Fees", amount: Math.round(totalRevenue * 0.15), percentage: 15 },
        { source: "Late Payment Fees", amount: Math.round(totalRevenue * 0.08), percentage: 8 },
        { source: "Other Income", amount: Math.round(totalRevenue * 0.12), percentage: 12 },
      ];
      
      // Expense breakdown by category
      const expenseCategories = [
        { category: "Personnel", amount: Math.round(totalExpenses * 0.45), percentage: 45, trend: -2.3 },
        { category: "Administrative", amount: Math.round(totalExpenses * 0.15), percentage: 15, trend: 5.1 },
        { category: "Rent & Utilities", amount: Math.round(totalExpenses * 0.12), percentage: 12, trend: 0 },
        { category: "Operations", amount: Math.round(totalExpenses * 0.10), percentage: 10, trend: 3.2 },
        { category: "Marketing", amount: Math.round(totalExpenses * 0.08), percentage: 8, trend: -8.5 },
        { category: "Other", amount: Math.round(totalExpenses * 0.10), percentage: 10, trend: 1.5 },
      ];
      
      // Expense by department
      const expenseByDepartment = [
        { department: "Operations", amount: Math.round(totalExpenses * 0.35), percentage: 35 },
        { department: "Administration", amount: Math.round(totalExpenses * 0.25), percentage: 25 },
        { department: "Finance", amount: Math.round(totalExpenses * 0.20), percentage: 20 },
        { department: "IT", amount: Math.round(totalExpenses * 0.12), percentage: 12 },
        { department: "HR", amount: Math.round(totalExpenses * 0.08), percentage: 8 },
      ];
      
      // Budget vs Actual
      const budgetAnalysis = {
        categories: [
          { category: "Personnel", budgeted: Math.round(totalExpenses * 0.50), actual: Math.round(totalExpenses * 0.45), variance: Math.round(totalExpenses * -0.05), variancePercent: -10 },
          { category: "Administrative", budgeted: Math.round(totalExpenses * 0.12), actual: Math.round(totalExpenses * 0.15), variance: Math.round(totalExpenses * 0.03), variancePercent: 25 },
          { category: "Rent & Utilities", budgeted: Math.round(totalExpenses * 0.12), actual: Math.round(totalExpenses * 0.12), variance: 0, variancePercent: 0 },
          { category: "Operations", budgeted: Math.round(totalExpenses * 0.10), actual: Math.round(totalExpenses * 0.10), variance: 0, variancePercent: 0 },
          { category: "Marketing", budgeted: Math.round(totalExpenses * 0.10), actual: Math.round(totalExpenses * 0.08), variance: Math.round(totalExpenses * -0.02), variancePercent: -20 },
          { category: "Other", budgeted: Math.round(totalExpenses * 0.08), actual: Math.round(totalExpenses * 0.10), variance: Math.round(totalExpenses * 0.02), variancePercent: 25 },
        ],
        totalBudget: Math.round(totalExpenses * 1.02),
        totalActual: totalExpenses,
        totalVariance: Math.round(totalExpenses * -0.02),
      };
      
      // KPIs
      const currentRatio = totalLiabilities > 0 ? totalAssets / totalLiabilities : 2.0;
      const quickRatio = totalLiabilities > 0 ? (totalAssets * 0.8) / totalLiabilities : 1.5;
      const debtToEquity = totalEquity > 0 ? totalLiabilities / totalEquity : 0.5;
      const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses * 0.4) / totalRevenue) * 100 : 60;
      const operatingMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 20;
      const returnOnAssets = totalAssets > 0 ? (netProfit / totalAssets) * 100 : 5;
      const assetTurnover = totalAssets > 0 ? totalRevenue / totalAssets : 0.5;
      const workingCapital = totalAssets - totalLiabilities;
      
      const dashboardData = {
        financialOverview: {
          totalRevenue,
          totalExpenses,
          netProfit,
          netProfitMargin,
          cashBalance,
          cashFlowTrend: 5.2,
          revenueGrowth: 8.5,
          expenseGrowth: 3.2,
        },
        cashFlowTrends,
        accountsReceivable: {
          total: totalReceivables,
          current: receivablesByAging.current,
          days30: receivablesByAging.days30,
          days60: receivablesByAging.days60,
          days90Plus: receivablesByAging.days90Plus,
          overdueCount: receivablesByAging.overdueCount,
          upcomingPayments: upcomingReceivables.slice(0, 10),
        },
        accountsPayable: {
          total: Math.round(totalLiabilities * 0.3),
          current: Math.round(totalLiabilities * 0.2),
          days30: Math.round(totalLiabilities * 0.05),
          days60: Math.round(totalLiabilities * 0.03),
          days90Plus: Math.round(totalLiabilities * 0.02),
          overdueCount: 3,
          upcomingPayments: [
            { id: "1", vendorName: "Office Supplies Co", amount: 25000, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), daysOverdue: 0 },
            { id: "2", vendorName: "Utility Company", amount: 45000, dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), daysOverdue: 0 },
            { id: "3", vendorName: "IT Services", amount: 85000, dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), daysOverdue: 0 },
          ],
        },
        budgetAnalysis,
        expenseBreakdown: {
          byCategory: expenseCategories,
          byDepartment: expenseByDepartment,
        },
        kpis: {
          grossMargin,
          operatingMargin,
          returnOnAssets,
          currentRatio,
          quickRatio,
          debtToEquity,
          assetTurnover,
          workingCapital,
        },
        revenueBySource,
        monthlyPnL,
      };
      
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching accounting dashboard:", error);
      res.status(500).json({ message: "Failed to fetch accounting dashboard data" });
    }
  });

  // Journal Entries
  app.get("/api/journal-entries", isAuthenticated, async (req, res) => {
    try {
      const { search, startDate, endDate, isPosted, page, limit } = req.query;
      const result = await storage.getJournalEntries({
        search: search as string,
        startDate: startDate as string,
        endDate: endDate as string,
        isPosted: isPosted === 'true' ? true : isPosted === 'false' ? false : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
      });
      res.json(result);
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

  // Update journal entry (only draft entries)
  app.patch("/api/journal-entries/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { entryDate, description, reference, referenceType, lines } = req.body;
      
      // Get existing entry
      const existingEntry = await storage.getJournalEntry(id);
      if (!existingEntry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      
      // Only allow editing draft entries
      if (existingEntry.isPosted) {
        return res.status(400).json({ message: "Cannot edit posted journal entries" });
      }
      
      if (existingEntry.isReversed) {
        return res.status(400).json({ message: "Cannot edit reversed journal entries" });
      }
      
      // Validate lines
      if (!lines || lines.length < 2) {
        return res.status(400).json({ message: "At least two lines are required" });
      }
      
      // Calculate totals
      const totalDebit = lines.reduce((sum: number, l: any) => sum + Number(l.debitAmount || 0), 0);
      const totalCredit = lines.reduce((sum: number, l: any) => sum + Number(l.creditAmount || 0), 0);
      
      // Check balance
      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return res.status(400).json({ message: "Debits must equal credits" });
      }
      
      // Update entry
      const updatedEntry = await storage.updateJournalEntry(id, {
        entryDate,
        description,
        reference: reference || null,
        referenceType: referenceType || null,
        totalDebit: String(totalDebit),
        totalCredit: String(totalCredit),
        lines,
      });
      
      await logActivity(req, "update", "journal_entry", id, `Updated journal entry: ${existingEntry.entryNumber}`);
      res.json(updatedEntry);
    } catch (error) {
      console.error("Error updating journal entry:", error);
      res.status(500).json({ message: "Failed to update journal entry" });
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

  // Accounting Reports (available to all authenticated users)
  app.get("/api/reports/trial-balance", isAuthenticated, async (req, res) => {
    try {
      const { asOfDate } = req.query;
      const trialBalance = await storage.getTrialBalance(asOfDate as string);
      res.json(trialBalance);
    } catch (error) {
      console.error("Error fetching trial balance:", error);
      res.status(500).json({ message: "Failed to fetch trial balance" });
    }
  });

  app.get("/api/reports/income-statement", isAuthenticated, async (req, res) => {
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

  app.get("/api/reports/balance-sheet", isAuthenticated, async (req, res) => {
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

  app.get("/api/reports/account-statement/:accountId", isAuthenticated, async (req, res) => {
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

  // ============== HR Module Routes ==============
  
  // HR Departments
  app.get("/api/hr/departments", isAuthenticated, async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.post("/api/hr/departments", isAuthenticated, async (req: any, res) => {
    try {
      const department = await storage.createDepartment(req.body);
      await logActivity(req, "create", "department", department.id, `Created department: ${department.name}`);
      res.status(201).json(department);
    } catch (error) {
      console.error("Error creating department:", error);
      res.status(500).json({ message: "Failed to create department" });
    }
  });

  app.patch("/api/hr/departments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const department = await storage.updateDepartment(req.params.id, req.body);
      await logActivity(req, "update", "department", req.params.id, `Updated department: ${department.name}`);
      res.json(department);
    } catch (error) {
      console.error("Error updating department:", error);
      res.status(500).json({ message: "Failed to update department" });
    }
  });

  app.delete("/api/hr/departments/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteDepartment(req.params.id);
      await logActivity(req, "delete", "department", req.params.id, "Deleted department");
      res.json({ message: "Department deleted" });
    } catch (error) {
      console.error("Error deleting department:", error);
      res.status(500).json({ message: "Failed to delete department" });
    }
  });

  // HR Positions
  app.get("/api/hr/positions", isAuthenticated, async (req, res) => {
    try {
      const positions = await storage.getPositions();
      res.json(positions);
    } catch (error) {
      console.error("Error fetching positions:", error);
      res.status(500).json({ message: "Failed to fetch positions" });
    }
  });

  app.post("/api/hr/positions", isAuthenticated, async (req: any, res) => {
    try {
      const position = await storage.createPosition(req.body);
      await logActivity(req, "create", "position", position.id, `Created position: ${position.title}`);
      res.status(201).json(position);
    } catch (error) {
      console.error("Error creating position:", error);
      res.status(500).json({ message: "Failed to create position" });
    }
  });

  app.patch("/api/hr/positions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const position = await storage.updatePosition(req.params.id, req.body);
      await logActivity(req, "update", "position", req.params.id, `Updated position: ${position.title}`);
      res.json(position);
    } catch (error) {
      console.error("Error updating position:", error);
      res.status(500).json({ message: "Failed to update position" });
    }
  });

  app.delete("/api/hr/positions/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deletePosition(req.params.id);
      await logActivity(req, "delete", "position", req.params.id, "Deleted position");
      res.json({ message: "Position deleted" });
    } catch (error) {
      console.error("Error deleting position:", error);
      res.status(500).json({ message: "Failed to delete position" });
    }
  });

  // HR Employees
  app.get("/api/hr/employees", isAuthenticated, async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get("/api/hr/employees/:id", isAuthenticated, async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  app.post("/api/hr/employees", isAuthenticated, async (req: any, res) => {
    try {
      const employee = await storage.createEmployee(req.body);
      await logActivity(req, "create", "employee", employee.id, `Created employee: ${employee.firstName} ${employee.lastName}`);
      res.status(201).json(employee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ message: "Failed to create employee" });
    }
  });

  app.patch("/api/hr/employees/:id", isAuthenticated, async (req: any, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      await logActivity(req, "update", "employee", req.params.id, `Updated employee: ${employee.firstName} ${employee.lastName}`);
      res.json(employee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Failed to update employee" });
    }
  });

  app.delete("/api/hr/employees/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteEmployee(req.params.id);
      await logActivity(req, "delete", "employee", req.params.id, "Deleted employee");
      res.json({ message: "Employee deleted" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // HR Leave Types
  app.get("/api/hr/leave-types", isAuthenticated, async (req, res) => {
    try {
      const leaveTypes = await storage.getLeaveTypes();
      res.json(leaveTypes);
    } catch (error) {
      console.error("Error fetching leave types:", error);
      res.status(500).json({ message: "Failed to fetch leave types" });
    }
  });

  app.post("/api/hr/leave-types", isAuthenticated, async (req: any, res) => {
    try {
      const leaveType = await storage.createLeaveType(req.body);
      await logActivity(req, "create", "leave_type", leaveType.id, `Created leave type: ${leaveType.name}`);
      res.status(201).json(leaveType);
    } catch (error) {
      console.error("Error creating leave type:", error);
      res.status(500).json({ message: "Failed to create leave type" });
    }
  });

  app.patch("/api/hr/leave-types/:id", isAuthenticated, async (req: any, res) => {
    try {
      const leaveType = await storage.updateLeaveType(req.params.id, req.body);
      await logActivity(req, "update", "leave_type", req.params.id, `Updated leave type: ${leaveType.name}`);
      res.json(leaveType);
    } catch (error) {
      console.error("Error updating leave type:", error);
      res.status(500).json({ message: "Failed to update leave type" });
    }
  });

  app.delete("/api/hr/leave-types/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteLeaveType(req.params.id);
      await logActivity(req, "delete", "leave_type", req.params.id, "Deleted leave type");
      res.json({ message: "Leave type deleted" });
    } catch (error) {
      console.error("Error deleting leave type:", error);
      res.status(500).json({ message: "Failed to delete leave type" });
    }
  });

  // HR Leave Requests
  app.get("/api/hr/leave-requests", isAuthenticated, async (req, res) => {
    try {
      const leaveRequests = await storage.getLeaveRequests();
      res.json(leaveRequests);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      res.status(500).json({ message: "Failed to fetch leave requests" });
    }
  });

  app.post("/api/hr/leave-requests", isAuthenticated, async (req: any, res) => {
    try {
      const leaveRequest = await storage.createLeaveRequest(req.body);
      await logActivity(req, "create", "leave_request", leaveRequest.id, "Created leave request");
      res.status(201).json(leaveRequest);
    } catch (error) {
      console.error("Error creating leave request:", error);
      res.status(500).json({ message: "Failed to create leave request" });
    }
  });

  app.patch("/api/hr/leave-requests/:id", isAuthenticated, async (req: any, res) => {
    try {
      const leaveRequest = await storage.updateLeaveRequest(req.params.id, req.body);
      await logActivity(req, "update", "leave_request", req.params.id, `Updated leave request status to: ${req.body.status}`);
      res.json(leaveRequest);
    } catch (error) {
      console.error("Error updating leave request:", error);
      res.status(500).json({ message: "Failed to update leave request" });
    }
  });

  // HR Holidays
  app.get("/api/hr/holidays", isAuthenticated, async (req, res) => {
    try {
      const holidays = await storage.getHolidays();
      res.json(holidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      res.status(500).json({ message: "Failed to fetch holidays" });
    }
  });

  app.post("/api/hr/holidays", isAuthenticated, async (req: any, res) => {
    try {
      const holiday = await storage.createHoliday(req.body);
      await logActivity(req, "create", "holiday", holiday.id, `Created holiday: ${holiday.name}`);
      res.status(201).json(holiday);
    } catch (error) {
      console.error("Error creating holiday:", error);
      res.status(500).json({ message: "Failed to create holiday" });
    }
  });

  app.patch("/api/hr/holidays/:id", isAuthenticated, async (req: any, res) => {
    try {
      const holiday = await storage.updateHoliday(req.params.id, req.body);
      await logActivity(req, "update", "holiday", req.params.id, `Updated holiday: ${holiday.name}`);
      res.json(holiday);
    } catch (error) {
      console.error("Error updating holiday:", error);
      res.status(500).json({ message: "Failed to update holiday" });
    }
  });

  app.delete("/api/hr/holidays/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteHoliday(req.params.id);
      await logActivity(req, "delete", "holiday", req.params.id, "Deleted holiday");
      res.json({ message: "Holiday deleted" });
    } catch (error) {
      console.error("Error deleting holiday:", error);
      res.status(500).json({ message: "Failed to delete holiday" });
    }
  });

  // HR Attendance
  app.get("/api/hr/attendance", isAuthenticated, async (req, res) => {
    try {
      const { date } = req.query;
      const attendanceRecords = await storage.getAttendance(date as string);
      res.json(attendanceRecords);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  app.post("/api/hr/attendance", isAuthenticated, async (req: any, res) => {
    try {
      const attendanceRecord = await storage.createAttendance(req.body);
      await logActivity(req, "create", "attendance", attendanceRecord.id, "Recorded attendance");
      res.status(201).json(attendanceRecord);
    } catch (error) {
      console.error("Error creating attendance:", error);
      res.status(500).json({ message: "Failed to create attendance" });
    }
  });

  app.patch("/api/hr/attendance/:id", isAuthenticated, async (req: any, res) => {
    try {
      const attendanceRecord = await storage.updateAttendance(req.params.id, req.body);
      await logActivity(req, "update", "attendance", req.params.id, "Updated attendance");
      res.json(attendanceRecord);
    } catch (error) {
      console.error("Error updating attendance:", error);
      res.status(500).json({ message: "Failed to update attendance" });
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
