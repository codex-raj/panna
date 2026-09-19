import React from 'react';
import { Truck, ShieldCheck, Banknote, RotateCcw } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <div className="border-y border-[#22291F]/15 bg-[#FFFDF8] py-4">
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
        <div className="flex items-center gap-3 px-3 md:border-r border-[#22291F]/15">
          <div className="w-10 h-10 rounded-full bg-[#2F6657]/10 flex items-center justify-center text-[#2F6657] shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <b className="block text-sm font-semibold text-[#22291F]">Free delivery</b>
            <span className="text-xs text-[#5B6355]">Above ₹499, pan-India</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 md:border-r border-[#22291F]/15">
          <div className="w-10 h-10 rounded-full bg-[#D6A419]/15 flex items-center justify-center text-[#8a6a10] shrink-0">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <b className="block text-sm font-semibold text-[#22291F]">Cash on delivery</b>
            <span className="text-xs text-[#5B6355]">Pay securely at doorstep</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 md:border-r border-[#22291F]/15">
          <div className="w-10 h-10 rounded-full bg-[#2F6657]/10 flex items-center justify-center text-[#2F6657] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <b className="block text-sm font-semibold text-[#22291F]">Quality checked</b>
            <span className="text-xs text-[#5B6355]">Every used book verified</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3">
          <div className="w-10 h-10 rounded-full bg-[#B3261E]/10 flex items-center justify-center text-[#B3261E] shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <b className="block text-sm font-semibold text-[#22291F]">Easy replacement</b>
            <span className="text-xs text-[#5B6355]">7-day window, zero hassle</span>
          </div>
        </div>
      </div>
    </div>
  );
};
