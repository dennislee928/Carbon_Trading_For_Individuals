// app/api/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

// Remove the nodejs runtime specification since we're using bcryptjs
// which is compatible with Edge Runtime
export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    return NextResponse.json({ hashedPassword });
  } catch (error) {
    console.error("Password hashing error:", error);
    return NextResponse.json(
      { error: "Failed to hash password" },
      { status: 500 }
    );
  }
}
