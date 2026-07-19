import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  PRODUCTS_DATA,
  ProductGallery,
  ProductInfo,
  ProductTabs,
  RelatedProducts,
  Breadcrumbs
} from "@/features/products";

// Generate dynamic SEO metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = PRODUCTS_DATA.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Sweet Not Found | SweetShop",
    };
  }

  return {
    title: `${product.name} | Premium Andhra Sweets`,
    description: product.description,
  };
}

// Generate static params for optimal pre-rendering
export async function generateStaticParams() {
  return PRODUCTS_DATA.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = PRODUCTS_DATA.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const breadcrumbPaths = [
    { label: product.category, url: `/products?category=${product.category.toLowerCase().replace(/ /g, "-")}` },
    { label: product.name, url: `/products/${product.slug}` }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-12">
      {/* Back button & Breadcrumbs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-150 pb-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-stone-500 hover:text-amber-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
        <Breadcrumbs paths={breadcrumbPaths} />
      </div>

      {/* Main product showcase section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Column: Image Gallery with Magnifier Loupe */}
        <div className="md:col-span-6">
          <ProductGallery product={product} />
        </div>

        {/* Right Column: Pricing, Weight selectors, and Order buttons */}
        <div className="md:col-span-6">
          <ProductInfo product={product} />
        </div>
      </section>

      {/* Detailed Technical Tabs (Ingredients, Nutrition, Shipping, Reviews) */}
      <section className="border-t border-stone-250/20 pt-10">
        <ProductTabs product={product} />
      </section>

      {/* Related Products Section */}
      <section className="border-t border-stone-250/20 pt-10">
        <RelatedProducts currentProduct={product} />
      </section>
      
    </div>
  );
}
