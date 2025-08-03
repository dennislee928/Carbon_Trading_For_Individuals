import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");
    const location = searchParams.get("location");

    // 模擬碳權項目數據
    const mockProjects = [
      {
        id: "proj-001",
        name: "台灣太陽能發電項目",
        description:
          "位於台南的大型太陽能發電廠，年發電量達50MW，有效減少碳排放",
        type: "再生能源",
        location: "台灣",
        standard: "VCS",
        methodology: "AMS-I.D",
        total_credits: 50000,
        available_credits: 35000,
        price_per_credit: 12.5,
        status: "active",
        start_date: "2023-01-01",
        end_date: "2033-01-01",
        verification_body: "TÜV SÜD",
        vintage: "2023",
        website: "https://example.com/project1",
        image_url: "/images/solar-project.jpg",
        images: ["/images/solar1.jpg", "/images/solar2.jpg"],
        coordinates: "23.0000,120.0000",
        region: "亞洲",
        category: "能源",
        sdgs: ["SDG7", "SDG13"],
        retired_credits: 15000,
        available_supply: 35000,
        price_usdc: 12.5,
        project_id: "PROJ001",
      },
      {
        id: "proj-002",
        name: "亞馬遜雨林保護計劃",
        description: "保護巴西亞馬遜雨林，防止森林砍伐，維護生物多樣性",
        type: "森林保護",
        location: "巴西",
        standard: "REDD+",
        methodology: "AR-AM0001",
        total_credits: 100000,
        available_credits: 75000,
        price_per_credit: 18.75,
        status: "active",
        start_date: "2022-06-01",
        end_date: "2032-06-01",
        verification_body: "SGS",
        vintage: "2022",
        website: "https://example.com/project2",
        image_url: "/images/forest-project.jpg",
        images: ["/images/forest1.jpg", "/images/forest2.jpg"],
        coordinates: "-3.0000,-60.0000",
        region: "南美洲",
        category: "林業",
        sdgs: ["SDG13", "SDG15"],
        retired_credits: 25000,
        available_supply: 75000,
        price_usdc: 18.75,
        project_id: "PROJ002",
      },
      {
        id: "proj-003",
        name: "垃圾掩埋場甲烷捕獲",
        description: "從台北市垃圾掩埋場捕獲甲烷氣體，轉化為清潔能源",
        type: "甲烷捕獲",
        location: "台灣",
        standard: "CDM",
        methodology: "ACM0001",
        total_credits: 30000,
        available_credits: 20000,
        price_per_credit: 8.9,
        status: "active",
        start_date: "2023-03-01",
        end_date: "2033-03-01",
        verification_body: "DNV",
        vintage: "2023",
        website: "https://example.com/project3",
        image_url: "/images/methane-project.jpg",
        images: ["/images/methane1.jpg", "/images/methane2.jpg"],
        coordinates: "25.0000,121.5000",
        region: "亞洲",
        category: "廢棄物管理",
        sdgs: ["SDG7", "SDG11", "SDG13"],
        retired_credits: 10000,
        available_supply: 20000,
        price_usdc: 8.9,
        project_id: "PROJ003",
      },
    ];

    // 簡單的過濾邏輯
    let filteredProjects = mockProjects;
    if (type) {
      filteredProjects = filteredProjects.filter(
        (project) => project.type === type
      );
    }
    if (location) {
      filteredProjects = filteredProjects.filter(
        (project) => project.location === location
      );
    }

    // 分頁邏輯
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    const response = {
      projects: paginatedProjects,
      total: filteredProjects.length,
      page: page,
      limit: limit,
      page_size: limit,
      count: paginatedProjects.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("碳權項目獲取錯誤:", error);
    return NextResponse.json(
      { error: "無法獲取碳權項目數據" },
      { status: 500 }
    );
  }
}
