"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiService } from "@/lib/api";
import { Notification } from "@/types/api";
import { formatDate } from "@/lib/utils";
import { Search, Bell, Check, Trash2 } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        apiService.setToken("test-token");
        const response = await apiService.getNotifications();
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalCount = notifications.length;

  const handleMarkAsRead = async () => {
    if (selectedNotifications.length === 0) return;

    try {
      await apiService.markNotificationsAsRead({
        notification_ids: selectedNotifications,
      });

      // 更新本地狀態
      setNotifications(
        notifications.map((notification) =>
          selectedNotifications.includes(notification.id)
            ? { ...notification, read: true }
            : notification
        )
      );

      setSelectedNotifications([]);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      alert("標記為已讀失敗");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (confirm("確定要刪除此通知嗎？")) {
      try {
        await apiService.deleteNotification(notificationId);
        setNotifications(notifications.filter((n) => n.id !== notificationId));
      } catch (error) {
        console.error("Failed to delete notification:", error);
        alert("刪除通知失敗");
      }
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:pl-64">
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">通知管理</h1>
            <p className="text-gray-600 mt-2">管理系統通知</p>
          </div>

          {/* 統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總通知數</CardTitle>
                <Bell className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">未讀通知</CardTitle>
                <Bell className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unreadCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* 通知列表 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>通知列表</CardTitle>
                  <CardDescription>查看和管理系統通知</CardDescription>
                </div>
                {selectedNotifications.length > 0 && (
                  <Button onClick={handleMarkAsRead}>
                    <Check className="h-4 w-4 mr-2" />
                    標記為已讀 ({selectedNotifications.length})
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索通知..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={handleSelectAll}>
                  {selectedNotifications.length === filteredNotifications.length
                    ? "取消全選"
                    : "全選"}
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedNotifications.length ===
                              filteredNotifications.length &&
                            filteredNotifications.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                      </TableHead>
                      <TableHead>標題</TableHead>
                      <TableHead>訊息</TableHead>
                      <TableHead>類型</TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead>時間</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedNotifications.includes(
                              notification.id
                            )}
                            onChange={() =>
                              handleSelectNotification(notification.id)
                            }
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {notification.title}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {notification.message}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              notification.type === "error"
                                ? "bg-red-100 text-red-800"
                                : notification.type === "warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {notification.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          {notification.read ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              已讀
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              未讀
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDate(notification.created_at)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
