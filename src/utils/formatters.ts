import { BookCondition } from '../types';

export const formatINR = (amount: number): string => {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

export const calculateDiscountPercent = (price: number, mrp: number): number => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

export const getConditionLabel = (condition: BookCondition): string => {
  switch (condition) {
    case 'like_new':
      return 'LIKE NEW';
    case 'good':
      return 'GOOD COND.';
    case 'acceptable':
      return 'ACCEPTABLE';
    case 'new':
      return 'BRAND NEW';
    default:
      return condition;
  }
};

export const getConditionClasses = (condition: BookCondition): { bg: string; text: string; border: string } => {
  switch (condition) {
    case 'like_new':
      return {
        bg: 'bg-[#2F6657]/10',
        text: 'text-[#2F6657]',
        border: 'border-[#2F6657]/30'
      };
    case 'good':
      return {
        bg: 'bg-[#D6A419]/15',
        text: 'text-[#8a6a10]',
        border: 'border-[#D6A419]/40'
      };
    case 'acceptable':
      return {
        bg: 'bg-stone-200',
        text: 'text-stone-700',
        border: 'border-stone-300'
      };
    case 'new':
      return {
        bg: 'bg-[#B3261E]/10',
        text: 'text-[#B3261E]',
        border: 'border-[#B3261E]/30'
      };
    default:
      return {
        bg: 'bg-stone-100',
        text: 'text-stone-700',
        border: 'border-stone-200'
      };
  }
};

export const getConditionDescription = (condition: BookCondition): string => {
  switch (condition) {
    case 'like_new':
      return 'Looks practically unread with zero cover wear, tight crisp spine, and unblemished white pages.';
    case 'good':
      return 'Gently read with minor shelf flex or soft corners. Clean pages with no missing text or markings.';
    case 'acceptable':
      return 'Well-loved reading copy with visible cover wear or gentle spine folds, but 100% complete and legible.';
    case 'new':
      return 'Brand new directly sourced publisher copy in mint unread condition.';
    default:
      return '';
  }
};

export interface PincodeInfo {
  valid: boolean;
  city: string;
  state: string;
  days: number;
  freeDeliveryEligible: boolean;
  codAvailable: boolean;
  expressAvailable: boolean;
}

export const checkPincode = (pincode: string): PincodeInfo => {
  const clean = pincode.trim();
  if (!/^\d{6}$/.test(clean)) {
    return {
      valid: false,
      city: '',
      state: '',
      days: 0,
      freeDeliveryEligible: false,
      codAvailable: false,
      expressAvailable: false
    };
  }

  const prefix = clean.substring(0, 2);
  let city = 'Delhi NCR';
  let state = 'Delhi';
  let days = 2;

  if (prefix === '11') {
    city = 'New Delhi';
    state = 'Delhi';
    days = 1;
  } else if (prefix === '12' || prefix === '13') {
    city = 'Gurugram / Faridabad';
    state = 'Haryana';
    days = 2;
  } else if (prefix === '40' || prefix === '41') {
    city = 'Mumbai / Pune';
    state = 'Maharashtra';
    days = 2;
  } else if (prefix === '56' || prefix === '57') {
    city = 'Bengaluru';
    state = 'Karnataka';
    days = 2;
  } else if (prefix === '60') {
    city = 'Chennai';
    state = 'Tamil Nadu';
    days = 3;
  } else if (prefix === '70') {
    city = 'Kolkata';
    state = 'West Bengal';
    days = 3;
  } else if (prefix === '50') {
    city = 'Hyderabad';
    state = 'Telangana';
    days = 2;
  } else {
    city = 'Rest of India';
    state = 'India';
    days = 4;
  }

  return {
    valid: true,
    city,
    state,
    days,
    freeDeliveryEligible: true,
    codAvailable: true,
    expressAvailable: days <= 2
  };
};

export const calculateSellQuote = (
  condition: BookCondition,
  format: string,
  category: string
): number => {
  let base = 120;
  if (category === 'Textbooks') base = 180;
  if (category === 'Comics & Manga') base = 150;
  if (category === 'Fiction') base = 110;
  if (category === 'Non-Fiction') base = 140;

  if (format === 'hardcover') base += 50;

  switch (condition) {
    case 'like_new':
      return Math.round(base * 1.3);
    case 'good':
      return Math.round(base * 1.0);
    case 'acceptable':
      return Math.round(base * 0.7);
    default:
      return base;
  }
};
