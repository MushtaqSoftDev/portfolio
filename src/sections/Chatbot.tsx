import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type SpeechRecognitionResultLike = {
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  results: SpeechRecognitionResultLike[];
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

/** Web Speech API (Chrome/Edge best; Safari partial) */
function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window &
    typeof globalThis & {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}


const setToast = (message: string) => {
  toast.success(message, { autoClose: 3000 });
}

type Message = {
  id: number;
  text?: string;
  /** Transient line while the assistant works (tools / thinking); hidden once answer streams */
  loadingStatus?: string;
  transient?: boolean;
  side: "left" | "right";
  buttons?: string[];
  typing?: boolean;
  time?: string;
};

const STACK_RESPONSES: Record<string, string> = {
  // Predefined responses for quick tech‑stack exploration
  "Full-Stack development":
    "🧩 Full-Stack Development\n\n• React, Next.js\n• Node.js, Express\n• MongoDB, PostgreSQL\n• REST APIs\n\n📩 mushtaquok70@gmail.com",

  "Front-end development":
    "🎨 Front-end Development\n\n• React, Three.js\n• Tailwind, VueJS\n• Responsive UI\n• Performance optimization\n\n📩 mushtaquok70@gmail.com",

  "Back-end development":
    "⚙️ Back-end Development\n\n• Node.js, Express, LangChain\n• Python & Flask\n• PHP-Laravel\n• Java-SpringBoot\n• Scalable APIs\n\n📩 mushtaquok70@gmail.com",

  "AI/ML development":
    "🤖 AI / ML Development\n\n• OpenAI APIs\n• LangChain\n• RAG ChatBot\n• PyTorch DL Models\n• Vector DB concepts\n\n📩 mushtaquok70@gmail.com",
};

const getTime = () => 
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"});

const WELCOME_MESSAGES = [
  "How can I help you today?",
  "Welcome to Mushtaq's portfolio! 👋",
  "Ask me anything about my work!",
  "Let's explore together! 🚀",
];

/** RAG backend base URL (no trailing slash). Override in `.env`: `VITE_RAG_API_ORIGIN=https://...` */
const RAG_API_ORIGIN = (
  (import.meta.env.VITE_RAG_API_ORIGIN as string | undefined) ||
  "https://rag-portfolio-bot.onrender.com"
).replace(/\/$/, "");

const CHAT_HISTORY_KEY = "portfolio_chat_history_v1";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [welcomeMessage] = useState(() => 
    WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]
  );

  const speechSupported = useMemo(() => !!getSpeechRecognitionCtor(), []);

  const stopVoice = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* already stopped */
    }
    recognitionRef.current = null;
    setVoiceListening(false);
  }, []);

  const toggleVoiceInput = useCallback(() => {
    if (!speechSupported) {
      toast.info("Voice input works best in Chrome or Edge on desktop.", {
        autoClose: 4000,
      });
      return;
    }
    if (isAiLoading) return;

    if (voiceListening) {
      stopVoice();
      return;
    }

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const rec = new Ctor();
    rec.lang = navigator.language || "en-US";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (event: SpeechRecognitionEventLike) => {
      let line = "";
      for (let i = 0; i < event.results.length; i++) {
        line += event.results[i][0].transcript;
      }
      setInputValue(line.trimStart());
    };

    rec.onerror = (ev: SpeechRecognitionErrorEventLike) => {
      setVoiceListening(false);
      recognitionRef.current = null;
      if (ev.error === "not-allowed") {
        toast.error("Microphone permission denied.");
      } else if (ev.error !== "aborted" && ev.error !== "no-speech") {
        toast.error("Voice input failed. Try again or type your message.");
      }
    };

    rec.onend = () => {
      setVoiceListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = rec;
    setVoiceListening(true);
    try {
      rec.start();
    } catch {
      setVoiceListening(false);
      recognitionRef.current = null;
      toast.error("Could not start microphone.");
    }
  }, [isAiLoading, speechSupported, stopVoice, voiceListening]);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth"});
  }, [messages]);

  // Initialize welcome message when chatbot opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hi 👋 Welcome to my portfolio. \nWhat would you like to explore today?\n👇",
          side: "left",
          buttons: Object.keys(STACK_RESPONSES),
          time: getTime(),
        },
      ]);
    }
  }, [open]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Message[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
      }
    } catch {
      /* ignore malformed local history */
    }
  }, []);

  useEffect(() => {
    const persistable = messages.filter(
      (m) =>
        !m.typing &&
        !m.buttons &&
        !m.loadingStatus &&
        !m.transient &&
        !!m.text?.trim()
    );
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(persistable.slice(-40)));
    } catch {
      /* ignore storage quota issues */
    }
  }, [messages]);

  // Handle RAG Integration (streaming SSE)
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isAiLoading) return;

    const userText = inputValue.trim();
    const userMsgId = Date.now();
    const assistantMsgId = userMsgId + 1;
    const wakeUpMessageId = userMsgId + 2;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, text: userText, side: "right", time: getTime() },
      {
        id: assistantMsgId,
        text: "",
        side: "left",
        time: getTime(),
      },
    ]);

    setInputValue("");
    setIsAiLoading(true);

    let wakeUpTimer: ReturnType<typeof setTimeout> | null = null;

    const clearWake = () => {
      if (wakeUpTimer !== null) {
        clearTimeout(wakeUpTimer);
        wakeUpTimer = null;
      }
      setMessages((prev) => prev.filter((m) => m.id !== wakeUpMessageId));
    };

    wakeUpTimer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: wakeUpMessageId,
          text: "☕ The server is waking up (this takes ~1 min on the free tier). Please wait...",
          side: "left",
          transient: true,
          time: getTime(),
        },
      ]);
    }, 5000);

    const setAssistantError = () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                text: "Sorry, something went wrong. Please try again later. If error persists, contact me at mushtaquok70@gmail.com",
              }
            : m
        )
      );
    };

    try {
      const response = await fetch(`${RAG_API_ORIGIN}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ question: userText }),
      });

      if (!response.ok) {
        clearWake();
        setAssistantError();
        throw new Error("Error from server");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        clearWake();
        setAssistantError();
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let sseBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        sseBuffer += decoder.decode(value, { stream: true });

        const blocks = sseBuffer.split("\n\n");
        sseBuffer = blocks.pop() ?? "";

        for (const block of blocks) {
          for (const line of block.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const raw = line.replace(/^data:\s?/, "").trim();
            if (raw === "[DONE]") continue;

            let parsed: {
              text?: string;
              status?: string;
              error?: string;
            };
            try {
              parsed = JSON.parse(raw) as {
                text?: string;
                status?: string;
                error?: string;
              };
            } catch {
              continue;
            }

            if (parsed.error) {
              clearWake();
              setAssistantError();
              console.error("Chatbot stream error:", parsed.error);
              return;
            }

            if (Object.prototype.hasOwnProperty.call(parsed, "status")) {
              clearWake();
              const s = parsed.status;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        loadingStatus: s ? s : undefined,
                      }
                    : m
                )
              );
            }

            if (parsed.text) {
              clearWake();
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, text: (m.text ?? "") + parsed.text }
                    : m
                )
              );
            }

          }
        }
      }

      clearWake();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId && !(m.text ?? "").trim()
            ? { ...m, text: "Hmm, I don't have an answer for that yet." }
            : m
        )
      );
    } catch (error) {
      clearWake();
      setAssistantError();
      console.error("Chatbot error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    const typingId = Date.now() + 1;


    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: option,
        side: "right",
        time: getTime(),
      },
      {
        id: typingId,
        side: "left",
        typing: true,
        time: getTime(),
      },
    ]);

    // Simulate backend delay
    setTimeout(() => {
      setMessages((prev) => 
        prev.filter((msg) => msg.id !== typingId)
        .concat({
          id: Date.now(),
          text: STACK_RESPONSES[option],
          side: "left",
        }));
    }, 8000);
  };

  const handleEmailClick = (email?: string) => {
    navigator.clipboard.writeText(email ?? "mushtaquok70@gmail.com");
    toast.dismiss();
    setToast("Email copied");
  };

  // Renders a line with only email addresses as clickable links; rest stays plain for copy.
  const renderLineWithEmailLinks = (line: string, lineKey: number) => {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;
    const re = new RegExp(emailRegex.source, "g");
    while ((match = re.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      const email = match[0];
      parts.push(
        <span
          key={`${lineKey}-${key++}`}
          role="button"
          tabIndex={0}
          onClick={() => handleEmailClick(email)}
          onKeyDown={(e) => e.key === "Enter" && handleEmailClick(email)}
          className="chatbot-email-link cursor-pointer underline"
        >
          {email}
        </span>
      );
      lastIndex = re.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
    return parts.length > 0 ? parts : [line];
  };

  const handleClose = () => {
    setOpen(false);
    // Optionally reset messages when closing
    // setMessages([]);
  };

  const clearHistory = () => {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setMessages([
      {
        id: 1,
        text: "Hi 👋 Welcome to my portfolio. \nWhat would you like to explore today?\n👇",
        side: "left",
        buttons: Object.keys(STACK_RESPONSES),
        time: getTime(),
      },
    ]);
    toast.info("Chat history cleared.");
  };

  return (
    <>
      {/* Floating Chat Button - Shows welcome message when closed */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="chatbot-fab group"
          aria-label="Open chat"
        >
          <div className="relative">
            <div className="chatbot-fab-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="chatbot-welcome-bubble">
              {welcomeMessage}
              <div className="chatbot-welcome-bubble-arrow"></div>
            </div>
          </div>
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="flex items-center gap-2">
              <div className="chatbot-header-status"></div>
              <span className="chatbot-header-title">Portfolio Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearHistory}
                className="chatbot-clear-btn"
                aria-label="Clear chat history"
                title="Clear chat history"
              >
                Clear
              </button>
              <button
                onClick={handleClose}
                className="chatbot-close-btn"
                aria-label="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="chatbot-messages-empty">
                <div className="chatbot-messages-empty-inner">
                  <div className="mb-2">💬</div>
                  <div>{welcomeMessage}</div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chatbot-msg-row ${msg.side === "right" ? "chatbot-msg-row--right" : "chatbot-msg-row--left"}`}
                >
                  <div
                    className={`chatbot-msg-bubble ${msg.side === "right" ? "chatbot-msg-bubble--right" : "chatbot-msg-bubble--left"}`}
                  >
                    {msg.typing ? (
                      <div className="chatbot-msg-typing">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    ) : msg.side === "left" &&
                      isAiLoading &&
                      !msg.text?.trim() &&
                      !msg.buttons &&
                      !msg.loadingStatus ? (
                      <div className="chatbot-msg-typing">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    ) : (
                      <>
                        {msg.loadingStatus ? (
                          <div className="chatbot-stream-status">
                            {msg.loadingStatus}
                          </div>
                        ) : null}
                        <div className="whitespace-pre-line">
                          {(msg.text ?? "").split("\n").map((line, i) => (
                            <div key={i}>
                              {renderLineWithEmailLinks(line, i)}
                            </div>
                          ))}
                        </div>
                        {msg.buttons && (
                          <div className="chatbot-options">
                            {msg.buttons.map((btn) => (
                              <button
                                key={btn}
                                onClick={() => handleOptionClick(btn)}
                                className="chatbot-option-btn"
                              >
                                {btn}
                              </button>
                            ))}
                          </div>
                        )}
                        {msg.time && (
                          <div className="chatbot-msg-time">
                            {msg.time}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chatbot-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                speechSupported
                  ? "Type a message or tap the mic…"
                  : "Type your message…"
              }
              className="chatbot-input"
              disabled={isAiLoading || voiceListening}
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isAiLoading || !speechSupported}
              className={`chatbot-voice-btn ${voiceListening ? "chatbot-voice-btn--listening" : ""} ${!speechSupported || isAiLoading ? "chatbot-voice-btn--disabled" : "chatbot-voice-btn--idle"}`}
              aria-label={voiceListening ? "Stop listening" : "Speak your message"}
              aria-pressed={voiceListening}
              title={
                speechSupported
                  ? voiceListening
                    ? "Stop"
                    : "Speak (fills the box; edit if needed, then send)"
                  : "Voice not available in this browser"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={isAiLoading || !inputValue.trim() || voiceListening}
              className={`chatbot-send-btn ${!inputValue.trim() || isAiLoading || voiceListening ? "chatbot-send-btn--disabled" : "chatbot-send-btn--active"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
