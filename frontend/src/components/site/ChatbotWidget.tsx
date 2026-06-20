import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "@tanstack/react-router";

export function ChatbotWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hi! I'm your AI bridal beauty concierge. How can I help you plan your perfect look today?" },
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newChatHistory = [...chatHistory, { role: "user", content: message }];
    setChatHistory(newChatHistory);
    setMessage("");

    try {
        const res = await fetch("http://localhost:8000/api/analysis/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                face_shape: "Unknown", // General chat
                messages: newChatHistory
            })
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setChatHistory((prev) => [
            ...prev,
            { role: "assistant", content: data.response },
        ]);
    } catch (err) {
        console.error(err);
        setChatHistory((prev) => [
            ...prev,
            { role: "assistant", content: "Sorry, I am having trouble connecting to the neural network right now. Please try again later." },
        ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] bg-white rounded-2xl shadow-xl overflow-hidden border border-plum/10 flex flex-col h-[450px]"
          >
            {/* Header */}
            <div className="bg-plum p-4 flex items-center justify-between text-ivory">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-rosegold flex items-center justify-center font-serif italic text-lg text-plum">
                  S
                </div>
                <div>
                  <h3 className="font-semibold text-sm">ShaadiGlow Concierge</h3>
                  <p className="text-[10px] text-ivory/70">Always active</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#FAFAFA] flex flex-col gap-4">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "assistant"
                      ? "bg-white border border-plum/5 text-plum rounded-tl-sm self-start"
                      : "bg-plum text-ivory rounded-tr-sm self-end"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-plum/10 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about artists, styling, or budget..."
                className="flex-1 bg-[#FAFAFA] border border-plum/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-plum text-plum placeholder:text-plum/40"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-2 bg-rosegold text-plum rounded-full disabled:opacity-50 hover:bg-champagne transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!user) {
            navigate({ to: "/auth", search: { redirect: window.location.pathname } });
            return;
          }
          setIsOpen(!isOpen);
        }}
        className="size-14 bg-plum text-ivory rounded-full shadow-lg flex items-center justify-center hover:bg-plum-light transition-colors"
        aria-label="Toggle Chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
