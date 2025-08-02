import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 模擬交易統計數據
    const mockTradeStats = {
      total_trades: 3456,
      total_volume_usd: 1250000.00,
      average_trade_size: 361.69,
      trades_today: 45,
      volume_today: 12500.00,
      trades_this_week: 234,
      volume_this_week: 67500.00,
      trades_this_month: 890,
      volume_this_month: 234000.00,
      buy_trades: 2345,
      sell_trades: 1111,
      buy_volume: 875000.00,
      sell_volume: 375000.00,
      top_trading_projects: [
        {
          project_id: "credit-1",
          project_name: "森林保護項目",
          trades_count: 1234,
          volume_usd: 456000.00,
          average_price: 25.50
        },
        {
          project_id: "credit-2",
          project_name: "可再生能源項目",
          trades_count: 890,
          volume_usd: 345000.00,
          average_price: 30.00
        },
        {
          project_id: "credit-3",
          project_name: "沼氣回收項目",
          trades_count: 567,
          volume_usd: 234000.00,
          average_price: 22.75
        }
      ],
      trading_trends: {
        daily: [
          { date: "2024-03-10", trades: 12, volume: 3450.00 },
          { date: "2024-03-11", trades: 15, volume: 4230.00 },
          { date: "2024-03-12", trades: 18, volume: 5120.00 },
          { date: "2024-03-13", trades: 22, volume: 6230.00 },
          { date: "2024-03-14", trades: 19, volume: 5430.00 },
          { date: "2024-03-15", trades: 25, volume: 7120.00 }
        ],
        weekly: [
          { week: "2024-W10", trades: 89, volume: 23400.00 },
          { week: "2024-W11", trades: 102, volume: 28700.00 },
          { week: "2024-W12", trades: 95, volume: 26500.00 }
        ]
      }
    };

    return NextResponse.json({
      success: true,
      data: mockTradeStats
    });

  } catch (error) {
    console.error('Get trade stats error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '獲取交易統計失敗' 
      },
      { status: 500 }
    );
  }
} 