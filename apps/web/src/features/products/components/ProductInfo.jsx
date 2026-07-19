"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Heart, Share2, ShoppingBag, ShoppingCart, Check, AlertTriangle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUiStore } from "@/store/useUiStore";
import { formatCurrency } from "@/utils";
import QuantitySelector from "./QuantitySelector";

export default function ProductInfo({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { setCartOpen } = useUiStore();
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Weight options (baseline from data, multiplier options)
  const weightTiers = [
    { label: "250g", multiplier: 1.0 },
    { label: "500g", multiplier: 1.8 },
    { label: "1kg", multiplier: 3.4 },
  ];
  const [selectedWeight, setSelectedWeight] = useState(weightTiers[0].label);

  // Compute price multiplier
  const activeWeightTier = weightTiers.find((w) => w.label === selectedWeight);
  const multiplier = activeWeightTier ? activeWeightTier.multiplier : 1.0;
  
  const activeOriginalPrice = Math.round(product.price * multiplier);
  const activeDiscountPrice = Math.round(product.discountPrice * multiplier);
  const discountPercent = Math.round(((activeOriginalPrice - activeDiscountPrice) / activeOriginalPrice) * 100);

  const handleShare = () => {
    const pageUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: pageUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(pageUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToCart = () => {
    if (product.stock > 0) {
      const cartItem = {
        ...product,
        weight: `${selectedWeight} (Customized)`,
        price: activeDiscountPrice,
      };
      addToCart(cartItem, quantity);
      setCartOpen(true);
    }
  };

  const handleBuyNow = () => {
    if (product.stock > 0) {
      const cartItem = {
        ...product,
        weight: `${selectedWeight} (Customized)`,
        price: activeDiscountPrice,
      };
      addToCart(cartItem, quantity);
      router.push("/checkout");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Category, Brand & Share Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {product.category}
          </span>
          <span className="text-stone-400">•</span>
          <span className="text-stone-600">Brand: Andhra SweetShop</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-500 hover:text-stone-700 transition-colors cursor-pointer relative"
            title="Share sweet link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            {copiedLink && (
              <span className="absolute right-full mr-2 top-1.5 whitespace-nowrap bg-stone-900 text-white text-[10px] px-2 py-1 rounded shadow-xs font-bold animate-fade-in">
                Link Copied!
              </span>
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
              isWishlisted
                ? "bg-rose-50 border-rose-100 text-rose-500"
                : "border-stone-200 hover:bg-stone-50 text-stone-400 hover:text-stone-700"
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
        {product.name}
      </h1>

      {/* Ratings & Reviews */}
      <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-1 font-extrabold text-stone-850 text-sm">
          <Star className="w-4.5 h-4.5 fill-amber-500 text-amber-500" />
          <span>{product.rating}</span>
        </div>
        <span className="text-stone-300">|</span>
        <span className="text-xs text-muted-foreground font-semibold">
          {product.reviewCount} customer reviews
        </span>
        <span className="text-stone-300">|</span>
        <span className="text-xs font-bold flex items-center gap-1">
          {product.stock > 0 ? (
            <span className="text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock ({product.stock} left)
            </span>
          ) : (
            <span className="text-rose-500 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Out of Stock
            </span>
          )}
        </span>
      </div>

      {/* Prices */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-stone-900">
            {formatCurrency(activeDiscountPrice)}
          </span>
          <span className="text-sm text-muted-foreground line-through font-medium">
            {formatCurrency(activeOriginalPrice)}
          </span>
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs">
              Save {discountPercent}%
            </span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground font-semibold">Inclusive of all local taxes</p>
      </div>

      {/* Description */}
      <p className="text-xs md:text-sm text-stone-700 leading-relaxed">
        {product.description}
      </p>

      {/* Weight Selector */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wider block">
          Select Package Weight
        </span>
        <div className="flex gap-3">
          {weightTiers.map((tier) => {
            const isSelected = selectedWeight === tier.label;
            return (
              <button
                key={tier.label}
                onClick={() => setSelectedWeight(tier.label)}
                className={`px-5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 border-amber-500 text-stone-950 shadow-xs"
                    : "bg-white hover:bg-stone-50 border-stone-200 text-stone-700"
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Selector & Order Buttons */}
      <div className="space-y-4 pt-4 border-t border-stone-100">
        {product.stock > 0 ? (
          <div className="space-y-4">
            {/* Quantity Row */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                Quantity:
              </span>
              <QuantitySelector quantity={quantity} max={product.stock} onChange={setQuantity} />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-bold py-4 px-6 rounded-2xl text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              
              <button
                onClick={handleBuyNow}
                className="bg-stone-950 hover:bg-stone-900 active:scale-98 text-white font-bold py-4 px-6 rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Buy Now
              </button>
            </div>
          </div>
        ) : (
          <button
            disabled
            className="w-full bg-stone-100 border text-stone-400 font-bold py-4 rounded-2xl text-xs cursor-not-allowed flex items-center justify-center gap-2"
          >
            Out of Stock
          </button>
        )}
      </div>

      {/* Trust Badges / Shipping details */}
      <div className="bg-stone-50/50 border p-4.5 rounded-2xl space-y-2 text-xs font-semibold text-stone-700">
        <p className="flex items-center gap-2">
          🚚 <span className="text-stone-500 font-medium">Delivery:</span> Ships in 24 hours (Free on orders above ₹499)
        </p>
        <p className="flex items-center gap-2">
          📦 <span className="text-stone-500 font-medium">Shelf Life:</span> Fresh for {product.shelfLife}
        </p>
        <p className="flex items-center gap-2">
          🌡️ <span className="text-stone-500 font-medium">Storage:</span> {product.storage}
        </p>
      </div>

    </div>
  );
}
