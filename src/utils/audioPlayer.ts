/**
 * Arabic Text-to-Speech Player utilizing Web Speech API
 */

export interface SpeechController {
  speak: (text: string, rate?: number, onEnd?: () => void) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isSupported: boolean;
}

export function createArabicSpeechPlayer(): SpeechController {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  let currentUtterance: SpeechSynthesisUtterance | null = null;

  return {
    isSupported,
    speak: (text: string, rate = 0.85, onEnd?: () => void) => {
      if (!isSupported) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance = utterance;

      // Select Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
      utterance.lang = 'ar-SA';
      utterance.rate = rate; // 0.85x is ideal for 10th grade Arabic learners
      utterance.pitch = 1.0;

      utterance.onend = () => {
        currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis event:', e);
        currentUtterance = null;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    },
    pause: () => {
      if (isSupported) window.speechSynthesis.pause();
    },
    resume: () => {
      if (isSupported) window.speechSynthesis.resume();
    },
    stop: () => {
      if (isSupported) window.speechSynthesis.cancel();
      currentUtterance = null;
    },
  };
}
