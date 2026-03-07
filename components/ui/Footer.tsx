"use client";

import Link from "next/link";
import { Eye, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 glass" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-400" aria-hidden="true" />
              <span className="text-white font-bold text-xl">VibeVision</span>
            </div>
            <p className="text-white/70 text-sm">
              AI-Powered Accessibility for Understanding Internet Culture.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analyze"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    Analyze Image
                  </Link>
                </li>
                <li>
                  <Link
                    href="/voice"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    Voice Assistant
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Built With</h3>
            <ul className="text-white/70 text-sm space-y-2" role="list">
              <li>Next.js & TypeScript</li>
              <li>Google Gemini Vision AI</li>
              <li>Vapi AI Voice Assistant</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            Built for PS 04 - AI for Ability
          </p>
          <p className="text-white/60 text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-400" aria-label="love" /> for Accessibility
          </p>
        </div>
      </div>
    </footer>
  );
}
