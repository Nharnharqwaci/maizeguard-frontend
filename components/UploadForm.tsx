"use client";

import { Upload, Camera, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface UploadFormProps {
  preview: string;
  fileName: string;
  onFileSelect: (file: File) => void;
}

export default function UploadForm({
  preview,
  fileName,
  onFileSelect,
}: UploadFormProps) {
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

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
      // on mobile use file input with capture
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

    // desktop — use getUserMedia
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
          ? "Camera permission denied. Please allow camera access in your browser settings."
          : "Could not access camera. Please use the Upload option instead."
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

  return (
    <div className="space-y-3">

      {/* Hidden upload input */}
      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="sr-only"
      />

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Camera size={18} className="text-green-600" />
                Take a Photo
              </h3>
              <button
                onClick={closeCamera}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Camera error */}
            {cameraError ? (
              <div className="p-6 text-center">
                <p className="text-red-500 text-sm mb-4">{cameraError}</p>
                <button
                  onClick={closeCamera}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-medium"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Video feed */}
                <div className="relative bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full max-h-96 object-contain"
                  />
                </div>

                {/* Capture button */}
                <div className="flex justify-center gap-4 p-5">
                  <button
                    onClick={closeCamera}
                    className="px-6 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition flex items-center gap-2"
                  >
                    <Camera size={18} />
                    Capture Photo
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Preview box */}
      <div className="relative border-2 border-dashed border-green-400 dark:border-green-600 rounded-xl overflow-hidden h-72 transition hover:border-green-600 dark:hover:border-green-400">
        {preview ? (
          <div className="relative h-full">
            <img
              src={preview}
              alt="Selected leaf"
              className="w-full h-full object-contain bg-slate-50 dark:bg-slate-800"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 flex items-center justify-between">
              <p className="font-medium text-sm truncate">{fileName}</p>
              <span className="text-xs opacity-70 ml-2">
                Use buttons below to change
              </span>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-green-50 dark:bg-green-950 p-6 text-center">
            <div className="flex gap-4 mb-4">
              <Upload size={36} className="text-green-500" />
              <Camera size={36} className="text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Upload or Take a Photo
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              JPG, JPEG, PNG supported
            </p>
            <p className="text-green-700 dark:text-green-400 mt-1 text-sm font-medium">
              Use the buttons below to get started
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => uploadRef.current?.click()}
          className="flex items-center justify-center gap-2 border-2 border-green-500 dark:border-green-600 text-green-700 dark:text-green-400 py-3 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-green-950 transition text-sm"
        >
          <Upload size={17} />
          {preview ? "Change Photo" : "Upload Photo"}
        </button>

        <button
          type="button"
          onClick={openCamera}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition text-sm"
        >
          <Camera size={17} />
          {preview ? "Retake Photo" : "Take Photo"}
        </button>
      </div>

    </div>
  );
}