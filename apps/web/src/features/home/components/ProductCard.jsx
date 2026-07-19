"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUiStore } from "@/store/useUiStore";
import { formatCurrency } from "@/utils";
import { motion } from "framer-motion";

// Custom Andhra Sweet Vector illustration renderer
export function SweetVector({ type, color }) {
  if (type === "traditional") {
    // Atreyapuram Putharekulu - folded layers with nuts
    return (
      <svg className="w-24 h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="32" width="60" height="24" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
        <rect x="25" y="40" width="50" height="24" rx="4" fill="#FEF3C7" stroke="#B45309" strokeWidth="2" opacity="0.9" />
        <circle cx="35" cy="44" r="1.5" fill="#78350F" />
        <circle cx="45" cy="48" r="1.2" fill="#78350F" />
        <circle cx="55" cy="46" r="1.5" fill="#78350F" />
        <circle cx="65" cy="50" r="1" fill="#78350F" />
        <circle cx="48" cy="42" r="1.5" fill="#D97706" />
        {/* Powdered sugar dust */}
        <circle cx="38" cy="36" r="1" fill="white" />
        <circle cx="58" cy="38" r="1" fill="white" />
        <circle cx="62" cy="45" r="1" fill="white" />
      </svg>
    );
  }

  if (type === "dryfruit") {
    // Kaju Katli diamond shape
    return (
      <svg className="w-24 h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 20L78 50L50 80L22 50Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
        {/* Silver leaf foil reflections */}
        <path d="M50 20L64 50L50 58L36 50Z" fill="white" opacity="0.7" />
        <path d="M50 58L68 50L50 80L32 50Z" fill="#CBD5E1" opacity="0.5" />
        <circle cx="48" cy="45" r="1.5" fill="white" className="animate-pulse" />
        <circle cx="54" cy="55" r="2" fill="white" />
      </svg>
    );
  }

  if (type === "milk") {
    // Palkova / Pedha - round compressed milk sweet
    return (
      <svg className="w-24 h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="28" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
        {/* Thumb impression */}
        <circle cx="50" cy="50" r="12" fill="#EAB308" opacity="0.6" />
        {/* Pistachio flake */}
        <ellipse cx="50" cy="48" rx="4" ry="2" fill="#22C55E" />
        <ellipse cx="46" cy="52" rx="3" ry="1.5" fill="#15803D" />
        {/* Almond flake */}
        <ellipse cx="54" cy="52" rx="3" ry="2" fill="#FEF3C7" />
      </svg>
    );
  }

  if (type === "bengali") {
    // Rasgulla/Rasmalai - spongy white balls in yellow milk
    return (
      <svg className="w-24 h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Creamy Milk Pool */}
        <circle cx="50" cy="50" r="32" fill="#FEF08A" opacity="0.4" />
        {/* Sweets */}
        <circle cx="42" cy="46" r="16" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
        <circle cx="58" cy="56" r="14" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
        {/* Saffron threads */}
        <path d="M42 38C44 40 43 44 41 46" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M58 48C60 50 59 54 57 56" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
        {/* Pistachio powder */}
        <circle cx="36" cy="52" r="1" fill="#22C55E" />
        <circle cx="62" cy="62" r="1" fill="#22C55E" />
      </svg>
    );
  }

  if (type === "savory") {
    // Andhra Chekkalu - flat crispy cracker
    return (
      <svg className="w-24 h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="28" fill="#D97706" stroke="#92400E" strokeWidth="2" />
        {/* Texture bump holes */}
        <circle cx="42" cy="42" r="1.5" fill="#78350F" />
        <circle cx="58" cy="40" r="1.5" fill="#78350F" />
        <circle cx="38" cy="54" r="1.5" fill="#78350F" />
        <circle cx="52" cy="56" r="1.5" fill="#78350F" />
        <circle cx="60" cy="50" r="1.5" fill="#78350F" />
        {/* Chana dal grains embedded */}
        <rect x="46" y="44" width="5" height="3" rx="1.5" transform="rotate(30 46 44)" fill="#FDE047" />
        <rect x="52" y="48" width="5" height="3" rx="1.5" transform="rotate(-15 52 48)" fill="#FDE047" />
        {/* Curry leaf leaf speck */}
        <path d="M42 48Q46 46 48 52" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Gift box / Assorted hampers
  return (
    <svg className="w-24 h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="42" width="56" height="38" rx="4" fill="currentColor" />
      <rect x="18" y="32" width="64" height="12" rx="3" fill="currentColor" className="brightness-110" />
      <rect x="46" y="32" width="8" height="48" fill="#F43F5E" />
      <rect x="18" y="52" width="64" height="8" fill="#F43F5E" />
      <circle cx="42" cy="24" r="8" stroke="#F43F5E" strokeWidth="4" />
      <circle cx="58" cy="24" r="8" stroke="#F43F5E" strokeWidth="4" />
    </svg>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { setCartOpen } = useUiStore();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Map home page fields to fit standard cart structure
  const formattedProduct = {
    ...product,
    price: product.discountPrice // use discountPrice as operational cart price
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(formattedProduct, 1);
    setCartOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col relative"
    >
      {/* Badge (e.g. 'Best Seller') */}
      {product.badge && (
        <span className="absolute top-4 left-4 z-10 bg-amber-500 text-stone-950 text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs">
          {product.badge}
        </span>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-full border transition-all cursor-pointer ${
          isWishlisted
            ? "bg-rose-50 border-rose-100 text-rose-500"
            : "bg-white/80 hover:bg-white border-stone-100 text-stone-400 hover:text-stone-700"
        }`}
        title="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
      </button>

      {/* Visual Showcase (Sweet illustration) */}
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden">
        <div className={`w-full aspect-square bg-gradient-to-br ${product.color} flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-[1.02]`}>
          <div className={`${product.textColor} transition-transform duration-500 group-hover:scale-110`}>
            <SweetVector type={product.sweetType} color={product.color} />
          </div>
        </div>
      </Link>

      {/* Content details */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-bold text-stone-850">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Name & Weight */}
          <div className="space-y-1">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-extrabold text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground">{product.weight}</p>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-lg text-stone-900">
              {formatCurrency(product.discountPrice)}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 rounded-full transition-all shadow-xs cursor-pointer flex items-center justify-center"
            title="Add to Basket"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
