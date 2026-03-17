"use client";

import { useState } from "react";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { ImageUpload } from "@/components/features/ImageUpload";
import { AnalysisResults } from "@/components/features/AnalysisResults";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";
import { fileToBase64 } from "@/lib/utils";
import { audioNotifications, AudioMessages } from "@/lib/audioNotifications";
import { stripMarkdownForSpeech } from "@/lib/textUtils";

export default function AnalyzePage() {
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
        // It's a URL
        imageData = selectedImage;
      } else {
        // It's a File
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

      // Strip markdown from all Gemini output before setting state
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
              Analyze an Image
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 px-2">
              Upload an Image or Paste a URL to Understand its Vibe and Cultural Context
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
                    Analyze Image
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
              <AnalysisResults result={result} />

              <div className="flex justify-center px-4 sm:px-0">
                <Button variant="secondary" size="lg" onClick={handleReset} className="w-full sm:w-auto">
                  Analyze Another Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
