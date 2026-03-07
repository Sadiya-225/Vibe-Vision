# VibeVision

**See the Internet Differently**

VibeVision is an AI-powered accessibility tool that helps blind and low-vision users understand the emotional tone, humor, cultural context, and aesthetic of images and memes found on the internet.

## Problem Statement

Most AI image description tools only provide literal descriptions like "a man sitting on a couch." While accurate, they fail to convey:
- Why the image is funny
- Why the meme is popular
- What cultural meaning it carries
- What emotion or vibe the content expresses

This leaves visually impaired users excluded from online social culture.

## Solution

VibeVision provides **four levels of understanding**:

1. **Literal Description** - Accurate AI description of what's in the image
2. **Vibe Explanation** - Cultural context, humor, and emotional meaning
3. **Gen-Z Vibe Summary** - Quick, conversational summary in modern internet language
4. **Interactive Discussion** - Voice conversation to explore the image in depth

## Features

### 🖼️ Image Analysis
- Upload images via file upload or drag & drop
- Paste image URLs for instant analysis
- Powered by Google Gemini Vision AI
- Three-tier analysis: Literal, Vibe, and Gen-Z summary

### 💬 **Image Discussion**
- Discuss uploaded images with a voice assistant
- Assistant has full context of the analyzed image
- Ask follow-up questions about cultural references, humor, or meanings
- Explore memes and visual content interactively
- Perfect for understanding "why this is funny" or "what this means"
- Brings blind users into internet culture conversations

### 🔊 Text-to-Speech
- Browser-based speech synthesis
- Read entire analysis or individual sections
- Screen reader mode for simplified text
- Full keyboard navigation support

### 🎙️ Voice Assistant
- Real-time voice conversations with AI
- Powered by Vapi AI
- Context-aware when discussing uploaded images
- General questions about images and internet culture
- Live transcript of conversations

### ♿ Accessibility First
- WCAG 2.1 compliant
- Full keyboard navigation
- Semantic HTML with ARIA labels
- High contrast design
- Screen reader optimized
- Skip to main content link
- Focus indicators throughout

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **AI Model**: Google Gemini Vision
- **Voice AI**: Vapi AI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Speech**: Browser Speech Synthesis API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get One Here](https://makersuite.google.com/app/apikey))
- Vapi AI account (For Voice Assistant)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Sadiya-125/Vibe-Vision.git
cd Vibe-Vision
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Analyzing an Image

1. Navigate to the **Analyze** page
2. Upload an image by:
   - Dragging and dropping a file
   - Clicking to browse files
   - Pasting an image URL
3. Click **Analyze Image**
4. View the three-tier analysis results
5. Use the **Read Aloud** feature to hear the results
6. Toggle **Simplify for Screen Reader** for simplified text

### Discussing an Image with Voice Assistant

**This is the killer feature!** After analyzing an image:

1. Click **"Discuss with Voice Assistant"** button on the analysis results
2. The voice assistant launches with full context of your image
3. Click **"Start Voice Call"** to begin the conversation
4. Ask questions about your specific image:
   - "Why is this meme funny?"
   - "What's the cultural reference here?"
   - "Explain the joke to me"
   - "What emotion does this convey?"
   - "Why would people share this?"
5. The assistant answers based on the analysis + AI knowledge
6. View the conversation transcript in real-time
7. Navigate back to full analysis anytime

**Example Flow:**
```
Upload meme → Analyze → See results → Discuss with Voice Assistant →
Ask "Why is this funny?" → Get detailed explanation → Ask follow-ups
```

### Using the Standalone Voice Assistant

1. Navigate to the **Voice Assistant** page
2. Click **Start Voice Call**
3. Describe images or ask general questions about visual content
4. The assistant will help you understand internet culture
5. View the conversation transcript in real-time

## Design System

### Glassmorphism Theme
- Dark futuristic background (indigo/purple gradient)
- Glass-morphic UI elements with backdrop blur
- Neon blue and purple accent colors
- Glowing effects on interactive elements
- Smooth animations and transitions

### Accessibility
- High contrast text (white on dark)
- Focus indicators on all interactive elements
- Semantic HTML structure
- ARIA labels throughout
- Keyboard-only navigation support

## Project Structure

```
vibe-vision/
├── app/
│   ├── analyze/          # Image analysis page
│   ├── voice/            # Voice assistant page
│   ├── api/
│   │   └── analyze/      # Gemini Vision API route
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles and theme
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── GlassCard.tsx
│   │   ├── Navigation.tsx
│   │   ├── GradientBackground.tsx
│   │   └── FloatingParticles.tsx
│   └── features/         # Feature-specific components
│       ├── ImageUpload.tsx
│       ├── AnalysisResults.tsx
│       └── VoiceAssistant.tsx
├── lib/
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```
