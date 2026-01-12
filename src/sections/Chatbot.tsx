import { useEffect, useState } from "react";

type Message = {
  id: number;
  text: string;
  side: "left" | "right";
  buttons?: string[];
};

const STACK_RESPONSES: Record<string, string> = {
  "Full-Stack development":
    "🧩 Full-Stack Development\n\n• React, Next.js\n• Node.js, Express\n• MongoDB, PostgreSQL\n• REST APIs\n\n📩 mushtaquok70@gmail.com",

  "Front-end development":
    "🎨 Front-end Development\n\n• React, Three.js\n• Tailwind, VueJS\n• Responsive UI\n• Performance optimization\n\n📩 mushtaquok70@gmail.com",

  "Back-end development":
    "⚙️ Back-end Development\n\n• Node.js, Express\n• Python & Flask\n• PHP-Laravel\n• Java-SpringBoot\n• Scalable APIs\n\n📩 mushtaquok70@gmail.com",

  "AI/ML development":
    "🤖 AI / ML Development\n\n• OpenAI APIs\n• Hugging Face\n• RAG ChatBot\n• PyTorch DL Models\n• Vector DB concepts\n\n📩 mushtaquok70@gmail.com",
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // ⏱ Auto open after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
      setMessages([
        {
          id: 1,
          text: "Hi, welcome to Mushtaq Portfolio 👋, Choose your interest:",
          side: "left",
          buttons: Object.keys(STACK_RESPONSES),
        },
      ]);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const handleOptionClick = (option: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: option,
        side: "right",
      },
      {
        id: Date.now() + 1,
        text: STACK_RESPONSES[option],
        side: "left",
      },
    ]);
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
          
          <div className="px-4 py-3 text-white font-medium border-b border-white/10">
            Virtual Assistant of 24/7
          </div>

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
                  {msg.text}

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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
