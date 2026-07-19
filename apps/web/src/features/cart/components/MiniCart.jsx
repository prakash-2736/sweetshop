"use client";

import Link from "next/link";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useUiStore } from "@/store/useUiStore";
import { formatCurrency } from "@/utils";
import { SweetVector } from "@/features/home/components/ProductCard";
import CartDrawer from "./CartDrawer";
import QuantitySelector from "./QuantitySelector";

export default function MiniCart() {
  const { isCartOpen, setCartOpen } = useUiStore();
  const {
    cart,
    totals,
    count,
    updateQuantity,
    removeItem,
  } = useCart();

  const handleClose = () => setCartOpen(false);

  return (
    <CartDrawer isOpen={isCartOpen} onClose={handleClose}>
      <div className="flex flex-col h-full justify-between">
        
        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="p-4 rounded-full bg-amber-50 text-amber-500 border border-amber-100/65">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-[240px]">
                <p className="font-extrabold text-stone-900 text-sm">Your Basket is Empty</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Explore our premium sweet collections and add some to your order!
                </p>
              </div>
              <Link
                href="/products"
                onClick={handleClose}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-[10px] transition-all inline-block"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-stone-100">
              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex gap-3 items-center justify-between ${idx > 0 ? "pt-4" : ""}`}
                >
                  {/* Left Column: Image & Details */}
                  <div className="flex gap-3 items-center flex-1 min-w-0">
                    {/* Small visual illustration */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color || "from-amber-100 to-orange-100"} flex-shrink-0 flex items-center justify-center p-2 border border-stone-100`}>
                      <div className={`${item.textColor || "text-amber-800"} scale-60`}>
                        <SweetVector type={item.sweetType} />
                      </div>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={handleClose}
                        className="hover:text-amber-600 transition-colors block text-xs font-bold text-stone-900 truncate"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[9px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                        {item.weight}
                      </p>
                      <p className="text-[10px] text-stone-400 font-semibold">
                        {formatCurrency(item.discountPrice)} / unit
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Qty & Price */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <QuantitySelector
                      quantity={item.quantity}
                      stock={item.stock || 99}
                      onUpdate={(qty) => updateQuantity(item.id, qty)}
                    />
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-stone-900">
                        {formatCurrency(item.discountPrice * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                        title="Remove sweet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Subtotals & Actions */}
        {cart.length > 0 && (
          <div className="bg-stone-50 border-t p-6 space-y-4">
            {/* Subtotal row */}
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
              <span>Cart Subtotal:</span>
              <span className="text-stone-900 text-sm font-extrabold">
                {formatCurrency(totals.subtotal)}
              </span>
            </div>
            
            {/* Tax row */}
            <div className="flex items-center justify-between text-[10px] font-semibold text-stone-500 -mt-2">
              <span>Estimated Tax (5% GST):</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/cart"
                onClick={handleClose}
                className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold py-3 rounded-xl text-[10px] text-center transition-all cursor-pointer"
              >
                View Cart
              </Link>
              
              <Link
                href="/checkout"
                onClick={handleClose}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 rounded-xl text-[10px] text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                Checkout
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </CartDrawer>
  );
}
