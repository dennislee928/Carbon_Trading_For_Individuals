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
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ThemeToggle } from "../../components/theme-toggle";
import { carbonApi, User } from "../../services/carbonApi";

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  // 編輯用戶的狀態
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    role: string;
  }>({
    name: "",
    role: "user",
  });

  // 新增用戶的狀態
  const [newUserForm, setNewUserForm] = useState<{
    email: string;
    password: string;
    name: string;
    role: string;
  }>({
    email: "",
    password: "",
    name: "",
    role: "user",
  });

  // 刪除確認對話框狀態
  const [deleteUserDialog, setDeleteUserDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // 獲取當前用戶資訊
        const userData = await carbonApi.getCurrentUser();
        setCurrentUser(userData);

        // 檢查用戶是否為管理員
        if (userData.role !== "admin") {
          router.push("/dashboard");
          return;
        }

        // 獲取所有用戶列表
        const usersData = await carbonApi.getAllUsers();
        setUsers(usersData);
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

    fetchAdminData();
  }, [router]);

  // 篩選用戶列表
  const filteredUsers = users.filter((user) => {
    if (!search) return true;
    return (
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.role?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // 開啟編輯對話框
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      role: user.role || "user",
    });
  };

  // 提交編輯表單
  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const updatedUser = await carbonApi.updateUser(editingUser.id, editForm);
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setSuccess(`用戶 ${updatedUser.email} 更新成功`);
      setEditingUser(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("更新用戶時發生錯誤");
      }
    }
  };

  // 處理新增用戶表單變更
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 提交新增用戶表單
  const handleCreateUser = async () => {
    try {
      const newUser = await carbonApi.createUser({
        ...newUserForm,
        id: "",
      } as User);
      setUsers([...users, newUser]);
      setSuccess(`用戶 ${newUser.email} 創建成功`);
      setNewUserForm({
        email: "",
        password: "",
        name: "",
        role: "user",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("創建用戶時發生錯誤");
      }
    }
  };

  // 開啟刪除確認對話框
  const handleDeleteConfirm = (user: User) => {
    setDeleteUserDialog({
      open: true,
      user,
    });
  };

  // 執行刪除用戶
  const handleDeleteUser = async () => {
    if (!deleteUserDialog.user) return;

    try {
      await carbonApi.deleteUser(deleteUserDialog.user.id);
      setUsers(users.filter((user) => user.id !== deleteUserDialog.user?.id));
      setSuccess(`用戶 ${deleteUserDialog.user.email} 已刪除`);
      setDeleteUserDialog({ open: false, user: null });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("刪除用戶時發生錯誤");
      }
    }
  };

  // 格式化日期時間
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "未知";
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>無權限</CardTitle>
            <CardDescription>
              您沒有管理員權限，無法訪問此頁面。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              返回儀表板
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 mx-auto">
          <h1 className="text-xl font-bold">管理員面板</h1>
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

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">總用戶數</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{users.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">管理員數量</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {users.filter((user) => user.role === "admin").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">普通用戶數量</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {users.filter((user) => user.role !== "admin").length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>創建新用戶</CardTitle>
            <CardDescription>
              建立新的用戶帳號，管理員可以直接創建用戶
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newUserForm.email}
                  onChange={handleNewUserChange}
                  placeholder="請輸入電子郵件"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">密碼</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newUserForm.password}
                  onChange={handleNewUserChange}
                  placeholder="請輸入密碼"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={newUserForm.name}
                  onChange={handleNewUserChange}
                  placeholder="請輸入姓名"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="role">角色</Label>
                <Select
                  value={newUserForm.role}
                  onValueChange={(value) =>
                    setNewUserForm((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger id="role" className="mt-1">
                    <SelectValue placeholder="選擇角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">普通用戶</SelectItem>
                    <SelectItem value="admin">管理員</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleCreateUser}>創建用戶</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>用戶管理</CardTitle>
                <CardDescription>管理所有用戶帳戶</CardDescription>
              </div>
              <div className="mt-4 md:mt-0 w-full md:w-auto">
                <Input
                  placeholder="搜尋用戶..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-[250px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>電子郵件</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>最後登入</TableHead>
                  <TableHead>創建時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name || "未設置"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {user.role === "admin" ? "管理員" : "普通用戶"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {user.status === "active"
                          ? "啟用"
                          : user.status || "未知"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.last_login
                        ? formatDateTime(user.last_login)
                        : "從未登入"}
                    </TableCell>
                    <TableCell>
                      {user.created_at
                        ? formatDateTime(user.created_at)
                        : "未知"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        編輯
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteConfirm(user)}
                        disabled={user.id === currentUser?.id} // 不允許刪除自己
                      >
                        刪除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      沒有找到符合條件的用戶
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* 編輯用戶對話框 */}
      <Dialog
        open={editingUser !== null}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯用戶</DialogTitle>
            <DialogDescription>
              更新用戶 {editingUser?.email} 的資料
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">姓名</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="請輸入姓名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">角色</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="選擇角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">普通用戶</SelectItem>
                  <SelectItem value="admin">管理員</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button onClick={handleUpdateUser}>更新用戶</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 刪除用戶確認對話框 */}
      <Dialog
        open={deleteUserDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteUserDialog({ open: false, user: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認刪除用戶</DialogTitle>
            <DialogDescription>
              您確定要刪除用戶 {deleteUserDialog.user?.email}{" "}
              嗎？此操作無法撤銷。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteUser}>
              確認刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
