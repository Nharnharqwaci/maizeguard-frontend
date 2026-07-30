// utils/maizeValidator.ts
import * as ort from "onnxruntime-web";

// Point to where you put the WASM files
ort.env.wasm.wasmPaths = "/onnx-wasm/";

let session: ort.InferenceSession | null = null;
let loadPromise: Promise<ort.InferenceSession> | null = null;

const MODEL_PATH = "/models/maize_binary.onnx";
const IMG_SIZE = 224;

/** Load model once and cache it */
export async function loadMaizeModel(): Promise<ort.InferenceSession> {
  if (session) return session;
  if (loadPromise) return loadPromise;

  loadPromise = ort.InferenceSession.create(MODEL_PATH, {
    executionProviders: ["wasm"], // "webgl" is faster if available, but wasm is most compatible
    graphOptimizationLevel: "all",
  });

  session = await loadPromise;
  console.log("[MaizeValidator] Model loaded");
  return session;
}

/** Check if image is maize. Returns probability where >0.5 = Maize */
export async function isMaize(imageFile: File): Promise<{
  isMaize: boolean;
  confidence: number;
}> {
  const sess = await loadMaizeModel();

  // Preprocess: resize → 224x224 → normalize [0,1] → Float32 NHWC
  const tensorData = await preprocessImage(imageFile);
  const inputName = sess.inputNames[0];
  const outputName = sess.outputNames[0];

  const inputTensor = new ort.Tensor("float32", tensorData, [
    1,
    IMG_SIZE,
    IMG_SIZE,
    3,
  ]);
  const feeds: Record<string, ort.Tensor> = { [inputName]: inputTensor };

  const results = await sess.run(feeds);
  const outputData = results[outputName].data as Float32Array;
  const prob = outputData[0]; // sigmoid output: P(Maize)

  return {
    isMaize: prob > 0.5,
    confidence: prob,
  };
}

/** Resize image to 224x224 and normalize pixels to [0, 1] */
async function preprocessImage(file: File): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = IMG_SIZE;
      canvas.height = IMG_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      // Resize with cover-like behavior (center crop feel)
      const scale = Math.max(IMG_SIZE / img.width, IMG_SIZE / img.height);
      const x = (img.width - IMG_SIZE / scale) / 2;
      const y = (img.height - IMG_SIZE / scale) / 2;
      ctx.drawImage(
        img,
        x,
        y,
        IMG_SIZE / scale,
        IMG_SIZE / scale,
        0,
        0,
        IMG_SIZE,
        IMG_SIZE
      );

      const imageData = ctx.getImageData(0, 0, IMG_SIZE, IMG_SIZE);
      const { data } = imageData; // Uint8ClampedArray [R,G,B,A, ...]
      const floatData = new Float32Array(IMG_SIZE * IMG_SIZE * 3);

      for (let i = 0; i < IMG_SIZE * IMG_SIZE; i++) {
        floatData[i * 3] = data[i * 4] / 255.0; // R
        floatData[i * 3 + 1] = data[i * 4 + 1] / 255.0; // G
        floatData[i * 3 + 2] = data[i * 4 + 2] / 255.0; // B
      }

      resolve(floatData);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}