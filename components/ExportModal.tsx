'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Check,
  Download,
  Code2,
  FileCode,
  Hash,
  FileJson,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import {
  Palette,
  exportAsHexList,
  exportAsCssVariables,
  exportAsTailwindConfig,
  exportAsTailwindV4Theme,
  exportAsJson,
  downloadSvgFile,
  generatePaletteSvg,
} from '@/lib/color-engine';
import { useToast } from './Toast';

interface ExportModalProps {
  palette: Palette | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'css' | 'tailwind' | 'hex' | 'json' | 'svg';

export default function ExportModal({ palette, isOpen, onClose }: ExportModalProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('css');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [tailwindVariant, setTailwindVariant] = useState<'v3' | 'v4'>('v4');

  // Lock background body scrolling while export modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !palette) return null;

  const handleCopy = (content: string, label: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFormat(label);
    showToast(`Copied ${label}!`, 'Ready to paste in your project');
    setTimeout(() => {
      setCopiedFormat(null);
    }, 2000);
  };

  const handleDownloadSvg = () => {
    downloadSvgFile(palette);
    showToast('Downloaded SVG Swatch!', `${palette.title}.svg`);
  };

  const cssCode = exportAsCssVariables(palette);
  const tailwindCode =
    tailwindVariant === 'v4'
      ? exportAsTailwindV4Theme(palette)
      : exportAsTailwindConfig(palette);
  const hexListCode = exportAsHexList(palette, ', ');
  const hexLinesCode = exportAsHexList(palette, '\n');
  const jsonCode = exportAsJson(palette);

  return (
    <AnimatePresence>
      <div
        id="export-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          id="export-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.16 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {palette.title}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 capitalize">
                  {palette.harmony}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                ColorKit Export • Clean developer & design formats
              </p>
            </div>
            <button
              id="close-export-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mini preview bar - flex-1 for dynamic color counts (2-6) */}
          <div className="flex flex-row h-12 w-full border-b border-neutral-200 dark:border-neutral-800">
            {palette.colors.map((c, i) => (
              <div
                key={i}
                className="h-full flex-1 min-w-0 flex items-center justify-center font-mono text-[11px] font-semibold transition-transform"
                style={{
                  backgroundColor: c.hex,
                  color: c.isDark ? '#ffffff' : '#0f172a',
                }}
              >
                <span className="truncate px-1">{c.hex}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto scrollbar-none bg-neutral-50/30 dark:bg-neutral-900/30">
            <button
              id="tab-css-btn"
              onClick={() => setActiveTab('css')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeTab === 'css'
                  ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              CSS Variables
            </button>
            <button
              id="tab-tailwind-btn"
              onClick={() => setActiveTab('tailwind')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeTab === 'tailwind'
                  ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Tailwind CSS
            </button>
            <button
              id="tab-hex-btn"
              onClick={() => setActiveTab('hex')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeTab === 'hex'
                  ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              Plain HEX
            </button>
            <button
              id="tab-json-btn"
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeTab === 'json'
                  ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              JSON
            </button>
            <button
              id="tab-svg-btn"
              onClick={() => setActiveTab('svg')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeTab === 'svg'
                  ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              SVG Swatch
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 overflow-y-auto flex-1 bg-neutral-50/50 dark:bg-black/40 font-mono text-xs">
            {activeTab === 'css' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 font-sans text-xs">
                  <span>Standard CSS Custom Properties ready for `:root`</span>
                  <button
                    id="copy-css-btn"
                    onClick={() => handleCopy(cssCode, 'CSS Variables')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 font-medium text-xs hover:opacity-90 transition-opacity"
                  >
                    {copiedFormat === 'CSS Variables' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy CSS
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950 text-neutral-200 border border-neutral-800 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                  {cssCode}
                </div>
              </div>
            )}

            {activeTab === 'tailwind' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 font-sans text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-sans">Version:</span>
                    <div className="inline-flex p-0.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs">
                      <button
                        onClick={() => setTailwindVariant('v4')}
                        className={`px-2 py-0.5 rounded-md transition-all ${
                          tailwindVariant === 'v4'
                            ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs text-neutral-900 dark:text-white'
                            : 'hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        Tailwind v4 (@theme)
                      </button>
                      <button
                        onClick={() => setTailwindVariant('v3')}
                        className={`px-2 py-0.5 rounded-md transition-all ${
                          tailwindVariant === 'v3'
                            ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs text-neutral-900 dark:text-white'
                            : 'hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        Tailwind v3 (config)
                      </button>
                    </div>
                  </div>
                  <button
                    id="copy-tailwind-btn"
                    onClick={() => handleCopy(tailwindCode, 'Tailwind Configuration')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 font-medium text-xs hover:opacity-90 transition-opacity"
                  >
                    {copiedFormat === 'Tailwind Configuration' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Tailwind Code
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950 text-neutral-200 border border-neutral-800 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                  {tailwindCode}
                </div>
              </div>
            )}

            {activeTab === 'hex' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 font-sans text-xs">
                  <span>Plain comma-separated or multi-line HEX values</span>
                  <div className="flex items-center gap-2">
                    <button
                      id="copy-hex-list-btn"
                      onClick={() => handleCopy(hexListCode, 'Comma-separated HEX')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 font-medium text-xs hover:opacity-90 transition-opacity"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy List
                    </button>
                    <button
                      id="copy-hex-lines-btn"
                      onClick={() => handleCopy(hexLinesCode, 'Multi-line HEX')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium text-xs hover:opacity-90 transition-opacity"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Lines
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950 text-neutral-200 border border-neutral-800 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                  {hexListCode}
                </div>
              </div>
            )}

            {activeTab === 'json' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 font-sans text-xs">
                  <span>Structured design token JSON representation</span>
                  <button
                    id="copy-json-btn"
                    onClick={() => handleCopy(jsonCode, 'JSON Schema')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 font-medium text-xs hover:opacity-90 transition-opacity"
                  >
                    {copiedFormat === 'JSON Schema' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy JSON
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950 text-neutral-200 border border-neutral-800 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                  {jsonCode}
                </div>
              </div>
            )}

            {activeTab === 'svg' && (
              <div className="space-y-4 font-sans">
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
                  <span>Downloadable vector SVG swatch card with embedded labels</span>
                  <button
                    id="download-svg-btn"
                    onClick={handleDownloadSvg}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .SVG File
                  </button>
                </div>

                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-md bg-neutral-900 p-3 flex flex-col items-center">
                  <div
                    className="w-full max-w-lg aspect-[800/480] rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: generatePaletteSvg(palette) }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              100% Client-side export — ready to integrate
            </span>
            <button
              onClick={onClose}
              className="text-neutral-600 dark:text-neutral-400 hover:underline"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
