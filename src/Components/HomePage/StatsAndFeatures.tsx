"use client";

import { FiGlobe, FiUsers, FiAward, FiHeart } from "react-icons/fi";
import { MdTravelExplore, MdSecurity } from "react-icons/md";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/src/Components/Animations";
import { Card } from "@heroui/react";
import CountUp from "react-countup";

const stats = [
  { value: 500, suffix: "+", label: "Destinations", icon: FiGlobe },
  { value: 12000, suffix: "+", label: "Happy Travelers", icon: FiUsers },
  { value: 15, suffix: " Years", label: "Experience", icon: FiAward },
  { value: 98, suffix: "%", label: "Satisfaction", icon: FiHeart },
];

const features = [
  {
    icon: MdTravelExplore,
    title: "Community-Driven Spots",
    description:
      "Every tourist spot is shared by real travelers. Discover hidden gems and popular destinations through authentic community contributions.",
  },
  {
    icon: MdSecurity,
    title: "Verified Information",
    description:
      "Facilities, ratings, and reviews are crowdsourced and checked by the community to ensure you get reliable and up-to-date information.",
  },
  {
    icon: FiUsers,
    title: "Share Your Experience",
    description:
      "Rate spots, leave reviews, share photos, and help fellow travelers discover the best places to visit around the world.",
  },
  {
    icon: FiGlobe,
    title: "Explore Freely",
    description:
      "No bookings, no prices, no agency. Just pure travel inspiration and helpful information from people who love to explore.",
  },
];

const StatsAndFeatures = () => {
  return (
    <section>
      {/* Stats Bar */}
      <div className="bg-[var(--primary)] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div variants={fadeUp}
                  key={stat.label}
                  className="text-center text-white"
                >
                  <Icon className="text-3xl mx-auto mb-3 opacity-80" />
                  <div className="text-3xl md:text-4xl font-bold mb-1">
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      separator=","
                      enableScrollSpy
                      scrollSpyDelay={200}
                    />
                    {stat.suffix}
                  </div>
                  <div className="text-white/80 text-sm font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-24 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[var(--primary)] font-semibold text-sm tracking-widest uppercase">
              Why TravelSpot
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mt-3 mb-3">
              Discover Spots, Not Bookings
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
              A free community platform where travelers share their favorite places
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={fadeUp}>
                <Card
                  className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--card)]"
                >
                  <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                    <Icon className="text-xl text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsAndFeatures;
