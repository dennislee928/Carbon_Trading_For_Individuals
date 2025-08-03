import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 模擬市場統計數據
    const marketStats = {
      total_projects: 156,
      total_tokens: 2847,
      total_available_tokens: 1893,
      total_retired_tokens: 954,
      total_sales_usd: 2847500,
      total_volume_tco2e: 2847.5,
      average_price_usd: 12.45,
      highest_price_usd: 28.9,
      lowest_price_usd: 3.2,
      price_history: [
        { date: "2024-01-01", value: 10.2 },
        { date: "2024-02-01", value: 11.5 },
        { date: "2024-03-01", value: 12.3 },
        { date: "2024-04-01", value: 13.1 },
        { date: "2024-05-01", value: 12.8 },
        { date: "2024-06-01", value: 12.45 },
      ],
      volume_history: [
        { date: "2024-01-01", value: 150.5 },
        { date: "2024-02-01", value: 180.2 },
        { date: "2024-03-01", value: 220.8 },
        { date: "2024-04-01", value: 195.3 },
        { date: "2024-05-01", value: 210.7 },
        { date: "2024-06-01", value: 284.7 },
      ],
      top_project_types: [
        { label: "再生能源", value: 45 },
        { label: "森林保護", value: 32 },
        { label: "甲烷捕獲", value: 18 },
        { label: "能源效率", value: 15 },
        { label: "其他", value: 10 },
      ],
      top_project_locations: [
        { label: "台灣", value: 38 },
        { label: "東南亞", value: 25 },
        { label: "南美洲", value: 20 },
        { label: "非洲", value: 12 },
        { label: "其他", value: 5 },
      ],
    };

    return NextResponse.json(marketStats);
  } catch (error) {
    console.error("市場統計獲取錯誤:", error);
    return NextResponse.json(
      { error: "無法獲取市場統計數據" },
      { status: 500 }
    );
  }
}
