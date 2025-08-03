"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { carbonApi } from "../services/carbonApi";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  address: string;
  phone: string;
  role: string;
  status: string;
  level: number;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const user = await carbonApi.getCurrentUser();
      setProfile(user);
      setFormData({
        name: user.name || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    } catch (err) {
      console.error("獲取用戶資料失敗:", err);
      setError("獲取用戶資料失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 這裡應該調用更新用戶資料的 API
      console.log("更新用戶資料:", formData);
      setIsEditing(false);
      // 重新獲取資料
      await fetchProfile();
    } catch (err) {
      setError("更新資料失敗");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Link href="/login">
                <Button>返回登入</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                個人資料
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                管理您的個人資料和帳戶設定
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">返回儀表板</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>基本資料</CardTitle>
                <CardDescription>您的個人基本資料</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">姓名</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="請輸入姓名"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">地址</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="請輸入地址"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">電話</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="請輸入電話"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">
                        儲存
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        取消
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        電子郵件
                      </Label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {profile?.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        姓名
                      </Label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {profile?.name || "未設定"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        地址
                      </Label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {profile?.address || "未設定"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        電話
                      </Label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {profile?.phone || "未設定"}
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full"
                    >
                      編輯資料
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>帳戶資訊</CardTitle>
                <CardDescription>您的帳戶詳細資訊</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      用戶 ID
                    </Label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {profile?.id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      角色
                    </Label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {profile?.role || "一般用戶"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      等級
                    </Label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Level {profile?.level || 0}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      狀態
                    </Label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {profile?.status || "正常"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      註冊時間
                    </Label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString(
                            "zh-TW"
                          )
                        : "未知"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
