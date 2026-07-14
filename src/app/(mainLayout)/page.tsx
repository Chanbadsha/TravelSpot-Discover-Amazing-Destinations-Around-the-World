import HomePageHero from "@/src/Components/HomePage/HomeHero";
import StatsAndFeatures from "@/src/Components/HomePage/StatsAndFeatures";
import ExploreAndFeatured from "@/src/Components/HomePage/ExploreAndFeatured";
import TestimonialsAndNewsLetter from "@/src/Components/HomePage/TestimonialsAndNewsLetter";
import FaqAndFooter from "@/src/Components/HomePage/FaqAndFooter";
import { getDestinations } from "@/src/services/destinationsService";

const HomePage = async () => {
  const result = await getDestinations();
  const destinations = Array.isArray(result) ? [] : (result.data ?? []);
  const popularNames = destinations
    .map((d: { name: string }) => d.name)
    .filter(Boolean)
    .slice(0, 8);

  return (
    <div>
      <HomePageHero popularDestinations={popularNames} />
      <ExploreAndFeatured />
      <StatsAndFeatures />
      <TestimonialsAndNewsLetter />
      <FaqAndFooter />
    </div>
  );
};

export default HomePage;
