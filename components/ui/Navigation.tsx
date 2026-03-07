"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Navigation() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 bg-black/40 backdrop-blur-md"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-xl group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2"
            aria-label="VibeVision Home"
          >
            <Image
              src="/icons/favicon-32x32.png"
              alt=""
              width={28}
              height={28}
              className="group-hover:scale-110 transition-transform"
              aria-hidden="true"
            />
            <span className="group-hover:text-blue-300 transition-colors">VibeVision</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/analyze"
              className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Analyze
            </Link>
            <Link
              href="/voice"
              className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Discuss
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
