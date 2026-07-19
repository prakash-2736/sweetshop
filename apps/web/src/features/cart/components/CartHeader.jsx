"use client";

import { ShoppingBag } from "lucide-react";

export default function CartHeader({ itemCount }) {
  return (
    <div className="space-y-2 border-b pb-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500 border border-amber-100/60">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-muted-foreground font-semibold">
            Review and adjust your selected sweets before placing your order.
          </p>
        </div>
      </div>
      
      {itemCount > 0 && (
        <p className="text-xs font-bold text-stone-500 pt-1">
          You have <span className="text-stone-900">{itemCount} {itemCount === 1 ? "item" : "items"}</span> in your sweet basket
        </p>
      )}
    </div>
  );
}
