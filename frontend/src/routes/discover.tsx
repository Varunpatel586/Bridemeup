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
    <div className="min-h-[100dvh] bg-ivory text-plum">
      <SiteHeader />
      <FeaturedArtists />
      <SiteFooter />
    </div>
  ),
});
