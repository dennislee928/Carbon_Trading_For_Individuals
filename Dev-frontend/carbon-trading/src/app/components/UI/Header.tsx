// src/app/components/Header.tsx
import Link from "next/link";

export default function Header() {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Freight", href: "/pages/Freight" },
    { name: "Travel", href: "/pages/Travel" },
    { name: "Energy", href: "/pages/Energy" },
    { name: "Computing", href: "/pages/Computing" },
    { name: "Procurement", href: "/pages/Procurement" },
    { name: "Custom Mappings", href: "/pages/CustomMappings" },
    { name: "CBAM", href: "/pages/CBAM" },
    { name: "Autopilot", href: "/pages/Autopilot" },
  ];

  return (
    <header className="bg-green-600 text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">
              Carbon Offset
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button (Placeholder) */}
          <div className="md:hidden">
            <button className="p-2 rounded-md hover:bg-green-700">
              {/* Add hamburger icon here if needed */}
              Menu
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
