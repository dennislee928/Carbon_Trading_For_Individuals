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
import { ErrorLogWithUser, ErrorLogStats } from "@/types/api";
import { formatDate } from "@/lib/utils";
import { Search, AlertTriangle, CheckCircle, Eye, Filter } from "lucide-react";

export default function ErrorLogsPage() {
  const [errorLogs, setErrorLogs] = useState<ErrorLogWithUser[]>([]);
  const [stats, setStats] = useState<ErrorLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedError, setSelectedError] = useState<ErrorLogWithUser | null>(
    null
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [filters, setFilters] = useState({
    error_type: "",
    status_code: "",
    endpoint: "",
    resolved: "",
  });

  useEffect(() => {
    const fetchErrorLogs = async () => {
      try {
        apiService.setToken("test-token");

        const [logsResponse, statsResponse] = await Promise.all([
          apiService.getErrorLogs(),
          apiService.getErrorLogStats(),
        ]);

        setErrorLogs(logsResponse.data.error_logs);
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Failed to fetch error logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchErrorLogs();
  }, []);

  const filteredErrorLogs = errorLogs.filter(
    (log) =>
      log.error_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.error_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewError = (error: ErrorLogWithUser) => {
    setSelectedError(error);
    setShowErrorModal(true);
  };

  const handleResolveError = async (errorId: string) => {
    try {
      await apiService.resolveErrorLog(errorId, {
        resolved_by: "admin",
        resolution_notes: "已由管理員解決",
      });

      // 更新本地狀態
      setErrorLogs(
        errorLogs.map((log) =>
          log.id === errorId
            ? { ...log, resolved: true, resolved_at: new Date().toISOString() }
            : log
        )
      );
    } catch (error) {
      console.error("Failed to resolve error:", error);
      alert("解決錯誤失敗");
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
            <h1 className="text-3xl font-bold text-gray-900">錯誤記錄管理</h1>
            <p className="text-gray-600 mt-2">監控和處理系統錯誤</p>
          </div>

          {/* 統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總錯誤數</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.total_errors || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">今日錯誤</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.today_errors || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  未解決錯誤
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.unresolved_errors || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  平均響應時間
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.average_response_time_ms || 0}ms
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 錯誤記錄列表 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>錯誤記錄</CardTitle>
                  <CardDescription>查看和管理系統錯誤</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索錯誤..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  篩選
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>錯誤類型</TableHead>
                      <TableHead>端點</TableHead>
                      <TableHead>狀態碼</TableHead>
                      <TableHead>錯誤訊息</TableHead>
                      <TableHead>用戶</TableHead>
                      <TableHead>時間</TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredErrorLogs.map((error) => (
                      <TableRow key={error.id}>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            {error.error_type}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {error.method} {error.endpoint}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              error.status_code >= 500
                                ? "bg-red-100 text-red-800"
                                : error.status_code >= 400
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {error.status_code}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {error.error_message}
                        </TableCell>
                        <TableCell>
                          {error.user ? error.user.name : "匿名"}
                        </TableCell>
                        <TableCell>{formatDate(error.created_at)}</TableCell>
                        <TableCell>
                          {error.resolved ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              已解決
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              未解決
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewError(error)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {!error.resolved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResolveError(error.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 錯誤詳情模態框 */}
          {showErrorModal && selectedError && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">錯誤詳情</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        錯誤類型
                      </label>
                      <p className="text-sm">{selectedError.error_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        端點
                      </label>
                      <p className="text-sm font-mono">
                        {selectedError.method} {selectedError.endpoint}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        狀態碼
                      </label>
                      <p className="text-sm">{selectedError.status_code}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        請求ID
                      </label>
                      <p className="text-sm font-mono">
                        {selectedError.request_id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        IP地址
                      </label>
                      <p className="text-sm">
                        {selectedError.ip_address || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        用戶代理
                      </label>
                      <p className="text-sm text-xs">
                        {selectedError.user_agent || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        錯誤訊息
                      </label>
                      <p className="text-sm bg-red-50 p-2 rounded">
                        {selectedError.error_message}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        用戶
                      </label>
                      <p className="text-sm">
                        {selectedError.user
                          ? `${selectedError.user.name} (${selectedError.user.email})`
                          : "匿名用戶"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        發生時間
                      </label>
                      <p className="text-sm">
                        {formatDate(selectedError.created_at)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        響應時間
                      </label>
                      <p className="text-sm">
                        {selectedError.duration_ms || "N/A"}ms
                      </p>
                    </div>
                    {selectedError.resolved && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            解決時間
                          </label>
                          <p className="text-sm">
                            {formatDate(selectedError.resolved_at!)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            解決方案
                          </label>
                          <p className="text-sm">
                            {selectedError.resolution_notes || "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {selectedError.stack_trace && (
                  <div className="mt-6">
                    <label className="text-sm font-medium text-gray-600">
                      堆疊追蹤
                    </label>
                    <pre className="text-xs bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
                      {selectedError.stack_trace}
                    </pre>
                  </div>
                )}
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowErrorModal(false)}
                  >
                    關閉
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
