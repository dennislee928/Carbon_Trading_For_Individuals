import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, quantity, unit } = body;

    if (!description || !quantity || !unit) {
      return NextResponse.json(
        { error: "缺少必要參數：description, quantity, unit" },
        { status: 400 }
      );
    }

    // 本地計算方法
    const calculateAutopilotEmissions = (
      description: string,
      quantity: number,
      unit: string
    ) => {
      // 根據描述和數量計算碳排放
      const baseEmission = 10; // 基礎排放量
      const descriptionFactor = description.toLowerCase().includes("ai")
        ? 2.0
        : 1.0;
      const unitFactor =
        unit === "hour"
          ? 1.0
          : unit === "day"
          ? 24
          : unit === "month"
          ? 720
          : unit === "year"
          ? 8760
          : 1.0;

      const co2e = baseEmission * quantity * descriptionFactor * unitFactor;

      return {
        co2e: Math.round(co2e * 100) / 100,
        co2e_unit: "kg CO2e",
        activity_id: "autopilot-estimate",
        parameters: {
          description,
          quantity,
          unit,
          descriptionFactor,
          unitFactor,
        },
      };
    };

    const result = calculateAutopilotEmissions(description, quantity, unit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("自動駕駛碳排計算錯誤:", error);
    return NextResponse.json(
      { error: "計算失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
