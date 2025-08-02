import { NextResponse } from "next/server";
import { climatiqApi } from "@/app/services/climatiq";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { distance, weight, mode } = data;

    if (!distance || !weight || !mode) {
      return NextResponse.json(
        {
          error: "缺少必要參數: 距離(distance), 重量(weight), 或運輸方式(mode)",
        },
        { status: 400 }
      );
    }

    // 將前端數據轉換為Climatiq API格式
    const freightParams = {
      distance_km: parseFloat(distance),
      weight_kg: parseFloat(weight),
      transport_mode: mode,
    };

    // 調用Climatiq API計算碳足跡
    const result = await climatiqApi.freight(freightParams);

    return NextResponse.json({
      result,
      status: "success",
    });
  } catch (error) {
    console.error("Freight calculation error:", error);
    return NextResponse.json(
      {
        error: "碳足跡計算失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}
