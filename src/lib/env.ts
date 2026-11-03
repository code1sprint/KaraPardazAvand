/**
 * Environment configuration helper with validation.
 * Keeps production secrets safe and provides clear errors when missing.
 */

export function getMongoUri(): string | null {
  return process.env.MONGODB_URI || null;
}

export function getJwtSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV === "production"
      ? null
      : "kara_pardaz_development_fallback_secret_must_change_in_prod_12345678");

  if (!secret) {
    throw new Error(
      "CRITICAL: JWT_SECRET environment variable is missing in production.",
    );
  }

  return new TextEncoder().encode(secret);
}

export function getJwtExpiration(): string {
  return process.env.JWT_EXPIRES_IN || "7d";
}
