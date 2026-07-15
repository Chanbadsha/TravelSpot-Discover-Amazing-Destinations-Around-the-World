"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiGrid, FiLogOut, FiChevronDown } from "react-icons/fi";
import { authClient } from "@/src/lib/auth-client";
import toast from "react-hot-toast";
import GlobalLoader from "@/src/Components/UI/GlobalLoader";
import Image from "next/image";

interface AvatarDropdownProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  };
}

export default function AvatarDropdown({ user }: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    toast.success("Signed out");
    setOpen(false);
    setSigningOut(false);
    router.push("/");
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold flex items-center justify-center">
          {user.image ? (
            <Image
              height={600}
              width={600}
              src={user.image}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <FiChevronDown
          className={`text-gray-400 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-gray-800">
              <p className="text-sm font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="p-1.5">
              <Link
                href={`${user.role === "admin" ? "/admin" : "/user"}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <FiGrid className="text-base" />
                Dashboard
              </Link>
            </div>

            <div className="border-t border-gray-800 p-1.5">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-(--error) hover:bg-(--error)/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                {signingOut ? (
                  <>
                    <GlobalLoader variant="spinner" size="sm" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <FiLogOut className="text-base" />
                    Sign Out
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
