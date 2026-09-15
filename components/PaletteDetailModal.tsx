'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Check,
  Shuffle,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Palette,
  ColorFormat,
  SwatchColor,
  createSwatchFromHex,
  exportAsHexList,
  shuffleSingleSwatch,
} from '@/lib/color-engine';
import { useToast } from './Toast';
import SlidingColorPicker from './SlidingColorPicker';

interface PaletteDetailModalProps {
  palette: Palette | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePalette?: (updated: Palette) => void;
}

export default function PaletteDetailModal({
  palette,
  isOpen,
  onClose,
  onUpdatePalette,
}: PaletteDetailModalProps) {
  const { showToast } = useToast();
  const [prevPaletteId, setPrevPaletteId] = useState<string | null>(palette?.id || null);
  const [currentPalette, setCurrentPalette] = useState<Palette | null>(palette);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Active sliding color picker index
  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(null);

  // Format per color bar (index -> 'hex' | 'rgb' | 'hsl')
  const [barFormats, setBarFormats] = useState<Record<number, ColorFormat>>({});

  // Adjust state during render when a different palette is selected
  if (palette && palette.id !== prevPaletteId) {
    setPrevPaletteId(palette.id);
    setCurrentPalette(palette);
    setBarFormats({});
    setCopiedIndex(null);
    setCopiedAll(false);
    setActivePickerIndex(null);
  }

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activePickerIndex !== null) {
          setActivePickerIndex(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, activePickerIndex]);

  // Lock background body scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !currentPalette) return null;

  const getBarColorValue = (swatch: SwatchColor, format: ColorFormat): string => {
    switch (format) {
      case 'rgb':
        return swatch.rgb;
      case 'hsl':
        return swatch.hsl;
      case 'hex':
      default:
        return swatch.hex;
    }
  };

  const handleSetFormat = (index: number, format: ColorFormat) => {
    setBarFormats((prev) => ({ ...prev, [index]: format }));
  };

  // Copy individual color
  const handleCopyColor = (index: number, swatch: SwatchColor) => {
    const format = barFormats[index] || 'hex';
    const value = getBarColorValue(swatch, format);
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    showToast(`Copied ${value}`, `${swatch.name} (${format.toUpperCase()})`, swatch.hex);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };

  // Copy all colors
  const handleCopyAll = () => {
    const hexList = exportAsHexList(currentPalette);
    navigator.clipboard.writeText(hexList);
    setCopiedAll(true);
    showToast('Copied All Colors', hexList, currentPalette.colors[0]?.hex);

    setTimeout(() => {
      setCopiedAll(false);
    }, 1500);
  };

  // Open Sliding Color Picker
  const handleOpenPicker = (index: number) => {
    setActivePickerIndex(index);
  };

  // Confirm color selection ONLY when user clicks "DONE" in sliding picker
  const handlePickerConfirm = (index: number, finalSwatch: SwatchColor) => {
    if (!currentPalette) return;
    const updatedColors = [...currentPalette.colors];
    updatedColors[index] = finalSwatch;

    const darkCount = updatedColors.filter((c) => c.isDark).length;
    const isDarkTheme = darkCount >= Math.ceil(updatedColors.length / 2);

    const updatedPalette: Palette = {
      ...currentPalette,
      colors: updatedColors,
      isDarkTheme,
      primaryFamily: updatedColors[0]?.family,
    };

    setCurrentPalette(updatedPalette);
    onUpdatePalette?.(updatedPalette);
    setActivePickerIndex(null);
    showToast(`Saved Color: ${finalSwatch.name}`, finalSwatch.hex, finalSwatch.hex);
  };

  // Cancel color picker: simply dismiss without modifying the palette
  const handlePickerCancel = () => {
    setActivePickerIndex(null);
  };

  // Live color shuffle for this individual bar
  const handleShuffleColor = (index: number) => {
    if (!currentPalette) return;
    const targetSwatch = currentPalette.colors[index];
    const shuffledSwatch = shuffleSingleSwatch(targetSwatch);
    const updatedColors = [...currentPalette.colors];
    updatedColors[index] = shuffledSwatch;

    const darkCount = updatedColors.filter((c) => c.isDark).length;
    const isDarkTheme = darkCount >= Math.ceil(updatedColors.length / 2);

    const updatedPalette: Palette = {
      ...currentPalette,
      colors: updatedColors,
      isDarkTheme,
      primaryFamily: updatedColors[0]?.family,
    };

    setCurrentPalette(updatedPalette);
    onUpdatePalette?.(updatedPalette);
    showToast(`Shuffled to ${shuffledSwatch.name}`, shuffledSwatch.hex, shuffledSwatch.hex);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Large Modal Container with crisp contrast borders */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
          className="relative w-[96vw] max-w-5xl xl:max-w-6xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shrink-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  {currentPalette.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize border border-slate-200 dark:border-slate-700 shrink-0">
                  {currentPalette.colors.length} Swatches
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize border border-slate-200 dark:border-slate-700 shrink-0 hidden xs:inline">
                  {currentPalette.harmony}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                ColorKit Studio • Copy, Slide Live, and Shuffle controls
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Copy All Button */}
              <button
                id="modal-copy-all-btn"
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-all shadow-xs cursor-pointer select-none"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy All</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                id="modal-close-button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Color Bars Body:
              - Desktop (md:): Colors are VERTICAL columns side-by-side with zero gaps
              - Mobile (<md): Colors are HORIZONTAL bars with MORE HEIGHT, dropdown select for HEX/RGB/HSL, and HORIZONTAL Copy, Shuffle, and Edit buttons at the center right side
          */}
          <div className="p-2.5 sm:p-4 md:p-5 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="w-full flex-1 flex flex-col md:flex-row rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-md min-h-0 overflow-y-auto md:overflow-y-hidden">
              {currentPalette.colors.map((swatch, idx) => {
                const currentFormat = barFormats[idx] || 'hex';
                const displayValue = getBarColorValue(swatch, currentFormat);
                const isCopied = copiedIndex === idx;

                const textColorClass = swatch.isDark ? 'text-white' : 'text-neutral-900';
                const pillBgClass = swatch.isDark
                  ? 'bg-black/40 hover:bg-black/55 text-white border-white/20'
                  : 'bg-white/80 hover:bg-white/95 text-neutral-900 border-black/15';
                const activeFormatClass = swatch.isDark
                  ? 'bg-white text-neutral-900 font-bold shadow-xs'
                  : 'bg-neutral-900 text-white font-bold shadow-xs';
                const inactiveFormatClass = swatch.isDark
                  ? 'text-white/70 hover:text-white'
                  : 'text-neutral-700 hover:text-neutral-950';

                return (
                  <div
                    key={`bar-${idx}-${swatch.hex}`}
                    id={`modal-color-bar-${idx}`}
                    className="w-full md:flex-1 min-h-[64px] sm:min-h-[72px] md:min-h-[480px] md:h-full px-3 sm:px-4 md:px-3 py-3 sm:py-3.5 md:py-6 flex flex-row md:flex-col items-center md:items-center justify-between gap-2 md:gap-0 transition-colors relative overflow-hidden group border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 last:border-b-0 md:last:border-r-0"
                    style={{ backgroundColor: swatch.hex }}
                  >
                    {/* ========================================================= */}
                    {/* DESKTOP LAYOUT (md:): Vertical Swatch Column               */}
                    {/* ========================================================= */}
                    <div className="hidden md:flex flex-col items-center justify-between h-full w-full py-2 px-1">
                      {/* Top: Swatch Index Pill, Color Code, Small Space, and Format Toggle directly underneath */}
                      <div className="flex flex-col items-center text-center w-full shrink-0 pt-1">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold backdrop-blur-md border shadow-2xs ${pillBgClass}`}
                        >
                          #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>

                        {/* Color Code */}
                        <span
                          className={`text-sm lg:text-base font-mono font-bold tracking-wider select-all mt-2.5 transition-all ${textColorClass}`}
                        >
                          {displayValue}
                        </span>

                        {/* Small space, then HEX / RGB / HSL toggle right under the color code */}
                        <div className="mt-2.5">
                          <div
                            className={`flex items-center p-0.5 rounded-xl backdrop-blur-md border shadow-md transition-colors ${
                              swatch.isDark
                                ? 'bg-black/55 border-white/25 text-white'
                                : 'bg-white/95 border-black/20 text-slate-900'
                            }`}
                          >
                            {(['hex', 'rgb', 'hsl'] as ColorFormat[]).map((fmt) => {
                              const isSelected = currentFormat === fmt;
                              return (
                                <button
                                  key={fmt}
                                  id={`bar-${idx}-format-${fmt}-desktop`}
                                  onClick={() => handleSetFormat(idx, fmt)}
                                  className={`px-2.5 py-1 text-[11px] font-mono uppercase font-bold rounded-lg transition-all cursor-pointer ${
                                    isSelected
                                      ? swatch.isDark
                                        ? 'bg-white text-slate-950 shadow-md font-black scale-105'
                                        : 'bg-slate-900 text-white shadow-md font-black scale-105'
                                      : swatch.isDark
                                        ? 'text-white/75 hover:text-white hover:bg-white/15'
                                        : 'text-slate-700 hover:text-slate-950 hover:bg-black/10'
                                  }`}
                                >
                                  {fmt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Large space between color codes toggle and the action buttons below */}
                      <div className="flex-1 w-full min-h-[36px] lg:min-h-[54px]" />

                      {/* Bottom: Action buttons (Copy, Edit, Shuffle) moved down and kept vertical */}
                      <div className="flex flex-col items-center justify-center gap-3 pb-2 shrink-0">
                        {/* 1. Copy */}
                        <button
                          id={`bar-${idx}-copy-btn-desktop`}
                          onClick={() => handleCopyColor(idx, swatch)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                            swatch.isDark
                              ? 'bg-black/50 hover:bg-black/70 text-white border-white/25 hover:border-white/40'
                              : 'bg-white/90 hover:bg-white text-slate-900 border-black/20 hover:border-black/35'
                          }`}
                          title={`Copy ${displayValue}`}
                          aria-label={`Copy ${displayValue}`}
                        >
                          {isCopied ? (
                            <Check className="w-4.5 h-4.5 text-emerald-400 stroke-[2.5]" />
                          ) : (
                            <Copy className="w-4.5 h-4.5" />
                          )}
                        </button>

                        {/* 2. Slide to Change Color Live (SlidersHorizontal) */}
                        <button
                          id={`bar-${idx}-edit-btn-desktop`}
                          onClick={() => handleOpenPicker(idx)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                            swatch.isDark
                              ? 'bg-black/50 hover:bg-black/70 text-white border-white/25 hover:border-white/40'
                              : 'bg-white/90 hover:bg-white text-slate-900 border-black/20 hover:border-black/35'
                          }`}
                          title="Slide to change color live"
                          aria-label="Slide to change color live"
                        >
                          <SlidersHorizontal className="w-4.5 h-4.5" />
                        </button>

                        {/* 3. Shuffle */}
                        <button
                          id={`bar-${idx}-shuffle-btn-desktop`}
                          onClick={() => handleShuffleColor(idx)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                            swatch.isDark
                              ? 'bg-black/50 hover:bg-black/70 text-white border-white/25 hover:border-white/40'
                              : 'bg-white/90 hover:bg-white text-slate-900 border-black/20 hover:border-black/35'
                          }`}
                          title="Shuffle color"
                          aria-label="Shuffle color"
                        >
                          <Shuffle className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* ========================================================= */}
                    {/* MOBILE LAYOUT (<md): Compact Single Line Bar with Extra H  */}
                    {/* Without Names, Format select beside Copy, Edit, Shuffle   */}
                    {/* ========================================================= */}
                    <div className="flex md:hidden items-center justify-between w-full h-full gap-2">
                      {/* Left: Swatch Index and Color Code only (No color names) */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`px-2 py-1 rounded-md text-[11px] font-mono font-extrabold backdrop-blur-md border shrink-0 ${pillBgClass}`}
                        >
                          #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <span
                          className={`text-sm sm:text-base font-mono font-bold tracking-tight truncate select-all ${textColorClass}`}
                        >
                          {displayValue}
                        </span>
                      </div>

                      {/* Right: Controls lined up (Format Select beside Copy, Edit, Shuffle) */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Mobile Format Select Dropdown */}
                        <div className="relative">
                          <label htmlFor={`bar-${idx}-format-select-mobile`} className="sr-only">
                            Color format
                          </label>
                          <select
                            id={`bar-${idx}-format-select-mobile`}
                            value={currentFormat}
                            onChange={(e) =>
                              handleSetFormat(idx, e.target.value as ColorFormat)
                            }
                            className={`h-8 pl-2.5 pr-6 text-[11px] font-mono font-bold uppercase rounded-lg border backdrop-blur-md cursor-pointer appearance-none transition-colors ${pillBgClass}`}
                          >
                            <option value="hex" className="text-slate-900 bg-white">
                              HEX
                            </option>
                            <option value="rgb" className="text-slate-900 bg-white">
                              RGB
                            </option>
                            <option value="hsl" className="text-slate-900 bg-white">
                              HSL
                            </option>
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70 text-[9px] font-bold">
                            ▼
                          </div>
                        </div>

                        {/* 1. Copy Button */}
                        <button
                          id={`bar-${idx}-copy-btn-mobile`}
                          onClick={() => handleCopyColor(idx, swatch)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md border shadow-xs transition-transform active:scale-95 cursor-pointer ${
                            swatch.isDark
                              ? 'bg-black/50 hover:bg-black/70 text-white border-white/20'
                              : 'bg-white/90 hover:bg-white text-slate-900 border-black/15'
                          }`}
                          title={`Copy ${displayValue}`}
                          aria-label={`Copy ${displayValue}`}
                        >
                          {isCopied ? (
                            <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* 2. Slide Live Color Picker Button */}
                        <button
                          id={`bar-${idx}-edit-btn-mobile`}
                          onClick={() => handleOpenPicker(idx)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md border shadow-xs transition-transform active:scale-95 cursor-pointer ${
                            swatch.isDark
                              ? 'bg-black/50 hover:bg-black/70 text-white border-white/20'
                              : 'bg-white/90 hover:bg-white text-slate-900 border-black/15'
                          }`}
                          title="Slide to change color live"
                          aria-label="Slide to change color live"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>

                        {/* 3. Shuffle Button */}
                        <button
                          id={`bar-${idx}-shuffle-btn-mobile`}
                          onClick={() => handleShuffleColor(idx)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md border shadow-xs transition-transform active:scale-95 cursor-pointer ${
                            swatch.isDark
                              ? 'bg-black/50 hover:bg-black/70 text-white border-white/20'
                              : 'bg-white/90 hover:bg-white text-slate-900 border-black/15'
                          }`}
                          title="Shuffle color"
                          aria-label="Shuffle color"
                        >
                          <Shuffle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="px-5 py-2.5 sm:py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Color Studio: customize shades with sliders, then click DONE to save.</span>
            </div>
            <span className="hidden sm:inline font-mono text-[10px] text-slate-400">Press Esc to close</span>
          </div>
        </motion.div>
      </div>

      {/* Live Sliding Color Picker Modal */}
      {activePickerIndex !== null && currentPalette.colors[activePickerIndex] && (
        <SlidingColorPicker
          isOpen={true}
          swatchIndex={activePickerIndex}
          initialSwatch={currentPalette.colors[activePickerIndex]}
          onConfirm={handlePickerConfirm}
          onCancel={handlePickerCancel}
        />
      )}
    </AnimatePresence>
  );
}
