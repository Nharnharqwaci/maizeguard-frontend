"use client";

import {
  Upload,
  Camera,
  X,
  ImageIcon,
  WifiOff,
  Loader2,
  AlertTriangle,
  BrainCircuit,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { isMaize, loadMaizeModel } from "@/utils/maizeValidator";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  takePhoto: {
    en: "Take a Photo",
    tw: "Twa Mfonini",
    dag: "Twa Nimli",
  },
  cameraPermissionDenied: {
    en: "Camera permission denied. Please allow camera access in your browser settings.",
    tw: "W'amma camera ho kwan. Yɛsrɛ wo ma camera kwan wɔ wo browser settings mu.",
    dag: "Camera kpeema biɛla. Yɛn camera kpeema wɔ browser settings ni.",
  },
  cameraAccessFailed: {
    en: "Could not access camera. Please use the Upload option instead.",
    tw: "Ɛntumi nnyaa camera. Yɛsrɛ wo fa Upload no so.",
    dag: "N-tum nya camera. Yɛn Upload option ni.",
  },
  close: { en: "Close", tw: "To mu", dag: "To" },
  cancel: { en: "Cancel", tw: "Gyae", dag: "Gyae" },
  capturePhoto: { en: "Capture Photo", tw: "Twa Mfonini", dag: "Twa Nimli" },
  uploadOrTakePhoto: {
    en: "Upload or Take a Photo",
    tw: "Twe anaa Twa Mfonini",
    dag: "Zaŋ bee Twa Nimli",
  },
  supportedFormats: {
    en: "JPG, JPEG, PNG supported",
    tw: "JPG, JPEG, PNG na wɔgye",
    dag: "JPG, JPEG, PNG nima",
  },
  changePhoto: { en: "Change Photo", tw: "Sesa Mfonini", dag: "Sɔŋ Nimli" },
  uploadPhoto: { en: "Upload Photo", tw: "Twe Mfonini", dag: "Zaŋ Nimli" },
  retakePhoto: {
    en: "Retake Photo",
    tw: "San Twa Mfonini",
    dag: "Twa Nimli Labi",
  },
  takePhotoBtn: { en: "Take Photo", tw: "Twa Mfonini", dag: "Twa Nimli" },
  removePhoto: { en: "Remove", tw: "Yi", dag: "Yi" },
  validating: { en: "Checking image…", tw: "Rehwehwɛ mfonini no…", dag: "N-guuri nimli ŋɔ…" },
  checkingMaize: {
    en: "Verifying this is a maize leaf",
    tw: "Rehwɛ sɛ ɛyɛ aburoo nhaban",
    dag: "N-tu niŋ kɔbɔ n-nyɛ maize leaf",
  },
  notMaize: {
    en: "This does not appear to be a maize leaf. Please upload a clear photo of maize.",
    tw: "Ɛnyɛ aburoo nhaban. Yɛsrɛ wo fa aburoo nhaban a ani da hɔ.",
    dag: "A biɛla ka ni ŋ-ma nyɛ maize leaf. Yɛn zaŋ maize leaf photo.",
  },
  offlineMode: {
    en: "Offline — validation skipped",
    tw: "Internet nni hɔ — yɛntu nhwɛ",
    dag: "Offline — n-guuri biɛla",
  },
  invalidImageType: {
    en: "Please upload a valid image file (JPG, JPEG, or PNG).",
    tw: "Yɛsrɛ wo twe mfonini a ɛfata (JPG, JPEG, anaa PNG).",
    dag: "Yɛn zaŋ image file (JPG, JPEG, bee PNG).",
  },
  modelLoading: {
    en: "Loading validator…",
    tw: "Ɛreloade…",
    dag: "N-lɔbi ɔ…",
  },
  modelLoadError: {
    en: "Validator failed to load. Uploads will proceed without validation.",
    tw: " Odi kan no antumi anloade. Yɛbɛtoa so a yɛnnhwe.",
    dag: "AI model biɛla. Uploads n-guuri biɛla.",
  },
};

/* ───────────────────────────────
   SHORT BUZZER (Web Audio API)
   No external files needed.
   ─────────────────────────────── */
function playBuzzer() {
  try {
    const AudioCtx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1050, ctx.currentTime); // crisp C6 bell

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    setTimeout(() => ctx.close(), 350);
  } catch {
    // silent fail
  }
}

interface UploadFormProps {
  preview: string;
  fileName: string;
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  language?: Language;
}

export default function UploadForm({
  preview,
  fileName,
  onFileSelect,
  onClear,
  language = "en",
}: UploadFormProps) {
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(false);

  const t = (key: string) => T[key]?.[language] ?? key;

  /* ── Network status ── */
  useEffect(() => {
    const sync = () => setIsOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  /* ── Device detect ── */
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  /* ── Preload ONNX model on mount ── */
  useEffect(() => {
    loadMaizeModel()
      .then(() => setModelReady(true))
      .catch((err) => {
        console.warn("[UploadForm] Model load failed:", err);
        setModelError(true);
      });
  }, []);

  /* ── Core validation wrapper ── */
  const processFile = async (file: File) => {
    setValidationError(null);

    // Basic type guard
    if (!file.type.startsWith("image/")) {
      setValidationError(t("invalidImageType"));
      onClear?.();
      return;
    }

    // Offline → skip validation, allow straight through
    if (isOffline || !navigator.onLine) {
      onFileSelect(file);
      return;
    }

    // Model failed to load → fail open (don't block user)
    if (modelError) {
      onFileSelect(file);
      return;
    }

    // Wait for model if still loading
    if (!modelReady) {
      onFileSelect(file);
      return;
    }

    // Online + model ready → run local ONNX inference
    setValidating(true);
    try {
      const result = await isMaize(file);

      if (result.isMaize) {
        onFileSelect(file);
      } else {
        playBuzzer(); // ← 🔊 BUZZER SOUNDS HERE
        setValidationError(`${t("notMaize")}`);
        onClear?.();
      }
    } catch (err: any) {
      console.warn("[UploadForm] ONNX inference error:", err.message);
      onFileSelect(file);
    } finally {
      setValidating(false);
    }
  };

  /* ── File input handler ── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = "";
  };

  /* ── Camera handlers ── */
  const openCamera = async () => {
    if (isMobile) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.setAttribute("capture", "environment");
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) processFile(file);
      };
      input.click();
      return;
    }

    setCameraError("");
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      setCameraError(
        err.name === "NotAllowedError"
          ? t("cameraPermissionDenied")
          : t("cameraAccessFailed")
      );
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setCameraError("");
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      processFile(file);
      closeCamera();
    }, "image/jpeg", 0.92);
  };

  const hasPreview = !!preview;

  return (
    <div className="space-y-4">
      {/* Hidden inputs */}
      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="sr-only"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* ── MODEL STATUS BADGE ── */}
      {!modelReady && !modelError && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
          <Loader2 size={14} className="animate-spin" />
          <span className="font-medium">{t("modelLoading")}</span>
        </div>
      )}

      {modelError && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle size={14} />
          <span className="font-medium">{t("modelLoadError")}</span>
        </div>
      )}

      {/* ── OFFLINE BADGE ── */}
      {isOffline && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <WifiOff size={16} />
          <span className="font-medium">{t("offlineMode")}</span>
        </div>
      )}

      {/* ── VALIDATION ERROR BANNER ── */}
      {validationError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/20">
          <AlertTriangle
            size={18}
            className="mt-0.5 flex-shrink-0 text-red-500"
          />
          <p className="flex-1 text-sm text-red-700 dark:text-red-300">
            {validationError}
          </p>
          <button
            onClick={() => setValidationError(null)}
            className="flex-shrink-0 rounded-lg p-1 text-red-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── CAMERA MODAL ── */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <h3 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <Camera size={18} className="text-green-600" />
                {t("takePhoto")}
              </h3>
              <button
                onClick={closeCamera}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {cameraError ? (
              <div className="p-6 text-center">
                <p className="mb-4 text-sm text-red-500">{cameraError}</p>
                <button
                  onClick={closeCamera}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium dark:bg-slate-800"
                >
                  {t("close")}
                </button>
              </div>
            ) : (
              <>
                <div className="relative bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="max-h-96 w-full object-contain"
                  />
                </div>
                <div className="flex justify-center gap-4 p-5">
                  <button
                    onClick={closeCamera}
                    className="rounded-xl border-2 border-slate-200 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
                  >
                    <Camera size={18} />
                    {t("capturePhoto")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── PREVIEW / DROPZONE ── */}
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300
          ${
            hasPreview
              ? "border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
              : "border-2 border-dashed border-slate-300 bg-slate-50 hover:border-green-400 hover:bg-green-50/30 dark:border-slate-600 dark:bg-slate-900/50 dark:hover:border-green-500 dark:hover:bg-green-950/20"
          }
        `}
      >
        {/* Validating overlay */}
        {validating && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/85 backdrop-blur-sm dark:bg-slate-900/85">
            <BrainCircuit size={32} className="animate-pulse text-green-600" />
            <p className="font-medium text-slate-800 dark:text-slate-100">
              {t("validating")}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("checkingMaize")}
            </p>
          </div>
        )}

        {hasPreview ? (
          <div className="relative group">
            <div className="flex w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
              <img
                src={preview}
                alt="Selected leaf"
                className="max-h-80 w-full object-contain"
              />
            </div>

            {onClear && (
              <button
                onClick={onClear}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-slate-700"
                title={t("removePhoto")}
              >
                <X size={16} />
              </button>
            )}

            <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 px-4 py-2.5 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <ImageIcon
                    size={14}
                    className="flex-shrink-0 text-green-600 dark:text-green-400"
                  />
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {fileName}
                  </p>
                </div>
                
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => uploadRef.current?.click()}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 px-6 py-14"
          >
            <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
              <div className="flex gap-3">
                <Upload
                  size={24}
                  className="text-green-600 dark:text-green-400"
                />
                <Camera
                  size={24}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
                {t("uploadOrTakePhoto")}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t("supportedFormats")}
              </p>
            </div>
          </button>
        )}
      </div>

      {/* ── ACTION BUTTONS ── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => uploadRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-green-600 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/30"
        >
          <Upload size={17} />
          {hasPreview ? t("changePhoto") : t("uploadPhoto")}
        </button>

        <button
          type="button"
          onClick={openCamera}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md"
        >
          <Camera size={17} />
          {hasPreview ? t("retakePhoto") : t("takePhotoBtn")}
        </button>
      </div>
    </div>
  );
}