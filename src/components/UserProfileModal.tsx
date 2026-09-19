import React, { useState } from 'react';
import { 
  X, User, Wallet, Sparkles, BookOpen, MapPin, 
  Package, Plus, Heart, ArrowRight, Shield, Check, LogOut, Cloud
} from 'lucide-react';
import { UserProfile, Order, SellRequest, Book, Address } from '../types';
import { formatINR } from '../utils/formatters';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  orders: Order[];
  sellRequests: SellRequest[];
  wishlistBooks: Book[];
  onTopUpWallet: (amount: number) => void;
  onUpdateGoal: (completed: number) => void;
  onRemoveFromWishlist: (bookId: string) => void;
  onAddToCartFromWishlist: (book: Book) => void;
  onOpenTrackingForOrder: (order: Order) => void;
  onOpenAdmin: () => void;
  firebaseUser?: any;
  onGoogleSignIn?: () => void;
  onSignOut?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  sellRequests,
  wishlistBooks,
  onTopUpWallet,
  onUpdateGoal,
  onRemoveFromWishlist,
  onAddToCartFromWishlist,
  onOpenTrackingForOrder,
  onOpenAdmin,
  firebaseUser,
  onGoogleSignIn,
  onSignOut
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'wallet' | 'orders' | 'sell_requests' | 'wishlist'>('profile');
  const [topUpAmount, setTopUpAmount] = useState(500);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const goalPercent = Math.min(100, Math.round((user.readingGoal.completed / user.readingGoal.target) * 100));

  const handleRecharge = () => {
    onTopUpWallet(topUpAmount);
    setTopUpSuccess(true);
    setTimeout(() => setTopUpSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#FAF3E6] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#22291F]/20 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#22291F]/15 bg-[#FFFDF8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {firebaseUser?.photoURL ? (
              <img
                src={firebaseUser.photoURL}
                alt={user.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#2F6657] shadow-xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#2F6657] text-[#FAF3E6] font-display font-bold text-lg flex items-center justify-center shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-[#22291F] leading-tight">
                  {user.name}
                </h2>
                {firebaseUser ? (
                  <span className="bg-emerald-100 text-[#2F6657] border border-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Google Account
                  </span>
                ) : (
                  <span className="bg-stone-100 text-[#5B6355] border border-stone-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
                    Guest Mode
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-[#5B6355]">
                {user.email || 'reader@panna.in'} · Verified Reader
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {firebaseUser ? (
              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-mono font-bold transition-colors cursor-pointer"
                title="Sign out of Google account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={onGoogleSignIn}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#22291F] text-[#FAF3E6] hover:bg-[#2F6657] text-xs font-mono font-bold transition-colors cursor-pointer shadow-xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Connect Google</span>
              </button>
            )}

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-[#5B6355] hover:text-[#22291F] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#22291F]/10 px-6 bg-[#FAF3E6] overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'profile' ? 'border-[#2F6657] text-[#2F6657]' : 'border-transparent text-[#5B6355]'
            }`}
          >
            Profile &amp; Goals
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'wallet' ? 'border-[#2F6657] text-[#2F6657]' : 'border-transparent text-[#5B6355]'
            }`}
          >
            BookPay Wallet &amp; Coins
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'orders' ? 'border-[#2F6657] text-[#2F6657]' : 'border-transparent text-[#5B6355]'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('sell_requests')}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'sell_requests' ? 'border-[#2F6657] text-[#2F6657]' : 'border-transparent text-[#5B6355]'
            }`}
          >
            Sell Requests ({sellRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'wishlist' ? 'border-[#2F6657] text-[#2F6657]' : 'border-transparent text-[#5B6355]'
            }`}
          >
            Wishlist ({wishlistBooks.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB: Profile & Reading Goals */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Reading Goal 2026 Challenge Card */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#2F6657]" />
                    <h3 className="font-display font-bold text-base text-[#22291F]">
                      2026 Reading Challenge
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#2F6657]">
                    {user.readingGoal.completed} of {user.readingGoal.target} books read
                  </span>
                </div>

                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#2F6657] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${goalPercent}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[#5B6355] pt-1">
                  <span>{goalPercent}% completed</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateGoal(Math.max(0, user.readingGoal.completed - 1))}
                      className="px-2 py-0.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold cursor-pointer"
                    >
                      -1 Book
                    </button>
                    <button
                      onClick={() => onUpdateGoal(user.readingGoal.completed + 1)}
                      className="px-2 py-0.5 rounded bg-[#2F6657] hover:bg-[#1F4E42] text-white font-bold cursor-pointer"
                    >
                      +1 Finished Book
                    </button>
                  </div>
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#22291F] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2F6657]" /> Saved Addresses
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.savedAddresses.map(addr => (
                    <div key={addr.id} className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5 text-xs font-mono">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#22291F]">{addr.fullName}</span>
                        <span className="bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded text-[10px] font-bold">
                          {addr.tag}
                        </span>
                      </div>
                      <p className="text-[#5B6355] mt-0.5">{addr.streetAddress}</p>
                      <p className="text-stone-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-stone-400 text-[10px] mt-1">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Firebase Cloud Sync Card */}
              <div className="bg-[#2F6657]/10 border border-[#2F6657]/20 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-[#2F6657]" />
                    <span className="font-mono text-xs font-bold text-[#2F6657] uppercase tracking-wider">
                      Firebase Cloud Storage &amp; Auth
                    </span>
                  </div>
                  <span className="bg-[#2F6657] text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                    Firestore Live
                  </span>
                </div>
                <p className="text-xs text-[#5B6355] leading-relaxed">
                  Your reading challenges, saved wishlist items ({wishlistBooks.length}), order history ({orders.length}), and BookPay wallet balance ({formatINR(user.walletBalance)}) are securely stored in Google Cloud Firestore.
                </p>
                {firebaseUser ? (
                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-[#2F6657]">
                    <span>Account: <strong className="text-[#22291F]">{firebaseUser.email}</strong></span>
                    <span className="text-stone-400">UID: {firebaseUser.uid.slice(0, 8)}...</span>
                  </div>
                ) : (
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#5B6355]">Sign in with Google to sync across all your devices.</span>
                    <button
                      onClick={onGoogleSignIn}
                      className="text-xs font-mono font-bold text-[#2F6657] hover:underline cursor-pointer"
                    >
                      Sign In Now →
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Admin switch banner */}
              <div className="bg-[#22291F] text-[#FAF3E6] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-[#D6A419]" />
                  <div>
                    <h5 className="font-bold text-xs">Panna Admin Console</h5>
                    <p className="text-[11px] text-[#FAF3E6]/70">Manage inventory, approve sell pickups &amp; catalog</p>
                  </div>
                </div>
                <button
                  onClick={onOpenAdmin}
                  className="bg-[#FAF3E6] text-[#22291F] hover:bg-[#D6A419] px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Open Admin
                </button>
              </div>
            </div>
          )}

          {/* TAB: BookPay Wallet & Panna Coins */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* BookPay Wallet Balance */}
                <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#5B6355]">Panna BookPay Wallet</span>
                    <Wallet className="w-5 h-5 text-[#2F6657]" />
                  </div>
                  <div className="font-mono font-bold text-3xl text-[#22291F]">
                    {formatINR(user.walletBalance)}
                  </div>
                  <p className="text-[11px] text-[#5B6355]">
                    Usable on any book order. Instant 1-click checkout.
                  </p>
                </div>

                {/* Loyalty Coins Balance */}
                <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#5B6355]">Panna Loyalty Coins</span>
                    <Sparkles className="w-5 h-5 text-[#D6A419]" />
                  </div>
                  <div className="font-mono font-bold text-3xl text-[#D6A419]">
                    {user.pannaCoins} Coins
                  </div>
                  <p className="text-[11px] text-[#5B6355]">
                    Earn 10 coins per ₹100 spent. Redeem 100 coins for ₹20 discount at checkout.
                  </p>
                </div>
              </div>

              {/* Wallet Top-up */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-base text-[#22291F]">
                      Recharge BookPay Wallet
                    </h4>
                    <p className="text-xs text-[#5B6355]">
                      Get +10% extra bonus cashback on all prepaid recharges!
                    </p>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#2F6657] bg-[#2F6657]/10 px-2 py-0.5 rounded">
                    +10% BONUS
                  </span>
                </div>

                <div className="flex gap-2">
                  {[200, 500, 1000, 2000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold border transition-colors cursor-pointer ${
                        topUpAmount === amt
                          ? 'bg-[#2F6657] text-white border-[#2F6657]'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      +{formatINR(amt)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs font-mono text-[#5B6355]">
                    You get: <strong className="text-[#2F6657]">{formatINR(topUpAmount + Math.round(topUpAmount * 0.1))}</strong> (includes ₹{Math.round(topUpAmount * 0.1)} bonus)
                  </div>
                  <button
                    onClick={handleRecharge}
                    className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] px-5 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    Instant Top-Up
                  </button>
                </div>

                {topUpSuccess && (
                  <p className="text-xs font-mono text-[#2F6657] font-bold">
                    ✓ Wallet successfully topped up!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB: Orders History */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <p className="text-xs text-stone-500 italic">No orders placed yet.</p>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#22291F]">{order.id}</span>
                        <span className="font-mono text-[11px] text-stone-400 ml-2">Placed: {order.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#2F6657]/10 text-[#2F6657]">
                          {order.status}
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            onOpenTrackingForOrder(order);
                          }}
                          className="text-xs font-mono font-bold text-[#22291F] hover:text-[#2F6657] flex items-center gap-1 underline cursor-pointer"
                        >
                          Track Package
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-[#5B6355]">
                          <span>{item.book.title} (x{item.quantity})</span>
                          <span className="font-mono font-semibold text-[#22291F]">{formatINR(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-stone-100 pt-2 flex justify-between font-mono text-xs font-bold text-[#22291F]">
                      <span>Total Paid:</span>
                      <span className="text-[#2F6657]">{formatINR(order.total)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Sell Requests History */}
          {activeTab === 'sell_requests' && (
            <div className="space-y-3">
              {sellRequests.length === 0 ? (
                <p className="text-xs text-stone-500 italic">No sell requests submitted yet.</p>
              ) : (
                sellRequests.map(req => (
                  <div key={req.id} className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 space-y-3 shadow-xs font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <div>
                        <span className="font-bold text-[#22291F]">{req.id}</span>
                        <span className="text-stone-400 ml-2">Date: {req.date}</span>
                      </div>
                      <span className="bg-[#D6A419]/20 text-[#8a6a10] px-2 py-0.5 rounded font-bold text-[10px]">
                        {req.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {req.books.map((b, i) => (
                        <div key={i} className="flex justify-between text-[#5B6355]">
                          <span>{b.title} ({b.condition})</span>
                          <span>Quote: {formatINR(b.estimatedQuote)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-stone-100 pt-2 flex justify-between font-bold">
                      <span>Total Payout:</span>
                      <span className="text-[#2F6657]">{formatINR(req.totalQuote)} ({req.payoutMode})</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-3">
              {wishlistBooks.length === 0 ? (
                <p className="text-xs text-stone-500 italic">Your wishlist is empty. Browse the catalog to add books you love!</p>
              ) : (
                wishlistBooks.map(book => (
                  <div key={book.id} className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-10 h-14 rounded p-1 flex items-end text-white font-display text-[8px] font-bold shrink-0"
                        style={{ background: book.coverGradient }}
                      >
                        {book.title.slice(0, 10)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-[#22291F] truncate">{book.title}</p>
                        <p className="text-[11px] text-[#5B6355] truncate">{book.author}</p>
                        <span className="font-mono font-bold text-xs text-[#22291F]">{formatINR(book.price)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onAddToCartFromWishlist(book)}
                        className="bg-[#2F6657] hover:bg-[#1F4E42] text-white px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(book.id)}
                        className="text-stone-400 hover:text-[#B3261E] p-1 cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
