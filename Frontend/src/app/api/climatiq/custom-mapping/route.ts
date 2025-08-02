import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { sourceActivityId, targetActivityId, ratio } = data;

    if (!sourceActivityId || !targetActivityId || ratio === undefined) {
      return NextResponse.json(
        {
          error:
            "缺少必要參數: 源活動ID(sourceActivityId), 目標活動ID(targetActivityId), 或比率(ratio)",
        },
        { status: 400 }
      );
    }

    // 這裡只是模擬存儲自定義映射
    // 在實際環境中，應該將映射存儲到資料庫
    const mapping = {
      id: Math.random().toString(36).substring(2, 11),
      source_activity_id: sourceActivityId,
      target_activity_id: targetActivityId,
      ratio: parseFloat(ratio.toString()),
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      mapping,
      status: "success",
      message: "自定義映射已成功創建",
    });
  } catch (error) {
    console.error("Custom mapping creation error:", error);
    return NextResponse.json(
      {
        error: "創建自定義映射失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}
