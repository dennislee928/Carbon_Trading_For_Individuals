"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Wifi,
  WifiOff,
  Activity,
} from "lucide-react";

interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
  status: "online" | "offline" | "warning";
}

interface RealTimeMetricsProps {
  metrics: Metric[];
  title?: string;
  refreshInterval?: number;
}

const getStatusIcon = (status: Metric["status"]) => {
  switch (status) {
    case "online":
      return <Wifi className="h-4 w-4 text-green-500" />;
    case "offline":
      return <WifiOff className="h-4 w-4 text-red-500" />;
    case "warning":
      return <Activity className="h-4 w-4 text-yellow-500" />;
  }
};

const getStatusColor = (status: Metric["status"]) => {
  switch (status) {
    case "online":
      return "bg-green-100 text-green-800";
    case "offline":
      return "bg-red-100 text-red-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800";
  }
};

const getTrendColor = (trend: Metric["trend"]) => {
  switch (trend) {
    case "up":
      return "text-green-600";
    case "down":
      return "text-red-600";
    case "stable":
      return "text-gray-600";
  }
};

const getTrendIcon = (trend: Metric["trend"]) => {
  switch (trend) {
    case "up":
      return "↗";
    case "down":
      return "↘";
    case "stable":
      return "→";
  }
};

export function RealTimeMetrics({
  metrics,
  title = "實時指標",
  refreshInterval = 30000,
}: RealTimeMetricsProps) {
  const [currentMetrics, setCurrentMetrics] = useState(metrics);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // 模擬實時數據更新
      setCurrentMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + Math.floor(Math.random() * 10) - 5,
          change: metric.change + Math.floor(Math.random() * 5) - 2,
        }))
      );
      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <p className="text-sm text-gray-500">
            最後更新: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800">實時</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {metric.name}
                </span>
                {getStatusIcon(metric.status)}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold">
                  {metric.value.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">{metric.unit}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div
                  className={`text-xs flex items-center ${getTrendColor(
                    metric.trend
                  )}`}
                >
                  <span className="mr-1">{getTrendIcon(metric.trend)}</span>
                  <span>{Math.abs(metric.change)}%</span>
                </div>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
