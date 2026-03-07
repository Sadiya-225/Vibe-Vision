"use client";

import { useState } from "react";
import { Eye, Brain, Sparkles, Volume2, VolumeX, ToggleLeft, ToggleRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatForScreenReader } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnalysisResult {
  literalDescription: string;
  vibeExplanation: string;
  genZSummary: string;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(
        screenReaderMode ? formatForScreenReader(text) : text
      );
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const speakAll = () => {
    const fullText = `
      Literal Description: ${result.literalDescription}

      Vibe Explanation: ${result.vibeExplanation}

      Gen Z Summary: ${result.genZSummary}
    `;
    speak(fullText);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant={isSpeaking ? "primary" : "secondary"}
          onClick={isSpeaking ? stopSpeaking : speakAll}
          icon={isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          aria-label={isSpeaking ? "Stop reading" : "Read all results aloud"}
        >
          {isSpeaking ? "Stop Reading" : "Read Aloud"}
        </Button>

        <button
          onClick={() => setScreenReaderMode(!screenReaderMode)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
            screenReaderMode
              ? "glass-strong text-white glow-blue"
              : "glass text-white/80 hover:text-white"
          }`}
          aria-label={`Screen reader mode ${screenReaderMode ? "enabled" : "disabled"}`}
          aria-pressed={screenReaderMode}
        >
          {screenReaderMode ? (
            <ToggleRight className="w-5 h-5 text-blue-400" aria-hidden="true" />
          ) : (
            <ToggleLeft className="w-5 h-5" aria-hidden="true" />
          )}
          <span>Simplify for Screen Reader</span>
        </button>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* Literal Description */}
        <GlassCard glow="blue" delay={0} role="article" ariaLabel="Literal description of image">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-blue-500/20 glow-blue">
                  <Eye className="w-6 h-6 text-blue-400" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-white">Literal Description</h2>
              </div>
              <button
                onClick={() => speak(result.literalDescription)}
                className="p-2 rounded-full glass hover:glass-strong transition-all"
                aria-label="Read literal description aloud"
              >
                <Volume2 className="w-5 h-5 text-white" aria-hidden="true" />
              </button>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-lg leading-relaxed"
            >
              {screenReaderMode
                ? formatForScreenReader(result.literalDescription)
                : result.literalDescription}
            </motion.p>
          </div>
        </GlassCard>

        {/* Vibe Explanation */}
        <GlassCard glow="purple" delay={0.1} role="article" ariaLabel="Vibe and context explanation">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-purple-500/20 glow-purple">
                  <Brain className="w-6 h-6 text-purple-400" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-white">Vibe Explanation</h2>
              </div>
              <button
                onClick={() => speak(result.vibeExplanation)}
                className="p-2 rounded-full glass hover:glass-strong transition-all"
                aria-label="Read vibe explanation aloud"
              >
                <Volume2 className="w-5 h-5 text-white" aria-hidden="true" />
              </button>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-lg leading-relaxed"
            >
              {screenReaderMode
                ? formatForScreenReader(result.vibeExplanation)
                : result.vibeExplanation}
            </motion.p>
          </div>
        </GlassCard>

        {/* Gen Z Summary */}
        <GlassCard glow="primary" delay={0.2} role="article" ariaLabel="Gen Z style summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-indigo-500/20 glow-primary">
                  <Sparkles className="w-6 h-6 text-indigo-400" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-white">Gen-Z Vibe Summary</h2>
              </div>
              <button
                onClick={() => speak(result.genZSummary)}
                className="p-2 rounded-full glass hover:glass-strong transition-all"
                aria-label="Read Gen Z summary aloud"
              >
                <Volume2 className="w-5 h-5 text-white" aria-hidden="true" />
              </button>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-lg leading-relaxed"
            >
              {screenReaderMode
                ? formatForScreenReader(result.genZSummary)
                : result.genZSummary}
            </motion.p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
