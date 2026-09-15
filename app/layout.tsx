import type { Metadata } from 'next';
import './globals.css';
import { ALL_KEYWORDS } from '@/lib/pseo-data';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'https://colorkit.io'),
  title: 'ColorKit – Free Color Palette Generator & Color Schemes',
  description: 'Generate infinite, mathematically harmonious color palettes, design tokens, and hex codes for web design, UI/UX, and Tailwind CSS. Click to copy hex codes, inspect swatches, and export ready-to-use CSS.',
  keywords: ALL_KEYWORDS,
  applicationName: 'ColorKit',
  authors: [{ name: 'ColorKit Studio' }],
  creator: 'ColorKit',
  publisher: 'ColorKit',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'ColorKit – Free Color Palette Generator & Color Schemes',
    description: 'Infinite mathematically balanced color palettes, hex codes, and design tokens for web designers and developers. Export to CSS, Tailwind, SVG, and JSON.',
    siteName: 'ColorKit',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ColorKit – Free Color Palette Generator & Color Schemes',
    description: 'Infinite mathematically balanced color palettes, hex codes, and design tokens for web designers and developers. Export to CSS, Tailwind, SVG, and JSON.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ColorKit',
  alternateName: 'ColorKit Color Palette Generator',
  url: '/',
  description: 'Free online color palette generator, color scheme library, and design token exporter for web designers and frontend developers.',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires JavaScript and modern browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Infinite color palette generator with golden ratio harmonics',
    'Interactive color slider with real-time hue and saturation control',
    'One-click hex, RGB, HSL, and OKLCH color code copy',
    'Real-time WCAG 2.1 AA/AAA contrast ratio testing and badge display',
    'Export palettes to Tailwind CSS, CSS root variables, SVG swatches, and JSON tokens',
    'Custom palette length selection from 3 to 6 colors',
    'Color family filters: warm, cool, pastel, neon, and neutral',
  ],
  keywords: ALL_KEYWORDS.slice(0, 30).join(', '),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
