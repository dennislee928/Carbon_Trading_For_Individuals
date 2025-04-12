"use client";

import { useEffect } from "react";
// import { Input } from "../../components/ui/input"; // 已移除，因為未使用
import { carbonApi } from "@/app/services/carbonApi";

// ... existing code ...

// 獲取市場上的碳信用額
useEffect(() => {
  const fetchCarbonCredits = async () => {
    try {
      const params: Record<string, string | number> = {}; // 使用更明確的類型替代any
      if (filters.creditType) params.creditType = filters.creditType;
      if (filters.projectType) params.projectType = filters.projectType;
      if (filters.vintageYear)
        params.vintageYear = parseInt(filters.vintageYear);

      const data = await carbonApi.getCarbonCredits(params);
      setCredits(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchCarbonCredits();
}, [filters]);

// ... existing code ...
