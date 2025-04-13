// src/app/layout.tsx
import { ReactNode } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/app/components/theme-provider";
import ClientLayout from "./ClientLayout";
import Header from "./components/ui_backup/Header";
import Footer from "./components/ui_backup/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "碳交易平台",
  description: "個人碳交易與管理平台",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
