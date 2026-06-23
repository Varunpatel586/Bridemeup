import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";
import { Calendar, FileText, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [weddingPlans, setWeddingPlans] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    import("@/lib/supabase").then(async ({ supabase }) => {
      // Fetch appointments
      const { data: aptData, error: aptError } = await supabase
        .from("appointments")
        .select(
          `
          *,
          salons (name, address),
          stylists (name, role)
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
      <main className="flex-1 pt-24 pb-16 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-light mb-2">Welcome back.</h1>
          <p className="text-[#1A1A1A]/60">
            Manage your upcoming bridal appointments and view your saved neural wedding plans.
          </p>
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
                      <span
                        className={`text-xs px-3 py-1 rounded-full uppercase tracking-widest ${apt.status === "pending" ? "bg-orange-50 text-orange-700" : "bg-green-50 text-green-700"}`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C5A880]" />
                        {new Date(apt.appointment_date).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 text-[#1A1A1A]/70">
                        <span>
                          Stylist: <strong className="text-[#1A1A1A]">{apt.stylists?.name}</strong>{" "}
                          ({apt.stylists?.role})
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
