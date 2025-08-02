import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { distance, weight, mode } = body;

    if (!distance || !weight || !mode) {
      return NextResponse.json(
        { error: "缺少必要參數：distance, weight, mode" },
        { status: 400 }
      );
    }

    // 本地計算方法
    const calculateFreightEmissions = (
      distance: number,
      weight: number,
      mode: string
    ) => {
      const emissionFactors = {
        road: 0.15, // kg CO2e per km per kg
        rail: 0.03,
        air: 0.85,
        sea: 0.02,
        inland_waterway: 0.01,
      };

      const factor =
        emissionFactors[mode as keyof typeof emissionFactors] ||
        emissionFactors.road;
      const co2e = distance * weight * factor;

      return {
        co2e: Math.round(co2e * 100) / 100,
        co2e_unit: "kg CO2e",
        activity_id: `freight-${mode}`,
        parameters: { distance, weight, mode, factor },
      };
    };

    const result = calculateFreightEmissions(distance, weight, mode);
    return NextResponse.json(result);
  } catch (error) {
    console.error("運輸碳排計算錯誤:", error);
    return NextResponse.json(
      { error: "計算失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
