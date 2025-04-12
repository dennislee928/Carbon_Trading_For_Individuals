// src/app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const footerLinks = [
    { name: "關於我們", href: "/about" },
    { name: "聯絡我們", href: "/contact" },
    { name: "隱私政策", href: "/privacy" },
    { name: "服務條款", href: "/terms" },
  ];

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Branding */}
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold">碳交易平台</p>
            <p className="text-sm">
              © {new Date().getFullYear()} 個人碳交易平台. 保留所有權利.
            </p>
          </div>

          {/* Links */}
          <div className="flex space-x-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm hover:text-green-400 transition"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
