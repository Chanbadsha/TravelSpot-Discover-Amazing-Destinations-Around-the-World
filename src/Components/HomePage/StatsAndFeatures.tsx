"use client";

import { FiGlobe, FiUsers, FiAward, FiHeart } from "react-icons/fi";
import {
  MdTravelExplore,
  MdSecurity,
  MdSupportAgent,
  MdFlight,
} from "react-icons/md";
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
    title: "Curated Experiences",
    description:
      "Every trip is handpicked and crafted by travel experts who know the destinations inside out.",
  },
  {
    icon: MdSecurity,
    title: "Safe & Secure",
    description:
      "Your safety is our priority. We partner with verified providers and offer 24/7 support.",
  },
  {
    icon: MdSupportAgent,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock to assist you before and during your trip.",
  },
  {
    icon: MdFlight,
    title: "Best Flight Deals",
    description:
      "We negotiate exclusive rates with airlines to bring you the most competitive prices.",
  },
];

const StatsAndFeatures = () => {
  return (
    <section>
      {/* Stats Bar */}
      <div className="bg-[var(--primary)] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
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
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-24 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[var(--primary)] font-semibold text-sm tracking-widest uppercase">
              Why Travel With Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mt-3 mb-3">
              Everything You Need for the Perfect Trip
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
              We take care of every detail so you can focus on making memories
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsAndFeatures;
