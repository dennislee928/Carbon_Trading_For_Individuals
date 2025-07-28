"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { carbonApi, CarbonCredit } from "../../services/carbonApi";

export default function MarketPage() {
  const router = useRouter();
  const [credits, setCredits] = useState<CarbonCredit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    creditType: "",
    projectType: "",
    vintageYear: "",
  });

  // 獲取市場上的碳信用額
  useEffect(() => {
    const fetchCarbonCredits = async () => {
      try {
        const params: Record<string, string | number> = {};
        if (filters.creditType) params.creditType = filters.creditType;
        if (filters.projectType) params.projectType = filters.projectType;
        if (filters.vintageYear)
          params.vintageYear = parseInt(filters.vintageYear);

        const data = await carbonApi.getCarbonCredits(params);
        setCredits(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCarbonCredits();
  }, [filters]);

  // 處理購買按鈕點擊
  const handleBuy = (creditId: string) => {
    router.push(`/trades?creditId=${creditId}&type=buy`);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 處理返回儀表板
  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-green-600 dark:bg-green-800 text-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold">
                碳交易平台
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-900 transition"
                >
                  首頁
                </Link>
                <Link
                  href="/market"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-green-700 dark:bg-green-900 transition"
                >
                  交易市場
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-900 transition"
                >
                  我的資產
                </Link>
                <Link
                  href="/trade-history"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-900 transition"
                >
                  交易歷史
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="text-white border-white hover:bg-green-700"
              >
                返回儀表板
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container py-8 mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>市場篩選</CardTitle>
            <CardDescription>
              選擇以下條件過濾交易市場上的碳信用額
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creditType">碳信用額類型</Label>
                <Select
                  value={filters.creditType}
                  onValueChange={(value: string) =>
                    handleFilterChange("creditType", value)
                  }
                >
                  <SelectTrigger id="creditType">
                    <SelectValue placeholder="全部類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部類型</SelectItem>
                    <SelectItem value="VER">自願碳減排量 (VER)</SelectItem>
                    <SelectItem value="CER">核證減排量 (CER)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">專案類型</Label>
                <Select
                  value={filters.projectType}
                  onValueChange={(value: string) =>
                    handleFilterChange("projectType", value)
                  }
                >
                  <SelectTrigger id="projectType">
                    <SelectValue placeholder="全部專案" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部專案</SelectItem>
                    <SelectItem value="Renewable Energy">再生能源</SelectItem>
                    <SelectItem value="Forestry">森林保育</SelectItem>
                    <SelectItem value="Energy Efficiency">能源效率</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vintageYear">年份</Label>
                <Select
                  value={filters.vintageYear}
                  onValueChange={(value: string) =>
                    handleFilterChange("vintageYear", value)
                  }
                >
                  <SelectTrigger id="vintageYear">
                    <SelectValue placeholder="全部年份" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部年份</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>可交易碳信用額</CardTitle>
            <CardDescription>市場上可購買的碳信用額列表</CardDescription>
          </CardHeader>
          <CardContent>
            {credits.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>類型</TableHead>
                    <TableHead>專案類型</TableHead>
                    <TableHead>發行方</TableHead>
                    <TableHead className="text-right">數量</TableHead>
                    <TableHead className="text-right">價格</TableHead>
                    <TableHead className="text-right">年份</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credits.map((credit) => (
                    <TableRow key={credit.id}>
                      <TableCell>
                        {credit.credit_type === "VER"
                          ? "自願碳減排量"
                          : credit.credit_type === "CER"
                          ? "核證減排量"
                          : credit.credit_type}
                      </TableCell>
                      <TableCell>
                        {credit.project_type === "Renewable Energy"
                          ? "再生能源"
                          : credit.project_type === "Forestry"
                          ? "森林保育"
                          : credit.project_type === "Energy Efficiency"
                          ? "能源效率"
                          : credit.project_type}
                      </TableCell>
                      <TableCell>{credit.issuer || "未知"}</TableCell>
                      <TableCell className="text-right">
                        {credit.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${credit.price}
                      </TableCell>
                      <TableCell className="text-right">
                        {credit.vintage_year}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleBuy(credit.id)}>
                          購買
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                沒有找到符合條件的碳信用額，請嘗試調整篩選條件
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
