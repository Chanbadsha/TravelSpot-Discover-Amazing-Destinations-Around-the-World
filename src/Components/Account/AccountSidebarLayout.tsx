"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MdTravelExplore } from "react-icons/md";
import {
  FiGrid,
  FiUser,
  FiMapPin,
  FiMenu,
  FiX,
  FiChevronLeft,
} from "react-icons/fi";
import { useSession } from "@/src/lib/auth-client";
import Image from "next/image";

interface NavLink {
  href: string;
  label: string;
  icon: typeof FiGrid;
}

export default function AccountSidebarLayout({
  children,
  navLinks,
}: {
  children: ReactNode;
  navLinks: NavLink[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "JD";

  return (
    <div className="h-screen container mx-auto flex bg-(--background)">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:min-h-screen shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-800 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <MdTravelExplore className="text-2xl text-teal-400 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg font-bold text-white">TravelSpot</span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="px-5 py-6 border-b border-gray-800">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-white text-xl font-bold flex items-center justify-center mb-3 shadow-lg shadow-teal-500/20 overflow-hidden">
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
            <p className="text-white text-sm font-semibold">
              {user?.name || "John Doe"}
            </p>
            <p className="text-gray-500 text-xs">
              {user?.email || "john@example.com"}
            </p>
          </motion.div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Menu
          </p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/user" && pathname.startsWith(link.href + "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "text-teal-400 bg-teal-400/10"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="accountActiveTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-teal-400 to-emerald-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={`text-lg shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? "text-teal-400" : ""}`}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 group"
          >
            <FiChevronLeft className="text-lg shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Site
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center h-16 px-4 bg-(--card) border-b border-(--border) shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--border) transition-colors cursor-pointer -ml-1"
          >
            <FiMenu className="text-lg" />
          </button>
        </header>
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
