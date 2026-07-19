"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col justify-center items-center px-4 py-12 md:py-16">
      
      {/* Return home link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-white border border-stone-200/80 rounded-[40px] shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        {/* Left Side: Illustration / Brand Showcase (Desktop only) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-amber-50 to-orange-100 p-10 flex-col justify-between border-r border-stone-150 relative">
          <div className="space-y-4">
            <Logo />
            <div className="space-y-2 pt-6">
              <h2 className="font-extrabold text-stone-900 text-xl tracking-tight leading-tight">
                Authentic Andhra Sweets & Savories
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Experience the rich heritage of handcrafted recipes delivered fresh to your doorstep.
              </p>
            </div>
          </div>
          
          <div className="text-[10px] text-stone-400 font-semibold">
            © {new Date().getFullYear()} SweetShop. All rights reserved.
          </div>
          
          {/* Subtle design element */}
          <div className="absolute right-0 bottom-12 w-28 h-28 bg-white/20 rounded-full blur-xl" />
        </div>

        {/* Right Side: Form Content */}
        <div className="col-span-1 md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="space-y-6 max-w-md mx-auto w-full">
            
            {/* Titles */}
            <div className="space-y-1">
              <h1 className="font-extrabold text-stone-900 text-xl tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground font-semibold">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form */}
            {children}

          </div>
        </div>
      </div>
    </div>
  );
}
