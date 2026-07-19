"use client";

import Link from "next/link";
import { CATEGORIES } from "../data";
import { SweetVector } from "./ProductCard";
import { motion } from "framer-motion";

export default function Categories() {
  return (
    <section id="categories" className="py-16 md:py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Explore Our Categories
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Handcrafted traditional recipes made with raw ingredients and pure ghee, brought straight to your doorstep.
          </p>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="group"
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="flex flex-col items-center text-center space-y-4 cursor-pointer"
              >
                {/* Rounded Image Placeholder container */}
                <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${category.imageBg} border border-stone-100 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md`}>
                  <div className="transform transition-transform duration-500 group-hover:rotate-6">
                    <SweetVector type={category.sweetType} />
                  </div>
                </div>

                {/* Category Title & Info */}
                <div className="space-y-1">
                  <h3 className="font-extrabold text-stone-850 group-hover:text-amber-600 transition-colors text-sm sm:text-base leading-snug">
                    {category.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground px-2 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
