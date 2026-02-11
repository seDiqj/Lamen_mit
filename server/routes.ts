import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { customers, loans } from "@shared/schema";
import { eq, and, inArray } from "drizzle-orm";
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

const csvUpload = multer({
  storage: fileStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".csv") {
      return cb(null, true);
    }
    cb(new Error("Only CSV files are allowed"));
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

    const userRole = await storage.getUserRole(req.session.userId);

    res.json({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: userRole?.role || null,
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

  // ===== DISBURSEMENT TARGETS =====
  app.get("/api/disbursement-targets", isAuthenticated, async (req, res) => {
    try {
      const targets = await storage.getDisbursementTargets();
      res.json(targets);
    } catch (error) {
      console.error("Error fetching disbursement targets:", error);
      res.status(500).json({ message: "Failed to fetch disbursement targets" });
    }
  });

  app.post("/api/disbursement-targets", isAuthenticated, requirePageAccess("disbursement-targets"), async (req: any, res) => {
    try {
      const target = await storage.createDisbursementTarget(req.body);
      await logActivity(req, "create_disbursement_target", "disbursement_target", String(target.id), `Created disbursement target for ${req.body.targetMonthYear}`);
      res.status(201).json(target);
    } catch (error) {
      console.error("Error creating disbursement target:", error);
      res.status(500).json({ message: "Failed to create disbursement target" });
    }
  });

  app.patch("/api/disbursement-targets/:id", isAuthenticated, requirePageAccess("disbursement-targets"), async (req: any, res) => {
    try {
      const target = await storage.updateDisbursementTarget(parseInt(req.params.id), req.body);
      await logActivity(req, "update_disbursement_target", "disbursement_target", req.params.id, `Updated disbursement target`);
      res.json(target);
    } catch (error) {
      console.error("Error updating disbursement target:", error);
      res.status(500).json({ message: "Failed to update disbursement target" });
    }
  });

  app.get("/api/disbursement-targets/progress", isAuthenticated, async (req, res) => {
    try {
      const progress = await storage.getDisbursementTargetProgress();
      res.json(progress);
    } catch (error) {
      console.error("Error fetching disbursement target progress:", error);
      res.status(500).json({ message: "Failed to fetch disbursement target progress" });
    }
  });

  app.delete("/api/disbursement-targets/:id", isAuthenticated, requirePageAccess("disbursement-targets"), async (req: any, res) => {
    try {
      await storage.deleteDisbursementTarget(parseInt(req.params.id));
      await logActivity(req, "delete_disbursement_target", "disbursement_target", req.params.id, `Deleted disbursement target`);
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      console.error("Error deleting disbursement target:", error);
      res.status(500).json({ message: "Failed to delete disbursement target" });
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

  app.get("/api/finance-officers/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.status(401).json({ message: "Not authenticated" });
      const officer = await storage.getOfficerByUserId(userId);
      if (!officer) return res.json(null);
      res.json(officer);
    } catch (error) {
      console.error("Error fetching my officer profile:", error);
      res.status(500).json({ message: "Failed to fetch officer profile" });
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

  // ===== LOOKUP ROLES =====
  app.get("/api/lookup-roles", isAuthenticated, async (req, res) => {
    try {
      const roles = await storage.getLookupRoles();
      res.json(roles);
    } catch (error) {
      console.error("Error fetching lookup roles:", error);
      res.status(500).json({ message: "Failed to fetch lookup roles" });
    }
  });

  app.post("/api/lookup-roles", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const role = await storage.createLookupRole(req.body);
      await logActivity(req, "create_lookup_role", "lookup_role", String(role.id), `Created lookup role: ${role.label}`);
      res.status(201).json(role);
    } catch (error) {
      console.error("Error creating lookup role:", error);
      res.status(500).json({ message: "Failed to create lookup role" });
    }
  });

  app.patch("/api/lookup-roles/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const role = await storage.updateLookupRole(parseInt(req.params.id), req.body);
      await logActivity(req, "update_lookup_role", "lookup_role", req.params.id, `Updated lookup role: ${role.label}`);
      res.json(role);
    } catch (error) {
      console.error("Error updating lookup role:", error);
      res.status(500).json({ message: "Failed to update lookup role" });
    }
  });

  app.delete("/api/lookup-roles/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      await storage.deleteLookupRole(parseInt(req.params.id));
      await logActivity(req, "delete_lookup_role", "lookup_role", req.params.id, `Deleted lookup role`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lookup role:", error);
      res.status(500).json({ message: "Failed to delete lookup role" });
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
      const { search, status, financeOfficerId, page, limit } = req.query;
      const result = await storage.getLoans({
        search: search as string | undefined,
        status: status as string | undefined,
        financeOfficerId: financeOfficerId as string | undefined,
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

  // GET /api/loans/disbursed - Get all disbursed loans for installment management
  app.get("/api/loans/disbursed", isAuthenticated, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const branchId = req.query.branchId as string | undefined;
      const results = await storage.getDisbursedLoans({ search, branchId });
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch disbursed loans", error: error.message });
    }
  });

  // GET /api/loans/:id/installment-schedule - Calculate schedule and return installments
  app.get("/api/loans/:id/installment-schedule", isAuthenticated, async (req: any, res) => {
    try {
      const loanId = req.params.id;
      const loan = await storage.getLoan(loanId);
      if (!loan) return res.status(404).json({ message: "Loan not found" });

      const customer = loan.customerId ? await storage.getCustomer(loan.customerId) : null;
      const branch = loan.branchId ? await storage.getBranch(loan.branchId) : null;
      const disbursement = await storage.getDisbursementByLoan(loanId);
      const existingInstallments = await storage.getInstallmentsByLoan(loanId);

      const principalAmount = parseFloat(loan.principleAmount || "0");
      const marginRate = parseFloat(loan.marginRate || "0");
      const durationMonths = loan.financingDurationMonths || 12;
      const numInstallments = durationMonths;
      const gracePeriod = loan.gracePeriod || 0;

      const principalInstCount = durationMonths - gracePeriod;
      const principalPerInstallment = principalInstCount > 0 ? principalAmount / principalInstCount : 0;

      const calculatedSchedule = [];

      let profitTotalCalc = parseFloat(loan.profit || "0");
      if (profitTotalCalc === 0 && principalAmount > 0) {
        const rateCalc = marginRate > 1 ? marginRate / 100 : marginRate;
        profitTotalCalc = (principalAmount * rateCalc / 12) * durationMonths;
      }
      const marginPerInstCalc = numInstallments > 0 ? profitTotalCalc / numInstallments : 0;
      const roundedMarginCalc = Math.round(marginPerInstCalc * 100) / 100;
      const marginRemainderCalc = Math.round((profitTotalCalc - (roundedMarginCalc * numInstallments)) * 100) / 100;
      const roundedPrincipalCalc = Math.round(principalPerInstallment * 100) / 100;
      const principalRemainderCalc = Math.round((principalAmount - (roundedPrincipalCalc * principalInstCount)) * 100) / 100;

      for (let i = 1; i <= numInstallments; i++) {
        const isGrace = i <= gracePeriod;
        const isFirstPrincipal = gracePeriod > 0 ? (i === gracePeriod + 1) : (i === 1);

        let instPrincipal: number, instMargin: number;
        if (isGrace) {
          instPrincipal = 0;
          instMargin = (i === 1) ? roundedMarginCalc + marginRemainderCalc : roundedMarginCalc;
        } else if (isFirstPrincipal) {
          instPrincipal = roundedPrincipalCalc + principalRemainderCalc;
          instMargin = (gracePeriod === 0 && i === 1) ? roundedMarginCalc + marginRemainderCalc : roundedMarginCalc;
        } else {
          instPrincipal = roundedPrincipalCalc;
          instMargin = roundedMarginCalc;
        }
        const instTotal = instPrincipal + instMargin;

        calculatedSchedule.push({
          installmentNumber: i,
          calculatedPrincipal: Math.round(instPrincipal * 100) / 100,
          calculatedMargin: Math.round(instMargin * 100) / 100,
          calculatedTotal: Math.round(instTotal * 100) / 100,
        });
      }

      const mergedInstallments = existingInstallments.map((inst: any) => {
        const calc = calculatedSchedule.find((c: any) => c.installmentNumber === inst.installmentNumber);
        return {
          id: inst.id,
          installmentNumber: inst.installmentNumber,
          dueDate: inst.dueDate,
          currentPrincipal: inst.principleAmount ? parseFloat(inst.principleAmount) : null,
          currentMargin: inst.marginAmount ? parseFloat(inst.marginAmount) : null,
          currentTotal: inst.totalAmount ? parseFloat(inst.totalAmount) : null,
          calculatedPrincipal: calc?.calculatedPrincipal || 0,
          calculatedMargin: calc?.calculatedMargin || 0,
          calculatedTotal: calc?.calculatedTotal || 0,
          paidAmount: parseFloat(inst.paidAmount || "0"),
          isPaid: inst.isPaid || false,
          paymentDate: inst.paymentDate,
          lateDays: inst.lateDays,
          installmentVariance: inst.installmentVariance ? parseFloat(inst.installmentVariance) : null,
          hasNullAmounts: inst.principleAmount === null || inst.marginAmount === null,
        };
      });

      for (const calc of calculatedSchedule) {
        const exists = existingInstallments.find((inst: any) => inst.installmentNumber === calc.installmentNumber);
        if (!exists) {
          let dueDate: string | null = null;
          if (disbursement?.firstInstallmentDate) {
            const firstDate = new Date(disbursement.firstInstallmentDate);
            firstDate.setMonth(firstDate.getMonth() + (calc.installmentNumber - 1));
            dueDate = firstDate.toISOString().split("T")[0];
          }

          mergedInstallments.push({
            id: null,
            installmentNumber: calc.installmentNumber,
            dueDate,
            currentPrincipal: null,
            currentMargin: null,
            currentTotal: null,
            calculatedPrincipal: calc.calculatedPrincipal,
            calculatedMargin: calc.calculatedMargin,
            calculatedTotal: calc.calculatedTotal,
            paidAmount: 0,
            isPaid: false,
            paymentDate: null,
            lateDays: null,
            installmentVariance: null,
            hasNullAmounts: true,
          });
        }
      }

      mergedInstallments.sort((a: any, b: any) => a.installmentNumber - b.installmentNumber);

      const totalNullCount = mergedInstallments.filter((i: any) => i.hasNullAmounts).length;
      const totalPaidCount = mergedInstallments.filter((i: any) => i.isPaid).length;

      res.json({
        loan: {
          id: loan.id,
          applicationId: loan.applicationId,
          principalAmount,
          marginRate,
          numberOfInstallments: numInstallments,
          financingDurationMonths: durationMonths,
          gracePeriod,
          requestAmount: parseFloat(loan.requestAmount || "0"),
          financingCycle: loan.financingCycle || 1,
          status: loan.status,
          productName: loan.productName,
        },
        customer: customer ? {
          id: customer.id,
          name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
          customerNo: customer.customerNo,
        } : null,
        branch: branch ? { id: branch.id, name: branch.name } : null,
        disbursement: disbursement ? {
          disbursementDate: disbursement.disbursementDate,
          firstInstallmentDate: disbursement.firstInstallmentDate,
          maturityDate: disbursement.maturityDate,
        } : null,
        installments: mergedInstallments,
        summary: {
          totalInstallments: mergedInstallments.length,
          nullAmountCount: totalNullCount,
          paidCount: totalPaidCount,
          unpaidCount: mergedInstallments.length - totalPaidCount,
        },
      });
    } catch (error: any) {
      console.error("Error calculating installment schedule:", error);
      res.status(500).json({ message: "Failed to calculate schedule", error: error.message });
    }
  });

  // PATCH /api/installments/bulk-update - Update principle/margin for unpaid installments
  app.patch("/api/installments/bulk-update", isAuthenticated, async (req: any, res) => {
    try {
      const { updates } = req.body;
      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ message: "No updates provided" });
      }

      const results = [];
      let updatedCount = 0;
      let createdCount = 0;
      let skippedCount = 0;

      for (const update of updates) {
        const { id, loanId, installmentNumber, dueDate, principleAmount, marginAmount, isPaid } = update;

        const principal = parseFloat(principleAmount || "0");
        const margin = parseFloat(marginAmount || "0");
        const total = Math.round((principal + margin) * 100) / 100;

        if (!id && loanId && installmentNumber) {
          const created = await storage.createInstallment({
            loanId,
            installmentNumber,
            dueDate: dueDate || null,
            principleAmount: principal.toFixed(2),
            marginAmount: margin.toFixed(2),
            totalAmount: total.toFixed(2),
            paidAmount: "0",
            installmentVariance: null,
            paymentDate: null,
            lateDays: null,
            isPaid: isPaid === true,
          });
          createdCount++;
          results.push({ id: created.id, status: "created" });
          continue;
        }

        if (!id) { skippedCount++; continue; }

        const existing = await storage.getInstallmentById(id);
        if (!existing) { skippedCount++; continue; }

        const updateData: any = {
          principleAmount: principal.toFixed(2),
          marginAmount: margin.toFixed(2),
          totalAmount: total.toFixed(2),
        };

        if (isPaid !== undefined) {
          updateData.isPaid = isPaid;
          updateData.paymentDate = isPaid ? new Date().toISOString().split("T")[0] : null;
          if (!isPaid) {
            updateData.paidAmount = "0";
          }
        }

        await storage.updateInstallmentAmounts(id, updateData);

        updatedCount++;
        results.push({ id, status: "updated" });
      }

      res.json({ message: `Updated ${updatedCount}, created ${createdCount}, skipped ${skippedCount}`, updatedCount, createdCount, skippedCount, results });
    } catch (error: any) {
      console.error("Error bulk updating installments:", error);
      res.status(500).json({ message: "Failed to update installments", error: error.message });
    }
  });

  // POST /api/installments/generate-all - Generate missing installments for all disbursed loans
  app.post("/api/installments/generate-all", isAuthenticated, async (req: any, res) => {
    try {
      const allLoans = await storage.getDisbursedLoans();
      let totalCreated = 0;
      let totalUpdated = 0;
      let totalSkipped = 0;
      const loanResults: any[] = [];

      for (const loan of allLoans) {
        const existingInstallments = await storage.getInstallmentsByLoan(loan.id);
        const disbursement = await storage.getDisbursementByLoan(loan.id);

        const principalAmount = parseFloat(loan.principleAmount || loan.requestAmount || "0");
        const marginRate = parseFloat(loan.marginRate || "0");
        const durationMonths = loan.financingDurationMonths || 12;
        const numInstallments = durationMonths;
        const gracePeriod = loan.gracePeriod || 0;

        let profitTotal = parseFloat(loan.profit || "0");
        if (profitTotal === 0 && principalAmount > 0) {
          const rate = marginRate > 1 ? marginRate / 100 : marginRate;
          profitTotal = (principalAmount * rate / 12) * durationMonths;
        }
        const grandTotal = principalAmount + profitTotal;

        const principalInstallments = durationMonths - gracePeriod;
        const principalPerInst = principalInstallments > 0 ? principalAmount / principalInstallments : 0;
        const marginPerInst = numInstallments > 0 ? profitTotal / numInstallments : 0;

        const roundedPrincipalPerInst = Math.round(principalPerInst * 100) / 100;
        const roundedMarginPerInst = Math.round(marginPerInst * 100) / 100;
        const principalRemainder = Math.round((principalAmount - (roundedPrincipalPerInst * principalInstallments)) * 100) / 100;
        const marginRemainder = Math.round((profitTotal - (roundedMarginPerInst * numInstallments)) * 100) / 100;

        let createdForLoan = 0;
        let updatedForLoan = 0;
        let skippedForLoan = 0;

        for (let i = 1; i <= numInstallments; i++) {
          const isGracePeriod = i <= gracePeriod;
          const isFirstPrincipalInst = gracePeriod > 0 ? (i === gracePeriod + 1) : (i === 1);

          let instPrincipal: number, instMargin: number, instTotal: number;
          if (isGracePeriod) {
            instPrincipal = 0;
            instMargin = (i === 1) ? roundedMarginPerInst + marginRemainder : roundedMarginPerInst;
            instTotal = instMargin;
          } else if (isFirstPrincipalInst) {
            instPrincipal = roundedPrincipalPerInst + principalRemainder;
            instMargin = (i === 1 || gracePeriod > 0) ? roundedMarginPerInst + (gracePeriod === 0 ? marginRemainder : 0) : roundedMarginPerInst;
            if (gracePeriod === 0 && i === 1) {
              instMargin = roundedMarginPerInst + marginRemainder;
            }
            instTotal = instPrincipal + instMargin;
          } else {
            instPrincipal = roundedPrincipalPerInst;
            instMargin = roundedMarginPerInst;
            instTotal = instPrincipal + instMargin;
          }

          let dueDate: string | null = null;
          if (disbursement?.firstInstallmentDate) {
            const firstDate = new Date(disbursement.firstInstallmentDate);
            firstDate.setMonth(firstDate.getMonth() + (i - 1));
            dueDate = firstDate.toISOString().split("T")[0];
          }

          const existingInst = existingInstallments.find((inst: any) => inst.installmentNumber === i);
          if (existingInst) {
            const existPrincipal = parseFloat(existingInst.principleAmount || "0");
            const existTotal = parseFloat(existingInst.totalAmount || "0");
            const needsUpdate = !existingInst.principleAmount || !existingInst.totalAmount
              || existPrincipal <= 0 || existTotal <= 0
              || Math.abs(existPrincipal - instPrincipal) > 0.01
              || Math.abs(existTotal - instTotal) > 0.01;
            if (needsUpdate) {
              await storage.updateInstallmentAmounts(existingInst.id, {
                principleAmount: instPrincipal.toFixed(2),
                marginAmount: instMargin.toFixed(2),
                totalAmount: instTotal.toFixed(2),
              });
              updatedForLoan++;
            } else {
              skippedForLoan++;
            }
            continue;
          }

          await storage.createInstallment({
            loanId: loan.id,
            installmentNumber: i,
            dueDate,
            principleAmount: instPrincipal.toFixed(2),
            marginAmount: instMargin.toFixed(2),
            totalAmount: instTotal.toFixed(2),
            paidAmount: "0",
            installmentVariance: null,
            paymentDate: null,
            lateDays: null,
            isPaid: false,
          });
          createdForLoan++;
        }

        totalCreated += createdForLoan;
        totalUpdated += updatedForLoan;
        totalSkipped += skippedForLoan;
        if (createdForLoan > 0 || updatedForLoan > 0) {
          loanResults.push({ applicationId: loan.applicationId, loanId: loan.id, created: createdForLoan, updated: updatedForLoan, existing: skippedForLoan });
        }
      }

      res.json({
        message: `Processed ${allLoans.length} loans. Created ${totalCreated}, updated ${totalUpdated} (had zero/null amounts), skipped ${totalSkipped} existing.`,
        totalLoans: allLoans.length,
        totalCreated,
        totalUpdated,
        totalSkipped,
        loanResults,
      });
    } catch (error: any) {
      console.error("Error generating all installments:", error);
      res.status(500).json({ message: "Failed to generate installments", error: error.message });
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

      // Duplicate check: prevent creating a new application if same national ID already has a pending/active loan
      if (data.nationalId) {
        const existingCustomers = await db.select().from(customers).where(eq(customers.nationalId, data.nationalId));
        if (existingCustomers.length > 0) {
          const customerIds = existingCustomers.map(c => c.id);
          const existingLoans = await db.select().from(loans).where(
            and(
              inArray(loans.customerId, customerIds),
              inArray(loans.status, ['pending', 'pending_fad_review', 'pending_risk_review', 'pending_committee_review', 'approved', 'active'])
            )
          );
          if (existingLoans.length > 0) {
            return res.status(400).json({ 
              message: `A financing application already exists for this customer (National ID: ${data.nationalId}). Existing application ID: ${existingLoans[0].applicationId}` 
            });
          }
        }
      }
      
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
          dateOfBirth: data.financialGuarantorDateOfBirth,
          age: data.financialGuarantorDateOfBirth ? Math.floor((Date.now() - new Date(data.financialGuarantorDateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
          nationalId: data.financialGuarantorNid,
          nidExpiryDate: data.financialGuarantorNidExpiry,
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
          dateOfBirth: data.familyGuarantorDateOfBirth,
          age: data.familyGuarantorDateOfBirth ? Math.floor((Date.now() - new Date(data.familyGuarantorDateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
          nationalId: data.familyGuarantorNid,
          nidExpiryDate: data.familyGuarantorNidExpiry,
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

      const fadReview = await storage.getFadReviewByLoanId(loan.id);
      const riskComplianceReview = await storage.getRiskComplianceReviewByLoanId(loan.id);
      const committeeVotes = await storage.getCommitteeVotesByLoanId(loan.id);
      
      res.json({
        loan,
        customer,
        business,
        license,
        collateral,
        financialGuarantor,
        familyGuarantor,
        fadReview,
        riskComplianceReview,
        committeeVotes,
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

      const str = (v: any) => (v !== undefined && v !== null && v !== "") ? v : null;
      const num = (v: any) => (v !== undefined && v !== null && v !== "") ? Number(v) : null;
      const dec = (v: any) => (v !== undefined && v !== null && v !== "" && v !== 0) ? v.toString() : (v === 0 ? "0" : null);

      // Update customer
      if (loan.customerId) {
        await storage.updateCustomer(loan.customerId, {
          customerNo: str(data.customerNo),
          firstName: str(data.firstName),
          lastName: str(data.lastName),
          fatherName: str(data.fatherName),
          gender: str(data.gender),
          nationalId: str(data.nationalId),
          dateOfBirth: str(data.dateOfBirth),
          placeOfBirth: str(data.placeOfBirth),
          homeAddress: str(data.homeAddress),
          district: str(data.district),
          phoneNumber: str(data.phoneNumber),
          secondPhoneNumber: str(data.secondPhoneNumber),
          numberOfDependents: num(data.numberOfDependents),
          directMaleDependent: num(data.directMaleDependent),
          directFemaleDependent: num(data.directFemaleDependent),
          indirectMaleDependent: num(data.indirectMaleDependent),
          indirectFemaleDependent: num(data.indirectFemaleDependent),
        });
      }

      // Update loan
      await storage.updateLoan(loan.id, {
        branchId: str(data.branchId),
        financeOfficerId: str(data.financeOfficerId),
        productName: str(data.productName),
        productCode: str(data.productCode),
        sector: str(data.sector),
        businessDescription: str(data.businessDescription),
        financingPurpose: str(data.financingPurpose),
        fundingSourceId: str(data.fundingSourceId),
        requestDate: str(data.requestDate),
        requestAmount: dec(data.requestAmount),
        financingDurationMonths: num(data.financingDurationMonths),
        gracePeriod: num(data.gracePeriod),
        numberOfInstallments: num(data.numberOfInstallments),
        principleAmount: dec(data.principleAmount),
        marginRate: dec(data.marginRate),
      });

      // Update or create business
      if (loan.customerId) {
        let business = await storage.getCustomerBusinessByCustomerId(loan.customerId);
        const businessData = {
          businessName: str(data.businessName),
          province: str(data.businessProvince),
          district: str(data.businessDistrict),
          village: str(data.businessVillage),
          detailedAddress: str(data.businessDetailedAddress),
          yearsOfExperience: num(data.businessYearsOfExperience),
        };

        if (business) {
          await storage.updateCustomerBusiness(business.id, businessData);
        } else {
          const hasBusinessData = Object.values(businessData).some(v => v !== null);
          if (hasBusinessData) {
            business = await storage.createCustomerBusiness({ customerId: loan.customerId, ...businessData });
          }
        }

        if (business) {
          const licenseData = {
            licenseType: str(data.licenseType),
            president: str(data.licensePresident),
            licenseNumber: str(data.licenseNumber),
            registerDate: str(data.licenseRegisterDate),
            expiryDate: str(data.licenseExpiryDate),
          };
          const license = await storage.getBusinessLicenseByBusinessId(business.id);
          if (license) {
            await storage.updateBusinessLicense(license.id, licenseData);
          } else {
            const hasLicenseData = Object.values(licenseData).some(v => v !== null);
            if (hasLicenseData) {
              await storage.createBusinessLicense({ customerBusinessId: business.id, ...licenseData });
            }
          }
        }
      }

      // Update or create collateral
      const collateral = await storage.getCollateralByLoanId(loan.id);
      const collateralData = {
        ownerName: str(data.collateralOwnerName),
        ownerNationalId: str(data.collateralOwnerNid),
        collateralType: str(data.collateralType),
        province: str(data.collateralProvince),
        address: str(data.collateralAddress),
        purchasedPrice: dec(data.collateralPurchasedPrice),
        marketPrice: dec(data.collateralMarketPrice),
      };
      if (collateral) {
        await storage.updateCollateral(collateral.id, collateralData);
      } else {
        const hasCollateralData = Object.values(collateralData).some(v => v !== null);
        if (hasCollateralData) {
          await storage.createCollateral({ loanId: loan.id, ...collateralData });
        }
      }

      // Update or create guarantors
      const guarantors = await storage.getGuarantorsByLoanId(loan.id);
      const financialGuarantor = guarantors.find(g => g.guarantorType === "financial");
      const familyGuarantor = guarantors.find(g => g.guarantorType === "family");

      const financialGuarantorData = {
        fullName: str(data.financialGuarantorFullName),
        fatherName: str(data.financialGuarantorFatherName),
        dateOfBirth: str(data.financialGuarantorDateOfBirth),
        age: data.financialGuarantorDateOfBirth ? Math.floor((Date.now() - new Date(data.financialGuarantorDateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        nationalId: str(data.financialGuarantorNid),
        nidExpiryDate: str(data.financialGuarantorNidExpiry),
        phoneNumber: str(data.financialGuarantorPhone),
        homeAddress: str(data.financialGuarantorHomeAddress),
        district: str(data.financialGuarantorDistrict),
        business: str(data.financialGuarantorBusiness),
        businessAddress: str(data.financialGuarantorBusinessAddress),
        relationshipWithCustomer: str(data.financialGuarantorRelationship),
        yearsOfExperience: num(data.financialGuarantorYearsOfExperience),
        inventory: dec(data.financialGuarantorInventory),
        monthlyIncome: dec(data.financialGuarantorMonthlyIncome),
      };
      if (financialGuarantor) {
        await storage.updateGuarantor(financialGuarantor.id, financialGuarantorData);
      } else {
        const hasData = Object.values(financialGuarantorData).some(v => v !== null);
        if (hasData) {
          await storage.createGuarantor({ loanId: loan.id, guarantorType: "financial", ...financialGuarantorData });
        }
      }

      const familyGuarantorData = {
        fullName: str(data.familyGuarantorFullName),
        fatherName: str(data.familyGuarantorFatherName),
        dateOfBirth: str(data.familyGuarantorDateOfBirth),
        age: data.familyGuarantorDateOfBirth ? Math.floor((Date.now() - new Date(data.familyGuarantorDateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        nationalId: str(data.familyGuarantorNid),
        nidExpiryDate: str(data.familyGuarantorNidExpiry),
        phoneNumber: str(data.familyGuarantorPhone),
        homeAddress: str(data.familyGuarantorHomeAddress),
        district: str(data.familyGuarantorDistrict),
        relationshipWithCustomer: str(data.familyGuarantorRelationship),
      };
      if (familyGuarantor) {
        await storage.updateGuarantor(familyGuarantor.id, familyGuarantorData);
      } else {
        const hasData = Object.values(familyGuarantorData).some(v => v !== null);
        if (hasData) {
          await storage.createGuarantor({ loanId: loan.id, guarantorType: "family", ...familyGuarantorData });
        }
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
        approvedById: req.session.userId || (req.user?.claims?.sub) || "unknown",
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
      const dayOfMonth = today.getDate();
      const duration = loan.financingDurationMonths || 12;

      let firstInstallmentDate: Date;
      if (dayOfMonth >= 25) {
        firstInstallmentDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
      } else {
        firstInstallmentDate = new Date(today.getFullYear(), today.getMonth() + 1, dayOfMonth);
      }
      
      const maturityDate = new Date(firstInstallmentDate);
      maturityDate.setMonth(maturityDate.getMonth() + duration - 1);
      
      const result = await storage.disburseLoan(req.params.id, {
        disbursementDate: today.toISOString().split("T")[0],
        firstInstallmentDate: firstInstallmentDate.toISOString().split("T")[0],
        maturityDate: maturityDate.toISOString().split("T")[0],
        disbursedById: req.session.userId || (req.user?.claims?.sub) || "unknown",
      });
      
      await logActivity(req, "disburse_loan", "loan", req.params.id, `Disbursed loan: ${loan.applicationId}`);
      res.json({ message: "Loan disbursed successfully", installmentsCreated: result.installmentsCreated });
    } catch (error) {
      console.error("Error disbursing loan:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Failed to disburse loan. " + errorMessage });
    }
  });

  // ===== BULK DISBURSEMENT (CSV Upload) =====
  const monthMap: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };

  function normalizeDateToISO(raw: string): string | null {
    const trimmed = raw.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const ddMonYY = trimmed.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})$/);
    if (ddMonYY) {
      const day = ddMonYY[1].padStart(2, "0");
      const mon = monthMap[ddMonYY[2].toLowerCase()];
      let year = ddMonYY[3];
      if (year.length === 2) year = (parseInt(year) > 50 ? "19" : "20") + year;
      if (mon) return `${year}-${mon}-${day}`;
    }
    const mmddyyyy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mmddyyyy) {
      return `${mmddyyyy[3]}-${mmddyyyy[1].padStart(2, "0")}-${mmddyyyy[2].padStart(2, "0")}`;
    }
    return null;
  }

  function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          result.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
    }
    result.push(current.trim());
    return result;
  }

  app.post("/api/loans/bulk-disburse", isAuthenticated, requireRole("manager", "admin"), csvUpload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No CSV file uploaded" });
      }

      const csvContent = fs.readFileSync(req.file.path, "utf-8");
      const lines = csvContent.split(/\r?\n/).filter((line: string) => line.trim());
      
      if (lines.length < 2) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "CSV file is empty or has no data rows" });
      }

      const headers = parseCSVLine(lines[0]).map((h: string) => h.toLowerCase());
      const appIdIdx = headers.findIndex((h: string) => h.includes("application") && h.includes("id"));
      const disbDateIdx = headers.findIndex((h: string) => h.includes("disbursement") && h.includes("date"));

      if (appIdIdx === -1 || disbDateIdx === -1) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "CSV must have 'Application ID' and 'Disbursement Date' columns" });
      }

      const results: any[] = [];
      const userId = req.user?.claims?.sub || "system";

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        const applicationId = cols[appIdIdx];
        const disbursementDate = cols[disbDateIdx];

        if (!applicationId || !disbursementDate) {
          results.push({ applicationId: applicationId || `Row ${i + 1}`, success: false, error: "Missing application ID or disbursement date" });
          continue;
        }

        const normalizedDate = normalizeDateToISO(disbursementDate);
        if (!normalizedDate) {
          results.push({ applicationId, success: false, error: `Invalid date format: ${disbursementDate}. Use YYYY-MM-DD, DD-Mon-YY, or MM/DD/YYYY` });
          continue;
        }

        const result = await storage.bulkDisburseLoan(applicationId, normalizedDate, userId);
        results.push(result);
      }

      fs.unlinkSync(req.file.path);

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      res.json({
        message: `Processed ${results.length} loans: ${successCount} succeeded, ${failCount} failed`,
        successCount,
        failCount,
        results,
      });
    } catch (error: any) {
      console.error("Error in bulk disbursement:", error);
      res.status(500).json({ message: "Failed to process bulk disbursement: " + error.message });
    }
  });

  // ===== BULK SOURCE OF FUND UPDATE =====
  app.post("/api/admin/update-source-of-fund", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { applicationIds, sourceOfFund } = req.body;
      if (!applicationIds || !Array.isArray(applicationIds) || !sourceOfFund) {
        return res.status(400).json({ message: "applicationIds (array) and sourceOfFund (string) are required" });
      }
      const result = await db.execute(sql`UPDATE loans SET source_of_fund = ${sourceOfFund} WHERE application_id = ANY(${applicationIds})`);
      res.json({ message: `Updated source of fund to '${sourceOfFund}' for ${applicationIds.length} applications`, count: applicationIds.length });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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

      if (status === "approved") {
        await storage.updateLoan(loanId, { status: "risk_compliance_review" });
        await logActivity(req, "fad_approve", "loan", loanId, `FAD approved - forwarded to Risk Compliance review`);
      } else {
        await storage.updateLoan(loanId, { status: "pending" });
        await logActivity(req, "fad_reject", "loan", loanId, `FAD rejected - sent back to Finance Officer - ${comments}`);
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
        await storage.updateLoan(loanId, { status: "data_quality_review" });
        await logActivity(req, "risk_compliance_reject", "loan", loanId, `Risk Compliance rejected - sent back to FAD - ${comments}`);
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
  app.get("/api/committee/pending-loans", isAuthenticated, requireRole("cfo", "coo", "ceo", "manager", "admin"), async (req: any, res) => {
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

  app.post("/api/committee/vote", isAuthenticated, requireRole("cfo", "coo", "ceo", "manager", "admin"), async (req: any, res) => {
    try {
      const { loanId, vote, comments, fundingSourceId } = req.body;
      
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

      if (fundingSourceId && userRole.role === "cfo") {
        await storage.updateLoan(loanId, { fundingSourceId });
        await logActivity(req, "set_funding_source", "loan", loanId, `CFO set funding source: ${fundingSourceId}`);
      }

      await logActivity(req, "committee_vote", "loan", loanId, `Committee vote: ${vote} by ${userRole.role}`);

      // Check if we have enough votes to finalize
      const allVotes = await storage.getCommitteeVotesByLoanId(loanId);
      const approvedVotes = allVotes.filter((v: any) => v.vote === "approved").length;
      const rejectedVotes = allVotes.filter((v: any) => v.vote === "rejected").length;
      const REQUIRED_APPROVALS = 3;
      const COMMITTEE_SIZE = 3;

      if (approvedVotes >= REQUIRED_APPROVALS) {
        const approvedLoan = await storage.getLoan(loanId);
        await storage.approveLoan(loanId, {
          loanId,
          approvedAmount: approvedLoan?.requestAmount || approvedLoan?.principleAmount || "0",
          approvedDate: new Date().toISOString().split("T")[0],
          financingDurationMonths: approvedLoan?.financingDurationMonths || 12,
          gracePeriod: approvedLoan?.gracePeriod || 0,
          approvedById: req.session.userId || (req.user?.claims?.sub) || "unknown",
          committeeDiscussion: comments || `Committee approved with ${approvedVotes} votes`,
        });
        await logActivity(req, "committee_approve", "loan", loanId, `Committee approved with ${approvedVotes} votes`);
      } else if (rejectedVotes > (COMMITTEE_SIZE - REQUIRED_APPROVALS)) {
        await storage.updateLoan(loanId, { status: "risk_compliance_review" });
        await logActivity(req, "committee_reject", "loan", loanId, `Committee rejected with ${rejectedVotes} votes - sent back to Risk Compliance`);
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

  // ===== COLLECTIONS =====
  app.get("/api/collections", isAuthenticated, async (req, res) => {
    try {
      const { filter, branch, officer, search, page, limit } = req.query;
      const result = await storage.getCollectionInstallments({
        filter: (filter as string) || "upcoming",
        branch: branch as string | undefined,
        officer: officer as string | undefined,
        search: search as string | undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      res.json({
        ...result,
        page: page ? parseInt(page as string) : 1,
        totalPages: Math.ceil(result.total / (limit ? parseInt(limit as string) : 20)),
      });
    } catch (error) {
      console.error("Error fetching collections:", error);
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  app.patch("/api/collections/:id/pay", isAuthenticated, async (req: any, res) => {
    try {
      const schema = z.object({ amount: z.number().positive("Payment amount must be greater than 0") });
      const parsed = schema.parse(req.body);
      const installment = await storage.recordPartialPayment(req.params.id, parsed.amount);
      const action = installment.isPaid ? "full_payment" : "partial_payment";
      await logActivity(req, action, "installment", req.params.id,
        `Recorded ${action === "full_payment" ? "full" : "partial"} payment of AFN ${parsed.amount.toLocaleString()} for installment #${installment.installmentNumber}`
      );
      res.json(installment);
    } catch (error: any) {
      console.error("Error recording collection payment:", error);
      res.status(400).json({ message: error.message || "Failed to record payment" });
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
      const { username, password, firstName, lastName, email, role, financeOfficerId } = req.body;
      
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

      if (role === "finance_officer" && financeOfficerId) {
        const targetOfficer = await storage.getOfficer(financeOfficerId);
        if (targetOfficer?.userId && targetOfficer.userId !== user.id) {
          await storage.updateOfficer(financeOfficerId, { userId: null } as any);
        }
        await storage.updateOfficer(financeOfficerId, { userId: user.id } as any);
      }

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
      const { username, password, firstName, lastName, email, role, financeOfficerId } = req.body;
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

      if (role === "finance_officer" && financeOfficerId) {
        const previousOfficer = await storage.getOfficerByUserId(userId);
        if (previousOfficer && previousOfficer.id !== financeOfficerId) {
          await storage.updateOfficer(previousOfficer.id, { userId: null } as any);
        }
        const targetOfficer = await storage.getOfficer(financeOfficerId);
        if (targetOfficer?.userId && targetOfficer.userId !== userId) {
          await storage.updateOfficer(financeOfficerId, { userId: null } as any);
        }
        await storage.updateOfficer(financeOfficerId, { userId } as any);
      } else if (role && role !== "finance_officer") {
        const previousOfficer = await storage.getOfficerByUserId(userId);
        if (previousOfficer) {
          await storage.updateOfficer(previousOfficer.id, { userId: null } as any);
        }
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

  // ============== PAYROLL MODULE ==============

  // Salary Structures
  app.get("/api/hr/payroll/salary-structures", isAuthenticated, async (req, res) => {
    try {
      const structures = await storage.getSalaryStructures();
      res.json(structures);
    } catch (error) {
      console.error("Error fetching salary structures:", error);
      res.status(500).json({ message: "Failed to fetch salary structures" });
    }
  });

  app.post("/api/hr/payroll/salary-structures", isAuthenticated, async (req: any, res) => {
    try {
      const structure = await storage.createSalaryStructure(req.body);
      await logActivity(req, "create", "salary_structure", structure.id, "Created salary structure");
      res.status(201).json(structure);
    } catch (error) {
      console.error("Error creating salary structure:", error);
      res.status(500).json({ message: "Failed to create salary structure" });
    }
  });

  app.patch("/api/hr/payroll/salary-structures/:id", isAuthenticated, async (req: any, res) => {
    try {
      const structure = await storage.updateSalaryStructure(req.params.id, req.body);
      await logActivity(req, "update", "salary_structure", req.params.id, "Updated salary structure");
      res.json(structure);
    } catch (error) {
      console.error("Error updating salary structure:", error);
      res.status(500).json({ message: "Failed to update salary structure" });
    }
  });

  app.delete("/api/hr/payroll/salary-structures/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteSalaryStructure(req.params.id);
      await logActivity(req, "delete", "salary_structure", req.params.id, "Deleted salary structure");
      res.json({ message: "Salary structure deleted" });
    } catch (error) {
      console.error("Error deleting salary structure:", error);
      res.status(500).json({ message: "Failed to delete salary structure" });
    }
  });

  // Allowance Types
  app.get("/api/hr/payroll/allowance-types", isAuthenticated, async (req, res) => {
    try {
      const types = await storage.getAllowanceTypes();
      res.json(types);
    } catch (error) {
      console.error("Error fetching allowance types:", error);
      res.status(500).json({ message: "Failed to fetch allowance types" });
    }
  });

  app.post("/api/hr/payroll/allowance-types", isAuthenticated, async (req: any, res) => {
    try {
      const type = await storage.createAllowanceType(req.body);
      await logActivity(req, "create", "allowance_type", type.id, "Created allowance type");
      res.status(201).json(type);
    } catch (error) {
      console.error("Error creating allowance type:", error);
      res.status(500).json({ message: "Failed to create allowance type" });
    }
  });

  app.patch("/api/hr/payroll/allowance-types/:id", isAuthenticated, async (req: any, res) => {
    try {
      const type = await storage.updateAllowanceType(req.params.id, req.body);
      await logActivity(req, "update", "allowance_type", req.params.id, "Updated allowance type");
      res.json(type);
    } catch (error) {
      console.error("Error updating allowance type:", error);
      res.status(500).json({ message: "Failed to update allowance type" });
    }
  });

  app.delete("/api/hr/payroll/allowance-types/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteAllowanceType(req.params.id);
      await logActivity(req, "delete", "allowance_type", req.params.id, "Deleted allowance type");
      res.json({ message: "Allowance type deleted" });
    } catch (error) {
      console.error("Error deleting allowance type:", error);
      res.status(500).json({ message: "Failed to delete allowance type" });
    }
  });

  // Deduction Types
  app.get("/api/hr/payroll/deduction-types", isAuthenticated, async (req, res) => {
    try {
      const types = await storage.getDeductionTypes();
      res.json(types);
    } catch (error) {
      console.error("Error fetching deduction types:", error);
      res.status(500).json({ message: "Failed to fetch deduction types" });
    }
  });

  app.post("/api/hr/payroll/deduction-types", isAuthenticated, async (req: any, res) => {
    try {
      const type = await storage.createDeductionType(req.body);
      await logActivity(req, "create", "deduction_type", type.id, "Created deduction type");
      res.status(201).json(type);
    } catch (error) {
      console.error("Error creating deduction type:", error);
      res.status(500).json({ message: "Failed to create deduction type" });
    }
  });

  app.patch("/api/hr/payroll/deduction-types/:id", isAuthenticated, async (req: any, res) => {
    try {
      const type = await storage.updateDeductionType(req.params.id, req.body);
      await logActivity(req, "update", "deduction_type", req.params.id, "Updated deduction type");
      res.json(type);
    } catch (error) {
      console.error("Error updating deduction type:", error);
      res.status(500).json({ message: "Failed to update deduction type" });
    }
  });

  app.delete("/api/hr/payroll/deduction-types/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteDeductionType(req.params.id);
      await logActivity(req, "delete", "deduction_type", req.params.id, "Deleted deduction type");
      res.json({ message: "Deduction type deleted" });
    } catch (error) {
      console.error("Error deleting deduction type:", error);
      res.status(500).json({ message: "Failed to delete deduction type" });
    }
  });

  // Employee Salaries
  app.get("/api/hr/payroll/employee-salaries", isAuthenticated, async (req, res) => {
    try {
      const { employeeId } = req.query;
      const salaries = await storage.getEmployeeSalaries(employeeId as string);
      res.json(salaries);
    } catch (error) {
      console.error("Error fetching employee salaries:", error);
      res.status(500).json({ message: "Failed to fetch employee salaries" });
    }
  });

  app.post("/api/hr/payroll/employee-salaries", isAuthenticated, async (req: any, res) => {
    try {
      const salary = await storage.createEmployeeSalary(req.body);
      await logActivity(req, "create", "employee_salary", salary.id, "Created employee salary");
      res.status(201).json(salary);
    } catch (error) {
      console.error("Error creating employee salary:", error);
      res.status(500).json({ message: "Failed to create employee salary" });
    }
  });

  app.patch("/api/hr/payroll/employee-salaries/:id", isAuthenticated, async (req: any, res) => {
    try {
      const salary = await storage.updateEmployeeSalary(req.params.id, req.body);
      await logActivity(req, "update", "employee_salary", req.params.id, "Updated employee salary");
      res.json(salary);
    } catch (error) {
      console.error("Error updating employee salary:", error);
      res.status(500).json({ message: "Failed to update employee salary" });
    }
  });

  // Employee Allowances
  app.get("/api/hr/payroll/employee-allowances", isAuthenticated, async (req, res) => {
    try {
      const { employeeId } = req.query;
      const allowances = await storage.getEmployeeAllowances(employeeId as string);
      res.json(allowances);
    } catch (error) {
      console.error("Error fetching employee allowances:", error);
      res.status(500).json({ message: "Failed to fetch employee allowances" });
    }
  });

  app.post("/api/hr/payroll/employee-allowances", isAuthenticated, async (req: any, res) => {
    try {
      const allowance = await storage.createEmployeeAllowance(req.body);
      await logActivity(req, "create", "employee_allowance", allowance.id, "Created employee allowance");
      res.status(201).json(allowance);
    } catch (error) {
      console.error("Error creating employee allowance:", error);
      res.status(500).json({ message: "Failed to create employee allowance" });
    }
  });

  app.delete("/api/hr/payroll/employee-allowances/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteEmployeeAllowance(req.params.id);
      await logActivity(req, "delete", "employee_allowance", req.params.id, "Deleted employee allowance");
      res.json({ message: "Employee allowance deleted" });
    } catch (error) {
      console.error("Error deleting employee allowance:", error);
      res.status(500).json({ message: "Failed to delete employee allowance" });
    }
  });

  // Employee Deductions
  app.get("/api/hr/payroll/employee-deductions", isAuthenticated, async (req, res) => {
    try {
      const { employeeId } = req.query;
      const deductions = await storage.getEmployeeDeductions(employeeId as string);
      res.json(deductions);
    } catch (error) {
      console.error("Error fetching employee deductions:", error);
      res.status(500).json({ message: "Failed to fetch employee deductions" });
    }
  });

  app.post("/api/hr/payroll/employee-deductions", isAuthenticated, async (req: any, res) => {
    try {
      const deduction = await storage.createEmployeeDeduction(req.body);
      await logActivity(req, "create", "employee_deduction", deduction.id, "Created employee deduction");
      res.status(201).json(deduction);
    } catch (error) {
      console.error("Error creating employee deduction:", error);
      res.status(500).json({ message: "Failed to create employee deduction" });
    }
  });

  app.delete("/api/hr/payroll/employee-deductions/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteEmployeeDeduction(req.params.id);
      await logActivity(req, "delete", "employee_deduction", req.params.id, "Deleted employee deduction");
      res.json({ message: "Employee deduction deleted" });
    } catch (error) {
      console.error("Error deleting employee deduction:", error);
      res.status(500).json({ message: "Failed to delete employee deduction" });
    }
  });

  // Payroll Runs
  app.get("/api/hr/payroll/runs", isAuthenticated, async (req, res) => {
    try {
      const runs = await storage.getPayrollRuns();
      res.json(runs);
    } catch (error) {
      console.error("Error fetching payroll runs:", error);
      res.status(500).json({ message: "Failed to fetch payroll runs" });
    }
  });

  app.get("/api/hr/payroll/runs/:id", isAuthenticated, async (req, res) => {
    try {
      const run = await storage.getPayrollRun(req.params.id);
      if (!run) {
        return res.status(404).json({ message: "Payroll run not found" });
      }
      res.json(run);
    } catch (error) {
      console.error("Error fetching payroll run:", error);
      res.status(500).json({ message: "Failed to fetch payroll run" });
    }
  });

  app.post("/api/hr/payroll/runs", isAuthenticated, async (req: any, res) => {
    try {
      const run = await storage.createPayrollRun(req.body);
      await logActivity(req, "create", "payroll_run", run.id, "Created payroll run");
      res.status(201).json(run);
    } catch (error) {
      console.error("Error creating payroll run:", error);
      res.status(500).json({ message: "Failed to create payroll run" });
    }
  });

  app.patch("/api/hr/payroll/runs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const run = await storage.updatePayrollRun(req.params.id, req.body);
      await logActivity(req, "update", "payroll_run", req.params.id, "Updated payroll run");
      res.json(run);
    } catch (error) {
      console.error("Error updating payroll run:", error);
      res.status(500).json({ message: "Failed to update payroll run" });
    }
  });

  app.delete("/api/hr/payroll/runs/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deletePayrollRun(req.params.id);
      await logActivity(req, "delete", "payroll_run", req.params.id, "Deleted payroll run");
      res.json({ message: "Payroll run deleted" });
    } catch (error) {
      console.error("Error deleting payroll run:", error);
      res.status(500).json({ message: "Failed to delete payroll run" });
    }
  });

  // Payslips
  app.get("/api/hr/payroll/payslips", isAuthenticated, async (req, res) => {
    try {
      const { payrollRunId } = req.query;
      const payslips = await storage.getPayslips(payrollRunId as string);
      res.json(payslips);
    } catch (error) {
      console.error("Error fetching payslips:", error);
      res.status(500).json({ message: "Failed to fetch payslips" });
    }
  });

  app.get("/api/hr/payroll/payslips/:id", isAuthenticated, async (req, res) => {
    try {
      const payslip = await storage.getPayslip(req.params.id);
      if (!payslip) {
        return res.status(404).json({ message: "Payslip not found" });
      }
      res.json(payslip);
    } catch (error) {
      console.error("Error fetching payslip:", error);
      res.status(500).json({ message: "Failed to fetch payslip" });
    }
  });

  app.post("/api/hr/payroll/payslips", isAuthenticated, async (req: any, res) => {
    try {
      const payslip = await storage.createPayslip(req.body);
      await logActivity(req, "create", "payslip", payslip.id, "Created payslip");
      res.status(201).json(payslip);
    } catch (error) {
      console.error("Error creating payslip:", error);
      res.status(500).json({ message: "Failed to create payslip" });
    }
  });

  // ============== RECRUITMENT MODULE ==============

  // Job Postings
  app.get("/api/hr/recruitment/jobs", isAuthenticated, async (req, res) => {
    try {
      const jobs = await storage.getJobPostings();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching job postings:", error);
      res.status(500).json({ message: "Failed to fetch job postings" });
    }
  });

  app.get("/api/hr/recruitment/jobs/:id", isAuthenticated, async (req, res) => {
    try {
      const job = await storage.getJobPosting(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job posting not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job posting:", error);
      res.status(500).json({ message: "Failed to fetch job posting" });
    }
  });

  app.post("/api/hr/recruitment/jobs", isAuthenticated, async (req: any, res) => {
    try {
      const job = await storage.createJobPosting({ ...req.body, createdBy: req.user?.id });
      await logActivity(req, "create", "job_posting", job.id, "Created job posting");
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating job posting:", error);
      res.status(500).json({ message: "Failed to create job posting" });
    }
  });

  app.patch("/api/hr/recruitment/jobs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const job = await storage.updateJobPosting(req.params.id, req.body);
      await logActivity(req, "update", "job_posting", req.params.id, "Updated job posting");
      res.json(job);
    } catch (error) {
      console.error("Error updating job posting:", error);
      res.status(500).json({ message: "Failed to update job posting" });
    }
  });

  app.delete("/api/hr/recruitment/jobs/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteJobPosting(req.params.id);
      await logActivity(req, "delete", "job_posting", req.params.id, "Deleted job posting");
      res.json({ message: "Job posting deleted" });
    } catch (error) {
      console.error("Error deleting job posting:", error);
      res.status(500).json({ message: "Failed to delete job posting" });
    }
  });

  // Applicants
  app.get("/api/hr/recruitment/applicants", isAuthenticated, async (req, res) => {
    try {
      const { jobPostingId } = req.query;
      const applicants = await storage.getApplicants(jobPostingId as string);
      res.json(applicants);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      res.status(500).json({ message: "Failed to fetch applicants" });
    }
  });

  app.get("/api/hr/recruitment/applicants/:id", isAuthenticated, async (req, res) => {
    try {
      const applicant = await storage.getApplicant(req.params.id);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      res.json(applicant);
    } catch (error) {
      console.error("Error fetching applicant:", error);
      res.status(500).json({ message: "Failed to fetch applicant" });
    }
  });

  app.post("/api/hr/recruitment/applicants", isAuthenticated, async (req: any, res) => {
    try {
      const applicant = await storage.createApplicant(req.body);
      await logActivity(req, "create", "applicant", applicant.id, "Created applicant");
      res.status(201).json(applicant);
    } catch (error) {
      console.error("Error creating applicant:", error);
      res.status(500).json({ message: "Failed to create applicant" });
    }
  });

  app.patch("/api/hr/recruitment/applicants/:id", isAuthenticated, async (req: any, res) => {
    try {
      const applicant = await storage.updateApplicant(req.params.id, req.body);
      await logActivity(req, "update", "applicant", req.params.id, "Updated applicant");
      res.json(applicant);
    } catch (error) {
      console.error("Error updating applicant:", error);
      res.status(500).json({ message: "Failed to update applicant" });
    }
  });

  app.delete("/api/hr/recruitment/applicants/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteApplicant(req.params.id);
      await logActivity(req, "delete", "applicant", req.params.id, "Deleted applicant");
      res.json({ message: "Applicant deleted" });
    } catch (error) {
      console.error("Error deleting applicant:", error);
      res.status(500).json({ message: "Failed to delete applicant" });
    }
  });

  // Interviews
  app.get("/api/hr/recruitment/interviews", isAuthenticated, async (req, res) => {
    try {
      const { applicantId } = req.query;
      const interviews = await storage.getInterviews(applicantId as string);
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ message: "Failed to fetch interviews" });
    }
  });

  app.post("/api/hr/recruitment/interviews", isAuthenticated, async (req: any, res) => {
    try {
      const interview = await storage.createInterview(req.body);
      await logActivity(req, "create", "interview", interview.id, "Scheduled interview");
      res.status(201).json(interview);
    } catch (error) {
      console.error("Error creating interview:", error);
      res.status(500).json({ message: "Failed to create interview" });
    }
  });

  app.patch("/api/hr/recruitment/interviews/:id", isAuthenticated, async (req: any, res) => {
    try {
      const interview = await storage.updateInterview(req.params.id, req.body);
      await logActivity(req, "update", "interview", req.params.id, "Updated interview");
      res.json(interview);
    } catch (error) {
      console.error("Error updating interview:", error);
      res.status(500).json({ message: "Failed to update interview" });
    }
  });

  app.delete("/api/hr/recruitment/interviews/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteInterview(req.params.id);
      await logActivity(req, "delete", "interview", req.params.id, "Deleted interview");
      res.json({ message: "Interview deleted" });
    } catch (error) {
      console.error("Error deleting interview:", error);
      res.status(500).json({ message: "Failed to delete interview" });
    }
  });

  // ============== PERFORMANCE MODULE ==============

  // Performance Periods
  app.get("/api/hr/performance/periods", isAuthenticated, async (req, res) => {
    try {
      const periods = await storage.getPerformancePeriods();
      res.json(periods);
    } catch (error) {
      console.error("Error fetching performance periods:", error);
      res.status(500).json({ message: "Failed to fetch performance periods" });
    }
  });

  app.post("/api/hr/performance/periods", isAuthenticated, async (req: any, res) => {
    try {
      const period = await storage.createPerformancePeriod(req.body);
      await logActivity(req, "create", "performance_period", period.id, "Created performance period");
      res.status(201).json(period);
    } catch (error) {
      console.error("Error creating performance period:", error);
      res.status(500).json({ message: "Failed to create performance period" });
    }
  });

  app.patch("/api/hr/performance/periods/:id", isAuthenticated, async (req: any, res) => {
    try {
      const period = await storage.updatePerformancePeriod(req.params.id, req.body);
      await logActivity(req, "update", "performance_period", req.params.id, "Updated performance period");
      res.json(period);
    } catch (error) {
      console.error("Error updating performance period:", error);
      res.status(500).json({ message: "Failed to update performance period" });
    }
  });

  app.delete("/api/hr/performance/periods/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deletePerformancePeriod(req.params.id);
      await logActivity(req, "delete", "performance_period", req.params.id, "Deleted performance period");
      res.json({ message: "Performance period deleted" });
    } catch (error) {
      console.error("Error deleting performance period:", error);
      res.status(500).json({ message: "Failed to delete performance period" });
    }
  });

  // Performance Reviews
  app.get("/api/hr/performance/reviews", isAuthenticated, async (req, res) => {
    try {
      const { employeeId, periodId } = req.query;
      const reviews = await storage.getPerformanceReviews(employeeId as string, periodId as string);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching performance reviews:", error);
      res.status(500).json({ message: "Failed to fetch performance reviews" });
    }
  });

  app.get("/api/hr/performance/reviews/:id", isAuthenticated, async (req, res) => {
    try {
      const review = await storage.getPerformanceReview(req.params.id);
      if (!review) {
        return res.status(404).json({ message: "Performance review not found" });
      }
      res.json(review);
    } catch (error) {
      console.error("Error fetching performance review:", error);
      res.status(500).json({ message: "Failed to fetch performance review" });
    }
  });

  app.post("/api/hr/performance/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const review = await storage.createPerformanceReview(req.body);
      await logActivity(req, "create", "performance_review", review.id, "Created performance review");
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating performance review:", error);
      res.status(500).json({ message: "Failed to create performance review" });
    }
  });

  app.patch("/api/hr/performance/reviews/:id", isAuthenticated, async (req: any, res) => {
    try {
      const review = await storage.updatePerformanceReview(req.params.id, req.body);
      await logActivity(req, "update", "performance_review", req.params.id, "Updated performance review");
      res.json(review);
    } catch (error) {
      console.error("Error updating performance review:", error);
      res.status(500).json({ message: "Failed to update performance review" });
    }
  });

  app.delete("/api/hr/performance/reviews/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deletePerformanceReview(req.params.id);
      await logActivity(req, "delete", "performance_review", req.params.id, "Deleted performance review");
      res.json({ message: "Performance review deleted" });
    } catch (error) {
      console.error("Error deleting performance review:", error);
      res.status(500).json({ message: "Failed to delete performance review" });
    }
  });

  // Goals
  app.get("/api/hr/performance/goals", isAuthenticated, async (req, res) => {
    try {
      const { employeeId, reviewId } = req.query;
      const goals = await storage.getPerformanceGoals(employeeId as string, reviewId as string);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching performance goals:", error);
      res.status(500).json({ message: "Failed to fetch performance goals" });
    }
  });

  app.post("/api/hr/performance/goals", isAuthenticated, async (req: any, res) => {
    try {
      const goal = await storage.createPerformanceGoal(req.body);
      await logActivity(req, "create", "performance_goal", goal.id, "Created performance goal");
      res.status(201).json(goal);
    } catch (error) {
      console.error("Error creating performance goal:", error);
      res.status(500).json({ message: "Failed to create performance goal" });
    }
  });

  app.patch("/api/hr/performance/goals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const goal = await storage.updatePerformanceGoal(req.params.id, req.body);
      await logActivity(req, "update", "performance_goal", req.params.id, "Updated performance goal");
      res.json(goal);
    } catch (error) {
      console.error("Error updating performance goal:", error);
      res.status(500).json({ message: "Failed to update performance goal" });
    }
  });

  app.delete("/api/hr/performance/goals/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deletePerformanceGoal(req.params.id);
      await logActivity(req, "delete", "performance_goal", req.params.id, "Deleted performance goal");
      res.json({ message: "Performance goal deleted" });
    } catch (error) {
      console.error("Error deleting performance goal:", error);
      res.status(500).json({ message: "Failed to delete performance goal" });
    }
  });

  // Competencies
  app.get("/api/hr/performance/competencies", isAuthenticated, async (req, res) => {
    try {
      const competencies = await storage.getCompetencies();
      res.json(competencies);
    } catch (error) {
      console.error("Error fetching competencies:", error);
      res.status(500).json({ message: "Failed to fetch competencies" });
    }
  });

  app.post("/api/hr/performance/competencies", isAuthenticated, async (req: any, res) => {
    try {
      const competency = await storage.createCompetency(req.body);
      await logActivity(req, "create", "competency", competency.id, "Created competency");
      res.status(201).json(competency);
    } catch (error) {
      console.error("Error creating competency:", error);
      res.status(500).json({ message: "Failed to create competency" });
    }
  });

  app.patch("/api/hr/performance/competencies/:id", isAuthenticated, async (req: any, res) => {
    try {
      const competency = await storage.updateCompetency(req.params.id, req.body);
      await logActivity(req, "update", "competency", req.params.id, "Updated competency");
      res.json(competency);
    } catch (error) {
      console.error("Error updating competency:", error);
      res.status(500).json({ message: "Failed to update competency" });
    }
  });

  app.delete("/api/hr/performance/competencies/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteCompetency(req.params.id);
      await logActivity(req, "delete", "competency", req.params.id, "Deleted competency");
      res.json({ message: "Competency deleted" });
    } catch (error) {
      console.error("Error deleting competency:", error);
      res.status(500).json({ message: "Failed to delete competency" });
    }
  });

  // ============== TRAINING MODULE ==============

  // Training Programs
  app.get("/api/hr/training/programs", isAuthenticated, async (req, res) => {
    try {
      const programs = await storage.getTrainingPrograms();
      res.json(programs);
    } catch (error) {
      console.error("Error fetching training programs:", error);
      res.status(500).json({ message: "Failed to fetch training programs" });
    }
  });

  app.get("/api/hr/training/programs/:id", isAuthenticated, async (req, res) => {
    try {
      const program = await storage.getTrainingProgram(req.params.id);
      if (!program) {
        return res.status(404).json({ message: "Training program not found" });
      }
      res.json(program);
    } catch (error) {
      console.error("Error fetching training program:", error);
      res.status(500).json({ message: "Failed to fetch training program" });
    }
  });

  app.post("/api/hr/training/programs", isAuthenticated, async (req: any, res) => {
    try {
      const program = await storage.createTrainingProgram(req.body);
      await logActivity(req, "create", "training_program", program.id, "Created training program");
      res.status(201).json(program);
    } catch (error) {
      console.error("Error creating training program:", error);
      res.status(500).json({ message: "Failed to create training program" });
    }
  });

  app.patch("/api/hr/training/programs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const program = await storage.updateTrainingProgram(req.params.id, req.body);
      await logActivity(req, "update", "training_program", req.params.id, "Updated training program");
      res.json(program);
    } catch (error) {
      console.error("Error updating training program:", error);
      res.status(500).json({ message: "Failed to update training program" });
    }
  });

  app.delete("/api/hr/training/programs/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteTrainingProgram(req.params.id);
      await logActivity(req, "delete", "training_program", req.params.id, "Deleted training program");
      res.json({ message: "Training program deleted" });
    } catch (error) {
      console.error("Error deleting training program:", error);
      res.status(500).json({ message: "Failed to delete training program" });
    }
  });

  // Training Sessions
  app.get("/api/hr/training/sessions", isAuthenticated, async (req, res) => {
    try {
      const { programId } = req.query;
      const sessions = await storage.getTrainingSessions(programId as string);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching training sessions:", error);
      res.status(500).json({ message: "Failed to fetch training sessions" });
    }
  });

  app.post("/api/hr/training/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const session = await storage.createTrainingSession(req.body);
      await logActivity(req, "create", "training_session", session.id, "Created training session");
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating training session:", error);
      res.status(500).json({ message: "Failed to create training session" });
    }
  });

  app.patch("/api/hr/training/sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const session = await storage.updateTrainingSession(req.params.id, req.body);
      await logActivity(req, "update", "training_session", req.params.id, "Updated training session");
      res.json(session);
    } catch (error) {
      console.error("Error updating training session:", error);
      res.status(500).json({ message: "Failed to update training session" });
    }
  });

  app.delete("/api/hr/training/sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteTrainingSession(req.params.id);
      await logActivity(req, "delete", "training_session", req.params.id, "Deleted training session");
      res.json({ message: "Training session deleted" });
    } catch (error) {
      console.error("Error deleting training session:", error);
      res.status(500).json({ message: "Failed to delete training session" });
    }
  });

  // Training Enrollments
  app.get("/api/hr/training/enrollments", isAuthenticated, async (req, res) => {
    try {
      const { sessionId, employeeId } = req.query;
      const enrollments = await storage.getTrainingEnrollments(sessionId as string, employeeId as string);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching training enrollments:", error);
      res.status(500).json({ message: "Failed to fetch training enrollments" });
    }
  });

  app.post("/api/hr/training/enrollments", isAuthenticated, async (req: any, res) => {
    try {
      const enrollment = await storage.createTrainingEnrollment(req.body);
      await logActivity(req, "create", "training_enrollment", enrollment.id, "Created training enrollment");
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error creating training enrollment:", error);
      res.status(500).json({ message: "Failed to create training enrollment" });
    }
  });

  app.patch("/api/hr/training/enrollments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const enrollment = await storage.updateTrainingEnrollment(req.params.id, req.body);
      await logActivity(req, "update", "training_enrollment", req.params.id, "Updated training enrollment");
      res.json(enrollment);
    } catch (error) {
      console.error("Error updating training enrollment:", error);
      res.status(500).json({ message: "Failed to update training enrollment" });
    }
  });

  app.delete("/api/hr/training/enrollments/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteTrainingEnrollment(req.params.id);
      await logActivity(req, "delete", "training_enrollment", req.params.id, "Deleted training enrollment");
      res.json({ message: "Training enrollment deleted" });
    } catch (error) {
      console.error("Error deleting training enrollment:", error);
      res.status(500).json({ message: "Failed to delete training enrollment" });
    }
  });

  // Skills
  app.get("/api/hr/training/skills", isAuthenticated, async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.post("/api/hr/training/skills", isAuthenticated, async (req: any, res) => {
    try {
      const skill = await storage.createSkill(req.body);
      await logActivity(req, "create", "skill", skill.id, "Created skill");
      res.status(201).json(skill);
    } catch (error) {
      console.error("Error creating skill:", error);
      res.status(500).json({ message: "Failed to create skill" });
    }
  });

  app.patch("/api/hr/training/skills/:id", isAuthenticated, async (req: any, res) => {
    try {
      const skill = await storage.updateSkill(req.params.id, req.body);
      await logActivity(req, "update", "skill", req.params.id, "Updated skill");
      res.json(skill);
    } catch (error) {
      console.error("Error updating skill:", error);
      res.status(500).json({ message: "Failed to update skill" });
    }
  });

  app.delete("/api/hr/training/skills/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteSkill(req.params.id);
      await logActivity(req, "delete", "skill", req.params.id, "Deleted skill");
      res.json({ message: "Skill deleted" });
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Employee Skills
  app.get("/api/hr/training/employee-skills/:employeeId", isAuthenticated, async (req, res) => {
    try {
      const empSkills = await storage.getEmployeeSkills(req.params.employeeId);
      res.json(empSkills);
    } catch (error) {
      console.error("Error fetching employee skills:", error);
      res.status(500).json({ message: "Failed to fetch employee skills" });
    }
  });

  app.post("/api/hr/training/employee-skills", isAuthenticated, async (req: any, res) => {
    try {
      const empSkill = await storage.createEmployeeSkill(req.body);
      await logActivity(req, "create", "employee_skill", empSkill.id, "Created employee skill");
      res.status(201).json(empSkill);
    } catch (error) {
      console.error("Error creating employee skill:", error);
      res.status(500).json({ message: "Failed to create employee skill" });
    }
  });

  app.delete("/api/hr/training/employee-skills/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteEmployeeSkill(req.params.id);
      await logActivity(req, "delete", "employee_skill", req.params.id, "Deleted employee skill");
      res.json({ message: "Employee skill deleted" });
    } catch (error) {
      console.error("Error deleting employee skill:", error);
      res.status(500).json({ message: "Failed to delete employee skill" });
    }
  });

  // Certifications
  app.get("/api/hr/training/certifications", isAuthenticated, async (req, res) => {
    try {
      const certifications = await storage.getCertifications();
      res.json(certifications);
    } catch (error) {
      console.error("Error fetching certifications:", error);
      res.status(500).json({ message: "Failed to fetch certifications" });
    }
  });

  app.post("/api/hr/training/certifications", isAuthenticated, async (req: any, res) => {
    try {
      const certification = await storage.createCertification(req.body);
      await logActivity(req, "create", "certification", certification.id, "Created certification");
      res.status(201).json(certification);
    } catch (error) {
      console.error("Error creating certification:", error);
      res.status(500).json({ message: "Failed to create certification" });
    }
  });

  app.patch("/api/hr/training/certifications/:id", isAuthenticated, async (req: any, res) => {
    try {
      const certification = await storage.updateCertification(req.params.id, req.body);
      await logActivity(req, "update", "certification", req.params.id, "Updated certification");
      res.json(certification);
    } catch (error) {
      console.error("Error updating certification:", error);
      res.status(500).json({ message: "Failed to update certification" });
    }
  });

  app.delete("/api/hr/training/certifications/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteCertification(req.params.id);
      await logActivity(req, "delete", "certification", req.params.id, "Deleted certification");
      res.json({ message: "Certification deleted" });
    } catch (error) {
      console.error("Error deleting certification:", error);
      res.status(500).json({ message: "Failed to delete certification" });
    }
  });

  // Employee Certifications
  app.get("/api/hr/training/employee-certifications/:employeeId", isAuthenticated, async (req, res) => {
    try {
      const empCerts = await storage.getEmployeeCertifications(req.params.employeeId);
      res.json(empCerts);
    } catch (error) {
      console.error("Error fetching employee certifications:", error);
      res.status(500).json({ message: "Failed to fetch employee certifications" });
    }
  });

  app.post("/api/hr/training/employee-certifications", isAuthenticated, async (req: any, res) => {
    try {
      const empCert = await storage.createEmployeeCertification(req.body);
      await logActivity(req, "create", "employee_certification", empCert.id, "Created employee certification");
      res.status(201).json(empCert);
    } catch (error) {
      console.error("Error creating employee certification:", error);
      res.status(500).json({ message: "Failed to create employee certification" });
    }
  });

  app.delete("/api/hr/training/employee-certifications/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteEmployeeCertification(req.params.id);
      await logActivity(req, "delete", "employee_certification", req.params.id, "Deleted employee certification");
      res.json({ message: "Employee certification deleted" });
    } catch (error) {
      console.error("Error deleting employee certification:", error);
      res.status(500).json({ message: "Failed to delete employee certification" });
    }
  });

  // ============== BENEFITS MODULE ==============

  // Benefit Plans
  app.get("/api/hr/benefits/plans", isAuthenticated, async (req, res) => {
    try {
      const plans = await storage.getBenefitPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching benefit plans:", error);
      res.status(500).json({ message: "Failed to fetch benefit plans" });
    }
  });

  app.get("/api/hr/benefits/plans/:id", isAuthenticated, async (req, res) => {
    try {
      const plan = await storage.getBenefitPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ message: "Benefit plan not found" });
      }
      res.json(plan);
    } catch (error) {
      console.error("Error fetching benefit plan:", error);
      res.status(500).json({ message: "Failed to fetch benefit plan" });
    }
  });

  app.post("/api/hr/benefits/plans", isAuthenticated, async (req: any, res) => {
    try {
      const plan = await storage.createBenefitPlan(req.body);
      await logActivity(req, "create", "benefit_plan", plan.id, "Created benefit plan");
      res.status(201).json(plan);
    } catch (error) {
      console.error("Error creating benefit plan:", error);
      res.status(500).json({ message: "Failed to create benefit plan" });
    }
  });

  app.patch("/api/hr/benefits/plans/:id", isAuthenticated, async (req: any, res) => {
    try {
      const plan = await storage.updateBenefitPlan(req.params.id, req.body);
      await logActivity(req, "update", "benefit_plan", req.params.id, "Updated benefit plan");
      res.json(plan);
    } catch (error) {
      console.error("Error updating benefit plan:", error);
      res.status(500).json({ message: "Failed to update benefit plan" });
    }
  });

  app.delete("/api/hr/benefits/plans/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteBenefitPlan(req.params.id);
      await logActivity(req, "delete", "benefit_plan", req.params.id, "Deleted benefit plan");
      res.json({ message: "Benefit plan deleted" });
    } catch (error) {
      console.error("Error deleting benefit plan:", error);
      res.status(500).json({ message: "Failed to delete benefit plan" });
    }
  });

  // Benefit Enrollments
  app.get("/api/hr/benefits/enrollments", isAuthenticated, async (req, res) => {
    try {
      const { employeeId } = req.query;
      const enrollments = await storage.getEmployeeBenefitEnrollments(employeeId as string);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching benefit enrollments:", error);
      res.status(500).json({ message: "Failed to fetch benefit enrollments" });
    }
  });

  app.post("/api/hr/benefits/enrollments", isAuthenticated, async (req: any, res) => {
    try {
      const enrollment = await storage.createEmployeeBenefitEnrollment(req.body);
      await logActivity(req, "create", "benefit_enrollment", enrollment.id, "Created benefit enrollment");
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error creating benefit enrollment:", error);
      res.status(500).json({ message: "Failed to create benefit enrollment" });
    }
  });

  app.patch("/api/hr/benefits/enrollments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const enrollment = await storage.updateEmployeeBenefitEnrollment(req.params.id, req.body);
      await logActivity(req, "update", "benefit_enrollment", req.params.id, "Updated benefit enrollment");
      res.json(enrollment);
    } catch (error) {
      console.error("Error updating benefit enrollment:", error);
      res.status(500).json({ message: "Failed to update benefit enrollment" });
    }
  });

  app.delete("/api/hr/benefits/enrollments/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteEmployeeBenefitEnrollment(req.params.id);
      await logActivity(req, "delete", "benefit_enrollment", req.params.id, "Deleted benefit enrollment");
      res.json({ message: "Benefit enrollment deleted" });
    } catch (error) {
      console.error("Error deleting benefit enrollment:", error);
      res.status(500).json({ message: "Failed to delete benefit enrollment" });
    }
  });

  // Benefit Dependents
  app.post("/api/hr/benefits/dependents", isAuthenticated, async (req: any, res) => {
    try {
      const dependent = await storage.createBenefitDependent(req.body);
      await logActivity(req, "create", "benefit_dependent", dependent.id, "Created benefit dependent");
      res.status(201).json(dependent);
    } catch (error) {
      console.error("Error creating benefit dependent:", error);
      res.status(500).json({ message: "Failed to create benefit dependent" });
    }
  });

  app.delete("/api/hr/benefits/dependents/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteBenefitDependent(req.params.id);
      await logActivity(req, "delete", "benefit_dependent", req.params.id, "Deleted benefit dependent");
      res.json({ message: "Benefit dependent deleted" });
    } catch (error) {
      console.error("Error deleting benefit dependent:", error);
      res.status(500).json({ message: "Failed to delete benefit dependent" });
    }
  });

  // ============== ADMIN DASHBOARD ==============

  app.get("/api/admin/dashboard-stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getAdminDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch admin dashboard stats" });
    }
  });

  // ============== HR ANALYTICS ==============

  app.get("/api/hr/analytics", isAuthenticated, async (req, res) => {
    try {
      const analytics = await storage.getHRAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching HR analytics:", error);
      res.status(500).json({ message: "Failed to fetch HR analytics" });
    }
  });

  app.post("/api/admin/correct-repaid-amounts", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const corrections: [string, number][] = [
        ['1021100126', 8070], ['1021100128', 5920], ['1021100132', 7400], ['1021100135', 13285],
        ['1021100136', 32433], ['1021100137', 23740], ['1021100139', 31539], ['1021100141', 9680],
        ['1021100142', 9840], ['1021100143', 9680], ['1021100144', 8850], ['1021100145', 4835],
        ['1021100148', 3580], ['1021100150', 15480], ['1021100151', 9680], ['1021100152', 9673],
        ['1021100155', 13920], ['1021100156', 9840], ['1021100158', 10830], ['1021100159', 3910],
        ['1021100161', 4360], ['1021100162', 69600], ['1021100168', 12240], ['1021100171', 38680],
        ['1021100172', 10750], ['1021100174', 16590], ['1021100176', 7500], ['1021100179', 38663],
        ['1021100181', 6960], ['1021100185', 19335], ['1021100187', 5420], ['1021100188', 7735],
        ['1021100192', 3590], ['1031100001', 6050], ['1031100002', 12600], ['1031100005', 11600],
        ['1031100009', 6766], ['1031100012', 5800], ['1031100014', 11266], ['1031100015', 11600],
        ['1031100017', 6630], ['1031100019', 7000], ['1031100021', 11600], ['1031100022', 6765],
        ['1031100023', 7733],
      ];

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        let updated = 0;
        let skipped = 0;
        const results: { applicationId: string; status: string; newTotal?: number }[] = [];

        for (const [appId, correctedTotal] of corrections) {
          const loanRes = await client.query('SELECT id FROM loans WHERE application_id = $1', [appId]);
          if (loanRes.rows.length === 0) {
            skipped++;
            results.push({ applicationId: appId, status: 'not_found' });
            continue;
          }
          const loanId = loanRes.rows[0].id;

          const inst8Check = await client.query(
            'SELECT id FROM installments WHERE loan_id = $1 AND installment_number = 8',
            [loanId]
          );
          if (inst8Check.rows.length === 0) {
            skipped++;
            results.push({ applicationId: appId, status: 'no_installment_8' });
            continue;
          }

          const sumRes = await client.query(
            `SELECT COALESCE(SUM(CAST(total_amount AS numeric)), 0) as sum_1_to_7
             FROM installments WHERE loan_id = $1 AND installment_number < 8 AND is_paid = true`,
            [loanId]
          );
          const sum1to7 = parseFloat(sumRes.rows[0].sum_1_to_7);
          const newInst8Amount = correctedTotal - sum1to7;

          await client.query(
            'UPDATE installments SET total_amount = $1 WHERE loan_id = $2 AND installment_number = 8',
            [String(newInst8Amount), loanId]
          );
          updated++;
          results.push({ applicationId: appId, status: 'updated', newTotal: correctedTotal });
        }

        await client.query('COMMIT');
        res.json({
          message: `Repaid amounts corrected successfully`,
          updated,
          skipped,
          total: corrections.length,
          details: results,
        });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (error: any) {
      console.error("Error correcting repaid amounts:", error);
      res.status(500).json({ message: "Failed to correct repaid amounts", error: error.message });
    }
  });

  // Update loan fields and regenerate installments (data cleanup)
  app.post("/api/loans/:loanId/update-and-regenerate", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const { loanId } = req.params;
      const { requestAmount, principleAmount, marginRate, gracePeriod, financingDurationMonths, numberOfInstallments, disbursementDate } = req.body;

      const loan = await storage.getLoan(loanId);
      if (!loan) return res.status(404).json({ message: "Loan not found" });

      const parsedPrincipal = parseFloat(principleAmount);
      const parsedMarginRate = parseFloat(marginRate);
      const parsedGracePeriod = parseInt(gracePeriod);
      const parsedRequestAmount = parseFloat(requestAmount);
      const parsedDurationMonths = parseInt(financingDurationMonths);
      const parsedNumInstallments = parseInt(numberOfInstallments);

      const updatedPrincipal = !isNaN(parsedPrincipal) && parsedPrincipal >= 0 ? parsedPrincipal : parseFloat(loan.principleAmount || "0");
      const updatedMarginRate = !isNaN(parsedMarginRate) && parsedMarginRate >= 0 ? parsedMarginRate : parseFloat(loan.marginRate || "0");
      const updatedGracePeriod = !isNaN(parsedGracePeriod) && parsedGracePeriod >= 0 ? parsedGracePeriod : (loan.gracePeriod || 0);
      const updatedRequestAmount = !isNaN(parsedRequestAmount) && parsedRequestAmount >= 0 ? parsedRequestAmount : parseFloat(loan.requestAmount || "0");
      const durationMonths = !isNaN(parsedDurationMonths) && parsedDurationMonths > 0 ? parsedDurationMonths : (loan.financingDurationMonths || 12);
      const numInstallments = !isNaN(parsedNumInstallments) && parsedNumInstallments > 0 ? parsedNumInstallments : durationMonths;

      const rate = updatedMarginRate > 1 ? updatedMarginRate / 100 : updatedMarginRate;

      const cutoffDate = new Date("2026-01-17");
      const disbursement = await storage.getDisbursementByLoan(loanId);
      let effectiveDisbDate: Date | null = null;
      if (disbursementDate) {
        effectiveDisbDate = new Date(disbursementDate);
      } else if (disbursement?.disbursementDate) {
        effectiveDisbDate = new Date(disbursement.disbursementDate);
      }
      const useNewFormula = effectiveDisbDate ? effectiveDisbDate >= cutoffDate : true;

      const profitTotal = updatedPrincipal * rate;
      const grandTotal = updatedPrincipal + profitTotal;

      await storage.updateLoan(loanId, {
        requestAmount: updatedRequestAmount.toFixed(2),
        principleAmount: updatedPrincipal.toFixed(2),
        marginRate: updatedMarginRate.toString(),
        gracePeriod: updatedGracePeriod,
        financingDurationMonths: durationMonths,
        numberOfInstallments: numInstallments,
        profit: profitTotal.toFixed(2),
        totalReceivable: grandTotal.toFixed(2),
      });

      const deletedCount = await storage.deleteInstallmentsBeyond(loanId, 0);

      const principalInstallments = durationMonths - updatedGracePeriod;
      const principalPerInst = principalInstallments > 0 ? updatedPrincipal / principalInstallments : 0;

      let marginPerInst: number;
      let marginPayingInstCount: number;
      if (useNewFormula) {
        marginPayingInstCount = numInstallments;
        marginPerInst = marginPayingInstCount > 0 ? profitTotal / marginPayingInstCount : 0;
      } else {
        marginPayingInstCount = numInstallments - updatedGracePeriod;
        marginPerInst = marginPayingInstCount > 0 ? profitTotal / marginPayingInstCount : 0;
      }

      const roundedPrincipalPerInst = Math.round(principalPerInst * 100) / 100;
      const roundedMarginPerInst = Math.round(marginPerInst * 100) / 100;
      const principalRemainder = Math.round((updatedPrincipal - (roundedPrincipalPerInst * principalInstallments)) * 100) / 100;
      const marginRemainder = Math.round((profitTotal - (roundedMarginPerInst * marginPayingInstCount)) * 100) / 100;

      let created = 0;

      for (let i = 1; i <= numInstallments; i++) {
        const isGrace = i <= updatedGracePeriod;
        const isFirstPrincipal = updatedGracePeriod > 0 ? (i === updatedGracePeriod + 1) : (i === 1);

        let instPrincipal: number, instMargin: number, instTotal: number;
        if (isGrace && !useNewFormula) {
          instPrincipal = 0;
          instMargin = 0;
          instTotal = 0;
        } else if (isGrace && useNewFormula) {
          instPrincipal = 0;
          instMargin = (i === 1) ? roundedMarginPerInst + marginRemainder : roundedMarginPerInst;
          instTotal = instMargin;
        } else if (isFirstPrincipal) {
          instPrincipal = roundedPrincipalPerInst + principalRemainder;
          if (useNewFormula) {
            instMargin = roundedMarginPerInst;
          } else {
            instMargin = roundedMarginPerInst + marginRemainder;
          }
          instTotal = instPrincipal + instMargin;
        } else {
          instPrincipal = roundedPrincipalPerInst;
          instMargin = roundedMarginPerInst;
          instTotal = instPrincipal + instMargin;
        }

        let dueDate: string | null = null;
        if (effectiveDisbDate) {
          const disbDay = effectiveDisbDate.getDate();
          let baseDate: Date;
          if (disbDay >= 25) {
            baseDate = new Date(effectiveDisbDate.getFullYear(), effectiveDisbDate.getMonth() + 2, 1);
          } else {
            baseDate = new Date(effectiveDisbDate.getFullYear(), effectiveDisbDate.getMonth() + 1, disbDay);
          }
          const instDate = new Date(baseDate);
          instDate.setMonth(instDate.getMonth() + (i - 1));
          dueDate = instDate.toISOString().split("T")[0];
        } else if (disbursement?.firstInstallmentDate) {
          const firstDate = new Date(disbursement.firstInstallmentDate);
          firstDate.setMonth(firstDate.getMonth() + (i - 1));
          dueDate = firstDate.toISOString().split("T")[0];
        }

        await storage.createInstallment({
          loanId,
          installmentNumber: i,
          dueDate,
          principleAmount: instPrincipal.toFixed(2),
          marginAmount: instMargin.toFixed(2),
          totalAmount: instTotal.toFixed(2),
          paidAmount: "0",
          installmentVariance: null,
          paymentDate: null,
          lateDays: null,
          isPaid: false,
        });
        created++;
      }

      const formulaUsed = useNewFormula ? "new (margin spread across installments)" : "old (margin = principal * rate / duration)";

      await storage.createActivityLog({
        userId: req.user?.id || "system",
        action: "loan_data_cleanup",
        entityType: "loan",
        entityId: loanId,
        details: `Updated loan fields, deleted ${deletedCount} old installments, regenerated ${created} installments using ${formulaUsed} formula`,
        ipAddress: req.ip || "",
      });

      res.json({
        message: `Deleted ${deletedCount} old installments and regenerated ${created} new installments using ${formulaUsed} formula.`,
        created,
        deleted: deletedCount,
        formulaUsed,
      });
    } catch (error: any) {
      console.error("Error in update-and-regenerate:", error);
      res.status(500).json({ message: "Failed to update loan", error: error.message });
    }
  });

  // Update installment payment (paid amount, payment date, PAR calc)
  app.patch("/api/installments/:id/payment", isAuthenticated, requireRole("manager", "admin"), async (req: any, res) => {
    try {
      const { id } = req.params;
      const { paidAmount, paymentDate, isPaid } = req.body;

      const installment = await storage.getInstallmentById(id);
      if (!installment) return res.status(404).json({ message: "Installment not found" });

      const totalDue = parseFloat(installment.totalAmount || "0");
      const paid = parseFloat(paidAmount || "0");
      const variance = paid - totalDue;

      let lateDays: number | null = null;
      if (paymentDate && installment.dueDate) {
        const payDate = new Date(paymentDate);
        const dueDate = new Date(installment.dueDate);
        const diffTime = payDate.getTime() - dueDate.getTime();
        lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (lateDays < 0) lateDays = 0;
      }

      await storage.updateInstallmentAmounts(id, {
        principleAmount: installment.principleAmount || "0",
        marginAmount: installment.marginAmount || "0",
        totalAmount: installment.totalAmount || "0",
        paidAmount: paid.toFixed(2),
        paymentDate: paymentDate || null,
        isPaid: isPaid !== undefined ? isPaid : true,
      });

      if (lateDays !== null) {
        await pool.query(
          `UPDATE installments SET late_days = $1, installment_variance = $2 WHERE id = $3`,
          [lateDays, variance.toFixed(2), id]
        );
      } else {
        await pool.query(
          `UPDATE installments SET installment_variance = $1 WHERE id = $2`,
          [variance.toFixed(2), id]
        );
      }

      res.json({
        message: "Payment updated successfully",
        variance: variance.toFixed(2),
        lateDays,
        isPaid: isPaid !== undefined ? isPaid : true,
      });
    } catch (error: any) {
      console.error("Error updating installment payment:", error);
      res.status(500).json({ message: "Failed to update payment", error: error.message });
    }
  });

  // Citizen Balance Statement Report
  app.get("/api/reports/citizen-balance-statement/:customerId", isAuthenticated, async (req, res) => {
    try {
      const { customerId } = req.params;
      const customer = await storage.getCustomer(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      const allLoans = await storage.getLoansByCustomer(customerId);
      const customerBusiness = await storage.getCustomerBusinessByCustomerId(customerId);
      const loanStatements = [];

      for (const loan of allLoans) {
        const branch = loan.branchId ? await storage.getBranch(loan.branchId) : null;
        const officer = loan.financeOfficerId ? await storage.getFinanceOfficer(loan.financeOfficerId) : null;
        const disbursement = await storage.getDisbursementByLoan(loan.id);
        const installmentsList = await storage.getInstallmentsByLoan(loan.id);

        let branchManager = "";
        if (branch) {
          const branchOfficers = await storage.getFinanceOfficersByBranch(branch.id);
          if (branchOfficers.length > 0) {
            branchManager = branchOfficers[0]?.name || "";
          }
        }

        const schedule = installmentsList.map((inst: any, idx: number) => ({
          no: inst.installmentNumber || (idx + 1),
          installmentDate: inst.dueDate,
          principleAmount: parseFloat(inst.principleAmount || "0"),
          marginAmount: parseFloat(inst.marginAmount || "0"),
          totalAmount: parseFloat(inst.totalAmount || "0"),
        }));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const actualPayments = installmentsList.map((inst: any, idx: number) => {
          const dueDate = inst.dueDate ? new Date(inst.dueDate) : null;
          const paymentDate = inst.paymentDate ? new Date(inst.paymentDate) : null;
          const paidAmount = parseFloat(inst.paidAmount || "0");
          const totalAmount = parseFloat(inst.totalAmount || "0");
          const principleAmt = parseFloat(inst.principleAmount || "0");
          const marginAmt = parseFloat(inst.marginAmount || "0");

          const hasPaid = paidAmount > 0 || (inst.isPaid && paymentDate);
          const effectivePaidAmount = paidAmount > 0 ? paidAmount : (hasPaid ? totalAmount : 0);

          let parDays = 0;
          if (hasPaid && dueDate) {
            dueDate.setHours(0, 0, 0, 0);
            if (paymentDate) {
              paymentDate.setHours(0, 0, 0, 0);
              if (paymentDate > dueDate) {
                parDays = Math.floor((paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
              }
            } else if (dueDate < today) {
              parDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
            }
          }

          const paymentRatio = totalAmount > 0 ? Math.min(effectivePaidAmount, totalAmount) / totalAmount : 0;

          return {
            no: inst.installmentNumber || (idx + 1),
            paymentDate: hasPaid ? (inst.paymentDate || null) : null,
            principleAmount: hasPaid ? principleAmt * paymentRatio : 0,
            marginAmount: hasPaid ? marginAmt * paymentRatio : 0,
            totalAmount: effectivePaidAmount,
            isPaid: inst.isPaid,
            arears: parDays,
          };
        });

        const scheduleTotalPrinciple = schedule.reduce((s: number, r: any) => s + r.principleAmount, 0);
        const scheduleTotalMargin = schedule.reduce((s: number, r: any) => s + r.marginAmount, 0);
        const scheduleTotalAmount = schedule.reduce((s: number, r: any) => s + r.totalAmount, 0);

        const actualTotalPrinciple = actualPayments.reduce((s: number, r: any) => s + r.principleAmount, 0);
        const actualTotalMargin = actualPayments.reduce((s: number, r: any) => s + r.marginAmount, 0);
        const actualTotalAmount = actualPayments.reduce((s: number, r: any) => s + r.totalAmount, 0);
        const totalArears = actualPayments.reduce((max: number, r: any) => Math.max(max, r.arears), 0);

        loanStatements.push({
          loan: {
            id: loan.id,
            applicationId: loan.applicationId,
            productName: loan.productName || "Murabeha",
            financingCycle: loan.financingCycle || 1,
            financingAmount: parseFloat(loan.principleAmount as string || loan.requestAmount as string || "0") + (parseFloat(loan.principleAmount as string || loan.requestAmount as string || "0") * parseFloat(loan.marginRate as string || "0")),
            marginRate: parseFloat(loan.marginRate as string || "0"),
            status: loan.status,
            principleAmount: parseFloat(loan.principleAmount as string || "0"),
            profit: parseFloat(loan.profit as string || "0"),
            totalReceivable: parseFloat(loan.totalReceivable as string || "0"),
            requestAmount: parseFloat(loan.requestAmount as string || "0"),
            numberOfInstallments: loan.numberOfInstallments || 12,
            financingDurationMonths: loan.financingDurationMonths || 12,
            gracePeriod: loan.gracePeriod || 0,
          },
          branch: branch ? { name: branch.name, shortName: branch.shortName } : null,
          officer: officer ? { name: officer.name } : null,
          branchManager,
          disbursement: disbursement ? {
            disbursementDate: disbursement.disbursementDate,
            firstInstallmentDate: disbursement.firstInstallmentDate,
            maturityDate: disbursement.maturityDate,
          } : null,
          province: customerBusiness?.province || customer.district || "",
          district: customerBusiness?.district || customer.district || "",
          schedule,
          actualPayments,
          scheduleTotals: {
            principleAmount: scheduleTotalPrinciple,
            marginAmount: scheduleTotalMargin,
            totalAmount: scheduleTotalAmount,
          },
          actualTotals: {
            principleAmount: actualTotalPrinciple,
            marginAmount: actualTotalMargin,
            totalAmount: actualTotalAmount,
            arears: totalArears,
          },
          outstanding: {
            principleAmount: scheduleTotalPrinciple - actualTotalPrinciple,
            marginAmount: scheduleTotalMargin - actualTotalMargin,
            totalAmount: scheduleTotalAmount - actualTotalAmount,
          },
        });
      }

      res.json({
        customer: {
          id: customer.id,
          customerNo: customer.customerNo,
          name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
          fatherName: customer.fatherName || "",
        },
        loanStatements,
      });
    } catch (error: any) {
      console.error("Error fetching citizen balance statement:", error);
      res.status(500).json({ message: "Failed to fetch balance statement", error: error.message });
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
