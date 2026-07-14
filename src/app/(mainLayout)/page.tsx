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

  const topDestinations = [...destinations]
    .filter((d: { status?: string }) => d.status !== "cancelled")
    .sort((a: { rating?: number }, b: { rating?: number }) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4);

  return (
    <div>
      <HomePageHero popularDestinations={popularNames} />
      <ExploreAndFeatured topDestinations={topDestinations} />
      <StatsAndFeatures />
      <TestimonialsAndNewsLetter />
      <FaqAndFooter />
    </div>
  );
};

export default HomePage;
