"use client";

import React, { ReactNode } from "react";
import AppLayout from "../components/AppLayout";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}
