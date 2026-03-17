"use client";

import { useState } from "react";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { VoiceAssistant } from "@/components/features/VoiceAssistant";
import { ImageUpload } from "@/components/features/ImageUpload";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowLeft } from "lucide-react";
import { fileToBase64 } from "@/lib/utils";
import { audioNotifications, AudioMessages } from "@/lib/audioNotifications";
import { stripMarkdownForSpeech } from "@/lib/textUtils";

export default function VoicePage() {
  const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    literalDescription: string;
    vibeExplanation: string;
    genZSummary: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (image: File | string | null) => {
    setSelectedImage(image);
    // Audio notification when image is uploaded successfully
    if (image) {
      audioNotifications.speak(AudioMessages.IMAGE_UPLOADED);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    // Audio notification when analysis starts
    audioNotifications.speak(AudioMessages.ANALYZING);

    try {
      let imageData: string;

      if (typeof selectedImage === "string") {
        imageData = selectedImage;
      } else {
        imageData = await fileToBase64(selectedImage);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageData,
          isUrl: typeof selectedImage === "string",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const data = await response.json();

      // Strip markdown from all text for better display and speech
      const sanitizedResult = {
        literalDescription: stripMarkdownForSpeech(data.literalDescription),
        vibeExplanation: stripMarkdownForSpeech(data.vibeExplanation),
        genZSummary: stripMarkdownForSpeech(data.genZSummary),
      };

      setResult(sanitizedResult);

      // Audio notification when analysis completes
      audioNotifications.speak(AudioMessages.ANALYSIS_COMPLETE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <>
      <GradientBackground />
      <FloatingParticles />
      <Navigation />

      <main id="main-content" className="min-h-screen pt-14 sm:pt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 md:py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
              Discuss Images with Voice
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 px-2">
              Upload an Image and Have an Interactive Voice Conversation About It
            </p>
          </div>

          {!result ? (
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <ImageUpload onImageSelect={handleImageSelect} />

              {selectedImage && (
                <div className="flex justify-center px-4 sm:px-0">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAnalyze}
                    isLoading={isAnalyzing}
                    icon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
                    className="w-full sm:w-auto"
                  >
                    Analyze & Discuss
                  </Button>
                </div>
              )}

              {error && (
                <div
                  className="glass-strong border-red-500/50 rounded-lg p-3 sm:p-4 text-red-300 text-center text-sm sm:text-base"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {/* Results Summary Card */}
              <GlassCard glow="blue">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Image Analysis Summary</h2>
                    <Button
                      variant="ghost"
                      onClick={handleReset}
                      icon={<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
                      aria-label="Analyze another image"
                      className="self-start sm:self-auto"
                    >
                      New Image
                    </Button>
                  </div>
                  <div className="space-y-2 sm:space-y-3 text-white/80">
                    <p className="text-sm sm:text-base">
                      <span className="font-semibold text-blue-400">Literal: </span>
                      {result.literalDescription.substring(0, 150)}...
                    </p>
                    <p className="text-sm sm:text-base">
                      <span className="font-semibold text-purple-400">Vibe: </span>
                      {result.vibeExplanation.substring(0, 150)}...
                    </p>
                    <p className="text-sm sm:text-base">
                      <span className="font-semibold text-indigo-400">Gen-Z: </span>
                      {result.genZSummary}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Voice Assistant Section */}
              <GlassCard glow="primary">
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center space-y-1 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      Now Let's Discuss It!
                    </h2>
                  </div>

                  <VoiceAssistant imageContext={result} />
                </div>
              </GlassCard>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
