"use client";

import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export function AreaChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;

    const createChart = () => {
      const data = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Revenue",
            data: [1800, 2200, 1900, 2400, 2800, 2600, 3000],
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      };

      return new Chart(canvas as HTMLCanvasElement, {
        type: "line",
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                display: true,
              },
            },
          },
        },
      });
    };

    const newChartInstance = createChart();
    setChartInstance(newChartInstance);

    return () => {
      newChartInstance.destroy();
    };
  }, []);

  return <canvas ref={chartRef} />;
}

export function BarChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;

    const createChart = () => {
      const data = {
        labels: ["Electronics", "Clothing", "Food", "Books", "Home", "Beauty"],
        datasets: [
          {
            label: "Sales",
            data: [12500, 8300, 5400, 3200, 9800, 4600],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(245, 158, 11, 0.7)",
              "rgba(239, 68, 68, 0.7)",
              "rgba(139, 92, 246, 0.7)",
              "rgba(236, 72, 153, 0.7)",
            ],
            borderRadius: 4,
          },
        ],
      };

      return new Chart(canvas as HTMLCanvasElement, {
        type: "bar",
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                display: true,
              },
            },
          },
        },
      });
    };

    const newChartInstance = createChart();
    setChartInstance(newChartInstance);

    return () => {
      newChartInstance.destroy();
    };
  }, []);

  return <canvas ref={chartRef} />;
}
