"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ quantity, stock = 99, onUpdate }) {
  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdate(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < stock) {
      onUpdate(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value) {
      const numericVal = parseInt(value, 10);
      const boundedVal = Math.max(1, Math.min(numericVal, stock));
      onUpdate(boundedVal);
    }
  };

  return (
    <div className="flex items-center border border-stone-200 rounded-2xl bg-white p-0.5 w-fit">
      {/* Minus Button */}
      <button
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className={`p-2 rounded-xl transition-all cursor-pointer ${
          quantity <= 1
            ? "text-stone-300 cursor-not-allowed"
            : "text-stone-600 hover:bg-stone-50 active:scale-95"
        }`}
        title="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      {/* Manual input */}
      <input
        type="text"
        value={quantity}
        onChange={handleInputChange}
        className="w-10 text-center font-extrabold text-stone-900 text-xs focus:outline-none select-all"
        title="Enter quantity manually"
      />

      {/* Plus Button */}
      <button
        onClick={handleIncrement}
        disabled={quantity >= stock}
        className={`p-2 rounded-xl transition-all cursor-pointer ${
          quantity >= stock
            ? "text-stone-300 cursor-not-allowed"
            : "text-stone-600 hover:bg-stone-50 active:scale-95"
        }`}
        title="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
