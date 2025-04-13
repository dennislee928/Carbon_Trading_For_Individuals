"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ThemeToggle } from "../../components/theme-toggle";
import {
  carbonApi,
  User,
  UserProfile,
  UserProfileUpdate,
} from "../../services/carbonApi";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserProfileUpdate>({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 獲取當前用戶資訊
        const userData = await carbonApi.getCurrentUser();
        setUser(userData);

        if (userData.id) {
          // 獲取用戶資料
          const profileData = await carbonApi.getUserProfile(userData.id);
          setUserProfile(profileData);

          // 設置表單數據
          setFormData({
            name: profileData.name || "",
            email: profileData.email,
          });
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          // 如果是401錯誤，重定向到登入頁面
          if (err.message.includes("401")) {
            router.push("/Login");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await carbonApi.updateUserProfile(user.id, formData);
      setUserProfile(updated);
      setSuccess("用戶資料更新成功");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("更新用戶資料時發生錯誤");
      }
    } finally {
      setIsSubmitting(false);
    }
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
      <header className="border-b dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 mx-auto">
          <h1 className="text-xl font-bold">個人資料</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              返回儀表板
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>個人資料</CardTitle>
              <CardDescription>查看和更新您的個人資料</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">電子郵件</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="您的電子郵件"
                    disabled={true} // 禁止修改電子郵件
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    電子郵件地址不可修改
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="請輸入您的姓名"
                  />
                </div>

                {user && user.role === "admin" && (
                  <div className="p-4 bg-blue-100 text-blue-800 rounded-md dark:bg-blue-900/30 dark:text-blue-400">
                    <p className="text-sm font-medium">您擁有管理員權限</p>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-blue-600 dark:text-blue-400"
                      onClick={() => router.push("/admin")}
                    >
                      前往管理面板
                    </Button>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "更新中..." : "更新資料"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  帳戶創建於:{" "}
                  {userProfile?.created_at
                    ? new Date(userProfile.created_at).toLocaleDateString()
                    : "未知"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/change-password")}
              >
                變更密碼
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
