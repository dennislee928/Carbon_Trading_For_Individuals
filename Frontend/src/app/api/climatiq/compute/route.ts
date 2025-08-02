import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cpu_hours, provider, region } = body;

    if (!cpu_hours || !provider) {
      return NextResponse.json(
        { error: "缺少必要參數：cpu_hours, provider" },
        { status: 400 }
      );
    }

    // 本地計算方法
    const calculateComputeEmissions = (
      cpu_hours: number,
      provider: string,
      region: string
    ) => {
      const emissionFactors = {
        aws: 0.3, // kg CO2e per CPU hour
        gcp: 0.25,
        azure: 0.28,
      };

      const factor =
        emissionFactors[provider as keyof typeof emissionFactors] ||
        emissionFactors.aws;
      const co2e = cpu_hours * factor;

      return {
        co2e: Math.round(co2e * 100) / 100,
        co2e_unit: "kg CO2e",
        activity_id: `compute-${provider}`,
        parameters: { cpu_hours, provider, region, factor },
      };
    };

    const result = calculateComputeEmissions(cpu_hours, provider, region);
    return NextResponse.json(result);
  } catch (error) {
    console.error("計算碳排計算錯誤:", error);
    return NextResponse.json(
      { error: "計算失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
