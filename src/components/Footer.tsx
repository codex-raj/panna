import React, { useState } from 'react';
import { Send, BookOpen, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface FooterProps {
  onCategorySelect: (cat: string) => void;
  onOpenSellModal: () => void;
  onOpenTrackingModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onCategorySelect,
  onOpenSellModal,
  onOpenTrackingModal
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="mt-16 border-t border-[#22291F]/15 bg-[#FFFDF8] text-[#22291F]">
      {/* Top Value Assurance Ribbon */}
      <div className="border-b border-[#22291F]/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#2F6657] shrink-0" />
            <div>
              <h5 className="font-display font-bold text-sm">12-Point Quality Stamp</h5>
              <p className="text-xs text-[#5B6355]">Every page, spine, and binding verified</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Truck className="w-6 h-6 text-[#2F6657] shrink-0" />
            <div>
              <h5 className="font-display font-bold text-sm">Fast Pan-India Delivery</h5>
              <p className="text-xs text-[#5B6355]">FREE on all book orders above ₹499</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <RotateCcw className="w-6 h-6 text-[#2F6657] shrink-0" />
            <div>
              <h5 className="font-display font-bold text-sm">7-Day Free Replacement</h5>
              <p className="text-xs text-[#5B6355]">Zero questions asked if condition differs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-2xl tracking-tight text-[#22291F]">
                पन्ना <span className="text-lg font-mono text-[#2F6657]">/ Panna</span>
              </span>
            </div>
            <p className="text-xs text-[#5B6355] leading-relaxed max-w-sm">
              An online sanctuary for readers. We connect book lovers across India to buy, read, 
              and circulate verified second-hand and new titles at up to 70% off original cover prices.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <label className="block text-xs font-mono font-bold text-[#22291F] mb-1.5">
                Weekend 50% Flash Drops Newsletter:
              </label>
              {subscribed ? (
                <p className="text-xs font-mono font-bold text-[#2F6657]">
                  ✓ Welcome to the Panna Reader's Guild!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="reader@panna.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#FAF3E6] border border-[#22291F]/20 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-[#2F6657]"
                  />
                  <button
                    type="submit"
                    className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Browse Categories */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-display font-bold text-sm text-[#22291F]">Browse Books</h4>
            <ul className="space-y-2 text-[#5B6355]">
              <li>
                <button onClick={() => onCategorySelect('Fiction')} className="hover:text-[#22291F] cursor-pointer">
                  Fiction &amp; Literature
                </button>
              </li>
              <li>
                <button onClick={() => onCategorySelect('Non-Fiction')} className="hover:text-[#22291F] cursor-pointer">
                  Non-Fiction &amp; Memoirs
                </button>
              </li>
              <li>
                <button onClick={() => onCategorySelect('Self-Help')} className="hover:text-[#22291F] cursor-pointer">
                  Self-Help &amp; Habits
                </button>
              </li>
              <li>
                <button onClick={() => onCategorySelect('Textbooks')} className="hover:text-[#22291F] cursor-pointer">
                  Academic &amp; Textbooks
                </button>
              </li>
              <li>
                <button onClick={() => onCategorySelect('Comics & Manga')} className="hover:text-[#22291F] cursor-pointer">
                  Comics &amp; Graphic Novels
                </button>
              </li>
            </ul>
          </div>

          {/* Sell & Book Dump */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-display font-bold text-sm text-[#22291F]">Sell Your Shelf</h4>
            <ul className="space-y-2 text-[#5B6355]">
              <li>
                <button onClick={onOpenSellModal} className="hover:text-[#22291F] cursor-pointer">
                  Start a Sell Batch
                </button>
              </li>
              <li>
                <button onClick={onOpenSellModal} className="hover:text-[#22291F] cursor-pointer">
                  Get Instant Valuation Quote
                </button>
              </li>
              <li>
                <span className="hover:text-[#22291F] cursor-pointer">
                  Condition Grading Standard
                </span>
              </li>
              <li>
                <span className="hover:text-[#22291F] cursor-pointer">
                  BookPay +15% Bonus Credit
                </span>
              </li>
              <li>
                <span className="hover:text-[#22291F] cursor-pointer">
                  Pickup Serviceable Cities
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Help & Tracking */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-display font-bold text-sm text-[#22291F]">Help &amp; Orders</h4>
            <ul className="space-y-2 text-[#5B6355]">
              <li>
                <button onClick={onOpenTrackingModal} className="hover:text-[#22291F] cursor-pointer font-bold text-[#2F6657]">
                  Track Live Order
                </button>
              </li>
              <li>
                <button onClick={onOpenTrackingModal} className="hover:text-[#22291F] cursor-pointer">
                  7-Day Return / Replacement
                </button>
              </li>
              <li>
                <span className="hover:text-[#22291F] cursor-pointer">
                  Shipping &amp; COD Policies
                </span>
              </li>
              <li>
                <span className="hover:text-[#22291F] cursor-pointer">
                  School Library Fund Initiative
                </span>
              </li>
              <li>
                <span className="hover:text-[#22291F] cursor-pointer">
                  Contact Care: support@panna.in
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-[#22291F]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#5B6355]">
          <p>© {new Date().getFullYear()} Panna Books Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Curated with</span>
            <Heart className="w-3.5 h-3.5 text-[#B3261E] fill-[#B3261E]" />
            <span>for readers across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
