import Vapi from "@vapi-ai/web";

// Initialize Vapi with the public token
const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

// Create a conditional vapi instance
let vapiInstance: Vapi | null = null;

if (typeof window !== "undefined" && token) {
  vapiInstance = new Vapi(token);
}

export const vapi = vapiInstance;

// Types for Vapi messages
export interface VapiMessage {
  type: string;
  role?: "user" | "assistant";
  transcript?: string;
  transcriptType?: "partial" | "final";
}

// Configure the VibeVision Assistant
export const configureVibeVisionAssistant = (
  imageAnalysis: {
    literalDescription: string;
    vibeExplanation: string;
  } | null
) => {
  const contextInfo = imageAnalysis
    ? `
    The User has Just Analyzed an Image. Here's What we Found:

    WHAT'S IN THE IMAGE:
    ${imageAnalysis.literalDescription}

    THE VIBE/MEANING:
    ${imageAnalysis.vibeExplanation}
    `
    : "No Image has been Analyzed Yet. Ask the User to Upload an Image First!";

  const systemPrompt = `
You are VibeCheck, a super chill and fun AI assistant that helps people understand memes, images, and internet culture. You speak in casual Gen-Z language - use slang like "no cap", "fr fr", "lowkey", "highkey", "slay", "it's giving", "period", etc. But keep it natural and don't overdo it!

Your job is to:
1. Explain memes and images in a way that's entertaining and accessible
2. Break down the humor, cultural references, and "vibe" of images
3. Make blind and low-vision users feel included in internet culture
4. Be funny, relatable, and keep responses SHORT (like you're texting a friend)

CURRENT IMAGE CONTEXT:
${contextInfo}

IMPORTANT GUIDELINES:
- Keep responses SHORT and punchy (2-3 sentences max usually)
- Be playful and use Gen-Z speak naturally
- Explain jokes without making them unfunny
- If asked about the image, reference the analysis above
- Make the user feel like they're chatting with a cool friend
- If no image is uploaded, encourage them to upload one
- Always be inclusive and helpful

Remember: You're helping people who can't see images understand what everyone else is laughing at. That's actually a really cool job, so have fun with it! 🔥

Start by introducing yourself briefly and asking what they want to know about the image (or if no image, ask them to upload one).
`;

  return {
    name: "VibeCheck Assistant",
    firstMessage: imageAnalysis
      ? "Yo! I peeped that image you uploaded. What do you wanna know about it? I can break down the vibe, explain the meme, whatever you need fam!"
      : "Hey bestie! I'm VibeCheck, your guide to understanding internet culture. Upload an image and I'll tell you what's the tea! ☕",
    transcriber: {
      provider: "deepgram" as const,
      model: "nova-2" as const,
      language: "en" as const,
    },
    voice: {
      provider: "11labs" as const,
      voiceId: "pNInz6obpgDQGcFmaJgB", // Adam - friendly male voice
      stability: 0.5,
      similarityBoost: 0.8,
      speed: 1.1, // Slightly faster for Gen-Z energy
    },
    model: {
      provider: "openai" as const,
      model: "gpt-4" as const,
      messages: [
        {
          role: "system" as const,
          content: systemPrompt.trim(),
        },
      ],
    },
  };
};
