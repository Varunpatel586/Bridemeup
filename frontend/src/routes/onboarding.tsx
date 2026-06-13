import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Bridal Onboarding — ShaadiGlow AI" },
      { name: "description", content: "Build your Beauty Twin profile in 3 minutes." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-ivory text-plum flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-20">
        <p className="eyebrow text-rosegold mb-3">Beauty Twin AI</p>
        <h1 className="font-serif italic text-4xl text-plum mb-4">Tell us about your day.</h1>
        <p className="text-plum/60 mb-10">
          Coming in Phase 2 — guided onboarding to collect wedding date, budget, skin type, face
          shape, theme, and preferred makeup style.
        </p>
        <Link to="/" className="eyebrow text-plum hover:text-rosegold border-b border-plum/20 pb-1">← Back home</Link>
      </main>
      <SiteFooter />
    </div>
  ),
});
