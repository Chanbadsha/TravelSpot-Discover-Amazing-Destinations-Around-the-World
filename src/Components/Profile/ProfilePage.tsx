/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { fadeUp, stagger } from "@/src/Components/Animations";
import GlobalLoader from "@/src/Components/UI/GlobalLoader";
import {
  updateUser as updateUserAuth,
  useSession,
} from "@/src/lib/auth-client";
import { useDestinations } from "@/src/lib/DestinationContext";
import { getPostsByCreatorId } from "@/src/services/postsService";
import { updateUser as updateUserApi } from "@/src/services/usersCommandService";
import { getUserById } from "@/src/services/usersService";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FiBookmark,
  FiCalendar,
  FiCamera,
  FiCheckCircle,
  FiEdit2,
  FiGlobe,
  FiHeart,
  FiLinkedin,
  FiLoader,
  FiMail,
  FiMapPin,
  FiSave,
  FiStar,
  FiTwitter,
  FiX,
} from "react-icons/fi";

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
  tag?: string;
  yearsExperience?: number;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const { getSavedCounts, getUserSavedDestinationsWithData } =
    useDestinations();
  const savedCounts = user
    ? getSavedCounts(user.id)
    : { total: 0, visited: 0, wantToVisit: 0 };
  const savedWithData = user ? getUserSavedDestinationsWithData(user.id) : [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [myPosts, setMyPosts] = useState<
    { id: string; name: string; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      getUserById(user.id).catch(() => null),
      getPostsByCreatorId(user.id).catch(() => []),
    ])
      .then(([userData, posts]) => {
        if (
          userData &&
          typeof userData === "object" &&
          "data" in (userData as Record<string, unknown>)
        ) {
          setProfileData(
            (userData as Record<string, unknown>).data as UserData,
          );
        }
        if (Array.isArray(posts)) {
          setMyPosts(
            posts.map((p: Record<string, unknown>) => ({
              id: (p._id as string) || (p.id as string) || "",
              name: (p.name as string) || "",
              createdAt: (p.createdAt as string) || "",
            })),
          );
        }
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedTab, setSavedTab] = useState<"all" | "wantToVisit" | "visited">(
    "all",
  );
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.name?.toLowerCase().replace(/\s+/g, "") || "",
    email: user?.email || "",
    location: (user as any)?.location || "New York, USA",
    bio: (user as any)?.bio || "",
    website: (user as any)?.website || "",
    twitter: (user as any)?.twitter || "",
    linkedin: (user as any)?.linkedin || "",
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
      setForm((p) => ({ ...p }));
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

  const stats = [
    { label: "Posts Submitted", value: myPosts.length, icon: FiMapPin },
    {
      label: "Want to Visit",
      value: savedCounts.wantToVisit,
      icon: FiBookmark,
    },
    { label: "Visited", value: savedCounts.visited, icon: FiCheckCircle },
  ];

  const savedActivities = savedWithData.slice(0, 3).map((s) => ({
    action:
      s.status === "visited"
        ? `Visited "${s.destination?.name || "a destination"}"`
        : `Saved "${s.destination?.name || "a destination"}" for later`,
    date: s.savedAt,
    type: s.status === "visited" ? ("visited" as const) : ("save" as const),
  }));

  const postActivities = myPosts.slice(0, 3).map((p) => ({
    action: `Submitted "${p.name}"`,
    date: p.createdAt,
    type: "post" as const,
  }));

  const recentActivity = [...savedActivities, ...postActivities].slice(0, 5);

  const filteredSaved = savedWithData.filter((s) => {
    if (savedTab === "all") return true;
    return s.status === savedTab;
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
        <FiLoader className="text-2xl text-(--muted-foreground) animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Profile Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-(--card) border border-(--border) rounded-2xl p-6 sm:p-8 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
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
                      className="w-full bg-background border border-(--border) rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-(--muted-foreground) mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground) text-sm">
                        @
                      </span>
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, username: e.target.value }))
                        }
                        className="w-full bg-background border border-(--border) rounded-xl pl-7 pr-3 py-2 text-sm text-foreground outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-(--muted-foreground) mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      readOnly
                      className="w-full bg-background border border-(--border) rounded-xl px-3 py-2 text-sm text-(--muted-foreground) outline-none cursor-not-allowed"
                    />
                  </div>
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
                      className="w-full bg-background border border-(--border) rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
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
                    className="w-full bg-background border border-(--border) rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20 resize-none"
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
                      className="w-full bg-background border border-(--border) rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
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
                      className="w-full bg-background border border-(--border) rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
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
                      className="w-full bg-background border border-(--border) rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
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
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-(--muted-foreground) hover:text-foreground border border-(--border) hover:bg-background transition-colors cursor-pointer"
                  >
                    <FiX className="text-sm" /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-foreground">
                  {user?.name || "John Doe"}
                </h1>
                <p className="text-(--muted-foreground) text-sm mt-0.5">
                  @{form.username}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-(--muted-foreground)">
                  <span className="flex items-center gap-1.5">
                    <FiMail className="text-(--primary)" />{" "}
                    {user?.email || "john@example.com"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="text-(--primary)" /> Joined{" "}
                    {joinedDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="text-(--primary)" /> {form.location}
                  </span>
                </div>
                <p className="text-sm text-foreground mt-3 max-w-lg">
                  {form.bio}
                </p>
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

      {/* Stats */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        {stats.map((stat) => {
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
                <p className="text-2xl font-bold text-foreground">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-(--card) border border-(--border) rounded-2xl p-5"
        >
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <FiStar className="text-(--accent)" />
            Recent Activity
          </h2>
          <div className="space-y-0">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 py-3 border-b border-(--border) last:border-0"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    activity.type === "post"
                      ? "bg-(--primary)"
                      : "bg-(--secondary)"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.action}</p>
                  <p className="text-xs text-(--muted-foreground)">
                    {activity.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Saved Spots */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-(--card) border border-(--border) rounded-2xl p-5"
        >
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <FiHeart className="text-(--error)" />
            Saved Spots
          </h2>

          <div className="flex items-center gap-1 mb-4 bg-background rounded-xl p-1">
            {(["all", "wantToVisit", "visited"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSavedTab(tab)}
                className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-all cursor-pointer ${
                  savedTab === tab
                    ? "bg-(--primary) text-white shadow-sm"
                    : "text-(--muted-foreground) hover:text-foreground"
                }`}
              >
                {tab === "all"
                  ? "All"
                  : tab === "wantToVisit"
                    ? "Want to Visit"
                    : "Visited"}
              </button>
            ))}
          </div>

          {filteredSaved.length === 0 ? (
            <div className="text-center py-8">
              <FiHeart className="text-2xl text-(--muted-foreground) mx-auto mb-2" />
              <p className="text-xs text-(--muted-foreground)">
                {savedTab === "all"
                  ? "No saved spots yet"
                  : savedTab === "wantToVisit"
                    ? "No spots marked as want to visit"
                    : "No visited spots yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredSaved.map((s) => {
                const dest = s.destination;
                if (!dest) return null;
                return (
                  <div
                    key={s.destinationId}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-background transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-800">
                      <Image
                        height={600}
                        width={600}
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {dest.name}
                      </p>
                      <p className="text-xs text-(--muted-foreground)">
                        {dest.location}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                        s.status === "visited"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {s.status === "visited" ? (
                        <FiCheckCircle />
                      ) : (
                        <FiBookmark />
                      )}
                      {s.status === "visited" ? "Visited" : "Saved"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
