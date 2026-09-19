import React, { useState } from 'react';
import { 
  X, Star, ShieldCheck, Truck, RotateCcw, Heart, ShoppingBag, 
  Check, Info, Sparkles, MapPin, Share2, ThumbsUp, Send
} from 'lucide-react';
import { Book, BookCondition, Review } from '../types';
import { 
  formatINR, 
  calculateDiscountPercent, 
  getConditionLabel, 
  getConditionClasses,
  getConditionDescription, 
  checkPincode, 
  PincodeInfo 
} from '../utils/formatters';

interface ProductDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onAddToCart: (book: Book, condition: BookCondition, quantity: number) => void;
  onBuyNow: (book: Book, condition: BookCondition, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (bookId: string) => void;
  allBooks: Book[];
  reviews: Review[];
  onAddReview: (bookId: string, review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  onSelectRelatedBook: (book: Book) => void;
  firebaseUser?: any;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  book,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  allBooks,
  reviews,
  onAddReview,
  onSelectRelatedBook,
  firebaseUser
}) => {
  if (!book) return null;

  const [selectedCondition, setSelectedCondition] = useState<BookCondition>(book.condition);
  const [quantity, setQuantity] = useState(1);
  const [pincodeInput, setPincodeInput] = useState('110001');
  const [pincodeResult, setPincodeResult] = useState<PincodeInfo>(checkPincode('110001'));
  const [activeTab, setActiveTab] = useState<'overview' | 'condition' | 'reviews'>('overview');
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState(firebaseUser?.displayName || '');
  const [reviewerCity, setReviewerCity] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculate current price based on condition option if available
  const conditionOption = book.conditionOptions.find(o => o.condition === selectedCondition);
  const currentPrice = conditionOption ? conditionOption.price : book.price;
  const currentStock = conditionOption ? conditionOption.stock : book.stock;
  const discount = calculateDiscountPercent(currentPrice, book.mrp);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeResult(checkPincode(pincodeInput));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    onAddReview(book.id, {
      bookId: book.id,
      userName: reviewerName.trim(),
      userCity: reviewerCity.trim() || 'Reader',
      verifiedPurchase: true,
      conditionPurchased: selectedCondition,
      rating: reviewerRating,
      comment: reviewerComment.trim()
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setReviewerComment('');
    }, 2000);
  };

  const relatedBooks = allBooks
    .filter(b => b.id !== book.id && (b.category === book.category || b.author === book.author))
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-[#FAF3E6] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#22291F]/20 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22291F]/15 bg-[#FFFDF8]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#5B6355] uppercase tracking-wider">
              {book.category} / {book.subcategory}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-stone-100 text-[#5B6355] hover:text-[#22291F] transition-colors cursor-pointer relative"
              title="Share Book"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute right-0 -bottom-7 bg-[#22291F] text-white text-[10px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-stone-100 text-[#5B6355] hover:text-[#22291F] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.9fr] gap-8">
            
            {/* Left: Book Cover Presentation */}
            <div className="flex flex-col items-center">
              <div 
                className="w-56 h-76 sm:w-64 sm:h-88 rounded-xl p-5 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden"
                style={{ background: book.coverGradient }}
              >
                {/* Simulated Book Spine */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/25 shadow-inner"></div>
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/15"></div>

                <div className="flex justify-between items-start z-10 pl-3">
                  <span className="font-mono text-xs uppercase tracking-wider bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded">
                    {book.format}
                  </span>
                  <div className="w-12 h-12 rounded-full border-2 border-white/80 bg-black/20 backdrop-blur-xs font-mono text-[9px] font-bold flex items-center justify-center text-center -rotate-12 leading-tight">
                    PANNA<br />VERIFIED
                  </div>
                </div>

                <div className="z-10 pl-3">
                  <p className="font-display font-bold text-xl sm:text-2xl leading-tight drop-shadow-md">
                    {book.title}
                  </p>
                  <p className="text-xs text-stone-200 mt-1 font-medium">
                    {book.author}
                  </p>
                  <p className="text-[10px] text-stone-300 font-mono mt-0.5">
                    {book.publisher} · {book.publicationYear}
                  </p>
                </div>
              </div>

              {/* Verified Quality Stamp */}
              <div className="mt-4 flex items-center gap-2 bg-[#FFFDF8] border border-[#2F6657]/30 rounded-lg p-2.5 w-full max-w-xs text-xs">
                <ShieldCheck className="w-5 h-5 text-[#2F6657] shrink-0" />
                <span className="text-[#5B6355]">
                  <strong className="text-[#2F6657]">Panna Guarantee:</strong> 12-point inspection done. No missing pages guaranteed.
                </span>
              </div>
            </div>

            {/* Right: Book Details & Actions */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-[#2F6657] bg-[#2F6657]/10 px-2 py-0.5 rounded">
                    {book.language} Edition
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="font-mono text-xs text-[#5B6355]">
                    ISBN: {book.isbn}
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#22291F] leading-tight">
                  {book.title}
                </h1>
                <p className="text-sm sm:text-base text-[#5B6355] mt-1 font-medium">
                  By <span className="text-[#22291F] font-semibold">{book.author}</span> (Author)
                </p>

                {/* Rating summary */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 bg-[#D6A419]/20 px-2 py-1 rounded text-xs font-bold text-[#8a6a10]">
                    <Star className="w-3.5 h-3.5 fill-[#D6A419]" />
                    <span>{book.rating}</span>
                  </div>
                  <span className="text-xs text-[#5B6355] underline cursor-pointer" onClick={() => setActiveTab('reviews')}>
                    {book.reviewCount} customer reviews
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 flex flex-wrap items-baseline gap-3">
                <span className="font-mono font-bold text-3xl text-[#22291F]">
                  {formatINR(currentPrice)}
                </span>
                <span className="font-mono text-base text-[#5B6355] line-through">
                  MRP {formatINR(book.mrp)}
                </span>
                <span className="font-mono text-xs font-bold bg-[#B3261E] text-white px-2 py-1 rounded">
                  {discount}% OFF
                </span>
                <span className="text-xs font-mono text-[#2F6657] font-bold block sm:inline">
                  (You Save {formatINR(book.mrp - currentPrice)})
                </span>
              </div>

              {/* Condition Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#22291F] mb-2 flex items-center justify-between">
                  <span>Select Book Condition:</span>
                  <span className="text-[#2F6657] font-semibold lowercase">
                    {currentStock > 0 ? `${currentStock} copies left` : 'Out of stock'}
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {book.conditionOptions.map((opt) => {
                    const isSelected = selectedCondition === opt.condition;
                    return (
                      <button
                        key={opt.condition}
                        type="button"
                        onClick={() => setSelectedCondition(opt.condition)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#2F6657] bg-[#2F6657]/10 ring-2 ring-[#2F6657]/20 shadow-xs'
                            : 'border-[#22291F]/15 bg-[#FFFDF8] hover:border-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold">
                            {getConditionLabel(opt.condition)}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#2F6657]" />}
                        </div>
                        <div className="font-mono text-sm font-bold text-[#22291F]">
                          {formatINR(opt.price)}
                        </div>
                        <div className="text-[10px] text-[#5B6355] mt-1 line-clamp-1">
                          {opt.stock} in stock
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation of selected condition */}
                <div className="mt-2.5 p-3 rounded-lg bg-[#FAF3E6] border border-[#22291F]/10 text-xs text-[#5B6355] flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#2F6657] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#22291F] mr-1">Condition Details:</strong>
                    {getConditionDescription(selectedCondition)}
                  </div>
                </div>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#22291F]/20 rounded-lg bg-[#FFFDF8] p-1 font-mono">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center font-bold text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      disabled={quantity >= currentStock}
                      className="w-8 h-8 flex items-center justify-center font-bold text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onAddToCart(book, selectedCondition, quantity)}
                    className="flex-1 bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart · {formatINR(currentPrice * quantity)}</span>
                  </button>

                  <button
                    onClick={() => onToggleWishlist(book.id)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#B3261E] border-[#B3261E] text-white'
                        : 'border-[#22291F]/20 bg-[#FFFDF8] text-[#5B6355] hover:text-[#B3261E]'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={() => onBuyNow(book, selectedCondition, quantity)}
                  className="w-full bg-[#2F6657] hover:bg-[#1F4E42] text-[#FAF3E6] font-bold py-3.5 px-4 rounded-xl transition-colors cursor-pointer shadow-md text-sm font-mono tracking-wider uppercase"
                >
                  Instant 1-Click Buy Now
                </button>
              </div>

              {/* Delivery Estimator by Pincode */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4">
                <span className="font-mono text-xs font-bold text-[#22291F] block mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2F6657]" />
                  Check Delivery &amp; COD at your Pincode:
                </span>
                
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode (e.g. 110001)"
                    className="flex-1 bg-[#FAF3E6] border border-[#22291F]/20 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-[#2F6657]"
                  />
                  <button
                    type="submit"
                    className="bg-[#22291F] text-[#FAF3E6] px-4 py-2 rounded-lg text-xs font-bold font-mono hover:bg-[#2F6657] transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </form>

                {pincodeResult.valid && (
                  <div className="mt-3 text-xs text-[#5B6355] space-y-1 font-mono">
                    <p className="text-[#2F6657] font-bold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Delivering in {pincodeResult.days} business days to {pincodeResult.city}
                    </p>
                    <p className="flex items-center gap-1 text-stone-600">
                      <Check className="w-3.5 h-3.5 text-[#2F6657]" />
                      Eligible for Cash on Delivery (COD)
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      FREE delivery on orders over ₹499
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Description, Specifications & Reviews */}
          <div className="border-t border-[#22291F]/15 pt-6">
            <div className="flex gap-6 border-b border-[#22291F]/10 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`font-mono text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-[#2F6657] text-[#2F6657]'
                    : 'border-transparent text-[#5B6355] hover:text-[#22291F]'
                }`}
              >
                Synopsis &amp; Details
              </button>
              <button
                onClick={() => setActiveTab('condition')}
                className={`font-mono text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'condition'
                    ? 'border-[#2F6657] text-[#2F6657]'
                    : 'border-transparent text-[#5B6355] hover:text-[#22291F]'
                }`}
              >
                Condition Guide
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`font-mono text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-[#2F6657] text-[#2F6657]'
                    : 'border-transparent text-[#5B6355] hover:text-[#22291F]'
                }`}
              >
                Reader Reviews ({reviews.length})
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="pt-4 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
                <div>
                  <h4 className="font-display font-bold text-lg text-[#22291F] mb-2">Book Synopsis</h4>
                  <p className="text-sm text-[#5B6355] leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                </div>

                <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 font-mono text-xs space-y-2.5">
                  <h4 className="font-bold uppercase tracking-wider text-[#22291F] border-b border-stone-100 pb-2">
                    Specifications
                  </h4>
                  <div className="flex justify-between text-[#5B6355]">
                    <span>Format:</span>
                    <span className="font-semibold text-[#22291F] capitalize">{book.format}</span>
                  </div>
                  <div className="flex justify-between text-[#5B6355]">
                    <span>Language:</span>
                    <span className="font-semibold text-[#22291F]">{book.language}</span>
                  </div>
                  <div className="flex justify-between text-[#5B6355]">
                    <span>Pages:</span>
                    <span className="font-semibold text-[#22291F]">{book.pages}</span>
                  </div>
                  <div className="flex justify-between text-[#5B6355]">
                    <span>Publisher:</span>
                    <span className="font-semibold text-[#22291F]">{book.publisher}</span>
                  </div>
                  <div className="flex justify-between text-[#5B6355]">
                    <span>Year:</span>
                    <span className="font-semibold text-[#22291F]">{book.publicationYear}</span>
                  </div>
                  <div className="flex justify-between text-[#5B6355]">
                    <span>ISBN:</span>
                    <span className="font-semibold text-[#22291F]">{book.isbn}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Condition Guide */}
            {activeTab === 'condition' && (
              <div className="pt-4 space-y-4">
                <div className="p-4 bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl space-y-3">
                  <h4 className="font-display font-bold text-base text-[#22291F]">
                    How Panna Grades Every Second-Hand Book
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-3 rounded-lg border border-[#2F6657]/30 bg-[#2F6657]/5">
                      <span className="font-mono text-xs font-bold text-[#2F6657] block mb-1">LIKE NEW</span>
                      <p className="text-xs text-[#5B6355] leading-normal">
                        Spine is completely straight and uncracked. Cover looks glossy with zero stains. Pages are white and unturned.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-[#D6A419]/40 bg-[#D6A419]/10">
                      <span className="font-mono text-xs font-bold text-[#8a6a10] block mb-1">GOOD CONDITION</span>
                      <p className="text-xs text-[#5B6355] leading-normal">
                        Previous reader loved it carefully. Pages are clean, spine has gentle read creases, no markings or dog-ears.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-stone-300 bg-stone-100">
                      <span className="font-mono text-xs font-bold text-stone-700 block mb-1">ACCEPTABLE</span>
                      <p className="text-xs text-[#5B6355] leading-normal">
                        Well-thumbed reading copy. Slight edge wear or tanning, but complete with 100% readable text and intact binding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="pt-4 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 bg-[#FFFDF8] p-4 rounded-xl border border-[#22291F]/15">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-display font-bold text-3xl text-[#22291F]">{book.rating}</div>
                      <div>
                        <div className="flex text-[#D6A419]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#D6A419]" />
                          ))}
                        </div>
                        <span className="text-xs text-[#5B6355] font-mono">Based on verified reader ratings</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] px-4 py-2 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer"
                  >
                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                  </button>
                </div>

                {/* Write Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="bg-[#FFFDF8] border-2 border-[#2F6657]/30 rounded-xl p-5 space-y-4">
                    <h5 className="font-bold text-sm text-[#22291F]">Share your experience with this copy</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-[#5B6355] mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Priyanshu Sharma"
                          className="w-full bg-[#FAF3E6] border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2F6657]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-[#5B6355] mb-1">City</label>
                        <input
                          type="text"
                          value={reviewerCity}
                          onChange={(e) => setReviewerCity(e.target.value)}
                          placeholder="e.g. Mumbai, MH"
                          className="w-full bg-[#FAF3E6] border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2F6657]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#5B6355] mb-1">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewerRating(s)}
                            className="cursor-pointer"
                          >
                            <Star className={`w-6 h-6 ${s <= reviewerRating ? 'fill-[#D6A419] text-[#D6A419]' : 'text-stone-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#5B6355] mb-1">Review Comments</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewerComment}
                        onChange={(e) => setReviewerComment(e.target.value)}
                        placeholder="How was the paper quality, book condition, and delivery packaging?"
                        className="w-full bg-[#FAF3E6] border border-stone-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2F6657]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#2F6657] hover:bg-[#1F4E42] text-white px-5 py-2.5 rounded-lg text-xs font-bold font-mono flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Verified Review
                    </button>

                    {reviewSubmitted && (
                      <p className="text-xs text-[#2F6657] font-bold font-mono">
                        ✓ Thank you! Your review has been added to Panna reader reviews.
                      </p>
                    )}
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-[#5B6355] italic">Be the first reader to write a review for this edition!</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-[#FFFDF8] border border-[#22291F]/10 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#22291F]">{rev.userName}</span>
                            <span className="text-[10px] text-[#5B6355]">({rev.userCity})</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[9px] font-mono text-[#2F6657] bg-[#2F6657]/10 px-1.5 py-0.2 rounded font-bold">
                                VERIFIED BUYER
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[#5B6355]">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[#D6A419]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#D6A419]" />
                          ))}
                          <span className="text-[10px] font-mono text-[#5B6355] ml-2">
                            Purchased: {getConditionLabel(rev.conditionPurchased)}
                          </span>
                        </div>

                        <p className="text-xs text-[#5B6355] leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Related / Similar Books shelf */}
          {relatedBooks.length > 0 && (
            <div className="border-t border-[#22291F]/15 pt-6">
              <h4 className="font-display font-bold text-lg text-[#22291F] mb-4">
                Readers Also Picked
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedBooks.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedBook(rel)}
                    className="p-3 bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl hover:-translate-y-1 transition-transform cursor-pointer"
                  >
                    <div 
                      className="h-24 rounded-md mb-2 p-2 flex items-end text-white font-display text-[10px] font-bold"
                      style={{ background: rel.coverGradient }}
                    >
                      {rel.title.slice(0, 15)}...
                    </div>
                    <p className="font-bold text-xs text-[#22291F] line-clamp-1">{rel.title}</p>
                    <p className="text-[10px] text-[#5B6355] truncate">{rel.author}</p>
                    <p className="font-mono text-xs font-bold text-[#22291F] mt-1">₹{rel.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
