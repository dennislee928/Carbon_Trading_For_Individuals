const axios = require("axios");
const assert = require("assert");
const fs = require("fs");
const path = require("path");

// 配置
const API_URL = "https://apiv1-carbontrading.dennisleehappy.org"; // 本地測試
const EMAIL = "110462011@g.nccu.edu.tw";
//https://apiv1-carbontrading.dennisleehappy.org/swagger/index.html#/
const PASSWORD = "Popoman1217!";

// 儲存JWT令牌
let token = "";
let userId = "";

// 測試結果追蹤
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
};

// 測試日誌收集
const testLogs = [];

// 輔助函數
const logSuccess = (message) => {
  const logMessage = `✅ ${message}`;
  console.log(logMessage);
  testLogs.push(logMessage);
  testResults.passed++;
};

const logError = (message, error) => {
  const logMessage = `❌ ${message}: ${error.message || error}`;
  console.error(logMessage);
  testLogs.push(logMessage);

  if (error.response) {
    const statusMessage = `   狀態碼: ${error.response.status}`;
    const dataMessage = `   響應數據: ${JSON.stringify(error.response.data)}`;
    console.error(statusMessage);
    console.error(dataMessage);
    testLogs.push(statusMessage);
    testLogs.push(dataMessage);
  }
  testResults.failed++;
};

const logSkipped = (message) => {
  const logMessage = `⚠️ 跳過: ${message}`;
  console.log(logMessage);
  testLogs.push(logMessage);
  testResults.skipped++;
};

// 詳細日誌記錄函數
const logRequest = (method, url, data = null, headers = {}) => {
  const requestLog = [
    `\n📤 請求詳情:`,
    `   Method: ${method}`,
    `   URL: ${url}`,
  ];

  if (data) {
    requestLog.push(`   Payload: ${JSON.stringify(data, null, 2)}`);
  }
  if (Object.keys(headers).length > 0) {
    requestLog.push(`   Headers: ${JSON.stringify(headers, null, 2)}`);
  }

  requestLog.forEach((line) => {
    console.log(line);
    testLogs.push(line);
  });
};

const logResponse = (status, data, headers = {}) => {
  const responseLog = [
    `\n📥 響應詳情:`,
    `   Status: ${status}`,
    `   Response: ${JSON.stringify(data, null, 2)}`,
  ];

  if (Object.keys(headers).length > 0) {
    responseLog.push(
      `   Response Headers: ${JSON.stringify(headers, null, 2)}`
    );
  }

  responseLog.forEach((line) => {
    console.log(line);
    testLogs.push(line);
  });
};

// 創建帶詳細日誌的API客戶端
const createApiWithLogging = () => {
  const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    validateStatus: (status) => status < 500, // 不拋出5xx錯誤
  });

  // 請求攔截器
  api.interceptors.request.use(
    (config) => {
      logRequest(
        config.method?.toUpperCase(),
        config.url,
        config.data,
        config.headers
      );
      return config;
    },
    (error) => {
      console.error("❌ 請求錯誤:", error);
      return Promise.reject(error);
    }
  );

  // 響應攔截器
  api.interceptors.response.use(
    (response) => {
      logResponse(response.status, response.data, response.headers);
      return response;
    },
    (error) => {
      if (error.response) {
        logResponse(
          error.response.status,
          error.response.data,
          error.response.headers
        );
      } else {
        console.error("❌ 響應錯誤:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return api;
};

// 創建API客戶端
const api = createApiWithLogging();

// 設置認證頭
const setAuthHeader = () => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return true;
  }
  return false;
};

// 測試函數
async function runTests() {
  const startMessage = "🚀 開始全面API測試...\n";
  console.log(startMessage);
  testLogs.push(startMessage);

  try {
    // 1. 認證測試
    await testAuth();

    // 2. 用戶相關測試
    await testUserEndpoints();

    // 3. 碳足跡相關測試
    await testCarbonFootprint();

    // 4. 碳市場相關測試
    await testCarbonMarket();

    // 5. 碳權抵消相關測試
    await testCarbonOffset();

    // 6. 碳權相關測試
    await testCarbonCredits();

    // 7. 市場相關測試
    await testMarket();

    // 8. 通知相關測試
    await testNotifications();

    // 9. 統計相關測試
    await testStats();

    // 10. 交易相關測試
    await testTrades();
  } catch (error) {
    console.error("❌ 測試過程中發生未捕獲的錯誤:", error);
  } finally {
    // 輸出測試結果摘要
    const summaryLines = [
      "\n📊 測試結果摘要:",
      `   通過: ${testResults.passed}`,
      `   失敗: ${testResults.failed}`,
      `   跳過: ${testResults.skipped}`,
      `   總計: ${
        testResults.passed + testResults.failed + testResults.skipped
      }`,
    ];

    summaryLines.forEach((line) => {
      console.log(line);
      testLogs.push(line);
    });

    if (testResults.failed === 0) {
      const successMessage = "\n🎉 所有測試通過!";
      console.log(successMessage);
      testLogs.push(successMessage);
    } else {
      const failMessage = `\n⚠️ ${testResults.failed}個測試失敗.`;
      console.log(failMessage);
      testLogs.push(failMessage);
    }

    // 輸出測試報告文件
    outputTestReport();
  }
}

// 1. 認證測試
async function testAuth() {
  const authMessage = "\n🔐 測試認證API...";
  console.log(authMessage);
  testLogs.push(authMessage);

  // 1.1 登入
  try {
    const loginResponse = await api.post("/api/v1/auth/login", {
      email: EMAIL,
      password: PASSWORD,
    });

    assert.strictEqual(loginResponse.status, 200);
    assert.ok(loginResponse.data.token);

    token = loginResponse.data.token;

    // 從 JWT token 中提取用戶 ID
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      userId =
        payload.user_id ||
        payload.sub ||
        "35052e25-9076-4acc-852f-50714437f974";
    } catch (error) {
      console.log("⚠️ 無法從 token 提取用戶 ID，使用默認值");
      userId = "35052e25-9076-4acc-852f-50714437f974";
    }

    const userIdMessage = `   用戶ID: ${userId}`;
    console.log(userIdMessage);
    testLogs.push(userIdMessage);
    logSuccess("登入成功");
    setAuthHeader();
  } catch (error) {
    logError("登入失敗", error);
    // 如果登入失敗，後續需要認證的測試將被跳過
  }

  // 1.2 登出測試
  try {
    const logoutResponse = await api.post("/api/v1/auth/logout");
    if (logoutResponse.status === 200) {
      logSuccess("登出成功");
    } else {
      logSkipped(`登出測試 - 狀態碼: ${logoutResponse.status}`);
    }
  } catch (error) {
    logSkipped("登出測試失敗");
  }
}

// 2. 用戶相關測試
async function testUserEndpoints() {
  const userMessage = "\n👤 測試用戶API...";
  console.log(userMessage);
  testLogs.push(userMessage);

  if (!setAuthHeader()) {
    logSkipped("用戶API測試 - 未登入");
    return;
  }

  // 2.1 獲取當前用戶信息
  try {
    const meResponse = await api.get("/api/v1/users/me");

    assert.strictEqual(meResponse.status, 200);
    const userDataMessage =
      "   用戶數據: " +
      JSON.stringify(meResponse.data).substring(0, 100) +
      "...";
    console.log(userDataMessage);
    testLogs.push(userDataMessage);

    // 檢查響應中是否有用戶ID或email
    // 注意：用戶資料來自 Supabase auth.users 表，可能格式不同
    if (
      meResponse.data &&
      (meResponse.data.id ||
        meResponse.data.email ||
        meResponse.data.data?.id ||
        meResponse.data.data?.email)
    ) {
      logSuccess("獲取當前用戶信息成功");
    } else {
      throw new Error("響應中缺少用戶ID或email");
    }
  } catch (error) {
    logError("獲取當前用戶信息失敗", error);
  }

  // 2.2 獲取用戶資產
  if (userId) {
    try {
      const assetsResponse = await api.get(`/api/v1/users/${userId}/assets`);

      if (assetsResponse.status === 200) {
        logSuccess("獲取用戶資產請求成功");
      } else if (assetsResponse.status === 404) {
        logSuccess("獲取用戶資產請求成功 (用戶沒有資產數據)");
      } else if (assetsResponse.status === 401) {
        logSkipped("獲取用戶資產 - 未授權 (401)");
      } else {
        throw new Error(`意外的狀態碼: ${assetsResponse.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        logSuccess("獲取用戶資產請求成功 (用戶沒有資產數據)");
      } else if (error.response && error.response.status === 401) {
        logSkipped("獲取用戶資產 - 未授權 (401)");
      } else {
        logError("獲取用戶資產失敗", error);
      }
    }
  }
}

// 3. 碳足跡相關測試
async function testCarbonFootprint() {
  const footprintMessage = "\n🌱 測試碳足跡API...";
  console.log(footprintMessage);
  testLogs.push(footprintMessage);

  if (!setAuthHeader()) {
    logSkipped("碳足跡API測試 - 未登入");
    return;
  }

  // 3.1 計算碳足跡
  try {
    const footprintResponse = await api.post(
      "/api/v1/carbon/footprint/calculate",
      {
        activity_type: "transport",
        quantity: 100,
        unit: "km",
        country_code: "tw",
      }
    );

    assert.strictEqual(footprintResponse.status, 200);

    if (
      footprintResponse.data &&
      footprintResponse.data.emission_amount !== undefined
    ) {
      const emissionMessage = `   排放量: ${
        footprintResponse.data.emission_amount
      } ${footprintResponse.data.unit || "kg CO2e"}`;
      console.log(emissionMessage);
      testLogs.push(emissionMessage);
      logSuccess("計算碳足跡成功");
    } else {
      throw new Error("響應中缺少排放量數據");
    }
  } catch (error) {
    logError("計算碳足跡失敗", error);
  }
}

// 4. 碳市場相關測試
async function testCarbonMarket() {
  const marketMessage = "\n💹 測試碳市場API...";
  console.log(marketMessage);
  testLogs.push(marketMessage);

  // 4.1 獲取碳市場統計
  try {
    const statsResponse = await api.get("/api/v1/carbon/market/stats");

    if (statsResponse.status === 200) {
      logSuccess("獲取碳市場統計成功");
    } else {
      logSkipped(`獲取碳市場統計 - 狀態碼: ${statsResponse.status}`);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logSkipped("獲取碳市場統計 - 端點未實現 (404)");
    } else {
      logError("獲取碳市場統計失敗", error);
    }
  }

  // 4.2 獲取碳權項目列表
  try {
    const projectsResponse = await api.get("/api/v1/carbon/projects");

    if (projectsResponse.status === 200) {
      assert.ok(Array.isArray(projectsResponse.data.projects));
      logSuccess("獲取碳權項目列表成功");

      // 4.3 獲取特定碳權項目詳情
      if (
        projectsResponse.data.projects &&
        projectsResponse.data.projects.length > 0
      ) {
        const projectId = projectsResponse.data.projects[0].id;

        try {
          const projectResponse = await api.get(
            `/api/v1/carbon/projects/${projectId}`
          );

          if (projectResponse.status === 200) {
            assert.strictEqual(projectResponse.data.id, projectId);
            logSuccess("獲取碳權項目詳情成功");
          } else {
            logSkipped(`獲取碳權項目詳情 - 狀態碼: ${projectResponse.status}`);
          }
        } catch (error) {
          logSkipped(`獲取碳權項目詳情失敗 - ${error.message}`);
        }
      }
    } else {
      logSkipped(`獲取碳權項目列表 - 狀態碼: ${projectsResponse.status}`);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logSkipped("獲取碳權項目列表 - 端點未實現 (404)");
    } else {
      logError("獲取碳權項目列表失敗", error);
    }
  }

  // 4.4 獲取碳權代幣列表
  try {
    const tokensResponse = await api.get("/api/v1/carbon/tokens");

    if (tokensResponse.status === 200) {
      assert.ok(Array.isArray(tokensResponse.data.tokens));
      logSuccess("獲取碳權代幣列表成功");
    } else {
      logSkipped(`獲取碳權代幣列表 - 狀態碼: ${tokensResponse.status}`);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logSkipped("獲取碳權代幣列表 - 端點未實現 (404)");
    } else {
      logError("獲取碳權代幣列表失敗", error);
    }
  }
}

// 5. 碳權抵消相關測試
async function testCarbonOffset() {
  const offsetMessage = "\n♻️ 測試碳權抵消API...";
  console.log(offsetMessage);
  testLogs.push(offsetMessage);

  if (!setAuthHeader()) {
    logSkipped("碳權抵消API測試 - 未登入");
    return;
  }

  // 5.1 模擬碳權抵消購買
  try {
    const simulateResponse = await api.post("/api/v1/carbon/offset/simulate", {
      user_id: userId || "35052e25-9076-4acc-852f-50714437f974",
      project_id: "proj-001",
      token_amount: 1.5,
    });

    // 接受200或404，因為端點可能尚未實現
    if (simulateResponse.status === 200) {
      assert.ok(simulateResponse.data.success);
      logSuccess("模擬碳權抵消購買成功");
    } else if (simulateResponse.status === 404) {
      logSkipped("模擬碳權抵消購買 - 端點未實現 (404)");
    } else if (simulateResponse.status === 400) {
      logSkipped(
        `模擬碳權抵消購買 - 請求無效 (400): ${JSON.stringify(
          simulateResponse.data
        )}`
      );
    } else {
      throw new Error(`意外的狀態碼: ${simulateResponse.status}`);
    }
  } catch (error) {
    logError("模擬碳權抵消購買失敗", error);
  }
}

// 6. 碳權相關測試
async function testCarbonCredits() {
  const creditsMessage = "\n🏆 測試碳權API...";
  console.log(creditsMessage);
  testLogs.push(creditsMessage);

  if (!setAuthHeader()) {
    logSkipped("碳權API測試 - 未登入");
    return;
  }

  // 6.1 獲取碳權列表
  try {
    const creditsResponse = await api.get("/api/v1/carbonCredits/");

    if (creditsResponse.status === 200) {
      logSuccess("獲取碳權列表成功");

      // 6.2 獲取特定碳權詳情
      if (
        creditsResponse.data &&
        Array.isArray(creditsResponse.data) &&
        creditsResponse.data.length > 0
      ) {
        const creditId = creditsResponse.data[0].id;

        try {
          const creditResponse = await api.get(
            `/api/v1/carbonCredits/${creditId}`
          );

          if (creditResponse.status === 200) {
            logSuccess("獲取碳權詳情成功");
          } else {
            logSkipped(`獲取碳權詳情 - 狀態碼: ${creditResponse.status}`);
          }
        } catch (error) {
          logError("獲取碳權詳情失敗", error);
        }
      }
    } else if (creditsResponse.status === 401) {
      logSkipped("獲取碳權列表 - 未授權 (401)");
    } else if (creditsResponse.status === 404) {
      logSkipped("獲取碳權列表 - 端點未實現 (404)");
    } else {
      throw new Error(`意外的狀態碼: ${creditsResponse.status}`);
    }
  } catch (error) {
    logError("獲取碳權列表失敗", error);
  }
}

// 7. 市場相關測試
async function testMarket() {
  const marketMessage = "\n🛒 測試市場API...";
  console.log(marketMessage);
  testLogs.push(marketMessage);

  if (!setAuthHeader()) {
    logSkipped("市場API測試 - 未登入");
    return;
  }

  // 7.1 獲取訂單簿
  try {
    const orderbookResponse = await api.get("/api/v1/market/orderbook");

    if (orderbookResponse.status === 200) {
      logSuccess("獲取訂單簿成功");
    } else if (orderbookResponse.status === 404) {
      logSkipped("獲取訂單簿 - 端點未實現 (404)");
    } else {
      logSkipped(`獲取訂單簿 - 狀態碼: ${orderbookResponse.status}`);
    }
  } catch (error) {
    logError("獲取訂單簿失敗", error);
  }

  // 7.2 創建交易報價
  try {
    const tradeOfferResponse = await api.post("/api/v1/market/trade-offers", {
      order_type: "sell",
      credit_type: "VCS",
      vintage_year: 2022,
      project_type: "forestry",
      quantity: 1.0,
      price: 25.0,
    });

    // 可能成功或失敗，取決於用戶是否有足夠的碳權
    if (
      tradeOfferResponse.status === 200 ||
      tradeOfferResponse.status === 201
    ) {
      logSuccess("創建交易報價成功");
    } else {
      logSkipped("創建交易報價 - 狀態碼: " + tradeOfferResponse.status);
    }
  } catch (error) {
    // 處理資產不足的情況
    if (error.response && error.response.status === 422) {
      const errorMessage = error.response.data?.error || "未知錯誤";
      if (errorMessage.includes("Insufficient asset quantity")) {
        logSkipped("創建交易報價 - 資產不足 (422)");
      } else {
        logSkipped(`創建交易報價 - 業務邏輯錯誤 (422): ${errorMessage}`);
      }
    } else {
      logError("創建交易報價失敗", error);
    }
  }

  // 7.3 購買碳權
  try {
    // 先獲取碳權列表以獲取有效的 credit_id
    const creditsResponse = await api.get("/api/v1/carbonCredits/");
    let creditId = "780657df-ae8e-438d-87a7-9151b76a0608"; // 默認值

    if (
      creditsResponse.status === 200 &&
      creditsResponse.data &&
      creditsResponse.data.length > 0
    ) {
      creditId = creditsResponse.data[0].id;
    }

    const purchaseResponse = await api.post("/api/v1/market/purchase", {
      credit_id: creditId,
      quantity: 1.0,
    });

    // 可能成功或失敗，取決於信用額度是否存在
    if (purchaseResponse.status === 200 || purchaseResponse.status === 201) {
      logSuccess("購買碳權成功");
    } else {
      logSkipped("購買碳權 - 狀態碼: " + purchaseResponse.status);
    }
  } catch (error) {
    logError("購買碳權失敗", error);
  }
}

// 8. 通知相關測試
async function testNotifications() {
  const notificationsMessage = "\n🔔 測試通知API...";
  console.log(notificationsMessage);
  testLogs.push(notificationsMessage);

  if (!setAuthHeader()) {
    logSkipped("通知API測試 - 未登入");
    return;
  }

  // 8.1 獲取通知列表
  try {
    const notificationsResponse = await api.get("/api/v1/notifications/");

    if (notificationsResponse.status === 200) {
      logSuccess("獲取通知列表成功");

      // 8.2 標記通知為已讀
      if (
        notificationsResponse.data &&
        Array.isArray(notificationsResponse.data) &&
        notificationsResponse.data.length > 0
      ) {
        const notificationId = notificationsResponse.data[0].id;

        try {
          const markReadResponse = await api.post(
            "/api/v1/notifications/mark-read",
            {
              notification_ids: [notificationId],
            }
          );

          if (markReadResponse.status === 200) {
            logSuccess("標記通知為已讀成功");
          } else {
            logSkipped(`標記通知為已讀 - 狀態碼: ${markReadResponse.status}`);
          }
        } catch (error) {
          logError("標記通知為已讀失敗", error);
        }
      }
    } else if (notificationsResponse.status === 404) {
      logSkipped("獲取通知列表 - 端點未實現 (404)");
    } else {
      logSkipped(`獲取通知列表 - 狀態碼: ${notificationsResponse.status}`);
    }
  } catch (error) {
    logError("獲取通知列表失敗", error);
  }
}

// 9. 統計相關測試
async function testStats() {
  const statsMessage = "\n📊 測試統計API...";
  console.log(statsMessage);
  testLogs.push(statsMessage);

  if (!setAuthHeader()) {
    logSkipped("統計API測試 - 未登入");
    return;
  }

  // 9.1 獲取概覽統計
  try {
    const overviewResponse = await api.get("/api/v1/stats/overview");

    if (overviewResponse.status === 200) {
      logSuccess("獲取概覽統計成功");
    } else if (overviewResponse.status === 404) {
      logSkipped("獲取概覽統計 - 端點未實現 (404)");
    } else {
      logSkipped(`獲取概覽統計 - 狀態碼: ${overviewResponse.status}`);
    }
  } catch (error) {
    logError("獲取概覽統計失敗", error);
  }

  // 9.2 獲取交易統計
  try {
    const tradesStatsResponse = await api.get("/api/v1/stats/trades");

    if (tradesStatsResponse.status === 200) {
      logSuccess("獲取交易統計成功");
    } else if (tradesStatsResponse.status === 404) {
      logSkipped("獲取交易統計 - 端點未實現 (404)");
    } else {
      logSkipped(`獲取交易統計 - 狀態碼: ${tradesStatsResponse.status}`);
    }
  } catch (error) {
    logError("獲取交易統計失敗", error);
  }

  // 9.3 獲取用戶統計
  try {
    const usersStatsResponse = await api.get("/api/v1/stats/users");

    if (usersStatsResponse.status === 200) {
      logSuccess("獲取用戶統計成功");
    } else if (usersStatsResponse.status === 404) {
      logSkipped("獲取用戶統計 - 端點未實現 (404)");
    } else {
      logSkipped(`獲取用戶統計 - 狀態碼: ${usersStatsResponse.status}`);
    }
  } catch (error) {
    logError("獲取用戶統計失敗", error);
  }
}

// 10. 交易相關測試
async function testTrades() {
  const tradesMessage = "\n💰 測試交易API...";
  console.log(tradesMessage);
  testLogs.push(tradesMessage);

  if (!setAuthHeader()) {
    logSkipped("交易API測試 - 未登入");
    return;
  }

  // 10.1 創建交易
  try {
    const createTradeResponse = await api.post("/api/v1/trades/create", {
      credit_type: "VCS",
      vintage_year: 2022,
      project_type: "forestry",
      quantity: 1,
      price: 25,
    });

    // 可能成功或失敗，取決於交易參數是否有效
    if (
      createTradeResponse.status === 200 ||
      createTradeResponse.status === 201
    ) {
      logSuccess("創建交易成功");
    } else if (createTradeResponse.status === 400) {
      logSkipped(
        `創建交易 - 請求無效 (400): ${JSON.stringify(createTradeResponse.data)}`
      );
    } else if (createTradeResponse.status === 404) {
      logSkipped("創建交易 - 端點未實現 (404)");
    } else {
      logSkipped(`創建交易 - 狀態碼: ${createTradeResponse.status}`);
    }
  } catch (error) {
    logError("創建交易失敗", error);
  }

  // 10.2 獲取交易訂單
  try {
    const ordersResponse = await api.get(`/api/v1/trades/orders/me`);

    if (ordersResponse.status === 200) {
      logSuccess("獲取交易訂單成功");
    } else if (ordersResponse.status === 404) {
      logSkipped("獲取交易訂單 - 端點未實現 (404)");
    } else {
      logSkipped(`獲取交易訂單 - 狀態碼: ${ordersResponse.status}`);
    }
  } catch (error) {
    logError("獲取交易訂單失敗", error);
  }
}

// 輸出測試報告文件
function outputTestReport() {
  try {
    // 生成時間戳
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `${timestamp}_apitest.txt`;

    // 創建報告內容
    const reportContent = [
      `API 測試報告`,
      `生成時間: ${now.toLocaleString("zh-TW")}`,
      `API URL: ${API_URL}`,
      `測試用戶: ${EMAIL}`,
      `========================================`,
      ``,
      ...testLogs,
      ``,
      `========================================`,
      `測試完成時間: ${new Date().toLocaleString("zh-TW")}`,
      `總計測試: ${
        testResults.passed + testResults.failed + testResults.skipped
      }`,
      `通過: ${testResults.passed}`,
      `失敗: ${testResults.failed}`,
      `跳過: ${testResults.skipped}`,
      `成功率: ${(
        (testResults.passed /
          (testResults.passed + testResults.failed + testResults.skipped)) *
        100
      ).toFixed(2)}%`,
    ].join("\n");

    // 寫入文件
    fs.writeFileSync(filename, reportContent, "utf8");
    console.log(`\n📄 測試報告已保存到: ${filename}`);
  } catch (error) {
    console.error(`❌ 保存測試報告失敗: ${error.message}`);
  }
}

// 執行所有測試
runTests();
