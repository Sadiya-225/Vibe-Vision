import Link from "next/link";
import { Home, Search } from "lucide-react";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export default function NotFound() {
  return (
    <>
      <GradientBackground />
      <FloatingParticles />
      <Navigation />

      <main id="main-content" className="min-h-screen pt-16 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <GlassCard glow="blue" className="text-center space-y-6">
            <div className="text-8xl font-bold text-transparent bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text">
              404
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Page Not Found
            </h1>
            <p className="text-xl text-white/80">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/">
                <Button variant="primary" size="lg" icon={<Home className="w-5 h-5" />}>
                  Go Home
                </Button>
              </Link>
              <Link href="/analyze">
                <Button variant="secondary" size="lg" icon={<Search className="w-5 h-5" />}>
                  Analyze an Image
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </>
  );
}
