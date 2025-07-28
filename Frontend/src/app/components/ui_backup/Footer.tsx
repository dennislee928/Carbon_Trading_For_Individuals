// src/app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © 2023 個人碳交易平台. 保留所有權利.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link
          href="/about"
          className="text-xs hover:underline underline-offset-4"
        >
          關於我們
        </Link>
        <Link
          href="/privacy"
          className="text-xs hover:underline underline-offset-4"
        >
          隱私政策
        </Link>
        <Link
          href="/terms"
          className="text-xs hover:underline underline-offset-4"
        >
          使用條款
        </Link>
      </nav>
    </footer>
  );
}
