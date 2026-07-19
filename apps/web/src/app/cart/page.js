"use client";

import { useCart } from "@/features/cart";
import {
  CartHeader,
  CartList,
  CartSummary,
  CartActions,
  EmptyCart,
  RecommendedProducts,
  LoadingSkeleton
} from "@/features/cart";
import { motion } from "framer-motion";

export default function CartPage() {
  const {
    isMounted,
    cart,
    totals,
    activeCoupon,
    shippingPincode,
    estimatedDeliveryDays,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    estimateShipping,
  } = useCart();

  // Show shimmer skeleton while Zustand restores cart from localStorage
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">
        <div className="h-10 bg-stone-100 rounded-md w-1/4 animate-pulse" />
        <LoadingSkeleton />
      </div>
    );
  }

  const hasItems = cart.length > 0;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-12">
      {/* 1. Header Section */}
      <CartHeader itemCount={cart.length} />

      {hasItems ? (
        /* 2. Cart Content Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List & Actions */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CartList
                items={cart}
                onUpdateQty={updateQuantity}
                onRemove={removeItem}
              />
            </motion.div>

            <CartActions
              onClearCart={clearCart}
              hasItems={hasItems}
            />
          </div>

          {/* Right Column: Pricing details, coupon entries, delivery check */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <CartSummary
                totals={totals}
                activeCoupon={activeCoupon}
                shippingPincode={shippingPincode}
                estimatedDeliveryDays={estimatedDeliveryDays}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={removeCoupon}
                onEstimateShipping={estimateShipping}
                hasItems={hasItems}
              />
            </motion.div>
          </div>
        </div>
      ) : (
        /* 3. Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <EmptyCart />
        </motion.div>
      )}

      {/* 4. Recommended items */}
      <hr className="border-stone-150/80 my-8" />
      <RecommendedProducts cartItems={cart} />
      
    </div>
  );
}
