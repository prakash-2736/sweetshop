"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/70 to-cream py-16 md:py-24 lg:py-32 border-b">
      {/* Background soft decorative blur bubbles */}
      <div className="absolute top-0 right-0 -z-10 w-[40%] aspect-square rounded-full bg-amber-250/20 bg-amber-200/20 blur-[100px] translate-x-12 -translate-y-12" />
      <div className="absolute bottom-0 left-0 -z-10 w-[30%] aspect-square rounded-full bg-orange-100/30 blur-[80px] -translate-x-12 translate-y-12" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Legendary Andhra Recipes Since 2012
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.1]"
              >
                Experience the Authentic Taste of{" "}
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Andhra Sweets
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Indulge in our masterfully crafted, thin-layered Bellam Putharekulu, crispy Ghee Ariselu, and rich Palkova. Made fresh daily with pure organic ghee and natural jaggery.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                href="/products"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#categories"
                className="w-full sm:w-auto bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold px-8 py-4 rounded-2xl text-sm transition-colors flex items-center justify-center cursor-pointer"
              >
                Explore Categories
              </a>
            </motion.div>
          </div>

          {/* Right Column: Premium Platter SVG composition */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="relative w-full max-w-[360px] md:max-w-[420px] aspect-square rounded-[40px] bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center p-8 shadow-lg"
            >
              {/* Premium Vector drawing */}
              <svg className="w-full h-full text-amber-900 drop-shadow-lg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Traditional brass plate */}
                <circle cx="100" cy="100" r="82" fill="#D97706" stroke="#92400E" strokeWidth="4" />
                <circle cx="100" cy="100" r="74" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
                <circle cx="100" cy="100" r="66" fill="#FDE047" opacity="0.3" />
                
                {/* Mango leaves layout */}
                <path d="M42 62C52 68 56 80 48 90C40 100 28 92 38 82C48 72 32 56 42 62Z" fill="#15803D" opacity="0.8" />
                <path d="M158 62C148 68 144 80 152 90C160 100 172 92 162 82C152 72 168 56 158 62Z" fill="#15803D" opacity="0.8" />

                {/* Main Putharekulu box pile in the center */}
                <g transform="translate(64, 76)">
                  <rect x="0" y="8" width="72" height="24" rx="4" fill="#FEF3C7" stroke="#B45309" strokeWidth="2.5" />
                  <rect x="6" y="0" width="60" height="20" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" opacity="0.95" />
                  {/* Pistachios sprinkles */}
                  <circle cx="20" cy="8" r="1.5" fill="#22C55E" />
                  <circle cx="34" cy="12" r="1.5" fill="#22C55E" />
                  <circle cx="48" cy="6" r="1.5" fill="#22C55E" />
                  {/* Cashews flakes */}
                  <rect x="25" y="14" width="4" height="2" rx="1" fill="#FFF" />
                  <rect x="42" y="10" width="4" height="2" rx="1" fill="#FFF" />
                </g>

                {/* Kaju Katli Diamond 1 */}
                <path d="M52 115L68 130L52 145L36 130Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                <path d="M52 115L60 130L52 135L44 130Z" fill="white" opacity="0.6" />

                {/* Kaju Katli Diamond 2 */}
                <path d="M148 115L164 130L148 145L132 130Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                <path d="M148 115L156 130L148 135L140 130Z" fill="white" opacity="0.6" />

                {/* Pedha / Laddu 1 */}
                <circle cx="76" cy="144" r="14" fill="#CA8A04" stroke="#854D0E" strokeWidth="2" />
                <ellipse cx="76" cy="140" rx="2" ry="1" fill="#22C55E" />

                {/* Pedha / Laddu 2 */}
                <circle cx="120" cy="144" r="14" fill="#CA8A04" stroke="#854D0E" strokeWidth="2" />
                <ellipse cx="120" cy="140" rx="2" ry="1" fill="#22C55E" />

                {/* Saffron threads overlay on the plate */}
                <path d="M100 132C102 134 101 138 99 140" stroke="#EA580C" strokeWidth="1" strokeLinecap="round" />
                <path d="M92 138C94 140 93 144 91 146" stroke="#EA580C" strokeWidth="1" strokeLinecap="round" />
              </svg>

              {/* Decorative label */}
              <div className="absolute bottom-4 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-full border shadow-xs text-xs font-bold text-stone-850 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                100% Ghee Sweets
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
