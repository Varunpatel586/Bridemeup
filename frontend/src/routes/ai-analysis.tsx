import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, Upload, Sparkles, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/lib/AuthContext";

export const Route = createFileRoute("/ai-analysis")({
  component: AiAnalysisPage,
});

function AiAnalysisPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceShape, setFaceShape] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { redirect: "/ai-analysis" } });
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

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      processImage(imageSrc);
    }
  }, [webcamRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64Img: string) => {
    setIsProcessing(true);
    try {
      // Convert base64 to Blob to send as multipart/form-data
      const response = await fetch(base64Img);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
      const res = await fetch(`${API_BASE}/api/analysis/face`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to process image");

      const data = await res.json();
      console.log("Backend response:", data);

      if (data.success) {
        setFaceShape(data.face_shape);
        setMessages([{ role: "assistant", content: data.recommendation }]);
      } else {
        setFaceShape("Unknown");
        setMessages([
          {
            role: "assistant",
            content:
              data.message ||
              "I couldn't detect a face clearly. How can I help you plan your bridal look?",
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setFaceShape("Unknown");
      setMessages([
        {
          role: "assistant",
          content:
            "There was an error analyzing the image. How can I help you plan your bridal look?",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !faceShape) return;

    const newMessages = [...messages, { role: "user", content: chatInput }];
    setMessages(newMessages);
    setChatInput("");
    setIsChatLoading(true);

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
      setIsChatLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] text-[#1A1A1A] font-sans flex flex-col">
      <SiteHeader />
      <main className="h-[calc(100dvh-64px)] pt-5 pb-4 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Left: Camera / Display Area */}
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-light mb-2 flex items-center gap-2">
              <Sparkles className="text-[#C5A880] w-6 h-6" /> AI Bridal Consultant
            </h1>
            <p className="text-[#1A1A1A]/60">
              Allow our AI to analyze your facial geometry and recommend bespoke styling packages.
            </p>
          </div>

          <div className="bg-white border border-neutral-100 rounded-2xl p-4 flex-1 flex flex-col items-center justify-center min-h-0 relative overflow-hidden shadow-sm">
            {!image && !isProcessing && (
              <div className="w-full max-w-sm h-full min-h-0 flex flex-col">
                <div className="relative w-full flex-1 min-h-0 rounded-xl overflow-hidden bg-black mb-4">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="absolute inset-0 w-full h-full object-contain"
                    videoConstraints={{ facingMode: "user" }}
                  />
                  {/* Overlay Guide Mask */}
                  <div className="absolute inset-0 border-[40px] border-black/40 rounded-xl pointer-events-none">
                    <div className="w-full h-full border-2 border-dashed border-[#C5A880]/50 rounded-full flex items-center justify-center">
                      <span className="text-white/50 text-xs">Align face here</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 w-full shrink-0">
                  <button
                    onClick={capture}
                    className="flex-1 bg-[#1A1A1A] text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1A1A1A]/90 transition-colors"
                  >
                    <Camera className="w-4 h-4" /> Capture
                  </button>
                  <label className="flex-1 bg-white border border-neutral-200 py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50 transition-colors">
                    <Upload className="w-4 h-4" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 border-4 border-[#C5A880] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[#1A1A1A]/60">Analyzing facial geometry (468 points)...</p>
              </div>
            )}

            {image && !isProcessing && (
              <div className="w-full max-w-sm h-full min-h-0 flex flex-col">
                <div className="relative w-full flex-1 min-h-0 rounded-xl overflow-hidden bg-black mb-4">
                  <img
                    src={image}
                    alt="Captured"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
                <div className="bg-[#1A1A1A] text-white p-4 rounded-xl flex items-center justify-between shrink-0">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
                      Detected Shape
                    </p>
                    <p className="text-xl font-serif text-[#C5A880]">{faceShape}</p>
                  </div>
                  <button
                    onClick={() => {
                      setImage(null);
                      setFaceShape(null);
                      setMessages([]);
                    }}
                    className="text-xs border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    Retake
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat Interface */}
        {faceShape && (
          <div className="flex-1 bg-white border border-neutral-100 rounded-2xl flex flex-col shadow-sm h-full lg:h-auto overflow-hidden animate-in fade-in slide-in-from-right-4">
            <div className="p-4 border-b border-neutral-100 bg-[#FAFAFA]">
              <h3 className="font-medium text-[#1A1A1A]">Consultation Chat</h3>
              <p className="text-xs text-[#1A1A1A]/60">Live session with AI Stylist</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-[#1A1A1A] text-white rounded-br-none" : "bg-[#FAFAFA] border border-neutral-100 text-[#1A1A1A] rounded-bl-none"}`}
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
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#FAFAFA] border border-neutral-100 p-3 rounded-2xl rounded-bl-none text-sm flex gap-1">
                    <div
                      className="w-1.5 h-1.5 bg-[#1A1A1A]/30 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-[#1A1A1A]/30 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-[#1A1A1A]/30 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-neutral-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendChatMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask for specific styles or packages..."
                  className="flex-1 bg-[#FAFAFA] border border-neutral-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#C5A880] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-[#1A1A1A] text-white p-2.5 rounded-full disabled:opacity-50 hover:bg-[#C5A880] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
