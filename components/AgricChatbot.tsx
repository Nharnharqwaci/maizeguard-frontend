"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Menu,
  Home,
  Plus,
  MessageSquare,
  Globe,
  Volume2,
  Mic,
  MicOff,
  Settings,
  ChevronDown,
  Pause,
  Play,
  AlertCircle,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SessionSummary {
  id: string;
  title: string;
  prediction: string | null;
  language: string;
  updated_at: string;
}

interface Toast {
  id: number;
  message: string;
  type: "error" | "info" | "success";
}

interface AgricChatbotProps {
  prediction?: string;
  confidence?: number;
  treatment?: string[];
  scanId?: string;
}

type Language = "en" | "tw" | "dag";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  tw: "Twi",
  dag: "Dagbani",
};

const LANGUAGE_GREETINGS: Record<Language, string> = {
  en: "Hello! I'm your Agricultural AI Officer.",
  tw: "Akwaba! Me yɛ wo Kuadwuma afiri nyansa mu panin.",
  dag: "Antire! N yɛ wo Agricultural AI Officer.",
};

export default function AgricChatbot({
  prediction,
  confidence,
  treatment,
}: AgricChatbotProps) {
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSessionPrediction, setActiveSessionPrediction] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<Language>("en");
  const [pendingNewSession, setPendingNewSession] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Mic / Audio states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // TTS states
  const [showTtsSettings, setShowTtsSettings] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState(1.0);
  const [ttsVoice, setTtsVoice] = useState<string>("default");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentlySpeaking, setCurrentlySpeaking] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const langPickerRef = useRef<HTMLDivElement>(null);
  const ttsSettingsRef = useRef<HTMLDivElement>(null);
  const toastIdRef = useRef(0);

  const isHealthy = prediction === "Healthy";
  const isUncertain = prediction === "Uncertain";
  const isDisease = !!prediction && !isHealthy && !isUncertain;

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isLoggedIn = !!getToken();

  const showToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserName(localStorage.getItem("user_name"));
      const savedLang = localStorage.getItem("chat_language") as Language | null;
      if (savedLang && ["en", "tw", "dag"].includes(savedLang)) {
        setActiveLanguage(savedLang);
      }
      const savedSpeed = localStorage.getItem("chat_tts_speed");
      if (savedSpeed) setTtsSpeed(parseFloat(savedSpeed));
      const savedVoice = localStorage.getItem("chat_tts_voice");
      if (savedVoice) setTtsVoice(savedVoice);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langPickerRef.current && !langPickerRef.current.contains(e.target as Node)) {
        setShowLangPicker(false);
      }
      if (ttsSettingsRef.current && !ttsSettingsRef.current.contains(e.target as Node)) {
        setShowTtsSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buildGreeting = useCallback(
    (forPrediction?: string, forLang?: Language) => {
      const p = forPrediction ?? prediction;
      const lang = forLang ?? activeLanguage;
      const greeting = LANGUAGE_GREETINGS[lang];

      if (p === "Healthy") {
        const enPart = `Good news — your maize leaf looks **Healthy** (${confidence?.toFixed(1)}% confidence). No disease detected. How can I help you?`;
        const twPart = `Asɛm pa — wo aburo nhahan no yɛ **Apɔwmuden** (${confidence?.toFixed(1)}% confidence). Yaree biara nni hɔ. Wopɛ sɛ meboa wo dɛn?`;
        const dagPart = `Kpalim zaa — a maize kpamli n yɛ **Kpalim zaa** (${confidence?.toFixed(1)}% confidence). Kparibɔ kuɣu biɛla. N yɛli n-ti a shɛli?`;
        const body = lang === "tw" ? twPart : lang === "dag" ? dagPart : enPart;
        return `${greeting} ${body}`;
      }
      if (p) {
        const enPart = `I can see your maize leaf has been diagnosed with **${p.replace(/_/g, " ")}** (${confidence?.toFixed(1)}% confidence). How can I help you?`;
        const twPart = `Mahu sɛ wo aburo nhahan no wɔ **${p.replace(/_/g, " ")}** yaree mu (${confidence?.toFixed(1)}% confidence). Wopɛ sɛ meboa wo dɛn?`;
        const dagPart = `N nya a maize kpamli n nyɛ **${p.replace(/_/g, " ")}** (${confidence?.toFixed(1)}% confidence). N yɛli n-ti a shɛli?`;
        const body = lang === "tw" ? twPart : lang === "dag" ? dagPart : enPart;
        return `${greeting} ${body}`;
      }
      const enPart = `I'm here to help you with maize disease management, farming practices, and crop health questions.`;
      const twPart = `Mewɔ ha sɛ meboa wo aburo yaree ho, adwuma ho, ne nhahan ho nsɛm.`;
      const dagPart = `N be a n yɛli n-ti a maize kparibɔ, tiŋa, ni kpamli kpɛma.`;
      const body = lang === "tw" ? twPart : lang === "dag" ? dagPart : enPart;
      return `${greeting} ${body}`;
    },
    [prediction, confidence, activeLanguage]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const fetchSessions = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/chat/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  }, []);

  const loadSession = useCallback(
    async (sessionId: string | null) => {
      const token = getToken();
      if (!token) {
        setMessages([{ role: "assistant", content: buildGreeting(), timestamp: new Date() }]);
        setActiveSessionId(null);
        setActiveSessionPrediction(prediction ?? null);
        return;
      }

      setHistoryLoading(true);
      try {
        const url = sessionId
          ? `${API_BASE}/api/chat/history?session_id=${sessionId}`
          : `${API_BASE}/api/chat/history`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.messages && data.messages.length > 0) {
          setMessages(
            data.messages.map((m: any) => ({
              role: m.role,
              content: m.content,
              timestamp: new Date(m.timestamp),
            }))
          );
          setActiveSessionId(data.session_id);
          setActiveSessionPrediction(data.prediction ?? null);
          if (data.language && ["en", "tw", "dag"].includes(data.language)) {
            setActiveLanguage(data.language);
          }
        } else {
          setMessages([{ role: "assistant", content: buildGreeting(), timestamp: new Date() }]);
          setActiveSessionId(null);
          setActiveSessionPrediction(prediction ?? null);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setMessages([{ role: "assistant", content: buildGreeting(), timestamp: new Date() }]);
      } finally {
        setHistoryLoading(false);
      }
    },
    [buildGreeting, prediction]
  );

  useEffect(() => {
    if (!open || historyLoaded) return;
    (async () => {
      await loadSession(null);
      await fetchSessions();
      setHistoryLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!historyLoaded) return;
    if (!prediction) return;
    if (prediction === activeSessionPrediction) return;

    setMessages([{ role: "assistant", content: buildGreeting(prediction), timestamp: new Date() }]);
    setActiveSessionId(null);
    setActiveSessionPrediction(prediction);
    setPendingNewSession(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prediction, historyLoaded]);

  // ── MIC / AUDIO RECORDING ──
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await sendAudioToSTT(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic access denied or error:", err);
      showToast("Could not access microphone. Check permissions.", "error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
  };

  const sendAudioToSTT = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const res = await fetch(
        `${API_BASE}/api/chat/stt?language=${activeLanguage}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.text && data.text.trim()) {
        setInput(data.text);
        inputRef.current?.focus();
        showToast(`Transcribed: "${data.text.substring(0, 40)}${data.text.length > 40 ? "..." : ""}"`, "success");
      } else {
        showToast("Could not understand audio. Please try speaking clearly.", "error");
      }
    } catch (err) {
      console.error("STT error:", err);
      showToast("Speech recognition failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── SEND MESSAGE ──
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input.trim();

    const userMessage: Message = {
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: currentInput,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          prediction: prediction ?? null,
          confidence: confidence ?? null,
          treatment: treatment ?? null,
          session_id: activeSessionId,
          new_session: pendingNewSession,
          language: activeLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "I could not generate a response. Please try again.",
          timestamp: new Date(),
        },
      ]);

      if (data.session_id) {
        setActiveSessionId(data.session_id);
        setActiveSessionPrediction(prediction ?? null);
      }
      setPendingNewSession(false);
      fetchSessions();
    } catch (err: any) {
      console.error("Chatbot error:", err);
      const fallback =
        activeLanguage === "tw"
          ? "Kafra, mereyɛ adwuma a ɛyɛ den. Mepa wo kyɛw, san bɔ mmɔden bio."
          : activeLanguage === "dag"
          ? "N-yɛli, n ti n-gbaŋ. Chɛma ka dii yɛl' pahi."
          : "I'm having trouble connecting right now. Please make sure the server is running and try again.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallback,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── TTS: Backend first, browser fallback ──
  const speak = async (text: string, messageIndex?: number) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const id = messageIndex !== undefined ? String(messageIndex) : "temp";
    setCurrentlySpeaking(id);
    setIsPaused(false);

    try {
      const res = await fetch(`${API_BASE}/api/chat/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          language: activeLanguage,
        }),
      });
      const data = await res.json();

      if (data.audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audio.playbackRate = ttsSpeed;
        audioPlayerRef.current = audio;

        audio.onended = () => {
          setCurrentlySpeaking(null);
          setIsPaused(false);
          audioPlayerRef.current = null;
        };

        audio.onerror = () => {
          setCurrentlySpeaking(null);
          setIsPaused(false);
          audioPlayerRef.current = null;
        };

        audio.play();
        return;
      }
    } catch (err) {
      // Backend TTS failed, fall through to browser
    }

    // Fallback: browser speechSynthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = ttsSpeed;
      utteranceRef.current = utterance;

      if (ttsVoice !== "default") {
        const voice = availableVoices.find((v) => v.name === ttsVoice);
        if (voice) utterance.voice = voice;
      }

      utterance.onend = () => {
        setCurrentlySpeaking(null);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utterance.onerror = () => {
        setCurrentlySpeaking(null);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    } else {
      showToast("Text-to-speech not available.", "error");
      setCurrentlySpeaking(null);
    }
  };

  const pauseSpeech = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPaused(true);
    } else if (utteranceRef.current && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.play();
      setIsPaused(false);
    } else if (utteranceRef.current && window.speechSynthesis) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopSpeech = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentlySpeaking(null);
    setIsPaused(false);
    utteranceRef.current = null;
  };

  const saveTtsSettings = (speed: number, voice: string) => {
    setTtsSpeed(speed);
    setTtsVoice(voice);
    localStorage.setItem("chat_tts_speed", String(speed));
    localStorage.setItem("chat_tts_voice", voice);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = speed;
    }
  };

  const clearChat = async () => {
    const token = getToken();
    if (token && activeSessionId) {
      try {
        await fetch(`${API_BASE}/api/chat/history?session_id=${activeSessionId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchSessions();
      } catch (err) {
        console.error("Failed to clear server-side history:", err);
      }
    }
    setMessages([]);
    setActiveSessionId(null);
    setActiveSessionPrediction(prediction ?? null);
    setTimeout(() => {
      setMessages([{ role: "assistant", content: buildGreeting(), timestamp: new Date() }]);
    }, 100);
  };

  const startNewChat = () => {
    setMessages([{ role: "assistant", content: buildGreeting(), timestamp: new Date() }]);
    setActiveSessionId(null);
    setActiveSessionPrediction(prediction ?? null);
    setPendingNewSession(true);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const goHome = async () => {
    setSidebarOpen(false);
    setHistoryLoading(true);
        await loadSession(null);
    setHistoryLoading(false);
  };

  const openSession = async (sessionId: string) => {
    setSidebarOpen(false);
    await loadSession(sessionId);
  };

  const switchLanguage = (lang: Language) => {
    setActiveLanguage(lang);
    localStorage.setItem("chat_language", lang);
    setShowLangPicker(false);
    setMessages([{ role: "assistant", content: buildGreeting(undefined, lang), timestamp: new Date() }]);
    setActiveSessionId(null);
    setActiveSessionPrediction(prediction ?? null);
    setPendingNewSession(true);
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const suggestedQuestions = (() => {
    const diseaseName = prediction ? prediction.replace(/_/g, " ") : "";

    if (activeLanguage === "tw") {
      if (isHealthy) {
        return [
          "Dɛn na metumi ayɛ na ama m'aburo anaa atoko ayɛ nea ahoɔden wom?",
          "Dɛn fertilizer na ɛfata ma aburo anaa atoko?",
          "Mɛtumi anya eyi akɔsi bere bɛn?",
          "Mɛdua me aburo anaa atoko no dɛn bere so?",
        ];
      }
      if (isDisease) {
        return [
          `Dɛn fungicide na ɛsɛ sɛ mede di dwuma ma ${diseaseName}?`,
          "Mɛtumi adan sɛ yare no bɛtrɛw ɛkwan bi so?",
          "Bere bɛn na mɛdua nnɔbae foforo bio?",
          "Enti sɛ mebɛtɔn anaa medie a, ɛyɛ?",
        ];
      }
      return [
        "Mɛyɛ dɛn ahu aburo anaa atoko nhahan yaree?",
        "Dɛn fertilizer na ɛfata ma aburo anaa atoko?",
        "Mɛtumi adan aburo anaa atoko yaree no ɛkwan bi so?",
        "Bere bɛn na eye sen biara sɛ wobedua aburo anaa atoko wɔ Ghana?",
      ];
    }

    if (activeLanguage === "dag") {
      if (isHealthy) {
        return [
          "N-ni n-ti a maize kpamli?",
          "Shɛli fertilizer n-yɛn?",
          "N-yɛn n-ti a kparibɔ?",
          "N-yɛn n-ti a kpamli?",
        ];
      }
      if (isDisease) {
        return [
          `Shɛli fungicide n-yɛn n-ti ${diseaseName}?`,
          "N-yɛn n-ti a kparibɔ?",
          "Saŋa din n-sow kpamli pahi?",
          "A ni a ni n-di a, a sal' la?",
        ];
      }
      return [
        "N-ni n-ti a maize kpamli?",
        "Shɛli fertilizer n-yɛn?",
        "N-yɛn n-ti a kparibɔ?",
        "N-yɛn n-ti a kpamli?",
      ];
    }

    // English
    if (isHealthy) {
      return [
        "What can I do to keep my maize healthy?",
        "What fertilizer schedule do you recommend?",
        "How do I prevent diseases before they start?",
        "How often should I monitor my field?",
      ];
    }
    if (isDisease) {
      return [
        `What fungicide should I use for ${diseaseName}?`,
        "How do I prevent this from spreading?",
        "When should I replant after this disease?",
        "Is this safe to sell or eat?",
      ];
    }
    return [
      "How do I identify maize diseases?",
      "What fertilizer should I use for maize?",
      "How often should I water my maize?",
      "When is the best time to plant maize in Ghana?",
    ];
  })();

  const initials = userName
    ? userName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 ${
              toast.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : toast.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {toast.type === "error" && <AlertCircle size={16} />}
            {toast.message}
          </div>
        ))}
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open ? "scale-0 opacity-0" : "scale-100 opacity-100"
        } bg-green-600 hover:bg-green-700 text-white`}
        aria-label="Open agricultural assistant"
      >
        <MessageCircle size={28} />
        {isDisease && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
            !
          </span>
        )}
        {isHealthy && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-xs font-bold">
            ✓
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className={`fixed bottom-2 right-2 sm:bottom-6 sm:right-6 z-50 flex rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300
            w-[calc(100vw-1rem)] h-[calc(100vh-1rem)]
            sm:w-[400px] sm:h-[600px] sm:max-w-[calc(100vw-2rem)] sm:max-h-[calc(100vh-5rem)]
            ${sidebarOpen && isLoggedIn ? "sm:w-[640px]" : ""}
          `}
        >
          {/* Sidebar */}
          {sidebarOpen && isLoggedIn && (
            <div className="w-full sm:w-[220px] absolute sm:relative z-20 h-full flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex flex-col">
              <div className="p-3 flex flex-col gap-1">
                <button
                  onClick={goHome}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <Home size={16} />
                  Home
                </button>
                <button
                  onClick={startNewChat}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <Plus size={16} />
                  New
                </button>
              </div>

              <div className="px-3 pt-2 pb-1">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                  Recents
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
                {sessions.length === 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 px-3 py-2">
                    No past conversations yet.
                  </p>
                )}
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => openSession(s.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                      s.id === activeSessionId
                        ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 font-medium"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <MessageSquare size={13} className="flex-shrink-0 opacity-60" />
                    <span className="truncate">{s.title}</span>
                    <span className="ml-auto text-[10px] opacity-50 uppercase">
                      {s.language}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                  {userName || "Farmer"}
                </span>
              </div>
            </div>
          )}

          {/* Main chat panel */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-green-700 dark:bg-green-900 text-white flex-shrink-0">
              <div className="flex items-center gap-2">
                {isLoggedIn && (
                  <button
                    onClick={() => setSidebarOpen((v) => !v)}
                    className="p-1.5 rounded-lg hover:bg-green-600 transition-colors -ml-1"
                    aria-label="Toggle conversation list"
                  >
                    <Menu size={18} />
                  </button>
                )}
                <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="font-semibold text-sm">Agricultural AI Officer</div>
                  <div className="text-xs text-green-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                    Online — ready to help
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* TTS Settings */}
                <div className="relative" ref={ttsSettingsRef}>
                  <button
                    onClick={() => setShowTtsSettings((v) => !v)}
                    className="flex items-center gap-1 text-green-200 hover:text-white text-xs px-2 py-1.5 rounded hover:bg-green-600 transition-colors"
                    aria-label="TTS settings"
                  >
                    <Settings size={14} />
                  </button>
                  {showTtsSettings && (
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-3 z-50 w-[220px]">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                        Voice Settings
                      </p>

                      {/* Speed */}
                      <div className="mb-3">
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                          <span>Slow</span>
                          <span className="font-medium">{ttsSpeed.toFixed(1)}x</span>
                          <span>Fast</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2.0"
                          step="0.1"
                          value={ttsSpeed}
                          onChange={(e) => saveTtsSettings(parseFloat(e.target.value), ttsVoice)}
                          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                      </div>

                      {/* Voice selector */}
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 block">
                          Fallback Voice (browser)
                        </label>
                        <select
                          value={ttsVoice}
                          onChange={(e) => saveTtsSettings(ttsSpeed, e.target.value)}
                          className="w-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md px-2 py-1.5 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="default">Auto (by language)</option>
                          {availableVoices.map((v) => (
                            <option key={v.name} value={v.name}>
                              {v.name} ({v.lang})
                            </option>
                          ))}
                        </select>
                      </div>

                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                        Meta MMS voices: Twi, Dagbani & English. Runs locally — works offline.
                      </p>
                    </div>
                  )}
                </div>

                {/* Language picker */}
                <div className="relative" ref={langPickerRef}>
                  <button
                    onClick={() => setShowLangPicker((v) => !v)}
                    className="flex items-center gap-1 text-green-200 hover:text-white text-xs px-2 py-1.5 rounded hover:bg-green-600 transition-colors"
                    aria-label="Change language"
                  >
                    <Globe size={14} />
                    <span className="uppercase font-medium">{activeLanguage}</span>
                    <ChevronDown size={12} />
                  </button>
                  {showLangPicker && (
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-50 min-w-[130px]">
                      {(["en", "tw", "dag"] as Language[]).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => switchLanguage(lang)}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                            activeLanguage === lang
                              ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 font-medium"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                          }`}
                        >
                          <span className="uppercase font-bold mr-2">{lang}</span>
                          {LANGUAGE_LABELS[lang]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={clearChat}
                  className="text-green-200 hover:text-white text-xs px-2 py-1 rounded hover:bg-green-600 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-green-600 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Diagnosis context banner */}
            {prediction && (
              <div
                className={`px-4 py-2 text-xs font-medium flex items-center gap-2 flex-shrink-0 ${
                  isHealthy
                    ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                    : isUncertain
                    ? "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
                    : "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400"
                }`}
              >
                <span>{isHealthy ? "✅" : "🌽"}</span>
                <span>
                  {isHealthy ? "Crop status: " : "Active diagnosis: "}
                  <strong>{prediction.replace(/_/g, " ")}</strong>
                  {confidence && ` — ${confidence.toFixed(1)}% confidence`}
                </span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {historyLoading && (
                <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 text-xs py-6">
                  <Loader2 size={14} className="animate-spin" />
                  Loading conversation...
                </div>
              )}

              {!historyLoading &&
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === "assistant"
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400"
                          : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                    </div>

                    <div className="flex flex-col gap-1 max-w-[80%]">
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === "assistant"
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                            : "bg-green-600 text-white rounded-tr-sm"
                        }`}
                      >
                        {renderContent(msg.content)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs ${
                            msg.role === "assistant"
                              ? "text-slate-400 dark:text-slate-500"
                              : "text-green-200 text-right"
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {msg.role === "assistant" && (
                          <div className="flex items-center gap-1">
                            {currentlySpeaking === String(i) ? (
                              <>
                                {isPaused ? (
                                  <button
                                    onClick={resumeSpeech}
                                    className="text-green-600 hover:text-green-700 transition-colors"
                                    aria-label="Resume"
                                    title="Resume"
                                  >
                                    <Play size={12} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={pauseSpeech}
                                    className="text-green-600 hover:text-green-700 transition-colors"
                                    aria-label="Pause"
                                    title="Pause"
                                  >
                                    <Pause size={12} />
                                  </button>
                                )}
                                <button
                                  onClick={stopSpeech}
                                  className="text-red-500 hover:text-red-600 transition-colors"
                                  aria-label="Stop"
                                  title="Stop"
                                >
                                  <X size={12} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => speak(msg.content, i)}
                                className="text-slate-400 hover:text-green-600 transition-colors"
                                aria-label="Read aloud"
                                title="Read aloud"
                              >
                                <Volume2 size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-green-700 dark:text-green-400" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-green-600" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {activeLanguage === "tw"
                        ? "Kuadwuma afiri nyansa mu panin reyɛ adwuma..."
                        : activeLanguage === "dag"
                        ? "Agricultural Officer n-yɛli..."
                        : "Agricultural Officer is typing..."}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {!historyLoading && messages.length <= 1 && (
              <div className="px-4 pb-2 flex-shrink-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                  {activeLanguage === "tw"
                    ? "Nsɛm a wo bɛ bisa:"
                    : activeLanguage === "dag"
                    ? "Yɛl' shɛli:"
                    : "Suggested questions:"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(q);
                        inputRef.current?.focus();
                      }}
                      className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-700 dark:hover:text-green-400 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area with mic */}
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-900">
              {isRecording && (
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-red-500 font-medium">
                    Recording... {formatTime(recordingTime)}
                  </span>
                  <button
                    onClick={stopRecording}
                    className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded hover:bg-red-200 transition-colors"
                  >
                    Stop
                  </button>
                </div>
              )}

              <div className="flex gap-2 items-end">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                  aria-label={isRecording ? "Stop recording" : "Start recording"}
                  title={isRecording ? "Stop recording" : "Speak your question"}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    activeLanguage === "tw"
                      ? "Bisa wo nhahan ho nsɛm..."
                      : activeLanguage === "dag"
                      ? "Bɔ yɛl' kpamli..."
                      : "Ask about your crop..."
                  }
                  disabled={loading || isRecording}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading || isRecording}
                  className="w-10 h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 text-center">
                AI Agricultural Officer · {LANGUAGE_LABELS[activeLanguage]} · Powered by Groq
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}