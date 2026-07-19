"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Phone, Edit2, Check, Loader2 } from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone must be exactly 10 digits" }),
});

export default function ProfileCard({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await onUpdate(data);
    setLoading(false);
    if (res.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-[32px] p-6 shadow-xs space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="font-extrabold text-stone-900 text-sm uppercase tracking-wider">
            Personal Profile
          </h2>
          <p className="text-[10px] text-muted-foreground font-semibold">
            Manage your personal contact details
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-400" />
              Full Name
            </label>
            {isEditing ? (
              <input
                {...register("fullName")}
                className="bg-stone-50 border border-stone-200 px-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:bg-white transition-all w-full"
              />
            ) : (
              <p className="text-xs font-extrabold text-stone-900 px-1 py-1.5">{user?.name}</p>
            )}
            {errors.fullName && (
              <span className="text-[10px] text-rose-500 font-semibold">⚠️ {errors.fullName.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              Email Address
            </label>
            {isEditing ? (
              <input
                {...register("email")}
                className="bg-stone-50 border border-stone-200 px-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:bg-white transition-all w-full"
              />
            ) : (
              <p className="text-xs font-extrabold text-stone-900 px-1 py-1.5">{user?.email}</p>
            )}
            {errors.email && (
              <span className="text-[10px] text-rose-500 font-semibold">⚠️ {errors.email.message}</span>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                {...register("phone")}
                maxLength={10}
                className="bg-stone-50 border border-stone-200 px-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:bg-white transition-all w-full"
              />
            ) : (
              <p className="text-xs font-extrabold text-stone-900 px-1 py-1.5">{user?.phone}</p>
            )}
            {errors.phone && (
              <span className="text-[10px] text-rose-500 font-semibold">⚠️ {errors.phone.message}</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        {isEditing && (
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-bold py-3 rounded-2xl text-xs transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
