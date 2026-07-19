"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function ProductTabs({ product }) {
  const tabs = ["Description", "Ingredients", "Nutrition", "Reviews", "Shipping"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const reviewsList = [
    {
      name: "Ramesh Babu",
      date: "3 days ago",
      rating: 5,
      comment: "Absolutely authentic! Tastes exactly like the home-made sweets we get in Atreyapuram.",
    },
    {
      name: "Venkata Rao",
      date: "1 week ago",
      rating: 5,
      comment: "Highly fresh packaging. Fast shipping to Bangalore. Ghee quality is top notch.",
    },
    {
      name: "Sujatha K.",
      date: "2 weeks ago",
      rating: 4,
      comment: "Very delicious and soft. Just the right amount of sweetness.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Buttons bar */}
      <div className="flex border-b border-stone-200 overflow-x-auto scrollbar-none gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-5 text-xs font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap -mb-[2px] ${
                isActive
                  ? "border-amber-500 text-stone-900"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="py-4 text-xs md:text-sm text-stone-700 leading-relaxed min-h-[160px]">
        {activeTab === "Description" && (
          <div className="space-y-3">
            <p>{product.description}</p>
            <p>Our Andhra Sweet Master cooks these batch-by-batch under continuous supervision to replicate standard household recipes, utilizing non-refined oils or chemical preservatives.</p>
          </div>
        )}

        {activeTab === "Ingredients" && (
          <div className="bg-stone-50/50 p-6 border rounded-2xl space-y-2">
            <p className="font-extrabold text-stone-900">List of Ingredients:</p>
            <p className="text-stone-700">{product.ingredients || "No artificial colors, pure cow ghee, natural jaggery, gram flour, cashew nuts."}</p>
            <p className="text-[11px] text-muted-foreground mt-2">⚠️ Allergen Information: Contains dairy, nuts (cashew, almonds). Prepared in a facility handling gluten.</p>
          </div>
        )}

        {activeTab === "Nutrition" && (
          <div className="max-w-md border rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b font-extrabold text-stone-850">
                  <th className="p-3">Nutrient Group</th>
                  <th className="p-3">Value per Serving</th>
                </tr>
              </thead>
              <tbody className="divide-y font-semibold text-stone-700">
                <tr>
                  <td className="p-3 text-stone-500">Energy Calories</td>
                  <td className="p-3 text-stone-900">{product.nutrition?.calories || "210 kcal"}</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-500">Total Fats</td>
                  <td className="p-3 text-stone-900">{product.nutrition?.fat || "10g"}</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-500">Natural Sugars</td>
                  <td className="p-3 text-stone-900">{product.nutrition?.sugar || "16g"}</td>
                </tr>
                <tr>
                  <td className="p-3 text-stone-500">Dietary Proteins</td>
                  <td className="p-3 text-stone-900">{product.nutrition?.protein || "3g"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Reviews" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-amber-50/40 p-4 border border-amber-100 rounded-2xl">
              <div className="text-center shrink-0">
                <p className="text-3xl font-extrabold text-stone-900">{product.rating}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">Out of 5 Stars</p>
              </div>
              <div className="text-xs text-stone-600 font-semibold space-y-1">
                <p>⭐ 95% of buyers recommended this sweet.</p>
                <p>💬 Highly recommended for festival gifts and family gatherings.</p>
              </div>
            </div>

            <div className="space-y-4 divide-y">
              {reviewsList.map((rev, idx) => (
                <div key={idx} className={`pt-4 ${idx === 0 ? "pt-0 border-t-0" : "border-t"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-extrabold text-stone-900 text-xs">{rev.name}</p>
                      <p className="text-[10px] text-muted-foreground">{rev.date}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating ? "fill-amber-500 text-amber-500" : "text-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-700 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Shipping" && (
          <div className="space-y-3 font-semibold text-stone-700">
            <p>✈️ We deliver sweet parcels across all major PIN codes in India. Metro delivery takes 2 to 3 working days.</p>
            <p>📦 Every order is dispatched inside a sealed insulated bag with dry ice inserts if required, keeping sweets entirely intact.</p>
            <p>🛡️ Easy return/replacement guarantee in case of damage or transit discrepancies.</p>
          </div>
        )}
      </div>
    </div>
  );
}
