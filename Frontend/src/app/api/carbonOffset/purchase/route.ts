import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_CARBON_API_URL ||
  "https://apiv1-carbontrading.dennisleehappy.org/api/v1";

export async function POST(request: NextRequest) {
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
    const body = await request.json();

    const response = await axios.post(`${API_BASE_URL}/market/purchase`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Purchase carbon offset API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "購買碳權抵消失敗",
      },
      { status: 500 }
    );
  }
}
