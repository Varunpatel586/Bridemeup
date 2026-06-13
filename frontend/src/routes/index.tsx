import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Hero } from "@/components/site/Hero";
import { AIPlannerShowcase } from "@/components/site/AIPlannerShowcase";
import { MasonryGallery } from "@/components/site/MasonryGallery";
import { FeaturedArtists } from "@/components/site/FeaturedArtists";
import { PackagesSection } from "@/components/site/PackagesSection";
import { SuccessStories } from "@/components/site/SuccessStories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShaadiGlow AI — Your AI Bridal Beauty Planner" },
      {
        name: "description",
        content:
          "Delhi's AI-powered bridal beauty concierge. Discover artists, plan your wedding beauty timeline, and book your dream glam team.",
      },
      { property: "og:title", content: "ShaadiGlow AI — Your AI Bridal Beauty Planner" },
      {
        property: "og:description",
        content:
          "Discover artists, plan your wedding beauty timeline, and book your dream glam team — all orchestrated by AI.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-ivory text-plum">
      <SiteHeader />
      <main>
        <Hero />
        <AIPlannerShowcase />
        <MasonryGallery limit={15} />
        <FeaturedArtists />
        <PackagesSection />
        <SuccessStories />
      </main>
      <SiteFooter />
    </div>
  );
}
