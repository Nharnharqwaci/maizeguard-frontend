// services/inference.ts
import * as ort from "onnxruntime-web";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

// ── ONNX WASM SETUP ──
ort.env.wasm.wasmPaths = "/";
ort.env.wasm.numThreads = 1;

// Prevent WebGPU/JSEP probing (avoids 404 on .jsep.mjs files)
// @ts-ignore
if (ort.env.webgpu) ort.env.webgpu.disabled = true;

const CLASS_NAMES = [
  "Common_Rust",
  "Gray_Leaf_Spot",
  "Healthy",
  "MSV",
  "Northern_Leaf_Blight",
  "Southern_Leaf_Blight",
];

let session: ort.InferenceSession | null = null;

/**
 * Load the ONNX model from public/model.onnx (browser/WASM).
 */
export async function loadModel(): Promise<ort.InferenceSession> {
  if (session) return session;

  try {
    session = await ort.InferenceSession.create("/model.onnx", {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    });
    console.log("[ONNX] Frontend model loaded successfully");
    return session;
  } catch (err: any) {
    console.error("[ONNX] Frontend model load failed:", err);
    throw new Error(
      "Failed to load AI model. Ensure model.onnx is in public/ and ONNX WASM files were copied. Restart Next.js after copying."
    );
  }
}

export interface InferenceResult {
  prediction: string;
  confidence: number; // 0-100 percentage
  all_probs: Record<string, number>; // 0-100 percentages
}

/**
 * PRIMARY: Try frontend ONNX inference.
 * FALLBACK: If frontend fails, send image to backend /api/predict.
 */
export async function runInference(imageFile: File): Promise<InferenceResult> {
  try {
    return await runFrontendInference(imageFile);
  } catch (frontendErr) {
    console.warn(
      "[Inference] Frontend ONNX failed, trying backend fallback...",
      frontendErr
    );
    return await runBackendInference(imageFile);
  }
}

/**
 * Browser-side ONNX inference.
 */
async function runFrontendInference(imageFile: File): Promise<InferenceResult> {
  const sess = await loadModel();
  const objectUrl = URL.createObjectURL(imageFile);

  try {
    const img = await fileToImage(objectUrl);
    const tensor = imageToTensor(img);

    const feeds: Record<string, ort.Tensor> = {};
    feeds[sess.inputNames[0]] = tensor;

    const results = await sess.run(feeds);
    const outputTensor = results[sess.outputNames[0]];
    const probs = outputTensor.data as Float32Array;

    const all_probs: Record<string, number> = {};
    let maxProb = -1;
    let maxIdx = -1;

    for (let i = 0; i < probs.length; i++) {
      const p = Number(probs[i]);
      // Convert to percentage to match display code (width: `${prob}%`)
      all_probs[CLASS_NAMES[i]] = Math.round(p * 10000) / 100;
      if (p > maxProb) {
        maxProb = p;
        maxIdx = i;
      }
    }

    return {
      prediction: CLASS_NAMES[maxIdx],
      confidence: Math.round(maxProb * 10000) / 100,
      all_probs,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Backend fallback inference.
 * Called when browser ONNX is unavailable or crashes.
 */
async function runBackendInference(imageFile: File): Promise<InferenceResult> {
  const formData = new FormData();
  formData.append("file", imageFile);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/predict`, {
    method: "POST",
    body: formData,
    headers,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Backend inference failed (${res.status}): ${errText}`);
  }

  const data = await res.json();

  return {
    prediction: data.prediction,
    confidence: data.confidence,
    all_probs: data.all_probs,
  };
}

function fileToImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to decode image"));
    img.src = src;
  });
}

/**
 * Convert image to [1, 224, 224, 3] Float32 tensor.
 * Assumes your ONNX model has preprocessing baked in.
 */
function imageToTensor(img: HTMLImageElement): ort.Tensor {
  const canvas = document.createElement("canvas");
  canvas.width = 224;
  canvas.height = 224;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, 224, 224);

  const imageData = ctx.getImageData(0, 0, 224, 224);
  const pixels = imageData.data;

  const inputData = new Float32Array(1 * 224 * 224 * 3);
  for (let i = 0; i < 224 * 224; i++) {
    inputData[i * 3 + 0] = pixels[i * 4 + 0];
    inputData[i * 3 + 1] = pixels[i * 4 + 1];
    inputData[i * 3 + 2] = pixels[i * 4 + 2];
  }

  return new ort.Tensor("float32", inputData, [1, 224, 224, 3]);
}