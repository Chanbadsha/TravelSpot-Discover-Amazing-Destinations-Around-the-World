"use client";

import { useState } from "react";
import { FiSearch, FiMapPin, FiStar, FiSliders, FiClock } from "react-icons/fi";
import { MdTravelExplore, MdVerified } from "react-icons/md";
import { motion } from "framer-motion";
import { fadeUp, scaleIn, stagger } from "@/src/Components/Animations";
import Link from "next/link";
import { Button, InputGroup, Card } from "@heroui/react";
import { ObjectId } from "mongodb";

const categories = [
  { key: "all", label: "All" },
  { key: "adventure", label: "Adventure" },
  { key: "beach", label: "Beach" },
  { key: "mountain", label: "Mountain" },
  { key: "culture", label: "Culture" },
  { key: "food", label: "Food & Wine" },
  { key: "nature", label: "Nature" },
];

type SpotStatus = "pending" | "verified" | "cancelled";

interface Destination {
  _id: ObjectId | string;
  name: string;
  description: string;
  coverImage: string;
  image: string[];
  rating: number;
  reviews: number;
  category: string;
  facilities: string[];
  status: SpotStatus;
  addedBy: string;
}

const ExploreDestinations = ({
  destinations,
}: {
  destinations: Destination[];
}) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = destinations.filter((d) => {
    if (d.status === "cancelled") return false;
    const matchesCategory =
      activeCategory === "all" || d.category === activeCategory;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-teal-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&h=600&fit=crop")',
          }}
        />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <MdTravelExplore className="text-white/80 text-2xl" />
            <span className="text-white/80 font-semibold text-sm tracking-widest uppercase">
              Explore
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Explore Tourist Spots
          </h1>
          <p className="text-white/70 max-w-lg mx-auto">
            Discover famous spots around the world shared by fellow travelers
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Bar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="-mt-7 mb-8 relative z-10"
        >
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <InputGroup className="w-full">
                  <InputGroup.Prefix>
                    <FiSearch className="text-gray-400 dark:text-gray-500 text-lg shrink-0" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value)
                    }
                    className="w-full bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none"
                  />
                </InputGroup>
              </div>
              <Button
                className="bg-[var(--primary)] text-white px-6 rounded-xl shrink-0"
                size="lg"
              >
                <FiSearch className="sm:hidden" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <motion.div key={cat.key} variants={scaleIn}>
              <button
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {cat.label}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Results Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-6"
        >
          <p className="text-sm text-[var(--muted-foreground)]">
            {filtered.length} destination{filtered.length !== 1 ? "s" : ""}{" "}
            found
          </p>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            <FiSliders />
            Filters
          </button>
        </motion.div>

        {/* Destination Grid */}
        {filtered.length > 0 ? (
          <motion.div
            key={filtered.length}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16 md:pb-24"
          >
            {filtered.map((dest, ind) => (
              <motion.div key={ind} variants={fadeUp}>
                <Link href={`/destinations/${dest._id}`}>
                  <Card className="overflow-hidden group border border-[var(--border)] rounded-2xl bg-[var(--card)] cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url(${dest.coverImage})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {dest.status === "verified" && (
                          <span className="text-[10px] font-semibold bg-emerald-500/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                            <MdVerified className="text-[10px]" />
                            Verified
                          </span>
                        )}
                        {dest.status === "pending" && (
                          <span className="text-[10px] font-semibold bg-amber-500/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                            <FiClock className="text-[10px]" />
                            Review
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-xs font-medium text-white/90 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm capitalize">
                          {dest.category}
                        </span>
                        <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]">
                          <FiStar className="text-[var(--accent)] fill-current text-xs" />
                          {dest.rating}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-1.5 mb-1">
                        <FiMapPin className="text-[var(--primary)] mt-0.5 shrink-0 text-sm" />
                        <h3 className="font-semibold text-sm text-[var(--foreground)]">
                          {dest.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-2">
                        {dest.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {dest.facilities.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full"
                          >
                            {f}
                          </span>
                        ))}
                        {dest.facilities.length > 3 && (
                          <span className="text-[10px] text-[var(--muted-foreground)]">
                            +{dest.facilities.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {dest.reviews.toLocaleString()} reviews
                        </span>
                        <span className="text-[11px] text-[var(--muted-foreground)]">
                          by {dest.addedBy}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={filtered.length}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center py-16"
          >
            <MdTravelExplore className="text-5xl text-[var(--muted-foreground)]/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
              No destinations found
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Try adjusting your search or filter to find what you&apos;re
              looking for
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-2 pb-16 md:pb-24"
          >
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  page === 1
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className="px-4 h-9 rounded-lg text-sm font-medium bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all cursor-pointer"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExploreDestinations;
