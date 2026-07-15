"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/src/Components/Animations";
import { FiUsers, FiMapPin, FiClock, FiShield, FiTrendingUp, FiEye } from "react-icons/fi";
import { getUsers } from "@/src/services/usersService";
import { getDestinations } from "@/src/services/destinationsService";
import GlobalLoader from "@/src/Components/UI/GlobalLoader";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(dateStr: string) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toISOString().split("T")[0];
}

function normalizeResponse(res: unknown): Record<string, unknown>[] {
  if (Array.isArray(res)) return res;
  if (
    res &&
    typeof res === "object" &&
    "data" in (res as Record<string, unknown>) &&
    Array.isArray((res as Record<string, unknown>).data)
  ) {
    return (res as Record<string, unknown>).data as Record<string, unknown>[];
  }
  return [];
}

export default function AdminDashboardHome() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [moderatorCount, setModeratorCount] = useState(0);
  const [totalDestinations, setTotalDestinations] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<{ name: string; email: string; role: string; joined: string; avatar: string; image?: string | null }[]>([]);
  const [pendingDestinations, setPendingDestinations] = useState<{ name: string; location: string; category: string; submittedBy: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [usersRes, destsRes] = await Promise.all([getUsers(), getDestinations()]);
        if (!mounted) return;

        // Users
        const userList = normalizeResponse(usersRes);
        setTotalUsers(userList.length);
        setModeratorCount(userList.filter((u) => String(u.role || "").toLowerCase() === "moderator").length);
        const sorted = [...userList].sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
        const recent = sorted.slice(0, 5).map((item) => {
          const name = (item.name as string) || "Unknown";
          const image = item.image as string | null | undefined;
          return {
            name,
            email: (item.email as string) || "",
            role: String(item.role || "user").charAt(0).toUpperCase() + String(item.role || "user").slice(1),
            joined: timeAgo(item.createdAt as string),
            avatar: image || getInitials(name),
            image,
          };
        });
        setRecentUsers(recent);

        // Destinations
        const destList = normalizeResponse(destsRes);
        setTotalDestinations(destList.length);
        const pending = destList.filter((d) => String(d.status || "").toLowerCase() === "pending");
        setPendingCount(pending.length);
        const recentPending = pending.slice(0, 3).map((item) => {
          const creatorObj = item.creator as Record<string, unknown> | null | undefined;
          const creatorName = creatorObj?.name as string | undefined;
          const location = [item.city, item.country].filter(Boolean).join(", ") || (item.location as string) || "";
          return {
            name: (item.name as string) || "",
            location,
            category: (item.category as string) || "",
            submittedBy: creatorName || (item.submittedBy as string) || "Unknown",
          };
        });
        setPendingDestinations(recentPending);
      } catch {
        if (!mounted) return;
        setTotalUsers(0);
        setModeratorCount(0);
        setTotalDestinations(0);
        setPendingCount(0);
        setRecentUsers([]);
        setPendingDestinations([]);
      }
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <GlobalLoader variant="pulse" size="md" />
      </div>
    );
  }

  const statsCards = [
    { label: "Total Users", value: totalUsers, icon: FiUsers, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Destinations", value: totalDestinations, icon: FiMapPin, color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "Pending Reviews", value: pendingCount, icon: FiClock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Moderators", value: moderatorCount, icon: FiShield, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-(--foreground)">Dashboard</h1>
        <p className="text-(--muted-foreground) text-sm mt-1">
          Welcome back, Admin. Here&apos;s what&apos;s happening with TravelSpot.
        </p>
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
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`text-xl ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-(--foreground)">{card.value.toLocaleString()}</p>
                <p className="text-xs text-(--muted-foreground)">{card.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-(--card) border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-(--foreground) flex items-center gap-2">
              <FiUsers className="text-(--primary)" />
              Recent Users
            </h2>
            <span className="text-xs text-(--muted-foreground)">Newest members</span>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.email} className="flex items-center justify-between py-2 border-b border-(--border) last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-(--primary)/10 text-(--primary) text-xs font-bold flex items-center justify-center overflow-hidden shrink-0">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.avatar
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-(--foreground)">{user.name}</p>
                    <p className="text-xs text-(--muted-foreground)">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    user.role === "Moderator"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  }`}>
                    {user.role}
                  </span>
                  <p className="text-[10px] text-(--muted-foreground) mt-1">{user.joined}</p>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-sm text-(--muted-foreground) text-center py-4">No users yet</p>
            )}
          </div>
        </motion.div>

        {/* Pending Destinations */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-(--card) border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-(--foreground) flex items-center gap-2">
              <FiClock className="text-amber-500" />
              Pending Reviews
            </h2>
            <span className="text-xs text-(--muted-foreground)">Awaiting approval</span>
          </div>
          <div className="space-y-3">
            {pendingDestinations.map((dest) => (
              <div key={dest.name} className="flex items-start gap-3 py-3 border-b border-(--border) last:border-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  <FiEye />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-(--foreground) truncate">{dest.name}</p>
                  <p className="text-xs text-(--muted-foreground)">{dest.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-(--border) text-(--muted-foreground) px-1.5 py-0.5 rounded">{dest.category}</span>
                    <span className="text-[10px] text-(--muted-foreground)">by {dest.submittedBy}</span>
                  </div>
                </div>
              </div>
            ))}
            {pendingDestinations.length === 0 && (
              <p className="text-sm text-(--muted-foreground) text-center py-4">No pending destinations</p>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-(--border)">
            <div className="flex items-center justify-between text-xs text-(--muted-foreground)">
              <span className="flex items-center gap-1">
                <FiTrendingUp className="text-(--success)" />
                Awaiting review
              </span>
              <span>{pendingCount} pending</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
