"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Globe,
  ChevronDown,
  Crown,
  Menu,
  X,
} from "lucide-react";

type Language = "en" | "tw" | "dag";

const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  tw: "Twi",
  dag: "Dagbani",
};

/* NAVBAR TRANSLATIONS  */
const NAV_T: Record<string, Record<Language, string>> = {
  home: { en: "Home", tw: "Fie", dag: "Yiŋa" },
  treatments: { en: "Treatments", tw: "Ayaresadeɛ", dag: "Tibbu" },
  about: { en: "About", tw: "Ho Nsɛm", dag: "Ti yɛla'" },
  dashboard: { en: "Dashboard", tw: "Dasiboodu", dag: "Dasiboodi" },
  analyzeLeaf: { en: "Analyze Leaf", tw: "Hwehwɛ Nhaban Mu", dag: "Vihi vaɣu" },
  login: { en: "Login", tw: "Kɔ Mu", dag: "Kpɛm kpɛlo" },
  logout: { en: "Logout", tw: "Fi Mu", dag: "Yim kpɛlo" },
  adminPanel: { en: "Admin Panel", tw: "Admin Pɛnɛl", dag: "Kpamba Tuma Duu" },
};

interface NavbarProps {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export default function Navbar({ language = "en", onLanguageChange }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
    const role = localStorage.getItem("user_role");
    setIsAdmin(role === "admin");

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langPickerRef.current && !langPickerRef.current.contains(e.target as Node)) {
        setShowLangPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    setLoggedIn(false);
    setIsAdmin(false);
    router.push("/login");
  };

  const handleLangSelect = (lang: Language) => {
    onLanguageChange?.(lang);
    setShowLangPicker(false);
  };

  const isDark = theme === "dark";
  const nt = (key: string) => NAV_T[key]?.[language] ?? key;

  const links = [
    { nameKey: "home", href: "/" },
    { nameKey: "treatments", href: "/treatments" },
    { nameKey: "about", href: "/about" },
  ];

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:bg-slate-900">
        <nav className="max-w-7xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌽</span>
              <div>
                <h1 className="font-bold text-green-700 dark:text-green-400">MaizeAI</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Smart Crop Diagnosis</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              <div className="w-28 h-9 rounded-xl bg-green-600" />
              <div className="w-16 h-9 rounded-xl bg-blue-600" />
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm"
          : "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌽</span>
            <div>
              <h1 className="font-bold text-green-700 dark:text-green-400">MaizeGuide</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Smart Crop Diagnosis</p>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className="relative py-2">
                  <span
                    className={
                      active
                        ? "font-semibold text-green-700 dark:text-green-400"
                        : "text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                    }
                  >
                    {nt(link.nameKey)}
                  </span>
                  {active && (
                    <span className="absolute left-0 bottom-[-6px] h-[3px] w-full rounded-full bg-green-600 dark:bg-green-400" />
                  )}
                </Link>
              );
            })}

            {/* Dashboard link — only visible when logged in */}
            {loggedIn && (
              <Link href="/dashboard" className="relative py-2">
                <span
                  className={
                    pathname === "/dashboard"
                      ? "font-semibold text-green-700 dark:text-green-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                  }
                >
                  {nt("dashboard")}
                </span>
                {pathname === "/dashboard" && (
                  <span className="absolute left-0 bottom-[-6px] h-[3px] w-full rounded-full bg-green-600 dark:bg-green-400" />
                )}
              </Link>
            )}

            {/* Admin Panel link — only visible for admins */}
            {isAdmin && (
              <Link href="/admin" className="relative py-2">
                <span
                  className={
                    pathname === "/admin"
                      ? "font-semibold text-purple-700 dark:text-purple-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
                  }
                >
                  {nt("adminPanel")}
                </span>
                {pathname === "/admin" && (
                  <span className="absolute left-0 bottom-[-6px] h-[3px] w-full rounded-full bg-purple-600 dark:bg-purple-400" />
                )}
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Language Selector */}
            <div className="relative" ref={langPickerRef}>
              <button
                onClick={() => setShowLangPicker((v) => !v)}
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl transition-colors text-sm font-medium border border-slate-200 dark:border-slate-700"
              >
                <Globe size={16} />
                <span className="uppercase text-xs font-bold">{language}</span>
                <ChevronDown size={14} />
              </button>

              {showLangPicker && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1.5 z-50 min-w-[160px] overflow-hidden">
                  {(["en", "tw", "dag"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLangSelect(lang)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 ${
                        language === lang
                          ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        language === lang ? "bg-green-500" : "bg-slate-300 dark:bg-slate-500"
                      }`} />
                      <span className="uppercase font-bold text-xs w-6">{lang}</span>
                      {LANGUAGE_LABELS[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Dashboard button (mobile / compact, icon-only) */}
            {loggedIn && (
              <Link
                href="/dashboard"
                aria-label="Go to dashboard"
                className={`md:hidden p-2 rounded-xl border transition-colors duration-200 ${
                  pathname === "/dashboard"
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <LayoutDashboard size={18} />
              </Link>
            )}

            {/* Admin button */}
            {isAdmin && (
              <Link
                href="/admin"
                aria-label="Go to admin panel"
                className={`md:hidden p-2 rounded-xl border transition-colors duration-200 ${
                  pathname === "/admin"
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Crown size={18} />
              </Link>
            )}

            {/* Analyze Leaf */}
            <Link
              href="/detect"
              className={`px-5 py-2.5 rounded-xl text-white font-medium transition-colors duration-200 ${
                pathname === "/detect"
                  ? "bg-green-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {nt("analyzeLeaf")}
            </Link>

            {/* Login / Logout */}
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors duration-200"
              >
                <LogOut size={18} />
                {nt("logout")}
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
              >
                {nt("login")}
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {nt(link.nameKey)}
              </Link>
            );
          })}
          {loggedIn && (
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {nt("dashboard")}
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/admin"
                  ? "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {nt("adminPanel")}
            </Link>
          )}
          {loggedIn ? (
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              {nt("logout")}
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            >
              {nt("login")}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
