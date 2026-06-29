"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import UploadForm from "@/components/UploadForm";
import {
  ScanSearch,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  XCircle,
} from "lucide-react";
import api from "@/services/api";

interface ScanResult {
  id: string;
  prediction: string;
  confidence: number;
  severity: string;
  color: string;
  treatment: string[];
  all_probs: Record<string, number>;
}

const predictionConfig: Record<string,
  {
    bg: string;
    border: string;
    text: string;
    badge: string;
    barColor: string;
  }
> = {
  Healthy: {
    bg: "bg-green-50 dark:bg-green-950",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-700 dark:text-green-400",
    badge: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    barColor: "bg-green-500",
  },
  MSV: {
    bg: "bg-orange-50 dark:bg-orange-950",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-700 dark:text-orange-400",
    badge: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
    barColor: "bg-orange-500",
  },
  MLS: {
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-400",
    badge: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
    barColor: "bg-red-500",
  },
  Not_Maize: {
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-slate-300 dark:border-slate-600",
    text: "text-slate-700 dark:text-slate-300",
    badge: "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200",
    barColor: "bg-slate-400",
  },
  Uncertain: {
    bg: "bg-yellow-50 dark:bg-yellow-950",
    border: "border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-700 dark:text-yellow-400",
    badge: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
    barColor: "bg-yellow-500",
  },
};

const defaultConfig = predictionConfig.Uncertain;

function PredictionIcon({ prediction }: { prediction: string }) {
  switch (prediction) {
    case "Healthy":
      return <CheckCircle size={22} className="text-green-600 dark:text-green-400" />;
    case "MSV":
      return <AlertTriangle size={22} className="text-orange-500 dark:text-orange-400" />;
    case "MLS":
      return <XCircle size={22} className="text-red-600 dark:text-red-400" />;
    case "Not_Maize":
      return <HelpCircle size={22} className="text-slate-500 dark:text-slate-400" />;
    default:
      return <HelpCircle size={22} className="text-yellow-500 dark:text-yellow-400" />;
  }
}

export default function DetectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) return;
    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/api/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          "Failed to analyze image. Please try again."
      );
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
  };

  const config = result
    ? predictionConfig[result.prediction] ?? defaultConfig
    : defaultConfig;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-6">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-50">
              AI Disease Detection
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
              Upload a maize leaf image and receive an instant AI-powered diagnosis.
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 p-8 transition-colors duration-200">
            <UploadForm
              preview={preview}
              fileName={fileName}
              onFileSelect={handleFileSelect}
            />

            {/* File selected feedback */}
            {file && !loading && !result && (
              <div className="mt-4 flex items-center gap-2 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">
                  <span className="font-semibold">{fileName}</span> selected — ready to analyze
                </span>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                <XCircle size={18} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Analyzing leaf...
                </span>
              ) : (
                "Analyze Leaf"
              )}
            </button>
          </div>

          {/* Result Section */}
          {result && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 p-8 mt-10 transition-colors duration-200">

              {/* Result header */}
              <div className="flex items-center gap-3 mb-8">
                <ScanSearch size={30} className="text-green-600 dark:text-green-400" />
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                  Analysis Result
                </h2>
              </div>

              {/* Image + prediction card */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <img
                  src={preview}
                  alt="Analyzed leaf"
                  className="w-full md:w-64 h-64 object-contain rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0"
                />

                <div className={`flex-1 ${config.bg} border ${config.border} p-6 rounded-2xl flex flex-col justify-center gap-4`}>

                  {/* Prediction icon + label */}
                  <div className="flex items-center gap-2">
                    <PredictionIcon prediction={result.prediction} />
                    <span className={`text-sm font-bold uppercase tracking-wider ${config.text}`}>
                      Diagnosis
                    </span>
                  </div>

                  {/* Prediction name */}
                  <div>
                    <span className={`inline-block px-4 py-2 rounded-xl text-lg font-bold ${config.badge}`}>
                      {result.prediction === "Not_Maize"
                        ? "Not a Maize Leaf"
                        : result.prediction}
                    </span>
                  </div>

                  {/* Confidence bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Confidence
                      </span>
                      <span className={`font-bold ${config.text}`}>
                        {result.confidence}%
                      </span>
                    </div>
                    <div className="w-full bg-white dark:bg-slate-700 rounded-full h-3 border border-slate-200 dark:border-slate-600">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ${config.barColor}`}
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Severity tag */}
                  {result.severity !== "none" && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Severity:
                      </span>
                      <span
                        className={`text-xs font-bold uppercase px-2 py-1 rounded-lg ${
                          result.severity === "critical"
                            ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                            : result.severity === "high"
                            ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {result.severity}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* All class probabilities */}
              {result.all_probs && Object.keys(result.all_probs).length > 0 && (
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 mb-8">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    Class Probabilities
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(result.all_probs)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([cls, prob]) => (
                        <div key={cls} className="flex items-center gap-3">
                          <span className="text-sm text-slate-700 dark:text-slate-300 w-28 shrink-0 font-medium">
                            {cls === "Not_Maize" ? "Not Maize" : cls}
                          </span>
                          <div className="flex-1 bg-white dark:bg-slate-700 rounded-full h-2.5 border border-slate-200 dark:border-slate-600">
                            <div
                              className="h-2.5 rounded-full bg-green-500 transition-all duration-700"
                              style={{ width: `${prob}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-14 text-right">
                            {(prob as number).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Treatment recommendations */}
              {result.treatment && result.treatment.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                    Treatment Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {result.treatment.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
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

              {/* Scan again */}
              <button
                onClick={handleReset}
                className="w-full border-2 border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 py-3 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
              >
                Scan Another Image
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}