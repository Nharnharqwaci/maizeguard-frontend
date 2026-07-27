"use client";

import Navbar from "@/components/Navbar";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { Eye, EyeOff, XCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  farmerLogin: {
    en: "Farmer Login",
    tw: "Akuafo Kɔmmu",
    dag: "Kpakolo Kpɛlo",
  },
  accessDashboard: {
    en: "Access your maize disease detection dashboard",
    tw: "Kɔ wo aburow yaree nhwehwɛmu dashboard so",
    dag: "Kpɛm a kanywa doro vihibu dasiboodi maa ni.",
  },
  enterPhoneAndPassword: {
    en: "Please enter phone number and password.",
    tw: "Yɛsrɛ wo kyerɛ wo telefon nnɔmba ne paswɛde.",
    dag: "M bɔri suɣulo, kpɛhim talifɔŋ namba ni paswɛdi.",
  },
  loginFailed: {
    en: "Login failed. Please check your network and try again.",
    tw: "Login ankɔ yie. Yɛsrɛ wo hwɛ wo network na san yɛ bio.",
    dag: "Kpɛm kpɛlo maa bi n-niŋ. M bɔri suɣulo vihim a nɛtiwaki maa n-bahi yaha..",
  },
  phoneNumber: {
    en: "Phone Number",
    tw: "Telefon Nnɔmba",
    dag: "Talifɔŋ namba",
  },
  phonePlaceholder: {
    en: "+233XXXXXXXXX",
    tw: "+233XXXXXXXXX",
    dag: "+233XXXXXXXXX",
  },
  password: {
    en: "Password",
    tw: "Paswɛde",
    dag: "Paswɛdi",
  },
  passwordPlaceholder: {
    en: "Enter your password",
    tw: "Kyerɛ wo Paswɛde",
    dag: "Kpɛm yɛltɔɣ' kpɛma ni li n-kpiɛm",
  },
  signingIn: {
    en: "Signing in...",
    tw: "Ɛrekɔ mu...",
    dag: "N-nyɛra...",
  },
  login: {
    en: "Login",
    tw: "Kɔ Mu",
    dag: "Kpɛm kpɛlo",
  },
  noAccount: {
    en: "Don't have an account?",
    tw: "Wo nni account?",
    dag: "Account biɛla?",
  },
  createAccount: {
    en: "Create Account",
    tw: "Bue Account",
    dag: "Kpehi a yuli kpɛlo",
  },
  forgotPassword: {
    en: "Forgot password?",
    tw: "Wo werɛ fi wo paswɛde?",
    dag: "A yɛnŋa yɛltɔɣ' kpɛma?",
  },
  changePassword: {
    en: "Change Password",
    tw: "Sesa Wo Paswɛde",
    dag: "Niŋi sɔŋsim yɛltɔɣ' kpɛma",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("chat_language") as Language | null;
    if (savedLang && ["en", "tw", "dag"].includes(savedLang)) {
      setLanguage(savedLang);
    }

    const handleStorage = () => {
      const lang = localStorage.getItem("chat_language") as Language | null;
      if (lang && ["en", "tw", "dag"].includes(lang)) {
        setLanguage(lang);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const t = (key: string) => T[key]?.[language] ?? key;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || !password) {
      setError(t("enterPhoneAndPassword"));
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", {
        phone_number: phoneNumber,
        password: password,
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("user_name", response.data.full_name);
      localStorage.setItem("user_role", response.data.role);

      // Check if user must change their temporary password
      if (response.data.requires_password_change) {
        router.push("/change-password");
        return;
      }

      // Normal redirect based on role
      if (response.data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || t("loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors";

  return (
    <>
      <Navbar
        language={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          localStorage.setItem("chat_language", lang);
        }}
      />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 py-12 transition-colors duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 w-full max-w-md rounded-3xl shadow-xl p-10 transition-colors duration-200">

          <div className="text-center mb-8">
            <span className="text-4xl">🌽</span>
            <h1 className="text-3xl font-bold mt-3 text-slate-900 dark:text-slate-50">
              {t("farmerLogin")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {t("accessDashboard")}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 p-3 rounded-xl
            bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800
            text-red-600 dark:text-red-400 text-sm">
              <XCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("phoneNumber")}
              </label>
              <input
                type="tel"
                placeholder={t("phonePlaceholder")}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t("password")}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-green-600 dark:text-green-400 hover:underline font-medium"
                >
                  {t("forgotPassword")}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {t("signingIn")}
                </span>
              ) : (
                t("login")
              )}
            </button>

            <div className="text-center space-y-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {t("noAccount")}
              </p>
              <a
                href="/register"
                className="text-green-600 dark:text-green-400 font-semibold hover:underline text-sm block"
              >
                {t("createAccount")}
              </a>
              <a
                href="/change-password"
                className="text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 font-medium hover:underline text-sm block"
              >
                {t("changePassword")}
              </a>
            </div>

          </form>
        </div>
      </main>

      {showForgotModal && (
        <ForgotPasswordModal
          language={language}
          onClose={() => setShowForgotModal(false)}
        />
      )}
    </>
  );
}
