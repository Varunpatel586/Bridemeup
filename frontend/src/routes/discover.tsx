import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FeaturedArtists } from "@/components/site/FeaturedArtists";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Artists — ShaadiGlow AI" },
      { name: "description", content: "Browse Delhi's top bridal makeup artists, hairstylists, and mehendi specialists." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-ivory text-plum">
      <SiteHeader />
      <main className="pt-12 pb-8 px-6 max-w-7xl mx-auto">
        <p className="eyebrow text-rosegold mb-3">The Directory</p>
        <h1 className="font-serif italic text-5xl text-plum mb-4">Delhi's finest artists.</h1>
        <p className="text-plum/60 max-w-xl mb-2">
          Full Pinterest-style discovery with filters, AI ranking, and live availability arrives
          in Phase 2.
        </p>
        <Link to="/" className="eyebrow text-plum hover:text-rosegold border-b border-plum/20 pb-1">← Back home</Link>
      </main>
      <FeaturedArtists />
      <SiteFooter />
    </div>
  ),
});
