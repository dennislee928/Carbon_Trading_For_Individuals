import { NextResponse } from "next/server";
import { climatiqApi } from "@/app/services/climatiq";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { energy, energy_unit = "kWh", energy_type, country } = data;

    if (!energy || !energy_type) {
      return NextResponse.json(
        {
          error: "缺少必要參數: 能源量(energy)或能源類型(energy_type)",
        },
        { status: 400 }
      );
    }

    // 將前端數據轉換為Climatiq API格式
    const energyParams = {
      energy: parseFloat(energy),
      energy_unit,
      energy_type,
      country,
    };

    // 調用Climatiq API計算碳足跡
    const result = await climatiqApi.energy(energyParams);

    return NextResponse.json({
      result,
      status: "success",
    });
  } catch (error) {
    console.error("Energy calculation error:", error);
    return NextResponse.json(
      {
        error: "能源碳足跡計算失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}
