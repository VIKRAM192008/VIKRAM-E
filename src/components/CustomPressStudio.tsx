import React, { useState, useMemo } from 'react';
import { Check, Plus, RotateCcw } from 'lucide-react';
import { CUSTOM_BOTANICAL_OPTIONS, CustomIngredientOption } from '../data/juiceCatalog';
import { StudioBottleVisual } from './StudioBottleVisual';

export interface CustomPressItemPayload {
  id: string;
  name: string;
  customLabel: string;
  price: number;
  summary: string;
  primaryHex: string;
  secondaryHex: string;
  calories: number;
  sugarGrams: number;
  weightLbs: number;
}

interface CustomPressStudioProps {
  onAddCustomToCart: (customItem: CustomPressItemPayload) => void;
}

export const CustomPressStudio: React.FC<CustomPressStudioProps> = ({
  onAddCustomToCart,
}) => {
  const bases = useMemo(
    () => CUSTOM_BOTANICAL_OPTIONS.filter((o) => o.type === 'base'),
    []
  );
  const produceList = useMemo(
    () => CUSTOM_BOTANICAL_OPTIONS.filter((o) => o.type === 'produce'),
    []
  );
  const boosters = useMemo(
    () => CUSTOM_BOTANICAL_OPTIONS.filter((o) => o.type === 'booster'),
    []
  );

  const [selectedBaseId, setSelectedBaseId] = useState<string>('base-cucumber');
  const [selectedProduceIds, setSelectedProduceIds] = useState<string[]>([
    'prod-kale',
    'prod-fennel',
    'prod-lemon',
  ]);
  const [selectedBoosterIds, setSelectedBoosterIds] = useState<string[]>([
    'boost-ginger',
  ]);
  const [customDedication, setCustomDedication] = useState<string>('MORNING RITUAL');
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const toggleProduce = (id: string) => {
    setSelectedProduceIds((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((item) => item !== id) : prev;
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const toggleBooster = (id: string) => {
    setSelectedBoosterIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const applyPreset = (preset: 'alkaline' | 'vascular' | 'solar') => {
    if (preset === 'alkaline') {
      setSelectedBaseId('base-celery');
      setSelectedProduceIds(['prod-kale', 'prod-fennel', 'prod-lemon', 'prod-mint']);
      setSelectedBoosterIds(['boost-spirulina']);
      setCustomDedication('ALKALINE FIELD');
    } else if (preset === 'vascular') {
      setSelectedBaseId('base-coconut');
      setSelectedProduceIds(['prod-beet', 'prod-grapefruit', 'prod-apple']);
      setSelectedBoosterIds(['boost-ginger']);
      setCustomDedication('NITRIC CADENCE');
    } else {
      setSelectedBaseId('base-orange');
      setSelectedProduceIds(['prod-pineapple', 'prod-lemon', 'prod-mint']);
      setSelectedBoosterIds(['boost-turmeric', 'boost-ginger']);
      setCustomDedication('SOLAR IMMUNITY');
    }
  };

  const activeIngredients = useMemo(() => {
    const base = bases.find((b) => b.id === selectedBaseId) || bases[0];
    const prods = produceList.filter((p) => selectedProduceIds.includes(p.id));
    const boosts = boosters.filter((b) => selectedBoosterIds.includes(b.id));
    return { base, prods, boosts, all: [base, ...prods, ...boosts] };
  }, [bases, produceList, boosters, selectedBaseId, selectedProduceIds, selectedBoosterIds]);

  const metrics = useMemo(() => {
    const basePrice = 10.50;
    const totalDelta = activeIngredients.all.reduce((acc, i) => acc + i.priceDelta, 0);
    const calories = activeIngredients.all.reduce((acc, i) => acc + i.calories, 0);
    const sugarGrams = activeIngredients.all.reduce((acc, i) => acc + i.sugarGrams, 0);
    const vitaminC = activeIngredients.all.reduce((acc, i) => acc + i.vitaminCPercent, 0);
    const potassium = activeIngredients.all.reduce((acc, i) => acc + i.potassiumMg, 0);
    const weightLbs = activeIngredients.all.reduce((acc, i) => acc + i.weightLbs, 0);
    const rawPh =
      7.0 + activeIngredients.all.reduce((acc, i) => acc + i.pHImpact, 0) * 0.45;
    const pH = Math.min(8.8, Math.max(5.8, rawPh));

    const primaryHex =
      activeIngredients.prods[0]?.colorHex || activeIngredients.base.colorHex;
    const secondaryHex =
      activeIngredients.boosts[0]?.colorHex ||
      activeIngredients.prods[1]?.colorHex ||
      activeIngredients.base.colorHex;

    return {
      price: basePrice + totalDelta,
      calories,
      sugarGrams,
      vitaminC,
      potassium,
      weightLbs,
      pH,
      primaryHex,
      secondaryHex,
    };
  }, [activeIngredients]);

  const handleAddCustom = () => {
    const summaryNames = activeIngredients.all.map((i) => i.name.replace(/^Cold-Pressed |^Organic |^Raw /, '')).join(', ');
    onAddCustomToCart({
      id: `custom-${Date.now()}`,
      name: `Bespoke Press (${customDedication.trim() || 'CUSTOM'})`,
      customLabel: customDedication.trim() || 'CUSTOM FORMULATION',
      price: metrics.price,
      summary: summaryNames,
      primaryHex: metrics.primaryHex,
      secondaryHex: metrics.secondaryHex,
      calories: metrics.calories,
      sugarGrams: metrics.sugarGrams,
      weightLbs: Number(metrics.weightLbs.toFixed(2)),
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1400);
  };

  const renderOptionCard = (
    option: CustomIngredientOption,
    isSelected: boolean,
    onSelect: () => void
  ) => (
    <button
      key={option.id}
      type="button"
      onClick={onSelect}
      className={`p-3.5 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between ${
        isSelected
          ? 'border-[#1B4332] bg-[#1B4332]/6 shadow-2xs'
          : 'border-[#181815]/10 bg-[#FBFBF9] hover:border-[#181815]/25'
      }`}
    >
      <div className="flex items-start justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15"
            style={{ backgroundColor: option.colorHex }}
          />
          <span className="text-xs font-semibold text-[#181815] leading-snug">
            {option.name}
          </span>
        </div>
        <span
          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] ${
            isSelected
              ? 'bg-[#1B4332] text-[#FBFBF9]'
              : 'border border-[#181815]/20 text-transparent'
          }`}
        >
          <Check className="w-2.5 h-2.5" />
        </span>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#181815]/6 flex items-center justify-between text-[11px] text-[#5C5B54] w-full">
        <span>
          {option.origin} · {option.flavorTag}
        </span>
        <span className="font-mono-tabular text-[#181815] font-medium shrink-0">
          {option.priceDelta === 0 ? 'Included' : `+$${option.priceDelta.toFixed(2)}`}
        </span>
      </div>
    </button>
  );

  return (
    <section
      id="custom-press"
      className="py-16 md:py-24 border-t border-[#181815]/8 bg-[#F4F3EF]"
    >
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs text-[#5C5B54] font-mono-tabular mb-2">
              MADE-TO-ORDER HYDRAULIC EXTRACTION · 10,000 LBS FORCE
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#181815] tracking-tight text-balance">
              02. Bespoke Hydraulic Press Studio
            </h2>
            <p className="mt-2 text-sm text-[#5C5B54] max-w-2xl">
              Commission an individualized 16 fl oz glass apothecary bottle. Select one cellular hydration base, up to four farm botanicals, and up to three concentrated root or algae boosters.
            </p>
          </div>

          {/* Preset Formula Loaders */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#E6E3DA] rounded-lg self-start">
            <button
              type="button"
              onClick={() => applyPreset('alkaline')}
              className="px-3 py-1.5 text-xs font-medium rounded-md text-[#181815] hover:bg-[#FBFBF9] transition-colors whitespace-nowrap"
            >
              Load Alkaline Green
            </button>
            <button
              type="button"
              onClick={() => applyPreset('vascular')}
              className="px-3 py-1.5 text-xs font-medium rounded-md text-[#181815] hover:bg-[#FBFBF9] transition-colors whitespace-nowrap"
            >
              Load Nitric Beet
            </button>
            <button
              type="button"
              onClick={() => applyPreset('solar')}
              className="px-3 py-1.5 text-xs font-medium rounded-md text-[#181815] hover:bg-[#FBFBF9] transition-colors whitespace-nowrap"
            >
              Load Solar Turmeric
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Step-by-Step Botanical Selector */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Liquid Base */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-lg font-semibold text-[#181815]">
                  Step 1. Select Cellular Liquid Base (Choose 1)
                </h3>
                <span className="text-xs text-[#5C5B54] font-mono-tabular">
                  10 fl oz Foundation
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bases.map((base) =>
                  renderOptionCard(base, selectedBaseId === base.id, () =>
                    setSelectedBaseId(base.id)
                  )
                )}
              </div>
            </div>

            {/* Step 2: Botanical Produce */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-lg font-semibold text-[#181815]">
                  Step 2. Select Cold-Pressed Botanicals (Up to 4)
                </h3>
                <span className="text-xs text-[#5C5B54] font-mono-tabular">
                  {selectedProduceIds.length}/4 Selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {produceList.map((prod) =>
                  renderOptionCard(
                    prod,
                    selectedProduceIds.includes(prod.id),
                    () => toggleProduce(prod.id)
                  )
                )}
              </div>
            </div>

            {/* Step 3: Functional Boosters */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-lg font-semibold text-[#181815]">
                  Step 3. Cold-Extracted Root & Algae Boosters (Up to 3)
                </h3>
                <span className="text-xs text-[#5C5B54] font-mono-tabular">
                  {selectedBoosterIds.length}/3 Selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {boosters.map((boost) =>
                  renderOptionCard(
                    boost,
                    selectedBoosterIds.includes(boost.id),
                    () => toggleBooster(boost.id)
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Live Apothecary Vessel Preview & Assay Card */}
          <div className="lg:col-span-5 bg-[#FBFBF9] border border-[#181815]/10 rounded-xl p-6 sticky top-20">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#181815]/8">
              <div className="text-xs text-[#5C5B54] font-mono-tabular">
                BESPOKE VESSEL SPEC · 16 FL OZ
              </div>
              <button
                type="button"
                onClick={() => applyPreset('alkaline')}
                className="inline-flex items-center gap-1 text-xs text-[#5C5B54] hover:text-[#181815] transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Live Studio Bottle Render */}
            <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border border-[#181815]/8 mb-5">
              <StudioBottleVisual
                code="BESPOKE"
                name={customDedication.trim() || 'Custom Press'}
                categoryLabel={`${activeIngredients.all.length} Botanicals`}
                liquidHexPrimary={metrics.primaryHex}
                liquidHexSecondary={metrics.secondaryHex}
                botanicalNote={`${metrics.weightLbs.toFixed(1)} lbs Raw Produce`}
                customLabelText={customDedication.trim() || 'CUSTOM FORMULA'}
                forceBottleRender={true}
              />
            </div>

            {/* Custom Apothecary Label Engraving */}
            <div className="mb-5">
              <label
                htmlFor="custom-bottle-label"
                className="block text-xs font-medium text-[#5C5B54] mb-1.5"
              >
                Custom Cotton-Paper Bottle Label Imprint (Max 18 chars)
              </label>
              <input
                id="custom-bottle-label"
                type="text"
                maxLength={18}
                value={customDedication}
                onChange={(e) => setCustomDedication(e.target.value.toUpperCase())}
                placeholder="E.G. ELENA · 07:00 AM"
                className="w-full h-10 px-3 rounded-lg border border-[#181815]/15 bg-[#F4F3EF] text-xs font-mono-tabular text-[#181815] focus:outline-2 focus:outline-[#1B4332]"
              />
            </div>

            {/* Live Nutritional & Physical Telemetry */}
            <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-lg bg-[#F4F3EF] font-mono-tabular mb-5">
              <div>
                <div className="text-[11px] text-[#5C5B54]">Produce Mass</div>
                <div className="text-sm font-semibold text-[#181815]">
                  {metrics.weightLbs.toFixed(2)} lbs
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5C5B54]">Energy / Sugar</div>
                <div className="text-sm font-semibold text-[#181815]">
                  {metrics.calories} kcal · {metrics.sugarGrams}g
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5C5B54]">Est. pH / Vit C</div>
                <div className="text-sm font-semibold text-[#181815]">
                  pH {metrics.pH.toFixed(1)} · {metrics.vitaminC}%
                </div>
              </div>
            </div>

            {/* Active Botanical Manifest */}
            <div className="mb-6">
              <div className="text-xs font-medium text-[#5C5B54] mb-2">
                Active Press Bill ({activeIngredients.all.length} inputs)
              </div>
              <p className="text-xs text-[#181815] leading-relaxed">
                {activeIngredients.all.map((i) => i.name).join(' · ')}
              </p>
            </div>

            {/* Primary Add Custom Bottle Button */}
            <button
              type="button"
              onClick={handleAddCustom}
              className="w-full h-11 px-5 rounded-lg bg-[#1B4332] hover:bg-[#143325] text-[#FBFBF9] text-sm font-medium transition-colors flex items-center justify-between whitespace-nowrap"
            >
              <span className="flex items-center gap-2">
                {addedToast ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Commissioned & Added to Bag</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Commission Custom 16 oz Press</span>
                  </>
                )}
              </span>
              <span className="font-mono-tabular font-semibold">
                ${metrics.price.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
