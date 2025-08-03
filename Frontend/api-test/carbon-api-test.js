const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";

async function testCarbonAPIs() {
  console.log("🧪 開始測試碳交易 API 端點...\n");

  try {
    // 1. 測試市場統計
    console.log("1. 測試市場統計端點...");
    const statsResponse = await axios.get(`${BASE_URL}/carbon/market/stats`);
    console.log("✅ 市場統計:", {
      total_projects: statsResponse.data.total_projects,
      total_tokens: statsResponse.data.total_tokens,
      average_price: statsResponse.data.average_price_usd,
    });

    // 2. 測試碳權項目
    console.log("\n2. 測試碳權項目端點...");
    const projectsResponse = await axios.get(`${BASE_URL}/carbon/projects`);
    console.log("✅ 碳權項目:", {
      total: projectsResponse.data.total,
      projects: projectsResponse.data.projects.map((p) => ({
        name: p.name,
        type: p.type,
        price: p.price_per_credit,
      })),
    });

    // 3. 測試碳權代幣
    console.log("\n3. 測試碳權代幣端點...");
    const tokensResponse = await axios.get(`${BASE_URL}/carbon/tokens`);
    console.log("✅ 碳權代幣:", {
      total: tokensResponse.data.total,
      tokens: tokensResponse.data.tokens.map((t) => ({
        name: t.name,
        symbol: t.symbol,
        price: t.price_per_unit,
      })),
    });

    // 4. 測試碳足跡計算
    console.log("\n4. 測試碳足跡計算端點...");
    const footprintResponse = await axios.post(
      `${BASE_URL}/carbon/footprint/calculate`,
      {
        activity_type: "electricity",
        quantity: 200,
        unit: "kWh",
      }
    );
    console.log("✅ 碳足跡計算:", {
      emission_amount: footprintResponse.data.emission_amount,
      unit: footprintResponse.data.unit,
      offset_options: footprintResponse.data.offset_options.length,
    });

    // 5. 測試抵消模擬
    console.log("\n5. 測試抵消模擬端點...");
    const offsetResponse = await axios.post(
      `${BASE_URL}/carbon/offset/simulate`,
      {
        project_id: "proj-001",
        token_amount: 50,
        user_id: "test-user",
      }
    );
    console.log("✅ 抵消模擬:", {
      success: offsetResponse.data.success,
      project_name: offsetResponse.data.project_name,
      final_price: offsetResponse.data.final_price_usd,
      transaction_id: offsetResponse.data.transaction_id,
    });

    console.log("\n🎉 所有 API 端點測試成功！");
  } catch (error) {
    console.error("❌ API 測試失敗:", error.response?.data || error.message);
  }
}

// 執行測試
testCarbonAPIs();
