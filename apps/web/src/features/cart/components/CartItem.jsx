"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Heart, Star } from "lucide-react";
import { formatCurrency } from "@/utils";
import { SweetVector } from "@/features/home/components/ProductCard";
import QuantitySelector from "./QuantitySelector";

export default function CartItem({ item, onUpdateQty, onRemove }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const subtotal = item.discountPrice * item.quantity;
  const isOutOfStock = item.stock <= 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-stone-200/80 rounded-3xl shadow-xs transition-shadow hover:shadow-md">
      
      {/* Product Image & Meta Column */}
      <div className="flex gap-4 items-center flex-1">
        {/* Image / Vector Illustration */}
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color || "from-amber-100 to-orange-100"} flex-shrink-0 flex items-center justify-center p-3 border border-stone-100`}>
          <div className={`${item.textColor || "text-amber-800"} scale-75`}>
            <SweetVector type={item.sweetType} />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <Link href={`/products/${item.slug}`} className="hover:text-amber-600 transition-colors">
            <h3 className="font-extrabold text-stone-900 text-sm leading-snug line-clamp-1">
              {item.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
            <span>{item.category}</span>
            <span>•</span>
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{item.weight}</span>
          </div>

          <div className="flex items-center gap-2 text-xs pt-1">
            {/* Stock status */}
            {item.stock > 0 ? (
              <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock ({item.stock} available)
              </span>
            ) : (
              <span className="text-rose-500 font-bold text-[10px]">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing and Quantity adjustment row */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
        
        {/* Quantity Controls */}
        <QuantitySelector
          quantity={item.quantity}
          stock={item.stock || 99}
          onUpdate={onUpdateQty}
        />

        {/* Pricing columns */}
        <div className="text-right min-w-[90px] space-y-0.5">
          <p className="text-xs font-medium text-stone-400 line-through">
            {formatCurrency(item.price * item.quantity)}
          </p>
          <p className="font-extrabold text-stone-900 text-sm sm:text-base">
            {formatCurrency(subtotal)}
          </p>
          <p className="text-[10px] font-bold text-stone-500">
            {formatCurrency(item.discountPrice)} / unit
          </p>
        </div>

        {/* Action icons (Wishlist, Trash) */}
        <div className="flex items-center gap-2">
          {/* Wishlist toggle */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isWishlisted
                ? "bg-rose-50 border-rose-100 text-rose-500"
                : "border-stone-200 hover:bg-stone-50 text-stone-400 hover:text-stone-700"
            }`}
            title="Move to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
          </button>

          {/* Remove item */}
          <button
            onClick={onRemove}
            className="p-2 rounded-xl border border-stone-200 hover:bg-rose-50 text-stone-450 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
            title="Remove from Cart"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
