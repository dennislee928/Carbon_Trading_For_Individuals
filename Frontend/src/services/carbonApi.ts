import axios from "axios";

// 定義API基本設定
const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_CARBON_API_URL ||
    "https://carboon-trade-backend.onrender.com",
  VERSION: "api/v1",
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
  baseURL: `${API_CONFIG.BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器處理授權
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 錯誤處理函數
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.error || error.message;
    const statusCode = error.response?.status || "Unknown";
    console.error(`API Error (${statusCode}): ${errorMessage}`);
    throw new Error(`API Error (${statusCode}): ${errorMessage}`);
  }
  console.error("An unexpected error occurred:", error);
  throw new Error("An unexpected error occurred.");
};

// API服務功能
export const carbonApi = {
  // 認證功能
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post("/api/v1/auth/login", data);
      // 保存token到localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("登入失敗");
    }
  },

  async register(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await api.post("/api/v1/auth/register", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("註冊失敗");
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get("/api/v1/auth/me");
      return response.data.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶資訊失敗");
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
      const response = await api.get("/api/v1/carbonCredits", { params });
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取碳信用額列表失敗");
    }
  },

  async getCarbonCreditById(creditId: string): Promise<CarbonCredit> {
    try {
      const response = await api.get(`/api/v1/carbonCredits/${creditId}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取碳信用額詳情失敗");
    }
  },

  // 交易相關功能
  async createTrade(data: CreateTradeRequest): Promise<Trade> {
    try {
      const response = await api.post("/api/v1/trades/create", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("創建交易失敗");
    }
  },

  async getUserTradeOrders(userId: string): Promise<Trade[]> {
    try {
      const response = await api.get(`/api/v1/trades/orders/${userId}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶交易訂單失敗");
    }
  },

  // 用戶相關功能
  async getUserAssets(userId: string): Promise<Asset[]> {
    try {
      const response = await api.get(`/api/v1/users/${userId}/assets`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶資產失敗");
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get(`/api/v1/users/${userId}`);
      return response.data.data || response.data;
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
      const response = await api.put(`/api/v1/users/${userId}`, data);
      return response.data.data || response.data;
    } catch (error) {
      handleError(error);
      throw new Error("更新用戶資料失敗");
    }
  },

  async getUserTradeHistory(userId: string): Promise<Trade[]> {
    try {
      const response = await api.get(`/api/v1/users/${userId}/tradeHistory`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶交易歷史失敗");
    }
  },

  // 管理員相關功能
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get("/api/v1/admin/users");
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取所有用戶列表失敗");
    }
  },

  async createUser(user: User): Promise<User> {
    try {
      const response = await api.post("/api/v1/admin/users", user);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("創建用戶失敗");
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get(`/api/v1/admin/users/${id}`);
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
      const response = await api.put(`/api/v1/admin/users/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("更新用戶資訊失敗");
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/api/v1/admin/users/${id}`);
    } catch (error) {
      handleError(error);
      throw new Error("刪除用戶失敗");
    }
  },
};

export default carbonApi;
