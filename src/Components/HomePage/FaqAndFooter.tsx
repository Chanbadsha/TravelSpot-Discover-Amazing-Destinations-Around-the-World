"use client";

import { FiHelpCircle, FiChevronRight } from "react-icons/fi";
import {
  MdTravelExplore,
  MdOutlineFlight,
  MdOutlineHotel,
  MdOutlineRestaurant,
} from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/src/Components/Animations";
import { Accordion, Button } from "@heroui/react";

const faqs = [
  {
    id: 1,
    question: "How do I book a trip?",
    answer:
      "Simply use the search bar on our homepage to find your desired destination, select your dates, and browse available packages. Once you find the perfect trip, follow the checkout process to secure your booking.",
  },
  {
    id: 2,
    question: "Can I modify or cancel my booking?",
    answer:
      "Yes, you can modify or cancel your booking up to 48 hours before departure. Some restrictions may apply depending on the package and provider. Visit your account dashboard or contact our support team for assistance.",
  },
  {
    id: 3,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. All payments are processed securely through encrypted connections.",
  },
  {
    id: 4,
    question: "Is travel insurance included?",
    answer:
      "Travel insurance is not automatically included, but we strongly recommend it. You can add comprehensive coverage during the checkout process for as little as $25 per trip.",
  },
  {
    id: 5,
    question: "How do I contact support during my trip?",
    answer:
      "Our support team is available 24/7 via live chat, email at support@travelspot.com, or phone at +1 (555) 123-4567. We also have an emergency hotline for urgent situations.",
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
            <Button className="bg-[var(--primary)] text-white px-8 rounded-xl" size="lg">
              Contact Support
            </Button>
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
                Your gateway to unforgettable adventures. We curate exceptional
                travel experiences that go beyond the ordinary, connecting you
                with the worlds most amazing destinations.
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
                <MdOutlineFlight className="text-base" /> Airlines Partner
              </span>
              <span className="flex items-center gap-1 text-xs">
                <MdOutlineHotel className="text-base" /> Hotel Network
              </span>
              <span className="flex items-center gap-1 text-xs">
                <MdOutlineRestaurant className="text-base" /> Dining Curated
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
