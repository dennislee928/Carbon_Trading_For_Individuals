import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { distance_km, travel_mode, passengers } = body;

    if (!distance_km || !travel_mode) {
      return NextResponse.json(
        { error: "缺少必要參數：distance_km, travel_mode" },
        { status: 400 }
      );
    }

    // 本地計算方法
    const calculateTravelEmissions = (distance_km: number, travel_mode: string, passengers: number = 1) => {
      const emissionFactors = {
        car: 0.2, // kg CO2e per km per passenger
        train: 0.04,
        plane: 0.25,
        bus: 0.08,
        motorcycle: 0.12,
        bicycle: 0.0, // 無碳排放
        walking: 0.0, // 無碳排放
      };
      
      const factor = emissionFactors[travel_mode as keyof typeof emissionFactors] || 0.2;
      const co2e = distance_km * factor * passengers;
      
      return {
        co2e: Math.round(co2e * 100) / 100,
        co2e_unit: "kg CO2e",
        activity_id: `travel-${travel_mode}`,
        parameters: { 
          distance_km, 
          travel_mode, 
          passengers, 
          factor
        },
      };
    };

    const result = calculateTravelEmissions(distance_km, travel_mode, passengers);
    return NextResponse.json(result);
  } catch (error) {
    console.error("旅行碳排計算錯誤:", error);
    return NextResponse.json(
      { error: "計算失敗，請稍後再試" },
      { status: 500 }
    );
  }
} 