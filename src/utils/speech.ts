/**
 * Voice synthesis and speech utilities for Kisan Command & Field Operations
 * Supports Web Speech API for Hindi, English, Marathi, and Punjabi announcements
 */
import { LanguageCode } from '../types';

export function speakAnnouncement(text: string, lang: LanguageCode | 'hi' | 'en' | 'mr' | 'pa' = 'hi'): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported on this browser.');
      resolve(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any previous speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92; // Clear pacing for clarity in rural and mandi environments
      utterance.pitch = 1.0;

      let localeCode = 'hi-IN';
      if (lang === 'en') localeCode = 'en-IN';
      else if (lang === 'mr') localeCode = 'mr-IN';
      else if (lang === 'pa') localeCode = 'pa-IN';
      else localeCode = 'hi-IN';

      utterance.lang = localeCode;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        if (lang === 'mr') {
          const marathiVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('Marathi'));
          const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('Hindi'));
          if (marathiVoice) utterance.voice = marathiVoice;
          else if (hindiVoice) utterance.voice = hindiVoice;
        } else if (lang === 'pa') {
          const punjabiVoice = voices.find(v => v.lang.includes('pa') || v.lang.includes('Punjabi'));
          const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('Hindi'));
          if (punjabiVoice) utterance.voice = punjabiVoice;
          else if (hindiVoice) utterance.voice = hindiVoice;
        } else if (lang === 'hi') {
          const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('Hindi'));
          if (hindiVoice) utterance.voice = hindiVoice;
        } else {
          const indianEnglish = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.startsWith('en'));
          if (indianEnglish) utterance.voice = indianEnglish;
        }
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech error:', err);
      resolve(false);
    }
  });
}

// Generate bilingual announcement for queue token
export function announceTokenCall(tokenNumber: string, counterNumber: number, farmerName: string) {
  const hindiText = `ध्यान दें! टोकन संख्या ${tokenNumber}, श्री ${farmerName}, कृपया काउंटर नंबर ${counterNumber} पर पधारें।`;
  const engText = `Attention please! Token number ${tokenNumber}, ${farmerName}, please proceed to Counter ${counterNumber}.`;
  
  // Speak Hindi first, then English
  speakAnnouncement(hindiText, 'hi').then(() => {
    setTimeout(() => {
      speakAnnouncement(engText, 'en');
    }, 400);
  });
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Crisp Web Audio notification chime (no external MP3 required)
export function playAudioChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // First tone (E5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second harmonious tone (B5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.15);
    gain2.gain.setValueAtTime(0.15, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);
  } catch {
    // AudioContext blocked or not allowed until user gesture
  }
}

