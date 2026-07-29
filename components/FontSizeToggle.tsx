"use client";

import { useState, useEffect } from "react";
import { Type, Minus, Plus } from "lucide-react";

type FontSize = "small" | "normal" | "large" | "xl";

const SIZES: FontSize[] = ["small", "normal", "large", "xl"];

const SIZE_LABELS: Record<FontSize, string> = {
  small: "A",
  normal: "A",
  large: "A",
  xl: "A",
};

const SIZE_CLASSES: Record<FontSize, string> = {
  small: "text-[14px]",
  normal: "text-[16px]",
  large: "text-[18px]",
  xl: "text-[20px]",
};

function getStoredSize(): FontSize {
  if (typeof window === "undefined") return "normal";
  const stored = localStorage.getItem("mg-font-size") as FontSize | null;
  return stored && SIZES.includes(stored) ? stored : "normal";
}

function applySize(size: FontSize) {
  const html = document.documentElement;
  html.classList.remove("font-small", "font-normal", "font-large", "font-xl");
  html.classList.add(`font-${size}`);
}

export function useFontSize() {
  const [size, setSizeState] = useState<FontSize>("normal");

  useEffect(() => {
    const stored = getStoredSize();
    setSizeState(stored);
    applySize(stored);
  }, []);

  const setSize = (next: FontSize) => {
    localStorage.setItem("mg-font-size", next);
    applySize(next);
    setSizeState(next);
  };

  const cycleSize = () => {
    const idx = SIZES.indexOf(size);
    const next = SIZES[(idx + 1) % SIZES.length];
    setSize(next);
  };

  return { size, setSize, cycleSize };
}

/* ── Compact toggle for navbar ── */
export function FontSizeToggle() {
  const { size, cycleSize } = useFontSize();

  const scaleMap: Record<FontSize, number> = { small: 0, normal: 1, large: 2, xl: 3 };
  const scale = scaleMap[size];

  return (
    <button
      onClick={cycleSize}
      aria-label={`Font size: ${size}. Click to change.`}
      title={`Font size: ${size}`}
      className="relative flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
    >
      <span
        className="font-bold leading-none"
        style={{ fontSize: `${14 + scale * 2}px` }}
      >
        A
      </span>
      <span className="absolute -bottom-0.5 -right-0.5 flex">
        {scale > 0 && <Plus size={10} className="text-green-600 dark:text-green-400" />}
      </span>
    </button>
  );
}

/* ── Detailed picker (for settings page or mobile drawer) ── */
export function FontSizePicker() {
  const { size, setSize } = useFontSize();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-1">
      {SIZES.map((s) => (
        <button
          key={s}
          onClick={() => setSize(s)}
          aria-label={`Set font size to ${s}`}
          className={`rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors ${
            size === s
              ? "bg-green-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
          style={{ fontSize: s === "small" ? "11px" : s === "normal" ? "13px" : s === "large" ? "15px" : "17px" }}
        >
          A
        </button>
      ))}
    </div>
  );
}
