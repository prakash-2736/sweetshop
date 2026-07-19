"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { motion, AnimatePresence } from "framer-motion";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 space-y-12">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
          Get in Touch
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Have a custom ordering request or a catering inquiry? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-50 border rounded-3xl p-8 space-y-6">
            <h3 className="font-extrabold text-lg text-stone-900 border-b pb-4">
              Bakery Details
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-850">Address</h4>
                  <p className="text-muted-foreground mt-0.5">{siteConfig.contact.address}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-850">Phone</h4>
                  <p className="text-muted-foreground mt-0.5">{siteConfig.contact.phone}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-850">Email</h4>
                  <p className="text-muted-foreground mt-0.5">{siteConfig.contact.email}</p>
                </div>
              </div>

              <div className="flex gap-4 border-t pt-4">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-850">Hours of Operation</h4>
                  <p className="text-muted-foreground mt-0.5">Mon - Sat: 8:00 AM - 6:00 PM</p>
                  <p className="text-muted-foreground">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Validation Contact Form */}
        <div className="lg:col-span-7 bg-white border rounded-3xl p-8 shadow-xs">
          <h3 className="font-extrabold text-lg text-stone-900 border-b pb-4 mb-6">
            Send Message
          </h3>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-10 px-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-4"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-lg text-stone-900">Message Received!</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Thank you for reaching out. A pastry coordinator will follow up with you shortly.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="contactForm"
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground" htmlFor="name">
                    Your Name
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Jane Doe"
                    className="w-full bg-muted border border-border/80 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-background transition-all"
                  />
                  {errors.name && (
                    <span className="text-xs text-rose-500 font-medium">{errors.name.message}</span>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full bg-muted border border-border/80 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-background transition-all"
                  />
                  {errors.email && (
                    <span className="text-xs text-rose-500 font-medium">{errors.email.message}</span>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground" htmlFor="message">
                    How can we help?
                  </label>
                  <textarea
                    {...register("message")}
                    placeholder="Tell us about your custom catering/gifting ideas..."
                    rows={5}
                    className="w-full bg-muted border border-border/80 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-background transition-all resize-none"
                  />
                  {errors.message && (
                    <span className="text-xs text-rose-500 font-medium">{errors.message.message}</span>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 active:scale-98 disabled:bg-amber-300 text-stone-950 font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
