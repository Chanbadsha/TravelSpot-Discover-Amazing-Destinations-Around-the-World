"use client";

import { FiCompass, FiMapPin, FiStar } from "react-icons/fi";
import {
  MdLandscape,
  MdBeachAccess,
  MdTerrain,
  MdTheaterComedy,
  MdRestaurant,
  MdPark,
} from "react-icons/md";
import { motion } from "framer-motion";
import { fadeUp, scaleIn, stagger } from "@/src/Components/Animations";
import { Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const exploreCategories = [
  {
    key: "adventure",
    label: "Adventure",
    icon: MdLandscape,
    color: "text-orange-500",
  },
  { key: "beach", label: "Beach", icon: MdBeachAccess, color: "text-cyan-500" },
  {
    key: "mountain",
    label: "Mountain",
    icon: MdTerrain,
    color: "text-emerald-500",
  },
  {
    key: "culture",
    label: "Culture",
    icon: MdTheaterComedy,
    color: "text-purple-500",
  },
  {
    key: "food",
    label: "Food & Wine",
    icon: MdRestaurant,
    color: "text-red-500",
  },
  { key: "nature", label: "Nature", icon: MdPark, color: "text-teal-500" },
];

const ExploreAndFeatured = ({
  topDestinations = [],
}: {
  topDestinations?: {
    _id: string;
    name: string;
    description: string;
    coverImage: string;
    rating: number;
    reviews: number;
    status: string;
    submittedBy?: string;
    addedBy?: string;
  }[];
}) => {
  const router = useRouter();
  return (
    <section>
      {/* Explore Section */}
      <div className="py-16 md:py-24 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <FiCompass className="text-[var(--primary)] text-2xl" />
              <span className="text-[var(--primary)] font-semibold text-sm tracking-widest uppercase">
                Explore
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-3">
              Explore by Category
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
              Discover spots based on what you love
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {exploreCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.key} variants={scaleIn}>
                  <button
                    type="button"
                    onClick={() => router.push(`/explore-destinations?category=${cat.key}`)}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-full bg-[var(--primary)]/10 flex items-center justify-center group-hover:bg-[var(--primary)]/20 transition-colors">
                      <Icon className={`text-2xl ${cat.color}`} />
                    </div>
                    <span className="text-sm font-medium text-[var(--foreground)] text-center">
                      {cat.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Featured Destinations Section */}
      <div className="py-16 md:py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiStar className="text-[var(--accent)] text-2xl" />
                <span className="text-[var(--primary)] font-semibold text-sm tracking-widest uppercase">
                  Featured
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-3">
                Top Destinations
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-xl">
                Most loved spots shared by the community
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {topDestinations.length > 0 ? topDestinations.map((dest) => (
              <motion.div key={dest._id} variants={fadeUp}>
                <Link href={`/destinations/${dest._id}`}>
                  <Card className="overflow-hidden group cursor-pointer border border-[var(--border)] rounded-2xl bg-[var(--card)] hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300">
                    <div className="relative h-44 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url(${dest.coverImage})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      {dest.status === "verified" && (
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[10px] font-semibold bg-emerald-500/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                            Verified
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2.5 right-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 text-xs font-semibold text-[var(--foreground)]">
                        <FiStar className="text-[var(--accent)] fill-current text-[10px]" />
                        {dest.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-1.5 mb-1">
                        <FiMapPin className="text-[var(--primary)] mt-0.5 shrink-0 text-sm" />
                        <h3 className="font-semibold text-sm text-[var(--foreground)]">
                          {dest.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-2 border-t border-[var(--border)] pt-2">
                        by {dest.submittedBy || dest.addedBy || "Anonymous"}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )) : (
              <p className="text-sm text-[var(--muted-foreground)] col-span-full text-center py-8">
                No destinations available yet.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExploreAndFeatured;
