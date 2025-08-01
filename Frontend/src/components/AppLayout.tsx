"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarMenu from "./SidebarMenu";
import { Button } from "./ui/button";
import { carbonApi } from "../app/services/carbonApi";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [useLocalMode, setUseLocalMode] = useState(false);

  console.log("當前路徑:", pathname);

  // 判斷是否顯示側邊欄的路徑
  const publicPaths = [
    "/login",
    "/register",
    "/",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.toLowerCase() === path.toLowerCase()
  );

  // 判斷是否顯示側邊欄
  // 修改為：在非公共路徑上都顯示側邊欄，不管是否登入
  const showSidebar = !isPublicPath;

  console.log("是否為公共路徑:", isPublicPath);
  console.log("是否顯示側邊欄:", showSidebar);
  console.log("是否已登入:", isLoggedIn);
  console.log("是否使用本地模式:", useLocalMode);

  useEffect(() => {
    // 不再自動將根路徑重定向到登入頁面
    // if (pathname === "/") {
    //   router.push("/login");
    //   return;
    // }

    // 檢查使用者是否已登入
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token存在:", !!token);

        if (!token) {
          setIsLoggedIn(false);
          if (!isPublicPath && !useLocalMode) {
            router.push("/login");
          }
        } else {
          try {
            // 確保使用正確的引入方式
            const user = await carbonApi.getCurrentUser();
            console.log("獲取到的用戶:", user);

            if (user?.id) {
              setIsLoggedIn(true);
              setUserName(user?.name || user?.email || "使用者");

              // 如果用户已登录且访问公共路径，重定向到仪表板
              if (isPublicPath && pathname !== "/") {
                router.push("/dashboard");
              }
            } else {
              setIsLoggedIn(false);
              console.warn("無法獲取用戶資料，使用本地模式");
              setUseLocalMode(true);
            }
          } catch (error) {
            console.error("獲取用戶資料失敗:", error);
            setIsLoggedIn(false);
            console.warn("API 連接失敗，使用本地模式");
            setUseLocalMode(true);
          }
        }
      } catch (error) {
        console.error("驗證用戶時出錯:", error);
        setIsLoggedIn(false);
        if (!isPublicPath && !useLocalMode) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, isPublicPath, useLocalMode]);

  const handleLogout = async () => {
    await carbonApi.logout();
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleEnableLocalMode = () => {
    setUseLocalMode(true);
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
        {(isLoggedIn || useLocalMode) && !isPublicPath && (
          <header className="border-b dark:border-gray-800">
            <div className="container flex items-center justify-end h-16 mx-auto px-4">
              <div className="flex items-center gap-4">
                {userName && <span className="text-sm">您好，{userName}</span>}
                {useLocalMode && (
                  <span className="text-xs text-yellow-500">本地模式</span>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  登出
                </Button>
              </div>
            </div>
          </header>
        )}

        <main
          className={`container py-8 mx-auto px-4 ${
            (isLoggedIn || useLocalMode) && !isPublicPath ? "pt-8" : "pt-0"
          }`}
        >
          {!isLoggedIn && !isPublicPath && !useLocalMode && (
            <div className="mb-4 p-4 bg-yellow-100 rounded-md">
              <p className="text-yellow-800">
                您尚未登入或API連接失敗。您可以{" "}
                <Button variant="link" onClick={() => router.push("/login")}>
                  登入
                </Button>{" "}
                或{" "}
                <Button variant="link" onClick={handleEnableLocalMode}>
                  使用本地模式
                </Button>
              </p>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
