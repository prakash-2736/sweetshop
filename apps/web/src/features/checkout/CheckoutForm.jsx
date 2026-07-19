"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Truck, CheckCircle2, ChevronRight, ArrowLeft, Loader2, Calendar, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SweetVector } from "@/features/home/components/ProductCard";

// Validation schema using Zod
const checkoutSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  zipCode: z.string().regex(/^\d{5}$/, { message: "ZIP code must be exactly 5 digits" }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Card number must be exactly 16 digits" }),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: "Expiry must be MM/YY" }),
  cardCvc: z.string().regex(/^\d{3}$/, { message: "CVC must be exactly 3 digits" }),
});

export default function CheckoutForm() {
  const { cart, subtotal, totals, activeCoupon, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const nextStep = async () => {
    // Validate fields for current step before proceeding
    let fieldsToValidate = [];
    if (step === 1) {
      fieldsToValidate = ["fullName", "email", "address", "city", "zipCode"];
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    // Generate mock order number
    const mockOrderNum = `SW-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(mockOrderNum);
    setStep(3);
    clearCart();
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="text-center py-16 px-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-500">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="font-extrabold text-xl text-stone-900 mb-2">No items to checkout</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Your shopping cart is currently empty. Browse our catalog and fill it with fresh sweets!
        </p>
        <Link
          href="/products"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-6 py-3 rounded-xl text-sm transition-all"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Steps Indicator / Form Panel (cols 7) */}
      <div className="lg:col-span-7 space-y-6">
        {step !== 3 && (
          <div className="flex items-center gap-4 border-b pb-4">
            <span
              className={`text-sm font-bold flex items-center gap-1.5 ${
                step === 1 ? "text-amber-600" : "text-muted-foreground"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 1 ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
              }`}>1</span>
              Shipping Info
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span
              className={`text-sm font-bold flex items-center gap-1.5 ${
                step === 2 ? "text-amber-600" : "text-muted-foreground"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 2 ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
              }`}>2</span>
              Payment Details
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-500" />
                  Delivery Address
                </h3>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      {...register("fullName")}
                      placeholder="Jane Doe"
                      className="w-full bg-muted border border-border/80 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-background transition-all"
                    />
                    {errors.fullName && (
                      <span className="text-xs text-rose-500 font-medium">{errors.fullName.message}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="jane.doe@example.com"
                      className="w-full bg-muted border border-border/80 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-background transition-all"
                    />
                    {errors.email && (
                      <span className="text-xs text-rose-500 font-medium">{errors.email.message}</span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground" htmlFor="address">
                      Street Address
                    </label>
                    <input
                      {...register("address")}
                      placeholder="123 Sweet Tooth Lane"
                      className="w-full bg-muted border border-border/80 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-background transition-all"
                    />
                    {errors.address && (
                      <span className="text-xs text-rose-500 font-medium">{errors.address.message}</span>
                    )}
                  </div>

                  {/* City & Zip */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-muted-foreground" htmlFor="city">
                        City
                      </label>
                      <input
                        {...register("city")}
                        placeholder="Sugarland"
                        className="w-full bg-muted border border-border/80 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-background transition-all"
                      />
                      {errors.city && (
                        <span className="text-xs text-rose-500 font-medium">{errors.city.message}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-muted-foreground" htmlFor="zipCode">
                        ZIP Code
                      </label>
                      <input
                        {...register("zipCode")}
                        placeholder="77479"
                        maxLength={5}
                        className="w-full bg-muted border border-border/80 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-background transition-all"
                      />
                      {errors.zipCode && (
                        <span className="text-xs text-rose-500 font-medium">{errors.zipCode.message}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    Continue to Payment
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="p-1 hover:bg-muted rounded-full transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="font-extrabold text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                    Payment Details
                  </h3>
                </div>

                <div className="bg-stone-50 p-4 border rounded-2xl flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This is a secure sandbox checkout. Do not enter real credit card numbers. You can use any 16-digit number.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Card Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground" htmlFor="cardNumber">
                      Credit Card Number
                    </label>
                    <div className="relative">
                      <input
                        {...register("cardNumber")}
                        placeholder="4111 2222 3333 4444"
                        maxLength={16}
                        className="w-full bg-muted border border-border/80 px-4 py-3 pl-11 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-background transition-all"
                      />
                      <CreditCard className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                    </div>
                    {errors.cardNumber && (
                      <span className="text-xs text-rose-500 font-medium">{errors.cardNumber.message}</span>
                    )}
                  </div>

                  {/* Expiry & CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-muted-foreground" htmlFor="cardExpiry">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <input
                          {...register("cardExpiry")}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full bg-muted border border-border/80 px-4 py-3 pl-11 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-background transition-all"
                        />
                        <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                      </div>
                      {errors.cardExpiry && (
                        <span className="text-xs text-rose-500 font-medium">{errors.cardExpiry.message}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-muted-foreground" htmlFor="cardCvc">
                        Security Code (CVC)
                      </label>
                      <input
                        {...register("cardCvc")}
                        placeholder="123"
                        maxLength={3}
                        className="w-full bg-muted border border-border/80 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-background transition-all"
                      />
                      {errors.cardCvc && (
                        <span className="text-xs text-rose-500 font-medium">{errors.cardCvc.message}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-grow bg-muted hover:bg-stone-200 text-stone-700 font-bold py-3.5 rounded-xl text-sm transition-all cursor-pointer text-center"
                  >
                    Back to Address
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-grow bg-amber-500 hover:bg-amber-600 active:scale-98 disabled:bg-amber-300 text-stone-950 font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Place Order</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 px-4 bg-emerald-50/40 border border-emerald-100 rounded-3xl space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-extrabold text-2xl text-stone-900">Sweet Order Placed!</h2>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Your order was successfully submitted. We are baking and packing your custom box of joy!
                  </p>
                </div>

                <div className="bg-white border rounded-2xl p-4 max-w-xs mx-auto text-sm space-y-1.5 shadow-xs">
                  <p className="text-muted-foreground flex justify-between">
                    Order Reference: <span className="font-mono font-bold text-stone-850">{orderId}</span>
                  </p>
                  <p className="text-muted-foreground flex justify-between">
                    Estimated Delivery: <span className="font-bold text-stone-850">Tomorrow by 4:00 PM</span>
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/"
                    className="inline-block bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-md"
                  >
                    Back to Home
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Order Summary (cols 5) */}
      {step !== 3 && (
        <div className="lg:col-span-5 border rounded-3xl p-6 bg-card text-card-foreground shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-stone-900 border-b pb-4">
            Order Summary
          </h3>
          <div className="divide-y max-h-[280px] overflow-y-auto pr-1">
            {cart.map((item) => {
              const product = item.product || item;
              const quantity = item.quantity;
              const activePrice = item.discountPrice || product.price;
              return (
                <div key={product.id} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center p-1.5 shrink-0`}>
                    <div className={`${product.textColor} transform scale-[0.6]`}>
                      <SweetVector category={product.category} color={product.color} name={product.name} />
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-xs text-stone-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Qty: {quantity} × {formatCurrency(activePrice)}
                    </p>
                  </div>
                  <span className="font-bold text-xs text-stone-850 shrink-0">
                    {formatCurrency(activePrice * quantity)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-850">{formatCurrency(subtotal)}</span>
            </div>

            {/* Coupon Discount */}
            {activeCoupon && (
              <div className="flex justify-between text-rose-500 font-semibold">
                <span>Coupon ({activeCoupon.code})</span>
                <span>-{formatCurrency(totals.couponDiscount)}</span>
              </div>
            )}

            {/* Shipping Charge */}
            <div className="flex justify-between">
              <span>Shipping & Handling</span>
              {totals.shippingCharge === 0 ? (
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Free</span>
              ) : (
                <span className="font-bold text-stone-850">{formatCurrency(totals.shippingCharge)}</span>
              )}
            </div>

            {/* Taxes */}
            <div className="flex justify-between">
              <span>Taxes & GST (5%)</span>
              <span className="font-bold text-stone-850">{formatCurrency(totals.tax)}</span>
            </div>

            {/* Grand Total */}
            <div className="border-t border-dashed my-2 pt-2 flex justify-between font-extrabold text-sm text-stone-900">
              <span>Grand Total</span>
              <span className="text-amber-600">{formatCurrency(totals.grandTotal)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
