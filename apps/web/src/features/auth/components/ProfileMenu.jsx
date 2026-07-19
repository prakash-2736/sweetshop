"use client";

import { User, ShoppingBag, Heart, MapPin, LogOut } from "lucide-react";

export default function ProfileMenu({ activeTab, onTabChange, onLogout }) {
  const menuItems = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "orders", label: "Order History", icon: ShoppingBag },
    { id: "wishlist", label: "My Wishlist", icon: Heart },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
  ];

  return (
    <div className="bg-white border border-stone-200/80 rounded-[32px] p-5 shadow-xs flex flex-col justify-between h-fit gap-6">
      
      {/* Menu links */}
      <nav className="space-y-1" aria-label="Profile navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                isActive
                  ? "bg-amber-500 text-stone-950 shadow-xs"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="border-t pt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log Out
        </button>
      </div>

    </div>
  );
}
