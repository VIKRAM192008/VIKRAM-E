import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export interface CartItem {
  cartItemId: string;
  title: string;
  subtitle: string;
  sizeLabel: string;
  unitPrice: number;
  quantity: number;
  isSubscription?: boolean;
  liquidHexPrimary: string;
}

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

interface ConfirmedOrderReceipt {
  orderNumber: string;
  timestamp: string;
  customerName: string;
  phone: string;
  address: string;
  postalCode: string;
  deliveryWindow: string;
  paymentMethod: 'cod' | 'card';
  items: CartItem[];
  subtotal: number;
  bottleReturnCredit: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [returnBottlesCount, setReturnBottlesCount] = useState<number>(0);
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Checkout verification fields
  const [customerName, setCustomerName] = useState<string>('Clara Vance');
  const [phone, setPhone] = useState<string>('(415) 890-4312');
  const [address, setAddress] = useState<string>('742 Fillmore St, Apt 4B');
  const [postalCode, setPostalCode] = useState<string>('94117');
  const [deliveryWindow, setDeliveryWindow] = useState<string>(
    '06:00 AM – 07:30 AM Cold-Pack Doorstep Drop'
  );
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedReceipt, setConfirmedReceipt] =
    useState<ConfirmedOrderReceipt | null>(null);

  if (!isOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 55.0;
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const bottleReturnCredit = returnBottlesCount * 1.0;
  const discountAmount = appliedPromo === 'SOLSTICE15' ? subtotal * 0.15 : 0;
  const netBeforeShipping = Math.max(
    0,
    subtotal - bottleReturnCredit - discountAmount
  );
  const shippingCost =
    items.length === 0 || netBeforeShipping >= FREE_DELIVERY_THRESHOLD ? 0 : 7.5;
  const finalTotal = netBeforeShipping + shippingCost;
  const remainingForFreeShipping = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - netBeforeShipping
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoCodeInput.trim().toUpperCase();
    if (cleaned === 'SOLSTICE15' || cleaned === 'FIRSTPRESS') {
      setAppliedPromo('SOLSTICE15');
      setPromoError(null);
    } else {
      setPromoError('Valid studio code: SOLSTICE15 (15% off)');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim() || !postalCode.trim()) {
      setFormError('Please complete all customer verification fields.');
      return;
    }
    setFormError(null);

    const receipt: ConfirmedOrderReceipt = {
      orderNumber: `SP-${Math.floor(1040 + Math.random() * 8900)}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      postalCode: postalCode.trim(),
      deliveryWindow,
      paymentMethod,
      items: [...items],
      subtotal,
      bottleReturnCredit,
      discountAmount,
      shippingCost,
      total: finalTotal,
    };

    setConfirmedReceipt(receipt);
    setStep('confirmed');
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#181815]/55 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Cold-Pack Bag and Checkout"
    >
      <div className="w-full max-w-md bg-[#FBFBF9] h-full flex flex-col justify-between border-l border-[#181815]/12 shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#181815]/8 flex items-center justify-between bg-[#FBFBF9]">
          <div>
            <h2 className="text-xl font-semibold text-[#181815]">
              {step === 'bag' && 'Insulated Cold-Pack Bag'}
              {step === 'checkout' && 'Cold-Chain Dispatch & Payment'}
              {step === 'confirmed' && 'Press Dispatch Confirmed'}
            </h2>
            <p className="text-xs text-[#5C5B54] font-mono-tabular">
              {step === 'confirmed' && confirmedReceipt
                ? `Order #${confirmedReceipt.orderNumber} · Verified`
                : remainingForFreeShipping === 0 && items.length > 0
                ? 'Complimentary Insulated Courier Unlocked ($55+)'
                : `Add $${remainingForFreeShipping.toFixed(2)} for complimentary cold-pack delivery`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (step === 'confirmed') setStep('bag');
              onClose();
            }}
            className="p-2 text-[#5C5B54] hover:text-[#181815] rounded-lg transition-colors"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="h-1 w-full bg-[#E6E3DA]">
            <div
              className="h-full bg-[#1B4332] transition-all duration-200"
              style={{
                width: `${Math.min(
                  100,
                  (netBeforeShipping / FREE_DELIVERY_THRESHOLD) * 100
                )}%`,
              }}
            />
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 'bag' && (
            <>
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-lg font-display text-[#181815] mb-1">
                    Your insulated cold-pack bag is empty.
                  </p>
                  <p className="text-xs text-[#5C5B54] max-w-xs mx-auto mb-6">
                    Explore our 5:00 AM daily hydraulic extractions, build a bespoke formula, or reserve a circadian reset flight.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium bg-[#1B4332] text-[#FBFBF9] rounded-lg hover:bg-[#143325] transition-colors"
                  >
                    Return to Press Catalog
                  </button>
                </div>
              ) : (
                <>
                  {/* Itemized List */}
                  <div className="divide-y divide-[#181815]/8">
                    {items.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="py-4 first:pt-0 flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-3.5 h-10 rounded-xs shrink-0 mt-0.5 border border-black/15"
                            style={{ backgroundColor: item.liquidHexPrimary }}
                          />
                          <div>
                            <h4 className="text-sm font-semibold text-[#181815]">
                              {item.title}
                            </h4>
                            <p className="text-xs text-[#5C5B54] mt-0.5">
                              {item.sizeLabel}
                              {item.isSubscription ? ' · Weekly Cadence (-12%)' : ''}
                            </p>
                            <p className="text-[11px] text-[#5C5B54] mt-0.5 line-clamp-1">
                              {item.subtitle}
                            </p>
                            <div className="mt-2.5 flex items-center gap-2">
                              <div className="inline-flex items-center border border-[#181815]/15 rounded-md bg-[#F4F3EF]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(item.cartItemId, -1)
                                  }
                                  className="px-2 py-1 text-[#5C5B54] hover:text-[#181815]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-mono-tabular font-medium text-[#181815]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(item.cartItemId, 1)
                                  }
                                  className="px-2 py-1 text-[#5C5B54] hover:text-[#181815]"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.cartItemId)}
                                className="p-1 text-[#5C5B54] hover:text-[#991B1B] transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono-tabular shrink-0">
                          <div className="text-sm font-semibold text-[#181815]">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-[11px] text-[#5C5B54]">
                            ${item.unitPrice.toFixed(2)} ea
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Glass Bottle Return Deposit Loop */}
                  <div className="p-4 rounded-lg bg-[#F4F3EF] border border-[#181815]/8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#181815]">
                          Closed-Loop Glass Apothecary Return
                        </p>
                        <p className="text-[11px] text-[#5C5B54] mt-0.5">
                          Leave rinsed glass bottles at your doorstep for -$1.00/bottle credit
                        </p>
                      </div>
                      <div className="flex items-center border border-[#181815]/15 rounded-md bg-[#FBFBF9]">
                        <button
                          type="button"
                          onClick={() =>
                            setReturnBottlesCount((c) => Math.max(0, c - 1))
                          }
                          className="px-2 py-1 text-xs text-[#5C5B54] hover:text-[#181815]"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono-tabular font-semibold">
                          {returnBottlesCount}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setReturnBottlesCount((c) => Math.min(12, c + 1))
                          }
                          className="px-2 py-1 text-xs text-[#5C5B54] hover:text-[#181815]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="space-y-1.5">
                    <label
                      htmlFor="promo-input"
                      className="block text-xs text-[#5C5B54]"
                    >
                      Press Privilege Code (Try{' '}
                      <span className="font-mono-tabular text-[#181815]">
                        SOLSTICE15
                      </span>
                      )
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="promo-input"
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="SOLSTICE15"
                        className="flex-1 h-9 px-3 rounded-lg border border-[#181815]/15 bg-[#F4F3EF] text-xs font-mono-tabular uppercase"
                      />
                      <button
                        type="submit"
                        className="px-3.5 h-9 rounded-lg border border-[#181815]/20 text-xs font-medium text-[#181815] hover:bg-[#F4F3EF] transition-colors whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedPromo && (
                      <p className="text-[11px] text-[#1B4332] font-medium">
                        Code {appliedPromo} applied (-15% off press subtotal).
                      </p>
                    )}
                    {promoError && (
                      <p className="text-[11px] text-[#991B1B]">{promoError}</p>
                    )}
                  </form>
                </>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep('bag')}
                className="inline-flex items-center gap-1.5 text-xs text-[#5C5B54] hover:text-[#181815]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Itemized Bag</span>
              </button>

              <div>
                <label className="block text-xs font-medium text-[#5C5B54] mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#181815]/15 bg-[#F4F3EF] text-xs text-[#181815]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5C5B54] mb-1">
                    SMS Dispatch Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#181815]/15 bg-[#F4F3EF] text-xs font-mono-tabular text-[#181815]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5C5B54] mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#181815]/15 bg-[#F4F3EF] text-xs font-mono-tabular text-[#181815]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C5B54] mb-1">
                  Street Address & Cold-Bag Drop Instructions
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#181815]/15 bg-[#F4F3EF] text-xs text-[#181815]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C5B54] mb-1">
                  Cold-Chain Delivery Window
                </label>
                <select
                  value={deliveryWindow}
                  onChange={(e) => setDeliveryWindow(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#181815]/15 bg-[#F4F3EF] text-xs text-[#181815]"
                >
                  <option value="06:00 AM – 07:30 AM Cold-Pack Doorstep Drop">
                    06:00 AM – 07:30 AM Cold-Pack Doorstep Drop
                  </option>
                  <option value="08:00 AM – 10:00 AM Morning Courier">
                    08:00 AM – 10:00 AM Morning Courier
                  </option>
                  <option value="Solstice Press Flagship Cold-Locker Pickup">
                    Solstice Press Flagship Cold-Locker Pickup (38°F)
                  </option>
                </select>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-medium text-[#5C5B54] mb-1.5">
                  Settlement Method
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-[#1B4332] bg-[#1B4332]/6'
                        : 'border-[#181815]/12 bg-[#F4F3EF]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#181815]">
                      Pay on Delivery (COD)
                    </div>
                    <div className="text-[11px] text-[#5C5B54] mt-0.5">
                      Card / Cash at Doorstep
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-[#1B4332] bg-[#1B4332]/6'
                        : 'border-[#181815]/12 bg-[#F4F3EF]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#181815]">
                      Direct Express Card
                    </div>
                    <div className="text-[11px] text-[#5C5B54] mt-0.5">
                      Pre-Authorized Dispatch
                    </div>
                  </button>
                </div>
              </div>

              {formError && (
                <p className="text-xs text-[#991B1B] font-medium">{formError}</p>
              )}
            </form>
          )}

          {step === 'confirmed' && confirmedReceipt && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-[#1B4332]/8 border border-[#1B4332]/25">
                <div className="flex items-center gap-2 text-[#1B4332] font-semibold text-sm">
                  <Check className="w-4 h-4" />
                  <span>
                    Order #{confirmedReceipt.orderNumber} Confirmed — Preparing 38°F Cold-Pack
                  </span>
                </div>
                <p className="text-xs text-[#5C5B54] mt-1.5 leading-relaxed">
                  Your botanical press queue is locked for the 5:00 AM hydraulic extraction cycle.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#F4F3EF] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5C5B54]">Recipient</span>
                  <span className="font-medium text-[#181815]">
                    {confirmedReceipt.customerName} · {confirmedReceipt.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5B54]">Destination</span>
                  <span className="font-medium text-[#181815]">
                    {confirmedReceipt.address}, {confirmedReceipt.postalCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5B54]">Dispatch Window</span>
                  <span className="font-medium text-[#181815]">
                    {confirmedReceipt.deliveryWindow}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5B54]">Payment Terms</span>
                  <span className="font-mono-tabular font-medium text-[#181815]">
                    {confirmedReceipt.paymentMethod === 'cod'
                      ? `Cash/Terminal on Delivery ($${confirmedReceipt.total.toFixed(2)})`
                      : `Settled ($${confirmedReceipt.total.toFixed(2)})`}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#181815] mb-2">
                  Itemized Batch Receipt
                </h4>
                <div className="divide-y divide-[#181815]/8 border-t border-b border-[#181815]/8">
                  {confirmedReceipt.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="py-2.5 flex items-center justify-between text-xs"
                    >
                      <span>
                        {item.quantity}× {item.title} ({item.sizeLabel})
                      </span>
                      <span className="font-mono-tabular font-medium">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Totals & Action */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="p-6 border-t border-[#181815]/10 bg-[#F4F3EF] space-y-3">
            <div className="space-y-1.5 text-xs font-mono-tabular">
              <div className="flex justify-between text-[#5C5B54]">
                <span>Press Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {bottleReturnCredit > 0 && (
                <div className="flex justify-between text-[#1B4332]">
                  <span>Glass Return Credit ({returnBottlesCount} bottles)</span>
                  <span>-${bottleReturnCredit.toFixed(2)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#1B4332]">
                  <span>Privilege Code (SOLSTICE15)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5C5B54]">
                <span>38°F Insulated Courier</span>
                <span>
                  {shippingCost === 0 ? 'COMPLIMENTARY' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#181815]/10 flex justify-between text-sm font-semibold text-[#181815]">
                <span>Total Due</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full h-11 px-5 rounded-lg bg-[#1B4332] hover:bg-[#143325] text-[#FBFBF9] text-sm font-medium transition-colors flex items-center justify-between whitespace-nowrap"
              >
                <span>Proceed to Cold-Chain Dispatch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full h-11 px-5 rounded-lg bg-[#1B4332] hover:bg-[#143325] text-[#FBFBF9] text-sm font-medium transition-colors flex items-center justify-between whitespace-nowrap"
              >
                <span>
                  {paymentMethod === 'cod'
                    ? 'Confirm Cash-on-Delivery Dispatch'
                    : 'Authorize & Schedule 5:00 AM Press'}
                </span>
                <span className="font-mono-tabular font-semibold">
                  ${finalTotal.toFixed(2)}
                </span>
              </button>
            )}
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 border-t border-[#181815]/10 bg-[#F4F3EF]">
            <button
              type="button"
              onClick={() => {
                setStep('bag');
                onClose();
              }}
              className="w-full h-11 px-5 rounded-lg bg-[#181815] text-[#FBFBF9] text-xs font-medium hover:bg-[#2E2E28] transition-colors"
            >
              Done & Return to Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
