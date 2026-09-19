import React, { useState } from 'react';
import { 
  X, CheckCircle, MapPin, CreditCard, Wallet, Banknote, 
  QrCode, Plus, ShieldCheck, Truck, Sparkles, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Address, Coupon, Order } from '../types';
import { formatINR } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: Coupon | null;
  useCoins: boolean;
  donate: boolean;
  savedAddresses: Address[];
  walletBalance: number;
  onOrderPlaced: (order: Order) => void;
  firebaseUser?: any;
  onGoogleSignIn?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  useCoins,
  donate,
  savedAddresses,
  walletBalance,
  onOrderPlaced,
  firebaseUser,
  onGoogleSignIn
}) => {
  if (!isOpen) return null;

  const [selectedAddress, setSelectedAddress] = useState<Address>(savedAddresses[0] || {
    id: 'temp-addr',
    fullName: 'Raj Sinha',
    phone: '+91 98765 43210',
    streetAddress: 'Flat 402, Greenfield Apartments, Sector 14',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122001',
    tag: 'Home'
  });

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newTag, setNewTag] = useState<'Home' | 'Office' | 'Other'>('Home');

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet' | 'card' | 'cod' | 'netbanking'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeDeliveryThreshold = 499;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || appliedCoupon?.code === 'FREEDEL';
  const deliveryCharge = items.length === 0 ? 0 : (isFreeDelivery ? 0 : 49);

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      couponDiscount = appliedCoupon.value;
    } else if (appliedCoupon.discountType === 'percentage') {
      const calc = (subtotal * appliedCoupon.value) / 100;
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    }
  }

  const coinsDiscount = useCoins ? 20 : 0;
  const donationAmount = donate ? 10 : 0;
  const total = Math.max(0, subtotal - couponDiscount - coinsDiscount + deliveryCharge + donationAmount);

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newStreet || !newPincode) return;

    const created: Address = {
      id: `addr-${Date.now()}`,
      fullName: newFullName,
      phone: newPhone || '+91 98765 43210',
      streetAddress: newStreet,
      city: newCity || 'City',
      state: newState || 'State',
      pincode: newPincode,
      tag: newTag
    };

    setSelectedAddress(created);
    setIsAddingAddress(false);
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `PANNA-${Math.floor(10000 + Math.random() * 90000)}`,
        date: 'Today, Just now',
        items: [...items],
        subtotal,
        discount: couponDiscount,
        couponCode: appliedCoupon?.code,
        deliveryCharge,
        donation: donationAmount,
        coinsUsed: useCoins ? 100 : 0,
        coinsValue: coinsDiscount,
        total,
        shippingAddress: selectedAddress,
        paymentMethod,
        status: 'Order Placed',
        estimatedDelivery: '3-4 Business Days',
        trackingNumber: `EXP-IN-${Math.floor(100000 + Math.random() * 900000)}`,
        canReturnUntil: '7 Days after delivery'
      };

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback gracefully if canvas context restricted
      }

      setOrderComplete(newOrder);
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#FAF3E6] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#22291F]/20 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#22291F]/15 bg-[#FFFDF8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2F6657]" />
            <h2 className="font-display font-bold text-lg text-[#22291F]">
              {orderComplete ? 'Order Confirmed!' : 'Secure Checkout'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-[#5B6355] hover:text-[#22291F] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {orderComplete ? (
            /* Order Success Receipt */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#2F6657]/15 text-[#2F6657] mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#2F6657] font-bold">
                  Order Successfully Placed
                </span>
                <h3 className="font-display font-bold text-2xl text-[#22291F] mt-1">
                  Thank you for reading with Panna!
                </h3>
                <p className="text-xs font-mono text-[#5B6355] mt-1">
                  Order ID: <strong className="text-[#22291F]">{orderComplete.id}</strong>
                </p>
              </div>

              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 text-left max-w-md mx-auto font-mono text-xs space-y-2">
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-[#5B6355]">Tracking ID:</span>
                  <span className="font-bold text-[#22291F]">{orderComplete.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6355]">Delivering To:</span>
                  <span className="text-right text-[#22291F] font-semibold">{orderComplete.shippingAddress.fullName}, {orderComplete.shippingAddress.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6355]">Payment Mode:</span>
                  <span className="font-bold text-[#22291F] uppercase">{orderComplete.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-stone-200 text-[#22291F]">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#2F6657]">{formatINR(orderComplete.total)}</span>
                </div>
              </div>

              <p className="text-xs text-[#5B6355] max-w-sm mx-auto">
                We are packing your quality-checked books. SMS &amp; WhatsApp updates with tracking link have been dispatched.
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Order securely saved to Firestore Cloud Database</span>
              </div>

              <button
                onClick={onClose}
                className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Back to Bookstore
              </button>
            </div>
          ) : (
            <>
              {/* Account / Cloud Sync Banner */}
              {firebaseUser ? (
                <div className="bg-[#2F6657]/10 border border-[#2F6657]/20 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2.5">
                    {firebaseUser.photoURL ? (
                      <img
                        src={firebaseUser.photoURL}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-white"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#2F6657] text-white flex items-center justify-center font-bold text-xs">
                        {(firebaseUser.displayName || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="text-[#22291F] font-bold block">
                        Ordering as {firebaseUser.displayName || 'Panna Reader'}
                      </span>
                      <span className="text-[#5B6355] text-[10px]">{firebaseUser.email}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-[#2F6657] border border-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold">
                    Firestore Cloud
                  </span>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-stone-700 text-[11px]">
                      Sign in with Google to sync orders to your Cloud account
                    </span>
                  </div>
                  {onGoogleSignIn && (
                    <button
                      type="button"
                      onClick={onGoogleSignIn}
                      className="shrink-0 bg-white border border-stone-300 hover:border-[#2F6657] text-[#22291F] px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              )}

              {/* Step 1: Shipping Address Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#22291F] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#2F6657]" /> Step 1: Delivery Address
                  </h3>
                  {!isAddingAddress && (
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="text-xs font-mono font-bold text-[#2F6657] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New Address
                    </button>
                  )}
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleSaveNewAddress} className="bg-[#FFFDF8] border-2 border-[#2F6657]/30 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-xs text-[#22291F]">New Shipping Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        className="bg-[#FAF3E6] border border-stone-300 rounded-lg p-2 text-xs outline-none"
                      />
                      <input
                        type="text"
                        required
                        placeholder="10-digit Mobile Number"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="bg-[#FAF3E6] border border-stone-300 rounded-lg p-2 text-xs outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Flat, House no., Building, Street"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full bg-[#FAF3E6] border border-stone-300 rounded-lg p-2 text-xs outline-none"
                    />
                    <div className="grid grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="bg-[#FAF3E6] border border-stone-300 rounded-lg p-2 text-xs outline-none"
                      />
                      <input
                        type="text"
                        required
                        placeholder="State"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="bg-[#FAF3E6] border border-stone-300 rounded-lg p-2 text-xs outline-none"
                      />
                      <input
                        type="text"
                        required
                        placeholder="6-digit Pincode"
                        maxLength={6}
                        value={newPincode}
                        onChange={(e) => setNewPincode(e.target.value)}
                        className="bg-[#FAF3E6] border border-stone-300 rounded-lg p-2 text-xs outline-none font-mono"
                      />
                    </div>
                    <div className="flex gap-2 text-xs">
                      {(['Home', 'Office', 'Other'] as const).map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setNewTag(t)}
                          className={`px-3 py-1 rounded-md border font-mono text-xs cursor-pointer ${
                            newTag === t ? 'bg-[#2F6657] text-white border-[#2F6657]' : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="bg-[#2F6657] text-white px-4 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer"
                      >
                        Save &amp; Deliver Here
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="bg-stone-200 text-stone-700 px-4 py-2 rounded-lg text-xs font-mono cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddress.id === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddress(addr)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#2F6657] bg-[#2F6657]/10 ring-2 ring-[#2F6657]/20 shadow-xs'
                              : 'border-[#22291F]/15 bg-[#FFFDF8] hover:border-stone-400'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xs text-[#22291F]">{addr.fullName}</span>
                            <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-stone-200 text-stone-700 font-bold">
                              {addr.tag}
                            </span>
                          </div>
                          <p className="text-xs text-[#5B6355] line-clamp-2">{addr.streetAddress}</p>
                          <p className="text-xs font-mono text-stone-500 mt-1">
                            {addr.city}, {addr.pincode}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 2: Payment Mode Selection */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#22291F] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#2F6657]" /> Step 2: Choose Payment Method
                </h3>

                <div className="space-y-2">
                  {/* UPI Option */}
                  <label 
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'upi' ? 'border-[#2F6657] bg-[#2F6657]/10 ring-2 ring-[#2F6657]/20' : 'border-[#22291F]/15 bg-[#FFFDF8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="accent-[#2F6657]"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#22291F] block flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-[#2F6657]" /> UPI (Google Pay, PhonePe, Paytm, QR)
                        </span>
                        <span className="text-[10px] text-[#5B6355]">Instant zero-fee payment</span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] font-bold text-[#2F6657] bg-[#2F6657]/10 px-2 py-0.5 rounded">
                      FASTEST
                    </span>
                  </label>

                  {/* Panna BookPay Wallet */}
                  <label 
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'wallet' ? 'border-[#2F6657] bg-[#2F6657]/10 ring-2 ring-[#2F6657]/20' : 'border-[#22291F]/15 bg-[#FFFDF8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'wallet'}
                        onChange={() => setPaymentMethod('wallet')}
                        className="accent-[#2F6657]"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#22291F] block flex items-center gap-1.5">
                          <Wallet className="w-4 h-4 text-[#D6A419]" /> Panna BookPay Wallet
                        </span>
                        <span className="text-[10px] text-[#5B6355]">
                          Available balance: {formatINR(walletBalance)}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] font-bold text-[#8a6a10] bg-[#D6A419]/20 px-2 py-0.5 rounded">
                      1-CLICK PAY
                    </span>
                  </label>

                  {/* Card Payment */}
                  <label 
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'card' ? 'border-[#2F6657] bg-[#2F6657]/10 ring-2 ring-[#2F6657]/20' : 'border-[#22291F]/15 bg-[#FFFDF8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-[#2F6657]"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#22291F] block">
                          Credit / Debit Cards
                        </span>
                        <span className="text-[10px] text-[#5B6355]">Visa, MasterCard, RuPay, Amex</span>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label 
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'cod' ? 'border-[#2F6657] bg-[#2F6657]/10 ring-2 ring-[#2F6657]/20' : 'border-[#22291F]/15 bg-[#FFFDF8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#2F6657]"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#22291F] block flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-[#8a6a10]" /> Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] text-[#5B6355]">Pay cash at your doorstep</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary Confirmation */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 font-mono text-xs space-y-2">
                <div className="flex justify-between text-[#5B6355]">
                  <span>Items Subtotal:</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#B3261E]">
                    <span>Coupon Discount:</span>
                    <span>-{formatINR(couponDiscount)}</span>
                  </div>
                )}
                {coinsDiscount > 0 && (
                  <div className="flex justify-between text-[#8a6a10]">
                    <span>Coins Redeemed:</span>
                    <span>-{formatINR(coinsDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5B6355]">
                  <span>Delivery Charge:</span>
                  <span>{deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}</span>
                </div>
                {donationAmount > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Rural Library Donation:</span>
                    <span>+{formatINR(donationAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-stone-200 text-[#22291F]">
                  <span>Grand Total:</span>
                  <span className="text-[#2F6657]">{formatINR(total)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-[#2F6657] hover:bg-[#1F4E42] text-[#FAF3E6] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md font-mono text-sm uppercase tracking-wider disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order with Panna...</span>
                ) : (
                  <>
                    <span>Place Order · {formatINR(total)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
