import ExploreDestinations from "@/src/Components/ExploreDestinations/ExploreDestinations";
import { getDestinations } from "@/src/services/destinationsService";

const ExploreDestinationsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; category?: string; date?: string }>;
}) => {
  const { location, category, date } = await searchParams;
  const { data: destinations } = await getDestinations();

  return (
    <ExploreDestinations
      destinations={destinations}
      initialLocation={location || ""}
      initialCategory={category || "all"}
      initialDate={date || ""}
    />
  );
};

export default ExploreDestinationsPage;
