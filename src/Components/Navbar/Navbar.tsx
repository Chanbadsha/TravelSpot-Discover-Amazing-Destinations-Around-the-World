"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { MdTravelExplore } from "react-icons/md";
import { FiMenu, FiX, FiSun, FiMoon, FiUser } from "react-icons/fi";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore-destinations", label: "Destinations" },
  { href: "/deals", label: "Deals" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950 shadow-sm border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <MdTravelExplore className="text-2xl text-teal-400" />
            <span className="text-lg font-bold text-white">
              TravelSpot
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-teal-400 bg-teal-400/10"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <FiSun className="text-lg" />
              ) : (
                <FiMoon className="text-lg" />
              )}
            </button>

            {/* Auth Links */}
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 rounded-lg text-sm font-medium h-9 transition-colors cursor-pointer text-gray-400 hover:text-white"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 rounded-lg text-sm font-medium h-9 transition-colors cursor-pointer bg-teal-600 text-white hover:bg-teal-500"
            >
              <FiUser className="text-sm" />
              <span>Sign In</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
      />
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-gray-950 shadow-2xl transition-transform duration-300 md:hidden z-60 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-800">
          <span className="font-bold text-white">Menu</span>
          <button
            type="button"
            onClick={closeMobile}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>
        <ul className="px-3 py-4 space-y-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={closeMobile}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-teal-400 bg-teal-400/10"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-5 pt-4 border-t border-gray-800 space-y-2">
          <Link
            href="/login"
            onClick={closeMobile}
            className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white rounded-xl py-3 text-sm font-semibold transition-colors hover:bg-teal-500"
          >
            <FiUser className="text-sm" />
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={closeMobile}
            className="flex items-center justify-center gap-2 w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-xl py-3 text-sm font-semibold transition-colors hover:bg-gray-700"
          >
            Create Account
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
