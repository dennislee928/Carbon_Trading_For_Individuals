"use client";

import { useEffect, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiService } from "@/lib/api";
import { UserBalanceWithUser } from "@/types/api";
import { formatNumber, formatDate } from "@/lib/utils";
import { Search, Plus, Minus, Eye } from "lucide-react";

export default function BalancesPage() {
  const [balances, setBalances] = useState<UserBalanceWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBalance, setSelectedBalance] =
    useState<UserBalanceWithUser | null>(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showAddPointsModal, setShowAddPointsModal] = useState(false);
  const [selectedUserForPoints, setSelectedUserForPoints] =
    useState<UserBalanceWithUser | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        apiService.setToken("test-token");
        const response = await apiService.getAllBalances();
        setBalances(response.data.balances);
      } catch (error) {
        console.error("Failed to fetch balances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  const filteredBalances = balances.filter(
    (balance) =>
      balance.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      balance.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPoints = balances.reduce(
    (sum, balance) => sum + balance.points,
    0
  );
  const averagePoints = balances.length > 0 ? totalPoints / balances.length : 0;

  const handleViewBalance = (balance: UserBalanceWithUser) => {
    setSelectedBalance(balance);
    setShowBalanceModal(true);
  };

  const handleAddPoints = (balance: UserBalanceWithUser) => {
    setSelectedUserForPoints(balance);
    setShowAddPointsModal(true);
  };

  const handleSubmitAddPoints = async () => {
    if (!selectedUserForPoints || !pointsToAdd) return;

    try {
      await apiService.addUserPoints(selectedUserForPoints.user_id, {
        points: parseFloat(pointsToAdd),
        reason: reason || "管理員手動添加",
      });

      // 更新本地狀態
      setBalances(
        balances.map((balance) =>
          balance.user_id === selectedUserForPoints.user_id
            ? { ...balance, points: balance.points + parseFloat(pointsToAdd) }
            : balance
        )
      );

      setShowAddPointsModal(false);
      setSelectedUserForPoints(null);
      setPointsToAdd("");
      setReason("");
    } catch (error) {
      console.error("Failed to add points:", error);
      alert("添加積分失敗");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:pl-64">
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">積分管理</h1>
            <p className="text-gray-600 mt-2">管理用戶積分餘額</p>
          </div>

          {/* 統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總積分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(totalPoints)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均積分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(averagePoints)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">用戶數</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{balances.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* 積分列表 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>積分列表</CardTitle>
                  <CardDescription>查看和管理用戶積分</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索用戶..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用戶名稱</TableHead>
                      <TableHead>電子郵件</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead>積分餘額</TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead>更新時間</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBalances.map((balance) => (
                      <TableRow key={balance.id}>
                        <TableCell className="font-medium">
                          {balance.user_name}
                        </TableCell>
                        <TableCell>{balance.user_email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              balance.user_role === "admin"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {balance.user_role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono font-bold text-lg">
                            {formatNumber(balance.points)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              balance.user_status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {balance.user_status}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(balance.updated_at)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewBalance(balance)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddPoints(balance)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 積分詳情模態框 */}
          {showBalanceModal && selectedBalance && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">積分詳情</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      用戶名稱
                    </label>
                    <p className="text-sm">{selectedBalance.user_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      電子郵件
                    </label>
                    <p className="text-sm">{selectedBalance.user_email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      角色
                    </label>
                    <p className="text-sm">{selectedBalance.user_role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      積分餘額
                    </label>
                    <p className="text-2xl font-bold text-green-600">
                      {formatNumber(selectedBalance.points)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      狀態
                    </label>
                    <p className="text-sm">{selectedBalance.user_status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      創建時間
                    </label>
                    <p className="text-sm">
                      {formatDate(selectedBalance.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      更新時間
                    </label>
                    <p className="text-sm">
                      {formatDate(selectedBalance.updated_at)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowBalanceModal(false)}
                  >
                    關閉
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 添加積分模態框 */}
          {showAddPointsModal && selectedUserForPoints && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">添加積分</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      用戶
                    </label>
                    <p className="text-sm">{selectedUserForPoints.user_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      當前積分
                    </label>
                    <p className="text-sm font-bold">
                      {formatNumber(selectedUserForPoints.points)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      添加積分
                    </label>
                    <Input
                      type="number"
                      value={pointsToAdd}
                      onChange={(e) => setPointsToAdd(e.target.value)}
                      placeholder="輸入積分數量"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      原因
                    </label>
                    <Input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="添加積分的原因（可選）"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddPointsModal(false);
                      setSelectedUserForPoints(null);
                      setPointsToAdd("");
                      setReason("");
                    }}
                  >
                    取消
                  </Button>
                  <Button onClick={handleSubmitAddPoints}>確認添加</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
