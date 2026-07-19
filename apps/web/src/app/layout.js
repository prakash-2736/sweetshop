import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/queryClient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/common/CartDrawer";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["sweets", "macarons", "pastries", "chocolates", "bakery", "gourmet", "gift box"],
  authors: [{ name: "SweetShop Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <QueryProvider>
          {/* Main sticky navigation */}
          <Navbar />
          
          {/* Main scrollable body */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Persistent global shopping cart drawer */}
          <CartDrawer />
          
          {/* Footer directories */}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
