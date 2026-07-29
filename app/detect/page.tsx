"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import UploadForm from "@/components/UploadForm";
import AgricChatbot from "@/components/AgricChatbot";
import {
  ScanSearch,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  XCircle,
  WifiOff,
  Bug,
  Wind,
  Flame,
  Droplets,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import api from "@/services/api";
import { loadModel, runInference } from "@/services/inference";
import {
  getTreatment,
  getSeverity,
  getColor,
  computeNormalizedEntropy,
} from "@/data/treatments";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  pageTitle: {
    en: "AI Disease Detection",
    tw: "AI Nyarewa Nhwehwɛmu",
    dag: "AI Yɛl' Kparibɔ",
  },
  pageDesc: {
    en: "Upload a maize leaf image and receive an instant AI-powered diagnosis.",
    tw: "Twa aburow ahaban mfonini bi na nya AI nhwehwɛmu ntɛm.",
    dag: "Zaŋ maize kpamli nimli ni nya AI kparibɔ pampam.",
  },
  fileSelected: {
    en: "selected — ready to analyze",
    tw: "ayi — ayɛ krado sɛ wobɛhwehwɛ mu",
    dag: "zaa — kparibɔ niŋ",
  },
  readyToAnalyze: {
    en: "ready to analyze",
    tw: "Ayɛ krado sɛ wobɛhwehwɛ mu",
    dag: "kparibɔ niŋ",
  },
  networkError: {
    en: "No internet connection. Please check your network and try again.",
    tw: "Internet nni hɔ. Yɛsrɛ wo sɛ hwɛ wo network na san yɛ bio.",
    dag: "Internet biɛla. Kpaŋsim network ni tuuli labi.",
  },
  analyzeError: {
    en: "Failed to analyze image. Please try again.",
    tw: "Ɛnkɔɔ yie sɛ wobɛhwehwɛ mfonini no. Yɛsrɛ wo san yɛ bio.",
    dag: "Nimli kparibɔ daa. Tuuli labi.",
  },
  analyzing: {
    en: "Analyzing leaf...",
    tw: "Ɛrehwehwɛ ahaban no...",
    dag: "Kpamli kparibɔ...",
  },
  analyzeBtn: {
    en: "Analyze Leaf",
    tw: "Hwehwɛ Ahaban No Mu",
    dag: "Kpari Kpamli",
  },
  analysisResult: {
    en: "Analysis Result",
    tw: "Nhwehwɛmu No Mu Aba",
    dag: "Kparibɔ N-Niŋsim",
  },
  savedHistory: {
    en: "Saved to your history",
    tw: "Wɔagye no asie wɔ wo abakɔsɛm mu",
    dag: "N tiŋa lahabaya ni",
  },
  notSavedOffline: {
    en: "Not Saved - offline",
    tw: "Ennysiee - internet nni hɔ",
    dag: "Biɛla tiŋa - internet biɛla",
  },
  diagnosis: {
    en: "Diagnosis",
    tw: "Yaree a ɛwɔ mu",
    dag: "Yɛl' din",
  },
  confidence: {
    en: "Confidence",
    tw: "Ahotoso nkontabuo",
    dag: "Din su",
  },
  severity: {
    en: "Severity",
    tw: "Sɛnea emu yɛ den",
    dag: "Yɛl' din",
  },
  classProbabilities: {
    en: "Class Probabilities",
    tw: "Nkyekyɛmu Nhwehwɛmu",
    dag: "Zaa Kparibɔ",
  },
  recommendations: {
    en: "Recommendations",
    tw: "Nkyerɛkyerɛ",
    dag: "N-Kyɛnli",
  },
  cropCareTips: {
    en: "Crop Care Tips",
    tw: "Nnɔbae Ho Kɔkɔbo",
    dag: "Sal' Kyaŋsim",
  },
  treatmentRecommendations: {
    en: "Treatment Recommendations",
    tw: "Ayaresa Ho Nkyerɛkyerɛ",
    dag: "Yɛl' Kyaŋsim",
  },
  videoGuides: {
    en: "Video Guides",
    tw: "Video Nkyerɛkyerɛ",
    dag: "Video N-Kyɛnli",
  },
  requiresInternet: {
    en: "— requires internet connection",
    tw: "— ɛhia internet",
    dag: "— internet n tiŋa",
  },
  videosRequireInternet: {
    en: "Videos require an active internet connection to play. Click the thumbnail to load the player.",
    tw: "Video no hia internet na ɛbɛbɔ. Klik thumbnail no na load player no.",
    dag: "Video nima internet pampam ni bɔ. Click thumbnail ni load player.",
  },
  scanAnother: {
    en: "Scan Another Image",
    tw: "Hwehwɛ Mfonini Foforo Mu",
    dag: "Kpari Nimli Ŋun",
  },
  healthy: {
    en: "Healthy",
    tw: "Apɔwmuden",
    dag: "Kpalim zaa",
  },
  msv: {
    en: "Maize Streak Virus (MSV)",
    tw: "Maize Streak Virus (MSV)",
    dag: "Maize Streak Virus (MSV)",
  },
  commonRust: {
    en: "Common Rust",
    tw: "Common Rust",
    dag: "Common Rust",
  },
  grayLeafSpot: {
    en: "Gray Leaf Spot",
    tw: "Grey Leaf Spot",
    dag: "Gray Leaf Spot",
  },
  northernLeafBlight: {
    en: "Northern Leaf Blight",
    tw: "Northern Leaf Blight",
    dag: "Northern Leaf Blight",
  },
  southernLeafBlight: {
    en: "Southern Leaf Blight",
    tw: "Southern Leaf Blight",
    dag: "Southern Leaf Blight",
  },
  uncertain: {
    en: "Uncertain — Could not detect",
    tw: "Ɛnnte aseɛ — Enntumi Nhwehwɛmu",
    dag: "Biɛla — N-tum kpari",
  },
};

interface VideoItem {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  url: string;
}

interface ScanResult {
  id: string;
  prediction: string;
  confidence: number;
  severity: string;
  color: string;
  treatment: string[];
  save_status: "saved" | "offline" | "guest";
  videos: VideoItem[];
  saved: boolean;
  all_probs: Record<string, number>;
}

const predictionConfig: Record<string, {
  bg: string;
  border: string;
  text: string;
  badge: string;
  barColor: string;
  labelKey: string;
}> = {
  Common_Rust: {
    bg:       "bg-orange-50 dark:bg-orange-950",
    border:   "border-orange-300 dark:border-orange-700",
    text:     "text-orange-700 dark:text-orange-400",
    badge:    "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300",
    barColor: "bg-orange-500",
    labelKey: "commonRust",
  },
  Gray_Leaf_Spot: {
    bg:       "bg-purple-50 dark:bg-purple-950",
    border:   "border-purple-300 dark:border-purple-700",
    text:     "text-purple-700 dark:text-purple-400",
    badge:    "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300",
    barColor: "bg-purple-500",
    labelKey: "grayLeafSpot",
  },
  Healthy: {
    bg:       "bg-green-50 dark:bg-green-950",
    border:   "border-green-300 dark:border-green-700",
    text:     "text-green-700 dark:text-green-400",
    badge:    "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    barColor: "bg-green-500",
    labelKey: "healthy",
  },
  MSV: {
    bg:       "bg-red-50 dark:bg-red-950",
    border:   "border-red-300 dark:border-red-700",
    text:     "text-red-700 dark:text-red-400",
    badge:    "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
    barColor: "bg-red-500",
    labelKey: "msv",
  },
  Northern_Leaf_Blight: {
    bg:       "bg-amber-50 dark:bg-amber-950",
    border:   "border-amber-300 dark:border-amber-700",
    text:     "text-amber-700 dark:text-amber-400",
    badge:    "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300",
    barColor: "bg-amber-500",
    labelKey: "northernLeafBlight",
  },
  Southern_Leaf_Blight: {
    bg:       "bg-rose-50 dark:bg-rose-950",
    border:   "border-rose-300 dark:border-rose-700",
    text:     "text-rose-700 dark:text-rose-400",
    badge:    "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300",
    barColor: "bg-rose-500",
    labelKey: "southernLeafBlight",
  },
  Uncertain: {
    bg:       "bg-yellow-50 dark:bg-yellow-950",
    border:   "border-yellow-300 dark:border-yellow-700",
    text:     "text-yellow-700 dark:text-yellow-400",
    badge:    "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    barColor: "bg-yellow-400",
    labelKey: "uncertain",
  },
};

const defaultConfig = predictionConfig.Uncertain;

const probBarColor: Record<string, string> = {
  Common_Rust:          "bg-orange-500",
  Gray_Leaf_Spot:       "bg-purple-500",
  Healthy:              "bg-green-500",
  MSV:                  "bg-red-500",
  Northern_Leaf_Blight: "bg-amber-500",
  Southern_Leaf_Blight: "bg-rose-500",
};

function PredictionIcon({ prediction }: { prediction: string }) {
  switch (prediction) {
    case "Healthy":
      return <CheckCircle size={22} className="text-green-600 dark:text-green-400" />;
    case "MSV":
      return <XCircle size={22} className="text-red-600 dark:text-red-400" />;
    case "Common_Rust":
      return <Bug size={22} className="text-orange-500 dark:text-orange-400" />;
    case "Gray_Leaf_Spot":
      return <Wind size={22} className="text-purple-500 dark:text-purple-400" />;
    case "Northern_Leaf_Blight":
      return <Droplets size={22} className="text-amber-500 dark:text-amber-400" />;
    case "Southern_Leaf_Blight":
      return <Flame size={22} className="text-rose-500 dark:text-rose-400" />;
    default:
      return <HelpCircle size={22} className="text-yellow-500 dark:text-yellow-400" />;
  }
}

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
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {T.severity[lang]}:
      </span>
      <span className={`text-xs font-bold uppercase px-2 py-1 rounded-lg ${styles[severity] ?? styles.low}`}>
        {severityText}
      </span>
    </div>
  );
}

function YouTubeEmbed({
  videoId,
  title,
  thumbnail,
  channel,
  url,
}: VideoItem) {
  const [playing, setPlaying] = useState(false);

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
      {playing ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="relative w-full aspect-video group block bg-black"
          aria-label={`Play: ${title}`}
        >
          <img
            src={thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-7 h-7 ml-1"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
            <p className="text-white text-xs font-semibold line-clamp-2 text-left leading-tight">
              {title}
            </p>
            {channel && (
              <p className="text-white/60 text-xs mt-0.5">{channel}</p>
            )}
          </div>
        </button>
      )}
      {/* Watch on YouTube link */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 py-2 bg-slate-900 hover:bg-slate-800 text-white/70 hover:text-white text-xs transition-colors"
      >
        <ExternalLink size={11} />
        Watch on YouTube
      </a>
    </div>
  );
}

export default function DetectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [videosOpen, setVideosOpen] = useState(true);
  const [probsOpen, setProbsOpen] = useState(true);
  const [language, setLanguage] = useState<Language>("en");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  // Check login status on mount
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  // Preload the ONNX model as soon as the page mounts
  useEffect(() => {
    loadModel().catch(console.error);
  }, []);

  // ── RE-TRANSLATE TREATMENT + REFETCH VIDEOS WHEN LANGUAGE CHANGES ──
  useEffect(() => {
    if (!result) return;

    // 1. Update treatment immediately using local data (works offline)
    setResult((prev) =>
      prev
        ? {
            ...prev,
            treatment: getTreatment(prev.prediction, language),
          }
        : null
    );

    // 2. Best-effort refetch videos in new language
    api
      .get(`/api/videos?prediction=${result.prediction}&lang=${language}`)
      .then((res) => {
        setResult((prev) =>
          prev
            ? {
                ...prev,
                videos: res.data.videos || [],
              }
            : null
        );
      })
      .catch(() => {
        // Silently fail — keep existing videos
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const t = (key: string) => T[key]?.[language] ?? key;

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
    setIsNetworkError(false);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    try {
      setLoading(true);
      setError("");
      setIsNetworkError(false);
      setVideosOpen(true);
      setProbsOpen(true);

      // 1. LOCAL INFERENCE (OFFLINE!)
      const inference = await runInference(file);

      // 2. Post-process
      const CONFIDENCE_THRESHOLD = 70.0;
      const ENTROPY_THRESHOLD = 0.5;

      let prediction: string = inference.prediction;
      let confidence = inference.confidence;
      const all_probs = inference.all_probs;
      const entropy = computeNormalizedEntropy(all_probs);

      const validClasses = [
        "Common_Rust",
        "Gray_Leaf_Spot",
        "Healthy",
        "MSV",
        "Northern_Leaf_Blight",
        "Southern_Leaf_Blight",
      ];

      if (
        !validClasses.includes(prediction) ||
        confidence < CONFIDENCE_THRESHOLD ||
        entropy > ENTROPY_THRESHOLD
      ) {
        prediction = "Uncertain";
      }

      const treatment = getTreatment(prediction, language);
      const severity = getSeverity(prediction);
      const color = getColor(prediction);

      // 3. Show result immediately
      const localResult: ScanResult = {
        id: "local-" + Date.now(),
        prediction,
        confidence,
        severity,
        color,
        treatment,
        save_status: "guest",
        videos: [],
        saved: false,
        all_probs,
      };
      setResult(localResult);

      // 4. Best-effort: save scan (optional) and fetch videos (independent)
      let saved = false;
      let scanId = localResult.id;
      let videos: VideoItem[] = [];

      // 4a. Save to history (don't let failure block videos)
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("lang", language);
        formData.append("prediction", prediction);
        formData.append("confidence", confidence.toString());
        formData.append("severity", severity);

        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const saveRes = await api.post("/api/save-scan", formData, { headers });
        saved = saveRes.data.saved;
        scanId = saveRes.data.scan_id || scanId;
        // If save succeeded and returned videos, use those
        if (saveRes.data.videos && saveRes.data.videos.length > 0) {
          videos = saveRes.data.videos;
        }
      } catch {
        console.log("Save scan failed — continuing as guest");
      }

      // 4b. Fetch videos independently (if not already got from save-scan)
      if (videos.length === 0) {
        try {
          const videosRes = await api.get(
            `/api/videos?prediction=${prediction}&lang=${language}`
          );
          videos = videosRes.data.videos || [];
        } catch {
          console.log("Fetch videos failed — no videos to display");
        }
      }

      setResult((prev) =>
        prev
          ? {
              ...prev,
              id: scanId,
              save_status: saved ? "saved" : "guest",
              saved,
              videos,
            }
          : null
      );
    } catch (err) {
      console.log("Backend offline — showing local result only");
      console.error(err);
      setError(T.analyzeError[language]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setPreview("");
    setFileName("");
    setFile(null);
    setError("");
    setIsNetworkError(false);
    setVideosOpen(true);
    setProbsOpen(true);
  };

  const config = result
    ? predictionConfig[result.prediction] ?? defaultConfig
    : defaultConfig;

  const getPredictionLabel = (prediction: string) => {
    const cfg = predictionConfig[prediction];
    if (cfg) {
      return t(cfg.labelKey);
    }
    return prediction.replace(/_/g, " ");
  };

  const getTreatmentTitle = () => {
    if (!result) return "";
    if (result.prediction === "Uncertain") return t("recommendations");
    if (result.prediction === "Healthy") return t("cropCareTips");
    return t("treatmentRecommendations");
  };

  return (
    <>
      <Navbar
        language={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          localStorage.setItem("chat_language", lang);
        }}
      />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-6">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-50">
              {t("pageTitle")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
              {t("pageDesc")}
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-lg p-8 transition-colors duration-200">
            <UploadForm
              preview={preview}
              fileName={fileName}
              onClear={handleReset}
              onFileSelect={handleFileSelect}
              language={language}
            />

            {/* File selected feedback */}
            {file && !loading && !result && (
              <div className="mt-4 flex items-center gap-2 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">
                  <span className="font-semibold">{fileName}</span> {t("fileSelected")}
                </span>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium border ${
                isNetworkError
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                  : "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
              }`}>
                {isNetworkError
                  ? <WifiOff size={16} className="shrink-0" />
                  : <XCircle size={16} className="shrink-0" />
                }
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || file === null}
              suppressHydrationWarning
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {t("analyzing")}
                </span>
              ) : (
                t("analyzeBtn")
              )}
            </button>
          </div>

          {/* Result Section */}
          {result && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-lg p-8 mt-10 transition-colors duration-200">

              {/* Result header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <ScanSearch size={30} className="text-green-600 dark:text-green-400" />
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                    {t("analysisResult")}
                  </h2>
                </div>
                {isLoggedIn && result.save_status === "saved" && (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-950 px-3 py-1.5 rounded-lg">
                    <CheckCircle size={12} />
                    {t("savedHistory")}
                  </div>
                )}
                {isLoggedIn && result.save_status === "offline" && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    <WifiOff size={12} />
                    {t("notSavedOffline")}
                  </div>
                )}
              </div>

              {/* Image + prediction card */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <img
                  src={preview}
                  alt="Analyzed leaf"
                  className="w-full md:w-64 h-64 object-contain rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0"
                />
                <div className={`flex-1 ${config.bg} border ${config.border} p-6 rounded-2xl flex flex-col justify-center gap-4`}>
                  <div className="flex items-center gap-2">
                    <PredictionIcon prediction={result.prediction} />
                    <span className={`text-sm font-bold uppercase tracking-wider ${config.text}`}>
                      {t("diagnosis")}
                    </span>
                  </div>
                  <div>
                    <span className={`inline-block px-4 py-2 rounded-xl text-lg font-bold ${config.badge}`}>
                      {getPredictionLabel(result.prediction)}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{t("confidence")}</span>
                      <span className={`font-bold ${config.text}`}>{result.confidence}%</span>
                    </div>
                    <div className="w-full bg-white dark:bg-slate-700 rounded-full h-3 border border-slate-200 dark:border-slate-600">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ${config.barColor}`}
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>
                  <SeverityBadge severity={result.severity} lang={language} />
                </div>
              </div>


              {/* Treatment recommendations */}
              {result.treatment && result.treatment.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                    {getTreatmentTitle()}
                  </h3>
                  <ul className="space-y-3">
                    {result.treatment.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className={`mt-1 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${config.badge}`}>
                          {index + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* YouTube Videos */}
              {result.videos && result.videos.length > 0 && (
                <div className="mb-8 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setVideosOpen(!videosOpen)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <PlayCircle size={20} className="text-red-500" />
                      <span className="text-base font-bold text-slate-700 dark:text-slate-50">
                        {t("videoGuides")}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-500 hidden sm:inline">
                        {t("requiresInternet")}
                      </span>
                      <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-full font-semibold">
                        {result.videos.length}
                      </span>
                    </div>
                    {videosOpen
                      ? <ChevronUp size={18} className="text-slate-400 shrink-0" />
                      : <ChevronDown size={18} className="text-slate-400 shrink-0" />
                    }
                  </button>

                  {videosOpen && (
                    <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                      <div className="grid sm:grid-cols-2 gap-3">
                        {result.videos.map((video) => (
                          <YouTubeEmbed
                            key={video.videoId}
                            videoId={video.videoId}
                            title={video.title}
                            channel={video.channel}
                            thumbnail={video.thumbnail}
                            url={video.url}
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 text-center">
                        {t("videosRequireInternet")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Scan again */}
              <button
                onClick={handleReset}
                className={`w-full border-2 py-3 rounded-xl font-semibold transition-colors ${config.text} border-current hover:opacity-80`}
              >
                {t("scanAnother")}
              </button>
            </div>
          )}
        </div>
      </main>
      <AgricChatbot
        prediction={result?.prediction}
        confidence={result?.confidence}
        scanId={result?.id}
        treatment={result?.treatment}
      />
    </>
  );
}
