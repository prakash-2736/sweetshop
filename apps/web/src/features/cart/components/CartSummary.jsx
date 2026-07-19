"use client";

import PriceDetails from "./PriceDetails";
import CouponBox from "./CouponBox";
import ShippingEstimator from "./ShippingEstimator";
import Link from "next/link";
import { CreditCard } from "lucide-react";

export default function CartSummary({
  totals,
  activeCoupon,
  shippingPincode,
  estimatedDeliveryDays,
  onApplyCoupon,
  onRemoveCoupon,
  onEstimateShipping,
  hasItems,
}) {
  if (!hasItems) return null;

  return (
    <div className="space-y-6 bg-white p-6 rounded-[32px] border border-stone-200/80 shadow-xs sticky top-24">
      
      {/* 1. Price breakdown */}
      <PriceDetails
        totals={totals}
        activeCoupon={activeCoupon}
        onRemoveCoupon={onRemoveCoupon}
      />

      <hr className="border-stone-100" />

      {/* 2. Coupon codes Box */}
      <CouponBox
        activeCoupon={activeCoupon}
        onApply={onApplyCoupon}
        onRemove={onRemoveCoupon}
      />

      <hr className="border-stone-100" />

      {/* 3. Shipping estimator */}
      <ShippingEstimator
        pincode={shippingPincode}
        deliveryDays={estimatedDeliveryDays}
        onEstimate={onEstimateShipping}
      />

      {/* Checkout Button */}
      <Link
        href="/checkout"
        className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold py-4 rounded-2xl text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
      >
        <CreditCard className="w-4 h-4" />
        Proceed to Checkout
      </Link>

    </div>
  );
}
