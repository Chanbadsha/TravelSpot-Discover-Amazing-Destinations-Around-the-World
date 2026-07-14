"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiMapPin, FiCalendar, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdTravelExplore } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, scaleIn, stagger } from "@/src/Components/Animations";
import { Button, InputGroup } from "@heroui/react";
import { useRouter } from "next/navigation";

interface SearchFilters {
  location: string;
  category: string;
  date: string;
}

const categories = [
  { key: "all", label: "All Categories" },
  { key: "adventure", label: "Adventure" },
  { key: "beach", label: "Beach" },
  { key: "mountain", label: "Mountain" },
  { key: "culture", label: "Culture" },
  { key: "food", label: "Food & Wine" },
  { key: "nature", label: "Nature" },
];

const slides = [
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop",
    location: "Beach Paradise",
  },
  {
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop",
    location: "Mountain Escape",
  },
  {
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&h=1080&fit=crop",
    location: "City Lights",
  },
  {
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=1080&fit=crop",
    location: "Wild Adventure",
  },
];

const taglines = [
  "Explore incredible destinations, view facilities, and share your experiences with the community",
  "Plan your perfect getaway with expert-curated travel guides",
  "Discover hidden gems and create unforgettable memories",
  "Your journey begins here — find your next adventure today",
];

const defaultDestinations = ["Bali", "Maldives", "Iceland", "Costa Rica", "Paris", "Tokyo"];

export default function HomePageHero({
  popularDestinations,
  heading = "Discover Famous Tourist Spots",
}: {
  popularDestinations?: string[];
  heading?: string;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    category: "all",
    date: "",
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTagline, setCurrentTagline] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const spots = popularDestinations && popularDestinations.length > 0 ? popularDestinations : defaultDestinations;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [isPaused, nextSlide]);

  useEffect(() => {
    const taglineInterval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(taglineInterval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.location.trim()) params.set("location", filters.location.trim());
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.date) params.set("date", filters.date);
    const qs = params.toString();
    router.push(qs ? `/explore-destinations?${qs}` : "/explore-destinations");
  };

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section
      className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden bg-teal-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${slides[currentSlide].image}")`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Slider Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all cursor-pointer"
          aria-label="Previous slide"
        >
          <FiChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "bg-white w-7"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all cursor-pointer"
          aria-label="Next slide"
        >
          <FiChevronRight size={18} />
        </button>
      </div>

      {/* Slide Location Indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <motion.span
          key={currentSlide}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white/80 text-xs tracking-wider uppercase font-medium border border-white/10"
        >
          {slides[currentSlide].location}
        </motion.span>
      </div>

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-24 min-h-[600px] md:min-h-[700px] z-[5]"
      >
        {/* Hero Text */}
        <motion.div variants={fadeUp} className="text-center mb-8 md:mb-10 max-w-3xl">
          <div className="flex items-center justify-center mb-5">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <MdTravelExplore className="text-white text-5xl md:text-6xl" />
            </motion.div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            {heading}
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTagline}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-base md:text-lg text-white/80 max-w-2xl mx-auto h-[56px] md:h-7 flex items-center justify-center"
            >
              {taglines[currentTagline]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Search Form */}
        <motion.div variants={fadeUp} className="w-full max-w-4xl">
          <form
          onSubmit={handleSearch}
          className="w-full max-w-4xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl px-6 py-5 md:px-8 md:py-6 border border-white/10"
          >
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Location Input */}
            <div className="flex-1 min-w-0">
              <div className="relative group">
                <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg pointer-events-none transition-colors group-focus-within:text-teal-500" />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={filters.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-400/20"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="flex-1 min-w-0">
              <div className="relative group">
                <select
                  value={filters.category}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleInputChange("category", val);
                    if (val !== "all") {
                      router.push(`/explore-destinations?category=${val}`);
                    }
                  }}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-4 pr-10 py-3.5 text-gray-900 dark:text-gray-100 outline-none appearance-none cursor-pointer transition-all focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-400/20"
                >
                  {categories
                    .filter((c) => c.key !== "all")
                    .map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-teal-500"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 8l4 4 4-4" />
                </svg>
              </div>
            </div>

            {/* Date Input */}
            <div className="flex-1 min-w-0">
              <div className="relative group">
                <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg pointer-events-none transition-colors group-focus-within:text-teal-500" />
                <input
                  type="date"
                  placeholder="When?"
                  value={filters.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("date", e.target.value)
                  }
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-400/20 [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold px-8 py-[17px] md:px-10 transition-all rounded-xl shadow-lg shrink-0 cursor-pointer hover:shadow-teal-600/25"
              size="lg"
            >
              <FiSearch className="text-lg md:hidden" />
              <span className="hidden md:inline">Explore</span>
            </Button>
          </div>
          </form>
        </motion.div>



        {/* Popular Destinations */}
        <motion.div variants={fadeUp} className="mt-8 md:mt-10 text-center">
            <p className="text-white/60 text-xs mb-4 tracking-widest uppercase font-medium">
            Popular spots
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {spots.map(
              (place) => (
                <motion.div key={place} variants={scaleIn}>
                  <button
                    type="button"
                    className="px-5 py-2.5 bg-white/15 hover:bg-white/25 active:bg-white/35 text-white rounded-full text-sm font-medium transition-all backdrop-blur-sm border border-white/10 cursor-pointer"
                    onClick={() => handleInputChange("location", place)}
                  >
                    {place}
                  </button>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
