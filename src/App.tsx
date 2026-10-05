import React, { useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import {
  CLEANSE_FLIGHTS,
  FARM_PROVENANCE,
  ATTRIBUTABLE_TESTIMONIALS,
  JuiceProduct,
  BottleSize,
  CleanseFlight,
} from './data/juiceCatalog';
import { StudioBottleVisual } from './components/StudioBottleVisual';
import { DailyCollectionSection } from './components/DailyCollectionSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomPressStudio, CustomPressItemPayload } from './components/CustomPressStudio';
import { CartCheckoutDrawer, CartItem } from './components/CartCheckoutDrawer';

const SIZE_FACTORS: Record<BottleSize, { label: string; factor: number }> = {
  '12oz': { label: '12 fl oz', factor: 0.8 },
  '16oz': { label: '16 fl oz', factor: 1.0 },
  '32oz': { label: '32 fl oz Carafe', factor: 1.8 },
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

  // Active PDP Modal Product
  const [selectedProduct, setSelectedProduct] = useState<JuiceProduct | null>(null);

  // Active Cleanse Flight Inspector
  const [activeFlightId, setActiveFlightId] = useState<string>(CLEANSE_FLIGHTS[0].id);

  // Hero Image Fallback State
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);

  // Shopping Bag State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemId: 'emerald-canopy-16oz-single',
      title: 'Emerald Canopy',
      subtitle: 'Lacinato Kale, English Cucumber, Yuzu & Wild Mint',
      sizeLabel: '16 fl oz',
      unitPrice: 12.50,
      quantity: 1,
      liquidHexPrimary: '#1E4D36',
    },
    {
      cartItemId: 'golden-solstice-16oz-single',
      title: 'Golden Solstice',
      subtitle: 'Hawaiian Red Turmeric, Peruvian Ginger, Valencia Orange & Piperine',
      sizeLabel: '16 fl oz',
      unitPrice: 13.00,
      quantity: 1,
      liquidHexPrimary: '#D97706',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Cart Handlers
  const handleAddToCart = (
    product: JuiceProduct,
    size: BottleSize = '16oz',
    quantity: number = 1,
    isSubscription: boolean = false
  ) => {
    const spec = SIZE_FACTORS[size];
    const unitPrice = Number(
      (product.basePrice16oz * spec.factor * (isSubscription ? 0.88 : 1)).toFixed(2)
    );
    const cartItemId = `${product.id}-${size}-${isSubscription ? 'sub' : 'single'}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          title: product.name,
          subtitle: product.subtitle,
          sizeLabel: spec.label,
          unitPrice,
          quantity,
          isSubscription,
          liquidHexPrimary: product.liquidHexPrimary,
        },
      ];
    });
  };

  const handleAddCrateToCart = (bottles: JuiceProduct[], cratePrice: number) => {
    const summaryNames = bottles.map((b) => b.name).join(' · ');
    const cartItemId = `crate-6-${bottles.map((b) => b.code).join('-')}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          title: 'Curated 6-Bottle Daily Crate',
          subtitle: summaryNames,
          sizeLabel: '6× 16 fl oz Vessels',
          unitPrice: cratePrice,
          quantity: 1,
          liquidHexPrimary: bottles[0]?.liquidHexPrimary || '#1B4332',
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleAddCustomToCart = (custom: CustomPressItemPayload) => {
    setCartItems((prev) => [
      ...prev,
      {
        cartItemId: custom.id,
        title: custom.name,
        subtitle: custom.summary,
        sizeLabel: '16 fl oz Bespoke',
        unitPrice: Number(custom.price.toFixed(2)),
        quantity: 1,
        liquidHexPrimary: custom.primaryHex,
      },
    ]);
    setIsCartOpen(true);
  };

  const handleAddFlightToCart = (flight: CleanseFlight) => {
    const cartItemId = `flight-${flight.id}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          title: flight.title,
          subtitle: `${flight.totalBottles}× 16 fl oz Chronological Reset Bottles`,
          sizeLabel: `${flight.durationDays}-Day Flight`,
          unitPrice: flight.price,
          quantity: 1,
          liquidHexPrimary: '#1B4332',
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const totalBagCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalBagAmount = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const selectedFlight =
    CLEANSE_FLIGHTS.find((f) => f.id === activeFlightId) || CLEANSE_FLIGHTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#181815]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 h-16 px-6 lg:px-10 bg-[#FBFBF9]/95 backdrop-blur-xs border-b border-[#181815]/8 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-2xl font-semibold tracking-tight text-[#181815] font-display whitespace-nowrap"
        >
          Solstice Press
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5C5B54]"
        >
          <a
            href="#daily-collection"
            className="hover:text-[#181815] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Daily Press
          </a>
          <a
            href="#custom-press"
            className="hover:text-[#181815] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Custom Studio
          </a>
          <a
            href="#reset-flights"
            className="hover:text-[#181815] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Reset Flights
          </a>
          <a
            href="#provenance"
            className="hover:text-[#181815] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Provenance
          </a>
        </nav>

        {/* Zone 3: 2 Primary Actions (Search Toggle + Cold-Pack Bag CTA) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setShowSearchBar((s) => !s);
              document
                .getElementById('daily-collection')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-2 text-[#5C5B54] hover:text-[#181815] rounded-lg transition-colors"
            aria-label="Search botanical catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#1B4332] hover:bg-[#143325] text-[#FBFBF9] text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="font-mono-tabular">
              Bag ({totalBagCount}) · ${totalBagAmount.toFixed(2)}
            </span>
          </button>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* SECTION 1: Storefront Hero Showcase */}
        <section className="relative border-b border-[#181815]/8 py-12 md:py-16 lg:py-20">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Hero Left Editorial Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2 text-xs text-[#5C5B54] font-mono-tabular">
                  <span>SONOMA & SAN FRANCISCO</span>
                  <span aria-hidden="true">·</span>
                  <span>BATCH #284 · PRESSED 05:00 AM</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-semibold text-[#181815] leading-[1.06] tracking-tight text-balance">
                  Raw Botanical Extractions Pressed Under 10,000 Pounds of Stone Force.
                </h1>

                <p className="text-base text-[#4A4943] leading-relaxed">
                  Unpasteurized, zero-water-added organic vegetable, root, and sprouted nut formulations bottled in inert French square apothecary glass within six hours of field harvest.
                </p>

                {/* Single Dominant CTA + Secondary Route */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="#daily-collection"
                    className="px-5 py-3 rounded-lg bg-[#1B4332] hover:bg-[#143325] text-[#FBFBF9] text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Explore Daily Extractions
                  </a>
                  <a
                    href="#custom-press"
                    className="px-5 py-3 rounded-lg border border-[#181815]/20 hover:border-[#181815]/45 text-[#181815] text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Commission Custom Press
                  </a>
                </div>

                {/* Adjacent Quantitative Proof Specs */}
                <div className="pt-6 border-t border-[#181815]/10 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xl font-semibold text-[#181815] font-mono-tabular">
                      2.6 lbs
                    </div>
                    <div className="text-xs text-[#5C5B54] mt-0.5">
                      Avg. Organic Produce per 16 oz Vessel
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-[#181815] font-mono-tabular">
                      37.5°F
                    </div>
                    <div className="text-xs text-[#5C5B54] mt-0.5">
                      Cold-Room Hydraulic Extraction Temp
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-[#181815] font-mono-tabular">
                      0% HPP
                    </div>
                    <div className="text-xs text-[#5C5B54] mt-0.5">
                      Never High-Pressure or Heat Treated
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Right 16:9 Studio Campaign Imagery */}
              <div className="lg:col-span-7">
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#181815]/10 bg-[#F3F1EC]">
                  {!heroImgFailed ? (
                    <img
                      src="/src/assets/images/hero_cold_pressed_flight_1791182849851.jpg"
                      alt="Curated flight of five cold-pressed organic juices in square glass apothecary bottles on raw pale travertine stone"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <StudioBottleVisual
                      code="FLIGHT 01–05"
                      name="Solstice Apothecary Flight"
                      categoryLabel="Cold-Pressed Collection"
                      liquidHexPrimary="#1E4D36"
                      liquidHexSecondary="#D97706"
                      botanicalNote="13.4 lbs Organic Produce"
                      forceBottleRender={true}
                    />
                  )}

                  {/* Measured Contrast Scrim for Bottom Caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex items-end justify-between text-[#FBFBF9]">
                    <div>
                      <p className="text-xs font-mono-tabular text-[#FBFBF9]/80">
                        CIRCADIAN FLIGHT NO. 01–05 · GLASS APOTHECARY VESSELS
                      </p>
                      <p className="text-sm font-medium mt-0.5">
                        Emerald Canopy · Golden Solstice · Crimson Velvet · Orchard Cloud · Obsidian Ember
                      </p>
                    </div>
                    <a
                      href="#reset-flights"
                      className="text-xs font-mono-tabular underline underline-offset-4 hover:text-white shrink-0 ml-4"
                    >
                      View Flight Protocol
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: 01. Daily Cold-Pressed Collection (With Single Vessels, 6-Bottle Crate Builder & Assay Comparison) */}
        <DailyCollectionSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSearchBar={showSearchBar}
          onSelectProduct={setSelectedProduct}
          onAddSingleToCart={handleAddToCart}
          onAddCrateToCart={handleAddCrateToCart}
        />

        {/* SECTION 3: Interactive Custom Hydraulic Press Studio */}
        <CustomPressStudio onAddCustomToCart={handleAddCustomToCart} />

        {/* SECTION 4: Multi-Day Reset Flights, Clinical Proof & Farm Provenance */}
        <section id="reset-flights" className="py-16 md:py-24 border-t border-[#181815]/8">
          <div className="max-w-[1240px] mx-auto px-6 space-y-20">
            {/* Part A: Cleanse Flights */}
            <div>
              <div className="mb-10">
                <p className="text-xs text-[#5C5B54] font-mono-tabular mb-2">
                  CHRONOLOGICAL LIQUID NUTRITION PROTOCOLS
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold text-[#181815] tracking-tight">
                  03. Circadian Reset Flights
                </h2>
                <p className="mt-2 text-sm text-[#5C5B54] max-w-2xl">
                  Sequenced morning-to-evening botanical extractions designed to rest digestive pathways while sustaining blood glucose stability and cellular hydration.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 5 Columns: Flight Cards */}
                <div className="lg:col-span-5 space-y-3.5">
                  {CLEANSE_FLIGHTS.map((flight) => {
                    const isSelected = flight.id === selectedFlight.id;
                    return (
                      <div
                        key={flight.id}
                        onClick={() => setActiveFlightId(flight.id)}
                        className={`p-5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#1B4332] bg-[#F4F3EF]'
                            : 'border-[#181815]/10 bg-[#FBFBF9] hover:border-[#181815]/25'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs text-[#5C5B54] font-mono-tabular mb-1">
                          <span>
                            {flight.code} · {flight.durationDays} DAY
                            {flight.durationDays > 1 ? 'S' : ''} · {flight.totalBottles} BOTTLES
                          </span>
                          <span>{flight.dailyCalories} kcal / day</span>
                        </div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-xl font-semibold text-[#181815]">
                            {flight.title}
                          </h3>
                          <span className="text-base font-semibold font-mono-tabular text-[#181815]">
                            ${flight.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#5C5B54]">
                          {flight.targetOutcome}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Right 7 Columns: Selected Flight Chronological Schedule & Reserve CTA */}
                <div className="lg:col-span-7 bg-[#F4F3EF] border border-[#181815]/10 rounded-xl p-6 md:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5 border-b border-[#181815]/10">
                    <div>
                      <span className="text-xs font-mono-tabular text-[#5C5B54]">
                        {selectedFlight.code} · {selectedFlight.totalBottles}× 16 FL OZ GLASS VESSELS
                      </span>
                      <h3 className="text-2xl font-semibold text-[#181815] mt-1">
                        {selectedFlight.title}
                      </h3>
                    </div>
                    <div className="text-right font-mono-tabular">
                      <div className="text-2xl font-semibold text-[#181815]">
                        ${selectedFlight.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-[#5C5B54]">
                        Complimentary 38°F Courier Included
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-[#3A3935] leading-relaxed">
                    {selectedFlight.description}
                  </p>

                  {/* Chronological Schedule Table */}
                  <div className="mt-6">
                    <h4 className="text-xs font-semibold text-[#181815] mb-3">
                      Chronological Intake Cadence
                    </h4>
                    <div className="divide-y divide-[#181815]/8 border-t border-b border-[#181815]/8">
                      {selectedFlight.schedule.map((slot) => (
                        <div
                          key={slot.time}
                          className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono-tabular font-semibold text-[#1B4332] w-28 shrink-0">
                              {slot.time}
                            </span>
                            <span className="font-semibold text-[#181815]">
                              {slot.bottleName}
                            </span>
                          </div>
                          <span className="text-[#5C5B54] sm:text-right">
                            {slot.purpose}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-xs text-[#5C5B54]">
                      Includes insulated cold-pack tote & numbered bottle caps.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddFlightToCart(selectedFlight)}
                      className="px-5 py-3 rounded-lg bg-[#1B4332] hover:bg-[#143325] text-[#FBFBF9] text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      Reserve {selectedFlight.title} · ${selectedFlight.price.toFixed(2)}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Part B: Claim-to-Proof Adjacency — Attributable Outcomes */}
            <div className="pt-12 border-t border-[#181815]/8">
              <div className="mb-8">
                <p className="text-xs text-[#5C5B54] font-mono-tabular mb-1">
                  VERIFIED PHYSIOLOGICAL OUTCOMES
                </p>
                <h3 className="text-2xl font-semibold text-[#181815]">
                  Measured Biomarker & Athletic Recovery Evidence
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ATTRIBUTABLE_TESTIMONIALS.map((item) => (
                  <blockquote
                    key={item.author}
                    className="p-6 rounded-xl bg-[#F4F3EF] border border-[#181815]/8 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-mono-tabular font-semibold text-[#1B4332] mb-3">
                        {item.outcomeMetric}
                      </div>
                      <p className="text-sm text-[#181815] leading-relaxed">
                        “{item.quote}”
                      </p>
                    </div>
                    <footer className="mt-5 pt-4 border-t border-[#181815]/8 flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#181815]">
                        {item.author}
                      </span>
                      <span className="text-[#5C5B54]">{item.role}</span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>

            {/* Part C: Orchard & Farm Provenance Ledger */}
            <div id="provenance" className="pt-12 border-t border-[#181815]/8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs text-[#5C5B54] font-mono-tabular mb-1">
                    OCTOBER HARVEST LOG · REFRACTOMETER ASSAYED
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#181815]">
                    04. Direct Orchard & Farm Provenance
                  </h2>
                </div>
                <span className="text-xs text-[#5C5B54] font-mono-tabular">
                  100% Certified Organic · Zero Concentrates
                </span>
              </div>

              <div className="overflow-x-auto border border-[#181815]/10 rounded-xl bg-[#FBFBF9]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#181815]/10 bg-[#F4F3EF] text-[#5C5B54] font-mono-tabular">
                      <th className="py-3.5 px-4 font-medium">Partner Grower</th>
                      <th className="py-3.5 px-4 font-medium">Growing Region</th>
                      <th className="py-3.5 px-4 font-medium">Botanical Harvest</th>
                      <th className="py-3.5 px-4 font-medium">Harvest-to-Press</th>
                      <th className="py-3.5 px-4 font-medium">Brix Density</th>
                      <th className="py-3.5 px-4 font-medium">Soil Standard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181815]/8">
                    {FARM_PROVENANCE.map((row) => (
                      <tr key={row.farm} className="hover:bg-[#F4F3EF]/60">
                        <td className="py-3.5 px-4 font-semibold text-[#181815]">
                          {row.farm}
                        </td>
                        <td className="py-3.5 px-4 text-[#5C5B54]">{row.region}</td>
                        <td className="py-3.5 px-4 text-[#181815]">{row.crop}</td>
                        <td className="py-3.5 px-4 font-mono-tabular text-[#181815]">
                          {row.harvestToPressHours.toFixed(1)} hrs
                        </td>
                        <td className="py-3.5 px-4 font-mono-tabular text-[#181815]">
                          {row.brixScore}
                        </td>
                        <td className="py-3.5 px-4 text-[#5C5B54]">
                          {row.certification}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#181815]/10 bg-[#F4F3EF] py-12 text-xs text-[#5C5B54]">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-lg font-semibold text-[#181815] font-display">
              Solstice Press
            </p>
            <p className="mt-1">
              482 Hayes Street, San Francisco, CA 94102 · Cold-Room Hours: Daily 06:30 AM – 07:00 PM
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#daily-collection" className="hover:text-[#181815] transition-colors">
              Daily Press
            </a>
            <a href="#custom-press" className="hover:text-[#181815] transition-colors">
              Custom Studio
            </a>
            <a href="#reset-flights" className="hover:text-[#181815] transition-colors">
              Reset Flights
            </a>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="hover:text-[#181815] transition-colors underline underline-offset-4"
            >
              Cold-Pack Bag ({totalBagCount})
            </button>
          </div>
          <div className="font-mono-tabular text-[#5C5B54]">
            © {new Date().getFullYear()} Solstice Press Apothecary LLC.
          </div>
        </div>
      </footer>

      {/* Contiguous Purchase Module (PDP Modal) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Over Cart & Checkout Drawer */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
