import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles, AlertCircle } from 'lucide-react';
import { Book } from '../types';
import { BookCard } from './BookCard';
import { formatINR } from '../utils/formatters';

interface CollectionSectionProps {
  books: Book[];
  allCategories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedCondition: string;
  onSelectCondition: (cond: string) => void;
  priceRange: number;
  onPriceChange: (price: number) => void;
  sortBy: 'featured' | 'price_low' | 'price_high' | 'rating' | 'discount';
  onSortChange: (sort: 'featured' | 'price_low' | 'price_high' | 'rating' | 'discount') => void;
  onlyInStock: boolean;
  onToggleInStock: () => void;
  onBookClick: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  isWishlisted: (bookId: string) => boolean;
  onToggleWishlist: (bookId: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  books,
  allCategories,
  selectedCategory,
  onSelectCategory,
  selectedCondition,
  onSelectCondition,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange,
  onlyInStock,
  onToggleInStock,
  onBookClick,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  searchQuery,
  onClearSearch
}) => {
  return (
    <section id="catalog-shelf" className="py-8 space-y-6">
      
      {/* Section Header & Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#22291F]/15 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2F6657] font-bold">
              The Living Catalog
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs font-mono text-[#5B6355]">
              {books.length} verified copies ready to ship
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#22291F]">
            Browse Second-Hand &amp; Fresh Copies
          </h2>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#5B6355]" />
          <span className="text-[#5B6355]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-[#FFFDF8] border border-[#22291F]/20 rounded-lg px-3 py-1.5 text-xs font-mono text-[#22291F] outline-none cursor-pointer focus:border-[#2F6657]"
          >
            <option value="featured">Featured / Editor Picks</option>
            <option value="discount">Biggest Discount (% Off)</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated by Readers</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-[#22291F] text-[#FAF3E6] border-[#22291F] font-bold shadow-xs'
                  : 'bg-[#FFFDF8] text-[#5B6355] border-[#22291F]/15 hover:border-stone-400 hover:text-[#22291F]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        
        {/* Condition Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#5B6355] font-bold">Condition:</span>
          {[
            { id: 'all', label: 'All Conditions' },
            { id: 'like_new', label: 'Like New' },
            { id: 'good', label: 'Good' },
            { id: 'acceptable', label: 'Acceptable' },
            { id: 'brand_new', label: 'Brand New' }
          ].map((cond) => (
            <button
              key={cond.id}
              onClick={() => onSelectCondition(cond.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] border transition-colors cursor-pointer ${
                selectedCondition === cond.id
                  ? 'bg-[#2F6657] text-white border-[#2F6657] font-bold'
                  : 'bg-stone-50 border-stone-200 text-[#5B6355] hover:bg-stone-100'
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>

        {/* Price Slider & In Stock toggle */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[#5B6355]">Max Price:</span>
            <input
              type="range"
              min={100}
              max={1200}
              step={50}
              value={priceRange}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="accent-[#2F6657] w-24 cursor-pointer"
            />
            <span className="font-bold text-[#22291F] min-w-12">{formatINR(priceRange)}</span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={onToggleInStock}
              className="accent-[#2F6657] cursor-pointer"
            />
            <span className="text-[#5B6355]">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedCategory !== 'All' || selectedCondition !== 'all' || priceRange < 1000 || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <span className="text-[#5B6355]">Active Filters:</span>
          {selectedCategory !== 'All' && (
            <span className="bg-stone-200 text-[#22291F] px-2 py-0.5 rounded-md flex items-center gap-1">
              Category: {selectedCategory}
              <button onClick={() => onSelectCategory('All')} className="cursor-pointer hover:text-red-600">×</button>
            </span>
          )}
          {selectedCondition !== 'all' && (
            <span className="bg-stone-200 text-[#22291F] px-2 py-0.5 rounded-md flex items-center gap-1">
              Condition: {selectedCondition.replace('_', ' ')}
              <button onClick={() => onSelectCondition('all')} className="cursor-pointer hover:text-red-600">×</button>
            </span>
          )}
          {priceRange < 1000 && (
            <span className="bg-stone-200 text-[#22291F] px-2 py-0.5 rounded-md flex items-center gap-1">
              Under {formatINR(priceRange)}
              <button onClick={() => onPriceChange(1000)} className="cursor-pointer hover:text-red-600">×</button>
            </span>
          )}
          {searchQuery && (
            <span className="bg-[#2F6657]/10 text-[#2F6657] px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
              Search: "{searchQuery}"
              <button onClick={onClearSearch} className="cursor-pointer hover:text-red-600">×</button>
            </span>
          )}
          <button
            onClick={() => {
              onSelectCategory('All');
              onSelectCondition('all');
              onPriceChange(1000);
              onClearSearch();
            }}
            className="text-[#B3261E] hover:underline cursor-pointer ml-2"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Book Grid */}
      {books.length === 0 ? (
        <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-2xl p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-[#B3261E] mx-auto opacity-70" />
          <h3 className="font-display font-bold text-lg text-[#22291F]">No books match these filters</h3>
          <p className="text-xs text-[#5B6355] max-w-sm mx-auto font-mono">
            Try adjusting your price ceiling, condition preference, or search terms to see available titles.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All');
              onSelectCondition('all');
              onPriceChange(1000);
              onClearSearch();
            }}
            className="bg-[#22291F] text-[#FAF3E6] px-4 py-2 rounded-lg text-xs font-mono font-bold hover:bg-[#2F6657] transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelectBook={() => onBookClick(book)}
              onAddToCart={() => onAddToCart(book)}
              isWishlisted={isWishlisted(book.id)}
              onToggleWishlist={() => onToggleWishlist(book.id)}
            />
          ))}
        </div>
      )}

    </section>
  );
};
