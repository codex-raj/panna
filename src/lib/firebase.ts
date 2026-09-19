import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { UserProfile, Order, SellRequest, Review, Book } from '../types';
import configJson from '../../firebase-applet-config.json';

// Initialize Firebase App
const firebaseConfig = {
  apiKey: configJson.apiKey,
  authDomain: configJson.authDomain,
  projectId: configJson.projectId,
  storageBucket: configJson.storageBucket,
  messagingSenderId: configJson.messagingSenderId,
  appId: configJson.appId,
  firestoreDatabaseId: configJson.firestoreDatabaseId
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Authentication instance
export const auth = getAuth(app);

// Provider with account picker
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Non-default Firestore database instance
export const db = configJson.firestoreDatabaseId && configJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, configJson.firestoreDatabaseId)
  : getFirestore(app);

// Auth helper functions
export const loginWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by your browser. Please allow popups or open the app in a new window.');
    } else if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
      // User closed popup without completing
      return null;
    }
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Firestore User Profile helpers
export const getOrCreateUserProfile = async (fbUser: FirebaseUser): Promise<UserProfile> => {
  const userRef = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    return {
      id: fbUser.uid,
      name: data.name || fbUser.displayName || 'Panna Reader',
      email: data.email || fbUser.email || '',
      phone: data.phone || fbUser.phoneNumber || '+91 98765 43210',
      pannaCoins: typeof data.pannaCoins === 'number' ? data.pannaCoins : 120,
      walletBalance: typeof data.walletBalance === 'number' ? data.walletBalance : 250,
      readingGoal: data.readingGoal || { target: 24, completed: 9, year: 2026 },
      savedAddresses: Array.isArray(data.savedAddresses) ? data.savedAddresses : [
        {
          id: 'addr-1',
          fullName: fbUser.displayName || 'Panna Reader',
          phone: fbUser.phoneNumber || '+91 98765 43210',
          streetAddress: 'Flat 402, Kaveri Heights, Koramangala 4th Block',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560034',
          tag: 'Home',
          isDefault: true
        }
      ],
      wishlist: Array.isArray(data.wishlist) ? data.wishlist : []
    };
  } else {
    // Brand new user profile initialization
    const newProfile: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || 'Panna Reader',
      email: fbUser.email || '',
      phone: fbUser.phoneNumber || '+91 98765 43210',
      pannaCoins: 150, // Welcome reward bonus
      walletBalance: 100, // Welcome store credit bonus
      readingGoal: { target: 20, completed: 0, year: 2026 },
      savedAddresses: [
        {
          id: 'addr-1',
          fullName: fbUser.displayName || 'Panna Reader',
          phone: fbUser.phoneNumber || '+91 98765 43210',
          streetAddress: 'Flat 402, Kaveri Heights, Koramangala 4th Block',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560034',
          tag: 'Home',
          isDefault: true
        }
      ],
      wishlist: []
    };

    try {
      await setDoc(userRef, {
        ...newProfile,
        uid: fbUser.uid,
        avatarUrl: fbUser.photoURL || '',
        role: fbUser.email === 'Rajsinha7462@gmail.com' ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Could not persist initial user doc in Firestore:', err);
    }

    return newProfile;
  }
};

export const syncUserDoc = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, updates, { merge: true });
  } catch (err) {
    console.error('Error updating user document in Firestore:', err);
  }
};

// Orders persistence
export const persistOrder = async (order: Order, userId: string, userEmail?: string): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      userId,
      customerEmail: userEmail || '',
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error persisting order to Firestore:', err);
  }
};

export const fetchOrdersForUser = async (userId: string): Promise<Order[]> => {
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, where('userId', '==', userId));
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach(docSnap => {
      orders.push(docSnap.data() as Order);
    });
    return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.warn('Could not fetch user orders from Firestore:', err);
    return [];
  }
};

// Sell Requests persistence
export const persistSellRequest = async (sellReq: SellRequest, userId: string): Promise<void> => {
  try {
    const reqRef = doc(db, 'sellRequests', sellReq.id);
    await setDoc(reqRef, {
      ...sellReq,
      userId,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error persisting sell request to Firestore:', err);
  }
};

export const fetchSellRequestsForUser = async (userId: string): Promise<SellRequest[]> => {
  try {
    const reqsCol = collection(db, 'sellRequests');
    const q = query(reqsCol, where('userId', '==', userId));
    const snap = await getDocs(q);
    const reqs: SellRequest[] = [];
    snap.forEach(docSnap => {
      reqs.push(docSnap.data() as SellRequest);
    });
    return reqs;
  } catch (err) {
    console.warn('Could not fetch user sell requests from Firestore:', err);
    return [];
  }
};

// Reviews persistence
export const persistReview = async (review: Review, userId: string): Promise<void> => {
  try {
    const reviewRef = doc(db, 'reviews', review.id);
    await setDoc(reviewRef, {
      ...review,
      userId,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error persisting review to Firestore:', err);
  }
};

export const fetchAllReviews = async (): Promise<Review[]> => {
  try {
    const reviewsCol = collection(db, 'reviews');
    const snap = await getDocs(reviewsCol);
    const list: Review[] = [];
    snap.forEach(docSnap => {
      list.push(docSnap.data() as Review);
    });
    return list;
  } catch (err) {
    console.warn('Could not fetch reviews from Firestore:', err);
    return [];
  }
};
