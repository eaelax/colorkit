import { HarmonyType, ColorFamily, SwatchCount } from './color-engine';

export interface PseoTopic {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  badge: string;
  summary: string;
  recommendedHarmony: HarmonyType;
  recommendedFamily: ColorFamily;
  recommendedCount: SwatchCount;
  keywords: string[];
  useCases: string[];
  designTips: string[];
  cssExample: string;
}

export const ALL_KEYWORDS: string[] = [
  'Color',
  'Colors',
  'Palette',
  'Palettes',
  'Color palette',
  'Color palettes',
  'Color picker',
  'Color picking',
  'Color scheme',
  'Color schemes',
  'Color harmony',
  'Color wheel',
  'Color generator',
  'Color library',
  'Color swatches',
  'Hex code',
  'Hex codes',
  'Hex color',
  'RGB',
  'RGBA',
  'HSL',
  'HSLA',
  'OKLCH',
  'OKLAB',
  'Color tokens',
  'Design tokens',
  'CSS colors',
  'Tailwind colors',
  'Web colors',
  'Brand colors',
  'UI colors',
  'UX colors',
  'Color contrast',
  'Contrast ratio',
  'Swatch',
  'Tint',
  'Shade',
  'Tone',
  'Hue',
  'Saturation',
  'Brightness',
  'Lightness',
  'Gradient',
  'Gradients',
  'Color scale',
  'Color ramp',
  'Color system',
  'Palette generator',
  'Scheme generator',
  'Hex picker',
  'Eyedropper tool',
  'Color finder',
  'Palette library',
  'Palette maker',
  'Palette creator',
  'Swatch generator',
  'Gradient generator',
  'Color extractor',
  'Accessible colors',
  'WCAG colors',
  'Contrast checker',
  'Color accessibility',
  'Semantic colors',
  'UI design colors',
  'UX design colors',
  'Frontend colors',
  'Web design colors',
  'App color scheme',
  'Dashboard colors',
  'Dark mode palette',
  'Light mode palette',
  'Minimalist palette',
  'Aesthetic palette',
  'Pastel palette',
  'Neon palette',
  'Retro palette',
  'Vintage palette',
  'Cyberpunk colors',
  'Earthy tones',
  'Muted colors',
  'Vibrant colors',
  'Warm color palette',
  'Cool color palette',
  'Neutral colors',
  'Monochromatic colors',
  'Analogous colors',
  'Complementary colors',
  'Triadic colors',
  'Tetradic colors',
  'Split complementary',
  'High contrast UI',
  'Flat UI colors',
  'Material colors',
  'Material Design palette',
  'Tailwind color generator',
  'Tailwind CSS palette',
  'CSS root variables',
  'CSS color variables',
  'CSS hex array',
  'Export palette to CSS',
  'Export palette to Tailwind',
  'Hex to RGB converter',
  'RGB to Hex converter',
  'Hex to HSL converter',
  'OKLCH color generator',
  'Perceptual color picker',
  'Design system color generator',
  'Semantic color token generator',
  'Random color palette generator',
  'Infinite color palette generator',
  'Free color palette generator',
  'Color palette library online',
  'Unique color combinations',
  'Non clashing color generator',
  'Website color scheme inspiration',
  'Mobile app color palette generator',
  'SaaS website color schemes',
  'Landing page color palette',
  'Click to copy hex code',
  'Copy hex color codes',
  'Instant color swatch copy',
  'SVG color swatch export',
  'JSON color tokens export',
  'Figma color palette generator',
  'React color palette component',
  'Nextjs color palette tool',
  'Client side color generator',
  'Zero backend color tool',
  'Browser color palette picker',
  'Fast color generator without ads',
  'Color palette infinite scroll',
  'Generate unlimited color schemes',
  'Best color combinations for websites',
  'Best color palettes for dark mode',
  'How to choose colors for UI design',
  'Accessible color palette generator for web',
  'WCAG compliant color scheme generator',
  'Modern web design color inspiration',
  'Frontend developer color palette tool',
  'UI UX color palette generator',
  'Micro interaction color states',
  'Primary secondary accent colors',
  'Background surface text colors',
  'High converting website colors',
  'Minimalist color palette for developers',
  'Developer friendly color palette generator',
  'Color palette generator with one click copy',
  'Color palette generator with Tailwind export',
  'Color scheme generator for software dashboards',
  'Responsive web design color system generator',
  'Infinite procedural color generator for designers',
  'Color palette library with instant hex copy',
  'Modern clean web application color schemes',
];

export const PSEO_TOPICS: Record<string, PseoTopic> = {
  'monochromatic-colors': {
    slug: 'monochromatic-colors',
    title: 'Monochromatic Colors & Palettes',
    metaTitle: 'Monochromatic Color Palette Generator – Clean UI Color Schemes',
    metaDescription: 'Generate cohesive monochromatic color schemes, tints, and shades with instant hex code copying, WCAG contrast verification, and Tailwind CSS exports.',
    heading: 'Monochromatic Color Palettes & Harmony Generator',
    badge: 'Color Harmony Guide',
    summary: 'Monochromatic color schemes explore variations in lightness and saturation along a single hue angle. Ideal for elegant minimalist web design, software dashboards, and cohesive SaaS interfaces.',
    recommendedHarmony: 'monochromatic',
    recommendedFamily: 'all',
    recommendedCount: 4,
    keywords: [
      'Monochromatic colors',
      'Color harmony',
      'Color scheme',
      'Tint',
      'Shade',
      'Tone',
      'Color scale',
      'Design tokens',
      'Tailwind colors',
    ],
    useCases: [
      'Enterprise and SaaS application dashboards',
      'Editorial blogs and minimalist portfolio sites',
      'Design system primary color token scales (50 to 900)',
    ],
    designTips: [
      'Ensure at least a 4.5:1 contrast ratio between your background and text color tokens.',
      'Use high lightness variations (90-98%) for cards and surfaces, and low lightness (10-25%) for text hierarchy.',
      'Pair a subtle chromatic accent with neutral gray borders for refined visual balance.',
    ],
    cssExample: `:root {
  --primary-50: #f0f9ff;
  --primary-200: #bae6fd;
  --primary-500: #0ea5e9;
  --primary-700: #0369a1;
  --primary-900: #0c4a6e;
}`,
  },
  'analogous-colors': {
    slug: 'analogous-colors',
    title: 'Analogous Color Harmonies',
    metaTitle: 'Analogous Color Scheme Generator – Natural Web Design Palettes',
    metaDescription: 'Discover harmonious analogous color palettes derived from adjacent color wheel positions. One-click hex copy and CSS/Tailwind export for UI designers.',
    heading: 'Analogous Color Schemes & Palette Generator',
    badge: 'Natural Harmony',
    summary: 'Analogous schemes select 3 to 5 adjacent hues on the 360° color wheel, generating soothing, low-tension visual palettes frequently found in nature and organic modern branding.',
    recommendedHarmony: 'analogous',
    recommendedFamily: 'all',
    recommendedCount: 4,
    keywords: [
      'Analogous colors',
      'Color wheel',
      'Color harmony',
      'Color generator',
      'Web design colors',
      'Color swatches',
      'CSS color variables',
    ],
    useCases: [
      'Lifestyle, travel, and wellness web applications',
      'Warm gradients and subtle ambient background meshes',
      'Creative studio portfolios and product landing pages',
    ],
    designTips: [
      'Select one dominant color to anchor 60% of the UI, use a second color for 30% supporting structure, and the third for 10% accents.',
      'Calibrate lightness steps so text remains readable against adjacent color swatches.',
    ],
    cssExample: `:root {
  --analogous-base: #3b82f6;
  --analogous-neighbor-left: #06b6d4;
  --analogous-neighbor-right: #6366f1;
}`,
  },
  'complementary-colors': {
    slug: 'complementary-colors',
    title: 'Complementary Color Palettes',
    metaTitle: 'Complementary Color Palette Generator – High Contrast UI Colors',
    metaDescription: 'Generate dynamic complementary color combinations for call-to-action buttons, high-converting hero sections, and accessible web interfaces.',
    heading: 'Complementary Color Harmonies & Scheme Generator',
    badge: 'Dynamic Contrast',
    summary: 'Complementary schemes pair colors located exactly 180° opposite on the color wheel, creating maximum optical vibration, distinct call-to-action visibility, and balanced chromatic energy.',
    recommendedHarmony: 'complementary',
    recommendedFamily: 'all',
    recommendedCount: 4,
    keywords: [
      'Complementary colors',
      'High contrast UI',
      'Call to action colors',
      'Color wheel',
      'Contrast checker',
      'Hex code',
      'Tailwind color generator',
    ],
    useCases: [
      'High-converting e-commerce buttons and promotional badges',
      'Alert states, status chips, and interactive data visualization',
      'Sports and high-energy tech brand identities',
    ],
    designTips: [
      'Never use pure saturated complementary colors directly on top of each other to prevent optical vibration and eye fatigue.',
      'Desaturate the background color and let the accent color pop cleanly.',
    ],
    cssExample: `:root {
  --brand-primary: #2563eb;
  --brand-accent: #f97316;
  --brand-surface: #eff6ff;
}`,
  },
  'triadic-colors': {
    slug: 'triadic-colors',
    title: 'Triadic Color Palettes',
    metaTitle: 'Triadic Color Scheme Generator – Balanced Vibrant UI Colors',
    metaDescription: 'Create balanced triadic color palettes spaced 120 degrees apart on the color wheel. Instant export to CSS, Tailwind, and Figma tokens.',
    heading: 'Triadic Color Harmonies & Palettes',
    badge: 'Geometric Balance',
    summary: 'Triadic color schemes form an equilateral triangle across the color wheel (120° apart). They deliver vibrant variety while maintaining geometric harmony and structured visual interest.',
    recommendedHarmony: 'triadic',
    recommendedFamily: 'all',
    recommendedCount: 4,
    keywords: [
      'Triadic colors',
      'Color harmony',
      'Palette creator',
      'Design tokens',
      'Hex picker',
      'Web colors',
    ],
    useCases: [
      'Multi-category content dashboards and tag taxonomies',
      'Gamified applications, children educational platforms, and creative tools',
      'Data charts requiring distinct categorical separation',
    ],
    designTips: [
      'Let one color rule, another support, and the third act exclusively as an intentional micro-interaction accent.',
    ],
    cssExample: `:root {
  --triad-dominant: #3b82f6;
  --triad-secondary: #ec4899;
  --triad-accent: #eab308;
}`,
  },
  'tetradic-colors': {
    slug: 'tetradic-colors',
    title: 'Tetradic Color Schemes',
    metaTitle: 'Tetradic & Rectangle Color Palette Generator – Rich Multi-Hue Schemes',
    metaDescription: 'Generate rich 4-color tetradic palettes with dual complementary pairs. One-click copy for complex design systems and creative UI design.',
    heading: 'Tetradic Color Schemes & Square Harmonies',
    badge: 'Dual Complementary',
    summary: 'Tetradic schemes feature four hues organized into two complementary pairs (90° square or rectangular offset), offering the richest chromatic palette with endless variation opportunities.',
    recommendedHarmony: 'tetradic',
    recommendedFamily: 'all',
    recommendedCount: 4,
    keywords: [
      'Tetradic colors',
      'Color scheme',
      'Palette library',
      'Design system color generator',
      'Color tokens',
    ],
    useCases: [
      'Complex multi-brand systems and design language token sets',
      'Infographics, interactive maps, and multivariate charts',
      'Artistic landing pages and editorial design layouts',
    ],
    designTips: [
      'Pay special attention to balance warm and cool tones so the layout does not feel visually chaotic.',
    ],
    cssExample: `:root {
  --tetrad-c1: #ef4444;
  --tetrad-c2: #10b981;
  --tetrad-c3: #3b82f6;
  --tetrad-c4: #f59e0b;
}`,
  },
  'split-complementary': {
    slug: 'split-complementary',
    title: 'Split-Complementary Palettes',
    metaTitle: 'Split Complementary Color Palette Generator – Refined Contrast',
    metaDescription: 'Generate split-complementary color schemes with softer contrast than pure complements. Instant hex code copying and Tailwind CSS palette export.',
    heading: 'Split-Complementary Color Harmonies',
    badge: 'Nuanced Contrast',
    summary: 'Split-complementary pairs a base color with the two colors adjacent to its exact complement (150° and 210°). It preserves strong visual contrast while feeling less aggressive.',
    recommendedHarmony: 'split-complementary',
    recommendedFamily: 'all',
    recommendedCount: 4,
    keywords: [
      'Split complementary',
      'Color harmony',
      'Color generator',
      'Non clashing color generator',
      'Accessible colors',
    ],
    useCases: [
      'Modern B2B web applications',
      'Mobile app onboarding flows and interactive modals',
      'Marketing feature callouts and pricing tables',
    ],
    designTips: [
      'Use the base hue for main brand identity and the split complements for tags, badges, and secondary highlights.',
    ],
    cssExample: `:root {
  --base-hue: #2563eb;
  --split-accent-1: #f97316;
  --split-accent-2: #fbbf24;
}`,
  },
  'dark-mode-palette': {
    slug: 'dark-mode-palette',
    title: 'Dark Mode Palettes & Colors',
    metaTitle: 'Dark Mode Color Palette Generator – OLED & Deep Charcoal Schemes',
    metaDescription: 'Generate accessible, low-eyestrain dark mode color palettes. Includes surface elevations, high-contrast text tokens, and Tailwind dark theme classes.',
    heading: 'Dark Mode Color Palette & UI Design System',
    badge: 'UI / UX Design',
    summary: 'Crafting dark theme UI requires balancing deep surface elevations with desaturated pastel accents to avoid ocular fatigue and satisfy WCAG 2.1 AA contrast thresholds.',
    recommendedHarmony: 'all',
    recommendedFamily: 'all',
    recommendedCount: 4,
    keywords: [
      'Dark mode palette',
      'Best color palettes for dark mode',
      'High contrast UI',
      'WCAG colors',
      'UI design colors',
      'Tailwind colors',
      'Background surface text colors',
    ],
    useCases: [
      'Developer tool dashboards, IDEs, and code editors',
      'Media streaming apps and late-night productivity utilities',
      'Crypto, Web3, and futuristic cyber aesthetics',
    ],
    designTips: [
      'Never use pure #000000 black for card surfaces; use dark charcoal (#0f172a or #111827) to allow drop shadows and elevation borders to register.',
      'Slightly desaturate bright brand colors so they do not produce chromatic vibration against dark backgrounds.',
    ],
    cssExample: `[data-theme="dark"] {
  --bg-app: #090d16;
  --bg-surface: #131b2e;
  --border-subtle: #1e293b;
  --text-primary: #f8fafc;
  --text-muted: #94a3b8;
  --accent: #38bdf8;
}`,
  },
  'light-mode-palette': {
    slug: 'light-mode-palette',
    title: 'Light Mode UI Palettes',
    metaTitle: 'Light Mode Color Palette Generator – Crisp, High-Contrast Themes',
    metaDescription: 'Generate clean, professional light mode palettes with calibrated off-white surfaces, crisp typography tokens, and one-click CSS variables.',
    heading: 'Light Mode Color Schemes & Design Tokens',
    badge: 'Daytime Precision',
    summary: 'Modern light mode palettes combine warm or cool off-white surfaces with deep slate typography to deliver airy, distraction-free software experiences.',
    recommendedHarmony: 'all',
    recommendedFamily: 'light',
    recommendedCount: 4,
    keywords: [
      'Light mode palette',
      'Minimalist palette',
      'Clean web application color schemes',
      'WCAG colors',
      'UI colors',
    ],
    useCases: [
      'Productivity tools, document editors, and spreadsheets',
      'Healthcare and financial service portals',
      'E-commerce product showcases and clean catalogs',
    ],
    designTips: [
      'Avoid harsh pure white backgrounds; use subtle 98-99% lightness (#f8fafc or #f9fafb) with 1px border dividers.',
    ],
    cssExample: `:root {
  --bg-canvas: #f8fafc;
  --bg-card: #ffffff;
  --border-card: #e2e8f0;
  --text-main: #0f172a;
}`,
  },
  'warm-color-palette': {
    slug: 'warm-color-palette',
    title: 'Warm Color Palettes',
    metaTitle: 'Warm Color Palette Generator – Terracotta, Amber & Sunset Schemes',
    metaDescription: 'Generate inviting warm color palettes with terracotta, coral, peach, and golden amber hues. Instant hex copy and SVG/JSON token export.',
    heading: 'Warm Color Schemes & Palettes',
    badge: 'Inviting & Energetic',
    summary: 'Warm palettes range across red, orange, amber, and yellow wavelengths, evoking hospitality, comfort, enthusiasm, and appetizing culinary warmth.',
    recommendedHarmony: 'all',
    recommendedFamily: 'orange',
    recommendedCount: 4,
    keywords: [
      'Warm color palette',
      'Earthy tones',
      'Vibrant colors',
      'Unique color combinations',
      'Hex codes',
      'Color swatches',
    ],
    useCases: [
      'Hospitality, food delivery, and restaurant apps',
      'Cozy lifestyle brands and autumn seasonal promotions',
      'Energetic fitness and community engagement platforms',
    ],
    designTips: [
      'Balance high-energy reds and oranges with warm beige and oatmeal neutral backgrounds.',
    ],
    cssExample: `:root {
  --warm-amber: #f59e0b;
  --warm-terracotta: #ea580c;
  --warm-rose: #f43f5e;
  --warm-neutral: #fffbeb;
}`,
  },
  'cool-color-palette': {
    slug: 'cool-color-palette',
    title: 'Cool Color Palettes',
    metaTitle: 'Cool Color Palette Generator – Azure, Teal & Indigo Schemes',
    metaDescription: 'Explore tranquil cool color palettes featuring cyan, teal, sapphire, and violet hues. Free one-click hex copying and Tailwind CSS export.',
    heading: 'Cool Color Schemes & Palettes',
    badge: 'Tranquil & Trusted',
    summary: 'Cool color schemes feature blues, cyans, greens, and teals that convey authority, stability, calm focus, and technical reliability.',
    recommendedHarmony: 'all',
    recommendedFamily: 'blue',
    recommendedCount: 4,
    keywords: [
      'Cool color palette',
      'SaaS website color schemes',
      'Web design colors',
      'Tailwind color generator',
      'Design tokens',
    ],
    useCases: [
      'Fintech platforms and banking mobile apps',
      'Cloud infrastructure consoles and cyber-security dashboards',
      'Meditation, mental wellness, and medical software',
    ],
    designTips: [
      'Pair cool blues with crisp ice-white surfaces and slate-900 typography for instant corporate polish.',
    ],
    cssExample: `:root {
  --cool-teal: #0d9488;
  --cool-azure: #0284c7;
  --cool-indigo: #4f46e5;
  --cool-surface: #f0fdfa;
}`,
  },
  'pastel-palette': {
    slug: 'pastel-palette',
    title: 'Pastel Color Palettes',
    metaTitle: 'Pastel Color Palette Generator – Soft Tint Schemes for Web & Apps',
    metaDescription: 'Generate soft, dreamy pastel color palettes with high lightness and gentle saturation. One-click hex code copy and CSS export for modern UI.',
    heading: 'Pastel Color Schemes & Aesthetics',
    badge: 'Soft & Gentle',
    summary: 'Pastel palettes soften primary and secondary hues by increasing lightness to 80-92% and dialing saturation to 35-60%, producing delicate, friendly visuals.',
    recommendedHarmony: 'all',
    recommendedFamily: 'pink',
    recommendedCount: 4,
    keywords: [
      'Pastel palette',
      'Aesthetic palette',
      'Muted colors',
      'Tint',
      'Minimalist palette',
      'Color swatches',
    ],
    useCases: [
      'Notion-style productivity workspaces and digital journals',
      'Beauty, skincare, and boutique e-commerce shops',
      'Friendly educational mobile apps for all age groups',
    ],
    designTips: [
      'Because pastels have low contrast with white, use deep charcoal or slate text rather than mid-gray for body copy.',
    ],
    cssExample: `:root {
  --pastel-blush: #fecdd3;
  --pastel-mint: #a7f3d0;
  --pastel-lavender: #ddd6fe;
  --pastel-butter: #fef08a;
}`,
  },
  'neon-palette': {
    slug: 'neon-palette',
    title: 'Neon & Cyberpunk Colors',
    metaTitle: 'Neon & Cyberpunk Color Palette Generator – Electric High-Chroma Schemes',
    metaDescription: 'Generate hyper-vibrant neon color palettes, cyberpunk hues, and synthwave hex codes for digital art, dark mode UI, and creative coding.',
    heading: 'Neon & Cyberpunk Color Schemes',
    badge: 'Electric & Futuristic',
    summary: 'Neon color schemes push chromatic saturation to 95-100% with luminous lightness, creating eye-catching electric pulses against pitch-dark canvas backgrounds.',
    recommendedHarmony: 'all',
    recommendedFamily: 'purple',
    recommendedCount: 4,
    keywords: [
      'Neon palette',
      'Cyberpunk colors',
      'Vibrant colors',
      'Dark mode palette',
      'Retro palette',
      'Color generator',
    ],
    useCases: [
      'Gaming hubs, esports tournaments, and livestreaming interfaces',
      'Music synthesizers, audio workstations, and event websites',
      'Futuristic sci-fi dashboards and interactive 3D WebGL experiences',
    ],
    designTips: [
      'Confine intense neons to buttons, indicators, and focus rings; use dark matte surfaces to let them glow without visual fatigue.',
    ],
    cssExample: `:root {
  --neon-cyan: #00f0ff;
  --neon-magenta: #ff007f;
  --neon-lime: #39ff14;
  --dark-bg: #05050a;
}`,
  },
  'tailwind-color-generator': {
    slug: 'tailwind-color-generator',
    title: 'Tailwind Color Generator',
    metaTitle: 'Tailwind CSS Color Palette Generator – Export Color Scales to Tailwind v4',
    metaDescription: 'Generate custom 50-950 Tailwind color scales and design tokens. One-click copy Tailwind config objects, CSS root variables, and OKLCH definitions.',
    heading: 'Tailwind CSS Color Generator & Palette Studio',
    badge: 'Developer Tool',
    summary: 'Instantly transform any harmonious color palette into clean Tailwind CSS v4 variables (`--color-*`) or JavaScript configuration objects ready to paste into your frontend project.',
    recommendedHarmony: 'all',
    recommendedFamily: 'all',
    recommendedCount: 5,
    keywords: [
      'Tailwind color generator',
      'Tailwind CSS palette',
      'Export palette to Tailwind',
      'CSS root variables',
      'Design tokens',
      'Frontend developer color palette tool',
    ],
    useCases: [
      'Setting up new Next.js, Vite, or React web applications',
      'Extending Tailwind theme with custom brand color palettes',
      'Standardizing semantic tokens across multi-component design systems',
    ],
    designTips: [
      'Define semantic aliases like `--color-primary`, `--color-surface`, and `--color-destructive` mapped to numerical color ramps.',
    ],
    cssExample: `@theme {
  --color-brand-50: #eff6ff;
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;
  --color-brand-900: #1e3a8a;
}`,
  },
  'wcag-accessible-colors': {
    slug: 'wcag-accessible-colors',
    title: 'WCAG Accessible Colors',
    metaTitle: 'WCAG Compliant Color Palette Generator – Accessible Contrast Checker',
    metaDescription: 'Generate WCAG 2.1 AA and AAA compliant color palettes. Check contrast ratios in real time and copy accessible foreground/background hex codes.',
    heading: 'WCAG Accessible Color Schemes & Contrast Ratio Checker',
    badge: 'Accessibility First',
    summary: 'Ensure your web design meets international accessibility standards (WCAG 2.1 Level AA and AAA). Inspect contrast ratios across all swatches with real-time feedback.',
    recommendedHarmony: 'all',
    recommendedFamily: 'all',
    recommendedCount: 4,
    keywords: [
      'Accessible colors',
      'WCAG colors',
      'Contrast checker',
      'Color accessibility',
      'Contrast ratio',
      'Accessible color palette generator for web',
    ],
    useCases: [
      'Government, healthcare, and public sector web platforms',
      'Enterprise software requiring ADA and Section 508 compliance',
      'Universal design systems built for all users',
    ],
    designTips: [
      'Normal body text requires at least a 4.5:1 contrast ratio against its background.',
      'Large text (18pt+ or 14pt bold) requires at least a 3.0:1 contrast ratio.',
      'UI component borders and graphical objects require at least 3.0:1.',
    ],
    cssExample: `/* WCAG AA Compliant Combination (7.2:1 Contrast Ratio) */
.accessible-card {
  background-color: #0f172a; /* Slate 900 */
  color: #f8fafc;            /* Slate 50 */
  border: 1px solid #334155; /* 3.2:1 against bg */
}`,
  },
  'saas-website-color-schemes': {
    slug: 'saas-website-color-schemes',
    title: 'SaaS Website Color Schemes',
    metaTitle: 'SaaS Website Color Schemes – High Converting Landing Page Palettes',
    metaDescription: 'Discover modern, high-converting color palettes for SaaS landing pages, software dashboards, and web applications. Instant one-click hex copy.',
    heading: 'SaaS Website Color Schemes & UI Inspiration',
    badge: 'Product & Conversion',
    summary: 'Curated color palettes calibrated for modern cloud software, tech landing pages, and enterprise SaaS dashboards that build user trust and elevate conversions.',
    recommendedHarmony: 'all',
    recommendedFamily: 'blue',
    recommendedCount: 4,
    keywords: [
      'SaaS website color schemes',
      'Landing page color palette',
      'High converting website colors',
      'Dashboard colors',
      'UI UX color palette generator',
    ],
    useCases: [
      'SaaS pricing tiers and landing page hero sections',
      'Analytics dashboards and telemetry charts',
      'Mobile app onboarding and feature highlights',
    ],
    designTips: [
      'Keep 70% of the surface neutral, 20% brand primary, and reserve 10% for your high-contrast conversion CTA.',
    ],
    cssExample: `:root {
  --saas-primary: #4f46e5;
  --saas-cta: #10b981;
  --saas-text: #0f172a;
  --saas-surface: #f8fafc;
}`,
  },
  'earthy-tones': {
    slug: 'earthy-tones',
    title: 'Earthy Tones & Natural Palettes',
    metaTitle: 'Earthy Tones Color Palette Generator – Forest, Sand & Clay Schemes',
    metaDescription: 'Generate grounding earthy color palettes with terracotta, moss green, warm sand, and clay tones. Instant hex copy for sustainable and organic brands.',
    heading: 'Earthy Tones & Organic Color Palettes',
    badge: 'Organic & Grounded',
    summary: 'Warm terracotta, clay red, forest moss, and river stone neutrals create an earthy palette rooted in nature, mindfulness, and timeless craftsmanship.',
    recommendedHarmony: 'analogous',
    recommendedFamily: 'orange',
    recommendedCount: 4,
    keywords: [
      'Earthy tones',
      'Warm color palette',
      'Muted colors',
      'Retro palette',
      'Vintage palette',
      'Color swatches',
    ],
    useCases: [
      'Sustainable fashion, eco-friendly goods, and coffee brands',
      'Architecture, interior design, and pottery portfolios',
      'Organic food brands and outdoor lifestyle publications',
    ],
    designTips: [
      'Use moss greens (#3d5a45) and ochre (#c8963e) with warm linen backgrounds (#f4f1ea) for effortless natural harmony.',
    ],
    cssExample: `:root {
  --earth-moss: #3d5a45;
  --earth-clay: #b2533e;
  --earth-sand: #d4a373;
  --earth-linen: #fefae0;
}`,
  },
};
