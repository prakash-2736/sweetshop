"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { useAuth, AuthLayout } from "@/features/auth";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordPage() {
  const { forgotPassword, isMounted } = useAuth();
  const [successMessage, setSuccessMessage] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError(null);
    setSuccessMessage(null);

    const res = await forgotPassword(data.email);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      setFormError(res.message);
    }
  };

  if (!isMounted) return null;

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your registered email address below, and we will send you a secure reset link."
    >
      {successMessage ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-stone-900 text-sm">Reset Link Sent</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
              {successMessage}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/reset-password"
              className="bg-stone-950 hover:bg-stone-900 active:scale-98 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md transition-all inline-block"
            >
              Set New Password (Sandbox)
            </Link>
          </div>
          
          <p className="text-center text-xs text-stone-500 font-medium">
            Didn't receive the email?{" "}
            <button
              onClick={handleSubmit(onSubmit)}
              className="text-amber-700 hover:text-amber-800 font-bold hover:underline cursor-pointer"
            >
              Resend link
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Error banner */}
          {formError && (
            <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl text-[10px] text-rose-600 font-semibold">
              ⚠️ {formError}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-600" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...register("email")}
                className={`w-full bg-stone-50 border px-4 py-3 pl-11 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:bg-white transition-all placeholder-stone-400 ${
                  errors.email ? "border-rose-300 focus:ring-rose-500/20" : "border-stone-200"
                }`}
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
            </div>
            {errors.email && (
              <span className="text-[10px] text-rose-500 font-semibold">⚠️ {errors.email.message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-950 hover:bg-stone-900 active:scale-98 text-white font-bold py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          {/* Back to login */}
          <p className="text-center text-xs text-stone-500 pt-2 font-medium">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="text-amber-700 hover:text-amber-800 font-bold hover:underline"
            >
              Log in here
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
