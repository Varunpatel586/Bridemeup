import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";
import { LogOut, User, Mail, Save } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth", search: { redirect: "/profile" } });
    }
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[100dvh] bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[#C5A880] tracking-widest uppercase text-sm animate-pulse">
          Authenticating...
        </p>
      </div>
    );
  }

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

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] text-[#1A1A1A] font-sans flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-24 pb-16 px-6 max-w-xl mx-auto w-full">
        <div className="bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#C5A880]/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[#C5A880]" />
            </div>
            <div>
              <h1 className="text-2xl font-light">Your Profile</h1>
              <p className="text-sm text-[#1A1A1A]/60">Manage your account details</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
              <Mail className="w-5 h-5 text-[#C5A880]" />
              <div>
                <p className="text-xs text-[#1A1A1A]/50 uppercase tracking-wider">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-[#C5A880] transition-colors"
              />
            </div>

            {message && (
              <p
                className={`text-sm ${message.includes("Failed") ? "text-red-600" : "text-green-600"}`}
              >
                {message}
              </p>
            )}

            <button
              onClick={handleUpdateProfile}
              disabled={saving}
              className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1A1A1A]/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
            </button>

            <div className="pt-4 border-t border-neutral-100">
              <button
                onClick={handleLogout}
                className="w-full border border-red-200 text-red-600 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
