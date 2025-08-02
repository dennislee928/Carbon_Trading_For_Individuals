import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product, quantity, region } = body;

    if (!product || !quantity || !region) {
      return NextResponse.json(
        { error: "缺少必要參數：product, quantity, region" },
        { status: 400 }
      );
    }

    // 本地計算方法
    const calculateCBAMEmissions = (product: string, quantity: number, region: string) => {
      const productFactors = {
        steel: 1.8, // kg CO2e per kg
        cement: 0.9,
        aluminum: 8.1,
        fertilizer: 2.1,
        hydrogen: 10.0,
      };
      
      const regionFactors = {
        EU: 1.0,
        US: 1.2,
        CN: 1.5,
        JP: 0.8,
        KR: 1.1,
      };
      
      const productFactor = productFactors[product.toLowerCase() as keyof typeof productFactors] || 1.0;
      const regionFactor = regionFactors[region as keyof typeof regionFactors] || 1.0;
      const co2e = quantity * productFactor * regionFactor;
      
      return {
        co2e: Math.round(co2e * 100) / 100,
        co2e_unit: "kg CO2e",
        activity_id: `cbam-${product}`,
        parameters: { product, quantity, region, productFactor, regionFactor },
      };
    };

    const result = calculateCBAMEmissions(product, quantity, region);
    return NextResponse.json(result);
  } catch (error) {
    console.error("CBAM 碳排計算錯誤:", error);
    return NextResponse.json(
      { error: "計算失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
