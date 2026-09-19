import React, { useState, useMemo, useEffect } from 'react';
import { 
  INITIAL_BOOKS, 
  INITIAL_ORDERS, 
  INITIAL_SELL_REQUESTS, 
  INITIAL_USER, 
  INITIAL_COUPONS, 
  INITIAL_REVIEWS 
} from './data/books';
import { Book, CartItem, Order, SellRequest, UserProfile, Coupon, Review, BookCondition } from './types';
import { 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  getOrCreateUserProfile, 
  syncUserDoc, 
  persistOrder, 
  fetchOrdersForUser, 
  persistSellRequest, 
  fetchSellRequestsForUser, 
  persistReview, 
  fetchAllReviews 
} from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrustStrip } from './components/TrustStrip';
import { CollectionSection } from './components/CollectionSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SellBooksModal } from './components/SellBooksModal';
import { SellBanner } from './components/SellBanner';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';

export default function App() {
  // Core application state
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [sellRequests, setSellRequests] = useState<SellRequest[]>(INITIAL_SELL_REQUESTS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Firebase Auth user state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      book: INITIAL_BOOKS[0],
      selectedCondition: INITIAL_BOOKS[0].condition,
      price: INITIAL_BOOKS[0].price,
      quantity: 1
    }
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['book-2', 'book-6']);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating' | 'discount'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Modal display states
  const [activeBookModal, setActiveBookModal] = useState<Book | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutCoupon, setCheckoutCoupon] = useState<Coupon | null>(null);
  const [checkoutUseCoins, setCheckoutUseCoins] = useState(false);
  const [checkoutDonate, setCheckoutDonate] = useState(true);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Listen to Firebase Auth state changes & sync Firestore data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          // Load or initialize user profile in Firestore
          const profile = await getOrCreateUserProfile(fbUser);
          setUser(profile);
          if (profile.wishlist && profile.wishlist.length > 0) {
            setWishlistIds(profile.wishlist);
          }

          // Fetch user's persistent orders from Firestore
          const dbOrders = await fetchOrdersForUser(fbUser.uid);
          if (dbOrders && dbOrders.length > 0) {
            setOrders(prev => {
              const existingIds = new Set(dbOrders.map(o => o.id));
              const remaining = prev.filter(o => !existingIds.has(o.id));
              return [...dbOrders, ...remaining];
            });
          }

          // Fetch user's persistent sell requests from Firestore
          const dbSellReqs = await fetchSellRequestsForUser(fbUser.uid);
          if (dbSellReqs && dbSellReqs.length > 0) {
            setSellRequests(prev => {
              const existingIds = new Set(dbSellReqs.map(r => r.id));
              const remaining = prev.filter(r => !existingIds.has(r.id));
              return [...dbSellReqs, ...remaining];
            });
          }
        } catch (err) {
          console.error('Error synchronizing Firebase user profile with Firestore:', err);
        }
      }
    });

    // Also fetch community reviews from Firestore on mount
    fetchAllReviews().then(dbReviews => {
      if (dbReviews && dbReviews.length > 0) {
        setReviews(prev => {
          const existingIds = new Set(dbReviews.map(r => r.id));
          const remaining = prev.filter(r => !existingIds.has(r.id));
          return [...dbReviews, ...remaining];
        });
      }
    }).catch(err => console.warn('Could not load reviews from Firestore:', err));

    return () => unsubscribe();
  }, []);

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    try {
      const signedInUser = await loginWithGoogle();
      if (signedInUser) {
        showToast(`Welcome ${signedInUser.displayName || 'Reader'}! Google Account connected.`);
      }
    } catch (err: any) {
      showToast(err.message || 'Google Sign-In failed');
    }
  };

  // Google Sign-Out handler
  const handleSignOut = async () => {
    try {
      await logoutUser();
      setUser(INITIAL_USER);
      showToast('Signed out of Google account');
    } catch (err) {
      showToast('Failed to sign out');
    }
  };

  // Cart operations
  const handleAddToCart = (book: Book, condition: BookCondition, quantity = 1) => {
    const conditionOption = book.conditionOptions.find(c => c.condition === condition);
    const unitPrice = conditionOption ? conditionOption.price : book.price;

    setCartItems(prev => {
      const existing = prev.find(item => item.book.id === book.id && item.selectedCondition === condition);
      if (existing) {
        return prev.map(item => 
          item.id === existing.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random()}`,
          book,
          selectedCondition: condition,
          price: unitPrice,
          quantity
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${book.title}" (${condition.replace('_', ' ')}) to cart`);
  };

  const handleUpdateCartQuantity = (itemId: string, qty: number) => {
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: qty } : item));
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    showToast('Item removed from cart');
  };

  const handleBuyNow = (book: Book, condition: BookCondition, quantity = 1) => {
    handleAddToCart(book, condition, quantity);
    setActiveBookModal(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleProceedToCheckout = (appliedCoupon: Coupon | null, useCoins: boolean, donate: boolean) => {
    setCheckoutCoupon(appliedCoupon);
    setCheckoutUseCoins(useCoins);
    setCheckoutDonate(donate);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = async (order: Order) => {
    setOrders(prev => [order, ...prev]);
    // Clear cart items
    setCartItems([]);
    
    // Update user coins
    let updatedCoins = user.pannaCoins;
    if (order.coinsUsed > 0) {
      updatedCoins = Math.max(0, updatedCoins - order.coinsUsed);
    }
    // Earn new coins (10 coins per ₹100 spent)
    const earnedCoins = Math.floor(order.total / 10);
    updatedCoins += earnedCoins;
    
    setUser(u => ({ ...u, pannaCoins: updatedCoins }));

    // Persist order to Firestore
    try {
      const effectiveUid = firebaseUser ? firebaseUser.uid : user.id;
      await persistOrder(order, effectiveUid, firebaseUser?.email || user.email);
      if (firebaseUser) {
        await syncUserDoc(effectiveUid, { pannaCoins: updatedCoins });
      }
    } catch (err) {
      console.warn('Could not save order to Firestore:', err);
    }

    showToast(`Order ${order.id} placed & synced to Cloud! Earned +${earnedCoins} Panna coins.`);
  };

  // Wishlist toggle
  const handleToggleWishlist = async (bookId: string) => {
    setWishlistIds(prev => {
      const exists = prev.includes(bookId);
      const updated = exists ? prev.filter(id => id !== bookId) : [...prev, bookId];
      if (firebaseUser) {
        syncUserDoc(firebaseUser.uid, { wishlist: updated }).catch(console.warn);
      }
      showToast(exists ? 'Removed from saved wishlist' : 'Added to saved wishlist ♥');
      return updated;
    });
  };

  // Reviews
  const handleAddReview = async (bookId: string, rev: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const newRev: Review = {
      ...rev,
      id: `rev-${Date.now()}`,
      date: 'Today',
      helpfulCount: 0
    };
    setReviews(prev => [newRev, ...prev]);
    // Also increment book review count and adjust rating
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          reviewCount: b.reviewCount + 1,
          rating: Number(((b.rating * b.reviewCount + rev.rating) / (b.reviewCount + 1)).toFixed(1))
        };
      }
      return b;
    }));

    try {
      const effectiveUid = firebaseUser ? firebaseUser.uid : user.id;
      await persistReview(newRev, effectiveUid);
    } catch (err) {
      console.warn('Could not save review to Firestore:', err);
    }
    showToast('Review submitted and synced to Firestore!');
  };

  // Sell request
  const handleSellRequestSubmitted = async (req: SellRequest) => {
    setSellRequests(prev => [req, ...prev]);
    try {
      const effectiveUid = firebaseUser ? firebaseUser.uid : user.id;
      await persistSellRequest(req, effectiveUid);
    } catch (err) {
      console.warn('Could not save sell request to Firestore:', err);
    }
    showToast(`Pickup scheduled for ${req.books.length} books! Synced to Firestore. ID: ${req.id}`);
  };

  // Admin actions
  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
    showToast(`New book "${newBook.title}" added to inventory`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order ${orderId} updated to ${status}`);
  };

  const handleApproveSellRequest = (requestId: string) => {
    setSellRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        // If wallet bonus, credit user wallet
        if (r.payoutMode === 'wallet') {
          setUser(u => {
            const newBal = u.walletBalance + r.totalQuote;
            if (firebaseUser) {
              syncUserDoc(firebaseUser.uid, { walletBalance: newBal }).catch(console.warn);
            }
            return { ...u, walletBalance: newBal };
          });
        }
        return { ...r, status: 'Approved & Paid' };
      }
      return r;
    }));
    showToast(`Sell request ${requestId} approved and payout credited!`);
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons(prev => [newCoupon, ...prev]);
    showToast(`Coupon ${newCoupon.code} created!`);
  };

  const handleTopUpWallet = (amount: number) => {
    const bonus = Math.round(amount * 0.1);
    const totalCredit = amount + bonus;
    setUser(u => {
      const newBal = u.walletBalance + totalCredit;
      if (firebaseUser) {
        syncUserDoc(firebaseUser.uid, { walletBalance: newBal }).catch(console.warn);
      }
      return { ...u, walletBalance: newBal };
    });
    showToast(`Wallet credited with ₹${totalCredit} (including ₹${bonus} recharge bonus)`);
  };

  const handleUpdateGoal = (completed: number) => {
    const newGoal = { ...user.readingGoal, completed };
    setUser(u => ({
      ...u,
      readingGoal: newGoal
    }));
    if (firebaseUser) {
      syncUserDoc(firebaseUser.uid, { readingGoal: newGoal }).catch(console.warn);
    }
  };

  // Filtered & Sorted books for catalog
  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      // Category
      if (selectedCategory !== 'All' && b.category !== selectedCategory) {
        return false;
      }
      // Condition
      if (selectedCondition !== 'all' && b.condition !== selectedCondition) {
        return false;
      }
      // Price
      if (b.price > maxPrice) {
        return false;
      }
      // Stock
      if (onlyInStock && b.stock <= 0) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = b.title.toLowerCase().includes(query);
        const matchAuthor = b.author.toLowerCase().includes(query);
        const matchCategory = b.category.toLowerCase().includes(query);
        const matchIsbn = b.isbn.toLowerCase().includes(query);
        if (!matchTitle && !matchAuthor && !matchCategory && !matchIsbn) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') {
        const discA = (a.mrp - a.price) / a.mrp;
        const discB = (b.mrp - b.price) / b.mrp;
        return discB - discA;
      }
      return 0; // featured default
    });
  }, [books, selectedCategory, selectedCondition, maxPrice, onlyInStock, searchQuery, sortBy]);

  const wishlistBooks = useMemo(() => {
    return books.filter(b => wishlistIds.includes(b.id));
  }, [books, wishlistIds]);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-shelf');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF3E6] text-[#22291F] flex flex-col font-sans selection:bg-[#2F6657] selection:text-[#FAF3E6]">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-60 bg-[#22291F] text-[#FAF3E6] text-xs font-mono px-4 py-2.5 rounded-xl shadow-2xl border border-white/20 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D6A419] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        books={books}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        onSelectBook={setActiveBookModal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsProfileModalOpen(true)}
        onOpenSell={() => setIsSellModalOpen(true)}
        onOpenAccount={() => setIsProfileModalOpen(true)}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        firebaseUser={firebaseUser}
        onGoogleSignIn={handleGoogleSignIn}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 pb-20 sm:pb-8">
        
        {/* Editorial Hero Section */}
        <HeroSection
          featuredBooks={books}
          onSelectBook={setActiveBookModal}
          onSellClick={() => setIsSellModalOpen(true)}
          onBrowseClick={scrollToCatalog}
        />

        {/* Value & Trust Strip */}
        <TrustStrip />

        {/* Book Catalog Section (Filtering & Cards Grid) */}
        <CollectionSection
          books={filteredBooks}
          allCategories={['All', 'Fiction', 'Non-Fiction', 'Self-Help', 'Textbooks', 'Comics & Manga', "Children's", 'Biography']}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedCondition={selectedCondition}
          onSelectCondition={setSelectedCondition}
          priceRange={maxPrice}
          onPriceChange={setMaxPrice}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onlyInStock={onlyInStock}
          onToggleInStock={() => setOnlyInStock(!onlyInStock)}
          onBookClick={setActiveBookModal}
          onAddToCart={(b) => handleAddToCart(b, b.condition)}
          isWishlisted={(id) => wishlistIds.includes(id)}
          onToggleWishlist={handleToggleWishlist}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />

        {/* Sell Your Shelf / Book Dump Banner */}
        <SellBanner onOpenSellModal={() => setIsSellModalOpen(true)} />

      </main>

      {/* Footer */}
      <Footer
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
      />

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSell={() => setIsSellModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        book={activeBookModal}
        onClose={() => setActiveBookModal(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={activeBookModal ? wishlistIds.includes(activeBookModal.id) : false}
        onToggleWishlist={handleToggleWishlist}
        allBooks={books}
        reviews={activeBookModal ? reviews.filter(r => r.bookId === activeBookModal.id) : []}
        onAddReview={handleAddReview}
        onSelectRelatedBook={setActiveBookModal}
        firebaseUser={firebaseUser}
      />

      {/* 2. Cart Slide-Out Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
        availableCoupons={coupons}
        userCoins={user.pannaCoins}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedCoupon={checkoutCoupon}
        useCoins={checkoutUseCoins}
        donate={checkoutDonate}
        savedAddresses={user.savedAddresses}
        walletBalance={user.walletBalance}
        onOrderPlaced={handleOrderPlaced}
        firebaseUser={firebaseUser}
        onGoogleSignIn={handleGoogleSignIn}
      />

      {/* 4. Sell Books Modal */}
      <SellBooksModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        savedAddresses={user.savedAddresses}
        onSellRequestSubmitted={handleSellRequestSubmitted}
        firebaseUser={firebaseUser}
        onGoogleSignIn={handleGoogleSignIn}
      />

      {/* 5. Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        orders={orders}
        onReturnRequested={(orderId, reason) => {
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Returned' } : o));
          showToast(`Return initiated for ${orderId}. Reason: ${reason}`);
        }}
      />

      {/* 6. User Profile & Wallet Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        orders={orders}
        sellRequests={sellRequests}
        wishlistBooks={wishlistBooks}
        onTopUpWallet={handleTopUpWallet}
        onUpdateGoal={handleUpdateGoal}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCartFromWishlist={(b) => {
          handleAddToCart(b, b.condition);
          showToast(`Moved "${b.title}" to cart`);
        }}
        onOpenTrackingForOrder={(o) => {
          setIsTrackingModalOpen(true);
        }}
        onOpenAdmin={() => {
          setIsProfileModalOpen(false);
          setIsAdminModalOpen(true);
        }}
        firebaseUser={firebaseUser}
        onGoogleSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
      />

      {/* 7. Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        books={books}
        orders={orders}
        sellRequests={sellRequests}
        coupons={coupons}
        onAddBook={handleAddBook}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onApproveSellRequest={handleApproveSellRequest}
        onAddCoupon={handleAddCoupon}
      />

    </div>
  );
}
