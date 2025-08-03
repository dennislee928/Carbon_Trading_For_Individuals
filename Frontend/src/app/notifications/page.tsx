"use client";

import React, { useState, useEffect } from "react";
import { carbonApi, Notification } from "../services/carbonApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import ErrorBanner from "../../components/ErrorBanner";
import LocalModeIndicator from "../../components/LocalModeIndicator";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await carbonApi.getNotifications();
      setNotifications(response || []); // 直接使用返回的 Notification[] 類型
    } catch (err) {
      console.error("獲取通知失敗:", err);
      setError("無法載入通知");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
            通知中心
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            查看您的系統通知和重要訊息
          </p>
        </div>

        <LocalModeIndicator />
        <ErrorBanner
          error={error}
          showLocalModeMessage={true}
          onClose={() => setError(null)}
        />

        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div>
                        <CardTitle className="text-lg">
                          {notification.title}
                        </CardTitle>
                        <CardDescription>
                          {new Date(notification.created_at).toLocaleString(
                            "zh-TW"
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={getNotificationColor(notification.type)}
                      >
                        {notification.type === "success" && "成功"}
                        {notification.type === "error" && "錯誤"}
                        {notification.type === "warning" && "警告"}
                        {notification.type === "info" && "資訊"}
                      </Badge>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {notification.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                沒有通知
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                您目前沒有任何通知
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
