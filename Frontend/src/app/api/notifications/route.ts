import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 模擬通知數據
    const mockNotifications = [
      {
        id: "notif-1",
        user_id: "user-123",
        type: "trade_completed",
        title: "交易完成",
        message: "您的碳權購買交易已完成，交易編號：TX-2024-001",
        is_read: false,
        created_at: "2024-03-15T10:30:00Z",
        data: {
          trade_id: "trade-1",
          amount: 2550.00,
          quantity: 100
        }
      },
      {
        id: "notif-2",
        user_id: "user-123",
        type: "price_alert",
        title: "價格提醒",
        message: "森林保護項目碳權價格上漲至 26.00 USD",
        is_read: true,
        created_at: "2024-03-14T15:45:00Z",
        data: {
          carbon_credit_id: "credit-1",
          old_price: 25.50,
          new_price: 26.00
        }
      },
      {
        id: "notif-3",
        user_id: "user-123",
        type: "system_maintenance",
        title: "系統維護通知",
        message: "系統將於今晚 23:00-02:00 進行維護，期間可能無法進行交易",
        is_read: false,
        created_at: "2024-03-13T09:00:00Z",
        data: {
          maintenance_start: "2024-03-15T23:00:00Z",
          maintenance_end: "2024-03-16T02:00:00Z"
        }
      },
      {
        id: "notif-4",
        user_id: "user-123",
        type: "new_project",
        title: "新項目上線",
        message: "新的風力發電項目已上線，歡迎查看並投資",
        is_read: false,
        created_at: "2024-03-12T14:20:00Z",
        data: {
          project_id: "credit-4",
          project_name: "風力發電項目"
        }
      },
      {
        id: "notif-5",
        user_id: "user-123",
        type: "account_update",
        title: "帳戶更新",
        message: "您的帳戶信息已成功更新",
        is_read: true,
        created_at: "2024-03-11T11:15:00Z",
        data: {
          updated_fields: ["email", "phone"]
        }
      }
    ];

    return NextResponse.json(mockNotifications);

  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '獲取通知失敗' 
      },
      { status: 500 }
    );
  }
} 