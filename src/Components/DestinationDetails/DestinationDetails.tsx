"use client";

import {
  fadeLeft,
  fadeRight,
  fadeUp,
  stagger,
} from "@/src/Components/Animations";
import { useSession } from "@/src/lib/auth-client";
import { useDestinations } from "@/src/lib/DestinationContext";
import { isValidUrl, formatDate } from "@/src/lib/utils";
import { Card } from "@heroui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiAward,
  FiBookmark,
  FiCalendar,
  FiCamera,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiGlobe,
  FiHeart,
  FiMapPin,
  FiStar,
  FiThumbsUp,
  FiUser,
  FiX,
} from "react-icons/fi";
import {
  MdAccessTime,
  MdCategory,
  MdTravelExplore,
  MdVerified,
} from "react-icons/md";

type SpotStatus = "pending" | "verified" | "cancelled";

interface Creator {
  name: string;
  avatar: string;
  role: string;
  bio: string;
  tag: string;
  destinations: number;
  photos: number;
  yearsExperience: number;
  verified: boolean;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  coverImage: string;
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
  createdAt: string;
  updatedAt: string;
  creator: Creator;
  nearbyAttractions: { name: string; distance: string; image: string }[];
  related: { id: string; name: string; image: string; rating: number }[];
}

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

const globalDescription = (name: string) =>
  `TravelSpot is your ultimate guide to discovering the world's most captivating destinations. Every place has a story to tell, and ${name} is no exception — a destination waiting to be explored, experienced, and remembered. Whether you are drawn to the rich tapestry of history and culture, the serenity of untouched natural landscapes, or the thrill of off-the-beaten-path adventures, TravelSpot brings you closer to the places that matter. Our platform is built for travelers who seek more than just a getaway — who want to connect with the soul of a destination, understand its heritage, and create lasting memories. From ancient architectural wonders and bustling local markets to tranquil coastlines and misty mountain retreats, every corner of the world holds something extraordinary. We believe that travel is not just about moving from one place to another — it is about discovering new perspectives, embracing diverse traditions, and finding inspiration in the unfamiliar. With detailed guides, authentic reviews, and a vibrant community of fellow explorers, TravelSpot empowers you to plan smarter, travel deeper, and share your journey with the world. Whether you are setting out on your very first adventure or you are a seasoned globetrotter looking for your next hidden gem, TravelSpot is here to inspire, inform, and connect you to the places that will leave a lasting mark on your soul. Let every trip be a story worth telling, and let TravelSpot be the compass that guides you there.`;

const DestinationDetails = ({
  destination,
  nearbyAttractions = [],
  relatedDestinations = [],
}: {
  destination: Destination;
  nearbyAttractions?: { id: string; name: string; distance: string; image: string }[];
  relatedDestinations?: { id: string; name: string; image: string; rating: number }[];
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const { data: session } = useSession();
  const user = session?.user;
  const {
    getSavedStatus,
    saveDestination,
    removeSavedDestination,
    updateSavedStatus,
  } = useDestinations();
  const destId = destination.id;
  const currentStatus = user ? getSavedStatus(user.id, destId) : null;

  const galleryImages = destination.images?.length
    ? destination.images
    : [destination.coverImage];
  const mainImage = galleryImages[currentImage] || galleryImages[0];

  const prevImage = () =>
    setCurrentImage((p) => (p === 0 ? galleryImages.length - 1 : p - 1));
  const nextImage = () =>
    setCurrentImage((p) => (p === galleryImages.length - 1 ? 0 : p + 1));
  const infoItems = [
    { label: "Country", value: destination.country, icon: MdTravelExplore },
    { label: "City", value: destination.city, icon: FiMapPin },
    { label: "Location", value: destination.location, icon: FiMapPin },
    { label: "Category", value: destination.category, icon: MdCategory },
    { label: "Best Season", value: destination.bestSeason, icon: FiCalendar },
    {
      label: "Travel Time",
      value: destination.travelTime,
      icon: MdAccessTime,
    },
    { label: "Entry Fee", value: destination.entryFee, icon: FiDollarSign },
    {
      label: "Rating",
      value: `${destination.rating} / 5.0 (${destination.reviews.toLocaleString()} reviews)`,
      icon: FiStar,
    },
    {
      label: "Opening Hours",
      value: destination.openingHours,
      icon: FiClock,
    },
  ];
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
            {destination.name}
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
                  src={mainImage}
                  alt={destination.name}
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
                {galleryImages.map((_, i) => (
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
              <div className="absolute  top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm font-semibold text-white">
                <FiStar className="text-(--accent) fill-current" />
                {destination.rating}
              </div>
            </motion.div>

            {/* Thumbnail Strip */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1"
            >
              {galleryImages.map((img, i) => (
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
              {destination.description.split("\n").map((para, i) => (
                <p
                  key={i}
                  className="text-sm text-(--muted-foreground) leading-relaxed mb-3 last:mb-0"
                >
                  {para}
                </p>
              ))}
              {destination.description.length <= 1000 && (
                <p className="text-sm text-(--muted-foreground) leading-relaxed mt-4 pt-4 border-t border-(--border)">
                  {globalDescription(destination.name)}
                </p>
              )}
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
                    {destination.rating}
                  </div>
                  <div className="flex gap-0.5 mt-1 justify-center sm:justify-start">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FiStar
                        key={i}
                        className={`text-sm ${
                          i <= Math.round(destination.rating)
                            ? "text-(--accent) fill-current"
                            : "text-(--border)"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-(--muted-foreground) mt-1">
                    {destination.reviews.toLocaleString()} reviews
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
                            width: `${(dist.count / destination.reviews) * 100}%`,
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
                          onClick={() => toast.success("Marked as helpful")}
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
                        onClick={() => setStarRating(i)}
                        className={`transition-colors cursor-pointer ${
                          i <= starRating
                            ? "text-(--accent)"
                            : "text-(--border) hover:text-(--accent)"
                        }`}
                      >
                        <FiStar
                          className={`text-lg ${i <= starRating ? "fill-current" : ""}`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full bg-background border border-(--border) rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none transition-colors focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20 resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!starRating) {
                        toast.error("Please select a rating");
                        return;
                      }
                      if (!reviewText.trim()) {
                        toast.error("Please write a review");
                        return;
                      }
                      toast.success("Review submitted successfully");
                      setStarRating(0);
                      setReviewText("");
                    }}
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
                  {destination.name}
                </h1>
                {destination.status === "verified" && (
                  <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    <MdVerified className="text-xs" />
                    Verified
                  </span>
                )}
                {destination.status === "pending" && (
                  <span className="shrink-0 inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    <FiClock className="text-xs" />
                    Under Review
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-(--muted-foreground) mb-4">
                <FiMapPin className="text-(--primary) shrink-0" />
                <span>{destination.location}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <FiStar className="text-(--accent) fill-current" />
                  <span className="font-semibold text-foreground">
                    {destination.rating}
                  </span>
                  <span className="text-(--muted-foreground)">
                    ({destination.reviews.toLocaleString()})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-(--border) text-xs text-(--muted-foreground)">
                <FiUser className="shrink-0" />
                <span>
                  Submitted by{" "}
                  <strong className="text-foreground font-medium">
                    {destination?.creator?.name.slice(0, 12)}..
                  </strong>
                </span>

                {destination.verifiedAt && (
                  <>
                    <span className="text-(--border)">|</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Verified On {formatDate(destination.verifiedAt)}
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
                      backgroundImage: `url(${
                        destination?.creator?.avatar ||
                        "https://i.ibb.co.com/C3KdYs59/495570867-681212604719403-4254930871176159415-n.jpg"
                      })`,
                    }}
                  />
                  {destination?.creator?.verified ? (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-(--primary) rounded-full flex items-center justify-center">
                      <MdVerified className="text-white text-xs" />
                    </div>
                  ) : (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-(--primary) rounded-full flex items-center justify-center">
                      <MdVerified className="text-white text-xs" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-foreground">
                      {destination?.creator?.name || "Chan Badsha Bhuiyan"}
                    </h3>
                  </div>
                  <p className="text-xs text-(--primary) font-medium">
                    {destination?.creator?.tag || "Local Travel Expert"}
                  </p>
                  <p className="text-xs text-(--muted-foreground) mt-1.5 leading-relaxed line-clamp-3">
                    {destination?.creator?.bio ||
                      "Touring the world with my friends"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-(--border)">
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">
                    {destination?.creator?.destinations || 24}
                  </p>
                  <p className="text-[10px] text-(--muted-foreground)">
                    Destinations
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">
                    {destination?.creator?.photos || 186}
                  </p>
                  <p className="text-[10px] text-(--muted-foreground)">
                    Photos
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">
                    {destination?.creator?.yearsExperience || 8}y
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
                      {destination.creator.name}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-(--muted-foreground)">
                  <FiCalendar className="shrink-0" />
                  <span>Submitted on {formatDate(destination.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-(--muted-foreground)">
                  <FiCamera className="shrink-0" />
                  <span>
                    {destination?.creator?.photos || 0} photos shared{" "}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-(--muted-foreground)">
                  <FiHeart className="shrink-0" />
                  <span>
                    {destination.reviews.toLocaleString()} reviews and counting
                  </span>
                </div>
                {destination.status === "pending" && (
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
                        onClick={() => {
                          removeSavedDestination(user.id, destId);
                          setShowDropdown(false);
                        }}
                        className={`flex-1 rounded-xl font-medium transition-all cursor-pointer h-10 text-sm flex items-center justify-center gap-2 ${
                          currentStatus === "visited"
                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
                            : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                        }`}
                      >
                        {currentStatus === "visited" ? (
                          <FiCheckCircle className="text-sm" />
                        ) : (
                          <FiBookmark className="text-sm" />
                        )}
                        {currentStatus === "visited"
                          ? "Visited"
                          : "Want to Visit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDropdown((p) => !p)}
                        className="w-10 h-10 rounded-xl border border-(--border) flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:border-(--primary) transition-all cursor-pointer shrink-0"
                      >
                        <FiChevronDown
                          className={`text-sm transition-transform ${showDropdown ? "rotate-180" : ""}`}
                        />
                      </button>
                      {showDropdown && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowDropdown(false)}
                          />
                          <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-(--card) border border-(--border) rounded-xl shadow-xl overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                updateSavedStatus(
                                  user.id,
                                  destId,
                                  "wantToVisit",
                                );
                                setShowDropdown(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                                currentStatus === "wantToVisit"
                                  ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                                  : "text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--background)"
                              }`}
                            >
                              <FiBookmark className="text-sm" /> Want to Visit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateSavedStatus(user.id, destId, "visited");
                                setShowDropdown(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                                currentStatus === "visited"
                                  ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                                  : "text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--background)"
                              }`}
                            >
                              <FiCheckCircle className="text-sm" /> Visited
                            </button>
                            <div className="border-t border-(--border)" />
                            <button
                              type="button"
                              onClick={() => {
                                removeSavedDestination(user.id, destId);
                                setShowDropdown(false);
                              }}
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
                        onClick={() => {
                          saveDestination(user.id, destId, "wantToVisit", {
                            name: destination.name,
                            image: destination.coverImage,
                            location: destination.location,
                          });
                          setShowDropdown(false);
                        }}
                        className="flex-1 rounded-xl font-medium transition-all cursor-pointer h-10 text-sm flex items-center justify-center gap-2 bg-transparent border border-(--border) text-foreground hover:border-amber-400 hover:text-amber-500"
                      >
                        <FiBookmark className="text-sm" /> Want to Visit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          saveDestination(user.id, destId, "visited", {
                            name: destination.name,
                            image: destination.coverImage,
                            location: destination.location,
                          });
                          setShowDropdown(false);
                        }}
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
            {nearbyAttractions.map((attraction, ind) => (
              <motion.div key={ind} variants={fadeUp}>
                <Link href={`/destinations/${attraction.id}`}>
                  <Card className="overflow-hidden group border border-(--border) rounded-2xl bg-(--card) cursor-pointer">
                    <div className="relative h-36">
                      <Image
                        src={isValidUrl(attraction.image) || "/placeholder.svg"}
                        alt={attraction?.name || ""}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                </Link>
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
            {relatedDestinations.map((dest, ind) => (
              <motion.div key={ind} variants={fadeUp}>
                <Link href={`/destinations/${dest.id}`}>
                  <Card className="overflow-hidden group border border-(--border) rounded-2xl bg-(--card) cursor-pointer">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={isValidUrl(dest.image) || "/placeholder.svg"}
                        alt={dest.name || ""}
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
