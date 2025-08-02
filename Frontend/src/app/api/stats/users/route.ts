import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 模擬用戶統計數據
    const mockUserStats = {
      total_users: 1250,
      active_users: 890,
      new_users_today: 12,
      new_users_this_week: 67,
      new_users_this_month: 234,
      verified_users: 1150,
      premium_users: 89,
      users_with_trades: 567,
      users_with_assets: 678,
      average_user_age_days: 45,
      user_retention_rate: 0.78,
      top_users_by_volume: [
        {
          user_id: "user-001",
          username: "carbon_trader_001",
          total_volume_usd: 125000.00,
          trades_count: 234,
          carbon_offset: 4567.8
        },
        {
          user_id: "user-002",
          username: "eco_investor_002",
          total_volume_usd: 89000.00,
          trades_count: 156,
          carbon_offset: 3456.7
        },
        {
          user_id: "user-003",
          username: "green_fund_003",
          total_volume_usd: 67000.00,
          trades_count: 123,
          carbon_offset: 2345.6
        }
      ],
      user_growth: {
        daily: [
          { date: "2024-03-10", new_users: 8, active_users: 234 },
          { date: "2024-03-11", new_users: 12, active_users: 245 },
          { date: "2024-03-12", new_users: 15, active_users: 256 },
          { date: "2024-03-13", new_users: 10, active_users: 267 },
          { date: "2024-03-14", new_users: 14, active_users: 278 },
          { date: "2024-03-15", new_users: 18, active_users: 289 }
        ],
        weekly: [
          { week: "2024-W10", new_users: 45, active_users: 890 },
          { week: "2024-W11", new_users: 52, active_users: 920 },
          { week: "2024-W12", new_users: 48, active_users: 950 }
        ]
      },
      user_demographics: {
        by_region: [
          { region: "亞洲", users: 456, percentage: 36.5 },
          { region: "歐洲", users: 345, percentage: 27.6 },
          { region: "北美洲", users: 234, percentage: 18.7 },
          { region: "其他", users: 215, percentage: 17.2 }
        ],
        by_age_group: [
          { age_group: "18-25", users: 234, percentage: 18.7 },
          { age_group: "26-35", users: 456, percentage: 36.5 },
          { age_group: "36-45", users: 345, percentage: 27.6 },
          { age_group: "46+", users: 215, percentage: 17.2 }
        ]
      }
    };

    return NextResponse.json({
      success: true,
      data: mockUserStats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '獲取用戶統計失敗' 
      },
      { status: 500 }
    );
  }
} 