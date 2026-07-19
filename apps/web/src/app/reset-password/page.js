"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useAuth, AuthLayout, PasswordInput } from "@/features/auth";

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword, isMounted } = useAuth();
  const [successMessage, setSuccessMessage] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError(null);
    setSuccessMessage(null);

    const res = await resetPassword(data.password);
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
      title="Set New Password"
      subtitle="Create a secure new password for your SweetShop account below."
    >
      {successMessage ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-stone-900 text-sm">Password Changed</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
              {successMessage}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="bg-stone-950 hover:bg-stone-900 active:scale-98 text-white font-bold px-8 py-3.5 rounded-2xl text-xs shadow-md transition-all inline-block"
            >
              Log in with New Password
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Error banner */}
          {formError && (
            <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl text-[10px] text-rose-600 font-semibold">
              ⚠️ {formError}
            </div>
          )}

          {/* New Password */}
          <PasswordInput
            id="password"
            label="New Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Confirm Password */}
          <PasswordInput
            id="confirmPassword"
            label="Confirm New Password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-950 hover:bg-stone-900 active:scale-98 text-white font-bold py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
