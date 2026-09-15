'use client';

import { Palette, ColorFormat } from './color-engine';

const SAVED_STORAGE_KEY = 'chromastream_saved_palettes_v1';
const PREFS_STORAGE_KEY = 'chromastream_preferences_v1';

export interface UserPreferences {
  colorFormat: ColorFormat;
  theme: 'dark' | 'light' | 'system';
  cardDensity: 'comfortable' | 'compact';
}

const DEFAULT_PREFS: UserPreferences = {
  colorFormat: 'hex',
  theme: 'system',
  cardDensity: 'comfortable',
};

// Safe localStorage getter
export function getSavedPalettes(): Palette[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse saved palettes from localStorage', err);
    return [];
  }
}

export function savePalette(palette: Palette): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getSavedPalettes();
    // Check if already exists by id or same colors
    const exists = current.some(
      (p) => p.id === palette.id || p.colors.map(c => c.hex).join('') === palette.colors.map(c => c.hex).join('')
    );
    if (exists) return false;

    const updated = [palette, ...current];
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for cross-component sync
    window.dispatchEvent(new Event('chromastream_saved_updated'));
    return true;
  } catch (err) {
    console.error('Failed to save palette to localStorage', err);
    return false;
  }
}

export function removeSavedPalette(paletteId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getSavedPalettes();
    const updated = current.filter((p) => p.id !== paletteId);
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('chromastream_saved_updated'));
    return true;
  } catch (err) {
    console.error('Failed to remove palette from localStorage', err);
    return false;
  }
}

export function isPaletteSaved(palette: Palette): boolean {
  if (typeof window === 'undefined') return false;
  const current = getSavedPalettes();
  return current.some(
    (p) => p.id === palette.id || p.colors.map(c => c.hex).join('') === palette.colors.map(c => c.hex).join('')
  );
}

export function clearAllSavedPalettes(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SAVED_STORAGE_KEY);
    window.dispatchEvent(new Event('chromastream_saved_updated'));
  } catch (err) {
    console.error('Failed to clear saved palettes', err);
  }
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function setUserPreferences(prefs: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getUserPreferences();
    const merged = { ...current, ...prefs };
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event('chromastream_prefs_updated'));
  } catch (err) {
    console.error('Failed to store preferences', err);
  }
}

// Export entire library as JSON file
export function exportCollectionAsJson(palettes: Palette[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(palettes, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `chromastream-library-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Export entire collection as unified CSS
export function exportCollectionAsCss(palettes: Palette[]): string {
  const chunks = palettes.map((p) => {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const vars = p.colors.map((c, i) => `  --${slug}-${i + 1}: ${c.hex}; /* ${c.name} */`).join('\n');
    return `  /* ${p.title} (${p.harmony}) */\n${vars}`;
  });
  return `:root {\n${chunks.join('\n\n')}\n}`;
}
