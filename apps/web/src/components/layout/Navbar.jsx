"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { useUiStore } from "@/store/useUiStore";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/layout/Logo";
import Container from "@/components/layout/Container";
import { cn } from "@/lib/utils";

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { count } = useCart();
  
  const { isMobileNavOpen, setMobileNavOpen, setCartOpen, setSearchOpen } = useUiStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle header background style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, searchParams, setMobileNavOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 border-b",
          isScrolled
            ? "bg-background/90 backdrop-blur-md shadow-sm border-border/80 py-2.5"
            : "bg-background border-transparent py-4"
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-amber-600 relative py-1",
                      isActive ? "text-amber-600 font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavbar"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-4">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-full transition-colors hidden sm:inline-flex cursor-pointer"
                aria-label="Search sweets"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-0 right-0 bg-rose-505 bg-rose-500 text-white font-bold text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-background"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Profile icon placeholder */}
              <Link
                href="/checkout"
                className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-full transition-colors hidden sm:inline-flex"
                aria-label="Account details"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Hamburger menu toggle */}
              <button
                onClick={() => setMobileNavOpen(!isMobileNavOpen)}
                className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-full transition-colors md:hidden cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Sliding Navigation Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-black md:hidden"
            />

            {/* Sidebar menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-[280px] bg-background p-6 shadow-xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-lg bg-gradient-to-r from-amber-600 to-rose-500 bg-clip-text text-transparent font-sans">
                  Menu
                </span>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1 hover:bg-muted rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search input */}
              <form onSubmit={handleSearchSubmit} className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted border border-border/80 px-4 py-2 pl-10 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
              </form>

              {/* Mobile Navigation links */}
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-base font-semibold py-2 px-3 rounded-lg hover:bg-muted transition-colors",
                        isActive ? "text-amber-600 bg-amber-50/50" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Search Modal Overlay */}
      <AnimatePresence>
        {useUiStore((state) => state.isSearchOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ y: -50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -50, scale: 0.95 }}
              className="bg-background w-full max-w-lg p-6 rounded-2xl shadow-2xl border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Search Catalog</h3>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 hover:bg-muted rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="What sweets are you craving today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted border border-border/80 px-4 py-3 pl-11 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-background transition-all"
                  autoFocus
                />
                <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-[73px] bg-background border-b border-border/80" />}>
      <NavbarContent />
    </Suspense>
  );
}