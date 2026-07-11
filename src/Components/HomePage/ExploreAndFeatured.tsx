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
import { Card, Button } from "@heroui/react";

const exploreCategories = [
  { key: "adventure", label: "Adventure", icon: MdLandscape, color: "text-orange-500" },
  { key: "beach", label: "Beach", icon: MdBeachAccess, color: "text-cyan-500" },
  { key: "mountain", label: "Mountain", icon: MdTerrain, color: "text-emerald-500" },
  { key: "culture", label: "Culture", icon: MdTheaterComedy, color: "text-purple-500" },
  { key: "food", label: "Food & Wine", icon: MdRestaurant, color: "text-red-500" },
  { key: "nature", label: "Nature", icon: MdPark, color: "text-teal-500" },
];

const featuredDestinations = [
  {
    id: 1,
    name: "Santorini, Greece",
    description: "Whitewashed buildings with breathtaking caldera views",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&fit=crop",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Bali, Indonesia",
    description: "Tropical paradise with ancient temples and lush rice terraces",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Amalfi Coast, Italy",
    description: "Dramatic coastline dotted with pastel-colored villages",
    image: "https://images.unsplash.com/photo-1612698090007-5b8e6a1f3b9e?w=600&h=400&fit=crop",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Banff, Canada",
    description: "Turquoise lakes surrounded by towering Rocky Mountain peaks",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop",
    rating: 4.6,
  },
];

const ExploreAndFeatured = () => {
  return (
    <section>
      {/* Explore Section */}
      <div className="py-16 md:py-24 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
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
              Find your perfect trip based on what you love
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {exploreCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.key} variants={scaleIn}>
                  <button
                    type="button"
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
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-end justify-between mb-12">
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
                Handpicked places our travelers love the most
              </p>
            </div>
            <Button
              variant="primary"
              className="hidden sm:flex bg-[var(--primary)] text-white px-6 rounded-xl"
              size="lg"
            >
              View All
            </Button>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <motion.div key={dest.id} variants={fadeUp}>
              <Card className="overflow-hidden group cursor-pointer border border-[var(--border)] rounded-2xl">
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${dest.image})` }}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-sm font-semibold text-[var(--foreground)]">
                    <FiStar className="text-[var(--accent)] fill-current text-xs" />
                    {dest.rating}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-2 mb-1">
                    <FiMapPin className="text-[var(--primary)] mt-0.5 shrink-0" />
                    <h3 className="font-semibold text-[var(--foreground)]">
                      {dest.name}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                    {dest.description}
                  </p>
                </div>
              </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-8 text-center sm:hidden">
            <Button
              variant="primary"
              className="bg-[var(--primary)] text-white px-8 rounded-xl w-full sm:w-auto"
              size="lg"
            >
              View All
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExploreAndFeatured;
