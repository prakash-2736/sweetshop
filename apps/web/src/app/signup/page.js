"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, User, Phone } from "lucide-react";
import { useAuth, AuthLayout, PasswordInput } from "@/features/auth";

const signupSchema = z.object({
  fullName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone must be exactly 10 digits" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms & conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const router = useRouter();
  const { register: signup, isMounted } = useAuth();
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError(null);

    const res = await signup(data);
    setLoading(false);

    if (res.success) {
      router.push("/profile");
    } else {
      setFormError(res.message);
    }
  };

  if (!isMounted) return null;

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register now to start ordering fresh sweets and tracking deliveries."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Form Error Banner */}
        {formError && (
          <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl text-[10px] text-rose-600 font-semibold">
            ⚠️ {formError}
          </div>
        )}

        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-stone-600" htmlFor="fullName">
            Full Name
          </label>
          <div className="relative">
            <input
              id="fullName"
              placeholder="Jane Doe"
              {...register("fullName")}
              className={`w-full bg-stone-50 border px-4 py-3 pl-11 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:bg-white transition-all placeholder-stone-400 ${
                errors.fullName ? "border-rose-300 focus:ring-rose-500/20" : "border-stone-200"
              }`}
            />
            <User className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
          </div>
          {errors.fullName && (
            <span className="text-[10px] text-rose-500 font-semibold">⚠️ {errors.fullName.message}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-stone-600" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder="jane.doe@example.com"
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

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-stone-600" htmlFor="phone">
            Phone Number
          </label>
          <div className="relative">
            <input
              id="phone"
              maxLength={10}
              placeholder="9876543210"
              {...register("phone")}
              className={`w-full bg-stone-50 border px-4 py-3 pl-11 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:bg-white transition-all placeholder-stone-400 ${
                errors.phone ? "border-rose-300 focus:ring-rose-500/20" : "border-stone-200"
              }`}
            />
            <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
          </div>
          {errors.phone && (
            <span className="text-[10px] text-rose-500 font-semibold">⚠️ {errors.phone.message}</span>
          )}
        </div>

        {/* Password */}
        <PasswordInput
          id="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Confirm Password */}
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {/* Terms checkbox */}
        <div className="flex flex-col gap-1 pt-1">
          <label className="flex items-center gap-2 font-semibold text-stone-600 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("terms")}
              className="w-4 h-4 accent-amber-500 rounded border-stone-300"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-amber-700 hover:text-amber-800 font-bold hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-amber-700 hover:text-amber-800 font-bold hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && (
            <span className="text-[10px] text-rose-500 font-semibold">⚠️ {errors.terms.message}</span>
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
              Registering...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Login redirection */}
        <p className="text-center text-xs text-stone-500 pt-2 font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-amber-700 hover:text-amber-800 font-bold hover:underline"
          >
            Log in here
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}
