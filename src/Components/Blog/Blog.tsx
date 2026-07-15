"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiChevronRight,
  FiChevronLeft,
  FiArrowRight,
} from "react-icons/fi";
import { MdTravelExplore, MdMenuBook } from "react-icons/md";
import { fadeUp, scaleIn, stagger } from "@/src/Components/Animations";
import { Button, Card } from "@heroui/react";
import Image from "next/image";

const blogCategories = [
  { key: "all", label: "All Posts" },
  { key: "destinations", label: "Destinations" },
  { key: "tips", label: "Travel Tips" },
  { key: "culture", label: "Culture" },
  { key: "food", label: "Food & Drink" },
  { key: "adventure", label: "Adventure" },
];

interface Author {
  name: string;
  avatar: string;
  role: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: Author;
  date: string;
  readTime: string;
  featured: boolean;
}

const posts: BlogPost[] = [
  {
    id: 1,
    title: "Exploring the Hidden Temples of Angkor: A Complete Guide",
    excerpt:
      "Discover the ancient wonders of Angkor Wat and surrounding temple complexes. From sunrise photography tips to the best off-the-beaten-path ruins, this guide covers everything you need for an unforgettable visit.",
    image:
      "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=500&fit=crop",
    category: "destinations",
    author: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/80?u=sarah",
      role: "Senior Travel Writer",
    },
    date: "Jul 8, 2026",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: 2,
    title: "10 Budget-Friendly Destinations for Your Next Solo Trip",
    excerpt:
      "Traveling solo doesn't have to break the bank. We've rounded up ten incredible destinations where your money goes further without sacrificing experience.",
    image:
      "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&h=500&fit=crop",
    category: "tips",
    author: {
      name: "Marcus Johnson",
      avatar: "https://i.pravatar.cc/80?u=marcus",
      role: "Budget Travel Expert",
    },
    date: "Jul 5, 2026",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 3,
    title: "A Culinary Journey Through the Streets of Bangkok",
    excerpt:
      "From sizzling pad thai to fragrant mango sticky rice, follow us through Bangkok's vibrant street food scene and discover dishes you can't miss.",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=500&fit=crop",
    category: "food",
    author: {
      name: "Elena Rodriguez",
      avatar: "https://i.pravatar.cc/80?u=elena",
      role: "Food & Culture Editor",
    },
    date: "Jul 2, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 4,
    title:
      "Trekking the Inca Trail: What to Expect on the Journey to Machu Picchu",
    excerpt:
      "Prepare for the adventure of a lifetime. Our detailed guide covers training tips, packing essentials, and what each day on the trail looks like.",
    image:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=500&fit=crop",
    category: "adventure",
    author: {
      name: "Alex Thompson",
      avatar: "https://i.pravatar.cc/80?u=alex",
      role: "Adventure Correspondent",
    },
    date: "Jun 28, 2026",
    readTime: "10 min read",
    featured: false,
  },
  {
    id: 5,
    title: "The Art of Slow Travel: Why Less Really Is More",
    excerpt:
      "In a world obsessed with bucket lists, slow travel offers a deeper, more meaningful way to explore. Here's how to embrace the journey, not just the destinations.",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=500&fit=crop",
    category: "tips",
    author: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/80?u=sarah",
      role: "Senior Travel Writer",
    },
    date: "Jun 24, 2026",
    readTime: "5 min read",
    featured: false,
  },
  {
    id: 6,
    title: "Celebrating Diwali in India: A Festival of Lights Guide",
    excerpt:
      "Experience the magic of Diwali like a local. From the best cities to visit to traditional customs and sweets, immerse yourself in India's brightest festival.",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&h=500&fit=crop",
    category: "culture",
    author: {
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/80?u=priya",
      role: "Culture & Heritage Writer",
    },
    date: "Jun 20, 2026",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 7,
    title: "Japan by Rail: The Ultimate Shinkansen Travel Guide",
    excerpt:
      "Hop aboard the legendary bullet train and explore Japan efficiently. Routes, passes, and insider tips for the ultimate rail adventure through the Land of the Rising Sun.",
    image:
      "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=800&h=500&fit=crop",
    category: "destinations",
    author: {
      name: "Marcus Johnson",
      avatar: "https://i.pravatar.cc/80?u=marcus",
      role: "Budget Travel Expert",
    },
    date: "Jun 16, 2026",
    readTime: "9 min read",
    featured: false,
  },
  {
    id: 8,
    title: "Wine Tasting in Tuscany: A Guide to the Region's Best Vineyards",
    excerpt:
      "Raise a glass to the rolling hills of Tuscany. We've toured the region's finest vineyards to bring you the ultimate wine lover's itinerary.",
    image:
      "https://images.unsplash.com/photo-1548579142-7f9cb7e2eff6?w=800&h=500&fit=crop",
    category: "food",
    author: {
      name: "Elena Rodriguez",
      avatar: "https://i.pravatar.cc/80?u=elena",
      role: "Food & Culture Editor",
    },
    date: "Jun 12, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 9,
    title: "Conquering Kilimanjaro: A First-Hander Account",
    excerpt:
      "Standing atop Africa's highest peak is a life-changing experience. Read our climber's diary of the six-day trek to Uhuru Peak.",
    image:
      "https://images.unsplash.com/photo-1517457215517-018c95fa139f?w=800&h=500&fit=crop",
    category: "adventure",
    author: {
      name: "Alex Thompson",
      avatar: "https://i.pravatar.cc/80?u=alex",
      role: "Adventure Correspondent",
    },
    date: "Jun 8, 2026",
    readTime: "11 min read",
    featured: false,
  },
];

const sidebarCategories = [
  { name: "Destinations", count: 24 },
  { name: "Travel Tips", count: 18 },
  { name: "Culture", count: 15 },
  { name: "Food & Drink", count: 12 },
  { name: "Adventure", count: 20 },
  { name: "Lifestyle", count: 9 },
];

const recentPosts = posts.slice(0, 4).map((p) => ({
  id: p.id,
  title: p.title,
  image: p.image,
  date: p.date,
}));

const popularTags = [
  "Travel",
  "Europe",
  "Asia",
  "Solo Travel",
  "Budget Travel",
  "Luxury",
  "Beach",
  "Hiking",
  "Foodie",
  "Photography",
  "Backpacking",
  "Culture",
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const matchesSearch = (post: BlogPost) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.author.name.toLowerCase().includes(q)
    );
  };

  const filtered = posts
    .filter((p) => !p.featured)
    .filter(
      (p) =>
        (activeCategory === "all" || p.category === activeCategory) &&
        matchesSearch(p),
    );

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / postsPerPage);

  const featuredPost =
    activeCategory === "all" && !searchQuery.trim()
      ? posts.find((p) => p.featured)
      : null;

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <MdMenuBook className="text-[var(--accent)] text-2xl" />
            <span className="text-[var(--accent)] font-semibold text-sm tracking-widest uppercase">
              Our Blog
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Travel Stories & Guides
          </h1>
          <p className="text-white/70 max-w-lg mx-auto mb-8">
            Inspiration, tips, and stories from travelers around the world
          </p>

          <div className="max-w-xl mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search articles..."
              className="w-full bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 rounded-xl pl-12 pr-5 py-3.5 outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 py-12 md:py-16">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Category Tabs */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2 mb-8"
            >
              {blogCategories.map((cat) => (
                <motion.div key={cat.key} variants={scaleIn}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.key);
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      activeCategory === cat.key
                        ? "bg-[var(--primary)] text-white shadow-md"
                        : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                </motion.div>
              ))}
            </motion.div>

            {/* Results Count */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-sm text-[var(--muted-foreground)] mb-6"
            >
              {filtered.length + (featuredPost ? 1 : 0)} article
              {filtered.length + (featuredPost ? 1 : 0) !== 1 ? "s" : ""}
              {activeCategory !== "all" &&
                ` in ${blogCategories.find((c) => c.key === activeCategory)?.label}`}
            </motion.p>

            {/* Featured Post */}
            {featuredPost && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mb-10"
              >
                <div className="relative rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] group cursor-pointer">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-full min-h-[280px] overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `url(${featuredPost.image})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--primary)] font-semibold">
                        {featuredPost.category}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mt-1 mb-3 leading-tight">
                        {featuredPost.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] line-clamp-3 mb-4">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-3 mt-auto">
                        <Image
                          height={600}
                          width={600}
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            {featuredPost.author.name}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                            <span className="flex items-center gap-1">
                              <FiCalendar className="text-[10px]" />
                              {featuredPost.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock className="text-[10px]" />
                              {featuredPost.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Blog Grid */}
            {currentPosts.length > 0 ? (
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 gap-6"
              >
                {currentPosts.map((post) => (
                  <motion.div key={post.id} variants={fadeUp}>
                    <Card className="overflow-hidden group border border-[var(--border)] rounded-2xl bg-[var(--card)] cursor-pointer h-full">
                      <div className="relative h-48 overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url(${post.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-[var(--primary)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-[var(--foreground)] leading-snug mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3">
                          <Image
                            height={600}
                            width={600}
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--foreground)] truncate">
                              {post.author.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                              <span>{post.date}</span>
                              <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)]" />
                              <span className="flex items-center gap-1">
                                <FiClock className="text-[10px]" />
                                {post.readTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-center py-16"
              >
                <MdTravelExplore className="text-5xl text-[var(--muted-foreground)]/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                  No articles found
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Try a different category or check back later for new posts
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-center gap-2 mt-10"
              >
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FiChevronLeft className="text-sm" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-[var(--primary)] text-white shadow-md"
                          : "border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      }`}
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
                  className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FiChevronRight className="text-sm" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            {/* Categories */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
                Categories
              </h3>
              <div className="space-y-1">
                {sidebarCategories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => {
                      const found = blogCategories.find((c) =>
                        c.label.toLowerCase().includes(cat.name.toLowerCase()),
                      );
                      if (found) {
                        setActiveCategory(found.key);
                        setCurrentPage(1);
                      }
                    }}
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FiChevronRight className="text-xs" />
                      {cat.name}
                    </span>
                    <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] font-medium px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Recent Posts */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
                Recent Posts
              </h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex gap-3 group cursor-pointer"
                  >
                    <div
                      className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url(${post.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors leading-snug">
                        {post.title}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        {post.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Popular Tags */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs font-medium bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] rounded-full transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&h=400&fit=crop')] bg-cover bg-center opacity-10" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MdMenuBook className="text-[var(--accent)] text-2xl" />
            <span className="text-[var(--accent)] font-semibold text-sm tracking-widest uppercase">
              Stay Updated
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Never Miss a Story
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">
            Join our newsletter and get the latest travel stories, tips, and
            exclusive deals delivered straight to your inbox
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <Button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold px-7 rounded-xl transition-colors cursor-pointer shrink-0">
              Subscribe
              <FiArrowRight className="ml-1.5" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
