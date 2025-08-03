import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, token_amount, user_id } = body;

    if (!project_id || !token_amount || !user_id) {
      return NextResponse.json(
        { error: "缺少必要參數：project_id, token_amount, user_id" },
        { status: 400 }
      );
    }

    // 模擬項目數據
    const projects = {
      "proj-001": {
        name: "台灣太陽能發電項目",
        price_per_token: 12.5,
        available_supply: 35000,
      },
      "proj-002": {
        name: "亞馬遜雨林保護計劃",
        price_per_token: 18.75,
        available_supply: 75000,
      },
      "proj-003": {
        name: "垃圾掩埋場甲烷捕獲",
        price_per_token: 8.9,
        available_supply: 20000,
      },
    };

    const project = projects[project_id as keyof typeof projects];
    if (!project) {
      return NextResponse.json({ error: "項目不存在" }, { status: 404 });
    }

    if (token_amount > project.available_supply) {
      return NextResponse.json({ error: "可用代幣數量不足" }, { status: 400 });
    }

    // 計算價格和費用
    const basePrice = token_amount * project.price_per_token;
    const transactionFee = basePrice * 0.02; // 2% 交易費
    const finalPrice = basePrice + transactionFee;
    const transactionId = `tx_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // 模擬抵消等價物
    const offsetEquivalent = {
      "kg CO2e": token_amount,
      trees_planted: Math.round(token_amount * 0.1), // 每噸CO2約等於0.1棵樹
      km_car_equivalent: Math.round(token_amount * 5), // 每噸CO2約等於5公里汽車行駛
      kwh_electricity_saved: Math.round(token_amount * 2), // 每噸CO2約等於2kWh電力
    };

    const simulation = {
      success: true,
      project_id: project_id,
      project_name: project.name,
      token_amount: token_amount,
      price_per_token: project.price_per_token,
      total_price_usd: basePrice,
      final_price_usd: Math.round(finalPrice * 100) / 100,
      estimated_fees: Math.round(transactionFee * 100) / 100,
      transaction_id: transactionId,
      offset_equivalent: offsetEquivalent,
    };

    return NextResponse.json(simulation);
  } catch (error) {
    console.error("抵消模擬錯誤:", error);
    return NextResponse.json(
      { error: "模擬失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
