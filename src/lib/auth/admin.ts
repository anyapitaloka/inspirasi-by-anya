import crypto from "crypto";
import type { AdminRole, AdminUser } from "../types";

const ADMIN_SECRET =
  process.env.ADMIN_SESSION_SECRET || "anya-genz-fashion-secure-secret-2026-fallback-key";

/**
 * Hash password with SHA-256 for secure verification
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// In-Memory Brute Force / Rate Limit Tracker
interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Clean up old expired rate limit records periodically
 */
function cleanupExpiredRecords() {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    if (record.lockedUntil && record.lockedUntil < now) {
      loginAttempts.delete(key);
    } else if (now - record.lastAttempt > LOCKOUT_MS) {
      loginAttempts.delete(key);
    }
  }
}

/**
 * Check if the given identifier (IP or username) is currently locked out
 */
export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  lockedMinutes?: number;
} {
  cleanupExpiredRecords();
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingMs = record.lockedUntil - now;
    const lockedMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
    return { allowed: false, remainingAttempts: 0, lockedMinutes };
  }

  // If lockout passed, reset
  if (record.lockedUntil && record.lockedUntil <= now) {
    loginAttempts.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.count);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

/**
 * Record a failed login attempt. Locks account if MAX_ATTEMPTS reached.
 */
export function recordFailedLoginAttempt(identifier: string): {
  isLocked: boolean;
  remainingAttempts: number;
  lockedMinutes?: number;
} {
  cleanupExpiredRecords();
  const now = Date.now();
  const record = loginAttempts.get(identifier) || {
    count: 0,
    lockedUntil: null,
    lastAttempt: now,
  };

  record.count += 1;
  record.lastAttempt = now;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    loginAttempts.set(identifier, record);
    return { isLocked: true, remainingAttempts: 0, lockedMinutes: 15 };
  }

  loginAttempts.set(identifier, record);
  return {
    isLocked: false,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.count),
  };
}

/**
 * Reset failed attempts upon successful authentication
 */
export function resetLoginRateLimit(identifier: string): void {
  loginAttempts.delete(identifier);
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: AdminRole;
  name: string;
  exp: number; // unix timestamp in seconds
}

/**
 * Sign session token with HMAC-SHA256
 */
export function signSessionToken(payload: Omit<SessionPayload, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const data: SessionPayload = { ...payload, exp };
  const encodedData = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(encodedData)
    .digest("base64url");
  return `${encodedData}.${signature}`;
}

/**
 * Verify session token
 */
export function verifySessionToken(token?: string): SessionPayload | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedData, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(encodedData)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(encodedData, "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(jsonStr);

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
