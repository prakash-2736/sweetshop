import Link from "next/link";
import { Sparkles, Heart, Award, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Story | SweetShop Bakery",
  description: "Learn about our heritage, master bakers, and our commitment to handcrafted gourmet sweets.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          Our Heritage
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
          Baked with Love, Crafted for Joy
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Founded in 2012, SweetShop started with a simple belief: that dessert should be a sensory journey. Every item we prepare is a work of art.
          </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Our Master Baking Philosophy
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Our kitchens are led by French-trained pastry chefs who combine traditional European methods with modern flavor profiles. We slow-churn our buttercreams, stone-ground our pistachios, and carefully monitor oven humidity to deliver the signature shell crunch of our macarons.
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            We believe that premium sweets require premium sourcing. We partner directly with organic almond growers in California and fair-trade cacao cooperatives in Madagascar to ensure every bite supports sustainable farming.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-sm inline-flex items-center gap-1.5"
            >
              Explore Our Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Philosophy Cards */}
        <div className="space-y-6">
          {[
            {
              icon: Heart,
              title: "Handcrafted Daily",
              desc: "We don't use machinery lines or mass-manufacture. Every macaron shell is hand-piped and decorated individually.",
              color: "bg-rose-50/50 border-rose-100 text-rose-600",
            },
            {
              icon: Award,
              title: "Award-Winning Recipes",
              desc: "Our dark chocolate truffles have been voted 'Best in the City' for three consecutive years by the Gastronomy Association.",
              color: "bg-amber-50/50 border-amber-100 text-amber-600",
            },
          ].map((item, index) => {
            const IconComp = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-6 border rounded-3xl bg-white shadow-xs"
              >
                <div className={`p-3 rounded-2xl border ${item.color} shrink-0`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-stone-900">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
