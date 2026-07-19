"use client";

import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../data";
import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Loved by Sweet Lovers
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            See what our patrons say about the authenticity, quality, and prompt shipping of our sweet boxes.
          </p>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex flex-col justify-between p-8 border rounded-3xl bg-stone-50/20 relative overflow-hidden"
            >
              {/* Quote icon watermark decoration */}
              <Quote className="absolute right-6 top-6 w-12 h-12 text-stone-100/80 -z-10 shrink-0" />

              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "fill-amber-500 text-amber-500"
                          : "text-stone-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Review body */}
                <p className="text-sm text-stone-700 leading-relaxed italic">
                  "{testimonial.review}"
                </p>
              </div>

              {/* Client Profile row */}
              <div className="flex items-center gap-3 pt-6 border-t mt-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ${testimonial.avatarColor} border`}>
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-stone-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-semibold">Verified Buyer</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
