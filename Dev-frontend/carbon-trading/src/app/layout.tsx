// src/app/layout.tsx
import { ReactNode } from "react";
import Header from "./components/UI/Header";
import Footer from "./components/UI/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
