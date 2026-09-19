import React from 'react';
import { BookOpen, Sparkles, ShoppingBag, User, Truck } from 'lucide-react';

interface BottomNavProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSell: () => void;
  onOpenProfile: () => void;
  onOpenTracking: () => void;
  onScrollToCatalog: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  cartCount,
  onOpenCart,
  onOpenSell,
  onOpenProfile,
  onOpenTracking,
  onScrollToCatalog
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF3E6] border-t border-[#22291F]/15 px-3 py-2 flex items-center justify-around shadow-2xl">
      
      <button
        onClick={onScrollToCatalog}
        className="flex flex-col items-center gap-1 text-[#22291F] hover:text-[#2F6657] font-mono text-[10px] cursor-pointer"
      >
        <BookOpen className="w-5 h-5" />
        <span>Explore</span>
      </button>

      <button
        onClick={onOpenSell}
        className="flex flex-col items-center gap-1 text-[#2F6657] font-mono text-[10px] font-bold cursor-pointer"
      >
        <Sparkles className="w-5 h-5 text-[#D6A419]" />
        <span>Sell Dump</span>
      </button>

      <button
        onClick={onOpenTracking}
        className="flex flex-col items-center gap-1 text-[#5B6355] hover:text-[#22291F] font-mono text-[10px] cursor-pointer"
      >
        <Truck className="w-5 h-5" />
        <span>Track</span>
      </button>

      <button
        onClick={onOpenCart}
        className="flex flex-col items-center gap-1 text-[#22291F] hover:text-[#2F6657] font-mono text-[10px] relative cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1 right-2 bg-[#B3261E] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <button
        onClick={onOpenProfile}
        className="flex flex-col items-center gap-1 text-[#5B6355] hover:text-[#22291F] font-mono text-[10px] cursor-pointer"
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </button>

    </div>
  );
};
