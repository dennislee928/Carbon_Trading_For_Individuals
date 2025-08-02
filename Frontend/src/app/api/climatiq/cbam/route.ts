import { NextResponse } from "next/server";
import { climatiqApi } from "@/app/services/climatiq";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { product, quantity, region } = data;

    if (!product || !quantity || !region) {
      return NextResponse.json(
        {
          error: "缺少必要參數: 產品(product), 數量(quantity), 或區域(region)",
        },
        { status: 400 }
      );
    }

    // 將前端數據轉換為Climatiq API格式
    const cbamParams = {
      product,
      quantity: parseFloat(quantity),
      region,
    };

    // 調用Climatiq API計算碳邊境調整機制(CBAM)碳足跡
    const result = await climatiqApi.cbem(cbamParams);

    return NextResponse.json({
      result,
      status: "success",
    });
  } catch (error) {
    console.error("CBAM calculation error:", error);
    return NextResponse.json(
      {
        error: "CBAM碳足跡計算失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}
