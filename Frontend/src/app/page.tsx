"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { ChevronRight, ArrowRight, Globe, Leaf, BarChart } from "lucide-react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 現代導航欄，帶有滾動效果 */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  碳交易平台
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link
                href="/market"
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                交易市場
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                我的儀表板
              </Link>
              <Link
                href="/trade-history"
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                交易歷史
              </Link>
              <Link
                href="/about"
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                關於我們
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="hidden md:inline-flex">
                  登入
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-green-600 hover:bg-green-700">
                  註冊
                </Button>
              </Link>

              {/* 移動裝置選單按鈕 */}
              <button className="md:hidden bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 英雄區塊 */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 bg-gradient-to-br from-green-50 via-green-100 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400">
                    為永續未來
                    <br />
                    參與個人碳交易
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    透過我們的平台，計算、追蹤您的碳足跡並參與全球碳交易市場，為環境保護做出貢獻。
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/register">
                      <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        立即加入
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="#features">
                      <Button variant="outline" size="lg">
                        了解更多
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="relative max-w-md w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-semibold text-lg">
                        個人碳足跡儀表板
                      </h3>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        演示
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            本月排放
                          </p>
                          <p className="text-2xl font-bold">124 kg</p>
                          <p className="text-xs text-red-500">+12% ↑</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            已抵消
                          </p>
                          <p className="text-2xl font-bold">75 kg</p>
                          <p className="text-xs text-green-500">+8% ↑</p>
                        </div>
                      </div>
                      <div className="h-40 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <BarChart className="h-20 w-20 text-gray-300 dark:text-gray-600" />
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                        <p className="text-sm text-green-700 dark:text-green-400">
                          您的碳足跡低於社區平均水平 15%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -z-10 top-10 -right-5 h-40 w-40 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -z-10 -bottom-5 -left-5 h-40 w-40 bg-green-400/20 rounded-full blur-3xl"></div>
              </motion.div>
            </div>
          </div>

          {/* 裝飾元素 */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="w-full h-auto"
            >
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,192L60,181.3C120,171,240,149,360,149.3C480,149,600,171,720,186.7C840,203,960,213,1080,202.7C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                className="fill-white dark:fill-gray-900"
              ></path>
            </svg>
          </div>
        </section>

        {/* 特色功能區 */}
        <section id="features" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">平台特色功能</h2>
              <p className="text-gray-600 dark:text-gray-400">
                我們的平台提供全方位的工具，幫助您了解、管理和減少您的碳足跡
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <CardTitle className="mt-4">碳足跡計算</CardTitle>
                  <CardDescription>
                    精確計算您的日常活動產生的碳排放量
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-4">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      交通出行碳排放
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      家庭能源消耗
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      飲食碳排放
                    </li>
                  </ul>
                  <Link href="/travel">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      開始計算
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                  </div>
                  <CardTitle className="mt-4">碳權交易市場</CardTitle>
                  <CardDescription>
                    透過購買碳權來抵消您的碳足跡
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-4">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      購買認證碳權
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      追蹤市場價格
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      支持環保項目
                    </li>
                  </ul>
                  <Link href="/market">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      進入市場
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-600 dark:text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <CardTitle className="mt-4">分析與洞察</CardTitle>
                  <CardDescription>
                    詳細分析您的碳排放趨勢與改善建議
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-4">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      排放趨勢圖表
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      個人化建議
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      與社區比較
                    </li>
                  </ul>
                  <Link href="/dashboard">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      查看儀表板
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 簡介視覺化區塊 */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">如何運作？</h2>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        計算您的碳足跡
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        使用我們的計算工具記錄您的日常活動，包括交通、能源使用和消費習慣。
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        瞭解您的碳足跡來源
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        查看詳細分析，了解您的碳排放主要來自哪些方面，並獲取減少排放的建議。
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        抵消您無法減少的碳排放
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        透過我們的交易市場購買碳權，支持經過認證的環保項目，抵消您的碳足跡。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
                    <div className="flex items-center justify-center h-full">
                      <Globe className="h-24 w-24 text-green-200 dark:text-green-900/50" />
                    </div>
                  </div>
                </div>
                <div className="absolute -z-10 -bottom-5 -right-5 h-64 w-64 bg-green-200 dark:bg-green-900/30 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA區塊 */}
        <section className="py-20 bg-gradient-to-br from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              準備好為環境保護做出貢獻了嗎？
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
              加入我們的平台，計算您的碳足跡，並通過碳交易抵消您的排放。一起為地球的可持續發展努力。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  立即註冊
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-green-700/20"
                >
                  了解更多
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 頁腳 */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  碳交易平台
                </span>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                我們致力於為個人提供碳足跡管理和碳交易的解決方案，幫助每個人為環境保護做出貢獻。
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-green-600">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-600">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v6h3v-6h1.82l.18-2h-2v-.833c0-.478.096-.667.558-.667h1.442v-2.5h-1.9c-1.782 0-2.1.739-2.1 1.833v1.167z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-600">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">快速連結</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  >
                    關於我們
                  </Link>
                </li>
                <li>
                  <Link
                    href="/market"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  >
                    交易市場
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  >
                    用戶儀表板
                  </Link>
                </li>
                <li>
                  <Link
                    href="/trade-history"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  >
                    交易歷史
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">幫助與支持</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  >
                    常見問題
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  >
                    聯繫我們
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  >
                    使用條款
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  >
                    隱私政策
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} 個人碳交易平台. 保留所有權利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
