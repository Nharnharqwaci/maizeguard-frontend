const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'node_modules', 'onnxruntime-web', 'dist');
const destDir = path.join(__dirname, 'public');

const files = [
  'ort-wasm-simd-threaded.jsep.mjs',
  'ort-wasm-simd-threaded.jsep.wasm',
  'ort-wasm-simd-threaded.mjs',
  'ort-wasm-simd-threaded.wasm',
  'ort-wasm-simd.mjs',
  'ort-wasm-simd.wasm',
  'ort-wasm-threaded.mjs',
  'ort-wasm-threaded.wasm',
  'ort-wasm.mjs',
  'ort-wasm.wasm',
];

if (!fs.existsSync(srcDir)) {
  console.log('⚠️  onnxruntime-web not installed, skipping WASM copy');
  process.exit(0);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

files.forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied ${file} → public/`);
  }
});