import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Check,
  ArrowUpRight,
  Plus,
  Package,
  Scale,
  RotateCcw,
} from 'lucide-react';
import {
  JUICE_CATALOG,
  JuiceCategory,
  JuiceProduct,
  BottleSize,
} from '../data/juiceCatalog';
import { StudioBottleVisual } from './StudioBottleVisual';

const SIZE_FACTORS: Record<BottleSize, { label: string; factor: number }> = {
  '12oz': { label: '12 fl oz', factor: 0.8 },
  '16oz': { label: '16 fl oz', factor: 1.0 },
  '32oz': { label: '32 fl oz Carafe', factor: 1.8 },
};

interface DailyCollectionSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showSearchBar: boolean;
  onSelectProduct: (product: JuiceProduct) => void;
  onAddSingleToCart: (
    product: JuiceProduct,
    size: BottleSize,
    quantity: number,
    isSubscription: boolean
  ) => void;
  onAddCrateToCart: (bottles: JuiceProduct[], cratePrice: number) => void;
}

export const DailyCollectionSection: React.FC<DailyCollectionSectionProps> = ({
  searchQuery,
  setSearchQuery,
  showSearchBar,
  onSelectProduct,
  onAddSingleToCart,
  onAddCrateToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<JuiceCategory>('all');
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-asc' | 'sugar-asc' | 'vitc-desc' | 'ph-desc'
  >('featured');

  // Functional Dietary Filter Toggles
  const [onlyLowSugar, setOnlyLowSugar] = useState<boolean>(false);
  const [onlyAlkaline, setOnlyAlkaline] = useState<boolean>(false);
  const [onlyHighVitC, setOnlyHighVitC] = useState<boolean>(false);

  // Studio Photo vs Apothecary Diagram toggle across the collection
  const [galleryMode, setGalleryMode] = useState<'photo' | 'spec'>('photo');

  // Collection Purchase Mode: Single Vessels vs Curate 6-Bottle Crate
  const [collectionMode, setCollectionMode] = useState<'single' | 'crate'>('single');
  const [crateIds, setCrateIds] = useState<string[]>([
    'emerald-canopy',
    'golden-solstice',
    'chlorophyll-veil',
    'crimson-velvet',
    'obsidian-ember',
    'orchard-cloud',
  ]);
  const [crateAddedFeedback, setCrateAddedFeedback] = useState<boolean>(false);

  // Side-by-Side Assay Comparison State (up to 3 product IDs)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareTable, setShowCompareTable] = useState<boolean>(false);

  // Per-card bottle size state
  const [cardSizes, setCardSizes] = useState<Record<string, BottleSize>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = JUICE_CATALOG.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.botanicalNote.toLowerCase().includes(q) ||
        item.ingredients.some(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.origin.toLowerCase().includes(q) ||
            i.role.toLowerCase().includes(q)
        );
      const matchesLowSugar = !onlyLowSugar || item.nutrition.sugarGrams <= 8;
      const matchesAlkaline = !onlyAlkaline || item.pHLevel >= 7.5;
      const matchesHighVitC =
        !onlyHighVitC || item.nutrition.vitaminCPercent >= 150;

      return (
        matchesCategory &&
        matchesQuery &&
        matchesLowSugar &&
        matchesAlkaline &&
        matchesHighVitC
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice16oz - b.basePrice16oz;
      if (sortBy === 'sugar-asc')
        return a.nutrition.sugarGrams - b.nutrition.sugarGrams;
      if (sortBy === 'vitc-desc')
        return b.nutrition.vitaminCPercent - a.nutrition.vitaminCPercent;
      if (sortBy === 'ph-desc') return b.pHLevel - a.pHLevel;
      return 0;
    });
  }, [
    activeCategory,
    searchQuery,
    sortBy,
    onlyLowSugar,
    onlyAlkaline,
    onlyHighVitC,
  ]);

  // 6-Bottle Crate Resolved Objects & Telemetry
  const crateBottles = useMemo(
    () =>
      crateIds
        .map((id) => JUICE_CATALOG.find((p) => p.id === id))
        .filter((p): p is JuiceProduct => Boolean(p)),
    [crateIds]
  );

  const crateMetrics = useMemo(() => {
    const retailSum = crateBottles.reduce((s, b) => s + b.basePrice16oz, 0);
    const totalWeight = crateBottles.reduce((s, b) => s + b.produceWeightLbs, 0);
    const avgSugar =
      crateBottles.length > 0
        ? crateBottles.reduce((s, b) => s + b.nutrition.sugarGrams, 0) /
          crateBottles.length
        : 0;
    const totalCalories = crateBottles.reduce(
      (s, b) => s + b.nutrition.calories,
      0
    );
    return {
      retailSum,
      crateFlatPrice: 68.0,
      savings: Math.max(0, retailSum - 68.0),
      totalWeight,
      avgSugar,
      totalCalories,
    };
  }, [crateBottles]);

  const handleAddBottleToCrate = (productId: string) => {
    setCrateIds((prev) => {
      if (prev.length >= 6) {
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  };

  const handleRemoveCrateSlot = (slotIndex: number) => {
    setCrateIds((prev) => prev.filter((_, idx) => idx !== slotIndex));
  };

  const applyCratePreset = (preset: 'circadian' | 'greens' | 'immunity') => {
    if (preset === 'circadian') {
      setCrateIds([
        'emerald-canopy',
        'golden-solstice',
        'chlorophyll-veil',
        'crimson-velvet',
        'obsidian-ember',
        'orchard-cloud',
      ]);
    } else if (preset === 'greens') {
      setCrateIds([
        'emerald-canopy',
        'emerald-canopy',
        'chlorophyll-veil',
        'chlorophyll-veil',
        'obsidian-ember',
        'matcha-pistachio-mylk',
      ]);
    } else {
      setCrateIds([
        'golden-solstice',
        'valencia-rose-hip',
        'crimson-velvet',
        'scarlet-root-tonic',
        'emerald-canopy',
        'obsidian-ember',
      ]);
    }
  };

  const handleCommitCrate = () => {
    if (crateBottles.length !== 6) return;
    onAddCrateToCart(crateBottles, crateMetrics.crateFlatPrice);
    setCrateAddedFeedback(true);
    setTimeout(() => setCrateAddedFeedback(false), 1400);
  };

  const toggleCompareProduct = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((item) => item !== id);
        if (next.length === 0) setShowCompareTable(false);
        return next;
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const comparedProducts = useMemo(
    () =>
      compareIds
        .map((id) => JUICE_CATALOG.find((p) => p.id === id))
        .filter((p): p is JuiceProduct => Boolean(p)),
    [compareIds]
  );

  const handleQuickAddSingle = (product: JuiceProduct, size: BottleSize) => {
    onAddSingleToCart(product, size, 1, false);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1100);
  };

  return (
    <section id="daily-collection" className="py-16 md:py-24">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Top Editorial Header & Collection Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#181815]/8">
          <div>
            <p className="text-xs text-[#5C5B54] font-mono-tabular mb-2">
              SMALL-BATCH HYDRAULIC EXTRACTIONS · 9 DAILY FORMULATIONS · REUSABLE GLASS VESSELS
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#181815] tracking-tight text-balance">
              01. Daily Cold-Pressed Collection
            </h2>
            <p className="mt-2 text-sm text-[#5C5B54] max-w-2xl">
              Pressed every morning at 05:00 AM in our 37.5°F cold room. Order individual vessels in three volumes or curate a custom 6-bottle insulated daily crate.
            </p>
          </div>

          {/* Primary Mode Switcher: Individual Vessels vs 6-Bottle Crate Builder */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-end">
            <div className="flex items-center gap-1 p-1 bg-[#EAE7DF] rounded-lg">
              <button
                type="button"
                onClick={() => setCollectionMode('single')}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  collectionMode === 'single'
                    ? 'bg-[#FBFBF9] text-[#181815] shadow-2xs'
                    : 'text-[#5C5B54] hover:text-[#181815]'
                }`}
              >
                Individual Vessels
              </button>
              <button
                type="button"
                onClick={() => setCollectionMode('crate')}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  collectionMode === 'crate'
                    ? 'bg-[#1B4332] text-[#FBFBF9] shadow-2xs'
                    : 'text-[#5C5B54] hover:text-[#181815]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Curate 6-Bottle Crate ($68 · Save 14%)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive 6-Bottle Daily Crate Builder Dock (Shown when 'crate' mode is active) */}
        {collectionMode === 'crate' && (
          <div className="mt-8 p-6 rounded-xl bg-[#F4F3EF] border border-[#1B4332]/25">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#181815]/8">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#1B4332] font-medium">
                  <span>INSULATED 6-VESSEL DAILY CRATE</span>
                  <span aria-hidden="true">·</span>
                  <span>{crateBottles.length}/6 SLOTS FILLED</span>
                  <span aria-hidden="true">·</span>
                  <span>COMPLIMENTARY 38°F DELIVERY</span>
                </div>
                <h3 className="text-xl font-semibold text-[#181815] mt-1">
                  Select Any 6 Cold-Pressed 16 fl oz Bottles Below
                </h3>
              </div>

              {/* Quick 6-Crate Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-[#5C5B54] mr-1">Load Preset:</span>
                <button
                  type="button"
                  onClick={() => applyCratePreset('circadian')}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#FBFBF9] border border-[#181815]/12 hover:border-[#181815]/35 text-[#181815] transition-colors whitespace-nowrap"
                >
                  All-Day Circadian 6
                </button>
                <button
                  type="button"
                  onClick={() => applyCratePreset('greens')}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#FBFBF9] border border-[#181815]/12 hover:border-[#181815]/35 text-[#181815] transition-colors whitespace-nowrap"
                >
                  Low-Glycemic Greens 6
                </button>
                <button
                  type="button"
                  onClick={() => applyCratePreset('immunity')}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#FBFBF9] border border-[#181815]/12 hover:border-[#181815]/35 text-[#181815] transition-colors whitespace-nowrap"
                >
                  Roots & Citrus Immunity 6
                </button>
                <button
                  type="button"
                  onClick={() => setCrateIds([])}
                  className="px-2.5 py-1.5 text-xs text-[#5C5B54] hover:text-[#181815] inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* 6 Visual Bottle Crate Slots */}
            <div className="my-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[0, 1, 2, 3, 4, 5].map((slotIndex) => {
                const bottle = crateBottles[slotIndex];
                return (
                  <div
                    key={slotIndex}
                    className={`p-3 rounded-lg border transition-all flex flex-col justify-between min-h-[104px] ${
                      bottle
                        ? 'bg-[#FBFBF9] border-[#181815]/15'
                        : 'bg-[#EAE7DF]/50 border-dashed border-[#181815]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[#5C5B54]">
                      <span>SLOT 0{slotIndex + 1}</span>
                      {bottle && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCrateSlot(slotIndex)}
                          className="text-[#5C5B54] hover:text-[#991B1B]"
                          aria-label={`Remove ${bottle.name} from slot ${slotIndex + 1}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {bottle ? (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-6 rounded-xs shrink-0 border border-black/15"
                            style={{ backgroundColor: bottle.liquidHexPrimary }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#181815] truncate">
                              {bottle.name}
                            </p>
                            <p className="text-[11px] text-[#5C5B54] font-mono-tabular">
                              {bottle.code} · {bottle.nutrition.sugarGrams}g sugar
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto text-center">
                        <p className="text-[11px] text-[#5C5B54]">
                          Empty Vessel Slot
                        </p>
                        <p className="text-[10px] text-[#5C5B54]/80">
                          Click + on any bottle below
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Crate Telemetry & Commit Bar */}
            <div className="pt-4 border-t border-[#181815]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#5C5B54] font-mono-tabular">
                <span>
                  Produce Mass:{' '}
                  <strong className="text-[#181815]">
                    {crateMetrics.totalWeight.toFixed(1)} lbs
                  </strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Avg Sugar:{' '}
                  <strong className="text-[#181815]">
                    {crateMetrics.avgSugar.toFixed(1)}g / bottle
                  </strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Total Energy:{' '}
                  <strong className="text-[#181815]">
                    {crateMetrics.totalCalories} kcal
                  </strong>
                </span>
                {crateBottles.length === 6 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#1B4332] font-semibold">
                      Crate Savings: -${crateMetrics.savings.toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                disabled={crateBottles.length !== 6}
                onClick={handleCommitCrate}
                className={`px-5 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  crateBottles.length === 6
                    ? 'bg-[#1B4332] hover:bg-[#143325] text-[#FBFBF9]'
                    : 'bg-[#181815]/15 text-[#5C5B54] cursor-not-allowed'
                }`}
              >
                {crateAddedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>6-Bottle Crate Added to Cold-Pack Bag</span>
                  </>
                ) : crateBottles.length === 6 ? (
                  <>
                    <Package className="w-4 h-4" />
                    <span className="font-mono-tabular">
                      Add 6-Bottle Crate to Bag · $68.00
                    </span>
                  </>
                ) : (
                  <span>
                    Select {6 - crateBottles.length} More Bottle
                    {6 - crateBottles.length > 1 ? 's' : ''} to Complete Crate
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Filter & Assay Controls Bar */}
        <div className="mt-8 mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Segmented Tabs */}
            <div
              role="tablist"
              aria-label="Filter juices by botanical category"
              className="flex flex-wrap items-center gap-1 p-1 bg-[#EFECE5] rounded-lg"
            >
              {(
                [
                  { id: 'all', label: `All Presses (${JUICE_CATALOG.length})` },
                  { id: 'greens', label: 'Chlorophyll Greens' },
                  { id: 'roots', label: 'Roots & Beets' },
                  { id: 'citrus', label: 'Turmeric & Citrus' },
                  { id: 'mylks', label: 'Sprouted Mylks' },
                  { id: 'shots', label: 'Charcoal & Tonics' },
                ] as { id: JuiceCategory; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeCategory === tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeCategory === tab.id
                      ? 'bg-[#FBFBF9] text-[#181815] shadow-2xs'
                      : 'text-[#5C5B54] hover:text-[#181815]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right Controls: Studio Photo / Spec Toggle + Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Studio Photo vs Technical Apothecary Spec View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-[#EFECE5] rounded-lg">
                <button
                  type="button"
                  onClick={() => setGalleryMode('photo')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    galleryMode === 'photo'
                      ? 'bg-[#FBFBF9] text-[#181815] shadow-2xs'
                      : 'text-[#5C5B54] hover:text-[#181815]'
                  }`}
                >
                  Studio Photos
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryMode('spec')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    galleryMode === 'spec'
                      ? 'bg-[#FBFBF9] text-[#181815] shadow-2xs'
                      : 'text-[#5C5B54] hover:text-[#181815]'
                  }`}
                >
                  Apothecary Specs
                </button>
              </div>

              {/* Sort Select */}
              <div className="flex items-center gap-1.5 border border-[#181815]/15 rounded-lg px-3 h-9 bg-[#FBFBF9]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#5C5B54]" />
                <select
                  aria-label="Sort formulations"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-xs text-[#181815] bg-transparent focus:outline-none"
                >
                  <option value="featured">Sort: Circadian Sequence</option>
                  <option value="sugar-asc">Lowest Natural Sugar (g)</option>
                  <option value="vitc-desc">Highest Vitamin C (% DV)</option>
                  <option value="ph-desc">Highest Alkalinity (pH)</option>
                  <option value="price-asc">Price: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Second Filter Row: Dietary & Biochemical Quick Filters + Search Input */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#5C5B54] mr-1">Biochemical Filter:</span>
              <button
                type="button"
                onClick={() => setOnlyLowSugar((v) => !v)}
                className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors whitespace-nowrap ${
                  onlyLowSugar
                    ? 'border-[#1B4332] bg-[#1B4332]/8 text-[#1B4332]'
                    : 'border-[#181815]/12 text-[#5C5B54] hover:text-[#181815]'
                }`}
              >
                Low Glycemic (≤ 8g Sugar)
              </button>
              <button
                type="button"
                onClick={() => setOnlyAlkaline((v) => !v)}
                className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors whitespace-nowrap ${
                  onlyAlkaline
                    ? 'border-[#1B4332] bg-[#1B4332]/8 text-[#1B4332]'
                    : 'border-[#181815]/12 text-[#5C5B54] hover:text-[#181815]'
                }`}
              >
                Alkaline pH (≥ 7.5)
              </button>
              <button
                type="button"
                onClick={() => setOnlyHighVitC((v) => !v)}
                className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors whitespace-nowrap ${
                  onlyHighVitC
                    ? 'border-[#1B4332] bg-[#1B4332]/8 text-[#1B4332]'
                    : 'border-[#181815]/12 text-[#5C5B54] hover:text-[#181815]'
                }`}
              >
                High Vitamin C (≥ 150% DV)
              </button>

              {compareIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCompareTable((s) => !s)}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-[#181815] text-[#FBFBF9] flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>
                    {showCompareTable ? 'Hide' : 'Compare'} Selected ({compareIds.length}/3)
                  </span>
                </button>
              )}
            </div>

            {/* Live Search Bar */}
            <div
              className={`flex items-center gap-2 w-full md:w-72 bg-[#F4F3EF] border border-[#181815]/15 rounded-lg px-3 py-1.5 ${
                showSearchBar ? 'ring-2 ring-[#1B4332]' : ''
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#5C5B54] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search botanicals (kale, yuzu, beet)..."
                className="w-full text-xs bg-transparent text-[#181815] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#5C5B54] hover:text-[#181815]"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inline Side-by-Side Botanical Assay Comparison Table */}
        {showCompareTable && comparedProducts.length > 0 && (
          <div className="mb-10 p-6 rounded-xl bg-[#F4F3EF] border border-[#181815]/12 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#181815]">
                  Side-by-Side Botanical & Nutritional Assay
                </h3>
                <p className="text-xs text-[#5C5B54]">
                  Comparing {comparedProducts.length} formulations per 16 fl oz (473 ml) apothecary vessel
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCompareIds([]);
                    setShowCompareTable(false);
                  }}
                  className="text-xs text-[#5C5B54] hover:text-[#181815] underline underline-offset-4"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompareTable(false)}
                  className="p-1.5 text-[#5C5B54] hover:text-[#181815]"
                  aria-label="Close comparison table"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#181815]/10 text-[#5C5B54] font-mono-tabular">
                  <th className="py-2.5 pr-4 font-medium w-44">Assay Metric</th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} className="py-2.5 px-4 font-semibold text-[#181815]">
                      <div className="flex items-center justify-between">
                        <span>
                          {p.code} · {p.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCompareProduct(p.id)}
                          className="text-[#5C5B54] hover:text-[#991B1B]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181815]/8 font-mono-tabular">
                <tr>
                  <td className="py-2.5 pr-4 font-sans text-[#5C5B54]">Ritual Window</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 font-sans text-[#1B4332] font-medium">
                      {p.ritualTiming}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans text-[#5C5B54]">Raw Farm Mass</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 font-semibold text-[#181815]">
                      {p.produceWeightLbs} lbs ({Math.round(p.produceWeightLbs * 453.6)} g)
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans text-[#5C5B54]">Energy / Natural Sugar</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[#181815]">
                      {p.nutrition.calories} kcal · {p.nutrition.sugarGrams}g sugar ({p.glycemicIndex})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans text-[#5C5B54]">pH & Refractometer Brix</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[#181815]">
                      pH {p.pHLevel.toFixed(1)} · {p.brixLevel}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans text-[#5C5B54]">Vitamin C / Potassium</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[#181815]">
                      {p.nutrition.vitaminCPercent}% DV · {p.nutrition.potassiumMg} mg K+
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans text-[#5C5B54]">Plant Protein / Magnesium</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[#181815]">
                      {p.nutrition.proteinGrams}g protein · {p.nutrition.magnesiumPercent}% Mg
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans text-[#5C5B54]">Lead Farm Botanicals</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 font-sans text-[#5C5B54]">
                      {p.ingredients
                        .slice(0, 3)
                        .map((i) => `${i.name} (${i.weightGrams}g)`)
                        .join(' · ')}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 3-Column Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-[#F4F3EF] rounded-xl border border-[#181815]/8">
            <p className="text-lg font-display text-[#181815]">
              No cold-pressed formulations match your active filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setOnlyLowSugar(false);
                setOnlyAlkaline(false);
                setOnlyHighVitC(false);
              }}
              className="mt-3 px-4 py-2 text-xs font-medium bg-[#181815] text-[#FBFBF9] rounded-lg"
            >
              Reset All Collection Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const currentSize = cardSizes[product.id] || '16oz';
              const sizeSpec = SIZE_FACTORS[currentSize];
              const computedPrice = (
                product.basePrice16oz * sizeSpec.factor
              ).toFixed(2);
              const isAdded = justAddedId === product.id;
              const isCompared = compareIds.includes(product.id);
              const countInCrate = crateIds.filter((id) => id === product.id).length;

              return (
                <article
                  key={product.id}
                  className="group bg-[#FBFBF9] border border-[#181815]/10 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    {/* 4:3 Product Image Slot (65-75% of card height on neutral backdrop) */}
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="aspect-[4/3] w-full bg-[#F3F1EC] border-b border-[#181815]/8 cursor-pointer relative overflow-hidden"
                    >
                      <StudioBottleVisual
                        imageUrl={product.imageUrl}
                        code={product.code}
                        name={product.name}
                        categoryLabel={product.categoryLabel}
                        liquidHexPrimary={product.liquidHexPrimary}
                        liquidHexSecondary={product.liquidHexSecondary}
                        botanicalNote={product.botanicalNote}
                        volumeLabel={`${sizeSpec.label.toUpperCase()}`}
                        forceBottleRender={galleryMode === 'spec'}
                      />
                    </div>

                    {/* Card Body with Uniform Field Order & Unboxed Metadata */}
                    <div className="p-5">
                      {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
                      <div className="flex items-center justify-between text-xs text-[#5C5B54] mb-1.5">
                        <span>
                          {product.code} · {product.categoryLabel}
                        </span>
                        <span className="font-mono-tabular">
                          {product.nutrition.sugarGrams}g sugar · pH {product.pHLevel.toFixed(1)}
                        </span>
                      </div>

                      {/* Product Name (16px SemiBold) + Price (15px Tabular) */}
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-base font-semibold text-[#181815] font-sans">
                          <button
                            type="button"
                            onClick={() => onSelectProduct(product)}
                            className="hover:underline underline-offset-4 text-left"
                          >
                            {product.name}
                          </button>
                        </h3>
                        <span className="text-[15px] font-semibold text-[#181815] font-mono-tabular shrink-0">
                          ${computedPrice}
                        </span>
                      </div>

                      {/* Botanical Subtitle */}
                      <p className="mt-1 text-xs text-[#5C5B54] line-clamp-2 leading-relaxed">
                        {product.subtitle}
                      </p>

                      {/* Unboxed Nutritional & Physical Specs */}
                      <div className="mt-3 pt-3 border-t border-[#181815]/8 flex items-center justify-between text-[11px] text-[#5C5B54] font-mono-tabular">
                        <span>
                          {product.nutrition.calories} kcal · Vit C{' '}
                          {product.nutrition.vitaminCPercent}% ·{' '}
                          {product.produceWeightLbs} lbs raw
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            toggleCompareProduct(product.id);
                            if (!isCompared) setShowCompareTable(true);
                          }}
                          className={`underline underline-offset-4 transition-colors ${
                            isCompared
                              ? 'text-[#1B4332] font-semibold'
                              : 'text-[#5C5B54] hover:text-[#181815]'
                          }`}
                        >
                          {isCompared ? 'Comparing' : 'Compare'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Controls */}
                  <div className="px-5 pb-5 pt-1 space-y-2.5">
                    {collectionMode === 'single' ? (
                      <>
                        {/* Interactive Vessel Volume Selector */}
                        <div className="grid grid-cols-3 gap-1 p-1 bg-[#F3F1EC] rounded-lg">
                          {(['12oz', '16oz', '32oz'] as BottleSize[]).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() =>
                                setCardSizes((prev) => ({
                                  ...prev,
                                  [product.id]: sz,
                                }))
                              }
                              className={`py-1 px-2 text-[11px] font-mono-tabular font-medium rounded transition-colors whitespace-nowrap ${
                                currentSize === sz
                                  ? 'bg-[#FBFBF9] text-[#181815] shadow-2xs'
                                  : 'text-[#5C5B54] hover:text-[#181815]'
                              }`}
                            >
                              {sz === '32oz'
                                ? '32 oz Carafe'
                                : sz.replace('oz', ' fl oz')}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuickAddSingle(product, currentSize)
                            }
                            className="flex-1 h-10 px-4 rounded-lg bg-[#1B4332] hover:bg-[#143325] text-[#FBFBF9] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added ({sizeSpec.label})</span>
                              </>
                            ) : (
                              <span>Add to Bag · ${computedPrice}</span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectProduct(product)}
                            className="h-10 px-3 rounded-lg border border-[#181815]/15 hover:border-[#181815]/35 text-xs font-medium text-[#181815] transition-colors flex items-center gap-1 whitespace-nowrap"
                            aria-label={`Inspect ${product.name} botanical formula`}
                          >
                            <span>Assay</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      /* 6-Bottle Crate Selection Mode Controls */
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddBottleToCrate(product.id)}
                          className="flex-1 h-10 px-4 rounded-lg bg-[#1B4332] hover:bg-[#143325] text-[#FBFBF9] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>
                            Add to 6-Crate
                            {countInCrate > 0 ? ` (${countInCrate} in crate)` : ''}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectProduct(product)}
                          className="h-10 px-3 rounded-lg border border-[#181815]/15 hover:border-[#181815]/35 text-xs font-medium text-[#181815] transition-colors flex items-center gap-1 whitespace-nowrap"
                        >
                          <span>Assay</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
