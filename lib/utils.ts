import { clsx, type ClassValue } from "clsx";

/**
 * Utility function to merge className values using clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format text for screen readers - converts to simple sentences
 */
export function formatForScreenReader(text: string): string {
  // Remove markdown formatting
  let formatted = text.replace(/[*_~`#]/g, '');

  // Split into sentences
  const sentences = formatted.split(/[.!?]+/).filter(s => s.trim());

  // Simplify each sentence
  return sentences.map(s => s.trim()).join('. ') + '.';
}

/**
 * Convert file to base64 for API requests
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Validate image file type
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Configure Vapi AI Assistant for VibeVision
 * Creates an assistant optimized for explaining images, memes, and cultural context
 * @param imageContext - Optional context about the analyzed image
 */
export function configureVibeVisionAssistant(imageContext?: {
  literalDescription: string;
  vibeExplanation: string;
  genZSummary: string;
}) {
  let systemPrompt = `You are VibeVision's voice assistant, a friendly and knowledgeable AI designed to help blind and low-vision users understand images, memes, and internet culture.

Your role:
- Explain the vibe, humor, and cultural context of images that users describe or ask about
- Describe both literal content and emotional/cultural meaning
- Help users understand why content is funny, popular, or meaningful
- Provide context about internet trends, memes, and viral content
- Be conversational, friendly, and helpful
- Use clear, descriptive language that paints a picture

Communication style:
- Be warm and engaging, like talking to a friend
- Use vivid descriptions that help users "see" the content
- Break down complex cultural references into simple explanations
- Ask clarifying questions if you need more details about the image
- Keep responses concise but informative
- Avoid jargon - explain internet culture in accessible terms

When a user asks about an image or meme:
1. Ask them to describe what they know about it (text, context, where they found it)
2. Provide a literal description if applicable
3. Explain the vibe, emotion, or humor behind it
4. Give cultural context and why it's popular or meaningful
5. Use modern, relatable language while staying accessible

Keep the conversation flowing naturally.
Make sure your responses are short and conversational, like a real voice chat.
Do not use special characters - this is a voice conversation.
Be empathetic and patient.
Your goal is to make internet culture accessible and enjoyable for everyone.`;

  // If image context is provided, add it to the system prompt
  if (imageContext) {
    systemPrompt += `

---

IMAGE ANALYSIS CONTEXT:

The user has uploaded an image that has been analyzed. Here is what we know about it:

LITERAL DESCRIPTION:
${imageContext.literalDescription}

VIBE EXPLANATION:
${imageContext.vibeExplanation}

GEN-Z SUMMARY:
${imageContext.genZSummary}

---

IMPORTANT INSTRUCTIONS FOR THIS CONVERSATION:
- You are now talking about THIS SPECIFIC IMAGE that the user uploaded
- Reference the analysis above when answering questions
- Help the user understand and explore this image in depth
- Answer questions about specific details, cultural references, or meanings
- If the user asks about something not covered in the analysis, use your knowledge to provide helpful context
- Keep the conversation focused on this image unless the user asks about something else
- Be ready to explain any part of the analysis in more detail or simpler terms if asked`;
  }

  const firstMessage = imageContext
    ? "Hi! I've analyzed your image and I'm ready to talk about it. Feel free to ask me anything - whether you want me to explain a specific detail, the cultural context, why it's funny, or anything else about this image. What would you like to know?"
    : "Hi! I'm your VibeVision voice assistant. I can help you understand images, memes, and internet culture. Just describe an image or meme you're curious about, or ask me anything about visual content you've encountered online. How can I help you today?";

  return {
    name: "VibeVision Assistant",
    firstMessage,
    transcriber: {
      provider: "deepgram" as const,
      model: "nova-2" as const,
      language: "en" as const,
    },
    voice: {
      provider: "11labs" as const,
      voiceId: "sarah" as const, // Friendly, clear voice
      stability: 0.5,
      similarityBoost: 0.75,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
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
}
