"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiMapPin,
  FiStar,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiThumbsUp,
  FiSend,
  FiUser,
} from "react-icons/fi";
import {
  MdTravelExplore,
  MdAccessTime,
  MdCategory,
  MdTerrain,
} from "react-icons/md";
import { motion } from "framer-motion";
import { fadeUp, fadeLeft, fadeRight, stagger } from "@/src/Components/Animations";
import { Button, Card } from "@heroui/react";

interface Destination {
  id: number;
  name: string;
  country: string;
  city: string;
  location: string;
  category: string;
  bestSeason: string;
  travelTime: string;
  entryFee: string;
  rating: number;
  reviews: number;
  openingHours: string;
  description: string;
  images: string[];
  nearbyAttractions: { name: string; distance: string; image: string }[];
  related: { id: number; name: string; image: string; rating: number }[];
}

const destinationData: Destination = {
  id: 1,
  name: "Santorini, Greece",
  country: "Greece",
  city: "Santorini",
  location: "Cyclades island group, Aegean Sea",
  category: "Culture & Beach",
  bestSeason: "April - October",
  travelTime: "5-7 days recommended",
  entryFee: "Free (ferry/flight fees apply)",
  rating: 4.8,
  reviews: 1240,
  openingHours: "Most attractions 9:00 AM - 8:00 PM",
  description:
    "Santorini is a stunning volcanic island in the Cyclades group of the Greek islands. Known for its dramatic views, stunning sunsets, white-washed buildings with blue domes, and its very own active volcano, Santorini is one of the most iconic destinations in the world.\n\nThe island was shaped by a massive volcanic eruption thousands of years ago, which created its distinctive crescent shape and gave birth to the caldera — a breathtaking natural wonder that draws millions of visitors each year. The charming villages of Oia and Fira cling to the cliffside, offering panoramic views of the deep blue Aegean Sea.\n\nBeyond its famous sunsets, Santorini offers exquisite local wines, fresh Mediterranean cuisine, ancient ruins at Akrotiri, and unique beaches with red, black, and white sands. Whether you're exploring the narrow cobblestone streets, sailing around the caldera, or simply relaxing with a glass of Assyrtiko wine, Santorini promises an unforgettable experience.",
  images: [
    "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1612698090007-5b8e6a1f3b9e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1200&h=800&fit=crop",
  ],
  nearbyAttractions: [
    { name: "Oia Sunset Viewpoint", distance: "2.5 km", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=300&h=200&fit=crop" },
    { name: "Akrotiri Archaeological Site", distance: "8 km", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop" },
    { name: "Red Beach", distance: "7 km", image: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=300&h=200&fit=crop" },
    { name: "Wine Tasting Tour", distance: "3 km", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=200&fit=crop" },
  ],
  related: [
    { id: 2, name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop", rating: 4.7 },
    { id: 3, name: "Amalfi Coast, Italy", image: "https://images.unsplash.com/photo-1612698090007-5b8e6a1f3b9e?w=400&h=300&fit=crop", rating: 4.9 },
    { id: 8, name: "Swiss Alps, Switzerland", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop", rating: 4.8 },
  ],
};

const infoItems = [
  { label: "Country", value: destinationData.country, icon: MdTravelExplore },
  { label: "City", value: destinationData.city, icon: FiMapPin },
  { label: "Location", value: destinationData.location, icon: FiMapPin },
  { label: "Category", value: destinationData.category, icon: MdCategory },
  { label: "Best Season", value: destinationData.bestSeason, icon: FiCalendar },
  { label: "Travel Time", value: destinationData.travelTime, icon: MdAccessTime },
  { label: "Entry Fee", value: destinationData.entryFee, icon: FiDollarSign },
  { label: "Rating", value: `${destinationData.rating} / 5.0 (${destinationData.reviews.toLocaleString()} reviews)`, icon: FiStar },
  { label: "Opening Hours", value: destinationData.openingHours, icon: FiClock },
];

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "June 2026",
    comment: "Absolutely breathtaking! The caldera views are even more stunning in person. We stayed in Oia and watched the sunset every evening — pure magic. The local food and wine were incredible too.",
    likes: 48,
  },
  {
    id: 2,
    name: "Marcus Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "May 2026",
    comment: "Santorini exceeded every expectation. The architecture, the people, the food — everything was perfect. Highly recommend the boat tour around the caldera and the wine tasting experience.",
    likes: 36,
  },
  {
    id: 3,
    name: "Emma Williams",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    rating: 4,
    date: "April 2026",
    comment: "Beautiful island with so much to explore. The only downside was the crowds in peak hours, but if you venture off the main paths you'll find quiet gems. The red beach is a must-see!",
    likes: 29,
  },
  {
    id: 4,
    name: "James Rodriguez",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "March 2026",
    comment: "Best destination for a romantic getaway. My partner and I fell in love with the island just as much as each other. The sunset in Oia is something everyone should experience at least once.",
    likes: 52,
  },
];

const ratingDistribution = [
  { stars: 5, count: 820 },
  { stars: 4, count: 310 },
  { stars: 3, count: 85 },
  { stars: 2, count: 20 },
  { stars: 1, count: 5 },
];

const DestinationDetails = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () => setCurrentImage((p) => (p === 0 ? destinationData.images.length - 1 : p - 1));
  const nextImage = () => setCurrentImage((p) => (p === destinationData.images.length - 1 ? 0 : p + 1));

  return (
    <div>
      {/* Breadcrumb */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/explore-destinations" className="hover:text-[var(--primary)] transition-colors">Destinations</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">{destinationData.name}</span>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Gallery */}
            <motion.div variants={fadeLeft} initial="hidden" animate="visible" className="relative rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src={destinationData.images[currentImage]}
                  alt={destinationData.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm"
              >
                <FiChevronLeft className="text-xl" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm"
              >
                <FiChevronRight className="text-xl" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {destinationData.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentImage(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      i === currentImage ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground)]">
                <FiStar className="text-[var(--accent)] fill-current" />
                {destinationData.rating}
              </div>
            </motion.div>

            {/* Thumbnail Strip */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {destinationData.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentImage(i)}
                  className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    i === currentImage
                      ? "border-[var(--primary)] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="relative w-20 h-16">
                    <Image
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </button>
              ))}
            </motion.div>

            {/* Overview */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Overview</h2>
              {destinationData.description.split("\n").map((para, i) => (
                <p key={i} className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-3 last:mb-0">
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Reviews & Ratings */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiStar className="text-[var(--accent)] text-xl" />
                <h2 className="text-xl font-bold text-[var(--foreground)]">Reviews & Ratings</h2>
              </div>

              {/* Rating Summary */}
              <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-[var(--border)] mb-6">
                <div className="text-center sm:text-left shrink-0">
                  <div className="text-4xl font-bold text-[var(--foreground)]">{destinationData.rating}</div>
                  <div className="flex gap-0.5 mt-1 justify-center sm:justify-start">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FiStar
                        key={i}
                        className={`text-sm ${
                          i <= Math.round(destinationData.rating)
                            ? "text-[var(--accent)] fill-current"
                            : "text-[var(--border)]"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-1">
                    {destinationData.reviews.toLocaleString()} reviews
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {ratingDistribution.map((dist) => (
                    <div key={dist.stars} className="flex items-center gap-2 text-sm">
                      <span className="text-xs text-[var(--muted-foreground)] w-4 shrink-0 text-right">
                        {dist.stars}
                      </span>
                      <FiStar className="text-[var(--accent)] fill-current text-[10px] shrink-0" />
                      <div className="flex-1 h-2 rounded-full bg-[var(--border)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--accent)] transition-all"
                          style={{
                            width: `${(dist.count / destinationData.reviews) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)] w-10 shrink-0 text-right">
                        {dist.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Cards */}
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    variants={fadeUp}
                    className="pb-5 border-b border-[var(--border)] last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url(${review.avatar})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="font-semibold text-sm text-[var(--foreground)]">
                            {review.name}
                          </div>
                          <span className="text-[11px] text-[var(--muted-foreground)]">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 mt-0.5 mb-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <FiStar
                              key={i}
                              className={`text-[10px] ${
                                i <= review.rating
                                  ? "text-[var(--accent)] fill-current"
                                  : "text-[var(--border)]"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                          {review.comment}
                        </p>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 mt-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer"
                        >
                          <FiThumbsUp className="text-xs" />
                          <span>Helpful ({review.likes})</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Write a Review */}
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Write a Review</h3>
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        className="text-[var(--border)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                      >
                        <FiStar className="text-lg" />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]/20 resize-none"
                  />
                  <button
                    type="button"
                    className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <FiSend className="text-xs" />
                    Submit Review
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Location */}
            <motion.div variants={fadeRight} initial="hidden" animate="visible" className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">
                {destinationData.name}
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] mb-4">
                <FiMapPin className="text-[var(--primary)] shrink-0" />
                <span>{destinationData.location}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <FiStar className="text-[var(--accent)] fill-current" />
                  <span className="font-semibold text-[var(--foreground)]">{destinationData.rating}</span>
                  <span className="text-[var(--muted-foreground)]">({destinationData.reviews.toLocaleString()})</span>
                </div>
              </div>
            </motion.div>

            {/* Basic Information */}
            <motion.div variants={fadeRight} initial="hidden" animate="visible" className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Basic Information</h3>
              <div className="space-y-4">
                {infoItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="text-sm text-[var(--primary)]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-[var(--muted-foreground)]">{item.label}</div>
                        <div className="text-sm font-medium text-[var(--foreground)] break-words">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Book Now */}
            <motion.div variants={fadeRight} initial="hidden" animate="visible" className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--primary)] mb-1">$1,299</div>
                <div className="text-xs text-[var(--muted-foreground)] mb-4">per person · 7 day package</div>
                <Button className="w-full bg-[var(--primary)] text-white rounded-xl mb-2" size="lg">
                  Book Your Trip
                </Button>
                <Button className="w-full bg-transparent border border-[var(--border)] text-[var(--foreground)] rounded-xl" size="lg">
                  Add to Wishlist
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Nearby Attractions */}
        <div className="mt-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Nearby Attractions</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {destinationData.nearbyAttractions.map((attraction) => (
              <motion.div key={attraction.name} variants={fadeUp}>
              <Card
                className="overflow-hidden border border-[var(--border)] rounded-2xl bg-[var(--card)]"
              >
                <div className="relative h-36">
                  <Image
                    src={attraction.image}
                    alt={attraction.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">{attraction.name}</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">{attraction.distance} away</p>
                </div>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Related Destinations */}
        <div className="mt-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--foreground)]">Related Destinations</h2>
            <Link
              href="/explore-destinations"
              className="text-sm text-[var(--primary)] hover:underline font-medium"
            >
              View All
            </Link>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinationData.related.map((dest) => (
              <motion.div key={dest.id} variants={fadeUp}>
              <Link href={`/destinations/${dest.id}`}>
                <Card className="overflow-hidden group border border-[var(--border)] rounded-2xl bg-[var(--card)] cursor-pointer">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-semibold text-[var(--foreground)]">
                      <FiStar className="text-[var(--accent)] fill-current text-xs" />
                      {dest.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">{dest.name}</h3>
                  </div>
                </Card>
              </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
