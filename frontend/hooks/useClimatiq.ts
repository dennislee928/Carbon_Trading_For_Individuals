import {
  fetchEmissionFactors,
  calculateEmissions,
  fetchDataVersions,
  fetchUnitTypes,
} from "@/services/climatiq/api";

export const useClimatiq = () => {
  const searchEmissionFactors = async (params: any) => {
    try {
      return await fetchEmissionFactors(params);
    } catch (error) {
      throw new Error(`Failed to fetch emission factors: ${error}`);
    }
  };

  const calculateEmissionsWithParams = async (params: any) => {
    try {
      return await calculateEmissions(params);
    } catch (error) {
      throw new Error(`Failed to calculate emissions: ${error}`);
    }
  };

  const getDataVersions = async () => {
    try {
      return await fetchDataVersions();
    } catch (error) {
      throw new Error(`Failed to fetch data versions: ${error}`);
    }
  };

  const getUnitTypes = async () => {
    try {
      return await fetchUnitTypes();
    } catch (error) {
      throw new Error(`Failed to fetch unit types: ${error}`);
    }
  };

  return {
    searchEmissionFactors,
    calculateEmissionsWithParams,
    getDataVersions,
    getUnitTypes,
  };
};
