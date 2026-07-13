"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/src/Components/Animations";
import { FiUsers, FiMapPin, FiClock, FiShield, FiTrendingUp, FiEye } from "react-icons/fi";

const statsCards = [
  { label: "Total Users", value: 2458, icon: FiUsers, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Total Destinations", value: 847, icon: FiMapPin, color: "text-teal-500", bg: "bg-teal-500/10" },
  { label: "Pending Reviews", value: 36, icon: FiClock, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Moderators", value: 12, icon: FiShield, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const recentUsers = [
  { name: "Alice Johnson", email: "alice@example.com", role: "User", joined: "2 hours ago", avatar: "AJ" },
  { name: "Bob Smith", email: "bob@example.com", role: "Moderator", joined: "5 hours ago", avatar: "BS" },
  { name: "Charlie Brown", email: "charlie@example.com", role: "User", joined: "1 day ago", avatar: "CB" },
  { name: "Diana Ross", email: "diana@example.com", role: "User", joined: "2 days ago", avatar: "DR" },
  { name: "Eve Adams", email: "eve@example.com", role: "Moderator", joined: "3 days ago", avatar: "EA" },
];

const pendingDestinations = [
  { name: "Santorini Sunset Point", location: "Santorini, Greece", category: "Beach", submittedBy: "Alice J." },
  { name: "Machu Picchu", location: "Cusco, Peru", category: "Historical", submittedBy: "Bob S." },
  { name: "Northern Lights Viewing Deck", location: "Tromsø, Norway", category: "Nature", submittedBy: "Charlie B." },
];

export default function AdminDashboardHome() {
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
                  <div className="w-8 h-8 rounded-full bg-(--primary)/10 text-(--primary) text-xs font-bold flex items-center justify-center">
                    {user.avatar}
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
          </div>
          <div className="mt-3 pt-3 border-t border-(--border)">
            <div className="flex items-center justify-between text-xs text-(--muted-foreground)">
              <span className="flex items-center gap-1">
                <FiTrendingUp className="text-(--success)" />
                12% increase this week
              </span>
              <span>{pendingDestinations.length} pending</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
