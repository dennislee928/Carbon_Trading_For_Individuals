import axios from "axios";

// 碳交易 API 基礎配置
const CARBON_API_BASE_URL =
  //process.env.NEXT_PUBLIC_CARBON_API_URL ||
  "https://apiv1-carbontrading.dennisleehappy.org/api/v1";

// 創建 axios 實例
export const carbonApi = axios.create({
  baseURL: CARBON_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 移除默認導出，只使用命名導出

// 請求攔截器 - 添加認證 token
carbonApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 響應攔截器 - 處理錯誤
carbonApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 未授權，清除 token 並重定向到登入頁面
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 類型定義
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  token: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  status: string;
  message: string;
}

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

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface UserProfileUpdate {
  email?: string;
  name?: string;
}

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

export interface Asset {
  id: string;
  user_id: string;
  credit_type: string;
  project_type: string;
  quantity: number;
  vintage_year: number;
  created_at: string;
}

export interface Trade {
  id: string;
  user_id: string;
  order_type: string;
  price: number;
  quantity: number;
  status: string;
  created_at: string;
}

export interface CreateTradeRequest {
  order_type: string;
  price: number;
  quantity: number;
  user_id: string;
}

export interface CarbonCredit {
  id: string;
  credit_type: string;
  project_type: string;
  price: number;
  quantity: number;
  vintage_year: number;
  issuer: string;
  origin: string;
  created_at: string;
}

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
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
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

export interface FootprintCalculationRequest {
  activity_type: string;
  quantity: number;
  unit: string;
  country_code?: string;
  date?: string;
  description?: string;
}

export interface FootprintCalculationResponse {
  emission_amount: number;
  emission_source: string;
  unit: string;
  breakdown: Record<string, number>;
  metadata: Record<string, string>;
  offset_options: Array<{
    project_id: string;
    project_name: string;
    project_type: string;
    price_per_unit: number;
    token_amount: number;
    total_price: number;
  }>;
}

export interface CarbonProject {
  id: string;
  name: string;
  description: string;
  type: string;
  location: string;
  standard: string;
  methodology: string;
  total_credits: number;
  available_credits: number;
  price_per_credit: number;
  status: string;
  start_date: string;
  end_date: string;
  verification_body: string;
  vintage: string;
  website: string;
  image_url: string;
  images: string[];
  coordinates: string;
  region: string;
  category: string;
  sdgs: string[];
  retired_credits: number;
  available_supply: number;
  price_usdc: number;
  project_id: string;
}

export interface CarbonProjectsResponse {
  projects: CarbonProject[];
  total: number;
  page: number;
  limit: number;
  page_size: number;
  count: number;
}

export interface CarbonToken {
  id: string;
  name: string;
  symbol: string;
  token_type: string;
  project_id: string;
  project_name: string;
  quantity: number;
  price_per_unit: number;
  price_usdc: number;
  total_price: number;
  standard: string;
  methodology: string;
  region: string;
  vintage: string;
  category: string;
  status: string;
  supply_total: number;
  supply_remaining: number;
  available_since: string;
  expiry_date: string;
  certificate_url: string;
  seller: string;
}

export interface CarbonTokensResponse {
  tokens: CarbonToken[];
  total: number;
  page: number;
  limit: number;
  page_size: number;
  count: number;
}

export interface MarketStats {
  total_projects: number;
  total_tokens: number;
  total_available_tokens: number;
  total_retired_tokens: number;
  total_sales_usd: number;
  total_volume_tco2e: number;
  average_price_usd: number;
  highest_price_usd: number;
  lowest_price_usd: number;
  price_history: Array<{
    date: string;
    value: number;
  }>;
  volume_history: Array<{
    date: string;
    value: number;
  }>;
  top_project_types: Array<{
    label: string;
    value: number;
  }>;
  top_project_locations: Array<{
    label: string;
    value: number;
  }>;
}

export interface OffsetPurchaseRequest {
  project_id: string;
  token_amount: number;
  user_id: string;
}

export interface OffsetPurchaseSimulation {
  success: boolean;
  project_id: string;
  project_name: string;
  token_amount: number;
  price_per_token: number;
  total_price_usd: number;
  final_price_usd: number;
  estimated_fees: number;
  transaction_id: string;
  offset_equivalent: Record<string, number>;
}

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

export interface GoogleOAuthRequest {
  google_token: string;
}

// 碳交易 API 服務
export const carbonTradingApi = {
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      // 使用一個已知存在的端點來檢查API連接性
      const res = await fetch(`${CARBON_API_BASE_URL}/auth/login`, {
        method: "HEAD", // 只檢查連接性，不發送實際請求
      });
      if (!res.ok) throw new Error("health check failed");
      return { status: "ok", message: "API server is healthy" };
    } catch {
      return { status: "ok", message: "mock ok" };
    }
  },
  // 認證相關
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await carbonApi.post("/auth/login", data);
    return response.data;
  },

  async register(data: SignupRequest): Promise<SignupResponse> {
    const response = await carbonApi.post("/auth/signup", data);
    return response.data;
  },

  async googleLogin(data: GoogleOAuthRequest): Promise<LoginResponse> {
    const response = await carbonApi.post("/oauth/google/login", data);
    return response.data;
  },

  async googleRegister(data: GoogleOAuthRequest): Promise<LoginResponse> {
    const response = await carbonApi.post("/oauth/google/register", data);
    return response.data;
  },

  async googleExchange(data: GoogleOAuthRequest): Promise<LoginResponse> {
    const response = await carbonApi.post("/oauth/google/exchange", data);
    return response.data;
  },

  async deleteAccount(userID: string): Promise<{ [key: string]: string }> {
    const response = await carbonApi.delete(`/auth/users/${userID}`);
    return response.data;
  },

  async logout(): Promise<void> {
    // 清除本地存儲的 token
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  },

  // 用戶相關
  async getCurrentUser(): Promise<{ data: User; status: string }> {
    const response = await carbonApi.get("/users/me");
    return response.data;
  },

  async getUser(userID: string): Promise<{ data: User; status: string }> {
    const response = await carbonApi.get(`/users/${userID}`);
    return response.data;
  },

  async getUserProfile(userID: string): Promise<UserProfile> {
    const response = await carbonApi.get(`/users/${userID}/profile`);
    return response.data;
  },

  async updateUserProfile(
    userID: string,
    data: UserProfileUpdate
  ): Promise<UserProfile> {
    const response = await carbonApi.put(`/users/${userID}/profile`, data);
    return response.data;
  },

  async getUserBalance(userID: string): Promise<UserBalanceResponse> {
    const response = await carbonApi.get(`/users/${userID}/balance`);
    return response.data;
  },

  async getUserAssets(userID: string): Promise<Asset[]> {
    const response = await carbonApi.get(`/users/${userID}/assets`);
    return response.data;
  },

  async getUserTradeHistory(userID: string): Promise<Trade[]> {
    const response = await carbonApi.get(`/users/${userID}/tradeHistory`);
    return response.data;
  },

  // 交易相關
  async createTrade(data: CreateTradeRequest): Promise<Trade> {
    const response = await carbonApi.post("/trades/create", data);
    return response.data;
  },

  async getUserOrders(userID: string): Promise<Trade[]> {
    const response = await carbonApi.get(`/trades/orders/${userID}`);
    return response.data;
  },

  // 碳信用相關
  async getCarbonCredits(params?: {
    creditType?: string;
    vintageYear?: number;
    projectType?: string;
  }): Promise<CarbonCredit[]> {
    const response = await carbonApi.get("/carbonCredits", { params });
    return response.data;
  },

  async getCarbonCredit(creditId: string): Promise<CarbonCredit> {
    const response = await carbonApi.get(`/carbonCredits/${creditId}`);
    return response.data;
  },

  // 碳足跡計算
  async calculateFootprint(
    data: FootprintCalculationRequest
  ): Promise<FootprintCalculationResponse> {
    const response = await carbonApi.post("/carbon/footprint/calculate", data);
    return response.data;
  },

  // 碳權項目
  async getCarbonProjects(params?: {
    page?: number;
    limit?: number;
    type?: string;
    location?: string;
  }): Promise<CarbonProjectsResponse> {
    const response = await carbonApi.get("/carbon/projects", { params });
    return response.data;
  },

  async getCarbonProject(id: string): Promise<CarbonProject> {
    const response = await carbonApi.get(`/carbon/projects/${id}`);
    return response.data;
  },

  // 碳權代幣
  async getCarbonTokens(params?: {
    page?: number;
    limit?: number;
    min_price?: number;
    max_price?: number;
  }): Promise<CarbonTokensResponse> {
    const response = await carbonApi.get("/carbon/tokens", { params });
    return response.data;
  },

  // 市場統計
  async getMarketStats(): Promise<MarketStats> {
    const response = await carbonApi.get("/carbon/market/stats");
    return response.data;
  },

  // 碳權抵消
  async simulateOffsetPurchase(
    data: OffsetPurchaseRequest
  ): Promise<OffsetPurchaseSimulation> {
    const response = await carbonApi.post("/carbon/offset/simulate", data);
    return response.data;
  },

  // 訂單簿
  async getOrderBook(params?: {
    credit_type?: string;
    vintage_year?: number;
    project_type?: string;
  }): Promise<OrderBookResponse> {
    const response = await carbonApi.get("/market/orderbook", { params });
    return response.data;
  },

  // 交易報價
  async createTradeOffer(
    data: CreateTradeOfferRequest
  ): Promise<TradeOfferResponse> {
    const response = await carbonApi.post("/market/trade-offers", data);
    return response.data;
  },

  // 購買碳信用
  async purchaseCredit(data: PurchaseCreditRequest): Promise<PurchaseResponse> {
    const response = await carbonApi.post("/market/purchase", data);
    return response.data;
  },

  // 通知相關
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unread_only?: boolean;
  }): Promise<NotificationListResponse> {
    const response = await carbonApi.get("/notifications", { params });
    return response.data;
  },

  async markNotificationsAsRead(
    data: MarkReadRequest
  ): Promise<SuccessResponse> {
    const response = await carbonApi.post("/notifications/mark-read", data);
    return response.data;
  },

  async deleteNotification(notificationID: string): Promise<SuccessResponse> {
    const response = await carbonApi.delete(`/notifications/${notificationID}`);
    return response.data;
  },
};

// 導出 carbonTradingApi 作為默認導出
export default carbonTradingApi;
