"use client";

import { useState } from "react";
import { Tag, CheckCircle2, AlertCircle } from "lucide-react";

export default function CouponBox({ activeCoupon, onApply, onRemove }) {
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: string }

  const handleApply = (e) => {
    if (e) e.preventDefault();
    if (!couponCode.trim()) return;

    const res = onApply(couponCode.trim());
    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setCouponCode("");
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  const handlePresetApply = (code) => {
    const res = onApply(code);
    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setCouponCode("");
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  const presets = ["WELCOME10", "SWEET20", "FESTIVE50"];

  return (
    <div className="space-y-4">
      <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
        <Tag className="w-3.5 h-3.5 text-amber-500" />
        Apply Coupon
      </h4>

      {activeCoupon ? (
        <div className="bg-emerald-50 border border-emerald-100 p-4.5 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-extrabold text-emerald-800 uppercase">{activeCoupon.code}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Coupon applied successfully</p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="text-[10px] uppercase font-bold tracking-widest text-rose-500 hover:text-rose-600 cursor-pointer"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Coupon Input Form */}
          <form onSubmit={handleApply} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setMessage(null); // clear messages on type
              }}
              className="flex-1 bg-stone-50 border pl-4 pr-3 py-3 rounded-2xl text-xs font-semibold uppercase placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!couponCode.trim()}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                couponCode.trim()
                  ? "bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-xs"
                  : "bg-stone-100 text-stone-450 text-stone-400 cursor-not-allowed"
              }`}
            >
              Apply
            </button>
          </form>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground font-semibold">Available Offers:</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handlePresetApply(code)}
                  className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Validation Feedback Messages */}
          {message && (
            <div className={`p-3 rounded-xl border flex items-center gap-2 text-[10px] font-semibold ${
              message.type === "success"
                ? "bg-emerald-50/50 border-emerald-100 text-emerald-700"
                : "bg-rose-50/50 border-rose-100 text-rose-600"
            }`}>
              {message.type === "success" ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
