// app/api/search/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    // Replace with your actual API endpoint
    const apiUrl = `${process.env.API_BASE_URL}/emission-factors/search`;
    const response = await fetch(apiUrl + "?" + searchParams.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
