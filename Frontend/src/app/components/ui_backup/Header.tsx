// src/app/components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../theme-toggle";
import { carbonApi, User } from "../../services/carbonApi";
import { Button } from "../ui/button";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await carbonApi.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    await carbonApi.logout();
    setUser(null);
    window.location.href = "/";
  };

  const navItems = [
    { name: "首頁", href: "/" },
    { name: "交易市場", href: "/market" },
    { name: "我的資產", href: "/dashboard" },
    { name: "交易歷史", href: "/trade-history" },
  ];

  return (
    <header className="bg-green-600 dark:bg-green-800 text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">
              碳交易平台
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-900 transition"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User actions and theme toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      您好，{user.name || user.email}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="text-white border-white hover:bg-green-700"
                    >
                      登出
                    </Button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-900 transition"
                  >
                    登入
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button (Placeholder) */}
          <div className="md:hidden">
            <button className="p-2 rounded-md hover:bg-green-700 dark:hover:bg-green-900">
              {/* Add hamburger icon here if needed */}
              選單
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
