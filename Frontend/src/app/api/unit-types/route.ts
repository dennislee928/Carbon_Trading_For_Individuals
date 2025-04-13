// eslint-disable-next-line @typescript-eslint/no-unused-vars

// app/api/unit-types/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Replace with your actual API endpoint
    const apiUrl = `${process.env.API_BASE_URL}/unit-types`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch unit types" },
      { status: 500 }
    );
  }
}
