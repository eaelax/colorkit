import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PSEO_TOPICS, PseoTopic } from '@/lib/pseo-data';
import { generatePalette } from '@/lib/color-engine';
import { Sparkles, ArrowLeft, ArrowRight, Check, Copy, Palette as PaletteIcon, Code, ShieldCheck, Eye } from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(PSEO_TOPICS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = PSEO_TOPICS[slug];
  if (!topic) return { title: 'Topic Not Found' };

  return {
    title: `${topic.metaTitle} | ColorKit`,
    description: topic.metaDescription,
    keywords: topic.keywords,
    openGraph: {
      title: `${topic.metaTitle} | ColorKit`,
      description: topic.metaDescription,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${topic.metaTitle} | ColorKit`,
      description: topic.metaDescription,
    },
  };
}

export default async function PseoPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = PSEO_TOPICS[slug];

  if (!topic) {
    notFound();
  }

  // Pre-generate a representative palette for this topic
  const samplePalette = generatePalette(
    topic.recommendedHarmony,
    42,
    topic.recommendedCount,
    topic.recommendedFamily
  );

  const relatedTopics = Object.values(PSEO_TOPICS)
    .filter((t) => t.slug !== slug)
    .slice(0, 4);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: topic.heading,
    description: topic.metaDescription,
    keywords: topic.keywords.join(', '),
    articleSection: 'Design & Development',
    inLanguage: 'en-US',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/95 dark:bg-[#0c1220]/95 border-b border-slate-200/90 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-13 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Generator</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore Palettes</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Hero Section */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/70 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{topic.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {topic.heading}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {topic.summary}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/?harmony=${topic.recommendedHarmony}&family=${topic.recommendedFamily}&count=${topic.recommendedCount}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold transition-all shadow-sm"
            >
              <PaletteIcon className="w-4 h-4" />
              <span>Launch in Generator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Live Swatch Preview */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PaletteIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Featured {topic.title} Swatches</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Algorithmically balanced • Click Launch to randomize infinitely
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              {samplePalette.colors.length} Colors
            </span>
          </div>

          {/* Color Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {samplePalette.colors.map((color, idx) => (
              <div
                key={`${color.hex}-${idx}`}
                className="group relative flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850"
              >
                <div
                  className="h-24 w-full transition-transform group-hover:scale-105 duration-200"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="p-3 space-y-1">
                  <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {color.hex}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    rgb({color.rgb})
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    {color.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases & Design Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span>Recommended Digital Use Cases</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              {topic.useCases.map((useCase, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>UI/UX & Contrast Best Practices</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              {topic.designTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Code & Design Token Implementation */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-500" />
            <span>CSS Variables & Design Tokens</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Copy and paste this ready-to-use CSS snippet into your stylesheets:
          </p>
          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
            <code>{topic.cssExample}</code>
          </pre>
        </section>

        {/* Targeted Keyword Cloud */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
            Related Search Terms & pSEO Taxonomy
          </h3>
          <div className="flex flex-wrap gap-2">
            {topic.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>

        {/* Related Topics Cross-Linking */}
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Explore More Color Harmonies & Palettes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedTopics.map((rel) => (
              <Link
                key={rel.slug}
                href={`/explore/${rel.slug}`}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
              >
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  {rel.badge}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {rel.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {rel.summary}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
