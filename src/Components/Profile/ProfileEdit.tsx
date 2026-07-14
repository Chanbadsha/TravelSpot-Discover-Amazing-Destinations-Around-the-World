"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/Components/Animations";
import { FiUser, FiMail, FiMapPin, FiCamera, FiSave, FiGlobe, FiLinkedin, FiTwitter } from "react-icons/fi";
import toast from "react-hot-toast";
import GlobalLoader from "@/src/Components/UI/GlobalLoader";

export default function ProfileEdit() {
  const [form, setForm] = useState({
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    location: "New York, USA",
    bio: "Travel enthusiast and photography lover. Exploring the world one destination at a time.",
    website: "https://johndoe.com",
    twitter: "@johndoe",
    linkedin: "linkedin.com/in/johndoe",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--foreground)">Edit Profile</h1>
        <p className="text-(--muted-foreground) text-sm mt-1">Update your personal information and public profile.</p>
      </motion.div>

      <motion.form variants={fadeUp} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-(--foreground) mb-4">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              <button
                type="button"
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <FiCamera className="text-white text-lg" />
              </button>
            </div>
            <div>
              <p className="text-sm text-(--foreground) font-medium">Upload a new photo</p>
              <p className="text-xs text-(--muted-foreground) mt-0.5">JPG, PNG or GIF. 5MB max.</p>
              <button
                type="button"
                className="mt-2 text-xs font-medium text-(--primary) hover:text-(--primary-hover) transition-colors cursor-pointer"
              >
                Upload Photo
              </button>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-(--foreground)">Basic Information</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--foreground) mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-(--foreground) mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm">@</span>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-full bg-(--background) border border-(--border) rounded-xl pl-8 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--foreground) mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-(--foreground) mb-1.5">Location</label>
              <div className="relative">
                <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--foreground) mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={3}
              className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20 resize-none"
            />
            <p className="text-xs text-(--muted-foreground) mt-1">Write a short bio about yourself. Max 200 characters.</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-(--foreground)">Social Links</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--foreground) mb-1.5">Website</label>
              <div className="relative">
                <FiGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm" />
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://yoursite.com"
                  className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-(--foreground) mb-1.5">Twitter</label>
              <div className="relative">
                <FiTwitter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm" />
                <input
                  type="text"
                  value={form.twitter}
                  onChange={(e) => handleChange("twitter", e.target.value)}
                  placeholder="@username"
                  className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--foreground) mb-1.5">LinkedIn</label>
            <div className="relative">
              <FiLinkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm" />
              <input
                type="text"
                value={form.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                placeholder="linkedin.com/in/username"
                className="w-full bg-(--background) border border-(--border) rounded-xl pl-10 pr-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => toast.success("Changes discarded")}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-(--muted-foreground) hover:text-(--foreground) border border-(--border) hover:bg-(--background) transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <GlobalLoader variant="spinner" size="sm" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="text-sm" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
