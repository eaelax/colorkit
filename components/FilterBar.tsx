'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, RefreshCw, X, RotateCcw } from 'lucide-react';
import { HarmonyType, ColorFamily, SwatchCount } from '@/lib/color-engine';
import Tooltip from './Tooltip';

interface FilterBarProps {
  selectedHarmony: HarmonyType;
  onSelectHarmony: (harmony: HarmonyType) => void;
  selectedCount: SwatchCount | 0;
  onSelectCount: (count: SwatchCount | 0) => void;
  selectedColorFamily: ColorFamily;
  onSelectColorFamily: (family: ColorFamily) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRegenerate?: () => void;
  onClearFilters?: () => void;
  isFiltered?: boolean;
}

const HARMONY_OPTIONS: { id: HarmonyType; label: string }[] = [
  { id: 'all', label: 'All Harmonies' },
  { id: 'modern-ui', label: 'Modern UI' },
  { id: 'pastel', label: 'Pastel' },
  { id: 'analogous', label: 'Analogous' },
  { id: 'complementary', label: 'Complementary' },
  { id: 'triadic', label: 'Triadic' },
  { id: 'tetradic', label: 'Tetradic' },
  { id: 'split-complementary', label: 'Split Comp' },
  { id: 'neon-night', label: 'Neon Night' },
  { id: 'earthy-vintage', label: 'Earthy Vintage' },
  { id: 'monochromatic', label: 'Monochromatic' },
];

interface ColorFamilyOption {
  id: ColorFamily;
  label: string;
  dotColor: string;
  isRainbow?: boolean;
}

const COLOR_FAMILIES: ColorFamilyOption[] = [
  { id: 'all', label: 'All Colors', dotColor: '', isRainbow: true },
  { id: 'red', label: 'Red', dotColor: '#ef4444' },
  { id: 'orange', label: 'Orange', dotColor: '#f97316' },
  { id: 'yellow', label: 'Yellow', dotColor: '#eab308' },
  { id: 'green', label: 'Green', dotColor: '#22c55e' },
  { id: 'teal', label: 'Teal', dotColor: '#14b8a6' },
  { id: 'blue', label: 'Blue', dotColor: '#3b82f6' },
  { id: 'purple', label: 'Purple', dotColor: '#a855f7' },
  { id: 'pink', label: 'Pink', dotColor: '#ec4899' },
  { id: 'gray', label: 'Slate / Gray', dotColor: '#64748b' },
  { id: 'dark', label: 'Dark', dotColor: '#0f172a' },
  { id: 'light', label: 'Light', dotColor: '#f1f5f9' },
];

const SWATCH_COUNTS: { id: SwatchCount | 0; label: string }[] = [
  { id: 4, label: '4 Colors' },
  { id: 0, label: 'All Counts' },
  { id: 2, label: '2 Colors' },
  { id: 3, label: '3 Colors' },
  { id: 5, label: '5 Colors' },
  { id: 6, label: '6 Colors' },
];

export default function FilterBar({
  selectedHarmony,
  onSelectHarmony,
  selectedCount,
  onSelectCount,
  selectedColorFamily,
  onSelectColorFamily,
  searchQuery,
  onSearchChange,
  onRegenerate,
  onClearFilters,
  isFiltered = false,
}: FilterBarProps) {
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  const activeColorOption =
    COLOR_FAMILIES.find((c) => c.id === selectedColorFamily) || COLOR_FAMILIES[0];

  // Close color dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target as Node)
      ) {
        setIsColorDropdownOpen(false);
      }
    };
    if (isColorDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorDropdownOpen]);

  return (
    <div className="w-full mb-4 bg-white dark:bg-[#12192b] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 sm:p-3 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="palette-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search palettes or hex..."
            className="w-full h-9 pl-9 pr-8 text-xs font-medium rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          {searchQuery && (
            <Tooltip content="Clear search">
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          )}
        </div>

        {/* Filters Group: Colors (with circle), Harmony, Colors Number, Shuffle & Clear */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 overflow-visible">
          {/* 1. Colors Custom Dropdown with Colored Circles */}
          <div className="relative min-w-[130px] flex-1 sm:flex-initial" ref={colorDropdownRef}>
            <button
              id="filter-color-family-btn"
              type="button"
              onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
              className="w-full h-9 px-2.5 flex items-center justify-between gap-2 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                {activeColorOption.isRainbow ? (
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-2xs border border-slate-300 dark:border-slate-600"
                    style={{
                      background:
                        'conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)',
                    }}
                  />
                ) : (
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-2xs border border-black/10 dark:border-white/20"
                    style={{ backgroundColor: activeColorOption.dotColor }}
                  />
                )}
                <span className="truncate">{activeColorOption.label}</span>
              </div>
              <span className="text-[9px] text-slate-400 shrink-0">▼</span>
            </button>

            {/* Dropdown Options Popover */}
            {isColorDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-44 max-h-64 overflow-y-auto bg-white dark:bg-[#151f35] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                {COLOR_FAMILIES.map((c) => {
                  const isSelected = c.id === selectedColorFamily;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onSelectColorFamily(c.id);
                        setIsColorDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 flex items-center gap-2.5 text-xs text-left cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {c.isRainbow ? (
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-2xs border border-slate-300 dark:border-slate-600"
                          style={{
                            background:
                              'conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)',
                          }}
                        />
                      ) : (
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-2xs border border-black/10 dark:border-white/20"
                          style={{ backgroundColor: c.dotColor }}
                        />
                      )}
                      <span className="truncate">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Harmony Select Dropdown (Clean, without "Harmony:" prefix) */}
          <div className="relative min-w-[125px] flex-1 sm:flex-initial">
            <select
              id="filter-harmony"
              value={selectedHarmony}
              onChange={(e) => onSelectHarmony(e.target.value as HarmonyType)}
              className="w-full h-9 pl-2.5 pr-7 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none shadow-2xs"
            >
              {HARMONY_OPTIONS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>

          {/* 3. Colors Number Select Dropdown (Default 4 Colors) */}
          <div className="relative min-w-[105px] flex-1 sm:flex-initial">
            <select
              id="filter-colors-number"
              value={selectedCount}
              onChange={(e) => onSelectCount(Number(e.target.value) as SwatchCount | 0)}
              className="w-full h-9 pl-2.5 pr-7 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none shadow-2xs"
            >
              {SWATCH_COUNTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>

          {/* 4. Shuffle Button beside the select dropdowns */}
          {onRegenerate && (
            <Tooltip content="Shuffle color feed">
              <button
                id="regenerate-stream-btn"
                onClick={onRegenerate}
                className="h-9 px-3 flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-2xs shrink-0 cursor-pointer transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Shuffle</span>
              </button>
            </Tooltip>
          )}

          {/* 5. Clear Filter Button */}
          {onClearFilters && (
            <Tooltip content="Clear all filters">
              <button
                id="clear-filters-btn"
                onClick={onClearFilters}
                className={`h-9 px-2.5 flex items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold shadow-2xs shrink-0 cursor-pointer transition-colors ${
                  isFiltered
                    ? 'border-red-300 dark:border-red-800/60 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
