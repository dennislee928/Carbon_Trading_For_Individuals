import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { energy, energy_unit, energy_type, country } = body;

    if (!energy || !energy_unit || !energy_type) {
      return NextResponse.json(
        { error: "缺少必要參數：energy, energy_unit, energy_type" },
        { status: 400 }
      );
    }

    // 本地計算方法
    const calculateEnergyEmissions = (energy: number, energy_unit: string, energy_type: string) => {
      const emissionFactors = {
        electricity: 0.5, // kg CO2e per kWh
        natural_gas: 2.0, // kg CO2e per m3
        coal: 2.5, // kg CO2e per kg
        oil: 2.3, // kg CO2e per L
        renewable: 0.05, // kg CO2e per kWh
      };
      
      const factor = emissionFactors[energy_type as keyof typeof emissionFactors] || emissionFactors.electricity;
      const co2e = energy * factor;
      
      return {
        co2e: Math.round(co2e * 100) / 100,
        co2e_unit: "kg CO2e",
        activity_id: `energy-${energy_type}`,
        parameters: { energy, energy_unit, energy_type, factor },
      };
    };

    const result = calculateEnergyEmissions(energy, energy_unit, energy_type);
    return NextResponse.json(result);
  } catch (error) {
    console.error("能源碳排計算錯誤:", error);
    return NextResponse.json(
      { error: "計算失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
