"use client";

import Link from "next/link";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUiStore } from "@/store/useUiStore";
import { formatCurrency } from "@/utils";
import { motion } from "framer-motion";

// Helper component to render offline-safe, responsive, premium vectors of sweets
export function SweetVector({ category, color, name }) {
  if (category === "macarons") {
    return (
      <svg className="w-24 h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top shell */}
        <path d="M15 42C15 26 30 20 50 20C70 20 85 26 85 42C85 46 75 48 50 48C25 48 15 46 15 42Z" fill="currentColor" className="opacity-90" />
        <path d="M15 42C15 44 20 46 30 46C40 46 45 44 50 44C55 44 60 46 70 46C80 46 85 44 85 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="brightness-90" />
        {/* Filling */}
        <rect x="18" y="47" width="64" height="6" rx="3" fill="#FFF" className="mix-blend-overlay opacity-80" />
        <rect x="18" y="48" width="64" height="4" rx="2" fill="#E11D48" className="opacity-75" /> {/* Filling accent */}
        {/* Bottom shell */}
        <path d="M15 58C15 74 30 80 50 80C70 80 85 74 85 58C85 54 75 52 50 52C25 52 15 54 15 58Z" fill="currentColor" className="opacity-90" />
        <path d="M15 58C15 56 20 54 30 54C40 54 45 56 50 56C55 56 60 54 70 54C80 54 85 56 85 58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="brightness-90" />
      </svg>
    );
  }

  if (category === "chocolates") {
    const isTruffle = name.toLowerCase().includes("truffle");
    return (
      <svg className="w-24 h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {isTruffle ? (
          // Dusted cocoa truffle
          <>
            <circle cx="50" cy="50" r="28" fill="currentColor" />
            {/* Cocoa dust speckles */}
            <path d="M38 35Q42 32 45 38M55 30Q62 33 58 40M32 52Q30 60 38 58M58 65Q64 68 62 60" stroke="#78350F" strokeWidth="3" strokeLinecap="round" className="opacity-50" />
            <circle cx="45" cy="42" r="2" fill="#FBBF24" className="animate-pulse" /> {/* Gold dust */}
            <circle cx="52" cy="58" r="1.5" fill="#FBBF24" />
          </>
        ) : (
          // Shiny painted bonbon
          <>
            <rect x="25" y="25" width="50" height="50" rx="14" fill="currentColor" />
            {/* Shimmer/Reflection */}
            <path d="M32 32C32 29 45 28 55 32C65 36 68 45 68 55C60 62 40 62 32 55C32 45 32 32 32 32Z" fill="white" className="opacity-15 mix-blend-overlay" />
            {/* Artistic Swirl */}
            <path d="M30 60C38 65 48 35 55 42C62 50 68 35 70 40" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
      </svg>
    );
  }

  if (category === "pastries") {
    const isDome = name.toLowerCase().includes("dome");
    return (
      <svg className="w-24 h-24 drop-shadow-lg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {isDome ? (
          // Mousse Dome
          <>
            <path d="M20 70C20 40 33 25 50 25C67 25 80 40 80 70C80 73 70 75 50 75C30 75 20 73 20 70Z" fill="currentColor" />
            {/* Mirror glaze shine */}
            <path d="M30 45C33 32 45 30 50 30" stroke="white" strokeWidth="4" strokeLinecap="round" className="opacity-30" />
            {/* Biscuit base */}
            <rect x="18" y="70" width="64" height="6" rx="3" fill="#D97706" />
            {/* Glaze swirl */}
            <path d="M22 68C32 63 45 72 50 65C55 58 68 72 78 68" stroke="#BE123C" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          // Mille-Feuille
          <>
            {/* Bottom puff layer */}
            <rect x="18" y="66" width="64" height="8" rx="2" fill="#D97706" />
            {/* Cream blobs */}
            <circle cx="28" cy="58" r="7" fill="#FEF3C7" />
            <circle cx="43" cy="58" r="7" fill="#FEF3C7" />
            <circle cx="58" cy="58" r="7" fill="#FEF3C7" />
            <circle cx="72" cy="58" r="7" fill="#FEF3C7" />
            {/* Middle puff layer */}
            <rect x="18" y="48" width="64" height="8" rx="2" fill="#D97706" />
            {/* Raspberries on top */}
            <circle cx="33" cy="38" r="6" fill="#BE123C" />
            <circle cx="50" cy="36" r="6" fill="#BE123C" />
            <circle cx="67" cy="38" r="6" fill="#BE123C" />
            {/* Top puff layer */}
            <rect x="18" y="28" width="64" height="8" rx="2" fill="#D97706" />
            {/* Sugar dust streaks */}
            <line x1="24" y1="24" x2="36" y2="36" stroke="white" strokeWidth="2" className="opacity-60" />
            <line x1="44" y1="24" x2="56" y2="36" stroke="white" strokeWidth="2" className="opacity-60" />
            <line x1="64" y1="24" x2="76" y2="36" stroke="white" strokeWidth="2" className="opacity-60" />
          </>
        )}
      </svg>
    );
  }

  // Gifts & Hampers
  return (
    <svg className="w-24 h-24 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Box base */}
      <rect x="22" y="42" width="56" height="38" rx="4" fill="currentColor" />
      {/* Box lid */}
      <rect x="18" y="32" width="64" height="12" rx="3" fill="currentColor" className="brightness-110" />
      {/* Gift Ribbon */}
      <rect x="46" y="32" width="8" height="48" fill="#E11D48" />
      <rect x="18" y="52" width="64" height="8" fill="#E11D48" />
      {/* Ribbon bow */}
      <circle cx="42" cy="24" r="8" stroke="#E11D48" strokeWidth="4" />
      <circle cx="58" cy="24" r="8" stroke="#E11D48" strokeWidth="4" />
      <path d="M50 28L50 36" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { setCartOpen, setQuickViewProduct } = useUiStore();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setCartOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-card text-card-foreground rounded-3xl overflow-hidden border border-border/80 shadow-sm hover:shadow-xl transition-all flex flex-col relative"
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-4 left-4 z-10 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
          {product.badge}
        </span>
      )}

      {/* Visual Header / Showcase */}
      <Link href={`/products/${product.id}`} className="block relative">
        <div className={`w-full aspect-square bg-gradient-to-br ${product.color} flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-[1.02]`}>
          <div className={`${product.textColor} transition-transform duration-500 group-hover:scale-110`}>
            <SweetVector category={product.category} color={product.color} name={product.name} />
          </div>
        </div>
      </Link>

      {/* Info Body */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-semibold">{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg leading-snug group-hover:text-amber-600 transition-colors mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Cart Actions */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <span className="font-extrabold text-xl text-stone-900">
            {formatCurrency(product.price)}
          </span>

          <div className="flex items-center gap-2">
            {/* View Details */}
            <Link
              href={`/products/${product.id}`}
              className="p-2.5 bg-muted hover:bg-amber-100 hover:text-amber-700 rounded-full transition-colors hidden sm:flex"
              title="View details"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Quick Add */}
            <button
              onClick={handleQuickAdd}
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 p-2.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center cursor-pointer"
              title="Quick Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
