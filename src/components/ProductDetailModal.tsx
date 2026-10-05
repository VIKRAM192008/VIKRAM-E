import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { BottleSize, JuiceProduct } from '../data/juiceCatalog';
import { StudioBottleVisual } from './StudioBottleVisual';

interface ProductDetailModalProps {
  product: JuiceProduct | null;
  onClose: () => void;
  onAddToCart: (
    product: JuiceProduct,
    size: BottleSize,
    quantity: number,
    isSubscription: boolean
  ) => void;
}

const SIZE_MULTIPLIERS: Record<BottleSize, { label: string; ml: string; factor: number }> = {
  '12oz': { label: '12 fl oz', ml: '355 ml', factor: 0.8 },
  '16oz': { label: '16 fl oz', ml: '473 ml', factor: 1.0 },
  '32oz': { label: '32 fl oz Carafe', ml: '946 ml', factor: 1.8 },
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<BottleSize>('16oz');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubscription, setIsSubscription] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'studio' | 'apothecary'>('studio');
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  if (!product) return null;

  const sizeInfo = SIZE_MULTIPLIERS[selectedSize];
  const rawUnitPrice = product.basePrice16oz * sizeInfo.factor;
  const finalUnitPrice = isSubscription ? rawUnitPrice * 0.88 : rawUnitPrice;
  const totalPrice = finalUnitPrice * quantity;

  const handleBuy = () => {
    onAddToCart(product, selectedSize, quantity, isSubscription);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#181815]/60 backdrop-blur-[2px] p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
    >
      <div className="relative w-full max-w-5xl bg-[#FBFBF9] border border-[#181815]/12 rounded-xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#181815]/8 bg-[#FBFBF9]">
          <div className="flex items-center gap-2 text-xs text-[#5C5B54] font-mono-tabular">
            <span>{product.code}</span>
            <span aria-hidden="true">·</span>
            <span>{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>pH {product.pHLevel.toFixed(1)}</span>
            <span aria-hidden="true">·</span>
            <span>Pressed at {product.pressTempFahrenheit}°F</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5C5B54] hover:text-[#181815] transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-[#1B4332]"
            aria-label="Close product specification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split Contiguous PDP Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Left Column: Sticky Gallery & Botanical Breakdown */}
          <div className="lg:col-span-6 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[#181815]/8 flex flex-col justify-between bg-[#F7F5F0]">
            <div>
              {/* Gallery Image Slot (4:3) */}
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border border-[#181815]/8 bg-[#F3F1EC] relative">
                <StudioBottleVisual
                  imageUrl={product.imageUrl}
                  code={product.code}
                  name={product.name}
                  categoryLabel={product.categoryLabel}
                  liquidHexPrimary={product.liquidHexPrimary}
                  liquidHexSecondary={product.liquidHexSecondary}
                  botanicalNote={product.botanicalNote}
                  volumeLabel={`${sizeInfo.label.toUpperCase()} · ${sizeInfo.ml.toUpperCase()}`}
                  forceBottleRender={viewMode === 'apothecary'}
                />
              </div>

              {/* View Switcher if product has both studio photo and apothecary diagram */}
              {product.imageUrl && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[#5C5B54]">Visual Inspection Mode</span>
                  <div className="flex items-center gap-1 p-1 bg-[#EAE7DF] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setViewMode('studio')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        viewMode === 'studio'
                          ? 'bg-[#FBFBF9] text-[#181815] shadow-xs'
                          : 'text-[#5C5B54] hover:text-[#181815]'
                      }`}
                    >
                      Studio Photograph
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('apothecary')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        viewMode === 'apothecary'
                          ? 'bg-[#FBFBF9] text-[#181815] shadow-xs'
                          : 'text-[#5C5B54] hover:text-[#181815]'
                      }`}
                    >
                      Apothecary Spec
                    </button>
                  </div>
                </div>
              )}

              {/* Botanical Extraction Bill of Materials */}
              <div className="mt-6 pt-6 border-t border-[#181815]/8">
                <div className="flex items-baseline justify-between mb-3">
                  <h4 className="text-sm font-semibold text-[#181815]">
                    Hydraulic Press Bill of Botanicals
                  </h4>
                  <span className="text-xs text-[#5C5B54] font-mono-tabular">
                    Total Raw Input: {(product.produceWeightLbs * sizeInfo.factor).toFixed(1)} lbs
                  </span>
                </div>
                <div className="divide-y divide-[#181815]/8">
                  {product.ingredients.map((ing) => (
                    <div
                      key={ing.name}
                      className="py-2.5 flex items-center justify-between text-xs gap-4"
                    >
                      <div>
                        <p className="font-medium text-[#181815]">{ing.name}</p>
                        <p className="text-[#5C5B54]">
                          {ing.origin} · {ing.role}
                        </p>
                      </div>
                      <span className="font-mono-tabular text-[#181815] font-medium shrink-0">
                        {Math.round(ing.weightGrams * sizeInfo.factor)} g
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tasting Balance */}
            <div className="mt-6 pt-5 border-t border-[#181815]/8 grid grid-cols-4 gap-3">
              {Object.entries(product.tastingProfile).map(([trait, score]) => (
                <div key={trait}>
                  <div className="flex items-center justify-between text-[11px] text-[#5C5B54] capitalize mb-1">
                    <span>{trait}</span>
                    <span className="font-mono-tabular">{score}/5</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E3DFD5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1B4332]"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 p-6 md:p-8 flex flex-col justify-between bg-[#FBFBF9]">
            <div>
              {/* Unboxed Metadata Kicker */}
              <div className="flex items-center gap-2 text-xs text-[#5C5B54] mb-2">
                <span>{product.availabilityStatus}</span>
                <span aria-hidden="true">·</span>
                <span>Raw {product.shelfLifeDays}-Day Cold Shelf Life</span>
                <span aria-hidden="true">·</span>
                <span>{product.glycemicIndex} Glycemic</span>
              </div>

              <h2
                id="pdp-title"
                className="text-3xl font-semibold text-[#181815] tracking-tight"
              >
                {product.name}
              </h2>
              <p className="mt-1 text-sm text-[#5C5B54]">{product.subtitle}</p>

              {/* Contiguous Price & Ritual Timing */}
              <div className="mt-4 pb-5 border-b border-[#181815]/8 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-semibold text-[#181815] font-mono-tabular">
                    ${finalUnitPrice.toFixed(2)}
                  </span>
                  {isSubscription && (
                    <span className="text-xs text-[#5C5B54] line-through font-mono-tabular">
                      ${rawUnitPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-[#5C5B54]">
                    per {sizeInfo.label} ({sizeInfo.ml})
                  </span>
                </div>
                <span className="text-xs text-[#1B4332] font-medium">
                  {product.ritualTiming}
                </span>
              </div>

              <p className="mt-4 text-sm text-[#3A3935] leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selector: Bottle Size */}
              <div className="mt-6">
                <label className="block text-xs font-medium text-[#5C5B54] mb-2">
                  Select Apothecary Vessel Volume
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['12oz', '16oz', '32oz'] as BottleSize[]).map((sizeKey) => {
                    const spec = SIZE_MULTIPLIERS[sizeKey];
                    const priceForSize = (
                      product.basePrice16oz *
                      spec.factor *
                      (isSubscription ? 0.88 : 1)
                    ).toFixed(2);
                    const active = selectedSize === sizeKey;
                    return (
                      <button
                        key={sizeKey}
                        type="button"
                        onClick={() => setSelectedSize(sizeKey)}
                        className={`py-2.5 px-3 rounded-lg border text-left transition-colors ${
                          active
                            ? 'border-[#1B4332] bg-[#1B4332]/6 text-[#181815]'
                            : 'border-[#181815]/12 text-[#5C5B54] hover:border-[#181815]/30'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#181815] whitespace-nowrap">
                          {spec.label}
                        </div>
                        <div className="text-[11px] font-mono-tabular text-[#5C5B54] mt-0.5">
                          {spec.ml} · ${priceForSize}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Cadence Selector */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-[#5C5B54] mb-2">
                  Fulfillment Cadence
                </label>
                <div className="grid grid-cols-2 gap-2.5 p-1 bg-[#F3F1EC] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setIsSubscription(false)}
                    className={`py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                      !isSubscription
                        ? 'bg-[#FBFBF9] text-[#181815] shadow-xs'
                        : 'text-[#5C5B54] hover:text-[#181815]'
                    }`}
                  >
                    Single Batch Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSubscription(true)}
                    className={`py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                      isSubscription
                        ? 'bg-[#FBFBF9] text-[#1B4332] shadow-xs'
                        : 'text-[#5C5B54] hover:text-[#181815]'
                    }`}
                  >
                    Weekly Press Cadence (Save 12%)
                  </button>
                </div>
              </div>

              {/* Tabular Nutritional Assay */}
              <div className="mt-6 pt-5 border-t border-[#181815]/8">
                <h4 className="text-xs font-semibold text-[#181815] mb-3">
                  Nutritional Assay ({sizeInfo.label} Serving)
                </h4>
                <div className="grid grid-cols-4 gap-3 py-3 px-4 rounded-lg bg-[#F4F3EF] font-mono-tabular">
                  <div>
                    <div className="text-[11px] text-[#5C5B54]">Energy</div>
                    <div className="text-sm font-semibold text-[#181815]">
                      {Math.round(product.nutrition.calories * sizeInfo.factor)} kcal
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#5C5B54]">Natural Sugar</div>
                    <div className="text-sm font-semibold text-[#181815]">
                      {Math.round(product.nutrition.sugarGrams * sizeInfo.factor)} g
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#5C5B54]">Vitamin C</div>
                    <div className="text-sm font-semibold text-[#181815]">
                      {Math.round(product.nutrition.vitaminCPercent * sizeInfo.factor)}% DV
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#5C5B54]">Potassium</div>
                    <div className="text-sm font-semibold text-[#181815]">
                      {Math.round(product.nutrition.potassiumMg * sizeInfo.factor)} mg
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contiguous Primary Buy Action Bar */}
            <div className="mt-6 pt-5 border-t border-[#181815]/8 flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#181815]/15 rounded-lg bg-[#FBFBF9] h-11">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 h-full text-[#5C5B54] hover:text-[#181815] transition-colors"
                  aria-label="Decrease bottle quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-semibold font-mono-tabular text-[#181815]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 h-full text-[#5C5B54] hover:text-[#181815] transition-colors"
                  aria-label="Increase bottle quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Primary Add to Bag CTA */}
              <button
                type="button"
                onClick={handleBuy}
                className="flex-1 h-11 px-5 rounded-lg bg-[#1B4332] hover:bg-[#143325] text-[#FBFBF9] text-sm font-medium transition-colors flex items-center justify-between whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cold Pack Bag</span>
                    </>
                  ) : (
                    <span>
                      {isSubscription ? 'Add Weekly Press to Bag' : 'Add to Cold Pack Bag'}
                    </span>
                  )}
                </span>
                <span className="font-mono-tabular font-semibold">
                  ${totalPrice.toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
