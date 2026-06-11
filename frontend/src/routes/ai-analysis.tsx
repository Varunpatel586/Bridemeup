import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, Upload, Sparkles, Send } from "lucide-react";

export const Route = createFileRoute("/ai-analysis")({
  component: AiAnalysisPage,
});

function AiAnalysisPage() {
    const webcamRef = useRef<Webcam>(null);
    const [image, setImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [faceShape, setFaceShape] = useState<string | null>(null);
    
    // Chat state
    const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);

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
            // Mocking API call to backend /api/analysis/face
            // In reality, you'd do: await fetch('http://localhost:8000/api/analysis/face', ...)
            setTimeout(() => {
                setFaceShape("Oval");
                setIsProcessing(false);
                setMessages([{ role: "assistant", content: "I've analyzed your facial structure and determined you have an elegant Oval face shape. How can I help you plan your bridal look?" }]);
            }, 2500);
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim() || !faceShape) return;
        
        const newMessages = [...messages, { role: "user", content: chatInput }];
        setMessages(newMessages);
        setChatInput("");
        setIsChatLoading(true);

        // Mock API call to backend /api/analysis/chat
        setTimeout(() => {
            setMessages([...newMessages, { role: "assistant", content: "Based on your Oval face shape, I recommend a soft glam look with slightly contoured cheekbones. Would you like me to recommend some specific artists from Lumière Artistry?" }]);
            setIsChatLoading(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans flex flex-col">
            <SiteHeader />
            <main className="flex-1 pt-24 pb-8 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8">
                
                {/* Left: Camera / Display Area */}
                <div className="flex-1 flex flex-col">
                    <div className="mb-6">
                        <h1 className="text-3xl font-light mb-2 flex items-center gap-2">
                            <Sparkles className="text-[#C5A880] w-6 h-6" /> AI Bridal Consultant
                        </h1>
                        <p className="text-[#1A1A1A]/60">Allow our AI to analyze your facial geometry and recommend bespoke styling packages.</p>
                    </div>

                    <div className="bg-white border border-neutral-100 rounded-2xl p-4 flex-1 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden shadow-sm">
                        
                        {!image && !isProcessing && (
                            <div className="w-full max-w-md flex flex-col items-center">
                                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-black mb-4">
                                    <Webcam 
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-full object-cover"
                                        videoConstraints={{ facingMode: "user" }}
                                    />
                                    {/* Overlay Guide Mask */}
                                    <div className="absolute inset-0 border-[40px] border-black/40 rounded-xl pointer-events-none">
                                        <div className="w-full h-full border-2 border-dashed border-[#C5A880]/50 rounded-full flex items-center justify-center">
                                            <span className="text-white/50 text-xs">Align face here</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 w-full">
                                    <button 
                                        onClick={capture}
                                        className="flex-1 bg-[#1A1A1A] text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1A1A1A]/90 transition-colors"
                                    >
                                        <Camera className="w-4 h-4" /> Capture
                                    </button>
                                    <label className="flex-1 bg-white border border-neutral-200 py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50 transition-colors">
                                        <Upload className="w-4 h-4" /> Upload
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
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
                            <div className="w-full max-w-md h-full flex flex-col">
                                <img src={image} alt="Captured" className="w-full aspect-[3/4] object-cover rounded-xl mb-4" />
                                <div className="bg-[#1A1A1A] text-white p-4 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Detected Shape</p>
                                        <p className="text-xl font-serif text-[#C5A880]">{faceShape}</p>
                                    </div>
                                    <button onClick={() => {setImage(null); setFaceShape(null); setMessages([])}} className="text-xs border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">
                                        Retake
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Chat Interface */}
                {faceShape && (
                    <div className="flex-1 bg-white border border-neutral-100 rounded-2xl flex flex-col shadow-sm h-[600px] lg:h-auto overflow-hidden animate-in fade-in slide-in-from-right-4">
                        <div className="p-4 border-b border-neutral-100 bg-[#FAFAFA]">
                            <h3 className="font-medium text-[#1A1A1A]">Consultation Chat</h3>
                            <p className="text-xs text-[#1A1A1A]/60">Live session with AI Stylist</p>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#1A1A1A] text-white rounded-br-none' : 'bg-[#FAFAFA] border border-neutral-100 text-[#1A1A1A] rounded-bl-none'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#FAFAFA] border border-neutral-100 p-3 rounded-2xl rounded-bl-none text-sm flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-[#1A1A1A]/30 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                        <div className="w-1.5 h-1.5 bg-[#1A1A1A]/30 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                        <div className="w-1.5 h-1.5 bg-[#1A1A1A]/30 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-neutral-100 bg-white">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); sendChatMessage(); }}
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
    )
}
