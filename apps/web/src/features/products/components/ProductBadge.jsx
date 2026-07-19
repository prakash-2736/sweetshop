"use client";

export default function ProductBadge({ text, stock }) {
  if (stock <= 0) {
    return (
      <span className="bg-rose-500 text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs">
        Out of Stock
      </span>
    );
  }

  if (!text) return null;

  const badgeThemes = {
    "best seller": "bg-amber-500 text-stone-950",
    "festive special": "bg-rose-500 text-white",
    "traditional": "bg-emerald-600 text-white",
    "famous": "bg-orange-500 text-white",
    "chef special": "bg-indigo-600 text-white",
    "spicy & hot": "bg-red-600 text-white",
    "luxury gift": "bg-purple-600 text-white",
    "top rated": "bg-amber-600 text-white",
  };

  const themeClass = badgeThemes[text.toLowerCase()] || "bg-stone-850 text-white";

  return (
    <span className={`text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs ${themeClass}`}>
      {text}
    </span>
  );
}
