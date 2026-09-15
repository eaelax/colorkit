'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PSEO_TOPICS, ALL_KEYWORDS } from '@/lib/pseo-data';
import {
  Sparkles,
  Layers,
  Palette,
  Code2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

interface SeoKeywordsHubProps {
  onSelectFilter?: (harmony: string, family: string) => void;
}

export default function SeoKeywordsHub({ onSelectFilter }: SeoKeywordsHubProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const filteredKeywords = ALL_KEYWORDS.filter((k) =>
    k.toLowerCase().includes(keywordFilter.toLowerCase().trim())
  );

  const faqs = [
    {
      question: 'How do I choose the best colors for UI and web design?',
      answer:
        'A proven standard is the 60-30-10 rule: 60% of your interface should be a dominant neutral surface (light or dark canvas), 30% a supporting brand secondary color for navigation and cards, and 10% a high-contrast accent color reserved exclusively for primary buttons and interactive call-to-actions. Always check contrast against WCAG 2.1 AA benchmarks.',
    },
    {
      question: 'How do I export ColorKit palettes to Tailwind CSS?',
      answer:
        'Click the "Export" button on any palette card and choose "Tailwind CSS". ColorKit generates both Tailwind v4 theme variables (@theme { --color-* }) and standard tailwind.config.js color token objects that you can paste directly into your project.',
    },
    {
      question: 'What is WCAG color contrast and why is it important?',
      answer:
        'The Web Content Accessibility Guidelines (WCAG 2.1) require a minimum contrast ratio of 4.5:1 for normal body text and 3:1 for large display text against their backgrounds. ColorKit computes the exact contrast ratio against pure black and pure white for every swatch in real-time.',
    },
    {
      question: 'What is the difference between OKLCH and RGB/HEX color formats?',
      answer:
        'OKLCH (Oklab Lightness, Chroma, Hue) is a perceptually uniform color space designed for human vision. Unlike HEX or standard RGB, equal numeric changes in OKLCH produce equal visual perceptual shifts, making it the premier format for building accessible design token ramps and fluid UI states in modern CSS.',
    },
  ];

  return (
    <section
      id="seo-knowledge-hub"
      className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/90 dark:border-slate-800/90"
      aria-label="Color Palettes, Design Tokens & SEO Index"
    >
      {/* Top Banner & Expand Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Design Tokens, Harmonies & SEO Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Color Palette Library & Programmatic Color Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 max-w-2xl">
            Explore harmonic algorithms, UI/UX color theories, Tailwind design tokens, and web design color systems.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <span>{isExpanded ? 'Collapse Color Guide' : 'Explore Keywords & Guides'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Interactive Topics Grid (Always visible summary, detailed when expanded) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
        {/* Card 1: Harmonies */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
              <Palette className="w-4 h-4" />
              <span>Color Harmonies</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Geometric Schemes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Monochromatic, analogous, complementary, triadic, and tetradic relationships.
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/explore/monochromatic-colors"
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              Monochromatic
            </Link>
            <Link
              href="/explore/complementary-colors"
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              Complementary
            </Link>
            <Link
              href="/explore/analogous-colors"
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              Analogous
            </Link>
          </div>
        </div>

        {/* Card 2: UI/UX Schemes */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              <Layers className="w-4 h-4" />
              <span>UI Themes & Moods</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Aesthetics & Products
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dark mode palettes, pastel tints, cyberpunk neons, and earthy natural tones.
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/explore/dark-mode-palette"
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
            >
              Dark Mode
            </Link>
            <Link
              href="/explore/pastel-palette"
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
            >
              Pastels
            </Link>
            <Link
              href="/explore/neon-palette"
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
            >
              Neon
            </Link>
          </div>
        </div>

        {/* Card 3: Code & Tokens */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              <Code2 className="w-4 h-4" />
              <span>Tailwind & CSS Tokens</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Developer Export
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Generate CSS root variables, OKLCH scales, and Tailwind v4 theme configs.
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/explore/tailwind-color-generator"
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
            >
              Tailwind CSS
            </Link>
            <Link
              href="/explore/saas-website-color-schemes"
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
            >
              SaaS Palettes
            </Link>
          </div>
        </div>

        {/* Card 4: Accessibility */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Accessibility & WCAG</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Contrast Compliant
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Evaluate real-time WCAG 2.1 AA/AAA ratios for legible UI typography.
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/explore/wcag-accessible-colors"
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/60 text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition-colors"
            >
              WCAG Checker
            </Link>
            <Link
              href="/explore/earthy-tones"
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/60 text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition-colors"
            >
              Earthy Tones
            </Link>
          </div>
        </div>
      </div>

      {/* Expandable Section: pSEO Index, Searchable Keywords & UI FAQs */}
      {isExpanded && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Programmatic SEO Landing Pages Hub */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Programmatic Color Explorations (pSEO Deep Dives)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dedicated guides with custom swatches, design theory, and CSS code snippets:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {Object.values(PSEO_TOPICS).map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/explore/${topic.slug}`}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-all group"
                >
                  <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    {topic.badge}
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between mt-0.5">
                    <span>{topic.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Searchable Keyword Taxonomy Directory */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Complete SEO & Keyword Directory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Indexed color terms, formats, token scales, and search keywords ({filteredKeywords.length} terms):
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  placeholder="Filter keywords..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto pr-1">
              {filteredKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] font-medium text-slate-700 dark:text-slate-300 select-all hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  title={`Keyword: ${kw}`}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* UI Color Design FAQs */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>Frequently Asked Questions • Color Systems & Web Design</span>
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="py-3">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-1"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pr-6">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
