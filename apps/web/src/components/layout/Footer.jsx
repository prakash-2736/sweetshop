"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Top Newsletter Banner */}
      <div className="border-b border-stone-800 bg-stone-950/40">
        <div className="container mx-auto px-4 py-12 md:py-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Join the Sweet Life
            </h3>
            <p className="text-sm text-stone-400">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime sweet deals.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 px-4 py-3 pl-11 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white placeholder-stone-500"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
            </div>
            <button
              type="submit"
              disabled={subscribed}
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-semibold px-6 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:bg-emerald-500 disabled:text-white"
            >
              {subscribed ? (
                <>Subscribed!</>
              ) : (
                <>
                  Subscribe
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand & About */}
        <div className="space-y-4">
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
            SweetShop
          </span>
          <p className="text-sm text-stone-400 leading-relaxed">
            Crafting pure moments of joy since 2012. Our master pastry chefs use only the finest natural ingredients to bake everyday wonders.
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-stone-850 hover:bg-stone-800 rounded-full transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-stone-400 hover:text-amber-400" />
            </a>
            <a
              href={siteConfig.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-stone-850 hover:bg-stone-800 rounded-full transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-stone-400 hover:text-amber-400" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-5">Shop Catalog</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/products" className="hover:text-amber-400 transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/products?category=macarons" className="hover:text-amber-400 transition-colors">
                Gourmet Macarons
              </Link>
            </li>
            <li>
              <Link href="/products?category=chocolates" className="hover:text-amber-400 transition-colors">
                Artisanal Chocolates
              </Link>
            </li>
            <li>
              <Link href="/products?category=pastries" className="hover:text-amber-400 transition-colors">
                French Pastries
              </Link>
            </li>
            <li>
              <Link href="/products?category=gifts" className="hover:text-amber-400 transition-colors">
                Gift Boxes & Hampers
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-5">Customer Care</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Track Order
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Shipping & Delivery
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Returns & Refunds
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Store Contacts */}
        <div className="space-y-4 text-sm">
          <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-5">Visit Our Bakery</h4>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <span className="text-stone-400">{siteConfig.contact.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-amber-500 shrink-0" />
            <span className="text-stone-400">{siteConfig.contact.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-amber-500 shrink-0" />
            <span className="text-stone-400">{siteConfig.contact.email}</span>
          </div>
        </div>
      </div>

      {/* Subfooter */}
      <div className="border-t border-stone-850 py-6 text-center text-xs text-stone-500 bg-stone-950/20">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SweetShop Bakery. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for sweet tooths.
          </p>
        </div>
      </div>
    </footer>
  );
}
