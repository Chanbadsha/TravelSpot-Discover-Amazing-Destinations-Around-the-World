"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { MdTravelExplore } from "react-icons/md";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <MdTravelExplore className="text-6xl text-[var(--muted-foreground)]/30 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          We couldn&apos;t load this destination. It might be temporarily
          unavailable or the link may be broken.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/explore-destinations"
            className="border border-[var(--border)] hover:border-[var(--primary)] text-[var(--foreground)] font-medium px-6 py-2.5 rounded-xl text-sm transition-colors no-underline"
          >
            Browse Destinations
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
