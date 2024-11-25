import { SignJWT, jwtVerify } from "jose";
// Correct
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-default-secret-key"
);

export async function signToken(payload: any) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);
    return token;
  } catch (error) {
    console.error("Error signing token:", error);
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
}

// Add export setSession
export async function setSession(token: string) {
  cookies().set({
    name: "session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });
}
