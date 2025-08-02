// 基礎響應類型
export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
  error?: string;
}

// 分頁類型
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

// 用戶相關類型
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  level: number;
  address?: string;
  phone?: string;
  google_id?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Admin {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  level: number;
  address?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface AdminListResponse {
  data: {
    admins: Admin[];
    pagination: Pagination;
  };
  status: string;
}

export interface AdminUserUpdate {
  email?: string;
  name?: string;
  role?: string;
  status?: string;
  level?: number;
}

// 積分相關類型
export interface UserBalance {
  id: string;
  user_id: string;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface UserBalanceResponse {
  data: UserBalance;
  status: string;
}

export interface UserBalanceWithUser extends UserBalance {
  user_email: string;
  user_name: string;
  user_role: string;
  user_status: string;
}

export interface UserBalanceListResponse {
  data: {
    balances: UserBalanceWithUser[];
    pagination: Pagination;
  };
  status: string;
}

export interface UpdateBalanceRequest {
  points: number;
}

export interface AddPointsRequest {
  points: number;
  reason?: string;
}

// 錯誤記錄相關類型
export interface ErrorLogWithUser {
  id: string;
  user_id?: string;
  endpoint: string;
  method: string;
  status_code: number;
  error_type: string;
  error_message: string;
  error_details?: any;
  request_id: string;
  ip_address?: string;
  user_agent?: string;
  duration_ms?: number;
  request_body?: any;
  request_headers?: any;
  response_body?: any;
  stack_trace?: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
  created_at: string;
  user?: UserBasicInfo;
  resolved_by_user?: UserBasicInfo;
  resolved?: boolean;
}

export interface UserBasicInfo {
  id: string;
  email: string;
  name: string;
}

export interface ErrorLogListResponse {
  data: {
    error_logs: ErrorLogWithUser[];
    pagination: Pagination;
  };
  status: string;
  message: string;
}

export interface ErrorLogResponse {
  data: ErrorLogWithUser;
  status: string;
  message: string;
}

export interface CreateErrorLogRequest {
  endpoint: string;
  method: string;
  status_code: number;
  error_type: string;
  error_message: string;
  request_id: string;
  error_details?: any;
  ip_address?: string;
  user_agent?: string;
  duration_ms?: number;
  request_body?: any;
  request_headers?: any;
  response_body?: any;
  stack_trace?: string;
  user_id?: string;
}

export interface UpdateErrorLogRequest {
  resolved_by: string;
  resolution_notes?: string;
}

export interface ErrorLogStats {
  total_errors: number;
  today_errors: number;
  unresolved_errors: number;
  average_response_time_ms: number;
  errors_by_type: ErrorTypeCount[];
  errors_by_endpoint: EndpointErrorCount[];
  errors_by_hour: HourlyErrorCount[];
}

export interface ErrorTypeCount {
  error_type: string;
  count: number;
}

export interface EndpointErrorCount {
  endpoint: string;
  count: number;
}

export interface HourlyErrorCount {
  hour: number;
  count: number;
}

export interface ErrorLogStatsResponse {
  data: ErrorLogStats;
  status: string;
  message: string;
}

// 統計相關類型
export interface OverviewStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  total_trades: number;
  completed_trades: number;
  trades_today: number;
  total_points: number;
  total_carbon_credits: number;
}

export interface OverviewStatsResponse {
  data: OverviewStats;
  status: string;
}

export interface TradeStats {
  total_volume: number;
  daily_trades: DailyStats[];
  by_status: TradeStatusStats[];
}

export interface TradeStatsResponse {
  data: TradeStats;
  status: string;
}

export interface DailyStats {
  date: string;
  count: number;
}

export interface TradeStatusStats {
  status: string;
  count: number;
  total_value: number;
}

export interface UserStats {
  daily_registrations: DailyStats[];
  by_role: RoleStats[];
  by_status: StatusStats[];
}

export interface UserStatsResponse {
  data: UserStats;
  status: string;
}

export interface RoleStats {
  role: string;
  count: number;
}

export interface StatusStats {
  status: string;
  count: number;
}

// 市場相關類型
export interface OrderBookEntry {
  id: string;
  order_type: string;
  price: number;
  quantity: number;
  credit_type: string;
  project_type: string;
  vintage_year: number;
  user_email: string;
  created_at: string;
}

export interface OrderBookData {
  buy_orders: OrderBookEntry[];
  sell_orders: OrderBookEntry[];
}

export interface OrderBookResponse {
  data: OrderBookData;
  status: string;
}

export interface CreateTradeOfferRequest {
  order_type: string;
  price: number;
  quantity: number;
  credit_type: string;
  project_type: string;
  vintage_year: number;
}

export interface TradeOfferData {
  offer_id: string;
  order_type: string;
  price: number;
  quantity: number;
  credit_type: string;
  project_type: string;
  vintage_year: number;
  status: string;
  created_at: string;
}

export interface TradeOfferResponse {
  data: TradeOfferData;
  status: string;
}

export interface PurchaseCreditRequest {
  credit_id: string;
  quantity: number;
}

export interface PurchaseData {
  purchase_id: string;
  asset_id: string;
  credit_type: string;
  quantity: number;
  unit_price: number;
  total_cost: number;
  new_balance: number;
  purchased_at: string;
}

export interface PurchaseResponse {
  data: PurchaseData;
  status: string;
}

// 通知相關類型
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  data: {
    notifications: Notification[];
    pagination: Pagination;
  };
  status: string;
}

export interface MarkReadRequest {
  notification_ids: string[];
}

export interface SuccessResponse {
  status: string;
  message: string;
}
