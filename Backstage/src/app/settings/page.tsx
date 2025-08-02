"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Save, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    apiUrl: "https://apiv1-carbontrading.dennisleehappy.org/api/v1",
    maxUsers: "1000",
    maxPoints: "1000000",
    maintenanceMode: false,
  });

  const handleSaveSettings = () => {
    // 這裡可以實現保存設定的邏輯
    alert("設定已保存");
  };

  const handleResetSettings = () => {
    if (confirm("確定要重置所有設定嗎？")) {
      setSettings({
        apiUrl: "https://apiv1-carbontrading.dennisleehappy.org/api/v1",
        maxUsers: "1000",
        maxPoints: "1000000",
        maintenanceMode: false,
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">系統設定</h1>
            <p className="text-gray-600 mt-2">管理系統配置</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API 設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  API 設定
                </CardTitle>
                <CardDescription>配置 API 端點和連接設定</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    API 基礎 URL
                  </label>
                  <Input
                    value={settings.apiUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, apiUrl: e.target.value })
                    }
                    placeholder="輸入 API URL"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    保存設定
                  </Button>
                  <Button variant="outline" onClick={handleResetSettings}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重置
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 系統限制 */}
            <Card>
              <CardHeader>
                <CardTitle>系統限制</CardTitle>
                <CardDescription>設定系統使用限制</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    最大用戶數
                  </label>
                  <Input
                    type="number"
                    value={settings.maxUsers}
                    onChange={(e) =>
                      setSettings({ ...settings, maxUsers: e.target.value })
                    }
                    placeholder="輸入最大用戶數"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    最大積分數
                  </label>
                  <Input
                    type="number"
                    value={settings.maxPoints}
                    onChange={(e) =>
                      setSettings({ ...settings, maxPoints: e.target.value })
                    }
                    placeholder="輸入最大積分數"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maintenanceMode: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <label
                    htmlFor="maintenanceMode"
                    className="text-sm font-medium text-gray-600"
                  >
                    維護模式
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* 系統信息 */}
            <Card>
              <CardHeader>
                <CardTitle>系統信息</CardTitle>
                <CardDescription>當前系統狀態和版本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    版本
                  </label>
                  <p className="text-sm">1.0.0</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    環境
                  </label>
                  <p className="text-sm">Production</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    最後更新
                  </label>
                  <p className="text-sm">2024-01-01 12:00:00</p>
                </div>
              </CardContent>
            </Card>

            {/* 備份設定 */}
            <Card>
              <CardHeader>
                <CardTitle>備份設定</CardTitle>
                <CardDescription>數據備份和恢復設定</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoBackup"
                    defaultChecked
                    className="rounded"
                  />
                  <label
                    htmlFor="autoBackup"
                    className="text-sm font-medium text-gray-600"
                  >
                    自動備份
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    備份頻率
                  </label>
                  <select className="w-full p-2 border rounded-md">
                    <option>每日</option>
                    <option>每週</option>
                    <option>每月</option>
                  </select>
                </div>
                <Button variant="outline" className="w-full">
                  立即備份
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
