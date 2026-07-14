"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiCamera,
  FiSend,
  FiTag,
  FiPlus,
  FiX,
  FiClock,
  FiLogIn,
  FiGlobe,
  FiSun,
  FiDollarSign,
  FiImage,
  FiChevronDown,
  FiLoader,
  FiTrash2,
  FiStar,
  FiCheck,
  FiArrowLeft,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import {
  MdTravelExplore,
  MdCategory,
  MdAccessTime,
  MdVerified,
} from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { fadeUp } from "@/src/Components/Animations";
import { useSession } from "@/src/lib/auth-client";
import { addDestination } from "@/src/services/destinationsCommandService";
import AuthLoader from "@/src/Components/UI/AuthLoader";
import CropModal from "@/src/Components/UI/CropModal";
import toast from "react-hot-toast";

const categories = [
  "Adventure",
  "Beach",
  "Mountain",
  "Culture",
  "Food & Wine",
  "Nature",
  "Historical",
  "Urban",
];

const seasons = ["Spring", "Summer", "Autumn", "Winter", "Year-round"];

const allPlaceIds = [
  "6a55343a82047d8970853008", "6a55343a82047d8970853009", "6a55344782047d897085300b",
  "6a55344782047d897085300c", "6a5534c982047d897085300e", "6a5534c982047d897085300f",
  "6a5534f782047d8970853011", "6a5534f782047d8970853012", "6a55350282047d8970853014",
  "6a55350282047d8970853015", "6a55352c82047d8970853017", "6a55352c82047d8970853018",
  "6a55352c82047d8970853019", "6a560e94a10b08d976247ded", "6a560e94a10b08d976247dee",
  "6a560e94a10b08d976247def", "6a560e94a10b08d976247df0", "6a560e9ca10b08d976247df2",
  "6a560e9ca10b08d976247df3", "6a560e9ca10b08d976247df4", "6a560e9ca10b08d976247df5",
];

function shuffleAndPick(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}



type UploadStatus = "idle" | "uploading" | "done" | "error";

export default function SuggestSpot() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const coverInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    country: "",
    city: "",
    location: "",
    category: "",
    bestSeason: "",
    travelTime: "",
    entryFee: "",
    openingHours: "",
    description: "",
    facilities: [""],
    coverImage: "",
    images: [] as string[],
    nearbyAttractions: [] as string[],
    related: [] as string[],
  });

  const [coverPreview, setCoverPreview] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [coverUploadStatus, setCoverUploadStatus] =
    useState<UploadStatus>("idle");
  const [imagesUploadStatus, setImagesUploadStatus] =
    useState<UploadStatus>("idle");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [cropModal, setCropModal] = useState<{
    imageUrl: string;
    aspect: number;
    target: "cover" | "gallery";
  } | null>(null);



  const uploadToImgBB = useCallback(async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API_URL}`, {
      method: "POST",
      body: fd,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json?.error?.message || "Upload failed");
    return json.data.display_url || json.data.url;
  }, []);

  const handleCoverFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setCoverPreview(blobUrl);
    setCropModal({ imageUrl: blobUrl, aspect: 16 / 10, target: "cover" });
    e.target.value = "";
  };

  const handleCoverCropComplete = async (croppedFile: File) => {
    setCropModal(null);
    setCoverUploadStatus("uploading");
    try {
      const url = await uploadToImgBB(croppedFile);
      setForm((p) => ({ ...p, coverImage: url }));
      setCoverUploadStatus("done");
      toast.success("Cover image uploaded");
    } catch {
      setCoverUploadStatus("error");
      setCoverPreview("");
      toast.error("Cover image upload failed");
    }
  };

  const handleImagesFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setCropModal({ imageUrl: blobUrl, aspect: 4 / 3, target: "gallery" });
    e.target.value = "";
  };

  const handleGalleryCropComplete = async (croppedFile: File) => {
    setCropModal(null);
    setImagesUploadStatus("uploading");
    try {
      const url = await uploadToImgBB(croppedFile);
      setForm((p) => ({ ...p, images: [...p.images, url] }));
      setImagePreviews((p) => [...p, url]);
      setImagesUploadStatus("done");
      toast.success("Image uploaded");
    } catch {
      setImagesUploadStatus("error");
      toast.error("Image upload failed");
    }
  };

  const removeImage = (index: number) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
    setImagePreviews((p) => p.filter((_, i) => i !== index));
  };
  const removeCover = () => {
    setForm((p) => ({ ...p, coverImage: "" }));
    setCoverPreview("");
    setCoverUploadStatus("idle");
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const addFacility = () =>
    setForm((p) => ({ ...p, facilities: [...p.facilities, ""] }));
  const removeFacility = (i: number) =>
    setForm((p) => ({
      ...p,
      facilities: p.facilities.filter((_, j) => j !== i),
    }));
  const updateFacility = (i: number, v: string) =>
    setForm((p) => {
      const f = [...p.facilities];
      f[i] = v;
      return { ...p, facilities: f };
    });



  const canGoStep2 = form.name && form.country && form.city && form.category;
  const canGoStep3 = form.coverImage && form.description.trim().length >= 500;

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    const pickCount = Math.min(5, Math.floor(allPlaceIds.length / 2));
    try {
      await addDestination({
        name: form.name,
        country: form.country,
        city: form.city,
        location: form.location,
        category: form.category,
        bestSeason: form.bestSeason,
        travelTime: form.travelTime,
        entryFee: form.entryFee,
        openingHours: form.openingHours,
        description: form.description,
        facilities: form.facilities.filter((f) => f.trim() !== ""),
        coverImage: form.coverImage,
        images: form.images,
        nearbyAttractions: shuffleAndPick(allPlaceIds, pickCount),
        related: shuffleAndPick(allPlaceIds, pickCount),
        submittedBy: user.name || "Anonymous",
        creatorId: user.id,
      });
      toast.success("Spot suggested successfully! Pending review.");
      setForm({
        name: "",
        country: "",
        city: "",
        location: "",
        category: "",
        bestSeason: "",
        travelTime: "",
        entryFee: "",
        openingHours: "",
        description: "",
        facilities: [""],
        coverImage: "",
        images: [],
        nearbyAttractions: [],
        related: [],
      });
      setCoverPreview("");
      setImagePreviews([]);
      setCoverUploadStatus("idle");
      setImagesUploadStatus("idle");
      setStep(1);
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending) return <AuthLoader fullScreen />;

  if (!session) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-(--card) border border-(--border) rounded-2xl p-10 max-w-md mx-auto"
        >
          <FiLogIn className="text-5xl text-(--muted-foreground) mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-(--foreground) mb-2">
            Sign in Required
          </h2>
          <p className="text-(--muted-foreground) text-sm mb-6">
            You need to be signed in to suggest a tourist spot.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <FiLogIn /> Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <MdTravelExplore className="text-[var(--accent)] text-2xl" />
            <span className="text-[var(--accent)] font-semibold text-sm tracking-widest uppercase">
              Contribute
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Suggest a Tourist Spot
          </h1>
          <p className="text-white/70 max-w-lg mx-auto">
            Share a place you love with the community. Your suggestion helps
            fellow travelers discover amazing spots.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {submitted ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center bg-(--card) border border-(--border) rounded-2xl p-10"
          >
            <MdTravelExplore className="text-5xl text-(--primary) mx-auto mb-4" />
            <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <FiClock className="text-sm" /> Pending Review
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Thank You!
            </h2>
            <p className="text-(--muted-foreground) mb-6">
              Your spot suggestion has been submitted and is now pending review
              by our moderators.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="bg-(--primary) hover:bg-(--primary-hover) text-white font-semibold px-8 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Suggest Another Spot
            </button>
          </motion.div>
        ) : (
          <>
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    if (
                      s < step ||
                      (s === 2 && canGoStep2) ||
                      (s === 3 && canGoStep3)
                    )
                      setStep(s);
                  }}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer ${s === step ? "text-(--primary)" : s < step ? "text-(--primary)" : "text-(--muted-foreground)"}`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${s === step ? "border-(--primary) bg-(--primary)/10 text-(--primary)" : s < step ? "border-(--primary) bg-(--primary) text-white" : "border-(--border) text-(--muted-foreground)"}`}
                  >
                    {s < step ? <FiCheck className="text-sm" /> : s}
                  </span>
                  <span className="hidden sm:inline">
                    {s === 1
                      ? "Basic Info"
                      : s === 2
                        ? "Media & Details"
                        : "Preview"}
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-(--card) border border-(--border) rounded-2xl p-6 md:p-8 space-y-6"
                >
                  <h2 className="text-lg font-bold text-foreground">
                    Basic Information
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Spot Name *
                      </label>
                      <div className="relative">
                        <MdTravelExplore className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg" />
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, name: e.target.value }))
                          }
                          placeholder="e.g., Eiffel Tower"
                          className="w-full bg-(--background) border border-(--border) rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Country *
                      </label>
                      <div className="relative">
                        <FiGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg" />
                        <input
                          type="text"
                          value={form.country}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, country: e.target.value }))
                          }
                          placeholder="e.g., France"
                          className="w-full bg-(--background) border border-(--border) rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        City *
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg" />
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, city: e.target.value }))
                          }
                          placeholder="e.g., Paris"
                          className="w-full bg-(--background) border border-(--border) rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Location
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg" />
                        <input
                          type="text"
                          value={form.location}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, location: e.target.value }))
                          }
                          placeholder="Full address or area"
                          className="w-full bg-(--background) border border-(--border) rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Category *
                      </label>
                      <div className="relative">
                        <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg z-10" />
                        <select
                          value={form.category}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, category: e.target.value }))
                          }
                          className="w-full bg-(--background) border border-(--border) rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none appearance-none cursor-pointer focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat.toLowerCase()}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Best Season
                      </label>
                      <div className="relative">
                        <FiSun className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg z-10" />
                        <select
                          value={form.bestSeason}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              bestSeason: e.target.value,
                            }))
                          }
                          className="w-full bg-(--background) border border-(--border) rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none appearance-none cursor-pointer focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                        >
                          <option value="">Select season</option>
                          {seasons.map((s) => (
                            <option key={s} value={s.toLowerCase()}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Travel Time
                      </label>
                      <div className="relative">
                        <FiClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm" />
                        <input
                          type="text"
                          value={form.travelTime}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              travelTime: e.target.value,
                            }))
                          }
                          placeholder="e.g., 2-3 hours"
                          className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Entry Fee
                      </label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-base" />
                        <input
                          type="text"
                          value={form.entryFee}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, entryFee: e.target.value }))
                          }
                          placeholder="e.g., $15 per person"
                          className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Opening Hours
                      </label>
                      <div className="relative">
                        <FiClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm" />
                        <input
                          type="text"
                          value={form.openingHours}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              openingHours: e.target.value,
                            }))
                          }
                          placeholder="e.g., 9AM - 5PM"
                          className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (canGoStep2) setStep(2);
                      }}
                      className={`px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer transition-colors ${canGoStep2 ? "bg-(--primary) hover:bg-(--primary-hover) text-white" : "bg-(--border) text-(--muted-foreground) cursor-not-allowed"}`}
                      disabled={!canGoStep2}
                    >
                      Next <FiChevronDown className="rotate-[-90deg] text-sm" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-(--card) border border-(--border) rounded-2xl p-6 md:p-8 space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-9 h-9 rounded-xl border border-(--border) flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) transition-colors cursor-pointer"
                    >
                      <FiArrowLeft />
                    </button>
                    <h2 className="text-lg font-bold text-foreground">
                      Media & Details
                    </h2>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Description *{" "}
                      <span className="text-(--muted-foreground) font-normal">
                        (min 500 characters)
                      </span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                      }
                      rows={6}
                      placeholder="Describe the spot in detail — what makes it special, what visitors can expect, historical or cultural significance, tips for visiting..."
                      className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20 resize-none"
                      required
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      <span
                        className={`text-xs ${form.description.length < 500 ? "text-(--error)" : "text-(--success)"}`}
                      >
                        {form.description.length} / 500{" "}
                        {form.description.length < 500
                          ? `(${500 - form.description.length} more needed)`
                          : "minimum met"}
                      </span>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Facilities & Amenities
                    </label>
                    <div className="space-y-2">
                      {form.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={facility}
                            onChange={(e) =>
                              updateFacility(index, e.target.value)
                            }
                            placeholder="e.g., Parking, Restrooms, Guided Tours"
                            className="flex-1 bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                          />
                          {form.facilities.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFacility(index)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--error) hover:bg-(--error)/10 transition-colors cursor-pointer"
                            >
                              <FiX className="text-sm" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addFacility}
                      className="mt-2 flex items-center gap-1.5 text-sm text-(--primary) hover:text-(--primary-hover) font-medium transition-colors cursor-pointer"
                    >
                      <FiPlus className="text-xs" /> Add Facility
                    </button>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Cover Image *
                    </label>
                    {coverPreview ? (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-(--border) group">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <button
                            type="button"
                            onClick={removeCover}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-opacity cursor-pointer"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                        {coverUploadStatus === "uploading" && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <FiLoader className="text-white text-2xl animate-spin" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="w-full h-48 border-2 border-dashed border-(--border) rounded-xl flex flex-col items-center justify-center gap-2 text-(--muted-foreground) hover:border-(--primary) hover:text-(--primary) transition-colors cursor-pointer"
                      >
                        <FiCamera className="text-2xl" />
                        <span className="text-sm font-medium">
                          Upload Cover Image
                        </span>
                      </button>
                    )}
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Gallery Images */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Additional Images
                    </label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {imagePreviews.map((preview, idx) => (
                        <div
                          key={idx}
                          className="relative w-24 h-24 rounded-xl overflow-hidden border border-(--border) group"
                        >
                          <img
                            src={preview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <FiX className="text-xs" />
                          </button>
                        </div>
                      ))}
                      {imagesUploadStatus === "uploading" && (
                        <div className="w-24 h-24 border-2 border-dashed border-(--border) rounded-xl flex items-center justify-center">
                          <FiLoader className="text-(--muted-foreground) text-xl animate-spin" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => imagesInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-sm text-(--primary) hover:text-(--primary-hover) font-medium transition-colors cursor-pointer"
                    >
                      <FiImage className="text-xs" /> Add Images
                    </button>
                    <input
                      ref={imagesInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImagesFileSelect}
                      className="hidden"
                    />
                  </div>



                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 rounded-xl border border-(--border) text-foreground font-semibold text-sm hover:bg-(--background) transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (canGoStep3) setStep(3);
                      }}
                      className={`px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer transition-colors ${canGoStep3 ? "bg-(--primary) hover:bg-(--primary-hover) text-white" : "bg-(--border) text-(--muted-foreground) cursor-not-allowed"}`}
                      disabled={!canGoStep3}
                    >
                      Preview{" "}
                      <FiChevronDown className="rotate-[-90deg] text-sm" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-9 h-9 rounded-xl border border-(--border) flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) transition-colors cursor-pointer"
                    >
                      <FiArrowLeft />
                    </button>
                    <h2 className="text-lg font-bold text-foreground">
                      Preview
                    </h2>
                  </div>

                  {/* Preview layout matching DestinationDetails */}
                  <div className="grid lg:grid-cols-5 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                      {/* Gallery */}
                      <div
                        className="relative rounded-2xl overflow-hidden bg-(--card) border border-(--border)"
                        style={{ aspectRatio: "16/10" }}
                      >
                        <img
                          src={form.coverImage}
                          alt={form.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                          <span className="w-6 h-2 rounded-full bg-white" />
                          {form.images.slice(0, 4).map((_, i) => (
                            <span
                              key={i}
                              className="w-2 h-2 rounded-full bg-white/50"
                            />
                          ))}
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          <FiStar className="text-(--accent) fill-current text-sm" />{" "}
                          New
                        </div>
                      </div>
                      {form.images.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {[form.coverImage, ...form.images]
                            .slice(0, 6)
                            .map((img, i) => (
                              <div
                                key={i}
                                className={`shrink-0 rounded-xl overflow-hidden border-2 ${i === 0 ? "border-(--primary) opacity-100" : "border-transparent opacity-60"}`}
                              >
                                <div className="relative w-20 h-16">
                                  <img
                                    src={img}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Overview */}
                      <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-foreground mb-4">
                          Overview
                        </h2>
                        <p className="text-sm text-(--muted-foreground) leading-relaxed">
                          {form.description}
                        </p>
                      </div>

                      {/* Facilities */}
                      {form.facilities.filter((f) => f.trim()).length > 0 && (
                        <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
                          <h2 className="text-xl font-bold text-foreground mb-4">
                            Facilities
                          </h2>
                          <div className="flex flex-wrap gap-2">
                            {form.facilities
                              .filter((f) => f.trim())
                              .map((f, i) => (
                                <span
                                  key={i}
                                  className="bg-(--primary)/10 text-(--primary) text-xs font-medium px-3 py-1.5 rounded-full"
                                >
                                  {f}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Title & Location */}
                      <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h1 className="text-2xl font-bold text-foreground">
                            {form.name || "Untitled Spot"}
                          </h1>
                          <span className="shrink-0 inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            <FiClock className="text-xs" /> Pending
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-(--muted-foreground) mb-4">
                          <FiMapPin className="text-(--primary) shrink-0" />
                          <span>
                            {[form.city, form.country]
                              .filter(Boolean)
                              .join(", ") ||
                              form.location ||
                              "Location not set"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <FiStar className="text-(--accent) fill-current" />
                            <span className="font-semibold text-foreground">
                              New
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-(--border) text-xs text-(--muted-foreground)">
                          <FiUser className="shrink-0" />
                          <span>
                            Submitted by{" "}
                            <strong className="text-foreground font-medium">
                              {user?.name || "You"}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* Basic Information */}
                      <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-foreground mb-4">
                          Basic Information
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              label: "Country",
                              value: form.country,
                              icon: MdTravelExplore,
                            },
                            { label: "City", value: form.city, icon: FiMapPin },
                            {
                              label: "Location",
                              value: form.location,
                              icon: FiMapPin,
                            },
                            {
                              label: "Category",
                              value: form.category,
                              icon: MdCategory,
                            },
                            {
                              label: "Best Season",
                              value: form.bestSeason,
                              icon: FiCalendar,
                            },
                            {
                              label: "Travel Time",
                              value: form.travelTime,
                              icon: MdAccessTime,
                            },
                            {
                              label: "Entry Fee",
                              value: form.entryFee,
                              icon: FiDollarSign,
                            },
                            {
                              label: "Opening Hours",
                              value: form.openingHours,
                              icon: FiClock,
                            },
                          ]
                            .filter((item) => item.value)
                            .map((item) => {
                              const Icon = item.icon;
                              return (
                                <div
                                  key={item.label}
                                  className="flex items-start gap-3"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-(--primary)/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <Icon className="text-sm text-(--primary)" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs text-(--muted-foreground)">
                                      {item.label}
                                    </div>
                                    <div className="text-sm font-medium text-foreground">
                                      {item.value}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          {[
                            form.country,
                            form.city,
                            form.category,
                            form.bestSeason,
                            form.travelTime,
                            form.entryFee,
                            form.openingHours,
                          ].every((v) => !v) && (
                            <p className="text-sm text-(--muted-foreground)">
                              No additional information provided.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Nearby Attractions */}
                      {form.nearbyAttractions.length > 0 && (
                        <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
                          <h3 className="text-base font-bold text-foreground mb-3">
                            Nearby Attractions
                          </h3>
                          <ul className="space-y-2">
                            {form.nearbyAttractions.map((id) => {
                              const p = allPlaces.find((x) => x._id === id);
                              return p ? (
                                <li
                                  key={id}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <FiMapPin className="text-(--primary) shrink-0 text-xs" />
                                  <span className="text-foreground font-medium">
                                    {p.name}
                                  </span>
                                </li>
                              ) : null;
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Related Spots */}
                      {form.related.length > 0 && (
                        <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
                          <h3 className="text-base font-bold text-foreground mb-3">
                            Related Spots
                          </h3>
                          <ul className="space-y-2">
                            {form.related.map((id) => {
                              const p = allPlaces.find((x) => x._id === id);
                              return p ? (
                                <li
                                  key={id}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <MdTravelExplore className="text-(--accent) shrink-0 text-xs" />
                                  <span className="text-foreground font-medium">
                                    {p.name}
                                  </span>
                                </li>
                              ) : null;
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-xl border border-(--border) text-foreground font-semibold text-sm hover:bg-(--background) transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-10 py-3 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-white font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <FiLoader className="text-sm animate-spin" />{" "}
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiSend className="text-sm" /> Submit Suggestion
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Crop Modal */}
      {cropModal && (
        <CropModal
          imageUrl={cropModal.imageUrl}
          aspect={cropModal.aspect}
          onCropComplete={
            cropModal.target === "cover"
              ? handleCoverCropComplete
              : handleGalleryCropComplete
          }
          onClose={() => {
            setCropModal(null);
            if (cropModal.target === "cover") {
              setCoverPreview("");
              setCoverUploadStatus("idle");
            }
          }}
        />
      )}
    </div>
  );
}
