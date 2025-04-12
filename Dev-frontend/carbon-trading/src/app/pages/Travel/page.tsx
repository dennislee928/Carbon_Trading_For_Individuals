"use client";

import ClimatiqCalculator from "../../components/Calculator";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation"; // 使用 next/navigation

export default function AutopilotPage() {
  const [open, setOpen] = useState(true); // 對話框的開啟狀態
  const router = useRouter(); // 使用 useRouter 進行路由導航

  useEffect(() => {
    // 在元件掛載後，如果對話框仍然開啟，則設定一個計時器
    if (open) {
      const timer = setTimeout(() => {
        // 關閉對話框並重定向到首頁
        setOpen(false);
        router.push("/"); // 導航到首頁
      }, 3000); // 3 秒後自動關閉對話框並重定向

      // 清除計時器，以防止記憶體洩漏
      return () => clearTimeout(timer);
    }
  }, [open, router]); // 依賴於 open 和 router

  const handleClose = () => {
    setOpen(false);
    router.push("/"); // 關閉對話框並導航到首頁
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Autopilot Carbon Footprint</h1>
      <ClimatiqCalculator initialTab="travel" />

      {/* 對話框 */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>API 金鑰仍在開發中</DialogTitle>
        <DialogContent>
          <DialogContentText>
            此頁面功能正在開發中，請稍後再試。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
