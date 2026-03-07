// Audio notification utility using Web Speech API
// Provides voice feedback for important actions

class AudioNotificationService {
  private synth: SpeechSynthesis | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  /**
   * Speak a notification message
   */
  speak(message: string, options?: { rate?: number; pitch?: number; volume?: number }): void {
    if (!this.synth || !this.enabled) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 0.8;
    utterance.lang = 'en-US';

    this.synth.speak(utterance);
  }

  /**
   * Stop any ongoing speech
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Enable or disable audio notifications
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled && this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Check if audio notifications are supported
   */
  isSupported(): boolean {
    return this.synth !== null;
  }
}

// Create singleton instance
export const audioNotifications = new AudioNotificationService();

// Predefined notification messages
export const AudioMessages = {
  IMAGE_UPLOADED: 'Image uploaded successfully',
  ANALYZING: 'Analyzing image',
  ANALYSIS_COMPLETE: 'Analysis complete',
  VOICE_STARTED: 'Voice assistant started',
  VOICE_ENDED: 'Voice assistant ended',
  VOICE_CONNECTED: 'Connected to voice assistant',
  ERROR: 'An error occurred',
  UPLOAD_ERROR: 'Failed to upload image',
  ANALYSIS_ERROR: 'Failed to analyze image',
} as const;
