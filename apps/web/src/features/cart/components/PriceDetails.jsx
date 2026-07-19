"use client";

import { Tag } from "lucide-react";
import { formatCurrency } from "@/utils";

export default function PriceDetails({ totals, activeCoupon, onRemoveCoupon }) {
  const { subtotal, discount, couponDiscount, shippingCharge, tax, grandTotal } = totals;

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-stone-900 text-sm uppercase tracking-wider border-b pb-3.5">
        Price Details
      </h3>

      <div className="space-y-3 text-xs font-semibold text-stone-600">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-stone-900 font-extrabold">{formatCurrency(subtotal)}</span>
        </div>

        {/* Dynamic Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Product Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        {/* Coupon Discount */}
        {activeCoupon && (
          <div className="flex justify-between text-rose-500">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Coupon ({activeCoupon.code})
            </span>
            <div className="flex items-center gap-2">
              <span>-{formatCurrency(couponDiscount)}</span>
              {onRemoveCoupon && (
                <button
                  onClick={onRemoveCoupon}
                  className="text-[10px] text-rose-550 underline hover:text-rose-700 cursor-pointer"
                  title="Remove coupon"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        )}

        {/* Shipping Charge */}
        <div className="flex justify-between">
          <span>Estimated Shipping</span>
          {shippingCharge === 0 ? (
            <span className="text-emerald-600 font-extrabold">FREE</span>
          ) : (
            <span className="text-stone-900 font-extrabold">{formatCurrency(shippingCharge)}</span>
          )}
        </div>

        {/* Tax */}
        <div className="flex justify-between">
          <span>Taxes & GST (5%)</span>
          <span className="text-stone-900 font-extrabold">{formatCurrency(tax)}</span>
        </div>

        {/* Divider */}
        <hr className="border-stone-100" />

        {/* Grand Total */}
        <div className="flex justify-between text-stone-900 text-sm md:text-base font-extrabold pt-2">
          <span>Grand Total</span>
          <span className="text-amber-600">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      {/* Free shipping progress/banner */}
      {subtotal - couponDiscount < 500 && subtotal > 0 && (
        <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-2xl text-[10px] text-stone-600 font-semibold text-center mt-2">
          💡 Add <span className="text-amber-800 font-extrabold">{formatCurrency(500 - (subtotal - couponDiscount))}</span> more to unlock <span className="text-emerald-600 font-extrabold">FREE Shipping</span>!
        </div>
      )}
    </div>
  );
}
