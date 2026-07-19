"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUiStore } from "@/store/useUiStore";
import { formatCurrency } from "@/utils";
import { SweetVector } from "@/features/home/components/ProductCard";
import ProductBadge from "./ProductBadge";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { setCartOpen } = useUiStore();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Compute discount percentage dynamically
  const discountPercent = Math.round(((product.price - product.discountPrice) / product.price) * 100);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      // Map properties to match what our global cart/Zustand store expects
      const cartItem = {
        ...product,
        price: product.discountPrice
      };
      addToCart(cartItem, 1);
      setCartOpen(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col relative"
    >
      {/* Badges container */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <ProductBadge text={product.badge} stock={product.stock} />
        {discountPercent > 0 && product.stock > 0 && (
          <span className="bg-rose-500 text-white text-[9px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full shadow-xs w-fit">
            Save {discountPercent}%
          </span>
        )}
      </div>

      {/* Action Overlay Buttons (Wishlist, Quick View) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
        {/* Wishlist toggle */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`p-2.5 rounded-full border shadow-xs transition-colors cursor-pointer ${
            isWishlisted
              ? "bg-rose-50 border-rose-100 text-rose-500"
              : "bg-white hover:bg-stone-50 border-stone-100 text-stone-500"
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
        </button>

        {/* Quick View Details Redirect */}
        <Link
          href={`/products/${product.slug}`}
          className="p-2.5 rounded-full border bg-white hover:bg-stone-50 border-stone-100 text-stone-500 shadow-xs flex items-center justify-center cursor-pointer"
          title="Quick View Product"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>

      {/* Visual Showcase wrapper */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden">
        <div className={`w-full aspect-square bg-gradient-to-br ${product.color || "from-amber-50 to-orange-100"} flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-[1.02]`}>
          <div className={`${product.textColor || "text-amber-800"} transition-transform duration-500 group-hover:scale-110`}>
            <SweetVector type={product.sweetType} color={product.color} />
          </div>
        </div>
      </Link>

      {/* Details Box */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category & Stars Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[9px] uppercase font-bold tracking-widest text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-bold text-stone-850">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-muted-foreground font-normal text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title & Short Description */}
          <div className="space-y-1">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-extrabold text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Pricing, Weight & Cart */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-stone-100 mt-auto">
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground font-medium">{product.weight}</p>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-base text-stone-900">
                {formatCurrency(product.discountPrice)}
              </span>
              <span className="text-xs text-muted-foreground line-through font-medium">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-3 rounded-full transition-all shadow-xs flex items-center justify-center cursor-pointer ${
              product.stock <= 0
                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950"
            }`}
            title={product.stock <= 0 ? "Out of Stock" : "Add to Basket"}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
