"use client";

import { useState } from "react";
import { X, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import api from "@/services/api";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  forgotPassword: {
    en: "Forgot Password?",
    tw: "Wo werɛ fi wo Paswɛde?",
    dag: "A yɛnŋa yɛltɔɣ' kpɛma?",
  },
  enterPhoneReset: {
    en: "Enter your phone number and we'll send a temporary password to you via SMS.",
    tw: "Kyerɛ wo telefon nnɔmba na yɛbɛsoma paswɛde foforo ma wo SMS so.",
    dag: "Kpɛhim talifɔŋ namba maa, ti tiŋi yɛltɔɣ' kpɛma pampam n-ti a SMS ni.",
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
  resetPassword: {
    en: "Reset Password",
    tw: "Sese Paswɛde",
    dag: "Lab'li yɛltɔɣ' kpɛma",
  },
  resetting: {
    en: "Resetting...",
    tw: "Ɛresesa no...",
    dag: "N-nyɛra lab'li...",
  },
  backToLogin: {
    en: "Back to Login",
    tw: "San Kɔ Mu",
    dag: "Lab'li kpɛm kpɛlo",
  },
  resetSuccessTitle: {
    en: "Check your phone!",
    tw: "Hwɛ wo fon so!",
    dag: "Vihim a talifɔŋ ni!",
  },
  resetSuccessMessage: {
    en: "If this number is registered, a temporary password has been sent via SMS. Use it to log in, then change your password immediately.",
    tw: "Sɛ nnɔmba yi wɔ ahyɛ mu a, wɔasoma paswɛde foforo ma wo SMS so. Fa no kɔ mu, na ɛno akyi no sesa wo paswɛde ntɛm.",
    dag: "Sahaŋ ŋɔ n-dolli a, ti tiŋi yɛltɔɣ' kpɛma pampam n-ti a SMS ni. Zaŋ ŋɔ kpɛm kpɛlo, pahi niŋi sɔŋsim a yɛltɔɣ' kpɛma ŋɔ.",
  },
  userNotFound: {
    en: "No account found with this phone number.",
    tw: "Account biara nni hɔ a ɛfa telefon nnɔmba yi ho.",
    dag: "Account biɛla biɛla wɔ talifɔŋ namba ŋɔ ni.",
  },
  resetFailed: {
    en: "Password reset failed. Please try again.",
    tw: "Paswɛde sesa no ankɔ yie. Yɛsrɛ wo san yɛ bio.",
    dag: "Yɛltɔɣ' kpɛma lab'li daa. M bɔri suɣulo tuuli labi.",
  },
};

interface ForgotPasswordModalProps {
  language: Language;
  onClose: () => void;
}

export default function ForgotPasswordModal({ language, onClose }: ForgotPasswordModalProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const t = (key: string) => T[key]?.[language] ?? key;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!phone.trim()) return;

    try {
      setLoading(true);
      await api.post("/api/auth/forgot-password", { phone_number: phone.trim() });
      setSuccess(true);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError(t("userNotFound"));
      } else {
        setError(t("resetFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t("forgotPassword")}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {!success ? (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              {t("enterPhoneReset")}
            </p>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t("phoneNumber")}
                </label>
                <input
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {t("resetting")}
                  </span>
                ) : (
                  t("resetPassword")
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle size={20} />
              <span className="font-semibold">{t("resetSuccessTitle")}</span>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("resetSuccessMessage")}
            </p>

            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold border-2 border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
            >
              <ArrowLeft size={18} />
              {t("backToLogin")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
