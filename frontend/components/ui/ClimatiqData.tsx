import React from "react";

import { useClimatiq } from "@/hooks/useClimatiq";
//
export const ClimatiqData: React.FC = () => {
  const { data, loading, error } = useClimatiq();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="climatiq-data">
      <h2>Emission Data</h2>
      <div className="data-container">
        <p>
          CO2 Equivalent: {data.co2e} {data.co2e_unit}
        </p>
        {/* Add more data fields as needed */}
      </div>
      <style jsx>{`
        .climatiq-data {
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        .data-container {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};
