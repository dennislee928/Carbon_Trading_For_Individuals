import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 模擬統計概覽數據
    const statsOverview = {
      total_users: 1250,
      active_users: 890,
      total_trades: 3456,
      completed_trades: 3120,
      total_points: 125000,
      total_carbon_credits: 45678,
      new_users_today: 23,
      trades_today: 45,
    };

    return NextResponse.json({
      status: "success",
      data: statsOverview,
    });
  } catch (error) {
    console.error("統計概覽獲取錯誤:", error);
    return NextResponse.json(
      { error: "無法獲取統計概覽數據" },
      { status: 500 }
    );
  }
}
