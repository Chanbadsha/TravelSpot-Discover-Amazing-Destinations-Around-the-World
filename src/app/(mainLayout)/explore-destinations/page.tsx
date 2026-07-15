import ExploreDestinations from "@/src/Components/ExploreDestinations/ExploreDestinations";
import { getDestinations } from "@/src/services/destinationsService";

const ExploreDestinationsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; category?: string; date?: string }>;
}) => {
  const { location, category, date } = await searchParams;
  const result = await getDestinations();
  const destinations = Array.isArray(result) ? [] : (result.data ?? []);

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
