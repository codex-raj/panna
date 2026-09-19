import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, User, ShoppingBag, BookOpen, Shield, Sparkles, X } from 'lucide-react';
import { Book } from '../types';

interface HeaderProps {
  books: Book[];
  cartCount: number;
  wishlistCount: number;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectBook: (book: Book) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSell: () => void;
  onOpenAccount: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  firebaseUser?: any;
  onGoogleSignIn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  books,
  cartCount,
  wishlistCount,
  selectedCategory,
  onSelectCategory,
  onSelectBook,
  onOpenCart,
  onOpenWishlist,
  onOpenSell,
  onOpenAccount,
  onOpenTracking,
  onOpenAdmin,
  firebaseUser,
  onGoogleSignIn
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim() === ''
    ? []
    : books.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.isbn.includes(searchQuery) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);

  const categories = [
    'All',
    'Under ₹99',
    '50% Off Store',
    'Fiction',
    'Non-Fiction',
    "Children's",
    'Textbooks',
    'Comics & Manga',
    'Self-Help',
    'Hindi Books',
    'Bestsellers'
  ];

  return (
    <>
      {/* Top Banner Ticker */}
      <div className="bg-[#22291F] text-[#FAF3E6] text-xs font-mono py-1.5 px-4 overflow-hidden border-b border-[#22291F]">
        <div className="max-w-[1180px] mx-auto flex justify-between items-center">
          <div className="overflow-hidden whitespace-nowrap flex-1 mr-4">
            <div className="animate-ticker text-xs tracking-wider flex items-center gap-6">
              <span>✦ FREE DELIVERY ABOVE ₹499 PAN-INDIA</span>
              <span className="text-[#D6A419]">·</span>
              <span>CASH ON DELIVERY AVAILABLE</span>
              <span className="text-[#D6A419]">·</span>
              <span>EVERY USED BOOK QUALITY-CHECKED</span>
              <span className="text-[#D6A419]">·</span>
              <span>7-DAY EASY REPLACEMENT PROMISE</span>
              <span className="text-[#D6A419]">·</span>
              <span>SELL YOUR BOOKS FOR INSTANT WALLET CASH</span>
              <span className="text-[#D6A419]">·</span>
              <span>✦ FREE DELIVERY ABOVE ₹499 PAN-INDIA</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs text-[#FAF3E6]/80">
            <span className="flex items-center gap-1.5 text-[11px] text-[#FAF3E6]/70 bg-white/5 px-2 py-0.5 rounded font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Firestore Synced
            </span>
            <span>·</span>
            <button
              onClick={onOpenTracking}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              Track Order
            </button>
            <span>·</span>
            <button
              onClick={onOpenSell}
              className="text-[#D6A419] hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Sell Books
            </button>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] bg-white/10 px-2 py-0.5 rounded"
            >
              <Shield className="w-3 h-3 text-[#D6A419]" /> Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-30 bg-[#FAF3E6]/95 backdrop-blur-md border-b border-[#22291F]/15">
        <div className="max-w-[1180px] mx-auto px-6 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={() => onSelectCategory('All')} 
            className="flex items-center gap-2.5 shrink-0 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded bg-[#2F6657] relative shadow-[3px_0_0_#1F4E42] flex items-center justify-center transition-transform group-hover:scale-105">
              <BookOpen className="w-5 h-5 text-[#FAF3E6]" />
            </div>
            <div>
              <span className="font-display text-2xl font-bold tracking-tight text-[#22291F]">
                Pann<em className="text-[#B3261E] not-italic">a</em>
              </span>
              <span className="block text-[9.5px] font-mono tracking-widest text-[#5B6355] -mt-1 uppercase">
                Books &amp; Shelf
              </span>
            </div>
          </button>

          {/* Search Bar with Autocomplete Dropdown */}
          <div ref={searchRef} className="flex-1 max-w-[500px] relative hidden md:block">
            <div className="flex items-center gap-2.5 bg-[#FFFDF8] border border-[#22291F]/20 rounded-lg px-3.5 py-2 focus-within:border-[#2F6657] focus-within:ring-2 focus-within:ring-[#2F6657]/15 transition-all">
              <Search className="w-4 h-4 text-[#5B6355]" />
              <input
                type="text"
                placeholder="Search by title, author, category or ISBN..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full text-sm bg-transparent outline-none text-[#22291F] placeholder:text-[#5B6355]/60"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Results Panel */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFDF8] border border-[#22291F]/20 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-2 border-b border-stone-100 flex items-center justify-between text-xs text-[#5B6355] font-mono px-3">
                  <span>Found {searchResults.length} books</span>
                  <span className="text-[10px]">Instant suggestions</span>
                </div>
                <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                  {searchResults.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onSelectBook(b);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full p-2.5 flex items-center gap-3 text-left hover:bg-[#FAF3E6] transition-colors cursor-pointer"
                    >
                      <div 
                        className="w-10 h-13 rounded shadow-xs flex items-end p-1 text-[8px] font-display text-white font-bold shrink-0"
                        style={{ background: b.coverGradient }}
                      >
                        {b.title.slice(0, 10)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#22291F] truncate">{b.title}</p>
                        <p className="text-xs text-[#5B6355] truncate">{b.author} · <span className="capitalize">{b.format}</span></p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-[#22291F]">₹{b.price}</div>
                        <div className="text-[10px] font-mono text-stone-400 line-through">₹{b.mrp}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Quick Sell Button */}
            <button
              onClick={onOpenSell}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2F6657] text-[#2F6657] hover:bg-[#2F6657] hover:text-[#FAF3E6] transition-all text-xs font-bold font-mono cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sell Books
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="flex flex-col items-center text-xs font-medium text-[#22291F] hover:text-[#B3261E] transition-colors relative cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline text-[11px] mt-0.5">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B3261E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account / Google Sign-In */}
            {firebaseUser ? (
              <button
                onClick={onOpenAccount}
                className="flex items-center gap-1.5 p-1 pl-1.5 pr-2.5 rounded-full bg-[#2F6657]/10 hover:bg-[#2F6657]/20 border border-[#2F6657]/25 transition-all cursor-pointer shadow-2xs"
                title={`Signed in as ${firebaseUser.displayName || firebaseUser.email}`}
              >
                {firebaseUser.photoURL ? (
                  <img
                    src={firebaseUser.photoURL}
                    alt={firebaseUser.displayName || 'Avatar'}
                    className="w-6 h-6 rounded-full object-cover border border-white"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#2F6657] text-[#FAF3E6] flex items-center justify-center text-xs font-bold font-display">
                    {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-[#2F6657] max-w-[85px] truncate hidden sm:inline">
                  {firebaseUser.displayName?.split(' ')[0] || 'Account'}
                </span>
              </button>
            ) : (
              <button
                onClick={onGoogleSignIn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 text-[#22291F] border border-[#22291F]/20 text-xs font-semibold shadow-xs transition-all cursor-pointer hover:border-[#2F6657]"
                title="Sign in with Google"
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
                <span className="hidden sm:inline">Google Sign In</span>
              </button>
            )}

            {/* Cart Pill */}
            <button
              onClick={onOpenCart}
              className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] rounded-full px-3.5 sm:px-4 py-2 flex items-center gap-2 text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              <span className="bg-[#FAF3E6] text-[#22291F] text-xs px-1.5 py-0.2 rounded-full font-mono">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <nav className="border-t border-[#22291F]/10 bg-[#FAF3E6]">
          <div className="max-w-[1180px] mx-auto px-6 flex items-center gap-2 sm:gap-6 h-11 overflow-x-auto no-scrollbar">
            {categories.map(cat => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`text-xs font-semibold whitespace-nowrap px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2F6657] text-[#FAF3E6]'
                      : 'text-[#5B6355] hover:text-[#B3261E]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </nav>
      </header>
    </>
  );
};
