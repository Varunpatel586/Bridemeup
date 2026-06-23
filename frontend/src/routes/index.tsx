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
    <div className="h-[100dvh] bg-ivory text-plum flex flex-col overflow-hidden">
      <SiteHeader />
      <main className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth overflow-x-hidden">
        <Hero />
        <AIPlannerShowcase />
        <MasonryGallery limit={15} />
        <FeaturedArtists />
        <PackagesSection />
        <SuccessStories />
      </main>
    </div>
  );
}
