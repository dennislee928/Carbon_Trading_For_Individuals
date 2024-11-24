// app/api/auth/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { password } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  return NextResponse.json({ hashedPassword });
}
