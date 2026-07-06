import { 
  HeroSlider,
  CategorySection,
  FlashSaleSection,
  FeaturedSection,
  NewProductSection,
  BrandSection,
  FeatureSection,
} from '@/components/common';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroSlider />

      {/* Categories */}
      <CategorySection />

      {/* Flash Sale */}
      <FlashSaleSection />

      {/* Featured Products */}
      <FeaturedSection />

      {/* New Products */}
      <NewProductSection />

      {/* Brands */}
      <BrandSection />

      {/* Features */}
      <FeatureSection />
    </div>
  );
}
