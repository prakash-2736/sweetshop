"use client";

import { useState } from "react";
import { SweetVector } from "@/features/home/components/ProductCard";
import { ZoomIn } from "lucide-react";

export default function ProductGallery({ product }) {
  // Custom gallery items represented by box coloring options
  const colorOptions = [
    { label: "Signature Gold", class: product.color || "from-amber-100 to-orange-200" },
    { label: "Royal Orange", class: "from-orange-100 to-amber-300" },
    { label: "Classic Warm", class: "from-yellow-50 to-orange-150" },
  ];

  const [activeColor, setActiveColor] = useState(colorOptions[0].class);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnails list */}
      <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 justify-center md:justify-start">
        {colorOptions.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setActiveColor(opt.class)}
            className={`w-16 h-16 rounded-2xl border bg-gradient-to-br ${opt.class} flex items-center justify-center p-2 cursor-pointer transition-all ${
              activeColor === opt.class ? "border-amber-500 ring-2 ring-amber-500/20" : "border-stone-200 hover:border-stone-400"
            }`}
            title={`View in ${opt.label}`}
          >
            <div className="scale-60">
              <SweetVector type={product.sweetType} />
            </div>
          </button>
        ))}
      </div>

      {/* Main Display Image with Zoom capability */}
      <div className="flex-1 order-1 md:order-2">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`w-full aspect-square rounded-[32px] bg-gradient-to-br ${activeColor} border flex items-center justify-center p-12 relative overflow-hidden group cursor-zoom-in`}
        >
          {/* Sweet Vector */}
          <div className="transform transition-transform duration-500 group-hover:scale-110">
            <SweetVector type={product.sweetType} />
          </div>

          {/* Zoom Overlay Indicator */}
          <div className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-xs rounded-full border text-stone-600 pointer-events-none shadow-xs">
            <ZoomIn className="w-4 h-4" />
          </div>

          {/* Loupe Simulation */}
          <div
            style={{
              ...zoomStyle,
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.05) 100%)`,
            }}
            className="absolute inset-0 bg-no-repeat pointer-events-none transition-opacity duration-150 opacity-0 group-hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}
