"use client";

import React, { useState } from "react";
import { FiMapPin, FiCalendar, FiSearch } from "react-icons/fi";
import { MdTravelExplore } from "react-icons/md";
import { motion } from "framer-motion";
import { fadeUp, fadeLeft, scaleIn, stagger } from "@/src/Components/Animations";
import { Button, InputGroup } from "@heroui/react";

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

export default function HomePageHero() {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    category: "all",
    date: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search filters:", filters);
  };

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden bg-teal-900">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-24 min-h-[600px] md:min-h-[700px]"
      >
        {/* Hero Text */}
        <motion.div variants={fadeUp} className="text-center mb-10 md:mb-14 max-w-3xl">
          <div className="flex items-center justify-center mb-5">
            <MdTravelExplore className="text-white text-5xl md:text-6xl" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Discover Your Next Great Adventure
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            Explore incredible destinations and create unforgettable memories
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div variants={fadeUp} className="w-full max-w-4xl">
          <form
          onSubmit={handleSearch}
          className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl px-6 py-5 md:px-8 md:py-6"
          >
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Location Input */}
            <div className="flex-1 min-w-0">
              <InputGroup className="w-full">
                <InputGroup.Prefix>
                  <FiMapPin className="text-gray-400 dark:text-gray-500 text-lg shrink-0" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  type="text"
                  placeholder="Where to?"
                  value={filters.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none"
                />
              </InputGroup>
            </div>

            {/* Category Select */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-[13px] text-gray-900 dark:text-gray-100 outline-none appearance-none cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-4 w-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 8l4 4 4-4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Input */}
            <div className="flex-1 min-w-0">
              <InputGroup className="w-full">
                <InputGroup.Prefix>
                  <FiCalendar className="text-gray-400 dark:text-gray-500 text-lg shrink-0" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  type="date"
                  placeholder="When?"
                  value={filters.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("date", e.target.value)
                  }
                  className="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none [color-scheme:light] dark:[color-scheme:dark]"
                />
              </InputGroup>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold px-8 py-6 md:px-10 transition-colors rounded-xl shadow-lg shrink-0 cursor-pointer"
              size="lg"
            >
              <FiSearch className="text-lg md:hidden" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </div>
          </form>
        </motion.div>

        {/* Popular Destinations */}
        <motion.div variants={fadeUp} className="mt-10 md:mt-14 text-center">
          <p className="text-white/60 text-xs mb-4 tracking-widest uppercase font-medium">
            Popular destinations
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Bali", "Maldives", "Iceland", "Costa Rica", "Paris", "Tokyo"].map(
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
