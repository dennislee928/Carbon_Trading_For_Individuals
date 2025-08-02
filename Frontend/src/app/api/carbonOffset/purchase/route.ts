import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "請提供有效的購買數量",
        },
        { status: 400 }
      );
    }

    // 模擬購買計算
    const price_per_token = 25.5; // 假設每噸碳權價格
    const total_price_usd = quantity * price_per_token;
    const estimated_fees = total_price_usd * 0.02; // 2% 手續費
    const final_price_usd = total_price_usd + estimated_fees;
    const transaction_id = `tx_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // 計算抵消當量
    const offset_equivalent = {
      car_km: quantity * 4000, // 每噸碳權相當於 4000 公里汽車行駛
      flights: quantity * 2.5, // 每噸碳權相當於 2.5 次短程飛行
      tree_months: quantity * 12, // 每噸碳權相當於 12 個月的樹木生長
    };

    const purchaseResult = {
      price_per_token,
      total_price_usd,
      estimated_fees,
      final_price_usd,
      transaction_id,
      offset_equivalent,
      quantity,
      status: "completed",
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(purchaseResult);
  } catch (error) {
    console.error("Purchase carbon offset error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "購買碳權抵消失敗",
      },
      { status: 500 }
    );
  }
}
