// Andhra Sweets Premium E-commerce Mock Database
export const CATEGORIES = [
  {
    id: "cat1",
    title: "Traditional Sweets",
    description: "Authentic Andhra heritage like Putharekulu and Ariselu",
    imageBg: "from-amber-100 to-orange-200",
    slug: "traditional-sweets",
    sweetType: "traditional"
  },
  {
    id: "cat2",
    title: "Dry Fruit Sweets",
    description: "Premium sugar-free and rich dry fruit assortments",
    imageBg: "from-amber-250 from-amber-100 to-yellow-200",
    slug: "dry-fruit-sweets",
    sweetType: "dryfruit"
  },
  {
    id: "cat3",
    title: "Milk Sweets",
    description: "Velvety classics crafted from pure condensed milk",
    imageBg: "from-orange-50 to-orange-100",
    slug: "milk-sweets",
    sweetType: "milk"
  },
  {
    id: "cat4",
    title: "Bengali Sweets",
    description: "Soft, spongy delights soaked in delicious syrups",
    imageBg: "from-rose-50 to-rose-100",
    slug: "bengali-sweets",
    sweetType: "bengali"
  },
  {
    id: "cat5",
    title: "Namkeen",
    description: "Crispy, savory Andhra snacks and spice mixtures",
    imageBg: "from-yellow-100 to-amber-200",
    slug: "namkeen",
    sweetType: "savory"
  },
  {
    id: "cat6",
    title: "Gift Boxes",
    description: "Specially curated festival hampers and sweet boxes",
    imageBg: "from-purple-100 to-pink-200",
    slug: "gift-boxes",
    sweetType: "gift"
  }
];

export const PRODUCTS = [
  {
    id: "h1",
    name: "Special Atreyapuram Bellam Putharekulu",
    weight: "250g (10 Pieces)",
    rating: 4.9,
    originalPrice: 350,
    discountPrice: 299,
    category: "Traditional Sweets",
    color: "from-amber-100 to-orange-200",
    textColor: "text-amber-800",
    badge: "Best Seller",
    sweetType: "traditional"
  },
  {
    id: "h2",
    name: "Premium Kaju Katli",
    weight: "500g",
    rating: 4.8,
    originalPrice: 650,
    discountPrice: 599,
    category: "Dry Fruit Sweets",
    color: "from-amber-50 to-yellow-150",
    textColor: "text-yellow-800",
    badge: "Festive Special",
    sweetType: "dryfruit"
  },
  {
    id: "h3",
    name: "Ghee Ariselu",
    weight: "500g",
    rating: 4.7,
    originalPrice: 420,
    discountPrice: 380,
    category: "Traditional Sweets",
    color: "from-orange-100 to-amber-200",
    textColor: "text-orange-950",
    badge: "Traditional",
    sweetType: "traditional"
  },
  {
    id: "h4",
    name: "Kakinada Gaja Kaja",
    weight: "500g",
    rating: 4.8,
    originalPrice: 380,
    discountPrice: 330,
    category: "Traditional Sweets",
    color: "from-amber-100 to-yellow-200",
    textColor: "text-amber-900",
    badge: "Famous",
    sweetType: "traditional"
  },
  {
    id: "h5",
    name: "Pure Ghee Palkova",
    weight: "250g",
    rating: 4.9,
    originalPrice: 280,
    discountPrice: 240,
    category: "Milk Sweets",
    color: "from-orange-50 to-orange-150",
    textColor: "text-orange-900",
    badge: "Chef Special",
    sweetType: "milk"
  },
  {
    id: "h6",
    name: "Andhra Kara Boondi",
    weight: "250g",
    rating: 4.6,
    originalPrice: 180,
    discountPrice: 150,
    category: "Namkeen",
    color: "from-yellow-100 to-amber-250",
    textColor: "text-yellow-950",
    badge: "Spicy & Hot",
    sweetType: "savory"
  },
  {
    id: "h7",
    name: "Assorted Dry Fruit Roll Box",
    weight: "500g",
    rating: 4.9,
    originalPrice: 850,
    discountPrice: 749,
    category: "Dry Fruit Sweets",
    color: "from-amber-200 to-orange-300",
    textColor: "text-orange-950",
    badge: "Luxury Gift",
    sweetType: "dryfruit"
  },
  {
    id: "h8",
    name: "Signature Festival Sweet Box",
    weight: "1kg (Assorted)",
    rating: 5.0,
    originalPrice: 1200,
    discountPrice: 999,
    category: "Gift Boxes",
    color: "from-purple-100 to-pink-200",
    textColor: "text-purple-900",
    badge: "Top Rated",
    sweetType: "gift"
  }
];

export const BEST_SELLERS = [
  {
    id: "b1",
    name: "Atreyapuram Bellam Putharekulu",
    weight: "250g",
    rating: 4.9,
    originalPrice: 350,
    discountPrice: 299,
    category: "Traditional Sweets",
    color: "from-amber-100 to-orange-200",
    textColor: "text-amber-800",
    sweetType: "traditional"
  },
  {
    id: "b2",
    name: "Premium Kaju Katli",
    weight: "500g",
    rating: 4.8,
    originalPrice: 650,
    discountPrice: 599,
    category: "Dry Fruit Sweets",
    color: "from-amber-50 to-yellow-150",
    textColor: "text-yellow-800",
    sweetType: "dryfruit"
  },
  {
    id: "b3",
    name: "Ghee Ariselu",
    weight: "500g",
    rating: 4.7,
    originalPrice: 420,
    discountPrice: 380,
    category: "Traditional Sweets",
    color: "from-orange-100 to-amber-200",
    textColor: "text-orange-950",
    sweetType: "traditional"
  },
  {
    id: "b4",
    name: "Pure Ghee Palkova",
    weight: "250g",
    rating: 4.9,
    originalPrice: 280,
    discountPrice: 240,
    category: "Milk Sweets",
    color: "from-orange-50 to-orange-150",
    textColor: "text-orange-900",
    sweetType: "milk"
  },
  {
    id: "b5",
    name: "Andhra Chekkalu",
    weight: "250g",
    rating: 4.7,
    originalPrice: 190,
    discountPrice: 160,
    category: "Namkeen",
    color: "from-yellow-100 to-amber-200",
    textColor: "text-amber-950",
    sweetType: "savory"
  }
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Srinivas Rao",
    rating: 5,
    avatarColor: "bg-orange-100 text-orange-700",
    initials: "SR",
    review: "The Bellam Putharekulu tastes exactly like the ones made in Atreyapuram! The ghee aroma is rich, and the layers are perfectly paper-thin."
  },
  {
    id: "t2",
    name: "Priya Krishna",
    rating: 5,
    avatarColor: "bg-rose-100 text-rose-700",
    initials: "PK",
    review: "I ordered the Assorted Sweet Box for a festival gift. Excellent, high-quality packaging and timely delivery. The Kaju Katli was extremely smooth."
  },
  {
    id: "t3",
    name: "Ananth Kumar",
    rating: 4,
    avatarColor: "bg-amber-100 text-amber-700",
    initials: "AK",
    review: "Their spicy Namkeen snacks are incredible. Kara Boondi had the right amount of curry leaves and cashews. A perfect teatime snack!"
  }
];
