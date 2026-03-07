import { GradientBackground } from "@/components/ui/GradientBackground";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { Eye } from "lucide-react";

export default function Loading() {
  return (
    <>
      <GradientBackground />
      <FloatingParticles />

      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Eye className="w-16 h-16 text-blue-400 animate-pulse" aria-hidden="true" />
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Loading...</h2>
          <p className="text-white/70" role="status" aria-live="polite">
            Preparing Vibe-Vision
          </p>
        </div>
      </div>
    </>
  );
}
