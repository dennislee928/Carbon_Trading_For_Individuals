import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // 模擬用戶資產數據
    const mockAssets = [
      {
        id: "asset-001",
        user_id: userId,
        credit_type: "VER",
        project_type: "再生能源",
        quantity: 150,
        vintage_year: 2023,
        created_at: "2024-01-15T10:30:00Z",
      },
      {
        id: "asset-002",
        user_id: userId,
        credit_type: "REDD+",
        project_type: "森林保護",
        quantity: 75,
        vintage_year: 2022,
        created_at: "2024-02-20T14:45:00Z",
      },
      {
        id: "asset-003",
        user_id: userId,
        credit_type: "CDM",
        project_type: "甲烷捕獲",
        quantity: 200,
        vintage_year: 2023,
        created_at: "2024-03-10T09:15:00Z",
      },
    ];

    return NextResponse.json(mockAssets);
  } catch (error) {
    console.error("用戶資產獲取錯誤:", error);
    return NextResponse.json(
      { error: "無法獲取用戶資產數據" },
      { status: 500 }
    );
  }
}
