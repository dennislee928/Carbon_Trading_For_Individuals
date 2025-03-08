// ... existing code ...
import { climatiqConfig } from "../config/climatiq.config";

const fetchClimatiq = async (endpoint: string, body: any) => {
  const response = await fetch(`${climatiqConfig.baseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${climatiqConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Climatiq API error: ${response.statusText}`);
  }

  return response.json();
};

export const climatiqService = {
  estimate: (data: any) => fetchClimatiq("/estimate", data),
  freight: (data: any) => fetchClimatiq("/freight/intermodal", data),
  travel: (data: any) => fetchClimatiq("/travel", data),
  energy: (data: any) => fetchClimatiq("/energy", data),
  compute: (data: any) => fetchClimatiq("/computing", data),
  // Add other endpoints (procurement, custom-mappings, etc.) as needed
};
// ... existing code ...
