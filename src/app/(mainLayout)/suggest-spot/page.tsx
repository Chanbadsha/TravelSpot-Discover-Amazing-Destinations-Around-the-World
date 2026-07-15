import type { Metadata } from "next";
import SuggestSpot from "@/src/Components/SuggestSpot/SuggestSpot";

export const metadata: Metadata = {
  title: "Suggest a Spot",
  description:
    "Share your favorite tourist spot with the community. Submit details, photos, and ratings.",
};

export default function SuggestSpotPage() {
  return <SuggestSpot />;
}
