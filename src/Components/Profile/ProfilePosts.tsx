/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/src/Components/Animations";
import {
  FiMapPin,
  FiStar,
  FiClock,
  FiPlus,
  FiLoader,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { formatDate } from "@/src/lib/utils";
import { useSession } from "@/src/lib/auth-client";
import { getPostsByCreatorId } from "@/src/services/postsService";
import { deletePost } from "@/src/services/postsCommandService";
import { Card } from "@heroui/react";
import toast from "react-hot-toast";

type SpotStatus = "pending" | "verified" | "cancelled";

interface Post {
  _id: string;
  name: string;
  country: string;
  city: string;
  location: string;
  category: string;
  bestSeason: string;
  travelTime: string;
  entryFee: string;
  openingHours: string;
  rating: number;
  reviews: number;
  coverImage: string;
  facilities: string[];
  description: string;
  images: string[];
  status: string;
  submittedBy: string;
  creatorId: string;
  nearbyAttractions: string[];
  related: string[];
  verifiedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePosts({ initialPosts = [] }) {
  const { data: session } = useSession();
  const user = session?.user;

  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const handleDelete = async (id: string) => {};

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const paginated = posts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Posts</h1>
            <p className="text-(--muted-foreground) text-sm mt-1">
              Manage your submitted destinations.
            </p>
          </div>
          <Link
            href="/suggest-spot"
            className="inline-flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <FiPlus /> New Post
          </Link>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="text-2xl text-(--muted-foreground) animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center bg-(--card) border border-(--border) rounded-2xl py-16 px-6"
        >
          <FiMapPin className="text-4xl text-(--muted-foreground) mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-foreground mb-1">
            No posts yet
          </h2>
          <p className="text-sm text-(--muted-foreground) mb-5">
            You haven&apos;t submitted any destinations yet.
          </p>
          <Link
            href="/suggest-spot"
            className="inline-flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <FiPlus /> Suggest a Spot
          </Link>
        </motion.div>
      ) : (
        <>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {paginated.map((post: Post) => (
              <motion.div key={post._id} variants={fadeUp}>
                <Card className="overflow-hidden group border border-(--border) rounded-2xl bg-(--card)">
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {post.status === "verified" && (
                        <span className="text-[10px] font-semibold bg-emerald-500/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                          <MdVerified className="text-[10px]" /> Verified
                        </span>
                      )}
                      {post.status === "pending" && (
                        <span className="text-[10px] font-semibold bg-amber-500/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                          <FiClock className="text-[10px]" /> Review
                        </span>
                      )}
                      {post.status === "cancelled" && (
                        <span className="text-[10px] font-semibold bg-red-500/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                          Cancelled
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-white/90 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm capitalize">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-foreground">
                        <FiStar className="text-(--accent) fill-current text-xs" />
                        {post.rating || "New"}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-1.5 mb-1">
                      <FiMapPin className="text-(--primary) mt-0.5 shrink-0 text-sm" />
                      <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                        {post.name}
                      </h3>
                    </div>
                    <p className="text-xs text-(--muted-foreground) line-clamp-2 mb-2">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.facilities.slice(0, 3).map((f, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-(--primary)/10 text-(--primary) px-2 py-0.5 rounded-full"
                        >
                          {f}
                        </span>
                      ))}
                      {post.facilities.length > 3 && (
                        <span className="text-[10px] text-(--muted-foreground)">
                          +{post.facilities.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-(--muted-foreground)">
                        {formatDate(post.createdAt)}
                      </span>
                      <div className="flex items-center gap-1">
                        {confirmDelete === post._id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDelete(post._id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-(--success) hover:bg-(--success)/10 transition-colors cursor-pointer"
                            >
                              <FiCheck className="text-xs" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(null)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-(--border) transition-colors cursor-pointer"
                            >
                              <FiX className="text-xs" />
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/destinations/${post._id}`}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--secondary) hover:bg-(--secondary)/10 transition-colors"
                            >
                              <FiEye className="text-xs" />
                            </Link>
                            <Link
                              href={`/user/posts/${post._id}/edit`}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--primary) hover:bg-(--primary)/10 transition-colors"
                            >
                              <FiEdit2 className="text-xs" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(post._id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--error) hover:bg-(--error)/10 transition-colors cursor-pointer"
                            >
                              <FiTrash2 className="text-xs" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-center gap-2 mt-8 pb-4"
            >
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-foreground hover:bg-(--border) transition-colors disabled:opacity-30 cursor-pointer"
              >
                <FiChevronLeft className="text-sm" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer ${page === currentPage ? "bg-(--primary) text-white" : "bg-(--card) border border-(--border) text-(--muted-foreground) hover:border-(--primary) hover:text-(--primary)"}`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-foreground hover:bg-(--border) transition-colors disabled:opacity-30 cursor-pointer"
              >
                <FiChevronRight className="text-sm" />
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
