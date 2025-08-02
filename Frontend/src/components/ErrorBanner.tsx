"use client";

import React from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { X } from "lucide-react";

interface ErrorBannerProps {
  error: string | null;
  onClose?: () => void;
  showLocalModeMessage?: boolean;
}

export default function ErrorBanner({ 
  error, 
  onClose, 
  showLocalModeMessage = false 
}: ErrorBannerProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <AlertDescription>
            <p className="font-medium">載入失敗</p>
            <p className="text-sm mt-1">{error}</p>
            {showLocalModeMessage && (
              <p className="text-sm mt-2">
                您目前處於本地模式，無法連接到伺服器。部分功能可能受限。
              </p>
            )}
          </AlertDescription>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </Alert>
  );
} 