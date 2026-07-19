"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, CreditCard } from "lucide-react";

export default function CartActions({ onClearCart, hasItems }) {
  if (!hasItems) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-stone-200/80 rounded-3xl shadow-xs">
      
      {/* Return to shop */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-xs font-extrabold text-stone-500 hover:text-amber-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
        {/* Clear Cart */}
        <button
          onClick={onClearCart}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-stone-200 text-stone-605 text-stone-650 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-all font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          Clear Cart
        </button>

        {/* Proceed to checkout */}
        <Link
          href="/checkout"
          className="w-full sm:w-auto bg-stone-950 hover:bg-stone-900 active:scale-95 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          Proceed to Checkout
        </Link>
      </div>

    </div>
  );
}
