import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_CARBON_API_URL ||
  "https://apiv1-carbontrading.dennisleehappy.org/api/v1";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // 如果沒有token，返回一個空的碳權列表
      return NextResponse.json([]);
    }

    const token = authHeader.substring(7);

    const response = await axios.get(`${API_BASE_URL}/carbonCredits`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Get carbon credits API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "獲取碳權列表失敗",
      },
      { status: 500 }
    );
  }
}
