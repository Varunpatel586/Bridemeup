import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Star, Calendar, Clock, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";

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
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

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
          .from("stylists")
          .select("*, salons(*)")
          .eq("id", id)
          .single();

        if (error || !data) throw new Error("Not found");

        const { data: reviewsData } = await supabase
          .from("stylist_reviews")
          .select("*")
          .eq("stylist_id", id)
          .order("created_at", { ascending: false });

        setReviews(reviewsData || []);

        const mappedStylist = {
          ...data,
          salon_name: data.salons?.name,
          packages: data.salons?.packages,
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

  const handleBooking = async () => {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: `/stylists/${id}` } });
      return;
    }

    if (!selectedDate || !selectedTime) return;

    setBookingState("loading");

    try {
      // Parse date and time into a single Date object
      // Just using the year 2026 as placeholder for the mock dates
      const currentYear = new Date().getFullYear();
      const dateStr = `${selectedDate}, ${currentYear} ${selectedTime}`;
      const appointmentDate = new Date(dateStr);

      const { error } = await supabase.from("appointments").insert({
        user_id: user.id,
        salon_id: stylist.salon_id,
        stylist_id: stylist.id,
        appointment_date: appointmentDate.toISOString(),
        status: "pending",
      });

      if (error) throw error;

      setBookingState("success");
      setTimeout(() => {
        setBookingState("idle");
        setSelectedPackage(null);
        setSelectedDate(null);
        setSelectedTime(null);
      }, 3000);
    } catch (error) {
      console.error("Booking failed", error);
      alert("Failed to book appointment.");
      setBookingState("idle");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate({ to: "/auth", search: { redirect: `/stylists/${id}` } });
      return;
    }
    if (!comment.trim()) return;

    // Determine the best display name to use
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "Verified User";

    setSubmittingReview(true);
    try {
      const { data, error } = await supabase.from("stylist_reviews").insert({
        stylist_id: stylist.id,
        user_id: user.id,
        user_name: displayName,
        rating,
        comment,
      }).select().single();

      if (error) throw error;

      setReviews([data, ...reviews]);
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Failed to submit review", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[#C5A880] tracking-widest uppercase text-sm animate-pulse">
          Loading Stylist...
        </p>
      </div>
    );
  }

  if (!stylist) {
    return (
      <div className="min-h-[100dvh] bg-[#FAFAFA] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-light mb-4">Stylist Not Found</h1>
        <Link to="/salons" className="text-[#C5A880] hover:underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] text-[#1A1A1A] font-sans">
      <SiteHeader />
      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Profile & Portfolio */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-6 mb-8 border-b border-neutral-100 pb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden shrink-0">
                <img
                  src={stylist.profile_image}
                  alt={stylist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-medium">{stylist.name}</h1>
                <p className="text-[#C5A880] mb-2">{stylist.salon_name}</p>
                <div className="flex gap-4 text-sm text-[#1A1A1A]/70 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-[#C5A880] text-[#C5A880]" />
                    {reviews.length > 0 ? (
                      <span>
                        <strong className="text-[#1A1A1A]">
                          {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)}
                        </strong>{" "}
                        ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                      </span>
                    ) : (
                      <span>No reviews yet</span>
                    )}
                  </div>
                </div>
                {stylist.about && (
                  <p className="text-[#1A1A1A]/80 leading-relaxed text-sm">
                    {stylist.about}
                  </p>
                )}
              </div>
            </div>

            {/* Portfolio Grid */}
            <h2 className="text-xl font-medium mb-6">Recent Work</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stylist.portfolio_images?.map((img: string, idx: number) => (
                <div key={idx} className="aspect-[4/5] rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`Work ${idx}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            {/* Reviews Section */}
            <div className="mt-16 border-t border-neutral-100 pt-12">
              <h2 className="text-2xl font-light mb-8">Client Reviews</h2>
              
              {/* Review Form */}
              <div className="bg-white border border-neutral-100 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-medium mb-4">Leave a Review</h3>
                {!user ? (
                  <p className="text-[#1A1A1A]/60 text-sm">
                    Please <Link to="/auth" className="text-[#C5A880] hover:underline">sign in</Link> to leave a review.
                  </p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star className={`w-6 h-6 ${star <= rating ? "fill-[#C5A880] text-[#C5A880]" : "text-neutral-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Comment</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this artist..."
                        className="w-full border border-neutral-200 rounded-lg p-3 outline-none focus:border-[#C5A880] min-h-[100px] resize-y"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview || !comment.trim()}
                      className="bg-[#1A1A1A] text-white px-6 py-3 rounded-lg w-fit disabled:opacity-50 hover:bg-[#1A1A1A]/90 transition-colors"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-[#1A1A1A]/60 text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-100 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-medium uppercase">
                            {(review.user_name || "V").charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{review.user_name || "Verified User"}</p>
                            <p className="text-xs text-[#1A1A1A]/50">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${star <= review.rating ? "fill-[#C5A880] text-[#C5A880]" : "text-neutral-200"}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#1A1A1A]/80 mt-3">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Engine */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 sticky top-24 shadow-sm">
              <h2 className="text-2xl font-light mb-6">Book an Appointment</h2>

              {/* Packages */}
              <div className="mb-8">
                <h3 className="text-sm font-medium uppercase tracking-widest text-[#C5A880] mb-4">
                  Select Package
                </h3>
                <div className="space-y-3">
                  {stylist.packages?.map((pkg: any) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`border rounded-xl p-4 cursor-pointer transition-colors ${selectedPackage === pkg.id ? "border-[#1A1A1A] bg-[#FAFAFA]" : "border-neutral-100 hover:border-neutral-300"}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium flex items-center gap-2">
                          {pkg.name}
                          {selectedPackage === pkg.id && (
                            <Check className="w-4 h-4 text-[#C5A880]" />
                          )}
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
                      className={`shrink-0 px-4 py-2 rounded-full text-sm transition-colors ${selectedDate === date ? "bg-[#1A1A1A] text-white" : "bg-[#FAFAFA] border border-neutral-100 hover:border-neutral-300"}`}
                    >
                      {date}
                    </button>
                  ))}
                </div>

                {/* Time Chips */}
                {selectedDate && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs text-[#1A1A1A]/60 mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Morning
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {morningSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-1.5 rounded-md text-xs transition-colors ${selectedTime === time ? "bg-[#C5A880] text-white" : "bg-white border border-neutral-200 hover:border-[#C5A880]"}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-[#1A1A1A]/60 mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Afternoon / Evening
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {eveningSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-1.5 rounded-md text-xs transition-colors ${selectedTime === time ? "bg-[#C5A880] text-white" : "bg-white border border-neutral-200 hover:border-[#C5A880]"}`}
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
                  Your booking request has been sent successfully! Our team will contact you shortly
                  to confirm.
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || bookingState === "loading"}
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
  );
}
