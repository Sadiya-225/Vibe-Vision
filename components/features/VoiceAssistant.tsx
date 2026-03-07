"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { configureVibeVisionAssistant } from "@/lib/utils";
import { audioNotifications, AudioMessages } from "@/lib/audioNotifications";
import Lottie from "lottie-react";
import soundwaves from "@/constants/soundwaves.json";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ImageContext {
  literalDescription: string;
  vibeExplanation: string;
  genZSummary: string;
}

interface VoiceAssistantProps {
  imageContext?: ImageContext;
}

export function VoiceAssistant({ imageContext }: VoiceAssistantProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [vapiClient, setVapiClient] = useState<any>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<any>(null);

  const scrollToBottom = () => {
    // Scroll only within the transcript container, not the entire page
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Only scroll if there are messages to avoid initial page scroll
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Control Lottie animation based on speaking state
  useEffect(() => {
    if (lottieRef.current) {
      if (isSpeaking) {
        lottieRef.current.play();
      } else {
        lottieRef.current.stop();
      }
    }
  }, [isSpeaking]);

  useEffect(() => {
    // Dynamically import Vapi client only on the client side
    const initVapi = async () => {
      try {
        const { default: Vapi } = await import("@vapi-ai/web");
        const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

        if (!publicKey) {
          console.error("Vapi public key not configured");
          return;
        }

        const client = new Vapi(publicKey);

        // Set up event listeners
        client.on("call-start", () => {
          setIsConnected(true);
          // Play audio notification when call starts
          audioNotifications.speak(AudioMessages.VOICE_CONNECTED, {
            rate: 1.2,
            volume: 0.6
          });
          // First message will be handled by Vapi via the assistant configuration
        });

        client.on("call-end", () => {
          setIsConnected(false);
          setIsMuted(false);
          setIsSpeaking(false);
          // Play audio notification when call ends
          audioNotifications.speak(AudioMessages.VOICE_ENDED, {
            rate: 1.2,
            volume: 0.6
          });
        });

        client.on("speech-start", () => {
          setIsSpeaking(true);
        });

        client.on("speech-end", () => {
          setIsSpeaking(false);
        });

        client.on("message", (message: any) => {
          if (message.type === "transcript" && message.role === "user") {
            setMessages((prev) => [
              ...prev,
              {
                role: "user",
                content: message.transcript,
                timestamp: new Date(),
              },
            ]);
          } else if (message.type === "transcript" && message.role === "assistant") {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: message.transcript,
                timestamp: new Date(),
              },
            ]);
          }
        });

        client.on("error", (error: any) => {
          console.error("Vapi error:", error);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again.",
              timestamp: new Date(),
            },
          ]);
        });

        setVapiClient(client);
      } catch (error) {
        console.error("Failed to initialize Vapi:", error);
      }
    };

    initVapi();

    return () => {
      if (vapiClient) {
        vapiClient.stop();
      }
    };
  }, []);

  const startCall = async () => {
    if (!vapiClient) {
      console.error("Vapi client not initialized");
      return;
    }

    try {
      // Use inline assistant configuration optimized for VibeVision
      // Pass image context if available
      const assistantConfig = configureVibeVisionAssistant(imageContext);

      await vapiClient.start(assistantConfig);
    } catch (error) {
      console.error("Failed to start call:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to start voice assistant. Please check your API configuration.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const endCall = () => {
    if (vapiClient) {
      vapiClient.stop();
    }
  };

  const toggleMute = () => {
    if (vapiClient) {
      vapiClient.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        {!isConnected ? (
          <Button
            variant="primary"
            size="lg"
            onClick={startCall}
            icon={<Phone className="w-5 h-5" />}
            aria-label="Start voice call"
          >
            Start Voice Call
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={endCall}
              icon={<PhoneOff className="w-5 h-5" />}
              aria-label="End voice call"
            >
              End Call
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={toggleMute}
              icon={isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              {isMuted ? "Unmute" : "Mute"}
            </Button>
          </>
        )}
      </div>

      {/* Soundwave Animation - Below Controls */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center justify-center"
        >
          <div
            className={`transition-opacity duration-300 ${
              isSpeaking ? "opacity-100" : "opacity-30"
            }`}
          >
            <Lottie
              lottieRef={lottieRef}
              animationData={soundwaves}
              autoplay={false}
              loop={true}
              className="h-48 w-48"
            />
          </div>
        </motion.div>
      )}

      {/* Status Indicator */}
      <div className="flex flex-col items-center gap-4">
        {/* Status Badge */}
        <motion.div
          className={`flex items-center gap-2 px-4 py-2 rounded-full glass ${
            isConnected ? "glow-primary" : ""
          }`}
          animate={{
            scale: isConnected ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isConnected ? Infinity : 0,
          }}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-400" : "bg-gray-400"
            }`}
            aria-hidden="true"
          />
          <span className="text-white">
            {isConnected ? (isSpeaking ? "Speaking..." : "Connected") : "Disconnected"}
          </span>
        </motion.div>
      </div>

      {/* Transcript Panel */}
      <GlassCard role="log" ariaLabel="Conversation transcript">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Conversation</h2>

          <div
            ref={transcriptContainerRef}
            className="space-y-4 max-h-96 overflow-y-auto pr-2"
            aria-live="polite"
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-500/30 text-white"
                        : "glass text-white"
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1">
                      {message.role === "user" ? "You" : "Assistant"}
                    </div>
                    <div className="text-sm">{message.content}</div>
                    <div className="text-sm text-white/50 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {messages.length === 0 && (
            <div className="text-center text-white/60 py-8">
              Start a Voice Call to Begin the Conversation
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
