import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spend, spend_unit, category, region } = body;

    if (!spend || !spend_unit || !category || !region) {
      return NextResponse.json(
        { error: "缺少必要參數：spend, spend_unit, category, region" },
        { status: 400 }
      );
    }

    // 本地計算方法
    const calculateProcurementEmissions = (
      spend: number,
      spend_unit: string,
      category: string,
      region: string
    ) => {
      const categoryFactors = {
        office_supplies: 0.3, // kg CO2e per currency unit
        electronics: 0.8,
        furniture: 0.5,
        food: 0.4,
        clothing: 0.6,
        transportation: 1.2,
      };

      const regionFactors = {
        TW: 1.0, // 台灣
        US: 1.5, // 美國
        EU: 1.2, // 歐盟
        CN: 1.8, // 中國
        JP: 0.8, // 日本
      };

      const currencyFactors = {
        TWD: 1.0,
        USD: 30.0, // 假設 1 USD = 30 TWD
        EUR: 33.0, // 假設 1 EUR = 33 TWD
        JPY: 0.2, // 假設 1 JPY = 0.2 TWD
      };

      const categoryFactor =
        categoryFactors[category as keyof typeof categoryFactors] || 0.3;
      const regionFactor =
        regionFactors[region as keyof typeof regionFactors] || 1.0;
      const currencyFactor =
        currencyFactors[spend_unit as keyof typeof currencyFactors] || 1.0;

      const co2e = spend * categoryFactor * regionFactor * currencyFactor;

      return {
        co2e: Math.round(co2e * 100) / 100,
        co2e_unit: "kg CO2e",
        activity_id: `procurement-${category}`,
        parameters: {
          spend,
          spend_unit,
          category,
          region,
          categoryFactor,
          regionFactor,
          currencyFactor,
        },
      };
    };

    const result = calculateProcurementEmissions(
      spend,
      spend_unit,
      category,
      region
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("採購碳排計算錯誤:", error);
    return NextResponse.json(
      { error: "計算失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
