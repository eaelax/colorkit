'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, SlidersHorizontal, RotateCcw, Copy } from 'lucide-react';
import {
  SwatchColor,
  createSwatch,
  createSwatchFromHex,
  hexToRgb,
  rgbToHsl,
} from '@/lib/color-engine';

interface SlidingColorPickerProps {
  isOpen: boolean;
  swatchIndex: number;
  initialSwatch: SwatchColor;
  onConfirm: (swatchIndex: number, finalSwatch: SwatchColor) => void;
  onCancel: () => void;
}

export default function SlidingColorPicker({
  isOpen,
  swatchIndex,
  initialSwatch,
  onConfirm,
  onCancel,
}: SlidingColorPickerProps) {
  // Original reference to display side-by-side; remains fixed until user selects another swatch
  const [originalSwatch, setOriginalSwatch] = useState<SwatchColor>(initialSwatch);

  // HSL slider values
  const [h, setH] = useState<number>(initialSwatch.h);
  const [s, setS] = useState<number>(initialSwatch.s);
  const [l, setL] = useState<number>(initialSwatch.l);

  // Live computed swatch for real-time preview
  const [currentSwatch, setCurrentSwatch] = useState<SwatchColor>(initialSwatch);
  const [hexInput, setHexInput] = useState<string>(initialSwatch.hex);
  const [copied, setCopied] = useState(false);
  const [prevTargetIndex, setPrevTargetIndex] = useState<number>(swatchIndex);

  // Reset when opening picker for a different swatch index
  if (swatchIndex !== prevTargetIndex) {
    setPrevTargetIndex(swatchIndex);
    setOriginalSwatch(initialSwatch);
    setH(initialSwatch.h);
    setS(initialSwatch.s);
    setL(initialSwatch.l);
    setCurrentSwatch(initialSwatch);
    setHexInput(initialSwatch.hex);
    setCopied(false);
  }

  // Live color calculation when sliders move (previews inside modal without mutating parent palette)
  const updateFromHsl = useCallback((newH: number, newS: number, newL: number) => {
    const clampedH = Math.round(((newH % 360) + 360) % 360);
    const clampedS = Math.round(Math.max(0, Math.min(100, newS)));
    const clampedL = Math.round(Math.max(4, Math.min(96, newL)));

    setH(clampedH);
    setS(clampedS);
    setL(clampedL);

    const nextSwatch = createSwatch(clampedH, clampedS, clampedL);
    setCurrentSwatch(nextSwatch);
    setHexInput(nextSwatch.hex);
  }, []);

  // Direct Hex Input handler
  const handleHexInputChange = (value: string) => {
    setHexInput(value);
    const cleanHex = value.startsWith('#') ? value : `#${value}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      try {
        const [r, g, b] = hexToRgb(cleanHex);
        const [newH, newS, newL] = rgbToHsl(r, g, b);
        setH(newH);
        setS(newS);
        setL(newL);
        const nextSwatch = createSwatchFromHex(cleanHex);
        setCurrentSwatch(nextSwatch);
      } catch {
        // Invalid color parsing ignored
      }
    }
  };

  // Copy current hex
  const handleCopyHex = () => {
    navigator.clipboard.writeText(currentSwatch.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2 min-w-0">
            <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
              Live Color Slider • Swatch #{swatchIndex + 1}
            </span>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cancel and close"
            aria-label="Cancel and close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Swatch Preview with Original Comparison */}
        <div className="p-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
            {/* Original */}
            <div
              className="h-full flex flex-col justify-between p-2 relative select-none"
              style={{ backgroundColor: originalSwatch.hex }}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded backdrop-blur-md self-start ${originalSwatch.isDark ? 'bg-black/40 text-white' : 'bg-white/70 text-slate-900'}`}>
                Original
              </span>
              <span className={`font-mono text-xs font-bold tracking-tight truncate ${originalSwatch.isDark ? 'text-white' : 'text-slate-900'}`}>
                {originalSwatch.hex}
              </span>
            </div>

            {/* Current Live Color */}
            <div
              className="h-full flex flex-col justify-between p-2 relative select-none transition-colors"
              style={{ backgroundColor: currentSwatch.hex }}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded backdrop-blur-md ${currentSwatch.isDark ? 'bg-black/40 text-white' : 'bg-white/70 text-slate-900'}`}>
                  Live
                </span>
                <span className={`text-[10px] font-semibold px-1 py-0.2 rounded truncate max-w-[90px] ${currentSwatch.isDark ? 'text-white/85' : 'text-slate-900/85'}`}>
                  {currentSwatch.name}
                </span>
              </div>
              <span className={`font-mono text-xs font-bold tracking-tight truncate ${currentSwatch.isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentSwatch.hex}
              </span>
            </div>
          </div>

          {/* Hex & Values Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-slate-400">
                #
              </span>
              <input
                type="text"
                value={hexInput.replace('#', '')}
                onChange={(e) => handleHexInputChange(e.target.value)}
                maxLength={6}
                placeholder="HEX"
                className="w-full h-9 pl-6 pr-2 text-xs font-mono font-bold uppercase rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>
            <button
              onClick={handleCopyHex}
              className="h-9 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
              title="Copy HEX"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => updateFromHsl(originalSwatch.h, originalSwatch.s, originalSwatch.l)}
              className="h-9 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400 text-xs flex items-center justify-center shrink-0 cursor-pointer"
              title="Reset to original color"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ============================================================ */}
          {/* SLIDER CONTROLS - Continuous live sliding feedback            */}
          {/* ============================================================ */}
          <div className="space-y-3 pt-1">
            {/* 1. HUE SLIDER (0 - 360) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Hue (Spectrum)</span>
                <span className="font-mono text-slate-500 dark:text-slate-400">{h}°</span>
              </div>
              <input
                id="color-slider-hue"
                type="range"
                min="0"
                max="360"
                step="1"
                value={h}
                onChange={(e) => updateFromHsl(Number(e.target.value), s, l)}
                className="w-full h-4 rounded-lg appearance-none cursor-pointer focus:outline-hidden"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                }}
              />
            </div>

            {/* 2. SATURATION SLIDER (0 - 100) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Saturation</span>
                <span className="font-mono text-slate-500 dark:text-slate-400">{s}%</span>
              </div>
              <input
                id="color-slider-saturation"
                type="range"
                min="0"
                max="100"
                step="1"
                value={s}
                onChange={(e) => updateFromHsl(h, Number(e.target.value), l)}
                className="w-full h-4 rounded-lg appearance-none cursor-pointer focus:outline-hidden"
                style={{
                  background: `linear-gradient(to right, hsl(${h}, 0%, ${l}%), hsl(${h}, 100%, ${l}%))`,
                }}
              />
            </div>

            {/* 3. LIGHTNESS / BRIGHTNESS SLIDER (4 - 96) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Lightness</span>
                <span className="font-mono text-slate-500 dark:text-slate-400">{l}%</span>
              </div>
              <input
                id="color-slider-lightness"
                type="range"
                min="4"
                max="96"
                step="1"
                value={l}
                onChange={(e) => updateFromHsl(h, s, Number(e.target.value))}
                className="w-full h-4 rounded-lg appearance-none cursor-pointer focus:outline-hidden"
                style={{
                  background: `linear-gradient(to right, #000000 0%, hsl(${h}, ${s}%, 50%) 50%, #ffffff 100%)`,
                }}
              />
            </div>
          </div>

          {/* Quick preset tone chips */}
          <div className="pt-1 flex items-center justify-between gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tones:</span>
            {[
              { label: 'Pastel', l: 82, s: 55 },
              { label: 'Vivid', l: 52, s: 95 },
              { label: 'Deep', l: 30, s: 80 },
              { label: 'Muted', l: 50, s: 35 },
              { label: 'Dark', l: 15, s: 60 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => updateFromHsl(h, p.s, p.l)}
                className="flex-1 py-1 px-1 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer with DONE and Cancel buttons */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center gap-2.5">
          <button
            type="button"
            id="color-picker-cancel-btn"
            onClick={onCancel}
            className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            id="color-picker-done-btn"
            onClick={() => onConfirm(swatchIndex, currentSwatch)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>DONE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
