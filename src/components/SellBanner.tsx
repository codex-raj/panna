import React from 'react';
import { ArrowRight, Sparkles, Truck, Wallet, ShieldCheck, BookOpen } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface SellBannerProps {
  onOpenSellModal: () => void;
}

export const SellBanner: React.FC<SellBannerProps> = ({ onOpenSellModal }) => {
  return (
    <section className="py-8">
      <div className="bg-[#2F6657] text-[#FAF3E6] rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-[#22291F]/20">
        
        {/* Subtle background decoration */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-[#FAF3E6]/5 pointer-events-none blur-2xl"></div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1.1fr] gap-8 items-center relative z-10">
          
          {/* Left Column: Narrative & Steps */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#D6A419] font-bold bg-black/20 px-2.5 py-1 rounded-full border border-[#D6A419]/30">
                Book Dump · Sell Back
              </span>
              <span className="text-xs font-mono text-[#FAF3E6]/80 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D6A419]" /> Doorstep Pickup in 48 Cities
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold leading-snug">
              Your bookshelf has room for one more story. Let the old ones earn their keep.
            </h2>

            <p className="text-sm sm:text-base text-[#FAF3E6]/85 max-w-xl leading-relaxed">
              Clear out the novels, textbooks, and memoirs you’ve already turned the last page on. 
              We inspect them, price them fairly, and find them a home with a reader who needs them.
            </p>

            {/* 3 Step Pill Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-black/15 backdrop-blur-xs border border-white/10 rounded-xl p-3.5">
                <span className="font-mono text-xs font-bold text-[#D6A419] block mb-1">01. ADD TITLES</span>
                <p className="text-xs text-[#FAF3E6]/80 leading-normal">
                  Search by title or ISBN and get an instant valuation quote.
                </p>
              </div>

              <div className="bg-black/15 backdrop-blur-xs border border-white/10 rounded-xl p-3.5">
                <span className="font-mono text-xs font-bold text-[#D6A419] block mb-1">02. FREE PICKUP</span>
                <p className="text-xs text-[#FAF3E6]/80 leading-normal">
                  Our rider collects directly from your door. No shipping boxes needed.
                </p>
              </div>

              <div className="bg-black/15 backdrop-blur-xs border border-white/10 rounded-xl p-3.5">
                <span className="font-mono text-xs font-bold text-[#D6A419] block mb-1">03. INSTANT PAY</span>
                <p className="text-xs text-[#FAF3E6]/80 leading-normal">
                  Receive cash via UPI or get +15% extra bonus in BookPay wallet.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenSellModal}
                className="bg-[#FAF3E6] hover:bg-[#D6A419] text-[#22291F] font-bold py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Start a Sell Batch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Live Quote Simulator Preview Card */}
          <div className="bg-[#FAF3E6] text-[#22291F] rounded-xl p-5 sm:p-6 shadow-2xl border border-[#22291F]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-[#22291F]/15 pb-3">
              <div>
                <span className="font-mono text-xs text-[#5B6355] block">SAMPLE VALUATION</span>
                <h4 className="font-display font-bold text-base text-[#22291F]">Sample 3-Book Stack</h4>
              </div>
              <span className="font-mono text-xs font-bold bg-[#2F6657]/10 text-[#2F6657] px-2 py-1 rounded">
                Verified Formula
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center bg-[#FFFDF8] p-2 rounded-lg border border-[#22291F]/10">
                <span className="text-[#5B6355]">The White Tiger (Paperback, Good)</span>
                <span className="font-bold text-[#22291F]">₹135</span>
              </div>
              <div className="flex justify-between items-center bg-[#FFFDF8] p-2 rounded-lg border border-[#22291F]/10">
                <span className="text-[#5B6355]">Atomic Habits (Hardcover, Like New)</span>
                <span className="font-bold text-[#22291F]">₹210</span>
              </div>
              <div className="flex justify-between items-center bg-[#FFFDF8] p-2 rounded-lg border border-[#22291F]/10">
                <span className="text-[#5B6355]">Sapiens (Paperback, Acceptable)</span>
                <span className="font-bold text-[#22291F]">₹110</span>
              </div>
            </div>

            <div className="border-t border-[#22291F]/15 pt-3 space-y-1">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-[#5B6355]">Base Cash Payout:</span>
                <span className="text-base font-bold text-[#22291F]">₹455</span>
              </div>
              <div className="flex justify-between items-baseline font-mono text-[#2F6657]">
                <span className="text-xs font-semibold">With +15% Panna Wallet Bonus:</span>
                <span className="text-lg font-bold">₹523</span>
              </div>
            </div>

            <button
              onClick={onOpenSellModal}
              className="w-full bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
            >
              Calculate Your Shelf Payout →
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
