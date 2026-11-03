import { SignJWT, jwtVerify } from "jose";
import { getJwtSecret, getJwtExpiration } from "@/lib/env";
import { UserRole } from "@/lib/db/models/User";

export interface AuthTokenPayload {
  sub: string; // User ID
  email: string;
  name: string;
  role: UserRole;
  [key: string]: unknown;
}

const ISSUER = "kara-pardaz-auth";
const AUDIENCE = "kara-pardaz-cms";

/**
 * Signs a cryptographically secure JWT using HS256 algorithm.
 */
export async function signAuthToken(
  payload: Omit<AuthTokenPayload, "iss" | "aud" | "exp" | "nbf" | "iat">,
): Promise<string> {
  const secret = getJwtSecret();
  const exp = getJwtExpiration();

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(exp)
    .sign(secret);
}

/**
 * Verifies and decodes a JWT token. Returns null if invalid or expired.
 */
export async function verifyAuthToken(
  token: string,
): Promise<AuthTokenPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}
