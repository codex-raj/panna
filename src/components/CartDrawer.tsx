import React, { useState } from 'react';
import { X, Trash2, Tag, ShoppingBag, ArrowRight, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { formatINR, getConditionLabel, getConditionClasses } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: (appliedCoupon: Coupon | null, useCoins: boolean, donate: boolean) => void;
  availableCoupons: Coupon[];
  userCoins: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  availableCoupons,
  userCoins
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [useCoins, setUseCoins] = useState(false);
  const [donate, setDonate] = useState(true);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalMrpTotal = items.reduce((sum, item) => sum + item.book.mrp * item.quantity, 0);
  const totalSavings = originalMrpTotal - subtotal;

  // Free delivery threshold: ₹499
  const freeDeliveryThreshold = 499;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || appliedCoupon?.code === 'FREEDEL';
  const deliveryCharge = items.length === 0 ? 0 : (isFreeDelivery ? 0 : 49);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  // Coupon discount calculation
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      couponDiscount = appliedCoupon.value;
    } else if (appliedCoupon.discountType === 'percentage') {
      const calc = (subtotal * appliedCoupon.value) / 100;
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    }
  }

  // Coins discount (100 coins = ₹20)
  const coinsRedeemable = Math.min(userCoins, 100);
  const coinsDiscount = useCoins ? 20 : 0;
  const donationAmount = donate ? 10 : 0;

  const total = Math.max(0, subtotal - couponDiscount - coinsDiscount + deliveryCharge + donationAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const found = availableCoupons.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    
    if (!found) {
      setCouponError('Invalid coupon code. Try PANNA50 or READMORE');
      return;
    }
    if (subtotal < found.minOrder) {
      setCouponError(`Add items worth ₹${found.minOrder - subtotal} more to use this coupon`);
      return;
    }

    setAppliedCoupon(found);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FAF3E6] h-full shadow-2xl flex flex-col justify-between border-l border-[#22291F]/20 animate-slide-left">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#22291F]/15 bg-[#FFFDF8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#2F6657]" />
            <h2 className="font-display font-bold text-lg text-[#22291F]">
              Your Reading Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-[#5B6355] hover:text-[#22291F] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-[#2F6657]/10 border-b border-[#2F6657]/20 px-5 py-2.5">
          {isFreeDelivery ? (
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#2F6657]">
              <span>✓ You’ve unlocked FREE Pan-India Delivery!</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs font-mono text-[#5B6355] mb-1">
                <span>Add {formatINR(amountNeededForFreeDelivery)} more for FREE delivery</span>
                <span>{Math.round((subtotal / freeDeliveryThreshold) * 100)}%</span>
              </div>
              <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#2F6657] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-stone-200 flex items-center justify-center text-[#5B6355]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-display font-bold text-lg text-[#22291F]">Your cart is empty</p>
              <p className="text-xs text-[#5B6355] max-w-xs">
                Explore thousands of verified second-hand and new titles starting at ₹89!
              </p>
              <button
                onClick={onClose}
                className="bg-[#22291F] text-[#FAF3E6] px-5 py-2.5 rounded-lg text-xs font-mono font-bold hover:bg-[#2F6657] transition-colors cursor-pointer"
              >
                Browse Books Shelf
              </button>
            </div>
          ) : (
            items.map((item) => {
              const condClass = getConditionClasses(item.selectedCondition);
              return (
                <div 
                  key={item.id} 
                  className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5 flex gap-3 shadow-xs"
                >
                  <div 
                    className="w-14 h-20 rounded-md p-1.5 flex flex-col justify-end text-white font-display text-[9px] font-bold shrink-0 shadow-inner"
                    style={{ background: item.book.coverGradient }}
                  >
                    <span className="truncate">{item.book.title.slice(0, 10)}</span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-[#22291F] truncate pr-2">
                          {item.book.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-[#B3261E] transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#5B6355] truncate">{item.book.author}</p>
                      <div className="mt-1">
                        <span className={`inline-block font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border ${condClass.bg} ${condClass.text} ${condClass.border}`}>
                          {getConditionLabel(item.selectedCondition)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-xs text-[#22291F]">
                          {formatINR(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-stone-400">
                            ({formatINR(item.price)} ea)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 text-xs font-mono">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 flex items-center justify-center hover:bg-stone-200 cursor-pointer font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-semibold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-stone-200 cursor-pointer font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Promo Code & Rewards Section */}
          {items.length > 0 && (
            <div className="space-y-3 pt-2">
              {/* Coupon Form */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5">
                <span className="font-mono text-xs font-bold text-[#22291F] block mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#2F6657]" /> Apply Promo Coupon
                </span>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#2F6657]/10 border border-[#2F6657]/30 rounded-lg p-2 text-xs font-mono">
                    <div>
                      <span className="font-bold text-[#2F6657]">{appliedCoupon.code}</span>
                      <p className="text-[10px] text-[#5B6355]">{appliedCoupon.description}</p>
                    </div>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-[#B3261E] font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. PANNA50, READMORE"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-[#FAF3E6] border border-[#22291F]/20 rounded-lg px-3 py-1.5 text-xs font-mono outline-none uppercase"
                      />
                      <button
                        type="submit"
                        className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-[#B3261E] font-mono">{couponError}</p>
                    )}
                  </form>
                )}

                {/* Quick click suggestions */}
                {!appliedCoupon && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button 
                      type="button" 
                      onClick={() => setCouponInput('PANNA50')} 
                      className="text-[10px] font-mono bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded cursor-pointer"
                    >
                      PANNA50 (₹50 off)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setCouponInput('READMORE')} 
                      className="text-[10px] font-mono bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded cursor-pointer"
                    >
                      READMORE (15% off)
                    </button>
                  </div>
                )}
              </div>

              {/* Panna Coins Redemption */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#D6A419]/20 flex items-center justify-center text-[#8a6a10]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-[#22291F] block">
                      Panna Loyalty Coins
                    </span>
                    <span className="text-[10px] text-[#5B6355]">
                      You have {userCoins} coins (Use 100 coins for ₹20 OFF)
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  disabled={userCoins < 100}
                  checked={useCoins}
                  onChange={(e) => setUseCoins(e.target.checked)}
                  className="w-4 h-4 accent-[#2F6657] cursor-pointer"
                />
              </div>

              {/* Rural School Libraries Round-Up */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#B3261E]/10 flex items-center justify-center text-[#B3261E]">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-[#22291F] block">
                      Rural School Library Fund
                    </span>
                    <span className="text-[10px] text-[#5B6355]">
                      Round up ₹10 to gift books to village schools
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={donate}
                  onChange={(e) => setDonate(e.target.checked)}
                  className="w-4 h-4 accent-[#2F6657] cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Order Summary & Checkout Trigger */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#22291F]/15 bg-[#FFFDF8] space-y-3">
            <div className="space-y-1.5 text-xs font-mono text-[#5B6355]">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} books):</span>
                <span className="text-[#22291F] font-semibold">{formatINR(subtotal)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-[#2F6657]">
                  <span>Catalog MRP Savings:</span>
                  <span>-{formatINR(totalSavings)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#B3261E]">
                  <span>Promo Coupon ({appliedCoupon?.code}):</span>
                  <span>-{formatINR(couponDiscount)}</span>
                </div>
              )}
              {coinsDiscount > 0 && (
                <div className="flex justify-between text-[#8a6a10]">
                  <span>Coins Redeemed:</span>
                  <span>-{formatINR(coinsDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pan-India Delivery:</span>
                <span className={deliveryCharge === 0 ? 'text-[#2F6657] font-bold' : 'text-[#22291F]'}>
                  {deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}
                </span>
              </div>
              {donate && (
                <div className="flex justify-between text-stone-600">
                  <span>Rural Library Donation:</span>
                  <span>+{formatINR(donationAmount)}</span>
                </div>
              )}
              <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-[#22291F]">
                <span>To Pay:</span>
                <span className="font-mono text-base">{formatINR(total)}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout(appliedCoupon, useCoins, donate)}
              className="w-full bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md font-mono text-sm uppercase tracking-wider"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
