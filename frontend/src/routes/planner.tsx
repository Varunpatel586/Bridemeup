import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Sparkles, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/planner")({
  component: PlannerDashboard,
});

function PlannerDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [faceShape, setFaceShape] = useState("Oval");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your AI Bridal Consultant. I can generate a bespoke 90-day timeline for you. Please tell me about your events and budget, or any specific concerns you have!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { redirect: "/planner" } });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-[100dvh] bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[#C5A880] tracking-widest uppercase text-sm animate-pulse">
          Authenticating...
        </p>
      </div>
    );
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
      const res = await fetch(`${API_BASE}/api/analysis/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          face_shape: faceShape,
          messages: newMessages,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Sorry, I am having trouble connecting to the neural network right now. Please try again later.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] text-[#1A1A1A] font-sans flex flex-col">
      <SiteHeader />
      <main className="h-[calc(100dvh-64px)] pt-5 pb-4 px-6 max-w-4xl mx-auto w-full flex flex-col overflow-hidden">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#C5A880] tracking-widest uppercase mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Neural Planner
          </p>
          <h1 className="text-4xl font-light mb-4">Your Bespoke Timeline</h1>
          <p className="text-[#1A1A1A]/60">
            Chat with our AI to generate a timeline tuned specifically for your face shape and
            needs.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium">Face Shape Context:</label>
          <select
            value={faceShape}
            onChange={(e) => setFaceShape(e.target.value)}
            className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#C5A880]"
          >
            <option value="Oval">Oval</option>
            <option value="Round">Round</option>
            <option value="Square">Square</option>
            <option value="Heart">Heart</option>
            <option value="Diamond">Diamond</option>
          </select>
        </div>

        <div className="flex-1 bg-white border border-neutral-100 rounded-2xl p-6 flex flex-col shadow-sm min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-none">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user"
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-neutral-50 border border-neutral-100 text-[#1A1A1A]"
                    }`}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-2xl text-sm bg-neutral-50 border border-neutral-100 text-[#1A1A1A]/50 animate-pulse">
                  Consultant is typing...
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about skincare, timelines, or styling..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-4 pr-12 outline-none focus:border-[#C5A880] transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1A1A1A] text-white rounded-lg disabled:opacity-50 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Save Plan Button */}
          {messages.length > 1 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={async () => {
                  try {
                    const { supabase } = await import("@/lib/supabase");
                    // Save the latest assistant response as the plan
                    const planContent =
                      messages.filter((m) => m.role === "assistant").pop()?.content || "";
                    if (!planContent) return;

                    const { error } = await supabase.from("wedding_plans").insert({
                      user_id: user.id,
                      plan_data: { content: planContent },
                    });
                    if (error) throw error;
                    alert("Plan saved to your dashboard!");
                  } catch (e) {
                    console.error(e);
                    alert("Failed to save plan.");
                  }
                }}
                className="text-sm font-medium border border-[#1A1A1A] text-[#1A1A1A] px-4 py-2 rounded-full hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                Save Plan to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
