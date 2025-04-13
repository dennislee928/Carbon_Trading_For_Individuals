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
    const statusCode = error.response?.status || "Unknown";

    // 處理特定狀態碼的錯誤
    if (statusCode === 404) {
      console.error("API端點不存在 (404):", error.config?.url);
      throw new Error(`API端點不存在 (${statusCode}): ${error.config?.url}`);
    }

    if (statusCode === 401) {
      console.error(
        "授權失敗 (401):",
        error.response?.data?.message || error.message
      );
      localStorage.removeItem("token"); // 清除無效的token
      throw new Error(`授權失敗 (${statusCode}): 請重新登入`);
    }

    if (statusCode === 403) {
      console.error(
        "沒有權限 (403):",
        error.response?.data?.message || error.message
      );
      throw new Error(`沒有權限 (${statusCode}): 請確認您的帳戶權限`);
    }

    if (statusCode === 500) {
      console.error(
        "伺服器錯誤 (500):",
        error.response?.data?.message || error.message
      );
      throw new Error(`伺服器錯誤 (${statusCode}): 請稍後再試`);
    }

    // 處理其他錯誤
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "未知錯誤";
    console.error(`API Error (${statusCode}):`, errorMessage, error.config);
    throw new Error(`API錯誤 (${statusCode}): ${errorMessage}`);
  }

  // 非Axios錯誤
  console.error("非API請求錯誤:", error);
  if (error instanceof Error) {
    throw new Error(`請求錯誤: ${error.message}`);
  }
  throw new Error("發生未預期的錯誤");
};

// API服務功能
export const carbonApi = {
  // API健康檢查
  async checkHealth(): Promise<{ status: string; message?: string }> {
    try {
      // 嘗試主要的健康檢查端點
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        return { status: "ok", message: data.status || "API服務正常" };
      }

      // 如果主要端點失敗，嘗試v1端點
      try {
        const v1Response = await fetch(
          `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}/health`
        );
        if (v1Response.ok) {
          const data = await v1Response.json();
          return { status: "ok", message: data.status || "API v1服務正常" };
        }
      } catch (e) {
        console.warn("Health v1檢查失敗", e);
      }

      return { status: "error", message: "API健康檢查失敗" };
    } catch (error) {
      console.error("API健康檢查錯誤", error);
      return { status: "error", message: "無法連接到API服務" };
    }
  },

  // 認證功能
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post(
        `/${API_CONFIG.VERSION}/auth/login`,
        data
      );
      console.log("原始登入響應:", response.data);

      // 處理不同格式的登入響應
      let token = "";
      let status = "error";

      // 判斷響應格式
      if (response.data.token) {
        // 標準格式：{ token: "..." }
        token = response.data.token;
        status = response.data.status || "success";
      } else if (response.data.data && response.data.data.token) {
        // 嵌套格式：{ data: { token: "..." } }
        token = response.data.data.token;
        status = response.data.status || "success";
      } else if (
        typeof response.data === "string" &&
        response.data.includes("token")
      ) {
        // 字符串格式，嘗試解析
        try {
          const parsedData = JSON.parse(response.data);
          token = parsedData.token || "";
          status = parsedData.status || "success";
        } catch (e) {
          console.error("無法解析登入響應字符串:", e);
          throw new Error("登入響應格式不正確");
        }
      } else {
        // 未知格式
        console.error("未知的登入響應格式:", response.data);
        throw new Error("登入響應格式不正確");
      }

      // 檢查是否有有效的token
      if (!token) {
        throw new Error("登入失敗：未接收到有效的認證令牌");
      }

      // 保存token到localStorage
      localStorage.setItem("token", token);

      return {
        status,
        token,
      };
    } catch (error) {
      console.error("登入過程中發生錯誤:", error);
      handleError(error);
      throw new Error("登入失敗");
    }
  },

  async register(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await api.post(
        `/${API_CONFIG.VERSION}/auth/register`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("註冊失敗");
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get(`/${API_CONFIG.VERSION}/auth/me`);
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
      const response = await api.get(`/${API_CONFIG.VERSION}/carbonCredits`, {
        params,
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取碳信用額列表失敗");
    }
  },

  async getCarbonCreditById(creditId: string): Promise<CarbonCredit> {
    try {
      const response = await api.get(
        `/${API_CONFIG.VERSION}/carbonCredits/${creditId}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取碳信用額詳情失敗");
    }
  },

  // 交易相關功能
  async createTrade(data: CreateTradeRequest): Promise<Trade> {
    try {
      const response = await api.post(
        `/${API_CONFIG.VERSION}/trades/create`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("創建交易失敗");
    }
  },

  async getUserTradeOrders(userId: string): Promise<Trade[]> {
    try {
      const response = await api.get(
        `/${API_CONFIG.VERSION}/trades/orders/${userId}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶交易訂單失敗");
    }
  },

  // 用戶相關功能
  async getUserAssets(userId: string): Promise<Asset[]> {
    try {
      const response = await api.get(
        `/${API_CONFIG.VERSION}/users/${userId}/assets`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶資產失敗");
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await api.get(`/${API_CONFIG.VERSION}/users/${userId}`);
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
      const response = await api.put(
        `/${API_CONFIG.VERSION}/users/${userId}`,
        data
      );
      return response.data.data || response.data;
    } catch (error) {
      handleError(error);
      throw new Error("更新用戶資料失敗");
    }
  },

  async getUserTradeHistory(userId: string): Promise<Trade[]> {
    try {
      const response = await api.get(
        `/${API_CONFIG.VERSION}/users/${userId}/tradeHistory`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取用戶交易歷史失敗");
    }
  },

  // 管理員相關功能
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get(`/${API_CONFIG.VERSION}/admin/users`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("獲取所有用戶列表失敗");
    }
  },

  async createUser(user: User): Promise<User> {
    try {
      const response = await api.post(
        `/${API_CONFIG.VERSION}/admin/users`,
        user
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("創建用戶失敗");
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get(
        `/${API_CONFIG.VERSION}/admin/users/${id}`
      );
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
      const response = await api.put(
        `/${API_CONFIG.VERSION}/admin/users/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("更新用戶資訊失敗");
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/${API_CONFIG.VERSION}/admin/users/${id}`);
    } catch (error) {
      handleError(error);
      throw new Error("刪除用戶失敗");
    }
  },
};

export default carbonApi;
