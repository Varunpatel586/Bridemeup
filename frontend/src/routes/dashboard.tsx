import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";
import { Calendar, FileText, Clock, User, Save, LogOut, X } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [weddingPlans, setWeddingPlans] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    if (user.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }

    import("@/lib/supabase").then(async ({ supabase }) => {
      // Fetch appointments
      const { data: aptData, error: aptError } = await supabase
        .from("appointments")
        .select(
          `
          *,
          salons (name, address),
          stylists (name)
        `,
        )
        .order("appointment_date", { ascending: true });

      if (aptError) console.error("Error fetching appointments:", aptError);
      else setAppointments(aptData || []);

      // Fetch wedding plans
      const { data: plansData, error: plansError } = await supabase
        .from("wedding_plans")
        .select("*")
        .order("created_at", { ascending: false });

      if (plansError) console.error("Error fetching wedding plans:", plansError);
      else setWeddingPlans(plansData || []);

      setDataLoading(false);
    });
  }, [user]);

  const handleUpdateProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (error) throw error;
      setMessage("Profile updated successfully.");
    } catch (e) {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase.auth.signOut();
      navigate({ to: "/" });
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    } catch (e) {
      console.error("Failed to cancel appointment", e);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-[100dvh] bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[#C5A880] tracking-widest uppercase text-sm animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[100dvh] bg-[#FAFAFA] flex items-center justify-center flex-col">
        <h1 className="text-2xl font-light mb-4">Please Sign In</h1>
        <p className="text-[#1A1A1A]/60">You must be signed in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] text-[#1A1A1A] font-sans flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-5 pb-16 px-6 max-w-7xl mx-auto w-full h-full">
        {/* Profile Section */}
        <div className="mb-16 bg-white text-[#1A1A1A] border border-neutral-100 rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-12 items-center justify-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="flex flex-col items-center text-center md:w-1/3 relative z-10">
            <div className="w-28 h-28 bg-[#C5A880]/10 border border-[#C5A880]/20 rounded-full flex items-center justify-center shrink-0 mb-5">
              <User className="w-12 h-12 text-[#C5A880]" />
            </div>
            <div>
              <h1 className="text-4xl font-serif italic text-pretty leading-tight">{user.user_metadata?.full_name || 'Your Profile'}</h1>
              <p className="text-sm text-[#1A1A1A]/60 mt-2 tracking-wide">{user.email}</p>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl space-y-6 relative z-10 bg-neutral-50/50 p-8 rounded-3xl border border-neutral-100">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#1A1A1A]/70 mb-3 font-medium">Display Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-white border border-neutral-200 text-[#1A1A1A] rounded-xl px-5 py-4 outline-none focus:border-[#C5A880] transition-all placeholder:text-[#1A1A1A]/30 shadow-sm"
              />
            </div>

            {message && (
              <p className={`text-sm ${message.includes("Failed") ? "text-red-500" : "text-green-600"}`}>
                {message}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="flex-1 bg-[#1A1A1A] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1A1A1A]/90 transition-all disabled:opacity-50 shadow-sm"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Update Profile"}
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 border border-red-200 text-red-600 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Appointments Section */}
          <div>
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-2 border-b border-neutral-200 pb-3">
              <Calendar className="w-5 h-5 text-[#C5A880]" /> Your Appointments
            </h2>

            {appointments.length === 0 ? (
              <div className="bg-white border border-neutral-100 rounded-xl p-8 text-center text-[#1A1A1A]/50">
                <p>No upcoming appointments found.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-lg">{apt.salons?.name}</h3>
                        <p className="text-sm text-[#1A1A1A]/60">{apt.salons?.address}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`text-xs px-3 py-1 rounded-full uppercase tracking-widest ${apt.status === "pending" ? "bg-orange-50 text-orange-700" : "bg-green-50 text-green-700"}`}
                        >
                          {apt.status}
                        </span>
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="text-[10px] uppercase tracking-widest font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C5A880]" />
                        {new Date(apt.appointment_date).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 text-[#1A1A1A]/70">
                        <span>
                          Stylist: <strong className="text-[#1A1A1A]">{apt.stylists?.name}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wedding Plans Section */}
          <div>
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-2 border-b border-neutral-200 pb-3">
              <FileText className="w-5 h-5 text-[#C5A880]" /> Saved Wedding Plans
            </h2>

            {weddingPlans.length === 0 ? (
              <div className="bg-white border border-neutral-100 rounded-xl p-8 text-center text-[#1A1A1A]/50">
                <p>No saved wedding plans yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {weddingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm"
                  >
                    <p className="text-xs text-[#1A1A1A]/40 mb-3">
                      Saved on {new Date(plan.created_at).toLocaleDateString()}
                    </p>
                    <div className="text-sm text-[#1A1A1A]/80 whitespace-pre-wrap line-clamp-6">
                      {plan.plan_data.content}
                    </div>
                    <button className="mt-4 text-xs font-medium text-[#C5A880] uppercase tracking-widest hover:underline">
                      View Full Plan
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
