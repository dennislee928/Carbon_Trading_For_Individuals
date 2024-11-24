import { NextResponse } from "next/server";
import { hash } from "bcryptjs"; // Use bcryptjs instead of bcrypt

export const runtime = "edge"; // This can now be edge runtime

export async function POST(request: Request) {
  const { password } = await request.json();
  const hashedPassword = await hash(password, 10);

  return NextResponse.json({ hashedPassword });
}
