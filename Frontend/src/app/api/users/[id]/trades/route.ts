import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // 模擬用戶交易數據
    const mockTrades = [
      {
        id: "trade-001",
        user_id: userId,
        order_type: "buy",
        quantity: 50,
        price: 12.5,
        status: "completed",
        created_at: "2024-01-15T10:30:00Z",
      },
      {
        id: "trade-002",
        user_id: userId,
        order_type: "sell",
        quantity: 25,
        price: 18.75,
        status: "completed",
        created_at: "2024-02-20T14:45:00Z",
      },
      {
        id: "trade-003",
        user_id: userId,
        order_type: "buy",
        quantity: 100,
        price: 8.9,
        status: "pending",
        created_at: "2024-03-10T09:15:00Z",
      },
    ];

    return NextResponse.json(mockTrades);
  } catch (error) {
    console.error("用戶交易獲取錯誤:", error);
    return NextResponse.json(
      { error: "無法獲取用戶交易數據" },
      { status: 500 }
    );
  }
}
