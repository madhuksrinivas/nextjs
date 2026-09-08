import crypto from "node:crypto";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Kept on `global` so it survives Next.js dev-mode hot reloads, like mongodb.js does.
const otpStore = global.otpStore || new Map();
global.otpStore = otpStore;

export function createOtp(email) {
  const code = crypto.randomInt(100000, 999999).toString();
  otpStore.set(email, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    verified: false,
  });
  return code;
}

export function verifyOtp(email, code) {
  const entry = otpStore.get(email);

  if (!entry) {
    return {
      success: false,
      message: "No verification code found. Please request a new one.",
    };
  }
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email);
    return {
      success: false,
      message: "Code expired. Please request a new one.",
    };
  }
  if (entry.code !== code) {
    return { success: false, message: "Incorrect code. Please try again." };
  }

  entry.verified = true;
  return { success: true, message: "Email verified successfully." };
}

export function isEmailVerified(email) {
  return !!otpStore.get(email)?.verified;
}

export function clearOtp(email) {
  otpStore.delete(email);
}
