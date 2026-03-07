import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeVision - See the Internet Differently",
  description: "AI-powered image analysis that explains the vibe, humor, and cultural context behind images and memes for blind and low-vision users.",
  keywords: ["accessibility", "AI", "image analysis", "vibe check", "memes", "blind", "low vision", "assistive technology"],
  authors: [{ name: "VibeVision Team" }],
  openGraph: {
    title: "VibeVision - See the Internet Differently",
    description: "AI that explains the vibe behind images, memes, and visual culture.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
