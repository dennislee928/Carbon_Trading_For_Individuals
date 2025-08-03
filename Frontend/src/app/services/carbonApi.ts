import axios from "axios";

// 定義API基本設定
const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_CARBON_API_URL ||
    "https://apiv1-carbontrading.dennisleehappy.org/api/v1",
  VERSION: "v1",
};

// 類型定義
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  token: string;
}

export interface SignupResponse {
  status: string;
  message: string;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  name?: string;
  role?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  address?: string;
  phone?: string;
  level?: number;
  last_login?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface UserProfileUpdate {
  email?: string;
  name?: string;
}

export interface ErrorResponse {
  error: string;
}

export interface CarbonCredit {
  id: string;
  name: string;
  description: string;
  type: string;
  location: string;
  region?: string;
  standard: string;
  methodology?: string;
  start_date?: string;
  end_date?: string;
  total_credits: number;
  available_credits: number;
  retired_credits: number;
  price_per_credit: number;
  image_url?: string;
  images?: string[] | null;
  website?: string;
  verification_body?: string;
  sdgs?: string[] | null;
  coordinates?: string;
  vintage?: string;
  status?: string;
  available_supply?: number;
  price_usdc?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CarbonFootprintCalculateResponse {
  emission_amount: number;
  unit: string;
  emission_source: string;
  breakdown?: {
    CH4?: number;
    CO2?: number;
    N2O?: number;
  };
  offset_options?: Array<{
    project_id: string;
    project_name: string;
    project_type: string;
    token_amount: number;
    price_per_unit: number;
    total_price: number;
  }>;
  metadata?: any;
}

// 碳權抵消購買
export interface CarbonOffsetPurchase {
  purchase_id: string;
  asset_id: string;
  credit_type: string;
  quantity: number;
  unit_price: number;
  total_cost: number;
  new_balance?: number;
  purchased_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  data?: any;
}

export interface NotificationResponse {
  status: string;
  data: {
    notifications: Notification[] | null;
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface CarbonMarketStats {
  total_projects: number;
  total_tokens: number;
  total_available_tokens: number;
  total_retired_tokens: number;
  total_volume_tco2e: number;
  total_sales_usd: number;
  average_price_usd: number;
  highest_price_usd: number;
  lowest_price_usd: number;
  top_project_types: Array<{
    label: string;
    value: number;
  }>;
  top_project_locations: Array<{
    label: string;
    value: number;
  }>;
  price_history: Array<{
    date: string;
    value: number;
  }>;
  volume_history: Array<{
    date: string;
    value: number;
  }>;
}

export interface StatsOverview {
  total_users: number;
  active_users: number;
  total_trades: number;
  completed_trades: number;
  total_points: number;
  total_carbon_credits: number;
  new_users_today: number;
  trades_today: number;
}

export interface TradeStats {
  by_status: Array<{
    status: string;
    count: number;
    total_value: number;
  }>;
  daily_trades: Array<{
    date: string;
    count: number;
  }>;
  total_volume: number;
}

export interface UserStats {
  by_role: Array<{
    role: string;
    count: number;
  }>;
  by_status: Array<{
    status: string;
    count: number;
  }>;
  daily_registrations: Array<{
    date: string;
    count: number;
  }>;
}

export interface Asset {
  id: string;
  user_id: string;
  credit_type: string;
  project_type: string;
  quantity: number;
  vintage_year: number;
  created_at?: string;
}

export interface Trade {
  id: string;
  user_id: string;
  order_type: string;
  quantity: number;
  price: number;
  status?: string;
  created_at?: string;
}

export interface CreateTradeRequest {
  user_id: string;
  order_type: string;
  quantity: number;
  price: number;
}

export interface CarbonProject {
  id: string;
  name: string;
  description: string;
  type: string;
  location: string;
  region: string;
  standard: string;
  methodology: string;
  start_date: string;
  end_date: string;
  total_credits: number;
  available_credits: number;
  retired_credits: number;
  price_per_credit: number;
  image_url: string;
  images: string[] | null;
  website: string;
  verification_body: string;
  sdgs: string[] | null;
  coordinates: string;
  vintage: string;
  status: string;
  available_supply: number;
  price_usdc: number;
}

export interface CarbonProjectResponse {
  projects: CarbonProject[];
  total: number;
  count: number;
  page: number;
  limit: number;
  page_size: number;
}

export interface CarbonToken {
  id: string;
  name: string;
  symbol: string;
  token_type: string;
  project_id: string;
  project_name: string;
  vintage: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  standard: string;
  status: string;
  seller: string;
  region: string;
  category: string;
  supply_total: number;
  supply_remaining: number;
  available_since: string;
  expiry_date: string;
  certificate_url: string;
  price_usdc: number;
}

export interface CarbonTokenResponse {
  tokens: CarbonToken[];
  total: number;
  count: number;
  page: number;
  limit: number;
  page_size: number;
}

export interface TradeOfferRequest {
  order_type: "buy" | "sell";
  credit_type: string;
  vintage_year: number;
  project_type: string;
  quantity: number;
  price: number;
}

export interface TradeOfferResponse {
  id: string;
  user_id: string;
  order_type: string;
  credit_type: string;
  vintage_year: number;
  project_type: string;
  quantity: number;
  price: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MarketPurchaseResponse {
  purchase_id: string;
  asset_id: string;
  credit_type: string;
  quantity: number;
  unit_price: number;
  total_cost: number;
  new_balance: number;
  purchased_at: string;
}

export interface OrderBookEntry {
  id: string;
  order_type: "buy" | "sell";
  credit_type: string;
  vintage_year: number;
  project_type: string;
  quantity: number;
  price: number;
  total_amount: number;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderBookResponse {
  buy_orders: OrderBookEntry[];
  sell_orders: OrderBookEntry[];
  total_buy_orders: number;
  total_sell_orders: number;
  total_buy_volume: number;
  total_sell_volume: number;
}

// API客戶端設置
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器處理授權
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("已添加授權頭:", `Bearer ${token.substring(0, 15)}...`);
    }
  } catch (error) {
    console.error("處理授權頭時出錯:", error);
  }
  return config;
});

// 錯誤處理函數
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    // 詳細記錄錯誤信息以便於調試
    console.error("API錯誤詳情:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });

    const errorMessage = error.response?.data?.error || error.message;
    const statusCode = error.response?.status || "Unknown";
    throw new Error(`API Error (${statusCode}): ${errorMessage}`);
  }
  console.error("發生未預期的錯誤:", error);
  throw new Error("發生未預期的錯誤，請稍後再試。");
};

// API服務功能
export const carbonApi = {
  // 認證功能
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("API BASE_URL:", API_CONFIG.BASE_URL);
      console.log("發送登入請求到:", `${API_CONFIG.BASE_URL}/auth/login`);
      const response = await api.post("/auth/login", data);
      console.log("登入API響應:", response.data);
      // 保存token到localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      console.log("登入請求失敗:", error);
      handleError(error);
      throw new Error("登入失敗");
    }
  },

  async register(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await api.post("/auth/register", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("註冊失敗");
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get("/users/me");
      console.log("Auth me response:", response.data);

      // 檢查不同的響應結構
      let userData = response.data;
      if (response.data && response.data.data) {
        userData = response.data.data;
      }

      if (!userData || !userData.id || !userData.email) {
        console.warn("API響應中缺少用戶ID或email，使用預設本地用戶:", userData);
        return {
          id: "local-user",
          email: "local@example.com",
          name: "本地用戶",
          role: "user",
          status: "active",
        };
      }
      return userData;
    } catch (error) {
      console.error("獲取用戶資訊失敗:", error);
      return {
        id: "local-user",
        email: "local@example.com",
        name: "本地用戶",
        role: "user",
        status: "active",
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout"); // 調用後端登出API
    } catch (error) {
      console.error("登出API調用失敗:", error);
    } finally {
      localStorage.removeItem("token"); // 無論API是否成功，都清除本地token
    }
  },

  // 碳信用額相關功能
  async getCarbonCredits(params?: {
    creditType?: string;
    vintageYear?: number;
    projectType?: string;
  }): Promise<CarbonCredit[]> {
    try {
      const response = await api.get("/carbon/projects", { params });
      return response.data.projects; // 從 data.projects 中獲取實際列表
    } catch (error) {
      console.error("獲取碳權列表失敗:", error);
      return [];
    }
  },

  async getCarbonCreditById(creditId: string): Promise<CarbonCredit> {
    try {
      const response = await api.get(`/carbon/projects/${creditId}`);
      return response.data; // 直接返回單個項目數據
    } catch (error) {
      handleError(error);
      throw new Error("獲取碳信用額詳情失敗");
    }
  },

  // 交易相關功能
  async createTrade(data: {
    credit_type: string;
    vintage_year: number;
    project_type: string;
    quantity: number;
    price: number;
  }): Promise<Trade> {
    try {
      const response = await api.post("/trades/create", data);
      return response.data; // 返回新創建的交易
    } catch (error) {
      handleError(error);
      throw new Error("創建交易失敗");
    }
  },

  async getUserTradeOrders(userId: string): Promise<Trade[]> {
    try {
      const response = await api.get(`/users/${userId}/trades`);
      return response.data;
    } catch (error) {
      console.error("獲取用戶交易訂單失敗:", error);
      return [];
    }
  },

  // 用戶相關功能
  async getUserAssets(userId: string): Promise<Asset[]> {
    try {
      const response = await api.get(`/users/${userId}/assets`);
      return response.data;
    } catch (error) {
      console.error("獲取用戶資產失敗:", error);
      return [];
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶資料失敗");
    }
  },

  async updateUserProfile(
    userId: string,
    data: UserProfileUpdate
  ): Promise<UserProfile> {
    try {
      const response = await api.put(`/users/${userId}/profile`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("更新用戶資料失敗");
    }
  },

  async getUserTradeHistory(userId: string): Promise<Trade[]> {
    try {
      const response = await api.get(`/users/${userId}/trades`);
      return response.data;
    } catch (error) {
      console.error("獲取用戶交易歷史失敗:", error);
      return [];
    }
  },

  // 管理員相關功能
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get("/admin/users");
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取所有用戶列表失敗");
    }
  },

  async createUser(user: User): Promise<User> {
    try {
      const response = await api.post("/admin/users", user);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("創建用戶失敗");
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶詳情失敗");
    }
  },

  async updateUser(
    id: string,
    data: { name?: string; role?: string }
  ): Promise<User> {
    try {
      const response = await api.put(`/admin/users/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("更新用戶資訊失敗");
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/admin/users/${id}`);
    } catch (error) {
      handleError(error);
      throw new Error("刪除用戶失敗");
    }
  },

  // 碳權抵消購買
  async purchaseCarbonOffset(data: {
    credit_id: string;
    quantity: number;
  }): Promise<CarbonOffsetPurchase> {
    try {
      const response = await api.post("/market/purchase", data);
      return response.data.data; // 返回 data.data 物件
    } catch (error) {
      console.error("購買碳權抵消失敗:", error);
      throw new Error("購買碳權抵消失敗");
    }
  },

  // 獲取通知列表
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get("/notifications");
      return response.data.data.notifications; // 從 data.data.notifications 中獲取實際列表
    } catch (error) {
      console.error("獲取通知失敗:", error);
      return [];
    }
  },

  // 獲取概覽統計
  async getStatsOverview(): Promise<StatsOverview> {
    try {
      const response = await api.get("/stats/overview");
      return response.data.data; // 返回 data.data 物件
    } catch (error) {
      console.error("獲取統計概覽失敗:", error);
      throw new Error("獲取統計概覽失敗");
    }
  },

  // 獲取交易統計
  async getTradeStats(): Promise<TradeStats> {
    try {
      const response = await api.get("/stats/trades");
      return response.data.data; // 返回 data.data 物件
    } catch (error) {
      console.error("獲取交易統計失敗:", error);
      throw new Error("獲取交易統計失敗");
    }
  },

  // 獲取用戶統計
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await api.get("/stats/users");
      return response.data.data; // 返回 data.data 物件
    } catch (error) {
      console.error("獲取用戶統計失敗:", error);
      throw new Error("獲取用戶統計失敗");
    }
  },

  async calculateCarbonFootprint(data: {
    activity_type: string;
    quantity: number;
    unit: string;
    country_code: string;
  }): Promise<CarbonFootprintCalculateResponse> {
    try {
      const response = await api.post("/carbon/footprint/calculate", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("計算碳足跡失敗");
    }
  },

  async getCarbonMarketStats(): Promise<CarbonMarketStats> {
    try {
      const response = await api.get("/carbon/market/stats");
      return response.data; // 直接返回數據
    } catch (error) {
      handleError(error);
      throw new Error("獲取碳市場統計失敗");
    }
  },

  async getCarbonTokens(params?: {
    page?: number;
    limit?: number;
  }): Promise<CarbonTokenResponse> {
    try {
      const response = await api.get("/carbon/tokens", { params });
      return response.data; // 返回包含 tokens 和分頁信息的數據
    } catch (error) {
      handleError(error);
      throw new Error("獲取碳權代幣列表失敗");
    }
  },

  async createTradeOffer(data: TradeOfferRequest): Promise<TradeOfferResponse> {
    try {
      const response = await api.post("/market/trade-offers", data);
      return response.data; // 返回新創建的交易報價
    } catch (error) {
      handleError(error);
      throw new Error("創建交易報價失敗");
    }
  },

  async getOrderBook(): Promise<OrderBookResponse> {
    try {
      const response = await api.get("/market/orderbook");
      return response.data; // 返回訂單簿數據
    } catch (error) {
      handleError(error);
      throw new Error("獲取訂單簿失敗");
    }
  },

  async simulateCarbonOffset(data: {
    user_id: string;
    project_id: string;
    token_amount: number;
  }): Promise<CarbonFootprintCalculateResponse> {
    try {
      const response = await api.post("/carbon/offset/simulate", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("模擬碳權抵消失敗");
    }
  },

  async getCarbonProjects(params?: {
    page?: number;
    limit?: number;
  }): Promise<CarbonProjectResponse> {
    try {
      const response = await api.get("/carbon/projects", { params });
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取碳權項目失敗");
    }
  },

  async getCarbonProjectById(projectId: string): Promise<CarbonProject> {
    try {
      const response = await api.get(`/carbon/projects/${projectId}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取碳權項目詳情失敗");
    }
  },
};

export default carbonApi;
