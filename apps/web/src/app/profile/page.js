"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ProfileCard, ProfileMenu } from "@/features/auth";
import { formatCurrency } from "@/utils";
import { SweetVector } from "@/features/home/components/ProductCard";
import Link from "next/link";
import { MapPin, ShoppingBag, Heart, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isMounted, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  // Redirect if not logged in
  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isMounted, isAuthenticated, router]);

  if (!isMounted || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-xs text-stone-500 font-semibold animate-pulse">Loading profile details...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 space-y-8 max-w-6xl">
      
      {/* 1. Header Profile block */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border border-stone-200/80 rounded-[36px] shadow-xs">
        {/* Initials Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-md border-4 border-white select-none">
          {user?.avatar || "PR"}
        </div>
        
        <div className="text-center sm:text-left space-y-1">
          <h1 className="font-extrabold text-stone-900 text-xl tracking-tight leading-tight">
            {user?.name}
          </h1>
          <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Verified SweetShop Customer
          </p>
        </div>
      </div>

      {/* 2. Grid split layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation panel */}
        <div className="md:col-span-4">
          <ProfileMenu
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          />
        </div>

        {/* Tab content panel */}
        <div className="md:col-span-8">
          {activeTab === "personal" && (
            <ProfileCard user={user} onUpdate={updateProfile} />
          )}

          {activeTab === "orders" && (
            <div className="bg-white border border-stone-200/80 rounded-[32px] p-6 shadow-xs space-y-6">
              <div className="border-b pb-4">
                <h2 className="font-extrabold text-stone-900 text-sm uppercase tracking-wider">
                  Order History
                </h2>
                <p className="text-[10px] text-muted-foreground font-semibold">
                  Track and review your past sweet orders
                </p>
              </div>

              {user?.orders?.length === 0 ? (
                <div className="text-center py-10 text-stone-400 text-xs font-semibold">
                  No orders placed yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {user?.orders?.map((order) => (
                    <div key={order.id} className="border border-stone-150 rounded-2xl p-4.5 space-y-3 hover:border-amber-200 transition-colors">
                      <div className="flex items-center justify-between text-xs font-bold border-b pb-3 border-stone-100 flex-wrap gap-2">
                        <div>
                          <p className="text-stone-500 text-[10px] font-semibold">Order ID</p>
                          <p className="text-stone-900 font-mono">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 text-[10px] font-semibold">Date</p>
                          <p className="text-stone-900">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 text-[10px] font-semibold">Status</p>
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider">
                            {order.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-stone-500 text-[10px] font-semibold">Total Paid</p>
                          <p className="text-amber-700 font-extrabold">{formatCurrency(order.total)}</p>
                        </div>
                      </div>

                      {/* Items details list */}
                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] font-semibold text-stone-600">
                            <span>{item.name} <span className="text-stone-400 font-normal">x{item.qty}</span></span>
                            <span className="text-stone-800 font-bold">{formatCurrency(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="bg-white border border-stone-200/80 rounded-[32px] p-6 shadow-xs space-y-6">
              <div className="border-b pb-4">
                <h2 className="font-extrabold text-stone-900 text-sm uppercase tracking-wider">
                  My Wishlist
                </h2>
                <p className="text-[10px] text-muted-foreground font-semibold">
                  Sweets you've pinned for future orders
                </p>
              </div>

              {user?.wishlist?.length === 0 ? (
                <div className="text-center py-10 text-stone-400 text-xs font-semibold">
                  Your wishlist is empty.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user?.wishlist?.map((sweet) => (
                    <div key={sweet.id} className="border border-stone-150 rounded-2xl p-4.5 flex gap-3 items-center hover:border-amber-200 transition-colors">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sweet.color} flex items-center justify-center p-2 shrink-0`}>
                        <div className={`${sweet.textColor} scale-60`}>
                          <SweetVector type={sweet.sweetType} />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${sweet.slug}`} className="hover:text-amber-600 block text-xs font-bold text-stone-900 truncate">
                          {sweet.name}
                        </Link>
                        <p className="text-[9px] uppercase font-bold text-stone-400">{sweet.category}</p>
                        <p className="text-xs font-extrabold text-stone-950 mt-1">{formatCurrency(sweet.discountPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="bg-white border border-stone-200/80 rounded-[32px] p-6 shadow-xs space-y-6">
              <div className="border-b pb-4">
                <h2 className="font-extrabold text-stone-900 text-sm uppercase tracking-wider">
                  Saved Addresses
                </h2>
                <p className="text-[10px] text-muted-foreground font-semibold">
                  Manage your delivery destinations
                </p>
              </div>

              {user?.addresses?.length === 0 ? (
                <div className="text-center py-10 text-stone-400 text-xs font-semibold">
                  No saved addresses found.
                </div>
              ) : (
                <div className="space-y-4">
                  {user?.addresses?.map((addr) => (
                    <div key={addr.id} className="border border-stone-150 rounded-2xl p-4.5 hover:border-amber-200 transition-colors flex items-start gap-3">
                      <div className="p-2 bg-stone-50 rounded-xl border border-stone-100 text-stone-500 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-stone-900 text-xs">{addr.type}</h4>
                          {addr.isDefault && (
                            <span className="text-[8px] bg-amber-100 text-amber-800 font-extrabold uppercase px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 font-medium">{addr.street}</p>
                        <p className="text-[10px] text-stone-450 text-stone-400 font-semibold">{addr.city}, {addr.state} - {addr.zipCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
