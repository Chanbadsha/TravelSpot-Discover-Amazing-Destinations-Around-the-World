"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiCamera,
  FiSend,
  FiUser,
  FiTag,
  FiPlus,
  FiX,
  FiClock,
  FiLogIn,
} from "react-icons/fi";
import { MdTravelExplore } from "react-icons/md";
import Link from "next/link";
import { fadeUp } from "@/src/Components/Animations";
import { useDestinations } from "@/src/lib/DestinationContext";
import { useSession } from "@/src/lib/auth-client";
import AuthLoader from "@/src/Components/UI/AuthLoader";
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

export default function SuggestSpot() {
  const { addDestination } = useDestinations();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
    facilities: [""],
    photos: [] as string[],
    guideName: "",
    guideContact: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const addFacility = () => {
    setForm((prev) => ({ ...prev, facilities: [...prev.facilities, ""] }));
  };

  const removeFacility = (index: number) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  const updateFacility = (index: number, value: string) => {
    setForm((prev) => {
      const updated = [...prev.facilities];
      updated[index] = value;
      return { ...prev, facilities: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryLabel = form.category;
    const filteredFacilities = form.facilities.filter((f) => f.trim() !== "");
    addDestination({
      name: form.name,
      location: form.location,
      category: categoryLabel,
      description: form.description,
      facilities: filteredFacilities.length > 0 ? filteredFacilities : ["General"],
      userId: user?.id || "",
      submittedBy: user?.name || "Anonymous",
      image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=300&fit=crop",
    });
    toast.success("Spot suggested successfully! It will be reviewed by the community.");
    setForm({
      name: "",
      location: "",
      category: "",
      description: "",
      facilities: [""],
      photos: [],
      guideName: "",
      guideContact: "",
    });
    setSubmitted(true);
  };

  if (isPending) {
    return <AuthLoader fullScreen />;
  }

  if (!session) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-(--card) border border-(--border) rounded-2xl p-10 max-w-md mx-auto">
          <FiLogIn className="text-5xl text-(--muted-foreground) mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-(--foreground) mb-2">Sign in Required</h2>
          <p className="text-(--muted-foreground) text-sm mb-6">
            You need to be signed in to suggest a tourist spot.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <FiLogIn />
            Sign In
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
            Share a place you love with the community. Like contributing to Google Maps, your suggestion helps fellow travelers discover amazing spots.
          </p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {submitted ? (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center bg-(--card) border border-(--border) rounded-2xl p-10">
            <MdTravelExplore className="text-5xl text-(--primary) mx-auto mb-4" />
            <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <FiClock className="text-sm" />
              Pending Review
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-(--muted-foreground) mb-6">
              Your spot suggestion has been submitted and is now pending review by our moderators. It will be visible to the public once verified.
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
          <motion.form
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="bg-(--card) border border-(--border) rounded-2xl p-6 md:p-8 space-y-6"
          >
            <p className="text-sm text-(--muted-foreground)">
              Fill in the details about the tourist spot you want to share. All fields marked with * are required.
            </p>

            {/* Spot Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Spot Name *
              </label>
              <div className="relative">
                <MdTravelExplore className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Eiffel Tower, Grand Canyon"
                  className="w-full bg-(--background) border border-(--border) rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Location *
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g., Paris, France"
                  className="w-full bg-(--background) border border-(--border) rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Category *
              </label>
              <div className="relative">
                <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-lg z-10" />
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                placeholder="Describe the spot, what makes it special, what visitors can expect..."
                className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20 resize-none"
                required
              />
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
                      onChange={(e) => updateFacility(index, e.target.value)}
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
                <FiPlus className="text-xs" />
                Add Facility
              </button>
            </div>

            {/* Tour Guide Info (Optional) */}
            <div className="border-t border-(--border) pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Tour Guide Information (Optional)
              </h3>
              <p className="text-xs text-(--muted-foreground) mb-3">
                If you know a local tour guide for this spot, you can add their details here.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Guide Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm" />
                    <input
                      type="text"
                      value={form.guideName}
                      onChange={(e) => setForm((p) => ({ ...p, guideName: e.target.value }))}
                      placeholder="Guide's name"
                      className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Contact / Website
                  </label>
                  <div className="relative">
                    <FiCamera className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm" />
                    <input
                      type="text"
                      value={form.guideContact}
                      onChange={(e) => setForm((p) => ({ ...p, guideContact: e.target.value }))}
                      placeholder="Email, phone, or website"
                      className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-(--primary) hover:bg-(--primary-hover) text-white font-semibold rounded-xl h-12 text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <FiSend className="text-sm" />
              Submit Suggestion
            </button>

            <p className="text-xs text-(--muted-foreground) text-center">
              By submitting, you agree that the information will be publicly visible
              and can be edited by the community.
            </p>
          </motion.form>
        )}
      </div>
    </div>
  );
}
