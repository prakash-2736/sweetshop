import {
  Hero,
  Categories,
  FeaturedProducts,
  WhyChooseUs,
  BestSellers,
  Testimonials,
  Newsletter
} from "@/features/home";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. Categories Section */}
      <Categories />
      
      {/* 3. Featured Products Grid */}
      <FeaturedProducts />
      
      {/* 4. Why Choose Us Benefit Cards */}
      <WhyChooseUs />
      
      {/* 5. Best Sellers Swiper Carousel */}
      <BestSellers />
      
      {/* 6. Customer Testimonials */}
      <Testimonials />
      
      {/* 7. Newsletter Subscription Box */}
      <Newsletter />
    </div>
  );
}