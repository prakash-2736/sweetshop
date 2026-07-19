"use client";

import { Sparkles, Leaf, Truck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: Sparkles,
      title: "Fresh Everyday",
      description: "Baked daily in small batches and packed in air-tight pods to preserve taste and crunch.",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      icon: Leaf,
      title: "Premium Ingredients",
      description: "Made using 100% pure organic cow ghee, natural brown jaggery, and hand-selected dry fruits.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Insulated express shipping across India, reaching your home in pristine condition.",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "Fully certified SSL payment gateway supporting major credit cards, UPI, and net banking.",
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Why SweetShop is Special
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We preserve traditional cooking techniques to recreate authentic childhood flavors with absolute hygiene.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComp = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex flex-col items-center text-center p-8 border rounded-3xl bg-stone-50/30 hover:bg-white hover:shadow-lg transition-all duration-300 space-y-4"
              >
                <div className={`p-4 rounded-2xl border ${benefit.color} shrink-0`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-stone-900 text-base">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed px-2">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
