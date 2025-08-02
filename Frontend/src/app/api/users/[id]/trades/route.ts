import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // 模擬用戶交易歷史數據
    const mockTrades = [
      {
        id: "trade-1",
        user_id: userId,
        carbon_credit_id: "credit-1",
        type: "buy",
        quantity: 100,
        price_per_token: 25.5,
        total_amount: 2550.0,
        status: "completed",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:35:00Z",
        carbon_credit: {
          id: "credit-1",
          name: "森林保護項目",
          price_per_token: 25.5,
        },
      },
      {
        id: "trade-2",
        user_id: userId,
        carbon_credit_id: "credit-2",
        type: "buy",
        quantity: 50,
        price_per_token: 30.0,
        total_amount: 1500.0,
        status: "completed",
        created_at: "2024-02-20T14:15:00Z",
        updated_at: "2024-02-20T14:20:00Z",
        carbon_credit: {
          id: "credit-2",
          name: "可再生能源項目",
          price_per_token: 30.0,
        },
      },
      {
        id: "trade-3",
        user_id: userId,
        carbon_credit_id: "credit-1",
        type: "sell",
        quantity: 25,
        price_per_token: 26.0,
        total_amount: 650.0,
        status: "completed",
        created_at: "2024-03-10T09:45:00Z",
        updated_at: "2024-03-10T09:50:00Z",
        carbon_credit: {
          id: "credit-1",
          name: "森林保護項目",
          price_per_token: 26.0,
        },
      },
    ];

    return NextResponse.json(mockTrades);
  } catch (error) {
    console.error("Get user trades error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "獲取用戶交易歷史失敗",
      },
      { status: 500 }
    );
  }
}
