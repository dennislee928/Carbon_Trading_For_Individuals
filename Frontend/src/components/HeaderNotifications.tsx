"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function HeaderNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 模擬獲取通知數量
    setUnreadCount(3);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 rounded-full"
      onClick={() => {
        // 這裡可以添加打開通知面板的邏輯
        console.log("打開通知面板");
      }}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
