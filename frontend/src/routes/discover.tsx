import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FeaturedArtists } from "@/components/site/FeaturedArtists";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Artists — ShaadiGlow AI" },
      {
        name: "description",
        content: "Browse Delhi's top bridal makeup artists, hairstylists, and mehendi specialists.",
      },
    ],
  }),
  component: () => (
    <div className="min-h-[100dvh] bg-ivory text-plum flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-0">
        <FeaturedArtists />
      </main>
      <SiteFooter />
    </div>
  ),
});
