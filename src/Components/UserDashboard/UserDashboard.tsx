/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { fadeUp, stagger } from "@/src/Components/Animations";
import { useSession } from "@/src/lib/auth-client";
import { formatDate } from "@/src/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiClock, FiMapPin, FiPlus, FiStar, FiTrendingUp } from "react-icons/fi";

type SpotStatus = "pending" | "verified" | "cancelled";

export interface Post {
  _id: string;
  name: string;
  location: string;
  coverImage: string;
  status: SpotStatus;
  createdAt: string;
}

export default function UserDashboard({ initialPosts = [] }: { initialPosts?: Post[] }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [posts] = useState<Post[]>(initialPosts);

  const statsCards = [
    {
      label: "Total Posts",
      value: posts.length,
      icon: FiMapPin,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
    {
      label: "Pending Review",
      value: posts.filter((p) => p.status === "pending").length,
      icon: FiClock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Verified",
      value: posts.filter((p) => p.status === "verified").length,
      icon: FiStar,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Destinations",
      value: 847,
      icon: FiTrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const recentPosts = posts.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-8 flex items-center gap-4"
      >
        {user?.image && (
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-(--border)">
            <Image
              height={600}
              width={600}
              src={user.image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-(--muted-foreground) text-sm mt-1">
            Here&apos;s an overview of your activity on TravelSpot.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={fadeUp}
              className="bg-(--card) border border-(--border) rounded-2xl p-5 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`text-xl ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-xs text-(--muted-foreground)">
                  {card.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-(--card) border border-(--border) rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <FiMapPin className="text-(--primary)" />
              Your Recent Posts
            </h2>
            <Link
              href="/user/posts"
              className="text-xs font-medium text-(--primary) hover:text-(--primary-hover) transition-colors"
            >
              View all
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="text-center py-8">
              <FiMapPin className="text-3xl text-(--muted-foreground) mx-auto mb-2" />
              <p className="text-sm text-(--muted-foreground) mb-3">
                No posts yet
              </p>
              <Link
                href="/suggest-spot"
                className="inline-flex items-center gap-1.5 bg-(--primary) hover:bg-(--primary-hover) text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                <FiPlus /> Suggest a Spot
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post._id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-background transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-800">
                    <Image
                      height={600}
                      width={600}
                      src={post.coverImage}
                      alt={post.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {post.name}
                    </p>
                    <p className="text-xs text-(--muted-foreground)">
                      {post.location}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      post.status === "verified"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : post.status === "pending"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-(--card) border border-(--border) rounded-2xl p-5"
        >
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <FiStar className="text-(--accent)" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/suggest-spot"
              className="flex items-center gap-4 p-3 rounded-xl bg-background border border-(--border) hover:border-(--primary) transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-(--primary)/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FiPlus className="text-(--primary)" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Suggest a New Spot
                </p>
                <p className="text-xs text-(--muted-foreground)">
                  Share a destination with the community
                </p>
              </div>
            </Link>
            <Link
              href="/user/posts"
              className="flex items-center gap-4 p-3 rounded-xl bg-background border border-(--border) hover:border-(--primary) transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-(--secondary)/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FiMapPin className="text-(--secondary)" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Manage My Posts
                </p>
                <p className="text-xs text-(--muted-foreground)">
                  Edit or delete your submissions
                </p>
              </div>
            </Link>
            <Link
              href="/user/profile"
              className="flex items-center gap-4 p-3 rounded-xl bg-background border border-(--border) hover:border-(--primary) transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-(--accent)/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FiStar className="text-(--accent)" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  View Profile
                </p>
                <p className="text-xs text-(--muted-foreground)">
                  See your full profile information
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-6 bg-(--card) border border-(--border) rounded-2xl p-5"
      >
        <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <FiClock className="text-(--muted-foreground)" />
          Recent Activity
        </h2>
        {posts.length === 0 ? (
          <p className="text-sm text-(--muted-foreground) text-center py-6">
            No activity yet. Start by suggesting a spot!
          </p>
        ) : (
          <div className="space-y-0">
            {posts.slice(0, 5).map((post, idx) => (
              <div
                key={post._id}
                className="flex items-start gap-3 py-3 border-b border-(--border) last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-(--primary) mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    You submitted{" "}
                    <span className="font-medium">{post.name}</span>
                  </p>
                  <p className="text-xs text-(--muted-foreground)">
                    {formatDate(post.createdAt)} &middot; {post.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
