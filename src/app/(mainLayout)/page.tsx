import HomePageHero from "@/src/Components/HomePage/HomeHero";
import StatsAndFeatures from "@/src/Components/HomePage/StatsAndFeatures";
import ExploreAndFeatured from "@/src/Components/HomePage/ExploreAndFeatured";
import TestimonialsAndNewsLetter from "@/src/Components/HomePage/TestimonialsAndNewsLetter";
import FaqAndFooter from "@/src/Components/HomePage/FaqAndFooter";

const HomePage = () => {
  return (
    <div>
      <HomePageHero />
      <ExploreAndFeatured />
      <StatsAndFeatures />
      <TestimonialsAndNewsLetter />
      <FaqAndFooter />
    </div>
  );
};

export default HomePage;
