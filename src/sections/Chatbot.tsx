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
  "Full-Stack development":
    "🧩 Full-Stack Development\n\n• React, Next.js\n• Node.js, Express\n• MongoDB, PostgreSQL\n• REST APIs\n\n📩 mushtaquok70@gmail.com",

  "Front-end development":
    "🎨 Front-end Development\n\n• React, Three.js\n• Tailwind, VueJS\n• Responsive UI\n• Performance optimization\n\n📩 mushtaquok70@gmail.com",

  "Back-end development":
    "⚙️ Back-end Development\n\n• Node.js, Express, LangChain\n• Python & Flask\n• PHP-Laravel\n• Java-SpringBoot\n• Scalable APIs\n\n📩 mushtaquok70@gmail.com",

  "AI/ML development":
    "🤖 AI / ML Development\n\n• OpenAI APIs\n• LangChain\n• RAG ChatBot\n• PyTorch DL Models\n• Vector DB concepts\n\n📩 mushtaquok70@gmail.com",
};

const RESPONSE_DELAY = 10000;

const getTime = () => 
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"});


const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth"});
  }, [messages]);

  // ⏱ Auto open after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
      setMessages([
        {
          id: 1,
          text: "Hi 👋 Welcome to my portfolio. \nAI chat coming soon -- currently in beta\nWhat would you like to explore today?\n👇",
          side: "left",
          buttons: Object.keys(STACK_RESPONSES),
          time: getTime(),
        },
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
    }, RESPONSE_DELAY);
  };

  const handleEmailClick = () => {
    navigator.clipboard.writeText("mushtaquok70@gmail.com");
    toast.dismiss();
    setToast("Email copied");
  };

  return (
    <>
      {/* Floating Icon */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black text-white shadow-lg"
        aria-label="Open chat"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[360px] max-h-[500px]
                        bg-[#0d0d0d] rounded-2xl shadow-xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="px-4 py-3 text-white font-medium border-b border-white/10">
            Portfolio Assistent
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line text-sm px-4 py-2 rounded-xl
                    ${msg.side === "right"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-800 text-white rounded-bl-none"}`}
                >
                  {/* Typing Indicator */}
                  {msg.typing ? (
                    <div className="flex gap-1 items-center">
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
                                className="mt-2 flex items-center gap-2 cursor-pointer
                                text-blue-400 hover:text-blue-300 transition"
                            >
                        📩 <span className="underline">{line.replace("📩", "").trim()}</span>
        </div>
      );
    }

    return <div key={i}>{line}</div>;
  })}
</div>


                      {msg.buttons && (
                        <div className="mt-3 space-y-2">
                          {msg.buttons.map((btn) => (
                            <button
                              key={btn}
                              onClick={() => handleOptionClick(btn)}
                              className="block w-full text-left px-3 py-2 rounded-lg
                                         bg-black hover:bg-gray-700 transition"
                            >
                              {btn}
                               </button>
                          ))}
                        </div>
                      )}
                      {msg.time && (
                        <div className="text-[10px] text-white/50 text-right mt-1">
                          {msg.time}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>
        </div>
      )}

      {/* Typing animation styles */}
      <style>
        {`
          .typing-dot {
            width: 6px;
            height: 6px;
            background: white;
            border-radius: 50%;
            animation: blink 1.4s infinite both;
          }

          .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
          }

          .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes blink {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}
      </style>

    </>
  );
};

export default Chatbot;
