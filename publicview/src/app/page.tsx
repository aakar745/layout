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
      <AboutSection />
      <FeaturedExhibitions />
      <FeaturesSection />
      <CTASection />
    </>
  );
}