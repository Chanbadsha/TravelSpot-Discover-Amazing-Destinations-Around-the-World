/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/Components/Animations";
import {
  FiMail,
  FiCalendar,
  FiMapPin,
  FiCamera,
  FiGlobe,
  FiTwitter,
  FiLinkedin,
  FiSave,
  FiEdit2,
  FiX,
  FiUsers,
  FiShield,
  FiLoader,
} from "react-icons/fi";
import { MdTravelExplore } from "react-icons/md";
import {
  useSession,
  updateUser as updateUserAuth,
} from "@/src/lib/auth-client";
import { getUserById } from "@/src/services/usersService";
import { updateUser as updateUserApi } from "@/src/services/usersCommandService";
import { getUsers } from "@/src/services/usersService";
import { getDestinations } from "@/src/services/destinationsService";
import toast from "react-hot-toast";
import GlobalLoader from "@/src/Components/UI/GlobalLoader";
import Image from "next/image";

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data?.data?.url) throw new Error("Upload failed");
  return data.data.url;
}

interface UserData {
  name: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
}

export default function AdminProfile() {
  const { data: session } = useSession();
  const user = session?.user;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    destinations: 0,
    moderators: 0,
  });

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      getUserById(user.id).catch(() => null),
      getUsers().catch(() => []),
      getDestinations().catch(() => []),
    ])
      .then(([userData, allUsers, allDestinations]) => {
        if (
          userData &&
          typeof userData === "object" &&
          "data" in (userData as Record<string, unknown>)
        ) {
          setProfileData(
            (userData as Record<string, unknown>).data as UserData,
          );
        }
        const rawUsers = Array.isArray(allUsers)
          ? allUsers
          : (((allUsers as Record<string, unknown>)?.data || []) as Record<
              string,
              unknown
            >[]);
        const rawDestinations = Array.isArray(allDestinations)
          ? allDestinations
          : (((allDestinations as Record<string, unknown>)?.data ||
              []) as Record<string, unknown>[]);
        setStats({
          users: rawUsers.length,
          destinations: rawDestinations.length,
          moderators: rawUsers.filter(
            (u) => String(u.role || "").toLowerCase() === "moderator",
          ).length,
        });
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location:
      ((user as Record<string, unknown>)?.location as string) ||
      "New York, USA",
    bio: ((user as Record<string, unknown>)?.bio as string) || "",
    website: ((user as Record<string, unknown>)?.website as string) || "",
    twitter: ((user as Record<string, unknown>)?.twitter as string) || "",
    linkedin: ((user as Record<string, unknown>)?.linkedin as string) || "",
  });

  useEffect(() => {
    if (profileData) {
      setForm((p) => ({
        ...p,
        name: profileData.name || p.name,
        email: profileData.email || p.email,
        bio: profileData.bio || p.bio,
        location: profileData.location || p.location,
        website: profileData.website || p.website,
        twitter: profileData.twitter || p.twitter,
        linkedin: profileData.linkedin || p.linkedin,
      }));
    }
  }, [profileData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      await updateUserAuth({ image: url } as Parameters<
        typeof updateUserAuth
      >[0]);
      toast.success("Profile photo updated");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "JD";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    try {
      await updateUserAuth({ name: form.name } as Parameters<
        typeof updateUserAuth
      >[0]);
      await updateUserApi({
        id: user.id,
        bio: form.bio,
        location: form.location,
        website: form.website,
        twitter: form.twitter,
        linkedin: form.linkedin,
      });
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Jan 2026";

  const statItems = [
    { label: "Total Users", value: stats.users, icon: FiUsers },
    { label: "Destinations", value: stats.destinations, icon: MdTravelExplore },
    { label: "Moderators", value: stats.moderators, icon: FiShield },
  ];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
        <FiLoader className="text-2xl text-(--muted-foreground) animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-(--card) border border-(--border) rounded-2xl p-6 sm:p-8 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {user?.image ? (
                <Image
                  height={600}
                  width={600}
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            {uploading ? (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <GlobalLoader variant="spinner" size="sm" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-(--primary) text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <FiCamera className="text-xs" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div className="flex-1 text-center sm:text-left w-full">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-(--muted-foreground) mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full bg-(--background) border border-(--border) rounded-xl px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-(--muted-foreground) mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      readOnly
                      className="w-full bg-(--background) border border-(--border) rounded-xl px-3 py-2 text-sm text-(--muted-foreground) outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-(--muted-foreground) mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, location: e.target.value }))
                      }
                      className="w-full bg-(--background) border border-(--border) rounded-xl px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-(--muted-foreground) mb-1">
                    Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, bio: e.target.value }))
                    }
                    rows={2}
                    className="w-full bg-(--background) border border-(--border) rounded-xl px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20 resize-none"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-(--muted-foreground) mb-1">
                      Website
                    </label>
                    <input
                      type="text"
                      value={form.website}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, website: e.target.value }))
                      }
                      className="w-full bg-(--background) border border-(--border) rounded-xl px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-(--muted-foreground) mb-1">
                      Twitter
                    </label>
                    <input
                      type="text"
                      value={form.twitter}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, twitter: e.target.value }))
                      }
                      className="w-full bg-(--background) border border-(--border) rounded-xl px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-(--muted-foreground) mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={form.linkedin}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, linkedin: e.target.value }))
                      }
                      className="w-full bg-(--background) border border-(--border) rounded-xl px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <GlobalLoader variant="spinner" size="sm" /> Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="text-sm" /> Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-(--muted-foreground) hover:text-(--foreground) border border-(--border) hover:bg-(--background) transition-colors cursor-pointer"
                  >
                    <FiX className="text-sm" /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-(--foreground)">
                  {user?.name || "Admin"}
                </h1>
                <p className="text-(--muted-foreground) text-sm mt-0.5">
                  Administrator
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-(--muted-foreground)">
                  <span className="flex items-center gap-1.5">
                    <FiMail className="text-(--primary)" /> {user?.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="text-(--primary)" /> Joined{" "}
                    {joinedDate}
                  </span>
                  {form.location && (
                    <span className="flex items-center gap-1.5">
                      <FiMapPin className="text-(--primary)" /> {form.location}
                    </span>
                  )}
                </div>
                {form.bio && (
                  <p className="text-sm text-(--foreground) mt-3 max-w-lg">
                    {form.bio}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-(--muted-foreground)">
                  {form.website && (
                    <span className="flex items-center gap-1">
                      <FiGlobe /> {form.website}
                    </span>
                  )}
                  {form.twitter && (
                    <span className="flex items-center gap-1">
                      <FiTwitter /> {form.twitter}
                    </span>
                  )}
                  {form.linkedin && (
                    <span className="flex items-center gap-1">
                      <FiLinkedin /> {form.linkedin}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 mt-4 bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <FiEdit2 className="text-sm" />
                  Update Profile
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Admin Stats */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        {statItems.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="bg-(--card) border border-(--border) rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-(--primary)/10 flex items-center justify-center shrink-0">
                <Icon className="text-lg text-(--primary)" />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--foreground)">
                  {stat.value}
                </p>
                <p className="text-xs text-(--muted-foreground)">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
