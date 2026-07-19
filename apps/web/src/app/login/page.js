"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail } from "lucide-react";
import { useAuth, AuthLayout, PasswordInput, SocialLogin } from "@/features/auth";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const { login, isMounted } = useAuth();
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError(null);

    const res = await login(data.email, data.password);
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
      title="Welcome Back"
      subtitle="Log in to access your sweets profile, saved addresses, and orders."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Form Error Banner */}
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

        {/* Password */}
        <PasswordInput
          id="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 font-semibold text-stone-600 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 accent-amber-500 rounded border-stone-300"
            />
            Remember Me
          </label>

          <Link
            href="/forgot-password"
            className="text-amber-700 hover:text-amber-800 font-bold hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stone-950 hover:bg-stone-900 active:scale-98 text-white font-bold py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Log In"
          )}
        </button>

        {/* Social login */}
        <SocialLogin onClickGoogle={() => alert("Google Login sandbox integration success!")} />

        {/* Signup redirection link */}
        <p className="text-center text-xs text-stone-500 pt-2 font-medium">
          New to SweetShop?{" "}
          <Link
            href="/signup"
            className="text-amber-700 hover:text-amber-800 font-bold hover:underline"
          >
            Create an account
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}
