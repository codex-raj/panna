import { Book, Coupon, Review, Address, Order, SellRequest, UserProfile } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    publisher: 'Orion Publishing Group',
    isbn: '978-1409181637',
    category: 'Crime & Thriller',
    subcategory: 'Psychological Thriller',
    condition: 'good',
    conditionDescription: 'Clean pages, spine intact with gentle creases, no markings or dog-ears.',
    price: 149,
    mrp: 399,
    stock: 7,
    rating: 4.8,
    reviewCount: 318,
    language: 'English',
    format: 'paperback',
    pages: 336,
    publicationYear: 2019,
    description: 'Alicia Berenson’s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in London. Then one evening, she shoots her husband five times in the face and never speaks another word.',
    coverGradient: 'linear-gradient(160deg, #2F6657, #1F4E42)',
    accentColor: '#2F6657',
    featured: true,
    isBestseller: true,
    isFiftyPercentOff: true,
    tags: ['Thriller', 'Bestseller', 'Mystery'],
    conditionOptions: [
      { condition: 'like_new', price: 189, stock: 4, description: 'Looks unread, crisp spine, sharp corners' },
      { condition: 'good', price: 149, stock: 7, description: 'Gently read, clean pages, minor spine flex' },
      { condition: 'acceptable', price: 119, stock: 3, description: 'Readable, slight shelf wear on edges, tight binding' }
    ]
  },
  {
    id: 'book-2',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    publisher: 'Vintage Books',
    isbn: '978-0099590088',
    category: 'Non-Fiction',
    subcategory: 'History & Anthropology',
    condition: 'like_new',
    conditionDescription: 'Excellent preservation, crisp white pages, bookstore quality.',
    price: 229,
    mrp: 499,
    stock: 5,
    rating: 4.9,
    reviewCount: 540,
    language: 'English',
    format: 'paperback',
    pages: 512,
    publicationYear: 2015,
    description: 'Planet Earth is 4.5 billion years old. In just a fraction of that time, one species among countless others has conquered it: us. In this bold, provocative book, Dr. Yuval Noah Harari explores who we are, how we got here and where we’re going.',
    coverGradient: 'linear-gradient(160deg, #B3261E, #7A1A15)',
    accentColor: '#B3261E',
    featured: true,
    isBestseller: true,
    isFiftyPercentOff: true,
    tags: ['History', 'Philosophy', 'Bestseller'],
    conditionOptions: [
      { condition: 'new', price: 349, stock: 2, description: 'Publisher mint shrink-wrapped edition' },
      { condition: 'like_new', price: 229, stock: 5, description: 'Read once, flawless spine, clean white pages' },
      { condition: 'good', price: 189, stock: 4, description: 'Minor cover edge rub, clean interior' }
    ]
  },
  {
    id: 'book-3',
    title: 'Ikigai: The Japanese Secret to a Long and Happy Life',
    author: 'Héctor García & Francesc Miralles',
    publisher: 'Penguin Life',
    isbn: '978-1786330895',
    category: 'Self-Help',
    subcategory: 'Mindfulness & Philosophy',
    condition: 'good',
    conditionDescription: 'Solid hardcover edition, tight binding, pristine text pages.',
    price: 99,
    mrp: 299,
    stock: 12,
    rating: 4.7,
    reviewCount: 412,
    language: 'English',
    format: 'hardcover',
    pages: 208,
    publicationYear: 2017,
    description: 'We all have an ikigai. It’s the Japanese word for "a reason to live" or "a reason to jump out of bed in the morning". The residents of the Japanese island of Okinawa believe their ikigai is the key to their longevity and contentment.',
    coverGradient: 'linear-gradient(160deg, #D6A419, #A87A0E)',
    accentColor: '#D6A419',
    featured: true,
    isUnder99: true,
    isFiftyPercentOff: true,
    tags: ['99 Store', 'Self-Help', 'Hardcover'],
    conditionOptions: [
      { condition: 'like_new', price: 139, stock: 6, description: 'Mint hardcover, pristine dust jacket' },
      { condition: 'good', price: 99, stock: 12, description: 'Clean text, sturdy binding, faint shelf mark' }
    ]
  },
  {
    id: 'book-4',
    title: 'Atomic Habits',
    author: 'James Clear',
    publisher: 'Random House Business',
    isbn: '978-1847941831',
    category: 'Self-Help',
    subcategory: 'Productivity & Habits',
    condition: 'new',
    conditionDescription: 'Brand new publisher copy with original seal.',
    price: 179,
    mrp: 599,
    stock: 14,
    rating: 4.9,
    reviewCount: 890,
    language: 'English',
    format: 'paperback',
    pages: 320,
    publicationYear: 2018,
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    coverGradient: 'linear-gradient(160deg, #3A3F32, #22291F)',
    accentColor: '#22291F',
    featured: true,
    isBestseller: true,
    isFiftyPercentOff: true,
    tags: ['Bestseller', 'Productivity', 'Self-Help'],
    conditionOptions: [
      { condition: 'new', price: 179, stock: 14, description: 'Freshly printed publisher sealed copy' },
      { condition: 'like_new', price: 149, stock: 8, description: 'Unopened appearance, sharp corners' },
      { condition: 'good', price: 119, stock: 6, description: 'Neat interior, slight back cover indent' }
    ]
  },
  {
    id: 'book-5',
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    publisher: 'Vintage Classics',
    isbn: '978-0099448822',
    category: 'Fiction',
    subcategory: 'Literary Fiction',
    condition: 'good',
    conditionDescription: 'Clean text, spine intact, paper aged to a pleasant vintage sepia tone.',
    price: 159,
    mrp: 399,
    stock: 6,
    rating: 4.7,
    reviewCount: 220,
    language: 'English',
    format: 'paperback',
    pages: 386,
    publicationYear: 2003,
    description: 'When he hears her favourite Beatles song, Toru Watanabe recalls his first love Naoko, the girlfriend of his best friend Kizuki. Immediately he is transported back almost twenty years to his student days in Tokyo, adrift in a world of uneasy friendships and casual passion.',
    coverGradient: 'linear-gradient(160deg, #2F6657, #1F4E42)',
    accentColor: '#2F6657',
    featured: false,
    isBestseller: true,
    isFiftyPercentOff: true,
    tags: ['Classics', 'Japanese Literature', 'Fiction'],
    conditionOptions: [
      { condition: 'like_new', price: 189, stock: 3, description: 'Flawless condition, crisp pages' },
      { condition: 'good', price: 159, stock: 6, description: 'Warm paper tone, intact spine' }
    ]
  },
  {
    id: 'book-6',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    publisher: 'HarperOne',
    isbn: '978-0062315007',
    category: 'Fiction',
    subcategory: 'Inspirational Fiction',
    condition: 'like_new',
    conditionDescription: 'Like new with uncracked spine and pristine cover.',
    price: 129,
    mrp: 299,
    stock: 9,
    rating: 4.8,
    reviewCount: 650,
    language: 'English',
    format: 'paperback',
    pages: 208,
    publicationYear: 2014,
    description: 'Paulo Coelho’s enchanting novel has inspired a devoted following around the world. This story, dazzling in its powerful simplicity and soul-stirring wisdom, is about an Andalusian shepherd boy named Santiago who travels from his homeland in Spain to the Egyptian desert in search of treasure.',
    coverGradient: 'linear-gradient(160deg, #B3261E, #7A1A15)',
    accentColor: '#B3261E',
    featured: false,
    isBestseller: true,
    isFiftyPercentOff: true,
    tags: ['Inspirational', 'Fiction', 'Classics'],
    conditionOptions: [
      { condition: 'like_new', price: 129, stock: 9, description: 'Pristine, crisp binding, unread feel' },
      { condition: 'good', price: 99, stock: 15, description: 'Clean pages with minor reading creases' }
    ]
  },
  {
    id: 'book-7',
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    publisher: 'Plata Publishing',
    isbn: '978-1612680194',
    category: 'Self-Help',
    subcategory: 'Personal Finance',
    condition: 'new',
    conditionDescription: 'Fresh stock direct from authorized Indian distributor.',
    price: 199,
    mrp: 399,
    stock: 18,
    rating: 4.7,
    reviewCount: 710,
    language: 'English',
    format: 'paperback',
    pages: 336,
    publicationYear: 2017,
    description: 'Rich Dad Poor Dad is Robert Kiyosaki’s story of growing up with two dads — his real father and the father of his best friend, his rich dad — and the ways in which both men shaped his thoughts about money and investing.',
    coverGradient: 'linear-gradient(160deg, #D6A419, #A87A0E)',
    accentColor: '#D6A419',
    featured: false,
    isBestseller: true,
    isFiftyPercentOff: true,
    tags: ['Finance', 'Money', 'Bestseller'],
    conditionOptions: [
      { condition: 'new', price: 199, stock: 18, description: 'Brand new publisher copy' },
      { condition: 'good', price: 129, stock: 10, description: 'Neat reading copy, complete pages' }
    ]
  },
  {
    id: 'book-8',
    title: "Harry Potter and the Sorcerer's Stone",
    author: 'J.K. Rowling',
    publisher: 'Bloomsbury Childrens',
    isbn: '978-1408855652',
    category: "Children's",
    subcategory: 'Fantasy & Magic',
    condition: 'good',
    conditionDescription: 'Complete collector edition, firm binding, vibrant cover art.',
    price: 219,
    mrp: 599,
    stock: 5,
    rating: 4.9,
    reviewCount: 1200,
    language: 'English',
    format: 'paperback',
    pages: 352,
    publicationYear: 2014,
    description: 'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his aunt and uncle.',
    coverGradient: 'linear-gradient(160deg, #3A3F32, #22291F)',
    accentColor: '#22291F',
    featured: false,
    isBestseller: true,
    isFiftyPercentOff: true,
    tags: ['Fantasy', 'Magic', 'Classics'],
    conditionOptions: [
      { condition: 'like_new', price: 289, stock: 3, description: 'Crisp spine, no creases, vibrant cover' },
      { condition: 'good', price: 219, stock: 5, description: 'Light corner wear, immaculate text' }
    ]
  },
  {
    id: 'book-9',
    title: 'गोदान (Godaan)',
    author: 'Munshi Premchand',
    publisher: 'Rajkamal Prakashan',
    isbn: '978-8126715694',
    category: 'Fiction',
    subcategory: 'Hindi Literature',
    condition: 'good',
    conditionDescription: 'Classic Hindi masterwork, solid binding, Hindi typography intact.',
    price: 89,
    mrp: 225,
    stock: 15,
    rating: 4.9,
    reviewCount: 380,
    language: 'Hindi',
    format: 'paperback',
    pages: 360,
    publicationYear: 2018,
    description: 'गोदान मुंशी प्रेमचंद का सबसे प्रसिद्ध उपन्यास है। इसमें भारतीय ग्रामीण समाज, किसानों के संघर्ष, ऋण जाल और होरी के जीवन की मार्मिक कथा वर्णित है।',
    coverGradient: 'linear-gradient(160deg, #2F6657, #1F4E42)',
    accentColor: '#2F6657',
    featured: true,
    isUnder99: true,
    isFiftyPercentOff: true,
    tags: ['99 Store', 'Hindi Literature', 'Premchand'],
    conditionOptions: [
      { condition: 'like_new', price: 119, stock: 8, description: 'New condition from recent reprint' },
      { condition: 'good', price: 89, stock: 15, description: 'Gently read, all Hindi text clear' }
    ]
  },
  {
    id: 'book-10',
    title: 'गुनाहों का देवता (Gunahon Ka Devta)',
    author: 'Dharamvir Bharati',
    publisher: 'Bharatiya Jnanpith',
    isbn: '978-8126300181',
    category: 'Fiction',
    subcategory: 'Romantic Classic',
    condition: 'like_new',
    conditionDescription: 'Mint condition classic novel of love and sacrifice in Allahabad.',
    price: 99,
    mrp: 250,
    stock: 11,
    rating: 4.9,
    reviewCount: 420,
    language: 'Hindi',
    format: 'paperback',
    pages: 288,
    publicationYear: 2019,
    description: 'गुनाहों का देवता धर्मवीर भारती का अद्वितीय उपन्यास है जो चंदर और सुधा के अलौकिक प्रेम की अमर दास्तान है। हर सच्चे पाठक के दिल को छू लेने वाली कृति।',
    coverGradient: 'linear-gradient(160deg, #B3261E, #7A1A15)',
    accentColor: '#B3261E',
    featured: false,
    isUnder99: true,
    isFiftyPercentOff: true,
    tags: ['99 Store', 'Hindi', 'Classic Romance'],
    conditionOptions: [
      { condition: 'like_new', price: 99, stock: 11, description: 'Mint preservation, pristine edges' }
    ]
  },
  {
    id: 'book-11',
    title: 'Concepts of Physics (Part 1)',
    author: 'Dr. H.C. Verma',
    publisher: 'Bharati Bhawan',
    isbn: '978-8177091878',
    category: 'Textbooks',
    subcategory: 'Engineering & JEE Preparation',
    condition: 'good',
    conditionDescription: 'The gold standard for JEE Physics. Diagram pages clean, solutions intact.',
    price: 249,
    mrp: 495,
    stock: 8,
    rating: 4.9,
    reviewCount: 760,
    language: 'English',
    format: 'paperback',
    pages: 462,
    publicationYear: 2021,
    description: 'Renowned classic text book by Dr. H.C. Verma covering mechanics, optics, and thermodynamics. Indispensable for senior school physics and competitive entrance exams.',
    coverGradient: 'linear-gradient(160deg, #1F4E42, #142823)',
    accentColor: '#1F4E42',
    featured: false,
    isFiftyPercentOff: true,
    tags: ['Textbook', 'JEE', 'Physics', 'Academics'],
    conditionOptions: [
      { condition: 'like_new', price: 310, stock: 4, description: 'Almost unread, no pencil marks' },
      { condition: 'good', price: 249, stock: 8, description: 'Light pencil notations on 2 chapters, fully legible' }
    ]
  },
  {
    id: 'book-12',
    title: 'Wings of Fire: An Autobiography',
    author: 'A.P.J. Abdul Kalam & Arun Tiwari',
    publisher: 'Universities Press',
    isbn: '978-8173711466',
    category: 'Biography',
    subcategory: 'Inspirational Biography',
    condition: 'good',
    conditionDescription: 'The inspiring life journey of the Missile Man of India. Clean text.',
    price: 99,
    mrp: 295,
    stock: 20,
    rating: 4.9,
    reviewCount: 950,
    language: 'English',
    format: 'paperback',
    pages: 180,
    publicationYear: 2000,
    description: 'An autobiography of Dr APJ Abdul Kalam, former President of India. A story of a boy from humble beginnings who rose to pioneer India’s missile defense systems and aerospace endeavors.',
    coverGradient: 'linear-gradient(160deg, #D6A419, #A87A0E)',
    accentColor: '#D6A419',
    featured: false,
    isUnder99: true,
    isFiftyPercentOff: true,
    tags: ['99 Store', 'Biography', 'Kalam', 'Inspirational'],
    conditionOptions: [
      { condition: 'like_new', price: 149, stock: 7, description: 'Crisp cover, no creases' },
      { condition: 'good', price: 99, stock: 20, description: 'Clean readable copy, complete photo plates' }
    ]
  },
  {
    id: 'book-13',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    publisher: 'Harriman House',
    isbn: '978-9390166268',
    category: 'Self-Help',
    subcategory: 'Behavioral Finance',
    condition: 'like_new',
    conditionDescription: 'Timeless lessons on wealth, greed, and happiness. Superb copy.',
    price: 169,
    mrp: 399,
    stock: 13,
    rating: 4.8,
    reviewCount: 680,
    language: 'English',
    format: 'paperback',
    pages: 256,
    publicationYear: 2020,
    description: 'Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people. 19 short stories exploring the strange ways people think about money.',
    coverGradient: 'linear-gradient(160deg, #3A3F32, #22291F)',
    accentColor: '#22291F',
    featured: true,
    isBestseller: true,
    isFiftyPercentOff: true,
    tags: ['Money', 'Finance', 'Behavioral Science'],
    conditionOptions: [
      { condition: 'new', price: 239, stock: 6, description: 'Unopened publisher copy' },
      { condition: 'like_new', price: 169, stock: 13, description: 'Read once with bookmark, immaculate' }
    ]
  },
  {
    id: 'book-14',
    title: 'Ponniyin Selvan (Part 1 - 5 Set)',
    author: 'Kalki Krishnamurthy',
    publisher: 'Vanathi Pathippakam',
    isbn: '978-8182701440',
    category: 'Fiction',
    subcategory: 'Historical Fiction',
    condition: 'good',
    conditionDescription: 'Complete 5-volume historical magnum opus set in Tamil.',
    price: 499,
    mrp: 1200,
    stock: 3,
    rating: 5.0,
    reviewCount: 410,
    language: 'Tamil',
    format: 'paperback',
    pages: 1420,
    publicationYear: 2019,
    description: 'The monumental historical novel by Kalki weaving the palace intrigue, maritime voyages, and bravery of the Chola empire. Includes illustrations.',
    coverGradient: 'linear-gradient(160deg, #2F6657, #1F4E42)',
    accentColor: '#2F6657',
    featured: false,
    isBestseller: true,
    isFiftyPercentOff: true,
    tags: ['Tamil Classic', 'Historical Fiction', 'Collector Set'],
    conditionOptions: [
      { condition: 'good', price: 499, stock: 3, description: 'All 5 volumes intact in clean slipcase' }
    ]
  },
  {
    id: 'book-15',
    title: 'The Palace of Illusions',
    author: 'Chitra Banerjee Divakaruni',
    publisher: 'Picador India',
    isbn: '978-0330458535',
    category: 'Fiction',
    subcategory: 'Mythological Retelling',
    condition: 'like_new',
    conditionDescription: 'Panchali’s voice in the Mahabharata. Pristine condition with deckled edges.',
    price: 189,
    mrp: 450,
    stock: 8,
    rating: 4.8,
    reviewCount: 512,
    language: 'English',
    format: 'paperback',
    pages: 384,
    publicationYear: 2019,
    description: 'A reimagining of the world-famous Indian epic, the Mahabharata—told from the perspective of an amazing woman: Panchaali, the wife of the five Pandava brothers.',
    coverGradient: 'linear-gradient(160deg, #B3261E, #7A1A15)',
    accentColor: '#B3261E',
    featured: false,
    isFiftyPercentOff: true,
    tags: ['Mythology', 'Fiction', 'Indian Literature'],
    conditionOptions: [
      { condition: 'like_new', price: 189, stock: 8, description: 'Crisp copy, unworn corners' },
      { condition: 'good', price: 149, stock: 5, description: 'Clean text, spine slightly faded' }
    ]
  },
  {
    id: 'book-16',
    title: 'Tintin in Tibet',
    author: 'Hergé',
    publisher: 'Egmont Books',
    isbn: '978-1405206235',
    category: 'Comics & Manga',
    subcategory: 'Graphic Novel & Comics',
    condition: 'good',
    conditionDescription: 'Full color glossy graphic album, large format, clean pages.',
    price: 169,
    mrp: 499,
    stock: 5,
    rating: 4.9,
    reviewCount: 310,
    language: 'English',
    format: 'paperback',
    pages: 64,
    publicationYear: 2012,
    description: 'Tintin’s search for his friend Chang after a plane crash in the Himalayas. One of Hergé’s most heartfelt graphic masterworks exploring friendship and the legendary Yeti.',
    coverGradient: 'linear-gradient(160deg, #D6A419, #A87A0E)',
    accentColor: '#D6A419',
    featured: false,
    isFiftyPercentOff: true,
    tags: ['Comics', 'Graphic Novel', 'Tintin', 'Adventure'],
    conditionOptions: [
      { condition: 'good', price: 169, stock: 5, description: 'Full color intact, spine edge reinforced neatly' }
    ]
  }
];

export const MOCK_REVIEWS: Record<string, Review[]> = {
  'book-1': [
    {
      id: 'rev-1',
      bookId: 'book-1',
      userName: 'Tanvi Deshmukh',
      userCity: 'Pune',
      verifiedPurchase: true,
      conditionPurchased: 'good',
      rating: 5,
      date: '14 Sep 2026',
      comment: 'Arrived in the signature Panna recycled paper sleeve with the quality verified stamp! The book is in virtually immaculate condition for ₹149. Couldn’t put this thriller down.',
      helpfulCount: 28
    },
    {
      id: 'rev-2',
      bookId: 'book-1',
      userName: 'Aakash Mehra',
      userCity: 'Delhi',
      verifiedPurchase: true,
      conditionPurchased: 'like_new',
      rating: 5,
      date: '02 Sep 2026',
      comment: 'Saved ₹250 compared to MRP. Fast delivery to South Delhi within 2 days. Will buy all my books from Panna from now on!',
      helpfulCount: 14
    }
  ],
  'book-2': [
    {
      id: 'rev-3',
      bookId: 'book-2',
      userName: 'Suresh Raman',
      userCity: 'Bengaluru',
      verifiedPurchase: true,
      conditionPurchased: 'like_new',
      rating: 5,
      date: '11 Sep 2026',
      comment: 'Condition was genuinely Like New as promised. Pages are white and spine has zero cracks. Essential reading for every curious mind.',
      helpfulCount: 42
    }
  ],
  'book-3': [
    {
      id: 'rev-4',
      bookId: 'book-3',
      userName: 'Meera Kulkarni',
      userCity: 'Mumbai',
      verifiedPurchase: true,
      conditionPurchased: 'good',
      rating: 5,
      date: '18 Sep 2026',
      comment: 'Got this in the 99 Store promotion! Hardcover edition for under a hundred rupees is unbelievable value. Lovely book on Okinawan secrets.',
      helpfulCount: 31
    }
  ]
};

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'PANNA50',
    discountType: 'flat',
    value: 50,
    minOrder: 299,
    description: 'Flat ₹50 OFF on orders above ₹299'
  },
  {
    code: 'READMORE',
    discountType: 'percentage',
    value: 15,
    minOrder: 499,
    maxDiscount: 150,
    description: '15% OFF up to ₹150 on book lovers cart above ₹499'
  },
  {
    code: 'FIRSTBOOK',
    discountType: 'flat',
    value: 40,
    minOrder: 199,
    description: 'Flat ₹40 OFF welcome gift for new readers'
  },
  {
    code: 'FREEDEL',
    discountType: 'flat',
    value: 49,
    minOrder: 349,
    description: 'Free shipping waiver on orders above ₹349'
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-panna-1',
  name: 'Raj Sinha',
  email: 'Rajsinha7462@gmail.com',
  phone: '+91 98765 43210',
  pannaCoins: 180,
  walletBalance: 320,
  readingGoal: {
    target: 18,
    completed: 11,
    year: 2026
  },
  savedAddresses: [
    {
      id: 'addr-1',
      fullName: 'Raj Sinha',
      phone: '+91 98765 43210',
      streetAddress: 'Flat 402, Greenfield Apartments, Sector 14',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122001',
      tag: 'Home',
      isDefault: true
    },
    {
      id: 'addr-2',
      fullName: 'Raj Sinha',
      phone: '+91 98765 43210',
      streetAddress: 'DLF Cyber City, Tower 10A, 6th Floor',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      tag: 'Office',
      isDefault: false
    }
  ],
  wishlist: ['book-4', 'book-6', 'book-13']
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'PANNA-82941',
    date: '16 Sep 2026',
    items: [
      {
        id: 'ci-prev-1',
        book: INITIAL_BOOKS[0], // The Silent Patient
        selectedCondition: 'good',
        price: 149,
        quantity: 1
      },
      {
        id: 'ci-prev-2',
        book: INITIAL_BOOKS[2], // Ikigai
        selectedCondition: 'good',
        price: 99,
        quantity: 1
      }
    ],
    subtotal: 248,
    discount: 40,
    couponCode: 'FIRSTBOOK',
    deliveryCharge: 0,
    donation: 10,
    coinsUsed: 0,
    coinsValue: 0,
    total: 218,
    shippingAddress: INITIAL_USER.savedAddresses[0],
    paymentMethod: 'upi',
    status: 'In Transit',
    estimatedDelivery: '20 Sep 2026',
    trackingNumber: 'DTDC-IND-778219',
    canReturnUntil: '27 Sep 2026'
  }
];

export const INITIAL_SELL_REQUESTS: SellRequest[] = [
  {
    id: 'SELL-90412',
    date: '17 Sep 2026',
    books: [
      {
        title: 'Man’s Search for Meaning',
        author: 'Viktor Frankl',
        category: 'Non-Fiction',
        format: 'paperback',
        condition: 'good',
        estimatedQuote: 120
      },
      {
        title: 'The Rudest Book Ever',
        author: 'Shwetabh Gangwar',
        category: 'Self-Help',
        format: 'paperback',
        condition: 'like_new',
        estimatedQuote: 140
      }
    ],
    totalQuote: 260,
    payoutMode: 'wallet',
    payoutBonus: 39, // 15% wallet credit bonus
    pickupAddress: INITIAL_USER.savedAddresses[0],
    pickupSlot: 'Tomorrow, 2:00 PM – 5:00 PM',
    status: 'Pickup Scheduled'
  }
];

export const INITIAL_COUPONS: Coupon[] = AVAILABLE_COUPONS;
export const INITIAL_REVIEWS: Review[] = Object.values(MOCK_REVIEWS).flat();
