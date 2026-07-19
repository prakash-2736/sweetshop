"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ quantity, max = 99, onChange }) {
  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center border border-stone-200 rounded-2xl bg-white p-1 w-fit">
      <button
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className={`p-2.5 rounded-xl transition-all cursor-pointer ${
          quantity <= 1
            ? "text-stone-300 cursor-not-allowed"
            : "text-stone-600 hover:bg-stone-50 active:scale-95"
        }`}
        title="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="text-sm font-extrabold text-stone-900 px-5 select-none min-w-[40px] text-center">
        {quantity}
      </span>

      <button
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={`p-2.5 rounded-xl transition-all cursor-pointer ${
          quantity >= max
            ? "text-stone-300 cursor-not-allowed"
            : "text-stone-600 hover:bg-stone-50 active:scale-95"
        }`}
        title="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
