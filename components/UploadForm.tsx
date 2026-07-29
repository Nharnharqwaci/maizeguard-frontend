"use client";

import { Upload, Camera, X, ImageIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";

type Language = "en" | "tw" | "dag";

const T: Record<string, Record<Language, string>> = {
  takePhoto: {
    en: "Take a Photo",
    tw: "Twa Mfonini",
    dag: "Twa Nimli",
  },
  cameraPermissionDenied: {
    en: "Camera permission denied. Please allow camera access in your browser settings.",
    tw: "Wɔanka camera ho kwan. Yɛsrɛ wo ma camera kwan wɔ wo browser settings mu.",
    dag: "Camera kpeema biɛla. Yɛn camera kpeema wɔ browser settings ni.",
  },
  cameraAccessFailed: {
    en: "Could not access camera. Please use the Upload option instead.",
    tw: "Ɛntumi nnyaa camera. Yɛsrɛ wo fa Upload no fa so.",
    dag: "N-tum nya camera. Yɛn Upload option ni.",
  },
  close: {
    en: "Close",
    tw: "To mu",
    dag: "To",
  },
  cancel: {
    en: "Cancel",
    tw: "Gyae",
    dag: "Gyae",
  },
  capturePhoto: {
    en: "Capture Photo",
    tw: "Twa Mfonini",
    dag: "Twa Nimli",
  },
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
  useButtonsBelow: {
    en: "Use the buttons below to get started",
    tw: "Fa buttons a ɛwɔ aseɛ ha no fa ahyɛ aseɛ",
    dag: "Zaŋ buttons niŋ ase",
  },
  changePhoto: {
    en: "Change Photo",
    tw: "Sesa Mfonini",
    dag: "Sɔŋ Nimli",
  },
  uploadPhoto: {
    en: "Upload Photo",
    tw: "Twe Mfonini",
    dag: "Zaŋ Nimli",
  },
  retakePhoto: {
    en: "Retake Photo",
    tw: "San Twa Mfonini",
    dag: "Twa Nimli Labi",
  },
  takePhotoBtn: {
    en: "Take Photo",
    tw: "Twa Mfonini",
    dag: "Twa Nimli",
  },
  removePhoto: {
    en: "Remove",
    tw: "Yi",
    dag: "Yi",
  },
};

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

  const t = (key: string) => T[key]?.[language] ?? key;

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
    e.target.value = "";
  };

  const openCamera = async () => {
    if (isMobile) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.setAttribute("capture", "environment");
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) onFileSelect(file);
      };
      input.click();
      return;
    }

    setCameraError("");
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 }
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
      onFileSelect(file);
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

      {/* ── CAMERA MODAL ── */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Camera size={18} className="text-green-600" />
                {t("takePhoto")}
              </h3>
              <button
                onClick={closeCamera}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            {cameraError ? (
              <div className="p-6 text-center">
                <p className="text-red-500 text-sm mb-4">{cameraError}</p>
                <button
                  onClick={closeCamera}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-medium"
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
                    className="w-full max-h-96 object-contain"
                  />
                </div>
                <div className="flex justify-center gap-4 p-5">
                  <button
                    onClick={closeCamera}
                    className="px-6 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition flex items-center gap-2"
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
          ${hasPreview
            ? "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm"
            : "bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50/30 dark:hover:bg-green-950/20"
          }
        `}
      >
        {hasPreview ? (
          /* ── IMAGE PREVIEW STATE ── */
          <div className="relative group">
            {/* Image fills width, capped height, no awkward whitespace */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <img
                src={preview}
                alt="Selected leaf"
                className="w-full max-h-80 object-contain"
              />
            </div>

            {/* Top-right remove button */}
            {onClear && (
              <button
                onClick={onClear}
                className="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg backdrop-blur-sm border border-slate-200 dark:border-slate-600"
                title={t("removePhoto")}
              >
                <X size={16} />
              </button>
            )}

            {/* Bottom info bar — clean, minimal */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 px-4 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <ImageIcon size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-sm text-slate-700 dark:text-slate-200 font-medium truncate">
                    {fileName}
                  </p>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 hidden sm:inline">
                  Ready to analyze
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ── EMPTY / DROPZONE STATE ── */
          <button
            onClick={() => uploadRef.current?.click()}
            className="w-full py-14 px-6 flex flex-col items-center justify-center gap-3 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-1">
              <div className="flex gap-3">
                <Upload size={24} className="text-green-600 dark:text-green-400" />
                <Camera size={24} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
                {t("uploadOrTakePhoto")}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
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
          className="flex items-center justify-center gap-2 border-2 border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 py-3 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-green-950/30 transition text-sm"
        >
          <Upload size={17} />
          {hasPreview ? t("changePhoto") : t("uploadPhoto")}
        </button>

        <button
          type="button"
          onClick={openCamera}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition text-sm shadow-sm hover:shadow-md"
        >
          <Camera size={17} />
          {hasPreview ? t("retakePhoto") : t("takePhotoBtn")}
        </button>
      </div>
    </div>
  );
}