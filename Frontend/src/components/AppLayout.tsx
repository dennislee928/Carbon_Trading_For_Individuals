"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarMenu from "./SidebarMenu";
import { Button } from "./ui/button";
import { carbonApi } from "../services/carbonApi";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // 判斷是否顯示側邊欄的路徑
  const publicPaths = [
    "/Login",
    "/Signup",
    "/",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path)
  );
  const showSidebar = !isPublicPath && isLoggedIn;

  useEffect(() => {
    // 检查是否为根路径，如果是，则跳转到登录
    if (pathname === "/") {
      router.push("/Login");
      return;
    }

    // 檢查使用者是否已登入
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsLoggedIn(false);
          if (!isPublicPath) {
            router.push("/Login");
          }
        } else {
          const user = await carbonApi.getCurrentUser();
          if (user?.id) {
            setIsLoggedIn(true);
            setUserName(user?.name || user?.email || "使用者");

            // 如果用户已登录且访问公共路径，重定向到仪表板
            if (isPublicPath) {
              router.push("/pages/Dashboard");
            }
          } else {
            setIsLoggedIn(false);
            if (!isPublicPath) {
              router.push("/Login");
            }
          }
        }
      } catch (error) {
        setIsLoggedIn(false);
        if (!isPublicPath) {
          router.push("/Login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, isPublicPath]);

  const handleLogout = async () => {
    await carbonApi.logout();
    setIsLoggedIn(false);
    router.push("/Login");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showSidebar && <SidebarMenu />}

      <div
        className={`transition-all duration-300 ${
          showSidebar ? "ml-64" : "ml-0"
        }`}
      >
        {isLoggedIn && !isPublicPath && (
          <header className="border-b dark:border-gray-800">
            <div className="container flex items-center justify-end h-16 mx-auto px-4">
              <div className="flex items-center gap-4">
                {userName && <span className="text-sm">您好，{userName}</span>}
                <Button variant="outline" onClick={handleLogout}>
                  登出
                </Button>
              </div>
            </div>
          </header>
        )}

        <main
          className={`container py-8 mx-auto px-4 ${
            isLoggedIn && !isPublicPath ? "pt-8" : "pt-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
