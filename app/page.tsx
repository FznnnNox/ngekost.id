import AboutSection from '@/components/about/AboutSection';
import FaqSection from '@/components/faq/FaqSection';
import HeroSection from '@/components/hero/HeroSection';
import HowItWorksSection from '@/components/how-it-works/HowItWorksSection';
import ListingsSection from '@/components/listings/ListingsSection';
import MapViewSection from '@/components/map-view/MapViewSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ListingsSection />
      <HowItWorksSection />
      <MapViewSection />
      <FaqSection />
    </main>
  );
}