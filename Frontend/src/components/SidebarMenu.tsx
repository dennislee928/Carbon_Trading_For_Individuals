"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  ShoppingCart,
  History,
  User,
  Briefcase,
  Activity,
  Truck,
  Globe,
  Zap,
  Server,
  BarChart2,
  Map,
  Wind,
  Bell,
} from "lucide-react";

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

export default function SidebarMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    console.log("SidebarMenu 加載，當前路徑:", pathname);
  }, [pathname]);

  // 僅顯示指定的頁面
  const menuItems: MenuItem[] = [
    {
      name: "儀表板",
      path: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "個人資料",
      path: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "交易市場",
      path: "/market",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "市場統計",
      path: "/market-stats",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "交易歷史",
      path: "/trade-history",
      icon: <History className="h-5 w-5" />,
    },
    {
      name: "交易訂單",
      path: "/trades",
      icon: <BarChart2 className="h-5 w-5" />,
    },

    {
      name: "綜合計算",
      path: "/calculator-unified",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      name: "進階計算",
      path: "/calculator-advanced",
      icon: <Wind className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={`h-screen bg-gray-100 dark:bg-gray-900 border-r dark:border-gray-800 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } fixed left-0 top-0 z-10`}
    >
      <div className="flex justify-between items-center h-16 px-4 border-b dark:border-gray-800">
        {!collapsed && <h1 className="text-lg font-bold">碳交易平台</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="mt-5 px-2">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center px-4 py-2.5 rounded-md transition-colors
                ${
                  pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
