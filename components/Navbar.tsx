"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    setLoggedIn(false);
    router.push("/login");
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Treatments", href: "/treatments" },
    { name: "About", href: "/about" },
  ];

  // always render a plain white navbar before hydration
  // this prevents the flash of wrong theme
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <nav className="max-w-7xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌽</span>
              <div>
                <h1 className="font-bold text-green-700">MaizeAI</h1>
                <p className="text-xs text-slate-500">Smart Crop Diagnosis</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200" />
              <div className="w-28 h-9 rounded-xl bg-green-600" />
              <div className="w-16 h-9 rounded-xl bg-blue-600" />
            </div>
          </div>
        </nav>
      </header>
    );
  }

  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors duration-200">
      <nav className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌽</span>
            <div>
              <h1 className="font-bold text-green-700 dark:text-green-400">
                MaizeAI
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart Crop Diagnosis
              </p>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative py-2"
                >
                  <span
                    className={
                      active
                        ? "font-semibold text-green-700 dark:text-green-400"
                        : "text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                    }
                  >
                    {link.name}
                  </span>
                  {active && (
                    <span className="absolute left-0 bottom-[-6px] h-[3px] w-full rounded-full bg-green-600 dark:bg-green-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Analyze Leaf */}
            <Link
              href="/detect"
              className={`px-5 py-2.5 rounded-xl text-white font-medium transition-colors duration-200 ${
                pathname === "/detect"
                  ? "bg-green-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Analyze Leaf
            </Link>

            {/* Login / Logout */}
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors duration-200"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
}