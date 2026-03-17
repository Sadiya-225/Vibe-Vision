import Link from "next/link";
import { Eye, Sparkles, Brain, Mic } from "lucide-react";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <GradientBackground />
      <FloatingParticles />
      <Navigation />

      <main id="main-content" className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/80 text-sm mb-4">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>AI-Powered Accessibility</span>
              </div>

              <h1
                id="hero-heading"
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight"
              >
                See the Internet{" "}
                <span className="bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Differently
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto">
                AI that Explains the Vibe Behind Images, Memes, and Visual Culture.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center pt-8 px-4 sm:px-0">
                <Link href="/analyze" className="block">
                  <Button variant="primary" size="lg" icon={<Eye className="w-5 h-5" />} className="w-full justify-center">
                    Analyze an Image
                  </Button>
                </Link>
                <Link href="/voice" className="block">
                  <Button variant="secondary" size="lg" icon={<Mic className="w-5 h-5" />} className="w-full justify-center">
                    Discuss with Voice
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="relative px-4 py-20 sm:px-6 lg:px-8"
          aria-labelledby="features-heading"
        >
          <div className="max-w-7xl mx-auto">
            <h2
              id="features-heading"
              className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
            >
              Powered by AI, Built for Everyone
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassCard
                hover
                glow="blue"
                delay={0}
                role="article"
                ariaLabel="Literal Vision feature"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-blue-500/20 glow-blue">
                    <Eye className="w-8 h-8 text-blue-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Literal Vision</h3>
                  <p className="text-white/70">
                    Accurate AI Description of Images with Precise Object Detection and Scene
                    Understanding.
                  </p>
                </div>
              </GlassCard>

              <GlassCard
                hover
                glow="purple"
                delay={0.1}
                role="article"
                ariaLabel="Cultural Context feature"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-purple-500/20 glow-purple">
                    <Brain className="w-8 h-8 text-purple-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Cultural Context</h3>
                  <p className="text-white/70">
                    Understand Memes, Internet Humor, and the Cultural Meaning Behind Viral
                    Content.
                  </p>
                </div>
              </GlassCard>

              <GlassCard
                hover
                glow="primary"
                delay={0.2}
                role="article"
                ariaLabel="Voice Companion feature"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-indigo-500/20 glow-primary">
                    <Mic className="w-8 h-8 text-indigo-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Voice Companion</h3>
                  <p className="text-white/70">
                    Ask Questions About Images Using Voice and Get Instant Conversational
                    Explanations.
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto">
            <GlassCard glow="blue" className="text-center space-y-6">
              <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold text-white">
                Ready to Understand the Internet?
              </h2>
              <p className="text-xl text-white/80">
                Upload an Image or Meme and Discover the Vibe Behind It.
              </p>
              <div className="flex justify-center">
                <Link href="/analyze">
                  <Button variant="primary" size="lg" icon={<Sparkles className="w-5 h-5" />}>
                    Get Started
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
