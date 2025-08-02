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
  credit_type: string; // e.g., "VER", "CER"
  project_type: string; // e.g., "Renewable Energy", "Forestry"
  quantity: number;
  price: number;
  vintage_year: number;
  issuer?: string;
  origin?: string;
  created_at?: string;
}

export interface CarbonOffsetPurchase {
  price_per_token: number;
  total_price_usd: number;
  estimated_fees: number;
  final_price_usd: number;
  transaction_id: string;
  offset_equivalent: {
    car_km: number;
    flights: number;
    tree_months: number;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
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
      const response = await api.get("/auth/me");
      return response.data.data;
    } catch (error) {
      console.error("獲取用戶資訊失敗:", error);
      // 不拋出錯誤，而是返回一個預設用戶對象
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
    localStorage.removeItem("token");
  },

  // 碳信用額相關功能
  async getCarbonCredits(params?: {
    creditType?: string;
    vintageYear?: number;
    projectType?: string;
  }): Promise<CarbonCredit[]> {
    try {
      const response = await api.get("/carbonCredits", { params });
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取碳信用額列表失敗");
    }
  },

  async getCarbonCreditById(creditId: string): Promise<CarbonCredit> {
    try {
      const response = await api.get(`/carbonCredits/${creditId}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取碳信用額詳情失敗");
    }
  },

  // 交易相關功能
  async createTrade(data: CreateTradeRequest): Promise<Trade> {
    try {
      const response = await api.post("/trades/create", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("創建交易失敗");
    }
  },

  async getUserTradeOrders(userId: string): Promise<Trade[]> {
    try {
      const response = await api.get(`/trades/orders/${userId}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶交易訂單失敗");
    }
  },

  // 用戶相關功能
  async getUserAssets(userId: string): Promise<Asset[]> {
    try {
      const response = await api.get(`/users/${userId}/assets`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶資產失敗");
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
      const response = await api.get(`/users/${userId}/tradeHistory`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶交易歷史失敗");
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
  async purchaseCarbonOffset(quantity: number): Promise<CarbonOffsetPurchase> {
    try {
      const response = await api.post("/carbonOffset/purchase", { quantity });
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("購買碳權抵消失敗");
    }
  },

  // 獲取通知列表
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      console.error("獲取通知失敗:", error);
      return [];
    }
  },

  // 獲取概覽統計
  async getStatsOverview(): Promise<{ status: string; data: StatsOverview }> {
    try {
      const response = await api.get("/stats/overview");
      return response.data;
    } catch (error) {
      console.error("獲取統計概覽失敗:", error);
      return {
        status: "error",
        data: {
          total_users: 0,
          active_users: 0,
          total_trades: 0,
          completed_trades: 0,
          total_points: 0,
          total_carbon_credits: 0,
          new_users_today: 0,
          trades_today: 0,
        },
      };
    }
  },

  // 獲取交易統計
  async getTradeStats(): Promise<{ status: string; data: TradeStats }> {
    try {
      const response = await api.get("/stats/trades");
      return response.data;
    } catch (error) {
      console.error("獲取交易統計失敗:", error);
      return {
        status: "error",
        data: {
          by_status: [],
          daily_trades: [],
          total_volume: 0
        }
      };
    }
  },

  // 獲取用戶統計
  async getUserStats(): Promise<{ status: string; data: UserStats }> {
    try {
      const response = await api.get("/stats/users");
      return response.data;
    } catch (error) {
      console.error("獲取用戶統計失敗:", error);
      return {
        status: "error",
        data: {
          by_role: [],
          by_status: [],
          daily_registrations: []
        }
      };
    }
  },
};

export default carbonApi;
