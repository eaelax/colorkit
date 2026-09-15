'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import {
  Palette,
  HarmonyType,
  ColorFormat,
  ColorFamily,
  SwatchCount,
  generatePalettesBatch,
  doesPaletteBelongToFamily,
} from '@/lib/color-engine';
import PaletteCard from './PaletteCard';
import FilterBar from './FilterBar';
import PaletteDetailModal from './PaletteDetailModal';

interface ExploreFeedProps {
  globalFormat: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  onOpenExport: (palette: Palette) => void;
}

const BATCH_SIZE = 12;

function parseSearchToFamily(query: string): ColorFamily | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  if (
    q.includes('white') ||
    q.includes('alabaster') ||
    q.includes('ivory') ||
    q.includes('snow') ||
    q.includes('porcelain') ||
    q.includes('cream') ||
    q.includes('linen') ||
    q.includes('chalk') ||
    q.includes('milk') ||
    q.includes('pearl')
  ) {
    return 'white';
  }
  if (
    q.includes('gray') ||
    q.includes('grey') ||
    q.includes('slate') ||
    q.includes('mono') ||
    q.includes('silver') ||
    q.includes('charcoal') ||
    q.includes('graphite') ||
    q.includes('ash') ||
    q.includes('pewter') ||
    q.includes('concrete') ||
    q.includes('titanium') ||
    q.includes('steel') ||
    q.includes('greige')
  ) {
    return 'gray';
  }
  if (
    q.includes('dark') ||
    q.includes('night') ||
    q.includes('black') ||
    q.includes('obsidian') ||
    q.includes('carbon') ||
    q.includes('noir') ||
    q.includes('eclipse') ||
    q.includes('void') ||
    q.includes('onyx') ||
    q.includes('shadow') ||
    q.includes('midnight') ||
    q.includes('deep')
  ) {
    return 'dark';
  }
  if (
    q.includes('light') ||
    q.includes('white') ||
    q.includes('pastel') ||
    q.includes('bright') ||
    q.includes('soft') ||
    q.includes('pale') ||
    q.includes('alabaster') ||
    q.includes('ivory') ||
    q.includes('snow') ||
    q.includes('porcelain') ||
    q.includes('cream') ||
    q.includes('linen') ||
    q.includes('chalk') ||
    q.includes('milk') ||
    q.includes('pearl')
  ) {
    return 'light';
  }
  if (
    q.includes('green') ||
    q.includes('emerald') ||
    q.includes('mint') ||
    q.includes('sage') ||
    q.includes('forest') ||
    q.includes('olive') ||
    q.includes('lime') ||
    q.includes('moss') ||
    q.includes('jade') ||
    q.includes('pine') ||
    q.includes('basil') ||
    q.includes('matcha')
  ) {
    return 'green';
  }
  if (
    q.includes('blue') ||
    q.includes('navy') ||
    q.includes('cobalt') ||
    q.includes('ocean') ||
    q.includes('sapphire') ||
    q.includes('indigo') ||
    q.includes('azure') ||
    q.includes('sky') ||
    q.includes('denim') ||
    q.includes('cerulean') ||
    q.includes('arctic')
  ) {
    return 'blue';
  }
  if (
    q.includes('purple') ||
    q.includes('violet') ||
    q.includes('lavender') ||
    q.includes('plum') ||
    q.includes('amethyst') ||
    q.includes('lilac') ||
    q.includes('orchid') ||
    q.includes('mauve') ||
    q.includes('mulberry')
  ) {
    return 'purple';
  }
  if (
    q.includes('pink') ||
    q.includes('rose') ||
    q.includes('magenta') ||
    q.includes('blush') ||
    q.includes('salmon') ||
    q.includes('fuchsia') ||
    q.includes('flamingo') ||
    q.includes('sakura')
  ) {
    return 'pink';
  }
  if (
    q.includes('red') ||
    q.includes('crimson') ||
    q.includes('scarlet') ||
    q.includes('ruby') ||
    q.includes('burgundy') ||
    q.includes('maroon') ||
    q.includes('wine') ||
    q.includes('cherry') ||
    q.includes('mahogany') ||
    q.includes('brick')
  ) {
    return 'red';
  }
  if (
    q.includes('orange') ||
    q.includes('amber') ||
    q.includes('tangerine') ||
    q.includes('peach') ||
    q.includes('terracotta') ||
    q.includes('rust') ||
    q.includes('copper') ||
    q.includes('coral') ||
    q.includes('apricot') ||
    q.includes('persimmon') ||
    q.includes('sunset')
  ) {
    return 'orange';
  }
  if (
    q.includes('yellow') ||
    q.includes('gold') ||
    q.includes('ochre') ||
    q.includes('lemon') ||
    q.includes('canary') ||
    q.includes('sunflower') ||
    q.includes('honey') ||
    q.includes('mustard') ||
    q.includes('citrine')
  ) {
    return 'yellow';
  }
  if (
    q.includes('teal') ||
    q.includes('cyan') ||
    q.includes('turquoise') ||
    q.includes('aqua') ||
    q.includes('seafoam') ||
    q.includes('lagoon') ||
    q.includes('aquamarine')
  ) {
    return 'teal';
  }
  return null;
}

export default function ExploreFeed({
  globalFormat,
  onFormatChange,
  onOpenExport,
}: ExploreFeedProps) {
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType>('all');
  const [selectedCount, setSelectedCount] = useState<SwatchCount | 0>(4);
  const [selectedColorFamily, setSelectedColorFamily] = useState<ColorFamily>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [detailModalPalette, setDetailModalPalette] = useState<Palette | null>(null);

  // Refs for glitch-free infinite scrolling and debounce
  const isFetchingRef = useRef(false);
  const lastFetchTimestamp = useRef(0);
  const seedCounterRef = useRef(100);

  const [palettes, setPalettes] = useState<Palette[]>(() =>
    generatePalettesBatch(BATCH_SIZE * 2, 'all', 0, 4, 'all')
  );

  const observerTarget = useRef<HTMLDivElement>(null);

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  // Generate next batch using current active filters with anti-oscillation protection
  const loadNextBatch = useCallback(() => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    lastFetchTimestamp.current = Date.now();
    setIsLoadingMore(true);

    // Use a short timeout to let React update the loading state before synchronous heavy generation
    setTimeout(() => {
      try {
        let effectiveFamily = selectedColorFamily;
        if (effectiveFamily === 'all' && searchQuery.trim()) {
          const searchFam = parseSearchToFamily(searchQuery);
          if (searchFam) effectiveFamily = searchFam;
        }

        seedCounterRef.current += BATCH_SIZE * 5 + Math.floor(Math.random() * 25000) + 1234;
        const countForGen: SwatchCount = selectedCount === 0 ? ((Math.floor(Math.random() * 4) + 3) as SwatchCount) : selectedCount;
        const nextBatch = generatePalettesBatch(
          BATCH_SIZE,
          selectedHarmony,
          seedCounterRef.current,
          countForGen,
          effectiveFamily
        );

        setPalettes((prev) => {
          const seenSignatures = new Set(prev.map((p) => p.colors.map((c) => c.hex).join('-')));
          const seenIds = new Set(prev.map((p) => p.id));
          const unique = nextBatch.filter((p) => {
            const sig = p.colors.map((c) => c.hex).join('-');
            if (seenSignatures.has(sig) || seenIds.has(p.id)) return false;
            seenSignatures.add(sig);
            seenIds.add(p.id);
            return true;
          });

          // Even if some items are visually close, ensure we always append at least the unique items
          return unique.length > 0 ? [...prev, ...unique] : [...prev, ...nextBatch];
        });
      } catch (err) {
        console.error('Failed generating more palettes:', err);
      } finally {
        isFetchingRef.current = false;
        setIsLoadingMore(false);
      }
    }, 50);
  }, [selectedHarmony, selectedCount, selectedColorFamily, searchQuery]);

  // Handle harmony filter change
  const handleHarmonyChange = (harmony: HarmonyType) => {
    setSelectedHarmony(harmony);
    seedCounterRef.current += Math.floor(Math.random() * 20000) + 1000;
    const batchCount: SwatchCount = selectedCount === 0 ? 5 : selectedCount;
    const freshBatch = generatePalettesBatch(
      BATCH_SIZE * 2,
      harmony,
      seedCounterRef.current,
      batchCount,
      selectedColorFamily
    );
    setPalettes(freshBatch);
  };

  // Handle color count filter change (2 to 6, or 0 for all)
  const handleCountChange = (count: SwatchCount | 0) => {
    setSelectedCount(count);
    seedCounterRef.current += Math.floor(Math.random() * 20000) + 1000;
    const batchCount: SwatchCount = count === 0 ? 5 : count;
    const freshBatch = generatePalettesBatch(
      BATCH_SIZE * 2,
      selectedHarmony,
      seedCounterRef.current,
      batchCount,
      selectedColorFamily
    );
    setPalettes(freshBatch);
  };

  // Handle color family filter change
  const handleColorFamilyChange = (family: ColorFamily) => {
    setSelectedColorFamily(family);
    seedCounterRef.current += Math.floor(Math.random() * 20000) + 1000;
    const batchCount: SwatchCount = selectedCount === 0 ? 5 : selectedCount;
    const freshBatch = generatePalettesBatch(
      BATCH_SIZE * 2,
      selectedHarmony,
      seedCounterRef.current,
      batchCount,
      family
    );
    setPalettes(freshBatch);
  };

  // Reshuffle / regenerate feed
  const handleRegenerate = () => {
    seedCounterRef.current += Math.floor(Math.random() * 50000) + 1000;
    let targetFam = selectedColorFamily;
    if (targetFam === 'all' && searchQuery.trim()) {
      const parsed = parseSearchToFamily(searchQuery);
      if (parsed) targetFam = parsed;
    }

    const batchCount: SwatchCount = selectedCount === 0 ? 5 : selectedCount;
    const freshBatch = generatePalettesBatch(
      BATCH_SIZE * 2,
      selectedHarmony,
      seedCounterRef.current,
      batchCount,
      targetFam
    );
    setPalettes(freshBatch);
  };

  // When user types in search query, generate matching palettes if searching specific color
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    const targetFam = parseSearchToFamily(query);
    if (targetFam || query.trim().length > 2) {
      searchDebounceRef.current = setTimeout(() => {
        seedCounterRef.current += Math.floor(Math.random() * 50000) + 1000;
        const batchCount: SwatchCount = selectedCount === 0 ? 5 : selectedCount;
        const synthBatch = generatePalettesBatch(
          BATCH_SIZE * 2,
          selectedHarmony,
          seedCounterRef.current,
          batchCount,
          targetFam || 'all'
        );
        setPalettes(synthBatch);
      }, 250);
    }
  };

  // Update palette live from the detail modal
  const handleUpdatePalette = useCallback((updated: Palette) => {
    setPalettes((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setDetailModalPalette(updated);
  }, []);

  const handleOpenDetail = useCallback((pal: Palette) => {
    setDetailModalPalette(pal);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailModalPalette(null);
  }, []);

  // Clear all filters back to default (4 colors, all harmonies, all families, empty search)
  const handleClearFilters = useCallback(() => {
    setSelectedHarmony('all');
    setSelectedCount(4);
    setSelectedColorFamily('all');
    setSearchQuery('');
    seedCounterRef.current += 1000 + Math.floor(Math.random() * 5000);
    setPalettes(generatePalettesBatch(BATCH_SIZE * 2, 'all', seedCounterRef.current, 4, 'all'));
  }, []);

  const isFiltered =
    selectedHarmony !== 'all' ||
    selectedCount !== 4 ||
    selectedColorFamily !== 'all' ||
    searchQuery.trim() !== '';

  // Filtered palettes based on search query and current filter state
  const filteredPalettes = useMemo(() => {
    const searchFam = parseSearchToFamily(searchQuery);
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const seenIds = new Set<string>();

    return palettes.filter((p) => {
      // Prevent any duplicate palette ID in the rendered feed
      if (seenIds.has(p.id)) return false;
      seenIds.add(p.id);

      // 1. Color Count filter (2 to 6 colors, or 0 for all counts)
      if (selectedCount !== 0 && p.colors.length !== selectedCount) {
        return false;
      }

      // 2. Color Family filter - strict match so palettes belong to that color or shades of that color
      if (selectedColorFamily !== 'all') {
        if (!doesPaletteBelongToFamily(p, selectedColorFamily)) {
          return false;
        }
      }

      // 3. Search query filter
      if (!trimmedQuery) return true;

      // If search query is a color name, enforce color family membership
      if (searchFam) {
        return doesPaletteBelongToFamily(p, searchFam);
      }

      // General query match (hex codes, themes, harmony names, etc.)
      const matchesTitle = p.title.toLowerCase().includes(trimmedQuery);
      const matchesHarmony = p.harmony.toLowerCase().includes(trimmedQuery);
      const matchesTag = p.tags.some((t) => t.toLowerCase().includes(trimmedQuery));
      const matchesColors = p.colors.some(
        (c) =>
          c.hex.toLowerCase().includes(trimmedQuery) ||
          c.name.toLowerCase().includes(trimmedQuery) ||
          c.family.toLowerCase().includes(trimmedQuery) ||
          c.rgb.toLowerCase().includes(trimmedQuery)
      );

      return matchesTitle || matchesHarmony || matchesTag || matchesColors;
    });
  }, [palettes, selectedCount, selectedColorFamily, searchQuery]);

  // Intersection Observer + Window Scroll Fallback for robust Infinite Scroll across all browsers/frames
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          !isFetchingRef.current &&
          filteredPalettes.length > 0
        ) {
          loadNextBatch();
        }
      },
      {
        root: null,
        rootMargin: '600px',
        threshold: 0,
      }
    );

    observer.observe(target);

    // Secondary window scroll listener fallback (handles browsers/iframes where IntersectionObserver may miss rapid scrolling)
    const handleWindowScroll = () => {
      if (isFetchingRef.current || filteredPalettes.length === 0) return;
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.offsetHeight - 800;
      if (scrollPosition >= threshold) {
        loadNextBatch();
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [loadNextBatch, filteredPalettes.length]);

  return (
    <div className="w-full">
      {/* Filter and search toolbar */}
      <FilterBar
        selectedHarmony={selectedHarmony}
        onSelectHarmony={handleHarmonyChange}
        selectedCount={selectedCount}
        onSelectCount={handleCountChange}
        selectedColorFamily={selectedColorFamily}
        onSelectColorFamily={handleColorFamilyChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onRegenerate={handleRegenerate}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
      />

      {/* Grid of Palette Cards */}
      {filteredPalettes.length > 0 ? (
        <div
          id="palettes-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
        >
          {filteredPalettes.map((palette) => (
            <PaletteCard
              key={palette.id}
              palette={palette}
              globalFormat={globalFormat}
              onOpenExport={onOpenExport}
              onOpenDetail={handleOpenDetail}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 px-4">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            No palettes found matching &quot;{searchQuery}&quot; with current filters.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedColorFamily('all');
                setSelectedCount(4);
                setSelectedHarmony('all');
                handleRegenerate();
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Infinite Scroll Sentinel & Loading Indicator */}
      <div
        ref={observerTarget}
        id="infinite-scroll-trigger"
        className="w-full py-8 sm:py-10 flex flex-col items-center justify-center gap-3"
      >
        {isLoadingMore ? (
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm text-xs text-neutral-600 dark:text-neutral-300 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            <span>Generating fresh harmonious palettes...</span>
          </div>
        ) : (
          filteredPalettes.length > 0 && (
            <button
              onClick={loadNextBatch}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Load More Palettes</span>
            </button>
          )
        )}
      </div>

      {/* Large Palette Detail & Live Editor Modal */}
      <PaletteDetailModal
        palette={detailModalPalette}
        isOpen={!!detailModalPalette}
        onClose={handleCloseDetail}
        onUpdatePalette={handleUpdatePalette}
      />
    </div>
  );
}
