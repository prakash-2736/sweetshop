"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ paths = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold py-4">
      {/* Root Home link */}
      <Link href="/" className="hover:text-amber-600 transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      <ChevronRight className="w-3 h-3 text-stone-300" />

      {/* Intermediary paths */}
      <Link href="/products" className="hover:text-amber-600 transition-colors">
        Products
      </Link>

      {paths.map((p, idx) => {
        const isLast = idx === paths.length - 1;
        return (
          <div key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-stone-300" />
            {isLast ? (
              <span className="text-stone-800 font-extrabold max-w-[200px] truncate" aria-current="page">
                {p.label}
              </span>
            ) : (
              <Link href={p.url} className="hover:text-amber-600 transition-colors">
                {p.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
