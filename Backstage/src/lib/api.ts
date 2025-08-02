import {
  AdminListResponse,
  AdminUserUpdate,
  UserBalanceListResponse,
  UpdateBalanceRequest,
  AddPointsRequest,
  UserBalanceResponse,
  ErrorLogListResponse,
  ErrorLogResponse,
  CreateErrorLogRequest,
  UpdateErrorLogRequest,
  ErrorLogStatsResponse,
  OverviewStatsResponse,
  TradeStatsResponse,
  UserStatsResponse,
  OrderBookResponse,
  CreateTradeOfferRequest,
  TradeOfferResponse,
  PurchaseCreditRequest,
  PurchaseResponse,
  NotificationListResponse,
  MarkReadRequest,
  SuccessResponse,
  User,
  Admin,
} from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://apiv1-carbontrading.dennisleehappy.org/api/v1";

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // 管理員相關 API
  async getAdmins(params?: {
    search?: string;
    sort?: string;
    page?: string;
  }): Promise<AdminListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sort) searchParams.append("sort", params.sort);
    if (params?.page) searchParams.append("page", params.page);

    const query = searchParams.toString();
    return this.request<AdminListResponse>(
      `/admin/admins${query ? `?${query}` : ""}`
    );
  }

  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>("/admin/users");
  }

  async getUser(userID: string): Promise<User> {
    return this.request<User>(`/admin/users/${userID}`);
  }

  async createUser(user: Partial<User>): Promise<User> {
    return this.request<User>("/admin/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  async updateUser(userID: string, updateData: AdminUserUpdate): Promise<User> {
    return this.request<User>(`/admin/users/${userID}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteUser(userID: string): Promise<void> {
    return this.request<void>(`/admin/users/${userID}`, {
      method: "DELETE",
    });
  }

  // 積分相關 API
  async getAllBalances(params?: {
    page?: number;
    limit?: number;
  }): Promise<UserBalanceListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    return this.request<UserBalanceListResponse>(
      `/admin/balances${query ? `?${query}` : ""}`
    );
  }

  async updateUserBalance(
    userID: string,
    data: UpdateBalanceRequest
  ): Promise<UserBalanceResponse> {
    return this.request<UserBalanceResponse>(`/admin/users/${userID}/balance`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async addUserPoints(
    userID: string,
    data: AddPointsRequest
  ): Promise<UserBalanceResponse> {
    return this.request<UserBalanceResponse>(
      `/admin/users/${userID}/balance/add`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  // 錯誤記錄相關 API
  async getErrorLogs(params?: {
    page?: number;
    limit?: number;
    error_type?: string;
    status_code?: number;
    endpoint?: string;
    user_id?: string;
    resolved?: boolean;
    start_date?: string;
    end_date?: string;
  }): Promise<ErrorLogListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.error_type)
      searchParams.append("error_type", params.error_type);
    if (params?.status_code)
      searchParams.append("status_code", params.status_code.toString());
    if (params?.endpoint) searchParams.append("endpoint", params.endpoint);
    if (params?.user_id) searchParams.append("user_id", params.user_id);
    if (params?.resolved !== undefined)
      searchParams.append("resolved", params.resolved.toString());
    if (params?.start_date)
      searchParams.append("start_date", params.start_date);
    if (params?.end_date) searchParams.append("end_date", params.end_date);

    const query = searchParams.toString();
    return this.request<ErrorLogListResponse>(
      `/admin/error-logs${query ? `?${query}` : ""}`
    );
  }

  async getErrorLog(id: string): Promise<ErrorLogResponse> {
    return this.request<ErrorLogResponse>(`/admin/error-logs/${id}`);
  }

  async createErrorLog(data: CreateErrorLogRequest): Promise<ErrorLogResponse> {
    return this.request<ErrorLogResponse>("/admin/error-logs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resolveErrorLog(
    id: string,
    data: UpdateErrorLogRequest
  ): Promise<ErrorLogResponse> {
    return this.request<ErrorLogResponse>(`/admin/error-logs/${id}/resolve`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getErrorLogStats(days?: number): Promise<ErrorLogStatsResponse> {
    const searchParams = new URLSearchParams();
    if (days) searchParams.append("days", days.toString());

    const query = searchParams.toString();
    return this.request<ErrorLogStatsResponse>(
      `/admin/error-logs/stats${query ? `?${query}` : ""}`
    );
  }

  // 統計相關 API
  async getOverviewStats(): Promise<OverviewStatsResponse> {
    return this.request<OverviewStatsResponse>("/stats/overview");
  }

  async getTradeStats(): Promise<TradeStatsResponse> {
    return this.request<TradeStatsResponse>("/stats/trades");
  }

  async getUserStats(): Promise<UserStatsResponse> {
    return this.request<UserStatsResponse>("/stats/users");
  }

  // 市場相關 API
  async getOrderBook(params?: {
    credit_type?: string;
    vintage_year?: number;
    project_type?: string;
  }): Promise<OrderBookResponse> {
    const searchParams = new URLSearchParams();
    if (params?.credit_type)
      searchParams.append("credit_type", params.credit_type);
    if (params?.vintage_year)
      searchParams.append("vintage_year", params.vintage_year.toString());
    if (params?.project_type)
      searchParams.append("project_type", params.project_type);

    const query = searchParams.toString();
    return this.request<OrderBookResponse>(
      `/market/orderbook${query ? `?${query}` : ""}`
    );
  }

  async createTradeOffer(
    data: CreateTradeOfferRequest
  ): Promise<TradeOfferResponse> {
    return this.request<TradeOfferResponse>("/market/trade-offers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async purchaseCredit(data: PurchaseCreditRequest): Promise<PurchaseResponse> {
    return this.request<PurchaseResponse>("/market/purchase", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // 通知相關 API
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unread_only?: boolean;
  }): Promise<NotificationListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.unread_only !== undefined)
      searchParams.append("unread_only", params.unread_only.toString());

    const query = searchParams.toString();
    return this.request<NotificationListResponse>(
      `/notifications${query ? `?${query}` : ""}`
    );
  }

  async markNotificationsAsRead(
    data: MarkReadRequest
  ): Promise<SuccessResponse> {
    return this.request<SuccessResponse>("/notifications/mark-read", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteNotification(notificationID: string): Promise<SuccessResponse> {
    return this.request<SuccessResponse>(`/notifications/${notificationID}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
