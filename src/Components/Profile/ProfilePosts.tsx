"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/Components/Animations";
import { FiMapPin, FiEdit2, FiTrash2, FiPlus, FiClock, FiCheck, FiX, FiEye } from "react-icons/fi";
import { useDestinations, type SpotStatus } from "@/src/lib/DestinationContext";
import { formatDate } from "@/src/lib/utils";
import { useSession } from "@/src/lib/auth-client";
import toast from "react-hot-toast";

const statusBadge = (status: SpotStatus) => {
  switch (status) {
    case "verified": return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    case "pending": return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
    case "cancelled": return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
  }
};

export default function ProfilePosts() {
  const { data: session } = useSession();
  const user = session?.user;
  const { getUserDestinations, deleteDestination } = useDestinations();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const myPosts = user ? getUserDestinations(user.id) : [];

  const handleDelete = (id: string) => {
    deleteDestination(id);
    toast.success("Post deleted");
    setConfirmDelete(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-(--foreground)">My Posts</h1>
            <p className="text-(--muted-foreground) text-sm mt-1">
              Manage your submitted destinations.
            </p>
          </div>
          <Link
            href="/suggest-spot"
            className="inline-flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <FiPlus />
            New Post
          </Link>
        </div>
      </motion.div>

      {myPosts.length === 0 ? (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center bg-(--card) border border-(--border) rounded-2xl py-16 px-6">
          <FiMapPin className="text-4xl text-(--muted-foreground) mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-(--foreground) mb-1">No posts yet</h2>
          <p className="text-sm text-(--muted-foreground) mb-5">
            You haven&apos;t submitted any destinations yet.
          </p>
          <Link
            href="/suggest-spot"
            className="inline-flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <FiPlus />
            Suggest a Spot
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
          {myPosts.map((post) => (
            <div key={post.id} className="bg-(--card) border border-(--border) rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-800">
                <img src={post.image} alt={post.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold text-(--foreground) truncate">{post.name}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusBadge(post.status)}`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-xs text-(--muted-foreground)">{post.location}</p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-(--muted-foreground)">
                  <span>{post.category}</span>
                  <span className="flex items-center gap-1">
                    <FiClock className="text-[10px]" />
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/destinations/${post.id}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--secondary) hover:bg-(--secondary)/10 transition-colors"
                >
                  <FiEye className="text-sm" />
                </Link>
                <Link
                  href={`/user/posts/${post.id}/edit`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--primary) hover:bg-(--primary)/10 transition-colors"
                >
                  <FiEdit2 className="text-sm" />
                </Link>
                {confirmDelete === post.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-(--success) hover:bg-(--success)/10 transition-colors cursor-pointer"
                    >
                      <FiCheck className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors cursor-pointer"
                    >
                      <FiX className="text-sm" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(post.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--error) hover:bg-(--error)/10 transition-colors cursor-pointer"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
