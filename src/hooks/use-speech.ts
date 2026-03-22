import { useState, useCallback, useRef } from "react";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback((lang: string) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = getLangCode(lang);
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (e: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }
      setTranscript(finalText + interimText);
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        try { recognition.start(); } catch { setIsListening(false); }
      }
    };
    recognition.onerror = (e: any) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript("");
  }, []);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    recognition?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, startListening, stopListening, setTranscript };
}

export function speakText(text: string, lang: string) {
  const cleanText = text
    .replace(/📝\s*\*\*Correções:\*\*[\s\S]*/g, "")
    .replace(/~~[^~]+~~/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[#*_~`]/g, "")
    .trim();

  if (!cleanText) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = getLangCode(lang);
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function getLangCode(lang: string): string {
  const map: Record<string, string> = {
    Portuguese: "pt-BR",
    English: "en-US",
    Spanish: "es-ES",
    French: "fr-FR",
    German: "de-DE",
    Italian: "it-IT",
    Japanese: "ja-JP",
    Korean: "ko-KR",
    "Mandarin Chinese": "zh-CN",
  };
  return map[lang] || "pt-BR";
}
