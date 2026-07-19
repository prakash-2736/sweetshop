"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitting(true);
      // Simulate API submit latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail("");
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-stone-50/50 border-t">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Newsletter Box */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-[40px] p-8 md:p-16 text-center space-y-6 shadow-xl border border-amber-400/20">
          {/* Decorative design elements */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-6 -translate-y-6" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 translate-y-8" />

          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-950 tracking-tight leading-tight">
              Subscribe to the Sweet Life
            </h2>
            <p className="text-sm text-stone-100/90 leading-relaxed">
              Get notified about new seasonal menus, festival discounts, and exclusive sweet giveaways.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/95 backdrop-blur-xs px-6 py-4 rounded-2xl max-w-sm mx-auto text-stone-900 font-bold text-sm shadow-sm"
              >
                🎉 Thank you! Check your inbox for updates.
              </motion.div>
            ) : (
              <motion.form
                key="subForm"
                onSubmit={handleSubscribe}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-grow">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/90 border border-transparent px-4.5 py-3.5 pl-11 rounded-2xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:bg-white placeholder-stone-400"
                  />
                  <Mail className="absolute left-4 top-4 w-4 h-4 text-stone-400" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-stone-950 hover:bg-stone-900 active:scale-98 disabled:bg-stone-800 text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md"
                >
                  Subscribe
                  <Send className="w-4 h-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
