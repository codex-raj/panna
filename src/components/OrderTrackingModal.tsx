import React, { useState } from 'react';
import { 
  X, Search, PackageCheck, Truck, CheckCircle2, RotateCcw, 
  Download, MapPin, Calendar, AlertCircle
} from 'lucide-react';
import { Order } from '../types';
import { formatINR } from '../utils/formatters';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onReturnRequested: (orderId: string, reason: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  onReturnRequested
}) => {
  if (!isOpen) return null;

  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order>(orders[0] || null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Paper condition differed from grade');
  const [returnConfirmed, setReturnConfirmed] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = orders.find(o => o.id.toLowerCase().includes(searchId.trim().toLowerCase()) || o.trackingNumber.toLowerCase().includes(searchId.trim().toLowerCase()));
    if (found) {
      setSelectedOrder(found);
    }
  };

  const steps = [
    { label: 'Order Placed', desc: 'Verified & entered queue' },
    { label: 'Quality Checked & Packed', desc: 'Inspected with Panna stamp' },
    { label: 'Dispatched', desc: 'Handed to express courier' },
    { label: 'In Transit', desc: 'En route to city hub' },
    { label: 'Out for Delivery', desc: 'With local courier rider' },
    { label: 'Delivered', desc: 'Received by reader' }
  ];

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Quality Checked & Packed': return 1;
      case 'Dispatched': return 2;
      case 'In Transit': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      case 'Returned': return 5;
      default: return 1;
    }
  };

  const currentStep = selectedOrder ? getStepIndex(selectedOrder.status) : 0;

  const handleDownloadInvoice = () => {
    window.print();
  };

  const handleConfirmReturn = () => {
    if (selectedOrder) {
      onReturnRequested(selectedOrder.id, returnReason);
      setReturnConfirmed(true);
      setTimeout(() => {
        setReturnConfirmed(false);
        setReturnModalOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#FAF3E6] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#22291F]/20 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#22291F]/15 bg-[#FFFDF8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#2F6657]" />
            <h2 className="font-display font-bold text-lg text-[#22291F]">
              Live Order Tracker &amp; Invoices
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
          
          {/* Order Search & Selector */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#FFFDF8] border border-[#22291F]/20 rounded-xl px-3.5 py-2">
              <Search className="w-4 h-4 text-[#5B6355]" />
              <input
                type="text"
                placeholder="Search by Order ID (e.g. PANNA-82941) or Tracking Number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full text-xs font-mono bg-transparent outline-none text-[#22291F]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] px-5 py-2 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Lookup
            </button>
          </form>

          {/* Quick tabs of existing user orders */}
          {orders.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {orders.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono whitespace-nowrap cursor-pointer transition-colors ${
                    selectedOrder?.id === o.id
                      ? 'bg-[#2F6657] text-[#FAF3E6] border-[#2F6657]'
                      : 'bg-[#FFFDF8] text-[#5B6355] border-[#22291F]/15'
                  }`}
                >
                  {o.id} ({o.items.length} items)
                </button>
              ))}
            </div>
          )}

          {selectedOrder ? (
            <div className="space-y-6">
              
              {/* Order Status Card */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-mono text-xs text-[#5B6355]">ORDER ID</span>
                    <h3 className="font-display font-bold text-xl text-[#22291F]">{selectedOrder.id}</h3>
                    <span className="font-mono text-xs text-stone-500">Placed on {selectedOrder.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadInvoice}
                      className="flex items-center gap-1 text-xs font-mono font-bold text-[#2F6657] bg-[#2F6657]/10 hover:bg-[#2F6657]/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Invoice
                    </button>

                    <button
                      onClick={() => setReturnModalOpen(true)}
                      className="flex items-center gap-1 text-xs font-mono font-bold text-[#B3261E] bg-[#B3261E]/10 hover:bg-[#B3261E]/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> 7-Day Return
                    </button>
                  </div>
                </div>

                {/* Stepper Timeline */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-xs font-bold text-[#2F6657] flex items-center gap-1">
                      <PackageCheck className="w-4 h-4" /> Status: {selectedOrder.status}
                    </span>
                    <span className="font-mono text-xs text-[#5B6355]">
                      Tracking: {selectedOrder.trackingNumber}
                    </span>
                  </div>

                  {/* Horizontal / Vertical responsive progress steps */}
                  <div className="space-y-3">
                    {steps.map((st, idx) => {
                      const isDone = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={idx} className="flex items-center gap-3 font-mono text-xs">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold ${
                            isDone 
                              ? 'bg-[#2F6657] text-white' 
                              : 'bg-stone-200 text-stone-500'
                          }`}>
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <div className="flex-1 flex justify-between items-center">
                            <span className={`font-semibold ${isCurrent ? 'text-[#2F6657] font-bold text-sm' : isDone ? 'text-[#22291F]' : 'text-stone-400'}`}>
                              {st.label}
                            </span>
                            <span className="text-[11px] text-[#5B6355]">
                              {st.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Items in this Order */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#22291F]">
                  Order Items ({selectedOrder.items.length})
                </h4>

                <div className="divide-y divide-stone-100">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-[#22291F]">{item.book.title}</p>
                        <p className="text-[11px] text-[#5B6355] font-mono">
                          Condition: <span className="uppercase font-semibold">{item.selectedCondition}</span> · Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#22291F]">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-200 pt-3 flex justify-between font-mono text-xs font-bold">
                  <span>Total Paid:</span>
                  <span className="text-[#2F6657] text-sm">{formatINR(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Delivery Address & Return Window notice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5 space-y-1 font-mono text-xs">
                  <span className="font-bold text-[#22291F] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2F6657]" /> Delivery Address
                  </span>
                  <p className="text-[#5B6355]">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-[#5B6355] truncate">{selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}</p>
                </div>

                <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5 space-y-1 font-mono text-xs">
                  <span className="font-bold text-[#22291F] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#2F6657]" /> Replacement Window
                  </span>
                  <p className="text-[#2F6657] font-semibold">
                    7-Day Free Replacement active until {selectedOrder.canReturnUntil}
                  </p>
                  <p className="text-[#5B6355] text-[10px]">
                    No-questions-asked refund or replacement if condition differs.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500 font-mono text-xs">
              No order found. Try entering order ID: <strong className="text-black">PANNA-82941</strong>
            </div>
          )}

          {/* Return & Replacement Sub-Modal */}
          {returnModalOpen && (
            <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-[#FAF3E6] border border-[#22291F]/20 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <h4 className="font-display font-bold text-base text-[#22291F]">7-Day Easy Return</h4>
                  <button onClick={() => setReturnModalOpen(false)} className="cursor-pointer text-stone-400 hover:text-black">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <label className="block text-[#5B6355]">Reason for return or replacement:</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-stone-300 rounded-lg p-2 outline-none"
                  >
                    <option value="Paper condition differed from grade">Paper condition differed from grade</option>
                    <option value="Defective / torn pages discovered">Defective / torn pages discovered</option>
                    <option value="Wrong title or language delivered">Wrong title or language delivered</option>
                    <option value="Changed mind / No longer needed">Changed mind / No longer needed</option>
                  </select>

                  <div className="p-3 bg-[#2F6657]/10 rounded-lg text-[#2F6657] text-[11px] leading-relaxed">
                    A courier pickup will be scheduled at your doorstep within 24 hours. Full refund will be credited to your Panna BookPay Wallet immediately upon pickup.
                  </div>

                  {returnConfirmed ? (
                    <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-center">
                      ✓ Return request created! Pickup scheduled.
                    </div>
                  ) : (
                    <button
                      onClick={handleConfirmReturn}
                      className="w-full bg-[#B3261E] hover:bg-[#8f1e18] text-white py-2.5 rounded-lg font-bold cursor-pointer"
                    >
                      Confirm Return Pickup
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
