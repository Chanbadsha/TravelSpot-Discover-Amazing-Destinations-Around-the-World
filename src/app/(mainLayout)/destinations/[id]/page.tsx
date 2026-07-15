import { notFound } from "next/navigation";
import DestinationDetails from "@/src/Components/DestinationDetails/DestinationDetails";
import { getDestinationById, getDestinations } from "@/src/services/destinationsService";

const normalizeDestination = (data: Record<string, unknown>) => {
  if (!data) return null;

  return {
    id: (data.id || data._id || "") as string,
    name: (data.name || "Unknown") as string,
    country: (data.country || "") as string,
    coverImage: (data.coverImage || (data.images as string[])?.[0] || "") as string,
    city: (data.city || "") as string,
    location: (data.location || data.address || "") as string,
    category: (data.category || "") as string,
    bestSeason: (data.bestSeason || "Year-round") as string,
    travelTime: (data.travelTime || "") as string,
    entryFee: (data.entryFee || "Free") as string,
    rating: typeof data.rating === "number" ? data.rating : 0,
    reviews: typeof data.reviews === "number" ? data.reviews : 0,
    openingHours: (data.openingHours || "") as string,
    description: (data.description || "") as string,
    images: (data.images || data.image || []) as string[],
    status: (data.status || "pending") as "pending" | "verified" | "cancelled",
    submittedBy: (data.submittedBy || data.addedBy || "") as string,
    submittedAt: (data.submittedAt || data.createdAt || "") as string,
    verifiedAt: (data.verifiedAt || "") as string,
    createdAt: (data.createdAt || "") as string,
    updatedAt: (data.updatedAt || "") as string,
    creator: {
      name: (typeof (data.creator as Record<string, unknown>)?.name === "string"
        ? (data.creator as Record<string, unknown>).name as string
        : typeof data.addedBy === "string"
          ? data.addedBy
          : "Traveler"),
      avatar: (typeof (data.creator as Record<string, unknown>)?.avatar === "string"
        ? (data.creator as Record<string, unknown>).avatar as string
        : typeof data.coverImage === "string"
          ? data.coverImage
          : ""),
      role: ((data.creator as Record<string, unknown>)?.role as string) || "Contributor",
      bio: ((data.creator as Record<string, unknown>)?.bio as string) || "",
      tag: ((data.creator as Record<string, unknown>)?.tag as string) || "Local Explorer",
      destinations: typeof (data.creator as Record<string, unknown>)?.destinations === "number"
        ? (data.creator as Record<string, unknown>).destinations as number
        : 0,
      photos: typeof (data.creator as Record<string, unknown>)?.photos === "number"
        ? (data.creator as Record<string, unknown>).photos as number
        : 0,
      yearsExperience: typeof (data.creator as Record<string, unknown>)?.yearsExperience === "number"
        ? (data.creator as Record<string, unknown>).yearsExperience as number
        : 0,
      verified: !!((data.creator as Record<string, unknown>)?.verified),
    },
    nearbyAttractions: (data.nearbyAttractions || []) as { name: string; distance: string; image: string }[],
    related: (data.related || []) as { id: string; name: string; image: string; rating: number }[],
  };
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const DestinationPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const res = await getDestinationById(id);
  if (!res || !res.data) notFound();

  const destination = normalizeDestination(res.data);
  if (!destination) notFound();

  const allResult = await getDestinations();
  const allDestinations: Record<string, unknown>[] = Array.isArray(allResult) ? [] : (allResult.data ?? []);
  const otherDestinations = allDestinations.filter((d: Record<string, unknown>) => {
    const destId = (d.id || d._id || "") as string;
    return destId !== id && d.status !== "cancelled";
  });
  const shuffled = shuffleArray(otherDestinations);

  const defaultNearbyAttractions = shuffled.slice(0, 4).map((d, i) => ({
    id: (d.id || d._id || "") as string,
    name: (d.name || "Unknown") as string,
    distance: `${(i + 1) * 5} min away`,
    image: (d.coverImage || (d.images as string[])?.[0] || "") as string,
  }));

  const defaultRelatedDestinations = shuffled.slice(4, 7).map((d) => ({
    id: (d.id || d._id || "") as string,
    name: (d.name || "Unknown") as string,
    image: (d.coverImage || (d.images as string[])?.[0] || "") as string,
    rating: typeof d.rating === "number" ? d.rating : 0,
  }));

  return (
    <DestinationDetails
      destination={destination}
      nearbyAttractions={defaultNearbyAttractions}
      relatedDestinations={defaultRelatedDestinations}
    />
  );
};

export default DestinationPage;
