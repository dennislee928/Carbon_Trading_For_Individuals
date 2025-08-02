import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceActivityId, targetActivityId, ratio } = body;

    if (!sourceActivityId || !targetActivityId || ratio === undefined) {
      return NextResponse.json(
        { error: "缺少必要參數：sourceActivityId, targetActivityId, ratio" },
        { status: 400 }
      );
    }

    // 本地計算方法
    const calculateCustomMapping = (sourceActivityId: string, targetActivityId: string, ratio: number) => {
      // 模擬計算結果
      const baseEmission = 100; // 基礎排放量
      const convertedEmission = baseEmission * ratio;
      
      return {
        co2e: Math.round(convertedEmission * 100) / 100,
        co2e_unit: "kg CO2e",
        activity_id: targetActivityId,
        parameters: { 
          sourceActivityId, 
          targetActivityId, 
          ratio, 
          baseEmission,
          convertedEmission 
        },
      };
    };

    const result = calculateCustomMapping(sourceActivityId, targetActivityId, ratio);
    return NextResponse.json(result);
  } catch (error) {
    console.error("自訂映射創建錯誤:", error);
    return NextResponse.json(
      { error: "創建失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
