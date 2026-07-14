import ExploreDestinations from "@/src/Components/ExploreDestinations/ExploreDestinations";
import { getDestinations } from "@/src/services/destinationsService";

const ExploreDestinationsPage = async () => {
  const { data: destinations } = await getDestinations();

  return <ExploreDestinations destinations={destinations} />;
};

export default ExploreDestinationsPage;
