// src/app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const footerLinks = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Branding */}
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold">Carbon Offset Platform</p>
            <p className="text-sm">
              © {new Date().getFullYear()} All rights reserved.
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
