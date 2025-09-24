import { 
  HeroSection, 
  AboutSection, 
  FeaturesSection, 
  FeaturedExhibitions, 
  CTASection 
} from '@/components/home';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedExhibitions />
      <AboutSection />
      <FeaturesSection />
      <CTASection />
    </>
  );
}