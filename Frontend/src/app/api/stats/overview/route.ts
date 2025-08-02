import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 模擬統計概覽數據
    const mockStatsOverview = {
      total_users: 1250,
      active_users: 890,
      total_trades: 3456,
      total_volume_usd: 1250000.00,
      total_carbon_offset: 45678.5,
      average_price_per_token: 26.75,
      market_cap: 2500000.00,
      daily_active_users: 234,
      weekly_active_users: 567,
      monthly_active_users: 890,
      total_projects: 45,
      active_projects: 38,
      total_carbon_credits: 125000,
      available_carbon_credits: 45678,
      platform_fees_collected: 25000.00,
      carbon_offset_equivalent: {
        car_km: 182714000, // 45678.5 * 4000
        flights: 114196,   // 45678.5 * 2.5
        tree_months: 548142 // 45678.5 * 12
      },
      recent_activity: {
        new_users_24h: 12,
        new_trades_24h: 45,
        volume_24h: 12500.00,
        carbon_offset_24h: 234.5
      }
    };

    return NextResponse.json({
      success: true,
      data: mockStatsOverview
    });

  } catch (error) {
    console.error('Get stats overview error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '獲取統計概覽失敗' 
      },
      { status: 500 }
    );
  }
} 