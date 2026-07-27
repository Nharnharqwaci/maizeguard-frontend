"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, XCircle, CheckCircle, Lock, ArrowLeft, AlertTriangle } from "lucide-react";
import api from "@/services/api";
import Navbar from "@/components/Navbar";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  changePassword: {
    en: "Change Password",
    tw: "Sesa Wo Paswɛde",
    dag: "Niŋi sɔŋsim yɛltɔɣ' kpɛma",
  },
  updatePassword: {
    en: "Update your account password",
    tw: "Sesa wo account paswɛde",
    dag: "Niŋi sɔŋsim a yuli yɛltɔɣ' kpɛma",
  },
  tempPasswordWarning: {
    en: "You logged in with a temporary password. You must set a new password before continuing.",
    tw: "Wo de paswɛde foforo kɔɔ mu. Ɛsɛ sɛ wo sesa wo paswɛde ansa na wobɛkɔ so.",
    dag: "A kpɛm kpɛlo ni yɛltɔɣ' kpɛma pampam. A tuhi ni niŋi sɔŋsim yɛltɔɣ' kpɛma pam pahi.",
  },
  currentPassword: {
    en: "Current Password",
    tw: "Paswɛde a Wɔde Kɔ Mu",
    dag: "Yɛltɔɣ' kpɛma din kpɛm",
  },
  newPassword: {
    en: "New Password",
    tw: "Paswɛde Foforo",
    dag: "Yɛltɔɣ' kpɛma pampam",
  },
  confirmNewPassword: {
    en: "Confirm New Password",
    tw: "Si Paswɛde Foforo Pi",
    dag: "Lab'li yɛltɔɣ' kpɛma pampam",
  },
  passwordPlaceholder: {
    en: "Enter your password",
    tw: "Kyerɛ wo paswɛde",
    dag: "Kpɛm yɛltɔɣ' kpɛma",
  },
  updating: {
    en: "Updating...",
    tw: "Ɛresesa...",
    dag: "N-nyɛra sɔŋsim...",
  },
  updatePasswordBtn: {
    en: "Update Password",
    tw: "Sesa Paswɛde",
    dag: "Niŋi sɔŋsim yɛltɔɣ' kpɛma",
  },
  backToDashboard: {
    en: "Back to Dashboard",
    tw: "San Kɔ Dasiboodu",
    dag: "Lab'li Dasiboodi",
  },
  passwordsDoNotMatch: {
    en: "New passwords do not match.",
    tw: "Paswɛde foforo no nsi pi.",
    dag: "Yɛltɔɣ' kpɛma pampam ŋmaa bi lab'li.",
  },
  passwordTooShort: {
    en: "Password must be at least 6 characters.",
    tw: "Paswɛde no ɛsɛ sɛ ɛyɛ nkyerɛwde 6 anaa nea ɛboro saa.",
    dag: "Yɛltɔɣ' kpɛma ŋɔ tuhi niŋi 6 anaa pahi.",
  },
  fillAllFields: {
    en: "Please fill in all fields.",
    tw: "Yɛsrɛ wo hyɛ bea biara ma.",
    dag: "M bɔri suɣulo, kpɛhim a gbana zaa.",
  },
  passwordChanged: {
    en: "Password changed successfully! Redirecting...",
    tw: "Wɔasesa wo paswɛde! Ɛresan kɔ...",
    dag: "Yɛltɔɣ' kpɛma sɔŋsim n-niŋ! N-nyɛra lab'li...",
  },
  changeFailed: {
    en: "Failed to change password. Please check your current password.",
    tw: "Ɛntumi ansesa paswɛde no. Yɛsrɛ wo hwɛ wo paswɛde a wɔde kɔ mu.",
    dag: "Yɛltɔɣ' kpɛma sɔŋsim daa bi. M bɔri suɣulo vihim a yɛltɔɣ' kpɛma din kpɛm.",
  },
  notLoggedIn: {
    en: "You must be logged in to change your password.",
    tw: "Ɛsɛ sɛ wo kɔ mu ansa na wobɛsesa wo paswɛde.",
    dag: "A tuhi ni kpɛm kpɛlo n-ti niŋi sɔŋsim a yɛltɔɣ' kpɛma.",
  },
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isTempPassword, setIsTempPassword] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("chat_language") as Language | null;
    if (savedLang && ["en", "tw", "dag"].includes(savedLang)) {
      setLanguage(savedLang);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Check if user came here because of temp password
    // We can detect this by checking if they were just redirected from login
    // For simplicity, we'll show the warning based on a query param or just always show it
    // A better approach: check a flag. For now, show warning if user hasn't changed password yet
    // We'll rely on the user seeing this after login redirect

    const handleStorage = () => {
      const lang = localStorage.getItem("chat_language") as Language | null;
      if (lang && ["en", "tw", "dag"].includes(lang)) {
        setLanguage(lang);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [router]);

  const t = (key: string) => T[key]?.[language] ?? key;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError(t("notLoggedIn"));
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t("fillAllFields"));
      return;
    }

    if (newPassword.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        token: token,
      });
      setSuccess(t("passwordChanged"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        const role = localStorage.getItem("user_role");
        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.detail || t("changeFailed"));
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
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto">
              <Lock size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold mt-4 text-slate-900 dark:text-slate-50">
              {t("changePassword")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {t("updatePassword")}
            </p>
          </div>

          {/* Temp password warning banner */}
          <div className="mb-5 flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>{t("tempPasswordWarning")}</span>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              <XCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-start gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
              <CheckCircle size={16} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("currentPassword")}
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("newPassword")}
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("confirmNewPassword")}
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  {t("updating")}
                </span>
              ) : (
                t("updatePasswordBtn")
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                const role = localStorage.getItem("user_role");
                if (role === "admin") {
                  router.push("/admin");
                } else {
                  router.push("/dashboard");
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={18} />
              {t("backToDashboard")}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
