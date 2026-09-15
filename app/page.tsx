'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Palette, ColorFormat } from '@/lib/color-engine';
import {
  getUserPreferences,
  setUserPreferences,
} from '@/lib/storage';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import ExploreFeed from '@/components/ExploreFeed';
import ExportModal from '@/components/ExportModal';
import SeoKeywordsHub from '@/components/SeoKeywordsHub';

function MainApp() {
  const [globalFormat, setGlobalFormat] = useState<ColorFormat>('hex');
  const [exportModalPalette, setExportModalPalette] = useState<Palette | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Sync preferences from client storage after initial hydration to prevent SSR mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const prefs = getUserPreferences();
        if (prefs.colorFormat) {
          setGlobalFormat(prefs.colorFormat);
        }
        let shouldBeDark = false;
        if (prefs.theme === 'dark') {
          shouldBeDark = true;
        } else if (prefs.theme === 'light') {
          shouldBeDark = false;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          shouldBeDark = true;
        }

        if (shouldBeDark) {
          setIsDarkMode(true);
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch {
        // Ignored
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Synchronize DOM root class whenever isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Instant, synchronous theme toggling
  const handleToggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const nextDark = !prev;
      if (nextDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        setUserPreferences({ theme: nextDark ? 'dark' : 'light' });
      } catch {
        // Ignored
      }
      return nextDark;
    });
  }, []);

  const handleFormatChange = useCallback((fmt: ColorFormat) => {
    setGlobalFormat(fmt);
    try {
      setUserPreferences({ colorFormat: fmt });
    } catch {
      // Ignored
    }
  }, []);

  const handleOpenExport = useCallback((palette: Palette) => {
    setExportModalPalette(palette);
  }, []);

  const handleCloseExport = useCallback(() => {
    setExportModalPalette(null);
  }, []);

  // Keyboard shortcut: Esc to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && exportModalPalette) {
        setExportModalPalette(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exportModalPalette]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors duration-75">
      {/* Top Navigation Bar */}
      <Navbar
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-2.5 sm:py-4">
        {/* Compact App Hero: Shorter & Wider */}
        <div className="mb-3 sm:mb-4 text-center flex flex-col items-center justify-center max-w-5xl mx-auto border-b border-slate-200/80 dark:border-slate-800/80 pb-2.5 sm:pb-3">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-1">
            Explore Color Harmonies & Palettes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-normal max-w-4xl mx-auto">
            Generate mathematically harmonious color schemes, design tokens, and hex codes. Click any color swatch to copy codes or export palettes directly.
          </p>
        </div>

        {/* Explore Feed */}
        <ExploreFeed
          globalFormat={globalFormat}
          onFormatChange={handleFormatChange}
          onOpenExport={handleOpenExport}
        />

        {/* In-Tool Programmatic SEO & Keyword Explorer Hub */}
        <SeoKeywordsHub />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            ColorKit PRO • Infinite Color Palette Generator & Design System Swatches
          </span>
          <span className="font-mono text-[11px]">
            Export: HEX • RGB • HSL • CSS • Tailwind • SVG • JSON
          </span>
        </div>
      </footer>

      {/* Export Dialog Modal */}
      <ExportModal
        palette={exportModalPalette}
        isOpen={!!exportModalPalette}
        onClose={handleCloseExport}
      />
    </div>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
