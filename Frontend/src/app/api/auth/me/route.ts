import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 從請求頭獲取 Authorization token
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

    // 這裡應該驗證 JWT token，但為了演示我們返回一個模擬用戶
    // 在實際應用中，您需要驗證 token 並從數據庫獲取用戶信息
    const mockUser = {
      id: "user-123",
      email: "user@example.com",
      name: "測試用戶",
      role: "user",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockUser,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "內部伺服器錯誤",
      },
      { status: 500 }
    );
  }
}
