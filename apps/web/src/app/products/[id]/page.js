import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ShieldCheck, ChevronRight, ArrowLeft } from "lucide-react";
import { fetchProductById, fetchRelatedProducts } from "@/services/products";
import { SweetVector } from "@/components/common/ProductCard";
import ProductActions from "./ProductActions";
import ProductCard from "@/components/common/ProductCard";
import { formatCurrency } from "@/utils";

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const product = await fetchProductById(id);
    return {
      title: `${product.name} | SweetShop Bakery`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: "Product Not Found",
    };
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  
  let product;
  let relatedProducts = [];
  
  try {
    product = await fetchProductById(id);
    relatedProducts = await fetchRelatedProducts(product.category, product.id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-16">
      {/* Back button & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-amber-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
        
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-amber-600">Shop All</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-850 font-bold truncate max-w-[150px]">{product.name}</span>
        </nav>
      </div>

      {/* Main product display grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Column - Large Showcase Graphic */}
        <div className="md:col-span-6">
          <div className={`w-full aspect-square rounded-[40px] bg-gradient-to-br ${product.color} flex items-center justify-center p-12 shadow-md`}>
            <div className={`${product.textColor} transform scale-150`}>
              <SweetVector category={product.category} color={product.color} name={product.name} />
            </div>
          </div>
        </div>

        {/* Right Column - Product details info */}
        <div className="md:col-span-6 space-y-6">
          <div className="space-y-3">
            {/* Category & Badge */}
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Title (H1) */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-stone-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-stone-850 mt-0.5">
                {product.rating} ({product.reviewsCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-3xl font-extrabold text-stone-900 border-b pb-4">
            {formatCurrency(product.price)}
          </div>

          {/* Sensory/Long description */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
              Product details
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {product.longDescription}
            </p>
          </div>

          {/* Client Interactive Actions Component */}
          <ProductActions product={product} />

          {/* Secure Purchase note */}
          <div className="flex items-center gap-2 bg-stone-50 border rounded-2xl p-4 text-xs text-muted-foreground leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Guaranteed fresh. Baked within hours of shipment. Packaged in custom insulated shipping pods.</span>
          </div>
        </div>
      </div>

      {/* Ingredients & Nutritional breakdown tables */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t">
        <div className="md:col-span-6 space-y-3">
          <h3 className="font-extrabold text-lg text-stone-900">Ingredients</h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
            {product.ingredients}
          </p>
          <p className="text-[10px] text-rose-600 font-semibold italic">
            *Allergens: Contains nuts (almond meal, pistachios, hazelnuts), eggs, dairy. Made in a facility that also processes wheat.
          </p>
        </div>

        <div className="md:col-span-6 space-y-4">
          <h3 className="font-extrabold text-lg text-stone-900">Nutrition Facts</h3>
          <div className="border rounded-2xl overflow-hidden text-xs bg-card">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b last:border-b-0">
                  <td className="p-3 font-semibold text-muted-foreground">Serving Size</td>
                  <td className="p-3 text-right font-bold text-stone-850">{product.nutrition.calories}</td>
                </tr>
                <tr className="border-b last:border-b-0">
                  <td className="p-3 font-semibold text-muted-foreground">Total Fat</td>
                  <td className="p-3 text-right font-bold text-stone-850">{product.nutrition.fat}</td>
                </tr>
                <tr className="border-b last:border-b-0">
                  <td className="p-3 font-semibold text-muted-foreground">Sugars</td>
                  <td className="p-3 text-right font-bold text-stone-850">{product.nutrition.sugar}</td>
                </tr>
                <tr className="border-b last:border-b-0">
                  <td className="p-3 font-semibold text-muted-foreground">Protein</td>
                  <td className="p-3 text-right font-bold text-stone-850">{product.nutrition.protein}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-8 border-t">
          <h3 className="font-extrabold text-2xl text-stone-900 text-center md:text-left">
            You Might Also Crave...
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
