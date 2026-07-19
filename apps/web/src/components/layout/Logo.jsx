import Link from "next/link";
import { Candy } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="bg-amber-500 text-white p-1.5 rounded-full shadow-inner transform group-hover:rotate-12 transition-transform duration-300">
        <Candy className="w-4.5 h-4.5" />
      </div>
      <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-600 to-rose-500 bg-clip-text text-transparent">
        SweetShop
      </span>
    </Link>
  );
}