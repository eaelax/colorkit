'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { Palette, SwatchColor, ColorFormat, getDisplayColorValue } from '@/lib/color-engine';
import Tooltip from './Tooltip';

interface PaletteCardProps {
  palette: Palette;
  onOpenExport: (palette: Palette) => void;
  onOpenDetail?: (palette: Palette) => void;
  globalFormat?: ColorFormat;
}

function PaletteCard({
  palette,
  onOpenExport,
  onOpenDetail,
  globalFormat = 'hex',
}: PaletteCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [localFormat, setLocalFormat] = useState<ColorFormat | null>(null);

  const activeFormat = localFormat || globalFormat;

  const showToast = useCallback((msg: string, sub?: string) => {
    window.dispatchEvent(
      new CustomEvent('colorkit-toast', {
        detail: { message: msg, subMessage: sub },
      })
    );
  }, []);

  const handleCopySwatch = (swatch: SwatchColor, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const val = getDisplayColorValue(swatch, activeFormat);
    navigator.clipboard.writeText(val);
    setCopiedIndex(index);
    showToast(`Copied ${val}`, swatch.name);
    setTimeout(() => {
      setCopiedIndex((prev) => (prev === index ? null : prev));
    }, 1800);
  };

  const handleCopyAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const codes = palette.colors
      .map((c) => getDisplayColorValue(c, activeFormat))
      .join(', ');
    navigator.clipboard.writeText(codes);
    setCopiedAll(true);
    showToast(`Copied ${palette.colors.length} color codes`, palette.title);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const cycleFormat = (e: React.MouseEvent) => {
    e.stopPropagation();
    const formats: ColorFormat[] = ['hex', 'rgb', 'hsl'];
    const currentIdx = formats.indexOf(activeFormat);
    const nextFormat = formats[(currentIdx + 1) % formats.length];
    setLocalFormat(nextFormat);
    showToast(`Format: ${nextFormat.toUpperCase()}`, palette.title);
  };

  return (
    <div
      id={`palette-card-${palette.id}`}
      className="group relative flex flex-col bg-white dark:bg-[#141c2e] rounded-xl border-2 border-slate-200 dark:border-slate-700/80 shadow-md hover:shadow-xl transition-all duration-150 overflow-hidden hover:border-slate-400 dark:hover:border-slate-500 ring-1 ring-black/5 dark:ring-white/10"
    >
      {/* Swatches Area */}
      <div className="relative h-[155px] sm:h-[170px] md:h-[185px] w-full flex flex-row overflow-hidden bg-slate-100 dark:bg-slate-950">
        {palette.colors.map((swatch, idx) => {
          const isCopied = copiedIndex === idx;
          const isSixColors = palette.colors.length >= 6;
          const displayValue = getDisplayColorValue(swatch, activeFormat);
          const textColor = swatch.isDark ? '#FFFFFF' : '#0F172A';

          // For 6 colors count, display half part with ... like #00... to prevent overflow and stay readable
          const swatchDisplayLabel =
            isSixColors && activeFormat === 'hex'
              ? `${swatch.hex.slice(0, 3)}...`
              : isSixColors
              ? `${swatch.hex.slice(0, 3)}...`
              : displayValue;

          return (
            <Tooltip
              key={`${palette.id}-color-${idx}`}
              content={`Copy ${displayValue} (${swatch.name})`}
              className="flex-1 min-w-0 h-full flex"
            >
              <div
                id={`swatch-${palette.id}-${idx}`}
                onClick={(e) => handleCopySwatch(swatch, idx, e)}
                className="relative w-full h-full min-w-0 flex flex-col justify-end px-0.5 sm:px-1 py-2 transition-colors duration-150 cursor-pointer group/swatch select-none overflow-hidden"
                style={{ backgroundColor: swatch.hex }}
              >
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover/swatch:opacity-15 bg-white transition-opacity pointer-events-none" />

                {/* Centered Copy Icon with check feedback */}
                <div
                  className={`absolute inset-0 m-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md pointer-events-none z-20 ${
                    isCopied
                      ? 'opacity-100 scale-100 bg-black/80 text-white ring-2 ring-white/70'
                      : 'opacity-0 group-hover/swatch:opacity-90 scale-75 group-hover/swatch:scale-100 bg-black/50 text-white'
                  }`}
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </div>

                {/* Color details in swatch bottom (readable size on mobile, #00... for 6 colors) */}
                <div className="z-10 w-full min-w-0 flex flex-col items-center overflow-hidden pb-1 px-0.5">
                  <span
                    className={`font-mono font-bold tracking-tight truncate transition-all block w-full text-center ${
                      isSixColors
                        ? 'text-[11px] sm:text-xs md:text-xs'
                        : 'text-xs sm:text-xs md:text-sm'
                    } ${isCopied ? 'scale-105 underline' : ''}`}
                    style={{ color: textColor }}
                  >
                    {swatchDisplayLabel}
                  </span>
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>

      {/* Card Info & Actions Footer - High contrast distinct surface */}
      <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2 bg-slate-50/95 dark:bg-[#0e1524] border-t-2 border-slate-200 dark:border-slate-700/80">
        <div className="min-w-0 flex-1">
          <h4
            id={`palette-title-${palette.id}`}
            onClick={() => onOpenDetail?.(palette)}
            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer leading-snug tracking-tight group/title truncate"
          >
            <span className="hover:underline">{palette.title}</span>
          </h4>

          <div className="flex items-center gap-2 mt-1">
            {/* Clickable format pill */}
            <Tooltip content="Click to cycle format: HEX -> RGB -> HSL">
              <button
                id={`format-toggle-${palette.id}`}
                onClick={cycleFormat}
                className="text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 hover:underline cursor-pointer shrink-0"
              >
                <span className="font-bold uppercase">{activeFormat}</span>
                <span className="text-[10px] text-slate-400">↻</span>
              </button>
            </Tooltip>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
              {palette.colors.length} colors
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Copy Hexes */}
          <Tooltip content={copiedAll ? 'Copied all colors!' : 'Copy all color codes'}>
            <button
              id={`copy-all-btn-${palette.id}`}
              onClick={handleCopyAll}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-100 dark:bg-[#1a233a] dark:hover:bg-[#253252] border border-slate-300 dark:border-slate-600 shadow-2xs transition-colors cursor-pointer"
            >
              {copiedAll ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span className="hidden xs:inline">{copiedAll ? 'Copied' : 'Copy'}</span>
            </button>
          </Tooltip>

          {/* Export modal button */}
          <Tooltip content="Export palette (CSS, Tailwind, SVG, JSON)">
            <button
              id={`export-btn-${palette.id}`}
              onClick={() => onOpenExport(palette)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-100 dark:bg-[#1a233a] dark:hover:bg-[#253252] border border-slate-300 dark:border-slate-600 shadow-2xs transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden xs:inline">Export</span>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PaletteCard);
