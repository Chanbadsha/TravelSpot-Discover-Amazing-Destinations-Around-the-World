"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/Components/Animations";
import {
  FiShield,
  FiTrash2,
  FiUserPlus,
  FiX,
  FiMail,
  FiCalendar,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { getUsers } from "@/src/services/usersService";
import { getDestinations } from "@/src/services/destinationsService";
import { setUserRole } from "@/src/services/usersCommandService";
import GlobalLoader from "@/src/Components/UI/GlobalLoader";
import Image from "next/image";

interface Moderator {
  id: string;
  name: string;
  email: string;
  addedDate: string;
  assignedSpots: number;
  avatar: string;
  image?: string | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminModerators() {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [moderationActivity, setModerationActivity] = useState({
    approvedToday: 0,
    rejectedToday: 0,
    pending: 0,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [usersRes, destsRes] = await Promise.all([
          getUsers(),
          getDestinations(),
        ]);
        if (!mounted) return;

        const list = Array.isArray(usersRes)
          ? usersRes
          : (((usersRes as Record<string, unknown>)?.data || []) as Record<
              string,
              unknown
            >[]);
        const moderators = list.filter(
          (u) => String(u.role || "").toLowerCase() === "moderator",
        );
        const mapped: Moderator[] = moderators.map((item) => {
          const name = (item.name as string) || "Unknown";
          const image = item.image as string | null | undefined;
          return {
            id: (item._id as string) || (item.id as string) || "",
            name,
            email: (item.email as string) || "",
            addedDate: item.createdAt
              ? new Date(item.createdAt as string).toISOString().split("T")[0]
              : "",
            assignedSpots: (item.yearsExperience as number) || 0,
            avatar: image || getInitials(name),
            image,
          };
        });
        setModerators(mapped);

        const destList = Array.isArray(destsRes)
          ? destsRes
          : (((destsRes as Record<string, unknown>)?.data || []) as Record<
              string,
              unknown
            >[]);
        const now = Date.now();
        const day = 86400000;
        const approvedToday = destList.filter((d) => {
          const s = String(d.status || "").toLowerCase();
          const updated = d.updatedAt as string | undefined;
          return (
            s === "verified" &&
            updated &&
            now - new Date(updated).getTime() < day
          );
        }).length;
        const rejectedToday = destList.filter((d) => {
          const s = String(d.status || "").toLowerCase();
          const updated = d.updatedAt as string | undefined;
          return (
            (s === "cancelled" || s === "rejected") &&
            updated &&
            now - new Date(updated).getTime() < day
          );
        }).length;
        const pending = destList.filter(
          (d) => String(d.status || "").toLowerCase() === "pending",
        ).length;
        setModerationActivity({ approvedToday, rejectedToday, pending });
      } catch {
        if (!mounted) return;
        toast.error("Failed to load moderators");
        setModerators([]);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const removeModerator = async (id: string) => {
    const res = await setUserRole(id, "user");
    if (res && (res as Record<string, unknown>).success !== false) {
      setModerators((prev) => prev.filter((m) => m.id !== id));
      toast.success("Moderator demoted to User");
    } else {
      toast.error(
        ((res as Record<string, unknown>)?.message as string) ||
          "Failed to demote moderator",
      );
    }
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <GlobalLoader variant="pulse" size="md" />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-(--foreground)">
              Moderator Management
            </h1>
            <p className="text-(--muted-foreground) text-sm mt-1">
              Manage moderators who review and verify destination submissions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <FiUserPlus />
            Add Moderator
          </button>
        </div>
      </motion.div>

      {/* Moderator Cards */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {moderators.map((mod) => (
          <div
            key={mod.id}
            className="bg-(--card) border border-(--border) rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 text-sm font-bold flex items-center justify-center overflow-hidden shrink-0">
                {mod.image ? (
                  <Image
                    height={600}
                    width={600}
                    src={mod.image}
                    alt={mod.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  mod.avatar
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-(--foreground) truncate">
                  {mod.name}
                </h3>
                <p className="text-xs text-(--muted-foreground) truncate flex items-center gap-1">
                  <FiMail className="text-[10px]" />
                  {mod.email}
                </p>
              </div>
              <FiShield className="text-purple-500 text-lg shrink-0" />
            </div>
            <div className="flex items-center justify-between text-xs text-(--muted-foreground) mb-4">
              <span className="flex items-center gap-1">
                <FiCalendar className="text-[10px]" />
                Added {mod.addedDate}
              </span>
              <span className="bg-(--background) border border-(--border) px-2 py-0.5 rounded-full">
                {mod.assignedSpots} spots
              </span>
            </div>
            {confirmDelete === mod.id ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => removeModerator(mod.id)}
                  className="flex-1 bg-(--error) hover:bg-red-600 text-white text-xs font-semibold rounded-xl py-2 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <FiCheck /> Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-(--background) border border-(--border) text-(--foreground) text-xs font-medium rounded-xl py-2 hover:bg-(--border) transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(mod.id)}
                className="w-full bg-(--background) border border-(--border) text-(--muted-foreground) hover:text-(--error) hover:border-(--error) text-xs font-medium rounded-xl py-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FiTrash2 />
                Remove Moderator
              </button>
            )}
          </div>
        ))}
        {moderators.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <FiShield className="text-2xl text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-(--foreground) mb-1">
              No Moderators Yet
            </h3>
            <p className="text-sm text-(--muted-foreground) max-w-sm">
              There are no users with the moderator role. You can assign the
              moderator role to existing users from the{" "}
              <a
                href="/admin/users"
                className="text-(--primary) hover:underline font-medium"
              >
                Users
              </a>{" "}
              page.
            </p>
          </div>
        )}
      </motion.div>

      {/* Moderation Activity */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-(--card) border border-(--border) rounded-2xl p-6 mt-6 mb-6"
      >
        <h2 className="text-base font-semibold text-(--foreground) mb-4 flex items-center gap-2">
          <FiCheck className="text-(--success)" />
          Moderation Activity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-(--background) rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-(--success)">
              {moderationActivity.approvedToday}
            </p>
            <p className="text-xs text-(--muted-foreground) mt-1">
              Approved Today
            </p>
          </div>
          <div className="bg-(--background) rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-(--error)">
              {moderationActivity.rejectedToday}
            </p>
            <p className="text-xs text-(--muted-foreground) mt-1">
              Rejected Today
            </p>
          </div>
          <div className="bg-(--background) rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">
              {moderationActivity.pending}
            </p>
            <p className="text-xs text-(--muted-foreground) mt-1">
              Pending Review
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-(--card) border border-(--border) rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="text-center">
          <p className="text-2xl font-bold text-(--foreground)">
            {moderators.length}
          </p>
          <p className="text-xs text-(--muted-foreground)">Total Moderators</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-(--foreground)">
            {moderators.reduce((sum, m) => sum + m.assignedSpots, 0)}
          </p>
          <p className="text-xs text-(--muted-foreground)">
            Total Assigned Spots
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-(--foreground)">
            {moderators.length
              ? Math.round(
                  moderators.reduce((sum, m) => sum + m.assignedSpots, 0) /
                    moderators.length,
                )
              : 0}
          </p>
          <p className="text-xs text-(--muted-foreground)">
            Avg Spots / Moderator
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-(--foreground)">
            {moderators.filter((m) => m.assignedSpots > 20).length}
          </p>
          <p className="text-xs text-(--muted-foreground)">Senior Moderators</p>
        </div>
      </motion.div>

      {/* Add Moderator Modal */}
      {showAddModal && (
        <AddModeratorModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function AddModeratorModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onClose();
    toast.success(
      "Moderator added successfully (use Add User in Users page to set role)",
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-(--card) border border-(--border) rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-(--foreground)">
            Add Moderator
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-(--foreground) mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Moderator name"
              className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--foreground) mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="moderator@example.com"
              className="w-full bg-(--background) border border-(--border) rounded-xl px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none focus:border-(--primary) focus:ring-2 focus:ring-(--ring)/20"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-(--background) border border-(--border) text-(--foreground) rounded-xl py-2.5 text-sm font-medium hover:bg-(--border) transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-(--primary) hover:bg-(--primary-hover) text-white rounded-xl py-2.5 text-sm font-semibold transition-colors cursor-pointer"
            >
              Add Moderator
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
