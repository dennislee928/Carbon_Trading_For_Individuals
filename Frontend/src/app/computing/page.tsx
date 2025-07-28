"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ThemeToggle } from "@/app/components/theme-toggle";
import ComputingForm from "../components/Calculator/ComputingForm";
import EmissionFactorsSearch from "../components/EmissionFactorsSearch";

export default function ComputingPage() {
  const handleResult = (result: any) => {
    console.log("Computing result:", result);
    // 這裡可以處理計算結果
  };

  return (
   

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                計算碳排放
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                計算您的計算活動產生的碳排放
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">返回儀表板</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>計算碳排放計算器</CardTitle>
                <CardDescription>
                  輸入您的計算活動詳情來計算碳排放量
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComputingForm onResult={handleResult} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>計算結果</CardTitle>
                <CardDescription>
                  您的碳排放計算結果將顯示在這裡
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 dark:text-gray-400">
                  請先填寫並提交計算表單
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
