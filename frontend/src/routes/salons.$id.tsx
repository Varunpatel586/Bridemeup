import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Star, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

export const Route = createFileRoute("/salons/$id")({
  component: SalonDetail,
});

// Mock detailed data
const MOCK_SALON = {
    id: "salon-1",
    name: "Lumière Artistry",
    address: "South Extension II, New Delhi",
    phone: "+91 9876543210",
    email: "contact@lumiere.in",
    rating: 4.9,
    reviews_count: 342,
    images: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000"],
    cosmetic_brands: [
        {"brand": "Chanel", "category": "Base Makeup", "image_url": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200"},
        {"brand": "Dior", "category": "Lips", "image_url": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=200"}
    ],
    stylists: [
        { id: "stylist-1", name: "Anya Sharma", role: "Master Bridal Artist", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=500" },
        { id: "stylist-2", name: "Kabir Singh", role: "Senior Hairstylist", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500" }
    ]
};

function SalonDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [bookingStylist, setBookingStylist] = useState<any>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.from("salons")
        .select("*, stylists(*)")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Failed to fetch salon", error);
            setSalon(null);
          } else {
            setSalon(data);
          }
          setLoading(false);
        });
    });
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        alert("Please sign in to book an appointment.");
        return;
    }
    if (!appointmentDate || !bookingStylist) return;
    setIsSubmitting(true);
    
    try {
        const { supabase } = await import("@/lib/supabase");
        const { error } = await supabase.from("appointments").insert({
            user_id: user.id,
            salon_id: salon.id,
            stylist_id: bookingStylist.id,
            appointment_date: new Date(appointmentDate).toISOString(),
            status: "pending"
        });
        if (error) throw error;
        setBookingSuccess(true);
        setTimeout(() => {
            setBookingSuccess(false);
            setBookingStylist(null);
        }, 3000);
    } catch (error) {
        console.error("Booking failed", error);
        alert("Failed to book appointment. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[#C5A880] tracking-widest uppercase text-sm animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-light mb-4">Salon Not Found</h1>
        <Link to="/salons" className="text-[#C5A880] hover:underline">Back to Directory</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans">
      <SiteHeader />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="px-6 max-w-7xl mx-auto mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <p className="text-sm font-medium text-[#C5A880] tracking-widest uppercase mb-4">Salon Profile</p>
                    <h1 className="text-4xl md:text-6xl font-light mb-6">{salon.name}</h1>
                    <div className="flex flex-col gap-3 text-[#1A1A1A]/70 mb-8">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-[#C5A880]" />
                            <span>{salon.address}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-[#C5A880]" />
                            <span>{salon.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#C5A880]" />
                            <span>{salon.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Star className="w-5 h-5 fill-[#C5A880] text-[#C5A880]" />
                            <span>{salon.rating} out of 5 ({salon.reviews_count} reviews)</span>
                        </div>
                    </div>
                </div>
                <div className="order-1 lg:order-2 rounded-2xl overflow-hidden aspect-video shadow-lg">
                    <img src={salon.images[0]} alt={salon.name} className="w-full h-full object-cover" />
                </div>
            </div>
        </div>

        {/* Cosmetic Brands Section */}
        <div className="bg-white py-16 border-y border-neutral-100">
            <div className="px-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-light mb-10 text-center">Featured Luxury Brands</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {salon.cosmetic_brands.map((brand, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border border-neutral-100">
                                <img src={brand.image_url} alt={brand.brand} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                            </div>
                            <h3 className="font-medium text-lg">{brand.brand}</h3>
                            <p className="text-sm text-[#1A1A1A]/60">{brand.category}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Stylists Rail */}
        <div className="px-6 max-w-7xl mx-auto py-16">
            <h2 className="text-2xl font-light mb-8">Meet the Artists</h2>
            <div className="overflow-x-auto flex gap-6 pb-8 scrollbar-none snap-x">
                {salon.stylists.map((stylist) => (
                    <Link 
                        key={stylist.id} 
                        to={`/stylists/$id`}
                        params={{ id: stylist.id }}
                        className="min-w-[280px] snap-start group"
                    >
                        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4">
                            <img src={stylist.image} alt={stylist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 className="text-xl font-medium">{stylist.name}</h3>
                        <p className="text-[#C5A880] mb-3">{stylist.role || 'Stylist'}</p>
                        <button 
                            onClick={(e) => { e.preventDefault(); setBookingStylist(stylist); }}
                            className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-sm w-full hover:bg-[#C5A880] transition-colors"
                        >
                            Book Appointment
                        </button>
                    </Link>
                ))}
            </div>
        </div>

        {/* Booking Modal */}
        {bookingStylist && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95">
                    <button 
                        onClick={() => setBookingStylist(null)}
                        className="absolute top-4 right-4 text-neutral-400 hover:text-[#1A1A1A]"
                    >
                        ✕
                    </button>
                    <h3 className="text-2xl font-light mb-2">Book Appointment</h3>
                    <p className="text-[#1A1A1A]/60 mb-6">Schedule a session with <strong className="text-[#1A1A1A]">{bookingStylist.name}</strong> at {salon.name}.</p>
                    
                    {bookingSuccess ? (
                        <div className="bg-green-50 text-green-800 p-4 rounded-xl text-center">
                            <p className="font-medium">Booking Confirmed!</p>
                            <p className="text-sm mt-1">We'll see you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleBooking} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Select Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    required
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    className="w-full border border-neutral-200 rounded-lg p-3 outline-none focus:border-[#C5A880]"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg flex items-center justify-center gap-2 mt-2 hover:bg-[#C5A880] transition-colors disabled:opacity-50"
                            >
                                <Calendar className="w-4 h-4" /> {isSubmitting ? "Booking..." : "Confirm Booking"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
