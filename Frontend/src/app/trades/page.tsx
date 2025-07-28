"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ThemeToggle } from "../../components/theme-toggle";
import {
  carbonApi,
  CarbonCredit,
  CreateTradeRequest,
} from "../../services/carbonApi";

// 添加一個帶有Suspense的包裝組件
function TradePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const creditId = searchParams.get("creditId");
  const tradeType = searchParams.get("type") || "buy";

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [credit, setCredit] = useState<CarbonCredit | null>(null);
  const [formData, setFormData] = useState<{
    quantity: number;
    price: number;
    order_type: string;
  }>({
    quantity: 1,
    price: 0,
    order_type: tradeType,
  });

  useEffect(() => {
    const fetchCreditData = async () => {
      if (creditId) {
        try {
          const data = await carbonApi.getCarbonCreditById(creditId);
          setCredit(data);
          setFormData((prev) => ({
            ...prev,
            price: data.price,
          }));
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCreditData();
  }, [creditId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // 獲取當前用戶
      const user = await carbonApi.getCurrentUser();

      // 創建交易請求
      const tradeRequest: CreateTradeRequest = {
        user_id: user.id,
        order_type: formData.order_type,
        quantity: formData.quantity,
        price: formData.price,
      };

      await carbonApi.createTrade(tradeRequest);
      router.push("/dashboard?tradeCreated=true");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("創建交易時發生未知錯誤");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return (formData.quantity * formData.price).toFixed(2);
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
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-900 transition"
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
                onClick={() => router.back()}
                className="text-white border-white hover:bg-green-700"
              >
                返回
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container py-8 mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>交易詳情</CardTitle>
              <CardDescription>
                請填寫以下資訊以創建新的交易訂單
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order_type">交易類型</Label>
                  <Select
                    value={formData.order_type}
                    onValueChange={(value: string) =>
                      handleSelectChange("order_type", value)
                    }
                    disabled={Boolean(creditId)} // 如果從市場頁面跳轉過來，交易類型已固定
                  >
                    <SelectTrigger id="order_type">
                      <SelectValue placeholder="選擇交易類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">購買碳信用額</SelectItem>
                      <SelectItem value="sell">出售碳信用額</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">數量</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">單價 (USD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "處理中..." : "確認交易"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>交易摘要</CardTitle>
              <CardDescription>交易詳情及計算</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {credit && (
                <div className="space-y-2">
                  <h3 className="font-medium">碳信用額資訊</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">類型:</div>
                    <div>
                      {credit.credit_type === "VER"
                        ? "自願碳減排量"
                        : "核證減排量"}
                    </div>
                    <div className="text-muted-foreground">專案類型:</div>
                    <div>{credit.project_type}</div>
                    <div className="text-muted-foreground">發行方:</div>
                    <div>{credit.issuer || "未知"}</div>
                    <div className="text-muted-foreground">年份:</div>
                    <div>{credit.vintage_year}</div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">交易計算</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">交易類型:</div>
                  <div>{formData.order_type === "buy" ? "購買" : "出售"}</div>
                  <div className="text-muted-foreground">數量:</div>
                  <div>{formData.quantity}</div>
                  <div className="text-muted-foreground">單價:</div>
                  <div>${formData.price}</div>
                  <div className="text-muted-foreground font-medium">
                    預估總價:
                  </div>
                  <div className="font-medium">${calculateTotal()}</div>
                </div>
              </div>

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>
                  {formData.order_type === "buy"
                    ? "注意：購買碳信用額後將會從您的帳戶扣除相應金額。"
                    : "注意：出售碳信用額後，您的資產將會減少相應數量的碳信用額。"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// 主要的頁面組件現在使用Suspense邊界包裝內容
export default function NewTradePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <TradePageContent />
    </Suspense>
  );
}
