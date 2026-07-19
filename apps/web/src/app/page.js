import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, Sparkles, ChefHat, Heart, Award } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/constants/products";
import ProductCard from "@/components/common/ProductCard";
import heroSweets from "@/assets/hero_sweets.png";

export default function Home() {
  // Get top 4 best rated products for the homepage showcase
  const bestsellers = PRODUCTS.filter((p) => p.rating >= 4.9).slice(0, 4);

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 to-background pt-8 pb-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Freshly Baked Daily
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.1]">
              Baking Moments of{" "}
              <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                Pure Happiness
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore our selection of handcrafted French macarons, premium artisanal chocolates, and luxury pastries. Made with love and the finest organic ingredients.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/products"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                Shop Our Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?category=gifts"
                className="w-full sm:w-auto bg-card hover:bg-muted text-foreground font-bold px-8 py-4 rounded-2xl text-sm transition-all border border-border/80 flex items-center justify-center gap-2 cursor-pointer"
              >
                Send a Gift Box
              </Link>
            </div>
          </div>

          {/* Right Column Image */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[480px] aspect-square rounded-[40px] overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-all duration-500 bg-muted">
              <Image
                src={heroSweets}
                alt="Gourmet French macarons and chocolates platter"
                placeholder="blur"
                priority
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 mb-3">
            Browse by Category
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Delve into our specialized selections, each prepared by hand using time-tested recipes.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            {
              id: "macarons",
              name: "Macarons",
              color: "bg-rose-50 border-rose-100 hover:border-rose-300 hover:bg-rose-100/30",
              badgeColor: "bg-rose-500",
              desc: "Crisp shell, creamy ganache",
            },
            {
              id: "chocolates",
              name: "Chocolates",
              color: "bg-amber-50 border-amber-100 hover:border-amber-300 hover:bg-amber-100/30",
              badgeColor: "bg-amber-600",
              desc: "Artisanal cocoa masterpieces",
            },
            {
              id: "pastries",
              name: "French Pastries",
              color: "bg-emerald-50 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-100/30",
              badgeColor: "bg-emerald-600",
              desc: "Flaky puff & velvety custard",
            },
            {
              id: "gifts",
              name: "Gift Hampers",
              color: "bg-purple-50 border-purple-100 hover:border-purple-300 hover:bg-purple-100/30",
              badgeColor: "bg-purple-500",
              desc: "Luxury presentation packages",
            },
          ].map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className={`p-6 border rounded-[32px] ${cat.color} transition-all duration-300 flex flex-col items-start gap-4 group cursor-pointer shadow-xs hover:-translate-y-1.5`}
            >
              <span className={`w-3.5 h-3.5 rounded-full ${cat.badgeColor} group-hover:scale-125 transition-transform`} />
              <div className="space-y-1 mt-2">
                <h3 className="font-extrabold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {cat.desc}
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 mt-auto">
                Explore Shop <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 mb-2">
              Our Bestselling Treats
            </h2>
            <p className="text-sm text-muted-foreground">
              These client favorites fly off our shelves daily. Order early to secure your box!
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            View All Sweets
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Benefits Section */}
      <section className="bg-stone-50 border-y py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 mb-3">
              Why Our Sweets are Different
            </h2>
            <p className="text-sm text-muted-foreground">
              Every macaron and truffle we craft goes through meticulous sourcing and expert hands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ChefHat,
                title: "Artisanal Baking",
                desc: "Every pastry is custom rolled, filled, and glazed in-house by our master bakers, ensuring world-class standard.",
              },
              {
                icon: Award,
                title: "Premium Ingredients",
                desc: "We use organic cane sugar, single-origin cacao from Madagascar, and French gourmet butter. No artificial additives.",
              },
              {
                icon: Truck,
                title: "Same-Day Hand Delivery",
                desc: "Packed with cold inserts and delivered by hand straight to your door to guarantee optimal taste and crispiness.",
              },
            ].map((benefit, i) => {
              const IconComp = benefit.icon;
              return (
                <div
                  key={i}
                  className="bg-white border rounded-3xl p-8 shadow-xs hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-stone-900">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Promo */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-r from-amber-500 to-rose-500 rounded-[40px] p-8 md:p-16 text-stone-950 text-center md:text-left relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          {/* Sparkly Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />

          <div className="space-y-4 max-w-lg z-10">
            <span className="text-xs font-extrabold uppercase tracking-widest bg-white/25 px-3 py-1 rounded-full text-stone-950">
              Perfect Gift
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              Looking for the ultimate celebration gift?
            </h2>
            <p className="text-sm opacity-90 leading-relaxed">
              Order our signature luxury tasting hamper box, packed with handcrafted macarons, dark chocolate truffles, and lavender butter shortbreads.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <Link
              href="/products/p8"
              className="bg-stone-950 hover:bg-stone-900 active:scale-95 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-md inline-block cursor-pointer"
            >
              Order Luxury Hamper
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}