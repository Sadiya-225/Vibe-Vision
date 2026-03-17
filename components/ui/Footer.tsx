"use client";

import Link from "next/link";
import { Eye, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-12 sm:mt-16 md:mt-20 border-t border-white/10 glass" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" aria-hidden="true" />
              <span className="text-white font-bold text-lg sm:text-xl">VibeVision</span>
            </div>
            <p className="text-white/70 text-sm sm:text-sm">
              AI-Powered Accessibility for Understanding Internet Culture.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h3 className="text-white font-semibold text-sm sm:text-base">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-white/70 hover:text-white transition-colors text-sm sm:text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analyze"
                    className="text-white/70 hover:text-white transition-colors text-sm sm:text-sm"
                  >
                    Analyze Image
                  </Link>
                </li>
                <li>
                  <Link
                    href="/voice"
                    className="text-white/70 hover:text-white transition-colors text-sm sm:text-sm"
                  >
                    Voice Assistant
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Info */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left sm:col-span-2 md:col-span-1">
            <h3 className="text-white font-semibold text-sm sm:text-base">Built With</h3>
            <ul className="text-white/70 text-sm sm:text-sm space-y-1.5 sm:space-y-2" role="list">
              <li>Next.js & TypeScript</li>
              <li>Google Gemini Vision AI</li>
              <li>Vapi AI Voice Assistant</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-white/60 text-sm sm:text-sm text-center sm:text-left">
            Built for PS 04 - AI for Ability
          </p>
          <p className="text-white/60 text-sm sm:text-sm flex items-center gap-1.5 sm:gap-2">
            Made with <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" aria-label="love" /> for Accessibility
          </p>
        </div>
      </div>
    </footer>
  );
}
