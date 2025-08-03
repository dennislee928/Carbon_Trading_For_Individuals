import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const min_price = searchParams.get("min_price");
    const max_price = searchParams.get("max_price");

    // 模擬碳權代幣數據
    const mockTokens = [
      {
        id: "token-001",
        name: "台灣太陽能碳權代幣",
        symbol: "TWSOLAR",
        token_type: "VER",
        project_id: "proj-001",
        project_name: "台灣太陽能發電項目",
        quantity: 1000,
        price_per_unit: 12.5,
        price_usdc: 12.5,
        total_price: 12500,
        standard: "VCS",
        methodology: "AMS-I.D",
        region: "亞洲",
        vintage: "2023",
        category: "再生能源",
        status: "available",
        supply_total: 50000,
        supply_remaining: 35000,
        available_since: "2023-06-01",
        expiry_date: "2033-01-01",
        certificate_url: "https://example.com/cert/token001.pdf",
        seller: "台灣綠能公司",
      },
      {
        id: "token-002",
        name: "亞馬遜森林保護代幣",
        symbol: "AMZFOREST",
        token_type: "REDD+",
        project_id: "proj-002",
        project_name: "亞馬遜雨林保護計劃",
        quantity: 500,
        price_per_unit: 18.75,
        price_usdc: 18.75,
        total_price: 9375,
        standard: "REDD+",
        methodology: "AR-AM0001",
        region: "南美洲",
        vintage: "2022",
        category: "森林保護",
        status: "available",
        supply_total: 100000,
        supply_remaining: 75000,
        available_since: "2022-12-01",
        expiry_date: "2032-06-01",
        certificate_url: "https://example.com/cert/token002.pdf",
        seller: "巴西環保基金會",
      },
      {
        id: "token-003",
        name: "台北甲烷捕獲代幣",
        symbol: "TPEMETHANE",
        token_type: "CDM",
        project_id: "proj-003",
        project_name: "垃圾掩埋場甲烷捕獲",
        quantity: 2000,
        price_per_unit: 8.9,
        price_usdc: 8.9,
        total_price: 17800,
        standard: "CDM",
        methodology: "ACM0001",
        region: "亞洲",
        vintage: "2023",
        category: "甲烷捕獲",
        status: "available",
        supply_total: 30000,
        supply_remaining: 20000,
        available_since: "2023-09-01",
        expiry_date: "2033-03-01",
        certificate_url: "https://example.com/cert/token003.pdf",
        seller: "台北市環保局",
      },
    ];

    // 簡單的過濾邏輯
    let filteredTokens = mockTokens;
    if (min_price) {
      filteredTokens = filteredTokens.filter(
        (token) => token.price_per_unit >= parseFloat(min_price)
      );
    }
    if (max_price) {
      filteredTokens = filteredTokens.filter(
        (token) => token.price_per_unit <= parseFloat(max_price)
      );
    }

    // 分頁邏輯
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTokens = filteredTokens.slice(startIndex, endIndex);

    const response = {
      tokens: paginatedTokens,
      total: filteredTokens.length,
      page: page,
      limit: limit,
      page_size: limit,
      count: paginatedTokens.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("碳權代幣獲取錯誤:", error);
    return NextResponse.json(
      { error: "無法獲取碳權代幣數據" },
      { status: 500 }
    );
  }
}
