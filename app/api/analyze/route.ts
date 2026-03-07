import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { image, isUrl } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are VibeVision, an AI assistant helping blind and low-vision users understand images and internet culture. Analyze this image and provide THREE distinct sections:

1. LITERAL DESCRIPTION
Describe what you see in the image objectively and accurately. Include:
- Objects, people, settings
- Colors, composition, visual details
- Text if present
- Overall scene description

2. VIBE EXPLANATION
Explain the emotional tone, cultural context, and meaning:
- Why might this image be funny, touching, or meaningful?
- What cultural references or memes does it relate to?
- What emotion or atmosphere does it convey?
- If it's a meme, explain the joke or internet trend
- What makes it shareable or popular?

3. GEN-Z VIBE SUMMARY
Summarize the vibe in 2-3 sentences using casual, modern internet language:
- Be authentic and conversational
- Capture the essence and energy
- Use contemporary slang naturally (but keep it accessible)
- Make it relatable and fun

Format your response EXACTLY like this:
LITERAL: [Your literal description here]

VIBE: [Your vibe explanation here]

GENZ: [Your Gen-Z summary here]`;

    let result;

    if (isUrl) {
      // Handle URL-based image
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: image,
          },
        },
      ]);
    } else {
      // Handle base64 image
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: image,
          },
        },
      ]);
    }

    const response = result.response;
    const text = response.text();

    // Parse the response
    const literalMatch = text.match(/LITERAL:\s*([\s\S]*?)(?=\n\nVIBE:|$)/i);
    const vibeMatch = text.match(/VIBE:\s*([\s\S]*?)(?=\n\nGENZ:|$)/i);
    const genZMatch = text.match(/GENZ:\s*([\s\S]*?)$/i);

    const literalDescription = literalMatch
      ? literalMatch[1].trim()
      : "Unable to generate literal description";
    const vibeExplanation = vibeMatch
      ? vibeMatch[1].trim()
      : "Unable to generate vibe explanation";
    const genZSummary = genZMatch
      ? genZMatch[1].trim()
      : "Unable to generate Gen-Z summary";

    return NextResponse.json({
      literalDescription,
      vibeExplanation,
      genZSummary,
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to analyze image",
      },
      { status: 500 }
    );
  }
}
