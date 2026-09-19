import React from 'react';
import { ArrowRight, Sparkles, BookOpenCheck } from 'lucide-react';
import { Book } from '../types';

interface HeroSectionProps {
  onBrowseClick: () => void;
  onSellClick: () => void;
  onSelectBook: (book: Book) => void;
  featuredBooks: Book[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBrowseClick,
  onSellClick,
  onSelectBook,
  featuredBooks
}) => {
  // Select the 4 hero display books
  const silentPatient = featuredBooks.find(b => b.title.includes('Silent Patient')) || featuredBooks[0];
  const sapiens = featuredBooks.find(b => b.title.includes('Sapiens')) || featuredBooks[1];
  const ikigai = featuredBooks.find(b => b.title.includes('Ikigai')) || featuredBooks[2];
  const atomicHabits = featuredBooks.find(b => b.title.includes('Atomic Habits')) || featuredBooks[3];

  return (
    <section className="pt-10 pb-14 border-b border-[#22291F]/10 overflow-hidden relative">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        
        {/* Left Editorial Copy */}
        <div>
          <div className="font-mono text-xs tracking-widest uppercase text-[#2F6657] flex items-center gap-2 mb-4 font-bold">
            <span className="w-5 h-[1.5px] bg-[#2F6657]"></span>
            <span>India's shelf, since 2015</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#22291F] leading-[1.08] tracking-tight mb-5">
            Every good book<br />
            deserves a <span className="text-[#B3261E] italic font-serif">second reader.</span>
          </h1>

          <p className="text-[#5B6355] text-base sm:text-lg leading-relaxed max-w-lg mb-8">
            Buy quality-checked used books and new titles at honest prices — or list your own shelf and get paid. Pan-India delivery, verified grading, zero exceptions.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <button
              onClick={onBrowseClick}
              className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] font-bold text-sm px-6 py-3.5 rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Browse Books</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onSellClick}
              className="bg-transparent hover:bg-[#2F6657]/10 text-[#22291F] border-2 border-[#22291F] font-bold text-sm px-6 py-3.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D6A419]" />
              <span>Sell Your Books</span>
            </button>
          </div>

          {/* Statistics Strip */}
          <div className="flex gap-8 border-t border-[#22291F]/15 pt-6">
            <div className="border-l-2 border-[#D6A419] pl-3.5">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#22291F] block">12L+</span>
              <span className="text-xs text-[#5B6355] font-medium">Books delivered</span>
            </div>
            <div className="border-l-2 border-[#D6A419] pl-3.5">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#22291F] block">4.8★</span>
              <span className="text-xs text-[#5B6355] font-medium">Reader rating</span>
            </div>
            <div className="border-l-2 border-[#D6A419] pl-3.5">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#22291F] block">90%</span>
              <span className="text-xs text-[#5B6355] font-medium">Off MRP, up to</span>
            </div>
          </div>
        </div>

        {/* Right Floating Shelf Visual with Stamps */}
        <div className="hidden sm:block relative h-[420px] w-full select-none">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 rounded-full bg-[#D6A419]/10 blur-3xl"></div>
          </div>

          {/* Book 1: Silent Patient */}
          {silentPatient && (
            <div
              onClick={() => onSelectBook(silentPatient)}
              className="absolute top-2 left-8 w-44 bg-[#FFFDF8] border border-[#22291F]/20 rounded-lg p-3 shadow-xl -rotate-6 hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 cursor-pointer z-10 group"
            >
              <div
                className="h-28 rounded flex items-end p-2 text-white font-display text-xs font-bold leading-tight shadow-inner"
                style={{ background: silentPatient.coverGradient }}
              >
                {silentPatient.title}
              </div>
              <p className="font-bold text-xs text-[#22291F] mt-2 line-clamp-1">{silentPatient.title}</p>
              <p className="text-[10px] text-[#5B6355] mb-2">{silentPatient.author}</p>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="font-bold text-xs text-[#22291F]">₹{silentPatient.price}</span>
                <span className="text-[10px] text-[#5B6355] line-through">₹{silentPatient.mrp}</span>
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-13 h-13 rounded-full border-2 border-[#2F6657] text-[#2F6657] bg-[#FAF3E6]/95 font-mono text-[8px] font-bold flex items-center justify-center text-center -rotate-12 leading-tight shadow-sm">
                GOOD<br />COND.
              </div>
            </div>
          )}

          {/* Book 2: Sapiens */}
          {sapiens && (
            <div
              onClick={() => onSelectBook(sapiens)}
              className="absolute top-10 left-52 w-44 bg-[#FFFDF8] border border-[#22291F]/20 rounded-lg p-3 shadow-xl rotate-4 hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 cursor-pointer z-12 group"
            >
              <div
                className="h-28 rounded flex items-end p-2 text-white font-display text-xs font-bold leading-tight shadow-inner"
                style={{ background: sapiens.coverGradient }}
              >
                {sapiens.title}
              </div>
              <p className="font-bold text-xs text-[#22291F] mt-2 line-clamp-1">{sapiens.title}</p>
              <p className="text-[10px] text-[#5B6355] mb-2">{sapiens.author}</p>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="font-bold text-xs text-[#22291F]">₹{sapiens.price}</span>
                <span className="text-[10px] text-[#5B6355] line-through">₹{sapiens.mrp}</span>
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-13 h-13 rounded-full border-2 border-[#B3261E] text-[#B3261E] bg-[#FAF3E6]/95 font-mono text-[8px] font-bold flex items-center justify-center text-center rotate-12 leading-tight shadow-sm">
                LIKE<br />NEW
              </div>
            </div>
          )}

          {/* Book 3: Ikigai */}
          {ikigai && (
            <div
              onClick={() => onSelectBook(ikigai)}
              className="absolute top-52 left-4 w-44 bg-[#FFFDF8] border border-[#22291F]/20 rounded-lg p-3 shadow-xl rotate-3 hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 cursor-pointer z-14 group"
            >
              <div
                className="h-28 rounded flex items-end p-2 text-white font-display text-xs font-bold leading-tight shadow-inner"
                style={{ background: ikigai.coverGradient }}
              >
                {ikigai.title}
              </div>
              <p className="font-bold text-xs text-[#22291F] mt-2 line-clamp-1">{ikigai.title}</p>
              <p className="text-[10px] text-[#5B6355] mb-2">{ikigai.author}</p>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="font-bold text-xs text-[#22291F]">₹{ikigai.price}</span>
                <span className="text-[10px] text-[#5B6355] line-through">₹{ikigai.mrp}</span>
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-13 h-13 rounded-full border-2 border-[#D6A419] text-[#8a6a10] bg-[#FAF3E6]/95 font-mono text-[8px] font-bold flex items-center justify-center text-center -rotate-6 leading-tight shadow-sm">
                99<br />STORE
              </div>
            </div>
          )}

          {/* Book 4: Atomic Habits */}
          {atomicHabits && (
            <div
              onClick={() => onSelectBook(atomicHabits)}
              className="absolute top-56 left-48 w-44 bg-[#FFFDF8] border border-[#22291F]/20 rounded-lg p-3 shadow-xl -rotate-5 hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300 cursor-pointer z-16 group"
            >
              <div
                className="h-28 rounded flex items-end p-2 text-white font-display text-xs font-bold leading-tight shadow-inner"
                style={{ background: atomicHabits.coverGradient }}
              >
                {atomicHabits.title}
              </div>
              <p className="font-bold text-xs text-[#22291F] mt-2 line-clamp-1">{atomicHabits.title}</p>
              <p className="text-[10px] text-[#5B6355] mb-2">{atomicHabits.author}</p>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="font-bold text-xs text-[#22291F]">₹{atomicHabits.price}</span>
                <span className="text-[10px] text-[#5B6355] line-through">₹{atomicHabits.mrp}</span>
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-13 h-13 rounded-full border-2 border-[#22291F] text-[#22291F] bg-[#FAF3E6]/95 font-mono text-[8px] font-bold flex items-center justify-center text-center rotate-6 leading-tight shadow-sm">
                MINT<br />NEW
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
