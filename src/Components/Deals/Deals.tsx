"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiTag, FiMapPin, FiClock, FiPercent, FiStar } from "react-icons/fi";
import { MdTravelExplore, MdLocalOffer } from "react-icons/md";
import { fadeUp, scaleIn, stagger } from "@/src/Components/Animations";
import Link from "next/link";
import { Button, Card } from "@heroui/react";

const dealCategories = [
  { key: "all", label: "All Deals" },
  { key: "flash", label: "Flash Sale" },
  { key: "early", label: "Early Bird" },
  { key: "last", label: "Last Minute" },
  { key: "bundle", label: "Bundle" },
];

interface Deal {
  id: number;
  destination: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  category: string;
  endDate: string;
  daysLeft: number;
  description: string;
}

const deals: Deal[] = [
  {
    id: 1,
    destination: "Santorini, Greece",
    location: "Cyclades, Aegean Sea",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 1240,
    originalPrice: 1899,
    discountPrice: 1299,
    discountPercent: 32,
    category: "flash",
    endDate: "Jul 25, 2026",
    daysLeft: 13,
    description: "Whitewashed buildings with breathtaking caldera views",
  },
  {
    id: 2,
    destination: "Bali, Indonesia",
    location: "Southeast Asia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 980,
    originalPrice: 1299,
    discountPrice: 899,
    discountPercent: 31,
    category: "early",
    endDate: "Aug 10, 2026",
    daysLeft: 29,
    description: "Tropical paradise with ancient temples and lush rice terraces",
  },
  {
    id: 3,
    destination: "Amalfi Coast, Italy",
    location: "Campania, Italy",
    image: "https://images.unsplash.com/photo-1612698090007-5b8e6a1f3b9e?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 1560,
    originalPrice: 2599,
    discountPrice: 1899,
    discountPercent: 27,
    category: "last",
    endDate: "Jul 18, 2026",
    daysLeft: 6,
    description: "Dramatic coastline dotted with pastel-colored villages",
  },
  {
    id: 4,
    destination: "Tokyo, Japan",
    location: "Honshu, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 2100,
    originalPrice: 2199,
    discountPrice: 1599,
    discountPercent: 28,
    category: "bundle",
    endDate: "Sep 1, 2026",
    daysLeft: 51,
    description: "A mesmerizing blend of ultramodern and traditional",
  },
  {
    id: 5,
    destination: "Maldives",
    location: "Indian Ocean",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 1450,
    originalPrice: 3499,
    discountPrice: 2499,
    discountPercent: 29,
    category: "flash",
    endDate: "Jul 22, 2026",
    daysLeft: 10,
    description: "Overwater bungalows and crystal-clear turquoise waters",
  },
  {
    id: 6,
    destination: "Queenstown, New Zealand",
    location: "South Island",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 890,
    originalPrice: 2899,
    discountPrice: 2199,
    discountPercent: 25,
    category: "early",
    endDate: "Oct 5, 2026",
    daysLeft: 85,
    description: "The adventure capital of the world with bungee and skiing",
  },
  {
    id: 7,
    destination: "Paris, France",
    location: "Île-de-France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 3200,
    originalPrice: 1799,
    discountPrice: 1399,
    discountPercent: 23,
    category: "last",
    endDate: "Jul 15, 2026",
    daysLeft: 3,
    description: "The city of light, love, and world-class cuisine",
  },
  {
    id: 8,
    destination: "Banff, Canada",
    location: "Alberta, Canada",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 720,
    originalPrice: 1999,
    discountPrice: 1499,
    discountPercent: 26,
    category: "bundle",
    endDate: "Aug 20, 2026",
    daysLeft: 39,
    description: "Turquoise lakes surrounded by towering Rocky Mountain peaks",
  },
  {
    id: 9,
    destination: "Barcelona, Spain",
    location: "Catalonia, Spain",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 1780,
    originalPrice: 1599,
    discountPrice: 1199,
    discountPercent: 26,
    category: "flash",
    endDate: "Jul 28, 2026",
    daysLeft: 16,
    description: "Vibrant culture, stunning architecture, and Mediterranean beaches",
  },
];

const featuredDeal = deals[0];

export default function Deals() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? deals
    : deals.filter((d) => d.category === activeCategory);

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <MdLocalOffer className="text-[var(--accent)] text-2xl" />
            <span className="text-[var(--accent)] font-semibold text-sm tracking-widest uppercase">
              Deals
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Exclusive Travel Deals
          </h1>
          <p className="text-white/70 max-w-lg mx-auto">
            Save big on your dream vacation with our handpicked limited-time offers
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2 mt-8 mb-8"
        >
          {dealCategories.map((cat) => (
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
            {filtered.length} deal{filtered.length !== 1 ? "s" : ""} available
          </p>
        </motion.div>

        {/* Featured Deal */}
        {activeCategory === "all" && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[var(--primary)] to-teal-800">
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative grid md:grid-cols-2 gap-6 p-6 md:p-8 items-center">
                <div>
                  <span className="inline-flex items-center gap-1.5 bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    <FiPercent className="text-xs" />
                    {featuredDeal.discountPercent}% OFF
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {featuredDeal.destination}
                  </h3>
                  <div className="flex items-center gap-1.5 text-white/70 text-sm mb-3">
                    <FiMapPin className="shrink-0" />
                    <span>{featuredDeal.location}</span>
                  </div>
                  <p className="text-white/80 text-sm mb-4">{featuredDeal.description}</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-white/60 text-xs line-through">
                        ${featuredDeal.originalPrice}
                      </span>
                      <div className="text-2xl font-bold text-white">
                        ${featuredDeal.discountPrice}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/70 text-xs">
                      <FiClock />
                      <span>{featuredDeal.daysLeft} days left</span>
                    </div>
                  </div>
                  <Button className="mt-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold px-8 rounded-xl transition-colors cursor-pointer">
                    Book Now
                  </Button>
                </div>
                <div className="hidden md:block relative h-64 rounded-xl overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${featuredDeal.image})` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Deals Grid */}
        {filtered.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16 md:pb-24"
          >
            {filtered.map((deal) => (
              <motion.div key={deal.id} variants={fadeUp}>
                <Card className="overflow-hidden group border border-[var(--border)] rounded-2xl bg-[var(--card)] cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${deal.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[var(--accent)] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      <FiPercent className="text-xs" />
                      {deal.discountPercent}% OFF
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]">
                      <FiStar className="text-[var(--accent)] fill-current text-xs" />
                      {deal.rating}
                    </div>
                    {deal.daysLeft <= 7 && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-red-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                        <FiClock className="text-xs" />
                        {deal.daysLeft} day{deal.daysLeft > 1 ? "s" : ""} left
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--primary)] font-semibold">
                      {dealCategories.find((c) => c.key === deal.category)?.label || deal.category}
                    </span>
                    <div className="flex items-start gap-1.5 mt-1 mb-1">
                      <FiMapPin className="text-[var(--primary)] mt-0.5 shrink-0 text-sm" />
                      <h3 className="font-semibold text-sm text-[var(--foreground)]">
                        {deal.destination}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-3">
                      {deal.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[var(--muted-foreground)] line-through">
                          ${deal.originalPrice}
                        </span>
                        <div className="text-lg font-bold text-[var(--foreground)]">
                          ${deal.discountPrice}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <FiClock />
                        <span>{deal.daysLeft} days</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center py-16"
          >
            <MdTravelExplore className="text-5xl text-[var(--muted-foreground)]/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
              No deals found
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Try a different category to find available offers
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
