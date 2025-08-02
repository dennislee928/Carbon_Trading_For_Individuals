import axios from 'axios';

// 定義API基本設定
const CLIMATIQ_API_KEY = process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY || '';
const CLIMATIQ_API_URL = 'https://beta3.api.climatiq.io';

// 創建API實例
const climatiqAxios = axios.create({
  baseURL: CLIMATIQ_API_URL,
  headers: {
    'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
    'Content-Type': 'application/json',
  }
});

// 類型定義
export interface EmissionResult {
  co2e: number;
  co2e_unit: string;
  parameters?: Record<string, any>;
}

export interface FreightParams {
  distance_km: number;
  weight_kg: number;
  transport_mode: string;
}

export interface EnergyParams {
  energy: number;
  energy_unit: string;
  energy_type: string;
  country?: string;
}

export interface CBEMParams {
  product: string;
  quantity: number;
  region: string;
}

// 氣候API服務
export const climatiqApi = {
  // 後端健康檢查
  async checkHealth(): Promise<{ status: string }> {
    try {
      await climatiqAxios.get('/');
      return { status: 'ok' };
    } catch (error) {
      console.error('Climatiq API健康檢查失敗:', error);
      return { status: 'error' };
    }
  },

  // 貨運碳足跡計算
  async freight(params: FreightParams): Promise<EmissionResult> {
    try {
      // 基於運輸模式選擇正確的排放因子
      let emission_factor = '';
      switch (params.transport_mode) {
        case 'road':
          emission_factor = 'freight_vehicle-vehicle_type_truck-fuel_source_diesel-distance_na-weight_na';
          break;
        case 'rail':
          emission_factor = 'freight_rail-route_type_na-fuel_source_na';
          break;
        case 'sea':
          emission_factor = 'freight_ship-vessel_type_na-fuel_source_na-route_type_na';
          break;
        case 'air':
          emission_factor = 'freight_flight-route_type_na-distance_na-weight_na';
          break;
        default:
          emission_factor = 'freight_vehicle-vehicle_type_truck-fuel_source_diesel-distance_na-weight_na';
      }

      // 構建請求數據
      const requestData = {
        emission_factor,
        parameters: {
          distance: params.distance_km,
          distance_unit: 'km',
          weight: params.weight_kg,
          weight_unit: 'kg',
        },
      };

      // 調用 Climatiq API
      const response = await climatiqAxios.post('/estimate', requestData);
      
      return {
        co2e: response.data.co2e,
        co2e_unit: response.data.co2e_unit,
        parameters: params
      };
    } catch (error) {
      console.error('貨運碳足跡計算失敗:', error);
      throw error;
    }
  },

  // 能源使用碳足跡計算
  async energy(params: EnergyParams): Promise<EmissionResult> {
    try {
      // 選擇正確的排放因子
      let emission_factor = '';
      switch (params.energy_type) {
        case 'electricity':
          emission_factor = `electricity-energy_source_grid_mix${params.country ? `-country_${params.country}` : ''}`;
          break;
        case 'natural_gas':
          emission_factor = 'natural_gas-energy_source_natural_gas_gc';
          break;
        case 'coal':
          emission_factor = 'coal-energy_source_coal_gc';
          break;
        case 'oil':
          emission_factor = 'petroleum-energy_source_petroleum_gc';
          break;
        default:
          emission_factor = 'electricity-energy_source_grid_mix';
      }

      // 構建請求數據
      const requestData = {
        emission_factor,
        parameters: {
          energy: params.energy,
          energy_unit: params.energy_unit || 'kWh',
        },
      };

      // 調用 Climatiq API
      const response = await climatiqAxios.post('/estimate', requestData);
      
      return {
        co2e: response.data.co2e,
        co2e_unit: response.data.co2e_unit,
        parameters: params
      };
    } catch (error) {
      console.error('能源使用碳足跡計算失敗:', error);
      throw error;
    }
  },

  // CBEM (Carbon Border Emission Mechanism) 計算
  async cbem(params: CBEMParams): Promise<EmissionResult> {
    try {
      // 根據產品和地區選擇合適的排放因子
      // 這裡只是一個簡化的示例，實際情況可能需要更複雜的邏輯
      const productMap: Record<string, string> = {
        'cement': 'cement-type_average',
        'steel': 'steel-production_route_bof',
        'aluminum': 'aluminium-production_route_primary',
        'fertilizer': 'fertilizer-type_nitrogen',
        'electricity': 'electricity-energy_source_grid_mix',
      };

      const emission_factor = productMap[params.product] || 'industrial_process-type_average';

      // 構建請求數據
      const requestData = {
        emission_factor,
        parameters: {
          // 假設數量以公噸(tons)為單位
          mass: params.quantity,
          mass_unit: 't',
        },
      };

      // 如果是電力，使用不同的參數
      if (params.product === 'electricity') {
        requestData.parameters = {
          energy: params.quantity,
          energy_unit: 'kWh',
        };
      }

      // 調用 Climatiq API
      const response = await climatiqAxios.post('/estimate', requestData);
      
      return {
        co2e: response.data.co2e,
        co2e_unit: response.data.co2e_unit,
        parameters: params
      };
    } catch (error) {
      console.error('CBEM碳足跡計算失敗:', error);
      throw error;
    }
  },

  // 提供客戶端直接使用的函數(本地計算，不經過API)
  freight_local(distance: number, weight: number, mode: string): EmissionResult {
    // 簡化的碳排放因子(kg CO2e/tonne-km)
    const emissionFactors: Record<string, number> = {
      'road': 0.062,
      'rail': 0.022,
      'sea': 0.008,
      'air': 0.602,
    };
    
    const factor = emissionFactors[mode] || emissionFactors['road'];
    
    // 計算：距離(km) * 重量(t) * 排放因子(kg CO2e/t-km)
    const weightInTonnes = weight / 1000; // 轉換公斤為公噸
    const co2e = distance * weightInTonnes * factor;
    
    return {
      co2e: parseFloat(co2e.toFixed(2)),
      co2e_unit: 'kg CO2e',
      parameters: {
        distance: distance,
        distance_unit: 'km',
        weight: weight,
        weight_unit: 'kg',
        transport_mode: mode,
      }
    };
  },
  
  energy_local(energy: number, energy_unit: string, energy_type: string): EmissionResult {
    // 簡化的碳排放因子(kg CO2e/kWh)
    const emissionFactors: Record<string, number> = {
      'electricity': 0.475, // 全球平均
      'natural_gas': 0.2,
      'coal': 1.0,
      'oil': 0.268,
    };
    
    const factor = emissionFactors[energy_type] || emissionFactors['electricity'];
    
    // 如果單位不是kWh，進行轉換
    let energyInKwh = energy;
    if (energy_unit === 'MWh') {
      energyInKwh = energy * 1000;
    } else if (energy_unit === 'GWh') {
      energyInKwh = energy * 1000000;
    }
    
    // 計算：能源(kWh) * 排放因子(kg CO2e/kWh)
    const co2e = energyInKwh * factor;
    
    return {
      co2e: parseFloat(co2e.toFixed(2)),
      co2e_unit: 'kg CO2e',
      parameters: {
        energy: energy,
        energy_unit: energy_unit,
        energy_type: energy_type,
      }
    };
  },
  
  cbem_local(product: string, quantity: number, region: string): EmissionResult {
    // 簡化的產品碳強度(kg CO2e/unit)
    // 數據根據地區有所不同
    const intensityByRegion: Record<string, Record<string, number>> = {
      'EU': {
        'cement': 700,
        'steel': 1250,
        'aluminum': 8500,
        'fertilizer': 3000,
        'electricity': 0.275,
      },
      'US': {
        'cement': 750,
        'steel': 1400,
        'aluminum': 9000,
        'fertilizer': 3200,
        'electricity': 0.405,
      },
      'CN': {
        'cement': 850,
        'steel': 1900,
        'aluminum': 12000,
        'fertilizer': 3500,
        'electricity': 0.555,
      },
      // 添加其他地區...
    };
    
    // 獲取特定地區和產品的碳強度
    const regionData = intensityByRegion[region] || intensityByRegion['EU'];
    const intensity = regionData[product] || 1000; // 默認值
    
    // 計算：數量 * 碳強度
    let co2e = quantity * intensity;
    let unit = 'kg CO2e';
    
    // 電力的單位處理不同
    if (product === 'electricity') {
      // 電力以kWh計算
      unit = 'kg CO2e';
    } else {
      // 其他產品以噸計算，結果轉為噸CO2e
      co2e = co2e / 1000;
      unit = 't CO2e';
    }
    
    return {
      co2e: parseFloat(co2e.toFixed(2)),
      co2e_unit: unit,
      parameters: {
        product: product,
        quantity: quantity,
        region: region,
      }
    };
  }
};

// 導出服務
export default climatiqApi;