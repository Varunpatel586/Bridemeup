import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Star, Calendar, Clock, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/stylists/$id")({
  component: StylistProfile,
});

function StylistProfile() {
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [stylist, setStylist] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookingState, setBookingState] = useState<"idle" | "loading" | "success">("idle");

    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Mock dates
    const dates = ["Oct 12", "Oct 13", "Oct 14", "Oct 15", "Oct 16"];
    const morningSlots = ["09:00 AM", "10:30 AM", "11:00 AM"];
    const eveningSlots = ["02:00 PM", "04:30 PM", "06:00 PM"];

    useEffect(() => {
        async function loadStylist() {
            try {
                const { data, error } = await supabase
                    .from('stylists')
                    .select('*, salons(*)')
                    .eq('id', id)
                    .single();
                
                if (error || !data) throw new Error("Not found");
                
                const mappedStylist = {
                    ...data,
                    salon_name: data.salons?.name,
                    packages: data.salons?.packages
                };
                
                setStylist(mappedStylist);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch stylist", err);
                setLoading(false);
            }
        }
        loadStylist();
    }, [id]);

    const handleBooking = () => {
        if (!user) {
            navigate({ to: "/auth", search: { redirect: `/stylists/${id}` } });
            return;
        }

        setBookingState("loading");
        // Simulate a backend call
        setTimeout(() => {
            setBookingState("success");
            setSelectedPackage(null);
            setSelectedDate(null);
            setSelectedTime(null);
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <p className="text-[#C5A880] tracking-widest uppercase text-sm animate-pulse">Loading Stylist...</p>
            </div>
        );
    }

    if (!stylist) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-light mb-4">Stylist Not Found</h1>
                <Link to="/salons" className="text-[#C5A880] hover:underline">Back to Directory</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans">
            <SiteHeader />
            <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column: Profile & Portfolio */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-6 mb-8 border-b border-neutral-100 pb-8">
                            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0">
                                <img src={stylist.profile_image} alt={stylist.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-medium">{stylist.name}</h1>
                                <p className="text-[#C5A880] mb-2">{stylist.salon_name}</p>
                                <div className="flex gap-4 text-sm text-[#1A1A1A]/70">
                                    {Object.entries(stylist.domain_ratings || {}).slice(0,3).map(([domain, rating]: any) => (
                                        <div key={domain} className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-[#1A1A1A]" />
                                            <span>{rating} {domain}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Portfolio Grid */}
                        <h2 className="text-xl font-medium mb-6">Recent Work</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {stylist.portfolio_images?.map((img: string, idx: number) => (
                                <div key={idx} className="aspect-[4/5] rounded-lg overflow-hidden">
                                    <img src={img} alt={`Work ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Booking Engine */}
                    <div className="lg:col-span-5">
                        <div className="bg-white border border-neutral-100 rounded-2xl p-6 sticky top-24 shadow-sm">
                            <h2 className="text-2xl font-light mb-6">Book an Appointment</h2>
                            
                            {/* Packages */}
                            <div className="mb-8">
                                <h3 className="text-sm font-medium uppercase tracking-widest text-[#C5A880] mb-4">Select Package</h3>
                                <div className="space-y-3">
                                    {stylist.packages?.map((pkg: any) => (
                                        <div 
                                            key={pkg.id} 
                                            onClick={() => setSelectedPackage(pkg.id)}
                                            className={`border rounded-xl p-4 cursor-pointer transition-colors ${selectedPackage === pkg.id ? 'border-[#1A1A1A] bg-[#FAFAFA]' : 'border-neutral-100 hover:border-neutral-300'}`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-medium flex items-center gap-2">
                                                    {pkg.name}
                                                    {selectedPackage === pkg.id && <Check className="w-4 h-4 text-[#C5A880]" />}
                                                </h4>
                                                <span className="font-serif">₹{pkg.price.toLocaleString()}</span>
                                            </div>
                                            <p className="text-xs text-[#1A1A1A]/60">{pkg.services.join(" • ")}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Calendar & Time */}
                            <div className="mb-8">
                                <h3 className="text-sm font-medium uppercase tracking-widest text-[#C5A880] mb-4 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Date & Time
                                </h3>
                                
                                {/* Date track */}
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
                                    {dates.map((date) => (
                                        <button 
                                            key={date}
                                            onClick={() => setSelectedDate(date)}
                                            className={`shrink-0 px-4 py-2 rounded-full text-sm transition-colors ${selectedDate === date ? 'bg-[#1A1A1A] text-white' : 'bg-[#FAFAFA] border border-neutral-100 hover:border-neutral-300'}`}
                                        >
                                            {date}
                                        </button>
                                    ))}
                                </div>

                                {/* Time Chips */}
                                {selectedDate && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <p className="text-xs text-[#1A1A1A]/60 mb-2 flex items-center gap-1"><Clock className="w-3 h-3"/> Morning</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {morningSlots.map((time) => (
                                                <button 
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`px-3 py-1.5 rounded-md text-xs transition-colors ${selectedTime === time ? 'bg-[#C5A880] text-white' : 'bg-white border border-neutral-200 hover:border-[#C5A880]'}`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-[#1A1A1A]/60 mb-2 flex items-center gap-1"><Clock className="w-3 h-3"/> Afternoon / Evening</p>
                                        <div className="flex flex-wrap gap-2">
                                            {eveningSlots.map((time) => (
                                                <button 
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`px-3 py-1.5 rounded-md text-xs transition-colors ${selectedTime === time ? 'bg-[#C5A880] text-white' : 'bg-white border border-neutral-200 hover:border-[#C5A880]'}`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {bookingState === "success" && (
                                <div className="mb-4 p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm">
                                    Your booking request has been sent successfully! Our team will contact you shortly to confirm.
                                </div>
                            )}

                            <button 
                                onClick={handleBooking}
                                disabled={!selectedPackage || !selectedDate || !selectedTime || bookingState === "loading"}
                                className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1A1A1A]/90 transition-colors"
                            >
                                {bookingState === "loading" ? "Processing..." : "Request Booking"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
