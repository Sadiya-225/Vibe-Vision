"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 bg-black/40 backdrop-blur-md"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-white font-bold text-lg sm:text-xl group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-1 sm:px-2"
            aria-label="VibeVision Home"
          >
            <Image
              src="/icons/favicon-32x32.png"
              alt=""
              width={24}
              height={24}
              className="group-hover:scale-110 transition-transform sm:w-7 sm:h-7"
              aria-hidden="true"
            />
            <span className="group-hover:text-blue-300 transition-colors">VibeVision</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-2 md:gap-4">
            <Link
              href="/analyze"
              className="text-white/80 hover:text-white transition-colors px-3 py-2 md:px-4 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            >
              Analyze
            </Link>
            <Link
              href="/voice"
              className="text-white/80 hover:text-white transition-colors px-3 py-2 md:px-4 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            >
              Discuss
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/analyze"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white/80 hover:text-white transition-colors px-4 py-3 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Analyze
              </Link>
              <Link
                href="/voice"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white/80 hover:text-white transition-colors px-4 py-3 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Discuss
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
