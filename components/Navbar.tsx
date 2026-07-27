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
  Leaf,
} from "lucide-react";

type Language = "en" | "tw" | "dag";

const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  tw: "Twi",
  dag: "Dagbani",
};

/* NAVBAR TRANSLATIONS */
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

    const handleScroll = () => setScrolled(window.scrollY > 10);
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    setLoggedIn(false);
    setIsAdmin(false);
    setMobileOpen(false);
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
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌽</span>
              <div>
                <h1 className="text-lg font-bold text-green-700 dark:text-green-400 leading-tight">MaizeGuard</h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Smart Crop Diagnosis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="h-9 w-24 rounded-xl bg-green-600 animate-pulse" />
              <div className="h-9 w-20 rounded-xl bg-blue-600 animate-pulse" />
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm"
            : "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <span className="text-2xl">🌽</span>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-green-700 dark:text-green-400 leading-tight">
                  MaizeGuard
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  Smart Crop Diagnosis
                </p>
              </div>
            </Link>

            {/* ── Desktop Center Links ── */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950"
                        : "text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {nt(link.nameKey)}
                    {active && (
                      <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-green-600 dark:bg-green-400" />
                    )}
                  </Link>
                );
              })}
              {loggedIn && (
                <Link
                  href="/dashboard"
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/dashboard"
                      ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950"
                      : "text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {nt("dashboard")}
                  {pathname === "/dashboard" && (
                    <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-green-600 dark:bg-green-400" />
                  )}
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/admin"
                      ? "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950"
                      : "text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {nt("adminPanel")}
                  {pathname === "/admin" && (
                    <span className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                  )}
                </Link>
              )}
            </div>

            {/* ── Right Side Actions ── */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Language — icon only on small screens, text on lg+ */}
              <div className="relative" ref={langPickerRef}>
                <button
                  onClick={() => setShowLangPicker((v) => !v)}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2.5 py-2 text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                  aria-label="Select language"
                >
                  <Globe size={16} />
                  <span className="hidden lg:inline text-xs font-bold uppercase">{language}</span>
                  <ChevronDown size={14} className="hidden lg:block" />
                </button>

                {showLangPicker && (
                  <div className="absolute right-0 top-full mt-2 min-w-[160px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl z-50">
                    {(["en", "tw", "dag"] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLangSelect(lang)}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                          language === lang
                            ? "bg-green-50 dark:bg-green-950 font-semibold text-green-700 dark:text-green-400"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${
                          language === lang ? "bg-green-500" : "bg-slate-300 dark:bg-slate-500"
                        }`} />
                        <span className="w-6 text-xs font-bold uppercase">{lang}</span>
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
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Analyze Leaf — hidden on small mobile, compact on md */}
              <Link
                href="/detect"
                className={`hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white transition-colors ${
                  pathname === "/detect" ? "bg-green-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <Leaf size={16} className="lg:hidden" />
                <span className="hidden lg:inline">{nt("analyzeLeaf")}</span>
              </Link>

              {/* Login / Logout — hidden on small mobile */}
              {loggedIn ? (
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                >
                  <LogOut size={16} />
                  <span className="hidden lg:inline">{nt("logout")}</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <span className="hidden lg:inline">{nt("login")}</span>
                  <span className="lg:hidden">{nt("login").split(" ")[0]}</span>
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile Slide-out Menu ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl md:hidden flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-5 py-4">
              <span className="font-bold text-green-700 dark:text-green-400">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Panel links */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <LayoutDashboard size={16} />
                  {nt("dashboard")}
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pathname === "/admin"
                      ? "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Crown size={16} />
                  {nt("adminPanel")}
                </Link>
              )}

              <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

              <Link
                href="/detect"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === "/detect"
                    ? "bg-green-600 text-white"
                    : "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900"
                }`}
              >
                <Leaf size={16} />
                {nt("analyzeLeaf")}
              </Link>
            </div>

            {/* Panel footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-2">
              {loggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                >
                  <LogOut size={16} />
                  {nt("logout")}
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {nt("login")}
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
