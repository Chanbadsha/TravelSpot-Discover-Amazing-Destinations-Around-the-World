"use client";

import { useState } from "react";
import { FiSearch, FiMapPin, FiStar, FiSliders } from "react-icons/fi";
import { MdTravelExplore } from "react-icons/md";
import { Button, InputGroup, Card } from "@heroui/react";

const categories = [
  { key: "all", label: "All" },
  { key: "adventure", label: "Adventure" },
  { key: "beach", label: "Beach" },
  { key: "mountain", label: "Mountain" },
  { key: "culture", label: "Culture" },
  { key: "food", label: "Food & Wine" },
  { key: "nature", label: "Nature" },
];

const destinations = [
  {
    id: 1,
    name: "Santorini, Greece",
    description: "Whitewashed buildings with breathtaking caldera views",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 1240,
    price: 1299,
    category: "culture",
  },
  {
    id: 2,
    name: "Bali, Indonesia",
    description: "Tropical paradise with ancient temples and lush rice terraces",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 980,
    price: 899,
    category: "beach",
  },
  {
    id: 3,
    name: "Amalfi Coast, Italy",
    description: "Dramatic coastline dotted with pastel-colored villages",
    image: "https://images.unsplash.com/photo-1612698090007-5b8e6a1f3b9e?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 1560,
    price: 1899,
    category: "culture",
  },
  {
    id: 4,
    name: "Banff, Canada",
    description: "Turquoise lakes surrounded by towering Rocky Mountain peaks",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 720,
    price: 1499,
    category: "nature",
  },
  {
    id: 5,
    name: "Queenstown, New Zealand",
    description: "The adventure capital of the world with bungee and skiing",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 890,
    price: 2199,
    category: "adventure",
  },
  {
    id: 6,
    name: "Tokyo, Japan",
    description: "A mesmerizing blend of ultramodern and traditional",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 2100,
    price: 1599,
    category: "culture",
  },
  {
    id: 7,
    name: "Maldives",
    description: "Overwater bungalows and crystal-clear turquoise waters",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 1450,
    price: 2499,
    category: "beach",
  },
  {
    id: 8,
    name: "Swiss Alps, Switzerland",
    description: "Majestic mountain peaks and world-class ski resorts",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 1100,
    price: 2799,
    category: "mountain",
  },
  {
    id: 9,
    name: "Paris, France",
    description: "The city of light, love, and world-class cuisine",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 3200,
    price: 1399,
    category: "food",
  },
  {
    id: 10,
    name: "Costa Rica",
    description: "Rainforests, volcanoes, and unparalleled biodiversity",
    image: "https://images.unsplash.com/photo-1510051640312-4e1e134b22a8?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 670,
    price: 1099,
    category: "nature",
  },
  {
    id: 11,
    name: "Machu Picchu, Peru",
    description: "Ancient Incan citadel set high in the Andes Mountains",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 890,
    price: 1899,
    category: "adventure",
  },
  {
    id: 12,
    name: "Barcelona, Spain",
    description: "Vibrant culture, stunning architecture, and Mediterranean beaches",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 1780,
    price: 1199,
    category: "culture",
  },
];

const ExploreDestinations = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = destinations.filter((d) => {
    const matchesCategory = activeCategory === "all" || d.category === activeCategory;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-teal-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&h=600&fit=crop")',
          }}
        />
        <div className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MdTravelExplore className="text-white/80 text-2xl" />
            <span className="text-white/80 font-semibold text-sm tracking-widest uppercase">
              Explore
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Discover Destinations
          </h1>
          <p className="text-white/70 max-w-lg mx-auto">
            Find your perfect getaway from hundreds of amazing destinations worldwide
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Bar */}
        <div className="-mt-7 mb-8 relative z-10">
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
              <Button className="bg-[var(--primary)] text-white px-6 rounded-xl shrink-0" size="lg">
                <FiSearch className="sm:hidden" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
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
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[var(--muted-foreground)]">
            {filtered.length} destination{filtered.length !== 1 ? "s" : ""} found
          </p>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            <FiSliders />
            Filters
          </button>
        </div>

        {/* Destination Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16 md:pb-24">
            {filtered.map((dest) => (
              <Card
                key={dest.id}
                className="overflow-hidden group cursor-pointer border border-[var(--border)] rounded-2xl bg-[var(--card)]"
              >
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${dest.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-3">
                    {dest.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {dest.reviews.toLocaleString()} reviews
                    </span>
                    <span className="text-sm font-bold text-[var(--primary)]">
                      ${dest.price}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MdTravelExplore className="text-5xl text-[var(--muted-foreground)]/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
              No destinations found
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Try adjusting your search or filter to find what you&apos;re looking for
            </p>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-center gap-2 pb-16 md:pb-24">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreDestinations;
