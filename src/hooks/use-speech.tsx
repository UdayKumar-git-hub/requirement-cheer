import { useEffect, useRef, useState } from "react";

type UseSpeechOptions = {
  lang?: string;
  interim?: boolean;
  continuous?: boolean;
};

export default function useSpeechRecognition({ lang = 'en-US', interim = true, continuous = true }: UseSpeechOptions = {}) {
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech Recognition API not supported in this browser.');
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = lang;
    recog.interimResults = interim;
    recog.continuous = continuous;

    recog.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) final += text;
        else interim += text;
      }

      if (interim) setInterimTranscript((t) => (t ? t + ' ' + interim : interim));
      if (final) {
        setFinalTranscript((t) => (t ? t + ' ' + final : final));
        // clear interim when we receive a final result
        setInterimTranscript('');
      }
    };

    recog.onerror = (ev: any) => {
      setError(ev?.error || 'Speech recognition error');
    };

    recog.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recog;

    return () => {
      try { recog.stop(); } catch {}
      recognitionRef.current = null;
    };
  }, [lang, interim, continuous]);

  const start = () => {
    setError(null);
    if (!recognitionRef.current) {
      setError('Speech Recognition not available');
      return;
    }
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to start recognition');
    }
  };

  const stop = () => {
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      // ignore
    }
    setListening(false);
  };

  const reset = () => {
    setInterimTranscript('');
    setFinalTranscript('');
    setError(null);
  };

  return {
    listening,
    interimTranscript,
    finalTranscript,
    error,
    start,
    stop,
    reset,
  } as const;
}
