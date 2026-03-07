/**
 * Text utility functions for processing and sanitizing text
 */

/**
 * Strip markdown and special characters that sound bad when read aloud
 * Removes: #, *, **, _, __, `, control characters, etc.
 */
export function stripMarkdownForSpeech(text: string): string {
  if (!text) return '';

  return text
    // Remove markdown headers (# ## ###)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers (** __ * _)
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove code blocks and inline code
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove links but keep text [text](url) -> text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove remaining special chars that don't sound good
    .replace(/[#*_`~>|]/g, '')
    // Remove control characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Remove zero-width spaces
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Normalize whitespace (replace multiple spaces/newlines with single space)
    .replace(/\s+/g, ' ')
    // Trim
    .trim();
}

/**
 * Sanitize text for display (less aggressive than stripMarkdownForSpeech)
 * Keeps some formatting but removes control characters
 */
export function sanitizeText(text: string): string {
  if (!text) return '';

  return text
    // Remove control characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Remove zero-width spaces
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Prepare text for voice reading (speech-optimized)
 */
export function prepareForVoice(text: string): string {
  return stripMarkdownForSpeech(text)
    // Replace common abbreviations with full words
    .replace(/\bvs\b\.?/gi, 'versus')
    .replace(/\betc\b\.?/gi, 'etcetera')
    .replace(/\be\.g\.\b/gi, 'for example')
    .replace(/\bi\.e\.\b/gi, 'that is')
    // Add pauses for better speech flow
    .replace(/\.\s+/g, '. ')
    .replace(/,\s*/g, ', ');
}
