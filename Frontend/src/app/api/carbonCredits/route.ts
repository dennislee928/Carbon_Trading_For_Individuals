import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 模擬碳權市場數據
    const mockCarbonCredits = [
      {
        id: "credit-1",
        name: "森林保護項目",
        description: "保護亞馬遜雨林的碳權項目，通過防止森林砍伐來減少碳排放",
        price_per_token: 25.5,
        available_quantity: 1000,
        project_type: "forestry",
        location: "巴西",
        verification_standard: "VCS",
        vintage_year: 2023,
        co2_equivalent_per_token: 1.0,
        project_start_date: "2023-01-01",
        project_end_date: "2032-12-31",
        status: "active",
      },
      {
        id: "credit-2",
        name: "可再生能源項目",
        description:
          "太陽能發電站的碳權項目，通過清潔能源發電來減少化石燃料使用",
        price_per_token: 30.0,
        available_quantity: 500,
        project_type: "renewable_energy",
        location: "德國",
        verification_standard: "Gold Standard",
        vintage_year: 2023,
        co2_equivalent_per_token: 1.0,
        project_start_date: "2023-03-01",
        project_end_date: "2033-02-28",
        status: "active",
      },
      {
        id: "credit-3",
        name: "沼氣回收項目",
        description: "從垃圾填埋場回收沼氣並轉化為清潔能源的項目",
        price_per_token: 22.75,
        available_quantity: 750,
        project_type: "waste_management",
        location: "美國",
        verification_standard: "VCS",
        vintage_year: 2023,
        co2_equivalent_per_token: 1.0,
        project_start_date: "2023-06-01",
        project_end_date: "2033-05-31",
        status: "active",
      },
      {
        id: "credit-4",
        name: "風力發電項目",
        description: "海上風力發電場項目，為沿海城市提供清潔電力",
        price_per_token: 28.25,
        available_quantity: 300,
        project_type: "renewable_energy",
        location: "丹麥",
        verification_standard: "Gold Standard",
        vintage_year: 2023,
        co2_equivalent_per_token: 1.0,
        project_start_date: "2023-09-01",
        project_end_date: "2033-08-31",
        status: "active",
      },
    ];

    return NextResponse.json(mockCarbonCredits);
  } catch (error) {
    console.error("Get carbon credits error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "獲取碳權列表失敗",
      },
      { status: 500 }
    );
  }
}
