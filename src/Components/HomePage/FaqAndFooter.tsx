"use client";

import Link from "next/link";
import { FiHelpCircle, FiChevronRight, FiStar, FiGlobe } from "react-icons/fi";
import { MdTravelExplore } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/src/Components/Animations";
import { Accordion } from "@heroui/react";

const faqs = [
  {
    id: 1,
    question: "What is TravelSpot?",
    answer:
      "TravelSpot is a free, open community platform where travelers can discover, rate, and share famous tourist spots and their facilities. It's not a booking agency - just a place for travel inspiration and information.",
  },
  {
    id: 2,
    question: "How can I add a tourist spot?",
    answer:
      "Anyone can contribute! Simply create an account and use the 'Suggest a Spot' page to submit a new tourist spot with details, photos, and facilities. Your submission will be visible to the community after review.",
  },
  {
    id: 3,
    question: "Can I rate and review spots?",
    answer:
      "Yes! Every user can rate spots and leave reviews. Your ratings and comments help other travelers discover the best places to visit. You can also upvote helpful reviews from other community members.",
  },
  {
    id: 4,
    question: "Is there any booking or payment system?",
    answer:
      "No. TravelSpot is completely free and does not handle any bookings, payments, or reservations. We're purely an informational platform where travelers share their knowledge about tourist spots around the world.",
  },
  {
    id: 5,
    question: "How do I find tour guides?",
    answer:
      "You can view tour guide profiles on each spot's details page. These are informational profiles shared by the community - not booking services. Contact details may be provided by the guides themselves.",
  },
];

const footerLinks = [
  {
    title: "Destinations",
    links: ["Europe", "Asia", "North America", "South America", "Africa", "Australia"],
  },
  {
    title: "Support",
    links: ["Contact Us", "FAQs", "Cancellation Policy", "Travel Insurance", "Feedback"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Blog", "Partners"],
  },
];

const popularTags = [
  "Beach",
  "Adventure",
  "Luxury",
  "Budget",
  "Family",
  "Solo",
  "Honeymoon",
  "Wildlife",
];

const FaqAndFooter = () => {
  return (
    <section>
      {/* FAQ Section */}
      <div className="py-16 md:py-24 bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FiHelpCircle className="text-[var(--primary)] text-2xl" />
              <span className="text-[var(--primary)] font-semibold text-sm tracking-widest uppercase">
                FAQs
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
              Everything you need to know before your next adventure
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Accordion>
              {faqs.map((faq) => (
                <Accordion.Item key={faq.id}>
                  <Accordion.Heading>
                    <Accordion.Trigger className="flex w-full items-center justify-between px-5 py-4 text-left text-sm md:text-base font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                      {faq.question}
                      <Accordion.Indicator className="text-[var(--muted-foreground)] shrink-0 ml-4" />
                    </Accordion.Trigger>
                  </Accordion.Heading>
                  <Accordion.Panel>
                    <Accordion.Body className="px-5 pb-4">
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </Accordion.Body>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mt-8">
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              Still have questions?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-[var(--primary)] text-white px-8 rounded-xl h-11 text-sm font-semibold"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Column */}
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <MdTravelExplore className="text-[var(--primary)] text-2xl" />
                <span className="text-xl font-bold text-white">TravelSpot</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
                An open community platform for discovering and sharing famous
                tourist spots around the world. No bookings, no agency — just
                real travel inspiration from real people.
              </p>
              <div className="flex gap-3">
                {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[var(--primary)] flex items-center justify-center transition-colors"
                  >
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Link Columns */}
            {footerLinks.map((group) => (
              <motion.div variants={fadeUp} key={group.title}>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                      >
                        <FiChevronRight className="text-xs shrink-0" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Popular Tags */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10 pt-8 border-t border-gray-800">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Popular Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <a
                  key={tag}
                  href="#"
                  className="px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-[var(--primary)] text-gray-300 hover:text-white rounded-full transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Partners / Trust Badges */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10 pt-8 border-t border-gray-800">
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500">
              <span className="flex items-center gap-1 text-xs">
                <MdTravelExplore className="text-base" /> Community Driven
              </span>
              <span className="flex items-center gap-1 text-xs">
                <FiStar className="text-base" /> User Rated
              </span>
              <span className="flex items-center gap-1 text-xs">
                <FiGlobe className="text-base" /> Open & Free
              </span>
            </div>
          </motion.div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} TravelSpot. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default FaqAndFooter;
