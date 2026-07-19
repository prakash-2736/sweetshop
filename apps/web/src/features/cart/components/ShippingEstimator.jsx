"use client";

import { useState } from "react";
import { Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { getEstimatedDeliveryDate } from "../utils";

export default function ShippingEstimator({ pincode, deliveryDays, onEstimate }) {
  const [localPincode, setLocalPincode] = useState(pincode || "");
  const [feedback, setFeedback] = useState(null); // { type: "success" | "error", text: string }

  const handleEstimate = (e) => {
    e.preventDefault();
    if (!localPincode.trim()) return;

    const res = onEstimate(localPincode.trim());
    if (res.success) {
      setFeedback({ type: "success", text: res.message });
    } else {
      setFeedback({ type: "error", text: res.message });
    }
  };

  const deliveryStr = deliveryDays ? getEstimatedDeliveryDate(deliveryDays) : "";

  return (
    <div className="space-y-4">
      <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
        <Truck className="w-3.5 h-3.5 text-amber-500" />
        Delivery Estimator
      </h4>

      <div className="space-y-3">
        {/* Estimator input form */}
        <form onSubmit={handleEstimate} className="flex gap-2">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit Pincode"
            value={localPincode}
            onChange={(e) => {
              setLocalPincode(e.target.value.replace(/\D/g, ""));
              setFeedback(null);
            }}
            className="flex-1 bg-stone-50 border pl-4 pr-3 py-3 rounded-2xl text-xs font-semibold placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
          />
          <button
            type="submit"
            disabled={localPincode.trim().length !== 6}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              localPincode.trim().length === 6
                ? "bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-xs"
                : "bg-stone-100 text-stone-450 text-stone-400 cursor-not-allowed"
            }`}
          >
            Check
          </button>
        </form>

        {/* Estimation output results */}
        {deliveryDays && (
          <div className="bg-stone-50/50 border p-4.5 rounded-2xl text-xs font-semibold text-stone-700 space-y-1">
            <p className="flex justify-between">
              <span className="text-stone-500 font-medium">Estimated Arrival:</span>
              <span className="text-amber-800 font-extrabold">{deliveryStr}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-stone-500 font-medium">Transit Window:</span>
              <span className="text-stone-900 font-extrabold">{deliveryDays} {deliveryDays === 1 ? "Day" : "Days"}</span>
            </p>
          </div>
        )}

        {/* Feedback messages */}
        {feedback && (
          <div className={`p-3 rounded-xl border flex items-center gap-2 text-[10px] font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50/50 border-emerald-100 text-emerald-700"
              : "bg-rose-50/50 border-rose-100 text-rose-600"
          }`}>
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
