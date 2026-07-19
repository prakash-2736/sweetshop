"use client";

import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUiStore } from "@/store/useUiStore";
import { formatCurrency } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SweetVector } from "./ProductCard";

export default function CartDrawer() {
  const { cart, updateQuantity, removeFromCart, subtotal, count } = useCart();
  const { isCartOpen, setCartOpen } = useUiStore();

  const handleCheckoutClick = () => {
    setCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[450px] bg-background shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <span className="font-extrabold text-lg text-stone-900">Your Basket</span>
                {count > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 hover:bg-muted rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                /* Empty Cart State */
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-500">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 mb-1">Your basket is empty</h3>
                  <p className="text-xs text-muted-foreground max-w-[250px] mb-6">
                    Looks like you haven't added any sweets to your cart yet. Let's find something delicious!
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-sm"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                /* Item Cards */
                cart.map(({ product, quantity }) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-4 p-4 border rounded-2xl bg-card text-card-foreground shadow-xs hover:border-amber-200 transition-colors"
                  >
                    {/* Small product preview */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center p-2 shrink-0`}>
                      <div className={`${product.textColor} transform scale-75`}>
                        <SweetVector category={product.category} color={product.color} name={product.name} />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                          {product.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Price */}
                        <span className="font-bold text-sm text-stone-900">
                          {formatCurrency(product.price)}
                        </span>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1 border">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 hover:bg-background rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            disabled={quantity <= 0}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold min-w-[20px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 hover:bg-background rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-muted-foreground hover:text-rose-500 self-start p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t bg-stone-50/50 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-850">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-semibold uppercase text-xs tracking-wider">Free</span>
                  </div>
                  <div className="border-t border-dashed my-2 pt-2 flex justify-between font-extrabold text-base text-stone-900">
                    <span>Total Amount</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href="/checkout"
                    onClick={handleCheckoutClick}
                    className="w-full bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-bold py-3.5 rounded-2xl text-center text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-2 cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
