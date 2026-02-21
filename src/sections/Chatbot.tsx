import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const setToast = (message: string) => {
  toast.success(message, { autoClose: 3000 });
}

type Message = {
  id: number;
  text?: string;
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

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [welcomeMessage] = useState(() => 
    WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]
  );

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

  // Handle RAG Integration (Render web service)
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isAiLoading) return;

    const userText = inputValue;
    const typingId = Date.now() + 1;

    // 1. Add user message and typing indicator
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: userText, side: "right", time: getTime() },
      { id: typingId, side: "left", typing: true, time: getTime() },
    ]);

    setInputValue("");
    setIsAiLoading(true);

    try {
      // 2. Call RAG backend hosted on Render
      const wakeUpMessageId = Date.now() + 2;
      const wakeUpTimer = setTimeout(() => {
        setMessages(prev => [...prev, {
        id: wakeUpMessageId,
        text: "☕ The server is waking up (this takes ~1 min on the free tier). Please wait...",
        side: "left",
        time: getTime()
      }]);
    }, 5000); // Show after 5 seconds of waiting
      const response = await fetch("https://rag-portfolio-bot.onrender.com/chat", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ question: userText }),
      });

      // After fetch is done
      clearTimeout(wakeUpTimer);
      setMessages(prev => prev.filter(m => m.id !== wakeUpMessageId));

      if (!response.ok) throw new Error("Error from server");

      const data = await response.json();

      // 3. Remove typing indicator and add AI response
      setMessages((prev) => 
        prev.filter((msg) => msg.id !== typingId)
        .concat({
          id: Date.now(),
          text: data.answer || "Hmm, I don't have an answer for that yet.",
          side: "left",
          time: getTime(),
        }));
    } catch (error) {
      setMessages((prev) => 
        prev.filter((msg) => msg.id !== typingId).concat({
          id: Date.now(),
          text: "Sorry, something went wrong. Please try again later. If error persists, contact me at mushtaquok70@gmail.com",
          side: "left",
          time: getTime(),
        }));
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

  const handleEmailClick = () => {
    navigator.clipboard.writeText("mushtaquok70@gmail.com");
    toast.dismiss();
    setToast("Email copied");
  };

  const handleClose = () => {
    setOpen(false);
    // Optionally reset messages when closing
    // setMessages([]);
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
                    ) : (
                      <>
                        <div className="whitespace-pre-line">
                          {msg.text?.split("\n").map((line, i) => {
                            if (line.includes("@")) {
                              return (
                                <div
                                  key={i}
                                  onClick={handleEmailClick}
                                  className="chatbot-email-link"
                                >
                                  📩 <span className="underline">{line.replace("📩", "").trim()}</span>
                                </div>
                              );
                            }
                            return <div key={i}>{line}</div>;
                          })}
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
              placeholder="Type your message..."
              className="chatbot-input"
              disabled={isAiLoading}
            />
            <button
              type="submit"
              disabled={isAiLoading || !inputValue.trim()}
              className={`chatbot-send-btn ${!inputValue.trim() || isAiLoading ? "chatbot-send-btn--disabled" : "chatbot-send-btn--active"}`}
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
