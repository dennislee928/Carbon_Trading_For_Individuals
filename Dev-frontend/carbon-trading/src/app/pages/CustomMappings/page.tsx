// src/app/pages/Travel.tsx
import ClimatiqCalculator from "@/app/components/Calculator";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function CustomMappingsPage() {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false);
        router.push("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open, router]);

  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">
        CustomMappings Carbon Footprint
      </h1>
      <ClimatiqCalculator initialTab="CustomMappings" />

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
