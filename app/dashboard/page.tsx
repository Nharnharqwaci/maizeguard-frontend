"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import api from "@/services/api";
import AgricChatbot from "@/components/AgricChatbot";
import {
  Leaf,
  ScanSearch,
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
  Clock,
  BarChart3,
} from "lucide-react";

interface Scan {
  _id: string;
  prediction: string;
  confidence: number;
  severity: string;
  created_at: string;
}

interface DashboardStats {
  total_scans: number;
  disease_cases: number;
  healthy_count: number;
  disease_breakdown: Record<string, number>;
  recent_scans: Scan[];
  last_scan: string | null;
}

type Language = "en" | "tw" | "dag";

/* TRANSLATION DICTIONARY  */

const T: Record<string, Record<Language, string>> = {
  greeting: {
    en: "Welcome",
    tw: "Akwaaba",
    dag: "Kpanaa",
  },
  subtitle: {
    en: "Monitor crop health, review disease reports, and track treatments.",
    tw: "Hwɛ wo nhahan ho, hunu yaree ho nsɛm, ne nkyerɛkyerɛmu.",
    dag: "Kpɛma a kpamli, kparibɔ yɛl', ni kyaŋsim.",
  },
  lastScan: {
    en: "Last scan:",
    tw: "Nhahan a etwa so:",
    dag: "Kparibɔ din daa:",
  },
  totalScans: {
    en: "Total Scans",
    tw: "Nhahan Nyinaa",
    dag: "Kparibɔ Zaa",
  },
  diseasesFound: {
    en: "Diseases Found",
    tw: "Yaree a Wohunuu",
    dag: "Kparibɔ Yɛl' Shɛli",
  },
  healthyScans: {
    en: "Healthy Scans",
    tw: "Nhahan a Ahoɔden Wɔ Mu",
    dag: "Kparibɔ Sal' Shɛli",
  },
  healthRate: {
    en: "Health Rate",
    tw: "Ahoɔden Rɛt",
    dag: "Sal' Kparibɔ",
  },
  diseaseBreakdown: {
    en: "Disease Breakdown",
    tw: "Yaree Mmɛbu",
    dag: "Yɛl' Kparibɔ Bu",
  },
  loading: {
    en: "Loading...",
    tw: "Ɛreloodo...",
    dag: "N-nyɛra...",
  },
  noScansYetBreakdown: {
    en: "No scans yet — analyze your first leaf to see data here.",
    tw: "Nhahan biara nni hɔ bio — san wo nhahan a edi kan sɛ wo bɛhunu data.",
    dag: "Kparibɔ bi paai — di a kpamli a dundɔŋ ŋɔ n-ti a nya data.",
  },
  quickActions: {
    en: "Quick Actions",
    tw: "Nneyɛe a Ɛyɛ Ntɛm",
    dag: "Tuun' Tuuma",
  },
  analyzeLeafTitle: {
    en: "Analyze a Leaf",
    tw: "Hwehwɛ Ahaban Mu",
    dag: "Kpɛma Kpamli",
  },
  analyzeLeafDesc: {
    en: "Upload a maize leaf for instant diagnosis",
    tw: "Fa aburow ahaban bi gu so na ama woahu yare no ntɛm ara",
    dag: "Zaŋ maize kpamli n-ti kpɛma n-nya yɛl'",
  },
  treatmentGuide: {
    en: "Treatment Guide",
    tw: "Nkyerɛkyerɛmu",
    dag: "Kyaŋsim",
  },
  treatmentGuideDesc: {
    en: "View disease management recommendations",
    tw: "Hwɛ yaree kwan a wɔfa so di no so",
    dag: "Nya yɛl' kyaŋsim",
  },
  aboutMaizeAI: {
    en: "About MaizeAI",
    tw: "MaizeAI Ho Nsɛm",
    dag: "MaizeAI Yɛl'",
  },
  aboutMaizeAIDesc: {
    en: "Learn how the system works",
    tw: "Sua sɛnea afiri no di dwuma",
    dag: "Bɔŋɔ n-niŋsim",
  },
  recentAnalyses: {
    en: "Recent Analyses",
    tw: "Nhwehwɛmu a Ɛtwa to",
    dag: "Kparibɔ Din Daa",
  },
  refresh: {
    en: "Refresh",
    tw: "San Hwɛ Mu",
    dag: "Lab'li",
  },
  loadingRecent: {
    en: "Loading recent scans...",
    tw: "Ɛreloodo nhahan a etwa so...",
    dag: "N-nyɛra kparibɔ din daa...",
  },
  noScansYet: {
    en: "No scans yet",
    tw: "Nhwehwɛ biara nni hɔ",
    dag: "Kparibɔ bi paai",
  },
  noScansMsg: {
    en: "Analyze your first maize leaf to see results here.",
    tw: "Hwehwɛ w'aburow nhaban a edi kan na hu nea ɛfiri mu bae .",
    dag: "Di a maize kpamli a dundɔŋ ŋɔ n-ti a nya n-niŋsim.",
  },
  scanBtn: {
    en: "Analyze a Leaf",
    tw: "Hwehwɛ Ahaban Mu",
    dag: "Kpɛma Kpamli",
  },
  tablePrediction: {
    en: "Prediction",
    tw: "Nkyerɛkyerɛ",
    dag: "N-nya",
  },
  tableConfidence: {
    en: "Confidence",
    tw: "Ahotoso Akontaabu",
    dag: "Din Su",
  },
  tableSeverity: {
    en: "Severity",
    tw: "Yaree Mu Den",
    dag: "Yɛl' Biɛri",
  },
  tableDateTime: {
    en: "Date & Time",
    tw: "Da ne Berɛ",
    dag: "Dabisili ni Saŋa",
  },
  tableWhen: {
    en: "When",
    tw: "Bere Bɛn",
    dag: "Saŋa",
  },
  justNow: {
    en: "Just now",
    tw: "Afei ara pɛ",
    dag: "Pampam",
  },
  minAgo: {
    en: "m ago",
    tw: "sima atwam",
    dag: "mini din daa",
  },
  hourAgo: {
    en: "h ago",
    tw: "dɔnhwere atwam",
    dag: "saŋa din daa",
  },
  dayAgo: {
    en: "d ago",
    tw: "da atwam",
    dag: "dabisili din daa",
  },
  healthyLabel: {
    en: "healthy",
    tw: "ahoɔden",
    dag: "sal'",
  },
};

const predictionColors: Record<string, string> = {
  Common_Rust:          "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
  Gray_Leaf_Spot:       "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  Healthy:              "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  MSV:                  "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  Northern_Leaf_Blight: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
  Southern_Leaf_Blight: "bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300",
  Uncertain:            "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
};

function SeverityBadge({ severity, lang }: { severity: string; lang: Language }) {
  const severityLabels: Record<string, Record<Language, string>> = {
    critical: { en: "critical", tw: "ɛmu yɛ den paa", dag: "Asasi" },
    high:     { en: "high", tw: "ɛmu yɛ den", dag: "Galisi" },
    medium:   { en: "medium", tw: "ɛmu nnyɛ den pii", dag: "Di bahi sunsuuni" },
    low:      { en: "low", tw: "ɛmu nnyɛ den", dag: "Bi galisi" },
    none:     { en: "healthy", tw: "apɔwmuden", dag: "kpalim zaa" },
  };

  const styles: Record<string, string> = {
    critical: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
    high:     "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
    medium:   "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
    low:      "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
    none:     "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  };

  const severityText = severityLabels[severity]?.[lang] ?? severity;

  return (
    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-lg ${styles[severity] ?? styles.low}`}>
      {severityText}
    </span>
  );
}

function formatDate(isoString: string): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(isoString: string, lang: Language): string {
  if (!isoString) return "—";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return T.justNow[lang];
  if (mins  < 60) return `${mins} ${T.minAgo[lang]}`;
  if (hours < 24) return `${hours} ${T.hourAgo[lang]}`;
  return `${days}${T.dayAgo[lang]}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Farmer");
  const [language, setLanguage] = useState<Language>("en");

  const [stats, setStats] = useState<DashboardStats>({
    total_scans:       0,
    disease_cases:     0,
    healthy_count:     0,
    disease_breakdown: {},
    recent_scans:      [],
    last_scan:         null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const name = localStorage.getItem("user_name");
    if (name) setUserName(name);

    const savedLang = localStorage.getItem("chat_language") as Language | null;
    if (savedLang && ["en", "tw", "dag"].includes(savedLang)) {
      setLanguage(savedLang);
    }

    loadDashboard();
  }, []);

  const switchLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("chat_language", lang);
  };

  const loadDashboard = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        router.push("/login");
        return;
      }
      const response = await api.get(`/api/dashboard/stats/${userId}`);
      setStats(response.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const healthRate = stats.total_scans > 0
    ? Math.round((stats.healthy_count / stats.total_scans) * 100)
    : 0;

  const t = (key: string) => T[key]?.[language] ?? key;

  return (
    <>
      <Navbar
        language={language}
        onLanguageChange={switchLanguage}
      />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

        {/* HERO */}
        <section className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 dark:from-green-900 dark:via-green-800 dark:to-green-700 text-white transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-6 py-14">
            <div>
              <h1 className="text-5xl font-bold text-white">
                {t("greeting")}, {userName}
              </h1>
              <p className="mt-4 text-green-100 text-lg">
                {t("subtitle")}
              </p>
              {stats.last_scan && (
                <p className="mt-2 text-green-200 text-sm flex items-center gap-1.5">
                  <Clock size={14} />
                  {t("lastScan")} {timeAgo(stats.last_scan, language)}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* STATS CARDS */}
        <section className="max-w-7xl mx-auto px-6 -mt-10">
          <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-lg transition-colors duration-200">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-4">
                <Leaf size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t("totalScans")}</h3>
              <p className="text-4xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                {loading ? "—" : stats.total_scans}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-lg transition-colors duration-200">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t("diseasesFound")}</h3>
              <p className="text-4xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                {loading ? "—" : stats.disease_cases}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-lg transition-colors duration-200">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t("healthyScans")}</h3>
              <p className="text-4xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                {loading ? "—" : stats.healthy_count}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-lg transition-colors duration-200">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t("healthRate")}</h3>
              <p className="text-4xl font-bold mt-1 text-slate-900 dark:text-slate-50">
                {loading ? "—" : `${healthRate}%`}
              </p>
            </div>

          </div>
        </section>

        {/* DISEASE BREAKDOWN + QUICK ACTIONS */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Disease breakdown */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-lg transition-colors duration-200">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={22} className="text-green-600 dark:text-green-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  {t("diseaseBreakdown")}
                </h2>
              </div>
              {loading ? (
                <p className="text-slate-400 dark:text-slate-500 text-sm">{t("loading")}</p>
              ) : Object.keys(stats.disease_breakdown).length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 text-sm">
                  {t("noScansYetBreakdown")}
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.disease_breakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([disease, count]) => (
                      <div key={disease} className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${predictionColors[disease] ?? "bg-slate-100 text-slate-600"}`}>
                          {disease.replace(/_/g, " ")}
                        </span>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500 transition-all duration-700"
                            style={{
                              width: `${Math.round((count / stats.total_scans) * 100)}%`
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-6 text-right">
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {t("quickActions")}
              </h2>
              <Link
                href="/detect"
                className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <ScanSearch size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-50">{t("analyzeLeafTitle")}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t("analyzeLeafDesc")}</p>
                </div>
              </Link>
              <Link
                href="/treatments"
                className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <ShieldCheck size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-50">{t("treatmentGuide")}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t("treatmentGuideDesc")}</p>
                </div>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                  <Activity size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-50">{t("aboutMaizeAI")}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t("aboutMaizeAIDesc")}</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* RECENT SCANS */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-lg p-8 transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {t("recentAnalyses")}
              </h2>
              <button
                onClick={loadDashboard}
                className="text-xs text-green-600 dark:text-green-400 hover:underline font-medium"
              >
                {t("refresh")}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 py-6">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {t("loadingRecent")}
              </div>
            ) : stats.recent_scans.length === 0 ? (
              <div className="text-center py-12">
                <Leaf size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">{t("noScansYet")}</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                  {t("noScansMsg")}
                </p>
                <Link
                  href="/detect"
                  className="inline-flex items-center gap-2 mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <ScanSearch size={18} />
                  {t("scanBtn")}
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                      <th className="text-left py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t("tablePrediction")}
                      </th>
                      <th className="text-left py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t("tableConfidence")}
                      </th>
                      <th className="text-left py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t("tableSeverity")}
                      </th>
                      <th className="text-left py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t("tableDateTime")}
                      </th>
                      <th className="text-left py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t("tableWhen")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_scans.map((scan) => (
                      <tr
                        key={scan._id}
                        className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <td className="py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${predictionColors[scan.prediction] ?? "bg-slate-100 text-slate-600"}`}>
                            {scan.prediction.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-green-500"
                                style={{ width: `${scan.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {scan.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <SeverityBadge severity={scan.severity} lang={language} />
                        </td>
                        <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                          {formatDate (scan.created_at)}
                        </td>
                        <td className="py-4 text-sm text-slate-400 dark:text-slate-500">
                          {timeAgo (scan.created_at, language)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

      </main>

      <AgricChatbot />
    </>
  );
}