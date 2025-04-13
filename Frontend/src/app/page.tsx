// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <div className="container mx-auto flex items-center justify-between">
          <div
            className="cf-turnstile"
            data-sitekey="0x4AAAAAABK93bNlJDg5SXDg"
            data-callback="javascriptCallback"
          ></div>
          <h1 className="text-xl font-bold">個人碳交易平台</h1>
          <nav className="flex gap-4 sm:gap-6">
            <Link
              href="/pages/Login"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              登入
            </Link>
            <Link
              href="/pages/Register"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              註冊
            </Link>
          </nav>
        </div>
      </header>
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
              <div className="space-y-2 md:space-x-4 md:space-y-0">
                <Link href="/Register">
                  <Button size="lg" className="mr-4">
                    立即註冊
                  </Button>
                </Link>
                <Link href="/Dashboard">
                  <Button variant="outline" size="lg">
                    進入儀表板
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
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
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 個人碳交易平台. 保留所有權利.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/about"
            className="text-xs hover:underline underline-offset-4"
          >
            關於我們
          </Link>
          <Link
            href="/privacy"
            className="text-xs hover:underline underline-offset-4"
          >
            隱私政策
          </Link>
          <Link
            href="/terms"
            className="text-xs hover:underline underline-offset-4"
          >
            使用條款
          </Link>
        </nav>
      </footer>
    </div>
  );
}
