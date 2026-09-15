// Mathematical Color Harmony Engine & Export Formatter
// 100% Client-Side, zero-cost, lightweight, and deterministic

export type HarmonyType =
  | 'all'
  | 'modern-ui'
  | 'pastel'
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'split-complementary'
  | 'neon-night'
  | 'earthy-vintage'
  | 'monochromatic'
  | 'tetradic';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export type ColorFamily =
  | 'all'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'dark'
  | 'light'
  | 'monochrome'
  | 'gray'
  | 'white';

export type SwatchCount = 2 | 3 | 4 | 5 | 6;

export interface SwatchColor {
  hex: string;
  rgb: string;
  hsl: string;
  h: number;
  s: number;
  l: number;
  isDark: boolean;
  name: string;
  family: ColorFamily;
}

export interface Palette {
  id: string;
  title: string;
  harmony: HarmonyType;
  colors: SwatchColor[];
  tags: string[];
  likes: number;
  createdAt: number;
  isDarkTheme?: boolean;
  primaryFamily?: ColorFamily;
}

// -------------------------------------------------------------
// Math & Color Space Conversion
// -------------------------------------------------------------

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function getDisplayColorValue(swatch: SwatchColor, format: ColorFormat = 'hex'): string {
  if (format === 'rgb') return swatch.rgb;
  if (format === 'hsl') return swatch.hsl;
  return swatch.hex;
}

// Calculate relative luminance for WCAG contrast
export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function isColorDark(r: number, g: number, b: number): boolean {
  return getLuminance(r, g, b) < 0.38;
}

// Approximate perceptual color naming based on Hue, Saturation, Lightness
export function getColorName(h: number, s: number, l: number): string {
  if (l < 12) return 'Obsidian';
  if (l > 92 && s < 15) return 'Alabaster';
  if (s < 12) {
    if (l < 30) return 'Charcoal';
    if (l < 60) return 'Slate';
    return 'Silver';
  }

  const normalizedH = ((h % 360) + 360) % 360;

  if (normalizedH < 15 || normalizedH >= 345) {
    if (l > 75) return 'Blush Rose';
    if (s < 45) return 'Muted Brick';
    if (l < 35) return 'Crimson';
    return 'Scarlet';
  }
  if (normalizedH < 40) {
    if (l > 75) return 'Peach Cream';
    if (s < 45) return 'Terracotta';
    if (l < 35) return 'Rust';
    return 'Tangerine';
  }
  if (normalizedH < 65) {
    if (l > 75) return 'Buttercup';
    if (s < 40) return 'Ochre';
    if (l < 35) return 'Bronze';
    return 'Amber Gold';
  }
  if (normalizedH < 150) {
    if (l > 75) return 'Mint Frost';
    if (s < 35) return 'Sage Leaf';
    if (l < 35) return 'Deep Forest';
    return 'Emerald Green';
  }
  if (normalizedH < 195) {
    if (l > 75) return 'Aqua Mist';
    if (s < 40) return 'Seafoam';
    if (l < 35) return 'Deep Teal';
    return 'Cyan Turquoise';
  }
  if (normalizedH < 255) {
    if (l > 75) return 'Ice Blue';
    if (s < 40) return 'Slate Blue';
    if (l < 35) return 'Midnight Navy';
    return 'Cobalt Blue';
  }
  if (normalizedH < 290) {
    if (l > 75) return 'Lilac Haze';
    if (s < 40) return 'Muted Iris';
    if (l < 35) return 'Deep Plum';
    return 'Royal Violet';
  }
  // 290 - 345: Magenta/Pink
  if (l > 75) return 'Cotton Candy';
  if (s < 40) return 'Dusty Mauve';
  if (l < 35) return 'Dark Wine';
  return 'Vivid Magenta';
}

export function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export function getColorFamily(h: number, s: number, l: number): ColorFamily {
  if (l < 14) return 'dark';
  if (l >= 88 && s <= 22) return 'white';
  if (s <= 16) {
    if (l <= 24) return 'dark';
    if (l >= 85) return 'white';
    return 'gray';
  }

  const normH = ((h % 360) + 360) % 360;
  if (normH >= 345 || normH < 15) return 'red';
  if (normH >= 15 && normH < 45) return 'orange';
  if (normH >= 45 && normH < 68) return 'yellow';
  if (normH >= 68 && normH < 165) return 'green';
  if (normH >= 165 && normH < 195) return 'teal';
  if (normH >= 195 && normH < 255) return 'blue';
  if (normH >= 255 && normH < 315) return 'purple';
  return 'pink';
}

export function isSwatchInColorFamily(swatch: SwatchColor, target: ColorFamily | string): boolean {
  if (target === 'all') return true;
  const fam = target.toLowerCase();
  const name = swatch.name.toLowerCase();
  const { h, s, l } = swatch;

  if (fam === 'monochrome' || fam === 'gray' || fam === 'grey' || fam === 'slate' || fam === 'silver') {
    return (
      (s <= 20 && l >= 14 && l <= 88) ||
      swatch.family === 'monochrome' ||
      swatch.family === 'gray' ||
      name.includes('slate') ||
      name.includes('gray') ||
      name.includes('grey') ||
      name.includes('charcoal') ||
      name.includes('silver') ||
      name.includes('ash') ||
      name.includes('graphite')
    );
  }

  if (fam === 'white' || fam === 'light') {
    return (
      (l >= 84 && s <= 28) ||
      l >= 88 ||
      swatch.family === 'white' ||
      swatch.family === 'light' ||
      name.includes('white') ||
      name.includes('alabaster') ||
      name.includes('snow') ||
      name.includes('ivory') ||
      name.includes('cream') ||
      name.includes('porcelain') ||
      name.includes('pearl') ||
      name.includes('chalk')
    );
  }

  if (fam === 'dark' || fam === 'black') {
    return (
      l <= 22 ||
      swatch.family === 'dark' ||
      name.includes('black') ||
      name.includes('obsidian') ||
      name.includes('carbon') ||
      name.includes('night') ||
      name.includes('charcoal') ||
      name.includes('pitch') ||
      name.includes('midnight')
    );
  }

  if (fam === 'green' || fam.includes('emerald') || fam.includes('mint') || fam.includes('sage') || fam.includes('forest')) {
    return (
      (h >= 68 && h < 165 && s >= 14 && l >= 8 && l <= 92) ||
      swatch.family === 'green' ||
      name.includes('green') ||
      name.includes('emerald') ||
      name.includes('mint') ||
      name.includes('sage') ||
      name.includes('forest') ||
      name.includes('leaf') ||
      name.includes('lime') ||
      name.includes('moss') ||
      name.includes('olive')
    );
  }

  if (fam === 'blue' || fam.includes('navy') || fam.includes('cobalt') || fam.includes('ocean')) {
    return (
      (h >= 195 && h < 255 && s >= 14 && l >= 8 && l <= 92) ||
      swatch.family === 'blue' ||
      name.includes('blue') ||
      name.includes('navy') ||
      name.includes('cobalt') ||
      name.includes('sapphire') ||
      name.includes('ocean') ||
      name.includes('ice blue')
    );
  }

  if (fam === 'purple' || fam.includes('violet') || fam.includes('lavender') || fam.includes('plum')) {
    return (
      (h >= 255 && h < 310 && s >= 14 && l >= 8 && l <= 92) ||
      swatch.family === 'purple' ||
      name.includes('purple') ||
      name.includes('violet') ||
      name.includes('lavender') ||
      name.includes('plum') ||
      name.includes('amethyst') ||
      name.includes('orchid')
    );
  }

  if (fam === 'pink' || fam.includes('rose') || fam.includes('magenta') || fam.includes('blush')) {
    return (
      (h >= 310 && h < 345 && s >= 14 && l >= 8 && l <= 94) ||
      swatch.family === 'pink' ||
      name.includes('pink') ||
      name.includes('rose') ||
      name.includes('magenta') ||
      name.includes('blush') ||
      name.includes('cotton candy')
    );
  }

  if (fam === 'red' || fam.includes('crimson') || fam.includes('ruby') || fam.includes('scarlet')) {
    return (
      ((h >= 345 || h < 15) && s >= 14 && l >= 8 && l <= 90) ||
      swatch.family === 'red' ||
      name.includes('red') ||
      name.includes('crimson') ||
      name.includes('scarlet') ||
      name.includes('ruby') ||
      name.includes('brick')
    );
  }

  if (fam === 'orange' || fam.includes('amber') || fam.includes('peach') || fam.includes('rust')) {
    return (
      (h >= 15 && h < 45 && s >= 14 && l >= 8 && l <= 90) ||
      swatch.family === 'orange' ||
      name.includes('orange') ||
      name.includes('amber') ||
      name.includes('peach') ||
      name.includes('tangerine') ||
      name.includes('terracotta') ||
      name.includes('rust')
    );
  }

  if (fam === 'yellow' || fam.includes('gold') || fam.includes('lemon')) {
    return (
      (h >= 45 && h < 68 && s >= 14 && l >= 8 && l <= 92) ||
      swatch.family === 'yellow' ||
      name.includes('yellow') ||
      name.includes('gold') ||
      name.includes('ochre') ||
      name.includes('lemon') ||
      name.includes('buttercup')
    );
  }

  if (fam === 'teal' || fam.includes('cyan') || fam.includes('turquoise') || fam.includes('aqua')) {
    return (
      (h >= 165 && h < 195 && s >= 14 && l >= 8 && l <= 92) ||
      swatch.family === 'teal' ||
      name.includes('teal') ||
      name.includes('cyan') ||
      name.includes('turquoise') ||
      name.includes('aqua') ||
      name.includes('seafoam')
    );
  }

  return swatch.family === fam || name.includes(fam);
}

export function createSwatch(h: number, s: number, l: number): SwatchColor {
  const safeH = Math.round(((h % 360) + 360) % 360);
  const safeS = Math.round(Math.max(0, Math.min(100, s)));
  const safeL = Math.round(Math.max(3, Math.min(98, l)));

  const [r, g, b] = hslToRgb(safeH, safeS, safeL);
  const hex = rgbToHex(r, g, b);
  const isDark = isColorDark(r, g, b);
  const name = getColorName(safeH, safeS, safeL);
  const family = getColorFamily(safeH, safeS, safeL);

  return {
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${safeH}, ${safeS}%, ${safeL}%)`,
    h: safeH,
    s: safeS,
    l: safeL,
    isDark,
    name,
    family,
  };
}

export function createSwatchFromHex(hex: string): SwatchColor {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const formattedHex = rgbToHex(r, g, b);
  const isDark = isColorDark(r, g, b);
  const name = getColorName(h, s, l);
  const family = getColorFamily(h, s, l);

  return {
    hex: formattedHex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    h,
    s,
    l,
    isDark,
    name,
    family,
  };
}

// -------------------------------------------------------------
// Procedural Palette Title Generator
// -------------------------------------------------------------

const TITLES_BY_HARMONY: Record<HarmonyType, string[]> = {
  'all': ['Nordic Twilight', 'Solar Echo', 'Prism Bloom', 'Zenith Horizon'],
  'modern-ui': [
    'Linear Dark', 'Raycast Slate', 'Vercel Monochrome', 'GitHub Nebula',
    'Dashboard Indigo', 'Terminal Matrix', 'Fintech Cobalt', 'DevOps Graphite',
    'Modern Carbon', 'Studio Horizon', 'SaaS Velocity', 'Stripe Electric',
    'Cloud Architect', 'Refined Minimalist', 'Interface Quartz'
  ],
  'pastel': [
    'Peach Sorbet', 'Lavender Macaron', 'Matcha Cream', 'Cotton Cloud',
    'Blush Morning', 'Pastel Gelato', 'Mint Whisper', 'Vanilla Milkshake',
    'Opal Dream', 'Sakura Petal', 'Baby Blue Sky', 'Marshmallow Dream',
    'Sorbet Sunset', 'Nordic Pastel', 'Ethereal Dawn'
  ],
  'analogous': [
    'Pacific Tide', 'Autumn Embers', 'Spring Foliage', 'Borealis Stream',
    'Citrus Grove', 'Sunburst Warmth', 'Deep Glade', 'Lavender Field',
    'Coral Lagoon', 'Alpine Meadow', 'Golden Hour Ray', 'Cosmic Orchid',
    'Teal Currents', 'Flamingo Dusk', 'Midnight Cascade'
  ],
  'complementary': [
    'Cyber Saffron', 'Navy & Amber', 'Crimson & Jade', 'Electric Plum & Lime',
    'Tuscan Sun & Sea', 'Rust & Cyan', 'Royal Gold & Indigo', 'Flamenco Teal',
    'Fire & Frost', 'Amethyst & Citrus', 'Midnight Bronze', 'Terra Cobalt',
    'Sunset & Horizon', 'Neon Mint & Berry', 'Ochre & Prussian'
  ],
  'triadic': [
    'Bauhaus Primary', 'Neon Carnival', 'Cyber Arcade', 'Tropical Tropicana',
    'Prism Symphony', 'Triad Matrix', 'Pop Art Revival', 'Tokyo Metro',
    'Spectrum Pulse', 'Carnival Mirage', 'Retro Arcade', 'Solar Flare',
    'Geometric Flow', 'Futurist Canvas', 'Avant-Garde'
  ],
  'split-complementary': [
    'Twilight Mirage', 'Venetian Glass', 'Amazonian Flora', 'Kyoto Blossom',
    'Mediterranean Breeze', 'Sedona Canyon', 'Northern Lightglow', 'Astral Flight',
    'Desert Bloom', 'Moroccan Mosaic', 'Starlight Prism', 'Botanical Dusk'
  ],
  'neon-night': [
    'Cyberpunk 2077', 'Tokyo Underworld', 'Synthwave Drift', 'Matrix Glitch',
    'Neon District', 'Laser Highway', 'Acid Violet', 'Electric Shibuya',
    'Retrowave 1984', 'Chroma Velocity', 'Outrun Arcade', 'Cyberpunk Neon'
  ],
  'earthy-vintage': [
    'Terracotta Mesa', 'Olive & Clay', 'Warm Linen & Sand', 'Roasted Chestnut',
    'Vintage Parchment', 'Desert Sage', 'Earthy Ochre', 'Folk Pottery',
    'Nordic Timber', 'Sun-Baked Adobe', 'Espresso Roaster', 'Cotswold Stone',
    'Wild Herbarium', 'Rustic Hearth', 'Matcha & Cedar'
  ],
  'monochromatic': [
    'Pure Cobalt Scale', 'Obsidian Slate', 'Forest Pine Depth', 'Crimson Velvet',
    'Nordic Ice', 'Charcoal Smoke', 'Sage Gradation', 'Ultramarine Step',
    'Warm Cashmere', 'Deep Indigo Gradient', 'Emerald Tonal', 'Amethyst Ombre'
  ],
  'tetradic': [
    'Kaleidoscope Pulse', 'Carnival Royale', 'Four Seasons', 'Galactic Quadrant',
    'Dynamic Spectrum', 'Festival Horizon', 'Cosmic Tetrachord', 'Prismatic Fusion'
  ],
};

function getSemanticTitle(harmony: HarmonyType, seed: number, dominantHue?: number): string {
  if (harmony === 'monochromatic' && dominantHue !== undefined) {
    const h = ((dominantHue % 360) + 360) % 360;
    const s = Math.abs(Math.floor(seed));
    if (h < 18 || h >= 345) {
      const redTitles = ['Crimson Velvet', 'Ruby Noir', 'Scarlet Depth', 'Garnet Gradient', 'Bordeaux Scale', 'Crimson Embers', 'Ruby Shimmer'];
      return redTitles[s % redTitles.length];
    } else if (h < 45) {
      const orangeTitles = ['Warm Cashmere', 'Terracotta Ridge', 'Amber Solstice', 'Copper Horizon', 'Autumn Caramel', 'Desert Sienna', 'Cinnamon Glow'];
      return orangeTitles[s % orangeTitles.length];
    } else if (h < 70) {
      const yellowTitles = ['Golden Ochre', 'Gilded Amber', 'Honeyed Sunlight', 'Topaz Tonal', 'Sunlit Dune', 'Citrine Glow', 'Buttercup Ray'];
      return yellowTitles[s % yellowTitles.length];
    } else if (h < 165) {
      const greenTitles = ['Forest Pine Depth', 'Sage Gradation', 'Emerald Tonal', 'Moss Botanical', 'Alpine Glade', 'Matcha Depth', 'Olive Canopy'];
      return greenTitles[s % greenTitles.length];
    } else if (h < 200) {
      const tealTitles = ['Nordic Ice', 'Arctic Glade', 'Cerulean Tide', 'Aqua Horizon', 'Glacier Tonal', 'Cyan Currents', 'Seafoam Mist'];
      return tealTitles[s % tealTitles.length];
    } else if (h < 260) {
      const blueTitles = ['Pure Cobalt Scale', 'Ultramarine Step', 'Deep Indigo Gradient', 'Pacific Abyss', 'Sapphire Depths', 'Midnight Cobalt', 'Azure Cascade'];
      return blueTitles[s % blueTitles.length];
    } else if (h < 315) {
      const purpleTitles = ['Amethyst Ombre', 'Plum Nocturne', 'Cosmic Violet', 'Lavender Twilight', 'Velvet Orchid', 'Mulberry Dusk', 'Iris Bloom'];
      return purpleTitles[s % purpleTitles.length];
    } else {
      const pinkTitles = ['Blush Rose Petal', 'Rose Quartz Tonal', 'Wild Peony', 'Flamingo Dusk', 'Magenta Bloom', 'Sakura Glow'];
      return pinkTitles[s % pinkTitles.length];
    }
  }

  const titles = TITLES_BY_HARMONY[harmony] || TITLES_BY_HARMONY['all'];
  const index = Math.abs(Math.floor(seed)) % titles.length;
  return titles[index];
}

// -------------------------------------------------------------
// Mathematical Harmony Generators
// -------------------------------------------------------------

export function getFamilyBaseHue(family: ColorFamily, seed: number): number {
  const s = Math.abs(seed);
  const frac = (s * 37.1937) % 1;
  switch (family) {
    case 'red':
      return Math.floor((344 + frac * 32) % 360);
    case 'orange':
      return Math.floor(14 + frac * 32);
    case 'yellow':
      return Math.floor(45 + frac * 23);
    case 'green':
      return Math.floor(75 + frac * 85);
    case 'teal':
      return Math.floor(164 + frac * 32);
    case 'blue':
      return Math.floor(198 + frac * 54);
    case 'purple':
      return Math.floor(255 + frac * 52);
    case 'pink':
      return Math.floor(310 + frac * 34);
    case 'dark':
    case 'light':
    case 'white':
    case 'monochrome':
    case 'gray':
    case 'all':
    default:
      return Math.floor((s * 137.508) % 360);
  }
}

export function shuffleSingleSwatch(swatch: SwatchColor): SwatchColor {
  const mode = Math.random();
  let h = swatch.h;
  let s = swatch.s;
  let l = swatch.l;

  if (mode < 0.65) {
    const hueOffset = Math.floor(Math.random() * 30) - 15;
    h = (h + hueOffset + 360) % 360;
    s = Math.max(15, Math.min(100, s + (Math.floor(Math.random() * 28) - 14)));
    l = Math.max(10, Math.min(92, l + (Math.floor(Math.random() * 34) - 17)));
  } else {
    const steps = [30, -30, 45, -45, 60, -60, 120, 150, 180, 210];
    const step = steps[Math.floor(Math.random() * steps.length)];
    h = (h + step + 360) % 360;
    s = 40 + Math.floor(Math.random() * 55);
    l = 25 + Math.floor(Math.random() * 55);
  }

  return createSwatch(h, s, l);
}

// Rich combinatorial procedural title generator to prevent duplicate titles
function generateProceduralFamilyTitle(family: string, seed: number, styleIndex: number): string {
  const dictionary: Record<string, { adjectives: string[]; nouns: string[]; accents: string[] }> = {
    orange: {
      adjectives: [
        'Tuscan', 'Sunburst', 'Autumn', 'Amber', 'Terracotta', 'Valencia', 'Desert',
        'Saffron', 'Apricot', 'Tangerine', 'Copper', 'Rust', 'Golden', 'Solar',
        'Radiant', 'Marigold', 'Mojave', 'Sierra', 'Seville', 'Warm', 'Citrus',
        'Canyon', 'Ember', 'Persimmon', 'Ochre', 'Sedona', 'Cinnabar', 'Paprika',
        'Solstice', 'Fiesta', 'Brule', 'Ginger', 'Sonoran', 'Catalina', 'Marmalade',
      ],
      nouns: [
        'Mesa', 'Dune', 'Horizon', 'Ember', 'Glow', 'Mirage', 'Bloom', 'Canvas',
        'Solstice', 'Clay', 'Drift', 'Dawn', 'Cascade', 'Spark', 'Crest', 'Grove',
        'Plateau', 'Breeze', 'Hearth', 'Ridge', 'Spire', 'Valley', 'Haven', 'Harbor',
        'Blaze', 'Sands', 'Oasis', 'Passage', 'Sanctuary', 'Zenith', 'Vista',
      ],
      accents: ['& Navy', '& Cobalt', '& Indigo', '& Sage', '& Charcoal', 'Tonal Scale', 'Harmonic', 'Sunset', 'Studio', 'Gradient', '& Slate', '& Cream', '& Forest', 'Aesthetic'],
    },
    green: {
      adjectives: [
        'Emerald', 'Pine', 'Mint', 'Sage', 'Forest', 'Lush', 'Nordic', 'Botanical',
        'Olive', 'Moss', 'Verdant', 'Alpine', 'Jungle', 'Cedar', 'Fern', 'Jade',
        'Highland', 'Cypress', 'Basil', 'Matcha', 'Tundra', 'Balsam', 'Eucalyptus',
        'Meadow', 'Evergreen', 'Malachite', 'Canopy', 'Juniper', 'Laurel', 'Aspen',
      ],
      nouns: [
        'Canopy', 'Meadow', 'Glade', 'Dew', 'Valley', 'Spruce', 'Sanctuary', 'Grove',
        'Wildwood', 'Timber', 'Canyon', 'Oasis', 'Ridge', 'Flora', 'Highland', 'Glen',
        'Reserve', 'Haven', 'Breeze', 'Thicket', 'Arbor', 'Crest', 'Terrace', 'Domain',
      ],
      accents: ['& Gold', '& Slate', '& Cream', '& Terracotta', 'Tonal', 'Dew', 'Organic', 'Earthy', '& Charcoal', '& Amber', 'Zenith', 'Studio'],
    },
    blue: {
      adjectives: [
        'Pacific', 'Midnight', 'Arctic', 'Sapphire', 'Electric', 'Denim', 'Ocean',
        'Cobalt', 'Deep', 'Nordic', 'Cerulean', 'Marine', 'Breeze', 'Abyss', 'Glacier',
        'Baltic', 'Adriatic', 'Aegean', 'Starlit', 'Ultramarine', 'Nautical', 'Horizon',
        'Astral', 'Tempest', 'Poseidon', 'Hydra', 'Boreal', 'Azure', 'Indigo',
      ],
      nouns: [
        'Current', 'Horizon', 'Tide', 'Lagoon', 'Fjord', 'Wave', 'Harbor', 'Depths',
        'Skyline', 'Reef', 'Vessel', 'Coast', 'Shore', 'Drift', 'Breeze', 'Sound',
        'Passage', 'Abyss', 'Cove', 'Waters', 'Marina', 'Crest', 'Haven', 'Beacon',
      ],
      accents: ['& Coral', '& Amber', '& Gold', '& Silver', 'Deep Sea', 'Gradient', 'Minimal', '& Sand', '& Terracotta', '& Platinum'],
    },
    teal: {
      adjectives: [
        'Cyan', 'Seafoam', 'Lagoon', 'Pacific', 'Bermuda', 'Glacier', 'Turquoise',
        'Aqua', 'Marine', 'Coastal', 'Island', 'Tidal', 'Emerald', 'Breeze', 'Atoll',
        'Reef', 'Tahiti', 'Maldives', 'Aegean', 'Aquamarine', 'Tropical', 'Polar',
      ],
      nouns: [
        'Current', 'Glaze', 'Tide', 'Reef', 'Depths', 'Atoll', 'Mist', 'Cove',
        'Shallows', 'Shore', 'Drift', 'Haven', 'Waters', 'Oasis', 'Lagoon', 'Breeze',
        'Bay', 'Harbor', 'Straits', 'Isle', 'Sanctuary', 'Channel', 'Marina',
      ],
      accents: ['& Coral', '& Sand', '& Tangerine', '& Charcoal', 'Tropical', 'Oceanic', 'Crisp', '& Amber', '& Gold', 'Studio'],
    },
    purple: {
      adjectives: [
        'Royal', 'Velvet', 'Lavender', 'Plum', 'Cosmic', 'Lilac', 'Amethyst', 'Orchid',
        'Twilight', 'Violet', 'Mystic', 'Imperial', 'Haze', 'Iris', 'Ethereal', 'Mauve',
        'Galaxy', 'Mulberry', 'Wisteria', 'Stellar', 'Nocturne', 'Nebula', 'Byzantine',
      ],
      nouns: [
        'Nebula', 'Echo', 'Twilight', 'Mist', 'Glow', 'Eclipse', 'Nocturne', 'Horizon',
        'Petals', 'Garden', 'Aura', 'Crown', 'Valley', 'Whisper', 'Spire', 'Sanctuary',
        'Dusk', 'Constellation', 'Passage', 'Velvet', 'Haven', 'Crest', 'Haze',
      ],
      accents: ['& Gold', '& Mint', '& Charcoal', '& Rose', 'Chromatic', 'Dusk', 'Radiance', '& Sage', '& Silver', 'Studio'],
    },
    pink: {
      adjectives: [
        'Blush', 'Rose', 'Cotton', 'Cherry', 'Dusty', 'Magenta', 'Peachy', 'Coral',
        'Flamingo', 'Neon', 'Pastel', 'Silken', 'Petal', 'Ruby', 'Floral', 'Fuchsia',
        'Ballet', 'Sakura', 'Sorbet', 'Peony', 'Carnation', 'Sunset', 'Quartz',
      ],
      nouns: [
        'Sunset', 'Blossom', 'Silk', 'Bloom', 'Dawn', 'Horizon', 'Haze', 'Confection',
        'Satin', 'Mirage', 'Garden', 'Dew', 'Charm', 'Glow', 'Bouquet', 'Petal',
        'Sanctuary', 'Breeze', 'Haven', 'Palette', 'Aura', 'Crest', 'Whisper',
      ],
      accents: ['& Slate', '& Emerald', '& Champagne', '& Cream', 'Romance', 'Pastel', 'Vivid', '& Charcoal', '& Olive', 'Studio'],
    },
    red: {
      adjectives: [
        'Crimson', 'Scarlet', 'Garnet', 'Ruby', 'Terra', 'Cherry', 'Cardinal', 'Ember',
        'Bloodstone', 'Imperial', 'Brick', 'Mahogany', 'Vermilion', 'Cabernet', 'Burgundy',
        'Venetian', 'Merlot', 'Cinnabar', 'Bordeaux', 'Rustic', 'Auburn', 'Marsala',
      ],
      nouns: [
        'Velvet', 'Flame', 'Wine', 'Lacquer', 'Horizon', 'Clay', 'Forge', 'Hearth',
        'Spire', 'Pulse', 'Blaze', 'Crest', 'Core', 'Valley', 'Chateau', 'Ember',
        'Sanctuary', 'Beacon', 'Current', 'Passage', 'Ridge', 'Haven', 'Domain',
      ],
      accents: ['& Obsidian', '& Charcoal', '& Gold', '& Sand', 'Vintage', 'Rich', 'Bold', '& Slate', '& Cream', 'Studio'],
    },
    yellow: {
      adjectives: [
        'Golden', 'Sunlit', 'Buttercup', 'Mustard', 'Lemon', 'Solar', 'Marigold',
        'Honey', 'Ochre', 'Amber', 'Canary', 'Flaxen', 'Radiant', 'Daffodil', 'Saffron',
        'Cornsilk', 'Citrine', 'Topaz', 'Sunflower', 'Biscotti', 'Mimosa', 'Savanna',
      ],
      nouns: [
        'Hour', 'Zest', 'Field', 'Ray', 'Canvas', 'Crown', 'Drift', 'Morning',
        'Prairie', 'Dawn', 'Meadow', 'Spark', 'Crest', 'Bloom', 'Harvest', 'Horizon',
        'Glow', 'Haven', 'Sanctuary', 'Grove', 'Sunburst', 'Solstice', 'Breeze',
      ],
      accents: ['& Slate', '& Navy', '& Teal', '& Olive', 'Vibrant', 'Warm Tones', 'Sunburst', '& Charcoal', '& Indigo', 'Studio'],
    },
    monochrome: {
      adjectives: [
        'Nordic', 'Obsidian', 'Graphite', 'Architectural', 'Minimal', 'Titanium',
        'Slate', 'Charcoal', 'Carbon', 'Pewter', 'Industrial', 'Steel', 'Monochrome',
        'Concrete', 'Ash', 'Granite', 'Basalt', 'Shadow', 'Monolith', 'Linear',
      ],
      nouns: [
        'Scale', 'Step', 'Horizon', 'Spectrum', 'Canvas', 'Grid', 'Elevation', 'Structure',
        'Form', 'Contrast', 'Silhouette', 'Shade', 'Tonal', 'Facet', 'Foundation', 'Matrix',
      ],
      accents: ['Tonal Scale', 'Minimalist', 'Pure Step', 'Architect', 'Studio', 'Balanced', 'Monotone', 'Clean Form'],
    },
    gray: {
      adjectives: [
        'Nordic', 'Obsidian', 'Graphite', 'Architectural', 'Minimal', 'Titanium',
        'Slate', 'Charcoal', 'Carbon', 'Pewter', 'Industrial', 'Steel', 'Greige',
        'Concrete', 'Ash', 'Granite', 'Basalt', 'Shadow', 'Monolith', 'Linear',
      ],
      nouns: [
        'Scale', 'Step', 'Horizon', 'Spectrum', 'Canvas', 'Grid', 'Elevation', 'Structure',
        'Form', 'Contrast', 'Silhouette', 'Shade', 'Tonal', 'Facet', 'Foundation', 'Matrix',
      ],
      accents: ['Tonal Scale', 'Minimalist', 'Pure Step', 'Architect', 'Studio', 'Balanced', 'Monotone', 'Clean Form'],
    },
    white: {
      adjectives: [
        'Pure', 'Ivory', 'Porcelain', 'Alabaster', 'Snow', 'Chalk', 'Nordic', 'Ethereal',
        'Linen', 'Silk', 'Pearl', 'Cotton', 'Milk', 'Clean', 'Bone', 'Frost', 'Cashmere',
        'Parchment', 'Serene', 'Luminous', 'Canvas', 'Subtle', 'Minimal', 'Cloud',
      ],
      nouns: [
        'Canvas', 'Horizon', 'Whisper', 'Silence', 'Atelier', 'Studio', 'Gallery', 'Sanctuary',
        'Breeze', 'Light', 'Cloud', 'Mist', 'Silk', 'Foundation', 'Haven', 'Perfection',
      ],
      accents: ['& French Navy', '& Forest Pine', '& Terracotta', '& Cognac', '& Rose Quartz', '& Charcoal', '& Gold Leaf', '& Sage', '& Olive', '& Cobalt', '& Amber'],
    },
    light: {
      adjectives: [
        'Pure', 'Ivory', 'Porcelain', 'Alabaster', 'Snow', 'Chalk', 'Nordic', 'Ethereal',
        'Linen', 'Silk', 'Pearl', 'Cotton', 'Milk', 'Clean', 'Bone', 'Frost', 'Cashmere',
        'Parchment', 'Serene', 'Luminous', 'Canvas', 'Subtle', 'Minimal', 'Cloud',
      ],
      nouns: [
        'Canvas', 'Horizon', 'Whisper', 'Silence', 'Atelier', 'Studio', 'Gallery', 'Sanctuary',
        'Breeze', 'Light', 'Cloud', 'Mist', 'Silk', 'Foundation', 'Haven', 'Perfection',
      ],
      accents: ['& French Navy', '& Forest Pine', '& Terracotta', '& Cognac', '& Rose Quartz', '& Charcoal', '& Gold Leaf', '& Sage', '& Olive', '& Cobalt', '& Amber'],
    },
    dark: {
      adjectives: [
        'Obsidian', 'Midnight', 'Carbon', 'Eclipse', 'Deep Space', 'Nocturnal', 'Jet',
        'Abyssal', 'Cosmic', 'Shadow', 'Stygian', 'Blackout', 'Onyx', 'Dark Matter',
        'Pitch', 'Noir', 'Nebula', 'Stealth', 'Void', 'Black Diamond',
      ],
      nouns: [
        'Midnight', 'Eclipse', 'Void', 'Noir', 'Matrix', 'Horizon', 'Abyss', 'Chamber',
        'Silence', 'Frontier', 'Sanctuary', 'Domain', 'Shadows', 'Spire', 'Apex',
      ],
      accents: ['& Electric Cyan', '& Crimson Ember', '& Ultraviolet', '& Neon Mint', '& Amber Glow', '& Glacier Ice', '& Coral Pop', '& Gold Accent', '& Pure White'],
    },
  };

  const famKey = family.toLowerCase().trim();
  const famData = dictionary[famKey] || dictionary['orange'];

  const s = Math.abs(seed);
  const hash1 = Math.floor(s * 13 + styleIndex * 7) % famData.adjectives.length;
  const hash2 = Math.floor(s * 29 + styleIndex * 19) % famData.nouns.length;
  const hash3 = Math.floor(s * 41 + styleIndex * 31) % famData.accents.length;

  const adj = famData.adjectives[hash1];
  const noun = famData.nouns[hash2];
  const accent = famData.accents[hash3];

  const variant = Math.floor(s * 7) % 3;
  if (variant === 0) {
    return `${adj} ${noun} ${accent}`;
  } else if (variant === 1) {
    return `${adj} ${noun}`;
  } else {
    return `${adj} ${accent}`;
  }
}

export function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function generatePalette(
  harmonyType: HarmonyType = 'all',
  customSeed?: number,
  colorCount: SwatchCount = 5,
  targetFamily: ColorFamily = 'all',
  forcedHue?: number
): Palette {
  const seed = customSeed !== undefined ? customSeed : 42000.42;
  const s = Math.abs(seed);
  
  // Choose harmony if 'all'
  let harmony = harmonyType;
  if (harmony === 'all') {
    const list: HarmonyType[] = [
      'modern-ui',
      'pastel',
      'analogous',
      'complementary',
      'triadic',
      'split-complementary',
      'neon-night',
      'earthy-vintage',
      'monochromatic',
    ];
    if (targetFamily === 'dark') {
      harmony = seed % 2 < 1 ? 'neon-night' : 'modern-ui';
    } else if (targetFamily === 'light') {
      harmony = 'pastel';
    } else {
      harmony = list[Math.floor((s * 13) % list.length)];
    }
  }

  // Base hue calculation with high entropy
  let baseHue: number;
  if (forcedHue !== undefined) {
    baseHue = Math.round(((forcedHue % 360) + 360) % 360);
  } else if (targetFamily !== 'all') {
    baseHue = getFamilyBaseHue(targetFamily, seed);
  } else {
    const goldenAngle = 137.50776405;
    const jitter = (pseudoRandom(s * 7.193) - 0.5) * 28;
    baseHue = Math.round((s * goldenAngle + jitter + 360000) % 360);
  }

  const likes = 120 + Math.floor((s * 71) % 1840);
  let title = getSemanticTitle(harmony, seed, baseHue);

  let swatches: SwatchColor[] = [];
  const tags: string[] = [harmony];
  if (targetFamily !== 'all') {
    tags.push(targetFamily);
  }

  // When a specific target color family is requested, generate authentic, varied palettes
  if (targetFamily === 'monochrome' || targetFamily === 'gray') {
    const styleIndex = Math.floor(Math.abs(seed * 7)) % 16;
    const toneHue = Math.floor(((seed * 31) % 360));
    const sat = 2 + Math.floor(Math.abs(seed * 3) % 10);

    switch (styleIndex % 6) {
      case 0:
        // Cool Arctic Slate Ramp
        swatches = [
          createSwatch(215, 16, 12),
          createSwatch(215, 14, 25),
          createSwatch(215, 12, 42),
          createSwatch(215, 10, 62),
          createSwatch(215, 12, 80),
          createSwatch(215, 16, 94),
        ];
        break;
      case 1:
        // Warm Greige & Stone
        swatches = [
          createSwatch(35, 12, 14),
          createSwatch(35, 14, 28),
          createSwatch(35, 10, 48),
          createSwatch(35, 12, 68),
          createSwatch(35, 14, 84),
          createSwatch(35, 16, 95),
        ];
        break;
      case 2:
        // High Contrast Obsidian & Alabaster
        swatches = [
          createSwatch(toneHue, sat, 8),
          createSwatch(toneHue, sat, 22),
          createSwatch(toneHue, sat, 50),
          createSwatch(toneHue, sat, 76),
          createSwatch(toneHue, sat, 92),
          createSwatch(toneHue, sat, 98),
        ];
        break;
      case 3:
        // Industrial Concrete & Titanium
        swatches = [
          createSwatch(200, 8, 16),
          createSwatch(200, 6, 32),
          createSwatch(200, 7, 54),
          createSwatch(200, 5, 70),
          createSwatch(200, 8, 86),
          createSwatch(200, 10, 96),
        ];
        break;
      case 4:
        // Deep Charcoal Noir with Pale Ash
        swatches = [
          createSwatch(toneHue, 4, 10),
          createSwatch(toneHue, 6, 20),
          createSwatch(toneHue, 5, 36),
          createSwatch(toneHue, 6, 58),
          createSwatch(toneHue, 4, 78),
          createSwatch(toneHue, 3, 92),
        ];
        break;
      default:
        // Silver Smoke & Monolith
        swatches = [
          createSwatch(220, 10, 15),
          createSwatch(220, 8, 30),
          createSwatch(220, 7, 46),
          createSwatch(220, 9, 64),
          createSwatch(220, 11, 82),
          createSwatch(220, 14, 96),
        ];
        break;
    }
    title = generateProceduralFamilyTitle(targetFamily, seed, styleIndex);
    tags.push('gray', 'slate', 'monochrome', 'minimalist', 'architectural');
  } else if (targetFamily === 'white' || targetFamily === 'light') {
    const s = Math.abs(seed);
    const themeArchetype = Math.floor(s * 11) % 6;
    const baseLightHue = Math.floor((s * 67.31 + 43) % 360);
    const companionHue = (baseLightHue + 30 + Math.floor(s * 25) % 60) % 360;
    const contrastHue = (baseLightHue + 180) % 360;

    switch (themeArchetype) {
      case 0:
        // Soft Airy Pastel Bloom
        swatches = [
          createSwatch(baseLightHue, 35, 95),
          createSwatch(baseLightHue, 45, 88),
          createSwatch(companionHue, 40, 84),
          createSwatch(companionHue, 50, 78),
          createSwatch(contrastHue, 30, 92),
          createSwatch(baseLightHue, 55, 32),
        ];
        break;
      case 1:
        // Minimalist Linen, Porcelain & Warm Sand
        swatches = [
          createSwatch(35 + Math.floor(s % 15), 18, 97),
          createSwatch(38 + Math.floor(s % 15), 24, 92),
          createSwatch(32 + Math.floor(s % 15), 32, 84),
          createSwatch(26 + Math.floor(s % 15), 45, 76),
          createSwatch(20 + Math.floor(s % 15), 55, 68),
          createSwatch(215, 20, 22),
        ];
        break;
      case 2:
        // Nordic Ice & Frosted Blue Tint
        swatches = [
          createSwatch(210, 20, 98),
          createSwatch(205, 30, 93),
          createSwatch(200, 38, 86),
          createSwatch(195, 45, 78),
          createSwatch(215, 60, 68),
          createSwatch(220, 50, 22),
        ];
        break;
      case 3:
        // Botanical Sage & Matcha Cream
        swatches = [
          createSwatch(95, 18, 97),
          createSwatch(120, 22, 92),
          createSwatch(135, 28, 84),
          createSwatch(145, 34, 76),
          createSwatch(42, 60, 80),
          createSwatch(150, 45, 20),
        ];
        break;
      case 4:
        // Lavender Mist & Pearl Silk
        swatches = [
          createSwatch(285, 20, 97),
          createSwatch(280, 28, 92),
          createSwatch(300, 30, 85),
          createSwatch(330, 35, 82),
          createSwatch(260, 40, 75),
          createSwatch(275, 45, 24),
        ];
        break;
      default:
        // Clean Modern UI High-Key Palette
        swatches = [
          createSwatch(baseLightHue, 12, 98),
          createSwatch(baseLightHue, 22, 93),
          createSwatch(baseLightHue, 35, 85),
          createSwatch((baseLightHue + 45) % 360, 40, 78),
          createSwatch((baseLightHue + 90) % 360, 50, 72),
          createSwatch(baseLightHue, 60, 26),
        ];
        break;
    }
    title = generateProceduralFamilyTitle('white', seed, themeArchetype);
    tags.push('white', 'light', 'clean', 'minimal', 'bright', 'pastel', 'soft');
  } else if (targetFamily === 'dark') {
    const s = Math.abs(seed);
    const themeArchetype = Math.floor(s * 13) % 6;
    const baseDarkHue = Math.floor((s * 73.19 + 17) % 360);
    const accentHue = (baseDarkHue + 120 + Math.floor(s * 31) % 120) % 360;
    const satTweak = 15 + Math.floor((s * 19) % 30);

    switch (themeArchetype) {
      case 0:
        // Obsidian Abyss with Neon Luminous Pop
        swatches = [
          createSwatch(baseDarkHue, satTweak + 10, 6 + Math.floor(s % 3)),
          createSwatch(baseDarkHue, satTweak, 12 + Math.floor((s * 3) % 4)),
          createSwatch(baseDarkHue, satTweak - 5, 20 + Math.floor((s * 5) % 5)),
          createSwatch(accentHue, 92, 54 + Math.floor((s * 7) % 10)),
          createSwatch((accentHue + 35) % 360, 88, 64),
          createSwatch(baseDarkHue, 15, 88),
        ];
        break;
      case 1:
        // Deep Jewel Tone Noir (Emerald, Sapphire, Ruby, Amethyst in the dark)
        swatches = [
          createSwatch(baseDarkHue, 50, 7),
          createSwatch(baseDarkHue, 45, 14),
          createSwatch(baseDarkHue, 40, 22),
          createSwatch(baseDarkHue, 78, 38),
          createSwatch((baseDarkHue + 40) % 360, 85, 55),
          createSwatch(baseDarkHue, 25, 92),
        ];
        break;
      case 2:
        // Cyber Noir & Dual Hologram
        swatches = [
          createSwatch((baseDarkHue + 210) % 360, 35, 7),
          createSwatch((baseDarkHue + 210) % 360, 30, 15),
          createSwatch((baseDarkHue + 210) % 360, 25, 24),
          createSwatch(baseDarkHue, 95, 55),
          createSwatch((baseDarkHue + 180) % 360, 92, 60),
          createSwatch(baseDarkHue, 20, 90),
        ];
        break;
      case 3:
        // Warm Charcoal, Roast Espresso & Golden Ember
        swatches = [
          createSwatch(25 + Math.floor(s % 20), 30, 6),
          createSwatch(25 + Math.floor(s % 20), 28, 13),
          createSwatch(25 + Math.floor(s % 20), 22, 22),
          createSwatch(38 + Math.floor(s % 15), 94, 52),
          createSwatch(18 + Math.floor(s % 15), 90, 60),
          createSwatch(35, 20, 90),
        ];
        break;
      case 4:
        // Deep Monochrome Carbon Gradient
        swatches = [
          createSwatch(baseDarkHue, 12, 6),
          createSwatch(baseDarkHue, 14, 12),
          createSwatch(baseDarkHue, 16, 18),
          createSwatch(baseDarkHue, 18, 25),
          createSwatch(baseDarkHue, 15, 34),
          createSwatch(baseDarkHue, 10, 86),
        ];
        break;
      default:
        // Abyssal Midnight Matrix
        swatches = [
          createSwatch(baseDarkHue, 42, 7),
          createSwatch(baseDarkHue, 36, 14),
          createSwatch((baseDarkHue + 25) % 360, 30, 22),
          createSwatch((baseDarkHue + 60) % 360, 88, 56),
          createSwatch((baseDarkHue + 90) % 360, 82, 68),
          createSwatch(baseDarkHue, 22, 92),
        ];
        break;
    }
    title = generateProceduralFamilyTitle(targetFamily, seed, themeArchetype);
    tags.push('dark', 'night', 'black', 'deep', 'cyber', 'noir', 'obsidian');
  } else if (targetFamily !== 'all') {
    // A specific color family (e.g. orange, green, blue, teal, purple, pink, red, yellow)
    // Generate richly varied, authentic designer palettes where the chosen color family
    // shines prominently with high variety across 16 different aesthetic structures:
    const styleIndex = Math.floor(Math.abs(seed * 7)) % 16;
    const h = baseHue;
    const satFrac = (Math.abs(seed * 19.3) % 1);
    const sat = 65 + Math.floor(satFrac * 30);
    const jitter = Math.floor((Math.abs(seed * 11) % 1) * 12) - 6;

    switch (styleIndex) {
      case 0: {
        // Modern Brand UI: Dark canvas + Target Color vibrant hero + soft companions
        const comp = (h + 180 + jitter) % 360;
        swatches = [
          createSwatch((h + 180) % 360, 20, 11), // Deep dark surface
          createSwatch(h, sat + 5, 52),          // Vivid core target color
          createSwatch((h + 15) % 360, sat - 5, 66), // Lighter adjacent
          createSwatch(comp, 75, 58),            // Contrasting companion
          createSwatch(h, 20, 88),               // Light readable surface
          createSwatch((h + 180) % 360, 15, 22), // Mid surface
        ];
        tags.push('brand-ui', 'ui-kit', 'modern');
        break;
      }
      case 1: {
        // Crisp Editorial Light: Alabaster canvas + bold target color statement
        swatches = [
          createSwatch(h, sat + 8, 48),          // Bold target color
          createSwatch((h - 15 + 360) % 360, sat - 10, 32), // Deep supporting tone
          createSwatch(h, 25, 84),               // Soft tinted surface
          createSwatch(h, 15, 94),               // Alabaster paper white
          createSwatch((h + 180) % 360, 30, 20), // Ink noir text
          createSwatch((h + 30) % 360, sat, 60), // Warm companion pop
        ];
        tags.push('editorial', 'magazine', 'clean');
        break;
      }
      case 2: {
        // Rich Complementary Duo: Target color paired with high-impact opposite
        const comp = (h + 180) % 360;
        swatches = [
          createSwatch(h, sat - 10, 24),         // Deep shade of target
          createSwatch(h, sat + 5, 52),          // Vibrant target
          createSwatch(h, sat - 20, 84),         // Light tint of target
          createSwatch(comp, sat - 5, 26),       // Deep comp shade
          createSwatch(comp, sat + 6, 54),       // Vibrant comp
          createSwatch(comp, sat - 25, 88),      // Light comp tint
        ];
        tags.push('complementary', 'high-contrast', 'duo');
        break;
      }
      case 3: {
        // Smooth Analogous Flow: Seamless gradient with target color at the heart
        const step = 14 + Math.floor((Math.abs(seed * 5) % 1) * 8);
        swatches = [
          createSwatch((h - step * 2 + 360) % 360, sat - 15, 26),
          createSwatch((h - step + 360) % 360, sat - 5, 42),
          createSwatch(h, sat + 5, 54),          // Hero target color
          createSwatch((h + step) % 360, sat, 66),
          createSwatch((h + step * 2) % 360, sat - 10, 80),
          createSwatch((h + step * 3) % 360, sat - 20, 92),
        ];
        tags.push('analogous', 'harmonic', 'flow');
        break;
      }
      case 4: {
        // Earthy Vintage & Organic: Muted earthy companions (terracotta, olive, ochre, sand)
        swatches = [
          createSwatch(h, sat - 18, 38),         // Earthy tone of target
          createSwatch((h + 55) % 360, 38, 46),  // Muted olive / warm sage
          createSwatch(h, 24, 82),               // Sand canvas
          createSwatch((h - 25 + 360) % 360, 48, 20), // Deep roast umber
          createSwatch((h + 25) % 360, 72, 58),  // Amber / golden warmth
          createSwatch(h, 14, 94),               // Cream highlight
        ];
        tags.push('earthy-vintage', 'organic', 'warm');
        break;
      }
      case 5: {
        // Triadic Geometry: Target color with two vibrant geometric vertices
        const t1 = (h + 120 + jitter) % 360;
        const t2 = (h + 240 - jitter + 360) % 360;
        swatches = [
          createSwatch(h, sat + 6, 52),          // Core target
          createSwatch(h, sat - 15, 28),         // Deep target base
          createSwatch(t1, 74, 52),              // Vertex 1
          createSwatch(t2, 76, 56),              // Vertex 2
          createSwatch(t2, 35, 86),              // Soft surface tint
          createSwatch(h, 22, 92),               // Pale highlight
        ];
        tags.push('triadic', 'vibrant', 'geometric');
        break;
      }
      case 6: {
        // Split Complementary: Target color with balanced bilateral companions
        const s1 = (h + 150) % 360;
        const s2 = (h + 210) % 360;
        swatches = [
          createSwatch(h, sat + 4, 50),          // Core target
          createSwatch(h, sat - 18, 26),         // Dark grounding shade
          createSwatch(s1, 72, 50),              // Wing 1
          createSwatch(s2, 75, 54),              // Wing 2
          createSwatch(s1, 30, 84),              // Tint 1
          createSwatch(h, 20, 92),               // Light canvas
        ];
        tags.push('split-complementary', 'balanced');
        break;
      }
      case 7: {
        // High-Contrast Cyberpunk / Neon Night with Target color
        swatches = [
          createSwatch((h + 180) % 360, 35, 8),  // Abyssal black
          createSwatch(h, 96, 54),               // Electric target neon
          createSwatch((h + 40) % 360, 90, 62),  // Companion neon pop
          createSwatch((h + 180) % 360, 25, 20), // Dark container surface
          createSwatch(h, 85, 78),               // Glowing pastel neon
          createSwatch(h, 20, 94),               // Bright starlight
        ];
        tags.push('neon-night', 'cyberpunk', 'electric');
        break;
      }
      case 8: {
        // Pastel Sorbet: Dreamy, delicate, airy high-lightness aesthetic
        swatches = [
          createSwatch(h, sat - 15, 82),         // Soft target pastel
          createSwatch(h, sat, 60),              // Saturated target accent
          createSwatch((h + 25) % 360, sat - 10, 80), // Companion pastel
          createSwatch((h - 25 + 360) % 360, sat - 20, 86),
          createSwatch(h, 25, 94),               // Creamy cloud
          createSwatch((h + 50) % 360, sat - 15, 76),
        ];
        tags.push('pastel', 'sorbet', 'soft');
        break;
      }
      case 9: {
        // Tonal Depth Ombre: Dramatic gradient from rich dark mahogany/navy to glowing highlight
        swatches = [
          createSwatch(h, sat - 10, 16),         // Deepest shade
          createSwatch(h, sat, 32),              // Rich mid-dark
          createSwatch(h, sat + 6, 50),          // Core target color
          createSwatch(h, sat - 4, 66),          // Vibrant light tint
          createSwatch(h, sat - 14, 82),         // Soft pastel
          createSwatch(h, sat - 24, 94),         // Delicate highlight
        ];
        tags.push('tonal', 'ombre', 'shades');
        break;
      }
      case 10: {
        // Sunset Horizon: Warm progressive atmospheric glow
        const warmShift = (h + 28) % 360;
        swatches = [
          createSwatch((h - 20 + 360) % 360, sat, 26),
          createSwatch(h, sat + 4, 48),          // Hero target color
          createSwatch(warmShift, sat + 2, 60),
          createSwatch((warmShift + 25) % 360, sat - 5, 72),
          createSwatch(h, 35, 86),
          createSwatch(warmShift, 20, 94),
        ];
        tags.push('sunset', 'horizon', 'atmospheric');
        break;
      }
      case 11: {
        // Oceanic Depth / Marine Contrast
        const oceanic = 210;
        swatches = [
          createSwatch(oceanic, 65, 14),         // Deep oceanic navy
          createSwatch(oceanic, 55, 34),         // Marine slate
          createSwatch(h, sat + 6, 54),          // Hero target color pop
          createSwatch((h + 15) % 360, sat - 5, 68), // Supporting tone
          createSwatch(oceanic, 25, 84),         // Seafoam wash
          createSwatch(oceanic, 18, 95),         // Ocean mist
        ];
        tags.push('oceanic', 'marine', 'contrast');
        break;
      }
      case 12: {
        // Retro 70s Warmth: Nostalgic mustard, avocado, terracotta, warm cream
        swatches = [
          createSwatch(h, sat - 5, 42),          // Retro target tone
          createSwatch(48, 75, 48),              // Vintage mustard gold
          createSwatch(95, 35, 36),              // Retro avocado olive
          createSwatch(18, 65, 38),              // Burnt terracotta
          createSwatch(38, 30, 84),              // Warm linen
          createSwatch(38, 20, 94),              // Biscuit cream
        ];
        tags.push('retro-70s', 'nostalgic', 'warm');
        break;
      }
      case 13: {
        // Modern Minimalist: Strict monochrome base + single punchy target color
        swatches = [
          createSwatch(h, 10, 12),               // Deep charcoal
          createSwatch(h, sat + 8, 52),          // Explosive target color punch
          createSwatch(h, 8, 38),                // Slate mid
          createSwatch(h, 6, 68),                // Pale silver
          createSwatch(h, 15, 88),               // Soft tint
          createSwatch(h, 5, 96),                // Off-white paper
        ];
        tags.push('minimalist', 'clean', 'accent');
        break;
      }
      case 14: {
        // Quad Tetradic Harmony: 4 balanced equidistant colors around the wheel
        const q1 = (h + 90) % 360;
        const q2 = (h + 180) % 360;
        const q3 = (h + 270) % 360;
        swatches = [
          createSwatch(h, sat + 5, 52),          // Target color
          createSwatch(q1, 72, 48),              // Vertex 2
          createSwatch(q2, 74, 54),              // Vertex 3
          createSwatch(q3, 70, 50),              // Vertex 4
          createSwatch(h, 25, 86),               // Soft wash
          createSwatch(h, 15, 94),               // Light canvas
        ];
        tags.push('tetradic', 'geometry', 'balanced');
        break;
      }
      default: {
        // Botanical Garden: Target color with lush organic foliage accents
        const foliage = 135;
        swatches = [
          createSwatch(foliage, 48, 22),         // Deep botanical pine
          createSwatch(foliage, 35, 44),         // Muted foliage sage
          createSwatch(h, sat + 6, 54),          // Hero target flower/bloom
          createSwatch((h + 18) % 360, sat - 4, 68), // Petal highlight
          createSwatch(foliage, 20, 84),         // Meadow mist
          createSwatch(h, 20, 94),               // Alabaster dew
        ];
        tags.push('botanical', 'organic', 'nature');
        break;
      }
    }

    title = generateProceduralFamilyTitle(targetFamily, seed, styleIndex);
    tags.push(targetFamily, 'curated');
  } else {
    // targetFamily is 'all' - standard varied harmony generators
    switch (harmony) {
      case 'modern-ui': {
        const brandH = baseHue;
        const bgSat = 12 + Math.floor((seed * 3) % 16);
        const brandSat = 78 + Math.floor((seed * 5) % 18);

        swatches = [
          createSwatch(brandH + 10, bgSat, 11),
          createSwatch(brandH, brandSat, 50),
          createSwatch((brandH + 28) % 360, 72, 62),
          createSwatch(brandH, 20, 88),
          createSwatch((brandH + 180) % 360, 82, 60),
          createSwatch((brandH + 120) % 360, 75, 70),
        ];
        tags.push('developer', 'ui', 'modern', 'dark');
        break;
      }

      case 'pastel': {
        const sat = 45 + Math.floor((seed * 7) % 20);
        swatches = [
          createSwatch(baseHue, sat, 86),
          createSwatch((baseHue + 35) % 360, sat - 5, 82),
          createSwatch((baseHue + 75) % 360, sat, 88),
          createSwatch((baseHue + 160) % 360, sat + 5, 84),
          createSwatch((baseHue + 210) % 360, sat, 89),
          createSwatch((baseHue + 270) % 360, sat - 4, 85),
        ];
        tags.push('soft', 'aesthetic', 'light');
        break;
      }

      case 'analogous': {
        const h0 = baseHue;
        const step = 16 + Math.floor((seed * 3) % 12);
        swatches = [
          createSwatch((h0 - step * 2 + 360) % 360, 70, 24),
          createSwatch((h0 - step + 360) % 360, 74, 40),
          createSwatch(h0, 78, 56),
          createSwatch((h0 + step) % 360, 72, 70),
          createSwatch((h0 + step * 2) % 360, 68, 86),
          createSwatch((h0 + step * 3) % 360, 60, 92),
        ];
        tags.push('smooth', 'cohesive', 'adjacent');
        break;
      }

      case 'complementary': {
        const compHue = (baseHue + 180) % 360;
        swatches = [
          createSwatch(baseHue, 75, 22),
          createSwatch(baseHue, 80, 52),
          createSwatch(baseHue, 25, 90),
          createSwatch(compHue, 85, 54),
          createSwatch(compHue, 70, 32),
          createSwatch(compHue, 40, 80),
        ];
        tags.push('high-contrast', 'duotone', 'vibrant');
        break;
      }

      case 'triadic': {
        const h1 = baseHue;
        const h2 = (baseHue + 120) % 360;
        const h3 = (baseHue + 240) % 360;
        swatches = [
          createSwatch(h1, 72, 32),
          createSwatch(h1, 80, 56),
          createSwatch(h2, 78, 58),
          createSwatch(h3, 76, 54),
          createSwatch(h3, 50, 88),
          createSwatch(h2, 40, 90),
        ];
        tags.push('balanced', 'dynamic', 'classic');
        break;
      }

      case 'split-complementary': {
        const c1 = (baseHue + 150) % 360;
        const c2 = (baseHue + 210) % 360;
        swatches = [
          createSwatch(baseHue, 68, 25),
          createSwatch(baseHue, 76, 52),
          createSwatch(c1, 72, 58),
          createSwatch(c2, 74, 55),
          createSwatch(c2, 45, 87),
          createSwatch(c1, 40, 90),
        ];
        tags.push('balanced-contrast', 'refined');
        break;
      }

      case 'neon-night': {
        swatches = [
          createSwatch(baseHue, 40, 10),
          createSwatch(baseHue, 100, 55),
          createSwatch((baseHue + 60) % 360, 98, 58),
          createSwatch((baseHue + 140) % 360, 95, 60),
          createSwatch((baseHue + 280) % 360, 92, 64),
          createSwatch((baseHue + 320) % 360, 96, 68),
        ];
        tags.push('cyberpunk', 'dark', 'electric');
        break;
      }

      case 'earthy-vintage': {
        const warmH = 25 + Math.floor((seed * 11) % 65);
        swatches = [
          createSwatch(warmH, 38, 22),
          createSwatch(warmH + 15, 48, 48),
          createSwatch((warmH + 70) % 360, 32, 52),
          createSwatch(warmH, 30, 78),
          createSwatch(warmH - 10, 22, 92),
          createSwatch((warmH + 40) % 360, 35, 65),
        ];
        tags.push('organic', 'natural', 'warm');
        break;
      }

      case 'monochromatic': {
        const toneStyle = Math.floor(s * 7) % 5;
        const satJitter = Math.floor((s * 5) % 15) - 7;
        const hueFineJitter = Math.floor((s * 3) % 7) - 3;
        const hMono = (baseHue + hueFineJitter + 360) % 360;

        if (toneStyle === 0) {
          // High contrast deep to bright
          swatches = [
            createSwatch(hMono, Math.max(20, Math.min(95, 80 + satJitter)), 11),
            createSwatch(hMono, Math.max(20, Math.min(95, 78 + satJitter)), 24),
            createSwatch(hMono, Math.max(20, Math.min(95, 74 + satJitter)), 42),
            createSwatch(hMono, Math.max(20, Math.min(95, 68 + satJitter)), 62),
            createSwatch(hMono, Math.max(15, Math.min(90, 54 + satJitter)), 80),
            createSwatch(hMono, Math.max(10, Math.min(80, 38 + satJitter)), 94),
          ];
        } else if (toneStyle === 1) {
          // Soft muted tonal
          swatches = [
            createSwatch(hMono, Math.max(15, Math.min(85, 45 + satJitter)), 16),
            createSwatch(hMono, Math.max(15, Math.min(85, 48 + satJitter)), 32),
            createSwatch(hMono, Math.max(15, Math.min(85, 52 + satJitter)), 50),
            createSwatch(hMono, Math.max(15, Math.min(85, 46 + satJitter)), 68),
            createSwatch(hMono, Math.max(15, Math.min(85, 38 + satJitter)), 84),
            createSwatch(hMono, Math.max(10, Math.min(70, 24 + satJitter)), 95),
          ];
        } else if (toneStyle === 2) {
          // Electric luminous gradient
          swatches = [
            createSwatch(hMono, Math.max(25, Math.min(100, 92 + satJitter)), 18),
            createSwatch(hMono, Math.max(25, Math.min(100, 88 + satJitter)), 34),
            createSwatch(hMono, Math.max(25, Math.min(100, 84 + satJitter)), 52),
            createSwatch(hMono, Math.max(25, Math.min(100, 78 + satJitter)), 70),
            createSwatch(hMono, Math.max(20, Math.min(95, 65 + satJitter)), 85),
            createSwatch(hMono, Math.max(15, Math.min(85, 45 + satJitter)), 96),
          ];
        } else if (toneStyle === 3) {
          // Clean modern UI ramp
          swatches = [
            createSwatch(hMono, Math.max(15, Math.min(90, 60 + satJitter)), 14),
            createSwatch(hMono, Math.max(15, Math.min(90, 65 + satJitter)), 28),
            createSwatch(hMono, Math.max(15, Math.min(90, 70 + satJitter)), 46),
            createSwatch(hMono, Math.max(15, Math.min(90, 64 + satJitter)), 64),
            createSwatch(hMono, Math.max(15, Math.min(85, 50 + satJitter)), 82),
            createSwatch(hMono, Math.max(10, Math.min(75, 30 + satJitter)), 93),
          ];
        } else {
          // Pastel tonal gradation
          swatches = [
            createSwatch(hMono, Math.max(15, Math.min(80, 50 + satJitter)), 26),
            createSwatch(hMono, Math.max(15, Math.min(80, 52 + satJitter)), 42),
            createSwatch(hMono, Math.max(15, Math.min(80, 55 + satJitter)), 58),
            createSwatch(hMono, Math.max(15, Math.min(80, 50 + satJitter)), 74),
            createSwatch(hMono, Math.max(10, Math.min(70, 42 + satJitter)), 88),
            createSwatch(hMono, Math.max(10, Math.min(60, 25 + satJitter)), 96),
          ];
        }
        tags.push('tonal', 'shades', 'gradient');
        break;
      }

      case 'tetradic':
      default: {
        const h0 = baseHue;
        swatches = [
          createSwatch(h0, 75, 30),
          createSwatch((h0 + 90) % 360, 78, 52),
          createSwatch((h0 + 180) % 360, 74, 56),
          createSwatch((h0 + 270) % 360, 76, 54),
          createSwatch(h0, 40, 88),
          createSwatch((h0 + 180) % 360, 35, 92),
        ];
        tags.push('spectrum', 'vibrant');
        break;
      }
    }
  }

  // Adjust count (2 to 6, default 4)
  const targetCount: number = colorCount || 4;
  let finalSwatches: SwatchColor[];
  if (targetCount === 2) {
    finalSwatches = [swatches[1], swatches[3]];
  } else if (targetCount === 3) {
    finalSwatches = [swatches[0], swatches[1], swatches[3]];
  } else if (targetCount === 4) {
    finalSwatches = [swatches[0], swatches[1], swatches[3], swatches[4]];
  } else if (targetCount === 5) {
    finalSwatches = swatches.slice(0, 5);
  } else {
    finalSwatches = swatches.slice(0, 6);
  }

  // Add swatch color family names and common color search keywords to tags
  finalSwatches.forEach((sw) => {
    if (!tags.includes(sw.family)) tags.push(sw.family);
    const lowerName = sw.name.toLowerCase();
    if (lowerName.includes('green') && !tags.includes('green')) tags.push('green');
    if (lowerName.includes('emerald') && !tags.includes('emerald')) tags.push('emerald');
    if (lowerName.includes('mint') && !tags.includes('mint')) tags.push('mint');
    if (lowerName.includes('blue') && !tags.includes('blue')) tags.push('blue');
    if (lowerName.includes('navy') && !tags.includes('navy')) tags.push('navy');
    if (lowerName.includes('red') && !tags.includes('red')) tags.push('red');
    if (lowerName.includes('crimson') && !tags.includes('crimson')) tags.push('crimson');
    if (lowerName.includes('yellow') && !tags.includes('yellow')) tags.push('yellow');
    if (lowerName.includes('gold') && !tags.includes('gold')) tags.push('gold');
    if (lowerName.includes('purple') && !tags.includes('purple')) tags.push('purple');
    if (lowerName.includes('pink') && !tags.includes('pink')) tags.push('pink');
    if (lowerName.includes('orange') && !tags.includes('orange')) tags.push('orange');
    if (lowerName.includes('teal') && !tags.includes('teal')) tags.push('teal');
    if (lowerName.includes('cyan') && !tags.includes('cyan')) tags.push('cyan');
  });

  const darkCount = finalSwatches.filter((c) => c.isDark).length;
  let isDarkTheme = darkCount >= Math.ceil(finalSwatches.length / 2);
  if (targetFamily === 'dark') {
    isDarkTheme = true;
    if (!tags.includes('dark')) tags.push('dark');
  } else if (targetFamily === 'white' || targetFamily === 'light') {
    isDarkTheme = false;
    if (!tags.includes('light')) tags.push('light');
    if (!tags.includes('white')) tags.push('white');
  } else if (isDarkTheme && !tags.includes('dark')) {
    tags.push('dark');
  }

  // Purely deterministic ID derived from targetFamily and swatch hexes
  const hexHash = finalSwatches.map((c) => c.hex.replace('#', '').toLowerCase()).join('-');
  const id = `pal-${targetFamily}-${hexHash}`;

  return {
    id,
    title,
    harmony,
    colors: finalSwatches,
    tags,
    likes,
    createdAt: 1740000000000 - Math.floor(Math.abs(seed * 3600000) % (86400000 * 14)),
    isDarkTheme,
    primaryFamily: finalSwatches[0]?.family,
  };
}

export function doesPaletteBelongToFamily(palette: Palette, target: ColorFamily | string): boolean {
  if (!target || target === 'all') return true;
  const fam = target.toLowerCase().trim();

  if (fam === 'dark' || fam === 'black') {
    const darkColors = palette.colors.filter((c) => isSwatchInColorFamily(c, 'dark') || c.l <= 32);
    const avgLightness = palette.colors.reduce((sum, c) => sum + c.l, 0) / palette.colors.length;
    return (
      palette.isDarkTheme ||
      palette.tags.includes('dark') ||
      avgLightness <= 45 ||
      darkColors.length >= Math.ceil(palette.colors.length / 2)
    );
  }

  if (fam === 'white' || fam === 'light') {
    const lightColors = palette.colors.filter(
      (c) => isSwatchInColorFamily(c, 'white') || isSwatchInColorFamily(c, 'light') || c.l >= 70
    );
    const avgLightness = palette.colors.reduce((sum, c) => sum + c.l, 0) / palette.colors.length;
    return (
      !palette.isDarkTheme &&
      (avgLightness >= 60 ||
        lightColors.length >= Math.ceil(palette.colors.length / 2) ||
        palette.tags.includes('light') ||
        palette.tags.includes('white') ||
        palette.tags.includes('pastel'))
    );
  }

  if (fam === 'monochrome' || fam === 'gray' || fam === 'grey' || fam === 'slate') {
    const grayColors = palette.colors.filter((c) => isSwatchInColorFamily(c, 'gray'));
    return grayColors.length >= 1;
  }

  // Specific hue families (orange, green, blue, red, etc.):
  // Strictly checks that at least one color is that color or a shade of it
  return palette.colors.some((c) => isSwatchInColorFamily(c, fam));
}

export function paletteVisualDistance(p1: Palette, p2: Palette): number {
  if (p1.colors.length !== p2.colors.length) return 999;
  let totalDelta = 0;
  const count = Math.min(p1.colors.length, p2.colors.length);
  for (let i = 0; i < count; i++) {
    const c1 = p1.colors[i];
    const c2 = p2.colors[i];
    let dh = Math.abs(c1.h - c2.h);
    if (dh > 180) dh = 360 - dh; // Circular hue difference
    const ds = Math.abs(c1.s - c2.s);
    const dl = Math.abs(c1.l - c2.l);
    totalDelta += dh * 1.1 + ds * 0.45 + dl * 0.75;
  }
  return totalDelta / count;
}

export function generatePalettesBatch(
  count: number = 12,
  harmonyType: HarmonyType = 'all',
  startIndex: number = 0,
  colorCount: SwatchCount = 4,
  targetFamily: ColorFamily = 'all'
): Palette[] {
  const result: Palette[] = [];
  const seenSignatures = new Set<string>();
  const seenTitles = new Set<string>();
  const seenIds = new Set<string>();

  let attempts = 0;
  let idx = 0;
  const maxAttempts = count * 15; // Generous ceiling to find uniquely distant palettes
  const goldenAngle = 137.50776405; // Golden angle ensures maximum hue dispersion on the 360° circle

  while (result.length < count && attempts < maxAttempts) {
    attempts++;
    // Calculate a guaranteed well-dispersed hue on the color wheel
    const distributedHue = targetFamily !== 'all'
      ? getFamilyBaseHue(targetFamily, startIndex * 1000 + attempts * 19.3 + idx * 7)
      : Math.round(((startIndex * 47.19 + idx * goldenAngle + (attempts % 7) * 29.3) % 360 + 360) % 360);

    const prng = pseudoRandom(startIndex * 10000 + attempts * 133.7 + idx * 29.3);
    const seed = (startIndex + idx + 1) * 31415.9265 + (attempts * 7919.137) + (prng * 90000);
    const p = generatePalette(harmonyType, seed, colorCount, targetFamily, distributedHue);

    // If targetFamily is set, ensure it belongs to that family
    if (targetFamily !== 'all' && !doesPaletteBelongToFamily(p, targetFamily)) {
      continue;
    }

    // Exact hex signature and id check
    const sig = p.colors.map((c) => c.hex).join('-');
    if (seenSignatures.has(sig) || seenIds.has(p.id)) {
      continue;
    }

    // Comprehensive visual distance check against ALL palettes in current batch
    const isTooSimilar = result.some((existing) => paletteVisualDistance(existing, p) < 24);
    if (isTooSimilar) {
      continue;
    }

    // Title deduplication check
    if (seenTitles.has(p.title)) {
      p.title = `${p.title} ${idx + 1}`;
    }

    seenSignatures.add(sig);
    seenTitles.add(p.title);
    seenIds.add(p.id);
    result.push(p);
    idx++;
  }

  // Robust fallback ensuring target count is met without repeating visual signatures
  let fallbackAttempts = 0;
  while (result.length < count && fallbackAttempts < count * 8) {
    fallbackAttempts++;
    const prng = pseudoRandom(startIndex * 7000 + fallbackAttempts * 179.3 + idx * 43.1);
    const distributedHue = Math.round(((idx * goldenAngle + fallbackAttempts * 37.1) % 360 + 360) % 360);
    const seed = prng * 999999 + fallbackAttempts * 3000 + idx * 500;
    const p = generatePalette(harmonyType, seed, colorCount, targetFamily, distributedHue);
    if (targetFamily !== 'all' && !doesPaletteBelongToFamily(p, targetFamily)) {
      continue;
    }
    const sig = p.colors.map((c) => c.hex).join('-');
    const tooClose = result.some((existing) => paletteVisualDistance(existing, p) < 18);
    if (!seenSignatures.has(sig) && !seenIds.has(p.id) && !tooClose) {
      seenSignatures.add(sig);
      seenIds.add(p.id);
      result.push(p);
      idx++;
    }
  }

  return result;
}

// -------------------------------------------------------------
// Export Formatters
// -------------------------------------------------------------

export function exportAsHexList(palette: Palette, delimiter = ', '): string {
  return palette.colors.map((c) => c.hex).join(delimiter);
}

export function exportAsCssVariables(palette: Palette): string {
  const slug = palette.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const vars = palette.colors
    .map((c, i) => `  --color-${slug}-${i + 1}: ${c.hex}; /* ${c.name} */`)
    .join('\n');
  return `/* ${palette.title} (${palette.harmony}) */\n:root {\n${vars}\n}`;
}

const shadeMap: Record<number, number[]> = {
  2: [200, 800],
  3: [100, 500, 900],
  4: [100, 300, 600, 900],
  5: [100, 300, 500, 700, 900],
  6: [50, 100, 300, 500, 700, 900],
};

export function exportAsTailwindConfig(palette: Palette): string {
  const slug = palette.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const shades = shadeMap[palette.colors.length] || [100, 300, 500, 700, 900];
  const entries = palette.colors
    .map((c, i) => `        ${shades[i] || (i + 1) * 100}: '${c.hex}', // ${c.name}`)
    .join('\n');

  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        '${slug}': {\n${entries}\n        },\n      },\n    },\n  },\n};`;
}

export function exportAsTailwindV4Theme(palette: Palette): string {
  const slug = palette.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const shades = shadeMap[palette.colors.length] || [100, 300, 500, 700, 900];
  const entries = palette.colors
    .map((c, i) => `  --color-${slug}-${shades[i] || (i + 1) * 100}: ${c.hex};`)
    .join('\n');
  return `@theme {\n${entries}\n}`;
}

export function exportAsJson(palette: Palette): string {
  const data = {
    title: palette.title,
    harmony: palette.harmony,
    colors: palette.colors.map((c) => ({
      hex: c.hex,
      rgb: c.rgb,
      hsl: c.hsl,
      name: c.name,
      family: c.family,
    })),
  };
  return JSON.stringify(data, null, 2);
}

// Simple SVG Swatch for direct download
export function generatePaletteSvg(palette: Palette): string {
  const width = 800;
  const height = 480;
  const swatchCount = palette.colors.length;
  const swatchWidth = width / swatchCount;
  const swatchHeight = 360;

  const swatchesSvg = palette.colors
    .map((c, i) => {
      const x = i * swatchWidth;
      const textFill = c.isDark ? '#FFFFFF' : '#0F172A';
      return `
    <g transform="translate(${x}, 0)">
      <rect width="${swatchWidth}" height="${swatchHeight}" fill="${c.hex}" />
      <text x="${swatchWidth / 2}" y="${swatchHeight - 60}" 
            font-family="system-ui, -apple-system, sans-serif" font-size="${swatchCount > 4 ? 12 : 14}" font-weight="600" 
            text-anchor="middle" fill="${textFill}">${c.name}</text>
      <text x="${swatchWidth / 2}" y="${swatchHeight - 32}" 
            font-family="monospace, ui-monospace" font-size="${swatchCount > 4 ? 13 : 15}" font-weight="700" 
            text-anchor="middle" fill="${textFill}">${c.hex}</text>
    </g>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <clipPath id="card-radius">
      <rect width="${width}" height="${height}" rx="24" ry="24" />
    </clipPath>
  </defs>
  <g clip-path="url(#card-radius)">
    <!-- Swatches -->
    ${swatchesSvg}
    
    <!-- Footer / Metadata Card -->
    <rect x="0" y="${swatchHeight}" width="${width}" height="${height - swatchHeight}" fill="#0D1117" />
    <text x="32" y="${swatchHeight + 52}" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#FFFFFF">${palette.title}</text>
    <text x="32" y="${swatchHeight + 82}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#8B949E">Harmony: ${palette.harmony.toUpperCase()} • ColorKit • www.colorkit.pro</text>
    <text x="${width - 32}" y="${swatchHeight + 66}" font-family="monospace, ui-monospace" font-size="13" font-weight="500" text-anchor="end" fill="#58A6FF">${palette.colors.map(c => c.hex).join('  ')}</text>
  </g>
</svg>`;
}

export function downloadSvgFile(palette: Palette) {
  const svgContent = generatePaletteSvg(palette);
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const filename = `${palette.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-palette.svg`;
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
