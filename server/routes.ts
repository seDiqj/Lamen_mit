import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { customers, loans, disbursements, branches, financeOfficers, installments, fundingSources as fundingSourcesTable, collaterals, customerBusinesses, businessLicenses, loanApprovals, guarantors, userRoles, fadReviews, riskComplianceReviews, accounts, journalEntries, journalLines, clientOccupations, productCycleLimits, loanTransfers, collectionRecords, paymentTransactions, activityLogs, classes, insertClassSchema, getMainAccountType } from "@shared/schema";
import { users, trustedDevices } from "@shared/models/auth";
import { validatePassword, PASSWORD_EXPIRY_DAYS } from "@shared/password";
import {
  generateSecret,
  buildOtpAuthUrl,
  buildQrDataUrl,
  encryptSecret,
  verifyTotp,
  generateBackupCodes,
  hashBackupCode,
  generateTrustToken,
  hashTrustToken,
  TRUST_DEVICE_DAYS,
  TRUST_COOKIE_NAME,
} from "./mfa";
import { eq, and, or, inArray, sql, gte, lte, gt, asc, desc } from "drizzle-orm";
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
    pendingMfaUserId?: string;
    pendingMfaSecret?: string;
    passwordChangeRequired?: boolean;
  }
}

const PASSWORD_CHANGE_ALLOWED_PATHS = new Set([
  "/api/auth/user",
  "/api/auth/logout",
  "/api/user/change-password",
  "/api/user/role",
]);

function isPasswordExpired(passwordChangedAt: Date | null | undefined): boolean {
  if (!passwordChangedAt) return true;
  const ageMs = Date.now() - new Date(passwordChangedAt).getTime();
  return ageMs > PASSWORD_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
}

// In-memory replay guard: maps `${userId}:${code}` -> expiry epoch ms.
// Tokens are valid for at most ~90s with window=1, so we hold entries for 120s.
const usedTotpCodes = new Map<string, number>();
function markTotpUsed(userId: string, code: string) {
  const key = `${userId}:${code}`;
  usedTotpCodes.set(key, Date.now() + 120_000);
  if (usedTotpCodes.size > 10_000) {
    const now = Date.now();
    for (const [k, exp] of usedTotpCodes) if (exp < now) usedTotpCodes.delete(k);
  }
}
function isTotpReplayed(userId: string, code: string): boolean {
  const key = `${userId}:${code}`;
  const exp = usedTotpCodes.get(key);
  if (!exp) return false;
  if (exp < Date.now()) { usedTotpCodes.delete(key); return false; }
  return true;
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
      rolling: true, // reset the cookie expiry on every request (idle timeout)
      saveUninitialized: false,
      proxy: true,
      cookie: {
        maxAge: 15 * 60 * 1000, // 15 minutes of inactivity
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
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.session.passwordChangeRequired && !PASSWORD_CHANGE_ALLOWED_PATHS.has(req.path)) {
      return res.status(403).json({ message: "Password change required", passwordChangeRequired: true });
    }
    return next();
  };

  // Helper: finalize a successful login by setting userId and flagging password change if needed.
  const finalizeLogin = (req: Request, user: { id: string; mustChangePassword?: boolean | null; passwordChangedAt?: Date | null }) => {
    req.session.userId = user.id;
    delete req.session.pendingMfaUserId;
    delete req.session.pendingMfaSecret;
    const mustChange = !!user.mustChangePassword || isPasswordExpired(user.passwordChangedAt);
    if (mustChange) {
      req.session.passwordChangeRequired = true;
    } else {
      delete req.session.passwordChangeRequired;
    }
    return mustChange;
  };

  // Helper: check trusted device cookie for a given user.
  const hasValidTrustedDevice = async (req: Request, userId: string): Promise<boolean> => {
    const raw = (req as any).cookies?.[TRUST_COOKIE_NAME] || req.headers.cookie?.match(new RegExp(`${TRUST_COOKIE_NAME}=([^;]+)`))?.[1];
    if (!raw) return false;
    try {
      const parts = String(raw).split(".");
      if (parts.length !== 2 || parts[0] !== userId) return false;
      const tokenHash = hashTrustToken(parts[1]);
      const [row] = await db
        .select()
        .from(trustedDevices)
        .where(and(eq(trustedDevices.userId, userId), eq(trustedDevices.tokenHash, tokenHash)));
      if (!row) return false;
      if (new Date(row.expiresAt).getTime() < Date.now()) return false;
      return true;
    } catch {
      return false;
    }
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

      if (user.isActive === false) {
        return res.status(403).json({ message: "Your account has been deactivated. Please contact an administrator." });
      }

      // MFA gate (mandatory for all users)
      if (user.mfaEnabled) {
        // Trusted device shortcut
        if (await hasValidTrustedDevice(req, user.id)) {
          const mustChange = finalizeLogin(req, user);
          return res.json({
            id: user.id, username: user.username, firstName: user.firstName,
            lastName: user.lastName, email: user.email,
            passwordChangeRequired: mustChange,
          });
        }
        // Otherwise require code
        req.session.pendingMfaUserId = user.id;
        delete req.session.userId;
        delete req.session.pendingMfaSecret;
        return res.json({ mfaRequired: true, setupNeeded: false, username: user.username });
      }

      // MFA not yet set up — force enrollment
      req.session.pendingMfaUserId = user.id;
      delete req.session.userId;
      delete req.session.pendingMfaSecret;
      return res.json({ mfaRequired: true, setupNeeded: true, username: user.username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // ===== MFA endpoints =====

  // Begin enrollment: returns QR + secret (secret kept pending in session until verified)
  app.post("/api/mfa/setup", async (req, res) => {
    try {
      const uid = req.session.userId || req.session.pendingMfaUserId;
      if (!uid) return res.status(401).json({ message: "Unauthorized" });
      const user = await storage.getUserById(uid);
      if (!user) return res.status(401).json({ message: "User not found" });

      const secret = generateSecret();
      req.session.pendingMfaSecret = secret;
      const label = user.email || user.username;
      const otpUrl = buildOtpAuthUrl(secret, label);
      const qrCode = await buildQrDataUrl(otpUrl);
      res.json({ qrCode, secret, otpUrl });
    } catch (error) {
      console.error("MFA setup error:", error);
      res.status(500).json({ message: "Failed to start MFA setup" });
    }
  });

  // Confirm enrollment with first code
  app.post("/api/mfa/verify-setup", async (req, res) => {
    try {
      const uid = req.session.userId || req.session.pendingMfaUserId;
      const pendingSecret = req.session.pendingMfaSecret;
      const { code } = req.body || {};
      if (!uid || !pendingSecret) return res.status(400).json({ message: "No pending MFA setup" });
      if (!code) return res.status(400).json({ message: "Code is required" });

      const encrypted = encryptSecret(pendingSecret);
      if (!verifyTotp(String(code), encrypted)) {
        return res.status(401).json({ message: "Invalid code. Please try again." });
      }

      const backupCodes = generateBackupCodes(10);
      const hashed = backupCodes.map(hashBackupCode);

      await db.update(users).set({
        mfaEnabled: true,
        mfaSecret: encrypted,
        mfaBackupCodes: hashed,
        mfaEnrolledAt: new Date(),
      }).where(eq(users.id, uid));

      delete req.session.pendingMfaSecret;
      const userForLogin = await storage.getUserById(uid);
      if (userForLogin) {
        finalizeLogin(req, userForLogin);
      } else {
        req.session.userId = uid;
        delete req.session.pendingMfaUserId;
      }

      await storage.createActivityLog({
        userId: uid, action: "MFA_ENABLED", entityType: "user", entityId: uid,
        details: "Two-factor authentication enabled",
        ipAddress: req.ip || req.socket?.remoteAddress,
      });

      res.json({ success: true, backupCodes });
    } catch (error) {
      console.error("MFA verify-setup error:", error);
      res.status(500).json({ message: "Failed to enable MFA" });
    }
  });

  // Login-time MFA challenge
  app.post("/api/mfa/verify", async (req, res) => {
    try {
      const uid = req.session.pendingMfaUserId;
      if (!uid) return res.status(401).json({ message: "No pending login" });
      const { code, backupCode, trustDevice } = req.body || {};

      const user = await storage.getUserById(uid);
      if (!user || !user.mfaEnabled || !user.mfaSecret) {
        return res.status(400).json({ message: "MFA is not enabled for this account" });
      }

      let ok = false;
      let usedBackupIndex = -1;
      if (code) {
        const normalized = String(code).replace(/\s/g, "");
        if (isTotpReplayed(uid, normalized)) {
          return res.status(401).json({ message: "Code already used. Wait for the next code." });
        }
        ok = verifyTotp(normalized, user.mfaSecret);
        if (ok) markTotpUsed(uid, normalized);
      } else if (backupCode) {
        const h = hashBackupCode(String(backupCode));
        const codes = user.mfaBackupCodes || [];
        usedBackupIndex = codes.indexOf(h);
        ok = usedBackupIndex >= 0;
      } else {
        return res.status(400).json({ message: "Code is required" });
      }

      if (!ok) return res.status(401).json({ message: "Invalid code" });

      // Burn the backup code
      if (usedBackupIndex >= 0) {
        const codes = (user.mfaBackupCodes || []).filter((_, i) => i !== usedBackupIndex);
        await db.update(users).set({ mfaBackupCodes: codes }).where(eq(users.id, uid));
      }

      finalizeLogin(req, user);

      // Trust this device for 7 days
      if (trustDevice) {
        const token = generateTrustToken();
        const tokenHash = hashTrustToken(token);
        const expiresAt = new Date(Date.now() + TRUST_DEVICE_DAYS * 24 * 60 * 60 * 1000);
        await db.insert(trustedDevices).values({
          userId: uid,
          tokenHash,
          userAgent: req.headers["user-agent"]?.slice(0, 500) || null,
          ipAddress: req.ip || req.socket?.remoteAddress || null,
          expiresAt,
        });
        res.cookie(TRUST_COOKIE_NAME, `${uid}.${token}`, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: TRUST_DEVICE_DAYS * 24 * 60 * 60 * 1000,
          path: "/",
        });
      }

      await storage.createActivityLog({
        userId: uid, action: "MFA_VERIFIED", entityType: "user", entityId: uid,
        details: usedBackupIndex >= 0 ? "Logged in with backup code" : "Logged in with TOTP",
        ipAddress: req.ip || req.socket?.remoteAddress,
      });

      res.json({
        id: user.id, username: user.username, firstName: user.firstName,
        lastName: user.lastName, email: user.email,
      });
    } catch (error) {
      console.error("MFA verify error:", error);
      res.status(500).json({ message: "MFA verification failed" });
    }
  });

  // Cancel a pending MFA flow (back to login)
  app.post("/api/mfa/cancel", (req, res) => {
    delete req.session.pendingMfaUserId;
    delete req.session.pendingMfaSecret;
    res.json({ ok: true });
  });

  // Status (used by frontend to know which screen to show)
  app.get("/api/mfa/status", async (req, res) => {
    const uid = req.session.userId || req.session.pendingMfaUserId;
    if (!uid) return res.json({ authenticated: false, pendingMfa: false });
    const user = await storage.getUserById(uid);
    if (!user) return res.json({ authenticated: false, pendingMfa: false });
    res.json({
      authenticated: !!req.session.userId,
      pendingMfa: !!req.session.pendingMfaUserId,
      mfaEnabled: !!user.mfaEnabled,
      setupNeeded: !!req.session.pendingMfaUserId && !user.mfaEnabled,
      username: user.username,
      backupCodesRemaining: (user.mfaBackupCodes || []).length,
    });
  });

  // Admin: reset another user's MFA (so they can re-enroll on next login)
  app.post("/api/mfa/admin-reset/:userId", isAuthenticated, async (req, res) => {
    const actor = await storage.getUserRole(req.session.userId!);
    const actorRoleValue = actor?.role || "";
    let isAdmin = actorRoleValue === "admin";
    if (!isAdmin) {
      const lookup = await storage.getLookupRoleByValue(actorRoleValue);
      isAdmin = lookup?.roleType === "admin";
    }
    if (!isAdmin) return res.status(403).json({ message: "Admin only" });
    const targetId = req.params.userId;
    await db.update(users).set({
      mfaEnabled: false, mfaSecret: null, mfaBackupCodes: null, mfaEnrolledAt: null,
    }).where(eq(users.id, targetId));
    await db.delete(trustedDevices).where(eq(trustedDevices.userId, targetId));
    await storage.createActivityLog({
      userId: req.session.userId, action: "MFA_ADMIN_RESET", entityType: "user", entityId: targetId,
      details: "Admin reset MFA for user",
      ipAddress: req.ip || req.socket?.remoteAddress,
    });
    res.json({ ok: true });
  });

  // Self: revoke all trusted devices
  app.post("/api/mfa/revoke-trusted-devices", isAuthenticated, async (req, res) => {
    await db.delete(trustedDevices).where(eq(trustedDevices.userId, req.session.userId!));
    res.clearCookie(TRUST_COOKIE_NAME, { path: "/" });
    res.json({ ok: true });
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

      const pwCheck = validatePassword(password);
      if (!pwCheck.ok) {
        return res.status(400).json({ message: pwCheck.message });
      }

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create first user as admin (they chose this password, so no force-change needed).
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email: email || null,
        mustChangePassword: false,
        passwordChangedAt: new Date(),
      });

      await storage.setUserRole({ userId: user.id, role: "admin" });

      // MFA is mandatory: gate the new admin behind setup before granting a session.
      req.session.pendingMfaUserId = user.id;

      res.status(201).json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mfaRequired: true,
        setupNeeded: true,
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

    let financeOfficerId = null;
    let officerBranchId = null;
    try {
      const allOfficers = await storage.getFinanceOfficers();
      const matchedOfficer = allOfficers.find((o: any) => o.userId === user.id);
      if (matchedOfficer) {
        financeOfficerId = matchedOfficer.id;
        officerBranchId = matchedOfficer.branchId;
      }
    } catch (e) {}

    res.json({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: userRole?.role || null,
      branchId: officerBranchId || user.branchId || null,
      financeOfficerId: financeOfficerId || null,
      mfaEnabled: !!user.mfaEnabled,
      passwordChangeRequired: !!req.session.passwordChangeRequired,
      passwordChangedAt: user.passwordChangedAt,
      passwordExpiryDays: PASSWORD_EXPIRY_DAYS,
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
    const roleValue = userRole?.role || "user";
    if (allowedRoles.includes(roleValue)) {
      return true;
    }
    const lookupRole = await storage.getLookupRoleByValue(roleValue);
    if (lookupRole && lookupRole.roleType && allowedRoles.includes(lookupRole.roleType)) {
      return true;
    }
    return false;
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

  const requirePageAccess = (pageName: string | string[]) => {
    const allowedPages = Array.isArray(pageName) ? pageName : [pageName];
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      if (await hasRole(userId, ["admin"])) {
        return next();
      }
      
      const permissions = await storage.getPagePermissions(userId);
      const hasAccess = permissions.some(p => allowedPages.includes(p.pageName) && p.canAccess);
      if (hasAccess) return next();
      
      return res.status(403).json({ message: "Forbidden" });
    };
  };

  const getEffectiveBranchId = async (req: Request): Promise<string | null> => {
    const userId = req.session.userId;
    if (!userId) return null;
    const user = await storage.getUserById(userId);
    if (!user) return null;

    let userBranch: string | null = null;
    try {
      const allOfficers = await storage.getFinanceOfficers();
      const matchedOfficer = allOfficers.find((o: any) => o.userId === user.id);
      if (matchedOfficer?.branchId) userBranch = matchedOfficer.branchId;
    } catch (e) {}
    if (!userBranch && user.branchId) userBranch = user.branchId;

    if (userBranch) return userBranch;
    const clientBranch = req.query.branchId as string | undefined;
    return clientBranch || null;
  };

  // Get user role
  app.get("/api/user/role", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = req.session.userId!;
      const userRole = await storage.getUserRole(userId);
      
      // If no role exists, create default "user" role
      if (!userRole) {
        await storage.setUserRole({ userId, role: "admin" }); // First user gets admin
        return res.json({ role: "admin", roleType: "admin" });
      }
      
      const lookupRole = await storage.getLookupRoleByValue(userRole.role || "user");
      res.json({ role: userRole.role, roleType: lookupRole?.roleType || userRole.role, roleLabel: lookupRole?.label });
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
      
      const pwCheck = validatePassword(newPassword);
      if (!pwCheck.ok) {
        return res.status(400).json({ message: pwCheck.message });
      }
      
      const result = await storage.changeUserPassword(userId, currentPassword, newPassword);

      if (!result.ok) {
        if (result.reason === "reused") {
          return res.status(400).json({ message: "You cannot reuse one of your last 5 passwords." });
        }
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      delete req.session.passwordChangeRequired;
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
      const filters = {
        branchId: req.query.branchId as string | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
      };
      const stats = await storage.getDashboardStats(filters);
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

  app.get("/api/dashboard/funding-source-branch-stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getFundingSourceBranchStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching funding source branch stats:", error);
      res.status(500).json({ message: "Failed to fetch funding source branch stats" });
    }
  });

  app.get("/api/dashboard/alert-details/:category", isAuthenticated, async (req, res) => {
    try {
      const details = await storage.getAlertDetails(req.params.category);
      res.json(details);
    } catch (error) {
      console.error("Error fetching alert details:", error);
      res.status(500).json({ message: "Failed to fetch alert details" });
    }
  });

  app.get("/api/dashboard/daily-op-details/:type", isAuthenticated, async (req: any, res) => {
    try {
      const branchId = (typeof getEffectiveBranchId === 'function')
        ? await getEffectiveBranchId(req)
        : (req.query.branchId as string | undefined);
      const details = await storage.getDailyOpDetails(req.params.type, branchId || undefined);
      res.json(details);
    } catch (error) {
      console.error("Error fetching daily op details:", error);
      res.status(500).json({ message: "Failed to fetch daily op details" });
    }
  });

  app.get("/api/dashboard/collection-rate-details", isAuthenticated, async (req, res) => {
    try {
      const { branchId, startDate, endDate } = req.query;
      const branchFilter = branchId ? sql`AND l.branch_id = ${branchId}` : sql``;
      const dateFilter = startDate && endDate
        ? sql`AND i.due_date >= ${startDate as string}::date AND i.due_date <= ${endDate as string}::date` : sql``;
      const result = await db.execute(sql`
        SELECT 
          TO_CHAR(i.due_date, 'YYYY-MM') as month,
          TO_CHAR(i.due_date, 'Mon YYYY') as month_label,
          COALESCE(SUM(i.total_amount::numeric), 0) as due_amount,
          COALESCE(SUM(COALESCE(i.paid_amount::numeric, 0)), 0) as collected_amount
        FROM installments i
        JOIN loans l ON i.loan_id = l.id
        WHERE i.due_date IS NOT NULL 
          AND i.due_date <= CURRENT_DATE
          AND l.status IN ('disbursed', 'active', 'completed')
          ${branchFilter}
          ${dateFilter}
        GROUP BY TO_CHAR(i.due_date, 'YYYY-MM'), TO_CHAR(i.due_date, 'Mon YYYY')
        ORDER BY TO_CHAR(i.due_date, 'YYYY-MM')
      `);
      const rows = (result.rows as any[]).map(r => ({
        month: r.month_label,
        monthKey: r.month,
        dueAmount: Number(r.due_amount),
        collectedAmount: Number(r.collected_amount),
        balance: Number(r.due_amount) - Number(r.collected_amount),
      }));
      const totals = rows.reduce((acc, r) => ({
        dueAmount: acc.dueAmount + r.dueAmount,
        collectedAmount: acc.collectedAmount + r.collectedAmount,
        balance: acc.balance + r.balance,
      }), { dueAmount: 0, collectedAmount: 0, balance: 0 });
      res.json({ rows, totals });
    } catch (error) {
      console.error("Error fetching collection rate details:", error);
      res.status(500).json({ message: "Failed to fetch collection rate details" });
    }
  });

  app.get("/api/dashboard/collection-rate-month-details", isAuthenticated, async (req, res) => {
    try {
      const { month, branchId, startDate, endDate } = req.query;
      if (!month) {
        return res.status(400).json({ message: "month parameter is required (YYYY-MM)" });
      }
      const branchFilter = branchId ? sql`AND l.branch_id = ${branchId}` : sql``;
      const dateFilter = startDate && endDate
        ? sql`AND i.due_date >= ${startDate as string}::date AND i.due_date <= ${endDate as string}::date` : sql``;
      const result = await db.execute(sql`
        SELECT 
          i.id as installment_id,
          i.installment_number,
          i.due_date,
          i.total_amount,
          i.principle_amount,
          i.margin_amount,
          i.paid_amount,
          i.payment_date,
          i.is_paid,
          l.id as loan_id,
          l.application_id,
          l.product_name,
          CONCAT(c.first_name, ' ', c.last_name) as customer_name,
          c.phone_number,
          COALESCE(b.name, 'N/A') as branch_name,
          COALESCE(fo.name, 'N/A') as officer_name
        FROM installments i
        JOIN loans l ON i.loan_id = l.id
        JOIN customers c ON l.customer_id = c.id
        LEFT JOIN branches b ON l.branch_id = b.id
        LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
        WHERE TO_CHAR(i.due_date, 'YYYY-MM') = ${month}
          AND i.due_date <= CURRENT_DATE
          AND l.status IN ('disbursed', 'active', 'completed')
          ${branchFilter}
          ${dateFilter}
        ORDER BY i.due_date, l.application_id
      `);
      const items = (result.rows as any[]).map(r => {
        const dueAmount = Number(r.total_amount || 0);
        const paidAmount = Number(r.paid_amount || 0);
        return {
          installmentId: r.installment_id,
          installmentNumber: r.installment_number,
          dueDate: r.due_date,
          dueAmount,
          principalAmount: Number(r.principle_amount || 0),
          markupAmount: Number(r.margin_amount || 0),
          paidAmount,
          paymentDate: r.payment_date,
          isPaid: r.is_paid,
          balance: dueAmount - paidAmount,
          status: r.is_paid ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid',
          loanId: r.loan_id,
          applicationId: r.application_id,
          productName: r.product_name,
          customerName: r.customer_name,
          phoneNumber: r.phone_number,
          branchName: r.branch_name,
          officerName: r.officer_name,
        };
      });
      res.json({ month: month as string, items });
    } catch (error) {
      console.error("Error fetching collection month details:", error);
      res.status(500).json({ message: "Failed to fetch month details" });
    }
  });

  app.get("/api/dashboard/sector-customers/:sector", isAuthenticated, async (req, res) => {
    try {
      const sectorName = req.params.sector;
      const { branchId, startDate, endDate } = req.query;
      const branchFilter = branchId ? sql`AND l.branch_id = ${branchId}` : sql``;
      const dateFilter = startDate && endDate
        ? sql`AND l.created_at >= ${startDate as string}::date AND l.created_at <= ${endDate as string}::date + INTERVAL '1 day'` : sql``;
      const sectorFilter = sectorName === 'Other' 
        ? sql`AND (l.sector IS NULL OR l.sector = '' OR l.sector = 'Other')`
        : sql`AND l.sector = ${sectorName}`;
      const result = await db.execute(sql`
        SELECT 
          l.id,
          l.application_id,
          CONCAT(c.first_name, ' ', c.last_name) as customer_name,
          c.phone_number,
          l.principle_amount,
          l.total_receivable,
          l.status,
          l.product_name,
          COALESCE(b.name, 'N/A') as branch_name,
          COALESCE(fo.name, 'N/A') as officer_name,
          COALESCE((SELECT SUM(COALESCE(i.paid_amount::numeric, 0)) FROM installments i WHERE i.loan_id = l.id AND COALESCE(i.paid_amount::numeric, 0) > 0), 0) as total_paid
        FROM loans l
        JOIN customers c ON l.customer_id = c.id
        LEFT JOIN branches b ON l.branch_id = b.id
        LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
        WHERE l.status IN ('disbursed', 'active')
          ${sectorFilter}
          ${branchFilter}
          ${dateFilter}
        ORDER BY l.application_id
      `);
      res.json({
        sector: sectorName,
        items: (result.rows as any[]).map(r => ({
          id: r.id,
          applicationId: r.application_id,
          customerName: r.customer_name,
          phoneNumber: r.phone_number,
          principleAmount: Number(r.principle_amount || 0),
          totalReceivable: Number(r.total_receivable || 0),
          totalPaid: Number(r.total_paid || 0),
          outstanding: Math.max(Number(r.total_receivable || 0) - Number(r.total_paid || 0), 0),
          status: r.status,
          productName: r.product_name,
          branchName: r.branch_name,
          officerName: r.officer_name,
        })),
      });
    } catch (error) {
      console.error("Error fetching sector customers:", error);
      res.status(500).json({ message: "Failed to fetch sector customers" });
    }
  });

  app.get("/api/dashboard/customers-by-status", isAuthenticated, async (req, res) => {
    try {
      const { branchId, startDate, endDate } = req.query;
      const branchFilter = branchId ? sql`AND l.branch_id = ${branchId}` : sql``;
      const dateFilter = startDate && endDate
        ? sql`AND l.created_at >= ${startDate as string}::date AND l.created_at <= ${endDate as string}::date + INTERVAL '1 day'` : sql``;
      const result = await db.execute(sql`
        SELECT 
          l.status,
          COUNT(DISTINCT l.customer_id) as customer_count,
          COUNT(*) as loan_count,
          COALESCE(SUM(COALESCE(l.principle_amount, l.request_amount)::numeric), 0) as total_amount
        FROM loans l
        WHERE 1=1 ${branchFilter} ${dateFilter}
        GROUP BY l.status
        ORDER BY loan_count DESC
      `);
      res.json((result.rows as any[]).map(r => ({
        status: r.status,
        customerCount: Number(r.customer_count),
        loanCount: Number(r.loan_count),
        totalAmount: Number(r.total_amount),
      })));
    } catch (error) {
      console.error("Error fetching customers by status:", error);
      res.status(500).json({ message: "Failed to fetch customers by status" });
    }
  });

  app.get("/api/dashboard/loan-cost-analysis", isAuthenticated, async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
      const previousYear = currentYear - 1;

      const yearlyData = async (year: number) => {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const loansByProduct = await db.execute(sql`
          SELECT 
            COALESCE(l.product_name, 'Unknown') as product_name,
            COUNT(DISTINCT l.id) as loan_count,
            COALESCE(SUM(l.principle_amount::numeric), 0) as total_disbursed,
            COALESCE(SUM(l.profit::numeric), 0) as total_margin_income
          FROM loans l
          INNER JOIN disbursements d ON l.id = d.loan_id
          WHERE d.disbursement_date <= ${endDate}
            AND l.status IN ('active', 'disbursed', 'completed', 'defaulted')
            AND (l.status != 'completed' OR l.updated_at >= ${startDate}::timestamp)
          GROUP BY l.product_name
          ORDER BY loan_count DESC
        `);

        const loansByBranch = await db.execute(sql`
          SELECT 
            COALESCE(b.name, 'Unknown') as branch_name,
            COUNT(DISTINCT l.id) as loan_count,
            COALESCE(SUM(l.principle_amount::numeric), 0) as total_disbursed,
            COALESCE(SUM(l.profit::numeric), 0) as total_margin_income
          FROM loans l
          INNER JOIN disbursements d ON l.id = d.loan_id
          LEFT JOIN branches b ON l.branch_id = b.id
          WHERE d.disbursement_date <= ${endDate}
            AND l.status IN ('active', 'disbursed', 'completed', 'defaulted')
            AND (l.status != 'completed' OR l.updated_at >= ${startDate}::timestamp)
          GROUP BY b.name
          ORDER BY loan_count DESC
        `);

        const totalLoansResult = await db.execute(sql`
          SELECT COUNT(DISTINCT l.id) as count
          FROM loans l
          INNER JOIN disbursements d ON l.id = d.loan_id
          WHERE d.disbursement_date <= ${endDate}
            AND l.status IN ('active', 'disbursed', 'completed', 'defaulted')
            AND (l.status != 'completed' OR l.updated_at >= ${startDate}::timestamp)
        `);
        const totalLoans = parseInt(totalLoansResult.rows[0]?.count as string || "0");

        const totalIncomeResult = await db.execute(sql`
          SELECT COALESCE(SUM(
            CASE WHEN a.account_type IN ('operating_income','non_operating_income','other_income','income') THEN jl.credit_amount::numeric - jl.debit_amount::numeric ELSE 0 END
          ), 0) as total_income,
          COALESCE(SUM(
            CASE WHEN a.account_type IN ('operating_expense','non_operating_expense','cost_of_financing','expense') THEN jl.debit_amount::numeric - jl.credit_amount::numeric ELSE 0 END
          ), 0) as total_expenses,
          COALESCE(SUM(
            CASE WHEN a.account_type IN ('operating_expense','non_operating_expense','cost_of_financing','expense') AND a.account_code >= '60000' AND a.account_code < '70000'
            THEN jl.debit_amount::numeric - jl.credit_amount::numeric ELSE 0 END
          ), 0) as operating_expenses
          FROM journal_lines jl
          JOIN journal_entries je ON jl.journal_entry_id = je.id
          JOIN accounts a ON jl.account_id = a.id
          WHERE je.is_posted = true
            AND je.entry_date >= ${startDate} AND je.entry_date <= ${endDate}
            AND a.account_type IN ('operating_income','non_operating_income','other_income','income','operating_expense','non_operating_expense','cost_of_financing','expense')
        `);

        const totalIncome = parseFloat(totalIncomeResult.rows[0]?.total_income as string || "0");
        const totalExpenses = parseFloat(totalIncomeResult.rows[0]?.total_expenses as string || "0");
        const operatingExpenses = parseFloat(totalIncomeResult.rows[0]?.operating_expenses as string || "0");

        const marginIncomeResult = await db.execute(sql`
          SELECT COALESCE(SUM(l.profit::numeric), 0) as total_margin
          FROM loans l
          INNER JOIN disbursements d ON l.id = d.loan_id
          WHERE d.disbursement_date <= ${endDate}
            AND l.status IN ('active', 'disbursed', 'completed', 'defaulted')
            AND (l.status != 'completed' OR l.updated_at >= ${startDate}::timestamp)
        `);
        const totalMarginIncome = parseFloat(marginIncomeResult.rows[0]?.total_margin as string || "0");

        const avgCostPerLoan = totalLoans > 0 ? operatingExpenses / totalLoans : 0;
        const avgIncomePerLoan = totalLoans > 0 ? totalMarginIncome / totalLoans : 0;
        const costIncomeRatio = totalMarginIncome > 0 ? (operatingExpenses / totalMarginIncome) * 100 : 0;
        const netIncomePerLoan = avgIncomePerLoan - avgCostPerLoan;

        return {
          year,
          totalLoans,
          totalIncome,
          totalExpenses,
          operatingExpenses,
          totalMarginIncome,
          avgCostPerLoan,
          avgIncomePerLoan,
          netIncomePerLoan,
          costIncomeRatio,
          byProduct: (loansByProduct.rows as any[]).map(r => ({
            productName: r.product_name,
            loanCount: parseInt(r.loan_count),
            totalDisbursed: parseFloat(r.total_disbursed),
            totalMarginIncome: parseFloat(r.total_margin_income),
            avgCostPerLoan: parseInt(r.loan_count) > 0 ? operatingExpenses / parseInt(r.loan_count) * (parseInt(r.loan_count) / totalLoans) : 0,
            costPerLoanShare: totalLoans > 0 ? (operatingExpenses * (parseInt(r.loan_count) / totalLoans)) / parseInt(r.loan_count) : 0,
          })),
          byBranch: (loansByBranch.rows as any[]).map(r => ({
            branchName: r.branch_name,
            loanCount: parseInt(r.loan_count),
            totalDisbursed: parseFloat(r.total_disbursed),
            totalMarginIncome: parseFloat(r.total_margin_income),
            profitPerLoan: parseInt(r.loan_count) > 0 
              ? (parseFloat(r.total_margin_income) - (operatingExpenses * (parseInt(r.loan_count) / totalLoans))) / parseInt(r.loan_count)
              : 0,
            allocatedExpenses: totalLoans > 0 ? operatingExpenses * (parseInt(r.loan_count) / totalLoans) : 0,
          })),
        };
      };

      const [currentYearData, previousYearData] = await Promise.all([
        yearlyData(currentYear),
        yearlyData(previousYear),
      ]);

      const costImprovement = previousYearData.avgCostPerLoan > 0
        ? ((previousYearData.avgCostPerLoan - currentYearData.avgCostPerLoan) / previousYearData.avgCostPerLoan) * 100
        : 0;

      const ratioImprovement = previousYearData.costIncomeRatio > 0
        ? previousYearData.costIncomeRatio - currentYearData.costIncomeRatio
        : 0;

      res.json({
        currentYear: currentYearData,
        previousYear: previousYearData,
        costImprovement,
        ratioImprovement,
      });
    } catch (error) {
      console.error("Error fetching loan cost analysis:", error);
      res.status(500).json({ message: "Failed to fetch loan cost analysis" });
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

  app.get("/api/reports/officer-performance", isAuthenticated, requirePageAccess("officer-performance-report"), async (req, res) => {
    try {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const monthRe = /^\d{4}-(0[1-9]|1[0-2])$/;
      let fromMonth = (req.query.fromMonth as string) || currentMonth;
      let toMonth = (req.query.toMonth as string) || fromMonth;
      if (!monthRe.test(fromMonth)) fromMonth = currentMonth;
      if (!monthRe.test(toMonth)) toMonth = fromMonth;
      if (fromMonth > toMonth) { const tmp = fromMonth; fromMonth = toMonth; toMonth = tmp; }
      const effectiveBranch = await getEffectiveBranchId(req);
      const rows = await storage.getOfficerMonthlyPerformance(effectiveBranch, fromMonth, toMonth);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching officer performance:", error);
      res.status(500).json({ message: "Failed to fetch officer performance" });
    }
  });

  app.get("/api/disbursement-targets/:id/officer-splits", isAuthenticated, requirePageAccess("disbursement-targets"), async (req: any, res) => {
    try {
      const target = await storage.getDisbursementTarget(parseInt(req.params.id));
      if (!target) return res.status(404).json({ message: "Target not found" });
      const splits = await storage.getOfficerTargets(target.branchId, target.targetMonthYear);
      res.json(splits);
    } catch (error) {
      console.error("Error fetching officer splits:", error);
      res.status(500).json({ message: "Failed to fetch officer splits" });
    }
  });

  app.post("/api/disbursement-targets/:id/officer-splits", isAuthenticated, requirePageAccess("disbursement-targets"), async (req: any, res) => {
    try {
      const target = await storage.getDisbursementTarget(parseInt(req.params.id));
      if (!target) return res.status(404).json({ message: "Target not found" });
      const { splits } = req.body;
      const validSplits = (splits || []).filter((s: any) => s.financeOfficerId && (parseFloat(s.targetDisbursementAmount) > 0 || Number(s.targetNoOfCustomer) > 0));
      const cleanSplits = validSplits.map((s: any) => ({
        financeOfficerId: String(s.financeOfficerId),
        targetDisbursementAmount: String(Math.max(0, parseFloat(s.targetDisbursementAmount) || 0)),
        targetNoOfCustomer: Math.max(0, Math.floor(Number(s.targetNoOfCustomer) || 0)),
      }));
      await storage.saveOfficerTargets(target.branchId, target.targetMonthYear, cleanSplits);
      await logActivity(req, "split_disbursement_target", "disbursement_target", req.params.id, `Split target into ${cleanSplits.length} officer targets`);
      res.json({ message: "Officer splits saved successfully" });
    } catch (error) {
      console.error("Error saving officer splits:", error);
      res.status(500).json({ message: "Failed to save officer splits" });
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

  // ===== COLLATERAL TYPES =====
  app.get("/api/collateral-types", isAuthenticated, async (req, res) => {
    try {
      const { search } = req.query;
      const types = await storage.getCollateralTypes(search as string | undefined);
      res.json(types);
    } catch (error) {
      console.error("Error fetching collateral types:", error);
      res.status(500).json({ message: "Failed to fetch collateral types" });
    }
  });

  app.post("/api/collateral-types", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const ct = await storage.createCollateralType(req.body);
      await logActivity(req, "create_collateral_type", "collateral_type", ct.id.toString(), `Created collateral type: ${ct.name}`);
      res.status(201).json(ct);
    } catch (error) {
      console.error("Error creating collateral type:", error);
      res.status(500).json({ message: "Failed to create collateral type" });
    }
  });

  app.patch("/api/collateral-types/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const ct = await storage.updateCollateralType(parseInt(req.params.id), req.body);
      await logActivity(req, "update_collateral_type", "collateral_type", req.params.id, `Updated collateral type: ${ct.name}`);
      res.json(ct);
    } catch (error) {
      console.error("Error updating collateral type:", error);
      res.status(500).json({ message: "Failed to update collateral type" });
    }
  });

  app.delete("/api/collateral-types/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      await storage.deleteCollateralType(parseInt(req.params.id));
      await logActivity(req, "delete_collateral_type", "collateral_type", req.params.id, `Deleted collateral type`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting collateral type:", error);
      res.status(500).json({ message: "Failed to delete collateral type" });
    }
  });

  // ===== CLASSES (Accounting dimension) =====
  app.get("/api/classes", isAuthenticated, async (req, res) => {
    try {
      const activeOnly = req.query.activeOnly === "true";
      const list = await storage.getClasses(activeOnly);
      res.json(list);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  app.post("/api/classes", isAuthenticated, requirePageAccess("classes"), async (req: any, res) => {
    try {
      const parsed = insertClassSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid class data", errors: parsed.error.flatten() });
      }
      const created = await storage.createClass(parsed.data);
      await logActivity(req, "create_class", "class", created.id, `Created class: ${created.name}`);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).json({ message: "Failed to create class" });
    }
  });

  app.patch("/api/classes/:id", isAuthenticated, requirePageAccess("classes"), async (req: any, res) => {
    try {
      const parsed = insertClassSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid class data", errors: parsed.error.flatten() });
      }
      const existing = await storage.getClass(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Class not found" });
      }
      const updated = await storage.updateClass(req.params.id, parsed.data);
      await logActivity(req, "update_class", "class", req.params.id, `Updated class: ${updated.name}`);
      res.json(updated);
    } catch (error) {
      console.error("Error updating class:", error);
      res.status(500).json({ message: "Failed to update class" });
    }
  });

  app.delete("/api/classes/:id", isAuthenticated, requirePageAccess("classes"), async (req: any, res) => {
    try {
      const existing = await storage.getClass(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Class not found" });
      }
      await storage.deleteClass(req.params.id);
      await logActivity(req, "delete_class", "class", req.params.id, `Deleted class: ${existing.name}`);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting class:", error);
      if (error?.code === '23503') {
        return res.status(400).json({ message: "Cannot delete class - it is referenced by journal lines" });
      }
      res.status(500).json({ message: "Failed to delete class" });
    }
  });

  // ===== FINANCING PURPOSES =====
  app.get("/api/financing-purposes", isAuthenticated, async (req, res) => {
    try {
      const { search } = req.query;
      const purposes = await storage.getFinancingPurposes(search as string | undefined);
      res.json(purposes);
    } catch (error) {
      console.error("Error fetching financing purposes:", error);
      res.status(500).json({ message: "Failed to fetch financing purposes" });
    }
  });

  app.post("/api/financing-purposes", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const purpose = await storage.createFinancingPurpose(req.body);
      await logActivity(req, "create_financing_purpose", "financing_purpose", purpose.id.toString(), `Created financing purpose: ${purpose.name}`);
      res.status(201).json(purpose);
    } catch (error) {
      console.error("Error creating financing purpose:", error);
      res.status(500).json({ message: "Failed to create financing purpose" });
    }
  });

  app.patch("/api/financing-purposes/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const purpose = await storage.updateFinancingPurpose(parseInt(req.params.id), req.body);
      await logActivity(req, "update_financing_purpose", "financing_purpose", req.params.id, `Updated financing purpose: ${purpose.name}`);
      res.json(purpose);
    } catch (error) {
      console.error("Error updating financing purpose:", error);
      res.status(500).json({ message: "Failed to update financing purpose" });
    }
  });

  app.delete("/api/financing-purposes/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      await storage.deleteFinancingPurpose(parseInt(req.params.id));
      await logActivity(req, "delete_financing_purpose", "financing_purpose", req.params.id, `Deleted financing purpose`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting financing purpose:", error);
      res.status(500).json({ message: "Failed to delete financing purpose" });
    }
  });

  // ===== CLIENT OCCUPATIONS =====
  app.get("/api/client-occupations", isAuthenticated, async (req, res) => {
    try {
      const occupations = await db.select().from(clientOccupations).orderBy(clientOccupations.name);
      res.json(occupations);
    } catch (error) {
      console.error("Error fetching client occupations:", error);
      res.status(500).json({ message: "Failed to fetch client occupations" });
    }
  });

  app.post("/api/client-occupations", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const [occupation] = await db.insert(clientOccupations).values(req.body).returning();
      await logActivity(req, "create_client_occupation", "client_occupation", occupation.id.toString(), `Created client occupation: ${occupation.name}`);
      res.json(occupation);
    } catch (error) {
      console.error("Error creating client occupation:", error);
      res.status(500).json({ message: "Failed to create client occupation" });
    }
  });

  app.patch("/api/client-occupations/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      const [occupation] = await db.update(clientOccupations).set(req.body).where(eq(clientOccupations.id, parseInt(req.params.id))).returning();
      await logActivity(req, "update_client_occupation", "client_occupation", req.params.id, `Updated client occupation: ${occupation.name}`);
      res.json(occupation);
    } catch (error) {
      console.error("Error updating client occupation:", error);
      res.status(500).json({ message: "Failed to update client occupation" });
    }
  });

  app.delete("/api/client-occupations/:id", isAuthenticated, requirePageAccess("lookup"), async (req: any, res) => {
    try {
      await db.delete(clientOccupations).where(eq(clientOccupations.id, parseInt(req.params.id)));
      await logActivity(req, "delete_client_occupation", "client_occupation", req.params.id, `Deleted client occupation`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting client occupation:", error);
      res.status(500).json({ message: "Failed to delete client occupation" });
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

  app.post("/api/lookup-roles", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      const { value, label, description, roleType } = req.body;
      if (!value || !label) {
        return res.status(400).json({ message: "Value and label are required" });
      }
      if (roleType && !["user", "manager", "admin"].includes(roleType)) {
        return res.status(400).json({ message: "Role type must be user, manager, or admin" });
      }
      const role = await storage.createLookupRole({ value, label, description, roleType: roleType || "user" });
      res.status(201).json(role);
    } catch (error) {
      console.error("Error creating lookup role:", error);
      res.status(500).json({ message: "Failed to create lookup role" });
    }
  });

  app.patch("/api/lookup-roles/:id", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      const { value, label, description, roleType } = req.body;
      if (roleType && !["user", "manager", "admin"].includes(roleType)) {
        return res.status(400).json({ message: "Role type must be user, manager, or admin" });
      }
      const updateData: any = {};
      if (value !== undefined) updateData.value = value;
      if (label !== undefined) updateData.label = label;
      if (description !== undefined) updateData.description = description;
      if (roleType !== undefined) updateData.roleType = roleType;
      const role = await storage.updateLookupRole(parseInt(req.params.id), updateData);
      res.json(role);
    } catch (error) {
      console.error("Error updating lookup role:", error);
      res.status(500).json({ message: "Failed to update lookup role" });
    }
  });

  app.delete("/api/lookup-roles/:id", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      await storage.deleteLookupRole(parseInt(req.params.id));
      res.json({ message: "Lookup role deleted successfully" });
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
  app.get("/api/customers/next-number/:branchId", isAuthenticated, async (req, res) => {
    try {
      const branchId = req.params.branchId;
      const branch = await storage.getBranch(branchId);
      if (!branch) return res.status(404).json({ message: "Branch not found" });

      const branchCode = branch.code || branch.shortName || "000";

      const result = await pool.query(
        `SELECT customer_no FROM customers
         WHERE customer_no ~ $1
         ORDER BY customer_no DESC LIMIT 1`,
        [`^${branchCode}[0-9]{6}$`]
      );

      let nextSeq = 1;
      if (result.rows.length > 0) {
        const lastNo = result.rows[0].customer_no;
        const numericPart = lastNo.substring(branchCode.length);
        const parsed = parseInt(numericPart, 10);
        if (!isNaN(parsed)) nextSeq = parsed + 1;
      }

      const customerNo = `${branchCode}${String(nextSeq).padStart(6, "0")}`;
      res.json({ customerNo, branchCode, sequence: nextSeq });
    } catch (error) {
      console.error("Error generating customer number:", error);
      res.status(500).json({ message: "Failed to generate customer number" });
    }
  });

  app.post("/api/customers/backfill-numbers", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const allBranches = await db.select().from(branches);
      const branchMap = new Map(allBranches.map(b => [b.id, b]));

      const customersWithoutProperNo = await pool.query(`
        SELECT c.id, c.customer_no, c.created_at,
               l.branch_id
        FROM customers c
        LEFT JOIN loans l ON l.customer_id = c.id
        ORDER BY l.branch_id, c.created_at
      `);

      let updated = 0;
      let skipped = 0;
      const branchCounters: Record<string, number> = {};

      for (const branch of allBranches) {
        const code = branch.code || branch.shortName || "000";
        const maxResult = await pool.query(
          `SELECT customer_no FROM customers WHERE customer_no ~ $1 ORDER BY customer_no DESC LIMIT 1`,
          [`^${code}[0-9]{6}$`]
        );
        if (maxResult.rows.length > 0) {
          const numPart = maxResult.rows[0].customer_no.replace(code, "");
          branchCounters[branch.id] = parseInt(numPart, 10);
        } else {
          branchCounters[branch.id] = 0;
        }
      }

      for (const row of customersWithoutProperNo.rows) {
        const branchId = row.branch_id;
        if (!branchId) { skipped++; continue; }
        const branch = branchMap.get(branchId);
        if (!branch) { skipped++; continue; }
        const code = branch.code || branch.shortName || "000";
        const existingNo = row.customer_no || "";
        const expectedPattern = new RegExp(`^${code}\\d{6}$`);
        if (expectedPattern.test(existingNo)) {
          skipped++;
          continue;
        }

        branchCounters[branchId] = (branchCounters[branchId] || 0) + 1;
        const newNo = `${code}${String(branchCounters[branchId]).padStart(6, "0")}`;

        await pool.query(`UPDATE customers SET customer_no = $1 WHERE id = $2`, [newNo, row.id]);
        updated++;
      }

      res.json({ updated, skipped, total: customersWithoutProperNo.rows.length });
    } catch (error) {
      console.error("Error backfilling customer numbers:", error);
      res.status(500).json({ message: "Failed to backfill customer numbers" });
    }
  });

  app.get("/api/customers", isAuthenticated, requirePageAccess("customers"), async (req, res) => {
    try {
      const { search, page, limit } = req.query;
      const effectiveBranch = await getEffectiveBranchId(req);
      const result = await storage.getCustomers(
        search as string | undefined,
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 10,
        effectiveBranch || undefined
      );

      const customerIds = result.customers.map(c => c.id);
      let activeLoanCounts: Record<string, number> = {};
      if (customerIds.length > 0) {
        const loanCountResult = await db
          .select({
            customerId: loans.customerId,
            activeCount: sql<number>`count(*)`,
          })
          .from(loans)
          .where(
            and(
              inArray(loans.customerId, customerIds),
              inArray(loans.status, ['disbursed', 'active'])
            )
          )
          .groupBy(loans.customerId);
        for (const row of loanCountResult) {
          activeLoanCounts[row.customerId] = Number(row.activeCount) || 0;
        }
      }

      const customersWithLoans = result.customers.map(c => ({
        ...c,
        activeLoans: activeLoanCounts[c.id] || 0,
      }));

      res.json({
        customers: customersWithLoans,
        total: result.total,
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

  app.post("/api/customers", isAuthenticated, requirePageAccess("customers"), async (req: any, res) => {
    try {
      const customer = await storage.createCustomer(req.body);
      await logActivity(req, "create_customer", "customer", customer.id, `Created customer: ${customer.firstName} ${customer.lastName}`);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });

  app.patch("/api/customers/:id", isAuthenticated, requirePageAccess("customers"), async (req: any, res) => {
    try {
      const customer = await storage.updateCustomer(req.params.id, req.body);
      await logActivity(req, "update_customer", "customer", customer.id, `Updated customer: ${customer.firstName} ${customer.lastName}`);
      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  // ===== FILE UPLOADS (Object Storage) =====
  const { ObjectStorageService } = await import("./replit_integrations/object_storage/objectStorage");
  const uploadStorageService = new ObjectStorageService();

  app.post("/api/upload/photo", isAuthenticated, upload.single("photo"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const presignedUrl = await uploadStorageService.getObjectEntityUploadURL();
      const fileBuffer = fs.readFileSync(req.file.path);
      const putResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: fileBuffer,
        headers: { "Content-Type": req.file.mimetype || "application/octet-stream" },
      });
      if (!putResponse.ok) {
        throw new Error("Failed to upload to object storage");
      }
      const objectPath = uploadStorageService.normalizeObjectEntityPath(presignedUrl);
      res.json({ url: objectPath, filename: req.file.originalname });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    } finally {
      if (req.file?.path) try { fs.unlinkSync(req.file.path); } catch {}
    }
  });

  app.post("/api/upload/document", isAuthenticated, upload.single("document"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const presignedUrl = await uploadStorageService.getObjectEntityUploadURL();
      const fileBuffer = fs.readFileSync(req.file.path);
      const putResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: fileBuffer,
        headers: { "Content-Type": req.file.mimetype || "application/octet-stream" },
      });
      if (!putResponse.ok) {
        throw new Error("Failed to upload to object storage");
      }
      const objectPath = uploadStorageService.normalizeObjectEntityPath(presignedUrl);
      res.json({ url: objectPath, filename: req.file.originalname });
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    } finally {
      if (req.file?.path) try { fs.unlinkSync(req.file.path); } catch {}
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

  app.delete("/api/customer-documents/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteCustomerDocument(req.params.id);
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting customer document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  app.get("/api/customers/:id/loans", isAuthenticated, async (req, res) => {
    try {
      const customerLoans = await storage.getLoansByCustomer(req.params.id);
      res.json(customerLoans);
    } catch (error) {
      console.error("Error fetching customer loans:", error);
      res.status(500).json({ message: "Failed to fetch customer loans" });
    }
  });

  app.get("/api/customers/:id/loan-cycle", isAuthenticated, async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT
          COUNT(*) AS total_loans,
          COUNT(*) FILTER (WHERE status IN ('disbursed', 'active')) AS active_loans,
          COUNT(*) FILTER (WHERE status = 'completed') AS completed_loans,
          COUNT(*) FILTER (WHERE status = 'defaulted') AS defaulted_loans,
          COUNT(*) FILTER (WHERE status IN ('pending', 'approved', 'data_quality_review', 'risk_compliance_review', 'committee_review')) AS pending_loans,
          COALESCE(MAX(financing_cycle), 0) AS last_cycle
        FROM loans
        WHERE customer_id = ${req.params.id}
      `);
      const row = result.rows[0] as any;
      const totalLoans = Number(row.total_loans || 0);
      const nextCycle = totalLoans + 1;
      res.json({
        totalLoans,
        activeLoans: Number(row.active_loans || 0),
        completedLoans: Number(row.completed_loans || 0),
        defaultedLoans: Number(row.defaulted_loans || 0),
        pendingLoans: Number(row.pending_loans || 0),
        lastCycle: Number(row.last_cycle || 0),
        nextCycle,
      });
    } catch (error) {
      console.error("Error fetching customer loan cycle:", error);
      res.status(500).json({ message: "Failed to fetch loan cycle" });
    }
  });

  // ===== LOAN SUMMARY STATS =====
  app.get("/api/loans/summary-stats", isAuthenticated, async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT
          COUNT(*) FILTER (WHERE status IN ('disbursed', 'active')) AS active_loans,
          COALESCE(SUM(CASE WHEN status IN ('disbursed', 'active', 'completed') THEN COALESCE(principle_amount::numeric, 0) ELSE 0 END), 0) AS total_disbursed,
          COALESCE(SUM(CASE WHEN status IN ('disbursed', 'active') THEN COALESCE(total_receivable::numeric, 0) ELSE 0 END), 0)
            - COALESCE((SELECT SUM(COALESCE(paid_amount::numeric, 0)) FROM installments WHERE loan_id IN (SELECT id FROM loans WHERE status IN ('disbursed', 'active')) AND is_paid = true), 0) AS outstanding,
          COUNT(*) FILTER (WHERE status IN ('disbursed', 'active') AND id IN (
            SELECT DISTINCT i.loan_id FROM installments i
            WHERE i.is_paid = false AND i.due_date < NOW()
            AND COALESCE(i.principle_amount::numeric, 0) > 0
          )) AS in_arrears
        FROM loans
      `);
      const row = result.rows[0] as any;
      res.json({
        activeLoans: Number(row.active_loans || 0),
        totalDisbursed: Number(row.total_disbursed || 0),
        outstanding: Number(row.outstanding || 0),
        inArrears: Number(row.in_arrears || 0),
      });
    } catch (error) {
      console.error("Error fetching loan summary stats:", error);
      res.status(500).json({ message: "Failed to fetch loan summary stats" });
    }
  });

  // ===== LOANS =====
  app.get("/api/loans", isAuthenticated, async (req: any, res) => {
    try {
      const { search, status, financeOfficerId, page, limit } = req.query;
      const userId = req.session.userId;
      const userRole = await storage.getUserRole(userId);
      const role = userRole?.role || "user";
      const effectiveBranch = await getEffectiveBranchId(req);
      const result = await storage.getLoans({
        search: search as string | undefined,
        status: status as string | undefined,
        financeOfficerId: financeOfficerId as string | undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        userId: role === "user" ? userId : undefined,
        branchId: effectiveBranch || undefined,
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

  app.get("/api/loans/pending", isAuthenticated, requirePageAccess("loans"), async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const effectiveBranch = await getEffectiveBranchId(req);
      const loans = await storage.getPendingLoans(search, effectiveBranch || undefined);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching pending loans:", error);
      res.status(500).json({ message: "Failed to fetch pending loans" });
    }
  });

  app.get("/api/loans/approved", isAuthenticated, requirePageAccess("loans"), async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const effectiveBranch = await getEffectiveBranchId(req);
      const loans = await storage.getApprovedLoans(search, effectiveBranch || undefined);
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
      const effectiveBranch = await getEffectiveBranchId(req);
      const results = await storage.getDisbursedLoans({ search, branchId: effectiveBranch || undefined });
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
      if (loan.status === "cancelled") {
        return res.status(400).json({ message: "Cancelled loans cannot be regenerated" });
      }

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
      const roundedMarginCalc = Math.floor(marginPerInstCalc);
      const marginRemainderCalc = profitTotalCalc - (roundedMarginCalc * numInstallments);
      const roundedPrincipalCalc = Math.floor(principalPerInstallment);
      const principalRemainderCalc = principalAmount - (roundedPrincipalCalc * principalInstCount);

      for (let i = 1; i <= numInstallments; i++) {
        const isGrace = i <= gracePeriod;
        const isFirstPrincipal = gracePeriod > 0 ? (i === gracePeriod + 1) : (i === 1);

        let instPrincipal: number, instMargin: number;
        if (isGrace) {
          instPrincipal = 0;
          instMargin = (i === 1) ? roundedMarginCalc + Math.round(marginRemainderCalc) : roundedMarginCalc;
        } else if (isFirstPrincipal) {
          instPrincipal = roundedPrincipalCalc + Math.round(principalRemainderCalc);
          instMargin = (gracePeriod === 0 && i === 1) ? roundedMarginCalc + Math.round(marginRemainderCalc) : roundedMarginCalc;
        } else {
          instPrincipal = roundedPrincipalCalc;
          instMargin = roundedMarginCalc;
        }
        const instTotal = instPrincipal + instMargin;

        calculatedSchedule.push({
          installmentNumber: i,
          calculatedPrincipal: instPrincipal,
          calculatedMargin: instMargin,
          calculatedTotal: instTotal,
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
        if (isPaid !== undefined) {
          return res.status(400).json({ message: "Bulk schedule updates cannot change payment status. Use the payment workflow instead." });
        }

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
            isPaid: false,
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

        const roundedPrincipalPerInst = Math.floor(principalPerInst);
        const roundedMarginPerInst = Math.floor(marginPerInst);
        const principalRemainder = principalAmount - (roundedPrincipalPerInst * principalInstallments);
        const marginRemainder = profitTotal - (roundedMarginPerInst * numInstallments);

        let createdForLoan = 0;
        let updatedForLoan = 0;
        let skippedForLoan = 0;

        for (let i = 1; i <= numInstallments; i++) {
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

  app.post("/api/loans", isAuthenticated, requirePageAccess("loans"), async (req: any, res) => {
    try {
      const loanData = { ...req.body, createdBy: req.session.userId };
      if (loanData.customerId) {
        const cycleResult = await db.execute(sql`
          SELECT COUNT(*) AS total FROM loans WHERE customer_id = ${loanData.customerId}
        `);
        loanData.financingCycle = Number((cycleResult.rows[0] as any)?.total || 0) + 1;
      }
      const loan = await storage.createLoan(loanData);
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
      // Skip this check when adding financing for an existing customer (they intentionally want a new loan)
      if (data.nationalId && !data.existingCustomerId) {
        const existingCustomers = await db.select().from(customers).where(eq(customers.nationalId, data.nationalId));
        if (existingCustomers.length > 0) {
          const customerIds = existingCustomers.map(c => c.id);
          const existingLoans = await db.select().from(loans).where(
            and(
              inArray(loans.customerId, customerIds),
              inArray(loans.status, ['pending', 'returned', 'pending_fad_review', 'pending_risk_review', 'pending_committee_review', 'approved', 'active'])
            )
          );
          if (existingLoans.length > 0) {
            return res.status(400).json({ 
              message: `A financing application already exists for this customer (National ID: ${data.nationalId}). Existing application ID: ${existingLoans[0].applicationId}` 
            });
          }
        }
      }
      
      // Helper: auto-generate customer_no based on branch code
      const generateCustomerNo = async (branchId: string): Promise<string> => {
        const branch = branchId ? await storage.getBranch(branchId) : null;
        const branchCode = branch?.code || branch?.shortName || "000";
        const result = await pool.query(
          `SELECT customer_no FROM customers WHERE customer_no ~ $1 ORDER BY customer_no DESC LIMIT 1`,
          [`^${branchCode}[0-9]{6}$`]
        );
        let nextSeq = 1;
        if (result.rows.length > 0) {
          const lastNo = result.rows[0].customer_no;
          const numericPart = lastNo.substring(branchCode.length);
          const parsed = parseInt(numericPart, 10);
          if (!isNaN(parsed)) nextSeq = parsed + 1;
        }
        return `${branchCode}${String(nextSeq).padStart(6, "0")}`;
      };

      // Create or find customer
      let customerId: string;
      if (data.existingCustomerId) {
        const existingCustomer = await storage.getCustomer(data.existingCustomerId);
        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          return res.status(400).json({ message: "Customer not found" });
        }
      } else if (data.customerNo) {
        const existingCustomer = await storage.getCustomerByNo(data.customerNo);
        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const customer = await storage.createCustomer({
            customerNo: data.customerNo,
            firstName: data.firstName,
            lastName: data.lastName,
            fatherName: data.fatherName,
            fullNameDari: data.fullNameDari,
            fatherNameDari: data.fatherNameDari,
            gender: data.gender,
            maritalStatus: data.maritalStatus,
            nationalId: data.nationalId,
            dateOfBirth: data.dateOfBirth,
            placeOfBirth: data.placeOfBirth,
            age: data.age,
            homeAddress: data.homeAddress,
            province: data.province,
            district: data.district,
            areaType: data.areaType || "Rural",
            phoneNumber: data.phoneNumber,
            secondPhoneNumber: data.secondPhoneNumber,
            numberOfDependents: data.numberOfDependents,
            directMaleDependent: data.directMaleDependent,
            directFemaleDependent: data.directFemaleDependent,
            indirectMaleDependent: data.indirectMaleDependent,
            indirectFemaleDependent: data.indirectFemaleDependent,
            nidExpiryDate: data.nidExpiryDate,
            photoUrl: data.customerPhoto || undefined,
          });
          customerId = customer.id;
        }
      } else {
        // Check if customer already exists by national ID to prevent duplicates
        if (data.nationalId) {
          const existingByNid = await storage.getCustomerByNationalId(data.nationalId);
          if (existingByNid) {
            customerId = existingByNid.id;
          } else {
            const customerNo = data.branchId ? await generateCustomerNo(data.branchId) : undefined;
            const customer = await storage.createCustomer({
              customerNo,
              firstName: data.firstName,
              lastName: data.lastName,
              fatherName: data.fatherName,
              fullNameDari: data.fullNameDari,
              fatherNameDari: data.fatherNameDari,
              gender: data.gender,
              maritalStatus: data.maritalStatus,
              nationalId: data.nationalId,
              dateOfBirth: data.dateOfBirth,
              placeOfBirth: data.placeOfBirth,
              age: data.age,
              homeAddress: data.homeAddress,
              province: data.province,
              district: data.district,
              areaType: data.areaType || "Rural",
              phoneNumber: data.phoneNumber,
              secondPhoneNumber: data.secondPhoneNumber,
              numberOfDependents: data.numberOfDependents,
              directMaleDependent: data.directMaleDependent,
              directFemaleDependent: data.directFemaleDependent,
              indirectMaleDependent: data.indirectMaleDependent,
              indirectFemaleDependent: data.indirectFemaleDependent,
              nidExpiryDate: data.nidExpiryDate,
              photoUrl: data.customerPhoto || undefined,
            });
            customerId = customer.id;
          }
        } else {
          const customerNo = data.branchId ? await generateCustomerNo(data.branchId) : undefined;
          const customer = await storage.createCustomer({
            customerNo,
            firstName: data.firstName,
            lastName: data.lastName,
            fatherName: data.fatherName,
            fullNameDari: data.fullNameDari,
            fatherNameDari: data.fatherNameDari,
            gender: data.gender,
            maritalStatus: data.maritalStatus,
            nationalId: data.nationalId,
            dateOfBirth: data.dateOfBirth,
            placeOfBirth: data.placeOfBirth,
            age: data.age,
            homeAddress: data.homeAddress,
            province: data.province,
            district: data.district,
            areaType: data.areaType || "Rural",
            phoneNumber: data.phoneNumber,
            secondPhoneNumber: data.secondPhoneNumber,
            numberOfDependents: data.numberOfDependents,
            directMaleDependent: data.directMaleDependent,
            directFemaleDependent: data.directFemaleDependent,
            indirectMaleDependent: data.indirectMaleDependent,
            indirectFemaleDependent: data.indirectFemaleDependent,
            nidExpiryDate: data.nidExpiryDate,
            photoUrl: data.customerPhoto || undefined,
          });
          customerId = customer.id;
        }
      }

      // Save customer documents if provided
      if (data.documents && Array.isArray(data.documents)) {
        for (const doc of data.documents) {
          await storage.createCustomerDocument({
            customerId,
            section: doc.section || null,
            documentType: doc.documentType,
            fileName: doc.fileName,
            fileUrl: doc.fileUrl,
          });
        }
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
          monthlyIncomeAmount: data.businessMonthlyIncomeAmount ? String(data.businessMonthlyIncomeAmount) : null,
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

      // Calculate financing cycle for this customer
      const cycleResult = await db.execute(sql`
        SELECT COUNT(*) AS total FROM loans WHERE customer_id = ${customerId}
      `);
      const financingCycle = Number((cycleResult.rows[0] as any)?.total || 0) + 1;

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
        businessDetailedDescription: data.businessDetailedDescription,
        clientOccupation: data.clientOccupation,
        financingPurpose: data.financingPurpose,
        financingPurposeDetails: data.financingPurposeDetails,
        financingCycle,
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
        createdBy: req.session.userId,
      });

      // Create collateral if provided
      if (data.collateralType || data.collateralOwnerName) {
        await storage.createCollateral({
          loanId: loan.id,
          ownerName: data.collateralOwnerName,
          ownerNationalId: data.collateralOwnerNid,
          ownerNidExpiryDate: data.collateralOwnerNidExpiry,
          titleDeedNumber: data.collateralTitleDeedNo,
          collateralType: data.collateralType,
          province: data.collateralProvince,
          district: data.collateralDistrict,
          address: data.collateralAddress,
          description: data.collateralDescription,
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
          province: data.financialGuarantorProvince,
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
          province: data.familyGuarantorProvince,
          district: data.familyGuarantorDistrict,
          relationshipWithCustomer: data.familyGuarantorRelationship,
        });
      }

      // Create financial guarantor 2 if provided
      if (data.financialGuarantor2FullName) {
        await storage.createGuarantor({
          loanId: loan.id,
          guarantorType: "financial",
          fullName: data.financialGuarantor2FullName,
          fatherName: data.financialGuarantor2FatherName,
          dateOfBirth: data.financialGuarantor2DateOfBirth,
          age: data.financialGuarantor2DateOfBirth ? Math.floor((Date.now() - new Date(data.financialGuarantor2DateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
          nationalId: data.financialGuarantor2Nid,
          nidExpiryDate: data.financialGuarantor2NidExpiry,
          phoneNumber: data.financialGuarantor2Phone,
          homeAddress: data.financialGuarantor2HomeAddress,
          province: data.financialGuarantor2Province,
          district: data.financialGuarantor2District,
          business: data.financialGuarantor2Business,
          businessAddress: data.financialGuarantor2BusinessAddress,
          relationshipWithCustomer: data.financialGuarantor2Relationship,
          yearsOfExperience: data.financialGuarantor2YearsOfExperience,
          inventory: data.financialGuarantor2Inventory?.toString(),
          monthlyIncome: data.financialGuarantor2MonthlyIncome?.toString(),
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
      const financialGuarantors = guarantors.filter(g => g.guarantorType === "financial");
      const financialGuarantor = financialGuarantors[0] || null;
      const financialGuarantor2 = financialGuarantors[1] || null;
      const familyGuarantor = guarantors.find(g => g.guarantorType === "family");

      const fadReview = await storage.getFadReviewByLoanId(loan.id);
      const riskComplianceReview = await storage.getRiskComplianceReviewByLoanId(loan.id);
      const committeeVotes = await storage.getCommitteeVotesByLoanId(loan.id);
      const fundingSource = loan.fundingSourceId ? await storage.getFundingSource(loan.fundingSourceId) : null;
      const customerDocuments = customer ? await storage.getCustomerDocuments(customer.id) : [];
      const branch = loan.branchId ? await storage.getBranch(loan.branchId) : null;
      const financeOfficer = loan.financeOfficerId ? await storage.getFinanceOfficer(loan.financeOfficerId) : null;
      
      res.json({
        loan: {
          ...loan,
          branchName: branch?.name || null,
          financeOfficerName: financeOfficer?.name || null,
        },
        customer,
        business,
        license,
        collateral,
        financialGuarantor,
        financialGuarantor2,
        familyGuarantor,
        fadReview,
        riskComplianceReview,
        committeeVotes,
        fundingSource,
        customerDocuments,
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

      const oldCustomer = loan.customerId ? await storage.getCustomer(loan.customerId) : null;
      const oldBusiness = loan.customerId ? await storage.getCustomerBusinessByCustomerId(loan.customerId) : null;
      const oldLicense = oldBusiness ? await storage.getBusinessLicenseByBusinessId(oldBusiness.id) : null;
      const oldCollateral = await storage.getCollateralByLoanId(loan.id);
      const oldGuarantors = await storage.getGuarantorsByLoanId(loan.id);
      const oldFinancialGuarantors = oldGuarantors.filter(g => g.guarantorType === "financial");
      const oldFamilyGuarantor = oldGuarantors.find(g => g.guarantorType === "family");

      // Update customer
      if (loan.customerId) {
        await storage.updateCustomer(loan.customerId, {
          customerNo: str(data.customerNo),
          firstName: str(data.firstName),
          lastName: str(data.lastName),
          fatherName: str(data.fatherName),
          fullNameDari: str(data.fullNameDari),
          fatherNameDari: str(data.fatherNameDari),
          gender: str(data.gender),
          maritalStatus: str(data.maritalStatus),
          nationalId: str(data.nationalId),
          dateOfBirth: str(data.dateOfBirth),
          placeOfBirth: str(data.placeOfBirth),
          homeAddress: str(data.homeAddress),
          province: str(data.province),
          district: str(data.district),
          areaType: str(data.areaType) || "Rural",
          phoneNumber: str(data.phoneNumber),
          secondPhoneNumber: str(data.secondPhoneNumber),
          numberOfDependents: num(data.numberOfDependents),
          directMaleDependent: num(data.directMaleDependent),
          directFemaleDependent: num(data.directFemaleDependent),
          indirectMaleDependent: num(data.indirectMaleDependent),
          indirectFemaleDependent: num(data.indirectFemaleDependent),
          nidExpiryDate: str(data.nidExpiryDate),
          photoUrl: data.customerPhoto !== undefined ? str(data.customerPhoto) : undefined,
        });

        // Save new documents if provided
        if (data.documents && Array.isArray(data.documents)) {
          for (const doc of data.documents) {
            await storage.createCustomerDocument({
              customerId: loan.customerId,
              section: doc.section || null,
              documentType: doc.documentType,
              fileName: doc.fileName,
              fileUrl: doc.fileUrl,
            });
          }
        }
      }

      // Update loan
      await storage.updateLoan(loan.id, {
        branchId: str(data.branchId),
        financeOfficerId: str(data.financeOfficerId),
        productName: str(data.productName),
        productCode: str(data.productCode),
        sector: str(data.sector),
        businessDescription: str(data.businessDescription),
        businessDetailedDescription: str(data.businessDetailedDescription),
        clientOccupation: str(data.clientOccupation),
        financingPurpose: str(data.financingPurpose),
        financingPurposeDetails: str(data.financingPurposeDetails),
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
          monthlyIncomeAmount: data.businessMonthlyIncomeAmount ? String(data.businessMonthlyIncomeAmount) : null,
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
        ownerNidExpiryDate: str(data.collateralOwnerNidExpiry),
        titleDeedNumber: str(data.collateralTitleDeedNo),
        collateralType: str(data.collateralType),
        province: str(data.collateralProvince),
        district: str(data.collateralDistrict),
        address: str(data.collateralAddress),
        description: str(data.collateralDescription),
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
      const financialGuarantors = guarantors.filter(g => g.guarantorType === "financial");
      const financialGuarantor = financialGuarantors[0];
      const financialGuarantor2 = financialGuarantors[1];
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
        province: str(data.financialGuarantorProvince),
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
        province: str(data.familyGuarantorProvince),
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

      const financialGuarantor2Data = {
        fullName: str(data.financialGuarantor2FullName),
        fatherName: str(data.financialGuarantor2FatherName),
        dateOfBirth: str(data.financialGuarantor2DateOfBirth),
        age: data.financialGuarantor2DateOfBirth ? Math.floor((Date.now() - new Date(data.financialGuarantor2DateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        nationalId: str(data.financialGuarantor2Nid),
        nidExpiryDate: str(data.financialGuarantor2NidExpiry),
        phoneNumber: str(data.financialGuarantor2Phone),
        homeAddress: str(data.financialGuarantor2HomeAddress),
        province: str(data.financialGuarantor2Province),
        district: str(data.financialGuarantor2District),
        business: str(data.financialGuarantor2Business),
        businessAddress: str(data.financialGuarantor2BusinessAddress),
        relationshipWithCustomer: str(data.financialGuarantor2Relationship),
        yearsOfExperience: num(data.financialGuarantor2YearsOfExperience),
        inventory: dec(data.financialGuarantor2Inventory),
        monthlyIncome: dec(data.financialGuarantor2MonthlyIncome),
      };
      if (financialGuarantor2) {
        await storage.updateGuarantor(financialGuarantor2.id, financialGuarantor2Data);
      } else {
        const hasData = Object.values(financialGuarantor2Data).some(v => v !== null);
        if (hasData) {
          await storage.createGuarantor({ loanId: loan.id, guarantorType: "financial", ...financialGuarantor2Data });
        }
      }

      if (loan.status === "returned") {
        await storage.updateLoan(loan.id, { status: "pending" });
        await storage.resetCommitteeVotes(loan.id);
        await logActivity(req, "resubmit_loan", "loan", loan.id, `Resubmitted returned loan application: ${loan.applicationId}`);
      }

      const fieldLabels: Record<string, string> = {
        firstName: "Name", lastName: "Last Name", fatherName: "Father Name",
        fullNameDari: "Full Name (Dari)", fatherNameDari: "Father Name (Dari)",
        gender: "Gender", maritalStatus: "Marital Status", nationalId: "National ID",
        nidExpiryDate: "NID Expiry Date", dateOfBirth: "Date of Birth", placeOfBirth: "Place of Birth",
        homeAddress: "Home Address", province: "Province", district: "District",
        areaType: "Area Type", phoneNumber: "Phone", secondPhoneNumber: "Second Phone",
        numberOfDependents: "Dependents", customerNo: "Customer No",
        branchId: "Branch", financeOfficerId: "Finance Officer",
        productName: "Product", productCode: "Product Code", sector: "Sector",
        businessDescription: "Business Description", businessDetailedDescription: "Business Detailed Description",
        clientOccupation: "Occupation", financingPurpose: "Financing Purpose",
        financingPurposeDetails: "Purpose Details", fundingSourceId: "Funding Source",
        requestDate: "Request Date", requestAmount: "Request Amount",
        financingDurationMonths: "Duration (Months)", gracePeriod: "Grace Period",
        numberOfInstallments: "Installments", principleAmount: "Principal Amount",
        marginRate: "Margin Rate",
        businessName: "Business Name", businessProvince: "Business Province",
        businessDistrict: "Business District", businessVillage: "Business Village",
        detailedAddress: "Business Address", yearsOfExperience: "Years of Experience",
        monthlyIncomeAmount: "Monthly Income",
        licenseType: "License Type", president: "License President",
        licenseNumber: "License Number", registerDate: "License Register Date",
        expiryDate: "License Expiry Date",
        ownerName: "Collateral Owner", ownerNationalId: "Collateral Owner NID",
        titleDeedNumber: "Title Deed No", collateralType: "Collateral Type",
        collateralProvince: "Collateral Province", collateralDistrict: "Collateral District",
        address: "Collateral Address", description: "Collateral Description",
        purchasedPrice: "Purchased Price", marketPrice: "Market Price",
        fullName: "Guarantor Name", guarantorFatherName: "Guarantor Father Name",
        guarantorNationalId: "Guarantor NID", guarantorPhone: "Guarantor Phone",
        guarantorHomeAddress: "Guarantor Address", business: "Guarantor Business",
        businessAddress: "Guarantor Business Address", relationshipWithCustomer: "Relationship",
        inventory: "Guarantor Inventory", monthlyIncome: "Guarantor Monthly Income",
      };

      const normalize = (v: any): string => {
        if (v === null || v === undefined || v === "") return "";
        return String(v).trim();
      };

      const skipKeys = new Set(["id", "createdAt", "updatedAt", "customerId", "loanId", "customerBusinessId", "guarantorType", "photoUrl", "age", "status", "applicationId", "financingCycle", "sourceOfFund", "profit", "approvedAmount", "approvedDate"]);
      const detectChanges = (oldObj: any, newObj: any, section: string, labels: Record<string, string>): Array<{field: string; label: string; section: string; oldValue: string; newValue: string}> => {
        const changes: Array<{field: string; label: string; section: string; oldValue: string; newValue: string}> = [];
        if (!newObj) return changes;
        for (const key of Object.keys(newObj)) {
          if (skipKeys.has(key)) continue;
          const oldVal = normalize(oldObj?.[key]);
          const newVal = normalize(newObj[key]);
          if (oldVal !== newVal) {
            changes.push({ field: key, label: labels[key] || key, section, oldValue: oldVal || "(empty)", newValue: newVal || "(empty)" });
          }
        }
        return changes;
      };

      const allChanges: Array<{field: string; label: string; section: string; oldValue: string; newValue: string}> = [];

      {
        const newCustData = {
          customerNo: str(data.customerNo), firstName: str(data.firstName), lastName: str(data.lastName),
          fatherName: str(data.fatherName), fullNameDari: str(data.fullNameDari), fatherNameDari: str(data.fatherNameDari),
          gender: str(data.gender), maritalStatus: str(data.maritalStatus), nationalId: str(data.nationalId),
          dateOfBirth: str(data.dateOfBirth), placeOfBirth: str(data.placeOfBirth),
          homeAddress: str(data.homeAddress), province: str(data.province), district: str(data.district),
          areaType: str(data.areaType) || "Rural", phoneNumber: str(data.phoneNumber),
          secondPhoneNumber: str(data.secondPhoneNumber), numberOfDependents: num(data.numberOfDependents),
          directMaleDependent: num(data.directMaleDependent), directFemaleDependent: num(data.directFemaleDependent),
          indirectMaleDependent: num(data.indirectMaleDependent), indirectFemaleDependent: num(data.indirectFemaleDependent),
          nidExpiryDate: str(data.nidExpiryDate),
        };
        allChanges.push(...detectChanges(oldCustomer || {}, newCustData, "Customer", fieldLabels));
      }

      const newLoanData = {
        branchId: str(data.branchId), financeOfficerId: str(data.financeOfficerId),
        productName: str(data.productName), productCode: str(data.productCode), sector: str(data.sector),
        businessDescription: str(data.businessDescription), businessDetailedDescription: str(data.businessDetailedDescription),
        clientOccupation: str(data.clientOccupation), financingPurpose: str(data.financingPurpose),
        financingPurposeDetails: str(data.financingPurposeDetails), fundingSourceId: str(data.fundingSourceId),
        requestDate: str(data.requestDate), requestAmount: dec(data.requestAmount),
        financingDurationMonths: num(data.financingDurationMonths), gracePeriod: num(data.gracePeriod),
        numberOfInstallments: num(data.numberOfInstallments), principleAmount: dec(data.principleAmount),
        marginRate: dec(data.marginRate),
      };
      allChanges.push(...detectChanges(loan, newLoanData, "Financing", fieldLabels));

      {
        const newBizData = {
          businessName: str(data.businessName), province: str(data.businessProvince),
          district: str(data.businessDistrict), village: str(data.businessVillage),
          detailedAddress: str(data.businessDetailedAddress), yearsOfExperience: num(data.businessYearsOfExperience),
          monthlyIncomeAmount: data.businessMonthlyIncomeAmount ? String(data.businessMonthlyIncomeAmount) : null,
        };
        allChanges.push(...detectChanges(oldBusiness || {}, newBizData, "Business", fieldLabels));
      }

      {
        const newLicData = {
          licenseType: str(data.licenseType), president: str(data.licensePresident),
          licenseNumber: str(data.licenseNumber), registerDate: str(data.licenseRegisterDate),
          expiryDate: str(data.licenseExpiryDate),
        };
        allChanges.push(...detectChanges(oldLicense || {}, newLicData, "License", fieldLabels));
      }

      {
        const newCollData = {
          ownerName: str(data.collateralOwnerName), ownerNationalId: str(data.collateralOwnerNid),
          ownerNidExpiryDate: str(data.collateralOwnerNidExpiry),
          titleDeedNumber: str(data.collateralTitleDeedNo), collateralType: str(data.collateralType),
          province: str(data.collateralProvince), district: str(data.collateralDistrict),
          address: str(data.collateralAddress), description: str(data.collateralDescription),
          purchasedPrice: dec(data.collateralPurchasedPrice), marketPrice: dec(data.collateralMarketPrice),
        };
        allChanges.push(...detectChanges(oldCollateral || {}, newCollData, "Collateral", fieldLabels));
      }

      {
        const newFG1 = {
          fullName: str(data.financialGuarantorFullName), fatherName: str(data.financialGuarantorFatherName),
          dateOfBirth: str(data.financialGuarantorDateOfBirth),
          nationalId: str(data.financialGuarantorNid), nidExpiryDate: str(data.financialGuarantorNidExpiry),
          phoneNumber: str(data.financialGuarantorPhone),
          homeAddress: str(data.financialGuarantorHomeAddress), province: str(data.financialGuarantorProvince),
          district: str(data.financialGuarantorDistrict), business: str(data.financialGuarantorBusiness),
          businessAddress: str(data.financialGuarantorBusinessAddress),
          relationshipWithCustomer: str(data.financialGuarantorRelationship),
          yearsOfExperience: num(data.financialGuarantorYearsOfExperience),
          inventory: dec(data.financialGuarantorInventory), monthlyIncome: dec(data.financialGuarantorMonthlyIncome),
        };
        allChanges.push(...detectChanges(oldFinancialGuarantors[0] || {}, newFG1, "Financial Guarantor 1", fieldLabels));
      }

      {
        const newFamG = {
          fullName: str(data.familyGuarantorFullName), fatherName: str(data.familyGuarantorFatherName),
          dateOfBirth: str(data.familyGuarantorDateOfBirth),
          nationalId: str(data.familyGuarantorNid), nidExpiryDate: str(data.familyGuarantorNidExpiry),
          phoneNumber: str(data.familyGuarantorPhone),
          homeAddress: str(data.familyGuarantorHomeAddress), province: str(data.familyGuarantorProvince),
          district: str(data.familyGuarantorDistrict), relationshipWithCustomer: str(data.familyGuarantorRelationship),
        };
        allChanges.push(...detectChanges(oldFamilyGuarantor || {}, newFamG, "Family Guarantor", fieldLabels));
      }

      {
        const newFG2 = {
          fullName: str(data.financialGuarantor2FullName), fatherName: str(data.financialGuarantor2FatherName),
          dateOfBirth: str(data.financialGuarantor2DateOfBirth),
          nationalId: str(data.financialGuarantor2Nid), nidExpiryDate: str(data.financialGuarantor2NidExpiry),
          phoneNumber: str(data.financialGuarantor2Phone),
          homeAddress: str(data.financialGuarantor2HomeAddress), province: str(data.financialGuarantor2Province),
          district: str(data.financialGuarantor2District), business: str(data.financialGuarantor2Business),
          businessAddress: str(data.financialGuarantor2BusinessAddress),
          relationshipWithCustomer: str(data.financialGuarantor2Relationship),
          yearsOfExperience: num(data.financialGuarantor2YearsOfExperience),
          inventory: dec(data.financialGuarantor2Inventory), monthlyIncome: dec(data.financialGuarantor2MonthlyIncome),
        };
        allChanges.push(...detectChanges(oldFinancialGuarantors[1] || {}, newFG2, "Financial Guarantor 2", fieldLabels));
      }

      const changeDetails = allChanges.length > 0
        ? JSON.stringify({ applicationId: loan.applicationId, changes: allChanges, changedAt: new Date().toISOString() })
        : `Updated loan application: ${loan.applicationId} (no field changes detected)`;

      await logActivity(req, "update_loan_application", "loan", loan.id, changeDetails);
      res.json({ message: "Loan application updated successfully" });
    } catch (error) {
      console.error("Error updating loan application:", error);
      res.status(500).json({ message: "Failed to update loan application" });
    }
  });

  app.patch("/api/loans/:id", isAuthenticated, requirePageAccess("loans"), async (req: any, res) => {
    try {
      const loan = await storage.updateLoan(req.params.id, req.body);
      await logActivity(req, "update_loan", "loan", loan.id, `Updated loan: ${loan.applicationId}`);
      res.json(loan);
    } catch (error) {
      console.error("Error updating loan:", error);
      res.status(500).json({ message: "Failed to update loan" });
    }
  });

  app.post("/api/loans/:id/approve", isAuthenticated, requirePageAccess("loans"), async (req: any, res) => {
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

  app.post("/api/loans/:id/reject", isAuthenticated, requirePageAccess("loans"), async (req: any, res) => {
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

  app.post("/api/loans/:id/cancel", isAuthenticated, requireRole("admin", "ceo"), async (req: any, res) => {
    try {
      const cancellationReason = String(req.body?.reason || "").trim();
      if (!cancellationReason) {
        return res.status(400).json({ message: "A cancellation reason is required" });
      }
      if (cancellationReason.length > 1000) {
        return res.status(400).json({ message: "Cancellation reason must be 1,000 characters or fewer" });
      }

      const userId = req.session.userId || req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unable to identify the cancelling user" });
      }

      const result = await storage.cancelLoan(req.params.id, cancellationReason, userId);
      await logActivity(
        req,
        "cancel_loan",
        "loan",
        result.loan.id,
        `Cancelled loan: ${result.loan.applicationId}. Reason: ${cancellationReason}${result.reversalEntryId ? ` Reversal journal: ${result.reversalEntryId}.` : ""}`
      );
      res.json({
        message: result.reversedDisbursement
          ? "Disbursement reversed and loan cancelled successfully"
          : "Loan cancelled successfully",
        ...result,
      });
    } catch (error: any) {
      console.error("Error cancelling loan:", error);
      res.status(400).json({ message: error.message || "Failed to cancel loan" });
    }
  });

  app.post("/api/loans/:id/disburse", isAuthenticated, requirePageAccess("loans"), async (req: any, res) => {
    try {
      const loan = await storage.getLoan(req.params.id);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      const userId = req.session.userId || (req.user?.claims?.sub);
      const userRoleRecord = userId ? await storage.getUserRole(userId) : undefined;
      const userRoleValue = userRoleRecord?.role || "";
      const canPickDate = userRoleValue.toLowerCase() === "ceo" || userRoleValue.toLowerCase() === "admin";

      let baseDate: Date;
      if (canPickDate && req.body.disbursementDate && typeof req.body.disbursementDate === "string") {
        const dateStr = req.body.disbursementDate;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          return res.status(400).json({ message: "Invalid disbursement date format. Use YYYY-MM-DD." });
        }
        const parsed = new Date(dateStr + "T00:00:00");
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({ message: "Invalid disbursement date" });
        }
        baseDate = parsed;
      } else {
        baseDate = new Date();
      }

      const dayOfMonth = baseDate.getDate();
      const duration = loan.financingDurationMonths || 12;

      let firstInstallmentDate: Date;
      if (dayOfMonth >= 25) {
        firstInstallmentDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 2, 1);
      } else {
        firstInstallmentDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, dayOfMonth);
      }
      
      const maturityDate = new Date(firstInstallmentDate);
      maturityDate.setMonth(maturityDate.getMonth() + duration - 1);
      
      const branch = loan.branchId ? await storage.getBranch(loan.branchId) : null;
      const branchAccountCode = branch?.accountCode;

      if (!branchAccountCode) {
        return res.status(400).json({
          message: `Cannot disburse: Branch "${branch?.name || 'Unknown'}" does not have a linked account. Please configure the branch account code first.`,
          insufficientFunds: true,
          accountName: "Not configured",
          accountCode: "N/A",
          accountBalance: 0,
          requiredAmount: parseFloat(loan.requestAmount || "0"),
          branchName: branch?.name || "Unknown",
        });
      }

      const branchAccount = await storage.getAccountByCode(branchAccountCode);
      if (!branchAccount) {
        return res.status(400).json({
          message: `Cannot disburse: Branch account with code "${branchAccountCode}" was not found in the chart of accounts.`,
          insufficientFunds: true,
          accountName: "Account not found",
          accountCode: branchAccountCode,
          accountBalance: 0,
          requiredAmount: parseFloat(loan.requestAmount || "0"),
          branchName: branch?.name || "Unknown",
        });
      }

      const accountBalance = parseFloat(branchAccount.currentBalance || "0");
      // Use committee-approved principleAmount; fall back to requestAmount if not yet set
      const disbursementAmount = parseFloat(loan.principleAmount || loan.requestAmount || "0");

      if (!Number.isFinite(accountBalance) || !Number.isFinite(disbursementAmount)) {
        return res.status(400).json({
          message: `Cannot disburse: Invalid balance or amount values for branch account "${branchAccount.accountName}".`,
          insufficientFunds: true,
          accountName: branchAccount.accountName,
          accountCode: branchAccountCode,
          accountBalance: 0,
          requiredAmount: disbursementAmount || 0,
          branchName: branch?.name || "Unknown",
        });
      }

      if (accountBalance <= 0) {
        return res.status(400).json({
          message: `Insufficient funds: The branch account "${branchAccount.accountName}" (${branchAccountCode}) has a balance of AFN ${accountBalance.toLocaleString()}. Disbursement cannot proceed with a negative or zero balance.`,
          insufficientFunds: true,
          accountName: branchAccount.accountName,
          accountCode: branchAccountCode,
          accountBalance: accountBalance,
          requiredAmount: disbursementAmount,
          branchName: branch?.name || "Unknown",
        });
      }

      if (accountBalance < disbursementAmount) {
        return res.status(400).json({
          message: `Insufficient funds: The branch account "${branchAccount.accountName}" (${branchAccountCode}) has a balance of AFN ${accountBalance.toLocaleString()}, but the disbursement requires AFN ${disbursementAmount.toLocaleString()}.`,
          insufficientFunds: true,
          accountName: branchAccount.accountName,
          accountCode: branchAccountCode,
          accountBalance: accountBalance,
          requiredAmount: disbursementAmount,
          branchName: branch?.name || "Unknown",
        });
      }

      const result = await storage.disburseLoan(req.params.id, {
        disbursementDate: baseDate.toISOString().split("T")[0],
        firstInstallmentDate: firstInstallmentDate.toISOString().split("T")[0],
        maturityDate: maturityDate.toISOString().split("T")[0],
        disbursedById: userId || "unknown",
      });
      
      await logActivity(req, "disburse_loan", "loan", req.params.id, `Disbursed loan: ${loan.applicationId}`);

      try {
        const customer = loan.customerId ? await storage.getCustomer(loan.customerId) : null;
        const customerName = customer ? `${customer.firstName} ${customer.lastName}` : "Unknown";
        const branch = loan.branchId ? await storage.getBranch(loan.branchId) : null;
        // Use committee-approved principleAmount; fall back to requestAmount if not yet set
        const disbursementAmount = parseFloat(loan.principleAmount || loan.requestAmount || "0");

        let marginAmount = parseFloat(loan.profit || "0");
        if (marginAmount === 0 && disbursementAmount > 0) {
          const marginRate = parseFloat(loan.marginRate || "0");
          const durationMonths = loan.financingDurationMonths || 12;
          const rateCalc = marginRate > 1 ? marginRate / 100 : marginRate;
          marginAmount = (disbursementAmount * rateCalc / 12) * durationMonths;
        }

        const totalReceivableAmount = disbursementAmount + marginAmount;

        const creditCode = branch?.accountCode || "10206";
        const marginCreditCode = "20900";

        let debitCode = "11000";
        if (loan.productName) {
          const allProducts = await storage.getFinancingProducts();
          const matchedProduct = allProducts.find((p: any) => p.name === loan.productName);
          if (matchedProduct?.receivableAccountCode) {
            debitCode = matchedProduct.receivableAccountCode;
          }
        }

        const debitAccount = await storage.getAccountByCode(debitCode);
        const creditAccount = await storage.getAccountByCode(creditCode);
        const marginCreditAccount = await storage.getAccountByCode(marginCreditCode);

        if (debitAccount && creditAccount && disbursementAmount > 0) {
          const entryNumber = await storage.getNextEntryNumber();
          const entryDate = baseDate.toISOString().split("T")[0];
          const description = `Disbursement: ${customerName} (${loan.applicationId}) - AFN ${disbursementAmount.toLocaleString()}`;

          const loanFundId = loan.fundingSourceId || null;
          const lines: any[] = [
            {
              accountId: debitAccount.id,
              description: `Loan receivable - ${customerName} (${loan.applicationId})`,
              debitAmount: totalReceivableAmount.toFixed(2),
              creditAmount: "0",
              fundingSourceId: loanFundId,
            },
            {
              accountId: creditAccount.id,
              description: `Cash disbursed - ${customerName} (${loan.applicationId})`,
              debitAmount: "0",
              creditAmount: disbursementAmount.toFixed(2),
              fundingSourceId: loanFundId,
            },
          ];

          if (marginCreditAccount && marginAmount > 0) {
            lines.push({
              accountId: marginCreditAccount.id,
              description: `Loan margin - ${customerName} (${loan.applicationId})`,
              debitAmount: "0",
              creditAmount: marginAmount.toFixed(2),
              fundingSourceId: loanFundId,
            });
          }

          await storage.createJournalEntry(
            {
              entryNumber,
              entryDate,
              description,
              reference: loan.applicationId,
              referenceType: "disbursement",
              referenceId: loan.id,
              fundingSourceId: loanFundId,
              isPosted: true,
              createdBy: req.session.userId,
              postedBy: req.session.userId,
              postedAt: new Date(),
            },
            lines
          );
        }
      } catch (journalError) {
        console.error("Warning: Failed to create journal entry for disbursement:", journalError);
      }

      res.json({ message: "Loan disbursed successfully", installmentsCreated: result.installmentsCreated, customerId: loan.customerId });
    } catch (error) {
      console.error("Error disbursing loan:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Failed to disburse loan. " + errorMessage });
    }
  });

  app.post("/api/loans/fix-disbursement-journals", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { applicationIds } = req.body;
      if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
        return res.status(400).json({ message: "Please provide an array of applicationIds" });
      }

      const marginCreditCode = "20900";
      const marginCreditAccount = await storage.getAccountByCode(marginCreditCode);
      if (!marginCreditAccount) {
        return res.status(400).json({ message: `Account ${marginCreditCode} not found` });
      }

      const results: any[] = [];

      for (const appId of applicationIds) {
        try {
          const loan = await storage.getLoanByApplicationId(appId);
          if (!loan) {
            results.push({ applicationId: appId, success: false, error: "Loan not found" });
            continue;
          }

          const customer = loan.customerId ? await storage.getCustomer(loan.customerId) : null;
          const customerName = customer ? `${customer.firstName} ${customer.lastName}` : "Unknown";
          const branch = loan.branchId ? await storage.getBranch(loan.branchId) : null;
          const disbursement = await storage.getDisbursementByLoan(loan.id);
          const principalAmount = parseFloat(loan.principleAmount || loan.requestAmount || "0");

          let marginAmount = parseFloat(loan.profit || "0");
          if (marginAmount === 0 && principalAmount > 0) {
            const marginRate = parseFloat(loan.marginRate || "0");
            const durationMonths = loan.financingDurationMonths || 12;
            const rateCalc = marginRate > 1 ? marginRate / 100 : marginRate;
            marginAmount = (principalAmount * rateCalc / 12) * durationMonths;
          }

          if (marginAmount <= 0) {
            results.push({ applicationId: appId, success: false, error: "No margin amount to record" });
            continue;
          }

          const totalReceivableAmount = principalAmount + marginAmount;
          const creditCode = branch?.accountCode || "10206";

          let debitCode = "11000";
          if (loan.productName) {
            const allProducts = await storage.getFinancingProducts();
            const matchedProduct = allProducts.find((p: any) => p.name === loan.productName);
            if (matchedProduct?.receivableAccountCode) {
              debitCode = matchedProduct.receivableAccountCode;
            }
          }

          const debitAccount = await storage.getAccountByCode(debitCode);
          const creditAccount = await storage.getAccountByCode(creditCode);

          if (!debitAccount || !creditAccount) {
            results.push({ applicationId: appId, success: false, error: "Debit or credit account not found" });
            continue;
          }

          const existingEntries = await db.select().from(journalEntries)
            .where(and(eq(journalEntries.reference, appId), eq(journalEntries.referenceType, "disbursement")));

          const disbDate = disbursement?.disbursementDate || new Date().toISOString().split("T")[0];

          if (existingEntries.length > 0) {
            const existingEntry = existingEntries[0];
            const existingLines = await db.select().from(journalLines)
              .where(eq(journalLines.journalEntryId, existingEntry.id));

            const has20900 = existingLines.some((line: any) => line.accountId === marginCreditAccount.id);
            if (has20900) {
              results.push({ applicationId: appId, success: false, error: "Already has 20900 margin line" });
              continue;
            }

            await db.insert(journalLines).values({
              id: crypto.randomUUID(),
              journalEntryId: existingEntry.id,
              accountId: marginCreditAccount.id,
              description: `Loan margin - ${customerName} (${appId})`,
              debitAmount: "0",
              creditAmount: marginAmount.toFixed(2),
              fundingSourceId: loan.fundingSourceId || null,
            });

            const debitLine = existingLines.find((line: any) => parseFloat(line.debitAmount || "0") > 0);
            if (debitLine) {
              await db.update(journalLines)
                .set({ debitAmount: totalReceivableAmount.toFixed(2) })
                .where(eq(journalLines.id, debitLine.id));
            }

            const newTotalDebit = totalReceivableAmount;
            const newTotalCredit = principalAmount + marginAmount;
            await db.update(journalEntries)
              .set({
                totalDebit: newTotalDebit.toFixed(2),
                totalCredit: newTotalCredit.toFixed(2),
              })
              .where(eq(journalEntries.id, existingEntry.id));

            results.push({ applicationId: appId, success: true, action: "updated", marginAmount: marginAmount.toFixed(2) });
          } else {
            const entryNumber = await storage.getNextEntryNumber();
            const description = `Disbursement: ${customerName} (${appId}) - AFN ${principalAmount.toLocaleString()}`;

            const fixFundId = loan.fundingSourceId || null;
            const lines: any[] = [
              {
                accountId: debitAccount.id,
                description: `Loan receivable - ${customerName} (${appId})`,
                debitAmount: totalReceivableAmount.toFixed(2),
                creditAmount: "0",
                fundingSourceId: fixFundId,
              },
              {
                accountId: creditAccount.id,
                description: `Cash disbursed - ${customerName} (${appId})`,
                debitAmount: "0",
                creditAmount: principalAmount.toFixed(2),
                fundingSourceId: fixFundId,
              },
              {
                accountId: marginCreditAccount.id,
                description: `Loan margin - ${customerName} (${appId})`,
                debitAmount: "0",
                creditAmount: marginAmount.toFixed(2),
                fundingSourceId: fixFundId,
              },
            ];

            await storage.createJournalEntry(
              {
                entryNumber,
                entryDate: disbDate,
                description,
                reference: appId,
                referenceType: "disbursement",
                referenceId: loan.id,
                fundingSourceId: fixFundId,
                isPosted: true,
                createdBy: req.session.userId,
                postedBy: req.session.userId,
                postedAt: new Date(),
              },
              lines
            );

            results.push({ applicationId: appId, success: true, action: "created", marginAmount: marginAmount.toFixed(2) });
          }

          await logActivity(req, "fix_disbursement_journal", "loan", loan.id, `Fixed disbursement journal for ${appId} - added margin ${marginAmount.toFixed(2)} to account 20900`);
        } catch (loanError: any) {
          results.push({ applicationId: appId, success: false, error: loanError.message });
        }
      }

      const successCount = results.filter(r => r.success).length;
      res.json({
        message: `Processed ${results.length} loans: ${successCount} fixed successfully`,
        results,
      });
    } catch (error: any) {
      console.error("Error fixing disbursement journals:", error);
      res.status(500).json({ message: "Failed to fix disbursement journals" });
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

  app.post("/api/loans/bulk-disburse", isAuthenticated, requirePageAccess("loans"), csvUpload.single("file"), async (req: any, res) => {
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

        const bulkLoan = await storage.getLoanByApplicationId(applicationId);
        if (bulkLoan) {
          const bulkBranch = bulkLoan.branchId ? await storage.getBranch(bulkLoan.branchId) : null;
          const bulkBranchAccountCode = bulkBranch?.accountCode;
          if (!bulkBranchAccountCode) {
            results.push({ applicationId, success: false, error: `Branch "${bulkBranch?.name || 'Unknown'}" does not have a linked account. Configure branch account code first.` });
            continue;
          }
          const bulkBranchAccount = await storage.getAccountByCode(bulkBranchAccountCode);
          if (!bulkBranchAccount) {
            results.push({ applicationId, success: false, error: `Branch account with code "${bulkBranchAccountCode}" not found in chart of accounts.` });
            continue;
          }
          const bulkAcctBalance = parseFloat(bulkBranchAccount.currentBalance || "0");
          const bulkDisbAmount = parseFloat(bulkLoan.requestAmount || "0");
          if (!Number.isFinite(bulkAcctBalance) || !Number.isFinite(bulkDisbAmount)) {
            results.push({ applicationId, success: false, error: `Invalid balance or amount values for branch account "${bulkBranchAccount.accountName}".` });
            continue;
          }
          if (bulkAcctBalance <= 0 || bulkAcctBalance < bulkDisbAmount) {
            results.push({ applicationId, success: false, error: `Insufficient funds: ${bulkBranchAccount.accountName} (${bulkBranchAccountCode}) balance AFN ${bulkAcctBalance.toLocaleString()}, required AFN ${bulkDisbAmount.toLocaleString()}` });
            continue;
          }
        }

        const result = await storage.bulkDisburseLoan(applicationId, normalizedDate, userId);
        
        if (result.success) {
          try {
            const loan = await storage.getLoanByApplicationId(applicationId);
            if (loan) {
              const customer = loan.customerId ? await storage.getCustomer(loan.customerId) : null;
              const customerName = customer ? `${customer.firstName} ${customer.lastName}` : "Unknown";
              const branch = loan.branchId ? await storage.getBranch(loan.branchId) : null;
              const disbursementAmount = parseFloat(loan.requestAmount || "0");

              let bulkMarginAmount = parseFloat(loan.profit || "0");
              if (bulkMarginAmount === 0 && disbursementAmount > 0) {
                const bulkMarginRate = parseFloat(loan.marginRate || "0");
                const bulkDuration = loan.financingDurationMonths || 12;
                const bulkRateCalc = bulkMarginRate > 1 ? bulkMarginRate / 100 : bulkMarginRate;
                bulkMarginAmount = (disbursementAmount * bulkRateCalc / 12) * bulkDuration;
              }
              const bulkTotalReceivable = disbursementAmount + bulkMarginAmount;

              const creditCode = branch?.accountCode || "10206";
              const bulkMarginCreditCode = "20900";

              let debitCode = "11000";
              if (loan.productName) {
                const allProducts = await storage.getFinancingProducts();
                const matchedProduct = allProducts.find((p: any) => p.name === loan.productName);
                if (matchedProduct?.receivableAccountCode) {
                  debitCode = matchedProduct.receivableAccountCode;
                }
              }

              const debitAccount = await storage.getAccountByCode(debitCode);
              const creditAccount = await storage.getAccountByCode(creditCode);
              const bulkMarginCreditAccount = await storage.getAccountByCode(bulkMarginCreditCode);

              if (debitAccount && creditAccount && disbursementAmount > 0) {
                const entryNumber = await storage.getNextEntryNumber();
                const bulkFundId = loan.fundingSourceId || null;
                const bulkLines: any[] = [
                  { accountId: debitAccount.id, description: `Loan receivable - ${customerName}`, debitAmount: bulkTotalReceivable.toFixed(2), creditAmount: "0", fundingSourceId: bulkFundId },
                  { accountId: creditAccount.id, description: `Cash disbursed - ${customerName}`, debitAmount: "0", creditAmount: disbursementAmount.toFixed(2), fundingSourceId: bulkFundId },
                ];
                if (bulkMarginCreditAccount && bulkMarginAmount > 0) {
                  bulkLines.push({
                    accountId: bulkMarginCreditAccount.id,
                    description: `Loan margin - ${customerName} (${applicationId})`,
                    debitAmount: "0",
                    creditAmount: bulkMarginAmount.toFixed(2),
                    fundingSourceId: bulkFundId,
                  });
                }
                await storage.createJournalEntry(
                  {
                    entryNumber,
                    entryDate: normalizedDate,
                    description: `Disbursement: ${customerName} (${applicationId}) - AFN ${disbursementAmount.toLocaleString()}`,
                    reference: applicationId,
                    referenceType: "disbursement",
                    referenceId: loan.id,
                    fundingSourceId: bulkFundId,
                    isPosted: true,
                    createdBy: userId,
                    postedBy: userId,
                    postedAt: new Date(),
                  },
                  bulkLines
                );
              }
            }
          } catch (journalError) {
            console.error(`Warning: Failed to create journal entry for bulk disbursement ${applicationId}:`, journalError);
          }
        }

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
        await storage.updateLoan(loanId, { status: "returned" });
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

  app.get("/api/loan-review-history/:loanId", isAuthenticated, async (req, res) => {
    try {
      const loanId = req.params.loanId;
      const fadReviewsAll = await db.select().from(fadReviews).where(eq(fadReviews.loanId, loanId)).orderBy(desc(fadReviews.createdAt));
      const riskReviewsAll = await db.select().from(riskComplianceReviews).where(eq(riskComplianceReviews.loanId, loanId)).orderBy(desc(riskComplianceReviews.createdAt));
      res.json({ fadReviews: fadReviewsAll, riskComplianceReviews: riskReviewsAll });
    } catch (error) {
      console.error("Error fetching loan review history:", error);
      res.status(500).json({ message: "Failed to fetch review history" });
    }
  });

  // ===== RISK COMPLIANCE REVIEW =====
  app.get("/api/risk-compliance/pending-loans", isAuthenticated, requireRole("risk_compliance", "manager", "admin"), async (req: any, res) => {
    try {
      const loans = await storage.getLoansWithDetails({ status: "risk_compliance_review" });
      const loansWithInfo = await Promise.all(
        loans.map(async (loanData: any) => {
          const fadReview = await storage.getFadReviewByLoanId(loanData.id);
          const committeeVotes = await storage.getCommitteeVotesByLoanId(loanData.id);
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
          return { loan, fadReview, committeeVotes };
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
      const { loanId, vote, comments, fundingSourceId, principleAmount, marginRate, gracePeriod } = req.body;
      
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

      if (vote === "approved") {
        if (!principleAmount || Number(principleAmount) <= 0) {
          return res.status(400).json({ message: "Principle Amount is required for approval" });
        }
        if (!marginRate || Number(marginRate) <= 0) {
          return res.status(400).json({ message: "Margin Rate is required for approval" });
        }
        if (gracePeriod === undefined || gracePeriod === null || Number(gracePeriod) < 0) {
          return res.status(400).json({ message: "Grace Period is required for approval" });
        }
      }

      if (principleAmount || marginRate || gracePeriod !== undefined) {
        const loanUpdate: any = {};
        // Always preserve requestAmount — committee revisions go into principleAmount only
        if (principleAmount) loanUpdate.principleAmount = principleAmount;
        if (marginRate) loanUpdate.marginRate = marginRate;
        if (gracePeriod !== undefined && gracePeriod !== null) loanUpdate.gracePeriod = Number(gracePeriod);

        // Recalculate profit and totalReceivable based on approved (committee) figures
        const approvedPrincipal = parseFloat(principleAmount || loan.principleAmount || loan.requestAmount || "0");
        const approvedRate = parseFloat(marginRate || loan.marginRate || "0");
        const duration = loan.financingDurationMonths || 12;
        const rate = approvedRate > 1 ? approvedRate / 100 : approvedRate;
        const newProfit = (approvedPrincipal * rate / 12) * duration;
        loanUpdate.profit = newProfit.toFixed(2);
        loanUpdate.totalReceivable = (approvedPrincipal + newProfit).toFixed(2);

        await storage.updateLoan(loanId, loanUpdate);
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

      if (fundingSourceId && userRole.role.toLowerCase() === "cfo") {
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
          approvedAmount: approvedLoan?.principleAmount || approvedLoan?.requestAmount || "0",
          approvedDate: new Date().toISOString().split("T")[0],
          financingDurationMonths: approvedLoan?.financingDurationMonths || 12,
          gracePeriod: approvedLoan?.gracePeriod || 0,
          approvedById: req.session.userId || (req.user?.claims?.sub) || "unknown",
          committeeDiscussion: comments || `Committee approved with ${approvedVotes} votes`,
        });
        await logActivity(req, "committee_approve", "loan", loanId, `Committee approved with ${approvedVotes} votes`);
      } else if (rejectedVotes > (COMMITTEE_SIZE - REQUIRED_APPROVALS)) {
        await storage.updateLoan(loanId, { status: "data_quality_review" });
        await storage.resetCommitteeVotes(loanId);
        await logActivity(req, "committee_reject", "loan", loanId, `Committee rejected with ${rejectedVotes} votes - sent back to FAD review`);
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
  app.get("/api/loans/:loanId/all-installments", isAuthenticated, async (req, res) => {
    try {
      const result = await storage.getInstallmentsByLoan(req.params.loanId);
      res.json(result);
    } catch (error) {
      console.error("Error fetching loan installments:", error);
      res.status(500).json({ message: "Failed to fetch loan installments" });
    }
  });

  app.get("/api/installments/repayment-summary", isAuthenticated, async (req, res) => {
    try {
      const effectiveBranch = await getEffectiveBranchId(req);
      const result = await storage.getLoanRepaymentSummary(effectiveBranch || undefined);
      res.json(result);
    } catch (error) {
      console.error("Error fetching repayment summary:", error);
      res.status(500).json({ message: "Failed to fetch repayment summary" });
    }
  });

  app.get("/api/installments", isAuthenticated, async (req, res) => {
    try {
      const { search, page, limit, currentMonthOnly, paidOnly, customerName, applicationId, branchId, startDate, endDate } = req.query;
      const result = await storage.getInstallments({
        search: search as string | undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        currentMonthOnly: currentMonthOnly === "true",
        paidOnly: paidOnly === "true",
        customerName: customerName as string | undefined,
        applicationId: applicationId as string | undefined,
        branchId: branchId as string | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
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
      const { filter, officer, search, page, limit, startDate, endDate } = req.query;
      const effectiveBranch = await getEffectiveBranchId(req);
      const branchFilter = effectiveBranch || (req.query.branch as string | undefined);
      const result = await storage.getCollectionInstallments({
        filter: (filter as string) || "upcoming",
        branch: branchFilter && branchFilter !== "all" ? branchFilter : undefined,
        officer: officer as string | undefined,
        search: search as string | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
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
      const schema = z.object({
        amount: z.number().positive("Payment amount must be greater than 0"),
        paymentDate: z.string().optional(),
        debitAccountCode: z.string().optional(),
        creditAccountCode: z.string().optional(),
        profitDebitAccountCode: z.string().optional(),
        profitCreditAccountCode: z.string().optional(),
      });
      const parsed = schema.parse(req.body);
      const result = await storage.recordPaymentWithOverflow(req.params.id, parsed.amount, parsed.paymentDate);
      const firstInstallment = result.paidInstallments[0];

      const installmentNums = result.paidInstallments.map(i => `#${i.installmentNumber}`).join(", ");
      const action = result.paidInstallments.length > 1 ? "overpayment" : (firstInstallment.isPaid ? "full_payment" : "partial_payment");
      await logActivity(req, action, "installment", req.params.id,
        `Recorded payment of AFN ${parsed.amount.toLocaleString()} applied to installment(s) ${installmentNums}${result.overflow > 0 ? ` (AFN ${result.overflow.toLocaleString()} unapplied)` : ""}`
      );

      let journalEntryError: string | null = null;
      let createdJournalEntryId: string | null = null;
      try {
        const loan = firstInstallment.loanId ? await storage.getLoan(firstInstallment.loanId) : null;
        const customer = loan?.customerId ? await storage.getCustomer(loan.customerId) : null;
        const customerName = customer ? `${customer.firstName} ${customer.lastName}` : "Unknown";
        const loanAppId = loan?.applicationId || "N/A";

        const debitCode = parsed.debitAccountCode || "10206";

        let creditCode = parsed.creditAccountCode;
        if (!creditCode) {
          creditCode = "11000";
          if (loan?.productName) {
            const allProducts = await storage.getFinancingProducts();
            const matchedProduct = allProducts.find((p: any) => p.name === loan.productName);
            if (matchedProduct?.receivableAccountCode) {
              creditCode = matchedProduct.receivableAccountCode;
            }
          }
        }

        const profitDebitCode = parsed.profitDebitAccountCode || "20900";
        const profitCreditCode = parsed.profitCreditAccountCode || "40300";

        const debitAccount = await storage.getAccountByCode(debitCode);
        const creditAccount = await storage.getAccountByCode(creditCode);
        const profitDebitAccount = await storage.getAccountByCode(profitDebitCode);
        const profitCreditAccount = await storage.getAccountByCode(profitCreditCode);

        // Compute margin (profit) portion to recognize for this collection
        let totalMarginApplied = 0;
        for (const inst of result.paidInstallments) {
          const applied = parseFloat((inst as any).appliedAmount || "0");
          const total = parseFloat(inst.totalAmount || "0");
          const margin = parseFloat(inst.marginAmount || "0");
          if (total > 0 && applied > 0 && margin > 0) {
            totalMarginApplied += (applied / total) * margin;
          }
        }
        totalMarginApplied = Math.round(totalMarginApplied * 100) / 100;

        if (debitAccount && creditAccount) {
          const entryNumber = await storage.getNextEntryNumber();
          const entryDate = parsed.paymentDate || new Date().toISOString().split("T")[0];
          const description = `Collection: ${customerName} (${loanAppId}) - Inst ${installmentNums} - AFN ${parsed.amount.toLocaleString()}`;

          const collFundId = loan?.fundingSourceId || null;
          const lines: any[] = [
            {
              accountId: debitAccount.id,
              description: `Cash received - ${customerName} Inst ${installmentNums}`,
              debitAmount: result.totalApplied.toFixed(2),
              creditAmount: "0",
              fundingSourceId: collFundId,
            },
            {
              accountId: creditAccount.id,
              description: `Loan receivable - ${customerName} Inst ${installmentNums}`,
              debitAmount: "0",
              creditAmount: result.totalApplied.toFixed(2),
              fundingSourceId: collFundId,
            },
          ];

          if (totalMarginApplied > 0) {
            if (!profitDebitAccount) {
              throw new Error(`Profit debit account "${profitDebitCode}" not found in chart of accounts`);
            }
            if (!profitCreditAccount) {
              throw new Error(`Profit credit account "${profitCreditCode}" not found in chart of accounts`);
            }
            lines.push(
              {
                accountId: profitDebitAccount.id,
                description: `Deferred profit recognized - ${customerName} Inst ${installmentNums}`,
                debitAmount: totalMarginApplied.toFixed(2),
                creditAmount: "0",
                fundingSourceId: collFundId,
              },
              {
                accountId: profitCreditAccount.id,
                description: `Profit income - ${customerName} Inst ${installmentNums}`,
                debitAmount: "0",
                creditAmount: totalMarginApplied.toFixed(2),
                fundingSourceId: collFundId,
              },
            );
          }

          const createdJe = await storage.createJournalEntry(
            {
              entryNumber,
              entryDate,
              description,
              reference: loanAppId,
              referenceType: "collection",
              referenceId: firstInstallment.id,
              fundingSourceId: collFundId,
              isPosted: true,
              createdBy: req.session.userId,
              postedBy: req.session.userId,
              postedAt: new Date(),
            },
            lines
          );
          createdJournalEntryId = createdJe?.id || null;
        }
      } catch (journalError: any) {
        console.error("Warning: Failed to create journal entry for collection:", journalError);
        journalEntryError = journalError?.message || "Unknown error creating journal entry";
      }

      try {
        const affected = result.paidInstallments.map((inst: any) => ({
          installmentId: inst.id,
          installmentNumber: inst.installmentNumber,
          appliedAmount: inst.appliedAmount,
          prev: inst.previousState,
        }));
        const loanForTxn = firstInstallment.loanId ? await storage.getLoan(firstInstallment.loanId) : null;
        await storage.createPaymentTransaction({
          loanId: firstInstallment.loanId || null,
          customerId: loanForTxn?.customerId || null,
          customerName: null,
          primaryInstallmentId: firstInstallment.id,
          amount: parsed.amount.toFixed(2),
          totalApplied: result.totalApplied.toFixed(2),
          overflow: result.overflow.toFixed(2),
          paymentDate: parsed.paymentDate || new Date().toISOString().split("T")[0],
          source: "direct",
          collectionRecordId: null,
          journalEntryId: createdJournalEntryId,
          affectedInstallments: JSON.stringify(affected),
          status: "active",
          recordedBy: req.session.userId,
        } as any);
      } catch (txnError: any) {
        console.error("Warning: Failed to record payment transaction:", txnError);
      }

      res.json({
        ...firstInstallment,
        overflowApplied: result.paidInstallments.length > 1,
        installmentsPaid: result.paidInstallments.length,
        totalApplied: result.totalApplied,
        overflow: result.overflow,
        journalEntryError,
      });
    } catch (error: any) {
      console.error("Error recording collection payment:", error);
      res.status(400).json({ message: error.message || "Failed to record payment" });
    }
  });

  app.post("/api/collections/:id/reverse", isAuthenticated, requireRole("admin", "ceo"), async (req: any, res) => {
    try {
      const installmentId = req.params.id;
      const reason = (req.body?.reason || "").toString().trim();
      if (!reason) return res.status(400).json({ message: "A reason is required to reverse a payment" });

      const installment = await storage.getInstallmentById(installmentId);
      if (!installment) return res.status(404).json({ message: "Installment not found" });

      const paidAmount = parseFloat(installment.paidAmount || "0");
      if (paidAmount <= 0) return res.status(400).json({ message: "No payment to reverse on this installment" });

      const loan = installment.loanId ? await storage.getLoan(installment.loanId) : null;
      const customer = loan?.customerId ? await storage.getCustomer(loan.customerId) : null;
      const customerName = customer ? `${customer.firstName} ${customer.lastName}` : "Unknown";

      // Preferred path: reverse via recorded payment transactions (exact restore, handles overflow)
      const txns = await storage.getActivePaymentTransactionsByInstallment(installmentId);

      if (txns.length > 0) {
        for (const txn of txns) {
          // Guard against double-reverse: re-check the transaction is still active
          const fresh = await storage.getPaymentTransaction(txn.id);
          if (!fresh || fresh.status !== "active") continue;

          let reversalJeId: string | null = null;
          if (txn.journalEntryId) {
            const journalEntry = await storage.getJournalEntry(txn.journalEntryId);
            if (journalEntry?.isReversed) {
              reversalJeId = journalEntry.reversedEntryId || null;
              await storage.reversePaymentTransaction(txn.id, req.session.userId, reason, reversalJeId);
            } else {
              // The journal-reversal workflow also synchronizes the linked
              // payment transaction and rebuilds all affected installments.
              const reversalEntry = await storage.reverseJournalEntry(txn.journalEntryId, req.session.userId);
              reversalJeId = reversalEntry?.id || null;
              await logActivity(req, "reverse", "journal_entry", txn.journalEntryId, `Reversed collection journal entry for payment reversal — reason: ${reason}`);
            }
          } else {
            await storage.reversePaymentTransaction(txn.id, req.session.userId, reason);
          }
        }

        await logActivity(req, "reverse_payment", "installment", installmentId,
          `Reversed payment of AFN ${paidAmount.toLocaleString()} for ${customerName} - Installment #${installment.installmentNumber}. Reason: ${reason}`
        );

        return res.json({ message: "Payment reversed successfully", reversedAmount: paidAmount, exact: true });
      }

      // Legacy fallback: no recorded transaction (payment made before this feature)
      const journalEntries = await storage.getJournalEntriesByReference("collection", installmentId);
      for (const journalEntry of journalEntries) {
        await storage.reverseJournalEntry(journalEntry.id, req.session.userId);
        await logActivity(req, "reverse", "journal_entry", journalEntry.id, `Auto-reversed collection journal entry ${journalEntry.entryNumber} for installment reversal — reason: ${reason}`);
      }

      await storage.restoreInstallmentState(installmentId, {
        paidAmount: "0",
        paymentDate: null,
        isPaid: false,
        lateDays: null,
        installmentVariance: null,
      });

      await logActivity(req, "reverse_payment", "installment", installmentId,
        `Reversed payment of AFN ${paidAmount.toLocaleString()} for ${customerName} - Installment #${installment.installmentNumber} (legacy). Reason: ${reason}`
      );

      res.json({ message: "Payment reversed successfully", reversedAmount: paidAmount, exact: false });
    } catch (error: any) {
      console.error("Error reversing collection payment:", error);
      res.status(500).json({ message: error.message || "Failed to reverse payment" });
    }
  });

  app.get("/api/payment-transactions", requireRole("admin", "ceo"), async (req: any, res) => {
    try {
      const { loanId, installmentId, status } = req.query;
      const txns = await storage.getPaymentTransactions({
        loanId: loanId as string | undefined,
        installmentId: installmentId as string | undefined,
        status: status as string | undefined,
      });
      res.json(txns.map((t) => ({
        ...t,
        affectedInstallments: (() => { try { return JSON.parse(t.affectedInstallments || "[]"); } catch { return []; } })(),
      })));
    } catch (error: any) {
      console.error("Error fetching payment transactions:", error);
      res.status(500).json({ message: error.message || "Failed to fetch payment transactions" });
    }
  });

  app.get("/api/payment-stats", isAuthenticated, async (req, res) => {
    try {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
      const today = now.toISOString().split("T")[0];

      const result = await pool.query(`
        SELECT
          COALESCE(SUM(CASE WHEN i.due_date <= $1 AND i.is_paid = false THEN COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0) ELSE 0 END), 0) as due_till_current_month,
          COALESCE(SUM(CASE WHEN i.due_date < $2 AND i.is_paid = false THEN COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0) ELSE 0 END), 0) as overdue_till_date,
          COALESCE(SUM(CASE WHEN i.payment_date >= $3 AND i.payment_date <= $4 THEN COALESCE(i.paid_amount::numeric, 0) ELSE 0 END), 0) as collected_current_month,
          COALESCE(SUM(CASE WHEN i.due_date >= $3 AND i.due_date <= $1 AND i.is_paid = false THEN COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0) ELSE 0 END), 0) as outstanding_current_month
        FROM installments i
        JOIN loans l ON i.loan_id = l.id
        WHERE l.status IN ('disbursed', 'active')
      `, [currentMonthEnd, today, currentMonthStart, currentMonthEnd]);

      const stats = result.rows[0];
      res.json({
        dueTillCurrentMonth: parseFloat(stats.due_till_current_month || "0"),
        overdueTillDate: parseFloat(stats.overdue_till_date || "0"),
        collectedCurrentMonth: parseFloat(stats.collected_current_month || "0"),
        outstandingCurrentMonth: parseFloat(stats.outstanding_current_month || "0"),
      });
    } catch (error) {
      console.error("Error fetching payment stats:", error);
      res.status(500).json({ message: "Failed to fetch payment stats" });
    }
  });

  // ===== ACTIVITY LOGS =====
  app.get("/api/loans/:id/change-history", isAuthenticated, async (req: any, res) => {
    try {
      const loanId = req.params.id;
      const results = await db
        .select({
          id: activityLogs.id,
          userId: activityLogs.userId,
          details: activityLogs.details,
          createdAt: activityLogs.createdAt,
          userName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        })
        .from(activityLogs)
        .leftJoin(users, eq(activityLogs.userId, users.id))
        .where(
          and(
            eq(activityLogs.entityId, loanId),
            eq(activityLogs.action, "update_loan_application"),
            eq(activityLogs.entityType, "loan")
          )
        )
        .orderBy(desc(activityLogs.createdAt))
        .limit(50);

      const changeLogs = results
        .map((log: any) => {
          let changes: any[] = [];
          let applicationId = "";
          try {
            const parsed = JSON.parse(log.details);
            changes = parsed.changes || [];
            applicationId = parsed.applicationId || "";
          } catch {
            // old format - not JSON
          }
          return {
            id: log.id,
            userId: log.userId,
            userName: log.userName || log.userId,
            changes,
            applicationId,
            createdAt: log.createdAt,
          };
        })
        .filter((log: any) => log.changes.length > 0);
      res.json(changeLogs);
    } catch (error) {
      console.error("Error fetching change history:", error);
      res.status(500).json({ message: "Failed to fetch change history" });
    }
  });

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

  // ===== LOAN CLASSIFICATION REPORT =====
  app.get("/api/reports/loan-classification", isAuthenticated, requirePageAccess("reports"), async (req, res) => {
    try {
      const data = await storage.getLoanClassificationReport();
      res.json(data);
    } catch (error) {
      console.error("Error fetching loan classification report:", error);
      res.status(500).json({ message: "Failed to fetch loan classification report" });
    }
  });

  app.get("/api/reports/financial-position", isAuthenticated, requirePageAccess("reports"), async (req, res) => {
    try {
      const { asOfDate } = req.query;
      if (!asOfDate) {
        return res.status(400).json({ message: "asOfDate is required" });
      }
      const dateStr = asOfDate as string;

      const allFundingSources = await db.select().from(fundingSourcesTable);
      const shareholderIds = new Set<string>();
      for (const fs of allFundingSources) {
        if (fs.name.toLowerCase().includes('shareholder')) {
          shareholderIds.add(fs.id);
        }
      }
      const isUnrestricted = (fsId: string | null): boolean => !fsId || shareholderIds.has(fsId);

      const allAccounts = await db.select().from(accounts).where(eq(accounts.isActive, true));
      const accIdToCode: Record<string, string> = {};
      const accIdToType: Record<string, string> = {};
      for (const acc of allAccounts) {
        accIdToCode[acc.id] = acc.accountCode;
        accIdToType[acc.id] = acc.accountType;
      }

      const journalBalSplit = await db
        .select({
          accountId: journalLines.accountId,
          fundingSourceId: sql<string>`COALESCE(${journalEntries.fundingSourceId}, 'none')`,
          totalDebit: sql<string>`COALESCE(SUM(CAST(${journalLines.debitAmount} AS numeric)), 0)`,
          totalCredit: sql<string>`COALESCE(SUM(CAST(${journalLines.creditAmount} AS numeric)), 0)`,
        })
        .from(journalLines)
        .innerJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
        .where(and(
          eq(journalEntries.isPosted, true),
          lte(journalEntries.entryDate, dateStr),
        ))
        .groupBy(journalLines.accountId, sql`COALESCE(${journalEntries.fundingSourceId}, 'none')`);

      type RU = { restricted: number; unrestricted: number; total: number };
      const ru = (): RU => ({ restricted: 0, unrestricted: 0, total: 0 });

      const accBalSplit: Record<string, { restricted: { debit: number; credit: number }; unrestricted: { debit: number; credit: number } }> = {};
      for (const jb of journalBalSplit) {
        if (!accBalSplit[jb.accountId]) {
          accBalSplit[jb.accountId] = {
            restricted: { debit: 0, credit: 0 },
            unrestricted: { debit: 0, credit: 0 },
          };
        }
        const d = parseFloat(jb.totalDebit || "0");
        const c = parseFloat(jb.totalCredit || "0");
        const fsId = jb.fundingSourceId === 'none' ? null : jb.fundingSourceId;
        const bucket = isUnrestricted(fsId) ? 'unrestricted' : 'restricted';
        accBalSplit[jb.accountId][bucket].debit += d;
        accBalSplit[jb.accountId][bucket].credit += c;
      }

      const getBalanceSplit = (acc: any): RU => {
        const opening = Number(acc.openingBalance) || 0;
        const bs = accBalSplit[acc.id] || { restricted: { debit: 0, credit: 0 }, unrestricted: { debit: 0, credit: 0 } };
        const calcBal = (bucket: { debit: number; credit: number }, addOpening: boolean): number => {
          const op = addOpening ? opening : 0;
          if (getMainAccountType(acc.accountType) === 'asset' || getMainAccountType(acc.accountType) === 'expense') {
            return op + bucket.debit - bucket.credit;
          }
          return op + bucket.credit - bucket.debit;
        };
        const unrestricted = calcBal(bs.unrestricted, true);
        const restricted = calcBal(bs.restricted, false);
        return { restricted, unrestricted, total: restricted + unrestricted };
      };

      const sumByPrefixSplit = (...prefixes: string[]): RU => {
        const r = ru();
        for (const acc of allAccounts) {
          for (const p of prefixes) {
            if (acc.accountCode.startsWith(p)) {
              const s = getBalanceSplit(acc);
              r.restricted += s.restricted;
              r.unrestricted += s.unrestricted;
              r.total += s.total;
              break;
            }
          }
        }
        return r;
      };

      const sumCodesSplit = (...codes: string[]): RU => {
        const r = ru();
        for (const code of codes) {
          const acc = allAccounts.find(a => a.accountCode === code);
          if (acc) {
            const s = getBalanceSplit(acc);
            r.restricted += s.restricted;
            r.unrestricted += s.unrestricted;
            r.total += s.total;
          }
        }
        return r;
      };

      const addRU = (...items: RU[]): RU => ({
        restricted: items.reduce((s, i) => s + i.restricted, 0),
        unrestricted: items.reduce((s, i) => s + i.unrestricted, 0),
        total: items.reduce((s, i) => s + i.total, 0),
      });

      // Note 1.3 - Cash and Cash Equivalents
      const note1_3 = addRU(sumByPrefixSplit('101'), sumByPrefixSplit('102'));

      // Note 2.3 - Current Portion of Finance Receivables (split by loan funding source)
      const currentLoansSplit = await db.execute(sql`
        SELECT
          l.funding_source_id,
          COALESCE(SUM(COALESCE(l.principle_amount::numeric, 0)), 0) as amount
        FROM loans l
        LEFT JOIN disbursements d ON d.loan_id = l.id
        WHERE l.status IN ('disbursed', 'active')
          AND COALESCE(l.financing_duration_months, 0) <= 12
          AND (d.disbursement_date IS NULL OR d.disbursement_date <= ${dateStr})
        GROUP BY l.funding_source_id
      `);
      const note2_3 = ru();
      for (const row of currentLoansSplit.rows as any[]) {
        const amt = parseFloat(row.amount) || 0;
        if (isUnrestricted(row.funding_source_id)) note2_3.unrestricted += amt;
        else note2_3.restricted += amt;
      }
      note2_3.total = note2_3.restricted + note2_3.unrestricted;

      // Note 3.4 - Prepaid Expenses
      const note3_4 = sumCodesSplit('13100');

      // 1.1.4 Receivables (split by loan funding source)
      const receivablesSplit = await db.execute(sql`
        SELECT
          l.funding_source_id,
          COALESCE(SUM(COALESCE(l.total_receivable::numeric, 0) - COALESCE(l.principle_amount::numeric, 0)), 0) as total_margin
        FROM loans l
        LEFT JOIN disbursements d ON d.loan_id = l.id
        WHERE l.status IN ('disbursed', 'active')
          AND (d.disbursement_date IS NULL OR d.disbursement_date <= ${dateStr})
        GROUP BY l.funding_source_id
      `);
      const marginSplit = { restricted: 0, unrestricted: 0 };
      for (const row of receivablesSplit.rows as any[]) {
        const amt = parseFloat(row.total_margin) || 0;
        if (isUnrestricted(row.funding_source_id)) marginSplit.unrestricted += amt;
        else marginSplit.restricted += amt;
      }

      const marginCollSplit = await db.execute(sql`
        SELECT
          l.funding_source_id,
          COALESCE(SUM(COALESCE(i.margin_amount::numeric, 0)), 0) as collected
        FROM installments i
        JOIN loans l ON i.loan_id = l.id
        WHERE i.is_paid = true
          AND i.payment_date <= ${dateStr}
          AND l.status IN ('disbursed', 'active')
        GROUP BY l.funding_source_id
      `);
      const marginCollected = { restricted: 0, unrestricted: 0 };
      for (const row of marginCollSplit.rows as any[]) {
        const amt = parseFloat(row.collected) || 0;
        if (isUnrestricted(row.funding_source_id)) marginCollected.unrestricted += amt;
        else marginCollected.restricted += amt;
      }
      const acc14000 = sumCodesSplit('14000');
      const receivablesRU: RU = {
        restricted: (marginSplit.restricted - marginCollected.restricted) + acc14000.restricted,
        unrestricted: (marginSplit.unrestricted - marginCollected.unrestricted) + acc14000.unrestricted,
        total: 0,
      };
      receivablesRU.total = receivablesRU.restricted + receivablesRU.unrestricted;

      // 1.1.5 Inventory
      const inventoryRU = sumByPrefixSplit('120');

      // Note 4.5 - Net Tangible Fixed Assets
      const note4_5 = addRU(
        sumCodesSplit('17101', '17201', '17301', '17501'),
        sumCodesSplit('17102', '17202', '17302', '17502')
      );

      // Note 5.6 - Net Intangible Assets
      const note5_6 = addRU(sumCodesSplit('15200', '15100', '15300'));

      // Note 6.3 - Long-Term Finance Receivables (split by loan funding source)
      const longLoansSplit = await db.execute(sql`
        SELECT
          l.funding_source_id,
          COALESCE(SUM(COALESCE(l.principle_amount::numeric, 0)), 0) as amount
        FROM loans l
        LEFT JOIN disbursements d ON d.loan_id = l.id
        WHERE l.status IN ('disbursed', 'active')
          AND COALESCE(l.financing_duration_months, 0) > 12
          AND (d.disbursement_date IS NULL OR d.disbursement_date <= ${dateStr})
        GROUP BY l.funding_source_id
      `);
      const note6_3 = ru();
      for (const row of longLoansSplit.rows as any[]) {
        const amt = parseFloat(row.amount) || 0;
        if (isUnrestricted(row.funding_source_id)) note6_3.unrestricted += amt;
        else note6_3.restricted += amt;
      }
      note6_3.total = note6_3.restricted + note6_3.unrestricted;

      // 1.2.4 Deferred Tax Asset - P&L * 20%
      let totalIncomeRU = ru();
      let totalExpenseRU = ru();
      for (const acc of allAccounts) {
        const s = getBalanceSplit(acc);
        if (getMainAccountType(acc.accountType) === 'income') {
          totalIncomeRU.restricted += Math.abs(s.restricted);
          totalIncomeRU.unrestricted += Math.abs(s.unrestricted);
          totalIncomeRU.total += Math.abs(s.total);
        } else if (getMainAccountType(acc.accountType) === 'expense') {
          totalExpenseRU.restricted += Math.abs(s.restricted);
          totalExpenseRU.unrestricted += Math.abs(s.unrestricted);
          totalExpenseRU.total += Math.abs(s.total);
        }
      }
      const profitLossTotal = totalIncomeRU.total - totalExpenseRU.total;
      const deferredTaxAssetRU: RU = {
        restricted: 0,
        unrestricted: profitLossTotal < 0 ? Math.abs(profitLossTotal) * 0.20 : 0,
        total: profitLossTotal < 0 ? Math.abs(profitLossTotal) * 0.20 : 0,
      };

      // Totals - Assets
      const totalCurrentAssets = addRU(note1_3, note2_3, note3_4, receivablesRU, inventoryRU);
      const totalNonCurrentAssets = addRU(note4_5, note5_6, note6_3, deferredTaxAssetRU);
      const totalAssets = addRU(totalCurrentAssets, totalNonCurrentAssets);

      // 3.1.1 Share Capital
      const shareCapitalRU = sumCodesSplit('30100');

      // Note 7.5 - Retained Earnings
      const dividendPaidRU = sumCodesSplit('30400');
      const retainedEarningsRU: RU = {
        restricted: (totalIncomeRU.restricted - totalExpenseRU.restricted) - Math.abs(dividendPaidRU.restricted),
        unrestricted: (totalIncomeRU.unrestricted - totalExpenseRU.unrestricted) - Math.abs(dividendPaidRU.unrestricted),
        total: 0,
      };
      retainedEarningsRU.total = retainedEarningsRU.restricted + retainedEarningsRU.unrestricted;

      const revaluationReserveRU = ru();
      const totalEquityRU = addRU(shareCapitalRU, retainedEarningsRU, revaluationReserveRU);

      // Note 8.5 - Payables
      const tradePayablesRU = sumCodesSplit('20100');
      const taxPayablesRU = sumByPrefixSplit('21');
      const accruedSalRU = ru();
      for (const acc of allAccounts) {
        const code = parseInt(acc.accountCode);
        if (!isNaN(code) && code >= 20150 && code < 20800) {
          const s = getBalanceSplit(acc);
          accruedSalRU.restricted += Math.abs(s.restricted);
          accruedSalRU.unrestricted += Math.abs(s.unrestricted);
          accruedSalRU.total += Math.abs(s.total);
        }
      }
      const absRU = (r: RU): RU => ({ restricted: Math.abs(r.restricted), unrestricted: Math.abs(r.unrestricted), total: Math.abs(r.total) });
      const note8_5 = addRU(absRU(tradePayablesRU), absRU(taxPayablesRU), accruedSalRU);

      const currentFinPayRU = ru();
      const totalCurrentLiabRU = addRU(note8_5, currentFinPayRU);

      const note9_5 = ru();
      const nonCurrentFinPayRU = sumCodesSplit('20121');
      const absNonCurrentFinPayRU = absRU(nonCurrentFinPayRU);
      const totalNonCurrentLiabRU = addRU(note9_5, absNonCurrentFinPayRU);

      const totalLiabRU = addRU(totalCurrentLiabRU, totalNonCurrentLiabRU);
      const totalEquityAndLiabRU = addRU(totalEquityRU, totalLiabRU);

      const toSplit = (r: RU) => ({ restricted: r.restricted, unrestricted: r.unrestricted, total: r.total });

      res.json({
        assets: {
          current: {
            cashAndEquiv: toSplit(note1_3),
            currentFinanceReceivables: toSplit(note2_3),
            prepaidExpenses: toSplit(note3_4),
            receivables: toSplit(receivablesRU),
            inventory: toSplit(inventoryRU),
            total: toSplit(totalCurrentAssets),
          },
          nonCurrent: {
            propertyVehiclesEquip: toSplit(note4_5),
            intangibleAssets: toSplit(note5_6),
            longTermFinanceReceivables: toSplit(note6_3),
            deferredTaxAsset: toSplit(deferredTaxAssetRU),
            total: toSplit(totalNonCurrentAssets),
          },
          total: toSplit(totalAssets),
        },
        equity: {
          shareCapital: toSplit(shareCapitalRU),
          retainedEarnings: toSplit(retainedEarningsRU),
          revaluationReserve: toSplit(revaluationReserveRU),
          total: toSplit(totalEquityRU),
        },
        liabilities: {
          current: {
            payables: toSplit(note8_5),
            currentFinancePayables: toSplit(currentFinPayRU),
            total: toSplit(totalCurrentLiabRU),
          },
          nonCurrent: {
            nonCurrentLiabilities: toSplit(note9_5),
            nonCurrentFinancePayables: toSplit(absNonCurrentFinPayRU),
            total: toSplit(totalNonCurrentLiabRU),
          },
          total: toSplit(totalLiabRU),
        },
        totalEquityAndLiabilities: toSplit(totalEquityAndLiabRU),
      });
    } catch (error) {
      console.error("Error fetching financial position:", error);
      res.status(500).json({ message: "Failed to fetch financial position" });
    }
  });

  app.get("/api/reports/dab-notes-financial-statements", isAuthenticated, requirePageAccess("reports"), async (req, res) => {
    try {
      const asOfDate = req.query.asOfDate as string | undefined;
      const data = await storage.getDABNotesToFinancialStatements(asOfDate);
      res.json(data);
    } catch (error) {
      console.error("Error fetching DAB notes to financial statements:", error);
      res.status(500).json({ message: "Failed to fetch DAB notes to financial statements" });
    }
  });

  app.get("/api/reports/changes-in-equity", isAuthenticated, requirePageAccess("reports"), async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const endDateStr = (endDate as string) || new Date().toISOString().split("T")[0];
      const startDateStr = (startDate as string) || `${new Date().getFullYear()}-01-01`;

      const allAccounts = await db.select().from(accounts).where(eq(accounts.isActive, true));

      const journalBalancesEnd = await db
        .select({
          accountId: journalLines.accountId,
          totalDebit: sql<string>`COALESCE(SUM(CAST(${journalLines.debitAmount} AS numeric)), 0)`,
          totalCredit: sql<string>`COALESCE(SUM(CAST(${journalLines.creditAmount} AS numeric)), 0)`,
        })
        .from(journalLines)
        .innerJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
        .where(and(
          eq(journalEntries.isPosted, true),
          lte(journalEntries.entryDate, endDateStr),
        ))
        .groupBy(journalLines.accountId);

      const journalBalancesBeforeStart = await db
        .select({
          accountId: journalLines.accountId,
          totalDebit: sql<string>`COALESCE(SUM(CAST(${journalLines.debitAmount} AS numeric)), 0)`,
          totalCredit: sql<string>`COALESCE(SUM(CAST(${journalLines.creditAmount} AS numeric)), 0)`,
        })
        .from(journalLines)
        .innerJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
        .where(and(
          eq(journalEntries.isPosted, true),
          sql`${journalEntries.entryDate} < ${startDateStr}`,
        ))
        .groupBy(journalLines.accountId);

      const buildBalMap = (rows: any[]): Record<string, { debit: number; credit: number }> => {
        const m: Record<string, { debit: number; credit: number }> = {};
        for (const jb of rows) {
          m[jb.accountId] = {
            debit: parseFloat(jb.totalDebit || "0"),
            credit: parseFloat(jb.totalCredit || "0"),
          };
        }
        return m;
      };

      const jBalMapEnd = buildBalMap(journalBalancesEnd);
      const jBalMapOpen = buildBalMap(journalBalancesBeforeStart);

      const calcBalance = (acc: any, jMap: Record<string, { debit: number; credit: number }>, includeOpening: boolean): number => {
        const opening = includeOpening ? (Number(acc.openingBalance) || 0) : 0;
        const jb = jMap[acc.id] || { debit: 0, credit: 0 };
        if (getMainAccountType(acc.accountType) === 'asset' || getMainAccountType(acc.accountType) === 'expense') {
          return opening + jb.debit - jb.credit;
        }
        return opening + jb.credit - jb.debit;
      };

      const getOpeningBalance = (acc: any): number => calcBalance(acc, jBalMapOpen, true);
      const getClosingBalance = (acc: any): number => calcBalance(acc, jBalMapEnd, true);
      const getPeriodMovement = (acc: any): number => getClosingBalance(acc) - getOpeningBalance(acc);

      const sumByPrefixOpening = (prefix: string): number => {
        let total = 0;
        for (const acc of allAccounts) {
          if (acc.accountCode.startsWith(prefix)) total += getOpeningBalance(acc);
        }
        return total;
      };

      const sumByPrefixClosing = (prefix: string): number => {
        let total = 0;
        for (const acc of allAccounts) {
          if (acc.accountCode.startsWith(prefix)) total += getClosingBalance(acc);
        }
        return total;
      };

      const openingShareCapital = sumByPrefixOpening('301');

      const incomeAccts = allAccounts.filter(a => getMainAccountType(a.accountType) === 'income');
      const expenseAccts = allAccounts.filter(a => getMainAccountType(a.accountType) === 'expense');
      const totalIncome = incomeAccts.reduce((s, a) => s + getPeriodMovement(a), 0);
      const totalExpenses = expenseAccts.reduce((s, a) => s + getPeriodMovement(a), 0);
      const netProfitLoss = totalIncome - totalExpenses;

      const dividendAccEnd = allAccounts.find(a => a.accountCode === '30400');
      const dividendPaid = dividendAccEnd ? Math.abs(getPeriodMovement(dividendAccEnd)) : 0;

      const ociRevaluation = 0;

      const priorPeriodErrors = 0;

      const closingShareCapital = openingShareCapital - dividendPaid;
      const closingRetainedEarnings = priorPeriodErrors + netProfitLoss;
      const closingRevaluationReserve = ociRevaluation;
      const closingTotalEquity = closingShareCapital + closingRetainedEarnings + closingRevaluationReserve;

      res.json({
        lines: [
          {
            lineCode: 1,
            particular: "Opening Balance",
            shareCapital: openingShareCapital,
            retainedEarnings: null,
            revaluationReserve: null,
            totalEquity: openingShareCapital,
            inCell: "Share Capital",
            source: "Statement of Financial Position 3.1.1",
          },
          {
            lineCode: 2,
            particular: "Adjustment for Prior Periods Errors",
            shareCapital: null,
            retainedEarnings: priorPeriodErrors,
            revaluationReserve: null,
            totalEquity: priorPeriodErrors,
            inCell: "Retained Earnings",
            source: "Note to Financial Statement 7.2",
          },
          {
            lineCode: 3,
            particular: "Net Profit / Loss for the Month",
            shareCapital: null,
            retainedEarnings: netProfitLoss,
            revaluationReserve: null,
            totalEquity: netProfitLoss,
            inCell: "Retained Earnings",
            source: "Profit and Loss 10",
          },
          {
            lineCode: 4,
            particular: "Dividends Paid",
            shareCapital: -dividendPaid,
            retainedEarnings: null,
            revaluationReserve: null,
            totalEquity: -dividendPaid,
            inCell: "Share Capital",
            source: "Balance of 30400",
          },
          {
            lineCode: 5,
            particular: "Revaluation Gain on PPE (Net of Tax)",
            shareCapital: null,
            retainedEarnings: null,
            revaluationReserve: ociRevaluation,
            totalEquity: ociRevaluation,
            inCell: "Revaluation Reserve",
            source: "Profit and Loss 9.3",
          },
          {
            lineCode: 6,
            particular: "Transfer of Revaluation Surplus to Retained Earnings (Depreciation Adjustment)",
            shareCapital: null,
            retainedEarnings: null,
            revaluationReserve: null,
            totalEquity: 0,
            inCell: "Not Used",
            source: "",
          },
          {
            lineCode: 7,
            particular: "Closing Balance",
            shareCapital: closingShareCapital,
            retainedEarnings: closingRetainedEarnings,
            revaluationReserve: closingRevaluationReserve,
            totalEquity: closingTotalEquity,
            isTotal: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching changes in equity:", error);
      res.status(500).json({ message: "Failed to fetch changes in equity" });
    }
  });

  // ===== REPORTS =====
  app.get("/api/reports", isAuthenticated, requirePageAccess("reports"), async (req, res) => {
    try {
      const period = req.query.period as string || "6months";
      const data = await storage.getReportData(period);
      res.json(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      res.status(500).json({ message: "Failed to fetch report data" });
    }
  });

  app.get("/api/reports/export", isAuthenticated, requirePageAccess("reports"), async (req, res) => {
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
  app.get("/api/reports/par-analysis", isAuthenticated, requirePageAccess(["reports", "par-report"]), async (req, res) => {
    try {
      const startDate = typeof req.query.startDate === "string" && req.query.startDate ? req.query.startDate : undefined;
      const endDate = typeof req.query.endDate === "string" && req.query.endDate ? req.query.endDate : undefined;
      const isValidDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));
      if (startDate && !isValidDate(startDate)) {
        return res.status(400).json({ message: "Invalid startDate. Expected YYYY-MM-DD." });
      }
      if (endDate && !isValidDate(endDate)) {
        return res.status(400).json({ message: "Invalid endDate. Expected YYYY-MM-DD." });
      }
      if (startDate && endDate && startDate > endDate) {
        return res.status(400).json({ message: "startDate must be on or before endDate." });
      }
      const data = await storage.getParAnalysis(startDate, endDate);
      res.json(data);
    } catch (error) {
      console.error("Error fetching PAR analysis:", error);
      res.status(500).json({ message: "Failed to fetch PAR analysis" });
    }
  });

  app.get("/api/reports/par-by-branch", isAuthenticated, requirePageAccess(["reports", "par-report"]), async (req, res) => {
    try {
      const data = await storage.getParByBranch();
      res.json(data);
    } catch (error) {
      console.error("Error fetching PAR by branch:", error);
      res.status(500).json({ message: "Failed to fetch PAR by branch" });
    }
  });

  app.get("/api/reports/par-by-officer", isAuthenticated, requirePageAccess(["reports", "par-report"]), async (req, res) => {
    try {
      const data = await storage.getParByOfficer();
      res.json(data);
    } catch (error) {
      console.error("Error fetching PAR by officer:", error);
      res.status(500).json({ message: "Failed to fetch PAR by officer" });
    }
  });

  app.get("/api/reports/par-by-product", isAuthenticated, requirePageAccess(["reports", "par-report"]), async (req, res) => {
    try {
      const data = await storage.getParByProduct();
      res.json(data);
    } catch (error) {
      console.error("Error fetching PAR by product:", error);
      res.status(500).json({ message: "Failed to fetch PAR by product" });
    }
  });

  app.get("/api/reports/aging", isAuthenticated, requirePageAccess(["reports", "par-report"]), async (req, res) => {
    try {
      const data = await storage.getAgingReport();
      res.json(data);
    } catch (error) {
      console.error("Error fetching aging report:", error);
      res.status(500).json({ message: "Failed to fetch aging report" });
    }
  });

  // PAR Loans Detail Endpoints
  app.get("/api/reports/par-loans/category/:categoryId", isAuthenticated, requirePageAccess(["reports", "par-report"]), async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const loans = await storage.getLoansByParCategory(categoryId);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching PAR loans by category:", error);
      res.status(500).json({ message: "Failed to fetch PAR loans by category" });
    }
  });

  app.get("/api/reports/par-loans/branch/:branchName", isAuthenticated, requirePageAccess(["reports", "par-report"]), async (req, res) => {
    try {
      const branchName = decodeURIComponent(req.params.branchName);
      const loans = await storage.getLoansByBranch(branchName);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching PAR loans by branch:", error);
      res.status(500).json({ message: "Failed to fetch PAR loans by branch" });
    }
  });

  app.get("/api/reports/par-loans/officer/:officerName", isAuthenticated, requirePageAccess(["reports", "par-report"]), async (req, res) => {
    try {
      const officerName = decodeURIComponent(req.params.officerName);
      const loans = await storage.getLoansByOfficer(officerName);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching PAR loans by officer:", error);
      res.status(500).json({ message: "Failed to fetch PAR loans by officer" });
    }
  });

  app.get("/api/reports/par-loans/product/:productName", isAuthenticated, requirePageAccess(["reports", "par-report"]), async (req, res) => {
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
      const { username, password, firstName, lastName, email, role, financeOfficerId, branchId } = req.body;
      
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

      if (email) {
        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail) {
          return res.status(400).json({ message: `Email "${email}" is already used by another user` });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email: email || null,
        branchId: branchId || null,
        // Admin-created accounts must change their password on first login.
        mustChangePassword: true,
        passwordChangedAt: new Date(),
      });

      await storage.setUserRole({ userId: user.id, role: role || "user" });

      await storage.applyRolePermissionsToUser(role || "user", user.id, req.session.userId);

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
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error?.code === '23505' && error?.constraint?.includes('email')) {
        return res.status(400).json({ message: `Email is already used by another user` });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Update user (admin only)
  app.patch("/api/admin/users/:id", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { username, password, firstName, lastName, email, role, financeOfficerId, branchId } = req.body;
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
      if (branchId !== undefined) updateData.branchId = branchId || null;
      // Password reset by an admin — handled separately so we record history & force-change.
      let adminPasswordToSet: string | null = null;
      if (password) {
        const pwCheck = validatePassword(password);
        if (!pwCheck.ok) {
          return res.status(400).json({ message: pwCheck.message });
        }
        adminPasswordToSet = await bcrypt.hash(password, 10);
      }

      if (Object.keys(updateData).length > 0) {
        await storage.updateUser(userId, updateData);
      }
      if (adminPasswordToSet) {
        await storage.adminSetUserPassword(userId, adminPasswordToSet, true);
      }

      if (role) {
        const currentRole = await storage.getUserRole(userId);
        await storage.updateUserRole(userId, role);
        if (currentRole?.role !== role) {
          await storage.applyRolePermissionsToUser(role, userId, req.session.userId);
        }
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

  // Toggle user active status
  app.patch("/api/admin/users/:id/status", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const userId = req.params.id;
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        return res.status(400).json({ message: "isActive must be a boolean value" });
      }

      if (userId === req.session.userId) {
        return res.status(400).json({ message: "Cannot change your own account status" });
      }

      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await storage.updateUser(userId, { isActive });
      await logActivity(req, isActive ? "activate_user" : "deactivate_user", "user", userId, `${isActive ? "Activated" : "Deactivated"} user: ${user.username}`);

      res.json({ message: `User ${isActive ? "activated" : "deactivated"} successfully` });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Failed to update user status" });
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

  // Role Page Permissions
  app.get("/api/role-permissions/:roleValue", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const permissions = await storage.getRolePagePermissions(req.params.roleValue);
      const permissionMap: Record<string, boolean> = {};
      permissions.forEach(p => {
        permissionMap[p.pageName] = p.canAccess;
      });
      res.json({ permissions: permissionMap });
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      res.status(500).json({ message: "Failed to fetch role permissions" });
    }
  });

  app.get("/api/all-role-permissions", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const allPerms = await storage.getAllRolePagePermissions();
      const grouped: Record<string, Record<string, boolean>> = {};
      allPerms.forEach(p => {
        if (!grouped[p.roleValue]) grouped[p.roleValue] = {};
        grouped[p.roleValue][p.pageName] = p.canAccess;
      });
      res.json(grouped);
    } catch (error) {
      console.error("Error fetching all role permissions:", error);
      res.status(500).json({ message: "Failed to fetch all role permissions" });
    }
  });

  app.post("/api/role-permissions", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { roleValue, pageName, canAccess } = req.body;
      if (!roleValue || !pageName || canAccess === undefined) {
        return res.status(400).json({ message: "roleValue, pageName, and canAccess are required" });
      }
      await storage.setRolePagePermission(roleValue, pageName, canAccess);
      await logActivity(req, "update_role_permission", "role_permission", roleValue, `Updated role permission for page ${pageName}: ${canAccess ? 'granted' : 'revoked'}`);
      res.json({ message: "Role permission updated successfully" });
    } catch (error) {
      console.error("Error updating role permission:", error);
      res.status(500).json({ message: "Failed to update role permission" });
    }
  });

  app.post("/api/apply-role-permissions/:userId", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { userId } = req.params;
      const { roleValue } = req.body;
      if (!roleValue) {
        return res.status(400).json({ message: "roleValue is required" });
      }
      await storage.applyRolePermissionsToUser(roleValue, userId, req.session.userId);
      await logActivity(req, "apply_role_permissions", "permission", userId, `Applied role permissions from ${roleValue}`);
      res.json({ message: "Role permissions applied successfully" });
    } catch (error) {
      console.error("Error applying role permissions:", error);
      res.status(500).json({ message: "Failed to apply role permissions" });
    }
  });

  // Get current user's permissions
  app.get("/api/my-permissions", isAuthenticated, async (req: any, res) => {
    try {
      const permissions = await storage.getPagePermissions(req.session.userId);
      const userRole = await storage.getUserRole(req.session.userId);
      const roleValue = userRole?.role || "user";
      
      const isAdminRole = await hasRole(req.session.userId, ["admin"]);
      
      if (isAdminRole) {
        const allPages = storage.getAllPages();
        const fullAccess = allPages.reduce((acc, page) => {
          acc[page] = true;
          return acc;
        }, {} as Record<string, boolean>);
        return res.json({ role: roleValue, permissions: fullAccess });
      }
      
      const permissionMap: Record<string, boolean> = {};
      permissions.forEach(p => {
        permissionMap[p.pageName] = p.canAccess;
      });
      
      res.json({ role: roleValue, permissions: permissionMap });
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

  app.post("/api/accounts", isAuthenticated, async (req: any, res) => {
    try {
      const account = await storage.createAccount(req.body);
      await logActivity(req, "create", "account", account.id, `Created account: ${account.accountCode} - ${account.accountName}`);
      res.status(201).json(account);
    } catch (error: any) {
      console.error("Error creating account:", error);
      if (error?.code === "23505") {
        return res.status(400).json({ message: `Account code "${req.body.accountCode}" already exists` });
      }
      if (error?.code === "23503") {
        return res.status(400).json({ message: "Invalid parent account selected" });
      }
      res.status(500).json({ message: error?.message || "Failed to create account" });
    }
  });

  app.patch("/api/accounts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const accountId = req.params.id;

      if (req.body.parentId !== undefined) {
        if (req.body.parentId === accountId) {
          return res.status(400).json({ message: "An account cannot be its own parent" });
        }

        if (req.body.parentId) {
          const allAccounts = await db.select({ id: accounts.id, parentId: accounts.parentId, accountType: accounts.accountType }).from(accounts);

          const currentAccount = allAccounts.find(a => a.id === accountId);
          const parentAccount = allAccounts.find(a => a.id === req.body.parentId);
          if (currentAccount && parentAccount && getMainAccountType(currentAccount.accountType) !== getMainAccountType(parentAccount.accountType)) {
            return res.status(400).json({ message: "Accounts can only be moved within the same main type (Asset, Liability, Equity, Income, Expense)" });
          }

          const descendants = new Set<string>();
          const collectDescendants = (id: string) => {
            for (const a of allAccounts) {
              if (a.parentId === id && !descendants.has(a.id)) {
                descendants.add(a.id);
                collectDescendants(a.id);
              }
            }
          };
          collectDescendants(accountId);
          if (descendants.has(req.body.parentId)) {
            return res.status(400).json({ message: "Cannot move an account under its own child or descendant" });
          }
        }
      }

      const account = await storage.updateAccount(accountId, req.body);
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

  app.post("/api/accounts/recalculate-balances", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const result = await storage.recalculateAllAccountBalances();
      await logActivity(req, "recalculate_balances", "accounts", null, `Recalculated all account balances from journal entries. ${result.updated} accounts updated.`);
      res.json(result);
    } catch (error: any) {
      console.error("Error recalculating balances:", error);
      res.status(500).json({ message: error.message || "Failed to recalculate balances" });
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

  app.post("/api/fiscal-periods", isAuthenticated, requirePageAccess("accounting"), async (req: any, res) => {
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
      const assetAccounts = accounts.filter(a => getMainAccountType(a.accountType) === "asset");
      const liabilityAccounts = accounts.filter(a => getMainAccountType(a.accountType) === "liability");
      const equityAccounts = accounts.filter(a => getMainAccountType(a.accountType) === "equity");
      const incomeAccounts = accounts.filter(a => getMainAccountType(a.accountType) === "income");
      const expenseAccounts = accounts.filter(a => getMainAccountType(a.accountType) === "expense");
      
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
      
      // Helper: find top-level parent for an account
      function findTopParent(acc: any, allAccounts: any[]): any {
        if (!acc.parentId) return acc;
        const parent = allAccounts.find(a => a.id === acc.parentId);
        if (!parent) return acc;
        return findTopParent(parent, allAccounts);
      }

      // Revenue by source - from actual income accounts grouped by top-level parent
      const incomeGroupMap = new Map<string, { name: string; amount: number }>();
      for (const acc of incomeAccounts) {
        const bal = Number(acc.currentBalance || 0);
        if (bal === 0) continue;
        const hasChildren = incomeAccounts.some(c => c.parentId === acc.id);
        if (hasChildren) continue;
        const topParent = findTopParent(acc, incomeAccounts);
        const key = topParent.id;
        const existing = incomeGroupMap.get(key);
        if (existing) {
          existing.amount += bal;
        } else {
          incomeGroupMap.set(key, { name: topParent.accountName, amount: bal });
        }
      }
      const incomeGroupArr = Array.from(incomeGroupMap.values())
        .filter(item => item.amount > 0)
        .sort((a, b) => b.amount - a.amount);
      const actualIncomeTotal = incomeGroupArr.reduce((sum, item) => sum + item.amount, 0);
      const revenueBySource = incomeGroupArr.map(item => ({
        source: item.name,
        amount: Math.round(item.amount),
        percentage: actualIncomeTotal > 0 ? Math.round((item.amount / actualIncomeTotal) * 1000) / 10 : 0,
      }));
      
      // Expense breakdown by category - from actual expense accounts grouped by top-level parent
      const expenseGroupMap = new Map<string, { name: string; amount: number }>();
      for (const acc of expenseAccounts) {
        const bal = Math.abs(Number(acc.currentBalance || 0));
        if (bal === 0) continue;
        const hasChildren = expenseAccounts.some(c => c.parentId === acc.id);
        if (hasChildren) continue;
        const topParent = findTopParent(acc, expenseAccounts);
        const key = topParent.id;
        const existing = expenseGroupMap.get(key);
        if (existing) {
          existing.amount += bal;
        } else {
          expenseGroupMap.set(key, { name: topParent.accountName, amount: bal });
        }
      }
      const expenseGroupArr = Array.from(expenseGroupMap.values())
        .filter(item => item.amount > 0)
        .sort((a, b) => b.amount - a.amount);
      const actualExpenseTotal = expenseGroupArr.reduce((sum, item) => sum + item.amount, 0);
      const expenseCategories = expenseGroupArr.map(item => ({
        category: item.name,
        amount: Math.round(item.amount),
        percentage: actualExpenseTotal > 0 ? Math.round((item.amount / actualExpenseTotal) * 1000) / 10 : 0,
        trend: 0,
      }));
      
      // Expense by department - derived from top-level expense groups
      const expenseByDepartment = expenseGroupArr
        .slice(0, 8)
        .map(item => ({
          department: item.name,
          amount: Math.round(item.amount),
          percentage: actualExpenseTotal > 0 ? Math.round((item.amount / actualExpenseTotal) * 1000) / 10 : 0,
        }));
      
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
      
      // Journal entry stats
      const journalResult = await storage.getJournalEntries({ limit: 10000 });
      const journalEntries = journalResult.entries || [];
      const totalJournalEntries = journalEntries.length;
      const postedEntries = journalEntries.filter((e: any) => e.isPosted === true && e.isReversed !== true);
      const draftEntries = journalEntries.filter((e: any) => e.isPosted !== true && e.isReversed !== true);
      const reversedEntries = journalEntries.filter((e: any) => e.isReversed === true);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const entriesLast30d = journalEntries.filter((e: any) => new Date(e.entryDate) >= thirtyDaysAgo).length;
      
      const totalDebits = postedEntries.reduce((sum: number, e: any) => sum + Number(e.totalDebit || 0), 0);
      const totalCredits = postedEntries.reduce((sum: number, e: any) => sum + Number(e.totalCredit || 0), 0);
      const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

      // Account type distribution
      const activeAccounts = accounts.filter(a => a.isActive);
      const accountTypeDist = [
        { type: "asset", label: "Asset", count: assetAccounts.length, color: "#3b82f6" },
        { type: "expense", label: "Expense", count: expenseAccounts.length, color: "#f59e0b" },
        { type: "liability", label: "Liability", count: liabilityAccounts.length, color: "#10b981" },
        { type: "income", label: "Income", count: incomeAccounts.length, color: "#ef4444" },
        { type: "equity", label: "Equity", count: equityAccounts.length, color: "#6366f1" },
      ];
      const totalAccountsCount = accountTypeDist.reduce((s, a) => s + a.count, 0);
      const accountTypeDistWithPct = accountTypeDist.map(a => ({
        ...a,
        percentage: totalAccountsCount > 0 ? Math.round((a.count / totalAccountsCount) * 100) : 0,
      }));

      // Accounts with activity (non-zero balance)
      const accountsWithActivity = accounts.filter(a => Number(a.currentBalance || 0) !== 0).length;

      // Pending expenses (draft expense journal lines)
      const pendingExpenseEntries = draftEntries.filter((e: any) => {
        return e.referenceType === 'expense' || e.description?.toLowerCase().includes('expense');
      });
      
      // Recent journal entries (latest 6)
      const recentJournalEntries = journalEntries
        .sort((a: any, b: any) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
        .slice(0, 6)
        .map((e: any) => ({
          id: e.id,
          entryNumber: e.entryNumber,
          description: e.description,
          entryDate: e.entryDate,
          referenceType: e.referenceType || 'manual',
          totalDebit: Number(e.totalDebit || 0),
          totalCredit: Number(e.totalCredit || 0),
          isPosted: e.isPosted === true,
          isReversed: e.isReversed === true,
        }));

      // Top account balances (top 8 by absolute balance)
      const topAccountBalances = accounts
        .filter(a => Number(a.currentBalance || 0) !== 0)
        .sort((a, b) => Math.abs(Number(b.currentBalance || 0)) - Math.abs(Number(a.currentBalance || 0)))
        .slice(0, 8)
        .map(a => ({
          accountCode: a.accountCode,
          accountName: a.accountName,
          accountType: a.accountType,
          currentBalance: Number(a.currentBalance || 0),
        }));

      // Funding sources
      let fundingSourcesData: any[] = [];
      try {
        const sources = await storage.getFundingSources();
        fundingSourcesData = (sources || []).filter((s: any) => s.isActive !== false).map((s: any) => ({
          id: s.id,
          name: s.name,
          sourceType: s.sourceType,
          totalCommitted: Number(s.totalCommitted || 0),
          totalUtilized: Number(s.totalUtilized || 0),
          availableBalance: Number(s.availableBalance || 0),
        }));
      } catch (e) {}

      // Accounting equation check
      const equationDiff = totalAssets - totalLiabilities - totalEquity;
      const equationBalanced = Math.abs(equationDiff) < 0.01;

      // Income breakdown detail (leaf accounts)
      const incomeDetail = incomeAccounts
        .filter(a => Number(a.currentBalance || 0) !== 0 && !incomeAccounts.some(c => c.parentId === a.id))
        .sort((a, b) => Number(b.currentBalance || 0) - Number(a.currentBalance || 0))
        .map(a => ({
          name: a.accountName,
          amount: Number(a.currentBalance || 0),
          percentage: totalRevenue > 0 ? Math.round((Number(a.currentBalance || 0) / totalRevenue) * 100) : 0,
        }));

      // Expense breakdown detail (leaf accounts)
      const expenseDetail = expenseAccounts
        .filter(a => Math.abs(Number(a.currentBalance || 0)) > 0 && !expenseAccounts.some(c => c.parentId === a.id))
        .sort((a, b) => Math.abs(Number(b.currentBalance || 0)) - Math.abs(Number(a.currentBalance || 0)))
        .map(a => ({
          name: a.accountName,
          amount: Math.abs(Number(a.currentBalance || 0)),
          percentage: totalExpenses > 0 ? Math.round((Math.abs(Number(a.currentBalance || 0)) / totalExpenses) * 100) : 0,
        }));

      const postedRate = totalJournalEntries > 0 ? Math.round((postedEntries.length / totalJournalEntries) * 1000) / 10 : 0;

      // Accounting health checks
      const healthChecks = [
        { label: "Trial Balance", description: "Debits equal credits", passed: isBalanced },
        { label: "Accounting Equation", description: "Assets = Liabilities + Equity", passed: equationBalanced },
        { label: "Draft Entries", description: `${draftEntries.length} entries need posting`, passed: draftEntries.length === 0 },
        { label: "Pending Expenses", description: `${pendingExpenseEntries.length} awaiting approval`, passed: pendingExpenseEntries.length === 0 },
        { label: "Account Coverage", description: `${activeAccounts.length} active of ${accounts.length} total`, passed: activeAccounts.length === accounts.length },
      ];
      const healthScore = Math.round((healthChecks.filter(h => h.passed).length / healthChecks.length) * 100);

      const dashboardData = {
        totalAccounts: accounts.length,
        activeAccounts: activeAccounts.length,
        headerAccounts: accounts.filter(a => accounts.some(c => c.parentId === a.id)).length,
        totalAssets,
        totalLiabilities,
        totalEquity,
        totalRevenue,
        totalExpenses,
        netProfit,
        netProfitMargin,
        cashBalance,
        totalDebits,
        totalCredits,
        isBalanced,
        equationBalanced,
        equationDiff,
        journalEntryStats: {
          total: totalJournalEntries,
          posted: postedEntries.length,
          draft: draftEntries.length,
          reversed: reversedEntries.length,
          last30d: entriesLast30d,
          postedRate,
        },
        accountTypeDistribution: accountTypeDistWithPct,
        accountsWithActivity,
        recentJournalEntries,
        topAccountBalances,
        fundingSources: fundingSourcesData,
        incomeBreakdown: {
          totalRecorded: totalRevenue,
          records: incomeAccounts.filter(a => Number(a.currentBalance || 0) !== 0).length,
          avgPerRecord: incomeAccounts.filter(a => Number(a.currentBalance || 0) !== 0).length > 0 ? totalRevenue / incomeAccounts.filter(a => Number(a.currentBalance || 0) !== 0).length : 0,
          categories: incomeDetail.slice(0, 5),
        },
        expenseBreakdownDetail: {
          total: totalExpenses,
          records: expenseAccounts.filter(a => Math.abs(Number(a.currentBalance || 0)) > 0).length,
          pending: pendingExpenseEntries.length,
          categories: expenseDetail.slice(0, 5),
        },
        profitAndLoss: {
          revenue: totalRevenue,
          expenses: totalExpenses,
          netIncome: netProfit,
          profitMargin: netProfitMargin,
        },
        healthChecks,
        healthScore,
        revenueBySource,
        expenseCategories,
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
      const fundingSourceId = req.query.fundingSourceId as string | undefined;
      const result = await storage.getJournalEntries({
        search: search as string,
        startDate: startDate as string,
        endDate: endDate as string,
        isPosted: isPosted === 'true' ? true : isPosted === 'false' ? false : undefined,
        fundingSourceId: fundingSourceId && fundingSourceId !== "all" ? fundingSourceId : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
      });
      const allFundingSources = await storage.getFundingSources();
      const fsMap = new Map(allFundingSources.map((fs: any) => [fs.id, fs.name]));
      const enrichedEntries = result.entries.map((e: any) => ({
        ...e,
        fundingSourceName: e.fundingSourceId ? fsMap.get(e.fundingSourceId) || null : null,
      }));
      res.json({ ...result, entries: enrichedEntries });
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

  app.get("/api/management/dashboard", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const period = (req.query.period as string) || "monthly";
      if (!["monthly", "quarterly", "yearly"].includes(period)) {
        return res.status(400).json({ message: "Invalid period. Use monthly, quarterly, or yearly." });
      }
      const effectiveBranchId = await getEffectiveBranchId(req);
      const rawProduct = req.query.product;
      const productName = typeof rawProduct === "string" && rawProduct.trim() && rawProduct.length <= 255 ? rawProduct : null;
      const rawMonth = req.query.month;
      const monthParam = typeof rawMonth === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(rawMonth) ? rawMonth : null;
      const data = await storage.getManagementDashboard(period, effectiveBranchId, productName, monthParam);
      res.json(data);
    } catch (error) {
      console.error("Error fetching management dashboard:", error);
      res.status(500).json({ message: "Failed to fetch management dashboard" });
    }
  });

  app.get("/api/journal-entries/unbalanced", isAuthenticated, requireRole("manager", "admin"), async (req, res) => {
    try {
      const rows = await db.execute(sql`
        SELECT je.id, je.entry_number AS "entryNumber", je.entry_date AS "entryDate",
               je.description, je.is_posted AS "isPosted",
               COALESCE(SUM(CAST(jl.debit_amount AS numeric)), 0) AS "lineDebit",
               COALESCE(SUM(CAST(jl.credit_amount AS numeric)), 0) AS "lineCredit"
        FROM journal_entries je
        LEFT JOIN journal_lines jl ON jl.journal_entry_id = je.id
        GROUP BY je.id, je.entry_number, je.entry_date, je.description, je.is_posted
        HAVING ROUND(COALESCE(SUM(CAST(jl.debit_amount AS numeric)), 0) * 100) <> ROUND(COALESCE(SUM(CAST(jl.credit_amount AS numeric)), 0) * 100)
        ORDER BY je.entry_date DESC
      `);
      const entries = (rows.rows as any[]).map(r => ({
        ...r,
        difference: (Number(r.lineDebit) - Number(r.lineCredit)).toFixed(2),
      }));
      res.json(entries);
    } catch (error) {
      console.error("Error fetching unbalanced journal entries:", error);
      res.status(500).json({ message: "Failed to fetch unbalanced journal entries" });
    }
  });

  app.get("/api/journal-entries/:id", isAuthenticated, async (req, res) => {
    try {
      const entry = await storage.getJournalEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      let fundingSourceName = null;
      if (entry.fundingSourceId) {
        const fs = await storage.getFundingSource(entry.fundingSourceId);
        fundingSourceName = fs?.name || null;
      }
      res.json({ ...entry, fundingSourceName });
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
      
      // Validate Class required on expense account lines
      const lineAccountIds = Array.from(new Set(lines.map((l: any) => l.accountId)));
      const accountRows = await db.select().from(accounts).where(inArray(accounts.id, lineAccountIds));
      const accountTypeMap = new Map(accountRows.map(a => [a.id, a.accountType]));
      for (const line of lines) {
        const accType = accountTypeMap.get(line.accountId);
        if (accType && getMainAccountType(accType) === 'expense' && !line.classId) {
          return res.status(400).json({ message: "Class is required for expense account lines" });
        }
      }
      
      // Validate debit = credit
      const totalDebit = lines.reduce((sum: number, line: any) => sum + Number(line.debitAmount || 0), 0);
      const totalCredit = lines.reduce((sum: number, line: any) => sum + Number(line.creditAmount || 0), 0);
      
      if (Math.round(totalDebit * 100) !== Math.round(totalCredit * 100)) {
        return res.status(400).json({ message: "Total debits must equal total credits (to the exact cent)" });
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
      const { entryDate, description, reference, referenceType, fundingSourceId, lines } = req.body;
      
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
      
      // Validate Class required on expense account lines
      const lineAccountIds = Array.from(new Set(lines.map((l: any) => l.accountId).filter(Boolean)));
      if (lineAccountIds.length > 0) {
        const accountRows = await db.select().from(accounts).where(inArray(accounts.id, lineAccountIds));
        const accountTypeMap = new Map(accountRows.map(a => [a.id, a.accountType]));
        for (const line of lines) {
          const accType = accountTypeMap.get(line.accountId);
          if (accType && getMainAccountType(accType) === 'expense' && !line.classId) {
            return res.status(400).json({ message: "Class is required for expense account lines" });
          }
        }
      }
      
      // Calculate totals
      const totalDebit = lines.reduce((sum: number, l: any) => sum + Number(l.debitAmount || 0), 0);
      const totalCredit = lines.reduce((sum: number, l: any) => sum + Number(l.creditAmount || 0), 0);
      
      // Check balance
      if (Math.round(totalDebit * 100) !== Math.round(totalCredit * 100)) {
        return res.status(400).json({ message: "Debits must equal credits (to the exact cent)" });
      }
      
      // Update entry
      const updatedEntry = await storage.updateJournalEntry(id, {
        entryDate,
        description,
        reference: reference || null,
        referenceType: referenceType || null,
        fundingSourceId: fundingSourceId || null,
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

  app.post("/api/journal-entries/:id/post", isAuthenticated, requirePageAccess("journal-entries"), async (req: any, res) => {
    try {
      await storage.postJournalEntry(req.params.id, req.session.userId);
      await logActivity(req, "post", "journal_entry", req.params.id, "Posted journal entry");
      res.json({ message: "Journal entry posted successfully" });
    } catch (error) {
      console.error("Error posting journal entry:", error);
      res.status(500).json({ message: "Failed to post journal entry" });
    }
  });

  app.post("/api/journal-entries/:id/unpost", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      await storage.unpostJournalEntry(req.params.id);
      await logActivity(req, "unpost", "journal_entry", req.params.id, "Unposted journal entry");
      res.json({ message: "Journal entry unposted successfully" });
    } catch (error: any) {
      console.error("Error unposting journal entry:", error);
      res.status(500).json({ message: error.message || "Failed to unpost journal entry" });
    }
  });

  app.post("/api/journal-entries/:id/undo-reversal", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      await storage.undoReversalJournalEntry(req.params.id);
      await logActivity(req, "undo_reversal", "journal_entry", req.params.id, "Undid reversal of journal entry");
      res.json({ message: "Reversal undone successfully. The entry is now posted again." });
    } catch (error: any) {
      console.error("Error undoing reversal:", error);
      res.status(500).json({ message: error.message || "Failed to undo reversal" });
    }
  });

  app.post("/api/journal-entries/fix-empty-posted", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const result = await db.execute(sql`
        UPDATE journal_entries je
        SET is_posted = false, posted_by = null, posted_at = null
        WHERE je.is_posted = true
          AND je.is_reversed = false
          AND NOT EXISTS (
            SELECT 1 FROM journal_lines jl WHERE jl.journal_entry_id = je.id
          )
        RETURNING je.entry_number
      `);
      const fixed = (result.rows as any[]).map(r => r.entry_number);
      if (fixed.length > 0) {
        await logActivity(req, "fix", "journal_entry", "bulk", `Unposted ${fixed.length} empty entries: ${fixed.join(', ')}`);
      }
      res.json({ message: `Fixed ${fixed.length} entries`, entries: fixed });
    } catch (error) {
      console.error("Error fixing empty posted entries:", error);
      res.status(500).json({ message: "Failed to fix entries" });
    }
  });

  app.post("/api/journal-entries/reconcile-reversed-collections", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const reason = z.string().trim().min(3, "A reconciliation reason is required").max(500).parse(req.body?.reason);
      const journalEntryId = z.string().trim().min(1, "A journal entry is required").parse(req.body?.journalEntryId);
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await storage.reconcileReversedCollectionJournal(journalEntryId, userId, reason);
      await logActivity(
        req,
        "reconcile_reversed_collections",
        "journal_entry",
        journalEntryId,
        `Reconciled ${result.reconciledTransactions} payment transaction(s) across ${result.reconciledInstallments} installment(s) for one reversed collection journal. Reason: ${reason}${result.skippedJournalEntries.length ? `. Manual review needed for: ${result.skippedJournalEntries.join(", ")}` : ""}`,
      );
      res.json(result);
    } catch (error: any) {
      console.error("Error reconciling reversed collection journals:", error);
      res.status(400).json({ message: error.message || "Failed to reconcile reversed collection journals" });
    }
  });

  app.post("/api/journal-entries/:id/reverse", isAuthenticated, requirePageAccess("journal-entries"), async (req: any, res) => {
    try {
      const reversalEntry = await storage.reverseJournalEntry(req.params.id, req.session.userId);
      await logActivity(req, "reverse", "journal_entry", req.params.id, `Reversed journal entry, created ${reversalEntry.entryNumber}`);
      res.json(reversalEntry);
    } catch (error: any) {
      console.error("Error reversing journal entry:", error);
      const msg = error?.message || "Failed to reverse journal entry";
      if (msg.includes("already been reversed") || msg.includes("cannot itself be reversed")) {
        return res.status(400).json({ message: msg });
      }
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
      const { startDate, endDate, classId } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }
      const classFilter = classId && classId !== "all" ? (classId as string) : undefined;
      const incomeStatement = await storage.getIncomeStatement(startDate as string, endDate as string, classFilter);
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

  app.get("/api/reports/cash-flow-statement", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }
      const cashFlow = await storage.getCashFlowStatement(startDate as string, endDate as string);
      res.json(cashFlow);
    } catch (error) {
      console.error("Error fetching cash flow statement:", error);
      res.status(500).json({ message: "Failed to fetch cash flow statement" });
    }
  });

  app.get("/api/reports/profitability-analysis", isAuthenticated, async (req, res) => {
    try {
      const allAccounts = await db.select().from(accounts);
      const incomeAccounts = allAccounts.filter((a: any) => getMainAccountType(a.accountType) === 'income');
      const expenseAccounts = allAccounts.filter((a: any) => getMainAccountType(a.accountType) === 'expense');

      const allAccountIds = [...incomeAccounts, ...expenseAccounts].map((a: any) => a.id);

      let totalIncome = 0;
      let totalExpenses = 0;
      const incomeBreakdown: any[] = [];
      const expenseBreakdown: any[] = [];

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
              inArray(journalLines.accountId, allAccountIds)
            )
          )
          .groupBy(journalLines.accountId);

        for (const row of balanceRows) {
          const debit = Number(row.totalDebit || 0);
          const credit = Number(row.totalCredit || 0);
          const acc = allAccounts.find((a: any) => a.id === row.accountId);
          if (!acc) continue;

          if (getMainAccountType(acc.accountType) === 'income') {
            const amount = credit - debit;
            totalIncome += amount;
            if (Math.abs(amount) > 0.01) {
              incomeBreakdown.push({
                accountCode: acc.accountCode,
                accountName: acc.accountName,
                amount,
              });
            }
          } else if (getMainAccountType(acc.accountType) === 'expense') {
            const amount = debit - credit;
            totalExpenses += amount;
            if (Math.abs(amount) > 0.01) {
              expenseBreakdown.push({
                accountCode: acc.accountCode,
                accountName: acc.accountName,
                amount,
              });
            }
          }
        }
      }

      const sortByCode = (a: any, b: any) => (a.accountCode || "").localeCompare(b.accountCode || "", undefined, { numeric: true });
      incomeBreakdown.sort(sortByCode);
      expenseBreakdown.sort(sortByCode);

      const netProfitLoss = totalIncome - totalExpenses;
      const isProfitable = netProfitLoss > 0;

      const cutoffDate = '2026-01-07';

      const normalizeRateToPercent = (rate: number): number => {
        if (rate > 1) return rate;
        return rate * 100;
      };

      const allLoans = await db.select().from(loans);
      const disbursedLoans = allLoans.filter((l: any) => l.status === 'disbursed' || l.status === 'active' || l.status === 'closed');
      const totalDisbursed = disbursedLoans.reduce((s: number, l: any) => s + Number(l.principleAmount || 0), 0);

      const allDisbursements = await db.select().from(disbursements);
      const loanDisbursementDates: Record<string, string> = {};
      for (const d of allDisbursements) {
        if (d.loanId && d.disbursementDate) {
          loanDisbursementDates[d.loanId] = d.disbursementDate;
        }
      }

      const oldModelLoans = disbursedLoans.filter((l: any) => {
        const disbDate = loanDisbursementDates[l.id];
        return !disbDate || disbDate < cutoffDate;
      });
      const newModelLoans = disbursedLoans.filter((l: any) => {
        const disbDate = loanDisbursementDates[l.id];
        return disbDate && disbDate >= cutoffDate;
      });

      const oldModelIds = oldModelLoans.map((l: any) => l.id);
      const newModelIds = newModelLoans.map((l: any) => l.id);

      let oldModelTotalPrincipal = 0;
      let oldModelTotalMargin = 0;
      if (oldModelIds.length > 0) {
        const oldResult = await db
          .select({
            totalPrincipal: sql<string>`COALESCE(SUM(${loans.principleAmount}::numeric), 0)`,
            totalMargin: sql<string>`COALESCE(SUM(${loans.principleAmount}::numeric * ${loans.marginRate}::numeric), 0)`,
          })
          .from(loans)
          .where(inArray(loans.id, oldModelIds));
        oldModelTotalPrincipal = Number(oldResult[0]?.totalPrincipal || 0);
        oldModelTotalMargin = Number(oldResult[0]?.totalMargin || 0);
      }

      let newModelTotalPrincipal = 0;
      let newModelAvgRate = 0;
      if (newModelIds.length > 0) {
        const newResult = await db
          .select({
            totalPrincipal: sql<string>`COALESCE(SUM(${loans.principleAmount}::numeric), 0)`,
            weightedRateSum: sql<string>`COALESCE(SUM(${loans.principleAmount}::numeric * ${loans.marginRate}::numeric), 0)`,
          })
          .from(loans)
          .where(inArray(loans.id, newModelIds));
        newModelTotalPrincipal = Number(newResult[0]?.totalPrincipal || 0);
        const newWeightedSum = Number(newResult[0]?.weightedRateSum || 0);
        newModelAvgRate = newModelTotalPrincipal > 0 ? newWeightedSum / newModelTotalPrincipal : 0;
      }

      const avgMarginRate = totalDisbursed > 0
        ? (oldModelLoans.reduce((s: number, l: any) => s + Number(l.principleAmount || 0) * normalizeRateToPercent(Number(l.marginRate || 0)), 0)
          + newModelLoans.reduce((s: number, l: any) => s + Number(l.principleAmount || 0) * normalizeRateToPercent(Number(l.marginRate || 0)), 0))
          / totalDisbursed
        : 0;

      const projectionRate = newModelAvgRate > 0 ? newModelAvgRate : (avgMarginRate > 0 ? avgMarginRate : 16);
      const hasMarginData = projectionRate > 0;

      const earliestEntry = await db
        .select({ minDate: sql<string>`MIN(${journalEntries.entryDate})` })
        .from(journalEntries)
        .where(eq(journalEntries.isPosted, true));
      const latestEntry = await db
        .select({ maxDate: sql<string>`MAX(${journalEntries.entryDate})` })
        .from(journalEntries)
        .where(eq(journalEntries.isPosted, true));

      const startDateStr = earliestEntry[0]?.minDate || new Date().toISOString().split('T')[0];
      const endDateStr = latestEntry[0]?.maxDate || new Date().toISOString().split('T')[0];
      const periodStartDate = new Date(startDateStr);
      const periodEndDate = new Date(endDateStr);
      const periodDays = Math.max(1, Math.ceil((periodEndDate.getTime() - periodStartDate.getTime()) / (1000 * 60 * 60 * 24)));
      const periodMonths = Math.max(1, periodDays / 30.44);
      const periodYears = Math.max(0.1, periodDays / 365.25);

      const annualizedLoss = netProfitLoss / periodYears;
      const monthlyExpenses = totalExpenses / periodMonths;
      const monthlyIncome = totalIncome / periodMonths;

      let requiredDisbursement = 0;
      let breakEvenProjection = { annualIncome: 0, monthlyIncome: 0 };
      let additionalScenario = {
        amount: 10000000,
        annualIncome: 0,
        monthlyIncome: 0,
        monthlyNetProfit: 0,
      };
      let recommendations: string[] = [];

      if (!isProfitable) {
        const annualShortfall = Math.abs(annualizedLoss);
        if (hasMarginData) {
          requiredDisbursement = annualShortfall / (projectionRate / 100);
          breakEvenProjection = {
            annualIncome: annualShortfall,
            monthlyIncome: annualShortfall / 12,
          };
        }

        if (hasMarginData) {
          additionalScenario.annualIncome = additionalScenario.amount * projectionRate / 100;
          additionalScenario.monthlyIncome = additionalScenario.annualIncome / 12;
          additionalScenario.monthlyNetProfit = additionalScenario.monthlyIncome;
        }

        recommendations = [
          `The company has a total net loss of AFN ${Math.abs(netProfitLoss).toLocaleString('en-US', { minimumFractionDigits: 2 })} over ${periodMonths.toFixed(1)} months`,
          `Annualized loss is approximately AFN ${annualShortfall.toLocaleString('en-US', { minimumFractionDigits: 2 })} per year`,
        ];
        if (hasMarginData) {
          recommendations.push(
            `Based on the annual margin rate of ${projectionRate.toFixed(2)}%, the company needs to disburse an additional AFN ${requiredDisbursement.toLocaleString('en-US', { minimumFractionDigits: 2 })} in new loans to cover the annual loss`
          );
          recommendations.push(
            `This additional disbursement would generate AFN ${breakEvenProjection.annualIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })} per year (AFN ${breakEvenProjection.monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })} per month) in margin income`
          );
        } else {
          recommendations.push("Insufficient loan portfolio data to calculate required disbursement amount");
        }
        recommendations.push(
          "Consider reviewing and reducing operational expenses",
          "Focus on increasing loan portfolio quality to reduce provisions",
          "Explore new revenue streams or service fee structures",
        );
      } else {
        if (hasMarginData) {
          additionalScenario.annualIncome = additionalScenario.amount * projectionRate / 100;
          additionalScenario.monthlyIncome = additionalScenario.annualIncome / 12;
          additionalScenario.monthlyNetProfit = additionalScenario.monthlyIncome;
        }
        recommendations = [
          `The company is profitable with a total net profit of AFN ${netProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })} over ${periodMonths.toFixed(1)} months`,
          `Profit margin is ${((netProfitLoss / (totalIncome || 1)) * 100).toFixed(2)}%`,
          "Continue maintaining efficient operations",
          "Consider reinvesting profits to grow the loan portfolio",
        ];
      }

      res.json({
        totalIncome,
        totalExpenses,
        netProfitLoss,
        isProfitable,
        profitMargin: totalIncome > 0 ? (netProfitLoss / totalIncome) * 100 : 0,
        incomeBreakdown,
        expenseBreakdown,
        totalDisbursedLoans: disbursedLoans.length,
        totalDisbursedAmount: totalDisbursed,
        avgMarginRate,
        requiredDisbursement,
        recommendations,
        loanModelBreakdown: {
          oldModel: {
            count: oldModelLoans.length,
            totalPrincipal: oldModelTotalPrincipal,
            totalMarginOneTime: oldModelTotalMargin,
            description: "Margin applied once for entire loan duration (rate stored as decimal, e.g. 0.16 = 16%)",
          },
          newModel: {
            count: newModelLoans.length,
            totalPrincipal: newModelTotalPrincipal,
            avgAnnualRate: newModelAvgRate,
            description: "Margin applied annually every 12 months (rate stored as percentage, e.g. 16 = 16%)",
          },
          cutoffDate,
        },
        projectionRate,
        breakEvenProjection,
        additionalScenario,
        monthlyExpenses,
        monthlyIncome,
        periodMonths,
        annualizedLoss: !isProfitable ? Math.abs(annualizedLoss) : 0,
      });
    } catch (error) {
      console.error("Profitability analysis error:", error);
      res.status(500).json({ message: "Failed to generate profitability analysis" });
    }
  });

  app.get("/api/reports/shareholder-report", isAuthenticated, requirePageAccess("reports"), async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }
      const result = await storage.getShareholderReport(startDate as string, endDate as string);
      res.json(result);
    } catch (error) {
      console.error("Shareholder report error:", error);
      res.status(500).json({ message: "Failed to generate shareholder report" });
    }
  });

  app.get("/api/reports/approval-rejection", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate, unit, status } = req.query as Record<string, string | undefined>;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }
      const effectiveBranch = await getEffectiveBranchId(req);
      const branchCond = effectiveBranch && effectiveBranch !== "all" ? sql` AND ${loans.branchId} = ${effectiveBranch}` : sql``;
      const unitFilter = (unit || "all").toLowerCase();
      const statusFilter = (status || "all").toLowerCase();

      type Row = {
        unit: string;
        status: string;
        reviewedAt: string | null;
        reviewerName: string;
        comments: string;
        score: number | null;
        loanId: string;
        applicationId: string;
        customerName: string;
        branchName: string;
        productName: string;
        requestAmount: string;
      };
      const rows: Row[] = [];

      const includeFad = unitFilter === "all" || unitFilter === "fad";
      const includeRisk = unitFilter === "all" || unitFilter === "risk_compliance";
      const includeCommittee = unitFilter === "all" || unitFilter === "committee";

      const statusCond = (col: any) => statusFilter === "all"
        ? sql`(${col} = 'approved' OR ${col} = 'rejected')`
        : sql`${col} = ${statusFilter}`;

      if (includeFad) {
        const r = await db
          .select({
            status: fadReviews.status,
            reviewedAt: fadReviews.reviewedAt,
            reviewerName: fadReviews.reviewerName,
            comments: fadReviews.comments,
            score: fadReviews.dataQualityScore,
            loanId: loans.id,
            applicationId: loans.applicationId,
            customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
            branchName: branches.name,
            productName: loans.productName,
            requestAmount: loans.requestAmount,
          })
          .from(fadReviews)
          .innerJoin(loans, eq(fadReviews.loanId, loans.id))
          .leftJoin(customers, eq(loans.customerId, customers.id))
          .leftJoin(branches, eq(loans.branchId, branches.id))
          .where(sql`${fadReviews.reviewedAt} >= ${startDate}::date AND ${fadReviews.reviewedAt} < (${endDate}::date + INTERVAL '1 day') AND ${statusCond(fadReviews.status)}${branchCond}`)
          .orderBy(desc(fadReviews.reviewedAt));
        for (const x of r) rows.push({
          unit: "FAD",
          status: x.status || "",
          reviewedAt: x.reviewedAt ? new Date(x.reviewedAt as any).toISOString() : null,
          reviewerName: x.reviewerName || "",
          comments: x.comments || "",
          score: x.score ?? null,
          loanId: x.loanId,
          applicationId: x.applicationId || "",
          customerName: x.customerName || "",
          branchName: x.branchName || "",
          productName: x.productName || "",
          requestAmount: x.requestAmount || "0",
        });
      }

      if (includeRisk) {
        const r = await db
          .select({
            status: riskComplianceReviews.status,
            reviewedAt: riskComplianceReviews.reviewedAt,
            reviewerName: riskComplianceReviews.reviewerName,
            comments: riskComplianceReviews.comments,
            score: riskComplianceReviews.riskScore,
            loanId: loans.id,
            applicationId: loans.applicationId,
            customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
            branchName: branches.name,
            productName: loans.productName,
            requestAmount: loans.requestAmount,
          })
          .from(riskComplianceReviews)
          .innerJoin(loans, eq(riskComplianceReviews.loanId, loans.id))
          .leftJoin(customers, eq(loans.customerId, customers.id))
          .leftJoin(branches, eq(loans.branchId, branches.id))
          .where(sql`${riskComplianceReviews.reviewedAt} >= ${startDate}::date AND ${riskComplianceReviews.reviewedAt} < (${endDate}::date + INTERVAL '1 day') AND ${statusCond(riskComplianceReviews.status)}${branchCond}`)
          .orderBy(desc(riskComplianceReviews.reviewedAt));
        for (const x of r) rows.push({
          unit: "Risk Compliance",
          status: x.status || "",
          reviewedAt: x.reviewedAt ? new Date(x.reviewedAt as any).toISOString() : null,
          reviewerName: x.reviewerName || "",
          comments: x.comments || "",
          score: x.score ?? null,
          loanId: x.loanId,
          applicationId: x.applicationId || "",
          customerName: x.customerName || "",
          branchName: x.branchName || "",
          productName: x.productName || "",
          requestAmount: x.requestAmount || "0",
        });
      }

      if (includeCommittee) {
        const r = await db
          .select({
            status: loans.status,
            reviewedAt: loanApprovals.approvedDate,
            comments: loanApprovals.committeeDiscussion,
            loanId: loans.id,
            applicationId: loans.applicationId,
            customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
            branchName: branches.name,
            productName: loans.productName,
            requestAmount: loans.requestAmount,
            approvedAmount: loanApprovals.approvedAmount,
          })
          .from(loanApprovals)
          .innerJoin(loans, eq(loanApprovals.loanId, loans.id))
          .leftJoin(customers, eq(loans.customerId, customers.id))
          .leftJoin(branches, eq(loans.branchId, branches.id))
          .where(sql`${loanApprovals.approvedDate} >= ${startDate}::date AND ${loanApprovals.approvedDate} <= ${endDate}::date AND (${loans.status} = 'approved' OR ${loans.status} = 'rejected' OR ${loans.status} = 'disbursed' OR ${loans.status} = 'active' OR ${loans.status} = 'completed')${branchCond}`)
          .orderBy(desc(loanApprovals.approvedDate));
        for (const x of r) {
          const normalized = x.status === "rejected" ? "rejected" : "approved";
          if (statusFilter !== "all" && normalized !== statusFilter) continue;
          rows.push({
            unit: "Committee",
            status: normalized,
            reviewedAt: x.reviewedAt ? new Date(x.reviewedAt as any).toISOString() : null,
            reviewerName: "Committee",
            comments: x.comments || "",
            score: null,
            loanId: x.loanId,
            applicationId: x.applicationId || "",
            customerName: x.customerName || "",
            branchName: x.branchName || "",
            productName: x.productName || "",
            requestAmount: x.requestAmount || "0",
          });
        }
      }

      rows.sort((a, b) => (b.reviewedAt || "").localeCompare(a.reviewedAt || ""));

      const summary = {
        total: rows.length,
        approved: rows.filter(r => r.status === "approved").length,
        rejected: rows.filter(r => r.status === "rejected").length,
        byUnit: ["FAD", "Risk Compliance", "Committee"].map(u => ({
          unit: u,
          approved: rows.filter(r => r.unit === u && r.status === "approved").length,
          rejected: rows.filter(r => r.unit === u && r.status === "rejected").length,
          total: rows.filter(r => r.unit === u).length,
        })),
      };

      res.json({ summary, rows });
    } catch (error) {
      console.error("Error fetching approval-rejection report:", error);
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  app.get("/api/reports/loan-disbursement", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate, fundingSourceId } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }

      const effectiveBranch = await getEffectiveBranchId(req);
      const conditions: any[] = [
        gte(disbursements.disbursementDate, startDate as string),
        lte(disbursements.disbursementDate, endDate as string),
      ];
      if (effectiveBranch && effectiveBranch !== "all") {
        conditions.push(eq(loans.branchId, effectiveBranch));
      }
      if (fundingSourceId && fundingSourceId !== "all") {
        conditions.push(eq(loans.fundingSourceId, fundingSourceId as string));
      }

      const results = await db
        .select({
          customerId: customers.customerNo,
          customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
          applicationId: loans.applicationId,
          officerName: financeOfficers.name,
          productName: loans.productName,
          branchName: branches.name,
          fundingSourceName: fundingSourcesTable.name,
          financingCycle: loans.financingCycle,
          financingDurationMonths: loans.financingDurationMonths,
          disbursementDate: disbursements.disbursementDate,
          province: customers.province,
          district: customers.district,
          principleAmount: loans.principleAmount,
          profit: loans.profit,
          totalReceivable: loans.totalReceivable,
          phoneNumber: customers.phoneNumber,
          secondPhoneNumber: customers.secondPhoneNumber,
          loanId: loans.id,
        })
        .from(disbursements)
        .innerJoin(loans, eq(disbursements.loanId, loans.id))
        .innerJoin(customers, eq(loans.customerId, customers.id))
        .leftJoin(branches, eq(loans.branchId, branches.id))
        .leftJoin(financeOfficers, eq(loans.financeOfficerId, financeOfficers.id))
        .leftJoin(fundingSourcesTable, eq(loans.fundingSourceId, fundingSourcesTable.id))
        .where(and(...conditions))
        .orderBy(desc(disbursements.disbursementDate));

      const loanIds = results.map(r => r.loanId).filter(Boolean);
      const delayMap: Record<string, number> = {};
      const paidMap: Record<string, number> = {};
      if (loanIds.length > 0) {
        const today = new Date().toISOString().split("T")[0];
        const aggRows = await db
          .select({
            loanId: installments.loanId,
            maxDelay: sql<number>`MAX(CASE WHEN ${installments.isPaid} = false AND ${installments.dueDate} < ${today} THEN (${today}::date - ${installments.dueDate}::date) ELSE 0 END)`,
            totalPaid: sql<number>`COALESCE(SUM(${installments.paidAmount}), 0)`,
          })
          .from(installments)
          .where(inArray(installments.loanId, loanIds))
          .groupBy(installments.loanId);
        for (const dr of aggRows) {
          delayMap[dr.loanId] = Number(dr.maxDelay || 0);
          paidMap[dr.loanId] = Number(dr.totalPaid || 0);
        }
      }

      const enriched = results.map((row) => {
        const principal = Number(row.principleAmount || 0);
        const marginAmount = Number(row.profit || 0);
        const totalReceivable = Number(row.totalReceivable || 0);
        const totalPaid = paidMap[row.loanId] || 0;
        const outstanding = Math.max(totalReceivable - totalPaid, 0);
        return {
          customerName: row.customerName,
          applicationId: row.applicationId,
          officerName: row.officerName || "",
          productName: row.productName || "",
          branchName: row.branchName || "",
          fundingSourceName: row.fundingSourceName || "",
          financingCycle: row.financingCycle || 0,
          financingDurationMonths: row.financingDurationMonths || 0,
          disbursementDate: row.disbursementDate,
          province: row.province || "",
          district: row.district || "",
          disbursedAmount: principal,
          principleAmount: principal,
          marginAmount,
          totalPaid,
          outstandingPortfolio: outstanding,
          delayDays: delayMap[row.loanId] || 0,
          phoneNumber: row.phoneNumber || "",
          secondPhoneNumber: row.secondPhoneNumber || "",
        };
      });

      res.json(enriched);
    } catch (error) {
      console.error("Error fetching loan disbursement report:", error);
      res.status(500).json({ message: "Failed to fetch loan disbursement report" });
    }
  });

  // ===== FINANCING DATA REPORT =====
  app.get("/api/reports/financing-data", isAuthenticated, async (req: any, res) => {
    try {
      const { startDate, endDate, branchId, fundingSourceId } = req.query as Record<string, string>;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }

      const effectiveBranch = await getEffectiveBranchId(req);
      const branchFilter = branchId && branchId !== "all" ? branchId : (effectiveBranch && effectiveBranch !== "all" ? effectiveBranch : null);

      const rows = await db.execute(sql`
        SELECT
          b.name                                                        AS branch_name,
          fo.name                                                       AS officer_name,
          c.customer_no,
          l.application_id,
          CONCAT(c.first_name, ' ', COALESCE(c.last_name,''))          AS customer_name,
          COALESCE(c.father_name,'')                                    AS father_name,
          COALESCE(c.full_name_dari,'')                                 AS full_name_dari,
          COALESCE(c.gender::text,'')                                   AS gender,
          COALESCE(c.marital_status::text,'')                           AS marital_status,
          c.number_of_dependents,
          COALESCE(c.national_id,'')                                    AS national_id,
          COALESCE(c.date_of_birth::text,'')                            AS date_of_birth,
          COALESCE(c.province,'')                                       AS province,
          COALESCE(c.district,'')                                       AS district,
          COALESCE(c.area_type,'')                                      AS area_type,
          COALESCE(c.phone_number,'')                                   AS phone_number,
          COALESCE(c.second_phone_number,'')                            AS second_phone_number,
          COALESCE(l.product_name,'')                                   AS product_name,
          COALESCE(l.product_code,'')                                   AS product_code,
          COALESCE(l.sector,'')                                         AS sector,
          COALESCE(l.business_description,'')                           AS business_type,
          COALESCE(l.financing_purpose,'')                              AS financing_purpose,
          COALESCE(c.direct_male_dependent,0)                           AS direct_male_employee,
          COALESCE(c.direct_female_dependent,0)                         AS direct_female_employee,
          COALESCE(c.indirect_male_dependent,0)                         AS indirect_male_employee,
          COALESCE(c.indirect_female_dependent,0)                       AS indirect_female_employee,
          COALESCE(l.financing_cycle,1)                                 AS financing_cycle,
          COALESCE(fs.name,'')                                          AS funding_source_name,
          COALESCE(l.request_date::text,'')                             AS request_date,
          COALESCE(l.request_amount::numeric,0)                         AS request_amount,
          COALESCE(l.financing_duration_months,0)                       AS financing_duration_months,
          COALESCE(l.grace_period,0)                                    AS grace_period,
          COALESCE(l.number_of_installments,0)                         AS number_of_installments,
          COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0) AS principle_amount,
          COALESCE(l.margin_rate::numeric,0)                            AS margin_rate,
          COALESCE(l.profit::numeric,0)                                 AS profit,
          COALESCE(l.total_receivable::numeric,0)                       AS total_receivable,
          COALESCE(l.installment_amount::numeric,0)                     AS installment_amount,
          COALESCE(la.approved_amount::numeric, l.principle_amount::numeric, l.request_amount::numeric, 0) AS approved_amount,
          COALESCE(la.approved_date::text,'')                           AS approved_date,
          COALESCE(la.committee_discussion,'')                          AS committee_discussion,
          d.disbursement_date::text                                     AS disbursement_date,
          COALESCE(l.principle_amount::numeric, l.request_amount::numeric, 0) AS disbursed_amount,
          COALESCE(d.maturity_date::text,'')                            AS maturity_date,
          -- Customer Business Information
           COALESCE(cb.province,'')                                      AS biz_province,
           COALESCE(cb.district,'')                                      AS biz_district,
           COALESCE(cb.village,'')                                       AS biz_village,
           COALESCE(cb.detailed_address,'')                              AS biz_detailed_address,
           COALESCE(cb.years_of_experience::text,'')                     AS biz_years_of_experience,
          -- Business License Information
           COALESCE(bl.license_type,'')                                  AS biz_license_type,
           COALESCE(bl.president,'')                                     AS biz_president,
           COALESCE(bl.license_number,'')                                AS biz_license_number,
           COALESCE(bl.register_date::text,'')                           AS biz_register_date,
           COALESCE(bl.expiry_date::text,'')                             AS biz_expiry_date,
          -- Collateral Information (first collateral)
          COALESCE(col.col_owner_name,'')                               AS col_owner_name,
          COALESCE(col.col_owner_nid,'')                                AS col_owner_nid,
          COALESCE(col.col_province,'')                                 AS col_province,
          COALESCE(col.col_district,'')                                 AS col_district,
          COALESCE(col.col_village,'')                                  AS col_village,
          COALESCE(col.col_address,'')                                  AS col_address,
          COALESCE(col.col_purchased_price,0)                           AS col_purchased_price,
          COALESCE(col.col_market_price,0)                              AS col_market_price,
          COALESCE(col.col_type,'')                                     AS col_type,
          COALESCE(col.col_title_deed,'')                               AS col_title_deed,
           -- First Financial Guarantor Information
           COALESCE(fg1.full_name,'')                                    AS first_guarantor_name,
           COALESCE(fg1.father_name,'')                                  AS first_guarantor_father_name,
           COALESCE(fg1.national_id,'')                                   AS first_guarantor_nid,
           COALESCE(fg1.date_of_birth,'')                                AS first_guarantor_date_of_birth,
           COALESCE(fg1.nid_expiry_date,'')                              AS first_guarantor_nid_expiry_date,
           COALESCE(fg1.phone_number,'')                                 AS first_guarantor_phone,
           COALESCE(fg1.home_address,'')                                 AS first_guarantor_home_address,
           COALESCE(fg1.province,'')                                     AS first_guarantor_province,
           COALESCE(fg1.district,'')                                     AS first_guarantor_district,
           COALESCE(fg1.business,'')                                     AS first_guarantor_business,
           COALESCE(fg1.business_address,'')                             AS first_guarantor_business_address,
           COALESCE(fg1.relationship_with_customer,'')                   AS first_guarantor_relationship,
           COALESCE(fg1.years_of_experience,0)                           AS first_guarantor_years_of_experience,
           COALESCE(fg1.inventory::numeric,0)                            AS first_guarantor_asset,
           COALESCE(fg1.monthly_income::numeric,0)                       AS first_guarantor_monthly_income,
           -- Second Financial Guarantor Information
           COALESCE(fg2.full_name,'')                                    AS second_guarantor_name,
           COALESCE(fg2.father_name,'')                                  AS second_guarantor_father_name,
           COALESCE(fg2.national_id,'')                                   AS second_guarantor_nid,
           COALESCE(fg2.date_of_birth,'')                                AS second_guarantor_date_of_birth,
           COALESCE(fg2.nid_expiry_date,'')                              AS second_guarantor_nid_expiry_date,
           COALESCE(fg2.phone_number,'')                                 AS second_guarantor_phone,
           COALESCE(fg2.home_address,'')                                 AS second_guarantor_home_address,
           COALESCE(fg2.province,'')                                     AS second_guarantor_province,
           COALESCE(fg2.district,'')                                     AS second_guarantor_district,
           COALESCE(fg2.business,'')                                     AS second_guarantor_business,
           COALESCE(fg2.business_address,'')                             AS second_guarantor_business_address,
           COALESCE(fg2.relationship_with_customer,'')                   AS second_guarantor_relationship,
           COALESCE(fg2.years_of_experience,0)                           AS second_guarantor_years_of_experience,
           COALESCE(fg2.inventory::numeric,0)                            AS second_guarantor_asset,
           COALESCE(fg2.monthly_income::numeric,0)                       AS second_guarantor_monthly_income,
           -- Family Guarantor
           COALESCE(fgf.full_name,'')                                    AS family_guarantor_name,
           COALESCE(fgf.father_name,'')                                  AS family_guarantor_father_name,
           COALESCE(fgf.national_id,'')                                  AS family_guarantor_nid,
           COALESCE(fgf.date_of_birth,'')                                AS family_guarantor_date_of_birth,
           COALESCE(fgf.nid_expiry_date,'')                              AS family_guarantor_nid_expiry_date,
           COALESCE(fgf.phone_number,'')                                 AS family_guarantor_phone,
           COALESCE(fgf.province,'')                                     AS family_guarantor_province,
           COALESCE(fgf.district,'')                                     AS family_guarantor_district,
           COALESCE(fgf.home_address,'')                                 AS family_guarantor_home_address,
           COALESCE(fgf.relationship_with_customer,'')                   AS family_guarantor_relationship,
           -- Financing Committee Decision and Disbursement Information
           COALESCE(la.financing_duration_months, l.financing_duration_months, 0) AS committee_financing_duration_months,
           COALESCE(la.grace_period, l.grace_period, 0)                   AS committee_grace_period,
           COALESCE(l.profit::numeric,0)                                 AS disbursement_margin,
           COALESCE(pay.paid_installment_details, '[]'::jsonb)           AS paid_installment_details,
           -- Installment aggregates. Partial payments are allocated to profit
           -- first, then principal, so received totals reconcile across all
           -- three columns even when is_paid is false.
           COALESCE(SUM(
             CASE
               WHEN i.is_paid THEN COALESCE(i.total_amount::numeric,
                 COALESCE(i.principle_amount::numeric, 0) + COALESCE(i.margin_amount::numeric, 0))
               ELSE LEAST(
                 GREATEST(COALESCE(i.paid_amount::numeric, 0), 0),
                 COALESCE(i.total_amount::numeric,
                   COALESCE(i.principle_amount::numeric, 0) + COALESCE(i.margin_amount::numeric, 0))
               )
             END
           ),0)                                                          AS total_received,
           COALESCE(SUM(
             CASE
               WHEN i.is_paid THEN COALESCE(i.principle_amount::numeric, 0)
               ELSE LEAST(
                 GREATEST(
                   COALESCE(i.paid_amount::numeric, 0) - COALESCE(i.margin_amount::numeric, 0),
                   0
                 ),
                 COALESCE(i.principle_amount::numeric, 0)
               )
             END
           ),0)                                                          AS principle_received,
           COALESCE(SUM(
             CASE
               WHEN i.is_paid THEN COALESCE(i.margin_amount::numeric, 0)
               ELSE LEAST(
                 GREATEST(COALESCE(i.paid_amount::numeric, 0), 0),
                 COALESCE(i.margin_amount::numeric, 0)
               )
             END
           ),0)                                                          AS profit_received,
           COUNT(CASE WHEN COALESCE(i.paid_amount::numeric,0) > 0 THEN 1 END)::int AS paid_installments,
           COUNT(CASE WHEN COALESCE(i.paid_amount::numeric,0) <= 0 THEN 1 END)::int AS remaining_installments,
          MAX(CASE WHEN i.is_paid THEN i.payment_date::text END)       AS last_payment_date,
           COALESCE(MAX(CASE WHEN NOT i.is_paid AND i.due_date < CURRENT_DATE
                             THEN (CURRENT_DATE - i.due_date::date)
                             ELSE 0 END),0)                              AS final_aging,
           COUNT(CASE WHEN NOT i.is_paid
                           AND i.due_date IS NOT NULL
                           AND (CURRENT_DATE - i.due_date::date) > 1
                            AND (CURRENT_DATE - i.due_date::date) <= 30
                      THEN 1 END)::int                                   AS par1_no,
           COALESCE(SUM(CASE WHEN NOT i.is_paid
                                  AND i.due_date IS NOT NULL
                                  AND (CURRENT_DATE - i.due_date::date) > 1
                                   AND (CURRENT_DATE - i.due_date::date) <= 30
                             THEN GREATEST(
                               COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0),
                               0
                             )
                             ELSE 0 END), 0)                             AS par1_amount,
           COUNT(CASE WHEN NOT i.is_paid
                           AND i.due_date IS NOT NULL
                           AND (CURRENT_DATE - i.due_date::date) > 30
                      THEN 1 END)::int                                   AS par30_no,
           COALESCE(SUM(CASE WHEN NOT i.is_paid
                                  AND i.due_date IS NOT NULL
                                  AND (CURRENT_DATE - i.due_date::date) > 30
                             THEN GREATEST(
                               COALESCE(i.total_amount::numeric, 0) - COALESCE(i.paid_amount::numeric, 0),
                               0
                             )
                             ELSE 0 END), 0)                             AS par30_amount
        FROM disbursements d
        JOIN loans l         ON l.id = d.loan_id
        JOIN customers c     ON c.id = l.customer_id
        LEFT JOIN branches b ON b.id = l.branch_id
        LEFT JOIN finance_officers fo ON fo.id = l.finance_officer_id
        LEFT JOIN funding_sources fs  ON fs.id = l.funding_source_id
        LEFT JOIN loan_approvals la   ON la.loan_id = l.id
        LEFT JOIN installments i      ON i.loan_id = l.id
         LEFT JOIN LATERAL (
           SELECT COALESCE(
             jsonb_agg(
               jsonb_build_object(
                 'installmentNumber', paid.installment_number,
                 'paymentDate', COALESCE(paid.payment_date, ''),
                 'paymentAmount', paid.paid_amount,
                 'remainingBalance', GREATEST(
                   COALESCE(l.total_receivable::numeric,
                     COALESCE(l.principle_amount::numeric, 0) + COALESCE(l.profit::numeric, 0),
                     0
                   ) - paid.cumulative_paid,
                   0
                 )
               )
               ORDER BY paid.installment_number, paid.installment_id
             ) FILTER (WHERE paid.paid_amount > 0),
             '[]'::jsonb
           ) AS paid_installment_details
           FROM (
             SELECT
               i2.id AS installment_id,
               i2.installment_number,
               COALESCE(i2.payment_date::text, '') AS payment_date,
               COALESCE(i2.paid_amount::numeric, 0) AS paid_amount,
               SUM(COALESCE(i2.paid_amount::numeric, 0)) OVER (
                 ORDER BY i2.installment_number, i2.id
                 ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
               ) AS cumulative_paid
             FROM installments i2
             WHERE i2.loan_id = l.id
               AND COALESCE(i2.paid_amount::numeric, 0) <> 0
           ) paid
         ) pay ON true
         LEFT JOIN LATERAL (
           SELECT id, province, district, village, detailed_address, years_of_experience
           FROM customer_businesses
           WHERE customer_id = c.id
           ORDER BY created_at
           LIMIT 1
         ) cb ON true
         LEFT JOIN LATERAL (
           SELECT license_type, president, license_number, register_date, expiry_date
           FROM business_licenses
           WHERE customer_business_id = cb.id
           ORDER BY created_at
           LIMIT 1
         ) bl ON true
         LEFT JOIN LATERAL (
           SELECT id, full_name, father_name, national_id, date_of_birth, nid_expiry_date,
                  phone_number, home_address, province, district, business, business_address,
                  relationship_with_customer, years_of_experience, inventory, monthly_income
           FROM guarantors
           WHERE loan_id = l.id AND guarantor_type = 'financial'
           ORDER BY created_at, id
           LIMIT 1
         ) fg1 ON true
         LEFT JOIN LATERAL (
           SELECT id, full_name, father_name, national_id, date_of_birth, nid_expiry_date,
                  phone_number, home_address, province, district, business, business_address,
                  relationship_with_customer, years_of_experience, inventory, monthly_income
           FROM guarantors
           WHERE loan_id = l.id AND guarantor_type = 'financial'
           ORDER BY created_at, id
           LIMIT 1 OFFSET 1
         ) fg2 ON true
         LEFT JOIN LATERAL (
           SELECT id, full_name, father_name, national_id, date_of_birth, nid_expiry_date,
                  phone_number, home_address, province, district, relationship_with_customer
           FROM guarantors
           WHERE loan_id = l.id AND guarantor_type = 'family'
           ORDER BY created_at, id
           LIMIT 1
         ) fgf ON true
        LEFT JOIN LATERAL (
          SELECT
            COALESCE(owner_name,'')             AS col_owner_name,
            COALESCE(owner_national_id,'')      AS col_owner_nid,
            COALESCE(province,'')               AS col_province,
            COALESCE(district,'')               AS col_district,
            COALESCE(village,'')                AS col_village,
            COALESCE(address,'')                AS col_address,
            COALESCE(purchased_price::numeric,0) AS col_purchased_price,
            COALESCE(market_price::numeric,0)   AS col_market_price,
            COALESCE(collateral_type,'')        AS col_type,
            COALESCE(title_deed_number,'')      AS col_title_deed
          FROM collaterals
          WHERE loan_id = l.id
          ORDER BY created_at
          LIMIT 1
        ) col ON true
        WHERE d.disbursement_date BETWEEN ${startDate}::date AND ${endDate}::date
          ${branchFilter ? sql`AND l.branch_id = ${branchFilter}` : sql``}
          ${fundingSourceId && fundingSourceId !== "all" ? sql`AND l.funding_source_id = ${fundingSourceId}` : sql``}
        GROUP BY
          b.name, fo.name, c.customer_no, l.application_id, c.first_name, c.last_name,
          c.father_name, c.full_name_dari, c.gender, c.marital_status, c.number_of_dependents,
          c.national_id, c.date_of_birth, c.province, c.district, c.area_type,
          c.phone_number, c.second_phone_number,
          l.product_name, l.product_code, l.sector, l.business_description, l.financing_purpose,
          c.direct_male_dependent, c.direct_female_dependent,
          c.indirect_male_dependent, c.indirect_female_dependent,
          l.financing_cycle, fs.name, l.request_date, l.request_amount,
          l.financing_duration_months, l.grace_period, l.number_of_installments,
          l.principle_amount, l.margin_rate, l.profit, l.total_receivable, l.installment_amount,
           la.approved_amount, la.approved_date, la.committee_discussion,
           la.financing_duration_months, la.grace_period,
          d.disbursement_date, d.maturity_date,
           pay.paid_installment_details,
           cb.province, cb.district, cb.village, cb.detailed_address, cb.years_of_experience,
           bl.license_type, bl.president, bl.license_number, bl.register_date, bl.expiry_date,
          col.col_owner_name, col.col_owner_nid, col.col_province, col.col_district,
          col.col_village, col.col_address, col.col_purchased_price, col.col_market_price,
           col.col_type, col.col_title_deed,
           fg1.full_name, fg1.father_name, fg1.national_id, fg1.date_of_birth,
           fg1.nid_expiry_date, fg1.phone_number, fg1.home_address, fg1.province,
           fg1.district, fg1.business, fg1.business_address, fg1.relationship_with_customer,
           fg1.years_of_experience, fg1.inventory, fg1.monthly_income,
           fg2.full_name, fg2.father_name, fg2.national_id, fg2.date_of_birth,
           fg2.nid_expiry_date, fg2.phone_number, fg2.home_address, fg2.province,
           fg2.district, fg2.business, fg2.business_address, fg2.relationship_with_customer,
           fg2.years_of_experience, fg2.inventory, fg2.monthly_income,
           fgf.full_name, fgf.father_name, fgf.national_id, fgf.date_of_birth,
           fgf.nid_expiry_date, fgf.phone_number, fgf.home_address, fgf.province,
           fgf.district, fgf.relationship_with_customer
        ORDER BY b.name, d.disbursement_date
      `);

      const data = (rows.rows as any[]).map((r) => {
        const prinRcvd   = Number(r.principle_received || 0);
        const profRcvd   = Number(r.profit_received || 0);
         const totRcvd    = Math.round((prinRcvd + profRcvd) * 100) / 100;
        const prinAmt    = Number(r.principle_amount || 0);
        const profitAmt  = Number(r.profit || 0);
         const principleOutstanding = Math.max(prinAmt - prinRcvd, 0);
         const profitOutstanding = Math.max(profitAmt - profRcvd, 0);
        return {
          branchName:           r.branch_name || "",
          officerName:          r.officer_name || "",
          customerNo:           r.customer_no || "",
          applicationId:        r.application_id || "",
          customerName:         r.customer_name || "",
          fatherName:           r.father_name || "",
          fullNameDari:         r.full_name_dari || "",
          gender:               r.gender || "",
          maritalStatus:        r.marital_status || "",
          numberOfDependents:   Number(r.number_of_dependents || 0),
          nationalId:           r.national_id || "",
          dateOfBirth:          r.date_of_birth || "",
          province:             r.province || "",
          district:             r.district || "",
          areaType:             r.area_type || "",
          phoneNumber:          r.phone_number || "",
          secondPhoneNumber:    r.second_phone_number || "",
          productName:          r.product_name || "",
          productCode:          r.product_code || "",
          sector:               r.sector || "",
          businessType:         r.business_type || "",
          financingPurpose:     r.financing_purpose || "",
          directMaleEmployee:   Number(r.direct_male_employee || 0),
          directFemaleEmployee: Number(r.direct_female_employee || 0),
          indirectMaleEmployee: Number(r.indirect_male_employee || 0),
          indirectFemaleEmployee: Number(r.indirect_female_employee || 0),
          financingCycle:       Number(r.financing_cycle || 1),
          fundingSourceName:    r.funding_source_name || "",
          requestDate:          r.request_date || "",
          requestAmount:        Number(r.request_amount || 0),
          financingDurationMonths: Number(r.financing_duration_months || 0),
          gracePeriod:          Number(r.grace_period || 0),
          numberOfInstallments: Number(r.number_of_installments || 0),
          principleAmount:      prinAmt,
          marginRate:           Number(r.margin_rate || 0),
          profit:               profitAmt,
           totalReceivable:      Number(r.total_receivable || 0),
          installmentAmount:    Number(r.installment_amount || 0),
          approvedAmount:       Number(r.approved_amount || 0),
          approvedDate:         r.approved_date || "",
          committeeDiscussion:  r.committee_discussion || "",
          disbursementDate:     r.disbursement_date || "",
          disbursedAmount:      Number(r.disbursed_amount || 0),
          maturityDate:         r.maturity_date || "",
           bizProvince:          r.biz_province || "",
           bizDistrict:          r.biz_district || "",
          bizVillage:           r.biz_village || "",
          bizDetailedAddress:   r.biz_detailed_address || "",
          bizYearsOfExperience: Number(r.biz_years_of_experience || 0),
          bizLicenseType:       r.biz_license_type || "",
          bizPresident:         r.biz_president || "",
          bizLicenseNumber:     r.biz_license_number || "",
          bizRegisterDate:      r.biz_register_date || "",
          bizExpiryDate:        r.biz_expiry_date || "",
          colOwnerName:         r.col_owner_name || "",
          colOwnerNid:          r.col_owner_nid || "",
          colProvince:          r.col_province || "",
          colDistrict:          r.col_district || "",
          colVillage:           r.col_village || "",
          colAddress:           r.col_address || "",
          colPurchasedPrice:    Number(r.col_purchased_price || 0),
          colMarketPrice:       Number(r.col_market_price || 0),
          colType:              r.col_type || "",
          colTitleDeed:         r.col_title_deed || "",
           firstGuarantorName:            r.first_guarantor_name || "",
           firstGuarantorFatherName:      r.first_guarantor_father_name || "",
           firstGuarantorNid:             r.first_guarantor_nid || "",
           firstGuarantorDateOfBirth:     r.first_guarantor_date_of_birth || "",
           firstGuarantorNidExpiryDate:   r.first_guarantor_nid_expiry_date || "",
           firstGuarantorPhone:           r.first_guarantor_phone || "",
           firstGuarantorHomeAddress:     r.first_guarantor_home_address || "",
           firstGuarantorProvince:        r.first_guarantor_province || "",
           firstGuarantorDistrict:        r.first_guarantor_district || "",
           firstGuarantorBusiness:        r.first_guarantor_business || "",
           firstGuarantorBusinessAddress: r.first_guarantor_business_address || "",
           firstGuarantorRelationship:    r.first_guarantor_relationship || "",
           firstGuarantorYearsOfExperience: Number(r.first_guarantor_years_of_experience || 0),
           firstGuarantorAsset:            Number(r.first_guarantor_asset || 0),
           firstGuarantorMonthlyIncome:    Number(r.first_guarantor_monthly_income || 0),
           secondGuarantorName:            r.second_guarantor_name || "",
           secondGuarantorFatherName:      r.second_guarantor_father_name || "",
           secondGuarantorNid:             r.second_guarantor_nid || "",
           secondGuarantorDateOfBirth:     r.second_guarantor_date_of_birth || "",
           secondGuarantorNidExpiryDate:   r.second_guarantor_nid_expiry_date || "",
           secondGuarantorPhone:           r.second_guarantor_phone || "",
           secondGuarantorHomeAddress:     r.second_guarantor_home_address || "",
           secondGuarantorProvince:        r.second_guarantor_province || "",
           secondGuarantorDistrict:        r.second_guarantor_district || "",
           secondGuarantorBusiness:        r.second_guarantor_business || "",
           secondGuarantorBusinessAddress: r.second_guarantor_business_address || "",
           secondGuarantorRelationship:    r.second_guarantor_relationship || "",
           secondGuarantorYearsOfExperience: Number(r.second_guarantor_years_of_experience || 0),
           secondGuarantorAsset:            Number(r.second_guarantor_asset || 0),
           secondGuarantorMonthlyIncome:    Number(r.second_guarantor_monthly_income || 0),
           familyGuarantorName:             r.family_guarantor_name || "",
           familyGuarantorFatherName:       r.family_guarantor_father_name || "",
           familyGuarantorNid:              r.family_guarantor_nid || "",
           familyGuarantorDateOfBirth:      r.family_guarantor_date_of_birth || "",
           familyGuarantorNidExpiryDate:    r.family_guarantor_nid_expiry_date || "",
           familyGuarantorPhone:            r.family_guarantor_phone || "",
           familyGuarantorProvince:         r.family_guarantor_province || "",
           familyGuarantorDistrict:         r.family_guarantor_district || "",
           familyGuarantorHomeAddress:      r.family_guarantor_home_address || "",
           familyGuarantorRelationship:     r.family_guarantor_relationship || "",
           committeeFinancingDurationMonths: Number(r.committee_financing_duration_months || 0),
           committeeGracePeriod:             Number(r.committee_grace_period || 0),
           disbursementMargin:               Number(r.disbursement_margin || 0),
           par1No:                            Number(r.par1_no || 0),
           par1Amount:                        Number(r.par1_amount || 0),
           par30No:                           Number(r.par30_no || 0),
           par30Amount:                       Number(r.par30_amount || 0),
           paidInstallmentDetails: (() => {
             if (Array.isArray(r.paid_installment_details)) return r.paid_installment_details;
             if (typeof r.paid_installment_details === "string") {
               try { return JSON.parse(r.paid_installment_details); } catch { return []; }
             }
             return [];
           })().map((p: any) => ({
             installmentNumber: Number(p.installmentNumber || 0),
             paymentDate: p.paymentDate || "",
             paymentAmount: Number(p.paymentAmount || 0),
             remainingBalance: Number(p.remainingBalance || 0),
           })),
          principleReceived:    prinRcvd,
          profitReceived:       profRcvd,
          totalReceived:        totRcvd,
          paidInstallments:     Number(r.paid_installments || 0),
          remainingInstallments: Number(r.remaining_installments || 0),
           principleOutstanding,
           profitOutstanding,
           totalOutstanding:     principleOutstanding + profitOutstanding,
          lastPaymentDate:      r.last_payment_date || "",
          finalAging:           Number(r.final_aging || 0),
        };
      });

      res.json(data);
    } catch (error) {
      console.error("Error fetching financing data report:", error);
      res.status(500).json({ message: "Failed to fetch financing data report" });
    }
  });

  app.get("/api/reports/collection-report", isAuthenticated, requirePageAccess("collection-report"), async (req: any, res) => {
    try {
      const { startDate, endDate, officerId } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }

      const effectiveBranch = await getEffectiveBranchId(req);
      const loanFilters: any[] = [];
      if (effectiveBranch && effectiveBranch !== "all") {
        loanFilters.push(eq(loans.branchId, effectiveBranch));
      }
      if (officerId && officerId !== "all") {
        loanFilters.push(eq(loans.financeOfficerId, officerId as string));
      }

      // Step 1: find loans that had collection in date range (filtered installments)
      const inRangeConditions: any[] = [
        ...loanFilters,
        sql`${installments.paymentDate} IS NOT NULL`,
        gte(installments.paymentDate, startDate as string),
        lte(installments.paymentDate, endDate as string),
        gt(installments.paidAmount, "0"),
      ];

      const inRangeRows = await db
        .select({
          installmentId: installments.id,
          loanId: installments.loanId,
          installmentNumber: installments.installmentNumber,
          dueDate: installments.dueDate,
          paymentDate: installments.paymentDate,
          principleAmount: installments.principleAmount,
          marginAmount: installments.marginAmount,
          totalAmount: installments.totalAmount,
          paidAmount: installments.paidAmount,
          lateDays: installments.lateDays,
          isPaid: installments.isPaid,
          applicationId: loans.applicationId,
          productName: loans.productName,
          customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
          phoneNumber: customers.phoneNumber,
          branchName: branches.name,
          officerName: financeOfficers.name,
          officerCode: financeOfficers.code,
        })
        .from(installments)
        .innerJoin(loans, eq(installments.loanId, loans.id))
        .innerJoin(customers, eq(loans.customerId, customers.id))
        .leftJoin(branches, eq(loans.branchId, branches.id))
        .leftJoin(financeOfficers, eq(loans.financeOfficerId, financeOfficers.id))
        .where(and(...inRangeConditions))
        .orderBy(asc(installments.paymentDate), asc(installments.installmentNumber));

      // Step 1b: also fetch ALL disbursed/active/completed loans for branch+officer
      // (so loans without any in-range collection still appear with zero paid)
      const allLoanFilters: any[] = [
        ...loanFilters,
        inArray(loans.status, ['disbursed', 'active', 'completed']),
      ];
      const allLoansRows = await db
        .select({
          loanId: loans.id,
          applicationId: loans.applicationId,
          productName: loans.productName,
          customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
          phoneNumber: customers.phoneNumber,
          branchName: branches.name,
          officerName: financeOfficers.name,
          officerCode: financeOfficers.code,
        })
        .from(loans)
        .innerJoin(customers, eq(loans.customerId, customers.id))
        .leftJoin(branches, eq(loans.branchId, branches.id))
        .leftJoin(financeOfficers, eq(loans.financeOfficerId, financeOfficers.id))
        .where(and(...allLoanFilters));

      // Step 2: get loan-level totals (sum across ALL installments) for those loans
      // Split paidAmount into principal-paid vs margin-paid by proportional allocation
      const loanIds = Array.from(new Set([
        ...inRangeRows.map((r) => r.loanId).filter(Boolean) as string[],
        ...allLoansRows.map((l) => l.loanId).filter(Boolean) as string[],
      ]));
      const loanTotalsMap = new Map<string, { principleAmount: number; marginAmount: number; totalAmount: number; paidAmount: number; principalPaid: number; marginPaid: number }>();
      if (loanIds.length > 0) {
        const totals = await db
          .select({
            loanId: installments.loanId,
            principleAmount: sql<string>`COALESCE(SUM(${installments.principleAmount}), 0)`,
            marginAmount: sql<string>`COALESCE(SUM(${installments.marginAmount}), 0)`,
            totalAmount: sql<string>`COALESCE(SUM(${installments.totalAmount}), 0)`,
            paidAmount: sql<string>`COALESCE(SUM(COALESCE(${installments.paidAmount}, 0)), 0)`,
            principalPaid: sql<string>`COALESCE(SUM(CASE WHEN ${installments.totalAmount} > 0 THEN ${installments.principleAmount} * COALESCE(${installments.paidAmount}, 0) / ${installments.totalAmount} ELSE 0 END), 0)`,
            marginPaid: sql<string>`COALESCE(SUM(CASE WHEN ${installments.totalAmount} > 0 THEN ${installments.marginAmount} * COALESCE(${installments.paidAmount}, 0) / ${installments.totalAmount} ELSE 0 END), 0)`,
          })
          .from(installments)
          .where(inArray(installments.loanId, loanIds))
          .groupBy(installments.loanId);
        for (const t of totals) {
          if (t.loanId) {
            loanTotalsMap.set(t.loanId, {
              principleAmount: Number(t.principleAmount || 0),
              marginAmount: Number(t.marginAmount || 0),
              totalAmount: Number(t.totalAmount || 0),
              paidAmount: Number(t.paidAmount || 0),
              principalPaid: Number(t.principalPaid || 0),
              marginPaid: Number(t.marginPaid || 0),
            });
          }
        }
      }

      // Build loan-level summary list (one entry per loan) — include all qualifying loans
      const loanMap = new Map<string, any>();
      for (const row of allLoansRows) {
        const lid = row.loanId as string;
        const totals = loanTotalsMap.get(lid) || { principleAmount: 0, marginAmount: 0, totalAmount: 0, paidAmount: 0, principalPaid: 0, marginPaid: 0 };
        loanMap.set(lid, {
          loanId: lid,
          customerName: row.customerName || "",
          phoneNumber: row.phoneNumber || "",
          applicationId: row.applicationId || "",
          productName: row.productName || "",
          branchName: row.branchName || "",
          officerName: row.officerName || "",
          officerCode: row.officerCode || "",
          loanPrincipleTotal: totals.principleAmount,
          loanMarginTotal: totals.marginAmount,
          loanTotalDue: totals.totalAmount,
          loanTotalPaid: totals.paidAmount,
          loanPrincipalPaid: totals.principalPaid,
          loanMarginPaid: totals.marginPaid,
          loanOutstanding: totals.totalAmount - totals.paidAmount,
        });
      }
      // Also include loans found via in-range installments but missing from allLoansRows
      // (defensive — e.g., status not in the filter list but had a payment)
      for (const row of inRangeRows) {
        const lid = row.loanId as string;
        if (!loanMap.has(lid)) {
          const totals = loanTotalsMap.get(lid) || { principleAmount: 0, marginAmount: 0, totalAmount: 0, paidAmount: 0, principalPaid: 0, marginPaid: 0 };
          loanMap.set(lid, {
            loanId: lid,
            customerName: row.customerName || "",
            phoneNumber: row.phoneNumber || "",
            applicationId: row.applicationId || "",
            productName: row.productName || "",
            branchName: row.branchName || "",
            officerName: row.officerName || "",
            officerCode: row.officerCode || "",
            loanPrincipleTotal: totals.principleAmount,
            loanMarginTotal: totals.marginAmount,
            loanTotalDue: totals.totalAmount,
            loanTotalPaid: totals.paidAmount,
            loanPrincipalPaid: totals.principalPaid,
            loanMarginPaid: totals.marginPaid,
            loanOutstanding: totals.totalAmount - totals.paidAmount,
          });
        }
      }

      const enrichedInstallments = inRangeRows.map((row) => ({
        loanId: row.loanId,
        applicationId: row.applicationId || "",
        customerName: row.customerName || "",
        installmentNumber: row.installmentNumber,
        dueDate: row.dueDate,
        paymentDate: row.paymentDate,
        principleAmount: Number(row.principleAmount || 0),
        marginAmount: Number(row.marginAmount || 0),
        totalAmount: Number(row.totalAmount || 0),
        paidAmount: Number(row.paidAmount || 0),
        lateDays: row.lateDays || 0,
        isPaid: row.isPaid,
      }));

      // Life-to-date totals (matches dashboard logic): across ALL disbursed/active/completed loans
      // for the selected branch + officer, regardless of date range.
      let branchSql = sql``;
      if (effectiveBranch && effectiveBranch !== "all") {
        branchSql = sql`AND l.branch_id = ${effectiveBranch}`;
      }
      let officerSql = sql``;
      if (officerId && officerId !== "all") {
        officerSql = sql`AND l.finance_officer_id = ${officerId as string}`;
      }
      const portfolioRes: any = await db.execute(sql`
        SELECT COALESCE(SUM(l.total_receivable::numeric), 0) AS total_portfolio
        FROM loans l
        WHERE l.status IN ('disbursed','active','completed') ${branchSql} ${officerSql}
      `);
      const collectedRes: any = await db.execute(sql`
        SELECT COALESCE(SUM(COALESCE(i.paid_amount::numeric, 0)), 0) AS total_collected
        FROM installments i
        JOIN loans l ON i.loan_id = l.id
        WHERE l.status IN ('disbursed','active','completed') ${branchSql} ${officerSql}
      `);
      const totalPortfolio = Number(portfolioRes.rows?.[0]?.total_portfolio || 0);
      const totalCollectedLTD = Number(collectedRes.rows?.[0]?.total_collected || 0);
      const lifeToDate = {
        totalPortfolio,
        totalCollected: totalCollectedLTD,
        totalOutstanding: totalPortfolio - totalCollectedLTD,
        collectionRate: totalPortfolio > 0 ? (totalCollectedLTD / totalPortfolio) * 100 : 0,
      };

      res.json({
        loans: Array.from(loanMap.values()),
        installments: enrichedInstallments,
        lifeToDate,
      });
    } catch (error) {
      console.error("Error fetching collection report:", error);
      res.status(500).json({ message: "Failed to fetch collection report" });
    }
  });

  // Statement of Profit or Loss Report
  app.get("/api/reports/profit-loss-statement", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }

      const postedEntries = await db
        .select({
          accountCode: accounts.accountCode,
          accountName: accounts.accountName,
          accountType: accounts.accountType,
          debitTotal: sql<string>`COALESCE(SUM(${journalLines.debitAmount}), 0)`,
          creditTotal: sql<string>`COALESCE(SUM(${journalLines.creditAmount}), 0)`,
        })
        .from(journalLines)
        .innerJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
        .innerJoin(accounts, eq(journalLines.accountId, accounts.id))
        .where(and(
          eq(journalEntries.isPosted, true),
          gte(journalEntries.entryDate, startDate as string),
          lte(journalEntries.entryDate, endDate as string),
        ))
        .groupBy(accounts.accountCode, accounts.accountName, accounts.accountType);

      const balanceMap: Record<string, number> = {};
      for (const entry of postedEntries) {
        const debit = parseFloat(entry.debitTotal || "0");
        const credit = parseFloat(entry.creditTotal || "0");
        if (getMainAccountType(entry.accountType) === "income") {
          balanceMap[entry.accountCode] = credit - debit;
        } else {
          balanceMap[entry.accountCode] = debit - credit;
        }
      }

      const getBalance = (...codes: string[]) => {
        let total = 0;
        for (const code of codes) {
          if (balanceMap[code] !== undefined) {
            total += balanceMap[code];
          }
        }
        return total;
      };

      const getBalanceByPrefix = (...prefixes: string[]) => {
        let total = 0;
        for (const [code, val] of Object.entries(balanceMap)) {
          for (const prefix of prefixes) {
            if (code.startsWith(prefix)) {
              total += val;
              break;
            }
          }
        }
        return total;
      };

      const rev_murabaha = getBalance("40300", "20900");
      const rev_mudaraba = getBalance("50100");
      const rev_musharaka = getBalance("50200");
      const rev_other = 0;
      const totalRevenue = rev_murabaha + rev_mudaraba + rev_musharaka + rev_other;

      const cost_murabaha = getBalance("51100", "51300", "51400");
      const cost_fee_borrowings = getBalance("62000");
      const cost_ecl = getBalance("80102");
      const cost_credit_officer = getBalance("51200");
      const cost_other = 0;
      const totalCostOfServices = cost_murabaha + cost_fee_borrowings + cost_ecl + cost_credit_officer + cost_other;

      const grossProfit = totalRevenue - totalCostOfServices;

      const otherIncome = getBalance("40000", "40400", "40500");

      const exp_staff_salaries = getBalance("60001");
      const exp_depreciation = getBalance("61900");
      const exp_technology = getBalance("70000", "15300");
      const exp_marketing = getBalanceByPrefix("616");
      const exp_legal = getBalance("61504");

      const totalAllExpenses = Object.entries(balanceMap)
        .filter(([code]) => {
          const entry = postedEntries.find(e => e.accountCode === code);
          return entry?.accountType === "expense";
        })
        .reduce((s, [, v]) => s + v, 0);

      const specificExpenses = cost_murabaha + cost_fee_borrowings + cost_ecl + cost_credit_officer
        + exp_staff_salaries + exp_depreciation + exp_technology + exp_marketing + exp_legal;
      const exp_admin = Math.max(totalAllExpenses - specificExpenses, 0);
      const exp_other_operating = 0;
      const totalOperatingExpenses = exp_staff_salaries + exp_depreciation + exp_technology + exp_marketing + exp_admin + exp_legal + exp_other_operating;

      const profitBeforeTax = grossProfit + otherIncome - totalOperatingExpenses;
      const incomeTax = profitBeforeTax > 0 ? profitBeforeTax * 0.20 : 0;
      const netProfit = profitBeforeTax - incomeTax;

      const oci_revaluation = 0;
      const oci_tax = 0;
      const totalOCI = oci_revaluation - oci_tax;

      const totalComprehensiveIncome = netProfit + totalOCI;

      res.json({
        revenue: {
          murabaha: rev_murabaha,
          mudaraba: rev_mudaraba,
          musharaka: rev_musharaka,
          other: rev_other,
          total: totalRevenue,
        },
        costOfServices: {
          murabahaCost: cost_murabaha,
          feeBorrowings: cost_fee_borrowings,
          eclProvision: cost_ecl,
          creditOfficerSalaries: cost_credit_officer,
          other: cost_other,
          total: totalCostOfServices,
        },
        grossProfit,
        otherIncome,
        operatingExpenses: {
          staffSalaries: exp_staff_salaries,
          depreciation: exp_depreciation,
          technology: exp_technology,
          marketing: exp_marketing,
          admin: exp_admin,
          legal: exp_legal,
          other: exp_other_operating,
          total: totalOperatingExpenses,
        },
        profitBeforeTax,
        incomeTax,
        netProfit,
        oci: {
          revaluation: oci_revaluation,
          tax: oci_tax,
          total: totalOCI,
        },
        totalComprehensiveIncome,
      });
    } catch (error) {
      console.error("Error fetching profit/loss statement:", error);
      res.status(500).json({ message: "Failed to fetch statement" });
    }
  });

  // Active Customer Outstanding Summary Report
  app.get("/api/reports/active-customer-outstanding", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate, fundingSourceId } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }

      const effectiveBranch = await getEffectiveBranchId(req);
      const conditions: any[] = [
        gte(disbursements.disbursementDate, startDate as string),
        lte(disbursements.disbursementDate, endDate as string),
        inArray(loans.status, ["disbursed", "active", "completed"]),
      ];
      if (effectiveBranch && effectiveBranch !== "all") {
        conditions.push(eq(loans.branchId, effectiveBranch));
      }
      if (fundingSourceId && fundingSourceId !== "all") {
        conditions.push(eq(loans.fundingSourceId, fundingSourceId as string));
      }

      const results = await db
        .select({
          loanId: loans.id,
          branchName: branches.name,
          productName: loans.productName,
          financeOfficerName: financeOfficers.name,
          customerNo: customers.customerNo,
          customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
          applicationId: loans.applicationId,
          disbursementDate: disbursements.disbursementDate,
          principleAmount: loans.principleAmount,
          totalReceivable: loans.totalReceivable,
          numberOfInstallments: loans.numberOfInstallments,
          status: loans.status,
        })
        .from(loans)
        .innerJoin(customers, eq(loans.customerId, customers.id))
        .innerJoin(disbursements, eq(loans.id, disbursements.loanId))
        .leftJoin(branches, eq(loans.branchId, branches.id))
        .leftJoin(financeOfficers, eq(loans.financeOfficerId, financeOfficers.id))
        .leftJoin(fundingSourcesTable, eq(loans.fundingSourceId, fundingSourcesTable.id))
        .where(and(...conditions))
        .orderBy(branches.name, desc(disbursements.disbursementDate));

      const loanIds = results.map(r => r.loanId);

      if (loanIds.length === 0) {
        return res.json([]);
      }

      const allInstallments = await db
        .select()
        .from(installments)
        .where(inArray(installments.loanId, loanIds))
        .orderBy(installments.loanId, installments.installmentNumber);

      const yearStart = `${new Date().getFullYear()}-01-01`;

      const reportData = results.map(loan => {
        const loanInsts = allInstallments.filter(i => i.loanId === loan.loanId);
        const financingAmount = parseFloat(loan.principleAmount || "0");
        const totalReceivable = parseFloat(loan.totalReceivable || "0");

        const paidInsts = loanInsts.filter(i => i.isPaid);
        const unpaidInsts = loanInsts.filter(i => !i.isPaid);
        const totalInstCount = loanInsts.length;
        const paidInstCount = paidInsts.length;
        const unpaidInstCount = unpaidInsts.length;

        const totalPrincipalReceived = paidInsts.reduce((s, i) => s + parseFloat(i.principleAmount || "0"), 0);
        const totalMarkupReceived = paidInsts.reduce((s, i) => s + parseFloat(i.marginAmount || "0"), 0);
        const partialOnUnpaid = unpaidInsts.reduce((s, i) => s + parseFloat(i.paidAmount || "0"), 0);
        const totalAmountReceived = paidInsts.reduce((s, i) => s + parseFloat(i.paidAmount || i.totalAmount || "0"), 0) + partialOnUnpaid;

        const balanceOutstanding = Math.round((totalReceivable - totalAmountReceived) * 100) / 100;

        const lastPaidInst = paidInsts.length > 0
          ? paidInsts.sort((a, b) => (a.paymentDate || "").localeCompare(b.paymentDate || "")).pop()
          : null;
        const lastRepaymentDate = lastPaidInst?.paymentDate || null;

        const now = new Date();
        const nowStr = now.toISOString().split("T")[0];
        const overdueInsts = unpaidInsts.filter(i => i.dueDate && i.dueDate < nowStr);
        const maxLateDays = overdueInsts.reduce((max, i) => {
          if (!i.dueDate) return max;
          const diff = Math.floor((now.getTime() - new Date(i.dueDate).getTime()) / (1000 * 60 * 60 * 24));
          return Math.max(max, diff);
        }, 0);

        const paidThisYear = paidInsts.filter(i => i.paymentDate && i.paymentDate >= yearStart);
        const principalThisYear = paidThisYear.reduce((s, i) => s + parseFloat(i.principleAmount || "0"), 0);
        const markupThisYear = paidThisYear.reduce((s, i) => s + parseFloat(i.marginAmount || "0"), 0);

        return {
          branchName: loan.branchName || "",
          productName: loan.productName || "",
          financeOfficerName: loan.financeOfficerName || "",
          customerNo: loan.customerNo || "",
          customerName: loan.customerName || "",
          loanId: loan.applicationId || "",
          disbursementDate: loan.disbursementDate || "",
          financingAmount,
          balanceOutstanding: totalReceivable,
          outstanding: Math.max(balanceOutstanding, 0),
          totalInstallments: totalInstCount,
          installmentsPaid: paidInstCount,
          installmentsUnpaid: unpaidInstCount,
          lastRepaymentDate,
          lateDays: maxLateDays,
          totalPrincipalReceived,
          totalMarkupReceived,
          totalAmountReceived,
          principalThisYear,
          markupThisYear,
        };
      });

      res.json(reportData);
    } catch (error) {
      console.error("Error fetching active customer outstanding report:", error);
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  app.get("/api/reports/monthly-due-summary", isAuthenticated, requirePageAccess("monthly-due-summary"), async (req, res) => {
    try {
      const { fundingSourceId } = req.query;
      const effectiveBranch = await getEffectiveBranchId(req);

      let branchFilter = "";
      if (effectiveBranch && effectiveBranch !== "all") {
        branchFilter = ` AND l.branch_id = '${(effectiveBranch as string).replace(/'/g, "''")}'`;
      }
      let fundingFilter = "";
      if (fundingSourceId && fundingSourceId !== "all") {
        fundingFilter = ` AND l.funding_source_id = '${(fundingSourceId as string).replace(/'/g, "''")}'`;
      }

      const summaryResult = await db.execute(sql.raw(`
        SELECT
          TO_CHAR(i.due_date::date, 'YYYY-MM') AS month_year,
          COUNT(DISTINCT l.customer_id) AS total_customers,
          COALESCE(SUM(i.principle_amount::numeric), 0) AS total_principal,
          COALESCE(SUM(i.margin_amount::numeric), 0) AS total_margin,
          COALESCE(SUM(i.total_amount::numeric), 0) AS total_amount,
          COALESCE(SUM(i.paid_amount::numeric), 0) AS total_paid,
          COUNT(*) AS total_installments,
          COUNT(CASE WHEN i.is_paid = true THEN 1 END) AS paid_installments,
          COUNT(CASE WHEN i.is_paid = false THEN 1 END) AS unpaid_installments,
          COUNT(CASE WHEN i.is_paid = false AND i.due_date < CURRENT_DATE THEN 1 END) AS overdue_installments
        FROM installments i
        INNER JOIN loans l ON i.loan_id = l.id
        WHERE i.due_date IS NOT NULL
          ${branchFilter}
          ${fundingFilter}
        GROUP BY TO_CHAR(i.due_date::date, 'YYYY-MM')
        ORDER BY month_year ASC
      `));

      const totalsResult = await db.execute(sql.raw(`
        SELECT
          COUNT(DISTINCT l.customer_id) AS total_customers,
          COALESCE(SUM(i.total_amount::numeric), 0) AS total_due,
          COALESCE(SUM(i.paid_amount::numeric), 0) AS total_collected,
          COALESCE(SUM(CASE WHEN i.is_paid = false AND i.due_date < CURRENT_DATE THEN i.total_amount::numeric ELSE 0 END), 0) AS total_overdue,
          COUNT(CASE WHEN i.is_paid = false AND i.due_date < CURRENT_DATE THEN 1 END) AS overdue_installment_count,
          COALESCE(SUM(CASE WHEN TO_CHAR(i.due_date::date, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM') THEN i.total_amount::numeric ELSE 0 END), 0) AS current_month_due,
          COALESCE(SUM(CASE WHEN TO_CHAR(i.due_date::date, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM') AND i.is_paid = true THEN i.paid_amount::numeric ELSE 0 END), 0) AS current_month_collected
        FROM installments i
        INNER JOIN loans l ON i.loan_id = l.id
        WHERE i.due_date IS NOT NULL
          ${branchFilter}
          ${fundingFilter}
      `));

      const totals = (totalsResult as any).rows?.[0] || {};

      res.json({
        summary: ((summaryResult as any).rows || []).map((r: any) => ({
          monthYear: r.month_year,
          totalCustomers: Number(r.total_customers || 0),
          totalPrincipal: Number(r.total_principal || 0),
          totalMargin: Number(r.total_margin || 0),
          totalAmount: Number(r.total_amount || 0),
          totalPaid: Number(r.total_paid || 0),
          totalInstallments: Number(r.total_installments || 0),
          paidInstallments: Number(r.paid_installments || 0),
          unpaidInstallments: Number(r.unpaid_installments || 0),
          overdueInstallments: Number(r.overdue_installments || 0),
        })),
        totals: {
          totalCustomers: Number(totals.total_customers || 0),
          totalDue: Number(totals.total_due || 0),
          totalCollected: Number(totals.total_collected || 0),
          totalOverdue: Number(totals.total_overdue || 0),
          overdueInstallmentCount: Number(totals.overdue_installment_count || 0),
          currentMonthDue: Number(totals.current_month_due || 0),
          currentMonthCollected: Number(totals.current_month_collected || 0),
        },
      });
    } catch (error) {
      console.error("Error fetching monthly due summary:", error);
      res.status(500).json({ message: "Failed to fetch monthly due summary" });
    }
  });

  app.get("/api/reports/monthly-due-detail/:monthYear", isAuthenticated, requirePageAccess("monthly-due-summary"), async (req, res) => {
    try {
      const { monthYear } = req.params;
      const { fundingSourceId } = req.query;
      const effectiveBranch = await getEffectiveBranchId(req);

      let branchFilter = "";
      if (effectiveBranch && effectiveBranch !== "all") {
        branchFilter = ` AND l.branch_id = '${(effectiveBranch as string).replace(/'/g, "''")}'`;
      }
      let fundingFilter = "";
      if (fundingSourceId && fundingSourceId !== "all") {
        fundingFilter = ` AND l.funding_source_id = '${(fundingSourceId as string).replace(/'/g, "''")}'`;
      }

      const result = await db.execute(sql.raw(`
        SELECT
          i.id AS installment_id,
          i.installment_number,
          i.due_date,
          i.principle_amount::numeric AS principle_amount,
          i.margin_amount::numeric AS margin_amount,
          i.total_amount::numeric AS total_amount,
          i.paid_amount::numeric AS paid_amount,
          i.payment_date,
          i.is_paid,
          i.late_days,
          l.application_id,
          l.product_name,
          c.first_name,
          c.last_name,
          c.customer_no,
          b.name AS branch_name
        FROM installments i
        INNER JOIN loans l ON i.loan_id = l.id
        INNER JOIN customers c ON l.customer_id = c.id
        LEFT JOIN branches b ON l.branch_id = b.id
        WHERE TO_CHAR(i.due_date::date, 'YYYY-MM') = '${monthYear.replace(/'/g, "''")}'
          ${branchFilter}
          ${fundingFilter}
        ORDER BY b.name, c.first_name, i.due_date
      `));

      const rows = ((result as any).rows || []).map((r: any) => ({
        installmentId: r.installment_id,
        installmentNumber: Number(r.installment_number || 0),
        dueDate: r.due_date,
        principleAmount: Number(r.principle_amount || 0),
        marginAmount: Number(r.margin_amount || 0),
        totalAmount: Number(r.total_amount || 0),
        paidAmount: Number(r.paid_amount || 0),
        paymentDate: r.payment_date,
        isPaid: r.is_paid,
        lateDays: Number(r.late_days || 0),
        applicationId: r.application_id || "",
        productName: r.product_name || "",
        customerName: `${r.first_name || ""} ${r.last_name || ""}`.trim(),
        customerNo: r.customer_no || "",
        branchName: r.branch_name || "",
      }));

      res.json(rows);
    } catch (error) {
      console.error("Error fetching monthly due detail:", error);
      res.status(500).json({ message: "Failed to fetch monthly due detail" });
    }
  });

  // Collateral Report
  app.get("/api/reports/collateral", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate, branchId, fundingSourceId, amountFilter } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }

      const conditions: any[] = [
        gte(disbursements.disbursementDate, startDate as string),
        lte(disbursements.disbursementDate, endDate as string),
      ];
      if (branchId && branchId !== "all") {
        conditions.push(eq(loans.branchId, branchId as string));
      }
      if (fundingSourceId && fundingSourceId !== "all") {
        conditions.push(eq(loans.fundingSourceId, fundingSourceId as string));
      }
      if (amountFilter === "below500k") {
        conditions.push(sql`${loans.principleAmount}::numeric < 500000`);
      } else if (amountFilter === "above500k") {
        conditions.push(sql`${loans.principleAmount}::numeric >= 500000`);
      }

      const results = await db
        .select({
          contractCode: loans.applicationId,
          collateralCode: collaterals.ownerNationalId,
          collateralType: collaterals.collateralType,
          collateralDescription: collaterals.description,
          purchasePrice: collaterals.purchasedPrice,
          marketPrice: collaterals.marketPrice,
          branchName: branches.name,
          ownerName: collaterals.ownerName,
          province: collaterals.province,
          district: collaterals.district,
          createdAt: collaterals.createdAt,
        })
        .from(collaterals)
        .innerJoin(loans, eq(collaterals.loanId, loans.id))
        .innerJoin(disbursements, eq(loans.id, disbursements.loanId))
        .leftJoin(branches, eq(loans.branchId, branches.id))
        .where(and(...conditions))
        .orderBy(branches.name, loans.applicationId);

      const enriched = results.map(row => ({
        contractCode: row.contractCode || "",
        collateralCode: row.collateralCode || "",
        collateralType: row.collateralType || "",
        collateralDescription: "",
        collateralValue: Number(row.purchasePrice || 0),
        collateralCurrency: "AFN",
        valuationDate: row.createdAt ? new Date(row.createdAt).toISOString().split("T")[0] : "",
        branchName: row.branchName || "",
        ownerName: row.ownerName || "",
      }));

      res.json(enriched);
    } catch (error) {
      console.error("Error fetching collateral report:", error);
      res.status(500).json({ message: "Failed to fetch collateral report" });
    }
  });

  // Individual Report (DAB)
  app.get("/api/reports/individual", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate, branchId, fundingSourceId, amountFilter } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }

      const conditions: any[] = [
        gte(disbursements.disbursementDate, startDate as string),
        lte(disbursements.disbursementDate, endDate as string),
      ];
      if (branchId && branchId !== "all") {
        conditions.push(eq(loans.branchId, branchId as string));
      }
      if (fundingSourceId && fundingSourceId !== "all") {
        conditions.push(eq(loans.fundingSourceId, fundingSourceId as string));
      }
      if (amountFilter === "below500k") {
        conditions.push(sql`${loans.principleAmount}::numeric < 500000`);
      } else if (amountFilter === "above500k") {
        conditions.push(sql`${loans.principleAmount}::numeric >= 500000`);
      }

      const results = await db
        .select({
          contractCode: loans.applicationId,
          customerCode: customers.customerNo,
          firstName: customers.firstName,
          firstNameDari: customers.fullNameDari,
          fatherName: customers.fatherName,
          fatherNameDari: customers.fatherNameDari,
          lastName: customers.lastName,
          dateOfBirth: customers.dateOfBirth,
          gender: customers.gender,
          maritalStatus: customers.maritalStatus,
          nationalId: customers.nationalId,
          province: customers.province,
          district: customers.district,
          phoneNumber: customers.phoneNumber,
          homeAddress: customers.homeAddress,
          branchName: branches.name,
          businessName: customerBusinesses.businessName,
          monthlyIncomeAmount: customerBusinesses.monthlyIncomeAmount,
          businessProvince: customerBusinesses.province,
          businessDistrict: customerBusinesses.district,
          businessVillage: customerBusinesses.village,
          businessDetailedAddress: customerBusinesses.detailedAddress,
          licenseNumber: businessLicenses.licenseNumber,
          licenseExpiryDate: businessLicenses.expiryDate,
        })
        .from(loans)
        .innerJoin(customers, eq(loans.customerId, customers.id))
        .innerJoin(disbursements, eq(loans.id, disbursements.loanId))
        .leftJoin(branches, eq(loans.branchId, branches.id))
        .leftJoin(customerBusinesses, eq(customers.id, customerBusinesses.customerId))
        .leftJoin(businessLicenses, eq(customerBusinesses.id, businessLicenses.customerBusinessId))
        .where(and(...conditions))
        .orderBy(branches.name, loans.applicationId);

      const capitalize = (s: string | null | undefined) => {
        if (!s) return "";
        const str = String(s).trim();
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      const formatDob = (d: string | null | undefined) => {
        if (!d) return "";
        const str = String(d);
        const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) return `${match[1]}-${match[2]}-${match[3]}`;
        const date = new Date(str);
        if (!isNaN(date.getTime())) {
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${y}-${m}-${day}`;
        }
        return str;
      };

      const uniqueMap = new Map<string, any>();
      for (const row of results) {
        const key = `${row.contractCode}-${row.customerCode}`;
        if (!uniqueMap.has(key)) {
          const fullName = `${row.firstName || ""} ${row.lastName || ""}`.trim();
          uniqueMap.set(key, {
            ContractCode: row.contractCode || "",
            CustomerCode: row.customerCode || "",
            PresentSurname: fullName,
            BirthSurname: "",
            FirstName: fullName,
            FirstNameLocal: "",
            MiddleNames: fullName,
            MiddleNamesLocal: "",
            FullName: fullName,
            FullNameLocal: "",
            Alias: "",
            FathersName: row.fatherName || "",
            FathersNameLocal: "",
            ClassificationOfIndividual: "Individual",
            Gender: capitalize(row.gender),
            DateOfBirth: formatDob(row.dateOfBirth),
            CountryOfBirth: "AF",
            MaritalStatus: capitalize(row.maritalStatus),
            FateStatus: "Active",
            SocialStatus: "Employed",
            Residency: "Yes",
            Citizenship: "AF",
            Employment: "Other",
            Education: "NotSpecified",
            BusinessName: "",
            "IncomeAvailable.Value": "",
            "IncomeAvailable.Currency": "",
            "MonthlyExpenses.Value": "",
            "MonthlyExpenses.Currency": "",
            NegativeStatusOfIndividual: "NoNegativeStatus",
            "IdentificationNumbers.TaxNumber": "",
            "IdentificationNumbers.TazkiraNumberNew": row.nationalId || "",
            "IdentificationNumbers.PassportIssuerCountry": "",
            "IdentificationNumbers.DrivingLicenseNumber": "",
            "IdentificationNumbers.TazkiraNumber": "",
            "IdentificationNumbers.LabourCard": "",
            "IdentificationNumbers.BusinessLicense": "",
            "IdentificationNumbers.BusinessLicenseExpirationDate": "",
            "MainAddress.Street": "",
            "MainAddress.NumberOfBuilding": "",
            "MainAddress.City": "",
            "MainAddress.PostalCode": "",
            "MainAddress.Province": "",
            "MainAddress.District": "",
            "MainAddress.Country": "",
            "MainAddress.AddressLine": row.businessDetailedAddress || row.homeAddress || "",
            "SecondaryAddress.Street": "",
            "SecondaryAddress.NumberOfBuilding": "",
            "SecondaryAddress.City": "",
            "SecondaryAddress.PostalCodeLookup": "",
            "SecondaryAddress.Province": "",
            "SecondaryAddress.District": "",
            "SecondaryAddress.Country": "",
            "SecondaryAddress.AddressLine": "",
            "Contacts.MobilePhone": row.phoneNumber || "",
            "Contacts.FixedLine": "",
            "Contacts.WebPage": "",
            "Contacts.Fax": "",
          });
        }
      }

      res.json(Array.from(uniqueMap.values()));
    } catch (error) {
      console.error("Error fetching individual report:", error);
      res.status(500).json({ message: "Failed to fetch individual report" });
    }
  });

  // LCTR Report (Monthly Large Currency Transaction Report)
  app.get("/api/reports/lctr", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate, branchId, fundingSourceId } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }

      const conditions: any[] = [
        gte(disbursements.disbursementDate, startDate as string),
        lte(disbursements.disbursementDate, endDate as string),
        gte(loans.principleAmount, "200000"),
        lte(loans.principleAmount, "1500000"),
      ];
      if (branchId && branchId !== "all") {
        conditions.push(eq(loans.branchId, branchId as string));
      }
      if (fundingSourceId && fundingSourceId !== "all") {
        conditions.push(eq(loans.fundingSourceId, fundingSourceId as string));
      }

      const results = await db
        .select({
          branchName: branches.name,
          firstName: customers.firstName,
          lastName: customers.lastName,
          fatherName: customers.fatherName,
          nationalId: customers.nationalId,
          dateOfBirth: customers.dateOfBirth,
          homeAddress: customers.homeAddress,
          district: customers.district,
          province: customers.province,
          phoneNumber: customers.phoneNumber,
          principleAmount: loans.principleAmount,
          disbursementDate: disbursements.disbursementDate,
        })
        .from(loans)
        .innerJoin(customers, eq(loans.customerId, customers.id))
        .innerJoin(disbursements, eq(loans.id, disbursements.loanId))
        .leftJoin(branches, eq(loans.branchId, branches.id))
        .where(and(...conditions))
        .orderBy(branches.name, disbursements.disbursementDate);

      const mapped = results.map((row) => ({
        Branch: row.branchName || "",
        CustomerName: row.firstName || "",
        LastName: row.lastName || "",
        FatherFirstName: row.fatherName || "",
        "F/LastName": row.lastName || "",
        "CustomerNID#": row.nationalId || "",
        Dob: row.dateOfBirth || "",
        CustomerAddressStreet: row.homeAddress || "",
        District: row.district || "",
        Village: "",
        Province: row.province || "",
        Phone: row.phoneNumber || "",
        Principle: row.principleAmount ? Number(row.principleAmount) : 0,
        DisbursementDate: row.disbursementDate || "",
      }));

      res.json(mapped);
    } catch (error) {
      console.error("Error fetching LCTR report:", error);
      res.status(500).json({ message: "Failed to fetch LCTR report" });
    }
  });

  // Subject Role Report (DAB)
  app.get("/api/reports/subject-role", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate, branchId, fundingSourceId, amountFilter } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }

      const conditions: any[] = [
        gte(disbursements.disbursementDate, startDate as string),
        lte(disbursements.disbursementDate, endDate as string),
      ];
      if (branchId && branchId !== "all") {
        conditions.push(eq(loans.branchId, branchId as string));
      }
      if (fundingSourceId && fundingSourceId !== "all") {
        conditions.push(eq(loans.fundingSourceId, fundingSourceId as string));
      }
      if (amountFilter === "below500k") {
        conditions.push(sql`${loans.principleAmount}::numeric < 500000`);
      } else if (amountFilter === "above500k") {
        conditions.push(sql`${loans.principleAmount}::numeric >= 500000`);
      }

      const results = await db
        .select({
          contractCode: loans.applicationId,
          customerCode: customers.customerNo,
          branchName: branches.name,
        })
        .from(loans)
        .innerJoin(customers, eq(loans.customerId, customers.id))
        .innerJoin(disbursements, eq(loans.id, disbursements.loanId))
        .leftJoin(branches, eq(loans.branchId, branches.id))
        .where(and(...conditions))
        .orderBy(branches.name, loans.applicationId);

      const uniqueMap = new Map<string, any>();
      for (const row of results) {
        const key = `${row.contractCode}-${row.customerCode}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, {
            contractCode: row.contractCode || "",
            customerCode: row.customerCode || "",
            roleOfCustomer: "MainDebtor",
            branchName: row.branchName || "",
          });
        }
      }

      res.json(Array.from(uniqueMap.values()));
    } catch (error) {
      console.error("Error fetching subject role report:", error);
      res.status(500).json({ message: "Failed to fetch subject role report" });
    }
  });

  // System User List Report
  app.get("/api/reports/system-user-list", isAuthenticated, async (req, res) => {
    try {
      const results = await db
        .select({
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          createdAt: users.createdAt,
          role: userRoles.role,
          branchName: branches.name,
        })
        .from(users)
        .leftJoin(userRoles, eq(users.id, userRoles.userId))
        .leftJoin(financeOfficers, eq(users.id, financeOfficers.userId))
        .leftJoin(branches, eq(financeOfficers.branchId, branches.id))
        .orderBy(users.username);

      const data = results.map((row) => ({
        "User Name": row.username || `${row.firstName || ""} ${row.lastName || ""}`.trim() || "",
        "User ID": row.id || "",
        "Department": row.branchName || "",
        "User Role": row.role || "user",
        "User creation date": row.createdAt ? new Date(row.createdAt).toISOString().split("T")[0] : "",
        "User Status": "Active",
      }));

      res.json(data);
    } catch (error) {
      console.error("Error fetching system user list report:", error);
      res.status(500).json({ message: "Failed to fetch system user list report" });
    }
  });

  // Contract Data Report
  app.get("/api/reports/contract-data", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate, branchId, fundingSourceId, amountFilter } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }

      const conditions: any[] = [
        gte(disbursements.disbursementDate, startDate as string),
        lte(disbursements.disbursementDate, endDate as string),
      ];
      if (branchId && branchId !== "all") {
        conditions.push(eq(loans.branchId, branchId as string));
      }
      if (fundingSourceId && fundingSourceId !== "all") {
        conditions.push(eq(loans.fundingSourceId, fundingSourceId as string));
      }
      if (amountFilter === "below500k") {
        conditions.push(sql`${loans.principleAmount}::numeric < 500000`);
      } else if (amountFilter === "above500k") {
        conditions.push(sql`${loans.principleAmount}::numeric >= 500000`);
      }

      const results = await db
        .select({
          applicationId: loans.applicationId,
          branchName: branches.name,
          loanStatus: loans.status,
          requestDate: loans.requestDate,
          customerId: customers.customerNo,
          customerName: sql<string>`CONCAT(${customers.firstName}, ' ', ${customers.lastName})`,
          disbursementDate: disbursements.disbursementDate,
          paymentFrequency: sql<string>`'Monthly'`,
          requestAmount: loans.requestAmount,
          principleAmount: loans.principleAmount,
          marginRate: loans.marginRate,
          profit: loans.profit,
          totalReceivable: loans.totalReceivable,
          installmentAmount: loans.installmentAmount,
          financingDurationMonths: loans.financingDurationMonths,
          numberOfInstallments: loans.numberOfInstallments,
          maturityDate: disbursements.maturityDate,
          firstInstallmentDate: disbursements.firstInstallmentDate,
          productName: loans.productName,
          fundingSourceName: fundingSourcesTable.name,
          financingCycle: loans.financingCycle,
          sector: loans.sector,
          province: customers.province,
          district: customers.district,
          loanId: loans.id,
          phoneNumber: customers.phoneNumber,
          nationalId: customers.nationalId,
          gender: customers.gender,
          gracePeriod: loans.gracePeriod,
        })
        .from(loans)
        .innerJoin(customers, eq(loans.customerId, customers.id))
        .innerJoin(disbursements, eq(loans.id, disbursements.loanId))
        .leftJoin(branches, eq(loans.branchId, branches.id))
        .leftJoin(fundingSourcesTable, eq(loans.fundingSourceId, fundingSourcesTable.id))
        .where(and(...conditions))
        .orderBy(branches.name, desc(disbursements.disbursementDate));

      const loanIds = results.map(r => r.loanId).filter(Boolean);
      const installmentMap: Record<string, { totalPaid: number; principalPaid: number; outstandingInstallments: number; dueInstallments: number; lastPaymentDate: string | null; maxDelayDays: number; overdueAmount: number; overdueDate: string | null; monthlyInstallment: number }> = {};

      if (loanIds.length > 0) {
        const today = new Date().toISOString().split("T")[0];
        const escapedIds = loanIds.map(id => `'${id.replace(/'/g, "''")}'`).join(", ");
        const aggResult = await db.execute(sql.raw(`
          SELECT
            loan_id as "loanId",
            COALESCE(SUM(paid_amount), 0) as "totalPaid",
            COUNT(CASE WHEN is_paid = false THEN 1 END) as "outstandingInstallments",
            COUNT(CASE WHEN is_paid = false AND due_date <= '${today}'::date THEN 1 END) as "dueInstallments",
            MAX(CASE WHEN is_paid = true THEN payment_date::text END) as "lastPaymentDate",
            MAX(CASE WHEN is_paid = false AND due_date <= '${today}'::date THEN ('${today}'::date - due_date::date) ELSE 0 END) as "maxDelayDays",
            COALESCE(SUM(CASE WHEN is_paid = false AND due_date <= '${today}'::date THEN (total_amount - COALESCE(paid_amount, 0)) ELSE 0 END), 0) as "overdueAmount",
            MIN(CASE WHEN is_paid = false AND due_date <= '${today}'::date THEN due_date::text END) as "overdueDate",
            MODE() WITHIN GROUP (ORDER BY total_amount) FILTER (WHERE total_amount > 0) as "monthlyInstallment"
          FROM installments
          WHERE loan_id IN (${escapedIds})
          GROUP BY loan_id
        `));
        const aggRows = { rows: (aggResult as any).rows || aggResult };

        for (const row of aggRows.rows) {
          const r = row as any;
          installmentMap[r.loanId] = {
            totalPaid: Number(r.totalPaid || 0),
            principalPaid: Number(r.totalPaid || 0),
            outstandingInstallments: Number(r.outstandingInstallments || 0),
            dueInstallments: Number(r.dueInstallments || 0),
            lastPaymentDate: r.lastPaymentDate || null,
            maxDelayDays: Number(r.maxDelayDays || 0),
            overdueAmount: Number(r.overdueAmount || 0),
            overdueDate: r.overdueDate || null,
            monthlyInstallment: Number(r.monthlyInstallment || 0),
          };
        }
      }

      const enriched = results.map(row => {
        const inst = installmentMap[row.loanId] || { totalPaid: 0, principalPaid: 0, outstandingInstallments: 0, dueInstallments: 0, lastPaymentDate: null, maxDelayDays: 0, overdueAmount: 0, overdueDate: null, monthlyInstallment: 0 };
        const totalReceivable = Number(row.totalReceivable || 0);
        const outstanding = Math.max(totalReceivable - inst.totalPaid, 0);
        const principalAmt = Number(row.principleAmount || 0);
        const marginAmt = Number(row.profit || 0);
        const numInst = Number(row.numberOfInstallments || 0) || Number(row.financingDurationMonths || 0);
        let installmentAmount = inst.monthlyInstallment > 0
          ? inst.monthlyInstallment
          : Number(row.installmentAmount || 0);
        if (installmentAmount <= 0 && numInst > 0) {
          installmentAmount = Math.round((totalReceivable / numInst) * 100) / 100;
        }

        return {
          applicationId: row.applicationId || "",
          branchName: row.branchName || "",
          loanStatus: row.loanStatus || "",
          requestDate: row.requestDate || "",
          customerId: row.customerId || "",
          customerName: row.customerName || "",
          signedContractDate: row.disbursementDate || "",
          paymentFrequency: "Monthly",
          amountOffered: Number(row.requestAmount || 0),
          currency: "AFN",
          maturityDate: row.maturityDate || "",
          totalAmountDisbursed: principalAmt,
          principleAmount: principalAmt,
          marginRate: Number(row.marginRate || 0),
          marginAmount: marginAmt,
          totalReceivable,
          installmentAmount,
          numberOfInstallments: Number(row.numberOfInstallments || 0),
          financingDurationMonths: Number(row.financingDurationMonths || 0),
          firstInstallmentDate: row.firstInstallmentDate || "",
          disbursementDate: row.disbursementDate || "",
          productName: row.productName || "",
          fundingSourceName: row.fundingSourceName || "",
          financingCycle: Number(row.financingCycle || 0),
          sector: row.sector || "",
          province: row.province || "",
          district: row.district || "",
          phoneNumber: row.phoneNumber || "",
          nationalId: row.nationalId || "",
          gender: row.gender || "",
          gracePeriod: Number(row.gracePeriod || 0),
          totalPaid: inst.totalPaid,
          principalOutstanding: outstanding,
          outstandingInstallments: inst.outstandingInstallments,
          dueInstallments: inst.dueInstallments,
          lastPaymentDate: inst.lastPaymentDate || "",
          numberOfDaysInArrears: inst.maxDelayDays,
          overdueAmount: inst.overdueAmount,
          overdueDate: inst.overdueDate || "",
          restructured: "No",
          writtenOff: 0,
        };
      });

      res.json(enriched);
    } catch (error) {
      console.error("Error fetching contract data report:", error);
      res.status(500).json({ message: "Failed to fetch contract data report" });
    }
  });

  app.get("/api/reports/account-statement/:accountId", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate, fundingSourceId, includeChildren } = req.query;
      const statement = await storage.getAccountStatement(
        req.params.accountId,
        startDate as string,
        endDate as string,
        fundingSourceId as string | undefined,
        includeChildren === "true" || includeChildren === "1"
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

  app.get("/api/reports/funding-source-statement/:fundingSourceId", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const statement = await storage.getFundingSourceStatement(
        req.params.fundingSourceId,
        startDate as string,
        endDate as string
      );
      if (!statement) {
        return res.status(404).json({ message: "Funding source not found" });
      }
      res.json(statement);
    } catch (error) {
      console.error("Error fetching funding source statement:", error);
      res.status(500).json({ message: "Failed to fetch funding source statement" });
    }
  });

  app.get("/api/reports/funding-source-principle-statement/:fundingSourceId", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const statement = await storage.getFundingSourcePrincipleStatement(
        req.params.fundingSourceId,
        startDate as string,
        endDate as string
      );
      if (!statement) {
        return res.status(404).json({ message: "Funding source not found" });
      }
      res.json(statement);
    } catch (error) {
      console.error("Error fetching funding source principle statement:", error);
      res.status(500).json({ message: "Failed to fetch funding source principle statement" });
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

  app.get("/api/hr/employees/financing-officers", isAuthenticated, async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT e.id, e.first_name, e.last_name, e.employee_code, e.finance_officer_id,
          e.user_id, e.branch_id, e.employment_status,
          p.title as position_title,
          b.name as branch_name
        FROM employees e
        LEFT JOIN positions p ON e.position_id = p.id
        LEFT JOIN branches b ON e.branch_id = b.id
        WHERE LOWER(p.title) LIKE '%financing%officer%'
          OR LOWER(p.title) LIKE '%finance%officer%'
          OR e.finance_officer_id IS NOT NULL
        ORDER BY e.first_name, e.last_name
      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching financing officer employees:", error);
      res.status(500).json({ message: "Failed to fetch financing officer employees" });
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
  app.post("/api/loans/:loanId/update-and-regenerate", isAuthenticated, requirePageAccess("loans"), async (req: any, res) => {
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

      const cutoffDate = new Date("2026-01-07");
      const disbursement = await storage.getDisbursementByLoan(loanId);
      let effectiveDisbDate: Date | null = null;
      if (disbursementDate) {
        effectiveDisbDate = new Date(disbursementDate);
      } else if (disbursement?.disbursementDate) {
        effectiveDisbDate = new Date(disbursement.disbursementDate);
      }
      const useNewFormula = effectiveDisbDate ? effectiveDisbDate >= cutoffDate : true;

      let profitTotal: number;
      if (useNewFormula) {
        profitTotal = (updatedPrincipal * rate / 12) * durationMonths;
      } else {
        profitTotal = updatedPrincipal * rate;
      }
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

      const roundedPrincipalPerInst = Math.floor(principalPerInst);
      const roundedMarginPerInst = Math.floor(marginPerInst);
      const principalRemainder = updatedPrincipal - (roundedPrincipalPerInst * principalInstallments);
      const marginRemainder = profitTotal - (roundedMarginPerInst * marginPayingInstCount);

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
          instMargin = (i === 1) ? roundedMarginPerInst + Math.round(marginRemainder) : roundedMarginPerInst;
          instTotal = instMargin;
        } else if (isFirstPrincipal) {
          instPrincipal = roundedPrincipalPerInst + Math.round(principalRemainder);
          if (useNewFormula) {
            instMargin = roundedMarginPerInst;
          } else {
            instMargin = roundedMarginPerInst + Math.round(marginRemainder);
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
  app.patch("/api/installments/:id/payment", isAuthenticated, requirePageAccess("payments"), async (req: any, res) => {
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

      await storage.updateInstallmentPayment(id, {
        paidAmount: paid.toFixed(2),
        paymentDate: paymentDate || null,
        isPaid: isPaid !== undefined ? isPaid : true,
        lateDays,
        installmentVariance: variance.toFixed(2),
      });

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

        // Journal reversal can be completed from the accounting screen after a
        // collection was recorded. Until its payment record is reconciled, its
        // installment still carries the original paid amount. Exclude just the
        // reversed transaction allocations so customer balances remain correct.
        const reversedCollectionPayments = await db
          .select({ affectedInstallments: paymentTransactions.affectedInstallments })
          .from(paymentTransactions)
          .innerJoin(journalEntries, eq(paymentTransactions.journalEntryId, journalEntries.id))
          .where(and(
            eq(paymentTransactions.loanId, loan.id),
            eq(paymentTransactions.status, "active"),
            eq(journalEntries.referenceType, "collection"),
            eq(journalEntries.isReversed, true)
          ));
        const reversedAmountByInstallment = new Map<string, number>();
        for (const payment of reversedCollectionPayments) {
          try {
            const affected = JSON.parse(payment.affectedInstallments || "[]");
            for (const item of affected) {
              if (!item?.installmentId) continue;
              const amount = Number(item.appliedAmount || 0);
              reversedAmountByInstallment.set(
                item.installmentId,
                (reversedAmountByInstallment.get(item.installmentId) || 0) + amount
              );
            }
          } catch {
            // A malformed historical allocation cannot safely be adjusted here.
          }
        }

        const actualPayments = installmentsList.map((inst: any, idx: number) => {
          const dueDate = inst.dueDate ? new Date(inst.dueDate) : null;
          const paymentDate = inst.paymentDate ? new Date(inst.paymentDate) : null;
          const recordedPaidAmount = parseFloat(inst.paidAmount || "0");
          const reversedAmount = reversedAmountByInstallment.get(inst.id) || 0;
          const paidAmount = Math.max(0, recordedPaidAmount - reversedAmount);
          const totalAmount = parseFloat(inst.totalAmount || "0");
          const principleAmt = parseFloat(inst.principleAmount || "0");
          const marginAmt = parseFloat(inst.marginAmount || "0");

          const hasPaid = paidAmount > 0 || (inst.isPaid && paymentDate && reversedAmount === 0);
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

          let paidMargin = 0;
          let paidPrinciple = 0;
          if (hasPaid && effectivePaidAmount > 0) {
            paidMargin = Math.min(effectivePaidAmount, marginAmt);
            paidPrinciple = Math.min(effectivePaidAmount - paidMargin, principleAmt);
          }

          return {
            no: inst.installmentNumber || (idx + 1),
            paymentDate: hasPaid ? (inst.paymentDate || null) : null,
            principleAmount: paidPrinciple,
            marginAmount: paidMargin,
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
            cancellationReason: loan.cancellationReason || null,
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

  app.get("/api/loans/:loanId/contract-data", isAuthenticated, async (req, res) => {
    try {
      const { loanId } = req.params;
      const loan = await storage.getLoan(loanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      const customer = loan.customerId ? await storage.getCustomer(loan.customerId) : null;
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      const branch = loan.branchId ? await storage.getBranch(loan.branchId) : null;
      const customerBusiness = loan.customerId ? await storage.getCustomerBusinessByCustomerId(loan.customerId) : null;
      const disbursement = await storage.getDisbursementByLoan(loan.id);
      const installments = await storage.getInstallmentsByLoan(loan.id);

      const principleAmount = parseFloat(loan.principleAmount?.toString() || "0");
      const marginRate = parseFloat(loan.marginRate?.toString() || "0");
      const profit = parseFloat(loan.profit?.toString() || "0");
      const totalReceivable = parseFloat(loan.totalReceivable?.toString() || "0");
      const installmentAmount = parseFloat(loan.installmentAmount?.toString() || "0");

      let firstInstDate = "";
      let lastInstDate = "";
      if (installments.length > 0) {
        const sorted = [...installments].sort((a: any, b: any) => {
          const da = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const db = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return da - db;
        });
        firstInstDate = sorted[0]?.dueDate || "";
        lastInstDate = sorted[sorted.length - 1]?.dueDate || "";
      }

      res.json({
        customer: {
          name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
          fullNameDari: customer.fullNameDari || "",
          fatherName: customer.fatherName || "",
          fatherNameDari: customer.fatherNameDari || "",
          nationalId: customer.nationalId || "",
          phoneNumber: customer.phoneNumber || "",
          homeAddress: customer.homeAddress || "",
          province: customer.province || "",
          district: customer.district || "",
          photoUrl: customer.photoUrl || "",
        },
        loan: {
          applicationId: loan.applicationId || "",
          productName: loan.productName || "",
          financingDurationMonths: loan.financingDurationMonths || 0,
          gracePeriod: loan.gracePeriod || 0,
          numberOfInstallments: loan.numberOfInstallments || 0,
          principleAmount,
          marginRate,
          profit,
          totalReceivable,
          installmentAmount,
        },
        branch: {
          name: branch?.name || "",
          code: branch?.code || "",
          address: branch?.address || "",
        },
        business: {
          businessType: customerBusiness?.businessType || "",
          detailedAddress: customerBusiness?.detailedAddress || "",
          businessName: customerBusiness?.businessName || "",
        },
        disbursement: {
          disbursementDate: disbursement?.disbursementDate || "",
          firstInstallmentDate: firstInstDate,
          lastInstallmentDate: lastInstDate,
          maturityDate: disbursement?.maturityDate || "",
        },
      });
    } catch (error: any) {
      console.error("Error fetching contract data:", error);
      res.status(500).json({ message: "Failed to fetch contract data", error: error.message });
    }
  });

  // Committee Form Data for PDF generation
  app.get("/api/loans/:loanId/committee-form-data", isAuthenticated, async (req, res) => {
    try {
      const { loanId } = req.params;
      const loan = await storage.getLoan(loanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      const customer = loan.customerId ? await storage.getCustomer(loan.customerId) : null;
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      const branch = loan.branchId ? await storage.getBranch(loan.branchId) : null;
      const customerBusiness = loan.customerId ? await storage.getCustomerBusinessByCustomerId(loan.customerId) : null;
      const riskReview = await storage.getRiskComplianceReviewByLoanId(loanId);
      let riskReviewerName = "";
      let riskReviewDate = "";
      if (riskReview) {
        if (riskReview.reviewedById) {
          const reviewer = await storage.getUserById(riskReview.reviewedById);
          if (reviewer) riskReviewerName = `${reviewer.firstName || ""} ${reviewer.lastName || ""}`.trim() || reviewer.username || "";
        }
        if (!riskReviewerName) riskReviewerName = riskReview.reviewerName || "";
        if (riskReviewerName === "Risk Compliance Reviewer") riskReviewerName = "";
        riskReviewDate = riskReview.reviewedAt ? new Date(riskReview.reviewedAt).toISOString().split("T")[0] : "";
      }

      const rawVotes = await storage.getCommitteeVotesByLoanId(loanId);
      const votes: any[] = [];
      for (const v of rawVotes) {
        let name = "";
        if (v.voterId) {
          const voter = await storage.getUserById(v.voterId);
          if (voter) name = `${voter.firstName || ""} ${voter.lastName || ""}`.trim() || voter.username || "";
        }
        if (!name) name = v.voterName || "";
        if (name === "Committee Member") name = "";
        votes.push({ ...v, voterName: name });
      }
      const guarantorsData = await storage.getGuarantorsByLoanId(loanId);

      const principleAmount = parseFloat(loan.principleAmount?.toString() || "0");
      let installmentAmount = parseFloat(loan.installmentAmount?.toString() || "0");
      const requestAmount = parseFloat(loan.requestAmount?.toString() || "0");
      const totalReceivable = parseFloat(loan.totalReceivable?.toString() || "0");
      const numInstallments = loan.numberOfInstallments || 0;
      const gracePeriod = loan.gracePeriod || 0;
      if (installmentAmount === 0 && numInstallments > 0) {
        const payableInstallments = numInstallments - gracePeriod;
        if (payableInstallments > 0) {
          installmentAmount = Math.round((totalReceivable || principleAmount) / payableInstallments * 100) / 100;
        }
      }
      const monthlyIncome = parseFloat(customerBusiness?.monthlyIncomeAmount?.toString() || "0");

      const lastVoteDate = votes.length > 0
        ? votes.reduce((latest: any, v: any) => {
            const d = v.votedAt ? new Date(v.votedAt) : new Date(0);
            return d > latest ? d : latest;
          }, new Date(0)).toISOString().split("T")[0]
        : "";

      const approvedVotes = votes.filter((v: any) => v.vote === "approved").length;
      const rejectedVotes = votes.filter((v: any) => v.vote === "rejected").length;
      const totalVotes = votes.length;
      const finalDecision = approvedVotes >= 2 ? "Approved" : rejectedVotes >= 2 ? "Rejected" : "Pending";

      res.json({
        customer: {
          name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
          customerNo: customer.customerNo || "",
          nationalId: customer.nationalId || "",
          homeAddress: customer.homeAddress || "",
          phoneNumber: customer.phoneNumber || "",
        },
        loan: {
          applicationId: loan.applicationId || "",
          productName: loan.productName || "",
          requestAmount,
          principleAmount,
          financingDurationMonths: loan.financingDurationMonths || 0,
          numberOfInstallments: loan.numberOfInstallments || 0,
          installmentAmount,
          financingPurpose: loan.financingPurpose || "",
        },
        branch: {
          name: branch?.name || "",
        },
        business: {
          businessType: customerBusiness?.businessType || "",
          monthlyIncome,
        },
        guarantors: guarantorsData.map((g: any) => ({
          guarantorNo: g.guarantorNo || "",
          name: g.fullName || `${g.firstName || ""} ${g.lastName || ""}`.trim() || "",
        })),
        votes: votes.map((v: any) => ({
          voterName: v.voterName || "",
          voterRole: v.voterRole || "",
          vote: v.vote || "pending",
          votedAt: v.votedAt ? new Date(v.votedAt).toISOString().split("T")[0] : "",
          comments: v.comments || "",
        })),
        riskReviewer: {
          name: riskReviewerName,
          date: riskReviewDate,
        },
        committeeDate: lastVoteDate,
        finalDecision,
        approvedVotes,
        rejectedVotes,
        totalVotes,
      });
    } catch (error: any) {
      console.error("Error fetching committee form data:", error);
      res.status(500).json({ message: "Failed to fetch committee form data", error: error.message });
    }
  });

  // ===== FINANCING PRODUCTS =====

  app.get("/api/financing-products", isAuthenticated, async (req, res) => {
    try {
      const products = await storage.getFinancingProducts();
      res.json(products);
    } catch (error: any) {
      console.error("Error fetching financing products:", error);
      res.status(500).json({ message: "Failed to fetch financing products" });
    }
  });

  app.post("/api/financing-products", isAuthenticated, requirePageAccess("financing-products"), async (req, res) => {
    try {
      const product = await storage.createFinancingProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Error creating financing product:", error);
      res.status(500).json({ message: error.message || "Failed to create financing product" });
    }
  });

  app.put("/api/financing-products/:id", isAuthenticated, requirePageAccess("financing-products"), async (req, res) => {
    try {
      const product = await storage.updateFinancingProduct(req.params.id, req.body);
      res.json(product);
    } catch (error: any) {
      console.error("Error updating financing product:", error);
      res.status(500).json({ message: error.message || "Failed to update financing product" });
    }
  });

  app.delete("/api/financing-products/:id", isAuthenticated, requirePageAccess("financing-products"), async (req, res) => {
    try {
      await storage.deleteFinancingProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting financing product:", error);
      res.status(500).json({ message: "Failed to delete financing product" });
    }
  });

  app.get("/api/financing-products/:id/cycle-limits", isAuthenticated, async (req, res) => {
    try {
      const limits = await db.select().from(productCycleLimits)
        .where(eq(productCycleLimits.productId, req.params.id))
        .orderBy(productCycleLimits.cycleNumber);
      res.json(limits);
    } catch (error: any) {
      console.error("Error fetching cycle limits:", error);
      res.status(500).json({ message: "Failed to fetch cycle limits" });
    }
  });

  app.put("/api/financing-products/:id/cycle-limits", isAuthenticated, requirePageAccess("financing-products"), async (req: any, res) => {
    try {
      const { cycles } = req.body;
      if (cycles && !Array.isArray(cycles)) {
        return res.status(400).json({ message: "cycles must be an array" });
      }
      const validCycles = (cycles || []).filter((c: any) =>
        c.cycleNumber && Number.isInteger(Number(c.cycleNumber)) && Number(c.cycleNumber) > 0 &&
        c.minAmount && Number(c.minAmount) >= 0 &&
        c.maxAmount && Number(c.maxAmount) >= Number(c.minAmount)
      );

      await db.transaction(async (tx) => {
        await tx.delete(productCycleLimits).where(eq(productCycleLimits.productId, req.params.id));
        if (validCycles.length > 0) {
          await tx.insert(productCycleLimits).values(
            validCycles.map((c: any) => ({
              productId: req.params.id,
              cycleNumber: parseInt(c.cycleNumber),
              minAmount: String(c.minAmount),
              maxAmount: String(c.maxAmount),
            }))
          );
        }
      });

      const updated = await db.select().from(productCycleLimits)
        .where(eq(productCycleLimits.productId, req.params.id))
        .orderBy(productCycleLimits.cycleNumber);
      res.json(updated);
    } catch (error: any) {
      console.error("Error saving cycle limits:", error);
      res.status(500).json({ message: "Failed to save cycle limits" });
    }
  });

  // ===== COLLECTION RECORDS (Mobile submission + Approval workflow) =====

  app.post("/api/collection-records", isAuthenticated, async (req: any, res) => {
    try {
      const schema = z.object({
        installmentId: z.string(),
        amount: z.number().positive(),
        paymentDate: z.string(),
        notes: z.string().optional(),
        debitAccountCode: z.string().optional(),
      });
      const parsed = schema.parse(req.body);
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const instResult = await db.execute(sql`
        SELECT i.id, i.loan_id, i.total_amount, i.paid_amount, i.is_paid, i.installment_number,
          l.application_id, l.customer_id, l.status as loan_status,
          CONCAT(c.first_name, ' ', c.last_name) as customer_name
        FROM installments i
        LEFT JOIN loans l ON i.loan_id = l.id
        LEFT JOIN customers c ON l.customer_id = c.id
        WHERE i.id = ${parsed.installmentId}
      `);
      if (instResult.rows.length === 0) return res.status(404).json({ message: "Installment not found" });

      const inst: any = instResult.rows[0];
      if (inst.loan_status !== "disbursed" && inst.loan_status !== "active") {
        return res.status(400).json({ message: "Collection records can only be submitted for active or disbursed loans" });
      }
      if (inst.is_paid) return res.status(400).json({ message: "Installment is already fully paid" });

      const pendingCheck = await db.execute(sql`
        SELECT id FROM collection_records 
        WHERE installment_id = ${parsed.installmentId} AND status = 'pending'
      `);
      if (pendingCheck.rows.length > 0) {
        return res.status(400).json({ message: "A pending collection record already exists for this installment" });
      }

      const [record] = await db.insert(collectionRecords).values({
        installmentId: parsed.installmentId,
        loanId: inst.loan_id,
        loanApplicationId: inst.application_id,
        customerId: inst.customer_id,
        customerName: inst.customer_name,
        amount: parsed.amount.toFixed(2),
        paymentDate: parsed.paymentDate,
        debitAccountCode: parsed.debitAccountCode || "10206",
        notes: parsed.notes || null,
        submittedBy: userId,
      }).returning();

      await logActivity(req, "submit_collection", "collection_record", record.id,
        `Submitted collection record: AFN ${parsed.amount.toLocaleString()} for ${inst.customer_name} (${inst.application_id}) Inst #${inst.installment_number}`
      );

      res.status(201).json(record);
    } catch (error: any) {
      console.error("Error creating collection record:", error);
      res.status(400).json({ message: error.message || "Failed to create collection record" });
    }
  });

  app.get("/api/collection-receipt/:installmentId", isAuthenticated, async (req: any, res) => {
    try {
      const { installmentId } = req.params;
      const result = await db.execute(sql`
        SELECT 
          i.id as installment_id,
          i.installment_number,
          i.due_date,
          i.total_amount,
          i.paid_amount,
          i.principle_amount,
          i.margin_amount,
          i.is_paid,
          i.payment_date,
          l.application_id,
          l.product_name,
          l.principle_amount as loan_amount,
          l.total_receivable as loan_total_receivable,
          c.first_name,
          c.last_name,
          c.father_name,
          c.customer_no,
          b.name as branch_name,
          fo.name as officer_name
        FROM installments i
        INNER JOIN loans l ON i.loan_id = l.id
        LEFT JOIN customers c ON l.customer_id = c.id
        LEFT JOIN branches b ON l.branch_id = b.id
        LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
        WHERE i.id = ${installmentId}
      `);
      if (result.rows.length === 0) return res.status(404).json({ message: "Installment not found" });

      const row: any = result.rows[0];

      const collectionResult = await db.execute(sql`
        SELECT cr.id, cr.amount, cr.payment_date, cr.status, cr.submitted_at, cr.notes, cr.debit_account_code,
          cr.submitted_by,
          u.username as submitted_by_name
        FROM collection_records cr
        LEFT JOIN users u ON cr.submitted_by = u.id
        WHERE cr.installment_id = ${installmentId}
        ORDER BY cr.submitted_at DESC
        LIMIT 1
      `);

      const collection = collectionResult.rows.length > 0 ? collectionResult.rows[0] as any : null;

      const totalInstResult = await db.execute(sql`
        SELECT COUNT(*) as total_installments,
          COALESCE(SUM(COALESCE(paid_amount::numeric, 0)), 0) as total_paid_all
        FROM installments WHERE loan_id = (SELECT loan_id FROM installments WHERE id = ${installmentId})
      `);
      const totalInfo: any = totalInstResult.rows[0];

      res.json({
        customerName: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
        fatherName: row.father_name || '',
        customerNo: row.customer_no || '',
        applicationId: row.application_id,
        productName: row.product_name || '',
        loanAmount: row.loan_amount || row.loan_total_receivable || '0',
        branchName: row.branch_name || '',
        officerName: row.officer_name || '',
        installmentNumber: row.installment_number,
        totalInstallments: parseInt(totalInfo.total_installments) || 0,
        dueDate: row.due_date,
        installmentAmount: row.total_amount || '0',
        principleAmount: row.principle_amount || '0',
        marginAmount: row.margin_amount || '0',
        paidAmount: row.paid_amount || '0',
        isPaid: row.is_paid,
        paymentDate: row.payment_date,
        totalPaidAllInstallments: totalInfo.total_paid_all || '0',
        collection: collection ? {
          id: collection.id,
          amount: collection.amount,
          paymentDate: collection.payment_date,
          status: collection.status,
          submittedAt: collection.submitted_at,
          notes: collection.notes,
          collectedBy: collection.submitted_by_name || 'N/A',
        } : null,
      });
    } catch (error: any) {
      console.error("Error fetching collection receipt:", error);
      res.status(500).json({ message: error.message || "Failed to fetch receipt" });
    }
  });

  app.get("/api/collection-records", isAuthenticated, requirePageAccess(["collection-approvals", "collection-entry"]), async (req, res) => {
    try {
      const status = req.query.status as string || "pending";
      let statusFilter = sql`cr.status = ${status}`;
      if (status === "all") statusFilter = sql`1=1`;

      const result = await db.execute(sql`
        SELECT cr.*,
          i.installment_number, i.due_date, i.total_amount as installment_total,
          i.paid_amount as installment_paid, i.is_paid,
          l.application_id, l.product_name,
          l.funding_source_id,
          CONCAT(c.first_name, ' ', c.last_name) as customer_full_name,
          fo.name as finance_officer_name,
          b.name as branch_name,
          u_sub.username as submitted_by_name,
          u_rev.username as reviewed_by_name
        FROM collection_records cr
        LEFT JOIN installments i ON cr.installment_id = i.id
        LEFT JOIN loans l ON cr.loan_id = l.id
        LEFT JOIN customers c ON l.customer_id = c.id
        LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
        LEFT JOIN branches b ON l.branch_id = b.id
        LEFT JOIN users u_sub ON cr.submitted_by = u_sub.id
        LEFT JOIN users u_rev ON cr.reviewed_by = u_rev.id
        WHERE ${statusFilter}
        ORDER BY cr.submitted_at DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching collection records:", error);
      res.status(500).json({ message: "Failed to fetch collection records" });
    }
  });

  app.get("/api/collection-records/pending-count", isAuthenticated, requirePageAccess(["collection-approvals", "collection-entry"]), async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT COUNT(*) as count FROM collection_records WHERE status = 'pending'
      `);
      res.json({ count: parseInt(result.rows[0]?.count as string || "0") });
    } catch (error) {
      console.error("Error fetching pending count:", error);
      res.status(500).json({ message: "Failed to fetch pending count" });
    }
  });

  app.patch("/api/collection-records/:id/approve", isAuthenticated, requirePageAccess("collection-approvals"), async (req: any, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const recordResult = await db.execute(sql`
        SELECT cr.*, l.funding_source_id, l.product_name
        FROM collection_records cr
        LEFT JOIN loans l ON cr.loan_id = l.id
        WHERE cr.id = ${req.params.id}
      `);
      if (recordResult.rows.length === 0) return res.status(404).json({ message: "Record not found" });

      const record: any = recordResult.rows[0];
      if (record.status !== "pending") return res.status(400).json({ message: "Record is not pending" });

      const [claimedRecord] = await db
        .update(collectionRecords)
        .set({
          status: "processing",
          reviewedBy: userId,
          reviewedAt: new Date(),
        })
        .where(and(
          eq(collectionRecords.id, req.params.id),
          eq(collectionRecords.status, "pending")
        ))
        .returning();
      if (!claimedRecord) {
        return res.status(409).json({ message: "This collection record is already being processed or has been reviewed" });
      }
      record.status = claimedRecord.status;

      const amount = parseFloat(record.amount);

      const debitCode = record.debit_account_code || "10206";

      let creditCode = "11000";
      if (record.product_name) {
        const allProducts = await storage.getFinancingProducts();
        const matchedProduct = allProducts.find((p: any) => p.name === record.product_name);
        if (matchedProduct?.receivableAccountCode) {
          creditCode = matchedProduct.receivableAccountCode;
        }
      }

      const debitAccount = await storage.getAccountByCode(debitCode);
      const creditAccount = await storage.getAccountByCode(creditCode);

      if (!debitAccount || !creditAccount) {
        return res.status(400).json({ message: `Account codes not found: debit=${debitCode}, credit=${creditCode}. Please set up the chart of accounts first.` });
      }

      const payResult = await storage.recordPaymentWithOverflow(record.installment_id, amount, record.payment_date);
      const firstInstallment = payResult.paidInstallments[0];
      const installmentNums = payResult.paidInstallments.map((i: any) => `#${i.installmentNumber}`).join(", ");

      const profitDebitAccount = await storage.getAccountByCode("20900");
      const profitCreditAccount = await storage.getAccountByCode("40300");

      let totalMarginApplied = 0;
      for (const inst of payResult.paidInstallments) {
        const applied = parseFloat((inst as any).appliedAmount || "0");
        const total = parseFloat(inst.totalAmount || "0");
        const margin = parseFloat(inst.marginAmount || "0");
        if (total > 0 && applied > 0 && margin > 0) {
          totalMarginApplied += (applied / total) * margin;
        }
      }
      totalMarginApplied = Math.round(totalMarginApplied * 100) / 100;

      const entryNumber = await storage.getNextEntryNumber();
      const description = `Collection: ${record.customer_name} (${record.loan_application_id}) - Inst ${installmentNums} - AFN ${amount.toLocaleString()}`;
      const fundId = record.funding_source_id || null;

      const lines: any[] = [
        {
          accountId: debitAccount.id,
          description: `Cash received - ${record.customer_name} Inst ${installmentNums}`,
          debitAmount: payResult.totalApplied.toFixed(2),
          creditAmount: "0",
          fundingSourceId: fundId,
        },
        {
          accountId: creditAccount.id,
          description: `Loan receivable - ${record.customer_name} Inst ${installmentNums}`,
          debitAmount: "0",
          creditAmount: payResult.totalApplied.toFixed(2),
          fundingSourceId: fundId,
        },
      ];

      if (totalMarginApplied > 0 && profitDebitAccount && profitCreditAccount) {
        lines.push(
          {
            accountId: profitDebitAccount.id,
            description: `Deferred profit recognized - ${record.customer_name} Inst ${installmentNums}`,
            debitAmount: totalMarginApplied.toFixed(2),
            creditAmount: "0",
            fundingSourceId: fundId,
          },
          {
            accountId: profitCreditAccount.id,
            description: `Profit income - ${record.customer_name} Inst ${installmentNums}`,
            debitAmount: "0",
            creditAmount: totalMarginApplied.toFixed(2),
            fundingSourceId: fundId,
          },
        );
      }

      const je = await storage.createJournalEntry(
        {
          entryNumber,
          entryDate: record.payment_date,
          description,
          reference: record.loan_application_id,
          referenceType: "collection",
          referenceId: firstInstallment.id,
          fundingSourceId: fundId,
          isPosted: true,
          createdBy: userId,
          postedBy: userId,
          postedAt: new Date(),
        },
        lines
      );

      await db.execute(sql`
        UPDATE collection_records 
        SET status = 'approved', reviewed_by = ${userId}, reviewed_at = NOW(), journal_entry_id = ${je.id}
        WHERE id = ${req.params.id} AND status = 'processing'
      `);

      try {
        const affected = payResult.paidInstallments.map((inst: any) => ({
          installmentId: inst.id,
          installmentNumber: inst.installmentNumber,
          appliedAmount: inst.appliedAmount,
          prev: inst.previousState,
        }));
        await storage.createPaymentTransaction({
          loanId: record.loan_id || null,
          customerId: record.customer_id || null,
          customerName: record.customer_name || null,
          primaryInstallmentId: record.installment_id,
          amount: amount.toFixed(2),
          totalApplied: payResult.totalApplied.toFixed(2),
          overflow: payResult.overflow.toFixed(2),
          paymentDate: record.payment_date,
          source: "approval",
          collectionRecordId: req.params.id,
          journalEntryId: je.id,
          affectedInstallments: JSON.stringify(affected),
          status: "active",
          recordedBy: userId,
        } as any);
      } catch (txnError: any) {
        console.error("Warning: Failed to record payment transaction:", txnError);
      }

      await logActivity(req, "approve_collection", "collection_record", req.params.id,
        `Approved collection: AFN ${amount.toLocaleString()} for ${record.customer_name} (${record.loan_application_id})`
      );

      res.json({ message: "Collection approved and payment recorded", journalEntryId: je.id });
    } catch (error: any) {
      console.error("Error approving collection record:", error);
      res.status(400).json({ message: error.message || "Failed to approve collection record" });
    }
  });

  app.patch("/api/collection-records/:id/reject", isAuthenticated, requirePageAccess("collection-approvals"), async (req: any, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { reason } = req.body;

      const recordResult = await db.execute(sql`SELECT * FROM collection_records WHERE id = ${req.params.id}`);
      if (recordResult.rows.length === 0) return res.status(404).json({ message: "Record not found" });

      const record: any = recordResult.rows[0];
      if (record.status !== "pending") return res.status(400).json({ message: "Record is not pending" });

      await db.execute(sql`
        UPDATE collection_records 
        SET status = 'rejected', reviewed_by = ${userId}, reviewed_at = NOW(), rejection_reason = ${reason || null}
        WHERE id = ${req.params.id}
      `);

      await logActivity(req, "reject_collection", "collection_record", req.params.id,
        `Rejected collection: AFN ${record.amount} for ${record.customer_name}. Reason: ${reason || 'N/A'}`
      );

      res.json({ message: "Collection record rejected" });
    } catch (error: any) {
      console.error("Error rejecting collection record:", error);
      res.status(400).json({ message: error.message || "Failed to reject collection record" });
    }
  });

  // ===== LOAN TRANSFERS =====

  app.get("/api/loan-transfers", isAuthenticated, requirePageAccess("loan-transfers"), async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT lt.*,
          fo_from.name as from_officer_name,
          fo_to.name as to_officer_name,
          l.application_id,
          CONCAT(c.first_name, ' ', c.last_name) as customer_name,
          l.product_name,
          l.request_amount,
          l.status as loan_status,
          u.username as transferred_by_name
        FROM loan_transfers lt
        LEFT JOIN finance_officers fo_from ON lt.from_officer_id = fo_from.id
        LEFT JOIN finance_officers fo_to ON lt.to_officer_id = fo_to.id
        LEFT JOIN loans l ON lt.loan_id = l.id
        LEFT JOIN customers c ON l.customer_id = c.id
        LEFT JOIN users u ON lt.transferred_by = u.id
        ORDER BY lt.transfer_date DESC
      `);
      res.json(result.rows);
    } catch (error: any) {
      console.error("Error fetching loan transfers:", error);
      res.status(500).json({ message: "Failed to fetch loan transfers" });
    }
  });

  app.get("/api/loan-transfers/officer-loans/:officerId", isAuthenticated, requirePageAccess("loan-transfers"), async (req, res) => {
    try {
      const { officerId } = req.params;
      const statusFilter = req.query.status as string | undefined;
      let query = sql`
        SELECT l.id, l.application_id, l.request_amount, l.status, l.product_name,
          CONCAT(c.first_name, ' ', c.last_name) as customer_name
        FROM loans l
        LEFT JOIN customers c ON l.customer_id = c.id
        WHERE l.finance_officer_id = ${officerId}
      `;
      if (statusFilter && statusFilter !== 'all') {
        query = sql`${query} AND l.status = ${statusFilter}`;
      } else {
        query = sql`${query} AND l.status NOT IN ('completed', 'rejected')`;
      }
      query = sql`${query} ORDER BY l.application_id`;
      const result = await db.execute(query);
      res.json(result.rows);
    } catch (error: any) {
      console.error("Error fetching officer loans:", error);
      res.status(500).json({ message: "Failed to fetch officer loans" });
    }
  });

  app.post("/api/loan-transfers", isAuthenticated, requirePageAccess("loan-transfers"), async (req, res) => {
    try {
      const { fromOfficerId, toOfficerId, loanIds, reason } = req.body;
      if (!fromOfficerId || !toOfficerId || !loanIds || !Array.isArray(loanIds) || !loanIds.length) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      if (fromOfficerId === toOfficerId) {
        return res.status(400).json({ message: "Source and destination officer cannot be the same" });
      }

      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const verifyResult = await db.execute(sql`
        SELECT id, application_id FROM loans
        WHERE id IN (${sql.join(loanIds.map((id: string) => sql`${id}`), sql`, `)})
        AND finance_officer_id = ${fromOfficerId}
      `);
      if (verifyResult.rows.length !== loanIds.length) {
        return res.status(400).json({ message: "Some loans do not belong to the selected source officer" });
      }

      const toOfficerResult = await db.execute(sql`
        SELECT id FROM finance_officers WHERE id = ${toOfficerId} AND is_active = true
      `);
      if (toOfficerResult.rows.length === 0) {
        return res.status(400).json({ message: "Destination officer is not active" });
      }

      const transferRecords: any[] = [];
      await db.transaction(async (tx) => {
        for (const loanId of loanIds) {
          const loan = verifyResult.rows.find((r: any) => r.id === loanId);
          await tx.execute(sql`
            UPDATE loans SET finance_officer_id = ${toOfficerId} WHERE id = ${loanId}
          `);
          const [record] = await tx.insert(loanTransfers).values({
            fromOfficerId,
            toOfficerId,
            loanId,
            loanApplicationId: loan?.application_id || null,
            reason: reason || null,
            transferredBy: userId,
          }).returning();
          transferRecords.push(record);
        }
      });

      await logActivity(req, "loan_transfer", "loan_transfer", transferRecords[0]?.id,
        `Transferred ${loanIds.length} loan(s) from officer ${fromOfficerId} to ${toOfficerId}. Reason: ${reason || 'N/A'}`
      );

      res.json({ message: `Successfully transferred ${loanIds.length} loan(s)`, transfers: transferRecords });
    } catch (error: any) {
      console.error("Error transferring loans:", error);
      res.status(500).json({ message: "Failed to transfer loans" });
    }
  });

  // ===== CUSTOM REPORT BUILDER =====
  app.get("/api/saved-reports", isAuthenticated, requirePageAccess("custom-reports"), async (req, res) => {
    try {
      const reports = await storage.getSavedReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching saved reports:", error);
      res.status(500).json({ message: "Failed to fetch saved reports" });
    }
  });

  app.post("/api/saved-reports", isAuthenticated, requirePageAccess("custom-reports"), async (req: any, res) => {
    try {
      const report = await storage.createSavedReport({
        ...req.body,
        createdBy: req.session.userId,
      });
      await logActivity(req, "create_saved_report", "saved_report", report.id.toString(), `Created saved report: ${report.name}`);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating saved report:", error);
      res.status(500).json({ message: "Failed to save report" });
    }
  });

  app.delete("/api/saved-reports/:id", isAuthenticated, requirePageAccess("custom-reports"), async (req: any, res) => {
    try {
      await storage.deleteSavedReport(parseInt(req.params.id));
      await logActivity(req, "delete_saved_report", "saved_report", req.params.id, "Deleted saved report");
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting saved report:", error);
      res.status(500).json({ message: "Failed to delete saved report" });
    }
  });

  const customReportFieldDefs: Record<string, { key: string; label: string; type: string; source: string }[]> = {
    customers: [
      { key: "c_customer_no", label: "Customer No", type: "text", source: "customers" },
      { key: "c_first_name", label: "First Name", type: "text", source: "customers" },
      { key: "c_last_name", label: "Last Name", type: "text", source: "customers" },
      { key: "c_father_name", label: "Father's Name", type: "text", source: "customers" },
      { key: "c_full_name_dari", label: "Full Name (Dari)", type: "text", source: "customers" },
      { key: "c_gender", label: "Gender", type: "text", source: "customers" },
      { key: "c_marital_status", label: "Marital Status", type: "text", source: "customers" },
      { key: "c_national_id", label: "National ID", type: "text", source: "customers" },
      { key: "c_date_of_birth", label: "Date of Birth", type: "date", source: "customers" },
      { key: "c_place_of_birth", label: "Place of Birth", type: "text", source: "customers" },
      { key: "c_home_address", label: "Home Address", type: "text", source: "customers" },
      { key: "c_province", label: "Province", type: "text", source: "customers" },
      { key: "c_district", label: "District", type: "text", source: "customers" },
      { key: "c_area_type", label: "Urban/Rural", type: "text", source: "customers" },
      { key: "c_phone_number", label: "Phone Number", type: "text", source: "customers" },
      { key: "c_second_phone_number", label: "2nd Phone", type: "text", source: "customers" },
      { key: "c_number_of_dependents", label: "Dependents", type: "number", source: "customers" },
      { key: "c_nid_expiry_date", label: "NID Expiry Date", type: "date", source: "customers" },
      { key: "c_created_at", label: "Customer Created Date", type: "date", source: "customers" },
    ],
    loans: [
      { key: "l_application_id", label: "Application ID", type: "text", source: "loans" },
      { key: "l_product_name", label: "Product", type: "text", source: "loans" },
      { key: "l_product_code", label: "Product Code", type: "text", source: "loans" },
      { key: "l_status", label: "Loan Status", type: "text", source: "loans" },
      { key: "l_request_amount", label: "Request Amount", type: "number", source: "loans" },
      { key: "l_principle_amount", label: "Principal Amount", type: "number", source: "loans" },
      { key: "l_margin_rate", label: "Margin Rate", type: "number", source: "loans" },
      { key: "l_financing_duration_months", label: "Duration (Months)", type: "number", source: "loans" },
      { key: "l_grace_period", label: "Grace Period", type: "number", source: "loans" },
      { key: "l_number_of_installments", label: "No. of Installments", type: "number", source: "loans" },
      { key: "l_request_date", label: "Request Date", type: "date", source: "loans" },
      { key: "l_sector", label: "Sector", type: "text", source: "loans" },
      { key: "l_business_description", label: "Business", type: "text", source: "loans" },
      { key: "l_financing_purpose", label: "Financing Purpose", type: "text", source: "loans" },
      { key: "l_client_occupation", label: "Occupation", type: "text", source: "loans" },
      { key: "l_branch_name", label: "Branch", type: "text", source: "loans" },
      { key: "l_officer_name", label: "Finance Officer", type: "text", source: "loans" },
      { key: "l_funding_source", label: "Funding Source", type: "text", source: "loans" },
    ],
    installments: [
      { key: "i_installment_number", label: "Installment #", type: "number", source: "installments" },
      { key: "i_due_date", label: "Due Date", type: "date", source: "installments" },
      { key: "i_principle_amount", label: "Installment Principal", type: "number", source: "installments" },
      { key: "i_margin_amount", label: "Installment Margin", type: "number", source: "installments" },
      { key: "i_total_amount", label: "Installment Total", type: "number", source: "installments" },
      { key: "i_paid_amount", label: "Paid Amount", type: "number", source: "installments" },
      { key: "i_payment_date", label: "Payment Date", type: "date", source: "installments" },
      { key: "i_is_paid", label: "Is Paid", type: "text", source: "installments" },
      { key: "i_late_days", label: "Days Overdue", type: "number", source: "installments" },
    ],
    guarantors: [
      { key: "g_guarantor_type", label: "Guarantor Type", type: "text", source: "guarantors" },
      { key: "g_full_name", label: "Guarantor Name", type: "text", source: "guarantors" },
      { key: "g_father_name", label: "Guarantor Father's Name", type: "text", source: "guarantors" },
      { key: "g_national_id", label: "Guarantor NID", type: "text", source: "guarantors" },
      { key: "g_phone_number", label: "Guarantor Phone", type: "text", source: "guarantors" },
      { key: "g_home_address", label: "Guarantor Address", type: "text", source: "guarantors" },
      { key: "g_province", label: "Guarantor Province", type: "text", source: "guarantors" },
      { key: "g_district", label: "Guarantor District", type: "text", source: "guarantors" },
      { key: "g_relationship_with_customer", label: "Relationship", type: "text", source: "guarantors" },
      { key: "g_monthly_income", label: "Guarantor Monthly Income", type: "number", source: "guarantors" },
      { key: "g_inventory", label: "Guarantor Asset", type: "number", source: "guarantors" },
    ],
    disbursements: [
      { key: "d_disbursement_date", label: "Disbursement Date", type: "date", source: "disbursements" },
      { key: "d_disbursed_by_id", label: "Disbursed By", type: "text", source: "disbursements" },
    ],
  };

  function buildMultiSourceQuery(dataSources: string[]): { queryStr: string; allFields: string[] } {
    const sources = new Set(dataSources);
    const selectParts: string[] = [];
    const allFields: string[] = [];

    if (sources.has("customers")) {
      selectParts.push(`c.customer_no AS c_customer_no, c.first_name AS c_first_name, c.last_name AS c_last_name,
        c.father_name AS c_father_name, c.full_name_dari AS c_full_name_dari, c.gender AS c_gender,
        c.marital_status AS c_marital_status, c.national_id AS c_national_id, c.date_of_birth AS c_date_of_birth,
        c.place_of_birth AS c_place_of_birth, c.home_address AS c_home_address, c.province AS c_province,
        c.district AS c_district, c.area_type AS c_area_type, c.phone_number AS c_phone_number,
        c.second_phone_number AS c_second_phone_number, c.number_of_dependents AS c_number_of_dependents,
        c.nid_expiry_date AS c_nid_expiry_date, c.created_at AS c_created_at`);
      allFields.push(...(customReportFieldDefs.customers || []).map(f => f.key));
    }

    if (sources.has("loans")) {
      selectParts.push(`l.application_id AS l_application_id, l.product_name AS l_product_name,
        l.product_code AS l_product_code, l.status AS l_status, l.request_amount AS l_request_amount,
        l.principle_amount AS l_principle_amount, l.margin_rate AS l_margin_rate,
        l.financing_duration_months AS l_financing_duration_months, l.grace_period AS l_grace_period,
        l.number_of_installments AS l_number_of_installments, l.request_date AS l_request_date,
        l.sector AS l_sector, l.business_description AS l_business_description,
        l.financing_purpose AS l_financing_purpose, l.client_occupation AS l_client_occupation,
        b.name AS l_branch_name, fo.name AS l_officer_name, fs.name AS l_funding_source`);
      allFields.push(...(customReportFieldDefs.loans || []).map(f => f.key));
    }

    if (sources.has("installments")) {
      selectParts.push(`i.installment_number AS i_installment_number, i.due_date AS i_due_date,
        i.principle_amount AS i_principle_amount, i.margin_amount AS i_margin_amount,
        i.total_amount AS i_total_amount, i.paid_amount AS i_paid_amount,
        i.payment_date AS i_payment_date, i.is_paid AS i_is_paid, i.late_days AS i_late_days`);
      allFields.push(...(customReportFieldDefs.installments || []).map(f => f.key));
    }

    if (sources.has("guarantors")) {
      selectParts.push(`g.guarantor_type AS g_guarantor_type, g.full_name AS g_full_name,
        g.father_name AS g_father_name, g.national_id AS g_national_id,
        g.phone_number AS g_phone_number, g.home_address AS g_home_address,
        g.province AS g_province, g.district AS g_district,
        g.relationship_with_customer AS g_relationship_with_customer,
        g.monthly_income AS g_monthly_income, g.inventory AS g_inventory`);
      allFields.push(...(customReportFieldDefs.guarantors || []).map(f => f.key));
    }

    if (sources.has("disbursements")) {
      selectParts.push(`d.disbursement_date AS d_disbursement_date,
        d.disbursed_by_id AS d_disbursed_by_id`);
      allFields.push(...(customReportFieldDefs.disbursements || []).map(f => f.key));
    }

    const selectClause = `SELECT ${selectParts.join(", ")}`;

    let fromClause = "";
    const needsLoans = sources.has("loans") || sources.has("installments") || sources.has("guarantors") || sources.has("disbursements");
    const needsInstallments = sources.has("installments");

    if (sources.has("customers") && !needsLoans) {
      fromClause = " FROM customers c";
    } else if (sources.has("customers") && needsLoans) {
      fromClause = " FROM customers c LEFT JOIN loans l ON l.customer_id = c.id";
    } else if (needsLoans) {
      fromClause = " FROM loans l LEFT JOIN customers c ON l.customer_id = c.id";
    }

    if (needsLoans && !fromClause.includes("loans l")) {
      fromClause = " FROM loans l LEFT JOIN customers c ON l.customer_id = c.id";
    }

    if (sources.has("loans") || needsLoans) {
      if (!fromClause.includes("branches b")) {
        fromClause += " LEFT JOIN branches b ON l.branch_id = b.id";
      }
      if (!fromClause.includes("finance_officers fo")) {
        fromClause += " LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id";
      }
      if (sources.has("loans") && !fromClause.includes("funding_sources fs")) {
        fromClause += " LEFT JOIN funding_sources fs ON l.funding_source_id = fs.id";
      }
    }

    if (needsInstallments && !fromClause.includes("installments i")) {
      fromClause += " LEFT JOIN installments i ON i.loan_id = l.id";
    }

    if (sources.has("guarantors") && !fromClause.includes("guarantors g")) {
      fromClause += " LEFT JOIN guarantors g ON g.loan_id = l.id";
    }

    if (sources.has("disbursements") && !fromClause.includes("disbursements d")) {
      fromClause += " LEFT JOIN disbursements d ON d.loan_id = l.id";
    }

    if (sources.has("loans") && !fromClause.includes("funding_sources fs")) {
      fromClause += " LEFT JOIN funding_sources fs ON l.funding_source_id = fs.id";
    }

    return { queryStr: selectClause + fromClause, allFields };
  }

  const singleSourceQueries: Record<string, string> = {
    customers: `
      SELECT c.customer_no AS c_customer_no, c.first_name AS c_first_name, c.last_name AS c_last_name,
        c.father_name AS c_father_name, c.full_name_dari AS c_full_name_dari, c.gender AS c_gender,
        c.marital_status AS c_marital_status, c.national_id AS c_national_id, c.date_of_birth AS c_date_of_birth,
        c.place_of_birth AS c_place_of_birth, c.home_address AS c_home_address, c.province AS c_province,
        c.district AS c_district, c.area_type AS c_area_type, c.phone_number AS c_phone_number,
        c.second_phone_number AS c_second_phone_number, c.number_of_dependents AS c_number_of_dependents,
        c.nid_expiry_date AS c_nid_expiry_date, c.created_at AS c_created_at
      FROM customers c
    `,
    loans: `
      SELECT l.application_id AS l_application_id, l.product_name AS l_product_name,
        l.product_code AS l_product_code, l.status AS l_status, l.request_amount AS l_request_amount,
        l.principle_amount AS l_principle_amount, l.margin_rate AS l_margin_rate,
        l.financing_duration_months AS l_financing_duration_months, l.grace_period AS l_grace_period,
        l.number_of_installments AS l_number_of_installments, l.request_date AS l_request_date,
        l.sector AS l_sector, l.business_description AS l_business_description,
        l.financing_purpose AS l_financing_purpose, l.client_occupation AS l_client_occupation,
        b.name AS l_branch_name, fo.name AS l_officer_name, fs.name AS l_funding_source,
        COALESCE(c.first_name, '') || ' ' || COALESCE(c.last_name, '') AS c_customer_name,
        c.customer_no AS c_customer_no, c.national_id AS c_national_id
      FROM loans l
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      LEFT JOIN funding_sources fs ON l.funding_source_id = fs.id
    `,
    installments: `
      SELECT i.installment_number AS i_installment_number, i.due_date AS i_due_date,
        i.principle_amount AS i_principle_amount, i.margin_amount AS i_margin_amount,
        i.total_amount AS i_total_amount, i.paid_amount AS i_paid_amount,
        i.payment_date AS i_payment_date, i.is_paid AS i_is_paid, i.late_days AS i_late_days,
        l.application_id AS l_application_id, l.product_name AS l_product_name, l.status AS l_status,
        COALESCE(c.first_name, '') || ' ' || COALESCE(c.last_name, '') AS c_customer_name,
        c.customer_no AS c_customer_no,
        b.name AS l_branch_name, fo.name AS l_officer_name
      FROM installments i
      LEFT JOIN loans l ON i.loan_id = l.id
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
    `,
    guarantors: `
      SELECT g.guarantor_type AS g_guarantor_type, g.full_name AS g_full_name,
        g.father_name AS g_father_name, g.national_id AS g_national_id,
        g.phone_number AS g_phone_number, g.home_address AS g_home_address,
        g.province AS g_province, g.district AS g_district,
        g.relationship_with_customer AS g_relationship_with_customer,
        g.monthly_income AS g_monthly_income, g.inventory AS g_inventory,
        l.application_id AS l_application_id, l.product_name AS l_product_name,
        COALESCE(c.first_name, '') || ' ' || COALESCE(c.last_name, '') AS c_customer_name,
        c.customer_no AS c_customer_no,
        b.name AS l_branch_name
      FROM guarantors g
      LEFT JOIN loans l ON g.loan_id = l.id
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
    `,
    disbursements: `
      SELECT d.disbursement_date AS d_disbursement_date, d.disbursed_by_id AS d_disbursed_by_id,
        l.application_id AS l_application_id, l.product_name AS l_product_name,
        l.request_amount AS l_request_amount, l.principle_amount AS l_principle_amount,
        l.margin_rate AS l_margin_rate, l.status AS l_status,
        COALESCE(c.first_name, '') || ' ' || COALESCE(c.last_name, '') AS c_customer_name,
        c.customer_no AS c_customer_no, c.national_id AS c_national_id,
        b.name AS l_branch_name, fo.name AS l_officer_name, fs.name AS l_funding_source
      FROM disbursements d
      LEFT JOIN loans l ON d.loan_id = l.id
      LEFT JOIN customers c ON l.customer_id = c.id
      LEFT JOIN branches b ON l.branch_id = b.id
      LEFT JOIN finance_officers fo ON l.finance_officer_id = fo.id
      LEFT JOIN funding_sources fs ON l.funding_source_id = fs.id
    `,
  };

  const customReportColumnMap: Record<string, string> = {
    // customers
    c_customer_no: "c.customer_no", c_first_name: "c.first_name", c_last_name: "c.last_name",
    c_father_name: "c.father_name", c_full_name_dari: "c.full_name_dari", c_gender: "c.gender",
    c_marital_status: "c.marital_status", c_national_id: "c.national_id", c_date_of_birth: "c.date_of_birth",
    c_place_of_birth: "c.place_of_birth", c_home_address: "c.home_address", c_province: "c.province",
    c_district: "c.district", c_area_type: "c.area_type", c_phone_number: "c.phone_number",
    c_second_phone_number: "c.second_phone_number", c_number_of_dependents: "c.number_of_dependents",
    c_nid_expiry_date: "c.nid_expiry_date", c_created_at: "c.created_at",
    // loans
    l_application_id: "l.application_id", l_product_name: "l.product_name", l_product_code: "l.product_code",
    l_status: "l.status", l_request_amount: "l.request_amount", l_principle_amount: "l.principle_amount",
    l_margin_rate: "l.margin_rate", l_financing_duration_months: "l.financing_duration_months",
    l_grace_period: "l.grace_period", l_number_of_installments: "l.number_of_installments",
    l_request_date: "l.request_date", l_sector: "l.sector", l_business_description: "l.business_description",
    l_financing_purpose: "l.financing_purpose", l_client_occupation: "l.client_occupation",
    l_branch_name: "b.name", l_officer_name: "fo.name", l_funding_source: "fs.name",
    // installments
    i_installment_number: "i.installment_number", i_due_date: "i.due_date",
    i_principle_amount: "i.principle_amount", i_margin_amount: "i.margin_amount",
    i_total_amount: "i.total_amount", i_paid_amount: "i.paid_amount", i_payment_date: "i.payment_date",
    i_is_paid: "i.is_paid", i_late_days: "i.late_days",
    // guarantors
    g_guarantor_type: "g.guarantor_type", g_full_name: "g.full_name", g_father_name: "g.father_name",
    g_national_id: "g.national_id", g_phone_number: "g.phone_number", g_home_address: "g.home_address",
    g_province: "g.province", g_district: "g.district", g_relationship_with_customer: "g.relationship_with_customer",
    g_monthly_income: "g.monthly_income", g_inventory: "g.inventory",
    // disbursements
    d_disbursement_date: "d.disbursement_date", d_disbursed_by_id: "d.disbursed_by_id",
  };

  const customReportTypeMap: Record<string, string> = Object.fromEntries(
    Object.values(customReportFieldDefs).flat().map(f => [f.key, f.type])
  );

  app.post("/api/custom-reports/generate", isAuthenticated, requirePageAccess("custom-reports"), async (req: any, res) => {
    try {
      const { dataSource, dataSources, columns, filters, groupBy, sortBy, sortOrder } = req.body;

      const sources: string[] = dataSources && Array.isArray(dataSources) && dataSources.length > 0
        ? dataSources
        : (dataSource ? [dataSource] : []);

      const validSources = ["customers","loans","installments","guarantors","disbursements"];
      const filteredSources = sources.filter(s => validSources.includes(s));
      if (filteredSources.length === 0) {
        return res.status(400).json({ message: "Select at least one data source" });
      }

      let baseQuery: string;
      let allValidFields: string[];

      if (filteredSources.length === 1) {
        const src = filteredSources[0];
        baseQuery = singleSourceQueries[src];
        const srcFields = customReportFieldDefs[src]?.map(f => f.key) || [];
        const extraFields = Object.keys((await db.execute(sql`${sql.raw(baseQuery)} LIMIT 0`)).rows?.[0] || {});
        allValidFields = [...new Set([...srcFields, ...extraFields])];
      } else {
        const result = buildMultiSourceQuery(filteredSources);
        baseQuery = result.queryStr;
        allValidFields = result.allFields;
      }

      const allowedFields = new Set(allValidFields);
      const validOperators = new Set(["equals","not_equals","contains","starts_with","greater_than","less_than","between","is_null","is_not_null"]);

      const whereFragments: any[] = [];

      if (filters && Array.isArray(filters)) {
        for (const filter of filters) {
          const { field, operator, value } = filter;
          if (!allowedFields.has(field) || !validOperators.has(operator)) continue;

          // WHERE cannot reference SELECT aliases, so map the alias to the real column expression.
          const col = customReportColumnMap[field];
          if (!col) continue;
          const colSql = sql.raw(col);
          const isDate = customReportTypeMap[field] === "date";

          switch (operator) {
            case "equals":
              if (isDate) whereFragments.push(sql`CAST(${colSql} AS DATE) = CAST(${value} AS DATE)`);
              else whereFragments.push(sql`${colSql} = ${value}`);
              break;
            case "not_equals":
              if (isDate) whereFragments.push(sql`CAST(${colSql} AS DATE) <> CAST(${value} AS DATE)`);
              else whereFragments.push(sql`${colSql} != ${value}`);
              break;
            case "contains":
              whereFragments.push(sql`CAST(${colSql} AS TEXT) ILIKE ${'%' + value + '%'}`);
              break;
            case "starts_with":
              whereFragments.push(sql`CAST(${colSql} AS TEXT) ILIKE ${value + '%'}`);
              break;
            case "greater_than":
              if (isDate) whereFragments.push(sql`CAST(${colSql} AS DATE) > CAST(${value} AS DATE)`);
              else whereFragments.push(sql`CAST(${colSql} AS NUMERIC) > ${Number(value)}`);
              break;
            case "less_than":
              if (isDate) whereFragments.push(sql`CAST(${colSql} AS DATE) < CAST(${value} AS DATE)`);
              else whereFragments.push(sql`CAST(${colSql} AS NUMERIC) < ${Number(value)}`);
              break;
            case "between":
              if (filter.value2) {
                if (isDate) whereFragments.push(sql`CAST(${colSql} AS DATE) >= CAST(${value} AS DATE) AND CAST(${colSql} AS DATE) <= CAST(${filter.value2} AS DATE)`);
                else whereFragments.push(sql`${colSql} >= ${value} AND ${colSql} <= ${filter.value2}`);
              }
              break;
            case "is_null":
              whereFragments.push(sql`${colSql} IS NULL`);
              break;
            case "is_not_null":
              whereFragments.push(sql`${colSql} IS NOT NULL`);
              break;
          }
        }
      }

      let fullQuery;
      if (whereFragments.length > 0) {
        fullQuery = sql`${sql.raw(baseQuery)} WHERE ${sql.join(whereFragments, sql` AND `)}`;
      } else {
        fullQuery = sql`${sql.raw(baseQuery)}`;
      }

      const safeSortBy = sortBy && sortBy !== "none" && allowedFields.has(sortBy) ? sortBy : null;
      if (safeSortBy) {
        const direction = sortOrder === "desc" ? sql.raw("DESC") : sql.raw("ASC");
        fullQuery = sql`${fullQuery} ORDER BY ${sql.raw(safeSortBy)} ${direction} NULLS LAST`;
      }

      fullQuery = sql`${fullQuery} LIMIT 10000`;

      const result = await db.execute(fullQuery);
      let rows = result.rows as any[];

      const safeGroupBy = groupBy && groupBy !== "none" && allowedFields.has(groupBy) ? groupBy : null;
      if (safeGroupBy) {
        const grouped: Record<string, any> = {};
        for (const row of rows) {
          const key = (row as any)[safeGroupBy] ?? "(empty)";
          if (!grouped[key]) {
            grouped[key] = { group: key, count: 0, rows: [] };
          }
          grouped[key].count++;
          grouped[key].rows.push(row);
        }
        res.json({ data: rows, grouped: Object.values(grouped), total: rows.length });
      } else {
        res.json({ data: rows, total: rows.length });
      }
    } catch (error: any) {
      console.error("Error generating custom report:", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  app.get("/api/custom-reports/fields/:dataSource", isAuthenticated, async (req, res) => {
    const source = req.params.dataSource;
    const sources = source.includes(",") ? source.split(",").filter(Boolean) : [source];
    const validSources = ["customers","loans","installments","guarantors","disbursements"];
    const filteredSources = sources.filter(s => validSources.includes(s));

    if (filteredSources.length === 0) {
      return res.status(400).json({ message: "Invalid data source" });
    }

    const combinedFields: { key: string; label: string; type: string; source: string }[] = [];
    const seenKeys = new Set<string>();

    for (const src of filteredSources) {
      const srcFields = customReportFieldDefs[src] || [];
      for (const field of srcFields) {
        if (!seenKeys.has(field.key)) {
          seenKeys.add(field.key);
          combinedFields.push(field);
        }
      }
    }

    if (filteredSources.length === 1) {
      const singleQuery = singleSourceQueries[filteredSources[0]];
      if (singleQuery) {
        const colMatch = singleQuery.match(/AS\s+(\w+)/gi);
        if (colMatch) {
          for (const m of colMatch) {
            const alias = m.replace(/^AS\s+/i, "");
            if (!seenKeys.has(alias) && alias !== "c_customer_name") {
              seenKeys.add(alias);
              combinedFields.push({
                key: alias,
                label: alias.replace(/^[a-z]_/, "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                type: "text",
                source: filteredSources[0],
              });
            }
          }
          if (!seenKeys.has("c_customer_name")) {
            const hasCustomerName = singleQuery.includes("c_customer_name");
            if (hasCustomerName) {
              combinedFields.unshift({ key: "c_customer_name", label: "Customer Name", type: "text", source: filteredSources[0] });
            }
          }
        }
      }
    }

    res.json(combinedFields);
  });

  // Seed data on startup
  try {
    await storage.seedData();
  } catch (error) {
    console.log("Seed data already exists or error seeding:", error);
  }

  return httpServer;
}
