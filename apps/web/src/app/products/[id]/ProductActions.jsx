"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUiStore } from "@/store/useUiStore";

export default function ProductActions({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { setCartOpen } = useUiStore();

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setCartOpen(true);
  };

  return (
    <div className="space-y-6 pt-4 border-t">
      {/* Quantity & Favorite button row */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Quantity
        </span>
        
        <div className="flex items-center gap-3 bg-muted border rounded-2xl p-1.5">
          <button
            onClick={handleDecrement}
            className="p-1.5 hover:bg-background rounded-xl text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-base min-w-[32px] text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="p-1.5 hover:bg-background rounded-xl text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Favorite toggle */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`p-3 border rounded-2xl transition-all cursor-pointer ${
            isFavorite
              ? "bg-rose-50 border-rose-200 text-rose-500"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-rose-500" : ""}`} />
        </button>
      </div>

      {/* Add to Cart button */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-stone-950 font-bold py-4 rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Basket
      </button>
    </div>
  );
}
