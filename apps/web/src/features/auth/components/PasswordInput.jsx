"use client";

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef(({ label = "Password", error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-baseline">
        <label className="text-xs font-bold text-stone-600" htmlFor={props.id || props.name}>
          {label}
        </label>
      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          ref={ref}
          {...props}
          className={`w-full bg-stone-50 border px-4 py-3 pr-11 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:bg-white transition-all placeholder-stone-400 ${
            error ? "border-rose-300 focus:ring-rose-500/20" : "border-stone-200"
          }`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3.5 top-3 p-1 rounded-lg text-stone-400 hover:text-stone-750 hover:bg-stone-100 transition-colors cursor-pointer"
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {error && (
        <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
