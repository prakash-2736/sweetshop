"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 border border-dashed rounded-[40px] bg-white space-y-6 max-w-2xl mx-auto my-8">
      
      {/* Visual illustration placeholder */}
      <div className="p-5.5 rounded-full bg-amber-50 text-amber-500 border border-amber-100/60 animate-bounce">
        <ShoppingBag className="w-12 h-12" />
      </div>

      <div className="space-y-2 max-w-sm">
        <h2 className="font-extrabold text-stone-900 text-xl tracking-tight">Your Cart is Empty</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Looks like you haven't added any of our delicious Andhra sweets or savory namkeen snacks to your basket yet.
        </p>
      </div>

      <Link
        href="/products"
        className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold px-8 py-3.5 rounded-2xl text-xs shadow-xs transition-all cursor-pointer inline-block"
      >
        Explore Sweets
      </Link>
    </div>
  );
}
