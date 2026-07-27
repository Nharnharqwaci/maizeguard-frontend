"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import { useTheme } from "next-themes";
import {
  Shield,
  Users,
  ScanSearch,
  TrendingUp,
  Activity,
  Trash2,
  Search,
  BarChart3,
  PieChart,
  Clock,
  ChevronLeft,
  Crown,
  UserPlus,
  UserCheck,
  Leaf,
  RefreshCw,
  Globe,
  Calendar,
  X,
  Eye,
  Moon,
  Sun,
  ChevronDown,
  KeyRound,
  Copy,
  CheckCircle,
} from "lucide-react";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  adminPanel: { en: "Admin Panel", tw: "Admin Pɛnɛl", dag: "Kpamba Tuma Duu" },
  systemAnalytics: { en: "System Analytics", tw: "System Nhwehwɛmu", dag: "Tabibi Tuma Vihigu" },
  userManagement: { en: "User Management", tw: "Nnipa So Nhwɛso", dag: "Binyɛra Kpaŋsim" },
  scanManagement: { en: "Scan Management", tw: "Nhahan So Nhwɛso", dag: "Kparibɔ Kpaŋsim" },
  activityLog: { en: "Activity Log", tw: "Nneyɛe Nhoma", dag: "Tuuma Lahaba" },
  registerUser: { en: "Register User", tw: "Bue Adwumayɛfo Account", dag: "Kpaɣi Tumda" },

  totalUsers: { en: "Total Users", tw: "Nnipa Dodoɔ", dag: "Binyɛra Zaa" },
  totalFarmers: { en: "Total Farmers", tw: "Akuafo Dodoɔ", dag: "Tiŋda Zaa" },
  totalAdmins: { en: "Total Admins", tw: "Admin Dodoɔ", dag: "Admin Zaa" },
  totalScans: { en: "Total Scans", tw: "Nhaban Dodoɔ", dag: "Kparibɔ Zaa" },
  scansToday: { en: "Scans Today", tw: "Nhwehwɛmu a Yɛayɛ Nnɛ", dag: "Kparibɔ Dindali" },
  scansThisWeek: { en: "Scans This Week", tw: "Nhwehwɛmu a Yɛayɛ Dapɛn Yi Mu", dag: "Kparibɔ Yikum" },
  newUsersToday: { en: "New Users Today", tw: "Nnipa Foforo Ndɛ", dag: "Binyɛra Pampam" },
  avgScansPerUser: { en: "Avg Scans/User", tw: "Nhwehwɛmu Dodoɔ a Dwumadifoɔ Baako Yɛ.", dag: "Kparibɔ/Biniŋ" },

  diseaseBreakdown: { en: "Disease Breakdown", tw: "Yaree Mmɛbu", dag: "Yɛl' Kparibɔ Bu" },
  healthRate: { en: "Health Rate", tw: "Ahoɔden Rɛt", dag: "Sal' Kparibɔ" },
  healthy: { en: "Healthy", tw: "Apɔwmuden", dag: "Kpalim zaa" },
  diseased: { en: "Diseased", tw: "Yaree", dag: "Yɛl'" },

  languageDistribution: { en: "Language Distribution", tw: "Kasa Kyekyɛmu", dag: "Zulimi Kyekyɛmu" },
  mostUsedLanguage: { en: "Most Used", tw: "Kasa a Wɔde Di Dwuma", dag: "Zulimi din Yɛn" },

  monthlyGrowth: { en: "Monthly User Growth", tw: "Bosome Nnipa Dɔɔso", dag: "Dabisili Binyɛra Bɔbo" },
  scanTrends: { en: "Monthly Scan Trends", tw: "Bosome Nhwehwɛmu Kwan", dag: "Dabisili Kparibɔ Kpari" },
  dailyActivity: { en: "Daily Activity (30 Days)", tw: "Da Nneyɛe (30 Da)", dag: "Dindali Tuuma (30 Dabisili)" },

  name: { en: "Name", tw: "Din", dag: "Din" },
  phone: { en: "Phone", tw: "Telefon", dag: "Talifɔŋ" },
  role: { en: "Role", tw: "Dwuma", dag: "Tuuma" },
  scans: { en: "Scans", tw: "Nhwehwɛmu", dag: "Kparibɔ" },
  language: { en: "Language", tw: "Kasa", dag: "Zulimi" },
  lastActive: { en: "Last Active", tw: "Nnea Ɔyɛɛ Akyi", dag: "Din Daa Tuuma" },
  joined: { en: "Joined", tw: "Kɔɔ Mu", dag: "Dolli" },
  actions: { en: "Actions", tw: "Nneyɛe", dag: "Tuuma" },

  prediction: { en: "Prediction", tw: "Nkyerɛkyerɛ", dag: "N-nya" },
  confidence: { en: "Confidence", tw: "Ahotoso", dag: "Din Su" },
  severity: { en: "Severity", tw: "Yaree Mu Den", dag: "Yɛl' Biɛri" },
  user: { en: "User", tw: "Onipa", dag: "Biniŋ" },
  date: { en: "Date", tw: "Da", dag: "Dabisili" },

  delete: { en: "Delete", tw: "Pepa", dag: "Nyahi" },
  makeAdmin: { en: "Promote to Admin", tw: "Yɛ No Admin", dag: "Niŋ Admin" },
  makeFarmer: { en: "Demote to Farmer", tw: "Yɛ No Ɔkuafo", dag: "Niŋ Tiŋda" },
  viewScans: { en: "View Scans", tw: "Hwɛ Nhahan", dag: "Nya Kparibɔ" },

  registerNewUser: { en: "Register New User", tw: "Bue Onipa Foforo", dag: "Bɔ Biniŋ Pampam" },
  fullName: { en: "Full Name", tw: "Wo Din", dag: "Din Zaa" },
  phoneNumber: { en: "Phone Number", tw: "Telefon Nnɔmba", dag: "Talifɔŋ Namba" },
  password: { en: "Password", tw: "Paswɛde", dag: "Paswɛdi" },
  selectRole: { en: "Select Role", tw: "Paw Dwuma", dag: "Pi Tuuma" },
  farmer: { en: "Farmer", tw: "Ɔkuafo", dag: "Tiŋda" },
  admin: { en: "Admin", tw: "Admin", dag: "Admin" },
  registerBtn: { en: "Register", tw: "Bue", dag: "Bɔ" },
  cancel: { en: "Cancel", tw: "Gyae", dag: "Gyae" },

  scanned: { en: "scanned", tw: "hwehwɛɛ", dag: "kpari" },
  registered: { en: "registered", tw: "wɔ account", dag: "bɔ account" },

  searchUsers: { en: "Search users...", tw: "Hwehwɛ nnipa...", dag: "Vihimi binyɛra..." },
  filterByDisease: { en: "Filter by disease...", tw: "Yaree so filter...", dag: "Yɛl' so filter..." },
  all: { en: "All", tw: "Nyinaa", dag: "Zaa" },
  loading: { en: "Loading...", tw: "Ɛreloodo...", dag: "N-nyɛra..." },
  noUsers: { en: "No users found", tw: "Nnipa biara nni hɔ", dag: "Binyɛra bi paai" },
  noScans: { en: "No scans found", tw: "Nhwehwɛmu biara nni hɔ", dag: "Kparibɔ bi paai" },
  noActivity: { en: "No recent activity", tw: "Nneyɛe biara nni hɔ", dag: "Tuuma bi paai" },
  refresh: { en: "Refresh", tw: "San Hwɛ Mu", dag: "Lab'li" },
  prev: { en: "Previous", tw: "Ananmuso", dag: "Niŋa" },
  next: { en: "Next", tw: "Nea Edi Akyi", dag: "Pahi" },
  page: { en: "Page", tw: "Krataa", dag: "Page" },
  of: { en: "of", tw: "wɔ", dag: "wɔ" },
  accessDenied: { en: "Access Denied. Admin privileges required.", tw: "Wɔanka Kwan. Admin tumi na ɛhia.", dag: "Kpeema Biɛla. Admin tuhi n tiŋa." },
  backToDashboard: { en: "Back to Dashboard", tw: "San Kɔ Dasiboodu", dag: "Lab'li Dasiboodi" },
  mostActiveUser: { en: "Most Active User", tw: "Onipa a Ɔyɛ Adwuma", dag: "Biniŋ din Tuuma" },
  guestUser: { en: "Guest User", tw: "Ɔhɔhoɔ Dwumadifoɔ", dag: "Saan Tumda" },
  scansPerformed: { en: "scans performed", tw: "nhwehwɛmu a wɔayɛ", dag: "kparibɔ ni wɔ tuuli" },
  resetPassword: { en: "Reset Password", tw: "San To Paswɛde", dag: "Lab'li yɛltɔɣ' kpɛma" },
  passwordResetSuccess: { en: "Password reset! Temporary password copied.", tw: "Paswɛde asan! Wɔakɔpi paswɛde foforo.", dag: "Yɛltɔɣ' kpɛma lab'li! N-nyɛ copy." },
  tempPassword: { en: "Temporary Password", tw: "Paswɛde Foforo", dag: "Yɛltɔɣ' kpɛma pampam" },
  copy: { en: "Copy", tw: "Kɔpi", dag: "Copy" },
  close: { en: "Close", tw: "To mu", dag: "Toom" },
};
interface AnalyticsData {
  users: {
    total: number;
    farmers: number;
    admins: number;
    new_today: number;
    new_this_week: number;
    new_this_month: number;
    monthly_growth: { year: number; month: number; count: number }[];
  };
  scans: {
    total: number;
    today: number;
    this_week: number;
    this_month: number;
    avg_per_user: number;
    most_active_user: { user_id: string; name: string; scan_count: number } | null;
    monthly_trends: { year: number; month: number; count: number }[];
    daily_activity: { date: string; count: number }[];
  };
  diseases: {
    breakdown: Record<string, number>;
    healthy_count: number;
    disease_count: number;
    health_rate: number;
  };
  languages: Record<string, number>;
}

interface User {
  id: string;
  full_name: string;
  phone_number: string;
  role: string;
  created_at: string;
  scan_count: number;
  language: string;
  last_active: string;
}

interface Scan {
  id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  prediction: string;
  confidence: number;
  severity: string;
  lang: string;
  created_at: string;
}

interface ActivityItem {
  type: string;
  id: string;
  user_id?: string;
  user_name: string;
  user_phone?: string;
  prediction?: string;
  confidence?: number;
  severity?: string;
  lang?: string;
  role?: string;
  created_at: string;
}

const predictionColors: Record<string, string> = {
  Common_Rust: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
  Gray_Leaf_Spot: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  Healthy: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  MSV: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  Northern_Leaf_Blight: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
  Southern_Leaf_Blight: "bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300",
  Uncertain: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
};

const severityStyles: Record<string, string> = {
  critical: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  high: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
  medium: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
  low: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  none: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
};

const langLabels: Record<string, string> = {
  en: "English",
  tw: "Twi",
  dag: "Dagbani",
};

const langFlags: Record<string, string> = {
  en: "🇬🇧",
  tw: "🇬🇭",
  dag: "🇬🇭",
};

function formatDate(isoString: string): string {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function timeAgo(isoString: string): string {
  if (!isoString) return "—";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function monthName(year: number, month: number): string {
  return new Date(year, month - 1).toLocaleString("en", { month: "short", year: "numeric" });
}

function displayName(name: string, tFn?: (k: string) => string): string {
  if (!name || name === "Unknown" || name === "Guest User") {
    return tFn ? tFn("guestUser") : "Guest User";
  }
  return name;
}
export default function AdminPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(0);
  const [usersSearch, setUsersSearch] = useState("");
  const [usersSearchInput, setUsersSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [usersLoading, setUsersLoading] = useState(false);

  const [scans, setScans] = useState<Scan[]>([]);
  const [scansTotal, setScansTotal] = useState(0);
  const [scansPage, setScansPage] = useState(0);
  const [scansFilter, setScansFilter] = useState("all");
  const [scansLoading, setScansLoading] = useState(false);

  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"analytics" | "users" | "scans" | "activity">("analytics");

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    full_name: "", phone_number: "", password: "", role: "farmer"
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [userScans, setUserScans] = useState<any[]>([]);
  const [userScansLoading, setUserScansLoading] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUserName, setResetUserName] = useState("");
  const [resetTempPassword, setResetTempPassword] = useState("");
  const [resetCopied, setResetCopied] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const langPickerRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => T[key]?.[language] ?? key;
  const pageSize = 10;

  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    setMounted(true);
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

  useEffect(() => {
    const savedLang = localStorage.getItem("chat_language") as Language | null;
    if (savedLang && ["en", "tw", "dag"].includes(savedLang)) setLanguage(savedLang);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_role");
    if (!token) { router.push("/login"); return; }
    if (role !== "admin") { setCheckingAuth(false); return; }

    setIsAdmin(true);
    setCheckingAuth(false);
  }, [router]);

  const loadAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const tk = encodeURIComponent(getToken());
      const res = await api.get(`/api/admin/analytics?token=${tk}`);
      setAnalytics(res.data);
    } catch (e) { console.error("Analytics error:", e); }
    finally { setAnalyticsLoading(false); }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const tk = encodeURIComponent(getToken());
      const res = await api.get(
        `/api/admin/users?token=${tk}&skip=${usersPage * pageSize}&limit=${pageSize}&search=${encodeURIComponent(usersSearch)}&role_filter=${roleFilter}`
      );
      setUsers(res.data.users);
      setUsersTotal(res.data.total);
    } catch (e) { console.error("Users error:", e); }
    finally { setUsersLoading(false); }
  }, [usersPage, usersSearch, roleFilter]);

  const loadScans = useCallback(async () => {
    try {
      setScansLoading(true);
      const tk = encodeURIComponent(getToken());
      const res = await api.get(
        `/api/admin/scans?token=${tk}&skip=${scansPage * pageSize}&limit=${pageSize}&prediction=${scansFilter}`
      );
      setScans(res.data.scans);
      setScansTotal(res.data.total);
    } catch (e) { console.error("Scans error:", e); }
    finally { setScansLoading(false); }
  }, [scansPage, scansFilter]);

  const loadActivity = useCallback(async () => {
    try {
      setActivityLoading(true);
      const tk = encodeURIComponent(getToken());
      const res = await api.get(`/api/admin/activity?token=${tk}&limit=30`);
      setActivity(res.data.activity);
    } catch (e) { console.error("Activity error:", e); }
    finally { setActivityLoading(false); }
  }, []);

  useEffect(() => {
    if (isAdmin && !checkingAuth) loadAnalytics();
  }, [isAdmin, checkingAuth, loadAnalytics]);

  useEffect(() => {
    if (isAdmin && !checkingAuth && activeTab === "users") loadUsers();
  }, [isAdmin, checkingAuth, activeTab, loadUsers]);

  useEffect(() => {
    if (isAdmin && !checkingAuth && activeTab === "scans") loadScans();
  }, [isAdmin, checkingAuth, activeTab, loadScans]);

  useEffect(() => {
    if (isAdmin && !checkingAuth && activeTab === "activity") loadActivity();
  }, [isAdmin, checkingAuth, activeTab, loadActivity]);

  const handleRefresh = () => {
    loadAnalytics();
    if (activeTab === "users") loadUsers();
    if (activeTab === "scans") loadScans();
    if (activeTab === "activity") loadActivity();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Delete this user and ALL their scans?")) return;
    try {
      const tk = encodeURIComponent(getToken());
      await api.delete(`/api/admin/users/${userId}?token=${tk}`);
      loadUsers(); loadAnalytics(); loadActivity();
    } catch (e) { console.error(e); }
  };

  const handleDeleteScan = async (scanId: string) => {
    if (!confirm("Delete this scan?")) return;
    try {
      const tk = encodeURIComponent(getToken());
      await api.delete(`/api/admin/scans/${scanId}?token=${tk}`);
      loadScans(); loadAnalytics(); loadActivity();
    } catch (e) { console.error(e); }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const tk = encodeURIComponent(getToken());
      await api.post(`/api/admin/users/${userId}/role?token=${tk}`, { role: newRole });
      loadUsers(); loadAnalytics();
    } catch (e) { console.error(e); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      const tk = encodeURIComponent(getToken());
      await api.post(`/api/admin/users/register?token=${tk}`, registerForm);
      setShowRegisterModal(false);
      setRegisterForm({ full_name: "", phone_number: "", password: "", role: "farmer" });
      loadUsers(); loadAnalytics(); loadActivity();
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Registration failed");
    } finally { setRegisterLoading(false); }
  };

  const handleViewUserScans = async (userId: string) => {
    setViewUserId(userId);
    setUserScansLoading(true);
    try {
      const tk = encodeURIComponent(getToken());
      const res = await api.get(`/api/admin/user/${userId}/scans?token=${tk}`);
      setUserScans(res.data.scans);
    } catch (e) { console.error(e); }
    finally { setUserScansLoading(false); }
  };

  const handleResetPassword = async (userId: string, userName: string) => {
    try {
      const tk = encodeURIComponent(getToken());
      const res = await api.post(`/api/admin/users/${userId}/reset-password?token=${tk}`);
      setResetUserName(userName);
      setResetTempPassword(res.data.temp_password);
      setShowResetModal(true);
      setResetCopied(false);
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Password reset failed");
    }
  };

  const handleCopyResetPassword = () => {
    navigator.clipboard.writeText(resetTempPassword);
    setResetCopied(true);
    setTimeout(() => setResetCopied(false), 2000);
  };

  const diseaseOptions = ["all", "Healthy", "Common_Rust", "Gray_Leaf_Spot", "MSV", "Northern_Leaf_Blight", "Southern_Leaf_Blight", "Uncertain"];

  if (!mounted || checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {t("loading")}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <Shield size={64} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">{t("accessDenied")}</h1>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            <ChevronLeft size={18} /> {t("backToDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-slate-900 dark:bg-slate-950 border-b border-slate-800 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <Crown size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{t("adminPanel")}</h1>
                <p className="text-xs text-slate-400">MaizeAI System Control</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative" ref={langPickerRef}>
                <button
                  onClick={() => setShowLangPicker((v) => !v)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl transition-colors text-sm font-medium border border-slate-700"
                >
                  <Globe size={14} />
                  <span className="uppercase text-xs font-bold">{language}</span>
                  <ChevronDown size={12} />
                </button>
                {showLangPicker && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1.5 z-50 min-w-[160px] overflow-hidden">
                    {(["en", "tw", "dag"] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          localStorage.setItem("chat_language", lang);
                          setShowLangPicker(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 ${
                          language === lang
                            ? "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 font-semibold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          language === lang ? "bg-purple-500" : "bg-slate-300 dark:bg-slate-500"
                        }`} />
                        <span className="uppercase font-bold text-xs w-6">{lang}</span>
                        {lang === "en" ? "English" : lang === "tw" ? "Twi" : "Dagbani"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-colors"
                title="Toggle dark mode"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-colors">
                <RefreshCw size={14} /> {t("refresh")}
              </button>
              <button onClick={() => setShowRegisterModal(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm transition-colors">
                <UserPlus size={14} /> {t("registerUser")}
              </button>
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm transition-colors">
                <ChevronLeft size={14} /> {t("backToDashboard")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(["analytics", "users", "scans", "activity"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab ? "border-purple-500 text-purple-600 dark:text-purple-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}>
                {tab === "analytics" && t("systemAnalytics")}
                {tab === "users" && t("userManagement")}
                {tab === "scans" && t("scanManagement")}
                {tab === "activity" && t("activityLog")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: t("totalUsers"), value: analytics?.users.total ?? 0, icon: Users, color: "blue" },
                { label: t("totalFarmers"), value: analytics?.users.farmers ?? 0, icon: Leaf, color: "green" },
                { label: t("totalAdmins"), value: analytics?.users.admins ?? 0, icon: Crown, color: "purple" },
                { label: t("totalScans"), value: analytics?.scans.total ?? 0, icon: ScanSearch, color: "orange" },
                { label: t("scansToday"), value: analytics?.scans.today ?? 0, icon: Activity, color: "red" },
                { label: t("scansThisWeek"), value: analytics?.scans.this_week ?? 0, icon: Calendar, color: "amber" },
                { label: t("newUsersToday"), value: analytics?.users.new_today ?? 0, icon: UserPlus, color: "teal" },
                { label: t("avgScansPerUser"), value: analytics?.scans.avg_per_user ?? 0, icon: TrendingUp, color: "indigo" },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg flex items-center justify-center`}>
                      <stat.icon size={18} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {analyticsLoading ? "—" : stat.value}
                  </p>
                </div>
              ))}
            </div>

            {analytics?.scans.most_active_user && (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Crown size={20} />
                  <span className="font-semibold">{t("mostActiveUser")}</span>
                </div>
                <p className="text-3xl font-bold">
                  {displayName(analytics.scans.most_active_user.name, t)}
                </p>
                <p className="text-purple-200 text-sm mt-1">
                  {analytics.scans.most_active_user.scan_count} {t("scansPerformed")}
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart size={18} className="text-purple-600" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-50">{t("diseaseBreakdown")}</h3>
                </div>
                {analyticsLoading ? <p className="text-slate-400 text-sm">{t("loading")}</p> : (
                  <div className="space-y-2">
                    {Object.entries(analytics?.diseases.breakdown ?? {})
                      .sort(([, a], [, b]) => b - a)
                      .map(([disease, count]) => {
                        const total = analytics?.scans.total || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={disease} className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${predictionColors[disease] ?? ""}`}>
                              {disease.replace(/_/g, " ")}
                            </span>
                            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 w-8 text-right">{count}</span>
                          </div>
                        );
                      })}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs">
                      <span className="text-green-600 dark:text-green-400">{t("healthy")}: {analytics?.diseases.healthy_count}</span>
                      <span className="text-red-600 dark:text-red-400">{t("diseased")}: {analytics?.diseases.disease_count}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={18} className="text-blue-600" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-50">{t("languageDistribution")}</h3>
                </div>
                {analyticsLoading ? <p className="text-slate-400 text-sm">{t("loading")}</p> : (
                  <div className="space-y-3">
                    {Object.entries(analytics?.languages ?? {})
                      .sort(([, a], [, b]) => b - a)
                      .map(([lang, count]) => {
                        const total = Object.values(analytics?.languages ?? {}).reduce((a, b) => a + b, 0) || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={lang} className="flex items-center gap-3">
                            <span className="text-lg">{langFlags[lang] ?? "🌐"}</span>
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{langLabels[lang] ?? lang}</span>
                                <span className="text-slate-500">{pct}%</span>
                              </div>
                              <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-6 text-right">{count}</span>
                          </div>
                        );
                      })}
                    {Object.keys(analytics?.languages ?? {}).length === 0 && (
                      <p className="text-slate-400 text-sm text-center py-4">No language data yet</p>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={18} className="text-green-600" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-50">{t("healthRate")}</h3>
                </div>
                {analyticsLoading ? <p className="text-slate-400 text-sm">{t("loading")}</p> : (
                  <div className="text-center py-4">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-green-500" strokeDasharray={`${analytics?.diseases.health_rate ?? 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">{analytics?.diseases.health_rate ?? 0}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {analytics?.diseases.healthy_count ?? 0} healthy / {analytics?.diseases.disease_count ?? 0} diseased
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-blue-600" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-50">{t("monthlyGrowth")}</h3>
                </div>
                {analyticsLoading ? <p className="text-slate-400">{t("loading")}</p> : (
                  <div className="space-y-2">
                    {analytics?.users.monthly_growth.map((m) => (
                      <div key={`${m.year}-${m.month}`} className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 w-16">{monthName(m.year, m.month)}</span>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                          <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(100, m.count * 5)}%` }} />
                        </div>
                        <span className="text-xs font-bold w-6 text-right">{m.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={18} className="text-green-600" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-50">{t("scanTrends")}</h3>
                </div>
                {analyticsLoading ? <p className="text-slate-400">{t("loading")}</p> : (
                  <div className="space-y-2">
                    {analytics?.scans.monthly_trends.map((m) => (
                      <div key={`${m.year}-${m.month}`} className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 w-16">{monthName(m.year, m.month)}</span>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                          <div className="h-2 rounded-full bg-green-500" style={{ width: `${Math.min(100, m.count * 2)}%` }} />
                        </div>
                        <span className="text-xs font-bold w-6 text-right">{m.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={18} className="text-orange-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-50">{t("dailyActivity")}</h3>
              </div>
              {analyticsLoading ? <p className="text-slate-400">{t("loading")}</p> : (
                <div className="flex items-end gap-1 h-32 overflow-x-auto">
                  {analytics?.scans.daily_activity.map((d) => {
                    const maxCount = Math.max(...(analytics?.scans.daily_activity.map(x => x.count) ?? [1]), 1);
                    const height = Math.max(4, (d.count / maxCount) * 100);
                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-1 min-w-[20px]">
                        <div className="w-full bg-orange-200 dark:bg-orange-900 rounded-t" style={{ height: `${height}%` }} />
                        <span className="text-[8px] text-slate-400 rotate-0">{d.date.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{t("userManagement")}</h2>
                <div className="flex items-center gap-3">
                  <select
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value); setUsersPage(0); }}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-50"
                  >
                    <option value="all">{t("all")}</option>
                    <option value="farmer">{t("farmer")}</option>
                    <option value="admin">{t("admin")}</option>
                  </select>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder={t("searchUsers")}
                      value={usersSearchInput}
                      onChange={(e) => setUsersSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setUsersPage(0);
                          setUsersSearch(usersSearchInput);
                        }
                      }}
                      className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm w-56 text-slate-900 dark:text-slate-50"
                    />
                  </div>
                </div>
              </div>
            </div>
            {usersLoading ? (
              <div className="p-8 text-center text-slate-400">{t("loading")}</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-slate-400">{t("noUsers")}</div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("name")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("phone")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("role")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("scans")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("language")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("lastActive")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("joined")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${user.role === "admin" ? "bg-purple-100 dark:bg-purple-900 text-purple-700" : "bg-green-100 dark:bg-green-900 text-green-700"}`}>
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-50">{user.full_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{user.phone_number}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-purple-100 dark:bg-purple-900 text-purple-700" : "bg-green-100 dark:bg-green-900 text-green-700"}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{user.scan_count}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-sm">
                            <span>{langFlags[user.language] ?? "🌐"}</span>
                            <span className="text-slate-600 dark:text-slate-300">{langLabels[user.language] ?? user.language}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{timeAgo(user.last_active)}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{formatDate(user.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleViewUserScans(user.id)} className="p-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800" title="View Scans">
                              <Eye size={13} />
                            </button>
                            {user.role === "farmer" ? (
                              <button onClick={() => handleUpdateRole(user.id, "admin")} className="p-1.5 bg-purple-100 dark:bg-purple-900 text-purple-600 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800" title={t("makeAdmin")}>
                                <Crown size={13} />
                              </button>
                            ) : (
                              <button onClick={() => handleUpdateRole(user.id, "farmer")} className="p-1.5 bg-green-100 dark:bg-green-900 text-green-600 rounded-lg hover:bg-green-200 dark:hover:bg-green-800" title={t("makeFarmer")}>
                                <Leaf size={13} />
                              </button>
                            )}
                            <button onClick={() => handleResetPassword(user.id, user.full_name)} className="p-1.5 bg-amber-100 dark:bg-amber-900 text-amber-600 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800" title={t("resetPassword")}>
                              <KeyRound size={13} />
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 bg-red-100 dark:bg-red-900 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-800" title={t("delete")}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-500">{t("page")} {usersPage + 1} {t("of")} {Math.ceil(usersTotal / pageSize)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setUsersPage(Math.max(0, usersPage - 1))} disabled={usersPage === 0} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">{t("prev")}</button>
                    <button onClick={() => setUsersPage(usersPage + 1)} disabled={(usersPage + 1) * pageSize >= usersTotal} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">{t("next")}</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === "scans" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{t("scanManagement")}</h2>
                <select
                  value={scansFilter}
                  onChange={(e) => { setScansFilter(e.target.value); setScansPage(0); }}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-50"
                >
                  {diseaseOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt === "all" ? t("all") : opt.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
            </div>
            {scansLoading ? (
              <div className="p-8 text-center text-slate-400">{t("loading")}</div>
            ) : scans.length === 0 ? (
              <div className="p-8 text-center text-slate-400">{t("noScans")}</div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("prediction")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("confidence")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("severity")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("user")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("language")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("date")}</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scans.map((scan) => (
                      <tr key={scan.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${predictionColors[scan.prediction] ?? ""}`}>
                            {scan.prediction.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-14 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${scan.confidence}%` }} />
                            </div>
                            <span className="text-xs font-semibold">{scan.confidence}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${severityStyles[scan.severity] ?? severityStyles.low}`}>
                            {scan.severity === "none" ? "healthy" : scan.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{displayName(scan.user_name, t)}</p>
                            <p className="text-[10px] text-slate-400">{scan.user_phone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{langFlags[scan.lang] ?? "🌐"} {langLabels[scan.lang] ?? scan.lang}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{formatDate(scan.created_at)}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteScan(scan.id)} className="p-1.5 bg-red-100 dark:bg-red-900 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-800">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-500">{t("page")} {scansPage + 1} {t("of")} {Math.ceil(scansTotal / pageSize)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setScansPage(Math.max(0, scansPage - 1))} disabled={scansPage === 0} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">{t("prev")}</button>
                    <button onClick={() => setScansPage(scansPage + 1)} disabled={(scansPage + 1) * pageSize >= scansTotal} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">{t("next")}</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock size={20} className="text-purple-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{t("activityLog")}</h2>
            </div>
            {activityLoading ? (
              <div className="text-center text-slate-400 py-8">{t("loading")}</div>
            ) : activity.length === 0 ? (
              <div className="text-center text-slate-400 py-8">{t("noActivity")}</div>
            ) : (
              <div className="space-y-3">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === "scan" ? "bg-green-100 dark:bg-green-900" : "bg-blue-100 dark:bg-blue-900"}`}>
                      {item.type === "scan" ? <ScanSearch size={18} className="text-green-600" /> : <UserCheck size={18} className="text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-slate-50">
                        {item.type === "scan" ? (
                          <>
                            <span className="font-semibold">{displayName(item.user_name, t)}</span> {t("scanned")}{" "}
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${predictionColors[item.prediction || ""] ?? ""}`}>
                              {(item.prediction || "").replace(/_/g, " ")}
                            </span>
                            {item.lang && <span className="ml-1 text-xs text-slate-400">({langLabels[item.lang] ?? item.lang})</span>}
                          </>
                        ) : (
                          <>
                            <span className="font-semibold">{displayName(item.user_name, t)}</span> {t("registered")}
                            {item.role && <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${item.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>{item.role}</span>}
                          </>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{timeAgo(item.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{t("registerNewUser")}</h3>
              <button onClick={() => setShowRegisterModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("fullName")}</label>
                <input type="text" required value={registerForm.full_name} onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("phoneNumber")}</label>
                <input type="tel" required value={registerForm.phone_number} onChange={(e) => setRegisterForm({ ...registerForm, phone_number: e.target.value })} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("password")}</label>
                <input type="password" required value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("selectRole")}</label>
                <select value={registerForm.role} onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50">
                  <option value="farmer">{t("farmer")}</option>
                  <option value="admin">{t("admin")}</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowRegisterModal(false)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-50">
                  {t("cancel")}
                </button>
                <button type="submit" disabled={registerLoading} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium disabled:opacity-50">
                  {registerLoading ? "..." : t("registerBtn")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{t("resetPassword")}</h3>
              <button onClick={() => setShowResetModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("passwordResetSuccess")}
              </p>
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wider mb-1">{t("tempPassword")}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-lg font-mono font-bold text-amber-800 dark:text-amber-300 tracking-wider">
                    {resetTempPassword}
                  </code>
                  <button
                    onClick={handleCopyResetPassword}
                    className="p-2 bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-lg transition-colors"
                    title={t("copy")}
                  >
                    {resetCopied ? <CheckCircle size={16} className="text-green-600" /> : <Copy size={16} className="text-amber-600 dark:text-amber-400" />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                User: <span className="font-semibold text-slate-600 dark:text-slate-300">{resetUserName}</span>
              </p>
              <button
                onClick={() => setShowResetModal(false)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-xl font-medium transition-colors"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Scans Modal */}
      {viewUserId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">User Scan History</h3>
              <button onClick={() => { setViewUserId(null); setUserScans([]); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            {userScansLoading ? (
              <p className="text-center text-slate-400 py-8">{t("loading")}</p>
            ) : userScans.length === 0 ? (
              <p className="text-center text-slate-400 py-8">No scans for this user</p>
            ) : (
              <div className="space-y-3">
                {userScans.map((scan: any) => (
                  <div key={scan.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${predictionColors[scan.prediction] ?? ""}`}>
                      {scan.prediction.replace(/_/g, " ")}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${scan.confidence}%` }} />
                        </div>
                        <span className="text-xs font-semibold">{scan.confidence}%</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{formatDate(scan.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}