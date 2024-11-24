import * as api from "@/services/climatiq/api";

export const useClimatiq = () => {
  return {
    // General APIs
    getEmissionFactors: api.fetchEmissionFactors, // Fetch emission factors
    getDataVersions: api.fetchDataVersions, // Fetch data versions
    getUnitTypes: api.fetchUnitTypes, // Fetch unit types

    // Emission Estimation API
    calculateEmissions: api.estimateEmissions, // Estimate emissions

    // Specific Domain APIs
    getIntermodalFreight: api.fetchIntermodalFreight, // Intermodal freight
    getProcurementData: api.fetchProcurement, // Procurement
    getClassifications: api.fetchClassifications, // Classifications
    getComputingData: api.fetchComputing, // Computing
    getCustomMappings: api.fetchCustomMappings, // Custom mappings
    getTravelEmissions: api.fetchTravel, // Travel
    getAutopilotEmissions: api.fetchAutopilot, // Autopilot
    getEnergyEmissions: api.fetchEnergy, // Energy
    getCBAMEmissions: api.fetchCBAM, // CBAM

    // Management APIs
    getManagementData: api.fetchManagement, // Management
  };
};
