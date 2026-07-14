import Link from "next/link";
import { MdTravelExplore } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <MdTravelExplore className="text-6xl text-[var(--muted-foreground)]/30 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Destination not found
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          The destination you&apos;re looking for doesn&apos;t exist or may
          have been removed.
        </p>
        <Link
          href="/explore-destinations"
          className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors no-underline"
        >
          Browse Destinations
        </Link>
      </div>
    </div>
  );
}
