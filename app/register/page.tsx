"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { Eye, EyeOff, XCircle } from "lucide-react";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  createAccount: {
    en: "Create Account",
    tw: "Bue Account",
    dag: "Kpehi a yuli kpɛlo",
  },
  joinMaizeAI: {
    en: "Join MaizeAI to start scanning your crops",
    tw: "Kɔ MaizeAI mu na fi ase hwehwɛ wo nnɔbae",
    dag: "Kpaŋsim MaizeAI ni di ase kpari sal'",
  },
  fillAllFields: {
    en: "Please fill in all fields.",
    tw: "Yɛsrɛ wo hyɛ mu ma nyinaa.",
    dag: "M bɔri suɣulo, pɛlimsa bɔba ŋɔ zaa.",
  },
  passwordsDoNotMatch: {
    en: "Passwords do not match. Please try again.",
    tw: "Passwords nnyɛ pɛ. Yɛsrɛ wo san yɛ bio.",
    dag: "Yɛltɔɣ' daŋsiri ŋɔ bi zaŋ yini. M bɔri suɣulo, bahi li yaha.",
  },
  passwordMinLength: {
    en: "Password must be at least 6 characters.",
    tw: "Password ɛsɛ sɛ ɛyɛ 6 anaa nea ɛboro no.",
    dag: "Paswɛdi maa nimmɔhi ni di gbaai nira dibaa ayobu.",
  },
  registrationFailed: {
    en: "Registration failed. Please try again.",
    tw: "Account bue no ankɔ yie. Yɛsrɛ wo san yɛ bio.",
    dag: "Yuli kpɛhibu ŋɔ bi n-niŋ. M bɔri suɣulo bahi yaha.",
  },
  fullName: {
    en: "Full Name",
    tw: "Wo Din Nyinaa",
    dag: "Yuli zaa",
  },
  fullNamePlaceholder: {
    en: "e.g. Kofi Mensah",
    tw: "e.g. Kofi Mensah",
    dag: "e.g. Kofi Mensah",
  },
  phoneNumber: {
    en: "Phone Number",
    tw: "Telefon Nnɔmba",
    dag: "Talifɔŋ namba",
  },
  phonePlaceholder: {
    en: "+233 XX XXX XXXX",
    tw: "+233 XX XXX XXXX",
    dag: "+233 XX XXX XXXX",
  },
  password: {
    en: "Password",
    tw: "Paswɛde",
    dag: "Paswɛdi",
  },
  passwordPlaceholder: {
    en: "Create a strong password",
    tw: "Bɔ Paswɛde a ɛyɛ den",
    dag: "Kpɛm yɛltɔɣ' kpɛma ni li n-kpiɛm",
  },
  confirmPassword: {
    en: "Confirm Password",
    tw: "Si Paswɛde no pi",
    dag: "Kpaŋsim Paswɛdi",
  },
  confirmPasswordPlaceholder: {
    en: "Repeat your password",
    tw: "San kyerɛ wo paswɛde",
    dag: "Lab'li paswɛdi",
  },
  minChars: {
    en: "Minimum 6 characters",
    tw: "Ɛsɛ sɛ ɛyɛ 6 anaa nea ɛboro saa",
    dag: "N tiŋa 6 bee pahi",
  },
  passwordsMismatch: {
    en: "Passwords do not match",
    tw: "Paswɛde nnyɛ pɛ",
    dag: "Paswɛdi biɛla",
  },
  creatingAccount: {
    en: "Creating account...",
    tw: "Ɛrebue account...",
    dag: "Akaanti maa kpɛhibu na bɔri li...",
  },
  register: {
    en: "Register",
    tw: "Bue Account",
    dag: "Kpehi a yuli kpɛlo",
  },
  alreadyHaveAccount: {
    en: "Already have an account?",
    tw: "Wo wɔ account dada?",
    dag: "A mali akaanti kani?",
  },
  signIn: {
    en: "Sign in",
    tw: "Kɔ Mu",
    dag: "Kpɛm kpɛlo",
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  // Load language from localStorage on mount
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.full_name || !formData.phone_number || !formData.password || !formData.confirm_password) {
      setError(t("fillAllFields"));
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError(t("passwordsDoNotMatch"));
      return;
    }
    if (formData.password.length < 6) {
      setError(t("passwordMinLength"));
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/register", {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        password: formData.password,
      });
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || t("registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors";

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
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-10 rounded-3xl shadow-xl w-full max-w-md transition-colors duration-200">

          <div className="text-center mb-8">
            <span className="text-4xl">🌽</span>
            <h1 className="text-3xl font-bold mt-3 text-slate-900 dark:text-slate-50">
              {t("createAccount")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              {t("joinMaizeAI")}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start gap-2 px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">
              <XCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("fullName")}
              </label>
              <input
                type="text"
                name="full_name"
                placeholder={t("fullNamePlaceholder")}
                value={formData.full_name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("phoneNumber")}
              </label>
              <input
                type="tel"
                name="phone_number"
                placeholder={t("phonePlaceholder")}
                value={formData.phone_number}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t("passwordPlaceholder")}
                  value={formData.password}
                  onChange={handleChange}
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
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {t("minChars")}
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("confirmPassword")}
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirm_password"
                  placeholder={t("confirmPasswordPlaceholder")}
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className={`${inputClass} pr-12 ${
                    formData.confirm_password &&
                    formData.password !== formData.confirm_password
                      ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.confirm_password &&
                formData.password !== formData.confirm_password && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {t("passwordsMismatch")}
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {t("creatingAccount")}
                </span>
              ) : (
                t("register")
              )}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              {t("alreadyHaveAccount")}{" "}
              <a href="/login" className="text-green-600 dark:text-green-400 font-medium hover:underline">
                {t("signIn")}
              </a>
            </p>

          </form>
        </div>
      </main>
    </>
  );
}
