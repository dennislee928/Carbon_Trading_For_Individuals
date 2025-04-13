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
      path: "/pages/Dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "個人資料",
      path: "/pages/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "交易市場",
      path: "/pages/Market",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "交易歷史",
      path: "/pages/trade-history",
      icon: <History className="h-5 w-5" />,
    },
    {
      name: "我的交易",
      path: "/pages/Trades",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "自動駕駛",
      path: "/pages/Autopilot",
      icon: <Wind className="h-5 w-5" />,
    },
    {
      name: "CBAM",
      path: "/pages/CBAM",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      name: "電腦計算",
      path: "/pages/Computing",
      icon: <Server className="h-5 w-5" />,
    },
    {
      name: "自定義映射",
      path: "/pages/CustomMappings",
      icon: <Map className="h-5 w-5" />,
    },
    { name: "能源", path: "/pages/Energy", icon: <Zap className="h-5 w-5" /> },
    {
      name: "貨運",
      path: "/pages/Freight",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      name: "採購",
      path: "/pages/Procurement",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: "旅行",
      path: "/pages/Travel",
      icon: <Globe className="h-5 w-5" />,
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
