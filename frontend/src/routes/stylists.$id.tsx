import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Star, Calendar, Clock, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/stylists/$id")({
  component: StylistProfile,
});

const MOCK_STYLIST = {
    id: "stylist-1",
    name: "Anya Sharma",
    salon_name: "Lumière Artistry",
    profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=500",
    domain_ratings: {"Hair": 4.9, "Pedicure": 4.5, "Facials": 4.8, "DeTan": 4.7, "CleanUp": 4.9},
    portfolio_images: [
        "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&q=80&w=500",
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=500",
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=500"
    ],
    packages: [
        { id: "pkg_1", name: "Silver Elegance", price: 15000, services: ["HD Makeup", "Basic Hairstyling", "Draping"] },
        { id: "pkg_2", name: "Gold Radiance", price: 25000, services: ["Airbrush Makeup", "Premium Hairstyling", "Draping", "Lashes"] },
        { id: "pkg_3", name: "Diamond Signature", price: 40000, services: ["HD Airbrush", "Extensions", "Pre-bridal Consultation", "Trial"] },
    ]
};

function StylistProfile() {
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Mock dates
    const dates = ["Oct 12", "Oct 13", "Oct 14", "Oct 15", "Oct 16"];
    const morningSlots = ["09:00 AM", "10:30 AM", "11:00 AM"];
    const eveningSlots = ["02:00 PM", "04:30 PM", "06:00 PM"];

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans">
            <SiteHeader />
            <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column: Profile & Portfolio */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-6 mb-8 border-b border-neutral-100 pb-8">
                            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0">
                                <img src={MOCK_STYLIST.profile_image} alt={MOCK_STYLIST.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-medium">{MOCK_STYLIST.name}</h1>
                                <p className="text-[#C5A880] mb-2">{MOCK_STYLIST.salon_name}</p>
                                <div className="flex gap-4 text-sm text-[#1A1A1A]/70">
                                    {Object.entries(MOCK_STYLIST.domain_ratings).slice(0,3).map(([domain, rating]) => (
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
                            {MOCK_STYLIST.portfolio_images.map((img, idx) => (
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
                                    {MOCK_STYLIST.packages.map((pkg) => (
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

                            <button 
                                disabled={!selectedPackage || !selectedDate || !selectedTime}
                                className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1A1A1A]/90 transition-colors"
                            >
                                Request Booking
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
