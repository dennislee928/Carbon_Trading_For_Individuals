"use client";

import React from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Info } from "lucide-react";

interface LocalModeIndicatorProps {
  show?: boolean;
}

export default function LocalModeIndicator({
  show = true,
}: LocalModeIndicatorProps) {
  if (!show) return null;

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
      <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
        <p className="font-medium">本地模式</p>
        <p className="text-sm mt-1">
          您目前處於本地模式，無法連接到伺服器。所有計算都在本地進行，數據不會保存。
        </p>
      </AlertDescription>
    </Alert>
  );
}
