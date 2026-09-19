export type BookCondition = 'new' | 'like_new' | 'good' | 'acceptable';

export type BookFormat = 'paperback' | 'hardcover' | 'box_set';

export type BookLanguage = 
  | 'English'
  | 'Hindi'
  | 'Tamil'
  | 'Kannada'
  | 'Marathi'
  | 'Sanskrit'
  | 'Bengali';

export type BookCategory = 
  | 'Fiction'
  | 'Non-Fiction'
  | "Children's"
  | 'Textbooks'
  | 'Comics & Manga'
  | 'Self-Help'
  | 'Biography'
  | 'Crime & Thriller'
  | 'Sci-Fi & Fantasy';

export interface ConditionPricing {
  condition: BookCondition;
  price: number;
  stock: number;
  description: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: BookCategory;
  subcategory: string;
  condition: BookCondition;
  conditionDescription: string;
  price: number;
  mrp: number;
  stock: number;
  rating: number;
  reviewCount: number;
  language: BookLanguage;
  format: BookFormat;
  pages: number;
  publicationYear: number;
  description: string;
  coverGradient: string;
  accentColor: string;
  featured?: boolean;
  isBestseller?: boolean;
  isUnder99?: boolean;
  isFiftyPercentOff?: boolean;
  tags: string[];
  conditionOptions: ConditionPricing[];
}

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  userCity: string;
  verifiedPurchase: boolean;
  conditionPurchased: BookCondition;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
}

export interface CartItem {
  id: string;
  book: Book;
  selectedCondition: BookCondition;
  price: number;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  tag: 'Home' | 'Office' | 'Other';
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharge: number;
  donation: number;
  coinsUsed: number;
  coinsValue: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: 'cod' | 'upi' | 'card' | 'wallet' | 'netbanking';
  status: 
    | 'Order Placed'
    | 'Quality Checked & Packed'
    | 'Dispatched'
    | 'In Transit'
    | 'Out for Delivery'
    | 'Delivered'
    | 'Returned';
  estimatedDelivery: string;
  trackingNumber: string;
  canReturnUntil: string;
}

export interface SellBookItem {
  title: string;
  author: string;
  category: string;
  format: BookFormat;
  condition: BookCondition;
  estimatedQuote: number;
  isbn?: string;
}

export interface SellRequest {
  id: string;
  date: string;
  books: SellBookItem[];
  totalQuote: number;
  payoutMode: 'wallet' | 'bank_transfer' | 'upi';
  payoutBonus: number;
  pickupAddress: Address;
  pickupSlot: string;
  status: 'Submitted' | 'Pickup Scheduled' | 'Quality Inspection' | 'Approved & Paid';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  pannaCoins: number;
  walletBalance: number;
  readingGoal: {
    target: number;
    completed: number;
    year: number;
  };
  savedAddresses: Address[];
  wishlist: string[];
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minOrder: number;
  description: string;
  maxDiscount?: number;
}
