import emailjs from "@emailjs/browser";

// EmailJS 配置
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

// 初始化 EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface EmailTemplateParams {
  to_email: string;
  user_name: string;
  otp_code: string;
  to_name?: string; // 添加可選的收件人姓名
}

export class EmailJSService {
  /**
   * 發送 OTP 驗證碼郵件
   */
  static async sendOTPEmail(params: EmailTemplateParams): Promise<void> {
    // 驗證輸入參數
    if (!params.to_email || !params.to_email.trim()) {
      throw new Error("收件人電子郵件地址不能為空");
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      // 如果 EmailJS 未配置，使用模擬模式
      console.log("EmailJS 未配置，使用模擬模式");
      console.log("模擬發送 OTP 到:", params.to_email);
      console.log("OTP 驗證碼:", params.otp_code);

      // 模擬網絡延遲
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 將 OTP 存儲到 localStorage 用於測試
      localStorage.setItem("mock_otp", params.otp_code);
      localStorage.setItem("mock_email", params.to_email);
      localStorage.setItem("mock_otp_timestamp", Date.now().toString());

      return;
    }

    try {
      console.log("EmailJS 配置檢查:", {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        publicKey: EMAILJS_PUBLIC_KEY ? "已設定" : "未設定",
        recipient: params.to_email,
      });

      // 準備模板參數，確保包含收件人地址
      const templateParams = {
        to_email: params.to_email,
        to_name: params.to_name || params.user_name,
        user_name: params.user_name,
        otp_code: params.otp_code,
        // 某些 EmailJS 模板可能需要這些額外參數
        reply_to: params.to_email,
        from_name: "碳交易平台",
        message: `您的 OTP 驗證碼是: ${params.otp_code}`,
      };

      console.log("發送 EmailJS 郵件，參數:", templateParams);

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log("EmailJS 發送成功:", response);
    } catch (error: any) {
      console.error("EmailJS 發送失敗:", error);

      // 提供更詳細的錯誤信息
      if (error.status === 422) {
        if (error.text?.includes("recipients address is empty")) {
          throw new Error(
            "EmailJS 模板設定錯誤：收件人地址為空。請檢查 EmailJS 模板設定"
          );
        }
        throw new Error(`EmailJS 請求錯誤 (${error.status}): ${error.text}`);
      }

      throw new Error(`發送郵件失敗：${error.message || "請稍後再試"}`);
    }
  }

  /**
   * 生成 6 位數 OTP
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 驗證 EmailJS 配置
   */
  static validateConfig(): boolean {
    return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
  }

  /**
   * 獲取配置狀態
   */
  static getConfigStatus() {
    return {
      serviceId: !!EMAILJS_SERVICE_ID,
      templateId: !!EMAILJS_TEMPLATE_ID,
      publicKey: !!EMAILJS_PUBLIC_KEY,
      isComplete: this.validateConfig(),
    };
  }

  /**
   * 測試 EmailJS 連接
   */
  static async testConnection(): Promise<boolean> {
    if (!this.validateConfig()) {
      return false;
    }

    try {
      // 發送測試郵件
      await this.sendOTPEmail({
        to_email: "test@example.com",
        user_name: "Test User",
        otp_code: "123456",
      });
      return true;
    } catch (error) {
      console.error("EmailJS 連接測試失敗:", error);
      return false;
    }
  }
}

export default EmailJSService;
