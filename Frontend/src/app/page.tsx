"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { carbonApi, User } from "./services/carbonApi";
import { climatiqService } from "./services/climatiq";
import { climatiqApi } from "./services/api";
import { EmissionResult } from "./services/types";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentEmissions, setRecentEmissions] = useState<EmissionResult[]>([]);
  const [totalEmissions, setTotalEmissions] = useState<number>(0);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await carbonApi.getCurrentUser();
          setUser(userData);
          // 載入用戶的排放數據
          await loadUserEmissions();
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

  const loadUserEmissions = async () => {
    try {
      // 這裡可以從後端API獲取用戶的排放歷史
      // 目前使用模擬數據
      const mockEmissions: EmissionResult[] = [
        {
          co2e: 2.5,
          co2e_unit: "kg",
          parameters: {
            distance: 100,
            distance_unit: "km",
            transport_mode: "car",
          },
        },
        {
          co2e: 1.8,
          co2e_unit: "kg",
          parameters: {
            energy: 50,
            energy_unit: "kWh",
            energy_type: "electricity",
          },
        },
      ];

      setRecentEmissions(mockEmissions);
      const total = mockEmissions.reduce(
        (sum, emission) => sum + emission.co2e,
        0
      );
      setTotalEmissions(total);
    } catch (error) {
      console.error("Failed to load emissions:", error);
    }
  };

  const handleQuickCalculation = async () => {
    try {
      // 快速計算示例：汽車旅行
      const travelData = {
        distance_km: 350,
        travel_mode: "car",
        passengers: 1,
      };

      const result = await climatiqService.travel(travelData);
      console.log("Quick calculation result:", result);

      // 更新排放數據
      setRecentEmissions((prev) => [result, ...prev.slice(0, 4)]);
      setTotalEmissions((prev) => prev + result.co2e);
    } catch (error) {
      console.error("Quick calculation failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  歡迎使用個人碳交易平台
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  參與碳交易，為地球永續發展貢獻一份力量
                </p>
              </div>

              {user ? (
                <div className="space-y-6 w-full max-w-4xl">
                  {/* 用戶儀表板 */}
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>總碳足跡</CardTitle>
                        <CardDescription>本月累計排放量</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                          {totalEmissions.toFixed(1)} kg CO₂e
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>碳信用額</CardTitle>
                        <CardDescription>已購買的碳信用額</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                          0 單位
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>淨排放</CardTitle>
                        <CardDescription>扣除碳信用額後</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                          {totalEmissions.toFixed(1)} kg CO₂e
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 快速計算工具 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>快速碳足跡計算</CardTitle>
                      <CardDescription>
                        快速計算您的日常活動碳足跡
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Button
                          onClick={handleQuickCalculation}
                          className="h-20"
                        >
                          <div className="text-center">
                            <div className="text-lg">🚗</div>
                            <div className="text-sm">汽車旅行</div>
                          </div>
                        </Button>
                        <Link href="/pages/Energy">
                          <Button variant="outline" className="h-20 w-full">
                            <div className="text-center">
                              <div className="text-lg">⚡</div>
                              <div className="text-sm">能源使用</div>
                            </div>
                          </Button>
                        </Link>
                        <Link href="/pages/Travel">
                          <Button variant="outline" className="h-20 w-full">
                            <div className="text-center">
                              <div className="text-lg">✈️</div>
                              <div className="text-sm">航空旅行</div>
                            </div>
                          </Button>
                        </Link>
                        <Link href="/pages/Computing">
                          <Button variant="outline" className="h-20 w-full">
                            <div className="text-center">
                              <div className="text-lg">💻</div>
                              <div className="text-sm">數位活動</div>
                            </div>
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 最近排放記錄 */}
                  {recentEmissions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>最近排放記錄</CardTitle>
                        <CardDescription>
                          您最近的碳足跡計算結果
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {recentEmissions.map((emission, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                            >
                              <span>
                                {emission.parameters?.transport_mode ===
                                  "car" && "汽車旅行"}
                                {emission.parameters?.energy_type ===
                                  "electricity" && "電力使用"}
                                {!emission.parameters?.transport_mode &&
                                  !emission.parameters?.energy_type &&
                                  "其他活動"}
                              </span>
                              <span className="font-semibold text-green-600">
                                {emission.co2e} {emission.co2e_unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 行動按鈕 */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/pages/Market">
                      <Button size="lg" className="w-full sm:w-auto">
                        前往交易市場
                      </Button>
                    </Link>
                    <Link href="/pages/Dashboard">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        查看詳細儀表板
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 md:space-x-4 md:space-y-0">
                  <Link href="/pages/Register">
                    <Button size="lg" className="mr-4">
                      立即註冊
                    </Button>
                  </Link>
                  <Link href="/pages/Login">
                    <Button variant="outline" size="lg">
                      登入帳戶
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 功能介紹 */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 md:gap-8">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-primary rounded-full">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">減少碳足跡</h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  通過交易碳信用額，個人可以有效抵消日常生活中產生的碳足跡
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-primary rounded-full">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">支持綠色項目</h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  您購買的碳信用額將用於支持全球各地的可再生能源和森林保育項目
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-primary rounded-full">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">追蹤您的貢獻</h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  平台提供詳細的報告和數據，幫助您追蹤自己為環境保護所做的貢獻
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
