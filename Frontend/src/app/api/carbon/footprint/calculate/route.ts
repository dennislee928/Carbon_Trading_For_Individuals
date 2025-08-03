import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activity_type, quantity, unit, country_code, date, description } =
      body;

    if (!activity_type || !quantity || !unit) {
      return NextResponse.json(
        { error: "缺少必要參數：activity_type, quantity, unit" },
        { status: 400 }
      );
    }

    // 碳足跡計算邏輯
    const calculateFootprint = (
      activityType: string,
      quantity: number,
      unit: string
    ) => {
      const emissionFactors: Record<string, Record<string, number>> = {
        electricity: {
          kWh: 0.5, // kg CO2e per kWh
          MWh: 500,
          GWh: 500000,
        },
        natural_gas: {
          m3: 2.1, // kg CO2e per m3
          therm: 5.3,
          MMBtu: 53.1,
        },
        fuel: {
          L: 2.3, // kg CO2e per liter
          gal: 8.7,
          kg: 3.1,
        },
        waste: {
          kg: 0.5, // kg CO2e per kg
          ton: 500,
          lb: 0.23,
        },
        water: {
          L: 0.298, // kg CO2e per liter
          m3: 298,
          gal: 1.13,
        },
        travel: {
          km: 0.2, // kg CO2e per km (average)
          mile: 0.32,
        },
      };

      const factor = emissionFactors[activityType]?.[unit];
      if (!factor) {
        throw new Error(`不支援的活動類型或單位：${activityType} / ${unit}`);
      }

      const emissionAmount = quantity * factor;

      return {
        emission_amount: Math.round(emissionAmount * 100) / 100,
        emission_source: activityType,
        unit: "kg CO2e",
        breakdown: {
          [activityType]: emissionAmount,
        },
        metadata: {
          calculation_method: "emission_factor",
          factor_used: factor.toString(),
          country_code: country_code || "TW",
          date: date || new Date().toISOString().split("T")[0],
        },
        offset_options: [
          {
            project_id: "proj-001",
            project_name: "台灣太陽能發電項目",
            project_type: "再生能源",
            price_per_unit: 12.5,
            token_amount: Math.ceil(emissionAmount),
            total_price: Math.ceil(emissionAmount) * 12.5,
          },
          {
            project_id: "proj-002",
            project_name: "亞馬遜雨林保護計劃",
            project_type: "森林保護",
            price_per_unit: 18.75,
            token_amount: Math.ceil(emissionAmount),
            total_price: Math.ceil(emissionAmount) * 18.75,
          },
          {
            project_id: "proj-003",
            project_name: "垃圾掩埋場甲烷捕獲",
            project_type: "甲烷捕獲",
            price_per_unit: 8.9,
            token_amount: Math.ceil(emissionAmount),
            total_price: Math.ceil(emissionAmount) * 8.9,
          },
        ],
      };
    };

    const result = calculateFootprint(activity_type, quantity, unit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("碳足跡計算錯誤:", error);
    return NextResponse.json(
      { error: "計算失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
