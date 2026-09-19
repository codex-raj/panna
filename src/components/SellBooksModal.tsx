import React, { useState } from 'react';
import { 
  X, Sparkles, Plus, Trash2, Calendar, MapPin, 
  Wallet, Landmark, CheckCircle2, ArrowRight, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SellBookItem, SellRequest, Address, BookCondition, BookFormat } from '../types';
import { formatINR, calculateSellQuote, getConditionLabel } from '../utils/formatters';

interface SellBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedAddresses: Address[];
  onSellRequestSubmitted: (req: SellRequest) => void;
  firebaseUser?: any;
  onGoogleSignIn?: () => void;
}

export const SellBooksModal: React.FC<SellBooksModalProps> = ({
  isOpen,
  onClose,
  savedAddresses,
  onSellRequestSubmitted,
  firebaseUser,
  onGoogleSignIn
}) => {
  if (!isOpen) return null;

  const [booksToSell, setBooksToSell] = useState<SellBookItem[]>([
    {
      title: 'Man’s Search for Meaning',
      author: 'Viktor Frankl',
      category: 'Non-Fiction',
      format: 'paperback',
      condition: 'good',
      estimatedQuote: 140
    }
  ]);

  // New book draft inputs
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Fiction');
  const [newFormat, setNewFormat] = useState<BookFormat>('paperback');
  const [newCondition, setNewCondition] = useState<BookCondition>('good');

  const [payoutMode, setPayoutMode] = useState<'wallet' | 'upi' | 'bank_transfer'>('wallet');
  const [upiId, setUpiId] = useState('rajsinha@okhdfcbank');
  const [selectedAddress, setSelectedAddress] = useState<Address>(savedAddresses[0]);
  const [pickupSlot, setPickupSlot] = useState('Tomorrow, 2:00 PM – 5:00 PM');
  const [submittedRequest, setSubmittedRequest] = useState<SellRequest | null>(null);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const quote = calculateSellQuote(newCondition, newFormat, newCategory);
    const item: SellBookItem = {
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Various Authors',
      category: newCategory,
      format: newFormat,
      condition: newCondition,
      estimatedQuote: quote
    };

    setBooksToSell([...booksToSell, item]);
    setNewTitle('');
    setNewAuthor('');
  };

  const handleRemoveBook = (index: number) => {
    setBooksToSell(booksToSell.filter((_, i) => i !== index));
  };

  const totalBaseQuote = booksToSell.reduce((acc, b) => acc + b.estimatedQuote, 0);
  const walletBonus = payoutMode === 'wallet' ? Math.round(totalBaseQuote * 0.15) : 0;
  const grandTotalQuote = totalBaseQuote + walletBonus;

  const handleSubmitBatch = () => {
    if (booksToSell.length === 0) return;

    const request: SellRequest = {
      id: `SELL-${Math.floor(10000 + Math.random() * 90000)}`,
      date: 'Today, Just now',
      books: [...booksToSell],
      totalQuote: grandTotalQuote,
      payoutMode,
      payoutBonus: walletBonus,
      pickupAddress: selectedAddress || savedAddresses[0],
      pickupSlot,
      status: 'Pickup Scheduled'
    };

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (e) {
      // Ignore
    }

    setSubmittedRequest(request);
    onSellRequestSubmitted(request);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#FAF3E6] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#22291F]/20 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#22291F]/15 bg-[#2F6657] text-[#FAF3E6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D6A419]" />
            <div>
              <h2 className="font-display font-bold text-lg leading-tight">
                Panna Book Dump · Sell Your Books
              </h2>
              <span className="text-[11px] font-mono text-[#FAF3E6]/80">
                Doorstep pickup &amp; instant payout
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {submittedRequest ? (
            /* Success confirmation */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#2F6657]/15 text-[#2F6657] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#2F6657] font-bold">
                  Pickup Scheduled!
                </span>
                <h3 className="font-display font-bold text-2xl text-[#22291F] mt-1">
                  We'll pick up your {submittedRequest.books.length} books tomorrow!
                </h3>
                <p className="text-xs font-mono text-[#5B6355] mt-1">
                  Request ID: <strong className="text-[#22291F]">{submittedRequest.id}</strong>
                </p>
              </div>

              {/* Receipt card */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 text-left max-w-md mx-auto font-mono text-xs space-y-2">
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-[#5B6355]">Estimated Payout:</span>
                  <span className="font-bold text-[#2F6657] text-base">{formatINR(submittedRequest.totalQuote)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6355]">Payout Channel:</span>
                  <span className="font-bold uppercase text-[#22291F]">{submittedRequest.payoutMode} {submittedRequest.payoutBonus > 0 && '(+15% Wallet Bonus)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6355]">Scheduled Slot:</span>
                  <span className="font-semibold text-[#22291F]">{submittedRequest.pickupSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B6355]">Pickup Location:</span>
                  <span className="text-[#22291F]">{submittedRequest.pickupAddress.streetAddress}, {submittedRequest.pickupAddress.city}</span>
                </div>
              </div>

              <p className="text-xs text-[#5B6355] max-w-md mx-auto leading-relaxed">
                Our logistics partner will call before arrival. No need to pack in boxes — simply hand the books over. Once condition is verified, payout is credited within 2 hours!
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Sell request stored &amp; synced to Firestore Cloud</span>
              </div>

              <button
                onClick={onClose}
                className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Intro Banner */}
              <div className="bg-[#2F6657]/10 border border-[#2F6657]/20 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2F6657] text-white flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#22291F]">
                    Your bookshelf has room for one more story. Let the old ones earn their keep.
                  </h4>
                  <p className="text-xs text-[#5B6355] mt-0.5">
                    Add the books you want to sell. Get an instant valuation, door-step pickup, and instant cash or wallet credit.
                  </p>
                </div>
              </div>

              {/* Add a Book Form */}
              <form onSubmit={handleAddBook} className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#22291F] flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#2F6657]" /> Add a Book to Sell Batch
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#5B6355] mb-1">Book Title / ISBN</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sapiens, The Alchemist, Physics Part 1"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-[#FAF3E6] border border-[#22291F]/20 rounded-lg p-2 text-xs outline-none focus:border-[#2F6657]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#5B6355] mb-1">Author</label>
                    <input
                      type="text"
                      placeholder="e.g. Haruki Murakami, Paulo Coelho"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full bg-[#FAF3E6] border border-[#22291F]/20 rounded-lg p-2 text-xs outline-none focus:border-[#2F6657]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#5B6355] mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-[#FAF3E6] border border-[#22291F]/20 rounded-lg p-2 text-xs outline-none font-mono"
                    >
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Self-Help">Self-Help</option>
                      <option value="Textbooks">Textbooks</option>
                      <option value="Comics & Manga">Comics &amp; Manga</option>
                      <option value="Children's">Children's</option>
                      <option value="Biography">Biography</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#5B6355] mb-1">Format</label>
                    <select
                      value={newFormat}
                      onChange={(e) => setNewFormat(e.target.value as BookFormat)}
                      className="w-full bg-[#FAF3E6] border border-[#22291F]/20 rounded-lg p-2 text-xs outline-none font-mono"
                    >
                      <option value="paperback">Paperback</option>
                      <option value="hardcover">Hardcover</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#5B6355] mb-1">Condition</label>
                    <select
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value as BookCondition)}
                      className="w-full bg-[#FAF3E6] border border-[#22291F]/20 rounded-lg p-2 text-xs outline-none font-mono"
                    >
                      <option value="like_new">Like New</option>
                      <option value="good">Good Condition</option>
                      <option value="acceptable">Acceptable</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Get Instant Quote &amp; Add</span>
                </button>
              </form>

              {/* Books in Batch List */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#22291F] flex items-center justify-between">
                  <span>Books in Pickup Batch ({booksToSell.length})</span>
                  <span className="text-[#2F6657]">Instant Quote: {formatINR(totalBaseQuote)}</span>
                </h4>

                {booksToSell.length === 0 ? (
                  <p className="text-xs text-[#5B6355] italic p-3 bg-[#FFFDF8] rounded-lg border border-dashed border-stone-300">
                    No books added yet. Add at least 1 book above to calculate your payout.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {booksToSell.map((book, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div>
                          <p className="font-bold text-xs text-[#22291F]">{book.title}</p>
                          <p className="text-[11px] text-[#5B6355]">
                            {book.author} · <span className="capitalize">{book.format}</span> · <span className="font-mono text-[10px] text-[#2F6657]">{getConditionLabel(book.condition)}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#22291F]">
                            Quote: {formatINR(book.estimatedQuote)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBook(idx)}
                            className="text-stone-400 hover:text-[#B3261E] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payout Channel Selector with 15% Bonus on Wallet */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#22291F]">
                  Select Payout Channel
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      payoutMode === 'wallet'
                        ? 'border-[#2F6657] bg-[#2F6657]/10 ring-2 ring-[#2F6657]/20'
                        : 'border-[#22291F]/15 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payout"
                        checked={payoutMode === 'wallet'}
                        onChange={() => setPayoutMode('wallet')}
                        className="accent-[#2F6657]"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#22291F] flex items-center gap-1">
                          <Wallet className="w-3.5 h-3.5 text-[#D6A419]" /> Panna BookPay Wallet
                        </span>
                        <span className="text-[10px] text-[#2F6657] font-mono font-bold">
                          +15% Extra Store Credit Bonus
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#2F6657]">
                      {formatINR(totalBaseQuote + Math.round(totalBaseQuote * 0.15))}
                    </span>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      payoutMode === 'upi'
                        ? 'border-[#2F6657] bg-[#2F6657]/10 ring-2 ring-[#2F6657]/20'
                        : 'border-[#22291F]/15 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payout"
                        checked={payoutMode === 'upi'}
                        onChange={() => setPayoutMode('upi')}
                        className="accent-[#2F6657]"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#22291F] flex items-center gap-1">
                          <Landmark className="w-3.5 h-3.5 text-stone-600" /> Direct UPI / Bank
                        </span>
                        <span className="text-[10px] text-[#5B6355]">
                          Direct cash transfer
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#22291F]">
                      {formatINR(totalBaseQuote)}
                    </span>
                  </label>
                </div>

                {payoutMode === 'upi' && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-mono text-[#5B6355] mb-1">Your UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full bg-[#FAF3E6] border border-[#22291F]/20 rounded-lg p-2 text-xs font-mono outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Pickup Address & Slot Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5 space-y-1.5">
                  <label className="font-mono text-xs font-bold text-[#22291F] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2F6657]" /> Doorstep Pickup Address
                  </label>
                  <p className="text-xs text-[#5B6355]">
                    {selectedAddress?.fullName || 'Raj Sinha'}
                  </p>
                  <p className="text-xs text-[#5B6355] truncate">
                    {selectedAddress?.streetAddress}, {selectedAddress?.city}
                  </p>
                </div>

                <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5 space-y-1.5">
                  <label className="font-mono text-xs font-bold text-[#22291F] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2F6657]" /> Pickup Slot
                  </label>
                  <select
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                    className="w-full bg-[#FAF3E6] border border-[#22291F]/20 rounded-lg p-2 text-xs font-mono outline-none"
                  >
                    <option value="Tomorrow, 10:00 AM – 1:00 PM">Tomorrow, 10:00 AM – 1:00 PM</option>
                    <option value="Tomorrow, 2:00 PM – 5:00 PM">Tomorrow, 2:00 PM – 5:00 PM</option>
                    <option value="Day After, 10:00 AM – 1:00 PM">Day After, 10:00 AM – 1:00 PM</option>
                    <option value="Day After, 2:00 PM – 5:00 PM">Day After, 2:00 PM – 5:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmitBatch}
                  disabled={booksToSell.length === 0}
                  className="w-full bg-[#2F6657] hover:bg-[#1F4E42] text-[#FAF3E6] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md font-mono text-sm uppercase tracking-wider disabled:opacity-40"
                >
                  <span>Confirm Pickup &amp; Lock {formatINR(grandTotalQuote)} Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
