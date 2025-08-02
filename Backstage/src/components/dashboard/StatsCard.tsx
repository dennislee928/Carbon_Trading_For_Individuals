"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import CountUp from "react-countup";

interface StatsCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
  format?: "number" | "currency" | "percentage";
  delay?: number;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  format = "number",
  delay = 0,
}: StatsCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return `$${val.toLocaleString()}`;
      case "percentage":
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return "↗";
      case "negative":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp
              end={value}
              duration={2}
              separator=","
              decimals={format === "currency" ? 2 : 0}
              prefix={format === "currency" ? "$" : ""}
              suffix={format === "percentage" ? "%" : ""}
            />
          </div>
          {change !== undefined && (
            <div
              className={`text-xs ${getChangeColor()} flex items-center gap-1 mt-1`}
            >
              <span>{getChangeIcon()}</span>
              <span>{Math.abs(change)}%</span>
              <span>vs 上週</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
