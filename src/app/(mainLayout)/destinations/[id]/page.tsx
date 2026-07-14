import { notFound } from "next/navigation";
import DestinationDetails from "@/src/Components/DestinationDetails/DestinationDetails";
import { getDestinationById } from "@/src/services/destinationsService";

const DestinationPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const res = await getDestinationById(id);
  if (!res || !res.data) notFound();
  const destination = res.data;

  return <DestinationDetails destination={destination} />;
};

export default DestinationPage;
