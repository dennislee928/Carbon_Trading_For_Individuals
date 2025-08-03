import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 從請求頭獲取 token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "未提供認證令牌" }, { status: 401 });
    }

    // 模擬當前用戶數據
    const currentUser = {
      id: "user-001",
      email: "user@example.com",
      name: "測試用戶",
      role: "user",
      status: "active",
      level: 2,
      address: "台北市信義區",
      phone: "+886912345678",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      last_login: "2024-01-15T10:30:00Z",
    };

    return NextResponse.json({
      status: "success",
      data: currentUser,
    });
  } catch (error) {
    console.error("獲取當前用戶錯誤:", error);
    return NextResponse.json(
      { error: "無法獲取當前用戶數據" },
      { status: 500 }
    );
  }
}
