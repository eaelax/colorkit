'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import Tooltip from './Tooltip';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({
  isDarkMode,
  onToggleTheme,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-[#0c1220]/95 border-b border-slate-200/90 dark:border-slate-800 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 sm:h-13 flex items-center justify-between gap-3">
        {/* Brand with 4 Vibrant Colors Flat Vector Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer select-none"
            aria-label="ColorKit Home"
          >
            {/* 4 Vibrant Colors Flat Vector Logo: Red, Amber, Electric Blue, Emerald Green */}
            <div className="w-8 h-8 shrink-0 flex items-center justify-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 transition-transform duration-150 group-hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" className="w-6 h-6" fill="none">
                <rect x="3" y="3" width="13" height="13" rx="3.5" fill="#FF3366" />
                <rect x="20" y="3" width="13" height="13" rx="3.5" fill="#FFB800" />
                <rect x="3" y="20" width="13" height="13" rx="3.5" fill="#2563EB" />
                <rect x="20" y="20" width="13" height="13" rx="3.5" fill="#00D084" />
              </svg>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                ColorKit
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 leading-none">
                PRO
              </span>
            </div>
          </Link>
        </div>

        {/* Right Controls: Flat, Simple Theme Toggle with Matching Size, Style & Thickness */}
        <div className="flex items-center gap-2 shrink-0">
          <Tooltip content={isDarkMode ? 'Switch to Light theme' : 'Switch to Dark theme'}>
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={onToggleTheme}
              className="relative flex items-center justify-between w-14 h-7 p-0.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer select-none transition-colors duration-200 active:scale-95"
              aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {/* Left slot: Sun */}
              <div className="w-6 h-6 flex items-center justify-center text-amber-500">
                <Sun className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              {/* Right slot: Moon */}
              <div className="w-6 h-6 flex items-center justify-center text-slate-400 dark:text-slate-300">
                <Moon className="w-3.5 h-3.5 stroke-[2]" />
              </div>

              {/* Animated Flat Sliding Pill */}
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 shadow-xs border border-slate-300 dark:border-slate-600 transition-transform duration-200 ease-out ${
                  isDarkMode ? 'translate-x-7 text-slate-100' : 'translate-x-0 text-amber-500'
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-3.5 h-3.5 stroke-[2]" />
                ) : (
                  <Sun className="w-3.5 h-3.5 stroke-[2]" />
                )}
              </div>
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
