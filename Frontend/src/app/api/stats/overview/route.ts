import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_CARBON_API_URL ||
  "https://apiv1-carbontrading.dennisleehappy.org/api/v1";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "未提供有效的認證令牌",
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const response = await axios.get(`${API_BASE_URL}/stats/overview`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Get stats overview API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "獲取統計概覽失敗",
      },
      { status: 500 }
    );
  }
}
