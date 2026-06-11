import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

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
  return (
    <div className="min-h-screen bg-ivory text-plum flex flex-col">
      <SiteHeader />
      <main className="flex-1 grid place-items-center px-6 py-20">
        <div className="w-full max-w-md bg-white rounded-3xl border border-plum/5 shadow-luxe p-10 text-center">
          <p className="eyebrow text-rosegold mb-3">Concierge Access</p>
          <h1 className="font-serif italic text-3xl text-plum mb-3">
            Welcome to your bridal suite.
          </h1>
          <p className="text-plum/60 mb-8 text-sm leading-relaxed">
            Sign-in coming in Phase 2. For now, explore your bridal journey.
          </p>
          <Link
            to="/onboarding"
            className="block w-full py-3 bg-plum text-ivory rounded-full eyebrow hover:bg-plum-light transition-all"
          >
            Continue as Bride →
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
