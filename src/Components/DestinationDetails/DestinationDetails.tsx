"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiMapPin,
  FiStar,
  FiClock,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiThumbsUp,
  FiUser,
  FiAward,
  FiGlobe,
  FiCamera,
  FiHeart,
  FiDollarSign,
  FiCheckCircle,
  FiBookmark,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import {
  MdTravelExplore,
  MdAccessTime,
  MdCategory,
  MdVerified,
} from "react-icons/md";
import { motion } from "framer-motion";
import { useSession } from "@/src/lib/auth-client";
import { useDestinations, type SaveStatus } from "@/src/lib/DestinationContext";
import {
  fadeUp,
  fadeLeft,
  fadeRight,
  stagger,
} from "@/src/Components/Animations";
import { Card } from "@heroui/react";

type SpotStatus = "pending" | "verified" | "cancelled";

interface Creator {
  name: string;
  avatar: string;
  role: string;
  bio: string;
  destinations: number;
  photos: number;
  yearsExperience: number;
  verified: boolean;
}

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
  status: SpotStatus;
  submittedBy: string;
  submittedAt: string;
  verifiedAt?: string;
  creator: Creator;
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
  status: "verified",
  submittedBy: "Elena Marchetti",
  submittedAt: "March 15, 2026",
  verifiedAt: "March 18, 2026",
  creator: {
    name: "Elena Marchetti",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face",
    role: "Local Travel Expert",
    bio: "Born and raised on the Greek islands, Elena has been sharing the hidden gems of Santorini with travelers for over a decade. She personally visits every destination she features to ensure authentic, up-to-date recommendations.",
    destinations: 24,
    photos: 186,
    yearsExperience: 8,
    verified: true,
  },
  nearbyAttractions: [
    {
      name: "Oia Sunset Viewpoint",
      distance: "2.5 km",
      image:
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=300&h=200&fit=crop",
    },
    {
      name: "Akrotiri Archaeological Site",
      distance: "8 km",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop",
    },
    {
      name: "Red Beach",
      distance: "7 km",
      image:
        "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=300&h=200&fit=crop",
    },
    {
      name: "Wine Tasting Tour",
      distance: "3 km",
      image:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=200&fit=crop",
    },
  ],
  related: [
    {
      id: 2,
      name: "Bali, Indonesia",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
      rating: 4.7,
    },
    {
      id: 3,
      name: "Amalfi Coast, Italy",
      image:
        "https://images.unsplash.com/photo-1612698090007-5b8e6a1f3b9e?w=400&h=300&fit=crop",
      rating: 4.9,
    },
    {
      id: 8,
      name: "Swiss Alps, Switzerland",
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop",
      rating: 4.8,
    },
  ],
};

const infoItems = [
  { label: "Country", value: destinationData.country, icon: MdTravelExplore },
  { label: "City", value: destinationData.city, icon: FiMapPin },
  { label: "Location", value: destinationData.location, icon: FiMapPin },
  { label: "Category", value: destinationData.category, icon: MdCategory },
  { label: "Best Season", value: destinationData.bestSeason, icon: FiCalendar },
  {
    label: "Travel Time",
    value: destinationData.travelTime,
    icon: MdAccessTime,
  },
  { label: "Entry Fee", value: destinationData.entryFee, icon: FiDollarSign },
  {
    label: "Rating",
    value: `${destinationData.rating} / 5.0 (${destinationData.reviews.toLocaleString()} reviews)`,
    icon: FiStar,
  },
  {
    label: "Opening Hours",
    value: destinationData.openingHours,
    icon: FiClock,
  },
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
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "June 2026",
    comment:
      "Absolutely breathtaking! The caldera views are even more stunning in person. We stayed in Oia and watched the sunset every evening — pure magic. The local food and wine were incredible too.",
    likes: 48,
  },
  {
    id: 2,
    name: "Marcus Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "May 2026",
    comment:
      "Santorini exceeded every expectation. The architecture, the people, the food — everything was perfect. Highly recommend the boat tour around the caldera and the wine tasting experience.",
    likes: 36,
  },
  {
    id: 3,
    name: "Emma Williams",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    rating: 4,
    date: "April 2026",
    comment:
      "Beautiful island with so much to explore. The only downside was the crowds in peak hours, but if you venture off the main paths you'll find quiet gems. The red beach is a must-see!",
    likes: 29,
  },
  {
    id: 4,
    name: "James Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "March 2026",
    comment:
      "Best destination for a romantic getaway. My partner and I fell in love with the island just as much as each other. The sunset in Oia is something everyone should experience at least once.",
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
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;
  const { getSavedStatus, saveDestination, removeSavedDestination, updateSavedStatus, getDestinationById } = useDestinations();
  const destId = "1";
  const currentStatus = user ? getSavedStatus(user.id, destId) : null;

  const prevImage = () =>
    setCurrentImage((p) =>
      p === 0 ? destinationData.images.length - 1 : p - 1,
    );
  const nextImage = () =>
    setCurrentImage((p) =>
      p === destinationData.images.length - 1 ? 0 : p + 1,
    );

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
      >
        <div className="flex items-center gap-2 text-sm text-(--muted-foreground)">
          <Link href="/" className="hover:text-(--primary) transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/explore-destinations"
            className="hover:text-(--primary) transition-colors"
          >
            Destinations
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">
            {destinationData.name}
          </span>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8 py-6 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Gallery */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              animate="visible"
              className="relative rounded-2xl overflow-hidden bg-(--card) border border-(--border)"
            >
              <div className="relative aspect-16/10">
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
                      i === currentImage
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <FiStar className="text-(--accent) fill-current" />
                {destinationData.rating}
              </div>
            </motion.div>

            {/* Thumbnail Strip */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1"
            >
              {destinationData.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentImage(i)}
                  className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    i === currentImage
                      ? "border-(--primary) opacity-100"
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
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-(--card) border border-(--border) rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-foreground mb-4">
                Overview
              </h2>
              {destinationData.description.split("\n").map((para, i) => (
                <p
                  key={i}
                  className="text-sm text-(--muted-foreground) leading-relaxed mb-3 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Reviews & Ratings */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-(--card) border border-(--border) rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <FiStar className="text-(--accent) text-xl" />
                <h2 className="text-xl font-bold text-foreground">
                  Reviews & Ratings
                </h2>
              </div>

              {/* Rating Summary */}
              <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-(--border) mb-6">
                <div className="text-center sm:text-left shrink-0">
                  <div className="text-4xl font-bold text-foreground">
                    {destinationData.rating}
                  </div>
                  <div className="flex gap-0.5 mt-1 justify-center sm:justify-start">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FiStar
                        key={i}
                        className={`text-sm ${
                          i <= Math.round(destinationData.rating)
                            ? "text-(--accent) fill-current"
                            : "text-(--border)"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-(--muted-foreground) mt-1">
                    {destinationData.reviews.toLocaleString()} reviews
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {ratingDistribution.map((dist) => (
                    <div
                      key={dist.stars}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-xs text-(--muted-foreground) w-4 shrink-0 text-right">
                        {dist.stars}
                      </span>
                      <FiStar className="text-(--accent) fill-current text-[10px] shrink-0" />
                      <div className="flex-1 h-2 rounded-full bg-(--border) overflow-hidden">
                        <div
                          className="h-full rounded-full bg-(--accent) transition-all"
                          style={{
                            width: `${(dist.count / destinationData.reviews) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-(--muted-foreground) w-10 shrink-0 text-right">
                        {dist.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Cards */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    variants={fadeUp}
                    className="pb-5 border-b border-(--border) last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url(${review.avatar})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="font-semibold text-sm text-foreground">
                            {review.name}
                          </div>
                          <span className="text-[11px] text-(--muted-foreground)">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex gap-0.5 mt-0.5 mb-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <FiStar
                              key={i}
                              className={`text-[10px] ${
                                i <= review.rating
                                  ? "text-(--accent) fill-current"
                                  : "text-(--border)"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-(--muted-foreground) leading-relaxed">
                          {review.comment}
                        </p>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 mt-2 text-xs text-(--muted-foreground) hover:text-(--primary) transition-colors cursor-pointer"
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
              <div className="mt-6 pt-6 border-t border-(--border)">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Write a Review
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        className="text-(--border) hover:text-(--accent) transition-colors cursor-pointer"
                      >
                        <FiStar className="text-lg" />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full bg-background border border-(--border) rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none transition-colors focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20 resize-none"
                  />
                  <button
                    type="button"
                    className="bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <FiStar className="text-xs" />
                    Submit Review
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Location */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              className="bg-(--card) border border-(--border) rounded-2xl p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {destinationData.name}
                </h1>
                {destinationData.status === "verified" && (
                  <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    <MdVerified className="text-xs" />
                    Verified
                  </span>
                )}
                {destinationData.status === "pending" && (
                  <span className="shrink-0 inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    <FiClock className="text-xs" />
                    Under Review
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-(--muted-foreground) mb-4">
                <FiMapPin className="text-(--primary) shrink-0" />
                <span>{destinationData.location}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <FiStar className="text-(--accent) fill-current" />
                  <span className="font-semibold text-foreground">
                    {destinationData.rating}
                  </span>
                  <span className="text-(--muted-foreground)">
                    ({destinationData.reviews.toLocaleString()})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-(--border) text-xs text-(--muted-foreground)">
                <FiUser className="shrink-0" />
                <span>
                  Submitted by{" "}
                  <strong className="text-foreground font-medium">
                    {destinationData.submittedBy}
                  </strong>
                </span>
                <span className="text-(--border)">|</span>
                <span>{destinationData.submittedAt}</span>
                {destinationData.verifiedAt && (
                  <>
                    <span className="text-(--border)">|</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Verified {destinationData.verifiedAt}
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Creator Profile */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              className="bg-(--card) border border-(--border) rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div
                    className="w-16 h-16 rounded-xl bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${destinationData.creator.avatar})`,
                    }}
                  />
                  {destinationData.creator.verified && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-(--primary) rounded-full flex items-center justify-center">
                      <MdVerified className="text-white text-xs" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-foreground">
                      {destinationData.creator.name}
                    </h3>
                  </div>
                  <p className="text-xs text-(--primary) font-medium">
                    {destinationData.creator.role}
                  </p>
                  <p className="text-xs text-(--muted-foreground) mt-1.5 leading-relaxed line-clamp-3">
                    {destinationData.creator.bio}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-(--border)">
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">
                    {destinationData.creator.destinations}
                  </p>
                  <p className="text-[10px] text-(--muted-foreground)">
                    Destinations
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">
                    {destinationData.creator.photos}
                  </p>
                  <p className="text-[10px] text-(--muted-foreground)">
                    Photos
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">
                    {destinationData.creator.yearsExperience}y
                  </p>
                  <p className="text-[10px] text-(--muted-foreground)">
                    Experience
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Basic Information */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              className="bg-(--card) border border-(--border) rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-4">
                Basic Information
              </h3>
              <div className="space-y-4">
                {infoItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-(--primary)/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="text-sm text-(--primary)" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-(--muted-foreground)">
                          {item.label}
                        </div>
                        <div className="text-sm font-medium text-foreground wrap-break-word">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Tour Guides */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              className="bg-(--card) border border-(--border) rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <FiAward className="text-(--primary) text-lg" />
                <h3 className="text-base font-bold text-foreground">
                  Local Tour Guides
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    name: "Nikos Papadopoulos",
                    languages: "English, Greek",
                    rating: 4.9,
                    tours: 124,
                    image:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
                  },
                  {
                    name: "Maria Kostas",
                    languages: "English, Greek, French",
                    rating: 4.8,
                    tours: 98,
                    image:
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
                  },
                ].map((guide) => (
                  <div
                    key={guide.name}
                    className="flex items-start gap-3 pb-3 border-b border-(--border) last:border-0 last:pb-0"
                  >
                    <div
                      className="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url(${guide.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {guide.name}
                      </p>
                      <p className="text-[11px] text-(--muted-foreground)">
                        {guide.languages}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          <FiStar className="text-(--accent) fill-current text-[10px]" />
                          <span className="text-[11px] font-medium text-foreground">
                            {guide.rating}
                          </span>
                        </div>
                        <span className="text-[10px] text-(--muted-foreground)">
                          {guide.tours} tours
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-(--muted-foreground) mt-3 leading-relaxed">
                These are independent local guides listed for your reference.
                Contact them directly for personalized tours.
              </p>
            </motion.div>

            {/* Community Info */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              className="bg-(--card) border border-(--border) rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <FiGlobe className="text-(--primary) text-lg" />
                <h3 className="text-base font-bold text-foreground">
                  Community Info
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-(--muted-foreground)">
                  <FiUser className="shrink-0" />
                  <span>
                    Added by{" "}
                    <strong className="text-foreground">
                      {destinationData.submittedBy}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-(--muted-foreground)">
                  <FiCalendar className="shrink-0" />
                  <span>Submitted on {destinationData.submittedAt}</span>
                </div>
                <div className="flex items-center gap-2 text-(--muted-foreground)">
                  <FiCamera className="shrink-0" />
                  <span>{destinationData.creator.photos} photos shared</span>
                </div>
                <div className="flex items-center gap-2 text-(--muted-foreground)">
                  <FiHeart className="shrink-0" />
                  <span>
                    {destinationData.reviews.toLocaleString()} travelers found
                    this helpful
                  </span>
                </div>
                {destinationData.status === "pending" && (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2 mt-2">
                    <FiClock className="shrink-0 text-sm" />
                    <span className="text-xs">
                      This spot is pending review by moderators.
                    </span>
                  </div>
                )}
              </div>
              {user ? (
                <div className="relative mt-4">
                  {currentStatus ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { removeSavedDestination(user.id, destId); setShowDropdown(false); }}
                        className={`flex-1 rounded-xl font-medium transition-all cursor-pointer h-10 text-sm flex items-center justify-center gap-2 ${
                          currentStatus === "visited"
                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
                            : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                        }`}
                      >
                        {currentStatus === "visited" ? <FiCheckCircle className="text-sm" /> : <FiBookmark className="text-sm" />}
                        {currentStatus === "visited" ? "Visited" : "Want to Visit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDropdown((p) => !p)}
                        className="w-10 h-10 rounded-xl border border-(--border) flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:border-(--primary) transition-all cursor-pointer shrink-0"
                      >
                        <FiChevronDown className={`text-sm transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                      </button>
                      {showDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                          <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-(--card) border border-(--border) rounded-xl shadow-xl overflow-hidden">
                            <button
                              type="button"
                              onClick={() => { updateSavedStatus(user.id, destId, "wantToVisit"); setShowDropdown(false); }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                                currentStatus === "wantToVisit" ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20" : "text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--background)"
                              }`}
                            >
                              <FiBookmark className="text-sm" /> Want to Visit
                            </button>
                            <button
                              type="button"
                              onClick={() => { updateSavedStatus(user.id, destId, "visited"); setShowDropdown(false); }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                                currentStatus === "visited" ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20" : "text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--background)"
                              }`}
                            >
                              <FiCheckCircle className="text-sm" /> Visited
                            </button>
                            <div className="border-t border-(--border)" />
                            <button
                              type="button"
                              onClick={() => { removeSavedDestination(user.id, destId); setShowDropdown(false); }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left text-(--error) hover:bg-(--error)/10 transition-colors cursor-pointer"
                            >
                              <FiX className="text-sm" /> Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { saveDestination(user.id, destId, "wantToVisit"); setShowDropdown(false); }}
                        className="flex-1 rounded-xl font-medium transition-all cursor-pointer h-10 text-sm flex items-center justify-center gap-2 bg-transparent border border-(--border) text-foreground hover:border-amber-400 hover:text-amber-500"
                      >
                        <FiBookmark className="text-sm" /> Want to Visit
                      </button>
                      <button
                        type="button"
                        onClick={() => { saveDestination(user.id, destId, "visited"); setShowDropdown(false); }}
                        className="flex-1 rounded-xl font-medium transition-all cursor-pointer h-10 text-sm flex items-center justify-center gap-2 bg-transparent border border-(--border) text-foreground hover:border-green-400 hover:text-green-500"
                      >
                        <FiCheckCircle className="text-sm" /> Visited
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="w-full mt-4 rounded-xl font-medium transition-all cursor-pointer h-10 text-sm flex items-center justify-center gap-2 bg-transparent border border-(--border) text-foreground hover:border-(--primary) hover:text-(--primary) no-underline"
                >
                  <FiHeart className="text-sm" />
                  Sign in to Save
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        {/* Nearby Attractions */}
        <div className="mt-8  w-full">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-bold text-foreground mb-6">
              Nearby Attractions
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {destinationData.nearbyAttractions.map((attraction) => (
              <motion.div key={attraction.name} variants={fadeUp}>
                <Card className="overflow-hidden border border-(--border) rounded-2xl bg-(--card)">
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
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {attraction.name}
                    </h3>
                    <p className="text-xs text-(--muted-foreground)">
                      {attraction.distance} away
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Related Destinations */}
        <div className="mt-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-xl font-bold text-foreground">
              Related Destinations
            </h2>
            <Link
              href="/explore-destinations"
              className="text-sm text-(--primary) hover:underline font-medium"
            >
              View All
            </Link>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {destinationData.related.map((dest) => (
              <motion.div key={dest.id} variants={fadeUp}>
                <Link href={`/destinations/${dest.id}`}>
                  <Card className="overflow-hidden group border border-(--border) rounded-2xl bg-(--card) cursor-pointer">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-semibold text-foreground">
                        <FiStar className="text-(--accent) fill-current text-xs" />
                        {dest.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-foreground">
                        {dest.name}
                      </h3>
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
