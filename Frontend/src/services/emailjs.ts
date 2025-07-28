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
}

export class EmailJSService {
  /**
   * 發送 OTP 驗證碼郵件
   */
  static async sendOTPEmail(params: EmailTemplateParams): Promise<void> {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      throw new Error("EmailJS 配置不完整，請檢查環境變數");
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        params,
        EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error("EmailJS 發送失敗:", error);
      throw new Error("發送郵件失敗，請稍後再試");
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
}

export default EmailJSService;
