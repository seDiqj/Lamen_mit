import crypto from "crypto";
import { authenticator } from "otplib";
import QRCode from "qrcode";

authenticator.options = { window: 1, step: 30 };

const ENC_KEY = crypto
  .createHash("sha256")
  .update(process.env.SESSION_SECRET || "lamen-mfi-dev-secret")
  .digest();

export function encryptSecret(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENC_KEY, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${enc.toString("base64")}.${tag.toString("base64")}`;
}

export function decryptSecret(encoded: string): string {
  const [ivB64, dataB64, tagB64] = encoded.split(".");
  const iv = Buffer.from(ivB64, "base64");
  const data = Buffer.from(dataB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", ENC_KEY, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString("utf8");
}

export function generateSecret(): string {
  return authenticator.generateSecret();
}

export function buildOtpAuthUrl(secret: string, accountLabel: string): string {
  return authenticator.keyuri(accountLabel, "Lamen MFI", secret);
}

export async function buildQrDataUrl(otpAuthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpAuthUrl, { margin: 1, width: 240 });
}

export function verifyTotp(code: string, encryptedSecret: string): boolean {
  if (!code || !encryptedSecret) return false;
  try {
    const secret = decryptSecret(encryptedSecret);
    return authenticator.verify({ token: code.replace(/\s/g, ""), secret });
  } catch {
    return false;
  }
}

export function normalizeTotp(code: string): string {
  return (code || "").replace(/\s/g, "");
}

export function generateBackupCodes(count = 10): string[] {
  return Array.from({ length: count }, () => {
    const raw = crypto.randomBytes(5).toString("hex").toUpperCase();
    return `${raw.slice(0, 5)}-${raw.slice(5, 10)}`;
  });
}

export function hashBackupCode(code: string): string {
  const normalized = code.replace(/[\s-]/g, "").toUpperCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export function generateTrustToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashTrustToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const TRUST_DEVICE_DAYS = 7;
export const TRUST_COOKIE_NAME = "lamen_td";
