import { createFileRoute, Link, useRouter, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner"; // Assuming sonner is available based on package.json

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — ShaadiGlow AI" },
      { name: "description", content: "Sign in or create your ShaadiGlow account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = Route.useSearch() as { redirect?: string };
  const redirectUrl = search.redirect || "/";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // User created, Supabase might automatically sign them in or require email verification.
        // Assuming auto sign-in for this flow:
        navigate({ to: redirectUrl as any });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate({ to: redirectUrl as any });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-ivory text-plum flex flex-col">
      <SiteHeader />
      <main className="flex-1 grid place-items-center px-6 py-20">
        <div className="w-full max-w-md bg-white rounded-3xl border border-plum/5 shadow-luxe p-10">
          <div className="text-center mb-8">
            <p className="eyebrow text-rosegold mb-3">Concierge Access</p>
            <h1 className="font-serif italic text-3xl text-plum mb-3">
              {isSignUp ? "Begin your journey." : "Welcome back."}
            </h1>
            <p className="text-plum/60 text-sm leading-relaxed">
              {isSignUp
                ? "Create an account to save your favorite artists and plan your timeline."
                : "Sign in to access your bridal planner and saved artists."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-plum mb-1 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-plum/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-plum text-sm"
                placeholder="bride@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-plum mb-1 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-plum/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-plum text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-plum text-ivory rounded-xl font-semibold uppercase tracking-widest text-sm hover:bg-plum-light transition-all disabled:opacity-70 mt-4"
            >
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-plum/60 hover:text-plum transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
