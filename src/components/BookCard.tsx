import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Book } from '../types';
import { formatINR, calculateDiscountPercent, getConditionLabel, getConditionClasses } from '../utils/formatters';

interface BookCardProps {
  book: Book;
  isWishlisted: boolean;
  onSelectBook: (book: Book) => void;
  onToggleWishlist: (bookId: string) => void;
  onAddToCart: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isWishlisted,
  onSelectBook,
  onToggleWishlist,
  onAddToCart
}) => {
  const discount = calculateDiscountPercent(book.price, book.mrp);
  const condClass = getConditionClasses(book.condition);

  return (
    <div 
      onClick={() => onSelectBook(book)}
      className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5 relative transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between cursor-pointer group"
    >
      {/* Top action: Wishlist */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(book.id);
        }}
        className={`absolute top-5 right-5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
          isWishlisted
            ? 'bg-[#B3261E] text-white'
            : 'bg-[#FAF3E6]/90 text-[#5B6355] hover:text-[#B3261E] hover:bg-white'
        }`}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
      </button>

      <div>
        {/* Book Cover Aesthetic */}
        <div 
          className="h-44 sm:h-48 rounded-lg mb-3.5 p-3 flex flex-col justify-between text-white relative shadow-xs overflow-hidden transition-transform duration-300 group-hover:scale-[1.01]"
          style={{ background: book.coverGradient }}
        >
          {/* Subtle Spine simulation stripe on the left */}
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/25 shadow-sm"></div>

          <div className="flex justify-between items-start z-10 pl-2">
            <span className="font-mono text-[9px] uppercase tracking-wider bg-black/30 backdrop-blur-xs px-1.5 py-0.5 rounded text-stone-200">
              {book.format}
            </span>
            {discount >= 50 && (
              <span className="font-mono text-[9px] font-bold uppercase bg-[#B3261E] text-white px-1.5 py-0.5 rounded shadow-xs">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="z-10 pl-2">
            <p className="font-display font-bold text-sm sm:text-base leading-tight drop-shadow-sm line-clamp-2">
              {book.title}
            </p>
            <p className="text-[11px] text-stone-200 opacity-90 truncate mt-0.5">
              {book.author}
            </p>
          </div>
        </div>

        {/* Condition Tag */}
        <div className="mb-2">
          <span className={`inline-block font-mono text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border ${condClass.bg} ${condClass.text} ${condClass.border}`}>
            {getConditionLabel(book.condition)}
          </span>
          <span className="text-[10px] text-[#5B6355] font-mono ml-2">
            {book.language}
          </span>
        </div>

        {/* Title and Author */}
        <h3 className="font-bold text-sm text-[#22291F] leading-snug line-clamp-1 mb-1 group-hover:text-[#2F6657] transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-[#5B6355] truncate mb-2">
          {book.author}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 text-xs text-[#5B6355] mb-3">
          <div className="flex items-center text-[#D6A419]">
            <Star className="w-3.5 h-3.5 fill-[#D6A419]" />
            <span className="font-bold ml-1 text-xs text-[#22291F]">{book.rating}</span>
          </div>
          <span className="text-stone-300">·</span>
          <span className="text-[11px]">({book.reviewCount})</span>
        </div>
      </div>

      {/* Pricing & Add to Cart Bottom Row */}
      <div className="pt-2 border-t border-[#22291F]/10 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-bold text-base text-[#22291F]">
              {formatINR(book.price)}
            </span>
            <span className="font-mono text-xs text-[#5B6355] line-through">
              {formatINR(book.mrp)}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#B3261E] font-semibold">
            Save {formatINR(book.mrp - book.price)}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(book);
          }}
          className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] p-2 rounded-lg transition-colors cursor-pointer"
          title="Add to Cart"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
