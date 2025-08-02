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
        id: "asset-1",
        user_id: userId,
        carbon_credit_id: "credit-1",
        quantity: 100,
        purchase_price: 25.5,
        purchase_date: "2024-01-15T10:30:00Z",
        status: "active",
        carbon_credit: {
          id: "credit-1",
          name: "森林保護項目",
          description: "保護亞馬遜雨林的碳權項目",
          price_per_token: 25.5,
          available_quantity: 1000,
          project_type: "forestry",
          location: "巴西",
          verification_standard: "VCS",
          vintage_year: 2023,
        },
      },
      {
        id: "asset-2",
        user_id: userId,
        carbon_credit_id: "credit-2",
        quantity: 50,
        purchase_price: 30.0,
        purchase_date: "2024-02-20T14:15:00Z",
        status: "active",
        carbon_credit: {
          id: "credit-2",
          name: "可再生能源項目",
          description: "太陽能發電站的碳權項目",
          price_per_token: 30.0,
          available_quantity: 500,
          project_type: "renewable_energy",
          location: "德國",
          verification_standard: "Gold Standard",
          vintage_year: 2023,
        },
      },
    ];

    return NextResponse.json(mockAssets);
  } catch (error) {
    console.error("Get user assets error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "獲取用戶資產失敗",
      },
      { status: 500 }
    );
  }
}
